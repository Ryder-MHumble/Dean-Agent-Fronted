import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("policy preview is a dedicated route and backs the original policy entry", () => {
  const route = readFileSync("app/policy-intel-preview/page.tsx", "utf8");
  const app = readFileSync("app/page.tsx", "utf8");
  assert.match(route, /PolicyIntelPreview/);
  assert.match(app, /components\/policy-intel-preview\/policy-intel-preview/);
});

test("preview defaults to a persistent selected policy workspace", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.match(source, /getPolicyPreviewSelectedId/);
  assert.match(source, /loadingRequestKeyRef/);
  assert.match(source, /lastSortRef/);
  assert.doesNotMatch(source, /PolicyPreviewHero/);
  assert.match(source, /PolicyPreviewList/);
});

test("policy page renders only the core workspace without the old banner", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.doesNotMatch(source, /isLoading: isPolicyTotalLoading/);
  assert.doesNotMatch(source, /isUsingMock: isPolicyTotalMock/);
  assert.doesNotMatch(source, /category: "政策机会"/);
  assert.doesNotMatch(source, /isLoading: isOpportunityTotalLoading/);
  assert.doesNotMatch(source, /isUsingMock: isOpportunityTotalMock/);
  assert.match(source, /fetchPolicySourceNameMap/);
  assert.doesNotMatch(source, /sourceEntries\.length > 0 \? sourceEntries\.length : null/);
  assert.match(source, /<IntelligencePageShell/);
  assert.match(source, /<IntelligenceWorkspace/);
  assert.doesNotMatch(css, /\.(?:page|canvas|workbench)\s*\{/);
  assert.doesNotMatch(css, /(?:linear|radial)-gradient|backdrop-filter/);
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

test("policy overlay focus follows the shared workspace breakpoint", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.match(source, /useBreakpoint/);
  assert.match(source, /breakpoint !== "desktop"/);
  assert.doesNotMatch(source, /max-width: 959px/);
});

test("preview supports date range and policy source filtering", () => {
  const preview = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const list = readFileSync("components/policy-intel-preview/policy-preview-list.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.match(preview, /dateRange: \{ from: dateFrom, to: dateTo \}/);
  assert.match(preview, /sourceIds: selectedSourceId \? \[selectedSourceId\] : undefined/);
  assert.match(list, /type="date"/);
  assert.match(list, /aria-label="政策信源"/);
  assert.match(list, /全部政策信源/);
  assert.match(list, /SelectTrigger/);
  assert.match(list, /ALL_SOURCE_VALUE/);
  assert.doesNotMatch(list, /<select/);
  assert.match(css, /previewSelectContent/);
  assert.match(css, /background:\s*#f8faff/);
  assert.match(css, /rgba\(248, 250, 255, 0\.98\)/);
  assert.doesNotMatch(css, /background:\s*rgba\(73, 76, 82, 0\.96\)/);
  assert.doesNotMatch(list, /全量信源/);
  assert.match(list, /清除筛选/);
});

test("preview reflows by available space without whole-page zoom", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.doesNotMatch(source, /ResizeObserver/);
  assert.doesNotMatch(source, /layoutScale/);
  assert.doesNotMatch(source, /--preview-scale|--preview-unscale/);
  assert.doesNotMatch(css, /\bzoom\s*:/);
  assert.doesNotMatch(css, /--preview-unscale/);
  assert.match(css, /container-type:\s*inline-size/);
  assert.match(css, /@container\s*\(max-width:/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("timeline renders one date node for each date group", () => {
  const list = readFileSync("components/policy-intel-preview/policy-preview-list.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.match(list, /startsDateGroup/);
  assert.match(list, /items\[index - 1\]\?\.date !== item\.date/);
  assert.match(list, /timelineGroupStart/);
  assert.match(css, /\.timelineGroupStart \.timelineAxis i/);
  assert.match(css, /display:\s*none;\s*width:\s*8px/s);
});

test("shared shell and workspace own the no-banner viewport contract", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  const css = readFileSync("components/policy-intel-preview/policy-intel-preview.module.css", "utf8");
  assert.doesNotMatch(css, /calc\(100dvh - 286px\)/);
  assert.doesNotMatch(css, /calc\(100dvh - 316px\)/);
  assert.doesNotMatch(css, /min-height:\s*620px/);
  assert.match(source, /<IntelligencePageShell/);
  assert.match(source, /<IntelligenceWorkspace/);
  assert.doesNotMatch(css, /\.(?:page|canvas|workbench|listPane|detailPane)\s*\{/);
});

test("every animated application page keeps a full dynamic viewport height", () => {
  const page = readFileSync("app/page.tsx", "utf8");
  const motion = readFileSync("components/motion/index.tsx", "utf8");
  assert.match(page, /min-h-\[100dvh\]/);
  assert.match(page, /--app-content-height/);
  assert.match(motion, /min-h-\[calc\(100dvh-5rem\)\]/);
  assert.match(motion, /md:min-h-\[100dvh\]/);
});

test("policy detail exposes all reference modules without collapsibles", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  for (const heading of ["AI 摘要", "政策要点", "政策解读", "政策原文", "政策信息", "影响范围", "相关附件"]) {
    assert.match(source, new RegExp(heading));
  }
  assert.doesNotMatch(source, /Accordion|Collapsible|defaultOpen/);
});

test("policy detail uses strict section mapping and keeps every section mounted", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /getPolicyPreviewDetailSections/);
  assert.match(source, /const detailSections = getPolicyPreviewDetailSections\(item\)/);
  assert.match(source, /detailSections\.aiSummary \|\| "暂无政策摘要"/);
  assert.match(source, /detailSections\.interpretation \|\| "暂无政策解读"/);
  assert.match(source, /detailSections\.originalContent \|\| "暂无可展示的政策正文"/);
  assert.match(source, /暂无政策标签/);
  assert.doesNotMatch(source, /item\.content \|\| item\.detail/);
});

test("policy detail shows only real impact fields", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /政策匹配度/);
  assert.match(source, /内容相关度/);
  assert.match(source, /重要程度/);
  assert.match(source, /item\.matchScore != null/);
  assert.match(source, /item\.relevance != null/);
  assert.match(source, /role="progressbar"/);
  assert.doesNotMatch(source, /当前政策暂无结构化影响范围数据/);
  assert.doesNotMatch(source, /impactAudience|categoryImpact|受众比例/);
});

test("policy detail normalizes optional information", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /const funding = item\.funding\?\.trim\(\) \|\| null/);
  assert.match(source, /资金范围/);
  assert.match(source, /\{funding \?\? "--"\}/);
  assert.doesNotMatch(source, /明确资金范围/);
});

test("filter callbacks reset pagination before updating filter state", () => {
  const source = readFileSync("components/policy-intel-preview/policy-intel-preview.tsx", "utf8");
  assert.doesNotMatch(
    source,
    /useEffect\(\(\) => \{\s*setPage\(1\);\s*\}, \[searchQuery, category, selectedSourceId, dateFrom, dateTo\]\)/,
  );
  for (const [handler, setter] of [
    ["changeSearchQuery", "setSearchQuery"],
    ["changeCategory", "setCategory"],
    ["changeSource", "setSelectedSourceId"],
    ["changeDateFrom", "setDateFrom"],
    ["changeDateTo", "setDateTo"],
  ]) {
    assert.match(
      source,
      new RegExp(`function ${handler}\\([^)]*\\) \\{\\s*setPage\\(1\\);\\s*${setter}\\(value\\);`),
    );
  }
  assert.match(source, /onPageChange=\{setPage\}/);
});

test("policy detail exposes an external link only through the URL normalizer", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  assert.match(source, /normalizeExternalPolicyUrl/);
  assert.match(source, /const sourceUrl = normalizeExternalPolicyUrl\(item\.sourceUrl\)/);
  assert.match(source, /href=\{sourceUrl\}/);
  assert.doesNotMatch(source, /href=\{item\.sourceUrl\}/);
});
