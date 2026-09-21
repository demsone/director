import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { prompts } from '../src/core.mjs';

const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(playwrightPath)));
const port = Number(process.env.DIRECTOR_V5_BATCH_2_TEST_PORT || 4186);
const base = `http://127.0.0.1:${port}`;
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v5/batch-2');
const dataDirectory = await mkdtemp('/tmp/director-v5-batch-2-');
const server = spawn(process.execPath, ['server.mjs'], {
  cwd: resolve('.'),
  env: { ...process.env, PORT: String(port), DIRECTOR_DATA_DIR: dataDirectory },
  stdio: ['ignore', 'pipe', 'pipe']
});
let logs = '';
server.stdout.on('data', chunk => { logs += chunk; });
server.stderr.on('data', chunk => { logs += chunk; });

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`V5 Batch 2 test server failed: ${logs}`);
    try {
      if ((await (await fetch(`${base}/api/health`)).json()).app === 'director-v4') return;
    } catch {}
    await new Promise(resolveDelay => setTimeout(resolveDelay, 50));
  }
  throw new Error(`V5 Batch 2 test server did not start: ${logs}`);
}

function response(body, status = 200) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

const comparePrompts = prompts.filter(prompt => prompt.sessionType === 'compare');
const imageBytes = await readFile('assets/img/image.jpg.jpg');
const imageA = `data:image/jpeg;base64,${imageBytes.toString('base64')}`;
const imageB = imageA;
const imageAPath = resolve('assets/img/image.jpg.jpg');
const imageBPath = resolve('assets/img/Value=image-6.jpg');
const imageAName = 'image.jpg.jpg';
const imageBName = 'Value=image-6.jpg';
const image = (name, sourceDataUrl) => ({ name, sourceDataUrl, dataUrl: sourceDataUrl, width: 1, height: 1, reviewWidth: 1, reviewHeight: 1 });
const sections = [
  { heading: 'First impression', content: 'Image A has the stronger opening rhythm.' },
  { heading: 'Structure', content: 'Image B has a clearer structural centre.' },
  { heading: 'Which reads more strongly, if either, and why', content: 'The comparison remains unresolved because the strengths differ.' }
];
let saved;
let compareRequests = [];
let chatRequests = [];
let compareAttempts = 0;
let chatAttempts = 0;

await waitForServer();
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 1100 }, locale: 'en-AU' });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
await page.route('**/api/**', async route => {
  const request = route.request();
  const url = new URL(request.url());
  if (request.method() === 'GET' && url.pathname === '/api/prompts') return route.fulfill(response({ prompts }));
  if (request.method() === 'GET' && url.pathname === '/api/models') {
    return route.fulfill(response({ models: [
      { id: 'vision-model-one', name: 'Vision One' },
      { id: 'vision-model-two-with-a-deliberately-long-loaded-model-identifier', name: 'Vision Two' }
    ] }));
  }
  if (request.method() === 'GET' && url.pathname === '/api/sessions/compare-mock') return route.fulfill(response({ session: saved }));
  if (request.method() === 'POST' && url.pathname === '/api/compare') {
    const body = JSON.parse(request.postData());
    compareRequests.push(body);
    compareAttempts += 1;
    if (compareAttempts === 1) {
      await new Promise(resolveDelay => setTimeout(resolveDelay, 180));
      return route.fulfill(response({ error: 'Simulated Compare failure.' }, 502));
    }
    saved = {
      id: 'compare-mock',
      revision: 1,
      type: 'compare',
      createdAt: '2026-09-21T03:00:00.000Z',
      updatedAt: '2026-09-21T03:00:00.000Z',
      title: 'Actual A-B comparison',
      image: image(body.image.name, body.image.sourceDataUrl),
      imageB: image(body.imageB.name, body.imageB.sourceDataUrl),
      prompt: comparePrompts.find(prompt => prompt.id === body.promptId),
      model: body.model,
      feedback: { raw: 'mock raw comparison', sections },
      chat: []
    };
    return route.fulfill(response({ session: saved }));
  }
  if (request.method() === 'POST' && url.pathname === '/api/chat') {
    chatRequests.push(JSON.parse(request.postData()));
    chatAttempts += 1;
    if (chatAttempts === 1) return route.fulfill(response({ error: 'Simulated Compare chat failure.' }, 503));
    saved = { ...saved, revision: saved.revision + 1, updatedAt: '2026-09-21T03:01:00.000Z', chat: [
      { role: 'user', content: 'Keep Image A and Image B distinct.' },
      { role: 'assistant', content: 'I kept both image identities in context.' }
    ] };
    return route.fulfill(response({ session: saved }));
  }
  return route.continue();
});

async function screenshot(name) {
  await page.screenshot({ path: join(evidence, name), fullPage: true });
}

async function choosePair() {
  await page.setInputFiles('#image-file', imageAPath);
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.dataset.imageA === name, imageAName);
  await page.setInputFiles('#image-file-b', imageBPath);
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.textContent.includes(name), imageBName);
}

async function openCompareNew() {
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('#model')?.value && document.body.dataset.screen === 'feedback-new');
  await page.locator('.source-frame a[aria-label="compare-new"]').click();
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-new');
}

try {
  for (const [path, name] of [
    ['compare-new.html', 'donor-compare-new.png'],
    ['compare-thinking.html', 'donor-compare-thinking.png'],
    ['compare-complete.html', 'donor-compare-complete.png'],
    ['compare-detail.html', 'donor-compare-detail.png']
  ]) {
    await page.goto(`${base}/visual-v4/${path}`);
    await screenshot(name);
  }

  await openCompareNew();
  await screenshot('production-compare-new.png');
  assert.equal(await page.locator('#prompt option').count(), comparePrompts.length);
  await page.setInputFiles('#image-file', imageAPath);
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click({ force: true });
  assert.equal(compareRequests.length, 0, 'one image must never submit Compare');
  assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /two valid images/i);
  await page.setInputFiles('#image-file-b', { name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('no image') });
  await page.waitForSelector('[data-name="output text"][role="alert"]');
  assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /JPEG/);
  await choosePair();
  await page.selectOption('#model', 'vision-model-two-with-a-deliberately-long-loaded-model-identifier');
  await page.selectOption('#prompt', 'compare-edits');
  assert.equal(await page.locator('#prompt option').count(), comparePrompts.length);
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'CLEAR PROMPT' }).click();
  assert.equal(await page.locator('#prompt').inputValue(), '');
  assert.equal((await page.locator('[data-name="action-bar"] [data-name="photography-input"]').textContent()).trim(), 'Select prompt');
  await page.selectOption('#prompt', 'compare-general');
  await page.locator('[data-name="UI / Model Bar"]').press('Enter');
  assert.equal(await page.locator('#model').inputValue(), 'vision-model-one');
  await page.locator('[data-name="UI / Model Bar"]').press(' ');
  assert.equal(await page.locator('#model').inputValue(), 'vision-model-two-with-a-deliberately-long-loaded-model-identifier');
  const clearBefore = await page.locator('[data-name="Feedback / File"]').getAttribute('aria-disabled');
  assert.equal(clearBefore, 'false');
  await page.locator('[data-name="project-toolbar"] a').click();
  assert.match(await page.locator('[data-name="output text"]').textContent(), /Select 2 images/);
  assert.equal(await page.locator('#prompt').inputValue(), 'compare-general');
  await choosePair();
  await page.selectOption('#prompt', 'compare-general');
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click();
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-thinking');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  await screenshot('production-compare-thinking.png');
  await page.waitForSelector('[data-name="output text"][role="alert"]');
  assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /Simulated Compare failure/);
  await screenshot('production-compare-failure.png');

  await choosePair();
  await page.selectOption('#prompt', 'compare-general');
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click();
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-complete');
  assert.equal(compareRequests.at(-1).image.name, imageAName);
  assert.equal(compareRequests.at(-1).imageB.name, imageBName);
  assert.equal(compareRequests.at(-1).model, 'vision-model-two-with-a-deliberately-long-loaded-model-identifier');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  assert.equal(await page.locator('[data-name="Recommendations"]').isHidden(), true, 'recommendation fixtures must be hidden at runtime');
  assert.doesNotMatch(await page.locator('body').innerText(), /Director Recommendations|#1 · Option 1|#2 · Option 2/);
  assert.equal(await page.locator('[data-name="output text"]').textContent().then(text => text.includes('First impression') && text.includes('Structure') && text.includes('Which reads more strongly')), true);
  await screenshot('production-compare-complete.png');

  await page.goto(`${base}/?session=compare-mock&view=compare-detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-detail');
  assert.match(await page.locator('[data-name="header-title"]').textContent(), /Actual A-B comparison/);
  assert.match(await page.locator('[data-name="date-created"]').textContent(), /21 Sept 2026/);
  assert.match(await page.locator('[data-name="UI / Category Badge"]').textContent(), /COMPARE/);
  assert.match(await page.locator('[data-name="Body/13px"]').allTextContents().then(values => values.join(' ')), /Compare/);
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  assert.equal(await page.locator('[data-name="Recommendations"]').isHidden(), true);
  assert.doesNotMatch(await page.locator('body').innerText(), /Director Recommendations|#1 · Option 1|#2 · Option 2/);
  await screenshot('production-compare-detail.png');

  const composer = page.locator('[data-name="prompt-text"] .text-content span').last();
  await composer.fill('Keep Image A and Image B distinct.');
  await page.locator('[data-name="enter-button"]').click();
  await page.waitForSelector('[data-name="chat-transient-error"][role="alert"]');
  assert.match(await page.locator('[data-name="chat-transient-error"]').textContent(), /Simulated Compare chat failure/);
  await composer.fill('Keep Image A and Image B distinct.');
  await page.locator('[data-name="enter-button"]').click();
  await page.waitForSelector('[data-name="chat-transcript"] .director-chat-turn');
  assert.equal(chatRequests.at(-1).sessionId, 'compare-mock');
  assert.equal(await page.locator('[data-name="chat-transcript"] .director-chat-turn').count(), 2);
  await screenshot('production-compare-detail-after-chat.png');
  assert.deepEqual(pageErrors, []);
  assert.equal(saved.image.name, imageAName);
  assert.equal(saved.imageB.name, imageBName);
  console.log(JSON.stringify({
    passed: true,
    comparePrompts: comparePrompts.map(prompt => prompt.id),
    sectionsRendered: sections.length,
    requestOrder: [compareRequests.at(-1).image.name, compareRequests.at(-1).imageB.name],
    visibleErrors: ['one image', 'invalid image', 'Compare failure', 'chat failure'],
    screenshots: evidence
  }, null, 2));
} finally {
  await browser.close();
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
  await rm(dataDirectory, { recursive: true, force: true });
}
