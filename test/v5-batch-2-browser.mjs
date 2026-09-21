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
let feedbackRequests = [];
let chatRequests = [];
let delayedCompare = true;
let compareAttempts = 0;
let chatAttempts = 0;

await waitForServer();
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 1100 }, locale: 'en-AU' });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
async function routeApi(route) {
  const request = route.request();
  const url = new URL(request.url());
  if (request.method() === 'GET' && url.pathname === '/api/prompts') return route.fulfill(response({ prompts }));
  if (request.method() === 'GET' && url.pathname === '/api/models') {
    return route.fulfill(response({ models: [
      { id: 'vision-model-one', name: 'Vision One' },
      { id: 'vision-model-two-with-a-deliberately-long-loaded-model-identifier', name: 'Vision Two' }
    ] }));
  }
  if (request.method() === 'POST' && url.pathname === '/api/feedback') {
    const body = JSON.parse(request.postData());
    feedbackRequests.push(body);
    return route.fulfill(response({ session: {
      id: 'feedback-mock', revision: 1, type: 'feedback', createdAt: '2026-09-21T02:00:00.000Z', updatedAt: '2026-09-21T02:00:00.000Z',
      title: body.image.name, image: body.image, prompt: prompts.find(prompt => prompt.id === body.promptId), model: body.model,
      feedback: { raw: 'mock raw feedback', sections: [{ heading: 'First impression', content: 'The delayed image decoded before review.' }] }, chat: []
    } }));
  }
  if (request.method() === 'GET' && url.pathname === '/api/sessions/compare-mock') return route.fulfill(response({ session: saved }));
  if (request.method() === 'POST' && url.pathname === '/api/compare') {
    const body = JSON.parse(request.postData());
    compareRequests.push(body);
    if (delayedCompare) {
      delayedCompare = false;
      saved = {
        id: 'compare-delayed-mock', revision: 1, type: 'compare', createdAt: '2026-09-21T02:30:00.000Z', updatedAt: '2026-09-21T02:30:00.000Z',
        title: 'Delayed Compare preparation', image: image(body.image.name, body.image.sourceDataUrl), imageB: image(body.imageB.name, body.imageB.sourceDataUrl),
        prompt: comparePrompts.find(prompt => prompt.id === body.promptId), model: body.model, feedback: { raw: 'mock delayed comparison', sections }, chat: []
      };
      return route.fulfill(response({ session: saved }));
    }
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
}
await page.route('**/api/**', routeApi);

async function screenshot(name) {
  await page.screenshot({ path: join(evidence, name), fullPage: true });
}

async function choosePair() {
  await page.setInputFiles('#image-file', imageAPath);
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.dataset.imageA === name, imageAName);
  await page.setInputFiles('#image-file-b', imageBPath);
  await page.waitForFunction(name => document.querySelector('[data-name="Feedback / File"]')?.dataset.imageB === name, imageBName);
}

async function openCompareNew() {
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('#model')?.value && document.body.dataset.screen === 'feedback-new');
  await page.locator('.source-frame a[aria-label="compare-new"]').click();
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-new');
}

async function assertPreparedImage(imageValue, sourceDataUrl, label) {
  assert.ok(imageValue.width > 1 && imageValue.height > 1, `${label} must use decoded natural dimensions`);
  assert.ok(imageValue.reviewWidth > 1 && imageValue.reviewHeight > 1, `${label} must use real bounded review dimensions`);
  assert.notEqual(imageValue.dataUrl, sourceDataUrl, `${label} must not submit original bytes as the review image`);
  assert.match(imageValue.dataUrl, /^data:image\/jpeg;base64,/i, `${label} must submit the normal JPEG review image`);
}

async function runDelayedDecodeRegression() {
  const delayedContext = await browser.newContext({ viewport: { width: 1512, height: 1100 }, locale: 'en-AU' });
  await delayedContext.addInitScript(() => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    const delayMs = 2400;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set(value) {
        if (typeof value !== 'string' || !value.startsWith('data:image/')) return descriptor.set.call(this, value);
        const load = this.onload;
        const error = this.onerror;
        this.onload = null;
        this.onerror = null;
        const release = event => setTimeout(() => (event.type === 'load' ? load : error)?.call(this, event), delayMs);
        this.addEventListener('load', release, { once: true });
        this.addEventListener('error', release, { once: true });
        descriptor.set.call(this, value);
      }
    });
  });
  const delayedPage = await delayedContext.newPage();
  await delayedPage.route('**/api/**', routeApi);
  try {
    await delayedPage.goto(base);
    await delayedPage.waitForFunction(() => document.querySelector('#model')?.value && document.body.dataset.screen === 'feedback-new');
    await delayedPage.setInputFiles('#image-file', imageAPath);
    await delayedPage.waitForTimeout(2100);
    assert.equal(feedbackRequests.length, 0, 'delayed Feedback decode must not submit before decode completes');
    assert.equal(await delayedPage.locator('[data-name="action-bar"]').getAttribute('aria-disabled'), 'true', 'delayed Feedback decode must not enable submission');
    assert.equal(await delayedPage.locator('[data-name="Feedback / File"]').evaluate(node => node.style.backgroundImage), '', 'delayed Feedback decode must not mount an undecoded preview');
    await delayedPage.waitForFunction(() => document.querySelector('[data-name="Feedback / File"]')?.style.backgroundImage);
    await delayedPage.locator('[data-name="action-bar"]').click();
    await delayedPage.waitForFunction(() => document.body.dataset.screen === 'feedback-complete');
    const feedbackBody = feedbackRequests.at(-1);
    assertPreparedImage(feedbackBody.image, feedbackBody.image.sourceDataUrl, 'Feedback');

    await delayedPage.goto(base);
    await delayedPage.waitForFunction(() => document.querySelector('#model')?.value && document.body.dataset.screen === 'feedback-new');
    await delayedPage.locator('.source-frame a[aria-label="compare-new"]').click();
    await delayedPage.waitForFunction(() => document.body.dataset.screen === 'compare-new');
    await delayedPage.setInputFiles('#image-file', imageAPath);
    await delayedPage.waitForTimeout(2100);
    assert.equal(await delayedPage.locator('[data-name="Feedback / File"]').getAttribute('data-image-a'), '', 'delayed Compare decode must not select Image A early');
    await delayedPage.waitForFunction(() => document.querySelector('[data-name="Feedback / File"]')?.getAttribute('data-image-a'));
    await delayedPage.setInputFiles('#image-file-b', imageBPath);
    await delayedPage.waitForTimeout(2100);
    assert.equal(await delayedPage.locator('[data-name="Feedback / File"]').getAttribute('data-image-b'), '', 'delayed Compare decode must not select Image B early');
    await delayedPage.waitForFunction(() => document.querySelector('[data-name="Feedback / File"]')?.getAttribute('data-image-b'));
    await delayedPage.selectOption('#prompt', 'compare-general');
    await delayedPage.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click();
    await delayedPage.waitForFunction(() => document.body.dataset.screen === 'compare-complete');
    const compareBody = compareRequests.at(-1);
    assertPreparedImage(compareBody.image, compareBody.image.sourceDataUrl, 'Compare Image A');
    assertPreparedImage(compareBody.imageB, compareBody.imageB.sourceDataUrl, 'Compare Image B');
    return { feedback: feedbackBody.image, compare: { image: compareBody.image, imageB: compareBody.imageB } };
  } finally {
    await delayedPage.close();
    await delayedContext.close();
  }
}

try {
  const delayedDecode = await runDelayedDecodeRegression();
  compareRequests = [];
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
  await page.selectOption('#prompt', 'compare-general');
  assert.match(await page.locator('body').innerText(), /Compare two photographs or designs\./);
  assert.match(await page.locator('[data-name="project-link"]').textContent(), /Select project/);
  assert.match(await page.locator('[data-name="action-bar"] [data-name="photography-input"]').textContent(), /Compare two images/);
  assert.doesNotMatch(await page.locator('body').innerText(), /2[–-]6 photographs/);
  await screenshot('production-compare-new-final.png');
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
  const assertTwoImageRow = async () => {
    const geometry = await page.locator('[data-name="Feedback / File"]').evaluate(fileBox => {
      const slots = [...fileBox.querySelectorAll(':scope > [data-name="image.jpg"]')].filter(node => !node.hidden);
      const rects = slots.map(node => { const rect = node.getBoundingClientRect(); return { left: rect.left, width: rect.width, height: rect.height }; });
      const parent = fileBox.getBoundingClientRect();
      return { parent: { left: parent.left, width: parent.width, height: parent.height }, rects };
    });
    assert.equal(geometry.rects.length, 2, 'Compare must expose exactly two visible image regions');
    assert.ok(geometry.rects[0].width > geometry.parent.width * 0.4, 'Image A must expand across half the row');
    assert.ok(geometry.rects[1].width > geometry.parent.width * 0.4, 'Image B must expand across half the row');
    assert.ok(geometry.rects[1].left > geometry.rects[0].left + geometry.rects[0].width, 'Image A/B must remain ordered with donor spacing');
    assert.equal(geometry.rects[0].height, geometry.rects[1].height, 'Image row heights must remain equal');
    assert.equal(await page.locator('[data-name="Feedback / File"] > [data-name="image.jpg"]').count(), 4, 'Donor four-slot structure remains mounted for the adapter');
    assert.equal(await page.locator('[data-name="Feedback / File"] > [data-name="image.jpg"]:visible').count(), 2, 'C/D donor slots must be hidden');
  };
  await assertTwoImageRow();
  await assert.match(await page.locator('body').innerText(), /Compare two photographs or designs\./);
  assert.doesNotMatch(await page.locator('body').innerText(), /2[–-]6 photographs/);
  assert.doesNotMatch(await page.locator('body').innerText(), /Diego De Nicola Collection/);
  await screenshot('production-compare-thinking-final.png');
  await page.waitForSelector('[data-name="output text"][role="alert"]');
  assert.match(await page.locator('[data-name="output text"][role="alert"]').textContent(), /Simulated Compare failure/);
  assert.equal(await page.locator('.director-compare-preview-slot:visible').count(), 2, 'failed Compare must preserve clean A/B previews');
  assert.doesNotMatch(await page.locator('[data-name="Feedback / File"]').textContent(), /image\.jpg\.jpg|Value=image-6\.jpg/);
  await screenshot('production-compare-failure-final.png');

  await choosePair();
  await page.selectOption('#prompt', 'compare-general');
  await page.locator('[data-name="UI / Button"]').filter({ hasText: 'COMPARE SOURCES' }).click();
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-complete');
  assert.equal(compareRequests.at(-1).image.name, imageAName);
  assert.equal(compareRequests.at(-1).imageB.name, imageBName);
  assert.equal(compareRequests.at(-1).model, 'vision-model-two-with-a-deliberately-long-loaded-model-identifier');
  const expectedSavedModel = 'vision-model-two-with-a-deliberately-long-loaded-model-identifier';
  const completeComposerModel = page.locator('[data-name="Prompt / Model Selector"]');
  assert.equal((await completeComposerModel.textContent()).trim(), expectedSavedModel);
  assert.equal(await completeComposerModel.getAttribute('title'), expectedSavedModel);
  assert.match(await completeComposerModel.getAttribute('aria-label'), new RegExp(expectedSavedModel));
  assert.equal(await completeComposerModel.getAttribute('aria-disabled'), 'true');
  assert.notEqual(await completeComposerModel.getAttribute('role'), 'button');
  assert.doesNotMatch(await page.locator('body').innerText(), /GEMMA-4/);
  const completeComposerGeometry = await completeComposerModel.evaluate(node => {
    const label = node.querySelector('[data-name="Label Alternative / Small 10px"]');
    const text = label?.querySelector('.text-content');
    const rect = label?.getBoundingClientRect();
    return { label: rect && { width: rect.width, height: rect.height }, overflow: text && getComputedStyle(text).overflow, whiteSpace: text && getComputedStyle(text).whiteSpace, textOverflow: text && getComputedStyle(text).textOverflow };
  });
  assert.ok(completeComposerGeometry.label.width > 0 && completeComposerGeometry.label.height > 0);
  assert.equal(completeComposerGeometry.overflow, 'hidden');
  assert.equal(completeComposerGeometry.whiteSpace, 'nowrap');
  assert.equal(completeComposerGeometry.textOverflow, 'ellipsis');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  assert.equal(await page.locator('[data-name="Recommendations"]').isHidden(), true, 'recommendation fixtures must be hidden at runtime');
  assert.doesNotMatch(await page.locator('body').innerText(), /Director Recommendations|#1 · Option 1|#2 · Option 2/);
  assert.match(await page.locator('[data-name="project-link"]').textContent(), /Select project/);
  assert.doesNotMatch(await page.locator('body').innerText(), /Diego De Nicola Collection/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /First impression/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /Structure/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /Which reads more strongly/);
  await assertTwoImageRow();
  const completeSpacing = await page.locator('[data-name="prompt-section"]').evaluate(promptSection => {
    const output = document.querySelector('[data-name="reply"]');
    const prompt = promptSection.getBoundingClientRect();
    const reply = output.getBoundingClientRect();
    return { gap: prompt.top - reply.bottom };
  });
  assert.ok(completeSpacing.gap >= 0 && completeSpacing.gap < 80, 'suppressed recommendation space must be collapsed before Ask Director');
  await screenshot('production-compare-complete-final.png');

  await page.goto(`${base}/?session=compare-mock&view=compare-detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'compare-detail');
  assert.match(await page.locator('[data-name="header-title"]').textContent(), /Actual A-B comparison/);
  assert.match(await page.locator('[data-name="date-created"]').textContent(), /21 Sept 2026/);
  assert.match(await page.locator('[data-name="UI / Category Badge"]').textContent(), /COMPARE/);
  assert.match(await page.locator('[data-name="Body/13px"]').allTextContents().then(values => values.join(' ')), /Compare/);
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  assert.equal(await page.locator('[data-name="Recommendations"]').isHidden(), false);
  assert.equal(await page.locator('[data-name="Compare / Recommendation"]:visible').count(), 0);
  assert.doesNotMatch(await page.locator('body').innerText(), /Director Recommendations|#1 · Option 1|#2 · Option 2/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /First impression/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /Structure/);
  assert.match(await page.locator('[data-name="output text"]').textContent(), /Which reads more strongly/);
  assert.equal(await page.locator('[data-name="prompt-selector"]').filter({ hasText: 'Not linked' }).count(), 1);
  const detailComposerModel = page.locator('[data-name="Prompt / Model Selector"]');
  assert.equal(await page.locator('#model').inputValue(), 'vision-model-one', 'Detail must not use the currently loaded model as the saved model display');
  assert.equal((await detailComposerModel.textContent()).trim(), expectedSavedModel);
  assert.equal(await detailComposerModel.getAttribute('title'), expectedSavedModel);
  assert.match(await detailComposerModel.getAttribute('aria-label'), new RegExp(expectedSavedModel));
  assert.equal(await detailComposerModel.getAttribute('aria-disabled'), 'true');
  assert.doesNotMatch(await page.locator('body').innerText(), /GEMMA-4/);
  assert.doesNotMatch(await page.locator('body').innerText(), /Diego De Nicola Collection/);
  const detailOutput = await page.locator('[data-name="reply"]').evaluate(reply => {
    const output = reply.querySelector('[data-name="output text"]');
    const replyRect = reply.getBoundingClientRect();
    const outputRect = output.getBoundingClientRect();
    const prompt = document.querySelector('[data-name="prompt-section"]').getBoundingClientRect();
    return { reply: { top: replyRect.top, bottom: replyRect.bottom, width: replyRect.width }, output: { top: outputRect.top, width: outputRect.width }, promptTop: prompt.top };
  });
  assert.ok(detailOutput.output.width > 0 && detailOutput.reply.width > 0, 'saved comparison output must have rendered geometry');
  const detailMetadata = await page.locator('[data-name="metadata-primary"]').boundingBox();
  assert.ok(detailMetadata.y - detailOutput.reply.bottom >= 0 && detailMetadata.y - detailOutput.reply.bottom < 80, 'Detail recommendation fixture space must be collapsed before metadata');
  await screenshot('production-compare-detail-final.png');

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
  await screenshot('production-compare-detail-after-chat-final.png');
  assert.deepEqual(pageErrors, []);
  assert.equal(saved.image.name, imageAName);
  assert.equal(saved.imageB.name, imageBName);
  console.log(JSON.stringify({
    passed: true,
    comparePrompts: comparePrompts.map(prompt => prompt.id),
    sectionsRendered: sections.length,
    requestOrder: [compareRequests.at(-1).image.name, compareRequests.at(-1).imageB.name],
    visibleErrors: ['one image', 'invalid image', 'Compare failure', 'chat failure'],
    delayedDecode: { feedback: { width: delayedDecode.feedback.width, height: delayedDecode.feedback.height, reviewWidth: delayedDecode.feedback.reviewWidth, reviewHeight: delayedDecode.feedback.reviewHeight }, compare: { imageA: { width: delayedDecode.compare.image.width, height: delayedDecode.compare.image.height, reviewWidth: delayedDecode.compare.image.reviewWidth, reviewHeight: delayedDecode.compare.image.reviewHeight }, imageB: { width: delayedDecode.compare.imageB.width, height: delayedDecode.compare.imageB.height, reviewWidth: delayedDecode.compare.imageB.reviewWidth, reviewHeight: delayedDecode.compare.imageB.reviewHeight } } },
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
