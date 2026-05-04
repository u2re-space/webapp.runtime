import { t as createServiceChannelManager } from "../fest/uniform.js";
import { a as COMPONENTS, c as ROUTE_HASHES, d as getDestinationAliases, f as matchesDestination, h as viewBroadcastChannelName, i as BROADCAST_CHANNELS, m as normalizeViewId, n as toUnifiedInteropMessage, p as normalizeDestination } from "./UniformInterop.js";
import { a as initializeComponent, c as registerHandler, d as sendProtocolMessage, l as replayQueuedMessagesForDestination, p as unregisterHandler, r as enqueuePendingMessage, s as registerComponent } from "./UnifiedMessaging.js";
import "./ShareTargetGateway.js";
import "./Settings.js";
import { n as applyGridSettings } from "./StateStorage.js";
//#region ../../modules/projects/subsystem/src/routing/channel/ServiceChannels.ts
/**
* Service Channels for CrossWord
* Extends fest/uniform ServiceChannelManager with app-specific configuration
*/
var SERVICE_CHANNEL_CONFIG = {
	workcenter: {
		broadcastName: BROADCAST_CHANNELS.WORK_CENTER,
		routeHash: ROUTE_HASHES.WORKCENTER,
		component: COMPONENTS.WORK_CENTER,
		description: "AI work center for processing files and content"
	},
	settings: {
		broadcastName: BROADCAST_CHANNELS.SETTINGS,
		routeHash: ROUTE_HASHES.SETTINGS,
		component: COMPONENTS.SETTINGS,
		description: "Application settings and configuration"
	},
	viewer: {
		broadcastName: BROADCAST_CHANNELS.MARKDOWN_VIEWER,
		routeHash: ROUTE_HASHES.MARKDOWN_VIEWER,
		component: COMPONENTS.MARKDOWN_VIEWER,
		description: "Content viewer for markdown and files"
	},
	explorer: {
		broadcastName: BROADCAST_CHANNELS.FILE_EXPLORER,
		routeHash: ROUTE_HASHES.FILE_EXPLORER,
		component: COMPONENTS.FILE_EXPLORER,
		description: "File explorer and browser"
	},
	airpad: {
		broadcastName: "rs-airpad",
		routeHash: "#airpad",
		component: "airpad",
		description: "Touch-friendly input pad"
	},
	print: {
		broadcastName: BROADCAST_CHANNELS.PRINT_CHANNEL,
		routeHash: ROUTE_HASHES.PRINT,
		component: COMPONENTS.BASIC_PRINT,
		description: "Print preview and export"
	},
	history: {
		broadcastName: BROADCAST_CHANNELS.HISTORY_CHANNEL,
		routeHash: ROUTE_HASHES.HISTORY,
		component: COMPONENTS.HISTORY,
		description: "Action history and undo/redo"
	},
	editor: {
		broadcastName: "rs-editor",
		routeHash: ROUTE_HASHES.MARKDOWN_EDITOR,
		component: COMPONENTS.MARKDOWN_EDITOR,
		description: "Content editor"
	},
	home: {
		broadcastName: "rs-home",
		routeHash: "#home",
		component: "home",
		description: "Home/landing view"
	}
};
var appServiceChannelManager = null;
/**
* Get the app-configured ServiceChannelManager
*/
function getServiceChannels() {
	if (!appServiceChannelManager) appServiceChannelManager = createServiceChannelManager({
		channels: SERVICE_CHANNEL_CONFIG,
		logPrefix: "[ServiceChannels]"
	});
	return appServiceChannelManager;
}
var serviceChannels = getServiceChannels();
//#endregion
//#region src/shared/routing/core/view-message-routing.ts
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
	return normalizeViewId(viewId);
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
//#region src/shared/routing/core/view-api.ts
/**
* View-scoped POST API + BroadcastChannel bridge.
* - Production: service worker intercepts POST /{view} and fans out to clients.
* - Dev (no SW): Vite middleware returns devRelay JSON; this module posts to rs-view-* locally.
*/
function subscribeViewChannel(viewId, handler) {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const bc = new BroadcastChannel(viewBroadcastChannelName(normalizeViewId(viewId)));
	bc.addEventListener("message", handler);
	return () => {
		bc.removeEventListener("message", handler);
		bc.close();
	};
}
//#endregion
//#region src/shared/routing/core/channel-mixin.ts
var deliverUnifiedMessageToView = async (view, message) => {
	const mapped = mapUnifiedMessageToView(view, message);
	if (!mapped) return;
	await view.handleMessage?.(mapped);
};
function bindViewReceiveChannel(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const componentId = options.componentId || `view:${view.id}`;
	const receiveDestinations = getDestinationAliases(destination);
	const handler = {
		canHandle: (message) => matchesDestination(message.destination, destination),
		handle: async (message) => {
			await deliverUnifiedMessageToView(view, message);
		}
	};
	const pendingSeen = /* @__PURE__ */ new Set();
	for (const alias of receiveDestinations) {
		const aliasComponentId = `${componentId}:${alias}`;
		registerComponent(aliasComponentId, alias);
		registerHandler(alias, handler);
		const pending = initializeComponent(aliasComponentId);
		if (pending.length > 0) for (const message of pending) {
			if (pendingSeen.has(message.id)) continue;
			pendingSeen.add(message.id);
			handler.handle(message);
		}
	}
	const viewChannelCleanup = subscribeViewChannel(normalizeViewId(destination), (event) => {
		const payload = event.data;
		if (!payload || typeof payload !== "object") return;
		if (payload.type === "view-transfer" && payload.message && typeof payload.message === "object") {
			deliverUnifiedMessageToView(view, toUnifiedInteropMessage(payload.message));
			return;
		}
		if (payload.type === "view-post") {
			const viewId = normalizeViewId(payload.viewId);
			if (viewId !== normalizeViewId(String(view.id || destination))) return;
			view.handleMessage?.({
				type: "view-post",
				data: {
					bodyText: String(payload.bodyText || ""),
					contentType: String(payload.contentType || ""),
					viewId
				},
				metadata: {
					source: "view-channel",
					destination: viewId
				}
			});
		}
	});
	return () => {
		for (const alias of receiveDestinations) unregisterHandler(alias, handler);
		viewChannelCleanup();
	};
}
//#endregion
//#region src/shared/routing/core/implicit-view-bridge.ts
/** Narrow structural check — imperative APIs (`handleMessage`, `addFiles`, …) stay on the element. */
function isImplicitViewMessagingHost(node) {
	if (!node || typeof node !== "object") return false;
	const el = node;
	return typeof el.handleMessage === "function" && typeof el.id === "string" && el.id.trim().length > 0;
}
var STAGED_UNIFIED_SELECTOR = "[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]";
function parseJsonObject(raw) {
	if (!raw?.trim()) return null;
	try {
		const v = JSON.parse(raw);
		return v && typeof v === "object" ? v : null;
	} catch {
		return null;
	}
}
function buildUnifiedMessageFromStaging(rec) {
	const destination = normalizeDestination(String(rec.destination ?? "")) || String(rec.destination ?? "").trim();
	if (!destination) return null;
	return {
		id: typeof rec.id === "string" ? rec.id : crypto.randomUUID(),
		type: String(rec.type || "content-share"),
		source: typeof rec.source === "string" ? rec.source : "dom-staged-unified",
		destination,
		contentType: typeof rec.contentType === "string" ? rec.contentType : void 0,
		data: rec.data ?? rec.payload ?? {},
		metadata: {
			timestamp: Date.now(),
			...typeof rec.metadata === "object" && rec.metadata ? rec.metadata : {}
		}
	};
}
function readDeferFlushDestination(el) {
	const raw = el.getAttribute("data-cw-unified-defer-flush");
	if (!raw?.trim()) return null;
	const trimmed = raw.trim();
	if (trimmed.startsWith("{")) {
		const d = parseJsonObject(trimmed)?.destination;
		return typeof d === "string" ? d : null;
	}
	return trimmed;
}
function consumeDeferFlush(el) {
	const destRaw = readDeferFlushDestination(el);
	if (!destRaw) return;
	replayQueuedMessagesForDestination(normalizeDestination(destRaw) || normalizeViewId(destRaw)).catch(() => void 0);
	el.removeAttribute("data-cw-unified-defer-flush");
}
function consumePending(el) {
	const rec = parseJsonObject(el.getAttribute("data-cw-unified-pending"));
	if (!rec) return;
	const msg = buildUnifiedMessageFromStaging(rec);
	if (!msg?.destination) return;
	enqueuePendingMessage(msg.destination, msg);
	el.removeAttribute("data-cw-unified-pending");
}
function consumeMail(el) {
	const rec = parseJsonObject(el.getAttribute("data-cw-unified-mail"));
	if (!rec) return;
	const destination = normalizeDestination(String(rec.destination || "")) || String(rec.destination || "").trim();
	if (!destination) return;
	sendProtocolMessage({
		type: String(rec.type || "dispatch"),
		destination,
		source: typeof rec.source === "string" ? rec.source : "dom-staged-mail",
		data: rec.data ?? rec.payload ?? {},
		contentType: typeof rec.contentType === "string" ? rec.contentType : void 0,
		metadata: typeof rec.metadata === "object" && rec.metadata ? rec.metadata : {},
		purpose: Array.isArray(rec.purpose) ? rec.purpose : typeof rec.purpose === "string" ? [rec.purpose] : ["mail", "deliver"],
		op: typeof rec.op === "string" ? rec.op : "deliver",
		protocol: typeof rec.protocol === "string" ? rec.protocol : void 0
	}).catch(() => void 0);
	el.removeAttribute("data-cw-unified-mail");
}
/**
* Applies staged envelope markers inside `scope` (scope element + subtree via querySelectorAll).
* Intended for MutationObserver added subtrees and shell-injected payloads.
*/
function processStagedUnifiedMarkers(scope) {
	const matched = /* @__PURE__ */ new Set();
	if (scope.matches("[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]")) matched.add(scope);
	for (const n of scope.querySelectorAll(STAGED_UNIFIED_SELECTOR)) matched.add(n);
	for (const el of matched) {
		if (!el.isConnected) continue;
		consumeDeferFlush(el);
		consumePending(el);
		consumeMail(el);
	}
}
function flushDeferredTransportForView(view, explicitDestination) {
	const dest = explicitDestination || inferViewDestination(String(view.id || ""));
	const aliases = getDestinationAliases(dest);
	const targets = /* @__PURE__ */ new Set();
	for (const x of [dest, ...aliases]) {
		const n = normalizeDestination(x) || String(x || "").trim();
		if (n) targets.add(normalizeViewId(n));
	}
	(async () => {
		for (const t of targets) try {
			await replayQueuedMessagesForDestination(t);
		} catch {}
	})();
}
var cleanupByView = /* @__PURE__ */ new WeakMap();
/** Last bound element per canonical destination — avoids duplicate UnifiedMessaging handlers. */
var activeHostByDestination = /* @__PURE__ */ new Map();
function sealCleanup(view, destinationKey, inner) {
	let disposed = false;
	return () => {
		if (disposed) return;
		disposed = true;
		inner();
		cleanupByView.delete(view);
		if (activeHostByDestination.get(destinationKey) === view) activeHostByDestination.delete(destinationKey);
	};
}
/**
* Single receive-channel binding per live view instance; replaces any prior binding for the same destination id.
* Safe to call from {@link ViewRegistry.load} and from DOM discovery.
*/
function attachImplicitViewMessaging(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const existing = cleanupByView.get(view);
	if (existing) return existing;
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const destinationKey = normalizeViewId(destination);
	const displaced = activeHostByDestination.get(destinationKey);
	if (displaced && displaced !== view) cleanupByView.get(displaced)?.();
	const inner = bindViewReceiveChannel(view, {
		...options,
		destination
	});
	flushDeferredTransportForView(view, destination);
	const cleanup = sealCleanup(view, destinationKey, inner);
	cleanupByView.set(view, cleanup);
	activeHostByDestination.set(destinationKey, view);
	return cleanup;
}
function detachImplicitViewMessaging(view) {
	cleanupByView.get(view)?.();
}
function walkSubtreeNodes(entry, visit) {
	const stack = [entry];
	while (stack.length) {
		const cur = stack.pop();
		if (cur.nodeType === Node.ELEMENT_NODE) {
			const el = cur;
			visit(el);
			const sr = el.shadowRoot;
			if (sr) for (let i = sr.childNodes.length - 1; i >= 0; i--) stack.push(sr.childNodes[i]);
			for (let i = el.childNodes.length - 1; i >= 0; i--) stack.push(el.childNodes[i]);
		}
	}
}
function observeMutationRoot(observer, observed, node) {
	if (observed.has(node)) return;
	observed.add(node);
	observer.observe(node, {
		childList: true,
		subtree: true
	});
}
/**
* Starts observing DOM mutations; binds messaging hosts when connected and tears down when disconnected.
*/
function startImplicitViewMessagingBridge(options = {}) {
	const root = options.root instanceof Document ? options.root.documentElement : options.root ?? document.documentElement;
	if (!root || typeof MutationObserver === "undefined") return () => {};
	const observedRoots = /* @__PURE__ */ new WeakSet();
	let scanConnect = () => {};
	const scanDisconnect = (node) => {
		walkSubtreeNodes(node, (el) => {
			if (!isImplicitViewMessagingHost(el)) return;
			if (!el.isConnected) detachImplicitViewMessaging(el);
		});
	};
	const observer = new MutationObserver((records) => {
		for (const rec of records) {
			rec.addedNodes.forEach(scanConnect);
			rec.removedNodes.forEach(scanDisconnect);
		}
	});
	scanConnect = (node) => {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const host = node;
			if (host.isConnected) processStagedUnifiedMarkers(host);
		}
		walkSubtreeNodes(node, (el) => {
			if (el.shadowRoot) observeMutationRoot(observer, observedRoots, el.shadowRoot);
			if (!el.isConnected || !isImplicitViewMessagingHost(el)) return;
			attachImplicitViewMessaging(el);
		});
	};
	observeMutationRoot(observer, observedRoots, root);
	scanConnect(root);
	return () => {
		observer.disconnect();
		walkSubtreeNodes(root, (el) => {
			if (isImplicitViewMessagingHost(el)) detachImplicitViewMessaging(el);
		});
	};
}
//#endregion
//#region src/shared/routing/core/views.ts
var VIEW_ENABLED_VIEWER = "viewer";
var VIEW_ENABLED_EDITOR = "editor";
var VIEW_ENABLED_WORKCENTER = "workcenter";
var VIEW_ENABLED_EXPLORER = "explorer";
var VIEW_ENABLED_AIRPAD = "airpad";
var VIEW_ENABLED_SETTINGS = "settings";
var VIEW_ENABLED_HISTORY = "history";
var VIEW_ENABLED_HOME = "home";
var VIEW_ENABLED_PRINT = "print";
var DEFAULT_VIEW_ID = "viewer";
var VIEW_FLAGS = {
	viewer: VIEW_ENABLED_VIEWER,
	editor: VIEW_ENABLED_EDITOR,
	workcenter: VIEW_ENABLED_WORKCENTER,
	explorer: VIEW_ENABLED_EXPLORER,
	airpad: VIEW_ENABLED_AIRPAD,
	settings: VIEW_ENABLED_SETTINGS,
	history: VIEW_ENABLED_HISTORY,
	home: VIEW_ENABLED_HOME,
	print: VIEW_ENABLED_PRINT
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
//#region src/shared/routing/core/registry.ts
/**
* View factories usually return custom elements; some legacy modules return a plain
* object implementing `View` (render/lifecycle/id). Accept both for shell compatibility.
*/
function createWebComponentViewAdapter(viewInstance) {
	if (viewInstance instanceof HTMLElement) return viewInstance;
	const legacy = viewInstance;
	if (legacy && typeof legacy.render === "function" && typeof legacy.id === "string") return legacy;
	throw new Error("View factory must return an HTMLElement or a legacy view with render() and id");
}
/** Registry for shell modules plus the single live shell instances cached at runtime. */
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
var ViewRegistry = new class ViewRegistryClass {
	/** COMPAT: Modules often default-export a CE class (`CwViewExplorer`) — must be invoked with `new`. */
	static isCustomElementClassCtor(fn) {
		if (typeof fn !== "function") return false;
		try {
			const proto = fn.prototype;
			return proto != null && typeof HTMLElement !== "undefined" && HTMLElement.prototype.isPrototypeOf(proto);
		} catch {
			return false;
		}
	}
	resolveViewFactory(module) {
		const candidates = [
			module?.default,
			module?.createView,
			module?.createAirpadView,
			module?.createWorkCenterView,
			module?.createViewerView,
			module?.createExplorerView,
			module?.createSettingsView,
			module?.createHistoryView,
			module?.createHomeView
		];
		for (const candidate of candidates) {
			if (typeof candidate !== "function") continue;
			if (ViewRegistryClass.isCustomElementClassCtor(candidate)) {
				const Ctor = candidate;
				return ((options) => new Ctor(options));
			}
			return candidate;
		}
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
		this.viewReceiveCleanup.set(id, attachImplicitViewMessaging(view, {
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
}();
/** Register the built-in shell modules that the boot/routing layer can request. */
function registerDefaultShells() {
	ShellRegistry.register({
		id: "base",
		name: "Base",
		description: "Base shell with no frames or navigation",
		loader: () => import("../shells/base.js")
	});
	ShellRegistry.register({
		id: "minimal",
		name: "Minimal",
		description: "Minimal toolbar-based navigation",
		loader: () => import("./preview.js").then((n) => n.n)
	});
	ShellRegistry.register({
		id: "content",
		name: "Content",
		description: "CRX content shell with overlay-focused layering",
		loader: () => import("./src.js")
	});
	ShellRegistry.register({
		id: "environment",
		name: "Environment",
		description: "Environment shell baseline (until dedicated module ships)",
		loader: () => import("./environment.js")
	});
	ShellRegistry.register({
		id: "immersive",
		name: "Immersive",
		description: "Chromeless immersive host (extensions / embedded)",
		loader: () => import("./src2.js")
	});
}
/** Register the built-in views that are enabled by current feature flags. */
function registerDefaultViews() {
	ViewRegistry.register({
		id: "viewer",
		name: "Viewer",
		icon: "eye",
		loader: () => import("./src9.js")
	});
	ViewRegistry.register({
		id: "workcenter",
		name: "Work Center",
		icon: "lightning",
		loader: () => import("../com/app3.js")
	});
	ViewRegistry.register({
		id: "settings",
		name: "Settings",
		icon: "gear",
		loader: () => import("./src8.js")
	});
	ViewRegistry.register({
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise",
		loader: () => import("./src6.js")
	});
	ViewRegistry.register({
		id: "explorer",
		name: "Explorer",
		icon: "folder",
		loader: () => import("./src5.js")
	});
	ViewRegistry.register({
		id: "airpad",
		name: "Airpad",
		icon: "hand-pointing",
		loader: () => import("./src3.js")
	});
	ViewRegistry.register({
		id: "editor",
		name: "Editor",
		icon: "pencil",
		loader: () => import("./src4.js")
	});
	ViewRegistry.register({
		id: "home",
		name: "Home",
		icon: "house",
		loader: () => import("./src7.js")
	});
	ViewRegistry.register({
		id: "print",
		name: "Print",
		icon: "printer",
		loader: () => import("./src9.js")
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
* Populate both registries during boot before any shell or view is resolved.
*/
function initializeRegistries() {
	registerDefaultShells();
	registerDefaultViews();
}
//#endregion
//#region ../../modules/projects/subsystem/src/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
var LAST_ACTIVE_MAX_MS = 720 * 60 * 60 * 1e3;
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
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
//#region src/shared/other/utils/Theme.ts
/** Convert getComputedStyle background (rgb/rgba or hex) to #rrggbb for meta theme-color / PWA chrome. */
var cssBackgroundToOpaqueHex = (css) => {
	const t = css.trim();
	if (!t || t === "transparent") return null;
	const hexMatch = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hexMatch) {
		let h = hexMatch[1];
		if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
		return `#${h.toLowerCase()}`;
	}
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	if (!m) return null;
	const alpha = m[4] !== void 0 ? Number(m[4]) : 1;
	if (!Number.isFinite(alpha) || alpha < .98) return null;
	return `#${[
		Math.max(0, Math.min(255, Math.round(Number(m[1])))),
		Math.max(0, Math.min(255, Math.round(Number(m[2])))),
		Math.max(0, Math.min(255, Math.round(Number(m[3]))))
	].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};
/**
* Sample the top shell chrome (minimal nav or faint toolbar) from mounted shell shadow roots
* so PWA Window Controls Overlay / title bar can match the real toolbar background.
*/
var samplePwaToolbarBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	const hosts = document.querySelectorAll("[data-shell]");
	for (const host of hosts) {
		const sr = host.shadowRoot;
		if (!sr) continue;
		const bar = sr.querySelector(".app-shell__nav, .app-shell__toolbar");
		if (!bar) continue;
		const bg = getComputedStyle(bar).backgroundColor;
		const hex = cssBackgroundToOpaqueHex(bg);
		if (hex) return hex;
	}
	return null;
};
var resolveColorScheme = (theme) => {
	if (theme === "dark" || theme === "light") return theme;
	return globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
};
var resolveFontSize = (size) => {
	switch (size) {
		case "small": return "14px";
		case "large": return "18px";
		default: return "16px";
	}
};
/** Keep <html> + PWA chrome aligned with resolved light/dark and user preference (auto/light/dark). */
var syncBrowserChromeTheme = (resolved, preference) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const scheme = preference === "dark" ? "dark" : preference === "light" ? "light" : "auto";
	root.setAttribute("data-scheme", scheme);
	root.setAttribute("data-theme", resolved);
	root.style.colorScheme = resolved;
	try {
		const body = document.body;
		if (body) body.style.colorScheme = resolved;
	} catch {}
	if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ === true) return;
	const applyMetaThemeColor = () => {
		if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ === true) return;
		const meta = document.querySelector("meta[name=\"theme-color\"]");
		if (!meta) return;
		const sampled = samplePwaToolbarBackgroundColor();
		const fallback = resolved === "dark" ? "#0f1419" : "#007acc";
		meta.setAttribute("content", sampled ?? fallback);
	};
	applyMetaThemeColor();
	requestAnimationFrame(applyMetaThemeColor);
};
var applyTheme = (settings) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const theme = settings.appearance?.theme || "auto";
	syncBrowserChromeTheme(resolveColorScheme(theme), theme);
	root.style.fontSize = resolveFontSize(settings.appearance?.fontSize);
	if (settings.appearance?.color) {
		document.body.style.setProperty("--current", settings.appearance.color);
		document.body.style.setProperty("--primary", settings.appearance.color);
		root.style.setProperty("--current", settings.appearance.color);
		root.style.setProperty("--primary", settings.appearance.color);
	}
	if (settings.grid) applyGridSettings(settings);
};
//#endregion
export { pickEnabledView as _, initBootShellWindowActivity as a, ShellRegistry as c, defaultTheme as d, initializeRegistries as f, isEnabledView as g, ENABLED_VIEW_IDS as h, coerceShellForBootViewport as i, ViewRegistry as l, DEFAULT_VIEW_ID as m, syncBrowserChromeTheme as n, normalizeBootShellId as o, lightTheme as p, LS_BOOT_SHELL_LAST_ACTIVE as r, readLastActiveBootShell as s, applyTheme as t, darkTheme as u, startImplicitViewMessagingBridge as v, serviceChannels as y };
