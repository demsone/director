Director v4 — Gemini Production Build Brief
Objective
Build the complete functional Director v4 application behind the approved Astra HTML/CSS implementation.
The visual design phase is complete.
Do not redesign Director.
Do not recreate Director from Figma.
Do not reinterpret the interface.
Astra has already translated the approved Figma design into 27 HTML screen implementations. Those screens are now the approved visual baseline.
Your task is to preserve that baseline and make it functional.
Your Role
You are the implementation engineer, not the designer.
You own:
- application architecture
- routing
- state
- persistence
- data models
- file handling
- local model integration
- prompt execution
- interaction logic
- CRUD operations
- loading states
- errors
- application behaviour
- integration between features
- functional QA
You do not own:
- layout
- visual hierarchy
- spacing
- typography
- colours
- component dimensions
- border treatment
- radii
- icon placement
- navigation design
- visual density
- interaction styling
- screen composition
Those decisions have already been made.
Source of Truth
Use this authority order:
1. Approved Astra HTML/CSS baseline
This is the primary implementation source.
The existing:
- HTML
- CSS
- tokens
- assets
- icons
- visual states
- screen geometry
must be preserved.
2. Director v4 Figma
Use Figma when you need to understand:
- UX intent
- Build Contract annotations
- state relationships
- reuse instructions
- behaviour not obvious from static HTML
Figma remains the product specification.
3. Existing Director code
Reuse existing working logic where appropriate.
Do not preserve obsolete UI simply because old code already exists.
4. This brief
This defines implementation rules and production behaviour.
The Central Rule
Build behind the approved interface.
Do not rebuild the interface while adding functionality.
If the approved HTML contains:
<div class="some-existing-structure">
your default action is to wire that structure up, not replace it with your preferred component architecture.
If application architecture requires componentisation, componentise internally while preserving rendered output.
The finished application should remain visually indistinguishable from the approved Astra implementation except where dynamic content naturally changes.
Freeze the Visual Baseline
Before substantial implementation begins, create a clean version-control checkpoint.
Recommended tag:
figma-approved-v1
This represents the approved Astra transcription.
After that point, material visual changes are prohibited unless explicitly required.
Do not casually modify:
- global CSS
- typography
- spacing
- page geometry
- navigation
- component dimensions
- controls
- buttons
- modal layout
- drawers
- cards
- headers
- icon positioning
If functionality can be implemented without changing the visual baseline, it must be.
Do Not "Clean Up" Astra's Code Just Because You Prefer Another Structure
The Astra files are a visual contract.
You may refactor implementation where necessary, but visual preservation takes priority over architectural elegance.
Do not:
- replace Astra CSS with Tailwind defaults
- replace controls with framework defaults
- install a UI kit and substitute components
- convert the visual system to Material UI
- redesign layouts while componentising
- introduce your own design tokens
- normalize spacing according to generic conventions
- add rounded cards
- increase whitespace
- simplify dense screens
- create new dashboard structures
No generic SaaS redesign.
Approved Screen Families
The Astra baseline contains the required visual states for the application.
These include:
Director / Feedback
- New Feedback
- Feedback generating
- Feedback result + chat
- Saved Feedback Detail
Director / Compare
- New Compare
- Compare generating
- Comparison + chat
- Saved Comparison Result
Darkroom
- Library
- Quick View
- Feedback Detail
Compare Library
- Library
- Saved Comparison Result
Projects
- Library
- Detail / Overview
- Detail / Feedback
- Quick View
- Project Settings
Design Studio
- Library
- Quick View
- Feedback Detail
Prompts
- Prompt Library
- Prompt Edit
Settings
- Personalisation
- Appearance
- Models
Shared UI
- Prompt Editor / full controls
- shared sidebar
- model status
- drawers
- forms
- modals
- buttons
- navigation
- controls
Use these approved screens as states of the application rather than creating alternative versions.
Static Sample Data Is Not Application Data
Astra's HTML contains repeated sample content because it represents the approved visual states.
Do not hardcode those fixtures as the real application database.
Examples include:
- repeated photographs
- repeated feedback records
- sample project names
- sample prompts
- model names
- comparison results
- dates
- feedback text
Replace those with dynamic data while maintaining the same visual structure.
Director / Feedback
Implement the complete feedback lifecycle.
The user must be able to:
- select/drop a source
- determine source type
- select a stored prompt
- enter or modify prompt content where allowed
- optionally link the feedback to a project
- submit feedback
- see the generating state
- receive model output
- continue into Ask Director chat
- edit the resulting title where specified
- favourite/star the feedback
- save the record
- update it
- delete it
- start another feedback session
- reopen saved feedback later
The UI state must move through the approved Astra screens.
Do not invent additional intermediary screens.
Ask Director
Ask Director is contextual.
The conversation belongs to the feedback/comparison session that created it.
Persist the relationship between:
- source
- prompt
- model used
- generated feedback
- follow-up messages
- project link
- saved record
Saved feedback should retain its associated Ask Director conversation.
Compare
Implement comparison using the approved Compare interface.
Support the source-count range defined by Director rather than assuming the sample number shown in the static HTML.
Implement:
- adding sources
- source type
- prompt selection
- project linking
- submit
- generating state
- model result
- ranked recommendations
- first-read analysis
- follow-up conversation
- save
- reopen
- update/delete where applicable
Recommendation UI should render from real result data.
Do not hardcode four recommendation records merely because four appear in the reference screen.
Darkroom
Darkroom is the photography feedback library.
Implement real data-driven:
- library records
- saved feedback
- quick view
- detail view
- chat association
- project relationships
- navigation
- add/new feedback entry points
The repeated cards in Astra's library view are layout fixtures.
Render reusable components from persisted records.
Design Studio
Design Studio deliberately inherits the Darkroom interaction model.
The visual implementation already reflects this.
Maintain the same architecture:
- Library
- Quick View
- Feedback Detail
Change domain/content behaviour where required.
Do not invent a separate Design Studio product architecture.
Where functionality is genuinely shared with Darkroom, reuse the implementation rather than maintaining two independent systems.
Compare Library
Build the Compare Library from persisted comparison records.
Saved comparison results must reopen using the approved result/detail treatment.
Do not build a second independent comparison UI for saved records.
Reuse the canonical Compare result implementation.
Projects
Projects organise records created elsewhere.
Implement:
- project creation
- project editing
- project deletion if required
- project title
- type
- description
- overview
- feedback relationship
- comparison relationship where applicable
- project activity
- project notes where defined
- quick view
- project settings
Important:
Projects link Director records.
Do not duplicate an entire feedback record simply because it is associated with a project.
Use relationships/references.
Prompts
Prompt Library is the canonical prompt store.
Implement persistent:
- add
- edit
- archive
- restore/show archived where specified
- search
- category filtering
- use type
- description
- prompt body
- optional system note
Prompt selectors elsewhere in Director must read from this store.
Do not create separate hardcoded prompt lists for Feedback, Compare, Darkroom or Design Studio.
Settings
Implement the approved Settings screens.
Models
Support configuration for:
- feedback model
- compare model
- vision model
- local model server URL
- connection testing
Personalisation
Persist the approved options including:
- base style/tone
- warmth
- fast-answer behaviour where specified
- custom instructions
Appearance
Implement only the appearance controls shown by the approved design.
Do not create additional themes/settings that do not exist in the specification.
Local Model Integration
Director is designed around local/OpenAI-compatible model access.
Keep the model layer sufficiently abstract that configured models can change without altering application UI.
Support the configured local server endpoint.
Do not hardcode:
gemma-4
simply because that model appears in the approved visual fixtures.
The model/status bar should reflect actual application state/configuration.
File Handling
Feedback sources may originate from:
- Finder/local file path where available
- browser/file picker upload
Where a direct local path cannot persist, maintain the local source-copy behaviour defined by the application specification.
The same saved record should remain usable after application restart where technically intended.
Handle missing/deleted source files gracefully.
Persistence
Persist user-created application data.
At minimum this includes, where applicable:
- feedback sessions
- feedback output
- source metadata
- saved sources/local copies
- chats
- compare sessions
- comparison results
- projects
- record/project relationships
- prompts
- archived prompts
- favourites
- titles
- settings
- personalisation
- model configuration
Do not treat Director as a browser-only static prototype.
State Architecture
The static Astra screens represent application states.
Implement those states through proper application logic.
For example:
Feedback
empty → configured → generating → result → result + chat → saved
Compare
empty → configured → generating → result → result + chat → saved
Do not create separate disconnected implementations for each HTML file.
The screens describe how one application transitions through those states.
Reuse Shared Components
Where Astra visually repeats the same component, favour a shared implementation.
Examples:
- sidebar
- status/model bar
- headers
- prompt selector
- project selector
- buttons
- tabs
- Quick View
- Ask Director composer
- record cards
- modal
- drawers
But component reuse must not change rendered appearance.
Visual fidelity outranks abstraction.
Interaction Behaviour
Controls that look interactive in the approved baseline should become interactive where required by the product.
Do not leave:
- dead buttons
- fake selectors
- non-functional tabs
- decorative edit controls
- inert archive buttons
- fake save controls
unless the design explicitly marks them as presentation-only.
Loading and Error Behaviour
Use the approved generating states.
Do not invent giant loaders, skeleton dashboards or replacement screens.
For recoverable errors, preserve the existing layout and present errors with minimal disruption.
Handle:
- model unavailable
- server unavailable
- model response failure
- bad source file
- missing local file
- persistence failure
- invalid form input
without destroying existing data.
Autonomous Build Rule
You are expected to complete the production build autonomously.
Do not stop after every screen.
Do not ask Diego for routine implementation approval.
Do not ask whether to:
- continue
- create shared state
- wire another button
- use the existing component
- connect persistence
- repair a bug
Those are implementation responsibilities.
Escalation Threshold
Escalate only when:
1. the approved baseline and Figma Build Contract directly conflict;
2. functionality genuinely requires a material visual change;
3. required product information is absent from the baseline, Figma and existing code;
4. continuing risks destructive loss of real data.
Everything else should be investigated and resolved autonomously.
Repair Rule
When something fails:
repair the implementation.
Do not respond to a bug by redesigning the application.
Do not restart Director from scratch.
Do not create another UI.
Do not refactor unrelated systems.
Preserve completed work and correct the specific failure.
Visual Regression Rule
The Astra baseline must remain visually stable throughout implementation.
After major functionality is added, compare the working application against the corresponding approved Astra screen.
Any material visual drift is a regression.
Examples:
- different spacing
- altered page width
- changed font sizing
- larger controls
- replaced buttons
- new cards
- changed drawers
- changed modal size
- moved toolbar
- different content hierarchy
Fix the regression rather than accepting it.
Functional QA
Before declaring completion, test the application end-to-end.
Verify at minimum:
- application startup
- navigation
- source selection/upload
- new feedback
- feedback generation
- save/reopen feedback
- Ask Director
- editing title
- favourite
- project linking
- new comparison
- comparison generation
- saved comparison
- Darkroom
- Design Studio
- Compare Library
- project creation/editing
- Projects relationships
- Prompt CRUD
- Prompt archive
- prompt selection elsewhere
- settings persistence
- model selection
- local server connection
- restart/reload persistence
- empty states
- loading states
- error handling
Check for:
- console errors
- runtime exceptions
- broken routes
- dead controls
- duplicate records
- stale state
- persistence loss
- incorrect relationships
- visual regressions
Scope Protection
Do not add features because you believe Director would benefit from them.
Specifically do not introduce:
- dashboards
- onboarding
- analytics
- generic AI assistant features
- new navigation
- new pages
- unnecessary configuration
- alternate layout modes
- new design systems
- speculative automation
- visual redesigns
Implement Director v4 as specified.
Completion Definition
Director v4 is complete when:
- the approved Astra visual baseline is preserved;
- all required screens function as states of one application;
- core workflows operate end-to-end;
- records persist correctly;
- prompts are data-driven;
- Projects use relationships correctly;
- local model configuration works;
- navigation works;
- shared UI is integrated;
- major errors are handled;
- no significant control is left fake;
- static fixtures have been replaced by real application data where appropriate;
- visual regressions have been repaired.
Rendering all 27 screens is not completion.
The product must work.
Final Handoff
When the build is ready, return one concise report containing:
1. completed functionality;
2. architecture used;
3. persistence approach;
4. model integration approach;
5. major files/modules changed;
6. QA performed;
7. known limitations;
8. genuinely unresolved issues.

Do not produce a daily diary.
Do not ask Diego to approve intermediate implementation phases.
Build it. Test it. Repair it. Return when Director v4 is ready for review.