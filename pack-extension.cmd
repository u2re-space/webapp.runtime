@echo off
setlocal
set "ROOT=%~dp0"
set "REPO=%ROOT%.."
set "CW=%REPO%\apps\CrossWord"
set "OUT=%ROOT%pack\crx"
if not exist "%CW%\package.json" (
  echo [pack-extension] CrossWord not found: %CW%
  exit /b 1
)
pushd "%CW%"
call npm run build:crx
popd
if exist "%OUT%" rmdir /s /q "%OUT%"
mkdir "%OUT%"
robocopy "%CW%\dist-crx" "%OUT%" /E /NFL /NDL /NJH /NJS /nc /ns /np
if errorlevel 8 exit /b 1
echo [pack-extension] unpacked extension: %OUT%
endlocal
