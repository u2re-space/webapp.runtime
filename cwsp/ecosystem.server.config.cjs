/**
 * PM2 — CWSP **TypeScript** entry (`server/index.ts` via tsx), cwd = cwsp package root.
 *
 *   cd runtime/cwsp && pm2 start ecosystem.server.config.cjs --only cwsp-server --update-env
 *
 * Same layout as `npm run deploy:server:ssh` target: `server/`, `web/`, `package.json`, `portable.config.json`.
 * Merges `launcherEnv` from `portable.config.json` (and optional `--config` / `--data` CLI args to pm2).
 */
const fs = require("fs");
const path = require("path");

const NODE_BIN = process.execPath;

const resolveValue = (value) => {
    if (Array.isArray(value)) return value.join(",");
    return value && typeof value === "string" ? value.trim() : "";
};
const isPortableConfigArg = (value) => resolveValue(value).length > 0;

const extractArg = (flag) => {
    const args = Array.isArray(process.argv) ? process.argv : [];
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === flag) {
            const next = resolveValue(args[index + 1]);
            if (isPortableConfigArg(next)) return next;
            continue;
        }
        if (arg.startsWith(`${flag}=`)) {
            const next = resolveValue(arg.slice(flag.length + 1));
            if (isPortableConfigArg(next)) return next;
        }
    }
    return "";
};

const extractConfigArg = () => extractArg("--config");
const extractDataArg = () => extractArg("--data");

const defaultConfigPath = path.join(__dirname, "portable.config.json");

const resolvePortableConfigPath = () => {
    const explicitArg = resolveValue(extractConfigArg());
    const explicitEnv = resolveValue(process.env.CWS_PORTABLE_CONFIG_PATH);
    const source = isPortableConfigArg(explicitArg)
        ? explicitArg
        : isPortableConfigArg(explicitEnv)
          ? explicitEnv
          : defaultConfigPath;
    if (!isPortableConfigArg(source)) return "";
    return path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
};

const readLauncherEnv = (portableConfigPath) => {
    if (!isPortableConfigArg(portableConfigPath)) return {};
    try {
        const raw = fs.readFileSync(portableConfigPath, "utf8");
        const parsed = JSON.parse(raw);
        const launcherEnv = parsed && typeof parsed === "object" && parsed.launcherEnv;
        if (!launcherEnv || typeof launcherEnv !== "object") return {};
        return Object.fromEntries(
            Object.entries(launcherEnv)
                .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return [key, value.join(",")];
                    }
                    return [key, value];
                })
                .filter(([, value]) => value !== undefined)
        );
    } catch {
        return {};
    }
};

const portableConfigPath = resolvePortableConfigPath();
const launcherEnv = readLauncherEnv(portableConfigPath);
const envFromFile = Object.assign({}, launcherEnv);
if (portableConfigPath) {
    envFromFile.CWS_PORTABLE_CONFIG_PATH = portableConfigPath;
}

const explicitDataArg = resolveValue(extractDataArg());
if (explicitDataArg) {
    envFromFile.CWS_PORTABLE_DATA_PATH = path.isAbsolute(explicitDataArg)
        ? explicitDataArg
        : path.resolve(process.cwd(), explicitDataArg);
} else if (!resolveValue(envFromFile.CWS_PORTABLE_DATA_PATH)) {
    envFromFile.CWS_PORTABLE_DATA_PATH = path.join(__dirname, ".data");
}

const normalizeEnvValue = (value) => {
    if (Array.isArray(value)) return value.join(",");
    return value === true || value === false || typeof value === "number" ? String(value) : resolveValue(value);
};
for (const [key, value] of Object.entries(envFromFile)) {
    envFromFile[key] = normalizeEnvValue(value);
}

if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_HTTPS_ENABLED")) {
    envFromFile.CWS_HTTPS_ENABLED = "true";
}

module.exports = {
    apps: [
        {
            name: "cwsp",
            cwd: __dirname,
            script: NODE_BIN,
            args: ["./node_modules/tsx/dist/cli.mjs", "server/index.ts"],
            interpreter: "none",
            exec_mode: "fork",
            instances: 1,
            autorestart: true,
            max_restarts: 30,
            min_uptime: "10s",
            windowsHide: true,
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
