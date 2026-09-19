/* Verification only; never loaded by the prototype. Uses the bundled Playwright. */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const screens = JSON.parse(fs.readFileSync(path.join(root, 'screens.json')));

(async () => {
  const browser = await chromium.connectOverCDP(process.argv[2]);
  const context = browser.contexts()[0];
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const report = [];
  for (const screen of screens) {
    await page.setViewportSize({ width: screen.width, height: Math.ceil(screen.height) });
    await page.goto(`http://127.0.0.1:4176/${screen.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const data = await page.evaluate(() => {
      const frame = document.querySelector('main');
      const b = frame.getBoundingClientRect();
      return {
        frame: { width: b.width, height: b.height },
        textNodes: document.querySelectorAll('.node > span').length,
        brokenImages: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
        fonts: [...document.fonts].map(f => ({ family: f.family, weight: f.weight, status: f.status })),
        scriptCount: document.scripts.length,
        storageKeys: Object.keys(localStorage),
        contentHeight: document.documentElement.scrollHeight,
      };
    });
    const missingLinks = data.links.filter(href => !fs.existsSync(path.join(root, href)));
    await page.screenshot({ path: path.join(root, 'verification', screen.path.replace('.html', '.png')) });
    report.push({ ...screen, ...data, missingLinks });
    console.log(`${screen.name}: ${data.textNodes} text nodes, ${data.links.length} state links, ${data.brokenImages.length} broken assets`);
  }
  // Walk meaningful inspect-only routes rather than merely checking href files.
  const interactions = [];
  for (const [from, label, expected] of [
    ['director-new-feedback.html', 'Director / New Compare', 'director-new-compare.html'],
    ['settings-models.html', 'Settings / Personalisation', 'settings-personalisation.html'],
    ['settings-personalisation.html', 'Settings / Appearance', 'settings-appearance.html'],
    ['darkroom-library.html', 'Darkroom / Quick View', 'darkroom-quick-view.html'],
    ['darkroom-quick-view.html', 'Darkroom / Library', 'darkroom-library.html'],
    ['prompts-all.html', 'Prompts / Edit', 'prompts-edit.html'],
    ['projects-detail-overview.html', 'Projects / Detail / Feedback', 'projects-detail-feedback.html'],
  ]) {
    await page.goto(`http://127.0.0.1:4176/${from}`);
    const link = page.getByRole('link', {name:label, exact:true}).first();
    try {
      await link.click({ timeout: 3000 });
      interactions.push({from,label,expected,passed:page.url().endsWith(expected)});
    } catch (e) { interactions.push({from,label,expected,passed:false,error:e.message.split('\n')[0]}); }
  }
  await page.setViewportSize({width:800,height:900});
  await page.goto('http://127.0.0.1:4176/director-new-feedback.html');
  const fixedWidth = await page.locator('main').evaluate(n => n.getBoundingClientRect().width);
  const result = { screens: report, interactions, narrowViewportFrameWidth:fixedWidth, errors };
  fs.writeFileSync(path.join(root,'verification/browser-report.json'), JSON.stringify(result,null,2)+'\n');
  await page.close();
  await browser.close();
  if(errors.length || report.some(r=>r.brokenImages.length||r.missingLinks.length||r.scriptCount||r.storageKeys.length) || interactions.some(i=>!i.passed)) process.exitCode=1;
})();
