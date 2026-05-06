/**
 * Lightweight health/readiness/probe handlers for the endpoint runtime.
 *
 * WHY: connection debugging often starts here before touching socket traces, so
 * these routes explain whether the process is up, ready, and PNA-reachable.
 */
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const BOOT_AT_MS = Date.now();
const SERVICE_NAME = "cws-v2";

/** Mark probe responses as non-cacheable so diagnostics always reflect live state. */
const noStore = (reply: FastifyReply): void => {
    reply.header("Cache-Control", "no-store");
    reply.header("Pragma", "no-cache");
    reply.header("Expires", "0");
};

const resolveVersion = (): string => String(process.env.npm_package_version || "unknown");

/**
 * Register operator-facing health and LAN probe routes.
 *
 * NOTE: `/lna-probe` exists specifically to make browser Private Network Access
 * failures easier to diagnose before the Socket.IO/WebSocket handshake begins.
 */
import { Server as HttpsServer } from "node:https";
import path from "node:path";
import { readFile } from "node:fs/promises";

import { getConfigLoadReportSnapshot, readServerV2ConfigSnapshot } from "../../config/storage.ts";
import { describeHttpsCandidates } from "../../utils/certificate.ts";
import { moduleDirname } from "../../utils/runtime.ts";

export const registerSystemHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    const moduleDir = moduleDirname(import.meta);
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
            "/api/system/status",
            "/api/system/tls",
            "/api/system/tls/rootCA.crt"
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

    app.get("/api/system/tls", async (req, reply) => {
        const now = Date.now();
        const configReport = getConfigLoadReportSnapshot();
        const snapshot = readServerV2ConfigSnapshot();
        const cwd = configReport.configDir ? path.resolve(configReport.configDir, "..") : process.cwd();
        const httpsConfig =
            snapshot && typeof snapshot.https === "object" && snapshot.https
                ? (snapshot.https as Record<string, unknown>)
                : {};
        const tls = describeHttpsCandidates({
            httpsConfig: httpsConfig as Record<string, any>,
            moduleDir,
            cwd
        });
        const rootCaDownloadPath = tls.activePaths.ca ? "/api/system/tls/rootCA.crt" : null;

        noStore(reply);
        return reply.code(200).send({
            ok: true,
            service: SERVICE_NAME,
            timestamp: new Date(now).toISOString(),
            runtimeHttpsActive: app.server instanceof HttpsServer,
            tls,
            config: {
                configPath: configReport.configPath || null,
                configDir: configReport.configDir || null,
                portableModules: configReport.portableModules
            },
            hints: {
                browser: rootCaDownloadPath
                    ? "Download the root CA, import it into the local trust store, then reopen the HTTPS endpoint."
                    : "No CA file is currently available for download from this endpoint.",
                windows: rootCaDownloadPath
                    ? [
                        `PowerShell (Admin): Invoke-WebRequest -Uri "${rootCaDownloadPath}" -OutFile "$env:TEMP\\rootCA.crt"; Import-Certificate -FilePath "$env:TEMP\\rootCA.crt" -CertStoreLocation Cert:\\LocalMachine\\Root`,
                        `CMD (Admin): certutil -addstore -f Root rootCA.crt`
                    ]
                    : [],
                android: "Android 11+ typically needs the same CA installed under Security -> Encryption & credentials when using private HTTPS endpoints."
            },
            downloads: {
                rootCA: rootCaDownloadPath
            }
        });
    });

    app.get("/api/system/tls/rootCA.crt", async (_req, reply) => {
        const configReport = getConfigLoadReportSnapshot();
        const snapshot = readServerV2ConfigSnapshot();
        const cwd = configReport.configDir ? path.resolve(configReport.configDir, "..") : process.cwd();
        const httpsConfig =
            snapshot && typeof snapshot.https === "object" && snapshot.https
                ? (snapshot.https as Record<string, unknown>)
                : {};
        const tls = describeHttpsCandidates({
            httpsConfig: httpsConfig as Record<string, any>,
            moduleDir,
            cwd
        });
        const caPath = tls.activePaths.ca;
        if (!caPath) {
            noStore(reply);
            return reply.code(404).send({
                ok: false,
                reason: tls.inlineMaterial.ca ? "ca-inline-only" : "ca-file-missing"
            });
        }
        const caBuffer = await readFile(caPath);
        noStore(reply);
        reply.header("Content-Type", "application/x-x509-ca-cert");
        reply.header("Content-Disposition", 'attachment; filename="rootCA.crt"');
        return reply.code(200).send(caBuffer);
    });

    app.options("/lna-probe", async (req: FastifyRequest, reply: FastifyReply) => {
        const origin = String((req.headers as any)?.origin || "");
        if (origin) reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Access-Control-Allow-Methods", "GET, OPTIONS");
        reply.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Access-Control-Request-Private-Network, Access-Control-Request-Method"
        );
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
