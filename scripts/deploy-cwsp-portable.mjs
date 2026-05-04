#!/usr/bin/env node
/**
 * Sync `cwsp/dist/portable` to a remote machine over SSH.
 *
 * Env:
 *   CWSP_DEPLOY_SSH   — user@host (default U2RE@192.168.0.110)
 *   CWSP_DEPLOY_DIR   — remote folder (default C:/Users/U2RE/cwsp-portable)
 *   CWSP_DEPLOY_METHOD — tar (default) | rsync | scp
 *   CWSP_SSH_PORT     — SSH port (default 22)
 *   CWSP_SSH_IDENTITY — optional path to private key (or SSH_IDENTITY_FILE)
 *
 * Tar mode picks remote unpacker automatically:
 *   — Windows path (e.g. C:/Users/...) → PowerShell + tar.exe -xzf
 *   — Unix path (e.g. /root/cwsp-portable) → mkdir + tar xzf over bash
 *
 * After deploy: cd REMOTE && npm install --omit=dev && pm2 restart cwsp
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const portableDir = join(pkgRoot, "dist", "portable");

const sshTarget = (process.env.CWSP_DEPLOY_SSH || "U2RE@192.168.0.110").trim();
const remoteDir = (process.env.CWSP_DEPLOY_DIR || "C:/Users/U2RE/cwsp-portable").trim().replace(/\\/g, "/");
const method = (process.env.CWSP_DEPLOY_METHOD || "tar").trim().toLowerCase();
const sshPort = (process.env.CWSP_SSH_PORT || "22").trim();
const sshIdentity = (process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || "").trim();

/** True for `C:/...` style paths (Windows OpenSSH + PowerShell unpack). */
const isWindowsRemotePath = () => /^[A-Za-z]:\//.test(remoteDir);

function sshPrefixArgs() {
    const args = [];
    if (sshPort && sshPort !== "22") {
        args.push("-p", sshPort);
    }
    if (sshIdentity && existsSync(sshIdentity)) {
        args.push("-i", sshIdentity);
    }
    return args;
}

function rsyncRemoteShell() {
    const parts = ["ssh"];
    if (sshPort && sshPort !== "22") {
        parts.push("-p", sshPort);
    }
    if (sshIdentity && existsSync(sshIdentity)) {
        parts.push("-i", sshIdentity);
    }
    return parts.join(" ");
}

const entry = join(portableDir, "cwsp.mjs");
if (!existsSync(entry)) {
    console.error(`[deploy-cwsp-portable] Missing ${entry} — run npm run build:portable in cwsp first.`);
    process.exit(1);
}

function psEscapeSingle(s) {
    return s.replace(/'/g, "''");
}

function deployRsync() {
    const r = spawnSync(
        "rsync",
        ["-az", "--delete", "-e", rsyncRemoteShell(), portableDir + "/", `${sshTarget}:${remoteDir}/`],
        { stdio: "inherit" }
    );
    if (r.status !== 0) {
        console.error("[deploy-cwsp-portable] rsync failed (is rsync installed on both sides?)");
        process.exit(r.status ?? 1);
    }
}

function deployScp() {
    const scpArgs = ["-r", "-C"];
    if (sshPort && sshPort !== "22") {
        scpArgs.push("-P", sshPort);
    }
    if (sshIdentity && existsSync(sshIdentity)) {
        scpArgs.push("-i", sshIdentity);
    }
    scpArgs.push(portableDir + "/", `${sshTarget}:${remoteDir}/`);
    const r = spawnSync("scp", scpArgs, {
        stdio: "inherit"
    });
    if (r.status !== 0) {
        console.error("[deploy-cwsp-portable] scp failed");
        process.exit(r.status ?? 1);
    }
}

function deployTarPipe() {
    const rd = psEscapeSingle(remoteDir);
    const remotePs = `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; New-Item -ItemType Directory -Force -Path '${rd}' | Out-Null; Set-Location '${rd}'; tar.exe -xzf -"`;

    return new Promise((resolve, reject) => {
        const tar = spawn("tar", ["czf", "-", "-C", portableDir, "."], {
            stdio: ["ignore", "pipe", "inherit"]
        });
        const ssh = spawn("ssh", [...sshPrefixArgs(), sshTarget, remotePs], { stdio: ["pipe", "inherit", "inherit"] });
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

function deployTarPipeLinux() {
    const rd = remoteDir.replace(/'/g, "'\\''");
    const remoteSh = `set -e; mkdir -p '${rd}' && cd '${rd}' && tar xzf -`;

    return new Promise((resolve, reject) => {
        const tar = spawn("tar", ["czf", "-", "-C", portableDir, "."], {
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
    if (method === "rsync") {
        deployRsync();
    } else if (method === "scp") {
        deployScp();
    } else if (isWindowsRemotePath()) {
        await deployTarPipe();
    } else {
        await deployTarPipeLinux();
    }

    console.log(
        `[deploy-cwsp-portable] Synced to ${sshTarget}:${remoteDir}\n` +
            `  On the host: cd "${remoteDir}" && npm install --omit=dev --no-audit --no-fund\n` +
            `  PM2: pm2 start ecosystem.config.cjs --only cwsp --update-env  OR  pm2 restart cwsp`
    );
}

main().catch((err) => {
    console.error("[deploy-cwsp-portable]", err);
    process.exit(1);
});
