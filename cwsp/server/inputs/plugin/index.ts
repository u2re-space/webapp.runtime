import type { FastifyInstance } from "fastify";

import { ServerV2SocketRuntime } from "../../protocol/socket/runtime.ts";
import { setupClipboard } from "./clipboard.ts";

let socketRuntime: ServerV2SocketRuntime | undefined;

export const getCwspSocketRuntime = (): ServerV2SocketRuntime | undefined => socketRuntime;

export const registerIoPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    setupClipboard(adminApp);

    const cfg = context.engine.config as Record<string, unknown>;
    const bridge = (cfg.bridge || {}) as Record<string, unknown>;
    const selfId =
        String(bridge.userId || bridge.deviceId || "").trim() ||
        String(process.env.CWS_ASSOCIATED_ID || "").trim() ||
        "cwsp-server";
    const token = String(bridge.userKey || process.env.CWS_ASSOCIATED_TOKEN || "").trim();

    const clientSeed = (cfg.endpointIDs && typeof cfg.endpointIDs === "object" ? cfg.endpointIDs : {}) as Record<
        string,
        unknown
    >;

    socketRuntime = new ServerV2SocketRuntime(selfId, token, clientSeed, bridge);
    socketRuntime.attach([publicApp.server, adminApp.server]);
};
