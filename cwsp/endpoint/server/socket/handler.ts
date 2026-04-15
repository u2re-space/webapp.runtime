import {
    resolveEndpointTransportPreference,
    type EndpointIdPolicyMap,
    type EndpointTransportMode
} from "@utils/endpoint-policy.ts";
import { parseBinaryEnvelope } from "@utils/binary.ts";
import type { Packet } from "./types.ts";
import { inferWhatFromLegacyType } from "./packet.ts";
import { handleAirpadAction, handleAirpadAsk } from "./handlers/airpad.ts";
import { handleClipboardAction, handleClipboardAsk } from "./handlers/clipboard.ts";
import { handleAiAction, handleAiAsk } from "./handlers/ai.ts";
import { SELF_DATA } from "./coordinator.ts";


type TransportSender = (payload: Record<string, unknown>) => unknown | Promise<unknown>;

type ServerV2SocketTransports = {
    bridge?: TransportSender;
    socketio?: TransportSender;
    ws?: TransportSender;
};

type CreateSocketProtocolHandlerOptions = {
    policyMap: EndpointIdPolicyMap;
    transports?: ServerV2SocketTransports;
};

type ServerV2SocketFrame = {
    binary?: boolean;
    from?: string;
    payload?: unknown;
    target?: string;
    transport?: EndpointTransportMode | "bridge" | "auto";
    type?: string;
};

// post-handler for act
export const makePostHandler = (op, what, payload) => { 
    if (op == "act") {
        switch (what) {
            case "clipboard:read": {
                const withResolvers = Promise.withResolvers();
                return {
                    promise: withResolvers.promise,
                    resolve: (result: any) => {
                        // TODO: locally clipboard write
                        withResolvers.resolve?.({ result });
                        return result;
                    },
                    reject: (error: any) => {
                        withResolvers.reject?.({ error });
                        return error;
                    }
                }
            }
            default: return Promise.withResolvers();
        }
    }
    return Promise.withResolvers();
}

const isObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === "object" && !Array.isArray(value);
};

const normalizeNestedWhat = (value: unknown): string => {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) return "";
    if (raw.includes(":")) return raw;
    if (raw.startsWith("text/") || raw === "application/json" || raw === "application/octet-stream") {
        return "clipboard:update";
    }
    if (raw === "clipboard") return "clipboard:update";
    if (raw === "dispatch") return "network:dispatch";
    return raw;
};

const extractDispatchLikeAction = (what: string, payload: unknown) => {
    const normalizedWhat = String(what || "").trim().toLowerCase();
    const isDispatchLike = [
        "dispatch",
        "network:dispatch",
        "network.dispatch",
        "http:dispatch",
        "request:dispatch"
    ].includes(normalizedWhat);
    if (!isDispatchLike || !isObject(payload)) return null;

    const nested = isObject(payload.payload)
        ? payload.payload
        : isObject(payload.data)
          ? payload.data
          : payload;
    if (!isObject(nested)) return null;

    const nestedWhat = normalizeNestedWhat(
        nested.what || nested.op || nested.action || nested.type || payload.what || payload.op
    );
    if (!nestedWhat) return null;

    const nestedPayload = nested.payload ?? nested.data ?? nested.body ?? nested;
    const nestedOpRaw = String(nested.op || payload.op || "").trim().toLowerCase();
    const nestedOp = nestedOpRaw === "ask" || nestedOpRaw === "request"
        ? "ask"
        : nestedOpRaw === "result" || nestedOpRaw === "response" || nestedOpRaw === "resolve" || nestedOpRaw === "error"
          ? "result"
          : "act";
    return {
        what: nestedWhat,
        payload: nestedPayload,
        op: nestedOp as "ask" | "act" | "result"
    };
};

const normalizeFrame = async (frame: ServerV2SocketFrame) => {
    const payload = frame?.payload;
    if (payload instanceof Uint8Array || payload instanceof ArrayBuffer || ArrayBuffer.isView(payload)) {
        const binary = await parseBinaryEnvelope(payload as ArrayBuffer | ArrayBufferView);
        return {
            ...frame,
            binary: true,
            parsedBinary: binary,
            type: frame?.type || "binary"
        };
    }
    return {
        ...frame,
        binary: frame?.binary === true,
        type: frame?.type || "dispatch"
    };
};

const preferredTransportsFor = (
    policyMap: EndpointIdPolicyMap,
    sourceId: string,
    targetId: string
): EndpointTransportMode[] => {
    if (!sourceId || !targetId) {
        return ["ws", "http", "tcp", "socketio"];
    }
    return resolveEndpointTransportPreference(sourceId, targetId, policyMap).transports;
};

const pickTransportSender = (
    transports: ServerV2SocketTransports,
    requestedTransport: ServerV2SocketFrame["transport"],
    preferred: EndpointTransportMode[]
): TransportSender | undefined => {
    const explicit = requestedTransport && requestedTransport !== "auto" ? transports[requestedTransport] : undefined;
    if (explicit) return explicit;
    for (const transport of preferred) {
        if (transport === "ws" && transports.ws) return transports.ws;
        if (transport === "socketio" && transports.socketio) return transports.socketio;
        if (transport === "http" || transport === "tcp") continue;
        const sender = transports[transport];
        if (sender) return sender;
    }
    return transports.ws || transports.bridge || transports.socketio;
};

export const createSocketProtocolHandler = (options: CreateSocketProtocolHandlerOptions) => {
    const transports = options.transports || {};

    return {
        async dispatch(frame: ServerV2SocketFrame) {
            const normalized = await normalizeFrame(frame);
            const from = String(normalized?.from || "").trim().toLowerCase();
            const target = String(normalized?.target || "").trim().toLowerCase();
            const preferred = preferredTransportsFor(options.policyMap, from, target);
            const sender = pickTransportSender(transports, normalized.transport, preferred);
            if (!sender) {
                return {
                    ok: false,
                    reason: "no-transport",
                    selected: null,
                    transports: preferred
                };
            }

            await sender({
                ...normalized,
                from,
                target,
                transports: preferred
            });

            return {
                ok: true,
                reason: "dispatched",
                selected:
                    sender === transports.ws
                        ? "ws"
                        : sender === transports.socketio
                          ? "socketio"
                          : sender === transports.bridge
                            ? "bridge"
                            : "custom",
                transports: preferred
            };
        },
        normalizeFrame,
        policyMap: options.policyMap,
        transports
    };
};

//
export const handleAct = async (what: string, payload: any, packet: Packet, selfId: string) => {
    const normalizedWhat = normalizeNestedWhat(what);
    if (normalizedWhat && normalizedWhat !== what) {
        return handleAct(normalizedWhat, payload, packet, selfId);
    }
    const unwrapped = extractDispatchLikeAction(what, payload);
    if (unwrapped) {
        if (unwrapped.what === what && unwrapped.payload === payload) {
            // Avoid recursion on malformed self-referential dispatch frames.
            return {
                ok: false,
                handled: false,
                reason: "dispatch-unwrapped-self",
                what
            };
        }
        if (unwrapped.op === "result") {
            // Dispatch wrappers can carry response/resolve payloads from legacy peers.
            // Treat them as already-resolved ack payload instead of re-routing as act.
            return unwrapped.payload;
        }
        if (unwrapped.op === "ask" || unwrapped.what.endsWith(":isready")) {
            return handleAsk(unwrapped.what, unwrapped.payload, packet, selfId);
        }
        return handleAct(unwrapped.what, unwrapped.payload, packet, selfId);
    }
    const airpadResult = await handleAirpadAction(what, payload, packet);
    if (airpadResult !== null) return airpadResult;
    const clipboardResult = await handleClipboardAction(what, payload, packet);
    if (clipboardResult !== null) return clipboardResult;
    const aiResult = await handleAiAction(what, payload, packet);
    if (aiResult !== null) return aiResult;
    return {
        ok: false,
        handled: false,
        reason: "unhandled-act",
        what
    };
}

//
export const handleAsk = async (what: string, payload: any, packet: Packet, selfId: string) => {
    const normalizedWhat = normalizeNestedWhat(what);
    if (normalizedWhat && normalizedWhat !== what) {
        return handleAsk(normalizedWhat, payload, packet, selfId);
    }
    const unwrapped = extractDispatchLikeAction(what, payload);
    if (unwrapped) {
        if (unwrapped.what === what && unwrapped.payload === payload) {
            return {
                ok: false,
                handled: false,
                reason: "dispatch-unwrapped-self",
                what
            };
        }
        if (unwrapped.op === "result") {
            return unwrapped.payload;
        }
        return handleAsk(unwrapped.what, unwrapped.payload, packet, selfId);
    }
    const airpadResult = await handleAirpadAsk(what, payload, packet);
    if (airpadResult !== null) return airpadResult;
    const clipboardResult = await handleClipboardAsk(what, payload, packet);
    if (clipboardResult !== null) return clipboardResult;
    const aiResult = await handleAiAsk(what, payload, packet);
    if (aiResult !== null) return aiResult;
    if (what == "token") {
        return Promise.resolve(getAssociatedToken(selfId));
    }
    return {
        ok: false,
        handled: false,
        reason: "unhandled-ask",
        what
    };
}

const getAssociatedToken = async (selfId: string) => {
    return {
        id: selfId,
        token: SELF_DATA.ASSOCIATED_TOKEN
    };
}