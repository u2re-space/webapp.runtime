import { Promised } from "@utils/Promised.ts";

export let ahkInitialized = false;
export let ahkService: any = null;

export const getAhkService = () => {
    if (ahkInitialized) return;
    ahkService = Promised(import("./adapters/ahk-service.ts").then((m) => m.ahkService));
    ahkInitialized = true;
    return ahkService;
}

export const ahkDriver = {
    moveMouse: async (x: number, y: number) => {
        return await getAhkService()?.moveMouseBy(x, y);
    },
    clickMouse: async (button: string, double: boolean) => {
        return await getAhkService()?.mouseClick(button, double);
    },
    scrollMouse: async (delta: number) => {
        return await getAhkService()?.scrollMouse(delta);
    },
    downMouse: async (button: string) => {
        return await getAhkService()?.downMouse(button);
    },
    upMouse: async (button: string) => {
        return await getAhkService()?.upMouse(button);
    }
}

export default ahkDriver;
