import type { FastifyInstance } from "fastify";

import { createClipboardAccess } from "../../inputs/access/clipboard.ts";
import { resolveServerV2WireIdentity } from "../../socket/client-contract.ts";
import { ServerV2SocketRuntime } from "../../socket/runtime.ts";
import { setupClipboard } from "./clipboard.ts";

let socketRuntime: ServerV2SocketRuntime | undefined;

export const getCwspSocketRuntime = (): ServerV2SocketRuntime | undefined => socketRuntime;

export const registerIoPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    setupClipboard(adminApp);

    const engine = context.engine;
    const cfg = engine.config as Record<string, unknown>;
    const bridge = (cfg.bridge || {}) as Record<string, unknown>;

    const identity = resolveServerV2WireIdentity({
        endpointUrl: String(bridge.endpointUrl || "").trim(),
        userId: String(bridge.userId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        deviceId: String(bridge.deviceId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        token: String(bridge.userKey || process.env.CWS_ASSOCIATED_TOKEN || "").trim()
    });

    const selfId = identity.userId || identity.deviceId || "cwsp-server";
    const token = identity.token;

    const clientSeed = (cfg.endpointIDs && typeof cfg.endpointIDs === "object" ? cfg.endpointIDs : {}) as Record<
        string,
        unknown
    >;

    const clipboard = createClipboardAccess();
    clipboard.attachApp(adminApp);

    socketRuntime = new ServerV2SocketRuntime(selfId, token, clientSeed, bridge);
    socketRuntime.attach([publicApp.server, adminApp.server]);

    const policySource =
        engine.policyMap && Object.keys(engine.policyMap as object).length > 0
            ? (engine.policyMap as Record<string, unknown>)
            : clientSeed;

    const wsHub = {
        clipboard,
        sockets: socketRuntime,
        selfId,
        endpointPolicies: policySource,
        getConnectionRegistry: () => socketRuntime!.getConnectionRegistry()
    };

    (adminApp as any).wsHub = wsHub;
    (publicApp as any).wsHub = wsHub;
};
