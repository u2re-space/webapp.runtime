import { Promised } from "../../utils/Promised.ts";

// TODO!
export class VoiceAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = null;
    }

    async isReady() {
        return await (await this.driver)?.isReady?.();
    }

    async startRecording() {
        return await (await this.driver)?.startRecording?.();
    }

    async stopRecording() {
        return await (await this.driver)?.stopRecording?.();
    }

    async getResult() {
        return await (await this.driver)?.getResult?.();
    }
}

//
export default new VoiceAccess();
