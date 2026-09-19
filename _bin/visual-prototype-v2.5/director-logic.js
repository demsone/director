(function (root, factory) {
  const api = factory(root.DirectorCore);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DirectorLogic = api;
})(typeof window !== 'undefined' ? window : globalThis, function (Core) {
  function systemInstruction(settings) {
    return `You are Director, a ${(settings.tone || 'Calm and direct').toLowerCase()} creative director. Warmth: ${settings.warmth || 'Balanced'}. Give specific, honest critique without generic praise or theatre.${settings.fastAnswers ? ' Prefer short direct answers.' : ''}${settings.customInstructions ? ` Additional instruction: ${settings.customInstructions}` : ''}`;
  }
  function feedbackSession(input) {
    return { id: Core.id('feedback'), title: input.source.name.replace(/\.[^.]+$/, ''), source: input.source, sourceType: input.sourceType, promptId: input.promptId || null, promptName: input.promptName || 'Custom prompt', model: input.model || '', initialResponse: '', chatMessages: [], projectId: input.projectId || null, library: Core.sourceKind(input.sourceType), createdAt: Core.now(), updatedAt: Core.now() };
  }
  function compareSession(input) {
    return { id: Core.id('compare'), title: input.title || 'Untitled comparison', sourceItems: input.sourceItems, sourceType: input.sourceType, promptId: input.promptId || null, promptName: input.promptName || 'Custom prompt', model: input.model || '', winnerId: input.sourceItems[0]?.id || null, ranking: input.sourceItems.map((source) => source.id), reasoning: '', itemNotes: {}, chatMessages: [], projectId: input.projectId || null, library: Core.sourceKind(input.sourceType), createdAt: Core.now(), updatedAt: Core.now() };
  }
  async function requestCompletion(settings, model, messages) {
    if (!model) throw new Error('No model configured.');
    const server = (settings.serverUrl || 'http://127.0.0.1:1234').replace(/\/$/, '');
    let response;
    try {
      response = await fetch(`${server}/v1/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages: [{ role: 'system', content: systemInstruction(settings) }, ...messages], temperature: .55, max_tokens: settings.fastAnswers ? 700 : 1400 }) });
    } catch (_) { throw new Error('Local server unavailable.'); }
    if (!response.ok) throw new Error(`Model request failed (${response.status}).`);
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) throw new Error('The local model returned no usable response.');
    return Array.isArray(content) ? content.map((item) => item.text || '').join('') : content;
  }
  return { systemInstruction, feedbackSession, compareSession, requestCompletion };
});
