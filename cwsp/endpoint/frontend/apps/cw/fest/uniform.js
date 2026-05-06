import { A as isCanJustReturn, F as isPrimitive, M as isNotComplexArray, S as UUIDv4, _ as deepOperateAndClone, g as Promised, j as isCanTransfer } from "./object.js";
//#region ../../modules/projects/uniform.ts/src/newer/next/types/Interface.ts
var WReflectAction = /* @__PURE__ */ function(WReflectAction) {
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
//#region ../../modules/projects/uniform.ts/src/newer/core/TransportCore.ts
var TRANSPORT_TYPE_ALIASES = {
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
//#region ../../modules/projects/uniform.ts/src/newer/next/observable/Observable.ts
var BaseSubscription = class {
	_closed = false;
	constructor(_unsubscribe) {
		this._unsubscribe = _unsubscribe;
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
	_subs = /* @__PURE__ */ new Set();
	_buffer = [];
	_maxBuffer;
	_replay;
	constructor(options = {}) {
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
var filter = (pred) => (src) => new Observable((sub) => {
	const s = src.subscribe({
		next: (v) => pred(v) && sub.next(v),
		error: (e) => sub.error(e),
		complete: () => sub.complete()
	});
	return () => s.unsubscribe();
});
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/proxy/Invoker.ts
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
var DefaultReflect = {
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
//#region ../../modules/projects/uniform.ts/src/newer/next/proxy/Proxy.ts
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
var PROXY_MARKER = Symbol.for("uniform.proxy");
/** Symbol to access proxy internals */
var PROXY_INTERNALS = Symbol.for("uniform.proxy.internals");
/**
* RemoteProxyHandler - Unified proxy handler for remote invocation
*
* Handles all Reflect operations and forwards them to the invoker.
*/
var RemoteProxyHandler = class {
	_config;
	_childCache = /* @__PURE__ */ new Map();
	constructor(_invoker, config) {
		this._invoker = _invoker;
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
var makeRequestProxy = wrapDescriptor;
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/channel/internal/ConnectionModel.ts
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
	_connections = /* @__PURE__ */ new Map();
	constructor(_createId, _emitEvent) {
		this._createId = _createId;
		this._emitEvent = _emitEvent;
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
//#region ../../modules/projects/uniform.ts/src/newer/next/channel/UnifiedChannel.ts
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
	_name;
	_contextType;
	_config;
	_transports = /* @__PURE__ */ new Map();
	_defaultTransport = null;
	_connectionEvents = new ChannelSubject({ bufferSize: 200 });
	_connectionRegistry = new ConnectionRegistry(() => UUIDv4(), (event) => this._connectionEvents.next(event));
	_pending = /* @__PURE__ */ new Map();
	_subscriptions = [];
	_inbound = new ChannelSubject({ bufferSize: 100 });
	_outbound = new ChannelSubject({ bufferSize: 100 });
	_invocations = new ChannelSubject({ bufferSize: 100 });
	_responses = new ChannelSubject({ bufferSize: 100 });
	_exposed = /* @__PURE__ */ new Map();
	_proxyCache = /* @__PURE__ */ new WeakMap();
	__getPrivate(key) {
		return this[key];
	}
	__setPrivate(key, value) {
		this[key] = value;
	}
	constructor(config) {
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
var WORKER_CHANNEL = null;
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
//#region ../../modules/projects/uniform.ts/src/newer/core/Alias.ts
var TS = {
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
//#region ../../modules/projects/uniform.ts/src/newer/next/channel/Channels.ts
var SELF_CHANNEL = {
	name: "unknown",
	instance: null
};
var CHANNEL_MAP = /* @__PURE__ */ new Map();
var isReflectAction$1 = (action) => [...Object.values(WReflectAction)].includes(action);
/** @deprecated Use UnifiedChannel.remote() instead */
var RemoteChannelHelper$1 = class {
	_channel;
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
	_unified;
	broadcasts = {};
	constructor(channel, options = {}) {
		this.channel = channel;
		this.options = options;
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
var initChannelHandler = (channel = "$host$") => {
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
/** @deprecated Use createUnifiedChannel instead */
var createHostChannel = (channel = "$host$") => initChannelHandler(channel);
/** @deprecated Use UnifiedChannel.attach() instead */
var createOrUseExistingChannel = (channel, options = {}, broadcast = typeof self !== "undefined" ? self : null) => {
	const $host = createHostChannel(channel ?? "$host$");
	return $host?.createRemoteChannel?.(channel, options, broadcast) ?? $host;
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/storage/DataBase.ts
var handMap = /* @__PURE__ */ new WeakMap();
var wrapMap = /* @__PURE__ */ new WeakMap();
var descMap = /* @__PURE__ */ new WeakMap();
var objectToRef = (obj, channel = SELF_CHANNEL?.name, toTransfer) => {
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
var $requestHandler = Symbol.for("@requestHandler");
var $descriptor = Symbol.for("@descriptor");
var normalizeRef = (v) => {
	if (isCanJustReturn(v)) return v;
	if (v?.[$descriptor]) return v;
	if (v?.$isDescriptor) return makeRequestProxy(v, async () => void 0);
	if (isNotComplexArray(v)) return v;
	return null;
};
var storedData = /* @__PURE__ */ new Map();
var registeredInPath = /* @__PURE__ */ new WeakMap();
var traverseByPath = (obj, path) => {
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
var readByPath = (path) => {
	if (path != null && !Array.isArray(path)) path = [path];
	if (path == null || path?.length < 1) return null;
	const root = storedData?.get?.(path?.[0]) ?? null;
	return root != null ? traverseByPath(root, path?.slice?.(1)) : null;
};
var writeByPath = (path, data) => {
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
var removeByPath = (path) => {
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
var removeByData = (data) => {
	const $desc = data?.[$descriptor] ?? (data?.$isDescriptor ? data : null);
	if ($desc && $desc?.owner == SELF_CHANNEL?.name) data = readByPath($desc?.path) ?? data;
	const path = registeredInPath?.get?.(data) ?? $desc?.path;
	if (path == null || path?.length < 1) return false;
	removeByPath(path);
	if (typeof data == "object" || typeof data == "function") registeredInPath?.delete?.(data);
	return true;
};
var hasNoPath = (data) => {
	const $desc = data?.[$descriptor] ?? (data?.$isDescriptor ? data : null);
	return (registeredInPath?.get?.(data) ?? $desc?.path) == null;
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/core/RequestHandler.ts
/**
* Request Handler Core - Unified Reflect Action Handling
*
* Single source of truth for all action execution:
* - UnifiedChannel, ChannelContext, Proxy module
* - Supports both DataBase-backed and direct object targets
* - Supports custom Reflect implementations
*/
var isObject = (obj) => (typeof obj === "object" || typeof obj === "function") && obj != null;
var defaultReflect = {
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
//#region ../../modules/projects/uniform.ts/src/newer/next/channel/Connection.ts
/**
* Channel Connection - Connection abstraction layer
*
* Provides connection pooling, state management, and message routing.
*/
var ChannelConnection = class {
	_id = UUIDv4();
	_state = "disconnected";
	_inbound = new ChannelSubject({ bufferSize: 1e3 });
	_outbound = new ChannelSubject({ bufferSize: 1e3 });
	_stateChanges = new ChannelSubject();
	_connectedPeers = /* @__PURE__ */ new Map();
	_subs = [];
	_stats = {
		messagesSent: 0,
		messagesReceived: 0,
		bytesTransferred: 0,
		latencyMs: 0,
		uptime: 0,
		reconnectCount: 0
	};
	_startTime = 0;
	_pending = /* @__PURE__ */ new Map();
	_buffer = [];
	_opts;
	constructor(_name, _transportType = "internal", options = {}) {
		this._name = _name;
		this._transportType = _transportType;
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
	_connections = /* @__PURE__ */ new Map();
	static _instance = null;
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
var getConnectionPool = () => ConnectionPool.getInstance();
var getConnection = (name, transportType, options) => getConnectionPool().getOrCreate(name, transportType, options);
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/storage/Storage.ts
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
var DB_NAME = "uniform_channels";
var DB_VERSION = 1;
var STORES = {
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
	_db = null;
	_isOpen = false;
	_openPromise = null;
	_channelName;
	_messageUpdates = new ChannelSubject();
	_exchangeUpdates = new ChannelSubject();
	constructor(channelName) {
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
	_operations = [];
	_isCommitted = false;
	_isRolledBack = false;
	constructor(_storage) {
		this._storage = _storage;
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
var _storageInstances = /* @__PURE__ */ new Map();
/**
* Get storage instance for channel
*/
function getChannelStorage(channelName) {
	if (!_storageInstances.has(channelName)) _storageInstances.set(channelName, new ChannelStorage(channelName));
	return _storageInstances.get(channelName);
}
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/channel/ChannelContext.ts
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
var workerCode = new URL("data:video/mp2t;base64,LyoqCiAqIFdvcmtlciBFbnRyeSBQb2ludCAtIE11bHRpLUNoYW5uZWwgU3VwcG9ydAogKgogKiBUaGlzIHdvcmtlciBjb250ZXh0IHN1cHBvcnRzOgogKiAtIE11bHRpcGxlIGNoYW5uZWwgY3JlYXRpb24vaW5pdGlhbGl6YXRpb24KICogLSBPYnNlcnZpbmcgbmV3IGluY29taW5nIGNoYW5uZWwgY29ubmVjdGlvbnMKICogLSBEeW5hbWljIGNoYW5uZWwgYWRkaXRpb24gYWZ0ZXIgaW5pdGlhbGl6YXRpb24KICogLSBDb25uZWN0aW9uIGZyb20gcmVtb3RlL2hvc3QgY29udGV4dHMKICovCgppbXBvcnQgeyBVVUlEdjQgfSBmcm9tICJmZXN0L2NvcmUiOwppbXBvcnQgewogICAgQ2hhbm5lbENvbnRleHQsCiAgICBjcmVhdGVDaGFubmVsQ29udGV4dCwKICAgIHR5cGUgQ2hhbm5lbEVuZHBvaW50LAogICAgdHlwZSBDaGFubmVsQ29udGV4dE9wdGlvbnMsCiAgICB0eXBlIFF1ZXJ5Q29ubmVjdGlvbnNPcHRpb25zLAogICAgdHlwZSBDb250ZXh0Q29ubmVjdGlvbkluZm8KfSBmcm9tICIuLi9jaGFubmVsL0NoYW5uZWxDb250ZXh0IjsKaW1wb3J0IHsgQ2hhbm5lbFN1YmplY3QsIHR5cGUgU3Vic2NyaXB0aW9uIH0gZnJvbSAiLi4vb2JzZXJ2YWJsZS9PYnNlcnZhYmxlIjsKCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KLy8gVFlQRVMKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqIEluY29taW5nIGNvbm5lY3Rpb24gZXZlbnQgKi8KZXhwb3J0IGludGVyZmFjZSBJbmNvbWluZ0Nvbm5lY3Rpb24gewogICAgLyoqIENvbm5lY3Rpb24gSUQgKi8KICAgIGlkOiBzdHJpbmc7CiAgICAvKiogQ2hhbm5lbCBuYW1lICovCiAgICBjaGFubmVsOiBzdHJpbmc7CiAgICAvKiogU2VuZGVyIGNvbnRleHQgbmFtZSAqLwogICAgc2VuZGVyOiBzdHJpbmc7CiAgICAvKiogQ29ubmVjdGlvbiB0eXBlICovCiAgICB0eXBlOiAiY2hhbm5lbCIgfCAicG9ydCIgfCAiYnJvYWRjYXN0IiB8ICJzb2NrZXQiOwogICAgLyoqIE1lc3NhZ2VQb3J0IGlmIHByb3ZpZGVkICovCiAgICBwb3J0PzogTWVzc2FnZVBvcnQ7CiAgICAvKiogVGltZXN0YW1wICovCiAgICB0aW1lc3RhbXA6IG51bWJlcjsKICAgIC8qKiBDb25uZWN0aW9uIG9wdGlvbnMgKi8KICAgIG9wdGlvbnM/OiBhbnk7Cn0KCi8qKiBDaGFubmVsIGNyZWF0ZWQgZXZlbnQgKi8KZXhwb3J0IGludGVyZmFjZSBDaGFubmVsQ3JlYXRlZEV2ZW50IHsKICAgIC8qKiBDaGFubmVsIG5hbWUgKi8KICAgIGNoYW5uZWw6IHN0cmluZzsKICAgIC8qKiBFbmRwb2ludCByZWZlcmVuY2UgKi8KICAgIGVuZHBvaW50OiBDaGFubmVsRW5kcG9pbnQ7CiAgICAvKiogUmVtb3RlIHNlbmRlciAqLwogICAgc2VuZGVyOiBzdHJpbmc7CiAgICAvKiogVGltZXN0YW1wICovCiAgICB0aW1lc3RhbXA6IG51bWJlcjsKfQoKLyoqIFdvcmtlciBjb250ZXh0IGNvbmZpZ3VyYXRpb24gKi8KZXhwb3J0IGludGVyZmFjZSBXb3JrZXJDb250ZXh0Q29uZmlnIGV4dGVuZHMgQ2hhbm5lbENvbnRleHRPcHRpb25zIHsKICAgIC8qKiBXb3JrZXIgbmFtZS9pZGVudGlmaWVyICovCiAgICB3b3JrZXJOYW1lPzogc3RyaW5nOwogICAgLyoqIEF1dG8tYWNjZXB0IGluY29taW5nIGNoYW5uZWxzICovCiAgICBhdXRvQWNjZXB0Q2hhbm5lbHM/OiBib29sZWFuOwogICAgLyoqIENoYW5uZWwgd2hpdGVsaXN0IChpZiBzZXQsIG9ubHkgdGhlc2UgY2hhbm5lbHMgYXJlIGFjY2VwdGVkKSAqLwogICAgYWxsb3dlZENoYW5uZWxzPzogc3RyaW5nW107CiAgICAvKiogTWF4aW11bSBjb25jdXJyZW50IGNoYW5uZWxzICovCiAgICBtYXhDaGFubmVscz86IG51bWJlcjsKfQoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBXT1JLRVIgQ09OVEVYVAovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgovKioKICogV29ya2VyQ29udGV4dCAtIE1hbmFnZXMgY2hhbm5lbHMgd2l0aGluIGEgV29ya2VyCiAqCiAqIFN1cHBvcnRzIG9ic2VydmluZyBuZXcgaW5jb21pbmcgY29ubmVjdGlvbnMgZnJvbSBob3N0L3JlbW90ZSBjb250ZXh0cy4KICovCmV4cG9ydCBjbGFzcyBXb3JrZXJDb250ZXh0IHsKICAgIHByaXZhdGUgX2NvbnRleHQ6IENoYW5uZWxDb250ZXh0OwogICAgcHJpdmF0ZSBfY29uZmlnOiBSZXF1aXJlZDxXb3JrZXJDb250ZXh0Q29uZmlnPjsKICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107CgogICAgLy8gT2JzZXJ2YWJsZSBzdHJlYW1zIGZvciBpbmNvbWluZyBjb25uZWN0aW9ucwogICAgcHJpdmF0ZSBfaW5jb21pbmdDb25uZWN0aW9ucyA9IG5ldyBDaGFubmVsU3ViamVjdDxJbmNvbWluZ0Nvbm5lY3Rpb24+KHsgYnVmZmVyU2l6ZTogMTAwIH0pOwogICAgcHJpdmF0ZSBfY2hhbm5lbENyZWF0ZWQgPSBuZXcgQ2hhbm5lbFN1YmplY3Q8Q2hhbm5lbENyZWF0ZWRFdmVudD4oeyBidWZmZXJTaXplOiAxMDAgfSk7CiAgICBwcml2YXRlIF9jaGFubmVsQ2xvc2VkID0gbmV3IENoYW5uZWxTdWJqZWN0PHsgY2hhbm5lbDogc3RyaW5nOyB0aW1lc3RhbXA6IG51bWJlciB9PigpOwoKICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogV29ya2VyQ29udGV4dENvbmZpZyA9IHt9KSB7CiAgICAgICAgdGhpcy5fY29uZmlnID0gewogICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSA/PyAid29ya2VyIiwKICAgICAgICAgICAgd29ya2VyTmFtZTogY29uZmlnLndvcmtlck5hbWUgPz8gYHdvcmtlci0ke1VVSUR2NCgpLnNsaWNlKDAsIDgpfWAsCiAgICAgICAgICAgIGF1dG9BY2NlcHRDaGFubmVsczogY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyA/PyB0cnVlLAogICAgICAgICAgICBhbGxvd2VkQ2hhbm5lbHM6IGNvbmZpZy5hbGxvd2VkQ2hhbm5lbHMgPz8gW10sCiAgICAgICAgICAgIG1heENoYW5uZWxzOiBjb25maWcubWF4Q2hhbm5lbHMgPz8gMTAwLAogICAgICAgICAgICBhdXRvQ29ubmVjdDogY29uZmlnLmF1dG9Db25uZWN0ID8/IHRydWUsCiAgICAgICAgICAgIHVzZUdsb2JhbFNlbGY6IHRydWUsCiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnMgPz8ge30sCiAgICAgICAgICAgIGlzb2xhdGVkU3RvcmFnZTogY29uZmlnLmlzb2xhdGVkU3RvcmFnZSA/PyBmYWxzZSwKICAgICAgICAgICAgLi4uY29uZmlnCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNyZWF0ZUNoYW5uZWxDb250ZXh0KHsKICAgICAgICAgICAgbmFtZTogdGhpcy5fY29uZmlnLm5hbWUsCiAgICAgICAgICAgIHVzZUdsb2JhbFNlbGY6IHRydWUsCiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnMKICAgICAgICB9KTsKCiAgICAgICAgdGhpcy5fc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIElOQ09NSU5HIENPTk5FQ1RJT04gT0JTRVJWQUJMRVMKICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKICAgIC8qKgogICAgICogT2JzZXJ2YWJsZTogTmV3IGluY29taW5nIGNvbm5lY3Rpb24gcmVxdWVzdHMKICAgICAqLwogICAgZ2V0IG9uQ29ubmVjdGlvbigpIHsKICAgICAgICByZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9uczsKICAgIH0KCiAgICAvKioKICAgICAqIE9ic2VydmFibGU6IENoYW5uZWwgY3JlYXRlZCBldmVudHMKICAgICAqLwogICAgZ2V0IG9uQ2hhbm5lbENyZWF0ZWQoKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkOwogICAgfQoKICAgIC8qKgogICAgICogT2JzZXJ2YWJsZTogQ2hhbm5lbCBjbG9zZWQgZXZlbnRzCiAgICAgKi8KICAgIGdldCBvbkNoYW5uZWxDbG9zZWQoKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDbG9zZWQ7CiAgICB9CgogICAgLyoqCiAgICAgKiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgY29ubmVjdGlvbnMKICAgICAqLwogICAgc3Vic2NyaWJlQ29ubmVjdGlvbnMoCiAgICAgICAgaGFuZGxlcjogKGNvbm46IEluY29taW5nQ29ubmVjdGlvbikgPT4gdm9pZAogICAgKTogU3Vic2NyaXB0aW9uIHsKICAgICAgICByZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5zdWJzY3JpYmUoaGFuZGxlcik7CiAgICB9CgogICAgLyoqCiAgICAgKiBTdWJzY3JpYmUgdG8gY2hhbm5lbCBjcmVhdGlvbgogICAgICovCiAgICBzdWJzY3JpYmVDaGFubmVsQ3JlYXRlZCgKICAgICAgICBoYW5kbGVyOiAoZXZlbnQ6IENoYW5uZWxDcmVhdGVkRXZlbnQpID0+IHZvaWQKICAgICk6IFN1YnNjcmlwdGlvbiB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkLnN1YnNjcmliZShoYW5kbGVyKTsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIENIQU5ORUwgTUFOQUdFTUVOVAogICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgogICAgLyoqCiAgICAgKiBBY2NlcHQgYW4gaW5jb21pbmcgY29ubmVjdGlvbiBhbmQgY3JlYXRlIHRoZSBjaGFubmVsCiAgICAgKi8KICAgIGFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbjogSW5jb21pbmdDb25uZWN0aW9uKTogQ2hhbm5lbEVuZHBvaW50IHwgbnVsbCB7CiAgICAgICAgaWYgKCF0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGNvbm5lY3Rpb24uY2hhbm5lbCkpIHsKICAgICAgICAgICAgcmV0dXJuIG51bGw7CiAgICAgICAgfQoKICAgICAgICBjb25zdCBlbmRwb2ludCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbChjb25uZWN0aW9uLmNoYW5uZWwsIGNvbm5lY3Rpb24ub3B0aW9ucyk7CgogICAgICAgIC8vIFNldHVwIHJlbW90ZSBjb25uZWN0aW9uCiAgICAgICAgaWYgKGNvbm5lY3Rpb24ucG9ydCkgewogICAgICAgICAgICBjb25uZWN0aW9uLnBvcnQuc3RhcnQ/LigpOwogICAgICAgICAgICBlbmRwb2ludC5oYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwoCiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnNlbmRlciwKICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ub3B0aW9ucywKICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucG9ydAogICAgICAgICAgICApOwogICAgICAgIH0KCiAgICAgICAgdGhpcy5fY2hhbm5lbENyZWF0ZWQubmV4dCh7CiAgICAgICAgICAgIGNoYW5uZWw6IGNvbm5lY3Rpb24uY2hhbm5lbCwKICAgICAgICAgICAgZW5kcG9pbnQsCiAgICAgICAgICAgIHNlbmRlcjogY29ubmVjdGlvbi5zZW5kZXIsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKQogICAgICAgIH0pOwoKICAgICAgICAvLyBOb3RpZnkgc2VuZGVyCiAgICAgICAgdGhpcy5fcG9zdENoYW5uZWxDcmVhdGVkKGNvbm5lY3Rpb24uY2hhbm5lbCwgY29ubmVjdGlvbi5zZW5kZXIsIGNvbm5lY3Rpb24uaWQpOwoKICAgICAgICByZXR1cm4gZW5kcG9pbnQ7CiAgICB9CgogICAgLyoqCiAgICAgKiBDcmVhdGUgYSBuZXcgY2hhbm5lbCBpbiB0aGlzIHdvcmtlciBjb250ZXh0CiAgICAgKi8KICAgIGNyZWF0ZUNoYW5uZWwobmFtZTogc3RyaW5nLCBvcHRpb25zPzogYW55KTogQ2hhbm5lbEVuZHBvaW50IHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpOwogICAgfQoKICAgIC8qKgogICAgICogR2V0IGFuIGV4aXN0aW5nIGNoYW5uZWwKICAgICAqLwogICAgZ2V0Q2hhbm5lbChuYW1lOiBzdHJpbmcpOiBDaGFubmVsRW5kcG9pbnQgfCB1bmRlZmluZWQgewogICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LmdldENoYW5uZWwobmFtZSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBDaGVjayBpZiBjaGFubmVsIGV4aXN0cwogICAgICovCiAgICBoYXNDaGFubmVsKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gewogICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0Lmhhc0NoYW5uZWwobmFtZSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBHZXQgYWxsIGNoYW5uZWwgbmFtZXMKICAgICAqLwogICAgZ2V0Q2hhbm5lbE5hbWVzKCk6IHN0cmluZ1tdIHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsTmFtZXMoKTsKICAgIH0KCiAgICAvKioKICAgICAqIFF1ZXJ5IGN1cnJlbnRseSB0cmFja2VkIGNoYW5uZWwgY29ubmVjdGlvbnMgaW4gdGhpcyB3b3JrZXIuCiAgICAgKi8KICAgIHF1ZXJ5Q29ubmVjdGlvbnMocXVlcnk6IFF1ZXJ5Q29ubmVjdGlvbnNPcHRpb25zID0ge30pOiBDb250ZXh0Q29ubmVjdGlvbkluZm9bXSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQucXVlcnlDb25uZWN0aW9ucyhxdWVyeSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBOb3RpZnkgYWN0aXZlIGNvbm5lY3Rpb25zICh1c2VmdWwgZm9yIHdvcmtlcjwtPmhvc3Qgc3luYykuCiAgICAgKi8KICAgIG5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQ6IGFueSA9IHt9LCBxdWVyeTogUXVlcnlDb25uZWN0aW9uc09wdGlvbnMgPSB7fSk6IG51bWJlciB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQubm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCwgcXVlcnkpOwogICAgfQoKICAgIC8qKgogICAgICogQ2xvc2UgYSBzcGVjaWZpYyBjaGFubmVsCiAgICAgKi8KICAgIGNsb3NlQ2hhbm5lbChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHsKICAgICAgICBjb25zdCBjbG9zZWQgPSB0aGlzLl9jb250ZXh0LmNsb3NlQ2hhbm5lbChuYW1lKTsKICAgICAgICBpZiAoY2xvc2VkKSB7CiAgICAgICAgICAgIHRoaXMuX2NoYW5uZWxDbG9zZWQubmV4dCh7IGNoYW5uZWw6IG5hbWUsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGNsb3NlZDsKICAgIH0KCiAgICAvKioKICAgICAqIEdldCB0aGUgdW5kZXJseWluZyBjb250ZXh0CiAgICAgKi8KICAgIGdldCBjb250ZXh0KCk6IENoYW5uZWxDb250ZXh0IHsKICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dDsKICAgIH0KCiAgICAvKioKICAgICAqIEdldCB3b3JrZXIgY29uZmlndXJhdGlvbgogICAgICovCiAgICBnZXQgY29uZmlnKCk6IFJlYWRvbmx5PFJlcXVpcmVkPFdvcmtlckNvbnRleHRDb25maWc+PiB7CiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZzsKICAgIH0KCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgIC8vIFBSSVZBVEUgTUVUSE9EUwogICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgogICAgcHJpdmF0ZSBfc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTogdm9pZCB7CiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsICgoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4gewogICAgICAgICAgICB0aGlzLl9oYW5kbGVJbmNvbWluZ01lc3NhZ2UoZXZlbnQpOwogICAgICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpOwogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUluY29taW5nTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogdm9pZCB7CiAgICAgICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGE7CiAgICAgICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSAib2JqZWN0IikgcmV0dXJuOwoKICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkgewogICAgICAgICAgICBjYXNlICJjcmVhdGVDaGFubmVsIjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUNyZWF0ZUNoYW5uZWwoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImNvbm5lY3RDaGFubmVsIjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGEpOwogICAgICAgICAgICAgICAgYnJlYWs7CgogICAgICAgICAgICBjYXNlICJhZGRQb3J0IjoKICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUFkZFBvcnQoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImxpc3RDaGFubmVscyI6CiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVMaXN0Q2hhbm5lbHMoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgImNsb3NlQ2hhbm5lbCI6CiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVDbG9zZUNoYW5uZWwoZGF0YSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgInBpbmciOgogICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlOiAicG9uZyIsIGlkOiBkYXRhLmlkLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGRlZmF1bHQ6CiAgICAgICAgICAgICAgICAvLyBQYXNzIHRvIGV4aXN0aW5nIGhhbmRsZXIgb3IgbG9nCiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jaGFubmVsICYmIHRoaXMuX2NvbnRleHQuaGFzQ2hhbm5lbChkYXRhLmNoYW5uZWwpKSB7CiAgICAgICAgICAgICAgICAgICAgLy8gUm91dGUgdG8gc3BlY2lmaWMgY2hhbm5lbAogICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsKGRhdGEuY2hhbm5lbCk7CiAgICAgICAgICAgICAgICAgICAgKGVuZHBvaW50Py5oYW5kbGVyIGFzIGFueSk/LmhhbmRsZUFuZFJlc3BvbnNlPy4oZGF0YS5wYXlsb2FkLCBkYXRhLnJlcUlkKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CgogICAgcHJpdmF0ZSBfaGFuZGxlQ3JlYXRlQ2hhbm5lbChkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBjb25zdCBjb25uZWN0aW9uOiBJbmNvbWluZ0Nvbm5lY3Rpb24gPSB7CiAgICAgICAgICAgIGlkOiBkYXRhLnJlcUlkID8/IFVVSUR2NCgpLAogICAgICAgICAgICBjaGFubmVsOiBkYXRhLmNoYW5uZWwsCiAgICAgICAgICAgIHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gInVua25vd24iLAogICAgICAgICAgICB0eXBlOiAiY2hhbm5lbCIsCiAgICAgICAgICAgIHBvcnQ6IGRhdGEubWVzc2FnZVBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgLy8gRW1pdCB0byBvYnNlcnZlcnMKICAgICAgICB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQoY29ubmVjdGlvbik7CgogICAgICAgIC8vIEF1dG8tYWNjZXB0IGlmIGNvbmZpZ3VyZWQKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgewogICAgICAgICAgICB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7CiAgICAgICAgfQogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGE6IGFueSk6IHZvaWQgewogICAgICAgIGNvbnN0IGNvbm5lY3Rpb246IEluY29taW5nQ29ubmVjdGlvbiA9IHsKICAgICAgICAgICAgaWQ6IGRhdGEucmVxSWQgPz8gVVVJRHY0KCksCiAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgc2VuZGVyOiBkYXRhLnNlbmRlciA/PyAidW5rbm93biIsCiAgICAgICAgICAgIHR5cGU6IGRhdGEucG9ydFR5cGUgPz8gImNoYW5uZWwiLAogICAgICAgICAgICBwb3J0OiBkYXRhLnBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pOwoKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyAmJiB0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGRhdGEuY2hhbm5lbCkpIHsKICAgICAgICAgICAgLy8gQ29ubmVjdCB0byBleGlzdGluZyBjaGFubmVsIG9yIGNyZWF0ZSBuZXcKICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9jb250ZXh0LmdldE9yQ3JlYXRlQ2hhbm5lbChkYXRhLmNoYW5uZWwsIGRhdGEub3B0aW9ucyk7CgogICAgICAgICAgICBpZiAoZGF0YS5wb3J0KSB7CiAgICAgICAgICAgICAgICBkYXRhLnBvcnQuc3RhcnQ/LigpOwogICAgICAgICAgICAgICAgZW5kcG9pbnQuaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKGRhdGEuc2VuZGVyLCBkYXRhLm9wdGlvbnMsIGRhdGEucG9ydCk7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ29ubmVjdGVkIiwKICAgICAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgICAgIHJlcUlkOiBkYXRhLnJlcUlkCiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgIH0KCiAgICBwcml2YXRlIF9oYW5kbGVBZGRQb3J0KGRhdGE6IGFueSk6IHZvaWQgewogICAgICAgIGlmICghZGF0YS5wb3J0IHx8ICFkYXRhLmNoYW5uZWwpIHJldHVybjsKCiAgICAgICAgY29uc3QgY29ubmVjdGlvbjogSW5jb21pbmdDb25uZWN0aW9uID0gewogICAgICAgICAgICBpZDogZGF0YS5yZXFJZCA/PyBVVUlEdjQoKSwKICAgICAgICAgICAgY2hhbm5lbDogZGF0YS5jaGFubmVsLAogICAgICAgICAgICBzZW5kZXI6IGRhdGEuc2VuZGVyID8/ICJ1bmtub3duIiwKICAgICAgICAgICAgdHlwZTogInBvcnQiLAogICAgICAgICAgICBwb3J0OiBkYXRhLnBvcnQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSwKICAgICAgICAgICAgb3B0aW9uczogZGF0YS5vcHRpb25zCiAgICAgICAgfTsKCiAgICAgICAgdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pOwoKICAgICAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgewogICAgICAgICAgICB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7CiAgICAgICAgfQogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUxpc3RDaGFubmVscyhkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBwb3N0TWVzc2FnZSh7CiAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsTGlzdCIsCiAgICAgICAgICAgIGNoYW5uZWxzOiB0aGlzLmdldENoYW5uZWxOYW1lcygpLAogICAgICAgICAgICByZXFJZDogZGF0YS5yZXFJZAogICAgICAgIH0pOwogICAgfQoKICAgIHByaXZhdGUgX2hhbmRsZUNsb3NlQ2hhbm5lbChkYXRhOiBhbnkpOiB2b2lkIHsKICAgICAgICBpZiAoZGF0YS5jaGFubmVsKSB7CiAgICAgICAgICAgIHRoaXMuY2xvc2VDaGFubmVsKGRhdGEuY2hhbm5lbCk7CiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ2xvc2VkIiwKICAgICAgICAgICAgICAgIGNoYW5uZWw6IGRhdGEuY2hhbm5lbCwKICAgICAgICAgICAgICAgIHJlcUlkOiBkYXRhLnJlcUlkCiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgIH0KCiAgICBwcml2YXRlIF9jYW5BY2NlcHRDaGFubmVsKGNoYW5uZWw6IHN0cmluZyk6IGJvb2xlYW4gewogICAgICAgIC8vIENoZWNrIG1heCBjaGFubmVscwogICAgICAgIGlmICh0aGlzLl9jb250ZXh0LnNpemUgPj0gdGhpcy5fY29uZmlnLm1heENoYW5uZWxzKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CgogICAgICAgIC8vIENoZWNrIHdoaXRlbGlzdAogICAgICAgIGlmICh0aGlzLl9jb25maWcuYWxsb3dlZENoYW5uZWxzLmxlbmd0aCA+IDApIHsKICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5hbGxvd2VkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCk7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBwcml2YXRlIF9wb3N0Q2hhbm5lbENyZWF0ZWQoY2hhbm5lbDogc3RyaW5nLCBzZW5kZXI6IHN0cmluZywgcmVxSWQ/OiBzdHJpbmcpOiB2b2lkIHsKICAgICAgICBwb3N0TWVzc2FnZSh7CiAgICAgICAgICAgIHR5cGU6ICJjaGFubmVsQ3JlYXRlZCIsCiAgICAgICAgICAgIGNoYW5uZWwsCiAgICAgICAgICAgIHNlbmRlciwKICAgICAgICAgICAgcmVxSWQsCiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKQogICAgICAgIH0pOwogICAgfQoKICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgLy8gTElGRUNZQ0xFCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCiAgICBjbG9zZSgpOiB2b2lkIHsKICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpOwogICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXTsKICAgICAgICB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLmNvbXBsZXRlKCk7CiAgICAgICAgdGhpcy5fY2hhbm5lbENyZWF0ZWQuY29tcGxldGUoKTsKICAgICAgICB0aGlzLl9jaGFubmVsQ2xvc2VkLmNvbXBsZXRlKCk7CiAgICAgICAgdGhpcy5fY29udGV4dC5jbG9zZSgpOwogICAgfQp9CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIEdMT0JBTCBXT1JLRVIgQ09OVEVYVCAoU2luZ2xldG9uKQovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpsZXQgV09SS0VSX0NPTlRFWFQ6IFdvcmtlckNvbnRleHQgfCBudWxsID0gbnVsbDsKCi8qKgogKiBHZXQgb3IgY3JlYXRlIHRoZSB3b3JrZXIgY29udGV4dCBzaW5nbGV0b24KICovCmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JrZXJDb250ZXh0KGNvbmZpZz86IFdvcmtlckNvbnRleHRDb25maWcpOiBXb3JrZXJDb250ZXh0IHsKICAgIGlmICghV09SS0VSX0NPTlRFWFQpIHsKICAgICAgICBXT1JLRVJfQ09OVEVYVCA9IG5ldyBXb3JrZXJDb250ZXh0KGNvbmZpZyk7CiAgICB9CiAgICByZXR1cm4gV09SS0VSX0NPTlRFWFQ7Cn0KCi8qKgogKiBJbml0aWFsaXplIHdvcmtlciBjb250ZXh0IHdpdGggY29uZmlnCiAqLwpleHBvcnQgZnVuY3Rpb24gaW5pdFdvcmtlckNvbnRleHQoY29uZmlnPzogV29ya2VyQ29udGV4dENvbmZpZyk6IFdvcmtlckNvbnRleHQgewogICAgV09SS0VSX0NPTlRFWFQ/LmNsb3NlKCk7CiAgICBXT1JLRVJfQ09OVEVYVCA9IG5ldyBXb3JrZXJDb250ZXh0KGNvbmZpZyk7CiAgICByZXR1cm4gV09SS0VSX0NPTlRFWFQ7Cn0KCi8qKgogKiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgY29ubmVjdGlvbnMgaW4gdGhlIGdsb2JhbCB3b3JrZXIgY29udGV4dAogKi8KZXhwb3J0IGZ1bmN0aW9uIG9uV29ya2VyQ29ubmVjdGlvbigKICAgIGhhbmRsZXI6IChjb25uOiBJbmNvbWluZ0Nvbm5lY3Rpb24pID0+IHZvaWQKKTogU3Vic2NyaXB0aW9uIHsKICAgIHJldHVybiBnZXRXb3JrZXJDb250ZXh0KCkuc3Vic2NyaWJlQ29ubmVjdGlvbnMoaGFuZGxlcik7Cn0KCi8qKgogKiBTdWJzY3JpYmUgdG8gY2hhbm5lbCBjcmVhdGlvbiBpbiB0aGUgZ2xvYmFsIHdvcmtlciBjb250ZXh0CiAqLwpleHBvcnQgZnVuY3Rpb24gb25Xb3JrZXJDaGFubmVsQ3JlYXRlZCgKICAgIGhhbmRsZXI6IChldmVudDogQ2hhbm5lbENyZWF0ZWRFdmVudCkgPT4gdm9pZAopOiBTdWJzY3JpcHRpb24gewogICAgcmV0dXJuIGdldFdvcmtlckNvbnRleHQoKS5zdWJzY3JpYmVDaGFubmVsQ3JlYXRlZChoYW5kbGVyKTsKfQoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBJTlZPS0VSIElOVEVHUkFUSU9OCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmltcG9ydCB7CiAgICBSZXNwb25kZXIsCiAgICBCaWRpcmVjdGlvbmFsSW52b2tlciwKICAgIGNyZWF0ZVJlc3BvbmRlciwKICAgIGNyZWF0ZUludm9rZXIsCiAgICBkZXRlY3RDb250ZXh0VHlwZSwKICAgIGRldGVjdFRyYW5zcG9ydFR5cGUsCiAgICB0eXBlIENvbnRleHRUeXBlLAogICAgdHlwZSBJbmNvbWluZ0ludm9jYXRpb24KfSBmcm9tICIuLi9wcm94eS9JbnZva2VyIjsKCmxldCBXT1JLRVJfUkVTUE9OREVSOiBSZXNwb25kZXIgfCBudWxsID0gbnVsbDsKbGV0IFdPUktFUl9JTlZPS0VSOiBCaWRpcmVjdGlvbmFsSW52b2tlciB8IG51bGwgPSBudWxsOwoKLyoqCiAqIEdldCB0aGUgd29ya2VyJ3MgUmVzcG9uZGVyIChmb3IgaGFuZGxpbmcgaW5jb21pbmcgaW52b2NhdGlvbnMpCiAqLwpleHBvcnQgZnVuY3Rpb24gZ2V0V29ya2VyUmVzcG9uZGVyKGNoYW5uZWw/OiBzdHJpbmcpOiBSZXNwb25kZXIgewogICAgaWYgKCFXT1JLRVJfUkVTUE9OREVSKSB7CiAgICAgICAgV09SS0VSX1JFU1BPTkRFUiA9IGNyZWF0ZVJlc3BvbmRlcihjaGFubmVsID8/ICJ3b3JrZXIiKTsKICAgICAgICBXT1JLRVJfUkVTUE9OREVSLmxpc3RlbihzZWxmKTsKICAgIH0KICAgIHJldHVybiBXT1JLRVJfUkVTUE9OREVSOwp9CgovKioKICogR2V0IHRoZSB3b3JrZXIncyBiaWRpcmVjdGlvbmFsIEludm9rZXIKICovCmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JrZXJJbnZva2VyKGNoYW5uZWw/OiBzdHJpbmcpOiBCaWRpcmVjdGlvbmFsSW52b2tlciB7CiAgICBpZiAoIVdPUktFUl9JTlZPS0VSKSB7CiAgICAgICAgV09SS0VSX0lOVk9LRVIgPSBjcmVhdGVJbnZva2VyKGNoYW5uZWwgPz8gIndvcmtlciIpOwogICAgICAgIFdPUktFUl9JTlZPS0VSLmNvbm5lY3Qoc2VsZik7CiAgICB9CiAgICByZXR1cm4gV09SS0VSX0lOVk9LRVI7Cn0KCi8qKgogKiBFeHBvc2UgYW4gb2JqZWN0IGZvciByZW1vdGUgaW52b2NhdGlvbiBmcm9tIHRoZSB3b3JrZXIKICovCmV4cG9ydCBmdW5jdGlvbiBleHBvc2VGcm9tV29ya2VyKG5hbWU6IHN0cmluZywgb2JqOiBhbnkpOiB2b2lkIHsKICAgIGdldFdvcmtlclJlc3BvbmRlcigpLmV4cG9zZShuYW1lLCBvYmopOwp9CgovKioKICogU3Vic2NyaWJlIHRvIGluY29taW5nIGludm9jYXRpb25zIGluIHRoZSB3b3JrZXIKICovCmV4cG9ydCBmdW5jdGlvbiBvbldvcmtlckludm9jYXRpb24oCiAgICBoYW5kbGVyOiAoaW52OiBJbmNvbWluZ0ludm9jYXRpb24pID0+IHZvaWQKKTogU3Vic2NyaXB0aW9uIHsKICAgIHJldHVybiBnZXRXb3JrZXJSZXNwb25kZXIoKS5zdWJzY3JpYmVJbnZvY2F0aW9ucyhoYW5kbGVyKTsKfQoKLyoqCiAqIENyZWF0ZSBhIHByb3h5IHRvIGludm9rZSBtZXRob2RzIG9uIHRoZSBob3N0IGZyb20gdGhlIHdvcmtlcgogKi8KZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhvc3RQcm94eTxUID0gYW55Pihob3N0Q2hhbm5lbDogc3RyaW5nID0gImhvc3QiLCBiYXNlUGF0aDogc3RyaW5nW10gPSBbXSk6IFQgewogICAgcmV0dXJuIGdldFdvcmtlckludm9rZXIoKS5jcmVhdGVQcm94eTxUPihob3N0Q2hhbm5lbCwgYmFzZVBhdGgpOwp9CgovKioKICogSW1wb3J0IGEgbW9kdWxlIGluIHRoZSBob3N0IGNvbnRleHQgZnJvbSB0aGUgd29ya2VyCiAqLwpleHBvcnQgZnVuY3Rpb24gaW1wb3J0SW5Ib3N0PFQgPSBhbnk+KHVybDogc3RyaW5nLCBob3N0Q2hhbm5lbDogc3RyaW5nID0gImhvc3QiKTogUHJvbWlzZTxUPiB7CiAgICByZXR1cm4gZ2V0V29ya2VySW52b2tlcigpLmltcG9ydE1vZHVsZTxUPihob3N0Q2hhbm5lbCwgdXJsKTsKfQoKLy8gUmUtZXhwb3J0IGRldGVjdGlvbiB1dGlsaXRpZXMKZXhwb3J0IHsgZGV0ZWN0Q29udGV4dFR5cGUsIGRldGVjdFRyYW5zcG9ydFR5cGUgfTsKZXhwb3J0IHR5cGUgeyBDb250ZXh0VHlwZSwgSW5jb21pbmdJbnZvY2F0aW9uIH07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIEFVVE8tSU5JVElBTElaRSAoQ29tcGF0aWJsZSB3aXRoIGxlZ2FjeSB1c2FnZSkKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLy8gSW5pdGlhbGl6ZSB0aGUgd29ya2VyIGNvbnRleHQKY29uc3QgY3R4ID0gZ2V0V29ya2VyQ29udGV4dCh7IG5hbWU6ICJ3b3JrZXIiIH0pOwoKLy8gRXhwb3J0IGZvciBkaXJlY3QgYWNjZXNzCmV4cG9ydCB7IGN0eCBhcyB3b3JrZXJDb250ZXh0IH07Cg==", "" + import.meta.url);
var RemoteChannelHelper = class {
	_connection;
	_storage;
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
	_connection;
	_unified;
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
	_id = UUIDv4();
	_hostName;
	_host = null;
	_endpoints = /* @__PURE__ */ new Map();
	_unifiedByChannel = /* @__PURE__ */ new Map();
	_unifiedConnectionSubs = /* @__PURE__ */ new Map();
	_remoteChannels = /* @__PURE__ */ new Map();
	_deferredChannels = /* @__PURE__ */ new Map();
	_connectionEvents = new ChannelSubject({ bufferSize: 200 });
	_connectionRegistry = new ConnectionRegistry(() => UUIDv4(), (event) => this._emitConnectionEvent(event));
	_closed = false;
	_globalSelf = null;
	constructor(_options = {}) {
		this._options = _options;
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
var CONTEXT_REGISTRY = /* @__PURE__ */ new Map();
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
//#region ../../modules/projects/uniform.ts/src/newer/next/transport/Worker.ts
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
	_context;
	_config;
	_subscriptions = [];
	_incomingConnections = new ChannelSubject({ bufferSize: 100 });
	_channelCreated = new ChannelSubject({ bufferSize: 100 });
	_channelClosed = new ChannelSubject();
	constructor(config = {}) {
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
var WORKER_CONTEXT = null;
/**
* Get or create the worker context singleton
*/
function getWorkerContext(config) {
	if (!WORKER_CONTEXT) WORKER_CONTEXT = new WorkerContext(config);
	return WORKER_CONTEXT;
}
getWorkerContext({ name: "worker" });
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/transport/PortTransport.ts
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
	_port;
	_subs = /* @__PURE__ */ new Set();
	_pending = /* @__PURE__ */ new Map();
	_listening = false;
	_cleanup = null;
	_portId = UUIDv4();
	_state = new ChannelSubject();
	_keepAliveTimer = null;
	constructor(port, _channelName, _config = {}) {
		this._channelName = _channelName;
		this._config = _config;
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
	_transport = null;
	_state = new ChannelSubject();
	_handshakeComplete = false;
	constructor(_target, _channelName, _config = {}) {
		this._target = _target;
		this._channelName = _channelName;
		this._config = _config;
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
//#region ../../modules/projects/uniform.ts/src/newer/next/storage/Queued.ts
/**
* Queued worker channel that buffers requests until the channel is available
*/
var QueuedWorkerChannel = class {
	underlyingChannel = null;
	isConnected = false;
	requestQueue = [];
	connectionPromise = null;
	connectionResolver = null;
	context;
	constructor(config, onChannelReady) {
		this.config = config;
		this.onChannelReady = onChannelReady;
		this.context = config.context ?? "unknown";
	}
	/**
	* Initialize the underlying channel
	*/
	async connect(underlyingChannel = null) {
		this.underlyingChannel = underlyingChannel;
	}
	/**
	* Queue a request if channel isn't ready, otherwise send immediately
	*/
	async request(method, args = []) {
		if (this.isConnected && this.underlyingChannel) return this.underlyingChannel.request(method, args);
		return new Promise((resolve, reject) => {
			const queuedRequest = {
				id: UUIDv4(),
				method,
				args,
				resolve,
				reject,
				timestamp: Date.now()
			};
			this.requestQueue.push(queuedRequest);
			if (!this.connectionPromise) this.connect().catch((error) => {
				this.rejectAllQueued(error);
			});
		});
	}
	/**
	* Process all queued requests
	*/
	async flushQueue() {
		if (!this.underlyingChannel) return;
		const queueCopy = [...this.requestQueue];
		this.requestQueue = [];
		for (const queuedRequest of queueCopy) try {
			const result = await this.underlyingChannel.request(queuedRequest.method, queuedRequest.args);
			queuedRequest.resolve(result);
		} catch (error) {
			queuedRequest.reject(error);
		}
	}
	/**
	* Reject all queued requests with an error
	*/
	rejectAllQueued(error) {
		const queueCopy = [...this.requestQueue];
		this.requestQueue = [];
		for (const queuedRequest of queueCopy) queuedRequest.reject(error);
	}
	/**
	* Get queue status
	*/
	getQueueStatus() {
		return {
			isConnected: this.isConnected,
			queuedRequests: this.requestQueue.length,
			isConnecting: !!this.connectionPromise && !this.isConnected
		};
	}
	close() {
		this.rejectAllQueued(/* @__PURE__ */ new Error("Channel closed"));
		this.underlyingChannel?.close();
		this.underlyingChannel = null;
		this.isConnected = false;
		this.connectionPromise = null;
	}
};
var OptimizedWorkerChannel = class {
	channel = null;
	isChannelReady = false;
	pendingRequests = /* @__PURE__ */ new Map();
	messageQueue = [];
	queuedRequests = [];
	batchTimer;
	options;
	onChannelReady;
	constructor(channel = null, options = {}, onChannelReady) {
		this.channel = channel;
		this.isChannelReady = !!channel;
		this.onChannelReady = onChannelReady;
		this.options = {
			timeout: 3e4,
			retries: 3,
			compression: false,
			batching: true,
			...options
		};
	}
	/**
	* Set the underlying channel when it becomes available
	*/
	setChannel(channel) {
		this.channel = channel;
		this.isChannelReady = true;
		this.onChannelReady?.(channel);
		this.flushQueuedRequests();
	}
	/**
	* Send a request and wait for response
	*/
	async request(type, payload, options) {
		if (!this.isChannelReady || !this.channel) return new Promise((resolve, reject) => {
			const queuedRequest = {
				id: UUIDv4(),
				method: type,
				args: [payload],
				resolve,
				reject,
				timestamp: Date.now()
			};
			this.queuedRequests.push(queuedRequest);
		});
		const opts = {
			...this.options,
			...options
		};
		const messageId = UUIDv4();
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.pendingRequests.delete(messageId);
				reject(/* @__PURE__ */ new Error(`Request timeout: ${type}`));
			}, opts.timeout);
			this.pendingRequests.set(messageId, {
				resolve,
				reject,
				timeout
			});
			const envelope = {
				id: messageId,
				type,
				payload,
				timestamp: Date.now()
			};
			if (opts.batching) this.queueMessage(envelope);
			else this.sendMessage(envelope);
		});
	}
	/**
	* Process queued requests when channel becomes available
	*/
	async flushQueuedRequests() {
		if (!this.channel || this.queuedRequests.length === 0) return;
		const queueCopy = [...this.queuedRequests];
		this.queuedRequests = [];
		for (const queuedRequest of queueCopy) try {
			const result = await this.request(queuedRequest.method, ...queuedRequest?.args ?? []);
			queuedRequest.resolve(result);
		} catch (error) {
			queuedRequest.reject(error);
		}
	}
	/**
	* Send a one-way message (fire and forget)
	*/
	notify(type, payload) {
		const envelope = {
			id: UUIDv4(),
			type,
			payload,
			timestamp: Date.now()
		};
		if (this.options.batching) this.queueMessage(envelope);
		else this.sendMessage(envelope);
	}
	/**
	* Stream data with backpressure handling
	*/
	async *stream(type, data) {
		for (const chunk of data) yield await this.request(`${type}:chunk`, chunk);
	}
	/**
	* Queue message for batching
	*/
	queueMessage(envelope) {
		this.messageQueue.push(envelope);
		if (!this.batchTimer) this.batchTimer = setTimeout(() => {
			this.flushBatch();
		}, 16);
	}
	/**
	* Send batched messages
	*/
	flushBatch() {
		if (this.messageQueue.length === 0) return;
		const batchEnvelope = {
			id: UUIDv4(),
			type: "batch",
			payload: this.messageQueue,
			timestamp: Date.now()
		};
		this.sendMessage(batchEnvelope);
		this.messageQueue = [];
		this.batchTimer = void 0;
	}
	/**
	* Send single message through channel
	*/
	async sendMessage(envelope) {
		try {
			const result = await this.channel?.request?.("processMessage", [envelope]);
			if (envelope.replyTo && this.pendingRequests.has(envelope.replyTo)) {
				const { resolve, timeout } = this.pendingRequests.get(envelope.replyTo);
				clearTimeout(timeout);
				this.pendingRequests.delete(envelope.replyTo);
				resolve(result);
			}
		} catch (error) {
			if (this.pendingRequests.has(envelope.id)) {
				const { reject, timeout } = this.pendingRequests.get(envelope.id);
				clearTimeout(timeout);
				this.pendingRequests.delete(envelope.id);
				reject(error);
			}
		}
	}
	/**
	* Close the channel
	*/
	close() {
		if (this.batchTimer) clearTimeout(this.batchTimer);
		for (const [id, { reject, timeout }] of this.pendingRequests) {
			clearTimeout(timeout);
			reject(/* @__PURE__ */ new Error("Channel closed"));
		}
		this.pendingRequests.clear();
		this.channel?.close?.();
	}
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/messaging/MessageQueue.ts
var MessageQueue = class MessageQueue {
	db = null;
	dbPromise = null;
	options;
	constructor(options = {}) {
		this.options = {
			dbName: options.dbName ?? "UniformMessageQueue",
			storeName: options.storeName ?? "messages",
			maxRetries: options.maxRetries ?? 3,
			defaultExpirationMs: options.defaultExpirationMs ?? 1440 * 60 * 1e3,
			fallbackStorageKey: options.fallbackStorageKey ?? "uniform_message_queue"
		};
	}
	/**
	* Initialize IndexedDB database
	*/
	async initDB() {
		if (this.db) return this.db;
		if (this.dbPromise) return this.dbPromise;
		if (!MessageQueue.isIndexedDBAvailable()) {
			console.warn("[MessageQueue] IndexedDB not available, using sessionStorage fallback");
			return null;
		}
		this.dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.options.dbName, 1);
			request.onerror = () => {
				console.warn("[MessageQueue] IndexedDB open failed, falling back to sessionStorage");
				reject(/* @__PURE__ */ new Error("IndexedDB not available"));
			};
			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};
			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.options.storeName)) {
					const store = db.createObjectStore(this.options.storeName, { keyPath: "id" });
					store.createIndex("timestamp", "timestamp", { unique: false });
					store.createIndex("type", "type", { unique: false });
					store.createIndex("priority", "priority", { unique: false });
					store.createIndex("destination", "destination", { unique: false });
				}
			};
		});
		try {
			this.db = await this.dbPromise;
			return this.db;
		} catch {
			return null;
		}
	}
	/**
	* Generate unique message ID
	*/
	generateId() {
		return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
	}
	/**
	* Queue a message for later processing
	*/
	async queueMessage(type, data, options = {}) {
		const message = {
			id: this.generateId(),
			type,
			data,
			timestamp: Date.now(),
			priority: options.priority ?? "normal",
			retryCount: 0,
			maxRetries: options.maxRetries ?? this.options.maxRetries,
			expiresAt: options.expiresAt ?? Date.now() + this.options.defaultExpirationMs,
			destination: options.destination,
			metadata: options.metadata
		};
		try {
			const db = await this.initDB();
			if (db) await this.addToIndexedDB(db, message);
			else this.addToSessionStorage(message);
			console.log(`[MessageQueue] Queued message: ${type}`, message.id);
			return message.id;
		} catch (error) {
			console.error("[MessageQueue] Failed to queue message:", error);
			throw error;
		}
	}
	/**
	* Get all queued messages
	*/
	async getQueuedMessages(destination) {
		try {
			const db = await this.initDB();
			let messages;
			if (db) messages = await this.getAllFromIndexedDB(db);
			else messages = this.getAllFromSessionStorage();
			if (destination) messages = messages.filter((msg) => msg.destination === destination);
			const now = Date.now();
			return messages.filter((msg) => !msg.expiresAt || msg.expiresAt > now);
		} catch (error) {
			console.error("[MessageQueue] Failed to get queued messages:", error);
			return this.getAllFromSessionStorage();
		}
	}
	/**
	* Remove a message from the queue
	*/
	async removeMessage(messageId) {
		try {
			const db = await this.initDB();
			if (db) await this.deleteFromIndexedDB(db, messageId);
			else this.deleteFromSessionStorage(messageId);
		} catch (error) {
			console.error("[MessageQueue] Failed to remove message:", error);
		}
	}
	/**
	* Update message retry count
	*/
	async updateMessageRetry(messageId, retryCount) {
		try {
			const db = await this.initDB();
			if (db) await this.updateInIndexedDB(db, messageId, { retryCount });
			else this.updateInSessionStorage(messageId, { retryCount });
		} catch (error) {
			console.error("[MessageQueue] Failed to update message retry:", error);
		}
	}
	/**
	* Clear all expired messages
	*/
	async clearExpiredMessages() {
		try {
			const messages = await this.getQueuedMessages();
			const now = Date.now();
			const expiredIds = messages.filter((msg) => msg.expiresAt && msg.expiresAt <= now).map((msg) => msg.id);
			for (const id of expiredIds) await this.removeMessage(id);
			if (expiredIds.length > 0) console.log(`[MessageQueue] Cleared ${expiredIds.length} expired messages`);
			return expiredIds.length;
		} catch (error) {
			console.error("[MessageQueue] Failed to clear expired messages:", error);
			return 0;
		}
	}
	/**
	* Clear all messages
	*/
	async clearAll() {
		try {
			const db = await this.initDB();
			if (db) await this.clearIndexedDB(db);
			else sessionStorage.removeItem(this.options.fallbackStorageKey);
			console.log("[MessageQueue] Cleared all messages");
		} catch (error) {
			console.error("[MessageQueue] Failed to clear all messages:", error);
		}
	}
	/**
	* Get queue statistics
	*/
	async getStats() {
		const messages = await this.getQueuedMessages();
		const now = Date.now();
		const byPriority = {
			low: 0,
			normal: 0,
			high: 0
		};
		const byDestination = {};
		let expired = 0;
		for (const msg of messages) {
			byPriority[msg.priority]++;
			if (msg.destination) byDestination[msg.destination] = (byDestination[msg.destination] || 0) + 1;
			if (msg.expiresAt && msg.expiresAt <= now) expired++;
		}
		return {
			total: messages.length,
			byPriority,
			byDestination,
			expired
		};
	}
	async addToIndexedDB(db, message) {
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).add(message);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
	async getAllFromIndexedDB(db) {
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.options.storeName], "readonly").objectStore(this.options.storeName).getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
	async deleteFromIndexedDB(db, id) {
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).delete(id);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
	async updateInIndexedDB(db, id, updates) {
		const store = db.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName);
		const message = await new Promise((resolve, reject) => {
			const request = store.get(id);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		if (message) {
			Object.assign(message, updates);
			await new Promise((resolve, reject) => {
				const request = store.put(message);
				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		}
	}
	async clearIndexedDB(db) {
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.options.storeName], "readwrite").objectStore(this.options.storeName).clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
	getAllFromSessionStorage() {
		try {
			const stored = sessionStorage.getItem(this.options.fallbackStorageKey);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	}
	addToSessionStorage(message) {
		const existing = this.getAllFromSessionStorage();
		existing.push(message);
		sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(existing));
	}
	deleteFromSessionStorage(id) {
		const filtered = this.getAllFromSessionStorage().filter((msg) => msg.id !== id);
		sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(filtered));
	}
	updateInSessionStorage(id, updates) {
		const existing = this.getAllFromSessionStorage();
		const message = existing.find((msg) => msg.id === id);
		if (message) {
			Object.assign(message, updates);
			sessionStorage.setItem(this.options.fallbackStorageKey, JSON.stringify(existing));
		}
	}
	/**
	* Check if IndexedDB is available
	*/
	static isIndexedDBAvailable() {
		try {
			return typeof indexedDB !== "undefined" && typeof IDBTransaction !== "undefined" && typeof IDBKeyRange !== "undefined";
		} catch {
			return false;
		}
	}
};
var instances = /* @__PURE__ */ new Map();
/**
* Get or create a MessageQueue instance
*/
function getMessageQueue(options) {
	const key = options?.dbName ?? "default";
	if (!instances.has(key)) instances.set(key, new MessageQueue(options));
	return instances.get(key);
}
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/utils/Env.ts
var isServiceWorkerContext = () => {
	try {
		const SWGS = globalThis?.ServiceWorkerGlobalScope;
		return typeof SWGS !== "undefined" && globalThis instanceof SWGS;
	} catch {
		return false;
	}
};
var isChromeExtensionContext = () => {
	try {
		return typeof chrome !== "undefined" && !!chrome?.runtime?.id;
	} catch {
		return false;
	}
};
/**
* Detect the current runtime context.
*
* NOTE: In MV3, the background is a Service Worker but still part of the
* extension runtime. We treat it as "chrome-extension" for API compatibility.
*/
var detectExecutionContext = () => {
	if (isChromeExtensionContext()) return "chrome-extension";
	if (isServiceWorkerContext()) return "service-worker";
	try {
		if (typeof document !== "undefined") return "main";
	} catch {}
	return "unknown";
};
var supportsDedicatedWorkers = () => {
	if (isServiceWorkerContext()) return false;
	try {
		return typeof Worker !== "undefined";
	} catch {
		return false;
	}
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/next/utils/Utils.ts
/**
* Create a service worker channel (for when running in service worker context)
*/
var createServiceWorkerChannel = async (config) => {
	return {
		async request(method, args = []) {
			return new Promise((resolve, reject) => {
				const channel = new BroadcastChannel(`${config.name}-sw-channel`);
				const messageId = UUIDv4();
				const timeout = setTimeout(() => {
					channel.close();
					reject(/* @__PURE__ */ new Error(`Service worker request timeout: ${method}`));
				}, 1e4);
				channel.onmessage = (event) => {
					const { id, result, error } = event.data;
					if (id === messageId) {
						clearTimeout(timeout);
						channel.close();
						if (error) reject(new Error(error));
						else resolve(result);
					}
				};
				channel.postMessage({
					id: messageId,
					type: "request",
					method,
					args
				});
			});
		},
		close() {}
	};
};
/**
* Create a worker channel with simplified API
*/
var createWorkerChannel = async (config) => {
	const context = config.context;
	if (context === "service-worker") return createServiceWorkerChannel(config);
	let worker;
	if (typeof config.script === "function") worker = config.script();
	else if (config.script instanceof Worker) worker = config.script;
	else if (context === "chrome-extension") try {
		worker = new Worker(chrome.runtime.getURL(config.script), config.options);
	} catch (error) {
		worker = new Worker(new URL(config.script, import.meta.url), config.options);
	}
	else worker = new Worker(new URL(config.script, import.meta.url), config.options);
	return await createOrUseExistingChannel(config.name, {}, worker);
};
/**
* Create an optimized worker channel with queuing support
*/
var createQueuedOptimizedWorkerChannel = (config, options, onChannelReady) => {
	const optimizedChannel = new OptimizedWorkerChannel(null, options, onChannelReady);
	createWorkerChannel(config).then((baseChannel) => {
		optimizedChannel.setChannel(baseChannel);
	}).catch((error) => {
		console.error("[createQueuedOptimizedWorkerChannel] Failed to create base channel:", error);
		optimizedChannel.close();
	});
	return optimizedChannel;
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/messaging/Protocol.ts
var PURPOSES = new Set([
	"invoke",
	"mail",
	"attach",
	"deliver",
	"defer"
]);
var TYPES = new Set([
	"request",
	"response",
	"invoke",
	"ack",
	"act",
	"ask"
]);
var DEFAULT_PURPOSE = "mail";
var asString = (value) => String(value ?? "").trim();
var normalizePath = (path) => {
	if (!path) return void 0;
	const normalized = (Array.isArray(path) ? path : [path]).map(asString).filter(Boolean);
	return normalized.length > 0 ? normalized : void 0;
};
var normalizeArgs = (args) => {
	if (args == null) return void 0;
	return Array.isArray(args) ? args : [args];
};
var normalizeTransfer = (transfer) => {
	if (transfer == null) return void 0;
	return Array.isArray(transfer) ? transfer : [transfer];
};
var normalizePurpose = (purpose) => {
	const input = Array.isArray(purpose) ? purpose : purpose ? [purpose] : [DEFAULT_PURPOSE];
	const deduped = [];
	for (const entry of input) if (PURPOSES.has(entry) && !deduped.includes(entry)) deduped.push(entry);
	return deduped.length > 0 ? deduped : [DEFAULT_PURPOSE];
};
var inferType = (input) => {
	const explicit = asString(input.type);
	if (TYPES.has(explicit)) return explicit;
	const op = asString(input.op);
	if (op === "get" || op === "set" || op === "apply" || op === "import") return "invoke";
	if (input.error) return "response";
	return "request";
};
var inferOperation = (input, resolvedType) => {
	if (input.op) return input.op;
	if (resolvedType === "invoke") return "invoke";
	if (resolvedType === "act") return "deliver";
	return "mail";
};
var inferProtocol = (protocol) => {
	const value = asString(protocol).toLowerCase();
	if (!value) return "unknown";
	return value;
};
var randomId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `uniform_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};
var createProtocolEnvelope = (input) => {
	const timestamp = Number.isFinite(input.timestamp) ? Number(input.timestamp) : Date.now();
	const source = asString(input.srcChannel ?? input.source) || "uniform";
	const destination = asString(input.destination);
	const dstChannel = input.dstChannel ?? (destination ? destination : void 0);
	const uuid = asString(input.uuid ?? input.id) || randomId();
	const type = inferType(input);
	const payload = input.payload ?? input.data;
	const metadata = { ...input.metadata ?? {} };
	return {
		purpose: normalizePurpose(input.purpose),
		protocol: inferProtocol(input.protocol),
		redirect: Boolean(input.redirect),
		flags: { ...input.flags ?? {} },
		type,
		path: normalizePath(input.path),
		result: input.result,
		args: normalizeArgs(input.args),
		op: inferOperation(input, type),
		error: input.error ? String(input.error) : void 0,
		timestamp,
		where: asString(input.where) || void 0,
		uuid,
		bridges: Array.isArray(input.bridges) ? input.bridges.map(asString).filter(Boolean) : [],
		payload,
		transfer: normalizeTransfer(input.transfer),
		extension: input.extension,
		defer: input.defer,
		srcChannel: source,
		dstChannel,
		id: uuid,
		source,
		destination: destination || void 0,
		data: payload,
		contentType: asString(input.contentType) || void 0,
		metadata
	};
};
var isProtocolEnvelope = (value) => {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.uuid === "string" && typeof candidate.srcChannel === "string" && Array.isArray(candidate.purpose) && typeof candidate.type === "string";
};
var normalizeProtocolEnvelope = (value) => isProtocolEnvelope(value) ? createProtocolEnvelope(value) : createProtocolEnvelope(value);
var ProtocolReplayGuard = class {
	seen = /* @__PURE__ */ new Map();
	windowMs;
	constructor(windowMs = 300) {
		this.windowMs = Math.max(10, windowMs);
	}
	accept(envelope) {
		const now = Date.now();
		const key = envelope.uuid;
		const previous = this.seen.get(key);
		this.prune(now);
		if (previous && now - previous <= this.windowMs) return false;
		this.seen.set(key, now);
		return true;
	}
	prune(now) {
		for (const [id, ts] of this.seen.entries()) if (now - ts > this.windowMs) this.seen.delete(id);
	}
};
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/messaging/UnifiedMessaging.ts
var PendingMessageStore = class {
	storageKey;
	maxMessages;
	defaultTTLMs;
	constructor(options) {
		this.storageKey = options?.storageKey ?? "uniform-messaging-pending";
		this.maxMessages = options?.maxMessages ?? 200;
		this.defaultTTLMs = options?.defaultTTLMs ?? 1440 * 60 * 1e3;
	}
	read() {
		if (typeof window === "undefined" || typeof localStorage === "undefined") return [];
		try {
			const raw = localStorage.getItem(this.storageKey);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}
	write(entries) {
		if (typeof window === "undefined" || typeof localStorage === "undefined") return;
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(entries));
		} catch {}
	}
	enqueue(destination, message) {
		if (!destination) return;
		const now = Date.now();
		if ((Number(message?.metadata?.expiresAt) ? Math.max(0, Number(message.metadata.expiresAt) - now) : this.defaultTTLMs) <= 0) return;
		const entries = this.read().filter((e) => e && typeof e === "object").filter((e) => {
			return (Number(e?.message?.metadata?.expiresAt) || Number(e?.storedAt) + this.defaultTTLMs) > now;
		});
		entries.push({
			destination,
			message,
			storedAt: now
		});
		if (entries.length > this.maxMessages) entries.splice(0, entries.length - this.maxMessages);
		this.write(entries);
	}
	drain(destination) {
		if (!destination) return [];
		const now = Date.now();
		const entries = this.read();
		const keep = [];
		const out = [];
		for (const e of entries) {
			if ((Number(e?.message?.metadata?.expiresAt) || Number(e?.storedAt) + this.defaultTTLMs) <= now) continue;
			if (e?.destination === destination && e?.message) out.push(e.message);
			else keep.push(e);
		}
		this.write(keep);
		return out;
	}
	has(destination) {
		if (!destination) return false;
		const now = Date.now();
		return this.read().some((e) => {
			if (!e || typeof e !== "object") return false;
			return (Number(e?.message?.metadata?.expiresAt) || Number(e?.storedAt) + this.defaultTTLMs) > now && e?.destination === destination;
		});
	}
	clear() {
		this.write([]);
	}
};
var UnifiedMessagingManager = class {
	handlers = /* @__PURE__ */ new Map();
	channels = /* @__PURE__ */ new Map();
	workerChannels = /* @__PURE__ */ new Map();
	viewChannels = /* @__PURE__ */ new Map();
	pipelines = /* @__PURE__ */ new Map();
	messageQueue;
	pendingStore;
	initializedViews = /* @__PURE__ */ new Set();
	viewReadyPromises = /* @__PURE__ */ new Map();
	executionContext;
	channelMappings;
	componentRegistry = /* @__PURE__ */ new Map();
	replayGuard = new ProtocolReplayGuard(300);
	localChannelId = "";
	constructor(config = {}) {
		this.executionContext = detectExecutionContext();
		this.localChannelId = `${this.executionContext}:${Math.random().toString(36).slice(2, 10)}`;
		this.channelMappings = config.channelMappings ?? {};
		this.messageQueue = getMessageQueue(config.queueOptions);
		this.pendingStore = new PendingMessageStore(config.pendingStoreOptions);
		this.setupGlobalListeners();
	}
	/**
	* Register a message handler for a specific destination
	*/
	registerHandler(destination, handler) {
		if (!this.handlers.has(destination)) this.handlers.set(destination, []);
		this.handlers.get(destination).push(handler);
	}
	/**
	* Unregister a message handler
	*/
	unregisterHandler(destination, handler) {
		const handlers = this.handlers.get(destination);
		if (handlers) {
			const index = handlers.indexOf(handler);
			if (index > -1) handlers.splice(index, 1);
		}
	}
	/**
	* Send a message to a destination
	*/
	async sendMessage(message) {
		const fullMessage = this.toProtocolMessage(message);
		if (await this.tryDeliverMessage(fullMessage)) return true;
		if (fullMessage.destination) {
			this.pendingStore.enqueue(fullMessage.destination, fullMessage);
			await this.messageQueue.queueMessage(fullMessage.type, fullMessage, {
				priority: fullMessage.metadata?.priority ?? "normal",
				maxRetries: Number(fullMessage.metadata?.maxRetries ?? 3),
				destination: fullMessage.destination
			});
		}
		return false;
	}
	/**
	* Process a message through registered handlers
	*/
	async processMessage(message) {
		const normalized = normalizeProtocolEnvelope(message);
		if (!this.replayGuard.accept(normalized)) return;
		const destination = normalized.destination ?? "general";
		const handlers = this.handlers.get(destination) ?? [];
		for (const handler of handlers) if (handler.canHandle(normalized)) try {
			await handler.handle(normalized);
		} catch (error) {
			console.error(`[UnifiedMessaging] Handler error for ${destination}:`, error);
		}
	}
	/**
	* Try to deliver message immediately
	*/
	async tryDeliverMessage(message) {
		const normalized = normalizeProtocolEnvelope(message);
		if (normalized.destination && this.handlers.has(normalized.destination)) {
			await this.processMessage(normalized);
			return true;
		}
		const channelName = this.getChannelForDestination(normalized.destination);
		if (channelName && this.channels.has(channelName)) {
			const channel = this.channels.get(channelName);
			if (channel instanceof BroadcastChannel) try {
				channel.postMessage(normalized);
				return true;
			} catch (error) {
				console.warn(`[UnifiedMessaging] Failed to post to broadcast channel ${channelName}:`, error);
			}
			else if (channel && "request" in channel) try {
				await channel.request(normalized.type, [normalized]);
				return true;
			} catch (error) {
				console.warn(`[UnifiedMessaging] Failed to post to worker channel ${channelName}:`, error);
			}
		}
		return false;
	}
	/**
	* Register worker channels for a specific view
	*/
	registerViewChannels(viewHash, configs) {
		const channelNames = /* @__PURE__ */ new Set();
		for (const config of configs) {
			if (!this.isWorkerSupported(config)) {
				console.log(`[UnifiedMessaging] Skipping worker '${config.name}' in ${this.executionContext} context`);
				continue;
			}
			const channel = createQueuedOptimizedWorkerChannel({
				name: config.name,
				script: config.script,
				options: config.options,
				context: this.resolveWorkerContext()
			}, config.protocolOptions, () => {
				console.log(`[UnifiedMessaging] Channel '${config.name}' ready for view '${viewHash}'`);
			});
			const channelKey = `${viewHash}:${config.name}`;
			this.workerChannels.set(channelKey, channel);
			this.channels.set(channelKey, channel);
			channelNames.add(config.name);
		}
		this.viewChannels.set(viewHash, channelNames);
	}
	/**
	* Initialize channels when a view becomes active
	*/
	async initializeViewChannels(viewHash) {
		if (this.initializedViews.has(viewHash)) return;
		const deferred = this.createDeferred();
		this.viewReadyPromises.set(viewHash, deferred);
		console.log(`[UnifiedMessaging] Initializing channels for view: ${viewHash}`);
		const channelNames = this.viewChannels.get(viewHash);
		if (!channelNames) {
			deferred.resolve();
			return;
		}
		const initPromises = [];
		for (const channelName of channelNames) {
			const channelKey = `${viewHash}:${channelName}`;
			const channel = this.workerChannels.get(channelKey);
			if (channel) initPromises.push(channel.request("ping", {}).catch(() => {
				console.log(`[UnifiedMessaging] Channel '${channelName}' queued for view '${viewHash}'`);
			}));
		}
		await Promise.allSettled(initPromises);
		this.initializedViews.add(viewHash);
		deferred.resolve();
	}
	/**
	* Get a worker channel for a specific view and worker
	*/
	getWorkerChannel(viewHash, workerName) {
		return this.workerChannels.get(`${viewHash}:${workerName}`) ?? null;
	}
	/**
	* Create or get a broadcast channel
	*/
	getBroadcastChannel(channelName) {
		if (!this.channels.has(channelName)) try {
			const channel = new BroadcastChannel(channelName);
			channel.addEventListener("message", (event) => {
				this.handleBroadcastMessage(event.data, channelName);
			});
			this.channels.set(channelName, channel);
		} catch (error) {
			console.warn(`[UnifiedMessaging] BroadcastChannel not available: ${channelName}`, error);
			this.channels.set(channelName, {
				postMessage: () => {},
				close: () => {},
				addEventListener: () => {},
				removeEventListener: () => {}
			});
		}
		return this.channels.get(channelName);
	}
	/**
	* Handle incoming broadcast messages
	*/
	async handleBroadcastMessage(message, channelName) {
		try {
			const envelope = this.toProtocolMessage(message ?? {}, channelName);
			if (envelope.srcChannel === this.localChannelId) return;
			await this.processMessage(envelope);
		} catch (error) {
			console.error(`[UnifiedMessaging] Error handling broadcast message on ${channelName}:`, error);
		}
	}
	/**
	* Register a message processing pipeline
	*/
	registerPipeline(config) {
		this.pipelines.set(config.name, config);
	}
	/**
	* Process a message through a pipeline
	*/
	async processThroughPipeline(pipelineName, message) {
		const pipeline = this.pipelines.get(pipelineName);
		if (!pipeline) throw new Error(`Pipeline '${pipelineName}' not found`);
		let currentMessage = { ...message };
		const timeout = pipeline.timeout ?? 3e4;
		for (const stage of pipeline.stages) {
			const stageTimeout = stage.timeout ?? timeout;
			const retries = stage.retries ?? 0;
			for (let attempt = 0; attempt <= retries; attempt++) try {
				currentMessage = await Promise.race([stage.handler(currentMessage), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error(`Stage '${stage.name}' timeout`)), stageTimeout))]);
				break;
			} catch (error) {
				if (attempt === retries) {
					if (pipeline.errorHandler) pipeline.errorHandler(error, stage, currentMessage);
					throw error;
				}
				console.warn(`[UnifiedMessaging] Pipeline '${pipelineName}' stage '${stage.name}' attempt ${attempt + 1} failed:`, error);
			}
		}
		return currentMessage;
	}
	/**
	* Process queued messages for a destination
	*/
	async processQueuedMessages(destination) {
		const queuedMessages = await this.messageQueue.getQueuedMessages(destination);
		for (const queuedMessage of queuedMessages) {
			const dataAsMessage = queuedMessage.data;
			const message = dataAsMessage && typeof dataAsMessage === "object" && typeof dataAsMessage.type === "string" && typeof dataAsMessage.id === "string" ? this.toProtocolMessage(dataAsMessage) : {
				...this.toProtocolMessage({
					id: queuedMessage.id,
					type: queuedMessage.type,
					source: "queue",
					destination: queuedMessage.destination,
					data: queuedMessage.data,
					metadata: {
						timestamp: queuedMessage.timestamp,
						retryCount: queuedMessage.retryCount,
						maxRetries: queuedMessage.maxRetries,
						...queuedMessage.metadata
					}
				}),
				type: queuedMessage.type
			};
			if (await this.tryDeliverMessage(message)) await this.messageQueue.removeMessage(queuedMessage.id);
		}
	}
	/**
	* Register a component with a destination
	*/
	registerComponent(componentId, destination) {
		this.componentRegistry.set(componentId, destination);
		this.processQueuedMessages(destination).catch((error) => {
			console.warn(`[UnifiedMessaging] Failed to process queued messages for ${destination}:`, error);
		});
	}
	/**
	* Initialize a component and return any pending messages
	*/
	initializeComponent(componentId) {
		const destination = this.componentRegistry.get(componentId);
		if (!destination) return [];
		this.processQueuedMessages(destination).catch((error) => {
			console.warn(`[UnifiedMessaging] Failed to replay queued messages for ${destination}:`, error);
		});
		return this.pendingStore.drain(destination);
	}
	/**
	* Check if there are pending messages for a destination
	*/
	hasPendingMessages(destination) {
		return this.pendingStore.has(destination);
	}
	/**
	* Explicitly enqueue a pending message
	*/
	enqueuePendingMessage(destination, message) {
		const dest = String(destination ?? "").trim();
		if (!dest || !message) return;
		this.pendingStore.enqueue(dest, message);
	}
	/**
	* Set channel mappings
	*/
	setChannelMappings(mappings) {
		this.channelMappings = {
			...this.channelMappings,
			...mappings
		};
	}
	/**
	* Get channel name for a destination
	*/
	getChannelForDestination(destination) {
		if (!destination) return null;
		return this.channelMappings[destination] ?? null;
	}
	detectProtocolName() {
		if (this.executionContext === "chrome-extension") return "chrome";
		if (this.executionContext === "service-worker") return "service";
		if (this.executionContext === "main") return "window";
		return "unknown";
	}
	resolveWorkerContext() {
		if (this.executionContext === "main") return "main";
		if (this.executionContext === "service-worker") return "service-worker";
		if (this.executionContext === "chrome-extension") return "chrome-extension";
	}
	toProtocolMessage(message, fallbackSource) {
		return createProtocolEnvelope({
			...message,
			id: message.id,
			type: message.type ?? "unknown",
			source: message.source ?? fallbackSource ?? this.localChannelId,
			destination: message.destination,
			data: message.data,
			metadata: {
				timestamp: Date.now(),
				...message.metadata ?? {}
			},
			protocol: this.detectProtocolName(),
			purpose: "mail",
			srcChannel: message.source ?? this.localChannelId,
			dstChannel: message.destination
		});
	}
	/**
	* Check if a worker configuration is supported
	*/
	isWorkerSupported(_config) {
		if (this.executionContext === "service-worker") return true;
		if (this.executionContext === "chrome-extension") return supportsDedicatedWorkers();
		return true;
	}
	/**
	* Set up global listeners for cross-component communication
	*/
	setupGlobalListeners() {
		if (typeof window !== "undefined") globalThis.addEventListener("message", (event) => {
			if (event.data && typeof event.data === "object" && event.data.type) this.handleBroadcastMessage(event.data, "window-message");
		});
	}
	/**
	* Create a deferred promise
	*/
	createDeferred() {
		let resolve;
		let reject;
		const promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return {
			resolve,
			reject,
			promise
		};
	}
	/**
	* Get execution context
	*/
	getExecutionContext() {
		return this.executionContext;
	}
	/**
	* Clean up resources
	*/
	destroy() {
		for (const channel of this.channels.values()) if (channel instanceof BroadcastChannel) channel.close();
		else if (channel && "close" in channel) channel.close();
		this.channels.clear();
		this.workerChannels.clear();
		this.handlers.clear();
		this.pipelines.clear();
	}
};
var defaultInstance = null;
/**
* Get the default UnifiedMessagingManager instance
*/
function getUnifiedMessaging(config) {
	if (!defaultInstance) defaultInstance = new UnifiedMessagingManager(config);
	return defaultInstance;
}
//#endregion
//#region ../../modules/projects/uniform.ts/src/newer/messaging/ServiceChannelManager.ts
/**
* Service Channel Manager
* Manages BroadcastChannel-based service channels for views and components
* Part of fest/uniform - configurable without app-specific dependencies
*/
var ServiceChannelManager = class {
	channels = /* @__PURE__ */ new Map();
	readyPromises = /* @__PURE__ */ new Map();
	messageHandlers = /* @__PURE__ */ new Map();
	channelConfigs;
	executionContext;
	logPrefix;
	constructor(config = {}) {
		this.channelConfigs = config.channels ?? {};
		this.logPrefix = config.logPrefix ?? "[ServiceChannels]";
		this.executionContext = detectExecutionContext();
		console.log(`${this.logPrefix} Initialized in ${this.executionContext} context`);
	}
	/**
	* Register channel configurations
	*/
	registerConfigs(configs) {
		this.channelConfigs = {
			...this.channelConfigs,
			...configs
		};
	}
	/**
	* Get channel configuration
	*/
	getConfig(channelId) {
		return this.channelConfigs[channelId];
	}
	/**
	* Get all channel configurations
	*/
	getAllConfigs() {
		return { ...this.channelConfigs };
	}
	/**
	* Initialize a service channel
	*/
	async initChannel(channelId) {
		if (this.channels.has(channelId)) return this.channels.get(channelId);
		const config = this.channelConfigs[channelId];
		if (!config) throw new Error(`Unknown channel: ${channelId}. Register configuration first.`);
		let resolveReady;
		const readyPromise = new Promise((resolve) => {
			resolveReady = resolve;
		});
		this.readyPromises.set(channelId, {
			promise: readyPromise,
			resolve: resolveReady
		});
		console.log(`${this.logPrefix} Initializing channel: ${channelId} -> ${config.broadcastName}`);
		const channel = new BroadcastChannel(config.broadcastName);
		channel.onmessage = (event) => {
			this.handleIncomingMessage(channelId, event.data);
		};
		channel.onmessageerror = (event) => {
			console.error(`${this.logPrefix} Message error on ${channelId}:`, event);
		};
		this.channels.set(channelId, channel);
		resolveReady();
		console.log(`${this.logPrefix} Channel ready: ${channelId}`);
		return channel;
	}
	/**
	* Close a service channel
	*/
	closeChannel(channelId) {
		const channel = this.channels.get(channelId);
		if (channel) {
			channel.close();
			this.channels.delete(channelId);
			this.readyPromises.delete(channelId);
			this.messageHandlers.delete(channelId);
			console.log(`${this.logPrefix} Channel closed: ${channelId}`);
		}
	}
	/**
	* Close all channels
	*/
	closeAll() {
		for (const channelId of this.channels.keys()) this.closeChannel(channelId);
	}
	/**
	* Wait for a channel to be ready
	*/
	async waitForChannel(channelId) {
		const deferred = this.readyPromises.get(channelId);
		if (deferred) await deferred.promise;
		else await this.initChannel(channelId);
	}
	/**
	* Send a message to a channel
	*/
	async send(target, type, data, options = {}) {
		await this.waitForChannel(target);
		const channel = this.channels.get(target);
		if (!channel) throw new Error(`Channel not ready: ${target}`);
		const message = {
			type,
			source: options.source ?? this.executionContext,
			target,
			data,
			timestamp: Date.now(),
			correlationId: options.correlationId
		};
		channel.postMessage(message);
		console.log(`${this.logPrefix} Sent message to ${target}:`, type);
	}
	/**
	* Broadcast a message to all initialized channels
	*/
	broadcast(type, data, source) {
		for (const [channelId, channel] of this.channels) {
			const message = {
				type,
				source: source ?? this.executionContext,
				target: channelId,
				data,
				timestamp: Date.now()
			};
			channel.postMessage(message);
		}
		console.log(`${this.logPrefix} Broadcast message:`, type);
	}
	/**
	* Subscribe to messages on a channel
	*/
	subscribe(channelId, handler) {
		if (!this.messageHandlers.has(channelId)) this.messageHandlers.set(channelId, /* @__PURE__ */ new Set());
		this.messageHandlers.get(channelId).add(handler);
		this.initChannel(channelId).catch(console.error);
		return () => {
			this.messageHandlers.get(channelId)?.delete(handler);
		};
	}
	/**
	* Handle incoming message
	*/
	handleIncomingMessage(channelId, data) {
		const handlers = this.messageHandlers.get(channelId);
		if (!handlers || handlers.size === 0) {
			console.log(`${this.logPrefix} No handlers for ${channelId}, message queued`);
			return;
		}
		const message = data;
		for (const handler of handlers) try {
			handler(message);
		} catch (error) {
			console.error(`${this.logPrefix} Handler error on ${channelId}:`, error);
		}
	}
	/**
	* Check if channel is initialized
	*/
	isInitialized(channelId) {
		return this.channels.has(channelId);
	}
	/**
	* Get all initialized channel IDs
	*/
	getInitializedChannels() {
		return Array.from(this.channels.keys());
	}
	/**
	* Get channel status
	*/
	getStatus() {
		const status = {};
		for (const channelId of Object.keys(this.channelConfigs)) status[channelId] = {
			connected: this.channels.has(channelId),
			lastActivity: Date.now(),
			pendingMessages: 0
		};
		return status;
	}
	/**
	* Get execution context
	*/
	getExecutionContext() {
		return this.executionContext;
	}
};
/**
* Create a new ServiceChannelManager instance
*/
function createServiceChannelManager(config) {
	return new ServiceChannelManager(config);
}
//#endregion
export { normalizeProtocolEnvelope as a, isProtocolEnvelope as i, getUnifiedMessaging as n, createWorkerChannel as o, createProtocolEnvelope as r, QueuedWorkerChannel as s, createServiceChannelManager as t };
