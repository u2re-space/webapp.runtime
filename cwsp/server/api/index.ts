import type { FastifyInstance } from "fastify";

export const registerApiPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    // Admin API
    adminApp.get("/api/admin", async (request, reply) => {
        return { status: "admin ok" };
    });

    // Public API
    publicApp.get("/api/public", async (request, reply) => {
        return { status: "public ok" };
    });
};
