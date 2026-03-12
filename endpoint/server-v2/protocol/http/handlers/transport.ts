import type { FastifyInstance, FastifyRequest } from "fastify";

import { verifyUser } from "@protocol/http/routers/auth/users.ts";
import type { ClipboardAccess } from "@inputs/access/clipboard.ts";
import type { ServerV2SocketRuntime } from "@protocol/socket/runtime.ts";

const TRANSPORT_HANDLERS_KEY = Symbol.for("cws.serverV2.transportHandlers");

const normalizeString = (value: unknown): string => String(value || "").trim();

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

const verifyRequestUser = async (body: Record<string, unknown>) => {
    const userId = normalizeString(body.userId);
    const userKey = normalizeString(body.userKey);
    if (!userId || !userKey) return { ok: false as const, error: "Missing credentials" };
    const record = await verifyUser(userId, userKey);
    if (!record) return { ok: false as const, error: "Invalid credentials" };
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
    }
): Promise<void> => {
    if ((app as any)[TRANSPORT_HANDLERS_KEY]) return;
    (app as any)[TRANSPORT_HANDLERS_KEY] = true;

    const { clipboard, sockets, selfId } = options;

    app.post("/clipboard", async (request: FastifyRequest<{ Body: Record<string, unknown> }>, reply) => {
        const body = asRecord(request.body);
        const text = normalizeString(body.text ?? body.data ?? body.payload);
        if (!text) {
            return reply.code(400).send({ ok: false, error: "No text provided" });
        }

        const targets = normalizeTargets(body);
        if (targets.length) {
            const delivered = sockets.sendLegacyMessage(targets, "clipboard", { text }, selfId);
            return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
        }

        try {
            await clipboard.write(text);
            return { ok: true, mode: "local-write" };
        } catch (error) {
            return reply.code(500).send({ ok: false, error: String(error) });
        }
    });

    const requestHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(body);
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
        const auth = await verifyRequestUser(body);
        if (!auth.ok) return auth;
        const type = normalizeString(body.type || body.action || "dispatch") || "dispatch";
        const targets = normalizeTargets(body);
        const payload = body.payload ?? body.data ?? body.body ?? body;
        const externalRequests = Array.isArray(body.requests)
            ? body.requests.map((entry) => asRecord(entry)).filter((entry) => normalizeString(entry.url))
            : [];
        const socketTargets = Array.isArray(body.requests)
            ? body.requests
                  .map((entry) => asRecord(entry))
                  .map((entry) => normalizeString(entry.deviceId || entry.targetId || entry.target))
                  .filter(Boolean)
            : targets;

        const deliveryResults = socketTargets.length
            ? socketTargets.map((target) => ({
                  target,
                  ok: sockets.sendLegacyMessage([target], type, payload, auth.userId),
                  delivered: "socketio"
              }))
            : [];
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
        const auth = await verifyRequestUser(body);
        if (!auth.ok) return auth;
        const type = normalizeString(body.type || "dispatch") || "dispatch";
        const data = body.data ?? body.payload ?? body;
        const delivered = sockets.multicast(auth.userId, {
            type,
            data,
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
        const auth = await verifyRequestUser(body);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(body);
        if (!targets.length) return { ok: false, error: "Missing deviceId" };
        const delivered = sockets.sendLegacyMessage(
            targets,
            normalizeString(body.type || body.action || "dispatch") || "dispatch",
            body.data ?? body.payload ?? body,
            auth.userId
        );
        return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
    };

    app.post("/core/reverse/send", reverseSendHandler);
    app.post("/api/reverse/send", reverseSendHandler);

    const reverseDevicesHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(asRecord(request.body));
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
        const auth = await verifyRequestUser(body);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(body);
        const broadcast = Boolean(body.broadcast);
        const requestedTargets = targets.length ? targets : broadcast ? sockets.getConnectedDevices(auth.userId) : [];
        const delivered = requestedTargets.length
            ? sockets.sendLegacyMessage(requestedTargets, normalizeString(body.type || body.action || "dispatch") || "dispatch", body.payload ?? body.data ?? {}, auth.userId)
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
        const auth = await verifyRequestUser(asRecord(request.body));
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
        const auth = await verifyRequestUser(asRecord(request.body));
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const targets = normalizeTargets(body);
        const payload = body.data ?? body.payload ?? body;
        const delivered = targets.length
            ? sockets.sendLegacyMessage(targets, featureType, payload, auth.userId)
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
        const auth = await verifyRequestUser(asRecord(request.body));
        if (!auth.ok) return auth;
        const targets = normalizeTargets(asRecord(request.body));
        const payload = asRecord(request.body).payload ?? asRecord(request.body).data ?? asRecord(request.body);
        const delivered = targets.length
            ? sockets.sendLegacyMessage(targets, "notification:speak", payload, auth.userId)
            : sockets.notify(auth.userId, "notification:speak", payload);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notifications/speak", notificationsSpeakHandler);
    app.post("/api/notifications/speak", notificationsSpeakHandler);

    const notifyHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(asRecord(request.body));
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const delivered = sockets.notify(auth.userId, normalizeString(body.type || body.action || "action") || "action", body.data ?? body.payload ?? body);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notify", notifyHandler);
    app.post("/api/action", notifyHandler);
};
