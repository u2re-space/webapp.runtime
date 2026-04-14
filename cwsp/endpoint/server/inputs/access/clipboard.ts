//
export class ClipboardAccess {
    private driver: Promise<any>;
    private app: any;
    constructor() {
        this.driver = import("../drivers/clipboardy.ts").then((module) => module.default);
    }

    attachApp(app: any) {
        this.app = app;
        return this.app;
    }

    async isReady() {
        const driver = await this.driver;
        return typeof driver?.read === "function" && typeof driver?.write === "function";
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
export const createClipboardAccess = () => new ClipboardAccess();

export default createClipboardAccess();
