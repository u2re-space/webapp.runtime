// =========================
// Mouse Movement Handling
// =========================

import { executeMouseMove } from "./actions.ts";
import { pickEnvNumberLegacy } from "../lib/env.ts";
import { applyAutoGuardSignal, clearAutoGuardSuspicion, getMouseGuardState, isEmergencyMoveDisabled, refreshMouseGuardState } from "./mouse-guard.ts";

// Import constants
import { SERVER_JITTER_EPS, SERVER_MAX_STEP, SERVER_SMOOTH_ALPHA } from "../config/constants.ts";

type MouseSession = {
    accumDx: number;
    accumDy: number;
    smoothDx: number;
    smoothDy: number;
    lastInputAt: number;
    blockedUntil: number;
    windowStartAt: number;
    windowEventCount: number;
    windowAbsSum: number;
    lastAcceptedAt: number;
    lastSeq: number;
    packetSeen: Map<string, number>;
};

const sessions = new Map<string, MouseSession>();

const MOUSE_INPUT_WINDOW_MS = Math.max(20, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_WINDOW_MS", 120) ?? 120);
const MOUSE_MAX_EVENTS_PER_WINDOW = Math.max(20, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_MAX_EVENTS_PER_WINDOW", 180) ?? 180);
const MOUSE_MAX_ABS_SUM_PER_WINDOW = Math.max(500, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_MAX_ABS_SUM_PER_WINDOW", 3500) ?? 3500);
const MOUSE_MAX_INPUT_DELTA = Math.max(4, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_MAX_INPUT_DELTA", 120) ?? 120);
const MOUSE_BLOCK_COOLDOWN_MS = Math.max(100, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_BLOCK_COOLDOWN_MS", 1200) ?? 1200);
const MOUSE_IDLE_RESET_MS = Math.max(20, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_IDLE_RESET_MS", 120) ?? 120);
const MOUSE_PROBATION_MS = Math.max(200, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_PROBATION_MS", 1200) ?? 1200);
const MOUSE_MIN_INTERVAL_MS = Math.max(1, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_MIN_INTERVAL_MS", 2) ?? 2);
const MOUSE_QUANT_STEP = Math.max(0.05, Number(pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_QUANT_STEP", 0.25) ?? 0.25));
const MOUSE_PACKET_DEDUPE_TTL_MS = Math.max(100, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_PACKET_DEDUPE_TTL_MS", 1500) ?? 1500);
const MOUSE_PACKET_DEDUPE_MAX = Math.max(128, pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_PACKET_DEDUPE_MAX", 2048) ?? 2048);
const MOUSE_GAIN = (() => {
    const raw = Number(pickEnvNumberLegacy("CWS_AIRPAD_MOUSE_GAIN", 0.25) ?? 0.25);
    if (!Number.isFinite(raw)) return 0.25;
    return Math.max(0.05, Math.min(1, raw));
})();

const normalizeSourceId = (value: unknown): string => {
    const v = String(value || "").trim().toLowerCase();
    return v || "default";
};

const getSession = (sourceId: string): MouseSession => {
    const key = normalizeSourceId(sourceId);
    const existing = sessions.get(key);
    if (existing) return existing;
    const created: MouseSession = {
        accumDx: 0,
        accumDy: 0,
        smoothDx: 0,
        smoothDy: 0,
        lastInputAt: 0,
        blockedUntil: 0,
        windowStartAt: 0,
        windowEventCount: 0,
        windowAbsSum: 0,
        lastAcceptedAt: 0,
        lastSeq: 0,
        packetSeen: new Map<string, number>()
    };
    sessions.set(key, created);
    return created;
};

const prunePacketSeen = (session: MouseSession, now: number): void => {
    for (const [id, ts] of session.packetSeen.entries()) {
        if (now - ts > MOUSE_PACKET_DEDUPE_TTL_MS) session.packetSeen.delete(id);
    }
    if (session.packetSeen.size > MOUSE_PACKET_DEDUPE_MAX) {
        const overflow = session.packetSeen.size - MOUSE_PACKET_DEDUPE_MAX;
        let i = 0;
        for (const id of session.packetSeen.keys()) {
            session.packetSeen.delete(id);
            i += 1;
            if (i >= overflow) break;
        }
    }
};

const resetSessionIntegrators = (session: MouseSession): void => {
    session.accumDx = 0;
    session.accumDy = 0;
    session.smoothDx = 0;
    session.smoothDy = 0;
};

const quantize = (value: number): number => {
    if (!Number.isFinite(value)) return 0;
    return Math.round(value / MOUSE_QUANT_STEP) * MOUSE_QUANT_STEP;
};

export function addMouseDelta(
    dx: number,
    dy: number,
    meta: {
        sourceId?: string;
        packetId?: string;
        seq?: number;
    } = {}
) {
    refreshMouseGuardState();
    if (isEmergencyMoveDisabled()) return;
    const now = Date.now();
    const session = getSession(meta.sourceId || "default");
    if (now < session.blockedUntil) return;

    const packetId = String(meta.packetId || "").trim();
    if (packetId) {
        prunePacketSeen(session, now);
        if (session.packetSeen.has(packetId)) return;
        session.packetSeen.set(packetId, now);
    }
    const seq = Number(meta.seq || 0);
    if (seq > 0 && session.lastSeq > 0 && seq <= session.lastSeq) {
        return;
    }
    if (seq > 0) session.lastSeq = seq;

    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
        applyAutoGuardSignal(0.9, "invalid-delta", MOUSE_BLOCK_COOLDOWN_MS, MOUSE_PROBATION_MS);
        return;
    }

    if (!session.windowStartAt || now - session.windowStartAt > MOUSE_INPUT_WINDOW_MS) {
        session.windowStartAt = now;
        session.windowEventCount = 0;
        session.windowAbsSum = 0;
    }

    session.windowEventCount += 1;
    const clampedDx = Math.max(-MOUSE_MAX_INPUT_DELTA, Math.min(MOUSE_MAX_INPUT_DELTA, dx));
    const clampedDy = Math.max(-MOUSE_MAX_INPUT_DELTA, Math.min(MOUSE_MAX_INPUT_DELTA, dy));
    const quantDx = quantize(clampedDx * MOUSE_GAIN);
    const quantDy = quantize(clampedDy * MOUSE_GAIN);
    session.windowAbsSum += Math.abs(clampedDx) + Math.abs(clampedDy);

    const eventRatio = session.windowEventCount / MOUSE_MAX_EVENTS_PER_WINDOW;
    const absRatio = session.windowAbsSum / MOUSE_MAX_ABS_SUM_PER_WINDOW;
    const stress = Math.max(eventRatio, absRatio);
    if (stress > 1) {
        session.blockedUntil = now + MOUSE_BLOCK_COOLDOWN_MS;
        resetSessionIntegrators(session);
        const state = applyAutoGuardSignal(0.95 + Math.min(1.2, stress - 1), "runaway-detected", MOUSE_BLOCK_COOLDOWN_MS, MOUSE_PROBATION_MS);
        console.warn(`[airpad.mouse] auto-guard=${state} stress=${stress.toFixed(2)} source=${normalizeSourceId(meta.sourceId)}`);
        return;
    }
    clearAutoGuardSuspicion(0.08);

    if (session.lastAcceptedAt && now - session.lastAcceptedAt < MOUSE_MIN_INTERVAL_MS) return;
    session.lastAcceptedAt = now;
    session.lastInputAt = now;
    session.accumDx += quantDx;
    session.accumDy += quantDy;
}

function flushAccumulatedMouse() {
    refreshMouseGuardState();
    if (isEmergencyMoveDisabled()) return;
    const now = Date.now();
    for (const [sourceId, session] of sessions.entries()) {
        if (now < session.blockedUntil) continue;
        if (session.lastInputAt && now - session.lastInputAt > MOUSE_IDLE_RESET_MS) {
            resetSessionIntegrators(session);
            continue;
        }
        if (session.accumDx === 0 && session.accumDy === 0) continue;

        const dx = Math.max(-SERVER_MAX_STEP, Math.min(SERVER_MAX_STEP, session.accumDx));
        const dy = Math.max(-SERVER_MAX_STEP, Math.min(SERVER_MAX_STEP, session.accumDy));
        if (Math.abs(dx) < SERVER_JITTER_EPS && Math.abs(dy) < SERVER_JITTER_EPS) {
            session.accumDx = 0;
            session.accumDy = 0;
            continue;
        }

        session.smoothDx += (dx - session.smoothDx) * SERVER_SMOOTH_ALPHA;
        session.smoothDy += (dy - session.smoothDy) * SERVER_SMOOTH_ALPHA;
        executeMouseMove(session.smoothDx, session.smoothDy);
        session.accumDx -= session.smoothDx;
        session.accumDy -= session.smoothDy;

        if (now - session.lastInputAt > MOUSE_PACKET_DEDUPE_TTL_MS * 2) {
            sessions.delete(sourceId);
        }
    }
}

// Start the mouse flush interval (1 ms)
export function startMouseFlushInterval() {
    setInterval(flushAccumulatedMouse, 1);
}

export function getMouseControllerState(): Record<string, unknown> {
    return {
        guard: getMouseGuardState(),
        sessions: Array.from(sessions.entries()).map(([sourceId, session]) => ({
            sourceId,
            accumDx: Number(session.accumDx.toFixed(3)),
            accumDy: Number(session.accumDy.toFixed(3)),
            smoothDx: Number(session.smoothDx.toFixed(3)),
            smoothDy: Number(session.smoothDy.toFixed(3)),
            blockedUntil: session.blockedUntil,
            lastInputAt: session.lastInputAt,
            windowEventCount: session.windowEventCount,
            windowAbsSum: Number(session.windowAbsSum.toFixed(2))
        }))
    };
}
