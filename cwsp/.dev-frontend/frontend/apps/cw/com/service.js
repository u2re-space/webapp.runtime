import { An as CORE_IMAGE_INSTRUCTION, En as DEFAULT_TEMPLATES, Ft as TRANSLATE_INSTRUCTION, It as buildInstructionPrompt, Lt as generateInstructionId, Mn as API_ENDPOINTS, Mt as JSOX, Nt as LANGUAGE_INSTRUCTIONS, On as CORE_DATA_CONVERSION_INSTRUCTION, Pt as SVG_GRAPHICS_ADDON, Rt as getIntermediateRecognitionInstruction, an as H, d as extractJSONFromAIResponse, gt as DEFAULT_SETTINGS, kn as CORE_ENTITY_EXTRACTION_INSTRUCTION, kt as canParseURL, mt as saveSettings, pt as loadSettings$1, u as STRICT_JSON_INSTRUCTIONS, zt as getOutputFormatInstruction } from "./app.js";
//#region src/com/core/ShareTargetGateway.ts
var SHARE_CACHE_NAME = "share-target-data";
var SHARE_CACHE_KEY = "/share-target-data";
var SHARE_FILES_MANIFEST_KEY = "/share-target-files";
var SHARE_FILE_PREFIX = "/share-target-file/";
var hasCaches = () => typeof window !== "undefined" && "caches" in window;
var storeShareTargetPayloadToCache = async (payload) => {
	if (!hasCaches()) return false;
	const files = Array.isArray(payload.files) ? payload.files : [];
	const meta = payload.meta ?? {};
	try {
		const cache = await caches.open(SHARE_CACHE_NAME);
		const timestamp = Number(meta?.timestamp) || Date.now();
		await cache.put(SHARE_CACHE_KEY, new Response(JSON.stringify({
			title: meta?.title,
			text: meta?.text,
			url: meta?.url,
			timestamp,
			fileCount: files.length,
			imageCount: files.filter((f) => (f?.type || "").toLowerCase().startsWith("image/")).length
		}), { headers: { "Content-Type": "application/json" } }));
		const fileManifest = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const key = `${SHARE_FILE_PREFIX}${timestamp}-${i}`;
			const headers = new Headers();
			headers.set("Content-Type", file.type || "application/octet-stream");
			headers.set("X-File-Name", encodeURIComponent(file.name || `file-${i}`));
			headers.set("X-File-Size", String(file.size || 0));
			headers.set("X-File-LastModified", String(file.lastModified ?? 0));
			await cache.put(key, new Response(file, { headers }));
			fileManifest.push({
				key,
				name: file.name || `file-${i}`,
				type: file.type || "application/octet-stream",
				size: file.size || 0,
				lastModified: file.lastModified ?? void 0
			});
		}
		await cache.put(SHARE_FILES_MANIFEST_KEY, new Response(JSON.stringify({
			files: fileManifest,
			timestamp
		}), { headers: { "Content-Type": "application/json" } }));
		return true;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to store payload to cache:", error);
		return false;
	}
};
var consumeCachedShareTargetPayload = async (opts = {}) => {
	const clear = opts.clear !== false;
	if (!hasCaches()) return null;
	try {
		const cache = await caches.open(SHARE_CACHE_NAME);
		const metaResp = await cache.match(SHARE_CACHE_KEY);
		const manifestResp = await cache.match(SHARE_FILES_MANIFEST_KEY);
		if (!metaResp && !manifestResp) return null;
		const meta = metaResp ? await metaResp.json().catch(() => null) : null;
		const manifest = manifestResp ? await manifestResp.json().catch(() => null) : null;
		const fileMeta = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const fm of fileMeta) {
			const fileKey = typeof fm?.key === "string" ? fm.key.trim() : String(fm?.key ?? "").trim();
			if (!fileKey) continue;
			const response = await cache.match(fileKey);
			if (!response) continue;
			const blob = await response.blob();
			files.push(new File([blob], fm.name || "shared-file", {
				type: fm.type || blob.type || "application/octet-stream",
				lastModified: Number(fm.lastModified) || Date.now()
			}));
		}
		if (clear) {
			await cache.delete(SHARE_CACHE_KEY).catch(() => {});
			await cache.delete(SHARE_FILES_MANIFEST_KEY).catch(() => {});
			for (const fm of fileMeta) if (fm?.key) await cache.delete(fm.key).catch(() => {});
		}
		return {
			meta,
			files,
			fileMeta
		};
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to consume cached payload:", error);
		return null;
	}
};
var fetchSwCachedEntries = async () => {
	try {
		const response = await fetch(API_ENDPOINTS.SW_CONTENT_AVAILABLE);
		if (!response.ok) return [];
		const data = await response.json();
		const keys = Array.isArray(data?.cacheKeys) ? data.cacheKeys : [];
		const content = [];
		for (const cacheKey of keys) {
			const key = String(cacheKey?.key || "");
			if (!key) continue;
			try {
				const contentResponse = await fetch(`${API_ENDPOINTS.SW_CONTENT}/${key}`);
				if (!contentResponse.ok) continue;
				content.push({
					key,
					context: String(cacheKey?.context || ""),
					content: await contentResponse.json()
				});
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch SW cache item:", error);
			}
		}
		return content;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch SW cache entries:", error);
		return [];
	}
};
var fetchCachedShareFiles = async (cacheKey = "latest") => {
	try {
		const response = await fetch(`/share-target-files?cacheKey=${encodeURIComponent(cacheKey)}`);
		if (!response.ok) return [];
		const manifest = await response.json();
		const fileItems = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const item of fileItems) {
			const fileUrl = typeof item?.key === "string" ? item.key : "";
			if (!fileUrl) continue;
			try {
				const fileResponse = await fetch(fileUrl);
				if (!fileResponse.ok) continue;
				const fileBlob = await fileResponse.blob();
				files.push(new File([fileBlob], item.name || "shared-file", { type: item.type || fileBlob.type || "application/octet-stream" }));
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch file from cache:", error);
			}
		}
		return files;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch cached share files:", error);
		return [];
	}
};
//#endregion
//#region src/frontend/shared/config/Settings.ts
var SETTINGS_KEY = "rs-settings";
var DB_NAME = "req-store";
var STORE = "settings";
var createWebDavClient = null;
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
			const result = {
				core: {
					...DEFAULT_SETTINGS.core,
					...stored?.core,
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
	if (!lureFsPromise) lureFsPromise = import("./app.js").then((n) => n.Ot).then((m) => ({
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
				const { writeFileSmart } = await import("./app.js").then((n) => n.At);
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
//#region src/com/config/RuntimeSettings.ts
var provider;
/** Lazily resolved so we never read `loadSettings` at module init (avoids TDZ when Rollup splits com-app ↔ boot chunks). */
var defaultProvider = null;
async function getDefaultProvider() {
	if (defaultProvider) return defaultProvider;
	const { loadSettings } = await import("./app.js").then((n) => n.ft);
	defaultProvider = loadSettings;
	return defaultProvider;
}
var getRuntimeSettings = async () => {
	try {
		return await (provider ?? await getDefaultProvider())() || DEFAULT_SETTINGS;
	} catch {
		return DEFAULT_SETTINGS;
	}
};
//#endregion
//#region src/com/config/admin-doors.ts
var trimTrailingSlashes = (value) => value.replace(/\/+$/u, "") || "";
var normalizeAdminPath = (raw) => {
	const t = (raw ?? "/").trim() || "/";
	return t.startsWith("/") ? t : `/${t}`;
};
var hostFromEndpointUrl = (endpointUrl) => {
	const ep = (endpointUrl || "").trim();
	if (!ep) return null;
	try {
		return new URL(ep).hostname || null;
	} catch {
		return null;
	}
};
/**
* Resolves HTTPS (default :8443) and HTTP (default :8080) admin/control URLs for the CWS / cwsp endpoint.
* When `core.admin.*` is empty, uses `endpointUrl` hostname with standard ports, then localhost.
*/
function resolveAdminDoorUrls(core) {
	const path = normalizeAdminPath(core?.admin?.path);
	let httpsOrigin = (core?.admin?.httpsOrigin || "").trim();
	let httpOrigin = (core?.admin?.httpOrigin || "").trim();
	const host = hostFromEndpointUrl(core?.endpointUrl);
	if (host) {
		if (!httpsOrigin) httpsOrigin = `https://${host}:8443`;
		if (!httpOrigin) httpOrigin = `http://${host}:8080`;
	}
	if (!httpsOrigin) httpsOrigin = "https://localhost:8443";
	if (!httpOrigin) httpOrigin = "http://localhost:8080";
	const join = (origin) => {
		const base = trimTrailingSlashes(origin);
		if (path === "/") return `${base}/`;
		return `${base}${path}`;
	};
	return {
		https: join(httpsOrigin),
		http: join(httpOrigin)
	};
}
function openAdminDoorUrl(url, target = "_blank") {
	try {
		globalThis.open?.(url, target, "noopener,noreferrer");
	} catch {}
}
function openAdminDoorFromCore(core, protocol) {
	const urls = resolveAdminDoorUrls(core);
	openAdminDoorUrl(protocol === "https" ? urls.https : urls.http);
}
//#endregion
//#region src/com/service/instructions/CustomInstructions.ts
/** Defer read of `generateInstructionId` until call — avoids TDZ when workcenter ↔ com-app chunks cycle. */
var generateId = () => generateInstructionId();
var byOrderAndLabel = (a, b) => {
	const ao = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER;
	const bo = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER;
	if (ao !== bo) return ao - bo;
	return (a.label || "").localeCompare(b.label || "");
};
var normalizeInstructions = (items) => [...items || []].sort(byOrderAndLabel);
var pickActiveInstruction = (instructions, activeId) => {
	if (!activeId) return null;
	return instructions.find((i) => i.id === activeId) || null;
};
var getInstructionRegistry = async () => {
	const settings = await loadSettings$1();
	const instructions = normalizeInstructions(settings?.ai?.customInstructions);
	const activeInstruction = pickActiveInstruction(instructions, settings?.ai?.activeInstructionId);
	return {
		instructions,
		activeId: activeInstruction?.id || "",
		activeInstruction
	};
};
var getCustomInstructions = async () => {
	return (await getInstructionRegistry()).instructions;
};
var getActiveInstruction = async () => {
	try {
		const snapshot = await getInstructionRegistry();
		if (!snapshot.activeId) return null;
		if (!snapshot.activeInstruction) console.warn("[CustomInstructions] activeInstructionId not found:", snapshot.activeId);
		return snapshot.activeInstruction;
	} catch (e) {
		console.error("[CustomInstructions] Error in getActiveInstruction:", e);
		return null;
	}
};
var getActiveInstructionText = async () => {
	return (await getActiveInstruction())?.instruction || "";
};
var setActiveInstruction = async (id) => {
	const settings = await loadSettings$1();
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			activeInstructionId: id || ""
		}
	});
};
var addInstruction = async (label, instruction) => {
	const settings = await loadSettings$1();
	const instructions = settings?.ai?.customInstructions || [];
	const newInstruction = {
		id: generateId(),
		label: label.trim() || "Untitled",
		instruction: instruction.trim(),
		enabled: true,
		order: instructions.length
	};
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: [...instructions, newInstruction]
		}
	});
	return newInstruction;
};
/**
* Add multiple instructions at once (avoids race conditions from parallel saves)
*/
var addInstructions = async (items) => {
	if (!items.length) return [];
	const settings = await loadSettings$1();
	const instructions = settings?.ai?.customInstructions || [];
	const newInstructions = items.map((item, index) => ({
		id: generateId(),
		label: item.label.trim() || "Untitled",
		instruction: item.instruction.trim(),
		enabled: item.enabled ?? true,
		order: instructions.length + index
	}));
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: [...instructions, ...newInstructions]
		}
	});
	return newInstructions;
};
var updateInstruction = async (id, updates) => {
	const settings = await loadSettings$1();
	const instructions = settings?.ai?.customInstructions || [];
	const index = instructions.findIndex((i) => i.id === id);
	if (index === -1) return false;
	instructions[index] = {
		...instructions[index],
		...updates
	};
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: instructions
		}
	});
	return true;
};
var deleteInstruction = async (id) => {
	const settings = await loadSettings$1();
	const instructions = settings?.ai?.customInstructions || [];
	const filtered = instructions.filter((i) => i.id !== id);
	if (filtered.length === instructions.length) return false;
	const newActiveId = settings.ai?.activeInstructionId === id ? "" : settings.ai?.activeInstructionId || "";
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: filtered,
			activeInstructionId: newActiveId
		}
	});
	return true;
};
//#endregion
//#region src/com/service/model/GPT-Config.ts
var typesForKind = {
	"math": "input_text",
	"url": "input_image",
	"text": "input_text",
	"input_text": "input_text",
	"output_text": "input_text",
	"image_url": "input_image",
	"image": "input_image",
	"input_image": "input_image",
	"input_url": "input_image",
	"json": "input_text",
	"markdown": "input_text",
	"code": "input_text",
	"entity": "input_text",
	"structured": "input_text",
	"unknown": "input_text",
	"svg": "input_text",
	"xml": "input_text"
};
var getDataKindByMIMEType = (mime) => {
	if (!mime) return "input_text";
	const lower = mime.toLowerCase();
	if (lower.includes("image")) return "input_image";
	if (lower.includes("json")) return "json";
	if (lower.includes("javascript") || lower.includes("typescript")) return "code";
	if (lower.includes("markdown") || lower.includes("md")) return "markdown";
	if (lower.includes("url")) return "input_url";
	if (lower.includes("text/html")) return "markdown";
	if (lower.includes("text/plain")) return "input_text";
	return "input_text";
};
var detectDataKindFromContent = (content) => {
	if (!content || typeof content !== "string") return "input_text";
	const trimmed = content.trim();
	if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) try {
		JSON.parse(trimmed);
		return "json";
	} catch {}
	if (canParseURL(trimmed)) return "url";
	if (trimmed.includes("<svg") && trimmed.includes("</svg>")) return "xml";
	if (trimmed.startsWith("data:image/") && trimmed.includes(";base64,") && !trimmed.includes("\n") && trimmed.length < 1e5) try {
		const url = new URL(trimmed);
		if (url.protocol === "data:" && url.pathname.startsWith("image/")) return "input_image";
	} catch {}
	if (/\$\$[\s\S]+\$\$|\$[^$]+\$|\\begin\{equation\}/.test(trimmed)) return "math";
	if (/```[\s\S]+```|^(function|const|let|var|class|import|export)\s/m.test(trimmed)) return "code";
	if (/^#{1,6}\s|^\*\*|^-\s|\[.+\]\(.+\)|^>\s/m.test(trimmed)) return "markdown";
	return "input_text";
};
var actionWithDataType = (data) => {
	const context = data?.context;
	const kindType = typesForKind?.[data?.dataKind || "input_text"];
	const contextPrompt = buildContextPrompt(context);
	switch (kindType) {
		case "input_image": return `${contextPrompt}

Recognize data from image, also preferred to orient by fonts in image.

After recognition, do not include or remember image itself.

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

In recognized from image data (what you seen in image), do:
- If textual content, format as Markdown string (multiline).
- If phone number, format as as correct phone number (in normalized format).
  - Also, if phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Remove brackets, parentheses, spaces or other symbols from phone number.
  - Trim spaces from phone number.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math (expression, equation, formula), format as $KaTeX$
- If table (or looks alike table), format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "document_type"
}
`;
		case "input_text": return `${contextPrompt}

Analyze text and extract specific or special data from it, also normalize data by those rules...

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

Normalize phone numbers, emails, URLs, dates, times, codes, etc for best efforts and by those rules.
- If phone number, format as as correct phone number (in normalized format).
  - If phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Trim spaces from phone numbers, emails, URLs, dates, times, codes, etc.
  - Remove brackets, parentheses, spaces or other symbols from phone numbers.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math, format as $KaTeX$
- If table, format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).
- Detect entity type if applicable (task, event, person, place, service, item, etc.)

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "entity_type",
    "suggested_modifications": []
}
`;
	}
	return contextPrompt || "";
};
var buildContextPrompt = (context) => {
	if (!context) return "";
	const parts = [];
	if (context.operation) parts.push(`Operation: ${{
		create: "Create new data entries based on provided information.",
		modify: "Modify existing data with provided changes while preserving structure.",
		merge: "Intelligently merge new data with existing data, avoiding duplicates.",
		analyze: "Analyze and extract structured information from the data.",
		extract: "Extract specific data points matching the criteria."
	}[context.operation] || context.operation}`);
	if (context.entityType) parts.push(`Target entity type: ${context.entityType}`);
	if (context.existingData) parts.push(`Existing data context provided - consider for merge/update operations.`);
	if (context.filters?.length) {
		const filterDesc = context.filters.map((f) => `${f.field} ${f.operator} ${JSON.stringify(f.value)}`).join(", ");
		parts.push(`Apply filters: ${filterDesc}`);
	}
	if (context.searchTerms?.length) parts.push(`Search terms: ${context.searchTerms.join(", ")}`);
	if (context.priority) parts.push(`Priority level: ${context.priority}`);
	return parts.length ? `Context:\n${parts.join("\n")}\n\n---\n` : "";
};
var buildModificationPrompt = (instructions) => {
	if (!instructions?.length) return "";
	const parts = instructions.map((inst, i) => {
		const condStr = inst.conditions?.length ? ` when ${inst.conditions.map((c) => `${c.field} ${c.operator} ${JSON.stringify(c.value)}`).join(" AND ")}` : "";
		switch (inst.action) {
			case "update": return `${i + 1}. UPDATE field "${inst.target}" to ${JSON.stringify(inst.value)}${condStr}`;
			case "delete": return `${i + 1}. DELETE field "${inst.target}"${condStr}`;
			case "merge": return `${i + 1}. MERGE into "${inst.target}" with ${JSON.stringify(inst.value)}${condStr}`;
			case "append": return `${i + 1}. APPEND ${JSON.stringify(inst.value)} to "${inst.target}"${condStr}`;
			case "replace": return `${i + 1}. REPLACE "${inst.target}" with ${JSON.stringify(inst.value)}${condStr}`;
			case "transform": return `${i + 1}. TRANSFORM "${inst.target}" using: ${inst.transformFn}${condStr}`;
			default: return "";
		}
	}).filter(Boolean);
	return parts.length ? `\nModification instructions:\n${parts.join("\n")}\n` : "";
};
var DATA_MODIFICATION_PROMPT = `
You are a data modification assistant. Your task is to modify existing data based on the provided instructions.

Rules for modification:
1. Preserve the original data structure unless explicitly asked to change it.
2. Apply modifications in order, one by one.
3. Validate data types match the schema.
4. Return the complete modified entity, not just the changes.
5. If a modification cannot be applied, include it in the "errors" array with explanation.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "modified_entity": { /* complete modified entity */ },
    "changes_made": [ /* list of applied changes */ ],
    "errors": [ /* list of failed modifications with reasons */ ],
    "warnings": [ /* non-critical issues */ ]
}
`;
var DATA_SELECTION_PROMPT = `
You are a data selection and filtering assistant. Your task is to find and select data matching the criteria.

Selection rules:
1. Apply all filters in order (AND logic by default).
2. Rank results by relevance to search terms.
3. Include confidence scores for fuzzy matches.
4. Group similar results to avoid duplicates.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "selected_items": [ /* items matching criteria */ ],
    "total_matches": number,
    "filter_stats": { /* breakdown by filter */ },
    "suggestions": [ /* related items that might be relevant */ ]
}
`;
var ENTITY_MERGE_PROMPT = `
You are an entity merging assistant. Your task is to intelligently merge multiple entities or data sources.

Merge rules:
1. Prefer newer/more complete data when conflicts arise.
2. Combine arrays without duplicates.
3. Merge nested objects recursively.
4. Preserve IDs and relationships.
5. Track the source of each merged field.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "merged_entity": { /* result of merge */ },
    "conflicts_resolved": [ /* list of conflicts and how they were resolved */ ],
    "sources_used": [ /* which source contributed what */ ],
    "merge_confidence": number
}
`;
//#endregion
//#region ../../node_modules/@toon-format/toon/dist/index.mjs
var LIST_ITEM_MARKER = "-";
var LIST_ITEM_PREFIX = "- ";
var COMMA = ",";
var PIPE = "|";
var DOT = ".";
var NULL_LITERAL = "null";
var TRUE_LITERAL = "true";
var FALSE_LITERAL = "false";
var BACKSLASH = "\\";
var DOUBLE_QUOTE = "\"";
var DEFAULT_DELIMITER = {
	comma: COMMA,
	tab: "	",
	pipe: PIPE
}.comma;
/**
* Escapes special characters in a string for encoding.
*
* @remarks
* Handles backslashes, quotes, newlines, carriage returns, and tabs.
*/
function escapeString(value) {
	return value.replace(/\\/g, `${BACKSLASH}${BACKSLASH}`).replace(/"/g, `${BACKSLASH}${DOUBLE_QUOTE}`).replace(/\n/g, `${BACKSLASH}n`).replace(/\r/g, `${BACKSLASH}r`).replace(/\t/g, `${BACKSLASH}t`);
}
function isBooleanOrNullLiteral(token) {
	return token === TRUE_LITERAL || token === FALSE_LITERAL || token === NULL_LITERAL;
}
function normalizeValue(value) {
	if (value === null) return null;
	if (typeof value === "object" && value !== null && "toJSON" in value && typeof value.toJSON === "function") {
		const next = value.toJSON();
		if (next !== value) return normalizeValue(next);
	}
	if (typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") {
		if (Object.is(value, -0)) return 0;
		if (!Number.isFinite(value)) return null;
		return value;
	}
	if (typeof value === "bigint") {
		if (value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) return Number(value);
		return value.toString();
	}
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(normalizeValue);
	if (value instanceof Set) return Array.from(value).map(normalizeValue);
	if (value instanceof Map) return Object.fromEntries(Array.from(value, ([k, v]) => [String(k), normalizeValue(v)]));
	if (isPlainObject(value)) {
		const normalized = {};
		for (const key in value) if (Object.prototype.hasOwnProperty.call(value, key)) normalized[key] = normalizeValue(value[key]);
		return normalized;
	}
	return null;
}
function isJsonPrimitive(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function isJsonArray(value) {
	return Array.isArray(value);
}
function isJsonObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isEmptyObject(value) {
	return Object.keys(value).length === 0;
}
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
function isArrayOfPrimitives(value) {
	return value.length === 0 || value.every((item) => isJsonPrimitive(item));
}
function isArrayOfArrays(value) {
	return value.length === 0 || value.every((item) => isJsonArray(item));
}
function isArrayOfObjects(value) {
	return value.length === 0 || value.every((item) => isJsonObject(item));
}
/**
* Checks if a key can be used without quotes.
*
* @remarks
* Valid unquoted keys must start with a letter or underscore,
* followed by letters, digits, underscores, or dots.
*/
function isValidUnquotedKey(key) {
	return /^[A-Z_][\w.]*$/i.test(key);
}
/**
* Checks if a key segment is a valid identifier for safe folding/expansion.
*
* @remarks
* Identifier segments are more restrictive than unquoted keys:
* - Must start with a letter or underscore
* - Followed only by letters, digits, or underscores (no dots)
* - Used for safe key folding and path expansion
*/
function isIdentifierSegment(key) {
	return /^[A-Z_]\w*$/i.test(key);
}
/**
* Determines if a string value can be safely encoded without quotes.
*
* @remarks
* A string needs quoting if it:
* - Is empty
* - Has leading or trailing whitespace
* - Could be confused with a literal (boolean, null, number)
* - Contains structural characters (colons, brackets, braces)
* - Contains quotes or backslashes (need escaping)
* - Contains control characters (newlines, tabs, etc.)
* - Contains the active delimiter
* - Starts with a list marker (hyphen)
*/
function isSafeUnquoted(value, delimiter = DEFAULT_DELIMITER) {
	if (!value) return false;
	if (value !== value.trim()) return false;
	if (isBooleanOrNullLiteral(value) || isNumericLike(value)) return false;
	if (value.includes(":")) return false;
	if (value.includes("\"") || value.includes("\\")) return false;
	if (/[[\]{}]/.test(value)) return false;
	if (/[\n\r\t]/.test(value)) return false;
	if (value.includes(delimiter)) return false;
	if (value.startsWith(LIST_ITEM_MARKER)) return false;
	return true;
}
/**
* Checks if a string looks like a number.
*
* @remarks
* Match numbers like `42`, `-3.14`, `1e-6`, `05`, etc.
*/
function isNumericLike(value) {
	return /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value) || /^0\d+$/.test(value);
}
/**
* Attempts to fold a single-key object chain into a dotted path.
*
* @remarks
* Folding traverses nested objects with single keys, collapsing them into a dotted path.
* It stops when:
* - A non-single-key object is encountered
* - An array is encountered (arrays are not "single-key objects")
* - A primitive value is reached
* - The flatten depth limit is reached
* - Any segment fails safe mode validation
*
* Safe mode requirements:
* - `options.keyFolding` must be `'safe'`
* - Every segment must be a valid identifier (no dots, no special chars)
* - The folded key must not collide with existing sibling keys
* - No segment should require quoting
*
* @param key - The starting key to fold
* @param value - The value associated with the key
* @param siblings - Array of all sibling keys at this level (for collision detection)
* @param options - Resolved encoding options
* @returns A FoldResult if folding is possible, undefined otherwise
*/
function tryFoldKeyChain(key, value, siblings, options, rootLiteralKeys, pathPrefix, flattenDepth) {
	if (options.keyFolding !== "safe") return;
	if (!isJsonObject(value)) return;
	const { segments, tail, leafValue } = collectSingleKeyChain(key, value, flattenDepth ?? options.flattenDepth);
	if (segments.length < 2) return;
	if (!segments.every((seg) => isIdentifierSegment(seg))) return;
	const foldedKey = buildFoldedKey(segments);
	const absolutePath = pathPrefix ? `${pathPrefix}${DOT}${foldedKey}` : foldedKey;
	if (siblings.includes(foldedKey)) return;
	if (rootLiteralKeys && rootLiteralKeys.has(absolutePath)) return;
	return {
		foldedKey,
		remainder: tail,
		leafValue,
		segmentCount: segments.length
	};
}
/**
* Collects a chain of single-key objects into segments.
*
* @remarks
* Traverses nested objects, collecting keys until:
* - A non-single-key object is found
* - An array is encountered
* - A primitive is reached
* - An empty object is reached
* - The depth limit is reached
*
* @param startKey - The initial key to start the chain
* @param startValue - The value to traverse
* @param maxDepth - Maximum number of segments to collect
* @returns Object containing segments array, tail value, and leaf value
*/
function collectSingleKeyChain(startKey, startValue, maxDepth) {
	const segments = [startKey];
	let currentValue = startValue;
	while (segments.length < maxDepth) {
		if (!isJsonObject(currentValue)) break;
		const keys = Object.keys(currentValue);
		if (keys.length !== 1) break;
		const nextKey = keys[0];
		const nextValue = currentValue[nextKey];
		segments.push(nextKey);
		currentValue = nextValue;
	}
	if (!isJsonObject(currentValue) || isEmptyObject(currentValue)) return {
		segments,
		tail: void 0,
		leafValue: currentValue
	};
	return {
		segments,
		tail: currentValue,
		leafValue: currentValue
	};
}
function buildFoldedKey(segments) {
	return segments.join(DOT);
}
function encodePrimitive(value, delimiter) {
	if (value === null) return NULL_LITERAL;
	if (typeof value === "boolean") return String(value);
	if (typeof value === "number") return String(value);
	return encodeStringLiteral(value, delimiter);
}
function encodeStringLiteral(value, delimiter = DEFAULT_DELIMITER) {
	if (isSafeUnquoted(value, delimiter)) return value;
	return `${DOUBLE_QUOTE}${escapeString(value)}${DOUBLE_QUOTE}`;
}
function encodeKey(key) {
	if (isValidUnquotedKey(key)) return key;
	return `${DOUBLE_QUOTE}${escapeString(key)}${DOUBLE_QUOTE}`;
}
function encodeAndJoinPrimitives(values, delimiter = DEFAULT_DELIMITER) {
	return values.map((v) => encodePrimitive(v, delimiter)).join(delimiter);
}
function formatHeader(length, options) {
	const key = options?.key;
	const fields = options?.fields;
	const delimiter = options?.delimiter ?? COMMA;
	let header = "";
	if (key) header += encodeKey(key);
	header += `[${length}${delimiter !== DEFAULT_DELIMITER ? delimiter : ""}]`;
	if (fields) {
		const quotedFields = fields.map((f) => encodeKey(f));
		header += `{${quotedFields.join(delimiter)}}`;
	}
	header += ":";
	return header;
}
function* encodeJsonValue(value, options, depth) {
	if (isJsonPrimitive(value)) {
		const encodedPrimitive = encodePrimitive(value, options.delimiter);
		if (encodedPrimitive !== "") yield encodedPrimitive;
		return;
	}
	if (isJsonArray(value)) yield* encodeArrayLines(void 0, value, depth, options);
	else if (isJsonObject(value)) yield* encodeObjectLines(value, depth, options);
}
function* encodeObjectLines(value, depth, options, rootLiteralKeys, pathPrefix, remainingDepth) {
	const keys = Object.keys(value);
	if (depth === 0 && !rootLiteralKeys) rootLiteralKeys = new Set(keys.filter((k) => k.includes(".")));
	const effectiveFlattenDepth = remainingDepth ?? options.flattenDepth;
	for (const [key, val] of Object.entries(value)) yield* encodeKeyValuePairLines(key, val, depth, options, keys, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
}
function* encodeKeyValuePairLines(key, value, depth, options, siblings, rootLiteralKeys, pathPrefix, flattenDepth) {
	const currentPath = pathPrefix ? `${pathPrefix}${DOT}${key}` : key;
	const effectiveFlattenDepth = flattenDepth ?? options.flattenDepth;
	if (options.keyFolding === "safe" && siblings) {
		const foldResult = tryFoldKeyChain(key, value, siblings, options, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
		if (foldResult) {
			const { foldedKey, remainder, leafValue, segmentCount } = foldResult;
			const encodedFoldedKey = encodeKey(foldedKey);
			if (remainder === void 0) {
				if (isJsonPrimitive(leafValue)) {
					yield indentedLine(depth, `${encodedFoldedKey}: ${encodePrimitive(leafValue, options.delimiter)}`, options.indent);
					return;
				} else if (isJsonArray(leafValue)) {
					yield* encodeArrayLines(foldedKey, leafValue, depth, options);
					return;
				} else if (isJsonObject(leafValue) && isEmptyObject(leafValue)) {
					yield indentedLine(depth, `${encodedFoldedKey}:`, options.indent);
					return;
				}
			}
			if (isJsonObject(remainder)) {
				yield indentedLine(depth, `${encodedFoldedKey}:`, options.indent);
				const remainingDepth = effectiveFlattenDepth - segmentCount;
				const foldedPath = pathPrefix ? `${pathPrefix}${DOT}${foldedKey}` : foldedKey;
				yield* encodeObjectLines(remainder, depth + 1, options, rootLiteralKeys, foldedPath, remainingDepth);
				return;
			}
		}
	}
	const encodedKey = encodeKey(key);
	if (isJsonPrimitive(value)) yield indentedLine(depth, `${encodedKey}: ${encodePrimitive(value, options.delimiter)}`, options.indent);
	else if (isJsonArray(value)) yield* encodeArrayLines(key, value, depth, options);
	else if (isJsonObject(value)) {
		yield indentedLine(depth, `${encodedKey}:`, options.indent);
		if (!isEmptyObject(value)) yield* encodeObjectLines(value, depth + 1, options, rootLiteralKeys, currentPath, effectiveFlattenDepth);
	}
}
function* encodeArrayLines(key, value, depth, options) {
	if (value.length === 0) {
		yield indentedLine(depth, formatHeader(0, {
			key,
			delimiter: options.delimiter
		}), options.indent);
		return;
	}
	if (isArrayOfPrimitives(value)) {
		yield indentedLine(depth, encodeInlineArrayLine(value, options.delimiter, key), options.indent);
		return;
	}
	if (isArrayOfArrays(value)) {
		if (value.every((arr) => isArrayOfPrimitives(arr))) {
			yield* encodeArrayOfArraysAsListItemsLines(key, value, depth, options);
			return;
		}
	}
	if (isArrayOfObjects(value)) {
		const header = extractTabularHeader(value);
		if (header) yield* encodeArrayOfObjectsAsTabularLines(key, value, header, depth, options);
		else yield* encodeMixedArrayAsListItemsLines(key, value, depth, options);
		return;
	}
	yield* encodeMixedArrayAsListItemsLines(key, value, depth, options);
}
function* encodeArrayOfArraysAsListItemsLines(prefix, values, depth, options) {
	yield indentedLine(depth, formatHeader(values.length, {
		key: prefix,
		delimiter: options.delimiter
	}), options.indent);
	for (const arr of values) if (isArrayOfPrimitives(arr)) {
		const arrayLine = encodeInlineArrayLine(arr, options.delimiter);
		yield indentedListItem(depth + 1, arrayLine, options.indent);
	}
}
function encodeInlineArrayLine(values, delimiter, prefix) {
	const header = formatHeader(values.length, {
		key: prefix,
		delimiter
	});
	const joinedValue = encodeAndJoinPrimitives(values, delimiter);
	if (values.length === 0) return header;
	return `${header} ${joinedValue}`;
}
function* encodeArrayOfObjectsAsTabularLines(prefix, rows, header, depth, options) {
	yield indentedLine(depth, formatHeader(rows.length, {
		key: prefix,
		fields: header,
		delimiter: options.delimiter
	}), options.indent);
	yield* writeTabularRowsLines(rows, header, depth + 1, options);
}
function extractTabularHeader(rows) {
	if (rows.length === 0) return;
	const firstRow = rows[0];
	const firstKeys = Object.keys(firstRow);
	if (firstKeys.length === 0) return;
	if (isTabularArray(rows, firstKeys)) return firstKeys;
}
function isTabularArray(rows, header) {
	for (const row of rows) {
		if (Object.keys(row).length !== header.length) return false;
		for (const key of header) {
			if (!(key in row)) return false;
			if (!isJsonPrimitive(row[key])) return false;
		}
	}
	return true;
}
function* writeTabularRowsLines(rows, header, depth, options) {
	for (const row of rows) yield indentedLine(depth, encodeAndJoinPrimitives(header.map((key) => row[key]), options.delimiter), options.indent);
}
function* encodeMixedArrayAsListItemsLines(prefix, items, depth, options) {
	yield indentedLine(depth, formatHeader(items.length, {
		key: prefix,
		delimiter: options.delimiter
	}), options.indent);
	for (const item of items) yield* encodeListItemValueLines(item, depth + 1, options);
}
function* encodeObjectAsListItemLines(obj, depth, options) {
	if (isEmptyObject(obj)) {
		yield indentedLine(depth, LIST_ITEM_MARKER, options.indent);
		return;
	}
	const entries = Object.entries(obj);
	const [firstKey, firstValue] = entries[0];
	const restEntries = entries.slice(1);
	if (isJsonArray(firstValue) && isArrayOfObjects(firstValue)) {
		const header = extractTabularHeader(firstValue);
		if (header) {
			yield indentedListItem(depth, formatHeader(firstValue.length, {
				key: firstKey,
				fields: header,
				delimiter: options.delimiter
			}), options.indent);
			yield* writeTabularRowsLines(firstValue, header, depth + 2, options);
			if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options);
			return;
		}
	}
	const encodedKey = encodeKey(firstKey);
	if (isJsonPrimitive(firstValue)) yield indentedListItem(depth, `${encodedKey}: ${encodePrimitive(firstValue, options.delimiter)}`, options.indent);
	else if (isJsonArray(firstValue)) if (firstValue.length === 0) yield indentedListItem(depth, `${encodedKey}${formatHeader(0, { delimiter: options.delimiter })}`, options.indent);
	else if (isArrayOfPrimitives(firstValue)) yield indentedListItem(depth, `${encodedKey}${encodeInlineArrayLine(firstValue, options.delimiter)}`, options.indent);
	else {
		yield indentedListItem(depth, `${encodedKey}${formatHeader(firstValue.length, { delimiter: options.delimiter })}`, options.indent);
		for (const item of firstValue) yield* encodeListItemValueLines(item, depth + 2, options);
	}
	else if (isJsonObject(firstValue)) {
		yield indentedListItem(depth, `${encodedKey}:`, options.indent);
		if (!isEmptyObject(firstValue)) yield* encodeObjectLines(firstValue, depth + 2, options);
	}
	if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options);
}
function* encodeListItemValueLines(value, depth, options) {
	if (isJsonPrimitive(value)) yield indentedListItem(depth, encodePrimitive(value, options.delimiter), options.indent);
	else if (isJsonArray(value)) if (isArrayOfPrimitives(value)) yield indentedListItem(depth, encodeInlineArrayLine(value, options.delimiter), options.indent);
	else {
		yield indentedListItem(depth, formatHeader(value.length, { delimiter: options.delimiter }), options.indent);
		for (const item of value) yield* encodeListItemValueLines(item, depth + 1, options);
	}
	else if (isJsonObject(value)) yield* encodeObjectAsListItemLines(value, depth, options);
}
function indentedLine(depth, content, indentSize) {
	return " ".repeat(indentSize * depth) + content;
}
function indentedListItem(depth, content, indentSize) {
	return indentedLine(depth, LIST_ITEM_PREFIX + content, indentSize);
}
/**
* Applies a replacer function to a `JsonValue` and all its descendants.
*
* The replacer is called for:
* - The root value (with key='', path=[])
* - Every object property (with the property name as key)
* - Every array element (with the string index as key: '0', '1', etc.)
*
* @param root - The normalized `JsonValue` to transform
* @param replacer - The replacer function to apply
* @returns The transformed `JsonValue`
*/
function applyReplacer(root, replacer) {
	const replacedRoot = replacer("", root, []);
	if (replacedRoot === void 0) return transformChildren(root, replacer, []);
	return transformChildren(normalizeValue(replacedRoot), replacer, []);
}
/**
* Recursively transforms the children of a `JsonValue` using the replacer.
*
* @param value - The value whose children should be transformed
* @param replacer - The replacer function to apply
* @param path - Current path from root
* @returns The value with transformed children
*/
function transformChildren(value, replacer, path) {
	if (isJsonObject(value)) return transformObject(value, replacer, path);
	if (isJsonArray(value)) return transformArray(value, replacer, path);
	return value;
}
/**
* Transforms an object by applying the replacer to each property.
*
* @param obj - The object to transform
* @param replacer - The replacer function to apply
* @param path - Current path from root
* @returns A new object with transformed properties
*/
function transformObject(obj, replacer, path) {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const childPath = [...path, key];
		const replacedValue = replacer(key, value, childPath);
		if (replacedValue === void 0) continue;
		result[key] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
	}
	return result;
}
/**
* Transforms an array by applying the replacer to each element.
*
* @param arr - The array to transform
* @param replacer - The replacer function to apply
* @param path - Current path from root
* @returns A new array with transformed elements
*/
function transformArray(arr, replacer, path) {
	const result = [];
	for (let i = 0; i < arr.length; i++) {
		const value = arr[i];
		const childPath = [...path, i];
		const replacedValue = replacer(String(i), value, childPath);
		if (replacedValue === void 0) continue;
		const normalizedValue = normalizeValue(replacedValue);
		result.push(transformChildren(normalizedValue, replacer, childPath));
	}
	return result;
}
/**
* Encodes a JavaScript value into TOON format string.
*
* @param input - Any JavaScript value (objects, arrays, primitives)
* @param options - Optional encoding configuration
* @returns TOON formatted string
*
* @example
* ```ts
* encode({ name: 'Alice', age: 30 })
* // name: Alice
* // age: 30
*
* encode({ users: [{ id: 1 }, { id: 2 }] })
* // users[]:
* //   - id: 1
* //   - id: 2
*
* encode(data, { indent: 4, keyFolding: 'safe' })
* ```
*/
function encode(input, options) {
	return Array.from(encodeLines(input, options)).join("\n");
}
/**
* Encodes a JavaScript value into TOON format as a sequence of lines.
*
* This function yields TOON lines one at a time without building the full string,
* making it suitable for streaming large outputs to files, HTTP responses, or process stdout.
*
* @param input - Any JavaScript value (objects, arrays, primitives)
* @param options - Optional encoding configuration
* @returns Iterable of TOON lines (without trailing newlines)
*
* @example
* ```ts
* // Stream to stdout
* for (const line of encodeLines({ name: 'Alice', age: 30 })) {
*   console.log(line)
* }
*
* // Collect to array
* const lines = Array.from(encodeLines(data))
*
* // Equivalent to encode()
* const toonString = Array.from(encodeLines(data, options)).join('\n')
* ```
*/
function encodeLines(input, options) {
	const normalizedValue = normalizeValue(input);
	const resolvedOptions = resolveOptions(options);
	return encodeJsonValue(resolvedOptions.replacer ? applyReplacer(normalizedValue, resolvedOptions.replacer) : normalizedValue, resolvedOptions, 0);
}
function resolveOptions(options) {
	return {
		indent: options?.indent ?? 2,
		delimiter: options?.delimiter ?? DEFAULT_DELIMITER,
		keyFolding: options?.keyFolding ?? "off",
		flattenDepth: options?.flattenDepth ?? Number.POSITIVE_INFINITY,
		replacer: options?.replacer
	};
}
//#endregion
//#region src/com/service/model/GPT-Responses.ts
var hasFile = () => typeof globalThis.File !== "undefined";
var hasBlob = () => typeof globalThis.Blob !== "undefined";
var DEFAULT_REQUEST_TIMEOUTS = {
	low: 60 * 1e3,
	medium: 300 * 1e3,
	high: 900 * 1e3
};
var RETRY_DELAY = 2e3;
var getRuntimeAiSettings = () => {
	return globalThis.runtimeSettings?.ai || {};
};
var normalizeDurationMs = (value, fallback) => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
	if (value < 1e3) return value * 1e3;
	return value;
};
/**
* Get timeout configuration from settings or use defaults
*/
function getTimeoutConfig(effort) {
	const settings = getRuntimeAiSettings();
	const timeoutSettings = settings?.requestTimeout;
	const maxRetries = typeof settings?.maxRetries === "number" ? Math.max(0, Math.floor(settings.maxRetries)) : 2;
	return {
		timeout: normalizeDurationMs(timeoutSettings?.[effort], DEFAULT_REQUEST_TIMEOUTS[effort]),
		maxRetries
	};
}
var toBase64 = (bytes) => {
	if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(bytes).toString("base64");
	const CHUNK_SIZE = 1024 * 1024;
	if (bytes.length > CHUNK_SIZE) {
		let result = "";
		for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
			const chunk = bytes.slice(i, i + CHUNK_SIZE);
			let binary = "";
			for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
			result += typeof btoa === "function" ? btoa(binary) : "";
		}
		return result;
	}
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return typeof btoa === "function" ? btoa(binary) : "";
};
var getUsableData = async (data) => {
	const FileCtor = hasFile() ? globalThis.File : void 0;
	const BlobCtor = hasBlob() ? globalThis.Blob : void 0;
	if (BlobCtor && data?.dataSource instanceof BlobCtor || FileCtor && data?.dataSource instanceof FileCtor) {
		const fileSize = data?.dataSource?.size || 0;
		const MAX_FILE_SIZE = 10 * 1024 * 1024;
		if (fileSize > MAX_FILE_SIZE) {
			console.warn(`[GPT-Responses] File too large: ${fileSize} bytes > ${MAX_FILE_SIZE} bytes`);
			return {
				"type": "input_text",
				"text": `[File too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum allowed: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB]`
			};
		}
		if (typesForKind?.[data?.dataKind || "input_text"] === "input_image" || data?.dataSource?.type?.startsWith?.("image/")) try {
			const BASE64URL = `data:${data?.dataSource?.type};base64,`;
			const arrayBuffer = await data?.dataSource?.arrayBuffer();
			if (!arrayBuffer) throw new Error("Failed to read file as ArrayBuffer");
			return {
				"type": "input_image",
				"detail": "auto",
				"image_url": BASE64URL + toBase64(new Uint8Array(arrayBuffer))
			};
		} catch (error) {
			console.error("[GPT-Responses] Failed to process image file:", error);
			return {
				"type": "input_text",
				"text": `[Failed to process image file: ${error}]`
			};
		}
		try {
			const text = await data?.dataSource?.text?.();
			if (text) return {
				"type": "input_text",
				"text": text
			};
		} catch (error) {
			console.error("[GPT-Responses] Failed to read text file:", error);
			return {
				"type": "input_text",
				"text": `[Failed to read text file: ${error}]`
			};
		}
	} else if (typeof data?.dataSource == "string") {
		const effectiveKind = data?.dataKind || detectDataKindFromContent(data.dataSource);
		if (typesForKind?.[effectiveKind] == "input_image") {
			const content = data?.dataSource?.trim?.() || "";
			if (content.startsWith("data:image/") && content.includes(";base64,")) try {
				const url = new URL(content);
				if (url.protocol === "data:" && url.pathname.startsWith("image/")) return {
					"type": "input_image",
					"image_url": content,
					"detail": "auto"
				};
			} catch {}
			else if (canParseURL(content)) return {
				"type": "input_image",
				"image_url": content,
				"detail": "auto"
			};
		}
		return {
			"type": "input_text",
			"text": data?.dataSource
		};
	}
	let result = data?.dataSource;
	try {
		result = typeof data?.dataSource != "object" ? data?.dataSource : encode(data?.dataSource);
	} catch (e) {
		console.warn(e);
	}
	return {
		"type": typesForKind?.[data?.dataKind || "input_text"] || "text",
		"text": result
	};
};
var GPTResponses = class {
	apiKey;
	apiSecret;
	apiUrl = "https://api.proxyapi.ru/openai/v1";
	model = "gpt-5.4";
	responseId = null;
	pending = [];
	messages = [];
	tools = /* @__PURE__ */ new Map();
	context = null;
	responseMap = /* @__PURE__ */ new Map();
	constructor(apiKey, apiUrl, apiSecret, model) {
		this.apiKey = apiKey || "";
		this.apiUrl = apiUrl || this.apiUrl;
		this.apiSecret = apiSecret || "";
		this.model = model || this.model;
	}
	setContext(context) {
		this.context = context;
		return this;
	}
	async useMCP(serverLabel, origin, clientKey, secretKey) {
		this.tools.set(origin?.trim?.(), {
			"type": "mcp",
			"server_label": serverLabel,
			"server_url": origin,
			"headers": { "authorization": `Bearer ${clientKey}:${secretKey}` },
			"require_approval": "never"
		});
		return this.tools.get(origin?.trim?.());
	}
	async convertPlainToInput(dataSource, dataKind = null, additionalAction = null) {
		dataKind ??= getDataKindByMIMEType(dataSource?.type) || "input_text";
		const dataInput = {
			dataSource,
			dataKind,
			context: this.context
		};
		const usableData = await getUsableData(dataInput);
		return {
			type: "message",
			role: "user",
			content: [
				{
					type: "input_text",
					text: "What to do: " + actionWithDataType(dataInput)
				},
				additionalAction ? {
					type: "text",
					text: "Additional request data: " + additionalAction
				} : null,
				{
					type: "input_text",
					text: "\n === BEGIN:ATTACHED_DATA === \n"
				},
				{ ...usableData },
				{
					type: "input_text",
					text: "\n === END:ATTACHED_DATA === \n"
				}
			]?.filter?.((item) => item !== null)
		};
	}
	async attachToRequest(dataSource, dataKind = null, firstAction = null) {
		this.pending.push(await this.convertPlainToInput(dataSource, dataKind ??= getDataKindByMIMEType(dataSource?.type) || "input_text"));
		if (firstAction) this.pending.push(await this.askToDoAction(firstAction));
		return this.pending[this.pending.length - 1];
	}
	async attachExistingData(existingData, entityType) {
		this.context = {
			...this.context,
			existingData,
			entityType: entityType || this.context?.entityType
		};
		await this.giveForRequest(`existing_data: \`${encode(existingData)}\`\n`);
		return this;
	}
	async giveForRequest(whatIsIt) {
		if (typeof whatIsIt !== "string") try {
			const dataKind = getDataKindByMIMEType(whatIsIt?.type) || "input_text";
			const usable = await getUsableData({
				dataSource: whatIsIt,
				dataKind,
				context: this.context
			});
			this?.pending?.push?.({
				type: "message",
				role: "user",
				content: [
					{
						type: "input_text",
						text: "Additional data for request:"
					},
					{
						type: "input_text",
						text: "\n === BEGIN:ATTACHED_DATA === \n"
					},
					{ ...usable },
					{
						type: "input_text",
						text: "\n === END:ATTACHED_DATA === \n"
					}
				]
			});
			return this?.pending?.[this?.pending?.length - 1];
		} catch (e) {
			whatIsIt = String(whatIsIt);
		}
		this?.pending?.push?.({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: "Additional data for request:"
			}, {
				type: "input_text",
				text: String(whatIsIt)
			}]
		});
		return this?.pending?.[this?.pending?.length - 1];
	}
	async askToDoAction(action) {
		this?.pending?.push?.({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: action
			}]
		});
		return this?.pending?.[this?.pending?.length - 1];
	}
	beginFromResponseId(responseId = null) {
		this.responseId = this.responseId = responseId || this.responseId;
		return this;
	}
	async sendRequest(effort = "low", verbosity = "low", prevResponseId = null, options = {}) {
		effort ??= "low";
		verbosity ??= "low";
		const uniquePending = /* @__PURE__ */ new Map();
		for (const item of this.pending) {
			if (!item) continue;
			try {
				const key = typeof item === "object" ? JSOX.stringify(item) : String(item);
				if (!uniquePending.has(key)) uniquePending.set(key, item);
			} catch (e) {
				uniquePending.set(Math.random().toString(), item);
			}
		}
		const filteredInput = Array.from(uniquePending.values());
		const jsonInstructions = options?.responseFormat === "json" ? STRICT_JSON_INSTRUCTIONS : void 0;
		const runtimeAi = getRuntimeAiSettings();
		const configuredMaxTokens = typeof runtimeAi?.maxOutputTokens === "number" && Number.isFinite(runtimeAi.maxOutputTokens) ? Math.max(1, Math.floor(runtimeAi.maxOutputTokens)) : void 0;
		const requestBody = {
			model: this.model,
			tools: Array.from(this?.tools?.values?.() || [])?.filter?.((tool) => !!tool),
			input: filteredInput,
			reasoning: { "effort": effort },
			text: { verbosity },
			max_output_tokens: options?.maxTokens || configuredMaxTokens || 4e5,
			previous_response_id: this.responseId = prevResponseId || this?.responseId,
			instructions: jsonInstructions
		};
		if (runtimeAi?.contextTruncation === "auto" || runtimeAi?.contextTruncation === "disabled") requestBody.truncation = runtimeAi.contextTruncation;
		if (runtimeAi?.promptCacheRetention === "in-memory" || runtimeAi?.promptCacheRetention === "24h") requestBody.prompt_cache_retention = runtimeAi.promptCacheRetention;
		if (typeof runtimeAi?.maxToolCalls === "number" && Number.isFinite(runtimeAi.maxToolCalls)) requestBody.max_tool_calls = Math.max(1, Math.floor(runtimeAi.maxToolCalls));
		if (typeof runtimeAi?.parallelToolCalls === "boolean") requestBody.parallel_tool_calls = runtimeAi.parallelToolCalls;
		const { timeout: timeoutMs, maxRetries } = getTimeoutConfig(effort);
		console.log("[GPT] Making request to:", `${this?.apiUrl}/responses`);
		console.log("[GPT] API key present:", !!this?.apiKey);
		console.log("[GPT] Request timeout:", `${timeoutMs}ms (${timeoutMs / 1e3}s) (${effort} effort)`);
		console.log("[GPT] Max retries:", maxRetries);
		console.log("[GPT] Request body size:", JSON.stringify(requestBody).length, "characters");
		console.log("[GPT] Request input count:", filteredInput.length, "items");
		let lastError = null;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			if (attempt > 0) {
				console.log(`[GPT] Retry attempt ${attempt}/${maxRetries} after ${RETRY_DELAY}ms delay`);
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			}
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => {
					console.warn(`[GPT] Request timeout after ${timeoutMs}ms (attempt ${attempt + 1}) - aborting request`);
					controller.abort("timeout");
				}, timeoutMs);
				console.log(`[GPT] Sending request (attempt ${attempt + 1})...`);
				const response = await fetch(`${this?.apiUrl}/responses`, {
					method: "POST",
					priority: "auto",
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						...this?.apiKey ? { "Authorization": `Bearer ${this?.apiKey}` } : {}
					},
					body: JSON.stringify(requestBody)
				});
				console.log(`[GPT] Request sent successfully (attempt ${attempt + 1})`);
				clearTimeout(timeoutId);
				console.log("[GPT] Response status:", response.status, `(attempt ${attempt + 1})`);
				if (response.status !== 200) {
					const error = await response?.json?.()?.catch?.((e) => {
						console.error("[GPT] Failed to parse error response:", e);
						return null;
					});
					const errorMessage = error?.error?.message || error?.message || `HTTP ${response.status}`;
					lastError = /* @__PURE__ */ new Error(`API error (${response.status}): ${errorMessage}`);
					console.error("[GPT] API error:", errorMessage);
					if (response.status >= 400 && response.status < 500) throw lastError;
					continue;
				}
				return await this.processSuccessfulResponse(response);
			} catch (e) {
				lastError = e instanceof Error ? e : new Error(String(e));
				console.error(`[GPT] Request failed (attempt ${attempt + 1}):`, lastError.message);
				if (lastError.name === "AbortError" || lastError.message.includes("HTTP 4")) break;
			}
		}
		const errorMessage = lastError ? lastError.message : "Unknown error after all retries";
		console.error("[GPT] All retry attempts failed:", errorMessage);
		throw new Error(`Request failed after ${maxRetries + 1} attempts: ${errorMessage}`);
	}
	/**
	* Process a successful response from the API
	*/
	async processSuccessfulResponse(response) {
		const resp = await response?.json?.()?.catch?.((e) => {
			console.warn("[GPT] Failed to parse successful response:", e);
			return null;
		});
		if (!resp) return null;
		console.log("[GPT] Raw API response structure:", {
			type: typeof resp,
			isArray: Array.isArray(resp),
			keys: Object.keys(resp).slice(0, 10),
			keysLength: Object.keys(resp).length,
			sample: JSON.stringify(resp).substring(0, 300)
		});
		this.responseMap.set(this.responseId = resp?.id || resp?.response_id || this.responseId, resp);
		this?.messages?.push?.(...this?.pending || []);
		this?.pending?.splice?.(0, this?.pending?.length);
		this.messages.push(...resp?.output || []);
		const extractText = (r) => {
			try {
				if (!r) return null;
				if (typeof r === "string") {
					if (r.startsWith("\"") && r.endsWith("\"") && r.includes("\\n")) try {
						const parsed = JSON.parse(r);
						console.log("[GPT] Parsed JSON string response:", typeof parsed, parsed?.substring?.(0, 100) || "object");
						if (typeof parsed === "string") return parsed;
						else if (typeof parsed === "object") return extractText(parsed);
					} catch (e) {
						console.log("[GPT] Failed to parse JSON string, treating as plain text");
					}
					return r;
				}
				if (Array.isArray(r)) {
					console.log("[GPT] Response is array with", r.length, "items");
					console.log("[GPT] First few array items:", r.slice(0, 3).map((item) => ({
						type: typeof item,
						keys: typeof item === "object" ? Object.keys(item || {}) : "N/A",
						sample: typeof item === "string" ? item.substring(0, 50) : JSON.stringify(item).substring(0, 100)
					})));
					const texts = [];
					for (const item of r) if (typeof item === "string") texts.push(item);
					else if (item?.text) texts.push(item.text);
					else if (item?.content) texts.push(item.content);
					else if (item?.message?.content) texts.push(item.message.content);
					if (texts.length) return texts.join("\n\n");
				}
				if (typeof r === "object" && Object.keys(r).every((key) => !isNaN(Number(key)))) {
					console.log("[GPT] Response looks like array with", Object.keys(r).length, "numeric keys");
					const texts = [];
					for (const key of Object.keys(r).sort((a, b) => Number(a) - Number(b))) {
						const item = r[key];
						if (typeof item === "string") texts.push(item);
						else if (item?.text) texts.push(item.text);
						else if (item?.content) texts.push(item.content);
						else if (item?.message?.content) texts.push(item.message.content);
					}
					if (texts.length) return texts.join("\n\n");
				}
				if (r.output_text && Array.isArray(r.output_text) && r.output_text.length) return r.output_text.join("\n\n");
				const outputs = r.output || r.choices || [];
				const texts = [];
				for (const msg of outputs) {
					const content = msg?.content || msg?.message?.content || [];
					if (!content) continue;
					if (typeof content === "string") texts.push(content);
					else if (Array.isArray(content)) {
						for (const part of content) if (typeof part?.text === "string") texts.push(part.text);
						else if (part?.text?.value) texts.push(part.text.value);
					}
				}
				if (texts.length) return texts.join("\n\n");
			} catch (e) {
				console.warn("[GPT] Error extracting text:", e);
			}
			return null;
		};
		const text = extractText(resp);
		console.log("[GPT] Extracted text result:", text ? `"${text.substring(0, 100)}..."` : "null");
		if (text != null) return JSON.stringify({
			choices: [{ message: { content: text } }],
			usage: resp?.usage || {},
			id: this.responseId,
			object: "chat.completion"
		});
		try {
			const fallbackText = JSOX.parse(resp?.output ?? resp);
			if (fallbackText) return JSON.stringify({
				choices: [{ message: { content: typeof fallbackText === "string" ? fallbackText : JSON.stringify(fallbackText) } }],
				usage: resp?.usage || {},
				id: this.responseId,
				object: "chat.completion"
			});
		} catch {}
		return JSON.stringify({
			choices: [{ message: { content: "No text content available" } }],
			usage: {},
			id: this.responseId,
			object: "chat.completion"
		});
	}
	async modifyExistingData(existingData, modificationPrompt, instructions = []) {
		try {
			this.setContext({
				operation: "modify",
				existingData
			});
			await this.giveForRequest(DATA_MODIFICATION_PROMPT);
			await this.giveForRequest(`existing_entity: \`${encode(existingData)}\`\n`);
			if (instructions.length) await this.giveForRequest(buildModificationPrompt(instructions));
			await this.askToDoAction(modificationPrompt);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("high", "medium", null, {
				responseFormat: "json",
				temperature: .2
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.modified_entity || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in modifyExistingData:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async selectAndFilterData(dataSet, filters, searchTerms = []) {
		try {
			this.setContext({
				operation: "extract",
				filters,
				searchTerms
			});
			await this.giveForRequest(DATA_SELECTION_PROMPT);
			await this.giveForRequest(`data_set: \`${encode(dataSet)}\`\n`);
			const filterDesc = filters.map((f) => `Filter: ${f.field} ${f.operator} ${JSON.stringify(f.value)}`).join("\n");
			await this.askToDoAction(`
Select items from the provided data set matching these criteria:
${filterDesc}
${searchTerms.length ? `\nSearch terms: ${searchTerms.join(", ")}` : ""}

Return matching items with relevance scores.
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("medium", "low", null, {
				responseFormat: "json",
				temperature: .1
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.selected_items || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in selectAndFilterData:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async mergeEntities(primary, secondary, mergeStrategy = "prefer_primary") {
		try {
			this.setContext({
				operation: "merge",
				existingData: primary
			});
			await this.giveForRequest(ENTITY_MERGE_PROMPT);
			await this.giveForRequest(`primary_entity: \`${encode(primary)}\`\n`);
			await this.giveForRequest(`secondary_data: \`${encode(secondary)}\`\n`);
			await this.askToDoAction(`
Merge the secondary data into the primary entity using "${mergeStrategy}" strategy:
- prefer_primary: Keep primary values when conflicts occur
- prefer_secondary: Use secondary values when conflicts occur
- prefer_newer: Compare timestamps and use newer values
- merge_all: Combine all unique values (arrays concatenated, objects deeply merged)

Return the merged entity with conflict resolution details.
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("high", "medium", null, {
				responseFormat: "json",
				temperature: .2
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.merged_entity || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in mergeEntities:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async searchSimilar(referenceEntity, candidateSet, similarityThreshold = .7) {
		try {
			this.setContext({ operation: "analyze" });
			await this.giveForRequest(`reference_entity: \`${encode(referenceEntity)}\`\n`);
			await this.giveForRequest(`candidate_set: \`${encode(candidateSet)}\`\n`);
			await this.askToDoAction(`
Find items in the candidate set that are similar to the reference entity.
Consider semantic similarity, not just exact matches.
Compare:
- Names/titles (fuzzy match)
- Types/kinds
- Properties overlap
- Relationships

Return items with similarity score >= ${similarityThreshold}

Expected output structure:
{
    "similar_items": [
        { "item": {...}, "similarity": 0.85, "match_reasons": [...] }
    ],
    "potential_duplicates": [...],
    "related_but_different": [...]
}
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("medium", "medium", null, {
				responseFormat: "json",
				temperature: .3
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.similar_items || [],
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in searchSimilar:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async batchProcess(items, operation, batchSize = 10) {
		const results = [];
		const errors = [];
		for (let i = 0; i < items.length; i += batchSize) {
			const batch = items.slice(i, i + batchSize);
			await this.giveForRequest(`batch_items: \`${encode(batch)}\`\n`);
			await this.askToDoAction(`
Process this batch of ${batch.length} items:
${operation}

Return processed items in same order.
Expected output: { "processed": [...], "failed": [...] }
            `);
			const raw = await this.sendRequest("medium", "low", null, { responseFormat: "json" });
			if (raw) {
				const parseResult = extractJSONFromAIResponse(raw);
				if (parseResult.ok && parseResult.data) {
					results.push(...parseResult.data?.processed || []);
					if (parseResult.data?.failed?.length) errors.push(...parseResult.data.failed.map((f) => f?.error || "Unknown error"));
				} else console.warn("Batch parsing failed:", parseResult.error);
			}
		}
		return {
			ok: errors.length === 0,
			data: results,
			error: errors.length ? errors.join("; ") : void 0,
			responseId: this.responseId
		};
	}
	clearPending() {
		this.pending.splice(0, this.pending.length);
		return this;
	}
	getResponseId() {
		return this?.responseId;
	}
	getMessages() {
		return this?.messages;
	}
	getPending() {
		return this?.pending;
	}
	getContext() {
		return this?.context;
	}
	getResponse(responseId) {
		return this?.responseMap?.get?.(responseId);
	}
};
var createGPTInstance = (apiKey, apiUrl, model) => {
	return new GPTResponses(apiKey, apiUrl || "https://api.proxyapi.ru/openai/v1", "", model || "gpt-5.4");
};
var normalizeMcpConfigList = (mcp) => {
	if (!Array.isArray(mcp)) return [];
	const parsed = [];
	for (const item of mcp) {
		const raw = item;
		if (!raw || typeof raw !== "object") continue;
		const origin = String(raw?.origin || "").trim();
		const clientKey = String(raw?.clientKey || "").trim();
		const secretKey = String(raw?.secretKey || "").trim();
		if (!origin || !clientKey || !secretKey) continue;
		const serverLabel = String(raw?.serverLabel || raw?.label || origin).trim() || origin;
		parsed.push({
			id: String(raw?.id || origin),
			serverLabel,
			origin,
			clientKey,
			secretKey
		});
	}
	return parsed;
};
var configureMcpTools = async (gpt, mcpConfigs) => {
	const normalized = normalizeMcpConfigList(mcpConfigs);
	if (!normalized.length) return;
	for (const item of normalized) await gpt.useMCP(item.serverLabel, item.origin, item.clientKey, item.secretKey);
};
var resolveConfiguredModel = (model, customModel) => {
	const selected = String(model || "").trim();
	const custom = String(customModel || "").trim();
	if (selected === "custom") return custom || "gpt-5.4";
	return selected || custom || "gpt-5.4";
};
var getGPTInstance = async (config) => {
	const settings = await loadSettings$1();
	const apiKey = config?.apiKey || settings?.ai?.apiKey;
	if (!apiKey) return null;
	const gpt = createGPTInstance(apiKey, config?.baseUrl || settings?.ai?.baseUrl || "https://api.proxyapi.ru/openai/v1", resolveConfiguredModel(config?.model || settings?.ai?.model, config?.customModel || settings?.ai?.customModel));
	await configureMcpTools(gpt, config?.mcp ?? settings?.ai?.mcp);
	return gpt;
};
function unwrapUnwantedCodeBlocks(content) {
	if (!content) return content;
	const match = content.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);
	if (match) {
		const unwrapped = match[1].trim();
		const lines = unwrapped.split("\n");
		if (lines.length === 1 || unwrapped.includes("<math") || unwrapped.includes("<span class=\"katex") || unwrapped.includes("<content") || unwrapped.startsWith("<") && unwrapped.endsWith(">") || /^\s*<[^>]+>/.test(unwrapped)) return unwrapped;
		if (lines.length > 3 || lines.some((line) => line.match(/^\s{4,}/) || line.includes("function") || line.includes("const ") || line.includes("let "))) return content;
		return unwrapped;
	}
	return content;
}
function isImageData(data) {
	return data instanceof File && data.type.startsWith("image/") || data instanceof Blob && data.type?.startsWith("image/") || typeof data === "string" && (data.startsWith("data:image/") || data.startsWith("http") || data.startsWith("https://"));
}
function getResponseFormat(format) {
	return [
		"json",
		"xml",
		"yaml"
	].includes(format) ? "json" : "text";
}
//#endregion
//#region src/com/service/processing/entities.ts
var extractEntities = async (data, config) => {
	try {
		const gpt = await getGPTInstance(config);
		if (!gpt) return {
			ok: false,
			error: "No GPT instance"
		};
		const dataKind = typeof data === "string" ? detectDataKindFromContent(data) : (data instanceof File || data instanceof Blob) && data.type.startsWith("image/") ? "input_image" : "input_text";
		if (Array.isArray(data) && (data?.[0]?.type === "message" || data?.[0]?.["role"])) await gpt?.getPending?.()?.push?.(...data);
		else await gpt?.attachToRequest?.(data, dataKind);
		await gpt.askToDoAction(CORE_ENTITY_EXTRACTION_INSTRUCTION);
		const raw = await gpt.sendRequest("high", "medium", null, {
			responseFormat: "json",
			temperature: .2
		});
		if (!raw) return {
			ok: false,
			error: "No response"
		};
		const parseResult = extractJSONFromAIResponse(raw);
		if (!parseResult.ok) return {
			ok: false,
			error: parseResult.error || "Failed to parse AI response"
		};
		return {
			ok: true,
			data: parseResult.data?.entities || [],
			responseId: gpt.getResponseId()
		};
	} catch (e) {
		return {
			ok: false,
			error: String(e)
		};
	}
};
//#endregion
//#region src/com/service/processing/adapters.ts
var detectPlatform = () => {
	try {
		if (typeof chrome !== "undefined" && chrome?.runtime?.id) return "crx";
		if (typeof self !== "undefined" && "ServiceWorkerGlobalScope" in self) return "pwa";
		if (typeof navigator !== "undefined" && "standalone" in navigator) return "pwa";
		return "core";
	} catch {
		return "unknown";
	}
};
//#endregion
//#region src/com/service/processing/settings.ts
var loadAISettings = async () => {
	const platform = detectPlatform();
	try {
		if (platform === "crx") return await loadSettings$1();
		else return await getRuntimeSettings();
	} catch (e) {
		console.error(`[AI-Service] Failed to load settings for platform ${platform}:`, e);
		return null;
	}
};
var getActiveCustomInstruction = async () => {
	try {
		const { getActiveInstructionText } = await import("../chunks/CustomInstructions.js");
		return await getActiveInstructionText();
	} catch {
		return "";
	}
};
var getLanguageInstruction = async () => {
	try {
		const settings = await loadAISettings();
		const lang = settings?.ai?.responseLanguage || "auto";
		const translate = settings?.ai?.translateResults || false;
		let instruction = LANGUAGE_INSTRUCTIONS[lang] || "";
		if (translate && lang !== "auto" && lang !== "follow") instruction += TRANSLATE_INSTRUCTION;
		return instruction;
	} catch {
		return "";
	}
};
var getSvgGraphicsAddon = async () => {
	try {
		return (await loadAISettings())?.ai?.generateSvgGraphics ? SVG_GRAPHICS_ADDON : "";
	} catch {
		return "";
	}
};
//#endregion
//#region src/com/service/recognition/cache.ts
var RecognitionCache = class {
	cache = /* @__PURE__ */ new Map();
	maxEntries = 100;
	ttl = 1440 * 60 * 1e3;
	generateDataHash(data) {
		if (data instanceof File) return `${data.name}-${data.size}-${data.lastModified}`;
		if (typeof data === "string") return btoa(data).substring(0, 32);
		return JSON.stringify(data).substring(0, 32);
	}
	get(data, format) {
		const hash = this.generateDataHash(data);
		const entry = this.cache.get(hash);
		if (!entry) return null;
		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(hash);
			return null;
		}
		if (format && entry.recognizedAs !== format) return null;
		return entry;
	}
	set(data, recognizedData, recognizedAs, responseId, metadata) {
		const hash = this.generateDataHash(data);
		if (this.cache.size >= this.maxEntries) {
			const oldestKey = Array.from(this.cache.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
			this.cache.delete(oldestKey);
		}
		this.cache.set(hash, {
			dataHash: hash,
			recognizedData,
			recognizedAs,
			timestamp: Date.now(),
			responseId,
			metadata
		});
	}
	clear() {
		this.cache.clear();
	}
	getStats() {
		return {
			entries: this.cache.size,
			maxEntries: this.maxEntries,
			ttl: this.ttl
		};
	}
};
//#endregion
//#region src/com/service/recognition/core.ts
var recognizeImageData = async (input, sendResponse, config, options) => {
	const { recognizeByInstructions } = await import("../chunks/unified.js");
	return recognizeByInstructions(input, CORE_IMAGE_INSTRUCTION, sendResponse, config, options);
};
var convertTextualData = async (input, sendResponse, config, options) => {
	const { recognizeByInstructions } = await import("../chunks/unified.js");
	return recognizeByInstructions(input, CORE_DATA_CONVERSION_INSTRUCTION, sendResponse, config, options);
};
var analyzeRecognizeUnified = async (rawData, sendResponse, config, options) => {
	const content = await getUsableData({ dataSource: rawData });
	const input = [{
		type: "message",
		role: "user",
		content: [content]
	}];
	return content?.[0]?.type === "input_image" || content?.type === "input_image" ? recognizeImageData(input, sendResponse, config, options) : convertTextualData(input, sendResponse, config, options);
};
//#endregion
//#region src/com/service/processing/unified.ts
var recognitionCache = new RecognitionCache();
var processDataWithInstruction = async (input, options = {}, sendResponse) => {
	const settings = (await loadSettings$1())?.ai;
	const { instruction = "", outputFormat = "auto", outputLanguage = "auto", enableSVGImageGeneration = "auto", intermediateRecognition, processingEffort = "low", processingVerbosity = "low", customInstruction, useActiveInstruction = false, includeImageRecognition, dataType } = options;
	const token = settings?.apiKey;
	if (!token) {
		const result = {
			ok: false,
			error: "No API key available"
		};
		sendResponse?.(result);
		return result;
	}
	if (!input) {
		const result = {
			ok: false,
			error: "No input provided"
		};
		sendResponse?.(result);
		return result;
	}
	let finalInstruction = instruction;
	if (customInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, customInstruction);
	else if (useActiveInstruction) {
		const activeInstruction = await getActiveCustomInstruction();
		if (activeInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, activeInstruction);
	}
	const languageInstruction = await getLanguageInstruction();
	if (languageInstruction) finalInstruction += languageInstruction;
	if (enableSVGImageGeneration === true || enableSVGImageGeneration === "auto" && outputFormat === "html") {
		const svgAddon = await getSvgGraphicsAddon();
		if (svgAddon) finalInstruction += svgAddon;
	}
	if (outputFormat !== "auto") {
		const formatInstruction = getOutputFormatInstruction(outputFormat);
		if (formatInstruction) finalInstruction += formatInstruction;
	}
	const gpt = await getGPTInstance({
		apiKey: token,
		baseUrl: settings?.baseUrl,
		model: settings?.model,
		mcp: settings?.mcp
	});
	if (!gpt) {
		const result = {
			ok: false,
			error: "AI initialization failed"
		};
		sendResponse?.(result);
		return result;
	}
	gpt.clearPending();
	let processingStages = 1;
	let recognizedImages = false;
	const intermediateRecognizedData = [];
	if (Array.isArray(input) && (input?.[0]?.type === "message" || input?.[0]?.["role"])) await gpt.getPending()?.push(...input);
	else {
		const inputData = Array.isArray(input) ? input : [input];
		for (const item of inputData) {
			let processedItem = item;
			if (typeof item === "string" && dataType === "svg" || typeof item === "string" && item.trim().startsWith("<svg")) processedItem = item;
			else if (isImageData(item)) {
				recognizedImages = true;
				if (intermediateRecognition?.enabled !== false && (intermediateRecognition?.enabled || includeImageRecognition)) {
					processingStages = 2;
					const cachedResult = !intermediateRecognition?.forceRefresh ? recognitionCache.get(item, intermediateRecognition?.outputFormat) : null;
					let recognizedContent;
					let recognitionResponseId;
					if (cachedResult) {
						recognizedContent = cachedResult.recognizedData;
						recognitionResponseId = cachedResult.responseId;
					} else {
						const recognitionResult = await recognizeByInstructions(item, intermediateRecognition?.dataPriorityInstruction || getIntermediateRecognitionInstruction(intermediateRecognition?.outputFormat || "markdown"), void 0, {
							apiKey: token,
							baseUrl: settings?.baseUrl,
							model: settings?.model,
							mcp: settings?.mcp
						}, {
							customInstruction: void 0,
							useActiveInstruction: false
						});
						if (!recognitionResult.ok || !recognitionResult.data) {
							recognizedContent = "";
							recognitionResponseId = "";
						} else {
							recognizedContent = recognitionResult.data;
							recognitionResponseId = recognitionResult.responseId || "";
							if (intermediateRecognition?.cacheResults !== false) {
								const recognizedAs = intermediateRecognition?.outputFormat || "markdown";
								recognitionCache.set(item, recognizedContent, recognizedAs, recognitionResponseId);
							}
						}
					}
					intermediateRecognizedData.push({
						originalData: item,
						recognizedData: recognizedContent,
						recognizedAs: intermediateRecognition?.outputFormat || "markdown",
						responseId: recognitionResponseId
					});
					if (recognizedContent) processedItem = recognizedContent;
				}
			}
			if (processedItem !== null && processedItem !== void 0) await gpt?.attachToRequest?.(processedItem);
		}
	}
	await gpt.askToDoAction(finalInstruction);
	let response;
	let error;
	try {
		response = await gpt?.sendRequest?.(processingEffort, processingVerbosity, null, {
			responseFormat: getResponseFormat(outputFormat),
			temperature: .3
		});
	} catch (e) {
		error = String(e);
	}
	let parsedResponse = response;
	if (typeof response === "string") try {
		parsedResponse = JSON.parse(response);
	} catch {
		parsedResponse = null;
	}
	const responseContent = parsedResponse?.choices?.[0]?.message?.content;
	let cleanedResponse = responseContent ? unwrapUnwantedCodeBlocks(responseContent.trim()) : null;
	let finalData = cleanedResponse;
	if (cleanedResponse && instruction?.includes("Recognize data from image")) try {
		const parsedJson = JSON.parse(cleanedResponse);
		if (parsedJson?.recognized_data) if (Array.isArray(parsedJson.recognized_data)) finalData = parsedJson.recognized_data.join("\n");
		else if (typeof parsedJson.recognized_data === "string") finalData = parsedJson.recognized_data;
		else finalData = JSON.stringify(parsedJson.recognized_data);
		else if (parsedJson?.ok === false) finalData = null;
		else finalData = cleanedResponse;
	} catch {
		finalData = cleanedResponse;
	}
	const result = {
		ok: !!finalData && !error,
		data: finalData || void 0,
		error: error || (!finalData ? "No data recognized" : void 0),
		responseId: parsedResponse?.id || gpt?.getResponseId?.(),
		processingStages,
		recognizedImages,
		intermediateRecognizedData: intermediateRecognizedData.length > 0 ? intermediateRecognizedData : void 0
	};
	sendResponse?.(result);
	return result;
};
var recognizeByInstructions = async (input, instructions, sendResponse, config, options) => {
	const result = await processDataWithInstruction(input, {
		instruction: instructions,
		customInstruction: options?.customInstruction,
		useActiveInstruction: options?.useActiveInstruction,
		processingEffort: options?.recognitionEffort || "low",
		processingVerbosity: options?.recognitionVerbosity || "low",
		outputFormat: "auto",
		outputLanguage: "auto",
		enableSVGImageGeneration: "auto"
	});
	const legacyResult = {
		ok: result.ok,
		data: result.data,
		error: result.error,
		responseId: result.responseId
	};
	sendResponse?.(legacyResult);
	return legacyResult;
};
//#endregion
//#region src/core/modules/TemplateManager.ts
var TemplateManager = class {
	storageKey;
	templates = [];
	defaultTemplates;
	constructor(options = {}) {
		this.storageKey = options.storageKey || "rs-prompt-templates";
		this.defaultTemplates = options.defaultTemplates || this.getDefaultTemplates();
		this.loadTemplates();
	}
	/**
	* Get all templates
	*/
	getAllTemplates() {
		return [...this.templates];
	}
	/**
	* Get template by ID
	*/
	getTemplateById(id) {
		return this.templates.find((t) => t.id === id);
	}
	/**
	* Add a new template
	*/
	addTemplate(template) {
		const newTemplate = {
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		};
		this.templates.push(newTemplate);
		this.saveTemplates();
		return newTemplate;
	}
	/**
	* Update an existing template
	*/
	updateTemplate(id, updates) {
		const index = this.templates.findIndex((t) => t.id === id);
		if (index === -1) return false;
		this.templates[index] = {
			...this.templates[index],
			...updates,
			updatedAt: Date.now()
		};
		this.saveTemplates();
		return true;
	}
	/**
	* Remove a template
	*/
	removeTemplate(id) {
		const index = this.templates.findIndex((t) => t.id === id);
		if (index === -1) return false;
		this.templates.splice(index, 1);
		this.saveTemplates();
		return true;
	}
	/**
	* Increment usage count for a template
	*/
	incrementUsageCount(id) {
		const template = this.templates.find((t) => t.id === id);
		if (template) {
			template.usageCount = (template.usageCount || 0) + 1;
			this.saveTemplates();
		}
	}
	/**
	* Search templates by name or content
	*/
	searchTemplates(query) {
		const lowercaseQuery = query.toLowerCase();
		return this.templates.filter((template) => template.name.toLowerCase().includes(lowercaseQuery) || template.prompt.toLowerCase().includes(lowercaseQuery) || template.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)));
	}
	/**
	* Get templates by category
	*/
	getTemplatesByCategory(category) {
		return this.templates.filter((template) => template.category === category);
	}
	/**
	* Get most used templates
	*/
	getMostUsedTemplates(limit = 5) {
		return this.templates.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, limit);
	}
	/**
	* Export templates as JSON
	*/
	exportTemplates() {
		return JSON.stringify(this.templates, null, 2);
	}
	/**
	* Import templates from JSON
	*/
	importTemplates(jsonData) {
		try {
			const importedTemplates = JSON.parse(jsonData);
			if (!Array.isArray(importedTemplates)) throw new Error("Invalid template data: not an array");
			for (const template of importedTemplates) if (!template.name || !template.prompt) throw new Error("Invalid template: missing name or prompt");
			const templatesWithIds = importedTemplates.map((template) => ({
				...template,
				id: this.generateId(),
				createdAt: template.createdAt || Date.now(),
				updatedAt: Date.now()
			}));
			this.templates.push(...templatesWithIds);
			this.saveTemplates();
			return true;
		} catch (error) {
			console.error("Failed to import templates:", error);
			return false;
		}
	}
	/**
	* Reset to default templates
	*/
	resetToDefaults() {
		this.templates = this.defaultTemplates.map((template) => ({
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		}));
		this.saveTemplates();
	}
	/**
	* Create template editor modal
	*/
	createTemplateEditor(container, onSave) {
		const modal = H`<div class="template-editor-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Prompt Templates</h3>
          </div>

          <div class="template-list">
            ${this.templates.map((template, index) => H`<div class="template-item">
                <div class="template-header">
                  <input type="text" class="template-name" value="${template.name}" data-index="${index}" placeholder="Template name">
                  <button class="btn small remove-template" data-index="${index}" title="Remove template">✕</button>
                </div>
                <textarea class="template-prompt" data-index="${index}" placeholder="Enter your prompt template...">${template.prompt}</textarea>
                <div class="template-meta">
                  ${template.usageCount ? H`<span class="usage-count">Used ${template.usageCount} times</span>` : ""}
                  ${template.category ? H`<span class="category">${template.category}</span>` : ""}
                </div>
              </div>`)}
          </div>

          <div class="modal-actions">
            <button class="btn" data-action="add-template">Add Template</button>
            <button class="btn" data-action="reset-defaults">Reset to Defaults</button>
            <button class="btn primary" data-action="save-templates">Save Changes</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;
		modal.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const index = target.getAttribute("data-index");
			if (action === "add-template") {
				this.addTemplate({
					name: "New Template",
					prompt: "Enter your prompt template here...",
					category: "Custom"
				});
				modal.remove();
				this.createTemplateEditor(container, onSave);
			} else if (action === "reset-defaults") {
				if (confirm("Are you sure you want to reset all templates to defaults? This will remove all custom templates.")) {
					this.resetToDefaults();
					modal.remove();
					this.createTemplateEditor(container, onSave);
				}
			} else if (action === "save-templates") {
				const nameInputs = modal.querySelectorAll(".template-name");
				const promptInputs = modal.querySelectorAll(".template-prompt");
				this.templates = Array.from(nameInputs).map((input, i) => {
					const index = parseInt(input.getAttribute("data-index") || "0");
					return {
						...this.templates[index],
						name: input.value.trim() || "Untitled Template",
						prompt: promptInputs[i].value.trim() || "Enter your prompt...",
						updatedAt: Date.now()
					};
				});
				this.saveTemplates();
				modal.remove();
				onSave?.();
			} else if (action === "close-editor") modal.remove();
			else if (target.classList.contains("remove-template") && index !== null) {
				const templateIndex = parseInt(index);
				const template = this.templates[templateIndex];
				if (confirm(`Remove template "${template.name}"?`)) {
					this.removeTemplate(template.id);
					modal.remove();
					this.createTemplateEditor(container, onSave);
				}
			}
		});
		container.append(modal);
	}
	/**
	* Create template selector dropdown
	*/
	createTemplateSelect(selectedPrompt) {
		const select = document.createElement("select");
		select.className = "template-select";
		const defaultOption = document.createElement("option");
		defaultOption.value = "";
		defaultOption.textContent = "Select Template...";
		select.append(defaultOption);
		this.templates.forEach((template) => {
			const option = document.createElement("option");
			option.value = template.prompt;
			option.textContent = template.name;
			if (template.category) option.textContent += ` (${template.category})`;
			select.append(option);
		});
		if (selectedPrompt) select.value = selectedPrompt;
		return select;
	}
	getDefaultTemplates() {
		return DEFAULT_TEMPLATES.map((template) => ({
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		}));
	}
	generateId() {
		return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadTemplates() {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) this.templates = JSON.parse(stored).map((template) => ({
				...template,
				id: template.id || this.generateId(),
				createdAt: template.createdAt || Date.now(),
				updatedAt: template.updatedAt || Date.now(),
				usageCount: template.usageCount || 0
			}));
			else this.resetToDefaults();
		} catch (error) {
			console.warn("Failed to load templates from storage:", error);
			this.resetToDefaults();
		}
	}
	saveTemplates() {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
		} catch (error) {
			console.warn("Failed to save templates to storage:", error);
		}
	}
};
/**
* Utility function to create a template manager
*/
function createTemplateManager(options) {
	return new TemplateManager(options);
}
//#endregion
//#region src/com/service/misc/ActionHistory.ts
var ActionHistoryStore = class {
	state;
	storageKey = "rs-action-history";
	constructor(maxEntries = 500, autoSave = true) {
		this.state = {
			entries: [],
			maxEntries,
			autoSave,
			filters: {}
		};
		this.loadHistory();
	}
	/**
	* Add a new action entry
	*/
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			timestamp: Date.now()
		};
		this.state.entries.unshift(fullEntry);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		return fullEntry;
	}
	/**
	* Update an existing entry
	*/
	updateEntry(id, updates) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		Object.assign(this.state.entries[index], updates);
		return true;
	}
	/**
	* Get entry by ID
	*/
	getEntry(id) {
		return this.state.entries.find((entry) => entry.id === id);
	}
	/**
	* Get filtered entries
	*/
	getEntries(filters) {
		let entries = [...this.state.entries];
		if (filters?.source) entries = entries.filter((entry) => entry.context.source === filters.source);
		if (filters?.action) entries = entries.filter((entry) => entry.action === filters.action);
		if (filters?.status) entries = entries.filter((entry) => entry.status === filters.status);
		if (filters?.dateRange) entries = entries.filter((entry) => entry.timestamp >= filters.dateRange.start && entry.timestamp <= filters.dateRange.end);
		return entries;
	}
	/**
	* Get recent entries
	*/
	getRecentEntries(limit = 50) {
		return this.state.entries.slice(0, limit);
	}
	/**
	* Remove entry
	*/
	removeEntry(id) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.state.entries.splice(index, 1);
		return true;
	}
	/**
	* Clear all entries
	*/
	clearEntries() {
		this.state.entries = [];
	}
	/**
	* Set filters
	*/
	setFilters(filters) {
		Object.assign(this.state.filters, filters);
	}
	/**
	* Get statistics
	*/
	getStats() {
		const entries = this.state.entries;
		const total = entries.length;
		const completed = entries.filter((e) => e.status === "completed").length;
		const failed = entries.filter((e) => e.status === "failed").length;
		const pending = entries.filter((e) => e.status === "pending" || e.status === "processing").length;
		const bySource = entries.reduce((acc, entry) => {
			acc[entry.context.source] = (acc[entry.context.source] || 0) + 1;
			return acc;
		}, {});
		const byAction = entries.reduce((acc, entry) => {
			acc[entry.action] = (acc[entry.action] || 0) + 1;
			return acc;
		}, {});
		return {
			total,
			completed,
			failed,
			pending,
			successRate: total > 0 ? completed / total * 100 : 0,
			bySource,
			byAction
		};
	}
	/**
	* Export entries
	*/
	exportEntries(format = "json", filters) {
		const entries = this.getEntries(filters);
		if (format === "csv") return [[
			"ID",
			"Timestamp",
			"Source",
			"Action",
			"Status",
			"Input Type",
			"Result Type",
			"Processing Time"
		], ...entries.map((entry) => [
			entry.id,
			new Date(entry.timestamp).toISOString(),
			entry.context.source,
			entry.action,
			entry.status,
			entry.input.type,
			entry.result?.type || "",
			entry.result?.processingTime || ""
		])].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		return JSON.stringify(entries, null, 2);
	}
	/**
	* Import entries
	*/
	importEntries(data, format = "json") {
		let entries = [];
		if (format === "json") try {
			entries = JSON.parse(data);
		} catch (e) {
			throw new Error("Invalid JSON format");
		}
		else throw new Error("CSV import not implemented yet");
		const validEntries = entries.filter((entry) => entry.id && entry.timestamp && entry.context && entry.action);
		validEntries.forEach((entry) => {
			if (!this.getEntry(entry.id)) this.state.entries.push(entry);
		});
		this.state.entries.sort((a, b) => b.timestamp - a.timestamp);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		this.saveHistory();
		return validEntries.length;
	}
	generateId() {
		return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const data = JSON.parse(stored);
				if (Array.isArray(data)) this.state.entries = data.map((entry) => ({
					...entry,
					context: entry.context || { source: "unknown" },
					input: entry.input || { type: "unknown" },
					status: entry.status || "completed"
				}));
			}
		} catch (e) {
			console.warn("Failed to load action history:", e);
			this.state.entries = [];
		}
	}
	saveHistory() {
		if (!this.state.autoSave) return;
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.state.entries));
		} catch (e) {
			console.warn("Failed to save action history:", e);
		}
	}
};
var actionHistory = new ActionHistoryStore();
//#endregion
//#region src/com/service/misc/ExecutionCore.ts
var ExecutionCore = class {
	rules = [];
	ruleSets = /* @__PURE__ */ new Map();
	constructor(rules) {
		this.initializeDefaultRules(rules ?? {
			recognitionFormat: "markdown",
			processingFormat: "markdown"
		});
	}
	/**
	* Register a new execution rule
	*/
	registerRule(rule) {
		this.rules.push(rule);
		this.rules.sort((a, b) => b.priority - a.priority);
	}
	/**
	* Register a rule set
	*/
	registerRuleSet(name, rules) {
		this.ruleSets.set(name, rules);
	}
	/**
	* Execute an action based on input and context
	*/
	async execute(input, context, options = {}) {
		const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const entry = {
			context,
			action: options.forceAction || "auto",
			input,
			status: "processing",
			ruleSet: options.ruleSet,
			executionId
		};
		const historyEntry = actionHistory.addEntry(entry);
		try {
			const rule = this.findMatchingRule(input, context, options);
			if (!rule) throw new Error("No matching execution rule found");
			actionHistory.updateEntry(historyEntry.id, { action: rule.action });
			const startTime = Date.now();
			const result = await rule.processor(input, context, options);
			const processingTime = Date.now() - startTime;
			const enhancedResult = {
				...result,
				processingTime,
				autoCopied: rule.autoCopy
			};
			actionHistory.updateEntry(historyEntry.id, {
				result: enhancedResult,
				status: "completed",
				dataCategory: enhancedResult.dataCategory
			});
			if (rule.autoCopy && enhancedResult.type !== "error") await this.autoCopyResult(enhancedResult, context);
			return enhancedResult;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			actionHistory.updateEntry(historyEntry.id, {
				status: "failed",
				error: errorMessage
			});
			return {
				type: "error",
				content: errorMessage
			};
		}
	}
	/**
	* Find the best matching rule for the given input and context
	*/
	findMatchingRule(input, context, options) {
		if (options.forceAction) {
			const forcedRule = this.rules.find((rule) => rule.action === options.forceAction && rule.source === context.source && rule.inputTypes.includes(input.type));
			if (forcedRule) return forcedRule;
		}
		if (options.ruleSet) {
			const ruleSet = this.ruleSets.get(options.ruleSet);
			if (ruleSet) {
				const matchingRule = ruleSet.find((rule) => rule.source === context.source && rule.inputTypes.includes(input.type) && rule.condition(input, context));
				if (matchingRule) return matchingRule;
			}
		}
		return this.rules.find((rule) => rule.source === context.source && rule.inputTypes.includes(input.type) && rule.condition(input, context)) || null;
	}
	/**
	* Auto-copy result to clipboard
	*/
	async autoCopyResult(result, context) {
		try {
			let textToCopy = "";
			switch (result.type) {
				case "markdown":
				case "text":
					textToCopy = result.content;
					break;
				case "json":
					try {
						const data = JSON.parse(result.content);
						if (typeof data === "string") textToCopy = data;
						else if (data.recognized_data) textToCopy = Array.isArray(data.recognized_data) ? data.recognized_data.join("\n\n") : String(data.recognized_data);
						else textToCopy = result.content;
					} catch {
						textToCopy = result.content;
					}
					break;
				case "html":
					textToCopy = result.content.replace(/<[^>]*>/g, "");
					break;
				default: return;
			}
			if (textToCopy.trim()) {
				if (context.source === "chrome-extension") {
					if (typeof chrome !== "undefined" && chrome.runtime) return;
				} else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) await navigator.clipboard.writeText(textToCopy.trim());
				else if (typeof document !== "undefined" && document.body) {
					const textArea = document.createElement("textarea");
					textArea.value = textToCopy.trim();
					document.body.appendChild(textArea);
					textArea.select();
					document.body.removeChild(textArea);
				} else {
					console.log("[ExecutionCore] Cannot auto-copy in service worker context - DOM not available");
					return;
				}
				this.notifyCopySuccess(context);
			}
		} catch (error) {
			console.warn("Failed to auto-copy result:", error);
		}
	}
	/**
	* Notify about successful copy
	*/
	notifyCopySuccess(context) {
		const message = {
			type: "copy-success",
			context
		};
		if (context.source === "chrome-extension") {
			if (typeof chrome !== "undefined" && chrome.runtime) chrome.runtime.sendMessage(message);
		} else try {
			const bc = new BroadcastChannel("rs-clipboard");
			bc.postMessage(message);
			bc.close();
		} catch (e) {
			console.warn("Failed to broadcast copy success:", e);
		}
	}
	/**
	* Initialize default execution rules
	*/
	initializeDefaultRules(options) {
		this.registerRule({
			id: "workcenter-text-files-source",
			name: "Work Center Text File Source",
			description: "Process text/markdown files as source data",
			source: "workcenter",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 11
		});
		this.registerRule({
			id: "workcenter-files-recognize",
			name: "Work Center File Recognition",
			description: "Recognize content from uploaded files",
			source: "workcenter",
			inputTypes: ["files", "image"],
			action: "recognize",
			condition: (input) => Boolean((input?.files?.length ?? 0) > 0),
			processor: async (input, context, options) => {
				let result;
				const formatInstruction = this.getRecognitionFormatInstruction(options?.recognitionFormat);
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Analyze and recognize content from the following ${input.files.length} files. ${formatInstruction}`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						const FileCtor = globalThis.File;
						const isFile = FileCtor && file instanceof FileCtor;
						const header = {
							type: "input_text",
							text: `\n--- File ${index + 1}: ${file.name} ---\n`
						};
						if (isFile && file.type.startsWith("image/")) try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [header, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process image ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to process image: ${file.name}]`
							}];
						}
						else try {
							return [header, {
								type: "input_text",
								text: await file.text()
							}];
						} catch (error) {
							console.warn(`Failed to read file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to read file: ${file.name}]`
							}];
						}
					}))).flat()].filter((item) => item !== null)
				}], {
					instruction: `Analyze and recognize content from the provided files. ${formatInstruction}`,
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: `Analyze and recognize content from the provided image. ${formatInstruction}`,
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: `Analyze and recognize content from the provided file. ${formatInstruction}`,
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Analyze and recognize content from the provided file",
						outputFormat: options?.recognitionFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 10
		});
		this.registerRule({
			id: "workcenter-text-analyze",
			name: "Work Center Text Analysis",
			description: "Analyze provided text content",
			source: "workcenter",
			inputTypes: ["text", "markdown"],
			action: "analyze",
			condition: (input) => Boolean(input.text || input.recognizedContent),
			processor: async (input, context, options) => {
				const content = input.recognizedContent || input.recognizedData?.content || input.text || "";
				const hasImages = input.files?.some((f) => f.type.startsWith("image/") || f.type === "image/svg+xml") || false;
				const hasSvgContent = typeof content === "string" && content.includes("<svg");
				const instructions = input.text && input.text.trim() && input.text.trim() !== "Analyze and process the provided content intelligently" ? input?.text?.trim?.() : `Analyze the provided content. ${this.getProcessingFormatInstruction(options?.processingFormat)}`;
				const result = await processDataWithInstruction(hasImages || hasSvgContent ? [content, ...input.files || []] : content, {
					instruction: instructions,
					outputFormat: options?.processingFormat || "auto",
					outputLanguage: "auto",
					enableSVGImageGeneration: "auto",
					intermediateRecognition: {
						enabled: hasImages,
						outputFormat: options?.recognitionFormat || "markdown",
						dataPriorityInstruction: void 0,
						cacheResults: true
					},
					dataType: hasSvgContent ? "svg" : hasImages ? "image" : "text",
					processingEffort: "medium",
					processingVerbosity: "medium"
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "processed"
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 9
		});
		this.registerRule({
			id: "share-target-text-files-source",
			name: "Share Target Text File Source",
			description: "Process shared text/markdown files as source data",
			source: "share-target",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some?.((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter?.((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `share_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 16
		});
		this.registerRule({
			id: "share-target-images-recognize",
			name: "Share Target Image Recognition",
			description: "Recognize content from shared images",
			source: "share-target",
			inputTypes: ["image", "files"],
			action: "recognize",
			condition: (input) => input.files?.some((f) => f.type.startsWith("image/")) || false,
			processor: async (input) => {
				const imageFiles = input.files.filter((f) => f.type.startsWith("image/"));
				let result;
				if (imageFiles.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Recognize and extract text/content from the following ${imageFiles.length} shared images:`
					}, ...(await Promise.all(imageFiles.map(async (file, index) => {
						try {
							const arrayBuffer = await file.arrayBuffer();
							const bytes = new Uint8Array(arrayBuffer);
							const base64 = btoa(String.fromCharCode(...bytes));
							return [{
								type: "input_text",
								text: `\n--- Image ${index + 1}: ${file?.name ?? "unknown file"} ---\n`
							}, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
							return [{
								type: "input_text",
								text: `\n--- Image ${index + 1}: ${file?.name ?? "unknown file"} ---\n`
							}, {
								type: "input_text",
								text: `[Failed to process image: ${file?.name ?? "unknown file"}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Recognize and extract text/content from the shared images",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else result = await processDataWithInstruction(imageFiles[0], {
					instruction: "Recognize and extract text/content from the shared image",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 15
		});
		this.registerRule({
			id: "share-target-markdown-view",
			name: "Share Target Markdown View",
			description: "View shared markdown content",
			source: "share-target",
			inputTypes: ["text", "markdown"],
			action: "view",
			condition: (input) => this.isMarkdownContent(input.text || ""),
			processor: async (input) => {
				return {
					type: "markdown",
					content: input.text || ""
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 14
		});
		this.registerRule({
			id: "share-target-url-analyze",
			name: "Share Target URL Analysis",
			description: "Analyze shared URL content",
			source: "share-target",
			inputTypes: ["url"],
			action: "analyze",
			condition: () => true,
			processor: async (input, context, options) => {
				const instructions = `Analyze the content from this URL and provide insights. ${this.getProcessingFormatInstruction(options?.processingFormat)}`;
				const result = await processDataWithInstruction(input.url, {
					instruction: instructions,
					outputFormat: options?.processingFormat || "auto",
					outputLanguage: "auto",
					enableSVGImageGeneration: "auto",
					intermediateRecognition: { enabled: false },
					dataType: "text"
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 13
		});
		this.registerRule({
			id: "chrome-extension-text-files-source",
			name: "Chrome Extension Text File Source",
			description: "Process Chrome extension text/markdown files as source data",
			source: "chrome-extension",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `crx_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 26
		});
		this.registerRule({
			id: "chrome-extension-screenshot-recognize",
			name: "Chrome Extension Screenshot Recognition",
			description: "Recognize content from screenshot",
			source: "chrome-extension",
			inputTypes: ["image"],
			action: "recognize",
			condition: () => true,
			processor: async (input) => {
				let result;
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Analyze the following ${input.files.length} screenshots and extract any visible text or content:`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [{
								type: "input_text",
								text: `\n--- Screenshot ${index + 1}: ${file.name} ---\n`
							}, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process screenshot ${file.name}:`, error);
							return [{
								type: "input_text",
								text: `\n--- Screenshot ${index + 1}: ${file.name} ---\n`
							}, {
								type: "input_text",
								text: `[Failed to process screenshot: ${file.name}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Analyze the screenshots and extract any visible text or content",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: "Analyze the screenshot and extract any visible text or content",
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process screenshot ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: "Analyze the screenshot and extract any visible text or content",
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Analyze the screenshot and extract any visible text or content",
						outputFormat: options?.recognitionFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 20
		});
		this.registerRule({
			id: "launch-queue-text-files-source",
			name: "Launch Queue Text File Source",
			description: "Process launch queue text/markdown files as source data",
			source: "launch-queue",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `launch_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 21
		});
		this.registerRule({
			id: "launch-queue-files-process",
			name: "Launch Queue File Processing",
			description: "Process files from launch queue",
			source: "launch-queue",
			inputTypes: ["files", "mixed"],
			action: "process",
			condition: () => true,
			processor: async (input) => {
				let result;
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Process the following ${input.files.length} files:`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						const FileCtor = globalThis.File;
						const isFile = FileCtor && file instanceof FileCtor;
						const header = {
							type: "input_text",
							text: `\n--- File ${index + 1}: ${file.name} ---\n`
						};
						if (isFile && file.type.startsWith("image/")) try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [header, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to process file: ${file.name}]`
							}];
						}
						else try {
							return [header, {
								type: "input_text",
								text: await file.text()
							}];
						} catch (error) {
							console.warn(`Failed to read file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to read file: ${file.name}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Process the provided content",
					outputFormat: options?.processingFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: "Process the provided image content",
							outputFormat: options?.processingFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: "Process the provided content",
							outputFormat: options?.processingFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Process the provided content",
						outputFormat: options?.processingFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 12
		});
	}
	/**
	* Check if content is markdown
	*/
	isMarkdownContent(text) {
		if (!text || typeof text !== "string") return false;
		const trimmed = text.trim();
		if (trimmed.startsWith("<") && trimmed.endsWith(">")) return false;
		if (/<[a-zA-Z][^>]*>/.test(trimmed)) return false;
		return [
			/^---[\s\S]+?---/,
			/^#{1,6}\s+.+$/m,
			/^\s*[-*+]\s+\S+/m,
			/^\s*\d+\.\s+\S+/m,
			/`{1,3}[^`]*`{1,3}/,
			/\[([^\]]+)\]\(([^)]+)\)/,
			/!\[([^\]]+)\]\(([^)]+)\)/
		].some((pattern) => pattern.test(text));
	}
	/**
	* Format AI result for display
	*/
	detectResultFormat(result) {
		if (!result) return "text";
		try {
			const data = result.data || result;
			if (data && typeof data === "object") {
				if ([
					"recognized_data",
					"verbose_data",
					"keywords_and_tags",
					"confidence",
					"suggested_type",
					"using_ready"
				].some((field) => field in data)) return "json";
				if (data.content || data.text || data.message) return "markdown";
				return "json";
			}
			if (typeof data === "string") {
				if (data.includes("\n") || data.includes("#") || data.includes("*") || data.includes("`")) return "markdown";
				return "text";
			}
			return "json";
		} catch (error) {
			console.warn("Failed to detect result format:", error);
			return "text";
		}
	}
	formatAIResult(result) {
		if (!result) return "No result";
		try {
			let content = "";
			if (result.data) if (typeof result.data === "string") content = result.data;
			else if (result.data.recognized_data) {
				const recognized = result.data.recognized_data;
				content = Array.isArray(recognized) ? recognized.join("\n\n") : String(recognized);
			} else content = JSON.stringify(result.data, null, 2);
			else if (typeof result === "string") content = result;
			else content = JSON.stringify(result, null, 2);
			content = this.unwrapUnwantedCodeBlocks(content);
			return content;
		} catch (error) {
			console.warn("Failed to format AI result:", error);
			return String(result);
		}
	}
	unwrapUnwantedCodeBlocks(content) {
		if (!content) return content;
		const match = content.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);
		if (match) {
			const unwrapped = match[1].trim();
			const lines = unwrapped.split("\n");
			if (lines.length === 1 || unwrapped.includes("<math") || unwrapped.includes("<span class=\"katex") || unwrapped.includes("<content") || unwrapped.startsWith("<") && unwrapped.endsWith(">") || /^\s*<[^>]+>/.test(unwrapped)) {
				console.log("[AI Response] Unwrapped unwanted code block formatting");
				return unwrapped;
			}
			if (lines.length > 3 || lines.some((line) => line.match(/^\s{4,}/) || line.includes("function") || line.includes("const ") || line.includes("let "))) return content;
			console.log("[AI Response] Unwrapped unwanted code block formatting");
			return unwrapped;
		}
		return content;
	}
	getRecognitionFormatInstruction(format) {
		if (!format || format === "auto") return "Output the content in the most appropriate format (markdown is preferred for structured content).";
		switch (format) {
			case "most-suitable": return "Analyze the content and output it in the most suitable format for its type and structure. Choose the format that best represents the content's nature and purpose.";
			case "most-optimized": return "Output the content in the most optimized format for storage and transmission efficiency. Prefer compact representations while maintaining essential information.";
			case "most-legibility": return "Output the content in the most human-readable and legible format. Prioritize clarity, readability, and ease of understanding over compactness.";
			case "markdown": return "Output the recognized content in Markdown format.";
			case "html": return "Output the recognized content in HTML format.";
			case "text": return "Output the recognized content as plain text.";
			case "json": return "Output the recognized content as structured JSON data.";
			default: return "Output the content in the most appropriate format (markdown is preferred for structured content).";
		}
	}
	getProcessingFormatInstruction(format) {
		if (!format || format === "markdown") return "Output the processed result in Markdown format.";
		switch (format) {
			case "html": return "Output the processed result in HTML format.";
			case "json": return "Output the processed result as structured JSON data.";
			case "text": return "Output the processed result as plain text.";
			case "typescript": return "Output the processed result as TypeScript code.";
			case "javascript": return "Output the processed result as JavaScript code.";
			case "python": return "Output the processed result as Python code.";
			case "java": return "Output the processed result as Java code.";
			case "cpp": return "Output the processed result as C++ code.";
			case "csharp": return "Output the processed result as C# code.";
			case "php": return "Output the processed result as PHP code.";
			case "ruby": return "Output the processed result as Ruby code.";
			case "go": return "Output the processed result as Go code.";
			case "rust": return "Output the processed result as Rust code.";
			case "xml": return "Output the processed result in XML format.";
			case "yaml": return "Output the processed result in YAML format.";
			case "css": return "Output the processed result as CSS code.";
			case "scss": return "Output the processed result as SCSS code.";
			default: return "Output the processed result in Markdown format.";
		}
	}
};
var executionCore = new ExecutionCore();
//#endregion
export { consumeCachedShareTargetPayload as A, setActiveInstruction as C, resolveAdminDoorUrls as D, openAdminDoorUrl as E, fetchSwCachedEntries as M, storeShareTargetPayloadToCache as N, getRuntimeSettings as O, getInstructionRegistry as S, openAdminDoorFromCore as T, addInstructions as _, recognizeByInstructions as a, getActiveInstructionText as b, recognizeImageData as c, getSvgGraphicsAddon as d, loadAISettings as f, addInstruction as g, getGPTInstance as h, processDataWithInstruction as i, fetchCachedShareFiles as j, loadSettings as k, getActiveCustomInstruction as l, extractEntities as m, actionHistory as n, analyzeRecognizeUnified as o, detectPlatform as p, createTemplateManager as r, convertTextualData as s, executionCore as t, getLanguageInstruction as u, deleteInstruction as v, updateInstruction as w, getCustomInstructions as x, getActiveInstruction as y };
