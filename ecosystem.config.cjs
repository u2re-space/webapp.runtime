/**
 * PM2 — CWSP portable from `runtime/` (monorepo).
 *   cd runtime && pm2 start ecosystem.config.cjs
 */

module.exports = {
    apps: [
        {
            name: "cwsp-runtime",
            script: "launcher.mjs",
            interpreter: "node",
            cwd: __dirname,
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            max_restarts: 30,
            min_uptime: "10s",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
