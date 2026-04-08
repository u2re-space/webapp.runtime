//import module from 'module-alias';
import electron from 'electron';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import BrowserApp from './browser.mjs';

const __dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));
const { app, ipcMain, nativeTheme, BrowserWindow } = electron;
const browser = new BrowserApp(app);

/** @type {import('node:child_process').ChildProcess | null} */
let cwspChild = null;

/** Admin Fastify (health + /api/admin); default matches CWS_HTTPS_PORT (8443). */
const defaultAdminBase = () =>
    (process.env.CWS_ELECTRON_ADMIN_URL || 'https://127.0.0.1:8443/').replace(/\/?$/, '/');

/** Public Fastify (frontend / static); default matches CWS_PUBLIC_HTTPS_PORT (443). */
const defaultPublicUrl = () =>
    (process.env.CWS_ELECTRON_URL || 'https://127.0.0.1:443/').replace(/\/?$/, '/');

function startPortableServer() {
    const portableDir = path.join(__dirname, 'portable');
    const script = path.join(portableDir, 'cwsp.mjs');
    const useElectronAsNode =
        Boolean(process.versions.electron) && String(process.env.CWS_FORCE_NODE_BINARY || '').trim() !== '1';
    const cmd = useElectronAsNode ? process.execPath : 'node';
    const args = [script];
    const env = {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
        CWS_CLIPBOARD_ENABLED: process.env.CWS_CLIPBOARD_ENABLED || 'true',
        ...(useElectronAsNode ? { ELECTRON_RUN_AS_NODE: '1' } : {})
    };
    cwspChild = spawn(cmd, args, {
        cwd: portableDir,
        env,
        stdio: 'inherit',
        shell: process.platform === 'win32' && !useElectronAsNode
    });
    cwspChild.on('error', (err) => console.error('[Electron] Failed to spawn CWSP portable:', err));
    cwspChild.on('close', (code) => {
        console.log(`[Electron] CWSP portable exited with code ${code}`);
        cwspChild = null;
    });
}

async function waitForAdmin(baseUrl, timeoutMs = 60000) {
    const admin = new URL('api/admin', baseUrl).toString();
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(admin, {
                method: 'GET',
                signal: AbortSignal.timeout(2000)
            });
            if (res.ok) return;
        } catch {
            /* still starting */
        }
        await new Promise((r) => setTimeout(r, 400));
    }
    console.warn('[Electron] Admin health check timed out; loading UI anyway');
}

const restart = async () => {
    if (browser.browser?.isDestroyed?.()) {
        browser.browser = null;
        browser.shown = false;
    }
    browser.init();
    const base = defaultPublicUrl();
    await browser.loadURL(base);
};

// execute application...
export const main = (async () => {
    app.commandLine.appendSwitch('allow-file-access-from-files');
    app.commandLine.appendSwitch('enable-experimental-web-platform-features');
    app.commandLine.appendSwitch('enable-javascript-harmony');
    app.commandLine.appendSwitch('ignore-certificate-errors');
    app.commandLine.appendSwitch('allow-insecure-localhost');
    app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        console.warn(error);
        event.preventDefault();
        callback(true);
    });

    await app.whenReady().catch(console.warn.bind(console));

    startPortableServer();
    await waitForAdmin(defaultAdminBase());
    await restart();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length < 1) {
            await restart();
        }
    });

    app.on('before-quit', () => {
        if (cwspChild && !cwspChild.killed) {
            cwspChild.kill('SIGTERM');
        }
    });

    return app;
})();

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
    } else {
        nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
});

ipcMain.handle('theme-color:change', (event, [color, symbolColor]) => {
    browser.browser.setTitleBarOverlay({
        color: color || '#000000',
        symbolColor: symbolColor || '#FFFFFF'
    });
});

export default main;
