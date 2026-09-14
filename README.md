# Director v4 corrective application

This is the functional v4 layer. The approved visual baseline is separately retained in `visual-v4/` at Git tag `figma-approved-v1`; it is never generated from, or modified by, this app.

## Run

Double-click [Director v4.command](/Users/diego/myapps/Director/Director%20v4.command) in Finder. On the first run it may take a moment to install the already-listed local dependencies; it then opens the functional application at `http://127.0.0.1:5173/`.

The command behind it is [command.launcher](/Users/diego/myapps/Director/command.launcher). The approved static reference remains independently available through [Director v4 Visual Review.command](/Users/diego/myapps/Director/Director%20v4%20Visual%20Review.command).

To launch from a terminal instead:

```sh
npm run dev
```

Open `http://127.0.0.1:5173/`.

Director uses a versioned local repository key (`director.v4.repository`) and migrates the earlier `director_*` keys without clearing them. Records are saved only through their explicit save actions. The settings page tests an OpenAI-compatible local server and obtains its model list from that server. The standard local LM Studio address (`http://127.0.0.1:1234`) is proxied in development to avoid browser cross-origin failures.

Run checks with:

```sh
npm run lint
npm run build
```

The former Gemini React implementation is preserved at `_archive/gemini-react-pre-corrective-20260914/`; it is not part of the active application.
