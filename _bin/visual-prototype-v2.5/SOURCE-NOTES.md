# Director v2.5 source notes

This is a static transcription for Diego's review, not an approved production baseline.

## Outstanding source checks

1. **Live Figma comparison remains unverified.** The supplied JSON identifies `Director v2.5`, exported on 7 September 2026 at 09:01 UTC, but does not contain a file URL/key. The attempt to read the open Figma desktop document timed out. A file URL has been requested. The current work uses the supplied screenshots and naming-cleaned JSON; it makes no claim about later canvas changes.
2. **Project / Settings backdrop is missing.** The frame and modal are transcribed from node `4008:1817`. Its background refers to image hash `d252e1e2efd3c430498ecc702b93928826f4f47c`, which is not supplied as an asset. There is also no Project Settings reference screenshot. The explicit dark modal overlay remains, with no invented background screen beneath it. This state cannot be called an exact visual match yet.
3. **Prompts / All text truncation is unspecified.** The first card's description node `I4013:3176;4013:3111;88:1185` contains 318 characters but has a fixed 31px height. The export omits text-truncation/ellipsis metadata, and this state has no supplied screenshot. The original copy and 31px box remain, with overflow clipped. Its exact final treatment needs the live frame or an export. The rest of this screen follows the supplied JSON.

## Source details preserved

- All 19 required screen frames retain their original width of 1512px and individual heights. Projects / All is only 389.714px high in the source; no project grid or empty state has been added.
- The drawer frames are 1644px high, with longer drawer content clipped by the source frame. The prototype preserves that clipping. The export does not include a separate scrolling interaction specification.
- Design Studio, Storage, Keyboard, Compare and Notes labels remain where the approved design visibly includes them. Excluded destinations have no product pages or working controls.
- Repeated cards, sample copy, typos, duplicate labels, and literal Markdown markers in feedback are preserved as static fixtures.
- Mixed border-edge weights are not present in the export. Sidebar, active navigation, tabs, drawer boundaries and row dividers were transcribed from the supplied screenshots. These are confined to existing boundaries.
- Text node bounds in the JSON are rounded. A 1px allowance inside text nodes prevents spurious browser wrapping without changing positioned node dimensions. Font metrics recover the cap-height text trimming used by the source.

## Asset provenance and limits

- Foreground interface content is actual HTML text, CSS shapes and supplied SVG icons. Screenshots are not used as full-screen substitutes for product interfaces.
- Six photograph crops were extracted from the supplied screen exports because the original Figma image bytes were not available. These reproduce the approved visible crops for 109 image nodes. Provenance is recorded in `assets/photo-provenance.json`. The available JPG raster quality limits reproduction at magnification.
- The drawer backdrop is already a bitmap in Figma. Its visible left 952px was extracted from the supplied Darkroom Quick View JPG, including the original dark veil. All three drawer states reference the same bitmap hash in the JSON; their foreground drawers remain HTML/CSS.
- Supplied SVGs are used for the icon outlines. Small rasterization differences between Figma and Chromium may remain; pixel-identical rendering is not claimed.
- Plus Jakarta Sans was copied from the installed font files. IBM Plex Mono and JetBrains Mono were bundled from Google Fonts' source repository, with OFL licenses. JetBrains Mono uses the export's explicit weight axis value of 600. The eight SF Pro text runs use macOS's native system font, retaining the source's variation settings. No font download is required when viewing the prototype.

## Phase boundary

No model/API integration, persistence, product data model, database, prompt execution, generated feedback, authentication or cloud service has been implemented. The Python server only serves static files on loopback. Save and execution controls are inert. Selected navigation links expose already-designed states. Diego's approval is required before this becomes the visual baseline for functional implementation.
