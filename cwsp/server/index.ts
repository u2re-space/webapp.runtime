import { Server as HttpsServer } from "node:https";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { isMainModule, moduleDirname } from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { loadHttpsOptions } from "./utils/certificate.ts";
import { loadFastifyFactory } from "./utils/fastify-loader.ts";

// Plugins
import { registerWebPlugin } from "../web/index.ts";
import { registerApiPlugin } from "../api/index.ts";
import { registerIoPlugin } from "./io/plugin/index.ts";
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
    const fastify = await loadFastifyFactory();

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
            
            // Public Port (frontend / primary browser entry; config: publicListenPort / publicHttpPort)
            const publicHttpsPort = Number(engine.config.publicListenPort) || 443;
            const publicHttpPort = Number(engine.config.publicHttpPort) || 80;
            const publicPort = isHttps ? publicHttpsPort : publicHttpPort;

            const listenHost =
                String(process.env.CWS_LISTEN_HOST || process.env.CWS_BIND_HOST || "0.0.0.0").trim() || "0.0.0.0";
            const advertiseHost = String(process.env.CWS_ADVERTISE_HOST || "").trim();
            const originHint = () => {
                const host = advertiseHost || (listenHost === "0.0.0.0" ? "<this-machine-LAN-IP>" : listenHost);
                const scheme = isHttps ? "https" : "http";
                const portSuffix =
                    (isHttps && publicPort === 443) || (!isHttps && publicPort === 80) ? "" : `:${publicPort}`;
                return `${scheme}://${host}${portSuffix}/`;
            };

            let adminBound = false;
            let publicBound = false;

            try {
                await adminApp.listen({ host: listenHost, port: adminPort });
                adminBound = true;
                console.log(`[cwsp] Admin server listening on ${isHttps ? "https" : "http"}://${listenHost}:${adminPort}`);
            } catch (err) {
                console.error(`[cwsp] Failed to bind Admin port ${adminPort}:`, err);
            }

            try {
                await publicApp.listen({ host: listenHost, port: publicPort });
                publicBound = true;
                console.log(`[cwsp] Public server listening on ${isHttps ? "https" : "http"}://${listenHost}:${publicPort}`);
                if (listenHost === "0.0.0.0") {
                    console.log(
                        `[cwsp] Browsers cannot open https://0.0.0.0/ — use your LAN IP (e.g. https://192.168.0.200/). ` +
                            `Set CWS_ADVERTISE_HOST=192.168.0.200 to print an exact URL below.`
                    );
                }
                if (advertiseHost) {
                    console.log(`[cwsp] Public app URL hint: ${originHint()}`);
                }
            } catch (err) {
                console.error(`[cwsp] Failed to bind Public port ${publicPort}:`, err);
                console.error(
                    `[cwsp] Browsers will show ERR_CONNECTION_REFUSED for https://<host>:${publicPort}/ until the public server binds. ` +
                        `Common fixes: port in use, need CAP_NET_BIND_SERVICE for 443, or use CWS_PUBLIC_HTTPS_PORT=8443 (and open https://host:8443/).`
                );
            }

            if (!publicBound) {
                console.error("[cwsp] Exiting: public server did not start (required for frontend / PWA).");
                process.exit(1);
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
