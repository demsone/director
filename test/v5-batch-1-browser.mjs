import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { prompts } from '../src/core.mjs';

const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(playwrightPath)));
const port = Number(process.env.DIRECTOR_V5_TEST_PORT || 4185);
const base = `http://127.0.0.1:${port}`;
const dataDirectory = await mkdtemp('/tmp/director-v5-batch-1-');
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
    if (server.exitCode !== null) throw new Error(`V5 test server failed: ${logs}`);
    try {
      if ((await (await fetch(`${base}/api/health`)).json()).app === 'director-v4') return;
    } catch {}
    await new Promise(resolveDelay => setTimeout(resolveDelay, 50));
  }
  throw new Error(`V5 test server did not start: ${logs}`);
}

function response(body, status = 200) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

const photography = prompts.find(prompt => prompt.id === 'photography-review');
let feedbackAttempts = 0;
let feedbackRequests = [];
let chatRequests = [];
const saved = {
  id: 'mock-session',
  createdAt: '2026-09-20T12:00:00.000Z',
  updatedAt: '2026-09-20T12:00:00.000Z',
  title: 'Actual saved session',
  image: null,
  prompt: photography,
  model: 'vision-model-two',
  feedback: { sections: [{ heading: 'First impression', content: 'A mocked saved observation.' }] },
  chat: []
};

await waitForServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 1321 }, locale: 'en-AU' });
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
      { id: 'vision-model-two', name: 'Vision Two' }
    ] }));
  }
  if (request.method() === 'GET' && url.pathname === `/api/sessions/${saved.id}`) {
    return route.fulfill(response({ session: saved }));
  }
  if (request.method() === 'POST' && url.pathname === '/api/feedback') {
    const body = JSON.parse(request.postData());
    feedbackRequests.push(body);
    feedbackAttempts += 1;
    if (feedbackAttempts === 1) return route.fulfill(response({ error: 'Simulated Feedback failure.' }, 502));
    saved.image = body.image;
    saved.prompt = prompts.find(prompt => prompt.id === body.promptId);
    saved.model = body.model;
    return route.fulfill(response({ session: { ...saved, chat: [] } }));
  }
  if (request.method() === 'POST' && url.pathname === '/api/chat') {
    chatRequests.push(JSON.parse(request.postData()));
    return route.fulfill(response({ error: 'Simulated chat failure.' }, 503));
  }
  return route.continue();
});

try {
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('#model')?.value && document.querySelectorAll('#prompt option').length === 3);

  const sourceType = page.locator('[data-name="photography-input"]');
  assert.equal((await sourceType.innerText()).trim(), 'Photography');
  await sourceType.click();
  assert.equal((await sourceType.innerText()).trim(), 'Design');
  assert.equal(await page.locator('#prompt').inputValue(), 'design-review');
  await sourceType.click();
  await sourceType.click();
  assert.equal((await sourceType.innerText()).trim(), 'Photography');
  assert.equal(await page.locator('#prompt').inputValue(), 'photography-review');

  await page.setInputFiles('#image-file', { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  await page.waitForFunction(() => document.querySelector('[data-name="output text"]')?.textContent.includes('JPEG'));
  const uploadError = page.locator('[data-name="output text"][role="alert"]');
  assert.equal(await uploadError.count(), 1);
  assert.equal(await uploadError.evaluate(node => Boolean(node.closest('[aria-hidden="true"]'))), false);

  const modelBar = page.locator('[data-name="UI / Model Bar"]');
  assert.match(await modelBar.innerText(), /vision-model-one/i);
  assert.equal(await modelBar.getAttribute('title'), 'Click to switch loaded model');
  await modelBar.click();
  assert.match(await modelBar.innerText(), /vision-model-two/i);
  assert.equal(await page.locator('#model').inputValue(), 'vision-model-two');
  await modelBar.press('Space');
  assert.match(await modelBar.innerText(), /vision-model-one/i);
  await modelBar.press('Enter');
  assert.match(await modelBar.innerText(), /vision-model-two/i);
  assert.match(await modelBar.getAttribute('aria-label'), /vision-model-two/);

  await page.setInputFiles('#image-file', resolve('assets/img/image.jpg.jpg'));
  await page.waitForFunction(() => Boolean(document.querySelector('[data-name="Feedback / File"]')?.style.backgroundImage));
  await page.locator('[data-name="action-bar"]').click();
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-new');
  const feedbackError = page.locator('[data-name="output text"][role="alert"]');
  assert.match(await feedbackError.textContent(), /Simulated Feedback failure/);
  assert.equal(await feedbackError.evaluate(node => Boolean(node.closest('[aria-hidden="true"]'))), false);

  await page.locator('[data-name="action-bar"]').click();
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-complete');
  assert.equal(feedbackRequests.at(-1).model, 'vision-model-two');
  assert.equal(feedbackRequests.at(-1).promptId, 'photography-review');

  const composer = page.locator('[data-name="prompt-text"] .text-content span').last();
  await composer.fill('Test a transient chat error.');
  await page.locator('[data-name="enter-button"]').click();
  await page.waitForSelector('[data-name="chat-transient-error"][role="alert"]');
  assert.match(await page.locator('[data-name="chat-transient-error"]').textContent(), /Simulated chat failure/);
  assert.equal(await page.locator('[data-name="chat-transcript"]').count(), 0);
  assert.equal(await page.locator('[data-name="chat-transient-error"]').evaluate(node => Boolean(node.closest('[aria-hidden="true"]'))), false);
  assert.equal(chatRequests.length, 1);

  await page.goto(`${base}/?session=${saved.id}&view=detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-detail');
  const subtitle = page.locator('[data-name="title-body"] [data-name="Body/12px"]');
  assert.equal((await subtitle.innerText()).trim(), 'Photograph review · 20 Sept 2026');
  assert.doesNotMatch(await page.locator('body').innerText(), /Street Photography Read · 06 Sept 2026/);
  assert.equal(await page.locator('[data-name="chat-transient-error"]').count(), 0);
  assert.deepEqual(pageErrors, []);
  console.log(JSON.stringify({
    passed: true,
    sourceType: 'Photography → Design → Photography synchronised',
    visibleErrors: ['invalid upload', 'Feedback failure', 'chat failure'],
    selectedModel: feedbackRequests.at(-1).model,
    detailSubtitle: await subtitle.innerText()
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
