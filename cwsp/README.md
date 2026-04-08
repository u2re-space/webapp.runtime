# CWSP

- Unification of Fastify server (of/for) Frontend/PWA.
- Unification with `endpoint` with `server-v2`.
- Desktop: `npm run build:electron` → `dist/electron` (Electron + bundled portable).
- Android **APK** is the Kotlin app **[CWSAndroid](https://github.com/u2re-space/CWSAndroid)** (`apps/CWSAndroid` submodule): `npm run build:android` / `build:cws-android` / `build:electron:android` (portable + Gradle). APKs are built under `apps/CWSAndroid/app/build/outputs/apk/` and **copied** to `cwsp/dist/electron/android/` for packaging next to desktop `dist/electron`. Not an Electron binary.
- Same product family as CWSAndroid (sync, clipboard bridge, admin-style workflows); the web UI is HTML/JS/CSS in portable `frontend/`.
- PWA / browser: serve public Fastify + static frontend as usual.
