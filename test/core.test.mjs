import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../server.mjs';
import { createModelClient } from '../src/model.mjs';
import { SessionStore } from '../src/store.mjs';
import { getPrompt, prompts, reviewSchema, parseFeedback, findCritiquePolicyViolations, chatMessages, validateImage } from '../src/core.mjs';

const image = { name: 'test.png', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=' };
const imageB = { ...image, name: 'test-b.png' };
const rawFor = prompt => JSON.stringify(Object.fromEntries(prompt.sections.map((heading, i) => [`section_${i+1}`, `Visible observation for ${heading}`])));
async function listen(t, server) { await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); })); return `http://127.0.0.1:${server.address().port}`; }
async function post(base, path, body, headers = {}) { const response = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); return { status: response.status, body: await response.json() }; }
function fixture() { const prompt = getPrompt('photography-review'); return { image, prompt, model: 'vision', feedback: parseFeedback(rawFor(prompt), prompt), chat: [] }; }
function policyRaw(prompt, sentence) { return JSON.stringify(Object.fromEntries(prompt.sections.map((heading, i) => [`section_${i + 1}`, `${sentence} ${heading}.`]))); }

test('Prompt data defines all three categories, ordered schema and complete review rendering', () => {
  assert.deepEqual(prompts.filter(p => !p.sessionType).map(p => p.category), ['Photography', 'Design', 'General']);
  for (const prompt of prompts) {
    assert.equal(reviewSchema(prompt).json_schema.schema.required.length, prompt.sections.length);
    assert.deepEqual(parseFeedback(rawFor(prompt), prompt).sections.map(s => s.heading), prompt.sections);
  }
  assert.equal(prompts[0].sections.length, 11);
});
test('Invalid, empty, missing or extra review sections surface the complete raw response', () => {
  for (const raw of ['not json', '{}', 'null', rawFor(prompts[0]).replace('section_1', 'other'), rawFor(prompts[0]).replace('Visible observation for First impression', '')]) {
    assert.throws(() => parseFeedback(raw, prompts[0]), error => error.status === 502 && error.raw === raw);
  }
});
test('Image validator rejects disguised, remote and oversized input', () => {
  assert.deepEqual(validateImage(image), image);
  for (const dataUrl of ['https://example.com/photo.jpg', 'data:image/png;base64,aGVsbG8=', 'data:image/svg+xml;base64,aGVsbG8=', 'data:image/jpeg;base64,' + 'A'.repeat(16 * 1024 * 1024)]) assert.throws(() => validateImage({ name: 'bad', dataUrl }));
});
test('Every follow-up replays image, original prompt snapshot, full feedback and ordered turns', () => {
  const session = fixture(); session.prompt.instruction = 'Original immutable critique direction';
  session.chat = [{ role: 'user', content: 'My edit is called Courtyard.' }, { role: 'assistant', content: 'Understood.' }];
  const messages = chatMessages(session, 'What did I call it?');
  assert.equal(messages[1].content[0].image_url.url, image.dataUrl);
  assert.match(messages[1].content[1].text, /Original immutable critique direction/);
  assert.equal(messages[2].content, session.feedback.raw);
  assert.deepEqual(messages.slice(3, 5), session.chat);
  assert.equal(messages.at(-1).content, 'What did I call it?');
  session.chat.reverse(); assert.throws(() => chatMessages(session, 'Question'));
});
test('Real HTTP routes accept repeated images as separate critiques and use selected prompt data', async t => {
  const calls = [];
  const client = { models: async () => [{ id: 'vision' }], complete: async request => { calls.push(request); return { raw: request.format ? JSON.stringify(Object.fromEntries(request.format.json_schema.schema.required.map(k => [k, 'Specific critique']))) : 'Follow-up answer' }; } };
  const base = await listen(t, createApp({ client, store: new SessionStore(':memory:') }));
  const request = { image, promptId: 'design-review', model: 'vision' };
  const first = await post(base, '/api/feedback', request), second = await post(base, '/api/feedback', request);
  assert.equal(first.status, 200); assert.equal(second.status, 200);
  assert.notEqual(first.body.session.id, second.body.session.id);
  assert.equal(first.body.session.prompt.category, 'Design');
  assert.equal(first.body.session.feedback.sections.length, 7);
  const chat = await post(base, '/api/chat', { session: first.body.session, message: 'What would you change?' });
  assert.equal(chat.status, 200); assert.equal(chat.body.turn.content, 'Follow-up answer');
  assert.equal(calls[2].messages[1].content[0].image_url.url, image.dataUrl);
  assert.equal(calls[2].messages[2].content, first.body.session.feedback.raw);
  assert.equal(calls[2].format, undefined);
});
test('Invalid prompt, incomplete session, whitespace and cross-origin requests never reach the model', async t => {
  let calls = 0;
  const base = await listen(t, createApp({ client: { complete: () => { calls++; } }, store: new SessionStore(':memory:') }));
  assert.equal((await post(base, '/api/feedback', { image, model: 'vision', promptId: 'missing' })).status, 400);
  assert.equal((await post(base, '/api/chat', { session: {}, message: 'hello' })).status, 400);
  assert.equal((await post(base, '/api/chat', { session: fixture(), message: '   ' })).status, 400);
  assert.equal((await post(base, '/api/feedback', {}, { Origin: 'https://untrusted.example' })).status, 403);
  assert.equal((await fetch(base + '/assets/visual-v4/index.html')).status, 404);
  assert.equal((await fetch(base + '/src/prompts.json')).status, 404);
  assert.equal(calls, 0);
});
test('Provider errors return review raw text without manufacturing a successful session', async t => {
  const base = await listen(t, createApp({ client: { complete: async () => ({ raw: '{"section_1":"incomplete"}' }) }, store: new SessionStore(':memory:') }));
  const response = await post(base, '/api/feedback', { image, model: 'vision', promptId: 'photography-review' });
  assert.equal(response.status, 502); assert.equal(response.body.raw, '{"section_1":"incomplete"}'); assert.equal(response.body.session, undefined);
});
test('Critique-policy validator reports each section, exact excerpt and rule label', () => {
  const prompt = getPrompt('photography-review');
  const feedback = parseFeedback(JSON.stringify({
    section_1: 'The static, intentional geometry creates a clear visual effect.',
    ...Object.fromEntries(prompt.sections.slice(1).map((heading, i) => [`section_${i + 2}`, `Visible observation for ${heading}`]))
  }), prompt);
  assert.deepEqual(findCritiquePolicyViolations(feedback), [{
    sectionNumber: 1,
    heading: prompt.sections[0],
    excerpt: 'intentional',
    label: 'unsupported intentional image-making claims'
  }]);
});
test('Critique-policy validator enforces contextual claims while allowing visible ambiguity', () => {
  const prompt = getPrompt('photography-review');
  const reject = [
    'The photographer placed the chair to create tension.',
    'The photographer intended to convey isolation.',
    'The photographer deliberately framed the subject against the wall.',
    'The scene was staged.',
    'The scene was not staged.',
    'The subject was posed.',
    'The objects were arranged by circumstance.',
    'The moment happened by chance.',
    'The subject feels lonely and wants to escape.',
    'He thinks about leaving.',
    'She wants to disappear.',
    'The candid frame creates tension.'
  ];
  const allow = [
    'The visible pose creates a diagonal through the frame.',
    'The photograph does not establish whether the scene was staged.',
    'It is unclear whether the framing was intentional.',
    'The image does not reveal whether this was planned.',
    'We cannot determine whether the subject was posed.',
    'There is not enough evidence to call the placement deliberate.',
    'His gaze is lowered.',
    'Her expression creates a sense of tension.',
    'His posture can suggest introspection, while his state remains unresolved.',
    'The geometry creates a deliberate-looking regularity, but the image does not establish how it was produced.'
  ];
  const feedbackFor = sentence => parseFeedback(JSON.stringify({
    section_1: sentence,
    ...Object.fromEntries(prompt.sections.slice(1).map((heading, i) => [`section_${i + 2}`, `Visible observation for ${heading}`]))
  }), prompt);
  for (const sentence of reject) assert.ok(findCritiquePolicyViolations(feedbackFor(sentence)).length, `expected rejection: ${sentence}`);
  for (const sentence of allow) assert.deepEqual(findCritiquePolicyViolations(feedbackFor(sentence)), [], `expected allowance: ${sentence}`);
});
async function policyRequest(t, { type = 'feedback', first, second }) {
  const prompt = getPrompt(type === 'compare' ? 'compare-general' : 'photography-review', type), calls = [];
  const store = new SessionStore(':memory:');
  const client = { complete: async request => { calls.push(request); return { raw: (calls.length === 1 ? first : second) ?? first, model: 'vision' }; } };
  const base = await listen(t, createApp({ client, store }));
  const body = { image, promptId: prompt.id, model: 'vision', ...(type === 'compare' ? { imageB } : {}) };
  return { prompt, calls, store, response: await post(base, `/api/${type}`, body) };
}
test('Structured critique policy enforcement retries only violating Feedback and Compare reviews', async t => {
  await t.test('A. retries a candid review and saves only the compliant replacement', async t => {
    const prompt = getPrompt('photography-review');
    const result = await policyRequest(t, { first: policyRaw(prompt, 'The candid frame shows a visible shape.'), second: rawFor(prompt) });
    assert.equal(result.response.status, 200); assert.equal(result.calls.length, 2); assert.match(result.calls[1].messages[3].content, /Section 1 — First impression:[\s\S]*"candid"[\s\S]*Violation: the prohibited word “candid”/); assert.equal(result.response.body.session.feedback.raw, rawFor(prompt));
    assert.equal(result.store.list().length, 1); assert.equal(result.response.body.session.feedback.raw, rawFor(prompt));
  });
  await t.test('B. retries unsupported intent and circumstance language', async t => {
    const prompt = getPrompt('photography-review');
    const result = await policyRequest(t, { first: policyRaw(prompt, 'The objects were arranged by circumstance, not design.'), second: rawFor(prompt) });
    assert.equal(result.response.status, 200); assert.equal(result.calls.length, 2); assert.match(result.calls[1].messages[3].content, /"arranged by circumstance"/); assert.match(result.calls[1].messages[3].content, /"not design"/); assert.equal(result.store.list().length, 1); assert.equal(result.response.body.session.feedback.raw, rawFor(prompt));
  });
  await t.test('C. rejects a second violating review without creating a session', async t => {
    const prompt = getPrompt('photography-review'), second = policyRaw(prompt, 'This was deliberately staged.');
    const result = await policyRequest(t, { first: policyRaw(prompt, 'This was intentional.'), second });
    assert.equal(result.response.status, 502); assert.match(result.response.body.error, /could not produce a critique compliant/i); assert.equal(result.response.body.raw, second); assert.equal(result.store.list().length, 0); assert.equal(result.calls.length, 2);
  });
  await t.test('D. keeps the compliant path to one model call', async t => {
    const prompt = getPrompt('photography-review');
    const result = await policyRequest(t, { first: rawFor(prompt) });
    assert.equal(result.response.status, 200); assert.equal(result.calls.length, 1); assert.equal(result.store.list().length, 1);
  });
  await t.test('E. uses the same enforcement path for Compare', async t => {
    const prompt = getPrompt('compare-general', 'compare');
    const result = await policyRequest(t, { type: 'compare', first: policyRaw(prompt, 'Image A was candid and Image B was posed.'), second: rawFor(prompt) });
    assert.equal(result.response.status, 200); assert.equal(result.calls.length, 2); assert.equal(result.store.list().length, 1); assert.equal(result.response.body.session.type, 'compare'); assert.equal(result.response.body.session.feedback.raw, rawFor(prompt));
  });
  await t.test('F. revalidates a corrective response with the same contextual validator', async t => {
    const prompt = getPrompt('photography-review');
    const second = policyRaw(prompt, 'The photographer intended to convey isolation.');
    const result = await policyRequest(t, {
      first: policyRaw(prompt, 'The photographer placed the chair to create tension.'),
      second
    });
    assert.equal(result.response.status, 502);
    assert.equal(result.response.body.raw, second);
    assert.equal(result.store.list().length, 0);
    assert.equal(result.calls.length, 2);
  });
});
async function provider(t, reply, { slow = false } = {}) {
  const captured = [];
  const baseUrl = await listen(t, http.createServer(async (req, res) => {
    if (req.url === '/api/v1/models') return res.end(JSON.stringify({ models: [
      { type: 'llm', key: 'vision', display_name: 'Vision model', capabilities: { vision: true }, loaded_instances: [{ id: 'vision', config: { context_length: 8192 } }] },
      { type: 'llm', key: 'unloaded', capabilities: { vision: true }, loaded_instances: [] },
      { type: 'llm', key: 'text', capabilities: { vision: false }, loaded_instances: [{ id: 'text' }] }
    ] }));
    let data = ''; for await (const chunk of req) data += chunk;
    captured.push(JSON.parse(data));
    if (slow) return;
    res.end(JSON.stringify(reply));
  }));
  return { client: createModelClient({ baseUrl, timeoutMs: 50 }), captured };
}
test('Model discovery includes only loaded vision instances and blocks a text-only model', async t => {
  const { client, captured } = await provider(t, {});
  assert.deepEqual((await client.models()).map(m => m.id), ['vision']);
  await assert.rejects(client.complete({ model: 'text', messages: [] }), /not loaded/);
  assert.equal(captured.length, 0);
});
test('Model transport sends original image messages and JSON schema without stripping content', async t => {
  const raw = rawFor(prompts[0]);
  const { client, captured } = await provider(t, { choices: [{ finish_reason: 'stop', message: { content: raw } }] });
  const messages = chatMessages(fixture(), 'What colour?'), format = reviewSchema(prompts[0]);
  assert.equal((await client.complete({ model: 'vision', messages, format })).raw, raw);
  assert.deepEqual(captured[0].messages, messages); assert.deepEqual(captured[0].response_format, format);
});
test('Truncated responses and reasoning-only responses fail explicitly', async t => {
  const truncated = await provider(t, { choices: [{ finish_reason: 'length', message: { content: 'partial review' } }] });
  await assert.rejects(truncated.client.complete({ model: 'vision', messages: [] }), e => e.raw === 'partial review' && /incomplete/.test(e.message));
  const empty = await provider(t, { choices: [{ finish_reason: 'length', message: { content: '', reasoning_content: 'thinking' } }] });
  await assert.rejects(empty.client.complete({ model: 'vision', messages: [] }), /no final answer/);
});
test('Timeout and explicit cancellation return actionable errors', async t => {
  const { client } = await provider(t, {}, { slow: true });
  await assert.rejects(client.complete({ model: 'vision', messages: [] }), /timed out/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(client.complete({ model: 'vision', messages: [], signal: controller.signal }), /cancelled/);
});
test('Provider configuration cannot send images to a remote server', () => {
  assert.throws(() => createModelClient({ baseUrl: 'https://api.example.com' }), /local HTTP/);
  assert.throws(() => createModelClient({ baseUrl: 'http://127.0.0.1:1234/v1' }), /local HTTP/);
});
