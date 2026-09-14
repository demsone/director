# Director v4

The approved Astra HTML/CSS in `visual-v4/` is the Director v4 interface. It is progressively enhanced in place; it is not reproduced by a separate presentation layer.

## Run

Double-click [Director v4.command](/Users/diego/myapps/Director/Director%20v4.command) in Finder. It opens the approved Astra interface at `http://127.0.0.1:4184/`.

The current corrective scope is only **Director / New Feedback**: source selection, source type, prompt, project link, validation, and transition to the approved generating screen. All other Astra screens remain untouched.

To launch from a terminal instead:

```sh
(cd visual-v4 && npm start)
```

Run checks with:

```sh
(cd visual-v4 && npm run check)
```

The former custom React implementation has been removed from the active application.
