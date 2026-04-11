#!/usr/bin/env node
/**
 * Sync CWSP **TypeScript source** (server + frontend + web + control + package metadata) over SSH.
 * Intended for `npx tsx server/index.ts` on the host — same layout as the repo, not `dist/portable`.
 *
 * Env (shared with deploy-cwsp-portable where noted):
 *   CWSP_DEPLOY_SSH       — user@host (default U2RE@192.168.0.110)
 *   CWS_SERVER_DEPLOY_DIR — remote folder (default C:/Users/U2RE/cwsp-server)
 *   CWSP_DEPLOY_METHOD    — tar (default) | rsync | scp
 *   CWSP_SSH_PORT, CWSP_SSH_IDENTITY / SSH_IDENTITY_FILE
 *
 * After deploy:
 *   cd REMOTE && npm install --include=dev --no-audit --no-fund
 *   npx tsx server/index.ts
 *   pm2 start ecosystem.server.config.cjs --only cwsp-server --update-env
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { resolveCwspPackageRoot } from "../scripts/resolve-cwsp-root.mjs";
import { stageCwspServerRuntime } from "../scripts/stage-cwsp-server-runtime.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

const sshTarget = (process.env.CWSP_DEPLOY_SSH || "U2RE@192.168.0.110").trim();
const remoteDir = (process.env.CWS_SERVER_DEPLOY_DIR || "C:/Users/U2RE/cwsp-server").trim().replace(/\\/g, "/");
const method = (process.env.CWSP_DEPLOY_METHOD || "tar").trim().toLowerCase();
const sshPort = (process.env.CWSP_SSH_PORT || "22").trim();
const sshIdentity = (process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || "").trim();

const isWindowsRemotePath = () => /^[A-Za-z]:\//.test(remoteDir);

function sshPrefixArgs() {
    const args = [];
    if (sshPort && sshPort !== "22") args.push("-p", sshPort);
    if (sshIdentity && existsSync(sshIdentity)) args.push("-i", sshIdentity);
    return args;
}

function rsyncRemoteShell() {
    const parts = ["ssh"];
    if (sshPort && sshPort !== "22") parts.push("-p", sshPort);
    if (sshIdentity && existsSync(sshIdentity)) parts.push("-i", sshIdentity);
    return parts.join(" ");
}

function psEscapeSingle(s) {
    return s.replace(/'/g, "''");
}

/** Materialize a temp tree with symlinks followed (`frontend`, `web`, etc.). */
async function materializeStage() {
    const stage = await mkdtemp(join(tmpdir(), "cwsp-server-deploy-"));
    try {
        const names = await stageCwspServerRuntime(pkgRoot, stage, { clean: false });
        return { stage, names };
    } catch (err) {
        await rm(stage, { recursive: true, force: true }).catch(() => {});
        throw err;
    }
}

function deployRsyncFromStage(stageDir) {
    const r = spawnSync(
        "rsync",
        ["-azL", "--delete", "-e", rsyncRemoteShell(), `${stageDir}/`, `${sshTarget}:${remoteDir}/`],
        { stdio: "inherit" }
    );
    if (r.status !== 0) {
        console.error("[deploy-cwsp-server] rsync failed");
        process.exit(r.status ?? 1);
    }
}

function deployScpFromStage(stageDir) {
    const scpArgs = ["-r", "-C"];
    if (sshPort && sshPort !== "22") scpArgs.push("-P", sshPort);
    if (sshIdentity && existsSync(sshIdentity)) scpArgs.push("-i", sshIdentity);
    scpArgs.push(`${stageDir}/`, `${sshTarget}:${remoteDir}/`);
    const r = spawnSync("scp", scpArgs, { stdio: "inherit" });
    if (r.status !== 0) {
        console.error("[deploy-cwsp-server] scp failed");
        process.exit(r.status ?? 1);
    }
}

function deployTarPipeFromStage(stageDir) {
    const rd = psEscapeSingle(remoteDir);
    const remotePs = `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; New-Item -ItemType Directory -Force -Path '${rd}' | Out-Null; Set-Location '${rd}'; tar.exe -xzf -"`;

    return new Promise((resolve, reject) => {
        const tar = spawn("tar", ["czf", "-", "-C", stageDir, "."], {
            stdio: ["ignore", "pipe", "inherit"]
        });
        const ssh = spawn("ssh", [...sshPrefixArgs(), sshTarget, remotePs], {
            stdio: ["pipe", "inherit", "inherit"]
        });
        tar.stdout.pipe(ssh.stdin);

        tar.on("error", reject);
        ssh.on("error", reject);
        tar.on("close", (code) => {
            if (code !== 0) reject(new Error(`local tar pack exited ${code}`));
        });
        ssh.on("close", (code) => {
            if (code !== 0) reject(new Error(`ssh / remote tar exited ${code}`));
            else resolve();
        });
    });
}

function deployTarPipeLinuxFromStage(stageDir) {
    const rd = remoteDir.replace(/'/g, "'\\''");
    const remoteSh = `set -e; mkdir -p '${rd}' && cd '${rd}' && tar xzf -`;

    return new Promise((resolve, reject) => {
        const tar = spawn("tar", ["czf", "-", "-C", stageDir, "."], {
            stdio: ["ignore", "pipe", "inherit"]
        });
        const ssh = spawn("ssh", [...sshPrefixArgs(), sshTarget, remoteSh], {
            stdio: ["pipe", "inherit", "inherit"]
        });
        tar.stdout.pipe(ssh.stdin);

        tar.on("error", reject);
        ssh.on("error", reject);
        tar.on("close", (code) => {
            if (code !== 0) reject(new Error(`local tar pack exited ${code}`));
        });
        ssh.on("close", (code) => {
            if (code !== 0) reject(new Error(`ssh / remote tar exited ${code}`));
            else resolve();
        });
    });
}

async function main() {
    const { stage, names } = await materializeStage();
    try {
        console.log(`[deploy-cwsp-server] Staging ${names.length} items from ${pkgRoot} → temp → ${sshTarget}:${remoteDir}`);

        if (method === "rsync") {
            deployRsyncFromStage(stage);
        } else if (method === "scp") {
            deployScpFromStage(stage);
        } else if (isWindowsRemotePath()) {
            await deployTarPipeFromStage(stage);
        } else {
            await deployTarPipeLinuxFromStage(stage);
        }
    } finally {
        await rm(stage, { recursive: true, force: true }).catch(() => {});
    }

    console.log(
        `[deploy-cwsp-server] Synced TS server tree to ${sshTarget}:${remoteDir}\n` +
            `  On the host: cd "${remoteDir}" && npm install --include=dev --no-audit --no-fund\n` +
            `  Run: npx tsx server/index.ts\n` +
            `  PM2: pm2 start ecosystem.server.config.cjs --only cwsp-server --update-env\n` +
            `  Or from repo root: node launcher.mjs (set CWS_LAUNCH_MODE=tsx if portable bundle is absent)`
    );
}

main().catch((err) => {
    console.error("[deploy-cwsp-server]", err);
    process.exit(1);
});
