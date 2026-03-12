import { Promised } from "../../utils/Promised.ts";

// TODO!
export class ContactsAccess {
    private driver: Promise<any>;
    constructor() {
        this.driver = null;
    }
}

//
export default new ContactsAccess();
