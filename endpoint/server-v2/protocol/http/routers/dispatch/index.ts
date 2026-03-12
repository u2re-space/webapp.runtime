import type { FastifyInstance } from "fastify";

import { registerTransportHttpHandlers } from "../../handlers/transport.ts";

export const registerDispatchHttpRouter = async (app: FastifyInstance, runtimeContext?: any): Promise<void> => {
    if (!runtimeContext) {
        throw new Error("[server-v2/http] dispatch router requires runtime context");
    }
    await registerTransportHttpHandlers(app, runtimeContext);
};
