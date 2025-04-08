import { options } from "./router.mjs";
import server from "./server.mjs";
import { Worker } from 'worker_threads';
import path from 'path';

//
const runRedirectServer = async () => {
    const redirectWorker = new Worker('./scripts/redirect.mjs', { execArgv: ['--experimental-modules'] });
    redirectWorker.on('online', () => console.log('Redirect server is running in a separate thread.'));
    redirectWorker.on('error', (err) => console.error('Error in redirect server:', err));
    redirectWorker.on('exit', (code) => console.log(`Redirect server exited with code ${code}`));
    return redirectWorker;
};

//
runRedirectServer()?.catch?.(console.warn.bind(console));

//
const app = await server();

// Start listening.
try {
    await app.listen({ ...options, port: process.env.PORT || 443 }, (err) => {
        if (err) {
            app.log.error(err);
        }
    })?.catch?.(console.warn.bind(console));
} catch (e) {
    console.warn(e);
}
