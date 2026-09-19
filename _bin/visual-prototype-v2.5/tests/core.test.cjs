const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../app-core.js');

test('fresh state contains the complete unique editable prompt library', () => {
  const state = Core.freshState();
  assert.equal(state.prompts.length, 23);
  assert.equal(new Set(state.prompts.map((item) => item.name)).size, 23);
  assert.ok(state.prompts.every((item) => item.archived === false));
  assert.deepEqual(state.prompts.slice(0, 4).map((item) => item.name), ['Full Photography Critique', 'Street Photography Read', 'Print Potential', 'Class A / B / Archive Selector']);
  assert.ok(!state.prompts.some((item) => item.name === 'Editorial Image Edit'));
  assert.match(state.prompts.find((item) => item.name === 'Full Photography Critique').body, /Three possible titles/);
  assert.match(state.prompts.find((item) => item.name === 'Production Handoff Review').body, /missing empty states/);
  assert.equal(state.feedbackSessions.length, 0);
  assert.equal(state.compareSessions.length, 0);
});

test('prompt filtering respects source context and use type', () => {
  const state = Core.freshState();
  const photography = Core.visiblePrompts(state, 'Photography', 'Feedback');
  const compare = Core.visiblePrompts(state, 'Design', 'Compare');
  assert.ok(photography.some((item) => item.name === 'Street Photography Read'));
  assert.ok(photography.some((item) => item.name === 'Quick Creative Direction'));
  assert.ok(!photography.some((item) => item.name === 'A/B Design Decision'));
  assert.ok(compare.some((item) => item.name === 'Mockup Comparison'));
  assert.ok(compare.some((item) => item.name === 'Quick Creative Direction'));
});

test('state persists through the local storage adapter and restores missing fields safely', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
  const state = Core.freshState();
  state.projects.push({ id: 'project-1', title: 'Test project' });
  Core.save(storage, state);
  const restored = Core.load(storage);
  assert.equal(restored.projects[0].title, 'Test project');
  assert.equal(restored.settings.serverUrl, 'http://127.0.0.1:1234');
});

test('markdown is escaped before the limited display formatting is applied', () => {
  const html = Core.markdown('**First impression:** <script>bad()</script>');
  assert.match(html, /<strong>First impression:<\/strong>/);
  assert.match(html, /&lt;script&gt;bad\(\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('markdown links remain limited to safe HTTP destinations', () => {
  const html = Core.markdown('[Open](https://localhost:1234/"bad)');
  assert.match(html, /href="https:\/\/localhost:1234\/%22bad"/);
  assert.doesNotMatch(html, /onerror=/);
});
