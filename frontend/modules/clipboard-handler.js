import { __vitePreload } from './preload-helper.js';
import { toText } from './Clipboard.js';

const getTimingFunction = () => {
  if (typeof requestAnimationFrame !== "undefined") {
    return requestAnimationFrame;
  }
  if (typeof setTimeout !== "undefined") {
    return (cb) => setTimeout(cb, 0);
  }
  return (cb) => cb();
};
const detectContext = () => {
  try {
    if (typeof location !== "undefined" && location.href.includes("offscreen")) {
      return "offscreen";
    }
    if (typeof document !== "undefined" && document.body) {
      return "content";
    }
  } catch {
  }
  return "unknown";
};
const showFeedback = async (message) => {
  try {
    const { showToast } = await __vitePreload(async () => { const { showToast } = await import('./overlay.js').then(n => n.overlay);return { showToast }},true              ?[]:void 0,import.meta.url);
    showToast(message);
  } catch {
    console.log("[Clipboard]", message);
  }
};
const writeTextWithRAF = async (text, maxRetries = 3) => {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "Empty content" };
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await new Promise((resolve) => {
        const timerFn = getTimingFunction();
        timerFn(() => {
          if (detectContext() === "content" && typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) {
            try {
              window.focus();
            } catch {
            }
          }
          const tryClipboardAPI = async () => {
            try {
              if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(trimmed);
                return resolve({ ok: true, method: "clipboard-api" });
              }
            } catch (err) {
              console.warn(`[Clipboard] Direct write failed (attempt ${attempt + 1}):`, err);
            }
            try {
              if (typeof navigator !== "undefined" && navigator.permissions) {
                const result2 = await navigator.permissions.query({ name: "clipboard-write" });
                if (result2.state === "granted" || result2.state === "prompt") {
                  await navigator.clipboard.writeText(trimmed);
                  return resolve({ ok: true, method: "clipboard-api-permission" });
                }
              }
            } catch (err) {
              console.warn(`[Clipboard] Permission check failed (attempt ${attempt + 1}):`, err);
            }
            try {
              if (detectContext() === "content" && typeof document !== "undefined") {
                const textarea = document.createElement("textarea");
                textarea.value = trimmed;
                textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;z-index:-1;";
                document.body.appendChild(textarea);
                textarea.select();
                textarea.focus();
                const success = document.execCommand("copy");
                textarea.remove();
                if (success) {
                  return resolve({ ok: true, method: "legacy-execCommand" });
                }
              }
            } catch (err) {
              console.warn(`[Clipboard] Legacy execCommand failed (attempt ${attempt + 1}):`, err);
            }
            if (attempt < maxRetries - 1) {
              setTimeout(() => tryClipboardAPI(), 100);
              return;
            }
            resolve({ ok: false, error: "All clipboard methods failed" });
          };
          tryClipboardAPI();
        });
      });
      if (result.ok) {
        return result;
      }
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
      }
    } catch (error) {
      console.warn(`[Clipboard] Attempt ${attempt + 1} completely failed:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
      }
    }
  }
  return { ok: false, error: `Failed after ${maxRetries} attempts` };
};
const handleCopyRequest = async (data, options = {}) => {
  const text = toText(data).trim();
  const { maxRetries = 3 } = options;
  if (!text) {
    return { ok: false, error: "Empty content" };
  }
  console.log(`[Clipboard] Attempting to copy ${text.length} characters (${detectContext()})`);
  const result = await writeTextWithRAF(text, maxRetries);
  console.log(`[Clipboard] Copy result:`, result);
  if (options.showFeedback && detectContext() === "content") {
    if (result.ok) {
      await showFeedback("Copied to clipboard");
    } else {
      await showFeedback(options.errorMessage || result.error || "Failed to copy");
    }
  }
  return {
    ok: result.ok,
    data: text,
    method: result.method || detectContext(),
    error: result.error
  };
};
let _handlerRegistered = false;
const initClipboardHandler = (options = {}) => {
  if (_handlerRegistered) return;
  _handlerRegistered = true;
  const context = detectContext();
  const { targetFilter, showFeedback: feedback = context === "content" } = options;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`[Clipboard] Received message:`, message, `from:`, sender);
    if (targetFilter && message?.target !== targetFilter) {
      console.log(`[Clipboard] Message filtered out by target:`, message?.target, `expected:`, targetFilter);
      return false;
    }
    if (message?.type === "COPY_HACK") {
      console.log(`[Clipboard] Processing COPY_HACK message with data:`, message?.data?.substring?.(0, 50) + "...");
      handleCopyRequest(message?.data, {
        showFeedback: feedback,
        errorMessage: message?.error
      }).then((response) => {
        console.log(`[Clipboard] COPY_HACK response:`, response);
        sendResponse(response);
      }).catch((error) => {
        console.error(`[Clipboard] COPY_HACK error:`, error);
        sendResponse({ ok: false, error: String(error) });
      });
      return true;
    }
    return false;
  });
  console.log(`[Clipboard] Handler initialized (${context})`);
};

export { initClipboardHandler };
//# sourceMappingURL=clipboard-handler.js.map
