import type { Settings, Source } from './domain';

const endpoint = (base: string, suffix: string) => {
  const localDevelopmentProxy = typeof window !== 'undefined' && /^(http:\/\/)?(127\.0\.0\.1|localhost):1234\/?$/.test(base.trim());
  return localDevelopmentProxy ? `/director-runtime${suffix}` : `${base.replace(/\/$/, '')}${suffix}`;
};
export async function getModels(settings: Settings): Promise<string[]> {
  const response = await fetch(endpoint(settings.serverUrl, '/v1/models'));
  if (!response.ok) throw new Error(`Connection failed (${response.status})`);
  const body = await response.json() as { data?: { id?: string }[] };
  return (body.data || []).map((model) => model.id).filter((model): model is string => Boolean(model));
}
export async function requestDirector(settings: Settings, model: string, purpose: 'feedback' | 'compare' | 'chat', prompt: string, sources: Source[], history: { role: 'user' | 'assistant'; text: string }[] = []) {
  if (!settings.serverUrl || !model) throw new Error('Configure the local server URL and a model in Settings before running Director.');
  const sourceList = sources.map((source, index) => `${index + 1}. ${source.name} (${source.type})`).join('\n');
  const system = `You are Director, a precise creative reviewer. Respond in a concise, practical voice. Style: ${settings.baseStyle}; warmth: ${settings.warmth}. ${settings.customInstructions}`;
  const task = purpose === 'compare' ? `Compare these ${sources.length} sources and finish with a numbered recommendation order.\n${sourceList}\n\n${prompt}` : purpose === 'feedback' ? `Review this source:\n${sourceList}\n\n${prompt}` : prompt;
  const imageParts = settings.visionModel && model === settings.visionModel ? sources.filter((source) => source.preview?.startsWith('data:image/')).map((source) => ({ type: 'image_url', image_url: { url: source.preview } })) : [];
  const content = imageParts.length ? [{ type: 'text', text: task }, ...imageParts] : task;
  const messages = [{ role: 'system', content: system }, ...history.map((message) => ({ role: message.role, content: message.text })), { role: 'user', content }];
  const response = await fetch(endpoint(settings.serverUrl, '/v1/chat/completions'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages, stream: false }) });
  if (!response.ok) { const detail = await response.text(); throw new Error(`Director request failed (${response.status}): ${detail.slice(0, 240)}`); }
  const body = await response.json() as { choices?: { message?: { content?: string } }[] };
  const answer = body.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error('The model returned no readable response.');
  return answer;
}
