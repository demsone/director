// Builds build/icon.icns from assets/icons/app-icon.png (run with: node electron/make-icon.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(root, '..', 'assets', 'icons', 'app-icon.png');
const set = path.join(root, 'build', 'icon.iconset');
fs.mkdirSync(set, { recursive: true });
for (const s of [16, 32, 128, 256, 512]) {
  for (const [scale, px] of [['', s], ['@2x', s * 2]]) {
    execFileSync('sips', ['-z', String(px), String(px), src, '--out', path.join(set, `icon_${s}x${s}${scale}.png`)], { stdio: 'ignore' });
  }
}
execFileSync('iconutil', ['-c', 'icns', set, '-o', path.join(root, 'build', 'icon.icns')]);
fs.rmSync(set, { recursive: true });
console.log('icon written');
