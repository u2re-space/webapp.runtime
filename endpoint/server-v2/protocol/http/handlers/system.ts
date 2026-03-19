import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const BOOT_AT_MS = Date.now();
const SERVICE_NAME = "cws-v2";

const noStore = (reply: FastifyReply): void => {
    reply.header("Cache-Control", "no-store");
    reply.header("Pragma", "no-cache");
    reply.header("Expires", "0");
};

const resolveVersion = (): string => String(process.env.npm_package_version || "unknown");

export const registerSystemHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    app.get("/api", async () => ({
        ok: true,
        service: SERVICE_NAME,
        endpoints: [
            "/api/processing",
            "/api/request",
            "/api/broadcast",
            "/api/action",
            "/api/storage",
            "/api/ws",
            "/api/system/status"
        ]
    }));

    app.get("/healthz", async (_req, reply) => {
        noStore(reply);
        return reply.code(200).send({
            ok: true,
            service: SERVICE_NAME,
            status: "healthy",
            version: resolveVersion(),
            timestamp: new Date().toISOString()
        });
    });

    app.get("/readyz", async (_req, reply) => {
        const diagnostics = {
            hasFetch: typeof fetch === "function",
            hasBroadcastChannel: typeof BroadcastChannel !== "undefined",
            hasCacheApi: typeof caches !== "undefined"
        };
        const ready = diagnostics.hasFetch;
        noStore(reply);
        return reply.code(ready ? 200 : 503).send({
            ok: ready,
            service: SERVICE_NAME,
            status: ready ? "ready" : "degraded",
            version: resolveVersion(),
            diagnostics,
            timestamp: new Date().toISOString()
        });
    });

    app.get("/api/system/status", async (_req, reply) => {
        const now = Date.now();
        noStore(reply);
        return reply.code(200).send({
            ok: true,
            service: SERVICE_NAME,
            version: resolveVersion(),
            uptimeMs: now - BOOT_AT_MS,
            pid: process.pid,
            node: process.version,
            timestamp: new Date(now).toISOString()
        });
    });

    app.options("/lna-probe", async (req: FastifyRequest, reply: FastifyReply) => {
        const origin = String((req.headers as any)?.origin || "");
        if (origin) reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Access-Control-Allow-Methods", "GET, OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type");
        reply.header("Access-Control-Max-Age", "600");
        if (String((req.headers as any)?.["access-control-request-private-network"] || "").toLowerCase() === "true") {
            reply.header("Access-Control-Allow-Private-Network", "true");
            reply.header("Vary", "Origin, Access-Control-Request-Private-Network");
        } else if (origin) {
            reply.header("Vary", "Origin");
        }
        return reply.code(204).send();
    });

    app.get("/lna-probe", async (req: FastifyRequest, reply: FastifyReply) => {
        const origin = String((req.headers as any)?.origin || "");
        if (origin) {
            reply.header("Access-Control-Allow-Origin", origin);
            reply.header("Vary", "Origin");
            reply.header("Access-Control-Allow-Private-Network", "true");
        }
        noStore(reply);
        return reply.code(204).send();
    });
};
