import { x as fixOrientToScreen } from "../fest/dom.js";
import { _ as pickEnabledView, g as isEnabledView, h as ENABLED_VIEW_IDS, i as coerceShellForBootViewport, m as DEFAULT_VIEW_ID, o as normalizeBootShellId, s as readLastActiveBootShell } from "../chunks/Theme.js";
import "../chunks/Settings.js";
import { a as bootImmersive, c as bootWindow, i as bootEnvironment, n as bootBase, o as bootMinimal, r as bootContent, s as bootTabbed } from "../chunks/BootLoader.js";
import "../vendor/@capacitor_core.js";
import "../chunks/config.js";
import "../chunks/hub-socket-boot.js";
import "../chunks/websocket.js";
//#region ../../modules/projects/subsystem/src/boot/routing.ts
var normalizeShellPreference = (shell) => normalizeBootShellId(shell);
var getShellFromQuery = () => {
	try {
		const shell = (new URLSearchParams(location.search).get("shell") || "").trim().toLowerCase();
		if (shell === "minimal" || shell === "faint" || shell === "base" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return normalizeShellPreference(shell);
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
		if (saved === "minimal" || saved === "faint" || saved === "base" || saved === "window" || saved === "tabbed" || saved === "environment" || saved === "content" || saved === "immersive") {
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
			case "immersive": return { mount: async (el) => {
				await bootImmersive(el, view);
			} };
			case "content": return { mount: async (el) => {
				await bootContent(el, view);
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
//#region ../../modules/projects/image.ts/src/canvas/Canvas-2.ts
var WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
var DEFAULT_WALLPAPER_URL = "/assets/wallpaper.jpg";
var initializeAppCanvasLayer = (container) => {
	const root = container;
	root.replaceChildren();
	root.style.position = "absolute";
	root.style.inset = "0";
	root.style.overflow = "hidden";
	root.style.background = "radial-gradient(circle at 18% 12%, #1b2a45 0%, #0f1728 42%, #060910 100%)";
	const glow = document.createElement("div");
	glow.className = "app-canvas__glow";
	glow.style.position = "absolute";
	glow.style.inset = "-20%";
	glow.style.pointerEvents = "none";
	glow.style.opacity = "0.7";
	glow.style.background = "radial-gradient(circle at 15% 20%, rgba(145,185,255,0.45) 0%, transparent 40%), radial-gradient(circle at 75% 72%, rgba(91,134,235,0.35) 0%, transparent 43%)";
	const canvas = document.createElement("canvas", { is: "ui-canvas" });
	canvas.className = "app-canvas__image";
	canvas.style.position = "absolute";
	canvas.style.inset = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.inlineSize = "100%";
	canvas.style.blockSize = "100%";
	canvas.style.maxInlineSize = "100%";
	canvas.style.maxBlockSize = "100%";
	canvas.style.opacity = "0.88";
	canvas.style.mixBlendMode = "normal";
	canvas.setAttribute("is", "ui-canvas");
	root.append(glow, canvas);
	const wallpaper = loadWallpaperUrl();
	canvas.setAttribute("data-src", wallpaper);
	return {
		root,
		canvas,
		glow
	};
};
var loadWallpaperUrl = () => {
	try {
		const value = localStorage.getItem(WALLPAPER_STORAGE_KEY);
		return value && value.trim() ? value.trim() : DEFAULT_WALLPAPER_URL;
	} catch {
		return DEFAULT_WALLPAPER_URL;
	}
};
//#endregion
//#region src/shared/routing/core/app-layers.ts
/**
* App shell / canvas / overlay stacking under #app (or another mount root).
* Implemented here (under `shared/routing`) so PWA and CRX entries resolve one stable
* module — avoids dev-server secondary fetches to `frontend/ai-slop/*` that could fail behind proxies.
*/
/** COMPAT: historical `fl-ui/speed-dial` orient hook; upstream module not present in this tree. */
var initializeOrientedDesktop = (_host) => {};
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
