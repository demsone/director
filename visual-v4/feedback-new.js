// Director / New Feedback progressive enhancement.
// The approved Astra DOM and CSS remain the rendered interface.
(() => {
  const draftKey = 'director.v4.feedback.draft';
  const sourcePanel = document.querySelector('[data-name="Feedback / File"]');
  const sourceType = document.querySelector('[data-name="photography-input"]');
  const promptSelector = document.querySelector('[data-name="prompt-selector"]');
  const projectSelector = [...document.querySelectorAll('[data-name="prompt-selector"]')][1];
  const promptText = document.querySelector('[data-name="prompt-textarea"] .text-content');
  const submit = document.querySelector('[data-name="action-bar"]');
  const output = document.querySelector('[data-name="content-right"]');
  if (!sourcePanel || !sourceType || !promptSelector || !projectSelector || !promptText || !submit || !output) return;

  const sourceLabel = sourcePanel.querySelector('.f43');
  const sourceMessage = output.querySelector('.f59');
  const sourceHeading = output.querySelector('.f74');
  const state = { source: null, sourceType: 'Photography', promptId: '', promptText: '', projectId: '', projectName: '' };
  const saved = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const textNode = (node) => node.querySelector('.f51') || node.querySelector('.text-content');
  const setOutput = (message) => { if (sourceHeading) sourceHeading.textContent = 'NOTHING TO FEEDBACK'; if (sourceMessage) sourceMessage.textContent = message; };
  const overlay = (host, label, options, onChange) => {
    const select = document.createElement('select');
    select.setAttribute('aria-label', label);
    select.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:2;';
    for (const option of options()) select.add(new Option(option.label, option.value));
    select.addEventListener('change', () => onChange(select.value, select));
    host.append(select);
    return select;
  };

  const fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.tabIndex = -1; fileInput.style.display = 'none'; document.body.append(fileInput);
  const selectSource = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setOutput('Select an image file to start feedback.'); return; }
    state.source = { name: file.name, type: file.type, size: file.size, preview: '' };
    if (sourceLabel) sourceLabel.textContent = file.name;
    setOutput('Select a prompt and get feedback.');
    const reader = new FileReader();
    reader.addEventListener('load', () => { if (state.source) state.source.preview = String(reader.result || ''); });
    reader.readAsDataURL(file);
  };
  sourcePanel.tabIndex = 0; sourcePanel.setAttribute('role', 'button'); sourcePanel.setAttribute('aria-label', 'Choose a source image');
  sourcePanel.addEventListener('click', () => fileInput.click());
  sourcePanel.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); } });
  sourcePanel.addEventListener('dragover', (event) => event.preventDefault());
  sourcePanel.addEventListener('drop', (event) => { event.preventDefault(); selectSource(event.dataTransfer?.files?.[0]); });
  fileInput.addEventListener('change', () => selectSource(fileInput.files?.[0]));

  overlay(sourceType, 'Source type', () => ['Photography', 'Design', 'Screen', 'Layout', 'Poster', 'Visual direction'].map((value) => ({ value, label: value })), (value) => {
    state.sourceType = value; textNode(sourceType).textContent = value;
  });
  overlay(promptSelector, 'Saved prompt', () => {
    const prompts = saved('director.v4.prompts');
    return [{ value: '', label: 'Custom prompt' }, ...prompts.map((prompt) => ({ value: String(prompt.id), label: String(prompt.title || 'Untitled prompt') }))];
  }, (value) => {
    const prompt = saved('director.v4.prompts').find((item) => String(item.id) === value);
    state.promptId = value; textNode(promptSelector).textContent = prompt?.title || 'Custom prompt';
    if (prompt) { state.promptText = String(prompt.body || ''); promptText.textContent = state.promptText; }
  });
  overlay(projectSelector, 'Project link', () => {
    const projects = saved('director.v4.projects');
    return [{ value: '', label: 'Select Project' }, ...projects.map((project) => ({ value: String(project.id), label: String(project.name || 'Untitled project') })), { value: '__new__', label: 'New Project…' }];
  }, (value, select) => {
    if (value === '__new__') {
      const name = window.prompt('Project name');
      if (!name?.trim()) { select.value = state.projectId; return; }
      const project = { id: crypto.randomUUID(), name: name.trim() };
      localStorage.setItem('director.v4.projects', JSON.stringify([...saved('director.v4.projects'), project]));
      select.add(new Option(project.name, project.id, true, true), select.options.length - 1);
      state.projectId = project.id; state.projectName = project.name;
    } else {
      const project = saved('director.v4.projects').find((item) => String(item.id) === value);
      state.projectId = value; state.projectName = project?.name || '';
    }
    textNode(projectSelector).textContent = state.projectName || 'Select Project';
  });

  const editable = promptText.parentElement;
  editable.contentEditable = 'true'; editable.setAttribute('role', 'textbox'); editable.setAttribute('aria-label', 'Prompt text');
  editable.addEventListener('input', () => { state.promptText = promptText.textContent.trim(); state.promptId = ''; textNode(promptSelector).textContent = 'Custom prompt'; });
  submit.tabIndex = 0; submit.setAttribute('role', 'button'); submit.setAttribute('aria-label', 'Get feedback');
  const begin = () => {
    state.promptText = promptText.textContent.trim();
    if (!state.source) { setOutput('Select an image to start feedback.'); sourcePanel.focus(); return; }
    if (!state.promptText) { setOutput('Select a saved prompt or enter a prompt before requesting feedback.'); editable.focus(); return; }
    sessionStorage.setItem(draftKey, JSON.stringify(state));
    location.href = 'feedback-thinking.html';
  };
  submit.addEventListener('click', begin);
  submit.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); begin(); } });
})();
