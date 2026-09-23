import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {
  db, now, newId, FILES_DIR, DATA_DIR, DB_PATH, getSettings, saveSettings, mapPrompt, mapProject, mapFile,
  getRecord, hydrateRecord, writeRecordChildren, transaction,
} from './db.js';
import {
  listModels, resolveModel, providerName, normaliseEndpoint, buildSystemPrompt, imagePart, streamCompletion,
  completeJson, friendlyError,
} from './llm.js';

export const api = express.Router();
api.use(express.json({ limit: '5mb' }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ---------- settings / status ----------
api.get('/settings', (req, res) => res.json(getSettings()));
api.patch('/settings', (req, res) => res.json(saveSettings(req.body || {})));

api.get('/status', wrap(async (req, res) => {
  const s = getSettings();
  const provider = providerName(s.endpoint);
  try {
    const models = await listModels(s.endpoint);
    const model = s.feedbackModel || models[0] || '';
    res.json({ online: true, provider, model, models, endpoint: normaliseEndpoint(s.endpoint) });
  } catch (e) {
    res.json({ online: false, provider, model: s.feedbackModel, models: [], endpoint: normaliseEndpoint(s.endpoint), error: friendlyError(e) });
  }
}));

api.get('/models', wrap(async (req, res) => {
  const endpoint = req.query.endpoint || getSettings().endpoint;
  try {
    res.json({ models: await listModels(endpoint) });
  } catch (e) {
    res.status(502).json({ error: friendlyError(e), models: [] });
  }
}));

api.post('/models/test', wrap(async (req, res) => {
  const { endpoint, models: wanted = [] } = req.body || {};
  const started = Date.now();
  try {
    const models = await listModels(endpoint);
    const missing = wanted.filter((m) => m && !models.includes(m));
    res.json({
      ok: missing.length === 0,
      provider: providerName(endpoint),
      latencyMs: Date.now() - started,
      models,
      missing,
      message: missing.length
        ? `Connected, but ${missing.length === 1 ? 'this model is' : 'these models are'} not available: ${missing.join(', ')}`
        : `Connected to ${providerName(endpoint)} · ${models.length} model${models.length === 1 ? '' : 's'} available`,
    });
  } catch (e) {
    res.json({ ok: false, provider: providerName(endpoint), message: friendlyError(e), models: [], missing: [] });
  }
}));

api.get('/storage', (req, res) => {
  const count = (sql) => db.prepare(sql).get().n;
  let filesBytes = 0;
  for (const f of fs.readdirSync(FILES_DIR)) {
    try { filesBytes += fs.statSync(path.join(FILES_DIR, f)).size; } catch { /* ignore */ }
  }
  let dbBytes = 0;
  for (const f of [DB_PATH, DB_PATH + '-wal']) {
    try { dbBytes += fs.statSync(f).size; } catch { /* ignore */ }
  }
  res.json({
    dataDir: DATA_DIR,
    databasePath: DB_PATH,
    filesDir: FILES_DIR,
    feedback: count("SELECT COUNT(*) n FROM records WHERE kind = 'feedback'"),
    comparisons: count("SELECT COUNT(*) n FROM records WHERE kind = 'compare'"),
    projects: count('SELECT COUNT(*) n FROM projects'),
    prompts: count('SELECT COUNT(*) n FROM prompts'),
    files: count('SELECT COUNT(*) n FROM files'),
    filesBytes,
    dbBytes,
  });
});

// ---------- files ----------
const rawBody = express.raw({ type: () => true, limit: '200mb' });

api.post('/files', rawBody, (req, res) => {
  if (!req.body || !req.body.length) return res.status(400).json({ error: 'Source could not be read.' });
  const id = newId();
  const filename = decodeURIComponent(String(req.get('x-filename') || 'source'));
  const mime = req.get('content-type') || 'application/octet-stream';
  fs.writeFileSync(path.join(FILES_DIR, id), req.body);
  db.prepare('INSERT INTO files (id, filename, mime, size, has_preview, created_at) VALUES (?, ?, ?, ?, 0, ?)')
    .run(id, filename, mime, req.body.length, now());
  res.json(mapFile(db.prepare('SELECT * FROM files WHERE id = ?').get(id)));
});

api.post('/files/:id/preview', rawBody, (req, res) => {
  const row = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  fs.writeFileSync(path.join(FILES_DIR, `${row.id}.preview.jpg`), req.body);
  db.prepare('UPDATE files SET has_preview = 1 WHERE id = ?').run(row.id);
  res.json({ ok: true });
});

export function serveFile(req, res) {
  const row = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).end();
  const preview = req.params.variant === 'preview' && row.has_preview;
  const p = preview ? path.join(FILES_DIR, `${row.id}.preview.jpg`) : path.join(FILES_DIR, row.id);
  res.setHeader('Content-Type', preview ? 'image/jpeg' : row.mime);
  res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
  fs.createReadStream(p).on('error', () => res.status(404).end()).pipe(res);
}

// ---------- prompts ----------
api.get('/prompts', (req, res) => {
  res.json(db.prepare('SELECT * FROM prompts ORDER BY sort, created_at').all().map(mapPrompt));
});

api.post('/prompts', (req, res) => {
  const p = req.body || {};
  if (!String(p.name || '').trim()) return res.status(400).json({ error: 'A prompt needs a name.' });
  const id = newId();
  const t = now();
  const sort = (db.prepare('SELECT MAX(sort) m FROM prompts').get().m ?? -1) + 1;
  db.prepare(`INSERT INTO prompts (id, name, category, use_type, description, body, system_note, archived, sort, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, p.name.trim(), p.category || 'General', p.useType || 'Feedback', p.description || '', p.body || '', p.systemNote || '', p.archived ? 1 : 0, sort, t, t);
  res.json(mapPrompt(db.prepare('SELECT * FROM prompts WHERE id = ?').get(id)));
});

api.patch('/prompts/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Prompt not found.' });
  const p = { ...mapPrompt(row), ...(req.body || {}) };
  if (!String(p.name || '').trim()) return res.status(400).json({ error: 'A prompt needs a name.' });
  db.prepare(`UPDATE prompts SET name = ?, category = ?, use_type = ?, description = ?, body = ?, system_note = ?, archived = ?, updated_at = ? WHERE id = ?`)
    .run(p.name.trim(), p.category, p.useType, p.description, p.body, p.systemNote, p.archived ? 1 : 0, now(), row.id);
  res.json(mapPrompt(db.prepare('SELECT * FROM prompts WHERE id = ?').get(row.id)));
});

// ---------- projects ----------
function projectWithCounts(r) {
  const p = mapProject(r);
  const c = db.prepare(`SELECT
      SUM(CASE WHEN kind = 'feedback' THEN 1 ELSE 0 END) f,
      SUM(CASE WHEN kind = 'compare' THEN 1 ELSE 0 END) c
    FROM records WHERE project_id = ?`).get(r.id);
  p.feedbackCount = c.f || 0;
  p.compareCount = c.c || 0;
  return p;
}

api.get('/projects', (req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all().map(projectWithCounts));
});

api.get('/projects/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!r) return res.status(404).json({ error: 'Project not found.' });
  const p = projectWithCounts(r);
  p.records = db.prepare('SELECT * FROM records WHERE project_id = ? ORDER BY created_at DESC').all(r.id).map((x) => hydrateRecord(x));
  res.json(p);
});

api.post('/projects', (req, res) => {
  const p = req.body || {};
  if (!String(p.title || '').trim()) return res.status(400).json({ error: 'A project needs a title.' });
  const id = newId();
  const t = now();
  db.prepare('INSERT INTO projects (id, title, type, description, notes, favourite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)')
    .run(id, p.title.trim(), p.type || 'Photography', p.description || '', p.notes || '', t, t);
  res.json(projectWithCounts(db.prepare('SELECT * FROM projects WHERE id = ?').get(id)));
});

api.patch('/projects/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Project not found.' });
  const p = { ...mapProject(row), ...(req.body || {}) };
  if (!String(p.title || '').trim()) return res.status(400).json({ error: 'A project needs a title.' });
  db.prepare('UPDATE projects SET title = ?, type = ?, description = ?, notes = ?, favourite = ?, updated_at = ? WHERE id = ?')
    .run(p.title.trim(), p.type, p.description, p.notes, p.favourite ? 1 : 0, now(), row.id);
  res.json(projectWithCounts(db.prepare('SELECT * FROM projects WHERE id = ?').get(row.id)));
});

api.delete('/projects/:id', (req, res) => {
  // Linked records stay in their libraries; only the relationship is removed.
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- records ----------
api.get('/records', (req, res) => {
  const where = [];
  const args = [];
  if (req.query.kind) { where.push('kind = ?'); args.push(req.query.kind); }
  if (req.query.sourceType) { where.push('source_type = ?'); args.push(req.query.sourceType); }
  if (req.query.projectId) { where.push('project_id = ?'); args.push(req.query.projectId); }
  const sql = `SELECT * FROM records ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
  res.json(db.prepare(sql).all(...args).map((r) => hydrateRecord(r)));
});

api.get('/records/:id', (req, res) => {
  const r = getRecord(req.params.id);
  if (!r) return res.status(404).json({ error: 'Record not found.' });
  res.json(r);
});

const recordFields = (b) => ({
  kind: b.kind === 'compare' ? 'compare' : 'feedback',
  title: String(b.title || '').trim() || 'Untitled',
  sourceType: b.sourceType || 'Photography',
  promptId: b.promptId || null,
  promptName: b.promptName || '',
  promptBody: b.promptBody || '',
  model: b.model || '',
  projectId: b.projectId || null,
  output: b.output || '',
  recommendations: JSON.stringify(b.recommendations || []),
  favourite: b.favourite ? 1 : 0,
});

api.post('/records', (req, res) => {
  const b = req.body || {};
  if (!Array.isArray(b.sourceIds) || !b.sourceIds.length) return res.status(400).json({ error: 'A record needs at least one source.' });
  const f = recordFields(b);
  const id = newId();
  const t = now();
  transaction(() => {
    db.prepare(`INSERT INTO records (id, kind, title, source_type, prompt_id, prompt_name, prompt_body, model, project_id, output, recommendations, favourite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, f.kind, f.title, f.sourceType, f.promptId, f.promptName, f.promptBody, f.model, f.projectId, f.output, f.recommendations, f.favourite, t, t);
    writeRecordChildren(id, { sourceIds: b.sourceIds, messages: b.messages || [] });
  });
  res.json(getRecord(id));
});

api.patch('/records/:id', (req, res) => {
  const existing = getRecord(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Record not found.' });
  const b = { ...existing, ...(req.body || {}) };
  const f = recordFields(b);
  transaction(() => {
    db.prepare(`UPDATE records SET title = ?, source_type = ?, prompt_id = ?, prompt_name = ?, prompt_body = ?, model = ?, project_id = ?, output = ?, recommendations = ?, favourite = ?, updated_at = ? WHERE id = ?`)
      .run(f.title, f.sourceType, f.promptId, f.promptName, f.promptBody, f.model, f.projectId, f.output, f.recommendations, f.favourite, now(), existing.id);
    writeRecordChildren(existing.id, {
      sourceIds: req.body?.sourceIds,
      messages: req.body?.messages,
    });
  });
  res.json(getRecord(existing.id));
});

api.delete('/records/:id', (req, res) => {
  db.prepare('DELETE FROM records WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- generation ----------
function userContent(text, fileIds) {
  return [{ type: 'text', text }, ...fileIds.map((id) => imagePart(id))];
}

function feedbackInstruction(sourceType, promptText) {
  const what = sourceType === 'Design' ? 'design' : 'photograph';
  return (promptText && promptText.trim()) || `Give considered creative-direction feedback on this ${what}.`;
}

api.post('/generate/feedback', wrap(async (req, res) => {
  const s = getSettings();
  const { sourceIds = [], sourceType, promptText, systemNote, model } = req.body || {};
  if (!sourceIds.length) return res.status(400).json({ error: 'Add a source to begin.' });
  let resolved;
  let messages;
  try {
    resolved = await resolveModel(s.endpoint, model || s.feedbackModel || s.visionModel);
    messages = [
      { role: 'system', content: buildSystemPrompt(s, { systemNote }) },
      { role: 'user', content: userContent(feedbackInstruction(sourceType, promptText), sourceIds) },
    ];
  } catch (e) {
    return res.status(502).json({ error: friendlyError(e) });
  }
  await streamCompletion(res, { endpoint: s.endpoint, model: resolved, messages });
}));

const compareSchema = (n) => ({
  type: 'object',
  properties: {
    first_read: { type: 'string' },
    ranking: {
      type: 'array',
      minItems: n,
      maxItems: n,
      items: {
        type: 'object',
        properties: { source: { type: 'integer', minimum: 1, maximum: n }, reason: { type: 'string' } },
        required: ['source', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['first_read', 'ranking'],
  additionalProperties: false,
});

export function parseComparison(text, n) {
  let data = null;
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try { data = JSON.parse(cleaned); } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) { try { data = JSON.parse(m[0]); } catch { /* fall through */ } }
  }
  const firstRead = String(data?.first_read || data?.firstRead || (data ? '' : text)).trim();
  const seen = new Set();
  const ranking = [];
  for (const r of Array.isArray(data?.ranking) ? data.ranking : []) {
    const src = Number(r?.source);
    if (!Number.isInteger(src) || src < 1 || src > n || seen.has(src)) continue;
    seen.add(src);
    ranking.push({ source: src, reason: String(r.reason || '').trim() });
  }
  // Any source the model omitted is appended so every submitted source is ranked.
  for (let i = 1; i <= n; i++) if (!seen.has(i)) ranking.push({ source: i, reason: '' });
  return { firstRead, ranking: ranking.map((r, i) => ({ ...r, rank: i + 1 })) };
}

api.post('/generate/compare', wrap(async (req, res) => {
  const s = getSettings();
  const { sourceIds = [], sourceType, promptText, systemNote, model } = req.body || {};
  const n = sourceIds.length;
  if (n < 2) return res.status(400).json({ error: 'At least two sources are required.' });
  if (n > 6) return res.status(400).json({ error: 'Maximum six sources.' });
  try {
    const resolved = await resolveModel(s.endpoint, model || s.compareModel || s.visionModel);
    const what = sourceType === 'Design' ? 'designs' : 'photographs';
    const instruction = [
      `You are comparing ${n} ${what}, supplied in order as Source 1 to Source ${n}.`,
      promptText && promptText.trim() ? `Brief: ${promptText.trim()}` : `Decide which is strongest, and why.`,
      `Respond as JSON with two fields:`,
      `"first_read": your written read of the set as plain text — the comparison reasoning, strengths and weaknesses.`,
      `"ranking": an array of exactly ${n} items ordered from strongest to weakest. Each item is {"source": <source number 1-${n}>, "reason": <one short sentence>}. Every source appears exactly once.`,
    ].join('\n');
    const content = [{ type: 'text', text: instruction }];
    sourceIds.forEach((id, i) => {
      content.push({ type: 'text', text: `Source ${i + 1}:` });
      content.push(imagePart(id));
    });
    const text = await completeJson({
      endpoint: s.endpoint,
      model: resolved,
      schema: compareSchema(n),
      messages: [
        { role: 'system', content: buildSystemPrompt(s, { systemNote }) },
        { role: 'user', content },
      ],
    });
    const parsed = parseComparison(text, n);
    if (!parsed.firstRead) throw new Error('The model returned an empty response.');
    res.json({ ...parsed, model: resolved });
  } catch (e) {
    res.status(502).json({ error: friendlyError(e) });
  }
}));

api.post('/chat', wrap(async (req, res) => {
  const s = getSettings();
  const { context = {}, messages = [], model } = req.body || {};
  const ids = context.sourceIds || [];
  let resolved;
  let convo;
  try {
    const fallback = context.kind === 'compare' ? s.compareModel : s.feedbackModel;
    resolved = await resolveModel(s.endpoint, model || fallback || s.visionModel);
    let assistantContext = context.output || '';
    if (context.kind === 'compare' && Array.isArray(context.recommendations)) {
      assistantContext += '\n\nRanking:\n' + context.recommendations
        .map((r) => `#${r.rank} · Source ${r.source}${r.reason ? ` — ${r.reason}` : ''}`).join('\n');
    }
    const opening = context.kind === 'compare'
      ? `Compare these ${ids.length} sources (Source 1 to Source ${ids.length}).\n${context.promptText || ''}`
      : feedbackInstruction(context.sourceType, context.promptText);
    convo = [
      { role: 'system', content: buildSystemPrompt(s, { systemNote: context.systemNote, role: 'chat' }) },
      { role: 'user', content: userContent(opening, ids) },
      ...(assistantContext ? [{ role: 'assistant', content: assistantContext }] : []),
      ...messages.filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => ({ role: m.role, content: m.content })),
    ];
  } catch (e) {
    return res.status(502).json({ error: friendlyError(e) });
  }
  await streamCompletion(res, { endpoint: s.endpoint, model: resolved, messages: convo });
}));

api.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return res.end();
  res.status(500).json({ error: friendlyError(err) });
});
