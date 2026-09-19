# Director V2 — Persistent sessions and history

Director is a local creative studio assistant. V2 preserves the verified V1 workflow and makes sessions durable:

**Image → Prompt → Feedback → Chat → Quit → Reopen → Continue**

## Open Director

Double-click **Director.command** in this folder. It runs `command.launcher`, starts Director at **http://127.0.0.1:4177**, and opens your browser. Leave the launcher window open while using Director; Control-C stops it. Reopening the launcher reuses a healthy V2 server. Node.js **22.13 or newer** is required; no npm installation or build step is needed. Node 22 may print an experimental SQLite notice; the bundled database API is verified on Node 22.23.1. The former port 4190 is blocked by Firefox.

In LM Studio, start the local server on port 1234 and load a vision model. The verified model is **qwen3-vl-8b-instruct**, with an **8192-token context** and one prediction at a time. Director lists loaded vision-capable models; it does not download, load or unload them. Loading may take a minute or more. Click **Refresh models** after loading.

If an older Director server occupies port 4177, stop its launcher first. Reload a V1 tab to use V2. V1 did not save sessions; V2 cannot recover earlier closed V1 conversations.

## Use Director

1. Choose a JPEG, PNG or WebP up to 12 MB, or drop one into the image area. Replace it before submitting if needed.
2. Choose a Photography, Design or General prompt. **Read selected prompt** shows its instructions. Photography returns the original 11 review sections.
3. Click **Get feedback**. Once the critique is durably saved, it appears with **Saved locally** and a History entry. The complete raw model response is available below the review.
4. Ask follow-ups. Every completed user/assistant exchange automatically updates the same saved session.
5. Close the browser and stop Director. Start it again, then click **Open** in History to restore the image, prompt, feedback and conversation. Continue without re-uploading.
6. **Rename** sets an optional title. **Delete** removes the session and its Director-owned image copies after confirmation. Your original file is never touched.

**New critique** leaves the current session saved in History and retains the selected image for repeat use. Duplicate images are allowed. Unsent drafts and unfinished requests are not saved. Leaving a draft prompts for confirmation. Reopening the currently displayed session preserves the draft, allowing recovery after another tab changes it.

## Storage and integrity

Default storage is **`.director-data/sessions.sqlite` inside this project**, excluded from Git. It holds both session records and image assets. Keep this folder when moving the app. For backup, stop Director and copy the entire `.director-data` folder, including any SQLite sidecar files. Do not delete it to resolve a model or startup error.

`DIRECTOR_DATA_DIR` selects another local storage directory. Changing it opens a different store; it does not migrate or erase the original. No cloud storage or browser localStorage/sessionStorage is used. LM Studio may keep its own inference logs independently.

Each session retains a UUID, type (`feedback`), schema version, revision, created/updated timestamps, optional title, image metadata, exact prompt snapshot, original system instructions, raw/structured feedback, model identifier/configuration information and successful chat history. Original source and model review bytes are stored as BLOBs with SHA-256 checksums. Reopening never looks up mutable prompt definitions.

Uploaded source bytes remain unchanged. A JPEG review copy, at most 1600 pixels on its longest side, is sent to the model; transparent areas are composited on white. Both copies persist. Source/review dimensions are displayed where available. A review copy cannot certify print resolution or colour accuracy. Model responses are rendered as text, never executable HTML.

SQLite transactions with full synchronization commit a critique and both assets together. Chat exchanges commit only after a complete answer. Deletes cascade to assets in the same transaction. Interrupted writes roll back. Revision checks prevent stale tabs from overwriting newer changes. Request IDs prevent duplicate chat turns when a completed request is retried after a lost response. If a critique finishes saving just as its request disconnects or is cancelled, check History before generating it again.

Corrupt records, missing/damaged images and missing sessions produce explicit errors without resetting unrelated data. Corrupt records remain visible for recovery or deliberate deletion. An unreadable database or newer schema stops startup rather than replacing data. Database version 1 and per-session version 1 provide explicit future migration boundaries.

Reading History needs no model. Continuing requires the saved model identifier to be loaded in LM Studio. If inference or saving fails, the last saved session and message draft remain intact. Complete image-aware context is sent without silently trimming turns. If context fills, increase the model context and retry, or start a new critique. Incomplete responses produce errors with raw output available.

## Implementation and configuration

- `server.mjs`: loopback server, fixed static routes and critique/chat/History endpoints.
- `src/store.mjs`: SQLite records/assets, validation, atomic writes, revisions and versioning.
- `src/core.mjs`: prompt schema, image validation and multimodal message construction.
- `src/prompts.json`: prompt data; changes affect new sessions after a restart.
- `src/model.mjs`: LM Studio adapter and model information capture.
- `public/`: existing functional UI plus minimal History.
- `test/`: V1 regression, integrity tests and live restart acceptance.
- `verification/v2/`: development evidence, not application storage.

No third-party runtime dependencies. The app uses Node's [built-in SQLite API](https://nodejs.org/download/release/v22.13.1/docs/api/sqlite.html), LM Studio [model discovery](https://lmstudio.ai/docs/developer/rest/list) and [structured output](https://lmstudio.ai/docs/developer/openai-compat/structured-output).

Environment variables: `PORT` (4177), `DIRECTOR_DATA_DIR` (project `.director-data`), `LM_STUDIO_URL` (`http://127.0.0.1:1234`, loopback HTTP only), `LM_STUDIO_TOKEN` (optional server-side authentication), `DIRECTOR_NO_OPEN=1` (launcher without opening a browser). Secrets never go to the browser.

## Verification

```sh
npm test
npm run check
PLAYWRIGHT_PATH=/absolute/path/to/playwright/index.mjs npm run test:v2
```

The V2 test uses an isolated server on **4181**, temporary storage and the actual loaded LM Studio model. It fully closes the server and browser between phases, verifies reopen/continue, rename/restart and delete/restart, and preserves a second independent session. It removes its temporary upload to prove source-file independence, checks that original source bytes are unchanged, verifies asset cleanup and runs SQLite's integrity check. Temporary data is removed after success. Set `DIRECTOR_V2_TEST_PORT` if 4181 is occupied.

The existing V1 browser regression is `npm run test:e2e`; target a separate running test server with `DIRECTOR_TEST_URL`. It checks History retention while retaining the V1 image/prompt/feedback/chat and error-recovery assertions. Both browser suites use existing Playwright/Chromium installations. On the build machine, `PLAYWRIGHT_PATH` is `/Users/diego/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`.

See `verification/v2/VERIFICATION.md` for results and limitations. Compare, projects, libraries, collections, visual reskin and Astra/Figma integration remain out of scope. No Astra reference HTML or CSS was inspected, modified or served in V2.
