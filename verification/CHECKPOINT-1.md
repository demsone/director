# Director V1 — Checkpoint 1 verification

**Result: functional checkpoint passed, 19 September 2026.**

Port correction after Firefox feedback: the default app, launcher and browser-test address is now `http://127.0.0.1:4177`. Firefox rejected the original port 4190. Health, page, script, stylesheet and prompt responses were checked on 4177, along with launcher reuse and syntax checks. A direct Firefox UI recheck was unavailable because the automation connection timed out. The original live-inference test address below is retained as historical evidence.

This is a new application at the project root. Scope was taken from `docs/V1 Brief.md` and the request to build only Checkpoint 1. No Astra HTML reference files were inspected or modified. Existing archives and reference assets were not used as application code. Existing working-tree changes were left intact.

## Real local-model acceptance

Two complete browser runs used the installed **Qwen3-VL-8B-Instruct Q4_K_M** through LM Studio on loopback port 1234, loaded with an **8192-token context** and **parallelism 1**. No model responses were mocked in the acceptance sequence.

The final run:

1. Opened Director in Chromium at `http://127.0.0.1:4190`.
2. Checked Photography, Design and General prompt selection.
3. Rejected an invalid upload, selected the supplied photograph `assets/img/image.jpg.jpg`, rendered its preview, and replaced it with the same bytes via drag/drop under the name `source-photo.jpg`.
4. Selected the Photography review and submitted the image to the actual local model.
5. Received all **11 nonempty sections in 21.162 seconds**. The full raw response was available unchanged, with the source image beside the feedback.
6. Asked an image-specific question about fabric colour, chair position and air conditioner location. The model identified the yellow fabric and the chair to the right. Its placement language for the air conditioner was approximate.
7. Asked a second follow-up that depended on the previous turn. The model recalled the user-supplied edit name **“Courtyard study”** and discussed keeping the chair as a counterpoint to the yellow fabric.
8. Verified that each browser chat request included the image, selected prompt and original review, and that the second included both previous conversation turns. Transport tests separately verify these reach the LM Studio request intact.

The unabridged final feedback and replies are in `live-browser-report.json`. The report excludes base64 image payloads. Screenshots are `ready.png`, `feedback-and-chat.png` and `mobile.png`. These are explicit development evidence, not application persistence.

## Other verification

- **12 automated tests passed**: prompt-derived schemas, invalid structured responses, image validation, exact multimodal context replay, duplicate-image critiques, selected prompt routing, malformed session rejection, cross-origin rejection, fixed static-file allowlist, model capability checks, inference payloads, truncated/empty output, timeout/cancellation and loopback-only provider configuration.
- `npm run check` passed for the server, model adapter, session core and browser script.
- `zsh -n command.launcher Director.command` passed.
- Launcher started the intended app; invoking it again reused the healthy server.
- Browser checks passed for image replacement, prompt selection, failed chat recovery preserving the draft and prior state, new-critique reset, and clearing state on reload without browser storage.
- Separate controlled browser checks passed for offline-model recovery and cancellation restoring controls while preserving the selected image.
- Desktop and mobile screenshots were inspected. The mobile page had no horizontal overflow. No browser JavaScript errors occurred during the real-model run.

## Evidence limits

The verified live inference path is Photography with Qwen3-VL-8B. Design and General are implemented through the same data-driven schema and model path and covered by focused tests, but were not separately assessed with a real design image. Other local vision models were not tested.

This verifies functional image context and conversation continuity, not expert-level judgment on every answer. The first run invented 300-dpi print readiness. Prompt instructions were tightened and the entire live flow rerun; the final response correctly stated that print readiness cannot be assessed from the review copy. The model still sometimes makes debatable observations or defaults to wanting a human presence despite contrary instructions. The complete response remains visible; Director does not silently rewrite it.

No persistence, save/reopen behaviour, Compare, libraries, projects or visual-reference implementation was built or claimed. A long conversation may exhaust the loaded model's context; Director reports failure without discarding successful turns. A reload clears the temporary session, as required for this checkpoint's scope.
