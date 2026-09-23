# Director — General Product Brief

## 1. Overview

**Director is an AI workspace for deliberately directing, organising and using different AI models from one coherent interface.**

It is designed around the idea that the user should remain in control of the model, the prompt, the context and the workflow.

Director is not tied to one AI provider, one model family or one type of creative work. It provides a common working environment in which different models can be selected and used according to the task.

The application is intended primarily as a serious working tool rather than a generic chatbot.

Its emphasis is on:

- clear model selection
- deliberate prompting
- reusable prompt systems
- organised AI-assisted work
- fast comparison and experimentation
- preservation of useful working material
- a consistent interface across different models and tasks

The user directs the system. Director provides the structure around that process.

---

# 2. Core Idea

Most AI interfaces combine several different concerns into a single chat box:

- choosing a model
- deciding how it should behave
- writing instructions
- supplying context
- experimenting with alternatives
- comparing results
- preserving useful prompts
- returning to previous work

Director separates these concerns and makes them explicit.

Instead of treating every interaction as an isolated conversation, Director treats AI work as something that can be **prepared, directed, reused, compared and organised**.

A model is one component of the workspace, not the workspace itself.

---

# 3. What Director Does

Director provides an interface for working with AI models while giving the user direct control over how each interaction is constructed.

At its core, Director allows the user to:

### Select models

Choose which available AI model should handle a task.

Different models may be appropriate for different kinds of work. Director does not assume that one model should handle everything.

The interface should make the currently selected model clear without allowing the model provider to dominate the overall product.

---

### Write prompts

Director provides a focused environment for composing instructions and sending them to a selected model.

Prompts may be simple requests or detailed working instructions.

The system should preserve the distinction between:

- what the user is asking
- reusable prompt instructions
- supplied context
- the selected model
- the resulting model output

These should not become an indistinguishable block of hidden behaviour.

---

### Maintain a reusable Prompt Library

Director includes a library of reusable prompts.

Prompts can be created for recurring tasks and retained for later use rather than rewritten repeatedly.

A saved prompt can contain information such as:

- name
- category
- intended use
- description
- prompt content
- active or archived state

The library can contain prompts for different disciplines or workflows.

Current examples include areas such as:

- Photography
- Design Studio
- Compare
- General

These categories organise prompts; they do not define the limits of Director.

Prompts remain editable by the user.

The Prompt Library is a practical instruction library. It should not silently convert prompts into personality training, behavioural imprinting, hidden memory or other persistent psychological modelling.

---

### Organise prompts

Users should be able to locate and manage prompts efficiently through mechanisms such as:

- search
- categories
- filters
- editing
- creation
- archiving

The objective is to make a large prompt collection usable as a working tool rather than a static list of text snippets.

---

### Run specialised workflows

Director can support different forms of AI-assisted work without requiring every task to use exactly the same interaction pattern.

For example, a task may involve:

- asking one model for a result
- applying a specialised prompt
- testing different instructions
- using different models for different jobs
- comparing alternative responses
- iterating on an existing result

The interface may expose these workflows differently where appropriate, while keeping the overall Director environment coherent.

---

### Compare

Director supports comparison as a first-class use case.

The purpose of comparison is to allow the user to evaluate alternatives rather than accepting the first generated result automatically.

Comparison may involve different:

- models
- prompts
- prompt variations
- approaches
- generated responses

Director should make these differences understandable rather than obscuring which configuration produced which result.

---

### Preserve useful working material

Director is intended for ongoing work, not disposable one-off queries.

Where the application stores prompts, settings, sessions, outputs or other user-created material, that material should remain organised and recoverable.

Persistence exists to support continuity of work.

It should not be confused with a system secretly constructing a psychological profile of the user.

---

# 4. Director Is Model-Agnostic

Director should never be conceptually defined around a particular model.

A model is a replaceable execution layer.

Director may work with models from different companies, model families or local systems provided an appropriate integration exists.

The product should therefore use general concepts such as:

- model
- provider
- prompt
- input
- context
- response
- capability
- configuration

rather than structuring its fundamental architecture around one vendor's terminology.

Provider-specific capabilities may still be supported, but they should remain extensions of the Director system rather than redefine it.

---

# 5. The Role of Models

Director does not assume that all AI models are interchangeable.

Models can differ substantially in:

- reasoning
- writing
- coding
- visual understanding
- image generation
- research
- speed
- context capacity
- instruction following
- cost
- specialised capabilities

Director allows those differences to be used deliberately.

The user should be able to choose a model because it is appropriate for the job, rather than because the application has embedded one model as the only possible intelligence layer.

Where practical, Director should make model choice visible and understandable.

---

# 6. The Role of Prompts

Prompts are a major working object inside Director.

A prompt is not merely text pasted into a chat box. It can represent a repeatable method for performing a task.

For example, a prompt may encode:

- a photographic analysis method
- an image critique process
- a design review
- a comparison framework
- a writing task
- a technical analysis
- a recurring creative workflow

Prompts therefore need to be manageable independently of individual conversations.

A user should be able to improve a prompt over time without having to reconstruct it from previous chats.

---

# 7. User Control

Director should favour explicit control over invisible automation.

The user should be able to understand the important factors influencing a model request.

Where relevant, this includes:

- which model is being used
- which prompt is being used
- what the user entered
- what additional context is being supplied
- what settings affect the request
- what result came back

The system should avoid silently changing the conceptual meaning of a user's request.

Automation can reduce repetitive work, but it should remain subordinate to user intent.

---

# 8. Creative and Professional Use

Director is particularly suited to iterative creative and professional work where the quality of direction matters.

Examples include:

### Photography

- image analysis
- critique
- visual interpretation
- editing direction
- sequencing
- conceptual development
- photographic research

### Design

- design critique
- interface analysis
- visual-system analysis
- concept development
- specification work
- design comparison

### Writing and analysis

- drafting
- rewriting
- research
- summarisation
- critique
- structured reasoning
- document analysis

### Technical work

- problem analysis
- system design
- development planning
- implementation assistance
- debugging
- technical comparison

These are examples rather than fixed product modes.

Director should remain extensible to work that was not anticipated when the application was originally designed.

---

# 9. Interface Philosophy

Director is a desktop working environment.

Its interface should feel like a purpose-built professional tool rather than a collection of generic AI widgets.

The interface exists to clarify the work.

It should make important state visible, particularly:

- current location within Director
- current model
- current task or working context
- available controls
- reusable prompts
- generated results

Information hierarchy should be deliberate.

Controls should exist because they serve a defined workflow, not because they are conventional features of AI applications.

---

# 10. Consistency Across Director

Individual areas of Director may serve different purposes, but they belong to the same application.

The product should therefore maintain a coherent visual and behavioural language across:

- navigation
- model controls
- prompts
- forms
- cards
- work areas
- dialogs
- outputs
- settings
- application state

A specialised workflow can introduce specialised controls without becoming a visually unrelated application.

---

# 11. Persistence

Director should preserve user-created working material where persistence is appropriate.

Examples can include:

- custom prompts
- prompt edits
- archived prompts
- application preferences
- relevant working state
- saved work

Persistence should be deterministic and understandable.

Director should not invent persistent behavioural systems merely because AI products commonly contain features described as memory.

If persistent AI context is introduced as a product capability, it should be deliberate, visible and separately specified.

---

# 12. What Director Is Not

Director is **not** simply a branded wrapper around one model.

It is not defined by OpenAI, Anthropic, Google, xAI, Meta or any other provider.

It is not a generic chat interface with a different skin.

It is not primarily a prompt marketplace.

It is not an autonomous agent that takes control of the user's work.

It is not a system for secretly developing a personality profile of the user.

It is not a collection of unrelated AI features placed into the same sidebar.

And it should not invent functionality merely because that functionality is common in other AI products.

Every significant feature should have a defined role within Director's workflow.

---

# 13. Product Principles

Director should follow several broad principles.

### Direction over automation

The objective is to make AI easier to direct, not simply to automate more decisions.

### Explicit over hidden

Important instructions, models, prompts and states should be understandable to the user.

### Models are tools

No single model defines Director.

### Prompts are assets

Useful prompts should be reusable, editable and organised.

### Comparison is valuable

Different AI systems and approaches produce different results. Director should make those differences usable.

### Preserve working context

Useful work should not disappear simply because an interaction has ended.

### Interface serves workflow

Visual elements and controls should correspond to actual product requirements.

### Do not invent

When functionality has not been specified, it should not be inferred merely from conventions used by other AI applications.

---

# 14. Conceptual Structure

At a high level, Director can be understood as several cooperating layers:

**Director**
→ provides the workspace and interaction system.

**Models**
→ provide AI capabilities.

**Prompts**
→ provide reusable instructions and methods.

**User input**
→ provides the immediate objective, material or question.

**Context**
→ provides additional information required for the task where applicable.

**Workflows**
→ determine how these components are combined for a particular kind of work.

**Outputs**
→ are the results produced by the selected model or workflow.

**Persistence**
→ preserves user-created material and relevant application state.

This separation is important.

Changing a model should not require redefining Director.

Changing a prompt should not require rebuilding the interface.

Adding a workflow should not require abandoning the common Director environment.

---

# 15. Extensibility

Director should be capable of evolving as AI systems evolve.

Future models may introduce capabilities that do not currently exist.

Director should therefore avoid assumptions such as:

- all models are text-only
- every model uses the same input format
- every model has the same settings
- every request returns one text response
- every workflow is a conversation
- every provider exposes identical capabilities

The application should have a stable conceptual core while allowing new capabilities to be integrated deliberately.

---

# 16. Canonical Product Definition

**Director is a model-agnostic AI workspace that gives the user explicit control over models, prompts and AI-assisted workflows. It provides a consistent environment for directing different AI systems, maintaining reusable prompts, organising ongoing work, comparing alternatives and preserving useful working material. Director treats AI models as interchangeable specialised tools within a larger user-controlled system rather than making any single model the centre of the product.**

---

# 17. Short Description

**Director is a desktop AI workspace for directing multiple AI models, managing reusable prompts and organising AI-assisted creative and professional work.**

---

# 18. One-Line Description

**Director is a model-agnostic workspace for directing AI.**

---

# 19. Guiding Principle

**The model generates. Director gives the user control over how, why and where it is used.**


Director User Flow

Director has six main areas:

Director
User creates new feedback. They add/select a source, choose source type, choose or write a prompt, optionally link a project, then click Get Feedback. The screen moves through empty → generating → completed feedback. The user can then continue with Ask Director, save the feedback, edit title, favourite, delete, or start new feedback.

Compare
User adds 2–6 sources, chooses source type, prompt, optional project, then clicks Compare Sources. The app moves through empty → generating → completed comparison. It shows first read, ranked recommendations, optional chat, then can save the comparison.

Darkroom
Saved photography feedback library. Records open into quick view drawer or full feedback detail.

Design Studio
Same structure as Darkroom. Reuse the Darkroom library, quick view, and detail pattern. Change content/domain only. Do not invent a new Design Studio UI.

Projects
Projects group existing feedback and comparison records. Project detail has Overview, Feedback, and Notes. Project Settings is a modal over the project page, not a separate page.

Prompts / Settings
Prompts is the editable prompt library used by Director and Compare. Settings controls models, personalisation, and appearance.