import type { FastifyInstance } from "fastify";

export const registerHelloHttpRouter = async (app: FastifyInstance): Promise<void> => {
    app.get("/hello", async () => ({
        ok: true,
        service: "cws-v2",
        message: "hello from server-v2"
    }));
};
