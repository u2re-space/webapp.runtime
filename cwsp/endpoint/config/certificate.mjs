import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upstream = path.resolve(__dirname, "../https/certificate.mjs");
const mod = await import(pathToFileURL(upstream).href);

export const key = mod.key ?? mod.default?.key;
export const cert = mod.cert ?? mod.default?.cert;
export const ca = mod.ca ?? mod.default?.ca;

export default { key, cert, ca };
