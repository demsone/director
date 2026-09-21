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

const testModel = process.env.DIRECTOR_TEST_MODEL || 'qwen3-vl-8b-instruct';
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(playwrightPath)));
const port = Number(process.env.DIRECTOR_V3_TEST_PORT || 4183);
const base = `http://127.0.0.1:${port}`;
const directory = await mkdtemp(join(tmpdir(), 'director-v3-live-'));
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v3');
await mkdir(evidence, { recursive: true });

const bytesA = await readFile('assets/img/image.jpg.jpg');
const sourceA = `data:image/jpeg;base64,${bytesA.toString('base64')}`;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const legacy = await legacyModules(directory);
const oldStore = new legacy.SessionStore(join(directory, 'sessions.sqlite'));
const oldReport = JSON.parse(await readFile('verification/v2/persistence-browser-report.json', 'utf8'));
const now = new Date().toISOString();
const preserved = oldStore.create({
  id: randomUUID(), createdAt: now, updatedAt: now, title: 'Existing V2 feedback',
  image: { name: 'v2-source.jpg', sourceDataUrl: sourceA, dataUrl: sourceA, width: 549, height: 330, reviewWidth: 549, reviewHeight: 330 },
  prompt: legacy.getPrompt('photography-review'), systemInstruction: legacy.systemInstruction,
  model: testModel, modelInfo: { provider: 'LM Studio', contextLength: 8192 },
  feedback: oldReport.feedback, chat: oldReport.priorChat
});
oldStore.close();

let server; let browser; let page; let logs = ''; let compare; let beforeRestart; let sourceB;
const result = { passed: false, startedAt: now, steps: [], replies: [], pids: [] };
const pageErrors = [];
let compareRequestCount = 0;

async function start() {
  server = spawn(process.execPath, ['server.mjs'], { cwd: resolve('.'), env: { ...process.env, PORT: String(port), DIRECTOR_DATA_DIR: directory }, stdio: ['ignore', 'pipe', 'pipe'] });
  result.pids.push(server.pid); server.stdout.on('data', chunk => { logs += chunk; }); server.stderr.on('data', chunk => { logs += chunk; });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await (await fetch(`${base}/api/health`)).json()).app === 'director-v4') return; } catch {}
    await delay(50);
  }
  throw new Error(`Director did not start. ${logs}`);
}

async function stop() {
  if (!server || server.exitCode !== null) return;
  const exit = once(server, 'exit'); server.kill('SIGTERM');
  const timeout = setTimeout(() => server.kill('SIGKILL'), 5000); await exit; clearTimeout(timeout);
}

async function openBrowser() {
  browser = await chromium.launch({ headless: true }); page = await browser.newPage({ viewport: { width: 1512, height: 1100 } }); page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => { if (request.method() === 'POST' && request.url().endsWith('/api/compare')) compareRequestCount += 1; });
  await page.goto(base); await page.waitForFunction(() => document.querySelector('#model')?.value && document.body.dataset.screen === 'feedback-new');
}

async function restart() { await browser.close(); browser = null; await stop(); await start(); await openBrowser(); }

async function get(id) { const response = await fetch(`${base}/api/sessions/${id}`); assert.equal(response.status, 200); return (await response.json()).session; }

async function apiAction(path, fn, method = 'POST', timeout = 180000) {
  const responsePromise = page.waitForResponse(response => response.url().endsWith(path) && response.request().method() === method, { timeout });
  await fn(); const response = await responsePromise; const data = await response.json();
  assert.equal(response.status(), 200, data.error || 'Request failed'); return data;
}

async function openSaved(id) {
  await page.goto(`${base}/?session=${encodeURIComponent(id)}&view=compare-detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-detail'); return get(id);
}

async function chooseCompare() {
  await page.locator('.source-frame a[aria-label="compare-new"]').first().click(); await page.waitForFunction(() => document.body.dataset.screen === 'compare-new');
}

async function chat(text) {
  const composer = page.locator('[data-name="prompt-text"] .text-content span').last(); await composer.fill(text);
  const data = await apiAction('/api/chat', () => page.locator('[data-name="enter-button"]').click()); result.replies.push(data.turn.content); return data.session;
}

const prohibited = /\bcandid\b|clearly intentional|accidental clutter|deliberately framed|perfectly timed|captured more deliberately|you waited for|you meant to/i;

try {
  let occupied = false; try { await fetch(`${base}/api/health`); occupied = true; } catch {}
  assert.equal(occupied, false, 'Choose an unused DIRECTOR_V3_TEST_PORT.');
  await start(); await openBrowser();
  const preservedBefore = await get(preserved.id); assert.equal(preservedBefore.type, 'feedback');
  result.steps.push('V2 Feedback remains readable through the V5 runtime before Compare begins');

  await chooseCompare(); assert.equal(await page.locator('#prompt option').count(), 2);
  await page.setInputFiles('#image-file', { name: 'image-a.jpg', mimeType: 'image/jpeg', buffer: bytesA });
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.dataset.imageA === name, 'image-a.jpg');
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click({ force: true }); await delay(250);
  assert.equal(compareRequestCount, 0, 'one image must never submit Compare'); assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /two valid images/i);

  await page.setInputFiles('#image-file-b', { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /JPEG/);
  sourceB = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 400; const context = canvas.getContext('2d'); context.fillStyle = '#f4f1e8'; context.fillRect(0, 0, 640, 400); context.fillStyle = '#e12d2d'; context.fillRect(70, 110, 180, 180); context.fillStyle = '#205de3'; context.beginPath(); context.arc(475, 200, 95, 0, Math.PI * 2); context.fill(); return canvas.toDataURL('image/png'); });
  const bytesB = Buffer.from(sourceB.split(',')[1], 'base64'); await writeFile(join(evidence, 'image-b-test-fixture.png'), bytesB);
  await page.setInputFiles('#image-file-b', { name: 'image-b.png', mimeType: 'image/png', buffer: bytesB });
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.dataset.imageB === name, 'image-b.png'); await page.selectOption('#prompt', 'compare-general');
  if (process.env.DIRECTOR_TEST_MODEL) await page.selectOption('#model', process.env.DIRECTOR_TEST_MODEL);
  await page.waitForFunction(() => document.querySelector('[data-name="action-bar"]')?.getAttribute('aria-disabled') === 'false');
  result.model = await page.locator('#model').inputValue(); result.modelLabel = await page.locator('#model option:checked').textContent();

  console.log('Generating one real V5 comparison with a photograph in A and distinct geometric artwork in B…');
  const began = Date.now(); compare = (await apiAction('/api/compare', () => page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click())).session; result.compareSeconds = (Date.now() - began) / 1000;
  assert.equal(compare.type, 'compare'); assert.equal(compare.feedback.sections.length, 11); assert.equal(compare.image.name, 'image-a.jpg'); assert.equal(compare.imageB.name, 'image-b.png'); assert.equal(compare.image.sourceDataUrl, sourceA); assert.equal(compare.imageB.sourceDataUrl, sourceB); assert.doesNotMatch(compare.feedback.raw, prohibited);
  assert.match(compare.feedback.sections[1].content, /yellow|fabric|cloth|chair/i, 'initial Image A review must contain image-specific evidence');
  assert.match(compare.feedback.sections[2].content, /circle/i, 'initial Image B review must identify the circle');
  assert.match(compare.feedback.sections[2].content, /square|rectangle/i, 'initial Image B review must identify the square or rectangle');
  assert.match(compare.feedback.sections[2].content, /blue|red/i, 'initial Image B review must contain its relevant colour evidence');
  result.steps.push('V5 Compare submits exactly two labelled sources and the real structured response distinguishes the A/B pair');

  await chat('For Image A only, name the main coloured object and describe what sits to its right. We will call this comparison "Pair study". Keep the reply short.'); assert.match(result.replies[0], /yellow/i); assert.match(result.replies[0], /chair/i);
  beforeRestart = await chat('For Image B only, what are the two forms and their colours, and which one is nearer the right edge? Do not describe Image A. Keep it brief.'); assert.match(result.replies[1], /red/i); assert.match(result.replies[1], /square|rectangle/i); assert.match(result.replies[1], /blue/i); assert.match(result.replies[1], /circle/i); assert.doesNotMatch(result.replies[1], /yellow|cloth|chair/i); for (const reply of result.replies) assert.doesNotMatch(reply, prohibited);
  result.steps.push('Two follow-ups retain deterministic A/B identity and critique-policy-safe language');

  await restart(); const reopened = await openSaved(compare.id); assert.deepEqual(reopened, beforeRestart); assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2); assert.deepEqual(await page.locator('[data-name="image.jpg"]:visible').evaluateAll(nodes => nodes.map(node => node.dataset.imageRole)), ['Image A', 'Image B']);
  const exactOutput = reopened.feedback.sections.map((section, index) => `${index + 1}. ${section.heading}\n${section.content}`).join('\n\n'); assert.equal(await page.locator('[data-name="output text"]').textContent(), exactOutput); assert.equal(await page.locator('[data-name="chat-transcript"] .director-chat-turn').count(), 4); result.steps.push('Full browser/server restart restores both images, exact comparison output and prior Compare chat');
  const continued = await chat('What did we call this comparison? Look again at Image B\'s right edge: describe the form there. How does its colour relate to the main coloured object in Image A? Keep it brief.'); assert.match(result.replies[2], /Pair study/i); assert.match(result.replies[2], /blue/i); assert.match(result.replies[2], /circle/i); assert.match(result.replies[2], /yellow/i); assert.doesNotMatch(result.replies[2], prohibited); result.steps.push('Later follow-up after restart retains A/B identity, prior chat context and the comparison name');

  await page.screenshot({ path: join(evidence, 'reopened-compare.png'), fullPage: true }); const preservedAfter = await get(preserved.id); assert.deepEqual(preservedAfter, preservedBefore, 'unrelated Feedback session must remain unchanged');
  const storeBeforeDelete = new SessionStore(join(directory, 'sessions.sqlite')); assert.equal(storeBeforeDelete.db.prepare('SELECT count(*) n FROM assets').get().n, 6); storeBeforeDelete.close();
  const deleteResponse = await fetch(`${base}/api/sessions/${compare.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: continued.revision }) }); assert.equal(deleteResponse.status, 200); assert.equal((await fetch(`${base}/api/sessions/${compare.id}`)).status, 404);
  await restart(); assert.equal((await fetch(`${base}/api/sessions/${compare.id}`)).status, 404); assert.deepEqual(await get(preserved.id), preservedBefore); await browser.close(); browser = null; await stop();
  const store = new SessionStore(join(directory, 'sessions.sqlite')); try { assert.equal(store.db.prepare('SELECT count(*) n FROM assets WHERE session_id=?').get(compare.id).n, 0); assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n, 2); assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok'); } finally { store.close(); }
  result.steps.push('API-supported deletion removes only Compare-owned assets and preserves V2 Feedback datastore integrity'); assert.deepEqual(pageErrors, []);
  Object.assign(result, { passed: true, model: compare.model, feedback: compare.feedback, chat: continued.chat, imageA: { fixture: 'assets/img/image.jpg.jpg', sha256: digest(bytesA) }, imageB: { fixture: 'verification/v3/image-b-test-fixture.png', sha256: digest(bytesB) }, unchangedV2SessionId: preserved.id, compareSessionId: compare.id, deletedCompareAssets: 4, survivingFeedbackAssets: 2, integrityCheck: 'ok', consoleErrors: pageErrors });
} catch (error) {
  result.error = error.stack; console.error(error); process.exitCode = 1; if (browser && page) await page.screenshot({ path: join(evidence, 'failure.png'), fullPage: true }).catch(() => {});
} finally {
  await browser?.close(); await stop(); await writeFile(join(evidence, 'compare-browser-report.json'), JSON.stringify(result, null, 2)); if (result.passed) await rm(directory, { recursive: true, force: true }); else console.log(`Retained failed test data: ${directory}`);
}
console.log(JSON.stringify({ passed: result.passed, steps: result.steps, pids: result.pids, error: result.error }, null, 2));
