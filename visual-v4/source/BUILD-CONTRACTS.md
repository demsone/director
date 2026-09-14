# Director v4 — Build Contracts

Read before implementation. Source file khXC9kx69JUvH4Wx40FwKQ.

## 01 — Director / Feedback + Chat — 10008:679

BUILD CONTRACT
PURPOSE — Entry state for a new single-item critique.
BEHAVIOUR — User supplies one image/design source, selects Source Type, chooses a saved Prompt or enters custom prompt text, and may link the session to an existing/new Project. GET FEEDBACK begins the critique. Empty-state output remains until a valid source is present.
REUSE — Use existing shared upload/dropzone, prompt selector/editor, project selector/modal, output panel and global shell components.
DATA — Source, prompt choice/custom text, source type and project link are session data; do not hardcode sample values.
DO NOT — Do not invent extra setup steps, controls, onboarding, or a different page structure. The Figma frame is the visual specification.

## 01 — Director / Feedback + Chat — 10008:680

BUILD CONTRACT
PURPOSE — Complete prompt-editor behaviour/reference used by Director.
BEHAVIOUR — User can select/edit the active prompt and its body before running feedback. Preserve the fields and controls shown here; saved presets come from the Prompt Library.
REUSE — Use the same prompt data model and editor controls as the Prompts page.
DATA — Preset prompts are persistent records; unsaved edits apply only as explicitly implemented by the surrounding flow.
DO NOT — Do not create a second incompatible prompt system or replace this with a generic textarea-only workflow.

## 01 — Director / Feedback + Chat — 8025:981

BUILD CONTRACT
PURPOSE — Feedback generation / active critique state after a source has been submitted.
BEHAVIOUR — Header title changes from “New Feedback” to the uploaded filename by default. While the model is preparing feedback, disable the feedback action and show the existing aiChat-style thinking/reasoning animation. When generation finishes, render the result in the output panel.
REUSE — Use the approved aiChat thinking treatment and the same feedback form/output components from the new state.
DATA — Generated title is editable later; model output and all session inputs remain attached to the feedback record.
DO NOT — Do not replace the thinking state with a generic spinner, redesign the output region, or ask the user for another confirmation.

## 01 — Director / Feedback + Chat — 8025:1018

BUILD CONTRACT
PURPOSE — Completed feedback with follow-up conversation available.
BEHAVIOUR — Show the completed critique and reveal the mini toolbar: edit title, favourite/star, delete, and start New Feedback. Project Link can select a saved project or create a new one via the default project modal. Ask Director starts a contextual chat about this feedback; the chat is saved when the feedback is saved. SAVE FEEDBACK persists the complete record.
REUSE — Use the standard toolbar, project modal, aiChat composer/chat and save patterns already present in Director.
DATA — Feedback, chat transcript, title, favourite state, source metadata, model/prompt and project relationship persist together.
DO NOT — Do not detach chat from its feedback context or create new interaction patterns for these actions.

## 01 — Director / Feedback + Chat — 8025:1022

BUILD CONTRACT
PURPOSE — Persistent saved-feedback detail view.
BEHAVIOUR — Display saved source metadata, prompt used, model/reviewer, project, full feedback and its contextual Ask Director chat. UPDATE FEEDBACK edits the existing record; BACK TO DARKROOM returns to the library.
REUSE — This is the canonical feedback-detail pattern reused by Darkroom and Design Studio where applicable.
DATA — Everything shown is record-driven; examples in Figma are fixtures only.
DO NOT — Do not hardcode the sample photograph, text, dates, prompt, model or project. Do not reinterpret this as a new visual design.

## 02 — Director / Compare — 8021:1013

BUILD CONTRACT
PURPOSE — Empty state for a new multi-source comparison.
BEHAVIOUR — Accept 2–6 sources. User selects Source Type, optional Project Link and comparison Prompt. CLEAR resets the current comparison inputs. COMPARE SOURCES is unavailable until the minimum valid source count is met.
REUSE — Use the same source, project and prompt systems as single Feedback; comparison-specific source slots are the only functional difference.
DATA — Sources and selections are session data; sample imagery/content is not seed data.
DO NOT — Do not build a separate unrelated upload system or add ranking controls before the model result exists.

## 02 — Director / Compare — 8022:3071

BUILD CONTRACT
PURPOSE — Comparison processing state.
BEHAVIOUR — After submission, lock/disable conflicting input actions and show the approved in-progress treatment while Director compares the selected sources. Preserve the user’s source set and settings during generation.
REUSE — Use the established Director thinking/progress treatment rather than inventing a new loader.
DATA — Comparison remains one session/record containing all selected sources, prompt, project and eventual result.
DO NOT — Do not navigate away, reset the selected items, or require phase-by-phase confirmation.

## 02 — Director / Compare — 8022:3077

Notes
BUILD CONTRACT
PURPOSE — Completed comparison before/while saving.
BEHAVIOUR — Render Director’s written read plus ordered recommendations/ranking exactly in this structure. Ask Director opens contextual discussion of the comparison reasoning. SAVE COMPARISON persists the complete comparison. NEW COMPARISON starts a clean session.
REUSE — Use shared output, aiChat, project and persistence patterns.
DATA — Recommendation count follows the submitted source count; labels and descriptions are model/data-driven.
DO NOT — Do not hardcode four options or the sample recommendation copy. Do not invent scoring visualisations not shown in Figma.

## 02 — Director / Compare — 8022:3080

Notes
BUILD CONTRACT
PURPOSE — Saved comparison detail view.
BEHAVIOUR — Display saved comparison title, sources/results, recommendation order, prompt/model/project metadata and contextual Ask Director chat. Existing controls operate on this saved record.
REUSE — Use the canonical comparison result produced by Director; library/detail routes should render the same underlying record.
DATA — All visible sample text, dates, labels and images are fixtures only.
DO NOT — Do not convert this into single-feedback detail or duplicate records to satisfy the mockup.

## 03 — Darkroom / Library — 8025:2478

BUILD CONTRACT
PURPOSE — Photography feedback library.
BEHAVIOUR — List saved photography feedback/comparison records. ADD NEW FEEDBACK enters the Director feedback flow. Selecting a record opens Quick View or its full detail according to the interaction shown.
REUSE — Use reusable data-driven library cards and the shared Director shell.
DATA — Repeated Figma cards/sample content are visual fixtures only. Render persisted records; never seed duplicates to match the mockup.
DO NOT — Do not create special hardcoded cards or alter the approved library layout.

## 03 — Darkroom / Library — 8025:5646

BUILD CONTRACT
PURPOSE — Lightweight preview of one saved Darkroom record without leaving the library context.
BEHAVIOUR — Show the selected item’s image, type, prompt used and first-read excerpt. VIEW FULL FEEDBACK opens the canonical saved Feedback Detail.
REUSE — Use the shared Quick View / Drawer component and existing saved-record data.
DATA — Content is selected-record data, not fixture text.
DO NOT — Do not create a second detail model or duplicate the record when opening Quick View.

## 03 — Darkroom / Library — 8025:5650

BUILD CONTRACT
PURPOSE — Full saved photography feedback detail.
BEHAVIOUR — Same canonical Feedback Detail behaviour defined in Director: metadata, full feedback, contextual chat and update action. BACK TO DARKROOM returns to the photography library.
REUSE — Reuse Director / Feedback Detail; change route/context only.
DATA — Record-driven.
DO NOT — Do not rebuild or visually reinterpret this screen as a separate Darkroom implementation.

## 04 — Compare / Library — 8025:4323

BUILD CONTRACT
PURPOSE — Library of saved comparison sessions.
BEHAVIOUR — List saved comparisons; ADD NEW starts Director Compare. Selecting an item opens its saved comparison result.
REUSE — Use the same library/card system as Darkroom where structurally identical, with comparison-specific content.
DATA — Figma cards and labels are fixtures only; render persisted comparison records.
DO NOT — Do not hardcode example comparisons or invent a new library UI.

## 04 — Compare / Library — 8025:5622

BUILD CONTRACT
PURPOSE — Full saved comparison detail.
BEHAVIOUR — Render the selected saved comparison, its sources, recommendation/ranking, metadata and contextual chat. Navigation returns to the Compare library.
REUSE — Reuse the canonical Director saved Comparison Result pattern.
DATA — Entire screen is record-driven.
DO NOT — Do not substitute the single-feedback detail implementation even where fixture copy overlaps.

## 05 — Projects — 8025:5625

Notes
BUILD CONTRACT
PURPOSE — Projects library/list.
BEHAVIOUR — Render saved projects. ADD NEW PROJECT uses the standard project creation/edit modal. VIEW PROJECT opens the selected project detail.
REUSE — Use data-driven reusable project cards and the global shell.
DATA — Repeated cards and sample project content are visual fixtures only.
DO NOT — Do not seed duplicate projects or treat “Legacy / Darkroom” as permission to invent a second project system.

## 05 — Projects — 8025:5629

Notes
BUILD CONTRACT
PURPOSE — Project overview dashboard.
BEHAVIOUR — Overview, Feedback and Notes tabs address the same project. Show project summary, aggregate counts and latest activity from linked records. “See all” moves to the corresponding project activity/list view.
REUSE — Use persisted project relationships to feedback/comparison records.
DATA — Counts, dates, activity and copy are dynamic.
DO NOT — Do not hardcode dashboard metrics or duplicate linked feedback into project-owned copies.

## 05 — Projects — 8025:5632

Notes
BUILD CONTRACT
PURPOSE — Feedback activity belonging to the selected project.
BEHAVIOUR — Keep the same project header/tabs and render feedback/comparison records linked to this project. Opening an item uses the existing Quick View/full-detail patterns.
REUSE — Reuse Darkroom/Compare record cards and detail routes.
DATA — Relationship-based query of existing records; do not clone records into the project.
DO NOT — Do not invent a project-specific feedback UI.

## 05 — Projects — 10005:2844

BUILD CONTRACT
PURPOSE — Quick preview of a project-linked feedback record.
BEHAVIOUR — Same shared Quick View behaviour as Darkroom. VIEW FULL FEEDBACK opens the canonical saved record.
REUSE — Use the shared Quick View / Drawer component.
DATA — Selected linked record only.
DO NOT — Do not fork this component for Projects.

## 05 — Projects — 10005:2845

BUILD CONTRACT
PURPOSE — Create/edit project metadata.
BEHAVIOUR — Edit title, type and description. SAVE writes the project; CANCEL closes without applying unsaved changes. The same modal/pattern is used when creating a project from Project Link selectors.
REUSE — One canonical project form/modal across the app.
DATA — Persist project metadata and relationships separately from visual fixtures.
DO NOT — Do not add fields or workflows not specified by the design.

## 06 — Design Studio / Library — 10005:3477

BUILD CONTRACT
PURPOSE — Design Studio is intentionally not separately visually designed.
IMPLEMENTATION — Clone the approved Darkroom Library, Quick View and Feedback Detail patterns. Change domain/content only so the feature addresses design/screens/layouts rather than photography. Preserve the same structure, interactions, navigation, persistence and responsive behaviour unless another explicit note overrides it.
SOURCE OF TRUTH — Darkroom implementation + this directive. The absence of additional Design Studio frames is intentional, not missing design work.
DATA — Use the same data-driven record model with Design Studio source/category content.
DO NOT — Do not build this page as a blank shell, do not literally reproduce only this text note, and do not invent a new Design Studio UI, component system or workflow.

## 07 — Prompts — 10005:3199

BUILD CONTRACT
PURPOSE — Persistent Prompt Library used throughout Director.
BEHAVIOUR — Search, filter by category, show/hide archived prompts, add a prompt, and open a prompt for editing. Cards represent real prompt records and their category/use type.
REUSE — This is the sole source for prompt presets used by Feedback and Compare.
DATA — Repeated cards/sample copy are visual fixtures only. Do not seed duplicates merely to match Figma.
DO NOT — Do not create separate prompt stores per feature or replace the approved card layout.

## 07 — Prompts — 10005:3200

BUILD CONTRACT
PURPOSE — Create/edit one prompt record.
BEHAVIOUR — Edit Name, Category, Use Type, Description, Prompt body and optional System Note. SAVE PROMPT persists changes; ARCHIVE toggles/removes the prompt from normal active lists without destroying the record; CANCEL discards unsaved changes.
REUSE — Same editor/data model is used wherever prompt editing is exposed.
DATA — Persistent prompt record.
DO NOT — Do not silently generate/rewrite prompt text or add fields not shown.

## 08 — Settings — 10005:3474

BUILD CONTRACT
PURPOSE — User-facing response personalisation settings.
BEHAVIOUR — Base style and tone exposes Professional / Friendly / Candid. Warmth exposes Less / More / Neutral. Fast Answers is a user preference. Custom instructions are editable persistent text. Changes apply to Director’s response configuration as appropriate.
REUSE — Use the established Settings shell/navigation.
DATA — Persist settings locally; displayed output text is illustrative, not a fixture to reproduce.
DO NOT — Do not invent additional personality dimensions or change option labels.

## 08 — Settings — 10005:3475

BUILD CONTRACT
PURPOSE — Appearance preferences.
BEHAVIOUR — Theme and Accent controls update supported appearance preferences. “The approved Director theme” remains the visual baseline; user preference may only change the options explicitly exposed here.
REUSE — Use app-level theme/accent tokens rather than per-screen overrides.
DATA — Persist preference values.
DO NOT — Do not redesign Director, create arbitrary themes, or let accent settings alter unrelated layout/typography.

## 08 — Settings — 10005:3476

BUILD CONTRACT
PURPOSE — Local model/runtime configuration.
BEHAVIOUR — Configure default feedback model, default compare model, vision model and OpenAI-compatible local server URL. TEST CONNECTION validates the configured endpoint and reports success/failure without silently changing settings.
REUSE — One central model configuration consumed by Director features.
DATA — Persist model/server selections; available models should come from supported runtime/configuration rather than hardcoded sample names.
DO NOT — Do not assume GEMMA-4 is permanently fixed because it appears in Figma fixtures.
