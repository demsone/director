import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DIRECTOR_DATA_DIR || path.resolve(here, '..', 'data');
export const FILES_DIR = path.join(DATA_DIR, 'files');
fs.mkdirSync(FILES_DIR, { recursive: true });

export const DB_PATH = path.join(DATA_DIR, 'director.db');
export const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  use_type TEXT NOT NULL DEFAULT 'Feedback',
  description TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  system_note TEXT NOT NULL DEFAULT '',
  archived INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Photography',
  description TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  favourite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  has_preview INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'Photography',
  prompt_id TEXT,
  prompt_name TEXT NOT NULL DEFAULT '',
  prompt_body TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  output TEXT NOT NULL DEFAULT '',
  recommendations TEXT NOT NULL DEFAULT '[]',
  favourite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS record_sources (
  record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  file_id TEXT NOT NULL REFERENCES files(id),
  position INTEGER NOT NULL,
  PRIMARY KEY (record_id, position)
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

export const now = () => new Date().toISOString();
export const newId = () => crypto.randomUUID();

export const DEFAULT_SETTINGS = {
  feedbackModel: '',
  compareModel: '',
  visionModel: '',
  endpoint: 'http://127.0.0.1:1234',
  tone: 'Professional',
  warmth: 'Neutral',
  fastAnswers: 'Yes',
  customInstructions: '',
  theme: 'Dark',
  accent: '#B95A36',
};

export function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) {
    try { out[r.key] = JSON.parse(r.value); } catch { /* ignore malformed */ }
  }
  return out;
}

export function saveSettings(patch) {
  const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in DEFAULT_SETTINGS)) continue;
    stmt.run(k, JSON.stringify(v));
  }
  return getSettings();
}

// Seed the prompt library once, from the Director 50-prompt library.
const promptCount = db.prepare('SELECT COUNT(*) AS n FROM prompts').get().n;
const seeded = db.prepare("SELECT value FROM settings WHERE key = '__seeded'").get();
if (promptCount === 0 && !seeded) {
  const seed = JSON.parse(fs.readFileSync(path.join(here, 'seed-prompts.json'), 'utf8'));
  const ins = db.prepare(`INSERT INTO prompts (id, name, category, use_type, description, body, system_note, archived, sort, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, '', 0, ?, ?, ?)`);
  const t = now();
  seed.forEach((p, i) => ins.run(newId(), p.name, p.category, p.useType, p.description, p.body, i, t, t));
  db.prepare("INSERT INTO settings (key, value) VALUES ('__seeded', 'true')").run();
}

// ---------- mappers ----------
export function mapPrompt(r) {
  return {
    id: r.id, name: r.name, category: r.category, useType: r.use_type, description: r.description,
    body: r.body, systemNote: r.system_note, archived: !!r.archived, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export function mapProject(r) {
  return {
    id: r.id, title: r.title, type: r.type, description: r.description, notes: r.notes,
    favourite: !!r.favourite, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export function mapFile(r) {
  return { id: r.id, filename: r.filename, mime: r.mime, size: r.size, hasPreview: !!r.has_preview };
}

export function getRecord(id, { withMessages = true } = {}) {
  const r = db.prepare('SELECT * FROM records WHERE id = ?').get(id);
  if (!r) return null;
  return hydrateRecord(r, withMessages);
}

export function hydrateRecord(r, withMessages = false) {
  const sources = db.prepare(`SELECT f.* FROM record_sources rs JOIN files f ON f.id = rs.file_id WHERE rs.record_id = ? ORDER BY rs.position`).all(r.id).map(mapFile);
  const project = r.project_id ? db.prepare('SELECT id, title FROM projects WHERE id = ?').get(r.project_id) : null;
  const out = {
    id: r.id, kind: r.kind, title: r.title, sourceType: r.source_type, promptId: r.prompt_id,
    promptName: r.prompt_name, promptBody: r.prompt_body, model: r.model, projectId: r.project_id,
    projectTitle: project ? project.title : null,
    output: r.output, recommendations: safeJson(r.recommendations, []), favourite: !!r.favourite,
    createdAt: r.created_at, updatedAt: r.updated_at, sources,
  };
  if (withMessages) {
    out.messages = db.prepare('SELECT id, role, content, model, created_at FROM messages WHERE record_id = ? ORDER BY position').all(r.id)
      .map((m) => ({ id: m.id, role: m.role, content: m.content, model: m.model, createdAt: m.created_at }));
  }
  return out;
}

function safeJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

export function writeRecordChildren(recordId, { sourceIds, messages }) {
  if (sourceIds) {
    db.prepare('DELETE FROM record_sources WHERE record_id = ?').run(recordId);
    const ins = db.prepare('INSERT INTO record_sources (record_id, file_id, position) VALUES (?, ?, ?)');
    sourceIds.forEach((fid, i) => ins.run(recordId, fid, i));
  }
  if (messages) {
    db.prepare('DELETE FROM messages WHERE record_id = ?').run(recordId);
    const ins = db.prepare('INSERT INTO messages (id, record_id, role, content, model, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    messages.forEach((m, i) => ins.run(m.id || newId(), recordId, m.role, m.content, m.model || '', i, m.createdAt || now()));
  }
}

export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const res = fn();
    db.exec('COMMIT');
    return res;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
