import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { a as initServiceWorker } from "../chunks/sw-handling.js";
import { g as loadAsAdopted } from "../fest/dom.js";
import { q as H } from "../com/app.js";
import { n as loadSettings } from "../chunks/Settings.js";
import { A as invalidateAirpadTransportCredentials, D as reloadAirpadRemoteConfigFromStorage, E as isShellRemoteClipboardBridgeEnabled, O as setAccessToken, a as attachAirpadCrossTabConfigSync, d as getAirPadQuickConnectTarget, k as setAirPadQuickConnectTarget, n as REL_ORIENT_DEADZONE, o as getAccessToken, r as REL_ORIENT_SMOOTH, v as getRemoteHost, y as getRemoteProtocol } from "./airpad.js";
import { C as getClipboardPreviewEl, D as queryAirpad, E as log, O as setAirpadDomRoot, S as getBtnPaste, T as getVoiceTextEl, _ as getAirpadDomRoot, a as onServerClipboardUpdate, b as getBtnCopy, c as sendCoordinatorAct, f as getAiButton, g as getAirStatusEl, h as getAirNeighborButton, i as isWSConnected, l as sendCoordinatorAsk, m as getAirButton, n as disconnectWS, o as onVoiceResult, p as getAiStatusEl, r as initWebSocket, s as onWSConnectionChange, t as connectWS, u as sendCoordinatorRequest, v as getAirpadOwnerDocument, w as getVkStatusEl, x as getBtnCut, y as getBtnConnect } from "./airpad2.js";
//#region src/frontend/views/airpad/input/keyboard/api.ts
var virtualKeyboardAPI = null;
function initVirtualKeyboardAPI() {
	if ("virtualKeyboard" in navigator && navigator.virtualKeyboard) {
		virtualKeyboardAPI = navigator.virtualKeyboard;
		virtualKeyboardAPI.overlaysContent = true;
		log("VirtualKeyboard API available");
		return true;
	}
	return false;
}
function getVirtualKeyboardAPI() {
	return virtualKeyboardAPI;
}
function hasVirtualKeyboardAPI() {
	return virtualKeyboardAPI !== null;
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/state.ts
var keyboardVisible = false;
var keyboardElement = null;
var toggleButton = null;
var remoteKeyboardEnabled = false;
function setKeyboardVisible(visible) {
	keyboardVisible = visible;
}
function isKeyboardVisible() {
	return keyboardVisible;
}
function setKeyboardElement(element) {
	keyboardElement = element;
}
function getKeyboardElement() {
	return keyboardElement;
}
function setToggleButton(button) {
	toggleButton = button;
}
function getToggleButton() {
	return toggleButton;
}
function setRemoteKeyboardEnabled$1(enabled) {
	remoteKeyboardEnabled = enabled;
}
function isRemoteKeyboardEnabled() {
	return remoteKeyboardEnabled;
}
if ("visualViewport" in globalThis) {
	const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = .75;
	globalThis?.visualViewport?.addEventListener?.("resize", function(event) {
		if (event.target.height * event.target.scale / globalThis?.screen?.height < VIEWPORT_VS_CLIENT_HEIGHT_RATIO) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
if ("virtualKeyboard" in globalThis?.navigator) {
	navigator.virtualKeyboard.overlaysContent = true;
	navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
		const { x, y, width, height } = event.target.boundingRect;
		if (height > 0) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/constants.ts
var EMOJI_CATEGORIES = {
	"smileys": [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"🤣",
		"😂",
		"🙂",
		"🙃",
		"😉",
		"😊",
		"😇",
		"🥰",
		"😍",
		"🤩",
		"😘",
		"😗",
		"😚",
		"😙"
	],
	"gestures": [
		"👋",
		"🤚",
		"🖐",
		"✋",
		"🖖",
		"👌",
		"🤌",
		"🤏",
		"✌️",
		"🤞",
		"🤟",
		"🤘",
		"🤙",
		"👈",
		"👉",
		"👆",
		"🖕",
		"👇",
		"☝️",
		"👍"
	],
	"symbols": [
		"❤️",
		"🧡",
		"💛",
		"💚",
		"💙",
		"💜",
		"🖤",
		"🤍",
		"🤎",
		"💔",
		"❣️",
		"💕",
		"💞",
		"💓",
		"💗",
		"💖",
		"💘",
		"💝",
		"💟",
		"☮️"
	],
	"objects": [
		"⌚",
		"📱",
		"📲",
		"💻",
		"⌨️",
		"🖥️",
		"🖨️",
		"🖱️",
		"🖲️",
		"🕹️",
		"🗜️",
		"💾",
		"💿",
		"📀",
		"📼",
		"📷",
		"📸",
		"📹",
		"🎥",
		"📽️"
	],
	"arrows": [
		"⬆️",
		"↗️",
		"➡️",
		"↘️",
		"⬇️",
		"↙️",
		"⬅️",
		"↖️",
		"↕️",
		"↔️",
		"↩️",
		"↪️",
		"⤴️",
		"⤵️",
		"🔃",
		"🔄",
		"🔙",
		"🔚",
		"🔛",
		"🔜"
	]
};
var KEYBOARD_LAYOUT = [
	[
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
	],
	[
		"q",
		"w",
		"e",
		"r",
		"t",
		"y",
		"u",
		"i",
		"o",
		"p"
	],
	[
		"a",
		"s",
		"d",
		"f",
		"g",
		"h",
		"j",
		"k",
		"l"
	],
	[
		"z",
		"x",
		"c",
		"v",
		"b",
		"n",
		"m"
	]
];
var KEYBOARD_LAYOUT_UPPER = [
	[
		"!",
		"@",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")"
	],
	[
		"Q",
		"W",
		"E",
		"R",
		"T",
		"Y",
		"U",
		"I",
		"O",
		"P"
	],
	[
		"A",
		"S",
		"D",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L"
	],
	[
		"Z",
		"X",
		"C",
		"V",
		"B",
		"N",
		"M"
	]
];
//#endregion
//#region src/frontend/views/airpad/network/rails/packet-ws.ts
var sleep$1 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var toCoordinatorAction = (intent) => {
	switch (intent.type) {
		case "pointer.move": return {
			what: "mouse:move",
			payload: {
				x: intent.dx,
				y: intent.dy,
				z: intent.dz ?? 0
			}
		};
		case "pointer.click": return {
			what: "mouse:click",
			payload: {
				button: intent.button || "left",
				double: Boolean(intent.double || intent.count === 2)
			}
		};
		case "pointer.scroll": return {
			what: "mouse:scroll",
			payload: {
				dx: intent.dx || 0,
				dy: intent.dy || 0
			}
		};
		case "pointer.down": return {
			what: "mouse:down",
			payload: { button: intent.button || "left" }
		};
		case "pointer.up": return {
			what: "mouse:up",
			payload: { button: intent.button || "left" }
		};
		case "voice.submit": return {
			what: "voice:submit",
			payload: { text: intent.text }
		};
		case "keyboard.char": switch (intent.char) {
			case "\b":
			case "": return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case "\n":
			case "\r": return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case "	": return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default:
				if (intent.char === " ") return {
					what: "keyboard:tap",
					payload: { key: "space" }
				};
				return {
					what: "keyboard:type",
					payload: { text: intent.char }
				};
		}
		case "keyboard.binary": switch (intent.flags ?? 0) {
			case 1: return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case 2: return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case 3: return {
				what: "keyboard:tap",
				payload: { key: "space" }
			};
			case 4: return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default: return {
				what: "keyboard:type",
				payload: { text: String.fromCodePoint(intent.codePoint) }
			};
		}
		case "gesture.swipe": return null;
	}
};
var toSpecAirpadAction = (action) => {
	if (action.what.startsWith("mouse:")) return {
		what: "airpad:mouse",
		payload: {
			op: action.what,
			params: [action.what],
			data: action.payload
		}
	};
	if (action.what.startsWith("keyboard:")) return {
		what: "airpad:keyboard",
		payload: {
			op: action.what,
			params: [action.what],
			data: action.payload
		}
	};
	return action;
};
var sendKeyboardTapCompat = async (key, modifier) => {
	const payload = {
		op: "keyboard:tap",
		params: ["keyboard:tap"],
		data: {
			key,
			modifier: modifier || []
		}
	};
	try {
		await sendCoordinatorRequest("airpad:keyboard", payload);
	} catch {
		await sendCoordinatorRequest("keyboard:tap", {
			key,
			modifier: modifier || []
		});
	}
};
var requestClipboardReadCompat = async () => {
	try {
		const text = await sendCoordinatorRequest("airpad:clipboard:read", {
			op: "airpad:clipboard:read",
			params: ["airpad:clipboard:read"]
		});
		return typeof text === "string" ? text : String(text || "");
	} catch {
		const text = await sendCoordinatorRequest("clipboard:get", {});
		return typeof text === "string" ? text : String(text || "");
	}
};
var requestClipboardWriteCompat = async (text) => {
	try {
		await sendCoordinatorRequest("airpad:clipboard:write", {
			op: "airpad:clipboard:write",
			params: ["airpad:clipboard:write"],
			data: { text }
		});
	} catch {
		await sendCoordinatorRequest("clipboard:update", { text });
	}
};
var initPacketWsRail = (button) => {
	initWebSocket(button);
};
var connectPacketWsRail = () => {
	connectWS();
};
var disconnectPacketWsRail = () => {
	disconnectWS();
};
var isPacketWsRailConnected = () => {
	return isWSConnected();
};
var onPacketWsRailConnectionChange = (handler) => {
	return onWSConnectionChange(handler);
};
var onPacketWsClipboardUpdate = (handler) => {
	return onServerClipboardUpdate(handler);
};
var sendPacketWsIntent = (intent) => {
	if (intent.type === "gesture.swipe") return;
	const action = toCoordinatorAction(intent);
	if (!action) return;
	const specAction = toSpecAirpadAction(action);
	sendCoordinatorAct(specAction.what, specAction.payload);
};
var sendPacketWsBinary = (buffer) => {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	if (bytes.byteLength < 6) return;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (view.getUint8(4) !== 6) return;
	sendPacketWsIntent({
		type: "keyboard.binary",
		codePoint: view.getUint32(0, true),
		flags: view.getUint8(5)
	});
};
var createPacketWsKeyboardMessage = (codePoint, flags = 0) => {
	const buffer = /* @__PURE__ */ new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setUint32(0, codePoint, true);
	view.setUint8(4, 6);
	view.setUint8(5, flags);
	view.setUint16(6, 0, true);
	return buffer;
};
var requestPacketWsClipboardRead = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		return {
			ok: true,
			text: await requestClipboardReadCompat()
		};
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCopy = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardTapCompat("c", ["control"]);
		await sleep$1(60);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCut = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardTapCompat("x", ["control"]);
		await sleep$1(60);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardPaste = async (text) => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await requestClipboardWriteCompat(text);
		await sleep$1(20);
		await sendKeyboardTapCompat("v", ["control"]);
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
//#endregion
//#region src/frontend/views/airpad/network/coordinator.ts
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var snapshotState = () => {
	const connected = isPacketWsRailConnected();
	return {
		connected,
		state: connected ? "connected" : "disconnected",
		host: getRemoteHost(),
		protocol: getRemoteProtocol(),
		detail: connected ? null : "disconnected",
		timestampMs: Date.now()
	};
};
/**
* AirPad-specific coordinator abstraction that aligns with the CRX network
* coordinator contract while preserving existing rail-level features.
*/
var airPadNetworkCoordinator = {
	init(button) {
		initPacketWsRail(button);
	},
	connect() {
		connectPacketWsRail();
	},
	disconnect() {
		disconnectPacketWsRail();
	},
	reconnectAfterConfigChange(options) {
		disconnectPacketWsRail();
		invalidateAirpadTransportCredentials();
		sleep(options?.delayMs ?? 80).then(() => {
			connectPacketWsRail();
		}).catch(() => {
			console.warn("[AirPad] reconnect after config failed");
		});
	},
	isConnected() {
		return isWSConnected();
	},
	getRemoteHost() {
		return getRemoteHost();
	},
	getState() {
		return snapshotState();
	},
	onConnectionChange(handler) {
		return onPacketWsRailConnectionChange(handler);
	},
	onServerClipboardUpdate(handler) {
		return onPacketWsClipboardUpdate(handler);
	},
	onStateChange(handler) {
		handler(snapshotState().state, snapshotState().detail);
		const off = onPacketWsRailConnectionChange((connected) => {
			handler(connected ? "connected" : "disconnected", connected ? null : "disconnected");
		});
		return () => {
			off();
		};
	},
	onVoiceMessage(handler) {
		return onVoiceResult((message) => {
			handler(message);
		});
	},
	sendCoordinatorAct(what, payload, nodes) {
		return sendCoordinatorAct(what, payload, nodes);
	},
	sendCoordinatorAsk(what, payload, nodes) {
		return sendCoordinatorAsk(what, payload, nodes);
	},
	sendCoordinatorRequest(what, payload, nodes) {
		return sendCoordinatorRequest(what, payload, nodes);
	},
	sendAirPadIntent(intent) {
		sendPacketWsIntent(intent);
	},
	sendAirPadKeyboardChar(char) {
		sendPacketWsIntent({
			type: "keyboard.char",
			char
		});
	},
	createAirPadKeyboardMessage(codePoint, flags = 0) {
		return createPacketWsKeyboardMessage(codePoint, flags);
	},
	sendAirPadBinaryMessage(buffer) {
		sendPacketWsBinary(buffer);
	},
	requestClipboardRead() {
		return requestPacketWsClipboardRead();
	},
	requestClipboardCopy() {
		return requestPacketWsClipboardCopy();
	},
	requestClipboardCut() {
		return requestPacketWsClipboardCut();
	},
	requestClipboardPaste(text) {
		return requestPacketWsClipboardPaste(text);
	},
	requestClipboardHistory(target) {
		return sendCoordinatorRequest("clipboard:get", {
			request: "history",
			target
		}, [target]);
	},
	sendClipboardUpdate(text, target) {
		return sendCoordinatorRequest("clipboard:update", target ? {
			text,
			target
		} : { text }, target ? [target] : void 0);
	}
};
//#endregion
//#region src/frontend/views/airpad/network/session.ts
var initAirPadSessionTransport = (button) => {
	airPadNetworkCoordinator.init(button);
};
var connectAirPadSession = () => {
	airPadNetworkCoordinator.connect();
};
var disconnectAirPadSession = () => {
	airPadNetworkCoordinator.disconnect();
};
/**
* After changing host/secrets/mode: drop WebSocket, clear AES/HMAC caches, then connect again.
* Mirrors legacy "Save & Reconnect" behavior.
*/
function reconnectAirPadSessionAfterConfigChange(options) {
	airPadNetworkCoordinator.reconnectAfterConfigChange(options);
}
var isAirPadSessionConnected = () => {
	return airPadNetworkCoordinator.isConnected();
};
var onAirPadSessionConnectionChange = (handler) => {
	return airPadNetworkCoordinator.onConnectionChange(handler);
};
var onAirPadRemoteClipboardUpdate = (handler) => {
	return airPadNetworkCoordinator.onServerClipboardUpdate(handler);
};
var onAirPadVoiceMessage = (handler) => {
	return airPadNetworkCoordinator.onVoiceMessage(handler);
};
var sendAirPadIntent = (intent) => {
	airPadNetworkCoordinator.sendAirPadIntent(intent);
};
var sendAirPadKeyboardChar = (char) => {
	airPadNetworkCoordinator.sendAirPadKeyboardChar(char);
};
var requestAirPadClipboardRead = async () => {
	return airPadNetworkCoordinator.requestClipboardRead();
};
var requestAirPadClipboardCopy = async () => {
	return airPadNetworkCoordinator.requestClipboardCopy();
};
var requestAirPadClipboardCut = async () => {
	return airPadNetworkCoordinator.requestClipboardCut();
};
var requestAirPadClipboardPaste = async (text) => {
	return airPadNetworkCoordinator.requestClipboardPaste(text);
};
//#endregion
//#region src/frontend/views/airpad/input/keyboard/message.ts
function sendKeyboardChar(char) {
	if (!isAirPadSessionConnected()) return;
	sendAirPadKeyboardChar(char);
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/ui.ts
function createKeyboardHTML() {
	return `
        <div class="virtual-keyboard-container" data-hidden="true" aria-hidden="true">
            <div class="keyboard-header">
                <button type="button" name="airpad-keyboard-close" class="keyboard-close" aria-label="Close keyboard">✕</button>
                <div class="keyboard-tabs">
                    <button type="button" name="airpad-keyboard-tab-letters" class="keyboard-tab active" data-tab="letters">ABC</button>
                    <button type="button" name="airpad-keyboard-tab-emoji" class="keyboard-tab" data-tab="emoji">😀</button>
                </div>
            </div>
            <div class="keyboard-content">
                <div class="keyboard-panel active" data-panel="letters">
                    <div class="keyboard-shift-container">
                        <button type="button" name="airpad-keyboard-shift" class="keyboard-shift" data-shift="lower">⇧</button>
                    </div>
                    <div class="keyboard-rows" id="keyboardRows"></div>
                    <div class="keyboard-special">
                        <button class="keyboard-key special space" data-key=" ">Space</button>
                        <button class="keyboard-key special backspace" data-key="backspace">⌫</button>
                        <button class="keyboard-key special enter" data-key="enter">↵</button>
                    </div>
                </div>
                <div class="keyboard-panel" data-panel="emoji">
                    <div class="emoji-categories">
                        ${Object.keys(EMOJI_CATEGORIES).map((cat) => `<button class="emoji-category-btn" data-category="${cat}">${cat}</button>`).join("")}
                    </div>
                    <div class="emoji-grid" id="emojiGrid"></div>
                </div>
            </div>
        </div>
    `;
}
function renderKeyboard(isUpper = false) {
	const rowsEl = getKeyboardElement()?.querySelector("#keyboardRows");
	if (!rowsEl) return;
	rowsEl.innerHTML = "";
	(isUpper ? KEYBOARD_LAYOUT_UPPER : KEYBOARD_LAYOUT).forEach((row) => {
		const rowEl = document.createElement("div");
		rowEl.className = "keyboard-row";
		row.forEach((key) => {
			const keyEl = document.createElement("button");
			keyEl.className = "keyboard-key";
			keyEl.textContent = key;
			keyEl.setAttribute("data-key", key);
			keyEl.addEventListener("click", () => handleKeyPress(key));
			rowEl.appendChild(keyEl);
		});
		rowsEl.appendChild(rowEl);
	});
}
function renderEmoji(category) {
	const gridEl = getKeyboardElement()?.querySelector("#emojiGrid");
	if (!gridEl) return;
	const emojis = EMOJI_CATEGORIES[category] || [];
	gridEl.innerHTML = "";
	emojis.forEach((emoji) => {
		const emojiEl = document.createElement("button");
		emojiEl.className = "emoji-key";
		emojiEl.textContent = emoji;
		emojiEl.setAttribute("data-emoji", emoji);
		emojiEl.addEventListener("click", () => handleKeyPress(emoji));
		gridEl.appendChild(emojiEl);
	});
}
function handleKeyPress(key) {
	if (key === "backspace") sendKeyboardChar("\b");
	else if (key === "enter") sendKeyboardChar("\n");
	else sendKeyboardChar(key);
}
function restoreButtonIcon() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	toggleButton.textContent = "⌨️";
	if (!toggleButton.isConnected) return;
	const ownerDoc = toggleButton.ownerDocument;
	if (!ownerDoc) return;
	if (ownerDoc.activeElement !== toggleButton) return;
	const textNode = toggleButton.firstChild;
	const sel = globalThis?.getSelection?.();
	if (!(textNode instanceof Text) || !sel) return;
	try {
		const range = ownerDoc.createRange();
		range.setStart(textNode, Math.min(1, toggleButton.textContent?.length ?? 0));
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	} catch {}
}
//#endregion
//#region src/shared/policies/event-handling-policy.ts
/**
* Shared rules for UI event handlers:
* - Do not use stopImmediatePropagation unless one listener must exclude every other on the same target.
* - Prefer stopPropagation only to block bubble to known parents (stacked overlays, toolbars).
* - Avoid document/window capture listeners that call stop* unless strictly scoped to a feature.
* - Use passive: true when preventDefault is never called.
*/
function stopBubbling(ev) {
	ev.stopPropagation();
}
/**
* Wait until after the next two animation frames so layout/style for freshly inserted nodes
* is flushed before querying the DOM and attaching listeners (Airpad, overlays, keyboard).
*/
function waitForDomPaint() {
	const raf = globalThis.requestAnimationFrame?.bind(globalThis);
	if (typeof raf !== "function") return Promise.resolve();
	return new Promise((resolve) => {
		raf(() => {
			raf(() => resolve());
		});
	});
}
//#endregion
//#region src/shared/document/DocTools.ts
var coordinate = [0, 0];
var lastElement = [null];
/** Resolve event target to an HTMLElement (e.g. parent of a Text node). */
function eventTargetElement(ev) {
	const t = ev.target;
	if (t instanceof HTMLElement) return t;
	if (t instanceof Node && t.nodeType === Node.TEXT_NODE && t.parentElement) return t.parentElement;
	const path = ev.composedPath?.() ?? [];
	for (const n of path) if (n instanceof HTMLElement) return n;
	return null;
}
/** Update last pointer coordinates when the event carries client geometry (Mouse/Pointer). */
var saveCoordinate = (e) => {
	if (e instanceof PointerEvent || e instanceof MouseEvent) {
		const x = e.clientX;
		const y = e.clientY;
		if (Number.isFinite(x) && Number.isFinite(y)) {
			coordinate[0] = x;
			coordinate[1] = y;
		}
	}
};
if (typeof document !== "undefined") try {
	document.addEventListener("pointerup", saveCoordinate, { passive: true });
	document.addEventListener("pointerdown", saveCoordinate, { passive: true });
	document.addEventListener("click", saveCoordinate, { passive: true });
	document.addEventListener("contextmenu", (e) => {
		saveCoordinate(e);
		lastElement[0] = eventTargetElement(e) ?? lastElement[0];
	}, { passive: true });
} catch {}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/handlers.ts
/** AbortController for document-level dismiss listeners (scoped to airpad owner document). */
var keyboardDismissAbort = null;
/** Remove focus/pointer dismiss listeners (call on Airpad unmount). */
function teardownKeyboardDismissListeners() {
	try {
		keyboardDismissAbort?.abort();
	} catch {}
	keyboardDismissAbort = null;
}
var keyboardToggleClickBound = /* @__PURE__ */ new WeakSet();
var keyboardToggleApiBound = /* @__PURE__ */ new WeakSet();
var keyboardContainerUiBound = /* @__PURE__ */ new WeakSet();
/** Outside taps must not close the keyboard when interacting with these regions. */
var KEYBOARD_STAYS_OPEN_MATCHES = "input,textarea,select,[contenteditable=\"true\"]";
var KEYBOARD_STAYS_OPEN_CLOSEST = ".config-overlay, .virtual-keyboard-container, .keyboard-toggle, .view-cwsp, .view-cwsp button, .view-cwsp .big-button, .view-cwsp .neighbor-button, .log-overlay.open, .log-panel, .airpad-config-overlay";
function isKeyboardStayOpenTarget(el) {
	if (!el) return false;
	return Boolean(el.matches?.(KEYBOARD_STAYS_OPEN_MATCHES) || el.closest?.(KEYBOARD_STAYS_OPEN_CLOSEST));
}
function isConfigOverlayVisible() {
	const doc = getAirpadOwnerDocument();
	const overlay = doc?.querySelector(".airpad-config-overlay") ?? doc?.querySelector(".config-overlay");
	if (!overlay) return false;
	return overlay.style.display === "flex" || overlay.classList.contains("flex");
}
function setVkStatus(text) {
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = text;
}
function showKeyboard() {
	if (!isRemoteKeyboardEnabled()) return;
	if (isConfigOverlayVisible()) return;
	const keyboardElement = getKeyboardElement();
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (virtualKeyboardAPI) {
		if (toggleButton) {
			toggleButton.contentEditable = "true";
			toggleButton.setAttribute("virtualkeyboardpolicy", "manual");
		}
		restoreButtonIcon();
		toggleButton?.focus({ preventScroll: true });
		virtualKeyboardAPI.show();
		setVkStatus("overlay:on / policy:manual");
	} else {
		setKeyboardVisible(true);
		keyboardElement?.classList?.add?.("visible");
		setVkStatus("overlay:off");
	}
	renderKeyboard(false);
	renderEmoji("smileys");
}
var isHidingKeyboard = false;
function hideKeyboard() {
	if (isHidingKeyboard) return;
	isHidingKeyboard = true;
	try {
		const keyboardElement = getKeyboardElement();
		const virtualKeyboardAPI = getVirtualKeyboardAPI();
		const toggleButton = getToggleButton();
		setKeyboardVisible(false);
		keyboardElement?.classList?.remove?.("visible");
		if (virtualKeyboardAPI) {
			restoreButtonIcon();
			virtualKeyboardAPI.hide();
			if (toggleButton) {
				toggleButton.contentEditable = "false";
				toggleButton.removeAttribute("virtualkeyboardpolicy");
			}
			toggleButton?.blur();
			setVkStatus("overlay:on / policy:auto");
		}
	} finally {
		isHidingKeyboard = false;
	}
}
function toggleKeyboard() {
	if (isKeyboardVisible()) hideKeyboard();
	else showKeyboard();
}
function setupToggleButtonHandler() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	if (keyboardToggleClickBound.has(toggleButton)) return;
	keyboardToggleClickBound.add(toggleButton);
	toggleButton.addEventListener("click", (e) => {
		stopBubbling(e);
		if (!isRemoteKeyboardEnabled()) {
			log("Keyboard is available after WS connection");
			return;
		}
		if (isConfigOverlayVisible()) return;
		toggleKeyboard();
	});
}
function setupVirtualKeyboardAPIHandlers() {
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (!virtualKeyboardAPI || !toggleButton) return;
	if (keyboardToggleApiBound.has(toggleButton)) return;
	keyboardToggleApiBound.add(toggleButton);
	const ICON = "⌨️";
	let pendingRestore = null;
	let lastHandledKey = null;
	let lastHandledTime = 0;
	const DEDUP_WINDOW_MS = 20;
	let waitingForInput = false;
	let lastKnownContent = ICON;
	let beforeInputFired = false;
	let isComposing = false;
	let lastCompositionText = "";
	let compositionTimeout = null;
	const COMPOSITION_TIMEOUT_MS = 600;
	const resetCompositionState = (immediate = false) => {
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		if (immediate) {
			isComposing = false;
			lastCompositionText = "";
		} else compositionTimeout = globalThis.setTimeout(() => {
			isComposing = false;
			lastCompositionText = "";
			compositionTimeout = null;
		}, COMPOSITION_TIMEOUT_MS);
	};
	const shouldSkipDuplicate = (key) => {
		const normalizedKey = key.includes(":") ? key.split(":").slice(1).join(":") : key;
		const now = Date.now();
		if (lastHandledKey === normalizedKey && now - lastHandledTime < DEDUP_WINDOW_MS) return true;
		lastHandledKey = normalizedKey;
		lastHandledTime = now;
		return false;
	};
	const scheduleRestore = () => {
		queueMicrotask(() => {
			pendingRestore = null;
			restoreButtonIcon();
			lastKnownContent = ICON;
		});
	};
	const sendAndRestore = (char) => {
		if (!isRemoteKeyboardEnabled()) return;
		sendKeyboardChar(char);
		scheduleRestore();
	};
	const TEXT_STREAM_CHUNK_SIZE = 256;
	const TEXT_STREAM_SOFT_LIMIT = 12e3;
	const TEXT_STREAM_HARD_LIMIT = 12e4;
	let streamToken = 0;
	const toUnicodeUnits = (text) => Array.from(String(text || ""));
	const sendTextChunked = (text, dedupeKey) => {
		const raw = String(text || "");
		if (!raw) {
			scheduleRestore();
			return;
		}
		if (dedupeKey && shouldSkipDuplicate(dedupeKey)) {
			scheduleRestore();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Input truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large input (${safeUnits.length} chars) in chunks.`);
		const token = ++streamToken;
		let index = 0;
		const pump = () => {
			if (token !== streamToken) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			scheduleRestore();
		};
		pump();
	};
	/** IME/composition: cancel in-flight chunked sends when a new update arrives (latest wins). */
	let compositionPumpGen = 0;
	const sendCompositionTextChunked = (text, onDone) => {
		const raw = String(text || "");
		if (!raw) {
			onDone?.();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition text truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large composition input (${safeUnits.length} chars) in chunks.`);
		const gen = compositionPumpGen;
		let index = 0;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionBackspacesChunked = (count, onDone) => {
		if (count <= 0) {
			onDone?.();
			return;
		}
		const gen = compositionPumpGen;
		let remaining = count;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const n = Math.min(remaining, TEXT_STREAM_CHUNK_SIZE);
			for (let i = 0; i < n; i++) sendKeyboardChar("\b");
			remaining -= n;
			if (remaining > 0) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionReplaceChunked = (backspaceCount, newText, onDone) => {
		let t = String(newText || "");
		if (t.length > TEXT_STREAM_HARD_LIMIT) {
			t = t.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition replacement truncated to ${TEXT_STREAM_HARD_LIMIT} chars.`);
		}
		sendCompositionBackspacesChunked(backspaceCount, () => {
			if (!t) {
				onDone();
				return;
			}
			sendCompositionTextChunked(t, onDone);
		});
	};
	/** Small IME deltas stay synchronous to preserve ordering with lastCompositionText. */
	const COMPOSITION_INLINE_MAX = 256;
	const getCleanText = (text) => {
		return text.replace(/⌨️/g, "").replace(/⌨\uFE0F?/g, "").replace(/\uFE0F/g, "");
	};
	const findNewCharacters = (currentText, previousText) => {
		const cleanCurrent = getCleanText(currentText);
		const cleanPrevious = getCleanText(previousText);
		if (cleanCurrent.startsWith(cleanPrevious)) return cleanCurrent.slice(cleanPrevious.length);
		if (cleanPrevious.startsWith(cleanCurrent)) return "";
		return cleanCurrent;
	};
	toggleButton.addEventListener("keydown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (e.isComposing) {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (isComposing && !e.isComposing) resetCompositionState(true);
		beforeInputFired = false;
		if ((e.ctrlKey || e.metaKey) && !e.altKey) {
			const lowerKey = String(e.key || "").toLowerCase();
			if (lowerKey === "c" || lowerKey === "x") {
				e.preventDefault();
				waitingForInput = false;
				resetCompositionState(true);
				return;
			}
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("backspace")) sendAndRestore("\b");
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			if (!shouldSkipDuplicate("enter")) sendAndRestore("\n");
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("tab")) sendAndRestore("	");
			return;
		}
		if (e.key === "Unidentified" || e.key === "Process" || e.key === "") {
			waitingForInput = true;
			lastKnownContent = toggleButton.textContent || ICON;
			return;
		}
		if (e.key === " ") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			return;
		}
		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			waitingForInput = false;
			return;
		}
		waitingForInput = false;
	});
	toggleButton.addEventListener("beforeinput", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		lastKnownContent = toggleButton.textContent || ICON;
		beforeInputFired = true;
		if (inputEvent.inputType === "insertCompositionText") {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (inputEvent.inputType === "insertText" && isComposing) resetCompositionState(true);
		if (waitingForInput && inputEvent.inputType === "insertText" && inputEvent.data) {
			e.preventDefault();
			waitingForInput = false;
			sendTextChunked(inputEvent.data, `text:${inputEvent.data}`);
			return;
		}
		if (inputEvent.inputType === "insertText") {
			e.preventDefault();
			const data = inputEvent.data;
			if (data) sendTextChunked(data, `text:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertReplacementText") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text");
			if (data) sendTextChunked(data, `replace:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertLineBreak" || inputEvent.inputType === "insertParagraph") {
			e.preventDefault();
			resetCompositionState(true);
			if (!shouldSkipDuplicate("linebreak")) sendAndRestore("\n");
			return;
		}
		if (inputEvent.inputType === "deleteContentBackward" || inputEvent.inputType === "deleteContentForward") {
			e.preventDefault();
			if (!shouldSkipDuplicate("deleteback")) sendAndRestore("\b");
			return;
		}
		if (inputEvent.inputType === "insertFromPaste") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text/plain");
			if (data) sendTextChunked(data);
			return;
		}
	});
	toggleButton.addEventListener("compositionstart", () => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = true;
		lastCompositionText = "";
		waitingForInput = false;
		compositionPumpGen++;
	});
	toggleButton.addEventListener("compositionupdate", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const currentText = e.data || "";
		const finishUpdate = () => {
			lastCompositionText = currentText;
			scheduleRestore();
		};
		if (currentText.startsWith(lastCompositionText)) {
			const newChars = currentText.slice(lastCompositionText.length);
			if (newChars.length > 0) if (newChars.length <= COMPOSITION_INLINE_MAX) {
				for (const char of newChars) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionTextChunked(newChars, finishUpdate);
			else finishUpdate();
		} else if (lastCompositionText.startsWith(currentText)) {
			const deletedCount = toUnicodeUnits(lastCompositionText).length - toUnicodeUnits(currentText).length;
			if (deletedCount <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < deletedCount; i++) sendKeyboardChar("\b");
				finishUpdate();
			} else sendCompositionBackspacesChunked(deletedCount, finishUpdate);
		} else {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const nextLength = toUnicodeUnits(currentText).length;
			if (bs <= COMPOSITION_INLINE_MAX && nextLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of currentText) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionReplaceChunked(bs, currentText, finishUpdate);
		}
	});
	toggleButton.addEventListener("compositionend", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const finalText = e.data || "";
		const finishEnd = () => {
			isComposing = false;
			lastCompositionText = "";
			scheduleRestore();
		};
		if (finalText !== lastCompositionText) {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const finalLength = toUnicodeUnits(finalText).length;
			if (bs <= COMPOSITION_INLINE_MAX && finalLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of finalText) sendKeyboardChar(char);
				finishEnd();
			} else sendCompositionReplaceChunked(bs, finalText, finishEnd);
		} else finishEnd();
	});
	toggleButton.addEventListener("input", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		if (inputEvent.inputType === "insertCompositionText" || inputEvent.inputType?.includes("Composition")) return;
		if (isComposing) return;
		const currentText = e.target.textContent || "";
		if (waitingForInput) {
			waitingForInput = false;
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`unidentified:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		if (!beforeInputFired) {
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`input:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		scheduleRestore();
		beforeInputFired = false;
	});
	toggleButton.addEventListener("paste", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const pastedText = e.clipboardData?.getData("text") || "";
		if (pastedText) sendTextChunked(pastedText);
	});
	toggleButton.addEventListener("drop", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const droppedText = e.dataTransfer?.getData("text") || "";
		if (droppedText) {
			sendTextChunked(droppedText);
			return;
		}
		scheduleRestore();
	});
	toggleButton.addEventListener("blur", () => {
		if (pendingRestore !== null) {
			clearTimeout(pendingRestore);
			pendingRestore = null;
		}
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = false;
		lastCompositionText = "";
		waitingForInput = false;
		lastHandledKey = null;
		beforeInputFired = false;
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
	toggleButton.addEventListener("focus", () => {
		lastHandledKey = null;
		lastHandledTime = 0;
		waitingForInput = false;
		beforeInputFired = false;
		isComposing = false;
		lastCompositionText = "";
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
}
function setupKeyboardUIHandlers() {
	const keyboardElement = getKeyboardElement();
	if (!keyboardElement) return;
	if (!keyboardContainerUiBound.has(keyboardElement)) {
		keyboardContainerUiBound.add(keyboardElement);
		keyboardElement.querySelector(".keyboard-close")?.addEventListener("click", hideKeyboard);
		const tabs = keyboardElement.querySelectorAll(".keyboard-tab");
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const targetTab = tab.getAttribute("data-tab");
				tabs.forEach((t) => t.classList.remove("active"));
				tab.classList.add("active");
				(keyboardElement?.querySelectorAll(".keyboard-panel"))?.forEach((panel) => {
					panel.classList.remove("active");
					if (panel.getAttribute("data-panel") === targetTab) panel.classList.add("active");
				});
			});
		});
		const shiftBtn = keyboardElement.querySelector(".keyboard-shift");
		let isUpper = false;
		shiftBtn?.addEventListener("click", () => {
			isUpper = !isUpper;
			renderKeyboard(isUpper);
			shiftBtn.classList.toggle("active", isUpper);
		});
		const categoryBtns = keyboardElement.querySelectorAll(".emoji-category-btn");
		if (categoryBtns.length > 0) {
			const firstBtn = categoryBtns[0];
			firstBtn.classList.add("active");
			const firstCategory = firstBtn.getAttribute("data-category");
			if (firstCategory) renderEmoji(firstCategory);
			categoryBtns.forEach((btn) => {
				btn.addEventListener("click", () => {
					const category = btn.getAttribute("data-category");
					if (category) {
						categoryBtns.forEach((b) => b.classList.remove("active"));
						btn.classList.add("active");
						renderEmoji(category);
					}
				});
			});
		}
		keyboardElement.addEventListener("click", (e) => {
			if (e.target === keyboardElement) hideKeyboard();
		});
	}
	const doc = getAirpadOwnerDocument();
	if (!doc) return;
	teardownKeyboardDismissListeners();
	keyboardDismissAbort = new AbortController();
	const { signal } = keyboardDismissAbort;
	doc.addEventListener("focusout", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		const fromEl = eventTargetElement(e);
		const rel = e.relatedTarget;
		const toEl = rel instanceof HTMLElement ? rel : null;
		if (!(isKeyboardStayOpenTarget(fromEl) || isKeyboardStayOpenTarget(toEl))) hideKeyboard();
	}, { signal });
	doc.addEventListener("pointerdown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		if (!isKeyboardStayOpenTarget(eventTargetElement(e))) hideKeyboard();
	}, {
		capture: false,
		passive: true,
		signal
	});
}
//#endregion
//#region src/frontend/views/airpad/input/virtual-keyboard.ts
function updateToggleButtonEnabledState(enabled) {
	const toggleButton = getToggleButton();
	if (!(toggleButton instanceof HTMLButtonElement)) return;
	toggleButton.disabled = false;
	toggleButton.setAttribute("aria-disabled", String(!enabled));
	toggleButton.classList.toggle("is-disabled", !enabled);
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = `${(vkStatusEl.textContent || "overlay:off").replace(/\s*\/\s*remote:(on|off)\s*$/i, "")} / remote:${enabled ? "on" : "off"}`;
}
function setRemoteKeyboardEnabled(enabled) {
	setRemoteKeyboardEnabled$1(enabled);
	updateToggleButtonEnabledState(enabled);
	if (!enabled) hideKeyboard();
}
/**
* @param mountRoot — node under which Airpad markup was mounted (e.g. `[data-cwsp-content]`).
*   Resolves `.view-cwsp` for portal placement; prefers mount root / `getAirpadDomRoot()` over global document queries.
*/
function initVirtualKeyboard(mountRoot) {
	initVirtualKeyboardAPI();
	const hasAPI = hasVirtualKeyboardAPI();
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = hasAPI ? "overlay:on / policy:auto" : "overlay:off";
	const scoped = getAirpadDomRoot();
	const container = mountRoot?.closest?.(".view-cwsp") ?? mountRoot ?? scoped?.closest?.(".view-cwsp") ?? scoped ?? document.body;
	let keyboardElement = container.querySelector(".virtual-keyboard-container");
	if (!keyboardElement) {
		const keyboardHTML = createKeyboardHTML();
		container.insertAdjacentHTML("beforeend", keyboardHTML);
		keyboardElement = container.querySelector(".virtual-keyboard-container");
	}
	if (!keyboardElement) {
		log("Failed to create keyboard element");
		return;
	}
	keyboardElement.classList.remove("visible");
	setKeyboardElement(keyboardElement);
	const toggleContainer = container.querySelector(".bottom-toolbar") ?? container;
	let toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	if (!toggleButton) {
		const toggleHTML = hasAPI ? "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" contenteditable=\"false\" virtualkeyboardpolicy=\"manual\" class=\"keyboard-toggle keyboard-toggle-editable\" aria-label=\"Toggle keyboard\">⌨️</button>" : "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" class=\"keyboard-toggle\" aria-label=\"Toggle keyboard\">⌨️</button>";
		toggleContainer.insertAdjacentHTML("beforeend", toggleHTML);
		toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	}
	if (!toggleButton) {
		log("Failed to create toggle button");
		return;
	}
	toggleButton.autofocus = false;
	toggleButton.removeAttribute("autofocus");
	if (toggleButton instanceof HTMLElement) {
		toggleButton.setAttribute("autocapitalize", "off");
		toggleButton.setAttribute("autocorrect", "off");
		toggleButton.setAttribute("spellcheck", "false");
	}
	setToggleButton(toggleButton);
	setRemoteKeyboardEnabled(false);
	setupToggleButtonHandler();
	setupVirtualKeyboardAPIHandlers();
	setupKeyboardUIHandlers();
	log("Virtual keyboard initialized");
}
//#endregion
//#region src/frontend/views/airpad/main.scss?inline
var main_default = "@layer view.airpad{.airpad-config-overlay :is(*,:before,:after),.view-cwsp :is(*,:before,:after){box-sizing:border-box;font-variant-emoji:text}.view-cwsp{user-select:none;-webkit-user-select:none}.airpad-config-overlay,.view-cwsp{-webkit-tap-highlight-color:transparent;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;line-height:1.5;touch-action:manipulation}.view-cwsp{--view-layout:\"flex\";--view-content-max-width:none}.airpad-config-overlay,.view-cwsp{--primary:#0061a4;--primary-container:#d1e4ff;--on-primary:#ffffff;--on-primary-container:#001d36;--secondary:#565f71;--secondary-container:#dae2f9;--on-secondary:#ffffff;--on-secondary-container:#131c2b;--tertiary:#705575;--tertiary-container:#fbd7fc;--on-tertiary:#ffffff;--on-tertiary-container:#28132e;--error:#ba1a1a;--error-container:#ffdad6;--on-error:#ffffff;--on-error-container:#410002;--surface:#0f1419;--surface-variant:#1e2124;--surface-container:#1a1d20;--surface-container-low:#16191c;--surface-container-high:#1f2225;--surface-container-highest:#2a2d30;--on-surface:#e0e2e8;--on-surface-variant:#bfc8cc;--outline:#40484c;--outline-variant:#2a3236;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.30),0 1px 3px 1px rgba(0,0,0,0.15);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.30),0 2px 6px 2px rgba(0,0,0,0.15);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.30),0 4px 8px 3px rgba(0,0,0,0.15);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.30),0 6px 10px 4px rgba(0,0,0,0.15);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.30),0 8px 12px 6px rgba(0,0,0,0.15);--state-hover:rgba(255,255,255,0.08);--state-focus:rgba(255,255,255,0.12);--state-pressed:rgba(255,255,255,0.10);--state-selected:rgba(255,255,255,0.16);--state-dragged:rgba(255,255,255,0.16);--space-0:0;--space-1:0.25rem;--space-2:0.5rem;--space-3:0.75rem;--space-4:1rem;--space-5:1.25rem;--space-6:1.5rem;--space-8:2rem;--space-10:2.5rem;--space-12:3rem;--space-16:4rem;--space-20:5rem;--space-24:6rem;--radius-none:0;--radius-xs:0.25rem;--radius-sm:0.5rem;--radius-md:0.75rem;--radius-lg:1rem;--radius-xl:1.5rem;--radius-2xl:2rem;--radius-3xl:3rem;--radius-full:9999px;--text-xs:0.75rem;--text-sm:0.875rem;--text-base:1rem;--text-lg:1.125rem;--text-xl:1.25rem;--text-2xl:1.5rem;--text-3xl:1.875rem;--text-4xl:2.25rem;--text-5xl:3rem;--line-height-tight:1.25;--line-height-normal:1.5;--line-height-relaxed:1.75;--font-weight-thin:100;--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-black:900;--transition-fast:150ms cubic-bezier(0.4,0,0.2,1);--transition-normal:250ms cubic-bezier(0.4,0,0.2,1);--transition-slow:400ms cubic-bezier(0.4,0,0.2,1);--transition-slow-in:400ms cubic-bezier(0.05,0.7,0.1,1);--transition-slow-out:400ms cubic-bezier(0.3,0,0.8,0.15);--motion-easing-standard:cubic-bezier(0.2,0,0,1);--motion-easing-decelerate:cubic-bezier(0,0,0,1);--motion-easing-accelerate:cubic-bezier(0.3,0,1,1);--side-action-bg:#2f3940;--side-action-fg:#f2f6fa;--side-action-border:#6f8694;--side-action-shadow:0 2px 4px rgba(0,0,0,0.32),0 8px 14px rgba(0,0,0,0.24);--side-action-hover-bg:#3a4852;--side-action-active-bg:#26323a;--side-action-hint-bg:#2f536e;--side-action-hint-fg:#e6f2ff;--side-action-hint-border:#6ca3c9;--side-action-hint-hover-bg:#3b6482;--side-action-hint-active-bg:#25485f;--side-action-fix-bg:#6b4b1b;--side-action-fix-fg:#fff0cf;--side-action-fix-border:#f1b654;--side-action-fix-hover-bg:#7c5821;--side-action-fix-active-bg:#5b3e12}}@layer view.airpad{}@layer view.airpad{@media (prefers-color-scheme:light){:root:not([data-theme=dark]) .airpad-config-overlay,:root:not([data-theme=dark]) .view-cwsp{--surface:#fafafa;--surface-variant:#e7e5e5;--surface-container:#f3f1f1;--surface-container-low:#eceaea;--surface-container-high:#e6e4e4;--surface-container-highest:#e0dede;--on-surface:#1c1b1f;--on-surface-variant:#49454f;--outline:#79747e;--outline-variant:#cac4d0;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.06),0 1px 3px 1px rgba(0,0,0,0.08);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.06),0 2px 6px 2px rgba(0,0,0,0.08);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.06),0 4px 8px 3px rgba(0,0,0,0.08);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.06),0 6px 10px 4px rgba(0,0,0,0.08);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.06),0 8px 12px 6px rgba(0,0,0,0.08);--state-hover:rgba(0,0,0,0.08);--state-focus:rgba(0,0,0,0.12);--state-pressed:rgba(0,0,0,0.10);--state-selected:rgba(0,0,0,0.16);--state-dragged:rgba(0,0,0,0.16);--side-action-bg:color-mix(in srgb,#ffffff,var(--surface-container-highest) 14%);--side-action-fg:#21303a;--side-action-border:color-mix(in srgb,#8fa2af,transparent 24%);--side-action-shadow:0 1px 2px rgba(10,31,48,0.16),0 4px 10px rgba(10,31,48,0.14);--side-action-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 16%);--side-action-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 26%);--side-action-hint-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 38%);--side-action-hint-fg:#1f2c40;--side-action-hint-border:color-mix(in srgb,var(--secondary),transparent 56%);--side-action-hint-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 54%);--side-action-hint-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 68%);--side-action-fix-bg:#ffe5b5;--side-action-fix-fg:#5b3600;--side-action-fix-border:#c88b1a;--side-action-fix-hover-bg:#ffdd9e;--side-action-fix-active-bg:#ffd187;--side-action-reload-bg:#ff9999;--side-action-reload-fg:#ffffff;--side-action-reload-border:#ff9999;--side-action-reload-hover-bg:#ff9999;--side-action-reload-active-bg:#ffb3b3}}.airpad-config-overlay[data-theme=light],:root[data-theme=light] .airpad-config-overlay,:root[data-theme=light] .view-cwsp,[data-shell][data-theme=light] .airpad-config-overlay,[data-shell][data-theme=light] .view-cwsp{--surface:#fafafa;--surface-variant:#e7e5e5;--surface-container:#f3f1f1;--surface-container-low:#eceaea;--surface-container-high:#e6e4e4;--surface-container-highest:#e0dede;--on-surface:#1c1b1f;--on-surface-variant:#49454f;--outline:#79747e;--outline-variant:#cac4d0;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.06),0 1px 3px 1px rgba(0,0,0,0.08);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.06),0 2px 6px 2px rgba(0,0,0,0.08);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.06),0 4px 8px 3px rgba(0,0,0,0.08);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.06),0 6px 10px 4px rgba(0,0,0,0.08);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.06),0 8px 12px 6px rgba(0,0,0,0.08);--state-hover:rgba(0,0,0,0.08);--state-focus:rgba(0,0,0,0.12);--state-pressed:rgba(0,0,0,0.10);--state-selected:rgba(0,0,0,0.16);--state-dragged:rgba(0,0,0,0.16);--side-action-bg:color-mix(in srgb,#ffffff,var(--surface-container-highest) 14%);--side-action-fg:#21303a;--side-action-border:color-mix(in srgb,#8fa2af,transparent 24%);--side-action-shadow:0 1px 2px rgba(10,31,48,0.16),0 4px 10px rgba(10,31,48,0.14);--side-action-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 16%);--side-action-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 26%);--side-action-hint-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 38%);--side-action-hint-fg:#1f2c40;--side-action-hint-border:color-mix(in srgb,var(--secondary),transparent 56%);--side-action-hint-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 54%);--side-action-hint-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 68%);--side-action-fix-bg:#ffe5b5;--side-action-fix-fg:#5b3600;--side-action-fix-border:#c88b1a;--side-action-fix-hover-bg:#ffdd9e;--side-action-fix-active-bg:#ffd187;--side-action-reload-bg:#fa8080;--side-action-reload-fg:#641010;--side-action-reload-border:#ff9999;--side-action-reload-hover-bg:#ffb3b3;--side-action-reload-active-bg:#ff9999}.container{flex:1;flex-direction:column;gap:var(--space-4);inline-size:100%;justify-content:flex-start;margin:0 auto;padding:var(--space-4) var(--space-4) calc(var(--space-16) + var(--space-6));position:relative}.bottom-toolbar,.container{align-items:center;display:flex}.bottom-toolbar{gap:var(--space-3);inset-block-end:max(var(--space-4),env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));inset-inline-start:var(--space-4);position:fixed;z-index:4}.primary-btn{align-items:center;background:var(--primary);border:none;border-radius:var(--radius-lg);box-shadow:var(--elevation-1);color:var(--on-primary);cursor:pointer;display:inline-flex;font-family:inherit;font-size:var(--text-base);font-weight:var(--font-weight-medium);gap:var(--space-2);justify-content:center;line-height:var(--line-height-tight);min-inline-size:calc-size(min-content,min(12rem,size));overflow:hidden;padding:var(--space-3) var(--space-6);position:relative;text-decoration:none;touch-action:manipulation;transition:all var(--transition-fast);user-select:none;-webkit-user-select:none}.primary-btn:before{background:var(--state-hover);content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.primary-btn:hover{box-shadow:var(--elevation-2)}.primary-btn:hover:before{opacity:1}.primary-btn:active{box-shadow:var(--elevation-1);transform:scale(.98)}.primary-btn:active:before{background:var(--state-pressed);opacity:0}.primary-btn:focus-visible{box-shadow:var(--elevation-1),0 0 0 4px color-mix(in srgb,var(--primary),transparent 25%);outline:2px solid var(--primary);outline-offset:2px}.primary-btn:disabled{box-shadow:none;cursor:not-allowed;opacity:.38;pointer-events:none;transform:none}.primary-btn:disabled:before{display:none}.toolbar-btn{background:var(--surface-container-high);block-size:3.5rem;border:none;border-radius:var(--radius-2xl);box-shadow:var(--elevation-3);color:var(--on-surface-variant);font-size:var(--text-xl);inline-size:3.5rem;overflow:hidden;position:relative;transition:all var(--transition-fast)}.toolbar-btn:before{background:var(--state-hover);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.toolbar-btn:hover{box-shadow:var(--elevation-4);transform:translateY(-1px)}.toolbar-btn:hover:before{opacity:1}.toolbar-btn:active{box-shadow:var(--elevation-2);transform:scale(.92) translateY(0)}.toolbar-btn:active:before{background:var(--state-pressed);opacity:0}.toolbar-btn:focus-visible{box-shadow:var(--elevation-3),0 0 0 4px color-mix(in srgb,var(--primary),transparent 25%);outline:2px solid var(--primary);outline-offset:2px}.ws-status{align-items:center;border:1px solid transparent;border-radius:var(--radius-2xl);box-shadow:var(--elevation-1);display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-2);letter-spacing:.05em;overflow:hidden;padding:var(--space-1) var(--space-4);position:relative;text-transform:uppercase}.ws-status:before{background:linear-gradient(135deg,var(--outline-variant),transparent);border-radius:inherit;content:\"\";inset:0;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;opacity:.5;padding:1px;position:absolute}.ws-status.ws-status-ok{background:color-mix(in srgb,var(--primary),transparent 12%);border-color:color-mix(in srgb,var(--primary),transparent 30%);color:var(--primary)}.ws-status.ws-status-bad{background:color-mix(in srgb,var(--error),transparent 12%);border-color:color-mix(in srgb,var(--error),transparent 30%);color:var(--error)}.ws-status.ws-status-tls-hint{font-size:var(--text-xs);letter-spacing:0;line-height:1.3;max-inline-size:min(100%,320px);text-transform:none;white-space:normal}.clipboard-preview{background:var(--surface);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);box-shadow:var(--elevation-3);color:var(--on-surface);display:none;font-size:var(--text-sm);inline-size:calc(100% - var(--space-8));inset-block-end:calc(var(--space-16) + var(--space-4));inset-inline:var(--space-4);inset-inline-start:50%;margin:0 auto;max-block-size:4rem;max-inline-size:47.5rem;overflow:hidden;padding:var(--space-3) var(--space-4);position:fixed;transform:translateX(-50%);z-index:3}.clipboard-preview.visible{display:block}.clipboard-preview .meta{color:var(--on-surface-variant);font-size:var(--text-xs);margin-block-end:var(--space-1)}.clipboard-preview .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.config-overlay{align-items:center;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--shadow,#000),transparent 40%);color:var(--on-surface,#e0e2e8);display:none;inset:0;justify-content:center;overflow:hidden;overscroll-behavior:contain;padding:var(--space-4);position:fixed;scrollbar-color:transparent transparent;scrollbar-width:none;z-index:8}.config-overlay.flex{display:flex}.config-panel{animation:scaleIn .2s cubic-bezier(.4,0,.2,1);background:var(--surface-container-high);block-size:min(80cqb,48rem,80dvb)!important;border:1px solid var(--outline-variant);border-radius:var(--radius-2xl);box-shadow:var(--elevation-5);contain:strict!important;container-name:config-panel!important;container-type:size!important;display:flex;flex-basis:auto;flex-direction:column;flex-grow:0;flex-shrink:1;inline-size:min(min(100cqi,100%) - var(--space-8),min(28rem,100cqi,100%));max-block-size:min(80cqb,48rem,80dvb)!important;max-inline-size:max-content;min-block-size:0;min-inline-size:min(28rem,100cqi,100%);overflow:hidden;overscroll-behavior:contain;padding:var(--space-1,4px);pointer-events:auto;touch-action:pan-y;user-select:none}.config-panel h3{color:var(--on-surface);font-size:var(--text-2xl);font-weight:var(--font-weight-semibold);line-height:var(--line-height-tight);margin:0 0 var(--space-6) 0;margin-block-start:var(--space-4,16px);text-align:center}.config-panel__body{block-size:stretch;box-sizing:border-box;contain:strict!important;flex:1;inline-size:stretch;min-block-size:0;overflow-block:auto;overflow-inline:visible;overscroll-behavior:contain;padding-inline:0;scrollbar-color:var(--outline-variant) transparent;scrollbar-width:thin}.config-group{margin-block-end:var(--space-5);overflow:visible;padding-inline:var(--space-4,16px)}.config-group label{color:var(--on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);line-height:var(--line-height-normal);margin-block-end:var(--space-2)}.config-group input,.config-group select,.config-group textarea{background:var(--surface-container-highest);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);box-sizing:border-box;color:var(--on-surface);font-family:inherit;font-size:var(--text-base);inline-size:100%;line-height:var(--line-height-normal);padding:var(--space-4) var(--space-4);pointer-events:auto;transition:all var(--transition-fast);user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.config-group input:hover,.config-group select:hover,.config-group textarea:hover{background:var(--surface-container);border-color:var(--outline)}.config-group input:focus,.config-group select:focus,.config-group textarea:focus{background:var(--surface-container-highest);border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary),transparent 20%);outline:none}.config-group input::placeholder,.config-group select::placeholder,.config-group textarea::placeholder{color:var(--on-surface-variant);opacity:.7}.config-group input:invalid,.config-group select:invalid,.config-group textarea:invalid{border-color:var(--error);box-shadow:0 0 0 3px color-mix(in srgb,var(--error),transparent 20%)}.config-actions{display:flex;gap:var(--space-3);justify-content:flex-end;margin-block-start:var(--space-6)}.config-actions button{border:none;border-radius:var(--radius-lg);cursor:pointer;font-family:inherit;font-size:var(--text-base);font-weight:var(--font-weight-medium);min-inline-size:6rem;padding:var(--space-3) var(--space-5);transition:all var(--transition-fast)}.config-actions button:first-child{background:var(--primary);color:var(--on-primary)}.config-actions button:first-child:hover{background:color-mix(in srgb,var(--primary),black 8%)}.config-actions button:first-child:active{background:color-mix(in srgb,var(--primary),black 12%);transform:scale(.98)}.config-actions button:last-child{background:var(--surface-container-high);border:1px solid var(--outline-variant);color:var(--on-surface-variant)}.config-actions button:last-child:hover{background:var(--surface-container-highest);border-color:var(--outline)}.config-actions button:last-child:active{background:color-mix(in srgb,var(--surface-container-high),var(--state-pressed));transform:scale(.98)}.config-actions button:focus-visible{outline:2px solid var(--primary);outline-offset:2px}.config-actions button:disabled{cursor:not-allowed;opacity:.38;pointer-events:none}.log-overlay{align-items:center;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--shadow,#000),transparent 35%);display:none;inset:0;justify-content:center;padding:var(--space-4);position:fixed;z-index:9}.log-overlay.open,.log-panel{display:flex}.log-panel{background:var(--surface);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);box-shadow:var(--elevation-5);flex-direction:column;inline-size:min(35rem,100vw - var(--space-8));max-block-size:calc(100vb - var(--space-8));overflow:hidden}.log-overlay-header{align-items:center;border-block-end:1px solid var(--outline-variant);display:flex;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);justify-content:space-between;padding:var(--space-3) var(--space-4)}.ghost-btn{background:var(--surface-variant);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);color:var(--on-surface-variant);cursor:pointer;font-size:var(--text-xs);padding:var(--space-2) var(--space-3)}.ghost-btn:active{filter:brightness(.92)}.log-container{color:var(--on-surface);flex:1;font-family:JetBrains Mono,Fira Code,Courier New,monospace;font-size:var(--text-xs);line-height:1.5;max-block-size:25rem;overflow-y:auto;padding:var(--space-4) var(--space-5)}.hero{align-items:center;display:flex;flex-direction:column;gap:var(--space-4);inline-size:100%;padding:var(--space-2) 0;text-align:center}.hero h1{color:var(--on-surface);font-size:var(--text-4xl);font-weight:var(--font-weight-bold);letter-spacing:-.025em;line-height:var(--line-height-tight);margin:0 0 var(--space-2) 0}.hero .subtitle{color:var(--on-surface-variant);font-size:var(--text-lg);line-height:var(--line-height-normal);max-inline-size:48rem;opacity:.87}.status-container{display:flex;flex-direction:row;flex-wrap:nowrap;gap:var(--space-2);place-content:center;place-items:center;align-items:start;justify-content:center;text-align:start}.status-bar{align-items:center;background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);color:var(--on-surface-variant);display:flex;flex-wrap:wrap;font-size:var(--text-sm);gap:var(--space-4);justify-content:center;padding:var(--space-2) var(--space-4)}.status-bar .status-item{align-items:start;background:var(--surface);border-radius:var(--radius-lg);display:flex;flex-wrap:nowrap;gap:var(--space-2);justify-items:center;overflow:hidden;padding:var(--space-1) var(--space-2);text-align:start;text-overflow:ellipsis;white-space:nowrap}.status-bar .status-item span.value{font-variant-numeric:tabular-nums;font-weight:var(--font-weight-semibold);margin-inline-start:var(--space-1)}.big-button{align-items:center;background:var(--surface-container-high);block-size:10rem;border:none;border-radius:50%;box-shadow:var(--elevation-3);color:var(--on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-xl);font-weight:var(--font-weight-semibold);inline-size:10rem;justify-content:center;overflow:hidden;position:relative;touch-action:none;transition:all var(--transition-normal);user-select:none;-webkit-user-select:none}.big-button:before{background:var(--state-hover);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.big-button:hover{box-shadow:var(--elevation-4);transform:translateY(-2px)}.big-button:hover:before{opacity:1}.big-button:active{box-shadow:var(--elevation-2);transform:translateY(0) scale(.96)}.big-button:active:before{background:var(--state-pressed);opacity:0}.big-button.active{background:var(--primary-container);box-shadow:var(--elevation-4),0 0 0 6px color-mix(in srgb,var(--primary),transparent 15%);color:var(--on-primary-container)}.big-button.air{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--surface-container-high),color-mix(in srgb,var(--surface-container-high),var(--primary) 8%))}.big-button.air.active{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--primary-container),var(--primary));color:var(--on-primary-container)}.big-button.ai{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--surface-container-high),color-mix(in srgb,var(--surface-container-high),var(--secondary) 8%))}.big-button.ai.active{animation:pulse 2s infinite;background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--secondary-container),var(--secondary));color:var(--on-secondary-container)}.big-button.air-move{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--primary),color-mix(in srgb,var(--primary),black 10%));color:var(--on-primary)}.big-button.ai.listening{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--error),color-mix(in srgb,var(--error),black 10%));box-shadow:var(--elevation-4),0 0 0 6px color-mix(in srgb,var(--error),transparent 15%);color:var(--on-error)}.ai-block,.air-block,.air-row{gap:.5rem;position:relative}.air-row{align-items:end;display:flex;flex-direction:row}.neighbor-button{inset-block-end:-1rem;inset-inline-end:-4.5rem;position:absolute;transform:translate(-50%)}.ai-block{margin-block-end:.75rem}.label{color:#bfc8cc;font-size:1rem;line-height:1.4}.voice-line{color:#e0e2e8;margin-block-start:.25rem;min-block-size:18px}.hint,.voice-line{font-size:1rem;max-inline-size:560px}.hint{color:#bfc8cc;display:flex;flex-direction:column;margin-block-start:.75rem}.hint ul{margin:.25rem 0 0;padding-inline-start:1.25rem}.hint li{margin-block-start:.25rem}.stage{block-size:max-content;flex:1;gap:var(--space-8);inline-size:100%;justify-content:flex-end;min-block-size:20rem}.ai-block,.air-block,.stage{align-items:center;display:flex;flex-direction:column}.ai-block,.air-block{gap:var(--space-2)}.ai-block{margin-block-end:var(--space-3)}.label{color:var(--on-surface-variant);font-size:min(var(--text-base),.8rem);line-height:var(--line-height-normal);opacity:.87}.label,.voice-line{font-weight:var(--font-weight-medium);text-align:center}.voice-line{background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);color:var(--on-surface);font-size:var(--text-xl);font-variant-numeric:tabular-nums;inline-size:100%;line-height:var(--line-height-tight);margin-block-start:var(--space-2);max-inline-size:40rem;min-block-size:1.5rem;padding:var(--space-3) var(--space-4);position:relative}.voice-line:before{background:var(--state-focus);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.voice-line.listening{background:color-mix(in srgb,var(--secondary-container),transparent 20%);border-color:var(--secondary)}.voice-line.listening:before{background:var(--secondary);opacity:.3}.hint{color:var(--on-surface-variant);font-size:var(--text-sm);line-height:var(--line-height-relaxed);margin-block-start:var(--space-6);max-inline-size:48rem;opacity:.8;text-align:center}.hint ul{display:inline-block;margin:var(--space-3) 0 0;padding-inline-start:var(--space-6);text-align:left}.hint li{margin-block-start:var(--space-2);padding-inline-start:var(--space-3);position:relative}.hint li::marker{color:var(--primary);font-weight:var(--font-weight-semibold)}.hint li:before{background:var(--primary);block-size:4px;border-radius:var(--radius-full);content:\"\";inline-size:4px;inset-block-start:.5em;inset-inline-start:0;position:absolute}.side-log-toggle{background:#40484c;border:1px solid #40484c;border-radius:1rem;box-shadow:0 1px 3px 0 rgba(0,0,0,.3),0 4px 8px 3px rgba(0,0,0,.15);color:#e0e2e8;cursor:pointer;font-size:.875rem;inset-block-start:50%;inset-inline-end:1rem;padding:.75rem 1rem;position:fixed;transform:translateY(-50%);transition:all .15s cubic-bezier(.4,0,.2,1);z-index:5}.side-log-toggle:active{transform:translateY(-50%) scale(.98)}.neighbor-button{align-items:center;background:#40484c;block-size:60px;border:1px solid #40484c;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.3),0 2px 6px 2px rgba(0,0,0,.15);color:#e0e2e8;cursor:pointer;display:inline-flex;font-size:1rem;font-weight:600;inline-size:60px;justify-content:center;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none;-webkit-user-select:none}.neighbor-button:active{background:#353d41;transform:scale(.95)}.air-button-container{align-items:center;display:flex;gap:.75rem}.keyboard-toggle{align-items:center;background:linear-gradient(135deg,#0061a4,#004d7a);block-size:56px;border:none;border-radius:9999px;box-shadow:0 2px 3px 0 rgba(0,0,0,.3),0 6px 10px 4px rgba(0,0,0,.15);color:white;cursor:pointer;display:flex;font-size:24px;inline-size:56px;inset-block-end:1.25rem;inset-inline-end:1.25rem;justify-content:center;position:fixed;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none;-webkit-user-select:none;z-index:4}.keyboard-toggle:active{box-shadow:0 1px 2px 0 rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15);transform:scale(.95)}.keyboard-toggle-editable{caret-color:transparent;color:transparent!important;outline:none;overflow:hidden;text-shadow:none!important}.keyboard-toggle-editable:before{color:white;content:\"⌨️\";font-size:24px;inset-block-start:50%;inset-inline-start:50%;line-height:1;pointer-events:none;position:absolute;transform:translate(-50%,-50%);z-index:2}.keyboard-toggle-editable:focus{caret-color:transparent}.keyboard-toggle-editable:focus:after{border-radius:9999px;box-shadow:0 0 0 2px rgba(255,255,255,.3);content:\"\";inset:0;pointer-events:none;position:absolute;z-index:1}.virtual-keyboard-container{background:transparent;display:none;flex-direction:column;inset:0;max-block-size:50vh;pointer-events:none;position:fixed;transform:translateY(100%);transition:transform .25s cubic-bezier(.4,0,.2,1);z-index:8}.virtual-keyboard-container.visible{display:flex;pointer-events:auto;transform:translateY(0)}.keyboard-header{align-items:center;border-block-end:1px solid #40484c;display:flex;justify-content:space-between;padding:.5rem .75rem}.keyboard-close{background:transparent;border:none;color:#bfc8cc;cursor:pointer;font-size:20px;line-height:1;padding:.25rem .5rem}.keyboard-close:active{color:#e0e2e8}.keyboard-tabs{display:flex;gap:.5rem}.keyboard-tab{background:#40484c;border:none;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:.875rem;padding:.5rem .75rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.keyboard-tab.active{background:#0061a4;color:white}.keyboard-content{flex:1;overflow-y:auto;padding:.5rem}.keyboard-panel{display:none}.keyboard-panel.active{display:block}.keyboard-shift-container{margin-block-end:.5rem}.keyboard-shift{background:#40484c;border:1px solid #40484c;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:1rem;inline-size:100%;padding:.5rem 1rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.keyboard-shift.active{background:#0061a4;color:white}.keyboard-rows{display:flex;flex-direction:column;gap:.5rem;margin-block-end:.5rem}.keyboard-row{display:flex;gap:.25rem;justify-content:center}.keyboard-key{background:#40484c;block-size:44px;border:1px solid #40484c;border-radius:.75rem;color:#e0e2e8;cursor:pointer;flex:1;font-size:1rem;font-weight:500;max-inline-size:48px;min-inline-size:32px;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none}.keyboard-key:active{background:#0061a4;color:white;transform:scale(.95)}.keyboard-key.special{flex:2;font-size:.875rem;max-inline-size:none}.keyboard-key.space{flex:4}.keyboard-special{display:flex;gap:.25rem;margin-block-start:.5rem}.emoji-categories{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-end:.75rem}.emoji-category-btn{background:#40484c;border:none;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:.75rem;padding:.5rem .75rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.emoji-category-btn.active{background:#0061a4;color:white}.emoji-grid{display:grid;gap:.5rem;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));max-block-size:200px;overflow-y:auto}.emoji-key{align-items:center;background:#40484c;block-size:44px;border:1px solid #40484c;border-radius:.75rem;cursor:pointer;display:flex;font-size:24px;inline-size:44px;justify-content:center;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1)}.emoji-key:active{background:#0061a4;transform:scale(.95)}}@layer view.airpad{}@layer view.airpad{}@layer view.airpad{@media (max-width:520px){.big-button{block-size:140px;border-radius:9999px;inline-size:140px}.neighbor-button{block-size:50px;border-radius:9999px;font-size:.875rem;inline-size:50px}.air-button-container{gap:.75rem}.stage{gap:1.5rem}.side-log-toggle{inset-inline-end:.75rem}.bottom-toolbar{gap:.5rem;inset-block-end:max(1rem,env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));inset-inline-start:1rem}.toolbar-btn{block-size:48px;border-radius:1rem;font-size:20px;inline-size:48px}.clipboard-preview{inset-block-end:5rem}.keyboard-toggle{block-size:48px;border-radius:9999px;font-size:20px;inline-size:48px;inset-block-end:1rem;inset-inline-end:1rem}.virtual-keyboard-container{max-block-size:calc(100vh - 4rem)}.keyboard-key{block-size:40px;font-size:.875rem;max-inline-size:40px;min-inline-size:28px}.emoji-key{block-size:40px;font-size:20px;inline-size:40px}}}@layer view.airpad{.view-cwsp{background:var(--surface);color:var(--on-surface);min-block-size:100%;position:relative;--action-rail-btn-size:3.25rem;--action-rail-height:4.15rem;--action-rail-bottom:max(var(--space-4),env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));--action-rail-edge:clamp(0.35rem,1.1vw,0.7rem)}.view-cwsp .container{margin-inline:auto;max-inline-size:min(1080px,100%);min-block-size:100%;padding:clamp(.55rem,1.25vh,1.05rem) clamp(.75rem,1.8vw,1.25rem) calc(var(--action-rail-height) + var(--space-4))}.view-cwsp .hero h1{font-size:clamp(1.5rem,3.6vh,2.5rem);margin-block-end:clamp(.25rem,.8vh,.75rem)}.view-cwsp .hero .subtitle{font-size:clamp(.875rem,1.6vh,1rem)}.view-cwsp .status-container{align-items:start;display:flex;flex-direction:column;gap:clamp(.35rem,.8vh,.75rem);inline-size:min(100%,680px);justify-items:center;text-align:start}.view-cwsp .status-bar{align-items:stretch;display:grid;gap:clamp(.22rem,.5vh,.55rem);grid-template-columns:repeat(2,minmax(0,1fr));inline-size:100%;padding:clamp(.25rem,.8vh,.5rem) clamp(.5rem,1vw,.875rem)}.view-cwsp .status-bar .status-item{justify-content:start;min-inline-size:0}.view-cwsp .stage{gap:clamp(.5rem,1.15vh,.9rem);justify-content:center;min-block-size:clamp(10rem,24vh,14.5rem)}.view-cwsp .air-row{align-items:flex-end;position:relative}.view-cwsp .big-button{block-size:clamp(6.2rem,14vh,8.75rem);flex-shrink:0;font-size:clamp(1rem,2.3vh,1.4rem);inline-size:clamp(6.2rem,14vh,8.75rem);min-block-size:6.2rem;min-inline-size:6.2rem}.view-cwsp .neighbor-button{block-size:clamp(2.8rem,5.5vh,3.35rem);flex-shrink:0;inline-size:clamp(2.8rem,5.5vh,3.35rem);inset-block-end:.2rem;inset-inline-end:clamp(-2.2rem,-3.5vw,-1.6rem);min-block-size:2.8rem;min-inline-size:2.8rem;transform:none}.view-cwsp .big-button.active,.view-cwsp .big-button.air-move,.view-cwsp .big-button:active,.view-cwsp .neighbor-button.active,.view-cwsp .neighbor-button:active{transform:none}.view-cwsp .voice-line{font-size:clamp(.85rem,1.8vh,1rem);inline-size:100%;margin-block-start:clamp(.1rem,.35vh,.3rem);max-inline-size:40rem;padding:clamp(.4rem,1vh,.65rem) clamp(.5rem,1.2vw,.9rem)}.view-cwsp .hint{display:grid;font-size:clamp(.72rem,1.5vh,.86rem);gap:clamp(.35rem,1vh,.7rem);grid-template-columns:repeat(3,minmax(0,1fr));inline-size:100%;margin-block-start:clamp(.15rem,.55vh,.5rem);max-inline-size:min(1080px,100%);text-align:initial}.view-cwsp .hint-group{background:color-mix(in srgb,var(--surface-container),transparent 10%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 22%);border-radius:var(--radius-lg);line-height:1.35;margin:0;overflow:clip;padding:clamp(.35rem,.9vh,.65rem) clamp(.45rem,1vw,.8rem)}.view-cwsp .hint-group summary{color:var(--on-surface);cursor:pointer;font-size:clamp(.76rem,1.65vh,.92rem);font-weight:var(--font-weight-semibold);list-style:none;padding:.05rem 0}.view-cwsp .hint-group summary::-webkit-details-marker{display:none}.view-cwsp .hint-group summary:after{content:\"▾\";float:inline-end;opacity:.75;transition:transform var(--transition-fast)}.view-cwsp .hint-group:not([open]) summary:after{transform:rotate(-90deg)}.view-cwsp .hint-group ul{margin:clamp(.25rem,.8vh,.45rem) 0 0;padding-inline-start:1rem}.view-cwsp .hint-group li{margin-block:clamp(.15rem,.45vh,.3rem)}.view-cwsp .hint-group code{background:color-mix(in srgb,var(--surface-container-high),transparent 8%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 30%);border-radius:.4rem;font-size:.9em;padding:.1rem .35rem}.view-cwsp .side-actions-row{align-items:center;display:flex;flex-direction:column;gap:var(--space-2);inline-size:fit-content;inset-block-end:calc(var(--action-rail-bottom) + var(--action-rail-height) + var(--space-2));inset-inline-start:var(--action-rail-edge);position:fixed;z-index:7}.view-cwsp .side-actions-row .side-log-toggle{background:var(--side-action-bg);block-size:auto;border:1px solid var(--side-action-border);border-radius:.95rem;box-shadow:var(--side-action-shadow);color:var(--side-action-fg);font-weight:var(--font-weight-semibold);inline-size:100%;inset:auto;letter-spacing:.01em;line-height:1;min-block-size:2.3rem;min-inline-size:5.25rem;order:1;padding:.55rem .9rem;position:relative;text-align:center;transform:none;transition:background var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast),transform var(--transition-fast),color var(--transition-fast);white-space:nowrap;writing-mode:horizontal-tb}.view-cwsp .side-actions-row .side-log-toggle:hover{background:var(--side-action-hover-bg);border-color:color-mix(in srgb,var(--side-action-border),var(--side-action-fg) 22%);box-shadow:0 3px 6px rgba(0,0,0,.34),0 10px 18px rgba(0,0,0,.28)}.view-cwsp .side-actions-row .side-log-toggle:focus-visible{outline:2px solid color-mix(in srgb,var(--primary),white 20%);outline-offset:1px}.view-cwsp .side-actions-row .side-log-toggle:active{background:var(--side-action-active-bg);transform:translateY(1px)}.view-cwsp .side-actions-row .side-hint-toggle{background:var(--side-action-hint-bg);border-color:var(--side-action-hint-border);color:var(--side-action-hint-fg);order:2}.view-cwsp .side-actions-row .side-hint-toggle:hover{background:var(--side-action-hint-hover-bg,var(--side-action-hint-bg))}.view-cwsp .side-actions-row .side-hint-toggle:active{background:var(--side-action-hint-active-bg,var(--side-action-active-bg))}.view-cwsp .side-actions-row .side-fix-toggle{background:var(--side-action-fix-bg);border-color:var(--side-action-fix-border);color:var(--side-action-fix-fg);order:3}.view-cwsp .side-actions-row .side-fix-toggle:hover{background:var(--side-action-fix-hover-bg,var(--side-action-fix-bg))}.view-cwsp .side-actions-row .side-fix-toggle:active{background:var(--side-action-fix-active-bg,var(--side-action-active-bg))}.view-cwsp .side-actions-row .side-reload-toggle{background:var(--side-action-reload-bg);border-color:var(--side-action-reload-border);color:var(--side-action-reload-fg);order:4}.view-cwsp .side-actions-row .side-reload-toggle:hover{background:var(--side-action-reload-hover-bg,var(--side-action-reload-bg))}.view-cwsp .side-actions-row .side-reload-toggle:active{background:var(--side-action-reload-active-bg,var(--side-action-active-bg))}.view-cwsp .keyboard-toggle{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);font-size:1.125rem;inline-size:var(--action-rail-btn-size);inset:auto;opacity:1;pointer-events:auto;position:relative;z-index:auto}.view-cwsp .keyboard-toggle.is-disabled{filter:saturate(.85) brightness(.95);opacity:.94}.view-cwsp .bottom-toolbar{align-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);background:color-mix(in srgb,var(--surface-container-high),transparent 12%);block-size:auto;border:1px solid color-mix(in srgb,var(--outline),transparent 35%);border-radius:clamp(.7rem,1.9vw,.95rem);box-shadow:var(--elevation-4);display:grid;gap:var(--space-1);grid-auto-columns:max-content;grid-auto-flow:column;inline-size:fit-content;inset-block-end:var(--action-rail-bottom);inset-inline:50%;justify-content:center;max-inline-size:calc(min(100cqi, 100%) - var(--action-rail-edge) * 2);overflow-x:auto;overflow-y:hidden;padding:.38rem;position:fixed;scrollbar-width:none;transform:translateX(-50%);z-index:6;-ms-overflow-style:none}.view-cwsp .bottom-toolbar::-webkit-scrollbar{display:none}.view-cwsp .bottom-toolbar .toolbar-btn{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);font-size:1.125rem;inline-size:var(--action-rail-btn-size)}.view-cwsp .bottom-toolbar .keyboard-toggle,.view-cwsp .bottom-toolbar .toolbar-btn{background:color-mix(in srgb,var(--surface-container),transparent 8%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 20%);box-shadow:var(--elevation-2);flex:0 0 auto}.view-cwsp .bottom-toolbar .keyboard-toggle{color:var(--on-surface)}.view-cwsp .bottom-toolbar .toolbar-btn:hover{box-shadow:var(--elevation-3);transform:translateY(-1px)}.view-cwsp .bottom-toolbar .toolbar-btn:active{transform:scale(.94)}.view-cwsp .bottom-toolbar #btnConfig{background:color-mix(in srgb,var(--primary),var(--surface-container-high) 65%);border-color:color-mix(in srgb,var(--primary),transparent 45%);color:var(--on-primary);order:10}.view-cwsp .bottom-toolbar #btnCut{order:20}.view-cwsp .bottom-toolbar #btnCopy{order:30}.view-cwsp .bottom-toolbar #btnPaste{order:40}.view-cwsp .bottom-toolbar #btnConnect{order:50}.view-cwsp .bottom-toolbar .keyboard-toggle{order:60}.view-cwsp .connect-fab{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);box-shadow:var(--elevation-2);font-size:.92rem;font-weight:700;inline-size:fit-content;inset:auto;letter-spacing:.01em;margin:0;max-inline-size:100%;min-inline-size:4.25rem;overflow:hidden;padding-inline:.8rem;position:relative;text-overflow:clip;white-space:nowrap;z-index:auto}.view-cwsp .connect-fab.connect-fab--ws{background:color-mix(in srgb,var(--primary),var(--surface-container-high) 72%);border-color:color-mix(in srgb,var(--primary),transparent 40%);color:var(--on-primary)}.view-cwsp .bottom-toolbar #btnAdminDoor{order:55}.view-cwsp .toolbar-btn.toolbar-btn--admin-door{background:color-mix(in srgb,var(--color-error,#c62828) 20%,var(--surface-container-high));border-color:color-mix(in srgb,var(--color-error,#c62828) 45%,var(--surface-outline,transparent));color:color-mix(in srgb,var(--color-error,#b71c1c) 75%,var(--on-surface));font-size:.68rem;font-weight:800;letter-spacing:.03em;padding-inline:.45rem}.view-cwsp .hint-overlay .hint-panel{inline-size:min(44rem,100vw - var(--space-8))}.view-cwsp .hint-modal-content.hint{inline-size:100%;margin:0;max-block-size:min(68vh,36rem);max-inline-size:none;opacity:1;overflow-y:auto;padding:var(--space-3) var(--space-4) var(--space-4);text-align:start}@media (max-width:520px){.view-cwsp{--action-rail-btn-size:2.8rem;--action-rail-height:3.55rem;--action-rail-bottom:max(0.75rem,env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));--action-rail-edge:0.3rem}.view-cwsp .container{padding:.5rem .6rem calc(var(--action-rail-height) + .6rem)}.view-cwsp .hero h1{font-size:clamp(1.2rem,3vh,1.5rem)}.view-cwsp .hero .subtitle{font-size:.82rem}.view-cwsp .status-bar{font-size:.74rem;gap:.3rem;grid-template-columns:repeat(2,minmax(0,1fr));inline-size:100%}.view-cwsp .status-container{inline-size:100%}.view-cwsp .neighbor-button{block-size:2.45rem;font-size:.82rem;inline-size:2.45rem;inset-inline-end:-1.35rem}.view-cwsp .bottom-toolbar{border-radius:.78rem;gap:.3rem;inline-size:100%;inset-block-end:var(--action-rail-bottom);inset-inline:50%;padding:.32rem;transform:translateX(-50%)}.view-cwsp .bottom-toolbar .keyboard-toggle,.view-cwsp .bottom-toolbar .toolbar-btn{block-size:var(--action-rail-btn-size);border-radius:var(--radius-lg);font-size:1rem;inline-size:var(--action-rail-btn-size)}.view-cwsp .connect-fab{font-size:.86rem;min-inline-size:4rem;padding-inline:.65rem}.view-cwsp .side-actions-row{gap:.38rem;inset-block-end:calc(var(--action-rail-bottom) + var(--action-rail-height) + 3.35rem);inset-inline-start:var(--action-rail-edge)}.view-cwsp .side-actions-row .side-log-toggle{border-radius:.8rem;font-size:.8rem;min-block-size:2rem;padding:.46rem .68rem}.view-cwsp .hint-overlay .hint-panel{inline-size:calc(100vw - 1rem);max-block-size:calc(100vh - 2rem)}.view-cwsp .hint-modal-content.hint{max-block-size:calc(100vh - 7.5rem);padding:var(--space-2) var(--space-3) var(--space-3)}.view-cwsp .hint{font-size:.76rem;gap:.4rem;grid-template-columns:1fr}.view-cwsp .hint-group{padding:.45rem .55rem}}@media (max-height:860px),(max-width:980px){.view-cwsp .hint{grid-template-columns:1fr;max-inline-size:min(620px,100%)}.view-cwsp .stage{min-block-size:clamp(9.4rem,21vh,12.6rem)}}}";
//#endregion
//#region src/frontend/views/airpad/input/speech.ts
var recognition = null;
var aiListening = false;
var aiModeActive = false;
var speechLanguage = "ru-RU";
var speechRecognitionInitialized = false;
var unsubscribeVoiceMessage = null;
var normalizeSpeechLanguage = (value) => {
	const lang = (value || "").trim();
	if (!lang) return "ru-RU";
	if (lang === "ru") return "ru-RU";
	if (lang === "en") return "en-US";
	if (lang === "en-GB") return "en-GB";
	if (lang === "en-US") return "en-US";
	return lang;
};
async function loadSpeechLanguagePreference() {
	try {
		speechLanguage = normalizeSpeechLanguage((await loadSettings())?.speech?.language);
		if (recognition) recognition.lang = speechLanguage;
	} catch {
		speechLanguage = "ru-RU";
	}
}
var checkIsAiModeActive = () => {
	return aiListening || aiModeActive;
};
function setAiStatus(text) {
	const aiStatusEl = getAiStatusEl();
	if (aiStatusEl) aiStatusEl.textContent = text;
}
function setupSpeechRecognition() {
	const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SR) {
		log("SpeechRecognition API не поддерживается.");
		return null;
	}
	const recog = new SR();
	recog.lang = speechLanguage;
	recog.interimResults = false;
	recog.maxAlternatives = 1;
	return recog;
}
function initSpeechRecognition() {
	if (speechRecognitionInitialized) return;
	speechRecognitionInitialized = true;
	loadSpeechLanguagePreference();
	recognition = setupSpeechRecognition();
	unsubscribeVoiceMessage?.();
	unsubscribeVoiceMessage = onAirPadVoiceMessage((message) => {
		const voiceTextEl = getVoiceTextEl();
		if (voiceTextEl) voiceTextEl.textContent = message.text;
	});
	if (recognition) {
		recognition.onstart = () => {
			const aiButton = getAiButton();
			const voiceTextEl = getVoiceTextEl();
			aiListening = true;
			aiModeActive = true;
			if (aiButton) aiButton.classList.add("listening");
			setAiStatus("listening");
			if (voiceTextEl) voiceTextEl.textContent = "Слушаю...";
			log("Speech: start");
		};
		recognition.onend = () => {
			const aiButton = getAiButton();
			aiListening = false;
			aiModeActive = false;
			if (aiButton) aiButton.classList.remove("listening");
			setAiStatus("idle");
			log("Speech: end");
		};
		recognition.onerror = (event) => {
			const voiceTextEl = getVoiceTextEl();
			if (voiceTextEl) voiceTextEl.textContent = "Ошибка распознавания: " + event.error;
			log("Speech error: " + event.error);
		};
		recognition.onresult = (event) => {
			const voiceTextEl = getVoiceTextEl();
			const normalized = (event.results[0][0].transcript || "").trim();
			const words = normalized.split(/\s+/).filter(Boolean);
			if (voiceTextEl) voiceTextEl.textContent = normalized ? "Команда: " + normalized : "Команда не распознана";
			log("Speech result: " + normalized);
			if (words.length < 2) {
				log("Speech: недостаточно слов (нужно >= 2) — не отправляем и не подключаем WS");
				return;
			}
			const trySend = (deadline) => {
				if (isAirPadSessionConnected()) {
					sendAirPadIntent({
						type: "voice.submit",
						text: normalized
					});
					return;
				}
				if (Date.now() > deadline) {
					log("Speech: не удалось дождаться WS, команда не отправлена");
					return;
				}
				setTimeout(() => trySend(deadline), 120);
			};
			if (!isAirPadSessionConnected()) {
				log("Speech: подключаем WS перед отправкой команды");
				connectAirPadSession();
				trySend(Date.now() + 2e3);
			} else sendAirPadIntent({
				type: "voice.submit",
				text: normalized
			});
		};
	}
}
function initAiButton() {
	const aiButton = getAiButton();
	if (!aiButton) return;
	let pointerActive = false;
	let pointerId = null;
	aiButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (pointerActive) return;
		pointerActive = true;
		pointerId = e.pointerId;
		aiButton.setPointerCapture(pointerId);
		if (!recognition) {
			log("SpeechRecognition недоступен");
			return;
		}
		try {
			recognition.start();
		} catch (err) {
			log("Recognition start error: " + err.message);
		}
	});
	aiButton.addEventListener("pointerup", (e) => {
		if (!pointerActive || e.pointerId !== pointerId) return;
		e.preventDefault();
		pointerActive = false;
		aiButton.releasePointerCapture(pointerId);
		pointerId = null;
		if (!recognition) return;
		try {
			recognition.stop();
		} catch (err) {
			log("Recognition stop error: " + err.message);
		}
	});
	aiButton.addEventListener("pointercancel", () => {
		if (!pointerActive) return;
		pointerActive = false;
		pointerId = null;
		if (recognition) try {
			recognition.stop();
		} catch {}
	});
}
//#endregion
//#region src/frontend/views/airpad/config/motion-state.ts
var accum = {
	dx: 0,
	dy: 0,
	dz: 0
};
var flushTimer = null;
function clearAccum() {
	accum.dx = 0;
	accum.dy = 0;
	accum.dz = 0;
}
function scheduleFlush() {
	if (flushTimer !== null) return;
	flushTimer = globalThis?.setTimeout?.(() => {
		flushTimer = null;
		if (accum.dx === 0 && accum.dy === 0 && accum.dz === 0) return;
		sendAirPadIntent({
			type: "pointer.move",
			dx: accum.dx,
			dy: accum.dy,
			dz: accum.dz
		});
		clearAccum();
	}, 7);
}
function enqueueMotion(dx, dy, dz = 0) {
	if (Math.abs(dx) < .001) dx = 0;
	if (Math.abs(dy) < .001) dy = 0;
	if (Math.abs(dz) < .001) dz = 0;
	if (dx === 0 && dy === 0 && dz === 0) return;
	accum.dx += dx;
	accum.dy += dy;
	accum.dz += dz;
	scheduleFlush();
}
function resetMotionAccum() {
	clearAccum();
	if (flushTimer !== null) {
		clearTimeout(flushTimer);
		flushTimer = null;
	}
}
//#endregion
//#region src/frontend/views/airpad/utils/math.ts
function n0(v) {
	return Number.isFinite(v) ? v : 0;
}
function clamp01(v) {
	const x = n0(v);
	return x < 0 ? 0 : x > 1 ? 1 : x;
}
function lerp(a, b, t) {
	return n0(a) + (n0(b) - n0(a)) * clamp01(t);
}
function expSmoothing(dtSeconds, ratePerSecond) {
	const dt = Math.max(0, n0(dtSeconds));
	const rate = Math.abs(n0(ratePerSecond));
	return 1 - Math.exp(-rate * dt);
}
function vec3Zero() {
	return {
		x: 0,
		y: 0,
		z: 0
	};
}
function vec3Mix(a, b, f = .5) {
	const ax = n0(a.x);
	const ay = n0(a.y);
	const az = n0(a.z);
	const bx = n0(b.x);
	const by = n0(b.y);
	const bz = n0(b.z);
	const ff = n0(f);
	return {
		x: ax + (bx - ax) * ff,
		y: ay + (by - ay) * ff,
		z: az + (bz - az) * ff
	};
}
function vec3Clamp(v, max) {
	const m = Math.abs(n0(max));
	if (m === 0) return vec3Zero();
	const x = n0(v.x);
	const y = n0(v.y);
	const z = n0(v.z);
	const length = Math.hypot(x, y, z);
	if (length === 0 || length <= m) return {
		x,
		y,
		z
	};
	const s = m / length;
	return {
		x: x * s,
		y: y * s,
		z: z * s
	};
}
function vec3IsNearZero(v, epsilon = .01) {
	const e = Math.abs(n0(epsilon) || .01);
	return Math.abs(n0(v.x)) < e && Math.abs(n0(v.y)) < e && Math.abs(n0(v.z)) < e;
}
function vec3Smooth(current, target, factor = .25) {
	return vec3Mix(current, target, factor);
}
function vec3Select(v, axisX, axisY, axisZ) {
	const componentMap = {
		ax: n0(v.x),
		ay: n0(v.y),
		az: n0(v.z)
	};
	return {
		x: componentMap[axisX],
		y: componentMap[axisY],
		z: componentMap[axisZ]
	};
}
function vec3RotateXYByAngle(v, angleRad, zOverride) {
	const a = n0(angleRad);
	const cosA = Math.cos(a);
	const sinA = Math.sin(a);
	const x = n0(v.x);
	const y = n0(v.y);
	return {
		x: x * cosA - y * sinA,
		y: x * sinA + y * cosA,
		z: zOverride !== void 0 ? n0(zOverride) : n0(v.z)
	};
}
vec3Zero();
performance.now();
function resetGyroState() {
	setMotionCalibrated(false);
	performance.now();
	resetMonteCarloSampling$1();
	gyroscopeSmoothed = vec3Zero();
	integratedAngles = vec3Zero();
	lastGyroMovement = vec3Zero();
}
function onEnterAirMove$1() {
	resetGyroState();
}
var gyroscopeSmoothed = vec3Zero();
vec3Zero();
var integratedAngles = vec3Zero();
vec3Zero();
function resetMonteCarloSampling$1() {
	vec3Zero();
	vec3Zero();
}
var lastGyroMovement = vec3Zero();
vec3Zero();
vec3Zero();
performance.now();
function resetAccelState() {
	setMotionCalibrated(false);
	performance.now();
	resetMonteCarloSampling();
	accelerometerSmoothed = vec3Zero();
	accelerometerResolved = vec3Zero();
	forSendingMovement = vec3Zero();
}
function onEnterAirMove() {
	resetAccelState();
}
var accelerometerSmoothed = vec3Zero();
var accelerometerResolved = vec3Zero();
vec3Zero();
function resetMonteCarloSampling() {
	vec3Zero();
	vec3Zero();
}
vec3Zero();
var forSendingMovement = vec3Zero();
//#endregion
//#region src/frontend/views/airpad/ui/air-button.ts
var airState = "IDLE";
var airDownTime = 0;
var airDownPos = null;
var airMoveTimer = null;
var dragActive = false;
var lastSwipePos = null;
var swipeDirection = null;
var lastTapEndTime = 0;
var lastTapWasClean = false;
var pendingDragOnHold = false;
var neighborPointerHandlersBound = /* @__PURE__ */ new WeakSet();
var airPointerDownBound = /* @__PURE__ */ new WeakSet();
var airSurfaceDocumentRoutingAttached = false;
var airSurfacePointerId = null;
var airSurfaceCaptureTarget = null;
var DOUBLE_TAP_WINDOW = 300;
var DRAG_HOLD_DELAY = 150;
var TAP_MOVE_FORGIVENESS = Math.max(6, 12);
var AIR_MOVE_TAP_GRACE_MS = 340;
var AIR_MOVE_TAP_GRACE_MOVE = Math.max(6, 16);
function getAirState() {
	return airState;
}
function setMotionCalibrated(value) {}
function resetMotionBaseline() {}
function setAirStatus(state) {
	const airStatusEl = getAirStatusEl();
	const airButton = getAirButton();
	airState = state;
	if (airStatusEl) airStatusEl.textContent = state + (dragActive ? " [DRAG]" : "");
	if (airButton) {
		airButton.classList.toggle("air-move", state === "AIR_MOVE");
		airButton.classList.toggle("active", state !== "IDLE");
		airButton.classList.toggle("drag-active", dragActive);
	}
}
function resetAirState() {
	setAirStatus("IDLE");
	airDownPos = null;
	lastSwipePos = null;
	swipeDirection = null;
	pendingDragOnHold = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	resetMotionBaseline();
}
/**
* Входит в режим AIR_MOVE — управление курсором через гироскоп/акселерометр.
* @param startDrag - если true, сразу активируется drag-режим (зажатая ЛКМ)
*/
function enterAirMove(startDrag = false) {
	setAirStatus("AIR_MOVE");
	resetMotionBaseline();
	onEnterAirMove$1();
	onEnterAirMove();
	if (startDrag && !dragActive) {
		dragActive = true;
		sendAirPadIntent({
			type: "pointer.down",
			button: "left"
		});
		log("Air: AIR_MOVE + DRAG started (mouse down)");
		setAirStatus("AIR_MOVE");
	} else log("Air: AIR_MOVE started (cursor control via sensors)");
}
/**
* Выход из AIR_MOVE режима
*/
function exitAirMove() {
	if (airState !== "AIR_MOVE") return;
	if (dragActive) {
		sendAirPadIntent({
			type: "pointer.up",
			button: "left"
		});
		log("Air: DRAG ended (mouse up)");
		dragActive = false;
	} else log("Air: AIR_MOVE ended");
}
function airOnDown(e) {
	connectAirPadSession();
	if (checkIsAiModeActive()) return;
	const now = Date.now();
	const timeSinceLastTap = now - lastTapEndTime;
	if (lastTapWasClean && timeSinceLastTap < DOUBLE_TAP_WINDOW) {
		pendingDragOnHold = true;
		log(`Air: double-tap detected (${timeSinceLastTap}ms since last tap), preparing for drag...`);
	} else pendingDragOnHold = false;
	lastTapWasClean = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	airDownTime = now;
	airDownPos = {
		x: e.clientX,
		y: e.clientY
	};
	setAirStatus("WAIT_TAP_OR_HOLD");
	const holdDelay = pendingDragOnHold ? DRAG_HOLD_DELAY : 100;
	airMoveTimer = globalThis?.setTimeout?.(() => {
		if (airState === "WAIT_TAP_OR_HOLD") enterAirMove(pendingDragOnHold);
	}, holdDelay);
}
function airOnUp(e) {
	if (checkIsAiModeActive()) {
		resetAirState();
		return;
	}
	const now = Date.now();
	const dt = now - airDownTime;
	const pointerUpX = e?.clientX ?? airDownPos?.x ?? 0;
	const pointerUpY = e?.clientY ?? airDownPos?.y ?? 0;
	let wasCleanTap = false;
	let shouldClickFromAirMoveGrace = false;
	if (airState === "AIR_MOVE" && !dragActive && airDownPos) {
		const dx = pointerUpX - airDownPos.x;
		const dy = pointerUpY - airDownPos.y;
		shouldClickFromAirMoveGrace = dt < AIR_MOVE_TAP_GRACE_MS && Math.hypot(dx, dy) < AIR_MOVE_TAP_GRACE_MOVE;
	}
	if (airState === "AIR_MOVE") exitAirMove();
	if (airState === "GESTURE_SWIPE") log("Air: swipe gesture ended");
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (airDownPos && dt < 200) {
			const dx = pointerUpX - airDownPos.x;
			const dy = pointerUpY - airDownPos.y;
			if (Math.hypot(dx, dy) < TAP_MOVE_FORGIVENESS) {
				wasCleanTap = true;
				if (!pendingDragOnHold) {
					sendAirPadIntent({
						type: "pointer.click",
						button: "left"
					});
					log("Air: tap → click");
				} else {
					sendAirPadIntent({
						type: "pointer.click",
						button: "left",
						count: 2
					});
					log("Air: tap-tap → double-click");
					wasCleanTap = false;
				}
			}
		}
	}
	if (shouldClickFromAirMoveGrace) {
		sendAirPadIntent({
			type: "pointer.click",
			button: "left"
		});
		log("Air: short hold + small move → click (grace)");
		wasCleanTap = true;
	}
	lastTapEndTime = now;
	lastTapWasClean = wasCleanTap;
	if (wasCleanTap) log(`Air: clean tap recorded, next tap+hold within ${DOUBLE_TAP_WINDOW}ms will start drag`);
	dragActive = false;
	resetAirState();
}
function handleAirSurfaceMove(x, y) {
	if (!airDownPos) return;
	const dxSurf = x - airDownPos.x;
	const dySurf = y - airDownPos.y;
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (Math.hypot(dxSurf, dySurf) > 40) {
			if (airMoveTimer !== null) {
				clearTimeout(airMoveTimer);
				airMoveTimer = null;
			}
			pendingDragOnHold = false;
			lastTapWasClean = false;
			setAirStatus("GESTURE_SWIPE");
			startSwipeGesture(dxSurf, dySurf);
		}
	} else if (airState === "GESTURE_SWIPE") continueSwipeGesture(x, y);
}
function startSwipeGesture(dxSurf, dySurf) {
	if (Math.abs(dySurf) > Math.abs(dxSurf)) {
		swipeDirection = "vertical";
		lastSwipePos = {
			x: airDownPos.x,
			y: airDownPos.y
		};
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dySurf * .8)
		});
		log(`Air: swipe ${dySurf > 0 ? "down" : "up"} → scroll`);
	} else {
		swipeDirection = "horizontal";
		const direction = dxSurf > 0 ? "right" : "left";
		log(`Air: swipe ${direction}`);
		sendAirPadIntent({
			type: "gesture.swipe",
			direction
		});
		resetAirState();
	}
}
function continueSwipeGesture(x, y) {
	if (!lastSwipePos || !airDownPos || swipeDirection !== "vertical") return;
	const dy = y - lastSwipePos.y;
	if (Math.abs(dy) > 2) {
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dy * .8)
		});
		lastSwipePos = {
			x,
			y
		};
	}
}
var neighborState = "IDLE";
var neighborDownTime = 0;
var neighborDownPos = null;
var neighborHoldTimer = null;
var neighborPointerId = null;
var NEIGHBOR_HOLD_DELAY = 250;
var NEIGHBOR_TAP_THRESHOLD = 200;
var NEIGHBOR_MOVE_THRESHOLD = 15;
function enterMiddleScrollMode() {
	neighborState = "MIDDLE_SCROLL";
	resetAirState();
	sendAirPadIntent({
		type: "pointer.down",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL started (sensors active)");
	getAirNeighborButton()?.classList.add("middle-scroll-active", "active");
	enterAirMove();
}
function exitMiddleScrollMode() {
	if (neighborState !== "MIDDLE_SCROLL") return;
	sendAirPadIntent({
		type: "pointer.up",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL ended");
	neighborState = "IDLE";
	resetAirState();
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
}
function resetNeighborState() {
	if (neighborHoldTimer !== null) {
		clearTimeout(neighborHoldTimer);
		neighborHoldTimer = null;
	}
	neighborDownPos = null;
	neighborState = "IDLE";
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
	resetAirState();
}
function initNeighborButton() {
	const neighborButton = getAirNeighborButton();
	if (!neighborButton) return;
	if (neighborPointerHandlersBound.has(neighborButton)) return;
	neighborPointerHandlersBound.add(neighborButton);
	neighborButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (neighborPointerId !== null && neighborPointerId !== e.pointerId) return;
		connectAirPadSession();
		if (checkIsAiModeActive()) return;
		neighborPointerId = e.pointerId;
		neighborButton.setPointerCapture(neighborPointerId);
		neighborDownTime = Date.now();
		neighborDownPos = {
			x: e.clientX,
			y: e.clientY
		};
		neighborState = "WAIT_TAP_OR_HOLD";
		neighborButton.classList.add("active");
		neighborHoldTimer = globalThis?.setTimeout?.(() => {
			neighborHoldTimer = null;
			if (neighborState === "WAIT_TAP_OR_HOLD") enterMiddleScrollMode();
		}, NEIGHBOR_HOLD_DELAY);
	});
	neighborButton.addEventListener("pointermove", (e) => {
		if (e.pointerId !== neighborPointerId || !neighborDownPos) return;
		e.preventDefault();
		if (neighborState === "WAIT_TAP_OR_HOLD") {
			const dx = e.clientX - neighborDownPos.x;
			const dy = e.clientY - neighborDownPos.y;
			if (Math.hypot(dx, dy) > NEIGHBOR_MOVE_THRESHOLD) {
				if (neighborHoldTimer !== null) {
					clearTimeout(neighborHoldTimer);
					neighborHoldTimer = null;
				}
			}
		}
	});
	neighborButton.addEventListener("pointerup", (e) => {
		if (e.pointerId !== neighborPointerId) return;
		e.preventDefault();
		const dt = Date.now() - neighborDownTime;
		if (neighborState === "MIDDLE_SCROLL") exitMiddleScrollMode();
		else if (neighborState === "WAIT_TAP_OR_HOLD" && dt < NEIGHBOR_TAP_THRESHOLD) {
			if (neighborDownPos) {
				const dx = e.clientX - neighborDownPos.x;
				const dy = e.clientY - neighborDownPos.y;
				if (Math.hypot(dx, dy) < NEIGHBOR_MOVE_THRESHOLD) {
					sendAirPadIntent({
						type: "pointer.click",
						button: "right"
					});
					log("Neighbor: tap → right-click (context menu)");
				}
			}
		}
		if (neighborPointerId !== null) {
			neighborButton.releasePointerCapture(neighborPointerId);
			neighborPointerId = null;
		}
		resetNeighborState();
	});
	neighborButton.addEventListener("pointercancel", (e) => {
		if (e?.pointerId === neighborPointerId || e?.pointerId == null) {
			if (neighborState === "MIDDLE_SCROLL") {
				sendAirPadIntent({
					type: "pointer.up",
					button: "middle"
				});
				log("Neighbor: middle-scroll cancelled");
			}
			if (neighborPointerId !== null) {
				neighborButton.releasePointerCapture(neighborPointerId);
				neighborPointerId = null;
			}
			resetNeighborState();
		}
	});
	neighborButton.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	log("Neighbor button initialized (tap: right-click, hold: middle-scroll via sensors)");
}
function initAirButton() {
	const airButton = getAirButton();
	if (!airButton) return;
	initNeighborButton();
	if (!airPointerDownBound.has(airButton)) {
		airPointerDownBound.add(airButton);
		airButton.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			if (airSurfacePointerId !== null && airSurfacePointerId !== e.pointerId) return;
			airSurfacePointerId = e.pointerId;
			airSurfaceCaptureTarget = airButton;
			airSurfaceCaptureTarget.setPointerCapture(airSurfacePointerId);
			airOnDown(e);
		});
	}
	if (!airSurfaceDocumentRoutingAttached) {
		airSurfaceDocumentRoutingAttached = true;
		const routingDoc = airButton.ownerDocument;
		routingDoc.addEventListener("pointermove", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			if (!airDownPos) return;
			if (checkIsAiModeActive()) return;
			handleAirSurfaceMove(e.clientX, e.clientY);
		});
		routingDoc.addEventListener("pointerup", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			if (airSurfacePointerId !== null && airSurfaceCaptureTarget) try {
				airSurfaceCaptureTarget.releasePointerCapture(airSurfacePointerId);
			} catch {}
			airSurfacePointerId = null;
			airSurfaceCaptureTarget = null;
			airOnUp(e);
		});
		routingDoc.addEventListener("pointercancel", (e) => {
			if (e?.pointerId !== airSurfacePointerId && e?.pointerId != null) return;
			if (airSurfacePointerId !== null && airSurfaceCaptureTarget) try {
				airSurfaceCaptureTarget.releasePointerCapture(airSurfacePointerId);
			} catch {}
			airSurfacePointerId = null;
			airSurfaceCaptureTarget = null;
			if (dragActive) {
				sendAirPadIntent({
					type: "pointer.up",
					button: "left"
				});
				dragActive = false;
				log("Air: drag cancelled (mouse up)");
			}
			resetAirState();
		});
	}
	log("Air button initialized");
}
//#endregion
//#region src/frontend/views/airpad/input/sensor/relative-orientation.ts
var relSensor = null;
var fallbackOrientationActive = false;
var fallbackHandler = null;
var lastQuat = null;
var smoothedDelta = vec3Zero();
var dynamicMaxStepPx = 60;
function resetRelativeOrientationRuntimeState() {
	lastQuat = null;
	smoothedDelta = vec3Zero();
	dynamicMaxStepPx = 60;
}
function stopRelativeOrientation() {
	try {
		if (relSensor) relSensor.stop?.();
	} catch {}
	relSensor = null;
	if (fallbackOrientationActive && fallbackHandler) globalThis.removeEventListener("deviceorientation", fallbackHandler);
	fallbackOrientationActive = false;
	fallbackHandler = null;
}
var quatNormalizeStable = (q, prev) => {
	const [x, y, z, w] = q;
	const len = Math.hypot(x, y, z, w) || 1;
	let nx = x / len, ny = y / len, nz = z / len, nw = w / len;
	if (prev) {
		if (nx * prev[0] + ny * prev[1] + nz * prev[2] + nw * prev[3] < 0) {
			nx = -nx;
			ny = -ny;
			nz = -nz;
			nw = -nw;
		}
	}
	return [
		nx,
		ny,
		nz,
		nw
	];
};
var quatConj = (q) => {
	const [x, y, z, w] = q;
	return [
		-x,
		-y,
		-z,
		w
	];
};
var quatMul = (a, b) => {
	const [ax, ay, az, aw] = a;
	const [bx, by, bz, bw] = b;
	return [
		aw * bx + ax * bw + ay * bz - az * by,
		aw * by - ax * bz + ay * bw + az * bx,
		aw * bz + ax * by - ay * bx + az * bw,
		aw * bw - ax * bx - ay * by - az * bz
	];
};
var quatDeltaToAxisAngle = (dq) => {
	const [x, y, z, w] = dq;
	const sinHalf = Math.hypot(x, y, z);
	const angle = 2 * Math.atan2(sinHalf, w || 1);
	if (sinHalf < 1e-6) return {
		x: 0,
		y: 0,
		z: 0
	};
	const inv = 1 / sinHalf;
	return {
		x: x * inv * angle,
		y: y * inv * angle,
		z: z * inv * angle
	};
};
function mapToPixelsRaw(movement) {
	const selected = vec3Select(movement, "az", "ay", "ax");
	const projected = vec3RotateXYByAngle(selected, selected.z * -1, 1);
	return {
		x: projected.x * -1 * 600,
		y: projected.y * -1 * 600,
		z: projected.z * -1 * 600
	};
}
function clampPxRadiusFromDeltaVec(deltaVec, dt) {
	const rawMapped = mapToPixelsRaw(deltaVec);
	const magPx = Math.hypot(rawMapped.x, rawMapped.y, rawMapped.z);
	const desired = Math.max(60, Math.min(800, magPx));
	const t = desired > dynamicMaxStepPx ? expSmoothing(dt, 6) : expSmoothing(dt, 14);
	dynamicMaxStepPx = lerp(dynamicMaxStepPx, desired, t);
	if (!Number.isFinite(dynamicMaxStepPx)) dynamicMaxStepPx = 60;
	dynamicMaxStepPx = Math.max(60, Math.min(800, dynamicMaxStepPx));
	return dynamicMaxStepPx;
}
function mapAndScale(movement, maxStepPx) {
	return vec3Clamp(mapToPixelsRaw(movement), maxStepPx);
}
function handleReading(quat, dt) {
	if (!quat || quat.length < 4) return vec3Zero();
	const curQuat = quatNormalizeStable([
		quat[0],
		quat[1],
		quat[2],
		quat[3]
	], lastQuat);
	if (!lastQuat) lastQuat = curQuat;
	const deltaQuat = quatMul(curQuat, quatConj(lastQuat));
	lastQuat = curQuat;
	const deltaVec = quatDeltaToAxisAngle(deltaQuat);
	const maxStepPx = clampPxRadiusFromDeltaVec(deltaVec, dt);
	const deltaPx = mapToPixelsRaw(deltaVec);
	const smoothFactor = clamp01(expSmoothing(dt, lerp(6, 24, clamp01((Math.hypot(deltaPx.x, deltaPx.y, deltaPx.z) - 60) / Math.max(1, 740)))) * clamp01(REL_ORIENT_SMOOTH));
	smoothedDelta = vec3Smooth(smoothedDelta, deltaVec, smoothFactor * .9);
	const maxStepRad = maxStepPx / Math.max(1e-6, Math.abs(600));
	smoothedDelta = vec3Clamp(smoothedDelta, Math.max(REL_ORIENT_DEADZONE, maxStepRad));
	const dz = {
		x: Math.abs(smoothedDelta.x) < .001 ? 0 : smoothedDelta.x,
		y: Math.abs(smoothedDelta.y) < .001 ? 0 : smoothedDelta.y,
		z: Math.abs(smoothedDelta.z) < .001 ? 0 : smoothedDelta.z
	};
	if (Math.abs(dz.x) < .001 && Math.abs(dz.y) < .001 && Math.abs(dz.z) < .001) return vec3Zero();
	const mapped = mapAndScale(dz, maxStepPx);
	if (vec3IsNearZero(mapped, .001)) return vec3Zero();
	return mapped;
}
function initRelativeOrientation() {
	stopRelativeOrientation();
	const startDeviceOrientationFallback = () => {
		if (fallbackOrientationActive) return;
		let lastTs = performance.now();
		let lastEuler = {
			x: 0,
			y: 0,
			z: 0
		};
		fallbackHandler = (event) => {
			const now = performance.now();
			const dt = Math.max(1e-5, (now - lastTs) / 1e3);
			lastTs = now;
			const alpha = Number(event.alpha ?? 0);
			const current = {
				x: Number(event.beta ?? 0),
				y: Number(event.gamma ?? 0),
				z: alpha
			};
			const deltaDeg = {
				x: current.x - lastEuler.x,
				y: current.y - lastEuler.y,
				z: current.z - lastEuler.z
			};
			lastEuler = current;
			const mapped = mapAndScale({
				x: deltaDeg.x * Math.PI / 180,
				y: deltaDeg.y * Math.PI / 180,
				z: deltaDeg.z * Math.PI / 180
			}, clampPxRadiusFromDeltaVec({
				x: deltaDeg.x * Math.PI / 180,
				y: deltaDeg.y * Math.PI / 180,
				z: deltaDeg.z * Math.PI / 180
			}, dt));
			if (getAirState && getAirState() !== "AIR_MOVE") return;
			if (!isAirPadSessionConnected()) return;
			if (aiModeActive) return;
			if (vec3IsNearZero(mapped, .001)) return;
			enqueueMotion(mapped.x, mapped.y, mapped.z);
		};
		globalThis.addEventListener("deviceorientation", fallbackHandler, { passive: true });
		fallbackOrientationActive = true;
		log("RelativeOrientation fallback active (deviceorientation)");
	};
	if (!window.RelativeOrientationSensor) {
		log("RelativeOrientationSensor API is not supported.");
		startDeviceOrientationFallback();
		return;
	}
	try {
		relSensor = new window.RelativeOrientationSensor({
			frequency: 120,
			referenceFrame: "device"
		});
	} catch (err) {
		log("Cannot create RelativeOrientationSensor: " + (err?.message || err));
		relSensor = null;
		return;
	}
	let lastTs = performance.now();
	relSensor.addEventListener("reading", () => {
		const now = performance.now();
		const dt = Math.max(1e-5, (now - lastTs) / 1e3);
		lastTs = now;
		const mapped = handleReading(relSensor.quaternion, dt);
		if (getAirState && getAirState() !== "AIR_MOVE") return;
		if (!isAirPadSessionConnected()) return;
		if (aiModeActive) return;
		enqueueMotion(mapped.x, mapped.y, mapped.z);
	});
	relSensor.addEventListener("error", (event) => {
		log("RelativeOrientationSensor error: " + (event?.error?.message || event?.message || event));
		startDeviceOrientationFallback();
	});
	try {
		relSensor.start();
		log("RelativeOrientationSensor started (120 Hz)");
	} catch (err) {
		log("RelativeOrientationSensor start failed: " + (err?.message || err));
	}
}
//#endregion
//#region src/frontend/views/airpad/ui/clipboard-toolbar.ts
var unsubscribeClipboardUpdate = null;
var boundCopyButtons = /* @__PURE__ */ new WeakSet();
var boundCutButtons = /* @__PURE__ */ new WeakSet();
var boundPasteButtons = /* @__PURE__ */ new WeakSet();
/** Call when Airpad unmounts so a fresh DOM gets listeners on next mount. */
function resetClipboardToolbarState() {
	if (unsubscribeClipboardUpdate) {
		unsubscribeClipboardUpdate();
		unsubscribeClipboardUpdate = null;
	}
}
function setPreview(text, meta) {
	const clipboardPreviewEl = getClipboardPreviewEl();
	if (!clipboardPreviewEl || typeof clipboardPreviewEl === "undefined") return;
	const source = meta?.source ? String(meta.source) : "pc";
	const safeText = String(text ?? "");
	if (!safeText) {
		clipboardPreviewEl.classList.remove("visible");
		clipboardPreviewEl.innerHTML = "";
		return;
	}
	clipboardPreviewEl.innerHTML = `
        <div class="meta">Clipboard (${source})</div>
        <div class="text"></div>
    `;
	const textEl = clipboardPreviewEl.querySelector(".text");
	if (textEl) textEl.textContent = safeText;
	clipboardPreviewEl.classList.add("visible");
}
async function readPhoneClipboardText() {
	const nav = navigator;
	if (nav?.clipboard?.readText) return await nav.clipboard.readText();
	return globalThis?.prompt?.("Вставь текст из телефона (clipboard readText недоступен):", "") || "";
}
async function tryWritePhoneClipboardText(text) {
	const nav = navigator;
	if (nav?.clipboard?.writeText) try {
		await nav.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
	return false;
}
function initClipboardToolbar() {
	const btnCut = getBtnCut();
	const btnCopy = getBtnCopy();
	const btnPaste = getBtnPaste();
	if (unsubscribeClipboardUpdate) unsubscribeClipboardUpdate();
	unsubscribeClipboardUpdate = onAirPadRemoteClipboardUpdate((text, meta) => setPreview(text, meta));
	requestAirPadClipboardRead().then((res) => {
		if (res?.ok && typeof res.text === "string") setPreview(res.text, { source: "pc" });
	});
	if (btnCopy && !boundCopyButtons.has(btnCopy)) {
		boundCopyButtons.add(btnCopy);
		btnCopy.addEventListener("click", async () => {
			const res = await requestAirPadClipboardCopy();
			if (!res?.ok) {
				log("Copy failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			if (!await tryWritePhoneClipboardText(text)) log("PC clipboard received. If phone clipboard write is blocked, copy from the preview line.");
		});
	}
	if (btnCut && !boundCutButtons.has(btnCut)) {
		boundCutButtons.add(btnCut);
		btnCut.addEventListener("click", async () => {
			const res = await requestAirPadClipboardCut();
			if (!res?.ok) {
				log("Cut failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			if (!await tryWritePhoneClipboardText(text)) log("PC clipboard received (after cut). If phone clipboard write is blocked, copy from the preview line.");
		});
	}
	if (btnPaste && !boundPasteButtons.has(btnPaste)) {
		boundPasteButtons.add(btnPaste);
		btnPaste.addEventListener("click", async () => {
			const text = await readPhoneClipboardText();
			if (!text) {
				log("Paste: phone clipboard is empty (or permission denied).");
				return;
			}
			const res = await requestAirPadClipboardPaste(text);
			if (!res?.ok) {
				log("Paste failed: " + (res?.error || "unknown"));
				return;
			}
			setPreview(text, { source: "phone" });
		});
	}
}
//#endregion
//#region src/frontend/views/airpad/ui/config-ui.ts
/** Marker for teardown; do not reuse generic `.config-overlay` alone (other features could add one). */
var AIRPAD_CONFIG_MARKER = "airpad-config-overlay";
/**
* Mount on the owner `document.body` (not `cw-shell-minimal` / task-tab host).
* Minimal shell uses `contain: strict` + `overflow: hidden`; children with `position: fixed`
* are still clipped to that host, so the dialog stays in the DOM but is not visible.
*/
function getConfigOverlayMountParent() {
	const doc = getAirpadOwnerDocument() ?? document;
	return doc.body ?? doc.documentElement ?? document.body;
}
/** Body-portaled overlay is not under `[data-shell][data-theme]`, so copy theme for SCSS tokens. */
function syncAirpadConfigOverlayShellTheme(overlay, doc) {
	const theme = (doc.querySelector("cw-shell-minimal[data-theme]") ?? doc.querySelector("[data-shell-system=\"task-tab\"][data-theme]") ?? doc.querySelector("[data-shell][data-theme]"))?.getAttribute("data-theme");
	if (theme === "light" || theme === "dark") overlay.setAttribute("data-theme", theme);
	else overlay.removeAttribute("data-theme");
}
function createConfigUI() {
	const overlay = (getAirpadOwnerDocument() ?? document).createElement("div");
	overlay.className = `config-overlay ${AIRPAD_CONFIG_MARKER}`;
	overlay.innerHTML = `
        <div class="config-panel">
            <h3>Airpad Configuration</h3>
            <div class="config-panel__body">
                <div class="config-group">
                    <label for="airpadQuickConnect"><strong>Where to connect</strong>:</label>
                    <input
                        type="text"
                        id="airpadQuickConnect"
                        name="airpad-quick-connect"
                        placeholder="L-192.168.0.110 or https://192.168.0.110:8443/"
                    />
                    <label for="airpadAuthPass"><strong>Auth pass token</strong> (optional):</label>
                    <input
                        type="password"
                        id="airpadAuthPass"
                        name="airpad-auth-pass"
                        autocomplete="off"
                        placeholder="If the remote requires a control token for input/mouse"
                    />
                    <div class="field-hint">
                        Target device ID or URL:port. Default identity and tokens stay in Settings → Server; set an auth pass here when the peer rejects control without it.
                    </div>
                </div>
            </div>

            <div class="config-actions">
                <button id="saveConfig" type="button" name="airpad-config-save">Save & Reconnect</button>
                <button id="cancelConfig" type="button" name="airpad-config-cancel">Cancel</button>
            </div>
        </div>
    `;
	const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
	const authPassInput = overlay.querySelector("#airpadAuthPass");
	const saveButton = overlay.querySelector("#saveConfig");
	const cancelButton = overlay.querySelector("#cancelConfig");
	quickConnectInput.value = getAirPadQuickConnectTarget();
	authPassInput.value = getAccessToken();
	const closeOverlay = () => {
		overlay.classList.remove("flex");
		overlay.style.display = "none";
		overlay.setAttribute("aria-hidden", "true");
	};
	saveButton.addEventListener("click", () => {
		setAirPadQuickConnectTarget(quickConnectInput.value);
		setAccessToken(authPassInput.value);
		reconnectAirPadSessionAfterConfigChange({ delayMs: 100 });
		closeOverlay();
	});
	cancelButton.addEventListener("click", closeOverlay);
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeOverlay();
	});
	return overlay;
}
function showConfigUI() {
	try {
		hideKeyboard();
	} catch {}
	const doc = getAirpadOwnerDocument() ?? document;
	const host = getConfigOverlayMountParent();
	let overlay = doc.querySelector(`.${AIRPAD_CONFIG_MARKER}`);
	if (overlay && overlay.parentElement !== host) {
		overlay.remove();
		overlay = null;
	}
	if (!overlay) {
		overlay = createConfigUI();
		host.appendChild(overlay);
	} else {
		const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
		const authPassInput = overlay.querySelector("#airpadAuthPass");
		if (quickConnectInput) quickConnectInput.value = getAirPadQuickConnectTarget();
		if (authPassInput) authPassInput.value = getAccessToken();
	}
	syncAirpadConfigOverlayShellTheme(overlay, doc);
	overlay.classList.add("flex");
	overlay.style.display = "flex";
	overlay.style.zIndex = "120000";
	overlay.setAttribute("aria-hidden", "false");
}
/** Remove portaled overlay when Airpad unmounts (avoids stale node on body/shell). */
function teardownAirpadConfigOverlay() {
	(getAirpadOwnerDocument() ?? document).querySelectorAll(`.${AIRPAD_CONFIG_MARKER}`).forEach((el) => el.remove());
}
//#endregion
//#region src/frontend/views/airpad/component/AirpadEventBus.ts
var AirpadEventBus = class {
	handlers = /* @__PURE__ */ new Map();
	on(event, handler) {
		const existing = this.handlers.get(event) ?? /* @__PURE__ */ new Set();
		existing.add(handler);
		this.handlers.set(event, existing);
		return () => this.off(event, handler);
	}
	off(event, handler) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		existing.delete(handler);
		if (existing.size === 0) this.handlers.delete(event);
	}
	emit(event, payload) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		for (const handler of existing) handler(payload);
	}
	clear() {
		this.handlers.clear();
	}
};
//#endregion
//#region src/frontend/views/airpad/component/CwAirpadActionRail.ts
var TAG$1 = "cw-airpad-action-rail";
var CwAirpadActionRailElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		this.addEventListener("click", (e) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (!this.contains(t)) return;
			if (t.closest("#btnConfig")) bus.emit("ui.config.open", void 0);
			if (t.closest("#btnAdminDoor")) bus.emit("ui.admin.open", void 0);
		}, {
			capture: true,
			signal
		});
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#clipboardToolbar")) return;
		this.innerHTML = `
            <div class="bottom-toolbar" id="clipboardToolbar" aria-label="Clipboard actions">
                <button type="button" id="btnCut" name="airpad-clipboard-cut" class="toolbar-btn" aria-label="Cut (Ctrl+X)">✂️</button>
                <button type="button" id="btnCopy" name="airpad-clipboard-copy" class="toolbar-btn" aria-label="Copy (Ctrl+C)">📋</button>
                <button type="button" id="btnPaste" name="airpad-clipboard-paste" class="toolbar-btn" aria-label="Paste (Ctrl+V)">📥</button>
                <button type="button" id="btnConnect" name="airpad-ws-connect" class="toolbar-btn connect-fab connect-fab--ws">WS ↔</button>
                <button type="button" id="btnAdminDoor" name="airpad-admin-door" class="toolbar-btn toolbar-btn--admin-door" aria-label="Open server admin (HTTPS)" title="Server admin (HTTPS :8443)">ADM</button>
                <button type="button" id="btnConfig" name="airpad-config" class="toolbar-btn" aria-label="Configuration" title="Configuration">⚙️</button>
            </div>
            <div id="clipboardPreview" class="clipboard-preview" aria-live="polite"></div>
        `;
	}
};
function ensureCwAirpadActionRailDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG$1)) return;
	ce.define(TAG$1, CwAirpadActionRailElement);
}
//#endregion
//#region src/frontend/views/airpad/component/CwAirpadSidePanels.ts
var TAG = "cw-airpad-side-panels";
var CwAirpadSidePanelsElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		const byId = (id) => this.querySelector(`#${CSS.escape(id)}`);
		const hookOverlay = (toggleId, overlayId, closeId) => {
			const overlay = byId(overlayId);
			const toggle = byId(toggleId);
			const close = byId(closeId);
			if (!overlay || !toggle) return;
			const openOverlay = () => {
				overlay.classList.add("open");
				overlay.setAttribute("aria-hidden", "false");
				toggle.setAttribute("aria-expanded", "true");
			};
			const closeOverlay = () => {
				overlay.classList.remove("open");
				overlay.setAttribute("aria-hidden", "true");
				toggle.setAttribute("aria-expanded", "false");
			};
			toggle.addEventListener("click", openOverlay, { signal });
			close?.addEventListener("click", closeOverlay, { signal });
			overlay.addEventListener("click", (e) => {
				if (e.target === overlay) closeOverlay();
			}, { signal });
			this.addEventListener("keydown", (e) => {
				if (e.key === "Escape" && overlay.classList.contains("open")) closeOverlay();
			}, {
				capture: true,
				signal
			});
		};
		hookOverlay("logToggle", "logOverlay", "logClose");
		hookOverlay("hintToggle", "hintOverlay", "hintClose");
		byId("btnReload")?.addEventListener("click", () => bus.emit("ui.reload.request", void 0), { signal });
		byId("btnMotionReset")?.addEventListener("click", () => bus.emit("ui.motion.reset", void 0), { signal });
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#logOverlay")) return;
		this.innerHTML = `
            <div class="side-actions-row" role="group" aria-label="Panels">
                <button type="button" id="hintToggle" name="airpad-hints-toggle" class="side-log-toggle side-hint-toggle" aria-controls="hintOverlay" aria-expanded="false">Hints</button>
                <button type="button" id="logToggle" name="airpad-log-toggle" class="side-log-toggle" aria-controls="logOverlay" aria-expanded="false">Логи</button>
                <button type="button" id="btnMotionReset" name="airpad-motion-reset" class="side-log-toggle side-fix-toggle" aria-label="Reset motion calibration">Fix</button>
                <button type="button" id="btnReload" name="airpad-reload" class="side-log-toggle side-reload-toggle" aria-label="Reload">Reload</button>
            </div>

            <div id="logOverlay" class="log-overlay" aria-hidden="true">
                <div class="log-panel">
                    <div class="log-overlay-header">
                        <span>Журнал соединения</span>
                        <button type="button" id="logClose" name="airpad-log-close" class="ghost-btn" aria-label="Закрыть логи">Закрыть</button>
                    </div>
                    <div id="logContainer" class="log-container"></div>
                </div>
            </div>

            <div id="hintOverlay" class="log-overlay hint-overlay" aria-hidden="true">
                <div class="log-panel hint-panel">
                    <div class="log-overlay-header">
                        <span>Подсказки AirPad</span>
                        <button type="button" id="hintClose" name="airpad-hint-close" class="ghost-btn" aria-label="Закрыть подсказки">Закрыть</button>
                    </div>
                    <section class="hint hint-modal-content" id="hintPanel" aria-label="Airpad quick help">
                        <details class="hint-group" data-hint-group>
                            <summary>Жесты Air-кнопки</summary>
                            <ul><li>Короткий тап — клик.</li><li>Удержание &gt; 100ms — режим air-мыши.</li><li>Свайп вверх/вниз по кнопке — скролл.</li><li>Свайп влево/вправо — жест.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>AI-кнопка</summary>
                            <ul><li>Нажми и держи — идёт распознавание речи.</li><li>Отпусти — команда уйдёт в endpoint voice pipeline.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>Виртуальная клавиатура</summary>
                            <ul><li>Открой кнопкой ⌨️ на нижней панели.</li><li>Поддерживает текст, эмодзи и спецсимволы.</li><li>Передаёт ввод в бинарном формате.</li></ul>
                        </details>
                    </section>
                </div>
            </div>
        `;
	}
};
function ensureCwAirpadSidePanelsDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG)) return;
	ce.define(TAG, CwAirpadSidePanelsElement);
}
//#endregion
//#region src/frontend/views/airpad/main.ts
/**
* AirPad frontend entrypoint.
*
* This module owns the mount/unmount lifecycle for the AirPad view, including
* DOM replacement, transient controller wiring, cross-tab config sync, and the
* teardown path required for shell remounts.
*/
var main_exports = /* @__PURE__ */ __exportAll({
	default: () => mountAirpad,
	unmountAirpadRuntime: () => unmountAirpadRuntime
});
var unsubscribeWsKeyboardSync = null;
var airpadInitToken = 0;
var airpadInitAbort = null;
var airpadCrossTabUnsub = null;
/**
* Release every side effect created by `mountAirpad()`.
*
* WHY: AirPad can be mounted repeatedly by different shells or navigation
* flows. The view keeps process-local listeners and UI overlays, so remounting
* without explicit cleanup would duplicate handlers and leave stale state
* attached to the previous DOM tree.
*/
function unmountAirpadRuntime() {
	teardownKeyboardDismissListeners();
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	airpadInitAbort = null;
	airpadCrossTabUnsub?.();
	airpadCrossTabUnsub = null;
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = null;
	resetClipboardToolbarState();
	teardownAirpadConfigOverlay();
	setAirpadDomRoot(null);
	setRemoteKeyboardEnabled(false);
	stopRelativeOrientation();
}
/**
* Build the AirPad DOM and hand control to the async runtime initializer.
*
* INVARIANT: each mount gets a fresh abort signal and token so slow async work
* from an older mount cannot finish against a newer DOM instance.
*/
async function mountAirpad(mountElement) {
	console.log("[Airpad] Mounting airpad app...");
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	const initController = new AbortController();
	airpadInitAbort = initController;
	/** Stable for this mount — do not read `airpadInitAbort.signal` after `await`: unmount may set `airpadInitAbort` to null. */
	const initSignal = initController.signal;
	const currentInitToken = airpadInitToken;
	loadAsAdopted(main_default);
	ensureCwAirpadActionRailDefined();
	ensureCwAirpadSidePanelsDefined();
	let appContainer = mountElement ?? document.body.querySelector("#app") ?? document.body;
	if (!appContainer) {
		appContainer = document.createElement("div");
		appContainer.id = "app";
	}
	appContainer.replaceChildren(H`
        <div class="container">
            <header class="hero">
                <div class="status-container">
                    <div class="status-bar">
                        <div class="status-item">
                            WS:
                            <span id="wsStatus" class="value ws-status-bad">disconnected</span>
                        </div>
                        <div class="status-item">
                            Air:
                            <span id="airStatus" class="value">IDLE</span>
                        </div>
                        <div class="status-item">
                            AI:
                            <span id="aiStatus" class="value">idle</span>
                        </div>
                        <div class="status-item">
                            VK:
                            <span id="vkStatus" class="value">overlay:off</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="stage">
                <div class="ai-block">
                    <div id="aiButton" name="airpad-ai" class="big-button ai" data-no-virtual-keyboard="true">
                        AI
                    </div>
                    <div class="label">Голосовой ассистент (удерживай для записи)</div>
                </div>

                <div class="air-block">
                    <div class="air-row">
                    <button type="button" id="airButton" name="airpad-air" class="big-button air" data-no-virtual-keyboard="true">
                        Air
                    </button>
                    <button type="button" id="airNeighborButton" name="airpad-neighbor-act" data-no-virtual-keyboard="true"
                        class="neighbor-button">Act</button>
                    </div>
                    <div class="label">Air‑трекбол/курсор и жесты</div>
                </div>
            </div>
            <div id="voiceText" class="voice-line"></div>
        </div>

        <cw-airpad-side-panels></cw-airpad-side-panels>
        <cw-airpad-action-rail></cw-airpad-action-rail>
    `);
	setAirpadDomRoot(appContainer);
	await waitForDomPaint();
	if (initSignal.aborted || currentInitToken !== airpadInitToken) {
		if (getAirpadDomRoot() === appContainer) setAirpadDomRoot(null);
		return;
	}
	await initAirpadApp(currentInitToken, initSignal, appContainer);
}
/**
* Wire controllers, UI components, and runtime services after the DOM exists.
*
* AI-READ: this function assumes the markup inserted by `mountAirpad()` is now
* stable in the document. Querying or binding before `waitForDomPaint()` can
* miss nodes in some shell/layout combinations.
*/
async function initAirpadApp(initToken, signal, domMountRoot) {
	const root = domMountRoot;
	if (!root) {
		console.warn("[Airpad] initAirpadApp: no mount root");
		return;
	}
	const byId = (id) => queryAirpad(`#${CSS.escape(id)}`);
	const bus = new AirpadEventBus();
	const sidePanels = root.querySelector("cw-airpad-side-panels");
	const actionRail = root.querySelector("cw-airpad-action-rail");
	sidePanels?.connect(bus);
	actionRail?.connect(bus);
	signal.addEventListener("abort", () => {
		sidePanels?.disconnect();
		actionRail?.disconnect();
		bus.clear();
	}, { once: true });
	const bindBus = (event, handler) => {
		const off = bus.on(event, handler);
		signal.addEventListener("abort", off, { once: true });
	};
	/** Reset all motion-calibration state so the next gesture starts from a clean baseline. */
	function resetMotionRuntime() {
		resetMotionAccum();
		resetMotionBaseline();
		resetRelativeOrientationRuntimeState();
		log("Motion runtime state reset (recalibrated).");
	}
	bindBus("ui.config.open", () => showConfigUI());
	bindBus("ui.motion.reset", () => resetMotionRuntime());
	bindBus("ui.reload.request", () => {
		try {
			globalThis?.location?.reload?.();
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.navigate?.("airpad");
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.reload?.();
		} catch (e) {
			console.error(e);
		}
	});
	/**
	* Collapse hint groups on tighter screens so the control surface remains
	* usable without hiding the hints entirely.
	*/
	function initAdaptiveHintPanel() {
		const hintRoot = byId("hintPanel");
		if (!hintRoot) return;
		const groups = Array.from(hintRoot.querySelectorAll("[data-hint-group]"));
		if (groups.length === 0) return;
		const compactMedia = globalThis.matchMedia("(max-width: 980px), (max-height: 860px)");
		const applyHintDensity = () => {
			const compact = compactMedia.matches;
			groups.forEach((group) => {
				if (compact) group.open = false;
			});
		};
		applyHintDensity();
		compactMedia.addEventListener?.("change", applyHintDensity, { signal });
	}
	const safeToString = (value) => {
		if (value instanceof Error) return `${value.name}: ${value.message}`;
		if (typeof value === "string") return value;
		return String(value);
	};
	const runInitializer = (label, initializer) => {
		try {
			initializer();
		} catch (error) {
			log(`Airpad init [${label}] failed: ${safeToString(error)}`);
		}
	};
	const aborted = () => Boolean(signal.aborted || initToken !== void 0 && initToken !== airpadInitToken);
	if (aborted()) return;
	reloadAirpadRemoteConfigFromStorage();
	airpadCrossTabUnsub ??= attachAirpadCrossTabConfigSync();
	runInitializer("websocket button", () => initAirPadSessionTransport(getBtnConnect()));
	runInitializer("speech", () => initSpeechRecognition());
	runInitializer("AI button", () => initAiButton());
	runInitializer("Air button", () => initAirButton());
	runInitializer("virtual keyboard", () => initVirtualKeyboard(root));
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = onAirPadSessionConnectionChange((connected) => {
		setRemoteKeyboardEnabled(connected);
	});
	runInitializer("clipboard toolbar", () => initClipboardToolbar());
	runInitializer("adaptive hint", () => initAdaptiveHintPanel());
	log("Готово. Нажми \"WS Connect\", затем используй Air/AI кнопки.");
	log("Движение мыши основано только на Gyroscope API (повороты телефона).");
	const startSensors = () => {
		if (aborted()) return;
		runInitializer("relative orientation", () => initRelativeOrientation());
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(startSensors, { timeout: 2e3 });
	else globalThis.setTimeout(startSensors, 0);
	const deferServiceWorker = () => {
		if (aborted()) return;
		if (globalThis.location?.protocol === "chrome-extension:") return;
		initServiceWorker({
			immediate: false,
			onRegistered() {
				log("PWA: service worker registered");
			},
			onRegisterError(error) {
				log("PWA: service worker register error: " + (error?.message ?? String(error)));
			}
		}).catch((err) => {
			log("PWA: service worker disabled: " + safeToString(err));
		});
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(deferServiceWorker, { timeout: 6e3 });
	else globalThis.setTimeout(deferServiceWorker, 2500);
}
//#endregion
export { disconnectAirPadSession as a, waitForDomPaint as i, unmountAirpadRuntime as n, setRemoteKeyboardEnabled as r, main_exports as t };
