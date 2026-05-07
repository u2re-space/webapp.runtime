//#region ../../modules/views/airpad-view/src/utils/utils.ts
/** Airpad markup mount node (set on mount, cleared on unmount). Avoid `document.getElementById` — IDs may not be in the document tree (routed host, shadow, iframe). */
var airpadDomRoot = null;
function setAirpadDomRoot(root) {
	airpadDomRoot = root;
}
function getAirpadDomRoot() {
	return airpadDomRoot;
}
/** Document that owns the Airpad mount (correct when embedded in an iframe). */
function getAirpadOwnerDocument() {
	return airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
}
function byId(id) {
	const r = airpadDomRoot;
	if (!r) return null;
	try {
		return r.querySelector(`#${CSS.escape(id)}`);
	} catch {
		return null;
	}
}
/** Scoped `querySelector` under the current Airpad mount root. */
function queryAirpad(selector) {
	if (!airpadDomRoot) return null;
	return airpadDomRoot.querySelector(selector);
}
var getWsStatusEl = () => byId("wsStatus");
var getAirStatusEl = () => byId("airStatus");
var getAiStatusEl = () => byId("aiStatus");
var getLogEl = () => byId("logContainer");
var getVoiceTextEl = () => byId("voiceText");
var getVkStatusEl = () => byId("vkStatus");
var getBtnConnect = () => byId("btnConnect");
var getAirButton = () => byId("airButton");
var getAiButton = () => byId("aiButton");
var getAirNeighborButton = () => byId("airNeighborButton");
var getBtnCut = () => byId("btnCut");
var getBtnCopy = () => byId("btnCopy");
var getBtnPaste = () => byId("btnPaste");
var getClipboardPreviewEl = () => byId("clipboardPreview");
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
//#endregion
export { queryAirpad as _, getAirStatusEl as a, getBtnConnect as c, getBtnPaste as d, getClipboardPreviewEl as f, log as g, getWsStatusEl as h, getAirNeighborButton as i, getBtnCopy as l, getVoiceTextEl as m, getAiStatusEl as n, getAirpadDomRoot as o, getVkStatusEl as p, getAirButton as r, getAirpadOwnerDocument as s, getAiButton as t, getBtnCut as u, setAirpadDomRoot as v };
