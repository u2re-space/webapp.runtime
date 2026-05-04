import { c as ensureServiceWorkerRegistered, i as initReceivers, n as ensureAppCss, o as setupLaunchQueueConsumer, r as handleShareTarget, t as checkPendingShareData } from "./chunks/sw-handling.js";
import { g as loadAsAdopted } from "./fest/dom.js";
import { p as pickEnabledView } from "./chunks/views.js";
import { s as initializeLayers } from "./chunks/BootLoader.js";
import { a as loadSubAppWithShell, i as getShellFromQuery, n as VALID_VIEWS, r as getSavedShellPreference, t as ensureAppLayers } from "./com/app3.js";
import { t as views_default } from "./chunks/views2.js";
//#region src/shared/pwa/pwa-handling.ts
var IS_DEV = Boolean(false);
var AUTO_RELOAD_COOLDOWN_MS = 120 * 1e3;
var RELOAD_GUARD_KEY = "cw:pwa:last-auto-reload-at";
var shouldSkipAutoReloadNow = () => {
	if (IS_DEV) return true;
	try {
		const now = Date.now();
		const last = Number(globalThis?.sessionStorage?.getItem?.(RELOAD_GUARD_KEY) || "0");
		if (Number.isFinite(last) && now - last < AUTO_RELOAD_COOLDOWN_MS) return true;
		globalThis?.sessionStorage?.setItem?.(RELOAD_GUARD_KEY, String(now));
	} catch {}
	return false;
};
var isExtension$1 = () => {
	try {
		return typeof chrome !== "undefined" && Boolean(chrome?.runtime?.id) && globalThis?.location?.protocol === "chrome-extension:";
	} catch {
		return false;
	}
};
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
var isServiceWorkerAllowedContext = () => {
	const protocol = (globalThis?.location?.protocol || "").toLowerCase();
	if (protocol === "chrome-extension:" || protocol === "file:" || protocol === "about:") return false;
	if (protocol === "capacitor:" || protocol === "ionic:") return true;
	if (isCapacitorNative() && (protocol === "https:" || protocol === "http:")) return true;
	return protocol === "https:" || protocol === "http:";
};
/**
* Asset cache versioning and update detection
*/
var AssetUpdateManager = class AssetUpdateManager {
	static instance;
	assetVersions = /* @__PURE__ */ new Map();
	updateCheckInterval = null;
	isChecking = false;
	static getInstance() {
		if (!AssetUpdateManager.instance) AssetUpdateManager.instance = new AssetUpdateManager();
		return AssetUpdateManager.instance;
	}
	/**
	* Check if an asset has been updated by comparing versions
	*/
	async checkAssetUpdate(url, currentVersion) {
		try {
			const response = await fetch(url, {
				method: "HEAD",
				cache: "no-cache",
				headers: {
					"Cache-Control": "no-cache",
					"Pragma": "no-cache"
				}
			});
			if (!response.ok) return false;
			const etag = response.headers.get("etag");
			const lastModified = response.headers.get("last-modified");
			const contentLength = response.headers.get("content-length");
			const versionKey = `${etag || ""}-${lastModified || ""}-${contentLength || ""}`;
			const storedVersion = this.assetVersions.get(url);
			if (storedVersion && storedVersion !== versionKey) {
				console.log(`[AssetUpdate] Asset updated: ${url}`);
				this.assetVersions.set(url, versionKey);
				return true;
			}
			this.assetVersions.set(url, versionKey);
			return false;
		} catch (error) {
			console.warn(`[AssetUpdate] Failed to check asset: ${url}`, error);
			return false;
		}
	}
	/**
	* Force refresh a cached asset by adding cache-busting parameter
	*/
	forceRefreshAsset(url) {
		return `${url}${url.includes("?") ? "&" : "?"}_cache=${Date.now()}`;
	}
	/**
	* Check all critical assets for updates
	*/
	async checkAllAssets() {
		if (this.isChecking) return [];
		this.isChecking = true;
		const criticalAssets = IS_DEV ? [] : [
			"./choice.js",
			"./favicon.svg",
			"./favicon.png"
		];
		const updatedAssets = [];
		try {
			const checks = criticalAssets.map(async (asset) => {
				if (await this.checkAssetUpdate(asset)) updatedAssets.push(asset);
			});
			await Promise.all(checks);
		} finally {
			this.isChecking = false;
		}
		return updatedAssets;
	}
	/**
	* Start periodic asset checking
	*/
	startPeriodicChecks(intervalMs = 300 * 1e3) {
		if (this.updateCheckInterval) globalThis?.clearInterval?.(this.updateCheckInterval);
		this.updateCheckInterval = globalThis?.setInterval?.(async () => {
			const updatedAssets = await this.checkAllAssets();
			if (updatedAssets.length > 0) {
				console.log("[AssetUpdate] Updated assets detected:", updatedAssets);
				globalThis?.dispatchEvent?.(new CustomEvent("assets-updated", { detail: { updatedAssets } }));
			}
		}, intervalMs);
	}
	/**
	* Stop periodic checking
	*/
	stopPeriodicChecks() {
		if (this.updateCheckInterval) {
			clearInterval(this.updateCheckInterval);
			this.updateCheckInterval = null;
		}
	}
};
/**
* Show reload notification for critical updates
*/
function showReloadNotification() {
	const existing = document.querySelector(".app-reload-notification");
	if (existing) existing.remove();
	const notification = document.createElement("div");
	notification.className = "app-reload-notification";
	Object.assign(notification.style, {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		background: "rgba(0, 0, 0, 0.9)",
		color: "white",
		padding: "24px",
		borderRadius: "12px",
		zIndex: "10002",
		fontFamily: "system-ui, -apple-system, sans-serif",
		textAlign: "center",
		boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
		backdropFilter: "blur(10px)",
		border: "1px solid rgba(255,255,255,0.1)"
	});
	notification.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 8px;"><ui-icon icon="arrow-clockwise" icon-style="duotone"></ui-icon></div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">Update Available</div>
        <div style="opacity: 0.8; margin-bottom: 16px;">CrossWord has been updated and will reload shortly.</div>
        <div style="font-size: 0.9rem; opacity: 0.6;">Reloading in 3 seconds...</div>
    `;
	document.body.appendChild(notification);
	let countdown = 3;
	const countdownInterval = setInterval(() => {
		countdown--;
		const countdownEl = notification.querySelector("div:last-child");
		if (countdownEl) countdownEl.textContent = `Reloading in ${countdown} second${countdown !== 1 ? "s" : ""}...`;
		if (countdown <= 0) {
			clearInterval(countdownInterval);
			globalThis?.location?.reload?.();
		}
	}, 1e3);
	notification.addEventListener("click", () => {
		clearInterval(countdownInterval);
		globalThis?.location?.reload?.();
	});
}
/**
* Service worker update manager with enhanced features
*/
var ServiceWorkerUpdateManager = class {
	registration = null;
	updateToast = null;
	async waitForController(timeoutMs = 4e3) {
		if (navigator.serviceWorker.controller) return true;
		return await new Promise((resolve) => {
			let done = false;
			const finish = (value) => {
				if (done) return;
				done = true;
				try {
					navigator.serviceWorker.removeEventListener("controllerchange", onChange);
				} catch {}
				clearTimeout(timer);
				resolve(value);
			};
			const onChange = () => finish(Boolean(navigator.serviceWorker.controller));
			const timer = setTimeout(() => finish(Boolean(navigator.serviceWorker.controller)), timeoutMs);
			navigator.serviceWorker.addEventListener("controllerchange", onChange, { once: true });
		});
	}
	async register() {
		if (!("serviceWorker" in navigator) || isExtension$1() || !isServiceWorkerAllowedContext()) return null;
		try {
			this.registration = await ensureServiceWorkerRegistered();
			if (!this.registration) {
				console.warn("[SW] Service worker registration skipped: no valid script candidate");
				return null;
			}
			this.setupUpdateListeners();
			this.startPeriodicUpdates();
			navigator.serviceWorker.ready.catch(() => void 0);
			this.waitForController(1500).catch(() => false);
			console.log("[SW] Service worker registered successfully");
			return this.registration;
		} catch (error) {
			console.error("[SW] Registration failed:", error);
			return null;
		}
	}
	setupUpdateListeners() {
		if (!this.registration) return;
		this.registration.addEventListener("updatefound", () => {
			const newWorker = this.registration?.installing;
			if (!newWorker) return;
			console.log("[SW] New service worker found, installing...");
			newWorker.addEventListener("statechange", () => {
				if (newWorker.state === "installed") if (navigator.serviceWorker.controller) {
					console.log("[SW] New service worker installed, ready to activate");
					this.showUpdateNotification();
				} else console.log("[SW] Service worker installed for offline use");
				else if (newWorker.state === "activated") {
					console.log("[SW] New service worker activated");
					globalThis?.dispatchEvent?.(new CustomEvent("sw-activated", { detail: { registration: this.registration } }));
				}
			});
		});
		navigator.serviceWorker.addEventListener("controllerchange", () => {
			console.log("[SW] Controller changed - new service worker active");
			globalThis?.dispatchEvent?.(new CustomEvent("sw-controller-changed"));
		});
		navigator.serviceWorker.addEventListener("message", (event) => {
			const { type, data } = event.data || {};
			switch (type) {
				case "sw-update-ready":
					console.log("[SW] Service worker reports update ready");
					this.showUpdateNotification();
					break;
				case "asset-updated":
					console.log("[PWA] Service worker detected asset update:", data);
					if (data.url.includes("choice.js") || data.url.includes("sw.js")) showReloadNotification();
					break;
				case "sw-activated":
					console.log("[PWA] Service worker activated");
					break;
				case "cache-status":
					console.log("[PWA] Cache status:", data);
					break;
				default: console.log("[PWA] Unknown SW message:", type, data);
			}
		});
	}
	startPeriodicUpdates() {
		if (Boolean(false)) return;
		globalThis?.setInterval?.(() => {
			this.registration?.update().catch(console.warn);
		}, 1800 * 1e3);
	}
	showUpdateNotification() {
		this.hideUpdateNotification();
		this.updateToast = document.createElement("div");
		Object.assign(this.updateToast.style, {
			position: "fixed",
			top: "20px",
			right: "20px",
			background: "#007acc",
			color: "white",
			padding: "16px 20px",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
			zIndex: "10000",
			fontFamily: "system-ui, sans-serif",
			fontSize: "14px",
			cursor: "pointer",
			maxWidth: "300px",
			transition: "all 0.3s ease"
		});
		this.updateToast.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
            <div style="opacity: 0.9; margin-bottom: 12px;">A new version of CrossWord is ready</div>
            <div style="display: flex; gap: 8px;">
                <button id="update-now" style="
                    background: white;
                    color: #007acc;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                ">Update Now</button>
                <button id="update-later" style="
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                ">Later</button>
            </div>
        `;
		const updateNowBtn = this.updateToast.querySelector("#update-now");
		const updateLaterBtn = this.updateToast.querySelector("#update-later");
		updateNowBtn?.addEventListener("click", () => {
			this.applyUpdate();
		});
		updateLaterBtn?.addEventListener("click", () => {
			this.hideUpdateNotification();
		});
		setTimeout(() => {
			this.hideUpdateNotification();
		}, 3e4);
		document.body.appendChild(this.updateToast);
		globalThis?.dispatchEvent?.(new CustomEvent("sw-update-notification-shown"));
	}
	hideUpdateNotification() {
		if (this.updateToast) {
			this.updateToast.style.opacity = "0";
			setTimeout(() => {
				this.updateToast?.remove();
				this.updateToast = null;
			}, 300);
		}
	}
	async applyUpdate() {
		console.log("[SW] Applying service worker update...");
		this.hideUpdateNotification();
		if (this.registration?.waiting) this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
		globalThis?.location?.reload?.();
	}
	/**
	* Force check for service worker updates
	*/
	async checkForUpdates() {
		await this.registration?.update();
	}
};
/**
* Initialize PWA features and asset update system
*/
var initPWA = async () => {
	console.log("[PWA] Initializing PWA features...");
	try {
		if (globalThis?.matchMedia?.("(display-mode: standalone)").matches || (globalThis?.navigator)?.standalone === true) console.log("[PWA] Running in standalone mode");
		AssetUpdateManager.getInstance().startPeriodicChecks();
		const registration = await new ServiceWorkerUpdateManager().register();
		globalThis?.addEventListener?.("assets-updated", (event) => {
			const { updatedAssets } = event.detail;
			console.log("[PWA] Assets updated:", updatedAssets);
			const criticalAssets = ["choice.js"];
			if (updatedAssets.some((asset) => criticalAssets.some((critical) => asset.includes(critical)))) {
				if (shouldSkipAutoReloadNow()) {
					console.log("[PWA] Auto reload suppressed (dev or cooldown)");
					return;
				}
				console.log("[PWA] Critical assets updated, reloading...");
				showReloadNotification();
			}
		});
		let deferredPrompt = null;
		globalThis?.addEventListener?.("beforeinstallprompt", (e) => {
			console.log("[PWA] Install prompt available");
			e.preventDefault();
			deferredPrompt = e;
			globalThis?.dispatchEvent?.(new CustomEvent("pwa-install-available", { detail: { prompt: deferredPrompt } }));
		});
		globalThis?.addEventListener?.("appinstalled", () => {
			console.log("[PWA] App installed successfully");
			deferredPrompt = null;
		});
		return registration;
	} catch (error) {
		console.warn("[PWA] PWA initialization failed:", error);
	}
	return null;
};
/**
* Manually check for updates (can be called from app UI)
*/
var checkForUpdates = async () => {
	console.log("[PWA] Manual update check requested");
	try {
		if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				console.log("[PWA] Checking service worker for updates...");
				await registration.update();
				if (registration.active) registration.active.postMessage({ type: "CHECK_FOR_UPDATES" });
			}
		}
		const updatedAssets = await AssetUpdateManager.getInstance().checkAllAssets();
		if (updatedAssets.length > 0) {
			console.log("[PWA] Asset updates found:", updatedAssets);
			globalThis?.dispatchEvent?.(new CustomEvent("assets-updated", { detail: { updatedAssets } }));
		} else {
			console.log("[PWA] No updates found");
			globalThis?.dispatchEvent?.(new CustomEvent("app-up-to-date"));
		}
	} catch (error) {
		console.error("[PWA] Manual update check failed:", error);
		throw error;
	}
};
/**
* Force reload all cached assets
*/
var forceRefreshAssets = async () => {
	console.log("[PWA] Force refreshing all cached assets");
	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
		console.log("[PWA] All caches cleared");
		globalThis?.location?.reload?.();
	} catch (error) {
		console.error("[PWA] Failed to force refresh assets:", error);
		throw error;
	}
};
//#endregion
//#region src/index.ts
/**
* CrossWord Main Entry Point
*
* Canonical URL mode:
* - pathname always `/`
* - legacy `/${view}` routes are accepted as entry links and normalized to `/`
* - active view/process is stored in `history.state` and (for focused windows) in `location.hash`
*/
/**
* Get normalized pathname (remove base href)
*/
var getNormalizedPathname = () => {
	const pathname = location.pathname || "";
	const baseHref = document.querySelector("base")?.getAttribute("href") || "/";
	let normalizedPath = pathname;
	if (baseHref !== "/" && pathname.startsWith(baseHref.replace(/\/$/, ""))) normalizedPath = pathname.slice(baseHref.replace(/\/$/, "").length);
	return normalizedPath.replace(/^\/+|\/+$/g, "").toLowerCase();
};
var isExtension = () => {
	try {
		const location = globalThis.location;
		const chromeApi = globalThis.chrome;
		return location.protocol === "chrome-extension:" || Boolean(chromeApi?.runtime?.id);
	} catch {
		return false;
	}
};
/**
* Check if a path is a valid view route (type guard)
*/
var isValidViewPath = (path) => VALID_VIEWS.includes(path);
var setLoadingState = (mountElement, message = "Loading...") => {
	mountElement.innerHTML = `
        <div class="app-loading" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            inline-size: 100%;
            block-size: 100%;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 1.1rem;
            color: #666;
            background: #fff;
            position: absolute;
            inset: 0;
            z-index: 10000;
        ">
            <div class="loading-spinner" style="
                inline-size: 32px;
                block-size: 32px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #007acc;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            "></div>
            <div class="loading-text">${message}</div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
    `;
};
var clearLoadingState = (mountElement) => {
	const loading = mountElement.querySelector(".app-loading");
	if (loading) {
		loading.style.transition = "opacity 0.3s ease-out";
		loading.style.opacity = "0";
		setTimeout(() => loading.remove(), 300);
	}
};
var showErrorState = (mountElement, error, retryFn) => {
	mountElement.innerHTML = `
        <div class="app-error" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            inline-size: 100%;
            block-size: 100%;
            padding: 2rem;
            font-family: system-ui, sans-serif;
            text-align: center;
            background: #fff;
            color: #333;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h2 style="margin: 0 0 1rem 0; color: #d32f2f;">Application Error</h2>
            <p style="margin: 0 0 1.5rem 0; color: #666; max-inline-size: 500px;">${error?.message || error?.toString() || "Unknown error occurred"}</p>
            ${retryFn ? `<button data-action="retry" style="
                padding: 0.75rem 1.5rem;
                background: #007acc;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                margin-bottom: 1rem;
            ">Try Again</button>` : ""}
            <button data-action="reload" style="
                padding: 0.5rem 1rem;
                background: #666;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 0.9rem;
                cursor: pointer;
            ">Reload Page</button>
        </div>
    `;
	const retryBtn = mountElement.querySelector("[data-action=\"retry\"]");
	if (retryBtn && retryFn) retryBtn.addEventListener("click", retryFn);
	const reloadBtn = mountElement.querySelector("[data-action=\"reload\"]");
	if (reloadBtn) reloadBtn.addEventListener("click", () => location.reload());
};
var withTimeout = async (task, label, timeoutMs, fallback, options = {}) => {
	let timer = null;
	const warnOnTimeout = options.warnOnTimeout !== false;
	try {
		return await Promise.race([task, new Promise((resolve) => {
			timer = setTimeout(() => {
				(warnOnTimeout ? console.warn : console.info)(`[Index] ${label} timed out after ${timeoutMs}ms`);
				resolve(fallback);
			}, timeoutMs);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
async function index(mountElement) {
	await initializeLayers();
	await loadAsAdopted(views_default);
	console.log("[Index] Starting CrossWord frontend loader");
	console.log("[Index] Initializing uniform channels...");
	import("./chunks/hub-socket-boot.js").then((n) => n.n).then((m) => m.bootHubSocketFromStoredSettings()).catch(() => void 0);
	setLoadingState(mountElement, "Initializing CrossWord...");
	try {
		const pwaPromise = initPWA();
		if (!isExtension()) {
			setLoadingState(mountElement, "Loading styles...");
			await ensureAppCss();
		}
		initReceivers();
		handleShareTarget();
		const PRE_SHELL_BUDGET_MS = 1200;
		try {
			await Promise.race([Promise.all([withTimeout(setupLaunchQueueConsumer(), "setupLaunchQueueConsumer", PRE_SHELL_BUDGET_MS, void 0), withTimeout(checkPendingShareData(), "checkPendingShareData", PRE_SHELL_BUDGET_MS, null)]), new Promise((r) => globalThis.setTimeout(r, PRE_SHELL_BUDGET_MS))]);
		} catch (e) {
			console.warn("[Index] Pre-boot share/launch queue failed:", e);
		}
		const prePath = getNormalizedPathname();
		if (!prePath || prePath === "viewer" || prePath === "share-target" || prePath === "share_target") import("./views/viewer.js").then((m) => m.warmViewerMarkdownEngine?.()).catch(() => {});
		if (prePath === "airpad") import("./views/airpad3.js").then((n) => n.t).catch(() => {});
		withTimeout(pwaPromise, "initPWA", 5e3, null, { warnOnTimeout: false }).then(() => {
			console.log("[Index] PWA initialization complete");
		}).catch((error) => {
			console.warn("[Index] PWA initialization failed (non-blocking):", error);
		});
		const pathname = getNormalizedPathname();
		const urlParams = new URLSearchParams(globalThis?.location?.search);
		const sharedFlag = urlParams.get("shared");
		const markdownContent = urlParams.get("markdown-content");
		console.log("[Index] Route:", pathname || "(root)");
		const isLegacyViewRoute = Boolean(pathname && isValidViewPath(pathname));
		const explicitRequestedView = isLegacyViewRoute ? pickEnabledView(pathname, "home") : sharedFlag === "1" || sharedFlag === "true" || markdownContent ? pickEnabledView("viewer", "home") : null;
		const queryShell = getShellFromQuery();
		if (queryShell) try {
			localStorage.setItem("rs-boot-shell", queryShell);
		} catch {}
		const preferredShell = queryShell || (explicitRequestedView === "print" ? "base" : getSavedShellPreference() ?? "minimal");
		const requestedView = explicitRequestedView || (preferredShell === "base" || preferredShell === "minimal" ? pickEnabledView("viewer", "home") : pickEnabledView("home", "home"));
		const allowPathRoutedShell = preferredShell === "base" || preferredShell === "minimal";
		const useDesktopLayers = preferredShell === "window" || preferredShell === "environment" || preferredShell === "tabbed";
		const layers = ensureAppLayers(mountElement, {
			enableOrientLayer: useDesktopLayers,
			enableCanvasLayer: useDesktopLayers
		});
		clearLoadingState(mountElement);
		if (!allowPathRoutedShell && (isLegacyViewRoute || pathname === "share-target" || pathname === "share_target")) {
			const queryParams = Object.fromEntries(urlParams);
			const state = {
				...globalThis?.history?.state || {},
				viewId: requestedView,
				params: queryParams,
				redirectedFrom: pathname || null
			};
			const search = globalThis?.location?.search || "";
			const hash = globalThis?.location?.hash || "";
			globalThis?.history?.replaceState?.(state, "", `/${search}${hash}`);
		} else if (!allowPathRoutedShell && pathname && pathname !== "") {
			const state = {
				...globalThis?.history?.state || {},
				viewId: pickEnabledView("home", "home"),
				redirectedFrom: pathname
			};
			globalThis?.history?.replaceState?.(state, "", "/");
		}
		await (await loadSubAppWithShell(preferredShell, requestedView)).mount(layers.shellLayer);
		return;
	} catch (error) {
		console.error("[Index] Frontend loader failed:", error);
		showErrorState(mountElement, error, () => index(mountElement));
	}
}
//#endregion
export { checkForUpdates, index as default, index, forceRefreshAssets };
