import { Server as HttpsServer } from "node:https";
import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { isMainModule, moduleDirname } from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { loadHttpsOptions } from "./utils/certificate.ts";

// Plugins
import { registerWebPlugin } from "../web/index.ts";
import { registerApiPlugin } from "../api/index.ts";
import { registerIoPlugin } from "../io/index.ts";
import { registerControlPlugin } from "../control/index.ts";

export type CWSPStartOptions = {
    configDir?: string;
    configPath?: string;
    dataDir?: string;
    httpsOptions?: any;
    logger?: boolean;
} & ServerV2BootstrapOptions;

export const createCWSPRuntime = async (options: CWSPStartOptions = {}) => {
    const bootstrap = applyServerV2Bootstrap(options);
    const engine = createServerV2Engine();
    
    const moduleDir = moduleDirname(import.meta);
    const cwd = bootstrap.configDir || process.cwd();
    const httpsOptions = options.httpsOptions ?? (await loadHttpsOptions({
        httpsConfig: ((engine.config as Record<string, unknown>)?.https as Record<string, any>) || {},
        moduleDir,
        cwd
    }));

    // 1. Admin/System Server (8080/8443)
    const adminApp = fastify({
        logger: options.logger ?? true,
        ...(httpsOptions ? { https: httpsOptions } : {})
    });

    await adminApp.register(cors, { origin: true, credentials: true });
    await adminApp.register(formbody);

    // 2. Public Frontend Server (80/443)
    const publicApp = fastify({
        logger: options.logger ?? true,
        ...(httpsOptions ? { https: httpsOptions } : {})
    });

    await publicApp.register(cors, { origin: true, credentials: true });
    await publicApp.register(formbody);

    // Register Plugins
    await registerControlPlugin(adminApp, { engine, bootstrap });
    await registerApiPlugin(adminApp, publicApp, { engine, bootstrap });
    await registerIoPlugin(adminApp, publicApp, { engine, bootstrap });
    await registerWebPlugin(publicApp, { engine, bootstrap });

    return {
        bootstrap,
        engine,
        adminApp,
        publicApp,
        start: async () => {
            const isHttps = adminApp.server instanceof HttpsServer;
            
            // Admin Port
            const adminHttpsPort = engine.profile.httpsPort || 8443;
            const adminHttpPort = engine.profile.httpPort || 8080;
            const adminPort = isHttps ? adminHttpsPort : adminHttpPort;
            
            // Public Port
            const publicHttpsPort = 443;
            const publicHttpPort = 80;
            const publicPort = isHttps ? publicHttpsPort : publicHttpPort;

            try {
                await adminApp.listen({ host: "0.0.0.0", port: adminPort });
                console.log(`[cwsp] Admin server listening on ${isHttps ? "https" : "http"}://0.0.0.0:${adminPort}`);
            } catch (err) {
                console.error(`[cwsp] Failed to bind Admin port ${adminPort}:`, err);
            }

            try {
                await publicApp.listen({ host: "0.0.0.0", port: publicPort });
                console.log(`[cwsp] Public server listening on ${isHttps ? "https" : "http"}://0.0.0.0:${publicPort}`);
            } catch (err) {
                console.error(`[cwsp] Failed to bind Public port ${publicPort}. Ensure you have permissions or another process is not using it.`);
            }
        }
    };
};

export const startCWSP = async (options: CWSPStartOptions = {}) => {
    const runtime = await createCWSPRuntime(options);
    await runtime.start();
    return runtime;
};

if (isMainModule(import.meta)) {
    startCWSP().catch((error) => {
        console.error("[cwsp] failed to start", error);
        process.exit(1);
    });
}
