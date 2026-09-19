import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { AppError, requireText, validateImage, validatePromptSnapshot, parseFeedback } from './core.mjs';

export const databasePath = resolve(process.env.DIRECTOR_DATA_DIR || fileURLToPath(new URL('../.director-data/', import.meta.url)), 'sessions.sqlite');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const validId = id => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id);
function checkId(id) { if (!validId(id)) throw new AppError('Invalid session ID.'); }
function titleText(title) {
  if (typeof title !== 'string' || title.trim().length > 200) throw new AppError('Session title must be at most 200 characters.');
  return title.trim();
}
function imageParts(dataUrl, name) {
  validateImage({ dataUrl, name });
  const [, mime, base64] = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  const bytes = Buffer.from(base64, 'base64');
  return { mime, bytes, digest: hash(bytes) };
}
export function uploadImage(image) {
  const review = validateImage(image);
  const sourceDataUrl = image.sourceDataUrl ?? image.dataUrl;
  const source = imageParts(sourceDataUrl, review.name);
  const result = { ...review, sourceDataUrl, mimeType: source.mime, sizeBytes: source.bytes.length, sourceIsReviewCopy: image.sourceIsReviewCopy === true || !image.sourceDataUrl };
  for (const key of ['width', 'height', 'reviewWidth', 'reviewHeight']) {
    if (image[key] !== undefined) {
      if (!Number.isInteger(image[key]) || image[key] < 1 || image[key] > 100000) throw new AppError('Invalid image dimensions.');
      result[key] = image[key];
    }
  }
  return result;
}
function validateRecord(record) {
  if (!record || !((record.schemaVersion === 1 && record.type === 'feedback') || (record.schemaVersion === 2 && record.type === 'compare'))) throw new Error('Unsupported session format.');
  validatePromptSnapshot(record.prompt);
  requireText(record.model, 'Saved model', 300);
  requireText(record.systemInstruction, 'Saved system instructions', 20000);
  requireText(record.image?.name, 'Saved image name', 500);
  if (record.type === 'compare') requireText(record.imageB?.name, 'Saved Image B name', 500);
  requireText(record.feedback?.raw, 'Saved feedback', 40000);
  record.feedback = parseFeedback(record.feedback.raw, record.prompt);
  if (!Array.isArray(record.chat) || record.chat.length % 2) throw new Error('Incomplete chat history.');
  record.chat.forEach((turn, i) => {
    if (turn.role !== (i % 2 ? 'assistant' : 'user')) throw new Error('Invalid conversation order.');
    requireText(turn.content, 'Saved chat message', 40000);
  });
  return record;
}
function storageError(error) {
  if (error instanceof AppError) return error;
  return new AppError('Director could not write its local session database. Check disk space and folder permissions, then retry. Previously saved sessions have not been replaced.', 503);
}

export class SessionStore {
  constructor(path = databasePath) {
    try {
      if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
      this.db = new DatabaseSync(path);
      if (path !== ':memory:') chmodSync(path, 0o600);
      this.db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON;');
      const version = this.db.prepare('PRAGMA user_version').get().user_version;
      if (version > 2) throw new Error('This database was created by a newer Director version.');
      if (version === 0) this.db.exec(`BEGIN IMMEDIATE;
        CREATE TABLE sessions (
          id TEXT PRIMARY KEY, title TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
          revision INTEGER NOT NULL CHECK(revision > 0), record TEXT NOT NULL
        );
        CREATE TABLE assets (
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK(role IN ('source','review','source_b','review_b')), mime TEXT NOT NULL, data BLOB NOT NULL, sha256 TEXT NOT NULL,
          PRIMARY KEY(session_id, role)
        );
        CREATE INDEX sessions_updated ON sessions(updated_at DESC);
        PRAGMA user_version=2;
        COMMIT;`);
      if (version === 1) this.db.exec(`BEGIN IMMEDIATE;
        CREATE TABLE assets_v3 (
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK(role IN ('source','review','source_b','review_b')), mime TEXT NOT NULL, data BLOB NOT NULL, sha256 TEXT NOT NULL,
          PRIMARY KEY(session_id, role)
        );
        INSERT INTO assets_v3 SELECT * FROM assets;
        DROP TABLE assets;
        ALTER TABLE assets_v3 RENAME TO assets;
        PRAGMA user_version=2;
        COMMIT;`);
    } catch (error) {
      try { this.db?.close(); } catch {}
      throw new Error(`Director cannot open its session database at ${path}. ${error.message} Existing data was not reset.`);
    }
  }
  close() { this.db.close(); }
  transaction(action) {
    try {
      this.db.exec('BEGIN IMMEDIATE');
      try { const value = action(); this.db.exec('COMMIT'); return value; }
      catch (error) { this.db.exec('ROLLBACK'); throw error; }
    } catch (error) { throw storageError(error); }
  }
  row(id) {
    checkId(id);
    const row = this.db.prepare('SELECT * FROM sessions WHERE id=?').get(id);
    if (!row) throw new AppError('This session is no longer present. Refresh History to see the remaining sessions.', 404);
    return row;
  }
  decode(row) {
    try {
      const record = validateRecord(JSON.parse(row.record));
      if (!Number.isInteger(row.revision) || row.revision < 1 || typeof row.title !== 'string' || !Number.isFinite(Date.parse(row.created_at)) || !Number.isFinite(Date.parse(row.updated_at))) throw new Error('Invalid session metadata.');
      return { ...record, id: row.id, title: row.title, createdAt: row.created_at, updatedAt: row.updated_at, revision: row.revision };
    } catch {
      throw new AppError('This saved session is malformed or uses an unsupported format. Other sessions are unaffected. Keep it for recovery or delete it from History.', 422);
    }
  }
  list() {
    return this.db.prepare('SELECT * FROM sessions ORDER BY updated_at DESC, id').all().map(row => {
      try {
        const s = this.decode(row);
        const assets = this.db.prepare('SELECT role FROM assets WHERE session_id=?').all(row.id);
        const roles = s.type === 'compare' ? ['source', 'review', 'source_b', 'review_b'] : ['source', 'review'];
        return { id: s.id, title: s.title, createdAt: s.createdAt, updatedAt: s.updatedAt, revision: s.revision, imageName: s.image.name, ...(s.type === 'compare' ? { imageBName: s.imageB.name } : {}), promptName: s.prompt.name, type: s.type,
          ...(roles.every(role => assets.some(a => a.role === role)) ? {} : { error: 'A Director-owned image asset is missing. Other sessions are unaffected.' }) };
      } catch (error) { return { id: row.id, title: row.title || 'Unreadable session', updatedAt: row.updated_at, revision: row.revision, error: error.message }; }
    });
  }
  get(id) {
    const session = this.decode(this.row(id));
    const assets = this.db.prepare('SELECT * FROM assets WHERE session_id=?').all(id);
    const roles = session.type === 'compare' ? ['source', 'review', 'source_b', 'review_b'] : ['source', 'review'];
    for (const role of roles) {
      const target = role.endsWith('_b') ? session.imageB : session.image;
      const asset = assets.find(a => a.role === role);
      if (!asset) throw new AppError('A Director-owned image asset is missing from this session. Other saved sessions are unaffected.', 422);
      const bytes = Buffer.from(asset.data);
      if (hash(bytes) !== asset.sha256) throw new AppError('The saved image asset is damaged. This session was not changed; other sessions are unaffected.', 422);
      const dataUrl = `data:${asset.mime};base64,${bytes.toString('base64')}`;
      try { validateImage({ name: target.name, dataUrl }); } catch { throw new AppError('The saved image asset is malformed. Other sessions are unaffected.', 422); }
      target[role.startsWith('source') ? 'sourceDataUrl' : 'dataUrl'] = dataUrl;
    }
    return session;
  }
  create(session) {
    checkId(session.id);
    const type = session.type || 'feedback';
    if (!['feedback', 'compare'].includes(type)) throw new AppError('Unsupported session type.');
    const image = uploadImage(session.image);
    const assets = { source: imageParts(image.sourceDataUrl, image.name), review: imageParts(image.dataUrl, image.name) };
    const { dataUrl, sourceDataUrl, ...metadata } = image;
    let metadataB;
    if (type === 'compare') {
      const imageB = uploadImage(session.imageB);
      assets.source_b = imageParts(imageB.sourceDataUrl, imageB.name); assets.review_b = imageParts(imageB.dataUrl, imageB.name);
      const { dataUrl: bData, sourceDataUrl: bSource, ...bMetadata } = imageB; metadataB = bMetadata;
    }
    const { id, createdAt, updatedAt, revision, title, imageB, ...rest } = session;
    const record = validateRecord({ ...rest, schemaVersion: type === 'compare' ? 2 : 1, type, image: metadata, ...(metadataB ? { imageB: metadataB } : {}) });
    this.transaction(() => {
      this.db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?,?)').run(id, titleText(title || image.name), createdAt, updatedAt, 1, JSON.stringify(record));
      const insert = this.db.prepare('INSERT INTO assets VALUES(?,?,?,?,?)');
      for (const [role, asset] of Object.entries(assets)) insert.run(id, role, asset.mime, asset.bytes, asset.digest);
    });
    return this.get(id);
  }
  checkRevision(row, revision) {
    if (!Number.isInteger(revision) || row.revision !== revision) throw new AppError('This session changed in another tab. Reopen it from History before trying again; your draft is still here.', 409);
  }
  append(id, revision, message, reply, requestId, info) {
    this.transaction(() => {
      const row = this.row(id); this.checkRevision(row, revision);
      const session = this.decode(row);
      const record = JSON.parse(row.record);
      const now = new Date().toISOString();
      record.chat = [...session.chat, { role: 'user', content: message, createdAt: now, requestId }, { role: 'assistant', content: reply, createdAt: now, modelInfo: info }];
      validateRecord(record);
      this.db.prepare('UPDATE sessions SET record=?, revision=revision+1, updated_at=? WHERE id=?').run(JSON.stringify(record), now, id);
    });
    return this.get(id);
  }
  rename(id, title, revision) {
    title = titleText(title);
    this.transaction(() => {
      const row = this.row(id); this.checkRevision(row, revision); this.decode(row);
      this.db.prepare('UPDATE sessions SET title=?, revision=revision+1, updated_at=? WHERE id=?').run(title, new Date().toISOString(), id);
    });
    return this.get(id);
  }
  delete(id, revision) {
    this.transaction(() => {
      const row = this.row(id); this.checkRevision(row, revision);
      this.db.prepare('DELETE FROM sessions WHERE id=?').run(id);
    });
    // Cascade removes every owned asset in the same transaction; no per-session files can be orphaned.
    this.db.exec('PRAGMA wal_checkpoint(PASSIVE)');
  }
}
