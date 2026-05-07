import type { FastifyInstance } from "fastify";

import { registerTransportHttpHandlers } from "../../handlers/transport.ts";

export const registerOpsHttpRouter = async (app: FastifyInstance, wsHub?: unknown, networkContext?: unknown, socketIoBridge?: unknown): Promise<void> => {
    void networkContext;
    void socketIoBridge;
    if (!wsHub) {
        throw new Error("[server-v2/http] ops router requires runtime context");
    }
    await registerTransportHttpHandlers(app, wsHub as any);
};
