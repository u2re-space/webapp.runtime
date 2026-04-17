import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { A as addEventsList, B as setAttributesIfNull, C as orientationNumberMap, E as MOCElement, F as isElement, L as isValidParent$1, M as createElementVanilla, N as hasParent, O as addEvent, P as indexOf, R as makeRAFCycle, S as getCorrectOrientation, T as fixedClientZoom, V as setChecked, a as handleStyleChange, c as reflectStores, d as observeAttributeBySelector, f as observeBySelector, g as loadInlineStyle, h as loadAsAdopted, i as handleProperty, j as containsOrSelf, k as addEvents, l as reflectBehaviors, m as getPadding, n as handleDataset, o as addRoot, p as getAdoptedStyleRule, r as handleHidden, s as reflectMixins, t as handleAttribute, u as observeAttribute, w as whenAnyScreenChanges, z as removeEvent } from "../fest/dom.js";
import { A as UUIDv4, C as WRef, D as $avoidTrigger, E as isNotEqual, F as handleListeners, G as isValueRef, H as isObservable, I as hasValue, J as normalizePrimitive, M as canBeInteger, N as deref, O as $getValue, P as getValue, U as isPrimitive, V as isObject, Y as toRef$1, Z as unref, a as booleanRef, c as observe, d as stringRef, g as $affected, h as unwrap, i as iterated, j as camelToKebab$1, k as $set$1, n as DoubleWeakMap, p as addToCallChain, r as affected, s as numberRef, u as ref, v as stripUserScopePrefix, y as userPathCandidates } from "../fest/object.js";
import { s as createWorkerChannel, u as QueuedWorkerChannel } from "../fest/uniform.js";
import "./service2.js";
import "./service3.js";
import { t as JSOX } from "../vendor/jsox.js";
import { n as writeFileSmart } from "./service8.js";
import { t as canParseURL } from "./service9.js";
//#region shared/fest/lure/extension/anchor/Utils.ts
var ReactiveViewport = class {
	static {
		this.width = numberRef(typeof window != "undefined" ? window?.innerWidth : 0);
	}
	static {
		this.height = numberRef(typeof window != "undefined" ? window?.innerHeight : 0);
	}
	static init() {
		const updateSize = () => {
			this.width.value = window?.innerWidth;
			this.height.value = window?.innerHeight;
		};
		if (typeof window != "undefined") window?.addEventListener?.("resize", updateSize);
	}
	static center() {
		return {
			x: CSSCalc.divide(this.width, numberRef(2)),
			y: CSSCalc.divide(this.height, numberRef(2))
		};
	}
};
ReactiveViewport.init();
//#endregion
//#region shared/fest/lure/lure/core/Binding.ts
var elMap$1 = new DoubleWeakMap();
var alives = new FinalizationRegistry((unsub) => unsub?.());
var $mapped = Symbol.for("@mapped");
var $virtual = Symbol.for("@virtual");
var $behavior = Symbol.for("@behavior");
var bindCtrl = (element, ctrlCb) => {
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	const unsub = handleListeners?.(element, "addEventListener", hdl);
	addToCallChain(element, Symbol.dispose, unsub);
	return unsub;
};
var reflectControllers = (element, ctrls) => {
	if (ctrls) for (let ctrl of ctrls) bindCtrl(element, ctrl);
	return element;
};
var $observeInput = (element, ref, prop = "value") => {
	const wel = toRef$1(element);
	const rf = toRef$1(ref);
	const ctrlCb = (_ev) => {
		$set$1(rf, "value", deref(wel)?.[prop ?? "value"] ?? $getValue(deref(rf)));
	};
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	handleListeners?.(element, "addEventListener", hdl);
	$set$1(rf, "value", element?.[prop ?? "value"] ?? $getValue(deref(ref)));
	return () => handleListeners?.(element, "removeEventListener", hdl);
};
var $observeAttribute = (el, ref, prop = "") => {
	toRef$1(el);
	const wv = toRef$1(ref);
	const attrName = camelToKebab$1(prop);
	const cb = (mutation) => {
		if (mutation.type == "attributes" && mutation.attributeName == attrName) {
			const value = mutation?.target?.getAttribute?.(mutation.attributeName);
			const valRef = deref(wv), reVal = $getValue(valRef);
			if (isNotEqual(mutation.oldValue, value) && valRef != null && (typeof valRef == "object" || typeof valRef == "function")) {
				if (isNotEqual(reVal, value) || reVal == null) $set$1(valRef, "value", value);
			}
		}
	};
	return observeAttribute(el, attrName, cb);
};
var removeFromBank = (el, handler, prop) => {
	const bank = elMap$1.get([el, handler]);
	if (bank) {
		const old = bank[prop]?.[1];
		delete bank[prop];
		old?.();
	}
};
var addToBank = (el, handler, prop, forLink) => {
	const bank = elMap$1.getOrInsertComputed([el, handler], () => ({}));
	bank?.[prop]?.[1]?.();
	bank[prop] = forLink;
	return true;
};
var bindHandler = (element, value, prop, handler, set, withObserver) => {
	const wel = toRef$1(element);
	element = deref(wel);
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	let controller = null;
	controller?.abort?.();
	controller = new AbortController();
	const wv = toRef$1(value);
	handler?.(element, prop, value);
	const un = affected?.([value, "value"], (curr, _p, old) => {
		const valueRef = deref(wv);
		const setRef = deref(set);
		const elementRef = deref(wel);
		const v = $getValue(valueRef) ?? $getValue(curr);
		if (!setRef || setRef?.[prop] == valueRef) if (typeof valueRef?.[$behavior] == "function") valueRef?.[$behavior]?.((_val = curr) => handler(elementRef, prop, v), [
			curr,
			prop,
			old
		], [
			controller?.signal,
			prop,
			wel
		]);
		else handler(elementRef, prop, v);
	});
	let obs = null;
	if (typeof withObserver == "boolean" && withObserver) {
		if (handler == handleAttribute) obs = $observeAttribute(element, value, prop);
		if (handler == handleProperty) obs = $observeInput(element, value, prop);
	}
	if (typeof withObserver == "function") obs = withObserver(element, prop, value);
	const unsub = () => {
		obs?.disconnect?.();
		obs != null && typeof obs == "function" && obs?.();
		un?.();
		controller?.abort?.();
		removeFromBank?.(element, handler, prop);
	};
	addToCallChain(value, Symbol.dispose, unsub);
	alives.register(element, unsub);
	if (!addToBank(element, handler, prop, [value, unsub])) return unsub;
};
var bindWith = (el, prop, value, handler, set, withObserver) => {
	handler(el, prop, value);
	return bindHandler(el, value, prop, handler, set, withObserver);
};
var withInsetWithPointer = (exists, pRef) => {
	if (!exists) return () => {};
	const ubs = [bindWith(exists, "--client-x", pRef?.[0], handleStyleChange), bindWith(exists, "--client-y", pRef?.[1], handleStyleChange)];
	if (pRef?.[2]) ubs.push(bindWith(exists, "--anchor-width", pRef?.[2], handleStyleChange));
	if (pRef?.[3]) ubs.push(bindWith(exists, "--anchor-height", pRef?.[3], handleStyleChange));
	return () => ubs?.forEach?.((ub) => ub?.());
};
var bindWhileConnected = (element, bind) => {
	if (!element) return () => {};
	let cleanup = null;
	let disposed = false;
	const ensureBound = () => {
		if (disposed) return;
		if (!element.isConnected) {
			if (cleanup) {
				cleanup();
				cleanup = null;
			}
			return;
		}
		if (!cleanup) {
			const c = bind();
			cleanup = typeof c === "function" ? c : null;
		}
	};
	const root = typeof document !== "undefined" ? document.documentElement : null;
	const elAny = element?.element ?? element;
	const el = elAny instanceof Node ? elAny : null;
	if (!el) return () => {};
	const mo = typeof MutationObserver !== "undefined" && root ? new MutationObserver((records) => {
		for (const r of records) {
			const target = r.target;
			if (target === el || target instanceof Node && target.contains(el)) {
				ensureBound();
				return;
			}
			const nodes = [...Array.from(r?.addedNodes || []), ...Array.from(r?.removedNodes || [])];
			for (const n of nodes) if (n === el || n instanceof Node && n.contains(el)) {
				ensureBound();
				return;
			}
		}
	}) : null;
	if (mo && root) mo.observe(root, {
		childList: true,
		subtree: true
	});
	queueMicrotask(() => ensureBound());
	return () => {
		disposed = true;
		mo?.disconnect?.();
		cleanup?.();
		cleanup = null;
	};
};
//#endregion
//#region shared/fest/lure/lure/misc/Styles.ts
/** True when there is no non-empty declaration value (handles `prop: ` / `prop:` after empty `${...}` in html templates). */
var isEffectivelyEmptyStyleText = (cssText) => {
	const s = typeof cssText == "string" ? cssText.trim() : "";
	if (!s) return true;
	for (const chunk of s.split(";")) {
		const t = chunk.trim();
		if (!t) continue;
		const ci = t.indexOf(":");
		if (ci < 0) return false;
		if (t.slice(ci + 1).trim().length > 0) return false;
	}
	return true;
};
/** Drop a useless `style` attribute left over from empty template interpolations. */
var pruneEmptyStyleAttribute = (element) => {
	if (element == null) return;
	const raw = element.getAttribute("style");
	if (raw == null) return;
	if (isEffectivelyEmptyStyleText(raw)) {
		element.removeAttribute("style");
		element.style.cssText = "";
	}
};
/** Set inline styles or remove the attribute when the effective CSS text is empty. */
var applyNormalizedInlineStyle = (element, cssText) => {
	if (isEffectivelyEmptyStyleText(cssText)) {
		element.style.cssText = "";
		element.removeAttribute("style");
	} else element.style.cssText = cssText;
};
//#endregion
//#region shared/fest/lure/lure/node/Queried.ts
var existsQueries = /* @__PURE__ */ new WeakMap();
var alreadyUsed = /* @__PURE__ */ new WeakMap();
var queryExtensions = {
	logAll(ctx) {
		return () => console.log("attributes:", [...ctx?.attributes].map((x) => ({
			name: x.name,
			value: x.value
		})));
	},
	append(ctx) {
		return (...args) => ctx?.append?.(...[...args || []]?.map?.((e) => e?.element ?? e) || args);
	},
	current(ctx) {
		return ctx;
	}
};
var UniversalElementHandler = class {
	constructor(selector, index = 0, direction = "children") {
		this.direction = "children";
		this.index = 0;
		this._eventMap = /* @__PURE__ */ new WeakMap();
		this.index = index;
		this.selector = selector;
		this.direction = direction;
	}
	_observeDOMChange(target, selector, cb) {
		return typeof selector == "string" ? observeBySelector(target, selector, cb) : null;
	}
	_observeAttributes(target, attribute, cb) {
		return typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb);
	}
	_getArray(target) {
		if (typeof target == "function") target = this.selector || target?.(this.selector);
		if (!this.selector) return [target];
		if (typeof this.selector == "string") {
			const inclusion = typeof target?.matches == "function" && target?.element != null && target?.matches?.(this.selector) ? [target] : [];
			if (this.direction == "children") {
				const list = typeof target?.querySelectorAll == "function" && target?.element != null ? [...target?.querySelectorAll?.(this.selector)] : [];
				return list?.length >= 1 ? [...list] : inclusion;
			} else if (this.direction == "parent") {
				const closest = target?.closest?.(this.selector);
				return closest ? [closest] : inclusion;
			}
			return inclusion;
		}
		return Array.isArray(this.selector) ? this.selector : [this.selector];
	}
	_getSelected(target) {
		const tg = target?.self ?? target;
		const sel = this._selector(target);
		if (typeof sel == "string") {
			if (this.direction == "children") return tg?.matches?.(sel) ? tg : tg?.querySelector?.(sel);
			if (this.direction == "parent") return tg?.matches?.(sel) ? tg : tg?.closest?.(sel);
		}
		return tg == (sel?.element ?? sel) ? sel?.element ?? sel : null;
	}
	_redirectToBubble(eventName) {
		if (typeof this._selector() == "string") return {
			["pointerenter"]: "pointerover",
			["pointerleave"]: "pointerout",
			["mouseenter"]: "mouseover",
			["mouseleave"]: "mouseout",
			["focus"]: "focusin",
			["blur"]: "focusout"
		}?.[eventName] || eventName;
		return eventName;
	}
	_addEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.addEventListener?.(name, cb, option);
			return cb;
		}
		const eventName = this._redirectToBubble(name);
		const parent = target?.self ?? target;
		const wrap = (ev) => {
			const sel = this._selector(target);
			const rot = ev?.currentTarget ?? parent;
			let tg = null;
			if (ev?.composedPath && typeof ev.composedPath === "function") {
				const path = ev.composedPath();
				for (const node of path) if (node instanceof HTMLElement || node instanceof Element) {
					const nodeEl = node?.element ?? node;
					if (typeof sel == "string") {
						if (MOCElement(nodeEl, sel, ev)) {
							tg = nodeEl;
							break;
						}
					} else if (containsOrSelf(sel, nodeEl, ev)) {
						tg = nodeEl;
						break;
					}
				}
			}
			if (!tg) {
				tg = ev?.target ?? this._getSelected(target) ?? rot;
				tg = tg?.element ?? tg;
			}
			if (typeof sel == "string") {
				if (containsOrSelf(rot, MOCElement(tg, sel, ev), ev)) cb?.call?.(tg, ev);
			} else if (containsOrSelf(rot, sel, ev) && containsOrSelf(sel, tg, ev)) cb?.call?.(tg, ev);
		};
		parent?.addEventListener?.(eventName, wrap, option);
		this._eventMap.getOrInsert(parent, /* @__PURE__ */ new Map()).getOrInsert(eventName, /* @__PURE__ */ new WeakMap()).set(cb, {
			wrap,
			option
		});
		return wrap;
	}
	_removeEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.removeEventListener?.(name, cb, option);
			return cb;
		}
		const parent = target?.self ?? target;
		const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(parent);
		if (!eventMap) return;
		const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
		parent?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
		cbMap?.delete?.(cb);
		if (cbMap?.size == 0) eventMap?.delete?.(eventName);
		if (eventMap.size == 0) this._eventMap.delete(parent);
	}
	_selector(tg) {
		if (typeof this.selector == "string" && typeof tg?.selector == "string") return ((tg?.selector || "") + " " + this.selector)?.trim?.();
		return this.selector;
	}
	get(target, name, ctx) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (name in queryExtensions) return queryExtensions?.[name]?.(selected);
		if (name == "length" && array?.length != null) return array?.length;
		if (name == "_updateSelector") return (sel) => this.selector = sel || this.selector;
		if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
			const tg = target?.self ?? target;
			const selector = this._selector(target);
			const basis = typeof selector == "string" ? getAdoptedStyleRule(selector, "ux-query", tg) : selected;
			if (name == "attributeStyleMap") return basis?.styleMap ?? basis?.attributeStyleMap;
			return basis?.[name];
		}
		if (name == "self") return target?.self ?? target;
		if (name == "selector") return this._selector(target);
		if (name == "observeAttr") return (name, cb) => this._observeAttributes(target, name, cb);
		if (name == "DOMChange") return (cb) => this._observeDOMChange(target, this.selector, cb);
		if (name == "addEventListener") return (name, cb, opt) => this._addEventListener(target, name, cb, opt);
		if (name == "removeEventListener") return (name, cb, opt) => this._removeEventListener(target, name, cb, opt);
		if (name == "getAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[0];
			return selected?.getAttribute?.(key);
		};
		if (name == "setAttribute") return (key, value) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			if (typeof value == "object" && (value?.value != null || "value" in value)) return bindWith(selected, key, value, handleAttribute, null, true);
			return selected?.setAttribute?.(key, value);
		};
		if (name == "removeAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[1]?.();
			return selected?.removeAttribute?.(key);
		};
		if (name == "hasAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return true;
			return selected?.hasAttribute?.(key);
		};
		if (name == "element") {
			if (array?.length <= 1) return selected?.element ?? selected;
			const fragment = document.createDocumentFragment();
			fragment.append(...array);
			return fragment;
		}
		if (name == Symbol.toPrimitive) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (hint) => {
				if (hint == "number") return (selected?.element ?? selected)?.valueAsNumber ?? parseFloat((selected?.element ?? selected)?.value);
				if (hint == "string") return String((selected?.element ?? selected)?.value ?? selected?.element ?? selected);
				if (hint == "boolean") return (selected?.element ?? selected)?.checked;
				return (selected?.element ?? selected)?.checked ?? (selected?.element ?? selected)?.value ?? selected?.element ?? selected;
			};
		}
		if (name == "checked") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.checked;
		}
		if (name == "value") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.valueAsNumber ?? (selected?.element ?? selected)?.valueAsDate ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected)?.checked;
		}
		if (name == $affected) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (cb) => {
				let oldValue = selected?.value;
				const evt = [(ev) => {
					const input = this._getSelected(ev?.target);
					cb?.(input?.value, "value", oldValue);
					oldValue = input?.value;
				}, { passive: true }];
				this._addEventListener(target, "change", ...evt);
				return () => this._removeEventListener(target, "change", ...evt);
			};
		}
		if (name == "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
			const wk = new WeakRef(selected);
			return () => wk?.deref?.()?.element ?? wk?.deref?.();
		}
		if (typeof name == "string" && /^\d+$/.test(name)) return array[parseInt(name)];
		const origin = selected;
		if (origin?.[name] != null) return typeof origin[name] == "function" ? origin[name].bind(origin) : origin[name];
		if (array?.[name] != null) return typeof array[name] == "function" ? array[name].bind(array) : array[name];
		return typeof target?.[name] == "function" ? target?.[name].bind(origin) : target?.[name];
	}
	set(target, name, value) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (typeof name == "string" && /^\d+$/.test(name)) return false;
		if (array[name] != null) return false;
		if (selected) {
			selected[name] = value;
			return true;
		}
		return true;
	}
	has(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		return typeof name == "string" && /^\d+$/.test(name) && array[parseInt(name)] != null || array[name] != null || selected && name in selected;
	}
	deleteProperty(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected && name in selected) {
			delete selected[name];
			return true;
		}
		return false;
	}
	ownKeys(target) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		const keys = /* @__PURE__ */ new Set();
		array.forEach((el, i) => keys.add(i.toString()));
		Object.getOwnPropertyNames(array).forEach((k) => keys.add(k));
		if (selected) Object.getOwnPropertyNames(selected).forEach((k) => keys.add(k));
		return Array.from(keys);
	}
	defineProperty(target, name, desc) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected) {
			Object.defineProperty(selected, name, desc);
			return true;
		}
		return false;
	}
	apply(target, self, args) {
		args[0] ||= this.selector;
		this.selector = target?.apply?.(self, args) || this.selector;
		return new Proxy(target, this);
	}
};
var Q = (selector, host = document.documentElement, index = 0, direction = "children") => {
	if ((selector?.element ?? selector) instanceof HTMLElement) {
		const el = selector?.element ?? selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (typeof selector == "function") {
		const el = selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (host == null || typeof host == "string" || typeof host == "number" || typeof host == "boolean" || typeof host == "symbol" || typeof host == "undefined") return null;
	if (existsQueries?.get?.(host)?.has?.(selector)) return existsQueries?.get?.(host)?.get?.(selector);
	return existsQueries?.getOrInsert?.(host, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(selector, () => {
		return new Proxy(host, new UniversalElementHandler(selector, index, direction));
	});
};
//#endregion
//#region shared/fest/lure/lure/context/Reflect.ts
var $entries = (obj) => {
	if (isPrimitive(obj)) return [];
	if (Array.isArray(obj)) return obj.map((item, idx) => [idx, item]);
	if (obj instanceof Map) return Array.from(obj.entries());
	if (obj instanceof Set) return Array.from(obj.values());
	return Array.from(Object.entries(obj));
};
var reflectAttributes = (element, attributes) => {
	if (!attributes) return element;
	const weak = new WeakRef(attributes), wel = new WeakRef(element);
	if (typeof attributes == "object" || typeof attributes == "function") {
		$entries(attributes).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), prop, value);
		});
		const usub = affected(attributes, (value, prop) => {
			handleAttribute(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleAttribute, weak, true);
		});
		addToCallChain(attributes, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid attributes object:", attributes);
};
var reflectARIA = (element, aria) => {
	if (!aria) return element;
	const weak = new WeakRef(aria), wel = new WeakRef(element);
	if (typeof aria == "object" || typeof aria == "function") {
		$entries(aria).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value);
		});
		const usub = affected(aria, (value, prop) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value, true);
			bindHandler(wel, value, prop, handleAttribute, weak, true);
		});
		addToCallChain(aria, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid ARIA object:", aria);
	return element;
};
var reflectDataset = (element, dataset) => {
	if (!dataset) return element;
	const weak = new WeakRef(dataset), wel = new WeakRef(element);
	if (typeof dataset == "object" || typeof dataset == "function") {
		$entries(dataset).forEach(([prop, value]) => {
			handleDataset(wel?.deref?.(), prop, value);
		});
		const usub = affected(dataset, (value, prop) => {
			handleDataset(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
		});
		addToCallChain(dataset, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid dataset object:", dataset);
	return element;
};
var reflectStyles = (element, styles) => {
	if (!styles) return element;
	if (typeof styles == "string") applyNormalizedInlineStyle(element, styles);
	else if (typeof styles?.value == "string") affected([styles, "value"], (val) => {
		applyNormalizedInlineStyle(element, val ?? "");
	});
	else if (typeof styles == "object" || typeof styles == "function") {
		const weak = new WeakRef(styles), wel = new WeakRef(element);
		$entries(styles).forEach(([prop, value]) => {
			handleStyleChange(wel?.deref?.(), prop, value);
		});
		const usub = affected(styles, (value, prop) => {
			handleStyleChange(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleStyleChange, weak?.deref?.());
		});
		addToCallChain(styles, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid styles object:", styles);
	return element;
};
var reflectWithStyleRules = async (element, rule) => {
	return reflectStyles(element, await rule?.(element));
};
var reflectProperties = (element, properties) => {
	if (!properties) return element;
	const weak = new WeakRef(properties), wel = new WeakRef(element);
	const onChange = (ev) => {
		const input = Q("input", ev?.target);
		if (input?.value != null && isNotEqual(input?.value, properties?.value)) properties.value = input?.value;
		if (input?.valueAsNumber != null && isNotEqual(input?.valueAsNumber, properties?.valueAsNumber)) properties.valueAsNumber = input?.valueAsNumber;
		if (input?.checked != null && isNotEqual(input?.checked, properties?.checked)) properties.checked = input?.checked;
	};
	$entries(properties).forEach(([prop, value]) => {
		handleProperty(wel?.deref?.(), prop, value);
	});
	const usub = affected(properties, (value, prop) => {
		const el = wel.deref();
		if (el) if (prop == "checked") setChecked(el, value);
		else bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
	});
	addToCallChain(properties, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	element.addEventListener("change", onChange);
	return element;
};
var reflectClassList = (element, classList) => {
	if (!classList) return element;
	const wel = new WeakRef(element);
	$entries(classList).forEach(([prop, value]) => {
		const el = element;
		if (typeof value == "undefined" || value == null) {
			if (el.classList.contains(value)) el.classList.remove(value);
		} else if (!el.classList.contains(value)) el.classList.add(value);
	});
	const usub = iterated(classList, (value) => {
		const el = wel?.deref?.();
		if (el) {
			if (typeof value == "undefined" || value == null) {
				if (el.classList.contains(value)) el.classList.remove(value);
			} else if (!el.classList.contains(value)) el.classList.add(value);
		}
	});
	addToCallChain(classList, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	return element;
};
//#endregion
//#region shared/fest/lure/lure/context/ReflectChildren.ts
var makeUpdater = (defaultParent = null, mapper, isArray = true) => {
	const commandBuffer = [];
	const merge = () => {
		commandBuffer?.forEach?.(([fn, args]) => fn?.(...args));
		commandBuffer?.splice?.(0, commandBuffer?.length);
	};
	const updateChildList = (newEl, idx, oldEl, op, boundParent = null) => {
		const $requestor = isValidParent$1(boundParent) ?? isValidParent$1(defaultParent);
		const newNode = getNode(newEl, mapper, idx, $requestor);
		const oldNode = getNode(oldEl, mapper, idx, $requestor);
		let element = isValidParent$1(newNode?.parentElement ?? oldNode?.parentElement) ?? $requestor;
		if (!element) return;
		if (defaultParent != element) defaultParent = element;
		const oldIdx = indexOf(element, oldNode);
		if ([
			"@add",
			"@set",
			"@delete"
		].indexOf(op || "") >= 0 || !op) {
			if (newNode == null && oldNode != null || op == "@delete") commandBuffer?.push?.([removeChild, [
				element,
				oldNode,
				null,
				oldIdx >= 0 ? oldIdx : idx
			]]);
			else if (newNode != null && oldNode == null || op == "@add") commandBuffer?.push?.([appendChild, [
				element,
				newNode,
				null,
				idx
			]]);
			else if (newNode != null && oldNode != null || op == "@set") commandBuffer?.push?.([replaceChildren, [
				element,
				newNode,
				null,
				oldIdx >= 0 ? oldIdx : idx,
				oldNode
			]]);
		}
		if (op && op != "@get" && [
			"@add",
			"@set",
			"@delete"
		].indexOf(op) >= 0 || !op && !isArray) merge?.();
	};
	return updateChildList;
};
var asArray$2 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var reformChildren = (element, children = [], mapper) => {
	if (!children || !element) return element;
	mapper = (children?.[$mapped] ? children?.mapper : mapper) ?? mapper;
	children = (children?.[$mapped] ? children?.children : children) ?? children;
	const keys = Array.from(children?.keys?.() || []);
	const cvt = asArray$2(children)?.map?.((nd, index) => getNode(nd, mapper, keys?.[index] ?? index, element));
	removeNotExists(element, cvt);
	cvt?.forEach?.((nd) => appendChild(element, nd));
	return element;
};
//#endregion
//#region shared/fest/lure/lure/node/Changeable.ts
var Ch = class {
	#stub = document.createComment("");
	#valueRef;
	#fragments;
	#updater = null;
	#internal = null;
	#updating = false;
	#options = {};
	#oldNode;
	#mapCb = null;
	#T = null;
	#boundParent = null;
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, null, false);
			this.#internal ??= affected?.([this.#valueRef, "value"], this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (value instanceof HTMLElement && isValidParent$1(value) && value != this.#boundParent) {
			this.#boundParent = value;
			this.makeUpdater(value);
			if (this.#oldNode) {
				this.#oldNode?.parentNode != null && this.#oldNode?.remove?.();
				this.#oldNode = null;
			}
			this.element;
		}
	}
	constructor(valueRef, mapCb = (el) => el, options = null) {
		this.#stub = document.createComment("");
		if (hasValue(mapCb) && (typeof valueRef == "function" || typeof valueRef == "object") && !hasValue(valueRef)) [valueRef, mapCb] = [mapCb, valueRef];
		if (!options && mapCb != null && typeof mapCb == "object" && !hasValue(mapCb)) options = mapCb;
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#oldNode = null;
		this.#valueRef = (!hasValue(valueRef) ? mapCb?.(valueRef, -1) : valueRef) ?? valueRef;
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
	}
	$getNodeBy(requestor, value) {
		const node = isPrimitive(hasValue(value) ? value?.value : value) ? this.#T ??= T(value) : getNode(value, value == requestor ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(value) || hasValue(value))) this.#T.textContent = "" + (value?.value ?? (isPrimitive(value) ? value : ""));
		return node;
	}
	$getNode(requestor, reassignOldNode = true) {
		const node = isPrimitive(this.#valueRef?.value) ? this.#T ??= T(this.#valueRef) : getNode(this.#valueRef?.value, requestor == this.#valueRef?.value ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(this.#valueRef) || hasValue(this.#valueRef))) this.#T.textContent = "" + (isPrimitive(this.#valueRef) ? this.#valueRef : this.#valueRef?.value ?? "");
		if (node != null && reassignOldNode) this.#oldNode = node;
		return node;
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		Promise.try(() => {
			const element = this.$getNode(requestor);
			if (!element || !requestor || element?.contains?.(requestor) || requestor == element) return;
			if (requestor instanceof HTMLElement && isValidParent$1(requestor)) if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				observer.observe(requestor, { childList: true });
			}
		})?.catch?.(console.warn.bind(console));
		return this.element;
	}
	get self() {
		const existsNode = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? existsNode;
	}
	get element() {
		const children = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	_onUpdate(newVal, idx, oldVal, op) {
		if (isPrimitive(oldVal) && isPrimitive(newVal)) return;
		let oldEl = isPrimitive(oldVal) ? this.#oldNode : this.$getNodeBy(this.boundParent, oldVal);
		let newEl = this.$getNode(this.boundParent, false) ?? this.#stub;
		if (oldEl && !oldEl?.parentNode || this.#oldNode?.parentNode) oldEl = this.#oldNode ?? oldEl;
		let updated = this.#updater?.(newEl, indexOf(this.boundParent, oldEl), oldEl, op, this.boundParent);
		if (newEl != null && newEl != this.#oldNode) this.#oldNode = newEl;
		else if (newEl == null && oldEl != this.#oldNode) this.#oldNode = oldEl;
		return updated;
	}
};
var isWeakCompatible$1 = (key) => {
	return (typeof key == "object" || typeof key == "function" || typeof key == "symbol") && key != null;
};
var C = (observable, mapCb, boundParent = null) => {
	let Te = null;
	if (observable instanceof HTMLElement) return Q(observable);
	if (observable == null) return document.createComment(":NULL:");
	const checkable = (typeof mapCb == "function" ? mapCb(observable, -1) : observable) ?? observable;
	if (isPrimitive(checkable)) return Te ??= T(checkable);
	if (Te != null && isPrimitive(checkable)) Te.textContent = "" + checkable;
	if (checkable != null && hasValue(checkable)) {
		if (isPrimitive(checkable?.value)) return checkable?.value != null ? Te ??= T(checkable?.value) : document.createComment(":NULL:");
		else if (typeof checkable == "object" || typeof checkable == "function") return elMap.getOrInsertComputed(isWeakCompatible$1(observable) ? observable : checkable, () => {
			return new Ch(observable, mapCb, boundParent);
		});
	}
	return getNode(checkable, null, -1, boundParent);
};
//#endregion
//#region shared/fest/lure/lure/context/Utils.ts
var KIDNAP_WITHOUT_HANG = (el, requestor) => {
	return (requestor && requestor != el && !el?.contains?.(requestor) && isValidParent$1(requestor) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
};
var isElementValue = (el, requestor) => {
	return KIDNAP_WITHOUT_HANG(el, requestor) ?? (hasValue(el) && isElement(el?.value) ? el?.value : el);
};
var elMap = /* @__PURE__ */ new WeakMap();
var tmMap = /* @__PURE__ */ new WeakMap();
var getMapped = (obj) => {
	if (isPrimitive(obj)) return obj;
	if (hasValue(obj) && isPrimitive(obj?.value)) return tmMap?.get(obj);
	return elMap?.get?.(obj);
};
var $promiseResolvedMap = /* @__PURE__ */ new WeakMap();
var $makePromisePlaceholder = (promised, getNodeCb) => {
	if ($promiseResolvedMap?.has?.(promised)) return $promiseResolvedMap?.get?.(promised);
	const comment = document.createComment(":PROMISE:");
	promised?.then?.((elem) => {
		const element = typeof getNodeCb == "function" ? getNodeCb(elem) : elem;
		$promiseResolvedMap?.set?.(promised, element);
		queueMicrotask(() => {
			try {
				if (typeof comment?.replaceWith == "function") {
					if (!comment?.isConnected) return;
					if (isElement(element)) comment?.replaceWith?.(element);
				} else if (comment?.isConnected && isElement(element)) comment?.parentNode?.replaceChild?.(comment, element);
			} catch (error) {
				if (!comment?.isConnected) return;
				comment?.remove?.();
			}
		});
	});
	return comment;
};
var $getBase = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = $getBase(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => $getBase(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return el;
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el);
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return $getBase(el?.(), mapper, index, requestor);
	if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var $getLeaf = (el, requestor) => {
	return isElementValue(el, requestor) ?? isElement(el);
};
var $getNode = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = getNode(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => getNode(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return isElementValue(el, requestor);
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el)?.element;
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return getNode(el?.(), mapper, index, requestor);
	else if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var isWeakCompatible = (el) => {
	return (typeof el == "object" || typeof el == "function" || typeof el == "symbol") && el != null;
};
var __nodeGuard = /* @__PURE__ */ new WeakSet();
var __getNode = (el, mapper, index = -1, requestor) => {
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => __getNode(nd, mapper, index, requestor));
	if (isWeakCompatible(el) && !isElement(el)) {
		if (elMap.has(el)) {
			const obj = getMapped(el) ?? $getBase(el, mapper, index, requestor);
			return $getLeaf(obj instanceof WeakRef ? obj?.deref?.() : obj, requestor);
		}
		const $node = $getBase(el, mapper, index, requestor);
		if (!mapper && $node != null && $node != el && isWeakCompatible(el) && !isElement(el)) elMap.set(el, $node);
		return $getLeaf($node, requestor);
	}
	return $getNode(el, mapper, index, requestor);
};
var getNode = (el, mapper, index = -1, requestor) => {
	if (isWeakCompatible(el) && __nodeGuard.has(el)) return getMapped(el) ?? isElement(el);
	if (isWeakCompatible(el)) __nodeGuard.add(el);
	const result = __getNode(el, mapper, index, requestor);
	if (isWeakCompatible(el)) __nodeGuard.delete(el);
	return result;
};
var appendOrEmplaceByIndex = (parent, child, index = -1) => {
	if (isElement(child) && child != null && child?.parentNode != parent) if (Number.isInteger(index) && index >= 0 && index < parent?.childNodes?.length) parent?.insertBefore?.(child, parent?.childNodes?.[index]);
	else parent?.append?.(child);
};
var appendFix = (parent, child, index = -1) => {
	if (!isElement(child) || parent == child || child?.parentNode == parent) return;
	child = child?._onUpdate ? KIDNAP_WITHOUT_HANG(child, parent) : child;
	if (!child?.parentNode && isElement(child)) {
		appendOrEmplaceByIndex(parent, child, index);
		return;
	}
	if (parent?.parentNode == child?.parentNode) return;
	if (isElement(child)) appendOrEmplaceByIndex(parent, child, index);
};
var asArray$1 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var appendArray = (parent, children, mapper, index = -1) => {
	const len = children?.length ?? 0;
	if (Array.isArray(unwrap(children)) || children instanceof Map || children instanceof Set) {
		const list = asArray$1(children)?.map?.((cl, I) => getNode(cl, mapper, I, parent))?.filter?.((el) => el != null);
		const frag = document.createDocumentFragment();
		list?.forEach?.((cl) => appendFix(frag, cl));
		appendFix(parent, frag, index);
	} else {
		const node = getNode(children, mapper, len, parent);
		if (node != null) appendFix(parent, node, index);
	}
};
var appendChild = (element, cp, mapper, index = -1) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) appendArray(element, cp?.children, null, index);
	else appendArray(element, cp, null, index);
};
var dePhantomNode = (parent, node, index = -1) => {
	if (!parent) return node;
	if (node?.parentNode == parent && node?.parentNode != null) return node;
	else if (node?.parentNode != parent && !isValidParent$1(node?.parentNode)) {
		if (Number.isInteger(index) && index >= 0 && Array.from(parent?.childNodes || [])?.length > index) return parent.childNodes?.[index];
	}
	return node;
};
var replaceOrSwap = (parent, oldEl, newEl) => {
	if (oldEl?.parentNode) if (oldEl?.parentNode == newEl?.parentNode) {
		parent = oldEl?.parentNode ?? parent;
		if (oldEl.nextSibling === newEl) parent.insertBefore(newEl, oldEl);
		else if (newEl.nextSibling === oldEl) parent.insertBefore(oldEl, newEl);
		else {
			const nextSiblingOfElement1 = oldEl.nextSibling;
			parent.replaceChild(newEl, oldEl);
			parent.insertBefore(oldEl, nextSiblingOfElement1);
		}
	} else oldEl?.replaceWith?.(newEl);
};
var replaceChildren = (element, cp, mapper, index = -1, old) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (!element) element = old?.parentNode;
	const cn = dePhantomNode(element, getNode(old, mapper, index), index);
	if (cn instanceof Text && typeof cp == "string") cn.textContent = cp;
	else if (cp != null) {
		const node = getNode(cp);
		if (cn?.parentNode == element && cn != node && cn instanceof Text && node instanceof Text) {
			if (cn?.textContent != node?.textContent) cn.textContent = node?.textContent?.trim?.() ?? "";
		} else if (cn?.parentNode == element && cn != node && cn != null && cn?.parentNode != null) replaceOrSwap(element, cn, node);
		else if (cn?.parentNode != element || cn?.parentNode == null) appendChild(element, node, null, index);
	}
};
var removeChild = (element, cp, mapper, index = -1) => {
	const $node = getNode(cp, mapper);
	if (!element) element = $node?.parentNode;
	if (Array.from(element?.childNodes ?? [])?.length < 1) return;
	const whatToRemove = dePhantomNode(element, $node, index);
	if (whatToRemove?.parentNode == element) whatToRemove?.remove?.();
	return element;
};
var removeNotExists = (element, children, mapper) => {
	const list = Array.from(unwrap(children) || [])?.map?.((cp, index) => getNode(cp, mapper, index));
	Array.from(element.childNodes).forEach((nd) => {
		if (!list?.find?.((cp) => !isNotEqual?.(cp, nd))) nd?.remove?.();
	});
	return element;
};
var T = (ref) => {
	if (isPrimitive(ref) && ref != null) return document.createTextNode(ref);
	if (ref == null) return document.createComment(":NULL:");
	return tmMap.getOrInsertComputed(ref, () => {
		const element = document.createTextNode(((hasValue(ref) ? ref?.value : ref) ?? "")?.trim?.() ?? "");
		affected([ref, "value"], (val) => {
			element.textContent = ("" + (val?.innerText ?? val?.textContent ?? val?.value ?? val ?? ""))?.trim?.() ?? "";
		});
		return element;
	});
};
//#endregion
//#region shared/fest/lure/lure/node/Mapped.ts
var asArray = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var Mp = class {
	#observable;
	#fragments;
	#mapCb;
	#reMap;
	#pmMap;
	#updater = null;
	#internal = null;
	#options = {};
	#stub = document.createComment("");
	#indexMap = /* @__PURE__ */ new Map();
	#boundParent = null;
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), Array.isArray(this.#observable));
			this.#internal ??= iterated?.(this.#observable, this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (value instanceof HTMLElement && isValidParent$1(value) && value != this.#boundParent) {
			this.#boundParent = value;
			this.makeUpdater(value);
			this.element;
		}
	}
	constructor(observable, mapCb = (el) => el, options = null) {
		if (isObservable(mapCb) && (typeof observable == "function" || typeof observable == "object") && !isObservable(observable)) [observable, mapCb] = [mapCb, observable];
		if (!options && mapCb != null && typeof mapCb == "object" && !isObservable(mapCb)) options = mapCb;
		this.#stub = document.createComment("");
		this.#reMap = /* @__PURE__ */ new WeakMap();
		this.#pmMap = /* @__PURE__ */ new Map();
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#observable = (isObservable(observable) ? observable : observable?.iterator ?? mapCb?.iterator ?? observable) ?? [];
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
		if (!this.boundParent) {
			if (this.#options.preMap) {
				reformChildren(this.#fragments, this.#observable, this.mapper.bind(this));
				if (this.#fragments.childNodes.length === 0) this.#fragments.appendChild(this.#stub);
			}
		}
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		Promise.try(() => {
			const element = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
			if (!element || !requestor || element?.contains?.(requestor) || requestor == element) return;
			if (requestor instanceof HTMLElement && isValidParent$1(requestor)) if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				observer.observe(requestor, { childList: true });
			}
		})?.catch?.(console.warn.bind(console));
		return this.element;
	}
	get children() {
		return asArray(this.#observable);
	}
	get self() {
		const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? reformChildren(this.#fragments, this.#observable, this.mapper.bind(this));
	}
	get element() {
		const children = this.#fragments?.childNodes?.length > 0 ? this.#fragments : getNode(this.#observable?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	get mapper() {
		return (...args) => {
			if (args?.[0] == null) return null;
			if (args?.[0] instanceof Node) return args?.[0];
			if (args?.[0] instanceof Promise || typeof (args?.[0])?.then == "function") return null;
			if ((args?.[1] == null || args?.[1] < 0 || typeof args?.[1] != "number" || !canBeInteger(args?.[1])) && (Array.isArray(this.#observable) || this.#observable instanceof Set)) return;
			if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null && this.#observable instanceof Set) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null && this.#observable instanceof Map) if (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol") return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
			else if (typeof args?.[1] == "object" || typeof args?.[1] == "function" || typeof args?.[1] == "symbol") return this.#reMap.getOrInsert(args?.[1], this.#mapCb(...args));
			else return this.#pmMap.getOrInsert(args?.[1], this.#mapCb(...args));
			if (args?.[0] != null) if (this.#options?.uniquePrimitives && isPrimitive(args?.[0])) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			else return this.#mapCb(...args);
		};
	}
	_onUpdate(newEl, idx, oldEl, op = "") {
		if (op == "@add" || newEl != null && oldEl == null) {
			if (this.#indexMap.has(idx)) return;
			const withElement = C(ref(this.#observable, idx), (...args) => {
				if (args?.[1] == null || args?.[1] < 0) args[1] = idx ?? args?.[1];
				return this.mapper(...args);
			});
			this.#indexMap.set(idx, withElement);
			appendChild(this.boundParent, withElement, null, idx);
		}
		if (op == "@delete" || newEl == null && oldEl != null) {
			const withElement = this.#indexMap.get(idx);
			if (withElement) removeChild(this.boundParent, withElement, null, idx);
			this.#indexMap.delete(idx);
		}
	}
	*[Symbol.iterator]() {
		let i = 0;
		if (this.#observable) for (let el of this.#observable) yield this.mapper(el, i++);
	}
};
var M = (observable, mapCb, boundParent = null) => {
	return new Mp(observable, mapCb, boundParent);
};
//#endregion
//#region shared/fest/lure/lure/node/Bindings.ts
var Qp = (ref, host = document.documentElement) => {
	if (ref?.value == null) return Q(ref, host);
	const actual = Q(ref?.value, host);
	affected(ref, (value, prop) => actual?._updateSelector(value));
	return actual;
};
var $createElement = (selector) => {
	if (typeof selector == "string") {
		const nl = Qp(createElementVanilla(selector));
		return nl?.element ?? nl;
	} else if (selector instanceof HTMLElement || selector instanceof Element || selector instanceof DocumentFragment || selector instanceof Document || selector instanceof Node) return selector;
	else return null;
};
var E = (selector, params = {}, children) => {
	const element = getNode(typeof selector == "string" ? $createElement(selector) : selector, null, -1);
	if (element && children) M(children, (el) => el, element);
	if (element && params) {
		if (params.ctrls != null) reflectControllers(element, params.ctrls);
		if (params.attributes != null) reflectAttributes(element, params.attributes);
		if (params.properties != null) reflectProperties(element, params.properties);
		if (params.classList != null) reflectClassList(element, params.classList);
		if (params.behaviors != null) reflectBehaviors(element, params.behaviors);
		if (params.dataset != null) reflectDataset(element, params.dataset);
		if (params.stores != null) reflectStores(element, params.stores);
		if (params.mixins != null) reflectMixins(element, params.mixins);
		if (params.style != null) reflectStyles(element, params.style);
		if (params.aria != null) reflectARIA(element, params.aria);
		if ("value" in params) bindWith(element, "value", params.value, handleProperty, params, true);
		if ("placeholder" in params) bindWith(element, "placeholder", params.placeholder, handleProperty, params, true);
		if (params.is != null) bindWith(element, "is", params.is, handleAttribute, params, true);
		if (params.role != null) bindWith(element, "role", params.role, handleProperty, params);
		if (params.slot != null) bindWith(element, "slot", params.slot, handleProperty, params);
		if (params.part != null) bindWith(element, "part", params.part, handleAttribute, params, true);
		if (params.name != null) bindWith(element, "name", params.name, handleAttribute, params, true);
		if (params.type != null) bindWith(element, "type", params.type, handleAttribute, params, true);
		if (params.icon != null) bindWith(element, "icon", params.icon, handleAttribute, params, true);
		if (params.inert != null) bindWith(element, "inert", params.inert, handleAttribute, params, true);
		if (params.hidden != null) bindWith(element, "hidden", params.visible ?? params.hidden, handleHidden, params);
		if (params.on != null) addEventsList(element, params.on);
		if (params.rules != null) params.rules.forEach?.((rule) => reflectWithStyleRules(element, rule));
	}
	return Q(element);
};
//#endregion
//#region shared/fest/lure/lure/node/Normalizer.ts
function getIndentColumns(line, tabWidth = 4) {
	let col = 0;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === " ") col += 1;
		else if (ch === "	") col += tabWidth - col % tabWidth;
		else break;
	}
	return col;
}
function stripIndentColumns(line, columns, tabWidth = 4) {
	let col = 0, i = 0;
	while (i < line.length && col < columns) {
		const ch = line[i];
		if (ch === " ") {
			col += 1;
			i++;
		} else if (ch === "	") {
			col += tabWidth - col % tabWidth;
			i++;
		} else break;
	}
	return line.slice(i);
}
function pickEOL(s) {
	if (s.includes("\r\n")) return "\r\n";
	if (s.includes("\r")) return "\r";
	return "\n";
}
function gcd(a, b) {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b) [a, b] = [b, a % b];
	return a;
}
function detectIndentStep(text, { ignoreFirstLine = true, tabWidth = 4 } = {}) {
	const lines = text.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const indents = [];
	for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		indents.push(getIndentColumns(ln, tabWidth));
	}
	if (indents.length === 0) return {
		min: 0,
		step: 0,
		allEven: true,
		allDiv4: true
	};
	const min = Math.min(...indents);
	const shifted = indents.map((v) => v - min).filter((v) => v > 0);
	let step = 0;
	for (const v of shifted) step = step ? gcd(step, v) : v;
	const allEven = indents.every((v) => v % 2 === 0);
	const allDiv4 = indents.every((v) => v % 4 === 0);
	if (step === 0) step = allDiv4 ? 4 : allEven ? 2 : 1;
	else if (step % 4 === 0) step = 4;
	else if (step % 2 === 0) step = 2;
	else step = 1;
	return {
		min,
		step,
		allEven,
		allDiv4
	};
}
function adjustIndentToGrid(line, step, mode = "floor", tabWidth = 4) {
	if (!step || step <= 1) return line;
	const cur = getIndentColumns(line, tabWidth);
	if (cur === 0) return line;
	let target;
	if (mode === "nearest") target = Math.round(cur / step) * step;
	else if (mode === "ceil") target = Math.ceil(cur / step) * step;
	else target = Math.floor(cur / step) * step;
	const delta = cur - target;
	if (delta > 0) return stripIndentColumns(line, delta, tabWidth);
	else if (delta < 0) return " ".repeat(-delta) + line;
	return line;
}
function normalizeStartTagWhitespace(html, { scope = "void-only" } = {}) {
	if (!html || typeof html !== "string") return html;
	const VOID = new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	let out = "";
	let i = 0;
	const n = html.length;
	while (i < n) {
		const ch = html[i];
		if (ch !== "<") {
			out += ch;
			i++;
			continue;
		}
		if (html.startsWith("<!--", i)) {
			const end = html.indexOf("-->", i + 4);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 3);
			i = end + 3;
			continue;
		}
		if (html[i + 1] === "!" || html[i + 1] === "?") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		if (html[i + 1] === "/") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		let j = i + 1;
		while (j < n && /\s/.test(html[j])) j++;
		const nameStart = j;
		while (j < n && /[A-Za-z0-9:-]/.test(html[j])) j++;
		const tagName = html.slice(nameStart, j).toLowerCase();
		let k = j;
		let quote = null;
		while (k < n) {
			const c = html[k];
			if (quote) {
				if (c === quote) quote = null;
				k++;
			} else if (c === "\"" || c === "'") {
				quote = c;
				k++;
			} else if (c === ">") break;
			else k++;
		}
		if (k >= n) {
			out += html.slice(i);
			break;
		}
		const rawTag = html.slice(i, k + 1);
		if (!(scope === "all" || scope === "input-only" && tagName === "input" || scope === "void-only" && VOID.has(tagName))) {
			out += rawTag;
			i = k + 1;
			continue;
		}
		let res = "";
		let q = null;
		let ws = false;
		for (let p = 0; p < rawTag.length; p++) {
			const c = rawTag[p];
			if (q) {
				res += c;
				if (c === q) q = null;
				continue;
			}
			if (c === "\"" || c === "'") {
				q = c;
				res += c;
				ws = false;
				continue;
			}
			if (c === "\n" || c === "\r" || c === "	" || c === " ") {
				if (!ws) {
					res += " ";
					ws = true;
				}
				continue;
			}
			res += c;
			ws = false;
		}
		res = res.replace(/\s*(\/?)\s*>$/, "$1>");
		out += res;
		i = k + 1;
	}
	return out;
}
function collapseInterTagWhitespaceSmart(html, { preserveCommentGaps = true } = {}) {
	if (!html || typeof html !== "string") return html;
	if (!preserveCommentGaps) return html.replace(/>\s+</g, "><");
	const SENT = "";
	let s = html;
	s = s.replace(/-->([^\S\r\n]+)<!--/g, `-->${SENT}<!--`).replace(/-->([^\S\r\n]+)</g, `-->${SENT}<`).replace(/>([^\S\r\n]+)<!--/g, `>${SENT}<!--`);
	s = s.replace(/>\s+</g, "><");
	s = s.replace(new RegExp(SENT, "g"), " ");
	return s;
}
function cleanupInterTagWhitespaceAndIndent(html, { normalizeIndent = true, ignoreFirstLine = true, tabWidth = 4, alignStep = "auto", quantize = "none" } = {}) {
	if (!html || typeof html !== "string" || html.indexOf("<") === -1) return html;
	html = html?.trim?.();
	const placeholders = [];
	const protectedHtml = html.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
		return `\u0000${placeholders.push(m) - 1}\u0000`;
	});
	const eol = pickEOL(protectedHtml);
	const lines = protectedHtml.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const { min, step: autoStep } = detectIndentStep(protectedHtml, {
		ignoreFirstLine,
		tabWidth
	});
	if (normalizeIndent && min > 0) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = stripIndentColumns(ln, min, tabWidth);
	}
	let step = alignStep === "auto" ? autoStep : alignStep;
	if (quantize !== "none" && step > 1) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = adjustIndentToGrid(ln, step, quantize, tabWidth);
	}
	let working = lines.join(eol);
	working = normalizeStartTagWhitespace(working, { scope: "void-only" });
	working = collapseInterTagWhitespaceSmart(working);
	return working.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i])?.trim?.();
}
function checkInsideTagBlock(contextParts, ...str) {
	const current = str?.[0] ?? "";
	const idx = contextParts.indexOf(current);
	if (idx < 0) {
		const tail = str?.join?.("") ?? "";
		return /<([A-Za-z\/!?])[\w\W]*$/.test(tail) && !/>[\w\W]*$/.test(tail);
	}
	const prefix = contextParts.slice(0, idx + 1).join("");
	let inTag = false, inSingle = false, inDouble = false;
	for (let i = 0; i < prefix.length; i++) {
		const ch = prefix[i];
		const next = prefix[i + 1] ?? "";
		if (!inTag) {
			if (ch === "<") {
				if (/[A-Za-z\/!?]/.test(next)) {
					inTag = true;
					inSingle = false;
					inDouble = false;
				}
			}
			continue;
		}
		if (!inSingle && !inDouble) {
			if (ch === "\"") {
				inDouble = true;
				continue;
			}
			if (ch === "'") {
				inSingle = true;
				continue;
			}
			if (ch === ">") {
				inTag = false;
				continue;
			}
		} else if (inDouble) {
			if (ch === "\"") {
				inDouble = false;
				continue;
			}
		} else if (inSingle) {
			if (ch === "'") {
				inSingle = false;
				continue;
			}
		}
	}
	return inTag;
}
//#endregion
//#region shared/fest/lure/lure/node/Syntax.ts
var EMap = /* @__PURE__ */ new WeakMap(), parseTag = (str) => {
	const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/);
	if (!match) return {
		tag: str,
		id: null,
		className: null
	};
	const [, tag = "div", id, classStr] = match;
	return {
		tag,
		id,
		className: classStr ? classStr.replace(/\./g, " ").trim() : null
	};
};
var parseIndex = (value) => {
	if (typeof value != "string" || !value?.trim?.()) return -1;
	const exact = value.match(/^#\{(\d+)\}$/);
	if (exact) return parseInt(exact[1] ?? "-1", 10);
	const embedded = value.match(/#\{(\d+)\}/);
	return embedded ? parseInt(embedded[1] ?? "-1", 10) : -1;
};
var connectElement = (el, atb, psh, mapped) => {
	if (!el) return el;
	if (el != null) {
		const entriesIdc = [];
		const addEntryIfExists = (name) => {
			const attr = Array.from(el?.attributes || []).find((attr) => attr.name == name && attr.value?.includes?.("#{"));
			if (attr) {
				const pair = [name, parseIndex(attr?.value) ?? -1];
				entriesIdc.push(pair);
				return pair;
			}
			return [name, -1];
		};
		[
			"dataset",
			"style",
			"classList",
			"visible",
			"aria",
			"value",
			"placeholder",
			"ref"
		].forEach((name) => addEntryIfExists(name));
		const makeEntries = (startsWith, except) => {
			const entries = [];
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value);
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "") && atbIndex >= 0 && !excepted) entries.push([trueAttributeName, atbIndex]);
			}
			return entries;
		};
		const makeCumulativeEntries = (startsWith, except, specific = "") => {
			const entriesMap = /* @__PURE__ */ new Map();
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value) ?? -1;
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				const isSpecific = (Array.isArray(specific) ? specific?.some?.((str) => attr.name === str) : attr.name === specific) && specific !== "";
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "" || isSpecific) && atbIndex >= 0 && !excepted) {
					const key = isSpecific ? attr.name : trueAttributeName;
					if (!entriesMap.has(key)) entriesMap.set(key, []);
					entriesMap.get(key)?.push(atbIndex);
				}
			}
			return Array.from(entriesMap.entries());
		};
		let attributesEntries = makeEntries(["attr:", ""], [
			"ref",
			"value",
			"placeholder"
		]);
		let propertiesEntries = makeEntries(["prop:"], []);
		let onEntries = makeCumulativeEntries(["on:", "@"], [], "");
		let refEntries = makeCumulativeEntries(["ref:"], [], ["ref"]);
		const bindings = Object.fromEntries(entriesIdc?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.attributes = Object.fromEntries(attributesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.properties = Object.fromEntries(propertiesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.on = Object.fromEntries(onEntries?.filter?.((pair) => pair[1]?.some?.((idx) => idx >= 0))?.map?.((pair) => [pair[0], pair[1]?.map?.((idx) => atb?.[idx]).filter((v) => v != null)]) ?? []);
		const refIndex = entriesIdc?.find?.((pair) => pair[0] == "ref" && pair[1] >= 0)?.[1];
		if (refIndex != null && refIndex >= 0) {
			const ref = atb?.[refIndex];
			if (typeof ref == "function") ref?.(el);
			else if (ref != null && typeof ref == "object") ref.value = el;
		}
		refEntries?.forEach?.((pair) => {
			(pair?.[1]?.filter?.((idx) => idx != null && idx >= 0)?.map?.((idx) => atb?.[idx])?.filter?.((v) => v != null))?.forEach?.((ref) => {
				if (typeof ref == "function") ref?.(el);
				else if (ref != null && typeof ref == "object") ref.value = el;
			});
		});
		const clearPlaceholdersFromAttributesOfElement = (el) => {
			if (el == null) return;
			const attributeIsInRegistry = (name) => {
				return attributesEntries?.some?.((pair) => pair[0] == name) || entriesIdc?.some?.((pair) => pair[0] == name) || name?.startsWith?.("ref:") || name == "ref";
			};
			for (const attr of Array.from(el?.attributes || [])) if (attr.value?.includes?.("#{") && attr.value?.includes?.("}") && attributeIsInRegistry(attr.name) || attr.value?.startsWith?.("#{") && attr.value?.endsWith?.("}") || attr.name?.includes?.(":") || attr.name?.includes?.("ref:") || attr.name == "ref") el?.removeAttribute?.(attr.name);
			for (const attr of Array.from(el?.attributes || [])) if (typeof attr.value == "string" && /#\{\d+\}/.test(attr.value)) el?.removeAttribute?.(attr.name);
		};
		clearPlaceholdersFromAttributesOfElement(el);
		pruneEmptyStyleAttribute(el);
		if (!EMap?.has?.(el)) EMap?.set?.(el, E(el, bindings));
	}
	return EMap?.get?.(el) ?? el;
};
var linearBuilder = (strings, ...values) => {
	const nodes = [];
	for (let i = 0; i < strings?.length; i++) {
		const str = strings?.[i];
		const val = values?.[i];
		nodes.push(H(str));
		nodes.push(val);
	}
	if (nodes?.length <= 1) return getNode(nodes?.[0], null, 0);
	const fragment = document.createDocumentFragment();
	fragment.append(...nodes?.filter?.((nd) => nd != null)?.map?.((en, i) => getNode(en, null, i))?.filter?.((nd) => nd != null));
	return fragment;
};
function html(strings, ...values) {
	if (strings?.at?.(0)?.trim?.()?.startsWith?.("<") && strings?.at?.(-1)?.trim?.()?.endsWith?.(">")) return htmlBuilder({ createElement: null })(strings, ...values);
	return linearBuilder(strings, ...values);
}
var isValidParent = (parent) => {
	return parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement && parent != document.body);
};
var replaceNode = (parent, node, el) => {
	if (el != null) el.boundParent = parent;
	let newNode = getNode(el, null, -1, parent);
	if (isElement(newNode)) {
		if (newNode?.parentNode != parent && !newNode?.contains?.(parent) && newNode != null) node?.replaceWith?.(hasValue(newNode) && (typeof newNode?.value == "object" || typeof newNode?.value == "function") && isElement(newNode?.value) ? newNode?.value : newNode);
	} else node?.remove?.();
};
function htmlBuilder({ createElement = null } = {}) {
	return function(strings, ...values) {
		let parts = [];
		const psh = [], atb = [];
		for (let i = 0; i < strings.length; i++) {
			parts.push(strings?.[i] || "");
			if (i < values.length) if (strings[i]?.trim()?.endsWith?.("<")) {
				const dat = parseTag(values?.[i]);
				parts.push(dat.tag || "div");
				if (dat.id) parts.push(` id="${dat.id}"`);
				if (dat.className) parts.push(` class="${dat.className}"`);
			} else {
				const $inTagOpen = checkInsideTagBlock(strings, strings?.[i] || "", strings?.[i + 1] || "");
				const $afterEquals = /[\w:\-\.\]]\s*=\s*$/.test(strings[i]?.trim?.() ?? "") || strings[i]?.trim?.()?.endsWith?.("=");
				const $isQuoteBegin = strings[i]?.trim?.()?.match?.(/['"]$/);
				const $isQuoteEnd = strings[i + 1]?.trim?.()?.match?.(/^['"]/) ?? $isQuoteBegin;
				const $betweenQuotes = $isQuoteBegin && $isQuoteEnd;
				const $attributePattern = $afterEquals;
				if (($attributePattern || $betweenQuotes) && $inTagOpen) {
					const $needsToQuoteWrap = $attributePattern && !$betweenQuotes;
					const ati = atb.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? $needsToQuoteWrap ? `"#{${ati}}"` : `#{${ati}}` : "");
					atb.push(values?.[i]);
				} else if (!$inTagOpen) {
					const psi = psh.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? isPrimitive(values?.[i]) ? String(values?.[i])?.trim?.() : `<!--o:${psi}-->` : "");
					psh.push(values?.[i]);
				}
			}
		}
		const sourceCode = cleanupInterTagWhitespaceAndIndent(parts.join("").trim());
		const mapped = /* @__PURE__ */ new WeakMap(), doc = new DOMParser().parseFromString(sourceCode, "text/html");
		const sources = (doc instanceof HTMLTemplateElement || doc?.matches?.("template") ? doc : doc.querySelector("template"))?.content ?? doc.body ?? doc;
		const frag = document.createDocumentFragment();
		const bucket = Array.from(sources.childNodes)?.filter((e) => {
			return e instanceof Node;
		}).map((node) => {
			if (!isValidParent(node?.parentNode) && node?.parentNode != frag) {
				node?.remove?.();
				if (node != null) frag?.append?.(node);
			}
			return node;
		});
		let walkedNodes = [];
		bucket.forEach((nodeSet) => {
			const walker = nodeSet ? document.createTreeWalker(nodeSet, NodeFilter.SHOW_ALL, null) : null;
			do {
				const node = walker?.currentNode;
				walkedNodes.push(node);
			} while (walker?.nextNode?.());
		});
		walkedNodes?.filter?.((node) => node?.nodeType == Node.COMMENT_NODE)?.forEach?.((node) => {
			if (node?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
				let el = psh?.[parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];
				if (el == null || el === void 0 || (typeof el == "string" ? el : null)?.trim?.() == "") node?.remove?.();
				else {
					const $parent = node?.parentNode;
					if (Array.isArray(el) || el instanceof Map || el instanceof Set) replaceNode?.($parent, node, el = M(el, null, $parent));
					else if (el != null) replaceNode?.($parent, node, el);
				}
			}
			if (node?.isConnected) node?.remove?.();
		});
		walkedNodes?.filter((node) => node.nodeType == Node.ELEMENT_NODE)?.map?.((node) => {
			connectElement(node, atb, psh, mapped);
		});
		return Array.from(frag?.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
	};
}
var H = (str, ...values) => {
	if (typeof str == "string") {
		if (str?.trim?.()?.startsWith?.("<") && str?.trim?.()?.endsWith?.(">")) {
			const doc = new DOMParser().parseFromString(cleanupInterTagWhitespaceAndIndent(str?.trim?.()), "text/html");
			const basis = doc.querySelector("template")?.content ?? doc.body;
			if (basis instanceof HTMLBodyElement) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis.childNodes ?? []));
				return Array.from(frag.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
			}
			if (basis instanceof DocumentFragment) return basis;
			if (basis?.childNodes?.length > 1) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis?.childNodes ?? []));
				return frag;
			}
			return basis?.childNodes?.[0] ?? new Text(str);
		}
		return new Text(str);
	} else if (typeof str == "function") return H(str?.());
	else if (Array.isArray(str) && values) return html(str, ...values);
	else if (str instanceof Node) return str;
	return getNode(str);
};
//#endregion
//#region shared/fest/lure/lure/core/Control.ts
var checkboxCtrl = (ref) => {
	ref = toRef$1(ref);
	return (ev) => {
		const $ref = unref(ref);
		if ($ref != null) $ref.value = Q(`input[type="radio"], input[type="checkbox"], input:checked`, ev?.target)?.checked ?? $ref?.value;
	};
};
var numberCtrl = (ref) => {
	ref = toRef$1(ref);
	return (ev) => {
		const $ref = unref(ref);
		if ($ref != null && isNotEqual($ref?.value, ev?.target?.valueAsNumber)) $ref.value = Number(Q("input", ev?.target)?.valueAsNumber || 0) ?? 0;
	};
};
var valueCtrl = (ref) => {
	ref = toRef$1(ref);
	return (ev) => {
		const $ref = unref(ref);
		if ($ref != null && isNotEqual(ev?.target?.value, $ref?.value)) $ref.value = (Q("input", ev?.target)?.value ?? $ref?.value) || "";
	};
};
//#endregion
//#region shared/fest/lure/extension/tasking/History.ts
var historyState = observe({
	index: 0,
	length: 0,
	action: "MANUAL",
	view: "",
	canBack: false,
	canForward: false,
	entries: []
});
typeof history != "undefined" && history.pushState.bind(history);
typeof history != "undefined" && history.replaceState.bind(history);
typeof history != "undefined" && history.go.bind(history);
typeof history != "undefined" && history.forward.bind(history);
typeof history != "undefined" && history.back.bind(history);
var navigate = (view, replace = false) => {
	const hash = view.startsWith("#") ? view : `#${view}`;
	if (replace && historyState?.index > 0) {
		const prev = historyState?.entries?.[historyState?.index - 1];
		if (prev && prev.view === hash) {
			history.back();
			return;
		}
	}
	if (replace) {
		if (historyState?.entries?.[historyState.index]?.view !== hash || historyState?.entries?.[historyState.index]?.view) history?.replaceState?.(null, "", hash);
	} else history?.pushState?.(null, "", hash);
};
//#endregion
//#region shared/fest/lure/extension/tasking/BackNavigation.ts
var ClosePriority = /* @__PURE__ */ function(ClosePriority) {
	ClosePriority[ClosePriority["CONTEXT_MENU"] = 100] = "CONTEXT_MENU";
	ClosePriority[ClosePriority["DROPDOWN"] = 90] = "DROPDOWN";
	ClosePriority[ClosePriority["MODAL"] = 80] = "MODAL";
	ClosePriority[ClosePriority["DIALOG"] = 70] = "DIALOG";
	ClosePriority[ClosePriority["SIDEBAR"] = 60] = "SIDEBAR";
	ClosePriority[ClosePriority["OVERLAY"] = 50] = "OVERLAY";
	ClosePriority[ClosePriority["PANEL"] = 40] = "PANEL";
	ClosePriority[ClosePriority["TOAST"] = 30] = "TOAST";
	ClosePriority[ClosePriority["TASK"] = 20] = "TASK";
	ClosePriority[ClosePriority["VIEW"] = 10] = "VIEW";
	ClosePriority[ClosePriority["DEFAULT"] = 0] = "DEFAULT";
	return ClosePriority;
}({});
var registry = /* @__PURE__ */ new Map();
var options = {};
var generateId = () => `closeable-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
/**
* Register a closeable element/callback with the back navigation system
*/
var registerCloseable = (entry) => {
	const id = entry.id || generateId();
	const fullEntry = Object.assign(entry, { id });
	if (fullEntry?.hashId == null) fullEntry.hashId = id;
	registry.set(id, fullEntry);
	if (options.debug) console.log("[BackNav] Registered:", id, "priority:", entry.priority);
	return () => unregisterCloseable(id);
};
/**
* Unregister a closeable by ID
*/
var unregisterCloseable = (id) => {
	const removed = registry.delete(id);
	if (options.debug && removed) console.log("[BackNav] Unregistered:", id);
	return removed;
};
/**
* Register a context menu as closeable
*/
var registerContextMenu = (element, visibleRef, onClose) => {
	return registerCloseable({
		id: `ctx-menu-${element.id || generateId()}`,
		priority: ClosePriority.CONTEXT_MENU,
		element: new WeakRef(element),
		group: "context-menu",
		isActive: () => visibleRef.value === true,
		close: () => {
			visibleRef.value = false;
			onClose?.();
			return false;
		}
	});
};
/**
* Register a modal dialog as closeable
*/
var registerModal = (element, isActiveCheck, onClose) => {
	return registerCloseable({
		id: `modal-${element.id || generateId()}`,
		priority: ClosePriority.MODAL,
		element: new WeakRef(element),
		group: "modal",
		isActive: isActiveCheck ?? (() => {
			const el = element;
			return el?.isConnected && !el?.hasAttribute?.("data-hidden") && el?.checkVisibility?.({
				opacityProperty: true,
				visibilityProperty: true
			}) !== false;
		}),
		close: () => {
			onClose?.();
			element?.remove?.();
			return false;
		}
	});
};
//#endregion
//#region shared/fest/lure/lure/core/Links.ts
var localStorageLinkMap = /* @__PURE__ */ new Map();
var localStorageLink = (existsStorage, exists, key, initial) => {
	if (key == null) return;
	if (localStorageLinkMap.has(key)) {
		localStorageLinkMap.get(key)?.[0]?.();
		localStorageLinkMap.delete(key);
	}
	return localStorageLinkMap.getOrInsertComputed?.(key, () => {
		const def = (existsStorage ?? localStorage).getItem(key) ?? initial?.value ?? initial;
		const ref = isValueRef(exists) ? exists : stringRef(def);
		ref.value ??= def;
		const $val = new WeakRef(ref);
		const unsb = affected([ref, "value"], (val) => {
			$avoidTrigger($val?.deref?.(), () => {
				(existsStorage ?? localStorage).setItem(key, val);
			});
		});
		const list = (ev) => {
			if (ev.storageArea == (existsStorage ?? localStorage) && ev.key == key) {
				if (isNotEqual(ref.value, ev.newValue)) ref.value = ev.newValue;
			}
		};
		addEventListener("storage", list);
		return [() => {
			unsb?.();
			removeEventListener("storage", list);
		}, ref];
	});
};
var matchMediaLink = (existsMedia, exists, condition) => {
	if (condition == null) return;
	const med = existsMedia ?? matchMedia(condition), def = med?.matches || false;
	const ref = isValueRef(exists) ? exists : booleanRef(def);
	ref.value ??= def;
	const evf = (ev) => ref.value = ev.matches;
	med?.addEventListener?.("change", evf);
	return () => {
		med?.removeEventListener?.("change", evf);
	};
};
var visibleLink = (element, exists, initial) => {
	if (element == null) return;
	const def = initial?.value ?? (typeof initial != "object" ? initial : null) ?? element?.getAttribute?.("data-hidden") == null;
	const val = isValueRef(exists) ? exists : booleanRef(!!def);
	const usb = bindWith(element, "data-hidden", val, handleHidden);
	const evf = [(ev) => {
		val.value = ev?.type == "u2-hidden" ? false : true;
	}, { passive: true }], wel = new WeakRef(element);
	element?.addEventListener?.("u2-hidden", ...evf);
	element?.addEventListener?.("u2-appear", ...evf);
	return () => {
		const element = wel?.deref?.();
		usb?.();
		element?.removeEventListener?.("u2-hidden", ...evf);
		element?.removeEventListener?.("u2-appear", ...evf);
	};
};
var attrLink = (element, exists, attribute, initial) => {
	const def = element?.getAttribute?.(attribute) ?? (typeof initial == "boolean" ? initial ? "" : null : getValue(initial));
	if (!element) return;
	const val = isValueRef(exists) ? exists : stringRef(def);
	if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
	return bindWith(element, attribute, val, handleAttribute, null, true);
};
var sizeLink = (element, exists, axis, box) => {
	const def = box == "border-box" ? element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"] : element?.[axis == "inline" ? "clientWidth" : "clientHeight"] - getPadding(element, axis);
	const val = isValueRef(exists) ? exists : numberRef(def);
	if (isObject(val)) val.value ||= (def ?? val.value) || 1;
	const obs = new ResizeObserver((entries) => {
		if (isObject(val)) {
			if (box == "border-box") val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize;
			if (box == "content-box") val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize;
			if (box == "device-pixel-content-box") val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize;
		}
	});
	if ((element?.element ?? element?.self ?? element) instanceof HTMLElement) obs?.observe?.(element?.element ?? element?.self ?? element, { box });
	return () => obs?.disconnect?.();
};
var scrollLink = (element, exists, axis, initial) => {
	const wel = element instanceof WeakRef ? element : new WeakRef(element);
	if (initial != null && typeof (initial?.value ?? initial) == "number") element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: initial?.value ?? initial });
	const def = element?.[axis == "block" ? "scrollTop" : "scrollLeft"];
	const val = isValueRef(exists) ? exists : numberRef(def || 0);
	if (isObject(val)) val.value ||= (def ?? val.value) || 1;
	val.value ||= (def ?? val.value) || 0;
	const usb = affected([val, "value"], (v) => {
		if (Math.abs((axis == "block" ? element?.scrollTop : element?.scrollLeft) - (val?.value ?? val)) > .001) element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: val?.value ?? val });
	});
	const scb = [(ev) => {
		val.value = (axis == "block" ? wel?.deref?.()?.scrollTop : wel?.deref?.()?.scrollLeft) || 0;
	}, { passive: true }];
	element?.addEventListener?.("scroll", ...scb);
	return () => {
		wel?.deref?.()?.removeEventListener?.("scroll", ...scb);
		usb?.();
	};
};
var checkedLink = (element, exists) => {
	const def = !!element?.checked || false;
	const val = isValueRef(exists) ? exists : booleanRef(def);
	if (isObject(val)) val.value ??= def;
	const dbf = bindCtrl(element, checkboxCtrl(val));
	const usb = affected([val, "value"], (v) => {
		if (element && element?.checked != v) setChecked(element, v);
	});
	return () => {
		usb?.();
		dbf?.();
	};
};
var valueLink = (element, exists) => {
	if (isPrimitive(element)) return;
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	const def = element?.value ?? "";
	const val = isValueRef(exists) ? exists : stringRef(def);
	if (isObject(val)) val.value ??= def;
	const dbf = bindCtrl(element, valueCtrl(val));
	const $val = new WeakRef(val);
	const usb = affected([val, "value"], (v) => {
		if (element && isNotEqual(element?.value, v?.value ?? v)) $avoidTrigger(deref($val), () => {
			element.value = $getValue(deref($val)) ?? $getValue(v);
			element?.dispatchEvent?.(new Event("change", { bubbles: true }));
		});
	});
	return () => {
		usb?.();
		dbf?.();
	};
};
var valueAsNumberLink = (element, exists) => {
	if (isPrimitive(element)) return;
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	const def = Number(element?.valueAsNumber) || 0;
	const val = isValueRef(exists) ? exists : numberRef(def);
	if (isObject(val)) val.value ??= def;
	const dbf = bindCtrl(element, numberCtrl(val));
	const usb = affected([val, "value"], (v) => {
		if (element && (element.type == "range" || element.type == "number") && typeof element?.valueAsNumber == "number" && isNotEqual(element?.valueAsNumber, v)) {
			element.valueAsNumber = Number(v);
			element?.dispatchEvent?.(new Event("change", { bubbles: true }));
		}
	});
	return () => {
		usb?.();
		dbf?.();
	};
};
var orientLink = (host, exists) => {
	const orient = orientationNumberMap?.[getCorrectOrientation()] || 0;
	const def = Number(orient) || 0;
	const val = isValueRef(exists) ? exists : numberRef(def);
	if (hasValue(val)) val.value = def;
	return whenAnyScreenChanges(() => {
		val.value = orientationNumberMap?.[getCorrectOrientation()] || 0;
	});
};
//#endregion
//#region shared/fest/lure/lure/core/Refs.ts
var makeRef = (host, type, link, ...args) => {
	if (link == attrLink || link == handleAttribute) {
		const exists = elMap$1?.get?.(host)?.get?.(handleAttribute)?.get?.(args[0])?.[0];
		if (exists) return exists;
	}
	const rf = (type ?? ref)?.(null), usub = link?.(host, rf, ...args);
	if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
	return rf;
};
var orientRef = (host, ...args) => makeRef(host, numberRef, orientLink, ...args);
var attrRef = (host, ...args) => makeRef(host, stringRef, attrLink, ...args);
var valueRef = (host, ...args) => makeRef(host, stringRef, valueLink, ...args);
var valueAsNumberRef = (host, ...args) => makeRef(host, numberRef, valueAsNumberLink, ...args);
var localStorageRef = (...args) => {
	if (localStorageLinkMap.has(args[0])) return localStorageLinkMap.get(args[0])?.[1];
	const link = localStorageLink;
	const rf = (stringRef ?? ref)?.(null);
	const [usub, _] = link?.(null, rf, ...args);
	if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
	return rf;
};
var sizeRef = (host, ...args) => makeRef(host, numberRef, sizeLink, ...args);
var checkedRef = (host, ...args) => makeRef(host, booleanRef, checkedLink, ...args);
var scrollRef = (host, ...args) => makeRef(host, numberRef, scrollLink, ...args);
var visibleRef = (host, ...args) => makeRef(host, booleanRef, visibleLink, ...args);
var matchMediaRef = (...args) => makeRef(null, booleanRef, matchMediaLink, ...args);
//#endregion
//#region shared/fest/lure/lure/misc/Glit.ts
var styleCache = /* @__PURE__ */ new Map();
var styleElementCache = /* @__PURE__ */ new WeakMap();
var propStore = /* @__PURE__ */ new WeakMap();
var CSM = /* @__PURE__ */ new WeakMap();
var camelToKebab = (str) => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
var whenBoxValid = (name) => {
	const cb = camelToKebab(name);
	if ([
		"border-box",
		"content-box",
		"device-pixel-content-box"
	].indexOf(cb) >= 0) return cb;
	return null;
};
var whenAxisValid = (name) => {
	const cb = camelToKebab(name);
	if (cb?.startsWith?.("inline")) return "inline";
	if (cb?.startsWith?.("block")) return "block";
	return null;
};
var inRenderKey = Symbol.for("@render@");
var defKeys = Symbol.for("@defKeys@");
var defaultStyle = typeof document != "undefined" ? document?.createElement?.("style") : null;
var defineSource = (source, holder, name) => {
	if (source == "attr") return attrRef.bind(null, holder, name || "");
	if (source == "media") return matchMediaRef;
	if (source == "query") return (val) => Q?.(name || val || "", holder);
	if (source == "query-shadow") return (val) => Q?.(name || val || "", holder?.shadowRoot ?? holder);
	if (source == "localStorage") return localStorageRef;
	if (source == "inline-size") return sizeRef.bind(null, holder, "inline", whenBoxValid(name) || "border-box");
	if (source == "content-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "content-box");
	if (source == "block-size") return sizeRef.bind(null, holder, "block", whenBoxValid(name) || "border-box");
	if (source == "border-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "border-box");
	if (source == "scroll") return scrollRef.bind(null, holder, whenAxisValid(name) || "inline");
	if (source == "device-pixel-content-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "device-pixel-content-box");
	if (source == "checked") return checkedRef.bind(null, holder);
	if (source == "value") return valueRef.bind(null, holder);
	if (source == "value-as-number") return valueAsNumberRef.bind(null, holder);
	return ref;
};
if (defaultStyle) typeof document != "undefined" && document.querySelector?.("head")?.appendChild?.(defaultStyle);
var getDef = (source) => {
	if (source == "query") return "input";
	if (source == "query-shadow") return "input";
	if (source == "media") return false;
	if (source == "localStorage") return null;
	if (source == "attr") return null;
	if (source == "inline-size") return 0;
	if (source == "block-size") return 0;
	if (source == "border-box") return 0;
	if (source == "content-box") return 0;
	if (source == "scroll") return 0;
	if (source == "device-pixel-content-box") return 0;
	if (source == "checked") return false;
	if (source == "value") return "";
	if (source == "value-as-number") return 0;
	return null;
};
if (defaultStyle) defaultStyle.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`;
function withProperties(ctr) {
	const proto = ctr.prototype ?? Object.getPrototypeOf(ctr) ?? ctr;
	const $prev = proto?.$init ?? ctr?.$init;
	proto.$init = function(...args) {
		$prev?.call?.(this, ...args);
		const allDefs = {};
		let p = Object.getPrototypeOf(this) ?? this;
		while (p) {
			if (Object.hasOwn(p, defKeys)) {
				const defs = Object.assign({}, Object.getOwnPropertyDescriptors(p), p[defKeys] ?? {});
				for (const k of Object.keys(defs)) if (!(k in allDefs)) allDefs[k] = defs[k];
			}
			p = Object.getPrototypeOf(p);
		}
		for (const [key, def] of Object.entries(allDefs)) {
			const exists = this[key];
			if (def != null) Object.defineProperty(this, key, def);
			try {
				this[key] = exists || this[key];
			} catch (e) {}
		}
		return this;
	};
	return ctr;
}
function defineElement(name, options) {
	return function(target, _key) {
		const registry = globalThis?.customElements;
		try {
			if (!registry || !name) return target;
			if (typeof registry.get !== "function" || typeof registry.define !== "function") return target;
			const existing = registry.get(name);
			if (existing) return existing;
			registry?.define?.(name, target, options);
		} catch (e) {
			if (e?.name === "NotSupportedError" || /has already been used|already been defined/i.test(e?.message || "")) return registry?.get?.(name) ?? target;
			throw e;
		}
		return target;
	};
}
function property(options = {}) {
	const { attribute, source, name, from } = options;
	return function(target, key) {
		const attrName = typeof attribute == "string" ? attribute : name ?? key;
		if (attribute !== false && attrName != null) {
			const ctor = target.constructor;
			if (!ctor.observedAttributes) ctor.observedAttributes = [];
			if (ctor.observedAttributes.indexOf(attrName) < 0) ctor.observedAttributes.push(attrName);
		}
		if (!Object.hasOwn(target, defKeys)) target[defKeys] = {};
		target[defKeys][key] = {
			get() {
				const ROOT = this;
				const inRender = ROOT[inRenderKey];
				const sourceTarget = !from ? ROOT : from instanceof HTMLElement ? from : typeof from == "string" ? Q?.(from, ROOT) : ROOT;
				let store = propStore.get(ROOT);
				let stored = store?.get?.(key);
				if (stored == null && source != null) {
					if (!store) propStore.set(ROOT, store = /* @__PURE__ */ new Map());
					if (!store?.has?.(key)) store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source)));
				}
				if (inRender) return stored;
				if (stored?.element instanceof HTMLElement) return stored?.element;
				return (typeof stored == "object" || typeof stored == "function") && (stored?.value != null || "value" in stored) ? stored?.value : stored;
			},
			set(newValue) {
				const ROOT = this;
				const sourceTarget = !from ? ROOT : from instanceof HTMLElement ? from : typeof from == "string" ? Q?.(from, ROOT) : ROOT;
				let store = propStore.get(ROOT);
				let stored = store?.get?.(key);
				if (stored == null && source != null) {
					if (!store) propStore.set(ROOT, store = /* @__PURE__ */ new Map());
					if (!store?.has?.(key)) {
						const initialValue = (typeof newValue == "object" || typeof newValue == "function" ? newValue?.value : null) ?? newValue ?? getDef(source);
						store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(initialValue));
					}
				} else if (typeof stored == "object" || typeof stored == "function") try {
					if (typeof newValue == "object" && newValue != null && (newValue?.value == null && !("value" in newValue) || typeof newValue?.value == "object" || typeof newValue?.value == "function")) Object.assign(stored, newValue?.value ?? newValue);
					else stored.value = (typeof newValue == "object" || typeof newValue == "function" ? newValue?.value : null) ?? newValue;
				} catch (e) {
					console.warn("Error setting property value:", e);
				}
			},
			enumerable: true,
			configurable: true
		};
	};
}
var adoptedStyleSheetsCache = /* @__PURE__ */ new WeakMap();
var addAdoptedSheetToElement = (bTo, sheet) => {
	let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
	if (!adoptedSheets) adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
	if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
	if (bTo.shadowRoot) bTo.shadowRoot.adoptedStyleSheets = [...bTo.shadowRoot.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
};
var loadCachedStyles = (bTo, src) => {
	if (!src) return null;
	let resolvedSrc = src;
	if (typeof src == "function") try {
		const weak = new WeakRef(bTo);
		resolvedSrc = src.call(bTo, weak);
	} catch (e) {
		console.warn("Error calling styles function:", e);
		return null;
	}
	if (resolvedSrc && typeof CSSStyleSheet != "undefined" && resolvedSrc instanceof CSSStyleSheet) {
		addAdoptedSheetToElement(bTo, resolvedSrc);
		return null;
	}
	if (resolvedSrc instanceof Promise) {
		resolvedSrc.then((result) => {
			if (result instanceof CSSStyleSheet) addAdoptedSheetToElement(bTo, result);
			else if (result != null) loadCachedStyles(bTo, result);
		}).catch((e) => {
			console.warn("Error loading adopted stylesheet:", e);
		});
		return null;
	}
	if (typeof resolvedSrc == "string" || resolvedSrc instanceof Blob || resolvedSrc instanceof File) {
		const adopted = loadAsAdopted(resolvedSrc, "");
		if (adopted) {
			let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
			if (!adoptedSheets) adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
			const addAdoptedSheet = (sheet) => {
				if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
				if (bTo.shadowRoot) bTo.shadowRoot.adoptedStyleSheets = [...bTo.shadowRoot.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
			};
			if (adopted instanceof Promise) {
				adopted.then(addAdoptedSheet).catch((e) => {
					console.warn("Error loading adopted stylesheet:", e);
				});
				return null;
			} else {
				addAdoptedSheet(adopted);
				return null;
			}
		}
	}
	const source = typeof src == "function" || typeof src == "object" ? styleElementCache : styleCache;
	const cached = source.get(src);
	let styleElement = cached?.styleElement;
	let vars = cached?.vars;
	if (!cached) {
		let styles = ``;
		let props = [];
		if (typeof resolvedSrc == "string") styles = resolvedSrc || "";
		else if (typeof resolvedSrc == "object" && resolvedSrc != null) if (resolvedSrc instanceof HTMLStyleElement) styleElement = resolvedSrc;
		else {
			styles = typeof resolvedSrc.css == "string" ? resolvedSrc.css : typeof resolvedSrc == "string" ? resolvedSrc : String(resolvedSrc);
			props = resolvedSrc?.props ?? props;
			vars = resolvedSrc?.vars ?? vars;
		}
		if (!styleElement && styles) styleElement = loadInlineStyle(styles, bTo, "ux-layer");
		source.set(src, {
			css: styles,
			props,
			vars,
			styleElement
		});
	}
	return styleElement;
};
var isNotExtended = (el) => {
	return !(el instanceof HTMLDivElement || el instanceof HTMLImageElement || el instanceof HTMLVideoElement || el instanceof HTMLCanvasElement) && !(el?.hasAttribute?.("is") || el?.getAttribute?.("is") != null);
};
/**
* GLitElement: Создаёт базовый класс для кастомных элементов с расширенными возможностями.
* Поддерживает все lifecycle callbacks Web Components.
* 
* @param derivate - Базовый класс для расширения (по умолчанию HTMLElement).
* @returns Конструктор расширенного класса с полной поддержкой lifecycle.
* 
* @example
* ```typescript
* // Базовое использование
* class MyElement extends GLitElement() {
*     connectedCallback() {
*         super.connectedCallback();
*         console.log('Connected!');
*     }
*     
*     render() {
*         return H`<div>Hello</div>`;
*     }
* }
* 
* // С наследованием от другого элемента
* class MyButton extends GLitElement(HTMLButtonElement) {
*     static observedAttributes = ['disabled'];
*     
*     attributeChangedCallback(name, oldVal, newVal) {
*         console.log(`${name} changed from ${oldVal} to ${newVal}`);
*     }
* }
* 
* // С декоратором
* @defineElement('my-element')
* class MyElement extends GLitElement() {
*     @property({ source: 'attr', name: 'value' })
*     value: string = '';
*     
*     disconnectedCallback() {
*         console.log('Disconnected!');
*     }
* }
* ```
*/
function GLitElement(derivate) {
	const fallbackBase = globalThis.HTMLElement ?? class {};
	const Base = derivate ?? fallbackBase;
	const cached = CSM.get(Base);
	if (cached) return cached;
	/**
	* Внутренний класс с полной реализацией lifecycle
	*/
	class GLitElementImpl extends Base {
		#shadowDOM;
		#styleElement;
		#defaultStyle;
		#initialized = false;
		get styles() {}
		get initialAttributes() {}
		styleLayers() {
			return [];
		}
		render(_weak) {
			return document.createElement("slot");
		}
		constructor(...args) {
			super(...args);
			this.styleLibs = [];
			this.adoptedStyleSheets = [];
			if (isNotExtended(this)) {
				const shadowRoot = addRoot(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" }));
				const defStyle = this.#defaultStyle ??= defaultStyle?.cloneNode?.(true);
				const layersStyle = shadowRoot.querySelector(`style[data-type="ux-layer"]`);
				if (layersStyle) layersStyle.after(defStyle);
				else shadowRoot.prepend(defStyle);
			}
			this.styleLibs ??= [];
		}
		$makeLayers() {
			return `@layer ${[
				"ux-preload",
				"ux-layer",
				...this.styleLayers?.() ?? []
			].join?.(",") ?? ""};`;
		}
		onInitialize(_weak) {
			return this;
		}
		onRender(_weak) {
			return this;
		}
		getProperty(key) {
			const current = this[inRenderKey];
			this[inRenderKey] = true;
			const cp = this[key];
			this[inRenderKey] = current;
			if (!current) delete this[inRenderKey];
			return cp;
		}
		loadStyleLibrary($module) {
			const root = this.shadowRoot;
			const module = typeof $module == "function" ? $module?.(root) : $module;
			if (module instanceof HTMLStyleElement) {
				this.styleLibs?.push?.(module);
				if (this.#styleElement?.isConnected) this.#styleElement?.before?.(module);
				else this.shadowRoot?.prepend?.(module);
			} else if (module instanceof CSSStyleSheet) {
				let adoptedSheets = adoptedStyleSheetsCache.get(this);
				if (!adoptedSheets) adoptedStyleSheetsCache.set(this, adoptedSheets = []);
				if (adoptedSheets.indexOf(module) < 0) adoptedSheets.push(module);
				if (root) root.adoptedStyleSheets = [...root.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))];
			} else {
				const adopted = loadAsAdopted(module, "ux-layer");
				let adoptedSheets = adoptedStyleSheetsCache.get(this);
				if (!adoptedSheets) adoptedStyleSheetsCache.set(this, adoptedSheets = []);
				const addAdoptedSheet = (sheet) => {
					if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
					if (root) root.adoptedStyleSheets = [...root.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))];
				};
				if (adopted instanceof Promise) adopted.then(addAdoptedSheet).catch(() => {});
				else if (adopted) addAdoptedSheet(adopted);
			}
			return this;
		}
		createShadowRoot() {
			return addRoot(this.shadowRoot ?? this.attachShadow({ mode: "open" }));
		}
		/**
		* Вызывается когда элемент добавлен в DOM
		*/
		connectedCallback() {
			if (super.connectedCallback) super.connectedCallback();
			const weak = new WeakRef(this);
			if (!this.#initialized) {
				this.#initialized = true;
				const shadowRoot = isNotExtended(this) ? this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" }) : this.shadowRoot;
				const ctor = this.constructor;
				const init = this.$init ?? ctor.prototype?.$init;
				if (typeof init === "function") init.call(this);
				const attrs = typeof this.initialAttributes == "function" ? this.initialAttributes() : this.initialAttributes;
				setAttributesIfNull(this, attrs);
				this.onInitialize?.call(this, weak);
				this[inRenderKey] = true;
				if (isNotExtended(this) && shadowRoot) {
					const rendered = this.render?.call?.(this, weak) ?? document.createElement("slot");
					const styleElement = loadCachedStyles(this, this.styles);
					if (styleElement instanceof HTMLStyleElement) this.#styleElement = styleElement;
					const elements = [
						H`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
						this.#defaultStyle,
						...this.styleLibs.map((x) => x.cloneNode?.(true)) || [],
						styleElement,
						rendered
					].filter((x) => x != null && isElement(x));
					shadowRoot.append(...elements);
					const adoptedSheets = adoptedStyleSheetsCache.get(this) || [];
					if (adoptedSheets.length > 0) shadowRoot.adoptedStyleSheets = [...adoptedSheets.filter((s) => !shadowRoot.adoptedStyleSheets?.includes(s)), ...new Set([...shadowRoot.adoptedStyleSheets || []])];
				}
				this.onRender?.call?.(this, weak);
				delete this[inRenderKey];
			}
		}
		/**
		* Вызывается когда элемент удалён из DOM
		*/
		disconnectedCallback() {
			if (super.disconnectedCallback) super.disconnectedCallback();
		}
		/**
		* Вызывается когда элемент перемещён в новый документ
		*/
		adoptedCallback() {
			if (super.adoptedCallback) super.adoptedCallback();
		}
		/**
		* Вызывается когда наблюдаемый атрибут изменился
		*/
		attributeChangedCallback(name, oldValue, newValue) {
			if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldValue, newValue);
		}
	}
	const result = withProperties(GLitElementImpl);
	CSM.set(Base, result);
	console.log("result", result);
	return result;
}
//#endregion
//#region shared/fest/lure/extension/controllers/LazyEvents.ts
var hubsByTarget = /* @__PURE__ */ new WeakMap();
var keyOf = (type, options) => {
	return `${type}|c:${options?.capture ? "1" : "0"}|p:${options?.passive ? "1" : "0"}`;
};
var lazyAddEventListener = (target, type, handler, options = {}) => {
	if (!target || typeof target.addEventListener !== "function") return () => {};
	const normalized = {
		capture: Boolean(options.capture),
		passive: Boolean(options.passive)
	};
	const key = keyOf(type, normalized);
	let hubs = hubsByTarget.get(target);
	if (!hubs) {
		hubs = /* @__PURE__ */ new Map();
		hubsByTarget.set(target, hubs);
	}
	let hub = hubs.get(key);
	if (!hub) {
		const handlers = /* @__PURE__ */ new Set();
		const listener = (ev) => {
			for (const cb of Array.from(handlers)) try {
				cb(ev);
			} catch (e) {
				console.warn(e);
			}
		};
		hubs.set(key, hub = {
			handlers,
			listener,
			options: normalized
		});
		target.addEventListener(type, listener, normalized);
	}
	hub.handlers.add(handler);
	return () => {
		const hubsNow = hubsByTarget.get(target);
		const hubNow = hubsNow?.get(key);
		if (!hubNow) return;
		hubNow.handlers.delete(handler);
		if (hubNow.handlers.size > 0) return;
		target.removeEventListener(type, hubNow.listener, hubNow.options);
		hubsNow?.delete(key);
		if (hubsNow && hubsNow.size === 0) hubsByTarget.delete(target);
	};
};
var proxiedByRoot = /* @__PURE__ */ new WeakMap();
var resolveHTMLElement = (el) => {
	const resolved = el?.element ?? el;
	return resolved instanceof HTMLElement ? resolved : null;
};
var shouldApply = (when, hadMatch, hadHandled) => {
	if (!when) return false;
	if (when === "handled") return hadHandled;
	return hadMatch;
};
/**
* Proxied events:
* - Installs **one** real DOM listener on `root` (per event/options/config), but only after the first element handler registers.
* - Routes events to registered element handlers based on the composed path.
* - Can conditionally call preventDefault/stop* only when a trigger matches (or when handled).
*/
var addProxiedEvent = (root, type, options = {
	capture: true,
	passive: false
}, config = {}) => {
	const target = root;
	if (!target || typeof target.addEventListener !== "function") return (_element, _handler) => () => {};
	const normalized = {
		capture: Boolean(options.capture),
		passive: Boolean(options.passive)
	};
	const strategy = config.strategy ?? "closest";
	const key = `${type}|c:${normalized.capture ? "1" : "0"}|p:${normalized.passive ? "1" : "0"}|s:${strategy}|pd:${String(config.preventDefault ?? "")}|sp:${String(config.stopPropagation ?? "")}|sip:${String(config.stopImmediatePropagation ?? "")}`;
	let hubs = proxiedByRoot.get(target);
	if (!hubs) {
		hubs = /* @__PURE__ */ new Map();
		proxiedByRoot.set(target, hubs);
	}
	let hub = hubs.get(key);
	if (!hub) {
		const targets = /* @__PURE__ */ new Map();
		const dispatch = (ev) => {
			let hadMatch = false;
			let hadHandled = false;
			const callSet = (set) => {
				if (!set || set.size === 0) return;
				hadMatch = true;
				for (const cb of Array.from(set)) if (cb(ev)) hadHandled = true;
			};
			const path = ev?.composedPath?.();
			if (Array.isArray(path)) if (strategy === "closest") for (const n of path) {
				const el = resolveHTMLElement(n);
				if (!el) continue;
				const set = targets.get(el);
				if (!set) continue;
				callSet(set);
				break;
			}
			else for (const n of path) {
				const el = resolveHTMLElement(n);
				if (!el) continue;
				callSet(targets.get(el));
			}
			else {
				let cur = resolveHTMLElement(ev?.target);
				while (cur) {
					const set = targets.get(cur);
					if (set) {
						callSet(set);
						if (strategy === "closest") break;
					}
					const r = cur.getRootNode?.();
					cur = cur.parentElement || (r instanceof ShadowRoot ? r.host : null);
				}
			}
			if (shouldApply(config.preventDefault, hadMatch, hadHandled)) ev?.preventDefault?.();
			if (shouldApply(config.stopImmediatePropagation, hadMatch, hadHandled)) ev?.stopImmediatePropagation?.();
			if (shouldApply(config.stopPropagation, hadMatch, hadHandled)) ev?.stopPropagation?.();
		};
		hub = {
			targets,
			unbindGlobal: null,
			options: normalized,
			strategy,
			config,
			dispatch
		};
		hubs.set(key, hub);
	}
	return (element, handler) => {
		const el = resolveHTMLElement(element);
		if (!el) return () => {};
		if (hub.targets.size === 0 && !hub.unbindGlobal) hub.unbindGlobal = lazyAddEventListener(target, type, hub.dispatch, hub.options);
		let set = hub.targets.get(el);
		if (!set) {
			set = /* @__PURE__ */ new Set();
			hub.targets.set(el, set);
		}
		set.add(handler);
		return () => {
			const hubsNow = proxiedByRoot.get(target);
			const h = hubsNow?.get(key);
			if (!h) return;
			const resolved = resolveHTMLElement(element);
			if (!resolved) return;
			const s = h.targets.get(resolved);
			if (!s) return;
			s.delete(handler);
			if (s.size === 0) h.targets.delete(resolved);
			if (h.targets.size === 0) {
				h.unbindGlobal?.();
				h.unbindGlobal = null;
				hubsNow?.delete(key);
				if (hubsNow && hubsNow.size === 0) proxiedByRoot.delete(target);
			}
		};
	};
};
//#endregion
//#region shared/fest/lure/extension/controllers/Trigger.ts
var ROOT = typeof document != "undefined" ? document?.documentElement : null;
var $set = (rv, key, val) => {
	if (rv?.deref?.() != null) return rv.deref()[key] = val;
};
function makeInterruptTrigger(except = null, ref = booleanRef(false), closeEvents = [
	"pointerdown",
	"click",
	"contextmenu",
	"scroll"
], element = document?.documentElement) {
	if (!element) return () => {};
	const wr = new WeakRef(ref);
	const close = typeof ref === "function" ? ref : (ev) => {
		(!(except?.contains?.(ev?.target) || ev?.target == (except?.element ?? except)) || !except) && $set(wr, "value", false);
	};
	const listening = closeEvents.map((event) => lazyAddEventListener(element, event, close, {
		capture: false,
		passive: false
	}));
	const dispose = () => listening.forEach((ub) => ub?.());
	addToCallChain(ref, Symbol.dispose, dispose);
	return dispose;
}
var makeShiftTrigger = (callable, newItem) => ((evc) => {
	const ev = evc;
	newItem ??= ev?.target ?? newItem;
	if (!newItem.dataset.dragging) {
		const n_coord = [ev.clientX, ev.clientY];
		if (ev?.pointerId >= 0) newItem?.setPointerCapture?.(ev?.pointerId);
		const shifting = ((evc_l) => {
			const ev_l = evc_l;
			ev_l?.preventDefault?.();
			if (ev_l?.pointerId == ev?.pointerId) {
				const coord = [evc_l.clientX, evc_l.clientY];
				const shift = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
				if (Math.hypot(...shift) > 2) {
					newItem?.style?.setProperty?.("will-change", "inset, transform, translate, z-index");
					unbind?.(ev_l);
					callable?.(ev);
				}
			}
		});
		const releasePointer = ((evc_l) => {
			const ev_l = evc_l;
			if (ev_l?.pointerId == ev?.pointerId) {
				newItem?.releasePointerCapture?.(ev?.pointerId);
				unbind?.(ev_l);
			}
		});
		const handler = {
			"pointermove": shifting,
			"pointercancel": releasePointer,
			"pointerup": releasePointer
		};
		const unbind = ((evc_l) => {
			if (evc_l?.pointerId == ev?.pointerId) bindings?.forEach((binding) => binding?.());
		});
		const bindings = addEvents(ROOT, handler);
	}
});
//#endregion
//#region shared/fest/lure/extension/controllers/PointerAPI.ts
/**
* Pointer helpers for orient-aware UIs. For launcher / speed-dial grids (cell hit-test, placement),
* use `fest/dom` `resolveGridCellFromClientPoint` + Veela `compute_grid_item_cell` / `.ui-launcher-grid`.
*/
var preventedPointers = /* @__PURE__ */ new Map();
var clickPrevention = (element, pointerId = 0) => {
	if (preventedPointers.has(pointerId)) return;
	const rmev = () => {
		preventedPointers.delete(pointerId);
		dce?.forEach?.((unbind) => unbind?.());
		ece?.forEach?.((unbind) => unbind?.());
	};
	const preventClick = (e) => {
		if (e?.pointerId == pointerId || e?.pointerId == null || pointerId == null || pointerId < 0) {
			e.preventDefault();
			preventedPointers.set(pointerId, true);
			rmev();
		} else preventedPointers.delete(pointerId);
	};
	const emt = [preventClick, { once: true }];
	const doc = [preventClick, {
		once: true,
		capture: true
	}];
	const dce = addEvents(document.documentElement, {
		"click": doc,
		"pointerdown": doc,
		"contextmenu": doc
	});
	const ece = addEvents(element, {
		"click": emt,
		"pointerdown": emt,
		"contextmenu": emt
	});
	setTimeout(rmev, 10);
};
var PointerEventDrag = null;
if (typeof PointerEvent != "undefined") PointerEventDrag = class PointerEventDrag extends PointerEvent {
	#holding;
	constructor(type, eventInitDict) {
		super(type, eventInitDict);
		this.#holding = eventInitDict?.holding;
	}
	get holding() {
		return this.#holding;
	}
	get event() {
		return this.#holding?.event;
	}
	get result() {
		return this.#holding?.result;
	}
	get shifting() {
		return this.#holding?.shifting;
	}
	get modified() {
		return this.#holding?.modified;
	}
	get canceled() {
		return this.#holding?.canceled;
	}
	get duration() {
		return this.#holding?.duration;
	}
	get element() {
		return this.#holding?.element?.deref?.() ?? null;
	}
	get propertyName() {
		return this.#holding?.propertyName ?? "drag";
	}
};
else PointerEventDrag = class PointerEventDrag {
	#holding;
	constructor(type, eventInitDict) {
		this.#holding = eventInitDict?.holding;
	}
	get holding() {
		return this.#holding;
	}
};
var grabForDrag = (em, ex = {
	pointerId: 0,
	pointerType: "mouse"
}, { shifting = [0, 0], result = [{ value: 0 }, { value: 0 }] } = {}) => {
	let frameTime = .01, lastLoop = performance.now(), thisLoop;
	const filterStrength = 100;
	const computeDuration = () => {
		var thisFrameTime = (thisLoop = performance.now()) - lastLoop;
		frameTime += (thisFrameTime - frameTime) / filterStrength;
		lastLoop = thisLoop;
		return frameTime;
	};
	const hm = {
		result,
		movement: [...ex?.movement || [0, 0]],
		shifting: [...shifting],
		modified: [...shifting],
		canceled: false,
		duration: frameTime,
		element: new WeakRef(em),
		client: null
	};
	const moveEvent = [((evc) => {
		if (ex?.pointerId == evc?.pointerId) {
			evc?.preventDefault?.();
			if (hasParent(evc?.target, em)) {
				const client = [...evc?.client || [evc?.clientX || 0, evc?.clientY || 0]];
				hm.duration = computeDuration();
				hm.movement = [...hm.client ? [client?.[0] - (hm.client?.[0] || 0), client?.[1] - (hm.client?.[1] || 0)] : [0, 0]];
				hm.client = client;
				hm.shifting[0] += hm.movement[0] || 0, hm.shifting[1] += hm.movement[1] || 0;
				hm.modified[0] = (hm.shifting[0] ?? hm.modified[0]) || 0, hm.modified[1] = (hm.shifting[1] ?? hm.modified[1]) || 0;
				em?.dispatchEvent?.(new PointerEventDrag("m-dragging", {
					...evc,
					bubbles: true,
					holding: hm,
					event: evc
				}));
				if (hm?.result?.[0] != null) hm.result[0].value = hm.modified[0] || 0;
				if (hm?.result?.[1] != null) hm.result[1].value = hm.modified[1] || 0;
				if (hm?.result?.[2] != null) hm.result[2].value = 0;
			}
		}
	}), { capture: true }];
	const promised = Promise.withResolvers();
	const releaseEvent = [((evc) => {
		if (ex?.pointerId == evc?.pointerId) {
			const elm = em?.element || em;
			if (hasParent(evc?.target, elm) || evc?.currentTarget?.contains?.(elm) || evc?.target == elm) {
				if (evc?.type == "pointerup") clickPrevention(elm, evc?.pointerId);
				queueMicrotask(() => promised?.resolve?.(result));
				bindings?.forEach?.((binding) => binding?.());
				elm?.releaseCapturePointer?.(evc?.pointerId);
				elm?.dispatchEvent?.(new PointerEventDrag("m-dragend", {
					...evc,
					bubbles: true,
					holding: hm,
					event: evc
				}));
				hm.canceled = true;
				try {
					ex.pointerId = -1;
				} catch (_) {}
			}
		}
	}), { capture: true }];
	let bindings = null;
	clickPrevention(em, ex?.pointerId);
	queueMicrotask(() => {
		if (em?.dispatchEvent?.(new PointerEventDrag("m-dragstart", {
			...ex,
			bubbles: true,
			holding: hm,
			event: ex
		}))) {
			em?.setPointerCapture?.(ex?.pointerId);
			bindings = addEvents(em, {
				"pointermove": moveEvent,
				"pointercancel": releaseEvent,
				"pointerup": releaseEvent
			});
			bindings?.push?.(...addEvents(document.documentElement, {
				"pointercancel": releaseEvent,
				"pointerup": releaseEvent
			}));
		} else hm.canceled = true;
	});
	return promised?.promise ?? result;
};
var bindDraggable = (elementOrEventListener, onEnd = () => {}, draggable = [{ value: 0 }, { value: 0 }], shifting = [0, 0]) => {
	if (!draggable) return;
	const process = (ev, el) => grabForDrag(el ?? elementOrEventListener, ev, {
		result: draggable,
		shifting: typeof shifting == "function" ? shifting?.(draggable) : shifting
	})?.then?.(onEnd);
	if (typeof elementOrEventListener?.addEventListener == "function") addEvent(elementOrEventListener, "pointerdown", process);
	else if (typeof elementOrEventListener == "function") elementOrEventListener(process);
	else throw new Error("bindDraggable: elementOrEventListener is not a function or an object with addEventListener");
	const dispose = () => {
		if (typeof elementOrEventListener?.removeEventListener == "function") removeEvent(elementOrEventListener, "pointerdown", process);
	};
	return {
		draggable,
		dispose,
		process
	};
};
//#endregion
//#region shared/fest/lure/math/Point2D.ts
var Vector2D = class Vector2D {
	constructor(x = 0, y = 0) {
		this._x = typeof x === "number" ? numberRef(x) : x;
		this._y = typeof y === "number" ? numberRef(y) : y;
	}
	get x() {
		return this._x;
	}
	set x(value) {
		if (typeof value === "number") this._x.value = value;
		else this._x = value;
	}
	get y() {
		return this._y;
	}
	set y(value) {
		if (typeof value === "number") this._y.value = value;
		else this._y = value;
	}
	get 0() {
		return this._x;
	}
	get 1() {
		return this._y;
	}
	toArray() {
		return [this._x, this._y];
	}
	clone() {
		return new Vector2D(this._x.value, this._y.value);
	}
	set(x, y) {
		this._x.value = x;
		this._y.value = y;
		return this;
	}
	copy(v) {
		this._x.value = v.x.value;
		this._y.value = v.y.value;
		return this;
	}
	add(v) {
		return new Vector2D(this._x.value + v.x.value, this._y.value + v.y.value);
	}
	subtract(v) {
		return new Vector2D(this._x.value - v.x.value, this._y.value - v.y.value);
	}
	multiply(scalar) {
		return new Vector2D(this._x.value * scalar, this._y.value * scalar);
	}
	divide(scalar) {
		if (scalar === 0) throw new Error("Division by zero");
		return new Vector2D(this._x.value / scalar, this._y.value / scalar);
	}
	dot(v) {
		return this._x.value * v.x.value + this._y.value * v.y.value;
	}
	cross(v) {
		return this._x.value * v.y.value - this._y.value * v.x.value;
	}
	magnitude() {
		return Math.sqrt(this._x.value * this._x.value + this._y.value * this._y.value);
	}
	magnitudeSquared() {
		return this._x.value * this._x.value + this._y.value * this._y.value;
	}
	distanceTo(v) {
		const dx = this._x.value - v.x.value;
		const dy = this._y.value - v.y.value;
		return Math.sqrt(dx * dx + dy * dy);
	}
	distanceToSquared(v) {
		const dx = this._x.value - v.x.value;
		const dy = this._y.value - v.y.value;
		return dx * dx + dy * dy;
	}
	normalize() {
		const mag = this.magnitude();
		if (mag === 0) return new Vector2D(0, 0);
		return new Vector2D(this._x.value / mag, this._y.value / mag);
	}
	equals(v, tolerance = 1e-6) {
		return Math.abs(this._x.value - v.x.value) < tolerance && Math.abs(this._y.value - v.y.value) < tolerance;
	}
	lerp(v, t) {
		const clampedT = Math.max(0, Math.min(1, t));
		return new Vector2D(this._x.value + (v.x.value - this._x.value) * clampedT, this._y.value + (v.y.value - this._y.value) * clampedT);
	}
	angleTo(v) {
		const dot = this.dot(v);
		const det = this.cross(v);
		return Math.atan2(det, dot);
	}
	rotate(angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Vector2D(this._x.value * cos - this._y.value * sin, this._x.value * sin + this._y.value * cos);
	}
	projectOnto(v) {
		const scalar = this.dot(v) / v.magnitudeSquared();
		return v.multiply(scalar);
	}
	reflect(normal) {
		const normalizedNormal = normal.normalize();
		const dotProduct = this.dot(normalizedNormal);
		return this.subtract(normalizedNormal.multiply(2 * dotProduct));
	}
	clamp(min, max) {
		return new Vector2D(Math.max(min.x.value, Math.min(max.x.value, this._x.value)), Math.max(min.y.value, Math.min(max.y.value, this._y.value)));
	}
	min() {
		return Math.min(this._x.value, this._y.value);
	}
	max() {
		return Math.max(this._x.value, this._y.value);
	}
	static zero() {
		return new Vector2D(0, 0);
	}
	static one() {
		return new Vector2D(1, 1);
	}
	static unitX() {
		return new Vector2D(1, 0);
	}
	static unitY() {
		return new Vector2D(0, 1);
	}
	static fromAngle(angle, length = 1) {
		return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
	}
	static fromPolar(angle, radius) {
		return Vector2D.fromAngle(angle, radius);
	}
};
var vector2Ref = (x = 0, y = 0) => {
	return new Vector2D(x, y);
};
//#endregion
//#region shared/fest/lure/math/Operations.ts
var flattenRefs = (input) => {
	const refs = [];
	const traverse = (item) => {
		if (item && typeof item === "object" && "value" in item) refs.push(item);
		else if (Array.isArray(item)) item.forEach(traverse);
		else if (item && typeof item === "object") Object.values(item).forEach(traverse);
	};
	traverse(input);
	return refs;
};
var operated = (args, fn) => {
	const getCurrentValues = () => args.map((arg) => {
		if (arg && typeof arg === "object" && "value" in arg) return arg.value;
		return arg;
	});
	const initialResult = fn(...getCurrentValues());
	if (typeof initialResult === "number") {
		const result = numberRef(initialResult);
		const updateResult = () => {
			result.value = fn(...getCurrentValues());
		};
		flattenRefs(args).forEach((ref) => affected(ref, updateResult));
		return result;
	}
	let currentResult = initialResult;
	const updateResult = () => {
		currentResult = fn(...getCurrentValues());
	};
	flattenRefs(args).forEach((ref) => affected(ref, updateResult));
	return currentResult;
};
//#endregion
//#region shared/fest/lure/math/GridMath.ts
var clampCell = (cellPos, layout) => {
	let x, y;
	if (cellPos instanceof Vector2D) {
		x = cellPos.x?.value ?? 0;
		y = cellPos.y?.value ?? 0;
	} else if (Array.isArray(cellPos) && cellPos.length >= 2) {
		x = cellPos[0] ?? 0;
		y = cellPos[1] ?? 0;
	} else return vector2Ref(0, 0);
	if (!isFinite(x) || !isFinite(y)) return vector2Ref(0, 0);
	const cols = Math.max(1, layout[0] || 1);
	const rows = Math.max(1, layout[1] || 1);
	return vector2Ref(Math.max(0, Math.min(Math.floor(x), cols - 1)), Math.max(0, Math.min(Math.floor(y), rows - 1)));
};
(class {
	static {
		this.unitPatterns = {
			px: /(-?\d*\.?\d+)px/g,
			em: /(-?\d*\.?\d+)em/g,
			rem: /(-?\d*\.?\d+)rem/g,
			vh: /(-?\d*\.?\d+)vh/g,
			vw: /(-?\d*\.?\d+)vw/g,
			vmin: /(-?\d*\.?\d+)vmin/g,
			vmax: /(-?\d*\.?\d+)vmax/g,
			percent: /(-?\d*\.?\d+)%/g
		};
	}
	static toPixels(value, element) {
		if (!value) return 0;
		const testElement = element || document.body;
		const testDiv = document.createElement("div");
		testDiv.style.position = "absolute";
		testDiv.style.visibility = "hidden";
		testDiv.style.width = value;
		testElement.appendChild(testDiv);
		const pixels = testDiv.offsetWidth;
		testElement.removeChild(testDiv);
		return pixels;
	}
	static fromPixels(pixels, unit = "px") {
		switch (unit) {
			case "em": return `${pixels / parseFloat(getComputedStyle(document.body).fontSize)}em`;
			case "rem": return `${pixels / parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
			case "%": return `${pixels / globalThis.innerWidth * 100}%`;
			default: return `${pixels}px`;
		}
	}
	static parseValue(cssValue) {
		const match = cssValue.match(/^(-?\d*\.?\d+)([a-z%]+)?$/);
		if (!match) return {
			value: 0,
			unit: "px"
		};
		return {
			value: parseFloat(match[1]),
			unit: match[2] || "px"
		};
	}
	static convertUnits(value, fromUnit, toUnit, element) {
		if (fromUnit === toUnit) return value;
		let pixels;
		switch (fromUnit) {
			case "px":
				pixels = value;
				break;
			case "em":
				pixels = value * parseFloat(getComputedStyle(element || document.body).fontSize);
				break;
			case "rem":
				pixels = value * parseFloat(getComputedStyle(document.documentElement).fontSize);
				break;
			case "%":
				pixels = value / 100 * globalThis.innerWidth;
				break;
			case "vw":
				pixels = value / 100 * globalThis.innerWidth;
				break;
			case "vh":
				pixels = value / 100 * globalThis.innerHeight;
				break;
			default: pixels = value;
		}
		switch (toUnit) {
			case "px": return pixels;
			case "em":
				const fontSize = parseFloat(getComputedStyle(element || document.body).fontSize);
				return pixels / fontSize;
			case "rem":
				const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
				return pixels / rootFontSize;
			case "%": return pixels / globalThis.innerWidth * 100;
			case "vw": return pixels / globalThis.innerWidth * 100;
			case "vh": return pixels / globalThis.innerHeight * 100;
			default: return pixels;
		}
	}
});
var CSSCalc = class {
	static add(a, b, unit = "px") {
		return operated([a, b], () => `calc(${a.value}${unit} + ${b.value}${unit})`);
	}
	static subtract(a, b, unit = "px") {
		return operated([a, b], () => `calc(${a.value}${unit} - ${b.value}${unit})`);
	}
	static multiply(a, b) {
		return operated([a, b], () => `calc(${a.value} * ${b.value})`);
	}
	static divide(a, b) {
		return operated([a, b], () => `calc(${a.value} / ${b.value})`);
	}
	static clamp(value, min, max, unit = "px") {
		return operated([
			value,
			min,
			max
		], () => `clamp(${min.value}${unit}, ${value.value}${unit}, ${max.value}${unit})`);
	}
	static min(a, b, unit = "px") {
		return operated([a, b], () => `min(${a.value}${unit}, ${b.value}${unit})`);
	}
	static max(a, b, unit = "px") {
		return operated([a, b], () => `max(${a.value}${unit}, ${b.value}${unit})`);
	}
};
//#endregion
//#region shared/fest/lure/extension/controllers/LongPress.ts
var defaultOptions = {
	anyPointer: true,
	mouseImmediate: true,
	minHoldTime: 100,
	maxHoldTime: 2e3,
	maxOffsetRadius: 10
};
/** Suppress the synthetic click after long-press without blocking other listeners on the same target. */
var preventor = [(ev) => {
	ev.preventDefault();
	ev.stopPropagation();
}, { once: true }];
var LongPressHandler = class {
	#holder;
	#preventedPointers;
	constructor(holder, options = { ...defaultOptions }, fx) {
		this.holding = {
			fx: null,
			options: {},
			actionState: {}
		};
		(this.#holder = holder)["@control"] = this;
		this.#preventedPointers = /* @__PURE__ */ new Set();
		if (!holder) throw Error("Element is null...");
		if (!options) options = { ...defaultOptions };
		const currentClone = { ...options };
		Object.assign(options, defaultOptions, currentClone);
		if (options) this.longPress(options, fx);
	}
	defaultHandler(ev, weakRef) {
		return weakRef?.deref()?.dispatchEvent?.(new PointerEvent("long-press", {
			...ev,
			bubbles: true
		}));
	}
	longPress(options = { ...defaultOptions }, fx) {
		const ROOT = document.documentElement;
		const weakRef = new WeakRef(this.#holder);
		this.holding = {
			actionState: this.initializeActionState(),
			options,
			fx: fx || ((ev) => this.defaultHandler(ev, weakRef))
		};
		const pointerDownListener = (ev) => this.onPointerDown(this.holding, ev, weakRef);
		const pointerMoveListener = (ev) => this.onPointerMove(this.holding, ev);
		const pointerUpListener = (ev) => this.onPointerUp(this.holding, ev);
		addEvents(ROOT, {
			"pointerdown": pointerDownListener,
			"pointermove": pointerMoveListener,
			"pointerup": pointerUpListener,
			"pointercancel": pointerUpListener
		});
	}
	initializeActionState() {
		return {
			timerId: null,
			immediateTimerId: null,
			pointerId: -1,
			startCoord: [0, 0],
			lastCoord: [0, 0],
			isReadyForLongPress: false,
			cancelCallback: () => {},
			cancelPromiseResolver: null,
			cancelPromiseRejector: null
		};
	}
	preventFromClicking(self, ev) {
		if (!this.#preventedPointers.has(ev.pointerId)) {
			this.#preventedPointers.add(ev.pointerId);
			self?.addEventListener?.("click", ...preventor);
			self?.addEventListener?.("contextmenu", ...preventor);
		}
	}
	releasePreventing(self, pointerId) {
		if (this.#preventedPointers.has(pointerId)) {
			this.#preventedPointers.delete(pointerId);
			self?.removeEventListener?.("click", ...preventor);
			self?.removeEventListener?.("contextmenu", ...preventor);
		}
	}
	onPointerDown(self, ev, weakRef) {
		if (!this.isValidTarget(self, ev.target, weakRef) || !(self.options?.anyPointer || ev?.pointerType == "touch")) return;
		ev.preventDefault();
		this.resetAction(self, self.actionState);
		const { actionState } = self;
		actionState.pointerId = ev.pointerId;
		actionState.startCoord = [ev.clientX, ev.clientY];
		actionState.lastCoord = [...actionState.startCoord];
		const $withResolver = Promise.withResolvers();
		actionState.cancelPromiseResolver = $withResolver.resolve;
		actionState.cancelPromiseRejector = $withResolver.reject;
		actionState.cancelCallback = () => {
			clearTimeout(actionState.timerId);
			clearTimeout(actionState.immediateTimerId);
			actionState.isReadyForLongPress = false;
			$withResolver.resolve();
			this.resetAction(self, actionState);
		};
		if (self.options?.mouseImmediate && ev.pointerType === "mouse") {
			self.fx?.(ev);
			return actionState.cancelCallback();
		}
		actionState.timerId = setTimeout(() => {
			actionState.isReadyForLongPress = true;
		}, self.options?.minHoldTime);
		actionState.immediateTimerId = setTimeout(() => {
			if (this.isInPlace(self)) {
				this.preventFromClicking(self, ev);
				self.fx?.(ev);
				actionState.cancelCallback();
			}
		}, self.options?.maxHoldTime);
		Promise.race([$withResolver.promise, new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("Timeout")), 3e3))]).catch(console.warn);
	}
	onPointerMove(self, ev) {
		const { actionState } = self;
		if (ev.pointerId !== actionState.pointerId) return;
		actionState.lastCoord = [ev.clientX, ev.clientY];
		if (!this.isInPlace(self)) return actionState.cancelCallback();
		this.preventFromClicking(self, ev);
		actionState.startCoord = [ev.clientX, ev.clientY];
	}
	resetAction(self, actionState) {
		this.releasePreventing(self, actionState.pointerId);
		actionState.pointerId = -1;
		actionState.cancelPromiseResolver = null;
		actionState.cancelPromiseRejector = null;
		actionState.isReadyForLongPress = false;
		actionState.cancelCallback = null;
	}
	onPointerUp(self, ev) {
		const { actionState } = self;
		if (ev.pointerId !== actionState.pointerId) return;
		actionState.lastCoord = [ev.clientX, ev.clientY];
		if (actionState.isReadyForLongPress && this.isInPlace(self)) {
			self.fx?.(ev);
			this.preventFromClicking(self, ev);
		}
		actionState.cancelCallback();
		this.resetAction(self, actionState);
	}
	hasParent(current, parent) {
		while (current) {
			if (current === parent) return true;
			current = current.parentElement;
		}
	}
	isInPlace(self) {
		const { actionState } = self;
		const [startX, startY] = actionState.startCoord;
		const [lastX, lastY] = actionState.lastCoord;
		return Math.hypot(lastX - startX, lastY - startY) <= self.options?.maxOffsetRadius;
	}
	isValidTarget(self, target, weakRef) {
		const weakElement = weakRef?.deref?.();
		return weakElement && (this.hasParent(target, weakElement) || target === weakElement) && (!self.options?.handler || target.matches(self.options?.handler));
	}
};
//#endregion
//#region shared/fest/lure/extension/controllers/Handler.ts
var handleByPointer = (cb, root = typeof document != "undefined" ? document?.documentElement : null) => {
	if (!root) return () => {};
	let pointerId = -1;
	const rst = (ev) => {
		pointerId = -1;
	};
	const tgi = (ev) => {
		if (pointerId < 0) pointerId = ev.pointerId;
		if (pointerId == ev.pointerId) cb?.(ev);
	};
	const listening = [
		addEvent(root, "pointerup", rst),
		addEvent(root, "pointercancel", rst),
		addEvent(root, "pointermove", tgi)
	];
	return () => {
		listening.forEach((ub) => ub?.());
	};
};
//#endregion
//#region shared/fest/lure/extension/modules/CtxMenu.ts
var itemClickHandle = (ev, ctxMenuDesc) => {
	const id = Q(`[data-id]`, ev?.target, 0, "parent")?.getAttribute?.("data-id");
	const item = ctxMenuDesc?.items?.find?.((I) => I?.some?.((I) => I?.id == id))?.find?.((I) => I?.id == id);
	(item?.action ?? ctxMenuDesc?.defaultAction)?.(ctxMenuDesc?.openedWith?.initiator, item, ctxMenuDesc?.openedWith?.event ?? ev);
	ctxMenuDesc?.openedWith?.close?.();
	const vr = getBoundVisibleRef(ctxMenuDesc?.openedWith?.element);
	if (vr != null) vr.value = false;
};
var visibleMap = /* @__PURE__ */ new WeakMap();
var registerCtxMenu = typeof document !== "undefined" && document?.documentElement ? addProxiedEvent(document.documentElement, "contextmenu", {
	capture: true,
	passive: false
}, {
	strategy: "closest",
	preventDefault: "handled",
	stopImmediatePropagation: "handled"
}) : (_el, _handler) => () => {};
var getBoundVisibleRef = (menuElement) => {
	if (menuElement == null) return null;
	return visibleMap?.getOrInsertComputed?.(menuElement, () => visibleRef(menuElement, false));
};
var bindMenuItemClickHandler = (menuElement, menuDesc) => {
	const handler = (ev) => {
		itemClickHandle(ev, menuDesc);
	};
	const listening = addEvent(menuElement, "click", handler, { composed: true });
	return () => listening?.();
};
var getGlobalContextMenu = (parent = document) => {
	let menu = Q("ui-modal[type=\"contextmenu\"]", parent);
	if (!menu) {
		menu = H`<ui-modal type="contextmenu"></ui-modal>`;
		(parent instanceof Document ? parent.body : parent).append(menu);
	}
	return menu;
};
var makeMenuHandler = (triggerElement, placement, ctxMenuDesc, menuElement) => {
	return (ev) => {
		let handled = false;
		const menu = menuElement || getGlobalContextMenu();
		const visibleRef = getBoundVisibleRef(menu);
		const initiator = ev?.target ?? triggerElement ?? document.elementFromPoint(ev?.clientX || 0, ev?.clientY || 0);
		const details = {
			event: ev,
			initiator,
			trigger: triggerElement,
			menu,
			ctxMenuDesc
		};
		ctxMenuDesc.context = details;
		if (ctxMenuDesc?.onBeforeOpen?.(details) === false) return handled;
		const builtItems = ctxMenuDesc?.buildItems?.(details);
		if (Array.isArray(builtItems) && builtItems.length) ctxMenuDesc.items = builtItems;
		if (visibleRef?.value && ev?.type !== "contextmenu") {
			visibleRef.value = false;
			ctxMenuDesc?.openedWith?.close?.();
			return handled;
		}
		if (initiator && visibleRef) {
			handled = true;
			menu.innerHTML = "";
			visibleRef.value = true;
			menu?.append?.(...ctxMenuDesc?.items?.map?.((section, sIdx) => {
				const items = section?.map?.((item) => H`<li data-id=${item?.id || ""}><ui-icon icon=${item?.icon || ""}></ui-icon><span>${item?.label || ""}</span></li>`);
				const separator = section?.length > 1 && sIdx !== (ctxMenuDesc?.items?.length || 0) - 1 ? H`<li class="ctx-menu-separator"></li>` : null;
				return [...items, separator];
			})?.flat?.()?.filter?.((E) => !!E) || []);
			const where = withInsetWithPointer?.(menu, placement?.(ev, initiator));
			const unbindClick = bindMenuItemClickHandler(menu, ctxMenuDesc);
			const untrigger = makeInterruptTrigger?.(menu, (e) => {
				const menuAny = menu;
				if (!(menu?.contains?.(e?.target ?? null) || e?.target == (menuAny?.element ?? menuAny)) || !e?.target) {
					ctxMenuDesc?.openedWith?.close?.();
					const vr = getBoundVisibleRef(menu);
					if (vr != null) vr.value = false;
				}
			}, [
				"click",
				"pointerdown",
				"scroll"
			]);
			const unmenuCtx = registerCtxMenu(menu, () => true);
			ctxMenuDesc.openedWith = {
				initiator,
				element: menu,
				event: ev,
				context: ctxMenuDesc?.context,
				close() {
					visibleRef.value = false;
					ctxMenuDesc.openedWith = null;
					unbindClick?.();
					where?.();
					untrigger?.();
					unmenuCtx?.();
					if (ctxMenuDesc._backUnreg) {
						ctxMenuDesc._backUnreg();
						ctxMenuDesc._backUnreg = null;
					}
				}
			};
			if (!ctxMenuDesc._backUnreg && visibleRef) ctxMenuDesc._backUnreg = registerContextMenu(menu, visibleRef, () => {
				ctxMenuDesc?.openedWith?.close?.();
			});
		}
		return handled;
	};
};
var ctxMenuTrigger = (triggerElement, ctxMenuDesc, menuElement) => {
	const evHandler = makeMenuHandler(triggerElement, (ev) => [
		ev?.clientX,
		ev?.clientY,
		200
	], ctxMenuDesc, menuElement);
	const unbindConnected = bindWhileConnected(triggerElement, () => {
		return registerCtxMenu(triggerElement, evHandler);
	});
	return () => {
		unbindConnected?.();
	};
};
Promise.resolve();
var collectProviders = (ev, action) => {
	const providers = /* @__PURE__ */ new Set();
	let el = ev?.target || document.activeElement || document.body;
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable) return [];
	let current = el;
	while (current) {
		if (typeof current[action] === "function") providers.add(current);
		if (current.operativeInstance && typeof current.operativeInstance[action] === "function") providers.add(current.operativeInstance);
		if (current.shadowRoot && current.shadowRoot.host) current = current.shadowRoot.host;
		else current = current.parentElement || current.getRootNode()?.host;
	}
	if (ev.currentTarget instanceof Node || typeof document !== "undefined") {
		const root = ev.currentTarget instanceof Node ? ev.currentTarget instanceof Document ? ev.currentTarget.body : ev.currentTarget : document.body;
		if (root) {
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode(node) {
				if (typeof node[action] === "function" || node.operativeInstance && typeof node.operativeInstance[action] === "function") return NodeFilter.FILTER_ACCEPT;
				return NodeFilter.FILTER_SKIP;
			} });
			while (walker.nextNode()) {
				const node = walker.currentNode;
				if (typeof node[action] === "function") providers.add(node);
				if (node.operativeInstance && typeof node.operativeInstance[action] === "function") providers.add(node.operativeInstance);
			}
		}
	}
	return Array.from(providers);
};
var handleClipboardEvent = (ev, type) => {
	const providers = collectProviders(ev, type);
	for (const provider of providers) provider[type]?.(ev);
};
var initialized = false;
var initGlobalClipboard = () => {
	if (typeof window === "undefined" || initialized) return;
	initialized = true;
	lazyAddEventListener(window, "copy", (ev) => handleClipboardEvent(ev, "onCopy"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "cut", (ev) => handleClipboardEvent(ev, "onCut"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "paste", (ev) => handleClipboardEvent(ev, "onPaste"), {
		capture: false,
		passive: false
	});
};
//#endregion
//#region shared/fest/lure/extension/opfs/OPFS.uniform.worker.ts?worker
function WorkerWrapper(options) {
	return new Worker("" + new URL("../workers/opfs/OPFS.uniform.worker.js", import.meta.url).href, {
		type: "module",
		name: options?.name
	});
}
//#endregion
//#region shared/fest/lure/extension/opfs/OPFS.ts
var workerChannel = null;
var isServiceWorker = typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope;
var SW_BRIDGE_CHANNEL_NAME = "opfs-sw-bridge-v1";
var observers = /* @__PURE__ */ new Map();
var workerInitPromise = null;
var swBridgeChannel = null;
var swBridgeRequestCounter = 0;
var ensureSwBridgeChannel = () => {
	if (!isServiceWorker) return null;
	if (swBridgeChannel) return swBridgeChannel;
	try {
		if (typeof BroadcastChannel === "undefined") return null;
		swBridgeChannel = new BroadcastChannel(SW_BRIDGE_CHANNEL_NAME);
		return swBridgeChannel;
	} catch {
		return null;
	}
};
var postViaSwBridge = (type, payload = {}, timeoutMs = 2500) => {
	const channel = ensureSwBridgeChannel();
	if (!channel) return Promise.reject(/* @__PURE__ */ new Error("SW OPFS bridge is unavailable"));
	const requestId = `sw-opfs-${Date.now()}-${++swBridgeRequestCounter}`;
	return new Promise((resolve, reject) => {
		let timeoutId = null;
		const onMessage = (event) => {
			const data = event?.data || {};
			if (!data || typeof data !== "object") return;
			if (data?.type !== "opfs-sw-response") return;
			if (String(data?.requestId || "") !== requestId) return;
			channel.removeEventListener("message", onMessage);
			if (timeoutId) clearTimeout(timeoutId);
			if (data?.ok) resolve(data?.result);
			else reject(new Error(String(data?.error || "Unknown bridge error")));
		};
		channel.addEventListener("message", onMessage);
		timeoutId = setTimeout(() => {
			channel.removeEventListener("message", onMessage);
			reject(/* @__PURE__ */ new Error("SW OPFS bridge timeout"));
		}, timeoutMs);
		channel.postMessage({
			type: "opfs-sw-request",
			requestId,
			action: type,
			payload
		});
	});
};
var ensureWorker = () => {
	if (workerInitPromise) return workerInitPromise;
	workerInitPromise = new Promise(async (resolve) => {
		if (typeof Worker !== "undefined" && !isServiceWorker) try {
			const baseChannel = await createWorkerChannel({
				name: "opfs-worker",
				script: WorkerWrapper
			});
			workerChannel = new QueuedWorkerChannel("opfs-worker", async () => baseChannel, {
				timeout: 3e4,
				retries: 3,
				batching: true,
				compression: false
			});
			resolve(workerChannel);
		} catch (e) {
			console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", e);
			workerChannel = null;
			resolve(null);
		}
		else {
			workerChannel = null;
			resolve(null);
		}
	});
	return workerInitPromise;
};
var directHandlers = {
	readDirectory: async ({ rootId, path, create }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			let current = root;
			for (const part of parts) current = await current.getDirectoryHandle(part, { create });
			const entries = [];
			for await (const [name, entry] of current.entries()) entries.push([name, entry]);
			return entries;
		} catch (e) {
			console.warn("Direct readDirectory error:", e);
			return [];
		}
	},
	readFile: async ({ rootId, path, type }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			const file = await (await dir.getFileHandle(filename, { create: false })).getFile();
			if (type === "text") return await file.text();
			if (type === "arrayBuffer") return await file.arrayBuffer();
			return file;
		} catch (e) {
			console.warn("Direct readFile error:", e);
			return null;
		}
	},
	writeFile: async ({ rootId, path, data }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true });
			const writable = await (await dir.getFileHandle(filename, { create: true })).createWritable();
			await writable.write(data);
			await writable.close();
			return true;
		} catch (e) {
			console.warn("Direct writeFile error:", e);
			return false;
		}
	},
	remove: async ({ rootId, path, recursive }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const name = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			await dir.removeEntry(name, { recursive });
			return true;
		} catch {
			return false;
		}
	},
	copy: async ({ from, to }) => {
		try {
			const copyRecursive = async (source, dest) => {
				if (source.kind === "directory") for await (const [name, entry] of source.entries()) if (entry.kind === "directory") await copyRecursive(entry, await dest.getDirectoryHandle(name, { create: true }));
				else {
					const file = await entry.getFile();
					const writable = await (await dest.getFileHandle(name, { create: true })).createWritable();
					await writable.write(file);
					await writable.close();
				}
				else {
					const file = await source.getFile();
					const writable = await dest.createWritable();
					await writable.write(file);
					await writable.close();
				}
			};
			await copyRecursive(from, to);
			return true;
		} catch (e) {
			console.warn("Direct copy error:", e);
			return false;
		}
	},
	observe: async () => false,
	unobserve: async () => true,
	mount: async () => true,
	unmount: async () => true
};
var post = (type, payload = {}, transfer = []) => {
	if (isServiceWorker && directHandlers[type]) return postViaSwBridge(type, payload).catch(() => directHandlers[type](payload));
	return new Promise(async (resolve, reject) => {
		try {
			const channel = await ensureWorker();
			if (!channel) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				return reject(/* @__PURE__ */ new Error("No worker channel available"));
			}
			let result;
			try {
				result = await channel.request(type, payload);
			} catch (requestError) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				throw requestError;
			}
			if (result === false && (type === "writeFile" || type === "remove" || type === "copy")) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
			}
			resolve(result);
		} catch (err) {
			if (directHandlers[type]) try {
				return resolve(directHandlers[type](payload));
			} catch (fallbackError) {
				return reject(fallbackError);
			}
			reject(err);
		}
	});
};
var getDir = (dest) => {
	if (typeof dest != "string") return dest;
	dest = dest?.trim?.() || dest;
	if (!dest?.endsWith?.("/")) dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest;
	const p1 = !dest?.trim()?.endsWith("/") ? dest + "/" : dest;
	return !p1?.startsWith("/") ? "/" + p1 : p1;
};
var generalFileImportDesc = {
	startIn: "documents",
	multiple: false,
	types: [{
		description: "files",
		accept: { "application/*": [
			".txt",
			".md",
			".html",
			".htm",
			".css",
			".js",
			".json",
			".csv",
			".xml",
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".svg",
			".ico",
			".mp3",
			".wav",
			".mp4",
			".webm",
			".pdf",
			".zip",
			".rar",
			".7z"
		] }
	}]
};
var mappedRoots = new Map([
	["/", async () => await navigator?.storage?.getDirectory?.()],
	["/user/", async () => await navigator?.storage?.getDirectory?.()],
	["/assets/", async () => {
		console.warn("Backend related API not implemented!");
		return null;
	}]
]);
var currentHandleMap = /* @__PURE__ */ new Map();
var mountAsRoot = async (forId, copyFromInternal) => {
	const cleanId = forId?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((p) => !!p?.trim?.())?.at?.(0);
	const rootHandle = currentHandleMap?.get(cleanId) ?? await showDirectoryPicker?.({
		mode: "readwrite",
		id: `${cleanId}`
	})?.catch?.(console.warn.bind(console));
	if (rootHandle && cleanId && typeof cleanId == "string") currentHandleMap?.set?.(cleanId, rootHandle);
	if (rootHandle && typeof localStorage != "undefined") localStorage?.setItem?.("opfs.mounted", JSON.stringify([...JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]"), cleanId]));
	if (rootHandle) post("mount", {
		id: cleanId,
		handle: rootHandle
	});
	if (copyFromInternal && rootHandle && cleanId == "user") await copyFromOneHandlerToAnother(await navigator?.storage?.getDirectory?.(), rootHandle, {})?.catch?.(console.warn.bind(console));
	return rootHandle;
};
async function resolveRootHandle(rootHandle, relPath = "") {
	if (rootHandle == null || rootHandle == void 0 || rootHandle?.trim?.()?.length == 0) rootHandle = "/user/";
	const cleanId = typeof rootHandle == "string" ? rootHandle?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((p) => !!p?.trim?.())?.at?.(0) : null;
	if (cleanId) {
		if (typeof localStorage != "undefined" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(cleanId)) rootHandle = currentHandleMap?.get(cleanId);
		if (!rootHandle) rootHandle = await mappedRoots?.get?.(`/${cleanId}/`)?.() ?? await navigator.storage.getDirectory();
	}
	if (rootHandle instanceof FileSystemDirectoryHandle) return rootHandle;
	const normalizedPath = relPath?.trim?.() || "/";
	const pathForMatch = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
	let bestMatch = null;
	let bestMatchLength = 0;
	for (const [rootPath, rootResolver] of mappedRoots.entries()) if (pathForMatch.startsWith(rootPath) && rootPath.length > bestMatchLength) {
		bestMatch = rootResolver;
		bestMatchLength = rootPath.length;
	}
	try {
		return (bestMatch ? await bestMatch() : null) || await navigator?.storage?.getDirectory?.();
	} catch (error) {
		console.warn("Failed to resolve root handle, falling back to OPFS root:", error);
		return await navigator?.storage?.getDirectory?.();
	}
}
function normalizePath$1(basePath = "", relPath) {
	if (!relPath?.trim()) return basePath;
	const cleanRelPath = relPath.trim();
	if (cleanRelPath.startsWith("/")) return cleanRelPath;
	const baseParts = basePath.split("/").filter((p) => p?.trim());
	const relParts = cleanRelPath.split("/").filter((p) => p?.trim());
	for (const part of relParts) if (part === ".") continue;
	else if (part === "..") {
		if (baseParts.length > 0) baseParts.pop();
	} else baseParts.push(part);
	return "/" + baseParts.join("/");
}
async function resolvePath(rootHandle, relPath, basePath = "") {
	const normalizedRelPath = normalizePath$1(basePath, relPath);
	return {
		rootHandle: await resolveRootHandle(rootHandle, normalizedRelPath),
		resolvedPath: normalizedRelPath
	};
}
function handleError(logger, status, message) {
	logger?.(status, message);
	return null;
}
function defaultLogger(status, message) {
	console.trace(`[${status}] ${message}`);
}
function detectTypeByRelPath(relPath) {
	if (relPath?.trim()?.endsWith?.("/")) return "directory";
	return "file";
}
function getMimeTypeByFilename(filename) {
	return {
		"txt": "text/plain",
		"md": "text/markdown",
		"html": "text/html",
		"htm": "text/html",
		"css": "text/css",
		"js": "application/javascript",
		"json": "application/json",
		"csv": "text/csv",
		"xml": "application/xml",
		"jpg": "image/jpeg",
		"jpeg": "image/jpeg",
		"png": "image/png",
		"gif": "image/gif",
		"webp": "image/webp",
		"svg": "image/svg+xml",
		"ico": "image/x-icon",
		"mp3": "audio/mpeg",
		"wav": "audio/wav",
		"mp4": "video/mp4",
		"webm": "video/webm",
		"pdf": "application/pdf",
		"zip": "application/zip",
		"rar": "application/vnd.rar",
		"7z": "application/x-7z-compressed"
	}[filename?.split?.(".")?.pop?.()?.toLowerCase?.()] || "application/octet-stream";
}
var hasFileExtension = (path) => {
	return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
};
async function getDirectoryHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const parts = stripUserScopePrefix(resolvedPath).split("/").filter((p) => !!p?.trim?.());
		if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) parts?.pop?.();
		let dir = resolvedRoot;
		if (parts?.length > 0) for (const part of parts) {
			dir = await dir?.getDirectoryHandle?.(part, { create });
			if (!dir) break;
		}
		return dir;
	} catch (e) {
		return handleError(logger, "error", `getDirectoryHandle: ${e.message}`);
	}
}
async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const cleanPath = stripUserScopePrefix(resolvedPath);
		const parts = cleanPath.split("/").filter((d) => !!d?.trim?.());
		if (parts?.length == 0) return null;
		const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, "-") : "";
		const dirName = parts.length > 1 ? parts?.slice(0, -1)?.join?.("/")?.trim?.()?.replace?.(/\s+/g, "-") : "";
		if (cleanPath?.trim?.()?.endsWith?.("/")) return null;
		return (await getDirectoryHandle(resolvedRoot, dirName, {
			create,
			basePath
		}, logger))?.getFileHandle?.(filePath, { create });
	} catch (e) {
		return handleError(logger, "error", `getFileHandle: ${e.message}`);
	}
}
async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		if (detectTypeByRelPath(resolvedPath) == "directory") {
			const dir = await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ""), options, logger);
			if (dir) return {
				type: "directory",
				handle: dir
			};
		} else {
			const file = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
			if (file) return {
				type: "file",
				handle: file
			};
		}
		return null;
	} catch (e) {
		return handleError(logger, "error", `getHandler: ${e.message}`);
	}
}
var directoryCacheMap = /* @__PURE__ */ new Map();
function openDirectory(rootHandle, relPath, options = { create: false }, logger = defaultLogger) {
	let cacheKey = "";
	let localMapCache = observe(/* @__PURE__ */ new Map());
	const statePromise = (async () => {
		try {
			const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
			cacheKey = `${resolvedRootHandle?.name || "root"}:${resolvedPath}`;
			return {
				rootHandle: resolvedRootHandle,
				resolvedPath
			};
		} catch {
			return {
				rootHandle: null,
				resolvedPath: ""
			};
		}
	})().then(async ({ rootHandle, resolvedPath }) => {
		if (!resolvedPath) return null;
		const existing = directoryCacheMap.get(cacheKey);
		if (existing) {
			existing.refCount++;
			localMapCache = existing.mapCache;
			return existing;
		}
		const mapCache = observe(/* @__PURE__ */ new Map());
		localMapCache = mapCache;
		const observationId = UUIDv4();
		const dirHandlePromise = getDirectoryHandle(rootHandle, resolvedPath, options, logger);
		const updateCache = async () => {
			const entries = await post("readDirectory", {
				rootId: "",
				path: stripUserScopePrefix(resolvedPath),
				create: options.create
			}, rootHandle ? [rootHandle] : []);
			if (!entries) return mapCache;
			const entryMap = new Map(entries);
			for (const key of mapCache.keys()) if (!entryMap.has(key)) mapCache.delete(key);
			for (const [key, handle] of entryMap) if (!mapCache.has(key)) mapCache.set(key, handle);
			return mapCache;
		};
		const cleanup = () => {
			post("unobserve", { id: observationId });
			observers.delete(observationId);
			directoryCacheMap.delete(cacheKey);
		};
		observers.set(observationId, (changes) => {
			for (const change of changes) {
				if (!change?.name) continue;
				if (change.type === "modified" || change.type === "created" || change.type === "appeared") mapCache.set(change.name, change.handle);
				else if (change.type === "deleted" || change.type === "disappeared") mapCache.delete(change.name);
			}
		});
		post("observe", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			id: observationId
		}, rootHandle ? [rootHandle] : []);
		updateCache();
		const newState = {
			mapCache,
			dirHandle: dirHandlePromise,
			resolvePath: resolvedPath,
			observationId,
			refCount: 1,
			cleanup,
			updateCache
		};
		directoryCacheMap.set(cacheKey, newState);
		const entries = await Promise.all(await Array.fromAsync((await dirHandlePromise)?.entries?.() ?? []));
		for (const [name, handle] of entries) if (!mapCache.has(name)) mapCache.set(name, handle);
		return {
			...newState,
			mapCache
		};
	});
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		statePromise.then((s) => {
			if (!s) return;
			s.refCount--;
			if (s.refCount <= 0) s.cleanup();
		}).catch(console.warn);
	};
	const handler = {
		get(_target, prop) {
			if (prop === Symbol.toStringTag || prop === Symbol.iterator || prop === "toString" || prop === "valueOf" || prop === "inspect" || prop === "constructor" || prop === "__proto__" || prop === "prototype") return;
			if (prop === "dispose") return dispose;
			if (prop === "getMap") return () => localMapCache;
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === Symbol.iterator) return () => localMapCache[Symbol.iterator]();
			if (prop === "size") return localMapCache.size;
			if (prop === "has") return (k) => localMapCache.has(k);
			if (prop === "get") return (k) => localMapCache.get(k);
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === "refresh") return () => statePromise.then((s) => s?.updateCache?.()).then(() => pxy);
			if (prop === "then" || prop === "catch" || prop === "finally") {
				const p = statePromise.then(() => true);
				return p[prop].bind(p);
			}
			return (...args) => statePromise.then(async (s) => {
				if (!s) return void 0;
				const dh = await s.dirHandle;
				const v = dh?.[prop];
				if (typeof v === "function") return v.apply(dh, args);
				return v;
			});
		},
		ownKeys() {
			return Array.from(localMapCache.keys());
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	};
	const fx = function() {};
	const pxy = new Proxy(fx, handler);
	return pxy;
}
async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		return await post("readFile", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			type: "blob"
		}, resolvedRoot ? [resolvedRoot] : []);
	} catch (e) {
		return handleError(logger, "error", `readFile: ${e.message}`);
	}
}
async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
	if (data instanceof FileSystemFileHandle) data = await data.getFile();
	if (data instanceof FileSystemDirectoryHandle) {
		const dstHandle = await getDirectoryHandle(await resolveRootHandle(rootHandle), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, "-"), { create: true });
		return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
	} else try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, "");
		return await post("writeFile", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			data
		}, resolvedRoot ? [resolvedRoot] : []) !== false;
	} catch (e) {
		return handleError(logger, "error", `writeFile: ${e.message}`);
	}
}
async function removeFile(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		const candidates = userPathCandidates(resolvedPath);
		let lastResult = false;
		for (const candidate of candidates) {
			lastResult = await post("remove", {
				rootId: "",
				path: candidate,
				recursive: options.recursive
			}, resolvedRoot ? [resolvedRoot] : []);
			if (lastResult !== false) return true;
		}
		return lastResult !== false;
	} catch (e) {
		return handleError(logger, "error", `removeFile: ${e.message}`);
	}
}
async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		return removeFile(rootHandle, relPath, {
			recursive: true,
			...options
		}, logger);
	} catch (e) {
		return handleError(logger, "error", `remove: ${e.message}`);
	}
}
var downloadFile = async (file) => {
	if (file instanceof FileSystemFileHandle) file = await file.getFile();
	if (typeof file == "string") file = await provide(file);
	const filename = file?.name;
	if (!filename) return;
	if ("msSaveOrOpenBlob" in self.navigator) self.navigator.msSaveOrOpenBlob(file, filename);
	if (file instanceof FileSystemDirectoryHandle) {
		let dstHandle = await showDirectoryPicker?.({ mode: "readwrite" })?.catch?.(console.warn.bind(console));
		if (file && dstHandle) {
			dstHandle = await getDirectoryHandle(dstHandle, file?.name || "", { create: true })?.catch?.(console.warn.bind(console)) || dstHandle;
			return await copyFromOneHandlerToAnother(file, dstHandle, {})?.catch?.(console.warn.bind(console));
		}
		return;
	}
	const fx = await (self?.showOpenFilePicker ? new Promise((r) => r({
		showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
		showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
	})) : import(
		/* @vite-ignore */
		"fest/polyfill/showOpenFilePicker.mjs"
));
	if (window?.showSaveFilePicker) {
		const writableFileStream = await (await fx?.showSaveFilePicker?.({ suggestedName: filename })?.catch?.(console.warn.bind(console)))?.createWritable?.({ keepExistingData: true })?.catch?.(console.warn.bind(console));
		await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
		await writableFileStream?.close?.()?.catch?.(console.warn.bind(console));
	} else {
		const a = document.createElement("a");
		try {
			a.href = URL.createObjectURL(file);
		} catch (e) {
			console.warn(e);
		}
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			globalThis.URL.revokeObjectURL(a.href);
		}, 0);
	}
};
var provide = async (req = "", rw = false) => {
	const requestUrl = (typeof req === "string" ? req : req?.url || "").trim();
	if (!requestUrl) return null;
	let pathname = requestUrl;
	try {
		pathname = new URL(requestUrl, location?.origin || self?.location?.origin || "http://localhost").pathname || requestUrl;
	} catch {}
	const cleanPath = pathname?.trim?.() || "/";
	if (cleanPath?.startsWith?.("/user")) {
		const path = stripUserScopePrefix(cleanPath);
		const root = await navigator?.storage?.getDirectory?.();
		if (!root) return null;
		const handle = await getFileHandle(root, path, { create: !!rw }).catch(() => null);
		if (!handle) return null;
		if (rw) return handle?.createWritable?.();
		return handle?.getFile?.();
	}
	if (rw) return null;
	try {
		const baseOrigin = String(location?.origin || self?.location?.origin || "").trim();
		const fetchTarget = cleanPath.startsWith("/") ? new URL(cleanPath, baseOrigin || "http://localhost").toString() : requestUrl;
		const r = await fetch(fetchTarget);
		const blob = await r?.blob()?.catch?.(console.warn.bind(console));
		const lastModifiedHeader = r?.headers?.get?.("Last-Modified");
		const lastModified = lastModifiedHeader ? Date.parse(lastModifiedHeader) : 0;
		if (blob) {
			const fallbackName = cleanPath?.substring?.(cleanPath?.lastIndexOf?.("/") + 1) || "resource";
			return new File([blob], fallbackName, {
				type: blob?.type,
				lastModified: isNaN(lastModified) ? 0 : lastModified
			});
		}
	} catch (e) {
		return handleError(defaultLogger, "error", `provide: ${e.message}`);
	}
	return null;
};
var dropFile = async (file, dest = "/user/"?.trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const fs = await resolveRootHandle(null);
	const user = getDir(stripUserScopePrefix(dest))?.replace?.("/user", "")?.trim?.();
	file = file instanceof File ? file : new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp"));
	const fp = user + (file?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, "-");
	await writeFile(fs, fp, file);
	current?.set?.("/user" + fp?.trim?.()?.replace?.(/\s+/g, "-"), file);
	return "/user" + fp?.trim?.();
};
var uploadFile = async (dest = "/user/"?.trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const $e = "showOpenFilePicker";
	dest = stripUserScopePrefix(dest);
	return (window?.[$e]?.bind?.(window) ?? (await import("../fest/polyfill.js").then((n) => n.t))?.[$e])({
		...generalFileImportDesc,
		multiple: true
	})?.then?.(async (handles = []) => {
		for (const handle of handles) await dropFile(handle instanceof File ? handle : await handle?.getFile?.(), dest, current);
	});
};
var ghostImage = typeof Image != "undefined" ? new Image() : null;
if (ghostImage) {
	ghostImage.decoding = "async";
	ghostImage.width = 24;
	ghostImage.height = 24;
	try {
		ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], { type: "image/svg+xml" }));
	} catch (e) {}
}
var copyFromOneHandlerToAnother = async (fromHandle, toHandle, options = {}, logger = defaultLogger) => {
	return post("copy", {
		from: fromHandle,
		to: toHandle
	}, [fromHandle, toHandle]);
};
var handleIncomingEntries = (data, destPath = "/user/", rootHandle = null, onItemHandled) => {
	const tasks = [];
	const items = Array.from(data?.items ?? []);
	const files = Array.from(data?.files ?? []);
	const dataArray = Array.isArray(data) ? data : [...data?.[Symbol.iterator] ? data : [data]];
	return Promise.try(async () => {
		const resolvedRoot = await resolveRootHandle(rootHandle);
		const processItem = async (item) => {
			let handle;
			if (item.kind === "file" || item.kind === "directory") try {
				handle = await item.getAsFileSystemHandle?.();
			} catch {}
			if (handle) {
				if (handle.kind === "directory") {
					const nwd = await getDirectoryHandle(resolvedRoot, destPath + (handle.name || "").trim().replace(/\s+/g, "-"), { create: true });
					if (nwd) tasks.push(copyFromOneHandlerToAnother(handle, nwd, { create: true }));
				} else {
					const file = await handle.getFile();
					const path = destPath + (file.name || handle.name).trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
			if (item.kind === "file" || item instanceof File) {
				const file = item instanceof File ? item : item.getAsFile();
				if (file) {
					const path = destPath + file.name.trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
		};
		if (items?.length > 0) for (const item of items) await processItem(item);
		if (files?.length > 0) for (const file of files) await processItem(file);
		if (dataArray?.length > 0) for (const item of dataArray) await processItem(item);
		const uriList = data?.getData?.("text/uri-list") || data?.getData?.("text/plain");
		if (uriList && typeof uriList === "string") {
			const urls = uriList.split(/\r?\n/).filter(Boolean);
			for (const url of urls) {
				if (url.startsWith("file://")) continue;
				if (url.startsWith("/user/")) {
					const src = url.trim();
					tasks.push(Promise.try(async () => {
						const srcHandle = await getHandler(resolvedRoot, src);
						if (srcHandle?.handle) {
							const name = src.split("/").filter(Boolean).pop();
							if (srcHandle.type === "directory") {
								const nwd = await getDirectoryHandle(resolvedRoot, destPath + name, { create: true });
								await copyFromOneHandlerToAnother(srcHandle.handle, nwd, { create: true });
							} else {
								const file = await srcHandle.handle.getFile();
								const path = destPath + name;
								await writeFile(resolvedRoot, path, file);
								onItemHandled?.(file, path);
							}
						}
					}));
				} else tasks.push(Promise.try(async () => {
					const file = await provide(url);
					if (file) {
						const path = destPath + file.name;
						await writeFile(resolvedRoot, path, file);
						onItemHandled?.(file, path);
					}
				}));
			}
		}
		if (dataArray?.[0] instanceof ClipboardItem) {
			for (const item of dataArray) for (const type of item.types) if (type.startsWith("image/") || type.startsWith("text/")) {
				const blob = await item.getType(type);
				const ext = type.split("/")[1].split("+")[0] || "txt";
				const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
				const path = destPath + file.name;
				tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
			}
		}
		await Promise.allSettled(tasks).catch(console.warn.bind(console));
	});
};
//#endregion
//#region shared/fest/lure/extension/anchor/PointerAnchor.ts
var pointerAnchorRef = (root = typeof document != "undefined" ? document?.documentElement : null) => {
	if (!root) return () => {};
	const coordinate = [numberRef(0), numberRef(0)];
	coordinate.push(WRef(handleByPointer((ev) => {
		coordinate[0].value = ev.clientX;
		coordinate[1].value = ev.clientY;
	}, root)));
	if (coordinate[2]?.deref?.() ?? coordinate[2]) addToCallChain(coordinate, Symbol.dispose, coordinate[2]?.deref?.() ?? coordinate[2]);
	return coordinate;
};
//#endregion
//#region shared/fest/lure/extension/opfs/Base64Data.ts
var DEFAULT_MIME = "application/octet-stream";
var DATA_URL_RE = /^data:(?<mime>[^;,]+)?(?<params>(?:;[^,]*)*?),(?<data>[\s\S]*)$/i;
function canUseFromBase64() {
	return typeof Uint8Array.fromBase64 === "function";
}
function tryDecodeURIComponent(s) {
	try {
		return decodeURIComponent(s);
	} catch {
		return s;
	}
}
function likelyUriComponent(s) {
	return /%[0-9A-Fa-f]{2}/.test(s) || s.includes("+");
}
function bytesToArrayBuffer(bytes) {
	const buf = bytes.buffer;
	if (buf instanceof ArrayBuffer) return buf.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
	const ab = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(ab).set(bytes);
	return ab;
}
function parseDataUrl(input) {
	const s = (input || "").trim();
	if (!s.toLowerCase().startsWith("data:")) return null;
	const m = s.match(DATA_URL_RE);
	if (!m?.groups) return null;
	return {
		mimeType: (m.groups.mime || DEFAULT_MIME).trim() || DEFAULT_MIME,
		isBase64: (m.groups.params || "").toLowerCase().includes(";base64"),
		data: m.groups.data ?? ""
	};
}
function decodeBase64ToBytes(base64, options = {}) {
	const alphabet = options.alphabet || "base64";
	const lastChunkHandling = options.lastChunkHandling || "loose";
	const s = (base64 || "").trim();
	if (canUseFromBase64()) return Uint8Array.fromBase64(s, {
		alphabet,
		lastChunkHandling
	});
	const normalized = alphabet === "base64url" ? s.replace(/-/g, "+").replace(/_/g, "/") : s;
	const padLen = (4 - normalized.length % 4) % 4;
	const padded = normalized + "=".repeat(padLen);
	const binary = typeof atob === "function" ? atob(padded) : "";
	const out = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
	return out;
}
async function blobToBytes(blob) {
	const ab = await blob.arrayBuffer();
	return new Uint8Array(ab);
}
function looksLikeBase64(s) {
	const t = (s || "").trim();
	if (!t) return {
		isBase64: false,
		alphabet: "base64"
	};
	const alphabet = /[-_]/.test(t) && !/[+/]/.test(t) ? "base64url" : "base64";
	const cleaned = (alphabet === "base64url" ? t.replace(/-/g, "+").replace(/_/g, "/") : t).replace(/[\r\n\s]/g, "");
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) return {
		isBase64: false,
		alphabet
	};
	if (cleaned.length < 8) return {
		isBase64: false,
		alphabet
	};
	return {
		isBase64: true,
		alphabet
	};
}
function canParseUrl(value) {
	try {
		if (typeof URL === "undefined") return false;
		if (typeof URL.canParse === "function") return URL.canParse(value);
		new URL(value);
		return true;
	} catch {
		return false;
	}
}
function extensionByMimeType(mimeType) {
	const t = (mimeType || "").toLowerCase().split(";")[0].trim();
	if (!t) return "bin";
	const mapped = {
		"text/plain": "txt",
		"text/markdown": "md",
		"text/html": "html",
		"application/json": "json",
		"application/xml": "xml",
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/webp": "webp",
		"image/gif": "gif",
		"image/svg+xml": "svg",
		"application/pdf": "pdf"
	};
	if (mapped[t]) return mapped[t];
	const slashIdx = t.indexOf("/");
	if (slashIdx <= 0 || slashIdx >= t.length - 1) return "bin";
	let subtype = t.slice(slashIdx + 1);
	if (subtype.includes("+")) subtype = subtype.split("+")[0];
	if (subtype.includes(".")) subtype = subtype.split(".").pop() || subtype;
	return subtype || "bin";
}
function fallbackHashHex(bytes) {
	let h = 2166136261;
	for (let i = 0; i < bytes.length; i++) {
		h ^= bytes[i];
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0").repeat(8);
}
async function sha256Hex(bytes) {
	try {
		const subtle = globalThis.crypto?.subtle;
		if (!subtle) return fallbackHashHex(bytes);
		const digest = await subtle.digest("SHA-256", bytes);
		const out = new Uint8Array(digest);
		return Array.from(out, (b) => b.toString(16).padStart(2, "0")).join("");
	} catch {
		return fallbackHashHex(bytes);
	}
}
function isBase64Like(input) {
	return looksLikeBase64(input).isBase64;
}
async function normalizeDataAsset(input, options = {}) {
	const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
	const namePrefix = (options.namePrefix || "asset").trim() || "asset";
	const preserveFileName = options.preserveFileName ?? false;
	let source = "text";
	let blob;
	let incomingFile = null;
	if (input instanceof File) {
		source = "file";
		incomingFile = input;
		blob = options.mimeType && options.mimeType !== input.type ? new Blob([await input.arrayBuffer()], { type: options.mimeType }) : input;
	} else if (input instanceof Blob) {
		source = "blob";
		blob = options.mimeType && options.mimeType !== input.type ? new Blob([await input.arrayBuffer()], { type: options.mimeType }) : input;
	} else {
		const raw = (input instanceof URL ? input.toString() : String(input ?? "")).trim();
		const parsed = parseDataUrl(raw);
		const decodedUri = options.uriComponent ? tryDecodeURIComponent(raw) : likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw;
		if (parsed) source = "data-url";
		else if (canParseUrl(raw)) source = "url";
		else if (isBase64Like(raw)) source = "base64";
		else if (decodedUri !== raw && (parseDataUrl(decodedUri) || isBase64Like(decodedUri) || canParseUrl(decodedUri))) source = "uri";
		else source = "text";
		blob = await stringToBlob(source === "uri" ? decodedUri : raw, {
			mimeType: options.mimeType,
			uriComponent: options.uriComponent,
			isBase64: source === "base64" ? true : void 0,
			maxBytes
		});
	}
	const bytes = await blobToBytes(blob);
	if (bytes.byteLength > maxBytes) throw new Error(`Data too large: ${bytes.byteLength} bytes`);
	const hash = await sha256Hex(bytes);
	const mimeType = (options.mimeType || blob.type || DEFAULT_MIME).trim() || DEFAULT_MIME;
	const extension = extensionByMimeType(mimeType);
	const hashedName = options.filename || `${namePrefix}-${hash.slice(0, 16)}.${extension}`;
	const finalName = preserveFileName && incomingFile?.name ? incomingFile.name : hashedName;
	const file = incomingFile && preserveFileName && !options.mimeType ? incomingFile : new File([blob], finalName, { type: mimeType });
	return {
		hash,
		name: file.name,
		type: file.type || mimeType,
		size: file.size,
		source,
		file
	};
}
async function stringToBlobOrFile(input, options = {}) {
	const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
	const raw = (input ?? "").trim();
	const parsedDataUrl = parseDataUrl(raw);
	if (parsedDataUrl) {
		const mimeType = options.mimeType || parsedDataUrl.mimeType || DEFAULT_MIME;
		const payload = options.uriComponent ? tryDecodeURIComponent(parsedDataUrl.data) : likelyUriComponent(parsedDataUrl.data) ? tryDecodeURIComponent(parsedDataUrl.data) : parsedDataUrl.data;
		if (options.isBase64 ?? parsedDataUrl.isBase64) {
			const bytes = decodeBase64ToBytes(payload, {
				alphabet: options.base64?.alphabet || "base64",
				lastChunkHandling: options.base64?.lastChunkHandling || "loose"
			});
			if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
			const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
			if (!options.asFile) return blob;
			return new File([blob], options.filename || "file", { type: mimeType });
		}
		const blob = new Blob([payload], { type: mimeType });
		if (!options.asFile) return blob;
		return new File([blob], options.filename || "file", { type: mimeType });
	}
	try {
		if (typeof URL !== "undefined" && URL.canParse?.(raw)) {
			const blob = await (await fetch(raw)).blob();
			const mimeType = options.mimeType || blob.type || DEFAULT_MIME;
			const typed = blob.type === mimeType ? blob : new Blob([await blob.arrayBuffer()], { type: mimeType });
			if (!options.asFile) return typed;
			return new File([typed], options.filename || "file", { type: mimeType });
		}
	} catch {}
	const maybeDecoded = options.uriComponent ? tryDecodeURIComponent(raw) : likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw;
	const base64Hint = looksLikeBase64(maybeDecoded);
	const isBase64 = options.isBase64 ?? base64Hint.isBase64;
	const mimeType = options.mimeType || (isBase64 ? DEFAULT_MIME : "text/plain;charset=utf-8");
	if (isBase64) {
		const bytes = decodeBase64ToBytes(maybeDecoded, {
			alphabet: options.base64?.alphabet || base64Hint.alphabet,
			lastChunkHandling: options.base64?.lastChunkHandling || "loose"
		});
		if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
		const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
		if (!options.asFile) return blob;
		return new File([blob], options.filename || "file", { type: mimeType });
	}
	const blob = new Blob([maybeDecoded], { type: mimeType });
	if (!options.asFile) return blob;
	return new File([blob], options.filename || "file", { type: mimeType });
}
async function stringToBlob(input, options = {}) {
	return await stringToBlobOrFile(input, {
		...options,
		asFile: false
	});
}
async function stringToFile(input, filename, options = {}) {
	return await stringToBlobOrFile(input, {
		...options,
		asFile: true,
		filename
	});
}
//#endregion
//#region shared/fest/lure/extension/color/DynamicEngine.ts
var runWhenIdle = (cb, timeout = 100) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb({
		didTimeout: false,
		timeRemaining: () => 0
	}), 0);
};
var electronAPI = "electronBridge";
function extractAlpha(input) {
	if (typeof input !== "string") return null;
	let color = input.trim().toLowerCase();
	if (color === "transparent") return 0;
	if (color.startsWith("#")) {
		const hex = color;
		if (hex.length === 4) return 1;
		if (hex.length === 7) return 1;
		if (hex.length === 5) {
			const a = hex[4];
			const aa = a + a;
			return clamp(parseInt(aa, 16) / 255, 0, 1);
		}
		if (hex.length === 9) {
			const aa = hex.slice(7, 9);
			return clamp(parseInt(aa, 16) / 255, 0, 1);
		}
		return null;
	}
	const fnMatch = color.match(/^([a-z-]+)\((.*)\)$/i);
	if (!fnMatch) return null;
	fnMatch[1];
	const body = fnMatch[2].trim();
	{
		const slashIdx = body.lastIndexOf("/");
		if (slashIdx !== -1) {
			const a = parseAlphaComponent(body.slice(slashIdx + 1).trim());
			if (a != null) return clamp(a, 0, 1);
			return null;
		}
	}
	if (body.includes(",")) {
		const parts = body.split(",").map((s) => s.trim());
		if (parts.length >= 4) {
			const a = parseAlphaComponent(parts[3]);
			if (a != null) return clamp(a, 0, 1);
			return null;
		}
		return 1;
	}
	return 1;
}
function parseAlphaComponent(str) {
	if (!str) return null;
	if (str.endsWith("%")) {
		const n = parseFloat(str);
		if (Number.isNaN(n)) return null;
		return n / 100;
	}
	const n = parseFloat(str);
	if (Number.isNaN(n)) return null;
	return n;
}
function clamp(v, min, max) {
	return Math.min(max, Math.max(min, v));
}
var tacp = (color) => {
	if (!color || color == null) return 0;
	return (extractAlpha?.(color) || 0) > .1;
};
var setIdleInterval = (cb, timeout = 1e3, ...args) => {
	runWhenIdle(async () => {
		if (!cb || typeof cb != "function") return;
		while (true) {
			await Promise.try(cb, ...args);
			await new Promise((r) => setTimeout(r, timeout));
			await new Promise((r) => runWhenIdle(r, 100));
			await new Promise((r) => requestAnimationFrame(r));
		}
	}, 1e3);
};
/** Prefer real shell chrome (minimal nav / faint toolbar) for PWA title bar / WCO tint. */
var sampleShellToolbarBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	try {
		const hosts = document.querySelectorAll("[data-shell]");
		for (const host of hosts) {
			const sr = host.shadowRoot;
			if (!sr) continue;
			const bar = sr.querySelector(".app-shell__nav, .app-shell__toolbar");
			if (!bar) continue;
			const bg = getComputedStyle(bar).backgroundColor;
			if (tacp(bg)) return bg;
		}
	} catch {}
	return null;
};
/** Under window-controls-overlay, sample inside env(titlebar-area-*) — not under OS control buttons. */
var sampleWcoTitlebarStripColor = () => {
	if (typeof document === "undefined") return null;
	if (!globalThis.matchMedia?.("(display-mode: window-controls-overlay)")?.matches) return null;
	const probe = document.createElement("div");
	probe.setAttribute("data-wco-theme-probe", "true");
	probe.style.cssText = [
		"position:fixed",
		"visibility:hidden",
		"pointer-events:none",
		"z-index:-2147483648",
		"left:env(titlebar-area-x,0px)",
		"top:env(titlebar-area-y,0px)",
		"width:env(titlebar-area-width,0px)",
		"height:env(titlebar-area-height,0px)"
	].join(";");
	document.documentElement.appendChild(probe);
	try {
		const r = probe.getBoundingClientRect();
		if (r.width < 1 || r.height < 1) return null;
		const c = pickBgColor(Math.floor(r.left + Math.min(40, r.width * .2)), Math.floor(r.top + r.height * .5));
		return tacp(c) ? c : null;
	} finally {
		probe.remove();
	}
};
var pickBgColor = (x, y, holder = null) => {
	const opaque = Array.from(document.elementsFromPoint(x, y))?.filter?.((el) => el instanceof HTMLElement && el != holder && (el?.dataset?.alpha != null ? parseFloat(el?.dataset?.alpha) > .01 : true) && el?.checkVisibility?.({
		contentVisibilityAuto: true,
		opacityProperty: true,
		visibilityProperty: true
	}) && el?.matches?.(":not([data-hidden])") && el?.style?.getPropertyValue("display") != "none").map((element) => {
		const computed = getComputedStyle?.(element);
		return {
			element,
			zIndex: parseInt(computed?.zIndex || "0", 10) || 0,
			color: computed?.backgroundColor || "transparent"
		};
	}).sort((a, b) => Math.sign(b.zIndex - a.zIndex)).filter(({ color }) => tacp(color));
	if (opaque?.[0]?.element instanceof HTMLElement) return opaque?.[0]?.color || "transparent";
	return "transparent";
};
var pickFromCenter = (holder) => {
	const box = holder?.getBoundingClientRect();
	if (box) {
		const Z = .5 * (fixedClientZoom?.() || 1);
		return pickBgColor(...[(box.left + box.right) * Z, (box.top + box.bottom) * Z], holder);
	}
};
var dynamicNativeFrame = (root = document.documentElement) => {
	let media = root?.querySelector?.("meta[data-theme-color]") ?? root?.querySelector?.("meta[name=\"theme-color\"]");
	if (!media && root == document.documentElement) {
		media = document.createElement("meta");
		media.setAttribute("name", "theme-color");
		media.setAttribute("data-theme-color", "");
		media.setAttribute("content", "transparent");
		document.head.appendChild(media);
	}
	const fromShell = sampleShellToolbarBackgroundColor();
	const fromWco = !fromShell ? sampleWcoTitlebarStripColor() : null;
	const fallbackX = Math.max(8, Math.floor(globalThis.innerWidth * .12));
	const picked = !fromShell && !fromWco ? pickBgColor(fallbackX, 20) : null;
	const color = fromShell || fromWco || (picked && tacp(picked) ? picked : null);
	if (color && color !== "transparent" && (media || window?.["electronBridge"]) && root == document.documentElement) media?.setAttribute?.("content", color);
};
var dynamicBgColors = (root = document.documentElement) => {
	root.querySelectorAll("body, body > *, body > * > *").forEach((target) => {
		if (target) pickFromCenter(target);
	});
};
var dynamicTheme = (ROOT = document.documentElement) => {
	const startedKey = "__LURE_DYNAMIC_THEME_STARTED__";
	if (globalThis?.[startedKey]) return;
	globalThis[startedKey] = true;
	matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({}) => dynamicBgColors(ROOT));
	const updater = () => {
		dynamicNativeFrame(ROOT);
		dynamicBgColors(ROOT);
	};
	addEvent(ROOT, "u2-appear", () => runWhenIdle(updater, 100));
	addEvent(ROOT, "u2-hidden", () => runWhenIdle(updater, 100));
	addEvent(ROOT, "u2-theme-change", () => runWhenIdle(updater, 100));
	addEvent(window, "load", () => runWhenIdle(updater, 100));
	addEvent(document, "visibilitychange", () => runWhenIdle(updater, 100));
	setIdleInterval(updater, 500);
};
//#endregion
//#region shared/fest/lure/extension/color/ThemeEngine.ts
var colorScheme = async () => {
	dynamicNativeFrame();
	dynamicBgColors();
};
/**
* Opt-in autostart only.
* This module is re-exported from `fest/lure` root, so unconditional side effects
* here can start a competing theme-color loop in host apps.
*/
var maybeStartThemeEngine = () => {
	if (typeof document === "undefined") return;
	if (globalThis?.__LURE_AUTO_THEME_ENGINE__ !== true) return;
	requestAnimationFrame(() => colorScheme?.());
	dynamicTheme?.();
};
maybeStartThemeEngine();
//#endregion
//#region shared/fest/lure/extension/modules/LazyLoader.ts
/**
* Lazy load a component and its CSS
*/
async function lazyLoadComponent(importFn, options) {
	const { cssPath, componentName } = options;
	console.log(`[LazyLoader] Loading component: ${componentName}`);
	if (cssPath) try {
		await loadCSS(cssPath);
	} catch (error) {
		console.warn(`[LazyLoader] Failed to load CSS for ${componentName}:`, error);
	}
	try {
		const component = await importFn();
		console.log(`[LazyLoader] Successfully loaded component: ${componentName}`);
		return { component };
	} catch (error) {
		console.error(`[LazyLoader] Failed to load component ${componentName}:`, error);
		throw error;
	}
}
/**
* Load CSS dynamically
*/
async function loadCSS(href) {
	return new Promise((resolve, reject) => {
		if (document.querySelectorAll(`link[href="${href}"]`).length > 0) {
			resolve();
			return;
		}
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		link.onload = () => resolve();
		link.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load CSS: ${href}`));
		document.head.appendChild(link);
	});
}
/**
* Cache for loaded components to avoid re-loading
*/
var componentCache = /* @__PURE__ */ new Map();
/**
* Get or load a cached component
*/
async function getCachedComponent(cacheKey, importFn, options) {
	if (componentCache.has(cacheKey)) return componentCache.get(cacheKey);
	const lazyComponent = await lazyLoadComponent(importFn, options);
	componentCache.set(cacheKey, lazyComponent);
	return lazyComponent;
}
//#endregion
//#region src/com/store/IDBQueue.ts
var DB_NAME = "req-queue";
var STORE = "queue";
function idbOpen() {
	return new Promise((res, rej) => {
		const req = indexedDB.open(DB_NAME, 3);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (db.objectStoreNames.contains("queue")) db.deleteObjectStore(STORE);
			const store = db.createObjectStore(STORE, {
				keyPath: "id",
				autoIncrement: true
			});
			store.createIndex("byLockedId", ["locked", "id"], { unique: false });
			store.createIndex("byLockedAt", "lockedAt", { unique: false });
		};
		req.onsuccess = () => res(req.result);
		req.onerror = () => rej(req.error);
	});
}
function withTx(db, mode, fn) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, mode);
		const store = tx.objectStore(STORE);
		let done = false;
		const finish = (err, val) => {
			if (done) return;
			done = true;
			err ? reject(err) : resolve(val);
		};
		Promise.resolve().then(() => fn(store)).then((result) => {
			tx.oncomplete = () => finish(void 0, result);
			tx.onerror = () => finish(tx.error || /* @__PURE__ */ new Error("Transaction error"));
			tx.onabort = () => finish(tx.error || /* @__PURE__ */ new Error("Transaction aborted"));
		}).catch((e) => {
			try {
				tx.abort();
			} catch {}
			finish(e);
		});
	});
}
async function dumpAndClear(full = false) {
	const db = await idbOpen();
	try {
		return await withTx(db, "readwrite", async (store) => {
			const all = await new Promise((res, rej) => {
				const req = store.getAll();
				req.onsuccess = () => res(req.result);
				req.onerror = () => rej(req.error);
			});
			await new Promise((res, rej) => {
				const req = store.clear();
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});
			return full ? all : all.map((r) => r.payload);
		});
	} finally {
		db.close();
	}
}
//#endregion
//#region src/com/template/EntityUtils.ts
var optionize = (values) => (values ?? []).map((value) => value);
var locationField = (name, path, section = "relations", label = "Location", helper) => ({
	name,
	label,
	path,
	section,
	textarea: true,
	helper: helper ?? "String or JSON representation of the location"
});
var contactFields = (basePath) => [
	{
		name: "contacts.email",
		label: "Emails",
		path: `${basePath}.email`,
		section: "contacts",
		textarea: true,
		helper: "One email per line",
		multi: true
	},
	{
		name: "contacts.phone",
		label: "Phones",
		path: `${basePath}.phone`,
		section: "contacts",
		textarea: true,
		helper: "One phone per line",
		multi: true
	},
	{
		name: "contacts.links",
		label: "Links",
		path: `${basePath}.links`,
		section: "contacts",
		textarea: true,
		helper: "One link per line",
		multi: true
	}
];
var selectField = (name, label, path, options, section = "properties", helper) => ({
	name,
	label,
	path,
	section,
	helper,
	options: optionize(options)
});
var COLOR_OPTIONS = [
	"red",
	"green",
	"blue",
	"yellow",
	"orange",
	"purple",
	"brown",
	"gray",
	"black",
	"white"
];
var TASK_STATUS_OPTIONS = [
	"under_consideration",
	"pending",
	"in_progress",
	"completed",
	"failed",
	"delayed",
	"canceled",
	"other"
];
var AFFECT_OPTIONS = [
	"positive",
	"negative",
	"neutral"
];
var GENDER_OPTIONS = [
	"male",
	"female",
	"other"
];
var dateStructFields = (name, label, basePath, section = "schedule") => [
	{
		name: `${name}.date`,
		label: `${label} (Date)`,
		path: `${basePath}.date`,
		section,
		placeholder: "YYYY-MM-DD"
	},
	{
		name: `${name}.iso_date`,
		label: `${label} (ISO)`,
		path: `${basePath}.iso_date`,
		section,
		placeholder: "YYYY-MM-DDTHH:MM",
		helper: "ISO 8601 date-time"
	},
	{
		name: `${name}.timestamp`,
		label: `${label} (Timestamp)`,
		path: `${basePath}.timestamp`,
		section,
		numeric: true,
		type: "number",
		helper: "Unix milliseconds"
	}
];
var arrayField = (name, label, path, section = "relations", helper) => ({
	name,
	label,
	path,
	section,
	textarea: true,
	multi: true,
	helper
});
var jsonField = (name, label, path, section = "properties", helper) => ({
	name,
	label,
	path,
	section,
	json: true,
	textarea: true,
	helper
});
var stringField = (name, label, path, section = "properties", placeholder, helper) => ({
	name,
	label,
	path,
	section,
	placeholder,
	helper
});
var numberField = (name, label, path, section = "properties", helper) => ({
	name,
	label,
	path,
	section,
	numeric: true,
	type: "number",
	helper
});
var biographyFields = (basePath) => [
	{
		name: "biography.firstName",
		label: "First name",
		path: `${basePath}.firstName`,
		section: "main"
	},
	{
		name: "biography.lastName",
		label: "Last name",
		path: `${basePath}.lastName`,
		section: "main"
	},
	{
		name: "biography.middleName",
		label: "Middle name",
		path: `${basePath}.middleName`,
		section: "main"
	},
	{
		name: "biography.nickName",
		label: "Nick name",
		path: `${basePath}.nickName`,
		section: "main"
	},
	{
		name: "biography.birthdate",
		label: "Birth date",
		path: `${basePath}.birthdate`,
		section: "meta",
		placeholder: "YYYY-MM-DD or ISO date"
	},
	selectField("biography.gender", "Gender", `${basePath}.gender`, GENDER_OPTIONS, "meta")
];
selectField("variant", "Variant", "variant", COLOR_OPTIONS, "meta", "Visual accent colour");
numberField("price", "Price", "properties.price", "properties", "Price as number"), numberField("quantity", "Quantity", "properties.quantity"), stringField("begin_time", "Begin", "properties.begin_time", "schedule", "YYYY-MM-DD or ISO string"), stringField("end_time", "End", "properties.end_time", "schedule", "YYYY-MM-DD or ISO string"), locationField("location", "properties.location"), arrayField("services", "Services", "properties.services", "relations", "Service IDs, one per line"), arrayField("members", "Members", "properties.members", "relations", "Member IDs, one per line"), arrayField("actions", "Actions", "properties.actions", "relations", "Action IDs, one per line"), arrayField("bonuses", "Bonuses", "properties.bonuses", "properties", "Bonus IDs, one per line"), arrayField("rewards", "Rewards", "properties.rewards", "properties", "Reward IDs, one per line"), arrayField("feedbacks", "Feedbacks", "properties.feedbacks", "properties", "Feedback IDs, one per line"), arrayField("tasks", "Tasks", "properties.tasks", "relations", "Task IDs, one per line"), arrayField("persons", "Persons", "properties.persons", "relations", "Person IDs, one per line"), arrayField("events", "Events", "properties.events", "relations", "Event IDs, one per line"), arrayField("image", "Images", "properties.image", "properties", "Image URLs, one per line"), stringField("availability", "Availability", "properties.availability", "properties"), arrayField("availabilityTime", "Availability time", "properties.availabilityTime", "properties", "Time ranges, one per line"), arrayField("availabilityDays", "Availability days", "properties.availabilityDays", "properties", "Day names, one per line"), stringField("permissions", "Permissions", "properties.permissions", "properties"), stringField("purpose", "Purpose", "properties.purpose", "properties"), locationField("home", "properties.home"), arrayField("jobs", "Jobs", "properties.jobs", "relations", "Job IDs, one per line"), jsonField("coordinates", "Coordinates", "properties.coordinates", "properties", "JSON object with latitude and longitude");
var ENTITY_KIND_MAP = {
	task: [
		"job",
		"action",
		"other"
	],
	event: [
		"education",
		"lecture",
		"conference",
		"meeting",
		"seminar",
		"workshop",
		"presentation",
		"celebration",
		"opening",
		"other"
	],
	action: [
		"thinking",
		"imagination",
		"remembering",
		"speaking",
		"learning",
		"listening",
		"reading",
		"writing",
		"moving",
		"traveling",
		"speech",
		"physically",
		"crafting",
		"following",
		"other"
	],
	service: [
		"product",
		"consultation",
		"advice",
		"medical",
		"mentoring",
		"training",
		"item",
		"thing",
		"other"
	],
	item: [
		"currency",
		"book",
		"electronics",
		"furniture",
		"medicine",
		"tools",
		"software",
		"consumables",
		"other"
	],
	skill: [
		"skill",
		"knowledge",
		"ability",
		"trait",
		"experience",
		"other"
	],
	vendor: [
		"vendor",
		"company",
		"organization",
		"institution",
		"other"
	],
	place: [
		"placement",
		"place",
		"school",
		"university",
		"service",
		"clinic",
		"pharmacy",
		"hospital",
		"library",
		"market",
		"location",
		"shop",
		"restaurant",
		"cafe",
		"bar",
		"hotel",
		"other"
	],
	factor: [
		"weather",
		"health",
		"family",
		"relationships",
		"job",
		"traffic",
		"business",
		"economy",
		"politics",
		"news",
		"other"
	],
	person: [
		"specialist",
		"consultant",
		"coach",
		"mentor",
		"dear",
		"helper",
		"assistant",
		"friend",
		"family",
		"relative",
		"other"
	],
	bonus: []
};
var ENTITY_SCHEMAS = {
	task: {
		kind: ENTITY_KIND_MAP.task,
		fields: [
			selectField("status", "Status", "properties.status", TASK_STATUS_OPTIONS, "properties", "Task state"),
			...dateStructFields("begin_time", "Begin", "properties.begin_time"),
			...dateStructFields("end_time", "End", "properties.end_time"),
			locationField("location", "properties.location"),
			...contactFields("properties.contacts"),
			arrayField("members", "Members", "properties.members", "relations", "Entity IDs, one per line"),
			arrayField("events", "Events", "properties.events", "relations", "Event IDs, one per line")
		]
	},
	event: {
		kind: ENTITY_KIND_MAP.event,
		fields: [
			...dateStructFields("begin_time", "Begin", "properties.begin_time"),
			...dateStructFields("end_time", "End", "properties.end_time"),
			locationField("location", "properties.location"),
			...contactFields("properties.contacts")
		]
	},
	action: {
		kind: ENTITY_KIND_MAP.action,
		fields: [
			stringField("affect", "Affect", "properties.affect", "properties", "Describe impact or affect"),
			arrayField("steps", "Steps", "properties.steps", "properties", "Action steps, one per line"),
			arrayField("related", "Related", "properties.related", "relations", "Related entity IDs, one per line")
		]
	},
	service: {
		kind: ENTITY_KIND_MAP.service,
		fields: [
			locationField("location", "properties.location"),
			arrayField("persons", "Persons", "properties.persons", "relations", "Person IDs, one per line"),
			arrayField("specialization", "Specializations", "properties.specialization", "properties", "Specializations, one per line"),
			...contactFields("properties.contacts"),
			jsonField("prices", "Prices", "properties.prices", "properties", "JSON map: service => price")
		]
	},
	item: {
		kind: ENTITY_KIND_MAP.item,
		fields: [
			numberField("price", "Price", "properties.price", "properties", "Price as number"),
			numberField("quantity", "Quantity", "properties.quantity"),
			arrayField("availability", "Availability", "properties.availability", "properties", "Availability notes, one per line"),
			jsonField("attributes", "Attributes", "properties.attributes", "properties", "Additional item attributes in JSON")
		]
	},
	skill: {
		kind: ENTITY_KIND_MAP.skill,
		fields: [
			stringField("level", "Level", "properties.level", "properties", "e.g. beginner, intermediate"),
			arrayField("category", "Categories", "properties.category", "properties", "Categories, one per line"),
			arrayField("related", "Related", "properties.related", "relations", "Related skill or entity IDs")
		]
	},
	vendor: {
		kind: ENTITY_KIND_MAP.vendor,
		fields: [
			locationField("location", "properties.location"),
			...contactFields("properties.contacts"),
			arrayField("services", "Services", "properties.services", "relations", "Service IDs, one per line")
		]
	},
	place: {
		kind: ENTITY_KIND_MAP.place,
		fields: [
			locationField("location", "properties.location", "properties"),
			arrayField("services", "Services", "properties.services", "relations", "Related service IDs"),
			...contactFields("properties.contacts")
		]
	},
	factor: {
		kind: ENTITY_KIND_MAP.factor,
		fields: [
			selectField("affect", "Affect", "properties.affect", AFFECT_OPTIONS, "properties", "Overall impact"),
			arrayField("actions", "Actions", "properties.actions", "relations", "Action IDs, one per line"),
			locationField("location", "properties.location", "properties")
		]
	},
	person: {
		kind: ENTITY_KIND_MAP.person,
		fields: [
			locationField("home", "properties.home", "properties", "Home location"),
			arrayField("jobs", "Jobs", "properties.jobs", "properties", "Job locations, one per line"),
			...biographyFields("properties.biography"),
			arrayField("tasks", "Tasks", "properties.tasks", "relations", "Task IDs, one per line"),
			...contactFields("properties.contacts"),
			arrayField("services", "Services", "properties.services", "relations", "Service IDs, one per line"),
			jsonField("prices", "Prices", "properties.prices", "properties", "JSON map: service => price")
		]
	},
	bonus: {
		kind: ENTITY_KIND_MAP.bonus,
		fields: [
			stringField("code", "Code", "properties.code", "properties", "Readable bonus code"),
			arrayField("usableFor", "Usable for", "properties.usableFor", "relations", "Entity IDs, one per line"),
			arrayField("usableIn", "Usable in", "properties.usableIn", "relations", "Location IDs, one per line"),
			numberField("availability.count", "Availability count", "properties.availability.count", "properties"),
			arrayField("availability.time", "Availability time", "properties.availability.time", "properties", "Time ranges, one per line"),
			arrayField("availability.days", "Availability days", "properties.availability.days", "properties", "Day names, one per line"),
			jsonField("requirements", "Requirements", "properties.requirements", "properties", "JSON array of requirements"),
			jsonField("additionalProperties", "Additional properties", "properties.additionalProperties", "properties", "JSON map of extra properties"),
			jsonField("profits", "Profits", "properties.profits", "properties", "JSON map: target => profit value")
		]
	}
};
var detectEntityTypeByJSON = (unknownJSON) => {
	let mostSuitableType = "unknown";
	unknownJSON = typeof unknownJSON == "string" ? JSOX.parse(unknownJSON) : unknownJSON;
	if (typeof unknownJSON != "object") return mostSuitableType;
	if (unknownJSON.type && unknownJSON.properties && unknownJSON.kind) return unknownJSON.type;
	let types = /* @__PURE__ */ new Set();
	for (const type in ENTITY_KIND_MAP) if (ENTITY_KIND_MAP[type].includes(unknownJSON.kind)) types.add(type);
	const allEntities = [...Object.entries(ENTITY_SCHEMAS)]?.filter?.(([key, _]) => types.has(key));
	let timeTypes = /* @__PURE__ */ new Set();
	if (unknownJSON?.properties?.begin_time != null || unknownJSON?.properties?.end_time != null) allEntities?.forEach(([type, scheme]) => {
		if (scheme.properties?.begin_time != null && scheme.properties?.end_time != null) timeTypes.add(type);
	});
	let locationTypes = /* @__PURE__ */ new Set();
	if (unknownJSON?.properties?.location != null) allEntities?.forEach(([type, scheme]) => {
		if (scheme.properties?.location != null) locationTypes.add(type);
	});
	let pricesTypes = /* @__PURE__ */ new Set();
	if (unknownJSON?.properties?.prices != null) allEntities?.forEach(([type, scheme]) => {
		if (scheme.properties?.prices != null) pricesTypes.add(type);
	});
	let contactsTypes = /* @__PURE__ */ new Set();
	if (unknownJSON?.properties?.contacts != null) allEntities?.forEach(([type, scheme]) => {
		if (scheme.properties?.contacts != null) contactsTypes.add(type);
	});
	const countMap = /* @__PURE__ */ new Map();
	[
		...contactsTypes,
		...locationTypes,
		...pricesTypes,
		...timeTypes
	].forEach((type) => {
		countMap.set(type, (countMap.get(type) || 0) + 1);
	});
	mostSuitableType = countMap.size == 0 ? [...types]?.[0] : [...countMap.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];
	return mostSuitableType || "unknown";
};
//#endregion
//#region src/com/template/EntityId.ts
function parseDateCorrectly(str) {
	if (str == null) return null;
	if (str instanceof Date) return Number.isFinite(str.getTime()) ? str : null;
	if (typeof str === "number") {
		const d = new Date(str);
		return Number.isFinite(d.getTime()) ? d : null;
	}
	if (typeof str === "object") {
		const anyObj = str;
		if (anyObj.timestamp != null) return parseDateCorrectly(anyObj.timestamp);
		if (anyObj.iso_date != null) return parseDateCorrectly(anyObj.iso_date);
		if (anyObj.date != null) return parseDateCorrectly(anyObj.date);
	}
	if (typeof str === "string") {
		const trimmed = str.trim();
		if (!trimmed) return null;
		if (/^\d+$/.test(trimmed)) {
			const num = Number(trimmed);
			const d = new Date(num);
			if (Number.isFinite(d.getTime())) return d;
		}
		const d = new Date(trimmed);
		return Number.isFinite(d.getTime()) ? d : null;
	}
	return null;
}
var DEFAULT_MAX_LENGTH = 96;
var CODE_SUFFIX_PREFIX = "CODE";
var BASIC_ALLOWED_PATTERN = /^[a-z0-9\-_&#\+]+$/;
var CODE_ALLOWED_PATTERN = /^[a-z0-9\-_&#\+]+(?:_CODE[0-9A-Z]*)?$/;
var removeDiacritics = (value) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
var toStringOrNull = (value) => {
	if (value == null) return null;
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (typeof value === "number" || typeof value === "bigint") return String(value);
	return null;
};
var slugifySegment = (segment) => {
	if (!segment) return "";
	return removeDiacritics(segment).toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9\-_&#\+]+/g, "-").replace(/-{2,}/g, "-").replace(/_{2,}/g, "_").replace(/^-+|-+$/g, "").replace(/^_+|_+$/g, "");
};
var sanitizeCodeSuffix = (rawCode) => {
	const asString = toStringOrNull(rawCode);
	if (!asString) return "";
	const sanitized = removeDiacritics(asString).replace(/\s+/g, "").replace(/[^A-Za-z0-9\-_&#\+]+/g, "");
	if (!sanitized) return "";
	const upper = sanitized.toUpperCase();
	return upper.startsWith(CODE_SUFFIX_PREFIX) ? upper : `${CODE_SUFFIX_PREFIX}${upper}`;
};
var isCodeSuffixAllowed = (entity) => {
	if (!entity) return false;
	if (entity.type === "bonus") return true;
	const code = entity?.properties && entity.properties?.code;
	return typeof code === "string" && code.trim().length > 0;
};
var extractLocationName = (value) => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const address = value.address;
		if (typeof address === "string") return address;
		if (address && typeof address === "object") {
			const parts = [];
			[
				"street",
				"house",
				"flat",
				"room"
			].forEach((key) => {
				const part = toStringOrNull(address[key]);
				if (part) parts.push(part);
			});
			if (parts.length > 0) return parts.join("-");
		}
		const coordinate = value.coordinate;
		if (coordinate && typeof coordinate === "object") {
			const lat = toStringOrNull(coordinate.latitude);
			const lon = toStringOrNull(coordinate.longitude);
			if (lat && lon) return `${lat}-${lon}`;
		}
		const name = toStringOrNull(value.name);
		if (name) return name;
		const title = toStringOrNull(value.title);
		if (title) return title;
	}
	return null;
};
var pushSegment = (collector, value) => {
	if (value == null) return;
	if (Array.isArray(value)) {
		value.forEach((item) => pushSegment(collector, item));
		return;
	}
	const slug = slugifySegment(typeof value === "object" ? extractLocationName(value) : toStringOrNull(value));
	if (slug) collector.add(slug);
};
var prepareExistingSet = (existing) => {
	if (!existing) return void 0;
	if (existing instanceof Set) return existing;
	return new Set(existing);
};
var composeId = (base, codeSuffix, numericSuffix) => {
	const suffixPart = numericSuffix != null ? `-${numericSuffix}` : "";
	if (codeSuffix) {
		if (base) return `${base}_${codeSuffix}${suffixPart}`;
		return `${codeSuffix}${suffixPart}`;
	}
	return `${base}${suffixPart}`;
};
var clampBaseLength = (base, maxLength, reservedLength) => {
	if (!base) return base;
	if (base.length + reservedLength <= maxLength) return base;
	const available = Math.max(0, maxLength - reservedLength);
	if (available === 0) return "";
	return base.slice(0, available).replace(/[-_]+$/g, "");
};
var ensureUniqueId = (base, codeSuffix, existing, maxLength) => {
	const initial = composeId(base, codeSuffix);
	if (!existing || !existing.has(initial)) return initial;
	let attempt = 2;
	while (attempt < 1e4) {
		const candidate = composeId(base, codeSuffix, attempt);
		if (!existing.has(candidate)) return candidate;
		attempt += 1;
	}
	return initial;
};
var sanitizeExistingIdValue = (value, allowCodeSuffix, maxLength) => {
	if (!value) return "";
	let working = removeDiacritics(value);
	working = working.replace(/[\s]+/g, "-");
	let codeSuffix = "";
	if (allowCodeSuffix) {
		const match = working.match(/(_CODE[0-9A-Za-z]*)$/i);
		if (match) {
			codeSuffix = sanitizeCodeSuffix(match[0].slice(1));
			working = working.slice(0, match.index ?? 0);
		}
	}
	const base = slugifySegment(working);
	const sanitizedBase = base ? base : "";
	if (!sanitizedBase && !codeSuffix) return "";
	return composeId(clampBaseLength(sanitizedBase, maxLength, codeSuffix ? codeSuffix.length + (sanitizedBase ? 1 : 0) : 0), codeSuffix || void 0);
};
var isValidEntityId = (value, allowCodeSuffix = false) => {
	if (!value) return false;
	return allowCodeSuffix ? CODE_ALLOWED_PATTERN.test(value) : BASIC_ALLOWED_PATTERN.test(value);
};
var collectBaseSegments = (entity, options) => {
	const segments = /* @__PURE__ */ new Set();
	if (!entity) return [];
	options?.prefer?.forEach((candidate) => pushSegment(segments, candidate));
	if (entity.type === "person") {
		const biography = entity.properties?.biography ?? {};
		const nameParts = [
			toStringOrNull(biography?.firstName),
			toStringOrNull(biography?.middleName),
			toStringOrNull(biography?.lastName)
		].filter(Boolean);
		if (nameParts.length > 0) pushSegment(segments, nameParts.join("-"));
		pushSegment(segments, biography?.nickName);
		const jobs = entity.properties?.jobs;
		if (jobs) pushSegment(segments, Array.isArray(jobs) ? jobs[0] : jobs);
	}
	if (entity.type === "bonus") {
		const usableFor = entity.properties?.usableFor;
		const usableIn = entity.properties?.usableIn;
		if (usableFor) pushSegment(segments, Array.isArray(usableFor) ? usableFor[0] : usableFor);
		if (usableIn) pushSegment(segments, Array.isArray(usableIn) ? usableIn[0] : usableIn);
	}
	pushSegment(segments, entity.name);
	pushSegment(segments, entity.title);
	pushSegment(segments, entity.kind);
	pushSegment(segments, entity.type);
	if (segments.size === 0) pushSegment(segments, options?.fallback ?? entity.type ?? "entity");
	pushSegment(segments, entity.properties?.begin_time ? parseDateCorrectly?.(entity.properties?.begin_time)?.toLocaleString?.("en-GB", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	})?.trim()?.toLowerCase?.()?.replace?.(/\s+/g, "_")?.replace?.(/[\,\-\_\:\.\\\/]/g, "-")?.replace?.(/[\"\'\(\)\[\]]/g, "")?.replace?.(/\-\-/g, "_") : null);
	return Array.from(segments).filter((segment) => segment.length > 0);
};
var generateEntityId = (entity, options = {}) => {
	const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
	const codeSuffix = isCodeSuffixAllowed(entity) ? sanitizeCodeSuffix(entity.properties?.code) : "";
	const base = collectBaseSegments(entity, options).join("_");
	const clampedBase = clampBaseLength(base, maxLength, codeSuffix ? codeSuffix.length + (base ? 1 : 0) : 0);
	const existingSet = prepareExistingSet(options.existingIds);
	const candidate = ensureUniqueId(clampedBase, codeSuffix, existingSet, maxLength);
	if (options.mutateExistingIds && existingSet) existingSet.add(candidate);
	return candidate;
};
var fixEntityId = (entity, options = {
	mutate: true,
	rebuild: true
}) => {
	const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
	const allowCodeSuffix = isCodeSuffixAllowed(entity);
	const existingSet = prepareExistingSet(options.existingIds);
	const forceRebuild = options.rebuild === true;
	let sanitizedId = sanitizeExistingIdValue(toStringOrNull(entity?.id) ?? "", allowCodeSuffix, maxLength);
	if (forceRebuild || !sanitizedId || !isValidEntityId(sanitizedId, allowCodeSuffix)) sanitizedId = generateEntityId(entity, {
		...options,
		existingIds: existingSet
	});
	if (existingSet && existingSet.has(sanitizedId)) {
		const baseWithoutNumeric = sanitizedId.replace(/(?:-[0-9]+)?$/, "");
		sanitizedId = ensureUniqueId(allowCodeSuffix ? baseWithoutNumeric.replace(/_CODE[0-9A-Z]*$/i, "") : baseWithoutNumeric, allowCodeSuffix ? sanitizeCodeSuffix(entity.properties?.code) : "", existingSet, maxLength);
	}
	if (options.mutateExistingIds && existingSet) existingSet.add(sanitizedId);
	if (options.mutate !== false && entity) entity.id = sanitizedId;
	return sanitizedId;
};
//#endregion
//#region src/core/constants/data-paths.ts
/** OPFS path constants shared by FileSystem and timeline code — avoids FileSystem ↔ MakeTimeline import cycles. */
var TIMELINE_DIR = "/timeline/";
//#endregion
//#region src/core/storage/OPFSMod.ts
/**
* Recursive JSON transformation helper for OPFS directories.
*
* WHY: bulk migrations and cleanup tasks often need to walk an existing OPFS
* subtree, parse each JSON/JSOX file, transform the data, and write back only
* when the normalized output actually changed.
*/
/**
* @typedef {Object} OpfsModifyOptions
* @property {string} dirPath Относительный путь от корня OPFS (например, "data/configs")
* @property {(data:any, ctx:{path:string,name:string,fullPath:string}) => any|Promise<any>} transform
*           Функция-трансформация. Должна вернуть новый объект (или исходный, если без изменений).
*           Можно вернуть undefined, чтобы пропустить запись.
* @property {(name:string, fullPath:string) => boolean} [filter]
*           Доп. фильтр по имени/пути (true — обрабатывать).
* @property {number} [indent=2] Кол-во пробелов для JSOX.stringify
* @property {boolean} [dryRun=false] Если true — только показывает, что было бы изменено, без записи.
* @property {boolean} [prettyStable=true] Если true — сортирует ключи (стабильный вывод).
*/
/**
* Walk a directory tree inside OPFS, apply a transform to every JSON-like file,
* and optionally perform a dry run without writing changes.
*/
async function opfsModifyJson(options) {
	const { dirPath, transform, filter, indent = 2, dryRun = false, prettyStable = true } = options;
	assertOpfs();
	const root = await navigator.storage.getDirectory()?.catch?.(() => null);
	if (!root) return {
		processed: 0,
		changed: 0,
		errors: 0
	};
	const normDirPath = normalizePath(dirPath);
	const dir = await getDirByPath(root, normDirPath);
	if (!dir) return {
		processed: 0,
		changed: 0,
		errors: 0
	};
	let processed = 0;
	let changed = 0;
	let errors = 0;
	for await (const { handle, name, fullPath } of walk(dir, normDirPath)) {
		if (handle.kind !== "file" || !name.toLowerCase().endsWith(".json")) continue;
		if (filter && !filter(name, fullPath)) continue;
		try {
			const originalText = await (await handle.getFile()).text();
			let data;
			try {
				data = originalText.trim() === "" ? null : JSOX.parse(originalText);
			} catch (_) {
				try {
					data = originalText.trim() === "" ? null : JSON.parse(originalText);
				} catch (e) {
					console.warn(`JSON parse error: ${fullPath}`, e);
					errors++;
					continue;
				}
			}
			const result = await transform(data, {
				path: normDirPath,
				name,
				fullPath
			});
			if (typeof result === "undefined") {
				processed++;
				continue;
			}
			const newText = serializeJSON(result, {
				indent,
				prettyStable
			});
			if (normalizeEol(newText) === normalizeEol(originalText)) {
				processed++;
				continue;
			}
			if (dryRun) console.log(`[dry-run] Would update: ${fullPath}`);
			else {
				const writable = await handle.createWritable();
				await writable.truncate(0);
				await writable.write(newText);
				await writable.close();
				console.log(`Updated: ${fullPath}`);
			}
			processed++;
			changed++;
		} catch (e) {
			console.error(`Failed on ${fullPath}:`, e);
			errors++;
		}
	}
	return {
		processed,
		changed,
		errors
	};
}
function normalizePath(p) {
	if (!p || p === "/" || p === ".") return "";
	return p.split("/").filter(Boolean).join("/");
}
function assertOpfs() {
	if (!("storage" in navigator) || typeof navigator.storage.getDirectory !== "function") throw new Error("OPFS is not available in this browser/context. Need navigator.storage.getDirectory().");
}
async function getDirByPath(rootDirHandle, path) {
	if (!path || path === "/" || path === ".") return rootDirHandle;
	const parts = path.split("/").map((s) => s.trim()).filter(Boolean);
	let dir = rootDirHandle;
	for (const part of parts) {
		try {
			dir = await dir?.getDirectoryHandle?.(part, { create: false });
		} catch (e) {
			if (e?.name === "NotFoundError") return null;
			if (e?.name === "AbortError") return null;
			throw e;
		}
		if (!dir) return null;
	}
	return dir;
}
/** Async generator for recursively walking an OPFS directory tree. */
async function* walk(dirHandle, basePath = "") {
	for await (const [name, handle] of dirHandle.entries()) {
		const fullPath = basePath ? `${basePath}/${name}` : name;
		if (handle.kind === "directory") yield* walk(handle, fullPath);
		else yield {
			handle,
			name,
			fullPath
		};
	}
}
function serializeJSON(obj, { indent = 2, prettyStable = true } = {}) {
	return JSON.stringify(obj, prettyStable ? stableReplacer : void 0, indent) + "\n";
}
/** Stable key ordering for deterministic JSON output and smaller diffs. */
function stableReplacer(key, value) {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const out = {};
		for (const k of Object.keys(value).sort()) out[k] = value[k];
		return out;
	}
	return value;
}
function normalizeEol(s) {
	return s.replace(/\r\n/g, "\n");
}
//#endregion
//#region src/core/storage/FileSystem.ts
var isViteProd = Boolean({
	"BASE_URL": "./",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": false
}?.PROD);
var lureFsPromise = null;
var getLureFs = () => {
	if (!lureFsPromise) lureFsPromise = Promise.resolve().then(() => lure_exports).then((m) => ({
		getDirectoryHandle: m.getDirectoryHandle,
		getFileHandle: m.getFileHandle,
		decodeBase64ToBytes: m.decodeBase64ToBytes,
		stringToFile: m.stringToFile,
		parseDataUrl: m.parseDataUrl
	}));
	return lureFsPromise;
};
var notifyFsToast = async (kind, message) => {
	try {
		const mod = await import("./app5.js").then((n) => n.t);
		(kind === "success" ? mod.showSuccess : mod.showError)(message);
	} catch {
		try {
			if (typeof globalThis !== "undefined" && Notification?.permission === "granted") new Notification(message);
			else console[kind === "success" ? "log" : "warn"](message);
		} catch {
			console[kind === "success" ? "log" : "warn"](message);
		}
	}
};
/** Write every provided file into the target directory using the canonical smart-write helper. */
var writeFilesToDir = async (dir, files) => {
	const items = Array.from(files);
	for (const file of items) {
		dir = dir?.trim?.();
		dir = dir?.endsWith?.("/") ? dir : dir + "/";
		await writeFileSmart(null, dir, file);
	}
	return items.length;
};
var suitableDirsByEntityTypes = (entityTypes) => {
	return entityTypes?.map?.((entityType) => {
		return entityType == "timeline" || entityType == "task" ? "/timeline/" : `/data/${entityType}/`;
	});
};
/** Persist JSON-like entities using the repo's entity-id and directory conventions. */
var writeJSON = async (data, dir = null) => {
	if (!data) return;
	const writeOne = async (obj, index = 0) => {
		if (!obj) return;
		obj = parseJsonSafely(obj);
		if (!obj) return;
		const entityType = obj?.type ?? detectEntityTypeByJSON(obj) ?? "unknown";
		if (!dir) dir = suitableDirsByEntityTypes([entityType])?.[0];
		dir = dir?.trim?.();
		let fileName = (fixEntityId(obj) || obj?.name || `${Date.now()}`)?.toString?.()?.toLowerCase?.()?.replace?.(/\s+/g, "-")?.replace?.(/[^a-z0-9_\-+#&]/g, "-");
		fileName = fileName?.trim?.();
		fileName = fileName?.endsWith?.(".json") ? fileName : fileName + ".json";
		return writeFileSmart(null, `${dir}${fileName}`, new File([JSOX.stringify(obj)], fileName, { type: "application/json" }))?.catch?.(console.warn.bind(console));
	};
	let results = await (Array.isArray(data) ? Promise.all(data.map((item, index) => writeOne(item, index))) : writeOne(data, 0))?.catch?.(console.warn.bind(console));
	if (typeof document !== "undefined") document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
		detail: results,
		bubbles: true,
		composed: true,
		cancelable: true
	}));
	return results;
};
/** Persist markdown content into the requested path or a default docs/preferences location. */
var writeMarkDown = async (data, path = null) => {
	if (!data) return;
	path = path?.trim?.();
	let filename = (`${Date.now()}`?.toString?.()?.toLowerCase?.()?.replace?.(/\s+/g, "-")?.replace?.(/[^a-z0-9_\-+#&]/g, "-")?.trim?.() || `${Date.now()}`) + ".md";
	if (!path) path = "/docs/preferences/";
	else filename = path?.split?.("/")?.pop?.() || filename;
	filename = filename?.endsWith?.(".md") ? filename : filename + ".md";
	let results = await writeFileSmart(null, path, data instanceof File ? data : new File([data], filename, { type: "text/markdown" }))?.catch?.(console.warn.bind(console));
	if (typeof document !== "undefined") document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
		detail: results,
		bubbles: true,
		composed: true,
		cancelable: true
	}));
	return results;
};
/**
* Normalize an incoming shared item into the handler contract used by commit,
* analyze, and recognition pipelines.
*/
var handleDataByType = async (item, handler) => {
	if (typeof item === "string") {
		if (item?.startsWith?.("data:image/") && item?.includes?.(";base64,")) {
			const { parseDataUrl, stringToFile } = await getLureFs();
			return handler({
				url: item,
				file: await stringToFile(item, "clipboard-image", {
					mimeType: parseDataUrl(item)?.mimeType || "image/png",
					uriComponent: true
				})
			});
		} else if (canParseURL(item)) return handler({ url: item });
	} else if (item instanceof File || item instanceof Blob) return handler({ file: item });
};
var handleDataTransferFiles = async (files, handler) => {
	for (const file of files) handleDataByType(file, handler);
};
var parseJsonSafely = (text) => {
	if (!text) return null;
	if (typeof text != "string") return text;
	try {
		return JSOX.parse(text);
	} catch (_) {
		try {
			return JSON.parse(text);
		} catch (_) {
			console.warn("Failed to parse JSON", text);
			return text;
		}
	}
};
var postCommitAnalyze = async (payload, API_ENDPOINT = "/commit-analyze") => {
	const fd = new FormData();
	if (payload.text) fd.append("text", payload.text);
	if (payload.url) fd.append("url", payload.url);
	if (payload.file) fd.append("files", payload.file, payload.file?.name || "pasted");
	const resp = await fetch(API_ENDPOINT, {
		method: "POST",
		priority: "auto",
		keepalive: true,
		body: fd
	})?.catch?.(console.warn.bind(console));
	if (!resp) return [];
	const json = parseJsonSafely(await resp?.text?.()?.catch?.(console.warn.bind(console)) || "{}");
	if (!json) return [];
	return json?.results?.map?.((res) => res?.data)?.filter?.((data) => !!data?.trim?.());
};
var extractRecognizedData = (unknownData) => {
	try {
		unknownData = typeof unknownData == "string" ? JSON.parse(unknownData?.trim?.() || "[]") : unknownData;
	} catch (e) {}
	if (unknownData?.recognized_data) return extractRecognizedData(unknownData?.recognized_data);
	if (typeof unknownData == "string" && unknownData?.trim?.()) return unknownData?.trim?.();
	else if (Array.isArray(unknownData) && unknownData?.length) return unknownData?.map?.((item) => extractRecognizedData(item))?.filter?.((item) => item && typeof item === "string")?.join?.("\n") || "";
	return "";
};
new BroadcastChannel("rs-sw").addEventListener("message", (event) => {
	const payload = event?.data;
	if (!payload || payload?.type !== "commit-result" && payload?.type !== "commit-to-clipboard") return;
	if (payload?.type === "commit-result") flushQueueIntoOPFS?.()?.then?.(() => {
		notifyFsToast("success", "Data has been saved to the filesystem.");
	})?.catch?.((e) => {
		console.warn("Failed to save data to filesystem.", e, payload);
		notifyFsToast("error", "Failed to save data to filesystem.");
	});
	else if (payload?.type === "commit-to-clipboard") {
		const data = payload?.results?.map?.((result) => extractRecognizedData(result?.data?.recognized_data || result?.data))?.filter?.((result) => result && typeof result === "string")?.join?.("\n") || "";
		if (data?.trim?.()) navigator?.clipboard?.writeText?.(data)?.then?.(() => {
			notifyFsToast("success", "Data has been copied to clipboard.");
		})?.catch?.((e) => {
			console.warn("Failed to copy data to clipboard.", e, data);
			notifyFsToast("error", "Failed to copy data to clipboard. Data is not copied.");
		});
		else notifyFsToast("error", "Failed to copy data to clipboard. Data is empty.");
	}
});
var warnUnlessAbort = (e) => {
	if ((e && typeof e === "object" && "name" in e ? String(e.name) : "") === "AbortError") return;
	console.warn(e);
};
if (isViteProd && typeof navigator !== "undefined" && "storage" in navigator && typeof navigator.storage.getDirectory === "function") if (typeof requestIdleCallback === "function") requestIdleCallback?.(() => {
	flushQueueIntoOPFS();
});
else setTimeout(() => {
	flushQueueIntoOPFS();
}, 1e3);
async function flushQueueIntoOPFS() {
	const results = await dumpAndClear();
	return Promise.all(results.map((result) => {
		const { data, name, dataType, directory } = result;
		if (dataType === "json") {
			let jsonData = parseJsonSafely(data);
			if (!jsonData) return;
			return writeJSON(jsonData, directory?.trim?.());
		} else return writeMarkDown(data, directory?.trim?.() + name?.trim?.());
	}));
}
if (isViteProd) {
	try {
		opfsModifyJson({
			dirPath: "/data/",
			transform: (data) => {
				if (data && typeof data === "object") fixEntityId(data, { mutate: true });
				return data;
			}
		})?.catch?.(warnUnlessAbort);
	} catch (e) {
		warnUnlessAbort(e);
	}
	try {
		opfsModifyJson({
			dirPath: "/timeline/",
			transform: (data) => {
				if (data && typeof data === "object") fixEntityId(data, { mutate: true });
				return data;
			}
		})?.catch?.(warnUnlessAbort);
	} catch (e) {
		warnUnlessAbort(e);
	}
}
var writeTimelineTask = async (task) => {
	let fileName = task?.id || task?.name || task?.desc?.name || `${Date.now()}` || "timeline.json";
	fileName = fileName?.endsWith?.(".json") ? fileName : fileName + ".json";
	return writeFileSmart(null, `${TIMELINE_DIR}${fileName}`, new File([JSOX.stringify(task)], fileName, { type: "application/json" }))?.catch?.(console.error.bind(console));
};
//#endregion
//#region shared/fest/lure/extension/modules/ScrollBar.ts
makeRAFCycle();
try {
	CSS.registerProperty({
		name: "--percent-x",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--percent-y",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--scroll-coef",
		syntax: "<number>",
		inherits: true,
		initialValue: "1"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--determinant",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--scroll-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--content-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--clamped-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--thumb-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--max-offset",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--max-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
//#endregion
//#region shared/fest/lure/index.ts
var lure_exports = /* @__PURE__ */ __exportAll({
	$behavior: () => $behavior,
	$createElement: () => $createElement,
	$mapped: () => $mapped,
	$observeAttribute: () => $observeAttribute,
	$observeInput: () => $observeInput,
	$virtual: () => $virtual,
	C: () => C,
	CSSCalc: () => CSSCalc,
	ClosePriority: () => ClosePriority,
	E: () => E,
	GLitElement: () => GLitElement,
	H: () => H,
	LongPressHandler: () => LongPressHandler,
	M: () => M,
	Q: () => Q,
	Qp: () => Qp,
	addProxiedEvent: () => addProxiedEvent,
	addToBank: () => addToBank,
	alives: () => alives,
	applyNormalizedInlineStyle: () => applyNormalizedInlineStyle,
	attrLink: () => attrLink,
	attrRef: () => attrRef,
	bindCtrl: () => bindCtrl,
	bindDraggable: () => bindDraggable,
	bindHandler: () => bindHandler,
	bindMenuItemClickHandler: () => bindMenuItemClickHandler,
	bindWhileConnected: () => bindWhileConnected,
	bindWith: () => bindWith,
	blobToBytes: () => blobToBytes,
	checkedLink: () => checkedLink,
	checkedRef: () => checkedRef,
	clampCell: () => clampCell,
	clickPrevention: () => clickPrevention,
	colorScheme: () => colorScheme,
	copyFromOneHandlerToAnother: () => copyFromOneHandlerToAnother,
	ctxMenuTrigger: () => ctxMenuTrigger,
	currentHandleMap: () => currentHandleMap,
	decodeBase64ToBytes: () => decodeBase64ToBytes,
	defaultLogger: () => defaultLogger,
	defineElement: () => defineElement,
	detectTypeByRelPath: () => detectTypeByRelPath,
	directHandlers: () => directHandlers,
	directoryCacheMap: () => directoryCacheMap,
	downloadFile: () => downloadFile,
	dropFile: () => dropFile,
	dynamicBgColors: () => dynamicBgColors,
	dynamicNativeFrame: () => dynamicNativeFrame,
	dynamicTheme: () => dynamicTheme,
	elMap: () => elMap$1,
	electronAPI: () => electronAPI,
	ensureWorker: () => ensureWorker,
	generalFileImportDesc: () => generalFileImportDesc,
	getCachedComponent: () => getCachedComponent,
	getDir: () => getDir,
	getDirectoryHandle: () => getDirectoryHandle,
	getFileHandle: () => getFileHandle,
	getGlobalContextMenu: () => getGlobalContextMenu,
	getHandler: () => getHandler,
	getMimeTypeByFilename: () => getMimeTypeByFilename,
	ghostImage: () => ghostImage,
	grabForDrag: () => grabForDrag,
	handleByPointer: () => handleByPointer,
	handleError: () => handleError,
	handleIncomingEntries: () => handleIncomingEntries,
	hasFileExtension: () => hasFileExtension,
	historyState: () => historyState,
	html: () => html,
	htmlBuilder: () => htmlBuilder,
	initGlobalClipboard: () => initGlobalClipboard,
	isBase64Like: () => isBase64Like,
	isEffectivelyEmptyStyleText: () => isEffectivelyEmptyStyleText,
	isNotExtended: () => isNotExtended,
	itemClickHandle: () => itemClickHandle,
	lazyAddEventListener: () => lazyAddEventListener,
	lazyLoadComponent: () => lazyLoadComponent,
	loadCachedStyles: () => loadCachedStyles,
	localStorageLink: () => localStorageLink,
	localStorageLinkMap: () => localStorageLinkMap,
	localStorageRef: () => localStorageRef,
	makeInterruptTrigger: () => makeInterruptTrigger,
	makeMenuHandler: () => makeMenuHandler,
	makeRef: () => makeRef,
	makeShiftTrigger: () => makeShiftTrigger,
	mappedRoots: () => mappedRoots,
	matchMediaLink: () => matchMediaLink,
	matchMediaRef: () => matchMediaRef,
	maybeStartThemeEngine: () => maybeStartThemeEngine,
	mountAsRoot: () => mountAsRoot,
	navigate: () => navigate,
	normalizeDataAsset: () => normalizeDataAsset,
	normalizePath: () => normalizePath$1,
	openDirectory: () => openDirectory,
	orientLink: () => orientLink,
	orientRef: () => orientRef,
	parseDataUrl: () => parseDataUrl,
	pickBgColor: () => pickBgColor,
	pickFromCenter: () => pickFromCenter,
	post: () => post,
	property: () => property,
	provide: () => provide,
	pruneEmptyStyleAttribute: () => pruneEmptyStyleAttribute,
	readFile: () => readFile,
	reflectControllers: () => reflectControllers,
	registerCloseable: () => registerCloseable,
	registerContextMenu: () => registerContextMenu,
	registerModal: () => registerModal,
	remove: () => remove,
	removeFile: () => removeFile,
	removeFromBank: () => removeFromBank,
	resolvePath: () => resolvePath,
	resolveRootHandle: () => resolveRootHandle,
	scrollLink: () => scrollLink,
	scrollRef: () => scrollRef,
	sizeLink: () => sizeLink,
	sizeRef: () => sizeRef,
	stringToBlob: () => stringToBlob,
	stringToBlobOrFile: () => stringToBlobOrFile,
	stringToFile: () => stringToFile,
	unregisterCloseable: () => unregisterCloseable,
	uploadFile: () => uploadFile,
	valueAsNumberLink: () => valueAsNumberLink,
	valueAsNumberRef: () => valueAsNumberRef,
	valueLink: () => valueLink,
	valueRef: () => valueRef,
	visibleLink: () => visibleLink,
	visibleRef: () => visibleRef,
	withInsetWithPointer: () => withInsetWithPointer,
	withProperties: () => withProperties,
	writeFile: () => writeFile
});
//#endregion
export { LongPressHandler as A, navigate as B, provide as C, writeFile as D, uploadFile as E, GLitElement as F, bindWith as G, E as H, defineElement as I, property as L, bindDraggable as M, makeShiftTrigger as N, initGlobalClipboard as O, lazyAddEventListener as P, orientRef as R, openDirectory as S, remove as T, M as U, H as V, Q as W, getDirectoryHandle as _, writeTimelineTask as a, handleIncomingEntries as b, getCachedComponent as c, isBase64Like as d, normalizeDataAsset as f, getDir as g, downloadFile as h, writeFilesToDir as i, clampCell as j, ctxMenuTrigger as k, dynamicTheme as l, pointerAnchorRef as m, handleDataTransferFiles as n, fixEntityId as o, parseDataUrl as p, postCommitAnalyze as r, generateEntityId as s, lure_exports as t, decodeBase64ToBytes as u, getFileHandle as v, readFile as w, mountAsRoot as x, getMimeTypeByFilename as y, registerModal as z };
