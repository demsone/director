# Director V2 — Persistence and Session History

You are continuing the existing working Director V1.

## Current state

Director V1 is verified working and has been committed and tagged:

`director-v1-core-working`

Development is now occurring on a separate branch.

The V1 functional core already supports:

**Image → Prompt → Feedback → Follow-up Chat**

Do not rebuild or reinterpret this workflow.

Do not redesign the application.

Do not use the visual reference HTML as application source.

---

# Objective

V2 makes Director's working V1 sessions durable.

A user must be able to create a feedback session, quit Director, reopen Director later, reopen that session, and continue the same image-aware conversation.

The existing V1 behaviour must remain intact.

---

# Scope

## 1. Persistent session model

Every feedback session must persist at minimum:

- unique session ID
- created timestamp
- updated timestamp
- optional user-editable title
- source image
- image metadata where already available
- selected prompt ID/name
- prompt content used for the critique
- original feedback response
- complete follow-up chat history
- model information required to understand how the session was generated
- session type, currently `feedback`

Store enough information that the session remains intelligible even if prompts or model configuration later change.

Do not make saved sessions depend on mutable prompt definitions.

---

## 2. Image persistence

The source image must remain available after Director restarts.

Do not rely on a temporary browser object URL, transient upload state, or the original source file continuing to exist.

Director must maintain its own durable local copy/reference using the existing local-first architecture.

Do not modify the user's original source image.

---

## 3. Save behaviour

A successful critique should become a Director session.

Follow-up chat messages must update the same session.

Persistence should be reliable and predictable.

Avoid requiring the user to repeatedly press Save after every chat turn if the architecture can safely persist updates automatically.

If autosave is used, it must not interfere with streaming model responses.

---

## 4. Session history

Add a minimal functional history surface.

It only needs to provide enough UI to:

- list saved sessions
- show session title
- show date/update information
- identify the source image
- open a session
- rename a session
- delete a session

Keep this deliberately utilitarian.

Do not attempt to reproduce the Figma Library design yet.

Do not turn History into a project/library system.

---

## 5. Reopen session

Opening a saved session must restore:

- source image
- original feedback
- follow-up conversation
- selected prompt context
- required model conversation context

The restored session must visually and functionally behave like the session before Director was closed.

---

## 6. Continue conversation

After reopening a saved session, the user must be able to continue chatting about the image.

The model must retain sufficient context to understand:

- the original image
- the original critique
- prior chat discussion

The user must not need to re-upload the image or restate what was previously discussed.

---

## 7. Delete behaviour

Deleting a session must remove:

- the session record
- Director-owned session assets that are no longer required

Do not delete or modify the user's original source image.

Deletion should not leave obvious orphaned session data.

---

# Data integrity

Persistence is the core purpose of V2.

Design the storage layer so later Director features can build on the same session model:

- Compare
- Projects
- Photography Library
- Design Library

Do not implement those features yet.

Do not create separate persistence architectures for future feature types if a common session abstraction is appropriate.

Keep migration/versioning in mind so future schema changes do not require throwing away existing Director sessions.

---

# Error handling

Handle at minimum:

- malformed/corrupt session record
- missing Director-owned image asset
- interrupted write
- session requested but no longer present
- model unavailable when attempting to continue an old chat

Errors should be understandable and must not corrupt unrelated sessions.

---

# Testing requirements

Do not consider V2 complete merely because data appears in storage.

Perform an end-to-end verification:

1. Launch Director.
2. Upload an image.
3. Select a prompt.
4. Generate feedback.
5. Send at least two follow-up chat messages.
6. Confirm the session exists in History.
7. Quit Director completely.
8. Relaunch Director.
9. Open the saved session.
10. Confirm the image is present.
11. Confirm original feedback is present.
12. Confirm previous chat messages are present.
13. Send a new follow-up message.
14. Confirm the model understands the existing image/conversation context.
15. Rename the session.
16. Restart Director again and confirm the new name persists.
17. Delete the session.
18. Restart Director and confirm it remains deleted.
19. Confirm a second unrelated session was not affected.

Run existing V1 tests as well.

V1 functionality must not regress.

---

# Explicit exclusions

Do NOT implement:

- Compare
- Projects
- Photography Library
- Design Library
- collections
- Design Builder
- style fusion
- visual reskin
- Figma implementation
- visual-v4 HTML integration
- animation/polish
- unrelated refactoring

Do not expand scope because adjacent functionality appears easy.

---

# Visual reference restriction

Existing Astra-generated visual HTML/CSS is reference material only.

Do not:

- serve it as Director
- wire application logic into it
- convert it into production components
- rewrite the application around it
- modify it as part of V2

Director's production implementation remains independent.

---

# Git requirement

Before making architectural changes, verify the current working branch and that the repository is clean.

Do not alter the tag:

`director-v1-core-working`

When V2 passes all acceptance criteria:

1. commit the verified working state
2. use a clear commit message such as:

`Director v2: persistent sessions and history`

3. stop

Do not begin V3 in the same pass.

---

# Definition of V2 success

V2 is complete when Director can reliably perform:

**Image → Prompt → Feedback → Chat → Quit → Reopen → Continue**

with the complete session preserved locally and retrievable through a minimal History interface.

Persistence and reliability matter more than appearance.