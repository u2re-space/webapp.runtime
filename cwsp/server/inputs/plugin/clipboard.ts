import type { FastifyInstance } from "fastify";
import clipboardy from "clipboardy";

export const setupClipboard = (app: FastifyInstance) => {
    app.get("/clipboard/read", async (request, reply) => {
        try {
            const text = await clipboardy.read();
            return { text };
        } catch (err) {
            reply.status(500).send({ error: "Failed to read clipboard" });
        }
    });

    app.post("/clipboard/write", async (request: any, reply) => {
        try {
            const { text } = request.body;
            await clipboardy.write(text);
            return { success: true };
        } catch (err) {
            reply.status(500).send({ error: "Failed to write clipboard" });
        }
    });
};
