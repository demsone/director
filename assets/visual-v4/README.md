# Director v4 — Astra application bundle

The usable application is the native **Director.app** in the parent Director folder. Open it in Finder. After source changes, double-click the parent **Director.command** (or run its `command.launcher`) to rebuild and launch the app. The app opens directly to New Feedback; this folder is the bundled Astra interface, not a visual-review deliverable.

The build retains the approved Astra HTML/CSS interface across 27 supplied states, the three explicitly directed Design Studio clones, and the complete prompt-editor reference. Read all 25 source contracts in [source/BUILD-CONTRACTS.md](source/BUILD-CONTRACTS.md).

`functional-runtime.js` layers interaction on those documents without creating a React shell or replacing the rendered Astra markup. It supplies browser-local routing, records, projects, prompts, settings, real file selection and Finder drop targets, feedback/compare workflows, contextual chat, model requests, the canonical Project Settings modal, and the canonical Quick View / prompt-editor drawers.

The browser starts without seeded sample records: Figma cards, titles, copy, images and model labels remain visual fixtures, not database records. State is stored in localStorage and source files in local IndexedDB. Model requests go only to the configured OpenAI-compatible local server after a model is selected.

## Source and implementation

- Authoritative design: Director v4, Figma file `khXC9kx69JUvH4Wx40FwKQ`.
- `source/figma.json`: complete extracted screen trees, geometry, typography and fills.
- `source/build-contracts.json`: page inventory and all Build Contract annotations, read before implementation.
- `source/variables.json` and `tokens.css`: 520 exact Figma variables, retaining collection/path names.
- `scripts/build.mjs`: common HTML/CSS renderer and explicit canonical-pattern reuse. Carries forward the existing Director transcription approach using the current v4 source.
- `director-core.js`: local-first record model, validation, safe output formatting and request construction.
- `functional-runtime.js`: state binding and interactions layered onto the Astra documents.
- `../assets/icons`: existing icon sources, served directly.
- `assets/images`: original Figma image fills; matching source SHA-1 hashes are recorded in `source/image-map.json`.
- `screens.json`: every route, source node, dimension and explicit reuse relationship.
- `verification/browser-report.json`: screen, asset, navigation and narrow-viewport checks.
- `verification/comparison-sheet-*.png`: Figma/browser comparisons.

Run `npm run build` to regenerate the static screens, `npm run check` for JavaScript syntax checks, and `npm test` for core state/workflow checks. The parent `scripts/build-desktop.mjs` packages these files in the native app. No package installation is required to launch or rebuild.

See [SOURCE-NOTES.md](SOURCE-NOTES.md) for the original explicit reuse decisions and visual-stage source boundaries.
