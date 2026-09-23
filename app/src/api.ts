export type SourceType = 'Photography' | 'Design';
export const SOURCE_TYPES: SourceType[] = ['Photography', 'Design'];

export interface Prompt {
  id: string;
  name: string;
  category: string;
  useType: string;
  description: string;
  body: string;
  systemNote: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileRef {
  id: string;
  filename: string;
  mime: string;
  size: number;
  hasPreview: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  createdAt?: string;
  error?: boolean;
}

export interface Recommendation {
  rank: number;
  source: number;
  reason: string;
}

export interface RecordItem {
  id: string;
  kind: 'feedback' | 'compare';
  title: string;
  sourceType: SourceType;
  promptId: string | null;
  promptName: string;
  promptBody: string;
  model: string;
  projectId: string | null;
  projectTitle: string | null;
  output: string;
  recommendations: Recommendation[];
  favourite: boolean;
  createdAt: string;
  updatedAt: string;
  sources: FileRef[];
  messages?: ChatMessage[];
}

export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  notes: string;
  favourite: boolean;
  createdAt: string;
  updatedAt: string;
  feedbackCount: number;
  compareCount: number;
  records?: RecordItem[];
}

export interface Settings {
  feedbackModel: string;
  compareModel: string;
  visionModel: string;
  endpoint: string;
  tone: string;
  warmth: string;
  fastAnswers: string;
  customInstructions: string;
  theme: string;
  accent: string;
}

export interface Status {
  online: boolean;
  provider: string;
  model: string;
  models: string[];
  endpoint: string;
  error?: string;
}

export interface StorageInfo {
  dataDir: string;
  databasePath: string;
  filesDir: string;
  feedback: number;
  comparisons: number;
  projects: number;
  prompts: number;
  files: number;
  filesBytes: number;
  dbBytes: number;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body ?? {}),
  patch: <T>(url: string, body?: unknown) => request<T>('PATCH', url, body ?? {}),
  del: <T>(url: string) => request<T>('DELETE', url),
};

export const fileUrl = (f: FileRef | string, preview = true) => {
  const id = typeof f === 'string' ? f : f.id;
  return `/files/${id}${preview ? '/preview' : ''}`;
};

/** Creates a downscaled JPEG used for thumbnails and as the model's copy of the source. */
async function makePreview(file: File): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.88));
  } catch {
    return null;
  }
}

export async function uploadSource(file: File): Promise<FileRef> {
  if (!file.type.startsWith('image/')) throw new Error('Source could not be read. Use an image file.');
  const preview = await makePreview(file);
  if (!preview) throw new Error('Source could not be read.');
  const res = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': file.type, 'x-filename': encodeURIComponent(file.name) },
    body: file,
  });
  const ref = await res.json();
  if (!res.ok) throw new Error(ref.error || 'Source could not be read.');
  await fetch(`/api/files/${ref.id}/preview`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: preview });
  return { ...ref, hasPreview: true };
}

export interface StreamHandlers {
  onDelta?: (text: string) => void;
  onReasoning?: (text: string) => void;
  signal?: AbortSignal;
}

/** POSTs to an SSE endpoint and resolves with the final text and model. */
export async function streamRequest(url: string, body: unknown, h: StreamHandlers = {}): Promise<{ text: string; model: string }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: h.signal,
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: { text: string; model: string } | null = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const chunk = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 2);
      if (!chunk.startsWith('data:')) continue;
      const msg = JSON.parse(chunk.slice(5));
      if (msg.error) throw new Error(msg.error);
      if (msg.delta) h.onDelta?.(msg.delta);
      if (msg.reasoning) h.onReasoning?.(msg.reasoning);
      if (msg.done) result = { text: msg.text, model: msg.model };
    }
  }
  if (!result) throw new Error('The response ended unexpectedly.');
  return result;
}

export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export function formatDate(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function titleFromFilename(name: string) {
  return name.replace(/\.[^.]+$/, '');
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
