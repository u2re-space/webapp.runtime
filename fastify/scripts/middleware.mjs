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
        reply.header("Access-Control-Allow-Methods", "*");
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "*");
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
        if (!reply.getHeader("Cache-Control")) {
            reply.header("Cache-Control", cacheControl);
        }
        reply.header("Service-Worker-Allowed", "/");
        reply.removeHeader("Clear-Site-Data");
        next();
    });

    //
    fastify.register(cors, {
        hook: "preHandler",
        delegator: (req, callback) => {
            const corsOptions = { origin: false };
            callback(null, corsOptions);
        },
        origin: "*",
        allowedHeaders:
            "Cache-Control, Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Service-Worker-Allowed, X-Access-Secret, X-Access-Key",
        cacheControl,
    });
}