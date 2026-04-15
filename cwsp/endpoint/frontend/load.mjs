import { placeCSSCompatWarning } from "./vital.mjs";

// ============================================================================
// CONFIGURATION
// ============================================================================

const APP_JS = "./apps/cw/index.js";
const SW_JS  = "./apps/cw/sw.js";

// ============================================================================
// SERVICE WORKER REGISTRATION
// ============================================================================

/**
 * Register PWA service worker with proper error handling
 * Returns registration or null if failed/unsupported
 */
const registerServiceWorker = async () => {
    // Skip in non-browser or extension contexts
    if (typeof navigator === "undefined") return null;
    if (!("serviceWorker" in navigator)) {
        console.warn("[SW] Service workers not supported");
        return null;
    }
    if (window.location.protocol === "chrome-extension:") {
        console.log("[SW] Skipping SW registration in extension context");
        return null;
    }

    try {
        const swUrl = new URL(SW_JS, import.meta.url).href;
        console.log("[SW] Registering service worker:", swUrl);

        const registration = await navigator.serviceWorker.register(swUrl, {
            scope: "/",
            type: "module",
            updateViaCache: "none"
        });

        // Listen for update events
        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                        // New version available
                        console.log("[SW] New service worker available, refresh to update");
                    } else {
                        // First install
                        console.log("[SW] Service worker installed for offline use");
                    }
                }
            });
        });

        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("[SW] Controller changed, page will use new service worker");
        });

        console.log("[SW] Service worker registered successfully");
        return registration;
    } catch (error) {
        console.error("[SW] Registration failed:", error);
        return null;
    }
};

// ============================================================================
// SHARE TARGET HANDLING
// ============================================================================

/**
 * Handle share target parameters in URL (fallback when SW isn't controlling)
 */
const handleShareTargetParams = () => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("shared");

    if (shared) {
        console.log("[ShareTarget] Detected share params in URL");

        // Extract share data from URL params (set by server-side handler)
        const shareData = {
            title: params.get("title") || "",
            text: params.get("text") || "",
            url: params.get("sharedUrl") || "",
            timestamp: Date.now()
        };

        // Store in sessionStorage for app to pick up
        if (shareData.title || shareData.text || shareData.url) {
            try {
                sessionStorage.setItem("rs-pending-share", JSON.stringify(shareData));
                console.log("[ShareTarget] Share data stored for app processing");
            } catch (e) {
                console.warn("[ShareTarget] Failed to store share data:", e);
            }
        }

        // Clean URL
        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = "";
        window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.hash);
    }
};

// ============================================================================
// APP INITIALIZATION
// ============================================================================

/**
 * Mount the application
 */
const mountApp = async () => {
    try {
        const module = await import(APP_JS);
        const mountElement = document.querySelector("#app");

        if (!mountElement) {
            console.error("[App] Mount element #app not found");
            return;
        }

        // Call default export (bootstrap function)
        await module?.default?.(mountElement);
        console.log("[App] Application mounted successfully");
    } catch (error) {
        console.error("[App] Failed to load application:", error);

        // Show error fallback
        const app = document.querySelector("#app");
        if (app) {
            app.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem;text-align:center;font-family:system-ui,sans-serif;color:#e8e8e8;background:#1a1a2e;">
                    <h1 style="font-size:2rem;margin-bottom:1rem;">Failed to Load</h1>
                    <p style="color:#9ca3af;margin-bottom:1.5rem;">The application could not be loaded.</p>
                    <button onclick="location.reload()" style="padding:0.75rem 1.5rem;background:#7c3aed;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">
                        Retry
                    </button>
                    <pre style="margin-top:1.5rem;padding:1rem;background:rgba(0,0,0,0.3);border-radius:8px;font-size:0.8rem;max-width:100%;overflow:auto;text-align:left;">${error?.message || error}</pre>
                </div>
            `;
        }
    }
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

if (placeCSSCompatWarning()) {
    // Handle share target params early (before app loads)
    handleShareTargetParams();

    // Register service worker FIRST (important for PWA features)
    // This runs in parallel with app loading for performance
    const swPromise = registerServiceWorker();

    // Mount the app
    mountApp();

    // Log SW registration result (non-blocking)
    swPromise.then((reg) => {
        if (reg) {
            console.log("[SW] Ready with scope:", reg.scope);
        }
    });
}
