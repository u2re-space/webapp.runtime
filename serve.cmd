@echo off
setlocal
cd /d "%~dp0cwsp"
if not exist "package.json" (
  echo [serve] missing cwsp\package.json
  exit /b 1
)
call npm run dev
endlocal
