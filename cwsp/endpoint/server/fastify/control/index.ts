import type { FastifyInstance } from "fastify";

export const registerControlPlugin = async (adminApp: FastifyInstance, context: any) => {
    adminApp.get("/control/status", async (request, reply) => {
        return { status: "running", engine: context.engine.profile };
    });
};
