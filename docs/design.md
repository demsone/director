# DIRECTOR — DESIGN.md

Director is a private desktop workspace for creative critique, comparison and visual decision-making.

This document defines the visual character and design rules of Director.

It supplements the approved Figma design.

It does not replace Figma.

---

## 1. DESIGN SOURCE OF TRUTH

When implementing or modifying Director UI, use this order:

1. Approved Director Figma design
2. Approved reference images / screenshots
3. Figma JSON export
4. Approved HTML/CSS visual baseline
5. This DESIGN.md
6. Written product requirements

If an explicit Figma design exists, reproduce it.

Do not reinterpret an existing screen from this document.

This document governs areas where Figma does not provide an explicit answer.

---

# 2. DESIGN INTENT

Director should feel like a professional creative tool.

It combines the character of:

- a photographer's digital darkroom
- an editorial contact sheet
- a design studio workbench
- a native desktop utility
- an archival image browser
- a focused creative-direction workspace

Director is not trying to look futuristic.

It should feel useful, quiet, precise and mature.

The interface should disappear behind the work.

The photograph, design, critique or comparison is always more important than the UI surrounding it.

---

# 3. CORE CHARACTER

Director is:

**Dark**  
Dark graphite rather than pure black.

**Compact**  
Efficient use of space without feeling cramped.

**Editorial**  
Strong hierarchy, typography and image presentation.

**Tactile**  
Subtle material differences between surfaces.

**Restrained**  
Very little decoration.

**Warm**  
Warm neutrals and terracotta accents prevent the interface becoming cold or technical.

**Precise**  
Alignment, spacing and component behaviour should feel deliberate.

**Creative**  
It should feel at home beside photography and design work.

---

# 4. WHAT DIRECTOR IS NOT

Director is not:

- a SaaS dashboard
- a generic AI interface
- a marketing website
- a social product
- a productivity template
- a chatbot with navigation added around it
- a component-library demonstration
- a futuristic AI product

Avoid:

- blue/purple AI gradients
- glassmorphism
- glowing borders
- excessive blur
- oversized rounded cards
- giant pill buttons
- decorative dashboards
- huge whitespace
- huge marketing typography
- floating chat bubbles
- neon accents
- excessive animation
- cute illustrations
- sparkle/star AI iconography
- generic dashboard statistics
- visual decoration without function

If something starts looking like a generic AI SaaS product, simplify it.

---

# 5. COLOUR

Use the existing Director variables.

Primary collections include:

- `Color / UI`
- `Color / Director`
- `Color / Base`

Always prefer semantic UI variables over raw colour values.

Do not introduce new colours when an existing Director variable can perform the role.

## Colour character

Primary surfaces:
- graphite
- charcoal
- warm off-black

Secondary surfaces:
- subtly lighter or darker warm greys

Primary accent:
- burnt orange / terracotta

Status colours:
- muted and functional
- never fluorescent

Text:
- warm white or light grey rather than harsh pure white where appropriate

Borders:
- subtle
- low contrast
- used to establish structure rather than decoration

## Accent usage

Accent colour should be scarce.

Use it for:
- selected states
- important controls
- active navigation
- useful status information
- focused interaction

Do not flood large areas with the accent colour.

Scarcity gives the accent meaning.

---

# 6. SURFACES

Director uses tonal hierarchy more than visual effects.

Prefer:

- subtle surface changes
- thin borders
- inset/sunken regions
- restrained depth

Avoid:

- large floating cards
- heavy shadows
- dramatic elevation
- excessive blur

A panel should look elevated only when elevation communicates behaviour.

Examples:
- quick-view drawer
- popup menu
- model selector
- modal/dialog

Normal page content should generally remain visually integrated with the application surface.

---

# 7. TYPOGRAPHY

Primary family:

**Plus Jakarta Sans**

Use for:
- headings
- body text
- buttons
- labels
- navigation
- descriptions
- feedback

Technical / alternate family:

**IBM Plex Mono**

Use selectively for:
- model names
- paths
- technical metadata
- system information
- timestamps where appropriate
- utility labels where defined by Figma

Do not introduce additional font families without explicit approval.

---

## TYPOGRAPHIC CHARACTER

Typography should be:

- compact
- readable
- understated
- editorial
- structured

Avoid oversized headings.

Director is an application, not a landing page.

Hierarchy should come from:

- size
- weight
- spacing
- position
- contrast

not spectacle.

---

# 8. TEXT HIERARCHY

Typical hierarchy:

### Page context

Small, restrained contextual label or breadcrumb.

Example:

`DIRECTOR / DARKROOM`

### Page heading

Clear primary heading.

Example:

`The Darkroom`

### Supporting text

Short explanatory text where required.

### Section heading

Compact and visually secondary to the page heading.

### Metadata

Small.

Often suitable for muted colour or monospace treatment.

### Labels

Short and direct.

Avoid verbose interface language.

---

# 9. SPACING

Use existing Director spacing variables from `Dimensions`.

Do not invent arbitrary spacing when a suitable token exists.

Director uses relatively compact spacing.

The interface should feel dense enough for professional work while remaining calm.

Maintain consistent:

- vertical rhythm
- panel padding
- card gaps
- toolbar spacing
- label-to-control spacing
- section separation

Avoid expanding spacing simply to make a page feel "premium".

---

# 10. RADIUS

Use existing radius variables.

Director generally favours modest corner radii.

Rounded corners should soften utility surfaces without making the application feel playful.

Avoid:
- oversized card radius
- excessive pill shapes
- bubble-like containers

Pills are appropriate primarily for:
- badges
- status indicators
- compact filters where explicitly designed

---

# 11. BORDERS

Hairline borders are an important part of Director's visual structure.

Use them to:

- separate panels
- define fields
- divide metadata
- establish card boundaries
- separate tools
- reinforce hierarchy

Borders should usually remain subtle.

Avoid strong boxed layouts unless Figma explicitly calls for them.

---

# 12. ICONS

Use the approved Director icon set.

Icons are functional.

They should be:

- simple
- restrained
- consistent in weight
- aligned precisely
- sized consistently

Do not introduce decorative icons.

Do not use sparkle icons to represent AI.

If text communicates an action better than an unfamiliar icon, prefer text.

---

# 13. BUTTONS

Buttons should feel utilitarian and immediate.

Use the existing button component system.

Primary actions should be obvious without dominating the page.

Secondary actions should remain visually quieter.

Avoid:
- giant CTA buttons
- excessive pills
- gradients
- glowing buttons
- decorative button treatments

Button labels should use direct verbs.

Examples:

- Get Feedback
- Compare
- Save Feedback
- Update Comparison
- Add Prompt
- Save
- Cancel

---

# 14. FORMS

Forms should remain compact.

Prefer:

- visible labels
- clear field boundaries
- predictable alignment
- concise help text
- existing form components

Do not rely heavily on placeholder text as the only label.

Technical configuration can use monospace where appropriate.

---

# 15. NAVIGATION

Director uses a persistent sidebar.

Primary navigation areas:

- Director
- Design Studio
- Darkroom
- Projects
- Prompts
- Settings

Navigation should remain visually quiet.

The active location should be clear but not visually loud.

Do not turn navigation into large destination cards or a dashboard.

---

# 16. DIRECTOR WORKSPACE

Director is the primary working surface.

Its two primary modes are:

- Feedback
- Compare

These should feel like two versions of the same creative workflow, not separate applications.

The UI should prioritise:

1. source material
2. prompt/context
3. feedback
4. conversation

The model itself is infrastructure.

Do not make model selection visually more important than the creative work.

---

# 17. FEEDBACK

Feedback is centred around a single source.

The source may be:

- photography
- design
- UI
- layout
- poster
- visual reference
- other creative material

The feedback surface should feel editorial.

Long responses should remain highly readable.

Conversation belongs directly below or alongside the critique according to the approved layout.

Do not convert feedback into generic chat bubbles unless the approved design explicitly uses them.

---

# 18. COMPARE

Compare supports visual decision-making between multiple sources.

Typical examples:

- 3 similar photographs
- sequence candidates
- alternate edits
- several design mockups
- several UI directions

The source material must remain visually dominant.

The interface should help answer:

**Which is strongest, and why?**

Comparison should visually support:

- ranking
- winner
- reasoning
- individual strengths/weaknesses

Avoid turning Compare into a spreadsheet or analytics dashboard.

---

# 19. DARKROOM

Darkroom is Director's photography library.

Visual character:

- contact sheet
- archive
- working edit
- photographic collection

Images should dominate cards.

Metadata is secondary.

The grid should feel like a professional image browser rather than a media gallery.

Darkroom contains photography only.

---

# 20. DESIGN STUDIO

Design Studio is the design equivalent of Darkroom.

It uses the same visual system.

Do not invent a separate Design Studio design language.

Use Darkroom's:

- grid logic
- card structure
- detail layouts
- quick-view behaviour
- metadata hierarchy

Change the content domain, not the visual grammar.

Design work may include:

- UI mockups
- screens
- layouts
- posters
- identity studies
- visual directions
- design systems
- creative concepts

---

# 21. PROJECTS

Projects are cross-disciplinary containers.

A Project may contain:

- photography feedback
- design feedback
- Compare sessions
- notes
- conversations
- selected outputs

Projects must therefore remain visually neutral between photography and design.

A project may be:

- Photography
- Design
- Mixed

Use existing Director card and content patterns.

Do not design Projects as a project-management application.

No:
- kanban
- task management
- timelines
- productivity dashboards

Projects organise creative work.

Nothing more.

---

# 22. PROMPTS

Prompts are working creative tools.

The Prompts library should feel like the rest of Director, not like an AI prompt marketplace.

Each prompt contains:

- name
- category
- use type
- short description
- body
- archive state

Categories include:

- Photography
- Design Studio
- Compare
- General

Prompts should be editable.

Premade prompts are starting points.

No:
- popularity scores
- marketplaces
- social sharing
- AI-generated badges
- gamification

---

# 23. SETTINGS

Settings should feel like a desktop preferences panel.

Use the existing Director settings patterns.

Settings areas may include:

- Models
- Personalisation
- Appearance
- Storage
- Keyboard
- About

Use repeated Settings layouts rather than inventing new layouts per section.

Keep controls direct.

Do not turn Settings into an administrative dashboard.

---

# 24. IMAGERY

Visual source material is first-class content.

Never treat photography or design images as decorative wallpaper.

Preserve:
- aspect ratio
- crop intent
- useful image detail

Use appropriate object-fit/cropping according to the designed component.

Thumbnail grids should remain visually consistent without destroying the source material.

---

# 25. EMPTY STATES

Empty states should be quiet and useful.

They should answer:

1. What is empty?
2. What can I do next?

Examples:

`No feedback yet.`

`Drop a source here to begin.`

`No projects yet.`

`Create a project to organise related work.`

Avoid:
- illustrations
- celebration graphics
- excessive explanation
- marketing copy

---

# 26. ERROR STATES

Errors should be plain, visible and recoverable.

Examples:

- Model unavailable
- Connection failed
- Source could not be read
- At least two sources are required
- Maximum six sources

State:
- what happened
- what the user can do

Avoid alarming styling unless the condition is genuinely dangerous.

---

# 27. MOTION

Motion should be restrained.

Use motion only to clarify:

- opening/closing a drawer
- menu appearance
- selected state
- loading/progress
- navigation transition

Keep animations short.

Avoid:
- bouncy spring animations
- decorative motion
- parallax
- animated gradients
- constant movement

Director should feel stable.

---

# 28. COPY

Director's voice is:

- concise
- direct
- intelligent
- calm
- human

Avoid:

- marketing language
- AI hype
- excessive friendliness
- vague encouragement
- anthropomorphising the model
- corporate jargon

Prefer:

`Get Feedback`

over:

`Let Director work its magic`

Prefer:

`Model unavailable`

over:

`Oops! Something went wrong with your AI companion!`

---

# 29. AI VISUAL LANGUAGE

Director contains AI functionality but should not visually advertise AI.

Do not use:

- sparkles
- magic wand metaphors
- robot imagery
- brain imagery
- glowing AI gradients
- "powered by AI" decoration

The model is a tool.

The creative work is the subject.

---

# 30. RESPONSIVE BEHAVIOUR

Director is desktop-first.

Do not compromise the desktop working environment to satisfy arbitrary mobile conventions.

Responsive behaviour should preserve:

- usable source previews
- readable critique
- stable navigation
- working grids
- usable comparison

Follow explicit approved responsive designs if available.

Otherwise favour practical desktop scaling.

---

# 31. ACCESSIBILITY

Maintain:

- readable contrast
- clear focus states
- usable control targets
- keyboard accessibility
- semantic HTML where practical
- meaningful labels

Accessibility improvements should preserve the visual design rather than redesign it.

---

# 32. IMPLEMENTATION RULE

When building a screen not explicitly designed in Figma:

1. Find the closest approved Director screen.
2. Reuse its layout.
3. Reuse its components.
4. Reuse its tokens.
5. Change only what the new function requires.

Never begin a missing screen from a blank generic UI template.

---

# 33. ANTI-DRIFT RULE

Before adding a new visual pattern, ask:

**Does Director already solve this problem somewhere else?**

If yes, reuse that pattern.

New patterns should be rare.

Consistency is more important than novelty.

---

# 34. FINAL DESIGN TEST

Before accepting new UI, ask:

### Does it look like Director?

Would this screen naturally belong beside Darkroom, Feedback and Compare?

### Does the work dominate?

Is the photograph/design more important than the surrounding interface?

### Is it quiet?

Is anything drawing attention without helping the task?

### Is it compact?

Has unnecessary spacing or oversized UI crept in?

### Is it specific?

Does this feel like Director, or could it belong to any AI SaaS product?

### Did we reuse the system?

Could an existing Director component have solved this?

If the answer to any of these is wrong, correct the UI before proceeding.

---

# 35. DESIGN PRINCIPLE

Director exists to help someone look more closely at creative work.

The interface should do the same.

**Quiet tools.  
Strong images.  
Clear judgement.  
No bullshit.** 