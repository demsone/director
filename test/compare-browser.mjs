import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { randomUUID, createHash } from 'node:crypto';
import { SessionStore } from '../src/store.mjs';
import { legacyModules } from './helpers/v2-fixture.mjs';

if (!process.env.PLAYWRIGHT_PATH) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PATH)));
const port = Number(process.env.DIRECTOR_V3_TEST_PORT || 4183), base = `http://127.0.0.1:${port}`;
const directory = await mkdtemp(join(tmpdir(), 'director-v3-live-')), evidence = resolve('verification/v3');
await mkdir(evidence, { recursive: true });
const bytesA = await readFile('assets/img/image.jpg.jpg');
const sourceA = `data:image/jpeg;base64,${bytesA.toString('base64')}`;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const legacy = await legacyModules(directory), oldStore = new legacy.SessionStore(join(directory, 'sessions.sqlite'));
const oldReport = JSON.parse(await readFile('verification/v2/persistence-browser-report.json', 'utf8'));
const now = new Date().toISOString();
const preserved = oldStore.create({ id: randomUUID(), createdAt: now, updatedAt: now, title: 'Existing V2 feedback', image: { name: 'v2-source.jpg', sourceDataUrl: sourceA, dataUrl: sourceA, width: 549, height: 330, reviewWidth: 549, reviewHeight: 330 }, prompt: legacy.getPrompt('photography-review'), systemInstruction: legacy.systemInstruction, model: 'qwen3-vl-8b-instruct', modelInfo: { provider: 'LM Studio', contextLength: 8192 }, feedback: oldReport.feedback, chat: oldReport.priorChat });
oldStore.close();
let server, browser, page, logs = '', compare, continued, sourceB;
const result = { passed: false, startedAt: now, steps: [], replies: [], pids: [] }, errors = [];
async function start() {
  server = spawn(process.execPath, ['server.mjs'], { cwd: resolve('.'), env: { ...process.env, PORT: String(port), DIRECTOR_DATA_DIR: directory }, stdio: ['ignore', 'pipe', 'pipe'] });
  result.pids.push(server.pid); server.stdout.on('data', b => { logs += b; }); server.stderr.on('data', b => { logs += b; });
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await (await fetch(base + '/api/health')).json()).app === 'director-v3') return; } catch {}
    await delay(50);
  }
  throw new Error('Director did not start. ' + logs);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const exit = once(server, 'exit'); server.kill('SIGTERM'); const timeout = setTimeout(() => server.kill('SIGKILL'), 5000); await exit; clearTimeout(timeout);
  await assert.rejects(fetch(base + '/api/health'));
}
async function openBrowser() {
  browser = await chromium.launch({ headless: true }); page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }); page.setDefaultTimeout(15000);
  page.on('pageerror', e => errors.push(e.message)); await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('#prompt option').length === 3 && !document.querySelector('#history-status').textContent.startsWith('Loading'));
}
async function restart() { await browser.close(); await stop(); await start(); await openBrowser(); }
const row = id => page.locator(`[data-session-id="${id}"]`);
async function action(path, fn, method = 'POST') {
  const pending = page.waitForResponse(r => r.url().endsWith(path) && r.request().method() === method, { timeout: 260000 });
  await fn(); const response = await pending, data = await response.json(); assert.equal(response.status(), 200, data.error || 'Request failed');
  await page.locator('#cancel').waitFor({ state: 'hidden' }); return data;
}
async function get(id) { const response = await fetch(`${base}/api/sessions/${id}`); assert.equal(response.status, 200); return (await response.json()).session; }
async function openSaved(id) { return action(`/api/sessions/${id}`, () => row(id).getByRole('button', { name: 'Open', exact: true }).click(), 'GET'); }
async function chat(text) { await page.fill('#message', text); const data = await action('/api/chat', () => page.click('#send')); result.replies.push(data.turn.content); console.log(`Compare reply ${result.replies.length}: ${data.turn.content}`); return data.session; }
const prohibited = /\bcandid\b|clearly intentional|accidental clutter|deliberately framed|perfectly timed|captured more deliberately|you waited for|you meant to/i;
try {
  let occupied = false; try { await fetch(base + '/api/health'); occupied = true; } catch {}
  assert.equal(occupied, false, 'Choose an unused DIRECTOR_V3_TEST_PORT.');
  await start(); await openBrowser(); await openSaved(preserved.id);
  assert.deepEqual(await get(preserved.id), preserved);
  assert.equal(await page.locator('#mode').inputValue(), 'feedback'); assert.equal(await page.locator('.turn').count(), preserved.chat.length);
  result.steps.push('Session generated by tagged V2 store opens unchanged after schema migration, including image, old prompt and prior chat');
  await page.selectOption('#mode', 'compare');
  assert.equal(await page.locator('#image-b-panel').isVisible(), true); assert.equal(await page.locator('#prompt option').count(), 2);
  await page.setInputFiles('#image-file', { name: 'image-a.jpg', mimeType: 'image/jpeg', buffer: bytesA });
  await page.waitForFunction(() => !document.querySelector('#image-file').disabled);
  assert.equal(await page.locator('#review').isDisabled(), true);
  await page.setInputFiles('#image-file-b', { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  assert.match(await page.locator('#error').textContent(), /JPEG/);
  await page.setInputFiles('#image-file-b', { name: 'temporary-b.jpg', mimeType: 'image/jpeg', buffer: bytesA });
  await page.waitForFunction(() => !document.querySelector('#review').disabled);
  // A deterministic, clearly different image makes A/B identity objectively testable.
  sourceB = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 640; c.height = 400; const x = c.getContext('2d'); x.fillStyle = '#f4f1e8'; x.fillRect(0, 0, 640, 400); x.fillStyle = '#e12d2d'; x.fillRect(70, 110, 180, 180); x.fillStyle = '#205de3'; x.beginPath(); x.arc(475, 200, 95, 0, Math.PI * 2); x.fill(); return c.toDataURL('image/png'); });
  const bytesB = Buffer.from(sourceB.split(',')[1], 'base64'); await writeFile(join(evidence, 'image-b-test-fixture.png'), bytesB);
  await page.evaluate(({ bytes }) => { const dt = new DataTransfer(); dt.items.add(new File([new Uint8Array(bytes)], 'image-b.png', { type: 'image/png' })); document.querySelector('#drop-zone-b').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); }, { bytes: [...bytesB] });
  await page.waitForFunction(() => document.querySelector('#image-name-b').textContent.startsWith('image-b.png') && !document.querySelector('#review').disabled);
  await page.selectOption('#prompt', 'compare-general');
  if (process.env.DIRECTOR_TEST_MODEL) await page.selectOption('#model', process.env.DIRECTOR_TEST_MODEL);
  result.model = await page.locator('#model').inputValue();
  result.modelLabel = await page.locator('#model option:checked').textContent();
  console.log('Generating real comparison with a photograph in A and distinct geometric artwork in B…');
  const began = Date.now(); compare = (await action('/api/compare', () => page.click('#review'))).session;
  result.compareSeconds = (Date.now() - began) / 1000;
  assert.equal(compare.type, 'compare'); assert.equal(compare.feedback.sections.length, 11);
  assert.equal(compare.image.sourceDataUrl, sourceA); assert.equal(compare.imageB.sourceDataUrl, sourceB);
  assert.match(compare.feedback.sections[1].content, /yellow|fabric|cloth|chair/i);
  assert.match(compare.feedback.sections[2].content, /circle|square/i); assert.match(compare.feedback.sections[2].content, /blue|red/i);
  assert.doesNotMatch(compare.feedback.raw, prohibited);
  result.steps.push('Two previews, one-image prevention, invalid B rejection and B drag/drop replacement; real 11-section comparison demonstrably distinguishes photographic A from geometric B');
  await chat('For Image A only, name the main coloured object and describe what sits to its right. We will call this comparison "Pair study". Keep the reply short.');
  assert.match(result.replies[0], /yellow/i); assert.match(result.replies[0], /chair/i);
  const beforeRestart = await chat('For Image B only, what are the two forms and their colours, and which one is nearer the right edge? Do not describe Image A. Keep it brief.');
  assert.match(result.replies[1], /red/i); assert.match(result.replies[1], /square/i); assert.match(result.replies[1], /blue/i); assert.match(result.replies[1], /circle/i);
  assert.doesNotMatch(result.replies[1], /yellow|cloth|chair/i);
  result.steps.push('Two separate real follow-ups correctly identify A yellow cloth/chair and B red square/blue circle without swapping them');
  await restart(); await openSaved(compare.id);
  assert.deepEqual(await get(compare.id), beforeRestart);
  assert.equal(await page.locator('#preview').getAttribute('src'), sourceA); assert.equal(await page.locator('#preview-b').getAttribute('src'), sourceB);
  assert.equal(await page.locator('#raw').textContent(), compare.feedback.raw); assert.equal(await page.locator('.turn').count(), 4);
  continued = await chat('What did we call this comparison? Look again at Image B\'s right edge: describe the form there. How does its colour relate to the main coloured object in Image A? Keep it brief.');
  assert.match(result.replies[2], /Pair study/i); assert.match(result.replies[2], /blue/i); assert.match(result.replies[2], /circle/i); assert.match(result.replies[2], /yellow/i);
  for (const reply of result.replies) assert.doesNotMatch(reply, prohibited);
  result.steps.push('Full server/browser restart restores both images, exact comparison and prior chat; new real follow-up retains B right-edge detail, A colour and prior pair name');
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: join(evidence, 'reopened-compare.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); await page.screenshot({ path: join(evidence, 'compare-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  const renamed = 'Pair study — durable comparison'; page.once('dialog', d => d.accept(renamed));
  await action(`/api/sessions/${compare.id}`, () => row(compare.id).getByRole('button', { name: 'Rename', exact: true }).click(), 'PATCH');
  await restart(); assert.match(await row(compare.id).innerText(), /Pair study — durable comparison/); await openSaved(compare.id); assert.equal(await page.locator('.turn').count(), 6);
  page.once('dialog', d => d.accept()); await action(`/api/sessions/${compare.id}`, () => row(compare.id).getByRole('button', { name: 'Delete', exact: true }).click(), 'DELETE');
  assert.equal(await page.locator('#preview').isHidden(), true); assert.equal(await page.locator('#preview-b').isHidden(), true);
  await restart(); assert.equal(await row(compare.id).count(), 0); await openSaved(preserved.id); assert.deepEqual(await get(preserved.id), preserved);
  assert.equal(digest(await readFile('assets/img/image.jpg.jpg')), digest(bytesA));
  result.steps.push('Rename survives restart; deletion survives another restart; unrelated genuine V2 Feedback and original source file remain unchanged');
  await browser.close(); browser = null; await stop();
  const store = new SessionStore(join(directory, 'sessions.sqlite'));
  try { assert.equal(store.db.prepare('SELECT count(*) n FROM assets WHERE session_id=?').get(compare.id).n, 0); assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2); assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok'); } finally { store.close(); }
  assert.deepEqual(errors, []);
  Object.assign(result, { passed: true, model: compare.model, feedback: compare.feedback, chat: continued.chat, imageA: { fixture: 'assets/img/image.jpg.jpg', sha256: digest(bytesA) }, imageB: { fixture: 'verification/v3/image-b-test-fixture.png', sha256: digest(bytesB) }, unchangedV2SessionId: preserved.id, compareSessionId: compare.id, deletedCompareAssets: 0, survivingFeedbackAssets: 2, integrityCheck: 'ok', consoleErrors: errors });
} catch (error) { result.error = error.stack; console.error(error); process.exitCode = 1; if (browser) await page.screenshot({ path: join(evidence, 'failure.png'), fullPage: true }).catch(() => {}); }
finally { await browser?.close(); await stop(); await writeFile(join(evidence, 'compare-browser-report.json'), JSON.stringify(result, null, 2)); if (result.passed) await rm(directory, { recursive: true, force: true }); else console.log(`Retained failed test data: ${directory}`); }
console.log(JSON.stringify({ passed: result.passed, steps: result.steps, pids: result.pids, error: result.error }, null, 2));
