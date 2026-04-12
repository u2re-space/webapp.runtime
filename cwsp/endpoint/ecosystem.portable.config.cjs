const path = require("node:path");

/**
 * PM2 — **compiled portable** (`npm run build:portable` → `dist/portable/cwsp.mjs`).
 *   cd runtime/cwsp && npm run build:portable && pm2 start ecosystem.portable.config.cjs --only cwsp --update-env
 *
 * For **TS source** (tsx + `server/index.ts`), use `ecosystem.server.config.cjs` instead:
 *   pm2 start ecosystem.server.config.cjs --only cwsp-server --update-env
 */
module.exports = {
    apps: [
        {
            name: "cwsp",
            script: "cwsp.mjs",
            cwd: path.join(__dirname, "dist/portable"),
            interpreter: "node",
            instances: 1,
            autorestart: true,
            max_restarts: 30,
            min_uptime: "10s",
            env: {
                NODE_ENV: "production",
                CWS_PORTABLE_CONFIG_PATH: "./portable.config.json",
                CWS_PORTABLE_DATA_PATH: "./.data",
                CWS_HTTPS_ENABLED: "true"
            }
        }
    ]
};
