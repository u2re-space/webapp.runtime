#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { resolveCwspServerLayoutRoot } from "./stage-cwsp-server-runtime.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);
const configDir = join(layoutRoot, "config");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, payload) => {
    await writeFile(path, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
};

const loadPortableProfileModule = async () => {
    const profileModulePath = join(configDir, "portable.profiles.mjs");
    const moduleNs = await import(pathToFileURL(profileModulePath).href);
    return {
        PORTABLE_MODULES_BY_SCOPE: moduleNs.PORTABLE_MODULES_BY_SCOPE || {},
        PORTABLE_CORE_PAYLOAD: moduleNs.PORTABLE_CORE_PAYLOAD || {},
        PORTABLE_ENDPOINT_PAYLOAD: moduleNs.PORTABLE_ENDPOINT_PAYLOAD || {},
        PORTABLE_CONFIG_PROFILES: moduleNs.PORTABLE_CONFIG_PROFILES || {}
    };
};

const mergePortableConfig = (base, profilePath, profile, modulesByScope) => {
    const launcherEnv = { ...(base.launcherEnv || {}) };
    launcherEnv.CWS_PORTABLE_CONFIG_PATH = profile.envConfigPath || `./${profilePath}`;
    launcherEnv.CWS_PORTABLE_DATA_PATH = launcherEnv.CWS_PORTABLE_DATA_PATH || "./.data";
    // Config-centric defaults: paths are resolved against config dir first.
    launcherEnv.CWS_HTTPS_KEY = process.env.CWS_HTTPS_KEY || launcherEnv.CWS_HTTPS_KEY || "fs:../https/local/multi.key";
    launcherEnv.CWS_HTTPS_CERT = process.env.CWS_HTTPS_CERT || launcherEnv.CWS_HTTPS_CERT || "fs:../https/local/multi.crt";
    launcherEnv.CWS_HTTPS_CA = process.env.CWS_HTTPS_CA || launcherEnv.CWS_HTTPS_CA || "fs:../https/local/rootCA.crt";
    launcherEnv.CWS_HTTPS_CERT_MODULE =
        process.env.CWS_HTTPS_CERT_MODULE ||
        process.env.CWS_HTTPS_CERTIFICATE_MODULE ||
        launcherEnv.CWS_HTTPS_CERT_MODULE ||
        "fs:./certificate.mjs";

    const remoteBase = { ...(base.remote || {}) };
    const rawCandidates = [
        ...(Array.isArray(remoteBase.pathCandidates) ? remoteBase.pathCandidates : []),
        ...(Array.isArray(profile.remote?.pathCandidates) ? profile.remote.pathCandidates : [])
    ]
        .map((entry) => String(entry || "").trim())
        .filter(Boolean);

    const modulesScope = profile.modulesScope || "rootLike";
    const portableModules = modulesByScope[modulesScope] || modulesByScope.rootLike || {};

    return {
        ...base,
        portableModules: { ...portableModules },
        remote: {
            ...remoteBase,
            pathCandidates: [...new Set(rawCandidates)]
        },
        launcherEnv
    };
};

const main = async () => {
    const {
        PORTABLE_MODULES_BY_SCOPE,
        PORTABLE_CORE_PAYLOAD,
        PORTABLE_ENDPOINT_PAYLOAD,
        PORTABLE_CONFIG_PROFILES
    } = await loadPortableProfileModule();

    await writeJson(join(configDir, "portable-core.json"), PORTABLE_CORE_PAYLOAD);
    await writeJson(join(configDir, "portable-endpoint.json"), PORTABLE_ENDPOINT_PAYLOAD);
    console.log("[generate-portable-configs] wrote config/portable-core.json + config/portable-endpoint.json");

    for (const [profilePath, profile] of Object.entries(PORTABLE_CONFIG_PROFILES)) {
        const targetPath = join(layoutRoot, profilePath);
        const current = await readJson(targetPath);
        const next = mergePortableConfig(current, profilePath, profile, PORTABLE_MODULES_BY_SCOPE);
        await writeJson(targetPath, next);
        console.log(`[generate-portable-configs] normalized ${profilePath}`);
    }
};

main().catch((error) => {
    console.error("[generate-portable-configs]", error);
    process.exit(1);
});
