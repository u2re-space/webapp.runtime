import { Promised } from "@utils/Promised.ts";
import type { NativeInputDriver, PointerButton, ToggleState } from "./types.ts";

export let ahkInitialized = false;
export let ahkService: Promise<any> | null = null;

export const getAhkService = () => {
    if (!ahkInitialized || !ahkService) {
        ahkService = import("./adapters/ahk-service.ts")
            .then(async (module) => {
                const service = module.ahkService;
                if (!service.isReady()) {
                    await service.start();
                }
                return service;
            });
        ahkInitialized = true;
    }
    return ahkService;
};

const specialKeyMap: Record<string, string> = {
    backspace: "{Backspace}",
    enter: "{Enter}",
    tab: "{Tab}",
    escape: "{Escape}",
    esc: "{Escape}",
    delete: "{Delete}",
    del: "{Delete}",
    space: "{Space}",
    left: "{Left}",
    right: "{Right}",
    up: "{Up}",
    down: "{Down}",
    home: "{Home}",
    end: "{End}",
    pgup: "{PgUp}",
    pgdn: "{PgDn}"
};

const modifierMap: Record<string, string> = {
    control: "^",
    ctrl: "^",
    shift: "+",
    alt: "!",
    meta: "#",
    win: "#",
    cmd: "#",
    command: "#"
};

const normalizeAhkKey = (key: string): string => {
    const normalized = String(key || "").trim();
    if (!normalized) return "";
    return specialKeyMap[normalized.toLowerCase()] || normalized;
};

const formatModifiedKey = (key: string, modifier?: string | string[]): string => {
    const modifiers = Array.isArray(modifier) ? modifier : modifier ? [modifier] : [];
    const prefix = modifiers
        .map((item) => modifierMap[String(item || "").trim().toLowerCase()] || "")
        .join("");
    return `${prefix}${normalizeAhkKey(key)}`;
};

export const ahkDriver: NativeInputDriver = {
    isReady: async () => {
        const service = await getAhkService();
        return service?.isReady?.() === true;
    },
    moveMouse: async (x: number, y: number) => {
        return await (await getAhkService())?.moveMouseBy(x, y);
    },
    mouseClick: async (button?: PointerButton, double?: boolean) => {
        return await (await getAhkService())?.mouseClick(button || "left", Boolean(double));
    },
    mouseToggle: async (state: ToggleState, button?: PointerButton) => {
        return await (await getAhkService())?.mouseToggle(state, button || "left");
    },
    scrollMouse: async (dx: number, dy: number = 0) => {
        return await (await getAhkService())?.scrollMouse(dx, dy);
    },
    keyTap: async (key: string, modifier?: string | string[]) => {
        const formattedKey = formatModifiedKey(key, modifier);
        return await (await getAhkService())?.sendKey(formattedKey);
    },
    keyToggle: async (key: string, state: ToggleState) => {
        const formattedKey = normalizeAhkKey(key);
        return await (await getAhkService())?.sendKey(`${formattedKey} ${state}`);
    },
    typeString: async (text: string) => {
        if (!text) return;
        return await (await getAhkService())?.sendText(text);
    }
};

export default ahkDriver;
