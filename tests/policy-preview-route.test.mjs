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
  assert.match(source, /getPolicyPreviewSelectedId/);
  assert.match(source, /loadingRequestKeyRef/);
  assert.match(source, /lastSortRef/);
  assert.match(source, /PolicyPreviewHero/);
  assert.match(source, /PolicyPreviewList/);
});

test("hero metrics use independent requests and preserve unknown states", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const hero = readFileSync("components/policy-intel-preview/policy-preview-hero.tsx", "utf8");
  assert.match(source, /isLoading: isPolicyTotalLoading/);
  assert.match(source, /isUsingMock: isPolicyTotalMock/);
  assert.match(source, /category: "政策机会"/);
  assert.match(source, /isLoading: isOpportunityTotalLoading/);
  assert.match(source, /isUsingMock: isOpportunityTotalMock/);
  assert.match(source, /fetchPolicySourceNameMap/);
  assert.match(source, /useState<number \| null>\(null\)/);
  assert.match(source, /sourceEntries\.length > 0 \? sourceEntries\.length : null/);
  assert.match(source, /total=\{policyTotal\}/);
  assert.match(source, /opportunityCount=\{opportunityTotal\}/);
  assert.match(hero, /total: number \| null/);
  assert.match(hero, /value === null \? "--"/);
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
  assert.match(source, /if \(isLoading\) \{/);
  assert.match(source, /detailRef/);
  assert.match(source, /lastSelectedButtonRef/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /tabIndex=\{-1\}/);
});

test("preview supports date range and policy source filtering", () => {
  const preview = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const list = readFileSync("components/policy-intel-preview/policy-preview-list.tsx", "utf8");
  assert.match(preview, /dateRange: \{ from: dateFrom, to: dateTo \}/);
  assert.match(preview, /sourceIds: selectedSourceId \? \[selectedSourceId\] : undefined/);
  assert.match(list, /type="date"/);
  assert.match(list, /aria-label="政策信源"/);
  assert.match(list, /全部政策信源/);
  assert.doesNotMatch(list, /全量信源/);
  assert.match(list, /清除筛选/);
});

test("hero copy and workbench height follow the reviewed viewport contract", () => {
  const hero = readFileSync("components/policy-intel-preview/policy-preview-hero.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.match(hero, /洞悉政策风向/);
  assert.match(hero, /把握未来机遇/);
  assert.match(hero, /政策信源/);
  assert.match(hero, /国家\/北京/);
  assert.doesNotMatch(hero, /全量信源/);
  assert.doesNotMatch(css, /min-height:\s*620px/);
  assert.match(css, /height:\s*clamp\(/);
});

test("policy detail exposes all reference modules without collapsibles", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  for (const heading of ["AI 摘要", "政策要点", "政策解读", "政策原文", "政策信息", "影响范围", "相关附件"]) {
    assert.match(source, new RegExp(heading));
  }
  assert.doesNotMatch(source, /Accordion|Collapsible|defaultOpen/);
});

test("policy detail keeps impact scope empty and normalizes optional information", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /当前政策暂无结构化影响范围数据/);
  assert.match(source, /const funding = item\.funding\?\.trim\(\) \|\| null/);
  assert.match(source, /资金范围/);
  assert.match(source, /\{funding \?\? "--"\}/);
  assert.doesNotMatch(source, /hasImpactData|impactTrack|明确资金范围/);
});

test("policy detail exposes an external link only through the URL normalizer", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /normalizeExternalPolicyUrl/);
  assert.match(source, /const sourceUrl = normalizeExternalPolicyUrl\(item\.sourceUrl\)/);
  assert.match(source, /href=\{sourceUrl\}/);
  assert.doesNotMatch(source, /href=\{item\.sourceUrl\}/);
});
