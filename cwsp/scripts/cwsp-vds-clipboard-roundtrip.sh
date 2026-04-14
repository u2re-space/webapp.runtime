#!/usr/bin/env bash
# Programmatic clipboard probe: VDS-shaped client → gateway (WAN/LAN) → L-192.168.0.110.
# Usage (from runtime/cwsp):
#   export CWS_PORTABLE_CONFIG_PATH=/path/to/portable.config.json
#   export CWS_FAKE_CLIENT_ENDPOINT_URL=https://45.147.121.152:8443
#   ./scripts/cwsp-vds-clipboard-roundtrip.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export NODE_ENV="${NODE_ENV:-production}"
CODE="От VDS L-45.150.9.153 test-$(date +%s)"
export CWS_FAKE_CLIENT_CLIPBOARD_TEXT="${CWS_FAKE_CLIENT_CLIPBOARD_TEXT:-$CODE}"
export CWS_FAKE_CLIENT_TARGETS="${CWS_FAKE_CLIENT_TARGETS:-L-192.168.0.110}"
export CWS_FAKE_CLIENT_USER_ID="${CWS_FAKE_CLIENT_USER_ID:-L-45.150.9.153}"
export CWS_FAKE_CLIENT_DEVICE_ID="${CWS_FAKE_CLIENT_DEVICE_ID:-L-45.150.9.153}"
export CWS_FAKE_CLIENT_TOKEN="${CWS_FAKE_CLIENT_TOKEN:-VDS-client}"
export CWS_FAKE_CLIENT_ONCE="${CWS_FAKE_CLIENT_ONCE:-1}"
export CWS_FAKE_CLIENT_EXIT_IDLE_MS="${CWS_FAKE_CLIENT_EXIT_IDLE_MS:-20000}"
export CWS_FAKE_CLIENT_LOG_JSON="${CWS_FAKE_CLIENT_LOG_JSON:-true}"
# Uncomment to exercise the same tunnel handshake fields as browser AirPad:
# export CWS_FAKE_CLIENT_TUNNEL=1
# export CWS_FAKE_CLIENT_ROUTE_TARGET=L-192.168.0.110
exec npx --yes tsx server/client/vds-fake-client.ts \
  --config "${CWS_PORTABLE_CONFIG_PATH:-./portable.config.json}" \
  --clipboard-text "$CWS_FAKE_CLIENT_CLIPBOARD_TEXT" \
  --targets "$CWS_FAKE_CLIENT_TARGETS" \
  --user-id "$CWS_FAKE_CLIENT_USER_ID" \
  --device-id "$CWS_FAKE_CLIENT_DEVICE_ID" \
  --token "$CWS_FAKE_CLIENT_TOKEN" \
  --once \
  --exit-idle-ms "$CWS_FAKE_CLIENT_EXIT_IDLE_MS" \
  --label "${CWS_FAKE_CLIENT_LABEL:-vds-roundtrip}"
