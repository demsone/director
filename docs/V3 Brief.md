DIRECTOR V3 — COMPARE

Objective

Add Compare to the existing verified Director V2 application.

Director V1 already provides:
Image → Prompt → Feedback → Follow-up Chat

Director V2 adds:
Persistent sessions → History → Quit/Reopen → Continue

V3 adds:
Two Images → Compare Prompt → Comparative Feedback → Follow-up Chat → Persistent Compare Session

Do not redesign Director.
Do not integrate the approved visual HTML/CSS.
Do not implement Projects, Libraries, Design Builder, collections, or unrelated features.

The existing V1/V2 behaviour is protected and must not regress.


SOURCE OF TRUTH

Functional source:
The existing working Director V2 application.

Product requirement:
Compare is part of Director and must use the same session/persistence/model architecture as normal feedback.

Visual reference files are NOT application source and must remain untouched.

Do not serve, import, extend, or wire application logic into the Astra-generated HTML reference files.


COMPARE SCOPE

V3 supports exactly TWO images per Compare session.

Do not generalise to arbitrary image counts in this phase.

The user must be able to:

- choose/drop Image A
- choose/drop Image B
- preview both
- replace either before submission
- choose a Compare prompt
- select a loaded vision model using the existing model selection mechanism
- generate comparative feedback
- continue chatting about both images
- save automatically using the existing persistence architecture
- quit Director
- reopen the Compare session
- see both images and all previous feedback/chat
- continue the conversation with both images still available as context
- rename the Compare session
- delete the Compare session


SESSION ARCHITECTURE

Do not create an independent persistence system for Compare.

Extend the existing session architecture.

A Compare session should be identifiable with something equivalent to:

type: "compare"

It must persist at minimum:

- session ID
- type
- created timestamp
- updated timestamp
- title
- Image A
- Image B
- durable Director-owned copies/references for both images
- metadata already retained by Director
- selected Compare prompt
- exact prompt content used
- model identifier
- original comparative feedback
- complete follow-up chat
- schema/version information required by the existing persistence layer

Existing single-image feedback sessions must continue to load exactly as before.

Do not break or silently migrate existing sessions unless a schema migration is actually required.

If migration is required, make it backward-compatible and test existing V2 data.


MODEL CONTEXT

The initial comparison request must send BOTH images to the same vision-capable model request.

Make their identities unambiguous to the model as Image A and Image B.

Follow-up conversation must preserve sufficient context for the model to understand which image is being discussed.

Questions such as these must work after the session has been reopened:

- "Which composition holds together better?"
- "Look again at Image B's right edge."
- "Would these work together in a series?"
- "Compare the colour relationships."
- "What changes if I crop Image A more tightly?"

The user must not have to upload either image again.


COMPARE FEEDBACK

Create a small initial Compare prompt set as data, using the same prompt architecture as Director's existing prompts.

Do not hard-code the comparison response into the UI.

The primary general Compare prompt should ask for useful comparative visual analysis such as:

1. Overall relationship between the images
2. What Image A does well
3. What Image B does well
4. Important differences
5. Composition / gesture / timing
6. Light / colour / contrast / tonal relationships
7. Relative weaknesses or unresolved elements
8. Crop or edit considerations
9. Whether they work together / possible series relationship
10. If one currently reads more strongly, explain the specific visual reasons
11. Short human note

Do not force a winner when the images have different strengths or when the comparison is genuinely unresolved.


PHOTOGRAPHY CRITIQUE POLICY

Apply the following rules to Director's photography critique behaviour, including Compare.

These are shared critique rules, not one-off wording for a particular photograph.

DESCRIBE EFFECT BEFORE INTENT.

Analyse what is visible in the photograph rather than inventing an account of how it was made.

Do not infer that elements were:

- intentional
- accidental
- deliberate
- staged
- planned
- unplanned
- posed
- spontaneous

unless the user explicitly supplies that information or it is genuinely established by context.

Do not claim to know what the photographer "meant", "waited for", "placed", or "intended".

Street photography can contain observation, instinct, timing, coincidence, movement and emergent relationships without fitting an intentional-versus-accidental binary.

Prefer visual descriptions such as:

- creates
- functions as
- balances
- competes with
- frames
- interrupts
- echoes
- introduces tension
- reads as
- draws attention

PRESERVE AMBIGUITY WHEN THE PHOTOGRAPH PRESERVES AMBIGUITY.

Do not infer a photographed person's thoughts, emotions, personality, motivation or mental state as fact.

For example, do not state:
"he is lost in thought"

Prefer:
"his lowered gaze can suggest introspection, while the image leaves his state unresolved"

Describe visible gesture, expression, posture, gaze and spatial relationship before offering possible interpretations.

Do not use the word:

"candid"

Do not use phrases such as:

- clearly intentional
- accidental clutter
- deliberately framed
- perfectly timed
- captured more deliberately
- you waited for
- you meant to

When discussing light, describe visible qualities before assigning a specific time of day unless the evidence is strong.

When discussing print potential, evaluate how the image's visual qualities may translate to print. Do not default to boilerplate warnings about resolution or colour profiles unless relevant metadata is actually available.


UI

Keep V3 visually utilitarian and consistent with the existing barebones V2 interface.

Do not reproduce the Figma design.

Add only enough interface to make Compare understandable and testable.

A simple mode/navigation distinction between Feedback, Compare and History is acceptable.

Do not perform visual polish beyond what is required for usability.


ERROR HANDLING

Handle at minimum:

- only one of the two images supplied
- invalid image
- selected model unavailable
- model does not support vision
- malformed model response
- one persisted image asset missing
- corrupt Compare session
- interrupted persistence write
- session deleted while open

An error in one Compare session must not damage unrelated Feedback or Compare sessions.


TESTING / ACCEPTANCE

V3 is not complete until the following is tested end-to-end:

1. Existing single-image Feedback still works.
2. Existing V2 saved sessions still open.
3. Start a new Compare session.
4. Add two different images.
5. Generate comparative feedback.
6. Confirm the model demonstrably saw both images.
7. Ask at least two follow-up questions referring separately to Image A and Image B.
8. Confirm it keeps the images distinct.
9. Quit Director completely.
10. Relaunch.
11. Open the Compare session from History.
12. Confirm both images survive.
13. Confirm comparison feedback survives.
14. Confirm prior chat survives.
15. Ask another question referring to one specific image.
16. Confirm the model retains both-image context.
17. Rename the Compare session.
18. Restart and verify the rename persists.
19. Delete the Compare session.
20. Restart and verify it remains deleted.
21. Confirm an unrelated Feedback session remains intact.
22. Run the complete existing V1/V2 test suite.
23. Confirm no regressions.

If any of these fail, V3 is not complete.


PROTECTED AREAS

Do not:

- redesign Director
- use visual-v4 HTML as production code
- modify approved visual reference files
- introduce React/Vue/etc merely for Compare
- replace the working persistence architecture unnecessarily
- rewrite the existing model client unless required for Compare
- add Projects
- add Libraries
- add Design Builder
- add arbitrary multi-image comparison
- refactor unrelated working code
- begin V4


GIT

Before implementation:

- verify current branch is director-v3-compare
- verify V2 has been committed/tagged
- confirm the working tree is clean

Work only on the V3 branch.

When all acceptance criteria pass:

commit with:

Director v3: compare sessions and image-aware chat

Do NOT merge, tag, redesign, or begin V4 automatically.

Stop and report:

- files changed
- architecture changes
- tests run
- manual acceptance tests completed
- any known limitations