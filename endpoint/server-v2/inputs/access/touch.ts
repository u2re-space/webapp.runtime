import { Promised } from "@utils/Promised.ts";

// сомнительно что AHK это умеет
// у robot такого нету
export class TouchAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = Promised(Promised(import("@inputs/drivers/robot.ts"))?.default);
    }

    async isReady() {
        return await (await this.driver)?.getMousePos?.();
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

    async tap(button?: string) {
        return await (await this.driver)?.tap?.(button);
    }

    async doubleTap(button?: string) {
        return await (await this.driver)?.doubleTap?.(button);
    }

    async longPress(button?: string) {
        return await (await this.driver)?.longPress?.(button);
    }
}

//
export default new TouchAccess();