#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwspRoot = resolve(__dirname, "..");
const endpointRoot = resolve(cwspRoot, "endpoint");
const outRoot = resolve(endpointRoot, "diagnostics", "automation", new Date().toISOString().replace(/[:.]/g, "-"));

const args = new Set(process.argv.slice(2));
const wantsRestart = args.has("--restart");
const wantsAdbOnly = args.has("--adb-only");
const wantsPm2Only = args.has("--pm2-only");
const skipAdbSync = args.has("--no-adb-sync");
const runIterator = !wantsAdbOnly;
const runPm2 = !wantsAdbOnly;
const runAdb = !wantsPm2Only;

const adbTarget = process.env.CWS_AUTOMATION_ADB_DEVICE || "192.168.0.196:5555";
const pm2Lines = Math.max(30, Number(process.env.CWS_AUTOMATION_PM2_LINES || 140) || 140);
const iterRetries = String(process.env.CWS_ITER_RETRIES || "1");
const iterTimeout = String(process.env.CWS_ITER_TIMEOUT_MS || "3500");
const skipAndroidRebuild = /^(1|true|yes)$/i.test(String(process.env.CWS_AUTOMATION_SKIP_ANDROID_REBUILD || "").trim());

const keyPath = process.env.CWSP_SSH_IDENTITY || process.env.SSH_IDENTITY_FILE || `${process.env.HOME || "~"}/.ssh/id_ecdsa`;
const hasKey = existsSync(keyPath);
const includeWifiAlias201 = /^(1|true|yes)$/i.test(String(process.env.CWS_AUTOMATION_INCLUDE_ALIAS_201 || "").trim());
const androidRootCandidates = [
    String(process.env.CWS_ANDROID_ROOT || "").trim(),
    resolve(cwspRoot, "../CWSAndroid"),
    resolve(cwspRoot, "../U2RE.space/runtime/CWSAndroid"),
    resolve(cwspRoot, "../../runtime/CWSAndroid")
].filter(Boolean);
const androidRoot = androidRootCandidates.find((candidate) => existsSync(join(candidate, "package.json"))) || "";

const hosts = [
    {
        id: "L-192.168.0.110",
        sshTarget: "U2RE@192.168.0.110",
        sshArgs: [],
        shell: (cmd) => cmd
    },
    {
        id: "L-192.168.0.111",
        sshTarget: "U2RE@192.168.0.111",
        sshArgs: [],
        shell: (cmd) => cmd
    },
    {
        id: "L-192.168.0.200",
        sshTarget: "u2re-dev@192.168.0.200",
        sshArgs: [],
        shell: (cmd) => `bash -lc 'export PATH=$HOME/.nvm/versions/node/v25.6.0/bin:$PATH; ${cmd}'`
    },
    ...(includeWifiAlias201
        ? [{
            id: "L-192.168.0.201",
            sshTarget: "u2re-dev@192.168.0.201",
            sshArgs: [],
            shell: (cmd) => `bash -lc 'export PATH=$HOME/.nvm/versions/node/v25.6.0/bin:$PATH; ${cmd}'`
        }]
        : []),
    {
        id: "L-192.168.0.196",
        sshTarget: "root@45.150.9.153",
        sshArgs: hasKey ? ["-i", keyPath] : [],
        shell: (cmd) => cmd
    }
];

const run = (command, cwd = process.cwd(), env = process.env) => {
    return spawnSync(command, {
        cwd,
        env,
        shell: true,
        encoding: "utf8",
        maxBuffer: 50 * 1024 * 1024
    });
};

const save = async (name, payload) => {
    await writeFile(join(outRoot, name), payload, "utf8");
};

const formatExec = (title, result) => {
    const status = result.status ?? 1;
    return [
        `# ${title}`,
        `exit_code: ${status}`,
        `signal: ${result.signal || ""}`,
        "",
        "## stdout",
        result.stdout || "",
        "",
        "## stderr",
        result.stderr || "",
        ""
    ].join("\n");
};

const sshRun = (host, remoteCommand) => {
    const baseArgs = ["-o BatchMode=yes", "-o ConnectTimeout=8", ...host.sshArgs].join(" ");
    return run(`ssh ${baseArgs} "${host.sshTarget}" "${host.shell(remoteCommand)}"`, cwspRoot);
};

const parseAdbDeviceState = (output, target) => {
    const targetLc = String(target || "").trim().toLowerCase();
    const lines = String(output || "").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("List of devices")) continue;
        const parts = trimmed.split(/\s+/);
        const serial = String(parts[0] || "").trim().toLowerCase();
        const state = String(parts[1] || "").trim().toLowerCase();
        if (serial === targetLc || serial.includes(targetLc)) {
            return state || "unknown";
        }
    }
    return "missing";
};

const runVdsProtocolFallback = async (summary) => {
    const vdsHost = hosts.find((host) => host.id === "L-192.168.0.196");
    if (!vdsHost) {
        summary.push("vds-fallback=skipped(no-host)");
        return;
    }
    const vdsPm2 = sshRun(vdsHost, "pm2 list");
    await save("vds.fallback.pm2-list.log", formatExec("VDS fallback pm2 list", vdsPm2));
    summary.push(`vds-fallback-pm2-list=${vdsPm2.status ?? 1}`);

    const vdsHttpRoot = sshRun(vdsHost, "curl -k -sS -i -m 10 https://127.0.0.1:8443/");
    await save("vds.fallback.http-root.log", formatExec("VDS fallback https root probe", vdsHttpRoot));
    summary.push(`vds-fallback-http-root=${vdsHttpRoot.status ?? 1}`);

    const vdsHttpApi = sshRun(vdsHost, "curl -k -sS -i -m 10 https://127.0.0.1:8443/api/broadcast");
    await save("vds.fallback.http-api.log", formatExec("VDS fallback https api probe", vdsHttpApi));
    summary.push(`vds-fallback-http-api=${vdsHttpApi.status ?? 1}`);

    const vdsWsProbe = sshRun(
        vdsHost,
        "curl -k -sS -i -m 10 --http1.1 -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Version: 13' -H 'Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==' https://127.0.0.1:8443/ws"
    );
    await save("vds.fallback.ws-probe.log", formatExec("VDS fallback websocket upgrade probe", vdsWsProbe));
    summary.push(`vds-fallback-ws=${vdsWsProbe.status ?? 1}`);
};

const main = async () => {
    await mkdir(outRoot, { recursive: true });
    const summary = [];

    if (runPm2) {
        for (const host of hosts) {
            const list = sshRun(host, "pm2 list");
            await save(`${host.id}.pm2-list.log`, formatExec(`${host.id} pm2 list`, list));
            summary.push(`${host.id} pm2-list=${list.status ?? 1}`);

            if (wantsRestart) {
                const restart = sshRun(host, "pm2 restart cwsp --update-env");
                await save(`${host.id}.pm2-restart.log`, formatExec(`${host.id} pm2 restart`, restart));
                summary.push(`${host.id} pm2-restart=${restart.status ?? 1}`);
            }

            const flush = sshRun(host, "pm2 flush");
            await save(`${host.id}.pm2-flush.log`, formatExec(`${host.id} pm2 flush`, flush));
            summary.push(`${host.id} pm2-flush=${flush.status ?? 1}`);
        }
    }

    if (runAdb) {
        const adbConnect = run(`adb connect ${adbTarget}`, cwspRoot);
        await save("adb.connect.log", formatExec(`adb connect ${adbTarget}`, adbConnect));
        summary.push(`adb-connect=${adbConnect.status ?? 1}`);

        const adbDevices = run("adb devices -l", cwspRoot);
        await save("adb.devices.log", formatExec("adb devices -l", adbDevices));
        summary.push(`adb-devices=${adbDevices.status ?? 1}`);
        const adbState = parseAdbDeviceState(`${adbDevices.stdout || ""}\n${adbDevices.stderr || ""}`, adbTarget);
        const adbAvailable = adbState === "device";
        summary.push(`adb-state=${adbState}`);

        if (!skipAndroidRebuild) {
            if (androidRoot) {
                const rebuild = run("npm run assemble:cws", androidRoot);
                await save("android.assemble-install.log", formatExec("android assemble+install", rebuild));
                summary.push(`android-assemble-install=${rebuild.status ?? 1}`);
            } else {
                summary.push("android-assemble-install=skipped(no-cwsandroid-root)");
            }
        } else {
            summary.push("android-assemble-install=skipped(env)");
        }

        if (!adbAvailable) {
            summary.push("adb-runtime=unavailable; using vds-protocol-fallback");
            await runVdsProtocolFallback(summary);
        } else {

            if (!skipAdbSync) {
                const mkdirAppConfig = run(
                    "adb shell \"mkdir -p /storage/emulated/0/AppConfig/config /storage/emulated/0/AppConfig/https\"",
                    cwspRoot
                );
                await save("adb.appconfig-mkdir.log", formatExec("adb mkdir AppConfig paths", mkdirAppConfig));
                summary.push(`adb-appconfig-mkdir=${mkdirAppConfig.status ?? 1}`);

                const pushConfig = run(
                    `adb push "${join(endpointRoot, "config")}/." "/storage/emulated/0/AppConfig/config/"`,
                    cwspRoot
                );
                await save("adb.push-config.log", formatExec("adb push endpoint/config", pushConfig));
                summary.push(`adb-push-config=${pushConfig.status ?? 1}`);

                const httpsSource = existsSync(join(endpointRoot, "https"))
                    ? join(endpointRoot, "https")
                    : existsSync(join(cwspRoot, "https"))
                      ? join(cwspRoot, "https")
                      : "";
                if (httpsSource) {
                    const pushHttps = run(
                        `adb push "${httpsSource}/." "/storage/emulated/0/AppConfig/https/"`,
                        cwspRoot
                    );
                    await save("adb.push-https.log", formatExec("adb push https", pushHttps));
                    summary.push(`adb-push-https=${pushHttps.status ?? 1}`);
                } else {
                    summary.push("adb-push-https=skipped(no-source)");
                }
            }

            const logcatClear = run("adb logcat -c", cwspRoot);
            await save("adb.logcat-clear.log", formatExec("adb logcat -c", logcatClear));
            summary.push(`adb-logcat-clear=${logcatClear.status ?? 1}`);

            const launch = run("adb shell monkey -p space.u2re.cws -c android.intent.category.LAUNCHER 1", cwspRoot);
            await save("adb.launch.log", formatExec("adb monkey launch", launch));
            summary.push(`adb-launch=${launch.status ?? 1}`);

            const fatal = run("adb logcat -d -v threadtime AndroidRuntime:E *:S", cwspRoot);
            await save("adb.logcat-fatal.log", formatExec("adb logcat AndroidRuntime:E", fatal));
            summary.push(`adb-fatal=${fatal.status ?? 1}`);

            const cwsTrace = run(
                "adb logcat -d -v threadtime | rg \"space\\.u2re\\.cws|AndroidRuntime|ws-state|clipboard|FATAL EXCEPTION|NoClassDefFoundError|PatternSyntaxException\"",
                cwspRoot
            );
            await save("adb.logcat-cws-filtered.log", formatExec("adb logcat filtered", cwsTrace));
            summary.push(`adb-filtered=${cwsTrace.status ?? 1}`);
        }
    }

    if (runIterator) {
        const iterator = run("npm run test:auto-iterator", endpointRoot, {
            ...process.env,
            CWS_ITER_RETRIES: iterRetries,
            CWS_ITER_TIMEOUT_MS: iterTimeout
        });
        await save("iterator.log", formatExec("route-compat-iterator", iterator));
        summary.push(`iterator=${iterator.status ?? 1}`);
    }

    if (runPm2) {
        for (const host of hosts) {
            const postList = sshRun(host, "pm2 list");
            await save(`${host.id}.pm2-list-post.log`, formatExec(`${host.id} pm2 list post-run`, postList));
            summary.push(`${host.id} pm2-list-post=${postList.status ?? 1}`);

            const logs = sshRun(host, `pm2 logs --lines ${pm2Lines} --nostream`);
            await save(`${host.id}.pm2-logs.log`, formatExec(`${host.id} pm2 logs`, logs));
            summary.push(`${host.id} pm2-logs=${logs.status ?? 1}`);
        }
    }

    const summaryText = [
        "# CWSP/CWSAndroid automation summary",
        `time: ${new Date().toISOString()}`,
        `output_dir: ${outRoot}`,
        "",
        ...summary.map((line) => `- ${line}`),
        ""
    ].join("\n");
    await save("SUMMARY.md", summaryText);
    console.log(summaryText);
};

main().catch(async (error) => {
    const text = `[auto-diagnose-links] fatal: ${error?.stack || error}`;
    try {
        await mkdir(outRoot, { recursive: true });
        await save("FATAL.log", text);
    } catch {
        // ignore
    }
    console.error(text);
    process.exit(1);
});

