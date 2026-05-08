import { createRequire } from "node:module";
import path from "node:path";
import type { FastifyInstance } from "fastify";

export type FastifyFactory = (opts?: Record<string, unknown>) => FastifyInstance;

const pickFactory = (m: unknown): FastifyFactory | undefined => {
    if (!m || typeof m !== "object") return undefined;
    const rec = m as Record<string, unknown>;
    const f = rec.fastify ?? rec.default;
    return typeof f === "function" ? (f as FastifyFactory) : undefined;
};

/** tsx breaks `import("fastify")` and `require("fastify")` — load the published CJS entry by path. */
const loadFastifyFromCjsFile = (): FastifyFactory => {
    const require = createRequire(import.meta.url);
    const pkgJson = require.resolve("fastify/package.json");
    const fastifyJs = path.join(path.dirname(pkgJson), "fastify.js");
    const mod = require(fastifyJs) as unknown;
    if (typeof mod === "function") return mod as FastifyFactory;
    const fromObj = pickFactory(mod);
    if (fromObj) return fromObj;
    throw new Error("[cwsp] fastify.js did not export a factory function");
};

/**
 * `tsx` (and `node --import tsx`) can yield an empty namespace for `import("fastify")` and an empty
 * object for `require("fastify")`. Plain `node` resolves the package normally.
 */
export const loadFastifyFactory = async (): Promise<FastifyFactory> => {
    try {
        const m = (await import("fastify")) as Record<string, unknown>;
        const fromEsm = pickFactory(m);
        if (fromEsm) return fromEsm;
    } catch {
        /* fall through to CJS file */
    }

    return loadFastifyFromCjsFile();
};
