import { isMainModule } from "../server/lib/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";

type ServerV2StartOptions = {
    configDir?: string;
    configPath?: string;
    dataDir?: string;
    httpsOptions?: any;
    logger?: boolean;
} & ServerV2BootstrapOptions;

export type ServerV2Runtime = Awaited<ReturnType<typeof createServerV2Runtime>>;

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

const loadServerV2Modules = async () => {
    const [
        fastifyModule,
        engineModule,
        httpModule,
        clipboardModule,
        socketModule
    ] = await Promise.all([
        import("../server/network/modules/fastify-server.ts"),
        import("./config/engine.ts"),
        import("./http/index.ts"),
        import("./inputs/access/clipboard.ts"),
        import("./protocol/socket/handler.ts")
    ]);

    return {
        buildCoreServers: fastifyModule.buildCoreServers,
        createClipboardAccess: clipboardModule.createClipboardAccess,
        createServerV2Engine: engineModule.createServerV2Engine,
        createServerV2Http: httpModule.createServerV2Http,
        createSocketProtocolHandler: socketModule.createSocketProtocolHandler,
        startCoreBackend: fastifyModule.startCoreBackend
    };
};

export const createServerV2Runtime = async (options: ServerV2StartOptions = {}) => {
    const bootstrap = applyServerV2Bootstrap(options);
    const {
        buildCoreServers,
        createClipboardAccess,
        createServerV2Engine,
        createServerV2Http,
        createSocketProtocolHandler,
        startCoreBackend
    } = await loadServerV2Modules();
    const engine = createServerV2Engine();
    const http = createServerV2Http();
    const clipboard = createClipboardAccess();
    const sockets = createSocketProtocolHandler({
        policyMap: engine.policyMap
    });

    return {
        build: async (options: ServerV2StartOptions = {}) => {
            const servers = await buildCoreServers(options);
            const primaryApp = (servers.https ?? servers.http) as any;
            clipboard.attachApp(primaryApp);

            const wsHub = (primaryApp?.wsHub || (servers.http as any)?.wsHub) as any;
            const boundSockets = createSocketProtocolHandler({
                policyMap: engine.policyMap,
                transports: {
                    ws: wsHub
                }
            });

            return {
                bootstrap,
                ...servers,
                clipboard,
                engine,
                http,
                sockets: boundSockets
            };
        },
        bootstrap,
        clipboard,
        engine,
        http,
        sockets,
        start: async (options: ServerV2StartOptions = {}) => {
            const startBootstrap = applyServerV2Bootstrap(options);
            logProfile(engine.profile, { bootstrap: startBootstrap, engine });
            await startCoreBackend(options);
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
