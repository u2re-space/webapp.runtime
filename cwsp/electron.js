const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');

let mainWindow;
let cwspProcess;

function startCWSP() {
  const cwspRoot = path.join(__dirname, 'cwsp-runtime');
  const tsxCli = path.join(cwspRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  const entry = path.join(cwspRoot, 'server', 'index.ts');
  if (!existsSync(entry)) {
    console.error(
      '[Electron] Missing',
      entry,
      '— use dist/electron layout (npm run build:electron) and npm install in cwsp-runtime'
    );
    process.exit(1);
  }
  if (!existsSync(tsxCli)) {
    console.error('[Electron] Missing tsx — run npm install --include=dev in', cwspRoot);
    process.exit(1);
  }
  console.log('[Electron] Starting CWSP TS server (tsx) cwd=', cwspRoot);
  const useElectronAsNode =
    Boolean(process.versions.electron) && String(process.env.CWS_FORCE_NODE_BINARY || '').trim() !== '1';
  const cmd = useElectronAsNode ? process.execPath : 'node';
  const portableConfig = process.env.CWS_PORTABLE_CONFIG_PATH || path.join(cwspRoot, 'portable.config.json');
  const portableData = process.env.CWS_PORTABLE_DATA_PATH || path.join(cwspRoot, '.data');
  const env = {
    ...process.env,
    CWS_CLIPBOARD_ENABLED: 'true',
    CWS_PORTABLE_CONFIG_PATH: portableConfig,
    CWS_PORTABLE_DATA_PATH: portableData,
    ...(useElectronAsNode ? { ELECTRON_RUN_AS_NODE: '1' } : {})
  };
  cwspProcess = spawn(cmd, [tsxCli, 'server/index.ts'], {
    cwd: cwspRoot,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32' && !useElectronAsNode
  });

  cwspProcess.on('close', (code) => {
    console.log(`[Electron] CWSP server exited with code ${code}`);
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
