import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { sanitizeExpertRecords } from "../lib/internal-experts.ts";

const rawPath = process.argv[2];

if (!rawPath) {
  throw new Error("Usage: node scripts/build-internal-experts-snapshot.mjs <raw-json-path>");
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../lib/generated/two-academies-experts.json");
const raw = JSON.parse(await readFile(resolve(rawPath), "utf8"));

if (!Array.isArray(raw.records)) {
  throw new Error("Raw expert export must contain a records array");
}

const snapshot = {
  syncedAt: new Date().toISOString(),
  items: sanitizeExpertRecords(raw.records),
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`Wrote ${snapshot.items.length} experts to ${outputPath}`);
