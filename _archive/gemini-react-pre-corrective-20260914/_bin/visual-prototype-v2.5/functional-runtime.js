/* Behaviour-only attachment layer. It intentionally does not create or style UI. */
(() => {
  const Core = window.DirectorCore;
  const Logic = window.DirectorLogic;
  if (!Core || !Logic) return;
  let state = Core.load(localStorage);
  const save = () => Core.save(localStorage, state);
  const textLeaf = (node, value) => { const leaves = node?.querySelectorAll('span'); const leaf = leaves?.[leaves.length - 1]; if (leaf) leaf.textContent = value; };
  const markdownLeaf = (node, value) => { const leaves = node?.querySelectorAll('span'); const leaf = leaves?.[leaves.length - 1]; if (leaf) leaf.innerHTML = Core.markdown(value); };
  const buttonWithText = (value) => [...document.querySelectorAll('[data-name="UI / Button"]')].find((node) => node.textContent.trim() === value);
  const fileAsSource = (file) => new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve({ id: Core.id('source'), name: file.name, type: file.type, dataUrl: reader.result }); reader.onerror = () => resolve(null); reader.readAsDataURL(file); });
  const imageMessage = (source, direction) => [{ role: 'user', content: [{ type: 'text', text: direction }, { type: 'image_url', image_url: { url: source.dataUrl } }] }];
  const feedbackById = (id) => state.feedbackSessions.find((session) => session.id === id);
  const activeFeedback = () => feedbackById(new URLSearchParams(location.search).get('session') || state.activeFeedbackId);
  const dateLabel = (value) => new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  const sourceFor = (session) => session.source || session.sourceItems?.[0] || null;
  const compareMessages = (sources, direction) => [{ role: 'user', content: [{ type: 'text', text: direction }, ...sources.map((source) => ({ type: 'image_url', image_url: { url: source.dataUrl } }))] }];
  const compareById = (id) => state.compareSessions.find((session) => session.id === id);
  const activeCompare = () => compareById(new URLSearchParams(location.search).get('session') || state.activeCompareId);
  const projectById = (id) => state.projects.find((project) => project.id === id);
  const activeProject = () => projectById(new URLSearchParams(location.search).get('project') || state.activeProjectId);
  const projectSessions = (project) => ({ feedback: state.feedbackSessions.filter((session) => session.projectId === project.id), compare: state.compareSessions.filter((session) => session.projectId === project.id) });

  function applyRuntimeTerminology() {
    const replacements = [['Image Decision', 'Comparison'], ['ASK FOR NEW FEEDBACK', 'NEW COMPARE'], ['UPDATE FEEDBACK', 'UPDATE COMPARISON'], ['Single Feedback', 'Feedback'], ['FEEBACK', 'FEEDBACK']];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => replacements.forEach(([from, to]) => { if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.replaceAll(from, to); }));
  }

  function syncModelBar() {
    const model = state.settings.feedbackModel || state.settings.compareModel || state.settings.visionModel;
    document.querySelectorAll('[data-name="model-name"]').forEach((node) => textLeaf(node, model ? `ONLINE · LM STUDIO · ${model.toUpperCase()}` : 'MODEL NOT SET'));
  }

  function attachDesignStudioNavigation() {
    const item = [...document.querySelectorAll('[data-name="Navigation / Item"]')].find((node) => node.textContent.trim() === 'Design Studio');
    if (!item) return;
    item.tabIndex = 0;
    item.setAttribute('role', 'link');
    item.setAttribute('aria-label', 'Design Studio / Library');
    item.style.cursor = 'pointer';
    const go = () => { location.href = 'darkroom-library.html?library=design'; };
    item.addEventListener('click', go);
    item.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); } });
  }

  function setLibraryNavigationState(isDesign) {
    if (!isDesign) return;
    const items = [...document.querySelectorAll('[data-name="Navigation / Item"]')];
    const design = items.find((node) => node.textContent.trim() === 'Design Studio');
    const darkroom = items.find((node) => node.textContent.trim() === 'Darkroom');
    if (design) {
      design.style.boxShadow = 'inset 2px 0 var(--color-ui-accent-primary, rgba(185,90,54,1))';
      const label = design.firstElementChild?.firstElementChild;
      if (label) { label.style.setProperty('font-weight', '700', 'important'); label.style.setProperty('color', 'var(--color-ui-text-primary, rgba(242,240,237,1))', 'important'); }
    }
    if (darkroom) {
      darkroom.className = 'node f11';
      const heading = darkroom.firstElementChild;
      const label = heading?.firstElementChild;
      if (heading) heading.className = 'node f10';
      if (label) { label.className = 'node f9'; label.style.removeProperty('font-weight'); label.style.removeProperty('color'); }
      const text = label?.querySelector('span:last-child'); if (text) text.className = 'f5';
    }
  }

  function attachModelSettings() {
    document.querySelector('[data-node="4016:4289"]')?.style.setProperty('display', 'none');
    const fields = [['4016:4286', 'feedbackModel', 'Default feedback model'], ['4016:4287', 'compareModel', 'Default compare model'], ['4016:4288', 'visionModel', 'Vision model'], ['4016:4290', 'serverUrl', 'Local server URL']];
    fields.forEach(([nodeId, key, label]) => {
      const node = document.querySelector(`[data-node="${nodeId}"]`);
      if (!node) return;
      node.style.cursor = 'text';
      node.addEventListener('click', () => {
        const value = window.prompt(label, state.settings[key] || '');
        if (value === null) return;
        state.settings[key] = value.trim(); save();
        textLeaf(node.querySelector('[data-name="field"]') || node, state.settings[key] || 'Not set');
      });
    });
    const test = buttonWithText('TEST CONNECTION');
    test?.addEventListener('click', async () => {
      const original = test.textContent;
      textLeaf(test, 'TESTING…');
      try { const response = await fetch(`${(state.settings.serverUrl || '').replace(/\/$/, '')}/v1/models`); if (!response.ok) throw new Error(); textLeaf(test, 'CONNECTED'); }
      catch (_) { textLeaf(test, 'CONNECTION FAILED'); }
      window.setTimeout(() => textLeaf(test, original), 1800);
    });
  }

  function attachPersonalisationSettings() {
    const fields = [...document.querySelectorAll('[data-name="Form / Field"]')];
    const definitions = [
      ['tone', 'Base style and tone', ['Calm and direct', 'Professional', 'Warm']],
      ['warmth', 'Warmth', ['Less', 'Balanced', 'Warm']],
      ['fastAnswers', 'Fast Answers', null],
      ['customInstructions', 'Custom instructions', null]
    ];
    definitions.forEach(([key, label, choices], index) => {
      const field = fields[index]; if (!field) return;
      const render = () => textLeaf(field, key === 'fastAnswers' ? (state.settings.fastAnswers ? 'Yes' : 'No') : (state.settings[key] || ''));
      render(); field.style.cursor = 'text'; field.addEventListener('click', () => {
        const hint = choices ? `${label}: ${choices.join(', ')}` : label;
        const value = window.prompt(hint, key === 'fastAnswers' ? (state.settings.fastAnswers ? 'Yes' : 'No') : state.settings[key] || '');
        if (value === null) return;
        if (key === 'fastAnswers') state.settings.fastAnswers = /^y(es)?$/i.test(value.trim());
        else if (!choices || choices.includes(value.trim())) state.settings[key] = value.trim();
        else return;
        save(); render();
      });
    });
    const sample = document.querySelector('[data-name="output text"]');
    textLeaf(sample, 'These settings shape Director’s feedback and comparison requests.');
    const labels = [...document.querySelectorAll('[data-name="Label / Medium 13px"]')];
    labels.find((node) => node.textContent.trim() === 'Warm') && textLeaf(labels.find((node) => node.textContent.trim() === 'Warm'), 'Warmth');
  }

  function attachAppearanceSettings() {
    const theme = [...document.querySelectorAll('div')].find((node) => node.textContent.trim() === 'Dark');
    if (!theme) return;
    textLeaf(theme, state.settings.appearance || 'Dark');
    theme.style.cursor = 'default';
  }

  function attachNewFeedback() {
    const draft = { source: null, sourceType: 'Photography', prompt: null, projectId: null };
    const fileBox = document.querySelector('[data-name="Feedback / File"]');
    const promptBox = [...document.querySelectorAll('[data-name="prompt-selector"]')][0];
    const projectBox = [...document.querySelectorAll('[data-name="prompt-selector"]')][1];
    const promptBody = document.querySelector('[data-name="prompt-textarea"]');
    const typeBox = document.querySelector('[data-name="photography-input"]');
    const output = document.querySelector('[data-name="Form / Field"]');
    if (!fileBox || !promptBox || !output) return;
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.hidden = true; document.body.append(input);
    fileBox.style.cursor = 'pointer'; fileBox.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files?.[0]; if (!file || !file.type.startsWith('image/')) return;
      draft.source = await fileAsSource(file); if (!draft.source) return;
      fileBox.style.backgroundImage = `url("${draft.source.dataUrl}")`; fileBox.style.backgroundSize = 'cover'; fileBox.style.backgroundPosition = 'center';
      textLeaf(fileBox, draft.source.name);
    });
    typeBox?.addEventListener('click', () => { const types = ['Photography', 'Design', 'General']; draft.sourceType = types[(types.indexOf(draft.sourceType) + 1) % types.length]; draft.prompt = null; textLeaf(typeBox, draft.sourceType); textLeaf(promptBox, 'Select prompt'); textLeaf(promptBody, 'Select a preset prompt OR enter your own..'); });
    promptBox.style.cursor = 'pointer'; promptBox.addEventListener('click', () => {
      const options = Core.visiblePrompts(state, draft.sourceType, 'Feedback');
      const value = window.prompt(`Choose a prompt:\n${options.map((item) => item.name).join('\n')}`, draft.prompt?.name || '');
      const selected = options.find((item) => item.name === value); if (!selected) return;
      draft.prompt = selected; textLeaf(promptBox, selected.name); textLeaf(promptBody, selected.body);
    });
    projectBox?.addEventListener('click', () => {
      if (!state.projects.length) return;
      const value = window.prompt(`Choose a project:\n${state.projects.map((item) => item.title).join('\n')}`, state.projects.find((item) => item.id === draft.projectId)?.title || '');
      const selected = state.projects.find((item) => item.title === value); if (!selected) return;
      draft.projectId = selected.id; textLeaf(projectBox, selected.title);
    });
    const submit = buttonWithText('GET FEEDBACK');
    submit?.addEventListener('click', async () => {
      if (!draft.source) { textLeaf(output, 'SELECT AN IMAGE'); return; }
      if (!draft.prompt) { textLeaf(output, 'SELECT A PROMPT'); return; }
      const model = state.settings.feedbackModel || state.settings.visionModel;
      if (!model) { textLeaf(output, 'MODEL NOT SET'); return; }
      textLeaf(output, 'GETTING FEEDBACK…');
      const session = Logic.feedbackSession({ source: draft.source, sourceType: draft.sourceType, promptId: draft.prompt.id, promptName: draft.prompt.name, model, projectId: draft.projectId });
      try {
        session.initialResponse = await Logic.requestCompletion(state.settings, model, imageMessage(draft.source, draft.prompt.body));
        state.feedbackSessions.unshift(session); state.activeFeedbackId = session.id; save();
        location.href = `director-feedback-chat.html?session=${encodeURIComponent(session.id)}`;
      } catch (_) { textLeaf(output, 'REQUEST FAILED'); }
    });
  }

  function attachNewCompare() {
    const draft = { sources: [], sourceType: 'Photography', prompt: null, projectId: null };
    const fileBox = document.querySelector('[data-name="Feedback / File"]');
    const selectors = [...document.querySelectorAll('[data-name="photography-input"]')];
    const typeBox = selectors[0]; const projectBox = selectors[1]; const promptBox = selectors[2];
    const reply = document.querySelector('[data-name="reply"]');
    if (!fileBox || !promptBox || !reply) return;
    const feedbackTab = [...document.querySelectorAll('[data-name="Label/11px"]')].find((node) => node.textContent.trim() === 'Single Feedback');
    textLeaf(feedbackTab, 'Feedback');
    textLeaf(reply?.querySelector('[data-name="output text"]'), 'Select 2–6 sources to start a comparison.');
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.multiple = true; input.hidden = true; document.body.append(input);
    fileBox.style.cursor = 'pointer'; fileBox.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const files = [...(input.files || [])];
      if (files.some((file) => !file.type.startsWith('image/'))) { textLeaf(reply, 'INVALID SOURCE'); return; }
      if (files.length < 2) { textLeaf(reply, 'SELECT 2–6 SOURCES'); return; }
      if (files.length > 6) { textLeaf(reply, 'SELECT NO MORE THAN 6 SOURCES'); return; }
      draft.sources = (await Promise.all(files.map(fileAsSource))).filter(Boolean);
      if (!draft.sources.length) return;
      fileBox.style.backgroundImage = `url("${draft.sources[0].dataUrl}")`; fileBox.style.backgroundSize = 'cover'; fileBox.style.backgroundPosition = 'center';
      textLeaf(fileBox, `${draft.sources.length} sources selected`);
    });
    typeBox?.addEventListener('click', () => { const types = ['Photography', 'Design', 'General']; draft.sourceType = types[(types.indexOf(draft.sourceType) + 1) % types.length]; draft.prompt = null; textLeaf(typeBox, draft.sourceType); textLeaf(promptBox, 'Select prompt'); });
    promptBox?.addEventListener('click', () => {
      const options = Core.visiblePrompts(state, draft.sourceType, 'Compare');
      const value = window.prompt(`Choose a prompt:\n${options.map((item) => item.name).join('\n')}`, draft.prompt?.name || '');
      const selected = options.find((item) => item.name === value); if (!selected) return;
      draft.prompt = selected; textLeaf(promptBox, selected.name);
    });
    projectBox?.addEventListener('click', () => {
      if (!state.projects.length) return;
      const value = window.prompt(`Choose a project:\n${state.projects.map((item) => item.title).join('\n')}`, state.projects.find((item) => item.id === draft.projectId)?.title || '');
      const selected = state.projects.find((item) => item.title === value); if (!selected) return;
      draft.projectId = selected.id; textLeaf(projectBox, selected.title);
    });
    buttonWithText('CLEAR PROMPT')?.addEventListener('click', () => { draft.prompt = null; textLeaf(promptBox, 'Select prompt'); });
    buttonWithText('COMPARE SOURCES')?.addEventListener('click', async () => {
      if (draft.sources.length < 2) { textLeaf(reply, 'SELECT 2–6 SOURCES'); return; }
      if (draft.sources.length > 6) { textLeaf(reply, 'SELECT NO MORE THAN 6 SOURCES'); return; }
      if (!draft.prompt) { textLeaf(reply, 'SELECT A PROMPT'); return; }
      const model = state.settings.compareModel || state.settings.visionModel;
      if (!model) { textLeaf(reply, 'MODEL NOT SET'); return; }
      textLeaf(reply, 'COMPARING SOURCES…');
      const session = Logic.compareSession({ title: `Comparison ${state.compareSessions.length + 1}`, sourceItems: draft.sources, sourceType: draft.sourceType, promptId: draft.prompt.id, promptName: draft.prompt.name, model, projectId: draft.projectId });
      try {
        session.reasoning = await Logic.requestCompletion(state.settings, model, compareMessages(draft.sources, `${draft.prompt.body}\n\nReturn a recommended winner, ranked order, reasoning, per-item strengths, per-item weaknesses, and one refinement suggestion.`));
        state.compareSessions.unshift(session); state.activeCompareId = session.id; save();
        location.href = `compare-result.html?session=${encodeURIComponent(session.id)}`;
      } catch (_) { textLeaf(reply, 'REQUEST FAILED'); }
    });
  }

  function updateCompareResult(session) {
    const header = document.querySelector('[data-name="header-title"]');
    textLeaf(header, session.title || 'Comparison');
    const eyebrow = [...document.querySelectorAll('[data-name="LABEL-ALT/MD/Regular/11px/19"]')].find((node) => node.textContent.includes('DIRECTOR / DARKROOM / COMPARE'));
    textLeaf(eyebrow, 'DIRECTOR / COMPARE');
    const reply = document.querySelector('[data-name="reply"]');
    textLeaf(reply?.querySelector('[data-name="heading"]'), 'FIRST READ');
    markdownLeaf(reply?.querySelector('[data-name="output text"]'), session.reasoning || 'No comparison response saved.');
    const cards = [...document.querySelectorAll('[data-name="Compare / Results"]')];
    cards.forEach((card, index) => {
      const source = session.sourceItems[index]; card.style.display = source ? '' : 'none'; if (!source) return;
      const image = card.querySelector('[data-name="UI / Image"]');
      if (image?.style && source.dataUrl) { image.style.backgroundImage = `url("${source.dataUrl}")`; image.style.backgroundSize = 'cover'; image.style.backgroundPosition = 'center'; }
      textLeaf(card.querySelector('[data-name="title-caption"]'), `#${index + 1} · ${source.name.replace(/\.[^.]+$/, '')}`);
      textLeaf(card.querySelector('[data-name="Strongest overall balance and visual decision."]'), index === 0 ? 'Recommended from the current comparison.' : 'Alternative in the current comparison.');
    });
    const sourceType = document.querySelector('[data-name="photography-input"]'); textLeaf(sourceType, session.sourceType);
    const metadata = document.querySelector('[data-name="feedback-meta"]'); if (metadata) textLeaf(metadata, dateLabel(session.updatedAt || session.createdAt));
    const prompt = state.prompts.find((item) => item.id === session.promptId);
    const composer = document.querySelector('[data-name="prompt-text"]'); if (composer) composer.textContent = '';
    textLeaf(document.querySelector('[data-name="Prompt / Model Selector"]'), session.model || 'MODEL NOT SET');
    const thread = document.querySelector('[data-name="Chat / Thread"]'); const user = thread?.querySelector('[data-name="message-user"]'); const assistant = thread?.querySelector('[data-name="message-assistant"]');
    const lastUser = [...session.chatMessages].reverse().find((message) => message.role === 'user'); const lastAssistant = [...session.chatMessages].reverse().find((message) => message.role === 'assistant');
    if (user) user.style.display = lastUser ? '' : 'none'; if (assistant) assistant.style.display = lastAssistant ? '' : 'none';
    if (lastUser) textLeaf(user, lastUser.content); if (lastAssistant) markdownLeaf(assistant, lastAssistant.content);
    textLeaf(buttonWithText('UPDATE FEEDBACK'), 'UPDATE COMPARISON');
  }

  function attachCompareResult() {
    const session = activeCompare(); if (!session) { location.replace('director-new-compare.html'); return; }
    updateCompareResult(session);
    const editor = document.querySelector('[data-name="prompt-text"]'); const send = document.querySelector('[data-name="enter-button"]');
    if (!editor || !send) return;
    editor.contentEditable = 'true'; editor.setAttribute('role', 'textbox'); editor.setAttribute('aria-label', 'Ask Director about this comparison');
    const submit = async () => {
      const content = editor.textContent.trim(); if (!content) return;
      const model = session.model || state.settings.compareModel || state.settings.visionModel; if (!model) return;
      session.chatMessages.push({ role: 'user', content, createdAt: Core.now() }); editor.textContent = 'DIRECTOR IS READING…';
      try {
        const prompt = state.prompts.find((item) => item.id === session.promptId);
        const messages = [...compareMessages(session.sourceItems, prompt?.body || session.promptName), { role: 'assistant', content: session.reasoning }, ...session.chatMessages.map((message) => ({ role: message.role, content: message.content }))];
        const response = await Logic.requestCompletion(state.settings, model, messages);
        session.chatMessages.push({ role: 'assistant', content: response, createdAt: Core.now() }); session.updatedAt = Core.now(); save(); editor.textContent = ''; updateCompareResult(session);
      } catch (_) { session.chatMessages.push({ role: 'assistant', content: 'REQUEST FAILED', createdAt: Core.now() }); session.updatedAt = Core.now(); save(); editor.textContent = ''; updateCompareResult(session); }
    };
    send.addEventListener('click', submit); editor.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } });
  }

  function attachCompareFixture() {
    const reply = document.querySelector('[data-name="reply"]');
    textLeaf(reply?.querySelector('[data-name="heading"]'), 'NO SAVED COMPARISON');
    textLeaf(reply?.querySelector('[data-name="output text"]'), 'Select 2–6 sources to start a comparison.');
    document.querySelectorAll('[data-name="Compare / Results"], [data-name="message-user"], [data-name="message-assistant"]').forEach((node) => { node.style.display = 'none'; });
    textLeaf(document.querySelector('[data-name="prompt-text"]'), '');
  }

  function createProject() {
    const title = window.prompt('Project title'); if (!title?.trim()) return null;
    const type = window.prompt('Project type: Photography, Design, or Mixed', 'Photography');
    if (!['Photography', 'Design', 'Mixed'].includes(type)) return null;
    const description = window.prompt('Project description', '') || '';
    const project = { id: Core.id('project'), title: title.trim(), type, description, notes: '', createdAt: Core.now(), updatedAt: Core.now() };
    state.projects.unshift(project); state.activeProjectId = project.id; save(); return project;
  }

  function attachProjectsAll() {
    const header = document.querySelector('[data-name="header-title"]');
    const detail = [...document.querySelectorAll('div')].find((node) => node.textContent.trim() === 'Global collections for photography feedback, design feedback, comparisons, and notes.');
    textLeaf(header, 'Projects');
    textLeaf(detail, state.projects.length ? `${state.projects.length} global creative ${state.projects.length === 1 ? 'collection' : 'collections'}.` : 'No projects yet.');
    header?.addEventListener('click', () => { const project = createProject(); if (project) location.href = `projects-detail-overview.html?project=${encodeURIComponent(project.id)}`; });
    header && (header.style.cursor = 'pointer');
    const view = buttonWithText('VIEW FEEDBACK');
    view?.addEventListener('click', () => { const project = state.projects[0]; if (project) location.href = `projects-detail-overview.html?project=${encodeURIComponent(project.id)}`; });
  }

  function bindProjectTabs(project) {
    const tabs = [...document.querySelectorAll('[data-name="Navigation / Tab"], [data-name="Tab"]')];
    tabs.forEach((tab) => {
      const name = tab.textContent.trim(); const href = name === 'Overview' ? 'projects-detail-overview.html' : name === 'Feedback' ? 'projects-detail-feedback.html' : name === 'Compare' || name === 'Notes' ? 'projects-detail-overview.html' : null;
      if (!href) return;
      tab.style.cursor = 'pointer'; tab.onclick = () => { location.href = `${href}?project=${encodeURIComponent(project.id)}${name === 'Compare' || name === 'Notes' ? `&tab=${name.toLowerCase()}` : ''}`; };
    });
  }

  function attachProjectOverview() {
    const project = activeProject(); if (!project) { location.replace('projects-all.html'); return; }
    const sessions = projectSessions(project); state.activeProjectId = project.id; save();
    const tab = new URLSearchParams(location.search).get('tab') || 'overview';
    textLeaf(document.querySelector('[data-name="header-title"]'), project.title);
    const summary = document.querySelector('[data-name="project-summary"]');
    textLeaf(summary, tab === 'notes' ? (project.notes || 'No project notes.') : project.description || 'No project description.');
    const counts = [...document.querySelectorAll('[data-name="activity box"]')];
    textLeaf(counts[0], `${sessions.feedback.length} Feedback Sessions`); textLeaf(counts[1], `${sessions.compare.length} Compare Sessions`);
    const recent = tab === 'compare' ? sessions.compare : tab === 'notes' ? [] : [...sessions.feedback, ...sessions.compare].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    const cards = [...document.querySelectorAll('[data-name="Project / Session Card"]')];
    cards.forEach((card, index) => { const session = recent[index]; card.style.display = session ? '' : 'none'; if (!session) return; textLeaf(card.querySelector('[data-name="session-title"]'), session.title); textLeaf(card.querySelector('[data-name="date-created"]'), dateLabel(session.updatedAt || session.createdAt)); card.onclick = () => { if (session.sourceItems) { state.activeCompareId = session.id; location.href = `compare-result.html?session=${encodeURIComponent(session.id)}`; } else { state.activeFeedbackId = session.id; location.href = `feedback-detail.html?session=${encodeURIComponent(session.id)}`; } save(); }; });
    if (tab === 'notes') { counts.forEach((node) => { node.style.display = 'none'; }); const leaf = summary?.querySelector('span:last-child'); if (leaf) { leaf.contentEditable = 'true'; leaf.setAttribute('role', 'textbox'); leaf.addEventListener('blur', () => { project.notes = leaf.textContent.trim(); project.updatedAt = Core.now(); save(); }); } }
    bindProjectTabs(project);
  }

  function attachProjectFeedback() {
    const project = activeProject(); if (!project) { location.replace('projects-all.html'); return; }
    const sessions = projectSessions(project).feedback; state.activeProjectId = project.id; save();
    textLeaf(document.querySelector('[data-name="header-title"]'), project.title);
    const grid = [...document.querySelectorAll('[data-name="grid-item"]')];
    grid.forEach((card, index) => { const session = sessions[index]; card.style.display = session ? '' : 'none'; if (!session) return; const image = card.querySelector('[data-name="image"]'); if (image && session.source?.dataUrl) { image.style.backgroundImage = `url("${session.source.dataUrl}")`; image.style.backgroundSize = 'cover'; image.style.backgroundPosition = 'center'; } card.addEventListener('click', () => { state.activeFeedbackId = session.id; save(); location.href = `feedback-detail.html?session=${encodeURIComponent(session.id)}`; }); });
    bindProjectTabs(project);
  }

  function openPromptEditor(prompt) { location.href = `prompts-edit.html?prompt=${encodeURIComponent(prompt.id)}`; }

  function attachPromptLibrary() {
    let query = ''; let category = 'All'; let showArchived = false;
    const cards = [...document.querySelectorAll('[data-name="UI / Card with Toolbar"]')];
    const render = () => {
      const prompts = state.prompts.filter((item) => (showArchived ? item.archived : !item.archived) && (category === 'All' || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
      cards.forEach((card, index) => {
        const prompt = prompts[index]; card.style.display = prompt ? '' : 'none'; if (!prompt) return;
        textLeaf(card.querySelector('[data-name="Heading / H4 20px"]'), prompt.name);
        textLeaf(card.querySelector('[data-name="Body / Extra Small 12px"]'), prompt.description);
        const badges = card.querySelectorAll('[data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12"]'); textLeaf(badges[0], prompt.category === 'Design' ? 'DESIGN STUDIO' : prompt.category.toUpperCase()); textLeaf(badges[1], prompt.useType.toUpperCase());
        const pencil = card.querySelector('[data-name="pencil"]'); if (pencil) pencil.onclick = (event) => { event.preventDefault(); openPromptEditor(prompt); };
        const copyButton = card.querySelector('[data-name="copy"]'); if (copyButton) copyButton.onclick = () => { const copy = { ...prompt, id: Core.id('prompt'), name: `${prompt.name} Copy`, createdAt: Core.now(), updatedAt: Core.now() }; state.prompts.unshift(copy); save(); render(); };
        const archiveButton = card.querySelector('[data-name="bin"]'); if (archiveButton) archiveButton.onclick = () => { prompt.archived = true; prompt.updatedAt = Core.now(); save(); render(); };
      });
    };
    const search = document.querySelector('[data-name="search-bar"]'); search?.addEventListener('click', () => { const value = window.prompt('Search prompts', query); if (value === null) return; query = value; textLeaf(search, query || 'Search Prompts'); render(); });
    const filter = [...document.querySelectorAll('[data-name="photography-input"], [data-name="field"]')].find((node) => node.textContent.includes('All categories'));
    filter?.addEventListener('click', () => { const value = window.prompt('Filter: All, Photography, Design, General', category); if (!['All', 'Photography', 'Design', 'General'].includes(value)) return; category = value; textLeaf(filter, category === 'All' ? 'All categories' : category); render(); });
    buttonWithText('SHOW ARCHIVE')?.addEventListener('click', (event) => { showArchived = !showArchived; textLeaf(event.currentTarget, showArchived ? 'SHOW ACTIVE' : 'SHOW ARCHIVE'); render(); });
    buttonWithText('ADD PROMPT')?.addEventListener('click', () => { const name = window.prompt('Prompt name'); if (!name?.trim()) return; const categoryValue = window.prompt('Category: Photography, Design, or General', 'General'); const useType = window.prompt('Use type: Feedback, Compare, or Both', 'Feedback'); const description = window.prompt('Short description', '') || ''; const body = window.prompt('Prompt body', '') || ''; if (!['Photography', 'Design', 'General'].includes(categoryValue) || !['Feedback', 'Compare', 'Both'].includes(useType)) return; state.prompts.unshift({ id: Core.id('prompt'), name: name.trim(), category: categoryValue, useType, description, body, systemNote: '', archived: false, createdAt: Core.now(), updatedAt: Core.now() }); save(); render(); });
    render();
  }

  function attachPromptEditor() {
    const prompt = state.prompts.find((item) => item.id === new URLSearchParams(location.search).get('prompt')) || state.prompts.find((item) => !item.archived);
    if (!prompt) { location.replace('prompts-all.html'); return; }
    const fields = [...document.querySelectorAll('[data-name="Form / Field"]')];
    const name = fields[0]; const category = fields[1]; const useType = fields[2]; const description = fields[3]; const body = fields[4]; const systemNote = fields[5];
    const values = [[name, prompt.name], [category, prompt.category], [useType, prompt.useType], [description, prompt.description], [body, prompt.body], [systemNote, prompt.systemNote || '']];
    values.forEach(([field, value]) => { textLeaf(field, value); const leaf = field?.querySelector('span:last-child'); if (leaf) { leaf.contentEditable = 'true'; leaf.setAttribute('role', 'textbox'); } });
    const read = (field) => field?.querySelector('span:last-child')?.textContent.trim() || '';
    buttonWithText('SAVE PROMPT')?.addEventListener('click', () => { const nextCategory = read(category); const nextUseType = read(useType); if (!read(name) || !['Photography', 'Design', 'General'].includes(nextCategory) || !['Feedback', 'Compare', 'Both'].includes(nextUseType)) return; Object.assign(prompt, { name: read(name), category: nextCategory, useType: nextUseType, description: read(description), body: read(body), systemNote: read(systemNote), updatedAt: Core.now() }); save(); location.href = 'prompts-all.html'; });
    const archive = [...document.querySelectorAll('[data-name="Label"]')].find((node) => node.textContent.trim() === 'ARCHIVE'); archive?.addEventListener('click', () => { prompt.archived = !prompt.archived; prompt.updatedAt = Core.now(); save(); textLeaf(archive, prompt.archived ? 'UNARCHIVE' : 'ARCHIVE'); });
  }

  function updateFeedbackChat(session) {
    const source = sourceFor(session);
    textLeaf(document.querySelector('[data-name="header-title"]'), session.title);
    const fileBox = document.querySelector('[data-name="Feedback / File"]');
    if (source?.dataUrl) { fileBox.style.backgroundImage = `url("${source.dataUrl}")`; fileBox.style.backgroundSize = 'cover'; fileBox.style.backgroundPosition = 'center'; }
    textLeaf(document.querySelector('[data-name="photography-input"]'), session.sourceType);
    textLeaf(document.querySelector('[data-name="prompt-selector"]'), session.promptName);
    const response = document.querySelector('[data-name="Form / Field"]');
    textLeaf(response?.querySelector('[data-name="heading"]'), 'FIRST READ');
    markdownLeaf(response?.querySelector('[data-name="output text"]'), session.initialResponse || 'No response saved.');
    const thread = document.querySelector('[data-name="Chat / Thread"]');
    const user = thread?.querySelector('[data-name="message-user"]');
    const assistant = thread?.querySelector('[data-name="message-assistant"]');
    const lastUser = [...session.chatMessages].reverse().find((message) => message.role === 'user');
    const lastAssistant = [...session.chatMessages].reverse().find((message) => message.role === 'assistant');
    if (user) user.style.display = lastUser ? '' : 'none';
    if (assistant) assistant.style.display = lastAssistant ? '' : 'none';
    if (lastUser) textLeaf(user, lastUser.content);
    if (lastAssistant) markdownLeaf(assistant, lastAssistant.content);
  }

  function attachFeedbackChat() {
    const session = activeFeedback();
    if (!session) { location.replace('director-new-feedback.html'); return; }
    updateFeedbackChat(session);
    buttonWithText('NEW FEEDBACK')?.addEventListener('click', () => { location.href = 'director-new-feedback.html'; });
    const editor = document.querySelector('[data-name="prompt-text"]');
    const send = document.querySelector('[data-name="enter-button"]');
    if (!editor || !send) return;
    editor.contentEditable = 'true'; editor.setAttribute('role', 'textbox'); editor.setAttribute('aria-label', 'Ask Director');
    const submitMessage = async () => {
      const content = editor.textContent.trim(); if (!content) return;
      const model = session.model || state.settings.feedbackModel || state.settings.visionModel;
      if (!model) return;
      session.chatMessages.push({ role: 'user', content, createdAt: Core.now() });
      editor.textContent = 'DIRECTOR IS READING…';
      try {
        const prompt = state.prompts.find((item) => item.id === session.promptId);
        const messages = [...imageMessage(session.source, prompt?.body || session.promptName), { role: 'assistant', content: session.initialResponse }, ...session.chatMessages.map((message) => ({ role: message.role, content: message.content }))];
        const response = await Logic.requestCompletion(state.settings, model, messages);
        session.chatMessages.push({ role: 'assistant', content: response, createdAt: Core.now() }); session.updatedAt = Core.now(); save();
        editor.textContent = ''; updateFeedbackChat(session);
      } catch (_) {
        session.chatMessages.push({ role: 'assistant', content: 'REQUEST FAILED', createdAt: Core.now() }); session.updatedAt = Core.now(); save(); editor.textContent = ''; updateFeedbackChat(session);
      }
    };
    send.addEventListener('click', submitMessage);
    editor.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitMessage(); } });
  }

  function attachFeedbackDetail() {
    const session = activeFeedback(); if (!session) { location.replace('darkroom-library.html'); return; }
    updateFeedbackChat(session);
    const back = [...document.querySelectorAll('a')].find((node) => node.textContent.includes('BACK TO DARKROOM'));
    if (back) back.href = session.library === 'design' ? 'darkroom-library.html?library=design' : 'darkroom-library.html';
    const heading = [...document.querySelectorAll('[data-name="UI / Section Title"]')].find((node) => node.textContent.includes('FEEBACK'));
    textLeaf(heading, 'FEEDBACK');
    const editor = document.querySelector('[data-name="prompt-text"]'); const send = document.querySelector('[data-name="enter-button"]');
    if (!editor || !send) return;
    editor.contentEditable = 'true'; editor.setAttribute('role', 'textbox'); editor.setAttribute('aria-label', 'Ask Director');
    send.addEventListener('click', () => { location.href = `director-feedback-chat.html?session=${encodeURIComponent(session.id)}`; });
  }

  function attachQuickView() {
    const session = activeFeedback(); if (!session) { location.replace('darkroom-library.html'); return; }
    const source = sourceFor(session);
    textLeaf(document.querySelector('[data-name="side-drawer-header"]'), session.title);
    const preview = document.querySelector('[data-name="preview-image"]'); if (preview && source?.dataUrl) { preview.style.backgroundImage = `url("${source.dataUrl}")`; preview.style.backgroundSize = 'cover'; preview.style.backgroundPosition = 'center'; }
    const prompt = state.prompts.find((item) => item.id === session.promptId);
    textLeaf(document.querySelector('[data-name="prompt-reply"]'), prompt?.body || session.promptName);
    const response = document.querySelector('[data-name="Form / Field"]'); textLeaf(response?.querySelector('[data-name="heading"]'), 'FIRST READ'); markdownLeaf(response?.querySelector('[data-name="output text"]'), session.initialResponse || 'No response saved.');
    buttonWithText('VIEW FEEDBACK')?.addEventListener('click', () => { state.activeFeedbackId = session.id; save(); location.href = `feedback-detail.html?session=${encodeURIComponent(session.id)}`; });
    document.querySelector('[data-name="button-close"]')?.addEventListener('click', (event) => { event.preventDefault(); location.href = session.projectId ? `projects-detail-feedback.html?project=${encodeURIComponent(session.projectId)}` : (session.library === 'design' ? 'darkroom-library.html?library=design' : 'darkroom-library.html'); });
  }

  function attachLibrary() {
    const library = new URLSearchParams(location.search).get('library') === 'design' ? 'design' : 'photography';
    const isDesign = library === 'design';
    setLibraryNavigationState(isDesign);
    if (isDesign) {
      textLeaf(document.querySelector('[data-name="header-title"]'), 'Design Studio');
      const eyebrow = [...document.querySelectorAll('[data-name="LABEL-ALT/MD/Regular/11px/19"]')].find((node) => node.textContent.includes('DIRECTOR / DARKROOM'));
      textLeaf(eyebrow, 'DIRECTOR / DESIGN STUDIO');
    }
    const records = [...state.feedbackSessions, ...state.compareSessions].filter((session) => session.library === library).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    const description = [...document.querySelectorAll('[data-name="Body / Extra Small 12px"]')].find((node) => node.textContent.includes('Saved photography'));
    textLeaf(description, records.length ? `Saved ${isDesign ? 'design' : 'photography'} feedback and comparisons.` : `No saved ${isDesign ? 'design' : 'photography'} feedback or comparisons.`);
    const cards = [...document.querySelectorAll('[data-name="feedback-list"] > [data-name="UI / File Thumb"]')];
    cards.forEach((card, index) => {
      const session = records[index]; card.style.display = session ? '' : 'none'; if (!session) return;
      const source = sourceFor(session); const image = card.querySelector('[data-name="UI / Image"]');
      if (image && source?.dataUrl) { image.style.backgroundImage = `url("${source.dataUrl}")`; image.style.backgroundSize = 'cover'; image.style.backgroundPosition = 'center'; }
      textLeaf(card.querySelector('[data-name="Label / Medium 13px"]'), session.title);
      const badgeLabels = card.querySelectorAll('[data-name="LABEL-ALT/XS/Semi-Bold/9.6px/12"]');
      textLeaf(badgeLabels[0], isDesign ? 'DESIGN' : 'FOTO'); textLeaf(badgeLabels[1], session.sourceItems ? 'COMPARE' : 'FEEDBACK');
      textLeaf(card.querySelector('[data-name="date-created"]'), dateLabel(session.updatedAt || session.createdAt));
      card.href = session.sourceItems ? `compare-result.html?session=${encodeURIComponent(session.id)}` : `feedback-detail.html?session=${encodeURIComponent(session.id)}`;
      card.addEventListener('click', () => { if (session.sourceItems) state.activeCompareId = session.id; else state.activeFeedbackId = session.id; save(); });
    });
    buttonWithText('ADD NEW FEEDBACK')?.addEventListener('click', () => { location.href = 'director-new-feedback.html'; });
  }

  applyRuntimeTerminology();
  syncModelBar();
  attachDesignStudioNavigation();
  if (location.pathname.endsWith('settings-models.html')) attachModelSettings();
  if (location.pathname.endsWith('settings-personalisation.html')) attachPersonalisationSettings();
  if (location.pathname.endsWith('settings-appearance.html')) attachAppearanceSettings();
  if (location.pathname.endsWith('director-new-feedback.html')) attachNewFeedback();
  if (location.pathname.endsWith('director-new-compare.html')) attachNewCompare();
  if (location.pathname.endsWith('director-feedback-chat.html')) attachFeedbackChat();
  if (location.pathname.endsWith('feedback-detail.html') || location.pathname.endsWith('darkroom-feedback-chat.html')) attachFeedbackDetail();
  if (location.pathname.endsWith('compare-result.html')) attachCompareResult();
  if (location.pathname.endsWith('director-compare.html')) attachCompareFixture();
  if (location.pathname.endsWith('darkroom-quick-view.html') || location.pathname.endsWith('projects-quick-view.html')) attachQuickView();
  if (location.pathname.endsWith('darkroom-library.html')) attachLibrary();
  if (location.pathname.endsWith('projects-all.html')) attachProjectsAll();
  if (location.pathname.endsWith('projects-detail-overview.html')) attachProjectOverview();
  if (location.pathname.endsWith('projects-detail-feedback.html')) attachProjectFeedback();
  if (location.pathname.endsWith('prompts-all.html')) attachPromptLibrary();
  if (location.pathname.endsWith('prompts-edit.html')) attachPromptEditor();
})();
