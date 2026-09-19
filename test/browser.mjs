import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';

// Use an existing Playwright install; the application itself has no dependencies.
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs (see README).');
const { chromium } = await import(pathToFileURL(resolve(playwrightPath)));
const base = process.env.DIRECTOR_TEST_URL || 'http://127.0.0.1:4177';
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v2/v1-regression');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
page.setDefaultTimeout(15000);
const errors = [], requests = [], steps = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', request => {
  if (request.url().endsWith('/api/chat')) {
    const body = request.postDataJSON();
    requests.push({ sessionId: body.sessionId, revision: body.revision, requestId: body.requestId });
  }
});
page.on('dialog', dialog => dialog.accept());
let result = { passed: false, date: new Date().toISOString(), steps };
let createdSession;
async function action(path, fn) {
  const responsePromise = page.waitForResponse(r => r.url().endsWith(path) && r.request().method() === 'POST', { timeout: 260000 });
  await fn(); const response = await responsePromise; const data = await response.json();
  assert.equal(response.status(), 200, JSON.stringify(data));
  await page.locator('#cancel').waitFor({ state: 'hidden' });
  return data;
}
try {
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('#model').value && document.querySelectorAll('#prompt option').length === 3);
  assert.equal(await page.locator('#prompt optgroup').count(), 3);
  await page.selectOption('#prompt', 'design-review');
  assert.match(await page.locator('#prompt-text').textContent(), /typography/);
  await page.selectOption('#prompt', 'photography-review');
  await page.setInputFiles('#image-file', { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  assert.match(await page.locator('#error').textContent(), /JPEG/);
  const imagePath = process.env.DIRECTOR_TEST_IMAGE || resolve('assets/img/image.jpg.jpg');
  await page.setInputFiles('#image-file', imagePath);
  await page.waitForFunction(() => !document.querySelector('#review').disabled);
  const originalName = await page.locator('#image-name').textContent();
  // Replace via drag/drop, including repeat use of identical image bytes.
  const imageBytes = await readFile(imagePath);
  await page.evaluate(({ bytes }) => {
    const transfer = new DataTransfer(); transfer.items.add(new File([new Uint8Array(bytes)], 'source-photo.jpg', { type: 'image/jpeg' }));
    document.querySelector('#drop-zone').dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));
  }, { bytes: [...imageBytes] });
  await page.waitForFunction(() => document.querySelector('#image-name').textContent.startsWith('source-photo.jpg') && !document.querySelector('#review').disabled);
  assert.notEqual(await page.locator('#image-name').textContent(), originalName);
  steps.push('File selection, image decode and preview, invalid type rejection, prompt selection, drag/drop replacement');
  await page.screenshot({ path: join(evidence, 'ready.png'), fullPage: true });
  console.log('Starting real image review…');
  const start = Date.now();
  const { session } = await action('/api/feedback', () => page.click('#review'));
  createdSession = session.id;
  assert.equal(session.feedback.sections.length, 11);
  assert.equal(await page.locator('#feedback section').count(), 11);
  assert.equal(session.prompt.id, 'photography-review');
  assert.equal(await page.locator('#image-file').isDisabled(), true);
  assert.equal(await page.locator('#raw').textContent(), session.feedback.raw);
  const critiqueSeconds = (Date.now() - start) / 1000;
  console.log(`Real critique completed in ${critiqueSeconds}s; 11 sections.`);
  steps.push('Real local vision critique: 11 populated sections; complete response shown; image/prompt/model locked together');
  const questions = [
    'For our conversation, call my preferred edit "Courtyard study". Looking at the photograph, what colour is the hanging fabric, where is the chair relative to it, and where is the air conditioner? Give a short answer based on what you can actually see.',
    'What did I call my preferred edit in my previous message? For that edit, should I keep the chair in the crop? Refer to the photograph and your original feedback. Keep it brief.'
  ];
  const replies = [];
  for (const question of questions) {
    await page.fill('#message', question);
    const data = await action('/api/chat', () => page.click('#send'));
    replies.push(data.turn.content); console.log(`Follow-up ${replies.length}: ${data.turn.content}`);
  }
  assert.match(replies[0], /yellow|mustard/i);
  assert.match(replies[0], /right/i);
  assert.match(replies[1], /Courtyard study/i);
  assert.equal(await page.locator('.turn').count(), 4);
  assert.deepEqual(requests.map(r => r.revision), [1, 2]);
  assert.ok(requests.every(r => r.sessionId === session.id && r.requestId));
  steps.push('Two real image-aware follow-ups: visible colours/positions and prior conversation recalled; same saved session used');
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: join(evidence, 'feedback-and-chat.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: join(evidence, 'mobile.png'), fullPage: true });
  steps.push('Desktop and mobile rendering; no mobile horizontal overflow');
  // Controlled failure only after the live acceptance flow, to verify recovery without losing context.
  await page.route('**/api/chat', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'Test: local model unavailable.' }) }));
  await page.fill('#message', 'Keep this draft if the model is unavailable.');
  await page.click('#send'); await page.locator('#error').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.turn').count(), 4);
  assert.equal(await page.locator('#message').inputValue(), 'Keep this draft if the model is unavailable.');
  assert.equal(await page.locator('#feedback section').count(), 11);
  await page.unroute('**/api/chat');
  steps.push('Simulated model failure preserves source, review, chat and draft');
  await page.locator(`[data-session-id="${session.id}"]`).getByRole('button', { name: 'Open', exact: true }).click();
  await page.locator('#cancel').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#message').inputValue(), 'Keep this draft if the model is unavailable.');
  steps.push('Reopening the current saved session refreshes context without discarding the unsent draft');
  await page.click('#new');
  assert.equal(await page.locator('#feedback section').count(), 0);
  assert.equal(await page.locator('#preview').isVisible(), true);
  assert.equal(await page.locator('#chat-section').isHidden(), true);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('#prompt option').length === 3);
  assert.equal(await page.locator('#preview').isHidden(), true);
  assert.equal(await page.locator('#feedback section').count(), 0);
  await page.waitForFunction(id => !!document.querySelector(`[data-session-id="${id}"]`), session.id);
  steps.push('New critique keeps image for repeat use; reload clears active view but session remains in History; no browser storage');
  assert.deepEqual(errors, []);
  result = { ...result, passed: true, model: session.model, prompt: session.prompt, image: { name: session.image.name, fixture: imagePath }, critiqueSeconds, feedback: session.feedback, questions, replies, requests: requests.slice(0, 2), consoleErrors: errors };
} catch (error) {
  result.error = error.stack; console.error(error);
  await page.screenshot({ path: join(evidence, 'failure.png'), fullPage: true });
  process.exitCode = 1;
} finally {
  await writeFile(join(evidence, 'live-browser-report.json'), JSON.stringify(result, null, 2));
  if (createdSession && result.passed) {
    const saved = await (await fetch(`${base}/api/sessions/${createdSession}`)).json();
    const deletion = await fetch(`${base}/api/sessions/${createdSession}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: saved.session.revision }) });
    assert.equal(deletion.status, 200);
  }
  await browser.close();
}
console.log(JSON.stringify({ passed: result.passed, steps: result.steps, error: result.error }, null, 2));
