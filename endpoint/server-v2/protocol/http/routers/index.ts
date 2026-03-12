import type { FastifyInstance } from "fastify";

import { registerClipboardHttpRouter } from "./clipboard/index.ts";
import { registerDispatchHttpRouter } from "./dispatch/index.ts";
import { registerGetterHttpRouter } from "./getter/index.ts";
import { registerHealthHttpRouter } from "./health/index.ts";
import { registerHelloHttpRouter } from "./hello/index.ts";
import { registerOpsHttpRouter } from "./ops/ops.ts";
import { registerProxyHttpRouter } from "./proxy/index.ts";
import { registerSettingsHttpRouter } from "./settings/settings.ts";
import { registerSmsHttpRouter } from "./sms/index.ts";
import { registerStatusHttpRouter } from "./status/index.ts";
import { registerWebdavHttpRouter } from "./webdav/index.ts";

type HttpRouterRegistrar = (app: FastifyInstance, runtimeContext?: any) => Promise<void>;

const SERVER_V2_HTTP_ROUTERS = {
    clipboard: registerClipboardHttpRouter,
    dispatch: registerDispatchHttpRouter,
    getter: registerGetterHttpRouter,
    health: registerHealthHttpRouter,
    hello: registerHelloHttpRouter,
    ops: registerOpsHttpRouter,
    proxy: registerProxyHttpRouter,
    settings: registerSettingsHttpRouter,
    sms: registerSmsHttpRouter,
    status: registerStatusHttpRouter,
    webdav: registerWebdavHttpRouter
} satisfies Record<string, HttpRouterRegistrar>;

export type ServerV2HttpRouterId = keyof typeof SERVER_V2_HTTP_ROUTERS;

export const listServerV2HttpRouters = (): ServerV2HttpRouterId[] => {
    return Object.keys(SERVER_V2_HTTP_ROUTERS) as ServerV2HttpRouterId[];
};

export const registerServerV2HttpRouters = async (
    app: FastifyInstance,
    routerIds: ServerV2HttpRouterId[] = listServerV2HttpRouters(),
    runtimeContext?: any
): Promise<void> => {
    for (const routerId of routerIds) {
        const registrar = SERVER_V2_HTTP_ROUTERS[routerId];
        if (!registrar) continue;
        await registrar(app, runtimeContext);
    }
};

export {
    registerClipboardHttpRouter,
    registerDispatchHttpRouter,
    registerGetterHttpRouter,
    registerHealthHttpRouter,
    registerHelloHttpRouter,
    registerOpsHttpRouter,
    registerProxyHttpRouter,
    registerSettingsHttpRouter,
    registerSmsHttpRouter,
    registerStatusHttpRouter,
    registerWebdavHttpRouter
};
