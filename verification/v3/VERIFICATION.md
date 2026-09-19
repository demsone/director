# Director V3 verification

Status as of 2026-09-20 Melbourne time: **implementation present; live acceptance incomplete.** V3 must not be marked complete or receive its final implementation commit until the live Compare and V1/V2 browser suites pass.

## Architecture and scope

Compare extends the existing server, prompt catalog, model-message builder, SQLite session store and History UI. Exactly two images are labelled A and B in the same initial model request and replayed in follow-up requests. Compare uses the existing save, revision, chat retry, rename and deletion mechanisms. The LM Studio client is unchanged.

Database schema 2 widens the image asset role constraint to support `source_b` and `review_b`. The transaction copies existing assets without changing session records or asset bytes. Feedback records remain format version 1; Compare records use version 2. Shared critique policy applies at inference time to old conversations without rewriting their saved snapshots.

No Astra reference HTML/CSS was inspected, modified or served. No redesign, Projects, Libraries, Design Builder, collections or arbitrary image counts were added.

## Passed checks

- `npm test`: **30/30 passed**, including the existing 21 tests and nine Compare/policy/migration tests.
- `npm run check`, Compare browser-script syntax, launcher shell syntax and `git diff --check`: passed.
- Authentic V2 fixtures created using the protected `director-v2-persistence-working` implementation migrate with exact records and assets preserved. Failed migrations roll back and remain readable by V2.
- A consistent SQLite snapshot of the actual user database migrated successfully: **8 sessions, 16 assets, exact records and bytes preserved, all sessions readable, integrity check `ok`**. Only the temporary copy was migrated. See `actual-v2-copy-migration-report.json`.
- Controlled browser recovery checks passed: missing Image B isolates the affected History item; valid Compare restores both images; same-session reopen preserves a draft; cancelling a mode switch keeps the draft; accepting the switch restores Feedback controls without changing the saved comparison. These checks used a mock model listing and performed no inference. See `ui-recovery-report.json`.
- The real-model browser attempt opened an authentic V2 saved session after migration and confirmed its exact image, prompt and prior chat. It also reached the initial Compare request after two-image input and replacement checks. The rendered failure screenshot was visually inspected.

## Live acceptance blocker

The loaded model at the time of the attempt was `ternary-bonsai-27b-mlx`, with a 4,096-token context. The initial two-image request returned no final answer; Director correctly reported HTTP 502 rather than saving fabricated feedback. See `compare-browser-report.json` and `failure.png`. Reasoning exhausting the output budget is a possible cause, not a confirmed diagnosis.

Loading the previously verified `qwen3-vl-8b-instruct` alongside Bonsai was rejected by LM Studio's memory guardrail. No guardrail was overridden. Permission to switch from idle Bonsai to Qwen3-VL with an 8,192-token context was requested and is pending. The application itself does not load or unload models.

The following remain unverified for V3: successful live comparison; image-specific follow-ups; complete server/browser restart and continued two-image chat; live rename/delete restart acceptance; full V1/V2 live browser regressions. Storage-level equivalents passed, but do not substitute for those acceptance flows. No human manual acceptance or macOS reboot test is claimed.

## Resume acceptance

After the model runtime is available, run `npm run test:v3` with `PLAYWRIGHT_PATH` set to an existing Playwright installation. `DIRECTOR_TEST_MODEL` optionally selects a specific loaded model. The test uses an isolated server on port 4183, authentic V2 storage, a photograph as Image A and a geometric red-square/blue-circle fixture as Image B. It tests real inference, three image-specific follow-ups, complete server/browser restarts, rename, deletion and unrelated V2 session preservation.

Run `npm run test:v2` with `DIRECTOR_EVIDENCE_DIR=verification/v3/v2-regression`, then `npm run test:e2e` against an isolated test server with `DIRECTOR_EVIDENCE_DIR=verification/v3/v1-regression`. Inspect outputs and screenshots, resolve failures, and update this report with actual results.

The running application on port 4177 remains V2 and its original database remains schema 1. Before launching V3 there, take a fresh consistent backup, then verify record and asset preservation across the actual upgrade. The final commit required by the brief is `Director v3: compare sessions and image-aware chat` on `director-v3-compare`, only after all acceptance criteria pass. Do not merge or tag automatically.
