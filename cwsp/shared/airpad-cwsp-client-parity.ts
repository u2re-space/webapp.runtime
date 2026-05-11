/**
 * Stable `@cwsp/shared/airpad-cwsp-client-parity` entry for CWSAndroid / webpack (`config.resolve.alias["@cwsp"]`).
 *
 * WHY: The canonical source lives under `modules/projects/subsystem` (also exposed as `cwsp-shared/` in Vite apps).
 * Re-export keeps one implementation while allowing a single `@cwsp/...` alias root at `runtime/cwsp`.
 */
export * from "../../../modules/projects/subsystem/runtime/airpad-cwsp-client-parity";
