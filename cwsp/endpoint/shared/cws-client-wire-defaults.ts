/**
 * Client-side defaults for CWSP / AirPad WebSocket identity hints.
 * Keep in sync with server fallbacks in `server/socket/client-contract.ts`.
 *
 * @see runtime/cwsp/endpoint/SPECIFICATION-v2.md
 */

export const CWS_DEFAULT_WIRE_ARCHETYPE = "server-v2";
export const CWS_DEFAULT_WIRE_CONNECTION_TYPE = "exchanger-initiator";

export function resolveWireConnectionType(raw: string | undefined): string {
    const t = (raw ?? "").trim();
    return t || CWS_DEFAULT_WIRE_CONNECTION_TYPE;
}

export function resolveWireArchetype(raw: string | undefined): string {
    const t = (raw ?? "").trim();
    return t || CWS_DEFAULT_WIRE_ARCHETYPE;
}
