import { h as preloadStyle, m as loadInlineStyle } from "../fest/dom.js";
import { c as ref } from "../fest/object.js";
import { a as initBootShellWindowActivity, g as isEnabledView, h as ENABLED_VIEW_IDS, l as ViewRegistry, n as syncBrowserChromeTheme, t as applyTheme, y as serviceChannels } from "./Theme.js";
import { x as dynamicTheme } from "../vendor/jsox.js";
import { n as loadSettings, r as saveSettings } from "./Settings.js";
import { a as ensureStyleSheet } from "../fest/icon.js";
//#region ../../modules/projects/subsystem/src/boot/toast.ts
var DEFAULT_CONFIG = {
	containerId: "rs-toast-layer",
	position: "bottom",
	maxToasts: 5,
	zIndex: 2147483647
};
var DEFAULT_DURATION = 3e3;
var TRANSITION_DURATION = 200;
/** Suppress the same toast repeating within this window (main thread + broadcast). */
var DEDUPE_WINDOW_MS = 400;
var lastToastFingerprint = "";
var lastToastFingerprintAt = 0;
var toastFingerprint = (opts) => `${opts.kind || "info"}\0${opts.position || DEFAULT_CONFIG.position}\0${opts.message}`;
var hasVisibleDuplicate = (layer, message, kind) => {
	for (const el of Array.from(layer?.children ?? [])) if (el instanceof HTMLElement && el.classList.contains("rs-toast") && el.getAttribute("data-kind") === kind && el.textContent === message) return true;
	return false;
};
var TOAST_STYLES = `
@layer viewer-toast {
    .rs-toast-layer {
        position: fixed;
        z-index: var(--shell-toast-z, 2147483647);
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
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        max-inline-size: min(90vw, 32rem);
        inline-size: fit-content;

        border-radius: var(--toast-radius, 0.5rem);
        background-color: var(--toast-bg, light-dark(#fafbfc, #1e293b));
        box-shadow: var(--toast-shadow, 0 6px 14px rgba(0, 0, 0, 0.45));
        backdrop-filter: blur(12px) saturate(140%);
        color: var(--toast-text, light-dark(#000000, #ffffff));

        font-family: var(--toast-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        font-size: var(--toast-font-size, 0.875rem);
        font-weight: var(--toast-font-weight, 500);
        letter-spacing: 0.01em;
        line-height: 1.4;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;

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
        --toast-bg: var(--color-success, var(--color-success, #22c55e));
    }

    .rs-toast[data-kind="warning"] {
        --toast-bg: var(--color-warning, var(--color-warning, #f59e0b));
    }

    .rs-toast[data-kind="error"] {
        --toast-bg: var(--color-error, var(--color-error, #ef4444));
    }

    @media (prefers-reduced-motion: reduce) {
        .rs-toast,
        .rs-toast[data-visible] {
            transition-duration: 0ms;
            transform: none;
        }
    }

    @media print {
        .rs-toast-layer, .rs-toast {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            inset: 0 !important;
            z-index: -1 !important;
            inline-size: 0 !important;
            block-size: 0 !important;
            max-inline-size: 0 !important;
            max-block-size: 0 !important;
            min-inline-size: 0 !important;
            min-block-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            overflow: hidden !important;
        }
    }
}
`;
var injectedDocs = /* @__PURE__ */ new WeakSet();
var toastLayers = /* @__PURE__ */ new Map();
/**
* Ensure styles are injected into the document
*/
var ensureStyles = (doc = document) => {
	if (injectedDocs.has(doc)) return;
	const style = doc.createElement("style");
	style.id = "__rs-toast-styles__";
	style.textContent = TOAST_STYLES;
	(doc.head || doc.documentElement).appendChild(style);
	injectedDocs.add(doc);
};
/**
* Get or create a toast layer container
*/
var getToastLayer = (config, doc = document) => {
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
		layer.setAttribute("aria-live", "polite");
		layer.setAttribute("aria-atomic", "true");
		(doc.body || doc.documentElement).appendChild(layer);
	}
	layer.setAttribute("data-position", config.position);
	layer.style.setProperty("--shell-toast-z", String(config.zIndex));
	toastLayers.set(key, layer);
	return layer;
};
/**
* Broadcast toast to all clients (for service worker context)
*/
var broadcastToast = (options) => {
	try {
		const channel = new BroadcastChannel("rs-toast");
		channel.postMessage({
			type: "show-toast",
			options
		});
		channel.close();
	} catch (e) {
		console.warn("[Toast] Broadcast failed:", e);
	}
};
/**
* Create and show a toast notification
*
* @param options - Toast options object or message string
* @returns The created toast element, or null if in service worker context
*/
var showToast = (options) => {
	const opts = typeof options === "string" ? { message: options } : options;
	const { message, kind = "info", duration = DEFAULT_DURATION, persistent = false, position = DEFAULT_CONFIG.position, onClick } = opts;
	if (!message) return null;
	const fp = toastFingerprint(opts);
	const now = Date.now();
	if (fp === lastToastFingerprint && now - lastToastFingerprintAt < DEDUPE_WINDOW_MS) return null;
	if (typeof document === "undefined") {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		broadcastToast(opts);
		return null;
	}
	const config = {
		...DEFAULT_CONFIG,
		position
	};
	const layer = getToastLayer(config);
	if (hasVisibleDuplicate(layer, message, kind)) {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		return null;
	}
	lastToastFingerprint = fp;
	lastToastFingerprintAt = now;
	while (layer.children.length >= config.maxToasts) layer.firstChild?.remove();
	const toast = document.createElement("div");
	toast.className = "rs-toast";
	toast.setAttribute("data-kind", kind);
	toast.setAttribute("role", kind === "error" || kind === "warning" ? "alert" : "status");
	toast.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
	toast.textContent = message;
	layer.appendChild(toast);
	globalThis?.requestAnimationFrame?.(() => {
		toast.setAttribute("data-visible", "");
	});
	let hideTimer = null;
	const removeToast = () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		toast.removeAttribute("data-visible");
		globalThis?.setTimeout?.(() => {
			toast.remove();
			if (!layer.childElementCount) {
				const key = `${config.containerId}-${config.position}`;
				toastLayers.delete(key);
			}
		}, TRANSITION_DURATION);
	};
	if (!persistent) hideTimer = globalThis?.setTimeout?.(removeToast, duration);
	toast.addEventListener("click", () => {
		onClick?.();
		removeToast();
	});
	toast.addEventListener("pointerdown", () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		removeToast();
	}, { once: true });
	return toast;
};
//#endregion
//#region ../../modules/projects/subsystem/src/routing/core/view-transitions.ts
/**
* Canonical view order used to determine navigation direction.
* Earlier index = "back", later index = "forward".
*/
var VIEW_ORDER = [
	"home",
	"viewer",
	"editor",
	"explorer",
	"workcenter",
	"airpad",
	"history",
	"settings",
	"print"
];
/** `true` when `document.startViewTransition` is available (Chrome 111+). */
var supportsViewTransitions = () => typeof document !== "undefined" && "startViewTransition" in document;
/**
* Compute navigation direction based on the ordered view list.
*
* Unknown view IDs fall back to `"fade"` (no slide animation).
*/
function getTransitionDirection(from, to) {
	const fi = VIEW_ORDER.indexOf(from);
	const ti = VIEW_ORDER.indexOf(to);
	if (fi === -1 || ti === -1 || fi === ti) return "fade";
	return fi < ti ? "forward" : "backward";
}
/**
* Wrap a DOM mutation in a View Transition, with a transparent fallback.
*
* Before starting the transition, `data-vt-direction` is set on `:root` so
* CSS `::view-transition-old/new(active-view)` can select the right keyframe
* animation via inherited CSS custom properties.
*
* If a transition is already running, the browser will abort the previous one
* and start the new one — this is intentional and handled gracefully.
*/
async function withViewTransition(update, options = {}) {
	if (!supportsViewTransitions()) {
		await update();
		return;
	}
	const { direction = "fade", types } = options;
	document.documentElement.dataset.vtDirection = direction;
	const doc = document;
	const transition = types?.length ? doc.startViewTransition({
		update,
		types
	}) : doc.startViewTransition(update);
	try {
		await (transition.updateCallbackDone ?? transition.finished);
	} catch {} finally {
		delete document.documentElement.dataset.vtDirection;
	}
	transition.finished.catch(() => {});
}
//#endregion
//#region src/shared/routing/core/view-prefetch.ts
/**
* Low-priority prefetch of view chunks after the focused view is interactive.
*/
function scheduleIdle(fn, timeoutMs) {
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(fn, { timeout: timeoutMs });
	else globalThis.setTimeout?.(fn, 32);
}
/**
* Stagger dynamic imports for non-current views so the next navigation is faster
* without competing with the active view's work.
*/
function scheduleViewModulePrefetch(currentViewId) {
	const others = ENABLED_VIEW_IDS.filter((id) => id !== currentViewId);
	if (others.length === 0) return;
	let index = 0;
	const step = () => {
		const id = others[index++];
		if (!id) return;
		ViewRegistry.prefetchModule(id);
		scheduleIdle(step, 6e3);
	};
	scheduleIdle(step, 2500);
}
//#endregion
//#region ../../modules/projects/subsystem/src/boot/shell-elements.ts
var ShellHost = class extends HTMLElement {
	mountShellLayout(layout) {
		if (!this.shadowRoot) this.attachShadow({ mode: "open" });
		this.shadowRoot.replaceChildren(layout);
	}
};
function ensureShellElementDefined(id) {
	const tag = `cw-shell-${id}`;
	if (!customElements.get(tag)) customElements.define(tag, ShellHost);
	return tag;
}
//#endregion
//#region ../../modules/projects/subsystem/src/boot/shells.ts
/** Views backed by {@link SERVICE_CHANNEL_CONFIG}; lazily initialized on first navigate when not boot-preloaded. */
var VIEW_SERVICE_CHANNEL_IDS = new Set([
	"workcenter",
	"settings",
	"viewer",
	"explorer",
	"airpad",
	"print",
	"history",
	"editor",
	"home"
]);
/**
* Abstract base shell with common functionality
*/
var ShellBase = class {
	theme = ref({
		id: "auto",
		name: "Auto",
		colorScheme: "auto"
	});
	currentView = ref("home");
	navigationState = {
		currentView: "home",
		viewHistory: []
	};
	container = null;
	rootElement = null;
	contentContainer = null;
	toolbarContainer = null;
	toolbarViewSlot = null;
	toolbarThemeSlot = null;
	statusContainer = null;
	overlayContainer = null;
	loadedViews = /* @__PURE__ */ new Map();
	currentViewElement = null;
	navigationToken = 0;
	mounted = false;
	themeCycleButton = null;
	themeCycleIcon = null;
	themeAttrObserver = null;
	shellActivityDispose = null;
	async mount(container) {
		if (this.mounted) {
			console.warn(`[${this.id}] Shell already mounted`);
			return;
		}
		this.container = container;
		const stylesheet = this.getStylesheet();
		if (stylesheet) {
			if (await preloadStyle(stylesheet)) await loadInlineStyle(stylesheet);
		}
		const shellTagName = ensureShellElementDefined(this.id);
		const shellHost = document.createElement(shellTagName);
		const shellLayout = this.createLayout();
		shellHost.mountShellLayout(shellLayout);
		this.rootElement = shellHost;
		const shellCss = this.getStylesheet();
		if (shellCss && shellHost.shadowRoot) loadInlineStyle(shellCss, shellHost.shadowRoot);
		if (this.id === "minimal" && shellHost.shadowRoot) {
			const iconSheet = ensureStyleSheet();
			if (iconSheet) try {
				const cur = [...shellHost.shadowRoot.adoptedStyleSheets];
				if (!cur.includes(iconSheet)) shellHost.shadowRoot.adoptedStyleSheets = [...cur, iconSheet];
			} catch (e) {
				console.warn("[Shell] Could not adopt icon registry stylesheet into minimal shell shadow:", e);
			}
		}
		this.rootElement.setAttribute("data-shell", this.id);
		this.rootElement.setAttribute("data-shell-system", "task-tab");
		this.rootElement.style.gridColumn = "content-column";
		this.rootElement.style.gridRow = "content-row";
		this.rootElement.style.alignSelf = "stretch";
		this.rootElement.style.justifySelf = "stretch";
		this.rootElement.style.minInlineSize = "0";
		this.rootElement.style.minBlockSize = "0";
		this.rootElement.style.pointerEvents = "auto";
		this.contentContainer = shellLayout.querySelector("[data-shell-content]") || shellLayout;
		this.toolbarContainer = shellLayout.querySelector("[data-shell-toolbar]");
		this.statusContainer = shellLayout.querySelector("[data-shell-status]");
		this.overlayContainer = shellLayout.querySelector("[data-shell-overlays]");
		this.ensureToolbarChrome();
		this.applyTheme(this.getThemeRefValue());
		this.bindThemeAttrObserver();
		container.replaceChildren(this.rootElement);
		this.mounted = true;
		this.shellActivityDispose = initBootShellWindowActivity(this.id);
		this.syncNavigationFromUrl();
		try {
			globalThis.__LURE_DYNAMIC_THEME_PRIORITY__ = true;
			dynamicTheme(document.documentElement);
		} catch (e) {
			console.warn(`[${this.id}] dynamicTheme init failed:`, e);
		}
		console.log(`[${this.id}] Shell mounted with data-shell="${this.id}"`);
	}
	/** Match route search params (order-insensitive). */
	sameRouteParams(a, b) {
		const ea = new URLSearchParams(a || {});
		const eb = new URLSearchParams(b || {});
		if (ea.toString() === eb.toString()) return true;
		const keys = new Set([...ea.keys(), ...eb.keys()]);
		for (const k of keys) if (ea.get(k) !== eb.get(k)) return false;
		return true;
	}
	/**
	* When the shell mounts on a path-backed view, mirror it into navigation state so
	* boot / first navigate() does not treat a placeholder as the previous view.
	*/
	syncNavigationFromUrl() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		const stateView = (globalThis?.history?.state)?.viewId;
		const fromPath = this.getViewFromPathname();
		const resolved = stateView && isEnabledView(String(stateView)) ? stateView : fromPath && isEnabledView(String(fromPath)) ? fromPath : null;
		if (!resolved) return;
		this.navigationState.currentView = resolved;
		this.navigationState.previousView = void 0;
		this.navigationState.params = Object.fromEntries(new URLSearchParams(globalThis.location?.search || ""));
		this.currentView.value = resolved;
		this.navigationState.viewHistory = [resolved];
	}
	unmount() {
		if (!this.mounted) return;
		this.shellActivityDispose?.();
		this.shellActivityDispose = null;
		for (const [viewId] of this.loadedViews) try {
			ViewRegistry.unload(viewId);
		} catch (e) {
			console.warn(`[${this.id}] View ${viewId} unmount error:`, e);
		}
		this.loadedViews.clear();
		this.rootElement?.remove();
		this.rootElement = null;
		this.contentContainer = null;
		this.toolbarContainer = null;
		this.statusContainer = null;
		this.overlayContainer = null;
		this.container = null;
		this.mounted = false;
		this.themeAttrObserver?.disconnect();
		this.themeAttrObserver = null;
		console.log(`[${this.id}] Shell unmounted`);
	}
	async navigate(viewId, params) {
		console.log(`[${this.id}] Navigating to: ${viewId}`, params);
		const navToken = ++this.navigationToken;
		if (viewId === this.currentView.value && this.sameRouteParams(params, this.navigationState.params)) {
			const entry = this.loadedViews.get(viewId);
			if (entry?.element.isConnected && (this.contentContainer?.contains(entry.element) || this.rootElement?.contains(entry.element)) && !entry.element.hidden) return;
		}
		const previousView = this.navigationState.currentView;
		this.navigationState.previousView = previousView;
		this.navigationState.currentView = viewId;
		this.navigationState.params = params;
		if (this.navigationState.viewHistory[this.navigationState.viewHistory.length - 1] !== viewId) {
			this.navigationState.viewHistory.push(viewId);
			if (this.navigationState.viewHistory.length > 50) this.navigationState.viewHistory.shift();
		}
		this.currentView.value = viewId;
		if (typeof window !== "undefined" && typeof window != "undefined") {
			const searchParams = new URLSearchParams(params || {});
			const isPathRoutedShell = this.id === "base" || this.id === "minimal" || this.id === "immersive";
			if (isPathRoutedShell) searchParams.set("shell", this.id);
			const search = searchParams.toString() ? "?" + searchParams.toString() : "";
			const newPathAndSearch = (isPathRoutedShell ? `/${String(viewId || "home").replace(/^\/+/, "")}` : "/") + search;
			try {
				const next = new URL(newPathAndSearch, globalThis.location.origin);
				const cur = new URL(globalThis.location.href);
				if (next.pathname !== cur.pathname || next.search !== cur.search) globalThis?.history?.pushState?.({
					viewId,
					params
				}, "", next.pathname + next.search);
			} catch {
				if (globalThis?.location?.pathname !== "/" || (globalThis?.location?.search || "") !== search) globalThis?.history?.pushState?.({
					viewId,
					params
				}, "", newPathAndSearch);
			}
		}
		try {
			const element = await this.loadView(viewId, params);
			if (navToken !== this.navigationToken) return;
			await this.renderViewWithTransition(element);
			if (navToken !== this.navigationToken) return;
			scheduleViewModulePrefetch(viewId);
		} catch (error) {
			console.error(`[${this.id}] Failed to load view ${viewId}:`, error);
			this.showMessage(`Failed to load ${viewId}`);
		}
	}
	async loadView(viewId, params) {
		let initialData;
		const bodyToken = params?._bodyToken;
		if (bodyToken) try {
			const raw = globalThis?.sessionStorage?.getItem?.(bodyToken);
			if (raw != null) {
				globalThis?.sessionStorage?.removeItem?.(bodyToken);
				try {
					initialData = JSON.parse(raw);
				} catch {
					initialData = raw;
				}
			}
		} catch {}
		const cached = this.loadedViews.get(viewId);
		if (cached) {
			if (!cached.element.isConnected) {
				const refreshed = cached.view.render({
					shellContext: this.getContext(),
					params,
					initialData
				});
				this.loadedViews.set(viewId, {
					view: cached.view,
					element: refreshed
				});
				if (cached.view.lifecycle?.onMount) await cached.view.lifecycle.onMount();
				return refreshed;
			}
			if (cached.view.getToolbar && this.toolbarContainer) {
				const toolbar = cached.view.getToolbar();
				this.setViewToolbar(toolbar);
			}
			return cached.element;
		}
		const view = await ViewRegistry.load(viewId, {
			shellContext: this.getContext(),
			params,
			initialData
		});
		if (VIEW_SERVICE_CHANNEL_IDS.has(viewId)) try {
			await serviceChannels.initChannel(viewId);
		} catch (err) {
			console.warn(`[${this.id}] initChannel(${viewId}) failed:`, err);
		}
		const element = view.render({
			shellContext: this.getContext(),
			params,
			initialData
		});
		this.loadedViews.set(viewId, {
			view,
			element
		});
		if (view.getToolbar && this.toolbarContainer) {
			const toolbar = view.getToolbar();
			this.setViewToolbar(toolbar);
		}
		if (view.lifecycle?.onMount) await view.lifecycle.onMount();
		return element;
	}
	setTheme(theme) {
		this.theme.value = theme;
		this.applyTheme(theme);
		this.syncThemeToolbarControls();
	}
	getContext() {
		return {
			shellId: this.id,
			navigate: (viewId, params) => this.navigate(viewId, params),
			goBack: () => this.goBack(),
			showMessage: (msg, duration) => this.showMessage(msg, duration),
			navigationState: this.navigationState,
			theme: this.getThemeRefValue(),
			layout: this.layout,
			getContentContainer: () => this.contentContainer,
			getOverlayContainer: () => this.overlayContainer,
			getToolbarContainer: () => this.toolbarContainer,
			setViewToolbar: (toolbar) => this.setViewToolbar(toolbar)
		};
	}
	getElement() {
		if (!this.rootElement) throw new Error(`[${this.id}] Shell not mounted`);
		return this.rootElement;
	}
	/**
	* Perform the raw DOM swap for a view change (no transition animation).
	*
	* This is the synchronous inner mutation used both as a standalone call
	* and as the update callback inside `renderViewWithTransition`.
	* `onHide` must be called by the caller BEFORE invoking this when using
	* a view transition so the old view's final state is captured correctly.
	*/
	renderView(element) {
		if (!this.contentContainer) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.contentContainer.contains(prev.element)) prev.element.remove();
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		if (!this.contentContainer.contains(element)) this.contentContainer.appendChild(element);
		this.currentViewElement = element;
	}
	/**
	* Render a view with a View Transition animation.
	*
	* Calls `onHide` on the outgoing view BEFORE the transition starts so the
	* browser captures the old view in its final settled state.  The actual
	* DOM swap runs inside `document.startViewTransition()` so the browser can
	* capture before/after snapshots and cross-fade (or slide) between them.
	*
	* Falls back to a plain `renderView` call on browsers that do not support
	* the View Transition API.
	*/
	async renderViewWithTransition(element) {
		if (!this.contentContainer) {
			this.renderView(element);
			this.invokeCurrentViewOnShow();
			return;
		}
		const previousId = this.navigationState.previousView;
		const prevEntry = previousId && previousId !== this.currentView.value ? this.loadedViews.get(previousId) : void 0;
		if (prevEntry?.view.lifecycle?.onHide) prevEntry.view.lifecycle.onHide();
		const direction = getTransitionDirection(previousId ?? "", this.currentView.value);
		await withViewTransition(() => this.renderView(element), {
			direction,
			types: [direction, `to-${this.currentView.value}`]
		});
		this.invokeCurrentViewOnShow();
	}
	resolveShellColorScheme(theme) {
		const prefersDark = globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
		return theme.colorScheme === "dark" ? "dark" : theme.colorScheme === "light" ? "light" : prefersDark ? "dark" : "light";
	}
	/**
	* Apply theme to the shell
	*/
	applyTheme(theme) {
		if (!this.rootElement) return;
		const resolved = this.resolveShellColorScheme(theme);
		this.rootElement.dataset.theme = resolved;
		this.rootElement.style.colorScheme = resolved;
		syncBrowserChromeTheme(resolved, theme.colorScheme);
		if (theme.cssVariables) for (const [key, value] of Object.entries(theme.cssVariables)) this.rootElement.style.setProperty(key, value);
	}
	getThemeRefValue() {
		return this.theme?.value;
	}
	/**
	* Go back in navigation history
	*/
	goBack() {
		const history = this.navigationState.viewHistory;
		if (history.length > 1) {
			history.pop();
			const previous = history[history.length - 1];
			if (previous) this.navigate(previous);
		}
	}
	/**
	* Show a status message
	*/
	showMessage(message, duration = 3e3) {
		showToast({
			message,
			duration,
			kind: "info"
		});
	}
	/**
	* Set the current view's toolbar
	*/
	setViewToolbar(toolbar) {
		this.ensureToolbarChrome();
		if (!this.toolbarViewSlot) return;
		this.toolbarViewSlot.replaceChildren();
		if (toolbar) this.toolbarViewSlot.appendChild(toolbar);
	}
	ensureToolbarChrome() {
		if (!this.toolbarContainer) return;
		if (this.toolbarViewSlot && this.toolbarThemeSlot) return;
		this.toolbarContainer.replaceChildren();
		this.toolbarContainer.style.display = "flex";
		this.toolbarContainer.style.alignItems = "center";
		this.toolbarContainer.style.justifyContent = "space-between";
		this.toolbarContainer.style.gap = "0.5rem";
		this.toolbarContainer.style.flexWrap = "wrap";
		const themeSlot = document.createElement("div");
		themeSlot.className = "shell-theme-controls";
		themeSlot.setAttribute("data-shell-toolbar-theme", "true");
		themeSlot.style.display = "inline-flex";
		themeSlot.style.alignItems = "center";
		themeSlot.style.gap = "0.35rem";
		const cycleBtn = document.createElement("button");
		cycleBtn.type = "button";
		cycleBtn.className = "app-shell__nav-btn shell-theme-cycle-btn";
		cycleBtn.setAttribute("aria-label", "Theme: follow system");
		cycleBtn.title = "Theme: follow system — click to pin dark or light, then click again to return to auto";
		const icon = document.createElement("ui-icon");
		icon.setAttribute("icon", "lamp");
		icon.setAttribute("icon-style", "duotone");
		cycleBtn.appendChild(icon);
		cycleBtn.addEventListener("click", () => {
			if (this.getThemeModeFromShellTheme() === "auto") {
				const eff = this.resolveEffectiveSystemScheme();
				this.applyThemeMode(eff === "light" ? "dark" : "light");
			} else this.applyThemeMode("auto");
		});
		themeSlot.append(cycleBtn);
		const viewSlot = document.createElement("div");
		viewSlot.className = "shell-view-toolbar-slot";
		viewSlot.setAttribute("data-shell-toolbar-view", "true");
		viewSlot.style.display = "inline-flex";
		viewSlot.style.alignItems = "center";
		viewSlot.style.gap = "0.5rem";
		viewSlot.style.flex = "1 1 auto";
		viewSlot.style.justifyContent = "flex-end";
		this.toolbarContainer.append(themeSlot, viewSlot);
		this.toolbarThemeSlot = themeSlot;
		this.toolbarViewSlot = viewSlot;
		this.themeCycleButton = cycleBtn;
		this.themeCycleIcon = icon;
		this.syncThemeToolbarControls();
	}
	getThemeModeFromShellTheme() {
		const theme = this.getThemeRefValue();
		const id = (theme?.id || "").toLowerCase();
		if (id === "dark" || theme?.colorScheme === "dark") return "dark";
		if (id === "light" || theme?.colorScheme === "light") return "light";
		return "auto";
	}
	resolveEffectiveSystemScheme() {
		return globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	}
	createShellTheme(mode) {
		if (mode === "dark") return {
			id: "dark",
			name: "Dark",
			colorScheme: "dark"
		};
		if (mode === "light") return {
			id: "light",
			name: "Light",
			colorScheme: "light"
		};
		return {
			id: "auto",
			name: "Auto",
			colorScheme: "auto"
		};
	}
	syncThemeToolbarControls() {
		const mode = this.getThemeModeFromShellTheme();
		const effectiveMode = mode === "auto" ? this.getExternalThemeModeHint() : mode;
		const iconEl = this.themeCycleIcon;
		const btn = this.themeCycleButton;
		if (!iconEl || !btn) return;
		const iconName = effectiveMode === "light" ? "sun-dim" : effectiveMode === "dark" ? "moon-stars" : "lamp";
		iconEl.setAttribute("icon", iconName);
		if (mode === "auto") {
			btn.title = "Theme: follow system — click to pin the opposite of the current appearance, then click again for auto";
			btn.setAttribute("aria-label", "Theme follows system. Activate to pin light or dark.");
		} else if (mode === "light") {
			btn.title = "Theme: light — click to follow system again";
			btn.setAttribute("aria-label", "Light theme is on. Activate to follow system appearance.");
		} else {
			btn.title = "Theme: dark — click to follow system again";
			btn.setAttribute("aria-label", "Dark theme is on. Activate to follow system appearance.");
		}
	}
	async applyThemeMode(mode) {
		this.setTheme(this.createShellTheme(mode));
		try {
			const current = await loadSettings();
			applyTheme(await saveSettings({
				...current,
				appearance: {
					...current.appearance || {},
					theme: mode
				}
			}));
		} catch (error) {
			console.warn(`[${this.id}] Failed to save theme mode:`, error);
		}
	}
	getExternalThemeModeHint() {
		const scheme = (document?.documentElement?.getAttribute?.("data-scheme") || "").toLowerCase();
		if (scheme === "light" || scheme === "dark") return scheme;
		return "auto";
	}
	bindThemeAttrObserver() {
		this.themeAttrObserver?.disconnect();
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		this.themeAttrObserver = new MutationObserver(() => {
			this.syncThemeToolbarControls();
		});
		this.themeAttrObserver.observe(root, {
			attributes: true,
			attributeFilter: ["data-scheme", "data-theme"]
		});
	}
	/**
	* Setup path-based navigation (listen to route-change events)
	* @deprecated Use setupPopstateNavigation instead
	*/
	setupHashNavigation() {}
	/**
	* Setup popstate navigation (back/forward buttons)
	*/
	setupPopstateNavigation() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		globalThis?.addEventListener?.("popstate", (event) => {
			const navToken = ++this.navigationToken;
			const fallbackView = this.getViewFromPathname();
			const viewId = event.state?.viewId || fallbackView || "home";
			const popParams = event.state?.params ?? Object.fromEntries(new URLSearchParams(globalThis.location.search || ""));
			if (viewId !== this.currentView.value || !this.sameRouteParams(popParams, this.navigationState.params)) {
				const previousViewId = this.navigationState.currentView;
				this.navigationState.previousView = previousViewId;
				this.navigationState.currentView = viewId;
				this.navigationState.params = popParams;
				this.currentView.value = viewId;
				const hist = this.navigationState.viewHistory;
				const idx = hist.lastIndexOf(viewId);
				if (idx >= 0) this.navigationState.viewHistory = hist.slice(0, idx + 1);
				else this.navigationState.viewHistory = [viewId];
				this.loadView(viewId, popParams).then((element) => {
					if (navToken !== this.navigationToken) return;
					return this.renderViewWithTransition(element);
				}).then(() => {
					if (navToken !== this.navigationToken) return;
					scheduleViewModulePrefetch(viewId);
				}).catch(console.error);
			}
		});
	}
	invokeCurrentViewOnShow() {
		const entry = this.loadedViews.get(this.currentView.value);
		if (!entry?.view?.lifecycle?.onShow) return;
		try {
			entry.view.lifecycle.onShow();
		} catch (error) {
			console.warn(`[${this.id}] View ${this.currentView.value} onShow error:`, error);
		}
	}
	/**
	* Get view ID from current pathname
	*/
	getViewFromPathname() {
		if (typeof window === "undefined" || typeof window == "undefined") return null;
		const pathname = globalThis?.location?.pathname?.replace(/^\//, "").toLowerCase();
		if (!pathname || pathname === "/") {
			const stateView = (globalThis?.history?.state)?.viewId;
			return stateView && isEnabledView(String(stateView)) ? stateView : null;
		}
		return isEnabledView(pathname) ? pathname : null;
	}
};
//#endregion
export { ShellBase as t };
