import { placeCSSCompatWarning } from "./vital.mjs";
const APP_JS = "./apps/cw/index.js";
const SW_JS  = "./apps/cw/sw.js";

//
if (placeCSSCompatWarning()) {
    // Start app loading immediately - don't wait for SW registration
    const appPromise = import(APP_JS);

    // Register SW in parallel (non-blocking)
    if (typeof navigator != "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.register(new URL(SW_JS, import.meta.url).href, {
            scope: "/",
            type: 'module'
        }).catch(console.warn.bind(console));
    }

    // Mount app when ready
    appPromise
        .then((m) => m?.default?.(document?.querySelector?.("#app")))
        .catch(console.error.bind(console));
}
