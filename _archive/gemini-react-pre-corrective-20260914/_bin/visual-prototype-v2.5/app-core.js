(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DirectorCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const STORAGE_KEY = 'director-v2-5-state';
  const now = () => new Date().toISOString();
  const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const prompt = (name, category, useType, description, body) => ({ id: id('prompt'), name, category, useType, description, body, systemNote: '', archived: false, createdAt: now(), updatedAt: now() });
  const promptSeeds = () => [
    prompt('Full Photography Critique', 'Photography', 'Feedback', 'A complete creative-direction read of one photograph.', `Review this photograph as a creative director and photography editor.

Cover:

1. First impression
2. What works
3. What feels weak or unresolved
4. Composition, framing, gesture, and timing
5. Light, contrast, colour, tone, or black-and-white treatment
6. Crop or edit suggestions
7. Print potential
8. Possible series connection
9. Three possible titles
10. Tags or keywords

End with one short, direct human note to Diego.

Keep the tone balanced: honest, specific, useful, and not generic.`),
    prompt('Street Photography Read', 'Photography', 'Feedback', 'For street images, human scenes, timing, gesture, and urban observation.', `Review this as a street photograph.

Focus on:

* timing
* gesture
* human presence
* tension or humour
* spatial layering
* background behaviour
* framing
* accident versus intention
* whether the image feels alive

Tell me whether the photograph has street-photography strength or whether it is only visually interesting.

Suggest one crop or edit if needed.

End with a clear keep / maybe / reject recommendation.`),
    prompt('Print Potential', 'Photography', 'Feedback', 'Judges whether an image has enough strength to become a print.', `Assess this photograph as a potential fine-art print.

Consider:

* wall appeal
* tonal strength
* composition
* emotional charge
* originality
* durability over time
* whether it gets better with repeated viewing
* whether it suits small, medium, or large print

Give a clear rating:

* Strong print candidate
* Possible print candidate
* Archive only
* Reject

Explain the decision plainly.

Suggest a title if it feels print-worthy.`),
    prompt('Class A / B / Archive Selector', 'Photography', 'Feedback', 'Sorts a photograph into a practical editing class.', `Classify this photograph for editing and archive purposes.

Use this scale:

Class A: strong image, serious candidate for print, portfolio, book, or exhibition.
Class B: good image, useful for series/context, but not a standalone hero.
Archive: keep for record, reference, contact-sheet memory, or future use.
Reject: not worth keeping in the working edit.

Judge based on:

* composition
* moment
* light
* subject
* emotional charge
* originality
* series value
* print value

Return:

* classification
* reason
* strongest element
* weakest element
* suggested next action

Be direct.`),
    prompt('Sequence Builder', 'Photography', 'Compare', 'Helps choose and order images for a photo sequence.', `Review these images as a possible sequence.

Assess:

* opening strength
* rhythm
* repetition
* visual variety
* emotional arc
* tonal consistency
* subject relationships
* weak links
* best ending image

Recommend:

1. strongest sequence order
2. any images to remove
3. any images that feel redundant
4. the best opening image
5. the best closing image

Explain the sequence logic clearly.`),
    prompt('Final Image Selector', 'Photography', 'Compare', 'Chooses the strongest image from similar options.', `Compare these photographs and choose the strongest final image.

Focus on:

* composition
* timing
* expression or gesture
* clarity
* emotional impact
* print potential
* whether one image has a stronger centre of gravity
* whether any option feels redundant or weaker

Return:

* winner
* ranking
* reason for the winner
* reason each other image lost
* suggested final edit for the winner

Be decisive.`),
    prompt('Colour Where It Lives', 'Photography', 'Feedback', 'For colour photography where colour, place, and atmosphere matter.', `Review this as a colour photograph.

Focus on:

* colour relationships
* atmosphere
* place
* visual temperature
* emotional tone
* whether colour is carrying meaning or only decoration
* how the palette affects the photograph
* whether the colour treatment feels natural, heightened, nostalgic, harsh, or quiet

Suggest:

* whether the colour should be preserved, softened, intensified, or corrected
* whether the image belongs in a colour series
* possible tags
* one possible title

Keep the feedback visual and specific.`),
    prompt('Black and White Edit', 'Photography', 'Feedback', 'For monochrome conversion, contrast, tone, and print direction.', `Review this photograph as a black-and-white image.

Focus on:

* tonal range
* contrast
* blacks
* highlights
* midtones
* texture
* form
* separation
* mood
* print depth

Tell me:

* whether black and white strengthens the image
* whether the contrast should be softer or harder
* whether the image needs cropping
* whether it has print potential

Give one practical editing direction.`),
    prompt('Contact Sheet Triage', 'Photography', 'Compare', 'Quickly sorts multiple images from a shoot or contact sheet.', `Review these images as a contact-sheet selection.

Sort them into:

* strongest
* possible
* archive
* reject

For each strong or possible image, explain why.

Identify:

* repeated frames
* near-duplicates
* missed moments
* hidden gems
* images worth editing further

Be practical and decisive.`),
    prompt('Title and Series Finder', 'Photography', 'Feedback', 'Generates titles, themes, and possible series connections.', `Look at this photograph and suggest how it could be titled or grouped.

Return:

* five possible titles
* three possible series names
* visual themes
* emotional themes
* subject tags
* whether it connects to street, protest, colour, black-and-white, night, abstraction, or documentary work

Do not be cheesy.

Prefer titles that are restrained, photographic, and slightly poetic.`),
    prompt('Full Design Critique', 'Design', 'Feedback', 'A complete creative-direction review of one design.', `Review this design as a senior creative director and product/design critic.

Cover:

1. First impression
2. What works
3. What feels weak or unresolved
4. Layout and hierarchy
5. Typography
6. Colour and contrast
7. Spacing and rhythm
8. Component consistency
9. Usability and clarity
10. Suggested next improvements

End with a clear recommendation:

* ship
* refine
* rethink
* reject

Keep the critique specific, practical, and visually grounded.`),
    prompt('UI Screen Review', 'Design', 'Feedback', 'Reviews an app or website screen for usability, hierarchy, and visual coherence.', `Review this UI screen.

Focus on:

* hierarchy
* user intent
* layout clarity
* spacing
* alignment
* density
* typography
* contrast
* interaction cues
* component consistency
* what the user should notice first

Identify:

* what works
* what is confusing
* what feels overdesigned
* what feels unfinished
* what should be simplified

Give practical fixes, not vague design advice.`),
    prompt('Anti-Generic UI Check', 'Design', 'Feedback', 'Detects generic AI/SaaS visual clichés and suggests a stronger direction.', `Review this design for generic UI problems.

Look for:

* SaaS dashboard clichés
* bland AI product styling
* unnecessary cards
* weak hierarchy
* decorative noise
* generic gradients
* meaningless icons
* fake depth
* overused layouts
* design that feels like a template

Tell me what feels generic and what feels specific.

Suggest how to make it more distinct while keeping it restrained, usable, and practical.`),
    prompt('Layout and Hierarchy Pass', 'Design', 'Feedback', 'Focuses only on layout structure and visual priority.', `Review this design only for layout and hierarchy.

Ignore branding unless it affects clarity.

Assess:

* primary focal point
* secondary information
* grouping
* spacing
* alignment
* scan path
* density
* balance
* empty space
* whether the layout supports the user's task

Return:

* what the eye sees first
* where the hierarchy breaks
* what should be moved, removed, enlarged, reduced, or grouped
* one cleaner layout recommendation

Be precise.`),
    prompt('Typography Review', 'Design', 'Feedback', 'Reviews type choices, scale, hierarchy, readability, and tone.', `Review the typography in this design.

Focus on:

* font choice
* type scale
* weight
* hierarchy
* line height
* letter spacing
* readability
* label clarity
* density
* whether the type matches the product tone

Identify:

* strongest typographic decision
* weakest typographic decision
* any spacing or hierarchy issues
* any text that should be shorter or clearer

Suggest practical corrections.`),
    prompt('Design System Consistency Check', 'Design', 'Feedback', 'Checks whether a screen follows an existing design system.', `Review this design for design-system consistency.

Look for:

* inconsistent spacing
* inconsistent radius
* inconsistent button styles
* inconsistent card styles
* inconsistent typography
* inconsistent icon sizes
* inconsistent borders
* inconsistent colour usage
* one-off components
* places where the system is being stretched too far

Return:

* what is consistent
* what is inconsistent
* what should become reusable
* what should be simplified
* what should be removed

Do not suggest a new design system. Work with what is already visible.`),
    prompt('Product Surface Read', 'Design', 'Feedback', 'Reviews whether the product surface communicates the right purpose and mood.', `Review this product surface.

Tell me:

* what kind of product it feels like
* what mood it creates
* what level of trust it gives
* whether it feels native, webby, experimental, editorial, technical, playful, premium, cheap, calm, or noisy
* whether the interface matches the likely user task

Assess:

* visual tone
* interaction confidence
* information density
* product personality
* whether the surface feels intentional

Suggest one direction to strengthen it.`),
    prompt('Mockup Comparison', 'Design', 'Compare', 'Compares 2–6 design mockups and chooses the strongest direction.', `Compare these design mockups and choose the strongest direction.

Assess:

* clarity
* hierarchy
* usability
* visual strength
* originality
* fit for the brief
* scalability
* design-system consistency
* production practicality

Return:

* winner
* ranked order
* why the winner works best
* why the other options are weaker
* risks in the winning option
* what to improve before finalising

Be decisive and practical.`),
    prompt('Brief Fit Check', 'Design', 'Feedback', 'Checks whether a design answers the intended brief.', `Review this design against the intended brief.

Focus on:

* whether the design solves the stated problem
* whether the visual direction matches the goal
* whether the hierarchy supports the message
* whether anything feels off-brief
* whether the design is trying to do too much
* what should be clarified before production

Return:

* brief fit: strong / partial / weak
* reason
* strongest alignment
* weakest alignment
* recommended next change

If the brief is missing, ask for the brief context in the response.`),
    prompt('Production Handoff Review', 'Design', 'Feedback', 'Checks whether a design is ready for Codex/dev handoff.', `Review this design for production handoff.

Look for:

* unclear layout
* missing states
* missing empty states
* missing error states
* inconsistent components
* ambiguous labels
* naming issues
* unclear interactions
* responsive concerns
* anything a developer or coding agent may misinterpret

Return:

* ready / not ready
* blockers
* risks
* missing states
* implementation notes
* suggested handoff wording

Be strict. The goal is to prevent bad implementation.`),
    prompt('Quick Creative Direction', 'General', 'Both', 'A shorter general-purpose critique.', `Give a quick creative-direction read.

Tell me:

* what works
* what does not work
* what feels most important
* what to change next

Keep it short, honest, and useful.`),
    prompt('Brutally Practical Pass', 'General', 'Both', 'A direct, no-fluff critique for when the user wants a decision.', `Give me a brutally practical critique.

Do not flatter.

Tell me:

* what is strong
* what is weak
* what is confusing
* what should be removed
* what should be improved
* whether this is worth continuing

End with a clear recommendation.`),
    prompt('Gentle Review', 'General', 'Both', 'A softer critique when the user wants useful feedback without harshness.', `Review this gently but honestly.

Tell me:

* what is working
* what has potential
* what feels unresolved
* what I should try next

Keep the tone supportive, but still specific.`)
  ];
  function freshState() {
    return { version: 1, feedbackSessions: [], compareSessions: [], projects: [], prompts: promptSeeds(), settings: { feedbackModel: '', compareModel: '', visionModel: '', serverUrl: 'http://127.0.0.1:1234', tone: 'Calm and direct', warmth: 'Balanced', fastAnswers: false, customInstructions: '', appearance: 'Dark' } };
  }
  function normalize(value) {
    const base = freshState();
    if (!value || typeof value !== 'object') return base;
    return { ...base, ...value, feedbackSessions: Array.isArray(value.feedbackSessions) ? value.feedbackSessions : [], compareSessions: Array.isArray(value.compareSessions) ? value.compareSessions : [], projects: Array.isArray(value.projects) ? value.projects : [], prompts: Array.isArray(value.prompts) && value.prompts.length ? value.prompts : base.prompts, settings: { ...base.settings, ...(value.settings || {}) } };
  }
  function load(storage) {
    try { return normalize(JSON.parse(storage.getItem(STORAGE_KEY))); } catch (_) { return freshState(); }
  }
  function save(storage, state) { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return state; }
  function sourceKind(sourceType) { return sourceType === 'Design' ? 'design' : sourceType === 'Photography' ? 'photography' : 'general'; }
  function visiblePrompts(state, sourceType, useType) {
    return state.prompts.filter((item) => !item.archived && (item.category === sourceType || item.category === 'General' || (useType === 'Compare' && item.category === 'Compare')) && (item.useType === useType || item.useType === 'Both'));
  }
  function markdown(text) {
    const escape = String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const linked = escape.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, href) => `<a href="${href.replace(/"/g, '%22')}" target="_blank" rel="noreferrer">${label}</a>`);
    return linked
      .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
      .replace(/^[-*]\s+(.+)$/gm, '• $1')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  return { STORAGE_KEY, id, now, freshState, load, save, sourceKind, visiblePrompts, markdown };
});
