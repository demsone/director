# Director — Clean Rebuild V1

## Product purpose

Director is a local creative studio assistant for photography and design.

Its original purpose remains the foundation:

Director should behave like an experienced creative director with decades of visual knowledge — capable of giving useful, specific, observational critique rather than generic AI encouragement.

It should understand photography, design, composition, colour, typography, production and visual communication at a professional level, while remaining conversational rather than pompous or excessively academic.

The original motivation remains:

**“I want that back.”**

The essential experience is the useful creative conversation that began with submitting a photograph to an LLM, receiving serious professional critique, and then being able to discuss the work further.

---

# Core V1 workflow

The fundamental Director workflow is:

**Image → Prompt → Feedback → Conversation → Save**

This must work before any visual reskin or advanced feature development begins.

## 1. Image input

The user can:

- select an image from the Mac
- drag and drop an image
- view the selected image clearly inside Director
- replace the image before submitting

Director must retain access to the image throughout the feedback and subsequent conversation.

Repeated use of the same image is allowed.

Director must not inherit Latent's duplicate-prevention behaviour.

---

## 2. Feedback

The user selects a feedback prompt.

Initial prompt categories:

- Photography
- Design
- General

The initial Photography review should support the original structured review format:

1. First impression
2. What works
3. What feels weak or unresolved
4. Composition / gesture / timing
5. Light, colour, contrast or tonal notes
6. Crop or edit suggestion
7. Print potential
8. Possible series connection
9. Three possible titles
10. Tags
11. Short human note

Prompts are data, not hard-coded UI behaviour.

They must eventually be editable and extensible.

---

## 3. Feedback result

Director sends:

- image
- selected prompt
- appropriate system instructions

to the configured local vision-capable model.

The complete model response is displayed alongside the source image.

The application must preserve the relationship:

**source image ↔ prompt ↔ response**

This object becomes the basis of a Director session.

---

## 4. Chat / reasoning

After feedback has been generated, the user can continue talking to Director about the same work.

The follow-up conversation must retain:

- source image context
- original feedback
- selected critique prompt
- subsequent conversation

The user should not need to re-upload or explain the image again.

This is a core Director feature, not an optional later enhancement.

---

# Compare

Compare survives from later Director development.

It is part of Director's intended product, but it is **not required for the first functional checkpoint**.

Compare allows two or more visual works to be evaluated in relation to each other.

Examples:

- two edits of the same photograph
- two photographs being considered for a series
- alternate crops
- competing designs
- visual direction alternatives

Compare should eventually support:

**Images → Compare Prompt → Comparative Feedback → Conversation → Save**

Compare must use the same underlying feedback/session architecture as single-image critique.

It must not become a second independent application.

---

# Sessions and persistence

Every critique creates a session containing at minimum:

- unique ID
- source image reference/copy
- selected prompt
- feedback response
- chat history
- creation date
- optional title
- optional category
- optional project association

Sessions must survive application restart.

A successful V1 requires:

1. Create feedback
2. Continue chat
3. Save
4. Quit Director
5. Reopen Director
6. Reopen session
7. Continue conversation successfully

Until this works reliably, Director is not considered functional.

---

# Library

The original concept of Design Memory becomes **Design Library**.

Director will ultimately contain:

- Photography Library
- Design Library

Libraries store Director sessions rather than disconnected model responses.

Collections and sub-collections can be introduced after core persistence is proven.

The Library is not required to become a full digital asset manager in V1.

---

# Projects

Projects remain part of the intended Director product.

A project groups related Director sessions.

Examples:

- The DDNC
- a photography series
- a campaign
- a fashion project
- an identity project

A project may contain:

- images
- critique sessions
- conversations
- comparisons

For the initial build, project support should remain deliberately simple.

Do not build project-management functionality.

---

# Prompts

The prompt system survives and will later expand substantially.

Prompts should eventually support:

- Photography
- Design
- Production
- Compare
- General
- user-created categories
- saved prompts
- editable prompts

The later Design Builder / style-fusion work belongs to the Director prompt system, but it is **post-V1 functionality**.

Do not build Design Builder during the initial rebuild.

---

# Explicitly out of scope for the functional V1

Do not build yet:

- Design Builder
- large style library
- elaborate collection management
- sophisticated project management
- complex search
- advanced tagging
- visual redesign
- animation/polish
- full Figma reproduction
- speculative features not defined here

---

# Build order

## Checkpoint 1 — Functional core

Build only:

Image → Prompt → Feedback → Chat

Verify against a real local vision model.

Nothing else progresses until this works.

---

## Checkpoint 2 — Persistence

Add:

- save session
- reopen session
- application restart persistence
- continue previous conversation

Verify with actual saved data.

---

## Checkpoint 3 — Basic history

Add a minimal session/history browser.

No elaborate library UI.

Verify open/delete/rename behaviour.

---

## Checkpoint 4 — Compare

Implement Compare using the existing session/model infrastructure.

Do not create a parallel architecture.

---

## Checkpoint 5 — Projects and basic libraries

Introduce lightweight project association and Photography/Design Library organisation.

---

## Checkpoint 6 — Visual implementation

Only after Checkpoints 1–5 are stable may the approved visual design be implemented.

---

# Visual-reference rule

Existing Astra-generated HTML/CSS files are **visual reference artifacts only**.

They represent approved design intent.

They are NOT:

- application source code
- application architecture
- production components
- application entry points
- templates to extend with business logic

They must remain unchanged during the functional build.

Production Director must be independently functional before visual-reference integration begins.

When visual implementation starts, the agent may inspect the reference HTML/CSS to extract:

- dimensions
- spacing
- typography
- colours
- borders
- component appearance
- visual hierarchy

It may then reproduce those properties in Director's actual production components.

It must not convert the visual-reference HTML into the app.

---

# Engineering principle

**Behaviour first. Persistence second. Organisation third. Appearance fourth.**

A visually incomplete Director that correctly critiques, chats, saves and reopens is successful.

A visually perfect Director that cannot reliably complete that workflow is a failed build.

---

# Definition of V1 success

Director V1 is complete when a user can:

1. Open Director.
2. Select a photograph.
3. Select a critique prompt.
4. Receive useful feedback from a local vision model.
5. Continue discussing that photograph.
6. Save the session.
7. Quit Director.
8. Reopen Director.
9. Open the saved session.
10. Continue the same conversation.
11. Compare two works and discuss the comparison.
12. Reliably repeat the entire workflow without corrupting or losing previous sessions.

Only then does the approved visual redesign begin.