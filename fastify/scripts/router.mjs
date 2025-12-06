import cors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import fastifyCaching from "@fastify/caching"
import fastifyCompress from "@fastify/compress"
import Etag from "@fastify/etag"
import fs from "fs/promises"
import path from "node:path"
import zlib from "node:zlib"

//
const probeDirectory = async (dirList, agr = "local/", testFile = "certificate.crt") => {
    for (const dir of dirList) {
        let check = null;
        try {
            check = await fs
                .stat(path.resolve(import.meta.dirname, dir + agr, testFile))
                .catch(() => false);
        } catch(e) {
            console.warn(e);
        }
        if (check) {
            return path.resolve(import.meta.dirname, dir);
        }
    }
    return path.resolve(import.meta.dirname, dirList[0]);
};

//
export const UUIDv4 = () => {
    return (crypto?.randomUUID ? crypto?.randomUUID() : ("10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16))));
};

//
const DIRNAME = "webapp.runtime";
const __dirname = (await probeDirectory(["../../frontend", "../frontend", "./frontend", "../../"+DIRNAME+"/frontend", "../"+DIRNAME+"/frontend", "./"+DIRNAME+"/frontend"], "./", "index.html"));
const LOADER = fs.readFile(path.resolve(__dirname, "index.html"), {encoding: 'utf-8'});

//
export default async function (fastify, options = {}) {
    if (!fastify) throw Error("No Fastify...");

    //
    await fastify.register(fastifyCompress, {
        global: true,
        inflateIfDeflated: true,
        encodings: ["deflate", "gzip", "brotli"],
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

    //
    await fastify.register(Etag, { algorithm: "fnv1a" });
    await fastify.register(fastifyCaching, {
        cacheSegment: UUIDv4(),
        expiresIn: 1800,
        privacy: fastifyCaching.privacy.PUBLIC
    });

    //
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
            "img-src 'self' * blob: data:;" +
            "style-src 'self' 'unsafe-inline' blob: data:;" +
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
        reply.header("Cache-Control", cacheControl);
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

    //
    const CODE = await LOADER;

    //
    fastify.get('/health', async () => ({ ok: true }));
    fastify.get('/', async (req, reply) => {
        const links = [
            '</apps/cw/index.js>; rel=modulepreload; as=script; crossorigin; fetchpriority=high',
            '</init.mjs>; rel=modulepreload; as=script; crossorigin',
            '</load.mjs>; rel=modulepreload; as=script; crossorigin',
            '</vital.mjs>; rel=modulepreload; as=script; crossorigin',
        ];
        if (reply.raw.writeEarlyHints) {
            reply.raw.writeEarlyHints({ link: links });
        }
        return reply?.code(200)?.header?.('Content-Type', 'text/html; charset=utf-8')?.type?.('text/html')?.send?.(CODE)
    });

    //
    //await fastify.register(fastifyStatic, { prefix: "/", root: path.resolve(__dirname, "./"), decorateReply: true, list: true, });
    await fastify.register(async (instance) => {
        instance.addHook("onRequest", async (req, reply) => {
            const timeout = 5000;
            if (req.raw.setTimeout) req.raw.setTimeout(timeout, () => {
                req.raw.destroy(new Error("Timeout"));
            });
            if (req.raw.stream && req.raw.stream.setTimeout) req.raw.stream.setTimeout(timeout, () => {
                req.raw.stream.destroy(new Error("Timeout"));
            });
        });
        await instance.register(fastifyStatic, {
            decorateReply: true, list: true,
            root: path.resolve(__dirname, '../frontend/'),
            prefix: '/',
            setHeaders: (res, filePath) => {
                if (/\.(?:[a-f0-9]{8,})\.(css|js|mjs|woff2|png|webp|svg)$/.test(filePath)) {
                    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                    if (/\.(css)$/.test(filePath)) res.setHeader('Priority', 'u=0');        // выше
                    if (/\.(js|mjs)$/.test(filePath)) res.setHeader('Priority', 'u=1');
                    if (/\.(woff2)$/.test(filePath)) res.setHeader('Priority', 'u=2');
                } else {
                    res.setHeader('Cache-Control', 'public, max-age=1800');
                }
            },
        });
    });
}

//
let port = 443;
if (Array.from(process.argv).some((e) => e.endsWith("port"))) {
    const index = Array.from(process.argv).findIndex((e) => e.endsWith("port"));
    port = parseInt(process.argv[index + 1]);
}

//
export const options = {
    http2: true,
    esm: true,
    debug: true,
    logger: true,
    ignoreTrailingSlash: true,
    port: port || 443,
    https: { allowHTTP1: true, ...(Array.from(process.argv).some((e) => e.endsWith("no-https")) ? {} : (await import("file://" + (await probeDirectory(["../../https/", "../https/", "./https/"]) + "/certificate.mjs"))).default)},
    address: "0.0.0.0",
    host: "0.0.0.0",
};
