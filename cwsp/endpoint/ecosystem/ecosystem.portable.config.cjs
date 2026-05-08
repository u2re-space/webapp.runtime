/**
 * PM2 config for the compiled portable CWSP bundle.
 *
 * AI-READ: use this when the host runs `dist/portable/cwsp.mjs`; use
 * `ecosystem.server.config.cjs` instead when debugging the TypeScript source
 * runtime directly via `tsx server/index.ts`.
 */
const fs = require("node:fs");
const path = require("node:path");
const ROOT_DIR = path.resolve(__dirname, ".");
const distDirCandidates = [path.join(ROOT_DIR, "./dist/portable"), path.join(ROOT_DIR, "dist/portable")];
const distDir = distDirCandidates.find((candidate) => fs.existsSync(candidate)) || distDirCandidates[0];

/**
 * PM2 — **compiled portable** (`npm run build:portable` → `dist/portable/cwsp.mjs`).
 *   cd runtime/cwsp && npm run build:portable && pm2 start ecosystem.portable.config.cjs --only cwsp --update-env
 *
 * For **TS source** (tsx + `server/index.ts`), use `ecosystem.server.config.cjs` instead:
 *   pm2 start ecosystem.server.config.cjs --only cwsp-server --update-env
 */
const resolveValue = (value) => {
    if (Array.isArray(value)) return value.join(",");
    return value && typeof value === "string" ? value.trim() : "";
};

const isPortableArg = (value) => resolveValue(value).length > 0;

const extractArg = (flag) => {
    const args = Array.isArray(process.argv) ? process.argv : [];
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === flag) {
            const next = resolveValue(args[index + 1]);
            if (isPortableArg(next)) return next;
            continue;
        }
        if (arg.startsWith(`${flag}=`)) {
            const next = resolveValue(arg.slice(flag.length + 1));
            if (isPortableArg(next)) return next;
        }
    }
    return "";
};

const toAbsoluteInPortable = (raw) => {
    if (!isPortableArg(raw)) return "";
    return path.isAbsolute(raw) ? raw : path.resolve(distDir, raw);
};

const resolvePortableConfigPath = () => {
    const cli = extractArg("--config");
    const env = resolveValue(process.env.CWS_PORTABLE_CONFIG_PATH);
    if (isPortableArg(cli)) {
        return path.isAbsolute(cli) ? cli : path.resolve(process.cwd(), cli);
    }
    if (isPortableArg(env)) {
        return path.isAbsolute(env) ? env : path.resolve(process.cwd(), env);
    }
    return path.join(distDir, "config", "portable.config.json");
};

const resolvePortableDataPath = () => {
    const cli = extractArg("--data");
    const env = resolveValue(process.env.CWS_PORTABLE_DATA_PATH);
    const source = isPortableArg(cli) ? cli : isPortableArg(env) ? env : "./.data";
    return toAbsoluteInPortable(source);
};

const readLauncherEnv = (portableConfigPath) => {
    if (!portableConfigPath) return {};
    try {
        const raw = fs.readFileSync(portableConfigPath, "utf8");
        const parsed = JSON.parse(raw);
        const launcherEnv = parsed && typeof parsed === "object" ? parsed.launcherEnv : undefined;
        if (!launcherEnv || typeof launcherEnv !== "object") return {};
        return Object.fromEntries(
            Object.entries(launcherEnv).map(([key, value]) => {
                if (Array.isArray(value)) return [key, value.join(",")];
                return [key, value];
            })
        );
    } catch {
        return {};
    }
};

const portableConfigPath = resolvePortableConfigPath();
const portableDataPath = resolvePortableDataPath();
const launcherEnv = readLauncherEnv(portableConfigPath);
const envFromFile = Object.assign({}, launcherEnv, {
    CWS_PORTABLE_CONFIG_PATH: portableConfigPath || path.join(distDir, "config", "portable.config.json"),
    CWS_PORTABLE_DATA_PATH: portableDataPath || path.join(ROOT_DIR, ".data")
});

const normalizeEnvValue = (value) => {
    if (Array.isArray(value)) return value.join(",");
    if (value === true || value === false || typeof value === "number") return String(value);
    return resolveValue(value);
};

for (const [key, value] of Object.entries(envFromFile)) {
    envFromFile[key] = normalizeEnvValue(value);
}

if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_HTTPS_ENABLED")) {
    envFromFile.CWS_HTTPS_ENABLED = "true";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_NETWORK_SCHEMA_VERSION")) {
    envFromFile.CWS_NETWORK_SCHEMA_VERSION = "2";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_COORDINATOR_MODE")) {
    envFromFile.CWS_COORDINATOR_MODE = "unified";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_COMPAT_SOCKETIO")) {
    envFromFile.CWS_COMPAT_SOCKETIO = "false";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CORS_ALLOW_PRIVATE_NETWORK")) {
    envFromFile.CORS_ALLOW_PRIVATE_NETWORK = "true";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_COEP_POLICY")) {
    envFromFile.CWS_COEP_POLICY = "unsafe-none";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_COOP_POLICY")) {
    envFromFile.CWS_COOP_POLICY = "same-origin-allow-popups";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_CORP_POLICY")) {
    envFromFile.CWS_CORP_POLICY = "cross-origin";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_CSP_ENABLED")) {
    envFromFile.CWS_CSP_ENABLED = "true";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_ELECTRON_WEB_SECURITY")) {
    envFromFile.CWS_ELECTRON_WEB_SECURITY = "true";
}
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_ELECTRON_ALLOW_INSECURE_CONTENT")) {
    envFromFile.CWS_ELECTRON_ALLOW_INSECURE_CONTENT = "true";
}

module.exports = {
    apps: [
        {
            name: "cwsp",
            script: "cwsp.mjs",
            cwd: distDir,
            interpreter: "node",
            instances: 1,
            autorestart: true,
            max_restarts: 30,
            min_uptime: "10s",
            env: {
                NODE_ENV: "production",
                ...envFromFile
            },
            env_production: {
                NODE_ENV: "production",
                ...envFromFile
            }
        }
    ]
};
