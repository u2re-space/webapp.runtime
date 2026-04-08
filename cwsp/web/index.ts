import type { FastifyInstance } from "fastify";

export const registerWebPlugin = async (publicApp: FastifyInstance, context: any) => {
    // Serve frontend static files
    publicApp.get("/", async (request, reply) => {
        return { message: "CWSP Public Frontend" };
    });
};
