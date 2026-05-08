import { r as __exportAll } from "./rolldown-runtime.js";
import { a as normalizeProtocolEnvelope, i as isProtocolEnvelope, r as createProtocolEnvelope } from "../fest/uniform.js";
import { t as createInteropEnvelope } from "./UniformInterop2.js";
import { n as registerPlugin, t as WebPlugin } from "../vendor/@capacitor_core.js";
//#region src/shared/routing/native/cws-bridge.ts
var cws_bridge_exports = /* @__PURE__ */ __exportAll({
	CwsBridge: () => CwsBridge,
	getNativeUnifiedSettings: () => getNativeUnifiedSettings,
	initCwsNativeBridge: () => initCwsNativeBridge,
	invokeCwsPlatformIPC: () => invokeCwsPlatformIPC,
	isCapacitorCwsNativeShell: () => isCapacitorCwsNativeShell,
	isCwsNativeIpcAvailable: () => isCwsNativeIpcAvailable,
	isElectronCwsNativeShell: () => isElectronCwsNativeShell,
	patchNativeUnifiedSettings: () => patchNativeUnifiedSettings
});
var CwsBridgeWeb = class extends WebPlugin {
	async getShellInfo() {
		return {
			shell: "browser",
			bridge: "cws-bridge",
			native: false,
			platform: typeof globalThis.navigator !== "undefined" ? "web" : "unknown"
		};
	}
	async invoke(options) {
		const envelope = normalizeBridgeEnvelope(options.channel, options.payload, options.envelope);
		return {
			ok: true,
			channel: options.channel,
			echo: { ...options.payload ?? {} },
			envelope
		};
	}
};
var CwsBridge = registerPlugin("CwsBridge", { web: () => new CwsBridgeWeb() });
var bridgeInitDone = false;
var normalizeBridgeEnvelope = (channel, payload, envelope) => {
	if (envelope && isProtocolEnvelope(envelope)) return normalizeProtocolEnvelope(envelope);
	return createProtocolEnvelope({
		...createInteropEnvelope({
			purpose: "invoke",
			protocol: "service",
			transport: "service-worker",
			type: "invoke",
			op: "invoke",
			source: "webview",
			destination: "native",
			srcChannel: "webview",
			dstChannel: "native",
			payload: payload ?? {},
			data: payload ?? {}
		}),
		path: ["cws-bridge", channel]
	});
};
var normalizeInvokeResultEnvelope = (channel, payload, result) => {
	if (result?.envelope && isProtocolEnvelope(result.envelope)) return normalizeProtocolEnvelope(result.envelope);
	return createProtocolEnvelope({
		...createInteropEnvelope({
			purpose: "invoke",
			protocol: "service",
			transport: "service-worker",
			type: result.ok ? "response" : "ack",
			op: "invoke",
			source: "native",
			destination: "webview",
			srcChannel: "native",
			dstChannel: "webview",
			payload,
			data: payload
		}),
		path: ["cws-bridge", channel]
	});
};
/**
* Initialize the native bridge surface and normalize inbound native messages.
*
* AI-READ: this is the TypeScript side of the WebView/native boundary, so it
* is one of the first places to inspect when networking works natively but not
* through the web shell or vice versa.
*/
async function initCwsNativeBridge() {
	if (bridgeInitDone) return typeof globalThis.window !== "undefined" ? globalThis.window.__CWS_SHELL_INFO__ ?? null : null;
	bridgeInitDone = true;
	const electronInfoFn = globalThis.window?.electronBridge?.getShellInfo;
	if (typeof electronInfoFn === "function") try {
		const info = await electronInfoFn();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		return info;
	} catch {}
	try {
		const info = await CwsBridge.getShellInfo();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		try {
			await CwsBridge.addListener("nativeMessage", (event) => {
				const payload = event && typeof event.payload === "object" && event.payload != null ? event.payload : {};
				const envelopeRaw = payload?.envelope;
				const envelope = envelopeRaw && typeof envelopeRaw === "object" && isProtocolEnvelope(envelopeRaw) ? normalizeProtocolEnvelope(envelopeRaw) : createProtocolEnvelope(createInteropEnvelope({
					purpose: "mail",
					protocol: "service",
					transport: "service-worker",
					type: "act",
					op: "deliver",
					source: "native",
					destination: "webview",
					srcChannel: "native",
					dstChannel: "webview",
					payload,
					data: payload
				}));
				globalThis.dispatchEvent(new CustomEvent("cws-native-message", { detail: {
					event,
					envelope,
					payload
				} }));
			});
		} catch {}
		return info;
	} catch {
		return null;
	}
}
/** Detect the Capacitor/CWSAndroid shell where native networking may replace browser transport rules. */
var isCapacitorCwsNativeShell = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Detect the Electron shell, which uses its own invoke bridge instead of Capacitor plugins. */
var isElectronCwsNativeShell = () => {
	try {
		return Boolean(globalThis.window?.electronBridge?.invoke);
	} catch {
		return false;
	}
};
/** Report whether frontend code can rely on native IPC instead of web-only fallbacks. */
var isCwsNativeIpcAvailable = () => {
	if (isElectronCwsNativeShell()) return true;
	if (!isCapacitorCwsNativeShell()) return false;
	try {
		const shell = globalThis.window?.__CWS_SHELL_INFO__;
		return Boolean(shell?.native);
	} catch {
		return true;
	}
};
/**
* Canonical IPC invoker for frontend modules:
* - Uses CWSAndroid native bridge envelope transport when available
* - Falls back to web plugin-compatible invoke otherwise
*/
async function invokeCwsPlatformIPC(input) {
	const channel = (input.channel || "").trim() || (Array.isArray(input.envelope?.path) && input.envelope?.path.length ? String(input.envelope.path[input.envelope.path.length - 1] || "").trim() : "") || "default";
	const payload = input.payload && typeof input.payload === "object" ? input.payload : {};
	const envelope = normalizeBridgeEnvelope(channel, payload, input.envelope);
	const electronInvoke = globalThis.window?.electronBridge?.invoke;
	if (typeof electronInvoke === "function") {
		const result = await electronInvoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	if (!isCwsNativeIpcAvailable()) {
		const result = await CwsBridge.invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	const result = await CwsBridge.invoke({
		channel,
		payload,
		envelope
	});
	return {
		...result,
		envelope: normalizeInvokeResultEnvelope(channel, payload, result)
	};
}
async function getNativeUnifiedSettings() {
	try {
		const result = await invokeCwsPlatformIPC({ channel: "settings:get" });
		if (!result?.ok) return null;
		return result.appSettings && typeof result.appSettings === "object" ? result.appSettings : null;
	} catch {
		return null;
	}
}
/** Patch native-side settings through the same bridge used by transport/runtime configuration. */
async function patchNativeUnifiedSettings(appSettings) {
	try {
		const result = await invokeCwsPlatformIPC({
			channel: "settings:patch",
			payload: { appSettings }
		});
		return Boolean(result?.ok);
	} catch {
		return false;
	}
}
//#endregion
export { initCwsNativeBridge as n, isCapacitorCwsNativeShell as r, cws_bridge_exports as t };
