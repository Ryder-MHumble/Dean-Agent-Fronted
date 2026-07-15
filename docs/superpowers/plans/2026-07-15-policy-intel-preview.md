# Policy Intelligence Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated `/policy-intel-preview` route that closely reproduces the supplied policy intelligence reference UI while using the existing live policy feed and leaving the original page untouched.

**Architecture:** Add a route-local presentation composed of a data orchestrator, hero, dense list, detail body, and information rail. Reuse `usePolicyFeed` and `PolicyFeedItem`; keep presentation sorting in a small pure helper so it can be tested with Node's existing test runner. Store all precise responsive styling in one CSS module and use a generated raster Banner asset with HTML text layered above it.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, Tailwind CSS 3.4, CSS Modules, Lucide React, Node test runner, Playwright CLI, ZGCI Qwen Image.

## Global Constraints

- Do not modify `components/modules/policy-intel/` or change the behavior of `/`.
- The preview must be removable by deleting only its route, dedicated components, helper, tests, and Banner asset.
- All visible UI text is Chinese.
- All policy detail and information modules are expanded by default.
- Do not invent file numbers, attachments, view counts, audience ratios, or actions without data or behavior.
- Do not use whole-page `transform: scale()`; use grid breakpoints and bounded dimensions.
- Reproduce the reference image's white, blue, and violet visual hierarchy as closely as practical.

---

### Task 1: Policy Preview Presentation Helpers

**Files:**
- Create: `lib/policy-preview.ts`
- Create: `tests/policy-preview.test.mjs`

**Interfaces:**
- Consumes: `PolicyFeedItem` from `lib/types/policy-intel.ts`.
- Produces: `PolicyPreviewSort`, `sortPolicyPreviewItems(items, sort)`, `getPolicyPreviewScore(item)`, and `formatPolicyPreviewTimestamp(value)`.

- [ ] **Step 1: Write the failing helper tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPolicyPreviewTimestamp,
  getPolicyPreviewScore,
  sortPolicyPreviewItems,
} from "../lib/policy-preview.ts";

const items = [
  { id: "old", date: "2026-07-01", importance: "一般", matchScore: 92 },
  { id: "new", date: "2026-07-15", importance: "重要", relevance: 88 },
  { id: "urgent", date: "2026-07-10", importance: "紧急", matchScore: 70 },
];

test("sortPolicyPreviewItems sorts copies without mutating API order", () => {
  assert.deepEqual(sortPolicyPreviewItems(items, "latest").map((item) => item.id), ["new", "urgent", "old"]);
  assert.deepEqual(sortPolicyPreviewItems(items, "relevance").map((item) => item.id), ["old", "new", "urgent"]);
  assert.deepEqual(sortPolicyPreviewItems(items, "impact").map((item) => item.id), ["urgent", "new", "old"]);
  assert.deepEqual(items.map((item) => item.id), ["old", "new", "urgent"]);
});

test("getPolicyPreviewScore falls back from match score to relevance", () => {
  assert.equal(getPolicyPreviewScore(items[0]), 92);
  assert.equal(getPolicyPreviewScore(items[1]), 88);
  assert.equal(getPolicyPreviewScore({ id: "none" }), 0);
});

test("formatPolicyPreviewTimestamp returns Chinese display text or dash", () => {
  assert.match(formatPolicyPreviewTimestamp("2026-07-15T02:06:05.000Z"), /^2026-07-15 /);
  assert.equal(formatPolicyPreviewTimestamp(null), "--");
});
```

- [ ] **Step 2: Run the helper test and verify RED**

Run: `node --test tests/policy-preview.test.mjs`

Expected: FAIL because `lib/policy-preview.ts` does not exist.

- [ ] **Step 3: Implement the pure helper**

```ts
import type { PolicyFeedItem } from "@/lib/types/policy-intel";

export type PolicyPreviewSort = "latest" | "relevance" | "impact";

const IMPACT_WEIGHT: Record<string, number> = {
  紧急: 4,
  重要: 3,
  关注: 2,
  一般: 1,
};

export function getPolicyPreviewScore(item: Partial<PolicyFeedItem>): number {
  return item.matchScore ?? item.relevance ?? 0;
}

export function sortPolicyPreviewItems(
  items: PolicyFeedItem[],
  sort: PolicyPreviewSort,
): PolicyFeedItem[] {
  return [...items].sort((a, b) => {
    if (sort === "relevance") return getPolicyPreviewScore(b) - getPolicyPreviewScore(a);
    if (sort === "impact") return (IMPACT_WEIGHT[b.importance] ?? 0) - (IMPACT_WEIGHT[a.importance] ?? 0);
    return b.date.localeCompare(a.date);
  });
}

export function formatPolicyPreviewTimestamp(value: string | null): string {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replaceAll("/", "-");
}
```

- [ ] **Step 4: Run helper tests and the existing suite**

Run: `node --test tests/policy-preview.test.mjs tests/policy-source-label.test.mjs tests/feed-list-utils.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the helper**

```bash
git add lib/policy-preview.ts tests/policy-preview.test.mjs
git commit -m "test: add policy preview presentation helpers"
```

---

### Task 2: Generate the Preview Banner Asset

**Files:**
- Create: `public/images/policy-intel-preview-banner.png`

**Interfaces:**
- Produces: a wide, text-free image consumed by `PolicyPreviewHero` through `/images/policy-intel-preview-banner.png`.

- [ ] **Step 1: Generate the asset with the ZGCI image script**

Run:

```bash
python3 /Users/rydersun/.codex/skills/zgci-qwen-image/scripts/generate_image.py \
  --prompt "超宽幅政府科技政策情报网页横幅背景，明亮白色空间，画面右侧是一颗半透明蓝紫色玻璃球体，球体中心有简洁白色四角星几何标记，多层细致的蓝紫色椭圆轨道环绕，轨道上有少量蓝色发光节点，轻微青色点缀，柔和高键光照，玻璃与磨砂亚克力材质，精密、克制、可信赖，左侧保留大量纯净留白用于网页标题和数据指标，不要人物，不要机器人，不要文字，不要数字，不要界面截图，不要深色背景，16:5 横幅构图" \
  --size 1536x768 \
  --output public/images/policy-intel-preview-banner.png
```

Expected: script prints the output path and a non-zero PNG byte size.

- [ ] **Step 2: Verify the PNG is readable and wide enough**

Run:

```bash
file public/images/policy-intel-preview-banner.png
sips -g pixelWidth -g pixelHeight public/images/policy-intel-preview-banner.png
```

Expected: PNG image; width and height are both non-zero, with a wide composition suitable for cropping into the hero.

- [ ] **Step 3: Commit the asset**

```bash
git add public/images/policy-intel-preview-banner.png
git commit -m "feat: add policy preview banner artwork"
```

---

### Task 3: Build the Isolated Route, Hero, and Dense List

**Files:**
- Create: `app/policy-intel-preview/page.tsx`
- Create: `components/policy-intel-preview/policy-intel-preview.tsx`
- Create: `components/policy-intel-preview/policy-preview-hero.tsx`
- Create: `components/policy-intel-preview/policy-preview-list.tsx`
- Create: `components/policy-intel-preview/policy-intel-preview.module.css`
- Create: `tests/policy-preview-route.test.mjs`

**Interfaces:**
- Consumes: `usePolicyFeed`, `PolicyFeedItem`, helper exports from Task 1, Banner path from Task 2.
- Produces: `PolicyIntelPreview`, `PolicyPreviewHero`, and `PolicyPreviewList` with selected item callbacks.

- [ ] **Step 1: Write the failing route isolation test**

```js
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
```

- [ ] **Step 2: Run the route test and verify RED**

Run: `node --test tests/policy-preview-route.test.mjs`

Expected: FAIL because the preview route and components do not exist.

- [ ] **Step 3: Create the route and state orchestrator**

The route must export metadata and render only the isolated preview component:

```tsx
import type { Metadata } from "next";
import PolicyIntelPreview from "@/components/policy-intel-preview/policy-intel-preview";

export const metadata: Metadata = {
  title: "政策情报预览",
  description: "政策情报高密度工作台预览",
};

export default function PolicyIntelPreviewPage() {
  return <PolicyIntelPreview />;
}
```

`PolicyIntelPreview` must own search, category, sort, page, selected id, and mobile-detail state; call `usePolicyFeed({ keyword, category, page, pageSize: 20 })`; derive `sortedItems`; and update selection with:

```tsx
useEffect(() => {
  setSelectedId(sortedItems[0]?.id ?? null);
}, [page, searchQuery, category, sort, sortedItems[0]?.id]);
```

Render `PolicyPreviewHero`, then a workbench grid containing `PolicyPreviewList` and a temporary semantic detail placeholder to be replaced in Task 4.

- [ ] **Step 4: Implement the hero and dense list**

`PolicyPreviewHero` props:

```ts
interface PolicyPreviewHeroProps {
  total: number;
  opportunityCount: number;
  sourceCount: number;
  generatedAt: string | null;
}
```

It must render the two-line title, subtitle, four metrics, and the generated image using `next/image` with `fill`, `priority`, `object-fit: cover`, and descriptive Chinese alt text.

`PolicyPreviewList` props:

```ts
interface PolicyPreviewListProps {
  items: PolicyFeedItem[];
  selectedId: string | null;
  sort: PolicyPreviewSort;
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  onSelect: (item: PolicyFeedItem) => void;
  onSortChange: (sort: PolicyPreviewSort) => void;
  onPageChange: (page: number) => void;
  onSearch: (value: string) => void;
}
```

Render three sort tabs, a compact search/filter row, dense items with source/date/category/score, a small CSS sparkline, and fixed pagination. All buttons require `type="button"`, visible focus styles, hover states, and `aria-current` for the selected policy.

- [ ] **Step 5: Implement the first responsive CSS pass**

Define scoped variables and stable grid tracks in the CSS module:

```css
.page { min-height: 100dvh; background: #f5f7fb; color: #12213d; }
.canvas { width: min(100%, 1800px); min-height: 100dvh; margin: 0 auto; padding: 18px; }
.hero { position: relative; min-height: 300px; overflow: hidden; border-radius: 28px 28px 0 0; background: #fff; }
.workbench { display: grid; grid-template-columns: minmax(380px, 40%) minmax(0, 1fr); min-height: 620px; }
@media (max-width: 1023px) { .workbench { grid-template-columns: minmax(320px, 42%) minmax(0, 1fr); } }
@media (max-width: 767px) { .canvas { padding: 0; } .hero { border-radius: 0; } .workbench { display: block; } }
```

Complete the module with reference-matching white surfaces, blue-violet active borders, 12px card radii, tabular numbers, compact typography, and independent list scrolling.

- [ ] **Step 6: Run tests and production build**

Run:

```bash
node --test tests/policy-preview.test.mjs tests/policy-preview-route.test.mjs
npm run build
```

Expected: tests PASS; Next build completes and includes `/policy-intel-preview`.

- [ ] **Step 7: Commit the route, hero, and list**

```bash
git add app/policy-intel-preview components/policy-intel-preview tests/policy-preview-route.test.mjs
git commit -m "feat: add isolated policy intelligence preview"
```

---

### Task 4: Add the Always-Expanded Policy Detail and Information Rail

**Files:**
- Create: `components/policy-intel-preview/policy-preview-detail.tsx`
- Modify: `components/policy-intel-preview/policy-intel-preview.tsx`
- Modify: `components/policy-intel-preview/policy-intel-preview.module.css`
- Modify: `tests/policy-preview-route.test.mjs`

**Interfaces:**
- Consumes: selected `PolicyFeedItem | null` from the orchestrator.
- Produces: `PolicyPreviewDetail({ item, onBack })` with expanded body and information rail.

- [ ] **Step 1: Extend the route test for expanded modules**

```js
test("policy detail exposes all reference modules without collapsibles", () => {
  const source = readFileSync("components/policy-intel-preview/policy-preview-detail.tsx", "utf8");
  for (const heading of ["AI 摘要", "政策要点", "政策解读", "政策原文", "政策信息", "影响范围", "相关附件"]) {
    assert.match(source, new RegExp(heading));
  }
  assert.doesNotMatch(source, /Accordion|Collapsible|defaultOpen/);
});
```

- [ ] **Step 2: Run the detail test and verify RED**

Run: `node --test tests/policy-preview-route.test.mjs`

Expected: FAIL because `policy-preview-detail.tsx` does not exist.

- [ ] **Step 3: Implement the detail component**

The component must render:

```tsx
interface PolicyPreviewDetailProps {
  item: PolicyFeedItem | null;
  onBack: () => void;
}
```

- Header with mobile back icon, title, source, date, category tags, score, and a real external-source link only when `sourceUrl` exists.
- Main document sections in this exact order: `AI 摘要`, `政策要点`, `政策解读`, `政策原文`, tags.
- Information rail sections in this exact order: `政策信息`, `影响范围`, `相关附件`.
- Empty attachment copy: `当前政策未提供可下载附件`.
- Empty selected item copy: `暂无可展示的政策详情`.

Do not render fabricated action buttons or inferred metadata.

- [ ] **Step 4: Integrate persistent desktop detail and mobile navigation**

Replace the Task 3 detail placeholder with:

```tsx
<PolicyPreviewDetail
  item={selectedItem}
  onBack={() => setMobileDetailOpen(false)}
/>
```

On list selection, update the selected id and set mobile detail open. Desktop keeps both panes mounted; mobile toggles visibility with CSS classes and an explicit back control.

- [ ] **Step 5: Finish reference-matching detail and responsive CSS**

Use these stable desktop tracks:

```css
.detail { display: grid; grid-template-columns: minmax(0, 1fr) 260px; min-width: 0; }
.detailBody, .infoRail { min-height: 0; overflow-y: auto; }
@media (max-width: 1439px) { .detail { display: block; overflow-y: auto; } .detailBody, .infoRail { overflow: visible; } }
@media (max-width: 767px) { .listPaneHidden { display: none; } .detailPaneHidden { display: none; } }
```

Match the reference with compact 12-14px metadata, 18-22px detail title, violet chips, blue section headings, thin progress bars, and no content-hiding entrance animation.

- [ ] **Step 6: Run tests and build**

Run:

```bash
node --test tests/policy-preview.test.mjs tests/policy-preview-route.test.mjs
npm run build
```

Expected: all tests PASS; build completes.

- [ ] **Step 7: Commit the detail workspace**

```bash
git add components/policy-intel-preview tests/policy-preview-route.test.mjs
git commit -m "feat: complete policy preview detail workspace"
```

---

### Task 5: Browser Verification and Visual Refinement

**Files:**
- Modify only as required by observed defects: `components/policy-intel-preview/*.tsx`, `components/policy-intel-preview/policy-intel-preview.module.css`
- Create screenshots outside the repository under `/tmp/policy-preview-*.png`.

**Interfaces:**
- Consumes: complete `/policy-intel-preview` route.
- Produces: verified desktop/tablet/mobile UI with no overlap or overflow.

- [ ] **Step 1: Start the development server on an available port**

Run: `npm run dev`

Expected: Next reports a local URL. If port 8000 is occupied by the existing process, reuse it after confirming the preview route returns HTTP 200.

- [ ] **Step 2: Capture reference viewport screenshots**

Use Playwright to open `/policy-intel-preview`, wait for policy data, and capture:

- `/tmp/policy-preview-1920.png` at `1920x1080`
- `/tmp/policy-preview-1440.png` at `1440x900`
- `/tmp/policy-preview-1024.png` at `1024x768`
- `/tmp/policy-preview-390.png` at `390x844`

Expected: the desktop captures show hero, list, detail, and information rail in the first viewport; mobile shows a readable list and a working detail transition.

- [ ] **Step 3: Check layout invariants in the browser**

Evaluate at each viewport:

```js
({
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  bodyHeight: document.body.getBoundingClientRect().height,
  visibleText: document.body.innerText.includes("洞悉政策风向"),
})
```

Expected: `horizontalOverflow` is `false`, `visibleText` is `true`, and no controls overlap on visual inspection.

- [ ] **Step 4: Apply only screenshot-driven CSS fixes**

Adjust grid tracks, hero crop position, spacing, text clamping, and mobile visibility only where the captured evidence shows a mismatch. Do not change existing application files or add new product behavior.

- [ ] **Step 5: Run complete verification**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests PASS (baseline was 98 before preview tests), production build succeeds, and `git diff --check` prints no errors.

- [ ] **Step 6: Commit visual refinements**

```bash
git add app/policy-intel-preview components/policy-intel-preview lib/policy-preview.ts tests/policy-preview*.test.mjs public/images/policy-intel-preview-banner.png
git commit -m "fix: refine policy preview across viewports"
```
