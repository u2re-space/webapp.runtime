import { Promised } from "@utils/Promised.ts";

//
export class MouseAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = Promised(Promised(import("@inputs/drivers/ahk.ts"))?.default);
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async move(x: number, y: number) {
        return await (await this.driver)?.moveMouse?.(x, y);
    }

    async click(button?: string, double?: boolean) {
        return await (await this.driver)?.mouseClick?.(button, double);
    }

    async scroll(delta: number) {
        return await (await this.driver)?.scrollMouse?.(delta);
    }

    async down(button?: string) {
        return await (await this.driver)?.downMouse?.(button);
    }

    async up(button?: string) {
        return await (await this.driver)?.upMouse?.(button);
    }
}

export default new MouseAccess();