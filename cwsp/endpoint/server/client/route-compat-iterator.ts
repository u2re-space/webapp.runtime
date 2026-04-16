import process from "node:process";
import WebSocket from "ws";

import type { Packet } from "../socket/types.ts";
import {
    buildPacketReply,
    buildServerV2SocketHandshake,
    normalizePacketForWire,
    resolveServerV2WireIdentity
} from "../socket/client-contract.ts";

type RouteMode = "direct" | "via-l200";
type CaseName = "clipboard:isReady" | "mouse:isReady" | "clipboard:update" | "clipboard:write" | "airpad:mouse";

type ActorPair = { source: string; target: string; token: string };
type TestRow = {
    source: string;
    target: string;
    route: RouteMode;
    endpoint: string;
    testCase: CaseName | "connect";
    hop: string;
    pass: boolean;
    attempts: number;
    detail: string;
};

type WaitResult = {
    ok: boolean;
    packet?: Packet;
    reason?: string;
};

const VIA_ID = "L-192.168.0.200";
const DEFAULT_ENDPOINTS = [
    "https://192.168.0.200:8443/",
    "https://192.168.0.110:8443/",
    "https://45.147.121.152:8443/"
];
const DEFAULT_ACTORS: ActorPair[] = [
    { source: "L-192.168.0.196", target: "L-192.168.0.110", token: "n3v3rm1nd" },
    { source: "L-192.168.0.110", target: "L-192.168.0.196", token: "n3v3rm1nd" }
];

const DEFAULT_RETRIES = Number(process.env.CWS_ITER_RETRIES || 3) || 3;
const DEFAULT_TIMEOUT_MS = Number(process.env.CWS_ITER_TIMEOUT_MS || 12000) || 12000;

const endpointSupportsViaL200 = (endpoint: string): boolean => {
    try {
        const host = new URL(endpoint).hostname.trim().toLowerCase();
        return host === "192.168.0.200" || host === "192.168.0.201" || host === "45.147.121.152";
    } catch {
        return endpoint.includes("192.168.0.200") || endpoint.includes("192.168.0.201") || endpoint.includes("45.147.121.152");
    }
};

const parseEndpoints = (): string[] => {
    const raw = String(process.env.CWS_ITER_ENDPOINTS || "").trim();
    if (!raw) return DEFAULT_ENDPOINTS;
    return raw.split(/[;,]/).map((entry) => entry.trim()).filter(Boolean);
};

const parseActors = (): ActorPair[] => {
    const raw = String(process.env.CWS_ITER_ACTORS || "").trim();
    if (!raw) return DEFAULT_ACTORS;
    return raw
        .split(";")
        .map((entry) => {
            const [source, target, token] = entry.split(",").map((value) => String(value || "").trim());
            if (!source || !target) return null;
            return { source, target, token: token || "n3v3rm1nd" };
        })
        .filter(Boolean) as ActorPair[];
};

const toRuntimeOp = (value: unknown): string => {
    const op = String(value || "").trim().toLowerCase();
    if (op === "request") return "ask";
    if (op === "response") return "result";
    if (op === "notify" || op === "signal" || op === "redirect") return "act";
    return op;
};

const parsePacket = (raw: WebSocket.RawData): Packet | null => {
    try {
        const text = typeof raw === "string" ? raw : raw.toString("utf8");
        const decoded = JSON.parse(text) as Record<string, unknown> | null;
        if (!decoded || typeof decoded !== "object") return null;
        const packetLike = decoded?.event && decoded?.payload
            ? (decoded.payload as Record<string, unknown>)
            : decoded;
        if (!packetLike || typeof packetLike !== "object") return null;
        const normalized: Record<string, unknown> = { ...packetLike };
        if (!normalized.uuid && typeof normalized.id === "string") {
            normalized.uuid = normalized.id;
        }
        if ((!normalized.byId || !String(normalized.byId).trim()) && typeof normalized.sender === "string") {
            normalized.byId = normalized.sender;
        }
        if ((!normalized.from || !String(normalized.from).trim()) && normalized.ids && typeof normalized.ids === "object") {
            const ids = normalized.ids as Record<string, unknown>;
            normalized.from = ids.from || ids.sender || ids.byId || normalized.byId;
        }
        if (!Array.isArray(normalized.nodes) && Array.isArray(normalized.destinations)) {
            normalized.nodes = normalized.destinations;
        }
        if ((!normalized.what || !String(normalized.what).trim()) && typeof normalized.type === "string") {
            normalized.what = normalized.type;
        }
        return normalized as Packet;
    } catch {
        return null;
    }
};

const tracePacket = (packet?: Packet): string => {
    if (!packet) return "none";
    const byId = String((packet as any).byId || "");
    const from = String((packet as any).from || "");
    const op = String((packet as any).op || "");
    const what = String((packet as any).what || "");
    const uuid = String((packet as any).uuid || "");
    const nodes = Array.isArray((packet as any).nodes) ? (packet as any).nodes.join(",") : "";
    return `op=${op} what=${what} byId=${byId} from=${from} uuid=${uuid} nodes=[${nodes}]`;
};

const waitForPacket = (
    ws: WebSocket,
    predicate: (packet: Packet) => boolean,
    timeoutMs: number
): Promise<WaitResult> => new Promise((resolve) => {
    let done = false;
    let lastSeenPacket: Packet | undefined;
    const finish = (value: WaitResult) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        ws.off("message", onMessage);
        resolve(value);
    };
    const timer = setTimeout(
        () => finish({
            ok: false,
            reason: `timeout ${timeoutMs}ms; last=${tracePacket(lastSeenPacket)}`
        }),
        timeoutMs
    );
    const onMessage = (raw: WebSocket.RawData) => {
        const packet = parsePacket(raw);
        if (!packet) return;
        lastSeenPacket = packet;
        if (!predicate(packet)) return;
        finish({ ok: true, packet });
    };
    ws.on("message", onMessage);
});

const connectSocket = async (endpointUrl: string, route: RouteMode, actor: ActorPair): Promise<{
    ws: WebSocket;
    identity: ReturnType<typeof resolveServerV2WireIdentity>;
}> => {
    const identity = resolveServerV2WireIdentity({
        endpointUrl,
        userId: actor.source,
        deviceId: actor.source,
        token: actor.token,
        connectionType: "exchanger-initiator",
        archetype: "server-v2",
        rejectUnauthorized: false,
        peerInstanceId: `iter-v2-${Date.now()}-${Math.random().toString(16).slice(2)}`
    });
    const hs = buildServerV2SocketHandshake(identity);
    if (route === "via-l200") {
        hs.query.__airpad_via = "tunnel";
        hs.query.__airpad_endpoint = "0";
        hs.query.__airpad_route_target = VIA_ID;
        hs.query.routeTarget = VIA_ID;
    } else {
        hs.query.__airpad_route_target = actor.target;
        hs.query.routeTarget = actor.target;
    }
    const parsed = new URL(identity.endpointUrl);
    parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    parsed.pathname = "/ws";
    parsed.search = "";
    for (const [key, value] of Object.entries(hs.query)) {
        if (!key || !value) continue;
        parsed.searchParams.set(key, value);
    }
    return await new Promise((resolve, reject) => {
        const ws = new WebSocket(parsed.toString(), {
            rejectUnauthorized: false,
            headers: {
                ...(hs.auth.token ? { Authorization: `Bearer ${hs.auth.token}` } : {}),
                ...(hs.auth.token ? { "X-CWS-Token": hs.auth.token } : {}),
                ...(hs.auth.clientId ? { "X-CWS-Client-Id": hs.auth.clientId } : {}),
                ...(hs.auth.userId ? { "X-CWS-User-Id": hs.auth.userId } : {}),
                ...(hs.query.connectionType ? { "X-CWS-Connection-Type": hs.query.connectionType } : {}),
                ...(hs.query.archetype ? { "X-CWS-Archetype": hs.query.archetype } : {})
            }
        });
        const timer = setTimeout(() => {
            ws.terminate();
            reject(new Error("connect-timeout"));
        }, 9000);
        ws.on("open", () => {
            clearTimeout(timer);
            resolve({ ws, identity });
        });
        ws.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
        });
    });
};

const sendAndAwaitOnce = async (
    ws: WebSocket,
    identity: ReturnType<typeof resolveServerV2WireIdentity>,
    packet: Packet,
    timeoutMs: number
): Promise<WaitResult> => {
    const normalized = normalizePacketForWire({
        ...packet,
        uuid: packet.uuid || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    }, identity);
    const uuid = String(normalized.uuid || "");
    const expectedTarget = String(
        (Array.isArray((normalized as any).nodes) ? (normalized as any).nodes[0] : "") || ""
    ).trim();
    const expectedWhat = String((normalized as any).what || "").trim().toLowerCase();
    ws.send(JSON.stringify(normalized));
    const resolveUuid = (packet: Packet): string => {
        const direct = String((packet as any).uuid || (packet as any).id || "").trim();
        if (direct) return direct;
        const ids = (packet as any).ids;
        if (ids && typeof ids === "object") {
            const nested = String((ids as any).requestId || (ids as any).uuid || "").trim();
            if (nested) return nested;
        }
        return "";
    };
    return waitForPacket(ws, (incoming) => {
        const incomingUuid = resolveUuid(incoming);
        const runtimeOp = toRuntimeOp((incoming as any).op);
        if (incomingUuid && incomingUuid === uuid) {
            if (["result", "resolve", "error", "response"].includes(runtimeOp)) return true;
            return runtimeOp !== "ask";
        }
        // Compatibility path for legacy peers that return dispatch-style response
        // without propagating request uuid.
        if (!incomingUuid && ["result", "resolve", "error", "response"].includes(runtimeOp)) {
            const source = String((incoming as any).byId || (incoming as any).from || "").trim();
            if (!source || !expectedTarget || source !== expectedTarget) return false;
            const incomingWhat = String((incoming as any).what || "").trim().toLowerCase();
            const compatibleWhat =
                incomingWhat === expectedWhat ||
                (expectedWhat.startsWith("clipboard:") && (incomingWhat === "dispatch" || incomingWhat.startsWith("clipboard:"))) ||
                (expectedWhat.startsWith("airpad:") && (incomingWhat === "dispatch" || incomingWhat.startsWith("mouse:") || incomingWhat.startsWith("airpad:")));
            return compatibleWhat;
        }
        // Do not consume unrelated non-ask traffic from other live peers. The
        // iterator is often run against noisy gateways, so accepting any
        // response/result packet here produces false PASS rows.
        return false;
    }, timeoutMs);
};

const sendWithRetries = async (
    ws: WebSocket,
    identity: ReturnType<typeof resolveServerV2WireIdentity>,
    packet: Packet,
    retries: number,
    timeoutMs: number
): Promise<{ result: WaitResult; attempts: number }> => {
    let last: WaitResult = { ok: false, reason: "no-attempt" };
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        last = await sendAndAwaitOnce(ws, identity, packet, timeoutMs);
        if (last.ok) return { result: last, attempts: attempt };
    }
    return { result: last, attempts: retries };
};

const isTargetPeer = (packet: Packet | undefined, actor: ActorPair): boolean => {
    if (!packet) return false;
    const byId = String((packet as any).byId || "").trim();
    const from = String((packet as any).from || "").trim();
    const nodes = Array.isArray((packet as any).nodes) ? (packet as any).nodes.map((v: unknown) => String(v || "").trim()) : [];
    return byId === actor.target || from === actor.target || nodes.includes(actor.target);
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null;
};

const packetShowsClipboardHandledByTarget = (packet: Packet | undefined, actor: ActorPair): boolean => {
    if (!packet) return false;
    if (isTargetPeer(packet, actor)) return true;
    const result = asRecord((packet as any).result);
    if (!result) return false;
    const handled = result.handled === true || result.ok === true;
    if (!handled) return false;
    const clipboard = asRecord(result.clipboard);
    const text = String(clipboard?.text || result.text || "").trim();
    const source = String(result.source || "").trim().toLowerCase();
    return text.isNotBlank?.() === true || !!text || source == "android-daemon" || source == "windows-host";
};

const didTargetHandle = (testName: CaseName, packet: Packet | undefined, actor: ActorPair): boolean => {
    if (isTargetPeer(packet, actor)) return true;
    switch (testName) {
        case "clipboard:update":
        case "clipboard:write":
            return packetShowsClipboardHandledByTarget(packet, actor);
        default:
            return false;
    }
};

const runOneRoute = async (endpoint: string, route: RouteMode, actor: ActorPair): Promise<TestRow[]> => {
    const rows: TestRow[] = [];
    let ws: WebSocket | null = null;
    try {
        const conn = await connectSocket(endpoint, route, actor);
        ws = conn.ws;
        const identity = conn.identity;
        rows.push({
            source: actor.source,
            target: actor.target,
            route,
            endpoint,
            testCase: "connect",
            hop: `${actor.source}->endpoint`,
            pass: true,
            attempts: 1,
            detail: "wss connected"
        });

        const tokenAsk = await waitForPacket(
            ws,
            (incoming) => toRuntimeOp((incoming as any).op) === "ask" && String((incoming as any).what || "") === "token",
            4000
        );
        if (tokenAsk.ok && tokenAsk.packet) {
            const reply = buildPacketReply(tokenAsk.packet, identity, { result: { id: identity.userId, token: identity.token } });
            ws.send(JSON.stringify(normalizePacketForWire(reply, identity)));
            rows.push({
                source: actor.source,
                target: actor.target,
                route,
                endpoint,
                testCase: "connect",
                hop: `endpoint->${actor.target}`,
                pass: true,
                attempts: 1,
                detail: "token handshake ok"
            });
        } else {
            rows.push({
                source: actor.source,
                target: actor.target,
                route,
                endpoint,
                testCase: "connect",
                hop: `endpoint->${actor.target}`,
                pass: false,
                attempts: 1,
                detail: tokenAsk.reason || "no token ask"
            });
        }

        const cases: Array<{ name: CaseName; packet: Packet }> = [
            {
                name: "clipboard:isReady",
                packet: { op: "ask", what: "clipboard:isReady", payload: {}, nodes: [actor.target] } as Packet
            },
            {
                name: "mouse:isReady",
                packet: { op: "ask", what: "mouse:isReady", payload: {}, nodes: [actor.target] } as Packet
            },
            {
                name: "clipboard:update",
                packet: { op: "act", what: "clipboard:update", payload: { text: `iter-v2-${route}-${Date.now()}` }, nodes: [actor.target] } as Packet
            },
            {
                name: "clipboard:write",
                packet: { op: "act", what: "clipboard:write", payload: { text: `iter-v2-write-${route}-${Date.now()}` }, nodes: [actor.target] } as Packet
            },
            {
                name: "airpad:mouse",
                packet: { op: "act", what: "airpad:mouse", payload: { op: "mouse:move", data: { x: 3, y: 1, z: 0 } }, nodes: [actor.target] } as Packet
            }
        ];

        for (const test of cases) {
            const packet = {
                ...test.packet,
                byId: actor.source,
                from: actor.source,
                nodes: Array.isArray((test.packet as any).nodes) ? (test.packet as any).nodes : [actor.target]
            } as Packet;
            const { result, attempts } = await sendWithRetries(ws, identity, packet, DEFAULT_RETRIES, DEFAULT_TIMEOUT_MS);
            rows.push({
                source: actor.source,
                target: actor.target,
                route,
                endpoint,
                testCase: test.name,
                hop: `${actor.source}->endpoint`,
                pass: result.ok,
                attempts,
                detail: result.ok ? tracePacket(result.packet) : (result.reason || "no response")
            });
            rows.push({
                source: actor.source,
                target: actor.target,
                route,
                endpoint,
                testCase: test.name,
                hop: `endpoint->${actor.target}`,
                pass: isTargetPeer(result.packet, actor),
                attempts,
                detail: tracePacket(result.packet)
            });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error || "unknown");
        rows.push({
            source: actor.source,
            target: actor.target,
            route,
            endpoint,
            testCase: "connect",
            hop: `${actor.source}->endpoint`,
            pass: false,
            attempts: 1,
            detail: message
        });
    } finally {
        if (ws) {
            try {
                ws.terminate();
            } catch {
                // noop
            }
        }
    }
    return rows;
};

const printReport = (rows: TestRow[]) => {
    console.log("");
    console.log("| Source->Target | Route | Endpoint | Case | Hop | Attempts | Status | Detail |");
    console.log("|---|---|---|---|---|---:|---|---|");
    for (const row of rows) {
        const status = row.pass ? "PASS" : "FAIL";
        const endpointShort = row.endpoint.replace(/^https?:\/\//, "");
        const safeDetail = row.detail.replace(/\|/g, "/");
        console.log(`| ${row.source}->${row.target} | ${row.route} | ${endpointShort} | ${row.testCase} | ${row.hop} | ${row.attempts} | ${status} | ${safeDetail} |`);
    }
    const total = rows.length;
    const passed = rows.filter((row) => row.pass).length;
    const failed = total - passed;
    console.log("");
    console.log(`Totals: pass=${passed}, fail=${failed}, total=${total}`);
    if (failed > 0) process.exitCode = 1;
};

const main = async () => {
    const endpoints = parseEndpoints();
    const actors = parseActors();
    const rows: TestRow[] = [];
    for (const actor of actors) {
        for (const endpoint of endpoints) {
            const routes: RouteMode[] = endpointSupportsViaL200(endpoint) ? ["direct", "via-l200"] : ["direct"];
            for (const route of routes) {
                rows.push(...(await runOneRoute(endpoint, route, actor)));
            }
        }
    }
    printReport(rows);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
