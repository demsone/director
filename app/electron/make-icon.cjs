// Renders build/icon.icns from the Director logotype's "D" (run with: npx electron electron/make-icon.cjs)
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'src/assets/icons/logotype.svg'), 'utf8');
const d = svg.match(/<path[^>]*\/>/)[0];

const html = `<html><body style="margin:0;background:transparent">
<div style="position:absolute;left:100px;top:100px;width:824px;height:824px;border-radius:185px;
  background:linear-gradient(160deg,#222 0%,#171717 55%,#131313 100%);
  box-shadow:inset 0 0 0 2px rgba(205,205,205,.10), 0 18px 40px rgba(0,0,0,.35);
  display:flex;align-items:center;justify-content:center">
  <svg viewBox="-1 -1 40 46" width="440" height="506" xmlns="http://www.w3.org/2000/svg">${d}</svg>
</div></body></html>`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1024, height: 1024, show: false, transparent: true, frame: false,
    webPreferences: { offscreen: true } });
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 300));
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 });
  const set = path.join(root, 'build', 'icon.iconset');
  fs.mkdirSync(set, { recursive: true });
  const png = path.join(root, 'build', 'icon-1024.png');
  fs.writeFileSync(png, img.resize({ width: 1024, height: 1024 }).toPNG());
  for (const s of [16, 32, 64, 128, 256, 512]) {
    fs.writeFileSync(path.join(set, `icon_${s}x${s}.png`), img.resize({ width: s, height: s, quality: 'best' }).toPNG());
    fs.writeFileSync(path.join(set, `icon_${s}x${s}@2x.png`), img.resize({ width: s * 2, height: s * 2, quality: 'best' }).toPNG());
  }
  execFileSync('iconutil', ['-c', 'icns', set, '-o', path.join(root, 'build', 'icon.icns')]);
  fs.rmSync(set, { recursive: true });
  console.log('icon written');
  app.quit();
});
