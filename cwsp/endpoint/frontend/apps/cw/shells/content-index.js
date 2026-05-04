import { f as isEnabledView } from "../chunks/views.js";
import { q as H } from "../com/app.js";
import { n as sendViewProtocolMessage, t as normalizeIpcAttachments } from "../chunks/UniformViewTransport.js";
//#region src/frontend/ai-slop/window/index.scss?inline
var window_default = "@layer shell.tokens, shell.base, shell.components, shell.utilities;@layer shell.tokens{.app-window-shell,:host{color-scheme:light dark;--window-shell-fg:light-dark(var(--color-on-surface,#1a1c2b),var(--color-on-surface,#e8eefc));--window-frame-bg:light-dark(rgba(255,255,255,0.92),rgba(14,18,28,0.88));--window-frame-border:light-dark(rgba(0,0,0,0.1),rgba(120,150,210,0.16));--window-frame-header:light-dark(rgba(245,247,252,0.95),rgba(22,28,42,0.85));--window-frame-shadow:light-dark(0 8px 32px rgba(0,0,0,0.08),0 0 0 0.5px rgba(0,0,0,0.06),0 8px 32px rgba(0,0,0,0.35),0 0 0 0.5px rgba(255,255,255,0.06));--window-dock-bg:light-dark(rgba(245,247,252,0.75),rgba(12,16,28,0.55));--window-dock-border:light-dark(rgba(0,0,0,0.08),rgba(130,160,235,0.1));--window-focus:light-dark(#3b7ddb,#8bb7ff)}.app-window-shell[data-theme=light],:host([data-theme=light]){color-scheme:light}.app-window-shell[data-theme=dark],:host([data-theme=dark]){color-scheme:dark}}@layer shell.base{.app-window-shell{background:transparent;background-color:initial;color:var(--window-shell-fg);contain:strict;container-type:size;display:grid;grid-template-rows:minmax(0,1fr);inset:0;overflow:hidden;pointer-events:none;position:absolute}.app-window-shell__stage{min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:none;position:relative}.app-window-shell__home-view,.app-window-shell__stage{block-size:100%;inline-size:100%}.app-window-shell__dock{backdrop-filter:blur(24px) saturate(1.25);background:var(--window-dock-bg);border-block-start:1px solid var(--window-dock-border);flex-wrap:nowrap;gap:.45rem;justify-content:center;min-block-size:50px;padding:.35rem .6rem .4rem}.app-window-shell__dock,.app-window-shell__status{align-items:center;display:flex;inline-size:100%;position:relative;z-index:1}.app-window-shell__status{backdrop-filter:blur(16px) saturate(1.1);background:light-dark(rgba(245,247,252,.6),rgba(12,16,28,.35));border-block-start:1px solid light-dark(rgba(0,0,0,.06),rgba(255,255,255,.04));color:color-mix(in oklab,var(--window-shell-fg) 75%,transparent);font-size:.72rem;gap:.55rem;min-block-size:26px;padding:.2rem .65rem}.app-window-shell__status-item{align-items:center;display:inline-flex;gap:.25rem;opacity:.78;white-space:nowrap}.app-window-shell__status-item b{font-weight:500;opacity:.72}.app-window-shell__status-spacer{flex:1 1 auto}}@layer shell.components{.app-window-shell__tabbed-host{display:flex;flex:1 1 0%;flex-direction:column;min-block-size:0;min-inline-size:0}.app-window-shell__tabbed-tabs{align-items:center;background:light-dark(rgba(235,240,248,.8),rgba(22,28,42,.6));border-block-end:1px solid light-dark(rgba(0,0,0,.06),rgba(255,255,255,.04));display:flex;flex:0 0 auto;gap:.3rem;min-block-size:1.8rem;padding:.25rem .4rem}.app-window-shell__tabbed-tab{align-items:center;background:transparent;border:none;border-radius:.5rem;color:inherit;cursor:pointer;display:inline-flex;font-size:.82rem;gap:.3rem;min-block-size:1.5rem;opacity:.65;padding:0 .5rem;transition:opacity .1s ease,background .1s ease}.app-window-shell__tabbed-tab:hover{background:light-dark(rgba(0,0,0,.05),rgba(255,255,255,.06));opacity:.85}.app-window-shell__tabbed-tab.is-active{background:light-dark(rgba(59,125,219,.12),rgba(139,183,255,.12));opacity:1}.app-window-shell__tabbed-content{flex:1 1 0%;min-block-size:0;min-inline-size:0;overflow:auto;position:relative}.app-window-shell__tabbed-content>*{inline-size:100%;min-block-size:0;min-inline-size:0}.app-window-shell__frame.is-drop-target{border-color:light-dark(rgba(59,125,219,.35),rgba(139,183,255,.35));box-shadow:0 0 0 1px light-dark(rgba(59,125,219,.2),rgba(139,183,255,.2)),inset 0 0 20px light-dark(rgba(59,125,219,.06),rgba(139,183,255,.06)),0 14px 40px light-dark(rgba(0,0,0,.12),rgba(0,0,0,.42))}.app-window-shell__frame.is-drop-target:before{background:light-dark(rgba(59,125,219,.05),rgba(139,183,255,.05));border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute;z-index:2}.app-window-shell__dock-item{align-items:center;background:transparent;border:none;border-radius:10px;color:inherit;cursor:pointer;display:inline-flex;gap:0;justify-content:center;padding:0;position:relative;transition:background .12s ease,transform 80ms ease}.app-window-shell__dock-item--icon{block-size:2.4rem;border-radius:10px;inline-size:2.4rem;justify-content:center;min-block-size:2.4rem;min-inline-size:2.4rem;padding:0}.app-window-shell__dock-item--icon ui-icon{--icon-size:1.2rem;opacity:.72;pointer-events:none;transition:opacity .1s ease}.app-window-shell__dock-item:hover ui-icon{opacity:1}.app-window-shell__dock-item--icon:after{background:transparent;block-size:2.5px;border-radius:999px;content:\"\";inline-size:0;inset-block-end:.14rem;inset-inline-start:50%;opacity:0;pointer-events:none;position:absolute;transform:translateX(-50%);transition:transform .14s ease,opacity .14s ease,inline-size .14s ease,background-color .14s ease}.app-window-shell__dock-item:hover{background:light-dark(rgba(0,0,0,.06),rgba(255,255,255,.08))}.app-window-shell__dock-item:active{transform:scale(.94)}.app-window-shell__dock-item.is-active:after,.app-window-shell__dock-item.is-headless:after,.app-window-shell__dock-item.is-minimized:after,.app-window-shell__dock-item.is-open:after{opacity:1}.app-window-shell__dock-item.is-open:after{background:light-dark(rgba(59,125,219,.65),rgba(139,183,255,.65));inline-size:4px}.app-window-shell__dock-item.is-minimized:after{background:light-dark(rgba(59,125,219,.35),rgba(139,183,255,.35));inline-size:4px}.app-window-shell__dock-item.is-headless:after{background:light-dark(rgba(59,125,219,.25),rgba(139,183,255,.25));inline-size:3px}.app-window-shell__dock-item.is-active{background:light-dark(rgba(59,125,219,.08),rgba(139,183,255,.1))}.app-window-shell__dock-item.is-active ui-icon{opacity:1}.app-window-shell__dock-item.is-active:after{background:var(--window-focus);inline-size:8px}.app-window-shell__dock-apps,.app-window-shell__dock-quick,.app-window-shell__dock-start{align-items:center;display:inline-flex;gap:.35rem}.app-window-shell__dock-start{flex:0 0 auto}.app-window-shell__dock-apps{flex:0 1 auto;justify-content:center;min-inline-size:0;overflow:auto hidden;scrollbar-width:none}.app-window-shell__dock-apps::-webkit-scrollbar{display:none}.app-window-shell__dock-quick{flex:0 0 auto;margin-inline-start:auto}}@layer shell.utilities{}";
//#endregion
//#region src/frontend/ai-slop/window/components/WindowFrame.ts
var CwWindowFrameV2 = class extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `
            <style>
                :host {
                    display: block;
                    box-sizing: border-box;
                    position: relative;
                    contain: layout style;
                }
                .cw-window-frame-v2__shell {
                    display: flex;
                    flex-direction: column;
                    block-size: 100%;
                    inline-size: 100%;
                    min-block-size: 0;
                    min-inline-size: 0;
                    overflow: hidden;
                    border-radius: var(--window-frame-radius, 0.5rem);
                    border: 1px solid color-mix(in oklab, var(--color-outline-variant, #888) 55%, transparent);
                    background: var(--color-surface, #1a1a1a);
                }
                ::slotted([slot="window-view"]) {
                    flex: 1 1 auto;
                    min-block-size: 0;
                    min-inline-size: 0;
                    overflow: auto;
                }
            </style>
            <div class="cw-window-frame-v2__shell" part="shell">
                <slot name="window-view"></slot>
            </div>
        `;
	}
	setTitle(title) {
		this.setAttribute("data-title", title);
	}
	setPidLabel(pid) {
		this.setAttribute("data-pid", pid);
	}
};
var TAG = "cw-window-frame-v2";
if (typeof customElements !== "undefined" && !customElements.get(TAG)) customElements.define(TAG, CwWindowFrameV2);
//#endregion
//#region src/frontend/ai-slop/window/index.ts
/**
* Window Shell
*
* Desktop-like shell with process windows (pID), hash-focus support,
* frame controls (drag, resize, minimize, close), inter-process channels,
* parameterized view opening (GET query / POST body), and cross-window
* drag-and-drop attach system.
*
* URL contract (environment/window/tabbed shells):
*   GET /{view}?key=val  → opens process for that view with query params
*                          → silently redirects to /?key=val#pid
*   location.hash        → #pid of the currently focused process
*   history.state         → { viewId, pid, params }
*/
var destinationForView = (viewId) => {
	if (viewId === "workcenter") return "workcenter";
	if (viewId === "viewer") return "viewer";
	if (viewId === "explorer") return "explorer";
	if (viewId === "editor") return "editor";
	if (viewId === "settings") return "settings";
	if (viewId === "history") return "history";
	if (viewId === "airpad") return "airpad";
	if (viewId === "print") return "print";
	return "home";
};
var protocolTypeForDestination = (destination) => {
	if (destination === "workcenter") return "content-attach";
	if (destination === "viewer") return "content-view";
	if (destination === "explorer") return "content-explorer";
	return "content-share";
};
var toTitle = (viewId) => {
	const raw = String(viewId || "view").trim();
	if (!raw) return "View";
	return raw.charAt(0).toUpperCase() + raw.slice(1);
};
var sanitizePid = (value) => value.replace(/[^a-z0-9_-]/gi, "");
var normalizeWindowKind = (value) => {
	return String(value || "").trim().toLowerCase() === "tabbed" ? "tabbed" : "regular";
};
var parseBooleanParam = (value) => {
	const normalized = String(value || "").trim().toLowerCase();
	if (!normalized) return false;
	return ![
		"0",
		"false",
		"no",
		"off",
		"null",
		"undefined"
	].includes(normalized);
};
var parseLocationParams = () => {
	try {
		return Object.fromEntries(new URLSearchParams(globalThis?.location?.search || ""));
	} catch {
		return {};
	}
};
var processKeyOf = (viewId, query) => sanitizePid(String(query?.processId || viewId || "process")) || String(viewId || "process");
var iconForView = (viewId) => ({
	home: "house",
	viewer: "article",
	explorer: "books",
	settings: "gear-six",
	airpad: "paper-plane-tilt",
	history: "clock-counter-clockwise",
	editor: "note-pencil",
	workcenter: "circles-three-plus"
})[viewId] || "app-window";
/** Views whose windows accept drop events (file attach, etc.) */
var DROP_ACCEPTING_VIEWS = new Set([
	"workcenter",
	"viewer",
	"editor",
	"airpad"
]);
/**
* Build a ProcessOpenParams from flat key-value params (legacy compat)
* and optional structured fields.
*/
function buildOpenParams(flatParams, extra) {
	const query = { ...flatParams || {} };
	delete query.pid;
	delete query.minimized;
	delete query.headless;
	delete query.newTask;
	delete query.windowType;
	delete query.window;
	delete query.shell;
	delete query.processId;
	return {
		query,
		body: extra?.body,
		contentType: extra?.contentType,
		channel: extra?.channel,
		attachments: extra?.attachments
	};
}
/**
* Create a lightweight per-process message channel backed by EventTarget.
*/
function createProcessChannel(pid) {
	const target = new EventTarget();
	const handlers = /* @__PURE__ */ new Set();
	return {
		post(message) {
			target.dispatchEvent(new CustomEvent("msg", { detail: message }));
		},
		onMessage(handler) {
			const wrapper = (e) => handler(e.detail);
			target.addEventListener("msg", wrapper);
			handlers.add(handler);
			return () => {
				target.removeEventListener("msg", wrapper);
				handlers.delete(handler);
			};
		},
		close() {
			handlers.clear();
		}
	};
}
var WindowShell = class extends ShellBase {
	id = "window";
	name = "Window";
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: true,
		supportsWindowing: true
	};
	stageElement = null;
	dockElement = null;
	homeFrameElement = null;
	processes = /* @__PURE__ */ new Map();
	processTasks = /* @__PURE__ */ new Map();
	zCounter = 10;
	pidCounter = 0;
	activePid = null;
	popstateHandler = null;
	hashHandler = null;
	openRequestHandler = null;
	statusTimer = null;
	dockAppsElement = null;
	dockStartElement = null;
	dockQuickElement = null;
	pinnedViews = [];
	shouldRenderDesktopChrome() {
		return false;
	}
	getPinnedViews() {
		return [];
	}
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-window-shell");
		if (inner) {
			const resolved = this.resolveShellColorScheme(theme);
			inner.dataset.theme = resolved;
			inner.style.colorScheme = resolved;
		}
		super.applyTheme(theme);
	}
	getDefaultWindowKind() {
		return this.id === "tabbed" ? "tabbed" : "regular";
	}
	resolveWindowKind(query) {
		return normalizeWindowKind(query?.windowType || query?.window || this.getDefaultWindowKind());
	}
	isForcedNewTask(query) {
		return parseBooleanParam(query?.newTask) || String(query?.instance || "").toLowerCase() === "new";
	}
	resolveProcessId(viewId, query) {
		const baseKey = processKeyOf(viewId, query);
		if (!this.isForcedNewTask(query)) return baseKey;
		return `${baseKey}::${`${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`}`;
	}
	/**
	* Open a view as a window process with full parameter support.
	* This is the canonical API used by external code and routing.
	*/
	async openView(viewId, options) {
		if (!isEnabledView(String(viewId))) {
			this.showMessage(`Unknown view: ${String(viewId)}`);
			return "";
		}
		const flatParams = { ...options?.query || {} };
		if (options?.pid) flatParams.pid = options.pid;
		if (options?.windowKind) flatParams.windowType = options.windowKind;
		if (options?.headless) flatParams.headless = "1";
		if (options?.newTask) flatParams.newTask = "1";
		const openParams = buildOpenParams(flatParams, {
			body: options?.body,
			contentType: options?.contentType,
			channel: options?.channel,
			attachments: options?.attachments
		});
		if (viewId === "home") {
			await this.mountHomeSurface(openParams);
			return "";
		}
		const pid = await this.openWindowProcess(viewId, flatParams, openParams);
		const proc = this.processes.get(pid);
		if (!proc) return "";
		this.focusProcess(proc.pid, true);
		this.updateStatusBar();
		if (openParams.body != null) {
			const bodyText = typeof openParams.body === "string" ? openParams.body : JSON.stringify(openParams.body);
			postViewChannelPayload(String(viewId), {
				type: "view-post",
				viewId: String(viewId),
				bodyText,
				contentType: openParams.contentType || "application/json",
				pid
			});
		}
		if (openParams.attachments?.length) {
			proc.channel.post({
				type: "process-attach",
				attachments: openParams.attachments.map((a) => ({
					name: a.name,
					type: a.type,
					size: a.size,
					source: a.source,
					data: a.data
				}))
			});
			this.relayAttachmentsToView(proc, openParams.attachments, "open-view");
		}
		return pid;
	}
	/**
	* Get a process's channel for external messaging.
	*/
	getProcessChannel(pid) {
		return this.processes.get(pid)?.channel || null;
	}
	/**
	* Send a message to a process by PID.
	*/
	postToProcess(pid, message) {
		this.processes.get(pid)?.channel.post(message);
	}
	/**
	* Send attachments to a process (drag-and-drop or programmatic attach).
	*/
	attachToProcess(pid, attachments) {
		const proc = this.processes.get(pid);
		if (!proc) return;
		proc.channel.post({
			type: "process-attach",
			attachments: attachments.map((a) => ({
				name: a.name,
				type: a.type,
				size: a.size,
				source: a.source,
				data: a.data
			}))
		});
		this.relayAttachmentsToView(proc, attachments, "programmatic-attach");
	}
	async relayAttachmentsToView(proc, attachments, source) {
		if (!attachments.length) return;
		const normalized = await normalizeIpcAttachments(attachments.map((entry) => ({
			data: entry.data,
			source: entry.source || source
		})), source);
		if (!normalized.length) return;
		const destination = destinationForView(proc.viewId);
		const type = protocolTypeForDestination(destination);
		const first = normalized[0];
		if (!await sendViewProtocolMessage({
			type,
			source: `window-shell:${proc.pid}`,
			destination,
			contentType: first?.mimeType || "application/octet-stream",
			attachments: normalized.map((entry) => ({
				data: entry.data,
				source: entry.source
			})),
			data: {
				path: proc.openParams.query?.path || proc.openParams.query?.src || "/",
				filename: first?.name,
				action: destination === "explorer" ? "save" : void 0,
				originView: proc.viewId,
				pid: proc.pid
			},
			metadata: {
				processId: proc.processId,
				shell: "window",
				from: source
			}
		})) console.warn(`[window] Failed to relay attachments to ${destination}`);
	}
	clearDesktopChrome() {
		document.querySelector("[data-app-layer=\"shell\"]")?.querySelector("cw-app-dock[data-window-dock]")?.remove();
		document.querySelector("[data-app-layer=\"shell\"]")?.querySelector("cw-status-bar[data-window-status]")?.remove();
		this.statusContainer = null;
	}
	ensureProcessHost() {
		if (this.shouldRenderDesktopChrome()) {
			this.bindOverlayChrome();
			return;
		}
		if (this.dockElement && this.dockAppsElement) return;
		const virtualDock = document.createElement("div");
		const virtualApps = document.createElement("div");
		virtualDock.appendChild(virtualApps);
		this.dockElement = virtualDock;
		this.dockAppsElement = virtualApps;
		this.dockStartElement = null;
		this.dockQuickElement = null;
	}
	/**
	* Load a view for a window process. Each window gets a fresh view
	* instance and DOM tree (not shared with ShellBase's view cache).
	*/
	async loadWindowView(viewId, openParams) {
		const viewOptions = {
			shellContext: this.getContext(),
			params: { ...openParams.query },
			initialData: openParams.body
		};
		try {
			const { ViewRegistry } = await import("../chunks/registry.js").then((n) => n.s);
			const registration = ViewRegistry.get(viewId);
			if (registration) {
				const moduleObj = await registration.loader();
				const factory = this.resolveViewFactory(moduleObj);
				if (factory) {
					const view = await factory(viewOptions);
					if (view?.render) {
						const element = view.render(viewOptions);
						if (view.lifecycle?.onMount) await view.lifecycle.onMount();
						return {
							element,
							disposeView: () => {
								try {
									view.lifecycle?.onUnmount?.();
								} catch {}
							}
						};
					}
				}
			}
		} catch (e) {
			console.warn(`[window] View registry load failed for ${viewId}:`, e);
		}
		const cached = this.loadedViews.get(viewId);
		if (cached) {
			const freshElement = cached.view.render({
				shellContext: this.getContext(),
				params: openParams.query,
				initialData: openParams.body
			});
			if (cached.view.lifecycle?.onMount) await cached.view.lifecycle.onMount();
			return {
				element: freshElement,
				disposeView: () => {
					try {
						cached.view.lifecycle?.onUnmount?.();
					} catch {}
				}
			};
		}
		const element = await this.loadView(viewId, openParams.query);
		const justCached = this.loadedViews.get(viewId);
		return {
			element,
			disposeView: justCached ? () => {
				try {
					justCached.view.lifecycle?.onUnmount?.();
				} catch {}
			} : null
		};
	}
	resolveViewFactory(mod) {
		for (const name of [
			"default",
			"createView",
			"createViewerView",
			"createExplorerView",
			"createWorkCenterView",
			"createSettingsView",
			"createHistoryView",
			"createAirpadView",
			"createEditorView",
			"createHomeView"
		]) if (typeof mod[name] === "function") return mod[name];
		for (const value of Object.values(mod)) if (typeof value === "function" && value.prototype?.render) {
			const Ctor = value;
			return (opts) => new Ctor(opts);
		}
		return null;
	}
	createLayout() {
		return H`
            <div class="app-window-shell" data-shell="window">
                <main class="app-window-shell__stage" data-shell-content role="main"></main>
            </div>
        `;
	}
	getStylesheet() {
		return window_default;
	}
	async mount(container) {
		this.pinnedViews = this.getPinnedViews();
		await super.mount(container);
		this.stageElement = this.rootElement?.shadowRoot?.querySelector("[data-shell-content]");
		this.homeFrameElement = this.rootElement?.querySelector("[data-window-home-frame]");
		if (this.rootElement) {
			this.rootElement.style.gridColumn = "content-column";
			this.rootElement.style.gridRow = "content-row";
			this.rootElement.style.minInlineSize = "0";
			this.rootElement.style.minBlockSize = "0";
			this.rootElement.style.pointerEvents = "none";
			this.rootElement.style.position = "relative";
			this.rootElement.style.zIndex = "1";
		}
		if (this.shouldRenderDesktopChrome()) {
			this.bindOverlayChrome();
			this.initStatusBar();
		} else {
			this.clearDesktopChrome();
			this.ensureProcessHost();
		}
		this.bindBrowserNavigation();
		await this.syncInitialRoute();
	}
	unmount() {
		if (this.popstateHandler) {
			globalThis?.removeEventListener?.("popstate", this.popstateHandler);
			this.popstateHandler = null;
		}
		if (this.hashHandler) {
			globalThis?.removeEventListener?.("hashchange", this.hashHandler);
			this.hashHandler = null;
		}
		if (this.openRequestHandler) {
			globalThis?.removeEventListener?.("cw:view-open-request", this.openRequestHandler);
			this.openRequestHandler = null;
		}
		if (this.statusTimer) {
			clearInterval(this.statusTimer);
			this.statusTimer = null;
		}
		for (const task of this.processTasks.values()) task.unsubscribeChannel?.();
		for (const proc of this.processes.values()) {
			proc.channel.close();
			proc.disposeView?.();
		}
		this.processTasks.clear();
		this.processes.clear();
		this.activePid = null;
		this.dockElement = null;
		this.dockAppsElement = null;
		this.dockStartElement = null;
		this.dockQuickElement = null;
		super.unmount();
	}
	async navigate(viewId, params) {
		if (!isEnabledView(String(viewId))) {
			this.showMessage(`Unknown view: ${String(viewId)}`);
			return;
		}
		const openParams = buildOpenParams(params);
		if (viewId === "home") {
			await this.mountHomeSurface(openParams);
			this.navigationState.previousView = this.navigationState.currentView;
			this.navigationState.currentView = "home";
			this.navigationState.params = params;
			this.currentView.value = "home";
			this.activePid = null;
			for (const item of this.processes.values()) item.frame.classList.remove("is-active");
			for (const task of this.processTasks.values()) {
				task.dockItem.classList.remove("is-active");
				this.syncDockItemState(task.processId);
			}
			this.updateUrlState("home", null, params, false);
			this.updateStatusBar();
			return;
		}
		const pid = await this.openWindowProcess(viewId, params, openParams);
		const proc = this.processes.get(pid);
		if (!proc) return;
		this.focusProcess(proc.pid, true);
		this.updateStatusBar();
	}
	/**
	* Parse entry URL, open the initial view as a process, and normalize
	* the URL to `/#pid` so back/forward operates on process focus.
	*/
	async syncInitialRoute() {
		const state = globalThis?.history?.state || {};
		const pathname = (globalThis?.location?.pathname || "").replace(/^\/+|\/+$/g, "").toLowerCase();
		const fromPath = pathname && isEnabledView(pathname) ? pathname : null;
		const initialView = (state?.viewId && isEnabledView(String(state.viewId)) ? state.viewId : null) || fromPath || "home";
		const params = {
			...parseLocationParams(),
			...state?.params || {}
		};
		await this.navigate(initialView, params);
		if (fromPath && fromPath !== "home") {
			const proc = this.activePid ? this.processes.get(this.activePid) : null;
			if (proc) this.updateUrlState(proc.viewId, proc.pid, params, true);
		}
		const hashPid = sanitizePid((globalThis?.location?.hash || "").replace(/^#/, ""));
		if (hashPid) this.focusProcess(hashPid, false);
	}
	bindBrowserNavigation() {
		this.popstateHandler = (event) => {
			const state = event.state || {};
			const viewId = state?.viewId && isEnabledView(String(state.viewId)) ? state.viewId : "home";
			const params = {
				...parseLocationParams(),
				...state?.params || {}
			};
			this.navigate(viewId, params).then(() => {
				if (state?.pid) this.focusProcess(state.pid, false);
			});
		};
		globalThis?.addEventListener?.("popstate", this.popstateHandler);
		this.hashHandler = () => {
			const pid = sanitizePid((globalThis?.location?.hash || "").replace(/^#/, ""));
			if (!pid) return;
			this.focusProcess(pid, false);
		};
		globalThis?.addEventListener?.("hashchange", this.hashHandler);
		this.openRequestHandler = (event) => {
			const detail = event.detail;
			const viewId = detail?.viewId ? String(detail.viewId).toLowerCase() : "";
			if (!viewId || !isEnabledView(viewId)) return;
			if (detail?.target === "base" || detail?.target === "minimal") {
				this.openProcessAsDedicatedWindow(viewId, detail?.params, detail?.target, null, detail?.body);
				return;
			}
			this.openView(viewId, {
				query: detail?.params,
				body: detail?.body,
				contentType: detail?.contentType,
				channel: detail?.channel,
				attachments: detail?.attachments,
				windowKind: detail?.windowType ? normalizeWindowKind(detail.windowType) : void 0,
				pid: detail?.pid ? String(detail.pid) : void 0,
				headless: detail?.target === "headless",
				newTask: detail?.newTask
			});
		};
		globalThis?.addEventListener?.("cw:view-open-request", this.openRequestHandler);
	}
	async mountHomeSurface(_openParams) {
		if (this.homeFrameElement?.isConnected) this.homeFrameElement.remove();
		this.homeFrameElement = null;
		this.updateStatusBar();
	}
	async openWindowProcess(viewId, flatParams, openParams) {
		this.ensureProcessHost();
		if (!this.rootElement || !this.dockAppsElement) throw new Error("[window] Shell host/dock is not mounted");
		const resolvedOpenParams = openParams || buildOpenParams(flatParams);
		const allFlat = {
			...flatParams || {},
			...resolvedOpenParams.query
		};
		const processId = this.resolveProcessId(viewId, allFlat);
		const isHeadless = allFlat?.headless === "1";
		const windowKind = this.resolveWindowKind(allFlat);
		let task = this.processTasks.get(processId);
		if (!task) {
			const isPinned = this.pinnedViews.includes(viewId);
			const existingPinnedBtn = isPinned ? this.dockAppsElement.querySelector(`[data-dock-action="open-pinned"][data-view-id="${viewId}"]`) : null;
			let dockItem;
			if (existingPinnedBtn) {
				existingPinnedBtn.setAttribute("data-window-dock-item", "true");
				existingPinnedBtn.setAttribute("data-process-id", processId);
				existingPinnedBtn.setAttribute("data-window-kind", windowKind);
				existingPinnedBtn.setAttribute("data-window-state", "idle");
				dockItem = existingPinnedBtn;
			} else {
				dockItem = this.createProcessDockItem(processId, viewId, windowKind, allFlat);
				this.dockAppsElement.appendChild(dockItem);
			}
			task = {
				processId,
				viewId,
				defaultWindowKind: windowKind,
				openParams: resolvedOpenParams,
				instances: /* @__PURE__ */ new Set(),
				dockItem,
				pinned: isPinned,
				headless: isHeadless,
				lastActivePid: null,
				unsubscribeChannel: subscribeViewChannel(viewId, () => {
					const t = this.processTasks.get(processId);
					if (!t) return;
					t.headless = false;
					this.updateStatusBar();
				})
			};
			this.processTasks.set(processId, task);
			this.syncDockItemState(processId);
		} else {
			task.openParams = resolvedOpenParams;
			task.headless = task.headless || isHeadless;
			task.defaultWindowKind = windowKind;
			this.syncDockItemState(processId);
		}
		if (isHeadless) {
			this.syncDockItemState(processId);
			this.updateStatusBar();
			return task.lastActivePid || "";
		}
		const requestedPid = sanitizePid(String(allFlat?.pid || ""));
		if (requestedPid && this.processes.has(requestedPid)) {
			const existing = this.processes.get(requestedPid);
			existing.state = "open";
			existing.frame.hidden = false;
			task.lastActivePid = existing.pid;
			this.syncDockItemState(processId);
			return existing.pid;
		}
		const pid = requestedPid || this.generatePid(viewId);
		const channel = createProcessChannel(pid);
		const frame = this.createFrame(pid, viewId, windowKind);
		const frameEl = frame;
		const viewPayload = await this.loadWindowView(viewId, resolvedOpenParams);
		const element = viewPayload.element;
		const viewHost = this.createWindowViewHost(viewId, pid, windowKind, element);
		viewHost.dataset.view = String(viewId);
		viewHost.slot = "window-view";
		for (const child of Array.from(frame.children)) {
			const childEl = child;
			if (childEl.slot === "window-view") childEl.remove();
		}
		frame.appendChild(viewHost);
		frameEl?.setTitle?.(toTitle(viewId));
		frameEl?.setPidLabel?.(pid);
		frame.slot = "window-frame";
		this.rootElement?.appendChild(frame);
		const acceptsDrop = DROP_ACCEPTING_VIEWS.has(String(viewId).toLowerCase());
		const proc = {
			pid,
			processId,
			viewId,
			windowKind,
			openParams: resolvedOpenParams,
			state: "open",
			frame,
			body: null,
			frameEl,
			channel,
			acceptsDrop,
			disposeView: viewPayload.disposeView || null
		};
		this.processes.set(pid, proc);
		task.instances.add(pid);
		task.lastActivePid = pid;
		task.headless = false;
		this.installWindowInteractions(proc);
		if (acceptsDrop) this.installDropTarget(proc);
		if (allFlat?.minimized === "1") {
			proc.state = "minimized";
			proc.frame.hidden = true;
		}
		this.syncDockItemState(processId);
		this.updateStatusBar();
		return pid;
	}
	createFrame(pid, viewId, windowKind) {
		const title = toTitle(viewId);
		const stageRect = this.stageElement?.getBoundingClientRect?.();
		const stageW = stageRect?.width || globalThis?.innerWidth || 1280;
		const stageH = stageRect?.height || globalThis?.innerHeight || 720;
		stageRect?.left;
		stageRect?.top;
		const frameWidth = Math.min(640, stageW);
		const frameHeight = Math.min(480, stageH);
		const centerX = Math.max(0, Math.round((stageW - frameWidth) / 2));
		const centerY = Math.max(0, Math.round((stageH - frameHeight) / 2));
		const frame = H`
            <cw-window-frame-v2
                class="app-window-shell__frame"
                data-window-frame
                data-window-kind="${windowKind}"
                data-pid="${pid}"
                data-title="${title}"
            >
            </cw-window-frame-v2>
        `;
		frame.style.setProperty("pointer-events", "auto");
		frame.style.setProperty("--shift-x", `${centerX || 0}px`);
		frame.style.setProperty("--shift-y", `${centerY || 0}px`);
		frame.style.setProperty("--initial-inline-size", `${frameWidth || 640}px`);
		frame.style.setProperty("--initial-block-size", `${frameHeight || 480}px`);
		frame.style.setProperty("--min-inline-size", `${frameWidth || 640}px`);
		frame.style.setProperty("--min-block-size", `${frameHeight || 480}px`);
		return frame;
	}
	createWindowViewHost(viewId, pid, windowKind, element) {
		if (windowKind !== "tabbed") {
			element.dataset.view = String(viewId);
			return element;
		}
		const host = document.createElement("div");
		host.className = "app-window-shell__tabbed-host";
		host.setAttribute("data-window-tabbed-host", "true");
		host.setAttribute("data-window-pid", pid);
		host.innerHTML = `
            <div class="app-window-shell__tabbed-tabs" role="tablist" aria-label="Window tabs">
                <button type="button" class="app-window-shell__tabbed-tab is-active" role="tab" aria-selected="true">
                    <ui-icon icon="${iconForView(viewId)}"></ui-icon>
                    <span>${toTitle(viewId)}</span>
                </button>
            </div>
            <div class="app-window-shell__tabbed-content" data-window-tabbed-content></div>
        `;
		const content = host.querySelector("[data-window-tabbed-content]");
		if (content) {
			element.dataset.view = String(viewId);
			content.appendChild(element);
		}
		return host;
	}
	createProcessDockItem(processId, viewId, windowKind, _params) {
		return H`
            <button
                type="button"
                class="app-window-shell__dock-item app-window-shell__dock-item--icon"
                data-window-dock-item
                data-process-id="${processId}"
                data-window-kind="${windowKind}"
                data-window-state="idle"
                title="${toTitle(viewId)}"
                aria-label="${toTitle(viewId)}"
                aria-pressed="false"
            >
                <ui-icon icon="${iconForView(viewId)}"></ui-icon>
            </button>
        `;
	}
	installWindowInteractions(proc) {
		const { frame } = proc;
		frame.addEventListener("pointerdown", () => this.focusProcess(proc.pid, true));
		frame.addEventListener("window-action", (event) => {
			const action = event.detail?.action;
			if (!action) return;
			if (action === "minimize") {
				proc.state = "minimized";
				proc.frame.hidden = true;
				proc.frame.classList.remove("is-active");
				if (this.activePid === proc.pid) {
					this.activePid = null;
					this.updateUrlState(this.navigationState.currentView, null, void 0, true);
				}
				this.syncDockItemState(proc.processId);
				this.updateStatusBar();
			}
			if (action === "maximize") {
				this.toggleMaximize(proc.frame);
				this.updateStatusBar();
			}
			if (action === "close") this.closeProcess(proc);
			if (action === "detach") this.openProcessAsDedicatedWindow(proc.viewId, proc.openParams.query, "base", proc, proc.openParams.body);
			if (action === "popout") this.openProcessAsDedicatedWindow(proc.viewId, proc.openParams.query, "minimal", proc, proc.openParams.body);
		});
	}
	closeProcess(proc) {
		proc.state = "hidden";
		proc.channel.close();
		proc.disposeView?.();
		proc.frame.remove();
		this.processes.delete(proc.pid);
		const task = this.processTasks.get(proc.processId);
		task?.instances.delete(proc.pid);
		if (task && task.lastActivePid === proc.pid) task.lastActivePid = [...task.instances][0] || null;
		if (task && task.instances.size === 0) if (task.pinned) {
			task.lastActivePid = null;
			task.headless = false;
			this.syncDockItemState(task.processId);
		} else if (!task.headless) {
			task.unsubscribeChannel?.();
			task.dockItem.remove();
			this.processTasks.delete(task.processId);
		} else this.syncDockItemState(task.processId);
		else if (task) this.syncDockItemState(task.processId);
		if (this.activePid === proc.pid) {
			this.activePid = null;
			this.navigate("home");
		}
		this.updateStatusBar();
	}
	/**
	* Install drop zone on a process frame's body. Accepts files and
	* serialized DataTransfer items from other process windows.
	*/
	installDropTarget(proc) {
		const body = proc.frame.querySelector("[slot='window-view']") || proc.frame;
		body.addEventListener("dragover", (e) => {
			const event = e;
			if (!event.dataTransfer) return;
			event.preventDefault();
			event.dataTransfer.dropEffect = "copy";
			proc.frame.classList.add("is-drop-target");
		});
		body.addEventListener("dragleave", (e) => {
			const related = e.relatedTarget;
			if (related && proc.frame.contains(related)) return;
			proc.frame.classList.remove("is-drop-target");
		});
		body.addEventListener("drop", async (e) => {
			const event = e;
			event.preventDefault();
			proc.frame.classList.remove("is-drop-target");
			if (!event.dataTransfer) return;
			const attachments = [];
			if (event.dataTransfer.files.length > 0) for (const file of Array.from(event.dataTransfer.files)) attachments.push({
				name: file.name,
				type: file.type,
				size: file.size,
				data: file,
				source: "file-drop"
			});
			const jsonPayload = event.dataTransfer.getData("application/json");
			if (jsonPayload) try {
				const parsed = JSON.parse(jsonPayload);
				if (Array.isArray(parsed)) for (const item of parsed) attachments.push({
					name: String(item.name || "transfer"),
					type: String(item.type || "application/octet-stream"),
					size: Number(item.size || 0),
					data: item.data || item.content || "",
					source: String(item.source || "process-transfer")
				});
				else if (parsed && typeof parsed === "object") attachments.push({
					name: String(parsed.name || "transfer"),
					type: String(parsed.type || "application/octet-stream"),
					size: Number(parsed.size || 0),
					data: parsed.data || parsed.content || "",
					source: String(parsed.source || "process-transfer")
				});
			} catch {}
			if (attachments.length === 0) {
				const text = event.dataTransfer.getData("text/plain") || event.dataTransfer.getData("text/uri-list");
				if (text) attachments.push({
					name: "drop",
					type: "text/plain",
					size: text.length,
					data: text,
					source: "text-drop"
				});
			}
			if (attachments.length > 0) {
				proc.channel.post({
					type: "process-attach",
					pid: proc.pid,
					viewId: proc.viewId,
					attachments
				});
				await this.relayAttachmentsToView(proc, attachments, "drop");
			}
		});
	}
	focusProcess(pid, syncUrl) {
		const proc = this.processes.get(pid);
		if (!proc) return;
		proc.state = "open";
		proc.frame.hidden = false;
		this.activePid = proc.pid;
		const task = this.processTasks.get(proc.processId);
		if (task) task.lastActivePid = proc.pid;
		this.zCounter += 1;
		proc.frame.style.zIndex = String(this.zCounter);
		this.navigationState.previousView = this.navigationState.currentView;
		this.navigationState.currentView = proc.viewId;
		this.navigationState.params = proc.openParams.query;
		this.currentView.value = proc.viewId;
		proc.frameEl?.setTitle?.(toTitle(proc.viewId));
		for (const item of this.processes.values()) {
			const active = item.pid === proc.pid;
			item.frame.classList.toggle("is-active", active);
		}
		for (const taskItem of this.processTasks.values()) {
			const active = taskItem.lastActivePid === proc.pid;
			taskItem.dockItem.classList.toggle("is-active", active);
		}
		this.syncDockItemState(proc.processId);
		if (syncUrl) this.updateUrlState(proc.viewId, proc.pid, proc.openParams.query, true);
		this.updateStatusBar();
	}
	minimizeProcess(pid, syncUrl) {
		const proc = this.processes.get(pid);
		if (!proc) return;
		proc.state = "minimized";
		proc.frame.hidden = true;
		proc.frame.classList.remove("is-active");
		if (this.activePid === pid) {
			this.activePid = null;
			if (syncUrl) this.updateUrlState(this.navigationState.currentView, null, void 0, true);
		}
		this.syncDockItemState(proc.processId);
		this.updateStatusBar();
	}
	syncDockItemState(processId) {
		const task = this.processTasks.get(processId);
		if (!task) return;
		const dockItem = task.dockItem;
		const windows = [...task.instances].map((pid) => this.processes.get(pid)).filter((entry) => Boolean(entry));
		const openCount = windows.filter((entry) => entry.state === "open").length;
		const minimizedCount = windows.filter((entry) => entry.state === "minimized").length;
		const hasAny = windows.length > 0;
		const active = !!task.lastActivePid && this.activePid === task.lastActivePid;
		const state = task.headless && !hasAny ? "headless" : active ? "active" : openCount > 0 ? "open" : minimizedCount > 0 ? "minimized" : "idle";
		dockItem.dataset.windowState = state;
		dockItem.dataset.windowCount = String(windows.length);
		dockItem.setAttribute("aria-pressed", state === "active" || state === "open" ? "true" : "false");
		dockItem.classList.toggle("is-active", state === "active");
		dockItem.classList.toggle("is-open", state === "open" || state === "active");
		dockItem.classList.toggle("is-minimized", state === "minimized");
		dockItem.classList.toggle("is-headless", state === "headless");
	}
	updateUrlState(viewId, pid, params, replace = false) {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		const urlParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params || {})) {
			if (value == null) continue;
			if (key === "pid" || key === "minimized" || key === "headless" || key === "newTask") continue;
			urlParams.set(String(key), String(value));
		}
		const nextUrl = `/${urlParams.size > 0 ? `?${urlParams.toString()}` : ""}${pid ? `#${pid}` : ""}`;
		const nextState = {
			viewId,
			pid,
			params
		};
		(replace ? globalThis?.history?.replaceState : globalThis?.history?.pushState)?.call(globalThis.history, nextState, "", nextUrl);
	}
	generatePid(viewId) {
		this.pidCounter += 1;
		return `${String(viewId || "view").slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, "") || "pid"}-${this.pidCounter}`;
	}
	/**
	* Build a URL that loads a view in a dedicated shell (base or minimal).
	* Carries GET query params; POST body is stashed in sessionStorage.
	*/
	buildDedicatedViewUrl(viewId, shell, params, bodyToken) {
		const query = new URLSearchParams();
		query.set("shell", shell);
		for (const [key, value] of Object.entries(params || {})) {
			if (value == null) continue;
			if ([
				"pid",
				"minimized",
				"headless",
				"newTask",
				"windowType",
				"processId"
			].includes(key)) continue;
			query.set(String(key), String(value));
		}
		if (bodyToken) query.set("_bodyToken", bodyToken);
		const suffix = query.toString();
		return `/${String(viewId || "home")}${suffix ? `?${suffix}` : ""}`;
	}
	/**
	* Stash process state (POST body, viewer content, etc.) into sessionStorage
	* so the new browser window can hydrate the view with full context.
	*/
	stashProcessState(proc, viewId, body) {
		const nextParams = { ...proc?.openParams.query || {} };
		let bodyToken = null;
		if (viewId === "viewer" && proc?.viewId === "viewer") {
			const rawTarget = proc.frame.querySelector("[data-raw-target]");
			const content = String(rawTarget?.textContent || "").trim();
			if (content) {
				const token = `cw:detach:${viewId}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
				try {
					globalThis?.sessionStorage?.setItem?.(token, JSON.stringify({
						content,
						filename: String(nextParams.filename || ""),
						source: String(nextParams.source || nextParams.src || nextParams.path || "")
					}));
					nextParams.detachKey = token;
					delete nextParams.content;
				} catch {
					nextParams.content = content;
				}
			}
		}
		const bodyPayload = body ?? proc?.openParams.body;
		if (bodyPayload != null) {
			const token = `cw:body:${viewId}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
			try {
				const serialized = typeof bodyPayload === "string" ? bodyPayload : JSON.stringify(bodyPayload);
				globalThis?.sessionStorage?.setItem?.(token, serialized);
				bodyToken = token;
			} catch {}
		}
		return {
			params: nextParams,
			bodyToken
		};
	}
	/**
	* Open a view as a dedicated browser window/tab in base or minimal shell.
	* Transfers full process state (query params + POST body via sessionStorage).
	*/
	openProcessAsDedicatedWindow(viewId, params, shell = "base", procForDetach, body) {
		const proc = procForDetach ?? (this.activePid ? this.processes.get(this.activePid) : null);
		const { params: nextParams, bodyToken } = this.stashProcessState(proc?.viewId === viewId ? proc : null, viewId, body);
		Object.assign(nextParams, params || {});
		const url = this.buildDedicatedViewUrl(viewId, shell, nextParams, bodyToken);
		try {
			globalThis?.open?.(url, "_blank", "noopener,noreferrer");
		} catch (error) {
			console.warn(`[window] Failed to open ${shell} shell tab:`, error);
			this.showMessage("Unable to open separate tab");
		}
	}
	initStatusBar() {
		if (!this.statusContainer) this.bindOverlayChrome();
		if (!this.statusContainer) return;
		this.statusContainer.hidden = false;
		this.statusContainer.setAttribute("role", "status");
		this.updateStatusBar();
		if (this.statusTimer) clearInterval(this.statusTimer);
		this.statusTimer = setInterval(() => this.updateStatusBar(), 1e3);
	}
	updateStatusBar() {
		if (!this.statusContainer) return;
		const processes = [...this.processes.values()];
		const total = processes.length;
		const minimized = processes.filter((proc) => proc.state === "minimized").length;
		const processCount = this.processTasks.size;
		const active = this.activePid ? `${this.navigationState.currentView} #${this.activePid}` : String(this.navigationState.currentView || "home");
		const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		this.statusContainer.innerHTML = `
            <span class="app-window-shell__status-item"><b>Active:</b> ${active}</span>
            <span class="app-window-shell__status-item"><b>Processes:</b> ${processCount}</span>
            <span class="app-window-shell__status-item"><b>Windows:</b> ${total}</span>
            <span class="app-window-shell__status-item"><b>Minimized:</b> ${minimized}</span>
            <span class="app-window-shell__status-spacer"></span>
            <span class="app-window-shell__status-item">${time}</span>
        `;
	}
	toggleMaximize(frame) {
		if (frame.classList.contains("is-maximized")) {
			const prevShiftX = frame.dataset.prevShiftX || "0px";
			const prevShiftY = frame.dataset.prevShiftY || "0px";
			const prevWidth = frame.dataset.prevWidth || "640px";
			const prevHeight = frame.dataset.prevHeight || "480px";
			frame.style.setProperty("--shift-x", prevShiftX);
			frame.style.setProperty("--shift-y", prevShiftY);
			frame.style.setProperty("--initial-inline-size", prevWidth);
			frame.style.setProperty("--initial-block-size", prevHeight);
			frame.style.setProperty("--resize-x", "0px");
			frame.style.setProperty("--resize-y", "0px");
			frame.classList.remove("is-maximized");
			return;
		}
		frame.dataset.prevShiftX = frame.style.getPropertyValue("--shift-x") || "0px";
		frame.dataset.prevShiftY = frame.style.getPropertyValue("--shift-y") || "0px";
		frame.dataset.prevWidth = frame.style.getPropertyValue("--initial-inline-size") || "640px";
		frame.dataset.prevHeight = frame.style.getPropertyValue("--initial-block-size") || "480px";
		frame.style.setProperty("--shift-x", "0px");
		frame.style.setProperty("--shift-y", "0px");
		frame.style.setProperty("--initial-inline-size", "100%");
		frame.style.setProperty("--initial-block-size", "100%");
		frame.style.setProperty("--resize-x", "0px");
		frame.style.setProperty("--resize-y", "0px");
		frame.classList.add("is-maximized");
	}
	bindOverlayChrome() {
		const overlayLayer = document.querySelector("[data-app-layer=\"overlay\"]");
		if (overlayLayer) {
			overlayLayer.querySelector("cw-app-dock[data-window-dock]")?.remove();
			overlayLayer.querySelector("cw-status-bar[data-window-status]")?.remove();
		}
		const shellLayer = document.querySelector("[data-app-layer=\"shell\"]");
		if (!shellLayer) return;
		shellLayer.style.pointerEvents = shellLayer.style.pointerEvents || "none";
		if (!this.dockElement) {
			let dock = shellLayer.querySelector("cw-app-dock[data-window-dock]");
			if (!dock) {
				dock = document.createElement("cw-app-dock");
				dock.setAttribute("data-window-dock", "true");
				dock.className = "app-window-shell__dock";
				dock.setAttribute("aria-label", "Window dock");
				dock.style.pointerEvents = "auto";
				shellLayer.appendChild(dock);
			}
			dock.style.display = "flex";
			dock.style.position = "relative";
			dock.style.gridColumn = "content-column";
			dock.style.gridRow = "dock-row";
			dock.style.zIndex = "3";
			dock.style.minBlockSize = "50px";
			dock.style.padding = "0.35rem 0.6rem 0.4rem";
			dock.style.alignItems = "center";
			dock.style.gap = "0.45rem";
			dock.style.flexWrap = "nowrap";
			dock.style.justifyContent = "center";
			dock.style.background = "light-dark(rgba(245,247,252,0.75), rgba(12,16,28,0.55))";
			dock.style.borderBlockStart = "1px solid light-dark(rgba(0,0,0,0.08), rgba(130,160,235,0.1))";
			dock.style.backdropFilter = "blur(24px) saturate(1.25)";
			dock.style.color = "light-dark(var(--color-on-surface, #1a1c2b), var(--color-on-surface, #e8eefc))";
			dock.innerHTML = `
                <div class="app-window-shell__dock-start" data-dock-start></div>
                <div class="app-window-shell__dock-apps" data-dock-apps></div>
                <div class="app-window-shell__dock-quick" data-dock-quick></div>
            `;
			this.dockStartElement = dock.querySelector("[data-dock-start]");
			this.dockAppsElement = dock.querySelector("[data-dock-apps]");
			this.dockQuickElement = dock.querySelector("[data-dock-quick]");
			this.renderDockControls();
			this.dockElement = dock;
		}
		if (!this.statusContainer) {
			let status = shellLayer.querySelector("cw-status-bar[data-window-status]");
			if (!status) {
				status = document.createElement("cw-status-bar");
				status.setAttribute("data-window-status", "true");
				status.className = "app-window-shell__status";
				status.setAttribute("aria-live", "polite");
				status.style.pointerEvents = "auto";
				shellLayer.appendChild(status);
			}
			status.style.pointerEvents = "none";
			status.style.display = "flex";
			status.style.position = "relative";
			status.style.gridColumn = "content-column";
			status.style.gridRow = "status-row";
			status.style.zIndex = "3";
			status.style.minBlockSize = "26px";
			status.style.padding = "0.2rem 0.65rem";
			status.style.alignItems = "center";
			status.style.gap = "0.55rem";
			status.style.fontSize = "0.72rem";
			status.style.color = "light-dark(color-mix(in oklab, var(--color-on-surface, #1a1c2b) 75%, transparent), color-mix(in oklab, var(--color-on-surface, #e8eefc) 75%, transparent))";
			status.style.background = "light-dark(rgba(245,247,252,0.6), rgba(12,16,28,0.35))";
			status.style.backdropFilter = "blur(16px) saturate(1.1)";
			status.style.borderBlockStart = "1px solid light-dark(rgba(0,0,0,0.06), rgba(255,255,255,0.04))";
			this.statusContainer = status;
		}
	}
	renderDockControls() {
		if (!this.dockStartElement || !this.dockQuickElement || !this.dockAppsElement) return;
		this.dockStartElement.innerHTML = `
            <button type="button" class="app-window-shell__dock-item app-window-shell__dock-item--icon app-window-shell__dock-item--start" data-dock-action="start" title="Start" aria-label="Start">
                <ui-icon icon="squares-four"></ui-icon>
            </button>
        `;
		this.dockQuickElement.innerHTML = `
            <button type="button" class="app-window-shell__dock-item app-window-shell__dock-item--icon app-window-shell__dock-item--quick" data-dock-action="quick-settings" title="Quick settings" aria-label="Quick settings">
                <ui-icon icon="sliders-horizontal"></ui-icon>
            </button>
        `;
		const pinned = this.pinnedViews.map((viewId) => `
            <button
                type="button"
                class="app-window-shell__dock-item app-window-shell__dock-item--icon app-window-shell__dock-item--pinned"
                data-dock-action="open-pinned"
                data-view-id="${viewId}"
                title="${toTitle(viewId)}"
                aria-label="${toTitle(viewId)}"
            >
                <ui-icon icon="${iconForView(viewId)}"></ui-icon>
            </button>
        `).join("");
		this.dockAppsElement.insertAdjacentHTML("afterbegin", pinned);
		this.dockElement?.addEventListener("click", (event) => {
			const target = event.target?.closest?.("[data-dock-action], [data-window-dock-item]");
			if (!target) return;
			const action = target.dataset.dockAction || "";
			if (action === "start") {
				this.navigate("home");
				return;
			}
			if (action === "quick-settings") {
				this.showMessage("Quick settings: WIP");
				return;
			}
			if (action === "open-pinned") {
				const viewId = target.dataset.viewId || "home";
				const linkedProcessId = target.dataset.processId;
				if (linkedProcessId) {
					const linkedTask = this.processTasks.get(linkedProcessId);
					if (linkedTask) {
						const pid = linkedTask.lastActivePid || [...linkedTask.instances][0];
						if (pid && this.processes.has(pid)) {
							const proc = this.processes.get(pid);
							if (this.activePid === pid && proc.state === "open" && !proc.frame.hidden) {
								this.minimizeProcess(pid, true);
								return;
							}
							proc.state = "open";
							proc.frame.hidden = false;
							this.focusProcess(pid, true);
							return;
						}
					}
				}
				this.navigate(viewId);
				return;
			}
			const processId = target.dataset.processId || "";
			if (!processId) return;
			const task = this.processTasks.get(processId);
			if (!task) return;
			const pid = task.lastActivePid || [...task.instances][0];
			if (pid && this.processes.has(pid)) {
				const proc = this.processes.get(pid);
				if (this.activePid === pid && proc.state === "open" && !proc.frame.hidden) {
					this.minimizeProcess(pid, true);
					return;
				}
				proc.state = "open";
				proc.frame.hidden = false;
				this.focusProcess(pid, true);
			} else this.openWindowProcess(task.viewId, task.openParams.query || {});
		});
	}
};
//#endregion
//#region src/frontend/shells/content/index.ts
/**
* Content shell: CRX/content-script focused host.
* It keeps window/task behavior but never mounts desktop chrome bars.
*/
var ContentShell = class extends WindowShell {
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: true,
		supportsWindowing: true
	};
	id = "content";
	name = "Content";
	shouldRenderDesktopChrome() {
		return false;
	}
};
function createShell(_container) {
	return new ContentShell();
}
//#endregion
export { ContentShell, createShell, createShell as default };
