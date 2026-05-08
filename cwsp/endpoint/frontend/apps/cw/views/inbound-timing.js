//#region src/shared/routing/core/view-inbound-timing.ts
function getViewHTMLElement(view) {
	try {
		if (typeof HTMLElement !== "undefined" && view instanceof HTMLElement) return view;
	} catch {}
	return null;
}
function payloadRecordContainsRenderableFiles(payload) {
	if (!payload || typeof payload !== "object") return false;
	const rec = payload;
	const hasFileLike = (v) => typeof File !== "undefined" && v instanceof File || typeof Blob !== "undefined" && v instanceof Blob;
	if (hasFileLike(rec.file) || hasFileLike(rec.blob)) return true;
	const files = rec.files;
	if (Array.isArray(files) && files.some((x) => hasFileLike(x))) return true;
	const attachments = rec.attachments;
	if (Array.isArray(attachments)) for (const a of attachments) {
		if (!a || typeof a !== "object") continue;
		const data = a.data;
		if (hasFileLike(data)) return true;
	}
	return false;
}
function payloadContainsRenderableFilesDeep(payload) {
	if (!payload || typeof payload !== "object") return false;
	const rec = payload;
	if (payloadRecordContainsRenderableFiles(rec)) return true;
	const nested = rec.data;
	if (nested && typeof nested === "object" && payloadRecordContainsRenderableFiles(nested)) return true;
	const topAtt = rec.attachments;
	if (Array.isArray(topAtt)) for (const a of topAtt) {
		if (!a || typeof a !== "object") continue;
		const data = a.data;
		if (typeof File !== "undefined" && data instanceof File || typeof Blob !== "undefined" && data instanceof Blob) return true;
	}
	return false;
}
var FILE_INGRESS_TYPES = new Set([
	"content-share",
	"share-target-input",
	"share-target-result",
	"content-attach",
	"file-attach"
]);
/** Narrow heuristic: ingress that carries blobs/files benefits from delayed delivery. */
function shouldDeferIngressForRenderableFiles(message, mappedType) {
	if (!FILE_INGRESS_TYPES.has(String(mappedType || "").toLowerCase())) return false;
	return payloadContainsRenderableFilesDeep(message);
}
/** Lightweight control handlers — skipping timing fences keeps sliders/toggles responsive. */
var SKIP_UNIFIED_INGRESS_TIMING = new Set([
	"settings-update",
	"history-update",
	"home-update"
]);
/**
* Most unified ingress paths should settle the host before calling `handleMessage`.
* WHY: Applies to viewer, Work Center attachments, explorer saves, staged mail, … not launch-queue-only.
*/
function shouldDeferUnifiedIngressUntilStable(_message, mappedType) {
	return !SKIP_UNIFIED_INGRESS_TIMING.has(String(mappedType || "").toLowerCase());
}
/** One frame + microtask — enough when the viewer host and sinks already exist (common for launch-queue bursts). */
async function quickPaintFence() {
	await new Promise((resolve) => requestAnimationFrame(() => resolve()));
	await new Promise((resolve) => queueMicrotask(resolve));
}
/**
* Softer barrier when the DOM still needs layout (first paint / route change): double RAF without an extra idle delay.
*/
async function stepPaintFenceModerate() {
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	await new Promise((resolve) => queueMicrotask(resolve));
}
var MO_CONNECTED_MS = 220;
var MO_SINK_MS = 280;
/** Cap how long we wait on enter transitions so a burst of opens still reaches the latest file quickly. */
var ANIM_CAP_DEFAULT_MS = 160;
var ANIM_CAP_HOT_PATH_MS = 90;
/** Minimal shell (no HTMLElement view host): one frame before mutating viewer state — was too slow with full fence. */
async function settleIngressPaintForMinimalShell() {
	await quickPaintFence();
}
async function waitUntilViewConnectedToDocument(view, timeoutMs = MO_CONNECTED_MS) {
	const el = getViewHTMLElement(view);
	if (!el) return;
	if (el.isConnected) return;
	const rootEl = typeof document !== "undefined" && document.documentElement instanceof HTMLElement ? document.documentElement : null;
	if (!rootEl) return;
	await new Promise((resolve) => {
		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			try {
				mo.disconnect();
			} catch {}
			clearTimeout(tid);
			resolve();
		};
		const mo = new MutationObserver(() => {
			if (el.isConnected) finish();
		});
		mo.observe(rootEl, {
			childList: true,
			subtree: true
		});
		const tid = setTimeout(finish, timeoutMs);
	});
}
var RENDER_SINK_SELECTORS = ["[data-render-target]", "[data-raw-target]"];
function shallowSinkPresent(host) {
	for (const sel of RENDER_SINK_SELECTORS) try {
		if (host.querySelector(sel)) return true;
		if (host.shadowRoot?.querySelector(sel)) return true;
	} catch {}
	return false;
}
function needsRenderableSinkWait(mappedType, message) {
	const mt = String(mappedType || "").toLowerCase();
	if (mt === "content-load" || mt === "markdown-content" || mt === "content-view") return true;
	return shouldDeferIngressForRenderableFiles(message, mappedType);
}
async function waitForRenderableSinkMounted(view, timeoutMs = MO_SINK_MS) {
	const el = getViewHTMLElement(view);
	if (!el) return;
	if (shallowSinkPresent(el)) return;
	await new Promise((resolve) => {
		let done = false;
		const observers = [];
		const finish = () => {
			if (done) return;
			done = true;
			for (const ob of observers) try {
				ob.disconnect();
			} catch {}
			clearTimeout(tid);
			resolve();
		};
		const onMut = () => {
			if (shallowSinkPresent(el)) finish();
		};
		const watch = (root) => {
			const mo = new MutationObserver(onMut);
			mo.observe(root, {
				childList: true,
				subtree: true
			});
			observers.push(mo);
		};
		watch(el);
		if (el.shadowRoot) watch(el.shadowRoot);
		const tid = setTimeout(finish, timeoutMs);
		onMut();
	});
}
async function waitRunningSubtreeAnimations(view, hangMs = ANIM_CAP_DEFAULT_MS) {
	const el = getViewHTMLElement(view);
	if (!el?.isConnected) return;
	try {
		const getAnims = typeof el.getAnimations === "function" ? el.getAnimations.bind(el) : null;
		const anims = getAnims ? getAnims({ subtree: true }).filter((a) => a.playState === "running") : [];
		if (anims.length === 0) return;
		await Promise.race([Promise.all(anims.map((a) => typeof a?.finished?.then === "function" ? a.finished.catch(() => void 0) : Promise.resolve())), new Promise((resolve) => setTimeout(resolve, hangMs))]);
	} catch {}
}
/** Full settle pipeline before `handleMessage` on HTMLElement-backed hosts. */
async function settleIngressTargetBeforeDelivery(view, message, mappedType) {
	const el = getViewHTMLElement(view);
	const needSink = needsRenderableSinkWait(mappedType, message);
	if (Boolean(el?.isConnected && (!needSink || shallowSinkPresent(el)))) {
		await quickPaintFence();
		await waitRunningSubtreeAnimations(view, ANIM_CAP_HOT_PATH_MS);
		return;
	}
	await stepPaintFenceModerate();
	await waitUntilViewConnectedToDocument(view, MO_CONNECTED_MS);
	if (needSink) await waitForRenderableSinkMounted(view, MO_SINK_MS);
	await waitRunningSubtreeAnimations(view, ANIM_CAP_DEFAULT_MS);
	await quickPaintFence();
}
var ingressDeliveryChains = /* @__PURE__ */ new WeakMap();
/** Serialize ingress bursts per concrete View identity (HTMLElement instance). */
function scheduleSerialViewIngressDelivery(view, task) {
	const next = (ingressDeliveryChains.get(view) ?? Promise.resolve()).then(() => task()).catch((err) => {
		console.warn("[ViewIngress] delivery failed:", view?.id, err);
	});
	ingressDeliveryChains.set(view, next);
	return next;
}
//#endregion
export { shouldDeferUnifiedIngressUntilStable as i, settleIngressPaintForMinimalShell as n, settleIngressTargetBeforeDelivery as r, scheduleSerialViewIngressDelivery as t };
