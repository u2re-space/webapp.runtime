#!/usr/bin/env node
/**
 * Cross-platform PM2 launcher for server-v2.
 * Used by ecosystem.config.cjs so the same config works on Windows (192.168.0.110) and Linux (192.168.0.200).
 * Spawns tsx server-v2/index.ts with config/data from env; exits with child code so PM2 can restart.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;

const configPath =
  process.env.CWS_PORTABLE_CONFIG_PATH ||
  process.env.ENDPOINT_CONFIG_JSON_PATH ||
  path.join(rootDir, "portable.config.json");
const dataPath =
  process.env.CWS_PORTABLE_DATA_PATH ||
  process.env.CWS_DATA_DIR ||
  path.join(rootDir, ".data");

const isWin = process.platform === "win32";
const tsxName = isWin ? "tsx.cmd" : "tsx";
const tsxBin = path.join(rootDir, "node_modules", ".bin", tsxName);
const serverEntry = path.join(rootDir, "server-v2", "index.ts");

const args = [
  serverEntry,
  "--config",
  configPath,
  "--data",
  dataPath
];

const child = spawn(tsxBin, args, {
  cwd: rootDir,
  stdio: "inherit",
  env: { ...process.env, CWS_PORTABLE_CONFIG_PATH: configPath, CWS_PORTABLE_DATA_PATH: dataPath },
  // Windows: `tsx.cmd` is a batch wrapper; executing it with `shell: false`
  // can fail with `spawn EINVAL`. Use the shell only on Windows.
  shell: isWin
});

child.on("error", (err) => {
  console.error("[launcher] failed to start server-v2:", err.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
