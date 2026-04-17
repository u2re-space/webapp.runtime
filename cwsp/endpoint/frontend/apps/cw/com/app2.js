import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as createServiceChannelManager } from "../fest/uniform.js";
import { f as normalizeViewId, l as getDestinationAliases, n as BROADCAST_CHANNELS, o as ROUTE_HASHES, r as COMPONENTS, u as matchesDestination } from "./service.js";
import { a as initializeComponent, c as registerHandler, f as unregisterHandler, s as registerComponent } from "./service4.js";
import "./service5.js";
import { n as toUnifiedInteropMessage } from "./service6.js";
import { n as subscribeViewChannel } from "../views/api.js";
import { F as GLitElement, I as defineElement, L as property, V as H } from "./app3.js";
import { o as ensureStyleSheet } from "../fest/icon.js";
import { t as __decorate } from "../chunks/decorate.js";
import "../chunks/views.js";
//#region src/com/core/ServiceChannels.ts
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
//#region src/frontend/shared/routing/channel-mixin.ts
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
var WINDOW_FRAME_TAG$1 = "cw-window-frame";
var WindowFrameHostElement$1 = class extends HTMLElement {
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
var ensureDefined$1 = (tagName, ctor) => {
	if (typeof customElements === "undefined") return;
	if (!customElements?.get?.(tagName)) customElements?.define?.(tagName, ctor);
};
var ensureWindowFrameElementDefined$1 = () => {
	ensureDefined$1(WINDOW_FRAME_TAG$1, WindowFrameHostElement$1);
	return WINDOW_FRAME_TAG$1;
};
var BaseElement$1 = class BaseElement extends GLitElement(HTMLElement) {
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
__decorate([property({ source: "attr" })], BaseElement$1.prototype, "theme", void 0);
BaseElement$1 = __decorate([defineElement("cw-base-element")], BaseElement$1);
ensureWindowFrameElementDefined$1();
//#endregion
//#region shared/fest/fl-ui/ui/items/BaseElement.ts
var SHELL_TAG_PREFIX = "cw-shell-";
var WINDOW_FRAME_TAG = "cw-window-frame";
var normalizeToken = (value, fallback) => {
	return String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "") || fallback;
};
var ShellHostElement = class extends HTMLElement {
	mountShellLayout(layout) {
		(this.shadowRoot || this.attachShadow({ mode: "open" })).replaceChildren(layout);
	}
};
var MinimalShellHostElement = class extends ShellHostElement {
	mountShellLayout(layout) {
		const slotHost = layout.querySelector("[data-shell-content]");
		if (slotHost && !slotHost.querySelector("slot[name=\"view\"]")) {
			const slot = document.createElement("slot");
			slot.name = "view";
			slotHost.appendChild(slot);
		}
		super.mountShellLayout(layout);
	}
};
var WindowShellHostElement = class extends ShellHostElement {
	mountShellLayout(layout) {
		const stage = layout.querySelector("[data-shell-content]");
		if (stage && !stage.querySelector("slot[name=\"window-frame\"]")) {
			const frameSlot = document.createElement("slot");
			frameSlot.name = "window-frame";
			frameSlot.style.display = "contents";
			stage.appendChild(frameSlot);
		}
		super.mountShellLayout(layout);
	}
};
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
var ensureShellElementDefined = (shellId) => {
	const token = normalizeToken(shellId, "minimal");
	const tagName = `${SHELL_TAG_PREFIX}${token}`;
	ensureDefined(tagName, token === "minimal" || token === "base" ? MinimalShellHostElement : token === "window" || token === "environment" || token === "tabbed" ? WindowShellHostElement : ShellHostElement);
	return tagName;
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
//#endregion
//#region src/frontend/shared/routing/registry.ts
var registry_exports = /* @__PURE__ */ __exportAll({
	ShellRegistry: () => ShellRegistry,
	ViewRegistry: () => ViewRegistry,
	darkTheme: () => darkTheme,
	defaultTheme: () => defaultTheme,
	initializeRegistries: () => initializeRegistries,
	lightTheme: () => lightTheme,
	registerDefaultShells: () => registerDefaultShells,
	registerDefaultViews: () => registerDefaultViews
});
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
/**
* Registry for lazily loaded views.
*
* INVARIANT: only one live view instance is kept per `ViewId`, because receive
* channels and shell-owned DOM roots assume stable identity.
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
		loader: () => import("../shells/minimal.js")
	});
	ShellRegistry.register({
		id: "window",
		name: "Window",
		description: "Desktop-like multi-window shell",
		loader: () => import("../shells/window-index.scss?inline.js")
	});
	ShellRegistry.register({
		id: "tabbed",
		name: "Tabbed",
		description: "Tabbed window variant for focused multi-tasking",
		loader: () => import("../shells/tabbed-index.js")
	});
	ShellRegistry.register({
		id: "environment",
		name: "Environment",
		description: "Desktop/webtop environment shell",
		loader: () => import("../shells/environment-index.js")
	});
	ShellRegistry.register({
		id: "content",
		name: "Content",
		description: "CRX content shell with overlay-focused layering",
		loader: () => import("../shells/content-index.js")
	});
	ShellRegistry.register({
		id: "faint",
		name: "Faint (legacy)",
		description: "Legacy alias redirected to tabbed shell",
		loader: () => import("../shells/tabbed-index.js")
	});
}
/** Register the built-in views that are enabled by current feature flags. */
function registerDefaultViews() {
	ViewRegistry.register({
		id: "viewer",
		name: "Viewer",
		icon: "eye",
		loader: () => import("../views/viewer.js")
	});
	ViewRegistry.register({
		id: "workcenter",
		name: "Work Center",
		icon: "lightning",
		loader: () => import("../views/workcenter4.js")
	});
	ViewRegistry.register({
		id: "settings",
		name: "Settings",
		icon: "gear",
		loader: () => import("../views/settings.js")
	});
	ViewRegistry.register({
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise",
		loader: () => import("../views/history.js")
	});
	ViewRegistry.register({
		id: "explorer",
		name: "Explorer",
		icon: "folder",
		loader: () => import("../views/explorer.js")
	});
	ViewRegistry.register({
		id: "airpad",
		name: "Airpad",
		icon: "hand-pointing",
		loader: () => import("../views/airpad4.js")
	});
	ViewRegistry.register({
		id: "editor",
		name: "Editor",
		icon: "pencil",
		loader: () => import("../views/editor2.js")
	});
	ViewRegistry.register({
		id: "home",
		name: "Home",
		icon: "house",
		loader: () => import("../views/home.js")
	});
	ViewRegistry.register({
		id: "print",
		name: "Print",
		icon: "printer",
		loader: () => import("../shells/print-index.js")
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
export { initializeRegistries as a, MinimalShellHostElement as c, defaultTheme as i, ensureShellElementDefined as l, ViewRegistry as n, lightTheme as o, darkTheme as r, registry_exports as s, ShellRegistry as t, serviceChannels as u };
