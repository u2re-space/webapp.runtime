# CWSP

- Unification of Fastify server (of/for) Frontend/PWA.
- Unification with `endpoint` with `server-v2`.
- Desktop: `npm run build:electron` → `dist/electron` (Electron + bundled portable).
- Android **APK (primary)** is the Kotlin app **[CWSAndroid](https://github.com/u2re-space/CWSAndroid)** (`apps/CWSAndroid` submodule): `npm run build:android` / `build:cws-android` / `build:electron:android` (portable + Gradle). Gradle **product flavors**: **`cws`** → `space.u2re.cws` (Kotlin-first standalone); **`cwsp`** → **`space.u2re.cwsp`** (**Capacitor `appId`** / extended-application naming — aligns with `capacitor.config.ts` and the standalone Capacitor Android build). From cwsp, `CWS_ANDROID_PRODUCT_FLAVOR=cwsp` selects `assembleCwspDebug` when `CWS_GRADLEW_TASK` is unset. APKs live under `app/build/outputs/apk/<flavor>/…` and are **copied** to `cwsp/dist/electron/android/`. Not an Electron binary. That Kotlin app also embeds the **same Capacitor WebView shell** (sync `dist/capacitor` into assets; optional `build-cws-android.mjs --with-capacitor-web`).
- Android **Capacitor (alternate)** WebView shell: static UI is staged to `dist/capacitor` (same merged frontend as portable). Once: `npm run cap:add:android`. Then `npm run build:capacitor` (sync) or `npm run build:capacitor:android` (sync + Gradle). APK mirror: `dist/capacitor/android/`. From monorepo `runtime/`: `npm run cwsp:capacitor` / `cwsp:capacitor:android`. **Gradle needs the Android SDK:** set `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) to your SDK, or add `sdk.dir=…` in `android/local.properties`. `build:capacitor:android` auto-writes `local.properties` when the SDK is found via those env vars or default paths (`~/Android/Sdk`, macOS `~/Library/Android/sdk`, Windows `%LOCALAPPDATA%\Android\Sdk`). Override with `CWS_ANDROID_SDK_ROOT` for a one-off path.
- **Capacitor ↔ CrossWord Settings (Server tab):** IndexedDB-backed app settings (endpoint URL, admin HTTPS/HTTP origins, `appClientId`, `allowInsecureTls`) are the same UI as PWA/Electron; on Android, `allowInsecureTls` does not bypass certificate checks by itself—install your CA as a **user certificate** or use a trusted cert. After each `npx cap sync android`, `scripts/patch-capacitor-android-network.mjs` copies `resources/android/network_security_config.xml` and sets `android:networkSecurityConfig` so **cleartext HTTP** works for **localhost / 127.0.0.1 / 10.0.2.2** (emulator→host). For `http://192.168.x.x:8080`, add a `<domain>` line to that XML template and re-run `npm run cap:patch:android-net` or `build:capacitor`. **Kotlin CWSAndroid** is a separate APK pipeline (`build:cws-android`); tune its manifest/network config there for parity.
- **Dev live reload:** `export CWS_CAP_SERVER_URL=http://10.0.2.2:5173` (example) before `npx cap run android` so `capacitor.config.ts` injects `server.url` + `cleartext: true`.
- **WebView debug over ADB (VS Code / Chrome):** debug APK enables `WebView.setWebContentsDebuggingEnabled` in `MainActivity`. Run `runtime/cwsp/scripts/adb-forward-webview-debug.sh` (default device `192.168.0.196:5555`, override `CWS_ADB_DEVICE`), then attach the debugger to `localhost:9222` (repo `.vscode/launch.json` — “CWSP Android WebView”).
- Same product family as CWSAndroid (sync, clipboard bridge, admin-style workflows); the web UI is HTML/JS/CSS in portable `frontend/` (and mirrored into `dist/capacitor` for Capacitor).
- PWA / browser: serve public Fastify + static frontend as usual.

## Fastify

Early runned by:

```json
"build": "npm install --include=dev",
"start": "node ./scripts/index.mjs --port 443 --address 0.0.0.0 --debug --options --esm",
"dev": "npm run start",
"test": "npm run test:dev",
"test:dev": "vite dev --config vite.config.ts",
"test:test": "echo 'No tests configured for fastify-server' && exit 0"
```

And located in `scripts` instead of `fastify-js`.

## TODO

- Add full support for lightweight <https://www.npmjs.com/package/@webviewjs/webview>.
- Building into `dist/webview`.
