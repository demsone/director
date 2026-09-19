# Director v4 — source and reuse notes

## Coverage

Read all 11 Figma pages, including Components, bin and the empty `---` page. The product specification is pages 01–08 plus Components. All 25 Build Contracts were read before implementation. The resulting 27 review views consist of 23 product-state entries, three Design Studio clones and one prompt-editor reference.

## Explicit reuse directives

- Design Studio Library, Quick View and Feedback Detail clone the Darkroom/canonical templates. Domain wording and the library's active navigation state change; the geometry and rendering components are shared. Contract `10005:3477` is the authority for these views.
- Darkroom Feedback Detail uses Director's canonical Feedback Detail (`8025:2480`), as directed by `8025:5650`. The supplied Darkroom frame remains in the source export and comparison reference.
- Projects Quick View uses the same Darkroom drawer template. Contract `10005:2844` prohibits a separate Projects implementation.
- Compare Library's full detail uses the actual Director Comparison Result (`8021:2789`). Contract `8025:5622` explicitly prohibits substituting the single-feedback layout shown by its misleading fixture (`8025:4306`). The review preserves sources, ordered recommendations, metadata and contextual chat.
- The prompt-editor all-controls reference is the actual `8025:905` group, including its menus. Annotation prose and section backgrounds are not rendered as product screens.

## Literal source details retained

- Frames keep their individual widths and heights. A narrow window scrolls instead of introducing an unprovided mobile layout.
- Original text styling, capitalization, wording and sample labels are retained, including raw Markdown in example output, model names and the duplicate model-setting row.
- Quick View and prompt/project editor backdrops are literal bitmap fills in Figma. Their original bytes are included. Old text within those bitmaps is part of the supplied image, not a second application UI.
- Existing icons remain the glyph authority. Photographic sample content remains a visual fixture, including on the domain clone; no new imagery was invented.
- Prompt Library's first description follows its explicit Figma `TRUNCATE` setting with a two-line ellipsis.

## Functional layer

The contracts' persistence, upload, model-generation, project-relationship and editing requirements are implemented by `director-core.js` and `functional-runtime.js`, which bind state to the approved documents at runtime. The generated Astra HTML/CSS remains the rendered interface; the functional layer does not introduce a React shell or substitute components.

Projects, prompts, saved feedback/comparisons, chats and preferences are browser-local state. Uploaded image sources are held in browser-local IndexedDB. The Figma sample cards, image fills, titles, copy and online/model badges remain fixtures and are never seeded as records. Local model requests and connection tests use only the configured OpenAI-compatible URL and require an explicit configured model.

Project Notes has no separately supplied destination frame, so it edits the selected project's persisted notes in the existing project context rather than inventing a new screen. Settings Storage/Keyboard remains a visible source label with no inferred destination. Theme/accent interactions are restricted to the controls supplied by the Appearance screen.

Verification confirms static rendering, browser-local interactions and request construction; it does not prove a live local model response unless a configured model completes a request. Visual approval remains with Diego.
