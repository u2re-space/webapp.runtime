#!/usr/bin/env node
console.log(
    "[cwsp] Two Android paths:\n" +
        "  1) Kotlin CWSAndroid (primary, same family as endpoint/server-v2 features):\n" +
        "     npm run build:cws-android  (from runtime/cwsp) — APKs → dist/electron/android/\n" +
        "  2) Capacitor WebView shell (alternative):\n" +
        "     npm run cap:add:android    (once, creates android/)\n" +
        "     npm run build:capacitor:android — web → dist/capacitor, sync, Gradle — APKs → dist/capacitor/android/\n" +
        "  Electron desktop: npm run build:electron → dist/electron\n"
);
process.exit(0);
