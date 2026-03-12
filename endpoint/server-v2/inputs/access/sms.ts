import { Promised } from "../../utils/Promised.ts";

// TODO!
export class SMSAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = null;//Promised(Promised(import("../../inputs/drivers/screen.ts"))?.default);
    }
}

//
export default new SMSAccess();
