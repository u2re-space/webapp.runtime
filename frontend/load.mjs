import { placeCSSCompatWarning } from "./vital.mjs";
const _SUB   = location?.hostname?.split?.(".")?.[0]?.trim?.();
const APP_JS = "./app/app.js";//_SUB == "print" ? "./print/app.js" : "./app/app.js";
const SW_JS  = "./pwa/service.mjs";

//
if (placeCSSCompatWarning()) {
    (async()=>{
        if (typeof navigator != "undefined") {
            await navigator?.serviceWorker?.register?.(new URL(SW_JS, import.meta.url).href, {scope: "/"})?.catch?.(console.warn.bind(console));
        }
        import(`${APP_JS}`)?.then?.((m)=>m?.default?.(document?.querySelector?.("#viewport")))?.catch?.(console.error.bind(console));
    })();
}
