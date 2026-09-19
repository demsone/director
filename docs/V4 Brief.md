DIRECTOR V4 — PROJECTS + BASIC LIBRARIES

OBJECTIVE

Add a simple organisation layer to the existing verified Director V3 application.

Existing protected functionality:

V1:
Image → Prompt → Feedback → Follow-up Chat

V2:
Persistent sessions → History → Quit/Reopen → Continue

V3:
Two Images → Compare Prompt → Comparative Feedback → Follow-up Chat → Persistence

V4 adds:

- Projects
- Photography Library
- Design Library
- the ability to organise existing Feedback and Compare sessions without duplicating their underlying data

Do not redesign Director.
Do not integrate the approved Figma/HTML/CSS design.
Do not add advanced collections, nested collections, search systems, Design Builder, prompt management, or unrelated features.


PRODUCT INTENT

Director's original brief says feedback should be storable in libraries such as Photography and Design, while complete image + feedback + chat sessions may also be grouped into Projects.

Example:

A project called "The DDNC" could contain every relevant image review and conversation belonging to that body of work.

The original Director brief explicitly describes saving image feedback/chat into either libraries or projects. Photography Library and Design Library are intended as long-term homes for creative work. :contentReference[oaicite:0]{index=0}

V4 implements only the basic organisational foundation.

Do not attempt the eventual full collection/subcollection system yet.


SOURCE OF TRUTH

Functional source:
The verified working Director V3 application.

Product source:
The original Director brief.

Visual reference:
Existing approved Figma/reference files may be consulted only to understand terminology or intended future hierarchy.

They are NOT production code.

Do not:

- serve them
- import them
- extend them
- copy their architecture
- wire logic into them
- attempt visual fidelity in V4


CORE ARCHITECTURAL RULE

PROJECTS AND LIBRARIES ORGANISE SESSIONS.

THEY DO NOT OWN DUPLICATE COPIES OF SESSIONS.

A Feedback or Compare session remains the canonical record containing:

- image asset(s)
- prompt
- feedback
- chat
- model information
- timestamps
- session metadata

Projects and Libraries should reference sessions by stable session ID.

Do not duplicate image files, feedback, or chat merely because a session is added to a Project or Library.

Opening a session from History, a Project, or a Library must open the SAME canonical session.


PROJECTS

V4 must allow the user to:

- create a Project
- give it a name
- rename it
- delete it
- view its sessions
- add an existing Feedback session to it
- add an existing Compare session to it
- remove a session from the Project
- open a session from the Project
- assign the current open session to a Project
- retain Project membership after quitting and reopening Director

A session may belong to more than one Project if the existing architecture can support this cleanly.

Prefer a future-safe relationship such as:

projectIds: []

or an equivalent membership/index model.

Do not force a destructive "move" operation.

Adding a session to a Project must not remove it from History or a Library.


PROJECT DATA

Persist at minimum:

- project ID
- name
- created timestamp
- updated timestamp

Optional if useful and cheap:

- short description

Do not add:

- project files
- project-level prompts
- project AI instructions
- project collaborators
- project colours/themes
- task management
- nested projects
- complex metadata


LIBRARIES

V4 has two first-class built-in Libraries:

- Photography Library
- Design Library

These correspond directly to the original Director concept. :contentReference[oaicite:1]{index=1}

The user must be able to:

- add an existing Feedback session to Photography Library
- add an existing Feedback session to Design Library
- add a Compare session where appropriate
- remove a session from a Library
- browse each Library
- open a session from a Library
- assign the current open session to a Library
- quit and reopen Director with Library membership intact

A session MAY exist in:

- History
- a Library
- one or more Projects

simultaneously.

These are organisational references, not duplicate sessions.


LIBRARY SCOPE LIMIT

Do not implement custom Libraries yet.

Do not implement:

- nested collections
- subcollections
- collection artwork
- advanced tagging
- online collection management
- smart collections
- saved searches

However:

Design the persisted relationship so that later collections/subcollections can be added without rewriting the canonical session storage.

Do not prematurely build that future system.


SESSION MODEL

Extend the existing session/organisation architecture minimally.

Possible direction:

session {
  ...
  libraryIds: [...]
  projectIds: [...]
}

or a separate organisational index referencing session IDs.

Choose whichever best fits the existing V2/V3 persistence architecture.

Do not create parallel persistence engines.

Existing V1/V2/V3 sessions must continue to load.

Schema changes must be backward-compatible.


IMPORTANT DELETION SEMANTICS

Deleting a Project must NOT delete its sessions.

Removing a session from a Project must NOT delete the session.

Removing a session from a Library must NOT delete the session.

Deleting a session itself must remove dangling references to it from:

- Projects
- Libraries
- History/indexes

Deleting a session must continue to delete only the canonical session and its owned image assets according to existing V2/V3 behaviour.

No orphaned membership references.


HISTORY

History remains the canonical chronological session list.

Projects and Libraries are alternate organisational views.

Do not change History into a Project system.

Do not hide organised sessions from History.


SESSION CREATION

Do not complicate the initial feedback flow.

After a Feedback or Compare session exists, the user should be able to assign it to:

- Photography Library
- Design Library
- one or more Projects

A minimal "Save to / Organise" control is sufficient.

Do not redesign the feedback page to accommodate this.


UI

Keep the UI deliberately utilitarian and consistent with V3.

A simple navigation structure such as:

Feedback
Compare
History
Projects
Photography Library
Design Library

is sufficient.

Projects may use:

- a basic list
- create button
- project name
- session list
- rename/delete controls

Libraries may use:

- basic session lists
- add/remove controls

No visual polish phase.

No Figma reproduction.

No animation.

No responsive redesign beyond preventing obvious breakage.


SESSION CARDS / LIST ITEMS

Reuse existing History/session presentation where practical.

Each organised session should show enough information to identify it, such as:

- title
- date
- type: Feedback or Compare
- thumbnail(s) if existing components already support them

Do not create an entirely separate card system if the existing session list can be reused.


DATA INTEGRITY

Organisation metadata must survive:

- app restart
- server restart
- session rename
- project rename
- session continuation
- Compare continuation

Renaming a session must automatically appear correctly everywhere because Projects/Libraries reference the canonical session rather than copying its title.

Likewise, continuing a chat must update the canonical session visible from every organisational view.


ERROR / EDGE CASES

Handle:

- project references missing session ID
- session references deleted project ID
- corrupt project record
- corrupt organisation metadata
- duplicate membership assignment
- removing membership twice
- deleting a Project while it is open
- deleting a session while viewing it through a Project/Library
- legacy sessions with no organisation metadata

Prefer graceful recovery and cleanup rather than application failure.

One corrupt Project must not make History or unrelated sessions unavailable.


MIGRATION

Existing V1/V2/V3 session data is protected.

If schema migration is required:

- preserve existing sessions
- preserve image assets
- preserve chats
- preserve Compare sessions
- initialise new organisation fields safely
- make migration idempotent where practical

Do not require the user to recreate existing sessions.


ACCEPTANCE TESTS

V4 is not complete until all of the following work:

1. Launch with existing V3 data intact.
2. Open an old single-image Feedback session.
3. Open an old Compare session.
4. Confirm both still behave normally.

5. Create Project "Test Project".
6. Add an existing Feedback session.
7. Add an existing Compare session.
8. Open both from the Project.
9. Continue chat in one of them.
10. Confirm the updated chat is visible from History and the Project.

11. Rename one session.
12. Confirm its new name appears in History and Project without duplicated stale metadata.

13. Add a session to Photography Library.
14. Open it from Photography Library.
15. Confirm it is still also present in History.

16. Add another session to Design Library.
17. Confirm it opens correctly.

18. Quit Director completely.
19. Relaunch.
20. Confirm Project exists.
21. Confirm both Project memberships survive.
22. Confirm Library memberships survive.
23. Confirm both original image assets survive.
24. Confirm existing chats survive.

25. Remove a session from a Project.
26. Confirm the session itself still exists and opens from History.

27. Remove a session from a Library.
28. Confirm the session itself still exists.

29. Delete a Project containing sessions.
30. Confirm those sessions remain intact in History/Libraries.

31. Delete one canonical session.
32. Confirm it disappears from History.
33. Confirm its Project/Library references are also cleaned up.
34. Confirm unrelated sessions remain intact.

35. Restart Director again.
36. Confirm no deleted Project/session/membership reappears.

37. Run all existing V1/V2/V3 automated tests.
38. Confirm no regression in:
    - Feedback
    - image-aware chat
    - persistence
    - History
    - Compare
    - Compare persistence


PROTECTED AREAS

Do NOT:

- redesign Director
- integrate Figma
- modify approved visual reference HTML/CSS
- rewrite working V3 functionality
- replace the persistence layer unnecessarily
- duplicate sessions into Projects/Libraries
- add advanced collections
- add nested folders
- add tagging/search systems
- add prompt management
- add Design Builder
- add production workflows
- add cloud sync
- add export/import
- begin V5


TECHNICAL PRIORITY

1. Preserve canonical session storage.
2. Add durable organisation references.
3. Add Projects.
4. Add Photography/Design Libraries.
5. Add basic organisation UI.
6. Prove deletion/restart semantics.
7. Regression-test V1–V3.


GIT

Before implementation:

- verify branch is director-v4-organisation
- verify director-v3-compare-working tag exists
- verify working tree is clean

Work only on the V4 branch.

When ALL acceptance criteria pass:

commit:

Director v4: projects and creative libraries

Do not merge.
Do not tag automatically.
Do not begin visual integration.
Do not begin V5.

STOP and report:

- architecture used for organisation relationships
- schema changes
- files changed
- automated tests run
- manual acceptance tests completed
- migration behaviour
- known limitations