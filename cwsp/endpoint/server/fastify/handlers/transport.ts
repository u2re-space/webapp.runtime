import type { FastifyInstance, FastifyRequest } from "fastify";
import { readFileSync } from "node:fs";
import path from "node:path";

import { verifyUser } from "../routers/auth/users.ts";
import type { ClipboardAccess } from "@inputs/access/clipboard.ts";
import { buildClipboardBroadcastPayload, normalizeClipboardText } from "../../utils/routes.ts";
import {
    setBroadcasting as setLegacyClipboardBroadcasting,
    writeClipboard as writeLegacyClipboard
} from "../../io/clipboard.ts";
import { normalizeEndpointPolicies, resolveEndpointIdPolicyStrict } from "../../utils/endpoint-policy.ts";
import { CONFIG_DIR } from "../../utils/paths.ts";
import { ServerV2SocketRuntime } from "server/socket/runtime.ts";

const TRANSPORT_HANDLERS_KEY = Symbol.for("cws.serverV2.transportHandlers");
const RAW_CLIENTS_CONFIG_PATH = path.join(CONFIG_DIR, "clients.json");

const normalizeString = (value: unknown): string => String(value || "").trim();
const normalizeToken = (value: unknown): string => String(value || "").trim().toLowerCase();
const VERB_OPS = new Set(["ask", "act", "resolve", "result", "error", "signal", "request", "response", "redirect", "notify"]);

const resolveDispatchOp = (value: unknown): string => {
    const op = normalizeString(value).toLowerCase();
    if (!op) return "act";
    if (op === "request") return "ask";
    if (op === "response") return "result";
    if (op === "signal" || op === "notify" || op === "redirect") return "act";
    if (VERB_OPS.has(op)) return op;
    return "act";
};

const loadEndpointPolicies = () => {
    try {
        const raw = JSON.parse(readFileSync(RAW_CLIENTS_CONFIG_PATH, "utf8")) as Record<string, unknown>;
        return normalizeEndpointPolicies(raw);
    } catch {
        return normalizeEndpointPolicies({});
    }
};

const resolvePolicyTokens = (tokens: unknown[]): string[] => {
    const out = new Set<string>();
    for (const entry of tokens) {
        const raw = String(entry || "").trim();
        if (!raw) continue;
        if (raw === "*") {
            out.add("*");
            continue;
        }
        if (raw.startsWith("inline:")) {
            out.add(normalizeToken(raw.slice("inline:".length)));
            continue;
        }
        if (raw.startsWith("token:")) {
            out.add(normalizeToken(raw.slice("token:".length)));
            continue;
        }
        if (raw.startsWith("env:")) {
            const envValue = normalizeToken(process.env[raw.slice("env:".length).trim()]);
            if (envValue) out.add(envValue);
            continue;
        }
        out.add(normalizeToken(raw));
    }
    return Array.from(out).filter(Boolean);
};

const verifyEndpointPolicyUser = (policies: ReturnType<typeof normalizeEndpointPolicies>, userId: string, userKey: string) => {
    const normalizedUserId = normalizeString(userId);
    const normalizedUserKey = normalizeToken(userKey);
    if (!normalizedUserId || !normalizedUserKey) return null;

    const policy = resolveEndpointIdPolicyStrict(policies, normalizedUserId);
    const policyTokens = resolvePolicyTokens(Array.isArray(policy?.tokens) ? policy.tokens : []);
    const runtimeTokens = [
        process.env.CWS_ASSOCIATED_TOKEN,
        process.env.CWS_BRIDGE_USER_KEY,
        process.env.CWS_UPSTREAM_USER_KEY
    ]
        .map((value) => normalizeToken(value))
        .filter(Boolean);
    const acceptedTokens = new Set([...policyTokens, ...runtimeTokens]);
    if (!acceptedTokens.size) return null;
    if (!acceptedTokens.has("*") && !acceptedTokens.has(normalizedUserKey)) return null;

    return {
        userId: normalizedUserId,
        userKeyHash: "endpoint-policy",
        encrypt: false,
        createdAt: 0
    };
};

const normalizeTargets = (body: Record<string, unknown>): string[] => {
    const targets = new Set<string>();
    const append = (value: unknown) => {
        const normalized = normalizeString(value);
        if (normalized) targets.add(normalized);
    };
    append(body.target);
    append(body.targetId);
    append(body.targetDeviceId);
    append(body.deviceId);
    append(body.peerId);
    if (Array.isArray(body.targets)) {
        for (const entry of body.targets) append(entry);
    }
    return Array.from(targets);
};

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const resolveDispatchType = (body: Record<string, unknown>, fallback = "dispatch"): string => {
    return resolveActionType(body, fallback);
};

const resolveActionType = (body: Record<string, unknown>, fallback = "dispatch"): string => {
    const op = normalizeString(body.op || "");
    const opAsType = op && !VERB_OPS.has(op.toLowerCase()) ? op : "";
    return normalizeString(body.what || body.type || body.action || opAsType || fallback) || fallback;
};

const resolveClipboardPayload = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const record = asRecord(value);
        const text = normalizeClipboardText(record);
        if (text) {
            return {
                ...record,
                text
            };
        }
        return record;
    }
    const text = normalizeClipboardText(value);
    return text ? { text } : {};
};

const resolveDispatchPayload = (body: Record<string, unknown>, type: string): unknown => {
    const directPayload = body.payload ?? body.data;
    if (type.startsWith("airpad:")) {
        const directRecord = asRecord(directPayload);
        if (
            Object.keys(directRecord).length > 0 &&
            (typeof directRecord.op === "string" || Array.isArray(directRecord.params) || directRecord.data !== undefined)
        ) {
            return directRecord;
        }
        const params = Array.isArray(body.params) ? body.params : [];
        const opFromParams = params.length ? normalizeString(params[0]) : "";
        const op = normalizeString(body.action || body.kind || body.subtype || opFromParams);
        return {
            op,
            params,
            data: directPayload ?? body.body ?? {}
        };
    }
    if (directPayload != null) {
        return type.startsWith("clipboard:") || type.startsWith("airpad:clipboard:")
            ? resolveClipboardPayload(directPayload)
            : directPayload;
    }
    if (Array.isArray(body.params) && body.params.length > 0) {
        return body.params;
    }
    if (type.startsWith("clipboard:") || type.startsWith("airpad:clipboard:")) {
        const clipboardPayload = resolveClipboardPayload(body.body ?? body);
        if (Object.keys(clipboardPayload).length > 0) return clipboardPayload;
    }
    return body.body ?? body;
};

const verifyRequestUser = async (policies: ReturnType<typeof normalizeEndpointPolicies>, body: Record<string, unknown>) => {
    const userId = normalizeString(body.userId);
    const userKey = normalizeString(body.userKey);
    if (!userId || !userKey) return { ok: false as const, error: "Missing credentials" };
    const record = await verifyUser(userId, userKey);
    if (!record) {
        const endpointRecord = verifyEndpointPolicyUser(policies, userId, userKey);
        if (!endpointRecord) return { ok: false as const, error: "Invalid credentials" };
        return { ok: true as const, userId, userKey, record: endpointRecord };
    }
    return { ok: true as const, userId, userKey, record };
};

const forwardHttpRequest = async (entry: Record<string, unknown>) => {
    const url = normalizeString(entry.url);
    if (!url) return { ok: false, error: "No URL" };
    try {
        const response = await fetch(url, {
            method: normalizeString(entry.method || "POST") || "POST",
            headers: asRecord(entry.headers) as HeadersInit,
            body: typeof entry.body === "string" ? entry.body : entry.body == null ? null : JSON.stringify(entry.body)
        });
        return {
            ok: response.ok,
            status: response.status,
            target: url,
            data: await response.text()
        };
    } catch (error) {
        return {
            ok: false,
            target: url,
            error: String(error)
        };
    }
};

export const registerTransportHttpHandlers = async (
    app: FastifyInstance,
    options: {
        clipboard: ClipboardAccess;
        sockets: ServerV2SocketRuntime;
        selfId: string;
        endpointPolicies?: Record<string, unknown>;
    }
): Promise<void> => {
    if ((app as any)[TRANSPORT_HANDLERS_KEY]) return;
    (app as any)[TRANSPORT_HANDLERS_KEY] = true;

    const { clipboard, sockets, selfId } = options;
    const endpointPolicies = normalizeEndpointPolicies(
        options.endpointPolicies && Object.keys(options.endpointPolicies).length > 0
            ? options.endpointPolicies
            : loadEndpointPolicies()
    );

    app.get("/clipboard", async (_request, reply) => {
        try {
            const text = normalizeString(await clipboard.read());
            return reply.send({
                ok: Boolean(text),
                ready: true,
                clipboard: text ? { text } : {}
            });
        } catch (error) {
            return reply.code(500).send({ ok: false, error: String(error) });
        }
    });

    app.post("/clipboard", async (request: FastifyRequest<{ Body: Record<string, unknown> }>, reply) => {
        const body = asRecord(request.body);
        const text = normalizeClipboardText(body);
        if (!text) {
            return reply.code(400).send({ ok: false, error: "No text provided" });
        }

        const relayPayload = buildClipboardBroadcastPayload(app, body, text, request);
        if (relayPayload) {
            const relayResponse = await app.inject({
                method: "POST",
                url: "/core/ops/http/dispatch",
                headers: {
                    "content-type": "application/json"
                },
                payload: JSON.stringify(relayPayload)
            });
            const relayBody = String((relayResponse as any)?.body || "").trim();
            try {
                return reply.code(relayResponse.statusCode || 200).send(relayBody ? JSON.parse(relayBody) : {});
            } catch {
                return reply.code(relayResponse.statusCode || 200).send(relayBody || "");
            }
        }

        const targets = normalizeTargets(body);
        if (targets.length) {
            const delivered = sockets.sendCoordinatorMessage(targets, "clipboard:update", { text }, selfId, "act");
            return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
        }

        try {
            setLegacyClipboardBroadcasting(true);
            const written = await writeLegacyClipboard(text);
            if (!written) {
                return reply.code(204).send({ ok: false, error: "Clipboard unavailable" });
            }
            return { ok: true, mode: "local-write" };
        } catch (error) {
            return reply.code(500).send({ ok: false, error: String(error) });
        } finally {
            setLegacyClipboardBroadcasting(false);
        }
    });

    const requestHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body);
        if (!auth.ok) return auth;
        const results = Array.isArray(body.requests)
            ? await Promise.all(body.requests.map((entry) => forwardHttpRequest(asRecord(entry))))
            : [await forwardHttpRequest(body)];
        return {
            ok: results.every((entry) => entry.ok),
            results
        };
    };

    app.post("/core/ops/http", requestHandler);
    app.post("/core/ops/https", requestHandler);
    app.post("/api/request", requestHandler);
    app.post("/core/request/fetch", requestHandler);
    app.post("/api/request/fetch", requestHandler);
    app.post("/", async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        if (Array.isArray(body.requests) || body.targetDeviceId || body.targets) {
            return app.inject({
                method: "POST",
                url: "/api/broadcast",
                payload: body
            }).then((result) => JSON.parse(result.body || "{}"));
        }
        return requestHandler(request);
    });

    const dispatchHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body);
        if (!auth.ok) return auth;
        const type = resolveDispatchType(body);
        const op = resolveDispatchOp(body.op);
        const targets = normalizeTargets(body);
        const payload = resolveDispatchPayload(body, type);
        const requestEntries = Array.isArray(body.requests) ? body.requests.map((entry) => asRecord(entry)) : [];
        const externalRequests = requestEntries.filter((entry) => normalizeString(entry.url));
        const socketRequests = requestEntries
            .filter((entry) => !normalizeString(entry.url))
            .map((entry) => {
                const target = normalizeString(entry.deviceId || entry.targetId || entry.target);
                const entryType = resolveDispatchType(entry, type);
                const entryOp = resolveDispatchOp(entry.op || op);
                const entryPayload = resolveDispatchPayload(entry, entryType);
                return {
                    target,
                    op: entryOp,
                    type: entryType,
                    payload: entryPayload
                };
            })
            .filter((entry) => entry.target);

        const deliveryResults = socketRequests.length > 0
            ? socketRequests.map((entry) => ({
                  target: entry.target,
                  ok: sockets.sendCoordinatorMessage([entry.target], entry.type, entry.payload, auth.userId, entry.op as any),
                  delivered: "socketio"
              }))
            : targets.map((target) => ({
                  target,
                  ok: sockets.sendCoordinatorMessage([target], type, payload, auth.userId, op as any),
                  delivered: "socketio"
              }));
        const httpResults = await Promise.all(externalRequests.map((entry) => forwardHttpRequest(entry)));

        return {
            ok: [...deliveryResults, ...httpResults].every((entry) => entry.ok),
            results: [...deliveryResults, ...httpResults]
        };
    };

    app.post("/core/ops/http/dispatch", dispatchHandler);
    app.post("/core/ops/http/disp", dispatchHandler);
    app.post("/api/broadcast", dispatchHandler);

    const wsSendHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body);
        if (!auth.ok) return auth;
        const opRaw = normalizeString(body.op || "");
        const opAsType = opRaw && !VERB_OPS.has(opRaw.toLowerCase()) ? opRaw : "";
        const type = normalizeString(body.what || body.type || opAsType || "dispatch") || "dispatch";
        const data = body.data ?? body.payload ?? body;
        const op = resolveDispatchOp(body.op);
        const delivered = sockets.multicast(auth.userId, {
            op,
            what: type,
            type,
            data,
            payload: data,
            from: auth.userId,
            byId: auth.userId,
            timestamp: Date.now()
        });
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/ws/send", wsSendHandler);
    app.post("/api/ws", wsSendHandler);

    const reverseSendHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(body);
        if (!targets.length) return { ok: false, error: "Missing deviceId" };
        const delivered = sockets.sendCoordinatorMessage(
            targets,
            resolveActionType(body),
            body.data ?? body.payload ?? body,
            auth.userId,
            "act"
        );
        return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
    };

    app.post("/core/reverse/send", reverseSendHandler);
    app.post("/api/reverse/send", reverseSendHandler);

    const reverseDevicesHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body));
        if (!auth.ok) return auth;
        const profiles = sockets.getConnectedPeerProfiles(auth.userId);
        return {
            ok: true,
            devices: profiles.map((entry) => entry.id),
            deviceProfiles: profiles.map((entry) => ({ id: entry.id, label: entry.label }))
        };
    };

    app.post("/core/reverse/devices", reverseDevicesHandler);
    app.post("/api/reverse/devices", reverseDevicesHandler);

    const topologyHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            topology: {
                nodes: sockets.getConnectedPeerProfiles().map((entry) => ({
                    id: entry.id,
                    label: entry.label,
                    transport: entry.transport
                })),
                links: []
            }
        };
    };

    const connectionsHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            connections: sockets.getConnectedPeerProfiles()
        };
    };

    const statusHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            status: sockets.getStatus()
        };
    };

    const networkDispatchHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(body);
        const broadcast = Boolean(body.broadcast);
        const requestedTargets = targets.length ? targets : broadcast ? sockets.getConnectedDevices(auth.userId) : [];
        const delivered = requestedTargets.length
            ? sockets.sendCoordinatorMessage(
                  requestedTargets,
                  resolveActionType(body),
                  body.payload ?? body.data ?? {},
                  auth.userId,
                  "act"
              )
            : false;
        return {
            ok: delivered || broadcast,
            route: requestedTargets.length > 1 ? "both" : requestedTargets.length === 1 ? "local" : "none",
            delivered: {
                local: delivered,
                bridge: false,
                target: requestedTargets[0] || null,
                targets: requestedTargets
            }
        };
    };

    app.post("/core/network/topology", topologyHandler);
    app.post("/api/network/topology", topologyHandler);
    app.post("/core/network/connections", connectionsHandler);
    app.post("/api/network/connections", connectionsHandler);
    app.post("/core/network/status", statusHandler);
    app.post("/api/network/status", statusHandler);
    app.post("/core/network/dispatch", networkDispatchHandler);
    app.post("/api/network/dispatch", networkDispatchHandler);
    app.post("/core/network/fetch", requestHandler);
    app.post("/api/network/fetch", requestHandler);

    const devicesHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body));
        if (!auth.ok) return auth;
        return {
            ok: true,
            reverseDevices: sockets.getConnectedDevices(auth.userId),
            reverseDeviceProfiles: sockets.getConnectedPeerProfiles(auth.userId).map((entry) => ({ id: entry.id, label: entry.label })),
            configuredTargets: []
        };
    };

    app.post("/core/ops/devices", devicesHandler);
    app.post("/api/devices", devicesHandler);

    const featureDispatchHandler = (featureType: string) => async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body));
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const targets = normalizeTargets(body);
        const payload = body.data ?? body.payload ?? body;
        const delivered = targets.length
            ? sockets.sendCoordinatorMessage(targets, featureType, payload, auth.userId, "act")
            : sockets.notify(auth.userId, featureType, payload);
        return {
            ok: delivered,
            delivered: delivered ? "socketio" : "none",
            targets
        };
    };

    app.post("/core/ops/sms", featureDispatchHandler("sms:send"));
    app.post("/api/sms", featureDispatchHandler("sms:send"));
    app.post("/core/ops/contacts", featureDispatchHandler("contacts:list"));
    app.post("/api/contacts", featureDispatchHandler("contacts:list"));
    app.post("/core/ops/notifications", featureDispatchHandler("notifications"));
    app.post("/api/notifications", featureDispatchHandler("notifications"));

    const notificationsSpeakHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body));
        if (!auth.ok) return auth;
        const targets = normalizeTargets(asRecord(request.body));
        const payload = asRecord(request.body).payload ?? asRecord(request.body).data ?? asRecord(request.body);
        const delivered = targets.length
            ? sockets.sendCoordinatorMessage(targets, "notification:speak", payload, auth.userId, "act")
            : sockets.notify(auth.userId, "notification:speak", payload);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notifications/speak", notificationsSpeakHandler);
    app.post("/api/notifications/speak", notificationsSpeakHandler);

    const notifyHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body));
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const delivered = sockets.notify(auth.userId, normalizeString(body.type || body.action || "action") || "action", body.data ?? body.payload ?? body);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notify", notifyHandler);
    app.post("/api/action", notifyHandler);
};
