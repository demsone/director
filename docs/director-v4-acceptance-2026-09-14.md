# Director v4 corrective acceptance — 2026-09-14

## Browser workflows exercised

- Settings successfully discovered 28 models from local LM Studio. Feedback and Compare were configured with the already-loaded `gemma-4-e4b-uncensored-hauhaucs-aggressive` model; Fast Answers and both IDs survived browser reload.
- Feedback: uploaded `download-93-10140-2.png`, chose the persisted acceptance prompt and project, observed generating then completed, explicitly saved, opened it from Darkroom in the shared Quick View drawer, opened canonical saved detail, sent a contextual Ask Director message, and verified the chat persisted after reload.
- Compare: uploaded `download-93-10140-2.png` and `download-93-10140-3.png`, observed generating then completed. Navigating to Compare Library before Save showed no comparison record. The rerun was explicitly saved, reopened through the shared drawer and canonical detail, and its contextual chat persisted after reload.
- Projects: created Acceptance Project in the modal; cancelled a changed description and verified the original remained; saved a changed description and verified Overview. Feedback, Notes, and the shared drawer all rendered from the same relationship query.
- Prompts: created, edited, and archived an active prompt. The prior prompt was selected by the Feedback and Compare workflows, confirming the shared store path.

## Defects fixed during acceptance

1. Draft field updates could drop an already-selected project relationship. All draft updates now use functional state transitions.
2. Persisted model IDs disappeared from Settings after reload when the transient discovery list was empty. Select controls now retain configured IDs until a test refreshes the model list.
3. Quick View previously returned to a library rather than a canonical detail. It now opens the one record detail surface, whose contextual chat writes back to the saved record.
4. Project tabs were display-only. Overview, Feedback, and Notes are now selectable states over one project and the linked records query.

## Visual comparison

At the approved 1512px width, the functional Feedback new state was inspected beside `visual-v4/feedback-new.html` and its reference capture `visual-v4/verification/browser-feedback-new.png`. The active application now uses the exact local Astra font files and preserves the approved fixed 1512px canvas boundary. The immutable visual baseline was separately checked with `git diff --exit-code figma-approved-v1 -- visual-v4`.

The remaining canonical source captures consulted for state/layout reference were: Feedback generating/completed/detail; Compare new/generating/completed/detail; Darkroom library/quick/detail; Project overview/feedback/settings; Design Studio library/quick/detail; Prompts/prompt editor; Settings personalisation/appearance/models. No files in `visual-v4/` were edited.
