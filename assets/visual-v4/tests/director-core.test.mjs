import test from 'node:test';
import assert from 'node:assert/strict';
import * as Core from '../director-core.js';

test('fresh v4 state contains no fixture records', () => {
  const state = Core.freshState();
  assert.deepEqual(state.projects, []);
  assert.deepEqual(state.prompts, []);
  assert.deepEqual(state.feedback, []);
  assert.deepEqual(state.comparisons, []);
  assert.equal(state.settings.serverUrl, 'http://127.0.0.1:1234');
});

test('local state restoration retains linked record collections and safe defaults', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  const state = Core.freshState();
  const project = Core.makeProject({ title: 'Editorial' });
  state.projects.push(project);
  state.feedback.push(Core.makeFeedback({ title: 'Landing page', projectId: project.id, saved: true }));
  Core.save(storage, state);
  const restored = Core.load(storage);
  assert.equal(restored.projects[0].title, 'Editorial');
  assert.equal(Core.linkedRecords(restored, project.id).length, 1);
  assert.equal(restored.settings.baseStyle, 'Professional');
});

test('feedback and comparison validation enforce the supplied source rules', () => {
  assert.match(Core.validateFeedback({}), /source/i);
  assert.match(Core.validateComparison({ sources: [{}], promptBody: 'x', model: 'vision' }), /2 and 6/i);
  assert.equal(Core.validateComparison({ sources: [{}, {}], promptBody: 'Compare these', model: 'vision' }), null);
});

test('comparison results preserve the submitted source count when model JSON is absent', () => {
  const result = Core.comparisonResult('A direct model read.', [{ name: 'one.png' }, { name: 'two.png' }, { name: 'three.png' }]);
  assert.equal(result.read, 'A direct model read.');
  assert.equal(result.recommendations.length, 3);
  assert.deepEqual(result.recommendations.map((item) => item.title), ['one.png', 'two.png', 'three.png']);
});

test('comparison request content includes every supplied local source and personalisation', () => {
  const settings = { ...Core.freshState().settings, customInstructions: 'Keep it direct.' };
  const messages = Core.comparisonMessages({ promptBody: 'Choose the strongest.' }, ['data:image/png;base64,a', 'data:image/png;base64,b'], settings);
  assert.equal(messages[1].content.filter((item) => item.type === 'image_url').length, 2);
  assert.match(messages[0].content, /Keep it direct/);
});

test('model text is escaped before applying the limited Astra-compatible formatting', () => {
  const html = Core.safeMarkdown('**Read:** <script>bad()</script>');
  assert.match(html, /<strong>Read:<\/strong>/);
  assert.match(html, /&lt;script&gt;bad\(\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});
