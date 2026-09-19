# Director v2.5 — Naming Cleanup Report

## Scope

Naming metadata only was changed.

No visible text content, node IDs/types, geometry, colours, variable values, layout data, images, or page names were changed.

Validated after edit:
- 796 text node contents unchanged
- all node IDs and node types unchanged
- all variable values unchanged
- all 9 page names unchanged
- local/used variable names synchronised
- component variant property names/values synchronised
- no duplicate variant options created
- no generic `Frame N` or `Group N` names remain
- no internal naming remnants matching `imprint`, `Xxtra`, `Reresh`, `Verticle`, `catagory`, `toolbbar`, `personlisation`, or `Stale`

## Naming convention applied

- Screens: `Area / State`
- Components: `Area / Component`
- Internal layers: simple lowercase semantic names
- Variant properties: Title Case (`State=Hover`, `Icon=Refresh`, etc.)
- Variables: lowercase slash-case, with hyphens inside multi-word tokens
- Semantic colour collection: `Color / UI`

## Key screen renames

- `Director / Result + Chat` → `Director / Feedback + Chat`
- `New Feedback / Compare` → `Director / New Compare`
- duplicate legacy `Projects / All` → `Projects / Legacy / Darkroom`
- `Projects / Detail` → `Projects / Detail / Overview`
- `Projects / Detail` → `Projects / Detail / Feedback`
- Settings screens → `Settings / Models`, `Settings / Personalisation`, `Settings / Appearance`

## Key component renames

- `Feedback / File Box` → `Feedback / File`
- `Feedback / Feedback Panel` → `Feedback / Panel`
- `Compare Results` → `Compare / Results`
- `Compare / Recommended Bar` → `Compare / Recommendation`
- `Quick View / Side Drawer` → `Quick View / Drawer`
- `Components / Prompt / Button` → `Prompt / Button`
- `Components / Chat / Toolbar` → `Chat / Toolbar`
- `Headers / Headers` → `UI / Header`
- `Button` → `UI / Button`
- `Status Badge` → `UI / Status Badge`
- `Top Bar` → `UI / Top Bar`
- `icon` → `UI / Icon`
- `Sidebar / Sidebar` → `Navigation / Sidebar`
- `Sidebar / Nav Item` → `Navigation / Item`
- `Tab / Tab Navigation` → `Navigation / Tabs`
- `Tab / Buttons` → `Navigation / Tab`

## Variant cleanup

Examples:
- `state=hover` → `State=Hover`
- `state=rest` → `State=Default`
- `Icon Type=Reresh` → `Icon=Refresh`
- `Color=Stale` → `Color=Slate`
- `Module=Model with ogo` → `Module=Model with Logo`
- `Module=compare feedback` → `Module=Compare Result`
- `Module=section-imprint` → `Module=Feedback`
- `form=textarea-skyline` → `Type=Textarea Skyline`
- `Weight=ExtraBoldy` → `Weight=ExtraBold`
- `Weight=Weight8` → `Weight=Unknown` (the source export does not contain enough information to infer the intended weight safely)

## Variable cleanup

- collection `UI` → `Color / UI`
- `accent/accent-*` → `accent/*`
- `badges/*` → `badge/*`
- `buttons/*` → `button/*`
- `nuetral` → `neutral`
- Director colour family names normalised to lowercase hyphenated form, e.g. `Argent Blue/*` → `argent-blue/*`
- `gunmetal gray/*` → `gunmetal-gray/*`
- typography letter-spacing token values normalised to lowercase hyphenated names

## Change counts

- Node: 1107
- Instance property: 831
- Instance property value: 760
- Variable: 96
- Used variable collection: 54
- Used style: 39
- Used variable: 38
- Variant options: 24
- Variant property: 16
- Variable collection: 1

Total recorded naming metadata changes: **2966**
