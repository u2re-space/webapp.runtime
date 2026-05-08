import type { NativeInputDriver, PointerButton } from "@inputs/drivers/types.ts";

//
export class MouseAccess {
    private driver: Promise<NativeInputDriver>;
    constructor() {
        this.driver = import("@inputs/drivers/ahk.ts").then((module) => module.default);
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async move(x: number, y: number) {
        return await (await this.driver)?.moveMouse?.(x, y);
    }

    async click(button?: PointerButton, double?: boolean) {
        return await (await this.driver)?.mouseClick?.(button, double);
    }

    async scroll(dx: number, dy: number = 0) {
        return await (await this.driver)?.scrollMouse?.(dx, dy);
    }

    async down(button?: PointerButton) {
        return await (await this.driver)?.mouseToggle?.("down", button);
    }

    async up(button?: PointerButton) {
        return await (await this.driver)?.mouseToggle?.("up", button);
    }
}

export default new MouseAccess();