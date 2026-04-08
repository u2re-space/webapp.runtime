@echo off
setlocal
cd /d "%~dp0"
if not defined CWS_TUNNEL_DEBUG set "CWS_TUNNEL_DEBUG=true"
if not defined CWS_SOCKET_IO_ALLOWED_ORIGINS set "CWS_SOCKET_IO_ALLOWED_ORIGINS=all"
if not defined CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS set "CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS=true"
if not defined CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH set "CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH=true"
if not defined CWS_CORS_ALLOW_PRIVATE_NETWORK set "CWS_CORS_ALLOW_PRIVATE_NETWORK=true"
if not defined CWS_START_MODE set "CWS_START_MODE=start"
if not defined CWS_AIRPAD_VERBOSE set "CWS_AIRPAD_VERBOSE=1"
if not defined CWS_BRIDGE_ENABLED set "CWS_BRIDGE_ENABLED=true"
if not defined CWS_BRIDGE_MODE set "CWS_BRIDGE_MODE=active"
if not defined CWS_BRIDGE_CONNECTION_TYPE set "CWS_BRIDGE_CONNECTION_TYPE=exchanger-initiator"
if not defined CWS_BRIDGE_ENDPOINT_URL set "CWS_BRIDGE_ENDPOINT_URL=https://45.147.121.152:8443/"
if not defined CWS_BRIDGE_ENDPOINTS set "CWS_BRIDGE_ENDPOINTS=https://45.147.121.152:8443/,https://100.76.202.88:8443/,https://192.168.0.200:8443/"
if not defined CWS_BRIDGE_PRECONNECT_TARGETS set "CWS_BRIDGE_PRECONNECT_TARGETS=L-192.168.0.200"
if not defined CWS_BRIDGE_RECONNECT_MS set "CWS_BRIDGE_RECONNECT_MS=3000"
if not defined CWS_BRIDGE_REJECT_UNAUTHORIZED set "CWS_BRIDGE_REJECT_UNAUTHORIZED=false"
if not defined CWS_PORTABLE_DATA_PATH set "CWS_PORTABLE_DATA_PATH=./.data"
if not defined CWS_PORTABLE_CONFIG_PATH set "CWS_PORTABLE_CONFIG_PATH=./portable.config.json"
if not defined CWS_HTTPS_ENABLED set "CWS_HTTPS_ENABLED=true"
if not defined CWS_ROLES set "CWS_ROLES=responser-initiated,requestor-initiated,responser-initiator,requestor-initiator,exchanger-initiator,exchanger-initiated"
if not defined CWS_ASSOCIATED_TOKEN set "CWS_ASSOCIATED_TOKEN=n3v3rm1nd"
if not defined CWS_BRIDGE_USER_ID set "CWS_BRIDGE_USER_ID=L-192.168.0.110"
if not defined CWS_BRIDGE_USER_KEY set "CWS_BRIDGE_USER_KEY=n3v3rm1nd"
if not defined CWS_BRIDGE_DEVICE_ID set "CWS_BRIDGE_DEVICE_ID=L-192.168.0.110"
if not defined CWS_CLIPBOARD_LOG_PREVIEW set "CWS_CLIPBOARD_LOG_PREVIEW=64"
if not defined CWS_AIRPAD_NATIVE_ACTIONS set "CWS_AIRPAD_NATIVE_ACTIONS=true"
if not defined CWS_HTTPS_CERT set "CWS_HTTPS_CERT=fs:./https/local/multi.crt"
if not defined CWS_ASSOCIATED_ID set "CWS_ASSOCIATED_ID=L-192.168.0.110"
if not defined CWS_HTTPS_CA set "CWS_HTTPS_CA=fs:./https/local/rootCA.crt"
if not defined CWS_CLIPBOARD_LOGGING set "CWS_CLIPBOARD_LOGGING=true"
if not defined CWS_CLIPBOARD_LOG_HASH set "CWS_CLIPBOARD_LOG_HASH=true"
if not defined CWS_HTTPS_KEY set "CWS_HTTPS_KEY=fs:./https/local/multi.key"
if not defined CWS_AIRPAD_ROBOTJS_ENABLED set "CWS_AIRPAD_ROBOTJS_ENABLED=true"
set "CWS_START_MODE=%CWS_START_MODE%"
if "%CWS_START_MODE%"=="" if "%CWS_START_MODE%"=="" set "CWS_START_MODE=start"
if "%CWS_START_MODE%"=="" set "CWS_START_MODE=%CWS_START_MODE%"
where pm2 >nul 2>&1
if not errorlevel 1 (
  if exist ecosystem.config.cjs (
    for /f "delims=" %%N in ('pm2 describe cws --no-color 2^>nul ^| findstr /C:"cws"') do (
      set "HAS_PM2_APP=1"
    )
    if defined HAS_PM2_APP (
      call pm2 restart cws --update-env
    ) else (
      call pm2 start ecosystem.config.cjs
    )
    if errorlevel 1 (
      echo [portable] PM2 failed to start service.
      pause
      exit /b 1
    )
    exit /b 0
  )
)
where node >nul 2>&1
if errorlevel 1 (
  echo [portable] Node.js 22+ is required.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\tsx.cmd" (
  echo [portable] Installing dependencies ^(first run^)^...
  call npm ci --include=dev
  if errorlevel 1 (
    echo [portable] npm ci failed, retrying with npm install...
    call npm install --include=dev
    if errorlevel 1 (
      echo [portable] Failed to install dependencies.
      pause
      exit /b 1
    )
  )
)

:portable_pm2_fallback
if not exist "launcher.mjs" goto :use_legacy_start
if /I "%CWS_START_MODE%"=="watch" (
  start "" /B /D "%~dp0" npm.cmd run start:watch
) else (
  start "" /B /D "%~dp0" npm.cmd run start:direct
)
exit /b 0
:use_legacy_start
if /I "%CWS_START_MODE%"=="watch" (
  start "" /B /D "%~dp0" npm.cmd run start:watch
) else (
  start "" /B /D "%~dp0" npm.cmd run start
)
exit /b 0
