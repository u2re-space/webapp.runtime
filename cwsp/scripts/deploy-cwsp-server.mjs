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

const parseSshTargets = (raw) =>
    String(raw || "")
        .split(/[,\n;]/)
        .map((item) => item.trim())
        .filter(Boolean);
const sshTargets = parseSshTargets(process.env.CWSP_DEPLOY_SSH || "U2RE@192.168.0.110,U2RE@192.168.0.111");
const remoteDir = (process.env.CWS_SERVER_DEPLOY_DIR || "C:/Users/U2RE/cwsp-server").trim().replace(/\\/g, "/");
const method = (process.env.CWSP_DEPLOY_METHOD || "tar").trim().toLowerCase();
const sshPort = (process.env.CWSP_SSH_PORT || "22").trim();
const sshIdentity = (process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || "").trim();
const autoPm2 = !["0", "false", "no", "off"].includes(String(process.env.CWSP_DEPLOY_PM2_START || "true").trim().toLowerCase());

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

function deployRsyncFromStage(stageDir, sshTarget) {
    const r = spawnSync(
        "rsync",
        ["-azL", "--delete", "-e", rsyncRemoteShell(), `${stageDir}/`, `${sshTarget}:${remoteDir}/`],
        { stdio: "inherit" }
    );
    if (r.status !== 0) {
        throw new Error(`rsync failed with status ${r.status ?? 1}`);
    }
}

function deployScpFromStage(stageDir, sshTarget) {
    const scpArgs = ["-r", "-C"];
    if (sshPort && sshPort !== "22") scpArgs.push("-P", sshPort);
    if (sshIdentity && existsSync(sshIdentity)) scpArgs.push("-i", sshIdentity);
    scpArgs.push(`${stageDir}/`, `${sshTarget}:${remoteDir}/`);
    const r = spawnSync("scp", scpArgs, { stdio: "inherit" });
    if (r.status !== 0) {
        throw new Error(`scp failed with status ${r.status ?? 1}`);
    }
}

function deployTarPipeCommon(stageDir, remoteCommand, sshTarget) {
    return new Promise((resolve, reject) => {
        let settled = false;
        let sshClosed = false;
        let sshCode = 0;
        const finish = (err) => {
            if (settled) return;
            settled = true;
            if (err) reject(err);
            else resolve();
        };

        const tar = spawn("tar", ["czf", "-", "-C", stageDir, "."], {
            stdio: ["ignore", "pipe", "inherit"]
        });
        const ssh = spawn("ssh", [...sshPrefixArgs(), sshTarget, remoteCommand], {
            stdio: ["pipe", "inherit", "inherit"]
        });

        tar.stdout.on("error", (err) => {
            if (err?.code === "EPIPE" && sshClosed && sshCode !== 0) return;
            finish(err);
        });
        ssh.stdin.on("error", (err) => {
            if (err?.code === "EPIPE") return;
            finish(err);
        });
        tar.stdout.pipe(ssh.stdin);

        tar.on("error", finish);
        ssh.on("error", finish);
        ssh.on("close", (code) => {
            sshClosed = true;
            sshCode = code ?? 1;
            if (sshCode !== 0) {
                tar.kill("SIGTERM");
                finish(new Error(`ssh / remote tar exited ${sshCode}`));
            }
        });
        tar.on("close", (code) => {
            if (settled) return;
            if (code !== 0) {
                finish(new Error(`local tar pack exited ${code}`));
                return;
            }
            if (sshClosed && sshCode !== 0) return;
            if (sshClosed) finish();
        });
    });
}

function deployTarPipeFromStage(stageDir, sshTarget) {
    const rd = psEscapeSingle(remoteDir);
    const remotePs = `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; New-Item -ItemType Directory -Force -Path '${rd}' | Out-Null; Set-Location '${rd}'; tar.exe -xzf -"`;
    return deployTarPipeCommon(stageDir, remotePs, sshTarget);
}

function deployTarPipeLinuxFromStage(stageDir, sshTarget) {
    const rd = remoteDir.replace(/'/g, "'\\''");
    const remoteSh = `set -e; mkdir -p '${rd}' && cd '${rd}' && tar xzf -`;
    return deployTarPipeCommon(stageDir, remoteSh, sshTarget);
}

function runRemoteNpmInstall(sshTarget) {
    if (isWindowsRemotePath()) {
        const rd = psEscapeSingle(remoteDir);
        const remotePs =
            `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; ` +
            `Set-Location '${rd}'; ` +
            `Write-Host '[deploy-cwsp-server] npm install --include=dev --no-audit --no-fund'; ` +
            `cmd /c 'npm install --include=dev --no-audit --no-fund'; exit $LASTEXITCODE"`;
        const r = spawnSync("ssh", [...sshPrefixArgs(), sshTarget, remotePs], { stdio: "inherit" });
        if (r.status !== 0) {
            throw new Error(`remote npm install failed with status ${r.status ?? 1}`);
        }
        return;
    }
    const rd = remoteDir.replace(/'/g, "'\\''");
    const remoteSh =
        `set -e; cd '${rd}'; ` +
        `echo "[deploy-cwsp-server] npm install --include=dev --no-audit --no-fund"; ` +
        `npm install --include=dev --no-audit --no-fund`;
    const r = spawnSync("ssh", [...sshPrefixArgs(), sshTarget, `bash -lc '${remoteSh.replace(/'/g, "'\\''")}'`], { stdio: "inherit" });
    if (r.status !== 0) {
        throw new Error(`remote npm install failed with status ${r.status ?? 1}`);
    }
}

function runRemotePm2Start(sshTarget) {
    const pm2Command = "pm2 start ecosystem.server.config.cjs --only cwsp --update-env";
    if (isWindowsRemotePath()) {
        const rd = psEscapeSingle(remoteDir);
        const remotePs =
            `powershell -NoProfile -Command "$ErrorActionPreference='Continue'; ` +
            `Set-Location '${rd}'; ` +
            `if (!(Test-Path 'ecosystem.server.config.cjs') -and (Test-Path 'config/ecosystem.server.config.cjs')) { ` +
            `  Copy-Item 'config/ecosystem.server.config.cjs' 'ecosystem.server.config.cjs' -Force; ` +
            `}; ` +
            `Write-Host '[deploy-cwsp-server] PM2 command: ${psEscapeSingle(pm2Command)}'; ` +
            `cmd /c '${psEscapeSingle(pm2Command)}'; exit $LASTEXITCODE"`;
        const r = spawnSync("ssh", [...sshPrefixArgs(), sshTarget, remotePs], { stdio: "inherit" });
        if (r.status !== 0) {
            throw new Error(`remote PM2 start failed with status ${r.status ?? 1}`);
        }
        return;
    }
    const rd = remoteDir.replace(/'/g, "'\\''");
    const commandEscaped = pm2Command.replace(/'/g, "'\\''");
    const remoteSh =
        `set -e; cd '${rd}'; ` +
        `if [ ! -f ecosystem.server.config.cjs ] && [ -f config/ecosystem.server.config.cjs ]; then cp config/ecosystem.server.config.cjs ecosystem.server.config.cjs; fi; ` +
        `echo "[deploy-cwsp-server] PM2 command: ${commandEscaped}"; ${commandEscaped}`;
    const r = spawnSync("ssh", [...sshPrefixArgs(), sshTarget, `bash -lc '${remoteSh.replace(/'/g, "'\\''")}'`], { stdio: "inherit" });
    if (r.status !== 0) {
        throw new Error(`remote PM2 start failed with status ${r.status ?? 1}`);
    }
}

async function main() {
    if (!sshTargets.length) {
        throw new Error("No SSH targets configured. Set CWSP_DEPLOY_SSH");
    }
    const { stage, names } = await materializeStage();
    let deployedTarget = null;
    let lastError = null;
    try {
        console.log(
            `[deploy-cwsp-server] Staging ${names.length} items from ${pkgRoot} → temp → ${sshTargets.join(" | ")}:${remoteDir}`
        );

        for (const sshTarget of sshTargets) {
            try {
                console.log(`[deploy-cwsp-server] Deploy attempt: ${sshTarget}`);
                if (method === "rsync") {
                    deployRsyncFromStage(stage, sshTarget);
                } else if (method === "scp") {
                    deployScpFromStage(stage, sshTarget);
                } else if (isWindowsRemotePath()) {
                    await deployTarPipeFromStage(stage, sshTarget);
                } else {
                    await deployTarPipeLinuxFromStage(stage, sshTarget);
                }
                deployedTarget = sshTarget;
                break;
            } catch (error) {
                lastError = error;
                console.warn(`[deploy-cwsp-server] Deploy failed for ${sshTarget}: ${error?.message || error}`);
            }
        }
        if (!deployedTarget) {
            throw lastError || new Error("Deploy failed for all SSH targets");
        }
    } finally {
        await rm(stage, { recursive: true, force: true }).catch(() => {});
    }

    if (autoPm2) {
        console.log(`[deploy-cwsp-server] Installing remote dependencies on ${deployedTarget}...`);
        runRemoteNpmInstall(deployedTarget);
        console.log(`[deploy-cwsp-server] Running remote PM2 start for cwsp on ${deployedTarget}...`);
        runRemotePm2Start(deployedTarget);
    } else {
        console.log("[deploy-cwsp-server] Skip remote PM2 start (CWSP_DEPLOY_PM2_START=false)");
    }

    console.log(
        `[deploy-cwsp-server] Synced TS server tree to ${deployedTarget}:${remoteDir}\n` +
            `  On the host: cd "${remoteDir}" && npm install --include=dev --no-audit --no-fund\n` +
            `  Run: npx tsx server/index.ts\n` +
            `  PM2: pm2 start ecosystem.server.config.cjs --only cwsp --update-env\n` +
            `  Or from repo root: node launcher.mjs (set CWS_LAUNCH_MODE=tsx if portable bundle is absent)`
    );
}

main().catch((err) => {
    console.error("[deploy-cwsp-server]", err);
    process.exit(1);
});
