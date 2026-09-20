const app = document.querySelector('#director-app');
const DONOR_BASE = '/visual-v4/';
const donorFiles = {
  new: 'feedback-new.html',
  thinking: 'feedback-thinking.html',
  complete: 'feedback-complete.html',
  detail: 'feedback-detail.html'
};

let prompts = [];
let models = [];
let image = null;
let session = null;
let phase = 'new';
let pending = null;
let imageVersion = 0;
let chatRequest = null;
let promptSelect;
let modelSelect;
let imageInput;
let messageInput;
let errorNode;
let statusNode;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const named = (name, scope = document) => $$('[data-name]', scope).filter(node => node.dataset.name === name);
const firstNamed = (name, scope = document) => named(name, scope)[0] || null;

function leaf(node) {
  if (!node) return null;
  return $('.text-content span', node) || $('.text-content', node) || node;
}

function setText(node, value) {
  const target = leaf(node);
  if (target) target.textContent = String(value ?? '');
}

function normalized(value) { return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase(); }
function nodeText(node) { return node?.textContent?.replace(/\s+/g, ' ').trim() || ''; }

function setError(message = '', raw = '') {
  if (errorNode) { errorNode.textContent = message; errorNode.hidden = !message; }
  const rawNode = $('#failed-raw');
  if (rawNode) rawNode.textContent = raw;
}

function setStatus(message = '') { if (statusNode) statusNode.textContent = message; }

async function api(path, body, signal, method = body ? 'POST' : 'GET') {
  const response = await fetch(path, {
    method,
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    signal
  });
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed.'), { raw: data.raw });
  return data;
}

function formatDate(value) { return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }

function modelLabel(model) {
  if (!model) return 'OFFLINE · NO VISION MODEL';
  return `${models.some(item => item.id === model) ? 'ONLINE' : 'SAVED'} · LM STUDIO · ${model}`;
}

function setModelBars(root = document) {
  named('model-name', root).forEach(node => setText(node, modelLabel(session?.model || modelSelect?.value)));
}

function normalizeDonorResources(root) {
  $$('img[src]', root).forEach(imageNode => {
    const src = imageNode.getAttribute('src') || '';
    if (src.startsWith('/assets/')) imageNode.setAttribute('src', `${DONOR_BASE}${src.slice(1)}`);
    else if (src.startsWith('assets/')) imageNode.setAttribute('src', `${DONOR_BASE}${src}`);
  });
}

async function loadDonor(state) {
  const response = await fetch(`${DONOR_BASE}${donorFiles[state]}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load approved ${state} feedback donor.`);
  const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
  const source = parsed.querySelector('.source-frame');
  if (!source) throw new Error(`Approved ${state} feedback donor has no source frame.`);
  normalizeDonorResources(source);
  app.replaceChildren(document.importNode(source, true));
  document.body.dataset.screen = `feedback-${state}`;
  return $('.source-frame', app);
}

function createProxyControls() {
  const controls = document.createElement('div');
  controls.id = 'director-control-proxies';
  controls.className = 'director-control-proxy';
  controls.setAttribute('aria-hidden', 'true');
  controls.innerHTML = `
    <input id="image-file" type="file" accept="image/jpeg,image/png,image/webp">
    <select id="prompt"></select>
    <select id="model"></select>
    <button id="review" type="button">Get feedback</button>
    <textarea id="message"></textarea>
    <button id="send" type="button">Send</button>
    <div id="error" role="alert" hidden></div>
    <div id="status" role="status"></div>
    <div id="failed-raw"></div>
  `;
  document.body.append(controls);
  promptSelect = $('#prompt', controls);
  modelSelect = $('#model', controls);
  imageInput = $('#image-file', controls);
  messageInput = $('#message', controls);
  errorNode = $('#error', controls);
  statusNode = $('#status', controls);
  imageInput.addEventListener('change', () => selectImage(imageInput.files[0]));
  promptSelect.addEventListener('change', () => { renderPrompt(promptSelect.value); sync(); });
  modelSelect.addEventListener('change', () => { setModelBars(); sync(); });
}

function populatePrompts(selected = promptSelect?.value) {
  const feedbackPrompts = prompts.filter(prompt => (prompt.sessionType || 'feedback') === 'feedback');
  promptSelect.replaceChildren();
  for (const category of [...new Set(feedbackPrompts.map(prompt => prompt.category))]) {
    const group = document.createElement('optgroup');
    group.label = category;
    group.append(...feedbackPrompts.filter(prompt => prompt.category === category).map(prompt => new Option(prompt.name, prompt.id)));
    promptSelect.append(group);
  }
  if (feedbackPrompts.some(prompt => prompt.id === selected)) promptSelect.value = selected;
  else if (feedbackPrompts[0]) promptSelect.value = feedbackPrompts[0].id;
  renderPrompt(promptSelect.value);
}

function selectedPrompt() { return prompts.find(prompt => prompt.id === promptSelect?.value) || session?.prompt || null; }

function metaBox(root, label) {
  return named('meta-box', root).find(box => normalized(nodeText(firstNamed('form-label', box))).includes(normalized(label))) || null;
}

function renderPrompt(promptId) {
  const prompt = prompts.find(item => item.id === promptId) || session?.prompt;
  const root = $('.source-frame', app);
  if (!root || !prompt) return;
  setText(firstNamed('prompt-body', root) || firstNamed('prompt-text', root), prompt.instruction || prompt.body || '');
  const selectors = named('prompt-selector', root);
  if (phase === 'new' && selectors[0]) setText(selectors[0], prompt.name);
  const promptMeta = metaBox(root, 'PROMPT USED');
  if (promptMeta) setText(firstNamed('Body/13px', promptMeta), prompt.instruction || prompt.body || '');
}

function setImageSource(node, selected) {
  if (!node || !selected) return;
  const imageNode = $('img.source-image', node);
  if (imageNode) { imageNode.src = selected.sourceDataUrl; imageNode.alt = selected.name; }
  else {
    node.style.backgroundImage = `url("${selected.sourceDataUrl}")`;
    node.style.backgroundSize = 'cover';
    node.style.backgroundPosition = 'center';
  }
}

function renderImage(root = $('.source-frame', app)) {
  if (!root || !image) return;
  setImageSource(firstNamed('Feedback / File', root), image);
  setImageSource(firstNamed('image.jpg', root), image);
}

function renderNew(root) {
  const selectors = named('prompt-selector', root);
  const sourceType = firstNamed('photography-input', root);
  setText(sourceType, selectedPrompt()?.category || 'Photography');
  setText(selectors[0], selectedPrompt()?.name || 'Select prompt');
  setText(firstNamed('prompt-body', root), selectedPrompt()?.instruction || 'Select a preset prompt OR enter your own..');
  const output = firstNamed('output text', firstNamed('content-right', root));
  setText(firstNamed('heading', firstNamed('content-right', root)), image ? 'READY FOR FEEDBACK' : 'NOTHING TO FEEDBACK');
  setText(output, image ? `${image.name} selected.` : 'Select an image to start feedback.');
  if (image) renderImage(root);
  bindNewInteractions(root);
}

function renderThinking(root) {
  setText(firstNamed('header-body', root)?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]'), session?.image?.name || image?.name || 'Feedback');
  setText(firstNamed('photography-input', root), session?.prompt?.category || selectedPrompt()?.category || 'Photography');
  setText(firstNamed('prompt-selector', root), session?.prompt?.name || selectedPrompt()?.name || 'Select prompt');
  setText(firstNamed('prompt-body', root), session?.prompt?.instruction || session?.prompt?.body || selectedPrompt()?.instruction || '');
  setText(firstNamed('heading', firstNamed('content-right', root)), 'WRITING FEEDBACK');
  setText(firstNamed('output text', firstNamed('content-right', root)), '......');
  renderImage(root);
}

function structuredFeedbackText(feedback) {
  return (feedback?.sections || []).map((section, index) => `${index + 1}. ${section.heading}\n${section.content}`).join('\n\n');
}

function renderOutput(root) {
  const outputField = firstNamed('content-right', root);
  setText(firstNamed('heading', outputField), 'FEEDBACK');
  setText(firstNamed('output text', outputField), structuredFeedbackText(session.feedback));
}

function setComposer(root) {
  const composer = firstNamed('prompt-text', root);
  const target = leaf(composer);
  if (!target) return;
  target.textContent = '';
  target.dataset.placeholder = 'Ask Director';
}

function renderTranscript(root) {
  const section = firstNamed('prompt-section', root);
  const editor = firstNamed('Prompt / Editor', section);
  if (!section || !editor) return;
  let transcript = firstNamed('chat-transcript', section);
  const turns = session?.chat || [];
  const saveButton = firstNamed('save-button', root);

  if (!turns.length) {
    transcript?.remove();
    section.classList.remove('director-chat-layout');
    root.classList.remove('director-chat-runtime');
    if (saveButton?.parentElement === section) root.append(saveButton);
    return;
  }

  if (!transcript) {
    transcript = document.createElement('div');
    transcript.dataset.name = 'chat-transcript';
    transcript.className = 'director-chat-transcript';
    section.insertBefore(transcript, editor);
  }
  transcript.replaceChildren(...turns.map(turn => {
    const row = document.createElement('div');
    row.className = 'director-chat-turn';
    const label = document.createElement('div');
    label.className = 'director-chat-label';
    label.textContent = turn.role === 'user' ? 'You' : 'Director';
    const content = document.createElement('div');
    content.className = 'director-chat-content';
    content.textContent = turn.content || '';
    row.append(label, content);
    return row;
  }));
  section.classList.add('director-chat-layout');
  root.classList.add('director-chat-runtime');
  if (saveButton && saveButton.parentElement !== section) section.append(saveButton);
  setComposer(root);
}

function renderComplete(root, detail = false) {
  const title = firstNamed('header-title', root) || firstNamed('title-body', root);
  setText(title?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]') || title, session.title || session.image.name);
  setText(firstNamed('photography-input', root), session.prompt.category || 'Photography');
  setText(firstNamed('prompt-selector', root), session.prompt.name || 'Custom prompt');
  setText(firstNamed('prompt-body', root), session.prompt.instruction || session.prompt.body || '');
  setText(firstNamed('model-name', root), modelLabel(session.model));
  renderImage(root);
  renderOutput(root);
  if (detail) {
    setText(firstNamed('date-created', root), formatDate(session.createdAt));
    setText(firstNamed('UI / Category Badge', metaBox(root, 'SOURCE TYPE')), (session.prompt.category || 'Photography').toUpperCase());
    setText(firstNamed('Body/13px', metaBox(root, 'PROMPT USED')), session.prompt.instruction || session.prompt.body || '');
    setText(firstNamed('Body/13px', metaBox(root, 'REVIEW BY')), session.model);
    setText(firstNamed('prompt-selector', metaBox(root, 'PROJECT')), 'Not linked');
  }
  renderTranscript(root);
  setComposer(root);
  bindRecordInteractions(root, detail);
}

function sync() {
  const busy = !!pending;
  if (modelSelect) modelSelect.disabled = busy || !!session;
  if (promptSelect) promptSelect.disabled = busy || !!session;
  if (imageInput) imageInput.disabled = busy || !!session;
  const root = $('.source-frame', app);
  if (!root) return;
  setModelBars(root);
  const sourceBox = firstNamed('Feedback / File', root);
  if (sourceBox) sourceBox.setAttribute('aria-disabled', String(busy || !!session));
  const action = firstNamed('action-bar', root);
  if (action) action.setAttribute('aria-disabled', String(busy || !image || !promptSelect?.value || !modelSelect?.value));
}

function makeClickable(node, handler, label) {
  if (!node || node.dataset.bound === 'true') return;
  node.dataset.bound = 'true';
  node.setAttribute('role', 'button');
  if (label) node.setAttribute('aria-label', label);
  node.classList.add('director-actionable');
  node.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); handler(event); });
}

function bindDrop(node) {
  if (!node || node.dataset.dropBound === 'true') return;
  node.dataset.dropBound = 'true';
  node.addEventListener('dragover', event => event.preventDefault());
  node.addEventListener('drop', event => {
    event.preventDefault();
    if (event.dataTransfer.files.length !== 1) return setError('Drop one image at a time.');
    selectImage(event.dataTransfer.files[0]);
  });
}

function bindNewInteractions(root) {
  if (root.dataset.feedbackBindings === 'true') { sync(); return; }
  root.dataset.feedbackBindings = 'true';
  const fileBox = firstNamed('Feedback / File', root);
  const selectors = named('prompt-selector', root);
  const typeBox = firstNamed('photography-input', root);
  makeClickable(fileBox, () => imageInput.click(), 'Choose a source image');
  bindDrop(fileBox);
  makeClickable(typeBox, () => {
    const categories = ['Photography', 'Design', 'General'];
    const current = selectedPrompt()?.category || 'Photography';
    const next = categories[(categories.indexOf(current) + 1) % categories.length];
    const nextPrompt = prompts.find(prompt => prompt.category === next && (prompt.sessionType || 'feedback') === 'feedback');
    if (nextPrompt) { promptSelect.value = nextPrompt.id; renderPrompt(nextPrompt.id); sync(); }
  }, 'Change source type');
  makeClickable(selectors[0], () => promptSelect.showPicker?.() || promptSelect.click(), 'Choose a feedback prompt');
  makeClickable(firstNamed('action-bar', root), () => startFeedback(), 'Get feedback');
  $$('a[href]', root).forEach(link => {
    if (link.getAttribute('aria-label') === 'feedback-new') link.addEventListener('click', event => { event.preventDefault(); startNew(); });
  });
  sync();
}

function bindRecordInteractions(root, detail) {
  const composer = firstNamed('prompt-text', root);
  const send = firstNamed('enter-button', root);
  const target = leaf(composer);
  if (target && target.dataset.editable !== 'true') {
    target.dataset.editable = 'true';
    target.contentEditable = 'true';
    target.setAttribute('role', 'textbox');
    target.setAttribute('aria-label', 'Ask Director');
    target.spellcheck = false;
  }
  makeClickable(send, () => sendChat(), 'Ask Director');
  const newFeedback = named('UI / Button', root).find(node => normalized(nodeText(node)) === 'NEW FEEDBACK');
  makeClickable(newFeedback, () => startNew(), 'New feedback');
  makeClickable(firstNamed('pencil', root), () => renameSession(), 'Rename feedback');
  makeClickable(firstNamed('bin', root), () => deleteSession(), 'Delete feedback');
  $$('a[href]', root).forEach(link => {
    if (link.getAttribute('aria-label') === 'feedback-new') link.addEventListener('click', event => { event.preventDefault(); startNew(); });
  });
  const back = root.querySelector('[aria-label="darkroom"]');
  if (back) back.setAttribute('aria-disabled', 'true');
  sync();
}

async function selectImage(file) {
  if (!file || pending || session) return;
  setError();
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
    setError('Choose a JPEG, PNG or WebP image up to 12 MB.');
    return;
  }
  const version = ++imageVersion;
  try {
    const sourceDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('The image could not be read.'));
      reader.readAsDataURL(file);
    });
    const picture = new Image(); picture.src = sourceDataUrl; await picture.decode();
    if (version !== imageVersion) return;
    if (picture.naturalWidth * picture.naturalHeight > 100000000) throw new Error('This image is too large to preview safely.');
    const scale = Math.min(1, 1600 / Math.max(picture.naturalWidth, picture.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(picture.naturalWidth * scale); canvas.height = Math.round(picture.naturalHeight * scale);
    const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(picture, 0, 0, canvas.width, canvas.height);
    image = { name: file.name, sourceDataUrl, dataUrl: canvas.toDataURL('image/jpeg', 0.92), width: picture.naturalWidth, height: picture.naturalHeight, reviewWidth: canvas.width, reviewHeight: canvas.height };
    renderNew($('.source-frame', app));
  } catch (error) { setError(`Could not open image. ${error.message}`); }
  finally { imageInput.value = ''; sync(); }
}

function startNew() {
  pending?.abort(); pending = null; session = null; chatRequest = null; phase = 'new';
  history.replaceState(null, '', '/');
  mountState('new');
}

async function startFeedback() {
  if (pending || session || !image || !promptSelect.value || !modelSelect.value) return;
  const prompt = selectedPrompt(); if (!prompt) return;
  session = { image, prompt, model: modelSelect.value }; phase = 'thinking'; pending = new AbortController(); setError();
  setStatus('Reviewing your image with the local model. This may take a minute…');
  history.replaceState(null, '', '/?view=thinking');
  await mountState('thinking'); sync();
  try {
    const data = await api('/api/feedback', { image, promptId: prompt.id, model: modelSelect.value }, pending.signal);
    session = data.session; phase = 'complete';
    history.replaceState(null, '', `/?session=${encodeURIComponent(session.id)}&view=complete`);
    await mountState('complete');
  } catch (error) {
    if (error.name === 'AbortError') setStatus('Request cancelled.'); else setError(error.message, error.raw);
    phase = 'new'; session = null; await mountState('new');
  } finally { setStatus(); pending = null; sync(); }
}

async function sendChat() {
  const composer = firstNamed('prompt-text', $('.source-frame', app));
  const message = leaf(composer)?.textContent.trim();
  if (!message || !session?.id || pending) return;
  chatRequest = chatRequest?.message === message && chatRequest.sessionId === session.id ? chatRequest : { message, sessionId: session.id, id: crypto.randomUUID() };
  pending = new AbortController(); setError(); setStatus('Director is looking at the image and your conversation…'); sync();
  try {
    const data = await api('/api/chat', { sessionId: session.id, revision: session.revision, message, requestId: chatRequest.id }, pending.signal);
    session = data.session; chatRequest = null;
    const root = $('.source-frame', app);
    renderTranscript(root);
    setComposer(root);
  } catch (error) { setError(error.message, error.raw); setText(firstNamed('prompt-text', $('.source-frame', app)), message); }
  finally { pending = null; setStatus(); sync(); }
}

async function renameSession() {
  if (!session?.id || pending) return;
  const title = window.prompt('Session title (up to 200 characters):', session.title || session.image.name); if (title === null) return;
  pending = new AbortController();
  try { const data = await api(`/api/sessions/${session.id}`, { title, revision: session.revision }, pending.signal, 'PATCH'); session = data.session; renderComplete($('.source-frame', app), phase === 'detail'); }
  catch (error) { setError(error.message, error.raw); }
  finally { pending = null; sync(); }
}

async function deleteSession() {
  if (!session?.id || pending) return;
  if (!window.confirm(`Delete “${session.title || session.image.name}” and its Director-owned image copies? This cannot be undone. Your original file will not be touched.`)) return;
  pending = new AbortController();
  try { await api(`/api/sessions/${session.id}`, { revision: session.revision }, pending.signal, 'DELETE'); image = null; startNew(); }
  catch (error) { setError(error.message, error.raw); }
  finally { pending = null; sync(); }
}

async function mountState(nextPhase) {
  phase = nextPhase;
  const root = await loadDonor(nextPhase);
  if (nextPhase === 'new') renderNew(root);
  if (nextPhase === 'thinking') renderThinking(root);
  if (nextPhase === 'complete') renderComplete(root, false);
  if (nextPhase === 'detail') renderComplete(root, true);
  setModelBars(root); sync();
}

async function loadSessionFromQuery() {
  const id = new URLSearchParams(location.search).get('session');
  if (!id) return mountState('new');
  const data = await api(`/api/sessions/${encodeURIComponent(id)}`);
  session = data.session; image = session.image; phase = 'detail'; await mountState('detail');
}

async function refreshModels() {
  try {
    const data = await api('/api/models'); models = data.models;
    modelSelect.replaceChildren(...models.map(model => new Option(model.name || model.id, model.id)));
    if (models[0]) modelSelect.value = models[0].id;
    if (session?.model && !models.some(model => model.id === session.model)) { modelSelect.add(new Option(`${session.model} · saved model, currently unloaded`, session.model)); modelSelect.value = session.model; }
  } catch (error) { models = []; modelSelect.replaceChildren(new Option('No loaded vision model', '')); setError(error.message); }
  setModelBars(); sync();
}

async function boot() {
  createProxyControls();
  try { prompts = (await api('/api/prompts')).prompts; populatePrompts(); await refreshModels(); await loadSessionFromQuery(); }
  catch (error) { setError(`Director could not start: ${error.message}`); }
}

await boot();
