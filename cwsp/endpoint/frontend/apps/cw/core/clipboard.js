import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { P as lazyAddEventListener } from "../com/app3.js";
//#region src/core/modules/Clipboard.ts
/**
* Standalone Clipboard API
* Works independently in any context: PWA, Chrome Extension, service worker, vanilla JS
* Provides unified clipboard operations with fallbacks
*/
var Clipboard_exports = /* @__PURE__ */ __exportAll({
	COPY_HACK: () => COPY_HACK,
	copy: () => copy,
	copyWithResult: () => copyWithResult,
	default: () => Clipboard_default,
	initClipboardReceiver: () => initClipboardReceiver,
	initGlobalClipboard: () => initGlobalClipboard,
	isChromeExtension: () => isChromeExtension,
	isClipboardAvailable: () => isClipboardAvailable,
	isClipboardWriteAvailable: () => isClipboardWriteAvailable,
	listenForClipboardRequests: () => listenForClipboardRequests,
	readText: () => readText,
	requestCopy: () => requestCopy,
	requestCopyViaCRX: () => requestCopyViaCRX,
	toText: () => toText,
	writeHTML: () => writeHTML,
	writeImage: () => writeImage,
	writeText: () => writeText
});
var CLIPBOARD_CHANNEL = "rs-clipboard";
/** Beyond this, legacy execCommand + textarea.select() can freeze the tab for seconds. */
var CLIPBOARD_LEGACY_MAX_CHARS = 256e3;
/** Hard cap — clipboard APIs and string work degrade badly above this. */
var CLIPBOARD_TEXT_MAX_CHARS = 2e6;
/** Failsafe if the browser never settles clipboard read/write. */
var CLIPBOARD_OPERATION_TIMEOUT_MS = 12e3;
var scheduleClipboardFrame = (cb) => {
	if (typeof globalThis.requestAnimationFrame === "function") {
		globalThis.requestAnimationFrame(cb);
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => cb();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => cb(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => cb());
		return;
	}
	cb();
};
/**
* Convert data to string safely
*/
var toText = (data) => {
	if (data == null) return "";
	if (typeof data === "string") return data;
	try {
		return JSON.stringify(data, null, 2);
	} catch {
		return String(data);
	}
};
var raceClipboardWrite = (write, ms) => Promise.race([write.then(() => "ok").catch(() => "error"), new Promise((res) => {
	globalThis.setTimeout(() => res("timeout"), ms);
})]);
/**
* Write text to clipboard using modern API
*/
var writeText = async (text) => {
	const raw = toText(text);
	if (!raw.trim()) return {
		ok: false,
		error: "Empty content"
	};
	if (raw.length > CLIPBOARD_TEXT_MAX_CHARS) return {
		ok: false,
		error: "Content too large to copy safely"
	};
	const trimmed = raw.trim();
	return new Promise((resolve) => {
		scheduleClipboardFrame(() => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			const tryClipboardAPI = async () => {
				const tryWriteText = async () => {
					if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
					const outcome = await raceClipboardWrite(navigator.clipboard.writeText(trimmed), CLIPBOARD_OPERATION_TIMEOUT_MS);
					if (outcome === "ok") return true;
					if (outcome === "timeout") console.warn("[Clipboard] writeText timed out");
					return false;
				};
				try {
					if (await tryWriteText()) {
						resolve({
							ok: true,
							data: trimmed,
							method: "clipboard-api"
						});
						return;
					}
				} catch (err) {
					console.warn("[Clipboard] Direct write failed:", err);
				}
				if (trimmed.length > CLIPBOARD_LEGACY_MAX_CHARS) {
					resolve({
						ok: false,
						error: "Content too large for fallback copy"
					});
					return;
				}
				try {
					if (typeof document !== "undefined") {
						const textarea = document.createElement("textarea");
						textarea.value = trimmed;
						textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
						document.body.appendChild(textarea);
						textarea.select();
						textarea.remove();
					}
				} catch (err) {
					console.warn("[Clipboard] Legacy execCommand failed:", err);
				}
				resolve({
					ok: false,
					error: "All clipboard methods failed"
				});
			};
			tryClipboardAPI();
		});
	});
};
/**
* Write HTML content to clipboard (with text fallback)
*/
var writeHTML = async (html, plainText) => {
	const htmlContent = html.trim();
	const textContent = (plainText ?? htmlContent).trim();
	if (!htmlContent) return {
		ok: false,
		error: "Empty content"
	};
	return new Promise((resolve) => {
		scheduleClipboardFrame(() => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			const tryHTMLClipboard = async () => {
				try {
					if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
						const htmlBlob = new Blob([htmlContent], { type: "text/html" });
						const textBlob = new Blob([textContent], { type: "text/plain" });
						await navigator.clipboard.write([new ClipboardItem({
							"text/html": htmlBlob,
							"text/plain": textBlob
						})]);
						return resolve({
							ok: true,
							data: htmlContent,
							method: "clipboard-api"
						});
					}
				} catch (err) {
					console.warn("[Clipboard] HTML write failed:", err);
				}
				resolve(await writeText(textContent));
			};
			tryHTMLClipboard();
		});
	});
};
/**
* Write image to clipboard
*/
var writeImage = async (blob) => {
	return new Promise((resolve) => {
		scheduleClipboardFrame(async () => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			try {
				let imageBlob;
				if (typeof blob === "string") if (blob.startsWith("data:")) imageBlob = await (await fetch(blob)).blob();
				else imageBlob = await (await fetch(blob)).blob();
				else imageBlob = blob;
				if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
					const pngBlob = imageBlob.type === "image/png" ? imageBlob : await convertToPng(imageBlob);
					await navigator.clipboard.write([new ClipboardItem({ [pngBlob.type]: pngBlob })]);
					resolve({
						ok: true,
						method: "clipboard-api"
					});
					return;
				}
			} catch (err) {
				console.warn("[Clipboard] Image write failed:", err);
			}
			resolve({
				ok: false,
				error: "Image clipboard not supported"
			});
		});
	});
};
/**
* Convert image blob to PNG
*/
var convertToPng = async (blob) => {
	return new Promise((resolve, reject) => {
		if (typeof document === "undefined") {
			reject(/* @__PURE__ */ new Error("No document context"));
			return;
		}
		const img = new Image();
		const url = URL.createObjectURL(blob);
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("Canvas context failed"));
				return;
			}
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((pngBlob) => {
				URL.revokeObjectURL(url);
				if (pngBlob) resolve(pngBlob);
				else reject(/* @__PURE__ */ new Error("PNG conversion failed"));
			}, "image/png");
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Image load failed"));
		};
		img.src = url;
	});
};
/**
* Read text from clipboard
*/
var readText = async () => {
	return new Promise((resolve) => {
		scheduleClipboardFrame(() => {
			const tryReadClipboard = async () => {
				try {
					if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
						resolve({
							ok: true,
							data: await navigator.clipboard.readText(),
							method: "clipboard-api"
						});
						return;
					}
				} catch (err) {
					console.warn("[Clipboard] Read failed:", err);
				}
				resolve({
					ok: false,
					error: "Clipboard read not available"
				});
			};
			tryReadClipboard();
		});
	});
};
/**
* Unified copy function with automatic type detection
*/
var copy = async (data, options = {}) => {
	const { type, showFeedback = false, silentOnError = false } = options;
	return new Promise((resolve) => {
		scheduleClipboardFrame(async () => {
			let result;
			if (data instanceof Blob) if (data.type.startsWith("image/")) result = await writeImage(data);
			else result = await writeText(await data.text());
			else if (type === "html" || typeof data === "string" && data.trim().startsWith("<")) result = await writeHTML(String(data));
			else if (type === "image") result = await writeImage(data);
			else result = await writeText(toText(data));
			if (showFeedback && (result.ok || !silentOnError)) broadcastClipboardFeedback(result);
			resolve(result);
		});
	});
};
/**
* Broadcast clipboard feedback for toast display
*/
var broadcastClipboardFeedback = (result) => {
	try {
		const channel = new BroadcastChannel("rs-toast");
		channel.postMessage({
			type: "show-toast",
			options: {
				message: result.ok ? "Copied to clipboard" : result.error || "Copy failed",
				kind: result.ok ? "success" : "error",
				duration: 2e3
			}
		});
		channel.close();
	} catch (e) {
		console.warn("[Clipboard] Feedback broadcast failed:", e);
	}
};
/**
* Request clipboard operation via broadcast (for service worker → client)
*/
var requestCopy = (data, options) => {
	try {
		const channel = new BroadcastChannel(CLIPBOARD_CHANNEL);
		channel.postMessage({
			type: "copy",
			data,
			options
		});
		channel.close();
	} catch (e) {
		console.warn("[Clipboard] Request broadcast failed:", e);
	}
};
/** One logical listener for rs-clipboard — multiple initClipboardReceiver calls must not stack handlers (duplicate copy() freezes UI). */
var _clipboardBroadcastChannel = null;
var _clipboardBroadcastRefCount = 0;
var _clipboardBroadcastHandler = null;
/** Serialize SW/client broadcast copies so overlapping clipboard API work does not wedge the main thread. */
var _clipboardBroadcastQueue = Promise.resolve();
/**
* Listen for clipboard operation requests
*/
var listenForClipboardRequests = () => {
	if (typeof BroadcastChannel === "undefined") return () => {};
	if (_clipboardBroadcastRefCount === 0) {
		const channel = new BroadcastChannel(CLIPBOARD_CHANNEL);
		const handler = (event) => {
			if (event.data?.type !== "copy") return;
			const opts = event.data.options || {};
			const data = event.data.data;
			_clipboardBroadcastQueue = _clipboardBroadcastQueue.then(async () => {
				try {
					await copy(data, {
						...opts,
						showFeedback: opts.showFeedback !== false,
						silentOnError: opts.silentOnError === true
					});
				} catch (err) {
					console.warn("[Clipboard] Broadcast copy failed:", err);
				}
			});
		};
		channel.addEventListener("message", handler);
		_clipboardBroadcastChannel = channel;
		_clipboardBroadcastHandler = handler;
	}
	_clipboardBroadcastRefCount++;
	return () => {
		_clipboardBroadcastRefCount--;
		if (_clipboardBroadcastRefCount <= 0) {
			const ch = _clipboardBroadcastChannel;
			const h = _clipboardBroadcastHandler;
			if (ch && h) {
				ch.removeEventListener("message", h);
				ch.close();
			}
			_clipboardBroadcastChannel = null;
			_clipboardBroadcastHandler = null;
			_clipboardBroadcastRefCount = 0;
		}
	};
};
/**
* Initialize clipboard listener for receiving copy requests
*/
var initClipboardReceiver = () => {
	return listenForClipboardRequests();
};
/**
* Check if clipboard API is available
*/
var isClipboardAvailable = () => {
	return typeof navigator !== "undefined" && !!navigator.clipboard;
};
/**
* Check if clipboard write is available
*/
var isClipboardWriteAvailable = () => {
	return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
};
/**
* Check if running in Chrome extension context
*/
var isChromeExtension = () => {
	try {
		return typeof chrome !== "undefined" && !!chrome?.runtime?.id;
	} catch {
		return false;
	}
};
/**
* Request copy via Chrome extension message (for CRX service worker → content script)
* Falls back to offscreen document or BroadcastChannel if content script fails
*/
var requestCopyViaCRX = async (data, tabIdOrOptions) => {
	const { tabId, offscreenFallback } = typeof tabIdOrOptions === "number" ? { tabId: tabIdOrOptions } : tabIdOrOptions || {};
	const text = toText(data).trim();
	if (!text) return {
		ok: false,
		error: "Empty content"
	};
	if (isChromeExtension() && typeof chrome?.tabs?.sendMessage === "function") {
		try {
			if (typeof tabId === "number" && tabId >= 0) {
				const response = await chrome.tabs.sendMessage(tabId, {
					type: "COPY_HACK",
					data: text
				});
				if (response?.ok) return {
					ok: true,
					data: response?.data,
					method: response?.method ?? "broadcast"
				};
			} else {
				const tabs = await chrome.tabs.query({
					currentWindow: true,
					active: true
				});
				for (const tab of tabs || []) if (tab?.id != null && tab.id >= 0) try {
					const response = await chrome.tabs.sendMessage(tab.id, {
						type: "COPY_HACK",
						data: text
					});
					if (response?.ok) return {
						ok: true,
						data: response?.data,
						method: response?.method ?? "broadcast"
					};
				} catch {}
			}
		} catch (err) {
			console.warn("[Clipboard] CRX content script message failed:", err);
		}
		if (offscreenFallback) try {
			if (await offscreenFallback(text)) return {
				ok: true,
				data: text,
				method: "offscreen"
			};
		} catch (err) {
			console.warn("[Clipboard] Offscreen fallback failed:", err);
		}
	}
	requestCopy(data, { showFeedback: true });
	return {
		ok: false,
		error: "Broadcast sent, result pending",
		method: "broadcast"
	};
};
/**
* COPY_HACK - Legacy API for Chrome extension clipboard operations
* Now delegates to unified Clipboard module
*/
var COPY_HACK = async (data) => {
	return (await writeText(toText(data))).ok;
};
/**
* Copy with result - returns full ClipboardResult for more control
*/
var copyWithResult = async (data) => {
	return writeText(toText(data));
};
var Clipboard_default = {
	copy,
	writeText,
	writeHTML,
	writeImage,
	readText,
	toText,
	request: requestCopy,
	requestViaCRX: requestCopyViaCRX,
	listen: listenForClipboardRequests,
	init: initClipboardReceiver,
	isAvailable: isClipboardAvailable,
	isWriteAvailable: isClipboardWriteAvailable,
	isChromeExtension
};
var collectProviders = (ev, action) => {
	const providers = /* @__PURE__ */ new Set();
	let el = ev?.target || document.activeElement || document.body;
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable) return [];
	let current = el;
	while (current) {
		if (typeof current[action] === "function") providers.add(current);
		if (current.operativeInstance && typeof current.operativeInstance[action] === "function") providers.add(current.operativeInstance);
		if (current.shadowRoot && current.shadowRoot.host) current = current.shadowRoot.host;
		else current = current.parentElement || current.getRootNode()?.host;
	}
	if (ev.currentTarget instanceof Node || typeof document !== "undefined") {
		const root = ev.currentTarget instanceof Node ? ev.currentTarget instanceof Document ? ev.currentTarget.body : ev.currentTarget : document.body;
		if (root) {
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode(node) {
				if (typeof node[action] === "function" || node.operativeInstance && typeof node.operativeInstance[action] === "function") return NodeFilter.FILTER_ACCEPT;
				return NodeFilter.FILTER_SKIP;
			} });
			while (walker.nextNode()) {
				const node = walker.currentNode;
				if (typeof node[action] === "function") providers.add(node);
				if (node.operativeInstance && typeof node.operativeInstance[action] === "function") providers.add(node.operativeInstance);
			}
		}
	}
	return Array.from(providers);
};
var handleClipboardEvent = (ev, type) => {
	const providers = collectProviders(ev, type);
	for (const provider of providers) provider[type]?.(ev);
};
var initialized = false;
var initGlobalClipboard = () => {
	if (typeof window === "undefined" || initialized) return;
	initialized = true;
	lazyAddEventListener(window, "copy", (ev) => handleClipboardEvent(ev, "onCopy"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "cut", (ev) => handleClipboardEvent(ev, "onCut"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "paste", (ev) => handleClipboardEvent(ev, "onPaste"), {
		capture: false,
		passive: false
	});
};
//#endregion
export { writeText as i, initClipboardReceiver as n, readText as r, Clipboard_exports as t };
