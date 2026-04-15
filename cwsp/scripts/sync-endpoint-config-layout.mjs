#!/usr/bin/env node
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { resolveCwspServerLayoutRoot } from "./stage-cwsp-server-runtime.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);
const configDir = join(layoutRoot, "config");

const main = async () => {
    void configDir;
    const flatFiles = [
        "clients.json",
        "gateways.json",
        "network.json",
        "portable.config.json",
        "portable.config.110.json",
        "portable.config.vds.json",
        "portable-core.json",
        "portable-endpoint.json"
    ];
    for (const name of flatFiles) {
        const target = join(layoutRoot, name);
        await rm(target, { force: true });
        console.log(`[sync-endpoint-config-layout] removed endpoint/${name} (config-only layout)`);
    }
};

main().catch((error) => {
    console.error("[sync-endpoint-config-layout]", error);
    process.exit(1);
});
