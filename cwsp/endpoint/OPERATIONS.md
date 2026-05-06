# CWSP Endpoint Operations

This runbook covers the verified CWSP websocket-first recovery flow for:

- `L-192.168.0.110` host endpoint
- `L-192.168.0.196` Android client
- `L-192.168.0.200` / `45.147.121.152` proxy and WAN entrypoints

## Topology Notes

- `192.168.0.200` / `45.147.121.152` runs from `/home/u2re-dev/U2RE.space/runtime/cwsp`.
- `192.168.0.110` runs from `C:\Users\U2RE\cwsp-server`.
- The `110` checkout must keep `server/socket/runtime.ts`, `server/socket/coordinator.ts`, and `server/socket/handlers/airpad.ts` aligned with the main endpoint runtime when bridge/routing logic changes.
- Socket.IO remains compatibility-only and disabled by default. Canonical peer routing is `/ws`.

## Restart Order

Local gateway / WAN node:

```bash
pm2 restart cwsp
```

Windows `110` host:

```bash
ssh U2RE@192.168.0.110 "powershell -NoProfile -Command \"pm2 restart cwsp\""
```

Android daemon:

```bash
adb connect 192.168.0.196:5555
adb shell am start -n space.u2re.cws/.MainActivity
```

## Fast Verification

`110 -> 196` through WAN and proxy:

```bash
CWS_ITER_ACTORS='L-192.168.0.110,L-192.168.0.196,n3v3rm1nd' \
CWS_ITER_ENDPOINTS='https://45.147.121.152:8443,https://192.168.0.200:8443' \
npm run test:auto-iterator
```

`196 -> 110` through WAN and proxy:

```bash
CWS_ITER_ACTORS='L-192.168.0.196,L-192.168.0.110,n3v3rm1nd' \
CWS_ITER_ENDPOINTS='https://45.147.121.152:8443,https://192.168.0.200:8443' \
npm run test:auto-iterator
```

Direct `196 -> 110` host validation:

```bash
CWS_ITER_ACTORS='L-192.168.0.196,L-192.168.0.110,n3v3rm1nd' \
CWS_ITER_ENDPOINTS='https://192.168.0.110:8443' \
npm run test:auto-iterator
```

Quick contour restart + diagnostics:

```bash
npm run diag:auto:contour
```

## What Healthy Looks Like

- `L-192.168.0.110 -> L-192.168.0.196` returns `byId=L-192.168.0.196` for `clipboard:isReady`, `clipboard:update`, and `clipboard:write`.
- `L-192.168.0.196 -> L-192.168.0.110` returns `byId=L-192.168.0.110` for `clipboard:isReady`, `mouse:isReady`, `clipboard:update`, `clipboard:write`, and `airpad:mouse`.
- `110` PM2 logs include `canonical bridge connected: L-192.168.0.200`.
- Android logcat shows the daemon staying on canonical `wss` and no legacy direct `/clipboard` errors.

## Useful Checks

Gateway PM2:

```bash
pm2 describe cwsp
pm2 logs cwsp --lines 120 --nostream
```

Windows `110` PM2:

```bash
ssh U2RE@192.168.0.110 "powershell -NoProfile -Command \"pm2 describe cwsp\""
ssh U2RE@192.168.0.110 "powershell -NoProfile -Command \"pm2 logs cwsp --lines 120 --nostream\""
```

Android daemon/logcat:

```bash
adb connect 192.168.0.196:5555
adb logcat -d -s Daemon ReverseClipboardHandler ReverseAssistantBridge
adb shell dumpsys activity services space.u2re.cws
```
