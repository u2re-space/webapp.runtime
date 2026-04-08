#!/usr/bin/env node
console.log(
    "[cwsp] Alternative Android shell: Capacitor (not the primary Kotlin app).\n" +
        "  Primary APK: Kotlin CWSAndroid — npm run build:electron:android (or build:cws-android).\n" +
        "  Capacitor: webDir = dist/portable/frontend, then:\n" +
        "  npm i @capacitor/core @capacitor/cli && npx cap init && npx cap add android && npx cap copy && npx cap build android"
);
process.exit(0);
