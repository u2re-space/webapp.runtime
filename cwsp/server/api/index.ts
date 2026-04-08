import type { FastifyInstance } from "fastify";

import { registerTransportHttpHandlers } from "../protocol/http/handlers/transport.ts";

export const registerApiPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    adminApp.get("/api/admin", async (_request, reply) => {
        return { status: "admin ok" };
    });

    publicApp.get("/api/public", async (_request, reply) => {
        return { status: "public ok" };
    });

    const hub = (adminApp as any).wsHub as
        | {
              clipboard: unknown;
              sockets: unknown;
              selfId: string;
          }
        | undefined;
    if (hub?.clipboard && hub?.sockets && hub.selfId != null) {
        await registerTransportHttpHandlers(adminApp, hub);
        await registerTransportHttpHandlers(publicApp, hub);
        console.log(
            "[cwsp] Transport HTTP: clipboard, reverse, dispatch, network/tunnel helpers (same routes as legacy server-v2) on admin + public apps."
        );
    } else {
        console.warn(
            "[cwsp] Transport HTTP skipped — wsHub missing. Ensure registerIoPlugin runs before registerApiPlugin."
        );
    }
};
