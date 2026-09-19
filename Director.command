#!/bin/zsh
cd "$(dirname "$0")"
./command.launcher
DIRECTOR_EXIT=$?
if [[ "$DIRECTOR_EXIT" != 0 ]]; then
  echo 'Press Return to close this window.'
  read -r
fi
exit "$DIRECTOR_EXIT"
