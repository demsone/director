# Director v4 — Gemini Build Brief

## Objective

Build Director v4 as a complete working application from the approved Figma specification.

The priority is:

**faithful implementation, fast execution, functional completeness, and minimal deviation from the design contract.**

Do not redesign the product.

Do not reinterpret the interface.

Do not introduce your own UI system.

Do not simplify the approved design because another implementation would be easier.

The Figma file already defines the product.

Your job is to build it.

---

# Source of Truth

Use the following order of authority:

1. **Director v4 Figma file**
2. **Build Contract notes embedded inside the Figma file**
3. **Existing Director implementation patterns, components, icons and assets**
4. **Existing working implementations explicitly referenced by the Figma notes**
5. **Written implementation requirements in this brief**

The Figma file is not merely a visual reference.

It is the primary product specification.

All Build Contract annotations inside Figma are mandatory implementation instructions.

Do not ignore text notes because they sit outside the visible application frames.

---

# Figma

Director v4:

https://www.figma.com/design/khXC9kx69JUvH4Wx40FwKQ/Director-v4

Inspect the complete file before implementing.

The major product areas are:

- Director / Feedback + Chat
- Director / Compare
- Darkroom / Library
- Compare / Library
- Projects
- Design Studio
- Prompts
- Settings
- Components / design system

Read the Build Contract attached to every relevant screen.

---

# Core Implementation Rule

## Build as close to Figma as technically possible.

Treat visual deviation as a defect.

Match:

- layout
- hierarchy
- spacing
- dimensions
- typography
- alignment
- borders
- radii
- controls
- navigation
- drawers
- cards
- forms
- modal treatment
- content density
- empty states
- loading states
- component states

Do not modernise.

Do not embellish.

Do not introduce generic SaaS patterns.

Do not replace specific Director UI with your preferred component library defaults.

If something can be reproduced literally, reproduce it literally.

---

# Important Distinction: Visual Shell vs Functional Specification

Some Figma screens intentionally show only a representative visual state.

Do not assume that a visually simple shell means the functionality should also be simple.

Read the Build Contract.

For example:

## Design Studio

Design Studio is intentionally not separately redesigned.

It must reuse the approved Darkroom patterns.

Implementation requirement:

**Clone/reuse the Darkroom Library, Quick View and Feedback Detail implementations and adapt domain/content for Design Studio.**

Do not build a static Design Studio shell simply because only limited Design Studio-specific frames exist.

Do not invent a new Design Studio interface.

---

# Reuse Existing Implementations

When Figma says to reuse, clone or inherit an existing Director implementation, do that.

Do not recreate equivalent functionality independently.

Examples include:

- Darkroom patterns reused by Design Studio
- Feedback detail patterns
- Quick View drawers
- existing modal behaviour
- shared navigation
- shared model/status header
- prompt editing patterns
- project linking
- saved feedback and compare result patterns

Reuse should preserve behaviour and visual consistency.

---

# Components and Assets

Use the existing Director:

- icons
- components
- design primitives
- typography
- spacing system
- controls
- navigation
- modal patterns
- drawer patterns

No new icon set is required.

Do not substitute icons unless the original asset genuinely cannot be used.

Do not redraw existing assets unnecessarily.

---

# Data and Repeated Content

Repeated cards, records, images and sample text visible in Figma are often **layout fixtures**.

They are not instructions to hardcode duplicate data.

Build reusable data-driven components.

Do not seed the application with duplicated placeholder records simply because the same record appears repeatedly in design frames.

Libraries must render from data.

Projects must reference linked records rather than duplicate them.

Prompt cards must come from the prompt store.

Feedback and Compare records must persist as application data.

---

# Director / Feedback

Implement the complete feedback flow.

This includes:

- new feedback state
- source/file input
- source type
- prompt selection
- custom prompt support where specified
- project linking
- feedback generation state
- generated feedback
- title behaviour
- editing title
- favourite/star behaviour
- delete behaviour
- save behaviour
- new feedback action
- Ask Director follow-up chat
- persistence of saved feedback
- saved feedback detail view

While feedback is being generated:

- disable actions that should not be available
- show the approved thinking/reasoning state defined in Figma
- transition into the generated-feedback state without redesigning the page

The uploaded filename may become the default feedback title where specified.

---

# Ask Director Chat

Ask Director is contextual chat associated with the current feedback/comparison record.

It is not a separate unrelated conversation system.

Preserve the relationship between:

- source
- generated feedback
- follow-up conversation
- saved record

Where specified, the follow-up conversation must persist with the saved feedback.

---

# Compare

Implement comparison for the supported number of sources defined by the product.

The UI must respond to the actual number of submitted items.

Do not hardcode four recommendations because four sample items appear in Figma.

Comparison must support the Figma-defined source range.

Implement:

- source selection
- project linking
- prompt selection
- comparison loading state
- comparison result
- recommendation ranking
- first read
- saved comparison
- Ask Director follow-up
- saved result detail

Recommendation cards must be generated from real comparison results/data.

---

# Darkroom

Darkroom is the saved photography feedback library.

Implement:

- library
- saved records
- quick view
- feedback detail
- feedback/chat detail behaviour
- add new feedback flow where linked
- project relationships
- navigation between library and detail

Do not hardcode repeated sample feedback cards.

Use reusable record components.

---

# Compare Library

Implement the saved comparison library using the same principles as Darkroom.

Library records must be data-driven.

Saved result detail should reuse the canonical comparison implementation rather than becoming a separate unrelated UI.

---

# Projects

Projects organise existing Director records.

Implement:

- project library
- project overview
- linked feedback
- linked comparisons where applicable
- project notes where specified
- quick view
- project settings/edit modal
- project metadata
- project activity/summary

Important:

Projects should link existing feedback/comparison records.

Do not duplicate the underlying feedback data into separate project-owned copies unless the existing architecture explicitly requires references internally.

---

# Prompts

Prompt Library is the canonical editable prompt store.

Implement:

- prompt list
- search
- category filtering
- archive visibility
- add prompt
- edit prompt
- archive behaviour
- prompt metadata
- prompt body
- optional system note where specified
- persistence

Prompt selectors elsewhere in Director should use this stored prompt library.

Do not create independent hardcoded prompt lists inside each feature.

---

# Settings

Implement the settings shown in Figma.

This includes the designed sections and controls for:

- models
- personalisation
- appearance
- storage where applicable
- keyboard where applicable

Model settings must support the intended local-model workflow.

The local server endpoint and model configuration should behave as actual settings, not decorative form fields.

Personalisation values should persist.

Appearance settings should use the approved Director visual system.

Do not invent extra settings pages.

---

# Local Model Integration

Director is intended to work with local/OpenAI-compatible model endpoints where specified.

Model configuration must remain modular enough to support:

- default feedback model
- compare model
- vision-capable model
- local server endpoint
- connection testing

Do not tightly couple all model behaviour to one hardcoded model name visible in Figma sample content.

Sample model names are presentation examples unless otherwise specified.

---

# Persistence

Use appropriate persistence for application state and user-created data.

Persist at minimum where applicable:

- feedback records
- compare records
- chats associated with records
- projects
- project relationships
- prompts
- archived prompts
- favourites
- editable titles
- settings
- personalisation
- model configuration

Do not treat the application as a static prototype.

---

# Architecture

Prefer clear, maintainable implementation over unnecessary abstraction.

However:

Do not rewrite working infrastructure simply because you would architect it differently.

Reuse existing Director code where appropriate.

Avoid large unrelated refactors during the build.

The goal is to deliver Director v4, not create a framework.

---

# Autonomous Build Behaviour

You are authorised to continue through the build without asking Diego for routine approval.

Do not stop after every screen.

Do not ask:

- whether to continue
- whether a standard component should be reused
- whether obvious Figma instructions should be followed
- whether minor implementation decisions are acceptable

Inspect the Figma, existing codebase and neighbouring implementations first.

Resolve routine issues yourself.

---

# When You May Escalate

Only stop and ask for input if one of these conditions occurs:

1. Two authoritative requirements directly conflict.
2. Implementing a requirement would require materially changing the approved Figma design.
3. A critical requirement depends on information that genuinely does not exist in Figma, the codebase or project documentation.
4. Continuing would risk destructive changes to existing user data or the project.

Uncertainty by itself is not a reason to stop.

Investigate first.

---

# Repair Rule

If something you build is incorrect:

**repair it.**

Do not restart the project.

Do not create a new architecture plan.

Do not redesign the page.

Do not abandon working completed sections.

Use the current implementation and correct the discrepancy.

---

# Visual QA

Before declaring the build complete, compare the implementation against Figma.

Check:

- spacing
- alignment
- dimensions
- typography
- component hierarchy
- page width
- sidebars
- headers
- buttons
- controls
- cards
- borders
- radii
- icons
- empty states
- loading states
- drawers
- modal dimensions
- overflow
- long content behaviour
- responsive behaviour where applicable

Visual discrepancies should be fixed before handoff.

---

# Functional QA

Verify the complete interaction flow.

Test:

- navigation
- new feedback
- save feedback
- edit feedback title
- favourite
- delete
- Ask Director
- source upload
- prompt selection
- custom prompts
- comparison
- saved comparison
- projects
- project linking
- prompt CRUD
- prompt archive
- settings persistence
- model configuration
- model connection testing
- empty states
- loading states
- error states
- persistence after restart/reload

Check for:

- console errors
- broken controls
- state loss
- duplicated records
- incorrect routing
- dead buttons
- stale UI state
- visual regressions

---

# Scope Protection

Do not:

- redesign Director
- alter approved navigation
- replace approved layouts
- invent new features
- introduce dashboards that are not in Figma
- modernise the interface
- simplify screens because they appear complex
- replace custom UI with generic framework components
- create speculative AI features
- add onboarding unless explicitly shown
- add animations beyond the defined interaction/loading behaviour
- introduce unrelated refactors
- rewrite completed working areas without cause

---

# Completion Standard

Do not report completion because the main screens render.

Director v4 is complete when:

- the designed product areas are implemented
- Figma Build Contracts are respected
- the application is functional
- persistence works
- reuse directives are correctly implemented
- visual fidelity is high
- major workflows work end-to-end
- obvious defects have been repaired
- no substantial screen is left as a static shell
- no placeholder implementation is being presented as complete

---

# Final Handoff

When finished, provide a concise implementation report containing:

1. What was completed
2. Major architectural decisions
3. Data/persistence approach
4. Model integration status
5. Any known limitations
6. Any genuinely unresolved requirement
7. Files or major areas changed
8. QA performed

Do not provide a long progress diary.

Do not ask Diego to approve intermediate phases.

Build the application, verify it, repair it, then return the completed Director v4 build for review.