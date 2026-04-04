import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const registerFallbackHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    app.all("/api/*", async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.code(404).send({
            ok: false,
            error: "Unknown API endpoint",
            path: (request as any).url || null
        });
    });
};
