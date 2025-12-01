// workaround for happy-fs
if (typeof process == "undefined" || !window?.process) {
    window.process = {
        env: {
            NODE_ENV: "production"
        }
    }
}

// Defer non-critical initialization
requestIdleCallback(() => {
    // avoid any dragging when no-needed...
    document.documentElement.addEventListener("dragstart", (ev) => {
        if (ev?.target?.matches?.("div, img, picture, canvas, video, svg")) {
            ev.preventDefault();
        }
    }, {passive: false, capture: true});

    // comment to enable native context menu
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        ev.preventDefault();
    });

    //
    if ("virtualKeyboard" in navigator && navigator?.virtualKeyboard) {
        // @ts-ignore
        navigator.virtualKeyboard.overlaysContent = true;
    }

    //
    const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");
    media?.addEventListener?.("change", (e)=>{
        document.documentElement.dataset.deviceType = e?.matches ? "desktop" : "mobile";
        document.body.dataset.deviceType = e?.matches ? "desktop" : "mobile";
    });

    //
    document.documentElement.dataset.deviceType = media?.matches ? "desktop" : "mobile";
    document.body.dataset.deviceType = media?.matches ? "desktop" : "mobile";
}, { timeout: 100 });
