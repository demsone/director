// Director v4 application state.  This module deliberately contains no visual
// fixtures: the approved Astra documents remain the visual implementation.
export const STORAGE_KEY = 'director-v4-local-state';

export const now = () => new Date().toISOString();
export const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function freshState() {
  return {
    version: 4,
    projects: [],
    prompts: [],
    feedback: [],
    comparisons: [],
    active: { feedbackId: null, comparisonId: null, projectId: null, draft: null },
    settings: {
      baseStyle: 'Professional',
      warmth: 'Less',
      fastAnswers: true,
      customInstructions: '',
      theme: 'Director',
      accent: 'orange',
      feedbackModel: '',
      compareModel: '',
      visionModel: '',
      serverUrl: 'http://127.0.0.1:1234'
    }
  };
}

function array(value) { return Array.isArray(value) ? value : []; }

export function normalise(input) {
  const base = freshState();
  if (!input || typeof input !== 'object') return base;
  return {
    ...base,
    ...input,
    projects: array(input.projects),
    prompts: array(input.prompts),
    feedback: array(input.feedback),
    comparisons: array(input.comparisons),
    active: { ...base.active, ...(input.active || {}) },
    settings: { ...base.settings, ...(input.settings || {}) }
  };
}

export function load(storage) {
  try { return normalise(JSON.parse(storage.getItem(STORAGE_KEY) || 'null')); }
  catch { return freshState(); }
}

export function save(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(normalise(state)));
  return state;
}

export function visiblePrompts(state, sourceType, useType) {
  return state.prompts.filter((prompt) => !prompt.archived
    && (!sourceType || prompt.category === sourceType || prompt.category === 'General')
    && (!useType || prompt.useType === useType || prompt.useType === 'Both'));
}

export function makeProject(values = {}) {
  const createdAt = now();
  return {
    id: id('project'),
    title: '',
    type: 'Photography',
    description: '',
    notes: '',
    favorite: false,
    createdAt,
    updatedAt: createdAt,
    ...values
  };
}

export function makePrompt(values = {}) {
  const createdAt = now();
  return {
    id: id('prompt'),
    name: '',
    category: 'General',
    useType: 'Feedback',
    description: '',
    body: '',
    systemNote: '',
    archived: false,
    createdAt,
    updatedAt: createdAt,
    ...values
  };
}

export function makeFeedback(values = {}) {
  const createdAt = now();
  return {
    id: id('feedback'),
    kind: 'feedback',
    title: values.source?.name?.replace(/\.[^.]+$/, '') || 'Untitled feedback',
    source: null,
    sourceType: 'Photography',
    promptId: null,
    promptName: 'Custom prompt',
    promptBody: '',
    projectId: null,
    model: '',
    response: '',
    chat: [],
    favorite: false,
    saved: false,
    createdAt,
    updatedAt: createdAt,
    ...values
  };
}

export function makeComparison(values = {}) {
  const createdAt = now();
  return {
    id: id('compare'),
    kind: 'comparison',
    title: 'Compare',
    sources: [],
    sourceType: 'Photography',
    promptId: null,
    promptName: 'Custom prompt',
    promptBody: '',
    projectId: null,
    model: '',
    response: '',
    recommendations: [],
    chat: [],
    favorite: false,
    saved: false,
    createdAt,
    updatedAt: createdAt,
    ...values
  };
}

export function validateFeedback(draft) {
  if (!draft?.source) return 'Select one source first.';
  if (!String(draft.promptBody || '').trim()) return 'Select or write a prompt first.';
  if (!String(draft.model || '').trim()) return 'Set a feedback model in Settings first.';
  return null;
}

export function validateComparison(draft) {
  const count = draft?.sources?.length || 0;
  if (count < 2 || count > 6) return 'Select between 2 and 6 sources.';
  if (!String(draft.promptBody || '').trim()) return 'Select or write a prompt first.';
  if (!String(draft.model || '').trim()) return 'Set a comparison model in Settings first.';
  return null;
}

export function responseConfiguration(settings) {
  const pace = settings.fastAnswers ? 'Be concise where possible.' : 'Take the space needed for a complete review.';
  return [
    `Response style: ${settings.baseStyle}.`,
    `Warmth: ${settings.warmth}.`,
    pace,
    settings.customInstructions ? `User instructions: ${settings.customInstructions}` : ''
  ].filter(Boolean).join('\n');
}

export function feedbackMessages(draft, sourceDataUrl, settings) {
  const content = [{ type: 'text', text: `${draft.promptBody}\n\nReturn a direct, useful creative review.` }];
  if (sourceDataUrl) content.push({ type: 'image_url', image_url: { url: sourceDataUrl } });
  return [{ role: 'system', content: responseConfiguration(settings) }, { role: 'user', content }];
}

export function comparisonMessages(draft, sourceDataUrls, settings) {
  const instruction = `${draft.promptBody}\n\nCompare every supplied source. Return a written read followed by an ordered recommendation for each source. Use this JSON shape only: {"read":"...","recommendations":[{"sourceIndex":1,"title":"...","reason":"..."}]}.`;
  const content = [{ type: 'text', text: instruction }];
  sourceDataUrls.filter(Boolean).forEach((url) => content.push({ type: 'image_url', image_url: { url } }));
  return [{ role: 'system', content: responseConfiguration(settings) }, { role: 'user', content }];
}

export function completionText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) return content.map((part) => part.text || '').join('\n').trim();
  return typeof content === 'string' ? content.trim() : '';
}

export function comparisonResult(raw, sources) {
  let parsed;
  try {
    const candidate = String(raw).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    parsed = JSON.parse(candidate);
  } catch { parsed = null; }
  const supplied = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
  const recommendations = sources.map((source, index) => {
    const model = supplied.find((item) => Number(item.sourceIndex) === index + 1) || supplied[index] || {};
    return {
      sourceIndex: index + 1,
      title: String(model.title || source.name || `Source ${index + 1}`),
      reason: String(model.reason || 'Included in this comparison.')
    };
  });
  return { read: String(parsed?.read || raw || ''), recommendations };
}

export function linkedRecords(state, projectId) {
  return [...state.feedback, ...state.comparisons]
    .filter((record) => record.projectId === projectId)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
}

export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

// The Astra markup represents text as leaf spans. This intentionally limited
// formatter keeps model output inert while retaining bold/list readability.
export function safeMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
