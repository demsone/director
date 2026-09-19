# Director V2 — Verification

**Result: passed on 19 September 2026.** Scope: `docs/V2 Brief.md` only.

## Git and scope

The starting application commit was `06b70c170f3cd5886ef9c72dd669ecca67616523` on `director-v1-rebuild`. The sole uncommitted file was the user-supplied V2 brief. A separate branch, `codex/director-v2-persistence`, was created and the brief recorded in `d8d6ccd` before architecture changes; the working tree was then clean.

The `director-v1-core-working` tag reference remained `29a3e22e76aab4f6d46ffa9b9cdde3eed11980bb`. No reference HTML/CSS was read or modified. The existing V1 UI and image/prompt/feedback/chat flow were extended with persistence and a minimal History surface. No Compare, libraries, projects, collections or visual reskin was added.

## Full live acceptance

`persistence-browser-report.json` records a real Chromium → Director → LM Studio run, using `qwen3-vl-8b-instruct` with an 8192-token context. All critique and chat responses in that test came from the local model.

1. Launched an isolated Director server and fresh browser.
2. Uploaded a temporary copy of the supplied photograph and selected Photography.
3. Generated and durably saved all 11 review sections in **21.323 seconds**.
4. Sent two follow-up chat messages. Both exchanges updated the same session, which appeared in History.
5. Created a second independent session using the General prompt and another real model review.
6. Deleted only the disposable upload copy, proving the subsequent reopen could not rely on its original path.
7. Closed the browser and terminated the Director process. Confirmed its HTTP endpoint was unavailable.
8. Started a new Director process and a fresh browser, then opened the first session from History.
9. Verified exact source image bytes, original raw feedback, selected prompt and both previous chat exchanges were restored.
10. Sent a new real follow-up. The model recalled **“Courtyard study”**, remembered the request to retain the chair and full hanging fabric, and correctly described the yellow fabric and chair on the right.
11. Renamed the session, closed both processes, relaunched and confirmed the name and all three chat exchanges survived.
12. Deleted the session through the UI with confirmation, restarted again and confirmed it remained absent.
13. Opened the second session and compared its complete response object: unchanged. The user's original photograph checksum was also unchanged.
14. Checked the database: zero assets for the deleted session, exactly two for the surviving session, and `PRAGMA integrity_check` returned `ok`.

Four separate server processes were used: `45971`, `46045`, `46056`, `46061`. The test database was temporary and removed after passing. The application is running separately on the normal port with its own initially empty store; synthetic test sessions were not left in the user's History.

Screenshots inspected: `reopened-session.png`, `history-mobile.png`, and the separate V1 regression screenshots. Both desktop and mobile render correctly; the mobile test checked for horizontal overflow. No browser JavaScript errors occurred in the live acceptance test.

## Regression and integrity checks

- **21 automated tests passed**, comprising all 12 existing V1 checks and nine persistence-focused tests.
- Exact source/review bytes, metadata, prompt snapshot, original system instructions and model configuration survive reopening SQLite.
- Removed or changed catalog prompts do not affect saved conversation construction.
- Rename/delete persist; deletion removes owned assets while preserving another session.
- Injected write failures roll back both initial session creation and subsequent chat updates.
- A child process was forcibly killed with a transaction open after changing a title and removing assets. Reopening recovered the original committed title and image.
- Malformed records, missing assets and damaged image bytes are isolated from healthy sessions.
- Two independent database connections reject stale updates, and a late reply cannot resurrect a deleted session.
- A future database schema is refused without resetting it.
- Retrying a committed chat request returns the stored reply without another inference or duplicate turns. Model errors preserve saved turns.
- The existing V1 browser suite passed against a separate V2 test server, including a real Photography critique and two follow-ups. It also checked file selection, invalid input, drag/drop replacement, prompt selection, raw response rendering, mobile layout, failed-request draft preservation and repeat-image use. The persistence-specific expectation now confirms History retains the session after reloading the active view.
- Reopening the current session preserves its unsent draft, allowing safe refresh after a conflict.
- JavaScript syntax checks, shell syntax checks and whitespace checks passed.
- The normal launcher started V2 on **4177**; a second launch reused it. A final browser smoke check confirmed V2, History and the loaded vision model at the normal address. Runtime database files are ignored by Git.

## Limits

Actual live inference was tested with Qwen3-VL-8B, using Photography and General prompts. Design remains on the same existing data-driven path and is covered by the V1 route/schema tests. Other models were not live-tested.

The restart test closes the real Director server and Chromium browser; it is not a Mac reboot, Firefox rendering test or power-loss test. Interrupted transactions were tested with both injected failure and process death. SQLite handles commit durability, but no software can guarantee recovery from physical disk loss; backup guidance is in the README.

Model judgments remain fallible, and the full raw response is retained. Context limits can stop long conversations; errors preserve saved state. Unsent drafts and unfinished model responses are intentionally not persisted. V1 had no durable store, so previously closed V1 sessions cannot be recovered. Existing V1 temporary pages must be reloaded to use V2.
