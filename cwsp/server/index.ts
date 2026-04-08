import { Server as HttpsServer } from "node:https";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { isMainModule, moduleDirname } from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { reloadPortableConfigState } from "./config/storage.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { loadHttpsOptions } from "./utils/certificate.ts";
import { loadFastifyFactory } from "./utils/fastify-loader.ts";

// Plugins
import { registerWebPlugin } from "../web/index.ts";
import { registerApiPlugin } from "../api/index.ts";
import { registerIoPlugin } from "./io/plugin/index.ts";
import { registerControlPlugin } from "../control/index.ts";
import { registerSystemHttpHandlers } from "./protocol/http/handlers/system.ts";
import { prependSocketIoPrivateNetworkAccessHandler } from "./utils/socketio-private-network.ts";

/** CORS for Fastify routes; PNA request header must be allowed on preflight from public PWAs to LAN relay. */
const fastifyCorsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Request-Private-Network",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Cache-Control",
        "X-Access-Secret",
        "X-Access-Key"
    ],
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
} as const;

export type CWSPStartOptions = {
    configDir?: string;
    configPath?: string;
    dataDir?: string;
    httpsOptions?: any;
    logger?: boolean;
} & ServerV2BootstrapOptions;

export const createCWSPRuntime = async (options: CWSPStartOptions = {}) => {
    const bootstrap = applyServerV2Bootstrap(options);
    reloadPortableConfigState();
    const engine = createServerV2Engine();
    const fastify = await loadFastifyFactory();

    const moduleDir = moduleDirname(import.meta);
    const cwd = bootstrap.configDir || process.cwd();
    const httpsOptions = options.httpsOptions ?? (await loadHttpsOptions({
        httpsConfig: ((engine.config as Record<string, unknown>)?.https as Record<string, any>) || {},
        moduleDir,
        cwd
    }));

    if (httpsOptions) {
        console.log(
            "[cwsp] TLS: active — Fastify admin + public apps use Node HTTPS; Socket.IO shares those servers (e.g. /socket.io/)."
        );
    } else {
        const httpsCfg = ((engine.config as Record<string, unknown>)?.https as Record<string, unknown>) || {};
        const tlsExplicitlyDisabled =
            String(process.env.CWS_HTTPS_ENABLED ?? "").trim().toLowerCase() === "false" ||
            String(process.env.HTTPS_ENABLED ?? "").trim().toLowerCase() === "false" ||
            httpsCfg.enabled === false;
        if (tlsExplicitlyDisabled) {
            console.log(
                "[cwsp] TLS: off by config/env — HTTP only (admin :8080, public :80 when defaults apply)."
            );
        } else {
            console.warn(
                "[cwsp] TLS: off — serving HTTP only (typical admin :8080, public :80). " +
                    "AirPad / extensions polling https://LAN:8443 or :443 will get ERR_CONNECTION_REFUSED until TLS loads " +
                    "(see [core-backend] HTTPS disabled… above). Add https/local/multi.{key,crt} or https/certificate.mjs next to the bundle, or CWS_HTTPS_KEY / CWS_HTTPS_CERT."
            );
        }
    }

    // 1. Admin/System Server (8080/8443)
    const adminApp = fastify({
        logger: options.logger ?? true,
        ...(httpsOptions ? { https: httpsOptions } : {})
    });

    await adminApp.register(cors, fastifyCorsOptions as any);
    await adminApp.register(formbody);
    await registerSystemHttpHandlers(adminApp);

    // 2. Public Frontend Server (80/443)
    const publicApp = fastify({
        logger: options.logger ?? true,
        ...(httpsOptions ? { https: httpsOptions } : {})
    });

    await publicApp.register(cors, fastifyCorsOptions as any);
    await publicApp.register(formbody);

    // Register Plugins (IO first: Socket.IO + wsHub for transport HTTP handlers)
    await registerControlPlugin(adminApp, { engine, bootstrap });
    await registerIoPlugin(adminApp, publicApp, { engine, bootstrap });
    await registerApiPlugin(adminApp, publicApp, { engine, bootstrap });
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
            const publicOptional =
                String(process.env.CWS_EMBEDDED_WEBVIEW || "").trim() === "1" ||
                String(process.env.CWS_PUBLIC_OPTIONAL || "").trim() === "1";

            const parseFallbackPublicPorts = (): number[] => {
                const raw = String(process.env.CWS_PUBLIC_FALLBACK_PORTS || "").trim();
                if (raw) {
                    return raw
                        .split(/[,;\s]+/)
                        .map((s) => parseInt(s.trim(), 10))
                        .filter((n) => Number.isFinite(n) && n > 0 && n < 65536);
                }
                return isHttps ? [8444, 9443, 7443] : [8081, 8888, 3000];
            };

            /** Bound public port (may differ from config when 80/443 are unavailable). */
            let effectivePublicPort = publicPort;

            const originHint = (port: number = effectivePublicPort) => {
                const host = advertiseHost || (listenHost === "0.0.0.0" ? "<this-machine-LAN-IP>" : listenHost);
                const scheme = isHttps ? "https" : "http";
                const portSuffix =
                    (isHttps && port === 443) || (!isHttps && port === 80) ? "" : `:${port}`;
                return `${scheme}://${host}${portSuffix}/`;
            };

            let adminBound = false;
            let publicBound = false;

            try {
                await adminApp.listen({ host: listenHost, port: adminPort });
                adminBound = true;
                prependSocketIoPrivateNetworkAccessHandler(adminApp.server);
                console.log(`[cwsp] Admin server listening on ${isHttps ? "https" : "http"}://${listenHost}:${adminPort}`);
            } catch (err) {
                console.error(`[cwsp] Failed to bind Admin port ${adminPort}:`, err);
            }

            const tryBindPublic = async (port: number): Promise<boolean> => {
                if (port === adminPort) {
                    console.warn(
                        `[cwsp] Skipping public bind on ${port} (same as admin port). Use distinct ports or CWS_PUBLIC_FALLBACK_PORTS.`
                    );
                    return false;
                }
                try {
                    await publicApp.listen({ host: listenHost, port });
                    effectivePublicPort = port;
                    publicBound = true;
                    prependSocketIoPrivateNetworkAccessHandler(publicApp.server);
                    console.log(
                        `[cwsp] Public server listening on ${isHttps ? "https" : "http"}://${listenHost}:${port}`
                    );
                    if (port !== publicPort) {
                        console.log(
                            `[cwsp] Public UI is not on default ${isHttps ? "443" : "80"} — point Electron/WebView or LAN browsers to ${originHint(port)} ` +
                                `(set CWS_PUBLIC_HTTPS_PORT / CWS_PUBLIC_HTTP_PORT to make this the primary port).`
                        );
                    }
                    if (listenHost === "0.0.0.0") {
                        console.log(
                            `[cwsp] Browsers cannot open https://0.0.0.0/ — use your LAN IP (e.g. https://192.168.0.200/). ` +
                                `Set CWS_ADVERTISE_HOST=192.168.0.200 to print an exact URL below.`
                        );
                    }
                    if (advertiseHost) {
                        console.log(`[cwsp] Public app URL hint: ${originHint(port)}`);
                    }
                    return true;
                } catch (err) {
                    console.error(`[cwsp] Failed to bind Public port ${port}:`, err);
                    return false;
                }
            };

            const publicFallbacks = parseFallbackPublicPorts();
            if (!(await tryBindPublic(publicPort))) {
                console.error(
                    `[cwsp] Primary public port ${publicPort} unavailable (in use, permission denied for 80/443, etc.). ` +
                        `Trying fallbacks: ${publicFallbacks.join(", ")}`
                );
                for (const p of publicFallbacks) {
                    if (p === publicPort) continue;
                    if (await tryBindPublic(p)) break;
                }
            }

            if (process.platform === "win32" && listenHost !== "127.0.0.1") {
                const portsMsg = publicBound
                    ? `${adminPort}, ${effectivePublicPort}`
                    : `${adminPort}`;
                console.log(
                    `[cwsp] Windows LAN: if browsers show ERR_CONNECTION_REFUSED to this host, allow inbound TCP ` +
                        `(${portsMsg}) for node.exe in Windows Defender Firewall (Private profile).`
                );
            }

            if (!publicBound) {
                console.error(
                    `[cwsp] Public server did not bind on ${publicPort} or fallbacks. ` +
                        `Electron can use alternate ports once one succeeds; Capacitor/WebView can use bundled UI with admin/API on ${adminPort}.`
                );
                if (!publicOptional) {
                    console.error(
                        "[cwsp] Exiting: no public server (required for browser/PWA entry). " +
                            "Set CWS_PUBLIC_HTTPS_PORT / CWS_PUBLIC_HTTP_PORT, fix port permissions, or set CWS_EMBEDDED_WEBVIEW=1 for admin-only + embedded WebView."
                    );
                    process.exit(1);
                }
                console.warn(
                    "[cwsp] Continuing without public static server (CWS_EMBEDDED_WEBVIEW=1 or CWS_PUBLIC_OPTIONAL=1)."
                );
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
