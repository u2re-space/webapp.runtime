import closeWithGrace from "close-with-grace";

import { loadFastifyFactory } from "../utils/fastify-loader.ts";

// Import your application
import appService, { options } from "./router.ts";

//
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
