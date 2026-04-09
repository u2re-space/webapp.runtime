#!/usr/bin/env bash
# Forward Android WebView Chrome DevTools to localhost:9222 for VS Code / Chrome attach.
# Prereqs: USB/wireless debugging, CWSP app running on device (space.u2re.cwsp).
#
# Env overrides:
#   CWS_ADB_DEVICE   default 192.168.0.196:5555 (wireless pair / tcpip)
#   CWS_ANDROID_APP_ID  default space.u2re.cwsp
set -euo pipefail
DEVICE="${CWS_ADB_DEVICE:-192.168.0.196:5555}"
PKG="${CWS_ANDROID_APP_ID:-space.u2re.cwsp}"

echo "[cwsp-adb] target device: $DEVICE (set CWS_ADB_DEVICE to override)"
adb connect "$DEVICE" 2>/dev/null || true

PID="$(adb -s "$DEVICE" shell pidof -s "$PKG" 2>/dev/null | tr -d '\r' | awk '{print $1}')" || true
if [[ -n "${PID:-}" ]]; then
  SOCKET="webview_devtools_remote_${PID}"
  echo "[cwsp-adb] $PKG pid=$PID -> localabstract:$SOCKET"
else
  SOCKET="webview_devtools_remote"
  echo "[cwsp-adb] pidof failed — using generic $SOCKET (start the app, or use chrome://inspect)"
fi

adb -s "$DEVICE" forward --remove tcp:9222 2>/dev/null || true
adb -s "$DEVICE" forward tcp:9222 "localabstract:${SOCKET}"
echo "[cwsp-adb] tcp:9222 forwarded. In VS Code run: CWSP Capacitor: WebView DevTools (attach :9222)"
