import * as Core from './director-core.js';

// Behaviour is intentionally layered on the Astra documents at runtime. The
// source HTML/CSS continues to own all geometry, typography, colours and
// surface treatment; this file only supplies state, events and record values.
const state = Core.load(localStorage);
const screen = document.body.dataset.screen || '';
const query = new URLSearchParams(location.search);
const frame = document.querySelector('.source-frame');
const one = (selector, scope = document) => scope.querySelector(selector);
const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const named = (name, scope = document) => all('[data-name]', scope).filter((node) => node.dataset.name === name);
const firstNamed = (name, scope = document) => named(name, scope)[0] || null;
const text = (node) => node?.textContent?.replace(/\s+/g, ' ').trim() || '';
const normal = (value) => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();

function leaf(node) {
  if (!node) return null;
  return all('.text-content span', node).at(-1) || one('.text-content', node) || node;
}
function setText(node, value) {
  const target = leaf(node);
  if (target) target.textContent = String(value ?? '');
  return node;
}
function setHtml(node, value) {
  const target = leaf(node);
  if (target) target.innerHTML = Core.safeMarkdown(value);
  return node;
}
function button(label, scope = document) {
  return named('UI / Button', scope).find((node) => normal(text(node)) === normal(label))
    || all('[data-name]', scope).find((node) => normal(text(node)) === normal(label)) || null;
}
function fieldWith(label, scope = document) {
  return named('Form / Field', scope).find((node) => normal(text(node)).includes(normal(label))) || null;
}
function makeClickable(node, handler, title = '') {
  if (!node) return;
  node.style.cursor = 'pointer';
  if (title) node.title = title;
  node.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); handler(event); });
}
function fixtureOnly(node) {
  if (!node) return;
  node.removeAttribute('href');
  node.setAttribute('aria-disabled', 'true');
  node.style.cursor = 'default';
  node.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); });
}
function makeEditable(node, value, label, onChange, { clearOnFirstFocus = false } = {}) {
  const target = leaf(node);
  if (!target) return () => '';
  if (value !== undefined) setText(node, value);
  target.contentEditable = 'true';
  target.setAttribute('role', 'textbox');
  target.setAttribute('aria-label', label);
  target.spellcheck = false;
  let pristine = clearOnFirstFocus;
  target.addEventListener('focus', () => {
    if (pristine) { target.textContent = ''; pristine = false; }
  }, { once: true });
  target.addEventListener('input', () => onChange?.(target.textContent.trim()));
  return () => target.textContent.trim();
}
function persist() { Core.save(localStorage, state); }
function go(page, params = {}) {
  const search = new URLSearchParams(params);
  location.href = `${page}.html${[...search].length ? `?${search}` : ''}`;
}
function recordFrom(list, id) { return list.find((item) => item.id === id) || null; }
function activeFeedback() { return recordFrom(state.feedback, query.get('feedback') || state.active.feedbackId); }
function activeComparison() { return recordFrom(state.comparisons, query.get('comparison') || state.active.comparisonId); }
function activeProject() { return recordFrom(state.projects, query.get('project') || state.active.projectId); }
function sourceKind(sourceType) { return sourceType === 'Design' ? 'design' : 'darkroom'; }
function recordTitle(source) { return source?.name?.replace(/\.[^.]+$/, '') || 'Untitled'; }
function sourceTypeCycle(current) {
  const choices = ['Photography', 'Design', 'General'];
  return choices[(choices.indexOf(current) + 1) % choices.length];
}
function choicesCycle(current, choices) {
  return choices[(choices.indexOf(current) + 1) % choices.length];
}
function status(node, value) { setText(node, value); }
function touch(record) { record.updatedAt = Core.now(); persist(); }

// Source files are stored locally in IndexedDB rather than copied into the
// Astra fixtures or sent anywhere except the user's configured local model.
const Assets = (() => {
  let database;
  function open() {
    if (!database) database = new Promise((resolve, reject) => {
      const request = indexedDB.open('director-v4-assets', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('sources');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return database;
  }
  async function transaction(mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const request = action(db.transaction('sources', mode).objectStore('sources'));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return {
    put: async (file) => {
      const source = { id: Core.id('source'), name: file.name, type: file.type || 'application/octet-stream', size: file.size, createdAt: Core.now() };
      await transaction('readwrite', (store) => store.put(file, source.id));
      return source;
    },
    dataUrl: async (source) => {
      if (!source?.id) return '';
      const blob = await transaction('readonly', (store) => store.get(source.id));
      if (!blob) return '';
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    },
    remove: async (source) => source?.id && transaction('readwrite', (store) => store.delete(source.id))
  };
})();

async function setImage(node, source) {
  if (!node || !source) return;
  try {
    const url = await Assets.dataUrl(source);
    if (!url) return;
    const image = one('img.source-image', node);
    if (image) image.src = url;
    else {
      node.style.backgroundImage = `url("${url}")`;
      node.style.backgroundSize = 'cover';
      node.style.backgroundPosition = 'center';
    }
  } catch { /* An unavailable local file leaves the approved placeholder intact. */ }
}

async function pickSources({ multiple = false, maximum = 1 } = {}) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.multiple = multiple; input.hidden = true;
    document.body.append(input);
    input.addEventListener('change', async () => {
      try { resolve(await storeSources(input.files, maximum)); }
      catch { resolve([]); }
      finally { input.remove(); }
    }, { once: true });
    input.click();
  });
}

async function storeSources(files, maximum) {
  const selected = [...(files || [])].filter((file) => file?.type?.startsWith('image/')).slice(0, maximum);
  return Promise.all(selected.map((file) => Assets.put(file)));
}

function acceptDroppedSources(node, { maximum = 1, onSources } = {}) {
  if (!node) return;
  const reset = () => { node.style.outline = ''; node.style.outlineOffset = ''; };
  node.addEventListener('dragenter', (event) => {
    if (!event.dataTransfer?.types?.includes('Files')) return;
    event.preventDefault();
    node.style.outline = '1px solid var(--color-ui-accent-primary)';
    node.style.outlineOffset = '2px';
  });
  node.addEventListener('dragover', (event) => {
    if (!event.dataTransfer?.types?.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  node.addEventListener('dragleave', reset);
  node.addEventListener('drop', async (event) => {
    if (!event.dataTransfer?.files?.length) return;
    event.preventDefault(); reset();
    const sources = await storeSources(event.dataTransfer.files, maximum);
    if (sources.length) await onSources?.(sources);
  });
}

function modelConnectionError(error, base = state.settings.serverUrl) {
  const message = String(error?.message || '').replace(/\s+/g, ' ').trim();
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return `LM Studio is not reachable at ${base}. Start its local server, then test Settings → Models.`;
  }
  return message || 'The configured local model could not be reached.';
}

function modelProxyUrl(base, path) {
  const parameters = new URLSearchParams({ endpoint: base, path });
  return `/__director_model_proxy?${parameters}`;
}

async function callModel(model, messages) {
  const base = String(state.settings.serverUrl || '').replace(/\/$/, '');
  if (!base) throw new Error('A local server URL is required.');
  try {
    const response = await fetch(modelProxyUrl(base, '/v1/chat/completions'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: state.settings.fastAnswers ? 0.35 : 0.6, stream: false })
    });
    if (!response.ok) {
      let detail = '';
      try { detail = String((await response.json())?.error?.message || ''); } catch { /* HTTP code remains useful. */ }
      throw new Error(`Local model request failed (${response.status})${detail ? `: ${detail}` : ''}.`);
    }
    const content = Core.completionText(await response.json());
    if (!content) throw new Error('The local model returned no text.');
    return content;
  } catch (error) {
    throw new Error(modelConnectionError(error, base));
  }
}

function showWorkflowError(field, error) {
  if (!field) return;
  setText(firstNamed('heading', field), 'MODEL CONNECTION FAILED');
  status(field, modelConnectionError(error));
}

function currentPrompt(draft) {
  return recordFrom(state.prompts, draft.promptId) || null;
}
function cyclePrompt(draft, useType, selector, editor, statusNode) {
  const prompts = Core.visiblePrompts(state, draft.sourceType, useType);
  if (!prompts.length) { status(statusNode, 'Add a saved prompt or write a custom one.'); return; }
  const index = prompts.findIndex((item) => item.id === draft.promptId);
  const selected = prompts[(index + 1) % prompts.length];
  draft.promptId = selected.id; draft.promptName = selected.name; draft.promptBody = selected.body;
  setText(selector, selected.name); setText(editor, selected.body);
}
function cycleProject(draft, selector, afterCreate, event) {
  if (event?.shiftKey || !state.projects.length) {
    openProjectModal(null, (project) => { draft.projectId = project.id; setText(selector, project.title); afterCreate?.(); });
    return;
  }
  const index = state.projects.findIndex((item) => item.id === draft.projectId);
  const selected = state.projects[(index + 1) % state.projects.length];
  draft.projectId = selected.id; setText(selector, selected.title);
}

async function mountSourceRoot(file, rootName) {
  const response = await fetch(file, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${file}.`);
  const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
  const source = firstNamed(rootName, parsed);
  if (!source || !frame) throw new Error(`Missing approved ${rootName} source.`);
  const clone = document.importNode(source, true);
  clone.dataset.runtimeOverlay = 'true';
  clone.style.zIndex = '50';
  frame.append(clone);
  return clone;
}
async function mountOverlayParts(file, partNames, blur = 0) {
  const response = await fetch(file, { cache: 'no-store' });
  if (!response.ok || !frame) throw new Error(`Could not load ${file}.`);
  const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
  const overlay = document.createElement('div');
  overlay.dataset.runtimeOverlay = 'true';
  overlay.style.cssText = 'position:absolute;inset:0;z-index:50;pointer-events:auto;';
  partNames.forEach((partName, index) => {
    const source = firstNamed(partName, parsed);
    if (!source) throw new Error(`Missing approved ${partName} source.`);
    const clone = document.importNode(source, true);
    clone.style.zIndex = String(index + 1);
    if (index === 0 && blur) clone.style.backdropFilter = `blur(${blur}px)`;
    overlay.append(clone);
  });
  frame.append(overlay);
  return overlay;
}
function removeOverlay(overlay) { overlay?.remove(); }

async function openProjectModal(projectId, done) {
  const existing = projectId ? recordFrom(state.projects, projectId) : null;
  const draft = { ...(existing || Core.makeProject()) };
  const overlay = await mountOverlayParts('project-settings.html', ['Modal / Background', 'Modal / Edit'], 8.7);
  const modal = firstNamed('Modal / Edit', overlay);
  setText(firstNamed('project-title', modal), existing ? 'Edit project' : 'New project');
  const projectFields = named('Form / Field', modal);
  const readTitle = makeEditable(projectFields[0], draft.title, 'Project title', (value) => { draft.title = value; });
  const typeField = projectFields[1];
  const readType = makeEditable(typeField, draft.type, 'Project type', (value) => { draft.type = value || draft.type; });
  makeClickable(typeField, () => { draft.type = choicesCycle(draft.type, ['Photography', 'Design', 'General']); setText(typeField, draft.type); }, 'Click to change type');
  const readDescription = makeEditable(projectFields[2], draft.description, 'Project description', (value) => { draft.description = value; });
  makeClickable(firstNamed('cancel-button', modal), () => removeOverlay(overlay));
  makeClickable(firstNamed('save-button', modal), () => {
    draft.title = readTitle() || 'Untitled project';
    draft.type = readType() || draft.type;
    draft.description = readDescription();
    draft.updatedAt = Core.now();
    if (existing) Object.assign(existing, draft); else state.projects.unshift(draft);
    state.active.projectId = draft.id; persist(); removeOverlay(overlay); done?.(draft);
    if (!done && screen === 'projects') go('project-overview', { project: draft.id });
  });
}

async function openQuickView(record, context) {
  const sourceFile = context === 'design' ? 'design-studio-quick.html' : 'darkroom-quick.html';
  const overlay = await mountOverlayParts(sourceFile, ['model-background', 'Quick View / Drawer'], 18);
  const drawer = firstNamed('Quick View / Drawer', overlay);
  setText(firstNamed('side-drawer-header', drawer), record.title);
  setText(firstNamed('prompt-reply', drawer), record.promptName || 'Custom prompt');
  const fields = named('Form / Field', drawer);
  setHtml(fields[0], record.promptBody || '');
  setHtml(fields[1], record.response || '');
  makeClickable(firstNamed('button-close', drawer), () => removeOverlay(overlay));
  makeClickable(button('VIEW FULL FEEDBACK', drawer), () => {
    removeOverlay(overlay); state.active.feedbackId = record.id; persist();
    go(context === 'design' ? 'design-studio-detail' : 'darkroom-detail', { feedback: record.id });
  });
}

async function openPromptEditor(promptId) {
  const existing = promptId ? recordFrom(state.prompts, promptId) : null;
  const draft = { ...(existing || Core.makePrompt()) };
  const overlay = await mountOverlayParts('prompt-edit.html', ['model-background', 'Quick View / Drawer'], 18);
  const drawer = firstNamed('Quick View / Drawer', overlay);
  setText(firstNamed('side-drawer-header', drawer), existing ? 'Edit Prompt' : 'New Prompt');
  const fields = named('Form / Field', drawer);
  const readers = [
    makeEditable(fields[0], draft.name, 'Prompt name', (value) => { draft.name = value; }),
    makeEditable(fields[1], draft.category, 'Prompt category', (value) => { draft.category = value; }),
    makeEditable(fields[2], draft.useType, 'Prompt use type', (value) => { draft.useType = value; }),
    makeEditable(fields[3], draft.description, 'Prompt description', (value) => { draft.description = value; }),
    makeEditable(fields[4], draft.body, 'Prompt body', (value) => { draft.body = value; }),
    makeEditable(fields[5], draft.systemNote, 'System note', (value) => { draft.systemNote = value; })
  ];
  makeClickable(fields[1], () => { draft.category = choicesCycle(draft.category, ['Photography', 'Design', 'General']); setText(fields[1], draft.category); }, 'Click to change category');
  makeClickable(fields[2], () => { draft.useType = choicesCycle(draft.useType, ['Feedback', 'Compare', 'Both']); setText(fields[2], draft.useType); }, 'Click to change use type');
  const archive = firstNamed('Input', drawer);
  if (archive) {
    setText(archive, draft.archived ? 'UNARCHIVE' : 'ARCHIVE');
    makeClickable(archive, () => { draft.archived = !draft.archived; setText(archive, draft.archived ? 'UNARCHIVE' : 'ARCHIVE'); });
  }
  const close = firstNamed('button-close', drawer) || button('CANCEL', drawer);
  makeClickable(close, () => removeOverlay(overlay));
  makeClickable(button('SAVE PROMPT', drawer), () => {
    [draft.name, draft.category, draft.useType, draft.description, draft.body, draft.systemNote] = readers.map((read) => read());
    if (!draft.name || !draft.body || !['Photography', 'Design', 'General'].includes(draft.category) || !['Feedback', 'Compare', 'Both'].includes(draft.useType)) return;
    draft.updatedAt = Core.now();
    if (existing) Object.assign(existing, draft); else state.prompts.unshift(draft);
    persist(); removeOverlay(overlay); attachPromptLibrary();
  });
}

function renderFeedback(record) {
  if (!record) return;
  const titleNode = firstNamed('title-body') || firstNamed('header-title');
  setText(titleNode, record.title);
  setText(firstNamed('photography-input'), record.sourceType);
  setText(firstNamed('prompt-selector'), record.promptName || 'Custom prompt');
  setText(firstNamed('date-created'), Core.formatDate(record.createdAt));
  named('model-name').forEach((node) => setText(node, `ONLINE · LM STUDIO · ${record.model}`));
  const outputField = named('Form / Field').find((node) => /FIRST READ|FEEDBACK/i.test(text(node))) || named('Form / Field').at(-1);
  if (outputField) { setText(firstNamed('heading', outputField), 'FIRST READ'); setHtml(firstNamed('output text', outputField), record.response); }
  setImage(firstNamed('Feedback / File'), record.source);
  setImage(firstNamed('image.jpg'), record.source);
}

function renderComparison(record) {
  if (!record) return;
  setText(firstNamed('title-body') || firstNamed('header-title'), record.title);
  setText(firstNamed('photography-input'), record.sourceType);
  setText(firstNamed('prompt-selector'), record.promptName || 'Custom prompt');
  setText(firstNamed('date-created'), Core.formatDate(record.createdAt));
  named('model-name').forEach((node) => setText(node, `ONLINE · LM STUDIO · ${record.model}`));
  const output = firstNamed('reply') || named('Form / Field').find((node) => /FIRST READ/i.test(text(node)));
  if (output) { setText(firstNamed('heading', output), 'FIRST READ'); setHtml(firstNamed('output text', output), record.response); }
  const cards = named('Compare / Results');
  const template = cards.at(-1);
  while (template && cards.length < record.recommendations.length) {
    const copy = template.cloneNode(true);
    const previous = cards.at(-1);
    const previousTop = previous.offsetTop;
    const gap = cards.length > 1 ? previous.offsetTop - cards.at(-2).offsetTop - previous.offsetHeight : 16;
    copy.style.top = `${previousTop + previous.offsetHeight + Math.max(0, gap)}px`;
    copy.dataset.runtimeRecommendation = 'true';
    previous.parentElement.append(copy);
    cards.push(copy);
  }
  record.recommendations.forEach((recommendation, index) => {
    const card = cards[index]; if (!card) return;
    setText(firstNamed('Label Alternative / Extra Large 15px', card) || firstNamed('heading', card), `#${index + 1}`);
    const description = firstNamed('output text', card) || firstNamed('form-text', card);
    setText(description, `${recommendation.title} — ${recommendation.reason}`);
  });
  cards.slice(record.recommendations.length).forEach((card) => { card.style.display = 'none'; });
}

function attachContextChat(record, kind) {
  const editor = firstNamed('prompt-text');
  const send = firstNamed('enter-button');
  if (!editor || !send) return;
  const latest = record.chat?.at(-1);
  if (latest?.role === 'assistant') setText(editor, latest.content);
  const readMessage = makeEditable(editor, undefined, 'Ask Director', null, { clearOnFirstFocus: !!latest });
  makeClickable(send, async () => {
    const content = readMessage(); if (!content) return;
    const model = record.model || (kind === 'comparison' ? state.settings.compareModel : state.settings.feedbackModel) || state.settings.visionModel;
    if (!model) { setText(editor, 'Set a model in Settings first.'); return; }
    record.chat.push({ role: 'user', content, createdAt: Core.now() }); setText(editor, 'DIRECTOR IS READING…');
    try {
      const sourceUrls = kind === 'comparison'
        ? await Promise.all(record.sources.map((source) => Assets.dataUrl(source)))
        : [await Assets.dataUrl(record.source)];
      const context = kind === 'comparison'
        ? Core.comparisonMessages(record, sourceUrls, state.settings)
        : Core.feedbackMessages(record, sourceUrls[0], state.settings);
      context.push({ role: 'assistant', content: record.response }, ...record.chat.map((message) => ({ role: message.role, content: message.content })));
      const reply = await callModel(model, context);
      record.chat.push({ role: 'assistant', content: reply, createdAt: Core.now() }); touch(record); setText(editor, reply);
    } catch (error) { setText(editor, error.message || 'REQUEST FAILED'); }
  });
}

function attachFeedbackNew() {
  const carried = state.active.draft?.kind === 'feedback' ? state.active.draft : null;
  const draft = carried || { kind: 'feedback', source: null, sourceType: query.get('domain') === 'design' ? 'Design' : 'Photography', promptId: null, promptName: '', promptBody: '', projectId: null, model: '' };
  const fileBox = firstNamed('Feedback / File');
  const typeBox = firstNamed('photography-input');
  const selectors = named('prompt-selector'); const promptSelector = selectors[0], projectSelector = selectors[1];
  const editor = firstNamed('prompt-textarea'); const output = fieldWith('NOTHING TO FEEDBACK') || named('Form / Field').at(-1);
  if (carried?.source) { setText(fileBox, carried.source.name); setImage(fileBox, carried.source); }
  if (carried) { setText(typeBox, carried.sourceType); if (carried.promptName) setText(promptSelector, carried.promptName); if (carried.promptBody) setText(editor, carried.promptBody); }
  const useSource = async ([source]) => {
    if (!source) return;
    draft.source = source; setText(fileBox, source.name); await setImage(fileBox, source); status(output, 'READY FOR FEEDBACK');
  };
  makeClickable(fileBox, async () => { await useSource(await pickSources()); }, 'Choose a source file');
  acceptDroppedSources(fileBox, { maximum: 1, onSources: useSource });
  makeClickable(typeBox, () => { draft.sourceType = sourceTypeCycle(draft.sourceType); draft.promptId = null; draft.promptName = ''; setText(typeBox, draft.sourceType); setText(promptSelector, 'Select prompt'); }, 'Click to change source type');
  makeClickable(promptSelector, () => cyclePrompt(draft, 'Feedback', promptSelector, editor, output), 'Click to choose a saved prompt');
  makeEditable(editor, undefined, 'Custom feedback prompt', (value) => { draft.promptId = null; draft.promptName = 'Custom prompt'; draft.promptBody = value; });
  makeClickable(projectSelector, (event) => cycleProject(draft, projectSelector, persist, event), 'Click to choose a project; Shift-click to create one');
  makeClickable(button('GET FEEDBACK'), () => {
    if (!draft.promptBody && draft.promptId) draft.promptBody = currentPrompt(draft)?.body || '';
    draft.model = state.settings.feedbackModel || state.settings.visionModel || '';
    const error = Core.validateFeedback(draft); if (error) { status(output, error); return; }
    state.active.draft = draft; persist(); go('feedback-thinking');
  });
}

async function attachFeedbackThinking() {
  const draft = state.active.draft?.kind === 'feedback' ? state.active.draft : null;
  if (!draft || draft.status === 'running') return;
  draft.status = 'running'; persist();
  try {
    const image = await Assets.dataUrl(draft.source);
    const response = await callModel(draft.model, Core.feedbackMessages(draft, image, state.settings));
    const record = Core.makeFeedback({ ...draft, title: recordTitle(draft.source), response, saved: false, status: undefined });
    delete record.status; state.feedback.unshift(record); state.active.feedbackId = record.id; state.active.draft = null; persist();
    go('feedback-complete', { feedback: record.id });
  } catch (error) {
    draft.status = 'failed'; persist();
    const output = named('Form / Field').find((node) => /WRITING FEEDBACK|FIRST READ/i.test(text(node))) || named('Form / Field').at(-1);
    showWorkflowError(output, error);
  }
}

function attachFeedbackRecord({ detail = false } = {}) {
  const record = activeFeedback(); if (!record) return;
  renderFeedback(record);
  makeClickable(button(detail ? 'UPDATE FEEDBACK' : 'SAVE FEEDBACK'), () => { record.saved = true; touch(record); });
  makeClickable(button('NEW FEEDBACK'), () => { state.active.draft = null; state.active.feedbackId = null; persist(); go('feedback-new'); });
  const actions = named('Project / Toolbar Action');
  makeClickable(firstNamed('pencil', actions[0] || document), () => {
    const next = window.prompt('Feedback title', record.title); if (!next?.trim()) return; record.title = next.trim(); touch(record); renderFeedback(record);
  });
  makeClickable(firstNamed('Star', actions[1] || document), () => { record.favorite = !record.favorite; touch(record); });
  makeClickable(firstNamed('bin', actions[2] || document), async () => {
    if (!window.confirm('Delete this feedback?')) return;
    state.feedback = state.feedback.filter((item) => item.id !== record.id); state.active.feedbackId = null; persist(); await Assets.remove(record.source); go(detail ? (screen.startsWith('design') ? 'design-studio' : 'darkroom') : 'feedback-new');
  });
  const selector = firstNamed('prompt-selector');
  makeClickable(selector, (event) => cycleProject(record, selector, () => touch(record), event), 'Click to choose a project; Shift-click to create one');
  attachContextChat(record, 'feedback');
}

function attachCompareNew() {
  const carried = state.active.draft?.kind === 'comparison' ? state.active.draft : null;
  const draft = carried || { kind: 'comparison', sources: [], sourceType: 'Photography', promptId: null, promptName: '', promptBody: '', projectId: null, model: '' };
  const fileBox = firstNamed('file-box') || firstNamed('Feedback / File');
  const selectors = named('photography-input'); const typeBox = selectors[0], projectBox = selectors[1], promptBox = selectors[2];
  const reply = firstNamed('reply');
  if (carried?.sources?.length) { setText(fileBox, `${carried.sources.length} sources attached`); setText(typeBox, carried.sourceType); }
  const useSources = async (sources) => {
    if (!sources.length) return;
    draft.sources = sources; setText(fileBox, `${sources.length} sources attached`); status(reply, sources.length >= 2 ? 'READY TO COMPARE' : 'SELECT ONE MORE SOURCE');
  };
  makeClickable(fileBox, async () => { await useSources(await pickSources({ multiple: true, maximum: 6 })); }, 'Choose 2 to 6 source files');
  acceptDroppedSources(fileBox, { maximum: 6, onSources: useSources });
  makeClickable(typeBox, () => { draft.sourceType = sourceTypeCycle(draft.sourceType); setText(typeBox, draft.sourceType); }, 'Click to change source type');
  makeClickable(projectBox, (event) => cycleProject(draft, projectBox, persist, event), 'Click to choose a project; Shift-click to create one');
  makeClickable(promptBox, () => cyclePrompt(draft, 'Compare', promptBox, firstNamed('prompt-bar') || promptBox, reply), 'Click to choose a saved prompt');
  makeClickable(button('CLEAR'), () => { draft.sources = []; setText(fileBox, 'Ask for feedback'); status(reply, 'NOTHING TO COMPARE'); });
  makeClickable(button('CLEAR PROMPT'), () => { draft.promptId = null; draft.promptName = ''; draft.promptBody = ''; setText(promptBox, 'Select prompt'); });
  makeClickable(button('COMPARE SOURCES'), () => {
    draft.model = state.settings.compareModel || state.settings.visionModel || '';
    const error = Core.validateComparison(draft); if (error) { status(reply, error); return; }
    state.active.draft = draft; persist(); go('compare-thinking');
  });
}

async function attachCompareThinking() {
  const draft = state.active.draft?.kind === 'comparison' ? state.active.draft : null;
  if (!draft || draft.status === 'running') return;
  draft.status = 'running'; persist();
  try {
    const imageUrls = await Promise.all(draft.sources.map((source) => Assets.dataUrl(source)));
    const raw = await callModel(draft.model, Core.comparisonMessages(draft, imageUrls, state.settings));
    const parsed = Core.comparisonResult(raw, draft.sources);
    const record = Core.makeComparison({ ...draft, title: draft.sources.map((source) => recordTitle(source)).join(' / '), response: parsed.read, recommendations: parsed.recommendations, saved: false });
    delete record.status; state.comparisons.unshift(record); state.active.comparisonId = record.id; state.active.draft = null; persist();
    go('compare-complete', { comparison: record.id });
  } catch (error) {
    draft.status = 'failed'; persist(); showWorkflowError(firstNamed('reply') || named('Form / Field').at(-1), error);
  }
}

function attachComparisonRecord({ detail = false } = {}) {
  const record = activeComparison(); if (!record) return;
  renderComparison(record);
  const saveControl = detail ? (button('UPDATE COMPARISON') || button('UPDATE FEEDBACK')) : button('SAVE COMPARISON');
  makeClickable(saveControl, () => { record.saved = true; touch(record); });
  makeClickable(button('NEW COMPARISON') || button('ASK FOR NEW FEEDBACK'), () => { state.active.draft = null; state.active.comparisonId = null; persist(); go('compare-new'); });
  const selector = firstNamed('prompt-selector');
  makeClickable(selector, (event) => cycleProject(record, selector, () => touch(record), event), 'Click to choose a project; Shift-click to create one');
  attachContextChat(record, 'comparison');
}

function setLibraryCard(card, record, context) {
  card.style.display = '';
  setText(firstNamed('Label / Medium 13px', card) || firstNamed('Body / Tiny', card), record.title);
  setText(firstNamed('date-created', card), Core.formatDate(record.updatedAt || record.createdAt));
  setImage(firstNamed('UI / Image', card) || card, record.source);
  makeClickable(card, () => openQuickView(record, context));
}
function attachFeedbackLibrary(context) {
  const records = state.feedback.filter((record) => record.saved && sourceKind(record.sourceType) === context);
  makeClickable(button('ADD NEW FEEDBACK'), () => go('feedback-new', context === 'design' ? { domain: 'design' } : {}));
  const cards = named('UI / File Thumb');
  if (!records.length) { cards.forEach(fixtureOnly); return; }
  cards.forEach((card, index) => {
    const record = records[index]; if (!record) { card.style.display = 'none'; return; }
    setLibraryCard(card, record, context);
  });
}

function attachCompareLibrary() {
  const records = state.comparisons.filter((record) => record.saved);
  makeClickable(button('ADD NEW'), () => go('compare-new'));
  const cards = named('UI / List Item');
  if (!records.length) { cards.forEach(fixtureOnly); return; }
  cards.forEach((card, index) => {
    const record = records[index]; if (!record) { card.style.display = 'none'; return; }
    setText(firstNamed('Label / Large 13px', card) || firstNamed('form-text', card), record.title);
    makeClickable(card, () => { state.active.comparisonId = record.id; persist(); go('compare-library-detail', { comparison: record.id }); });
  });
}

function attachProjects() {
  makeClickable(button('ADD NEW PROJECT'), () => openProjectModal());
  const cards = named('UI / Card');
  if (!state.projects.length) { cards.forEach(fixtureOnly); return; }
  cards.forEach((card, index) => {
    const project = state.projects[index]; if (!project) { card.style.display = 'none'; return; }
    setText(firstNamed('H4', card) || firstNamed('title-body', card) || firstNamed('form-text', card), project.title);
    makeClickable(card, () => { state.active.projectId = project.id; persist(); go('project-overview', { project: project.id }); });
  });
}

function attachProjectPage({ activity = false } = {}) {
  const project = activeProject();
  if (!project) { (activity ? named('grid-item') : named('Project / Session Card')).forEach(fixtureOnly); return; }
  state.active.projectId = project.id; persist();
  named('header-title').forEach((node) => setText(node, project.title));
  const records = Core.linkedRecords(state, project.id).filter((record) => record.saved);
  const summary = firstNamed('project-summary'); if (summary) setText(summary, project.description || 'No project summary yet.');
  const tabs = named('Navigation / Tab').concat(named('Tab'));
  tabs.forEach((tab) => {
    const label = normal(text(tab));
    if (label === 'OVERVIEW') makeClickable(tab, () => go('project-overview', { project: project.id }));
    if (label === 'FEEDBACK') makeClickable(tab, () => go('project-feedback', { project: project.id }));
    if (label === 'NOTES') makeClickable(tab, () => {
      if (!summary) return; makeEditable(summary, project.notes || '', 'Project notes', (value) => { project.notes = value; touch(project); }, { clearOnFirstFocus: !project.notes });
    }, 'Click to edit project notes');
  });
  const actions = named('Project / Toolbar Action');
  makeClickable(firstNamed('pencil', actions[0] || document), () => openProjectModal(project.id, () => attachProjectPage({ activity })));
  makeClickable(firstNamed('Star', actions[1] || document), () => { project.favorite = !project.favorite; touch(project); });
  makeClickable(firstNamed('bin', actions[2] || document), () => {
    if (!window.confirm('Delete this project? Linked records will be kept without a project.')) return;
    [...state.feedback, ...state.comparisons].filter((record) => record.projectId === project.id).forEach((record) => { record.projectId = null; record.updatedAt = Core.now(); });
    state.projects = state.projects.filter((item) => item.id !== project.id); state.active.projectId = null; persist(); go('projects');
  });
  const cards = activity ? named('grid-item') : named('Project / Session Card');
  if (!records.length) { cards.forEach(fixtureOnly); return; }
  cards.forEach((card, index) => {
    const record = records[index]; if (!record) { card.style.display = 'none'; return; }
    setText(firstNamed('session-title', card) || firstNamed('feedback-title', card) || firstNamed('title-body', card), record.title);
    makeClickable(card, () => {
      if (record.kind === 'comparison') { state.active.comparisonId = record.id; persist(); go('compare-detail', { comparison: record.id }); }
      else openQuickView(record, 'darkroom');
    });
  });
}

function attachPromptLibrary() {
  let queryText = ''; let category = 'All'; let archived = false;
  const searchBar = firstNamed('search-bar');
  const searchFields = named('Form / Field', searchBar);
  const search = searchFields[0]; const filter = searchFields[1]; const archiveControl = firstNamed('Label', searchBar);
  const render = () => {
    const prompts = state.prompts.filter((prompt) => (archived ? prompt.archived : !prompt.archived)
      && (category === 'All' || prompt.category === category)
      && `${prompt.name} ${prompt.description} ${prompt.body}`.toLowerCase().includes(queryText.toLowerCase()));
    const cards = named('UI / Card with Toolbar');
    if (!state.prompts.length && !queryText && category === 'All' && !archived) { cards.forEach(fixtureOnly); return; }
    cards.forEach((card, index) => {
      const prompt = prompts[index]; if (!prompt) { card.style.display = 'none'; return; }
      card.style.display = '';
      setText(firstNamed('Heading / H4 20px', card) || firstNamed('H4/20px', card), prompt.name);
      setText(firstNamed('Body / Extra Small 12px', card), prompt.description);
      const badges = named('LABEL-ALT/XS/Semi-Bold/9.6px/12', card); setText(badges[0], prompt.category); setText(badges[1], prompt.useType);
      makeClickable(firstNamed('pencil', card), () => openPromptEditor(prompt.id));
      makeClickable(firstNamed('copy', card), () => {
        const { id: ignoredId, createdAt: ignoredCreatedAt, updatedAt: ignoredUpdatedAt, ...copy } = prompt;
        state.prompts.unshift(Core.makePrompt({ ...copy, name: `${prompt.name} Copy`, archived: false })); persist(); render();
      });
      makeClickable(firstNamed('bin', card), () => { prompt.archived = true; touch(prompt); render(); });
      makeClickable(card, () => openPromptEditor(prompt.id));
    });
  };
  makeEditable(search, undefined, 'Search prompts', (value) => { queryText = value; render(); }, { clearOnFirstFocus: true });
  makeClickable(filter, () => { category = choicesCycle(category, ['All', 'Photography', 'Design', 'General']); setText(filter, category === 'All' ? 'All categories' : category); render(); }, 'Click to filter prompt category');
  makeClickable(archiveControl, () => { archived = !archived; setText(archiveControl, archived ? 'SHOW ACTIVE' : 'SHOW ARCHIVE'); render(); });
  makeClickable(button('ADD PROMPT'), () => openPromptEditor());
  render();
}

function applyAppearance() {
  const accents = { orange: '#b95a36', pink: '#df7596', blue: '#63a1ff', argent: '#95b4d0', green: '#88bb50', gray: '#777777' };
  document.documentElement.style.setProperty('--color-ui-accent-primary', accents[state.settings.accent] || accents.orange);
}
function applyModelStatus() {
  const model = state.settings.feedbackModel || state.settings.visionModel;
  named('model-name').forEach((node) => setText(node, model ? `LOCAL MODEL · ${model}` : 'MODEL NOT SET · SETTINGS'));
}
function attachPersonalisation() {
  const fields = named('Form / Field');
  const styleField = fields[0], warmthField = fields[1], fastField = fields[2], instructions = fields[3];
  setText(styleField, state.settings.baseStyle); setText(warmthField, state.settings.warmth); setText(fastField, state.settings.fastAnswers ? 'Yes' : 'No');
  makeClickable(styleField, () => { state.settings.baseStyle = choicesCycle(state.settings.baseStyle, ['Professional', 'Friendly', 'Candid']); setText(styleField, state.settings.baseStyle); persist(); });
  makeClickable(warmthField, () => { state.settings.warmth = choicesCycle(state.settings.warmth, ['Less', 'More', 'Neutral']); setText(warmthField, state.settings.warmth); persist(); });
  makeClickable(fastField, () => { state.settings.fastAnswers = !state.settings.fastAnswers; setText(fastField, state.settings.fastAnswers ? 'Yes' : 'No'); persist(); });
  makeEditable(firstNamed('output text', instructions) || instructions, state.settings.customInstructions || undefined, 'Custom instructions', (value) => { state.settings.customInstructions = value; persist(); }, { clearOnFirstFocus: !state.settings.customInstructions });
}
function attachAppearance() {
  applyAppearance();
  const accents = ['orange', 'pink', 'blue', 'argent', 'green', 'gray'];
  makeClickable(firstNamed('accent-colors'), () => { state.settings.accent = choicesCycle(state.settings.accent, accents); persist(); applyAppearance(); }, 'Click to change accent');
}
function attachModels() {
  const detailFields = named('Form / Field');
  const mappings = [['feedbackModel', 'Default feedback model'], ['compareModel', 'Default compare model'], ['visionModel', 'Vision model'], ['feedbackModel', 'Default feedback model'], ['serverUrl', 'Local server URL']];
  detailFields.forEach((field, index) => {
    const [key, label] = mappings[index] || [];
    if (!key) return;
    makeEditable(field, state.settings[key] || undefined, label, (value) => { state.settings[key] = value; persist(); }, { clearOnFirstFocus: !state.settings[key] });
  });
  makeClickable(button('TEST CONNECTION'), async () => {
    const control = button('TEST CONNECTION'); setText(control, 'TESTING…');
    try {
      const base = String(state.settings.serverUrl || '').replace(/\/$/, '');
      if (!base) throw new Error('A local server URL is required.');
      const response = await fetch(modelProxyUrl(base, '/v1/models'));
      if (!response.ok) throw new Error(`The local server returned ${response.status}.`);
      const payload = await response.json();
      const available = new Set((payload.data || []).map((item) => item.id));
      const configured = [state.settings.feedbackModel, state.settings.compareModel, state.settings.visionModel].filter(Boolean);
      const unavailable = configured.filter((model) => !available.has(model));
      setText(control, unavailable.length ? 'CONNECTED · MODEL NOT LOADED' : `CONNECTED · ${(payload.data || []).length} MODELS`);
      control.title = unavailable.length ? `Server connected, but not loaded: ${unavailable.join(', ')}` : `Connected to ${base}`;
    } catch (error) {
      setText(control, 'LM STUDIO UNAVAILABLE');
      control.title = modelConnectionError(error);
    }
  });
}

applyAppearance();
if (screen === 'feedback-new') attachFeedbackNew();
if (screen === 'feedback-thinking') attachFeedbackThinking();
if (screen === 'feedback-complete') attachFeedbackRecord();
if (screen === 'feedback-detail' || screen === 'darkroom-detail' || screen === 'design-studio-detail') attachFeedbackRecord({ detail: true });
if (screen === 'compare-new') attachCompareNew();
if (screen === 'compare-thinking') attachCompareThinking();
if (screen === 'compare-complete') attachComparisonRecord();
if (screen === 'compare-detail' || screen === 'compare-library-detail') attachComparisonRecord({ detail: true });
if (screen === 'darkroom') attachFeedbackLibrary('darkroom');
if (screen === 'design-studio') attachFeedbackLibrary('design');
if (screen === 'compare-library') attachCompareLibrary();
if (screen === 'projects') attachProjects();
if (screen === 'project-overview') attachProjectPage();
if (screen === 'project-feedback') attachProjectPage({ activity: true });
if (screen === 'prompts') attachPromptLibrary();
if (screen === 'settings-personalisation') attachPersonalisation();
if (screen === 'settings-appearance') attachAppearance();
if (screen === 'settings-models') attachModels();
applyModelStatus();
