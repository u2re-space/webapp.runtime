import type { FastifyInstance } from "fastify";

import { createServerV2Http } from "./index.ts";
import {
    registerServerV2HttpRouters,
    type ServerV2HttpRouterId
} from "./routers/index.ts";

export const registerServerV2Http = async (
    app: FastifyInstance,
    options: {
        branchIds?: string[];
        routerIds?: ServerV2HttpRouterId[];
        networkContext?: any;
        socketIoBridge?: any;
        wsHub?: any;
    } = {}
): Promise<void> => {
    const http = createServerV2Http();

    if (options.routerIds?.length) {
        await registerServerV2HttpRouters(app, options.routerIds, options.wsHub);
        return;
    }

    await http.register(app, {
        branchIds: options.branchIds,
        networkContext: options.networkContext,
        socketIoBridge: options.socketIoBridge,
        wsHub: options.wsHub
    });
};
