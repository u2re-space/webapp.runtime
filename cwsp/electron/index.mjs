//import module from 'module-alias';
import electron from 'electron';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import BrowserApp from './browser.mjs';
import { resolveCwspServerLayoutRoot } from '../scripts/stage-cwsp-server-runtime.mjs';

const __dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));
const { app, ipcMain, nativeTheme, BrowserWindow } = electron;
const browser = new BrowserApp(app);

/** @type {import('node:child_process').ChildProcess | null} */
let cwspChild = null;
const ELECTRON_SETTINGS_FILE = 'cwsp-electron-settings.json';

const isObject = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getSettingsPath = () => path.join(app.getPath('userData'), ELECTRON_SETTINGS_FILE);

const loadElectronSettings = async () => {
    const settingsPath = getSettingsPath();
    try {
        const raw = await readFile(settingsPath, 'utf8');
        const parsed = JSON.parse(raw);
        return isObject(parsed) ? parsed : {};
    } catch {
        return {};
    }
};

const saveElectronSettings = async (next) => {
    const settingsPath = getSettingsPath();
    const dir = path.dirname(settingsPath);
    await mkdir(dir, { recursive: true });
    await writeFile(settingsPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
};

const toRecord = (value) => (isObject(value) ? value : {});

/** Admin Fastify (health + /api/admin); default matches CWS_HTTPS_PORT (8443). */
const defaultAdminBase = () =>
    (process.env.CWS_ELECTRON_ADMIN_URL || 'https://127.0.0.1:8443/').replace(/\/?$/, '/');

/** Public Fastify (frontend / static); default matches CWS_PUBLIC_HTTPS_PORT (443). */
const defaultPublicUrl = () =>
    (process.env.CWS_ELECTRON_URL || 'https://127.0.0.1:443/').replace(/\/?$/, '/');

/** When 443/80 are unavailable, cwsp binds fallbacks (8444, …). Probe in order. */
const publicUrlCandidates = () => {
    const fromEnv = String(process.env.CWS_ELECTRON_PUBLIC_URLS || '').trim();
    if (fromEnv) {
        return fromEnv
            .split(',')
            .map((s) => s.trim().replace(/\/?$/, '/'))
            .filter(Boolean);
    }
    return [
        defaultPublicUrl(),
        'https://127.0.0.1:8444/',
        'https://127.0.0.1:9443/',
        'https://127.0.0.1:7443/'
    ];
};

async function waitForPublicUrl(timeoutMs = 90000) {
    const fixed = String(process.env.CWS_ELECTRON_URL || '').trim();
    if (fixed) {
        const u = fixed.replace(/\/?$/, '/');
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            try {
                const res = await fetch(u, {
                    method: 'GET',
                    redirect: 'manual',
                    signal: AbortSignal.timeout(2000)
                });
                if (res.ok || res.status === 304 || (res.status >= 300 && res.status < 400)) return u;
            } catch {
                /* still starting */
            }
            await new Promise((r) => setTimeout(r, 400));
        }
        return u;
    }
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        for (const base of publicUrlCandidates()) {
            try {
                const res = await fetch(base, {
                    method: 'GET',
                    redirect: 'manual',
                    signal: AbortSignal.timeout(2000)
                });
                if (res.ok || res.status === 304 || (res.status >= 300 && res.status < 400)) {
                    if (base !== defaultPublicUrl()) {
                        console.log(`[Electron] Using public UI at ${base} (primary port may be unavailable)`);
                    }
                    return base;
                }
            } catch {
                /* try next */
            }
        }
        await new Promise((r) => setTimeout(r, 400));
    }
    console.warn('[Electron] Public URL probe timed out; loading default URL anyway');
    return defaultPublicUrl();
}

function startCwspServer() {
    const cwspRoot = path.join(__dirname, 'cwsp-runtime');
    const tsxCli = path.join(cwspRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    const serverRoot = resolveCwspServerLayoutRoot(cwspRoot);
    const entry = path.join(serverRoot, 'server', 'index.ts');
    if (!existsSync(entry)) {
        console.error('[Electron] Missing', entry, '— run npm run build:electron and npm install in dist/electron + cwsp-runtime');
        return;
    }
    if (!existsSync(tsxCli)) {
        console.error(
            '[Electron] Missing tsx at',
            tsxCli,
            '— run: cd cwsp-runtime && npm install --include=dev (or npm run build:electron:native from cwsp)'
        );
        return;
    }
    const useElectronAsNode =
        Boolean(process.versions.electron) && String(process.env.CWS_FORCE_NODE_BINARY || '').trim() !== '1';
    const cmd = useElectronAsNode ? process.execPath : 'node';
    const args = [tsxCli, 'server/index.ts'];
    const portableConfig = process.env.CWS_PORTABLE_CONFIG_PATH || path.join(serverRoot, 'config', 'portable.config.json');
    const portableData = process.env.CWS_PORTABLE_DATA_PATH || path.join(serverRoot, '.data');
    const env = {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
        CWS_CLIPBOARD_ENABLED: process.env.CWS_CLIPBOARD_ENABLED || 'true',
        CWS_PORTABLE_CONFIG_PATH: portableConfig,
        CWS_PORTABLE_DATA_PATH: portableData,
        ...(useElectronAsNode ? { ELECTRON_RUN_AS_NODE: '1' } : {})
    };
    console.log('[Electron] Starting CWSP TS server (tsx) cwd=', serverRoot);
    cwspChild = spawn(cmd, args, {
        cwd: serverRoot,
        env,
        stdio: 'inherit',
        shell: process.platform === 'win32' && !useElectronAsNode
    });
    cwspChild.on('error', (err) => console.error('[Electron] Failed to spawn CWSP server:', err));
    cwspChild.on('close', (code) => {
        console.log(`[Electron] CWSP server exited with code ${code}`);
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
    const base = await waitForPublicUrl();
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

    startCwspServer();
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

ipcMain.handle('cws:ipc:get-shell-info', () => ({
    shell: 'electron',
    bridge: 'electronBridge',
    native: true,
    platform: 'electron'
}));

ipcMain.handle('cws:ipc:invoke', async (event, input) => {
    const request = toRecord(input);
    const channel = String(request.channel || 'default').trim() || 'default';
    const payload = toRecord(request.payload);
    const envelope = toRecord(request.envelope);
    if (channel === 'settings:get') {
        const appSettings = await loadElectronSettings();
        return {
            ok: true,
            channel,
            appSettings,
            echo: payload,
            envelope
        };
    }
    if (channel === 'settings:patch') {
        const patch = toRecord(payload.appSettings);
        const current = await loadElectronSettings();
        const next = { ...current, ...patch };
        await saveElectronSettings(next);
        return {
            ok: true,
            channel,
            appSettings: next,
            echo: payload,
            envelope
        };
    }
    if (channel === 'network:status') {
        return {
            ok: true,
            channel,
            echo: payload,
            network: {
                publicUrl: defaultPublicUrl(),
                adminUrl: defaultAdminBase(),
                publicCandidates: publicUrlCandidates()
            },
            envelope
        };
    }
    return {
        ok: true,
        channel,
        echo: payload,
        envelope
    };
});

export default main;
