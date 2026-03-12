import { Promised } from "@utils/Promised.ts";

export let robotService: any = null;
export let robotInitialized = false;

export const getRobotService = () => {
    if (robotInitialized) return;
    robotService = Promised(import("./adapters/robot-adapter.ts").then((m) => m.loadRobot()));
    robotInitialized = true;
    return robotService;
}

export const robotDriver = {
    getMousePos: () => getRobotService()?.getMousePos(),
    moveMouse: (x: number, y: number) => getRobotService()?.moveMouse(x, y),
    mouseClick: (button?: string, double?: boolean) => getRobotService()?.mouseClick(button, double),
    mouseToggle: (state: string, button?: string) => getRobotService()?.mouseToggle(state, button),
    scrollMouse: (dx: number, dy: number) => getRobotService()?.scrollMouse(dx, dy),
    keyTap: (key: string, modifier?: string | string[]) => getRobotService()?.keyTap(key, modifier),
    keyToggle: (key: string, state: string) => getRobotService()?.keyToggle(key, state),
    typeString: (text: string) => getRobotService()?.typeString(text),
} as const;

export default robotDriver;
