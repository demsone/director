import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  api, streamRequest, uid, titleFromFilename,
  type ChatMessage, type FileRef, type Project, type Prompt, type Recommendation, type Settings, type SourceType, type Status,
} from './api';

export type GenStatus = 'idle' | 'generating' | 'done' | 'error';

export interface FeedbackSession {
  sources: FileRef[];
  sourceType: SourceType;
  promptId: string | null;
  promptText: string;
  projectId: string | null;
  status: GenStatus;
  error: string;
  output: string;
  model: string;
  title: string;
  favourite: boolean;
  messages: ChatMessage[];
  recordId: string | null;
  chatModel: string;
  /** Snapshot of the session at its last save, used to detect unsaved changes. */
  saved?: string;
}

export interface CompareSession extends Omit<FeedbackSession, 'sourceType'> {
  sourceType: SourceType | null;
  recommendations: Recommendation[];
}

export const emptyFeedback = (): FeedbackSession => ({
  sources: [], sourceType: 'Photography', promptId: null, promptText: '', projectId: null, status: 'idle', error: '',
  output: '', model: '', title: '', favourite: false, messages: [], recordId: null, chatModel: '',
});

export const emptyCompare = (): CompareSession => ({ ...emptyFeedback(), sourceType: null, recommendations: [] });

interface ProjectModalState {
  project: Project | null;
  onSaved?: (p: Project) => void;
}

interface AppState {
  settings: Settings | null;
  updateSettings: (patch: Partial<Settings>) => Promise<Settings>;
  status: Status | null;
  refreshStatus: () => Promise<void>;
  prompts: Prompt[];
  reloadPrompts: () => Promise<void>;
  projects: Project[];
  reloadProjects: () => Promise<void>;
  feedback: FeedbackSession;
  setFeedback: (fn: (s: FeedbackSession) => FeedbackSession) => void;
  runFeedback: () => Promise<void>;
  compare: CompareSession;
  setCompare: (fn: (s: CompareSession) => CompareSession) => void;
  runCompare: () => Promise<void>;
  projectModal: ProjectModalState | null;
  openProjectModal: (project: Project | null, onSaved?: (p: Project) => void) => void;
  closeProjectModal: () => void;
}

const Ctx = createContext<AppState | null>(null);

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside provider');
  return v;
};

function loadDraft<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = { ...fallback, ...JSON.parse(raw) };
    // A generation that was interrupted by a reload cannot resume.
    if (v.status === 'generating') { v.status = v.output ? 'done' : 'idle'; }
    return v;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedback, setFeedbackState] = useState<FeedbackSession>(() => loadDraft('director.feedback', emptyFeedback()));
  const [compare, setCompareState] = useState<CompareSession>(() => loadDraft('director.compare', emptyCompare()));
  const [projectModal, setProjectModal] = useState<ProjectModalState | null>(null);
  const feedbackRef = useRef(feedback);
  const compareRef = useRef(compare);
  feedbackRef.current = feedback;
  compareRef.current = compare;

  const setFeedback = useCallback((fn: (s: FeedbackSession) => FeedbackSession) => {
    setFeedbackState((s) => {
      const next = fn(s);
      feedbackRef.current = next;
      return next;
    });
  }, []);
  const setCompare = useCallback((fn: (s: CompareSession) => CompareSession) => {
    setCompareState((s) => {
      const next = fn(s);
      compareRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    try { localStorage.setItem('director.feedback', JSON.stringify(feedback)); } catch { /* storage full */ }
  }, [feedback]);
  useEffect(() => {
    try { localStorage.setItem('director.compare', JSON.stringify(compare)); } catch { /* storage full */ }
  }, [compare]);

  const refreshStatus = useCallback(async () => {
    try { setStatus(await api.get<Status>('/api/status')); } catch { /* server unreachable */ }
  }, []);
  const reloadPrompts = useCallback(async () => setPrompts(await api.get<Prompt[]>('/api/prompts')), []);
  const reloadProjects = useCallback(async () => setProjects(await api.get<Project[]>('/api/projects')), []);

  useEffect(() => {
    api.get<Settings>('/api/settings').then(setSettings);
    reloadPrompts();
    reloadProjects();
    refreshStatus();
    const t = setInterval(refreshStatus, 20000);
    return () => clearInterval(t);
  }, [refreshStatus, reloadPrompts, reloadProjects]);

  useEffect(() => {
    if (settings?.accent) document.documentElement.style.setProperty('--accent', settings.accent);
  }, [settings?.accent]);

  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const next = await api.patch<Settings>('/api/settings', patch);
    setSettings(next);
    if ('endpoint' in patch || 'feedbackModel' in patch) refreshStatus();
    return next;
  }, [refreshStatus]);

  const promptById = useCallback((id: string | null) => prompts.find((p) => p.id === id) || null, [prompts]);

  const runFeedback = useCallback(async () => {
    const s = feedbackRef.current;
    if (!s.sources.length || s.status === 'generating') return;
    const prompt = promptById(s.promptId);
    setFeedback((x) => ({
      ...x, status: 'generating', error: '', output: '',
      title: x.recordId || x.title ? x.title || titleFromFilename(x.sources[0].filename) : titleFromFilename(x.sources[0].filename),
    }));
    try {
      const result = await streamRequest('/api/generate/feedback', {
        sourceIds: s.sources.map((f) => f.id),
        sourceType: s.sourceType,
        promptText: s.promptText,
        systemNote: prompt?.systemNote || '',
        model: s.chatModel || undefined,
      }, {
        onDelta: (d) => setFeedback((x) => ({ ...x, output: x.output + d })),
      });
      setFeedback((x) => ({ ...x, status: 'done', output: result.text, model: result.model, chatModel: x.chatModel || result.model }));
    } catch (e) {
      setFeedback((x) => ({ ...x, status: 'error', error: (e as Error).message }));
    }
  }, [promptById, setFeedback]);

  const runCompare = useCallback(async () => {
    const s = compareRef.current;
    if (s.sources.length < 2 || s.status === 'generating') return;
    const prompt = promptById(s.promptId);
    setCompare((x) => ({ ...x, status: 'generating', error: '' }));
    try {
      const result = await api.post<{ firstRead: string; ranking: Recommendation[]; model: string }>('/api/generate/compare', {
        sourceIds: s.sources.map((f) => f.id),
        sourceType: s.sourceType,
        promptText: s.promptText,
        systemNote: prompt?.systemNote || '',
        model: s.chatModel || undefined,
      });
      setCompare((x) => ({
        ...x, status: 'done', output: result.firstRead, recommendations: result.ranking, model: result.model,
        chatModel: x.chatModel || result.model,
      }));
    } catch (e) {
      setCompare((x) => ({ ...x, status: 'error', error: (e as Error).message }));
    }
  }, [promptById, setCompare]);

  const value = useMemo<AppState>(() => ({
    settings, updateSettings, status, refreshStatus, prompts, reloadPrompts, projects, reloadProjects,
    feedback, setFeedback, runFeedback, compare, setCompare, runCompare,
    projectModal,
    openProjectModal: (project, onSaved) => setProjectModal({ project, onSaved }),
    closeProjectModal: () => setProjectModal(null),
  }), [settings, updateSettings, status, refreshStatus, prompts, reloadPrompts, projects, reloadProjects, feedback, setFeedback,
    runFeedback, compare, setCompare, runCompare, projectModal]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export interface ChatContext {
  kind: 'feedback' | 'compare';
  sourceIds: string[];
  sourceType: string;
  promptText: string;
  systemNote?: string;
  output: string;
  recommendations?: Recommendation[];
}

/**
 * Sends the conversation to Ask Director and streams the reply into the message list.
 * `history` must end with the user's message.
 */
export async function sendChat(
  context: ChatContext,
  history: ChatMessage[],
  model: string,
  update: (fn: (msgs: ChatMessage[]) => ChatMessage[]) => void,
) {
  const replyId = uid();
  update(() => [...history, { id: replyId, role: 'assistant', content: '', model }]);
  const patch = (fn: (m: ChatMessage) => ChatMessage) => update((msgs) => msgs.map((m) => (m.id === replyId ? fn(m) : m)));
  try {
    const result = await streamRequest('/api/chat', { context, messages: history, model: model || undefined }, {
      onDelta: (d) => patch((m) => ({ ...m, content: m.content + d })),
    });
    patch((m) => ({ ...m, content: result.text, model: result.model, createdAt: new Date().toISOString() }));
  } catch (e) {
    patch((m) => ({ ...m, content: (e as Error).message, error: true }));
  }
}
