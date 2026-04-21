import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as JSOX } from "../vendor/jsox.js";
import { n as DEFAULT_SETTINGS } from "./service10.js";
import { r as isCapacitorCwsNativeShell } from "./service13.js";
import { b as isPreferNativeWebsocketEnabled, h as getRemoteHost, i as applyAirpadRuntimeFromAppSettings, y as isMaintainHubSocketConnectionEnabled } from "../views/airpad.js";
//#region src/frontend/shared/config/Settings.ts
var SETTINGS_KEY = "rs-settings";
var DB_NAME = "req-store";
var STORE = "settings";
var createWebDavClient = null;
var mergeAppSettingsShape = (base, patch) => {
	if (!patch || typeof patch !== "object") return base;
	return {
		...base,
		...patch,
		core: {
			...base.core || {},
			...patch.core || {},
			network: {
				...base.core?.network || {},
				...patch.core?.network || {}
			},
			socket: {
				...base.core?.socket || {},
				...patch.core?.socket || {}
			},
			interop: {
				...base.core?.interop || {},
				...patch.core?.interop || {}
			},
			ops: {
				...base.core?.ops || {},
				...patch.core?.ops || {}
			},
			admin: {
				...base.core?.admin || {},
				...patch.core?.admin || {}
			}
		},
		ai: {
			...base.ai || {},
			...patch.ai || {},
			mcp: patch.ai?.mcp ?? base.ai?.mcp ?? [],
			customInstructions: patch.ai?.customInstructions ?? base.ai?.customInstructions ?? [],
			activeInstructionId: patch.ai?.activeInstructionId ?? base.ai?.activeInstructionId ?? ""
		},
		webdav: {
			...base.webdav || {},
			...patch.webdav || {}
		},
		timeline: {
			...base.timeline || {},
			...patch.timeline || {}
		},
		appearance: {
			...base.appearance || {},
			...patch.appearance || {},
			markdown: {
				...base.appearance?.markdown || {},
				...patch.appearance?.markdown || {},
				page: {
					...base.appearance?.markdown?.page || {},
					...patch.appearance?.markdown?.page || {}
				},
				modules: {
					...base.appearance?.markdown?.modules || {},
					...patch.appearance?.markdown?.modules || {}
				},
				plugins: {
					...base.appearance?.markdown?.plugins || {},
					...patch.appearance?.markdown?.plugins || {}
				}
			}
		},
		speech: {
			...base.speech || {},
			...patch.speech || {}
		},
		grid: {
			...base.grid || {},
			...patch.grid || {}
		},
		shell: {
			...base.shell || {},
			...patch.shell || {}
		}
	};
};
var getWebDavCreateClient = async () => {
	if (createWebDavClient != null) return createWebDavClient;
	return null;
};
var isContentScriptContext = () => {
	try {
		if (typeof chrome === "undefined" || !chrome?.runtime) return false;
		if (typeof window !== "undefined" && globalThis?.location?.protocol?.startsWith("http")) return true;
		return false;
	} catch {
		return false;
	}
};
var hasChromeStorage = () => typeof chrome !== "undefined" && chrome?.storage?.local;
async function idbOpen() {
	if (typeof indexedDB === "undefined") throw new Error("IndexedDB not available");
	if (isContentScriptContext()) throw new Error("IndexedDB not accessible in content script context");
	return new Promise((res, rej) => {
		try {
			const req = indexedDB.open(DB_NAME, 1);
			req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "key" });
			req.onsuccess = () => res(req.result);
			req.onerror = () => rej(req.error);
		} catch (e) {
			rej(e);
		}
	});
}
var idbGetSettings = async (key = SETTINGS_KEY) => {
	try {
		if (hasChromeStorage()) {
			console.log("[Settings] Using chrome.storage.local for get");
			return new Promise((res) => {
				try {
					chrome.storage.local.get([key], (result) => {
						if (chrome.runtime.lastError) {
							console.warn("[Settings] chrome.storage.local.get error:", chrome.runtime.lastError);
							res(null);
						} else {
							console.log("[Settings] chrome.storage.local.get success, has data:", !!result[key]);
							res(result[key]);
						}
					});
				} catch (e) {
					console.warn("[Settings] chrome.storage access failed:", e);
					res(null);
				}
			});
		}
		if (typeof indexedDB === "undefined") {
			console.warn("[Settings] IndexedDB not available");
			return null;
		}
		console.log("[Settings] Using IndexedDB for get");
		const db = await idbOpen();
		return new Promise((res, rej) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
			req.onsuccess = () => {
				console.log("[Settings] IndexedDB get success, has data:", !!req.result?.value);
				res(req.result?.value);
				db.close();
			};
			req.onerror = () => {
				console.warn("[Settings] IndexedDB get error:", req.error);
				rej(req.error);
				db.close();
			};
		});
	} catch (e) {
		console.warn("[Settings] Settings storage access failed:", e);
		return null;
	}
};
var loadSettings = async () => {
	try {
		const raw = await idbGetSettings();
		const stored = typeof raw === "string" ? JSOX.parse(raw) : raw;
		console.log("[Settings] loadSettings - raw type:", typeof raw, "stored type:", typeof stored);
		if (stored && typeof stored === "object") {
			let result = {
				core: {
					...DEFAULT_SETTINGS.core,
					...stored?.core,
					network: {
						...DEFAULT_SETTINGS.core?.network || {},
						...stored?.core?.network || {}
					},
					socket: {
						...DEFAULT_SETTINGS.core?.socket || {},
						...stored?.core?.socket || {}
					},
					interop: {
						...DEFAULT_SETTINGS.core?.interop || {},
						...stored?.core?.interop || {}
					},
					ops: {
						...DEFAULT_SETTINGS.core?.ops || {},
						...stored?.core?.ops || {}
					},
					admin: {
						...DEFAULT_SETTINGS.core?.admin || {},
						...stored?.core?.admin || {}
					}
				},
				ai: {
					...DEFAULT_SETTINGS.ai,
					...stored?.ai,
					mcp: stored?.ai?.mcp || [],
					customInstructions: stored?.ai?.customInstructions || [],
					activeInstructionId: stored?.ai?.activeInstructionId || ""
				},
				webdav: {
					...DEFAULT_SETTINGS.webdav,
					...stored?.webdav
				},
				timeline: {
					...DEFAULT_SETTINGS.timeline,
					...stored?.timeline
				},
				appearance: {
					...DEFAULT_SETTINGS.appearance,
					...stored?.appearance,
					markdown: {
						...DEFAULT_SETTINGS.appearance?.markdown || {},
						...stored?.appearance?.markdown || {},
						page: {
							...DEFAULT_SETTINGS.appearance?.markdown?.page || {},
							...stored?.appearance?.markdown?.page || {}
						},
						modules: {
							...DEFAULT_SETTINGS.appearance?.markdown?.modules || {},
							...stored?.appearance?.markdown?.modules || {}
						},
						plugins: {
							...DEFAULT_SETTINGS.appearance?.markdown?.plugins || {},
							...stored?.appearance?.markdown?.plugins || {}
						}
					}
				},
				speech: {
					...DEFAULT_SETTINGS.speech,
					...stored?.speech
				},
				grid: {
					...DEFAULT_SETTINGS.grid,
					...stored?.grid
				},
				shell: {
					...DEFAULT_SETTINGS.shell || {},
					...stored?.shell || {}
				}
			};
			try {
				const { getNativeUnifiedSettings, isCwsNativeIpcAvailable } = await import("./service13.js").then((n) => n.t);
				if (isCwsNativeIpcAvailable()) {
					const nativeSettings = await getNativeUnifiedSettings();
					if (nativeSettings && typeof nativeSettings === "object") result = mergeAppSettingsShape(result, nativeSettings);
				}
			} catch {}
			console.log("[Settings] loadSettings result:", {
				hasApiKey: !!result.ai?.apiKey,
				instructionCount: result.ai?.customInstructions?.length || 0,
				activeInstructionId: result.ai?.activeInstructionId || "(none)"
			});
			return result;
		}
		console.log("[Settings] loadSettings - no stored data, returning defaults");
	} catch (e) {
		console.warn("[Settings] loadSettings error:", e);
	}
	return JSOX.parse(JSOX.stringify(DEFAULT_SETTINGS));
};
var joinPath = (base, name, addTrailingSlash = false) => {
	const b = (base || "/").replace(/\/+$/g, "") || "/";
	const n = (name || "").replace(/^\/+/g, "");
	let out = b === "/" ? `/${n}` : `${b}/${n}`;
	if (addTrailingSlash) out = out.replace(/\/?$/g, "/");
	return out.replace(/\/{2,}/g, "/");
};
var isDirHandle = (h) => h?.kind === "directory";
var safeTime = (v) => {
	const t = new Date(v).getTime();
	return Number.isFinite(t) ? t : 0;
};
/** Lazy `fest/lure` — keeps content scripts / lightweight callers from pulling lure + UI CSS. */
var lureFsPromise = null;
var loadLureFs = () => {
	if (!lureFsPromise) lureFsPromise = import("./app3.js").then((n) => n.t).then((m) => ({
		getDirectoryHandle: m.getDirectoryHandle,
		readFile: m.readFile
	}));
	return lureFsPromise;
};
var downloadContentsToOPFS = async (webDavClient, path = "/", opts = {}, rootHandle = null) => {
	const { getDirectoryHandle, readFile } = await loadLureFs();
	const files = await webDavClient?.getDirectoryContents?.(path || "/")?.catch?.((e) => {
		console.warn(e);
		return [];
	});
	if (opts.pruneLocal && files?.length > 0) try {
		const dirHandle = await getDirectoryHandle(rootHandle, path)?.catch?.(() => null);
		if (dirHandle?.entries) {
			const localEntries = await Array.fromAsync(dirHandle.entries());
			const remoteNames = new Set(files?.map?.((f) => f?.basename).filter(Boolean));
			await Promise.all(localEntries.filter(([name]) => !remoteNames.has(name)).map(([name]) => dirHandle.removeEntry(name, { recursive: true })?.catch?.(console.warn.bind(console))));
		}
	} catch (e) {
		console.warn(e);
	}
	return Promise.all(files.map(async (file) => {
		const isDir = file?.type === "directory";
		const fullPath = isDir ? joinPath(file.filename, "", true) : file.filename;
		if (isDir) return downloadContentsToOPFS(webDavClient, fullPath, opts, rootHandle);
		if (file?.type === "file") {
			const localMtime = safeTime((await readFile(rootHandle, fullPath).catch(() => null))?.lastModified);
			if (safeTime(file?.lastmod) > localMtime) {
				const contents = await webDavClient.getFileContents(fullPath).catch((e) => {
					console.warn(e);
					return null;
				});
				if (!contents || contents.byteLength === 0) return;
				const mime = file?.mime || "application/octet-stream";
				const { writeFileSmart } = await import("./service8.js").then((n) => n.t);
				return writeFileSmart(rootHandle, fullPath, new File([contents], file.basename, { type: mime }));
			}
		}
	}));
};
var uploadOPFSToWebDav = async (webDavClient, dirHandle = null, path = "/", opts = {}) => {
	const { getDirectoryHandle } = await loadLureFs();
	const effectiveDirHandle = dirHandle ?? await getDirectoryHandle(null, path, { create: true })?.catch?.(console.warn.bind(console));
	const entries = await Array.fromAsync(effectiveDirHandle?.entries?.() ?? []);
	if (path != "/") {
		if (opts.pruneRemote && entries?.length >= 0) {
			const remoteItems = await webDavClient.getDirectoryContents(path || "/").catch((e) => {
				console.warn(e);
				return [];
			});
			const localSet = new Set(entries.map(([name]) => name.toLowerCase()));
			const filesFirst = [...remoteItems.filter((r) => {
				const base = (r?.basename || "").toLowerCase();
				return base && !localSet.has(base);
			}).filter((x) => x.type !== "directory")];
			for (const r of filesFirst) {
				const remotePath = r.filename || joinPath(path, r.basename, r.type === "directory");
				try {
					await webDavClient.deleteFile(remotePath);
				} catch (e) {
					console.warn("delete failed:", remotePath, e);
				}
			}
		}
	}
	await Promise.all(entries.map(async ([name, fileOrDir]) => {
		const isDir = isDirHandle(fileOrDir);
		const remotePath = joinPath(path, name, isDir);
		if (isDir) {
			const dirPathNoSlash = joinPath(path, name, false);
			if (!await webDavClient.exists(dirPathNoSlash).catch((_e) => {
				return false;
			})) await webDavClient.createDirectory(dirPathNoSlash, { recursive: true }).catch(console.warn);
			return uploadOPFSToWebDav(webDavClient, fileOrDir, remotePath, opts);
		}
		const fileContent = await fileOrDir.getFile();
		if (!fileContent || fileContent.size === 0) return;
		const fullFilePath = joinPath(path, name, false);
		const remoteStat = await webDavClient.stat(fullFilePath).catch(() => null);
		const remoteMtime = safeTime(remoteStat?.lastmod);
		const localMtime = safeTime(fileContent.lastModified);
		if (!remoteStat || localMtime > remoteMtime) await webDavClient.putFileContents(fullFilePath, await fileContent.arrayBuffer(), { overwrite: true }).catch((_e) => {
			return null;
		});
	}));
};
var getHostOnly = (address) => {
	const url = new URL(address);
	return url.protocol + url.hostname + ":" + url.port;
};
var WebDavSync = async (address, options = {}) => {
	console.log("[Settings] WebDavSync", address, options);
	if (!address) return null;
	const createClient = await getWebDavCreateClient();
	if (!createClient) return null;
	const client = createClient(getHostOnly(address), options);
	return {
		status: currentWebDav?.sync?.getDAVCompliance?.()?.catch?.(console.warn.bind(console)) ?? null,
		client,
		upload(withPrune = false) {
			if (this.status != null) return uploadOPFSToWebDav(client, null, "/", { pruneRemote: withPrune })?.catch?.((e) => {
				console.warn(e);
				return [];
			});
		},
		download(withPrune = false) {
			if (this.status != null) return downloadContentsToOPFS(client, "/", { pruneLocal: withPrune })?.catch?.((e) => {
				console.warn(e);
				return [];
			});
		}
	};
};
var currentWebDav = { sync: null };
if (!isContentScriptContext()) (async () => {
	try {
		const settings = await loadSettings();
		if (settings?.core?.mode === "endpoint" && settings?.core?.preferBackendSync) return;
		if (!settings?.webdav?.url) return;
		currentWebDav.sync = await WebDavSync(settings.webdav.url, {
			withCredentials: true,
			username: settings.webdav.username,
			password: settings.webdav.password,
			token: settings.webdav.token
		}) ?? currentWebDav.sync;
		await currentWebDav?.sync?.upload?.(true);
		await currentWebDav?.sync?.download?.(true);
	} catch (e) {}
})();
if (!isContentScriptContext()) {
	try {
		if (typeof window !== "undefined" && typeof addEventListener === "function") {
			addEventListener("pagehide", () => {
				currentWebDav?.sync?.upload?.()?.catch?.(() => {});
			});
			addEventListener("beforeunload", () => {
				currentWebDav?.sync?.upload?.()?.catch?.(() => {});
			});
		}
	} catch {}
	(async () => {
		try {
			while (true) {
				await currentWebDav?.sync?.upload?.()?.catch?.(() => {});
				await new Promise((resolve) => setTimeout(resolve, 3e3));
			}
		} catch {}
	})();
}
//#endregion
//#region src/frontend/shared/transport/hub-socket-boot.ts
var hub_socket_boot_exports = /* @__PURE__ */ __exportAll({
	applyHubSocketFromSettings: () => applyHubSocketFromSettings,
	bootHubSocketFromStoredSettings: () => bootHubSocketFromStoredSettings,
	installAirpadHubLifecycleRecovery: () => installAirpadHubLifecycleRecovery
});
/** After this long in the background, force a full reconnect (zombie TCP / suspended workers). */
var PWA_STALE_BACKGROUND_MS = 12e3;
var hubLifecycleRecoveryInstalled = false;
var lastDocumentHiddenAt = 0;
function shouldRunHubRecovery() {
	if (isCapacitorCwsNativeShell() && isPreferNativeWebsocketEnabled()) return false;
	if (!isMaintainHubSocketConnectionEnabled()) return false;
	if (!getRemoteHost().trim()) return false;
	return true;
}
/**
* PWA / mobile: restore hub ↔ endpoint after suspend, offline, or bfcache restore.
* Requires Settings → maintain hub socket + a remote host (same rules as {@link applyHubSocketFromSettings}).
*/
function installAirpadHubLifecycleRecovery() {
	if (hubLifecycleRecoveryInstalled || typeof window === "undefined" || typeof document === "undefined") return;
	hubLifecycleRecoveryInstalled = true;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "hidden") return;
		lastDocumentHiddenAt = Date.now();
	});
	const schedule = (fn) => {
		globalThis.setTimeout(fn, 280);
	};
	const recoverAfterVisibility = () => {
		if (!shouldRunHubRecovery()) return;
		(async () => {
			const { connectWS, getWS, initWebSocket, isWSConnected, reconnectTransportAfterLifecycleResume } = await import("../views/airpad2.js").then((n) => n.d);
			initWebSocket(null);
			const live = Boolean(getWS()?.connected);
			if (lastDocumentHiddenAt > 0 && Date.now() - lastDocumentHiddenAt >= PWA_STALE_BACKGROUND_MS && (live || isWSConnected())) {
				reconnectTransportAfterLifecycleResume("visibility");
				return;
			}
			if (!live && !isWSConnected()) connectWS();
		})();
	};
	const recoverAfterNetworkOrRestore = (reason) => {
		if (!shouldRunHubRecovery()) return;
		(async () => {
			const { initWebSocket, reconnectTransportAfterLifecycleResume } = await import("../views/airpad2.js").then((n) => n.d);
			initWebSocket(null);
			reconnectTransportAfterLifecycleResume(reason);
		})();
	};
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		schedule(recoverAfterVisibility);
	});
	window.addEventListener("online", () => schedule(() => recoverAfterNetworkOrRestore("online")));
	window.addEventListener("pageshow", (ev) => {
		if (!ev.persisted) return;
		schedule(() => recoverAfterNetworkOrRestore("bfcache"));
	});
}
/**
* Load stored settings, apply AirPad / shell runtime, then connect or disconnect the hub socket.
*/
async function bootHubSocketFromStoredSettings() {
	installAirpadHubLifecycleRecovery();
	await applyHubSocketFromSettings(await loadSettings());
}
/**
* Apply after any settings mutation (Save, storage sync). Idempotent with {@link applyAirpadRuntimeFromAppSettings}.
*/
async function applyHubSocketFromSettings(settings) {
	applyAirpadRuntimeFromAppSettings(settings);
	if (isCapacitorCwsNativeShell() && isPreferNativeWebsocketEnabled()) return;
	if (!isMaintainHubSocketConnectionEnabled()) return;
	if (!getRemoteHost().trim()) return;
	const { initWebSocket, connectWS } = await import("../views/airpad2.js").then((n) => n.d);
	initWebSocket(null);
	connectWS();
}
//#endregion
export { hub_socket_boot_exports as n, applyHubSocketFromSettings as t };
