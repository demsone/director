import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
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
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v5/batch-1');
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
let chatAttempts = 0;
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
await mkdir(evidence, { recursive: true });
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
    chatAttempts += 1;
    if (chatAttempts === 1 || chatAttempts === 3) return route.fulfill(response({ error: 'Simulated chat failure.' }, 503));
    saved.chat = [
      { role: 'user', content: 'Test a transient chat error.' },
      { role: 'assistant', content: 'A mocked Director response.' }
    ];
    return route.fulfill(response({ session: { ...saved, chat: saved.chat } }));
  }
  return route.continue();
});

async function chatGeometry() {
  return page.locator('[data-name="chat-transient-error"]').evaluate(node => {
    const section = node.closest('[data-name="prompt-section"]');
    const header = section?.querySelector('[data-name="top-bar"]');
    const transcript = section?.querySelector('[data-name="chat-transcript"]');
    const composer = section?.querySelector('[data-name="Prompt / Editor"]');
    const rect = node.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const transcriptRect = transcript?.getBoundingClientRect();
    const composerRect = composer?.getBoundingClientRect();
    const point = { x: rect.left + Math.min(rect.width / 2, 12), y: rect.top + Math.min(rect.height / 2, 12) };
    const hit = document.elementFromPoint(point.x, point.y);
    let clippedByAncestor = false;
    for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      const clipsX = style.overflowX !== 'visible';
      const clipsY = style.overflowY !== 'visible';
      const ancestorRect = ancestor.getBoundingClientRect();
      if ((clipsX && (rect.left < ancestorRect.left || rect.right > ancestorRect.right)) ||
          (clipsY && (rect.top < ancestorRect.top || rect.bottom > ancestorRect.bottom))) {
        clippedByAncestor = true;
        break;
      }
    }
    return {
      error: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
      header: headerRect && { top: headerRect.top, bottom: headerRect.bottom },
      transcript: transcriptRect && { top: transcriptRect.top, bottom: transcriptRect.bottom },
      composer: composerRect && { top: composerRect.top, bottom: composerRect.bottom },
      hitError: Boolean(hit && (hit === node || node.contains(hit))),
      clippedByAncestor,
      visible: getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).opacity !== '0'
    };
  });
}

function assertVisibleChatError(geometry, { existingTranscript = false } = {}) {
  assert.ok(geometry.visible, 'chat error must be rendered');
  assert.ok(geometry.error.width > 0 && geometry.error.height > 0, 'chat error must have a non-zero rendered box');
  assert.ok(geometry.header, 'Ask Director header must exist');
  assert.ok(geometry.error.top >= geometry.header.bottom - 0.5, 'chat error must start below the Ask Director header');
  assert.equal(geometry.hitError, true, 'elementFromPoint must resolve to the chat error');
  assert.equal(geometry.clippedByAncestor, false, 'chat error must not be clipped by an ancestor');
  assert.ok(geometry.composer, 'composer must exist');
  assert.ok(geometry.error.bottom <= geometry.composer.top + 0.5, 'chat error must remain above the composer');
  if (existingTranscript) {
    assert.ok(geometry.transcript, 'existing transcript must remain present');
    assert.ok(geometry.error.bottom <= geometry.transcript.top + 0.5, 'chat error must remain above the transcript');
  }
}

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

  const emptyLayoutBefore = await page.locator('[data-name="prompt-section"]').evaluate(section => {
    const header = section.querySelector('[data-name="top-bar"]').getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    return { header: { top: header.top, bottom: header.bottom, width: header.width, height: header.height }, section: { top: sectionRect.top, bottom: sectionRect.bottom, width: sectionRect.width, height: sectionRect.height } };
  });
  let composer = page.locator('[data-name="prompt-text"] .text-content span').last();
  await composer.fill('Test a transient chat error.');
  await page.locator('[data-name="enter-button"]').click();
  await page.waitForSelector('[data-name="chat-transient-error"][role="alert"]');
  assert.match(await page.locator('[data-name="chat-transient-error"]').textContent(), /Simulated chat failure/);
  assert.equal(await page.locator('[data-name="chat-transcript"]').count(), 0);
  assert.equal(await page.locator('[data-name="chat-transient-error"]').evaluate(node => Boolean(node.closest('[aria-hidden="true"]'))), false);
  assert.equal(await page.locator('[data-name="prompt-text"] [data-name="chat-transient-error"]').count(), 0);
  assert.equal(await composer.textContent(), 'Test a transient chat error.');
  const emptyGeometry = await chatGeometry();
  assertVisibleChatError(emptyGeometry);
  const emptyLayoutAfter = await page.locator('[data-name="prompt-section"]').evaluate(section => {
    const header = section.querySelector('[data-name="top-bar"]').getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    return { header: { top: header.top, bottom: header.bottom, width: header.width, height: header.height }, section: { top: sectionRect.top, bottom: sectionRect.bottom, width: sectionRect.width, height: sectionRect.height } };
  });
  assert.deepEqual(emptyLayoutAfter.header, emptyLayoutBefore.header, 'Ask Director header geometry must remain unchanged');
  assert.deepEqual(emptyLayoutAfter.section, emptyLayoutBefore.section, 'Ask Director outer section geometry must remain unchanged');
  await page.screenshot({ path: join(evidence, 'empty-transcript-chat-failure.png'), fullPage: true });
  assert.equal(chatRequests.length, 1);

  await page.locator('[data-name="enter-button"]').click();
  await page.waitForFunction(() => document.querySelectorAll('[data-name="chat-transcript"] .director-chat-turn').length === 2);
  assert.equal(await page.locator('[data-name="chat-transient-error"]').count(), 0);
  assert.equal(await page.locator('[data-name="prompt-text"] .text-content span').last().textContent(), '');
  assert.equal(saved.chat.length, 2);

  composer = page.locator('[data-name="prompt-text"] .text-content span').last();
  await composer.fill('Test a transient error with existing turns.');
  await page.locator('[data-name="enter-button"]').click();
  await page.waitForSelector('[data-name="chat-transient-error"][role="alert"]');
  assert.match(await page.locator('[data-name="chat-transient-error"]').textContent(), /Simulated chat failure/);
  assert.equal(await page.locator('[data-name="chat-transcript"] .director-chat-turn').count(), 2);
  assert.equal(await page.locator('[data-name="prompt-text"] [data-name="chat-transient-error"]').count(), 0);
  assert.equal(await composer.textContent(), 'Test a transient error with existing turns.');
  assertVisibleChatError(await chatGeometry(), { existingTranscript: true });
  assert.equal(saved.chat.length, 2, 'failed chat error must not be persisted');

  await page.goto(`${base}/?session=${saved.id}&view=detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-detail');
  const subtitle = page.locator('[data-name="title-body"] [data-name="Body/12px"]');
  assert.equal((await subtitle.innerText()).trim(), 'Photograph review · 20 Sept 2026');
  assert.doesNotMatch(await page.locator('body').innerText(), /Street Photography Read · 06 Sept 2026/);
  assert.equal(await page.locator('[data-name="chat-transient-error"]').count(), 0);
  assert.equal(await page.locator('[data-name="chat-transcript"] .director-chat-turn').count(), 2);
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
