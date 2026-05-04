//#region ../../modules/projects/lur.e/src/interactive/modules/Clipboard.ts
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
//#endregion
export { writeText as n, initClipboardReceiver as t };
