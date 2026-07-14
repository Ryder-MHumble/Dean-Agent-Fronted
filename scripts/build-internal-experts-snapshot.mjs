import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { sanitizeExpertRecords } from "../lib/internal-experts.ts";

export function validateRawExport(raw, expectedCount) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Raw expert export must be an object");
  }

  if (raw.hasMore !== false) {
    throw new Error("Raw expert export hasMore must be false");
  }

  if (!Array.isArray(raw.records)) {
    throw new Error("Raw expert export must contain a records array");
  }

  if (expectedCount !== undefined && raw.records.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} records, received ${raw.records.length}`,
    );
  }
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../lib/generated/two-academies-experts.json");

function parseExpectedCount(args) {
  const flagIndex = args.indexOf("--expected-count");

  if (flagIndex === -1) {
    return undefined;
  }

  const expectedCount = Number(args[flagIndex + 1]);
  if (!Number.isInteger(expectedCount) || expectedCount < 0) {
    throw new Error("--expected-count must be a non-negative integer");
  }

  return expectedCount;
}

async function main() {
  const args = process.argv.slice(2);
  const rawPath = args[0];

  if (!rawPath) {
    throw new Error(
      "Usage: node scripts/build-internal-experts-snapshot.mjs <raw-json-path> [--expected-count <count>]",
    );
  }

  const expectedCount = parseExpectedCount(args);
  const raw = JSON.parse(await readFile(resolve(rawPath), "utf8"));
  validateRawExport(raw, expectedCount);

  const snapshot = {
    syncedAt: new Date().toISOString(),
    items: sanitizeExpertRecords(raw.records),
  };

  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(`Wrote ${snapshot.items.length} experts to ${outputPath}`);
}

const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  await main();
}
