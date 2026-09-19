import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { AppError, prompts, getPrompt, validateImage, requireText, originalMessages, reviewSchema, parseFeedback, chatMessages } from './src/core.mjs';
import { createModelClient } from './src/model.mjs';

const files = new Map([['/', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']]]);
async function readBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new AppError('Expected JSON.', 415);
  let length = 0; const chunks = [];
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 18 * 1024 * 1024) throw new AppError('The image and conversation exceed the request size limit.', 413);
    chunks.push(chunk);
  }
  try { const body = JSON.parse(Buffer.concat(chunks)); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); return body; }
  catch { throw new AppError('Invalid JSON request.'); }
}
export function createApp({ client = createModelClient() } = {}) {
  return http.createServer(async (req, res) => {
    const abort = new AbortController();
    res.on('close', () => { if (!res.writableEnded) abort.abort(); });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    const json = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
    try {
      const host = req.headers.host || '';
      if (!/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(host)) throw new AppError('Local requests only.', 403);
      if (req.headers.origin && req.headers.origin !== `http://${host}`) throw new AppError('Cross-origin requests are not allowed.', 403);
      const path = new URL(req.url, `http://${host}`).pathname;
      if (req.method === 'GET' && path === '/api/health') return json(200, { app: 'director-v1-checkpoint-1' });
      if (req.method === 'GET' && path === '/api/prompts') return json(200, { prompts });
      if (req.method === 'GET' && path === '/api/models') return json(200, { models: await client.models(abort.signal) });
      if (req.method === 'POST' && path === '/api/feedback') {
        const body = await readBody(req);
        const image = validateImage(body.image), prompt = getPrompt(body.promptId);
        const model = requireText(body.model, 'Model', 300);
        const reply = await client.complete({ model, messages: originalMessages(image, prompt), format: reviewSchema(prompt), signal: abort.signal });
        const feedback = parseFeedback(reply.raw, prompt);
        return json(200, { session: { id: randomUUID(), createdAt: new Date().toISOString(), image, prompt, model, feedback, chat: [], usage: reply.usage } });
      }
      if (req.method === 'POST' && path === '/api/chat') {
        const body = await readBody(req);
        const messages = chatMessages(body.session, body.message);
        const model = requireText(body.session.model, 'Model', 300);
        const reply = await client.complete({ model, messages, signal: abort.signal });
        return json(200, { turn: { role: 'assistant', content: reply.raw }, usage: reply.usage });
      }
      if (req.method === 'GET' && files.has(path)) {
        const [name, type] = files.get(path);
        const content = await readFile(new URL(`./public/${name}`, import.meta.url));
        res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }); return res.end(content);
      }
      json(404, { error: 'Not found.' });
    } catch (error) {
      if (!res.destroyed) json(error.status || 500, { error: error.status ? error.message : 'Director encountered an unexpected error.', ...(error.raw ? { raw: error.raw } : {}) });
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4177);
  const server = createApp();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Open the existing Director instance or choose another PORT.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Director V1 · Checkpoint 1 · http://127.0.0.1:${port}`));
}
