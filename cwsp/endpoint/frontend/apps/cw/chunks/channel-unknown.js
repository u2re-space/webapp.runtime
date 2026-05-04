import { g as loadAsAdopted } from "../fest/dom.js";
import { i as BROADCAST_CHANNELS, u as getBroadcastChannelForDestination } from "./UniformInterop.js";
import { a as initializeComponent, f as unifiedMessaging, i as hasPendingMessages, n as createMessageWithOverrides, o as processInitialContent, r as enqueuePendingMessage, s as registerComponent } from "./UnifiedMessaging.js";
import { i as fetchSwCachedEntries } from "./ShareTargetGateway.js";
import { S as getSpeechPrompt, n as getCachedComponent, q as H, r as createFileHandler } from "../com/app.js";
import { n as loadSettings } from "./Settings.js";
import { a as ensureStyleSheet, c as clearAllCache, n as debugIconSystem, o as reinitializeRegistry, r as testIconRacing, t as clearIconCaches } from "../fest/icon.js";
import { t as views_default } from "./views2.js";
//#region src/shared/modules/TemplateManager.ts
/**
* Legacy shell service placeholder — `channel-unknown` keeps `state.services.templateManager`.
* Extend here when template routing is wired back into CrossWord.
*/
function createTemplateManager() {
	return {};
}
//#endregion
//#region src/shared/routing/channel-unknown.ts
var CHANNELS = {
	SHARE_TARGET: BROADCAST_CHANNELS.SHARE_TARGET,
	TOAST: BROADCAST_CHANNELS.TOAST,
	CLIPBOARD: BROADCAST_CHANNELS.CLIPBOARD,
	MINIMAL_APP: BROADCAST_CHANNELS.MINIMAL_APP,
	MAIN_APP: BROADCAST_CHANNELS.MAIN_APP,
	FILE_EXPLORER: BROADCAST_CHANNELS.FILE_EXPLORER,
	PRINT_VIEWER: BROADCAST_CHANNELS.PRINT_VIEWER
};
/**
* Safe localStorage operations with error handling
*/
var safeLocalStorage = {
	get: (key, defaultValue = "") => {
		try {
			return localStorage.getItem(key) || defaultValue;
		} catch {
			return defaultValue;
		}
	},
	set: (key, value) => {
		try {
			localStorage.setItem(key, value);
		} catch {}
	}
};
/**
* Unified component loading with error handling
*/
var loadComponent = async (componentName, importFn, options = { componentName }) => {
	try {
		return await getCachedComponent(componentName, importFn, options);
	} catch (error) {
		console.error(`Failed to load ${componentName}:`, error);
		throw error;
	}
};
var workCenterAttachmentInProgress = false;
var HISTORY_KEY = "rs-history";
var LAST_SRC_KEY = "rs-last-src";
var DEFAULT_MD = "# CrossWord (Basic)\n\nOpen a markdown file or paste content here.\n";
var MARKDOWN_EXTENSION_PATTERN = /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i;
var HASH_VIEW_MAPPING = {
	"#viewer": "markdown-viewer",
	"#editor": "markdown-editor",
	"#workcenter": "workcenter",
	"#settings": "settings",
	"#history": "history",
	"#explorer": "file-explorer",
	"#rich-editor": "rich-editor",
	"#share-target-text": "workcenter",
	"#share-target-files": "workcenter",
	"#share-target-url": "workcenter",
	"#share-target-image": "workcenter"
};
var VIEW_HASH_MAPPING = {
	"markdown-viewer": "#viewer",
	"markdown-editor": "#editor",
	"workcenter": "#workcenter",
	"settings": "#settings",
	"history": "#history",
	"file-explorer": "#explorer",
	"rich-editor": "#rich-editor"
};
var PATH_VIEW_MAPPING = {
	"viewer": "markdown-viewer",
	"editor": "markdown-editor",
	"rich-editor": "rich-editor",
	"workcenter": "workcenter",
	"settings": "settings",
	"history": "history",
	"explorer": "file-explorer"
};
var getViewFromPathname = () => {
	if (typeof window === "undefined") return null;
	const segment = (globalThis?.location?.pathname || "").replace(/^\/+|\/+$/g, "").toLowerCase();
	if (!segment) return null;
	return PATH_VIEW_MAPPING[segment] || null;
};
var loadLastSrc = () => safeLocalStorage.get(LAST_SRC_KEY);
var saveLastSrc = (src) => safeLocalStorage.set(LAST_SRC_KEY, src);
var isLikelyExtension = () => {
	try {
		return typeof chrome !== "undefined" && Boolean(chrome?.runtime?.id) && globalThis?.location?.protocol === "chrome-extension:";
	} catch {
		return false;
	}
};
var getViewFromHash = () => {
	if (typeof window === "undefined") return null;
	return HASH_VIEW_MAPPING[globalThis?.location?.hash] || null;
};
var setViewHash = (view) => {
	if (typeof window === "undefined") return;
	const hash = VIEW_HASH_MAPPING[view];
	if (hash) globalThis?.history?.replaceState?.(null, "", hash);
};
var applyTheme = (root, theme) => {
	const prefersDark = typeof window !== "undefined" && globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
	const resolved = theme === "dark" ? "dark" : theme === "light" ? "light" : prefersDark ? "dark" : "light";
	root.dataset.theme = resolved;
	try {
		root.style.colorScheme = resolved;
	} catch {}
};
var readMdFromUrlIfPossible = async (candidate) => {
	const s = candidate.trim();
	if (!s) return null;
	try {
		const u = new URL(s);
		if (!MARKDOWN_EXTENSION_PATTERN.test(u.pathname)) return null;
		const res = await fetch(u.href, {
			credentials: "include",
			cache: "no-store"
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	}
};
var mountShellApp = (mountElement, options = {}) => {
	loadAsAdopted(views_default);
	const root = H`<div class="app-shell" />`;
	mountElement.replaceChildren(root);
	try {
		const sheet = ensureStyleSheet();
		reinitializeRegistry();
		console.log("[Icons] Initialized stylesheet:", sheet);
	} catch (error) {
		console.error("[Icons] Failed to initialize stylesheet:", error);
	}
	if (typeof window !== "undefined" && typeof window != "undefined") {
		globalThis.clearIconCaches = () => {
			clearIconCaches();
			clearAllCache().catch(console.error);
			console.log("[Debug] Icon caches cleared");
		};
		globalThis.invalidateIconCache = clearIconCaches;
		globalThis.testIconRacing = testIconRacing;
		globalThis.reinitializeIconRegistry = reinitializeRegistry;
		globalThis.debugIconSystem = debugIconSystem;
	}
	const ext = isLikelyExtension();
	const fileHandler = createFileHandler({
		onFilesAdded: (files) => {
			for (const file of files) {
				const contentType = file.type?.startsWith("text/") ? "text" : file.type?.startsWith("image/") ? "image" : file.name?.toLowerCase().endsWith(".md") ? "markdown" : "file";
				const context = state.view === "workcenter" ? "drag-drop" : state.view === "markdown-viewer" ? "file-open" : "file-open";
				processInitialContent({
					content: {
						file,
						filename: file.name,
						type: file.type
					},
					contentType,
					context,
					source: "manual",
					metadata: {
						title: `File: ${file.name}`,
						filename: file.name,
						mimeType: file.type
					}
				}).then(() => {
					showStatusMessage(`Processed ${file.name}`);
				}).catch((e) => {
					console.warn(`[Main] Failed to process file ${file.name}:`, e);
					showStatusMessage(`Failed to process ${file.name}`);
				});
			}
		},
		onError: (error) => {
			showStatusMessage(`File error: ${error}`);
		}
	});
	const templateManager = createTemplateManager();
	const hasExistingContent = globalThis?.localStorage?.getItem?.("rs-markdown") || options.initialMarkdown;
	const routeView = getViewFromPathname();
	const defaultView = options.initialView || routeView || (hasExistingContent ? "markdown-viewer" : "file-picker");
	/**
	* Create unified messaging handler for view switching
	*/
	const createViewHandler = (destination, view) => ({
		canHandle: (msg) => msg.destination === destination,
		handle: async (_msg) => {
			state.view = view;
			setViewHash(view);
			render();
		}
	});
	const isAttachmentMessage = (msg) => {
		const type = String(msg?.type || "").trim().toLowerCase();
		return type === "content-attach" || type === "file-attach";
	};
	/**
	* Work center attachment logic (extracted for reuse)
	*/
	const handleWorkCenterAttachment = async (msg, state, setViewHash, render, showStatusMessage, skipRender = false) => {
		if (workCenterAttachmentInProgress) {
			console.log("[Shell] Work center attachment already in progress, ignoring duplicate request");
			return;
		}
		workCenterAttachmentInProgress = true;
		try {
			if (state.view !== "workcenter") {
				state.view = "workcenter";
				setViewHash("workcenter");
			}
			const filesToAttach = [];
			try {
				if (msg.data.file instanceof File) filesToAttach.push(msg.data.file);
				else if (Array.isArray(msg.data.files)) {
					const validFiles = msg.data.files.filter((file) => file instanceof File);
					if (validFiles.length > 0) filesToAttach.push(...validFiles);
				} else if (msg.data.blob instanceof Blob) {
					const filename = msg.data.filename || `attachment-${Date.now()}.${msg.contentType === "markdown" ? "md" : "txt"}`;
					filesToAttach.push(new File([msg.data.blob], filename, { type: msg.data.blob.type }));
				} else if (msg.data.text || msg.data.content) {
					const content = msg.data.text || msg.data.content;
					const textContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					const filename = msg.data.filename || `content-${Date.now()}.${msg.contentType === "markdown" ? "md" : "txt"}`;
					const mimeType = msg.contentType === "markdown" ? "text/markdown" : "text/plain";
					filesToAttach.push(new File([textContent], filename, { type: mimeType }));
					console.log("[Shell] Created file for attachment:", {
						filename,
						mimeType,
						size: textContent.length
					});
				}
			} catch (error) {
				console.warn("[Shell] Failed to create file from message data:", error);
				showStatusMessage("Failed to process content");
				return;
			}
			if (filesToAttach.length === 0) {
				console.warn("[Shell] No valid file content found in message");
				return;
			}
			if (!skipRender) render();
			for (const fileToAttach of filesToAttach) await attachToWorkCenterWhenReady(fileToAttach, state, showStatusMessage);
		} finally {
			workCenterAttachmentInProgress = false;
		}
	};
	/**
	* Wait for work center to load and attach file
	*/
	const attachToWorkCenterWhenReady = async (file, state, showStatusMessage) => {
		try {
			if (state.managers.workCenter.instance) {
				state.managers.workCenter.instance.getState().files.push(file);
				state.managers.workCenter.instance.ui.updateFileList(state.managers.workCenter.instance.getState());
				state.managers.workCenter.instance.ui.updateFileCounter(state.managers.workCenter.instance.getState());
				showStatusMessage(`Attached ${file.name} to Work Center`);
				return;
			}
			let attempts = 0;
			const maxAttempts = 50;
			while (!state.managers.workCenter.instance && attempts < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				attempts++;
			}
			if (state.managers.workCenter.instance) {
				state.managers.workCenter.instance.getState().files.push(file);
				state.managers.workCenter.instance.ui.updateFileList(state.managers.workCenter.instance.getState());
				state.managers.workCenter.instance.ui.updateFileCounter(state.managers.workCenter.instance.getState());
				showStatusMessage(`Attached ${file.name} to Work Center`);
			} else throw new Error("Work center failed to load");
		} catch (error) {
			console.warn("[Shell] Failed to attach content to workcenter:", error);
			showStatusMessage("Failed to attach content");
		}
	};
	const state = {
		view: defaultView,
		markdown: typeof options.initialMarkdown === "string" ? options.initialMarkdown : localStorage.getItem("rs-markdown") ?? DEFAULT_MD,
		editing: false,
		busy: false,
		message: "",
		history: [],
		lastSavedTheme: "auto",
		services: {
			fileHandler,
			templateManager
		},
		managers: {
			workCenter: {
				instance: null,
				initialized: false
			},
			history: { instance: null }
		},
		components: {
			settings: { view: null },
			markdown: {
				viewer: null,
				editor: null
			},
			quill: { editor: null },
			explorer: { element: null }
		}
	};
	/**
	* Standard status message display with auto-hide
	*/
	const showStatusMessage = (message, duration = 3e3) => {
		state.message = message;
		setTimeout(() => {
			if (state.message === message) renderStatus();
		}, 0);
		setTimeout(() => {
			if (state.message === message) {
				state.message = "";
				renderStatus();
			}
		}, duration);
	};
	unifiedMessaging.registerHandler("markdown-viewer", {
		canHandle: (msg) => msg.destination === "markdown-viewer",
		handle: async (msg) => {
			if (msg.data?.text) {
				state.markdown = msg.data.text;
				state.view = "markdown-viewer";
				persistMarkdown();
				render();
			}
		}
	});
	unifiedMessaging.registerHandler("workcenter", createViewHandler("workcenter", "workcenter"));
	unifiedMessaging.registerHandler("viewer", {
		canHandle: (msg) => msg.destination === "viewer",
		handle: async (msg) => {
			if (msg.data?.text || msg.data?.content) {
				const content = msg.data.text || msg.data.content;
				state.markdown = typeof content === "string" ? content : JSON.stringify(content, null, 2);
				state.view = "markdown-viewer";
				setViewHash("markdown-viewer");
				persistMarkdown();
				render();
				showStatusMessage("Content loaded in viewer");
			}
		}
	});
	unifiedMessaging.registerHandler("workcenter", {
		canHandle: (msg) => msg.destination === "workcenter",
		handle: async (msg) => {
			const instance = state.managers?.workCenter?.instance;
			if (instance) {
				try {
					if (isAttachmentMessage(msg)) await handleWorkCenterAttachment(msg, state, setViewHash, render, showStatusMessage, true);
					else if (instance?.handleExternalMessage) await instance.handleExternalMessage(msg);
				} catch (e) {
					console.error("[Shell] WorkCenter message handling failed:", e);
				}
				return;
			}
			try {
				enqueuePendingMessage("workcenter", msg);
			} catch (e) {
				console.warn("[Shell] Failed to enqueue pending workcenter message:", e);
			}
			if (state.view !== "workcenter") {
				state.view = "workcenter";
				setViewHash("workcenter");
				render();
			}
		}
	});
	unifiedMessaging.registerHandler("explorer", {
		canHandle: (msg) => msg.destination === "explorer",
		handle: async (msg) => {
			if (state.view !== "file-explorer") {
				state.view = "file-explorer";
				setViewHash("file-explorer");
				render();
			}
			setTimeout(async () => {
				try {
					const action = msg.data?.action || "save";
					const path = msg.data?.path || msg.data?.into || "/";
					if (action === "save" && (msg.data?.file || msg.data?.text || msg.data?.content)) {
						let fileToSave = null;
						if (msg.data.file instanceof File) fileToSave = msg.data.file;
						else if (msg.data.blob instanceof Blob) {
							const filename = msg.data.filename || `file-${Date.now()}`;
							fileToSave = new File([msg.data.blob], filename, { type: msg.data.blob.type });
						} else if (msg.data.text || msg.data.content) {
							const content = msg.data.text || msg.data.content;
							const textContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
							const filename = msg.data.filename || `content-${Date.now()}.txt`;
							fileToSave = new File([textContent], filename, { type: "text/plain" });
						}
						if (fileToSave && state.components.explorer.element) {
							if (path && path !== state.components.explorer.element.path) state.components.explorer.element.path = path;
							console.log(`[Shell] Saving file ${fileToSave.name} to Explorer at: ${path}`);
							state.message = `Saved ${fileToSave.name} to Explorer`;
							renderStatus();
							setTimeout(() => {
								state.message = "";
								renderStatus();
							}, 3e3);
						}
					} else if (action === "view" && msg.data?.path) {
						if (state.components.explorer.element && path) {
							state.components.explorer.element.path = path;
							console.log(`[Shell] Navigated Explorer to path: ${path}`);
							state.message = `Opened Explorer at ${path}`;
							renderStatus();
							setTimeout(() => {
								state.message = "";
								renderStatus();
							}, 2e3);
						}
					} else if (action === "place" && msg.data?.place && msg.data?.into) {
						const targetPath = msg.data.into;
						if (state.components.explorer.element && targetPath) {
							state.components.explorer.element.path = targetPath;
							console.log(`[Shell] Navigated Explorer to place data at: ${targetPath}`);
							state.message = `Explorer ready at ${targetPath}`;
							renderStatus();
							setTimeout(() => {
								state.message = "";
								renderStatus();
							}, 3e3);
						}
					} else if (action === "navigate" && path) {
						if (state.components.explorer.element) {
							state.components.explorer.element.path = path;
							state.message = `Explorer navigated to ${path}`;
							renderStatus();
							setTimeout(() => {
								state.message = "";
								renderStatus();
							}, 2e3);
						}
					}
				} catch (error) {
					console.warn("[Shell] Failed to handle explorer action:", error);
					state.message = "Failed to perform Explorer action";
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 3e3);
				}
			}, 100);
		}
	});
	unifiedMessaging.registerHandler("print", {
		canHandle: (msg) => msg.destination === "print",
		handle: async (msg) => {
			if (msg.data?.text || msg.data?.content) {
				const content = msg.data.text || msg.data.content;
				const printableContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
				const printWindow = globalThis?.open?.("", "_blank", "width=800,height=600");
				if (printWindow) {
					printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Print - CrossWord</title>
                            <style>
                                body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
                                pre { white-space: pre-wrap; word-wrap: break-word; }
                                @media print { body { margin: 1rem; } }
                            </style>
                        </head>
                        <body>
                            <pre>${printableContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                        </body>
                        </html>
                    `);
					printWindow.document.close();
					printWindow.print();
				}
			}
		}
	});
	if (typeof window !== "undefined") {
		const handleHashChange = () => {
			const hashView = getViewFromHash();
			if (hashView && hashView !== state.view) {
				console.log(`[HashChange] Switching to view: ${hashView} from hash`);
				state.view = hashView;
				render();
			}
		};
		globalThis?.addEventListener?.("hashchange", handleHashChange);
		const initialHashView = getViewFromHash();
		if (initialHashView) {
			state.view = initialHashView;
			const destination = {
				"markdown-viewer": "viewer",
				"markdown-editor": "markdown-editor",
				"rich-editor": "rich-editor",
				"workcenter": "workcenter",
				"file-explorer": "explorer"
			}[initialHashView];
			if (destination && hasPendingMessages(destination)) console.log(`[Main] Found pending messages for initial view ${initialHashView}`);
		}
	}
	if (Array.isArray(options.initialFiles) && options.initialFiles.length > 0) {
		console.log(`[Main] Processing ${options.initialFiles.length} initial files`);
		for (const file of options.initialFiles) {
			const contentType = file.type?.startsWith("text/") ? "text" : file.type?.startsWith("image/") ? "image" : file.name?.toLowerCase().endsWith(".md") ? "markdown" : "file";
			processInitialContent({
				content: {
					file,
					filename: file.name,
					type: file.type
				},
				contentType,
				context: "launch-queue",
				source: "launch-queue",
				metadata: {
					title: `Launch Queue: ${file.name}`,
					filename: file.name,
					mimeType: file.type
				}
			}).then(() => {
				state.message = `Processed ${file.name}`;
				renderStatus();
			}).catch((e) => {
				console.warn(`[Main] Failed to process initial file ${file.name}:`, e);
			});
		}
	}
	fetchSwCachedEntries().then((entries) => {
		const cachedContent = entries.map((entry) => ({
			...entry.content && typeof entry.content === "object" ? entry.content : {},
			content: entry.content,
			timestamp: entry.content?.timestamp,
			cacheKey: entry.key,
			swContext: entry.context
		}));
		if (cachedContent.length > 0) {
			console.log(`[Main] Processing ${cachedContent.length} cached content items from SW`);
			for (const cachedItem of cachedContent) try {
				let contentType = "text";
				let context = "share-target";
				const cachedData = cachedItem.content || {};
				if (cachedData.files?.length > 0) contentType = "file";
				else if (cachedData.url) contentType = "url";
				if (cachedItem.swContext) context = cachedItem.swContext;
				processInitialContent({
					content: cachedData,
					contentType,
					context,
					source: "service-worker",
					metadata: {
						title: `SW Cached: ${cachedItem.swContext || "content"}`,
						fromSW: true,
						cacheKey: cachedItem.cacheKey,
						timestamp: cachedItem.timestamp
					}
				}).then(() => {
					state.message = `Processed cached content`;
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 2e3);
				}).catch((e) => {
					console.warn(`[Main] Failed to process SW cached content:`, e);
				});
			} catch (error) {
				console.warn(`[Main] Failed to process cached item:`, error);
			}
		}
	}).catch((error) => {
		console.warn("[Main] Failed to retrieve SW cached content:", error);
	});
	const persistMarkdown = () => {
		try {
			if (state.markdown) localStorage.setItem("rs-markdown", state.markdown);
		} catch {}
	};
	const persistHistory = () => {
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history.slice(-50)));
		} catch {}
	};
	const renderToolbar = () => {
		const isMarkdownView = state.view === "markdown-viewer" || state.view === "markdown-editor";
		const isEditorView = state.view === "markdown-editor";
		const isWorkCenterView = state.view === "workcenter";
		return H`<div class="toolbar">
      <div class="left">
        <button class="btn ${state.view === "markdown-viewer" ? "active" : ""}" data-action="view-markdown-viewer" type="button" title="Markdown Viewer">
          <ui-icon icon="eye" icon-style="duotone"></ui-icon>
          <span>Viewer</span>
        </button>
        <button class="btn ${state.view === "file-explorer" ? "active" : ""}" data-action="view-file-explorer" type="button" title="File Explorer">
          <ui-icon icon="folder" icon-style="duotone"></ui-icon>
          <span>Explorer</span>
        </button>
        <button class="btn ${state.view === "workcenter" ? "active" : ""}" data-action="view-workcenter" type="button" title="AI Work Center">
          <ui-icon icon="lightning" icon-style="duotone"></ui-icon>
          <span>Work Center</span>
          ${state.managers.workCenter.instance && state.managers.workCenter.instance.getState().files.length > 0 ? H`<span class="workcenter-badge" title="${state.managers.workCenter.instance.getState().files.length} files ready for processing">${state.managers.workCenter.instance.getState().files.length}</span>` : ""}
        </button>
        <button class="btn ${state.view === "settings" ? "active" : ""}" data-action="view-settings" type="button" title="Settings">
          <ui-icon icon="gear" icon-style="duotone"></ui-icon>
          <span>Settings</span>
        </button>
        <button class="btn ${state.view === "history" ? "active" : ""}" data-action="view-history" type="button" title="History">
          <ui-icon icon="clock-counter-clockwise" icon-style="duotone"></ui-icon>
          <span>History</span>
        </button>
      </div>
      <div class="right">
        ${isEditorView ? H`<button class="btn btn-icon" data-action="open-md" type="button" title="Open Markdown File">
          <ui-icon icon="folder-open" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Open</span>
        </button>
        <button class="btn btn-icon" data-action="save-md" type="button" title="Save to File">
          <ui-icon icon="floppy-disk" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Save</span>
        </button>
        <button class="btn btn-icon" data-action="export-md" type="button" title="Export as Markdown">
          <ui-icon icon="download" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Export</span>
        </button>
        <button class="btn btn-icon" data-action="export-docx" type="button" title="Export as DOCX">
          <ui-icon icon="file-doc" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">DOCX</span>
        </button>` : ""}
        ${isMarkdownView ? H`<button class="btn" data-action="voice" type="button" title="Voice Input">
          <ui-icon icon="microphone" icon-style="duotone"></ui-icon>
          <span>Voice</span>
        </button>` : ""}
        ${isWorkCenterView ? H`<button class="btn" data-action="process-content" type="button" title="Process Content">
          <ui-icon icon="brain" icon-style="duotone"></ui-icon>
          <span>Process</span>
        </button>
        <button class="btn" data-action="save-to-explorer" type="button" title="Save Results to Explorer">
          <ui-icon icon="floppy-disk" icon-style="duotone"></ui-icon>
          <span>Save to Explorer</span>
        </button>` : ""}
        ${ext ? H`<button class="btn" data-action="snip" type="button" title="Screen Capture">
          <ui-icon icon="camera" icon-style="duotone"></ui-icon>
          <span>Snip</span>
        </button>` : ""}
      </div>
    </div>`;
	};
	let toolbar = renderToolbar();
	const statusLine = H`<div class="status" aria-live="polite"></div>`;
	const content = H`<div class="content"></div>`;
	root.append(toolbar, content);
	const fileInput = H`<input class="file-input" type="file" accept=".md,text/markdown,text/plain" />`;
	fileInput.style.display = "none";
	root.append(fileInput);
	state.services.fileHandler.setupCompleteFileHandling(root, H`<button style="display:none">File Select</button>`, void 0, "*");
	const renderStatus = () => {
		statusLine.textContent = state.message || (state.busy ? "Working…" : "");
		root.toggleAttribute("data-busy", state.busy);
	};
	const renderMarkdownViewer = async () => {
		const loadingElement = H`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Markdown Viewer...</span>
    </div>`;
		content.append(loadingElement);
		try {
			const viewer = (await getCachedComponent("markdown-viewer", () => import("../views/viewer.js"), { componentName: "MarkdownViewer" })).component.createMarkdownView({
				content: state.markdown || DEFAULT_MD,
				title: "Markdown Viewer",
				onOpen: () => {
					fileInput.click();
				},
				onCopy: (_content) => {
					state.message = "Content copied to clipboard";
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 2e3);
				},
				onDownload: (_content) => {
					state.message = "Content downloaded as markdown file";
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 2e3);
				},
				onAttachToWorkCenter: async (content) => {
					try {
						const message = createMessageWithOverrides("content-share", "main-app", "markdown", {
							text: content,
							filename: `content-${Date.now()}.md`
						}, ["explicit-workcenter"], "button-attach-workcenter");
						message.metadata = {
							title: "Content from Viewer",
							timestamp: Date.now(),
							source: "markdown-viewer"
						};
						await unifiedMessaging.sendMessage(message);
					} catch (error) {
						if (error instanceof Error && error.message.includes("throttled")) console.log("[Main] Message creation throttled - ignoring duplicate action");
						else {
							console.error("[Main] Failed to create attach message:", error);
							showStatusMessage("Failed to attach content - please wait a moment");
						}
					}
				},
				onPrint: async (content) => {
					await unifiedMessaging.sendMessage({
						id: crypto.randomUUID(),
						type: "content-print",
						source: "viewer",
						destination: "print",
						contentType: "markdown",
						data: {
							text: content,
							filename: `print-${Date.now()}.md`
						},
						metadata: {
							title: "Print Content",
							timestamp: Date.now(),
							source: "markdown-viewer"
						}
					});
				}
			});
			const viewerElement = viewer.render();
			fileHandler.setupDragAndDrop(viewerElement);
			fileHandler.setupPasteHandling(viewerElement);
			registerComponent("markdown-viewer", "viewer");
			const pendingMessages = initializeComponent("markdown-viewer");
			let contentLoaded = false;
			for (const message of pendingMessages) {
				const pending = message;
				console.log(`[Viewer] Processing pending message:`, pending);
				if (pending.data?.text || pending.data?.content) {
					const content = pending.data.text || pending.data.content;
					state.markdown = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					persistMarkdown();
					contentLoaded = true;
				}
			}
			if (contentLoaded) {
				viewer?.updateContent?.(state.markdown);
				showStatusMessage("Content loaded in viewer");
			}
			loadingElement.replaceWith(viewerElement);
			return viewerElement;
		} catch (error) {
			console.error("Failed to load markdown viewer:", error);
			const errorElement = H`<div class="component-error">
        <h3>Failed to load Markdown Viewer</h3>
        <p>Please try refreshing the page.</p>
      </div>`;
			loadingElement.replaceWith(errorElement);
			return errorElement;
		}
	};
	const renderMarkdownEditor = async () => {
		const loadingElement = H`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Markdown Editor...</span>
    </div>`;
		content.append(loadingElement);
		try {
			const editor = (await getCachedComponent("markdown-editor", () => import("../views/editor.js"), { componentName: "MarkdownEditor" })).component.createMarkdownEditor({
				initialContent: state.markdown || "",
				onContentChange: (content) => {
					state.markdown = content;
					persistMarkdown();
				},
				onSave: (content) => {
					state.markdown = content;
					persistMarkdown();
					state.message = "Content saved";
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 2e3);
				},
				placeholder: "Start writing your markdown here...",
				autoSave: true,
				autoSaveDelay: 2e3
			});
			const editorElement = editor.render();
			registerComponent("markdown-editor", "markdown-editor");
			const pendingMessages = initializeComponent("markdown-editor");
			let contentLoaded = false;
			for (const message of pendingMessages) {
				const pending = message;
				console.log(`[Editor] Processing pending message:`, pending);
				if (pending.data?.text || pending.data?.content) {
					const content = pending.data.text || pending.data.content;
					state.markdown = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					persistMarkdown();
					contentLoaded = true;
				}
			}
			if (contentLoaded) {
				editor?.updateContent?.(state.markdown);
				showStatusMessage("Content loaded in editor");
			}
			loadingElement.replaceWith(editorElement);
			return editorElement;
		} catch (error) {
			console.error("Failed to load markdown editor:", error);
			const errorElement = H`<div class="component-error">
        <h3>Failed to load Markdown Editor</h3>
        <p>Please try refreshing the page.</p>
      </div>`;
			loadingElement.replaceWith(errorElement);
			return errorElement;
		}
	};
	const renderRichEditor = async () => {
		const loadingElement = H`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Rich Editor...</span>
    </div>`;
		content.append(loadingElement);
		try {
			const editor = (await getCachedComponent("quill-editor", () => import("../vendor/lodash-es.js"), { componentName: "QuillEditor" })).component.createQuillEditor({
				initialContent: state.markdown || "",
				onContentChange: (content) => {
					state.markdown = content;
					persistMarkdown();
				},
				onSave: (content) => {
					state.markdown = content;
					persistMarkdown();
					state.message = "Content saved";
					renderStatus();
					setTimeout(() => {
						state.message = "";
						renderStatus();
					}, 2e3);
				},
				placeholder: "Start writing your rich text here...",
				autoSave: true,
				autoSaveDelay: 2e3
			});
			const editorElement = editor.render();
			registerComponent("rich-editor", "rich-editor");
			const pendingMessages = initializeComponent("rich-editor");
			let contentLoaded = false;
			for (const message of pendingMessages) {
				const pending = message;
				console.log(`[RichEditor] Processing pending message:`, pending);
				if (pending.data?.text || pending.data?.content) {
					const content = pending.data.text || pending.data.content;
					state.markdown = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					persistMarkdown();
					contentLoaded = true;
				}
			}
			if (contentLoaded) {
				editor?.updateContent?.(state.markdown);
				showStatusMessage("Content loaded in rich editor");
			}
			loadingElement.replaceWith(editorElement);
			return editorElement;
		} catch (error) {
			console.error("Failed to load rich editor:", error);
			const errorElement = H`<div class="component-error">
        <h3>Failed to load Rich Editor</h3>
        <p>Please try refreshing the page.</p>
      </div>`;
			loadingElement.replaceWith(errorElement);
			return errorElement;
		}
	};
	const renderHistoryView = async () => {
		const loadingElement = H`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading History...</span>
    </div>`;
		content.append(loadingElement);
		try {
			const historyManager = (await getCachedComponent("history-manager", () => import("../com/app7.js"), { componentName: "HistoryManager" })).component.createHistoryManager();
			if (state.history.length === 0) state.history = historyManager.getAllEntries();
			const historyElement = historyManager.createHistoryView((entry) => {
				if (state.view === "workcenter") getCachedComponent("workcenter", () => import("../views/workcenter3.js").then((m) => m.WorkCenterManager), { componentName: "WorkCenter" }).then(() => {
					if (state.managers.workCenter.instance) state.managers.workCenter.instance.getState().currentPrompt = entry.prompt;
				});
			});
			registerComponent("history-view", "history");
			const pendingMessages = initializeComponent("history-view");
			for (const message of pendingMessages) {
				console.log(`[History] Processing pending message:`, message);
				if (message.type === "navigation") {
					state.view = "history";
					setTimeout(() => render(), 0);
				}
			}
			loadingElement.replaceWith(historyElement);
			return historyElement;
		} catch (error) {
			console.error("Failed to load history view:", error);
			const errorElement = H`<div class="component-error">
        <h3>Failed to load History View</h3>
        <p>Please try refreshing the page.</p>
      </div>`;
			loadingElement.replaceWith(errorElement);
			return errorElement;
		}
	};
	if (typeof BroadcastChannel !== "undefined") try {
		new BroadcastChannel(CHANNELS.SHARE_TARGET).addEventListener("message", (event) => {
			const { type, data } = event.data || {};
			if (type === "share-received" && data) {
				state.history.push({
					ts: Date.now(),
					prompt: "Share Target",
					before: data.title || data.text || data.url || "Shared content",
					after: data.title || data.text || data.url || "Shared content",
					ok: true
				});
				persistHistory();
			}
		});
		new BroadcastChannel(CHANNELS.CLIPBOARD).addEventListener("message", (event) => {
			const { type, data } = event.data || {};
			if (type === "copy" && data) {
				state.history.push({
					ts: Date.now(),
					prompt: "Clipboard Copy",
					before: "",
					after: typeof data === "string" ? data : JSON.stringify(data),
					ok: true
				});
				persistHistory();
			}
		});
		new BroadcastChannel("app-shell").addEventListener("message", (event) => {
			const message = event.data;
			console.log("[Shell] Received message:", message);
			if (message.type === "content-view") {
				if (message.data?.text || message.data?.content) {
					const content = message.data.text || message.data.content;
					state.markdown = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					state.view = "markdown-viewer";
					setViewHash("markdown-viewer");
					persistMarkdown();
					render();
					showStatusMessage("Content loaded in viewer");
				}
			} else if (message.type === "content-attach") handleWorkCenterAttachment(message, state, setViewHash, render, showStatusMessage);
			else if (message.type === "navigation") {
				if (message.destination === "settings") {
					state.view = "settings";
					setViewHash("settings");
					render();
				} else if (message.destination === "history") {
					state.view = "history";
					setViewHash("history");
					render();
				}
			}
		});
		new BroadcastChannel("main-app").addEventListener("message", (event) => {
			const message = event.data;
			console.log("[MainApp] Received message:", message);
			if (message.type === "navigation") {
				if (message.destination === "settings") {
					state.view = "settings";
					setViewHash("settings");
					render();
				} else if (message.destination === "history") {
					state.view = "history";
					setViewHash("history");
					render();
				}
			}
		});
		new BroadcastChannel(getBroadcastChannelForDestination("explorer") || "file-explorer").addEventListener("message", (event) => {
			const message = event.data;
			console.log("[FileExplorer] Received message:", message);
			if (message.type === "content-explorer") {
				if (state.view !== "file-explorer") {
					state.view = "file-explorer";
					setViewHash("file-explorer");
					render();
				}
				setTimeout(async () => {
					try {
						const action = message.data?.action || "save";
						const path = message.data?.path || message.data?.into || "/";
						if (action === "save" && (message.data?.file || message.data?.text || message.data?.content)) {
							let fileToSave = null;
							if (message.data.file instanceof File) fileToSave = message.data.file;
							else if (message.data.blob instanceof Blob) {
								const filename = message.data.filename || `file-${Date.now()}`;
								fileToSave = new File([message.data.blob], filename, { type: message.data.blob.type });
							} else if (message.data.text || message.data.content) {
								const content = message.data.text || message.data.content;
								const textContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
								const filename = message.data.filename || `content-${Date.now()}.txt`;
								fileToSave = new File([textContent], filename, { type: "text/plain" });
							}
							if (fileToSave && state.components.explorer.element) {
								if (path && path !== state.components.explorer.element.path) state.components.explorer.element.path = path;
								showStatusMessage(`Saved ${fileToSave.name} to Explorer`);
							}
						} else if (action === "view" && message.data?.path) {
							if (state.components.explorer.element && path) {
								state.components.explorer.element.path = path;
								showStatusMessage(`Opened Explorer at ${path}`);
							}
						}
					} catch (error) {
						console.warn("[FileExplorer] Failed to handle message:", error);
						showStatusMessage("Failed to perform Explorer action");
					}
				}, 100);
			}
		});
		new BroadcastChannel(getBroadcastChannelForDestination("print") || "print-viewer").addEventListener("message", (event) => {
			const message = event.data;
			console.log("[PrintViewer] Received message:", message);
			if (message.type === "content-print") {
				if (message.data?.text || message.data?.content) {
					const content = message.data.text || message.data.content;
					const printableContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
					const printWindow = globalThis?.open?.("", "_blank", "width=800,height=600");
					if (printWindow) {
						printWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Print - CrossWord</title>
                                    <style>
                                        body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
                                        pre { white-space: pre-wrap; word-wrap: break-word; }
                                        @media print { body { margin: 1rem; } }
                                    </style>
                                </head>
                                <body>
                                    <pre>${printableContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                                </body>
                                </html>
                            `);
						printWindow.document.close();
						printWindow.print();
					}
				}
			}
		});
	} catch (error) {
		console.error("[Broadcast] Failed to initialize broadcast listeners:", error);
	}
	const exportMarkdown = () => {
		const blob = new Blob([state.markdown || ""], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `crossword-${Date.now()}.md`;
		a.rel = "noopener";
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 250);
	};
	const saveToFile = async () => {
		const md = state.markdown;
		if (!md?.trim()) return;
		try {
			if ("showSaveFilePicker" in globalThis) {
				const writable = await (await globalThis?.showSaveFilePicker?.({
					suggestedName: "document.md",
					types: [{
						description: "Markdown Files",
						accept: { "text/markdown": [".md"] }
					}]
				})).createWritable();
				await writable.write(md);
				await writable.close();
				state.message = "File saved successfully!";
				renderStatus();
				setTimeout(() => {
					state.message = "";
					renderStatus();
				}, 3e3);
			} else exportMarkdown();
		} catch (error) {
			console.error("Failed to save file:", error);
			if (error.name !== "AbortError") exportMarkdown();
		}
	};
	const runPrompt = async (promptText, customAIFunction) => {
		if (!promptText.trim()) return;
		state.busy = true;
		state.message = customAIFunction ? "Processing…" : "Generating markdown…";
		renderStatus();
		const before = state.markdown || "";
		const instructions = "Generate a NEW markdown document.\nRequirements:\n- Output ONLY markdown.\n- Use the prompt and the current markdown as context.\n- Keep it concise, structured with headings and lists.\n- If you need to keep prior content, integrate it rather than repeating verbatim.\n";
		const input = [{
			role: "user",
			content: `Prompt:\n${promptText}\n\nCurrent markdown:\n${before}`
		}];
		try {
			const res = customAIFunction ? await customAIFunction(input, { useActiveInstruction: true }) : await (await import("./unified.js").then((n) => n.n)).recognizeByInstructions(input, instructions);
			const after = res?.ok && res?.data ? String(res.data) : "";
			state.history.push({
				ts: Date.now(),
				prompt: promptText,
				before,
				after: after || before,
				ok: Boolean(res?.ok && after),
				error: res?.ok ? void 0 : res?.error || "Failed"
			});
			persistHistory();
			if (after) {
				state.markdown = after;
				persistMarkdown();
				saveLastSrc("");
				state.message = "Done.";
			} else state.message = res?.error || "No output.";
		} catch (e) {
			state.history.push({
				ts: Date.now(),
				prompt: promptText,
				before,
				after: before,
				ok: false,
				error: String(e)
			});
			persistHistory();
			state.message = String(e);
		} finally {
			state.busy = false;
			renderStatus();
			render();
			setTimeout(() => {
				if (state.message === "Done.") {
					state.message = "";
					renderStatus();
				}
			}, 1200);
		}
	};
	let isRendering = false;
	let renderScheduled = false;
	const render = async () => {
		if (isRendering) {
			renderScheduled = true;
			return;
		}
		isRendering = true;
		renderScheduled = false;
		try {
			const newToolbar = renderToolbar();
			toolbar.replaceWith(newToolbar);
			toolbar = newToolbar;
			attachToolbarListeners();
			setViewHash(state.view);
			content.replaceChildren();
			const handleComponentError = (componentName, error) => {
				console.error(`Failed to load ${componentName}:`, error);
				content.innerHTML = `<div class="component-error"><h3>Failed to load ${componentName}</h3><p>Please try refreshing the page.</p></div>`;
				renderStatus();
			};
			const handleComponentSuccess = (element) => {
				content.append(element);
				renderStatus();
			};
			const renderer = {
				"settings": async () => {
					content.innerHTML = "<div class=\"component-loading\"><div class=\"loading-spinner\"></div><span>Loading Settings...</span></div>";
					const settingsEl = (await loadComponent("settings", () => import("../views/settings.js"), { componentName: "Settings" })).component.createSettingsView({
						isExtension: isLikelyExtension(),
						onTheme: (t) => applyTheme(root, t)
					});
					registerComponent("settings-view", "settings");
					const pendingMessages = initializeComponent("settings-view");
					for (const message of pendingMessages) {
						console.log(`[Settings] Processing pending message:`, message);
						if (message.type === "navigation") {
							state.view = "settings";
							setTimeout(() => render(), 0);
						}
					}
					content.innerHTML = "";
					return settingsEl;
				},
				"file-explorer": async () => {
					content.innerHTML = "<div class=\"component-loading\"><div class=\"loading-spinner\"></div><span>Loading File Explorer...</span></div>";
					await loadComponent("file-explorer", () => import("../views/explorer.js"), { componentName: "FileManager" });
					const explorerEl = document.createElement("ui-file-manager");
					explorerEl.addEventListener("open-item", async (e) => {
						const { item } = e.detail;
						if (item?.kind === "file" && item?.file) await unifiedMessaging.sendMessage({
							id: crypto.randomUUID(),
							type: "content-share",
							source: "explorer",
							destination: "workcenter",
							contentType: "file",
							data: {
								file: item.file,
								filename: item.name,
								path: explorerEl.path
							},
							metadata: {
								title: item.name,
								timestamp: Date.now(),
								source: "file-explorer"
							}
						});
					});
					explorerEl.addEventListener("open", async (e) => {
						const { item } = e.detail;
						if (item?.kind === "file" && item?.file) {
							const isMarkdown = fileHandler.isMarkdownFile(item.file);
							const destination = isMarkdown ? "viewer" : "workcenter";
							await unifiedMessaging.sendMessage({
								id: crypto.randomUUID(),
								type: "content-share",
								source: "explorer",
								destination,
								contentType: isMarkdown ? "markdown" : "file",
								data: {
									file: item.file,
									filename: item.name,
									path: explorerEl.path
								},
								metadata: {
									title: item.name,
									timestamp: Date.now(),
									source: "file-explorer"
								}
							});
						}
					});
					explorerEl.addEventListener("context-action", async (e) => {
						const { action, item } = e.detail;
						if (action === "attach-workcenter" && item?.kind === "file" && item?.file) await unifiedMessaging.sendMessage({
							id: crypto.randomUUID(),
							type: "content-share",
							source: "explorer",
							destination: "workcenter",
							contentType: "file",
							data: {
								file: item.file,
								filename: item.name,
								path: explorerEl.path
							},
							metadata: {
								title: `Attach ${item.name} to Work Center`,
								timestamp: Date.now(),
								source: "file-explorer"
							}
						});
						else if (action === "view" && item?.kind === "file" && item?.file) {
							const isMarkdown = fileHandler.isMarkdownFile(item.file);
							const destination = isMarkdown ? "viewer" : "workcenter";
							await unifiedMessaging.sendMessage({
								id: crypto.randomUUID(),
								type: "content-share",
								source: "explorer",
								destination,
								contentType: isMarkdown ? "markdown" : "file",
								data: {
									file: item.file,
									filename: item.name,
									path: explorerEl.path
								},
								metadata: {
									title: `View ${item.name}`,
									timestamp: Date.now(),
									source: "file-explorer"
								}
							});
						}
					});
					registerComponent("file-explorer", "explorer");
					state.components.explorer.element = explorerEl;
					const pendingMessages = initializeComponent("file-explorer");
					for (const message of pendingMessages) {
						const pending = message;
						console.log(`[Explorer] Processing pending message:`, pending);
						if (pending.type === "content-explorer") {
							const action = pending.data?.action || "save";
							const path = pending.data?.path || pending.data?.into || "/";
							setTimeout(async () => {
								try {
									if (action === "save" && (pending.data?.file || pending.data?.text || pending.data?.content)) {
										let fileToSave = null;
										if (pending.data.file instanceof File) fileToSave = pending.data.file;
										else if (pending.data.blob instanceof Blob) {
											const filename = pending.data.filename || `file-${Date.now()}`;
											fileToSave = new File([pending.data.blob], filename, { type: pending.data.blob.type });
										} else if (pending.data.text || pending.data.content) {
											const payloadContent = pending.data.text || pending.data.content;
											const textContent = typeof payloadContent === "string" ? payloadContent : JSON.stringify(payloadContent, null, 2);
											const filename = pending.data.filename || `content-${Date.now()}.txt`;
											fileToSave = new File([textContent], filename, { type: "text/plain" });
										}
										if (fileToSave && explorerEl) {
											if (path && path !== explorerEl.path) explorerEl.path = path;
											showStatusMessage(`Saved ${fileToSave.name} to Explorer`);
										}
									} else if (action === "view" && pending.data?.path) {
										if (explorerEl && path) {
											explorerEl.path = path;
											showStatusMessage(`Opened Explorer at ${path}`);
										}
									}
								} catch (error) {
									console.warn("[Explorer] Failed to handle pending message:", error);
									showStatusMessage("Failed to perform Explorer action");
								}
							}, 100);
						}
					}
					content.innerHTML = "";
					return explorerEl;
				},
				"history": () => renderHistoryView(),
				"markdown-viewer": () => renderMarkdownViewer(),
				"markdown-editor": () => renderMarkdownEditor(),
				"rich-editor": () => renderRichEditor()
			}[state.view];
			if (renderer) {
				try {
					const result = await renderer();
					if (result) handleComponentSuccess(result);
				} catch (error) {
					handleComponentError(state.view.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()), error);
				}
				return;
			}
			if (state.view === "file-picker") {
				content.innerHTML = `
                <div class="file-picker">
                    <div class="file-picker-header">
                        <h2>Open File</h2>
                        <p>Select a file to open in the viewer or editor</p>
                    </div>
                    <div class="file-picker-actions">
                        <button class="btn btn-primary" data-action="open-markdown" type="button">
                            <ui-icon icon="file-text" size="18" icon-style="duotone"></ui-icon>
                            <span>Open Markdown</span>
                        </button>
                        <button class="btn" data-action="open-any" type="button">
                            <ui-icon icon="file" size="18" icon-style="duotone"></ui-icon>
                            <span>Open Any File</span>
                        </button>
                    </div>
                    <div class="file-picker-info">
                        <p><strong>Markdown files</strong> will open in the viewer/editor</p>
                        <p><strong>Other files</strong> will be processed by the work center</p>
                    </div>
                </div>
            `;
				const openMarkdownBtn = content.querySelector("[data-action=\"open-markdown\"]");
				const openAnyBtn = content.querySelector("[data-action=\"open-any\"]");
				if (openMarkdownBtn) openMarkdownBtn.addEventListener("click", () => {
					fileInput.accept = ".md,.markdown,.txt,text/markdown";
					fileInput.click();
				});
				if (openAnyBtn) openAnyBtn.addEventListener("click", () => {
					fileInput.accept = "*";
					fileInput.click();
				});
				renderStatus();
				return;
			}
			if (state.view === "workcenter") {
				content.innerHTML = "<div class=\"component-loading\"><div class=\"loading-spinner\"></div><span>Loading Work Center...</span></div>";
				getCachedComponent("workcenter", () => import("../views/workcenter3.js").then((m) => m.WorkCenterManager), { componentName: "WorkCenter" }).then(async (workCenterModule) => {
					if (!state.managers.workCenter.instance) state.managers.workCenter.instance = new workCenterModule.component({
						state,
						history: state.history,
						onFilesChanged: () => {
							renderToolbar();
						},
						getSpeechPrompt,
						showMessage: (message) => showStatusMessage(message),
						render: () => render()
					});
					if (!state.managers.workCenter.initialized) {
						state.managers.workCenter.initialized = true;
						registerComponent("workcenter-manager", "workcenter");
						const pendingMessages = initializeComponent("workcenter-manager");
						for (const message of pendingMessages) {
							console.log(`[WorkCenter] Processing pending message:`, message);
							try {
								if (isAttachmentMessage(message)) await handleWorkCenterAttachment(message, state, setViewHash, render, showStatusMessage, true);
								else if (state.managers.workCenter.instance?.handleExternalMessage) await state.managers.workCenter.instance.handleExternalMessage(message);
								else await handleWorkCenterAttachment(message, state, setViewHash, render, showStatusMessage, true);
							} catch (error) {
								console.warn("[WorkCenter] Failed to replay pending message:", error);
							}
						}
					}
					const workCenterElement = state.managers.workCenter.instance.renderWorkCenterView();
					content.innerHTML = "";
					content.append(workCenterElement);
					renderStatus();
				}).catch((error) => {
					console.error("Failed to load work center:", error);
					content.innerHTML = "<div class=\"component-error\"><h3>Failed to load Work Center</h3><p>Please try refreshing the page.</p></div>";
					renderStatus();
				});
				return;
			}
			renderMarkdownViewer().then((viewerElement) => {
				content.append(viewerElement);
				renderStatus();
			}).catch((error) => {
				console.error("Failed to load default markdown viewer:", error);
				content.innerHTML = "<div class=\"component-error\"><h3>Failed to load Markdown Viewer</h3><p>Please try refreshing the page.</p></div>";
				renderStatus();
			});
		} finally {
			isRendering = false;
			if (renderScheduled) setTimeout(() => render(), 0);
		}
	};
	const attachToolbarListeners = () => {
		toolbar.addEventListener("click", async (e) => {
			const action = (e.target?.closest?.("button[data-action]"))?.dataset?.action;
			if (!action) return;
			let newView = null;
			if (action === "view-markdown-viewer") newView = "markdown-viewer";
			if (action === "view-markdown-editor") newView = "markdown-editor";
			if (action === "view-rich-editor") newView = "rich-editor";
			if (action === "view-workcenter") newView = "workcenter";
			if (action === "view-settings") newView = "settings";
			if (action === "view-history") newView = "history";
			if (action === "view-file-explorer") newView = "file-explorer";
			if (newView) {
				state.view = newView;
				setViewHash(newView);
			}
			if (action === "open-md") fileInput.click();
			if (action === "save-md") saveToFile();
			if (action === "export-md") exportMarkdown();
			if (action === "export-docx") {
				const md = state.markdown || "";
				if (md.trim()) {
					const { downloadMarkdownAsDocx } = await import("./DocxExport.js");
					await downloadMarkdownAsDocx(md, {
						title: "CrossWord",
						filename: `crossword-${Date.now()}.docx`
					});
				}
			}
			if (action === "toggle-edit") {
				if (state.view !== "markdown-viewer" && state.view !== "markdown-editor") return;
				state.editing = !state.editing;
			}
			if (action === "snip") {
				if (!ext) return;
				try {
					chrome.tabs.query({
						active: true,
						lastFocusedWindow: true,
						currentWindow: true
					}, (tabs) => {
						const tabId = tabs?.[0]?.id;
						if (tabId != null) chrome.tabs.sendMessage(tabId, { type: "START_SNIP" })?.catch?.(() => void 0);
						try {
							globalThis?.close?.();
						} catch {}
					});
				} catch {}
			}
			if (action === "process-content") {
				if (state.managers.workCenter.instance) await unifiedMessaging.sendMessage({
					id: crypto.randomUUID(),
					type: "content-process",
					source: "main-app",
					destination: "workcenter",
					data: { prompt: state.markdown || "Process this content" },
					metadata: {
						timestamp: Date.now(),
						correlationId: `main-${Date.now()}`
					}
				});
			}
			if (action === "save-to-explorer") {
				if (state.managers.workCenter.instance) {
					const results = state.managers.workCenter.instance.getState().results || [];
					if (results.length > 0) {
						const latestResult = results[results.length - 1];
						await unifiedMessaging.sendMessage({
							id: crypto.randomUUID(),
							type: "content-save",
							source: "main-app",
							destination: "explorer",
							data: {
								action: "save",
								text: typeof latestResult === "string" ? latestResult : JSON.stringify(latestResult, null, 2),
								filename: `workcenter-result-${Date.now()}.txt`,
								path: "/workcenter-results/"
							},
							metadata: {
								title: "Work Center Result",
								timestamp: Date.now(),
								source: "workcenter"
							}
						});
					} else {
						state.message = "No results to save";
						renderStatus();
						setTimeout(() => {
							state.message = "";
							renderStatus();
						}, 2e3);
					}
				}
			}
			if (action === "solve") await runPrompt("Solve equations and answer questions from the content above", solveAndAnswer);
			if (action === "code") await runPrompt("Generate code based on the description or requirements above", writeCode);
			if (action === "css") await runPrompt("Extract or generate CSS from the content or image above", extractCSS);
			if (action === "voice") (async () => {
				const p = await getSpeechPrompt();
				if (!p) return;
				await runPrompt(p);
			})();
			render();
		});
	};
	attachToolbarListeners();
	fileInput.addEventListener("change", () => {
		const f = fileInput.files?.[0];
		if (!f) return;
		f.text().then((text) => {
			state.markdown = text || "";
			persistMarkdown();
			saveLastSrc("");
			if (state.view !== "markdown-viewer") {
				state.view = "markdown-viewer";
				setViewHash("markdown-viewer");
			}
			state.message = `Loaded ${f.name}`;
			renderStatus();
			render();
			setTimeout(() => {
				state.message = "";
				renderStatus();
			}, 3e3);
		}).catch(() => void 0).finally(() => {
			fileInput.value = "";
		});
	});
	loadSettings().then((s) => {
		state.lastSavedTheme = s?.appearance?.theme || "auto";
		applyTheme(root, state.lastSavedTheme);
	}).catch(() => applyTheme(root, "auto"));
	const lastSrc = loadLastSrc();
	if (lastSrc) readMdFromUrlIfPossible(lastSrc).then((text) => {
		if (!text) return;
		state.markdown = text;
		persistMarkdown();
		render();
	});
	render();
};
//#endregion
export { mountShellApp };
