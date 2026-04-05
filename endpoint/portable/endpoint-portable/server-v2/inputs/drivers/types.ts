export type PointerButton = "left" | "right" | "middle";
export type ToggleState = "down" | "up";

export interface NativeInputDriver {
    isReady(): boolean | Promise<boolean>;
    moveMouse(x: number, y: number): unknown | Promise<unknown>;
    mouseClick(button?: PointerButton, double?: boolean): unknown | Promise<unknown>;
    mouseToggle(state: ToggleState, button?: PointerButton): unknown | Promise<unknown>;
    scrollMouse(dx: number, dy?: number): unknown | Promise<unknown>;
    keyTap(key: string, modifier?: string | string[]): unknown | Promise<unknown>;
    keyToggle(key: string, state: ToggleState): unknown | Promise<unknown>;
    typeString(text: string): unknown | Promise<unknown>;
}
