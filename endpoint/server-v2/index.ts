import { Server as HttpsServer } from "node:https";

import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { isMainModule, moduleDirname } from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { createServerV2Http } from "./protocol/http/index.ts";
import { createClipboardAccess } from "./inputs/access/clipboard.ts";
import { createSocketProtocolHandler } from "./protocol/socket/handler.ts";
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
    const selfId =
        String(bridge.deviceId || bridge.userId || process.env.CWS_ASSOCIATED_ID || "server-v2").trim() || "server-v2";
    const token = String(bridge.userKey || process.env.CWS_ASSOCIATED_TOKEN || "").trim();
    const clientSeed = ((engine.config?.endpointIDs || {}) as Record<string, any>) || {};
    const sockets = new ServerV2SocketRuntime(selfId, token, clientSeed);
    const context: RuntimeContext = {
        clipboard,
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
        const httpsOptions =
            options.httpsOptions ??
            (await loadHttpsOptions({
                httpsConfig: ((engine.config as Record<string, unknown>)?.https as Record<string, any>) || {},
                moduleDir
            }));

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
        runtimeContext.sockets.attach(app.server as any);
        await http.register(app, {
            wsHub: runtimeContext
        });

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
            const port = isHttps ? httpsPort || httpPort || 8443 : httpPort || httpsPort || 8080;
            await built.app.listen({
                host: "0.0.0.0",
                port
            });
            const protocol = isHttps ? "https" : "http";
            console.log(`[server-v2] listening on ${protocol}://0.0.0.0:${port}`);
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
