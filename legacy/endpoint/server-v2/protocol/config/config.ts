import { readServerV2ConfigSnapshot } from "./storage.ts";

const config = readServerV2ConfigSnapshot();

export default config;
export * from "./settings.ts";
export * from "./storage.ts";
