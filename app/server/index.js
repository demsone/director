import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { api, serveFile } from './routes.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dev = process.argv.includes('--dev');
const PORT = Number(process.env.PORT || 4747);

const app = express();
app.disable('x-powered-by');
app.use('/api', api);
app.get('/files/:id{/:variant}', serveFile);

if (dev) {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('No production build found. Run "npm run build" first.');
    process.exit(1);
  }
  app.use(express.static(dist, { index: false }));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Director running at http://127.0.0.1:${PORT}${dev ? ' (dev)' : ''}`);
});
