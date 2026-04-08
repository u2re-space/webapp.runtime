# Endpoint portable bundle

This bundle is generated from apps/CrossWord/src/endpoint.

## Requirements
- Node.js 22+ and npm

## Run
- Linux/macOS: ./run.sh
- Windows: run.cmd

## Notes
- Node modules mode: none
- This is a slim bundle without node_modules. Run: npm ci --include=dev
- Slim mode auto-installs dependencies on first run via npm.
- PM2 runs `launcher.mjs` (which starts `server-v2/index.ts`). Without PM2, run.sh/run.cmd fall back to `npm run start:direct`.
- Default launcher environment:
  - CWS_TUNNEL_DEBUG=true
  - CWS_SOCKET_IO_ALLOWED_ORIGINS=all
  - CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS=true
  - CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH=true
  - CWS_CORS_ALLOW_PRIVATE_NETWORK=true
  - CWS_START_MODE=start
  - CWS_AIRPAD_VERBOSE=1
  - CWS_BRIDGE_ENABLED=true
  - CWS_BRIDGE_MODE=active
  - CWS_BRIDGE_CONNECTION_TYPE=exchanger-initiator
  - CWS_BRIDGE_ENDPOINT_URL=https://45.147.121.152:8443/
  - CWS_BRIDGE_ENDPOINTS=https://45.147.121.152:8443/,https://100.76.202.88:8443/,https://192.168.0.200:8443/
  - CWS_BRIDGE_PRECONNECT_TARGETS=L-192.168.0.200
  - CWS_BRIDGE_RECONNECT_MS=3000
  - CWS_BRIDGE_REJECT_UNAUTHORIZED=false
  - CWS_PORTABLE_DATA_PATH=./.data
  - CWS_PORTABLE_CONFIG_PATH=./portable.config.json
  - CWS_HTTPS_ENABLED=true
  - CWS_ROLES=responser-initiated,requestor-initiated,responser-initiator,requestor-initiator,exchanger-initiator,exchanger-initiated
  - CWS_ASSOCIATED_TOKEN=n3v3rm1nd
  - CWS_BRIDGE_USER_ID=L-192.168.0.110
  - CWS_BRIDGE_USER_KEY=n3v3rm1nd
  - CWS_BRIDGE_DEVICE_ID=L-192.168.0.110
  - CWS_CLIPBOARD_LOG_PREVIEW=64
  - CWS_AIRPAD_NATIVE_ACTIONS=true
  - CWS_HTTPS_CERT=fs:./https/local/multi.crt
  - CWS_ASSOCIATED_ID=L-192.168.0.110
  - CWS_HTTPS_CA=fs:./https/local/rootCA.crt
  - CWS_CLIPBOARD_LOGGING=true
  - CWS_CLIPBOARD_LOG_HASH=true
  - CWS_HTTPS_KEY=fs:./https/local/multi.key
  - CWS_AIRPAD_ROBOTJS_ENABLED=true
- Set `CWS_START_MODE=watch` to run auto-restart on file changes from the launcher (`start:watch`).
- Archive retention is controlled by `PORTABLE_ARCHIVE_RETENTION_COUNT` (default: 1) in build mode.
- If clipboard backend is unavailable on Linux headless environments, endpoint still starts.
