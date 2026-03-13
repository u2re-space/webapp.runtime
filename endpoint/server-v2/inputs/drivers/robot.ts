import { Promised } from "@utils/Promised.ts";
import type { NativeInputDriver, PointerButton, ToggleState } from "./types.ts";

export let robotService: any = null;
export let robotInitialized = false;

export const getRobotService = () => {
    if (!robotInitialized || !robotService) {
        robotService = Promised(import("./adapters/robot-adapter.ts").then((m) => m.loadRobot()));
        robotInitialized = true;
    }
    return robotService;
};

export const robotDriver: NativeInputDriver & {
    getMousePos: () => { x: number; y: number } | undefined;
} = {
    isReady: () => Boolean(getRobotService()),
    getMousePos: () => getRobotService()?.getMousePos(),
    moveMouse: (x: number, y: number) => getRobotService()?.moveMouse(x, y),
    mouseClick: (button?: PointerButton, double?: boolean) => getRobotService()?.mouseClick(button, double),
    mouseToggle: (state: ToggleState, button?: PointerButton) => getRobotService()?.mouseToggle(state, button),
    scrollMouse: (dx: number, dy: number) => getRobotService()?.scrollMouse(dx, dy),
    keyTap: (key: string, modifier?: string | string[]) => getRobotService()?.keyTap(key, modifier),
    keyToggle: (key: string, state: ToggleState) => getRobotService()?.keyToggle(key, state),
    typeString: (text: string) => getRobotService()?.typeString(text),
} as const;

export default robotDriver;
