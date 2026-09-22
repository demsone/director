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
const port = Number(process.env.DIRECTOR_V5_BATCH_3A_TEST_PORT || 4187);
const base = `http://127.0.0.1:${port}`;
const evidence = resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v5/batch-3a');
const dataDirectory = await mkdtemp('/tmp/director-v5-batch-3a-');
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
    if (server.exitCode !== null) throw new Error(`V5 Batch 3A test server failed: ${logs}`);
    try {
      if ((await (await fetch(`${base}/api/health`)).json()).app === 'director-v4') return;
    } catch {}
    await new Promise(resolveDelay => setTimeout(resolveDelay, 50));
  }
  throw new Error(`V5 Batch 3A test server did not start: ${logs}`);
}

function response(body, status = 200) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

const imageBytes = await readFile('assets/img/image.jpg.jpg');
const imageBBytes = await readFile('assets/img/Value=image-6.jpg');
const imageData = bytes => `data:image/jpeg;base64,${bytes.toString('base64')}`;
const prompt = prompts.find(item => item.id === 'photography-review');
const designPrompt = prompts.find(item => item.id === 'design-review');
const comparePrompt = prompts.find(item => item.id === 'compare-general');
const makeImage = (name, bytes) => ({
  name,
  sourceDataUrl: imageData(bytes),
  dataUrl: imageData(bytes),
  width: 549,
  height: 330,
  reviewWidth: 549,
  reviewHeight: 330
});
const firstImage = makeImage('member-photo.jpg', imageBytes);
const secondImage = makeImage('member-design.jpg', imageBBytes);
const compareImageA = makeImage('compare-a.jpg', imageBytes);
const compareImageB = makeImage('compare-b.jpg', imageBBytes);
const feedback = sections => ({ raw: 'saved structured feedback', sections });
const sessions = {
  'photo-member': {
    id: 'photo-member', revision: 1, type: 'feedback', createdAt: '2026-09-18T04:00:00.000Z', updatedAt: '2026-09-18T04:00:00.000Z',
    title: 'Photography member record', image: firstImage, prompt, model: 'vision-real-photo',
    feedback: feedback([{ heading: 'First impression', content: 'A real saved photography first read.' }, { heading: 'Structure', content: 'The tonal structure remains clear.' }]), chat: []
  },
  'design-member': {
    id: 'design-member', revision: 2, type: 'feedback', createdAt: '2026-09-17T04:00:00.000Z', updatedAt: '2026-09-17T04:00:00.000Z',
    title: 'Design member record', image: secondImage, prompt: designPrompt, model: 'vision-real-design',
    feedback: feedback([{ heading: 'First impression', content: 'A real saved design first read.' }]), chat: []
  },
  'photo-compare': {
    id: 'photo-compare', revision: 3, type: 'compare', createdAt: '2026-09-16T04:00:00.000Z', updatedAt: '2026-09-16T04:00:00.000Z',
    title: 'Photography comparison record', image: compareImageA, imageB: compareImageB, prompt: comparePrompt, model: 'vision-real-compare',
    feedback: feedback([{ heading: 'First impression', content: 'Image A has the stronger opening rhythm.' }, { heading: 'Which reads more strongly', content: 'The comparison keeps Image A and Image B distinct.' }]), chat: []
  },
  'compare-only': {
    id: 'compare-only', revision: 4, type: 'compare', createdAt: '2026-09-15T04:00:00.000Z', updatedAt: '2026-09-15T04:00:00.000Z',
    title: 'Independent saved comparison', image: compareImageB, imageB: compareImageA, prompt: comparePrompt, model: 'vision-real-compare',
    feedback: feedback([{ heading: 'First impression', content: 'The independent comparison remains readable.' }]), chat: []
  }
};
const summary = session => ({ id: session.id, revision: session.revision, title: session.title, createdAt: session.createdAt, updatedAt: session.updatedAt, imageName: session.image.name, ...(session.type === 'compare' ? { imageBName: session.imageB.name } : {}), promptName: session.prompt.name, type: session.type });
let emptyPhotography = false;

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
  if (request.method() === 'GET' && url.pathname === '/api/models') return route.fulfill(response({ models: [{ id: 'vision-loaded', name: 'Loaded Vision' }] }));
  if (request.method() === 'GET' && url.pathname === '/api/libraries/photography') {
    const members = emptyPhotography ? [] : [sessions['photo-member'], sessions['photo-compare']];
    return route.fulfill(response({ id: 'photography', name: 'Photography Library', sessions: members.map(summary) }));
  }
  if (request.method() === 'GET' && url.pathname === '/api/libraries/design') {
    return route.fulfill(response({ id: 'design', name: 'Design Library', sessions: [sessions['design-member']].map(summary) }));
  }
  if (request.method() === 'GET' && url.pathname === '/api/sessions') {
    return route.fulfill(response({ sessions: Object.values(sessions).map(summary) }));
  }
  const saved = url.pathname.match(/^\/api\/sessions\/([^/]+)$/);
  if (saved && request.method() === 'GET' && sessions[saved[1]]) return route.fulfill(response({ session: sessions[saved[1]] }));
  return route.continue();
});

async function screenshot(name) { await page.screenshot({ path: join(evidence, name), fullPage: true }); }
async function waitScreen(screen) {
  await page.waitForFunction(expected => document.body.dataset.screen === expected, screen);
  if (['darkroom-library', 'design-studio-library', 'compare-library'].includes(screen)) await page.waitForFunction(() => document.body.dataset.libraryDataLoaded === 'true');
}
async function clickSidebar(label) { await page.locator(`.source-frame a[aria-label="${label}"]`).first().click(); }
async function noFixtureText() {
  const text = await page.locator('body').innerText();
  for (const fixture of ['Chair and clothes in urban backyard', '06 Sept 2026', 'Street Photography', 'Street design', 'GEMMA-4', 'Need to compare two images for gallery']) assert.doesNotMatch(text, new RegExp(fixture.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `fixture leaked: ${fixture}`);
}

try {
  await page.goto(base);
  await waitScreen('feedback-new');

  await clickSidebar('darkroom');
  await waitScreen('darkroom-library');
  const photoCards = page.locator('[data-name="UI / File Thumb"][data-session-id]');
  assert.equal(await photoCards.count(), 2, 'Photography Library must show only its two members');
  assert.equal(await photoCards.nth(0).getAttribute('data-session-type'), 'feedback');
  assert.equal(await photoCards.nth(1).getAttribute('data-session-type'), 'compare');
  assert.match(await photoCards.nth(0).innerText(), /Photography member record/);
  assert.match(await photoCards.nth(0).innerText(), /FOTO/);
  assert.match(await photoCards.nth(0).innerText(), /FEEDBACK/);
  assert.match(await photoCards.nth(1).innerText(), /COMPARE/);
  assert.equal(await photoCards.nth(0).locator('img.source-image').getAttribute('src'), firstImage.sourceDataUrl);
  assert.equal(await photoCards.nth(1).locator('img.source-image').getAttribute('src'), compareImageA.sourceDataUrl, 'Compare thumbnail must use saved Image A');
  assert.equal(new Set(await photoCards.evaluateAll(nodes => nodes.map(node => node.dataset.sessionId))).size, 2);
  await noFixtureText();
  await screenshot('production-darkroom-library.png');

  await photoCards.nth(0).click();
  await page.waitForSelector('[data-name="Quick View / Drawer"]');
  assert.match(await page.locator('[data-name="side-drawer-header"]').innerText(), /Photography member record/);
  assert.match(await page.locator('[data-name="category-badges"]').innerText(), /FOTO/);
  assert.match(await page.locator('[data-name="category-badges"]').innerText(), /FEEDBACK/);
  assert.match(await page.locator('[data-name="prompt-reply"]').innerText(), /Review this photograph/);
  assert.match(await page.locator('[data-name="Quick View \/ Drawer"]').innerText(), /A real saved photography first read/);
  assert.equal(await page.locator('[data-name="preview-image"]').evaluate((node, prefix) => node.style.backgroundImage.includes(prefix), firstImage.sourceDataUrl.slice(0, 40)), true);
  await noFixtureText();
  await screenshot('production-darkroom-quick.png');
  await page.locator('[data-name="button-close"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-name="Quick View / Drawer"]'));
  assert.equal(await page.locator('[data-name="UI / File Thumb"][data-session-id]').count(), 2, 'closing Quick View must retain the library');

  await photoCards.nth(0).click();
  await page.locator('[data-name="VIEW FEEDBACK"]').click();
  await waitScreen('darkroom-detail');
  assert.match(await page.locator('[data-name="header-title"]').innerText(), /Photography member record/i);
  assert.match(await page.locator('[data-name="output text"]').first().innerText(), /A real saved photography first read/);
  assert.match(await page.locator('[data-name="date-created"]').innerText(), /18 Sept 2026/);
  assert.equal(await page.locator('[data-name="Feedback \/ File"] img').getAttribute('src'), firstImage.sourceDataUrl);
  await noFixtureText();
  await screenshot('production-darkroom-detail.png');
  await page.locator('[data-name="topbar"] a[aria-label="darkroom"]').click();
  await waitScreen('darkroom-library');

  await photoCards.nth(1).click();
  await waitScreen('compare-detail');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2, 'Photography Compare member must use canonical two-image detail');
  assert.match(await page.locator('[data-name="header-title"]').innerText(), /Photography comparison record/i);
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').nth(0).getAttribute('data-image-role'), 'Image A');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').nth(1).getAttribute('data-image-role'), 'Image B');
  await page.goBack();
  await waitScreen('darkroom-library');

  await clickSidebar('design-studio');
  await waitScreen('design-studio-library');
  const designCards = page.locator('[data-name="UI / File Thumb"][data-session-id]');
  assert.equal(await designCards.count(), 1, 'Design Studio must show only its member');
  assert.match(await designCards.innerText(), /DESIGN/);
  assert.match(await designCards.innerText(), /Design member record/);
  assert.equal(await designCards.locator('img.source-image').getAttribute('src'), secondImage.sourceDataUrl);
  await noFixtureText();
  await screenshot('production-design-studio-library.png');
  await page.locator('[data-name="Project / Toolbar"] a[aria-label="feedback-new"]').click();
  await waitScreen('feedback-new');
  assert.equal(await page.locator('#prompt').inputValue(), 'design-review', 'Design Studio ADD NEW FEEDBACK must select Design context');
  await clickSidebar('design-studio');
  await waitScreen('design-studio-library');
  await designCards.nth(0).click();
  await page.waitForSelector('[data-name="Quick View / Drawer"]');
  assert.match(await page.locator('[data-name="category-badges"]').innerText(), /DESIGN/);
  assert.match(await page.locator('[data-name="category-badges"]').innerText(), /FEEDBACK/);
  assert.match(await page.locator('[data-name="Quick View \/ Drawer"]').innerText(), /A real saved design first read/);
  await noFixtureText();
  await screenshot('production-design-studio-quick.png');
  await page.locator('[data-name="VIEW FEEDBACK"]').click();
  await waitScreen('design-studio-detail');
  assert.match(await page.locator('[data-name="header-title"]').innerText(), /Design member record/i);
  await screenshot('production-design-studio-detail.png');
  await page.locator('[data-name="topbar"] a[aria-label="design-studio"]').click();
  await waitScreen('design-studio-library');

  await clickSidebar('compare-library');
  await waitScreen('compare-library');
  const compareRows = page.locator('[data-name="UI / List Item"][data-session-id]');
  assert.equal(await compareRows.count(), 2, 'Compare Library must show every saved Compare session once');
  assert.doesNotMatch(await page.locator('[data-name="project-data"]').innerText(), /member record/);
  assert.match(await compareRows.nth(0).innerText(), /comparison record|Independent saved comparison/);
  await noFixtureText();
  await screenshot('production-compare-library.png');
  await compareRows.nth(0).locator('[data-name="Label/13px"]').click();
  await waitScreen('compare-library-detail');
  assert.match(await page.locator('[data-name="header-title"]').innerText(), /Photography comparison record|Independent saved comparison/i);
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').count(), 2);
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').nth(0).getAttribute('data-image-role'), 'Image A');
  assert.equal(await page.locator('[data-name="image.jpg"]:visible').nth(1).getAttribute('data-image-role'), 'Image B');
  assert.match(await page.locator('[data-name="output text"]').first().innerText(), /Image A/);
  await noFixtureText();
  await screenshot('production-compare-library-detail.png');
  await clickSidebar('compare-library');
  await waitScreen('compare-library');
  await page.locator('[data-name="Project / Toolbar"] a[aria-label="compare-new"]').click();
  await waitScreen('compare-new');
  await clickSidebar('darkroom');
  await waitScreen('darkroom-library');
  emptyPhotography = true;
  await clickSidebar('compare-library');
  await waitScreen('compare-library');
  await clickSidebar('darkroom');
  await waitScreen('darkroom-library');
  assert.equal(await page.locator('[data-name="UI / File Thumb"][data-session-id]').count(), 0);
  assert.equal(await page.locator('[data-name="UI / File Thumb"]:visible').count(), 0, 'empty Photography Library must hide all donor fixture cards');
  await noFixtureText();
  await screenshot('production-darkroom-empty.png');
  assert.deepEqual(pageErrors, []);
  console.log(JSON.stringify({
    passed: true,
    photographyMembers: 2,
    designMembers: 1,
    compareLibrarySessions: 2,
    fixtureLeakage: 'none',
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
