import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

/**
 * Starts the Director server. Used by the web launcher (run directly) and by the
 * desktop app (imported by Electron). Resolves with the listening http.Server.
 */
export async function startServer({ port = Number(process.env.PORT || 4747), dev = false } = {}) {
  const { api, serveFile } = await import('./routes.js');
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
      throw new Error('No production build found. Run "npm run build" first.');
    }
    app.use(express.static(dist, { index: false }));
    app.get('/{*splat}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dev = process.argv.includes('--dev');
  startServer({ dev })
    .then((s) => console.log(`Director running at http://127.0.0.1:${s.address().port}${dev ? ' (dev)' : ''}`))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
