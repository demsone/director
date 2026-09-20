# DIRECTOR V5 — INTEGRATION MAP

**Status:** Sol planning baseline
**Execution:** Luna High, one bounded state-family at a time
**Visual audit:** Astra Medium after Diego approval
**Functional baseline:** `director-v4-functional-audited`
**Working branch:** `director-v5-visual-integration`

## 1. Core rule

V5 is **not** a design or transcription task.

The approved Astra package in `assets/visual-v4/` is the visual implementation baseline. The audited V4 application is the behaviour baseline.

The job is:

> **Bind the audited Director functionality behind the exact approved donor markup.**

No worker may redraw, reinterpret, modernise, simplify, rename, reorganise, or recreate the interface.

## 2. Source of truth

**Visual authority**
1. Approved Figma
2. Approved Astra donor HTML/CSS in `assets/visual-v4`
3. Figma JSON / build contracts for verification

**Functional authority**
1. `director-v4-functional-audited`
2. Existing production APIs/persistence
3. Existing audited V4 behaviour

The donor package is the visual source. The V4 app is the functional source. Neither replaces the other.

## 3. Immutable donor files

Do not edit these during integration:

- `assets/visual-v4/*.html`
- `assets/visual-v4/tokens.css`
- `assets/visual-v4/visual.css`
- `assets/visual-v4/assets/**`
- `assets/visual-v4/source/**`

Production should consume these files or their DOM/CSS directly.

Do not create “similar” markup when a donor state already exists.

## 4. Permitted runtime mutations

The binding layer may change only real application data:

- filename/session title/date/meta text
- model name and status
- uploaded image `src`
- prompt name/body
- critique output
- chat turns
- project/library/session names and counts
- disabled/selected/pending state
- routing/click handlers
- non-visual `data-*` / `aria-*`
- asset URLs required for production serving

Without Diego approval, do **not** change:

- donor DOM hierarchy
- donor class names
- spacing
- typography
- dimensions
- colours
- borders/radii
- icon placement
- navigation labels
- section hierarchy
- responsive behaviour
- empty/loading/error layouts

If current functionality has no approved visual destination, report the conflict. Do not invent a container.

## 5. Donor runtime rule

`assets/visual-v4/functional-runtime.js` and `director-core.js` may be read only for DOM-binding technique.

Do **not** reuse their localStorage/IndexedDB state model, persistence, model transport, project state, prompt persistence, or request construction.

Useful DOM techniques may be adapted narrowly: locating donor nodes, setting fixture text/images, making donor elements clickable, mounting existing drawers, and binding chat/editor controls.

## 6. Production architecture

Preferred architecture:

1. Keep `public/index.html` as the production entry.
2. Serve `assets/visual-v4` read-only under `/visual-v4/`.
3. `public/app.js` fetches the required donor HTML state.
4. Parse with `DOMParser`.
5. Import the donor `.source-frame` into a neutral app mount.
6. Do **not** load donor `functional-runtime.js`.
7. Bind audited V4 state/actions to the imported donor DOM.
8. Replace only fixture content.

A valid entry shell is visually neutral:

```html
<body>
  <div id="director-app"></div>
</body>
```

### Narrow server exception

`server.mjs` may be changed only as needed to serve `/visual-v4/` read-only from `assets/visual-v4`.

That route must reject traversal and must not alter APIs, persistence, models, sessions, database schema, or critique policy.

### Asset normalisation

Runtime may normalise donor resource paths only, e.g.:

`assets/images/...` → `/visual-v4/assets/images/...`
`/assets/icons/...` → `/visual-v4/assets/icons/...`

## 7. Functional/controller boundary

Existing production logic remains authoritative for:

- image data
- prompts
- models
- feedback/compare requests
- cancellation
- chat
- sessions/history
- projects
- library memberships
- persistence/restart
- rename/delete
- critique-policy enforcement

The visual adapter owns only:

- donor screen selection
- inserting data into donor fixture slots
- attaching existing actions
- reflecting pending/disabled/error state
- repeating approved donor card components for lists

No business state belongs in donor templates.

## 8. State → donor map

| Director state | Exact donor |
|---|---|
| New feedback | `feedback-new.html` |
| Feedback pending | `feedback-thinking.html` |
| Completed feedback + chat | `feedback-complete.html` |
| Reopened feedback | `feedback-detail.html` |
| New compare | `compare-new.html` |
| Compare pending | `compare-thinking.html` |
| Completed compare + chat | `compare-complete.html` |
| Reopened compare | `compare-detail.html` |
| Photography Library | `darkroom.html` |
| Photography quick view | `darkroom-quick.html` |
| Photography detail | `darkroom-detail.html` |
| Design Library | `design-studio.html` |
| Design quick view | `design-studio-quick.html` |
| Design detail | `design-studio-detail.html` |
| Projects list | `projects.html` |
| Project session view | `project-feedback.html` |
| Project quick view | `project-quick.html` |
| Compare Library | `compare-library.html` — deferred unless V5 explicitly needs a separate Compare Library |
| Compare Library detail | `compare-library-detail.html` |
| Prompts | OUT OF CURRENT FUNCTIONAL SCOPE |
| Settings | OUT OF CURRENT FUNCTIONAL SCOPE |

## 9. Unresolved mappings — do not improvise

### History

Audited V4 has a combined History view. The donor package has no dedicated History screen.

**Do not design History during Feedback/Compare integration.**
History gets its own later mapping. Darkroom is the likely visual family, but Diego must approve that mapping.

### Organisation / membership editing

V4 supports Photography Library, Design Library and Project memberships, including multiple memberships.

There is no one-to-one donor for the existing “Organise session” panel.

**Do not recreate `ORGANISE THIS SESSION`.**
Membership UI is deferred to its own mapping batch.

### Donor Prompts / Settings navigation

Donor sidebar contains Prompts and Settings, but audited V4 does not implement those features.

Do not implement fake pages. Do not add those features in V5 visual integration.

Navigation treatment is a later dedicated pass.

### Project Overview / Notes

Donor project screens contain Overview / Feedback / Notes concepts that exceed audited V4.

Do not add project notes/activity/counters just because fixture content exists.

## 10. Feedback-family binding map

### `feedback-new.html`

Bind:

- Model Bar → loaded selected vision model/status
- donor file/drop area → Image A selection/drop
- fixture image → selected preview
- Source Type → current prompt/category context only
- Prompt → current feedback prompt
- prompt body → current prompt instruction
- `GET FEEDBACK` → existing `POST /api/feedback`

Do **not** add session-type selectors, generic refresh cards, History panels, organisation panels, numbered generic headings, or new status boxes.

Project Link is **not** to be given new membership semantics in Batch 1.

### `feedback-thinking.html`

Bind selected image, filename/title, model, prompt/category, and existing pending state.

Bind cancellation only if an approved donor control provides a clear destination.

Do not invent a loading banner or progress panel.

### `feedback-complete.html`

Bind:

- saved image
- session title
- saved model/current availability
- prompt category/name/body
- structured review sections into donor output geometry
- saved chat
- Ask Director composer → existing `/api/chat`
- New Feedback → existing clear/new action
- toolbar pencil → Rename only if semantic match is confirmed
- toolbar bin → Delete
- toolbar Star → leave unbound/report; no audited semantic
- Project Link → deferred membership mapping

Do not modify typography/layout to fit variable critique length.

### `feedback-detail.html`

Use for reopened feedback.

Bind persisted Date Created, Source Type, Prompt Used, Review By, image, title, feedback, model bar, chat and composer.

Project metadata is bound only after organisation mapping is approved.

## Future build — Ask Director chat

> FUTURE BUILD — ASK DIRECTOR CHAT
>
> The current V5 transcript is a functional production adapter, not the final approved chat design.
>
> Diego intends to revisit the Ask Director chat interface in a dedicated future visual pass.
>
> Do not treat the current transcript styling/layout as the permanent visual baseline beyond the current Batch 1 integration.

## 11. Compare-family binding map

### `compare-new.html`

Bind exactly two images, compare prompt, model, and:

`COMPARE SOURCES` → existing `POST /api/compare`

Current Director supports exactly two images. Do not implement donor 2–6 image behaviour or add source slots.

### `compare-thinking.html`

Bind existing pending Compare state. Preserve A/B identity. No new progress component.

### `compare-complete.html`

Bind A/B images, comparison output, prompt, model, chat, composer and New Comparison.

Donor recommendation fixtures imply more than two options. Director V4 does not.

Do not invent ranked multi-image recommendations. If the recommendation region cannot map cleanly to two-image output, stop on that region and report it.

### `compare-detail.html`

Canonical reopened comparison view. Do not substitute single-feedback detail.

## 12. Libraries

### Photography Library

Functional source: current Photography Library endpoint/data.
Visual source: `darkroom.html`.

Each real session becomes one donor `UI / File Thumb`.

Bind only actual thumbnail/title/type/date/open action.

Do **not** add generic stacks of Open/Rename/Organise/Remove/Delete buttons.

Quick view: `darkroom-quick.html`
Full detail: `darkroom-detail.html`

### Design Library

Visual source: `design-studio.html`.

Use the supplied Astra clone literally. Do not rebuild it manually from Darkroom.

## 13. Projects

Use:

- `projects.html`
- `project-feedback.html`
- `project-quick.html`

Bind only audited V4 Project/session data and mutations.

No fabricated counts, activity, Notes, summaries or seeded cards.

## 14. Locked API contract

| Purpose | Existing API |
|---|---|
| Prompts | `GET /api/prompts` |
| Models | `GET /api/models` |
| Sessions | `GET /api/sessions` |
| Open/rename/delete session | `/api/sessions/<id>` |
| Feedback | `POST /api/feedback` |
| Compare | `POST /api/compare` |
| Chat | `POST /api/chat` |
| Organisation | `GET /api/organisation` |
| Library/project contents | `GET /api/(libraries|projects)/<id>` |
| Memberships | `GET /api/sessions/<id>/memberships` |
| Add/remove membership | `PUT/DELETE /api/(libraries|projects)/<id>/sessions/<session-id>` |
| Create project | `POST /api/projects` |
| Rename/delete project | `/api/projects/<id>` |

Do not redesign these APIs for visual integration.

## 15. Phase boundaries

### BATCH 1 — FEEDBACK FAMILY — GO

Donors:

- `feedback-new.html`
- `feedback-thinking.html`
- `feedback-complete.html`
- `feedback-detail.html`
- `tokens.css`
- `visual.css`
- required icons/images

Functional scope:

- upload/drop one image
- prompt selection
- model selection/status
- generate feedback
- cancellation where a donor control supports it
- structured feedback
- chat
- reopen feedback
- rename/delete where donor semantics match

Excluded:

- Compare
- History
- Projects
- Libraries
- organisation/membership UI
- Prompts
- Settings

**Do not begin Batch 2 until Diego approves Batch 1 visually.**

### BATCH 2 — COMPARE FAMILY — HOLD

Use `compare-new`, `compare-thinking`, `compare-complete`, `compare-detail`.

### BATCH 3 — LIBRARIES + HISTORY — HOLD

Use Darkroom and Design Studio donor families. History mapping and organisation UI require Diego approval first.

### BATCH 4 — PROJECTS — HOLD

Use Projects donor family. Do not implement donor-only functionality.

## 16. Test strategy

After each batch:

```bash
npm test
npm run check
git diff --check
```

Browser tests may receive selector updates only because the DOM changes. Assertions/behaviour must not be weakened.

For each integrated donor state:

1. capture donor reference at authored viewport;
2. capture bound production state at the same viewport;
3. compare geometry, typography, spacing, colours, borders, icons and hierarchy;
4. confirm no new visible production containers exist;
5. confirm donor `tokens.css` / `visual.css` remain style authority;
6. confirm narrow windows scroll rather than introducing a new mobile layout.

Luna does not self-approve visuals. Diego approves. Astra Medium audits after approval.

## 17. Git / recovery

Before Batch 1:

```bash
git switch director-v5-visual-integration
git status
git tag --list director-v4-functional-audited
```

If the failed Astra pass is still on V5, preserve then restore:

```bash
git branch failed/astra-v5-visual-pass-1
git reset --hard director-v4-functional-audited
git status
```

After verified Batch 1:

```bash
git add -A
git commit -m "Director v5: bind approved feedback interface"
```

Do not tag V5 yet.

## 18. Protected areas

Except for the narrow `/visual-v4/` static-serving adapter, do not modify:

- `src/core.mjs`
- `src/model.mjs`
- `src/store.mjs`
- critique policy
- database/session schema
- API semantics
- model request semantics
- persistence semantics

Expected work:

- `public/index.html`
- `public/app.js`
- optional presentation-only adapter modules under `public/`
- narrow static-serving code if required
- browser-test selector updates only when necessary

## 19. Failure rule

Stop the batch if Luna:

- creates visible layout absent from donor;
- replaces a donor component with a generic equivalent;
- changes navigation/structure without an approved mapping;
- alters backend behaviour to solve a visual problem.

If functionality conflicts with donor markup, report it. Do not improvise.

## 20. Batch 1 acceptance criteria

Batch 1 passes only if:

- New Feedback uses `feedback-new.html`
- Pending Feedback uses `feedback-thinking.html`
- Completed Feedback uses `feedback-complete.html`
- Reopened Feedback uses `feedback-detail.html`
- donor DOM/CSS are consumed directly, not recreated
- real image/prompt/model/feedback/chat data replace fixtures
- `/api/feedback` and `/api/chat` semantics are unchanged
- persistence and critique-policy behaviour are unchanged
- no new visible History/organisation/projects UI is introduced
- no generic substitute components are added
- deterministic tests pass
- feedback browser workflow passes
- matching reference/production screenshots are ready for Diego

Then STOP.

## 21. Luna High — Batch 1 handoff

> Implement **only Batch 1 — Feedback Family** from this map.
>
> Load the approved donor screens literally from `assets/visual-v4` and bind the current audited Director feedback functionality behind them.
>
> Do not design or transcribe anything.
>
> Do not recreate donor layout.
>
> Do not add visible UI.
>
> Do not implement Compare, History, Projects, Libraries, organisation, Prompts or Settings.
>
> The only permitted `server.mjs` change is a narrow read-only route needed to serve the donor package.
>
> Preserve current API, persistence, model and critique-policy behaviour.
>
> Run deterministic checks and the feedback browser workflow.
>
> Produce matching viewport donor/production screenshots.
>
> Commit only after functional checks pass:
>
> `Director v5: bind approved feedback interface`
>
> Then STOP for Diego visual approval.
