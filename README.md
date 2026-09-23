# Director

Local, model-agnostic workspace for photography and design critique.

## Open Director

Double-click **`Director.command`** in this folder (or run `./command.launcher`).

- The first launch installs dependencies and builds the app, which takes about a minute.
- Director opens in your browser at http://127.0.0.1:4747. Keep the launcher window open while you use it; close it to stop Director.
- Opening it again while it is already running just opens the browser tab.
- Requires Node.js 22.13 or newer, and LM Studio (or another OpenAI-compatible server) running locally for model features. Set the server URL and models in **Settings → Model**.

## Where things live

- `app/` — the application (React interface in `app/src`, local server in `app/server`).
- `app/data/` — your database (`director.db`) and local copies of uploaded sources. Created on first run.
- `docs/`, `assets/` — product brief, design notes, fonts, icons and reference screenshots.

## Development

```bash
cd app && npm run dev
```
