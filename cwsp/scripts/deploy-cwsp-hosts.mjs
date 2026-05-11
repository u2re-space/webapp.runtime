#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { resolveCwspServerLayoutRoot, stageCwspServerRuntime } from "./stage-cwsp-server-runtime.mjs";
import {
    buildLegacySyntheticDevices,
    filterDeployDevices,
    parseList,
    psSetPortableEnv,
    readDeployDevicesManifest
} from "./cwsp-deploy-devices.mjs";

/**
 * Fleet distribution over known SSH identities with per-target portable profiles.
 *
 * Env:
 *   CWSP_DEPLOY_DEVICE_IDS — optional comma IDs from config/devices.deploy.json (e.g. desk-110,gateway-200).
 *   CWSP_DEPLOY_HOSTS      — legacy profile filter: windows110,linux200 (default). Matches legacyProfile/profiles on each device row.
 *   CWSP_DEPLOY_LEGACY_FIRST_HIT_ONLY — when no devices.deploy.json, keep first reachable SSH per profile (default: true).
 *
 * Portable: each deploy prefixes remote PM2 with CWS_PORTABLE_CONFIG_PATH=<abs path to device's portable JSON> when portableConfig is set.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);

const parseTruthy = (value, fallback = true) => {
    if (value == null) return fallback;
    return !["0", "false", "no", "off"].includes(String(value).trim().toLowerCase());
};

const sshPortGlobal = String(process.env.CWSP_SSH_PORT || "22").trim();
const sshIdentity = String(process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || "").trim();
const autoPm2 = parseTruthy(process.env.CWSP_DEPLOY_PM2_START, true);
const legacyHostsFilter = parseList(process.env.CWSP_DEPLOY_HOSTS || "windows110,linux200");
const deviceIdsFilter = parseList(process.env.CWSP_DEPLOY_DEVICE_IDS || "");
const legacyFirstHitOnly = parseTruthy(process.env.CWSP_DEPLOY_LEGACY_FIRST_HIT_ONLY, true);

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

const sshPrefixArgs = (device) => {
    const args = [];
    const p = device?.sshPort ? String(device.sshPort).trim() : sshPortGlobal;
    if (p && p !== "22") args.push("-p", p);
    if (sshIdentity && existsSync(sshIdentity)) args.push("-i", sshIdentity);
    return args;
};

const psEscapeSingle = (value) => String(value || "").replace(/'/g, "''");
const shEscapeSingle = (value) => String(value || "").replace(/'/g, "'\\''");

/** Remote `bash -lc` payload is JSON-encoded so POSIX paths tolerate spaces/quotes/apostrophes. */
const posixBashLc = (scriptOneLine) => `bash -lc ${JSON.stringify(scriptOneLine)}`;

/** `cd "<abs path>"` with JSON-style quoting embedded in bash script body. */
const posixCdQuoted = (remotePathAbs) => `cd ${JSON.stringify(remotePathAbs)}`;

const posixExportCwspPortablePwd = (portableRelative) => {
    const rel = String(portableRelative || "")
        .trim()
        .replace(/^[/\\]+/, "")
        .replace(/\\/g, "/");
    if (!rel) return "";
    return `export CWS_PORTABLE_CONFIG_PATH="$(pwd)/${rel}"`;
};

const runSsh = (device, remoteCommand, stdio = "pipe") =>
    spawnSync("ssh", [...sshPrefixArgs(device), device.ssh, remoteCommand], { encoding: "utf8", stdio });

const resolvePortableRemoteCandidates = (device) => {
    const fromConfig = [];
    const rel = device?.portableConfig;
    const configPath = rel ? join(layoutRoot, rel.replace(/\\/g, "/")) : "";
    try {
        if (configPath && existsSync(configPath)) {
            const parsed = JSON.parse(readFileSync(configPath, "utf8"));
            const remote = parsed && typeof parsed === "object" ? parsed.remote : null;
            const remotePath = remote && typeof remote.path === "string" ? remote.path.trim() : "";
            const remoteCandidates = Array.isArray(remote?.pathCandidates) ? remote.pathCandidates : [];
            if (remotePath) fromConfig.push(remotePath);
            for (const entry of remoteCandidates) {
                const raw = String(entry || "").trim();
                if (raw) fromConfig.push(raw);
            }
        }
    } catch {
        // ignore malformed or missing portable
    }
    return [...new Set([...fromConfig, ...(device.pathCandidates || [])])];
};

const resolveDeployDeviceList = () => {
    const manifest = readDeployDevicesManifest(layoutRoot);
    let devices = [];

    if (manifest?.devices?.length) {
        devices = filterDeployDevices({
            devices: manifest.devices,
            legacyHostsFilter: deviceIdsFilter.length ? [] : legacyHostsFilter,
            deviceIdsFilter
        });
        console.log(`[deploy-cwsp-hosts] using manifest ${manifest.manifestPath} (${devices.length} device(s))`);
        return devices;
    }

    const synthetic = buildLegacySyntheticDevices(defaultProfiles);
    devices = filterDeployDevices({
        devices: synthetic,
        legacyHostsFilter: deviceIdsFilter.length ? [] : legacyHostsFilter,
        deviceIdsFilter
    });

    if (!legacyFirstHitOnly || deviceIdsFilter.length) {
        return devices;
    }

    const byLeg = new Map();
    for (const d of devices) {
        const leg = String(d.legacyProfile || "_");
        if (!byLeg.has(leg)) byLeg.set(leg, []);
        byLeg.get(leg).push(d);
    }
    const picked = [];
    for (const group of byLeg.values()) {
        let found = false;
        for (const d of group) {
            const ping = runSsh(d, "echo __cwsp_ok__");
            if (ping.status === 0 && String(ping.stdout || "").includes("__cwsp_ok__")) {
                picked.push(d);
                found = true;
                break;
            }
        }
        if (!found) {
            picked.push(group[0]);
            console.warn(
                `[deploy-cwsp-hosts] legacy first-hit: no SSH reply for profile ${group[0]?.legacyProfile || "?"} — retaining first row ${group[0]?.ssh}`
            );
        }
    }
    console.log("[deploy-cwsp-hosts] synthetic legacy profiles (first reachable per group)");
    return picked;
};

const remotePathExists = (device, candidatePath) => {
    if (device.os === "windows") {
        const escaped = psEscapeSingle(candidatePath);
        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='SilentlyContinue'; ` +
            `if (Test-Path '${escaped}') { Write-Output '__cwsp_exists__' }"`;
        const res = runSsh(device, command);
        return res.status === 0 && String(res.stdout || "").includes("__cwsp_exists__");
    }
    const escaped = shEscapeSingle(candidatePath);
    const command = `sh -lc 'if [ -d '${escaped}' ]; then printf "__cwsp_exists__"; fi'`;
    const res = runSsh(device, command);
    return res.status === 0 && String(res.stdout || "").includes("__cwsp_exists__");
};

const resolveRemotePath = (device) => {
    const candidates = resolvePortableRemoteCandidates(device);
    for (const candidate of candidates) {
        if (remotePathExists(device, candidate)) return candidate;
    }
    return candidates[0];
};

const deployStageToHost = async (stageDir, device, remotePath) => {
    const remoteCommand =
        device.os === "windows"
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

    return new Promise((resolvePromise, reject) => {
        let settled = false;
        const finish = (error) => {
            if (settled) return;
            settled = true;
            if (error) reject(error);
            else resolvePromise();
        };

        const tar = spawn("tar", ["czf", "-", "-C", stageDir, "."], { stdio: ["ignore", "pipe", "inherit"] });
        const ssh = spawn("ssh", [...sshPrefixArgs(device), device.ssh, remoteCommand], {
            stdio: ["pipe", "inherit", "inherit"]
        });

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

const installRemoteDependencies = (device, remotePath) => {
    if (device.os === "windows") {
        const escapedPath = psEscapeSingle(remotePath);
        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='Stop'; Set-Location '${escapedPath}'; ` +
            `cmd /c 'npm install --include=dev --no-audit --no-fund'; exit $LASTEXITCODE"`;
        const res = runSsh(device, command, "inherit");
        if (res.status !== 0) throw new Error(`npm install failed (${res.status ?? 1})`);
        return;
    }
    const command = posixBashLc(["set -e", posixCdQuoted(remotePath), "npm install --include=dev --no-audit --no-fund"].join(" && "));
    const res = runSsh(device, command, "inherit");
    if (res.status !== 0) throw new Error(`npm install failed (${res.status ?? 1})`);
};

const ecosystemRel = "ecosystem/ecosystem.server.config.cjs";

const restartPm2 = (device, remotePath) => {
    const pm2EcoWin = ecosystemRel.replace(/\//g, "\\");
    const pm2CmdLinux = `pm2 start ${ecosystemRel} --only cwsp --update-env`;

    const portableLin = posixExportCwspPortablePwd(device.portableConfig || "");
    const portableWin = psSetPortableEnv(device.portableConfig || "");

    if (device.os === "windows") {
        const escapedPath = psEscapeSingle(remotePath);
        const shim =
            `if (!(Test-Path '${ecosystemRel}') -and (Test-Path 'config/ecosystem.server.config.cjs')) { Copy-Item 'config/ecosystem.server.config.cjs' '${ecosystemRel}' -Force }; ` +
            `if (!(Test-Path '${ecosystemRel}') -and (Test-Path 'ecosystem.server.config.cjs')) { Copy-Item 'ecosystem.server.config.cjs' '${ecosystemRel}' -Force }; `;

        const command =
            `powershell -NoProfile -Command "$ErrorActionPreference='Continue'; Set-Location '${escapedPath}'; ${portableWin}${shim}` +
            `cmd.exe /c 'pm2 start ${pm2EcoWin} --only cwsp --update-env'; exit $LASTEXITCODE"`;
        const res = runSsh(device, command, "inherit");
        if (res.status !== 0) throw new Error(`PM2 restart failed (${res.status ?? 1})`);
        return;
    }

    const shimCopy =
        `([ ! -f ${ecosystemRel} ] && [ -f config/ecosystem.server.config.cjs ] && cp config/ecosystem.server.config.cjs ${ecosystemRel}); ` +
        `([ ! -f ${ecosystemRel} ] && [ -f ecosystem.server.config.cjs ] && cp ecosystem.server.config.cjs ${ecosystemRel}); ` +
        `true`;

    const linuxScript = [posixCdQuoted(remotePath), portableLin, shimCopy, pm2CmdLinux].filter(Boolean).join(" && ");
    const command = posixBashLc(`set -e && ${linuxScript}`);
    const res = runSsh(device, command, "inherit");
    if (res.status !== 0) throw new Error(`PM2 restart failed (${res.status ?? 1})`);
};

const main = async () => {
    const stageDir = join(pkgRoot, ".tmp.deploy-hosts");
    const summary = [];
    const targets = resolveDeployDeviceList();

    if (!targets.length) {
        console.error(
            "[deploy-cwsp-hosts] No deploy targets. Check CWSP_DEPLOY_HOSTS / CWSP_DEPLOY_DEVICE_IDS / config/devices.deploy.json"
        );
        process.exit(1);
    }

    await stageCwspServerRuntime(pkgRoot, stageDir, { clean: true });
    try {
        for (const device of targets) {
            const row = {
                profile: `${device.id}(${device.legacyProfile || "-"})`,
                ok: false,
                sshTarget: device.ssh,
                remotePath: "",
                portable: device.portableConfig || "",
                error: ""
            };
            try {
                const ping = runSsh(device, "echo __cwsp_ok__");
                if (ping.status !== 0 || !String(ping.stdout || "").includes("__cwsp_ok__")) {
                    throw new Error(`SSH unreachable: ${device.ssh}`);
                }

                const remotePath = resolveRemotePath(device);
                if (!remotePath) throw new Error("No remote path candidates");
                row.remotePath = remotePath;

                console.log(`[deploy-cwsp-hosts] ${device.id}: deploy -> ${device.ssh}:${remotePath}`);
                await deployStageToHost(stageDir, device, remotePath);
                console.log(`[deploy-cwsp-hosts] ${device.id}: npm install`);
                installRemoteDependencies(device, remotePath);

                if (autoPm2) {
                    console.log(`[deploy-cwsp-hosts] ${device.id}: pm2 (${device.portableConfig || "default ecosystem portable"})`);
                    restartPm2(device, remotePath);
                }

                row.ok = true;
            } catch (error) {
                row.error = String(error?.message || error || "Unknown error");
                console.warn(`[deploy-cwsp-hosts] ${device.id}: ${row.error}`);
            }
            summary.push(row);
        }
    } finally {
        await rm(stageDir, { recursive: true, force: true }).catch(() => {});
    }

    console.log("[deploy-cwsp-hosts] summary:");
    for (const row of summary) {
        const status = row.ok ? "OK" : "FAIL";
        const details = row.ok ? ` | portable=${row.portable || "-"}` : ` | ${row.error}`;
        console.log(`  - ${row.profile}: ${status} | ${row.sshTarget} | ${row.remotePath || "-"}${details}`);
    }

    const hasFailure = summary.some((row) => !row.ok);
    if (hasFailure) process.exit(1);
};

main().catch((error) => {
    console.error("[deploy-cwsp-hosts]", error);
    process.exit(1);
});
