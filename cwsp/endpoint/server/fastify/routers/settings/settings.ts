import type { FastifyInstance } from "fastify";

import { registerSettingsHttpHandlers } from "../../handlers/settings.ts";

export const registerCoreSettingsEndpoints = async (app: FastifyInstance): Promise<void> => {
    await registerSettingsHttpHandlers(app);
};

export const registerCoreSettingsRoutes = async (app: FastifyInstance): Promise<void> => {
    await registerSettingsHttpHandlers(app);
};

export const registerSettingsHttpRouter = async (app: FastifyInstance): Promise<void> => {
    await registerSettingsHttpHandlers(app);
};
