import { defaultSettings, emptyState, id, now, type DirectorRecord, type PersistedState, type Project, type Prompt } from './domain';

const key = 'director.v4.repository';
const parse = (raw: string | null): unknown => { try { return raw ? JSON.parse(raw) : undefined; } catch { return undefined; } };
const isState = (value: unknown): value is PersistedState => !!value && typeof value === 'object' && (value as { version?: unknown }).version === 2;

function migrateLegacy(): PersistedState {
  const state = emptyState();
  const legacyRecords = parse(localStorage.getItem('director_records'));
  const legacyProjects = parse(localStorage.getItem('director_projects'));
  const legacyPrompts = parse(localStorage.getItem('director_prompts'));
  const legacySettings = parse(localStorage.getItem('director_settings')) as Record<string, unknown> | undefined;
  if (Array.isArray(legacyProjects)) state.projects = legacyProjects.map((value) => {
    const item = value as Record<string, unknown>; const stamp = now();
    return { id: String(item.id || id()), title: String(item.title || 'Untitled project'), type: String(item.type || 'Project'), description: String(item.description || ''), createdAt: stamp, updatedAt: stamp };
  });
  if (Array.isArray(legacyPrompts)) state.prompts = legacyPrompts.map((value) => {
    const item = value as Record<string, unknown>; const stamp = now();
    return { id: String(item.id || id()), name: String(item.title || item.name || 'Untitled prompt'), category: String(item.category || 'General'), useType: 'both', description: String(item.description || ''), body: String(item.body || ''), systemNote: '', archived: Boolean(item.isArchived), createdAt: stamp, updatedAt: stamp };
  });
  if (Array.isArray(legacyRecords)) state.records = legacyRecords.map((value): DirectorRecord => {
    const item = value as Record<string, unknown>; const stamp = String(item.date || now()); const kind = item.type === 'compare' ? 'compare' : 'feedback';
    const chat = Array.isArray(item.chat) ? item.chat.map((message) => ({ id: id(), role: (message as { role?: unknown }).role === 'assistant' ? 'assistant' as const : 'user' as const, text: String((message as { text?: unknown }).text || ''), createdAt: stamp })) : [];
    const common = { id: String(item.id || id()), domain: 'photography' as const, title: String(item.title || 'Untitled'), prompt: String(item.prompt || ''), model: String(item.model || ''), projectId: typeof item.projectId === 'string' ? item.projectId : undefined, result: String(item.result || ''), favourite: Boolean(item.isFavourite), chat, createdAt: stamp, updatedAt: stamp };
    if (kind === 'compare') return { ...common, kind, sources: (Array.isArray(item.sourceImages) ? item.sourceImages : []).map((name) => ({ id: id(), name: String(name), type: 'Image' })), recommendations: [] };
    return { ...common, kind, source: { id: id(), name: String(item.sourceImage || 'Untitled source'), type: 'Image' } };
  });
  if (legacySettings) state.settings = { ...defaultSettings, feedbackModel: String(legacySettings.modelFeedback || ''), compareModel: String(legacySettings.modelCompare || ''), visionModel: String(legacySettings.modelVision || ''), serverUrl: String(legacySettings.localServerUrl || defaultSettings.serverUrl), baseStyle: legacySettings.baseStyle === 'friendly' ? 'Friendly' : legacySettings.baseStyle === 'candid' ? 'Candid' : 'Professional', warmth: legacySettings.warmth === 'more' ? 'More' : legacySettings.warmth === 'less' ? 'Less' : 'Neutral' };
  return state;
}

export const repository = {
  load(): PersistedState { const direct = parse(localStorage.getItem(key)); if (isState(direct)) return direct; const migrated = migrateLegacy(); if (migrated.projects.length || migrated.prompts.length || migrated.records.length) this.save(migrated); return migrated; },
  save(state: PersistedState) { localStorage.setItem(key, JSON.stringify({ ...state, version: 2 })); },
  update(state: PersistedState, patch: Partial<PersistedState>) { const next = { ...state, ...patch, version: 2 as const }; this.save(next); return next; },
  saveProject(state: PersistedState, draft: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) { const stamp = now(); const current = draft.id ? state.projects.find((project) => project.id === draft.id) : undefined; const project: Project = { ...draft, id: draft.id || id(), createdAt: current?.createdAt || stamp, updatedAt: stamp }; return this.update(state, { projects: current ? state.projects.map((entry) => entry.id === project.id ? project : entry) : [project, ...state.projects] }); },
  savePrompt(state: PersistedState, draft: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) { const stamp = now(); const current = draft.id ? state.prompts.find((prompt) => prompt.id === draft.id) : undefined; const prompt: Prompt = { ...draft, id: draft.id || id(), createdAt: current?.createdAt || stamp, updatedAt: stamp }; return this.update(state, { prompts: current ? state.prompts.map((entry) => entry.id === prompt.id ? prompt : entry) : [prompt, ...state.prompts] }); },
  saveRecord(state: PersistedState, record: DirectorRecord) { const exists = state.records.some((entry) => entry.id === record.id); return this.update(state, { records: exists ? state.records.map((entry) => entry.id === record.id ? record : entry) : [record, ...state.records] }); },
  deleteRecord(state: PersistedState, recordId: string) { return this.update(state, { records: state.records.filter((record) => record.id !== recordId) }); },
};
