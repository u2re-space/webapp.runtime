import type { FastifyInstance } from "fastify";
import { setupClipboard } from "./clipboard.ts";

export const registerIoPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    // Setup Socket.IO and Clipboard
    setupClipboard(adminApp);
};
