# Director v2.5 — static visual transcription

The isolated HTML/CSS prototype contains all 19 requested states. Seventeen have supplied screenshots for visual comparison. Project Settings and Prompts All are transcribed from the JSON, with the outstanding fidelity checks documented in [SOURCE-NOTES.md](SOURCE-NOTES.md). The Astra/Figma transcription remains the visual baseline; a behaviour-only runtime is now being attached without replacing the supplied HTML/CSS.

## Open

Double-click **Director v2.5.command** in Finder. It starts the loopback preview and opens the screen index at **http://127.0.0.1:4176**. Startup normally takes under two seconds. No package installation or internet access is needed to view the prototype. Python 3 must be installed; it is available on this Mac.

`command.launcher` is the underlying launcher. Reopening it reuses the running preview instead of creating another server. The preview keeps running when the launcher exits.

Choose a screen from the index. Use browser Back to return. The index is a separate review aid. The design stays at its original 1512px width. Narrow browser windows scroll horizontally rather than reflowing the layout.

## Screens present

| Approved state | Figma node | Frame size |
|---|---|---|
| [Director / New Feedback](director-new-feedback.html) | 93:11963 | 1512 × 1321 |
| [Director / Feedback + Chat](director-feedback-chat.html) | 93:10481 | 1512 × 2030.893 |
| [Director / New Compare](director-new-compare.html) | 93:12069 | 1512 × 1304 |
| [Director / Compare](director-compare.html) | 93:10140 | 1512 × 2575.941 |
| [Darkroom / Library](darkroom-library.html) | 93:10790 | 1512 × 2069.924 |
| [Darkroom / Quick View](darkroom-quick-view.html) | 4008:2124 | 1512 × 1644 |
| [Darkroom / Feedback + Chat](darkroom-feedback-chat.html) | 4008:1981 | 1512 × 2313.714 |
| [Projects / All](projects-all.html) | 2013:712 | 1512 × 389.714 |
| [Projects / Quick View](projects-quick-view.html) | 93:11705 | 1512 × 1644 |
| [Projects / Detail / Overview](projects-detail-overview.html) | 4011:5891 | 1512 × 1644 |
| [Projects / Detail / Feedback](projects-detail-feedback.html) | 93:11503 | 1512 × 1644 |
| [Project / Settings](project-settings.html) | 4008:1817 | 1512 × 2000 |
| [Feedback / Detail](feedback-detail.html) | 4012:7575 | 1512 × 2313.714 |
| [Prompts / All](prompts-all.html) | 2001:3499 | 1512 × 1086.714 |
| [Prompts / Edit](prompts-edit.html) | 4013:3610 | 1512 × 1644 |
| [Settings / Models](settings-models.html) | 4016:4265 | 1512 × 1321 |
| [Settings / Personalisation](settings-personalisation.html) | 2001:3674 | 1512 × 1321 |
| [Settings / Appearance](settings-appearance.html) | 4016:4128 | 1512 × 1321 |
| [Compare / Result](compare-result.html) | 2001:3849 | 1512 × 3124.444 |

## Files

- `index.html`: review-only screen index.
- Nineteen named `.html` files: complete static screen markup with Figma node identifiers.
- `prototype.css`: geometry, typography, fills, borders and effects.
- `tokens.css`: 515 supplied variable definitions using their original collection/path names.
- `assets/`: local fonts/licenses, supplied vectors, images and recovered photograph crops.
- `screens.json`: screen names, source node IDs and frame dimensions.
- `scripts/transcribe.py`: deterministic export-to-HTML/CSS build script; no source data is fetched in the browser.
- `serve.py`, `command.launcher`, `Director v2.5.command`: local preview and Finder launch.
- `app-core.js`, `director-logic.js`, `functional-runtime.js`: local persistence, model adapter, and behaviour attached to the supplied screen markup.
- `verification/`: browser screenshots, seventeen side-by-side reference comparisons and browser checks.

## Verified

- All 19 screen documents render at the source frame dimensions.
- Browser checks found no missing image/font assets, HTTP failures, page errors, or broken state-link destinations.
- Seven navigation scenarios passed: Feedback → Compare, Settings switching, library → drawer → library, Prompts editor opening, and project tab switching.
- Product pages have no JavaScript and perform no localStorage writes.
- A narrow 800px viewport preserves the source's 1512px frame width.
- The Finder launcher starts the intended preview, survives launcher exit, and reuses one listener on repeat launch.
- Seventeen supplied references were compared with rendered screens. This is visual verification, not a claim of pixel identity or Diego's approval.

Read [verification/browser-report.json](verification/browser-report.json) for the automated results and [SOURCE-NOTES.md](SOURCE-NOTES.md) for the remaining source gaps.

## Rebuild

Run `python3 scripts/transcribe.py` from this directory. The existing design pack remains the input; no earlier Director implementation is used. The photograph extraction and comparison helpers require Pillow, already available in the local Python used for this build. They are development helpers, not runtime dependencies.
