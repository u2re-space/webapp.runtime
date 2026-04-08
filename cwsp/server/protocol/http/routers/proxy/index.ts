import type { FastifyInstance } from "fastify";

import { createServerV2Http } from "../../index.ts";

export const registerProxyHttpRouter = async (app: FastifyInstance): Promise<void> => {
    await createServerV2Http().register(app, {
        branchIds: ["ai", "request"]
    });
};
