import { r as __exportAll } from "../chunks/rolldown-runtime.js";
//#region src/com/config/admin-doors.ts
var admin_doors_exports = /* @__PURE__ */ __exportAll({
	openAdminDoorFromCore: () => openAdminDoorFromCore,
	openAdminDoorUrl: () => openAdminDoorUrl,
	resolveAdminDoorUrls: () => resolveAdminDoorUrls
});
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
export { openAdminDoorFromCore as n, resolveAdminDoorUrls as r, admin_doors_exports as t };
