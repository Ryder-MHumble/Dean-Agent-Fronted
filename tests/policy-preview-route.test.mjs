import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("policy preview is a dedicated route and does not replace the original module", () => {
  const route = readFileSync("app/policy-intel-preview/page.tsx", "utf8");
  const original = readFileSync("components/modules/policy-intel/index.tsx", "utf8");
  assert.match(route, /PolicyIntelPreview/);
  assert.match(original, /export default function PolicyIntelModule/);
});

test("preview defaults to a persistent selected policy workspace", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.match(source, /setSelectedId\(sortedItems\[0\]\?\.id/);
  assert.match(source, /PolicyPreviewHero/);
  assert.match(source, /PolicyPreviewList/);
});
