import { executeKeyboardChar } from "../../io/actions.ts";
import { MSG_TYPE_KEYBOARD } from "../../config/constants.ts";
import { toggleEmergencyMoveDisabled } from "../../io/mouse-guard.ts";

type KeyboardAction = {
    type: number;
    codePoint?: number;
    flags?: number;
};

export const handleKeyboardBinaryAction = (_logger: any, msg: KeyboardAction): boolean => {
    if (msg.type !== MSG_TYPE_KEYBOARD) return false;
    if (!("codePoint" in msg)) return false;
    const codePoint = Number(msg.codePoint || 0);
    const flags = Number(msg.flags || 0);
    const isSpaceKey = codePoint === 32 || (flags & 0x07) === 3;
    // Keep manual emergency switch strict to avoid accidental toggles from noisy flags.
    const hasCtrlLikeModifier = (flags & 0x08) !== 0 || (flags & 0x10) !== 0 || (flags & 0x20) !== 0 || (flags & 0x40) !== 0;
    if (isSpaceKey && hasCtrlLikeModifier) {
        const disabled = toggleEmergencyMoveDisabled();
        console.warn(`[airpad.mouse] emergency switch Ctrl+Space => move ${disabled ? "disabled" : "enabled"}`);
        return true;
    }
    executeKeyboardChar(msg.codePoint || 0, msg.flags || 0);
    return true;
};
