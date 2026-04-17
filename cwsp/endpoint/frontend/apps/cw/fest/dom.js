import { D as $avoidTrigger, I as hasValue, J as normalizePrimitive, K as isValueUnit, L as isArrayOrIterable, S as resolveLocalPointToGridCell, W as isVal, X as tryStringAsNumber, b as normalizeGridLayout, j as camelToKebab, q as kebabToCamel } from "./object.js";
//#region shared/fest/dom/agate/Properties.ts
var __registeredCssProperties = /* @__PURE__ */ new Set();
[
	{
		name: "--screen-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--screen-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--visual-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--visual-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--clip-ampl",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--clip-freq",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--avail-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--avail-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--pixel-ratio",
		syntax: "<number>",
		inherits: true,
		initialValue: "1"
	},
	{
		name: "--percent",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--percent-x",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--percent-y",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--scroll-left",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--scroll-top",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--drag-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--drag-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--resize-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--shift-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--shift-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	}
].forEach((options) => {
	if (typeof CSS == "undefined" || typeof CSS?.registerProperty != "function") return;
	const name = String(options?.name || "").trim();
	if (!name || __registeredCssProperties.has(name)) return;
	try {
		CSS.registerProperty(options);
	} catch (e) {
		if (!(String(e?.name || "").toLowerCase() === "invalidmodificationerror")) console.warn(e);
	} finally {
		__registeredCssProperties.add(name);
	}
});
//#endregion
//#region shared/fest/dom/agate/Utils.ts
var createIdleDeadlineFallback = () => ({
	didTimeout: false,
	timeRemaining: () => 0
});
var runWhenIdle$1 = (cb, timeout = 1e3) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb(createIdleDeadlineFallback()), 0);
};
var makeRAFCycle = () => {
	const control = {
		canceled: false,
		rAFs: /* @__PURE__ */ new Set(),
		last: null,
		cancel() {
			this.canceled = true;
			cancelAnimationFrame(this.last);
			return this;
		},
		shedule(cb) {
			this.rAFs.add(cb);
			return this;
		}
	};
	(async () => {
		while (!control?.canceled) {
			await Promise.all((control?.rAFs?.values?.() ?? [])?.map?.((rAF) => Promise.try(rAF)?.catch?.(console.warn.bind(console))));
			control.rAFs?.clear?.();
			if (typeof requestAnimationFrame != "undefined") await new Promise((res) => {
				control.last = requestAnimationFrame(res);
			});
			else await new Promise((res) => {
				setTimeout(res, 16);
			});
		}
	})();
	return control;
};
var RAFBehavior = (shed = makeRAFCycle()) => {
	return (cb) => shed.shedule(cb);
};
typeof document != "undefined" && document?.documentElement;
var setAttributesIfNull = (element, attrs = {}) => {
	if (!attrs || typeof attrs != "object" || !element) return;
	return Array.from(Object.entries(attrs)).map(([name, value]) => {
		const old = element.getAttribute(name);
		if (value == null) element.removeAttribute(name);
		else if (value != old) element.setAttribute(name, old == "" ? value ?? old : old ?? value);
	});
};
var throttleMap = /* @__PURE__ */ new Map();
var setIdleInterval = (cb, timeout = 1e3, ...args) => {
	const status = {
		running: true,
		cancel: () => {
			status.running = false;
		}
	};
	runWhenIdle$1(async () => {
		if (!cb || typeof cb != "function") return;
		while (status.running) {
			await Promise.all([Promise.try(cb, ...args), new Promise((r) => setTimeout(r, timeout))]).catch?.(console.warn.bind(console));
			await Promise.any([new Promise((r) => runWhenIdle$1(r, timeout)), new Promise((r) => setTimeout(r, timeout))]);
		}
		status.cancel = () => {};
	}, { timeout });
	return status?.cancel;
};
if (typeof requestAnimationFrame != "undefined") requestAnimationFrame(async () => {
	while (true) {
		throttleMap.forEach((cb) => cb?.());
		await new Promise((r) => requestAnimationFrame(r));
	}
});
var setChecked = (input, value, ev) => {
	if (value != null && input.checked != value) if (input?.["type"] == "checkbox" || input?.["type"] == "radio" && !input?.checked) {
		input?.click?.();
		ev?.preventDefault?.();
	} else {
		input.checked = !!value;
		input?.dispatchEvent?.(new Event("change", {
			bubbles: true,
			cancelable: true
		}));
	}
};
var isValidParent = (parent) => {
	return parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement) ? parent : null;
};
var indexOf = (element, node) => {
	if (element == null || node == null) return -1;
	return Array.from(element?.childNodes ?? [])?.indexOf?.(node) ?? -1;
};
var createElementVanilla = (selector) => {
	if (selector == ":fragment:") return document.createDocumentFragment();
	const create = document.createElement.bind(document);
	for (var node = create("div"), match, className = ""; selector && (match = selector.match("^(?:(-?[_a-zA-Z]+[_a-zA-Z0-9-]*))|^#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?:([*$|~^]?=)([\"'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]"));) {
		if (match[1]) node = create(match[1]);
		if (match[2]) node.id = match[2];
		if (match[3]) className += " " + match[3];
		if (match[4]) node.setAttribute(match[4], match[7] || "");
		selector = selector.slice(match[0].length);
	}
	if (className) node.className = className.slice(1);
	return node;
};
var isElement = (el) => {
	return el != null && (el instanceof Node || el instanceof Text || el instanceof Element || el instanceof Comment || el instanceof HTMLElement || el instanceof DocumentFragment) ? el : null;
};
var hasParent = (current, parent) => {
	while (current) {
		if (!(current?.element ?? current)) return false;
		if ((current?.element ?? current) === (parent?.element ?? parent)) return true;
		current = current.parentElement ?? (current.parentNode == current?.getRootNode?.({ composed: true }) ? current?.getRootNode?.({ composed: true })?.host : current?.parentNode);
	}
};
var passiveOpts$1 = {};
function addEvent(target, type, cb, opts = passiveOpts$1) {
	target?.addEventListener?.(type, cb, opts);
	const wr = typeof target == "object" || typeof target == "function" && !target?.deref ? new WeakRef(target) : target;
	return () => wr?.deref?.()?.removeEventListener?.(type, cb, opts);
}
function removeEvent(target, type, cb, opts = passiveOpts$1) {
	target?.removeEventListener?.(type, cb, opts);
}
var addEvents = (root, handlers) => {
	root = root instanceof WeakRef ? root.deref() : root;
	return [...Object.entries(handlers)]?.map?.(([name, cb]) => Array.isArray(cb) ? addEvent(root, name, ...cb) : addEvent(root, name, cb));
};
var addEventsList = (el, events) => {
	if (events) {
		let entries = events;
		if (events instanceof Map) entries = [...events.entries()];
		else entries = [...Object.entries(events)];
		return entries.map(([name, list]) => ((isArrayOrIterable(list) ? [...list] : list) ?? [])?.map?.((cbs) => {
			return addEvent(el, name, cbs);
		}));
	}
};
var containsOrSelf = (a, b, ev) => {
	if (b == null || !(b instanceof Node) && b?.element == null) return false;
	if (a == b || (a?.element ?? a) == (b?.element ?? b)) return true;
	if (ev?.composedPath && typeof ev.composedPath === "function") {
		const path = ev.composedPath();
		const aEl = a?.element ?? a;
		const bEl = b?.element ?? b;
		if (path.includes(aEl) && path.includes(bEl)) {
			const aIndex = path.indexOf(aEl);
			const bIndex = path.indexOf(bEl);
			if (bIndex >= 0 && aIndex >= 0 && bIndex < aIndex) return true;
		}
	}
	if (a?.contains?.(b?.element ?? b) || a?.getRootNode({ composed: true })?.host == (b?.element ?? b)) return true;
	return false;
};
var MOCElement = (element, selector, ev) => {
	if (ev?.composedPath && typeof ev.composedPath === "function") {
		const path = ev.composedPath();
		for (const node of path) if (node instanceof HTMLElement || node instanceof Element) {
			if (node.matches?.(selector)) return node;
		}
	}
	const self = element?.matches?.(selector) ? element : null;
	const host = (element?.getRootNode({ composed: true }) ?? element?.parentElement?.getRootNode({ composed: true }))?.host;
	const hostMatched = host?.matches?.(selector) ? host : null;
	const closest = element?.closest?.(selector) ?? self?.closest?.(selector) ?? hostMatched?.closest?.(selector) ?? null;
	return self ?? closest ?? hostMatched;
};
var isInFocus = (element, selectorOrElement, dir = "parent") => {
	if (!element) return false;
	if (element.checkVisibility && !element.checkVisibility({
		checkOpacity: true,
		checkVisibilityCSS: true
	})) return false;
	if (!element.checkVisibility && element.offsetParent === null && element.style.position !== "fixed") return false;
	let active = document.activeElement;
	while (active && active.shadowRoot && active.shadowRoot.activeElement) active = active.shadowRoot.activeElement;
	const isFocused = active === element || hasParent(active, element);
	const isHovered = element.matches(":hover");
	if (!isFocused && !isHovered && !selectorOrElement) return false;
	if (selectorOrElement) {
		if (typeof selectorOrElement === "string") if (dir === "parent") return !!MOCElement(element, selectorOrElement);
		else {
			const altCnd = !!MOCElement(isFocused ? active : element.querySelector(":hover") || element, selectorOrElement);
			return element?.querySelector?.(selectorOrElement) != null || element?.matches?.(selectorOrElement) || altCnd;
		}
		else if (selectorOrElement instanceof HTMLElement) if (dir === "parent") return hasParent(element, selectorOrElement) || false;
		else return hasParent(selectorOrElement, element) || false;
	}
	return true;
};
//#endregion
//#region shared/fest/dom/agate/Zoom.ts
var zoomValues = /* @__PURE__ */ new WeakMap();
var zoomOf = (element = document.documentElement) => {
	return zoomValues.getOrInsertComputed(element, () => {
		const container = (element?.matches?.(".ui-orientbox") ? element : null) || element?.closest?.(".ui-orientbox") || document.body;
		if (container?.zoom) return container?.zoom || 1;
		if (element?.currentCSSZoom) return element?.currentCSSZoom || 1;
	});
};
var fixedClientZoom = (element = document.documentElement) => {
	return (element?.currentCSSZoom != null ? 1 : zoomOf(element)) || 1;
};
var orientOf = (element = document.documentElement) => {
	const container = (element?.matches?.("[orient], [data-mixin=\"ui-orientbox\"]") ? element : null) || element?.closest?.("[orient], [data-mixin=\"ui-orientbox\"]") || element;
	if (container?.hasAttribute?.("orient")) return parseInt(container?.getAttribute?.("orient") || "0") || 0;
	return container?.orient || 0;
};
//#endregion
//#region shared/fest/dom/agate/Viewport.ts
var runWhenIdle = (cb, timeout = 100) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb({
		didTimeout: false,
		timeRemaining: () => 0
	}), 0);
};
var getAvailSize = () => {
	const l = typeof matchMedia != "undefined" ? matchMedia("(orientation: landscape)")?.matches : false;
	const vv = typeof window !== "undefined" ? window.visualViewport : null;
	const vvBlock = vv ? {
		"--vv-width": `${vv.width}px`,
		"--vv-height": `${vv.height}px`,
		"--vv-offset-left": `${vv.offsetLeft}px`,
		"--vv-offset-top": `${vv.offsetTop}px`,
		"--vv-scale": String(vv.scale ?? 1)
	} : {
		"--vv-width": typeof window !== "undefined" ? `${window.innerWidth}px` : "0px",
		"--vv-height": typeof window !== "undefined" ? `${window.innerHeight}px` : "0px",
		"--vv-offset-left": "0px",
		"--vv-offset-top": "0px",
		"--vv-scale": "1"
	};
	if (typeof screen != "undefined") {
		const aw = screen?.availWidth + "px";
		const ah = screen?.availHeight + "px";
		return {
			"--screen-width": Math.min(screen?.width, screen?.availWidth) + "px",
			"--screen-height": Math.min(screen?.height, screen?.availHeight) + "px",
			"--avail-width": l ? ah : aw,
			"--avail-height": l ? aw : ah,
			"--view-height": Math.min(screen?.availHeight, window?.innerHeight) + "px",
			"--pixel-ratio": String(devicePixelRatio || 1),
			...vvBlock
		};
	}
	return {
		"--screen-width": "0px",
		"--screen-height": "0px",
		"--avail-width": "0px",
		"--avail-height": "0px",
		"--view-height": "0px",
		"--pixel-ratio": "1",
		...vvBlock
	};
};
var availSize = getAvailSize();
var orientationNumberMap = {
	"portrait-primary": 0,
	"landscape-primary": 1,
	"portrait-secondary": 2,
	"landscape-secondary": 3
};
var updateVP = (ev) => {
	const rule = document.documentElement;
	Object.assign(availSize, getAvailSize());
	Object.entries(availSize).forEach(([propName, propValue]) => {
		const exists = rule?.style?.getPropertyValue(propName);
		if (!exists || exists != propValue) rule?.style?.setProperty?.(propName, propValue || "", "");
	});
	document.documentElement.style.setProperty("--orientation-secondary", screen?.orientation?.type?.endsWith?.("secondary") ? "1" : "0");
};
var getCorrectOrientation = () => {
	let orientationType = screen?.orientation?.type || "portrait-primary";
	if (!globalThis.matchMedia("((display-mode: fullscreen) or (display-mode: standalone) or (display-mode: window-controls-overlay))").matches) {
		if (matchMedia("(orientation: portrait)").matches) orientationType = orientationType.replace("landscape", "portrait");
		else if (matchMedia("(orientation: landscape)").matches) orientationType = orientationType.replace("portrait", "landscape");
	}
	return orientationType;
};
var passiveOpts = { passive: true };
var whenAnyScreenChanges = (cb) => {
	let ticking = false;
	const update = () => {
		if (!ticking) {
			requestAnimationFrame(() => {
				updateVP();
				cb();
				ticking = false;
			});
			ticking = true;
		}
	};
	const unsubscribers = [];
	unsubscribers.push(addEvent(navigator?.virtualKeyboard, "geometrychange", update, passiveOpts));
	unsubscribers.push(addEvent(window?.visualViewport, "scroll", update, passiveOpts));
	unsubscribers.push(addEvent(window?.visualViewport, "resize", update, passiveOpts));
	unsubscribers.push(addEvent(screen?.orientation, "change", update));
	unsubscribers.push(addEvent(window, "resize", update));
	unsubscribers.push(addEvent(document?.documentElement, "fullscreenchange", update));
	unsubscribers.push(addEvent(document, "DOMContentLoaded", update));
	unsubscribers.push(addEvent(matchMedia("(orientation: portrait)"), "change", update));
	unsubscribers.push(addEvent(matchMedia("(orientation: landscape)"), "change", update));
	update();
	runWhenIdle(() => update(), 100);
	return () => unsubscribers.forEach((unsub) => unsub());
};
var fixOrientToScreen = (element) => {
	if (!element?.classList?.contains?.("native-portrait-optimized")) {
		element?.classList?.add?.("native-portrait-optimized");
		return whenAnyScreenChanges(() => {
			const next = orientationNumberMap?.[getCorrectOrientation()] ?? 0;
			element.orient = next;
			element.setAttribute?.("orient", String(next));
			element.style?.setProperty?.("--orient", String(next));
		});
	}
};
new OffscreenCanvas(1, 1).getContext("2d");
//#endregion
//#region shared/fest/dom/agate/LauncherGrid.ts
/** Read `data-grid-columns` / `data-grid-rows` with optional JS override. */
var readLauncherLayoutFromElement = (el, layoutOverride) => {
	const c = parseInt(el.getAttribute("data-grid-columns") || "", 10);
	const r = parseInt(el.getAttribute("data-grid-rows") || "", 10);
	const base = normalizeGridLayout(layoutOverride ?? [4, 8]);
	return [Number.isFinite(c) && c > 0 ? c : base[0], Number.isFinite(r) && r > 0 ? r : base[1]];
};
/**
* Map viewport client coordinates to grid cell `[col, row]` (collision-aware via `redirectCell`).
* `gridSystem` should live under a `ui-orientbox` (or carry `orient`) so `orientOf` is correct.
*/
var resolveGridCellFromClientPoint = (gridSystem, clientPoint, args, mode = "floor") => {
	if (!gridSystem) return [0, 0];
	const rect = gridSystem.getBoundingClientRect?.();
	if (!rect) return [0, 0];
	const layout = readLauncherLayoutFromElement(gridSystem, args?.layout);
	const orient = orientOf(gridSystem);
	const cs = globalThis.getComputedStyle?.(gridSystem);
	const pl = parseFloat(cs?.paddingLeft) || 0;
	const pt = parseFloat(cs?.paddingTop) || 0;
	const pr = parseFloat(cs?.paddingRight) || 0;
	const pb = parseFloat(cs?.paddingBottom) || 0;
	const contentW = Math.max(1, (rect.width || gridSystem.clientWidth || 1) - pl - pr);
	const contentH = Math.max(1, (rect.height || gridSystem.clientHeight || 1) - pt - pb);
	return resolveLocalPointToGridCell([(clientPoint?.[0] || 0) - rect.left - pl, (clientPoint?.[1] || 0) - rect.top - pt], [contentW, contentH], layout, orient, {
		mode,
		redirect: {
			item: args?.item,
			list: args?.list,
			items: args?.items
		}
	});
};
//#endregion
//#region shared/fest/dom/mixin/Style.ts
/** Constructable stylesheets are unavailable in some runtimes (e.g. extension service workers). */
var supportsConstructableStylesheet = () => typeof globalThis !== "undefined" && typeof globalThis.CSSStyleSheet === "function";
/** `CSSStyleSheet.replaceSync()` rejects CSS containing `@import` (constructable sheet limitation). */
var cssTextRequiresInlineStyleElement = (css) => typeof css === "string" && /@import\b/i.test(css);
var OWNER = "DOM", styleElement = typeof document != "undefined" ? document.createElement("style") : null;
if (styleElement) {
	typeof document != "undefined" && document.querySelector("head")?.appendChild?.(styleElement);
	styleElement.dataset.owner = OWNER;
}
var setStyleURL = (base, url, layer = "") => {
	base[0][base[1]] = base[1] == "innerHTML" ? `@import url("${url}") ${layer && typeof layer == "string" ? `layer(${layer})` : ""};` : url;
};
var hasTypedOM = typeof CSSStyleValue !== "undefined" && typeof CSSUnitValue !== "undefined";
var isStyleValue = (val) => hasTypedOM && val instanceof CSSStyleValue;
var isUnitValue = (val) => hasTypedOM && val instanceof CSSUnitValue;
var setPropertyIfNotEqual = (styleRef, kebab, value, importance = "") => {
	if (!styleRef || !kebab) return;
	if (value == null) {
		if (styleRef.getPropertyValue(kebab) !== "") styleRef.removeProperty(kebab);
		return;
	}
	if (styleRef.getPropertyValue(kebab) !== value) styleRef.setProperty(kebab, value, importance);
};
var setStylePropertyTyped = (element, name, value, importance = "") => {
	if (!element || !name) return element;
	const kebab = camelToKebab(name);
	const styleRef = element.style;
	const styleMapRef = element.attributeStyleMap ?? element.styleMap;
	if (!hasTypedOM || !styleMapRef) return setStylePropertyFallback(element, name, value, importance);
	let val = hasValue(value) && !(isStyleValue(value) || isUnitValue(value)) ? value?.value : value;
	if (val == null) {
		styleMapRef.delete?.(kebab);
		if (styleRef) setPropertyIfNotEqual(styleRef, kebab, null, importance);
		return element;
	}
	if (isStyleValue(val)) {
		const old = styleMapRef.get(kebab);
		if (isUnitValue(val) && isUnitValue(old)) {
			if (old.value === val.value && old.unit === val.unit) return element;
		} else if (old === val) return element;
		styleMapRef.set(kebab, val);
		return element;
	}
	if (typeof val === "number") if (CSS?.number && !kebab.startsWith("--")) {
		const newVal = CSS.number(val);
		const old = styleMapRef.get(kebab);
		if (isUnitValue(old) && old.value === newVal.value && old.unit === newVal.unit) return element;
		styleMapRef.set(kebab, newVal);
		return element;
	} else {
		setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
		return element;
	}
	if (typeof val === "string" && !isStyleValue(val)) {
		const maybeNum = tryStringAsNumber(val);
		if (typeof maybeNum === "number" && CSS?.number && !kebab.startsWith("--")) {
			const newVal = CSS.number(maybeNum);
			const old = styleMapRef.get(kebab);
			if (isUnitValue(old) && old.value === newVal.value && old.unit === newVal.unit) return element;
			styleMapRef.set(kebab, newVal);
			return element;
		} else {
			setPropertyIfNotEqual(styleRef, kebab, val, importance);
			return element;
		}
	}
	setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
	return element;
};
var setStylePropertyFallback = (element, name, value, importance = "") => {
	if (!element || !name) return element;
	const kebab = camelToKebab(name);
	const styleRef = element.style;
	if (!styleRef) return element;
	let val = hasValue(value) && !(isStyleValue(value) || isUnitValue(value)) ? value?.value : value;
	if (typeof val === "string" && !isStyleValue(val)) val = tryStringAsNumber(val) ?? val;
	if (val == null) {
		setPropertyIfNotEqual(styleRef, kebab, null, importance);
		return element;
	}
	if (isStyleValue(val)) {
		setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
		return element;
	}
	if (typeof val === "number") {
		setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
		return element;
	}
	setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
	return element;
};
var promiseOrDirect = (promise, cb) => {
	if (typeof promise?.then == "function") return promise?.then?.(cb);
	return cb(promise);
};
var blobURLMap = /* @__PURE__ */ new WeakMap();
var cacheMap = /* @__PURE__ */ new Map();
var fetchAndCache = (url) => {
	if (!url) return null;
	if (cacheMap.has(url)) return cacheMap.get(url);
	if (url instanceof Blob || url instanceof File) {
		if (blobURLMap.has(url)) return blobURLMap.get(url);
		const burl = URL.createObjectURL(url);
		blobURLMap.set(url, burl);
		cacheMap.set(burl, burl);
		return burl;
	}
	if (URL.canParse(url) || url?.trim?.()?.startsWith?.("./")) {
		const promised = fetch(url?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (res) => {
			const blob = await res.blob();
			const burl = URL.createObjectURL(blob);
			blobURLMap.set(blob, burl);
			cacheMap.set(url, burl);
			cacheMap.set(burl, burl);
			return burl;
		});
		cacheMap.set(url, promised);
		return promised;
	}
	if (typeof url == "string") {
		const blob = new Blob([url], { type: "text/css" });
		const burl = URL.createObjectURL(blob);
		blobURLMap.set(blob, burl);
		cacheMap.set(burl, burl);
		return burl;
	}
	return url;
};
var cacheContentMap = /* @__PURE__ */ new Map();
var cacheBlobContentMap = /* @__PURE__ */ new WeakMap();
var fetchAsInline = (url) => {
	if (!url) return "";
	if (cacheContentMap.has(url)) return cacheContentMap.get(url) ?? "";
	if (url instanceof Blob || url instanceof File) {
		if (cacheBlobContentMap.has(url)) return cacheBlobContentMap.get(url) ?? "";
		const promised = url?.text?.()?.then?.((text) => {
			cacheBlobContentMap.set(url, text);
			return text;
		});
		cacheBlobContentMap.set(url, promised);
		return promised;
	}
	if (URL.canParse(url) || url?.trim?.()?.startsWith?.("./")) {
		const promised = fetch(url?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (res) => {
			const text = await res.text();
			cacheContentMap.set(url, text);
			return text;
		});
		cacheContentMap.set(url, promised);
		return promised;
	}
	if (typeof url == "string") {
		cacheContentMap.set(url, url);
		return url;
	}
	return url;
};
var adoptedSelectorMap = /* @__PURE__ */ new Map();
var adoptedShadowSelectorMap = /* @__PURE__ */ new WeakMap();
var adoptedLayerMap = /* @__PURE__ */ new Map();
var adoptedShadowLayerMap = /* @__PURE__ */ new WeakMap();
var getAdoptedStyleRule = (selector, layerName = "ux-query", basis = null) => {
	if (!selector) return null;
	if (!supportsConstructableStylesheet()) return null;
	const root = basis instanceof ShadowRoot ? basis : basis?.getRootNode ? basis.getRootNode({ composed: true }) : null;
	const isShadowRoot = root instanceof ShadowRoot;
	const targetAdoptedSheets = isShadowRoot ? root.adoptedStyleSheets : typeof document != "undefined" ? document.adoptedStyleSheets : null;
	if (!targetAdoptedSheets) return null;
	const selectorKey = `${layerName || ""}:${selector}`;
	let sheet;
	if (isShadowRoot) {
		let shadowMap = adoptedShadowSelectorMap.get(root);
		if (!shadowMap) {
			shadowMap = /* @__PURE__ */ new Map();
			adoptedShadowSelectorMap.set(root, shadowMap);
		}
		sheet = shadowMap.get(selectorKey);
		if (!sheet) {
			sheet = new CSSStyleSheet();
			shadowMap.set(selectorKey, sheet);
			if (!targetAdoptedSheets.includes(sheet)) targetAdoptedSheets.push(sheet);
		}
	} else {
		sheet = adoptedSelectorMap.get(selectorKey);
		if (!sheet) {
			sheet = new CSSStyleSheet();
			adoptedSelectorMap.set(selectorKey, sheet);
			if (!targetAdoptedSheets.includes(sheet)) targetAdoptedSheets.push(sheet);
		}
	}
	if (layerName) {
		let layerRule;
		if (isShadowRoot) {
			let shadowLayerMap = adoptedShadowLayerMap.get(root);
			if (!shadowLayerMap) {
				shadowLayerMap = /* @__PURE__ */ new Map();
				adoptedShadowLayerMap.set(root, shadowLayerMap);
			}
			layerRule = shadowLayerMap.get(layerName);
		} else layerRule = adoptedLayerMap.get(layerName);
		if (!layerRule) {
			const rules = Array.from(sheet.cssRules || []);
			const layerIndex = rules.findIndex((rule) => rule instanceof CSSLayerBlockRule && rule.name === layerName);
			if (layerIndex === -1) try {
				sheet.insertRule(`@layer ${layerName} {}`, sheet.cssRules.length);
				const newRule = sheet.cssRules[sheet.cssRules.length - 1];
				if (newRule instanceof CSSLayerBlockRule) layerRule = newRule;
			} catch (e) {
				layerRule = void 0;
			}
			else layerRule = rules[layerIndex];
			if (layerRule) if (isShadowRoot) {
				let shadowLayerMap = adoptedShadowLayerMap.get(root);
				if (!shadowLayerMap) {
					shadowLayerMap = /* @__PURE__ */ new Map();
					adoptedShadowLayerMap.set(root, shadowLayerMap);
				}
				shadowLayerMap.set(layerName, layerRule);
			} else adoptedLayerMap.set(layerName, layerRule);
		}
		if (layerRule) {
			let layerRuleIndex = Array.from(layerRule.cssRules || []).findIndex((r) => r instanceof CSSStyleRule && r.selectorText?.trim?.() === selector?.trim?.());
			if (layerRuleIndex === -1) try {
				layerRuleIndex = layerRule.insertRule(`${selector} {}`, layerRule.cssRules.length);
			} catch (e) {
				return null;
			}
			return layerRule.cssRules[layerRuleIndex];
		}
	}
	let ruleIndex = Array.from(sheet.cssRules || []).findIndex((rule) => rule instanceof CSSStyleRule && rule.selectorText?.trim?.() === selector?.trim?.());
	if (ruleIndex === -1) try {
		ruleIndex = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
	} catch (e) {
		return null;
	}
	const rule = sheet.cssRules[ruleIndex];
	if (rule instanceof CSSStyleRule) return rule;
	return null;
};
var setStyleProperty = (element, name, value, importance = "") => {
	return hasTypedOM ? setStylePropertyTyped(element, name, value, importance) : setStylePropertyFallback(element, name, value, importance);
};
var loadStyleSheet = (inline, base, layer = "", integrity) => {
	const load = fetchAndCache(inline);
	const url = typeof inline == "string" ? URL.canParse(inline) ? inline : load : load;
	if (base?.[0]) base[0].fetchPriority = "high";
	if (base && url && typeof url == "string") setStyleURL(base, url, layer);
	if (base?.[0] && (!URL.canParse(inline) || integrity) && base?.[0] instanceof HTMLLinkElement) {}
	return promiseOrDirect(load, (res) => {
		if (base?.[0] && res) {
			setStyleURL(base, res, layer);
			base?.[0].setAttribute("loaded", "");
		}
	})?.catch?.((error) => {
		console.warn("Failed to load style sheet:", error);
	});
};
var loadBlobStyle = (inline) => {
	const style = typeof document != "undefined" ? document.createElement("link") : null;
	if (style) style.fetchPriority = "high";
	if (style) {
		Object.assign(style, {
			rel: "stylesheet",
			type: "text/css",
			crossOrigin: "same-origin"
		});
		style.dataset.owner = OWNER;
		loadStyleSheet(inline, [style, "href"]);
		typeof document != "undefined" && document.head.append(style);
		return style;
	}
	return null;
};
var loadInlineStyle = (inline, rootElement = typeof document != "undefined" ? document?.head : null, layer = "") => {
	const PLACE = rootElement?.querySelector?.("head") ?? rootElement;
	if (typeof HTMLHeadElement != "undefined" && PLACE instanceof HTMLHeadElement) return loadBlobStyle(inline);
	const style = typeof document != "undefined" ? document.createElement("style") : null;
	if (style) {
		style.dataset.owner = OWNER;
		loadStyleSheet(inline, [style, "innerHTML"], layer);
		PLACE?.prepend?.(style);
		return style;
	}
	return null;
};
var preloadStyle = (styles) => {
	return loadAsAdopted(styles, "");
};
var adoptedMap = /* @__PURE__ */ new Map();
var adoptedBlobMap = /* @__PURE__ */ new WeakMap();
var applyAdoptedStyleText = (sheet, cssText) => {
	if (!sheet || !cssText) return false;
	try {
		sheet.replaceSync(cssText);
		return true;
	} catch (error) {
		const message = String(error?.message || "").toLowerCase();
		if (!(message.includes("@import rules are not allowed") || message.includes("@import") && message.includes("not allowed"))) console.warn("[DOM] Failed to apply adopted stylesheet:", error);
		return false;
	}
};
var loadAsAdopted = (styles, layerName = null) => {
	if (!supportsConstructableStylesheet()) {
		if (typeof styles === "string") loadInlineStyle(styles, void 0, layerName || "");
		return null;
	}
	if (typeof styles === "string" && cssTextRequiresInlineStyleElement(styles)) {
		loadInlineStyle(styles, void 0, layerName || "");
		return null;
	}
	if (typeof styles == "string" && adoptedMap?.has?.(styles)) {
		const cached = adoptedMap.get(styles);
		if (typeof document !== "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(cached)) document.adoptedStyleSheets.push(cached);
		return cached;
	}
	if ((styles instanceof Blob || styles instanceof File) && adoptedBlobMap?.has?.(styles)) {
		const cached = adoptedBlobMap.get(styles);
		if (typeof document !== "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(cached)) document.adoptedStyleSheets.push(cached);
		return cached;
	}
	if (!styles) return null;
	const sheet = typeof styles == "string" ? adoptedMap.getOrInsertComputed(styles, (styles) => new CSSStyleSheet()) : adoptedBlobMap.getOrInsertComputed(styles, (styles) => new CSSStyleSheet());
	if (typeof document != "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(sheet)) document.adoptedStyleSheets.push(sheet);
	if (typeof styles == "string" && !URL.canParse(styles)) {
		const layerWrapped = layerName ? `@layer ${layerName} { ${styles} }` : styles;
		adoptedMap.set(styles, sheet);
		if (!applyAdoptedStyleText(sheet, layerWrapped)) {
			removeAdopted(sheet);
			adoptedMap.delete(styles);
			loadInlineStyle(styles);
		}
		return sheet;
	} else promiseOrDirect(fetchAsInline(styles), (cached) => {
		adoptedMap.set(cached, sheet);
		if (cached) {
			if (cssTextRequiresInlineStyleElement(cached)) {
				removeAdopted(sheet);
				adoptedMap.delete(cached);
				adoptedBlobMap.delete(styles);
				loadInlineStyle(cached, void 0, layerName || "");
				return sheet;
			}
			if (!applyAdoptedStyleText(sheet, layerName ? `@layer ${layerName} { ${cached} }` : cached)) {
				removeAdopted(sheet);
				adoptedMap.delete(cached);
				adoptedBlobMap.delete(styles);
				loadInlineStyle(cached, void 0, layerName || "");
			}
			return sheet;
		}
	});
	return sheet;
};
var removeAdopted = (sheet) => {
	if (!sheet) return false;
	const target = typeof sheet === "string" ? adoptedMap.get(sheet) : sheet;
	if (!target || typeof document === "undefined") return false;
	const sheets = document.adoptedStyleSheets;
	const idx = sheets.indexOf(target);
	if (idx !== -1) {
		sheets.splice(idx, 1);
		return true;
	}
	return false;
};
var getPropertyValue = (src, name) => {
	if ("computedStyleMap" in src) {
		const val = src?.computedStyleMap?.()?.get(name);
		return val instanceof CSSUnitValue ? val?.value || 0 : val?.toString?.();
	}
	if (src instanceof HTMLElement) {
		const cs = getComputedStyle?.(src, "");
		return parseFloat(cs?.getPropertyValue?.(name)?.replace?.("px", "")) || 0;
	}
	return parseFloat((src?.style ?? src).getPropertyValue?.(name)?.replace?.("px", "")) || 0;
};
var getPadding = (src, axis) => {
	if (axis == "inline") return getPropertyValue(src, "padding-inline-start") + getPropertyValue(src, "padding-inline-end");
	return getPropertyValue(src, "padding-block-start") + getPropertyValue(src, "padding-block-end");
};
//#endregion
//#region shared/fest/dom/mixin/Observer.ts
var unwrapFromQuery = (element) => {
	if (typeof element?.current == "object") element = element?.element ?? element?.current ?? (typeof element?.self == "object" ? element?.self : null) ?? element;
	return element;
};
var observeAttribute = (element, attribute, cb) => {
	if (typeof element?.selector == "string") return observeAttributeBySelector(element, element?.selector, attribute, cb);
	const attributeList = new Set((attribute.split(",") || [attribute]).map((s) => s.trim()));
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.attributeName && attributeList.has(mutation.attributeName)) cb(mutation, observer);
	});
	if ((element?.element ?? element) instanceof Node) observer.observe(element = unwrapFromQuery(element), {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: [...attributeList]
	});
	attributeList.forEach((attribute) => cb({
		target: element,
		type: "attributes",
		attributeName: attribute,
		oldValue: element?.getAttribute?.(attribute)
	}, observer));
	return observer;
};
var observeAttributeBySelector = (element, selector, attribute, cb) => {
	const attributeList = new Set([...attribute.split(",") || [attribute]].map((s) => s.trim()));
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.type == "childList") {
			const addedNodes = Array.from(mutation.addedNodes) || [];
			const removedNodes = Array.from(mutation.removedNodes) || [];
			addedNodes.push(...Array.from(mutation.addedNodes || []).flatMap((el) => Array.from(el?.querySelectorAll?.(selector) || [])));
			removedNodes.push(...Array.from(mutation.removedNodes || []).flatMap((el) => Array.from(el?.querySelectorAll?.(selector) || [])));
			[...new Set(addedNodes)]?.filter((el) => el?.matches?.(selector))?.map?.((target) => {
				attributeList.forEach((attribute) => {
					cb({
						target,
						type: "attributes",
						attributeName: attribute,
						oldValue: target?.getAttribute?.(attribute)
					}, observer);
				});
			});
		} else if (mutation.target?.matches?.(selector) && mutation.attributeName && attributeList.has(mutation.attributeName)) cb(mutation, observer);
	});
	observer.observe(element = unwrapFromQuery(element), {
		attributeOldValue: true,
		attributes: true,
		attributeFilter: [...attributeList],
		childList: true,
		subtree: true,
		characterData: true
	});
	[...element.querySelectorAll(selector)].map((target) => attributeList.forEach((attribute) => cb({
		target,
		type: "attributes",
		attributeName: attribute,
		oldValue: target?.getAttribute?.(attribute)
	}, observer)));
	return observer;
};
var observeBySelector = (element, selector = "*", cb = (mut, obs) => {}) => {
	const unwrapNodesBySelector = (nodes) => {
		const $nodes = Array.from(nodes || []) || [];
		$nodes.push(...Array.from(nodes || []).flatMap((el) => Array.from(el?.querySelectorAll?.(selector) || [])));
		return [...Array.from(new Set($nodes).values())].filter((el) => el?.matches?.(selector));
	};
	const handleMutation = (mutation) => {
		const observer = obRef?.deref?.();
		const addedNodes = unwrapNodesBySelector(mutation.addedNodes);
		const removedNodes = unwrapNodesBySelector(mutation.removedNodes);
		if (addedNodes.length > 0 || removedNodes.length > 0) cb?.({
			type: mutation.type,
			target: mutation.target,
			attributeName: mutation.attributeName,
			attributeNamespace: mutation.attributeNamespace,
			nextSibling: mutation.nextSibling,
			oldValue: mutation.oldValue,
			previousSibling: mutation.previousSibling,
			addedNodes,
			removedNodes
		}, observer);
	};
	const handleCome = (ev) => {
		handleMutation({
			addedNodes: [ev?.target].filter((el) => !!el),
			removedNodes: [ev?.relatedTarget].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const handleOutCome = (ev) => {
		handleMutation({
			addedNodes: [ev?.relatedTarget].filter((el) => !!el),
			removedNodes: [ev?.target].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const handleFocusClick = (ev) => {
		handleMutation({
			addedNodes: [ev?.target].filter((el) => !!el),
			removedNodes: [ev?.relatedTarget || document?.activeElement].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const factors = {
		passive: true,
		capture: false
	};
	if (selector?.includes?.(":hover") && selector?.includes?.(":active")) {
		element.addEventListener("pointerover", handleCome, factors);
		element.addEventListener("pointerout", handleOutCome, factors);
		element.addEventListener("pointerdown", handleCome, factors);
		element.addEventListener("pointerup", handleOutCome, factors);
		element.addEventListener("pointercancel", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerover", handleCome, factors);
			element.removeEventListener("pointerout", handleOutCome, factors);
			element.removeEventListener("pointerdown", handleCome, factors);
			element.removeEventListener("pointerup", handleOutCome, factors);
			element.removeEventListener("pointercancel", handleOutCome, factors);
		} };
	}
	if (selector?.includes?.(":hover")) {
		element.addEventListener("pointerover", handleCome, factors);
		element.addEventListener("pointerout", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerover", handleCome, factors);
			element.removeEventListener("pointerout", handleOutCome, factors);
		} };
	}
	if (selector?.includes?.(":active")) {
		element.addEventListener("pointerdown", handleCome, factors);
		element.addEventListener("pointerup", handleOutCome, factors);
		element.addEventListener("pointercancel", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerdown", handleCome, factors);
			element.removeEventListener("pointerup", handleOutCome, factors);
			element.removeEventListener("pointercancel", handleOutCome, factors);
		} };
	}
	if (selector?.includes?.(":focus") && selector?.includes?.(":focus-within") && selector?.includes?.(":focus-visible")) {
		element.addEventListener("focusin", handleCome, factors);
		element.addEventListener("focusout", handleOutCome, factors);
		element.addEventListener("click", handleFocusClick, factors);
		return { disconnect: () => {
			element.removeEventListener("focusin", handleCome, factors);
			element.removeEventListener("focusout", handleOutCome, factors);
			element.removeEventListener("click", handleFocusClick, factors);
		} };
	}
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.type == "childList") handleMutation(mutation);
	});
	const obRef = new WeakRef(observer);
	if ((element?.element ?? element) instanceof Node) observer.observe(element = unwrapFromQuery(element), {
		childList: true,
		subtree: true
	});
	const selected = Array.from(element.querySelectorAll(selector));
	if (selected.length > 0) cb?.({ addedNodes: selected }, observer);
	return observer;
}, blobImageMap = /* @__PURE__ */ new WeakMap();
var sheduler = makeRAFCycle();
var getImgWidth = (img) => {
	return img?.naturalWidth || img?.width || 1;
};
var getImgHeight = (img) => {
	return img?.naturalHeight || img?.height || 1;
};
var cover = (ctx, img, scale = 1, port, orient = 0) => {
	const canvas = ctx.canvas;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((-orient || 0) * (Math.PI * .5));
	ctx.rotate((1 - port) * (Math.PI / 2));
	ctx.translate(-(getImgWidth(img) / 2) * scale, -(getImgHeight(img) / 2) * scale);
};
var createImageBitmapCache = (blob) => {
	if (!blobImageMap.has(blob) && (blob instanceof Blob || blob instanceof File || blob instanceof OffscreenCanvas || blob instanceof ImageBitmap || blob instanceof Image)) blobImageMap.set(blob, createImageBitmap(blob));
	return blobImageMap.get(blob);
};
var bindCache = /* @__PURE__ */ new WeakMap();
var bindCached = (cb, ctx) => {
	return bindCache?.getOrInsertComputed?.(cb, () => cb?.bind?.(ctx));
};
var UICanvas = null;
if (typeof HTMLCanvasElement != "undefined") UICanvas = class UICanvas extends HTMLCanvasElement {
	static {
		this.observedAttributes = ["data-src", "data-orient"];
	}
	#size = [1, 1];
	#loading = "";
	#ready = "";
	get #orient() {
		return parseInt(this.getAttribute("data-orient") || "0") || 0;
	}
	set #orient(value) {
		this.setAttribute("data-orient", value.toString());
	}
	attributeChangedCallback(name, _, newValue) {
		if (name == "data-src") this.#preload(newValue);
		if (name == "data-orient") this.#render(this.#ready);
	}
	connectedCallback() {
		const parent = this.parentNode;
		this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
		this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
		this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
		this.#preload(this.#loading = this.dataset.src || this.#loading);
	}
	constructor() {
		super();
		this.ctx = null;
		this.image = null;
		const canvas = this;
		const parent = this.parentNode;
		const fixSize = () => {
			const old = this.#size;
			this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
			if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
		};
		sheduler?.shedule?.(() => {
			this.ctx = canvas.getContext("2d", {
				alpha: true,
				desynchronized: true,
				powerPreference: "high-performance",
				preserveDrawingBuffer: true
			});
			this.inert = true;
			this.style.objectFit = "cover";
			this.style.objectPosition = "center";
			this.classList.add("u-canvas");
			this.classList.add("u2-canvas");
			this.classList.add("ui-canvas");
			this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
			this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
			fixSize();
			new ResizeObserver((entries) => {
				for (const entry of entries) {
					const box = entry?.devicePixelContentBoxSize?.[0];
					if (box) {
						const old = this.#size;
						this.#size = [Math.max(box.inlineSize || this.width, 1), Math.max(box.blockSize || this.height, 1)];
						if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
					}
				}
			}).observe(this, { box: "device-pixel-content-box" });
			this.#preload(this.#loading = this.dataset.src || this.#loading);
		});
	}
	async $useImageAsSource(blob, ready) {
		ready ||= this.#loading;
		const img = blob instanceof ImageBitmap ? blob : await createImageBitmapCache(blob).catch(console.warn.bind(console));
		if (img && ready == this.#loading) {
			this.image = img;
			this.#render(ready);
		}
		return blob;
	}
	$renderPass(whatIsReady) {
		const canvas = this, ctx = this.ctx, img = this.image;
		if (img && ctx && (whatIsReady == this.#loading || !whatIsReady)) {
			if (whatIsReady) this.#ready = whatIsReady;
			if (this.width != this.#size[0]) this.width = this.#size[0];
			if (this.height != this.#size[1]) this.height = this.#size[1];
			this.style.aspectRatio = `${this.width || 1} / ${this.height || 1}`;
			const ox = this.#orient % 2 || 0;
			const port = getImgWidth(img) <= getImgHeight(img) ? 1 : 0;
			const scale = Math.max(canvas[["height", "width"][ox]] / (port ? getImgHeight(img) : getImgWidth(img)), canvas[["width", "height"][ox]] / (port ? getImgWidth(img) : getImgHeight(img)));
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			cover(ctx, img, scale, port, this.#orient);
			ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
			ctx.restore();
		}
	}
	#preload(src) {
		const ready = src || this.#loading;
		this.#loading = ready;
		return fetch(src, {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (rsp) => this.$useImageAsSource(await rsp.blob(), ready)?.catch(console.warn.bind(console)))?.catch?.(console.warn.bind(console));
	}
	#render(whatIsReady) {
		const ctx = this.ctx;
		if (this.image && ctx && (whatIsReady == this.#loading || !whatIsReady)) sheduler?.shedule?.(bindCached(this.$renderPass, this));
	}
};
else UICanvas = class UICanvas {
	constructor() {
		this.ctx = null;
		this.image = null;
	}
	$renderPass(whatIsReady) {}
	$useImageAsSource(blob, ready) {
		return blob;
	}
	#preload(src) {
		return Promise.resolve();
	}
	#render(whatIsReady) {}
	#orient = 0;
	#loading = "";
	#ready = "";
	#size = [1, 1];
};
try {
	customElements.define("ui-canvas", UICanvas, { extends: "canvas" });
} catch (e) {}
//#endregion
//#region shared/fest/dom/mixin/Behavior.ts
var boundBehaviors = /* @__PURE__ */ new WeakMap();
var bindBehavior = (element, behSet, behavior) => {
	new WeakRef(element);
	if (!behSet.has(behavior)) behSet.add(behavior);
	return element;
};
var reflectBehaviors = (element, behaviors) => {
	if (!element) return;
	if (behaviors) {
		const behSet = boundBehaviors.getOrInsert(element, /* @__PURE__ */ new Set());
		[...behaviors?.values?.() || []].map((e) => bindBehavior(element, behSet, e));
	}
	return element;
};
//#endregion
//#region shared/fest/dom/mixin/Store.ts
var namedStoreMaps = /* @__PURE__ */ new Map();
var getStoresOfElement = (map, element) => {
	const E = [...map.entries() || []];
	return new Map(E?.map?.(([n, m]) => [n, m?.get?.(element)])?.filter?.(([n, e]) => !!e) || []);
};
var bindStore = (element, name, obj) => {
	let weakMap = namedStoreMaps.get(name);
	if (!weakMap) {
		weakMap = /* @__PURE__ */ new WeakMap();
		namedStoreMaps.set(name, weakMap);
	}
	if (!weakMap.has(element)) weakMap.set(element, obj);
	return element;
};
var reflectStores = (element, stores) => {
	if (!element || !stores) return;
	for (const [name, obj] of stores.entries()) bindStore(element, name, obj);
	return element;
};
//#endregion
//#region shared/fest/dom/mixin/Mixins.ts
var reflectMixins = (element, mixins) => {
	if (!element) return;
	if (mixins) {
		const mixinSet = boundMixinSet?.get?.(element) ?? /* @__PURE__ */ new WeakSet();
		if (!boundMixinSet?.has?.(element)) boundMixinSet?.set?.(element, mixinSet);
		[...mixins?.values?.() || []].map((e) => bindMixins(element, e, mixinSet));
	}
	return element;
};
var getElementRelated = (element) => {
	return {
		storeSet: getStoresOfElement(namedStoreMaps, element),
		mixinSet: boundMixinSet?.get?.(element),
		behaviorSet: boundBehaviors?.get?.(element)
	};
};
var bindMixins = (element, mixin, mixSet) => {
	const wel = new WeakRef(element);
	mixSet ||= boundMixinSet?.get?.(element);
	if (!mixSet?.has?.(mixin)) {
		mixSet?.add?.(mixin);
		mixinElements?.get?.(mixin)?.add?.(element);
		if (mixin.name) element?.setAttribute?.("data-mixin", [...element?.getAttribute?.("data-mixin")?.split?.(" ") || [], mixin.name].filter((n) => !!n).join(" "));
		mixin?.connect?.(wel, mixin, getElementRelated(element));
	}
	return element;
};
var boundMixinSet = /* @__PURE__ */ new WeakMap();
var mixinElements = /* @__PURE__ */ new WeakMap();
var mixinRegistry = /* @__PURE__ */ new Map();
var mixinNamespace = /* @__PURE__ */ new WeakMap();
var updateMixinAttributes = (element, mixin) => {
	if (typeof mixin == "string") mixin = mixinRegistry?.get?.(mixin);
	const names = new Set([...element?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
	const mixins = new Set([...names].map((n) => mixinRegistry?.get?.(n)).filter((m) => !!m));
	const mixinSet = boundMixinSet?.get?.(element) ?? /* @__PURE__ */ new WeakSet();
	if (!mixinElements?.has?.(mixin)) mixinElements?.set?.(mixin, /* @__PURE__ */ new WeakSet());
	if (!boundMixinSet?.has?.(element)) boundMixinSet?.set?.(element, mixinSet);
	const wel = new WeakRef(element);
	if (!mixinSet?.has?.(mixin)) {
		if (!mixins.has(mixin)) mixin?.disconnect?.(wel, mixin, getElementRelated(element));
		if (mixins.has(mixin) || !mixinElements?.get?.(mixin)?.has?.(element)) {
			mixin?.connect?.(wel, mixin, getElementRelated(element));
			names.add(mixinNamespace?.get?.(mixin));
			mixinSet?.add?.(mixin);
			element?.setAttribute?.("data-mixin", [...names].filter((n) => !!n).join(" "));
		}
		mixinElements?.get?.(mixin)?.add?.(element);
	}
	if (mixinSet?.has?.(mixin)) {
		if (!mixins.has(mixin)) {
			mixinSet?.delete?.(mixin);
			mixin?.disconnect?.(wel, mixin, getElementRelated(element));
		}
	}
};
var roots = /* @__PURE__ */ new Set();
var addRoot = (root = typeof document != "undefined" ? document : null) => {
	if (!root) return;
	if (!roots?.has?.(root)) {
		roots?.add?.(root);
		observeAttributeBySelector(root, "*", "data-mixin", (mutation) => updateAllMixins(mutation.target));
		observeBySelector(root, "[data-mixin]", (mutation) => {
			for (const element of mutation.addedNodes) if (element instanceof HTMLElement) updateAllMixins(element);
		});
	}
	return root;
};
var updateAllMixins = (element) => {
	const names = new Set([...element?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
	[...new Set([...names].map((n) => mixinRegistry?.get?.(n)).filter((m) => !!m))]?.map?.((m) => updateMixinAttributes(element, m));
};
new FinalizationRegistry((key) => {
	mixinRegistry?.delete?.(key);
});
addRoot(typeof document != "undefined" ? document : null);
//#endregion
//#region shared/fest/dom/mixin/Handler.ts
var handleHidden = (element, _, visible) => {
	const $ref = visible;
	if (hasValue(visible)) visible = visible.value;
	const isVisible = (visible = normalizePrimitive(visible)) != null && visible !== false;
	$avoidTrigger($ref, () => {
		if (element instanceof HTMLInputElement) element.hidden = !isVisible;
		else if (isVisible) element?.removeAttribute?.("data-hidden");
		else element?.setAttribute?.("data-hidden", "");
	});
	return element;
};
var handleProperty = (el, prop, val) => {
	if (!(prop = typeof prop == "string" ? kebabToCamel(prop) : prop) || !el || [
		"style",
		"dataset",
		"attributeStyleMap",
		"styleMap",
		"computedStyleMap"
	].indexOf(prop || "") != -1) return el;
	const $ref = val;
	if (hasValue(val)) val = val.value;
	if (el?.[prop] === val) return el;
	if (el?.[prop] !== val) $avoidTrigger($ref, () => {
		if (val != null) el[prop] = val;
		else delete el[prop];
	});
	return el;
};
var handleDataset = (el, prop, val) => {
	const datasetRef = el?.dataset;
	if (!prop || !el || !datasetRef) return el;
	const $ref = val;
	if (hasValue(val)) val = val?.value;
	prop = kebabToCamel(prop);
	if (datasetRef?.[prop] === (val = normalizePrimitive(val))) return el;
	if (val == null || val === false) delete datasetRef[prop];
	else $avoidTrigger($ref, () => {
		if (typeof val != "object" && typeof val != "function") datasetRef[prop] = String(val);
		else delete datasetRef[prop];
	});
	return el;
};
var deleteStyleProperty = (el, name) => el.style.removeProperty(camelToKebab(name));
var handleStyleChange = (el, prop, val) => {
	const styleRef = el?.style;
	if (!prop || typeof prop != "string" || !el || !styleRef) return el;
	$avoidTrigger(val, () => {
		if (isVal(val) || hasValue(val) || isValueUnit(val)) setStyleProperty(el, prop, val);
		else if (val == null) deleteStyleProperty(el, prop);
	});
	return el;
};
var handleAttribute = (el, prop, val) => {
	if (!prop || !el) return el;
	const $ref = val;
	if (hasValue(val)) val = val.value;
	prop = camelToKebab(prop);
	if (el?.getAttribute?.(prop) === (val = normalizePrimitive(val))) return el;
	$avoidTrigger($ref, () => {
		if (typeof val != "object" && typeof val != "function" && val != null && (typeof val == "boolean" ? val == true : true)) el?.setAttribute?.(prop, String(val));
		else el?.removeAttribute?.(prop);
	});
	return el;
};
//#endregion
export { addEventsList as A, setAttributesIfNull as B, orientationNumberMap as C, RAFBehavior as D, MOCElement as E, isElement as F, setIdleInterval as H, isInFocus as I, isValidParent as L, createElementVanilla as M, hasParent as N, addEvent as O, indexOf as P, makeRAFCycle as R, getCorrectOrientation as S, fixedClientZoom as T, setChecked as V, preloadStyle as _, handleStyleChange as a, resolveGridCellFromClientPoint as b, reflectStores as c, observeAttributeBySelector as d, observeBySelector as f, loadInlineStyle as g, loadAsAdopted as h, handleProperty as i, containsOrSelf as j, addEvents as k, reflectBehaviors as l, getPadding as m, handleDataset as n, addRoot as o, getAdoptedStyleRule as p, handleHidden as r, reflectMixins as s, handleAttribute as t, observeAttribute as u, removeAdopted as v, whenAnyScreenChanges as w, fixOrientToScreen as x, setStyleProperty as y, removeEvent as z };
