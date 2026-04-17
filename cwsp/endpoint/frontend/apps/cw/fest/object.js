//#region shared/fest/core/runtime/dom-globals-polyfill.ts
/**
* Chrome MV3 service workers (and some workers) do not expose DOM interface
* constructors on `globalThis`. Shared app bundles that include custom elements
* and `fest/dom` still load in the SW, so `class X extends HTMLElement` and
* `instanceof HTMLElement` would otherwise throw ReferenceError during evaluation.
*
* Browser / extension pages already have these globals; this is a no-op there.
*/
function installDomConstructorPolyfills() {
	const g = globalThis;
	if (typeof g.HTMLElement === "function") return;
	const stub = class {};
	const ensure = (name) => {
		if (typeof g[name] !== "function") g[name] = stub;
	};
	ensure("EventTarget");
	ensure("Node");
	ensure("Element");
	ensure("HTMLElement");
	ensure("SVGElement");
	ensure("Text");
	ensure("Comment");
	ensure("DocumentFragment");
	ensure("ShadowRoot");
	ensure("HTMLDocument");
	ensure("Document");
	ensure("HTMLBodyElement");
	ensure("HTMLHeadElement");
	ensure("HTMLCanvasElement");
	ensure("HTMLInputElement");
	ensure("HTMLLinkElement");
	ensure("HTMLStyleElement");
	ensure("HTMLPreElement");
	ensure("HTMLDivElement");
	ensure("CSSStyleRule");
	ensure("CSSLayerBlockRule");
}
//#endregion
//#region shared/fest/core/utils/PromiseTry.ts
if (typeof Promise !== "undefined" && typeof Promise.try !== "function") Promise.try = function(callbackOrValue, ...args) {
	try {
		if (typeof callbackOrValue === "function") return Promise.resolve(callbackOrValue(...args));
		return Promise.resolve(callbackOrValue);
	} catch (error) {
		return Promise.reject(error);
	}
};
//#endregion
//#region shared/fest/core/utils/PromiseUtils.ts
/**
* Promise utilities for advanced async operations
*/
/**
* Create a promised value that resolves when set
*/
function createDeferred() {
	let resolve;
	let reject;
	let isResolved = false;
	let isRejected = false;
	return {
		promise: new Promise((res, rej) => {
			resolve = (value) => {
				if (!isResolved && !isRejected) {
					isResolved = true;
					res(value);
				}
			};
			reject = (error) => {
				if (!isResolved && !isRejected) {
					isRejected = true;
					rej(error);
				}
			};
		}),
		resolve,
		reject,
		get isResolved() {
			return isResolved;
		},
		get isRejected() {
			return isRejected;
		}
	};
}
//#endregion
//#region shared/fest/core/utils/ChannelUtils.ts
/**
* Channel utilities for managing communication channels
*/
/**
* Channel registry for managing multiple channels
*/
var ChannelRegistry = class {
	constructor() {
		this.channels = /* @__PURE__ */ new Map();
		this.listeners = /* @__PURE__ */ new Map();
	}
	/**
	* Register a channel
	*/
	register(name, channel) {
		this.channels.set(name, channel);
		const listeners = this.listeners.get(name);
		if (listeners) for (const listener of listeners) try {
			listener(channel);
		} catch (error) {
			console.error(`[ChannelRegistry] Listener error for ${name}:`, error);
		}
		return channel;
	}
	/**
	* Get a registered channel
	*/
	get(name) {
		return this.channels.get(name);
	}
	/**
	* Check if a channel is registered
	*/
	has(name) {
		return this.channels.has(name);
	}
	/**
	* Unregister a channel
	*/
	unregister(name) {
		const existed = this.channels.delete(name);
		if (existed) {
			const listeners = this.listeners.get(name);
			if (listeners) for (const listener of listeners) try {
				listener(null);
			} catch (error) {
				console.error(`[ChannelRegistry] Unregister listener error for ${name}:`, error);
			}
		}
		return existed;
	}
	/**
	* Listen for channel registration/unregistration
	*/
	onChannelChange(name, listener) {
		if (!this.listeners.has(name)) this.listeners.set(name, /* @__PURE__ */ new Set());
		const listeners = this.listeners.get(name);
		listeners.add(listener);
		if (this.channels.has(name)) try {
			listener(this.channels.get(name));
		} catch (error) {
			console.error(`[ChannelRegistry] Initial listener error for ${name}:`, error);
		}
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0) this.listeners.delete(name);
		};
	}
	/**
	* Get all registered channel names
	*/
	getChannelNames() {
		return Array.from(this.channels.keys());
	}
	/**
	* Clear all channels and listeners
	*/
	clear() {
		this.channels.clear();
		this.listeners.clear();
	}
};
/**
* Singleton channel registry instance
*/
var globalChannelRegistry = new ChannelRegistry();
/**
* Channel health monitoring
*/
var ChannelHealthMonitor = class {
	constructor() {
		this.healthChecks = /* @__PURE__ */ new Map();
		this.intervals = /* @__PURE__ */ new Map();
		this.healthStatus = /* @__PURE__ */ new Map();
	}
	/**
	* Register a health check for a channel
	*/
	registerHealthCheck(channelName, healthCheck, intervalMs = 3e4) {
		this.healthChecks.set(channelName, healthCheck);
		const existingInterval = this.intervals.get(channelName);
		if (existingInterval) clearInterval(existingInterval);
		const interval = setInterval(async () => {
			try {
				const isHealthy = await healthCheck();
				this.healthStatus.set(channelName, isHealthy);
				if (!isHealthy) console.warn(`[ChannelHealth] Channel '${channelName}' is unhealthy`);
			} catch (error) {
				console.error(`[ChannelHealth] Health check failed for '${channelName}':`, error);
				this.healthStatus.set(channelName, false);
			}
		}, intervalMs);
		this.intervals.set(channelName, interval);
		healthCheck().then((isHealthy) => {
			this.healthStatus.set(channelName, isHealthy);
		}).catch(() => {
			this.healthStatus.set(channelName, false);
		});
	}
	/**
	* Get health status of a channel
	*/
	isHealthy(channelName) {
		return this.healthStatus.get(channelName) ?? false;
	}
	/**
	* Get all health statuses
	*/
	getAllHealthStatuses() {
		const result = {};
		for (const [name, status] of this.healthStatus) result[name] = status;
		return result;
	}
	/**
	* Stop monitoring a channel
	*/
	stopMonitoring(channelName) {
		const interval = this.intervals.get(channelName);
		if (interval) {
			clearInterval(interval);
			this.intervals.delete(channelName);
		}
		this.healthChecks.delete(channelName);
		this.healthStatus.delete(channelName);
	}
	/**
	* Stop all monitoring
	*/
	stopAllMonitoring() {
		for (const interval of this.intervals.values()) clearInterval(interval);
		this.intervals.clear();
		this.healthChecks.clear();
		this.healthStatus.clear();
	}
};
/**
* Singleton health monitor instance
*/
var globalChannelHealthMonitor = new ChannelHealthMonitor();
//#endregion
//#region shared/fest/core/utils/Upsert.ts
WeakMap.prototype.getOrInsert ??= function(key, defaultValue) {
	if (!this.has(key)) this.set(key, defaultValue);
	return this.get(key);
};
WeakMap.prototype.getOrInsertComputed ??= function(key, callbackFunction) {
	if (!this.has(key)) this.set(key, callbackFunction(key));
	return this.get(key);
};
Map.prototype.getOrInsert ??= function(key, defaultValue) {
	if (!this.has(key)) this.set(key, defaultValue);
	return this.get(key);
};
Map.prototype.getOrInsertComputed ??= function(key, callbackFunction) {
	if (!this.has(key)) this.set(key, callbackFunction(key));
	return this.get(key);
};
//#endregion
//#region shared/fest/core/utils/Primitive.ts
var $fxy = Symbol.for("@fix");
var isObservable$1 = (observable) => {
	return Array.isArray(observable) || observable instanceof Set || observable instanceof Map;
};
/**
* Check if a value is a primitive type (null, string, number, boolean, bigint, or undefined).
* @param obj - The value to check
* @returns True if the value is a primitive type, false otherwise
*/
var isPrimitive = (obj) => {
	return typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean" || typeof obj == "bigint" || typeof obj == "undefined" || obj == null;
};
var tryParseByHint = (value, hint) => {
	if (!isPrimitive(value)) return null;
	if (hint == "number") return Number(value) || 0;
	if (hint == "string") return String(value) || "";
	if (hint == "boolean") return !!value;
	return value;
};
var hasProperty = (v, prop = "value") => {
	return (typeof v == "object" || typeof v == "function") && v != null && (prop in v || v?.[prop] != null);
};
var hasValue = (v) => {
	return hasProperty(v, "value");
};
var $getValue = ($objOrPlain) => {
	if (isPrimitive($objOrPlain)) return $objOrPlain;
	return hasValue($objOrPlain) ? $objOrPlain?.value : $objOrPlain;
};
var unwrap$1 = (obj, fallback) => {
	return obj?.[$fxy] ?? (obj != null ? obj : fallback) ?? fallback;
};
var deref$1 = (obj) => {
	if (obj != null && (typeof obj == "object" || typeof obj == "function") && (obj instanceof WeakRef || typeof obj?.deref == "function")) return deref$1(obj?.deref?.());
	return obj;
};
var fixFx = (obj) => {
	if (typeof obj == "function" || obj == null) return obj;
	const fx = function() {};
	fx[$fxy] = obj;
	return fx;
};
var $set = (rv, key, val) => {
	rv = deref$1(rv);
	if (rv != null && (typeof rv == "object" || typeof rv == "function")) return rv[key] = $getValue(val = deref$1(val));
	return rv;
};
var getRandomValues = (array) => {
	return crypto?.getRandomValues ? crypto?.getRandomValues?.(array) : (() => {
		const values = new Uint8Array(array.length);
		for (let i = 0; i < array.length; i++) values[i] = Math.floor(Math.random() * 256);
		return values;
	})();
};
var UUIDv4 = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ getRandomValues?.(new Uint8Array(1))?.[0] & 15 >> +c / 4).toString(16));
var camelToKebab = (str) => {
	if (!str) return str;
	return str?.replace?.(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};
var kebabToCamel = (str) => {
	if (!str) return str;
	return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase());
};
var isValueUnit = (val) => typeof CSSStyleValue !== "undefined" && val instanceof CSSStyleValue;
var isVal = (v) => v != null && (typeof v == "boolean" ? v !== false : true) && typeof v != "object" && typeof v != "function";
var normalizePrimitive = (val) => {
	return typeof val == "boolean" ? val ? "" : null : typeof val == "number" ? String(val) : val;
};
var $triggerLock$1 = Symbol.for("@trigger-lock");
var $avoidTrigger = (ref, cb, $prop = "value") => {
	if (hasProperty(ref, $prop)) ref[$triggerLock$1] = true;
	let result;
	try {
		result = cb?.();
	} finally {
		if (hasProperty(ref, $prop)) delete ref[$triggerLock$1];
	}
	return result;
};
var tryStringAsNumber = (val) => {
	if (typeof val != "string") return null;
	const matches = [...val?.matchAll?.(/^\d+(\.\d+)?$/g)];
	if (matches?.length != 1) return null;
	const triedToParse = parseFloat(matches[0][0]);
	if (!Number.isNaN(triedToParse) && Number.isFinite(triedToParse)) return triedToParse;
	return null;
};
var INTEGER_REGEXP = /^\d+$/g;
var tryStringAsInteger = (val) => {
	if (typeof val != "string") return null;
	val = val?.trim?.();
	if (val == "" || val == null) return null;
	const matches = [...val?.matchAll?.(INTEGER_REGEXP)];
	if (matches?.length != 1) return null;
	const triedToParse = parseInt(matches[0][0]);
	if (!Number.isNaN(triedToParse) && Number.isInteger(triedToParse)) return triedToParse;
	return null;
};
var canBeInteger = (value) => {
	if (typeof value == "string") return tryStringAsInteger(value) != null;
	else return typeof value == "number" && Number.isInteger(value) && value >= 0;
};
var isArrayOrIterable = (obj) => Array.isArray(obj) || obj != null && typeof obj == "object" && typeof obj[Symbol.iterator] == "function";
var handleListeners = (root, fn, handlers) => {
	root = root instanceof WeakRef ? root.deref() : root;
	const usubs = [...Object.entries(handlers)]?.map?.(([name, cb]) => root?.[fn]?.call?.(root, name, cb));
	return () => {
		usubs?.forEach?.((unsub) => unsub?.());
	};
};
var isRef = (ref) => {
	return ref instanceof WeakRef || typeof ref?.deref == "function";
};
var unref = (ref) => {
	return isRef(ref) ? deref$1(ref) : ref;
};
var toRef = (ref) => {
	return ref != null ? isRef(ref) ? ref : typeof ref == "function" || typeof ref == "object" ? new WeakRef(ref) : ref : ref;
};
var isValueRef = (exists) => {
	return (typeof exists == "object" || typeof exists == "function") && (exists?.value != null || exists != null && "value" in exists);
};
var isObject = (exists) => {
	return exists != null && (typeof exists == "object" || typeof exists == "function");
};
/**
* Get the value from a value reference or return the value itself.
* @param val - The value or value reference to extract from
* @returns The extracted value
*/
var getValue = (val) => {
	return hasValue(val) ? val?.value : val;
};
var potentiallyAsync = (promise, cb) => {
	if (promise instanceof Promise || typeof promise?.then == "function") return promise?.then?.(cb);
	else return cb?.(promise);
	return promise;
};
var potentiallyAsyncMap = (promise, cb) => {
	if (promise instanceof Promise || typeof promise?.then == "function") return promise?.then?.(cb);
	else return cb?.(promise);
	return promise;
};
var makeTriggerLess = function(self) {
	return (cb) => {
		self[$triggerLock$1] = true;
		let result;
		try {
			result = cb?.();
		} finally {
			self[$triggerLock$1] = false;
		}
		return result;
	};
};
var unwrapArray = (arr) => {
	if (Array.isArray(arr)) return arr?.flatMap?.((el) => {
		if (Array.isArray(el)) return unwrapArray(el);
		return el;
	});
	else return arr;
};
var isNotComplexArray = (arr) => {
	return unwrapArray(arr)?.every?.(isCanJustReturn);
};
var isCanJustReturn = (obj) => {
	return isPrimitive(obj) || typeof SharedArrayBuffer == "function" && obj instanceof SharedArrayBuffer || isTypedArray(obj) || Array.isArray(obj) && isNotComplexArray(obj);
};
var isTypedArray = (value) => {
	return ArrayBuffer.isView(value) && !(value instanceof DataView);
};
var isCanTransfer = (obj) => {
	return isPrimitive(obj) || typeof ArrayBuffer == "function" && obj instanceof ArrayBuffer || typeof MessagePort == "function" && obj instanceof MessagePort || typeof ReadableStream == "function" && obj instanceof ReadableStream || typeof WritableStream == "function" && obj instanceof WritableStream || typeof TransformStream == "function" && obj instanceof TransformStream || typeof ImageBitmap == "function" && obj instanceof ImageBitmap || typeof VideoFrame == "function" && obj instanceof VideoFrame || typeof OffscreenCanvas == "function" && obj instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && obj instanceof RTCDataChannel || typeof AudioData == "function" && obj instanceof AudioData || typeof WebTransportReceiveStream == "function" && obj instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && obj instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && obj instanceof WebTransportReceiveStream;
};
var defaultByType = (a) => {
	switch (typeof a) {
		case "number": return 0;
		case "string": return "";
		case "boolean": return false;
		case "object": return null;
		case "function": return null;
		case "symbol": return null;
		case "bigint": return 0n;
	}
};
//#endregion
//#region shared/fest/core/utils/Object.ts
var isIterable = (obj) => typeof obj?.[Symbol.iterator] == "function";
var isKeyType = (prop) => [
	"symbol",
	"string",
	"number"
].indexOf(typeof prop) >= 0;
var removeExtra = (target, value, name = null) => {
	const exists = name != null && (typeof target == "object" || typeof target == "function") ? target?.[name] ?? target : target;
	let entries = [];
	if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) entries = (exists instanceof Set || exists instanceof WeakSet ? value?.values?.() : value?.entries?.()) || (Array.isArray(value) || isIterable(value) ? value : []);
	else if (typeof value == "object" || typeof value == "function") entries = exists instanceof Set || exists instanceof WeakSet ? Object.values(value) : Object.entries(value);
	let exEntries = [];
	if (Array.isArray(exists)) exEntries = exists.entries();
	else if (exists instanceof Map || exists instanceof WeakMap) exEntries = exists?.entries?.();
	else if (exists instanceof Set || exists instanceof WeakSet) exEntries = exists?.values?.();
	else if (typeof exists == "object" || typeof exists == "function") exEntries = Object.entries(exists);
	const keys = new Set(Array.from(entries).map((e) => e?.[0]));
	const exe = new Set(Array.from(exEntries).map((e) => e?.[0]));
	const exclude = keys?.difference?.(exe);
	if (Array.isArray(exists)) {
		const nw = exists.filter((_, I) => !exclude.has(I));
		exists.splice(0, exists.length);
		exists.push(...nw);
	} else if (exists instanceof Map || exists instanceof Set || exists instanceof WeakMap || exists instanceof WeakSet) for (const k of exclude) exists.delete(k);
	else if (typeof exists == "function" || typeof exists == "object") for (const k of exclude) delete exists[k];
	return exists;
};
var objectAssign = (target, value, name = null, removeNotExists = true, mergeKey = "id") => {
	const exists = name != null && (typeof target == "object" || typeof target == "function") ? target?.[name] ?? target : target;
	let entries = null;
	if (removeNotExists) removeExtra(exists, value);
	if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) entries = (exists instanceof Set || exists instanceof WeakSet ? value?.values?.() : value?.entries?.()) || (Array.isArray(value) || isIterable(value) ? value : []);
	else if (typeof value == "object" || typeof value == "function") entries = exists instanceof Set || exists instanceof WeakSet ? Object.values(value) : Object.entries(value);
	if (exists && entries && (typeof entries == "object" || typeof entries == "function")) {
		if (exists instanceof Map || exists instanceof WeakMap) {
			for (const E of entries) exists.set(...E);
			return exists;
		}
		if (exists instanceof Set || exists instanceof WeakSet) {
			for (const E of entries) {
				const mergeObj = E?.[mergeKey] ? Array.from(exists?.values?.() || []).find((I) => !isNotEqual?.(I?.[mergeKey], E?.[mergeKey])) : null;
				if (mergeObj != null) objectAssign(mergeObj, E, null, removeNotExists, mergeKey);
				else exists.add(E);
			}
			return exists;
		}
		if (typeof exists == "object" || typeof exists == "function") {
			if (Array.isArray(exists) || isIterable(exists)) {
				let I = 0;
				for (const E of entries) if (I < exists.length) exists[I++] = E?.[1];
				else exists?.push?.(E?.[1]);
				return exists;
			}
			return Object.assign(exists, Object.fromEntries([...entries || []].filter((K) => typeof K != "symbol")));
		}
	}
	if (name != null) {
		Reflect.set(target, name, value);
		return target;
	} else if (typeof value == "object" || typeof value == "function") return Object.assign(target, value);
	return value;
};
var bindFx = (target, fx) => {
	return boundCtx.getOrInsert(target, /* @__PURE__ */ new WeakMap()).getOrInsert(fx, fx?.bind?.(target));
};
var bindCtx = (target, fx) => (typeof fx == "function" ? bindFx(target, fx) : fx) ?? fx;
var callByProp = (unwrap, prop, cb, ctx) => {
	if (prop == Symbol.iterator) return callByAllProp(unwrap, cb, ctx);
	if (prop == null || typeof prop == "symbol" || typeof prop == "object" || typeof prop == "function") return;
	const callIfNotNull = (v, ...args) => {
		if (v != null) return cb?.(v, ...args);
	};
	if (unwrap instanceof Map || unwrap instanceof WeakMap) {
		if (unwrap.has(prop)) return callIfNotNull?.(unwrap.get(prop), prop, null, "@set");
	} else if (unwrap instanceof Set || unwrap instanceof WeakSet) {
		if (unwrap.has(prop)) return callIfNotNull?.(prop, prop, null, "@add");
	} else if (Array.isArray(unwrap) && typeof prop == "string" && [...prop?.matchAll?.(/^\d+$/g)]?.length == 1 && Number.isInteger(typeof prop == "string" ? parseInt(prop) : prop)) {
		const index = typeof prop == "string" ? parseInt(prop) : prop;
		return callIfNotNull?.(unwrap?.[index], index, null, "@add");
	} else if (typeof unwrap == "function" || typeof unwrap == "object") return callIfNotNull?.(unwrap?.[prop], prop, null, "@set");
};
var callByAllProp = (unwrap, cb, ctx) => {
	if (unwrap == null) return;
	let keys = [];
	if (unwrap instanceof Set || unwrap instanceof Map || typeof unwrap?.keys == "function") return [...unwrap?.keys?.() || keys]?.forEach?.((prop) => callByProp(unwrap, prop, cb, ctx));
	if (Array.isArray(unwrap) || isIterable(unwrap)) return [...unwrap]?.forEach?.((v, I) => callByProp(unwrap, I, cb, ctx));
	if (typeof unwrap == "object" || typeof unwrap == "function") return [...Object.keys(unwrap) || keys]?.forEach?.((prop) => callByProp(unwrap, prop, cb, ctx));
};
var isNotEqual = (a, b) => {
	if (a == null && b == null) return false;
	if (a == null || b == null) return true;
	if (typeof a == "boolean" && typeof b == "boolean") return a != b;
	if (typeof a == "number" && typeof b == "number") return !(a == b || Math.abs(a - b) < 1e-9);
	if (typeof a == "string" && typeof b == "string") return a != "" && b != "" && a != b || a !== b;
	if (typeof a != typeof b) return a !== b;
	return a && b && a != b || a !== b;
};
var boundCtx = /* @__PURE__ */ new WeakMap();
var isArrayInvalidKey = (key, src) => {
	const invalidForArray = key == null || key < 0 || typeof key != "number" || key == Symbol.iterator || (src != null ? key >= (src?.length || 0) : false);
	return src != null ? Array.isArray(src) && invalidForArray : false;
};
var deepOperateAndClone = (obj, operation, $prev) => {
	if (Array.isArray(obj)) {
		if (obj.every(isCanJustReturn)) return obj.map(operation);
		return obj.map((value, index) => deepOperateAndClone(value, operation, [obj, index]));
	}
	if (obj instanceof Map) {
		const entries = Array.from(obj.entries());
		if (entries.map(([key, value]) => value).every(isCanJustReturn)) return new Map(entries.map(([key, value]) => [key, operation(value, key, obj)]));
		return new Map(entries.map(([key, value]) => [key, deepOperateAndClone(value, operation, [obj, key])]));
	}
	if (obj instanceof Set) {
		const entries = Array.from(obj.entries());
		const values = entries.map(([key, value]) => value);
		if (entries.every(isCanJustReturn)) return new Set(values.map(operation));
		return new Set(values.map((value) => deepOperateAndClone(value, operation, [obj, value])));
	}
	if (typeof obj == "object" && obj?.constructor == Object && Object.prototype.toString.call(obj) == "[object Object]") {
		const entries = Array.from(Object.entries(obj));
		if (entries.map(([key, value]) => value).every(isCanJustReturn)) return Object.fromEntries(entries.map(([key, value]) => [key, operation(value, key, obj)]));
		return Object.fromEntries(entries.map(([key, value]) => [key, deepOperateAndClone(value, operation, [obj, key])]));
	}
	return operation(obj, $prev?.[1] ?? "", $prev?.[0] ?? null);
};
//#endregion
//#region shared/fest/core/utils/Promised.ts
var resolvedMap = /* @__PURE__ */ new WeakMap(), handledMap = /* @__PURE__ */ new WeakMap();
var actWith = (promiseOrPlain, cb) => {
	if (promiseOrPlain instanceof Promise || typeof promiseOrPlain?.then == "function") {
		if (resolvedMap?.has?.(promiseOrPlain)) return cb(resolvedMap?.get?.(promiseOrPlain));
		return Promise.try?.(async () => {
			const item = await promiseOrPlain;
			resolvedMap?.set?.(promiseOrPlain, item);
			return item;
		})?.then?.(cb);
	}
	return cb(promiseOrPlain);
};
var PromiseHandler = class {
	#resolve;
	#reject;
	constructor(resolve, reject) {
		this.#resolve = resolve;
		this.#reject = reject;
	}
	defineProperty(target, prop, descriptor) {
		if (unwrap$1(target) instanceof Promise) return Reflect.defineProperty(target, prop, descriptor);
		return actWith(unwrap$1(target), (obj) => Reflect.defineProperty(obj, prop, descriptor));
	}
	deleteProperty(target, prop) {
		if (unwrap$1(target) instanceof Promise) return Reflect.deleteProperty(target, prop);
		return actWith(unwrap$1(target), (obj) => Reflect.deleteProperty(obj, prop));
	}
	getPrototypeOf(target) {
		if (unwrap$1(target) instanceof Promise) return Reflect.getPrototypeOf(target);
		return actWith(unwrap$1(target), (obj) => Reflect.getPrototypeOf(obj));
	}
	setPrototypeOf(target, proto) {
		if (unwrap$1(target) instanceof Promise) return Reflect.setPrototypeOf(target, proto);
		return actWith(unwrap$1(target), (obj) => Reflect.setPrototypeOf(obj, proto));
	}
	isExtensible(target) {
		if (unwrap$1(target) instanceof Promise) return Reflect.isExtensible(target);
		return actWith(unwrap$1(target), (obj) => Reflect.isExtensible(obj));
	}
	preventExtensions(target) {
		if (unwrap$1(target) instanceof Promise) return Reflect.ownKeys(target);
		return actWith(unwrap$1(target), (obj) => Reflect.preventExtensions(obj));
	}
	ownKeys(target) {
		const uwp = unwrap$1(target);
		if (uwp instanceof Promise) return Object.keys(uwp);
		return actWith(uwp, (obj) => {
			return (typeof obj == "object" || typeof obj == "function") && obj != null ? Object.keys(obj) : [];
		}) ?? [];
	}
	getOwnPropertyDescriptor(target, prop) {
		if (unwrap$1(target) instanceof Promise) return Reflect.getOwnPropertyDescriptor(target, prop);
		return actWith(unwrap$1(target), (obj) => Reflect.getOwnPropertyDescriptor(obj, prop));
	}
	construct(target, args, newTarget) {
		return actWith(unwrap$1(target), (ct) => Reflect.construct(ct, args, newTarget));
	}
	has(target, prop) {
		if (unwrap$1(target) instanceof Promise) return Reflect.has(target, prop);
		return actWith(unwrap$1(target), (obj) => Reflect.has(obj, prop));
	}
	get(target, prop, receiver) {
		target = unwrap$1(target);
		if (prop == "promise") return target;
		if (prop == "resolve" && this.#resolve) return (...args) => {
			const result = this.#resolve?.(...args);
			this.#resolve = null;
			return result;
		};
		if (prop == "reject" && this.#reject) return (...args) => {
			const result = this.#reject?.(...args);
			this.#reject = null;
			return result;
		};
		if (prop == "then" || prop == "catch" || prop == "finally") if (target instanceof Promise) return target?.[prop]?.bind?.(target);
		else {
			const $tmp = Promise.try(() => target);
			return $tmp?.[prop]?.bind?.($tmp);
		}
		let result = void 0;
		if (resolvedMap?.has?.(target) && (result = resolvedMap?.get?.(target))?.[prop] != null) result = resolvedMap?.get?.(target)?.[prop];
		else result = Promised(actWith(target, async (obj) => {
			if (unwrap$1(obj) instanceof Promise) return Reflect.get(obj, prop, receiver);
			if (isPrimitive(obj)) return prop == Symbol.toPrimitive || prop == Symbol.toStringTag ? obj : void 0;
			let value = void 0;
			try {
				value = Reflect.get(obj, prop, receiver);
			} catch (e) {
				value = target?.[prop];
			}
			if (typeof value == "function") return value?.bind?.(obj);
			return value;
		}));
		if (prop == Symbol.toStringTag) {
			if (isPrimitive(result)) return String(result ?? "") || "";
			return result?.[Symbol.toStringTag]?.() || String(result ?? "") || "";
		}
		if (prop == Symbol.toPrimitive) return (hint) => {
			if (isPrimitive(result)) return tryParseByHint(result, hint);
		};
		return result;
	}
	set(target, prop, value) {
		return actWith(unwrap$1(target), (obj) => Reflect.set(obj, prop, value));
	}
	apply(target, thisArg, args) {
		if (this.#resolve) {
			const result = this.#resolve?.(...args);
			this.#resolve = null;
			return result;
		}
		return actWith(unwrap$1(target, this.#resolve), (obj) => {
			if (typeof obj == "function") {
				if (unwrap$1(obj) instanceof Promise) return Reflect.apply(obj, thisArg, args);
				return Reflect.apply(obj, thisArg, args);
			}
		});
	}
};
/**
* Wrap a promise or value in a Proxy that allows synchronous property access.
* For resolved promises, this enables accessing properties as if the promise was already resolved.
* @template T - The resolved value type
* @param promise - The promise or value to wrap
* @param resolve - Optional resolve callback
* @param reject - Optional reject callback
* @returns A proxy that allows synchronous-style access to promise values
*/
function Promised(promise, resolve, reject) {
	if (!(promise instanceof Promise || typeof promise?.then == "function")) return promise;
	if (resolvedMap?.has?.(promise)) return resolvedMap?.get?.(promise);
	if (!handledMap?.has?.(promise)) promise?.then?.((item) => resolvedMap?.set?.(promise, item));
	return handledMap?.getOrInsertComputed?.(promise, () => new Proxy(fixFx(promise), new PromiseHandler(resolve, reject)));
}
//#endregion
//#region shared/fest/core/utils/WRef.ts
var existsMap = /* @__PURE__ */ new WeakMap();
var WeakRefProxyHandler = class {
	_deref(target) {
		return target instanceof WeakRef || typeof target?.deref == "function" ? target?.deref?.() : target;
	}
	get(tg, prop, _receiver) {
		const obj = this._deref(tg), value = obj?.[prop];
		if ((prop == "element" || prop == "value") && obj && (value == null || !(prop in obj))) return obj;
		if (prop == "deref") return () => this._deref(tg);
		if (typeof value == "function") return (...args) => {
			return this._deref(tg)?.[prop]?.(...args);
		};
		return value;
	}
	set(tg, prop, value, _receiver) {
		const obj = this._deref(tg);
		if (obj) return Reflect.set(obj, prop, value);
		return true;
	}
	has(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return false;
		return prop in obj;
	}
	ownKeys(tg) {
		const obj = this._deref(tg);
		if (!obj) return [];
		return Reflect.ownKeys(obj);
	}
	getOwnPropertyDescriptor(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return void 0;
		return Object.getOwnPropertyDescriptor(obj, prop);
	}
	deleteProperty(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.deleteProperty(obj, prop);
	}
	defineProperty(tg, prop, descriptor) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.defineProperty(obj, prop, descriptor);
	}
	getPrototypeOf(tg) {
		const obj = this._deref(tg);
		if (!obj) return null;
		return Object.getPrototypeOf(obj);
	}
	setPrototypeOf(tg, proto) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.setPrototypeOf(obj, proto);
	}
	isExtensible(tg) {
		const obj = this._deref(tg);
		if (!obj) return false;
		return Reflect.isExtensible(obj);
	}
	preventExtensions(tg) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.preventExtensions(obj);
	}
};
/**
* Create a WeakRef wrapper proxy that allows safe access to weakly referenced objects.
* The proxy automatically dereferences WeakRefs when accessing properties and handles
* function calls on weakly referenced objects.
* @template T - The type of the target object (must be object or Function)
* @param target - The target object or WeakRef to wrap
* @returns A proxy that safely accesses the weakly referenced object
*/
function WRef(target) {
	if (!(typeof target == "object" || typeof target == "function") || typeof target == "symbol") return target;
	const isWeakRef = target instanceof WeakRef || typeof target?.deref == "function";
	target = isWeakRef ? target?.deref?.() : target;
	if (target != null && existsMap.has(target)) return existsMap.get(target);
	const handler = new WeakRefProxyHandler();
	const pm = new Proxy(isWeakRef ? target : new WeakRef(target), handler);
	existsMap.set(target, pm);
	return pm;
}
//#endregion
//#region shared/fest/core/utils/Convert.ts
/**
* Orientation-space transforms for grids and drag vectors.
* Used by `GridItemUtils` / `resolveLocalPointToGridCell` and `fest/dom` launcher hit-testing.
*
* Convert position from client space to orientation space.
* @param pos_in_cs - Position in client space [x, y]
* @param size_in_cs - Size in client space [width, height]
* @param or_i - Orientation index (0=normal, 1=90° swapped, 2=180°, 3=270° swapped)
* @returns Position in orientation space [x, y]
*/
var cvt_cs_to_os = (pos_in_cs, size_in_cs, or_i = 0) => {
	const size_in_os = [...size_in_cs];
	const pos_in_swap = [...pos_in_cs];
	if (or_i % 2) {
		pos_in_swap.reverse();
		size_in_os.reverse();
	}
	return [(or_i == 0 || or_i == 3 ? pos_in_swap[0] : size_in_os[0] - pos_in_swap[0]) || 0, (or_i == 0 || or_i == 1 ? pos_in_swap[1] : size_in_os[1] - pos_in_swap[1]) || 0];
};
//#endregion
//#region shared/fest/core/utils/GridItemUtils.ts
/** Canonical `[columns, rows]` for launcher / speed-dial style grids. */
var normalizeGridLayout = (layout, fallback = [4, 8]) => {
	if (Array.isArray(layout) && layout.length >= 2) return [Math.max(1, Math.floor(Number(layout[0]) || fallback[0])), Math.max(1, Math.floor(Number(layout[1]) || fallback[1]))];
	if (layout && typeof layout === "object") {
		const o = layout;
		return [Math.max(1, Math.floor(Number(o.columns) || fallback[0])), Math.max(1, Math.floor(Number(o.rows) || fallback[1]))];
	}
	return [fallback[0], fallback[1]];
};
/** Clamp cell indices to grid bounds (inclusive). */
var clampGridCellTuple = (cell, layout) => {
	const [cols, rows] = normalizeGridLayout(layout);
	return [Math.max(0, Math.min(cols - 1, Math.floor(Number(cell[0]) || 0))), Math.max(0, Math.min(rows - 1, Math.floor(Number(cell[1]) || 0)))];
};
/**
* Point in grid **local** CSS pixels (origin top-left of grid content box), orientation index from `orientOf(grid)`.
* Used by launcher hit-testing; DOM wrappers live in `fest/dom`.
*/
var resolveLocalPointToGridCell = (localPx, size, layout, orient, options) => {
	const L = normalizeGridLayout(layout);
	const w = Math.max(1, size[0] || 1);
	const h = Math.max(1, size[1] || 1);
	const osCoord = cvt_cs_to_os(localPx, [w, h], orient);
	const normalizedArgs = {
		item: options?.redirect?.item ?? { id: "" },
		list: options?.redirect?.list ?? [],
		items: options?.redirect?.items ?? /* @__PURE__ */ new Map(),
		layout: L,
		size: [w, h]
	};
	const projected = convertOrientPxToCX(osCoord, normalizedArgs, orient);
	return clampGridCellTuple(redirectCell((options?.mode ?? "floor") === "round" ? [Math.round(projected[0]), Math.round(projected[1])] : [Math.floor(projected[0]), Math.floor(projected[1])], normalizedArgs), L);
};
/** Normalize grid item collections for algorithms that expect an array (Orient desktop uses `Map`, SpeedDial uses arrays). */
var gridItemsAsArray = (items) => {
	if (items == null) return [];
	if (Array.isArray(items)) return items;
	if (items instanceof Map) return Array.from(items.values());
	if (items instanceof Set) return Array.from(items);
	if (typeof items[Symbol.iterator] === "function") return Array.from(items);
	return [];
};
/**
* Find a non-busy cell near the preferred cell in a grid layout.
* If the preferred cell is busy, searches nearby cells to find an available one.
* @param $preCell - Preferred cell coordinates [column, row]
* @param gridArgs - Grid arguments containing items, layout, and size information
* @returns Cell coordinates [column, row] that are not busy
*/
var redirectCell = ($preCell, gridArgs) => {
	const layout = normalizeGridLayout(gridArgs?.layout ?? [4, 8]);
	const normalizedArgs = {
		...gridArgs,
		layout
	};
	const icons = gridItemsAsArray(normalizedArgs?.items);
	const item = normalizedArgs?.item || {};
	const checkBusy = (cell) => {
		return icons.filter((e) => !(e == item || e?.id == item?.id)).some((one) => (one?.cell?.[0] || 0) == (cell[0] || 0) && (one?.cell?.[1] || 0) == (cell[1] || 0));
	};
	const preCell = [...$preCell];
	if (!checkBusy(preCell)) return [...preCell];
	const columns = layout[0] || 4;
	const rows = layout[1] || 8;
	const suitable = ([
		[preCell[0] + 1, preCell[1]],
		[preCell[0] - 1, preCell[1]],
		[preCell[0], preCell[1] + 1],
		[preCell[0], preCell[1] - 1]
	].filter((v) => {
		return v[0] >= 0 && v[0] < columns && v[1] >= 0 && v[1] < rows;
	}) || []).find((v) => !checkBusy(v));
	if (suitable) return [...suitable];
	let exceed = 0, busy = true, comp = [...preCell];
	while (busy && exceed++ < columns * rows) {
		if (!(busy = checkBusy(comp))) return [...comp];
		comp[0]++;
		if (comp[0] >= columns) {
			comp[0] = 0;
			comp[1]++;
			if (comp[1] >= rows) comp[1] = 0;
		}
	}
	return [...preCell];
};
var convertOrientPxToCX = ($orientPx, gridArgs, orient = 0) => {
	const boxInPx = [...gridArgs.size];
	const orientPx = [...$orientPx];
	const layout = normalizeGridLayout(gridArgs.layout ?? [4, 8]);
	if (orient % 2) boxInPx.reverse();
	const gridPxToCX = [layout[0] / boxInPx[0], layout[1] / boxInPx[1]];
	return [orientPx[0] * gridPxToCX[0], orientPx[1] * gridPxToCX[1]];
};
//#endregion
//#region shared/fest/core/utils/UserPath.ts
var normalizeSlashes = (input) => {
	const value = String(input ?? "").trim();
	if (!value) return "/";
	return (value.startsWith("/") ? value : `/${value}`).replace(/\/+/g, "/");
};
var isUserScopePath = (input) => {
	const normalized = normalizeSlashes(input);
	return normalized === "/user" || normalized.startsWith("/user/");
};
var stripUserScopePrefix = (input) => {
	const normalized = normalizeSlashes(input);
	if (normalized === "/user") return "/";
	if (normalized.startsWith("/user/")) return normalized.slice(5) || "/";
	return normalized;
};
var userPathCandidates = (input) => {
	const normalized = normalizeSlashes(input);
	const stripped = stripUserScopePrefix(normalized);
	if (isUserScopePath(normalized)) return Array.from(new Set([stripped, normalized]));
	return [stripped];
};
//#endregion
//#region shared/fest/core/index.ts
installDomConstructorPolyfills();
//#endregion
//#region shared/fest/object/wrap/Symbol.ts
/**
* Shared symbol registry for the `object.ts` reactive runtime.
*
* These symbols form the hidden protocol used across wrappers, proxies,
* registries, and refs so internal bookkeeping does not collide with user keys.
*/
Symbol.observable ||= Symbol.for("observable");
Symbol.subscribe ||= Symbol.for("subscribe");
Symbol.unsubscribe ||= Symbol.for("unsubscribe");
var $value = Symbol.for("@value");
var $extractKey$ = Symbol.for("@extract");
var $originalKey$ = Symbol.for("@origin");
var $registryKey$ = Symbol.for("@registry");
var $behavior = Symbol.for("@behavior");
var $promise = Symbol.for("@promise");
var $triggerLess = Symbol.for("@trigger-less");
var $triggerLock = Symbol.for("@trigger-lock");
var $trigger = Symbol.for("@trigger");
var $affected = Symbol.for("@subscribe");
var $isNotEqual = Symbol.for("@isNotEqual");
//#endregion
//#region shared/fest/object/wrap/Utils.ts
/**
* Shared type and utility layer for `object.ts`.
*
* This file defines the loose observable/subscription type contracts plus
* helper functions for unwrapping, dereferencing, safe serialization, dispose
* chaining, promise-aware flows, and the Set-as-array adapter.
*/
var $originalObjects$ = /* @__PURE__ */ new WeakMap();
/** Clone an observable-like structure into plain serializable data. */
var safe = (target) => {
	const unwrap = typeof target == "object" || typeof target == "function" ? target?.[$extractKey$] ?? target : target, mapped = (e) => safe(e);
	if (Array.isArray(unwrap)) return unwrap?.map?.(mapped) || Array.from(unwrap || [])?.map?.(mapped) || [];
	else if (unwrap instanceof Map || unwrap instanceof WeakMap) return new Map(Array.from(unwrap?.entries?.() || [])?.map?.(([K, V]) => [K, safe(V)]));
	else if (unwrap instanceof Set || unwrap instanceof WeakSet) return new Set(Array.from(unwrap?.values?.() || [])?.map?.(mapped));
	else if (unwrap != null && typeof unwrap == "function" || typeof unwrap == "object") return Object.fromEntries(Array.from(Object.entries(unwrap || {}) || [])?.filter?.(([K]) => K != $extractKey$ && K != $originalKey$ && K != $registryKey$)?.map?.(([K, V]) => [K, safe(V)]));
	return unwrap;
};
/** Return the raw target behind a proxy/wrapper when one exists. */
var unwrap = (arr) => {
	return arr?.[$extractKey$] ?? arr?.["@target"] ?? arr;
};
/** Dereference WeakRef-like wrappers and recursively unwrap observable containers. */
var deref = (target, discountValue = false) => {
	const original = target;
	if (isPrimitive(target) || typeof target == "symbol") return target;
	if (target != null && (target instanceof WeakRef || "deref" in target && typeof target?.deref == "function")) target = target?.deref?.();
	if (target != null && (typeof target == "object" || typeof target == "function")) {
		target = unwrap(target);
		const $val = discountValue && hasValue(target) && target?.value;
		if ($val != null && (typeof $val == "object" || typeof $val == "function")) target = $val;
		if (original != target) return deref(target, discountValue);
	}
	return target;
};
/** Promise-like guard used by subscription helpers that accept thenables. */
var isThenable = (val) => val != null && typeof val.then === "function";
/** Run a callback once the target or its embedded promise has resolved. */
var withPromise = (target, cb) => {
	if (isPrimitive(target) || typeof target == "function") return cb?.(target);
	if (isThenable(target)) return target.then(cb);
	if (target?.promise && isThenable(target.promise)) return target.promise.then(cb);
	return cb?.(target);
};
var disposeMap = /* @__PURE__ */ new WeakMap();
var disposeRegistry = new FinalizationRegistry((callstack) => {
	callstack?.forEach?.((cb) => cb?.());
});
/**
* Append a callback to an object's disposal/call chain.
*
* AI-READ: `Symbol.dispose` is treated specially and kept in a side registry so
* multiple callbacks can be composed without overwriting each other.
*/
function addToCallChain(obj, methodKey, callback) {
	if (!callback || typeof callback != "function" || typeof obj != "object" && typeof obj != "function") return;
	if (methodKey == Symbol.dispose) disposeMap?.getOrInsertComputed?.(obj, () => {
		const CallChain = /* @__PURE__ */ new Set();
		if (typeof obj == "object" || typeof obj == "function") {
			disposeRegistry.register(obj, CallChain);
			disposeMap.set(obj, CallChain);
			obj[Symbol.dispose] ??= () => CallChain.forEach((cb) => {
				cb?.();
			});
		}
		return CallChain;
	})?.add?.(callback);
	else obj[methodKey] = function(...args) {
		const original = obj?.[methodKey];
		if (typeof original == "function") original.apply(this, args);
		callback.apply(this, args);
	};
}
//#endregion
//#region shared/fest/object/wrap/AssignObject.ts
/**
* Proxy helper that forces property writes through `objectAssign`.
*
* WHY: some callers want an object that looks ordinary but still normalizes
* assignment semantics the same way the rest of the reactive stack does.
*/
/** Proxy handler that redirects `set` operations to the Fest assignment helper. */
var AssignObjectHandler = class {
	constructor() {}
	deleteProperty(target, name) {
		return Reflect.deleteProperty(target, name);
	}
	construct(target, args, newT) {
		return Reflect.construct(target, args, newT);
	}
	apply(target, ctx, args) {
		return Reflect.apply(target, ctx, args);
	}
	has(target, prop) {
		return Reflect.has(target, prop);
	}
	set(target, name, value) {
		objectAssign(target, value, name);
		return true;
	}
	get(target, name, ctx) {
		if (typeof name == "symbol") return target?.[name] ?? target;
		return Reflect.get(target, name, ctx);
	}
};
/** Wrap an object in an assignment-aware proxy once, preserving the original-object lookup table. */
var makeObjectAssignable = (obj) => {
	if (obj?.[$originalKey$] || $originalObjects$.has(obj)) return obj;
	const px = new Proxy(obj, new AssignObjectHandler());
	$originalObjects$.set(px, obj);
	return px;
};
//#endregion
//#region shared/fest/object/core/Subscript.ts
/**
* Listener registry and proxy wrapper backbone for `object.ts`.
*
* The `Subscript` class stores callbacks, batches dispatches, exposes a
* minimal Observable-compatible surface, and helps observable wrappers share
* one registry per underlying target.
*/
/** Track disposer rewrites for Observable-style subscribers so completion also unsubscribes. */
var withUnsub = /* @__PURE__ */ new WeakMap();
var completeWithUnsub = (subscriber, weak, handler) => {
	return withUnsub.getOrInsert(subscriber, () => {
		const registry = weak?.deref?.();
		registry?.affected?.(handler);
		const savComplete = subscriber?.complete?.bind?.(subscriber);
		const unaffected = () => {
			const r = savComplete?.();
			registry?.unaffected?.(handler);
			return r;
		};
		subscriber.complete = unaffected;
		return {
			unaffected,
			[Symbol.dispose]: unaffected,
			[Symbol.asyncDispose]: unaffected
		};
	});
};
/** Global registry that maps raw targets to their `Subscript` instance. */
var subscriptRegistry = /* @__PURE__ */ new WeakMap();
var wrapped = /* @__PURE__ */ new WeakMap();
/** Ensure a target has a registry before reusing or returning a reactive handle. */
var register = (what, handle) => {
	const unwrap = what?.[$extractKey$] ?? what;
	subscriptRegistry.getOrInsert(unwrap, new Subscript());
	return handle;
};
/** Wrap a raw target in a proxy backed by the provided handler, memoized per original object. */
var wrapWith = (what, handle) => {
	what = deref(what?.[$extractKey$] ?? what);
	if (typeof what == "symbol" || !(typeof what == "object" || typeof what == "function") || what == null) return what;
	return wrapped.getOrInsertComputed(what, () => new Proxy(what, register(what, handle)));
};
var forAll = Symbol.for("@allProps");
/** Central subscription registry with batched dispatch and Observable interoperability helpers. */
var Subscript = class {
	#listeners;
	#flags = /* @__PURE__ */ new WeakSet();
	#native;
	#iterator;
	#inDispatch = /* @__PURE__ */ new Set();
	#pending = /* @__PURE__ */ new Map();
	#pendingByProp = /* @__PURE__ */ new Map();
	#flushScheduled = false;
	#lastPerfNow = /* @__PURE__ */ new WeakMap();
	#now() {
		return globalThis.performance?.now?.() ?? Date.now();
	}
	constructor() {
		this.#listeners = /* @__PURE__ */ new Map();
		this.#flags = /* @__PURE__ */ new WeakSet();
		this.#iterator = { next: (args) => {
			if (args) Array.isArray(args) ? this.#dispatch(...args) : this.#dispatch(args);
		} };
		const weak = new WeakRef(this);
		const controller = function(subscriber) {
			const handler = subscriber?.next?.bind?.(subscriber);
			return completeWithUnsub(subscriber, weak, handler);
		};
		this.#native = typeof Observable != "undefined" ? new Observable(controller) : null;
		this.compatible = () => this.#native;
	}
	/** Run one listener with simple re-entrancy and duplicate-same-tick guards. */
	$safeExec(cb, ...args) {
		if (!cb || this.#flags.has(cb)) return;
		this.#flags.add(cb);
		if (this.#lastPerfNow.get(cb) === this.#now()) return;
		this.#lastPerfNow.set(cb, this.#now());
		try {
			const res = cb(...args);
			if (res && typeof res.then === "function") return res.catch(console.warn);
			return res;
		} catch (e) {
			console.warn(e);
		} finally {
			this.#flags.delete(cb);
		}
	}
	#dispatch(name, value = null, oldValue, ...etc) {
		const listeners = this.#listeners;
		if (!listeners?.size) return;
		const promises = Array.from(listeners.entries()).map(([cb, prop]) => {
			if (prop === name || prop === forAll || prop === null) return this.$safeExec(cb, value, name, oldValue, ...etc);
		}).filter((res) => res && typeof res.then === "function");
		return promises.length ? Promise.allSettled(promises) : void 0;
	}
	wrap(nw) {
		if (Array.isArray(nw)) return wrapWith(nw, this);
		return nw;
	}
	affected(cb, prop) {
		if (cb == null || typeof cb != "function") return;
		this.#listeners.set(cb, prop || forAll);
		return () => this.unaffected(cb, prop || forAll);
	}
	unaffected(cb, prop) {
		if (cb != null && typeof cb == "function") {
			const listeners = this.#listeners;
			if (listeners?.has(cb) && (listeners.get(cb) == prop || prop == null || prop == forAll)) {
				listeners.delete(cb);
				return () => this.affected(cb, prop || forAll);
			}
		}
		return this.#listeners.clear();
	}
	/**
	* Коалесит триггеры:
	* - один dispatch на name за микро-тик
	* - повторные trigger(name) до flush не вызывают повторно dispatch, а лишь обновляют аргументы
	* - другие name не блокируются
	*/
	/**
	* Queue and coalesce trigger events by property and operation per microtask.
	*
	* WHY: hot mutation paths can emit many intermediate writes; batching keeps
	* subscribers deterministic and avoids recursive cascades on one property.
	*/
	trigger(name, value, oldValue, operation = null, ...etc) {
		if (typeof name === "symbol") return;
		if (operation === void 0) operation = null;
		const opKey = operation ?? "__";
		let byOp = this.#pendingByProp.get(name);
		if (!byOp) {
			byOp = /* @__PURE__ */ new Map();
			this.#pendingByProp.set(name, byOp);
		}
		byOp.set(opKey, [
			name,
			value,
			oldValue,
			operation,
			etc
		]);
		if (this.#flushScheduled) return;
		this.#flushScheduled = true;
		queueMicrotask(() => {
			this.#flushScheduled = false;
			const batch = this.#pendingByProp;
			this.#pendingByProp = /* @__PURE__ */ new Map();
			for (const [prop, opMap] of batch) {
				if (prop != null && this.#inDispatch.has(prop)) continue;
				if (prop != null) this.#inDispatch.add(prop);
				try {
					for (const [, args] of opMap) {
						const [nm, v, ov, op, rest] = args;
						try {
							this.#dispatch(nm, v, ov, op, ...rest ?? []);
						} catch (e) {
							console.warn(e);
						}
					}
				} finally {
					if (prop != null) this.#inDispatch.delete(prop);
				}
			}
		});
	}
	get iterator() {
		return this.#iterator;
	}
};
//#endregion
//#region shared/fest/object/core/Specific.ts
/**
* Concrete proxy handlers for arrays, objects, maps, and sets.
*
* This is the low-level implementation layer that intercepts reads/writes,
* translates native collection operations into normalized trigger events, and
* exposes the observable protocol used by `observe()`.
*/
var __systemSkip = new Set([
	Symbol.toStringTag,
	Symbol.iterator,
	Symbol.asyncIterator,
	Symbol.toPrimitive,
	"toString",
	"valueOf",
	"inspect",
	"constructor",
	"__proto__",
	"prototype",
	"then",
	"catch",
	"finally",
	"next"
]);
var systemSkipGet = (target, name) => {
	if (!__systemSkip.has(name)) return null;
	const got = safeGet(target, name);
	return typeof got === "function" ? bindCtx(target, got) : got;
};
var __safeGetGuard = /* @__PURE__ */ new WeakMap();
function isGetter(obj, propName) {
	let got = true;
	try {
		__safeGetGuard?.getOrInsert?.(obj, /* @__PURE__ */ new Set())?.add?.(propName);
		if (__safeGetGuard?.get?.(obj)?.has?.(propName)) got = true;
		got = typeof Reflect.getOwnPropertyDescriptor(obj, propName)?.get == "function";
	} catch (e) {
		got = true;
	} finally {
		__safeGetGuard?.get?.(obj)?.delete?.(propName);
	}
	return got;
}
/** Follow `.value` chains when a wrapper stores the actual object one level deeper. */
var fallThrough = (obj, key) => {
	if (isPrimitive(obj)) return obj;
	const value = safeGet(obj, key);
	if (value == null && key != "value") {
		const tmp = safeGet(obj, "value");
		if (tmp != null && !isPrimitive(tmp)) return fallThrough(tmp, key);
		else return value;
	} else if (key == "value" && value != null && !isPrimitive(value) && typeof value != "function") return fallThrough(value, key) ?? value ?? obj;
	return value ?? obj;
};
/** Safe getter with re-entrancy protection to avoid recursive accessor loops. */
var safeGet = (obj, key, rec) => {
	let result = void 0;
	if (obj == null) return obj;
	let active = __safeGetGuard.getOrInsert(obj, /* @__PURE__ */ new Set());
	if (active?.has?.(key)) return null;
	if (!isGetter(obj, key)) result ??= Reflect.get(obj, key, rec != null ? rec : obj);
	else {
		active?.add?.(key);
		try {
			result = Reflect.get(obj, key, rec != null ? rec : obj);
		} catch (_e) {
			result = void 0;
		} finally {
			active.delete(key);
			if (active?.size === 0) __safeGetGuard?.delete?.(obj);
		}
	}
	return typeof result == "function" ? bindCtx(obj, result) : result;
};
var systemGet = (target, name, registry) => {
	if (target == null || isPrimitive(target)) return target;
	if (([
		"deref",
		"bind",
		"@target",
		$originalKey$,
		$extractKey$,
		$registryKey$
	]?.indexOf(name) < 0 ? safeGet(target, name)?.bind?.(target) : null) != null) return null;
	if ([$extractKey$, $originalKey$].indexOf(name) >= 0) return safeGet(target, name) ?? target;
	if (name == $value) return safeGet(target, name) ?? safeGet(target, "value");
	if (name == $registryKey$) return registry;
	if (name == Symbol.observable) return registry?.compatible;
	if (name == Symbol.subscribe) return (cb, prop) => affected(prop != null ? [target, prop] : target, cb);
	if (name == Symbol.iterator) return safeGet(target, name);
	if (name == Symbol.asyncIterator) return safeGet(target, name);
	if (name == Symbol.dispose) return (prop) => {
		safeGet(target, Symbol.dispose)?.(prop);
		unaffected(prop != null ? [target, prop] : target);
	};
	if (name == Symbol.asyncDispose) return (prop) => {
		safeGet(target, Symbol.asyncDispose)?.(prop);
		unaffected(prop != null ? [target, prop] : target);
	};
	if (name == Symbol.unsubscribe) return (prop) => unaffected(prop != null ? [target, prop] : target);
	if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) return safeGet(target, name);
};
var observableAPIMethods = (target, name, registry) => {
	if (name == "subscribe") return registry?.compatible?.[name] ?? ((handler) => {
		if (typeof handler == "function") return affected(target, handler);
		else if ("next" in handler && handler?.next != null) {
			const usub = affected(target, handler?.next), comp = handler?.["complete"];
			handler["complete"] = (...args) => {
				usub?.();
				return comp?.(...args);
			};
			return handler["complete"];
		}
	});
};
/** Wrap mutating array methods so they emit normalized add/set/delete events. */
var ObserveArrayMethod = class {
	#name;
	#self;
	#handle;
	constructor(name, self, handle) {
		this.#name = name;
		this.#self = self;
		this.#handle = handle;
	}
	get(target, name, rec) {
		const skip = systemSkipGet(target, name);
		if (skip !== null) return skip;
		return Reflect.get(target, name, rec);
	}
	apply(target, ctx, args) {
		let added = [], removed = [];
		let setPairs = [];
		let oldState = [...this.#self];
		let idx = -1;
		const result = Reflect.apply(target, ctx || this.#self, args);
		if (this.#handle?.[$triggerLock]) {
			if (Array.isArray(result)) return observeArray(result);
			return result;
		}
		switch (this.#name) {
			case "push":
				idx = oldState?.length;
				added = args;
				break;
			case "unshift":
				idx = 0;
				added = args;
				break;
			case "pop":
				idx = oldState?.length - 1;
				if (oldState.length > 0) removed = [[
					idx - 1,
					oldState[idx - 1],
					null
				]];
				break;
			case "shift":
				idx = 0;
				if (oldState.length > 0) removed = [[
					idx,
					oldState[idx],
					null
				]];
				break;
			case "splice":
				const [start, deleteCount, ...items] = args;
				idx = start;
				added = deleteCount > 0 ? items.slice(deleteCount) : [];
				removed = deleteCount > 0 ? oldState?.slice?.(items?.length + start, start + (deleteCount - (items?.length || 0))) : [];
				idx += (deleteCount || 0) - (items?.length || 1);
				if (deleteCount > 0 && items?.length > 0) for (let i = 0; i < Math.min(deleteCount, items?.length ?? 0); i++) setPairs.push([
					start + i,
					items[i],
					oldState?.[start + i] ?? null
				]);
				break;
			case "sort":
			case "fill":
			case "reverse":
			case "copyWithin":
				idx = 0;
				for (let i = 0; i < oldState.length; i++) if (isNotEqual(oldState[i], this.#self[i])) setPairs.push([
					idx + i,
					this.#self[i],
					oldState[i]
				]);
				break;
			case "set":
				idx = args[1];
				setPairs.push([
					idx,
					args[0],
					oldState?.[idx] ?? null
				]);
				break;
		}
		const reg = subscriptRegistry.get(this.#self);
		if (added?.length == 1) reg?.trigger?.(idx, added[0], null, added[0] == null ? "@add" : "@set");
		else if (added?.length > 1) {
			reg?.trigger?.(idx, added, null, "@addAll");
			added.forEach((item, I) => reg?.trigger?.(idx + I, item, null, item == null ? "@add" : "@set"));
		}
		if (setPairs?.length == 1) reg?.trigger?.(setPairs[0]?.[0] ?? idx, setPairs[0]?.[1], setPairs[0]?.[2], setPairs[0]?.[2] == null ? "@add" : "@set");
		else if (setPairs?.length > 1) {
			reg?.trigger?.(idx, setPairs, oldState, "@setAll");
			setPairs.forEach((pair, I) => reg?.trigger?.(pair?.[0] ?? idx + I, pair?.[1], pair?.[2], pair?.[2] == null ? "@add" : "@set"));
		}
		if (removed?.length == 1) reg?.trigger?.(idx, null, removed[0], removed[0] == null ? "@add" : "@delete");
		else if (removed?.length > 1) {
			reg?.trigger?.(idx, null, removed, "@clear");
			removed.forEach((item, I) => reg?.trigger?.(idx + I, null, item, item == null ? "@add" : "@delete"));
		}
		if (result == target) return new Proxy(result, this.#handle);
		if (Array.isArray(result)) return observeArray(result);
		return result;
	}
};
var triggerWhenLengthChange = (self, target, oldLen, newLen) => {
	const removedItems = Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen < oldLen ? target.slice(newLen, oldLen) : [];
	if (!self[$triggerLock] && oldLen !== newLen) {
		const registry = subscriptRegistry.get(target);
		if (removedItems.length === 1) registry?.trigger?.(newLen, null, removedItems[0], "@delete");
		else if (removedItems.length > 1) {
			registry?.trigger?.(newLen, null, removedItems, "@clear");
			removedItems.forEach((item, I) => registry?.trigger?.(newLen + I, null, item, "@delete"));
		}
		const addedCount = Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen > oldLen ? newLen - oldLen : 0;
		if (addedCount === 1) registry?.trigger?.(oldLen, void 0, null, "@add");
		else if (addedCount > 1) {
			const added = Array(addedCount).fill(void 0);
			registry?.trigger?.(oldLen, added, null, "@addAll");
			added.forEach((_, I) => registry?.trigger?.(oldLen + I, void 0, null, "@add"));
		}
	}
};
/** Proxy handler for observable arrays, including index writes and mutation methods. */
var ObserveArrayHandler = class {
	constructor() {}
	has(target, name) {
		return Reflect.has(target, name);
	}
	get(target, name, rec) {
		const skip = systemSkipGet(target, name);
		if (skip !== null) return skip;
		if ([
			$extractKey$,
			$originalKey$,
			"@target",
			"deref"
		].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) return typeof safeGet(target, name) == "function" ? safeGet(target, name)?.bind?.(target) : safeGet(target, name);
		const registry = subscriptRegistry?.get?.(target);
		const sys = systemGet(target, name, registry);
		if (sys != null) return sys;
		const obs = observableAPIMethods(target, name, registry);
		if (obs != null) return obs;
		if (name == $triggerLess) return makeTriggerLess.call(this, this);
		if (name == $trigger) return (key = 0) => {
			const v = safeGet(target, key);
			return subscriptRegistry.get(target)?.trigger?.(key, v, void 0, "@invalidate");
		};
		if (name == "@target" || name == $extractKey$) return target;
		if (name == "x") return () => {
			return target?.x ?? target?.[0];
		};
		if (name == "y") return () => {
			return target?.y ?? target?.[1];
		};
		if (name == "z") return () => {
			return target?.z ?? target?.[2];
		};
		if (name == "w") return () => {
			return target?.w ?? target?.[3];
		};
		if (name == "r") return () => {
			return target?.r ?? target?.[0];
		};
		if (name == "g") return () => {
			return target?.g ?? target?.[1];
		};
		if (name == "b") return () => {
			return target?.b ?? target?.[2];
		};
		if (name == "a") return () => {
			return target?.a ?? target?.[3];
		};
		const got = safeGet(target, name) ?? (name == "value" ? safeGet(target, $value) : null);
		if (typeof got == "function") return new Proxy(typeof got == "function" ? got?.bind?.(target) : got, new ObserveArrayMethod(name, target, this));
		return got;
	}
	set(target, name, value) {
		if (typeof name != "symbol") {
			if (Number.isInteger(parseInt(name))) name = parseInt(name) ?? name;
		}
		if (name == $triggerLock && value) {
			this[$triggerLock] = !!value;
			return true;
		}
		if (name == $triggerLock && !value) {
			delete this[$triggerLock];
			return true;
		}
		const old = safeGet(target, name);
		const xyzw = [
			"x",
			"y",
			"z",
			"w"
		];
		const rgba = [
			"r",
			"g",
			"b",
			"a"
		];
		const xyzw_idx = xyzw.indexOf(name);
		const rgba_idx = rgba.indexOf(name);
		let got = false;
		if (xyzw_idx >= 0) got = Reflect.set(target, xyzw_idx, value);
		else if (rgba_idx >= 0) got = Reflect.set(target, rgba_idx, value);
		else got = Reflect.set(target, name, value);
		if (name == "length") {
			if (isNotEqual(old, value)) triggerWhenLengthChange(this, target, old, value);
		}
		if (!this[$triggerLock] && typeof name != "symbol" && isNotEqual(old, value)) subscriptRegistry?.get?.(target)?.trigger?.(name, value, old, typeof name == "number" ? "@set" : null);
		return got;
	}
	deleteProperty(target, name) {
		if (typeof name != "symbol") {
			if (Number.isInteger(parseInt(name))) name = parseInt(name) ?? name;
		}
		if (name == $triggerLock) {
			delete this[$triggerLock];
			return true;
		}
		const old = safeGet(target, name);
		const got = Reflect.deleteProperty(target, name);
		if (!this[$triggerLock] && name != "length" && name != $triggerLock && typeof name != "symbol") {
			if (old != null) subscriptRegistry.get(target)?.trigger?.(name, name, old, typeof name == "number" ? "@delete" : null);
		}
		return got;
	}
};
/** Proxy handler for observable objects and ref-like `{ value }` containers. */
var ObserveObjectHandler = class {
	constructor() {}
	get(target, name, ctx) {
		if ([
			$extractKey$,
			$originalKey$,
			"@target",
			"deref",
			"then",
			"catch",
			"finally"
		].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
		const registry = subscriptRegistry.get(target) ?? subscriptRegistry.get(safeGet(target, "value") ?? target);
		const sys = systemGet(target, name, registry);
		if (sys != null) return sys;
		if (safeGet(target, name) == null && name != "value" && hasValue(target) && safeGet(target, "value") != null && (typeof safeGet(target, "value") == "object" || typeof safeGet(target, "value") == "function") && safeGet(safeGet(target, "value"), name) != null) target = safeGet(target, "value") ?? target;
		const obs = observableAPIMethods(target, name, registry);
		if (obs != null) return obs;
		if (name == $triggerLess) return makeTriggerLess.call(this, this);
		if (name == $trigger) return (key = "value") => {
			const v = safeGet(target, key);
			const old = key == "value" ? safeGet(target, $value) : void 0;
			return subscriptRegistry.get(target)?.trigger?.(key, v, old, "@invalidate");
		};
		if (name == Symbol.toPrimitive) return (hint) => {
			const ft = fallThrough(target, name);
			if (safeGet(ft, name)) return safeGet(ft, name)?.(hint);
			if (isPrimitive(ft)) return tryParseByHint(ft, hint);
			if (isPrimitive(safeGet(ft, "value"))) return tryParseByHint(safeGet(ft, "value"), hint);
			return tryParseByHint(safeGet(ft, "value") ?? ft, hint);
		};
		if (name == Symbol.toStringTag) return () => {
			const ft = fallThrough(target, name);
			if (safeGet(ft, name)) return safeGet(ft, name)?.();
			if (isPrimitive(ft)) return String(ft ?? "") || "";
			if (isPrimitive(safeGet(ft, "value"))) return String(safeGet(ft, "value") ?? "") || "";
			return String(safeGet(ft, "value") ?? ft ?? "") || "";
		};
		if (name == "toString") return () => {
			const ft = fallThrough(target, name);
			if (safeGet(ft, name)) return safeGet(ft, name)?.();
			if (safeGet(ft, Symbol.toStringTag)) return safeGet(ft, Symbol.toStringTag)?.();
			if (isPrimitive(ft)) return String(ft ?? "") || "";
			if (isPrimitive(safeGet(ft, "value"))) return String(safeGet(ft, "value") ?? "") || "";
			return String(safeGet(ft, "value") ?? ft ?? "") || "";
		};
		if (name == "valueOf") return () => {
			const ft = fallThrough(target, name);
			if (safeGet(ft, name)) return safeGet(ft, name)?.();
			if (safeGet(ft, Symbol.toPrimitive)) return safeGet(ft, Symbol.toPrimitive)?.();
			if (isPrimitive(ft)) return ft;
			if (isPrimitive(safeGet(ft, "value"))) return safeGet(ft, "value");
			return safeGet(ft, "value") ?? ft;
		};
		if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) return safeGet(target, name);
		return fallThrough(target, name);
	}
	apply(target, ctx, args) {
		return Reflect.apply(target, ctx, args);
	}
	ownKeys(target) {
		return Reflect.ownKeys(target);
	}
	construct(target, args, newT) {
		return Reflect.construct(target, args, newT);
	}
	isExtensible(target) {
		return Reflect.isExtensible(target);
	}
	getOwnPropertyDescriptor(target, key) {
		let got = void 0;
		try {
			__safeGetGuard?.getOrInsert?.(target, /* @__PURE__ */ new Set())?.add?.(key);
			if (__safeGetGuard?.get?.(target)?.has?.(key)) got = void 0;
			got = Reflect.getOwnPropertyDescriptor(target, key);
		} catch (e) {
			got = void 0;
		} finally {
			__safeGetGuard?.get?.(target)?.delete?.(key);
		}
		return got;
	}
	has(target, prop) {
		return prop in target;
	}
	set(target, name, value) {
		const skip = systemSkipGet(target, name);
		if (skip !== null) return skip;
		return potentiallyAsync(value, (v) => {
			const skip = systemSkipGet(v, name);
			if (skip !== null) return skip;
			if (name == $triggerLock && value) {
				this[$triggerLock] = !!value;
				return true;
			}
			if (name == $triggerLock && !value) {
				delete this[$triggerLock];
				return true;
			}
			const $original = target;
			if (safeGet(target, name) == null && name != "value" && hasValue(target) && safeGet(target, "value") != null && (typeof safeGet(target, "value") == "object" || typeof safeGet(target, "value") == "function") && safeGet(safeGet(target, "value"), name) != null) target = safeGet(target, "value") ?? target;
			if (typeof name == "symbol" && !(safeGet(target, name) != null && name in target)) return;
			const oldValue = name == "value" ? safeGet(target, $value) ?? safeGet(target, name) : safeGet(target, name);
			target[name] = v;
			const newValue = safeGet(target, name) ?? v;
			if (!this[$triggerLock] && typeof name != "symbol" && (safeGet(target, $isNotEqual) ?? isNotEqual)?.(oldValue, newValue)) (subscriptRegistry.get(target) ?? subscriptRegistry.get($original))?.trigger?.(name, v, oldValue);
			return true;
		});
	}
	deleteProperty(target, name) {
		if (name == $triggerLock) {
			delete this[$triggerLock];
			return true;
		}
		if (safeGet(target, name) == null && name != "value" && hasValue(target) && safeGet(target, "value") != null && (typeof safeGet(target, "value") == "object" || typeof safeGet(target, "value") == "function") && safeGet(safeGet(target, "value"), name) != null) target = safeGet(target, "value") ?? target;
		const oldValue = safeGet(target, name);
		const result = Reflect.deleteProperty(target, name);
		if (!this[$triggerLock] && name != $triggerLock && typeof name != "symbol") subscriptRegistry.get(target)?.trigger?.(name, null, oldValue);
		return result;
	}
};
/** Proxy handler for observable maps, mapping native map operations to trigger events. */
var ObserveMapHandler = class {
	constructor() {}
	get(target, name, ctx) {
		if ([
			$extractKey$,
			$originalKey$,
			"@target",
			"deref"
		].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
		const registry = subscriptRegistry.get(target);
		const sys = systemGet(target, name, registry);
		if (sys != null) return sys;
		const obs = observableAPIMethods(target, name, registry);
		if (obs != null) return obs;
		target = safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target;
		const valueOrFx = bindCtx(target, safeGet(target, name));
		if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) return valueOrFx;
		if (name == $triggerLess) return makeTriggerLess.call(this, this);
		if (name == $trigger) return (key) => {
			if (key == null) return;
			const v = target.get(key);
			if (v == null) return;
			return subscriptRegistry.get(target)?.trigger?.(key, v, void 0, "@set");
		};
		if (name == "clear") return () => {
			const oldValues = Array.from(target?.entries?.() || []), result = valueOrFx();
			oldValues.forEach(([prop, oldValue]) => {
				if (!this[$triggerLock] && oldValue) subscriptRegistry.get(target)?.trigger?.(prop, null, oldValue, "@delete");
			});
			return result;
		};
		if (name == "delete") return (prop, _ = null) => {
			const oldValue = target.get(prop), result = valueOrFx(prop);
			if (!this[$triggerLock] && oldValue) subscriptRegistry.get(target)?.trigger?.(prop, null, oldValue, "@delete");
			return result;
		};
		if (name == "set") return (prop, value) => potentiallyAsyncMap(value, (v) => {
			const oldValue = target.get(prop), result = valueOrFx(prop, value);
			if (isNotEqual(oldValue, result)) {
				if (!this[$triggerLock]) subscriptRegistry.get(target)?.trigger?.(prop, result, oldValue, oldValue == null ? "@add" : "@set");
			}
			return result;
		});
		return valueOrFx;
	}
	set(target, name, value) {
		if (name == $triggerLock) {
			this[$triggerLock] = !!value;
			return true;
		}
		if (name == $triggerLock && !value) {
			delete this[$triggerLock];
			return true;
		}
		return Reflect.set(target, name, value);
	}
	has(target, prop) {
		return Reflect.has(target, prop);
	}
	apply(target, ctx, args) {
		return Reflect.apply(target, ctx, args);
	}
	construct(target, args, newT) {
		return Reflect.construct(target, args, newT);
	}
	ownKeys(target) {
		return Reflect.ownKeys(target);
	}
	isExtensible(target) {
		return Reflect.isExtensible(target);
	}
	getOwnPropertyDescriptor(target, key) {
		let got = void 0;
		try {
			__safeGetGuard?.getOrInsert?.(target, /* @__PURE__ */ new Set())?.add?.(key);
			if (__safeGetGuard?.get?.(target)?.has?.(key)) got = void 0;
			got = Reflect.getOwnPropertyDescriptor(target, key);
		} catch (e) {
			got = void 0;
		} finally {
			__safeGetGuard?.get?.(target)?.delete?.(key);
		}
		return got;
	}
	deleteProperty(target, name) {
		if (name == $triggerLock) {
			delete this[$triggerLock];
			return true;
		}
		return Reflect.deleteProperty(target, name);
	}
};
/** Proxy handler for observable sets, emitting membership changes as reactive events. */
var ObserveSetHandler = class {
	constructor() {
		this[$triggerLock] = false;
	}
	get(target, name, ctx) {
		if ([
			$extractKey$,
			$originalKey$,
			"@target",
			"deref"
		].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
		const registry = subscriptRegistry.get(target);
		const sys = systemGet(target, name, registry);
		if (sys != null) return sys;
		const obs = observableAPIMethods(target, name, registry);
		if (obs != null) return obs;
		target = safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target;
		const valueOrFx = bindCtx(target, safeGet(target, name));
		if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) return valueOrFx;
		if (name == $triggerLess) return makeTriggerLess.call(this, this);
		if (name == $trigger) return (key) => {
			if (key == null) return;
			const v = target.has(key);
			return subscriptRegistry.get(target)?.trigger?.(key, v, void 0, "@invalidate");
		};
		if (name == "clear") return () => {
			const oldValues = Array.from(target?.values?.() || []), result = valueOrFx();
			oldValues.forEach((oldValue) => {
				if (!this[$triggerLock] && oldValue) subscriptRegistry.get(target)?.trigger?.(null, null, oldValue, "@delete");
			});
			return result;
		};
		if (name == "delete") return (value) => {
			const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
			if (!this[$triggerLock] && oldValue) subscriptRegistry.get(target)?.trigger?.(value, null, oldValue, "@delete");
			return result;
		};
		if (name == "add") return (value) => {
			const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
			if (isNotEqual(oldValue, value)) {
				if (!this[$triggerLock] && !oldValue) subscriptRegistry.get(target)?.trigger?.(value, value, oldValue, "@add");
			}
			return result;
		};
		return valueOrFx;
	}
	set(target, name, value) {
		if (name == $triggerLock && value) {
			this[$triggerLock] = !!value;
			return true;
		}
		if (name == $triggerLock && !value) {
			delete this[$triggerLock];
			return true;
		}
		return Reflect.set(target, name, value);
	}
	has(target, prop) {
		return Reflect.has(target, prop);
	}
	apply(target, ctx, args) {
		return Reflect.apply(target, ctx, args);
	}
	construct(target, args, newT) {
		return Reflect.construct(target, args, newT);
	}
	ownKeys(target) {
		return Reflect.ownKeys(target);
	}
	isExtensible(target) {
		return Reflect.isExtensible(target);
	}
	getOwnPropertyDescriptor(target, key) {
		let got = void 0;
		try {
			__safeGetGuard?.getOrInsert?.(target, /* @__PURE__ */ new Set())?.add?.(key);
			if (__safeGetGuard?.get?.(target)?.has?.(key)) got = void 0;
			got = Reflect.getOwnPropertyDescriptor(target, key);
		} catch (e) {
			got = void 0;
		} finally {
			__safeGetGuard?.get?.(target)?.delete?.(key);
		}
		return got;
	}
	deleteProperty(target, name) {
		if (name == $triggerLock) {
			delete this[$triggerLock];
			return true;
		}
		return Reflect.deleteProperty(target, name);
	}
};
/** Lightweight internal check used before wrapping a target again. */
var $isObservable = (target) => {
	return !!((typeof target == "object" || typeof target == "function") && target != null && (target?.[$extractKey$] || target?.[$affected]));
};
/** Wrap an array with the array-specific observable proxy. */
var observeArray = (arr) => {
	return $isObservable(arr) ? arr : wrapWith(arr, new ObserveArrayHandler());
};
/** Wrap an object with the object-specific observable proxy. */
var observeObject = (obj) => {
	return $isObservable(obj) ? obj : wrapWith(obj, new ObserveObjectHandler());
};
/** Wrap a map with the map-specific observable proxy. */
var observeMap = (map) => {
	return $isObservable(map) ? map : wrapWith(map, new ObserveMapHandler());
};
/** Wrap a set with the set-specific observable proxy. */
var observeSet = (set) => {
	return $isObservable(set) ? set : wrapWith(set, new ObserveSetHandler());
};
//#endregion
//#region shared/fest/object/core/Primitives.ts
/**
* Reactive primitive/ref helpers plus the main `observe()` entrypoint.
*
* This module creates typed refs (`numberRef`, `stringRef`, `booleanRef`),
* property refs, delayed trigger behaviors, and the canonical dispatcher that
* chooses the correct observable wrapper for arrays, objects, maps, and sets.
*/
/** Numeric ref with coercion, primitive conversion hooks, and optional promise initialization. */
var numberRef = (initial, behavior) => {
	const isPromise = initial instanceof Promise || typeof initial?.then == "function";
	const $r = observe({
		[$promise]: isPromise ? initial : null,
		[$value]: isPromise ? 0 : Number(deref(initial) || 0) || 0,
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(this?.[$value] ?? "") || "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint((typeof this?.[$value] != "object" ? this?.[$value] : this?.[$value]?.value || 0) ?? 0, hint);
		},
		set value(v) {
			this[$value] = (v != null && !Number.isNaN(v) ? Number(v) : this[$value]) || 0;
		},
		get value() {
			return Number(this[$value] || 0) || 0;
		}
	});
	initial?.then?.((v) => $r.value = v);
	return $r;
};
/** String ref with coercion, primitive conversion hooks, and optional promise initialization. */
var stringRef = (initial, behavior) => {
	const isPromise = initial instanceof Promise || typeof initial?.then == "function";
	const $r = observe({
		[$promise]: isPromise ? initial : null,
		[$value]: (isPromise ? "" : String(deref(typeof initial == "number" ? String(initial) : initial || ""))) ?? "",
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(this?.[$value] ?? "") ?? "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint(this?.[$value] ?? "", hint);
		},
		set value(v) {
			this[$value] = String(typeof v == "number" ? String(v) : v || "") ?? "";
		},
		get value() {
			return String(this[$value] ?? "") ?? "";
		}
	});
	initial?.then?.((v) => $r.value = v);
	return $r;
};
/** Boolean ref with truthy/falsy coercion and optional promise initialization. */
var booleanRef = (initial, behavior) => {
	const isPromise = initial instanceof Promise || typeof initial?.then == "function";
	const $r = observe({
		[$promise]: isPromise ? initial : null,
		[$value]: (isPromise ? false : (deref(initial) != null ? typeof deref(initial) == "string" ? true : !!deref(initial) : false) || false) || false,
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(this?.[$value] ?? "") || "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint(!!this?.[$value] || false, hint);
		},
		set value(v) {
			this[$value] = (v != null ? typeof v == "string" ? true : !!v : this[$value]) || false;
		},
		get value() {
			return this[$value] || false;
		}
	});
	initial?.then?.((v) => $r.value = v);
	return $r;
};
/** Generic ref wrapper for values that do not need one of the specialized primitive ref shapes. */
var wrapRef = (initial, behavior) => {
	const isPromise = initial instanceof Promise || typeof initial?.then == "function";
	const $r = observe({
		[$promise]: isPromise ? initial : null,
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(this.value ?? "") || "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint(this.value, hint);
		},
		value: isPromise ? null : deref(initial)
	});
	initial?.then?.((v) => $r.value = v);
	affected(initial, (v) => {
		$r?.[$trigger]?.();
	});
	return $r;
};
/**
* Create a reactive reference to one property of an observable source.
*
* WHY: this keeps duplex synchronization between `src[srcProp]` and the
* returned ref-like object while still behaving like a regular `value` ref.
*/
var propRef = (src, srcProp = "value", initial, behavior) => {
	if (isPrimitive(src) || !src) return src;
	if (Array.isArray(src) && !isArrayInvalidKey(src?.[1], src) && (Array.isArray(src?.[0]) || typeof src?.[0] == "object" || typeof src?.[0] == "function")) src = src?.[0];
	if ((srcProp ??= Array.isArray(src) ? null : "value") == null || isArrayInvalidKey(srcProp, src)) return;
	if (srcProp && hasValue(src?.[srcProp]) && isObservable(src?.[srcProp])) return recoverReactive(src?.[srcProp]);
	if (srcProp && typeof src?.getProperty == "function" && isObservable(src?.getProperty?.(srcProp))) return src?.getProperty?.(srcProp);
	const r = observe({
		[$value]: src[srcProp] ??= initial ?? src[srcProp],
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(src?.[srcProp] ?? this[$value] ?? "") || "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint(src?.[srcProp], hint);
		},
		set value(v) {
			r[$triggerLock$1] = true;
			src[srcProp] = this[$value] = v ?? defaultByType(src[srcProp]);
			r[$triggerLock$1] = false;
		},
		get value() {
			return this[$value] = src?.[srcProp] ?? this[$value];
		}
	});
	const usb = affected(src, (v) => {
		r?.[$trigger]?.();
	});
	addToCallChain(r, Symbol.dispose, usb);
	return r;
};
/** Pick the most suitable ref implementation for the provided value type. */
var $ref = (typed, behavior) => {
	switch (typeof typed) {
		case "boolean": return booleanRef(typed, behavior);
		case "number": return numberRef(typed, behavior);
		case "string": return stringRef(typed, behavior);
		case "object": if (typed != null) return wrapRef(observe(typed), behavior);
		default: return wrapRef(typed, behavior);
	}
};
/** Public ref helper that can either wrap a value or target one specific property. */
var ref = (typed, prop = "value", behavior) => {
	const $r = isObservable(typed) ? typed : $ref(typed, behavior);
	if (prop != null) return propRef($r, prop, behavior);
	else return $r;
};
/** `function` (not `const`) so circular Mainline ↔ Primitives/Assigned init cannot TDZ in bundled output. */
function observe(target, stateName) {
	if (target == null || typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || $isObservable(target)) return target;
	if ((target = deref?.(target)) == null || target instanceof Promise || target instanceof WeakRef || $isObservable(target)) return target;
	const unwrap = target;
	if (unwrap == null || typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") || unwrap instanceof Promise || unwrap instanceof WeakRef) return unwrap;
	let reactive = unwrap;
	if (Array.isArray(unwrap)) {
		reactive = observeArray(unwrap);
		return reactive;
	} else if (unwrap instanceof Map) {
		reactive = observeMap(unwrap);
		return reactive;
	} else if (unwrap instanceof Set) {
		reactive = observeSet(unwrap);
		return reactive;
	} else if (typeof unwrap == "function" || typeof unwrap == "object") {
		reactive = observeObject(unwrap);
		return reactive;
	}
	return reactive;
}
/** Detect whether a value is already wrapped in the `object.ts` observable protocol. */
var isObservable = (target) => {
	if (typeof HTMLInputElement != "undefined" && target instanceof HTMLInputElement) return true;
	return !!((typeof target == "object" || typeof target == "function") && target != null && (target?.[$extractKey$] || target?.[$affected] || subscriptRegistry?.has?.(target)));
};
/** Re-enter the observable pipeline only when the target already carries observable metadata. */
var recoverReactive = (target) => {
	return isObservable(target) ? observe(target) : null;
};
//#endregion
//#region shared/fest/object/core/Mainline.ts
/**
* Subscription and derivation pipeline for `object.ts`.
*
* This module resolves how callbacks subscribe to observable values, tuples,
* promises, DOM inputs, and iteration sources, then builds higher-level
* combinators like `assign`, `link`, `computed`, and `derivate`.
*/
var specializedSubscribe = /* @__PURE__ */ new WeakMap();
var checkValidObj = (obj) => {
	if (typeof obj == "symbol" || obj == null || !(typeof obj == "object" || typeof obj == "function")) return;
	return obj;
};
/** Default subscription strategy for already-observable targets. */
var subscribeDirectly = (target, prop, cb, ctx = null) => {
	if (!target) return;
	if (!checkValidObj(target)) return;
	const tProp = prop != Symbol.iterator ? prop : null;
	let registry = target?.[$registryKey$] ?? subscriptRegistry.get(target);
	target = target?.[$extractKey$] ?? target;
	queueMicrotask(() => {
		if (tProp != null && tProp != Symbol.iterator) callByProp(target, tProp, cb, ctx);
		else callByAllProp(target, cb, ctx);
	});
	let unSub = registry?.affected?.(cb, tProp);
	if (target?.[Symbol.dispose]) return unSub;
	addToCallChain(unSub, Symbol.dispose, unSub);
	addToCallChain(unSub, Symbol.asyncDispose, unSub);
	addToCallChain(target, Symbol.dispose, unSub);
	addToCallChain(target, Symbol.asyncDispose, unSub);
	return unSub;
};
/** Subscription adapter for DOM inputs, mapping `change` events onto reactive callbacks. */
var subscribeInput = (tg, _, cb, ctx = null) => {
	const $opt = {};
	let oldValue = tg?.value;
	const $cb = (ev) => {
		cb?.(ev?.target?.value, "value", oldValue);
		oldValue = ev?.target?.value;
	};
	tg?.addEventListener?.("change", $cb, $opt);
	return () => tg?.removeEventListener?.("change", $cb, $opt);
};
var checkIsPaired = (tg) => {
	return Array.isArray(tg) && tg?.length == 2 && checkValidObj(tg?.[0]) && (isKeyType(tg?.[1]) || tg?.[1] == Symbol.iterator);
};
/** Subscription adapter for `[target, prop]` tuples. */
var subscribePaired = (tg, _, cb, ctx = null) => {
	const prop = isKeyType(tg?.[1]) ? tg?.[1] : null;
	return affected(tg?.[0], prop, cb, ctx);
};
/** Defer subscription until a thenable source resolves. */
var subscribeThenable = (obj, prop, cb, ctx = null) => {
	return obj?.then?.((obj) => affected?.(obj, prop, cb, ctx))?.catch?.((e) => {
		console.warn(e);
		return null;
	});
};
/** `function` (not `const`) so circular imports from Assigned/Primitives cannot hit TDZ during bundle init. */
function affected(obj, prop, cb = () => {}, ctx) {
	if (typeof prop == "function") {
		cb = prop;
		prop = null;
	}
	if (isPrimitive(obj) || typeof obj == "symbol") return queueMicrotask(() => {
		return cb?.(obj, null, null, null);
	});
	if (typeof obj?.[$affected] == "function") return obj?.[$affected]?.(cb, prop, ctx);
	else if (checkValidObj(obj)) {
		const wrapped = obj;
		obj = obj?.[$extractKey$] ?? obj;
		if (specializedSubscribe?.has?.(obj)) return specializedSubscribe?.get?.(obj)?.(wrapped, prop, cb, ctx);
		if (isObservable(wrapped) || checkIsPaired(obj) && isObservable(obj?.[0])) if (isThenable(obj)) return specializedSubscribe?.getOrInsert?.(obj, subscribeThenable)?.(obj, prop, cb, ctx);
		else if (checkIsPaired(obj)) return specializedSubscribe?.getOrInsert?.(obj, subscribePaired)?.(obj, prop, cb, ctx);
		else if (typeof HTMLInputElement != "undefined" && obj instanceof HTMLInputElement) return specializedSubscribe?.getOrInsert?.(obj, subscribeInput)?.(obj, prop, cb, ctx);
		else return specializedSubscribe?.getOrInsert?.(obj, subscribeDirectly)?.(wrapped, prop, cb, ctx);
		else return queueMicrotask(() => {
			if (checkIsPaired(obj)) return callByProp?.(obj?.[0], obj?.[1], cb, ctx);
			if (prop != null && prop != Symbol.iterator) return callByProp?.(obj, prop, cb, ctx);
			return callByAllProp?.(obj, cb, ctx);
		});
	}
}
/** Two-level WeakMap used to memoize subscriptions keyed by `[target, callback]` pairs. */
var DoubleWeakMap = class {
	#top = /* @__PURE__ */ new WeakMap();
	#ensureInner(key1) {
		let inner = this.#top.get(key1);
		if (!inner) {
			inner = /* @__PURE__ */ new WeakMap();
			this.#top.set(key1, inner);
		}
		return inner;
	}
	#splitPair(pair) {
		if (!Array.isArray(pair) || pair.length !== 2) return [null, null];
		return pair;
	}
	hasL1(key1) {
		return this.#top.has(key1);
	}
	set(pair, value) {
		const [key1, key2] = this.#splitPair(pair);
		this.#ensureInner(key1).set(key2, value);
		return this;
	}
	get(pair) {
		const [key1, key2] = this.#splitPair(pair);
		return this.#top.get(key1)?.get(key2);
	}
	has(pair) {
		const [key1, key2] = this.#splitPair(pair);
		return this.#top.get(key1)?.has(key2) ?? false;
	}
	delete(pair) {
		const [key1, key2] = this.#splitPair(pair);
		const inner = this.#top.get(key1);
		return inner ? inner.delete(key2) : false;
	}
	deleteTop(key1) {
		return this.#top.delete(key1);
	}
	getOrCreate(pair, factory) {
		const [key1, key2] = this.#splitPair(pair);
		const inner = this.#ensureInner(key1);
		if (inner.has(key2)) return inner.get(key2);
		const value = factory();
		inner.set(key2, value);
		return value;
	}
	getOrInsert(pair, value) {
		const [key1, key2] = this.#splitPair(pair);
		const inner = this.#ensureInner(key1);
		if (inner.has(key2)) return inner.get(key2);
		inner.set(key2, value);
		return value;
	}
	getOrInsertComputed(pair, compute) {
		const [key1, key2] = this.#splitPair(pair);
		const inner = this.#ensureInner(key1);
		if (inner.has(key2)) return inner.get(key2);
		const value = compute([key1, key2]);
		inner.set(key2, value);
		return value;
	}
};
var registeredIterated = new DoubleWeakMap();
/**
* Subscribe to iteration-level changes for arrays, sets, maps, and ref-like
* containers whose `value` should itself be treated as a collection.
*/
function iterated(tg, cb, ctx = null) {
	if (!tg) return;
	if (registeredIterated.has([tg, cb])) return registeredIterated.get([tg, cb]);
	const $sub = (value, name, old) => {
		if (name == "value") {
			const entries = (old?.value ?? old)?.entries?.();
			const basis = tg?.value ?? value?.value ?? value;
			if (entries) for (const [idx, item] of entries) {
				const ofOld = item ?? (old?.value ?? old)?.[idx] ?? null;
				const ofNew = basis?.[idx];
				if (ofOld == null && ofNew != null) cb(ofNew, idx, null, "@add");
				else if (ofOld != null && ofNew == null) cb(null, idx, ofOld, "@delete");
				else if (isNotEqual(ofOld, ofNew)) cb(ofNew, idx, ofOld, "@set");
			}
			return iterated(value ?? tg?.value, (value, prop, old, operation) => {
				cb(value, prop, old, operation);
			});
		}
		return tg[name];
	};
	return registeredIterated.getOrInsertComputed([tg, cb], () => {
		if (tg instanceof Set) return affected([observableBySet(tg), Symbol.iterator], cb, ctx);
		if (tg instanceof Map) return affected(tg, cb, ctx);
		if (hasValue(tg)) return affected(tg, $sub, ctx);
		if (Array.isArray(tg) && !(tg?.length == 2 && isKeyType(tg?.[1]) && isObservable(tg?.[0]))) return affected([tg, Symbol.iterator], cb, ctx);
		return affected(tg, cb, ctx);
	});
}
/** Remove a previously registered subscription. */
function unaffected(tg, cb, ctx = null) {
	return withPromise(tg, (target) => {
		const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
		const prop = isPair ? target?.[1] : null;
		target = isPair && prop != null ? target?.[0] ?? target : target;
		const unwrap = typeof target == "object" || typeof target == "function" ? target?.[$extractKey$] ?? target : target;
		(target?.[$registryKey$] ?? subscriptRegistry.get(unwrap))?.unaffected?.(cb, prop);
	});
}
//#endregion
//#region shared/fest/object/core/Assigned.ts
/**
* Higher-level composition helpers built on top of the primitive observer layer.
*
* This file provides conditional refs, collection-to-array adapters, duplex
* assignment/linking, and computed values that mirror changes back into refs.
*/
/** View a `Set` as a reactive array that stays synchronized with set membership. */
var observableBySet = (set) => {
	const obs = observe([]);
	obs.push(...Array.from(set?.values?.() || []));
	addToCallChain(obs, Symbol.dispose, affected(set, (value, _, old) => {
		if (isNotEqual(value, old)) if (old == null && value != null) obs.push(value);
		else if (old != null && value == null) {
			const idx = obs.indexOf(old);
			if (idx >= 0) obs.splice(idx, 1);
		} else {
			const idx = obs.indexOf(old);
			if (idx >= 0 && isNotEqual(obs[idx], value)) obs[idx] = value;
		}
	}));
	return obs;
};
/** Build a computed ref whose getter and optional setter are driven by a source subscription. */
var computed = (src, cb, behavior, prop = "value") => {
	const isACompute = typeof src?.[1] == "function" && src?.length == 2;
	const isAProp = (isKeyType(src?.[1]) || src?.[1] == Symbol.iterator) && src?.length == 2;
	let a_prop = isAProp && !isACompute ? src?.[1] : Array.isArray(src) ? null : prop;
	if (!isAProp && !isACompute) src = [isAProp ? src?.[0] : src, a_prop];
	if (isACompute) src[1] = a_prop;
	if (a_prop == null || isArrayInvalidKey(a_prop, src?.[0])) return;
	const cmp = (v) => {
		let oldValue = void 0;
		if (v != void 0) {
			oldValue = src[0][a_prop];
			src[0][a_prop] = v;
		}
		return cb?.(src?.[0]?.[a_prop], a_prop, oldValue);
	};
	const initial = cmp();
	const rf = observe({
		[$promise]: void 0,
		[$value]: initial,
		[$behavior]: behavior,
		[Symbol?.toStringTag]() {
			return String(cmp() ?? this[$value] ?? "") || "";
		},
		[Symbol?.toPrimitive](hint) {
			return tryParseByHint(cmp() ?? this[$value], hint);
		},
		set value(v) {
			this[$value] = cmp(v);
		},
		get value() {
			return this[$value] = cmp() ?? this[$value];
		}
	});
	const usb = affected([src?.[0] ?? src, a_prop ?? "value"], () => rf?.[$trigger]?.());
	addToCallChain(rf, Symbol.dispose, usb);
	return rf;
};
//#endregion
export { globalChannelRegistry as $, UUIDv4 as A, isNotComplexArray as B, WRef as C, $avoidTrigger as D, isNotEqual as E, handleListeners as F, isValueRef as G, isObservable$1 as H, hasValue as I, normalizePrimitive as J, isValueUnit as K, isArrayOrIterable as L, canBeInteger as M, deref$1 as N, $getValue as O, getValue as P, globalChannelHealthMonitor as Q, isCanJustReturn as R, resolveLocalPointToGridCell as S, deepOperateAndClone as T, isPrimitive as U, isObject as V, isVal as W, tryStringAsNumber as X, toRef as Y, unref as Z, isUserScopePath as _, booleanRef as a, normalizeGridLayout as b, observe as c, stringRef as d, createDeferred as et, makeObjectAssignable as f, $affected as g, unwrap as h, iterated as i, camelToKebab as j, $set as k, propRef as l, safe as m, DoubleWeakMap as n, isObservable as o, addToCallChain as p, kebabToCamel as q, affected as r, numberRef as s, computed as t, ref as u, stripUserScopePrefix as v, Promised as w, redirectCell as x, userPathCandidates as y, isCanTransfer as z };
