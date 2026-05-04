# CWSP Network Stack v2 Specification

Available for changing by AI. Recomments to change it, if something is wrong.

## Purpose

This document describes the current v2 network contract used across:

- `runtime/cwsp/endpoint/server`
- `apps/CrossWord/src/frontend`
- `apps/CrossWord/src/pwa`
- `apps/CrossWord/src/crx`
- AirPad views and rails
- native bridges that reuse the same envelope semantics

This specification describes the unified websocket-first transport:

- native WebSocket at `/ws` is the canonical realtime transport
- Socket.IO remains an optional compatibility transport and relay path, but it is disabled by default
- HTTP remains a compatibility and fallback transport
- clipboard, AirPad, mouse, keyboard, voice, and dispatch flows share one normalized packet contract

## Transport Layers

### 1. Canonical realtime transport

- Path: `/ws`
- Wire shape: JSON frame
- Runtime entrypoint: `server/socket/ws-gateway.ts`
- Canonical server runtime: `server/socket/runtime.ts`

Native WebSocket is the canonical realtime transport for all peers. Socket.IO should only be enabled explicitly for older compatibility paths.

### 2. HTTP compatibility / fallback transport

- `/api/network/dispatch`
- `/api/broadcast`
- `/clipboard`
- `/lna-probe`
- other legacy compatibility endpoints under `/api/*`

HTTP is used when:

- a peer is not yet websocket-routable
- legacy clients/scripts only know HTTP
- clipboard needs a reliability/fan-out fallback
- diagnostics need a cheap reachability probe before websocket handshake

## Canonical Envelope

The canonical logical message is a normalized packet. It may arrive as a websocket frame, a Socket.IO event payload, or an HTTP body.

```json
{
  "op": "ask | act | result | error",
  "type": "string",
  "what": "domain:action",
  "purpose": "airpad | clipboard | input | mouse | sms | contact | notification | storage | general",
  "protocol": "socket | ws | http | worker | chrome | local",
  "transport": "ws | socketio | bridge | http",
  "uuid": "uuid-v4-or-compatible-id",
  "timestamp": 1710000000000,
  "payload": {},
  "data": {},
  "result": {},
  "results": {},
  "error": {},
  "status": 200,
  "sender": "peer-id",
  "byId": "peer-id",
  "from": "peer-id",
  "nodes": ["target-id"],
  "destinations": ["target-id"],
  "ids": {
    "byId": "peer-id",
    "destinations": ["target-id"]
  },
  "urls": ["https://host"],
  "tokens": ["opaque-token"],
  "flags": {
    "canonicalV2": true
  },
  "extensions": [],
  "defer": "none | cache | idb | storage | promise | allowed"
}
```

## Verb Semantics

### Logical verbs

- `ask`: request data or readiness and expect a reply
- `act`: fire-and-forget action, although some legacy flows may still answer
- `result`: successful answer to a previous `ask` or compatibility response
- `error`: failed answer to a previous `ask`

### Compatibility verb mapping

The server accepts and normalizes these incoming verb aliases:

- `request` -> `ask`
- `response` -> `result`
- `signal` -> `act`
- `notify` -> `act`
- `redirect` -> `act`
- `ack` -> `result`
- `resolve` -> `result`

When emitting canonical websocket frames, packets are mapped back to frame verbs:

- `ask` -> `request`
- `result` / `resolve` -> `response`
- `act` -> `act`
- `error` -> `error`

## Normalization Rules

### Payload carriers

The stack accepts these payload carriers in order of preference:

1. `payload`
2. `data`
3. `body`
4. `params` for some legacy frame forms
5. `result` for response-like wrappers

### Action-name inference

The runtime infers `what` from:

1. explicit `what`
2. `type`
3. `action`
4. nested payload `op` / `action` / `type`
5. fallback `"dispatch"`

Legacy single-word actions are normalized to canonical names, for example:

- `clipboard` -> `clipboard:update`
- `sms` -> `sms:send`
- `notifications` / `notify` -> `notification:speak`
- `dispatch` -> `network:dispatch`

### Binary compatibility

Older AirPad binary packets are still accepted and normalized into canonical actions:

- binary move -> `mouse:move`
- binary click -> `mouse:click`
- binary scroll -> `mouse:scroll`
- binary down/up -> `mouse:down` / `mouse:up`
- binary keyboard -> `keyboard:type` or `keyboard:tap`

## Identity And Routing

### Canonical peer identity

Routing is performed primarily by normalized node ids such as:

- `L-192.168.0.200`
- `L-192.168.0.110`
- `L-192.168.0.196`
- `L-192.168.0.208`
- `L-wan-client`

### Accepted identity hints

The coordinator can resolve peers from multiple aliases:

- canonical endpoint id
- WAN/LAN origin host
- bare IP
- `clientId`
- `userId`
- `byId`
- token/account aliases
- explicit route targets

### Routing fields

These fields may all participate in routing or reply resolution:

- `nodes`
- `destinations`
- `target`
- `targetId`
- `deviceId`
- `sender`
- `byId`
- `from`

### Important routing behavior

- empty target list means local broadcast/fan-out
- `*` means wildcard fan-out
- self-routing is suppressed where appropriate
- known aliases collapse onto the same live socket wrapper
- active-peer filtering may temporarily suppress configured peers for diagnostics or automation
- gateway relay reuse is preferred before opening new remote relay paths

## Transport Preference

Transport preference is resolved per source/target pair from endpoint policy.

Current preference order is generally:

1. `ws`
2. `http`
3. `tcp`
4. `socketio`

Runtime behavior:

- explicit transport hint wins when supported
- otherwise policy preference order is used
- if no preferred sender exists, fallback order is `ws -> bridge -> socketio`

The chosen transport may be attached to dispatched payloads for diagnostics.

## Clipboard Contract

### Canonical clipboard actions

- `clipboard:update`
- `clipboard:write`
- `clipboard:read`
- `clipboard:get`
- `clipboard:clear`
- `clipboard:isReady`

### AirPad-compatible clipboard aliases

- `airpad:clipboard:write`
- `airpad:clipboard:read`
- `airpad:clipboard:delivery`
- `airpad:clipboard:isReady`

### Payload rules

Clipboard text may arrive in any of these locations:

- `payload.text`
- `payload.content`
- `payload.body`
- `data.text`
- `data.content`
- `data.body`
- direct string payload

Receivers should treat the first usable textual value as the clipboard body.

### Clipboard routing behavior

Clipboard is special:

- legacy Socket.IO clipboard events still exist for compatibility
- coordinator packets are the canonical internal representation
- websocket-first delivery may still keep HTTP dispatch as a reliability path
- duplicate clipboard updates are suppressed in a short timing window
- local clipboard watch loops are temporarily suppressed after applying remote text to avoid echo storms

### Clipboard events in compatibility mode

Socket.IO compatibility still uses:

- `clipboard:get`
- `clipboard:copy`
- `clipboard:cut`
- `clipboard:update`
- `clipboard:paste`

These are normalized into the same packet/handler model.

## Input / AirPad Contract

### Canonical input actions

- `mouse:move`
- `mouse:click`
- `mouse:scroll`
- `mouse:down`
- `mouse:up`
- `mouse:isReady`
- `keyboard:type`
- `keyboard:tap`
- `keyboard:toggle`
- `keyboard:isReady`
- `voice:submit`

### AirPad wrapper actions

The endpoint also accepts spec-style AirPad wrappers:

- `airpad:mouse`
- `airpad:keyboard`

These wrappers are unwrapped by `server/socket/handlers/airpad.ts` into canonical mouse/keyboard actions.

### AirPad wrapper payload shape

The wrapper payload may use:

- `op`
- `action`
- `type`
- `params[0]`

with a nested `data` object such as:

```json
{
  "op": "mouse:move",
  "data": {
    "x": 12,
    "y": -4,
    "z": 0
  }
}
```

Examples:

```json
{ "what": "airpad:mouse", "payload": { "op": "move", "data": { "x": 3, "y": -1 } } }
{ "what": "airpad:mouse", "payload": { "op": "click", "data": { "button": "left", "double": true } } }
{ "what": "airpad:keyboard", "payload": { "op": "tap", "data": { "key": "enter", "modifier": ["ctrl"] } } }
{ "what": "airpad:keyboard", "payload": { "op": "type", "data": { "text": "hello" } } }
{ "what": "voice:submit", "payload": { "text": "open settings" } }
```

### Input execution

Current input execution model:

- endpoint handlers normalize actions
- local input access modules perform the platform action
- voice may be forwarded into the Python assistant bridge
- readiness asks are local capability probes

## Network Dispatch Contract

### Canonical dispatch action

- `network:dispatch`

Compatibility aliases:

- `network.dispatch`
- `http:dispatch`
- `request:dispatch`
- plain `dispatch`

Dispatch payloads may nest another action inside `payload.payload` or `payload.data`. The runtime unwraps these before local handling so nested clipboard and readiness flows behave correctly.

## App / Shell Notes

### Frontend / web app

`apps/CrossWord/src/frontend/shared/transport/websocket.ts` is the browser-side compatibility layer. It:

- builds canonical coordinator packets
- sends them over Socket.IO `data`
- keeps `protocol: "socket"` and `transport: "ws"` metadata
- handles clipboard ask/result flows
- probes multiple candidate origins
- annotates CWSP route metadata in query params (Socket.IO / optional diagnostics)

Important CWSP route query markers (handshake URL; not canonical packet fields):

- `cwsp_via`
- `cwsp_local_endpoint`
- `cwsp_route`
- `cwsp_route_target`
- `cwsp_hop`
- `cwsp_host`
- `cwsp_target`
- `cwsp_target_port`
- `cwsp_via_port`
- `cwsp_protocol`

Older pre-v2 transport-hint query names are not supported; use the `cwsp_*` keys above only.

These are transport diagnostics hints, not the canonical packet payload.

#### Client wire identity (handshake query)

WebSocket / Engine.IO handshakes send `connectionType` and `archetype` query parameters. Defaults match `server/socket/client-contract.ts` and `shared/cws-client-wire-defaults.ts` (`exchanger-initiator`, `server-v2`).

CrossWord / Settings UI maps these from `AppSettings`:

- `core.socket.connectionType` — optional; empty uses default
- `core.socket.archetype` — optional; empty uses default
- `core.socket.protocolLanesJson` — optional JSON object mirroring per-node config-v2 `Protocols` (lane → role strings); reserved for tooling / future wire hints

When settings are not loaded (standalone bundles), the same values can be supplied via `globalThis.AIRPAD_CONFIG.connectionType` / `.archetype` or `globalThis.CWS_CONNECTION_TYPE` / `globalThis.CWS_ARCHETYPE` (see `runtime/cwsp/endpoint/frontend/apps/cw/views/airpad2.js`).

### PWA / service worker

The PWA service worker must not intercept control-channel traffic that would break transport:

- `/socket.io`
- `/lna-probe`
- private-host `/api/*` control traffic

The reason is simple: service-worker caching/proxying can look like socket failure even when the real problem is the worker intercepting probe or handshake requests.

### CRX / Chrome extension

CRX code should reuse the same logical envelope semantics:

- the action names stay the same
- `protocol` may be `chrome`
- `transport` may reflect websocket, message-port, or bridge specifics

### Native / bridge shells

Native bridges may reuse the same packet fields while advertising a different `protocol`, for example:

- `protocol: "local"`
- `protocol: "worker"`
- `protocol: "chrome"`

The canonical message meaning is defined by `op`, `what`, `payload`, `nodes`, `uuid`, and identity fields, not by transport-specific event names.

## Diagnostics

### Coordinator trace labels

The socket coordinator emits trace lines such as:

- `[socket:packet-in]`
- `[socket:packet-normalized]`
- `[socket:packet-duplicate-suppressed]`
- `[socket:route-decision]`
- `[socket:forward-error]`
- `[socket:forward-skip]`
- `[socket:hello]`
- `[socket:transport-connect]`
- `[socket:transport-reconnect]`
- `[socket:initiate-start]`
- `[socket:initiate-connect]`
- `[socket:initiate-error]`
- `[socket:initiate-timeout]`
- `[socket:initiate-failed]`
- `[socket:find-cache-hit]`
- `[socket:find-cache-miss]`
- `[socket:find-cooldown]`

These labels are part of the operational surface of the stack and should be kept stable where possible.

### Route log channel

Structured route-log output uses:

- `channel: "cwsp-route"`

This is used for route resolution and tunnel-forward explanation rather than packet-by-packet transport tracing.

### Suppression behavior

Some trace lines are intentionally suppression-aware:

- repeated identical trace lines within the suppression window are collapsed
- summary lines like `[socket:<event>-suppressed]` may be emitted instead
- this is required to keep reconnect storms or route misses from flooding logs

## Guards And Safety

- duplicate replies are suppressed for a short window
- duplicate clipboard updates are suppressed for a short window
- sender/self echo is avoided where possible
- tunnel/gateway routing may inject configured forward nodes when the route collapses back onto the current gateway
- wildcard broadcast is allowed, but active-peer filtering may narrow it
- packet payloads are sanitized before wire send to avoid recursive or unserializable structures

## Configuration Shape

The runtime settings layer centers on:

```json
{
  "core": {
    "mode": "endpoint",
    "roles": ["endpoint", "requestor-initiated", "responser-initiated"],
    "bridge": {
      "enabled": true,
      "mode": "active",
      "endpoints": [],
      "preconnect": {
        "enabled": true,
        "targets": ["L-192.168.0.200"],
        "reconnectMs": 1000
      }
    },
    "endpointIDs": {
      "L-192.168.0.200": {
        "origins": ["192.168.0.200", "45.147.121.152"],
        "roles": ["requestor", "responser", "bridge"],
        "flags": {
          "gateway": true
        },
        "allowedForwards": ["L-192.168.0.110", "self"]
      }
    },
    "ops": {
      "httpTargets": [],
      "allowUnencrypted": false,
      "allowInsecureTls": false,
      "logLevel": "info"
    }
  }
}
```

### Meaning of important config areas

- `core.bridge`: compatibility bridge and relay behavior
- `core.bridge.preconnect`: proactive bridge dialing to keep reverse/tunnel paths warm
- `core.endpointIDs`: canonical peer registry, aliases, origins, roles, flags, and forward permissions
- `core.ops.httpTargets`: HTTP dispatch fallback targets
- `core.ops.allowInsecureTls`: explicit TLS relaxation for environments that need it

## Stable Action Names

The following action names should be treated as stable contract names unless there is a strong migration reason:

- `clipboard:update`
- `clipboard:write`
- `clipboard:read`
- `clipboard:get`
- `clipboard:clear`
- `clipboard:isReady`
- `mouse:move`
- `mouse:click`
- `mouse:scroll`
- `mouse:down`
- `mouse:up`
- `mouse:isReady`
- `keyboard:type`
- `keyboard:tap`
- `keyboard:toggle`
- `keyboard:isReady`
- `voice:submit`
- `network:dispatch`
- `notification:speak`
- `sms:send`

## Compatibility Notes

- The stack is still mixed-transport and mixed-generation.
- Canonical packets are the internal contract; transport wrappers are compatibility layers.
- `payload` and `data` are both still supported.
- `nodes` and `destinations` are both still supported.
- `/ws` is the native-first route; HTTP remains an important fallback path, and Socket.IO is compatibility-only when it is explicitly enabled.
- The specification should prefer describing canonical meaning first, then compatibility aliases second.

---

## Network stack:

How &ould works our network.

```
[ Laptop/Ultrabook ] Bi-dir  {[ Server (Endpoint), Have External Entry IP ]}
[ L-192.168.0.110  ] ←←---→→ {[ 192.168.0.200:8443 / 45.147.121.152:8443  ]}
          ↑                         ↑                         ↑
          ┷                         ↑                         ↑ 
          |                         ↓                         ↓ 
          ┗------------------{[ [L-192.168.0.196] |- - -| [L-192.168.0.208] ]}   # Phone device groups (cws-androids, PWA-airpad)
                                [Android Phone 1]         [Android Phone 2]
```

### Topology

**L-192.168.0.110 <---> L-192.168.0.196**
- clipboard (via android application, and cwsp endpoint server)
- `airpad` signals (PWA/WebView application)
  - mouse
  - keyboard
  - clipboard
- tunneling through 192.168.0.200:8443 / 45.147.121.152:8443 if in LTE/NAT mode, using identification client token

**L-192.168.0.110 <---> L-192.168.0.208**
- clipboard (via android application, and cwsp endpoint server)
- `airpad` signals (PWA/WebView application)
  - mouse
  - keyboard
  - clipboard
- tunneling through 192.168.0.200:8443 / 45.147.121.152:8443 if in LTE/NAT mode, using identification client token

**L-192.168.0.196 <---> L-192.168.0.208**
- clipboard (via android application, and cwsp endpoint server)
- tunneling through 192.168.0.200:8443 / 45.147.121.152:8443 if one of in LTE/NAT mode, using identification client token

**L-192.168.0.110 <---> {[ 192.168.0.200:8443 / 45.147.121.152:8443 ]}**
- initiated or initiator exchanger (bridge/tunnel/link)
- `L-192.168.0.110` is AirPad controllable (by PWA apps)
  - Or directly, or through bridge/proxy
- `L-192.168.0.110` is one of `clipboard` (and/or other data) synchronize/exchanger member
  - Devices through bridge/proxy can/may ask or pass `clipboard` (and/or other data) data

**{[ 192.168.0.200:8443 / 45.147.121.152:8443 ]}** 
- is in general a central coordinator (bridge, and/or tunnel/proxy)

---

## Potential routes what needs to support

- Airpad (PWA) or Native from `L-192.168.0.196` to https://192.168.0.110:8443/ (local/private network)
- Airpad (PWA) or Native from `L-192.168.0.196` through `https://192.168.0.200:8443/`  to `L-192.168.0.110` (local/private network)
- Airpad (PWA) or Native from `L-192.168.0.196` through `https://45.147.121.152:8443/` to `L-192.168.0.110` (any network of device)
- Native (app) Clipboard (and/or other data) from `L-192.168.0.196` to https://192.168.0.110:8443/ (local network, directly)
- Native (app) Clipboard (and/or other data) from `L-192.168.0.196` to through `https://192.168.0.200:8443/`  to `L-192.168.0.110` (local network, directly)
- Native (app) Clipboard (and/or other data) from `L-192.168.0.196` to through `https://45.147.121.152:8443/` to `L-192.168.0.110` (any network of device)
- CWSP/`endpoint` Clipboard (and/or other data) from `L-192.168.0.110` to https://192.168.0.196:8443/ (rare case, local network, directly)
- CWSP/`endpoint` Clipboard (and/or other data) from `L-192.168.0.110` to through `https://192.168.0.200:8443/`  to `L-192.168.0.196` (local network, directly)
- CWSP/`endpoint` Clipboard (and/or other data) from `L-192.168.0.110` to through `https://45.147.121.152:8443/` to `L-192.168.0.196` (any network of device)

### `L-192.168.0.196` may/can be:

- Simulator/debug client from `45.150.9.153` (VDS), with client token `n3v3rm1nd` instead of IP
- PWA or Native application from NAT (unknown IP, but with client token `n3v3rm1nd` instead of IP)
- PWA or Native application from private/local network with IP `192.168.0.196`.

### Associated Client ID and Token

This pair is the normal peer identity for websocket-first clients.

- `clientId` identifies the peer/device.
- `token` or `userKey` carries the associated client token.
- In some trusted LAN cases, a known IP can stand in for the token side of identity.
- Android-native and AirPad/PWA are parallel client apps, not one merged client model.
- Both may connect directly to a target endpoint or indirectly through a bridge/gateway, but they should still enter the shared world through `/ws` first.

### Endpoint or Server Auth Token

Additional Server (endpoint) Auth Token is a master/admin token for the endpoint itself. It is optional for normal peer connections and must stay separate from the associated client token stored in `clients.json`.

- This control/master token may intentionally be the same literal secret as an AirPad control token.
- Even when the literal value is the same, the concepts remain separate: endpoint control auth is not the same field as peer identity.

### Encryption?

Determined by `endpoint` server, while handshake with `client`, and only once, next time used Client ID and Token (or IP address) identifiers, encryption not dependent. 

### Client ID Auth Token

Optionally, some client IDs can/may have/use a second auth token for incoming control connections, for example AirPad remote-control flows.

- Wire name: `airpadToken`
- This token is optional.
- It must not silently replace `token` / `userKey`.
- A client may send both: `token` for peer identity and `airpadToken` for control auth.
- Control-oriented endpoint surfaces such as `/devices` may accept the endpoint/master token or the AirPad control token when they are intentionally shared.
- Socket.IO is compatibility-only here; Android-native clients should not depend on it.
