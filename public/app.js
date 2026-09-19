const $ = id => document.getElementById(id);
let prompts = [], image = null, imageB = null, mode = 'feedback', session = null, pending = null, decoding = 0;
const imageVersion = { A: 0, B: 0 };
let chatRequest = null;

function error(message = '', raw = '') {
  $('error').textContent = message; $('error').hidden = !message;
  $('failed-raw').textContent = raw; $('failed-response').hidden = !raw;
}
function sync() {
  const busy = !!pending || decoding;
  for (const id of ['image-file', 'image-file-b', 'prompt', 'model']) $(id).disabled = busy || !!session;
  $('mode').disabled = busy;
  $('refresh').disabled = busy;
  $('review').disabled = busy || !image || (mode === 'compare' && !imageB) || !$('model').value || !$('prompt').value || !!session;
  $('review').hidden = !!session;
  $('new').hidden = !session; $('new').disabled = busy;
  $('send').disabled = busy || !session;
  $('message').disabled = busy;
  $('cancel').hidden = !pending;
  $('chat-section').hidden = !session;
  $('refresh-history').disabled = busy;
  for (const button of $('history-list').querySelectorAll('button')) button.disabled = busy || button.dataset.unavailable === 'true';
  document.body.dataset.mode = mode;
  $('image-b-panel').hidden = mode !== 'compare';
  $('source-heading').textContent = mode === 'compare' ? '1. Image A' : '1. Your image';
  $('feedback-heading').textContent = mode === 'compare' ? '3. Comparative feedback' : '3. Feedback';
  $('review').textContent = mode === 'compare' ? 'Compare images' : 'Get feedback';
  $('new').textContent = mode === 'compare' ? 'New comparison' : 'New critique';
  $('chat-context').textContent = mode === 'compare' ? 'Director keeps Image A, Image B, the comparison prompt and feedback in context.' : 'Director keeps this image, prompt and feedback in context.';
}
async function api(path, body, signal, method = body ? 'POST' : 'GET') {
  const response = await fetch(path, { method, ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}), signal });
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed.'), { raw: data.raw });
  return data;
}
function showPrompt() {
  const prompt = session?.prompt || prompts.find(p => p.id === $('prompt').value);
  $('prompt-text').textContent = prompt?.instruction || '';
  $('prompt-sections').replaceChildren(...(prompt?.sections || []).map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
}
function populatePrompts(selected = $('prompt').value) {
  const available = prompts.filter(p => (p.sessionType || 'feedback') === mode);
  $('prompt').replaceChildren();
  for (const category of [...new Set(available.map(p => p.category))]) { const group = document.createElement('optgroup'); group.label = category; group.append(...available.filter(p => p.category === category).map(p => new Option(p.name, p.id))); $('prompt').append(group); }
  if (available.some(p => p.id === selected)) $('prompt').value = selected;
  showPrompt();
}
async function refreshModels() {
  $('refresh').disabled = true;
  try {
    const previous = session?.model || $('model').value;
    const data = await api('/api/models');
    $('model').replaceChildren(...data.models.map(m => new Option(`${m.name} · ${m.contextLength || '?'} context`, m.id)));
    if (data.models.some(m => m.id === previous)) $('model').value = previous;
    if (!data.models.length) $('model').add(new Option('No loaded vision model', ''));
    $('model-status').textContent = data.models.length ? 'LM Studio connected · image-capable model loaded.' : 'Load a vision-capable model in LM Studio, then refresh.';
    if (session && !data.models.some(m => m.id === session.model)) {
      $('model').add(new Option(`${session.model} · saved model, currently unloaded`, session.model)); $('model').value = session.model;
      $('model-status').textContent = `Load ${session.model} in LM Studio to continue this saved conversation.`;
    }
  } catch (e) {
    $('model').replaceChildren(new Option('LM Studio unavailable', ''));
    $('model-status').textContent = e.message;
    if (session) { $('model').add(new Option(`${session.model} · saved model`, session.model)); $('model').value = session.model; }
  } finally { sync(); }
}
async function selectImage(file, slot = 'A') {
  if (!file || pending || session || (slot === 'B' && mode !== 'compare')) return;
  const suffix = slot === 'B' ? '-b' : '';
  error();
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) { error('Choose a JPEG, PNG or WebP image up to 12 MB.'); $(`image-file${suffix}`).value = ''; return; }
  const version = ++imageVersion[slot]; decoding++; sync();
  try {
    const source = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file); });
    const picture = new Image(); picture.src = source; await picture.decode();
    if (picture.naturalWidth * picture.naturalHeight > 100000000) throw new Error('This image is too large to preview safely. Export a smaller JPEG or PNG.');
    // The original remains visible; a bounded copy is sent repeatedly to the vision model.
    const scale = Math.min(1, 1600 / Math.max(picture.naturalWidth, picture.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(picture.naturalWidth * scale); canvas.height = Math.round(picture.naturalHeight * scale);
    const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(picture, 0, 0, canvas.width, canvas.height);
    if (version !== imageVersion[slot]) return;
    const selected = { name: file.name, sourceDataUrl: source, dataUrl: canvas.toDataURL('image/jpeg', 0.92), width: picture.naturalWidth, height: picture.naturalHeight, reviewWidth: canvas.width, reviewHeight: canvas.height };
    if (slot === 'A') image = selected; else imageB = selected;
    renderImage(selected, slot);
  } catch (e) { if (version === imageVersion[slot]) error(`Could not open Image ${slot}. ${e.message}`); }
  finally { decoding--; if (version === imageVersion[slot]) $(`image-file${suffix}`).value = ''; sync(); }
}
function renderImage(selected, slot) {
  const suffix = slot === 'B' ? '-b' : '';
  const preview = $(`preview${suffix}`); preview.hidden = !selected; $(`empty-image${suffix}`).hidden = !!selected;
  if (!selected) { preview.removeAttribute('src'); $(`image-name${suffix}`).textContent = 'JPEG, PNG or WebP · up to 12 MB'; return; }
  preview.src = selected.sourceDataUrl; preview.alt = `Image ${slot}: ${selected.name}`;
  $(`image-name${suffix}`).textContent = `${selected.name}${selected.width ? ` · ${selected.width} × ${selected.height} · review copy ${selected.reviewWidth} × ${selected.reviewHeight}` : ''}${session ? ' · Director-owned copy' : ''}`;
}
async function run(status, action) {
  error(); pending = new AbortController(); $('status').textContent = status; sync();
  try { await action(pending.signal); $('status').textContent = ''; }
  catch (e) { $('status').textContent = ''; if (e.name === 'AbortError') $('status').textContent = 'Request cancelled. Check History if a save was already finishing; otherwise you can retry.'; else error(e.message, e.raw); }
  finally { pending = null; await refreshHistory(); sync(); }
}
function renderFeedback() {
  $('feedback').replaceChildren(...session.feedback.sections.map(({ heading, content }, i) => {
    const section = document.createElement('section'); const title = document.createElement('h3'); const text = document.createElement('p');
    title.textContent = `${i + 1}. ${heading}`; text.textContent = content; section.append(title, text); return section;
  }));
  $('raw').textContent = session.feedback.raw; $('raw-response').hidden = false;
  $('session-info').textContent = `${session.type === 'compare' ? `Image A: ${session.image.name} / Image B: ${session.imageB.name}` : session.image.name} · ${session.prompt.category} / ${session.prompt.name} · ${session.model}`;
  $('save-status').textContent = `Saved locally · ${session.title || session.image.name} · updated ${new Date(session.updatedAt).toLocaleString()}`;
}
function renderChat() {
  $('chat-log').replaceChildren(...session.chat.map(turn => {
    const article = document.createElement('article'); article.className = `turn ${turn.role}`;
    const label = document.createElement('strong'); label.textContent = turn.role === 'user' ? 'You' : 'Director';
    const content = document.createElement('p'); content.textContent = turn.content;
    article.append(label, content); return article;
  }));
}
async function refreshHistory() {
  try {
    const data = await api('/api/sessions');
    $('history-list').replaceChildren(...data.sessions.map(item => {
      const li = document.createElement('li'); li.dataset.sessionId = item.id;
      if (item.id === session?.id) li.setAttribute('aria-current', 'true');
      const description = document.createElement('div'); description.className = 'history-description';
      const title = document.createElement('strong'); title.textContent = item.title || item.imageName || 'Untitled session';
      const meta = document.createElement('p'); meta.className = 'muted'; meta.textContent = `${item.type === 'compare' ? `Compare · A: ${item.imageName} / B: ${item.imageBName}` : `Feedback · ${item.imageName || 'Image unavailable'}`} · updated ${new Date(item.updatedAt).toLocaleString()}`;
      description.append(title, meta);
      if (item.error) { const warning = document.createElement('p'); warning.textContent = item.error; description.append(warning); }
      const actions = document.createElement('div'); actions.className = 'history-actions';
      for (const [label, handler] of [['Open', () => openSession(item.id)], ['Rename', () => renameSession(item)], ['Delete', () => deleteSession(item)]]) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
        if (item.error && label !== 'Delete') button.dataset.unavailable = 'true';
        button.addEventListener('click', handler); actions.append(button);
      }
      li.append(description, actions); return li;
    }));
    $('history-status').textContent = data.sessions.length ? `${data.sessions.length} saved session${data.sessions.length === 1 ? '' : 's'}` : 'No saved sessions yet. Your first completed critique will appear here.';
  } catch (e) { $('history-status').textContent = `History could not be loaded: ${e.message}`; }
  sync();
}
function keepDraft() { return !$('message').value.trim() || window.confirm('Discard the unsent draft? Your completed conversation is already saved.'); }
function restoreSession(saved, { preserveDraft = false } = {}) {
  session = saved; image = saved.image; imageB = saved.imageB || null; mode = saved.type; $('mode').value = mode;
  if (!preserveDraft) { $('message').value = ''; chatRequest = null; }
  renderImage(image, 'A'); renderImage(imageB, 'B'); populatePrompts(saved.prompt.id);
  if (![...$('prompt').options].some(p => p.value === saved.prompt.id)) { const option = new Option(saved.prompt.name, saved.prompt.id); option.dataset.snapshot = 'true'; $('prompt').add(option); }
  $('prompt').value = saved.prompt.id;
  // Always show the saved name/content, even if the catalog changed under the same ID.
  const option = [...$('prompt').options].find(o => o.value === saved.prompt.id); if (option) option.textContent = saved.prompt.name;
  showPrompt(); renderFeedback(); renderChat(); sync();
}
function openSession(id) {
  const sameSession = session?.id === id;
  if (pending || (!sameSession && !keepDraft())) return;
  run('Opening saved session…', async signal => {
    const data = await api(`/api/sessions/${id}`, null, signal); restoreSession(data.session, { preserveDraft: sameSession }); await refreshModels();
  });
}
function renameSession(item) {
  const title = window.prompt('Session title (up to 200 characters):', item.title || '');
  if (title === null) return;
  run('Saving session title…', async signal => {
    const data = await api(`/api/sessions/${item.id}`, { title, revision: item.revision }, signal, 'PATCH');
    if (session?.id === item.id) restoreSession(data.session, { preserveDraft: true });
  });
}
function clearSession({ retainImage = true } = {}) {
  session = null; chatRequest = null;
  $('feedback').replaceChildren(); $('chat-log').replaceChildren(); $('raw').textContent = ''; $('raw-response').hidden = true;
  $('message').value = ''; $('save-status').textContent = ''; $('session-info').textContent = 'Choose a prompt or replace the image for a new critique.';
  populatePrompts();
  if (!retainImage) { image = null; imageB = null; }
  renderImage(image, 'A'); renderImage(imageB, 'B');
  showPrompt(); sync();
}
function deleteSession(item) {
  if (!window.confirm(`Delete “${item.title || item.imageName || 'Untitled session'}” and its Director-owned image copies? This cannot be undone. Your original file will not be touched.`)) return;
  run('Deleting session…', async signal => {
    await api(`/api/sessions/${item.id}`, { revision: item.revision }, signal, 'DELETE');
    if (session?.id === item.id) { clearSession({ retainImage: false }); await refreshModels(); }
  });
}
for (const slot of ['A', 'B']) {
  const suffix = slot === 'B' ? '-b' : '', drop = $(`drop-zone${suffix}`);
  $(`image-file${suffix}`).addEventListener('change', e => selectImage(e.target.files[0], slot));
  for (const name of ['dragenter', 'dragover']) drop.addEventListener(name, e => { e.preventDefault(); if (!pending && !session) drop.classList.add('dragging'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
  drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragging'); if (e.dataTransfer.files.length > 1) error(`Drop one image into Image ${slot} at a time.`); else selectImage(e.dataTransfer.files[0], slot); });
}
$('mode').addEventListener('change', () => {
  if (!keepDraft()) { $('mode').value = mode; return; }
  mode = $('mode').value; clearSession(); error(); refreshModels(); refreshHistory();
});
window.addEventListener('dragover', e => e.preventDefault()); window.addEventListener('drop', e => e.preventDefault());
$('prompt').addEventListener('change', showPrompt); $('model').addEventListener('change', sync); $('refresh').addEventListener('click', refreshModels);
$('refresh-history').addEventListener('click', refreshHistory);
$('cancel').addEventListener('click', () => pending?.abort());
$('review').addEventListener('click', () => run(mode === 'compare' ? 'Comparing Image A and Image B with the local model…' : 'Reviewing your image with the local model. This may take a minute…', async signal => {
  const data = await api(mode === 'compare' ? '/api/compare' : '/api/feedback', { image, ...(mode === 'compare' ? { imageB } : {}), promptId: $('prompt').value, model: $('model').value }, signal);
  restoreSession(data.session);
}));
$('chat-form').addEventListener('submit', e => {
  e.preventDefault(); const message = $('message').value.trim(); if (!message || !session || pending) return;
  if (!chatRequest || chatRequest.message !== message || chatRequest.sessionId !== session.id) chatRequest = { message, sessionId: session.id, id: crypto.randomUUID() };
  run('Director is looking at the image and your conversation…', async signal => {
    const data = await api('/api/chat', { sessionId: session.id, revision: session.revision, message, requestId: chatRequest.id }, signal);
    restoreSession(data.session);
  }).then(() => $('message').focus());
});
$('new').addEventListener('click', () => {
  if (!keepDraft()) return;
  clearSession(); error(); refreshModels(); refreshHistory();
});
window.addEventListener('beforeunload', e => { if (pending || $('message').value.trim()) { e.preventDefault(); e.returnValue = ''; } });
try {
  prompts = (await api('/api/prompts')).prompts;
  populatePrompts();
  showPrompt(); await Promise.all([refreshModels(), refreshHistory()]);
} catch (e) { error(`Director could not start: ${e.message}`); }
sync();
