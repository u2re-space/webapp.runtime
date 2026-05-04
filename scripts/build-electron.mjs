import { cp, mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { stageCwspServerRuntime } from "./stage-cwsp-server-runtime.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const electronSrc = resolve(pkgRoot, "electron");
const outElectron = resolve(pkgRoot, "dist/electron");
const cwspRuntimeOut = resolve(outElectron, "cwsp-runtime");

async function runBuild() {
    await mkdir(outElectron, { recursive: true });
    await mkdir(resolve(outElectron, "build-resources"), { recursive: true });

    const names = await stageCwspServerRuntime(pkgRoot, cwspRuntimeOut);
    console.log(`[build:electron] Staged TS server runtime (${names.length} items) -> ${cwspRuntimeOut}`);

    for (const name of ["index.mjs", "browser.mjs", "injector.mjs"]) {
        await cp(resolve(electronSrc, name), resolve(outElectron, name));
    }

    const rootPkg = JSON.parse(await readFile(resolve(pkgRoot, "package.json"), "utf8"));
    const electronVer = rootPkg.devDependencies?.electron || ">=42.0.0";

    const pkg = {
        name: "cwsp-electron",
        version: rootPkg.version || "1.0.0",
        private: true,
        type: "module",
        main: "index.mjs",
        description: "CWSP desktop shell (generated); backend = tsx server/index.ts in cwsp-runtime/",
        scripts: {
            start: "electron .",
            dist: "electron-builder --publish never",
            "dist:dir": "electron-builder --dir --publish never",
            "dist:win": "electron-builder --win --publish never",
            "dist:linux": "electron-builder --linux --publish never",
            "dist:mac": "electron-builder --mac --publish never"
        },
        devDependencies: {
            electron: electronVer,
            "electron-builder": ">=24.13.3"
        },
        build: {
            appId: "space.u2re.cwsp",
            productName: "CWSP",
            copyright: "Copyright © U2RE",
            directories: {
                output: "out",
                buildResources: "build-resources"
            },
            files: [
                "**/*",
                "!out/**",
                "!**/*.map"
            ],
            asar: true,
            asarUnpack: [
                "cwsp-runtime/node_modules/**",
                "cwsp-runtime/**/*.node",
                "**/*.node"
            ],
            publish: null,
            win: {
                target: [
                    { target: "nsis", arch: ["x64"] },
                    { target: "portable", arch: ["x64"] }
                ],
                signAndEditExecutable: false
            },
            linux: {
                target: ["AppImage", "deb"],
                category: "Network"
            },
            mac: {
                target: ["dmg", "zip"],
                category: "public.app-category.productivity",
                hardenedRuntime: false,
                gatekeeperAssess: false
            },
            forceCodeSigning: false,
            nsis: {
                oneClick: false,
                allowToChangeInstallationDirectory: true
            },
            portable: {
                artifactName: "${productName}-${version}-portable.${ext}"
            }
        }
    };
    await writeFile(resolve(outElectron, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

    console.log(`[build:electron] Staged Electron app: ${outElectron}`);
    console.log(
        "[build:electron] Run: cd dist/electron && npm install && cd cwsp-runtime && npm install --include=dev && cd .. && npm start"
    );
    console.log(
        "[build:electron] Native installers → dist/electron/out/: npm run build:electron:native | :windows | :linux | :mac"
    );
    console.log(
        "[build:electron] Electron UI: CWS_ELECTRON_URL (public frontend, default https://127.0.0.1:443/) " +
            "and CWS_ELECTRON_ADMIN_URL (health /api/admin, default https://127.0.0.1:8443/)"
    );
}

runBuild().catch((err) => {
    console.error("[build:electron] Failed:", err);
    process.exit(1);
});
