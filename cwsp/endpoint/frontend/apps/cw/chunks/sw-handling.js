import { r as __exportAll } from "./rolldown-runtime.js";
import { f as viewBroadcastChannelName, n as BROADCAST_CHANNELS, u as normalizeDestination } from "./Names.js";
import { d as unifiedMessaging, r as enqueuePendingMessage, u as sendProtocolMessage } from "./UnifiedMessaging.js";
import { R as copy, c as parseDataUrl, o as isBase64Like, z as initClipboardReceiver } from "../com/app.js";
import { t as summarizeForLog$1 } from "./LogSanitizer.js";
import { c as storeShareTargetPayloadToCache, i as unifiedMessaging$1, o as buildShareDataFromCachedPayload, s as consumeCachedShareTargetPayload } from "./UnifiedMessaging2.js";
import { n as loadSettings } from "./Settings.js";
//#region src/shared/routing/pwa/sw-url.ts
var isLikelyJavaScriptContentType = (contentType) => {
	const ct = (contentType || "").toLowerCase();
	return ct.includes("javascript") || ct.includes("ecmascript") || ct.includes("module") || ct.includes("text/javascript");
};
var isLikelyHtmlContentType = (contentType) => {
	const ct = (contentType || "").toLowerCase();
	return ct.includes("text/html") || ct.includes("application/xhtml");
};
/** SPA / proxy fallbacks often return 200 + HTML for unknown paths — never call `register()` in that case (MIME SecurityError spam). */
var bodyLooksLikeHtmlDocument = (snippet) => {
	const head = snippet.trimStart().slice(0, 400);
	if (!head) return false;
	return head.startsWith("<!") || /^<\s*html[\s>]/i.test(head) || head.startsWith("<!--");
};
var PROBE_TIMEOUT_MS = 8e3;
var probeScriptUrl = async (url) => {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), PROBE_TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			method: "GET",
			cache: "no-store",
			credentials: "same-origin",
			signal: ac.signal
		});
		const contentType = res.headers.get("content-type");
		const status = res.status;
		if (!res.ok) return {
			ok: false,
			url,
			contentType,
			status
		};
		if (isLikelyHtmlContentType(contentType)) return {
			ok: false,
			url,
			contentType,
			status
		};
		if (isLikelyJavaScriptContentType(contentType)) return {
			ok: true,
			url,
			contentType,
			status
		};
		try {
			const sample = (await res.clone().text()).trimStart().slice(0, 2048);
			if (bodyLooksLikeHtmlDocument(sample)) return {
				ok: false,
				url,
				contentType,
				status
			};
			if (/^\s*(?:\/\/|\/\*|import\s|export\s|self\.|'use strict'|"use strict")/m.test(sample) || /\b(?:addEventListener|serviceWorker|workbox|skipWaiting|caches\.|navigator\.serviceWorker)\b/.test(sample)) return {
				ok: true,
				url,
				contentType,
				status
			};
		} catch {}
		return {
			ok: false,
			url,
			contentType,
			status
		};
	} catch {
		return {
			ok: false,
			url
		};
	} finally {
		clearTimeout(timer);
	}
};
/** Vite base (e.g. `/` or `/apps/cw/`) — normalized with trailing slash. */
var viteBasePrefix = () => {
	const raw = String("./");
	if (raw === "/" || raw === "") return "/";
	return raw.endsWith("/") ? raw : `${raw}/`;
};
/**
* When the dev build used `base: "/"` but the app is opened under a subpath (reverse proxy or
* `/apps/cw/`), `import.meta.env.BASE_URL` is wrong and SW probes miss the real `…/dev-sw.js?dev-sw`.
*/
var inferMountBaseFromPathname = () => {
	try {
		const m = String(globalThis?.location?.pathname || "").match(/^(\/apps\/cw)(?:\/|$)/);
		if (m?.[1]) {
			const p = m[1];
			return p.endsWith("/") ? p : `${p}/`;
		}
	} catch {}
	return null;
};
/** Collect distinct URL prefixes (vite BASE_URL + path inference) for SW script candidates. */
var serviceWorkerPathBases = () => {
	const primary = viteBasePrefix();
	const inferred = inferMountBaseFromPathname();
	const out = [];
	const push = (b) => {
		const n = b === "" ? "/" : b.endsWith("/") ? b : `${b}/`;
		if (!out.includes(n)) out.push(n);
	};
	push(primary);
	if (inferred && inferred !== primary) push(inferred);
	return out;
};
/**
* Default SW scope for a script URL (browser allows at most the script’s directory).
* `/sw.js` → `/` ; `/apps/cw/sw.js` → `/apps/cw/`
*/
var scopeForServiceWorkerScript = (swUrl) => {
	try {
		const origin = typeof globalThis !== "undefined" && globalThis.location?.origin ? String(globalThis.location.origin) : "https://invalid.invalid";
		const path = new URL(swUrl, `${origin}/`).pathname;
		const slash = path.lastIndexOf("/");
		return slash <= 0 ? "/" : path.slice(0, slash + 1);
	} catch {
		return "/";
	}
};
var getServiceWorkerCandidates = () => {
	const isDev = Boolean({
		"BASE_URL": "./",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": false
	}?.DEV);
	const bases = serviceWorkerPathBases();
	const perBaseDev = [];
	const perBaseProd = [];
	for (const b of bases) {
		perBaseDev.push(`${b}dev-sw.js?dev-sw`);
		if (b !== "/") {
			perBaseDev.push(`${b}sw.js`);
			perBaseProd.push(`${b}sw.js`);
		}
	}
	const devFallbacks = ["/dev-sw.js?dev-sw", "/sw.js"];
	let prod = ["/sw.js", "/apps/cw/sw.js"];
	try {
		const p = String(globalThis?.location?.pathname || "");
		if (p === "/apps/cw" || p.startsWith("/apps/cw/")) prod = ["/apps/cw/sw.js", "/sw.js"];
	} catch {}
	const merged = isDev ? [
		...perBaseDev,
		...devFallbacks,
		...perBaseProd
	] : [...new Set([...perBaseProd, ...prod])];
	return [...new Set(merged)];
};
var ensureServiceWorkerRegistered = async () => {
	if (typeof window === "undefined") return null;
	if (!("serviceWorker" in navigator)) return null;
	const protocol = (globalThis?.location?.protocol || "").toLowerCase();
	if (protocol === "chrome-extension:" || protocol === "file:" || protocol === "about:") return null;
	if (protocol !== "https:" && protocol !== "http:") return null;
	const tryGet = async (clientUrl) => {
		if (!clientUrl) return void 0;
		try {
			return await navigator.serviceWorker.getRegistration(clientUrl) ?? void 0;
		} catch {
			return;
		}
	};
	try {
		let existing = await tryGet(typeof globalThis !== "undefined" ? globalThis.location?.href : "");
		if (!existing?.active && !existing?.waiting && !existing?.installing) {
			const origin = typeof globalThis !== "undefined" && globalThis.location?.origin ? String(globalThis.location.origin) : "";
			const base = viteBasePrefix();
			if (origin && base !== "/") existing = await tryGet(new URL(base, origin).href);
		}
		if (!existing?.active && !existing?.waiting && !existing?.installing) {
			const origin = typeof globalThis !== "undefined" && globalThis.location?.origin ? String(globalThis.location.origin) : "";
			if (origin) existing = await tryGet(new URL("/", origin).href);
		}
		if (existing?.active || existing?.waiting || existing?.installing) return existing;
	} catch {}
	const candidates = getServiceWorkerCandidates();
	const tryRegister = async (url) => {
		const scope = scopeForServiceWorkerScript(url);
		const isDevVirtualWorker = url.includes("/dev-sw.js?dev-sw");
		try {
			return await navigator.serviceWorker.register(url, {
				scope,
				updateViaCache: "none"
			});
		} catch (eClassic) {
			if (isDevVirtualWorker) try {
				return await navigator.serviceWorker.register(url, {
					scope,
					type: "module",
					updateViaCache: "none"
				});
			} catch (eModule) {
				return null;
			}
			return null;
		}
	};
	for (const url of candidates) {
		if (!(await probeScriptUrl(url)).ok) continue;
		const reg = await tryRegister(url);
		if (reg) return reg;
	}
	return null;
};
//#endregion
//#region src/shared/boot/toast.ts
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
/**
* Listen for toast broadcasts (call in main thread contexts)
*
* @returns Cleanup function to stop listening
*/
var listenForToasts = () => {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const channel = new BroadcastChannel("rs-toast");
	const handler = (event) => {
		if (event.data?.type === "show-toast" && event.data?.options) showToast(event.data.options);
	};
	channel.addEventListener("message", handler);
	return () => {
		channel.removeEventListener("message", handler);
		channel.close();
	};
};
/**
* Initialize toast listener for receiving broadcasts
* Call this in main thread contexts (content scripts, popup, etc.)
*
* @returns Cleanup function to stop listening
*/
var initToastReceiver = () => {
	return listenForToasts();
};
//#endregion
//#region src/shared/routing/pwa/pwa-copy.ts
/**
* PWA Clipboard Handler
* Connects PWA frontend with service worker clipboard operations
* Listens for clipboard requests from service worker via BroadcastChannel
*/
var _pwaClipboardInitialized = false;
var _cleanupFns = [];
var sendShareTargetResultToWorkcenter = async (data, priority = "high") => {
	await unifiedMessaging.sendMessage({
		type: "share-target-result",
		destination: "workcenter",
		data,
		metadata: { priority }
	});
};
var tryParseJSON = (data) => {
	if (typeof data !== "string") return null;
	try {
		return JSON.parse(data);
	} catch {
		return null;
	}
};
var extractRecognizedContent = (data) => {
	if (typeof data === "string") {
		const parsed = tryParseJSON(data);
		if (parsed && typeof parsed === "object") {
			const obj = parsed;
			if (obj.recognized_data != null) {
				const rd = obj.recognized_data;
				if (Array.isArray(rd)) return rd.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("\n");
				return typeof rd === "string" ? rd : JSON.stringify(rd);
			}
			if (typeof obj.verbose_data === "string" && obj.verbose_data.trim()) return obj.verbose_data;
			if (typeof obj.content === "string" && obj.content.trim()) return obj.content;
			const choices = obj.choices;
			if (Array.isArray(choices) && choices.length > 0) {
				const first = choices[0];
				const msgContent = first?.message?.content;
				if (typeof msgContent === "string" && msgContent.trim()) return msgContent;
				const txt = first?.text;
				if (typeof txt === "string" && txt.trim()) return txt;
			}
			const outText = obj.output_text;
			if (typeof outText === "string" && outText.trim()) return outText;
			const output = obj.output;
			if (Array.isArray(output) && output.length > 0) {
				const text0 = output[0]?.content?.[0]?.text;
				if (typeof text0 === "string" && text0.trim()) return text0;
			}
			return data;
		}
		return data;
	}
	if (data && typeof data === "object") {
		const obj = data;
		if (obj.recognized_data != null) {
			const rd = obj.recognized_data;
			if (Array.isArray(rd)) return rd.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("\n");
			return typeof rd === "string" ? rd : JSON.stringify(rd);
		}
		if (typeof obj.verbose_data === "string" && obj.verbose_data.trim()) return obj.verbose_data;
		if (typeof obj.content === "string" && obj.content.trim()) return obj.content;
		const choices = obj.choices;
		if (Array.isArray(choices) && choices.length > 0) {
			const first = choices[0];
			const msgContent = first?.message?.content;
			if (typeof msgContent === "string" && msgContent.trim()) return msgContent;
			const txt = first?.text;
			if (typeof txt === "string" && txt.trim()) return txt;
		}
		const outText = obj.output_text;
		if (typeof outText === "string" && outText.trim()) return outText;
		const output = obj.output;
		if (Array.isArray(output) && output.length > 0) {
			const text0 = output[0]?.content?.[0]?.text;
			if (typeof text0 === "string" && text0.trim()) return text0;
		}
	}
	return data;
};
/** Only browsers with a fetchable `/clipboard/pending` (PWA/site SW) — never extension or opaque origins */
var clipboardPendingSupported = () => {
	try {
		if (typeof window === "undefined") return false;
		const href = String(window.location?.href ?? "");
		if (href.startsWith("chrome-extension://") || href.startsWith("moz-extension://") || href.startsWith("edge-extension://")) return false;
		const p = window.location?.protocol ?? "";
		return p === "http:" || p === "https:";
	} catch {
		return false;
	}
};
/**
* Check for pending clipboard operations from service worker
*/
var checkPendingClipboardOperations = async () => {
	try {
		if (!clipboardPendingSupported()) return;
		if (!navigator.serviceWorker) {
			console.log("[PWA-Copy] Service workers not supported");
			return;
		}
		if (!navigator.serviceWorker.controller) {
			console.log("[PWA-Copy] Waiting for service worker to control page...");
			if (!(await navigator.serviceWorker.ready).active) {
				console.log("[PWA-Copy] Service worker not active yet");
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		console.log("[PWA-Copy] Checking for pending clipboard operations...");
		const response = await fetch("/clipboard/pending");
		const responseType = String(response.headers.get("content-type") || "").toLowerCase();
		if (!response.ok || !responseType.includes("application/json")) {
			console.log("[PWA-Copy] Pending clipboard endpoint is unavailable in this context, skipping");
			return;
		}
		const data = await response.json();
		if (data.operations && Array.isArray(data.operations) && data.operations.length > 0) {
			console.log("[PWA-Copy] Found", data.operations.length, "pending clipboard operations");
			for (const operation of data.operations) if (operation.type === "ai-result" && operation.data) {
				console.log("[PWA-Copy] Processing pending AI result:", operation.id);
				const text = extractRecognizedContent(operation.data);
				await copy(text, { showFeedback: true });
				await sendShareTargetResultToWorkcenter({
					content: typeof text === "string" ? text : JSON.stringify(text),
					rawData: operation.data,
					timestamp: Date.now(),
					source: "share-target",
					action: "AI Processing (Pending)",
					metadata: {
						operationId: operation.id,
						fromPendingQueue: true
					}
				});
				console.log("[PWA-Copy] Delivered pending share target result to work center");
				try {
					await fetch(`/clipboard/remove/${operation.id}`, { method: "DELETE" });
				} catch (error) {
					console.warn("[PWA-Copy] Failed to remove processed operation:", error);
				}
			}
		}
	} catch (error) {
		console.warn("[PWA-Copy] Failed to check pending operations:", error);
	}
};
/**
* Initialize PWA clipboard listeners
* Call this early in the PWA lifecycle to receive clipboard requests from service worker
*/
var initPWAClipboard = () => {
	if (!clipboardPendingSupported()) return () => void 0;
	if (_pwaClipboardInitialized) return () => cleanupPWAClipboard();
	_pwaClipboardInitialized = true;
	console.log("[PWA-Copy] Initializing clipboard and toast receivers...");
	checkPendingClipboardOperations().catch(console.warn);
	_cleanupFns.push(initClipboardReceiver());
	_cleanupFns.push(initToastReceiver());
	if (typeof BroadcastChannel !== "undefined") {
		const clipboardChannel = new BroadcastChannel("rs-clipboard");
		const clipboardHandler = async (event) => {
			const { type, data, operations } = event.data || {};
			console.log("[PWA-Copy] Clipboard channel message:", type, summarizeForLog$1(data));
			if (type === "pending-operations" && operations && Array.isArray(operations)) {
				console.log("[PWA-Copy] Received", operations.length, "pending operations via broadcast");
				for (const operation of operations) if (operation.type === "ai-result" && operation.data) {
					console.log("[PWA-Copy] Processing broadcasted AI result:", operation.id);
					const text = typeof operation.data === "string" ? operation.data : JSON.stringify(operation.data);
					await copy(text, { showFeedback: true });
					await sendShareTargetResultToWorkcenter({
						content: text,
						rawData: operation.data,
						timestamp: Date.now(),
						source: "share-target",
						action: "AI Processing (Broadcasted)",
						metadata: {
							operationId: operation.id,
							fromBroadcast: true
						}
					});
					console.log("[PWA-Copy] Delivered broadcasted share target result to work center");
					try {
						await fetch(`/clipboard/remove/${operation.id}`, { method: "DELETE" });
					} catch (error) {
						console.warn("[PWA-Copy] Failed to remove processed operation:", error);
					}
				}
			}
		};
		clipboardChannel.addEventListener("message", clipboardHandler);
		_cleanupFns.push(() => {
			clipboardChannel.removeEventListener("message", clipboardHandler);
			clipboardChannel.close();
		});
		const shareChannel = new BroadcastChannel("rs-share-target");
		const shareHandler = async (event) => {
			const { type, data } = event.data || {};
			console.log("[PWA-Copy] Share channel message:", type, summarizeForLog$1(data));
			if (type === "copy-shared" && data) await copy(data, { showFeedback: true });
			if (type === "share-received" && data) console.log("[PWA-Copy] Share received from SW:", summarizeForLog$1(data));
			if (type === "ai-result" && data) {
				console.log("[PWA-Copy] AI result from SW:", summarizeForLog$1(data));
				if (data.success && data.data) {
					const text = extractRecognizedContent(data.data);
					await copy(text, { showFeedback: true });
					await unifiedMessaging.sendMessage({
						type: "share-target-result",
						destination: "workcenter",
						data: {
							content: typeof text === "string" ? text : JSON.stringify(text),
							rawData: data.data,
							timestamp: Date.now(),
							source: "share-target",
							action: "AI Processing",
							metadata: {
								fromServiceWorker: true,
								shareTargetId: data.id || "unknown"
							}
						},
						metadata: { priority: "high" }
					});
				} else showToast({
					message: data.error || "Processing failed",
					kind: "error"
				});
			}
			if (type === "share-received" && data) {
				console.log("[PWA-Copy] Share received, broadcasting input to work center:", summarizeForLog$1(data));
				await unifiedMessaging.sendMessage({
					type: "share-target-input",
					destination: "workcenter",
					data: {
						...data,
						timestamp: Date.now(),
						metadata: {
							fromServiceWorker: true,
							...data.metadata
						}
					},
					metadata: { priority: "high" }
				});
			}
		};
		shareChannel.addEventListener("message", shareHandler);
		_cleanupFns.push(() => {
			shareChannel.removeEventListener("message", shareHandler);
			shareChannel.close();
		});
		const swChannel = new BroadcastChannel("rs-sw");
		const swHandler = async (event) => {
			const { type, results } = event.data || {};
			console.log("[PWA-Copy] SW channel message:", type, summarizeForLog$1(results));
			if (type === "commit-to-clipboard" && results && Array.isArray(results)) {
				for (const result of results) if (result?.status === "queued" && result?.data) {
					console.log("[PWA-Copy] Copying result data:", summarizeForLog$1(result.data));
					const extractedContent = extractRecognizedContent(result.data);
					await copy(extractedContent, { showFeedback: true });
					await unifiedMessaging.sendMessage({
						type: "share-target-result",
						destination: "workcenter",
						data: {
							content: typeof extractedContent === "string" ? extractedContent : JSON.stringify(extractedContent),
							rawData: result.data,
							timestamp: Date.now(),
							source: "share-target",
							action: "Legacy AI Processing",
							metadata: {
								legacyCommit: true,
								resultStatus: result.status
							}
						},
						metadata: { priority: "normal" }
					});
					break;
				}
			}
		};
		swChannel.addEventListener("message", swHandler);
		_cleanupFns.push(() => {
			swChannel.removeEventListener("message", swHandler);
			swChannel.close();
		});
	}
	console.log("[PWA-Copy] Receivers initialized");
	return () => cleanupPWAClipboard();
};
/**
* Cleanup all PWA clipboard listeners
*/
var cleanupPWAClipboard = () => {
	_cleanupFns.forEach((fn) => fn?.());
	_cleanupFns = [];
	_pwaClipboardInitialized = false;
};
//#endregion
//#region src/shared/routing/channel/ViewTransferRouting.ts
/**
* Canonical classification for share-target / launch-queue files (extension often beats flaky MIME).
* Viewer-first routing treats `markdown` + `text`; other kinds stay on Work Center or sibling sinks.
*/
var classifyIngressFile = (file) => {
	const name = String(file?.name || "").toLowerCase();
	const mime = String(file?.type || "").toLowerCase();
	if (mime.startsWith("image/")) return "image";
	const mdTail = /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i;
	if (mime === "text/markdown" || mdTail.test(name)) return "markdown";
	if (mime.startsWith("text/")) return "text";
	if (mime === "application/json" || mime === "application/xml" || mime === "application/xhtml+xml" || mime === "application/javascript" || mime === "application/typescript" || mime === "application/x-typescript") return "text";
	if (/\.(?:txt|text|html|htm|css|scss|sass|less|json|csv|xml|yaml|yml|log|ini|env|toml|graphql|svg|tsx?|jsx?|mts|cts|cjs|mjs|vue|svelte|rst)(?:$|[?#])/i.test(name)) return mdTail.test(name) ? "markdown" : "text";
	if (!mime || mime === "application/octet-stream") {
		if (mdTail.test(name)) return "markdown";
	}
	if (/\.(?:png|jpe?g|gif|webp|bmp)(?:$|[?#])/i.test(name)) return "image";
	return "file";
};
/** Filename-only classification when blobs are still in Cache Storage (`fileCount` but `files=[]`). */
var classifyIngressFromBasename = (raw) => {
	const t = raw.trim().replace(/\\/g, "/");
	const cut = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\"));
	const nameOnly = ((cut >= 0 ? t.slice(cut + 1) : t) || "").trim();
	if (!nameOnly) return "file";
	try {
		return classifyIngressFile(new File([], nameOnly, { type: "application/octet-stream" }));
	} catch {
		return "file";
	}
};
var getContentType = (payload) => {
	const files = Array.isArray(payload.files) ? payload.files : [];
	const text = String(payload.text || "").trim();
	const url = String(payload.url || "").trim();
	const meta = payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata) ? payload.metadata : {};
	const expectedFileCount = Math.max(Number(meta.fileCount) || 0, Number(payload.fileCount) || 0);
	/** Android share-target often ships a `content:`/`https:` URL together with attachments; blobs may hydrate later. */
	const filesStillPending = files.length === 0 && expectedFileCount > 0;
	if (payload.hint?.contentType && !filesStillPending) return String(payload.hint.contentType);
	if (files.length > 0) {
		const kind = classifyIngressFile(files[0]);
		if (kind === "image") return "image";
		if (kind === "markdown") return "markdown";
		if (kind === "text") return "text";
		return "file";
	}
	/** SW metadata row often beats File[] hydration (`fileCount` only) — classify from title/filename hint. */
	const nameProbe = typeof payload.hint?.filename === "string" && payload.hint.filename.trim() || typeof payload.title === "string" && payload.title.trim() || "";
	if (!text && nameProbe && (!url || filesStillPending)) {
		const nk = classifyIngressFromBasename(nameProbe);
		if (nk === "markdown") return "markdown";
		if (nk === "text") return "text";
		if (nk === "image") return "image";
		if (filesStillPending && nk === "file") return "file";
	}
	if (url) {
		const normalized = url.split("#")[0].split("?")[0].toLowerCase();
		if (/\.(md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/.test(normalized)) return "markdown";
		return "url";
	}
	if (text) return "text";
	return "other";
};
var pickDestination = (payload, contentType) => {
	if (payload.hint?.action === "save") return "explorer";
	/** Readable docs should win over stale `hint.destination` from cached/share envelopes. */
	if (contentType === "markdown" || contentType === "text") return "viewer";
	if (payload.hint?.destination) return payload.hint.destination;
	if (payload.hint?.action === "process" || payload.hint?.action === "attach") return "workcenter";
	if (payload.hint?.action === "open") return "viewer";
	if (contentType === "url") return "workcenter";
	if (contentType === "image" || contentType === "file") return "workcenter";
	return "workcenter";
};
var toMessageType = (destination, hint) => {
	if (destination === "viewer") return hint?.action === "open" ? "content-load" : "content-view";
	if (destination === "explorer") return "file-save";
	if (destination === "workcenter") return "content-attach";
	if (destination === "editor") return "content-load";
	return "content-share";
};
var resolveViewTransfer = (payload) => {
	const contentType = getContentType(payload);
	const destination = pickDestination(payload, contentType);
	const messageType = toMessageType(destination, payload.hint);
	const files = Array.isArray(payload.files) ? payload.files : [];
	const data = {
		title: payload.title,
		text: payload.text,
		content: payload.text,
		url: payload.url,
		files,
		filename: payload.hint?.filename || files[0]?.name,
		source: payload.source,
		route: payload.route,
		hint: payload.hint
	};
	const resolved = {
		destination: normalizeDestination(destination),
		routePath: `/${destination}`,
		messageType,
		contentType,
		data,
		metadata: {
			source: payload.source,
			route: payload.route,
			pending: Boolean(payload.pending),
			hint: payload.hint,
			...payload.metadata || {}
		}
	};
	console.log("[ViewTransfer] Resolved transfer:", summarizeForLog$1({
		source: payload.source,
		route: payload.route,
		pending: payload.pending,
		hint: payload.hint,
		contentType,
		destination,
		messageType,
		fileCount: files.length
	}));
	return resolved;
};
var mirrorTransferToViewChannel = (resolved, message) => {
	if (typeof BroadcastChannel === "undefined") return;
	try {
		const ch = new BroadcastChannel(viewBroadcastChannelName(resolved.destination));
		ch.postMessage({
			type: "view-transfer",
			message
		});
		ch.close();
	} catch (e) {
		console.warn("[ViewTransfer] View-channel mirror failed:", e);
	}
};
var dispatchViewTransfer = async (payload) => {
	const resolved = resolveViewTransfer(payload);
	Array.isArray(payload.files) && payload.files;
	const hasBinaryPayload = resolved.contentType === "image" || resolved.contentType === "file";
	const message = {
		id: crypto.randomUUID(),
		type: resolved.messageType,
		destination: normalizeDestination(resolved.destination),
		contentType: resolved.contentType,
		data: resolved.data,
		metadata: resolved.metadata,
		source: `view-transfer:${payload.source}`
	};
	console.log("[ViewTransfer] Dispatching message:", summarizeForLog$1({
		destination: message.destination,
		type: message.type,
		contentType: message.contentType,
		metadata: message.metadata
	}));
	mirrorTransferToViewChannel(resolved, message);
	let queuedAsPending = false;
	if (payload.pending && !hasBinaryPayload) try {
		const pendingMessage = {
			...message,
			data: {
				...message.data || {},
				files: []
			}
		};
		enqueuePendingMessage(resolved.destination, pendingMessage);
		queuedAsPending = true;
	} catch (error) {
		console.warn("[ViewTransfer] Failed to enqueue pending message:", error);
	}
	const deliveredNow = await sendProtocolMessage({
		...message,
		purpose: ["deliver", "mail"],
		protocol: "window",
		op: payload.hint?.action === "open" ? "invoke" : "deliver",
		srcChannel: message.source,
		dstChannel: normalizeDestination(resolved.destination)
	});
	const delivered = deliveredNow || queuedAsPending;
	console.log("[ViewTransfer] Message delivery status:", {
		deliveredNow,
		queuedAsPending,
		hasBinaryPayload,
		delivered,
		destination: resolved.destination,
		routePath: resolved.routePath
	});
	return {
		delivered,
		resolved
	};
};
//#endregion
//#region src/shared/routing/policies/ingress-pipeline-guard.ts
/**
* Throttles share-target / launch-queue style ingress so bursts cannot
* run more than twice within any 100ms sliding window (additional calls wait).
*/
var WINDOW_MS = 100;
var MAX_IN_WINDOW = 2;
var recentStarts = [];
var prune = (now) => {
	while (recentStarts.length && now - recentStarts[0] > WINDOW_MS) recentStarts.shift();
};
/**
* Wait until a pipeline run is allowed, then record this run.
* Call once at the start of a share / launch-queue transfer pipeline.
*/
var waitForIngressPipelineSlot = async () => {
	const spin = () => new Promise((r) => {
		globalThis.queueMicrotask(r);
	});
	for (;;) {
		const now = Date.now();
		prune(now);
		if (recentStarts.length < MAX_IN_WINDOW) {
			recentStarts.push(Date.now());
			return;
		}
		const wait = WINDOW_MS - (now - recentStarts[0]) + 1;
		await new Promise((resolve) => {
			globalThis.setTimeout(resolve, Math.max(0, wait));
		});
		await spin();
	}
};
//#endregion
//#region src/shared/routing/channel/LogSanitizer.ts
var DEFAULT_OPTIONS = {
	maxStringLength: 180,
	maxArrayLength: 8,
	maxObjectKeys: 20,
	maxDepth: 3
};
var isFileLike = (value) => typeof File !== "undefined" && value instanceof File;
var isBlobLike = (value) => typeof Blob !== "undefined" && value instanceof Blob;
var summarizeString = (value, maxStringLength) => {
	if (!value) return value;
	const parsedDataUrl = parseDataUrl(value);
	if (parsedDataUrl) return `[data-url ${parsedDataUrl.mimeType || "application/octet-stream"}, length=${value.length}]`;
	if (value.length > maxStringLength && isBase64Like(value)) return `[base64-like string, length=${value.length}]`;
	if (value.length > maxStringLength) return `${value.slice(0, maxStringLength)}... [truncated ${value.length - maxStringLength} chars]`;
	return value;
};
var summarizeFormData = (formData, options) => {
	const entries = Array.from(formData.entries());
	const keys = [...new Set(entries.map(([key]) => key))];
	const preview = {};
	for (const key of keys.slice(0, options.maxObjectKeys)) preview[key] = formData.getAll(key).slice(0, options.maxArrayLength).map((entry) => {
		if (typeof entry === "string") return summarizeString(entry, options.maxStringLength);
		if (isFileLike(entry)) return {
			file: entry.name,
			type: entry.type,
			size: entry.size
		};
		return summarizeForLog(entry, options);
	});
	return {
		kind: "FormData",
		keyCount: keys.length,
		keys,
		preview
	};
};
var summarizeRecord = (value, options, depth, seen) => {
	if (depth >= options.maxDepth) return `[object depth>${options.maxDepth}]`;
	if (seen.has(value)) return "[circular]";
	seen.add(value);
	const entries = Object.entries(value);
	const sliced = entries.slice(0, options.maxObjectKeys);
	const summary = {};
	for (const [key, entryValue] of sliced) summary[key] = summarizeUnknown(entryValue, options, depth + 1, seen);
	if (entries.length > options.maxObjectKeys) summary.__truncatedKeys = entries.length - options.maxObjectKeys;
	return summary;
};
var summarizeUnknown = (value, options, depth, seen) => {
	if (value == null) return value;
	if (typeof value === "string") return summarizeString(value, options.maxStringLength);
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return value;
	if (typeof value === "symbol") return value.toString();
	if (typeof value === "function") return `[function ${value.name || "anonymous"}]`;
	if (typeof FormData !== "undefined" && value instanceof FormData) return summarizeFormData(value, options);
	if (isFileLike(value)) return {
		file: value.name,
		type: value.type,
		size: value.size
	};
	if (isBlobLike(value)) return {
		blob: true,
		type: value.type,
		size: value.size
	};
	if (Array.isArray(value)) {
		if (depth >= options.maxDepth) return `[array(${value.length}) depth>${options.maxDepth}]`;
		const summary = value.slice(0, options.maxArrayLength).map((item) => summarizeUnknown(item, options, depth + 1, seen));
		if (value.length > options.maxArrayLength) summary.push(`[${value.length - options.maxArrayLength} more items]`);
		return summary;
	}
	if (typeof value === "object") return summarizeRecord(value, options, depth, seen);
	return String(value);
};
var summarizeForLog = (value, partialOptions = {}) => {
	return summarizeUnknown(value, {
		...DEFAULT_OPTIONS,
		...partialOptions
	}, 0, /* @__PURE__ */ new WeakSet());
};
//#endregion
//#region src/shared/routing/pwa/sw-handling.ts
/**
* Window-side PWA integration helpers.
*
* This module bridges the main app with the service worker, share-target cache,
* launch-queue API, and broadcast-based clipboard/share flows. It exists on the
* page side, while `src/pwa/sw.ts` owns the worker-side behavior.
*/
var sw_handling_exports = /* @__PURE__ */ __exportAll({
	CHANNELS: () => CHANNELS,
	checkPendingShareData: () => checkPendingShareData,
	consumeCachedShareTargetPayload: () => consumeCachedShareTargetPayload,
	ensureAppCss: () => ensureAppCss,
	handleShareTarget: () => handleShareTarget,
	initIngressPWA: () => initIngressPWA,
	initReceivers: () => initReceivers,
	initServiceWorker: () => initServiceWorker,
	processShareTargetData: () => processShareTargetData,
	setupLaunchQueueConsumer: () => setupLaunchQueueConsumer,
	storeShareTargetPayloadToCache: () => storeShareTargetPayloadToCache
});
/**
* WHY: MV3 extension pages (`chrome-extension:`) do not expose PWA-relative routes (`/clipboard/pending`)
* or the site service worker bundle. Running ingress here caused `fetch('/clipboard/pending')` →
* `chrome-extension://…/clipboard/pending` (404) and needless SW / launch-queue churn during boot.
*
* IMPORTANT: Compare `href`/protocol explicitly — if `location.protocol` were ever missing briefly,
* `undefined !== "chrome-extension:"` was true and the full PWA clipboard stack still ran.
*/
var shouldRunPwaIngress = () => {
	try {
		if (typeof window === "undefined") return false;
		const href = String(window.location?.href ?? "");
		if (href.startsWith("chrome-extension://") || href.startsWith("moz-extension://") || href.startsWith("edge-extension://")) return false;
		const p = window.location?.protocol ?? "";
		if (p === "chrome-extension:" || p === "moz-extension:" || p === "edge-extension:") return false;
		return p === "http:" || p === "https:";
	} catch {
		return false;
	}
};
/** Ensure the production app CSS bundle is present when the app boots outside extension pages. */
var ensureAppCss = () => {
	if ({
		"BASE_URL": "./",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": false
	}?.DEV) return;
	if (typeof window === "undefined") return;
	if (globalThis?.location?.protocol === "chrome-extension:") return;
	if (document.getElementById("rs-crossword-css")) return;
};
var _swInitPromise = null;
var _swControllerReloadBound = false;
var _swReloadPending = false;
var _swUpdateInterval = null;
var _swVisibilityUpdateBound = false;
var _swOptions = {
	immediate: false,
	onRegistered: () => {
		console.log("[PWA] Service worker registered successfully");
	},
	onRegisterError: (error) => {
		console.error("[PWA] Service worker registration failed:", error);
	}
};
var bindControllerChangeReload = () => {
	if (_swControllerReloadBound || typeof navigator === "undefined" || !navigator.serviceWorker) return;
	_swControllerReloadBound = true;
	navigator.serviceWorker.addEventListener("controllerchange", () => {
		if (_swReloadPending) return;
		_swReloadPending = true;
		console.log("[PWA] Service worker controller changed");
		globalThis?.dispatchEvent?.(new CustomEvent("sw-controller-changed"));
		if (_swOptions?.immediate === true) globalThis.location.reload();
	});
};
var activateWaitingWorker = (registration, reason) => {
	const waiting = registration?.waiting;
	if (!waiting) return false;
	console.log(`[PWA] Activating waiting service worker (${reason})`);
	waiting.postMessage({ type: "SKIP_WAITING" });
	return true;
};
/** Re-fetch `sw.js` from network; helps when CDN/proxy cache or long-lived tabs hide updates. */
var probeServiceWorkerUpdate = async (registration) => {
	if (!registration?.update) return;
	await registration.update().catch((e) => console.warn("[PWA] registration.update failed:", e));
};
var bindServiceWorkerLifecycleUpdateChecks = (registration) => {
	if (_swVisibilityUpdateBound || typeof document === "undefined") return;
	_swVisibilityUpdateBound = true;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		probeServiceWorkerUpdate(registration);
	});
};
/**
* Initialize PWA service worker early in the page lifecycle
* This ensures share target and other PWA features work correctly
*/
var initServiceWorker = async (_options = _swOptions) => {
	_swOptions = {
		..._swOptions,
		..._options || {}
	};
	if (_swInitPromise) return _swInitPromise;
	_swInitPromise = (async () => {
		if (typeof globalThis === "undefined") return null;
		const protocol = (globalThis?.location?.protocol || "").toLowerCase();
		if (protocol === "chrome-extension:" || protocol === "file:" || protocol === "about:") return null;
		if (protocol !== "https:" && protocol !== "http:") return null;
		if (!("serviceWorker" in navigator)) {
			console.warn("[PWA] Service workers not supported");
			return null;
		}
		try {
			const registration = await ensureServiceWorkerRegistered();
			const viteEnv = {
				"BASE_URL": "./",
				"DEV": false,
				"MODE": "production",
				"PROD": true,
				"SSR": false
			};
			if (!registration) {
				if (viteEnv?.DEV) console.warn("[PWA] Service worker not registered (dev): probe failed for dev-sw/sw.js — check Vite BASE_URL matches vite-plugin-pwa dev worker path.");
				else console.error("[PWA] Service worker registration failed: no valid sw.js found");
				return null;
			}
			bindControllerChangeReload();
			await probeServiceWorkerUpdate(registration);
			bindServiceWorkerLifecycleUpdateChecks(registration);
			if (viteEnv?.DEV && registration.waiting) activateWaitingWorker(registration, "initial");
			try {
				if (_swOptions?.immediate === true && registration.waiting) activateWaitingWorker(registration, "initial");
			} catch (e) {
				console.warn("[PWA] Failed to auto-activate waiting service worker:", e);
			}
			registration?.addEventListener?.("updatefound", () => {
				const newWorker = registration?.installing;
				if (newWorker) newWorker?.addEventListener?.("statechange", () => {
					if (newWorker?.state === "installed" && navigator.serviceWorker.controller) {
						console.log("[PWA] New service worker available");
						showToast({
							message: "App update available",
							kind: "info"
						});
						try {
							if (_swOptions?.immediate === true && !activateWaitingWorker(registration, "updatefound") && viteEnv?.DEV) globalThis.setTimeout(() => {
								try {
									activateWaitingWorker(registration, "updatefound");
								} catch (retryError) {
									console.warn("[PWA] Delayed SW activation failed:", retryError);
								}
							}, 0);
						} catch (e) {
							console.warn("[PWA] Failed to auto-activate waiting service worker on updatefound:", e);
						}
					}
				});
			});
			if (_swUpdateInterval) {
				globalThis?.clearInterval?.(_swUpdateInterval);
				_swUpdateInterval = null;
			}
			if (!viteEnv?.DEV) _swUpdateInterval = globalThis?.setInterval?.(() => {
				registration?.update?.().catch?.(console.warn);
			}, 300 * 1e3);
			console.log("[PWA] Service worker registered successfully");
			return registration;
		} catch (error) {
			console.error("[PWA] Service worker registration failed:", error);
			return null;
		}
	})();
	return _swInitPromise;
};
var _receiversCleanup = null;
/** Initialize one-time clipboard/share receivers used by the window-side PWA bridge. */
var initReceivers = () => {
	if (_receiversCleanup) return;
	_receiversCleanup = initPWAClipboard();
};
var inferShareContentType = (shareData) => {
	const files = Array.isArray(shareData.files) ? shareData.files.filter((f) => f instanceof File) : [];
	const text = String(shareData.text || "").trim();
	const url = String(shareData.url || shareData.sharedUrl || "").trim();
	if (files.length > 0) {
		const kind = classifyIngressFile(files[0]);
		if (kind === "image") return "image";
		if (kind === "markdown") return "markdown";
		if (kind === "text") return "text";
		return "file";
	}
	const fcEarly = Number(shareData.fileCount ?? 0);
	/**
	* Match {@link getContentType}: sidecar `url` must not block basename classification while blobs hydrate.
	* WHY: empty `probe` must fall through — previously we returned `"file"` and never reached `url` / `text`.
	*/
	if (fcEarly > 0) {
		const probe = typeof shareData.hint?.filename === "string" && shareData.hint.filename.trim() || typeof shareData.title === "string" && shareData.title.trim() || "";
		if (probe) {
			const bk = classifyIngressFromBasename(probe);
			if (bk === "markdown") return "markdown";
			if (bk === "text") return "text";
			if (bk === "image") return "image";
			return "file";
		}
	}
	if (text) return "text";
	if (url) return "url";
	if (fcEarly > 0) return "file";
	return "other";
};
/** Read textual file body for hydrate + launch-queue staging ({@link classifyIngressFile}). */
var isTextLikeFile = (file) => {
	const k = classifyIngressFile(file);
	return k === "markdown" || k === "text";
};
var hydrateTextPayloadFromFiles = async (shareData) => {
	const files = Array.isArray(shareData.files) ? shareData.files.filter((f) => f instanceof File) : [];
	if (!files.length) return shareData;
	const existingInline = String(shareData.text || "").trim();
	/** OS launch-queue merges / pending payloads can retain old `text` while `files[]` is the real doc. */
	const sourceKey = String(shareData.source || "");
	if (!(sourceKey === "launch-queue" || sourceKey === "cached-bootstrap" || sourceKey === "share-target" || !existingInline)) return shareData;
	const firstTextFile = files.find(isTextLikeFile);
	if (!firstTextFile) return shareData;
	try {
		const trimmed = (await firstTextFile.text())?.trim?.();
		if (!trimmed) return shareData;
		return {
			...shareData,
			title: shareData.title || firstTextFile.name,
			text: trimmed
		};
	} catch {
		return shareData;
	}
};
var shouldForceWorkCenterAttachment = async (shareData) => {
	const contentType = inferShareContentType(shareData);
	if (typeof shareData.aiEnabled === "boolean") return shareData.aiEnabled === false && !(contentType === "text" || contentType === "markdown");
	try {
		return ((await loadSettings().catch(() => null))?.ai?.autoProcessShared ?? true) === false && !(contentType === "text" || contentType === "markdown");
	} catch {
		return false;
	}
};
var extractTransferHint = (shareData) => {
	const hint = shareData?.hint;
	if (!hint || typeof hint !== "object") return void 0;
	return hint;
};
var hydrateTransferPayloadFromCache = async (opts = {}) => {
	const cachedPayload = await consumeCachedShareTargetPayload(opts);
	if (!cachedPayload) return null;
	return buildShareDataFromCachedPayload(cachedPayload);
};
/**
* WHY: `/share-target?shared=1` can run before SW finishes persisting blobs; routing on metadata alone
* sent markdown/text shares to Work Center on mobile (`files=[]`, inferred type=`other`/`file`).
*/
var awaitHydratedSharePayloadWithRetries = async (base, maxAttempts = 12) => {
	let merged = { ...base };
	if (Number(merged.fileCount ?? 0) > 0 && !merged.files?.length) for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const hydrated = await hydrateTransferPayloadFromCache({ clear: false });
			if (hydrated?.files?.length) {
				merged = {
					...merged,
					...hydrated,
					files: hydrated.files
				};
				break;
			}
		} catch {}
		await new Promise((resolve) => globalThis.setTimeout(resolve, 80 * attempt));
	}
	return merged;
};
/**
* Merge lightweight URL entry (`/share-target?shared=1&title=…`) with Cache Storage payload.
* WHY: `extractShareContent` can see a title "handle" and skip the cache branch while `File[]` only lives in the cache.
*/
var mergeUrlParamsShareWithCache = async (fromUrl) => {
	if (!("caches" in globalThis)) return {
		...fromUrl,
		source: "share-target"
	};
	try {
		const response = await (await caches.open("share-target-data")).match("/share-target-data");
		if (!response) return {
			...fromUrl,
			source: "share-target"
		};
		const row = await response.json().catch(() => null);
		if (!row) return {
			...fromUrl,
			source: "share-target"
		};
		const hydrated = await awaitHydratedSharePayloadWithRetries(row);
		const hFiles = Array.isArray(hydrated.files) ? hydrated.files.filter((f) => f instanceof File) : [];
		const uFiles = Array.isArray(fromUrl.files) ? fromUrl.files.filter((f) => f instanceof File) : [];
		const files = hFiles.length > 0 ? hFiles : uFiles;
		const fc = Math.max(Number(hydrated.fileCount ?? 0), Number(fromUrl.fileCount ?? 0), files.length);
		const hintA = typeof fromUrl.hint === "object" && fromUrl.hint !== null ? { ...fromUrl.hint } : {};
		const hintB = typeof hydrated.hint === "object" && hydrated.hint !== null ? { ...hydrated.hint } : {};
		const hint = Object.keys({
			...hintB,
			...hintA
		}).length > 0 ? {
			...hintB,
			...hintA,
			filename: hintA.filename || hintB.filename || files[0]?.name
		} : files[0]?.name ? { filename: files[0].name } : void 0;
		return {
			...fromUrl,
			...hydrated,
			title: hydrated.title || fromUrl.title,
			text: hydrated.text ?? fromUrl.text,
			url: hydrated.url || fromUrl.url,
			sharedUrl: hydrated.sharedUrl || fromUrl.sharedUrl,
			files: files.length ? files : void 0,
			fileCount: fc > 0 ? fc : hydrated.fileCount ?? fromUrl.fileCount,
			imageCount: hydrated.imageCount ?? fromUrl.imageCount,
			...hint ? { hint } : {},
			source: "share-target"
		};
	} catch (error) {
		console.warn("[ShareTarget] mergeUrlParamsShareWithCache failed:", error);
		return {
			...fromUrl,
			source: "share-target"
		};
	}
};
var routeToTransferView = async (shareData, source, hint, pending = false) => {
	await waitForIngressPipelineSlot();
	const preparedData = await hydrateTextPayloadFromFiles(shareData);
	const files = Array.isArray(preparedData.files) ? preparedData.files.filter((file) => file instanceof File) : [];
	console.log("[ViewTransfer] Pipeline input:", summarizeForLog({
		source,
		pending,
		hint,
		title: preparedData.title,
		text: preparedData.text,
		url: preparedData.url || preparedData.sharedUrl,
		fileCount: files.length,
		fileCountReported: preparedData.fileCount,
		imageCountReported: preparedData.imageCount,
		timestamp: preparedData.timestamp
	}));
	const forceAttachToWorkCenter = await shouldForceWorkCenterAttachment(preparedData);
	const mergedViewerHint = (inferShareContentType(preparedData) === "markdown" || inferShareContentType(preparedData) === "text") && !forceAttachToWorkCenter ? {
		...hint,
		destination: "viewer",
		action: "open",
		filename: hint?.filename || files[0]?.name
	} : void 0;
	const resolvedHint = forceAttachToWorkCenter ? {
		destination: "workcenter",
		action: "attach",
		...hint || {}
	} : mergedViewerHint ?? hint;
	console.log("[ViewTransfer] Hint resolution:", {
		forceAttachToWorkCenter,
		inputHint: summarizeForLog(hint),
		resolvedHint: summarizeForLog(resolvedHint)
	});
	const { delivered, resolved } = await dispatchViewTransfer({
		source,
		route: source === "launch-queue" ? "launch-queue" : "share-target",
		title: preparedData.title,
		text: preparedData.text,
		url: preparedData.url || preparedData.sharedUrl,
		files,
		fileCount: preparedData.fileCount ?? files.length,
		hint: resolvedHint,
		pending,
		metadata: {
			timestamp: preparedData.timestamp || Date.now(),
			fileCount: preparedData.fileCount ?? files.length,
			imageCount: preparedData.imageCount ?? files.filter((f) => f.type.startsWith("image/")).length
		}
	});
	console.log("[ViewTransfer] Dispatch result:", {
		delivered,
		destination: resolved.destination,
		routePath: resolved.routePath,
		messageType: resolved.messageType,
		contentType: resolved.contentType
	});
	const currentPath = (globalThis?.location?.pathname || "").replace(/\/+$/, "") || "/";
	let silentRoute = false;
	try {
		const sp = new URLSearchParams(globalThis?.location?.search || "");
		silentRoute = sp.get("silent") === "1" || sp.get("silent") === "true";
	} catch {
		silentRoute = false;
	}
	const tryNavigateLiveShell = async () => {
		if (!delivered) return false;
		try {
			const { bootLoader } = await import("./BootLoader.js");
			const shell = bootLoader.getShell();
			if (!(shell && ![
				"window",
				"tabbed",
				"environment"
			].includes(shell.id)) || !shell.getElement?.()?.isConnected) return false;
			const activeView = shell.getContext?.().navigationState?.currentView;
			/**
			* WHY: Ingress replay (launch-queue / pending) defaults markdown/text to destination
			* `viewer`. After the user opens Work Center, routing here would call `navigate('viewer')`
			* and hide Work Center even though payloads were already delivered via unified messaging.
			* Share Target flows keep `source === "share-target"` and still bump to the viewer when appropriate.
			*/
			if (resolved.destination === "viewer" && activeView === "workcenter" && source !== "share-target") {
				console.log("[ViewTransfer] Skipping steal to viewer — staying on Work Center", {
					source,
					pending,
					delivered
				});
				return true;
			}
			await shell.navigate(resolved.destination, void 0, { force: true });
			console.log("[ViewTransfer] Routed through live shell:", resolved.routePath);
			return true;
		} catch (error) {
			console.warn("[ViewTransfer] Live shell routing failed, falling back to hard navigation:", error);
			return false;
		}
	};
	if (silentRoute) {
		if (currentPath !== resolved.routePath) console.log("[ViewTransfer] Silent mode: skipping navigation; delivery via channels only:", resolved.routePath);
		else await tryNavigateLiveShell();
		return delivered;
	}
	if (currentPath !== resolved.routePath) {
		if (!await tryNavigateLiveShell()) {
			const nextUrl = new URL(globalThis?.location?.href);
			nextUrl.pathname = resolved.routePath;
			nextUrl.search = "";
			nextUrl.hash = "";
			if (pending) nextUrl.searchParams.set("shared", "1");
			console.log("[ViewTransfer] Navigating to resolved route:", nextUrl.toString());
			globalThis.location.href = nextUrl.toString();
		}
		return delivered;
	}
	await tryNavigateLiveShell();
	console.log("[ViewTransfer] Already on resolved route:", resolved.routePath);
	return delivered;
};
/**
* Extract processable content from share data
* Handles various formats from SW, server, or direct input
*/
var extractShareContent = (shareData) => {
	const text = shareData.text?.trim();
	if (text) return {
		content: text,
		type: "text"
	};
	const url = (shareData.url || shareData.sharedUrl)?.trim();
	if (url) return {
		content: url,
		type: "url"
	};
	const title = shareData.title?.trim();
	if (title) return {
		content: title,
		type: "text"
	};
	if (Array.isArray(shareData.files) && shareData.files.length > 0) {
		const firstFile = shareData.files[0];
		if (firstFile instanceof File || firstFile instanceof Blob) return {
			content: null,
			type: "file"
		};
	}
	return {
		content: null,
		type: null
	};
};
/**
* Process share payloads on the page side when the service worker either did
* not process them or only delivered metadata.
*/
var processShareTargetData = async (shareData, skipIfEmpty = false) => {
	console.log("[ShareTarget] Processing shared data:", {
		hasText: !!shareData.text,
		hasUrl: !!shareData.url,
		fileCount: shareData.files?.length || shareData.fileCount || 0,
		imageCount: shareData.imageCount || 0,
		source: shareData.source || "unknown",
		aiProcessed: shareData.aiProcessed
	});
	if (shareData.aiProcessed && shareData.results?.length) {
		console.log("[ShareTarget] AI already processed in SW, showing result");
		showToast({
			message: "Content processed by service worker",
			kind: "success"
		});
		return true;
	}
	const { content, type } = extractShareContent(shareData);
	console.log("[ShareTarget] Extracted content:", {
		content: content?.substring(0, 50),
		type
	});
	if (!content && type !== "file") {
		if (skipIfEmpty) {
			console.log("[ShareTarget] No content to process (skipping)");
			return false;
		}
		if (shareData.fileCount && shareData.fileCount > 0) {
			console.log("[ShareTarget] Files processed in service worker");
			showToast({
				message: "Files received and being processed",
				kind: "info"
			});
			return true;
		}
		console.warn("[ShareTarget] No content to process");
		showToast({
			message: "No content received to process",
			kind: "warning"
		});
		return false;
	}
	try {
		console.log("[ShareTarget] Starting AI processing for type:", type);
		showToast({
			message: "Processing shared content...",
			kind: "info"
		});
		const fileToBase64 = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		};
		console.log("[ShareTarget] Using unified processing endpoint");
		let processingContent;
		let contentType;
		if (type === "file" && shareData.files?.[0]) {
			const file = shareData.files[0];
			console.log("[ShareTarget] Processing file:", {
				name: file.name,
				type: file.type,
				size: file.size
			});
			processingContent = await fileToBase64(file);
			contentType = "base64";
		} else if (content) {
			processingContent = content;
			contentType = "text";
			console.log("[ShareTarget] Processing text content, length:", content.length);
		} else throw new Error("No processable content found");
		console.log("[ShareTarget] Calling unified processing API");
		const response = await fetch("/api/processing", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content: processingContent,
				contentType,
				processingType: "general-processing",
				metadata: {
					source: "share-target",
					title: shareData.title || "Shared Content",
					timestamp: Date.now()
				}
			})
		});
		if (!response.ok) throw new Error(`Processing API failed: ${response.status}`);
		const result = await response.json();
		console.log("[ShareTarget] Unified processing completed:", { success: result.success });
		if (result.success && result.data) {
			console.log("[ShareTarget] Processing result via unified messaging");
			const clipboardChannel = new BroadcastChannel(CHANNELS.CLIPBOARD);
			clipboardChannel.postMessage({
				type: "copy",
				data: result.data
			});
			clipboardChannel.close();
			try {
				await unifiedMessaging$1.sendMessage({
					type: "share-target-result",
					source: "share-target",
					destination: "workcenter",
					data: {
						content: typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2),
						rawData: result.data,
						timestamp: Date.now(),
						source: "share-target",
						action: "Processing (/api/processing)",
						metadata: result.metadata
					},
					metadata: { priority: "high" }
				});
			} catch (e) {
				const workCenterChannel = new BroadcastChannel(BROADCAST_CHANNELS.WORK_CENTER);
				workCenterChannel.postMessage({
					type: "share-target-result",
					data: {
						content: result.data,
						rawData: result.data,
						timestamp: Date.now(),
						source: "share-target",
						action: "Processing (/api/processing)",
						metadata: result.metadata
					}
				});
				workCenterChannel.close();
			}
			return true;
		} else {
			const errorMsg = result?.error || "AI processing returned no data";
			console.warn("[ShareTarget] AI processing failed:", errorMsg);
			const shareChannel = new BroadcastChannel(CHANNELS.SHARE_TARGET);
			shareChannel.postMessage({
				type: "ai-result",
				data: {
					success: false,
					error: errorMsg
				}
			});
			shareChannel.close();
			showToast({
				message: `Processing failed: ${errorMsg}`,
				kind: "warning"
			});
			return false;
		}
	} catch (error) {
		console.error("[ShareTarget] Processing error:", error);
		console.log("[ShareTarget] Attempting server-side fallback");
		if (await tryServerSideProcessing(shareData)) {
			console.log("[ShareTarget] Server-side fallback succeeded");
			return true;
		}
		console.warn("[ShareTarget] All processing methods failed");
		const shareChannel = new BroadcastChannel(CHANNELS.SHARE_TARGET);
		shareChannel.postMessage({
			type: "ai-result",
			data: {
				success: false,
				error: error?.message || String(error)
			}
		});
		shareChannel.close();
		showToast({
			message: `Processing failed: ${error?.message || "Unknown error"}`,
			kind: "error"
		});
		return false;
	}
};
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
* Fallback to server-side AI processing when client-side fails
* Broadcasts results to PWA clipboard handlers instead of copying directly
*/
var tryServerSideProcessing = async (shareData) => {
	try {
		const { content, type } = extractShareContent(shareData);
		if (!content) return false;
		console.log("[ShareTarget] Attempting server-side AI fallback");
		const { getRuntimeSettings } = await import("./RuntimeSettings.js").then((n) => n.t);
		const settings = await getRuntimeSettings().catch(() => null);
		const apiKey = settings?.ai?.apiKey;
		if (!apiKey) {
			console.log("[ShareTarget] No API key for server fallback");
			return false;
		}
		const response = await fetch("/api/share/process", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: type === "text" ? content : void 0,
				url: type === "url" ? content : void 0,
				title: shareData.title,
				apiKey,
				baseUrl: settings?.ai?.baseUrl,
				model: settings?.ai?.customModel || settings?.ai?.model
			})
		});
		if (!response.ok) {
			console.warn("[ShareTarget] Server fallback failed:", response.status);
			return false;
		}
		const result = await response.json();
		if (result?.ok && result?.data) {
			console.log("[ShareTarget] Broadcasting server-side result to clipboard handlers");
			const shareChannel = new BroadcastChannel(CHANNELS.SHARE_TARGET);
			shareChannel.postMessage({
				type: "ai-result",
				data: {
					success: true,
					data: String(result.data)
				}
			});
			shareChannel.close();
			return true;
		}
		return false;
	} catch (error) {
		console.warn("[ShareTarget] Server fallback error:", error);
		return false;
	}
};
/**
* Consume share-target payloads from URL params, cache recovery, session
* storage, launch flows, and BroadcastChannel notifications.
*
* INVARIANT: this function favors routing content into the normal transfer/view
* pipeline first, and only falls back to local processing when delivery cannot
* be staged or routed.
*/
var handleShareTarget = () => {
	const params = new URLSearchParams(globalThis?.location?.search);
	const shared = params.get("shared");
	const hasExplicitSharedFlow = shared === "1" || shared === "true" || shared === "test";
	let routedFromSessionPending = false;
	if (shared === "1" || shared === "true") {
		console.log("[ShareTarget] Detected shared=1 URL param, processing server-side share");
		const shareFromParams = {
			title: params.get("title") || void 0,
			text: params.get("text") || void 0,
			url: params.get("url") || void 0,
			sharedUrl: params.get("sharedUrl") || void 0,
			timestamp: Date.now(),
			source: "url-params"
		};
		console.log("[ShareTarget] Share data from URL params:", summarizeForLog({
			title: shareFromParams.title,
			text: shareFromParams.text,
			url: shareFromParams.url,
			sharedUrl: shareFromParams.sharedUrl
		}));
		const cleanUrl = new URL(globalThis?.location?.href);
		[
			"shared",
			"action",
			"title",
			"text",
			"url",
			"sharedUrl"
		].forEach((p) => cleanUrl.searchParams.delete(p));
		globalThis?.history?.replaceState?.({}, "", cleanUrl.pathname + cleanUrl.hash);
		(async () => {
			const transferPayload = await mergeUrlParamsShareWithCache(shareFromParams);
			const { content, type } = extractShareContent(transferPayload);
			const pendingFiles = Number(transferPayload.fileCount ?? 0) > 0;
			console.log("[ShareTarget] After cache merge:", summarizeForLog({
				title: transferPayload.title,
				text: transferPayload.text,
				url: transferPayload.url,
				fileCount: transferPayload.fileCount,
				filesLen: transferPayload.files?.length
			}));
			console.log("[ShareTarget] Extracted (merged):", {
				content: content?.substring(0, 50),
				type
			});
			if (content || type === "file" || pendingFiles) {
				console.log("[ShareTarget] Routing merged share payload");
				try {
					if (!await routeToTransferView(transferPayload, "share-target", extractTransferHint(transferPayload), true)) await processShareTargetData(transferPayload, true);
				} catch (error) {
					console.warn("[ShareTarget] Route transfer failed, falling back to processing:", error);
					await processShareTargetData(transferPayload, true);
				}
			} else console.log("[ShareTarget] Nothing to route after merge");
		})().catch((e) => console.warn("[ShareTarget] shared=1 async flow failed:", e));
		return;
	} else if (shared === "test") {
		showToast({
			message: "Share target route working",
			kind: "info"
		});
		const cleanUrl = new URL(globalThis?.location?.href);
		cleanUrl.searchParams.delete("shared");
		globalThis?.history?.replaceState?.({}, "", cleanUrl.pathname + cleanUrl.hash);
	}
	try {
		const pendingData = sessionStorage.getItem("rs-pending-share");
		if (pendingData) {
			sessionStorage.removeItem("rs-pending-share");
			const shareData = JSON.parse(pendingData);
			console.log("[ShareTarget] Found pending share in sessionStorage:", summarizeForLog(shareData));
			routedFromSessionPending = true;
			routeToTransferView(shareData, "pending", extractTransferHint(shareData), true).catch((error) => {
				console.warn("[ShareTarget] Pending transfer routing failed:", error);
			});
		}
	} catch (e) {}
	if (!hasExplicitSharedFlow && !routedFromSessionPending) (async () => {
		try {
			let cachedPayload = null;
			let meta = {};
			let files = [];
			let expectedFileCount = 0;
			for (let attempt = 1; attempt <= 4; attempt++) {
				cachedPayload = await consumeCachedShareTargetPayload({ clear: false });
				meta = cachedPayload?.meta && typeof cachedPayload.meta === "object" ? cachedPayload.meta : {};
				files = Array.isArray(cachedPayload?.files) ? cachedPayload.files : [];
				expectedFileCount = Number(meta?.fileCount || 0);
				if (expectedFileCount <= 0 || files.length > 0) break;
				await new Promise((resolve) => globalThis.setTimeout(resolve, 200 * attempt));
			}
			const timestamp = Number(meta?.timestamp || Date.now());
			const ageMs = Date.now() - timestamp;
			if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > 300 * 1e3) return;
			const transferPayload = {
				...buildShareDataFromCachedPayload({
					meta,
					files,
					fileMeta: cachedPayload?.fileMeta || []
				}),
				fileCount: files.length || expectedFileCount,
				timestamp,
				source: "cached-bootstrap"
			};
			if (!transferPayload.text && !transferPayload.url && !transferPayload.title && (transferPayload.fileCount ?? 0) <= 0) return;
			console.log("[ShareTarget] Bootstrap recovery from cached payload:", summarizeForLog({
				source: transferPayload.source,
				fileCount: transferPayload.fileCount,
				imageCount: transferPayload.imageCount,
				hasText: !!transferPayload.text,
				hasUrl: !!transferPayload.url,
				ageMs
			}));
			const delivered = await routeToTransferView(transferPayload, "pending", extractTransferHint(transferPayload), true);
			const hasBinaryPayload = Array.isArray(transferPayload.files) && transferPayload.files.length > 0;
			if (delivered && !hasBinaryPayload) await consumeCachedShareTargetPayload({ clear: true }).catch(() => null);
		} catch (error) {
			console.warn("[ShareTarget] Cached bootstrap recovery failed:", error);
		}
	})();
	if (typeof BroadcastChannel !== "undefined") {
		new BroadcastChannel(CHANNELS.SHARE_TARGET).addEventListener("message", async (event) => {
			const msgType = event.data?.type;
			const msgData = event.data?.data;
			console.log("[ShareTarget] Broadcast received:", {
				type: msgType,
				hasData: !!msgData
			});
			if (msgType === "share-received" && msgData) {
				console.log("[ShareTarget] Share notification received:", {
					hasText: !!msgData.text,
					hasUrl: !!msgData.url,
					fileCount: msgData.fileCount || 0,
					aiEnabled: msgData.aiEnabled,
					source: msgData.source
				});
				let transferPayload = await awaitHydratedSharePayloadWithRetries(msgData);
				if (!(Array.isArray(msgData.files) && msgData.files.some((f) => f instanceof File)) && Array.isArray(transferPayload.files) && transferPayload.files.some((f) => f instanceof File)) showToast({
					message: `Received ${transferPayload.files.filter((f) => f instanceof File).length || msgData.fileCount || 0} shared file(s)`,
					kind: "info"
				});
				if (transferPayload.files?.length || transferPayload.text || transferPayload.url || transferPayload.title || (transferPayload.fileCount ?? 0) > 0) {
					console.log("[ShareTarget] Processing broadcasted share data");
					if (!await routeToTransferView(transferPayload, "share-target", extractTransferHint(transferPayload), true)) await processShareTargetData(transferPayload, true);
				} else if ((msgData.fileCount ?? 0) > 0) showToast({
					message: `Processing ${msgData.fileCount} file(s)...`,
					kind: "info"
				});
			} else if (msgType === "ai-result") console.log("[ShareTarget] AI result broadcast received (handled by PWA clipboard)");
		});
		console.log("[ShareTarget] Broadcast channel listener set up");
	} else console.warn("[ShareTarget] BroadcastChannel not available");
};
/**
* Register the browser Launch Queue consumer used for direct file-open flows.
*
* WHY: launched files can arrive before the destination view is mounted, so the
* handler stages them in cache first and then routes them into the normal
* transfer pipeline.
*/
var setupLaunchQueueConsumer = async () => {
	if (!("launchQueue" in globalThis)) {
		console.log("[LaunchQueue] launchQueue API not available");
		return;
	}
	try {
		globalThis?.launchQueue?.setConsumer?.((launchParams) => {
			console.log("[LaunchQueue] Launch params received:", summarizeForLog({
				fileHandleCount: launchParams?.files?.length || 0,
				hasTargetUrl: !!launchParams?.targetURL,
				targetURL: launchParams?.targetURL
			}));
			const $files = [...launchParams.files];
			if (!$files || $files.length === 0) {
				console.log("[LaunchQueue] No files in launch params - this may indicate:");
				console.log("  - File opener was used but no files were selected");
				console.log("  - Launch queue consumer called with empty payload");
				console.log("  - Permission issues preventing file access");
				console.log("  - Browser compatibility issues");
				return;
			}
			console.log(`[LaunchQueue] Processing ${$files.length} file handle(s)`);
			const files = [];
			const failedHandles = [];
			(async () => {
				for (const fileHandle of $files) try {
					console.log("[LaunchQueue] Processing file handle:", {
						name: fileHandle.name || "unknown",
						type: fileHandle.constructor.name,
						hasGetFile: typeof fileHandle.getFile === "function",
						isFile: fileHandle instanceof File
					});
					if (fileHandle.getFile) try {
						if ("queryPermission" in fileHandle) {
							let permission = await fileHandle.queryPermission({ mode: "read" });
							console.log("[LaunchQueue] File handle permission:", permission);
							if (permission === "prompt" && "requestPermission" in fileHandle) try {
								permission = await fileHandle.requestPermission({ mode: "read" });
								console.log("[LaunchQueue] File handle permission requested:", permission);
							} catch (permissionError) {
								console.warn("[LaunchQueue] requestPermission failed:", permissionError);
							}
							if (permission !== "granted") {
								console.warn("[LaunchQueue] No permission to access file:", fileHandle.name, permission);
								failedHandles.push(fileHandle);
								continue;
							}
						}
						const file = await fileHandle.getFile();
						console.log("[LaunchQueue] Got file from handle:", file.name, file.type, file.size);
						files.push(file);
					} catch (permError) {
						console.warn("[LaunchQueue] Permission or access error for file handle:", permError, fileHandle);
						failedHandles.push(fileHandle);
					}
					else if (fileHandle instanceof File) {
						console.log("[LaunchQueue] File handle is already a File object:", fileHandle.name, fileHandle.type);
						files.push(fileHandle);
					} else {
						console.warn("[LaunchQueue] Unknown file handle type:", fileHandle.constructor.name);
						failedHandles.push(fileHandle);
					}
				} catch (error) {
					console.warn("[LaunchQueue] Failed to get file from handle:", error, fileHandle);
					failedHandles.push(fileHandle);
				}
				console.log(`[LaunchQueue] Successfully processed ${files.length} files, ${failedHandles.length} failed`);
				if (files.length === 0) {
					if (failedHandles.length > 0) {
						console.error("[LaunchQueue] All file handles failed to process");
						showToast({
							message: `Failed to process ${failedHandles.length} launched file(s)`,
							kind: "error"
						});
					} else console.log("[LaunchQueue] No files to process after filtering");
					return;
				}
				if (files.length > 0) {
					const hint = files.length === 1 && isTextLikeFile(files[0]) ? {
						destination: "viewer",
						action: "open",
						filename: files[0]?.name
					} : void 0;
					const timestamp = Date.now();
					const imageCount = files?.filter?.((f) => f.type.startsWith("image/")).length;
					const staged = await storeShareTargetPayloadToCache({
						files,
						meta: {
							timestamp,
							source: "launch-queue",
							route: "launch-queue",
							hint,
							fileCount: files.length,
							imageCount
						}
					});
					if (!staged) console.warn("[LaunchQueue] Failed to pre-stage files to cache");
					console.log("[LaunchQueue] Staged launch queue payload:", {
						fileCount: files.length,
						imageCount,
						fileTypes: files?.map?.((f) => ({
							name: f.name,
							type: f.type,
							size: f.size
						})),
						source: "launch-queue",
						staged
					});
					showToast({
						message: `Received ${files.length} file(s)`,
						kind: "info"
					});
					if (staged) {
						if (!await routeToTransferView({
							title: files[0]?.name,
							files,
							fileCount: files.length,
							imageCount,
							timestamp,
							source: "launch-queue",
							hint
						}, "launch-queue", hint, true)) {
							const url = new URL(globalThis?.location?.href);
							url.pathname = "/share-target";
							url.searchParams.set("shared", "1");
							url.hash = "";
							globalThis.location.href = url.toString();
						}
					} else showToast({
						message: `Failed to stage ${files.length} launched file(s)`,
						kind: "error"
					});
				}
				if (launchParams.targetURL) console.log("[LaunchQueue] Target URL:", launchParams.targetURL);
			})();
		});
		console.log("[LaunchQueue] Consumer set up successfully");
	} catch (error) {
		console.error("[LaunchQueue] Failed to set up consumer:", error);
	}
};
/**
* Recover pending share payloads staged by server-side handlers when no worker
* was active to own the original share request.
*/
var checkPendingShareData = async () => {
	try {
		const pendingData = globalThis?.sessionStorage?.getItem?.("rs-pending-share");
		if (!pendingData) return null;
		globalThis?.sessionStorage?.removeItem?.("rs-pending-share");
		const shareData = JSON.parse(pendingData);
		console.log("[ShareTarget] Found pending share data:", summarizeForLog(shareData));
		if ("caches" in window) await (await globalThis?.caches?.open?.("share-target-data"))?.put?.("/share-target-data", new Response(JSON.stringify({
			...shareData,
			files: [],
			timestamp: shareData.timestamp || Date.now()
		}), { headers: { "Content-Type": "application/json" } }));
		return shareData;
	} catch (error) {
		console.warn("[ShareTarget] Failed to process pending share data:", error);
		return null;
	}
};
var _ingressPwaPromise = null;
/**
* Single entry for page boot: SW registration, share-target URL/cache pipeline, clipboard receivers, launch queue.
* Called from {@link BootLoader} so share-target is not dead code and runs after settings but before shell paint-heavy work.
*/
var initIngressPWA = async () => {
	if (_ingressPwaPromise) return _ingressPwaPromise;
	_ingressPwaPromise = (async () => {
		if (typeof globalThis === "undefined" || typeof window === "undefined") return;
		if (!shouldRunPwaIngress()) return;
		try {
			/**
			* Always `immediate: false` here — dev + `immediate: true` caused `controllerchange` → `location.reload()`
			* mid-boot before shell/styles mounted (blank white screen).
			*
			* Dev still calls `activateWaitingWorker` inside `initServiceWorker` when a `waiting` worker exists so
			* Vite/asset routes update without forcing an early hard reload on every visitor.
			*/
			await initServiceWorker({ immediate: false });
		} catch (error) {
			console.warn("[PWA] Service worker registration failed:", error);
		}
		try {
			initReceivers();
		} catch (error) {
			console.warn("[PWA] initReceivers failed:", error);
		}
		try {
			handleShareTarget();
		} catch (error) {
			console.warn("[PWA] handleShareTarget failed:", error);
		}
		setupLaunchQueueConsumer().catch((error) => console.warn("[PWA] setupLaunchQueueConsumer failed:", error));
	})();
	return _ingressPwaPromise;
};
//#endregion
export { setupLaunchQueueConsumer as a, initReceivers as i, ensureAppCss as n, sw_handling_exports as o, handleShareTarget as r, ensureServiceWorkerRegistered as s, checkPendingShareData as t };
