import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { AppError, prompts, getPrompt, requireText, originalMessages, reviewSchema, parseFeedback, findCritiquePolicyViolations, chatMessages, systemInstruction } from './src/core.mjs';
import { createModelClient } from './src/model.mjs';
import { SessionStore, uploadImage } from './src/store.mjs';

const files = new Map([['/', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']]]);
async function generateStructuredReview({ client, model, image, imageB, prompt, signal }) {
  const format = reviewSchema(prompt);
  const messages = originalMessages(image, prompt, systemInstruction, imageB);
  const first = await client.complete({ model, messages, format, signal });
  const firstFeedback = parseFeedback(first.raw, prompt);
  const violations = findCritiquePolicyViolations(firstFeedback);
  if (!violations.length) return { reply: first, feedback: firstFeedback };

  const correction = await client.complete({
    model,
    messages: [
      ...messages,
      { role: 'assistant', content: first.raw },
      { role: 'user', content: [
        "The previous review violates Director's critique policy.",
        '',
        'Rewrite the complete review.',
        '',
        'The following text MUST NOT be repeated or paraphrased as a claim about image-making intent, circumstance, or photographer action:',
        ...violations.map(({ sectionNumber, heading, excerpt, label }) => `Section ${sectionNumber} — ${heading}:\n"${excerpt}"\nViolation: ${label}`),
        '',
        'Describe only the visible effect instead.',
        '',
        'Preserve useful visual observations, but remove unsupported claims about intent, accident, staging, planning, posing, spontaneity, timing or circumstance.',
        '',
        'Return the complete replacement review using the same schema and all required sections. Return only the replacement structured review.'
      ].join('\n') }
    ],
    format,
    signal
  });
  const correctedFeedback = parseFeedback(correction.raw, prompt);
  const remaining = findCritiquePolicyViolations(correctedFeedback);
  if (remaining.length) throw new AppError('The model could not produce a critique compliant with Director’s critique policy.', 502, { raw: correction.raw });
  return { reply: correction, feedback: correctedFeedback };
}
async function readBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new AppError('Expected JSON.', 415);
  let length = 0; const chunks = [];
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 70 * 1024 * 1024) throw new AppError('The image and conversation exceed the request size limit.', 413);
    chunks.push(chunk);
  }
  try { const body = JSON.parse(Buffer.concat(chunks)); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); return body; }
  catch { throw new AppError('Invalid JSON request.'); }
}
export function createApp({ client = createModelClient(), store = new SessionStore() } = {}) {
  const busySessions = new Set();
  const server = http.createServer(async (req, res) => {
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
      if (req.method === 'GET' && path === '/api/health') return json(200, { app: 'director-v4', schemaVersion: 3 });
      if (req.method === 'GET' && path === '/api/prompts') return json(200, { prompts });
      if (req.method === 'GET' && path === '/api/models') return json(200, { models: await client.models(abort.signal) });
      if (req.method === 'GET' && path === '/api/sessions') return json(200, { sessions: store.list() });
      if (req.method === 'GET' && path === '/api/organisation') return json(200, store.organisation());
      if (req.method === 'POST' && path === '/api/projects') return json(200, { project: store.createProject((await readBody(req)).name) });
      const memberships = path.match(/^\/api\/sessions\/([^/]+)\/memberships$/);
      if (memberships && req.method === 'GET') return json(200, store.memberships(memberships[1]));
      const membership = path.match(/^\/api\/(projects|libraries)\/([^/]+)\/sessions\/([^/]+)$/);
      if (membership && ['PUT', 'DELETE'].includes(req.method)) return json(200, store.setMembership(membership[1], membership[2], membership[3], req.method === 'PUT'));
      const organisation = path.match(/^\/api\/(projects|libraries)\/([^/]+)$/);
      if (organisation) {
        const [, kind, id] = organisation;
        if (req.method === 'GET') return json(200, store.organisedSessions(kind, id));
        if (kind === 'projects' && req.method === 'PATCH') {
          const body = await readBody(req); return json(200, { project: store.renameProject(id, body.name, body.revision) });
        }
        if (kind === 'projects' && req.method === 'DELETE') {
          store.deleteProject(id, (await readBody(req)).revision); return json(200, { deleted: id });
        }
      }
      const saved = path.match(/^\/api\/sessions\/([^/]+)$/);
      if (saved) {
        const id = saved[1];
        if (req.method === 'GET') return json(200, { session: store.get(id) });
        if (req.method === 'PATCH') {
          const body = await readBody(req);
          return json(200, { session: store.rename(id, body.title, body.revision) });
        }
        if (req.method === 'DELETE') {
          const body = await readBody(req); store.delete(id, body.revision);
          return json(200, { deleted: id });
        }
      }
      if (req.method === 'POST' && ['/api/feedback', '/api/compare'].includes(path)) {
        const body = await readBody(req);
        const type = path === '/api/compare' ? 'compare' : 'feedback';
        if (body.images || body.imageC || (type === 'feedback' && body.imageB)) throw new AppError('Feedback accepts one image. Compare accepts exactly Image A and Image B.');
        if (type === 'compare' && (!body.image || !body.imageB)) throw new AppError('Choose both Image A and Image B before comparing.');
        const image = uploadImage(body.image), imageB = type === 'compare' ? uploadImage(body.imageB) : null, prompt = getPrompt(body.promptId, type);
        const model = requireText(body.model, 'Model', 300);
        const { reply, feedback } = await generateStructuredReview({ client, model, image, imageB, prompt, signal: abort.signal });
        const now = new Date().toISOString();
        if (abort.signal.aborted) throw new AppError('Request cancelled.', 499);
        const title = (type === 'compare' ? `${image.name} / ${imageB.name}` : image.name).slice(0, 200);
        const session = { id: randomUUID(), type, createdAt: now, updatedAt: now, title, image, ...(imageB ? { imageB } : {}), prompt, systemInstruction, model, modelInfo: reply.modelInfo || { provider: 'LM Studio', requestedModel: model, responseModel: reply.model || model }, feedback, chat: [], usage: reply.usage };
        try { return json(200, { session: store.create(session) }); }
        catch (error) { error.raw = reply.raw; throw error; }
      }
      if (req.method === 'POST' && path === '/api/chat') {
        const body = await readBody(req);
        const message = requireText(body.message, 'Message');
        // Only session identity/revision is accepted from the browser. Disk is authoritative.
        const id = body.sessionId ?? body.session?.id;
        const session = store.get(id);
        const revision = body.revision ?? body.session?.revision;
        const requestId = body.requestId ? requireText(body.requestId, 'Request ID', 100) : randomUUID();
        const previous = session.chat.findIndex(turn => turn.role === 'user' && turn.requestId === requestId);
        if (previous >= 0) {
          if (session.chat[previous].content !== message) throw new AppError('This request ID was already used for a different message.', 409);
          return json(200, { session, turn: session.chat[previous + 1], replayed: true });
        }
        store.checkRevision({ revision: session.revision }, revision);
        if (busySessions.has(id)) throw new AppError('A reply is already being generated for this session. Wait for it to finish, then reopen the session.', 409);
        busySessions.add(id);
        try {
          const reply = await client.complete({ model: session.model, messages: chatMessages(session, message), signal: abort.signal });
          if (abort.signal.aborted) throw new AppError('Request cancelled.', 499);
          let updated;
          try { updated = store.append(id, revision, message, reply.raw, requestId, reply.modelInfo || { provider: 'LM Studio', responseModel: reply.model || session.model }); }
          catch (error) { error.raw = reply.raw; throw error; }
          return json(200, { session: updated, turn: updated.chat.at(-1), usage: reply.usage });
        } finally { busySessions.delete(id); }
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
  server.once('close', () => store.close());
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4177);
  const server = createApp();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Open the existing Director instance or choose another PORT.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Director V4 · Projects and creative libraries · http://127.0.0.1:${port}`));
  for (const signal of ['SIGTERM', 'SIGINT']) process.once(signal, () => {
    server.close(); server.closeAllConnections();
  });
}
