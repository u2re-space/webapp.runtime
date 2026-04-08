/**
 * Middleware Module
 *
 * Handles security headers, CORS, compression, and other middleware
 */

import cors from "@fastify/cors"
import fastifyCaching from "@fastify/caching"
import fastifyCompress from "@fastify/compress"
import Etag from "@fastify/etag"
import formbody from "@fastify/formbody"
import multipart from "@fastify/multipart"
import zlib from "node:zlib"

const parseCsv = (value) =>
    String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const NON_HASHED_SCRIPT_STYLE_RE = /\.(js|mjs|css)$/i;
const HASHED_ASSET_RE = /\.[a-f0-9]{8,}\.(css|js|mjs|woff2|png|webp|svg|jpg|jpeg|gif|ico)$/i;

/** Browsers usually send http(s) Origin for pages; some clients echo wss/ws for the socket URL. */
const matchesExactAllowed = (origin, exactAllowed) => {
    if (exactAllowed.has(origin)) return true;
    if (/^wss:\/\//i.test(origin)) {
        return exactAllowed.has(`https://${origin.slice(6)}`);
    }
    if (/^ws:\/\//i.test(origin)) {
        return exactAllowed.has(`http://${origin.slice(5)}`);
    }
    if (/^https:\/\//i.test(origin)) {
        return exactAllowed.has(`wss://${origin.slice(8)}`);
    }
    if (/^http:\/\//i.test(origin)) {
        return exactAllowed.has(`ws://${origin.slice(7)}`);
    }
    return false;
};

const createCorsOriginMatcher = () => {
    const allowAll = String(process.env.CORS_ALLOW_ALL || "").toLowerCase() === "true";
    const configuredOrigins = parseCsv(process.env.CORS_ALLOWED_ORIGINS);
    /**
     * AirPad / sub-clients hit https://<gateway-ip>:8443 — those origins failed before (exact list had no :port).
     * On a dedicated gateway, set CORS_DISABLE_U2RE_DOMAIN=true so only IPs / CORS_ALLOWED_ORIGINS apply.
     */
    const allowU2reDomain =
        String(process.env.CORS_DISABLE_U2RE_DOMAIN || "").toLowerCase() !== "true";

    const exactAllowed = new Set([
        "https://45.147.121.152",
        "http://45.147.121.152",
        "https://100.110.152.73",
        "http://100.110.152.73",
        "https://192.168.0.200",
        "http://192.168.0.200",
        "https://localhost",
        "http://localhost",
        "https://127.0.0.1",
        "http://127.0.0.1",
        ...(allowU2reDomain ? ["https://u2re.space", "https://www.u2re.space"] : []),
        ...configuredOrigins
    ]);

    const webSocketOriginScheme = "(?:https?|wss?)";
    const localhostPattern = new RegExp(
        `^${webSocketOriginScheme}:\\/\\/(localhost|127\\.0\\.0\\.1)(:\\d+)?$`,
        "i"
    );
    const privateLanPattern = new RegExp(
        `^${webSocketOriginScheme}:\\/\\/` +
            `((10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})|(192\\.168\\.\\d{1,3}\\.\\d{1,3})|(172\\.(1[6-9]|2\\d|3[0-1])\\.\\d{1,3}\\.\\d{1,3}))(:\\d+)?$`,
        "i"
    );
    /** http(s) / ws(s) + host:port — WAN IP :8443 etc. */
    const ipv4LiteralOriginPattern = new RegExp(
        `^${webSocketOriginScheme}:\\/\\/(\\d{1,3}\\.){3}\\d{1,3}(:\\d+)?$`,
        "i"
    );
    const u2rePattern = new RegExp(
        `^${webSocketOriginScheme}:\\/\\/([a-z0-9-]+\\.)*u2re\\.space(:\\d+)?$`,
        "i"
    );
    const extensionPattern = /^(chrome-extension|moz-extension):\/\//i;

    return (origin, callback) => {
        if (!origin || allowAll) {
            callback(null, true);
            return;
        }

        if (
            matchesExactAllowed(origin, exactAllowed) ||
            localhostPattern.test(origin) ||
            privateLanPattern.test(origin) ||
            ipv4LiteralOriginPattern.test(origin) ||
            (allowU2reDomain && u2rePattern.test(origin)) ||
            extensionPattern.test(origin)
        ) {
            callback(null, true);
            return;
        }

        callback(null, false);
    };
};

export async function registerMiddleware(fastify, options = {}) {
    // Register form body parser for POST requests
    await fastify.register(formbody);

    // Register multipart for file uploads (share target)
    await fastify.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB max
            files: 10
        }
    });

    // Compression
    await fastify.register(fastifyCompress, {
        global: true,
        inflateIfDeflated: true,
        threshold: 128,
        brotliOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
            },
        },
        encodings: ['br', 'deflate', 'gzip', 'identity'],
        zlibOptions: { level: 4 },
    });

    // ETag & Caching
    await fastify.register(Etag, { algorithm: "fnv1a" });
    await fastify.register(fastifyCaching, {
        cacheSegment: options.cacheSegment || 'crossword-router',
        expiresIn: 1800,
        privacy: fastifyCaching.privacy.PUBLIC
    });

    const cacheControl = [
        `public`,
        `max-age=1800`,
        `stale-while-revalidate=86400`,
        `stale-if-error=86400`,
    ].join(", ");

    //
    fastify.addHook("onSend", function (req, reply, payload, next) {
        reply.header("Cross-Origin-Embedder-Policy", "require-corp");
        reply.header("Cross-Origin-Opener-Policy", "same-origin");
        reply.header("Content-Security-Policy",
            "default-src https: 'self' blob: data:;" +
            "connect-src 'self' https: http: wss: ws: blob: data:;" +
            "img-src 'self' * blob: data:;" +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com blob: data:;" +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' node: blob: data:;" + //'strict-dynamic'
            "script-src-elem 'self' 'unsafe-inline' node: blob: data:;" +
            "worker-src 'self' blob:* data:*;");

        reply.header("Content-Language", "*");
        reply.header("Access-Control-Request-Headers", "*");
        reply.header(
            "Permissions-Policy",
            [
                "clipboard-write=*",
                "clipboard-read=*",
                "microphone=*",
                "geolocation=*",
                "storage-access=*",
                "fullscreen=*",
                "gyroscope=*",
                "window-management=*",
                "picture-in-picture=*",
                "magnetometer=*",
                "accelerometer=*",
                "display-capture=*",
                "serial=*",
            ].join(", ")
        );
        const pathname = String(req?.url || "").split("?")[0];
        const forceNoStoreForNonHashedScripts =
            NON_HASHED_SCRIPT_STYLE_RE.test(pathname) && !HASHED_ASSET_RE.test(pathname);
        if (forceNoStoreForNonHashedScripts) {
            reply.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
            reply.header("Pragma", "no-cache");
            reply.header("Expires", "0");
        } else if (!reply.getHeader("Cache-Control")) {
            reply.header("Cache-Control", cacheControl);
        }
        reply.header("Service-Worker-Allowed", "/");
        reply.removeHeader("Clear-Site-Data");

        const allowPrivateNetwork = process.env.CORS_ALLOW_PRIVATE_NETWORK !== "false";
        const pnaHeader = String(req?.headers?.["access-control-request-private-network"] || "").toLowerCase();
        if (allowPrivateNetwork && pnaHeader === "true") {
            reply.header("Access-Control-Allow-Private-Network", "true");
            const existingVary = String(reply.getHeader("Vary") || "");
            const varyParts = existingVary
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean);
            if (!varyParts.includes("Access-Control-Request-Private-Network")) {
                varyParts.push("Access-Control-Request-Private-Network");
            }
            if (varyParts.length > 0) {
                reply.header("Vary", varyParts.join(", "));
            }
        }
        next();
    });

    //
    await fastify.register(cors, {
        hook: "preHandler",
        strictPreflight: false,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        origin: createCorsOriginMatcher(),
        credentials: true,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders:
            "Cache-Control, Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Service-Worker-Allowed, X-Access-Secret, X-Access-Key, Access-Control-Request-Private-Network",
        exposedHeaders:
            "ETag, Cache-Control, Content-Length, Content-Range, X-File-Name, X-File-Size, X-File-LastModified",
        maxAge: 86400,
        cacheControl,
    });
}
