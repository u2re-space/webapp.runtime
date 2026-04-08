/**
 * PM2 — CWSP portable from monorepo `runtime/` (aligned with `endpoint/endpoint/ecosystem.config.cjs`).
 *
 *   cd runtime && pm2 start ecosystem.config.cjs
 *
 * Reads `launcherEnv` from `cwsp/dist/portable/portable.config.json` (or `CWS_PORTABLE_CONFIG_PATH`)
 * so TLS (`CWS_HTTPS_*`) and bridge/Airpad flags match legacy endpoint behavior.
 *
 * Avoid running this app together with legacy endpoint `cws` / `server-v2` on the same machine unless
 * you change ports: both default to HTTPS admin :8443 (CWSP also serves public UI on another port).
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

/** So `https://<LAN>/` (implicit :443) matches config when portable JSON omits `runtime.publicListenPort`. */
if (!resolveValue(envFromFile.CWS_PUBLIC_HTTPS_PORT)) {
    envFromFile.CWS_PUBLIC_HTTPS_PORT = "443";
}
if (!resolveValue(envFromFile.CWS_PUBLIC_HTTP_PORT)) {
    envFromFile.CWS_PUBLIC_HTTP_PORT = "80";
}

/**
 * Default TSX launch: same Fastify + `web/` static as `npm run dev` (cwd `cwsp/`).
 * Set `CWS_LAUNCH_TSX=0` in `launcherEnv` to use `dist/portable/cwsp.mjs` instead.
 * If PM2 logs show `[server-v2]` and `endpoint/.../portable.config.json`, this app is not CWSP — fix script/cwd.
 */
if (!Object.prototype.hasOwnProperty.call(launcherEnv, "CWS_LAUNCH_TSX")) {
    envFromFile.CWS_LAUNCH_TSX = "1";
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
