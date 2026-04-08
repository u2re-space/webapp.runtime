#!/usr/bin/env node
/**
 * PM2 / manual launcher: runs CWSP portable bundle with cwd = portable dir.
 * Repo layout: this file lives in `runtime/`, bundle in `./cwsp/dist/portable/`.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimeRoot = __dirname;
const defaultPortable = path.join(runtimeRoot, "cwsp", "dist", "portable");
const portableDir = process.env.CWS_PORTABLE_DIR
    ? path.resolve(process.env.CWS_PORTABLE_DIR)
    : defaultPortable;
const entry = path.join(portableDir, "cwsp.mjs");

if (!existsSync(entry)) {
    console.error(
        `[launcher] Missing ${entry}. Build with: (cd cwsp && npm run build:portable) ` +
            `or set CWS_PORTABLE_DIR to a folder containing cwsp.mjs`
    );
    process.exit(1);
}

const isWin = process.platform === "win32";
const child = spawn("node", [entry], {
    cwd: portableDir,
    stdio: "inherit",
    env: { ...process.env },
    shell: isWin
});

child.on("error", (err) => {
    console.error("[launcher]", err.message);
    process.exit(1);
});
child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 0);
});
