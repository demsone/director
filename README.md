# Director V1 — Checkpoint 1

A new, independent functional build of Director. Scope: **image → selected prompt → local vision model → structured feedback → image-aware follow-up conversation**.

## Open Director

Double-click **Director.command** in this folder. It runs `command.launcher`, starts Director at **http://127.0.0.1:4177**, and opens your browser. Leave the launcher window open while using Director; Control-C stops the server. Opening the launcher again reuses a healthy Director server. Node.js 22 or newer is required. No npm installation or build step is needed. The former port 4190 is blocked by Firefox; use 4177 instead.

In LM Studio, start the local server on port 1234 and load a vision model. The verified model is **qwen3-vl-8b-instruct** with an **8192-token context** and one prediction at a time. Director lists only models that LM Studio reports as both loaded and vision-capable. It does not download, load or unload models itself. Model loading can take a minute or more. If no model appears, load it in LM Studio and click **Refresh models**.

1. Choose a JPEG, PNG or WebP, or drop one into the image area. You can replace it before requesting feedback.
2. Choose a Photography, Design or General prompt. Expand **Read selected prompt** to inspect it.
3. Click **Get feedback**. The Photography prompt returns the 11 sections in the V1 brief. The complete, unmodified model response is also available below the review.
4. Ask a follow-up. Every turn sends the same image, original prompt, full original feedback and all completed conversation turns to the same local model.
5. **New critique** clears the current review and conversation after confirmation, keeping the image selected for repeat use.

## Scope and state

This is Checkpoint 1, not the full V1. There is no persistence, save feature, history browser, Compare, library, project management or visual-reference integration. The app holds one active session in browser memory. Reloading or closing the tab clears it. The UI states this explicitly and warns before leaving an active conversation. Director writes no session, image or conversation files and uses neither localStorage nor sessionStorage. LM Studio may maintain its own inference logs independently of Director.

The session contains an ID, creation time, image review copy, prompt snapshot, selected model, structured feedback including the raw model response, and chat history. Failed and cancelled requests leave the previous successful state and message draft intact. There is no duplicate-image restriction. The server is stateless and serves only the new `public/` files through an explicit route allowlist.

The original image is shown in the tab. A JPEG review copy, at most 1600 pixels on its longest side, is sent to the model for predictable local resource use; transparent areas are composited on white. Source and review dimensions are shown in the interface. This copy is insufficient to certify print resolution or colour accuracy. Model output is rendered as text, never executable HTML.

Director retains the whole conversation without silently trimming earlier turns. Very long conversations can exceed the model's context; failures are displayed and do not erase history. Increase context in LM Studio (reload using the same model identifier), then retry, or start a new critique. Unsupported structured output, empty answers, truncated answers and timeouts are explicit errors; failed raw output is available when returned by the model. Cancel aborts Director's upstream HTTP request; how quickly inference stops depends on LM Studio.

## Code

- `server.mjs`: loopback HTTP server, fixed static routes and critique/chat endpoints.
- `src/core.mjs`: prompt schema, image and session validation, multimodal message construction.
- `src/prompts.json`: Photography, Design and General prompt data. Edit this file and restart the server to change prompts; a prompt editor is outside this checkpoint.
- `src/model.mjs`: LM Studio discovery and inference adapter.
- `public/`: independent functional UI, without reference HTML or imported design components.
- `test/`: focused automated checks and repeatable real-model browser acceptance test.
- `verification/`: deliberate development evidence, not application session persistence.

The adapter uses LM Studio's [model discovery endpoint](https://lmstudio.ai/docs/developer/rest/list) and [JSON-schema structured output](https://lmstudio.ai/docs/developer/openai-compat/structured-output). LM Studio must support `/api/v1/models` and `/v1/chat/completions`. The app itself has no third-party runtime dependencies.

Optional environment variables: `PORT` (default 4177), `LM_STUDIO_URL` (default `http://127.0.0.1:1234`, local HTTP origins only), `LM_STUDIO_TOKEN` (if authentication is enabled). Tokens remain on the server and are not sent to the browser. `DIRECTOR_NO_OPEN=1` runs the launcher without opening a browser.

## Verification

Run `npm test` for focused tests and `npm run check` for JavaScript syntax checks. To run the full live test, first start Director and load Qwen3-VL-8B in LM Studio, then run:

```sh
PLAYWRIGHT_PATH=/absolute/path/to/playwright/index.mjs npm run test:e2e
```

The test uses an existing Playwright installation and Chromium; Playwright is not an application dependency. On the build machine it is available at `/Users/diego/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`. The supplied default photograph is `assets/img/image.jpg.jpg`. The visual assertions are specific to that fixture. `DIRECTOR_TEST_URL` can target another running port.

The live test writes a redacted report and screenshots to `verification/`. It checks real feedback, two real follow-ups, upload and drag/drop replacement, prompt selection, responsive rendering, failure recovery and state clearing. The app is usable immediately; no archived source or Astra HTML is required to run it.
