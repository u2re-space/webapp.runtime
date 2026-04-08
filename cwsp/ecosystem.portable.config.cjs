const path = require("node:path");

/** PM2 from `cwsp/`: `npm run start:pm2`. From monorepo `runtime/`: `pm2 start ecosystem.config.cjs` (uses ../launcher.mjs). */
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
