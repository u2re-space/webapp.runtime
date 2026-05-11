//#region ../../modules/views/airpad-view/src/utils/utils.ts
/** Airpad markup mount node (set on mount, cleared on unmount). Avoid `document.getElementById` — IDs may not be in the document tree (routed host, shadow, iframe). */
var airpadDomRoot = null;
function byId(id) {
	const r = airpadDomRoot;
	if (!r) return null;
	try {
		return r.querySelector(`#${CSS.escape(id)}`);
	} catch {
		return null;
	}
}
var getWsStatusEl = () => byId("wsStatus");
var getLogEl = () => byId("logContainer");
function log(msg) {
	const doc = airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
	if (!doc) {
		console.log("[LOG]", msg);
		return;
	}
	const line = doc.createElement("div");
	line.textContent = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`;
	const logContainer = getLogEl();
	if (logContainer) {
		logContainer.appendChild(line);
		logContainer.scrollTop = logContainer.scrollHeight;
	}
	console.log("[LOG]", msg);
}
/** Called from websocket.ts at module load. */
function setAirpadCredentialInvalidator(fn) {}
//#endregion
export { getWsStatusEl as n, log as r, setAirpadCredentialInvalidator as t };
