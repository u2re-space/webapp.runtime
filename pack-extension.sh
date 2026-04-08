#!/usr/bin/env bash
# Build CrossWord Chrome extension (CRX pipeline) and mirror unpacked output under ./pack/crx/.
# Load in Chrome: chrome://extensions → Developer mode → Load unpacked → select pack/crx
# Windows: merge runtime/allow.reg if you need file:// extension install policy.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
CW="$REPO_ROOT/apps/CrossWord"
OUT="$ROOT/pack/crx"
if [[ ! -f "$CW/package.json" ]]; then
  echo "pack-extension.sh: CrossWord not found at $CW (expected monorepo apps/CrossWord)" >&2
  exit 1
fi
echo "[pack-extension] building in $CW ..."
( cd "$CW" && npm run build:crx )
mkdir -p "$OUT"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$CW/dist-crx/" "$OUT/"
else
  rm -rf "$OUT"
  mkdir -p "$OUT"
  cp -a "$CW/dist-crx/." "$OUT/"
fi
echo "[pack-extension] unpacked extension: $OUT"
