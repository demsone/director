export type Domain = 'photography' | 'design';
export type RecordKind = 'feedback' | 'compare';
export type Message = { id: string; role: 'user' | 'assistant'; text: string; createdAt: string };
export type Source = { id: string; name: string; type: string; preview?: string; size?: number };

export type Project = {
  id: string; title: string; type: string; description: string; createdAt: string; updatedAt: string;
};
export type Prompt = {
  id: string; name: string; category: string; useType: 'feedback' | 'compare' | 'both'; description: string;
  body: string; systemNote?: string; archived: boolean; createdAt: string; updatedAt: string;
};
export type FeedbackRecord = {
  id: string; kind: 'feedback'; domain: Domain; title: string; source: Source; prompt: string;
  promptId?: string; model: string; projectId?: string; result: string; favourite: boolean;
  chat: Message[]; createdAt: string; updatedAt: string;
};
export type CompareRecord = {
  id: string; kind: 'compare'; domain: Domain; title: string; sources: Source[]; prompt: string;
  promptId?: string; model: string; projectId?: string; result: string; recommendations: string[];
  favourite: boolean; chat: Message[]; createdAt: string; updatedAt: string;
};
export type DirectorRecord = FeedbackRecord | CompareRecord;
export type Settings = {
  feedbackModel: string; compareModel: string; visionModel: string; serverUrl: string;
  baseStyle: 'Professional' | 'Friendly' | 'Candid'; warmth: 'Less' | 'Neutral' | 'More';
  fastAnswers: boolean; customInstructions: string; theme: 'Director'; accent: 'Orange';
};
export type PersistedState = { version: 2; projects: Project[]; prompts: Prompt[]; records: DirectorRecord[]; settings: Settings };

export const defaultSettings: Settings = {
  feedbackModel: '', compareModel: '', visionModel: '', serverUrl: 'http://127.0.0.1:1234',
  baseStyle: 'Professional', warmth: 'Neutral', fastAnswers: false, customInstructions: '', theme: 'Director', accent: 'Orange',
};

export const now = () => new Date().toISOString();
export const id = () => crypto.randomUUID();
export const emptyState = (): PersistedState => ({ version: 2, projects: [], prompts: [], records: [], settings: { ...defaultSettings } });
