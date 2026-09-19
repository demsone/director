import { AppError } from './core.mjs';

export function createModelClient({ baseUrl = process.env.LM_STUDIO_URL || 'http://127.0.0.1:1234', token = process.env.LM_STUDIO_TOKEN, timeoutMs = 240000 } = {}) {
  const url = new URL(baseUrl);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.protocol !== 'http:' || url.username || url.password || url.pathname !== '/') throw new Error('LM_STUDIO_URL must be a local HTTP server origin.');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  async function request(path, body, signal) {
    let response;
    try {
      response = await fetch(new URL(path, url), { method: body ? 'POST' : 'GET', headers, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.any([AbortSignal.timeout(body ? timeoutMs : 5000), ...(signal ? [signal] : [])]) });
    } catch (error) {
      if (signal?.aborted) throw new AppError('Request cancelled.', 499);
      if (error.name === 'TimeoutError') throw new AppError('The local model timed out. Your image and conversation are unchanged; retry when LM Studio is ready.', 504);
      throw new AppError('Cannot reach LM Studio. Start its local server, load a vision model, then refresh models.', 503);
    }
    let data;
    try { data = await response.json(); } catch { throw new AppError('LM Studio returned an unreadable response.', 502); }
    if (!response.ok) {
      const detail = typeof data.error === 'string' ? data.error : data.error?.message || data.message || response.statusText;
      throw new AppError(`LM Studio: ${detail}. No conversation turns were removed. If the context is full, increase the model context in LM Studio or start a new critique.`, 502);
    }
    return data;
  }
  async function models(signal) {
    const data = await request('/api/v1/models', null, signal);
    if (!Array.isArray(data.models)) throw new AppError('LM Studio model discovery is unavailable. This build requires its /api/v1/models endpoint.', 502);
    return data.models.filter(m => m.type === 'llm' && m.capabilities?.vision === true).flatMap(m => (m.loaded_instances || []).map(instance => ({ id: instance.id, name: m.display_name, contextLength: instance.config?.context_length })));
  }
  async function complete({ model, messages, format, signal }) {
    const loaded = (await models(signal)).find(m => m.id === model);
    if (!loaded) throw new AppError(`The saved or selected vision model (${model}) is not loaded. Load this model in LM Studio, then refresh models. Your saved session is unchanged.`, 409);
    const data = await request('/v1/chat/completions', { model, messages, stream: false, temperature: 0.35, max_tokens: format ? 2400 : 1200, ...(format ? { response_format: format } : {}) }, signal);
    const choice = data.choices?.[0];
    const raw = choice?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) throw new AppError('The model returned no final answer. It may have exhausted its budget on reasoning. Disable thinking in LM Studio and retry.', 502);
    if (choice.finish_reason !== 'stop') throw new AppError(`The model response was incomplete (${choice.finish_reason || 'unknown reason'}). Retry with a larger model context or a shorter question.`, 502, { raw });
    return { raw, usage: data.usage || null, model: data.model || model, modelInfo: { provider: 'LM Studio', requestedModel: model, responseModel: data.model || model, name: loaded.name, contextLength: loaded.contextLength, temperature: 0.35, maxTokens: format ? 2400 : 1200 } };
  }
  return { models, complete };
}
