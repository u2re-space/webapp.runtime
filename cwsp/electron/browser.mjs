//import module from 'module-alias';
import electron from 'electron';
import path from 'path';

//
const { BrowserWindow } = electron;
const toBool = (value, fallback) => {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (!normalized) return fallback;
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return fallback;
};

//
export default class BrowserApp {
    constructor(app) {
        this.app = app;
        this.browser = null;
        this.shown = false;
    }

    //
    init() {
        if (!this.browser) {
            const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
            const enableWebSecurity = toBool(process.env.CWS_ELECTRON_WEB_SECURITY, true);
            const allowInsecureContent = toBool(process.env.CWS_ELECTRON_ALLOW_INSECURE_CONTENT, true);
            const enableNodeIntegration = toBool(process.env.CWS_ELECTRON_NODE_INTEGRATION, true);
            const openDevtools = toBool(process.env.CWS_ELECTRON_DEVTOOLS, true);
            const webPreferences = {
                allowRunningInsecureContent: allowInsecureContent,
                webSecurity: enableWebSecurity,
                experimentalFeatures: true,
                contextIsolation: true,
                nodeIntegration: enableNodeIntegration,
                sandbox: false,
                devTools: openDevtools,
                transparent: true,
                preload: path.resolve(import.meta.dirname, "./injector.mjs")
            };

            //
            this.browser = new BrowserWindow({
                width,
                height,
                center: true,
                show: false,
                frame: false,
                titleBarStyle: 'hidden',
                titleBarOverlay: true,
                webPreferences
            });

            //
            this.browser.once('ready-to-show', () => this.browser.maximize());
        }
    }

    //
    async loadURL(index = "https://localhost:8000/") {
        if (!this.shown) {
            this.shown = true;
            await this.browser.loadURL(index);
            this.browser.show();
            if (toBool(process.env.CWS_ELECTRON_DEVTOOLS, true)) {
                this.browser.webContents.openDevTools();
            }
        }
    }

    //
    loadFile(index = "./index.html") {
        if (!this.shown) {
            this.shown = true;
            this.browser.loadFile(index);
            this.browser.show();
            if (toBool(process.env.CWS_ELECTRON_DEVTOOLS, true)) {
                this.browser.webContents.openDevTools();
            }
        }
    }

    //
    close() {
        this.shown = false;
        this.browser.close();
        this.browser = null;
    }
}
