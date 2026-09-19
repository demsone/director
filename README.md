# Director V3 — Compare

Director is a local creative studio assistant. V3 extends the verified Feedback and persistent-session workflow with exactly two-image Compare:

**Image A + Image B → Compare prompt → Comparative feedback → Chat → Quit → Reopen → Continue**

Single-image Feedback remains available through the same application and History.

## Open Director

Double-click **Director.command** in this folder. It runs `command.launcher`, starts Director at **http://127.0.0.1:4177**, and opens your browser. Leave the launcher window open while using Director; Control-C stops it. Reopening the launcher reuses a healthy V3 server. Node.js **22.13 or newer** is required; no npm installation or build step is needed. Node 22 may print an experimental SQLite notice; the bundled database API is verified on Node 22.23.1. The former port 4190 is blocked by Firefox.

In LM Studio, start the local server on port 1234 and load a vision model. The verified model is **qwen3-vl-8b-instruct**, with an **8192-token context** and one prediction at a time. Director lists loaded vision-capable models; it does not download, load or unload them. Loading may take a minute or more. Click **Refresh models** after loading.

If an older Director server occupies port 4177, stop its launcher first. Reload an older Director tab to use V3. Existing V2 saved sessions remain available. V1 did not save sessions, so already-closed V1 conversations cannot be recovered.

## Use Director

1. Choose a JPEG, PNG or WebP up to 12 MB, or drop one into the image area. Replace it before submitting if needed.
2. Choose a Photography, Design or General prompt. **Read selected prompt** shows its instructions. Photography returns the original 11 review sections.
3. Click **Get feedback**. Once the critique is durably saved, it appears with **Saved locally** and a History entry. The complete raw model response is available below the review.
4. Ask follow-ups. Every completed user/assistant exchange automatically updates the same saved session.
5. Close the browser and stop Director. Start it again, then click **Open** in History to restore the image, prompt, feedback and conversation. Continue without re-uploading.
6. **Rename** sets an optional title. **Delete** removes the session and its Director-owned image copies after confirmation. Your original file is never touched.

**New critique** leaves the current session saved in History and retains the selected image for repeat use. Duplicate images are allowed. Unsent drafts and unfinished requests are not saved. Leaving a draft prompts for confirmation. Reopening the currently displayed session preserves the draft, allowing recovery after another tab changes it.

## Compare

Choose **Compare · Image A and Image B** in Session type. Select or drop exactly one image into each labelled area. Both are required; either can be replaced before submission. Choose **Compare two images** or **Compare crops and edits**, select a loaded vision model, then click **Compare images**.

The model receives both images in one request, explicitly labelled A and B. Follow-ups retain those labels, both images, the original comparison and all chat turns. The general Compare prompt asks for 11 comparative sections without forcing a winner. The response structure is defined by prompt data, not by UI-specific templates.

Compare sessions autosave in the same History as Feedback, with both source names and their type shown. Open, rename and delete work the same way. Reopening restores both original images; no re-upload is needed. **New comparison** keeps the pair selected while leaving the previous session saved. Switching modes starts a new working view; completed sessions stay saved, and discarding an unsent draft requires confirmation.

## Photography critique policy

`src/critique-policy.json` defines shared rules for Feedback, Compare and follow-up chat: describe visible effect before intent, preserve ambiguity about people and image-making, describe light before assigning a time of day, and discuss visual print qualities without routine metadata warnings. The prohibited word and phrases in the V3 brief are explicitly excluded by these instructions.

New sessions retain the current instructions. Old prompt, system and feedback snapshots are not rewritten; current critique policy is appended at inference time when absent from an old system snapshot, taking precedence over incompatible historical wording. This lets old conversations continue under the current rules without altering what was originally saved. Model compliance remains a property of the local model and is checked in live acceptance samples; stored responses remain unmodified.

## Storage and integrity

Default storage is **`.director-data/sessions.sqlite` inside this project**, excluded from Git. It holds both session records and image assets. Keep this folder when moving the app. For backup, stop Director and copy the entire `.director-data` folder, including any SQLite sidecar files. Do not delete it to resolve a model or startup error.

`DIRECTOR_DATA_DIR` selects another local storage directory. Changing it opens a different store; it does not migrate or erase the original. No cloud storage or browser localStorage/sessionStorage is used. LM Studio may keep its own inference logs independently.

Each session retains a UUID, type (`feedback` or `compare`), schema version, revision, created/updated timestamps, optional title, image metadata, exact prompt snapshot, original system instructions, raw/structured feedback, model identifier/configuration information and successful chat history. Original source and model review bytes are stored as BLOBs with SHA-256 checksums. Reopening never looks up mutable prompt definitions.

Uploaded source bytes remain unchanged. A JPEG review copy, at most 1600 pixels on its longest side, is sent to the model; transparent areas are composited on white. Both copies persist for each image; Compare owns four assets in total. Source/review dimensions are displayed where available. A review copy cannot certify print resolution or colour accuracy. Model responses are rendered as text, never executable HTML.

SQLite transactions with full synchronization commit a session and all its assets together. Chat exchanges commit only after a complete answer. Deletes cascade to assets in the same transaction. Interrupted writes roll back. Revision checks prevent stale tabs from overwriting newer changes. Request IDs prevent duplicate chat turns when a completed request is retried after a lost response. If a critique finishes saving just as its request disconnects or is cancelled, check History before generating it again.

Corrupt records, missing/damaged images and missing sessions produce explicit errors without resetting unrelated data. Corrupt records remain visible for recovery or deliberate deletion. An unreadable database or newer schema stops startup rather than replacing data. Database schema 2 adds the two Image B asset roles. Its transactional upgrade copies existing asset bytes and does not rewrite session records, revisions, timestamps or snapshots. Existing Feedback records remain format version 1; Compare records use version 2. Failed upgrades roll back. V2 binaries do not support opening an upgraded schema-2 database; use a pre-upgrade backup for a downgrade rather than resetting the current store.

Reading History needs no model. Continuing requires the saved model identifier to be loaded in LM Studio. If inference or saving fails, the last saved session and message draft remain intact. Complete image-aware context is sent without silently trimming turns. If context fills, increase the model context and retry, or start a new critique. Incomplete responses produce errors with raw output available.

## Implementation and configuration

- `server.mjs`: loopback server, fixed static routes and critique/chat/History endpoints.
- `src/store.mjs`: SQLite records/assets, validation, atomic writes, revisions and versioning.
- `src/core.mjs`: prompt schema, image validation and multimodal message construction.
- `src/prompts.json`: Feedback and Compare prompt data; changes affect new sessions after a restart.
- `src/critique-policy.json`: shared photography critique rules.
- `src/model.mjs`: LM Studio adapter and model information capture.
- `public/`: existing functional UI plus the Compare mode and labelled second-image input.
- `test/`: V1/V2 regression, Compare and migration integrity tests, and live restart acceptance.
- `verification/v3/`: V3 development evidence, not application storage. Prior verification remains in `verification/v2/`.

No third-party runtime dependencies. The app uses Node's [built-in SQLite API](https://nodejs.org/download/release/v22.13.1/docs/api/sqlite.html), LM Studio [model discovery](https://lmstudio.ai/docs/developer/rest/list) and [structured output](https://lmstudio.ai/docs/developer/openai-compat/structured-output).

Environment variables: `PORT` (4177), `DIRECTOR_DATA_DIR` (project `.director-data`), `LM_STUDIO_URL` (`http://127.0.0.1:1234`, loopback HTTP only), `LM_STUDIO_TOKEN` (optional server-side authentication), `DIRECTOR_NO_OPEN=1` (launcher without opening a browser). Secrets never go to the browser.

## Verification

```sh
npm test
npm run check
PLAYWRIGHT_PATH=/absolute/path/to/playwright/index.mjs npm run test:v3
```

The V3 test uses an isolated server on **4183**, a store created by the tagged V2 implementation, a photograph as A and a clearly distinct geometric test image as B. It verifies that the real local model sees and distinguishes both images before and after complete browser/server restarts, and checks rename/delete persistence with an unchanged V2 Feedback session. Set `DIRECTOR_V3_TEST_PORT` if needed.

The complete V2 test remains available as `npm run test:v2`. It uses an isolated server on **4181**, temporary storage and the actual loaded LM Studio model. It fully closes the server and browser between phases, verifies reopen/continue, rename/restart and delete/restart, and preserves a second independent session. It removes its temporary upload to prove source-file independence, checks that original source bytes are unchanged, verifies asset cleanup and runs SQLite's integrity check. Temporary data is removed after success. Set `DIRECTOR_V2_TEST_PORT` if 4181 is occupied.

The existing V1 browser regression is `npm run test:e2e`; target a separate running test server with `DIRECTOR_TEST_URL`. It checks History retention while retaining the V1 image/prompt/feedback/chat and error-recovery assertions. All browser suites use existing Playwright/Chromium installations. On the build machine, `PLAYWRIGHT_PATH` is `/Users/diego/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`.

Use `DIRECTOR_EVIDENCE_DIR` to direct V1/V2 regression evidence into a separate folder when verifying V3. See `verification/v3/VERIFICATION.md` for V3 results and limitations. Projects, libraries, collections, Design Builder, arbitrary multi-image comparison, visual reskin and Astra/Figma integration remain out of scope. No Astra reference HTML or CSS was inspected, modified or served in V3.
