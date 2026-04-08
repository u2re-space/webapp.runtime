import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Web assets are staged under dist/capacitor (same merged frontend as portable/Electron).
 * @see scripts/build-capacitor-web.mjs
 *
 * Android (Capacitor WebView) + CrossWord Settings → Server:
 * - Admin doors (HTTPS :8443 / HTTP :8080) and `core.endpointUrl` must use hosts reachable from the device.
 * - Live reload / dev server: set `CWS_CAP_SERVER_URL` (e.g. http://10.0.2.2:5173 for emulator → host).
 * - Cleartext to arbitrary LAN IPs requires extra `<domain>` rows in
 *   `resources/android/network_security_config.xml` (re-applied after each `cap sync` by patch script).
 */
const devServerUrl = typeof process !== 'undefined' && process.env?.CWS_CAP_SERVER_URL?.trim()
    ? process.env.CWS_CAP_SERVER_URL.trim()
    : undefined;

const config: CapacitorConfig = {
    /** Android `applicationId` for the Capacitor-based / extended CWSP app (Kotlin flavor `cwsp`; distinct from standalone `space.u2re.cws`). */
    appId: 'space.u2re.cwsp',
    appName: 'CWSP',
    webDir: 'dist/capacitor',
    android: {
        /** Mixed content: https app origin loading http assets (admin iframe, etc.) */
        allowMixedContent: true
    },
    server: {
        androidScheme: 'https',
        ...(devServerUrl
            ? {
                  url: devServerUrl,
                  /** Required when url is http:// for Android 9+ */
                  cleartext: true
              }
            : {})
    }
};

export default config;
