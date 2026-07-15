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
  assert.match(source, /sortedItems\.some\(\(item\) => item\.id === current\)/);
  assert.match(source, /PolicyPreviewHero/);
  assert.match(source, /PolicyPreviewList/);
});

test("hero metrics use independent unfiltered totals and the full source registry", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.match(source, /total: policyTotal/);
  assert.match(source, /category: "政策机会"/);
  assert.match(source, /total: opportunityTotal/);
  assert.match(source, /fetchPolicySourceNameMap/);
  assert.match(source, /total=\{policyTotal\}/);
  assert.match(source, /opportunityCount=\{opportunityTotal\}/);
});

test("list shows only real relevance progress and disables stale items while loading", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-list.tsx", "utf8");
  assert.doesNotMatch(source, /sparkline|% 30|% 38|% 50|% 35/);
  assert.match(source, /item\.matchScore != null \|\| item\.relevance != null/);
  assert.match(source, /role="progressbar"/);
  assert.match(source, /disabled=\{isLoading\}/);
});

test("selection waits for loading and mobile focus can move to detail and return", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.match(source, /if \(isLoading\) return/);
  assert.match(source, /detailRef/);
  assert.match(source, /lastSelectedButtonRef/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /tabIndex=\{-1\}/);
});

test("preview supports date range and full source filtering", () => {
  const preview = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const list = readFileSync("components/policy-intel-preview/policy-preview-list.tsx", "utf8");
  assert.match(preview, /dateRange: \{ from: dateFrom, to: dateTo \}/);
  assert.match(preview, /sourceIds: selectedSourceId \? \[selectedSourceId\] : undefined/);
  assert.match(list, /type="date"/);
  assert.match(list, /aria-label="政策信源"/);
  assert.match(list, /清除筛选/);
});

test("hero copy and workbench height follow the reviewed viewport contract", () => {
  const hero = readFileSync("components/policy-intel-preview/policy-preview-hero.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.match(hero, /洞悉政策风向/);
  assert.match(hero, /把握未来机遇/);
  assert.doesNotMatch(css, /min-height:\s*620px/);
  assert.match(css, /height:\s*clamp\(/);
});
