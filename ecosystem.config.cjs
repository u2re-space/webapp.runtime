/**
 * PM2 — CWSP portable from monorepo `runtime/` (aligned with `endpoint/endpoint/ecosystem.config.cjs`).
 *
 *   cd runtime && pm2 start ecosystem.config.cjs
 *
 * Reads `launcherEnv` from `cwsp/dist/portable/portable.config.json` (or `CWS_PORTABLE_CONFIG_PATH`)
 * so TLS (`CWS_HTTPS_*`) and bridge/Airpad flags match legacy endpoint behavior.
 */
const fs = require("fs");
const path = require("path");

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

const defaultPortableDir = path.join(__dirname, "cwsp", "dist", "portable");
const defaultPortableConfig = path.join(defaultPortableDir, "portable.config.json");

const resolvePortableConfigPath = () => {
    const explicitArg = resolveValue(extractConfigArg());
    const explicitEnv = resolveValue(process.env.CWS_PORTABLE_CONFIG_PATH);
    const source = isPortableConfigArg(explicitArg)
        ? explicitArg
        : isPortableConfigArg(explicitEnv)
          ? explicitEnv
          : defaultPortableConfig;
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
            Object.entries(launcherEnv).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return [key, value.join(",")];
                }
                return [key, value];
            }).filter(([, value]) => value !== undefined)
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
    envFromFile.CWS_PORTABLE_DATA_PATH = path.join(defaultPortableDir, ".data");
}

const normalizeEnvValue = (value) => {
    if (Array.isArray(value)) return value.join(",");
    return value === true || value === false || typeof value === "number" ? String(value) : resolveValue(value);
};
for (const [key, value] of Object.entries(envFromFile)) {
    envFromFile[key] = normalizeEnvValue(value);
}

/** Default TLS on when `launcherEnv` omits it (same spirit as shipped `endpoint` portable.config). Set `CWS_HTTPS_ENABLED=false` to force HTTP. */
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_HTTPS_ENABLED")) {
    envFromFile.CWS_HTTPS_ENABLED = "true";
}

module.exports = {
    apps: [
        {
            name: "cwsp",
            script: "launcher.mjs",
            interpreter: "node",
            cwd: __dirname,
            instances: 1,
            exec_mode: "fork",
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
