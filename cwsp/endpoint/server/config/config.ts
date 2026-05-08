import { readServerV2ConfigSnapshot } from "./storage.ts";

/** Lazy view — snapshot must not be fixed at import time (runs before `reloadPortableConfigState()`). */
const config = new Proxy({} as Record<string, unknown>, {
    get(_target, prop: string | symbol) {
        if (typeof prop !== "string") return undefined;
        return (readServerV2ConfigSnapshot() as Record<string, unknown>)[prop];
    }
});

export default config;
export * from "./settings.ts";
export * from "./storage.ts";
