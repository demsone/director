import fs from 'node:fs';
import path from 'node:path';
import { db, FILES_DIR } from './db.js';

export function normaliseEndpoint(endpoint) {
  let e = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!e) e = 'http://127.0.0.1:1234';
  if (!/^https?:\/\//i.test(e)) e = 'http://' + e;
  return e.replace(/\/v1$/i, '');
}

export function providerName(endpoint) {
  try {
    const u = new URL(normaliseEndpoint(endpoint));
    if (u.port === '1234') return 'LM Studio';
    if (u.port === '11434') return 'Ollama';
    return 'Local Server';
  } catch {
    return 'Local Server';
  }
}

async function fetchWithTimeout(url, opts = {}, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function listModels(endpoint) {
  const res = await fetchWithTimeout(`${normaliseEndpoint(endpoint)}/v1/models`, {}, 4000);
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  const json = await res.json();
  const data = Array.isArray(json.data) ? json.data : [];
  return data.map((m) => m.id).filter(Boolean)
    // Embedding models cannot answer prompts.
    .filter((id) => !/embed/i.test(id));
}

export async function resolveModel(endpoint, preferred) {
  if (preferred) return preferred;
  const models = await listModels(endpoint);
  if (!models.length) throw new Error('No models are available on the local server.');
  return models[0];
}

export function buildSystemPrompt(settings, { systemNote = '', role = 'feedback' } = {}) {
  const lines = [
    'You are Director, a creative-direction assistant used for critique and visual decision-making on photography and design work.',
    'Be concise, direct and specific. Base your judgement on what is visible in the supplied material.',
  ];
  const tone = {
    Professional: 'Write in a professional, measured tone.',
    Friendly: 'Write in a friendly, approachable tone.',
    Candid: 'Write candidly and plainly; do not soften criticism.',
  }[settings.tone];
  if (tone) lines.push(tone);
  const warmth = {
    Less: 'Keep warmth to a minimum; avoid encouragement and pleasantries.',
    More: 'Be warm and encouraging while staying honest.',
  }[settings.warmth];
  if (warmth) lines.push(warmth);
  if (settings.fastAnswers === 'No') {
    lines.push('Do not draw on general knowledge beyond the supplied material; reason only from what is present.');
  } else {
    lines.push('You may draw on general knowledge of photography, design and art history where it helps.');
  }
  if (settings.customInstructions && settings.customInstructions.trim()) {
    lines.push('User instructions:\n' + settings.customInstructions.trim());
  }
  if (systemNote && systemNote.trim()) lines.push('Prompt note:\n' + systemNote.trim());
  if (role === 'chat') lines.push('You are continuing a conversation about the critique above. Answer the user\'s follow-up questions directly.');
  return lines.join('\n\n');
}

export function imagePart(fileId) {
  const row = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
  if (!row) throw new Error('Source could not be read.');
  const previewPath = path.join(FILES_DIR, `${row.id}.preview.jpg`);
  let buf, mime;
  if (row.has_preview && fs.existsSync(previewPath)) {
    buf = fs.readFileSync(previewPath);
    mime = 'image/jpeg';
  } else {
    buf = fs.readFileSync(path.join(FILES_DIR, row.id));
    mime = row.mime || 'image/jpeg';
  }
  return { type: 'image_url', image_url: { url: `data:${mime};base64,${buf.toString('base64')}` } };
}

function stripThink(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/^[\s\S]*?<\/think>/, '').trim();
}

/**
 * Streams an OpenAI-compatible chat completion to an Express response as SSE.
 * Emits {delta}, {reasoning}, {done, text, model} or {error}.
 */
export async function streamCompletion(res, { endpoint, model, messages, temperature = 0.7 }) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  const ctrl = new AbortController();
  res.on('close', () => ctrl.abort());

  let full = '';
  let inThink = false;
  try {
    const upstream = await fetch(`${normaliseEndpoint(endpoint)}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true, temperature }),
      signal: ctrl.signal,
    });
    if (!upstream.ok || !upstream.body) {
      const body = await upstream.text().catch(() => '');
      throw new Error(describeUpstreamError(upstream.status, body));
    }
    const decoder = new TextDecoder();
    let buffer = '';
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') continue;
        let json;
        try { json = JSON.parse(payload); } catch { continue; }
        if (json.error) throw new Error(json.error.message || String(json.error));
        const d = json.choices?.[0]?.delta || {};
        const reasoning = d.reasoning_content || d.reasoning;
        if (reasoning) send({ reasoning });
        let content = d.content || '';
        while (content) {
          if (inThink) {
            const end = content.indexOf('</think>');
            if (end === -1) { send({ reasoning: content }); content = ''; }
            else { send({ reasoning: content.slice(0, end) }); content = content.slice(end + 8); inThink = false; }
          } else {
            const start = content.indexOf('<think>');
            if (start === -1) { full += content; send({ delta: content }); content = ''; }
            else {
              const before = content.slice(0, start);
              if (before) { full += before; send({ delta: before }); }
              content = content.slice(start + 7);
              inThink = true;
            }
          }
        }
      }
    }
    const text = stripThink(full);
    if (!text) throw new Error('The model returned an empty response.');
    send({ done: true, text, model });
  } catch (e) {
    if (ctrl.signal.aborted) return;
    send({ error: friendlyError(e) });
  } finally {
    res.end();
  }
}

export async function completeJson({ endpoint, model, messages, schema }) {
  const base = { model, messages, temperature: 0.4, stream: false };
  const url = `${normaliseEndpoint(endpoint)}/v1/chat/completions`;
  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...base, response_format: { type: 'json_schema', json_schema: { name: 'comparison', strict: true, schema } } }),
  });
  if (!res.ok) {
    // Some servers do not support structured output; retry as plain text.
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(base) });
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(describeUpstreamError(res.status, body));
  }
  const json = await res.json();
  const text = stripThink(json.choices?.[0]?.message?.content || '');
  return text;
}

function describeUpstreamError(status, body) {
  let msg = '';
  try { msg = JSON.parse(body)?.error?.message || JSON.parse(body)?.error || ''; } catch { msg = body; }
  msg = String(msg || '').slice(0, 300);
  if (status === 404) return `Model unavailable. ${msg}`.trim();
  return `Model request failed (${status}). ${msg}`.trim();
}

export function friendlyError(e) {
  const m = String(e?.message || e);
  if (/fetch failed|ECONNREFUSED|abort/i.test(m)) return 'Connection failed. Check that the local model server is running and the endpoint in Settings is correct.';
  return m;
}
