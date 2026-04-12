import type { FastifyInstance } from "fastify";

import { aiHttpBranch } from "./branches/ai.ts";
import { assetsHttpBranch } from "./branches/assets.ts";
import { authHttpBranch } from "./branches/auth.ts";
import { bridgeHttpBranch } from "./branches/bridge.ts";
import { clipboardHttpBranch } from "./branches/clipboard.ts";
import { dispatchHttpBranch } from "./branches/dispatch.ts";
import { fallbackHttpBranch } from "./branches/fallback.ts";
import { networkHttpBranch } from "./branches/network.ts";
import { opsHttpBranch } from "./branches/ops.ts";
import { requestHttpBranch } from "./branches/request.ts";
import { reverseHttpBranch } from "./branches/reverse.ts";
import { settingsHttpBranch } from "./branches/settings.ts";
import { storageHttpBranch } from "./branches/storage.ts";
import { systemHttpBranch } from "./branches/system.ts";
import type { ServerV2Http, ServerV2HttpBranch } from "./types.ts";

const SERVER_V2_HTTP_BRANCHES: ServerV2HttpBranch[] = [
    systemHttpBranch,
    assetsHttpBranch,
    settingsHttpBranch,
    authHttpBranch,
    storageHttpBranch,
    aiHttpBranch,
    clipboardHttpBranch,
    requestHttpBranch,
    dispatchHttpBranch,
    reverseHttpBranch,
    networkHttpBranch,
    opsHttpBranch,
    bridgeHttpBranch,
    fallbackHttpBranch
];

const cloneBranch = (branch: ServerV2HttpBranch): ServerV2HttpBranch => ({
    ...branch,
    routes: branch.routes.map((route) => ({ ...route }))
});

export const listServerV2HttpBranches = (): ServerV2HttpBranch[] => {
    return SERVER_V2_HTTP_BRANCHES.map(cloneBranch);
};

export const createServerV2Http = (): ServerV2Http => {
    const branches = listServerV2HttpBranches();

    return {
        branches,
        describe: () => branches.map(cloneBranch),
        getBranch: (id: string) => {
            const normalized = String(id || "").trim().toLowerCase();
            return branches.find((branch) => branch.id === normalized);
        },
        listRoutes: () =>
            branches.flatMap((branch) =>
                branch.routes.map((route) => ({
                    ...route,
                    branchId: branch.id
                }))
            ),
        register: async (
            app: FastifyInstance,
            options: {
                branchIds?: string[];
                networkContext?: any;
                socketIoBridge?: any;
                wsHub?: any;
            } = {}
        ) => {
            const selected = options.branchIds?.length
                ? branches.filter((branch) => options.branchIds?.includes(branch.id))
                : branches;

            for (const branch of selected) {
                if (!branch.register) continue;
                await branch.register({
                    app,
                    networkContext: options.networkContext,
                    socketIoBridge: options.socketIoBridge,
                    wsHub: options.wsHub
                });
            }
        }
    };
};

export type { ServerV2HttpBranch, ServerV2HttpRoute, ServerV2HttpBranchMountContext, ServerV2Http } from "./types.ts";
export * from "./fastify.ts";
export * from "./routers/index.ts";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "worker_threads";

import { isMainModule } from "../utils/runtime.ts";

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
