import type { FastifyInstance } from "fastify";

import { registerTransportHttpHandlers } from "../../handlers/transport.ts";

export const registerClipboardHttpRouter = async (app: FastifyInstance, runtimeContext?: any): Promise<void> => {
    if (!runtimeContext) {
        throw new Error("[server-v2/http] clipboard router requires runtime context");
    }
    await registerTransportHttpHandlers(app, runtimeContext);
};
