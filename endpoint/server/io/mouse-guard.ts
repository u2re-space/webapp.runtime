export type MouseGuardState = "normal" | "suspect" | "tripped" | "cooldown" | "probation";

type AutoGuardContext = {
    state: MouseGuardState;
    reason: string;
    cooldownUntil: number;
    probationUntil: number;
    suspectScore: number;
};

let manualMoveDisabled = false;
const autoGuard: AutoGuardContext = {
    state: "normal",
    reason: "",
    cooldownUntil: 0,
    probationUntil: 0,
    suspectScore: 0
};

const nowMs = (): number => Date.now();

const isAutoBlockedState = (state: MouseGuardState): boolean => state === "tripped" || state === "cooldown";

const setAutoState = (next: MouseGuardState, reason = ""): void => {
    if (autoGuard.state !== next) {
        console.warn(`[airpad.mouse] auto-guard state ${autoGuard.state} -> ${next}${reason ? ` (${reason})` : ""}`);
    }
    autoGuard.state = next;
    autoGuard.reason = reason;
};

export const isEmergencyMoveDisabled = (): boolean => {
    refreshMouseGuardState();
    return manualMoveDisabled || isAutoBlockedState(autoGuard.state);
};

export const toggleEmergencyMoveDisabled = (): boolean => {
    manualMoveDisabled = !manualMoveDisabled;
    console.warn(`[airpad.mouse] manual switch => ${manualMoveDisabled ? "disabled" : "enabled"}`);
    return manualMoveDisabled;
};

export const setEmergencyMoveDisabled = (value: boolean): void => {
    manualMoveDisabled = value === true;
};

export const refreshMouseGuardState = (): MouseGuardState => {
    const now = nowMs();
    if (autoGuard.state === "tripped" || autoGuard.state === "cooldown") {
        if (now >= autoGuard.cooldownUntil) {
            setAutoState("probation", "cooldown-complete");
        } else {
            setAutoState("cooldown", autoGuard.reason || "cooldown-active");
        }
    }
    if (autoGuard.state === "probation" && now >= autoGuard.probationUntil) {
        autoGuard.suspectScore = 0;
        setAutoState("normal", "probation-complete");
    }
    return autoGuard.state;
};

export const applyAutoGuardSignal = (signal: number, reason = "auto-guard", cooldownMs = 1400, probationMs = 1200): MouseGuardState => {
    const safeSignal = Number.isFinite(signal) ? Math.max(0, signal) : 0;
    const safeCooldown = Math.max(200, Number(cooldownMs) || 1400);
    const safeProbation = Math.max(400, Number(probationMs) || 1200);
    refreshMouseGuardState();
    autoGuard.suspectScore = Math.max(0, autoGuard.suspectScore + safeSignal);
    if (autoGuard.suspectScore >= 1.7) {
        autoGuard.cooldownUntil = nowMs() + safeCooldown;
        autoGuard.probationUntil = autoGuard.cooldownUntil + safeProbation;
        autoGuard.suspectScore = 0;
        setAutoState("tripped", reason);
        return autoGuard.state;
    }
    if (autoGuard.state === "normal" && autoGuard.suspectScore > 0.25) {
        setAutoState("suspect", reason);
    }
    return autoGuard.state;
};

export const clearAutoGuardSuspicion = (decay = 0.12): MouseGuardState => {
    refreshMouseGuardState();
    if (autoGuard.state === "normal" || autoGuard.state === "suspect") {
        autoGuard.suspectScore = Math.max(0, autoGuard.suspectScore - Math.max(0, decay));
        if (autoGuard.state === "suspect" && autoGuard.suspectScore <= 0.05) {
            setAutoState("normal", "decayed");
        }
    }
    return autoGuard.state;
};

export const getMouseGuardState = (): Readonly<AutoGuardContext & { manualMoveDisabled: boolean }> => ({
    ...autoGuard,
    manualMoveDisabled
});
