import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { SessionStore } from '../src/store.mjs';
import { getPrompt, parseFeedback, systemInstruction, chatMessages, AppError } from '../src/core.mjs';
import { createApp } from '../server.mjs';

const review = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const source = `data:image/jpeg;base64,${readFileSync(new URL('../assets/img/image.jpg.jpg', import.meta.url)).toString('base64')}`;
function fixture() {
  const prompt = getPrompt('photography-review'), now = new Date().toISOString();
  return { id: randomUUID(), createdAt: now, updatedAt: now, title: 'Original title', image: { name: 'photo.jpg', dataUrl: review, sourceDataUrl: source, width: 549, height: 330, reviewWidth: 1, reviewHeight: 1 }, prompt, model: 'vision', systemInstruction, modelInfo: { provider: 'LM Studio', contextLength: 8192 }, feedback: parseFeedback(JSON.stringify(Object.fromEntries(prompt.sections.map((s, i) => [`section_${i+1}`, s]))), prompt), chat: [] };
}
function disk(t) { const directory = mkdtempSync(join(tmpdir(), 'director-store-test-')); t.after(() => rmSync(directory, { recursive: true, force: true })); return join(directory, 'sessions.sqlite'); }
async function serve(t, store, client) { const server = createApp({ store, client }); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); })); return `http://127.0.0.1:${server.address().port}`; }
async function send(base, path, body, method = 'POST') { const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return { status: r.status, data: await r.json() }; }

test('Exact source, review copy, metadata, snapshots and chat survive reopening the database', t => {
  const path = disk(t), input = fixture(); let store = new SessionStore(path);
  const saved = store.create(input);
  store.append(saved.id, 1, 'Call this Courtyard.', 'The yellow cloth anchors it.', 'request-1', { provider: 'LM Studio', responseModel: 'vision' });
  store.close(); store = new SessionStore(path);
  try {
    const reopened = store.get(saved.id);
    assert.equal(reopened.image.sourceDataUrl, source); assert.equal(reopened.image.dataUrl, review);
    assert.equal(reopened.image.width, 549); assert.equal(reopened.image.mimeType, 'image/jpeg');
    assert.deepEqual(reopened.prompt, input.prompt); assert.equal(reopened.feedback.raw, input.feedback.raw);
    assert.equal(reopened.chat.length, 2); assert.equal(reopened.revision, 2);
    assert.equal(reopened.modelInfo.contextLength, 8192); assert.equal(reopened.type, 'feedback');
    assert.equal(reopened.systemInstruction, systemInstruction);
  } finally { store.close(); }
});
test('Removed or changed prompts never invalidate saved conversation context', t => {
  const store = new SessionStore(disk(t));
  try {
    const input = fixture(); input.prompt.id = 'removed-from-catalog'; input.prompt.instruction = 'Original direction, preserved forever'; input.systemInstruction = 'Original system contract';
    const saved = store.create(input);
    const messages = chatMessages(store.get(saved.id), 'Continue');
    assert.ok(messages[0].content.startsWith(input.systemInstruction));
    assert.match(messages[0].content, /PHOTOGRAPHY CRITIQUE POLICY/);
    assert.match(messages[1].content[1].text, /Original direction, preserved forever/);
    assert.equal(messages[1].content[0].image_url.url, review);
  } finally { store.close(); }
});
test('Rename and delete persist; deleting removes owned assets and preserves unrelated session', t => {
  const path = disk(t); let store = new SessionStore(path);
  const first = store.create(fixture()), second = store.create(fixture());
  store.rename(first.id, 'A durable name', 1); store.close(); store = new SessionStore(path);
  assert.equal(store.get(first.id).title, 'A durable name');
  store.delete(first.id, 2); store.close(); store = new SessionStore(path);
  try {
    assert.throws(() => store.get(first.id), e => e.status === 404);
    assert.equal(store.get(second.id).feedback.raw, second.feedback.raw);
    assert.equal(store.db.prepare('SELECT count(*) n FROM assets WHERE session_id=?').get(first.id).n, 0);
    assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2);
  } finally { store.close(); }
});
test('Interrupted asset or record writes roll back without partial sessions or lost history', t => {
  const store = new SessionStore(disk(t));
  try {
    const safe = store.create(fixture());
    store.db.exec("CREATE TRIGGER fail_asset BEFORE INSERT ON assets WHEN NEW.role='review' BEGIN SELECT RAISE(ABORT, 'simulated disk failure'); END;");
    assert.throws(() => store.create(fixture()), /could not write/);
    assert.equal(store.list().length, 1); assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2);
    store.db.exec("CREATE TRIGGER fail_update BEFORE UPDATE ON sessions BEGIN SELECT RAISE(ABORT, 'simulated write failure'); END;");
    assert.throws(() => store.append(safe.id, 1, 'Question', 'Answer', 'request', {}), /could not write/);
    assert.equal(store.get(safe.id).chat.length, 0); assert.equal(store.get(safe.id).revision, 1);
  } finally { store.close(); }
});
test('Process death inside a transaction rolls back session and asset changes on restart', async t => {
  const path = disk(t); let store = new SessionStore(path); const saved = store.create(fixture()); store.close();
  const script = `import {DatabaseSync} from 'node:sqlite'; const db=new DatabaseSync(process.argv[1]); db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE'); db.prepare('UPDATE sessions SET title=? WHERE id=?').run('UNCOMMITTED',process.argv[2]); db.prepare('DELETE FROM assets WHERE session_id=?').run(process.argv[2]); console.log('transaction-open'); setInterval(()=>{},1000);`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', script, path, saved.id], { stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => child.kill('SIGKILL'));
  await new Promise((resolve, reject) => { const timeout = setTimeout(() => reject(new Error('Child transaction did not start')), 5000); child.stdout.once('data', () => { clearTimeout(timeout); resolve(); }); child.once('error', reject); });
  const exit = once(child, 'exit'); child.kill('SIGKILL'); await exit;
  store = new SessionStore(path);
  try { assert.equal(store.get(saved.id).title, 'Original title'); assert.equal(store.get(saved.id).image.sourceDataUrl, source); }
  finally { store.close(); }
});
test('Corrupt session and missing/damaged image are isolated; healthy sessions remain readable', t => {
  const store = new SessionStore(disk(t));
  try {
    const corrupt = store.create(fixture()), missing = store.create(fixture()), damaged = store.create(fixture()), safe = store.create(fixture());
    store.db.prepare('UPDATE sessions SET record=? WHERE id=?').run('{broken', corrupt.id);
    store.db.prepare('DELETE FROM assets WHERE session_id=? AND role=?').run(missing.id, 'source');
    store.db.prepare('UPDATE assets SET data=? WHERE session_id=? AND role=?').run(Buffer.from('broken image'), damaged.id, 'review');
    assert.throws(() => store.get(corrupt.id), /malformed/); assert.throws(() => store.get(missing.id), /missing/); assert.throws(() => store.get(damaged.id), /damaged/);
    assert.ok(store.list().find(s => s.id === corrupt.id).error); assert.ok(store.list().find(s => s.id === missing.id).error);
    assert.equal(store.get(safe.id).feedback.raw, safe.feedback.raw);
    store.delete(corrupt.id, 1); assert.equal(store.list().length, 3);
  } finally { store.close(); }
});
test('Concurrent store connections reject stale updates and cannot resurrect deleted sessions', t => {
  const path = disk(t), a = new SessionStore(path), b = new SessionStore(path);
  try {
    const saved = a.create(fixture()); b.rename(saved.id, 'Changed elsewhere', 1);
    assert.throws(() => a.append(saved.id, 1, 'Question', 'Reply', 'r', {}), e => e.status === 409);
    assert.equal(a.get(saved.id).title, 'Changed elsewhere'); assert.equal(a.get(saved.id).chat.length, 0);
    b.delete(saved.id, 2); assert.throws(() => a.append(saved.id, 2, 'Question', 'Reply', 'r', {}), e => e.status === 404);
  } finally { a.close(); b.close(); }
});
test('Unsupported database versions are rejected without resetting existing data', t => {
  const path = disk(t), store = new SessionStore(path); store.create(fixture()); store.db.exec('PRAGMA user_version=3'); store.close();
  assert.throws(() => new SessionStore(path), /newer Director version/);
});
test('Chat HTTP uses saved context, retries idempotently, and model errors preserve saved turns', async t => {
  const store = new SessionStore(disk(t)); const saved = store.create(fixture()); let calls = 0, unavailable = false;
  const client = { complete: async request => { calls++; if (unavailable) throw new AppError('Model unavailable', 503); assert.equal(request.messages[1].content[0].image_url.url, review); assert.equal(request.messages[2].content, saved.feedback.raw); return { raw: 'A grounded reply' }; } };
  const base = await serve(t, store, client);
  const body = { sessionId: saved.id, revision: 1, requestId: 'retry-id', message: 'Discuss the cloth.' };
  assert.equal((await send(base, '/api/chat', body)).status, 200);
  const replay = await send(base, '/api/chat', body); assert.equal(replay.status, 200); assert.equal(replay.data.replayed, true); assert.equal(calls, 1);
  assert.equal(store.get(saved.id).chat.length, 2);
  unavailable = true;
  const failed = await send(base, '/api/chat', { ...body, revision: 2, requestId: 'next-id', message: 'Next question' });
  assert.equal(failed.status, 503); assert.equal(store.get(saved.id).chat.length, 2);
  assert.equal((await send(base, '/api/chat', { ...body, requestId: 'stale-id' })).status, 409);
});
