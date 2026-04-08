@echo off
setlocal
set "R=%~dp0"
if exist "%R%cwsp\package.json" (
  cd /d "%R%cwsp"
  call npm install
  goto :done
)
if exist "%R%cwsp\dist\portable\package.json" (
  cd /d "%R%cwsp\dist\portable"
  call npm install --omit=dev --no-audit --no-fund
  goto :done
)
echo [install] No cwsp\package.json or cwsp\dist\portable\package.json under %R%
exit /b 1
:done
endlocal
