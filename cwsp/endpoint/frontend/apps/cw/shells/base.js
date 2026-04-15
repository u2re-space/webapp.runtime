import { Cn as registerComponent, Dt as ensureStyleSheet, H as showToast, K as applyTheme, On as unregisterHandler, St as __decorate, Un as loadInlineStyle, Wn as preloadStyle, Wt as dynamicTheme, _t as saveSettings, an as property, bt as MinimalShellHostElement, cn as H, gt as loadSettings, hn as ref, in as defineElement, q as syncBrowserChromeTheme, rn as GLitElement, wn as registerHandler, xn as initializeComponent, xt as ensureShellElementDefined } from "../com/app.js";
import "../com/service.js";
//#region src/frontend/shared/routing/view-message-routing.ts
var VIEW_MESSAGE_FALLBACKS = {
	viewer: [
		"content-view",
		"content-load",
		"markdown-content"
	],
	workcenter: [
		"content-attach",
		"file-attach",
		"share-target-input",
		"content-share"
	],
	explorer: [
		"file-save",
		"navigate-path",
		"content-explorer"
	],
	editor: ["content-load", "content-edit"],
	settings: ["settings-update"],
	history: ["history-update"],
	home: ["home-update"],
	airpad: ["content-load"],
	print: ["content-view"]
};
var inferViewDestination = (viewId) => {
	if (viewId === "viewer") return "viewer";
	if (viewId === "workcenter") return "workcenter";
	if (viewId === "explorer") return "explorer";
	if (viewId === "editor") return "editor";
	if (viewId === "settings") return "settings";
	if (viewId === "history") return "history";
	if (viewId === "print") return "print";
	if (viewId === "airpad") return "airpad";
	return viewId || "viewer";
};
var selectMessageTypeForView = (view, incomingType) => {
	const checks = [incomingType, ...VIEW_MESSAGE_FALLBACKS[view.id] || []];
	for (const type of checks) {
		if (!type) continue;
		if (!view.canHandleMessage || view.canHandleMessage(type)) return type;
	}
	return null;
};
var mapUnifiedMessageToView = (view, message) => {
	const selectedType = selectMessageTypeForView(view, message.type);
	if (!selectedType) return null;
	return {
		type: selectedType,
		data: message.data,
		metadata: message.metadata
	};
};
//#endregion
//#region src/frontend/shared/routing/channel-mixin.ts
function bindViewReceiveChannel(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const componentId = options.componentId || `view:${view.id}`;
	const handler = {
		canHandle: (message) => message.destination === destination,
		handle: async (message) => {
			const mapped = mapUnifiedMessageToView(view, message);
			if (!mapped) return;
			await view.handleMessage?.(mapped);
		}
	};
	registerComponent(componentId, destination);
	registerHandler(destination, handler);
	const pending = initializeComponent(componentId);
	if (pending.length > 0) for (const message of pending) handler.handle(message);
	return () => {
		unregisterHandler(destination, handler);
	};
}
//#endregion
//#region src/frontend/views/base/UIElement.ts
/**
* Compatibility adapter: current view implementations already satisfy `View`.
* Keep this function as the canonical registry hook for future host adapters.
*
* Important: `{ ...viewInstance }` does **not** copy class methods (`handleMessage`, etc.),
* which breaks unified-messaging registration (`bindViewReceiveChannel` requires
* `handleMessage`). Return the live instance; wrapping `render` was redundant.
*/
var createWebComponentViewAdapter = (view) => {
	return view;
};
var WINDOW_FRAME_TAG = "cw-window-frame";
var WindowFrameHostElement = class extends HTMLElement {
	titleEl = null;
	pidEl = null;
	dragHandle = null;
	resizeHandle = null;
	_initialized = false;
	connectedCallback() {
		if (this._initialized) return;
		this._initialized = true;
		const root = this.shadowRoot || this.attachShadow({ mode: "open" });
		root.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    overflow: visible;
                    user-select: none;
                    touch-action: none;
                    pointer-events: auto;
                    color-scheme: inherit;
                    --_size-x: calc(var(--initial-inline-size, 640px) + var(--resize-x, 0px));
                    --_size-y: calc(var(--initial-block-size, 480px) + var(--resize-y, 0px));
                    inset-inline-start: clamp(0px, var(--shift-x, 0px), calc(100% - var(--min-inline-size, 640px)));
                    inset-block-start: clamp(0px, var(--shift-y, 0px), calc(100% - var(--min-block-size, 480px)));
                    min-inline-size: var(--min-inline-size, 640px);
                    min-block-size: var(--min-block-size, 480px);
                    inline-size: clamp(var(--min-inline-size, 640px), var(--_size-x), calc(100% - var(--shift-x, 0px)));
                    block-size: clamp(var(--min-block-size, 480px), var(--_size-y), calc(100% - var(--shift-y, 0px)));
                    transform:
                        scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1))
                        translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0px);
                    transition: box-shadow 150ms ease;
                }
                :host(.is-maximized) {
                    inset-inline-start: 0 !important;
                    inset-block-start: 0 !important;
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    transform: none !important;
                    --frame-radius: 0;
                }
                @media (max-width: 900px) {
                    :host(:not(.is-maximized)) {
                        --shift-x: 0 !important;
                        --shift-y: 0 !important;
                        --drag-x: 0 !important;
                        --drag-y: 0 !important;
                        inset-inline-start: 0 !important;
                        inset-block-start: 0 !important;
                        inline-size: 100% !important;
                        block-size: 100% !important;
                        min-inline-size: 0;
                        min-block-size: 0;
                        transform: none !important;
                        --frame-radius: 0;
                    }
                }
                .frame {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 0%;
                    min-block-size: 0;
                    min-inline-size: 0;
                    border: 1px solid light-dark(rgba(0, 0, 0, .1), rgba(120, 140, 180, .18));
                    border-radius: var(--frame-radius, 14px);
                    background: light-dark(rgba(255, 255, 255, .92), rgba(14, 18, 28, .88));
                    color: light-dark(#1a1c2b, #edf2ff);
                    overflow: hidden;
                    box-shadow: light-dark(
                        0 8px 32px rgba(0, 0, 0, .08), 0 0 0 0.5px rgba(0, 0, 0, .06),
                        0 8px 32px rgba(0, 0, 0, .35), 0 0 0 0.5px rgba(255, 255, 255, .06)
                    );
                    backdrop-filter: blur(2px);
                }
                :host(.is-active) .frame {
                    border-color: light-dark(rgba(59, 125, 219, .22), rgba(139, 183, 255, .22));
                    box-shadow: light-dark(
                        0 12px 42px rgba(0, 0, 0, .12), 0 0 0 0.5px rgba(59, 125, 219, .15),
                        0 12px 42px rgba(0, 0, 0, .42), 0 0 0 0.5px rgba(139, 183, 255, .15)
                    );
                }
                :host(.is-maximized) .frame {
                    border-radius: 0;
                    border-color: transparent;
                }
                :host(.is-drop-target) .frame {
                    border-color: light-dark(rgba(59, 125, 219, .35), rgba(139, 183, 255, .35));
                    box-shadow:
                        0 0 0 1px light-dark(rgba(59, 125, 219, .2), rgba(139, 183, 255, .2)),
                        0 12px 42px light-dark(rgba(0, 0, 0, .12), rgba(0, 0, 0, .42));
                }
                .bar {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    gap: .4rem;
                    min-block-size: 36px;
                    padding: .3rem .6rem;
                    background: light-dark(rgba(245, 247, 252, .95), rgba(22, 28, 42, .7));
                    border-block-end: 1px solid light-dark(rgba(0, 0, 0, .06), rgba(255, 255, 255, .04));
                    user-select: none;
                    cursor: default;
                }
                .title {
                    flex: 1 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: .84rem;
                    font-weight: 500;
                    opacity: .88;
                }
                .pid {
                    font-size: .7rem;
                    opacity: .4;
                    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                }
                .btns { display: flex; gap: .15rem; }
                button {
                    border: 0;
                    border-radius: 6px;
                    padding: .22rem .42rem;
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    font-size: .82rem;
                    line-height: 1;
                    opacity: .5;
                    transition: opacity 100ms ease, background 100ms ease;
                }
                button:hover { background: light-dark(rgba(0, 0, 0, .06), rgba(255, 255, 255, .1)); opacity: 1; }
                button[data-window-action="popout"] { font-size: .76rem; }
                button[data-window-action="close"]:hover { background: rgba(220, 60, 60, .45); opacity: 1; }
                .content {
                    position: relative;
                    flex: 1 1 0%;
                    inline-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                ::slotted(*) {
                    flex: 1 1 0%;
                    box-sizing: border-box;
                    inline-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overflow: auto;
                }
                .resize {
                    position: absolute;
                    inline-size: 18px;
                    block-size: 18px;
                    inset: auto 0 0 auto;
                    cursor: nwse-resize;
                    opacity: .3;
                    z-index: 10;
                    background: linear-gradient(
                        135deg,
                        transparent 40%, currentColor 41%, currentColor 49%,
                        transparent 50%, transparent 60%,
                        currentColor 61%, currentColor 69%, transparent 70%
                    );
                    transition: opacity 120ms ease;
                }
                .resize:hover { opacity: .55; }
                :host(.is-maximized) .resize { display: none; }
            </style>
            <div class="frame">
                <div class="bar" data-drag-handle>
                    <span class="title" data-title></span>
                    <span class="pid" data-pid></span>
                    <span class="btns">
                        <button type="button" data-window-action="popout" title="Open in new tab">&#8599;</button>
                        <button type="button" data-window-action="minimize" title="Minimize">&minus;</button>
                        <button type="button" data-window-action="maximize" title="Maximize">&#9633;</button>
                        <button type="button" data-window-action="close" title="Close">&#10005;</button>
                    </span>
                </div>
                <div class="content">
                    <slot name="window-view"></slot>
                </div>
            </div>
            <span class="resize" data-resize-handle></span>
        `;
		this.titleEl = root.querySelector("[data-title]");
		this.pidEl = root.querySelector("[data-pid]");
		this.dragHandle = root.querySelector("[data-drag-handle]");
		this.resizeHandle = root.querySelector("[data-resize-handle]");
		root.querySelectorAll("[data-window-action]").forEach((button) => {
			button.addEventListener("click", (event) => {
				const action = event.currentTarget.dataset.windowAction || "";
				this.dispatchEvent(new CustomEvent("window-action", {
					detail: { action },
					bubbles: true
				}));
			});
		});
		this.setTitle(this.getAttribute("data-title") || this.getAttribute("title") || "Window");
		this.setPidLabel(this.getAttribute("data-pid") || "");
	}
	setTitle(title) {
		if (this.titleEl) this.titleEl.textContent = title;
	}
	setPidLabel(pid) {
		if (this.pidEl) this.pidEl.textContent = pid ? `#${pid}` : "";
	}
	getDragHandle() {
		return this.dragHandle;
	}
	getResizeHandle() {
		return this.resizeHandle;
	}
};
var ensureDefined = (tagName, ctor) => {
	if (typeof customElements === "undefined") return;
	if (!customElements?.get?.(tagName)) customElements?.define?.(tagName, ctor);
};
var ensureWindowFrameElementDefined = () => {
	ensureDefined(WINDOW_FRAME_TAG, WindowFrameHostElement);
	return WINDOW_FRAME_TAG;
};
var BaseElement = class BaseElement extends GLitElement(HTMLElement) {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor(options = {}) {
		super(options);
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], BaseElement.prototype, "theme", void 0);
BaseElement = __decorate([defineElement("cw-base-element")], BaseElement);
ensureWindowFrameElementDefined();
var DEFAULT_VIEW_ID = "viewer";
var VIEW_FLAGS = {
	viewer: true,
	editor: true,
	workcenter: true,
	explorer: true,
	airpad: true,
	settings: true,
	history: true,
	home: true,
	print: true
};
var ENABLED_VIEW_IDS = Object.entries(VIEW_FLAGS).filter(([, enabled]) => Boolean(enabled)).map(([viewId]) => viewId);
var isEnabledView = (viewId) => {
	return Boolean(VIEW_FLAGS[viewId]);
};
var pickEnabledView = (preferred = DEFAULT_VIEW_ID, fallback = DEFAULT_VIEW_ID) => {
	if (isEnabledView(preferred)) return preferred;
	if (isEnabledView(fallback)) return fallback;
	if (ENABLED_VIEW_IDS.length > 0) return ENABLED_VIEW_IDS[0];
	return "viewer";
};
//#endregion
//#region src/frontend/shared/routing/registry.ts
/**
* Registry for shell components
*/
var ShellRegistryClass = class {
	shells = /* @__PURE__ */ new Map();
	loadedShells = /* @__PURE__ */ new Map();
	/**
	* Register a shell
	*/
	register(registration) {
		this.shells.set(registration.id, registration);
	}
	/**
	* Get a shell registration
	*/
	get(id) {
		return this.shells.get(id);
	}
	/**
	* Get all registered shells
	*/
	getAll() {
		return Array.from(this.shells.values());
	}
	/**
	* Load and instantiate a shell
	*/
	async load(id, container) {
		const cached = this.loadedShells.get(id);
		if (cached) return cached;
		const registration = this.shells.get(id);
		if (!registration) throw new Error(`Shell not found: ${id}`);
		const module = await registration.loader();
		const factory = module.default || module.createShell;
		if (typeof factory !== "function") throw new Error(`Invalid shell module: ${id}`);
		const shell = factory(container);
		this.loadedShells.set(id, shell);
		return shell;
	}
	/**
	* Unload a shell
	*/
	unload(id) {
		const shell = this.loadedShells.get(id);
		if (shell) {
			shell.unmount();
			this.loadedShells.delete(id);
		}
	}
	/**
	* Check if a shell is loaded
	*/
	isLoaded(id) {
		return this.loadedShells.has(id);
	}
	/**
	* Get a loaded shell instance
	*/
	getLoaded(id) {
		return this.loadedShells.get(id);
	}
};
var ShellRegistry = new ShellRegistryClass();
/**
* Registry for view components
*/
var ViewRegistryClass = class {
	resolveViewFactory(module) {
		const candidates = [
			module?.default,
			module?.createView,
			module?.createAirpadView,
			module?.createWorkCenterView,
			module?.createViewerView,
			module?.createExplorerView,
			module?.createSettingsView,
			module?.createHistoryView
		];
		for (const candidate of candidates) if (typeof candidate === "function") return candidate;
		const values = Object.values(module || {});
		for (const value of values) if (typeof value === "function" && value.prototype && typeof value.prototype.render === "function") {
			const ViewClass = value;
			return (options) => new ViewClass(options);
		}
		return null;
	}
	views = /* @__PURE__ */ new Map();
	loadedViews = /* @__PURE__ */ new Map();
	viewReceiveCleanup = /* @__PURE__ */ new Map();
	/**
	* Register a view
	*/
	register(registration) {
		this.views.set(registration.id, registration);
	}
	/**
	* Get a view registration
	*/
	get(id) {
		return this.views.get(id);
	}
	/**
	* Get all registered views
	*/
	getAll() {
		return Array.from(this.views.values());
	}
	/**
	* Load and instantiate a view
	*/
	async load(id, options) {
		const cached = this.loadedViews.get(id);
		if (cached) return cached;
		const registration = this.views.get(id);
		if (!registration) throw new Error(`View not found: ${id}`);
		const module = await registration.loader();
		const factory = this.resolveViewFactory(module);
		if (!factory) throw new Error(`Invalid view module: ${id}`);
		const view = createWebComponentViewAdapter(await factory(options));
		const previousCleanup = this.viewReceiveCleanup.get(id);
		if (previousCleanup) {
			previousCleanup();
			this.viewReceiveCleanup.delete(id);
		}
		this.loadedViews.set(id, view);
		this.viewReceiveCleanup.set(id, bindViewReceiveChannel(view, {
			destination: String(id),
			componentId: `view:${id}`
		}));
		return view;
	}
	/**
	* Unload a view (clear cache)
	*/
	unload(id) {
		const view = this.loadedViews.get(id);
		if (view?.lifecycle?.onUnmount) view.lifecycle.onUnmount();
		const receiveCleanup = this.viewReceiveCleanup.get(id);
		if (receiveCleanup) {
			receiveCleanup();
			this.viewReceiveCleanup.delete(id);
		}
		this.loadedViews.delete(id);
	}
	/**
	* Check if a view is loaded
	*/
	isLoaded(id) {
		return this.loadedViews.has(id);
	}
	/**
	* Get a loaded view instance
	*/
	getLoaded(id) {
		return this.loadedViews.get(id);
	}
	/**
	* Warm the dynamic import for a view module (no instance, no receive-channel bind).
	* Safe to call from idle prefetch; failures are ignored.
	*/
	prefetchModule(id) {
		const registration = this.views.get(id);
		if (!registration) return;
		registration.loader().catch(() => {});
	}
};
var ViewRegistry = new ViewRegistryClass();
/**
* Register default shells
*/
function registerDefaultShells() {
	ShellRegistry.register({
		id: "base",
		name: "Base",
		description: "Base shell with no frames or navigation",
		loader: () => import("../chunks/base.js")
	});
	ShellRegistry.register({
		id: "minimal",
		name: "Minimal",
		description: "Minimal toolbar-based navigation",
		loader: () => import("../chunks/preview.js")
	});
	ShellRegistry.register({
		id: "window",
		name: "Window",
		description: "Desktop-like multi-window shell",
		loader: () => import("../chunks/window.js")
	});
	ShellRegistry.register({
		id: "tabbed",
		name: "Tabbed",
		description: "Tabbed window variant for focused multi-tasking",
		loader: () => import("../chunks/tabbed.js")
	});
	ShellRegistry.register({
		id: "environment",
		name: "Environment",
		description: "Desktop/webtop environment shell",
		loader: () => import("../chunks/environment.js")
	});
	ShellRegistry.register({
		id: "content",
		name: "Content",
		description: "CRX content shell with overlay-focused layering",
		loader: () => import("../chunks/content.js")
	});
	ShellRegistry.register({
		id: "faint",
		name: "Faint (legacy)",
		description: "Legacy alias redirected to tabbed shell",
		loader: () => import("../chunks/tabbed.js")
	});
}
/**
* Register default views
*/
function registerDefaultViews() {
	ViewRegistry.register({
		id: "viewer",
		name: "Viewer",
		icon: "eye",
		loader: () => import("../chunks/viewer.js")
	});
	ViewRegistry.register({
		id: "workcenter",
		name: "Work Center",
		icon: "lightning",
		loader: () => import("../chunks/workcenter2.js")
	});
	ViewRegistry.register({
		id: "settings",
		name: "Settings",
		icon: "gear",
		loader: () => import("../chunks/settings.js")
	});
	ViewRegistry.register({
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise",
		loader: () => import("../chunks/history.js")
	});
	ViewRegistry.register({
		id: "explorer",
		name: "Explorer",
		icon: "folder",
		loader: () => import("../chunks/explorer.js")
	});
	ViewRegistry.register({
		id: "airpad",
		name: "Airpad",
		icon: "hand-pointing",
		loader: () => import("../chunks/airpad.js")
	});
	ViewRegistry.register({
		id: "editor",
		name: "Editor",
		icon: "pencil",
		loader: () => import("../chunks/editor.js")
	});
	ViewRegistry.register({
		id: "home",
		name: "Home",
		icon: "house",
		loader: () => import("../chunks/outdated.js")
	});
	ViewRegistry.register({
		id: "print",
		name: "Print",
		icon: "printer",
		loader: () => import("./print-index.js").then((n) => n.t)
	});
}
var defaultTheme = {
	id: "auto",
	name: "Auto",
	colorScheme: "auto"
};
var lightTheme = {
	id: "light",
	name: "Light",
	colorScheme: "light"
};
var darkTheme = {
	id: "dark",
	name: "Dark",
	colorScheme: "dark"
};
/**
* Initialize registries with default shells and views
*/
function initializeRegistries() {
	registerDefaultShells();
	registerDefaultViews();
}
//#endregion
//#region src/frontend/shells/boot/ts/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
var LAST_ACTIVE_MAX_MS = 720 * 60 * 60 * 1e3;
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content") return shell;
	return "minimal";
}
/**
* Treat narrow and coarse-pointer layouts as “mobile shell” — prefer minimal shell there.
*/
function isMobileBootShellViewport() {
	if (typeof globalThis.matchMedia !== "function") return false;
	try {
		const narrow = globalThis.matchMedia("(max-width: 768px)").matches;
		const coarse = globalThis.matchMedia("(pointer: coarse)").matches;
		const coarseTablet = globalThis.matchMedia("(max-width: 1024px)").matches;
		return narrow || coarse && coarseTablet;
	} catch {
		return false;
	}
}
/** Experimental environment shell is not the default on mobile / small screens. */
function coerceShellForBootViewport(shell) {
	if (!isMobileBootShellViewport()) return shell;
	if (shell === "environment") return "minimal";
	return shell;
}
function readLastActiveBootShell() {
	try {
		const raw = globalThis.localStorage?.getItem(LS_BOOT_SHELL_LAST_ACTIVE);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.t !== "number" || typeof parsed.shell !== "string") return null;
		if (Date.now() - parsed.t > LAST_ACTIVE_MAX_MS) return null;
		return normalizeBootShellId(parsed.shell);
	} catch {
		return null;
	}
}
function recordBootShellWindowActivity(shellId) {
	try {
		const payload = {
			shell: normalizeBootShellId(shellId),
			t: Date.now()
		};
		globalThis.localStorage?.setItem(LS_BOOT_SHELL_LAST_ACTIVE, JSON.stringify(payload));
	} catch {}
}
/**
* Track this tab/window as the last-used shell context (focus + pointer).
* Returns a dispose function for unmount.
*/
function initBootShellWindowActivity(shellId) {
	const shell = normalizeBootShellId(shellId);
	const onWinFocus = () => recordBootShellWindowActivity(shell);
	const onPointer = () => recordBootShellWindowActivity(shell);
	const w = globalThis;
	w.addEventListener("focus", onWinFocus);
	w.addEventListener("pointerdown", onPointer, {
		capture: true,
		passive: true
	});
	queueMicrotask(() => recordBootShellWindowActivity(shell));
	return () => {
		w.removeEventListener("focus", onWinFocus);
		w.removeEventListener("pointerdown", onPointer, { capture: true });
	};
}
//#endregion
//#region src/frontend/views/views.scss?inline
var views_default = "@layer layer.view.common, layer.view.viewer;@layer layer.view.common{:where([data-cw-view-host=true]){block-size:100%;display:block;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer layer.view.viewer{.cw-view-viewer-shell,.view-viewer{background:var(--view-bg,var(--color-surface,light-dark(#f4f6fa,#060d17)));block-size:100%;color:var(--view-fg,var(--color-on-surface,light-dark(#1a1a1a,#e5e7eb)));display:grid;grid-template-rows:[toolbar-row] max-content [content-row] minmax(0,1fr);inline-size:100%;min-block-size:0;min-inline-size:0}.view-viewer__toolbar{align-items:center;background:var(--view-toolbar-bg,light-dark(color-mix(in oklab,var(--color-surface-container,#e2e8f0) 88%,transparent),color-mix(in oklab,var(--color-surface-container,#0f1a2b) 88%,transparent)));border-block-end:1px solid var(--view-border,color-mix(in oklab,var(--color-outline-variant,light-dark(#94a3b8,#334155)) 70%,transparent));box-sizing:border-box;display:flex;gap:.5rem;grid-row:toolbar-row;justify-content:space-between;min-inline-size:100%;padding:.4rem .55rem}.view-viewer__toolbar-left,.view-viewer__toolbar-right{align-items:center;display:inline-flex;gap:.4rem;min-inline-size:0}.view-viewer__toolbar-center{align-items:center;display:flex;flex:1 1 auto;justify-content:center;min-inline-size:0;padding-inline:.35rem;pointer-events:none}.view-viewer__toolbar-title{color:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 88%,transparent);display:block;font-size:.8125rem;font-weight:500;line-height:1.25;max-inline-size:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap}.view-viewer__toolbar-title:empty{display:none}.view-viewer__toolbar-group{align-items:center;display:inline-flex;gap:.25rem;min-inline-size:0}.view-viewer__btn{align-items:center;background:color-mix(in oklab,var(--color-surface-container-high,light-dark(#e2e8f0,#1f2937)) 62%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,light-dark(#cbd5e1,#334155)) 70%,transparent);border-radius:.48rem;color:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 82%,transparent);cursor:pointer;display:inline-flex;font:inherit;font-size:.78rem;gap:.3rem;line-height:1;padding:.28rem .45rem;white-space:nowrap}.view-viewer__btn:hover{background:color-mix(in oklab,var(--color-surface-container-high,light-dark(#cbd5e1,#334155)) 82%,transparent);color:var(--color-on-surface,light-dark(#0f172a,#f8fafc))}.view-viewer__toolbar-icon{block-size:1rem;inline-size:1rem}.view-viewer__content{grid-row:content-row;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;position:relative}}";
//#endregion
//#region src/frontend/shells/base/base.scss?inline
var base_default = "@layer shell.tokens, shell.base, shell.components, shell.utilities, shell.overrides;@layer shell.tokens{:root:has(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]),:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]){color-scheme:light dark;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high));--shell-nav-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-border:light-dark(var(--color-outline-variant),var(--color-outline-variant));--shell-btn-hover:light-dark(var(--color-surface-container),var(--color-surface-container));--shell-btn-active-bg:light-dark(var(--color-surface-container-low),var(--color-surface-container-low));--shell-btn-active-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-status-bg:light-dark(var(--color-surface-container-low),var(--color-surface-container-low));--shell-status-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-height:var(--shell-nav-height-base,48px);--shell-sidebar-width:0;--shell-status-height:24px;--shell-padding:0}:is(:root,html):has([data-shell=base][data-theme=dark]){--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high));--shell-nav-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-border:light-dark(var(--color-outline-variant),var(--color-outline-variant))}:host:has(>.app-shell){align-self:stretch;block-size:100%;display:block;inline-size:100%;justify-self:stretch;min-block-size:0;min-inline-size:0;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface))}:host([data-theme=dark]):has(>.app-shell){--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface)}}@layer shell.base{:host:has(>.app-shell){background-color:var(--shell-bg)}:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]){align-items:stretch;background:var(--color-background);background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);color-scheme:light dark;contain:layout style;display:flex;flex-direction:column;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,BlinkMacSystemFont,sans-serif;gap:0;inline-size:stretch;inset:0;justify-content:flex-start;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:absolute;-webkit-tap-highlight-color:transparent;border-radius:0;transition:background-color .2s ease,color .2s ease}:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw])[data-theme=light]{color-scheme:light}:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw])[data-theme=dark]{color-scheme:dark}@media print{:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]){display:contents!important}}}@layer shell.components{:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]) .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid rgba(128,128,128,.2);border-radius:50%;border-top:3px solid var(--shell-btn-active-fg);inline-size:32px}:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]) slot{display:contents!important}.app-shell__viewport{align-self:stretch;flex:1 1 0;isolation:isolate;min-block-size:0;min-inline-size:0;overflow:hidden;position:relative}.app-shell__content{block-size:stretch;border-radius:0;container-type:size;display:flex;flex-direction:column;inline-size:stretch;inset:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;position:absolute;scrollbar-color:rgba(128,128,128,.4) transparent;scrollbar-width:thin}.app-shell__content>*{flex:1 1 auto;min-block-size:0;min-inline-size:0}.app-shell__content::-webkit-scrollbar{inline-size:8px}.app-shell__content::-webkit-scrollbar-track{background:transparent}.app-shell__content::-webkit-scrollbar-thumb{background-color:rgba(128,128,128,.4);border-radius:4px}.app-shell__overlays{inset:0;overflow:visible;pointer-events:none;position:absolute;z-index:3}.app-shell__overlays>*{pointer-events:auto}.app-shell__status{animation:b .2s ease-out;background-color:var(--shell-status-bg);border-radius:var(--radius-lg,8px);box-shadow:var(--elev-3,0 4px 12px rgba(0,0,0,.15));color:var(--shell-status-fg);font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);inset-block-end:var(--space-2xl,1.5rem);inset-inline-start:50%;padding:var(--space-md,.75rem) var(--space-xl,1.5rem);position:fixed;transform:translateX(-50%);z-index:2}.app-shell__status:empty,.app-shell__status[hidden]{display:none}.app-shell__loading{align-items:center;background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);display:flex;flex-direction:column;gap:var(--space-lg,1rem);inline-size:stretch;inset:0;justify-content:center;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;padding:var(--space-2xl,2rem);position:absolute;z-index:1}.app-shell__loading[hidden]{display:none!important}.app-shell__loading .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid var(--color-outline-variant);border-radius:50%;border-top-color:var(--color-primary);inline-size:32px}}@layer shell.utilities{@keyframes a{to{transform:rotate(1turn)}}@keyframes b{0%{opacity:0;transform:translate(-50%,.5rem)}to{opacity:1;transform:translate(-50%)}}}@layer shell.overrides{@media (max-width:480px){:where(.app-shell,.app-shell[data-style=base],.app-shell[data-style=raw]){--shell-nav-height:48px}}@media print{.app-shell{background:white;color:black;contain:none;overflow:visible}.app-shell,.app-shell__viewport{display:contents!important}.app-shell__overlays{display:none!important}.app-shell__content{contain:none;display:contents!important;overflow:visible;position:static!important}}@media print{.app-shell__content::-webkit-scrollbar{display:none}.app-shell__content>[data-view]{block-size:auto!important;inline-size:auto!important;inset:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.cw-view-viewer-shell,.cw-view-viewer__prose,.markdown-body,.markdown-viewer-content,.result-content,[data-cw-view-host=true],[data-cw-view-host=true]>.cw-view-element__mount,[data-cw-viewer-prose],markdown-viewer,md-view{block-size:auto!important;contain:none!important;container-type:normal!important;max-block-size:none!important;overflow:visible!important}}:is(html,body):has([data-shell=base]){--shell-nav-height:0;--shell-content-padding:0;--shell-sidebar-width:0;--shell-status-height:0;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface))}:root:has(.app-shell) .app-shell{background-color:var(--shell-bg,var(--color-surface,#ffffff));color:var(--shell-fg,var(--color-on-surface,#1a1a1a));display:flex;flex-direction:column;inset:0;position:absolute;transition:background-color .2s ease,color .2s ease}.app-shell__content{scroll-behavior:smooth;scrollbar-color:var(--shell-scrollbar,rgba(128,128,128,.3)) transparent}.app-shell__content::-webkit-scrollbar{inline-size:6px}.app-shell__content::-webkit-scrollbar-thumb{background-color:var(--shell-scrollbar,rgba(128,128,128,.3));border-radius:3px}.app-shell__status{animation:b .2s ease-out;background-color:var(--shell-status-bg,rgba(0,0,0,.8));border-radius:8px;color:var(--shell-status-fg,#ffffff);font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:.875rem;inset-block-end:1rem;inset-inline-start:50%;padding:.75rem 1.5rem;position:fixed;transform:translateX(-50%);z-index:2}.app-shell__status:empty,.app-shell__status[hidden]{display:none}}";
//#endregion
//#region src/frontend/shared/routing/view-transitions.ts
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
//#region src/frontend/shared/routing/view-prefetch.ts
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
//#region src/frontend/shells/shells.ts
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
		if (shellHost instanceof MinimalShellHostElement && shellHost.shadowRoot) {
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
			const isPathRoutedShell = this.id === "base" || this.id === "minimal";
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
//#region src/frontend/shells/base/index.ts
/**
* Base Shell
*
* Base shell with no frames, navigation UI, or chrome.
* Just a content container with theme support.
*
* Use cases:
* - Fullscreen views
* - Print layouts
* - Embedded views
* - Single-component rendering
*/
var BaseShell = class extends ShellBase {
	id = "base";
	name = "Base";
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: false,
		supportsWindowing: false
	};
	wcoGeometryHandler = null;
	wcoResizeHandler = null;
	createLayout() {
		return H`
            <div class="app-shell" data-shell="base" data-style="base">
                <div class="app-shell__viewport">
                    <main class="app-shell__content" data-shell-content role="main">
                        <div class="app-shell__loading">
                            <div class="loading-spinner"></div>
                            <span>Loading...</span>
                        </div>
                    </main>
                    <div class="app-shell__overlays" data-shell-overlays></div>
                </div>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;
	}
	getStylesheet() {
		return base_default;
	}
	/**
	* Theme lives on `cw-shell-*` in `applyTheme`; inner `.app-shell` needs the same `data-theme`
	* so shell SCSS `&[data-theme="light"|"dark"]` and token rules apply (matches MinimalShell).
	*/
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-shell");
		if (inner) inner.dataset.theme = this.resolveShellColorScheme(theme);
		super.applyTheme(theme);
	}
	/**
	* Match MinimalShell: assign `slot="view"` and append the view to the shell host (light DOM).
	* Document-level view CSS (`views.scss`, adopted view sheets) does not pierce shadow roots; views
	* must not live only under `.app-shell__content` inside the shadow tree.
	*/
	renderView(element) {
		if (!this.contentContainer || !this.rootElement) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.rootElement.contains(prev.element)) prev.element.remove();
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		element.slot = "view";
		if (!this.rootElement.contains(element)) this.rootElement.appendChild(element);
		const loading = this.contentContainer.querySelector(".app-shell__loading");
		if (loading) loading.hidden = true;
		this.currentViewElement = element;
	}
	async mount(container) {
		await super.mount(container);
		this.setupHashNavigation();
		this.setupPopstateNavigation();
		this.bindWindowControlsOverlay();
	}
	unmount() {
		this.unbindWindowControlsOverlay();
		super.unmount();
	}
	bindWindowControlsOverlay() {
		const overlay = (globalThis?.navigator || {})?.windowControlsOverlay;
		const host = this.rootElement;
		if (!host || !overlay) return;
		const update = () => {
			const isVisible = Boolean(overlay?.visible);
			host.setAttribute("data-wco-visible", isVisible ? "true" : "false");
			const rect = overlay?.getTitlebarAreaRect?.();
			if (isVisible && rect) {
				host.style.setProperty("--wco-titlebar-x", `${Math.max(0, Number(rect.x) || 0)}px`);
				host.style.setProperty("--wco-titlebar-y", `${Math.max(0, Number(rect.y) || 0)}px`);
				host.style.setProperty("--wco-titlebar-width", `${Math.max(0, Number(rect.width) || 0)}px`);
				host.style.setProperty("--wco-titlebar-height", `${Math.max(0, Number(rect.height) || 0)}px`);
			} else {
				host.style.setProperty("--wco-titlebar-x", "0px");
				host.style.setProperty("--wco-titlebar-y", "0px");
				host.style.setProperty("--wco-titlebar-width", "0px");
				host.style.setProperty("--wco-titlebar-height", "0px");
			}
		};
		this.wcoGeometryHandler = () => update();
		this.wcoResizeHandler = () => update();
		try {
			overlay?.addEventListener?.("geometrychange", this.wcoGeometryHandler);
		} catch {}
		globalThis?.addEventListener?.("resize", this.wcoResizeHandler);
		update();
	}
	unbindWindowControlsOverlay() {
		const overlay = (globalThis?.navigator || {})?.windowControlsOverlay;
		if (overlay && this.wcoGeometryHandler) try {
			overlay?.removeEventListener?.("geometrychange", this.wcoGeometryHandler);
		} catch {}
		if (this.wcoResizeHandler) globalThis?.removeEventListener?.("resize", this.wcoResizeHandler);
		this.wcoGeometryHandler = null;
		this.wcoResizeHandler = null;
	}
};
/**
* Create a base shell instance
*/
function createShell(_container) {
	return new BaseShell();
}
//#endregion
export { DEFAULT_VIEW_ID as _, LS_BOOT_SHELL_LAST_ACTIVE as a, pickEnabledView as b, readLastActiveBootShell as c, darkTheme as d, defaultTheme as f, registerDefaultViews as g, registerDefaultShells as h, views_default as i, ShellRegistry as l, lightTheme as m, createShell as n, coerceShellForBootViewport as o, initializeRegistries as p, ShellBase as r, normalizeBootShellId as s, BaseShell as t, ViewRegistry as u, ENABLED_VIEW_IDS as v, isEnabledView as y };
