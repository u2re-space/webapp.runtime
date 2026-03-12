import { isMainModule } from "../server/lib/runtime.ts";
import { buildCoreServers, startCoreBackend } from "../server/network/modules/fastify-server.ts";

import { createServerV2Engine } from "./config/engine.ts";
import { createClipboardAccess } from "./inputs/access/clipboard.ts";
import { createSocketProtocolHandler } from "./protocol/socket/handler.ts";

type ServerV2StartOptions = {
    httpsOptions?: any;
    logger?: boolean;
};

export type ServerV2Runtime = ReturnType<typeof createServerV2Runtime>;

const formatList = (items: string[]): string => (items.length ? items.join(", ") : "none");

const logProfile = (profile: ServerV2Runtime["engine"]["profile"]): void => {
    console.log(
        `[server-v2] roles=${formatList(profile.roles)} transports=${formatList(profile.transports)} policies=${profile.policyCount} http=${profile.httpPort ?? "-"} https=${profile.httpsPort ?? "-"} bridge=${profile.bridgeEnabled ? profile.bridgeMode : "disabled"}`
    );
};

export const createServerV2Runtime = () => {
    const engine = createServerV2Engine();
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
                ...servers,
                clipboard,
                engine,
                sockets: boundSockets
            };
        },
        clipboard,
        engine,
        sockets,
        start: async (options: ServerV2StartOptions = {}) => {
            logProfile(engine.profile);
            await startCoreBackend(options);
        }
    };
};

export const startServerV2 = async (options: ServerV2StartOptions = {}) => {
    const runtime = createServerV2Runtime();
    await runtime.start(options);
    return runtime;
};

if (isMainModule(import.meta)) {
    startServerV2().catch((error) => {
        console.error("[server-v2] failed to start", error);
        process.exit(1);
    });
}
