import { Promised } from "@utils/Promised.ts";

//
export class KeyboardAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = Promised(Promised(import("@inputs/drivers/ahk.ts"))?.default);
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async tap(key: string, modifier?: string | string[]) {
        return await (await this.driver)?.keyTap?.(key, modifier);
    }

    async toggle(key: string, state: string) { 
        return await (await this.driver)?.keyToggle?.(key, state);
    }

    async type(text: string) {
        return await (await this.driver)?.typeString?.(text);
    }
}

export default new KeyboardAccess();
