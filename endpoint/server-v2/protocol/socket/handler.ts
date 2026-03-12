import {
    resolveEndpointTransportPreference,
    type EndpointIdPolicyMap,
    type EndpointTransportMode
} from "../../../server/network/stack/endpoint-policy.ts";
import { parseBinaryEnvelope } from "../../utils/binary.ts";
import type { Packet } from "./types.ts";
import { handleAirpadAction, handleAirpadAsk } from "./handlers/airpad.ts";
import { handleClipboardAction, handleClipboardAsk } from "./handlers/clipboard.ts";
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
        return ["ws", "socketio", "http", "tcp"];
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
        if (transport === "http" || transport === "tcp") continue;
        const sender = transports[transport];
        if (sender) return sender;
    }
    return transports.ws || transports.socketio || transports.bridge;
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
export const handleAct = (what: string, payload: any, packet: Packet, selfId: string) => {
    const airpadResult = handleAirpadAction(what, payload, packet);
    if (airpadResult) return airpadResult;
    const clipboardResult = handleClipboardAction(what, payload, packet);
    if (clipboardResult) return clipboardResult;
    return packet;
}

//
export const handleAsk = (what: string, payload: any, packet: Packet, selfId: string) => {
    const airpadResult = handleAirpadAsk(what, payload, packet);
    if (airpadResult) return airpadResult;
    const clipboardResult = handleClipboardAsk(what, payload, packet);
    if (clipboardResult) return clipboardResult;
    if (what == "token") {
        return Promise.resolve(getAssociatedToken(selfId));
    }
    return packet;
}

const getAssociatedToken = async (selfId: string) => {
    return SELF_DATA.ASSOCIATED_TOKEN;
}