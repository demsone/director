import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';

const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(playwrightPath)));
const base = process.env.DIRECTOR_TEST_URL || 'http://127.0.0.1:4177';
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v5/batch-1');
const imagePath = process.env.DIRECTOR_TEST_IMAGE || resolve('assets/img/image.jpg.jpg');
await mkdir(evidence, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 1321 } });
const page = await context.newPage();
const donor = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
const cspWarnings = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() !== 'error') return;
  if (message.text().includes("Applying inline style violates the following Content Security Policy directive 'style-src 'self'")) cspWarnings.push(message.text());
  else errors.push(message.text());
});
let createdSession;
const steps = [];

async function captureDonor(state, file) {
  await donor.goto(`${base}/visual-v4/${file}`);
  await donor.waitForLoadState('networkidle');
  await donor.evaluate(() => document.fonts.ready);
  await donor.screenshot({ path: join(evidence, `donor-${state}.png`), fullPage: true });
}

try {
  await donor.route('**/visual-v4/feedback-*.html', async route => {
    const response = await route.fetch();
    let body = await response.text();
    body = body
      .replace(/<script type="module" src="functional-runtime\.js">\s*<\/script>/, '')
      .replace(/src="\/?assets\//g, 'src="/visual-v4/assets/');
    await route.fulfill({ response, body });
  });
  await captureDonor('new', 'feedback-new.html');
  await captureDonor('thinking', 'feedback-thinking.html');
  await captureDonor('complete', 'feedback-complete.html');
  await captureDonor('detail', 'feedback-detail.html');
  steps.push('Captured authored donor states at 1512px viewport');

  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('#model')?.value && document.querySelectorAll('#prompt option').length === 3);
  assert.equal(await page.locator('.source-frame').count(), 1);
  await page.screenshot({ path: join(evidence, 'production-feedback-new.png'), fullPage: true });
  assert.equal(await page.locator('[data-name="Heading/H2 /Semi-Bold/32px/37"]').first().textContent(), 'New Feedback');
  steps.push('New Feedback imports feedback-new.html and binds prompt/model data');

  await page.setInputFiles('#image-file', { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  assert.match(await page.locator('#error').textContent(), /JPEG/);
  await page.setInputFiles('#image-file', imagePath);
  await page.selectOption('#prompt', 'photography-review');
  await page.waitForFunction(() => !document.querySelector('#model').disabled && document.querySelector('[data-name="Feedback / File"]')?.style.backgroundImage);
  steps.push('Invalid image rejection, real image decode, prompt selection and donor drop binding');

  const feedbackResponse = page.waitForResponse(response => response.url().endsWith('/api/feedback') && response.request().method() === 'POST', { timeout: 260000 });
  await page.locator('[data-name="action-bar"]').click();
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-thinking');
  await page.screenshot({ path: join(evidence, 'production-feedback-thinking.png'), fullPage: true });
  assert.equal(await page.locator('[data-name="heading"]', { hasText: 'WRITING FEEDBACK' }).count(), 1);
  const feedbackResponseData = await feedbackResponse;
  assert.equal(feedbackResponseData.status(), 200);
  const feedbackData = await feedbackResponseData.json();
  createdSession = feedbackData.session.id;
  assert.equal(feedbackData.session.feedback.sections.length, 11);
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-complete');
  await page.screenshot({ path: join(evidence, 'production-feedback-complete.png'), fullPage: true });
  assert.equal(await page.locator('[data-name="output text"]', { hasText: 'First impression' }).count(), 1);
  steps.push('Real loaded vision model completed Feedback with 11 structured sections');

  const composer = page.locator('[data-name="prompt-text"] .text-content span').last();
  await composer.fill('What should I pay attention to in the crop? Keep it brief.');
  const chatResponse = page.waitForResponse(response => response.url().endsWith('/api/chat') && response.request().method() === 'POST', { timeout: 260000 });
  await page.locator('[data-name="enter-button"]').click();
  const chatResponseData = await chatResponse;
  assert.equal(chatResponseData.status(), 200);
  const chatData = await chatResponseData.json();
  assert.equal(chatData.session.chat.length, 2);
  steps.push('Real /api/chat follow-up persisted on the same session');

  await page.getByRole('button', { name: 'New feedback', exact: true }).click();
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-new');
  steps.push('Donor NEW FEEDBACK toolbar action returns to the imported feedback-new state');

  await page.goto(`${base}/?session=${encodeURIComponent(createdSession)}&view=detail`);
  await page.waitForFunction(() => document.body.dataset.screen === 'feedback-detail');
  await page.screenshot({ path: join(evidence, 'production-feedback-detail.png'), fullPage: true });
  assert.equal(await page.locator('[data-name="date-created"]').count(), 1);
  assert.match(await page.locator('body').innerText(), /PROMPT USED/);
  steps.push('Reopened Feedback imports feedback-detail.html with persisted metadata, feedback and chat composer');

  assert.deepEqual(errors, []);
  const report = { passed: true, date: new Date().toISOString(), model: feedbackData.session.model, sessionId: createdSession, sections: feedbackData.session.feedback.sections.length, chatTurns: chatData.session.chat.length, viewport: { width: 1512, height: 1321 }, steps, screenshots: evidence, consoleErrors: errors, donorCspWarnings: cspWarnings.length };
  await writeFile(join(evidence, 'live-browser-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const report = { passed: false, date: new Date().toISOString(), error: error.stack, steps, screenshots: evidence, consoleErrors: errors };
  await writeFile(join(evidence, 'live-browser-report.json'), JSON.stringify(report, null, 2));
  await page.screenshot({ path: join(evidence, 'failure.png'), fullPage: true });
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} finally {
  if (createdSession) {
    const saved = await (await fetch(`${base}/api/sessions/${createdSession}`)).json();
    if (saved.session) await fetch(`${base}/api/sessions/${createdSession}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: saved.session.revision }) });
  }
  await browser.close();
}
