#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export CWS_TUNNEL_DEBUG="${CWS_TUNNEL_DEBUG:-true}"
export CWS_SOCKET_IO_ALLOWED_ORIGINS="${CWS_SOCKET_IO_ALLOWED_ORIGINS:-all}"
export CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS="${CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS:-true}"
export CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH="${CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH:-true}"
export CWS_CORS_ALLOW_PRIVATE_NETWORK="${CWS_CORS_ALLOW_PRIVATE_NETWORK:-true}"
export CWS_START_MODE="${CWS_START_MODE:-start}"
export CWS_AIRPAD_VERBOSE="${CWS_AIRPAD_VERBOSE:-1}"
export CWS_BRIDGE_ENABLED="${CWS_BRIDGE_ENABLED:-true}"
export CWS_BRIDGE_MODE="${CWS_BRIDGE_MODE:-active}"
export CWS_BRIDGE_CONNECTION_TYPE="${CWS_BRIDGE_CONNECTION_TYPE:-exchanger-initiator}"
export CWS_BRIDGE_ENDPOINT_URL="${CWS_BRIDGE_ENDPOINT_URL:-https://45.147.121.152:8443/}"
export CWS_BRIDGE_ENDPOINTS="${CWS_BRIDGE_ENDPOINTS:-https://45.147.121.152:8443/,https://100.76.202.88:8443/,https://192.168.0.200:8443/}"
export CWS_BRIDGE_PRECONNECT_TARGETS="${CWS_BRIDGE_PRECONNECT_TARGETS:-L-192.168.0.200}"
export CWS_BRIDGE_RECONNECT_MS="${CWS_BRIDGE_RECONNECT_MS:-3000}"
export CWS_BRIDGE_REJECT_UNAUTHORIZED="${CWS_BRIDGE_REJECT_UNAUTHORIZED:-false}"
export CWS_PORTABLE_DATA_PATH="${CWS_PORTABLE_DATA_PATH:-./.data}"
export CWS_PORTABLE_CONFIG_PATH="${CWS_PORTABLE_CONFIG_PATH:-./portable.config.json}"
export CWS_HTTPS_ENABLED="${CWS_HTTPS_ENABLED:-true}"
export CWS_ROLES="${CWS_ROLES:-responser-initiated,requestor-initiated,responser-initiator,requestor-initiator,exchanger-initiator,exchanger-initiated}"
export CWS_ASSOCIATED_TOKEN="${CWS_ASSOCIATED_TOKEN:-n3v3rm1nd}"
export CWS_BRIDGE_USER_ID="${CWS_BRIDGE_USER_ID:-L-192.168.0.110}"
export CWS_BRIDGE_USER_KEY="${CWS_BRIDGE_USER_KEY:-n3v3rm1nd}"
export CWS_BRIDGE_DEVICE_ID="${CWS_BRIDGE_DEVICE_ID:-L-192.168.0.110}"
export CWS_CLIPBOARD_LOG_PREVIEW="${CWS_CLIPBOARD_LOG_PREVIEW:-64}"
export CWS_AIRPAD_NATIVE_ACTIONS="${CWS_AIRPAD_NATIVE_ACTIONS:-true}"
export CWS_HTTPS_CERT="${CWS_HTTPS_CERT:-fs:./https/local/multi.crt}"
export CWS_ASSOCIATED_ID="${CWS_ASSOCIATED_ID:-L-192.168.0.110}"
export CWS_HTTPS_CA="${CWS_HTTPS_CA:-fs:./https/local/rootCA.crt}"
export CWS_CLIPBOARD_LOGGING="${CWS_CLIPBOARD_LOGGING:-true}"
export CWS_CLIPBOARD_LOG_HASH="${CWS_CLIPBOARD_LOG_HASH:-true}"
export CWS_HTTPS_KEY="${CWS_HTTPS_KEY:-fs:./https/local/multi.key}"
export CWS_AIRPAD_ROBOTJS_ENABLED="${CWS_AIRPAD_ROBOTJS_ENABLED:-true}"
start_mode="${CWS_START_MODE:-start}"
if command -v pm2 >/dev/null 2>&1; then
  if [ -f "ecosystem.config.cjs" ]; then
    if pm2 describe cws >/dev/null 2>&1; then
      exec pm2 restart cws
    fi
    exec pm2 start ecosystem.config.cjs
  fi
fi
if ! command -v node >/dev/null 2>&1; then
  echo "[portable] Node.js 22+ is required."
  exit 1
fi
if [ ! -f "node_modules/.bin/tsx" ]; then
  echo "[portable] Installing dependencies (first run)..."
  npm ci --include=dev || npm install --include=dev
fi
if [ "$start_mode" = "watch" ] || [ "$start_mode" = "1" ] || [ "$start_mode" = "true" ] || [ "$start_mode" = "dev" ]; then
  exec npm run start:watch
else
  exec npm run start:direct
fi
