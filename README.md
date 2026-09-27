# Director

Local, model-agnostic workspace for photography and design critique. Available as a Mac app and as a web version; both show the same data.

## Open Director

**Mac app:** open **Director** from Applications (or the Dock). Everything runs inside the app.

**Web version:** double-click **`Director.command`** in this folder. It opens Director in your browser at http://127.0.0.1:4747. Keep the launcher window open while you use it; close it to stop. The first launch installs and builds, which takes about a minute.

If one is already open, the other simply connects to it. Your feedback, comparisons, projects and prompts are shared.

Requires LM Studio (or another OpenAI-compatible server) running locally for model features. Set the server URL and models in **Settings → Model**. The web version also needs Node.js 22.13 or newer.

## Where things live

- `app/` — the application: interface in `app/src`, local server in `app/server`, Mac app wrapper in `app/electron`.
- `~/Library/Application Support/Director/` — your database and image previews, shared by both versions. Never committed.
- `docs/`, `assets/` — product brief, design notes, fonts, icons and reference screenshots.

## Development

```bash
cd app && npm run dev
```

Rebuild the Mac app (output in `app/release/`, then copy `Director.app` to Applications):

```bash
cd app && npm run package:mac
```
