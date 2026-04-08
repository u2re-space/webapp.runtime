const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { spawn } = require('node:child_process');

let mainWindow;
let cwspProcess;

function startCWSP() {
  const portableDir = path.join(__dirname, 'dist', 'portable');
  const portablePath = path.join(portableDir, 'cwsp.mjs');
  console.log('[Electron] Starting CWSP Portable from:', portablePath);
  const useElectronAsNode =
    Boolean(process.versions.electron) && String(process.env.CWS_FORCE_NODE_BINARY || '').trim() !== '1';
  const cmd = useElectronAsNode ? process.execPath : 'node';
  const env = {
    ...process.env,
    CWS_CLIPBOARD_ENABLED: 'true',
    ...(useElectronAsNode ? { ELECTRON_RUN_AS_NODE: '1' } : {})
  };
  cwspProcess = spawn(cmd, [portablePath], {
    cwd: portableDir,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32' && !useElectronAsNode
  });

  cwspProcess.on('close', (code) => {
    console.log(`[Electron] CWSP process exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const ui = process.env.CWS_ELECTRON_URL || 'https://127.0.0.1:8443/';
  setTimeout(() => {
    mainWindow.loadURL(ui);
  }, 2000);
}

app.whenReady().then(() => {
  startCWSP();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (cwspProcess) {
    cwspProcess.kill();
  }
});
