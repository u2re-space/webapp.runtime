const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { spawn } = require('node:child_process');

let mainWindow;
let cwspProcess;

function startCWSP() {
  const portablePath = path.join(__dirname, '../portable/cwsp.cjs');
  console.log('[Electron] Starting CWSP Portable from:', portablePath);
  
  cwspProcess = spawn('node', [portablePath], {
    env: { ...process.env, CWS_CLIPBOARD_ENABLED: 'true' },
    stdio: 'inherit'
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

  // Wait a bit for the server to start, then load the frontend
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:80'); // Public Frontend Port
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
