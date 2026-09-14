# Director v4 — visual approval build

Open **Director v4.command** in the parent Director folder, or run `command.launcher` here. Startup normally takes under two seconds. The launcher opens the review index at **http://127.0.0.1:4184/** and reuses the existing preview listener.

The build contains 27 review views covering all supplied product states, the three explicitly directed Design Studio clones, and the complete prompt-editor reference. Read all 25 source contracts in [source/BUILD-CONTRACTS.md](source/BUILD-CONTRACTS.md).

The current corrective scope is only `feedback-new.html`: its exact approved markup and CSS are progressively enhanced with source selection, source type, prompt selection/custom prompt text, project link, validation, and transition to the approved `feedback-thinking.html` state. No other screen is being made functional. The layout and CSS are unchanged; no existing Director data is read or changed beyond the browser-local prompt/project records selected by this one workflow.

## Source and implementation

- Authoritative design: Director v4, Figma file `khXC9kx69JUvH4Wx40FwKQ`.
- `source/figma.json`: complete extracted screen trees, geometry, typography and fills.
- `source/build-contracts.json`: page inventory and all Build Contract annotations, read before implementation.
- `source/variables.json` and `tokens.css`: 520 exact Figma variables, retaining collection/path names.
- `scripts/build.mjs`: common HTML/CSS renderer and explicit canonical-pattern reuse. Carries forward the existing Director transcription approach using the current v4 source.
- `../assets/icons`: existing icon sources, served directly.
- `assets/images`: original Figma image fills; matching source SHA-1 hashes are recorded in `source/image-map.json`.
- `screens.json`: every route, source node, dimension and explicit reuse relationship.
- `verification/browser-report.json`: screen, asset, navigation and narrow-viewport checks.
- `verification/comparison-sheet-*.png`: Figma/browser comparisons.

Run `npm run build` to regenerate the static screens, and `npm run check` for JavaScript syntax checks. No package installation is required to launch or rebuild. Browser verification uses an externally available Playwright package via `DIRECTOR_PLAYWRIGHT`; the app has no runtime dependencies.

See [SOURCE-NOTES.md](SOURCE-NOTES.md) for explicit reuse decisions and visual-stage boundaries. Diego's visual approval remains pending.
