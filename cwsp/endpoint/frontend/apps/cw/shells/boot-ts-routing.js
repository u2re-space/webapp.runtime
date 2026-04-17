import { D as RAFBehavior, b as resolveGridCellFromClientPoint, h as loadAsAdopted, x as fixOrientToScreen, y as setStyleProperty } from "../fest/dom.js";
import { c as observe, f as makeObjectAssignable, r as affected, s as numberRef, x as redirectCell } from "../fest/object.js";
import "../com/app2.js";
import { t as requestOpenView } from "../views/api.js";
import { A as LongPressHandler, M as bindDraggable, N as makeShiftTrigger, j as clampCell$1, z as registerModal } from "../com/app3.js";
import { i as pickEnabledView, n as ENABLED_VIEW_IDS, r as isEnabledView, t as DEFAULT_VIEW_ID } from "../chunks/views.js";
import { a as readLastActiveBootShell, i as normalizeBootShellId, n as coerceShellForBootViewport } from "./preference.js";
import "../com/service11.js";
import { n as initClipboardReceiver } from "../core/clipboard.js";
import { a as bootTabbed, i as bootMinimal, n as bootBase, o as bootWindow, r as bootEnvironment } from "./boot-ts-BootLoader.js";
import "../com/service13.js";
import "../views/airpad.js";
import { n as initToastReceiver } from "../com/app5.js";
import { n as openUnifiedContextMenu, t as closeUnifiedContextMenu } from "../com/app6.js";
import { i as setAppWallpaper, r as initializeAppCanvasLayer } from "../com/app7.js";
import "../views/airpad2.js";
//#region src/frontend/shells/boot/ts/routing.ts
var normalizeShellPreference = (shell) => normalizeBootShellId(shell);
var getShellFromQuery = () => {
	try {
		const shell = (new URLSearchParams(location.search).get("shell") || "").trim().toLowerCase();
		if (shell === "minimal" || shell === "faint" || shell === "base" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content") return normalizeShellPreference(shell);
	} catch {}
	return null;
};
/** All registered view routes */
var VALID_VIEWS = [...ENABLED_VIEW_IDS];
pickEnabledView("home", DEFAULT_VIEW_ID);
/**
* Normalize pathname (remove base, leading/trailing slashes)
*/
function normalizePathname(pathname) {
	const base = document.querySelector("base")?.getAttribute("href") || "/";
	let normalized = pathname;
	if (base !== "/" && pathname.startsWith(base.replace(/\/$/, ""))) normalized = pathname.slice(base.replace(/\/$/, "").length);
	return normalized.replace(/^\/+|\/+$/g, "").toLowerCase();
}
/**
* Build URL from route
*/
function buildUrl(route) {
	let url = "/";
	if (route.params && Object.keys(route.params).length > 0) {
		const search = new URLSearchParams(route.params).toString();
		url += "?" + search;
	}
	return url;
}
/**
* Navigate to a route (view)
*/
function navigate(route, options = {}) {
	const url = buildUrl(route);
	if (options.replace) history.replaceState(options.state ?? route, "", url);
	else history.pushState(options.state ?? route, "", url);
	globalThis?.dispatchEvent?.(new CustomEvent("route-change", { detail: route }));
}
/**
* Navigate to a view
*/
function navigateToView(view, params) {
	navigate({
		view,
		params
	});
}
/**
* Check if a view is valid
*/
function isValidView(view) {
	return isEnabledView(view);
}
/**
* Get view from pathname
*/
function getViewFromPath() {
	const pathname = normalizePathname(location.pathname);
	if (!pathname || pathname === "/" || pathname === "") {
		const fromState = history.state?.viewId || "";
		if (fromState && isValidView(fromState)) return fromState;
		return null;
	}
	if (isValidView(pathname)) return pathname;
	return null;
}
/**
* Get saved shell preference
*/
function getSavedShellPreference() {
	const fromQuery = getShellFromQuery();
	if (fromQuery) {
		try {
			localStorage.setItem("rs-boot-shell", fromQuery);
		} catch {}
		return coerceShellForBootViewport(fromQuery);
	}
	try {
		const saved = localStorage.getItem("rs-boot-shell");
		if (saved === "minimal" || saved === "faint" || saved === "base" || saved === "window" || saved === "tabbed" || saved === "environment" || saved === "content") {
			const normalized = normalizeShellPreference(saved);
			if (normalized !== saved) localStorage.setItem("rs-boot-shell", normalized);
			return coerceShellForBootViewport(normalized);
		}
		const lastActive = readLastActiveBootShell();
		if (lastActive) return coerceShellForBootViewport(lastActive);
	} catch {}
	return null;
}
/**
* Resolve the shell/view pair to mount and return a lazy mount entrypoint.
*
* AI-READ: this function does not mount immediately. It chooses the canonical
* shell, normalizes legacy aliases, picks a default view for that shell, and
* returns a loader object that the outer app entry can mount into the chosen
* shell layer.
*/
var loadSubAppWithShell = async (shellId, initialView) => {
	const shell = normalizeShellPreference(shellId || getSavedShellPreference() || "minimal");
	const shellDefaultView = shell === "base" || shell === "minimal" ? "viewer" : "home";
	const view = pickEnabledView(initialView || getViewFromPath() || shellDefaultView, "home");
	console.log("[App] Loading sub-app with shell:", shell, "view:", view);
	try {
		switch (shell) {
			case "faint":
			case "tabbed": return { mount: async (el) => {
				await bootTabbed(el, view);
			} };
			case "environment": return { mount: async (el) => {
				await bootEnvironment(el, view);
			} };
			case "base": return { mount: async (el) => {
				await bootBase(el, view);
			} };
			case "content": return { mount: async (el) => {
				await bootWindow(el, view);
			} };
			case "window": return { mount: async (el) => {
				await bootWindow(el, view);
			} };
			case "minimal": return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
			default: return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
		}
	} catch (error) {
		console.error("[App] Failed to load sub-app:", shell, error);
		throw error;
	}
};
//#endregion
//#region src/frontend/shells/boot/ts/overlay.ts
/**
* Unified Overlay System
* Standalone, works in: PWA, Chrome Extension content scripts, vanilla JS
* Provides overlay, selection box, hints, and integrated toast/clipboard
*/
var DEFAULT_CONFIG = {
	prefix: "sel-dom",
	zIndex: 2147483647
};
var createOverlayStyles = (prefix, zIndex) => `
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
var injectedDocs = /* @__PURE__ */ new WeakSet();
var overlayInstances = /* @__PURE__ */ new Map();
var _receiversInitialized = false;
var initReceivers = () => {
	if (_receiversInitialized) return;
	_receiversInitialized = true;
	initToastReceiver();
	initClipboardReceiver();
};
var injectStyles = (config, doc = document) => {
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
var createElements = (config, doc = document) => {
	const key = config.prefix;
	if (overlayInstances.has(key)) {
		const existing = overlayInstances.get(key);
		if (existing.overlay?.isConnected) return existing;
		overlayInstances.delete(key);
	}
	if (!doc?.documentElement) return {
		overlay: null,
		box: null,
		hint: null,
		sizeBadge: null,
		toast: null
	};
	injectStyles(config, doc);
	initReceivers();
	const overlay = doc.createElement("div");
	overlay.className = `${config.prefix}-overlay`;
	overlay.draggable = false;
	overlay.tabIndex = -1;
	overlay.popover = "manual";
	const box = doc.createElement("div");
	box.className = `${config.prefix}-box`;
	box.tabIndex = -1;
	const hint = doc.createElement("div");
	hint.className = `${config.prefix}-hint`;
	hint.textContent = "Select area. Esc — cancel";
	hint.tabIndex = -1;
	const sizeBadge = doc.createElement("div");
	sizeBadge.className = `${config.prefix}-size-badge`;
	sizeBadge.textContent = "";
	sizeBadge.tabIndex = -1;
	const toast = doc.createElement("div");
	toast.className = `${config.prefix}-toast`;
	toast.tabIndex = -1;
	box.appendChild(sizeBadge);
	overlay.appendChild(box);
	overlay.appendChild(hint);
	doc.documentElement.appendChild(toast);
	doc.documentElement.appendChild(overlay);
	toast.addEventListener("transitionend", () => {
		if (!toast.classList.contains("is-visible")) toast.textContent = "";
	});
	const elements = {
		overlay,
		box,
		hint,
		sizeBadge,
		toast
	};
	overlayInstances.set(key, elements);
	return elements;
};
var getOverlayElements = (config) => {
	const fullConfig = {
		...DEFAULT_CONFIG,
		...config
	};
	if (typeof document === "undefined") return {
		overlay: null,
		box: null,
		hint: null,
		sizeBadge: null,
		toast: null
	};
	return createElements(fullConfig);
};
var getOverlay = (config) => getOverlayElements(config).overlay;
var getBox = (config) => getOverlayElements(config).box;
var getHint = (config) => getOverlayElements(config).hint;
var getSizeBadge = (config) => getOverlayElements(config).sizeBadge;
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
//#endregion
//#region src/frontend/shells/environment/home/ts/Interact.ts
/**
* Grid/tile interaction helpers for the home/orient workspace.
*
* This module centralizes draggable tile behavior, CSS custom-property based
* animation state, and cell reflection logic so the home view can keep its
* layout deterministic across HMR, resize, and drag/drop interactions.
*/
var registeredCSSProperties = /* @__PURE__ */ new Set();
[
	{
		name: "--drag-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--drag-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-drag-x",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-drag-y",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--shift-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--shift-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-transition-r",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-transition-c",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-p-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	}
].forEach((prop) => {
	if (typeof CSS !== "undefined" && !registeredCSSProperties.has(prop.name)) try {
		CSS.registerProperty?.(prop);
		registeredCSSProperties.add(prop.name);
	} catch {}
});
/** Apply redirected grid coordinates back onto the element's style-driven layout state. */
var reflectCell = async (newItem, pArgs, _withAnimate = false) => {
	const layout = [(pArgs?.layout)?.columns || pArgs?.layout?.[0] || 4, (pArgs?.layout)?.rows || pArgs?.layout?.[1] || 8];
	const { item, list, items } = pArgs;
	await new Promise((r) => queueMicrotask(() => r(true)));
	return affected?.(item, (_state, property) => {
		const gridSystem = newItem?.parentElement;
		layout[0] = parseInt(gridSystem?.getAttribute?.("data-grid-columns") || "4") || layout[0];
		layout[1] = parseInt(gridSystem?.getAttribute?.("data-grid-rows") || "8") || layout[1];
		const args = {
			item,
			list,
			items,
			layout,
			size: [gridSystem?.clientWidth, gridSystem?.clientHeight]
		};
		if (item && !item?.cell) item.cell = makeObjectAssignable(observe([0, 0]));
		if (property === "cell") {
			const nc = redirectCell(item?.cell || [0, 0], args);
			if (nc[0] !== item?.cell?.[0] && item?.cell) item.cell[0] = nc?.[0];
			if (nc[1] !== item?.cell?.[1] && item?.cell) item.cell[1] = nc?.[1];
			setStyleProperty(newItem, "--p-cell-x", nc?.[0]);
			setStyleProperty(newItem, "--p-cell-y", nc?.[1]);
			setStyleProperty(newItem, "--cell-x", nc?.[0]);
			setStyleProperty(newItem, "--cell-y", nc?.[1]);
		}
	});
};
var makeDragEvents = async (newItem, { layout, dragging, currentCell, syncDragStyles }, { item, items, list }) => {
	let settleTimer = null;
	const setState = (state, coord) => {
		newItem.dataset.interactionState = state;
		newItem.dataset.gridCoordinateState = coord;
	};
	const clearSettleTimer = () => {
		if (settleTimer) {
			clearTimeout(settleTimer);
			settleTimer = null;
		}
	};
	setState("onHover", "source");
	const refreshLayout = () => {
		const grid = newItem?.parentElement;
		if (!grid) return layout;
		layout[0] = parseInt(grid.getAttribute?.("data-grid-columns") || "4") || layout[0];
		layout[1] = parseInt(grid.getAttribute?.("data-grid-rows") || "8") || layout[1];
		return layout;
	};
	const computeDropCell = () => {
		const grid = newItem?.parentElement;
		if (!grid) return null;
		const snap = [...refreshLayout()];
		const args = {
			layout: {
				columns: snap[0],
				rows: snap[1]
			},
			item,
			list,
			items
		};
		const gridRect = grid.getBoundingClientRect();
		const itemRect = newItem.getBoundingClientRect();
		const cx = (itemRect.left + itemRect.right) / 2;
		const cy = (itemRect.top + itemRect.bottom) / 2;
		if (cx < gridRect.left || cx > gridRect.right || cy < gridRect.top || cy > gridRect.bottom) return null;
		return resolveGridCellFromClientPoint(grid, [cx, cy], args, "floor");
	};
	const setCellAxis = (cell, axis) => {
		if (currentCell?.[axis]?.value !== cell[axis]) try {
			currentCell[axis].value = cell[axis];
		} catch {}
	};
	const commitCell = (cell) => {
		const clamped = clampCell$1(redirectCell(cell, {
			item,
			items,
			list,
			layout,
			size: [newItem?.clientWidth || 0, newItem?.clientHeight || 0]
		}), layout);
		const final = [clamped.x.value, clamped.y.value];
		setCellAxis(final, 0);
		setCellAxis(final, 1);
	};
	const resetDragRefs = () => {
		try {
			dragging[0].value = 0;
		} catch {}
		try {
			dragging[1].value = 0;
		} catch {}
	};
	const onGrab = (dragRefs) => {
		clearSettleTimer();
		const stableCell = [currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0, currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0];
		setStyleProperty(newItem, "--p-cell-x", stableCell[0]);
		setStyleProperty(newItem, "--p-cell-y", stableCell[1]);
		setStyleProperty(newItem, "--cell-x", stableCell[0]);
		setStyleProperty(newItem, "--cell-y", stableCell[1]);
		newItem.setAttribute("data-dragging", "");
		if (dragRefs && Array.isArray(dragRefs)) try {
			dragRefs[0].value = 0;
			dragRefs[1].value = 0;
		} catch {}
		setStyleProperty(newItem, "--drag-settle-ms", "0ms");
		syncDragStyles?.(true);
		setState("onGrab", "source");
		return [0, 0];
	};
	const onDrop = (_dragRefs) => {
		clearSettleTimer();
		const cell = computeDropCell();
		requestAnimationFrame(async () => {
			setStyleProperty(newItem, "--p-cell-x", currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
			setStyleProperty(newItem, "--p-cell-y", currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
			if (cell) {
				setStyleProperty(newItem, "--cell-x", cell[0]);
				setStyleProperty(newItem, "--cell-y", cell[1]);
			}
			const grid = newItem.parentElement;
			if (grid) {
				const cs = getComputedStyle(grid);
				const pl = parseFloat(cs.paddingLeft) || 0;
				const pr = parseFloat(cs.paddingRight) || 0;
				const pt = parseFloat(cs.paddingTop) || 0;
				const pb = parseFloat(cs.paddingBottom) || 0;
				const contentW = Math.max(1, grid.clientWidth - pl - pr);
				const contentH = Math.max(1, grid.clientHeight - pt - pb);
				const csLayoutC = parseFloat(cs.getPropertyValue("--cs-layout-c")) || 4;
				const csLayoutR = parseFloat(cs.getPropertyValue("--cs-layout-r")) || 8;
				setStyleProperty(newItem, "--cs-sw-unit-x", `${contentW / csLayoutC}px`);
				setStyleProperty(newItem, "--cs-sw-unit-y", `${contentH / csLayoutR}px`);
			}
			syncDragStyles?.(true);
			setStyleProperty(newItem, "--drag-settle-ms", "240ms");
			setStyleProperty(newItem, "will-change", "transform");
			setState("onRelax", "destination");
			newItem.style.removeProperty("--cs-transition-c");
			newItem.style.removeProperty("--cs-transition-r");
			const dragX = parseFloat(newItem.style.getPropertyValue("--drag-x") || "0") || 0;
			const dragY = parseFloat(newItem.style.getPropertyValue("--drag-y") || "0") || 0;
			const shouldAnimate = !matchMedia?.("(prefers-reduced-motion: reduce)")?.matches && (Math.abs(dragX) > .5 || Math.abs(dragY) > .5 || cell != null);
			let animation = null;
			if (shouldAnimate) {
				const computed = getComputedStyle(newItem);
				const csPGridC = parseFloat(computed.getPropertyValue("--cs-p-grid-c")) || 0;
				const csPGridR = parseFloat(computed.getPropertyValue("--cs-p-grid-r")) || 0;
				const csGridC = parseFloat(computed.getPropertyValue("--cs-grid-c")) || 0;
				const csGridR = parseFloat(computed.getPropertyValue("--cs-grid-r")) || 0;
				animation = newItem.animate([{
					"--rv-grid-c": csPGridC,
					"--rv-grid-r": csPGridR,
					"--drag-x": dragX,
					"--drag-y": dragY,
					"--cs-drag-x": `${dragX}px`,
					"--cs-drag-y": `${dragY}px`
				}, {
					"--rv-grid-c": csGridC,
					"--rv-grid-r": csGridR,
					"--drag-x": 0,
					"--drag-y": 0,
					"--cs-drag-x": "0px",
					"--cs-drag-y": "0px"
				}], {
					fill: "forwards",
					duration: 240,
					easing: "cubic-bezier(0.22, 0.8, 0.3, 1)"
				});
				const onInterrupt = () => animation?.finish?.();
				newItem.addEventListener("m-dragstart", onInterrupt, { once: true });
				await animation.finished.catch(console.warn.bind(console));
				newItem.removeEventListener("m-dragstart", onInterrupt);
			}
			requestAnimationFrame(() => {
				setStyleProperty(newItem, "will-change", "auto");
				resetDragRefs();
				syncDragStyles?.(true);
				if (cell) {
					commitCell(cell);
					setStyleProperty(newItem, "--p-cell-x", cell[0]);
					setStyleProperty(newItem, "--p-cell-y", cell[1]);
					setStyleProperty(newItem, "--cell-x", cell[0]);
					setStyleProperty(newItem, "--cell-y", cell[1]);
				}
				animation?.cancel?.();
				newItem.removeAttribute("data-dragging");
				setState("onPlace", "destination");
				settleTimer = setTimeout(() => {
					setState("onHover", "source");
					settleTimer = null;
				}, 280);
				newItem.dispatchEvent(new CustomEvent("m-dragsettled", {
					bubbles: true,
					detail: {
						cell: cell ? [cell[0], cell[1]] : null,
						interactionState: "onPlace",
						coordinateState: "destination"
					}
				}));
			});
		});
		return [0, 0];
	};
	const customTrigger = (doGrab) => new LongPressHandler(newItem, {
		handler: "*",
		anyPointer: true,
		mouseImmediate: true,
		minHoldTime: 60 * 3600,
		maxHoldTime: 100
	}, makeShiftTrigger((ev) => {
		onGrab(dragging);
		doGrab?.(ev, newItem);
	}));
	return bindDraggable(customTrigger, onDrop, dragging);
};
typeof document !== "undefined" && document?.documentElement;
var bindInteraction = (newItem, pArgs) => {
	reflectCell(newItem, pArgs, true);
	const { item, items, list } = pArgs;
	const layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
	const immediateDragStyles = Boolean(pArgs?.immediateDragStyles);
	const dragging = [numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior())];
	const currentCell = [numberRef(item?.cell?.[0] || 0), numberRef(item?.cell?.[1] || 0)];
	setStyleProperty(newItem, "--cell-x", currentCell?.[0]?.value || 0);
	setStyleProperty(newItem, "--cell-y", currentCell?.[1]?.value || 0);
	const applyDragStyles = () => {
		const dx = dragging?.[0]?.value || 0;
		const dy = dragging?.[1]?.value || 0;
		setStyleProperty(newItem, "--drag-x", dx);
		setStyleProperty(newItem, "--cs-drag-x", `${dx}px`);
		setStyleProperty(newItem, "--drag-y", dy);
		setStyleProperty(newItem, "--cs-drag-y", `${dy}px`);
	};
	let pendingRaf = null;
	const syncDragStyles = (flush = false) => {
		if (immediateDragStyles || flush) {
			applyDragStyles();
			if (pendingRaf) {
				cancelAnimationFrame(pendingRaf);
				pendingRaf = null;
			}
		} else if (!pendingRaf) pendingRaf = requestAnimationFrame(() => {
			applyDragStyles();
			pendingRaf = null;
		});
	};
	affected([dragging[0], "value"], (_, prop) => {
		if (prop === "value") syncDragStyles();
	});
	affected([dragging[1], "value"], (_, prop) => {
		if (prop === "value") syncDragStyles();
	});
	const checkMoving = () => {
		if (Math.abs(dragging[0]?.value || 0) > .5 || Math.abs(dragging[1]?.value || 0) > .5) {
			newItem.dataset.interactionState = "onMoving";
			newItem.dataset.gridCoordinateState = "intermediate";
		}
	};
	affected([dragging[0], "value"], (_, prop) => {
		if (prop === "value") checkMoving();
	});
	affected([dragging[1], "value"], (_, prop) => {
		if (prop === "value") checkMoving();
	});
	syncDragStyles(true);
	affected([currentCell[0], "value"], (val, prop) => {
		if (prop === "value" && item.cell != null && val != null) setStyleProperty(newItem, "--cell-x", (item.cell[0] = val) || 0);
	});
	affected([currentCell[1], "value"], (val, prop) => {
		if (prop === "value" && item.cell != null && val != null) setStyleProperty(newItem, "--cell-y", (item.cell[1] = val) || 0);
	});
	if (!newItem.dataset.dragResetBound) {
		newItem.dataset.dragResetBound = "1";
		newItem.addEventListener("m-dragstart", () => {
			setStyleProperty(newItem, "--drag-settle-ms", "0ms");
			newItem.style.removeProperty("--cs-transition-c");
			newItem.style.removeProperty("--cs-transition-r");
		});
	}
	makeDragEvents(newItem, {
		layout,
		currentCell,
		dragging,
		syncDragStyles
	}, {
		item,
		items,
		list
	});
	return currentCell;
};
//#endregion
//#region src/frontend/shells/environment/home/ts/ShortcutEditor.ts
var isDefaultViewAction = (action) => action === "open-view";
var isDefaultHrefAction = (action) => action === "open-link";
var setSelectOptions = (select, options, selectedValue, placeholder) => {
	if (!select) return;
	select.innerHTML = "";
	if (placeholder) {
		const placeholderOption = document.createElement("option");
		placeholderOption.value = placeholder.value;
		placeholderOption.textContent = placeholder.label;
		placeholderOption.selected = selectedValue === placeholder.value;
		select.append(placeholderOption);
	}
	for (const option of options) {
		const node = document.createElement("option");
		node.value = option.value;
		node.textContent = option.label;
		node.selected = option.value === selectedValue;
		select.append(node);
	}
	if (selectedValue && !options.some((option) => option.value === selectedValue)) {
		const fallbackOption = document.createElement("option");
		fallbackOption.value = selectedValue;
		fallbackOption.textContent = selectedValue;
		fallbackOption.selected = true;
		select.append(fallbackOption);
	}
};
var openShortcutEditor = (options) => {
	const { mode, initial, actionOptions, viewOptions, onSave, onDelete, isViewAction = isDefaultViewAction, isHrefAction = isDefaultHrefAction, registerForBackNavigation = false } = options;
	const modal = document.createElement("div");
	modal.className = "rs-modal-backdrop speed-dial-editor";
	modal.innerHTML = `
        <form class="modal-form speed-dial-editor__form">
            <header class="modal-header">
                <h2 class="modal-title">${mode === "create" ? "Create shortcut" : "Edit shortcut"}</h2>
                <p class="modal-description">Configure quick access tiles for frequently used views or links.</p>
            </header>
            <div class="modal-fields">
                <label class="modal-field">
                    <span>Label</span>
                    <input name="label" type="text" minlength="1" required />
                </label>
                <label class="modal-field">
                    <span>Icon</span>
                    <input name="icon" type="text" placeholder="phosphor icon name" />
                </label>
                <label class="modal-field">
                    <span>Shape</span>
                    <select name="shape">
                        <option value="squircle">Squircle</option>
                        <option value="circle">Circle</option>
                        <option value="square">Rounded square</option>
                    </select>
                </label>
                <label class="modal-field">
                    <span>Action</span>
                    <select name="action"></select>
                </label>
                <label class="modal-field" data-field="view">
                    <span>View</span>
                    <select name="view"></select>
                </label>
                <label class="modal-field" data-field="href">
                    <span>Link</span>
                    <input name="href" type="text" inputmode="url" autocomplete="off" placeholder="https://…, mailto:…" />
                </label>
                <label class="modal-field">
                    <span>Description</span>
                    <textarea name="description" rows="2" placeholder="Optional description"></textarea>
                </label>
            </div>
            <footer class="modal-actions">
                <div class="modal-actions-left">
                    ${mode === "edit" ? "<button type=\"button\" data-action=\"delete\" class=\"btn danger\">Delete</button>" : ""}
                </div>
                <div class="modal-actions-right">
                    <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                    <button type="submit" class="btn save">Save</button>
                </div>
            </footer>
        </form>
    `;
	const form = modal.querySelector("form");
	const labelInput = form?.querySelector("input[name=\"label\"]");
	const iconInput = form?.querySelector("input[name=\"icon\"]");
	const shapeSelect = form?.querySelector("select[name=\"shape\"]");
	const actionSelect = form?.querySelector("select[name=\"action\"]");
	const viewSelect = form?.querySelector("select[name=\"view\"]");
	const hrefInput = form?.querySelector("input[name=\"href\"]");
	const descriptionInput = form?.querySelector("textarea[name=\"description\"]");
	const viewField = form?.querySelector("[data-field=\"view\"]");
	const hrefField = form?.querySelector("[data-field=\"href\"]");
	if (labelInput) labelInput.value = String(initial.label || "New shortcut");
	if (iconInput) iconInput.value = String(initial.icon || "sparkle");
	const shapeVal = String(initial.shape || "squircle").toLowerCase();
	if (shapeSelect) shapeSelect.value = [
		"circle",
		"square",
		"squircle"
	].includes(shapeVal) ? shapeVal : "squircle";
	if (hrefInput) hrefInput.value = String(initial.href || "");
	if (descriptionInput) descriptionInput.value = String(initial.description || "");
	setSelectOptions(actionSelect, actionOptions, String(initial.action || ""));
	setSelectOptions(viewSelect, viewOptions, String(initial.view || ""), {
		value: "",
		label: "Choose view"
	});
	const syncFieldVisibility = () => {
		const action = String(actionSelect?.value || "");
		if (viewField) viewField.hidden = !isViewAction(action);
		if (hrefField) hrefField.hidden = !isHrefAction(action);
	};
	let unregisterBackNav = null;
	const escHandler = (event) => {
		if (event.key === "Escape") closeModal();
	};
	const closeModal = () => {
		unregisterBackNav?.();
		unregisterBackNav = null;
		document.removeEventListener("keydown", escHandler);
		modal.remove();
	};
	actionSelect?.addEventListener("change", syncFieldVisibility);
	syncFieldVisibility();
	document.addEventListener("keydown", escHandler);
	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});
	form?.addEventListener("click", (event) => {
		const action = event.target?.dataset?.action || "";
		if (action === "cancel") {
			event.preventDefault();
			closeModal();
			return;
		}
		if (action === "delete" && mode === "edit") {
			event.preventDefault();
			onDelete?.();
			closeModal();
		}
	});
	form?.addEventListener("submit", (event) => {
		event.preventDefault();
		onSave({
			label: String(labelInput?.value || "").trim() || "Item",
			icon: String(iconInput?.value || "").trim() || "sparkle",
			action: String(actionSelect?.value || "open-view"),
			view: String(viewSelect?.value || "").trim(),
			href: String(hrefInput?.value || "").trim(),
			description: String(descriptionInput?.value || "").trim(),
			shape: String(shapeSelect?.value || "squircle").toLowerCase()
		});
		closeModal();
	});
	if (registerForBackNavigation) unregisterBackNav = registerModal(modal, void 0, closeModal);
	document.body.append(modal);
};
//#endregion
//#region src/frontend/shells/environment/home/modules/DesktopStateStorage.ts
/**
* Versioned JSON persistence for the orient-layer speed dial / desktop grid.
* - Main key: canonical layout + items
* - Draft key: debounced snapshot while dragging (crash recovery if main never flushed)
*/
var DESKTOP_MAIN_KEY = "cw-oriented-desktop-layout-v1";
var DESKTOP_DRAFT_KEY = `${DESKTOP_MAIN_KEY}.draft`;
var safeGet = (key) => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};
var safeSet = (key, value) => {
	try {
		localStorage.setItem(key, value);
	} catch {}
};
var safeRemove = (key) => {
	try {
		localStorage.removeItem(key);
	} catch {}
};
/** Encode grid state as compact JSON (ISO timestamp for debugging / sync). */
function encodeDesktopState(columns, rows, items) {
	const payload = {
		v: 2,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		columns,
		rows,
		items
	};
	return JSON.stringify(payload);
}
/**
* Decode persisted JSON. Accepts v2 envelope or legacy flat `{ columns, rows, items }`.
*/
function decodeDesktopState(raw) {
	try {
		const p = JSON.parse(raw);
		if (!p || typeof p !== "object") return null;
		const items = p.items;
		if (!Array.isArray(items)) return null;
		const columns = Math.max(0, Number(p.columns));
		const rows = Math.max(0, Number(p.rows));
		if (p.v === 2 && Number.isFinite(columns) && Number.isFinite(rows)) return {
			v: 2,
			updatedAt: String(p.updatedAt || (/* @__PURE__ */ new Date()).toISOString()),
			columns: columns || 6,
			rows: rows || 8,
			items
		};
		return {
			v: 2,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			columns: Number.isFinite(columns) && columns > 0 ? columns : 6,
			rows: Number.isFinite(rows) && rows > 0 ? rows : 8,
			items
		};
	} catch {
		return null;
	}
}
function loadDesktopRaw() {
	const main = safeGet(DESKTOP_MAIN_KEY);
	const draft = safeGet(DESKTOP_DRAFT_KEY);
	if (!main) return draft;
	if (!draft) return main;
	const mainDec = decodeDesktopState(main);
	const draftDec = decodeDesktopState(draft);
	if (!mainDec) return draft;
	if (!draftDec) return main;
	const mainT = Date.parse(mainDec.updatedAt || "");
	const draftT = Date.parse(draftDec.updatedAt || "");
	if (Number.isFinite(draftT) && Number.isFinite(mainT) && draftT > mainT) return draft;
	return main;
}
/** Write main snapshot and drop draft (commit). */
function persistDesktopMain(columns, rows, items) {
	safeSet(DESKTOP_MAIN_KEY, encodeDesktopState(columns, rows, items));
	safeRemove(DESKTOP_DRAFT_KEY);
}
/** Intermediate snapshot only (e.g. while dragging). */
function persistDesktopDraft(columns, rows, items) {
	safeSet(DESKTOP_DRAFT_KEY, encodeDesktopState(columns, rows, items));
}
//#endregion
//#region src/frontend/shells/environment/home/modules/DesktopItemIconCodec.ts
/**
* Desktop / launcher tiles: avoid persisting or hydrating `data:` / `blob:` icon URLs
* (DevTools, clipboard, localStorage stay small). Favicons use a short `g:hostname` ref.
*/
var GOOGLE_FAVICON_RE = /^https:\/\/www\.google\.com\/s2\/favicons\?[^#]*domain=([^&]+)/i;
/** Strip scheme prefix for JSON (`S` = https, `H` = http, `R` = other e.g. mailto). */
var packHrefInline = (href) => {
	const h = String(href || "").trim();
	if (!h) return "";
	if (h.startsWith("https://")) return `S${h.slice(8)}`;
	if (h.startsWith("http://")) return `H${h.slice(7)}`;
	return `R${h}`;
};
var unpackHrefInline = (packed) => {
	const p = String(packed || "").trim();
	if (!p) return "";
	if (p.startsWith("S")) return `https://${p.slice(1)}`;
	if (p.startsWith("H")) return `http://${p.slice(1)}`;
	if (p.startsWith("R")) return p.slice(1);
	return p;
};
var hostnameToFaviconRef = (hostname) => {
	const h = String(hostname || "").trim().toLowerCase().replace(/\.$/, "");
	return h ? `g:${h}` : "";
};
var faviconUrlForHostname = (hostname) => {
	const h = String(hostname || "").trim();
	if (!h) return "";
	try {
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h.replace(/^\./, ""))}&sz=128`;
	} catch {
		return "";
	}
};
/**
* Normalize payload from JSON/import: never keep base64/blob; collapse Google favicon URLs to `g:`.
*/
var normalizeIconSrcFromPayload = (iconSrcRaw, hrefRaw, action) => {
	const raw = String(iconSrcRaw || "").trim();
	if (/^(data:|blob:)/i.test(raw)) return "";
	if (raw.startsWith("g:")) {
		const host = raw.slice(2).trim().toLowerCase();
		return host ? `g:${host}` : "";
	}
	const m = raw.match(GOOGLE_FAVICON_RE);
	if (m) try {
		const host = decodeURIComponent(m[1]).toLowerCase();
		return host ? `g:${host}` : "";
	} catch {
		return "";
	}
	if (/^https?:\/\//i.test(raw) && raw.length < 2048) return raw;
	if (!raw && String(action || "") === "open-link" && hrefRaw) try {
		const u = new URL(String(hrefRaw), window.location.href);
		if (/^https?:$/i.test(u.protocol)) return hostnameToFaviconRef(u.hostname);
	} catch {}
	return "";
};
/** Value safe to assign to `<img src>` (never data:/blob:). */
var expandIconSrcForDom = (stored) => {
	const s = String(stored || "").trim();
	if (!s) return "";
	if (/^(data:|blob:)/i.test(s)) return "";
	if (s.startsWith("g:")) return faviconUrlForHostname(s.slice(2));
	return s;
};
/** Shrink icon field before JSON.stringify / localStorage. */
var compactIconSrcForStorage = (iconSrc, action, href) => {
	const raw = String(iconSrc || "").trim();
	if (/^(data:|blob:)/i.test(raw)) return "";
	if (raw.startsWith("g:")) return raw;
	const m = raw.match(GOOGLE_FAVICON_RE);
	if (m) try {
		const host = decodeURIComponent(m[1]).toLowerCase();
		return host ? `g:${host}` : "";
	} catch {
		return "";
	}
	if (String(action || "") === "open-link" && href) try {
		const u = new URL(String(href), window.location.href);
		if (/^https?:$/i.test(u.protocol)) return hostnameToFaviconRef(u.hostname);
	} catch {}
	if (/^https?:\/\//i.test(raw) && raw.length < 2048) return raw;
	return "";
};
/** Compact single-item clipboard / debug (no pretty-print, short keys, packed href). */
var ITEM_COMPACT_KIND = "cw-sdi";
var serializeDesktopItemCompact = (item) => {
	const u = item.href ? packHrefInline(item.href) : "";
	const g = compactIconSrcForStorage(String(item.iconSrc || ""), item.action, item.href);
	return JSON.stringify({
		k: ITEM_COMPACT_KIND,
		v: 1,
		i: {
			id: item.id,
			l: item.label,
			n: item.icon,
			c: item.cell,
			a: item.action || "open-view",
			w: item.viewId,
			...u ? { u } : {},
			...g ? { g } : {},
			...item.shape ? { s: item.shape } : {}
		}
	});
};
var parseDesktopItemCompact = (raw) => {
	if (!raw || typeof raw !== "object") return null;
	const o = raw;
	if (o.k !== "cw-sdi" || !o.i || typeof o.i !== "object") return null;
	const i = o.i;
	const cell = i.c;
	const cx = Array.isArray(cell) ? Number(cell[0]) : NaN;
	const cy = Array.isArray(cell) ? Number(cell[1]) : NaN;
	const hrefPacked = typeof i.u === "string" ? i.u : "";
	const href = hrefPacked ? unpackHrefInline(hrefPacked) : "";
	const action = String(i.a || (href ? "open-link" : "open-view"));
	return {
		id: String(i.id || ""),
		label: String(i.l ?? "Item"),
		icon: String(i.n ?? "sparkle"),
		iconSrc: typeof i.g === "string" ? String(i.g) : "",
		viewId: String(i.w ?? (action === "open-link" ? "home" : "viewer")),
		cell: [Number.isFinite(cx) ? cx : 0, Number.isFinite(cy) ? cy : 0],
		action,
		href,
		shape: i.s
	};
};
//#endregion
//#region src/frontend/shells/environment/home/ts/SpeedDial.scss?inline
var SpeedDial_default = "@layer views{.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.speed-dial-root{background-color:initial;block-size:100%;border-radius:0;box-sizing:border-box;display:grid;grid-column:1/-1;grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:auto;position:absolute}.speed-dial-grid,.speed-dial-root>*{grid-column:1/-1;grid-row:1/-1}.speed-dial-grid{--grid-cols:4;--grid-rows:8;padding:var(--padding-lg)}.speed-dial-grid[data-grid-columns=\"4\"]{--grid-cols:4}.speed-dial-grid[data-grid-columns=\"5\"]{--grid-cols:5}.speed-dial-grid[data-grid-columns=\"6\"]{--grid-cols:6}.speed-dial-grid[data-grid-columns=\"7\"]{--grid-cols:7}.speed-dial-grid[data-grid-columns=\"8\"]{--grid-cols:8}.speed-dial-grid[data-grid-rows=\"6\"]{--grid-rows:6}.speed-dial-grid[data-grid-rows=\"7\"]{--grid-rows:7}.speed-dial-grid[data-grid-rows=\"8\"]{--grid-rows:8}.speed-dial-grid[data-grid-rows=\"9\"]{--grid-rows:9}.speed-dial-grid[data-grid-rows=\"10\"]{--grid-rows:10}.speed-dial-grid[data-grid-rows=\"11\"]{--grid-rows:11}.speed-dial-grid[data-grid-rows=\"12\"]{--grid-rows:12}.speed-dial-grid{--layout-c:var(--grid-cols,4);--layout-r:var(--grid-rows,8);border-radius:0}.speed-dial-grid[data-grid-layer=icons]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none;z-index:1}.speed-dial-grid[data-grid-layer=icons]:has([data-dragging]){z-index:3}.speed-dial-grid[data-grid-layer=labels]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none!important;z-index:2}.speed-dial-grid .ui-ws-item{--drag-x:0;--drag-y:0;--cs-drag-x:calc(var(--drag-x, 0) * 1px);--cs-drag-y:calc(var(--drag-y, 0) * 1px);--tile-size:clamp(3.2rem,7.5vmin,4.6rem);aspect-ratio:1/1;background-color:initial;display:grid;grid-column:clamp(1,1 + round(nearest,var(--cs-grid-c,0),1),var(--cs-layout-c,4));grid-row:clamp(1,1 + round(nearest,var(--cs-grid-r,0),1),var(--cs-layout-r,8));grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);min-block-size:var(--tile-size);min-inline-size:var(--tile-size);place-content:center;place-items:center;place-self:center;pointer-events:auto;position:relative;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;contain:none;filter:none;overflow:visible;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0);transform-origin:50% 50%;transition:transform var(--drag-settle-ms,.2s) cubic-bezier(.22,.8,.3,1),scale .18s var(--ease-out,ease-out),filter .18s var(--ease-out,ease-out);z-index:1}.speed-dial-grid .ui-ws-item:hover{scale:1.06}.speed-dial-grid .ui-ws-item:hover .ui-ws-item-icon{background:color-mix(in oklab,var(--color-surface-container-high,#1f2937) 60%,transparent);box-shadow:0 10px 36px -10px color-mix(in oklab,#000 40%,transparent)}.speed-dial-grid .ui-ws-item:active{scale:.94}.speed-dial-grid .ui-ws-item .ui-ws-item-icon{aspect-ratio:1/1;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);background:color-mix(in oklab,var(--color-surface-container,#111827) 56%,transparent);block-size:var(--tile-size);border:none;border-radius:22%;box-shadow:0 6px 24px -8px color-mix(in oklab,#000 38%,transparent);contain:layout style;cursor:pointer;display:grid;filter:none;grid-column:1/-1;grid-row:1/-1;inline-size:var(--tile-size);line-height:0;max-block-size:100%;max-inline-size:100%;min-block-size:fit-content;min-inline-size:fit-content;overflow:hidden;padding:.8rem;place-content:center;place-items:center;pointer-events:auto;position:relative;text-align:center;transition:background-color .2s ease,box-shadow .2s ease}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=circle]{border-radius:50%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=square]{border-radius:max(.55rem,14%)}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=squircle]{border-radius:22%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon .ui-ws-item-icon-image{block-size:calc(100% - .9rem);filter:drop-shadow(0 1px 3px rgba(0,0,0,.2));inline-size:calc(100% - .9rem);inset:.45rem;object-fit:contain;object-position:center;pointer-events:none;position:absolute;z-index:3}.speed-dial-grid .ui-ws-item .ui-ws-item-icon ui-icon{--icon-size:clamp(1.6rem,60%,2.4rem);aspect-ratio:1/1;block-size:var(--icon-size,1.8rem);color:var(--on-surface-variant,var(--on-surface-color,currentColor));filter:drop-shadow(0 1px 2px rgba(0,0,0,.1333333333));inline-size:var(--icon-size,1.8rem);line-height:0;max-block-size:var(--icon-size,1.8rem);max-inline-size:var(--icon-size,1.8rem);min-block-size:fit-content;min-inline-size:fit-content;object-fit:contain;object-position:center;pointer-events:none;z-index:2}.speed-dial-grid .ui-ws-item .ui-ws-item-label{align-items:flex-start;background:transparent;color:var(--on-surface-color,currentColor);display:flex;filter:none;inset-block-start:100%;inset-inline:0;justify-content:center;overflow:visible;padding-block-start:.35rem;pointer-events:none;position:absolute;text-align:center;white-space:nowrap}.speed-dial-grid .ui-ws-item .ui-ws-item-label span{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;border:none;border-radius:6px;box-shadow:none;color:color-mix(in oklab,var(--on-surface-color,#e5e7eb) 90%,transparent);display:inline-flex;font-size:.72rem;font-weight:500;inline-size:max-content;letter-spacing:.01em;line-height:1.25;max-inline-size:min(100%,9rem);overflow:hidden;padding-block:.15rem;padding-inline:.4rem;place-content:center;place-items:center;pointer-events:none;text-align:center;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.4);white-space:nowrap}.speed-dial-grid .ui-ws-item:active{will-change:transform}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving]{cursor:grabbing;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;transition:none!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab] .ui-ws-item-label,.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving] .ui-ws-item-label{opacity:1;pointer-events:none}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace],.speed-dial-grid .ui-ws-item[data-interaction-state=onRelax]{transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace]{transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1),filter var(--transition-fast) var(--ease-out)!important}.speed-dial-grid .ui-ws-item[data-layer=labels]{filter:none;transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1);z-index:0}.speed-dial-grid .ui-ws-item[data-layer=labels],.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label{background:transparent!important;pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label span{pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onLabelDocked]{cursor:default;transform:none!important;transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onMoving]{transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=icons]{filter:none;touch-action:none;z-index:4}.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onMoving],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onRelax]{z-index:5}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.35rem,2.8cqh,var(--padding-lg));padding-inline:clamp(.35rem,3.2cqw,var(--padding-lg))}}@container (max-height: 29rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.3rem,2.2cqh,var(--padding-md))}}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .ui-ws-item{--tile-size:clamp(2.6rem,11cqmin,4.2rem)}.speed-dial-root.app-oriented-desktop .ui-ws-item .ui-ws-item-icon{padding:.65rem}}.speed-dial-editor{backdrop-filter:blur(8px) saturate(1.05);-webkit-backdrop-filter:blur(8px) saturate(1.05);background:color-mix(in oklab,#020617 58%,transparent);display:grid;inset:0;padding:1rem;place-items:center;pointer-events:auto;position:fixed;z-index:6}.speed-dial-editor__form{background:color-mix(in oklab,var(--color-surface,#0b1220) 88%,#000);border:none;border-radius:18px;box-shadow:0 24px 64px -28px color-mix(in oklab,#000 65%,transparent),0 0 0 1px color-mix(in oklab,var(--color-outline-variant,#334155) 35%,transparent) inset;color:var(--color-on-surface,#e2e8f0);display:grid;grid-template-rows:auto minmax(0,1fr) auto;inline-size:min(100%,980px);margin-inline:auto;max-block-size:min(86vh,760px);overflow:hidden}.speed-dial-editor__form .modal-header{border-block-end:none;box-shadow:0 1px 0 color-mix(in oklab,var(--color-outline-variant,#334155) 28%,transparent);display:grid;gap:.4rem;padding:1rem 1rem .75rem}.speed-dial-editor__form .modal-title{font-size:1.2rem;font-weight:650;line-height:1.25;margin:0}.speed-dial-editor__form .modal-description{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 72%,transparent);font-size:.86rem;line-height:1.35;margin:0}.speed-dial-editor__form .modal-fields{align-content:start;display:grid;gap:.75rem;min-block-size:0;overflow:auto;padding:.9rem 1rem 1rem}.speed-dial-editor__form .modal-field{display:grid;gap:.35rem}.speed-dial-editor__form .modal-field>span{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 76%,transparent);font-size:.84rem}.speed-dial-editor__form :is(input,select,textarea){appearance:none;background:color-mix(in oklab,var(--color-surface-container-low,#101827) 88%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 75%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);inline-size:100%;min-inline-size:0;outline:none;padding:.55rem .7rem}.speed-dial-editor__form textarea{min-block-size:4.4rem;resize:vertical}.speed-dial-editor__form :is(input,select,textarea):focus{border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 64%,#fff 8%);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3b82f6) 26%,transparent)}.speed-dial-editor__form .modal-actions{align-items:center;background:color-mix(in oklab,var(--color-surface-container,#172032) 42%,transparent);border-block-start:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 64%,transparent);display:flex;gap:.5rem;justify-content:space-between;padding:.75rem 1rem}.speed-dial-editor__form :is(.modal-actions-left,.modal-actions-right){align-items:center;display:inline-flex;gap:.5rem}.speed-dial-editor__form .btn{background:color-mix(in oklab,var(--color-surface-container,#172032) 62%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 72%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);cursor:pointer;font-size:.86rem;line-height:1.2;padding:.46rem .86rem}.speed-dial-editor__form .btn.secondary{background:color-mix(in oklab,var(--color-surface-container,#172032) 48%,transparent)}.speed-dial-editor__form .btn.save{background:color-mix(in oklab,var(--color-primary,#3b82f6) 40%,#0b1220);border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 60%,transparent);color:#fff}.speed-dial-editor__form .btn.danger{background:color-mix(in oklab,var(--color-error,#ef4444) 28%,#1f0a0a);border-color:color-mix(in oklab,var(--color-error,#ef4444) 64%,transparent);color:#fff}.speed-dial-editor__form .btn:hover{filter:brightness(1.08)}.speed-dial-editor__form [hidden]{display:none!important}@media (max-width:820px){.speed-dial-editor{place-items:center}.speed-dial-editor__form{inline-size:100%;max-block-size:94vh}}}@layer view.home{:root:has([data-view=home]),html:has([data-view=home]){--view-home-bg:linear-gradient(135deg,light-dark(#f8f9fa,#1b1f24),light-dark(#e9ecef,#0f1216));--view-fg:light-dark(#1a1a1a,#e9ecef);--view-border:light-dark(rgba(0,0,0,0.08),rgba(255,255,255,0.12));--view-card-bg:light-dark(#ffffff,#1a1f26);--view-primary:light-dark(#007acc,#66b7ff);--view-layout:\"flex\";--view-padding:var(--space-8);--view-content-max-width:1200px;--view-hero-padding:var(--space-16);--view-card-gap:var(--space-6)}.view-home{align-items:center;background:var(--view-home-bg);block-size:100%;color:var(--view-fg);display:flex;justify-content:center;overflow-y:auto;padding:2rem}.view-home__content{max-inline-size:800px;text-align:center}.view-home__header{margin-block-end:3rem}.view-home__title{background:linear-gradient(135deg,var(--view-primary) 0,light-dark(#0059a6,#3a8ad6) 100%);-webkit-background-clip:text;font-size:3rem;font-weight:800;margin:0;-webkit-text-fill-color:transparent;background-clip:text}.view-home__subtitle{color:var(--view-fg);font-size:1.125rem;margin:.5rem 0 0;opacity:.7}.view-home__actions{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.view-home__action{align-items:center;background-color:var(--view-card-bg);border:1px solid var(--view-border);border-radius:16px;color:var(--view-fg);cursor:pointer;display:flex;flex-direction:column;gap:.75rem;padding:1.5rem;text-align:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.view-home__action ui-icon{color:var(--view-primary);opacity:.8}.view-home__action:hover{border-color:var(--view-primary);box-shadow:0 8px 24px light-dark(rgba(0,0,0,.1),rgba(0,0,0,.4));transform:translateY(-4px)}.view-home__action:hover ui-icon{opacity:1}.view-home__action:focus-visible{outline:2px solid var(--view-primary);outline-offset:2px}.view-home__action-title{font-size:1rem;font-weight:600}.view-home__action-desc{font-size:.8125rem;opacity:.6}.view-home--grid{align-items:stretch;background:transparent;block-size:100%;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;justify-items:stretch;overflow:hidden;padding:0;position:relative}.view-home--grid .speed-dial-root{block-size:100%;inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;overflow:hidden;position:absolute}@container (max-width: 768px){.view-home{--view-hero-padding:var(--space-8);--view-card-gap:var(--space-4)}}@container (max-width: 480px){.view-home__actions{grid-template-columns:1fr}}}";
//#endregion
//#region src/frontend/shells/environment/home/ts/OrientDesktop.ts
/** Orient-layer desktop shares SpeedDial styles; HomeView only adopts this sheet while home is visible, so load once here. */
var orientDesktopStyleSheet = null;
var ensureOrientDesktopStyles = () => {
	if (orientDesktopStyleSheet) return;
	orientDesktopStyleSheet = loadAsAdopted(SpeedDial_default);
};
var SUPPRESS_CLICK_MS = 280;
var ITEM_ENVELOPE_KIND = "cw-speed-dial-item";
var REGISTRY_ENVELOPE_KIND = "cw-speed-dial-registry";
var URL_PATTERN = /(https?:\/\/[^\s<>"']+)/i;
var ACTION_OPTIONS = [{
	value: "open-view",
	label: "Open view"
}, {
	value: "open-link",
	label: "Open link"
}];
var normalizeTileShape = (raw) => {
	const s = String(raw || "").toLowerCase();
	if (s === "circle" || s === "square" || s === "squircle") return s;
	return "squircle";
};
/** `data-grid-shape` on launcher grids: dominant tile shape, or `mixed` if icons disagree (per-tile is still `data-shape` on `.ui-ws-item-icon`). */
var gridShapeAttributeFromItems = (items) => {
	if (!items.length) return "squircle";
	if (new Set(items.map((it) => normalizeTileShape(it.shape))).size === 1) return normalizeTileShape(items[0].shape);
	return "mixed";
};
var DEFAULT_STATE = {
	columns: 4,
	rows: 8,
	items: [
		{
			id: "viewer",
			label: "Viewer",
			icon: "article",
			viewId: "viewer",
			cell: [0, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "explorer",
			label: "Explorer",
			icon: "books",
			viewId: "explorer",
			cell: [1, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "settings",
			label: "Settings",
			icon: "gear-six",
			viewId: "settings",
			cell: [2, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "airpad",
			label: "AirPad",
			icon: "paper-plane-tilt",
			viewId: "airpad",
			cell: [3, 0],
			action: "open-view",
			shape: "squircle"
		}
	]
};
var protectedIds = new Set(DEFAULT_STATE.items.map((item) => item.id));
var createDesktopItemId = (prefix = "item") => {
	return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;
};
var clampCell = (cell, columns, rows) => {
	return [Math.max(0, Math.min(columns - 1, Math.round(cell[0]))), Math.max(0, Math.min(rows - 1, Math.round(cell[1])))];
};
var cellKey = (cell) => `${cell[0]}:${cell[1]}`;
var findNearestFreeCell = (preferred, occupied, columns, rows) => {
	const start = clampCell(preferred, columns, rows);
	if (!occupied.has(cellKey(start))) return start;
	const maxRadius = Math.max(columns, rows);
	for (let radius = 1; radius <= maxRadius; radius += 1) for (let y = Math.max(0, start[1] - radius); y <= Math.min(rows - 1, start[1] + radius); y += 1) for (let x = Math.max(0, start[0] - radius); x <= Math.min(columns - 1, start[0] + radius); x += 1) {
		if (!(Math.abs(x - start[0]) === radius || Math.abs(y - start[1]) === radius)) continue;
		const candidate = [x, y];
		if (!occupied.has(cellKey(candidate))) return candidate;
	}
	return start;
};
var enforceUniqueCells = (items, columns, rows) => {
	const occupied = /* @__PURE__ */ new Set();
	for (const item of items) {
		const nextCell = findNearestFreeCell(item.cell, occupied, columns, rows);
		item.cell = nextCell;
		occupied.add(cellKey(nextCell));
	}
	return items;
};
var normalizeItem = (raw, columns, rows) => {
	const id = String(raw?.id || "").trim();
	if (!id) return null;
	if (id === "home") return null;
	const action = String(raw?.action || (raw?.href ? "open-link" : "open-view"));
	const item = {
		id,
		label: String(raw?.label || "Item"),
		icon: String(raw?.icon || (action === "open-link" ? "link" : "sparkle")),
		iconSrc: normalizeIconSrcFromPayload(raw?.iconSrc, raw?.href, action),
		viewId: String(raw?.viewId || "home"),
		cell: clampCell([Number(raw?.cell?.[0] || 0), Number(raw?.cell?.[1] || 0)], columns, rows),
		action: action === "open-link" ? "open-link" : "open-view",
		href: raw?.href ? String(raw.href) : "",
		shape: normalizeTileShape(raw?.shape)
	};
	if (item.action === "open-link") item.viewId = "home";
	return item;
};
var readState = () => {
	try {
		const raw = loadDesktopRaw();
		if (!raw) return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
		const decoded = decodeDesktopState(raw);
		if (!decoded) return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
		const columns = Math.max(4, Math.min(8, Number(decoded.columns || DEFAULT_STATE.columns)));
		const rows = Math.max(6, Math.min(12, Number(decoded.rows || DEFAULT_STATE.rows)));
		const fallbackItems = [...DEFAULT_STATE.items];
		const items = enforceUniqueCells((Array.isArray(decoded.items) && decoded.items.length ? decoded.items : fallbackItems).map((item) => normalizeItem(item, columns, rows)).filter((item) => Boolean(item)), columns, rows);
		return {
			columns,
			rows,
			items: items.length ? items : enforceUniqueCells(fallbackItems.map((entry) => normalizeItem({
				...entry,
				cell: [entry.cell[0], entry.cell[1]]
			}, columns, rows)).filter((item) => Boolean(item)), columns, rows)
		};
	} catch {
		return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
	}
};
var applyCellVars = (node, cell) => {
	node.style.setProperty("--cell-x", String(cell[0]));
	node.style.setProperty("--cell-y", String(cell[1]));
	node.style.setProperty("--p-cell-x", String(cell[0]));
	node.style.setProperty("--p-cell-y", String(cell[1]));
};
var readImageFileFromClipboard = (event) => {
	const items = Array.from(event.clipboardData?.items || []);
	for (const item of items) if (item.type?.startsWith("image/")) {
		const file = item.getAsFile();
		if (file) return file;
	}
	return null;
};
var pickDroppedImageFile = (event) => {
	return Array.from(event.dataTransfer?.files || []).find((file) => file.type?.startsWith("image/")) || null;
};
var readAsDataUrl = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result || ""));
		reader.onerror = () => reject(reader.error || /* @__PURE__ */ new Error("Failed to read image"));
		reader.readAsDataURL(file);
	});
};
var applyWallpaperFromFile = async (file) => {
	if (!file?.type?.startsWith("image/")) return false;
	const dataUrl = await readAsDataUrl(file);
	if (!dataUrl) return false;
	setAppWallpaper(dataUrl);
	return true;
};
var parseUrlFromText = (text) => {
	const value = String(text || "").trim();
	if (!value) return null;
	const direct = (() => {
		try {
			return new URL(value);
		} catch {
			return null;
		}
	})();
	if (direct && /^https?:$/i.test(direct.protocol)) return direct;
	const match = value.match(URL_PATTERN);
	if (!match?.[1]) return null;
	try {
		const parsed = new URL(match[1]);
		if (!/^https?:$/i.test(parsed.protocol)) return null;
		return parsed;
	} catch {
		return null;
	}
};
var parseUrlFromHtml = (html) => {
	const content = String(html || "").trim();
	if (!content) return null;
	try {
		const href = new DOMParser().parseFromString(content, "text/html").querySelector("a[href]")?.getAttribute("href") || "";
		if (!href) return null;
		const parsed = new URL(href, window.location.href);
		if (!/^https?:$/i.test(parsed.protocol)) return null;
		return parsed;
	} catch {
		return null;
	}
};
var createLinkItem = (url, cell, labelHint = "") => {
	const label = String(labelHint || "").trim() || url.hostname.replace(/^www\./, "") || "Link";
	return {
		id: createDesktopItemId("link"),
		label,
		icon: "link",
		iconSrc: hostnameToFaviconRef(url.hostname),
		viewId: "home",
		cell,
		action: "open-link",
		href: url.href,
		shape: "squircle"
	};
};
var parseUrlItemFromText = (text, cell) => {
	const parsed = parseUrlFromText(text);
	if (!parsed) return null;
	return createLinkItem(parsed, cell);
};
var normalizeImportedItems = (payload, columns, rows, preferredCell) => {
	if (!payload) return [];
	const base = payload;
	return (Array.isArray(base?.items) ? base.items : Array.isArray(payload) ? payload : base?.item ? [base.item] : [payload]).map((raw, index) => normalizeItem({
		...raw || {},
		id: String(raw?.id || createDesktopItemId("import")),
		cell: raw?.cell ?? [preferredCell[0], preferredCell[1] + index]
	}, columns, rows)).filter((item) => Boolean(item));
};
var parseItemsFromTextPayload = (textPlain, textHtml, columns, rows, preferredCell) => {
	const plain = String(textPlain || "").trim();
	const html = String(textHtml || "").trim();
	if (plain.startsWith("{") || plain.startsWith("[")) try {
		const parsed = JSON.parse(plain);
		if (parsed?.k === "cw-sdi") {
			const flat = parseDesktopItemCompact(parsed);
			if (flat?.id) return normalizeImportedItems({ items: [flat] }, columns, rows, preferredCell);
		}
		if (parsed?.kind === ITEM_ENVELOPE_KIND || parsed?.kind === REGISTRY_ENVELOPE_KIND || parsed?.items || parsed?.item || Array.isArray(parsed)) return normalizeImportedItems(parsed, columns, rows, preferredCell);
	} catch {}
	const htmlUrl = parseUrlFromHtml(html);
	if (htmlUrl) return [createLinkItem(htmlUrl, preferredCell, (() => {
		try {
			const text = new DOMParser().parseFromString(html, "text/html").querySelector("a[href]")?.textContent || "";
			return String(text || "").trim();
		} catch {
			return "";
		}
	})())];
	const plainItem = parseUrlItemFromText(plain, preferredCell);
	return plainItem ? [plainItem] : [];
};
var itemsForStoragePayload = (items) => items.map((it) => ({
	...it,
	iconSrc: compactIconSrcForStorage(it.iconSrc || "", it.action, it.href)
}));
var serializeRegistryEnvelope = (state) => {
	return JSON.stringify({
		kind: REGISTRY_ENVELOPE_KIND,
		version: 1,
		columns: state.columns,
		rows: state.rows,
		items: itemsForStoragePayload(state.items)
	}, null, 2);
};
var downloadJson = (filename, content) => {
	const blob = new Blob([content], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
var openDesktopItem = (item) => {
	if (item.action === "open-link") {
		if (!item.href) return;
		window.open(item.href, "_blank", "noopener,noreferrer");
		return;
	}
	requestOpenView({
		viewId: item.viewId,
		target: "window",
		params: {
			source: "home",
			itemId: item.id
		}
	});
};
var prettifyView = (viewId) => {
	const value = String(viewId || "").trim();
	if (!value) return "View";
	return value.charAt(0).toUpperCase() + value.slice(1);
};
var initializeOrientedDesktop = (host) => {
	if (!host || host.dataset.desktopMounted === "true") return;
	host.dataset.desktopMounted = "true";
	ensureOrientDesktopStyles();
	const state = readState();
	const itemById = new Map(state.items.map((item) => [item.id, item]));
	const itemIdList = state.items.map((item) => item.id);
	let draftTimer = null;
	const DRAFT_DEBOUNCE_MS = 400;
	const desktopRoot = document.createElement("div");
	desktopRoot.className = "speed-dial-root app-oriented-desktop";
	desktopRoot.style.position = "absolute";
	desktopRoot.style.inset = "0";
	desktopRoot.style.pointerEvents = "auto";
	desktopRoot.style.background = "transparent";
	desktopRoot.style.display = "grid";
	desktopRoot.tabIndex = 0;
	const applyGridLayoutVars = (el) => {
		el.style.setProperty("--layout-c", String(state.columns));
		el.style.setProperty("--layout-r", String(state.rows));
	};
	const shapeStack = document.createElement("div");
	shapeStack.className = "speed-dial-grid speed-dial-grid--labels ui-launcher-grid app-oriented-desktop__grid app-oriented-desktop__grid--labels";
	shapeStack.dataset.gridLayer = "icons";
	shapeStack.setAttribute("data-grid-columns", String(state.columns));
	shapeStack.setAttribute("data-grid-rows", String(state.rows));
	applyGridLayoutVars(shapeStack);
	shapeStack.dataset.dialStack = "shapes";
	const textStack = document.createElement("div");
	textStack.className = "speed-dial-grid speed-dial-grid--icons ui-launcher-grid app-oriented-desktop__grid app-oriented-desktop__grid--icons";
	textStack.dataset.gridLayer = "labels";
	textStack.setAttribute("data-grid-columns", String(state.columns));
	textStack.setAttribute("data-grid-rows", String(state.rows));
	applyGridLayoutVars(textStack);
	textStack.dataset.dialStack = "text";
	desktopRoot.append(shapeStack, textStack);
	host.appendChild(desktopRoot);
	const applyGridShapeMetadata = () => {
		const attr = gridShapeAttributeFromItems(state.items);
		shapeStack.setAttribute("data-grid-shape", attr);
		textStack.setAttribute("data-grid-shape", attr);
	};
	applyGridShapeMetadata();
	const commitDesktop = () => {
		if (draftTimer !== null) {
			clearTimeout(draftTimer);
			draftTimer = null;
		}
		persistDesktopMain(state.columns, state.rows, itemsForStoragePayload(state.items));
		applyGridShapeMetadata();
	};
	const scheduleDesktopDraft = () => {
		if (draftTimer !== null) clearTimeout(draftTimer);
		draftTimer = setTimeout(() => {
			draftTimer = null;
			persistDesktopDraft(state.columns, state.rows, itemsForStoragePayload(state.items));
		}, DRAFT_DEBOUNCE_MS);
	};
	let suppressClickUntil = 0;
	const iconNodeById = /* @__PURE__ */ new Map();
	const labelNodeById = /* @__PURE__ */ new Map();
	const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[char] || char);
	const occupiedSet = (exceptId = "") => {
		const occupied = /* @__PURE__ */ new Set();
		for (const entry of state.items) {
			if (exceptId && entry.id === exceptId) continue;
			occupied.add(cellKey(entry.cell));
		}
		return occupied;
	};
	const applyItemCell = (item, cell) => {
		item.cell = clampCell(cell, state.columns, state.rows);
		const iconNode = iconNodeById.get(item.id);
		const labelNode = labelNodeById.get(item.id);
		if (iconNode) applyCellVars(iconNode, item.cell);
		if (labelNode) applyCellVars(labelNode, item.cell);
	};
	const placeItemIntoFreeCell = (item, preferred, exceptId = "") => {
		const target = findNearestFreeCell(preferred, occupiedSet(exceptId), state.columns, state.rows);
		applyItemCell(item, target);
		return target;
	};
	const addItems = (items, preferredCell) => {
		let added = 0;
		for (let index = 0; index < items.length; index += 1) {
			const incoming = items[index];
			if (!incoming) continue;
			const item = normalizeItem({
				...incoming,
				id: incoming.id || createDesktopItemId("item"),
				cell: incoming.cell || [preferredCell[0], preferredCell[1] + index]
			}, state.columns, state.rows);
			if (!item || itemById.has(item.id)) continue;
			item.cell = findNearestFreeCell(item.cell, occupiedSet(), state.columns, state.rows);
			state.items.push(item);
			itemById.set(item.id, item);
			itemIdList.push(item.id);
			mountDesktopItem(item);
			added += 1;
		}
		if (added > 0) commitDesktop();
		return added;
	};
	const refreshDesktopItemNodes = (item) => {
		const iconNode = iconNodeById.get(item.id);
		const labelNode = labelNodeById.get(item.id);
		if (labelNode) {
			const span = labelNode.querySelector(".ui-ws-item-label span");
			if (span) span.textContent = item.label || "Item";
			applyCellVars(labelNode, item.cell);
		}
		if (iconNode) {
			const iconShape = iconNode.querySelector(".ui-ws-item-icon");
			if (iconShape) {
				iconShape.dataset.shape = normalizeTileShape(item.shape);
				const existingImage = iconShape.querySelector(".ui-ws-item-icon-image");
				let iconElement = iconShape.querySelector("ui-icon");
				const domIconSrc = expandIconSrcForDom(item.iconSrc || "");
				if (domIconSrc) {
					iconElement?.remove();
					if (existingImage) existingImage.src = domIconSrc;
					else {
						const image = document.createElement("img");
						image.className = "ui-ws-item-icon-image";
						image.alt = "";
						image.loading = "lazy";
						image.decoding = "async";
						image.referrerPolicy = "no-referrer";
						image.src = domIconSrc;
						image.addEventListener("error", () => image.remove());
						iconShape.insertBefore(image, iconShape.firstChild);
					}
				} else {
					if (existingImage) existingImage.remove();
					if (!iconElement) {
						iconElement = document.createElement("ui-icon");
						iconShape.appendChild(iconElement);
					}
					iconElement.setAttribute("icon", item.icon || "sparkle");
				}
			}
			applyCellVars(iconNode, item.cell);
		}
	};
	const guessCellFromPoint = (x, y) => {
		return resolveGridCellFromClientPoint(shapeStack, [x, y], {
			layout: {
				columns: state.columns,
				rows: state.rows
			},
			items: itemById,
			list: itemIdList,
			item: {
				id: "__menu__",
				cell: [0, 0]
			}
		}, "round");
	};
	const importFromClipboard = async (cell) => {
		try {
			if (navigator.clipboard?.read) {
				const records = await navigator.clipboard.read();
				for (const record of records) {
					if (record.types.includes("image/png") || record.types.includes("image/jpeg") || record.types.includes("image/webp")) {
						const imageType = record.types.find((type) => type.startsWith("image/"));
						if (!imageType) continue;
						const blob = await record.getType(imageType);
						if (await applyWallpaperFromFile(new File([blob], "wallpaper", { type: blob.type }))) return true;
					}
					const plainType = record.types.includes("text/plain") ? "text/plain" : "";
					const htmlType = record.types.includes("text/html") ? "text/html" : "";
					const imported = parseItemsFromTextPayload(plainType ? await (await record.getType(plainType)).text() : "", htmlType ? await (await record.getType(htmlType)).text() : "", state.columns, state.rows, cell);
					if (imported.length) return addItems(imported, cell) > 0;
				}
			}
			return addItems(parseItemsFromTextPayload(await navigator.clipboard.readText(), "", state.columns, state.rows, cell), cell) > 0;
		} catch {
			return false;
		}
	};
	const makeIconItem = (item) => {
		const el = document.createElement("div");
		el.className = "ui-ws-item";
		el.dataset.desktopId = item.id;
		el.dataset.layer = "icons";
		el.setAttribute("draggable", "false");
		applyCellVars(el, item.cell);
		const icon = document.createElement("div");
		icon.className = "ui-ws-item-icon shaped";
		icon.dataset.shape = normalizeTileShape(item.shape);
		const mountIconSrc = expandIconSrcForDom(item.iconSrc || "");
		if (mountIconSrc) {
			const image = document.createElement("img");
			image.className = "ui-ws-item-icon-image";
			image.alt = "";
			image.loading = "lazy";
			image.decoding = "async";
			image.referrerPolicy = "no-referrer";
			image.src = mountIconSrc;
			image.addEventListener("error", () => image.remove());
			icon.appendChild(image);
		} else {
			const iconElement = document.createElement("ui-icon");
			iconElement.setAttribute("icon", item.icon || "sparkle");
			icon.appendChild(iconElement);
		}
		el.appendChild(icon);
		return el;
	};
	const makeLabelItem = (item) => {
		const el = document.createElement("div");
		el.className = "ui-ws-item";
		el.dataset.desktopId = item.id;
		el.dataset.layer = "labels";
		el.style.pointerEvents = "none";
		el.style.background = "transparent";
		applyCellVars(el, item.cell);
		el.innerHTML = `<div class="ui-ws-item-label"><span>${escapeHtml(item.label)}</span></div>`;
		return el;
	};
	const removeDesktopItem = (itemId) => {
		const index = state.items.findIndex((item) => item.id === itemId);
		if (index === -1) return;
		if (desktopRoot.dataset.dialDraggingId === itemId) desktopRoot.dataset.dialDraggingId = "";
		state.items.splice(index, 1);
		itemById.delete(itemId);
		const listIndex = itemIdList.indexOf(itemId);
		if (listIndex >= 0) itemIdList.splice(listIndex, 1);
		iconNodeById.get(itemId)?.remove();
		labelNodeById.get(itemId)?.remove();
		iconNodeById.delete(itemId);
		labelNodeById.delete(itemId);
		enforceUniqueCells(state.items, state.columns, state.rows);
		commitDesktop();
	};
	const mountDesktopItem = (item) => {
		const iconNode = makeIconItem(item);
		const labelNode = makeLabelItem(item);
		iconNodeById.set(item.id, iconNode);
		labelNodeById.set(item.id, labelNode);
		shapeStack.appendChild(iconNode);
		textStack.appendChild(labelNode);
		const iconShape = iconNode.querySelector(".ui-ws-item-icon");
		if (iconShape) {
			iconShape.style.pointerEvents = "auto";
			iconShape.style.touchAction = "none";
		}
		bindInteraction(iconNode, {
			layout: [state.columns, state.rows],
			items: itemById,
			list: itemIdList,
			item,
			immediateDragStyles: true
		});
		iconNode.addEventListener("m-dragstart", () => {
			closeUnifiedContextMenu();
			desktopRoot.dataset.dialDraggingId = item.id;
			iconNode.dataset.interactionState = "onGrab";
			iconNode.dataset.gridCoordinateState = "source";
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onLabelDocked";
				labelNode.dataset.gridCoordinateState = "source";
				applyCellVars(labelNode, item.cell);
				labelNode.style.setProperty("--drag-x", "0");
				labelNode.style.setProperty("--drag-y", "0");
				labelNode.style.setProperty("--cs-drag-x", "0px");
				labelNode.style.setProperty("--cs-drag-y", "0px");
			}
		});
		iconNode.addEventListener("m-dragging", () => {
			scheduleDesktopDraft();
			iconNode.dataset.interactionState = "onMoving";
			iconNode.dataset.gridCoordinateState = "intermediate";
		});
		iconNode.addEventListener("m-dragend", () => {
			suppressClickUntil = performance.now() + SUPPRESS_CLICK_MS;
			iconNode.dataset.interactionState = "onRelax";
			iconNode.dataset.gridCoordinateState = "destination";
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onLabelDocked";
				labelNode.dataset.gridCoordinateState = "source";
			}
		});
		iconNode.addEventListener("m-dragsettled", (event) => {
			const settledCell = event?.detail?.cell || null;
			const finalCell = placeItemIntoFreeCell(item, settledCell ? [settledCell[0], settledCell[1]] : [item.cell[0], item.cell[1]], item.id);
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onPlace";
				labelNode.dataset.gridCoordinateState = "destination";
				labelNode.style.setProperty("--drag-x", "0");
				labelNode.style.setProperty("--drag-y", "0");
				labelNode.style.setProperty("--cs-drag-x", "0px");
				labelNode.style.setProperty("--cs-drag-y", "0px");
				applyCellVars(labelNode, finalCell);
			}
			iconNode.dataset.interactionState = "onPlace";
			iconNode.dataset.gridCoordinateState = "destination";
			iconNode.style.setProperty("--drag-x", "0");
			iconNode.style.setProperty("--drag-y", "0");
			iconNode.style.setProperty("--cs-drag-x", "0px");
			iconNode.style.setProperty("--cs-drag-y", "0px");
			applyCellVars(iconNode, finalCell);
			commitDesktop();
			desktopRoot.dataset.dialDraggingId = "";
			setTimeout(() => {
				iconNode.dataset.interactionState = "onHover";
				iconNode.dataset.gridCoordinateState = "source";
				const nextLabelNode = labelNodeById.get(item.id);
				if (nextLabelNode) {
					nextLabelNode.dataset.interactionState = "onHover";
					nextLabelNode.dataset.gridCoordinateState = "source";
				}
			}, 280);
		});
		(iconShape ?? iconNode).addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (performance.now() < suppressClickUntil) return;
			openDesktopItem(item);
		});
	};
	const createLinkShortcutFromClipboard = async (cell) => {
		return importFromClipboard(cell);
	};
	const openItemEditor = (item, opts) => {
		const isNew = !item;
		const seed = opts?.seed || {};
		const suggestedCell = opts?.suggestedCell || [0, 0];
		const workingItem = item ? item : {
			id: createDesktopItemId("item"),
			label: seed.label || "New shortcut",
			icon: seed.icon || "sparkle",
			iconSrc: "",
			viewId: pickEnabledView(seed.viewId || "viewer", "home"),
			cell: suggestedCell,
			action: seed.action || "open-view",
			href: seed.href || "",
			shape: normalizeTileShape(seed.shape)
		};
		openShortcutEditor({
			mode: isNew ? "create" : "edit",
			registerForBackNavigation: true,
			initial: {
				label: workingItem.label || "Item",
				icon: workingItem.icon || "sparkle",
				action: workingItem.action || "open-view",
				view: workingItem.viewId || "",
				href: workingItem.href || "",
				description: String(seed.description || ""),
				shape: normalizeTileShape(workingItem.shape)
			},
			actionOptions: ACTION_OPTIONS,
			viewOptions: ENABLED_VIEW_IDS.map((viewId) => ({
				value: viewId,
				label: prettifyView(viewId)
			})),
			onSave: (next) => {
				const action = String(next.action || "open-view");
				const nextHref = String(next.href || "").trim();
				const nextView = pickEnabledView(String(next.view || workingItem.viewId || "viewer"), "home");
				workingItem.label = String(next.label || "Item").trim() || "Item";
				workingItem.icon = String(next.icon || "sparkle").trim() || "sparkle";
				workingItem.action = action;
				workingItem.href = action === "open-link" ? nextHref : "";
				workingItem.viewId = action === "open-link" ? "home" : nextView;
				workingItem.shape = normalizeTileShape(next.shape);
				if (action === "open-link" && nextHref) try {
					const u = new URL(nextHref, window.location.href);
					workingItem.iconSrc = /^https?:$/i.test(u.protocol) ? hostnameToFaviconRef(u.hostname) : "";
				} catch {
					workingItem.iconSrc = "";
				}
				else workingItem.iconSrc = "";
				if (isNew) addItems([workingItem], suggestedCell);
				else {
					const existing = itemById.get(workingItem.id);
					if (existing) {
						Object.assign(existing, workingItem);
						itemById.set(existing.id, existing);
						refreshDesktopItemNodes(existing);
						commitDesktop();
					}
				}
			},
			onDelete: isNew ? void 0 : () => {
				removeDesktopItem(workingItem.id);
			}
		});
	};
	const openDesktopMenu = (event, item, cellHint) => {
		const entries = item ? [
			{
				id: "open",
				label: "Open",
				icon: item.action === "open-link" ? "arrow-square-out" : "play",
				action: () => openDesktopItem(item)
			},
			{
				id: "actions",
				label: "Actions",
				icon: "dots-three",
				action: () => {},
				children: [...item.action === "open-link" && item.href ? [{
					id: "copy-link",
					label: "Copy link",
					icon: "link",
					action: async () => {
						try {
							await navigator.clipboard.writeText(item.href || "");
						} catch {}
					}
				}, {
					id: "open-link-new-window",
					label: "Open link in new tab",
					icon: "arrow-square-out",
					action: () => {
						if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
					}
				}] : [], {
					id: "copy-item-json",
					label: "Copy item (compact JSON)",
					icon: "clipboard-text",
					action: async () => {
						try {
							await navigator.clipboard.writeText(serializeDesktopItemCompact(item));
						} catch {}
					}
				}]
			},
			{
				id: "manage",
				label: "Manage",
				icon: "wrench",
				action: () => {},
				children: [{
					id: "edit",
					label: "Edit Properties",
					icon: "pencil-simple-line",
					action: () => openItemEditor(item, { suggestedCell: item.cell })
				}, {
					id: "remove",
					label: "Remove",
					icon: "trash",
					danger: true,
					disabled: protectedIds.has(item.id),
					action: () => removeDesktopItem(item.id)
				}]
			}
		] : [
			{
				id: "new",
				label: "New",
				icon: "plus",
				action: () => {},
				children: [
					{
						id: "create-shortcut",
						label: "Create shortcut",
						icon: "plus",
						action: () => openItemEditor(void 0, { suggestedCell: cellHint })
					},
					{
						id: "paste-link",
						label: "Paste shortcut",
						icon: "clipboard",
						action: async () => {
							if (!await createLinkShortcutFromClipboard(cellHint)) requestOpenView({
								viewId: "explorer",
								target: "window",
								params: { source: "home" }
							});
						}
					},
					{
						id: "create-link-shortcut",
						label: "Create link shortcut",
						icon: "link",
						action: () => {
							openItemEditor(void 0, {
								suggestedCell: cellHint,
								seed: {
									action: "open-link",
									label: "New link",
									icon: "link",
									href: "",
									description: ""
								}
							});
						}
					}
				]
			},
			{
				id: "registry",
				label: "Registry",
				icon: "database",
				action: () => {},
				children: [
					{
						id: "copy-registry-json",
						label: "Copy registry JSON",
						icon: "clipboard-text",
						action: async () => {
							try {
								await navigator.clipboard.writeText(serializeRegistryEnvelope(state));
							} catch {}
						}
					},
					{
						id: "export-registry-json",
						label: "Export registry",
						icon: "download-simple",
						action: () => {
							const date = /* @__PURE__ */ new Date();
							downloadJson(`cw-home-registry-${`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}.json`, serializeRegistryEnvelope(state));
						}
					},
					{
						id: "import-registry-json",
						label: "Import from clipboard",
						icon: "upload-simple",
						action: async () => {
							await importFromClipboard(cellHint);
						}
					}
				]
			},
			{
				id: "open",
				label: "Open",
				icon: "squares-four",
				action: () => {},
				children: [{
					id: "open-explorer",
					label: "Explorer",
					icon: "books",
					action: () => requestOpenView({
						viewId: "explorer",
						target: "window",
						params: { source: "home" }
					})
				}, {
					id: "open-settings",
					label: "Settings",
					icon: "gear-six",
					action: () => requestOpenView({
						viewId: "settings",
						target: "window",
						params: { source: "home" }
					})
				}]
			},
			{
				id: "wallpaper",
				label: "Wallpaper",
				icon: "image",
				action: () => {},
				children: [{
					id: "change-wallpaper",
					label: "Choose image",
					icon: "image",
					action: async () => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = "image/*";
						input.onchange = async () => {
							const file = input.files?.[0];
							if (!file) return;
							await applyWallpaperFromFile(file);
						};
						input.click();
					}
				}]
			}
		];
		openUnifiedContextMenu({
			x: event.clientX,
			y: event.clientY,
			items: entries,
			compact: true
		});
	};
	const handlePaste = async (event) => {
		const image = readImageFileFromClipboard(event);
		if (image) {
			event.preventDefault();
			event.stopPropagation();
			await applyWallpaperFromFile(image);
			return;
		}
		const items = parseItemsFromTextPayload(event.clipboardData?.getData("text/plain") || "", event.clipboardData?.getData("text/html") || "", state.columns, state.rows, [0, 0]);
		if (!items.length) return;
		event.preventDefault();
		event.stopPropagation();
		addItems(items, [0, 0]);
	};
	desktopRoot.addEventListener("pointerdown", () => desktopRoot.focus());
	desktopRoot.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	desktopRoot.addEventListener("drop", async (event) => {
		const file = pickDroppedImageFile(event);
		if (file) {
			event.preventDefault();
			event.stopPropagation();
			await applyWallpaperFromFile(file);
			return;
		}
		const plain = event.dataTransfer?.getData("text/plain") || "";
		const html = event.dataTransfer?.getData("text/html") || "";
		let items = parseItemsFromTextPayload([event.dataTransfer?.getData("text/uri-list") || "", plain].filter(Boolean).join("\n").trim(), html, state.columns, state.rows, [0, 0]);
		if (!items.length) {
			const droppedTextFile = Array.from(event.dataTransfer?.files || []).find((entry) => entry.type === "text/plain" || entry.type === "text/html");
			if (droppedTextFile) {
				const payload = await droppedTextFile.text();
				items = parseItemsFromTextPayload(payload, droppedTextFile.type === "text/html" ? payload : "", state.columns, state.rows, [0, 0]);
			}
		}
		if (!items.length) return;
		event.preventDefault();
		event.stopPropagation();
		addItems(items, [0, 0]);
	});
	desktopRoot.addEventListener("paste", (event) => {
		handlePaste(event);
	});
	desktopRoot.addEventListener("contextmenu", (event) => {
		event.preventDefault();
		const itemId = (event.target?.closest?.(".ui-ws-item[data-desktop-id]"))?.dataset.desktopId || "";
		openDesktopMenu(event, itemId ? itemById.get(itemId) || null : null, guessCellFromPoint(event.clientX, event.clientY));
	});
	for (const item of state.items) mountDesktopItem(item);
};
//#endregion
//#region src/frontend/shells/environment/app-layers.ts
/**
* App shell / canvas / overlay stacking under #app (or another mount root).
* The shell layer defines named grid lines (`content-row`, `content-column`) that
* `ShellBase.mount()` targets; CRX must use the same structure as the PWA entry.
*/
var ensureAppLayers = (mountElement, options = {}) => {
	const enableOrientLayer = options.enableOrientLayer !== false;
	const enableCanvasLayer = options.enableCanvasLayer !== false;
	const existingCanvas = mountElement.querySelector("[data-app-layer=\"canvas\"]");
	const existingOrient = mountElement.querySelector("[data-app-layer=\"orient\"]");
	const existingShell = mountElement.querySelector("[data-app-layer=\"shell\"]");
	const existingOverlay = mountElement.querySelector("[data-app-layer=\"overlay\"]");
	const createCanvasLayer = () => {
		const canvasLayer = document.createElement("div");
		canvasLayer.dataset.appLayer = "canvas";
		canvasLayer.className = "app-layer app-layer--canvas";
		canvasLayer.style.position = "absolute";
		canvasLayer.style.inset = "0";
		canvasLayer.style.zIndex = "0";
		canvasLayer.style.pointerEvents = "none";
		initializeAppCanvasLayer(canvasLayer);
		return canvasLayer;
	};
	if (existingShell && existingOverlay) {
		let canvasLayer = existingCanvas;
		if (enableCanvasLayer && !canvasLayer) {
			canvasLayer = createCanvasLayer();
			mountElement.insertBefore(canvasLayer, existingOrient ?? existingShell);
		}
		if (!enableCanvasLayer && canvasLayer) {
			canvasLayer.remove();
			canvasLayer = null;
		}
		if (enableOrientLayer && !existingOrient) {
			const orientLayer = document.createElement("div");
			orientLayer.dataset.appLayer = "orient";
			orientLayer.className = "app-layer app-layer--orient";
			orientLayer.style.position = "absolute";
			orientLayer.style.inset = "0";
			orientLayer.style.zIndex = "5";
			orientLayer.style.pointerEvents = "none";
			orientLayer.style.background = "transparent";
			const orientBox = document.createElement("cw-oriented-box");
			orientBox.className = "ui-orientbox app-oriented-box";
			orientBox.setAttribute("data-mixin", "ui-orientbox");
			orientBox.style.position = "absolute";
			orientBox.style.inset = "0";
			orientBox.style.pointerEvents = "auto";
			orientBox.style.background = "transparent";
			orientLayer.appendChild(orientBox);
			fixOrientToScreen(orientBox);
			initializeOrientedDesktop(orientBox);
			mountElement.insertBefore(orientLayer, existingShell);
			return {
				canvasLayer,
				orientLayer,
				shellLayer: existingShell,
				overlayLayer: existingOverlay
			};
		}
		if (!enableOrientLayer && existingOrient) {
			existingOrient.remove();
			return {
				canvasLayer,
				orientLayer: null,
				shellLayer: existingShell,
				overlayLayer: existingOverlay
			};
		}
		return {
			canvasLayer,
			orientLayer: enableOrientLayer ? existingOrient || null : null,
			shellLayer: existingShell,
			overlayLayer: existingOverlay
		};
	}
	mountElement.replaceChildren();
	mountElement.style.position = "relative";
	mountElement.style.overflow = "hidden";
	mountElement.dataset.appLayerRoot = "true";
	const canvasLayer = enableCanvasLayer ? createCanvasLayer() : null;
	const orientLayer = enableOrientLayer ? document.createElement("div") : null;
	if (orientLayer) {
		orientLayer.dataset.appLayer = "orient";
		orientLayer.className = "app-layer app-layer--orient";
		orientLayer.style.position = "absolute";
		orientLayer.style.inset = "0";
		orientLayer.style.zIndex = "5";
		orientLayer.style.pointerEvents = "none";
		orientLayer.style.background = "transparent";
		const orientBox = document.createElement("cw-oriented-box");
		orientBox.className = "ui-orientbox app-oriented-box";
		orientBox.setAttribute("data-mixin", "ui-orientbox");
		orientBox.style.position = "absolute";
		orientBox.style.inset = "0";
		orientBox.style.pointerEvents = "auto";
		orientBox.style.background = "transparent";
		orientLayer.appendChild(orientBox);
		fixOrientToScreen(orientBox);
		initializeOrientedDesktop(orientBox);
	}
	const shellLayer = document.createElement("div");
	shellLayer.dataset.appLayer = "shell";
	shellLayer.className = "app-layer app-layer--shell";
	shellLayer.style.position = "absolute";
	shellLayer.style.inset = "0";
	shellLayer.style.zIndex = "10";
	shellLayer.style.pointerEvents = "none";
	shellLayer.style.display = "grid";
	shellLayer.style.gridTemplateColumns = "[content-column] minmax(0px, 1fr)";
	shellLayer.style.gridTemplateRows = "[status-row] minmax(0px, max-content) [content-row] minmax(0px, 1fr) [dock-row] minmax(0px, max-content)";
	shellLayer.style.overflow = "hidden";
	shellLayer.style.background = "transparent";
	shellLayer.style.backgroundColor = "transparent";
	const overlayLayer = document.createElement("div");
	overlayLayer.dataset.appLayer = "overlay";
	overlayLayer.className = "app-layer app-layer--overlay";
	overlayLayer.style.position = "absolute";
	overlayLayer.style.inset = "0";
	overlayLayer.style.zIndex = "1000";
	overlayLayer.style.pointerEvents = "none";
	overlayLayer.style.background = "transparent";
	overlayLayer.style.backgroundColor = "transparent";
	if (canvasLayer) mountElement.append(canvasLayer);
	if (orientLayer) mountElement.append(orientLayer);
	mountElement.append(shellLayer, overlayLayer);
	return {
		canvasLayer,
		orientLayer,
		shellLayer,
		overlayLayer
	};
};
//#endregion
export { loadSubAppWithShell as a, getShellFromQuery as i, VALID_VIEWS as n, navigateToView as o, getSavedShellPreference as r, ensureAppLayers as t };
