import cors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import fastifyCaching from "@fastify/caching"
import fastifyCompress from "@fastify/compress"
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
    await fastify.register(fastifyCaching, {
        cacheSegment: UUIDv4(),
        expiresIn: 3600,
        privacy: fastifyCaching.privacy.PUBLIC
    });

    //
    await fastify.register(fastifyCompress, {
        global: true,
        inflateIfDeflated: true,
        encodings: ["deflate", "gzip", "brotli"],
        threshold: 128,
        brotliOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 2,
            },
        },
        encodings: ['br', 'deflate', 'gzip', 'identity'],
        zlibOptions: { level: 2 },
    });

    //
    const cacheControl = [
        `no-store`,
        `public`,
        `proxy-revalidate`,
        `must-revalidate`,
        `max-age=10800`,
        `stale-while-revalidate=86400`,
        `stale-if-error=86400`,
        `max-stale=86400`,
    ].join(", ");

    //
    fastify.addHook("onSend", function (req, reply, payload, next) {
        reply.header("Cross-Origin-Embedder-Policy", "require-corp");
        reply.header("Cross-Origin-Opener-Policy", "same-origin");
        reply.header("Content-Security-Policy", 
            "default-src 'self' blob: data:;" +
            "img-src 'self' * blob: data:;" +
            "style-src 'self' 'unsafe-inline' blob: data:;" +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' node: blob: data:;" + //'strict-dynamic'
            "script-src-elem 'self' 'unsafe-inline' node: blob: data:;" +
            "worker-src 'self' blob:* data:*;");

        reply.header("Access-Control-Allow-Methods", "*");
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "Cache-Control, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed, X-Access-Secret, X-Access-Key");
        reply.header(
            "Permissions-Policy",
            [
                "storage-access=*",
                "fullscreen=*",
                "gyroscope=*",
                "window-management=*",
                "picture-in-picture=*",
                "magnetometer=*",
                "execution-while-out-of-viewport=*",
                "execution-while-not-rendered=*",
                "document-domain=*",
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
            "Cache-Control, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed, X-Access-Secret, X-Access-Key",
        cacheControl,
    });

    //
    const CODE = await LOADER;
    
    //
    fastify.get('/', options, (request, reply) => {
        reply?.code(200)?.header?.('Content-Type', 'text/html; charset=utf-8')?.type?.('text/html')?.send?.(CODE)
    });

    //
    fastify.register(fastifyStatic, { prefix: "/", root: path.resolve(__dirname, "./"), decorateReply: true, list: true, });
    /*fastify.register(fastifyStatic, { prefix: "/externals/", root: path.resolve(__dirname, "./externals/"), list: true, });
    fastify.register(fastifyStatic, { prefix: "/assets/", root: path.resolve(__dirname, "./assets/"), list: true, });
    fastify.register(fastifyStatic, { prefix: "/pwa/", root: path.resolve(__dirname, "./pwa/"), list: true, });
    fastify.register(fastifyStatic, { prefix: "/app/", root: path.resolve(__dirname, "./app/"), list: true, });*/
}

//
let port = 443;
if (Array.from(process.argv).some((e) => e.endsWith("port"))) {
    const index = Array.from(process.argv).findIndex((e) => e.endsWith("port"));
    port = parseInt(process.argv[index + 1]);
}

//
export const options = {
    esm: true,
    debug: true,
    logger: true,
    ignoreTrailingSlash: true,
    port,
    https: Array.from(process.argv).some((e) => e.endsWith("no-https"))
        ? null
        : (await import("file://" + (await probeDirectory(["../../https/", "../https/", "./https/"]) + "/certificate.mjs"))).default,
    address: "0.0.0.0",
    host: "0.0.0.0",
};
