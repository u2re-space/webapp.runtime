import { Server as HttpsServer } from "node:https";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import {
    defaultPublicHttpPortForPlatform,
    defaultPublicHttpsPortForPlatform,
    isMainModule,
    moduleDirname
} from "./utils/runtime.ts";
import { applyServerV2Bootstrap, type ServerV2BootstrapOptions } from "./config/bootstrap.ts";
import { reloadPortableConfigState } from "./config/storage.ts";
import { createServerV2Engine } from "./config/engine.ts";
import { loadHttpsOptions } from "./utils/certificate.ts";
import { loadFastifyFactory } from "./utils/fastify-loader.ts";

// Plugins
import { registerWebPlugin } from "../frontend/index.ts";
import { registerApiPlugin } from "./fastify/api/index.ts";
import { registerIoPlugin } from "./inputs/plugin/index.ts";
import { registerControlPlugin } from "./fastify/control/index.ts";
import { registerSystemHttpHandlers } from "./fastify/handlers/system.ts";
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
            console.log(
                `[cwsp] boot pid=${process.pid} — unified CWSP (admin + public Fastify). ` +
                    `Logs tagged [server-v2] + endpoint portable.config are a different process, not this binary.`
            );
            const isHttps = adminApp.server instanceof HttpsServer;
            
            // Admin Port
            const adminHttpsPort = engine.profile.httpsPort || 8443;
            const adminHttpPort = engine.profile.httpPort || 8080;
            const adminPort = isHttps ? adminHttpsPort : adminHttpPort;
            
            // Public Port (frontend / primary browser entry; config: publicListenPort / publicHttpPort)
            const publicHttpsRaw = Number(engine.config.publicListenPort);
            const publicHttpRaw = Number(engine.config.publicHttpPort);
            const publicHttpsPort =
                Number.isFinite(publicHttpsRaw) && publicHttpsRaw > 0
                    ? publicHttpsRaw
                    : defaultPublicHttpsPortForPlatform();
            const publicHttpPort =
                Number.isFinite(publicHttpRaw) && publicHttpRaw > 0
                    ? publicHttpRaw
                    : defaultPublicHttpPortForPlatform();
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

            const parseAdminFallbackPorts = (): number[] => {
                const raw = String(process.env.CWS_ADMIN_FALLBACK_PORTS || "").trim();
                if (raw) {
                    return raw
                        .split(/[,;\s]+/)
                        .map((s) => parseInt(s.trim(), 10))
                        .filter((n) => Number.isFinite(n) && n > 0 && n < 65536);
                }
                return isHttps ? [8445, 18443, 9444, 7444] : [8082, 18080, 8889, 9090];
            };

            /** Bound public port (may differ from config when 80/443 are unavailable). */
            let effectivePublicPort = publicPort;
            /** Bound admin port (may differ when primary is EADDRINUSE, e.g. legacy `server-v2` still on :8443). */
            let effectiveAdminPort = adminPort;

            const originHint = (port: number = effectivePublicPort) => {
                const host = advertiseHost || (listenHost === "0.0.0.0" ? "<this-machine-LAN-IP>" : listenHost);
                const scheme = isHttps ? "https" : "http";
                const portSuffix =
                    (isHttps && port === 443) || (!isHttps && port === 80) ? "" : `:${port}`;
                return `${scheme}://${host}${portSuffix}/`;
            };

            let adminBound = false;
            let publicBound = false;

            const adminPrimary = adminPort;
            const adminFallbackList = parseAdminFallbackPorts();
            const adminPortsToTry: number[] = [];
            const adminSeen = new Set<number>();
            for (const p of [adminPrimary, ...adminFallbackList]) {
                if (!adminSeen.has(p) && Number.isFinite(p) && p > 0 && p < 65536) {
                    adminSeen.add(p);
                    adminPortsToTry.push(p);
                }
            }

            const tryBindAdmin = async (port: number): Promise<boolean> => {
                try {
                    await adminApp.listen({ host: listenHost, port });
                    effectiveAdminPort = port;
                    adminBound = true;
                    prependSocketIoPrivateNetworkAccessHandler(adminApp.server);
                    console.log(
                        `[cwsp] Admin server listening on ${isHttps ? "https" : "http"}://${listenHost}:${port}`
                    );
                    if (port !== adminPrimary) {
                        console.warn(
                            `[cwsp] Admin is on ${port} (configured ${adminPrimary} is in use). ` +
                                `Stop the other process (e.g. legacy PM2 \`cws\` / server-v2) or set listenPort / CWS_ADMIN_FALLBACK_PORTS.`
                        );
                    }
                    return true;
                } catch (err: any) {
                    const code = err && typeof err === "object" && "code" in err ? String((err as NodeJS.ErrnoException).code) : "";
                    if (code === "EADDRINUSE") {
                        console.error(`[cwsp] Admin port ${port} already in use (EADDRINUSE), trying next…`);
                    } else {
                        console.error(`[cwsp] Failed to bind Admin port ${port}:`, err);
                    }
                    return false;
                }
            };

            for (const p of adminPortsToTry) {
                if (await tryBindAdmin(p)) break;
            }
            if (!adminBound) {
                console.error(
                    "[cwsp] Admin server did not bind on any of: " +
                        adminPortsToTry.join(", ") +
                        ". Free a port or set CWS_ADMIN_FALLBACK_PORTS / listenPort in portable config."
                );
            }

            const tryBindPublic = async (port: number): Promise<boolean> => {
                if (port === effectiveAdminPort) {
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
            /** Prefer 443/80 first so `https://LAN/` (no explicit port) works when the process can bind it. */
            const buildPublicPortsToTry = (): number[] => {
                const seen = new Set<number>();
                const out: number[] = [];
                const push = (p: number) => {
                    if (Number.isFinite(p) && p > 0 && p < 65536 && !seen.has(p)) {
                        seen.add(p);
                        out.push(p);
                    }
                };
                if (isHttps) push(443);
                else push(80);
                push(publicPort);
                for (const p of publicFallbacks) push(p);
                return out;
            };

            const publicPortsToTry = buildPublicPortsToTry();
            let anyPublicTried = false;
            for (const p of publicPortsToTry) {
                anyPublicTried = true;
                if (await tryBindPublic(p)) break;
            }
            if (!publicBound && anyPublicTried) {
                console.error(
                    `[cwsp] Public server did not bind on any of: ${publicPortsToTry.join(", ")}. ` +
                        `Check EADDRINUSE / EACCES (privileged ports), or set CWS_PUBLIC_FALLBACK_PORTS.`
                );
            }

            if (process.platform === "win32" && listenHost !== "127.0.0.1") {
                const portsMsg = publicBound
                    ? `${effectiveAdminPort}, ${effectivePublicPort}`
                    : `${effectiveAdminPort}`;
                console.log(
                    `[cwsp] Windows LAN: if browsers show ERR_CONNECTION_REFUSED to this host, allow inbound TCP ` +
                        `(${portsMsg}) for node.exe in Windows Defender Firewall (Private profile).`
                );
            }
            if (process.platform === "linux" && listenHost !== "127.0.0.1") {
                const portsMsg = publicBound
                    ? `${effectiveAdminPort}, ${effectivePublicPort}`
                    : `${effectiveAdminPort}`;
                console.log(
                    `[cwsp] Linux LAN: if ERR_CONNECTION_REFUSED, open TCP ${portsMsg} in ufw/firewalld/nftables ` +
                        `and use the URL printed above. For :443/:80 without root, grant cap_net_bind_service to ` +
                        `the Node binary (setcap) or front with a proxy; fallbacks (e.g. :8444) are tried automatically.`
                );
            }

            if (!publicBound) {
                console.error(
                    `[cwsp] Public static server is down; admin/API (if bound) is on ${effectiveAdminPort}. ` +
                        `Fix public bind (ports tried: ${publicPortsToTry.join(", ")}) or set CWS_PUBLIC_FALLBACK_PORTS.`
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

            const scheme = isHttps ? "https" : "http";
            console.log(
                `[cwsp] PORTS: admin ${adminBound ? "up" : "DOWN"} ${scheme}://:${effectiveAdminPort} | public ` +
                    `${publicBound ? "up" : "DOWN"} ${scheme}://:${effectivePublicPort} ` +
                    `(tried public TCP: ${publicPortsToTry.join(", ")}; implicit browser URL uses :443 or :80 when bound)`
            );
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
