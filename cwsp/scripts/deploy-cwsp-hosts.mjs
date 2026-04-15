#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { resolveCwspServerLayoutRoot, stageCwspServerRuntime } from "./stage-cwsp-server-runtime.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);

const parseList = (value) =>
    String(value || "")
        .split(/[,\n;]/)
        .map((item) => item.trim())
        .filter(Boolean);

const parseTruthy = (value, fallback = true) => {
    if (value == null) return fallback;
    return !["0", "false", "no", "off"].includes(String(value).trim().toLowerCase());
};

const sshPort = String(process.env.CWSP_SSH_PORT || "22").trim();
const sshIdentity = String(process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || "").trim();
const autoPm2 = parseTruthy(process.env.CWSP_DEPLOY_PM2_START, true);

const defaultProfiles = {
    windows110: {
        key: "windows110",
        os: "windows",
        sshTargets: ["U2RE@192.168.0.110", "U2RE@192.168.0.111"],
        configFile: "config/portable.config.110.json",
        pathCandidates: [
            "C:/Users/U2RE/cwsp-server",
            "C:/Users/U2RE/endpoint-portable",
            "C:/Users/U2RE/U2RE.space/runtime/cwsp/endpoint"
        ]
    },
    linux200: {
        key: "linux200",
        os: "linux",
        sshTargets: ["u2re-dev@192.168.0.200", "u2re-dev@192.168.0.201"],
        configFile: "config/portable.config.json",
        pathCandidates: [
            "/home/u2re-dev/U2RE.space/runtime/cwsp/endpoint",
            "/home/u2re-dev/cwsp-server",
            "/srv/cwsp/endpoint",
            "/opt/cwsp/endpoint"
        ]
    }
};

const selectedProfileKeys = parseList(process.env.CWSP_DEPLOY_HOSTS || "windows110,linux200");
const selectedProfiles = selectedProfileKeys
    .map((key) => defaultProfiles[key])
    .filter(Boolean);

if (!selectedProfiles.length) {
    console.error("[deploy-cwsp-hosts] No host profiles selected. Use CWSP_DEPLOY_HOSTS=windows110,linux200");
    process.exit(1);
}

const sshPrefixArgs = () => {
    const args = [];
    if (sshPort && sshPort !== "22") args.push("-p", sshPort);
    if (sshIdentity && existsSync(sshIdentity)) args.push("-i", sshIdentity);
    return args;
};

const psEscapeSingle = (value) => String(value || "").replace(/'/g, "''");
const shEscapeSingle = (value) => String(value || "").replace(/'/g, "'\\''");

const runSsh = (sshTarget, remoteCommand, stdio = "pipe") =>
    spawnSync("ssh", [...sshPrefixArgs(), sshTarget, remoteCommand], { encoding: "utf8", stdio });

const resolvePortableRemoteCandidates = (profile) => {
    const fromConfig = [];
    const configPath = join(layoutRoot, profile.configFile);
    try {
        const parsed = JSON.parse(readFileSync(configPath, "utf8"));
        const remote = parsed && typeof parsed === "object" ? parsed.remote : null;
        const remotePath = remote && typeof remote.path === "string" ? remote.path.trim() : "";
        const remoteCandidates = Array.isArray(remote?.pathCandidates) ? remote.pathCandidates : [];
        if (remotePath) fromConfig.push(remotePath);
        for (const entry of remoteCandidates) {
            const raw = String(entry || "").trim();
            if (raw) fromConfig.push(raw);
        }
    } catch {
        // ignore malformed or missing profile config and keep defaults
    }
    return [...new Set([...fromConfig, ...profile.pathCandidates])];
};

const findReachableTarget = (profile) => {
    for (const sshTarget of profile.sshTargets) {
        const ping = runSsh(sshTarget, "echo __cwsp_ok__");
        if (ping.status === 0 && String(ping.stdout || "").includes("__cwsp_ok__")) {
            return sshTarget;
        }
    }
    return null;
};

const remotePathExists = (profile, sshTarget, candidatePath) => {
    if (profile.os === "windows") {
        const escaped = psEscapeSingle(candidatePath);
        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='SilentlyContinue'; ` +
            `if (Test-Path '${escaped}') { Write-Output '__cwsp_exists__' }"`;
        const res = runSsh(sshTarget, command);
        return res.status === 0 && String(res.stdout || "").includes("__cwsp_exists__");
    }
    const escaped = shEscapeSingle(candidatePath);
    const command = `sh -lc 'if [ -d '${escaped}' ]; then printf "__cwsp_exists__"; fi'`;
    const res = runSsh(sshTarget, command);
    return res.status === 0 && String(res.stdout || "").includes("__cwsp_exists__");
};

const resolveRemotePath = (profile, sshTarget) => {
    const candidates = resolvePortableRemoteCandidates(profile);
    for (const candidate of candidates) {
        if (remotePathExists(profile, sshTarget, candidate)) return candidate;
    }
    return candidates[0];
};

const deployStageToHost = async (stageDir, profile, sshTarget, remotePath) => {
    const remoteCommand = profile.os === "windows"
        ? (() => {
              const escaped = psEscapeSingle(remotePath);
              return (
                  `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; ` +
                  `New-Item -ItemType Directory -Force -Path '${escaped}' | Out-Null; ` +
                  `Set-Location '${escaped}'; tar.exe -xzf -"`
              );
          })()
        : (() => {
              const escaped = shEscapeSingle(remotePath);
              return `sh -lc 'set -e; mkdir -p '${escaped}' && cd '${escaped}' && tar xzf -'`;
          })();

    return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (error) => {
            if (settled) return;
            settled = true;
            if (error) reject(error);
            else resolve();
        };

        const tar = spawn("tar", ["czf", "-", "-C", stageDir, "."], { stdio: ["ignore", "pipe", "inherit"] });
        const ssh = spawn("ssh", [...sshPrefixArgs(), sshTarget, remoteCommand], { stdio: ["pipe", "inherit", "inherit"] });

        tar.stdout.on("error", finish);
        ssh.stdin.on("error", (error) => {
            if (error?.code === "EPIPE") return;
            finish(error);
        });
        tar.stdout.pipe(ssh.stdin);

        tar.on("error", finish);
        ssh.on("error", finish);
        tar.on("close", (code) => {
            if (code !== 0) finish(new Error(`local tar exited ${code}`));
        });
        ssh.on("close", (code) => {
            if (code !== 0) finish(new Error(`remote extract exited ${code}`));
            else finish();
        });
    });
};

const installRemoteDependencies = (profile, sshTarget, remotePath) => {
    if (profile.os === "windows") {
        const escapedPath = psEscapeSingle(remotePath);
        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; Set-Location '${escapedPath}'; ` +
            `cmd /c 'npm install --include=dev --no-audit --no-fund'; exit $LASTEXITCODE"`;
        const res = runSsh(sshTarget, command, "inherit");
        if (res.status !== 0) throw new Error(`npm install failed (${res.status ?? 1})`);
        return;
    }
    const escapedPath = shEscapeSingle(remotePath);
    const command = `bash -lc 'set -e; cd '${escapedPath}'; npm install --include=dev --no-audit --no-fund'`;
    const res = runSsh(sshTarget, command, "inherit");
    if (res.status !== 0) throw new Error(`npm install failed (${res.status ?? 1})`);
};

const restartPm2 = (profile, sshTarget, remotePath) => {
    const pm2Command = "pm2 start ecosystem.server.config.cjs --only cwsp --update-env";

    if (profile.os === "windows") {
        const escapedPath = psEscapeSingle(remotePath);
        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='Continue'; Set-Location '${escapedPath}'; ` +
            `if (!(Test-Path 'ecosystem.server.config.cjs') -and (Test-Path 'config/ecosystem.server.config.cjs')) { ` +
            `  Copy-Item 'config/ecosystem.server.config.cjs' 'ecosystem.server.config.cjs' -Force; ` +
            `}; ` +
            `cmd /c '${psEscapeSingle(pm2Command)}'; exit $LASTEXITCODE"`;
        const res = runSsh(sshTarget, command, "inherit");
        if (res.status !== 0) throw new Error(`PM2 restart failed (${res.status ?? 1})`);
        return;
    }

    const escapedPath = shEscapeSingle(remotePath);
    const commandEscaped = pm2Command.replace(/'/g, "'\\''");
    const command =
        `bash -lc 'set -e; cd '${escapedPath}'; ` +
        `if [ ! -f ecosystem.server.config.cjs ] && [ -f config/ecosystem.server.config.cjs ]; then cp config/ecosystem.server.config.cjs ecosystem.server.config.cjs; fi; ` +
        `${commandEscaped}'`;
    const res = runSsh(sshTarget, command, "inherit");
    if (res.status !== 0) throw new Error(`PM2 restart failed (${res.status ?? 1})`);
};

const main = async () => {
    const stageDir = join(pkgRoot, ".tmp.deploy-hosts");
    const summary = [];
    await stageCwspServerRuntime(pkgRoot, stageDir, { clean: true });
    try {
        for (const profile of selectedProfiles) {
            const row = {
                profile: profile.key,
                ok: false,
                sshTarget: "",
                remotePath: "",
                error: ""
            };
            try {
                const sshTarget = findReachableTarget(profile);
                if (!sshTarget) throw new Error("No reachable SSH target");
                row.sshTarget = sshTarget;

                const remotePath = resolveRemotePath(profile, sshTarget);
                if (!remotePath) throw new Error("No remote path candidates");
                row.remotePath = remotePath;

                console.log(`[deploy-cwsp-hosts] ${profile.key}: deploy -> ${sshTarget}:${remotePath}`);
                await deployStageToHost(stageDir, profile, sshTarget, remotePath);
                console.log(`[deploy-cwsp-hosts] ${profile.key}: npm install`);
                installRemoteDependencies(profile, sshTarget, remotePath);

                if (autoPm2) {
                    console.log(`[deploy-cwsp-hosts] ${profile.key}: restart pm2`);
                    restartPm2(profile, sshTarget, remotePath);
                }

                row.ok = true;
            } catch (error) {
                row.error = String(error?.message || error || "Unknown error");
                console.warn(`[deploy-cwsp-hosts] ${profile.key}: ${row.error}`);
            }
            summary.push(row);
        }
    } finally {
        await rm(stageDir, { recursive: true, force: true }).catch(() => {});
    }

    console.log("[deploy-cwsp-hosts] summary:");
    for (const row of summary) {
        const status = row.ok ? "OK" : "FAIL";
        const target = row.sshTarget || "-";
        const remotePath = row.remotePath || "-";
        const details = row.ok ? "" : ` | ${row.error}`;
        console.log(`  - ${row.profile}: ${status} | ${target} | ${remotePath}${details}`);
    }

    const hasFailure = summary.some((row) => !row.ok);
    if (hasFailure) {
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("[deploy-cwsp-hosts]", error);
    process.exit(1);
});
