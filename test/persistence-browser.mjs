import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm, copyFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { createHash } from 'node:crypto';
import { SessionStore } from '../src/store.mjs';

if (!process.env.PLAYWRIGHT_PATH) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PATH)));
const root = resolve('.'), port = Number(process.env.DIRECTOR_V2_TEST_PORT || 4181), base = `http://127.0.0.1:${port}`;
const directory = await mkdtemp(join(tmpdir(), 'director-v2-acceptance-'));
const evidence = resolve('verification/v2'); await mkdir(evidence, { recursive: true });
const originalPath = resolve('assets/img/image.jpg.jpg');
const original = await readFile(originalPath);
const sourceHash = createHash('sha256').update(original).digest('hex');
const upload = join(directory, 'test-source.jpg'); await copyFile(originalPath, upload);
let server, browser, page, logs = '', primary, other, savedBeforeRestart;
const steps = [], replies = [], errors = [], serverPids = [];
const result = { passed: false, startedAt: new Date().toISOString(), steps, replies, serverPids };
async function startServer() {
  server = spawn(process.execPath, ['server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port), DIRECTOR_DATA_DIR: directory }, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', b => { logs += b; }); server.stderr.on('data', b => { logs += b; });
  serverPids.push(server.pid);
  for (let n = 0; n < 100; n++) {
    if (server.exitCode !== null) throw new Error(`Test server failed: ${logs}`);
    try { if ((await (await fetch(base + '/api/health')).json()).app === 'director-v2') return; } catch {}
    await delay(50);
  }
  throw new Error(`Server did not start: ${logs}`);
}
async function stopServer() {
  if (!server || server.exitCode !== null) return;
  const exited = once(server, 'exit'); server.kill('SIGTERM');
  const killTimer = setTimeout(() => server.kill('SIGKILL'), 5000);
  await exited; clearTimeout(killTimer);
  await assert.rejects(fetch(base + '/api/health'), 'Director server must really be stopped');
}
async function openBrowser() {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }); page.setDefaultTimeout(15000);
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('#prompt option').length === 3 && !document.querySelector('#history-status').textContent.startsWith('Loading'));
}
async function restart() { await browser.close(); await stopServer(); await startServer(); await openBrowser(); }
async function request(path) { const r = await fetch(base + path); assert.equal(r.status, 200); return r.json(); }
async function action(path, fn, method = 'POST') {
  const received = page.waitForResponse(r => r.url().endsWith(path) && r.request().method() === method, { timeout: 260000 });
  await fn(); const response = await received; const data = await response.json();
  assert.equal(response.status(), 200, data.error || 'Request failed');
  await page.locator('#cancel').waitFor({ state: 'hidden' });
  await page.waitForFunction(() => !document.querySelector('#refresh-history').disabled);
  return data;
}
const row = id => page.locator(`[data-session-id="${id}"]`);
async function openSaved(id) {
  await action(`/api/sessions/${id}`, () => row(id).getByRole('button', { name: 'Open', exact: true }).click(), 'GET');
}
async function chat(message) {
  await page.fill('#message', message); const data = await action('/api/chat', () => page.click('#send'));
  replies.push(data.turn.content); console.log(`Live reply ${replies.length}: ${data.turn.content}`); return data.session;
}
try {
  // Refuse to test against an existing process; never stop a user's server.
  let occupied = false; try { await fetch(base + '/api/health'); occupied = true; } catch {}
  assert.equal(occupied, false, `Choose an unused DIRECTOR_V2_TEST_PORT (port ${port} is busy).`);
  await startServer(); await openBrowser();
  await page.waitForFunction(() => document.querySelector('#model').value);
  await page.setInputFiles('#image-file', upload);
  await page.waitForFunction(() => !document.querySelector('#review').disabled);
  await page.selectOption('#prompt', 'photography-review');
  console.log('Generating real persisted Photography critique…');
  const started = Date.now();
  primary = (await action('/api/feedback', () => page.click('#review'))).session;
  result.critiqueSeconds = (Date.now() - started) / 1000;
  assert.equal(primary.feedback.sections.length, 11); assert.equal(primary.revision, 1);
  assert.equal(primary.image.sourceDataUrl, `data:image/jpeg;base64,${original.toString('base64')}`);
  await chat('Let us call this photograph "Courtyard study". What is the colour of the hanging fabric, and where is the chair relative to it? Please answer briefly.');
  savedBeforeRestart = await chat('For Courtyard study, remember that I want to retain the chair and the full hanging fabric. Suggest one small tonal adjustment, keeping that intention in mind.');
  assert.equal(savedBeforeRestart.chat.length, 4); assert.equal(await row(primary.id).count(), 1);
  assert.match(replies[0], /yellow/i);
  steps.push('Real photo upload → selected Photography prompt → 11-section model feedback → two model chat turns → History entry');
  // A second genuine session proves isolation, including a different prompt category.
  await page.click('#new'); await page.selectOption('#prompt', 'general-review');
  await page.waitForFunction(() => !document.querySelector('#review').disabled);
  other = (await action('/api/feedback', () => page.click('#review'))).session;
  assert.notEqual(other.id, primary.id); assert.equal(other.prompt.id, 'general-review');
  steps.push('Second independent session created through a real General review of the same image');
  // Remove only the disposable upload copy. The user's fixture stays untouched.
  await rm(upload); await assert.rejects(access(upload));
  await restart();
  await openSaved(primary.id);
  assert.equal(await page.locator('#preview').getAttribute('src'), primary.image.sourceDataUrl);
  assert.equal(await page.locator('#feedback section').count(), 11);
  assert.equal(await page.locator('#raw').textContent(), primary.feedback.raw);
  assert.equal(await page.locator('.turn').count(), 4);
  assert.equal(await page.locator('#prompt-text').textContent(), primary.prompt.instruction);
  assert.deepEqual((await request(`/api/sessions/${primary.id}`)).session, savedBeforeRestart);
  steps.push('Complete server/browser shutdown and fresh launch restore original image, exact feedback, prompt and both chat exchanges; upload source no longer exists');
  const resumed = await chat('What name did we give this photograph, and what did I ask to retain? Looking again at the image, what colour is the fabric and where is the chair? Keep this brief.');
  assert.match(replies.at(-1), /Courtyard study/i); assert.match(replies.at(-1), /yellow/i); assert.match(replies.at(-1), /chair/i); assert.match(replies.at(-1), /fabric|cloth/i);
  assert.equal(resumed.chat.length, 6);
  steps.push('Real post-restart follow-up recalls the edit name and prior intention, and describes the original image');
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: join(evidence, 'reopened-session.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: join(evidence, 'history-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  const renamed = 'Courtyard study — saved across restarts';
  page.once('dialog', dialog => dialog.accept(renamed));
  await action(`/api/sessions/${primary.id}`, () => row(primary.id).getByRole('button', { name: 'Rename', exact: true }).click(), 'PATCH');
  await restart(); assert.match(await row(primary.id).innerText(), /Courtyard study — saved across restarts/);
  await openSaved(primary.id); assert.match(await page.locator('#save-status').textContent(), /Courtyard study — saved across restarts/);
  assert.equal(await page.locator('.turn').count(), 6);
  steps.push('Rename persists across another complete restart; all three chat exchanges retained');
  page.once('dialog', dialog => dialog.accept());
  await action(`/api/sessions/${primary.id}`, () => row(primary.id).getByRole('button', { name: 'Delete', exact: true }).click(), 'DELETE');
  assert.equal(await page.locator('#preview').isHidden(), true);
  await restart(); assert.equal(await row(primary.id).count(), 0); assert.equal(await row(other.id).count(), 1);
  assert.equal((await fetch(`${base}/api/sessions/${primary.id}`)).status, 404);
  await openSaved(other.id);
  assert.deepEqual((await request(`/api/sessions/${other.id}`)).session, other);
  assert.equal(createHash('sha256').update(await readFile(originalPath)).digest('hex'), sourceHash);
  steps.push('Deletion persists after restart; second session is byte-for-byte unchanged; original source file unchanged');
  await page.screenshot({ path: join(evidence, 'remaining-session.png'), fullPage: true });
  await browser.close(); browser = null; await stopServer();
  const store = new SessionStore(join(directory, 'sessions.sqlite'));
  try {
    assert.equal(store.db.prepare('SELECT count(*) n FROM assets WHERE session_id=?').get(primary.id).n, 0);
    assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2);
    assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
  } finally { store.close(); }
  assert.deepEqual(errors, []);
  Object.assign(result, { passed: true, model: primary.model, sourceSha256: sourceHash, feedback: primary.feedback, priorChat: savedBeforeRestart.chat, continuedChat: resumed.chat, primarySessionId: primary.id, unaffectedSessionId: other.id, consoleErrors: errors, integrityCheck: 'ok', deletedAssets: 0, remainingAssets: 2 });
} catch (error) {
  result.error = error.stack; console.error(error); process.exitCode = 1;
  if (page && browser) await page.screenshot({ path: join(evidence, 'failure.png'), fullPage: true }).catch(() => {});
} finally {
  await browser?.close(); await stopServer();
  await writeFile(join(evidence, 'persistence-browser-report.json'), JSON.stringify(result, null, 2));
  if (result.passed) await rm(directory, { recursive: true, force: true });
  else console.log(`Failed test database retained at ${directory}`);
}
console.log(JSON.stringify({ passed: result.passed, steps, serverPids, error: result.error }, null, 2));
