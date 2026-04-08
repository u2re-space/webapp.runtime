import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "worker_threads";

import { isMainModule } from "../../server/utils/runtime.ts";

// Absolute path: tsx can break new URL(..., import.meta.url) so the worker was resolving to web/fastify/redirect.mjs
const redirectWorkerScript = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "server", "fastify-js", "redirect.mjs");

const runRedirectServer = async () => {
    const redirectWorker = new Worker(redirectWorkerScript, {
        execArgv: ["--experimental-modules"]
    });
    redirectWorker.on("online", () => console.log("Redirect server is running in a separate thread."));
    redirectWorker.on("error", (err) => console.error("Error in redirect server:", err));
    redirectWorker.on("exit", (code) => console.log(`Redirect server exited with code ${code}`));
    return redirectWorker;
};

/**
 * `tsx watch` may preload this module even when the real entry is `server/index.ts`.
 * Avoid importing `./server.ts` (and thus `./router.ts`) unless this file is the process entry.
 */
const startLegacyFastifyEntry = async () => {
    if (!isMainModule(import.meta)) return;

    const skipRedirect = ["1", "true", "yes"].includes(String(process.env.CWS_SKIP_REDIRECT_WORKER || "").trim().toLowerCase());
    if (!skipRedirect) {
        runRedirectServer()?.catch?.(console.warn.bind(console));
    }

    const [{ options }, { default: server }] = await Promise.all([import("./router.ts"), import("./server.ts")]);
    const app = await server();

    try {
        await app.listen({ ...options, port: process.env.PORT || 443 }, (err: Error) => {
            if (err) {
                app.log.error(err);
            }
        })?.catch?.(console.warn.bind(console));
    } catch (e) {
        console.warn(e);
    }
};

startLegacyFastifyEntry();
