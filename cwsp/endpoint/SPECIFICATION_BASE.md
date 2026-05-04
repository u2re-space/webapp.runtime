# New Specification for Coordination (Base)

Don't recommended to changing by AI.

## Frame

New specification of messages (for example, in websockets, or HTTP body [POST]).

```
{
    redirect: boolean,
    flags: {...}, # specific/special flags of message
    op: "act" | "ask" | "signal" | "request" | "response" | "redirect" | "notify",
    type: "response" | "request" | "ack" | "redirect" | "signal" | "act" | "broadcast" | "initial" | "notify", # redirect same as request, signal isn't waiting a response, act also have no requirements to waiting response
    purpose: "airpad" | "mouse" | "input" | "clipboard" | "contact" | "sms" | "generic" | "general" | "storage",
    protocol: "socket" | "http" | "local" | "chrome" | "worker" # what protocol was used...
    srcPlatform?: "android" | "windows" | "linux" | "web" | "chrome" | "crx" # etc. used platform of message, may be multiple (array) or ommited
    dstPlatform?: "android" | "windows" | "linux" | "web" | "chrome" | "crx" # etc. for what platform used message, may be multiple (array) or ommited
    uuid: UUIDv4, # UUID of message series
    timestamp: number, # when first of message was generated
    what: ACTION_TYPE, # what needs to achieve/reach/get
    payload: ENCODED_DATA, # Body, POST-like payload
    results: ENCODED_DATA, # Results, alike in response
    toRoles: [("requestor" | "responser" | "acceptor" | "executor" | "actor" | "bridge" | "link" | "exchanger" | "sender")...], # what role will enabled after request (initial), also "bridge" or "link", I don't know how to name truly...
    status?: number,            # status code (when response)
    ids: [ID_NAME...],          # passthrough ID's (broadcasting, tunneling)
    urls: [urls...],            # found/used URLs (physically)
    tokens: [tokens...],        # clients/peers tokens used (to DST)
    sender: ID_NAME | URL,      # who originally sended message
    destinations: [(ID_NAME | URL)...], # where &ould be sent, acted or asked
    flags: {}, # special options/flags of message
    extensions?: [...], # additional/special protocol extensions to used
    defer?: "none" | "cache" | "idb" | "storage" | "promise" | "allowed" # can be message be deferred effect?
}
```

## Guards

- Message with same UUID (and/or some data) isn't/&ouldn't accepted or resend twice and/or more than twice in timing window (100ms or 300ms), for avoid recursion issues.
- Sender can't/won't allowed to get (for act or accept) same message, that he sended.

## Determination peerId in coordinator

- By initiator ID (when income initiation)
- By ID where to initate (when outcome initiation)

## Specific cases (in payloads, in `payload` fields)

Operations:
- `{ "op": "sms:delivery", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "contact:delivery", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "contact:ask", "params": [...] }`
- `{ "op": "notification:ask", "params": [...] }`
- `{ "op": "notification:delivery", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "clipboard:delivery", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "clipboard:write", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "clipboard:read", "params": [...] }`
- `{ "op": "airpad:mouse", "params": [...], "data": BASE_64_ENCODED_DATA_16_BYTE }`
- `{ "op": "airpad:keyboard", "params": [...], "data": BASE_64_ENCODED_DATA_16_BYTE }`
- `{ "op": "airpad:clipboard:write", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "airpad:clipboard:read" , "params": [...] }`
- `{ "op": "airpad:clipboard:delivery", "params": [...], "data": BASE_64_ENCODED_DATA }`
- `{ "op": "ai:process" , "params": [...], "token": STRING, "data": [JSON_DATA | INSTRUCTION | IMAGES_IN_BASE64] }`
- `{ "op": "assets:load", "params": [...] }`
- `{ "op": "assets:save", "params": [...], "token": STRING, "data": [JSON_DATA | TEXT_DATA | IMAGES | BINARY] }`

When/where:
- `BASE_64_ENCODED_DATA_16_BYTE` may/can be encrypted or unencrypted, also is binary code
- `BASE_64_ENCODED_DATA`         may/can be encrypted or unencrypted
- In `"params": [...]`           may/can be described where, when, how to use those data

## Config example

Client permission and routing (destination) topology

```json
{
    "l-192.168.0.200": "alias:L-192.168.0.200",
    "l-192.168.0.110": "alias:L-192.168.0.110",
    "l-192.168.0.196": "alias:L-192.168.0.196",
    "l-192.168.0.208": "alias:L-192.168.0.208",
    "192.168.0.200": "alias:L-192.168.0.200",
    "45.147.121.152": "alias:L-192.168.0.200",
    "100.76.202.88": "alias:L-192.168.0.200",
    "L-45.147.121.152": "alias:L-192.168.0.200",
    "l-45.147.121.152": "alias:L-192.168.0.200",
    "l-wan-client": "alias:L-wan-client",
    "L-192.168.0.200": {
        "origins": ["192.168.0.200", "192.168.0.201", "100.76.202.88", "45.147.121.152"],
        "tokens": [],
        "platform": ["linux", "web", "chrome"],
        "roles": ["responser", "requestor", "exchanger", "bridge", "link", "sender"],
        "relations": {
            "L-192.168.0.196": "both ws,http,tcp,socketio",
            "L-192.168.0.208": "both ws,http,tcp,socketio",
            "L-192.168.0.110": "both ws,http,tcp,socketio",
            "L-wan-client": "both ws,http,tcp,socketio"
        },
        "forward": [{
            "id": "L-192.168.0.110",
            "conditions": ["airpad", "input", "mouse", "keyboard"]
        }, "self"],
        "broadcast": [{
            "targets": ["L-192.168.0.196", "L-192.168.0.110", "L-192.168.0.208", "L-wan-client"],
            "conditions": ["clipboard-tunnel", "clipboard-write", "clipboard-read"]
        }],
        "protocols": {
            "websocket": {
                "reverse": true,
                "client": true,
                "server": true,
                "tunnel": true
            },
            "http": {
                "enabled": true,
                "direction": ["accept", "request"]
            }
        },
        "flags": {
            "initiator": true,
            "initiated": true,
            "mobile": true,
            "gateway": true,
            "direct": true,
            "firstOrder": true
        },
        "tls": {
            "enabled": true,
            "ca": "fs:../https/local/rootCA.crt",
            "cert": "fs:../https/local/multi.crt",
            "key": "fs:../https/local/multi.key",
            "servername": "192.168.0.200"
        },
        "ports": {
            "wss": [8443],
            "ws": [8080],
            "http": [8080],
            "https": [8443]
        },
        "allowedForwards": ["L-192.168.0.110", "self"],
        "allowedIncoming": ["*"],
        "allowedOutgoing": ["*"],
        "modules": {
            "mouse": ["tunnel-only"],
            "clipboard": ["tunnel-allowed", "write-allowed", "read-allowed",{
                "shareTo": ["L-192.168.0.196", "L-192.168.0.110", "L-192.168.0.208", "L-wan-client"],
                "acceptFrom": ["L-192.168.0.196", "L-192.168.0.110", "L-192.168.0.208", "L-wan-client"]
            }],
            "keyboard": ["tunnel-only"]
        }
    },
    "L-192.168.0.110": {
        "origins": ["192.168.0.110", "192.168.0.111", "100.110.152.73"],
        "tokens": [],
        "roles": ["responser", "requestor", "exchanger", "actor", "executor", "bridge", "link", "sender"],
        "platform": ["windows", "web", "chrome"],
        "relations": {
            "L-192.168.0.200": "both ws,http,tcp,socketio",
            "L-192.168.0.196": "both ws,http,tcp,socketio",
            "L-192.168.0.208": "both ws,http,tcp,socketio",
            "L-wan-client": "both ws,http,tcp,socketio"
        },
        "flags": {
            "initiator": true,
            "initiated": true,
            "mobile": true,
            "gateway": false,
            "direct": true,
            "firstOrder": true
        },
        "forward": ["self"],
        "ports": {
            "wss": [8443],
            "ws": [8080],
            "http": [8080],
            "https": [8443]
        },
        "tls": {
            "enabled": true,
            "ca": "fs:../https/local/rootCA.crt",
            "cert": "fs:../https/local/multi.crt",
            "key": "fs:../https/local/multi.key",
            "servername": "192.168.0.200"
        },
        "protocols": {
            "websocket": {
                "reverse": true,
                "client": true,
                "server": true,
                "tunnel": true
            },
            "http": {
                "enabled": true,
                "direction": ["accept", "request"]
            }
        },
        "allowedIncoming": ["*"],
        "allowedOutgoing": ["*"],
        "modules": {
            "mouse": ["ahk-used", "tunnel-allowed", "airpad-allowed", {
                "mode": "relative",
                "allowed": ["L-192.168.0.196", "L-192.168.0.200", "L-192.168.0.208", "self"]
            }],
            "clipboard": ["ahk-used", "write-allowed", "read-allowed", "tunnel-allowed", {
                "pollInterval": 1000,
                "shareTo": ["L-192.168.0.196", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"],
                "acceptFrom": ["L-192.168.0.196", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"]
            }],
            "keyboard": ["ahk-used", "tunnel-allowed", {
                "allowed": ["L-192.168.0.196", "L-192.168.0.200", "L-192.168.0.208", "self"],
                "clipboard": true
            }]
        }
    },
    "L-192.168.0.208": {
        "origins": ["192.168.0.208", "100.90.155.65"],
        "tokens": ["inline:n3v3rm1nd", "inline:n3v3rm1nd-2", "env:CWS_ASSOCIATED_TOKEN"],
        "roles": ["responser", "requestor", "exchanger", "actor", "executor", "exchanger", "sender"],
        "platform": ["android", "web"],
        "relations": {
            "L-192.168.0.110": "both ws,http,tcp,socketio",
            "L-192.168.0.200": "both ws,http,tcp,socketio",
            "L-192.168.0.196": "both ws,http,tcp,socketio",
            "L-wan-client": "both ws,http,tcp,socketio"
        },
        "flags": {
            "initiator": true,
            "initiated": false,
            "mobile": true,
            "gateway": false,
            "direct": false,
            "firstOrder": false
        },
        "forward": ["self"],
        "tls": {
            "enabled": true,
            "ca": "fs:../https/local/rootCA.crt",
            "cert": "fs:../https/local/multi.crt",
            "key": "fs:../https/local/multi.key"
        },
        "ports": {
            "wss": [8443],
            "ws": [8080],
            "http": [8080],
            "https": [8443]
        },
        "protocols": {
            "websocket": {
                "client": true,
                "reverse": true,
                "keepalive": true
            },
            "http": {
                "enabled": true,
                "keepalive": true,
                "direction": ["request-only"]
            }
        },
        "allowedIncoming": ["*"],
        "allowedOutgoing": ["*"],
        "modules": {
            "mouse": ["client-only"],
            "clipboard": ["write-allowed", "read-allowed", "tunnel-allowed", {
                "pollInterval": 1000,
                "shareTo": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-wan-client"],
                "acceptFrom": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-wan-client"]
            }],
            "keyboard": ["client-only"]
        }
    },
    "L-192.168.0.196": {
        "origins": ["192.168.0.196", "100.99.178.6"],
        "tokens": ["inline:n3v3rm1nd", "inline:n3v3rm1nd-2", "env:CWS_ASSOCIATED_TOKEN"],
        "roles": ["responser", "requestor", "exchanger", "actor", "executor", "exchanger", "sender"],
        "platform": ["android", "web"],
        "relations": {
            "L-192.168.0.110": "both ws,http,tcp,socketio",
            "L-192.168.0.200": "both ws,http,tcp,socketio",
            "L-192.168.0.208": "both ws,http,tcp,socketio",
            "L-wan-client": "both ws,http,tcp,socketio"
        },
        "flags": {
            "initiator": true,
            "initiated": false,
            "mobile": true,
            "gateway": false,
            "direct": false,
            "firstOrder": false
        },
        "forward": ["self"],
        "tls": {
            "enabled": true,
            "ca": "fs:../https/local/rootCA.crt",
            "cert": "fs:../https/local/multi.crt",
            "key": "fs:../https/local/multi.key"
        },
        "ports": {
            "wss": [8443],
            "ws": [8080],
            "http": [8080],
            "https": [8443]
        },
        "protocols": {
            "websocket": {
                "client": true,
                "reverse": true,
                "keepalive": true,
                "server": true
            },
            "http": {
                "enabled": true,
                "keepalive": true,
                "direction": ["request-only"]
            }
        },
        "allowedIncoming": ["*"],
        "allowedOutgoing": ["*"],
        "modules": {
            "mouse": ["client-only"],
            "clipboard": ["write-allowed", "read-allowed", "tunnel-allowed", {
                "pollInterval": 1000,
                "shareTo": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"],
                "acceptFrom": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"]
            }],
            "keyboard": ["client-only"]
        }
    },
    "L-wan-client": {
        "origins": ["u2re.space", "www.u2re.space"],
        "tokens": ["inline:VDS-client", "env:CWS_ASSOCIATED_TOKEN"],
        "roles": ["responser", "requestor", "exchanger", "sender"],
        "relations": {
            "L-192.168.0.110": "both ws,http,tcp,socketio",
            "L-192.168.0.200": "both ws,http,tcp,socketio",
            "L-192.168.0.196": "both ws,http,tcp,socketio",
            "L-192.168.0.208": "both ws,http,tcp,socketio"
        },
        "flags": {
            "initiator": true,
            "initiated": false,
            "firstOrder": false,
            "mobile": true,
            "gateway": false,
            "direct": false
        },
        "forward": ["self"],
        "tls": {
            "enabled": true,
            "ca": "fs:../https/local/rootCA.crt",
            "cert": "fs:../https/local/multi.crt",
            "key": "fs:../https/local/multi.key"
        },
        "ports": {
            "wss": [8443],
            "ws": [8080],
            "http": [8080],
            "https": [8443]
        },
        "protocols": {
            "websocket": {
                "client": true,
                "reverse": true,
                "keepalive": true,
                "server": true
            },
            "http": {
                "enabled": true,
                "keepalive": true,
                "direction": ["request-only"]
            }
        },
        "allowedIncoming": ["*"],
        "allowedOutgoing": ["*"],
        "modules": {
            "mouse": ["client-only"],
            "clipboard": ["write-allowed", "read-allowed", "tunnel-allowed", {
                "pollInterval": 1000,
                "shareTo": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-192.168.0.208"],
                "acceptFrom": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-192.168.0.208"]
            }],
            "keyboard": ["client-only"]
        }
    },
    "*": {
        "origins": ["*"],
        "tokens": ["*"],
        "roles": ["responser", "requestor"],
        "flags": {
            "mobile": true,
            "gateway": true,
            "direct": false
        },
        "allowedIncoming": ["*"],
        "allowedOutgoing": []
    }
}
```

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

This pair is used for peer identity on the canonical `/ws` transport.

- `clientId` identifies the peer/device.
- `token` or `userKey` carries the associated client token.
- A known LAN IP may stand in for the token side of identity in trusted cases.
- Android-native and AirPad/PWA are parallel client apps, not one merged identity/runtime.
- Both may connect directly or through a bridge/gateway, but they still join the shared endpoint world through `/ws` first.

### Endpoint or Server Auth Token

Additional Server (endpoint) Auth Token is a separate master/admin token for the endpoint itself. It is optional for ordinary peer connections and must not be fused with the associated client token.

- This endpoint/master token may intentionally be the same literal value as an AirPad control token.
- Sharing the same literal secret does not collapse the concepts: control auth remains separate from peer identity.

### Encryption?

Determined by `endpoint` server, while handshake with `client`, and only once, next time used Client ID and Token (or IP address) identifiers, encryption not dependent. 

### Client ID Auth Token

Optionally, some client IDs can/may use a second auth token for incoming control connections such as AirPad.

- Wire name: `airpadToken`
- It is optional and separate from `token` / `userKey`
- A client may send both `token` and `airpadToken` in the same websocket handshake when required
- Control-oriented endpoint surfaces such as `/devices` may accept the endpoint/master token or the AirPad control token when those are intentionally shared
