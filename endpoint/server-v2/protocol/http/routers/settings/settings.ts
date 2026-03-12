import type { FastifyInstance } from "fastify";

import {
    registerCoreSettingsEndpoints as registerLegacyCoreSettingsEndpoints,
    registerCoreSettingsRoutes as registerLegacyCoreSettingsRoutes
} from "../../../../../server/routing/userSettings.ts";
import { createServerV2Http } from "../../index.ts";

export const registerCoreSettingsEndpoints = async (app: FastifyInstance): Promise<void> => {
    await registerLegacyCoreSettingsEndpoints(app);
};

export const registerCoreSettingsRoutes = async (app: FastifyInstance): Promise<void> => {
    await registerLegacyCoreSettingsRoutes(app);
};

export const registerSettingsHttpRouter = async (app: FastifyInstance): Promise<void> => {
    await createServerV2Http().register(app, {
        branchIds: ["settings"]
    });
};
