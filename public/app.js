const $ = id => document.getElementById(id);
let prompts = [], image = null, session = null, pending = null, decoding = false, imageVersion = 0;

function error(message = '', raw = '') {
  $('error').textContent = message; $('error').hidden = !message;
  $('failed-raw').textContent = raw; $('failed-response').hidden = !raw;
}
function sync() {
  const busy = !!pending || decoding;
  for (const id of ['image-file', 'prompt', 'model']) $(id).disabled = busy || !!session;
  $('refresh').disabled = busy || !!session;
  $('review').disabled = busy || !image || !$('model').value || !$('prompt').value || !!session;
  $('review').hidden = !!session;
  $('new').hidden = !session; $('new').disabled = busy;
  $('send').disabled = busy || !session;
  $('message').disabled = busy;
  $('cancel').hidden = !pending;
  $('chat-section').hidden = !session;
}
async function api(path, body, signal) {
  const response = await fetch(path, { method: body ? 'POST' : 'GET', ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}), signal });
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed.'), { raw: data.raw });
  return data;
}
function showPrompt() {
  const prompt = prompts.find(p => p.id === $('prompt').value);
  $('prompt-text').textContent = prompt?.instruction || '';
  $('prompt-sections').replaceChildren(...(prompt?.sections || []).map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
}
async function refreshModels() {
  $('refresh').disabled = true;
  try {
    const previous = $('model').value;
    const data = await api('/api/models');
    $('model').replaceChildren(...data.models.map(m => new Option(`${m.name} · ${m.contextLength || '?'} context`, m.id)));
    if (data.models.some(m => m.id === previous)) $('model').value = previous;
    if (!data.models.length) $('model').add(new Option('No loaded vision model', ''));
    $('model-status').textContent = data.models.length ? 'LM Studio connected · image-capable model loaded.' : 'Load a vision-capable model in LM Studio, then refresh.';
  } catch (e) {
    $('model').replaceChildren(new Option('LM Studio unavailable', ''));
    $('model-status').textContent = e.message;
  } finally { sync(); }
}
async function selectImage(file) {
  if (!file || pending || session) return;
  const version = ++imageVersion;
  error();
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) { error('Choose a JPEG, PNG or WebP image up to 12 MB.'); $('image-file').value = ''; return; }
  decoding = true; sync();
  try {
    const source = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file); });
    const picture = new Image(); picture.src = source; await picture.decode();
    if (picture.naturalWidth * picture.naturalHeight > 100000000) throw new Error('This image is too large to preview safely. Export a smaller JPEG or PNG.');
    // The original remains visible; a bounded copy is sent repeatedly to the vision model.
    const scale = Math.min(1, 1600 / Math.max(picture.naturalWidth, picture.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(picture.naturalWidth * scale); canvas.height = Math.round(picture.naturalHeight * scale);
    const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(picture, 0, 0, canvas.width, canvas.height);
    if (version !== imageVersion) return;
    image = { name: file.name, dataUrl: canvas.toDataURL('image/jpeg', 0.92) };
    $('preview').src = source; $('preview').alt = `Source image: ${file.name}`; $('preview').hidden = false; $('empty-image').hidden = true;
    $('image-name').textContent = `${file.name} · ${picture.naturalWidth} × ${picture.naturalHeight} · review copy ${canvas.width} × ${canvas.height}`;
  } catch (e) { if (version === imageVersion) error(`Could not open this image. ${e.message}`); }
  finally { if (version === imageVersion) { decoding = false; $('image-file').value = ''; sync(); } }
}
async function run(status, action) {
  error(); pending = new AbortController(); $('status').textContent = status; sync();
  try { await action(pending.signal); $('status').textContent = ''; }
  catch (e) { $('status').textContent = ''; if (e.name === 'AbortError') $('status').textContent = 'Request cancelled. You can retry.'; else error(e.message, e.raw); }
  finally { pending = null; sync(); }
}
function renderFeedback() {
  $('feedback').replaceChildren(...session.feedback.sections.map(({ heading, content }, i) => {
    const section = document.createElement('section'); const title = document.createElement('h3'); const text = document.createElement('p');
    title.textContent = `${i + 1}. ${heading}`; text.textContent = content; section.append(title, text); return section;
  }));
  $('raw').textContent = session.feedback.raw; $('raw-response').hidden = false;
  $('session-info').textContent = `${session.image.name} · ${session.prompt.category} / ${session.prompt.name} · ${session.model}`;
}
function renderChat() {
  $('chat-log').replaceChildren(...session.chat.map(turn => {
    const article = document.createElement('article'); article.className = `turn ${turn.role}`;
    const label = document.createElement('strong'); label.textContent = turn.role === 'user' ? 'You' : 'Director';
    const content = document.createElement('p'); content.textContent = turn.content;
    article.append(label, content); return article;
  }));
}
$('image-file').addEventListener('change', e => selectImage(e.target.files[0]));
for (const name of ['dragenter', 'dragover']) $('drop-zone').addEventListener(name, e => { e.preventDefault(); if (!pending && !session) $('drop-zone').classList.add('dragging'); });
$('drop-zone').addEventListener('dragleave', () => $('drop-zone').classList.remove('dragging'));
$('drop-zone').addEventListener('drop', e => { e.preventDefault(); $('drop-zone').classList.remove('dragging'); if (e.dataTransfer.files.length > 1) error('Drop one image at a time.'); else selectImage(e.dataTransfer.files[0]); });
window.addEventListener('dragover', e => e.preventDefault()); window.addEventListener('drop', e => e.preventDefault());
$('prompt').addEventListener('change', showPrompt); $('model').addEventListener('change', sync); $('refresh').addEventListener('click', refreshModels);
$('cancel').addEventListener('click', () => pending?.abort());
$('review').addEventListener('click', () => run('Reviewing your image with the local model. This may take a minute…', async signal => {
  const data = await api('/api/feedback', { image, promptId: $('prompt').value, model: $('model').value }, signal);
  session = data.session; renderFeedback();
}));
$('chat-form').addEventListener('submit', e => {
  e.preventDefault(); const message = $('message').value.trim(); if (!message || !session || pending) return;
  run('Director is looking at the image and your conversation…', async signal => {
    const data = await api('/api/chat', { session, message }, signal);
    session.chat.push({ role: 'user', content: message }, data.turn); renderChat(); $('message').value = '';
  }).then(() => $('message').focus());
});
$('new').addEventListener('click', () => {
  if (!window.confirm('Start a new critique? This will clear the current feedback and chat from this tab. The image stays selected.')) return;
  session = null; $('feedback').replaceChildren(); $('chat-log').replaceChildren(); $('raw').textContent = ''; $('raw-response').hidden = true;
  $('message').value = ''; $('session-info').textContent = 'Choose a prompt or replace the image for a new critique.'; error(); sync(); refreshModels();
});
window.addEventListener('beforeunload', e => { if (session || pending) { e.preventDefault(); e.returnValue = ''; } });
try {
  prompts = (await api('/api/prompts')).prompts;
  for (const category of [...new Set(prompts.map(p => p.category))]) { const group = document.createElement('optgroup'); group.label = category; group.append(...prompts.filter(p => p.category === category).map(p => new Option(p.name, p.id))); $('prompt').append(group); }
  showPrompt(); await refreshModels();
} catch (e) { error(`Director could not start: ${e.message}`); }
sync();
