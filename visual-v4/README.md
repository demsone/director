# Director v4 — visual approval build

Open **Director v4.command** in the parent Director folder, or run `command.launcher` here. Startup normally takes under two seconds. The launcher opens the review index at **http://127.0.0.1:4184/** and reuses the existing preview listener.

The build contains 27 review views covering all supplied product states, the three explicitly directed Design Studio clones, and the complete prompt-editor reference. Read all 25 source contracts in [source/BUILD-CONTRACTS.md](source/BUILD-CONTRACTS.md).

This is the visual approval stage. Navigation links and temporary prompt-text editing support inspection. Model actions, connection tests, saves, deletes and persistence are inactive. Sample status, models, titles, text and cards are visual fixtures. No existing Director data is read or changed.

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
