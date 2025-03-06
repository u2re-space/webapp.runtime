//import module from 'module-alias';
import electron from 'electron';
import BrowserApp from './browser.mjs';

//
const { app, ipcMain, nativeTheme } = electron;
const browser = new BrowserApp(app);
const restart = async () => {
    browser.init();
    browser.loadURL(`file://${import.meta.dirname}/../../frontend/index.html`);
}

// execute application...
export const main = (async()=>{
    app.commandLine.appendSwitch('allow-file-access-from-files');
    app.commandLine.appendSwitch('enable-experimental-web-platform-features');
    app.commandLine.appendSwitch('enable-javascript-harmony');
    app.commandLine.appendSwitch('ignore-certificate-errors');
    app.commandLine.appendSwitch('allow-insecure-localhost');
    app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') app.quit();
    });

    //
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        // On certificate error we disable default behaviour (stop loading the page)
        // and we then say "it is all fine - true" to the callback
        console.warn(error);
        event.preventDefault();
        callback(true);
    });

    //
    await app.whenReady().catch(console.warn.bind(console));//.then(() => {
        //installExtension?.(REDUX_DEVTOOLS)
            //.then((name) => console.log(`Added Extension:  ${name}`))
            //.catch((err) => console.log('An error occurred: ', err));
    //}).catch(console.warn.bind(console));

    //
    await restart();

    //
    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length < 1) {
            await restart();
        }
    })

    //
    return app;
});

//
ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
    } else {
        nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
})

//
ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
})

//
ipcMain.handle('theme-color:change', (event, [color, symbolColor]) => {
    browser.browser.setTitleBarOverlay({
        color: color || "#000000",
        symbolColor: symbolColor || "#FFFFFF"
    });
})

// export main process
export default main();
