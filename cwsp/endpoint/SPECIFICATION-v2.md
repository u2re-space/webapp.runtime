# New Specification for Coordination

Available for changing by AI.

## Frame

New specification of messages (for example, in websockets, or HTTP body [POST]).

```
{
    redirect: boolean,
    flags: {...}, # specific/special flags of message
    op: "act" | "ask",
    purpose: "airpad" | "mouse" | "input" | "clipboard" | "contact" | "sms" | "generic" | "general" | "storage",
    protocol: "socket" | "http" | "local" | "chrome" | "worker" # what protocol was used...
    srcPlatform?: "android" | "windows" | "linux" | "web" | "chrome" | "crx" # etc. used platform of message, may be multiple (array) or ommited
    dstPlatform?: "android" | "windows" | "linux" | "web" | "chrome" | "crx" # etc. for what platform used message, may be multiple (array) or ommited
    type: "response" | "request" | "ack" | "redirect" | "signal" | "act" | "broadcast", # redirect same as request, signal isn't waiting a response
    uuid: UUIDv4, # UUID of message series
    timestamp: number, # when first of message was generated
    what: ACTION_TYPE, # what needs to achieve/reach/get
    payload: ENCODED_DATA, # Body, POST-like payload
    results: ENCODED_DATA, # Results, alike in response
    role: [("requestor" | "responser" | "bridge" | "link")...], # what role will after request, also "bridge" or "link", I don't know how to name truly...
    status: number,             # status code (when response)
    ids: [ID_NAME...],          # passthrough ID's
    urls: [urls...],            # found/used URLs (physically)
    tokens: [tokens...],        # clients/peers tokens used
    sender: ID_NAME | URL,      # who originally sended message
    destinations: [ID_NAME...], # where &ould be sent, acted or asked
    flags: {}, # special options/flags of message
    extensions?: [...], # additional/special protocol extensions to used
    defer?: "none" | "idb" | "storage" | "promise" | "allowed" # can be message be deferred effect?
}
```

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
        "roles": ["responser-initiated", "requestor-initiated", "responser-initiator", "requestor-initiator", "exchanger-initiator", "exchanger-initiated"],
        "relations": {
            "L-192.168.0.196": "both ws,socketio,http,tcp",
            "L-192.168.0.208": "both ws,socketio,http,tcp",
            "L-192.168.0.110": "both ws,socketio,http,tcp",
            "L-wan-client": "both ws,socketio,http,tcp"
        },
        "forward": [{
            "id": "L-192.168.0.110",
            "conditions": ["airpad", "mouse", "keyboard"]
        }, "self"],
        "broadcast": [{
            "targets": ["L-192.168.0.196", "L-192.168.0.110", "L-192.168.0.208", "L-wan-client"],
            "conditions": ["clipboard-tunnel", "clipboard-write", "clipboard-read"]
        }],
        "protocols": {
            "websocket": {
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
            "mobile": true,
            "gateway": true,
            "direct": true
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
        "roles": ["responser-initiated", "requestor-initiated", "responser-initiator", "requestor-initiator", "exchanger-initiator", "exchanger-initiated"],
        "relations": {
            "L-192.168.0.200": "both ws,socketio,http,tcp",
            "L-192.168.0.196": "both ws,socketio,http,tcp",
            "L-192.168.0.208": "both ws,socketio,http,tcp",
            "L-wan-client": "both ws,socketio,http,tcp"
        },
        "flags": {
            "mobile": true,
            "gateway": false,
            "direct": true
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
        "roles": ["responser-initiator", "requestor-initiator", "exchanger-initiator", "exchanger-initiated"],
        "relations": {
            "L-192.168.0.110": "both ws,socketio,http,tcp",
            "L-192.168.0.200": "both ws,socketio,http,tcp",
            "L-192.168.0.196": "both ws,socketio,http,tcp",
            "L-wan-client": "both ws,socketio,http,tcp"
        },
        "flags": {
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
        "roles": ["responser-initiator", "requestor-initiator", "exchanger-initiator", "exchanger-initiated"],
        "relations": {
            "L-192.168.0.110": "both ws,socketio,http,tcp",
            "L-192.168.0.200": "both ws,socketio,http,tcp",
            "L-192.168.0.208": "both ws,socketio,http,tcp",
            "L-wan-client": "both ws,socketio,http,tcp"
        },
        "flags": {
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
                "shareTo": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"],
                "acceptFrom": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.208", "L-wan-client"]
            }],
            "keyboard": ["client-only"]
        }
    },
    "L-wan-client": {
        "origins": ["u2re.space", "www.u2re.space"],
        "tokens": ["inline:VDS-client", "env:CWS_ASSOCIATED_TOKEN"],
        "roles": ["responser-initiator", "requestor-initiator", "exchanger-initiator", "exchanger-initiated"],
        "relations": {
            "L-192.168.0.110": "both ws,socketio,http,tcp",
            "L-192.168.0.200": "both ws,socketio,http,tcp",
            "L-192.168.0.196": "both ws,socketio,http,tcp",
            "L-192.168.0.208": "both ws,socketio,http,tcp"
        },
        "flags": {
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
                "shareTo": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-192.168.0.208"],
                "acceptFrom": ["L-192.168.0.110", "L-192.168.0.200", "L-192.168.0.196", "L-192.168.0.208"]
            }],
            "keyboard": ["client-only"]
        }
    },
    "*": {
        "origins": ["*"],
        "tokens": ["*"],
        "roles": ["responser-initiator", "requestor-initiator"],
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
