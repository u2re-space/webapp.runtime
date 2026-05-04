import type { FastifyInstance } from "fastify";
import { createClipboardAccess } from "../../inputs/access/clipboard.ts";

export const setupClipboard = (app: FastifyInstance) => {
    const clipboard = createClipboardAccess();
    app.get("/clipboard/read", async (request, reply) => {
        try {
            const text = await clipboard.read();
            return { text };
        } catch (err) {
            reply.status(500).send({ error: "Failed to read clipboard" });
        }
    });

    app.post("/clipboard/write", async (request: any, reply) => {
        try {
            const { text } = request.body;
            await clipboard.write(text);
            return { success: true };
        } catch (err) {
            reply.status(500).send({ error: "Failed to write clipboard" });
        }
    });
};
