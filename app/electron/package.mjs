// Builds release/Director-darwin-<arch>/Director.app (run via: npm run package:mac)
import { packager } from '@electron/packager';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [appPath] = await packager({
  dir: root,
  out: path.join(root, 'release'),
  name: 'Director',
  executableName: 'Director',
  appBundleId: 'com.diego.director',
  appCategoryType: 'public.app-category.photography',
  icon: path.join(root, 'build', 'icon'),
  platform: 'darwin',
  arch: process.arch,
  overwrite: true,
  prune: true,
  asar: false,
  // Only the server, the built interface and the desktop entry are shipped.
  ignore: [/^\/src($|\/)/, /^\/public($|\/)/, /^\/release($|\/)/, /^\/build\/(?!icon\.icns)/, /^\/index\.html$/,
    /^\/tsconfig\.json$/, /^\/vite\.config\.ts$/, /^\/data($|\/)/, /\.DS_Store$/],
});
console.log(`Built ${appPath}`);
