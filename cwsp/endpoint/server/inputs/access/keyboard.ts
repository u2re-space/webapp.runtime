import type { NativeInputDriver, ToggleState } from "@inputs/drivers/types.ts";

//
export class KeyboardAccess {
    private driver: Promise<NativeInputDriver>;
    constructor() {
        this.driver = import("@inputs/drivers/ahk.ts").then((module) => module.default);
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async tap(key: string, modifier?: string | string[]) {
        return await (await this.driver)?.keyTap?.(key, modifier);
    }

    async toggle(key: string, state: ToggleState) { 
        return await (await this.driver)?.keyToggle?.(key, state);
    }

    async type(text: string) {
        return await (await this.driver)?.typeString?.(text);
    }
}

export default new KeyboardAccess();
