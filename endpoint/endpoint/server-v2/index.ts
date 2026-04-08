import { Server as HttpsServer } from "node:https";

import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { setApp as setLegacyClipboardApp, startClipboardPolling } from "../server/io/clipboard.ts";
import { isMainModule, moduleDirname } from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { createServerV2Http } from "./protocol/http/index.ts";
import { createClipboardAccess } from "./inputs/access/clipboard.ts";
import { createSocketProtocolHandler } from "./protocol/socket/handler.ts";
import { resolveServerV2WireIdentity } from "./protocol/socket/client-contract.ts";
import { ServerV2SocketRuntime } from "./protocol/socket/runtime.ts";
import { loadHttpsOptions } from "./utils/certificate.ts";

type ServerV2StartOptions = {
    configDir?: string;
    configPath?: string;
    dataDir?: string;
    httpsOptions?: any;
    logger?: boolean;
} & ServerV2BootstrapOptions;

export type ServerV2Runtime = Awaited<ReturnType<typeof createServerV2Runtime>>;

type RuntimeContext = {
    clipboard: ReturnType<typeof createClipboardAccess>;
    endpointPolicies: Record<string, unknown>;
    selfId: string;
    sockets: ServerV2SocketRuntime;
};

const formatList = (items: string[]): string => (items.length ? items.join(", ") : "none");

const logProfile = (
    profile: ServerV2Runtime["engine"]["profile"],
    runtime: Pick<ServerV2Runtime, "bootstrap" | "engine">
): void => {
    const loadReport = (runtime.engine.storage.getLoadReport?.() || {}) as Record<string, unknown>;
    const portableSource = String(loadReport.selectedPortableConfig || runtime.bootstrap.configPath || "auto");
    const dataDir = runtime.bootstrap.dataDir || process.env.CWS_PORTABLE_DATA_PATH || process.env.CWS_DATA_DIR || "-";
    console.log(
        `[server-v2] roles=${formatList(profile.roles)} transports=${formatList(profile.transports)} policies=${profile.policyCount} http=${profile.httpPort ?? "-"} https=${profile.httpsPort ?? "-"} bridge=${profile.bridgeEnabled ? profile.bridgeMode : "disabled"} config=${portableSource} data=${dataDir}`
    );
};

const buildRuntimeContext = (engine: ReturnType<typeof createServerV2Engine>, clipboard: ReturnType<typeof createClipboardAccess>) => {
    const bridge = (engine.config?.bridge || {}) as Record<string, unknown>;
    const identity = resolveServerV2WireIdentity({
        endpointUrl: String(bridge.endpointUrl || "").trim(),
        userId: String(bridge.userId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        deviceId: String(bridge.deviceId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        token: String(bridge.userKey || process.env.CWS_ASSOCIATED_TOKEN || "").trim()
    });
    if (!String(process.env.CWS_ASSOCIATED_ID || "").trim() && identity.userId) {
        process.env.CWS_ASSOCIATED_ID = identity.userId;
    }
    if (!String(process.env.CWS_BRIDGE_USER_ID || "").trim() && identity.userId) {
        process.env.CWS_BRIDGE_USER_ID = identity.userId;
    }
    if (!String(process.env.CWS_BRIDGE_DEVICE_ID || "").trim() && identity.deviceId) {
        process.env.CWS_BRIDGE_DEVICE_ID = identity.deviceId;
    }
    if (!String(process.env.CWS_BRIDGE_USER_KEY || "").trim() && identity.token) {
        process.env.CWS_BRIDGE_USER_KEY = identity.token;
    }
    if (!String(process.env.CWS_ASSOCIATED_TOKEN || "").trim() && identity.token) {
        process.env.CWS_ASSOCIATED_TOKEN = identity.token;
    }
    const selfId = identity.userId || identity.deviceId || "server-v2";
    const token = identity.token;
    const clientSeed = ((engine.config?.endpointIDs || {}) as Record<string, any>) || {};
    const sockets = new ServerV2SocketRuntime(selfId, token, clientSeed, bridge);
    const context: RuntimeContext = {
        clipboard,
        endpointPolicies: (engine.config?.endpointIDs || engine.policyMap || {}) as Record<string, unknown>,
        selfId,
        sockets
    };
    return context;
};

export const createServerV2Runtime = async (options: ServerV2StartOptions = {}) => {
    const bootstrap = applyServerV2Bootstrap(options);
    const engine = createServerV2Engine();
    const http = createServerV2Http();
    const clipboard = createClipboardAccess();
    const runtimeContext = buildRuntimeContext(engine, clipboard);
    const sockets = createSocketProtocolHandler({
        policyMap: engine.policyMap,
        transports: {
            socketio: (payload) => {
                runtimeContext.sockets.dispatchPacket(payload as any);
            }
        }
    });

    let primaryApp: FastifyInstance | null = null;

    const build = async () => {
        if (primaryApp) {
            return {
                bootstrap,
                clipboard,
                engine,
                http,
                sockets,
                app: primaryApp
            };
        }

        const moduleDir = moduleDirname(import.meta);
        const cwd = bootstrap.configDir || process.cwd();
        const httpsOptions =
            options.httpsOptions ??
            (await loadHttpsOptions({
                httpsConfig: ((engine.config as Record<string, unknown>)?.https as Record<string, any>) || {},
                moduleDir,
                cwd
            }));

        if (httpsOptions) {
            console.log(
                "[server-v2] TLS: active — Fastify uses Node HTTPS; Socket.IO shares this server on path /socket.io/"
            );
        } else {
            console.log(
                "[server-v2] TLS: off — plain HTTP only (see [core-backend] HTTPS disabled… above if certs failed). " +
                    "Browsers hitting https://this-host:443 go to the reverse proxy, not this process, unless you terminate TLS here."
            );
        }

        const app = fastify({
            logger: options.logger ?? true,
            ...(httpsOptions ? { https: httpsOptions } : {})
        });

        await app.register(cors, {
            origin: true,
            credentials: true
        });
        await app.register(formbody);

        clipboard.attachApp(app);
        // Reuse the existing clipboard producer so local OS clipboard changes
        // become policy-aware /clipboard dispatches in server-v2 as well.
        setLegacyClipboardApp(app);
        runtimeContext.sockets.attach(app.server as any);
        await http.register(app, {
            wsHub: runtimeContext
        });
        startClipboardPolling();

        primaryApp = app;
        return {
            bootstrap,
            clipboard,
            engine,
            http,
            sockets,
            app
        };
    };

    return {
        build,
        bootstrap,
        clipboard,
        engine,
        http,
        sockets,
        start: async (startOptions: ServerV2StartOptions = {}) => {
            const startBootstrap = applyServerV2Bootstrap(startOptions);
            logProfile(engine.profile, { bootstrap: startBootstrap, engine });
            const built = await build();
            const httpsPort = engine.profile.httpsPort;
            const httpPort = engine.profile.httpPort;
            const isHttps = built.app.server instanceof HttpsServer;
            const primaryPort = isHttps ? httpsPort || httpPort || 8443 : httpPort || httpsPort || 8080;

            const parseListenFallbackPorts = (): number[] => {
                const raw = String(process.env.CWS_LISTEN_FALLBACK_PORTS || process.env.CWS_ADMIN_FALLBACK_PORTS || "").trim();
                if (raw) {
                    return raw
                        .split(/[,;\s]+/)
                        .map((s) => parseInt(s.trim(), 10))
                        .filter((n) => Number.isFinite(n) && n > 0 && n < 65536);
                }
                return isHttps ? [8445, 18443, 9444, 7444] : [8082, 18080, 8889, 9090];
            };

            const fallbacks = parseListenFallbackPorts();
            const portsToTry: number[] = [];
            const seen = new Set<number>();
            for (const p of [primaryPort, ...fallbacks]) {
                if (!seen.has(p) && Number.isFinite(p) && p > 0 && p < 65536) {
                    seen.add(p);
                    portsToTry.push(p);
                }
            }

            const listenHost = String(process.env.CWS_LISTEN_HOST || process.env.CWS_BIND_HOST || "0.0.0.0").trim() || "0.0.0.0";
            let boundPort = primaryPort;
            let listenOk = false;
            let lastErr: unknown;
            for (const port of portsToTry) {
                try {
                    await built.app.listen({
                        host: listenHost,
                        port
                    });
                    boundPort = port;
                    listenOk = true;
                    break;
                } catch (error: unknown) {
                    lastErr = error;
                    const code =
                        error && typeof error === "object" && "code" in error
                            ? String((error as NodeJS.ErrnoException).code)
                            : "";
                    if (code === "EADDRINUSE") {
                        console.error(`[server-v2] port ${port} in use (EADDRINUSE), trying next…`);
                        continue;
                    }
                    throw error;
                }
            }
            if (!listenOk) {
                const err = lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? "listen failed"));
                throw err;
            }

            const protocol = isHttps ? "https" : "http";
            console.log(
                `[server-v2] listening on ${protocol}://${listenHost}:${boundPort} — Engine.IO/Socket.IO on same port (/socket.io/). ` +
                    `Public :443 must reverse-proxy WebSocket+long-poll to this port if clients use standard HTTPS.`
            );
            if (boundPort !== primaryPort) {
                console.warn(
                    `[server-v2] Bound on ${boundPort} (primary ${primaryPort} was busy). ` +
                        `Stop duplicate PM2 apps or CWSP on the same host, or set listenPort / CWS_LISTEN_FALLBACK_PORTS.`
                );
            }
            return built;
        }
    };
};

export const startServerV2 = async (options: ServerV2StartOptions = {}) => {
    const runtime = await createServerV2Runtime(options);
    await runtime.start(options);
    return runtime;
};

if (isMainModule(import.meta)) {
    
    startServerV2().catch((error) => {
        console.error("[server-v2] failed to start", error);
        process.exit(1);
    });
}
