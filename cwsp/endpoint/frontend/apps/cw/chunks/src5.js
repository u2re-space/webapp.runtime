import { A as isInFocus, C as MOCElement, a as handleStyleChange, g as removeAdopted, h as preloadStyle, p as loadAsAdopted, w as addEvent } from "../fest/dom.js";
import { c as ref, n as affected, o as observe, s as propRef } from "../fest/object.js";
import { t as isUserScopePath } from "../fest/core.js";
import { r as createProtocolEnvelope } from "../fest/uniform.js";
import { d as sendProtocolMessage } from "./UnifiedMessaging.js";
import { A as ctxMenuTrigger, F as bindWith, M as defineElement, N as property, O as initGlobalClipboard, P as H, _ as readFile, b as writeFile, d as getDirectoryHandle, f as getFileHandle, g as provide, h as openDirectory, j as GLitElement, l as downloadFile, m as handleIncomingEntries, p as getMimeTypeByFilename, s as normalizeDataAsset, u as getDir, v as remove, y as uploadFile } from "../vendor/jsox.js";
import { a as persistSpeedDialItems, i as ensureSpeedDialMeta, o as persistSpeedDialMeta, r as createEmptySpeedDialItem, s as speedDialItems, t as addSpeedDialItem } from "./StateStorage.js";
import { a as ensureStyleSheet } from "../fest/icon.js";
import { t as createViewConstructor } from "./registry.js";
import { r as ExplorerChannelAction } from "./channel-actions.js";
import { a as setString, r as getString, t as StorageKeys } from "../com/app2.js";
import { t as __decorate } from "./decorate.js";
//#region ../../modules/projects/subsystem/src/routing/channel/UniformViewTransport.ts
var asNamePrefix = (source) => {
	return String(source || "attachment").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "attachment";
};
var normalizeIpcAttachments = async (inputs, source = "view-ipc") => {
	const out = [];
	for (const raw of inputs) {
		const candidate = raw && typeof raw === "object" && "data" in raw ? raw.data : raw;
		if (!candidate) continue;
		try {
			const inferredSource = raw && typeof raw === "object" && "source" in raw ? String(raw.source || source) : source;
			const asset = await normalizeDataAsset(candidate, {
				namePrefix: asNamePrefix(inferredSource),
				uriComponent: true
			});
			out.push({
				hash: String(asset.hash || ""),
				name: String(asset.name || asset.file?.name || "attachment"),
				mimeType: String(asset.mimeType || asset.type || asset.file?.type || "application/octet-stream"),
				size: Number(asset.size || asset.file?.size || 0),
				source: inferredSource,
				data: asset.file
			});
		} catch (error) {
			console.warn("[UniformViewTransport] Attachment normalization failed:", error);
		}
	}
	return out;
};
var sendViewProtocolMessage = async (input) => {
	const attachments = await normalizeIpcAttachments(input.attachments || [], input.source);
	const data = {
		...input.data || {},
		...attachments.length > 0 ? {
			attachments,
			file: attachments[0]?.data,
			files: attachments.map((entry) => entry.data)
		} : {}
	};
	return sendProtocolMessage(createProtocolEnvelope({
		type: input.type,
		source: input.source,
		destination: input.destination,
		contentType: input.contentType,
		data,
		purpose: input.purpose || (attachments.length > 0 ? ["attach", "deliver"] : ["deliver", "mail"]),
		protocol: "window",
		op: input.op || (attachments.length > 0 ? "attach" : "deliver"),
		srcChannel: input.source,
		dstChannel: input.destination,
		metadata: {
			...input.metadata || {},
			attachmentCount: attachments.length
		}
	}));
};
//#endregion
//#region ../../modules/views/explorer-view/src/inject.ts
/** Merge inject layers: menu items concatenate; handlers shallow-merge last-wins; onWire chains in order. */
function mergeExplorerInject(...layers) {
	const defined = layers.filter(Boolean);
	if (!defined.length) return void 0;
	return {
		extraBackgroundMenuItems: (ctx) => defined.flatMap((l) => l.extraBackgroundMenuItems?.(ctx) ?? []),
		contextActionHandlers: defined.reduce((acc, l) => ({
			...acc,
			...l.contextActionHandlers ?? {}
		}), {}),
		onWire: (fm, root) => {
			for (const l of defined) l.onWire?.(fm, root);
		}
	};
}
var registered;
/** App-wide explorer hooks (boot/plugins). */
function registerExplorerInject(api) {
	registered = api;
}
function getRegisteredExplorerInject() {
	return registered;
}
//#endregion
//#region ../../modules/views/explorer-view/src/utils.ts
var openExplorerContextMenu = (x, y, items) => {
	const menu = document.createElement("div");
	menu.className = "rs-explorer-context-menu";
	menu.setAttribute("role", "menu");
	const closeMenu = () => {
		document.removeEventListener("click", onDocClick, true);
		document.removeEventListener("keydown", onKey, true);
		menu.remove();
	};
	const onDocClick = (ev) => {
		if (!menu.contains(ev.target)) closeMenu();
	};
	const onKey = (ev) => {
		if (ev.key === "Escape") {
			ev.preventDefault();
			closeMenu();
		}
	};
	for (const item of items) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "rs-explorer-context-menu__item";
		button.textContent = item.label;
		button.addEventListener("click", () => {
			item.action();
			closeMenu();
		});
		menu.append(button);
	}
	document.body.append(menu);
	menu.style.setProperty("position", "fixed");
	menu.style.setProperty("margin", "0");
	menu.style.setProperty("box-sizing", "border-box");
	menu.style.setProperty("z-index", "10050");
	const pad = 8;
	const vw = globalThis.innerWidth;
	const vh = globalThis.innerHeight;
	let left = x;
	let top = y;
	const rect = menu.getBoundingClientRect();
	if (left + rect.width > vw - pad) left = Math.max(pad, vw - rect.width - pad);
	if (top + rect.height > vh - pad) top = Math.max(pad, vh - rect.height - pad);
	menu.style.left = `${left}px`;
	menu.style.top = `${top}px`;
	requestAnimationFrame(() => {
		const r2 = menu.getBoundingClientRect();
		let l2 = left;
		let t2 = top;
		if (l2 + r2.width > vw - pad) l2 = Math.max(pad, vw - r2.width - pad);
		if (t2 + r2.height > vh - pad) t2 = Math.max(pad, vh - r2.height - pad);
		menu.style.left = `${l2}px`;
		menu.style.top = `${t2}px`;
	});
	queueMicrotask(() => {
		document.addEventListener("click", onDocClick, true);
	});
	document.addEventListener("keydown", onKey, true);
};
var requestOpenView = (request) => {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target: request?.target || "window",
		params: request?.params || {}
	} }));
};
var TEXT_FILE_EXTENSIONS = new Set([
	"md",
	"markdown",
	"txt",
	"text",
	"json",
	"xml",
	"yml",
	"yaml",
	"html",
	"htm",
	"css",
	"js",
	"mjs",
	"cjs",
	"ts",
	"tsx",
	"jsx",
	"log",
	"ini",
	"conf",
	"cfg",
	"csv"
]);
var buildExplorerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `explorer-${String(path || "root").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "root"}-${stamp}-${suffix}`;
};
var extOf = (filename = "") => {
	const next = String(filename).trim().toLowerCase();
	const idx = next.lastIndexOf(".");
	if (idx <= 0 || idx >= next.length - 1) return "";
	return next.slice(idx + 1);
};
var isTextLikeFile = (file) => {
	if (!file) return false;
	const type = String(file.type || "").toLowerCase();
	if (!type || type.startsWith("text/")) return true;
	if (type.includes("markdown") || type.includes("json") || type.includes("xml")) return true;
	return TEXT_FILE_EXTENSIONS.has(extOf(file.name || ""));
};
var buildViewerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `viewer-${String(path || "viewer").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "viewer"}-${stamp}-${suffix}`;
};
var guessNextShortcutCell = () => {
	const occupied = new Set(Array.from(speedDialItems ?? []).map((item) => `${Math.round(item?.cell?.[0] || 0)}:${Math.round(item?.cell?.[1] || 0)}`));
	const maxRows = 12;
	const maxCols = 8;
	for (let row = 0; row < maxRows; row += 1) for (let col = 0; col < maxCols; col += 1) {
		const key = `${col}:${row}`;
		if (!occupied.has(key)) return [col, row];
	}
	return [0, 0];
};
//#endregion
//#region ../../modules/views/explorer-view/src/runtime.ts
function loadLastPath(explorer, initialPath) {
	if (initialPath && initialPath.trim()) {
		explorer.path = initialPath.trim();
		return;
	}
	const persisted = String(getString(StorageKeys.EXPLORER_PATH, "/user/") || "").trim();
	explorer.path = !persisted || persisted === "/" ? "/user/" : persisted;
}
function setupExplorerEvents(explorer, opts, inject, signal) {
	const listenerOpts = { signal };
	const showMessage = (message) => opts.shellContext?.showMessage?.(message);
	const openFileInViewer = async (item, fullPath, target = "window") => {
		const file = item?.file;
		if (!file || !isTextLikeFile(file)) return false;
		const sourcePath = String(fullPath || "");
		if (target === "base") {
			requestOpenView({
				viewId: "viewer",
				target: "base",
				params: {
					src: sourcePath,
					filename: file.name || "",
					processId: buildViewerProcessId(sourcePath)
				}
			});
			return true;
		}
		const processId = buildViewerProcessId(sourcePath);
		requestOpenView({
			viewId: "viewer",
			target: "window",
			params: {
				processId,
				src: sourcePath,
				filename: file.name || ""
			}
		});
		try {
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer",
				destination: "viewer",
				contentType: file.type || "text/plain",
				attachments: [{
					data: file,
					source: "explorer-viewer-open"
				}],
				data: {
					filename: file.name,
					path: sourcePath,
					source: sourcePath
				},
				metadata: {
					processId,
					openTarget: "window"
				}
			})) showMessage("Viewer is not ready yet, retrying in background");
		} catch (error) {
			console.warn("[Explorer] Failed to send viewer payload:", error);
		}
		return true;
	};
	const attachToWorkCenter = async (item, mode) => {
		const file = item?.file;
		if (!file) {
			showMessage("No file selected");
			return;
		}
		const sourcePath = `${explorer?.path || "/"}${item?.name || file.name}`;
		if (mode === "headless") requestOpenView({
			viewId: "workcenter",
			target: "headless",
			params: {
				queue: "1",
				mode: "headless",
				sourcePath
			}
		});
		else if (mode === "active") requestOpenView({
			viewId: "workcenter",
			target: "window"
		});
		else requestOpenView({
			viewId: "workcenter",
			target: "window",
			params: {
				minimized: "1",
				queue: "1",
				sourcePath
			}
		});
		if (await sendViewProtocolMessage({
			type: "content-share",
			source: "explorer",
			destination: "workcenter",
			contentType: file.type || "application/octet-stream",
			attachments: [{
				data: file,
				source: "explorer-workcenter-attach"
			}],
			data: {
				filename: file.name,
				path: sourcePath,
				source: "explorer-attach",
				queued: mode !== "active"
			},
			metadata: {
				queueState: mode === "active" ? "awaiting" : mode === "queued" ? "pending" : "queued",
				mode,
				sourcePath
			}
		})) showMessage(mode === "active" ? `Attached ${file.name} to Work Center` : `Queued ${file.name} for Work Center (${mode})`);
		else showMessage("Work Center queue is unavailable");
	};
	const pinToHome = (item) => {
		const file = item?.file;
		const name = String(item?.name || file?.name || "").trim();
		if (!name) {
			showMessage("Nothing to pin");
			return;
		}
		const path = `${explorer?.path || "/"}${name}`;
		const shortcut = createEmptySpeedDialItem(observe(guessNextShortcutCell()));
		shortcut.label.value = name;
		shortcut.icon.value = item?.kind === "directory" ? "folder" : "file-text";
		shortcut.action = "open-link";
		addSpeedDialItem(shortcut);
		const meta = ensureSpeedDialMeta(shortcut.id, { action: "open-link" });
		meta.action = "open-link";
		meta.href = path;
		meta.description = `Pinned from Explorer: ${path}`;
		persistSpeedDialItems();
		persistSpeedDialMeta();
		showMessage(`Pinned ${name} to Home`);
	};
	const getItemPath = (item) => `${explorer?.path || "/"}${item?.name || ""}`;
	const mergedHandlers = {
		view: async (item) => {
			await openFileInViewer(item, getItemPath(item), "window");
		},
		"view-base": async (item) => {
			await openFileInViewer(item, getItemPath(item), "base");
		},
		"attach-workcenter": (item) => attachToWorkCenter(item, "active"),
		"attach-workcenter-queued": (item) => attachToWorkCenter(item, "queued"),
		"attach-workcenter-headless": (item) => attachToWorkCenter(item, "headless"),
		"pin-home": (item) => pinToHome(item),
		...inject?.contextActionHandlers ?? {}
	};
	const onFileOpen = async (e) => {
		const { item, path } = e.detail || {};
		if (item?.kind !== "file" || !item?.file) return;
		if (!await openFileInViewer(item, path, "window")) requestOpenView({
			viewId: "workcenter",
			target: "window"
		});
	};
	explorer.addEventListener("open-item", onFileOpen, listenerOpts);
	explorer.addEventListener("open", onFileOpen, listenerOpts);
	explorer.addEventListener("rs-open", onFileOpen, listenerOpts);
	const savePath = () => {
		setString(StorageKeys.EXPLORER_PATH, explorer.path || "/user/");
	};
	explorer.addEventListener("entries-updated", savePath, listenerOpts);
	explorer.addEventListener("rs-navigate", savePath, listenerOpts);
	explorer.addEventListener("context-action", async (event) => {
		const detail = event.detail || {};
		const action = String(detail.action || "");
		const item = detail.item;
		if (!action) return;
		const handler = mergedHandlers[action];
		if (!handler) return;
		await handler(item);
	}, listenerOpts);
	explorer.addEventListener("contextmenu", (event) => {
		if ((event.composedPath?.() || []).some((node) => {
			const el = node;
			if (!el || typeof el.classList?.contains !== "function") return false;
			return el.classList.contains("row") || el.classList.contains("action-btn") || el.classList.contains("ctx-menu");
		})) return;
		event.preventDefault();
		const path = explorer?.path || "/";
		const extra = inject?.extraBackgroundMenuItems?.({ path }) ?? [];
		openExplorerContextMenu(event.clientX, event.clientY, [
			{
				id: "refresh",
				label: "Refresh",
				icon: "arrows-clockwise",
				action: () => {
					explorer.navigate(path);
				}
			},
			{
				id: "open-new-explorer",
				label: "New Explorer window",
				icon: "books",
				action: () => requestOpenView({
					viewId: "explorer",
					target: "window",
					params: {
						path,
						processId: buildExplorerProcessId(path)
					}
				})
			},
			{
				id: "open-home",
				label: "Go to Home",
				icon: "house",
				action: () => opts.shellContext?.navigate?.("home")
			},
			...extra
		]);
	}, listenerOpts);
}
function setupFallbackExplorerEvents(shellRoot, opts, signal) {
	const listenerOpts = { signal };
	const showMessage = (msg) => opts.shellContext?.showMessage?.(msg);
	const filesList = shellRoot.querySelector("[data-fallback-files]");
	const pickBtn = shellRoot.querySelector("[data-action=\"pick-files\"]");
	const workBtn = shellRoot.querySelector("[data-action=\"open-workcenter\"]");
	if (!pickBtn || !filesList) return;
	const input = document.createElement("input");
	input.type = "file";
	input.multiple = true;
	input.accept = ".md,.markdown,.txt,.json,.xml,.yaml,.yml,.csv,.log,text/*";
	input.style.display = "none";
	shellRoot.append(input);
	pickBtn.addEventListener("click", () => input.click(), listenerOpts);
	workBtn?.addEventListener("click", () => requestOpenView({
		viewId: "workcenter",
		target: "window"
	}), listenerOpts);
	input.addEventListener("change", async () => {
		const files = Array.from(input.files || []);
		filesList.replaceChildren();
		if (files.length === 0) return;
		for (const file of files) {
			const li = document.createElement("li");
			li.textContent = file.name;
			filesList.append(li);
		}
		const firstTextLike = files.find((file) => isTextLikeFile(file));
		if (firstTextLike) {
			requestOpenView({
				viewId: "viewer",
				target: "window"
			});
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer-fallback",
				destination: "viewer",
				contentType: firstTextLike.type || "text/plain",
				attachments: [{
					data: firstTextLike,
					source: "explorer-fallback"
				}],
				data: {
					filename: firstTextLike.name,
					source: "explorer-fallback"
				}
			})) showMessage("Viewer is not ready yet");
		}
	}, listenerOpts);
}
/**
* Attach explorer behaviors to `shellRoot` (`.view-explorer`). Returns cleanup and the file manager host if present.
*/
function wireExplorerSubtree(shellRoot, wireOpts) {
	const injectMerged = mergeExplorerInject(getRegisteredExplorerInject(), wireOpts.inject);
	const ac = new AbortController();
	const { signal } = ac;
	const fm = shellRoot.querySelector("ui-file-manager");
	injectMerged?.onWire?.(fm, shellRoot);
	if (fm) {
		loadLastPath(fm, wireOpts.initialPath ?? null);
		setupExplorerEvents(fm, wireOpts, injectMerged, signal);
		return {
			cleanup: () => {
				setString(StorageKeys.EXPLORER_PATH, fm.path || "/user/");
				ac.abort();
			},
			fileManager: fm
		};
	}
	setupFallbackExplorerEvents(shellRoot, wireOpts, signal);
	return {
		cleanup: () => ac.abort(),
		fileManager: null
	};
}
//#endregion
//#region ../../modules/views/explorer-view/src/ts/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	constructor() {
		super();
		this.theme = "default";
		this.render = function() {
			return H`<slot></slot>`;
		};
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
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
//#endregion
//#region ../../modules/views/explorer-view/src/scss/FileManagerContent.scss?inline
var FileManagerContent_default$1 = "@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon img,ui-icon svg{block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);contain:none;container-type:size;display:block;grid-column:1/-1;inline-size:stretch;isolation:isolate;margin:0;overflow:auto;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:stretch;contain:strict;contain-intrinsic-size:1px 2.625rem;content-visibility:auto;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:stretch;min-block-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) a,:host(ui-file-manager-content) :where(.row) span{background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:8}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}";
//#endregion
//#region ../../modules/views/explorer-view/src/ts/Operative.ts
var handleCache = /* @__PURE__ */ new WeakMap();
var waitForClipboardFrame = () => new Promise((resolve) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(() => resolve());
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => resolve();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => resolve(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => resolve());
		return;
	}
	resolve();
});
var ASSETS_ROOT = "/assets/";
var ASSET_SEED_PATHS = [
	"/assets/crossword.css",
	"/assets/icons/",
	"/assets/imgs/",
	"/assets/wallpapers/"
];
var ASSET_ICON_STYLES = [
	"thin",
	"light",
	"regular",
	"bold",
	"fill",
	"duotone"
];
var ASSET_ICON_FALLBACK_NAMES = [
	"copy",
	"clipboard",
	"trash",
	"folder",
	"folder-open",
	"download",
	"upload",
	"arrow-up",
	"arrow-clockwise",
	"code",
	"eye",
	"gear",
	"printer",
	"file-doc",
	"file-text",
	"lightning",
	"pencil",
	"clock-counter-clockwise"
];
var normalizeDirectoryPath = (input) => {
	const value = (input || "/").trim() || "/";
	const withLeading = value.startsWith("/") ? value : `/${value}`;
	return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
};
var isAssetsPath = (path) => normalizeDirectoryPath(path).startsWith(ASSETS_ROOT);
var isVirtualRootPath = (path) => normalizeDirectoryPath(path) === "/";
var isReadonlyPath = (path) => isAssetsPath(path) || isVirtualRootPath(path);
var isIconsPath = (path) => normalizeDirectoryPath(path).startsWith("/assets/icons/");
var isUserPath = (path) => isUserScopePath(normalizeDirectoryPath(path));
var buildVirtualAssetPaths = (path) => {
	const target = normalizeDirectoryPath(path);
	const paths = /* @__PURE__ */ new Set();
	if (!isIconsPath(target)) return [];
	paths.add("/assets/icons/");
	paths.add("/assets/icons/phosphor/");
	paths.add("/assets/icons/duotone/");
	for (const style of ASSET_ICON_STYLES) {
		paths.add(`/assets/icons/phosphor/${style}/`);
		paths.add(`/assets/icons/${style}/`);
	}
	const addIconFiles = (base) => {
		for (const iconName of ASSET_ICON_FALLBACK_NAMES) paths.add(`${base}${iconName}.svg`);
	};
	if (target === "/assets/icons/" || target === "/assets/icons/duotone/") addIconFiles("/assets/icons/duotone/");
	if (target.startsWith("/assets/icons/phosphor/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 4) {
			const style = parts[3];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/phosphor/${style}/`);
		}
	}
	if (target.startsWith("/assets/icons/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 3) {
			const style = parts[2];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/${style}/`);
		}
	}
	return Array.from(paths);
};
var FileOperative = class {
	#entries = ref([]);
	#loading = ref(false);
	#error = ref("");
	#fsRoot = null;
	#dirProxy = null;
	#loadLock = false;
	#clipboard = null;
	#subscribed = null;
	#loaderDebounceTimer = null;
	#readonly = ref(false);
	get path() {
		return this.pathRef?.value || "/";
	}
	set path(value) {
		if (this.pathRef) this.pathRef.value = value || "/";
	}
	get entries() {
		return this.#entries;
	}
	get readonly() {
		return this.#readonly?.value === true;
	}
	constructor() {
		this.host = null;
		this.pathRef = ref("/");
		this.onRowClick = (item, ev) => {
			ev.preventDefault();
			this.itemAction(item);
		};
		this.onRowDblClick = (item, ev) => {
			ev.preventDefault();
			this.itemAction(item);
		};
		this.onRowDragStart = (item, ev) => {
			if (!ev.dataTransfer) return;
			ev.dataTransfer.effectAllowed = "copyMove";
			const abs = (this.path || "/") + (item?.name || "");
			ev.dataTransfer.setData("text/plain", abs);
			ev.dataTransfer.setData("text/uri-list", abs);
			if (item?.file) {
				ev.dataTransfer.setData("DownloadURL", item?.file?.type + ":" + item?.file?.name + ":" + URL.createObjectURL(item?.file));
				ev.dataTransfer.items.add(item?.file);
			}
		};
		this.#entries = ref([]);
		this.pathRef ??= ref("/");
		affected(this.pathRef, (path) => {
			this.#readonly.value = isReadonlyPath(path || "/");
			this.loadPath(path || "/");
		});
		navigator?.storage?.getDirectory?.()?.then?.((h) => {
			this.#fsRoot = h;
			this.refreshList(this.path || "/");
		});
	}
	async listAssetEntries(path) {
		const target = normalizeDirectoryPath(path);
		const knownPaths = new Set(ASSET_SEED_PATHS);
		for (const virtualPath of buildVirtualAssetPaths(target)) knownPaths.add(virtualPath);
		try {
			const cacheNames = await caches.keys();
			for (const cacheName of cacheNames) try {
				const requests = await (await caches.open(cacheName)).keys();
				for (const req of requests) {
					const pathname = new URL(req.url).pathname;
					if (pathname.startsWith(ASSETS_ROOT)) knownPaths.add(pathname);
				}
			} catch {}
		} catch {}
		const dirs = /* @__PURE__ */ new Set();
		const files = [];
		for (const full of knownPaths) {
			const normalized = full.startsWith("/") ? full : `/${full}`;
			if (!normalized.startsWith(target)) continue;
			const remainder = normalized.slice(target.length);
			if (!remainder) continue;
			const [firstSegment, ...rest] = remainder.split("/").filter(Boolean);
			if (!firstSegment) continue;
			if (rest.length > 0 || normalized.endsWith("/")) dirs.add(firstSegment);
			else files.push(firstSegment);
		}
		const directoryEntries = Array.from(dirs).sort((a, b) => a.localeCompare(b)).map((name) => observe({
			name,
			kind: "directory"
		}));
		const fileEntries = Array.from(new Set(files)).filter((name) => !dirs.has(name)).sort((a, b) => a.localeCompare(b)).map((name) => {
			const item = observe({
				name,
				kind: "file"
			});
			item.type = getMimeTypeByFilename?.(name);
			return item;
		});
		return [...directoryEntries, ...fileEntries];
	}
	listVirtualRootEntries() {
		return [observe({
			name: "user",
			kind: "directory"
		}), observe({
			name: "assets",
			kind: "directory"
		})];
	}
	detachDirectoryObservers() {
		if (this.#loaderDebounceTimer) {
			clearTimeout(this.#loaderDebounceTimer);
			this.#loaderDebounceTimer = null;
		}
		if (typeof this.#subscribed === "function") {
			this.#subscribed();
			this.#subscribed = null;
		}
		if (this.#dirProxy?.dispose) this.#dirProxy.dispose();
		this.#dirProxy = null;
	}
	async collectDirectoryEntries() {
		const source = await this.#dirProxy?.entries?.();
		let pairs = [];
		if (Array.isArray(source)) pairs = source;
		else if (source && typeof source[Symbol.iterator] === "function") pairs = Array.from(source);
		else if (source && typeof source[Symbol.asyncIterator] === "function") for await (const pair of source) pairs.push(pair);
		return (await Promise.all((pairs || []).map(async ($pair) => {
			return Promise.try(async () => {
				const [name, handle] = $pair;
				return handleCache?.getOrInsertComputed?.(handle, async () => {
					const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
					const item = observe({
						name,
						kind,
						handle
					});
					if (kind === "file") {
						item.type = getMimeTypeByFilename?.(name);
						try {
							const f = await handle?.getFile?.();
							item.file = f;
							item.size = f?.size;
							item.lastModified = f?.lastModified;
							item.type = f?.type || item.type;
						} catch {}
					}
					return item;
				});
			})?.catch?.(console.warn.bind(console));
		})))?.filter?.(($item) => $item != null) || [];
	}
	async getDirectoryHandleByPath(path, create = false) {
		const root = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		if (!root) return null;
		const parts = normalizeDirectoryPath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	normalizeUserRelativePath(path) {
		const normalized = normalizeDirectoryPath(path);
		if (normalized === "/user/") return "/";
		if (normalized.startsWith("/user/")) return normalized.slice(5);
		return normalized;
	}
	async getOpfsRootHandle() {
		this.#fsRoot = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		return this.#fsRoot;
	}
	async getUserDirHandle(path, create = false) {
		const root = await this.getOpfsRootHandle();
		if (!root) return null;
		const parts = this.normalizeUserRelativePath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	async writeUserFile(file, destPath = this.path) {
		const dir = await this.getUserDirHandle(destPath, true);
		if (!dir) return;
		const safeName = (file?.name || `file-${Date.now()}`).trim().replace(/\s+/g, "-");
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(file);
		await writable.close();
	}
	/**
	* Imperative save API for shells/channels — writes into the OPFS-backed workspace folder.
	* Defaults to {@link FileOperative.path}; optional `destPath` overrides the parent directory.
	*/
	async ingestFileIntoWorkspace(file, destPath) {
		await this.writeUserFile(file, destPath ?? this.path);
	}
	async removeUserEntry(absPath, recursive = true) {
		const root = await this.getOpfsRootHandle();
		if (!root) return false;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return false;
		const name = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		await dir.removeEntry(name, { recursive });
		return true;
	}
	async renameUserFile(absPath, newName) {
		const root = await this.getOpfsRootHandle();
		if (!root) return;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return;
		const oldName = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		const oldFile = await (await dir.getFileHandle(oldName, { create: false })).getFile();
		const safeName = (newName || "").trim().replace(/\s+/g, "-");
		if (!safeName || safeName === oldName) return;
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(oldFile);
		await writable.close();
		await dir.removeEntry(oldName);
	}
	async extractFilesFromData(data) {
		const files = [];
		const now = Date.now();
		const extByMime = (mime) => {
			const m = (mime || "").toLowerCase();
			if (m.includes("css")) return "css";
			if (m.includes("json")) return "json";
			if (m.includes("markdown")) return "md";
			if (m.includes("svg")) return "svg";
			if (m.includes("png")) return "png";
			if (m.includes("jpeg") || m.includes("jpg")) return "jpg";
			if (m.includes("gif")) return "gif";
			if (m.includes("webp")) return "webp";
			if (m.includes("plain")) return "txt";
			return "bin";
		};
		const nativeFiles = Array.from(data?.files ?? []).filter((f) => f instanceof File);
		files.push(...nativeFiles);
		const items = Array.from(data?.items ?? []);
		for (const item of items) {
			if (item?.kind === "file" && typeof item?.getAsFile === "function") {
				const f = item.getAsFile();
				if (f instanceof File) files.push(f);
				continue;
			}
			const types = Array.from(item?.types ?? []);
			if (typeof item?.getType === "function" && types.length > 0) {
				const type = String(types[0] || "");
				try {
					const blob = await item.getType(type);
					if (!blob) continue;
					const ext = extByMime(blob.type || type);
					files.push(new File([blob], `clipboard-${now}-${files.length}.${ext}`, {
						type: blob.type || type,
						lastModified: now
					}));
				} catch {}
			}
		}
		return files;
	}
	async readEntriesFromDirectory(dir) {
		if (!dir) return [];
		const entries = [];
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
			const item = observe({
				name,
				kind,
				handle
			});
			if (kind === "file") {
				item.type = getMimeTypeByFilename?.(name);
				try {
					const f = await handle?.getFile?.();
					item.file = f;
					item.size = f?.size;
					item.lastModified = f?.lastModified;
					item.type = f?.type || item.type;
				} catch {}
			}
			entries.push(item);
		}
		return entries;
	}
	async listUserEntriesDirect(path, createIfMissing = false) {
		const normalized = normalizeDirectoryPath(path);
		const strippedPath = normalized.replace(/^\/user\/?/, "/");
		const legacyPath = normalized;
		const dirs = [];
		const tryPush = (dir) => {
			if (!dir) return;
			if (!dirs.includes(dir)) dirs.push(dir);
		};
		tryPush(await this.getDirectoryHandleByPath(strippedPath, false).catch(() => null));
		if (legacyPath !== strippedPath) tryPush(await this.getDirectoryHandleByPath(legacyPath, false).catch(() => null));
		if (!dirs.length && createIfMissing) tryPush(await this.getDirectoryHandleByPath(strippedPath, true).catch(() => null));
		const merged = /* @__PURE__ */ new Map();
		for (const dir of dirs) {
			const chunk = await this.readEntriesFromDirectory(dir);
			for (const entry of chunk) {
				if (!entry?.name) continue;
				const key = `${entry.kind}:${entry.name}`;
				if (!merged.has(key)) merged.set(key, entry);
			}
		}
		return Array.from(merged.values());
	}
	applyEntries(entries) {
		const unique = /* @__PURE__ */ new Map();
		for (const entry of entries || []) {
			if (!entry || !entry.name) continue;
			const key = `${entry.kind}:${entry.name}`;
			if (!unique.has(key)) unique.set(key, entry);
		}
		this.#entries.value = Array.from(unique.values());
		this.dispatchEvent(new CustomEvent("entries-updated", {
			detail: {
				path: this.path,
				count: unique.size
			},
			bubbles: true,
			composed: true
		}));
	}
	async itemAction(item) {
		const self = this;
		const detail = {
			path: (self.path || "/") + item?.name,
			item,
			originalEvent: null
		};
		const event = new CustomEvent("open-item", {
			detail,
			bubbles: true,
			composed: true,
			cancelable: true
		});
		this.host?.dispatchEvent(event);
		if (event.defaultPrevented) return;
		if (item?.kind === "directory") self.path = (self.path?.endsWith?.("/") ? self.path : self.path + "/") + item?.name + "/";
		else {
			const abs = (self.path || "/") + (item?.name || "");
			if (!item?.file && isAssetsPath(abs)) {
				item.file = await provide(abs).catch(() => null);
				if (item.file) {
					item.size = item.file.size;
					item.lastModified = item.file.lastModified;
					item.type = item.file.type || item.type;
				}
			}
			const openEvent = new CustomEvent("open", {
				detail,
				bubbles: true,
				composed: true
			});
			this.host?.dispatchEvent(openEvent);
		}
	}
	async requestUse() {}
	async refreshList(path = this.path) {
		await this.loadPath(path);
		return this;
	}
	async loadPath(path = this.path) {
		if (this.#loadLock) {
			if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(() => this.loadPath(path), { timeout: 1e3 });
			return globalThis.setTimeout(() => this.loadPath(path), 0);
		}
		this.#loadLock = true;
		try {
			this.#loading.value = true;
			this.#error.value = "";
			const rel = normalizeDirectoryPath(path?.value || path || this.path || "/");
			this.detachDirectoryObservers();
			if (isVirtualRootPath(rel)) {
				this.applyEntries(this.listVirtualRootEntries());
				return this;
			}
			if (isAssetsPath(rel)) {
				this.applyEntries(await this.listAssetEntries(rel));
				return this;
			}
			if (isUserPath(rel)) {
				const entries = await this.listUserEntriesDirect(rel, true);
				this.applyEntries(entries);
				return this;
			}
			try {
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: false });
				await this.#dirProxy;
			} catch (openErr) {
				if (!isUserPath(rel)) throw openErr;
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: true });
				await this.#dirProxy;
			}
			console.log("rel", rel);
			const loader = async () => {
				const entries = await this.collectDirectoryEntries();
				if (entries?.length != null && entries?.length >= 0 && typeof entries?.length == "number") this.applyEntries(entries);
			};
			const debouncedLoader = () => {
				if (this.#loaderDebounceTimer) clearTimeout(this.#loaderDebounceTimer);
				this.#loaderDebounceTimer = setTimeout(() => loader(), 50);
			};
			await loader()?.catch?.(console.warn.bind(console));
			this.#subscribed = affected(await this.#dirProxy?.getMap?.() ?? [], debouncedLoader);
		} catch (e) {
			this.#error.value = e?.message || String(e || "");
			this.applyEntries([]);
			console.warn(e);
		} finally {
			this.#loading.value = false;
			this.#loadLock = false;
		}
		return this;
	}
	async onMenuAction(item, actionId, ev) {
		try {
			const itemName = item?.name;
			if (!actionId) return;
			const abs = (this.path || "/") + (itemName || "");
			switch (actionId) {
				case "delete":
				case "rename":
				case "movePath":
					if (this.readonly || isReadonlyPath(abs)) {
						this.dispatchEvent(new CustomEvent("readonly-blocked", {
							detail: {
								action: actionId,
								path: abs
							},
							bubbles: true,
							composed: true
						}));
						break;
					}
					if (actionId === "delete") {
						if (isUserPath(abs)) await this.removeUserEntry(abs, true);
						else await remove(this.#fsRoot, abs);
						await this.refreshList(this.path);
						break;
					}
					if (actionId === "rename") {
						if (item?.kind === "file") {
							const next = prompt("Rename to:", itemName);
							if (next && next !== itemName) {
								if (isUserPath(abs)) await this.renameUserFile(abs ?? "", next ?? "");
								else await this.renameFile(abs ?? "", next ?? "");
								await this.refreshList(this.path);
							}
						}
						break;
					}
					break;
				case "open":
					await this.itemAction(item);
					break;
				case "view":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "view",
						item
					} }));
					break;
				case "attach-workcenter":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "attach-workcenter",
						item
					} }));
					break;
				case "download":
					Promise.try(async () => {
						if (isAssetsPath(abs)) {
							const file = await provide(abs);
							if (file) await downloadFile(file);
							return;
						}
						if (item?.kind === "file") await downloadFile(await getFileHandle(this.#fsRoot, abs, { create: false }));
						else await downloadFile(await getDirectoryHandle(this.#fsRoot, abs, { create: false }));
					}).catch(console.warn);
					break;
				case "copyPath":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
				case "copy":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
			}
		} catch (e) {
			console.warn(e);
			this.#error.value = e?.message || String(e || "");
		}
	}
	async renameFile(oldName, newName) {
		const file = await (await getFileHandle(this.#fsRoot, oldName, { create: false }))?.getFile?.();
		if (!file) return;
		if (!await getFileHandle(this.#fsRoot, newName, { create: true }).catch(() => null)) await writeFile(this.#fsRoot, this.path + newName, file);
		else await writeFile(this.#fsRoot, this.path + newName, file);
		await remove(this.#fsRoot, this.path + oldName);
	}
	async requestUpload() {
		if (this.readonly || isReadonlyPath(this.path)) return;
		try {
			const picker = window?.showOpenFilePicker;
			if (picker && isUserPath(this.path)) {
				const handles = await picker({ multiple: true }).catch(() => []);
				for (const handle of handles || []) {
					const file = await handle?.getFile?.();
					if (file instanceof File) await this.writeUserFile(file, this.path);
				}
			} else await uploadFile(this.path, null);
			await this.refreshList(this.path);
		} catch (e) {
			console.warn(e);
		}
	}
	async requestPaste() {
		if (this.readonly || isReadonlyPath(this.path)) return;
		try {
			try {
				await waitForClipboardFrame();
				const clipboardItems = await navigator.clipboard.read();
				if (clipboardItems && clipboardItems.length > 0) {
					const files = await this.extractFilesFromData(clipboardItems);
					if (files.length > 0 && isUserPath(this.path)) {
						for (const file of files) await this.writeUserFile(file, this.path);
						await this.refreshList(this.path);
						return;
					}
				}
			} catch (e) {}
			let systemText = "";
			try {
				await waitForClipboardFrame();
				systemText = await navigator.clipboard?.readText?.();
			} catch {}
			const internalItems = this.#clipboard?.items || [];
			if (systemText) {
				await handleIncomingEntries({ getData: (type) => type === "text/plain" ? systemText : "" }, this.path || "/");
				await this.refreshList(this.path);
				return;
			}
			if (internalItems.length > 0) {
				const txt = internalItems.join("\n");
				if (isUserPath(this.path) && internalItems.every((x) => String(x || "").startsWith("/user/"))) {
					for (const src of internalItems) {
						const file = await readFile(this.#fsRoot, src).catch(() => null);
						if (file instanceof File) {
							await this.writeUserFile(file, this.path);
							if (this.#clipboard?.cut) await this.removeUserEntry(src, true).catch(() => null);
						}
					}
					if (this.#clipboard?.cut) this.#clipboard = null;
				} else await handleIncomingEntries({ getData: (type) => type === "text/plain" ? txt : "" }, this.path || "/");
				await this.refreshList(this.path);
			}
		} catch (e) {
			console.warn(e);
		}
	}
	onPaste(ev) {
		if (this.readonly || isReadonlyPath(this.path)) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			Promise.try(async () => {
				const payload = ev.clipboardData || ev.dataTransfer;
				const files = await this.extractFilesFromData(payload);
				if (files.length > 0 && isUserPath(this.path)) for (const file of files) await this.writeUserFile(file, this.path);
				else await handleIncomingEntries(payload, this.path || "/");
				await this.refreshList(this.path);
			}).catch(console.warn);
			return;
		}
		this.requestPaste();
	}
	onCopy(ev) {}
	async onDrop(ev) {
		if (this.readonly || isReadonlyPath(this.path)) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			const payload = ev.clipboardData || ev.dataTransfer;
			const files = await this.extractFilesFromData(payload);
			if (files.length > 0 && isUserPath(this.path)) for (const file of files) await this.writeUserFile(file, this.path);
			else await handleIncomingEntries(payload, this.path || "/");
			await this.refreshList(this.path);
			return;
		}
	}
	dispatchEvent(event) {
		this.host?.dispatchEvent(event);
	}
};
//#endregion
//#region ../../modules/views/explorer-view/src/ts/ContextMenu.ts
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var disconnectRegistry = new FinalizationRegistry((ctxMenu) => {});
var makeFileActionOps = () => {
	return [
		{
			id: "open",
			label: "Open",
			icon: "function"
		},
		{
			id: "view",
			label: "View",
			icon: "eye"
		},
		{
			id: "view-base",
			label: "View (Base tab)",
			icon: "arrow-square-out"
		},
		{
			id: "attach-workcenter",
			label: "Attach to Work Center",
			icon: "lightning"
		},
		{
			id: "attach-workcenter-queued",
			label: "Queue attach (pending)",
			icon: "clock-counter-clockwise"
		},
		{
			id: "attach-workcenter-headless",
			label: "Queue attach (headless)",
			icon: "wave-sine"
		},
		{
			id: "pin-home",
			label: "Pin to Home Screen",
			icon: "push-pin-simple"
		},
		{
			id: "download",
			label: "Download",
			icon: "download"
		}
	];
};
var makeFileSystemOps = () => {
	return [
		{
			id: "delete",
			label: "Delete",
			icon: "trash"
		},
		{
			id: "rename",
			label: "Rename",
			icon: "pencil"
		},
		{
			id: "copyPath",
			label: "Copy Path",
			icon: "copy"
		},
		{
			id: "movePath",
			label: "Move Path",
			icon: "hand-withdraw"
		}
	];
};
var makeContextMenu = () => {
	const ctxMenu = H`<ul class="round-decor ctx-menu ux-anchor" style="position: fixed; z-index: 99999;" data-hidden></ul>`;
	const overlay = document.querySelector("[data-app-layer=\"overlay\"]");
	const basicApp = document.querySelector(".basic-app");
	(overlay || basicApp || document.body).append(ctxMenu);
	return ctxMenu;
};
var createItemCtxMenu = async (fileManager, onMenuAction, entries) => {
	const ctxMenuDesc = {
		openedWith: null,
		items: [makeFileActionOps(), makeFileSystemOps()],
		defaultAction: (initiator, menuItem, ev) => {
			const rowFromCompose = Array.from(ev?.composedPath?.() || []).find((element) => element?.classList?.contains?.("row")) || MOCElement(initiator, ".row");
			onMenuAction?.((entries?.value ?? entries)?.find?.((item) => item?.name === rowFromCompose?.getAttribute?.("data-id")), menuItem?.id, ev);
		}
	};
	const initiatorElement = fileManager;
	const ctxMenu = makeContextMenu();
	ctxMenuTrigger(initiatorElement, ctxMenuDesc, ctxMenu);
	disconnectRegistry.register(initiatorElement, ctxMenu);
	return ctxMenu;
};
//#endregion
//#region ../../modules/views/explorer-view/src/ts/utils.ts
/**
* Get icon name by MIME type
*/
var iconByMime = (mime, def = "file") => {
	if (!mime) return def;
	if (mime.startsWith("image/")) return "image";
	if (mime.startsWith("audio/")) return "music";
	if (mime.startsWith("video/")) return "video";
	if (mime === "application/pdf") return "file-text";
	if (mime.includes("zip") || mime.includes("7z") || mime.includes("rar")) return "file-archive";
	if (mime.includes("json")) return "brackets-curly";
	if (mime.includes("csv")) return "file-spreadsheet";
	if (mime.includes("xml")) return "code";
	if (mime.startsWith("text/")) return "file-text";
	return def;
};
/**
* Extension to icon mapping
*/
var EXTENSION_ICON_MAP = {
	md: "file-text",
	txt: "file-text",
	pdf: "file-pdf",
	doc: "file-doc",
	docx: "file-doc",
	png: "file-image",
	jpg: "file-image",
	jpeg: "file-image",
	gif: "file-image",
	svg: "file-image",
	webp: "file-image",
	js: "file-js",
	ts: "file-ts",
	jsx: "file-jsx",
	tsx: "file-tsx",
	html: "file-html",
	css: "file-css",
	scss: "file-css",
	json: "file-json",
	zip: "file-zip",
	tar: "file-zip",
	gz: "file-zip",
	rar: "file-zip",
	mp3: "file-audio",
	wav: "file-audio",
	mp4: "file-video",
	mov: "file-video",
	webm: "file-video"
};
/**
* Get icon name by file extension
*/
var getFileIcon = (filename) => {
	return EXTENSION_ICON_MAP[filename.split(".").pop()?.toLowerCase() || ""] || "file";
};
/**
* Get icon for file entry item (unified function)
* Handles FileEntry objects and string types.
*/
var iconFor = (item, type) => {
	if (typeof item === "string") return item === "directory" ? "folder" : iconByMime(type || item || "");
	if (item?.kind === "directory") return "folder";
	return iconByMime(item?.type) || getFileIcon(item?.name || "");
};
var dateCache = /* @__PURE__ */ new Map();
/**
* Format date with caching
*/
var formatDate = (timestamp) => {
	if (timestamp === void 0 || timestamp === null) return "";
	const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	if (dateCache.has(ts)) return dateCache.get(ts);
	const formatted = new Date(ts).toLocaleString("en-US", {
		dateStyle: "short",
		timeStyle: "short"
	});
	dateCache.set(ts, formatted);
	return formatted;
};
//#endregion
//#region ../../modules/views/explorer-view/src/ts/FileManagerContent.ts
initGlobalClipboard();
var styled$1 = preloadStyle(FileManagerContent_default$1);
var FileManagerContent = class FileManagerContent extends UIElement {
	#rowsContainer = null;
	get entries() {
		return this.operativeInstance?.entries ?? [];
	}
	get path() {
		return this.operativeInstance?.path || "/";
	}
	set path(value) {
		if (this.operativeInstance) this.operativeInstance.path = value || "/";
	}
	get pathRef() {
		return this.operativeInstance?.pathRef;
	}
	refreshList() {
		if (this.gridRowsEl) this.gridRowsEl.innerHTML = ``;
		if (this.gridEl) this.gridEl.innerHTML = ``;
		if (this.operativeInstance) this.operativeInstance.refreshList(this.path || "/").then(() => this.syncRows()).catch(console.warn);
	}
	onInitialize() {
		return super.onInitialize() ?? this;
	}
	bindDropHandlers() {
		const container = this;
		if (!container) return;
		addEvent(container, "dragover", (ev) => {
			if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
				ev?.preventDefault?.();
				if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
			}
		});
		addEvent(container, "drop", (ev) => {
			if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
				ev?.preventDefault?.();
				ev?.stopPropagation?.();
				this.operativeInstance?.onDrop?.(ev);
			}
		});
	}
	onPaste(ev) {
		if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
			if (this.operativeInstance) this.operativeInstance.onPaste(ev);
		}
	}
	onCopy(ev) {
		if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
			if (this.operativeInstance) this.operativeInstance.onCopy(ev);
		}
	}
	byFirstTwoLetterOrName(name) {
		return ((name?.substring?.(0, 2)?.toUpperCase?.())?.charCodeAt?.(0) || 65) - 65;
	}
	constructor() {
		super();
		this.operativeInstance = null;
		this.operativeInstanceRef = ref(null);
		this.styles = () => styled$1;
		this.render = function() {
			const self = this;
			const fileHeader = H`<div class="fm-grid-header">
            <div class="c icon">@</div>
            <div class="c name">Name</div>
            <div class="c size">Size</div>
            <div class="c date">Modified</div>
            <div class="c actions">Actions</div>
        </div>`;
			const operative = self.operativeInstance;
			if (!operative) return "";
			const fileRows = H`<div class="fm-grid-rows" style="will-change: contents;"></div>`;
			this.#rowsContainer = fileRows;
			createItemCtxMenu?.(fileRows, operative.onMenuAction.bind(operative), self.entries);
			queueMicrotask(() => {
				self.bindDropHandlers();
				const root = self.shadowRoot;
				const grids = Array.from(root?.querySelectorAll?.(".fm-grid") || []);
				if (grids.length > 1) {
					const latest = grids.at(-1);
					for (const extra of grids) if (extra !== latest) extra.remove();
					self.#rowsContainer = latest.querySelector(".fm-grid-rows");
				}
				self.syncRows();
			});
			return H`<div class="fm-grid" part="grid">
            ${fileHeader}
            ${fileRows}
        </div>`;
		};
		this.operativeInstance ??= new FileOperative();
		this.operativeInstance.host = this;
		this.addEventListener("entries-updated", () => this.syncRows());
		this.refreshList();
	}
	syncRows() {
		let rows = this.#rowsContainer;
		if (!rows || !rows.isConnected) {
			rows = this.shadowRoot?.querySelector?.(".fm-grid:last-of-type .fm-grid-rows") ?? null;
			this.#rowsContainer = rows;
		}
		const operative = this.operativeInstance;
		if (!rows || !operative) return;
		const rawEntries = operative.entries;
		const currentEntries = Array.isArray(rawEntries) ? rawEntries : Array.isArray(rawEntries?.value) ? rawEntries.value : [];
		const safeEntries = Array.isArray(currentEntries) ? currentEntries : [];
		const seen = /* @__PURE__ */ new Set();
		rows.innerHTML = "";
		const fragment = document.createDocumentFragment();
		for (const item of safeEntries) {
			if (!item || typeof item !== "object" || item.name == null) continue;
			const dedupeKey = `${item.kind}:${item.name}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);
			fragment.append(this.makeListElement(item, operative));
		}
		rows.append(fragment);
	}
	makeListElement(item, operative) {
		const op = operative;
		const isFile = item?.kind === "file" || item?.file;
		const itemEl = H`<div draggable="${isFile}" class="row c2-surface"
            on:click=${(ev) => requestAnimationFrame(() => op.onRowClick?.(item, ev))}
            on:dblclick=${(ev) => requestAnimationFrame(() => op.onRowDblClick?.(item, ev))}
            on:dragstart=${(ev) => op.onRowDragStart?.(item, ev)}
            data-id=${item?.name || ""}
        >
            <div style="pointer-events: none; background-color: transparent;" class="c icon"><ui-icon icon=${iconFor(item)} /></div>
            <div style="pointer-events: none; background-color: transparent;" class="c name" title=${item?.name || ""}>${item?.name || ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c size">${isFile ? item?.size ?? "" : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c date">${isFile ? formatDate(item?.lastModified ?? 0) : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c actions">
                <button class="action-btn" title="Copy Path" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copyPath", ev));
		}}>
                    <ui-icon icon="copy" />
                </button>
                <button class="action-btn" title="Copy" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copy", ev));
		}}>
                    <ui-icon icon="clipboard" />
                </button>
                <button class="action-btn" title="Delete" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "delete", ev));
		}}>
                    <ui-icon icon="trash" />
                </button>
            </div>
        </div>`;
		bindWith(itemEl, "--order", this.byFirstTwoLetterOrName(item?.name ?? ""), handleStyleChange);
		return itemEl;
	}
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManagerContent.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManagerContent.prototype, "gridEl", void 0);
FileManagerContent = __decorate([defineElement("ui-file-manager-content")], FileManagerContent);
var FileManagerContent_default = FileManagerContent;
//#endregion
//#region ../../modules/views/explorer-view/src/ts/FileManager.ts
var styled = preloadStyle("@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon img,ui-icon svg{block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);container-type:inline-size;content-visibility:auto;display:grid;flex-grow:1;inline-size:stretch;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:stretch;display:grid;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,#1e1e1e);border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar button,:host(ui-file-manager) .fm-toolbar input{background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 ui-monospace,Cascadia Code,SF Mono,Consolas,monospace;inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left,:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:stretch;border-radius:0;grid-column:content-col;grid-row:2;inline-size:stretch;min-block-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}");
var FileManager = class FileManager extends UIElement {
	#pathWatcherDisposer = null;
	constructor() {
		super();
		this.sidebar = "auto";
		this.styles = () => styled;
		this.render = function() {
			const self = this;
			const sidebarVisible = self.showSidebar;
			const content = H`<div part="content" class="fm-content"><slot></slot></div>`;
			return H`<div part="root" class="fm-root" data-with-sidebar=${sidebarVisible}>${H`<div part="toolbar" class="fm-toolbar">
            <div class="fm-toolbar-left">
                <button class="btn" title="Up" on:click=${() => requestAnimationFrame(() => self.goUp())}><ui-icon icon="arrow-up"/></button>
                <button class="btn" title="Refresh" on:click=${() => requestAnimationFrame(() => self.navigate(self.inputValue || self.path || "/"))}><ui-icon icon="arrow-clockwise"/></button>
            </div>
            <div class="fm-toolbar-center"><form style="display: contents;" onsubmit="return false;">
                <input class="address c2-surface" autocomplete="off" type="text" name="address" value=${self.path || "/"} />
            </form></div>
            <div class="fm-toolbar-right">
                <button class="btn" title="Add" on:click=${() => requestAnimationFrame(() => self.requestUpload?.())}><ui-icon icon="upload"/></button>
                <button class="btn" title="Paste" on:click=${() => requestAnimationFrame(() => self.requestPaste?.())}><ui-icon icon="clipboard"/></button>
                <button class="btn" title="Use" on:click=${() => requestAnimationFrame(() => self.requestUse?.())}><ui-icon icon="hand-withdraw"/></button>
            </div>
        </div>`}${content}</div>`;
		};
	}
	get content() {
		return this?.querySelector?.("ui-file-manager-content");
	}
	get operative() {
		return this.content?.operativeInstance;
	}
	get pathRef() {
		return this.operative?.pathRef;
	}
	get path() {
		return this.content?.path || this.operative?.path || "/";
	}
	set path(value) {
		if (this.content) this.content.path = value || "/";
		if (this.operative) this.operative.path = value || "/";
	}
	get input() {
		return this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
	}
	get inputValue() {
		return this.input?.value || "/";
	}
	set inputValue(value) {
		if (this.input) this.input.value = value || "/";
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		const existingContents = Array.from(self.querySelectorAll("ui-file-manager-content"));
		const primaryContent = existingContents[0] ?? document.createElement("ui-file-manager-content");
		if (!existingContents.length) self.append(primaryContent);
		if (existingContents.length > 1) for (const extra of existingContents.slice(1)) extra?.remove?.();
		queueMicrotask(() => {
			this.#pathWatcherDisposer?.();
			this.#pathWatcherDisposer = null;
			if (!this.pathRef) return;
			this.#pathWatcherDisposer = affected(this.pathRef, (path) => {
				const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
				if (input && input instanceof HTMLInputElement && input.value != path) input.value = path || "/";
			});
		});
		return self;
	}
	onRender() {
		super.onRender();
		const weak = new WeakRef(this);
		const onEnter = (ev) => {
			if (ev.key === "Enter") {
				const self = weak.deref();
				const val = (self?.querySelector?.("input[name=\"address\"]"))?.value?.trim?.() || "";
				if (val) self?.navigate(val);
			}
		};
		addEvent(this, "keydown", onEnter);
	}
	get showSidebar() {
		const force = String(this.sidebar ?? "auto").toLowerCase();
		if (force === "true" || force === "1") return true;
		if (force === "false" || force === "0") return false;
		return (propRef(this, "inlineSize")?.value ?? this.inlineSize ?? 0) >= 720;
	}
	async navigate(toPath) {
		this.path = getDir(toPath) || this.path || "/";
		const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
		if (input && input instanceof HTMLInputElement && input.value != this.path) input.value = this.path || "/";
	}
	async goUp() {
		const parts = (this.path || this.content?.path || "/").replace(/\/+$/g, "").split("/").filter(Boolean);
		if (parts.length <= 1) {
			this.navigate(this.path = "/");
			return;
		}
		const clean = getDir("/" + parts.slice(0, -1).join("/") + "/");
		this.navigate(this.path = clean || "/");
	}
	requestUpload() {
		this.operative?.requestUpload?.();
	}
	requestPaste() {
		this.operative?.requestPaste?.();
	}
	requestUse() {
		this.operative?.requestUse?.();
	}
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManager.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManager.prototype, "gridEl", void 0);
__decorate([property({
	source: "attr",
	name: "sidebar"
})], FileManager.prototype, "sidebar", void 0);
__decorate([property({ source: "inline-size" })], FileManager.prototype, "inlineSize", void 0);
FileManager = __decorate([defineElement("ui-file-manager")], FileManager);
//#endregion
//#region ../../modules/views/explorer-view/src/index.scss?inline
var src_default = "@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);container-type:inline-size;content-visibility:auto;display:grid;flex-grow:1;inline-size:stretch;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:stretch;display:grid;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,#1e1e1e);border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar button,:host(ui-file-manager) .fm-toolbar input{background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 ui-monospace,Cascadia Code,SF Mono,Consolas,monospace;inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left,:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:stretch;border-radius:0;grid-column:content-col;grid-row:2;inline-size:stretch;min-block-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);contain:none;container-type:size;display:block;grid-column:1/-1;inline-size:stretch;isolation:isolate;margin:0;overflow:auto;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:stretch;contain:strict;contain-intrinsic-size:1px 2.625rem;content-visibility:auto;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:stretch;min-block-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) a,:host(ui-file-manager-content) :where(.row) span{background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:8}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon img,ui-icon svg{block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer view-explorer{@layer tokens{:root:has([data-view=explorer]),html:has([data-view=explorer]){--view-layout:\"flex\";--view-content-max-width:none}[data-view=explorer]{--view-border:color-mix(in oklab,var(--color-outline-variant,#888) 45%,transparent);--view-fg-muted:color-mix(in oklab,var(--color-on-surface,#ccc) 72%,transparent);--view-hover-bg:color-mix(in oklab,var(--color-primary,#3794ff) 12%,transparent);--view-selected-bg:color-mix(in oklab,var(--color-primary,#3794ff) 18%,transparent);--view-selected-border:var(--color-primary,#3794ff);--explorer-menu-radius:0.75rem;--explorer-menu-pad:0.35rem}}@layer shell{:where(.app-shell__content)>[data-view=explorer]{block-size:100%!important;display:flex!important;flex-direction:column!important;max-block-size:100%!important;min-block-size:0!important;overflow:hidden!important}:host:has(.view-explorer){background:var(--color-surface,var(--view-bg,#1e1e1e));block-size:100%;color:var(--color-on-surface,var(--view-fg,#e8e8e8));contain:layout style;display:flex;flex-direction:column;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:.875rem;line-height:1.5;min-block-size:0}cw-view-explorer{box-sizing:border-box}.view-explorer,cw-view-explorer{block-size:100%;display:flex;flex:1 1 0;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0}.view-explorer{background:var(--color-surface,var(--view-bg));border:none;border-radius:0;color:var(--color-on-surface,var(--view-fg));overflow:hidden}.view-explorer__content{background:transparent;box-sizing:border-box;color:inherit;display:flex;flex:1 1 0;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0}.view-explorer__content>ui-file-manager{block-size:100%;flex:1 1 0;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer components{.view-explorer__error,.view-explorer__loading{align-items:center;block-size:100%;display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-explorer__loading{color:var(--color-on-surface);opacity:.65}.view-explorer__spinner{animation:d .8s linear infinite;block-size:32px;border:3px solid var(--view-border,color-mix(in oklab,var(--color-on-surface,#888) 18%,transparent));border-block-start-color:var(--color-primary,#3794ff);border-radius:50%;inline-size:32px}.view-explorer__error p{color:var(--color-error,#f2b8b5);margin:0}.view-explorer__error button{background:var(--color-primary,#3794ff);border:none;border-radius:.375rem;color:var(--color-on-primary,#fff);cursor:pointer;padding:.5rem 1rem}.view-explorer__error button:hover{filter:brightness(1.08)}.view-explorer__fallback{block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:.75rem;overflow:auto;padding:1rem 1.125rem}.view-explorer__fallback h3{font-size:1rem;font-weight:600;margin:0}.view-explorer__fallback p{color:var(--view-fg-muted,var(--color-on-surface-variant));font-size:.875rem;line-height:1.45;margin:0}.view-explorer__fallback-actions{display:flex;flex-wrap:wrap;gap:.5rem}.view-explorer__fallback-actions button{background:color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);border:none;border-radius:999px;color:inherit;cursor:pointer;font-size:.8125rem;font-weight:500;padding:.5rem 1rem}.view-explorer__fallback-actions button:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 13%,transparent)}.view-explorer__fallback-actions button:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 60%,transparent);outline-offset:1px}.view-explorer__fallback-files{color:var(--color-on-surface-variant);display:grid;font-size:.8125rem;gap:.35rem;margin:.5rem 0 0;padding-inline-start:1.125rem}.rs-explorer-context-menu{backdrop-filter:blur(12px);background:color-mix(in oklab,var(--color-surface-container-high,#2a2d33) 92%,#000 8%);border:none;border-radius:var(--explorer-menu-radius,.75rem);box-shadow:0 8px 28px rgba(0,0,0,.38),0 0 0 1px color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);color:var(--color-on-surface,#eee);display:flex;flex-direction:column;gap:.2rem;min-inline-size:12rem;padding:var(--explorer-menu-pad,.35rem);position:fixed;z-index:10050}.rs-explorer-context-menu__item{align-items:center;background:transparent;border:none;border-radius:calc(var(--explorer-menu-radius, .75rem) - .15rem);box-sizing:border-box;color:inherit;cursor:pointer;display:flex;font:inherit;font-size:.8125rem;gap:.5rem;inline-size:100%;justify-content:flex-start;line-height:1.25;min-block-size:2.25rem;padding:.5rem .7rem;text-align:start}.rs-explorer-context-menu__item:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 9%,transparent)}.rs-explorer-context-menu__item:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 65%,transparent);outline-offset:0}}@layer animations{@keyframes d{to{transform:rotate(1turn)}}}}";
//#endregion
//#region ../../modules/views/explorer-view/src/index.ts
function buildExplorerShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("aria-label", "File explorer");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	const fm = document.createElement("ui-file-manager");
	fm.setAttribute("view-mode", "list");
	content.append(fm);
	shell.append(content);
	return shell;
}
function buildFallbackShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("aria-label", "File explorer (fallback)");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	content.innerHTML = `
        <div class="view-explorer__fallback">
            <h3>Explorer fallback mode</h3>
            <p>File manager component is unavailable; use local files below.</p>
            <div class="view-explorer__fallback-actions">
                <button type="button" data-action="pick-files">Open files</button>
                <button type="button" data-action="open-workcenter">Open Work Center</button>
            </div>
            <ul class="view-explorer__fallback-files" data-fallback-files></ul>
        </div>`;
	shell.append(content);
	return shell;
}
var TAG = "cw-view-explorer";
var CwViewExplorer = createViewConstructor(TAG, (Base) => {
	return class ExplorerView extends Base {
		constructor(options) {
			super();
			this.id = "explorer";
			this.name = "Explorer";
			this.icon = "folder";
			this.explorerRoot = null;
			this.explorerCleanup = null;
			this.wiredFileManager = null;
			this.initialPath = null;
			this._sheet = null;
			this.lifecycle = {
				onMount: () => {
					this._sheet ??= loadAsAdopted(src_default);
					this.attachExplorerWire();
				},
				onUnmount: () => {
					this.detachExplorerWire();
					removeAdopted(this._sheet);
					this._sheet = null;
				},
				onShow: () => {
					this._sheet ??= loadAsAdopted(src_default);
					if (!this.explorerCleanup && this.explorerRoot) this.attachExplorerWire();
				},
				onHide: () => {
					this.detachExplorerWire();
					removeAdopted(this._sheet);
					this._sheet = null;
				}
			};
			this.render = (options) => {
				if (options) {
					this.options = {
						...this.options,
						...options
					};
					const p = options?.params?.path;
					if (p) this.initialPath = String(p);
					const inj = options?.explorerInject;
					if (inj !== void 0) this.explorerInject = inj;
				}
				if (this.explorerCleanup) this.detachExplorerWire();
				this._sheet = loadAsAdopted(src_default);
				this.explorerRoot = Boolean(customElements.get("ui-file-manager")) ? buildExplorerShell() : buildFallbackShell();
				return this.explorerRoot;
			};
			if (options) {
				this.options = options;
				this.explorerInject = options.explorerInject;
				if (options.params?.path) this.initialPath = String(options.params.path);
			}
		}
		getToolbar() {
			return null;
		}
		canHandleMessage(messageType) {
			return [
				"file-save",
				"navigate-path",
				"content-explorer"
			].includes(messageType);
		}
		async handleMessage(message) {
			const msg = message;
			if (msg.data?.file instanceof File) {
				await this.saveIncomingFileToWorkspace(msg.data.file, msg.data.path || msg.data.into);
				return;
			}
			const targetPath = msg.data?.path || msg.data?.into;
			if (targetPath && this.wiredFileManager) this.wiredFileManager.navigate(targetPath);
		}
		async saveIncomingFileToWorkspace(file, destPath) {
			const op = this.wiredFileManager?.operative;
			if (!op?.ingestFileIntoWorkspace) return false;
			await op.ingestFileIntoWorkspace(file, destPath);
			return true;
		}
		/** Imperative API — channels / tooling (`ui-file-manager` when wired). */
		navigateExplorer(path) {
			const p = String(path || "").trim();
			if (!p || !this.wiredFileManager) return;
			return this.wiredFileManager.navigate(p);
		}
		getExplorerFileManager() {
			return this.wiredFileManager;
		}
		getExplorerShellRoot() {
			return this.explorerRoot;
		}
		invokeChannelApi(action, payload) {
			const pathFromPayload = () => {
				if (typeof payload === "string") return payload.trim();
				if (payload && typeof payload === "object") {
					const o = payload;
					const raw = o.path ?? o.into ?? o.target;
					return typeof raw === "string" ? raw.trim() : "";
				}
				return "";
			};
			switch (action) {
				case ExplorerChannelAction.NavigatePath:
				case ExplorerChannelAction.ContentExplorer:
				case ExplorerChannelAction.Navigate: {
					const path = pathFromPayload();
					if (!path) return false;
					this.navigateExplorer(path);
					return true;
				}
				case ExplorerChannelAction.GetPath: return this.wiredFileManager?.path ?? null;
				case ExplorerChannelAction.FileSave:
				case "file-save": {
					const o = payload && typeof payload === "object" ? payload : {};
					const file = o.file instanceof File ? o.file : null;
					const dest = typeof o.path === "string" ? o.path : typeof o.into === "string" ? o.into : void 0;
					if (!file) return false;
					return this.saveIncomingFileToWorkspace(file, dest);
				}
				case ExplorerChannelAction.RequestUse:
					this.wiredFileManager?.requestUse?.();
					return true;
				case ExplorerChannelAction.RequestUpload:
					this.wiredFileManager?.requestUpload?.();
					return true;
				case ExplorerChannelAction.RequestPaste:
					this.wiredFileManager?.requestPaste?.();
					return true;
				default: return this.handleMessage({
					type: action,
					data: typeof payload === "object" && payload ? payload : { path: pathFromPayload() || void 0 }
				}).then(() => true);
			}
		}
		attachExplorerWire() {
			if (!this.explorerRoot) return;
			const shellOpts = this.options;
			const { cleanup, fileManager } = wireExplorerSubtree(this.explorerRoot, {
				shellContext: shellOpts?.shellContext,
				initialPath: this.initialPath,
				inject: this.explorerInject
			});
			this.explorerCleanup = cleanup;
			this.wiredFileManager = fileManager;
		}
		detachExplorerWire() {
			this.explorerCleanup?.();
			this.explorerCleanup = null;
			this.wiredFileManager = null;
		}
	};
});
function createExplorerView(options) {
	return new CwViewExplorer(options);
}
//#endregion
export { CwViewExplorer, FileManager, FileManagerContent_default as FileManagerContent, TAG, createExplorerView, createExplorerView as default, mergeExplorerInject, registerExplorerInject, wireExplorerSubtree };
