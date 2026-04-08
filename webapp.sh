#!/usr/bin/env bash
# CWSP portable launcher from monorepo `runtime/` directory.
# Build: (cd cwsp && npm run build:portable)
#
#   ./webapp.sh
#   CWS_PORTABLE_DIR=/custom/dist/portable ./webapp.sh
#
# screen:
#   screen -S cwsp -dm bash -lc '/path/to/runtime/webapp.sh'
#
# pm2 (from this directory):
#   pm2 start ecosystem.config.cjs
#
# Inside cwsp/ use ./webapp.sh (resolves ./dist/portable).
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTABLE="${CWS_PORTABLE_DIR:-$SCRIPT_DIR/cwsp/dist/portable}"
if [[ ! -f "$PORTABLE/cwsp.mjs" ]]; then
  echo "webapp.sh: missing $PORTABLE/cwsp.mjs — run: (cd cwsp && npm run build:portable)" >&2
  exit 1
fi
cd "$PORTABLE"
exec node cwsp.mjs "$@"
