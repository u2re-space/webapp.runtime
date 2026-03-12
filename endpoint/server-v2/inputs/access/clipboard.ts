import { Promised } from "../../utils/Promised.ts";

//
export class ClipboardAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = Promised(Promised(import("../../inputs/drivers/clipboardy.ts"))?.default);
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async read() {
        return await (await this.driver)?.read?.();
    }

    async write(text: string) {
        return await (await this.driver)?.write?.(text);
    }

    async clear() {
        return await (await this.driver)?.clear?.();
    }
}

//
export default new ClipboardAccess();
