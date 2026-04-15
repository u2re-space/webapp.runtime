/**
 * Minimal legacy clipboard helpers used by HTTP transport (`/clipboard` local-write)
 * and `utils/routes.ts`. Full peer polling lives in Socket.IO coordinator + Airpad.
 */
import { createClipboardAccess } from "./access/clipboard.ts";

let broadcasting = false;
const access = createClipboardAccess();

export function setBroadcasting(value: boolean): void {
    broadcasting = value;
}

export function isClipboardBroadcasting(): boolean {
    return broadcasting;
}

export async function writeClipboard(text: string): Promise<boolean> {
    try {
        await access.write(String(text ?? ""));
        return true;
    } catch {
        return false;
    }
}
