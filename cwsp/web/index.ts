import type { FastifyInstance } from "fastify";
import registerFastifyRoutes from "./fastify/router.ts";

export const registerWebPlugin = async (publicApp: FastifyInstance, context: any) => {
    // Register the unified fastify frontend routes
    await registerFastifyRoutes(publicApp, {});
};
