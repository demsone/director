import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SessionStore } from '../src/store.mjs';
import { getPrompt, parseFeedback, systemInstruction } from '../src/core.mjs';
import { createApp } from '../server.mjs';
import { v3Modules } from './helpers/v3-fixture.mjs';
import { legacyModules } from './helpers/v2-fixture.mjs';

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
function fixture(type = 'feedback') {
  const prompt = getPrompt(type === 'compare' ? 'compare-general' : 'photography-review', type), now = new Date().toISOString();
  const image = { name: 'fixture.png', dataUrl: png, sourceDataUrl: png };
  return { id: randomUUID(), type, title: type, createdAt: now, updatedAt: now, image, ...(type === 'compare' ? { imageB: image } : {}), prompt, systemInstruction, model: 'vision', feedback: parseFeedback(JSON.stringify(Object.fromEntries(prompt.sections.map((s, i) => [`section_${i+1}`, s]))), prompt), chat: [] };
}
function directory(t) { const dir = mkdtempSync(join(tmpdir(), 'director-v4-test-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; }
function counts(s) { return ['sessions','assets','project_sessions','library_sessions'].map(table => s.db.prepare(`SELECT count(*) n FROM ${table}`).get().n); }

test('Tagged V3 Feedback and Compare migrate byte-for-byte with empty organisation, idempotently', async t => {
  const dir = directory(t), path = join(dir, 'sessions.sqlite'), old = await v3Modules(dir);
  const legacy = new old.SessionStore(path); const saved = [legacy.create(fixture()), legacy.create(fixture('compare'))];
  const rows = legacy.db.prepare('SELECT * FROM sessions ORDER BY id').all(), assets = legacy.db.prepare('SELECT * FROM assets ORDER BY session_id,role').all(); legacy.close();
  for (let i = 0; i < 2; i++) {
    const store = new SessionStore(path);
    try {
      assert.equal(store.db.prepare('PRAGMA user_version').get().user_version, 3);
      assert.deepEqual(store.db.prepare('SELECT * FROM sessions ORDER BY id').all(), rows);
      assert.deepEqual(store.db.prepare('SELECT * FROM assets ORDER BY session_id,role').all(), assets);
      for (const s of saved) { assert.deepEqual(store.get(s.id), s); assert.deepEqual(store.memberships(s.id), { projectIds: [], libraryIds: [] }); }
    } finally { store.close(); }
  }
});
test('Failed organisation migration rolls back the entire upgrade from both V2 and V3', async t => {
  for (const [name, modules] of [['v2', legacyModules], ['v3', v3Modules]]) {
    const dir = join(directory(t), name), old = await modules(dir), path = join(dir, 'sessions.sqlite');
    let legacy = new old.SessionStore(path); const saved = legacy.create(fixture());
    const version = legacy.db.prepare('PRAGMA user_version').get().user_version;
    legacy.db.exec('CREATE TABLE projects (block TEXT)'); legacy.close();
    assert.throws(() => new SessionStore(path), /Existing data was not reset/);
    legacy = new old.SessionStore(path);
    try { assert.equal(legacy.db.prepare('PRAGMA user_version').get().user_version, version); assert.deepEqual(legacy.get(saved.id), saved); }
    finally { legacy.close(); }
  }
});
test('Multiple Projects and both Libraries reference one canonical record across rename, chat and restart', t => {
  const path = join(directory(t), 'sessions.sqlite'); let s = new SessionStore(path);
  const a = s.create(fixture()), b = s.create(fixture('compare')), p = s.createProject('Test Project'), q = s.createProject('Second');
  for (const id of [a.id, b.id]) s.setMembership('projects', p.id, id, true);
  s.setMembership('projects', q.id, a.id, true);
  for (const id of ['photography', 'design']) s.setMembership('libraries', id, a.id, true);
  s.setMembership('libraries', 'design', b.id, true);
  assert.deepEqual(counts(s), [2,6,3,3]); assert.deepEqual(s.get(a.id), a);
  s.rename(a.id, 'Canonical title', 1); s.append(a.id, 2, 'Question', 'Answer', 'turn', {});
  s.append(b.id, 1, 'B?', 'B answer', 'compare-turn', {});
  const rev = s.projectRow(p.id).revision; s.renameProject(p.id, 'Renamed Project', rev); s.close(); s = new SessionStore(path);
  try {
    assert.equal(s.organisation().projects.find(x => x.id === p.id).name, 'Renamed Project');
    for (const [kind,id] of [['projects',p.id],['projects',q.id],['libraries','photography'],['libraries','design']]) assert.equal(s.organisedSessions(kind,id).sessions.find(x => x.id === a.id).title, 'Canonical title');
    assert.equal(s.get(a.id).chat.length,2); assert.equal(s.get(b.id).chat.length,2); assert.deepEqual(counts(s),[2,6,3,3]);
  } finally { s.close(); }
});
test('Duplicate assignment/removal are idempotent; project deletion preserves sessions; session deletion cascades', t => {
  const path = join(directory(t), 'sessions.sqlite'); let s = new SessionStore(path);
  const a = s.create(fixture()), safe = s.create(fixture('compare')), p = s.createProject('Project'), q = s.createProject('Other');
  for (let i=0;i<2;i++) { s.setMembership('projects',p.id,a.id,true); s.setMembership('libraries','photography',a.id,true); }
  assert.deepEqual(counts(s),[2,6,1,1]);
  for(let i=0;i<2;i++) s.setMembership('projects',p.id,a.id,false);
  assert.deepEqual(s.get(a.id),a); s.setMembership('projects',p.id,a.id,true);
  s.setMembership('projects',q.id,a.id,true); s.setMembership('projects',q.id,safe.id,true);
  s.deleteProject(p.id,s.projectRow(p.id).revision); assert.deepEqual(s.get(a.id),a);
  s.delete(a.id,1); s.close(); s = new SessionStore(path);
  try { assert.deepEqual(counts(s),[1,4,1,0]); assert.deepEqual(s.get(safe.id),safe); assert.equal(s.organisation().projects.length,1); assert.deepEqual(s.db.prepare('PRAGMA foreign_key_check').all(),[]); }
  finally { s.close(); }
});
test('Missing IDs, deleted Projects and stale Project edits fail without damaging canonical sessions', t => {
  const s = new SessionStore(join(directory(t),'sessions.sqlite'));
  try {
    const a=s.create(fixture()), p=s.createProject('Project');
    assert.throws(()=>s.setMembership('projects',p.id,randomUUID(),true),e=>e.status===404);
    assert.throws(()=>s.setMembership('projects',randomUUID(),a.id,true),e=>e.status===404);
    assert.throws(()=>s.setMembership('libraries','custom',a.id,true),e=>e.status===400);
    s.renameProject(p.id,'New',1); assert.throws(()=>s.deleteProject(p.id,1),e=>e.status===409);
    s.deleteProject(p.id,2); assert.throws(()=>s.setMembership('projects',p.id,a.id,true),e=>e.status===404);
    assert.deepEqual(s.get(a.id),a); assert.deepEqual(counts(s),[1,2,0,0]);
  } finally { s.close(); }
});
test('Corrupt Project is isolated and invalid organisation references are cleaned on reopen', t => {
  const path=join(directory(t),'sessions.sqlite'); let s=new SessionStore(path);
  const a=s.create(fixture()), p=s.createProject('Bad'), q=s.createProject('Good'); s.setMembership('projects',q.id,a.id,true);
  s.db.prepare('UPDATE projects SET updated_at=? WHERE id=?').run('broken',p.id);
  assert.ok(s.organisation().projects.find(x=>x.id===p.id).error); assert.throws(()=>s.organisedSessions('projects',p.id),e=>e.status===422);
  assert.equal(s.organisedSessions('projects',q.id).sessions.length,1); assert.equal(s.list().length,1);
  s.db.exec('PRAGMA foreign_keys=OFF; PRAGMA ignore_check_constraints=ON;');
  s.db.prepare('INSERT INTO project_sessions VALUES(?,?)').run(randomUUID(),a.id);
  s.db.prepare('INSERT INTO project_sessions VALUES(?,?)').run(q.id,randomUUID());
  s.db.prepare('INSERT INTO library_sessions VALUES(?,?)').run('bad',a.id);
  s.db.prepare('INSERT INTO library_sessions VALUES(?,?)').run('design',randomUUID()); s.close(); s=new SessionStore(path);
  try { assert.deepEqual(counts(s),[1,2,1,0]); assert.deepEqual(s.get(a.id),a); s.deleteProject(p.id,1); assert.equal(s.organisation().projects.length,1); }
  finally { s.close(); }
});
test('Interrupted membership transaction rolls back and leaves sessions and Project revision unchanged', t => {
  const s=new SessionStore(join(directory(t),'sessions.sqlite'));
  try {
    const a=s.create(fixture()), p=s.createProject('Project');
    s.db.exec("CREATE TRIGGER fail_project_update BEFORE UPDATE ON projects BEGIN SELECT RAISE(ABORT,'interrupted'); END;");
    assert.throws(()=>s.setMembership('projects',p.id,a.id,true),e=>e.status===503);
    assert.deepEqual(s.get(a.id),a); assert.deepEqual(s.memberships(a.id),{projectIds:[],libraryIds:[]}); assert.equal(s.projectRow(p.id).revision,1);
  } finally { s.close(); }
});
test('Organisation HTTP routes preserve canonical session identity and enforce deletion semantics', async t => {
  const store=new SessionStore(join(directory(t),'sessions.sqlite')), a=store.create(fixture());
  const server=createApp({store,client:{}}); await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>new Promise(r=>{server.closeAllConnections();server.close(r);})); const base=`http://127.0.0.1:${server.address().port}`;
  async function request(path,method='GET',body) { const response=await fetch(base+path,{method,...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})}); return {status:response.status,data:await response.json()}; }
  assert.equal((await request('/api/projects','POST',{name:' '})).status,400);
  const {data:{project}}=await request('/api/projects','POST',{name:'Test Project'});
  assert.equal((await request(`/api/projects/${project.id}/sessions/${a.id}`,'PUT')).status,200);
  assert.equal((await request('/api/libraries/design/sessions/'+a.id,'PUT')).status,200);
  assert.equal((await request('/api/projects/'+project.id)).data.sessions[0].id,a.id);
  assert.deepEqual((await request('/api/sessions/'+a.id)).data.session,a);
  assert.equal((await request('/api/projects/'+project.id,'DELETE',{revision:2})).status,200);
  assert.deepEqual((await request('/api/sessions/'+a.id+'/memberships')).data,{projectIds:[],libraryIds:['design']});
  assert.equal((await request('/api/sessions/'+a.id,'DELETE',{revision:1})).status,200);
  assert.equal((await request('/api/libraries/design')).data.sessions.length,0);
});
