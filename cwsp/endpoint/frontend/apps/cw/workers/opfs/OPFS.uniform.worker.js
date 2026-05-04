//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region shared/fest/uniform/newer/next/types/Interface.ts
let WReflectAction = /* @__PURE__ */ function(WReflectAction) {
	WReflectAction["GET"] = "get";
	WReflectAction["SET"] = "set";
	WReflectAction["CALL"] = "call";
	WReflectAction["APPLY"] = "apply";
	WReflectAction["CONSTRUCT"] = "construct";
	WReflectAction["DELETE"] = "delete";
	WReflectAction["DELETE_PROPERTY"] = "deleteProperty";
	WReflectAction["HAS"] = "has";
	WReflectAction["OWN_KEYS"] = "ownKeys";
	WReflectAction["GET_OWN_PROPERTY_DESCRIPTOR"] = "getOwnPropertyDescriptor";
	WReflectAction["GET_PROPERTY_DESCRIPTOR"] = "getPropertyDescriptor";
	WReflectAction["GET_PROTOTYPE_OF"] = "getPrototypeOf";
	WReflectAction["SET_PROTOTYPE_OF"] = "setPrototypeOf";
	WReflectAction["IS_EXTENSIBLE"] = "isExtensible";
	WReflectAction["PREVENT_EXTENSIONS"] = "preventExtensions";
	WReflectAction["TRANSFER"] = "transfer";
	WReflectAction["IMPORT"] = "import";
	WReflectAction["DISPOSE"] = "dispose";
	return WReflectAction;
}({});
//#endregion
//#region shared/fest/uniform/newer/core/TransportCore.ts
const TRANSPORT_TYPE_ALIASES = {
	"ws": "websocket",
	"socket": "websocket",
	"socketio": "socket-io",
	"service": "service-worker",
	"sw": "service-worker",
	"service-worker-client": "service-worker",
	"service-worker-host": "service-worker",
	"ring-buffer": "atomics"
};
function normalizeTransportTypeAlias(transport) {
	const raw = String(transport ?? "").trim().toLowerCase();
	if (!raw) return "internal";
	return TRANSPORT_TYPE_ALIASES[raw] ?? raw;
}
function detectTransportType$1(transport) {
	if (typeof transport === "string") return normalizeTransportTypeAlias(transport);
	if (typeof Worker !== "undefined" && transport instanceof Worker) return "worker";
	if (typeof SharedWorker !== "undefined" && transport instanceof SharedWorker) return "shared-worker";
	if (typeof MessagePort !== "undefined" && transport instanceof MessagePort) return "message-port";
	if (typeof BroadcastChannel !== "undefined" && transport instanceof BroadcastChannel) return "broadcast";
	if (typeof WebSocket !== "undefined" && transport instanceof WebSocket) return "websocket";
	if (typeof RTCDataChannel !== "undefined" && transport instanceof RTCDataChannel) return "rtc-data";
	if (typeof chrome !== "undefined" && transport && typeof transport === "object" && typeof transport.postMessage === "function" && transport.onMessage?.addListener) return "chrome-port";
	return "internal";
}
//#endregion
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
new ChannelRegistry();
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
new ChannelHealthMonitor();
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
const $fxy = Symbol.for("@fix");
/**
* Check if a value is a primitive type (null, string, number, boolean, bigint, or undefined).
* @param obj - The value to check
* @returns True if the value is a primitive type, false otherwise
*/
const isPrimitive = (obj) => {
	return typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean" || typeof obj == "bigint" || typeof obj == "undefined" || obj == null;
};
const tryParseByHint = (value, hint) => {
	if (!isPrimitive(value)) return null;
	if (hint == "number") return Number(value) || 0;
	if (hint == "string") return String(value) || "";
	if (hint == "boolean") return !!value;
	return value;
};
const unwrap = (obj, fallback) => {
	return obj?.[$fxy] ?? (obj != null ? obj : fallback) ?? fallback;
};
const fixFx = (obj) => {
	if (typeof obj == "function" || obj == null) return obj;
	const fx = function() {};
	fx[$fxy] = obj;
	return fx;
};
const getRandomValues = (array) => {
	return crypto?.getRandomValues ? crypto?.getRandomValues?.(array) : (() => {
		const values = new Uint8Array(array.length);
		for (let i = 0; i < array.length; i++) values[i] = Math.floor(Math.random() * 256);
		return values;
	})();
};
const UUIDv4 = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ getRandomValues?.(new Uint8Array(1))?.[0] & 15 >> +c / 4).toString(16));
const unwrapArray = (arr) => {
	if (Array.isArray(arr)) return arr?.flatMap?.((el) => {
		if (Array.isArray(el)) return unwrapArray(el);
		return el;
	});
	else return arr;
};
const isNotComplexArray = (arr) => {
	return unwrapArray(arr)?.every?.(isCanJustReturn);
};
const isCanJustReturn = (obj) => {
	return isPrimitive(obj) || typeof SharedArrayBuffer == "function" && obj instanceof SharedArrayBuffer || isTypedArray(obj) || Array.isArray(obj) && isNotComplexArray(obj);
};
const isTypedArray = (value) => {
	return ArrayBuffer.isView(value) && !(value instanceof DataView);
};
const isCanTransfer = (obj) => {
	return isPrimitive(obj) || typeof ArrayBuffer == "function" && obj instanceof ArrayBuffer || typeof MessagePort == "function" && obj instanceof MessagePort || typeof ReadableStream == "function" && obj instanceof ReadableStream || typeof WritableStream == "function" && obj instanceof WritableStream || typeof TransformStream == "function" && obj instanceof TransformStream || typeof ImageBitmap == "function" && obj instanceof ImageBitmap || typeof VideoFrame == "function" && obj instanceof VideoFrame || typeof OffscreenCanvas == "function" && obj instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && obj instanceof RTCDataChannel || typeof AudioData == "function" && obj instanceof AudioData || typeof WebTransportReceiveStream == "function" && obj instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && obj instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && obj instanceof WebTransportReceiveStream;
};
//#endregion
//#region shared/fest/core/utils/Object.ts
const deepOperateAndClone = (obj, operation, $prev) => {
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
const resolvedMap = /* @__PURE__ */ new WeakMap(), handledMap = /* @__PURE__ */ new WeakMap();
const actWith = (promiseOrPlain, cb) => {
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
		if (unwrap(target) instanceof Promise) return Reflect.defineProperty(target, prop, descriptor);
		return actWith(unwrap(target), (obj) => Reflect.defineProperty(obj, prop, descriptor));
	}
	deleteProperty(target, prop) {
		if (unwrap(target) instanceof Promise) return Reflect.deleteProperty(target, prop);
		return actWith(unwrap(target), (obj) => Reflect.deleteProperty(obj, prop));
	}
	getPrototypeOf(target) {
		if (unwrap(target) instanceof Promise) return Reflect.getPrototypeOf(target);
		return actWith(unwrap(target), (obj) => Reflect.getPrototypeOf(obj));
	}
	setPrototypeOf(target, proto) {
		if (unwrap(target) instanceof Promise) return Reflect.setPrototypeOf(target, proto);
		return actWith(unwrap(target), (obj) => Reflect.setPrototypeOf(obj, proto));
	}
	isExtensible(target) {
		if (unwrap(target) instanceof Promise) return Reflect.isExtensible(target);
		return actWith(unwrap(target), (obj) => Reflect.isExtensible(obj));
	}
	preventExtensions(target) {
		if (unwrap(target) instanceof Promise) return Reflect.ownKeys(target);
		return actWith(unwrap(target), (obj) => Reflect.preventExtensions(obj));
	}
	ownKeys(target) {
		const uwp = unwrap(target);
		if (uwp instanceof Promise) return Object.keys(uwp);
		return actWith(uwp, (obj) => {
			return (typeof obj == "object" || typeof obj == "function") && obj != null ? Object.keys(obj) : [];
		}) ?? [];
	}
	getOwnPropertyDescriptor(target, prop) {
		if (unwrap(target) instanceof Promise) return Reflect.getOwnPropertyDescriptor(target, prop);
		return actWith(unwrap(target), (obj) => Reflect.getOwnPropertyDescriptor(obj, prop));
	}
	construct(target, args, newTarget) {
		return actWith(unwrap(target), (ct) => Reflect.construct(ct, args, newTarget));
	}
	has(target, prop) {
		if (unwrap(target) instanceof Promise) return Reflect.has(target, prop);
		return actWith(unwrap(target), (obj) => Reflect.has(obj, prop));
	}
	get(target, prop, receiver) {
		target = unwrap(target);
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
			if (unwrap(obj) instanceof Promise) return Reflect.get(obj, prop, receiver);
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
		return actWith(unwrap(target), (obj) => Reflect.set(obj, prop, value));
	}
	apply(target, thisArg, args) {
		if (this.#resolve) {
			const result = this.#resolve?.(...args);
			this.#resolve = null;
			return result;
		}
		return actWith(unwrap(target, this.#resolve), (obj) => {
			if (typeof obj == "function") {
				if (unwrap(obj) instanceof Promise) return Reflect.apply(obj, thisArg, args);
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
//#region shared/fest/core/index.ts
installDomConstructorPolyfills();
//#endregion
//#region shared/fest/uniform/newer/next/observable/Observable.ts
var BaseSubscription = class {
	constructor(_unsubscribe) {
		this._unsubscribe = _unsubscribe;
		this._closed = false;
	}
	get closed() {
		return this._closed;
	}
	unsubscribe() {
		if (!this._closed) {
			this._closed = true;
			this._unsubscribe();
		}
	}
};
/**
* Core Observable with producer function
*/
var Observable = class {
	constructor(_producer) {
		this._producer = _producer;
	}
	subscribe(observerOrNext, opts) {
		const observer = typeof observerOrNext === "function" ? { next: observerOrNext } : observerOrNext ?? {};
		const ctrl = new AbortController();
		opts?.signal?.addEventListener("abort", () => ctrl.abort());
		let active = true;
		let cleanup;
		const doCleanup = () => {
			active = false;
			ctrl.abort();
			cleanup?.();
		};
		const subscriber = {
			next: (v) => active && observer.next?.(v),
			error: (e) => {
				if (active) {
					observer.error?.(e);
					doCleanup();
				}
			},
			complete: () => {
				if (active) {
					observer.complete?.();
					doCleanup();
				}
			},
			signal: ctrl.signal,
			get active() {
				return active && !ctrl.signal.aborted;
			}
		};
		try {
			cleanup = this._producer(subscriber);
		} catch (e) {
			subscriber.error(e);
		}
		return new BaseSubscription(doCleanup);
	}
	pipe(...ops) {
		return ops.reduce((s, op) => op(s), this);
	}
};
/**
* Subject - Observable that can be pushed to
*/
var ChannelSubject = class {
	constructor(options = {}) {
		this._subs = /* @__PURE__ */ new Set();
		this._buffer = [];
		this._maxBuffer = options.bufferSize ?? 0;
		this._replay = options.replayOnSubscribe ?? false;
	}
	next(value) {
		if (this._maxBuffer > 0) {
			this._buffer.push(value);
			if (this._buffer.length > this._maxBuffer) this._buffer.shift();
		}
		for (const s of this._subs) try {
			s.next?.(value);
		} catch (e) {
			s.error?.(e);
		}
	}
	error(err) {
		for (const s of this._subs) s.error?.(err);
	}
	complete() {
		for (const s of this._subs) s.complete?.();
		this._subs.clear();
	}
	subscribe(observerOrNext) {
		const obs = typeof observerOrNext === "function" ? { next: observerOrNext } : observerOrNext;
		this._subs.add(obs);
		if (this._replay) for (const v of this._buffer) try {
			obs.next?.(v);
		} catch (e) {
			obs.error?.(e);
		}
		return new BaseSubscription(() => {
			this._subs.delete(obs);
		});
	}
	getValue() {
		return this._buffer.at(-1);
	}
	getBuffer() {
		return [...this._buffer];
	}
	get subscriberCount() {
		return this._subs.size;
	}
};
const filter = (pred) => (src) => new Observable((sub) => {
	const s = src.subscribe({
		next: (v) => pred(v) && sub.next(v),
		error: (e) => sub.error(e),
		complete: () => sub.complete()
	});
	return () => s.unsubscribe();
});
//#endregion
//#region shared/fest/uniform/newer/next/proxy/Invoker.ts
function detectContextType() {
	if (typeof globalThis.Deno !== "undefined") return "deno";
	if (typeof globalThis.process !== "undefined" && globalThis.process?.versions?.node) return "node";
	const serviceWorkerScope = globalThis.ServiceWorkerGlobalScope;
	const sharedWorkerScope = globalThis.SharedWorkerGlobalScope;
	const dedicatedWorkerScope = globalThis.DedicatedWorkerGlobalScope;
	if (serviceWorkerScope && self instanceof serviceWorkerScope) return "service-worker";
	if (sharedWorkerScope && self instanceof sharedWorkerScope) return "shared-worker";
	if (dedicatedWorkerScope && self instanceof dedicatedWorkerScope) return "worker";
	if (typeof chrome !== "undefined" && chrome.runtime?.id) {
		if (typeof chrome.runtime.getBackgroundPage === "function" || (chrome.runtime.getManifest?.()?.background)?.service_worker) return "chrome-background";
		if (typeof chrome.devtools !== "undefined") return "chrome-devtools";
		if (typeof document !== "undefined" && globalThis?.location?.protocol === "chrome-extension:") {
			if ((chrome.extension?.getViews?.({ type: "popup" }) ?? []).includes(globalThis)) return "chrome-popup";
		}
		if (typeof document !== "undefined" && globalThis?.location?.protocol !== "chrome-extension:") return "chrome-content";
	}
	if (typeof globalThis !== "undefined" && typeof document !== "undefined") return "window";
	return "unknown";
}
function detectTransportType(source) {
	if (typeof RTCDataChannel !== "undefined" && source instanceof RTCDataChannel) return "rtc-data";
	const detected = detectTransportType$1(source);
	if (detected && detected !== "internal") return detected;
	if (source === self || source === globalThis || source === "self") return "self";
	return "internal";
}
function detectIncomingContextType(data) {
	if (!data) return "unknown";
	if (data.contextType) return data.contextType;
	const sender = data.sender ?? "";
	if (sender.includes("worker")) return "worker";
	if (sender.includes("sw") || sender.includes("service")) return "service-worker";
	if (sender.includes("chrome") || sender.includes("crx")) return "chrome-content";
	if (sender.includes("background")) return "chrome-background";
	return "unknown";
}
const DefaultReflect = {
	get: (target, prop) => Reflect.get(target, prop),
	set: (target, prop, value) => Reflect.set(target, prop, value),
	has: (target, prop) => Reflect.has(target, prop),
	apply: (target, thisArg, args) => Reflect.apply(target, thisArg, args),
	construct: (target, args) => Reflect.construct(target, args),
	deleteProperty: (target, prop) => Reflect.deleteProperty(target, prop),
	ownKeys: (target) => Reflect.ownKeys(target),
	getOwnPropertyDescriptor: (target, prop) => Reflect.getOwnPropertyDescriptor(target, prop),
	getPrototypeOf: (target) => Reflect.getPrototypeOf(target),
	setPrototypeOf: (target, proto) => Reflect.setPrototypeOf(target, proto),
	isExtensible: (target) => Reflect.isExtensible(target),
	preventExtensions: (target) => Reflect.preventExtensions(target)
};
//#endregion
//#region shared/fest/uniform/newer/next/proxy/Proxy.ts
/**
* Proxy - Unified Remote Proxy Creation
*
* Single source of truth for all proxy-related functionality:
* - Remote object proxies (transparent RPC)
* - Descriptor-based proxies
* - Type-safe proxy creation
* - Expose/listen patterns
*/
/** Symbol to identify proxy objects */
const PROXY_MARKER = Symbol.for("uniform.proxy");
/** Symbol to access proxy internals */
const PROXY_INTERNALS = Symbol.for("uniform.proxy.internals");
/**
* RemoteProxyHandler - Unified proxy handler for remote invocation
*
* Handles all Reflect operations and forwards them to the invoker.
*/
var RemoteProxyHandler = class {
	constructor(_invoker, config) {
		this._invoker = _invoker;
		this._childCache = /* @__PURE__ */ new Map();
		this._config = {
			channel: config.channel,
			basePath: config.basePath ?? [],
			invoker: _invoker,
			cache: config.cache ?? true,
			timeout: config.timeout ?? 3e4
		};
	}
	/** Get property - returns nested proxy or invokes GET */
	get(target, prop, receiver) {
		const propStr = String(prop);
		if (prop === PROXY_MARKER) return true;
		if (prop === PROXY_INTERNALS) return this._config;
		if (prop === $requestHandler) return true;
		if (prop === $descriptor) return this._getDescriptor();
		if (prop === "then" || prop === "catch" || prop === "finally") return void 0;
		if (typeof prop === "symbol") return void 0;
		if (prop === "$path") return this._config.basePath;
		if (prop === "$channel") return this._config.channel;
		if (prop === "$descriptor") return this._getDescriptor();
		if (prop === "$invoke") return this._invoker;
		const childPath = [...this._config.basePath, propStr];
		if (this._config.cache && this._childCache.has(propStr)) return this._childCache.get(propStr);
		const childProxy = createRemoteProxy(this._invoker, {
			...this._config,
			basePath: childPath
		});
		if (this._config.cache) this._childCache.set(propStr, childProxy);
		return childProxy;
	}
	/** Set property */
	set(target, prop, value, receiver) {
		if (typeof prop === "symbol") return true;
		this._invoker(WReflectAction.SET, [...this._config.basePath, String(prop)], [value]);
		return true;
	}
	/** Apply function */
	apply(target, thisArg, args) {
		return this._invoker(WReflectAction.APPLY, this._config.basePath, [args]);
	}
	/** Construct new instance */
	construct(target, args, newTarget) {
		return this._invoker(WReflectAction.CONSTRUCT, this._config.basePath, [args]);
	}
	/** Check if property exists */
	has(target, prop) {
		if (typeof prop === "symbol") return false;
		return this._invoker(WReflectAction.HAS, this._config.basePath, [prop]);
	}
	/** Delete property */
	deleteProperty(target, prop) {
		if (typeof prop === "symbol") return true;
		return this._invoker(WReflectAction.DELETE_PROPERTY, [...this._config.basePath, String(prop)], []);
	}
	/** Get own keys */
	ownKeys(target) {
		return [];
	}
	/** Get property descriptor */
	getOwnPropertyDescriptor(target, prop) {
		return {
			configurable: true,
			enumerable: true,
			writable: true
		};
	}
	/** Get prototype */
	getPrototypeOf(target) {
		return Function.prototype;
	}
	/** Set prototype */
	setPrototypeOf(target, proto) {
		return this._invoker(WReflectAction.SET_PROTOTYPE_OF, this._config.basePath, [proto]);
	}
	/** Check if extensible */
	isExtensible(target) {
		return true;
	}
	/** Prevent extensions */
	preventExtensions(target) {
		return this._invoker(WReflectAction.PREVENT_EXTENSIONS, this._config.basePath, []);
	}
	/** Get descriptor for this proxy */
	_getDescriptor() {
		return {
			path: this._config.basePath,
			channel: this._config.channel,
			primitive: false
		};
	}
};
/**
* Create a remote proxy for transparent RPC
*
* @param invoker - Function to invoke remote operations
* @param config - Proxy configuration
* @returns Proxy object that forwards all operations to remote
*
* @example
* const proxy = createRemoteProxy(
*     (action, path, args) => channel.invoke(targetChannel, action, path, args),
*     { channel: "worker" }
* );
*
* // All operations are forwarded
* await proxy.math.add(1, 2);
* await proxy.user.name;
* proxy.config.debug = true;
*/
function createRemoteProxy(invoker, config) {
	const fn = function() {};
	const handler = new RemoteProxyHandler(invoker, config);
	return new Proxy(fn, handler);
}
/**
* Create proxy from descriptor
*
* Wraps a WReflectDescriptor into a usable proxy object.
*
* @param descriptor - Remote object descriptor
* @param invoker - Function to invoke remote operations
* @param targetChannel - Override channel from descriptor
*/
function wrapDescriptor(descriptor, invoker, targetChannel) {
	if (!descriptor || typeof descriptor !== "object") return descriptor;
	if (descriptor.primitive) return descriptor;
	const cached = descMap.get(descriptor);
	if (cached) return cached;
	const proxy = createRemoteProxy(invoker, {
		channel: targetChannel ?? descriptor.channel ?? "unknown",
		basePath: descriptor.path ?? []
	});
	descMap.set(descriptor, proxy);
	wrapMap.set(proxy, descriptor);
	return proxy;
}
/** @deprecated Use wrapDescriptor */
const makeRequestProxy = wrapDescriptor;
//#endregion
//#region shared/fest/uniform/newer/next/channel/internal/ConnectionModel.ts
function createConnectionKey(params) {
	return [
		params.localChannel,
		params.remoteChannel,
		params.sender,
		params.transportType,
		params.direction
	].join("::");
}
function queryConnections(connections, query = {}) {
	const includeClosed = query.includeClosed ?? false;
	const desiredStatus = query.status ?? (includeClosed ? void 0 : "active");
	return [...connections].filter((connection) => {
		if (desiredStatus && connection.status !== desiredStatus) return false;
		if (query.channel && connection.localChannel !== query.channel && connection.remoteChannel !== query.channel) return false;
		if (query.localChannel && connection.localChannel !== query.localChannel) return false;
		if (query.remoteChannel && connection.remoteChannel !== query.remoteChannel) return false;
		if (query.sender && connection.sender !== query.sender) return false;
		if (query.transportType && connection.transportType !== query.transportType) return false;
		if (query.direction && connection.direction !== query.direction) return false;
		return true;
	}).sort((a, b) => b.updatedAt - a.updatedAt);
}
var ConnectionRegistry = class {
	constructor(_createId, _emitEvent) {
		this._createId = _createId;
		this._emitEvent = _emitEvent;
		this._connections = /* @__PURE__ */ new Map();
	}
	register(params) {
		const key = createConnectionKey(params);
		const now = Date.now();
		const existing = this._connections.get(key);
		if (existing) {
			existing.updatedAt = now;
			existing.status = "active";
			existing.metadata = {
				...existing.metadata,
				...params.metadata
			};
			return existing;
		}
		const connection = {
			id: this._createId(),
			localChannel: params.localChannel,
			remoteChannel: params.remoteChannel,
			sender: params.sender,
			transportType: params.transportType,
			direction: params.direction,
			status: "active",
			createdAt: now,
			updatedAt: now,
			metadata: params.metadata
		};
		this._connections.set(key, connection);
		this._emitEvent?.({
			type: "connected",
			connection,
			timestamp: now
		});
		return connection;
	}
	markNotified(connection, payload) {
		const now = Date.now();
		connection.lastNotifyAt = now;
		connection.updatedAt = now;
		this._emitEvent?.({
			type: "notified",
			connection,
			timestamp: now,
			payload
		});
	}
	closeByChannel(channel) {
		const now = Date.now();
		for (const connection of this._connections.values()) {
			if (connection.localChannel !== channel && connection.remoteChannel !== channel) continue;
			if (connection.status === "closed") continue;
			connection.status = "closed";
			connection.updatedAt = now;
			this._emitEvent?.({
				type: "disconnected",
				connection,
				timestamp: now
			});
		}
	}
	closeAll() {
		const now = Date.now();
		for (const connection of this._connections.values()) {
			if (connection.status === "closed") continue;
			connection.status = "closed";
			connection.updatedAt = now;
			this._emitEvent?.({
				type: "disconnected",
				connection,
				timestamp: now
			});
		}
	}
	query(query = {}) {
		return queryConnections(this._connections.values(), query);
	}
	values() {
		return [...this._connections.values()];
	}
	clear() {
		this._connections.clear();
	}
};
//#endregion
//#region shared/fest/uniform/newer/next/channel/UnifiedChannel.ts
/**
* Unified Channel System
*
* Merges and unifies:
* - RequestProxy (proxy creation and dispatch)
* - Invoker (Requestor/Responder abstraction)
* - ChannelContext (multi-channel management)
* - ObservableChannels (Observable-based messaging)
*
* Single entry point for all channel communication patterns:
* - `createChannel()` - Create a unified channel
* - `channel.expose()` - Expose objects for remote invocation
* - `channel.import()` - Import remote modules
* - `channel.proxy()` - Create transparent proxy to remote
* - `channel.connect()` - Connect to transport
*/
/**
* UnifiedChannel - Single entry point for all channel communication
*
* Combines:
* - Requestor functionality (invoke remote methods)
* - Responder functionality (handle incoming requests)
* - Proxy creation (transparent remote access)
* - Observable messaging (subscribe/next pattern)
* - Multi-transport support (Worker, Port, Broadcast, WebSocket, Chrome)
*/
var UnifiedChannel = class {
	__getPrivate(key) {
		return this[key];
	}
	__setPrivate(key, value) {
		this[key] = value;
	}
	constructor(config) {
		this._transports = /* @__PURE__ */ new Map();
		this._defaultTransport = null;
		this._connectionEvents = new ChannelSubject({ bufferSize: 200 });
		this._connectionRegistry = new ConnectionRegistry(() => UUIDv4(), (event) => this._connectionEvents.next(event));
		this._pending = /* @__PURE__ */ new Map();
		this._subscriptions = [];
		this._inbound = new ChannelSubject({ bufferSize: 100 });
		this._outbound = new ChannelSubject({ bufferSize: 100 });
		this._invocations = new ChannelSubject({ bufferSize: 100 });
		this._responses = new ChannelSubject({ bufferSize: 100 });
		this._exposed = /* @__PURE__ */ new Map();
		this._proxyCache = /* @__PURE__ */ new WeakMap();
		const cfg = typeof config === "string" ? { name: config } : config;
		this._name = cfg.name;
		this._contextType = cfg.autoDetect !== false ? detectContextType() : "unknown";
		this._config = {
			name: cfg.name,
			autoDetect: cfg.autoDetect ?? true,
			timeout: cfg.timeout ?? 3e4,
			reflect: cfg.reflect ?? DefaultReflect,
			bufferSize: cfg.bufferSize ?? 100,
			autoListen: cfg.autoListen ?? true
		};
		if (this._config.autoListen && this._isWorkerContext()) this.listen(self);
	}
	/**
	* Connect to a transport for sending requests
	*
	* @param target - Worker, MessagePort, BroadcastChannel, WebSocket, or string identifier
	* @param options - Connection options
	*/
	connect(target, options = {}) {
		const transportType = detectTransportType(target);
		const targetChannel = options.targetChannel ?? this._inferTargetChannel(target, transportType);
		const binding = this._createTransportBinding(target, transportType, targetChannel, options);
		this._transports.set(targetChannel, binding);
		if (!this._defaultTransport) this._defaultTransport = binding;
		const connection = this._registerConnection({
			localChannel: this._name,
			remoteChannel: targetChannel,
			sender: this._name,
			transportType,
			direction: "outgoing",
			metadata: { phase: "connect" }
		});
		this._emitConnectionSignal(binding, "connect", {
			connectionId: connection.id,
			from: this._name,
			to: targetChannel
		});
		return this;
	}
	/**
	* Listen on a transport for incoming requests
	*
	* @param source - Transport source to listen on
	* @param options - Connection options
	*/
	listen(source, options = {}) {
		const transportType = detectTransportType(source);
		const sourceChannel = options.targetChannel ?? this._inferTargetChannel(source, transportType);
		const handler = (data) => this._handleIncoming(data);
		const connection = this._registerConnection({
			localChannel: this._name,
			remoteChannel: sourceChannel,
			sender: sourceChannel,
			transportType,
			direction: "incoming",
			metadata: { phase: "listen" }
		});
		switch (transportType) {
			case "worker":
			case "message-port":
			case "broadcast":
				if (options.autoStart !== false && source.start) source.start();
				source.addEventListener?.("message", ((e) => handler(e.data)));
				break;
			case "websocket":
				source.addEventListener?.("message", ((e) => {
					try {
						handler(JSON.parse(e.data));
					} catch {}
				}));
				break;
			case "chrome-runtime":
				chrome.runtime.onMessage?.addListener?.((msg, sender, sendResponse) => {
					handler(msg);
					return true;
				});
				break;
			case "chrome-tabs":
				chrome.runtime.onMessage?.addListener?.((msg, sender) => {
					if (options.tabId != null && sender?.tab?.id !== options.tabId) return false;
					handler(msg);
					return true;
				});
				break;
			case "chrome-port":
				source?.onMessage?.addListener?.((msg) => {
					handler(msg);
				});
				break;
			case "chrome-external":
				chrome.runtime.onMessageExternal?.addListener?.((msg) => {
					handler(msg);
					return true;
				});
				break;
			case "self":
				addEventListener?.("message", ((e) => handler(e.data)));
				break;
			default: if (options.onMessage) options.onMessage(handler);
		}
		this._sendSignalToTarget(source, transportType, {
			connectionId: connection.id,
			from: this._name,
			to: sourceChannel,
			tabId: options.tabId,
			externalId: options.externalId
		}, "notify");
		return this;
	}
	/**
	* Connect and listen on the same transport (bidirectional)
	*/
	attach(target, options = {}) {
		return this.connect(target, options);
	}
	/**
	* Expose an object for remote invocation
	*
	* @param name - Path name for the exposed object
	* @param obj - Object to expose
	*/
	expose(name, obj) {
		const path = [name];
		writeByPath(path, obj);
		this._exposed.set(name, {
			name,
			obj,
			path
		});
		return this;
	}
	/**
	* Expose multiple objects at once
	*/
	exposeAll(entries) {
		for (const [name, obj] of Object.entries(entries)) this.expose(name, obj);
		return this;
	}
	/**
	* Import a module from a remote channel
	*
	* @param url - Module URL to import
	* @param targetChannel - Target channel (defaults to first connected)
	*/
	async import(url, targetChannel) {
		return this.invoke(targetChannel ?? this._getDefaultTarget(), WReflectAction.IMPORT, [], [url]);
	}
	/**
	* Invoke a method on a remote object
	*
	* @param targetChannel - Target channel name
	* @param action - Reflect action
	* @param path - Object path
	* @param args - Arguments
	*/
	invoke(targetChannel, action, path, args = []) {
		const id = UUIDv4();
		const resolvers = Promise.withResolvers();
		this._pending.set(id, resolvers);
		const timeout = setTimeout(() => {
			if (this._pending.has(id)) {
				this._pending.delete(id);
				resolvers.reject(/* @__PURE__ */ new Error(`Request timeout: ${action} on ${path.join(".")}`));
			}
		}, this._config.timeout);
		const message = {
			id,
			channel: targetChannel,
			sender: this._name,
			type: "request",
			payload: {
				channel: targetChannel,
				sender: this._name,
				action,
				path,
				args
			},
			timestamp: Date.now()
		};
		this._send(targetChannel, message);
		this._outbound.next(message);
		return resolvers.promise.finally(() => clearTimeout(timeout));
	}
	/**
	* Get property from remote object
	*/
	get(targetChannel, path, prop) {
		return this.invoke(targetChannel, WReflectAction.GET, path, [prop]);
	}
	/**
	* Set property on remote object
	*/
	set(targetChannel, path, prop, value) {
		return this.invoke(targetChannel, WReflectAction.SET, path, [prop, value]);
	}
	/**
	* Call method on remote object
	*/
	call(targetChannel, path, args = []) {
		return this.invoke(targetChannel, WReflectAction.APPLY, path, [args]);
	}
	/**
	* Construct new instance on remote
	*/
	construct(targetChannel, path, args = []) {
		return this.invoke(targetChannel, WReflectAction.CONSTRUCT, path, [args]);
	}
	/**
	* Create a transparent proxy to a remote channel
	*
	* All operations on the proxy are forwarded to the remote.
	*
	* @param targetChannel - Target channel name
	* @param basePath - Base path for the proxy
	*/
	proxy(targetChannel, basePath = []) {
		const target = targetChannel ?? this._getDefaultTarget();
		return this._createProxy(target, basePath);
	}
	/**
	* Create proxy for a specific exposed module on remote
	*
	* @param moduleName - Name of the exposed module
	* @param targetChannel - Target channel
	*/
	remote(moduleName, targetChannel) {
		return this.proxy(targetChannel, [moduleName]);
	}
	/**
	* Wrap a descriptor as a proxy
	*/
	wrapDescriptor(descriptor, targetChannel) {
		const invoker = (action, path, args) => {
			const channel = targetChannel ?? descriptor?.channel ?? this._getDefaultTarget();
			return this.invoke(channel, action, path, args);
		};
		return wrapDescriptor(descriptor, invoker, targetChannel ?? descriptor?.channel ?? this._getDefaultTarget());
	}
	/**
	* Subscribe to incoming messages
	*/
	subscribe(handler) {
		return this._inbound.subscribe(handler);
	}
	/**
	* Send a message (fire-and-forget)
	*/
	next(message) {
		this._send(message.channel, message);
		this._outbound.next(message);
	}
	/**
	* Emit an event to a channel
	*/
	emit(targetChannel, eventType, data) {
		const message = {
			id: UUIDv4(),
			channel: targetChannel,
			sender: this._name,
			type: "event",
			payload: {
				type: eventType,
				data
			},
			timestamp: Date.now()
		};
		this.next(message);
	}
	/**
	* Emit connection-level signal to a specific connected channel.
	* This is the canonical notify/connect API for facade layers.
	*/
	notify(targetChannel, payload = {}, type = "notify") {
		const binding = this._transports.get(targetChannel);
		if (!binding) return false;
		this._emitConnectionSignal(binding, type, {
			from: this._name,
			to: targetChannel,
			...payload
		});
		return true;
	}
	/** Observable: Incoming messages */
	get onMessage() {
		return this._inbound;
	}
	/** Observable: Outgoing messages */
	get onOutbound() {
		return this._outbound;
	}
	/** Observable: Incoming invocations */
	get onInvocation() {
		return this._invocations;
	}
	/** Observable: Outgoing responses */
	get onResponse() {
		return this._responses;
	}
	/** Observable: Connection events (connected/notified/disconnected) */
	get onConnection() {
		return this._connectionEvents;
	}
	subscribeConnections(handler) {
		return this._connectionEvents.subscribe(handler);
	}
	queryConnections(query = {}) {
		return this._connectionRegistry.query(query);
	}
	notifyConnections(payload = {}, query = {}) {
		let sent = 0;
		const targets = this.queryConnections({
			...query,
			status: "active",
			includeClosed: false
		});
		for (const connection of targets) {
			const binding = this._transports.get(connection.remoteChannel);
			if (!binding) continue;
			this._emitConnectionSignal(binding, "notify", {
				connectionId: connection.id,
				from: this._name,
				to: connection.remoteChannel,
				...payload
			});
			sent++;
		}
		return sent;
	}
	/** Channel name */
	get name() {
		return this._name;
	}
	/** Detected context type */
	get contextType() {
		return this._contextType;
	}
	/** Configuration */
	get config() {
		return this._config;
	}
	/** Connected transport names */
	get connectedChannels() {
		return [...this._transports.keys()];
	}
	/** Exposed module names */
	get exposedModules() {
		return [...this._exposed.keys()];
	}
	/**
	* Close all connections and cleanup
	*/
	close() {
		this._subscriptions.forEach((s) => s.unsubscribe());
		this._subscriptions = [];
		this._pending.clear();
		this._markAllConnectionsClosed();
		for (const binding of this._transports.values()) {
			try {
				binding.cleanup?.();
			} catch {}
			if (binding.transportType === "message-port" || binding.transportType === "broadcast") try {
				binding.target?.close?.();
			} catch {}
		}
		this._transports.clear();
		this._defaultTransport = null;
		this._connectionRegistry.clear();
		this._inbound.complete();
		this._outbound.complete();
		this._invocations.complete();
		this._responses.complete();
		this._connectionEvents.complete();
	}
	_handleIncoming(data) {
		if (!data || typeof data !== "object") return;
		this._inbound.next(data);
		switch (data.type) {
			case "request":
				if (data.channel === this._name) this._handleRequest(data);
				break;
			case "response":
				this._handleResponse(data);
				break;
			case "event": break;
			case "signal":
				this._handleSignal(data);
				break;
		}
	}
	_handleResponse(data) {
		const id = data.reqId ?? data.id;
		const resolvers = this._pending.get(id);
		if (resolvers) {
			this._pending.delete(id);
			if (data.payload?.error) resolvers.reject(new Error(data.payload.error));
			else {
				const result = data.payload?.result;
				const descriptor = data.payload?.descriptor;
				if (result !== null && result !== void 0) resolvers.resolve(result);
				else if (descriptor) resolvers.resolve(this.wrapDescriptor(descriptor, data.sender));
				else resolvers.resolve(void 0);
			}
			this._responses.next({
				id,
				channel: data.channel,
				sender: data.sender,
				result: data.payload?.result,
				descriptor: data.payload?.descriptor,
				timestamp: Date.now()
			});
		}
	}
	async _handleRequest(data) {
		const payload = data.payload;
		if (!payload) return;
		const { action, path, args, sender } = payload;
		const reqId = data.reqId ?? data.id;
		this._invocations.next({
			id: reqId,
			channel: this._name,
			sender,
			action,
			path,
			args: args ?? [],
			timestamp: Date.now(),
			contextType: detectIncomingContextType(data)
		});
		const { result, toTransfer, newPath } = await this._executeAction(action, path, args ?? [], sender);
		await this._sendResponse(reqId, action, sender, newPath, result, toTransfer);
	}
	async _executeAction(action, path, args, sender) {
		const { result, toTransfer, path: newPath } = executeAction(action, path, args, {
			channel: this._name,
			sender,
			reflect: this._config.reflect
		});
		return {
			result: await result,
			toTransfer,
			newPath
		};
	}
	async _sendResponse(reqId, action, sender, path, rawResult, toTransfer) {
		const { response: coreResponse, transfer } = await buildResponse(reqId, action, this._name, sender, path, rawResult, toTransfer);
		const response = {
			id: reqId,
			...coreResponse,
			timestamp: Date.now(),
			transferable: transfer
		};
		this._send(sender, response, transfer);
	}
	_handleSignal(data) {
		const payload = data?.payload ?? {};
		const remoteChannel = payload.from ?? data.sender ?? "unknown";
		const transportType = data.transportType ?? this._transports.get(data.channel)?.transportType ?? "internal";
		const connection = this._registerConnection({
			localChannel: this._name,
			remoteChannel,
			sender: data.sender ?? remoteChannel,
			transportType,
			direction: "incoming"
		});
		this._markConnectionNotified(connection, payload);
	}
	_registerConnection(params) {
		return this._connectionRegistry.register(params);
	}
	_markConnectionNotified(connection, payload) {
		this._connectionRegistry.markNotified(connection, payload);
	}
	_emitConnectionSignal(binding, signalType, payload = {}) {
		const message = {
			id: UUIDv4(),
			type: "signal",
			channel: binding.targetChannel,
			sender: this._name,
			transportType: binding.transportType,
			payload: {
				type: signalType,
				from: this._name,
				to: binding.targetChannel,
				...payload
			},
			timestamp: Date.now()
		};
		(binding?.sender ?? binding?.postMessage)?.call(binding, message);
		const connection = this._registerConnection({
			localChannel: this._name,
			remoteChannel: binding.targetChannel,
			sender: this._name,
			transportType: binding.transportType,
			direction: "outgoing"
		});
		this._markConnectionNotified(connection, message.payload);
	}
	_sendSignalToTarget(target, transportType, payload, signalType) {
		const message = {
			id: UUIDv4(),
			type: "signal",
			channel: payload.to ?? this._name,
			sender: this._name,
			transportType,
			payload: {
				type: signalType,
				...payload
			},
			timestamp: Date.now()
		};
		try {
			if (transportType === "websocket") {
				target?.send?.(JSON.stringify(message));
				return;
			}
			if (transportType === "chrome-runtime") {
				chrome.runtime?.sendMessage?.(message);
				return;
			}
			if (transportType === "chrome-tabs") {
				const tabId = payload.tabId;
				if (tabId != null) chrome.tabs?.sendMessage?.(tabId, message);
				return;
			}
			if (transportType === "chrome-port") {
				target?.postMessage?.(message);
				return;
			}
			if (transportType === "chrome-external") {
				if (payload.externalId) chrome.runtime?.sendMessage?.(payload.externalId, message);
				return;
			}
			target?.postMessage?.(message, { transfer: [] });
		} catch {}
	}
	_markAllConnectionsClosed() {
		this._connectionRegistry.closeAll();
	}
	_createTransportBinding(target, transportType, targetChannel, options) {
		let sender;
		let cleanup;
		switch (transportType) {
			case "worker":
			case "message-port":
			case "broadcast":
				if (options.autoStart !== false && target.start) target.start();
				sender = (msg, transfer) => target.postMessage(msg, { transfer });
				{
					const listener = ((e) => this._handleIncoming(e.data));
					target.addEventListener?.("message", listener);
					cleanup = () => target.removeEventListener?.("message", listener);
				}
				break;
			case "websocket":
				sender = (msg) => target.send(JSON.stringify(msg));
				{
					const listener = ((e) => {
						try {
							this._handleIncoming(JSON.parse(e.data));
						} catch {}
					});
					target.addEventListener?.("message", listener);
					cleanup = () => target.removeEventListener?.("message", listener);
				}
				break;
			case "chrome-runtime":
				sender = (msg) => chrome.runtime.sendMessage(msg);
				{
					const listener = (msg) => this._handleIncoming(msg);
					chrome.runtime.onMessage?.addListener?.(listener);
					cleanup = () => chrome.runtime.onMessage?.removeListener?.(listener);
				}
				break;
			case "chrome-tabs":
				sender = (msg) => {
					if (options.tabId != null) chrome.tabs?.sendMessage?.(options.tabId, msg);
				};
				{
					const listener = (msg, senderMeta) => {
						if (options.tabId != null && senderMeta?.tab?.id !== options.tabId) return false;
						this._handleIncoming(msg);
						return true;
					};
					chrome.runtime.onMessage?.addListener?.(listener);
					cleanup = () => chrome.runtime.onMessage?.removeListener?.(listener);
				}
				break;
			case "chrome-port":
				if (target?.postMessage && target?.onMessage?.addListener) {
					sender = (msg) => target.postMessage(msg);
					const listener = (msg) => this._handleIncoming(msg);
					target.onMessage.addListener(listener);
					cleanup = () => {
						try {
							target.onMessage.removeListener(listener);
						} catch {}
						try {
							target.disconnect?.();
						} catch {}
					};
				} else {
					const portName = options.portName ?? targetChannel;
					const port = options.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(options.tabId, { name: portName }) : chrome.runtime.connect({ name: portName });
					sender = (msg) => port.postMessage(msg);
					const listener = (msg) => this._handleIncoming(msg);
					port.onMessage.addListener(listener);
					cleanup = () => {
						try {
							port.onMessage.removeListener(listener);
						} catch {}
						try {
							port.disconnect();
						} catch {}
					};
				}
				break;
			case "chrome-external":
				sender = (msg) => {
					if (options.externalId) chrome.runtime.sendMessage(options.externalId, msg);
				};
				{
					const listener = (msg) => {
						this._handleIncoming(msg);
						return true;
					};
					chrome.runtime.onMessageExternal?.addListener?.(listener);
					cleanup = () => chrome.runtime.onMessageExternal?.removeListener?.(listener);
				}
				break;
			case "self":
				sender = (msg, transfer) => globalThis.postMessage?.(msg, { transfer: transfer ?? [] });
				{
					const listener = ((e) => this._handleIncoming(e.data));
					globalThis.addEventListener?.("message", listener);
					cleanup = () => globalThis.removeEventListener?.("message", listener);
				}
				break;
			default:
				if (options.onMessage) cleanup = options.onMessage((msg) => this._handleIncoming(msg));
				sender = (msg) => target?.postMessage?.(msg);
		}
		return {
			target,
			targetChannel,
			transportType,
			sender,
			cleanup,
			postMessage: (message, options) => sender?.(message, options),
			start: () => target?.start?.(),
			close: () => target?.close?.()
		};
	}
	_send(targetChannel, message, transfer) {
		const binding = this._transports.get(targetChannel) ?? this._defaultTransport;
		(binding?.sender ?? binding?.postMessage)?.call(binding, message, transfer);
	}
	_getDefaultTarget() {
		if (this._defaultTransport) return this._defaultTransport.targetChannel;
		return "worker";
	}
	_inferTargetChannel(target, transportType) {
		if (transportType === "worker") return "worker";
		if (transportType === "broadcast" && target.name) return target.name;
		if (transportType === "self") return "self";
		return `${transportType}-${UUIDv4().slice(0, 8)}`;
	}
	_createProxy(targetChannel, basePath) {
		const invoker = (action, path, args) => {
			return this.invoke(targetChannel, action, path, args);
		};
		return createRemoteProxy(invoker, {
			channel: targetChannel,
			basePath,
			cache: true,
			timeout: this._config.timeout
		});
	}
	_isWorkerContext() {
		return [
			"worker",
			"shared-worker",
			"service-worker"
		].includes(this._contextType);
	}
};
/**
* Create a unified channel
*
* @example
* // In worker
* const channel = createUnifiedChannel("worker");
* channel.expose("calc", { add: (a, b) => a + b });
*
* // In host
* const channel = createUnifiedChannel("host");
* channel.connect(worker);
* const calc = channel.proxy("worker", ["calc"]);
* await calc.add(2, 3); // 5
*/
function createUnifiedChannel(config) {
	return new UnifiedChannel(config);
}
let WORKER_CHANNEL = null;
/**
* Get the worker's unified channel (auto-created in worker context)
*/
function getWorkerChannel() {
	if (!WORKER_CHANNEL) {
		const contextType = detectContextType();
		if ([
			"worker",
			"shared-worker",
			"service-worker"
		].includes(contextType)) WORKER_CHANNEL = createUnifiedChannel({
			name: "worker",
			autoListen: true
		});
		else WORKER_CHANNEL = createUnifiedChannel({
			name: "host",
			autoListen: false
		});
	}
	return WORKER_CHANNEL;
}
//#endregion
//#region shared/fest/uniform/newer/core/Alias.ts
const TS = {
	rjb: "rejectBy",
	rvb: "resolveBy",
	rj: "reject",
	rv: "resolve",
	cr: "create",
	cs: "createSync",
	a: "array",
	ta: "typedarray",
	udf: "undefined"
};
[
	typeof ArrayBuffer != TS.udf ? ArrayBuffer : null,
	typeof MessagePort != TS.udf ? MessagePort : null,
	typeof ReadableStream != TS.udf ? ReadableStream : null,
	typeof WritableStream != TS.udf ? WritableStream : null,
	typeof TransformStream != TS.udf ? TransformStream : null,
	typeof WebTransportReceiveStream != TS.udf ? WebTransportReceiveStream : null,
	typeof WebTransportSendStream != TS.udf ? WebTransportSendStream : null,
	typeof AudioData != TS.udf ? AudioData : null,
	typeof ImageBitmap != TS.udf ? ImageBitmap : null,
	typeof VideoFrame != TS.udf ? VideoFrame : null,
	typeof OffscreenCanvas != TS.udf ? OffscreenCanvas : null,
	typeof RTCDataChannel != TS.udf ? RTCDataChannel : null
].filter((E) => E != null);
//#endregion
//#region shared/fest/uniform/newer/next/channel/Channels.ts
const SELF_CHANNEL = {
	name: "unknown",
	instance: null
};
const CHANNEL_MAP = /* @__PURE__ */ new Map();
const isReflectAction$1 = (action) => [...Object.values(WReflectAction)].includes(action);
/** @deprecated Use UnifiedChannel.remote() instead */
var RemoteChannelHelper$1 = class {
	constructor(channelName, options = {}) {
		this.channelName = channelName;
		this.options = options;
		this._channel = getWorkerChannel();
	}
	request(path, action, args, options = {}) {
		if (typeof path === "string") path = [path];
		if (Array.isArray(action) && isReflectAction$1(path)) {
			options = args;
			args = action;
			action = path;
			path = [];
		}
		return this._channel.invoke(this.channelName, action, path, args);
	}
	doImportModule(url, options) {
		return this._channel.import(url, this.channelName);
	}
};
/** @deprecated Use UnifiedChannel instead */
var ChannelHandler$1 = class {
	constructor(channel, options = {}) {
		this.channel = channel;
		this.options = options;
		this.broadcasts = {};
		this._unified = createUnifiedChannel({
			name: channel,
			autoListen: false
		});
		SELF_CHANNEL.name = channel;
		SELF_CHANNEL.instance = this;
	}
	createRemoteChannel(channel, options = {}, broadcast) {
		if (broadcast) {
			this._unified.attach(broadcast, { targetChannel: channel });
			this.broadcasts[channel] = broadcast;
		}
		return Promise.resolve(new RemoteChannelHelper$1(channel, options));
	}
	getChannel() {
		return this.channel;
	}
	request(path, action, args, options = {}, toChannel = "worker") {
		if (typeof path === "string") path = [path];
		if (Array.isArray(action) && isReflectAction$1(path)) {
			toChannel = options;
			options = args;
			args = action;
			action = path;
			path = [];
		}
		return this._unified.invoke(toChannel, action, path, args);
	}
	resolveResponse(reqId, result) {
		return Promise.resolve(result);
	}
	async handleAndResponse(request, reqId, responseFn) {
		const result = await handleRequest(request, reqId, this.channel);
		if (!result) return;
		responseFn?.(result.response, result.transfer);
	}
	close() {
		this._unified.close();
	}
};
/** @deprecated Use createUnifiedChannel instead */
const initChannelHandler = (channel = "$host$") => {
	if (SELF_CHANNEL?.instance && channel === "$host$") return SELF_CHANNEL.instance;
	if (CHANNEL_MAP.has(channel)) return CHANNEL_MAP.get(channel) ?? null;
	const $channel = new ChannelHandler$1(channel);
	if (channel === "$host$") {
		SELF_CHANNEL.name = channel;
		SELF_CHANNEL.instance = $channel;
	}
	CHANNEL_MAP.set(channel, $channel);
	return $channel;
};
//#endregion
//#region shared/fest/uniform/newer/next/storage/DataBase.ts
const handMap = /* @__PURE__ */ new WeakMap();
const wrapMap = /* @__PURE__ */ new WeakMap();
const descMap = /* @__PURE__ */ new WeakMap();
const objectToRef = (obj, channel = SELF_CHANNEL?.name, toTransfer) => {
	if (typeof obj == "object" && obj != null || typeof obj == "function" && obj != null) {
		if (wrapMap.has(obj)) return wrapMap.get(obj);
		if (handMap.has(obj)) return handMap.get(obj);
		if (isNotComplexArray(obj)) return obj;
		if (toTransfer?.includes?.(obj)) return obj;
		if (channel == SELF_CHANNEL?.name) return obj;
		return {
			$isDescriptor: true,
			path: registeredInPath.get(obj) ?? (() => {
				const path = [UUIDv4()];
				writeByPath(path, obj);
				return path;
			})(),
			owner: SELF_CHANNEL?.name,
			channel,
			primitive: isPrimitive(obj),
			writable: true,
			enumerable: true,
			configurable: true,
			argumentCount: obj instanceof Function ? obj.length : -1
		};
	}
	return isCanJustReturn(obj) ? obj : null;
};
const $requestHandler = Symbol.for("@requestHandler");
const $descriptor = Symbol.for("@descriptor");
const normalizeRef = (v) => {
	if (isCanJustReturn(v)) return v;
	if (v?.[$descriptor]) return v;
	if (v?.$isDescriptor) return makeRequestProxy(v, async () => void 0);
	if (isNotComplexArray(v)) return v;
	return null;
};
const storedData = /* @__PURE__ */ new Map();
const registeredInPath = /* @__PURE__ */ new WeakMap();
const traverseByPath = (obj, path) => {
	if (path != null && !Array.isArray(path)) path = [path];
	if (path == null || path?.length < 1) return obj;
	const $desc = obj?.[$descriptor] ?? (obj?.$isDescriptor ? obj : null);
	if ($desc && $desc?.owner == SELF_CHANNEL?.name) obj = readByPath($desc?.path) ?? obj;
	if (isPrimitive(obj)) return obj;
	for (const key of path) {
		obj = obj?.[key];
		if (obj == null) return obj;
	}
	return obj;
};
const readByPath = (path) => {
	if (path != null && !Array.isArray(path)) path = [path];
	if (path == null || path?.length < 1) return null;
	const root = storedData?.get?.(path?.[0]) ?? null;
	return root != null ? traverseByPath(root, path?.slice?.(1)) : null;
};
const writeByPath = (path, data) => {
	const $desc = data?.[$descriptor] ?? (data?.$isDescriptor ? data : null);
	if ($desc && $desc?.owner == SELF_CHANNEL?.name) data = readByPath($desc?.path) ?? data;
	if (path != null && !Array.isArray(path)) path = [path];
	if (path == null || path?.length < 1) return null;
	const root = storedData?.get?.(path?.[0]) ?? null;
	if (path?.length > 1) traverseByPath(root, path?.slice?.(1, -1))[path?.[path?.length - 1]] = data;
	else storedData?.set?.(path?.[0], data);
	if (typeof data == "object" || typeof data == "function") registeredInPath?.set?.(data, path);
	return data;
};
const removeByPath = (path) => {
	if (path != null && !Array.isArray(path)) path = [path];
	if (path == null || path?.length < 1) return false;
	const root = storedData?.get?.(path?.[0]) ?? null;
	if (!root && path?.length <= 1) {
		storedData?.delete?.(path?.[0]);
		return true;
	} else return false;
	delete traverseByPath(root, path?.slice?.(1, -1))[path?.[path?.length - 1]];
	if ((typeof root == "object" || typeof root == "function") && path?.length <= 1) registeredInPath?.delete?.(root);
	return true;
};
const removeByData = (data) => {
	const $desc = data?.[$descriptor] ?? (data?.$isDescriptor ? data : null);
	if ($desc && $desc?.owner == SELF_CHANNEL?.name) data = readByPath($desc?.path) ?? data;
	const path = registeredInPath?.get?.(data) ?? $desc?.path;
	if (path == null || path?.length < 1) return false;
	removeByPath(path);
	if (typeof data == "object" || typeof data == "function") registeredInPath?.delete?.(data);
	return true;
};
const hasNoPath = (data) => {
	const $desc = data?.[$descriptor] ?? (data?.$isDescriptor ? data : null);
	return (registeredInPath?.get?.(data) ?? $desc?.path) == null;
};
//#endregion
//#region shared/fest/uniform/newer/core/RequestHandler.ts
/**
* Request Handler Core - Unified Reflect Action Handling
*
* Single source of truth for all action execution:
* - UnifiedChannel, ChannelContext, Proxy module
* - Supports both DataBase-backed and direct object targets
* - Supports custom Reflect implementations
*/
const isObject = (obj) => (typeof obj === "object" || typeof obj === "function") && obj != null;
const defaultReflect = {
	get: (t, p) => t?.[p],
	set: (t, p, v) => {
		t[p] = v;
		return true;
	},
	has: (t, p) => p in t,
	apply: (t, ctx, args) => t.apply(ctx, args),
	construct: (t, args) => new t(...args),
	deleteProperty: (t, p) => delete t[p],
	ownKeys: (t) => Object.keys(t),
	getOwnPropertyDescriptor: (t, p) => Object.getOwnPropertyDescriptor(t, p),
	getPrototypeOf: (t) => Object.getPrototypeOf(t),
	setPrototypeOf: (t, p) => Object.setPrototypeOf(t, p),
	isExtensible: (t) => Object.isExtensible(t),
	preventExtensions: (t) => Object.preventExtensions(t)
};
/**
* Execute a reflect action
*
* Unified implementation used by all channel/proxy handlers.
* Supports both DataBase-backed paths and direct object targets.
*
* @param action - Action to execute (WReflectAction or string)
* @param path - Object path
* @param args - Action arguments
* @param options - Execution options
*/
function executeAction(action, path, args, options = {}) {
	const { channel = "", sender = "", reflect = defaultReflect } = options;
	const obj = options.target ?? readByPath(path);
	const toTransfer = [];
	let result = null;
	let newPath = path;
	switch (String(action).toLowerCase()) {
		case "import":
		case WReflectAction.IMPORT:
			result = import(
				/* @vite-ignore */
				args?.[0]
);
			break;
		case "transfer":
		case WReflectAction.TRANSFER:
			if (isCanTransfer(obj) && channel !== sender) toTransfer.push(obj);
			result = obj;
			break;
		case "get":
		case WReflectAction.GET: {
			const prop = args?.[0];
			const got = reflect.get?.(obj, prop) ?? obj?.[prop];
			result = typeof got === "function" && obj != null ? got.bind(obj) : got;
			newPath = [...path, String(prop)];
			break;
		}
		case "set":
		case WReflectAction.SET: {
			const [prop, value] = args;
			const normalizedValue = deepOperateAndClone(value, normalizeRef);
			if (options.target) result = reflect.set?.(obj, prop, normalizedValue) ?? (obj[prop] = normalizedValue, true);
			else result = reflect.set?.(obj, prop, normalizedValue) ?? writeByPath([...path, String(prop)], normalizedValue);
			break;
		}
		case "apply":
		case "call":
		case WReflectAction.APPLY:
		case WReflectAction.CALL:
			if (typeof obj === "function") {
				const ctx = options.context ?? (options.target ? void 0 : readByPath(path.slice(0, -1)));
				const normalizedArgs = deepOperateAndClone(args?.[0] ?? args ?? [], normalizeRef);
				result = reflect.apply?.(obj, ctx, normalizedArgs) ?? obj.apply(ctx, normalizedArgs);
				if (isCanTransfer(result) && path?.at(-1) === "transfer" && channel !== sender) toTransfer.push(result);
			}
			break;
		case "construct":
		case WReflectAction.CONSTRUCT:
			if (typeof obj === "function") {
				const normalizedArgs = deepOperateAndClone(args?.[0] ?? args ?? [], normalizeRef);
				result = reflect.construct?.(obj, normalizedArgs) ?? new obj(...normalizedArgs);
			}
			break;
		case "delete":
		case "deleteproperty":
		case "dispose":
		case WReflectAction.DELETE:
		case WReflectAction.DELETE_PROPERTY:
		case WReflectAction.DISPOSE:
			if (options.target) {
				const prop = path[path.length - 1];
				result = reflect.deleteProperty?.(obj, prop) ?? delete obj[prop];
			} else {
				result = path?.length > 0 ? removeByPath(path) : removeByData(obj);
				if (result) newPath = registeredInPath.get(obj) ?? [];
			}
			break;
		case "has":
		case WReflectAction.HAS:
			result = reflect.has?.(obj, args?.[0]) ?? (isObject(obj) ? args?.[0] in obj : false);
			break;
		case "ownkeys":
		case WReflectAction.OWN_KEYS:
			result = reflect.ownKeys?.(obj) ?? (isObject(obj) ? Object.keys(obj) : []);
			break;
		case "getownpropertydescriptor":
		case "getpropertydescriptor":
		case WReflectAction.GET_OWN_PROPERTY_DESCRIPTOR:
		case WReflectAction.GET_PROPERTY_DESCRIPTOR:
			result = reflect.getOwnPropertyDescriptor?.(obj, args?.[0] ?? path?.at(-1) ?? "") ?? (isObject(obj) ? Object.getOwnPropertyDescriptor(obj, args?.[0] ?? path?.at(-1) ?? "") : void 0);
			break;
		case "getprototypeof":
		case WReflectAction.GET_PROTOTYPE_OF:
			result = reflect.getPrototypeOf?.(obj) ?? (isObject(obj) ? Object.getPrototypeOf(obj) : null);
			break;
		case "setprototypeof":
		case WReflectAction.SET_PROTOTYPE_OF:
			result = reflect.setPrototypeOf?.(obj, args?.[0]) ?? (isObject(obj) ? Object.setPrototypeOf(obj, args?.[0]) : false);
			break;
		case "isextensible":
		case WReflectAction.IS_EXTENSIBLE:
			result = reflect.isExtensible?.(obj) ?? (isObject(obj) ? Object.isExtensible(obj) : true);
			break;
		case "preventextensions":
		case WReflectAction.PREVENT_EXTENSIONS:
			result = reflect.preventExtensions?.(obj) ?? (isObject(obj) ? Object.preventExtensions(obj) : false);
			break;
	}
	return {
		result,
		toTransfer,
		path: newPath
	};
}
/**
* Build response object with descriptor
*/
async function buildResponse(reqId, action, channel, sender, path, rawResult, toTransfer) {
	const result = await rawResult;
	const canBeReturn = isCanTransfer(result) && toTransfer.includes(result) || isCanJustReturn(result);
	let finalPath = path;
	if (!canBeReturn && action !== "get" && action !== WReflectAction.GET && (typeof result === "object" || typeof result === "function")) if (hasNoPath(result)) {
		finalPath = [UUIDv4()];
		writeByPath(finalPath, result);
	} else finalPath = registeredInPath.get(result) ?? [];
	const ctx = readByPath(finalPath);
	const ctxKey = action === "get" || action === WReflectAction.GET ? finalPath?.at(-1) : void 0;
	const obj = readByPath(path);
	const payload = deepOperateAndClone(result, (el) => objectToRef(el, channel, toTransfer)) ?? result;
	return {
		response: {
			channel: sender,
			sender: channel,
			reqId,
			action,
			type: "response",
			payload: {
				result: canBeReturn ? payload : null,
				type: typeof result,
				channel: sender,
				sender: channel,
				descriptor: {
					$isDescriptor: true,
					path: finalPath,
					owner: channel,
					channel,
					primitive: isPrimitive(result),
					writable: true,
					enumerable: true,
					configurable: true,
					argumentCount: obj instanceof Function ? obj.length : -1,
					...isObject(ctx) && ctxKey != null ? Object.getOwnPropertyDescriptor(ctx, ctxKey) : {}
				}
			}
		},
		transfer: toTransfer
	};
}
/**
* Handle request and return response (unified handler)
*/
async function handleRequest(request, reqId, channelName, options) {
	const { channel, sender, path, action, args } = request;
	if (channel !== channelName) return null;
	const { result, toTransfer, path: newPath } = executeAction(action, path, args, {
		channel,
		sender,
		...options
	});
	return buildResponse(reqId, action, channelName, sender, newPath, result, toTransfer);
}
//#endregion
//#region shared/fest/uniform/newer/next/channel/Connection.ts
/**
* Channel Connection - Connection abstraction layer
*
* Provides connection pooling, state management, and message routing.
*/
var ChannelConnection = class {
	constructor(_name, _transportType = "internal", options = {}) {
		this._name = _name;
		this._transportType = _transportType;
		this._id = UUIDv4();
		this._state = "disconnected";
		this._inbound = new ChannelSubject({ bufferSize: 1e3 });
		this._outbound = new ChannelSubject({ bufferSize: 1e3 });
		this._stateChanges = new ChannelSubject();
		this._connectedPeers = /* @__PURE__ */ new Map();
		this._subs = [];
		this._stats = {
			messagesSent: 0,
			messagesReceived: 0,
			bytesTransferred: 0,
			latencyMs: 0,
			uptime: 0,
			reconnectCount: 0
		};
		this._startTime = 0;
		this._pending = /* @__PURE__ */ new Map();
		this._buffer = [];
		this._opts = {
			timeout: 3e4,
			autoReconnect: true,
			reconnectInterval: 1e3,
			maxReconnectAttempts: 5,
			bufferMessages: true,
			bufferSize: 1e3,
			metadata: {},
			...options
		};
		this._setupSubscriptions();
	}
	subscribe(observer, fromChannel) {
		return (fromChannel ? filter((m) => m.sender === fromChannel)(this._inbound) : this._inbound).subscribe(typeof observer === "function" ? { next: observer } : observer);
	}
	next(message) {
		if (this._state !== "connected") {
			if (this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize) this._buffer.push(message);
			return;
		}
		this._outbound.next(message);
		this._stats.messagesSent++;
	}
	async request(toChannel, payload, opts = {}) {
		const reqId = UUIDv4();
		const resolvers = Promise.withResolvers();
		this._pending.set(reqId, resolvers);
		const timeout = setTimeout(() => {
			if (this._pending.has(reqId)) {
				this._pending.delete(reqId);
				resolvers.reject(/* @__PURE__ */ new Error(`Request timeout`));
			}
		}, opts.timeout ?? this._opts.timeout);
		this.next({
			id: UUIDv4(),
			channel: toChannel,
			sender: this._name,
			type: "request",
			reqId,
			payload: {
				...payload,
				action: opts.action,
				path: opts.path
			},
			timestamp: Date.now()
		});
		return resolvers.promise.finally(() => clearTimeout(timeout));
	}
	respond(original, payload) {
		this.next({
			id: UUIDv4(),
			channel: original.sender,
			sender: this._name,
			type: "response",
			reqId: original.reqId,
			payload,
			timestamp: Date.now()
		});
	}
	emit(toChannel, eventType, data) {
		this.next({
			id: UUIDv4(),
			channel: toChannel,
			sender: this._name,
			type: "event",
			payload: {
				type: eventType,
				data
			},
			timestamp: Date.now()
		});
	}
	subscribeOutbound(observer) {
		return this._outbound.subscribe(typeof observer === "function" ? { next: observer } : observer);
	}
	pushInbound(message) {
		this._stats.messagesReceived++;
		if (message.type === "response" && message.reqId) {
			const r = this._pending.get(message.reqId);
			if (r) {
				this._pending.delete(message.reqId);
				r.resolve(message.payload);
				return;
			}
		}
		this._inbound.next(message);
	}
	async connect() {
		if (this._state === "connected") return;
		this._setState("connecting");
		this._startTime = Date.now();
		this._setState("connected");
		this._flushBuffer();
	}
	disconnect() {
		if (this._state === "disconnected" || this._state === "closed") return;
		this._setState("disconnected");
		this._subs.forEach((s) => s.unsubscribe());
		this._subs = [];
	}
	close() {
		this.disconnect();
		this._setState("closed");
		this._inbound.complete();
		this._outbound.complete();
		this._stateChanges.complete();
	}
	markConnected() {
		this._setState("connected");
		this._flushBuffer();
	}
	markDisconnected() {
		this._setState("disconnected");
	}
	_setState(state) {
		if (this._state !== state) {
			this._state = state;
			this._stateChanges.next(state);
		}
	}
	_flushBuffer() {
		for (const msg of this._buffer) this._outbound.next(msg);
		this._buffer = [];
	}
	_setupSubscriptions() {
		this._subs.push(this._inbound.subscribe({ next: (msg) => {
			if (msg.type === "signal" && msg.payload?.type === "connect") this._connectedPeers.set(msg.sender, {
				name: msg.sender,
				state: "connected",
				isHost: false
			});
		} }));
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
	get state() {
		return this._state;
	}
	get transportType() {
		return this._transportType;
	}
	get stats() {
		return {
			...this._stats,
			uptime: this._startTime ? Date.now() - this._startTime : 0
		};
	}
	get stateChanges() {
		return this._stateChanges;
	}
	get connectedPeers() {
		return [...this._connectedPeers.keys()];
	}
	get meta() {
		return {
			id: this._id,
			name: this._name,
			state: this._state,
			isHost: false,
			connectedChannels: new Set(this._connectedPeers.keys())
		};
	}
};
var ConnectionPool = class ConnectionPool {
	constructor() {
		this._connections = /* @__PURE__ */ new Map();
	}
	static {
		this._instance = null;
	}
	static getInstance() {
		if (!ConnectionPool._instance) ConnectionPool._instance = new ConnectionPool();
		return ConnectionPool._instance;
	}
	getOrCreate(name, transportType = "internal", options = {}) {
		if (!this._connections.has(name)) this._connections.set(name, new ChannelConnection(name, transportType, options));
		return this._connections.get(name);
	}
	get(name) {
		return this._connections.get(name);
	}
	has(name) {
		return this._connections.has(name);
	}
	delete(name) {
		this._connections.get(name)?.close();
		return this._connections.delete(name);
	}
	clear() {
		this._connections.forEach((c) => c.close());
		this._connections.clear();
	}
	get size() {
		return this._connections.size;
	}
	get names() {
		return [...this._connections.keys()];
	}
};
const getConnectionPool = () => ConnectionPool.getInstance();
const getConnection = (name, transportType, options) => getConnectionPool().getOrCreate(name, transportType, options);
//#endregion
//#region shared/fest/uniform/newer/next/storage/Storage.ts
/**
* IndexedDB Integration for Channel System
*
* Provides persistent storage capabilities for channel communication:
* - Defer: Queue messages for later delivery
* - Pending: Track pending operations
* - Mailbox/Inbox: Store messages per channel
* - Transactions: Batch operations with rollback
* - Exchange: Coordinate data between contexts
*/
const DB_NAME = "uniform_channels";
const DB_VERSION = 1;
const STORES = {
	MESSAGES: "messages",
	MAILBOX: "mailbox",
	PENDING: "pending",
	EXCHANGE: "exchange",
	TRANSACTIONS: "transactions"
};
/**
* IndexedDB manager for channel storage
*/
var ChannelStorage = class {
	constructor(channelName) {
		this._db = null;
		this._isOpen = false;
		this._openPromise = null;
		this._messageUpdates = new ChannelSubject();
		this._exchangeUpdates = new ChannelSubject();
		this._channelName = channelName;
	}
	/**
	* Open database connection
	*/
	async open() {
		if (this._db && this._isOpen) return this._db;
		if (this._openPromise) return this._openPromise;
		this._openPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);
			request.onerror = () => {
				this._openPromise = null;
				reject(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
			};
			request.onsuccess = () => {
				this._db = request.result;
				this._isOpen = true;
				this._openPromise = null;
				resolve(this._db);
			};
			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				this._createStores(db);
			};
		});
		return this._openPromise;
	}
	/**
	* Close database connection
	*/
	close() {
		if (this._db) {
			this._db.close();
			this._db = null;
			this._isOpen = false;
		}
	}
	_createStores(db) {
		if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
			const messagesStore = db.createObjectStore(STORES.MESSAGES, { keyPath: "id" });
			messagesStore.createIndex("channel", "channel", { unique: false });
			messagesStore.createIndex("status", "status", { unique: false });
			messagesStore.createIndex("recipient", "recipient", { unique: false });
			messagesStore.createIndex("createdAt", "createdAt", { unique: false });
			messagesStore.createIndex("channel_status", ["channel", "status"], { unique: false });
		}
		if (!db.objectStoreNames.contains(STORES.MAILBOX)) {
			const mailboxStore = db.createObjectStore(STORES.MAILBOX, { keyPath: "id" });
			mailboxStore.createIndex("channel", "channel", { unique: false });
			mailboxStore.createIndex("priority", "priority", { unique: false });
			mailboxStore.createIndex("expiresAt", "expiresAt", { unique: false });
		}
		if (!db.objectStoreNames.contains(STORES.PENDING)) {
			const pendingStore = db.createObjectStore(STORES.PENDING, { keyPath: "id" });
			pendingStore.createIndex("channel", "channel", { unique: false });
			pendingStore.createIndex("createdAt", "createdAt", { unique: false });
		}
		if (!db.objectStoreNames.contains(STORES.EXCHANGE)) {
			const exchangeStore = db.createObjectStore(STORES.EXCHANGE, { keyPath: "id" });
			exchangeStore.createIndex("key", "key", { unique: true });
			exchangeStore.createIndex("owner", "owner", { unique: false });
		}
		if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) db.createObjectStore(STORES.TRANSACTIONS, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: false });
	}
	/**
	* Defer a message for later delivery
	*/
	async defer(message, options = {}) {
		const db = await this.open();
		const storedMessage = {
			id: UUIDv4(),
			channel: message.channel,
			sender: message.sender ?? this._channelName,
			recipient: message.channel,
			type: message.type,
			payload: message.payload,
			status: "pending",
			priority: options.priority ?? 0,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			expiresAt: options.expiresIn ? Date.now() + options.expiresIn : null,
			retryCount: 0,
			maxRetries: options.maxRetries ?? 3,
			metadata: options.metadata
		};
		return new Promise((resolve, reject) => {
			const tx = db.transaction([STORES.MESSAGES, STORES.MAILBOX], "readwrite");
			const messagesStore = tx.objectStore(STORES.MESSAGES);
			const mailboxStore = tx.objectStore(STORES.MAILBOX);
			messagesStore.add(storedMessage);
			mailboxStore.add(storedMessage);
			tx.oncomplete = () => {
				this._messageUpdates.next(storedMessage);
				resolve(storedMessage.id);
			};
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to defer message"));
		});
	}
	/**
	* Get deferred messages for a channel
	*/
	async getDeferredMessages(channel, options = {}) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const store = db.transaction(STORES.MESSAGES, "readonly").objectStore(STORES.MESSAGES);
			const index = options.status ? store.index("channel_status") : store.index("channel");
			const query = options.status ? IDBKeyRange.only([channel, options.status]) : IDBKeyRange.only(channel);
			const request = index.getAll(query, options.limit);
			request.onsuccess = () => {
				let results = request.result;
				if (options.offset) results = results.slice(options.offset);
				resolve(results);
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to get deferred messages"));
		});
	}
	/**
	* Process next pending message
	*/
	async processNextPending(channel) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORES.MESSAGES, "readwrite").objectStore(STORES.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([channel, "pending"]));
			request.onsuccess = () => {
				const cursor = request.result;
				if (cursor) {
					const message = cursor.value;
					message.status = "processing";
					message.updatedAt = Date.now();
					cursor.update(message);
					this._messageUpdates.next(message);
					resolve(message);
				} else resolve(null);
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to process pending message"));
		});
	}
	/**
	* Mark message as delivered
	*/
	async markDelivered(messageId) {
		await this._updateMessageStatus(messageId, "delivered");
	}
	/**
	* Mark message as failed and retry if possible
	*/
	async markFailed(messageId) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const store = db.transaction(STORES.MESSAGES, "readwrite").objectStore(STORES.MESSAGES);
			const request = store.get(messageId);
			request.onsuccess = () => {
				const message = request.result;
				if (!message) {
					resolve(false);
					return;
				}
				message.retryCount++;
				message.updatedAt = Date.now();
				if (message.retryCount < message.maxRetries) message.status = "pending";
				else message.status = "failed";
				store.put(message);
				this._messageUpdates.next(message);
				resolve(message.status === "pending");
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to mark message as failed"));
		});
	}
	async _updateMessageStatus(messageId, status) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const store = db.transaction(STORES.MESSAGES, "readwrite").objectStore(STORES.MESSAGES);
			const request = store.get(messageId);
			request.onsuccess = () => {
				const message = request.result;
				if (message) {
					message.status = status;
					message.updatedAt = Date.now();
					store.put(message);
					this._messageUpdates.next(message);
				}
				resolve();
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to update message status"));
		});
	}
	/**
	* Get mailbox for a channel
	*/
	async getMailbox(channel, options = {}) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORES.MAILBOX, "readonly").objectStore(STORES.MAILBOX).index("channel").getAll(IDBKeyRange.only(channel), options.limit);
			request.onsuccess = () => {
				let results = request.result;
				if (options.sortBy === "priority") results.sort((a, b) => b.priority - a.priority);
				else results.sort((a, b) => b.createdAt - a.createdAt);
				resolve(results);
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to get mailbox"));
		});
	}
	/**
	* Get mailbox statistics
	*/
	async getMailboxStats(channel) {
		const messages = await this.getDeferredMessages(channel);
		const stats = {
			total: messages.length,
			pending: 0,
			processing: 0,
			delivered: 0,
			failed: 0,
			expired: 0
		};
		const now = Date.now();
		for (const msg of messages) if (msg.expiresAt && msg.expiresAt < now) stats.expired++;
		else stats[msg.status]++;
		return stats;
	}
	/**
	* Clear mailbox for a channel
	*/
	async clearMailbox(channel) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.MAILBOX, "readwrite");
			const index = tx.objectStore(STORES.MAILBOX).index("channel");
			let deletedCount = 0;
			const request = index.openCursor(IDBKeyRange.only(channel));
			request.onsuccess = () => {
				const cursor = request.result;
				if (cursor) {
					cursor.delete();
					deletedCount++;
					cursor.continue();
				}
			};
			tx.oncomplete = () => resolve(deletedCount);
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to clear mailbox"));
		});
	}
	/**
	* Register a pending operation
	*/
	async registerPending(operation) {
		const db = await this.open();
		const pending = {
			id: UUIDv4(),
			channel: this._channelName,
			type: operation.type,
			data: operation.data,
			metadata: operation.metadata,
			createdAt: Date.now(),
			status: "pending"
		};
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.PENDING, "readwrite");
			tx.objectStore(STORES.PENDING).add(pending);
			tx.oncomplete = () => resolve(pending.id);
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to register pending operation"));
		});
	}
	/**
	* Get all pending operations for channel
	*/
	async getPendingOperations() {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORES.PENDING, "readonly").objectStore(STORES.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to get pending operations"));
		});
	}
	/**
	* Complete a pending operation
	*/
	async completePending(operationId) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.PENDING, "readwrite");
			tx.objectStore(STORES.PENDING).delete(operationId);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to complete pending operation"));
		});
	}
	/**
	* Await a pending operation (poll until complete or timeout)
	*/
	async awaitPending(operationId, options = {}) {
		const timeout = options.timeout ?? 3e4;
		const pollInterval = options.pollInterval ?? 100;
		const startTime = Date.now();
		while (Date.now() - startTime < timeout) {
			const pending = await this._getPendingById(operationId);
			if (!pending) return null;
			if (pending.status === "completed") {
				await this.completePending(operationId);
				return pending.result;
			}
			await new Promise((r) => setTimeout(r, pollInterval));
		}
		throw new Error(`Pending operation ${operationId} timed out`);
	}
	async _getPendingById(id) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORES.PENDING, "readonly").objectStore(STORES.PENDING).get(id);
			request.onsuccess = () => resolve(request.result ?? null);
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to get pending operation"));
		});
	}
	/**
	* Put data in exchange (shared storage)
	*/
	async exchangePut(key, value, options = {}) {
		const db = await this.open();
		const record = {
			id: UUIDv4(),
			key,
			value,
			owner: this._channelName,
			sharedWith: options.sharedWith ?? ["*"],
			version: 1,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.EXCHANGE, "readwrite");
			const store = tx.objectStore(STORES.EXCHANGE);
			const getRequest = store.index("key").get(key);
			getRequest.onsuccess = () => {
				const existing = getRequest.result;
				if (existing) {
					record.id = existing.id;
					record.version = existing.version + 1;
					record.createdAt = existing.createdAt;
				}
				store.put(record);
			};
			tx.oncomplete = () => {
				this._exchangeUpdates.next(record);
				resolve(record.id);
			};
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to put exchange data"));
		});
	}
	/**
	* Get data from exchange
	*/
	async exchangeGet(key) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORES.EXCHANGE, "readonly").objectStore(STORES.EXCHANGE).index("key").get(key);
			request.onsuccess = () => {
				const record = request.result;
				if (!record) {
					resolve(null);
					return;
				}
				if (!this._canAccessExchange(record)) {
					resolve(null);
					return;
				}
				resolve(record.value);
			};
			request.onerror = () => reject(/* @__PURE__ */ new Error("Failed to get exchange data"));
		});
	}
	/**
	* Delete data from exchange
	*/
	async exchangeDelete(key) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.EXCHANGE, "readwrite");
			const store = tx.objectStore(STORES.EXCHANGE);
			const getRequest = store.index("key").get(key);
			getRequest.onsuccess = () => {
				const record = getRequest.result;
				if (!record) {
					resolve(false);
					return;
				}
				if (record.owner !== this._channelName) {
					resolve(false);
					return;
				}
				store.delete(record.id);
			};
			tx.oncomplete = () => resolve(true);
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to delete exchange data"));
		});
	}
	/**
	* Acquire lock on exchange key
	*/
	async exchangeLock(key, options = {}) {
		const db = await this.open();
		const timeout = options.timeout ?? 3e4;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.EXCHANGE, "readwrite");
			const store = tx.objectStore(STORES.EXCHANGE);
			const request = store.index("key").get(key);
			request.onsuccess = () => {
				const record = request.result;
				if (!record) {
					resolve(false);
					return;
				}
				if (record.lock && record.lock.holder !== this._channelName) {
					if (record.lock.expiresAt > Date.now()) {
						resolve(false);
						return;
					}
				}
				record.lock = {
					holder: this._channelName,
					acquiredAt: Date.now(),
					expiresAt: Date.now() + timeout
				};
				record.updatedAt = Date.now();
				store.put(record);
			};
			tx.oncomplete = () => resolve(true);
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to acquire lock"));
		});
	}
	/**
	* Release lock on exchange key
	*/
	async exchangeUnlock(key) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.EXCHANGE, "readwrite");
			const store = tx.objectStore(STORES.EXCHANGE);
			const request = store.index("key").get(key);
			request.onsuccess = () => {
				const record = request.result;
				if (record && record.lock?.holder === this._channelName) {
					delete record.lock;
					record.updatedAt = Date.now();
					store.put(record);
				}
			};
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to release lock"));
		});
	}
	_canAccessExchange(record) {
		if (record.owner === this._channelName) return true;
		if (record.sharedWith.includes("*")) return true;
		return record.sharedWith.includes(this._channelName);
	}
	/**
	* Begin a transaction for batch operations
	*/
	async beginTransaction() {
		return new ChannelTransaction(this);
	}
	/**
	* Execute operations in transaction
	*/
	async executeTransaction(operations) {
		const db = await this.open();
		const storeNames = new Set(operations.map((op) => op.store));
		return new Promise((resolve, reject) => {
			const tx = db.transaction(Array.from(storeNames), "readwrite");
			for (const op of operations) {
				const store = tx.objectStore(op.store);
				switch (op.type) {
					case "put":
						if (op.value !== void 0) store.put(op.value);
						break;
					case "delete":
						if (op.key !== void 0) store.delete(op.key);
						break;
					case "update":
						if (op.key !== void 0) {
							const getReq = store.get(op.key);
							getReq.onsuccess = () => {
								if (getReq.result && op.value) store.put({
									...getReq.result,
									...op.value
								});
							};
						}
						break;
				}
			}
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Transaction failed"));
		});
	}
	/**
	* Subscribe to message updates
	*/
	onMessageUpdate(handler) {
		return this._messageUpdates.subscribe({ next: handler });
	}
	/**
	* Subscribe to exchange updates
	*/
	onExchangeUpdate(handler) {
		return this._exchangeUpdates.subscribe({ next: handler });
	}
	/**
	* Clean up expired messages
	*/
	async cleanupExpired() {
		const db = await this.open();
		const now = Date.now();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([STORES.MESSAGES, STORES.MAILBOX], "readwrite");
			const messagesStore = tx.objectStore(STORES.MESSAGES);
			const mailboxStore = tx.objectStore(STORES.MAILBOX);
			let deletedCount = 0;
			const msgRequest = messagesStore.openCursor();
			msgRequest.onsuccess = () => {
				const cursor = msgRequest.result;
				if (cursor) {
					const msg = cursor.value;
					if (msg.expiresAt && msg.expiresAt < now) {
						cursor.delete();
						deletedCount++;
					}
					cursor.continue();
				}
			};
			const mailRequest = mailboxStore.openCursor();
			mailRequest.onsuccess = () => {
				const cursor = mailRequest.result;
				if (cursor) {
					const msg = cursor.value;
					if (msg.expiresAt && msg.expiresAt < now) {
						cursor.delete();
						deletedCount++;
					}
					cursor.continue();
				}
			};
			tx.oncomplete = () => resolve(deletedCount);
			tx.onerror = () => reject(/* @__PURE__ */ new Error("Failed to cleanup expired"));
		});
	}
};
/**
* Helper class for batch operations with rollback support
*/
var ChannelTransaction = class {
	constructor(_storage) {
		this._storage = _storage;
		this._operations = [];
		this._isCommitted = false;
		this._isRolledBack = false;
	}
	/**
	* Add put operation
	*/
	put(store, value) {
		this._checkState();
		this._operations.push({
			id: UUIDv4(),
			type: "put",
			store,
			value,
			timestamp: Date.now()
		});
		return this;
	}
	/**
	* Add delete operation
	*/
	delete(store, key) {
		this._checkState();
		this._operations.push({
			id: UUIDv4(),
			type: "delete",
			store,
			key,
			timestamp: Date.now()
		});
		return this;
	}
	/**
	* Add update operation
	*/
	update(store, key, updates) {
		this._checkState();
		this._operations.push({
			id: UUIDv4(),
			type: "update",
			store,
			key,
			value: updates,
			timestamp: Date.now()
		});
		return this;
	}
	/**
	* Commit transaction
	*/
	async commit() {
		this._checkState();
		if (this._operations.length === 0) {
			this._isCommitted = true;
			return;
		}
		await this._storage.executeTransaction(this._operations);
		this._isCommitted = true;
	}
	/**
	* Rollback transaction (just clear operations, don't execute)
	*/
	rollback() {
		this._operations = [];
		this._isRolledBack = true;
	}
	/**
	* Get operation count
	*/
	get operationCount() {
		return this._operations.length;
	}
	_checkState() {
		if (this._isCommitted) throw new Error("Transaction already committed");
		if (this._isRolledBack) throw new Error("Transaction already rolled back");
	}
};
const _storageInstances = /* @__PURE__ */ new Map();
/**
* Get storage instance for channel
*/
function getChannelStorage(channelName) {
	if (!_storageInstances.has(channelName)) _storageInstances.set(channelName, new ChannelStorage(channelName));
	return _storageInstances.get(channelName);
}
//#endregion
//#region shared/fest/uniform/newer/next/channel/ChannelContext.ts
/**
* Channel Context - Multi-Channel Support
*
* Provides a way to create multiple independent channel endpoints/ports
* in the same context. Suitable for:
* - Lazy-loaded components
* - Multiple DOM components with isolated communication
* - Micro-frontend architectures
* - Component-level channel isolation
*
* vNext architecture note:
* - ChannelContext composes UnifiedChannel instances per endpoint.
* - UnifiedChannel is the canonical transport/invocation runtime engine.
*/
const workerCode = new URL("data:video/mp2t;base64,LyoqCiAqIFdvcmtlciBFbnRyeSBQb2ludCAtIE11bHRpLUNoYW5uZWwgU3VwcG9ydAogKgogKiBUaGlzIHdvcmtlciBjb250ZXh0IHN1cHBvcnRzOgogKiAtIE11bHRpcGxlIGNoYW5uZWwgY3JlYXRpb24vaW5pdGlhbGl6YXRpb24KICogLSBPYnNlcnZpbmcgbmV3IGluY29taW5nIGNoYW5uZWwgY29ubmVjdGlvbnMKICogLSBEeW5hbWljIGNoYW5uZWwgYWRkaXRpb24gYWZ0ZXIgaW5pdGlhbGl6YXRpb24KICogLSBDb25uZWN0aW9uIGZyb20gcmVtb3RlL2hvc3QgY29udGV4dHMKICovCgppbXBvcnQgeyBVVUlEdjQgfSBmcm9tICJmZXN0L2NvcmUiOwppbXBvcnQgewogICAgQ2hhbm5lbENvbnRleHQsCiAgICBjcmVhdGVDaGFubmVsQ29udGV4dCwKICAgIHR5cGUgQ2hhbm5lbEVuZHBvaW50LAogICAgdHlwZSBDaGFubmVsQ29udGV4dE9wdGlvbnMsCiAgICB0eXBlIFF1ZXJ5Q29ubmVjdGlvbnNPcHRpb25zLAogICAgdHlwZSBDb250ZXh0Q29ubmVjdGlvbkluZm8KfSBmcm9tICIuLi9jaGFubmVsL0NoYW5uZWxDb250ZXh0IjsKaW1wb3J0IHsgQ2hhbm5lbFN1YmplY3QsIHR5cGUgU3Vic2NyaXB0aW9uIH0gZnJvbSAiLi4vb2JzZXJ2YWJsZS9PYnNlcnZhYmxlIjsKCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KLy8gVFlQRVMKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqIEluY29taW5nIGNvbm5lY3Rpb24gZXZlbnQgKi8KZXhwb3J0IGludGVyZmFjZSBJbmNvbWluZ0Nvbm5lY3Rpb24gewogICAgLyoqIENvbm5lY3Rpb24gSUQgKi8KICAgIGlkOiBzdHJpbmc7CiAgICAvKiogQ2hhbm5lbCBuYW1lICovCiAgICBjaGFubmVsOiBzdHJpbmc7CiAgICAvKiogU2VuZGVyIGNvbnRleHQgbmFtZSAqLwogICAgc2VuZGVyOiBzdHJpbmc7CiAgICAvKiogQ29ubmVjdGlvbiB0eXBlICovCiAgICB0eXBlOiAiY2hhbm5lbCIgfCAicG9ydCIgfCAiYnJvYWRjYXN0IiB8ICJzb2NrZXQiOwogICAgLyoqIE1lc3NhZ2VQb3J0IGlmIHByb3ZpZGVkICovCiAgICBwb3J0PzogTWVzc2FnZVBvcnQ7CiAgICAvKiogVGltZXN0YW1wICovCiAgICB0aW1lc3RhbXA6IG51bWJlcjsKICAgIC8qKiBDb25uZWN0aW9uIG9wdGlvbnMgKi8KICAgIG9wdGlvbnM/OiBhbnk7Cn0KCi8qKiBDaGFubmVsIGNyZWF0ZWQgZXZlbnQgKi8KZXhwb3J0IGludGVyZmFjZSBDaGFubmVsQ3JlYXRlZEV2ZW50IHsKICAgIC8qKiBDaGFubmVsIG5hbWUgKi8KICAgIGNoYW5uZWw6IHN0cmluZzsKICAgIC8qKiBFbmRwb2ludCByZWZlcmVuY2UgKi8KICAgIGVuZHBvaW50OiBDaGFubmVsRW5kcG9pbnQ7CiAgICAvKiogUmVtb3RlIHNlbmRlciAqLwogICAgc2VuZGVyOiBzdHJpbmc7CiAgICAvKiogVGltZXN0YW1wICovCiAgICB0aW1lc3RhbXA6IG51bWJlcjsKfQoKLyoqIFdvcmtlciBjb250ZXh0IGNvbmZpZ3VyYXRpb24gKi8KZXhwb3J0IGludGVyZmFjZSBXb3JrZXJDb250ZXh0Q29uZmlnIGV4dGVuZHMgQ2hhbm5lbENvbnRleHRPcHRpb25zIHsKICAgIC8qKiBXb3JrZXIgbmFtZS9pZGVudGlmaWVyICovCiAgICB3b3JrZXJOYW1lPzogc3RyaW5nOwogICAgLyoqIEF1dG8tYWNjZXB0IGluY29taW5nIGNoYW5uZWxzICovCiAgICBhdXRvQWNjZXB0Q2hhbm5lbHM/OiBib29sZWFuOwogICAgLyoqIENoYW5uZWwgd2hpdGVsaXN0IChpZiBzZXQsIG9ubHkgdGhlc2UgY2hhbm5lbHMgYXJlIGFjY2VwdGVkKSAqLwogICAgYWxsb3dlZENoYW5uZWxzPzogc3RyaW5nW107CiAgICAvKiogTWF4aW11bSBjb25jdXJyZW50IGNoYW5uZWxzICovCiAgICBtYXhDaGFubmVscz86IG51bWJlcjsKfQoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBXT1JLRVIgQ09OVEVYVAovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgovKioKICogV29ya2VyQ29udGV4dCAtIE1hbmFnZXMgY2hhbm5lbHMgd2l0aGluIGEgV29ya2VyCiAqCiAqIFN1cHBvcnRzIG9ic2VydmluZyBuZXcgaW5jb21pbmcgY29ubmVjdGlvbnMgZnJvbSBob3N0L3JlbW90ZSBjb250ZXh0cy4KICovCmV4cG9ydCBjbGFzcyBXb3JrZXJDb250ZXh0IHsKICAgIHByaXZhdGUgX2NvbnRleHQ6IENoYW5uZWxDb250ZXh0OwogICAgcHJpdmF0ZSBfY29uZmlnOiBSZXF1aXJlZDxXb3JrZXJDb250ZXh0Q29uZmlnPjsKICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107CgogICAgLy8gT2JzZXJ2YWJsZSBzdHJlYW1zIGZvciBpbmNvbWluZyBjb25uZWN0aW9ucwogICAgcHJpdmF0ZSBfaW5jb21pbmdDb25uZWN0aW9ucyA9IG5ldyBDaGFubmVsU3ViamVjdDxJbmNvbWluZ0Nvbm5lY3Rpb24+KHsgYnVmZmVyU2l6ZTogMTAwIH0pOwogICAgcHJpdmF0ZSBfY2hhbm5lbENyZWF0ZWQgPSBuZXcgQ2hhbm5lbFN1YmplY3Q8Q2hhbm5lbENyZWF0ZWRFdmVudD4oeyBidWZmZXJTaXplOiAxMDAgfSk7CiAgICBwcml2YXRlIF9jaGFubmVsQ2xvc2VkID0gbmV3IENoYW5uZWxTdWJqZWN0PHsgY2hhbm5lbDogc3RyaW5nOyB0aW1lc3RhbXA6IG51bWJlciB9PigpOwoKICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogV29ya2VyQ29udGV4dENvbmZpZyA9IHt9KSB7CiAgICAgICAgdGhpcy5fY29uZmlnID0gewogICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSA/PyAid29ya2VyIiwKICAgICAgICAgICAgd29ya2VyTmFtZTogY29uZmlnLndvcmtlck5hbWUgPz8gYHdvcmtlci0ke1VVSUR2NCgpLnNsaWNlKDAsIDgpfWAsCiAgICAgICAgICAgIGF1dG9BY2NlcHRDaGFubmVsczogY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyA/PyB0cnVlLAogICAgICAgICAgICBhbGxvd2VkQ2hhbm5lbHM6IGNvbmZpZy5hbGxvd2VkQ2hhbm5lbHMgPz8gW10sCiAgICAgICAgICAgIG1heENoYW5uZWxzOiBjb25maWcubWF4Q2hhbm5lbHMgPz8gMTAwLAogICAgICAgICAgICBhdXRvQ29ubmVjdDogY29uZmlnLmF1dG9Db25uZWN0ID8/IHRydWUsCiAgICAgICAgICAgIHVzZUdsb2JhbFNlbGY6IHRydWUsCiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnMgPz8ge30sCiAgICAgICAgICAgIGlzb2xhdGVkU3RvcmFnZTogY29uZmlnLmlzb2xhdGVkU3RvcmFnZSA/PyBmYWxzZSwKICAgICAgICAgICAgLi4uY29uZmlnCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNyZWF0ZUNoYW5uZWxDb250ZXh0KHsKICAgICAgICAgICAgbmFtZTogdGhpcy5fY29uZmlnLm5hbWUsCiAgICAgICAgICAgIHVzZUdsb2JhbFNlbGY6IHRydWUsCiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnMKICAgICAgICB9KTsKCiAgICAgICAgdGhpcy5fc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIElOQ09NSU5HIENPTk5FQ1RJT04gT0JTRVJWQUJMRVMKICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKICAgIC8qKgogICAgICogT2JzZXJ2YWJsZTogTmV3IGluY29taW5nIGNvbm5lY3Rpb24gcmVxdWVzdHMKICAgICAqLwogICAgZ2V0IG9uQ29ubmVjdGlvbigpIHsKICAgICAgICByZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9uczsKICAgIH0KCiAgICAvKioKICAgICAqIE9ic2VydmFibGU6IENoYW5uZWwgY3JlYXRlZCBldmVudHMKICAgICAqLwogICAgZ2V0IG9uQ2hhbm5lbENyZWF0ZWQoKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkOwogICAgfQoKICAgIC8qKgogICAgICogT2JzZXJ2YWJsZTogQ2hhbm5lbCBjbG9zZWQgZXZlbnRzCiAgICAgKi8KICAgIGdldCBvbkNoYW5uZWxDbG9zZWQoKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDbG9zZWQ7CiAgICB9CgogICAgLyoqCiAgICAgKiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgY29ubmVjdGlvbnMKICAgICAqLwogICAgc3Vic2NyaWJlQ29ubmVjdGlvbnMoCiAgICAgICAgaGFuZGxlcjogKGNvbm46IEluY29taW5nQ29ubmVjdGlvbikgPT4gdm9pZAogICAgKTogU3Vic2NyaXB0aW9uIHsKICAgICAgICByZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5zdWJzY3JpYmUoaGFuZGxlcik7CiAgICB9CgogICAgLyoqCiAgICAgKiBTdWJzY3JpYmUgdG8gY2hhbm5lbCBjcmVhdGlvbgogICAgICovCiAgICBzdWJzY3JpYmVDaGFubmVsQ3JlYXRlZCgKICAgICAgICBoYW5kbGVyOiAoZXZlbnQ6IENoYW5uZWxDcmVhdGVkRXZlbnQpID0+IHZvaWQKICAgICk6IFN1YnNjcmlwdGlvbiB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkLnN1YnNjcmliZShoYW5kbGVyKTsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIENIQU5ORUwgTUFOQUdFTUVOVAogICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgogICAgLyoqCiAgICAgKiBBY2NlcHQgYW4gaW5jb21pbmcgY29ubmVjdGlvbiBhbmQgY3JlYXRlIHRoZSBjaGFubmVsCiAgICAgKi8KICAgIGFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbjogSW5jb21pbmdDb25uZWN0aW9uKTogQ2hhbm5lbEVuZHBvaW50IHwgbnVsbCB7CiAgICAgICAgaWYgKCF0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGNvbm5lY3Rpb24uY2hhbm5lbCkpIHsKICAgICAgICAgICAgcmV0dXJuIG51bGw7CiAgICAgICAgfQoKICAgICAgICBjb25zdCBlbmRwb2ludCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbChjb25uZWN0aW9uLmNoYW5uZWwsIGNvbm5lY3Rpb24ub3B0aW9ucyk7CgogICAgICAgIC8vIFNldHVwIHJlbW90ZSBjb25uZWN0aW9uCiAgICAgICAgaWYgKGNvbm5lY3Rpb24ucG9ydCkgewogICAgICAgICAgICBjb25uZWN0aW9uLnBvcnQuc3RhcnQ/LigpOwogICAgICAgICAgICBlbmRwb2ludC5oYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwoCiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnNlbmRlciwKICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ub3B0aW9ucywKICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucG9ydAogICAgICAgICAgICApOwogICAgICAgIH0KCiAgICAgICAgdGhpcy5fY2hhbm5lbENyZWF0ZWQubmV4dCh7CiAgICAgICAgICAgIGNoYW5uZWw6IGNvbm5lY3Rpb24uY2hhbm5lbCwKICAgICAgICAgICAgZW5kcG9pbnQsCiAgICAgICAgICAgIHNlbmRlcjogY29ubmVjdGlvbi5zZW5kZXIsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKQogICAgICAgIH0pOwoKICAgICAgICAvLyBOb3RpZnkgc2VuZGVyCiAgICAgICAgdGhpcy5fcG9zdENoYW5uZWxDcmVhdGVkKGNvbm5lY3Rpb24uY2hhbm5lbCwgY29ubmVjdGlvbi5zZW5kZXIsIGNvbm5lY3Rpb24uaWQpOwoKICAgICAgICByZXR1cm4gZW5kcG9pbnQ7CiAgICB9CgogICAgLyoqCiAgICAgKiBDcmVhdGUgYSBuZXcgY2hhbm5lbCBpbiB0aGlzIHdvcmtlciBjb250ZXh0CiAgICAgKi8KICAgIGNyZWF0ZUNoYW5uZWwobmFtZTogc3RyaW5nLCBvcHRpb25zPzogYW55KTogQ2hhbm5lbEVuZHBvaW50IHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpOwogICAgfQoKICAgIC8qKgogICAgICogR2V0IGFuIGV4aXN0aW5nIGNoYW5uZWwKICAgICAqLwogICAgZ2V0Q2hhbm5lbChuYW1lOiBzdHJpbmcpOiBDaGFubmVsRW5kcG9pbnQgfCB1bmRlZmluZWQgewogICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LmdldENoYW5uZWwobmFtZSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBDaGVjayBpZiBjaGFubmVsIGV4aXN0cwogICAgICovCiAgICBoYXNDaGFubmVsKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gewogICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0Lmhhc0NoYW5uZWwobmFtZSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBHZXQgYWxsIGNoYW5uZWwgbmFtZXMKICAgICAqLwogICAgZ2V0Q2hhbm5lbE5hbWVzKCk6IHN0cmluZ1tdIHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsTmFtZXMoKTsKICAgIH0KCiAgICAvKioKICAgICAqIFF1ZXJ5IGN1cnJlbnRseSB0cmFja2VkIGNoYW5uZWwgY29ubmVjdGlvbnMgaW4gdGhpcyB3b3JrZXIuCiAgICAgKi8KICAgIHF1ZXJ5Q29ubmVjdGlvbnMocXVlcnk6IFF1ZXJ5Q29ubmVjdGlvbnNPcHRpb25zID0ge30pOiBDb250ZXh0Q29ubmVjdGlvbkluZm9bXSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQucXVlcnlDb25uZWN0aW9ucyhxdWVyeSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBOb3RpZnkgYWN0aXZlIGNvbm5lY3Rpb25zICh1c2VmdWwgZm9yIHdvcmtlcjwtPmhvc3Qgc3luYykuCiAgICAgKi8KICAgIG5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQ6IGFueSA9IHt9LCBxdWVyeTogUXVlcnlDb25uZWN0aW9uc09wdGlvbnMgPSB7fSk6IG51bWJlciB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQubm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCwgcXVlcnkpOwogICAgfQoKICAgIC8qKgogICAgICogQ2xvc2UgYSBzcGVjaWZpYyBjaGFubmVsCiAgICAgKi8KICAgIGNsb3NlQ2hhbm5lbChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHsKICAgICAgICBjb25zdCBjbG9zZWQgPSB0aGlzLl9jb250ZXh0LmNsb3NlQ2hhbm5lbChuYW1lKTsKICAgICAgICBpZiAoY2xvc2VkKSB7CiAgICAgICAgICAgIHRoaXMuX2NoYW5uZWxDbG9zZWQubmV4dCh7IGNoYW5uZWw6IG5hbWUsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGNsb3NlZDsKICAgIH0KCiAgICAvKioKICAgICAqIEdldCB0aGUgdW5kZXJseWluZyBjb250ZXh0CiAgICAgKi8KICAgIGdldCBjb250ZXh0KCk6IENoYW5uZWxDb250ZXh0IHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dDsKICAgIH0KCiAgICAvKioKICAgICAqIEdldCB3b3JrZXIgY29uZmlndXJhdGlvbgogICAgICovCiAgICBnZXQgY29uZmlnKCk6IFJlYWRvbmx5PFJlcXVpcmVkPFdvcmtlckNvbnRleHRDb25maWc+PiB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZzsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIFBSSVZBVEUgTUVUSE9EUwogICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgogICAgcHJpdmF0ZSBfc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTogdm9pZCB7CiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsICgoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4gewogICAgICAgICAgICB0aGlzLl9oYW5kbGVJbmNvbWluZ01lc3NhZ2UoZXZlbnQpOwogICAgICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpOwogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUluY29taW5nTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogdm9pZCB7CiAgICAgICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGE7CiAgICAgICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSAib2JqZWN0IikgcmV0dXJuOwoKICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkgewogICAgICAgICAgICBjYXNlICJjcmVhdGVDaGFubmVsIjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUNyZWF0ZUNoYW5uZWwoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImNvbm5lY3RDaGFubmVsIjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGEpOwogICAgICAgICAgICAgICAgYnJlYWs7CgogICAgICAgICAgICBjYXNlICJhZGRQb3J0IjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUFkZFBvcnQoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImxpc3RDaGFubmVscyI6CiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVMaXN0Q2hhbm5lbHMoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImNsb3NlQ2hhbm5lbCI6CiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVDbG9zZUNoYW5uZWwoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgInBpbmciOgogICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlOiAicG9uZyIsIGlkOiBkYXRhLmlkLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGRlZmF1bHQ6CiAgICAgICAgICAgICAgICAvLyBQYXNzIHRvIGV4aXN0aW5nIGhhbmRsZXIgb3IgbG9nCiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jaGFubmVsICYmIHRoaXMuX2NvbnRleHQuaGFzQ2hhbm5lbChkYXRhLmNoYW5uZWwpKSB7CiAgICAgICAgICAgICAgICAgICAgLy8gUm91dGUgdG8gc3BlY2lmaWMgY2hhbm5lbAogICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsKGRhdGEuY2hhbm5lbCk7CiAgICAgICAgICAgICAgICAgICAgKGVuZHBvaW50Py5oYW5kbGVyIGFzIGFueSk/LmhhbmRsZUFuZFJlc3BvbnNlPy4oZGF0YS5wYXlsb2FkLCBkYXRhLnJlcUlkKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CgogICAgcHJpdmF0ZSBfaGFuZGxlQ3JlYXRlQ2hhbm5lbChkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBjb25zdCBjb25uZWN0aW9uOiBJbmNvbWluZ0Nvbm5lY3Rpb24gPSB7CiAgICAgICAgICAgIGlkOiBkYXRhLnJlcUlkID8/IFVVSUR2NCgpLAogICAgICAgICAgICBjaGFubmVsOiBkYXRhLmNoYW5uZWwsCiAgICAgICAgICAgIHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gInVua25vd24iLAogICAgICAgICAgICB0eXBlOiAiY2hhbm5lbCIsCiAgICAgICAgICAgIHBvcnQ6IGRhdGEubWVzc2FnZVBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgLy8gRW1pdCB0byBvYnNlcnZlcnMKICAgICAgICB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQoY29ubmVjdGlvbik7CgogICAgICAgIC8vIEF1dG8tYWNjZXB0IGlmIGNvbmZpZ3VyZWQKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgewogICAgICAgICAgICB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7CiAgICAgICAgfQogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGE6IGFueSk6IHZvaWQgewogICAgICAgIGNvbnN0IGNvbm5lY3Rpb246IEluY29taW5nQ29ubmVjdGlvbiA9IHsKICAgICAgICAgICAgaWQ6IGRhdGEucmVxSWQgPz8gVVVJRHY0KCksCiAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgc2VuZGVyOiBkYXRhLnNlbmRlciA/PyAidW5rbm93biIsCiAgICAgICAgICAgIHR5cGU6IGRhdGEucG9ydFR5cGUgPz8gImNoYW5uZWwiLAogICAgICAgICAgICBwb3J0OiBkYXRhLnBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pOwoKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyAmJiB0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGRhdGEuY2hhbm5lbCkpIHsKICAgICAgICAgICAgLy8gQ29ubmVjdCB0byBleGlzdGluZyBjaGFubmVsIG9yIGNyZWF0ZSBuZXcKICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9jb250ZXh0LmdldE9yQ3JlYXRlQ2hhbm5lbChkYXRhLmNoYW5uZWwsIGRhdGEub3B0aW9ucyk7CgogICAgICAgICAgICBpZiAoZGF0YS5wb3J0KSB7CiAgICAgICAgICAgICAgICBkYXRhLnBvcnQuc3RhcnQ/LigpOwogICAgICAgICAgICAgICAgZW5kcG9pbnQuaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKGRhdGEuc2VuZGVyLCBkYXRhLm9wdGlvbnMsIGRhdGEucG9ydCk7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ29ubmVjdGVkIiwKICAgICAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgICAgIHJlcUlkOiBkYXRhLnJlcUlkCiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgIH0KCiAgICBwcml2YXRlIF9oYW5kbGVBZGRQb3J0KGRhdGE6IGFueSk6IHZvaWQgewogICAgICAgIGlmICghZGF0YS5wb3J0IHx8ICFkYXRhLmNoYW5uZWwpIHJldHVybjsKCiAgICAgICAgY29uc3QgY29ubmVjdGlvbjogSW5jb21pbmdDb25uZWN0aW9uID0gewogICAgICAgICAgICBpZDogZGF0YS5yZXFJZCA/PyBVVUlEdjQoKSwKICAgICAgICAgICAgY2hhbm5lbDogZGF0YS5jaGFubmVsLAogICAgICAgICAgICBzZW5kZXI6IGRhdGEuc2VuZGVyID8/ICJ1bmtub3duIiwKICAgICAgICAgICAgdHlwZTogInBvcnQiLAogICAgICAgICAgICBwb3J0OiBkYXRhLnBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pOwoKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgewogICAgICAgICAgICB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7CiAgICAgICAgfQogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUxpc3RDaGFubmVscyhkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBwb3N0TWVzc2FnZSh7CiAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsTGlzdCIsCiAgICAgICAgICAgIGNoYW5uZWxzOiB0aGlzLmdldENoYW5uZWxOYW1lcygpLAogICAgICAgICAgICByZXFJZDogZGF0YS5yZXFJZAogICAgICAgIH0pOwogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUNsb3NlQ2hhbm5lbChkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBpZiAoZGF0YS5jaGFubmVsKSB7CiAgICAgICAgICAgIHRoaXMuY2xvc2VDaGFubmVsKGRhdGEuY2hhbm5lbCk7CiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ2xvc2VkIiwKICAgICAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgICAgIHJlcUlkOiBkYXRhLnJlcUlkCiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgIH0KCiAgICBwcml2YXRlIF9jYW5BY2NlcHRDaGFubmVsKGNoYW5uZWw6IHN0cmluZyk6IGJvb2xlYW4gewogICAgICAgIC8vIENoZWNrIG1heCBjaGFubmVscwogICAgICAgIGlmICh0aGlzLl9jb250ZXh0LnNpemUgPj0gdGhpcy5fY29uZmlnLm1heENoYW5uZWxzKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CgogICAgICAgIC8vIENoZWNrIHdoaXRlbGlzdAogICAgICAgIGlmICh0aGlzLl9jb25maWcuYWxsb3dlZENoYW5uZWxzLmxlbmd0aCA+IDApIHsKICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5hbGxvd2VkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCk7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBwcml2YXRlIF9wb3N0Q2hhbm5lbENyZWF0ZWQoY2hhbm5lbDogc3RyaW5nLCBzZW5kZXI6IHN0cmluZywgcmVxSWQ/OiBzdHJpbmcpOiB2b2lkIHsKICAgICAgICBwb3N0TWVzc2FnZSh7CiAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ3JlYXRlZCIsCiAgICAgICAgICAgIGNoYW5uZWwsCiAgICAgICAgICAgIHNlbmRlciwKICAgICAgICAgICAgcmVxSWQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKQogICAgICAgIH0pOwogICAgfQoKICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgLy8gTElGRUNZQ0xFCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCiAgICBjbG9zZSgpOiB2b2lkIHsKICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpOwogICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXTsKICAgICAgICB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLmNvbXBsZXRlKCk7CiAgICAgICAgdGhpcy5fY2hhbm5lbENyZWF0ZWQuY29tcGxldGUoKTsKICAgICAgICB0aGlzLl9jaGFubmVsQ2xvc2VkLmNvbXBsZXRlKCk7CiAgICAgICAgdGhpcy5fY29udGV4dC5jbG9zZSgpOwogICAgfQp9CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIEdMT0JBTCBXT1JLRVIgQ09OVEVYVCAoU2luZ2xldG9uKQovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpsZXQgV09SS0VSX0NPTlRFWFQ6IFdvcmtlckNvbnRleHQgfCBudWxsID0gbnVsbDsKCi8qKgogKiBHZXQgb3IgY3JlYXRlIHRoZSB3b3JrZXIgY29udGV4dCBzaW5nbGV0b24KICovCmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JrZXJDb250ZXh0KGNvbmZpZz86IFdvcmtlckNvbnRleHRDb25maWcpOiBXb3JrZXJDb250ZXh0IHsKICAgIGlmICghV09SS0VSX0NPTlRFWFQpIHsKICAgICAgICBXT1JLRVJfQ09OVEVYVCA9IG5ldyBXb3JrZXJDb250ZXh0KGNvbmZpZyk7CiAgICB9CiAgICByZXR1cm4gV09SS0VSX0NPTlRFWFQ7Cn0KCi8qKgogKiBJbml0aWFsaXplIHdvcmtlciBjb250ZXh0IHdpdGggY29uZmlnCiAqLwpleHBvcnQgZnVuY3Rpb24gaW5pdFdvcmtlckNvbnRleHQoY29uZmlnPzogV29ya2VyQ29udGV4dENvbmZpZyk6IFdvcmtlckNvbnRleHQgewogICAgV09SS0VSX0NPTlRFWFQ/LmNsb3NlKCk7CiAgICBXT1JLRVJfQ09OVEVYVCA9IG5ldyBXb3JrZXJDb250ZXh0KGNvbmZpZyk7CiAgICByZXR1cm4gV09SS0VSX0NPTlRFWFQ7Cn0KCi8qKgogKiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgY29ubmVjdGlvbnMgaW4gdGhlIGdsb2JhbCB3b3JrZXIgY29udGV4dAogKi8KZXhwb3J0IGZ1bmN0aW9uIG9uV29ya2VyQ29ubmVjdGlvbigKICAgIGhhbmRsZXI6IChjb25uOiBJbmNvbWluZ0Nvbm5lY3Rpb24pID0+IHZvaWQKKTogU3Vic2NyaXB0aW9uIHsKICAgIHJldHVybiBnZXRXb3JrZXJDb250ZXh0KCkuc3Vic2NyaWJlQ29ubmVjdGlvbnMoaGFuZGxlcik7Cn0KCi8qKgogKiBTdWJzY3JpYmUgdG8gY2hhbm5lbCBjcmVhdGlvbiBpbiB0aGUgZ2xvYmFsIHdvcmtlciBjb250ZXh0CiAqLwpleHBvcnQgZnVuY3Rpb24gb25Xb3JrZXJDaGFubmVsQ3JlYXRlZCgKICAgIGhhbmRsZXI6IChldmVudDogQ2hhbm5lbENyZWF0ZWRFdmVudCkgPT4gdm9pZAopOiBTdWJzY3JpcHRpb24gewogICAgcmV0dXJuIGdldFdvcmtlckNvbnRleHQoKS5zdWJzY3JpYmVDaGFubmVsQ3JlYXRlZChoYW5kbGVyKTsKfQoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBJTlZPS0VSIElOVEVHUkFUSU9OCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmltcG9ydCB7CiAgICBSZXNwb25kZXIsCiAgICBCaWRpcmVjdGlvbmFsSW52b2tlciwKICAgIGNyZWF0ZVJlc3BvbmRlciwKICAgIGNyZWF0ZUludm9rZXIsCiAgICBkZXRlY3RDb250ZXh0VHlwZSwKICAgIGRldGVjdFRyYW5zcG9ydFR5cGUsCiAgICB0eXBlIENvbnRleHRUeXBlLAogICAgdHlwZSBJbmNvbWluZ0ludm9jYXRpb24KfSBmcm9tICIuLi9wcm94eS9JbnZva2VyIjsKCmxldCBXT1JLRVJfUkVTUE9OREVSOiBSZXNwb25kZXIgfCBudWxsID0gbnVsbDsKbGV0IFdPUktFUl9JTlZPS0VSOiBCaWRpcmVjdGlvbmFsSW52b2tlciB8IG51bGwgPSBudWxsOwoKLyoqCiAqIEdldCB0aGUgd29ya2VyJ3MgUmVzcG9uZGVyIChmb3IgaGFuZGxpbmcgaW5jb21pbmcgaW52b2NhdGlvbnMpCiAqLwpleHBvcnQgZnVuY3Rpb24gZ2V0V29ya2VyUmVzcG9uZGVyKGNoYW5uZWw/OiBzdHJpbmcpOiBSZXNwb25kZXIgewogICAgaWYgKCFXT1JLRVJfUkVTUE9OREVSKSB7CiAgICAgICAgV09SS0VSX1JFU1BPTkRFUiA9IGNyZWF0ZVJlc3BvbmRlcihjaGFubmVsID8/ICJ3b3JrZXIiKTsKICAgICAgICBXT1JLRVJfUkVTUE9OREVSLmxpc3RlbihzZWxmKTsKICAgIH0KICAgIHJldHVybiBXT1JLRVJfUkVTUE9OREVSOwp9CgovKioKICogR2V0IHRoZSB3b3JrZXIncyBiaWRpcmVjdGlvbmFsIEludm9rZXIKICovCmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JrZXJJbnZva2VyKGNoYW5uZWw/OiBzdHJpbmcpOiBCaWRpcmVjdGlvbmFsSW52b2tlciB7CiAgICBpZiAoIVdPUktFUl9JTlZPS0VSKSB7CiAgICAgICAgV09SS0VSX0lOVk9LRVIgPSBjcmVhdGVJbnZva2VyKGNoYW5uZWwgPz8gIndvcmtlciIpOwogICAgICAgIFdPUktFUl9JTlZPS0VSLmNvbm5lY3Qoc2VsZik7CiAgICB9CiAgICByZXR1cm4gV09SS0VSX0lOVk9LRVI7Cn0KCi8qKgogKiBFeHBvc2UgYW4gb2JqZWN0IGZvciByZW1vdGUgaW52b2NhdGlvbiBmcm9tIHRoZSB3b3JrZXIKICovCmV4cG9ydCBmdW5jdGlvbiBleHBvc2VGcm9tV29ya2VyKG5hbWU6IHN0cmluZywgb2JqOiBhbnkpOiB2b2lkIHsKICAgIGdldFdvcmtlclJlc3BvbmRlcigpLmV4cG9zZShuYW1lLCBvYmopOwp9CgovKioKICogU3Vic2NyaWJlIHRvIGluY29taW5nIGludm9jYXRpb25zIGluIHRoZSB3b3JrZXIKICovCmV4cG9ydCBmdW5jdGlvbiBvbldvcmtlckludm9jYXRpb24oCiAgICBoYW5kbGVyOiAoaW52OiBJbmNvbWluZ0ludm9jYXRpb24pID0+IHZvaWQKKTogU3Vic2NyaXB0aW9uIHsKICAgIHJldHVybiBnZXRXb3JrZXJSZXNwb25kZXIoKS5zdWJzY3JpYmVJbnZvY2F0aW9ucyhoYW5kbGVyKTsKfQoKLyoqCiAqIENyZWF0ZSBhIHByb3h5IHRvIGludm9rZSBtZXRob2RzIG9uIHRoZSBob3N0IGZyb20gdGhlIHdvcmtlcgogKi8KZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhvc3RQcm94eTxUID0gYW55Pihob3N0Q2hhbm5lbDogc3RyaW5nID0gImhvc3QiLCBiYXNlUGF0aDogc3RyaW5nW10gPSBbXSk6IFQgewogICAgcmV0dXJuIGdldFdvcmtlckludm9rZXIoKS5jcmVhdGVQcm94eTxUPihob3N0Q2hhbm5lbCwgYmFzZVBhdGgpOwp9CgovKioKICogSW1wb3J0IGEgbW9kdWxlIGluIHRoZSBob3N0IGNvbnRleHQgZnJvbSB0aGUgd29ya2VyCiAqLwpleHBvcnQgZnVuY3Rpb24gaW1wb3J0SW5Ib3N0PFQgPSBhbnk+KHVybDogc3RyaW5nLCBob3N0Q2hhbm5lbDogc3RyaW5nID0gImhvc3QiKTogUHJvbWlzZTxUPiB7CiAgICByZXR1cm4gZ2V0V29ya2VySW52b2tlcigpLmltcG9ydE1vZHVsZTxUPihob3N0Q2hhbm5lbCwgdXJsKTsKfQoKLy8gUmUtZXhwb3J0IGRldGVjdGlvbiB1dGlsaXRpZXMKZXhwb3J0IHsgZGV0ZWN0Q29udGV4dFR5cGUsIGRldGVjdFRyYW5zcG9ydFR5cGUgfTsKZXhwb3J0IHR5cGUgeyBDb250ZXh0VHlwZSwgSW5jb21pbmdJbnZvY2F0aW9uIH07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIEFVVE8tSU5JVElBTElaRSAoQ29tcGF0aWJsZSB3aXRoIGxlZ2FjeSB1c2FnZSkKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLy8gSW5pdGlhbGl6ZSB0aGUgd29ya2VyIGNvbnRleHQKY29uc3QgY3R4ID0gZ2V0V29ya2VyQ29udGV4dCh7IG5hbWU6ICJ3b3JrZXIiIH0pOwoKLy8gRXhwb3J0IGZvciBkaXJlY3QgYWNjZXNzCmV4cG9ydCB7IGN0eCBhcyB3b3JrZXJDb250ZXh0IH07Cg==", "" + import.meta.url);
var RemoteChannelHelper = class {
	constructor(_channel, _context, _options = {}) {
		this._channel = _channel;
		this._context = _context;
		this._options = _options;
		this._connection = getConnection(_channel);
		this._storage = getChannelStorage(_channel);
	}
	async request(path, action, args, options = {}) {
		let normalizedPath = typeof path === "string" ? [path] : path;
		let normalizedAction = action;
		let normalizedArgs = args;
		if (Array.isArray(action) && isReflectAction(path)) {
			options = args;
			normalizedArgs = action;
			normalizedAction = path;
			normalizedPath = [];
		}
		return this._context.getHost()?.request(normalizedPath, normalizedAction, normalizedArgs, options, this._channel);
	}
	async doImportModule(url, options = {}) {
		return this.request([], WReflectAction.IMPORT, [url], options);
	}
	async deferMessage(payload, options = {}) {
		return this._storage.defer({
			channel: this._channel,
			sender: this._context.hostName,
			type: "request",
			payload
		}, options);
	}
	async getPendingMessages() {
		return this._storage.getDeferredMessages(this._channel, { status: "pending" });
	}
	get connection() {
		return this._connection;
	}
	get channelName() {
		return this._channel;
	}
	get context() {
		return this._context;
	}
};
var ChannelHandler = class {
	get _forResolves() {
		return this._unified.__getPrivate("_pending");
	}
	get _subscriptions() {
		return this._unified.__getPrivate("_subscriptions");
	}
	get _broadcasts() {
		return this._unified.__getPrivate("_transports");
	}
	constructor(_channel, _context, _options = {}) {
		this._channel = _channel;
		this._context = _context;
		this._options = _options;
		this._connection = getConnectionPool().getOrCreate(_channel, "internal", _options);
		this._unified = new UnifiedChannel({
			name: _channel,
			autoListen: false,
			timeout: _options?.timeout
		});
	}
	createRemoteChannel(channel, options = {}, broadcast) {
		const transport = normalizeTransportBinding(broadcast ?? this._context.$createOrUseExistingRemote(channel, options, broadcast ?? null)?.messageChannel?.port1);
		const transportType = getDynamicTransportType(transport?.target ?? transport);
		this._unified.listen(transport?.target, { targetChannel: channel });
		if (transport) {
			this._broadcasts?.set?.(channel, transport);
			if (!(transportType === "self" && typeof postMessage === "undefined")) this._unified.connect(transport, { targetChannel: channel });
			this._context.$registerConnection({
				localChannel: this._channel,
				remoteChannel: channel,
				sender: this._channel,
				direction: "outgoing",
				transportType
			});
			this.notifyChannel(channel, {
				contextId: this._context.id,
				contextName: this._context.hostName
			}, "connect");
		}
		return new RemoteChannelHelper(channel, this._context, options);
	}
	getChannel() {
		return this._channel;
	}
	get connection() {
		return this._connection;
	}
	request(path, action, args, options = {}, toChannel = "worker") {
		let normalizedPath = typeof path === "string" ? [path] : path;
		let normalizedArgs = args;
		if (Array.isArray(action) && isReflectAction(path)) {
			toChannel = options;
			options = args;
			normalizedArgs = action;
			action = path;
			normalizedPath = [];
		}
		return this._unified.invoke(toChannel, action, normalizedPath ?? [], Array.isArray(normalizedArgs) ? normalizedArgs : [normalizedArgs]);
	}
	resolveResponse(reqId, result) {
		this._forResolves.get(reqId)?.resolve?.(result);
		const promise = this._forResolves.get(reqId)?.promise;
		this._forResolves.delete(reqId);
		return promise;
	}
	async handleAndResponse(request, reqId, responseFn) {}
	notifyChannel(targetChannel, payload = {}, type = "notify") {
		return this._unified.notify(targetChannel, {
			...payload,
			from: this._channel,
			to: targetChannel
		}, type);
	}
	getConnectedChannels() {
		return this._unified.connectedChannels;
	}
	close() {
		this._subscriptions.forEach((s) => s.unsubscribe());
		this._forResolves.clear();
		this._broadcasts?.values?.()?.forEach((transport) => transport.close?.());
		this._broadcasts?.clear?.();
		this._unified.close();
	}
	get unified() {
		return this._unified;
	}
};
/**
* Channel Context - Manages multiple channels in a single context
*
* Use this when you need multiple independent channels in the same
* JavaScript context (same window, iframe, worker, etc.)
*
* Supports:
* - Creating multiple channels at once or deferred
* - Dynamic transport addition (workers, ports, sockets, etc.)
* - Global self/globalThis as default target
*/
var ChannelContext = class {
	constructor(_options = {}) {
		this._options = _options;
		this._id = UUIDv4();
		this._host = null;
		this._endpoints = /* @__PURE__ */ new Map();
		this._unifiedByChannel = /* @__PURE__ */ new Map();
		this._unifiedConnectionSubs = /* @__PURE__ */ new Map();
		this._remoteChannels = /* @__PURE__ */ new Map();
		this._deferredChannels = /* @__PURE__ */ new Map();
		this._connectionEvents = new ChannelSubject({ bufferSize: 200 });
		this._connectionRegistry = new ConnectionRegistry(() => UUIDv4(), (event) => this._emitConnectionEvent(event));
		this._closed = false;
		this._globalSelf = null;
		this._hostName = _options.name ?? `ctx-${this._id.slice(0, 8)}`;
		if (_options.useGlobalSelf !== false) this._globalSelf = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : null;
	}
	/**
	* Initialize/get the host channel for this context
	*/
	initHost(name) {
		if (this._host && !name) return this._host;
		const hostName = name ?? this._hostName;
		this._hostName = hostName;
		if (this._endpoints.has(hostName)) {
			this._host = this._endpoints.get(hostName).handler;
			return this._host;
		}
		this._host = new ChannelHandler(hostName, this, this._options.defaultOptions);
		const endpoint = {
			name: hostName,
			handler: this._host,
			connection: this._host.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: this._host.unified
		};
		this._endpoints.set(hostName, endpoint);
		this._registerUnifiedChannel(hostName, this._host.unified);
		return this._host;
	}
	/**
	* Get the host channel
	*/
	getHost() {
		return this._host ?? this.initHost();
	}
	/**
	* Get host name
	*/
	get hostName() {
		return this._hostName;
	}
	/**
	* Get context ID
	*/
	get id() {
		return this._id;
	}
	/**
	* Observable: connection events in this context
	*/
	get onConnection() {
		return this._connectionEvents;
	}
	/**
	* Subscribe to connection events
	*/
	subscribeConnections(handler) {
		return this._connectionEvents.subscribe(handler);
	}
	/**
	* Notify all currently known active connections.
	* Useful for service worker / cross-tab handshakes.
	*/
	notifyConnections(payload = {}, query = {}) {
		let sent = 0;
		for (const endpoint of this._endpoints.values()) {
			const connectedTargets = endpoint.handler.getConnectedChannels();
			for (const remoteChannel of connectedTargets) {
				if (query.localChannel && query.localChannel !== endpoint.name) continue;
				if (query.remoteChannel && query.remoteChannel !== remoteChannel) continue;
				const existing = this.queryConnections({
					localChannel: endpoint.name,
					remoteChannel,
					status: "active"
				})[0];
				if (query.sender && existing?.sender !== query.sender) continue;
				if (query.transportType && existing?.transportType !== query.transportType) continue;
				if (query.channel && query.channel !== endpoint.name && query.channel !== remoteChannel) continue;
				if (endpoint.handler.notifyChannel(remoteChannel, payload, "notify")) sent++;
			}
		}
		return sent;
	}
	/**
	* Query tracked connections with filters
	*/
	queryConnections(query = {}) {
		return this._connectionRegistry.query(query).map((connection) => ({
			...connection,
			contextId: this._id
		}));
	}
	/**
	* Create a new channel endpoint in this context
	*
	* @param name - Channel name
	* @param options - Connection options
	* @returns ChannelEndpoint with handler and connection
	*/
	createChannel(name, options = {}) {
		if (this._endpoints.has(name)) return this._endpoints.get(name);
		const handler = new ChannelHandler(name, this, {
			...this._options.defaultOptions,
			...options
		});
		const endpoint = {
			name,
			handler,
			connection: handler.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: handler.unified
		};
		this._endpoints.set(name, endpoint);
		this._registerUnifiedChannel(name, handler.unified);
		return endpoint;
	}
	/**
	* Create multiple channel endpoints at once
	*
	* @param names - Array of channel names
	* @param options - Shared connection options
	* @returns Map of channel names to endpoints
	*/
	createChannels(names, options = {}) {
		const result = /* @__PURE__ */ new Map();
		for (const name of names) result.set(name, this.createChannel(name, options));
		return result;
	}
	/**
	* Get an existing channel endpoint
	*/
	getChannel(name) {
		return this._endpoints.get(name);
	}
	/**
	* Get or create a channel endpoint
	*/
	getOrCreateChannel(name, options = {}) {
		return this._endpoints.get(name) ?? this.createChannel(name, options);
	}
	/**
	* Check if channel exists in this context
	*/
	hasChannel(name) {
		return this._endpoints.has(name);
	}
	/**
	* Get all channel names in this context
	*/
	getChannelNames() {
		return [...this._endpoints.keys()];
	}
	/**
	* Get total number of channels
	*/
	get size() {
		return this._endpoints.size;
	}
	/**
	* Register a deferred channel that will be initialized on first use
	*
	* @param name - Channel name
	* @param initFn - Function to initialize the channel
	*/
	defer(name, initFn) {
		this._deferredChannels.set(name, initFn);
	}
	/**
	* Initialize a previously deferred channel
	*/
	async initDeferred(name) {
		const initFn = this._deferredChannels.get(name);
		if (!initFn) return null;
		const endpoint = await initFn();
		this._endpoints.set(name, endpoint);
		this._deferredChannels.delete(name);
		return endpoint;
	}
	/**
	* Check if channel is deferred (not yet initialized)
	*/
	isDeferred(name) {
		return this._deferredChannels.has(name);
	}
	/**
	* Get channel, initializing deferred if needed
	*/
	async getChannelAsync(name) {
		if (this._endpoints.has(name)) return this._endpoints.get(name);
		if (this._deferredChannels.has(name)) return this.initDeferred(name);
		return null;
	}
	/**
	* Add a Worker channel dynamically
	*
	* @param name - Channel name
	* @param worker - Worker instance, URL, or code string
	* @param options - Connection options
	*/
	async addWorker(name, worker, options = {}) {
		const workerInstance = loadWorker(worker);
		if (!workerInstance) throw new Error(`Failed to create worker for channel: ${name}`);
		const handler = new ChannelHandler(name, this, {
			...this._options.defaultOptions,
			...options
		});
		const ready = handler.createRemoteChannel(name, options, workerInstance);
		const endpoint = {
			name,
			handler,
			connection: handler.connection,
			subscriptions: [],
			transportType: "worker",
			ready: Promise.resolve(ready),
			unified: handler.unified
		};
		this._endpoints.set(name, endpoint);
		this._registerUnifiedChannel(name, handler.unified);
		this._remoteChannels.set(name, {
			channel: name,
			context: this,
			remote: Promise.resolve(ready),
			transport: workerInstance,
			transportType: "worker"
		});
		return endpoint;
	}
	/**
	* Add a MessagePort channel dynamically
	*
	* @param name - Channel name
	* @param port - MessagePort instance
	* @param options - Connection options
	*/
	async addPort(name, port, options = {}) {
		const handler = new ChannelHandler(name, this, {
			...this._options.defaultOptions,
			...options
		});
		port.start?.();
		const ready = handler.createRemoteChannel(name, options, port);
		const endpoint = {
			name,
			handler,
			connection: handler.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: Promise.resolve(ready),
			unified: handler.unified
		};
		this._endpoints.set(name, endpoint);
		this._registerUnifiedChannel(name, handler.unified);
		this._remoteChannels.set(name, {
			channel: name,
			context: this,
			remote: Promise.resolve(ready),
			transport: port,
			transportType: "message-port"
		});
		return endpoint;
	}
	/**
	* Add a BroadcastChannel dynamically
	*
	* @param name - Channel name (also used as BroadcastChannel name if not provided)
	* @param broadcastName - Optional BroadcastChannel name (defaults to channel name)
	* @param options - Connection options
	*/
	async addBroadcast(name, broadcastName, options = {}) {
		const bc = new BroadcastChannel(broadcastName ?? name);
		const handler = new ChannelHandler(name, this, {
			...this._options.defaultOptions,
			...options
		});
		const ready = handler.createRemoteChannel(name, options, bc);
		const endpoint = {
			name,
			handler,
			connection: handler.connection,
			subscriptions: [],
			transportType: "broadcast",
			ready: Promise.resolve(ready),
			unified: handler.unified
		};
		this._endpoints.set(name, endpoint);
		this._registerUnifiedChannel(name, handler.unified);
		this._remoteChannels.set(name, {
			channel: name,
			context: this,
			remote: Promise.resolve(ready),
			transport: bc,
			transportType: "broadcast"
		});
		return endpoint;
	}
	/**
	* Add a channel using self/globalThis (for same-context communication)
	*
	* @param name - Channel name
	* @param options - Connection options
	*/
	addSelfChannel(name, options = {}) {
		const handler = new ChannelHandler(name, this, {
			...this._options.defaultOptions,
			...options
		});
		const selfTarget = this._globalSelf ?? (typeof self !== "undefined" ? self : null);
		const endpoint = {
			name,
			handler,
			connection: handler.connection,
			subscriptions: [],
			transportType: "self",
			ready: Promise.resolve(selfTarget ? handler.createRemoteChannel(name, options, selfTarget) : null),
			unified: handler.unified
		};
		this._endpoints.set(name, endpoint);
		this._registerUnifiedChannel(name, handler.unified);
		return endpoint;
	}
	/**
	* Add channel with dynamic transport configuration
	*
	* @param name - Channel name
	* @param config - Transport configuration
	*/
	async addTransport(name, config) {
		const options = config.options ?? {};
		switch (config.type) {
			case "worker":
				if (!config.worker) throw new Error("Worker required for worker transport");
				return this.addWorker(name, config.worker, options);
			case "message-port":
				if (!config.port) throw new Error("Port required for message-port transport");
				return this.addPort(name, config.port, options);
			case "broadcast":
				const bcName = typeof config.broadcast === "string" ? config.broadcast : void 0;
				return this.addBroadcast(name, bcName, options);
			case "self": return this.addSelfChannel(name, options);
			default: return this.createChannel(name, options);
		}
	}
	/**
	* Create a MessageChannel pair for bidirectional communication
	*
	* @param name1 - First channel name
	* @param name2 - Second channel name
	* @returns Both endpoints connected via MessageChannel
	*/
	createChannelPair(name1, name2, options = {}) {
		const mc = new MessageChannel();
		const handler1 = new ChannelHandler(name1, this, {
			...this._options.defaultOptions,
			...options
		});
		const handler2 = new ChannelHandler(name2, this, {
			...this._options.defaultOptions,
			...options
		});
		mc.port1.start();
		mc.port2.start();
		const ready1 = Promise.resolve(handler1.createRemoteChannel(name2, options, mc.port1));
		const ready2 = Promise.resolve(handler2.createRemoteChannel(name1, options, mc.port2));
		const channel1 = {
			name: name1,
			handler: handler1,
			connection: handler1.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: ready1,
			unified: handler1.unified
		};
		const channel2 = {
			name: name2,
			handler: handler2,
			connection: handler2.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: ready2,
			unified: handler2.unified
		};
		this._endpoints.set(name1, channel1);
		this._endpoints.set(name2, channel2);
		this._registerUnifiedChannel(name1, handler1.unified);
		this._registerUnifiedChannel(name2, handler2.unified);
		return {
			channel1,
			channel2,
			messageChannel: mc
		};
	}
	/**
	* Get the global self reference
	*/
	get globalSelf() {
		return this._globalSelf;
	}
	/**
	* Connect to a remote channel (e.g., in a Worker)
	*/
	async connectRemote(channelName, options = {}, broadcast) {
		this.initHost();
		return this._host.createRemoteChannel(channelName, options, broadcast);
	}
	/**
	* Import a module in a remote channel
	*/
	async importModuleInChannel(channelName, url, options = {}, broadcast) {
		return (await this.connectRemote(channelName, options.channelOptions, broadcast))?.doImportModule?.(url, options.importOptions);
	}
	/**
	* Internal: Create or use existing remote channel
	*/
	$createOrUseExistingRemote(channel, options = {}, broadcast) {
		if (channel == null || broadcast) return null;
		if (this._remoteChannels.has(channel)) return this._remoteChannels.get(channel);
		const msgChannel = new MessageChannel();
		const promise = Promised(new Promise((resolve) => {
			const worker = loadWorker(workerCode);
			worker?.addEventListener?.("message", (event) => {
				if (event.data.type === "channelCreated") {
					msgChannel.port1?.start?.();
					resolve(new RemoteChannelHelper(event.data.channel, this, options));
				}
			});
			worker?.postMessage?.({
				type: "createChannel",
				channel,
				sender: this._hostName,
				options,
				messagePort: msgChannel.port2
			}, { transfer: [msgChannel.port2] });
		}));
		const info = {
			channel,
			context: this,
			messageChannel: msgChannel,
			remote: promise
		};
		this._remoteChannels.set(channel, info);
		return info;
	}
	$registerConnection(params) {
		return {
			...this._connectionRegistry.register(params),
			contextId: this._id
		};
	}
	$markNotified(params) {
		const connection = this._connectionRegistry.register({
			localChannel: params.localChannel,
			remoteChannel: params.remoteChannel,
			sender: params.sender,
			direction: params.direction,
			transportType: params.transportType
		});
		this._connectionRegistry.markNotified(connection, params.payload);
	}
	$observeSignal(params) {
		const direction = (params.payload?.type ?? "notify") === "connect" ? "incoming" : "incoming";
		this.$markNotified({
			localChannel: params.localChannel,
			remoteChannel: params.remoteChannel,
			sender: params.sender,
			direction,
			transportType: params.transportType,
			payload: params.payload
		});
	}
	$forwardUnifiedConnectionEvent(channel, event) {
		const mappedTransportType = event.connection.transportType ?? "internal";
		const connection = this._connectionRegistry.register({
			localChannel: event.connection.localChannel || channel,
			remoteChannel: event.connection.remoteChannel,
			sender: event.connection.sender,
			direction: event.connection.direction,
			transportType: mappedTransportType,
			metadata: event.connection.metadata
		});
		if (event.type === "notified") this._connectionRegistry.markNotified(connection, event.payload);
		else if (event.type === "disconnected") this._connectionRegistry.closeByChannel(event.connection.localChannel);
	}
	/**
	* Close a specific channel
	*/
	closeChannel(name) {
		const endpoint = this._endpoints.get(name);
		if (!endpoint) return false;
		endpoint.subscriptions.forEach((s) => s.unsubscribe());
		endpoint.handler.close();
		endpoint.transport?.detach();
		this._unifiedConnectionSubs.get(name)?.unsubscribe();
		this._unifiedConnectionSubs.delete(name);
		this._unifiedByChannel.delete(name);
		this._endpoints.delete(name);
		if (name === this._hostName) this._host = null;
		this._connectionRegistry.closeByChannel(name);
		return true;
	}
	/**
	* Close all channels and cleanup
	*/
	close() {
		if (this._closed) return;
		this._closed = true;
		for (const [name] of this._endpoints) this.closeChannel(name);
		this._remoteChannels.clear();
		this._host = null;
		this._unifiedConnectionSubs.forEach((sub) => sub.unsubscribe());
		this._unifiedConnectionSubs.clear();
		this._unifiedByChannel.clear();
		this._connectionRegistry.clear();
		this._connectionEvents.complete();
	}
	/**
	* Check if context is closed
	*/
	get closed() {
		return this._closed;
	}
	_registerUnifiedChannel(name, unified) {
		this._unifiedByChannel.set(name, unified);
		this._unifiedConnectionSubs.get(name)?.unsubscribe();
		const subscription = unified.subscribeConnections((event) => {
			this.$forwardUnifiedConnectionEvent(name, event);
		});
		this._unifiedConnectionSubs.set(name, subscription);
	}
	_emitConnectionEvent(event) {
		this._connectionEvents.next({
			...event,
			connection: {
				...event.connection,
				contextId: this._id
			}
		});
	}
};
function isReflectAction(action) {
	return [...Object.values(WReflectAction)].includes(action);
}
function normalizeTransportBinding(target) {
	if (!target) return null;
	if (isTransportBinding(target)) return target;
	const nativeTarget = target;
	const transportType = getDynamicTransportType(nativeTarget);
	return {
		target: nativeTarget,
		targetChannel: "unknown",
		transportType: transportType === "internal" ? "self" : transportType,
		sender: (message, transfer) => {
			if (typeof WebSocket !== "undefined" && nativeTarget instanceof WebSocket) {
				nativeTarget.send(JSON.stringify(message));
				return;
			}
			nativeTarget.postMessage?.(message, transfer?.length ? { transfer } : void 0);
		},
		postMessage: (message, options) => {
			nativeTarget.postMessage?.(message, options);
		},
		addEventListener: nativeTarget.addEventListener?.bind(nativeTarget),
		removeEventListener: nativeTarget.removeEventListener?.bind(nativeTarget),
		start: nativeTarget.start?.bind(nativeTarget),
		close: nativeTarget.close?.bind(nativeTarget)
	};
}
function isTransportBinding(value) {
	return !!value && typeof value === "object" && "target" in value && typeof value.postMessage === "function";
}
function getDynamicTransportType(target) {
	const effectiveTarget = isTransportBinding(target) ? target.target : target;
	if (!effectiveTarget) return "internal";
	if (effectiveTarget === "chrome-runtime") return "chrome-runtime";
	if (effectiveTarget === "chrome-tabs") return "chrome-tabs";
	if (effectiveTarget === "chrome-port") return "chrome-port";
	if (effectiveTarget === "chrome-external") return "chrome-external";
	if (typeof MessagePort !== "undefined" && effectiveTarget instanceof MessagePort) return "message-port";
	if (typeof BroadcastChannel !== "undefined" && effectiveTarget instanceof BroadcastChannel) return "broadcast";
	if (typeof Worker !== "undefined" && effectiveTarget instanceof Worker) return "worker";
	if (typeof WebSocket !== "undefined" && effectiveTarget instanceof WebSocket) return "websocket";
	if (typeof chrome !== "undefined" && typeof effectiveTarget === "object" && effectiveTarget && typeof effectiveTarget.postMessage === "function" && effectiveTarget.onMessage?.addListener) return "chrome-port";
	if (typeof self !== "undefined" && effectiveTarget === self) return "self";
	return "internal";
}
function loadWorker(WX) {
	if (WX instanceof Worker) return WX;
	if (WX instanceof URL) return new Worker(WX.href, { type: "module" });
	if (typeof WX === "function") try {
		return new WX({ type: "module" });
	} catch {
		return WX({ type: "module" });
	}
	if (typeof WX === "string") {
		if (WX.startsWith("/")) return new Worker(new URL(WX.replace(/^\//, "./"), import.meta.url).href, { type: "module" });
		if (URL.canParse(WX) || WX.startsWith("./")) return new Worker(new URL(WX, import.meta.url).href, { type: "module" });
		return new Worker(URL.createObjectURL(new Blob([WX], { type: "application/javascript" })), { type: "module" });
	}
	if (WX instanceof Blob || WX instanceof File) return new Worker(URL.createObjectURL(WX), { type: "module" });
	return WX ?? (typeof self !== "undefined" ? self : null);
}
/** Global context registry for shared contexts */
const CONTEXT_REGISTRY = /* @__PURE__ */ new Map();
/**
* Create a new channel context
*
* Use this for isolated channel management in components
*/
function createChannelContext(options = {}) {
	const ctx = new ChannelContext(options);
	if (options.name) CONTEXT_REGISTRY.set(options.name, ctx);
	return ctx;
}
//#endregion
//#region shared/fest/uniform/newer/next/transport/Worker.ts
/**
* Worker Entry Point - Multi-Channel Support
*
* This worker context supports:
* - Multiple channel creation/initialization
* - Observing new incoming channel connections
* - Dynamic channel addition after initialization
* - Connection from remote/host contexts
*/
/**
* WorkerContext - Manages channels within a Worker
*
* Supports observing new incoming connections from host/remote contexts.
*/
var WorkerContext = class {
	constructor(config = {}) {
		this._subscriptions = [];
		this._incomingConnections = new ChannelSubject({ bufferSize: 100 });
		this._channelCreated = new ChannelSubject({ bufferSize: 100 });
		this._channelClosed = new ChannelSubject();
		this._config = {
			name: config.name ?? "worker",
			workerName: config.workerName ?? `worker-${UUIDv4().slice(0, 8)}`,
			autoAcceptChannels: config.autoAcceptChannels ?? true,
			allowedChannels: config.allowedChannels ?? [],
			maxChannels: config.maxChannels ?? 100,
			autoConnect: config.autoConnect ?? true,
			useGlobalSelf: true,
			defaultOptions: config.defaultOptions ?? {},
			isolatedStorage: config.isolatedStorage ?? false,
			...config
		};
		this._context = createChannelContext({
			name: this._config.name,
			useGlobalSelf: true,
			defaultOptions: config.defaultOptions
		});
		this._setupMessageListener();
	}
	/**
	* Observable: New incoming connection requests
	*/
	get onConnection() {
		return this._incomingConnections;
	}
	/**
	* Observable: Channel created events
	*/
	get onChannelCreated() {
		return this._channelCreated;
	}
	/**
	* Observable: Channel closed events
	*/
	get onChannelClosed() {
		return this._channelClosed;
	}
	/**
	* Subscribe to incoming connections
	*/
	subscribeConnections(handler) {
		return this._incomingConnections.subscribe(handler);
	}
	/**
	* Subscribe to channel creation
	*/
	subscribeChannelCreated(handler) {
		return this._channelCreated.subscribe(handler);
	}
	/**
	* Accept an incoming connection and create the channel
	*/
	acceptConnection(connection) {
		if (!this._canAcceptChannel(connection.channel)) return null;
		const endpoint = this._context.createChannel(connection.channel, connection.options);
		if (connection.port) {
			connection.port.start?.();
			endpoint.handler.createRemoteChannel(connection.sender, connection.options, connection.port);
		}
		this._channelCreated.next({
			channel: connection.channel,
			endpoint,
			sender: connection.sender,
			timestamp: Date.now()
		});
		this._postChannelCreated(connection.channel, connection.sender, connection.id);
		return endpoint;
	}
	/**
	* Create a new channel in this worker context
	*/
	createChannel(name, options) {
		return this._context.createChannel(name, options);
	}
	/**
	* Get an existing channel
	*/
	getChannel(name) {
		return this._context.getChannel(name);
	}
	/**
	* Check if channel exists
	*/
	hasChannel(name) {
		return this._context.hasChannel(name);
	}
	/**
	* Get all channel names
	*/
	getChannelNames() {
		return this._context.getChannelNames();
	}
	/**
	* Query currently tracked channel connections in this worker.
	*/
	queryConnections(query = {}) {
		return this._context.queryConnections(query);
	}
	/**
	* Notify active connections (useful for worker<->host sync).
	*/
	notifyConnections(payload = {}, query = {}) {
		return this._context.notifyConnections(payload, query);
	}
	/**
	* Close a specific channel
	*/
	closeChannel(name) {
		const closed = this._context.closeChannel(name);
		if (closed) this._channelClosed.next({
			channel: name,
			timestamp: Date.now()
		});
		return closed;
	}
	/**
	* Get the underlying context
	*/
	get context() {
		return this._context;
	}
	/**
	* Get worker configuration
	*/
	get config() {
		return this._config;
	}
	_setupMessageListener() {
		addEventListener("message", ((event) => {
			this._handleIncomingMessage(event);
		}));
	}
	_handleIncomingMessage(event) {
		const data = event.data;
		if (!data || typeof data !== "object") return;
		switch (data.type) {
			case "createChannel":
				this._handleCreateChannel(data);
				break;
			case "connectChannel":
				this._handleConnectChannel(data);
				break;
			case "addPort":
				this._handleAddPort(data);
				break;
			case "listChannels":
				this._handleListChannels(data);
				break;
			case "closeChannel":
				this._handleCloseChannel(data);
				break;
			case "ping":
				postMessage({
					type: "pong",
					id: data.id,
					timestamp: Date.now()
				});
				break;
			default: if (data.channel && this._context.hasChannel(data.channel)) (this._context.getChannel(data.channel)?.handler)?.handleAndResponse?.(data.payload, data.reqId);
		}
	}
	_handleCreateChannel(data) {
		const connection = {
			id: data.reqId ?? UUIDv4(),
			channel: data.channel,
			sender: data.sender ?? "unknown",
			type: "channel",
			port: data.messagePort,
			timestamp: Date.now(),
			options: data.options
		};
		this._incomingConnections.next(connection);
		if (this._config.autoAcceptChannels) this.acceptConnection(connection);
	}
	_handleConnectChannel(data) {
		const connection = {
			id: data.reqId ?? UUIDv4(),
			channel: data.channel,
			sender: data.sender ?? "unknown",
			type: data.portType ?? "channel",
			port: data.port,
			timestamp: Date.now(),
			options: data.options
		};
		this._incomingConnections.next(connection);
		if (this._config.autoAcceptChannels && this._canAcceptChannel(data.channel)) {
			const endpoint = this._context.getOrCreateChannel(data.channel, data.options);
			if (data.port) {
				data.port.start?.();
				endpoint.handler.createRemoteChannel(data.sender, data.options, data.port);
			}
			postMessage({
				type: "channelConnected",
				channel: data.channel,
				reqId: data.reqId
			});
		}
	}
	_handleAddPort(data) {
		if (!data.port || !data.channel) return;
		const connection = {
			id: data.reqId ?? UUIDv4(),
			channel: data.channel,
			sender: data.sender ?? "unknown",
			type: "port",
			port: data.port,
			timestamp: Date.now(),
			options: data.options
		};
		this._incomingConnections.next(connection);
		if (this._config.autoAcceptChannels) this.acceptConnection(connection);
	}
	_handleListChannels(data) {
		postMessage({
			type: "channelList",
			channels: this.getChannelNames(),
			reqId: data.reqId
		});
	}
	_handleCloseChannel(data) {
		if (data.channel) {
			this.closeChannel(data.channel);
			postMessage({
				type: "channelClosed",
				channel: data.channel,
				reqId: data.reqId
			});
		}
	}
	_canAcceptChannel(channel) {
		if (this._context.size >= this._config.maxChannels) return false;
		if (this._config.allowedChannels.length > 0) return this._config.allowedChannels.includes(channel);
		return true;
	}
	_postChannelCreated(channel, sender, reqId) {
		postMessage({
			type: "channelCreated",
			channel,
			sender,
			reqId,
			timestamp: Date.now()
		});
	}
	close() {
		this._subscriptions.forEach((s) => s.unsubscribe());
		this._subscriptions = [];
		this._incomingConnections.complete();
		this._channelCreated.complete();
		this._channelClosed.complete();
		this._context.close();
	}
};
let WORKER_CONTEXT = null;
/**
* Get or create the worker context singleton
*/
function getWorkerContext(config) {
	if (!WORKER_CONTEXT) WORKER_CONTEXT = new WorkerContext(config);
	return WORKER_CONTEXT;
}
getWorkerContext({ name: "worker" });
(class AtomicsRingBuffer {
	static {
		this.META_SIZE = 16;
	}
	static {
		this.WRITE_IDX = 0;
	}
	static {
		this.READ_IDX = 4;
	}
	static {
		this.OVERFLOW = 8;
	}
	constructor(bufferOrConfig = {}) {
		if (bufferOrConfig instanceof SharedArrayBuffer) {
			this._buffer = bufferOrConfig;
			this._slotCount = 64;
			this._slotSize = (this._buffer.byteLength - AtomicsRingBuffer.META_SIZE) / this._slotCount;
		} else {
			this._slotSize = bufferOrConfig.slotSize ?? 1024;
			this._slotCount = bufferOrConfig.slotCount ?? 64;
			this._slotCount = 1 << Math.ceil(Math.log2(this._slotCount));
			const totalSize = AtomicsRingBuffer.META_SIZE + this._slotSize * this._slotCount;
			this._buffer = new SharedArrayBuffer(totalSize);
		}
		this._meta = new Int32Array(this._buffer, 0, AtomicsRingBuffer.META_SIZE / 4);
		this._data = new Uint8Array(this._buffer, AtomicsRingBuffer.META_SIZE);
		this._mask = this._slotCount - 1;
	}
	/**
	* Write message to ring buffer (non-blocking)
	*/
	write(data) {
		if (data.byteLength > this._slotSize - 4) return false;
		const writeIdx = Atomics.load(this._meta, AtomicsRingBuffer.WRITE_IDX);
		const readIdx = Atomics.load(this._meta, AtomicsRingBuffer.READ_IDX);
		if ((writeIdx + 1 & this._mask) === (readIdx & this._mask)) {
			Atomics.add(this._meta, AtomicsRingBuffer.OVERFLOW, 1);
			return false;
		}
		const slot = (writeIdx & this._mask) * this._slotSize;
		new DataView(this._buffer, AtomicsRingBuffer.META_SIZE + slot).setUint32(0, data.byteLength, true);
		this._data.set(data, slot + 4);
		Atomics.store(this._meta, AtomicsRingBuffer.WRITE_IDX, writeIdx + 1);
		Atomics.notify(this._meta, AtomicsRingBuffer.WRITE_IDX);
		return true;
	}
	/**
	* Read message from ring buffer (non-blocking)
	*/
	read() {
		const writeIdx = Atomics.load(this._meta, AtomicsRingBuffer.WRITE_IDX);
		const readIdx = Atomics.load(this._meta, AtomicsRingBuffer.READ_IDX);
		if (readIdx === writeIdx) return null;
		const slot = (readIdx & this._mask) * this._slotSize;
		const size = new DataView(this._buffer, AtomicsRingBuffer.META_SIZE + slot).getUint32(0, true);
		if (size === 0 || size > this._slotSize - 4) return null;
		const data = new Uint8Array(size);
		data.set(this._data.subarray(slot + 4, slot + 4 + size));
		Atomics.store(this._meta, AtomicsRingBuffer.READ_IDX, readIdx + 1);
		return data;
	}
	/**
	* Wait for data to be available
	*/
	async waitRead(timeout) {
		const writeIdx = Atomics.load(this._meta, AtomicsRingBuffer.WRITE_IDX);
		if (Atomics.load(this._meta, AtomicsRingBuffer.READ_IDX) < writeIdx) return this.read();
		if ("waitAsync" in Atomics) {
			if (await Atomics.waitAsync(this._meta, AtomicsRingBuffer.WRITE_IDX, writeIdx, timeout ?? 1e3).value === "ok") return this.read();
		} else {
			await new Promise((r) => setTimeout(r, Math.min(timeout ?? 1e3, 100)));
			return this.read();
		}
		return null;
	}
	get buffer() {
		return this._buffer;
	}
	get available() {
		return Atomics.load(this._meta, AtomicsRingBuffer.WRITE_IDX) - Atomics.load(this._meta, AtomicsRingBuffer.READ_IDX) & this._mask;
	}
	get overflow() {
		return Atomics.load(this._meta, AtomicsRingBuffer.OVERFLOW);
	}
});
//#endregion
//#region shared/fest/uniform/newer/next/transport/PortTransport.ts
/**
* MessagePort/MessageChannel Enhanced Transport
*
* Advanced port-based communication with:
* - MessageChannel pair creation
* - Port pooling and management
* - Cross-context transfer (iframe, worker, window)
* - Automatic reconnection
* - Request/response with timeout
*/
var PortTransport = class {
	constructor(port, _channelName, _config = {}) {
		this._channelName = _channelName;
		this._config = _config;
		this._subs = /* @__PURE__ */ new Set();
		this._pending = /* @__PURE__ */ new Map();
		this._listening = false;
		this._cleanup = null;
		this._portId = UUIDv4();
		this._state = new ChannelSubject();
		this._keepAliveTimer = null;
		this._port = port;
		this._setupPort();
		if (_config.autoStart !== false) this.start();
	}
	_setupPort() {
		const msgHandler = (e) => {
			const data = e.data;
			if (data.type === "response" && data.reqId) {
				const p = this._pending.get(data.reqId);
				if (p) {
					this._pending.delete(data.reqId);
					if (data.payload?.error) p.reject(new Error(data.payload.error));
					else p.resolve(data.payload?.result ?? data.payload);
					return;
				}
			}
			if (data.type === "signal" && data.payload?.action === "ping") {
				this.send({
					id: UUIDv4(),
					channel: this._channelName,
					sender: this._portId,
					type: "signal",
					payload: { action: "pong" }
				});
				return;
			}
			data.portId = data.portId ?? this._portId;
			for (const s of this._subs) try {
				s.next?.(data);
			} catch (e) {
				s.error?.(e);
			}
		};
		const errHandler = () => {
			this._state.next("error");
			const err = /* @__PURE__ */ new Error("Port error");
			for (const s of this._subs) s.error?.(err);
		};
		this._port.addEventListener("message", msgHandler);
		this._port.addEventListener("messageerror", errHandler);
		this._cleanup = () => {
			this._port.removeEventListener("message", msgHandler);
			this._port.removeEventListener("messageerror", errHandler);
		};
	}
	start() {
		if (this._listening) return;
		this._port.start();
		this._listening = true;
		this._state.next("ready");
		if (this._config.keepAlive) this._startKeepAlive();
	}
	send(msg, transfer) {
		const { transferable, ...data } = msg;
		this._port.postMessage({
			...data,
			portId: this._portId
		}, transfer ?? []);
	}
	request(msg) {
		const reqId = msg.reqId ?? UUIDv4();
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this._pending.delete(reqId);
				reject(/* @__PURE__ */ new Error("Request timeout"));
			}, this._config.timeout ?? 3e4);
			this._pending.set(reqId, {
				resolve: (v) => {
					clearTimeout(timeout);
					resolve(v);
				},
				reject: (e) => {
					clearTimeout(timeout);
					reject(e);
				},
				timestamp: Date.now()
			});
			this.send({
				...msg,
				reqId,
				type: "request"
			});
		});
	}
	subscribe(observer) {
		const obs = typeof observer === "function" ? { next: observer } : observer;
		this._subs.add(obs);
		return {
			closed: false,
			unsubscribe: () => {
				this._subs.delete(obs);
			}
		};
	}
	_startKeepAlive() {
		this._keepAliveTimer = setInterval(() => {
			this.send({
				id: UUIDv4(),
				channel: this._channelName,
				sender: this._portId,
				type: "signal",
				payload: { action: "ping" }
			});
		}, this._config.keepAliveInterval ?? 3e4);
	}
	close() {
		if (this._keepAliveTimer) {
			clearInterval(this._keepAliveTimer);
			this._keepAliveTimer = null;
		}
		this._cleanup?.();
		this._subs.forEach((s) => s.complete?.());
		this._subs.clear();
		this._port.close();
		this._state.next("closed");
	}
	get port() {
		return this._port;
	}
	get portId() {
		return this._portId;
	}
	get isListening() {
		return this._listening;
	}
	get state() {
		return this._state;
	}
	get channelName() {
		return this._channelName;
	}
};
/**
* Create a MessageChannel pair with configured local transport
*/
function createChannelPair(channelName, config) {
	const channel = new MessageChannel();
	return {
		local: new PortTransport(channel.port1, channelName, config),
		remote: channel.port2,
		transfer: () => {
			return channel.port2;
		}
	};
}
/**
* Connect to window/iframe via MessageChannel
*/
var WindowPortConnector = class {
	constructor(_target, _channelName, _config = {}) {
		this._target = _target;
		this._channelName = _channelName;
		this._config = _config;
		this._transport = null;
		this._state = new ChannelSubject();
		this._handshakeComplete = false;
	}
	/**
	* Initiate connection to target window
	*/
	async connect() {
		if (this._transport && this._handshakeComplete) return this._transport;
		this._state.next("connecting");
		const { local, remote } = createChannelPair(this._channelName, this._config);
		this._target.postMessage({
			type: "port-connect",
			channelName: this._channelName,
			portId: local.portId
		}, this._config.targetOrigin ?? "*", [remote]);
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error("Handshake timeout"));
				this._state.next("error");
			}, this._config.handshakeTimeout ?? 1e4);
			const sub = local.subscribe({ next: (msg) => {
				if (msg.type === "signal" && msg.payload?.action === "handshake-ack") {
					clearTimeout(timeout);
					this._handshakeComplete = true;
					this._transport = local;
					this._state.next("connected");
					sub.unsubscribe();
					resolve(local);
				}
			} });
		});
	}
	/**
	* Listen for incoming connections (target side)
	*/
	static listen(channelName, handler, config) {
		const msgHandler = (e) => {
			if (e.data?.type !== "port-connect" || e.data?.channelName !== channelName) return;
			if (!e.ports[0]) return;
			const transport = new PortTransport(e.ports[0], channelName, config);
			transport.send({
				id: UUIDv4(),
				channel: channelName,
				sender: transport.portId,
				type: "signal",
				payload: { action: "handshake-ack" }
			});
			handler(transport);
		};
		globalThis.addEventListener("message", msgHandler);
		return () => globalThis.removeEventListener("message", msgHandler);
	}
	disconnect() {
		this._transport?.close();
		this._transport = null;
		this._handshakeComplete = false;
		this._state.next("disconnected");
	}
	get isConnected() {
		return this._handshakeComplete;
	}
	get state() {
		return this._state;
	}
	get transport() {
		return this._transport;
	}
};
WindowPortConnector.listen;
//#endregion
//#region shared/fest/uniform/newer/next/storage/Queued.ts
/**
* Simplified worker registration for common patterns
*/
const registerWorkerAPI = (api, channelName = "worker") => {
	const channelHandler = initChannelHandler(channelName ?? "worker");
	Object.keys(api).forEach((methodName) => {
		if (typeof api[methodName] === "function") {}
	});
	return channelHandler;
};
//#endregion
//#region shared/fest/lure/utils/opfs/OPFS.worker.ts
var OPFS_worker_exports = /* @__PURE__ */ __exportAll({
	getDirHandle: () => getDirHandle,
	getFileSystemRoot: () => getFileSystemRoot,
	handlers: () => handlers,
	normalizePath: () => normalizePath
});
const mappedRoots = /* @__PURE__ */ new Map();
const activeObservers = /* @__PURE__ */ new Map();
const getFileSystemRoot = async (id = "") => {
	if (id && mappedRoots.has(id)) return mappedRoots.get(id);
	return await navigator.storage.getDirectory();
};
const normalizePath = (path) => {
	return path?.trim?.()?.replace(/\/+/g, "/") || "/";
};
const getDirHandle = async (root, path, create) => {
	const parts = normalizePath(path).split("/").filter((p) => p);
	let current = root;
	for (const part of parts) current = await current.getDirectoryHandle(part, { create });
	return current;
};
const handlers = {
	mount: async ({ id, handle }) => {
		mappedRoots.set(id, handle);
		return true;
	},
	unmount: async ({ id }) => {
		mappedRoots.delete(id);
		return true;
	},
	readDirectory: async ({ rootId, path, create }) => {
		try {
			const handle = await getDirHandle(await getFileSystemRoot(rootId), path, create);
			const entries = [];
			for await (const [name, entry] of handle.entries()) entries.push([name, entry]);
			return entries;
		} catch (e) {
			console.warn("Worker readDirectory error:", e);
			return [];
		}
	},
	readFile: async ({ rootId, path, type }) => {
		try {
			const root = await getFileSystemRoot(rootId);
			const parts = normalizePath(path).split("/").filter((p) => p);
			const filename = parts.pop();
			const file = await (await (await getDirHandle(root, parts.join("/"), false)).getFileHandle(filename, { create: false })).getFile();
			if (type === "text") return await file.text();
			if (type === "arrayBuffer") return await file.arrayBuffer();
			if (type === "blob") return file;
			return file;
		} catch (e) {
			console.warn("Worker readFile error:", e);
			return null;
		}
	},
	writeFile: async ({ rootId, path, data }) => {
		try {
			const root = await getFileSystemRoot(rootId);
			const parts = normalizePath(path).split("/").filter((p) => p);
			const filename = parts.pop();
			const writable = await (await (await getDirHandle(root, parts.join("/"), true)).getFileHandle(filename, { create: true })).createWritable();
			await writable.write(data);
			await writable.close();
			return true;
		} catch (e) {
			console.warn("Worker writeFile error:", e);
			return false;
		}
	},
	remove: async ({ rootId, path, recursive }) => {
		try {
			const root = await getFileSystemRoot(rootId);
			const parts = normalizePath(path).split("/").filter((p) => p);
			const name = parts.pop();
			await (await getDirHandle(root, parts.join("/"), false)).removeEntry(name, { recursive });
			return true;
		} catch (e) {
			return false;
		}
	},
	observe: async ({ rootId, path, id }) => {
		try {
			if (activeObservers.has(id)) return true;
			const handle = await getDirHandle(await getFileSystemRoot(rootId), path, false);
			if (typeof FileSystemObserver !== "undefined") {
				const observer = new FileSystemObserver((records) => {
					const changes = records.map((r) => {
						const name = r.changedHandle?.name || r.relativePathComponents?.at(-1);
						return {
							type: r.type,
							name,
							kind: r.changedHandle?.kind || (name?.includes(".") ? "file" : "directory"),
							handle: r.changedHandle,
							path: r.relativePathComponents.join("/")
						};
					});
					self.postMessage({
						type: "observation",
						id,
						changes
					});
				});
				observer.observe(handle);
				activeObservers.set(id, observer);
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	},
	unobserve: async ({ id }) => {
		const observer = activeObservers.get(id);
		if (observer) {
			observer.disconnect();
			activeObservers.delete(id);
		}
		return true;
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
			console.warn("Worker copy error:", e);
			return false;
		}
	}
};
const SW_BRIDGE_CHANNEL_NAME = "opfs-sw-bridge-v1";
let swBridgeChannel = null;
try {
	if (typeof BroadcastChannel !== "undefined") {
		swBridgeChannel = new BroadcastChannel(SW_BRIDGE_CHANNEL_NAME);
		swBridgeChannel.onmessage = async (event) => {
			const data = event?.data || {};
			if (!data || typeof data !== "object") return;
			if (data?.type !== "opfs-sw-request") return;
			const requestId = String(data?.requestId || "");
			const action = String(data?.action || "");
			const payload = data?.payload;
			if (!requestId || !action) return;
			const handler = handlers[action];
			if (!handler) {
				swBridgeChannel?.postMessage?.({
					type: "opfs-sw-response",
					requestId,
					ok: false,
					error: `Unknown operation type: ${action}`
				});
				return;
			}
			try {
				const result = await handler(payload);
				swBridgeChannel?.postMessage?.({
					type: "opfs-sw-response",
					requestId,
					ok: true,
					result
				});
			} catch (error) {
				swBridgeChannel?.postMessage?.({
					type: "opfs-sw-response",
					requestId,
					ok: false,
					error: error?.message || String(error)
				});
			}
		};
	}
} catch {
	swBridgeChannel = null;
}
self.addEventListener("message", async (e) => {
	if (!e.data || typeof e.data !== "object") return;
	const { id, type, payload } = e.data;
	if (handlers[type]) try {
		const result = await handlers[type](payload);
		self.postMessage({
			id,
			result
		});
	} catch (error) {
		self.postMessage({
			id,
			error: error?.message || String(error)
		});
	}
	else if (id) self.postMessage({
		id,
		error: `Unknown operation type: ${type}`
	});
});
//#endregion
//#region shared/fest/lure/utils/opfs/OPFS.uniform.worker.ts
if (handlers) registerWorkerAPI(handlers);
const processMessage = async (envelope) => {
	try {
		if (envelope.type === "batch") {
			const results = [];
			for (const msg of envelope.payload) {
				const result = await processSingleMessage(msg);
				results.push(result);
			}
			return results;
		} else return await processSingleMessage(envelope);
	} catch (error) {
		console.error("[OPFS Worker] Message processing error:", error);
		throw error;
	}
};
const processSingleMessage = async (envelope) => {
	const handler = handlers[envelope.type];
	if (!handler) throw new Error(`Unknown message type: ${envelope.type}`);
	return await handler(envelope.payload);
};
globalThis.processMessage = processMessage;
const initWorker = async () => {
	try {
		const handlers = (await Promise.resolve().then(() => OPFS_worker_exports)).handlers;
		if (handlers) registerWorkerAPI(handlers);
		console.log("[OPFS Worker] Initialized with handlers:", Object.keys(handlers || {}));
	} catch (error) {
		console.error("[OPFS Worker] Failed to initialize:", error);
	}
};
initWorker();
//#endregion
