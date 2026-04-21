/**
 * CWSP v2 route diagnostic query keys for `/ws` and Socket.IO handshakes.
 * Standard CWSP v2 keys for route diagnostics (replacing legacy pre-v2 transport-hint names).
 *
 * @see runtime/cwsp/endpoint/SPECIFICATION-v2.md
 */

export const CWSP_ROUTE_QUERY = {
    via: "cwsp_via",
    /** "1" = client reached route target directly; "0" = tunnel/hop path */
    localEndpoint: "cwsp_local_endpoint",
    route: "cwsp_route",
    routeTarget: "cwsp_route_target",
    hop: "cwsp_hop",
    host: "cwsp_host",
    target: "cwsp_target",
    targetPort: "cwsp_target_port",
    viaPort: "cwsp_via_port",
    protocol: "cwsp_protocol"
} as const;

export type CwspRouteQueryKey = (typeof CWSP_ROUTE_QUERY)[keyof typeof CWSP_ROUTE_QUERY];
