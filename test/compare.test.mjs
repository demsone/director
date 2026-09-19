import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SessionStore } from '../src/store.mjs';
import { createApp } from '../server.mjs';
import { prompts, getPrompt, originalMessages, chatMessages, parseFeedback, systemInstruction, critiquePolicy, AppError } from '../src/core.mjs';
import { legacyModules } from './helpers/v2-fixture.mjs';

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const jpeg = 'data:image/jpeg;base64,/9j/2Q=='; // Distinct signature fixture; live tests use fully decoded images.
const image = { name: 'A.png', dataUrl: png, sourceDataUrl: png };
const imageB = { name: 'B.jpg', dataUrl: jpeg, sourceDataUrl: jpeg };
function feedback(prompt) { return parseFeedback(JSON.stringify(Object.fromEntries(prompt.sections.map((s, i) => [`section_${i+1}`, `Observation ${i+1}`]))), prompt); }
function fixture(type = 'compare') {
  const prompt = getPrompt(type === 'compare' ? 'compare-general' : 'photography-review', type), now = new Date().toISOString();
  return { id: randomUUID(), type, title: 'Test session', createdAt: now, updatedAt: now, image, ...(type === 'compare' ? { imageB } : {}), prompt, systemInstruction, model: 'vision', feedback: feedback(prompt), chat: [] };
}
function directory(t) { const dir = mkdtempSync(join(tmpdir(), 'director-compare-test-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; }
function pairs(messages) { return messages[1].content.filter(c => c.type === 'image_url').map(c => c.image_url.url); }
async function serve(t, store, client) { const server = createApp({ store, client }); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); })); return `http://127.0.0.1:${server.address().port}`; }
async function post(base, path, body) { const r = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return { status: r.status, body: await r.json() }; }

test('Compare prompts are data; initial and follow-up messages explicitly label exactly A then B', () => {
  assert.equal(prompts.filter(p => p.sessionType === 'compare').length, 2);
  const s = fixture(); assert.equal(s.prompt.sections.length, 11);
  const messages = originalMessages(image, s.prompt, systemInstruction, imageB);
  assert.deepEqual(pairs(messages), [png, jpeg]);
  assert.match(messages[1].content[0].text, /Image A/); assert.match(messages[1].content[2].text, /Image B/);
  s.chat = [{ role: 'user', content: 'Image B right edge?' }, { role: 'assistant', content: 'A visible shape.' }];
  const continued = chatMessages(s, 'Now Image A?'); assert.deepEqual(pairs(continued), [png, jpeg]);
  assert.equal(continued[2].content, s.feedback.raw); assert.equal(continued[3].content, s.chat[0].content);
  assert.throws(() => getPrompt('compare-general', 'feedback')); assert.throws(() => getPrompt('photography-review', 'compare'));
});
test('Shared policy applies to new reviews and old-session follow-ups without mutating snapshots', () => {
  const s = fixture('feedback'); s.systemInstruction = 'Old saved system'; const before = structuredClone(s);
  const messages = chatMessages(s, 'Reconsider the image');
  assert.match(messages[0].content, /Old saved system/); assert.ok(messages[0].content.includes(critiquePolicy.instruction));
  assert.deepEqual(s, before); assert.ok(systemInstruction.includes(critiquePolicy.instruction));
  assert.match(critiquePolicy.instruction, /visible effect before intent/);
  assert.doesNotMatch(getPrompt('photography-review').instruction, /\bcandid\b|Explicitly say that technical print readiness/i);
});
test('Real tagged V2 records/assets migrate unchanged; repeated opening preserves them', async t => {
  const dir = directory(t), path = join(dir, 'sessions.sqlite'), legacy = await legacyModules(dir);
  const old = new legacy.SessionStore(path), input = fixture('feedback'); input.prompt = legacy.getPrompt('photography-review'); input.systemInstruction = legacy.systemInstruction; input.feedback = feedback(input.prompt);
  const saved = old.create(input), rows = old.db.prepare('SELECT * FROM sessions').all(), assets = old.db.prepare('SELECT * FROM assets ORDER BY role').all(); old.close();
  let current = new SessionStore(path);
  assert.equal(current.db.prepare('PRAGMA user_version').get().user_version, 3);
  assert.deepEqual(current.db.prepare('SELECT * FROM sessions').all(), rows);
  assert.deepEqual(current.db.prepare('SELECT * FROM assets ORDER BY role').all(), assets);
  assert.deepEqual(current.get(saved.id), saved);
  current.close(); current = new SessionStore(path);
  try { assert.deepEqual(current.get(saved.id), saved); assert.equal(current.db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok'); }
  finally { current.close(); }
});
test('A failed schema upgrade rolls back and leaves the V2 database readable', async t => {
  const dir = directory(t), path = join(dir, 'sessions.sqlite'), legacy = await legacyModules(dir);
  let old = new legacy.SessionStore(path); const saved = old.create(fixture('feedback'));
  old.db.exec('CREATE TABLE assets_v3 (blocking_column TEXT)'); old.close();
  assert.throws(() => new SessionStore(path), /Existing data was not reset/);
  old = new legacy.SessionStore(path);
  try { assert.equal(old.db.prepare('PRAGMA user_version').get().user_version, 1); assert.deepEqual(old.get(saved.id), saved); }
  finally { old.close(); }
});
test('Compare persists four owned assets, chat, title and deletion in the shared store', t => {
  const path = join(directory(t), 'sessions.sqlite'); let store = new SessionStore(path);
  const saved = store.create(fixture()), safe = store.create(fixture('feedback'));
  assert.equal(saved.type, 'compare'); assert.equal(saved.schemaVersion, 2);
  store.append(saved.id, 1, 'Image B?', 'Second image.', 'turn', {}); store.rename(saved.id, 'Pair renamed', 2); store.close(); store = new SessionStore(path);
  assert.equal(store.get(saved.id).imageB.dataUrl, jpeg); assert.equal(store.get(saved.id).image.dataUrl, png);
  assert.equal(store.get(saved.id).chat.length, 2); assert.equal(store.get(saved.id).title, 'Pair renamed');
  store.delete(saved.id, 3); store.close(); store = new SessionStore(path);
  try { assert.throws(() => store.get(saved.id), e => e.status === 404); assert.deepEqual(store.get(safe.id), safe); assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2); }
  finally { store.close(); }
});
test('Missing Image B and corrupt Compare records are isolated from Feedback and another Compare', t => {
  const store = new SessionStore(join(directory(t), 'sessions.sqlite'));
  try {
    const missing = store.create(fixture()), corrupt = store.create(fixture()), safe = store.create(fixture()), single = store.create(fixture('feedback'));
    store.db.prepare('DELETE FROM assets WHERE session_id=? AND role=?').run(missing.id, 'source_b');
    store.db.prepare('UPDATE sessions SET record=? WHERE id=?').run('{broken', corrupt.id);
    assert.throws(() => store.get(missing.id), /missing/); assert.ok(store.list().find(s => s.id === missing.id).error);
    assert.throws(() => store.get(corrupt.id), /malformed/);
    assert.deepEqual(store.get(safe.id), safe); assert.deepEqual(store.get(single.id), single);
  } finally { store.close(); }
});
test('Failure writing the final Compare asset rolls back the entire session', t => {
  const store = new SessionStore(join(directory(t), 'sessions.sqlite'));
  try {
    const safe = store.create(fixture('feedback'));
    store.db.exec("CREATE TRIGGER fail_b BEFORE INSERT ON assets WHEN NEW.role='review_b' BEGIN SELECT RAISE(ABORT, 'interrupted'); END;");
    assert.throws(() => store.create(fixture()), /could not write/);
    assert.equal(store.list().length, 1); assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2); assert.deepEqual(store.get(safe.id), safe);
  } finally { store.close(); }
});
test('Compare HTTP rejects incomplete/invalid/extra input, mismatched prompts and malformed output', async t => {
  let calls = 0; const store = new SessionStore(join(directory(t), 'sessions.sqlite'));
  const base = await serve(t, store, { complete: async () => { calls++; return { raw: '{}' }; } });
  const valid = { image, imageB, promptId: 'compare-general', model: 'vision' };
  for (const body of [{ ...valid, imageB: undefined }, { ...valid, imageB: { name: 'bad', dataUrl: 'bad' } }, { ...valid, imageC: image }, { ...valid, promptId: 'photography-review' }]) assert.equal((await post(base, '/api/compare', body)).status, 400);
  assert.equal(calls, 0); assert.equal((await post(base, '/api/compare', valid)).status, 502); assert.equal(store.list().length, 0);
});
test('Compare model errors preserve state and deletion during inference cannot recreate it', async t => {
  const store = new SessionStore(join(directory(t), 'sessions.sqlite')), saved = store.create(fixture()), safe = store.create(fixture('feedback'));
  let release, started, offline = true;
  const entered = new Promise(resolve => { started = resolve; });
  const base = await serve(t, store, { complete: async request => {
    if (offline) throw new AppError('Selected vision model is unavailable', 409);
    assert.deepEqual(pairs(request.messages), [png, jpeg]); started(); return new Promise(resolve => { release = () => resolve({ raw: 'Late reply' }); });
  } });
  const body = { sessionId: saved.id, revision: 1, message: 'Image B?', requestId: 'test' };
  assert.equal((await post(base, '/api/chat', body)).status, 409); assert.deepEqual(store.get(saved.id), saved);
  offline = false; const pending = post(base, '/api/chat', body); await entered; store.delete(saved.id, 1); release();
  assert.equal((await pending).status, 404); assert.throws(() => store.get(saved.id), e => e.status === 404); assert.deepEqual(store.get(safe.id), safe);
});
