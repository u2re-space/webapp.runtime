import type { FastifyInstance } from "fastify";

import { createServerV2Http } from "../../index.ts";

export const registerOpsHttpRouter = async (app: FastifyInstance, wsHub: unknown, networkContext: unknown, socketIoBridge: unknown): Promise<void> => {
    await createServerV2Http().register(app, {
        branchIds: ["ops"]
    });
};
