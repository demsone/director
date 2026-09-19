# Director v2.5 — Figma Transcription

## Role

You are performing **design transcription only**.

Your task is:

**APPROVED FIGMA → HTML/CSS + REQUIRED ASSETS**

You are not designing Director.

You are not implementing Director.

You are not filling product gaps.

You are reproducing the supplied approved design literally.

## Objective

Create a complete static HTML/CSS visual prototype of the approved Director v2.5 Figma interface.

The prototype will become the visual baseline for the production application after Diego approves it.

Accuracy is more important than architecture.

## Source of truth

Use sources in this order:

1. Current approved Director v2.5 Figma design
2. Supplied reference PNG/JPG exports, where available
3. `director-v2-5-naming-cleaned-figma-export.json`

Do not use previous Director implementations as visual references.

In particular, do not use the previous standalone Prompts implementation as a design source.

## Required screens

Transcribe all of the following.

### Director

* `Director / New Feedback`
* `Director / Feedback + Chat`

### Compare

* `Director / New Compare`
* `Director / Compare`

### Darkroom

* `Darkroom / Library`
* `Darkroom / Quick View`
* `Darkroom / Feedback + Chat`

### Projects

* `Projects / All`
* `Projects / Quick View`
* `Projects / Detail / Overview`
* `Projects / Detail / Feedback`
* `Project / Settings`

### Feedback

* `Feedback / Detail`

### Prompts

* `Prompts / All`
* `Prompts / Edit`

### Settings

* `Settings / Models`
* `Settings / Personalisation`
* `Settings / Appearance`

### Compare

* `Compare / Result`

## Explicit exclusions

Do NOT transcribe as product screens:

* `Projects / Legacy / Darkroom`
* `Notes`
* `Compare / Notes`
* the Components page itself
* loose component demonstrations
* annotations or designer notes

Do NOT create:

* Design Studio
* Settings / Storage
* Settings / Keyboard
* Settings / About
* Project / Compare
* Project / Notes
* new empty states
* new loading states
* new error states

Those are intentionally outside this transcription phase.

## Design fidelity

Reproduce the approved Figma literally.

Match:

* overall frame dimensions
* sidebar width and position
* top bars
* content widths
* spacing
* alignment
* padding
* margins
* typography
* font weights
* line heights
* letter spacing
* colours
* borders
* border opacity
* radii
* shadows/effects
* icon size and placement
* images
* image crops
* cards
* grids
* dividers
* badges
* tabs
* form fields
* prompt composer
* drawers
* scrolling/overflow
* page hierarchy

Do not replace explicit Figma values with generic web conventions.

## Design tokens

Use the supplied Director variables wherever possible.

Relevant collections include:

* `Color / UI`
* `Color / Director`
* `Color / Base`
* `Dimensions`
* `Typography`
* `Effects`
* `Layout`

Primary typography:

* Plus Jakarta Sans
* IBM Plex Mono where represented by the design

Do not create an alternative token system.

## Components

Use the Figma Components page as a reference for repeated visual elements.

Reuse markup/CSS where this helps fidelity, but do not abstract simply for engineering elegance.

A straightforward repeated implementation is preferable to an abstraction that changes the design.

## Behaviour

This phase is primarily static.

Minimal interaction may be added only to make approved visual states inspectable, for example:

* opening an already-designed drawer
* switching between already-designed Settings states
* switching between already-designed project tabs
* showing an already-designed edit state

Do not implement application functionality.

No:

* API/model integration
* LM Studio integration
* persistence
* database
* localStorage product logic
* file management
* prompt execution
* generated feedback
* chat backend
* comparison logic
* project data model
* authentication
* cloud services

Use static Figma content.

Repeated sample cards/data are **layout fixtures**, not application data.

Do not interpret repeated sample content as records that need to be seeded into a database.

## No redesign rule

Do not:

* modernise
* simplify
* embellish
* improve
* make more responsive than the source
* substitute your own UI patterns
* add dashboard widgets
* add gradients
* add animations
* add missing pages
* invent new controls
* change copy
* change hierarchy
* change navigation

If something appears unusual but is explicit in Figma, reproduce it.

If something is genuinely ambiguous, list the ambiguity rather than deciding to redesign it.

## Implementation location

Create the transcription in a clearly isolated visual-prototype area or clean build branch.

Do not make the failed standalone Prompts implementation the foundation of this work.

Do not overwrite unrelated user files.

## Acceptance criteria

The transcription is ready for Diego's review only when:

1. Every required approved screen exists.
2. Every required screen is visibly recognisable as its Figma source.
3. Layout dimensions match the source.
4. Typography matches.
5. Colour treatment matches.
6. Sidebar and navigation match.
7. Cards and grid geometry match.
8. Feedback/chat screens match.
9. Compare screens match.
10. Darkroom layouts match.
11. Project layouts match.
12. Prompts library and editor match.
13. Settings states match.
14. Quick View/drawer treatments match.
15. Compare Result matches.
16. No excluded legacy/Notes frames appear as product screens.
17. No Design Studio page has been invented.
18. No product functionality has been implemented behind the prototype.
19. No previous standalone Prompts UI has contaminated the approved design.
20. There are no obvious console/rendering errors.

## Completion

When the full transcription is complete:

STOP.

Return:

* location of the prototype
* files created/changed
* list of screens completed
* any source ambiguities encountered
* any assets that could not be reproduced exactly

Do not begin functional implementation.

Do not self-approve the prototype.

Diego is the approval gate.
