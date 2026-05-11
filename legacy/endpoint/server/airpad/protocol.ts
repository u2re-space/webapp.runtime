export type AirpadProtocolVersion = "v1" | "v2";

export type AirpadCompatFrame = {
    version: AirpadProtocolVersion;
    type?: string;
    from?: string;
    to?: string;
    mode?: string;
    payload?: unknown;
    [key: string]: unknown;
};

const normalizeVersion = (value: unknown): AirpadProtocolVersion => {
    if (value === "v2" || value === 2 || value === "2") return "v2";
    return "v1";
};

export const normalizeAirpadProtocolFrame = (frame: Record<string, unknown>): AirpadCompatFrame => {
    const normalized: AirpadCompatFrame = {
        ...frame,
        version: normalizeVersion((frame as any).version ?? (frame as any).protocolVersion)
    };
    if (normalized.version === "v1" && typeof normalized.type !== "string") {
        normalized.type = typeof (frame as any).op === "string" ? String((frame as any).op) : "message";
    }
    return normalized;
};

export const toLegacyAirpadProtocolFrame = (frame: AirpadCompatFrame): Record<string, unknown> => {
    if (frame.version !== "v2") return frame;
    return {
        ...frame,
        protocolVersion: 2
    };
};
