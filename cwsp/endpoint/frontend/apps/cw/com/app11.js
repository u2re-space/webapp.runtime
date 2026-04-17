import { a as normalizeProtocolEnvelope, i as isProtocolEnvelope, r as createProtocolEnvelope } from "../fest/uniform.js";
import { p as createInteropEnvelope } from "./service4.js";
import { n as registerPlugin, t as WebPlugin } from "../vendor/@capacitor_core.js";
//#region src/com/native/cws-bridge.ts
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
export { getNativeUnifiedSettings, isCwsNativeIpcAvailable, patchNativeUnifiedSettings };
