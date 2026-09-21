const app = document.querySelector('#director-app');
const DONOR_BASE = '/visual-v4/';
const donorFiles = {
  new: 'feedback-new.html',
  thinking: 'feedback-thinking.html',
  complete: 'feedback-complete.html',
  detail: 'feedback-detail.html',
  compareNew: 'compare-new.html',
  compareThinking: 'compare-thinking.html',
  compareComplete: 'compare-complete.html',
  compareDetail: 'compare-detail.html'
};

let prompts = [];
let models = [];
let image = null;
let imageB = null;
let session = null;
let mode = 'feedback';
let phase = 'new';
let pending = null;
let imageVersion = 0;
let chatRequest = null;
let visibleError = '';
let chatError = '';
let promptSelect;
let modelSelect;
let imageInput;
let messageInput;
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

function feedbackOutput(root) { return firstNamed('content-right', root); }

function outputRegion(root) { return feedbackOutput(root) || firstNamed('reply', root); }

function renderFeedbackError(root, message) {
  const outputField = outputRegion(root);
  if (!outputField) return;
  setText(firstNamed('heading', outputField), 'ERROR');
  const output = firstNamed('output text', outputField);
  setText(output, message);
  output?.setAttribute('role', 'alert');
  output?.setAttribute('aria-live', 'assertive');
  output?.setAttribute('aria-atomic', 'true');
}

function clearFeedbackErrorSemantics(root) {
  const output = firstNamed('output text', outputRegion(root));
  output?.removeAttribute('role');
  output?.removeAttribute('aria-live');
  output?.removeAttribute('aria-atomic');
}

function renderDefaultFeedbackOutput(root) {
  clearFeedbackErrorSemantics(root);
  const outputField = outputRegion(root);
  if (!outputField) return;
  if (phase === 'new' || phase === 'compareNew') {
    const output = firstNamed('output text', outputField);
    const ready = mode === 'compare' ? Boolean(image && imageB) : Boolean(image);
    setText(firstNamed('heading', outputField), mode === 'compare' ? (ready ? 'READY TO COMPARE' : 'NOTHING TO COMPARE') : (ready ? 'READY FOR FEEDBACK' : 'NOTHING TO FEEDBACK'));
    setText(output, mode === 'compare' ? (ready ? `${image.name} · ${imageB.name} selected.` : 'Select 2 images to start comparing.') : (image ? `${image.name} selected.` : 'Select an image to start feedback.'));
  } else if (phase === 'thinking' || phase === 'compareThinking') {
    setText(firstNamed('heading', outputField), mode === 'compare' ? 'COMPARING SOURCES' : 'WRITING FEEDBACK');
    setText(firstNamed('output text', outputField), '......');
  } else if (session?.feedback) {
    renderOutput(root);
  }
}

function setError(message = '', raw = '') {
  visibleError = message;
  const rawNode = $('#failed-raw');
  if (rawNode) rawNode.textContent = raw;
  const root = $('.source-frame', app);
  if (!root) return;
  if (message) renderFeedbackError(root, message);
  else renderDefaultFeedbackOutput(root);
}

function setStatus(message = '') { if (statusNode) statusNode.textContent = message; }

function renderChatError(root) {
  const section = firstNamed('prompt-section', root);
  const editor = firstNamed('Prompt / Editor', section);
  if (!section || !editor) return;
  let node = firstNamed('chat-transient-error', section);
  const transcript = firstNamed('chat-transcript', section);
  const emptyTranscript = !(session?.chat || []).length;
  section.classList.toggle('director-chat-error-layout', Boolean(chatError && emptyTranscript));
  if (!chatError) { node?.remove(); return; }
  if (!node) {
    node = document.createElement('div');
    node.dataset.name = 'chat-transient-error';
    node.className = 'director-chat-transient-error';
  }
  section.insertBefore(node, transcript || editor);
  node.textContent = chatError;
  node.setAttribute('role', 'alert');
  node.setAttribute('aria-live', 'assertive');
  node.setAttribute('aria-atomic', 'true');
}

function setChatError(message = '') {
  chatError = message;
  renderChatError($('.source-frame', app));
}

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
  const model = session?.model || modelSelect?.value || '';
  const label = modelLabel(model);
  named('model-name', root).forEach(node => {
    setText(node, label);
    node.title = 'Click to switch loaded model';
    node.dataset.selectedModel = model;
    node.setAttribute('aria-label', model ? `Click to switch loaded model. Selected model: ${model}` : label);
  });
  bindModelBars(root);
}

function cycleLoadedModel() {
  if (session || models.length < 2 || !modelSelect) return;
  const current = models.findIndex(model => model.id === modelSelect.value);
  modelSelect.value = models[(current + 1 + models.length) % models.length].id;
  setModelBars();
  sync();
}

function bindModelBars(root) {
  named('UI / Model Bar', root).forEach(bar => {
    bar.setAttribute('role', 'button');
    bar.tabIndex = 0;
    bar.title = 'Click to switch loaded model';
    const model = session?.model || modelSelect?.value || '';
    bar.setAttribute('aria-label', model ? `Click to switch loaded model. Selected model: ${model}` : 'No loaded vision model');
    if (bar.dataset.modelBarBound === 'true') return;
    bar.dataset.modelBarBound = 'true';
    bar.addEventListener('click', event => { event.preventDefault(); cycleLoadedModel(); });
    bar.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      cycleLoadedModel();
    });
  });
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
  if (!response.ok) throw new Error(`Could not load approved ${state} donor.`);
  const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
  const source = parsed.querySelector('.source-frame');
  if (!source) throw new Error(`Approved ${state} feedback donor has no source frame.`);
  normalizeDonorResources(source);
  app.replaceChildren(document.importNode(source, true));
  const screenNames = { new: 'feedback-new', thinking: 'feedback-thinking', complete: 'feedback-complete', detail: 'feedback-detail', compareNew: 'compare-new', compareThinking: 'compare-thinking', compareComplete: 'compare-complete', compareDetail: 'compare-detail' };
  document.body.dataset.screen = screenNames[state] || state;
  return $('.source-frame', app);
}

function createProxyControls() {
  const controls = document.createElement('div');
  controls.id = 'director-control-proxies';
  controls.className = 'director-control-proxy';
  controls.setAttribute('aria-hidden', 'true');
  controls.innerHTML = `
    <input id="image-file" type="file" accept="image/jpeg,image/png,image/webp">
    <input id="image-file-b" type="file" accept="image/jpeg,image/png,image/webp">
    <select id="prompt"></select>
    <select id="model"></select>
    <button id="review" type="button">Get feedback</button>
    <textarea id="message"></textarea>
    <button id="send" type="button">Send</button>
    <div id="status" role="status"></div>
    <div id="failed-raw"></div>
  `;
  document.body.append(controls);
  promptSelect = $('#prompt', controls);
  modelSelect = $('#model', controls);
  imageInput = $('#image-file', controls);
  const imageBInput = $('#image-file-b', controls);
  messageInput = $('#message', controls);
  statusNode = $('#status', controls);
  imageInput.addEventListener('change', () => selectImage(imageInput.files[0]));
  imageBInput.addEventListener('change', () => selectImage(imageBInput.files[0], 'B'));
  promptSelect.addEventListener('change', () => { renderPrompt(promptSelect.value); sync(); });
  modelSelect.addEventListener('change', () => { setModelBars(); sync(); });
}

function populatePrompts(selected = promptSelect?.value) {
  const sessionType = mode === 'compare' ? 'compare' : 'feedback';
  const feedbackPrompts = prompts.filter(prompt => (prompt.sessionType || 'feedback') === sessionType);
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

function comparePromptSelector(root) { return firstNamed('action-bar', root)?.querySelector('[data-name="photography-input"]') || null; }

function metaBox(root, label) {
  return named('meta-box', root).find(box => normalized(nodeText(firstNamed('form-label', box))).includes(normalized(label))) || null;
}

function renderPrompt(promptId) {
  const prompt = prompts.find(item => item.id === promptId) || session?.prompt;
  const root = $('.source-frame', app);
  if (!root) return;
  if (!prompt) {
    setText(firstNamed('prompt-body', root) || firstNamed('prompt-text', root), '');
    const selectors = named('prompt-selector', root);
    if (phase === 'compareNew' && selectors[0]) setText(selectors[0], 'Select prompt');
    if (phase === 'compareNew') setText(comparePromptSelector(root), 'Select prompt');
    return;
  }
  setText(firstNamed('prompt-body', root) || firstNamed('prompt-text', root), prompt.instruction || prompt.body || '');
  setText(firstNamed('photography-input', root), prompt.category || 'Photography');
  const selectors = named('prompt-selector', root);
  if ((phase === 'new' || phase === 'compareNew') && selectors[0]) setText(selectors[0], prompt.name);
  if (phase === 'compareNew') setText(comparePromptSelector(root), prompt.name);
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

function compareImageSlots(root) {
  return named('image.jpg', root);
}

function renderCompareImages(root) {
  const slots = compareImageSlots(root);
  const selected = [session?.image || image, session?.imageB || imageB];
  slots.forEach((slot, index) => {
    const value = selected[index];
    slot.hidden = !value || index > 1;
    slot.setAttribute('aria-hidden', String(slot.hidden));
    if (value) {
      slot.dataset.imageRole = index === 0 ? 'Image A' : 'Image B';
      setImageSource(slot, value);
      const imageNode = $('img.source-image', slot);
      if (imageNode) imageNode.alt = `${index === 0 ? 'Image A' : 'Image B'}: ${value.name}`;
    }
  });
}

function suppressCompareRecommendations(root) {
  named('Recommendations', root).forEach(node => {
    node.hidden = true;
    node.setAttribute('aria-hidden', 'true');
  });
}

function renderImage(root = $('.source-frame', app)) {
  if (!root || !image) return;
  setImageSource(firstNamed('Feedback / File', root), image);
  setImageSource(firstNamed('image.jpg', root), image);
}

function renderNew(root) {
  if (mode === 'compare') return renderCompareNew(root);
  const selectors = named('prompt-selector', root);
  const sourceType = firstNamed('photography-input', root);
  setText(sourceType, selectedPrompt()?.category || 'Photography');
  setText(selectors[0], selectedPrompt()?.name || 'Select prompt');
  setText(firstNamed('prompt-body', root), selectedPrompt()?.instruction || 'Select a preset prompt OR enter your own..');
  const output = firstNamed('output text', firstNamed('content-right', root));
  setText(firstNamed('heading', firstNamed('content-right', root)), image ? 'READY FOR FEEDBACK' : 'NOTHING TO FEEDBACK');
  setText(output, image ? `${image.name} selected.` : 'Select an image to start feedback.');
  if (image) renderImage(root);
  if (visibleError) renderFeedbackError(root, visibleError);
  bindNewInteractions(root);
}

function renderCompareNew(root) {
  const sourceType = firstNamed('photography-input', root);
  setText(sourceType, 'Compare');
  setText(comparePromptSelector(root), selectedPrompt()?.name || 'Select prompt');
  const fileBox = firstNamed('Feedback / File', root);
  fileBox.dataset.imageA = image?.name || '';
  fileBox.dataset.imageB = imageB?.name || '';
  setText(firstNamed('label', fileBox), image && imageB ? 'Image A + Image B' : 'Select images');
  setText(firstNamed('Label/26px', fileBox), image && imageB ? `${image.name} · ${imageB.name}` : 'Drop A + B here');
  renderDefaultFeedbackOutput(root);
  if (visibleError) renderFeedbackError(root, visibleError);
  bindCompareNewInteractions(root);
}

function renderThinking(root) {
  if (mode === 'compare') return renderCompareThinking(root);
  setText(firstNamed('header-body', root)?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]'), session?.image?.name || image?.name || 'Feedback');
  setText(firstNamed('photography-input', root), session?.prompt?.category || selectedPrompt()?.category || 'Photography');
  setText(firstNamed('prompt-selector', root), session?.prompt?.name || selectedPrompt()?.name || 'Select prompt');
  setText(firstNamed('heading', firstNamed('content-right', root)), 'WRITING FEEDBACK');
  setText(firstNamed('output text', firstNamed('content-right', root)), '......');
  renderImage(root);
}

function renderCompareThinking(root) {
  setText(firstNamed('header-body', root)?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]'), 'Compare');
  setText(firstNamed('photography-input', root), 'Compare');
  setText(comparePromptSelector(root), session?.prompt?.name || selectedPrompt()?.name || 'Select prompt');
  renderCompareImages(root);
  suppressCompareRecommendations(root);
  setText(firstNamed('heading', outputRegion(root)), 'COMPARING SOURCES');
  setText(firstNamed('output text', outputRegion(root)), '......');
}

function structuredFeedbackText(feedback) {
  return (feedback?.sections || []).map((section, index) => `${index + 1}. ${section.heading}\n${section.content}`).join('\n\n');
}

function renderOutput(root) {
  const outputField = outputRegion(root);
  setText(firstNamed('heading', outputField), mode === 'compare' ? 'FIRST READ' : 'FEEDBACK');
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
    renderChatError(root);
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
  renderChatError(root);
}

function renderComplete(root, detail = false) {
  if (mode === 'compare') return renderCompareComplete(root, detail);
  const title = firstNamed('header-title', root) || firstNamed('title-body', root);
  setText(title?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]') || title, session.title || session.image.name);
  setText(firstNamed('photography-input', root), session.prompt.category || 'Photography');
  setText(firstNamed('prompt-selector', root), session.prompt.name || 'Custom prompt');
  setText(firstNamed('prompt-body', root), session.prompt.instruction || session.prompt.body || '');
  setText(firstNamed('model-name', root), modelLabel(session.model));
  renderImage(root);
  renderOutput(root);
  if (detail) {
    const titleBody = firstNamed('title-body', root);
    setText(titleBody?.querySelector('[data-name="Body/12px"]'), `${session.prompt.name || 'Custom prompt'} · ${formatDate(session.createdAt)}`);
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

function compareTitle() { return session?.title || `${session?.image?.name || image?.name || 'Image A'} / ${session?.imageB?.name || imageB?.name || 'Image B'}`; }

function renderCompareComplete(root, detail = false) {
  const title = firstNamed('header-title', root) || firstNamed('title-body', root);
  setText(title?.querySelector('[data-name="Heading/H2 /Semi-Bold/32px/37"]') || title, compareTitle());
  setText(firstNamed('photography-input', root), 'Compare');
  setText(comparePromptSelector(root), session.prompt.name || 'Compare prompt');
  setText(firstNamed('model-name', root), modelLabel(session.model));
  renderCompareImages(root);
  suppressCompareRecommendations(root);
  renderOutput(root);
  if (detail) {
    const titleBody = firstNamed('title-body', root);
    setText(titleBody?.querySelector('[data-name="Body/12px"]'), `${session.prompt.name || 'Compare prompt'} · ${formatDate(session.createdAt)}`);
    setText(firstNamed('date-created', root), formatDate(session.createdAt));
    setText(firstNamed('UI / Category Badge', metaBox(root, 'SOURCE TYPE')), 'COMPARE');
    setText(firstNamed('Body/13px', metaBox(root, 'PROMPT USED')), session.prompt.instruction || session.prompt.body || '');
    const reviewBy = firstNamed('Body/13px', metaBox(root, 'REVIEW BY'));
    setText(reviewBy, session.model);
    reviewBy?.setAttribute('title', session.model);
    reviewBy?.setAttribute('aria-label', `Review by ${session.model}`);
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
  const ready = mode === 'compare' ? Boolean(image && imageB) : Boolean(image);
  if (action) action.setAttribute('aria-disabled', String(busy || !ready || !promptSelect?.value || !modelSelect?.value));
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
    const files = [...(event.dataTransfer?.files || [])];
    if (mode === 'compare') {
      if (files.length !== 2) return setError('Choose exactly two JPEG, PNG or WebP images for Image A and Image B.');
      selectImage(files[0], 'A').then(() => selectImage(files[1], 'B'));
      return;
    }
    if (files.length !== 1) return setError('Drop one image at a time.');
    selectImage(files[0]);
  });
}

function bindNewInteractions(root) {
  if (mode === 'compare') return bindCompareNewInteractions(root);
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
    if (link.getAttribute('aria-label') === 'compare-new') link.addEventListener('click', event => { event.preventDefault(); startNew('compare'); });
  });
  sync();
}

function compareButton(root, label) {
  return named('UI / Button', root).find(node => normalized(nodeText(node)) === normalized(label));
}

function bindCompareNewInteractions(root) {
  if (root.dataset.compareBindings === 'true') { sync(); return; }
  root.dataset.compareBindings = 'true';
  const fileBox = firstNamed('Feedback / File', root);
  const selectors = [comparePromptSelector(root)].filter(Boolean);
  const sourceType = firstNamed('source-type', root);
  makeClickable(fileBox, () => (image ? $('#image-file-b') : imageInput).click(), 'Choose Image A and Image B');
  bindDrop(fileBox);
  makeClickable(sourceType, () => {}, 'Compare source type');
  makeClickable(selectors[0], () => promptSelect.showPicker?.() || promptSelect.click(), 'Choose a Compare prompt');
  makeClickable(compareButton(root, 'CLEAR PROMPT'), () => {
    promptSelect.value = '';
    renderPrompt('');
    sync();
  }, 'Clear Compare prompt');
  makeClickable(compareButton(root, 'COMPARE SOURCES'), () => startCompare(), 'Compare Image A and Image B');
  const clearSources = firstNamed('project-toolbar', root)?.querySelector('a');
  makeClickable(clearSources, () => {
    image = null; imageB = null; visibleError = '';
    renderCompareNew(root); sync();
  }, 'Clear comparison sources');
  $$('a[href]', root).forEach(link => {
    const label = link.getAttribute('aria-label');
    if (link === clearSources) return;
    if (label === 'feedback-new') link.addEventListener('click', event => { event.preventDefault(); startNew('feedback'); });
    if (label === 'compare-new') link.addEventListener('click', event => { event.preventDefault(); startNew('compare'); });
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
  const newRecord = named('UI / Button', root).find(node => normalized(nodeText(node)) === normalized(mode === 'compare' ? 'NEW COMPARISON' : 'NEW FEEDBACK'));
  makeClickable(newRecord, () => startNew(mode), mode === 'compare' ? 'New comparison' : 'New feedback');
  makeClickable(firstNamed('pencil', root), () => renameSession(), mode === 'compare' ? 'Rename comparison' : 'Rename feedback');
  makeClickable(firstNamed('bin', root), () => deleteSession(), mode === 'compare' ? 'Delete comparison' : 'Delete feedback');
  $$('a[href]', root).forEach(link => {
    const label = link.getAttribute('aria-label');
    if (label === 'feedback-new') link.addEventListener('click', event => { event.preventDefault(); startNew('feedback'); });
    if (label === 'compare-new') link.addEventListener('click', event => { event.preventDefault(); startNew('compare'); });
  });
  const back = root.querySelector('[aria-label="darkroom"]');
  if (back) back.setAttribute('aria-disabled', 'true');
  sync();
}

async function selectImage(file, slot = 'A') {
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
    const picture = new Image();
    let previewReady = false;
    await Promise.race([new Promise((resolve, reject) => {
      picture.onload = resolve;
      picture.onerror = () => reject(new Error('The image could not be decoded.'));
      picture.src = sourceDataUrl;
      }), new Promise(resolve => setTimeout(resolve, 2000))]);
    if (version !== imageVersion) return;
    previewReady = picture.naturalWidth > 0 && picture.naturalHeight > 0;
    if (previewReady && picture.naturalWidth * picture.naturalHeight > 100000000) throw new Error('This image is too large to preview safely.');
    let dataUrl = sourceDataUrl, reviewWidth = picture.naturalWidth || 1, reviewHeight = picture.naturalHeight || 1;
    if (previewReady) {
      const scale = Math.min(1, 1600 / Math.max(picture.naturalWidth, picture.naturalHeight));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(picture.naturalWidth * scale); canvas.height = Math.round(picture.naturalHeight * scale);
      const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(picture, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL('image/jpeg', 0.92); reviewWidth = canvas.width; reviewHeight = canvas.height;
    }
    const selected = { name: file.name, sourceDataUrl, dataUrl, width: picture.naturalWidth || 1, height: picture.naturalHeight || 1, reviewWidth, reviewHeight };
    if (mode === 'compare' && slot === 'B') imageB = selected;
    else image = selected;
    const root = $('.source-frame', app);
    if (root) mode === 'compare' ? renderCompareNew(root) : renderNew(root);
  } catch (error) { setError(`Could not open image. ${error.message}`); }
  finally {
    if (slot === 'B') $('#image-file-b').value = '';
    else imageInput.value = '';
    sync();
  }
}

function startNew(nextMode = mode) {
  pending?.abort(); pending = null; session = null; chatRequest = null; visibleError = ''; chatError = ''; phase = 'new'; mode = nextMode;
  populatePrompts();
  history.replaceState(null, '', '/');
  mountState(mode === 'compare' ? 'compareNew' : 'new');
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

async function startCompare() {
  if (pending || session || !image || !imageB || !promptSelect.value || !modelSelect.value) {
    if (!image || !imageB) setError('Choose exactly two valid images before comparing.');
    return;
  }
  const prompt = selectedPrompt(); if (!prompt || prompt.sessionType !== 'compare') return;
  session = { image, imageB, prompt, model: modelSelect.value }; phase = 'thinking'; pending = new AbortController(); setError();
  setStatus('Comparing the two images with the local model. This may take a minute…');
  history.replaceState(null, '', '/?view=compare-thinking');
  await mountState('compareThinking'); sync();
  try {
    const data = await api('/api/compare', { image, imageB, promptId: prompt.id, model: modelSelect.value }, pending.signal);
    session = data.session; phase = 'complete';
    history.replaceState(null, '', `/?session=${encodeURIComponent(session.id)}&view=compare-complete`);
    await mountState('compareComplete');
  } catch (error) {
    if (error.name === 'AbortError') setStatus('Request cancelled.'); else setError(error.message, error.raw);
    phase = 'new'; session = null; await mountState('compareNew');
  } finally { setStatus(); pending = null; sync(); }
}

async function sendChat() {
  const composer = firstNamed('prompt-text', $('.source-frame', app));
  const message = leaf(composer)?.textContent.trim();
  if (!message || !session?.id || pending) return;
  chatRequest = chatRequest?.message === message && chatRequest.sessionId === session.id ? chatRequest : { message, sessionId: session.id, id: crypto.randomUUID() };
  pending = new AbortController(); setError(); setChatError(); setStatus('Director is looking at the image and your conversation…'); sync();
  try {
    const data = await api('/api/chat', { sessionId: session.id, revision: session.revision, message, requestId: chatRequest.id }, pending.signal);
    session = data.session; chatRequest = null;
    const root = $('.source-frame', app);
    renderTranscript(root);
    setComposer(root);
  } catch (error) { setChatError(error.message); setText(firstNamed('prompt-text', $('.source-frame', app)), message); }
  finally { pending = null; setStatus(); sync(); }
}

async function renameSession() {
  if (!session?.id || pending) return;
  const title = window.prompt('Session title (up to 200 characters):', session.title || session.image.name); if (title === null) return;
  pending = new AbortController();
  try { const data = await api(`/api/sessions/${session.id}`, { title, revision: session.revision }, pending.signal, 'PATCH'); session = data.session; renderComplete($('.source-frame', app), phase === 'detail' || phase === 'compareDetail'); }
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
  if (nextPhase === 'compareNew') renderCompareNew(root);
  if (nextPhase === 'compareThinking') renderCompareThinking(root);
  if (nextPhase === 'compareComplete') renderCompareComplete(root, false);
  if (nextPhase === 'compareDetail') renderCompareComplete(root, true);
  setModelBars(root); sync();
}

async function loadSessionFromQuery() {
  const id = new URLSearchParams(location.search).get('session');
  if (!id) return mountState('new');
  const data = await api(`/api/sessions/${encodeURIComponent(id)}`);
  session = data.session; mode = session.type === 'compare' ? 'compare' : 'feedback'; image = session.image; imageB = session.imageB || null; phase = 'detail';
  populatePrompts(session.prompt?.id);
  await mountState(mode === 'compare' ? 'compareDetail' : 'detail');
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
