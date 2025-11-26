import { placeCSSCompatWarning } from "./vital.mjs";
const _SUB   = location?.hostname?.split?.(".")?.[0]?.trim?.();
const APP_JS = "./apps/cw/index.js";//_SUB == "print" ? "./print/app.js" : "./app/app.js";
const SW_JS  = "./apps/cw/sw.js";

//
if (placeCSSCompatWarning()) {
    (async()=>{
        if (typeof navigator != "undefined") {
            await navigator?.serviceWorker?.register?.(new URL(SW_JS, import.meta.url).href, {scope: "/", type: 'module'})?.catch?.(console.warn.bind(console));
        }
        import(`${APP_JS}`)?.then?.((m)=>m?.default?.(document?.querySelector?.("#app")))?.catch?.(console.error.bind(console));
    })();
}
