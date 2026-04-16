#!/usr/bin/env node
/**
 * CWSP launcher from `runtime/`:
 * - Default: `cwsp/dist/portable/cwsp.mjs` with cwd = portable dir.
 * - If bundle missing or `CWS_LAUNCH_MODE=tsx` / `CWS_LAUNCH_TSX=1`: `npx tsx server/index.ts` with cwd = `./cwsp`
 *   (same layout as `npm run deploy:server:ssh`).
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { resolveCwspServerLayoutRoot } from "./cwsp/scripts/stage-cwsp-server-runtime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimeRoot = __dirname;
const cwspRoot = path.join(runtimeRoot, "cwsp");
const serverLayoutRoot = resolveCwspServerLayoutRoot(cwspRoot);
const defaultPortable = path.join(cwspRoot, "dist", "portable");
const portableDir = process.env.CWS_PORTABLE_DIR ? path.resolve(process.env.CWS_PORTABLE_DIR) : defaultPortable;
const portableEntry = path.join(portableDir, "cwsp.mjs");
const tsEntry = path.join(serverLayoutRoot, "server", "index.ts");

const tsxFlag = String(process.env.CWS_LAUNCH_TSX || "")
    .trim()
    .toLowerCase();
const forceTsx =
    process.env.CWS_LAUNCH_MODE === "tsx" ||
    tsxFlag === "1" ||
    tsxFlag === "true" ||
    tsxFlag === "yes";
/** Portable `cwsp.mjs` has no full `web/` tree; TSX matches `npm run dev` + Fastify static. */
const usePortable = !forceTsx && existsSync(portableEntry);
const useTsx = forceTsx || !existsSync(portableEntry);

if (usePortable) {
    console.log(`[launcher] CWSP mode=portable cwd=${portableDir} entry=${portableEntry}`);
    launchPortable();
} else if (useTsx && existsSync(tsEntry)) {
    console.log(`[launcher] CWSP mode=tsx cwd=${cwspRoot} entry=${tsEntry}`);
    launchTsx();
} else {
    console.error(
        `[launcher] No runnable CWSP entry.\n` +
            `  Portable: ${portableEntry} (missing)\n` +
            `  TS:       ${tsEntry} (missing)\n` +
            `  Build portable: (cd cwsp/endpoint && npm run build:portable)\n` +
            `  Or deploy/sync TS tree: npm run deploy:server:ssh (from cwsp)`
    );
    process.exit(1);
}

function launchPortable() {
    const isWin = process.platform === "win32";
    const portableConfig =
        process.env.CWS_PORTABLE_CONFIG_PATH || path.join(portableDir, "portable.config.json");
    const portableData = process.env.CWS_PORTABLE_DATA_PATH || path.join(portableDir, ".data");
    const child = spawn("node", [portableEntry], {
        cwd: portableDir,
        stdio: "inherit",
        env: {
            ...process.env,
            CWS_PORTABLE_CONFIG_PATH: portableConfig,
            CWS_PORTABLE_DATA_PATH: portableData
        },
        shell: isWin
    });
    attachChildHandlers(child);
}

function launchTsx() {
    const isWin = process.platform === "win32";
    const configPath = process.env.CWS_PORTABLE_CONFIG_PATH || path.join(serverLayoutRoot, "config", "portable.config.json");
    const dataPath = process.env.CWS_PORTABLE_DATA_PATH || path.join(serverLayoutRoot, ".data");
    const child = spawn("npx", ["tsx", "server/index.ts"], {
        cwd: serverLayoutRoot,
        stdio: "inherit",
        env: {
            ...process.env,
            CWS_PORTABLE_CONFIG_PATH: configPath,
            CWS_PORTABLE_DATA_PATH: dataPath
        },
        shell: isWin
    });
    attachChildHandlers(child);
}

function attachChildHandlers(child) {
    child.on("error", (err) => {
        console.error("[launcher]", err.message);
        process.exit(1);
    });
    child.on("exit", (code, signal) => {
        if (signal) process.kill(process.pid, signal);
        process.exit(code ?? 0);
    });
}
