import { initClipboardReceiver } from './Clipboard.js';

const DEFAULT_CONFIG$1 = {
  containerId: "rs-toast-layer",
  position: "bottom",
  maxToasts: 5,
  zIndex: 2147483647
};
const TOAST_STYLES = `
.rs-toast-layer {
    position: fixed;
    z-index: var(--rs-toast-z, 2147483647);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 0.5rem;
    max-block-size: 80dvb;
    overflow: hidden;
    box-sizing: border-box;
}

.rs-toast-layer[data-position="bottom"],
.rs-toast-layer:not([data-position]) {
    inset-block-end: 10dvb;
    inset-inline: 0;
    justify-content: flex-end;
}

.rs-toast-layer[data-position="top"] {
    inset-block-start: 10dvb;
    inset-inline: 0;
    justify-content: flex-start;
}

.rs-toast-layer[data-position="top-left"] {
    inset-block-start: 10dvb;
    inset-inline-start: 0;
    align-items: flex-start;
}

.rs-toast-layer[data-position="top-right"] {
    inset-block-start: 10dvb;
    inset-inline-end: 0;
    align-items: flex-end;
}

.rs-toast-layer[data-position="bottom-left"] {
    inset-block-end: 10dvb;
    inset-inline-start: 0;
    align-items: flex-start;
}

.rs-toast-layer[data-position="bottom-right"] {
    inset-block-end: 10dvb;
    inset-inline-end: 0;
    align-items: flex-end;
}

.rs-toast {
    --toast-bg: oklch(from var(--surface-color, #1a1a1a) l c h / 0.85);
    --toast-text: var(--on-surface-color, #ffffff);
    --toast-radius: 9999px;
    --toast-shadow: 0 2px 8px rgba(0,0,0,0.25);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    max-inline-size: min(90vw, 32rem);
    inline-size: fit-content;

    border-radius: var(--toast-radius);
    background: var(--toast-bg);
    box-shadow: var(--toast-shadow);
    backdrop-filter: blur(12px) saturate(140%);
    color: var(--toast-text);

    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    white-space: nowrap;

    pointer-events: auto;
    user-select: none;
    cursor: default;

    opacity: 0;
    transform: translateY(100%) scale(0.9);
    transition:
        opacity 160ms ease-out,
        transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
        background-color 100ms ease;
}

.rs-toast[data-visible] {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.rs-toast:active {
    transform: scale(0.98);
}

.rs-toast[data-kind="success"] {
    --toast-bg: oklch(from var(--color-success, #22c55e) l c h / 0.9);
}

.rs-toast[data-kind="warning"] {
    --toast-bg: oklch(from var(--color-warning, #f59e0b) l c h / 0.9);
}

.rs-toast[data-kind="error"] {
    --toast-bg: oklch(from var(--color-error, #ef4444) l c h / 0.9);
}

@media (prefers-reduced-motion: reduce) {
    .rs-toast,
    .rs-toast[data-visible] {
        transition-duration: 0ms;
        transform: none;
    }
}
`;
const injectedDocs$1 = /* @__PURE__ */ new WeakSet();
const toastLayers = /* @__PURE__ */ new Map();
const ensureStyles = (doc = document) => {
  if (injectedDocs$1.has(doc)) return;
  const style = doc.createElement("style");
  style.id = "__rs-toast-styles__";
  style.textContent = TOAST_STYLES;
  (doc.head || doc.documentElement).appendChild(style);
  injectedDocs$1.add(doc);
};
const getToastLayer = (config, doc = document) => {
  const key = `${config.containerId}-${config.position}`;
  if (toastLayers.has(key)) {
    const existing = toastLayers.get(key);
    if (existing.isConnected) return existing;
    toastLayers.delete(key);
  }
  ensureStyles(doc);
  let layer = doc.getElementById(config.containerId);
  if (!layer) {
    layer = doc.createElement("div");
    layer.id = config.containerId;
    layer.className = "rs-toast-layer";
    doc.body.appendChild(layer);
  }
  layer.setAttribute("data-position", config.position);
  layer.style.setProperty("--rs-toast-z", String(config.zIndex));
  toastLayers.set(key, layer);
  return layer;
};
const showToast$1 = (options) => {
  const opts = typeof options === "string" ? { message: options } : options;
  const {
    message,
    kind = "info",
    duration = 3e3,
    persistent = false,
    position = "bottom",
    onClick
  } = opts;
  if (typeof document === "undefined") {
    broadcastToast(opts);
    return null;
  }
  const config = {
    ...DEFAULT_CONFIG$1,
    position
  };
  const layer = getToastLayer(config);
  while (layer.children.length >= config.maxToasts) {
    layer.firstChild?.remove();
  }
  const toast = document.createElement("div");
  toast.className = "rs-toast";
  toast.setAttribute("data-kind", kind);
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
  toast.textContent = message;
  layer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.setAttribute("data-visible", "");
  });
  const removeToast = () => {
    toast.removeAttribute("data-visible");
    setTimeout(() => {
      toast.remove();
    }, 200);
  };
  if (!persistent) {
    setTimeout(removeToast, duration);
  }
  toast.addEventListener("click", () => {
    onClick?.();
    removeToast();
  });
  return toast;
};
const broadcastToast = (options) => {
  try {
    const channel = new BroadcastChannel("rs-toast");
    channel.postMessage({ type: "show-toast", options });
    channel.close();
  } catch (e) {
    console.warn("[Toast] Broadcast failed:", e);
  }
};
const listenForToasts = () => {
  if (typeof BroadcastChannel === "undefined") return () => {
  };
  const channel = new BroadcastChannel("rs-toast");
  const handler = (event) => {
    if (event.data?.type === "show-toast" && event.data?.options) {
      showToast$1(event.data.options);
    }
  };
  channel.addEventListener("message", handler);
  return () => {
    channel.removeEventListener("message", handler);
    channel.close();
  };
};
const initToastReceiver = () => {
  return listenForToasts();
};

const DEFAULT_CONFIG = {
  prefix: "sel-dom",
  zIndex: 2147483647
};
const createOverlayStyles = (prefix, zIndex) => `
html > .${prefix}-overlay,
body > .${prefix}-overlay,
.${prefix}-overlay[popover] {
    position: fixed !important;
    inset: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    z-index: ${zIndex} !important;
    display: none;
    visibility: hidden;
    pointer-events: none;
    box-sizing: border-box !important;
    inline-size: 100vw !important;
    block-size: 100vh !important;
    max-inline-size: 100vw !important;
    max-block-size: 100vh !important;
    overflow: visible !important;
    cursor: crosshair !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -webkit-user-drag: none !important;
    outline: none !important;
}

html > .${prefix}-overlay:popover-open,
body > .${prefix}-overlay:popover-open,
.${prefix}-overlay[popover]:popover-open {
    display: block !important;
    visibility: visible !important;
    pointer-events: auto !important;
}

html > .${prefix}-overlay::backdrop,
body > .${prefix}-overlay::backdrop,
.${prefix}-overlay[popover]::backdrop {
    position: fixed !important;
    inset: 0 !important;
    background: rgba(0, 0, 0, 0.35) !important;
    pointer-events: auto !important;
    cursor: crosshair !important;
    z-index: ${zIndex - 1} !important;
}

.${prefix}-overlay .${prefix}-box,
.${prefix}-box {
    position: fixed !important;
    overflow: visible !important;
    border: 2px solid #4da3ff !important;
    background: rgba(77, 163, 255, 0.15) !important;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4) !important;
    pointer-events: none !important;
    -webkit-user-drag: none !important;
    box-sizing: border-box !important;
    z-index: 1 !important;
}

.${prefix}-overlay .${prefix}-hint,
.${prefix}-hint {
    position: fixed !important;
    inset-inline-start: 50% !important;
    inset-block-start: 50% !important;
    transform: translate(-50%, -50%) !important;
    background: rgba(0, 0, 0, 0.8) !important;
    color: #fff !important;
    font: 13px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif !important;
    padding: 10px 16px !important;
    border-radius: 8px !important;
    pointer-events: none !important;
    -webkit-user-drag: none !important;
    inline-size: max-content !important;
    block-size: max-content !important;
    z-index: 2 !important;
    white-space: nowrap !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.${prefix}-hint:empty {
    display: none !important;
    visibility: hidden !important;
}

.${prefix}-overlay .${prefix}-size-badge,
.${prefix}-box .${prefix}-size-badge,
.${prefix}-size-badge {
    position: absolute !important;
    transform: translate(6px, 6px) !important;
    background: #1e293b !important;
    color: #fff !important;
    font: 11px/1.3 ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
    pointer-events: none !important;
    -webkit-user-drag: none !important;
    inline-size: max-content !important;
    block-size: max-content !important;
    z-index: 3 !important;
    white-space: nowrap !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4) !important;
}

.${prefix}-size-badge:empty {
    display: none !important;
    visibility: hidden !important;
}

html > .${prefix}-toast,
body > .${prefix}-toast,
.${prefix}-toast {
    position: fixed !important;
    inset-inline-start: 50% !important;
    inset-block-end: 24px !important;
    inset-block-start: auto !important;
    inset-inline-end: auto !important;
    transform: translateX(-50%) !important;
    background: rgba(0, 0, 0, 0.9) !important;
    color: #fff !important;
    font: 13px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif !important;
    padding: 10px 16px !important;
    border-radius: 8px !important;
    pointer-events: none !important;
    -webkit-user-drag: none !important;
    inline-size: max-content !important;
    block-size: max-content !important;
    z-index: ${zIndex} !important;
    white-space: nowrap !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease-out, visibility 200ms ease-out !important;
    margin: 0 !important;
    border: none !important;
    box-sizing: border-box !important;
}

.${prefix}-toast.is-visible {
    opacity: 1 !important;
    visibility: visible !important;
}

.${prefix}-toast:empty {
    display: none !important;
}
`;
const injectedDocs = /* @__PURE__ */ new WeakSet();
const overlayInstances = /* @__PURE__ */ new Map();
let _receiversInitialized = false;
const initReceivers = () => {
  if (_receiversInitialized) return;
  _receiversInitialized = true;
  initToastReceiver();
  initClipboardReceiver();
};
const injectStyles = (config, doc = document) => {
  if (injectedDocs.has(doc)) return;
  const styleId = `__${config.prefix}-styles__`;
  if (doc.getElementById(styleId)) {
    injectedDocs.add(doc);
    return;
  }
  const style = doc.createElement("style");
  style.id = styleId;
  style.textContent = createOverlayStyles(config.prefix, config.zIndex);
  (doc.head || doc.documentElement).appendChild(style);
  injectedDocs.add(doc);
};
const createElements = (config, doc = document) => {
  const key = config.prefix;
  if (overlayInstances.has(key)) {
    const existing = overlayInstances.get(key);
    if (existing.overlay?.isConnected) return existing;
    overlayInstances.delete(key);
  }
  if (!doc?.documentElement) {
    return { overlay: null, box: null, hint: null, sizeBadge: null, toast: null };
  }
  injectStyles(config, doc);
  initReceivers();
  const overlay2 = doc.createElement("div");
  overlay2.className = `${config.prefix}-overlay`;
  overlay2.draggable = false;
  overlay2.tabIndex = -1;
  overlay2.popover = "manual";
  const box2 = doc.createElement("div");
  box2.className = `${config.prefix}-box`;
  box2.tabIndex = -1;
  const hint2 = doc.createElement("div");
  hint2.className = `${config.prefix}-hint`;
  hint2.textContent = "Select area. Esc — cancel";
  hint2.tabIndex = -1;
  const sizeBadge2 = doc.createElement("div");
  sizeBadge2.className = `${config.prefix}-size-badge`;
  sizeBadge2.textContent = "";
  sizeBadge2.tabIndex = -1;
  const toast = doc.createElement("div");
  toast.className = `${config.prefix}-toast`;
  toast.tabIndex = -1;
  box2.appendChild(sizeBadge2);
  overlay2.appendChild(box2);
  overlay2.appendChild(hint2);
  doc.documentElement.appendChild(toast);
  doc.documentElement.appendChild(overlay2);
  toast.addEventListener("transitionend", () => {
    if (!toast.classList.contains("is-visible")) {
      toast.textContent = "";
    }
  });
  const elements = { overlay: overlay2, box: box2, hint: hint2, sizeBadge: sizeBadge2, toast };
  overlayInstances.set(key, elements);
  return elements;
};
const getOverlayElements = (config) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  if (typeof document === "undefined") {
    return { overlay: null, box: null, hint: null, sizeBadge: null, toast: null };
  }
  return createElements(fullConfig);
};
const getOverlay = (config) => getOverlayElements(config).overlay;
const getBox = (config) => getOverlayElements(config).box;
const getHint = (config) => getOverlayElements(config).hint;
const getSizeBadge = (config) => getOverlayElements(config).sizeBadge;
const showToast = (text, config) => {
  if (typeof text === "object") {
    showToast$1(text);
    return;
  }
  try {
    showToast$1({ message: text, kind: "info", duration: 1800 });
  } catch {
    const elements = getOverlayElements(config);
    const toast = elements.toast;
    if (!toast) return;
    if (!toast.classList.contains("is-visible")) {
      toast.classList.add("is-visible");
    }
    if (toast.textContent === text) return;
    toast.textContent = text;
    setTimeout(() => {
      if (toast.textContent !== text) return;
      toast.classList.remove("is-visible");
    }, 1800);
  }
};
const showSelection = (config) => {
  const elements = getOverlayElements(config);
  const { overlay: overlay2, box: box2, sizeBadge: sizeBadge2 } = elements;
  if (!overlay2 || !box2) return;
  try {
    overlay2.showPopover?.();
  } catch (e) {
    console.warn("[Overlay] showPopover failed:", e);
  }
  overlay2.style.setProperty("display", "block", "important");
  box2.style.left = "0px";
  box2.style.top = "0px";
  box2.style.width = "0px";
  box2.style.height = "0px";
  if (sizeBadge2) sizeBadge2.textContent = "";
};
const hideSelection = (config) => {
  const elements = getOverlayElements(config);
  const { overlay: overlay2, box: box2, sizeBadge: sizeBadge2 } = elements;
  if (!overlay2) return;
  overlay2.style.removeProperty("display");
  try {
    overlay2.hidePopover?.();
  } catch (e) {
    console.warn("[Overlay] hidePopover failed:", e);
  }
  if (box2) {
    box2.style.left = "0px";
    box2.style.top = "0px";
    box2.style.width = "0px";
    box2.style.height = "0px";
  }
  if (sizeBadge2) {
    sizeBadge2.textContent = "";
  }
};
const initOverlay = (config) => {
  if (typeof document === "undefined") {
    return { overlay: null, box: null, hint: null, sizeBadge: null, toast: null };
  }
  if (document.readyState === "loading") {
    let elements = { overlay: null, box: null, hint: null, sizeBadge: null, toast: null };
    document.addEventListener("DOMContentLoaded", () => {
      elements = getOverlayElements(config);
    }, { once: true });
    return elements;
  }
  return getOverlayElements(config);
};
new Proxy({}, {
  get: (_, prop) => getOverlay()?.[prop],
  set: (_, prop, value) => {
    const o = getOverlay();
    if (o) o[prop] = value;
    return true;
  }
});
new Proxy({}, {
  get: (_, prop) => getBox()?.[prop],
  set: (_, prop, value) => {
    const b = getBox();
    if (b) b[prop] = value;
    return true;
  }
});
new Proxy({}, {
  get: (_, prop) => getHint()?.[prop],
  set: (_, prop, value) => {
    const h = getHint();
    if (h) h[prop] = value;
    return true;
  }
});
new Proxy({}, {
  get: (_, prop) => getSizeBadge()?.[prop],
  set: (_, prop, value) => {
    const s = getSizeBadge();
    if (s) s[prop] = value;
    return true;
  }
});
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => getOverlayElements(), { once: true });
  } else {
    getOverlayElements();
  }
}

const overlay = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    getBox,
    getHint,
    getOverlay,
    getOverlayElements,
    getSizeBadge,
    hideSelection,
    initOverlay,
    showSelection,
    showToast
}, Symbol.toStringTag, { value: 'Module' }));

export { getBox, getHint, getOverlay, getSizeBadge, hideSelection, initOverlay, initToastReceiver, overlay, showSelection, showToast };
//# sourceMappingURL=overlay.js.map
