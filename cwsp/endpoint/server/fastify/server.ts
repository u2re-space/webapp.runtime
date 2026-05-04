/**
 * Legacy-style Fastify server factory kept for codepaths that still expect a
 * single Fastify app instance.
 *
 * AI-READ: the newer deployed runtime is assembled in `server/index.ts`, but
 * this helper remains useful for tests, local bootstraps, and older imports.
 */
import closeWithGrace from "close-with-grace";

import { loadFastifyFactory } from "../utils/fastify-loader.ts";

// Import your application
import appService, { options } from "./router.ts";

/** Build one Fastify app instance, register routes, and attach graceful-close hooks. */
export const server = async () => {
    const build = await loadFastifyFactory();

    const app = build({
        ...options,
        logger: true,
    });

    // Register your application as a normal plugin.
    app.register(appService);

    // delay is the number of milliseconds for the graceful close to finish
    const closeListeners = closeWithGrace(
        { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
        async function ({ signal, err, manual }) {
            if (err) {
                app.log.error(err);
            }
            await app.close();
        }
    );

    //
    app.addHook("onClose", async (instance, done) => {
        closeListeners.uninstall();
        done();
    });

    //
    return app;
};

//
export default server;
