# Unified Intelligence Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the eight intelligence business pages around one compact Chinese master-detail UI system while preserving every page's existing data flow and business interactions.

**Architecture:** Add a small set of shared page-shell, toolbar, workspace, list-item, and detail-section primitives on top of the existing Tailwind and `MasterDetailView` stack. Migrate page groups incrementally, keeping page-specific data rendering local and using structural Node tests plus browser screenshots to prevent visual drift.

**Tech Stack:** Next.js 16.1.6, React 19.2.3, TypeScript 5.7.3, Tailwind CSS 3.4.17, shadcn/ui, Node test runner, Playwright browser verification.

## Global Constraints

- Scope includes policy intelligence, social intelligence, papers, external leaders, university ecosystem, two-academy sentiment, academic achievements, and internal experts.
- Do not modify the intelligence overview page.
- Do not change backend APIs, data models, pagination protocols, filters, or business operations.
- Use a solid `#f7f8fa` page background and white content surfaces; no gradients, glass effects, decorative glows, landing-page copy, or entrance animations on business pages.
- Use Chinese UI text except for proper names supplied by source data.
- Business page titles must be 24-28px; detail titles must not exceed 24px.
- Desktop selected layouts use an approximately 44% list pane and 56% detail pane; mobile details open full-screen with a back control.
- Shared surfaces use 12px outer radii, 8px control radii, `#e5e9f0` borders, and `0 1px 3px rgba(0, 0, 0, 0.08)` shadows.
- Keep edits surgical and retain page-specific rendering where only one page needs it.

## File Structure

- Create `components/shared/intelligence-page-shell.tsx`: business-page viewport, background, and outer spacing.
- Create `components/shared/intelligence-toolbar.tsx`: title, result count, freshness, actions, filters, and factual supplemental content.
- Create `components/shared/intelligence-workspace.tsx`: standard card surface around `MasterDetailView` with the 44/56 split.
- Create `components/shared/intelligence-list-item.tsx`: shared selected, hover, keyboard-focus, and disabled states.
- Create `components/shared/intelligence-detail.tsx`: shared detail header content and section layout.
- Modify `components/shared/master-detail-view.tsx`: add an opt-in `variant="intelligence"` for consistent surfaces and no glass styling, plus compatible close/focus labels; preserve the default appearance for range-external consumers.
- Modify `components/shared/feed-pagination.tsx`: shared pagination summary and the existing estimated-total contract.
- Modify each covered module only where needed to consume the shared primitives.
- Modify `app/page.tsx`: keep all eight business pages outside the entrance-animation wrapper while leaving the overview page unchanged.
- Add `tests/intelligence-ui-contract.test.mjs`: structural coverage for the shared system and all eight page migrations.
- Update existing page-specific tests only where old independent-layout assertions conflict with the approved design.

---

### Task 1: Shared Intelligence UI Foundation

**Files:**
- Create: `components/shared/intelligence-page-shell.tsx`
- Create: `components/shared/intelligence-toolbar.tsx`
- Create: `components/shared/intelligence-workspace.tsx`
- Create: `components/shared/intelligence-list-item.tsx`
- Create: `components/shared/intelligence-detail.tsx`
- Modify: `components/shared/master-detail-view.tsx`
- Modify: `components/shared/feed-pagination.tsx`
- Create: `tests/intelligence-ui-contract.test.mjs`

**Interfaces:**
- Produces: `IntelligencePageShell({ children, className })`.
- Produces: `IntelligenceToolbar({ title, total, updatedAt, actions, children, supplemental, className })`.
- Produces: `IntelligenceWorkspace`, accepting the existing `MasterDetailView` props and defaulting `listWidth` to `44`.
- Produces: `IntelligenceListItem`, a `forwardRef<HTMLButtonElement>` button with `selected`, `disabled`, `onClick`, and `className`.
- Produces: `IntelligenceDetailHeader({ badges, title, meta })` and `IntelligenceSection({ title, children, className })`.
- Preserves: all existing `MasterDetailView` consumers and `FeedPagination` call signatures.

- [ ] **Step 1: Write the failing shared-contract test**

Add `tests/intelligence-ui-contract.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("shared intelligence UI exposes the approved page primitives", () => {
  const shell = read("../components/shared/intelligence-page-shell.tsx");
  const toolbar = read("../components/shared/intelligence-toolbar.tsx");
  const workspace = read("../components/shared/intelligence-workspace.tsx");
  const item = read("../components/shared/intelligence-list-item.tsx");
  const detail = read("../components/shared/intelligence-detail.tsx");

  assert.match(shell, /bg-\[#f7f8fa\]/);
  assert.match(shell, /--app-content-height/);
  assert.match(toolbar, /text-\[28px\]|text-2xl/);
  assert.match(toolbar, /共.*条/);
  assert.match(workspace, /listWidth=\{44\}|listWidth \?\? 44/);
  assert.match(item, /focus-visible:ring-2/);
  assert.match(item, /bg-\[#f1f4ff\]/);
  assert.match(detail, /text-\[#1a3a5c\]/);
});

test("shared pagination renders exact and estimated totals", () => {
  const pagination = read("../components/shared/feed-pagination.tsx");
  assert.match(pagination, /totalIsEstimate/);
  assert.match(pagination, /至少/);
  assert.match(pagination, /共/);
});
```

- [ ] **Step 2: Run the shared-contract test to verify RED**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/tech-frontier-feed.test.mjs`

Expected: FAIL because the five shared files do not exist and the pagination source does not render `至少`.

- [ ] **Step 3: Implement the shared page shell and toolbar**

Create `components/shared/intelligence-page-shell.tsx` with this public shape:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function IntelligencePageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[var(--app-content-height,100dvh)] min-h-0 flex-col gap-3 overflow-y-auto bg-[#f7f8fa] p-3 sm:p-4 md:overflow-hidden lg:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

Create `components/shared/intelligence-toolbar.tsx` with `title: string`, optional `total`, `updatedAt`, `actions`, `children`, and `supplemental` slots. Render one white 12px-radius `<section>` with a 24-28px Chinese title, `共 {total.toLocaleString("zh-CN")} 条`, the existing `DataFreshness` component when `updatedAt` is present, and compact filter rows without empty placeholders.

- [ ] **Step 4: Implement the shared workspace, list item, and detail primitives**

Create `components/shared/intelligence-workspace.tsx` as a typed wrapper around `MasterDetailView`:

```tsx
import type { ComponentProps } from "react";
import MasterDetailView from "@/components/shared/master-detail-view";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof MasterDetailView>;

export default function IntelligenceWorkspace({
  className,
  listWidth,
  ...props
}: Props) {
  return (
    <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#e5e9f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <MasterDetailView
        {...props}
        listWidth={listWidth ?? 44}
        className={cn("h-full", className)}
      />
    </section>
  );
}
```

Implement `IntelligenceListItem` with a forwarded ref, `aria-current`, Enter/Space-native button behavior, no translate animation, `rounded-lg border`, `hover:border-[#cbd5e1] hover:bg-[#f8fafc]`, selected `border-[#6f83ff] bg-[#f1f4ff]`, and `focus-visible:ring-2 focus-visible:ring-[#3156d8]`.

Implement `IntelligenceDetailHeader` with badges, a maximum `text-2xl` title, and muted metadata; implement `IntelligenceSection` as an unframed section with a `text-[#1a3a5c]` 18-20px heading, optional top border, and readable body spacing.

- [ ] **Step 5: Normalize master-detail and pagination behavior**

In `components/shared/master-detail-view.tsx`:

- Replace `bg-background/95 backdrop-blur-sm` with solid white.
- Use `border-[#e5e9f0]`, white surfaces, 8px control radii, and `aria-label="关闭详情"` / `aria-label="返回列表"`.
- Keep current desktop/tablet/mobile behavior and animation timing; do not change data or selection APIs.

In `components/shared/feed-pagination.tsx`, consume the already-declared `total`, `pageSize`, and `totalIsEstimate` props and render:

```tsx
<span className="text-xs text-[#667085]">
  {totalIsEstimate ? `至少 ${total.toLocaleString("zh-CN")} 条` : `共 ${total.toLocaleString("zh-CN")} 条`}
</span>
```

Keep the current previous/next controls and page count stable.

- [ ] **Step 6: Run shared tests to verify GREEN**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/tech-frontier-feed.test.mjs tests/intelligence-pages.test.mjs`

Expected: PASS, including the previously failing estimated-total test.

- [ ] **Step 7: Commit the shared foundation**

```bash
git add components/shared tests/intelligence-ui-contract.test.mjs
git commit -m "feat: add unified intelligence page primitives"
```

---

### Task 2: Policy and Social Intelligence Migration

**Files:**
- Modify: `components/policy-intel-preview/policy-intel-preview.tsx`
- Modify: `components/policy-intel-preview/policy-preview-list.tsx`
- Modify: `components/policy-intel-preview/policy-preview-detail.tsx`
- Modify: `components/policy-intel-preview/policy-intel-preview.module.css`
- Modify: `components/modules/tech-frontier/tech-frontier-page.tsx`
- Modify: `tests/policy-preview-route.test.mjs`
- Modify: `tests/intelligence-ui-contract.test.mjs`

**Interfaces:**
- Consumes: all shared primitives from Task 1.
- Preserves: policy focus restoration, date grouping, sorting, source/category/date filters, policy detail sections, supported social platform/date filters, social feed grouping, engagement metrics, source links, and pagination.

- [ ] **Step 1: Add failing migration assertions**

Extend `tests/intelligence-ui-contract.test.mjs`:

```js
test("policy and social intelligence use the unified shell", () => {
  const policy = read("../components/policy-intel-preview/policy-intel-preview.tsx");
  const policyList = read("../components/policy-intel-preview/policy-preview-list.tsx");
  const policyDetail = read("../components/policy-intel-preview/policy-preview-detail.tsx");
  const social = read("../components/modules/tech-frontier/tech-frontier-page.tsx");

  for (const source of [policy, social]) {
    assert.match(source, /<IntelligencePageShell/);
    assert.match(source, /<IntelligenceWorkspace/);
  }
  assert.match(policyList, /<IntelligenceToolbar/);
  assert.match(policyList, /<IntelligenceListItem/);
  assert.match(policyDetail, /<IntelligenceDetailHeader/);
  assert.match(policyDetail, /<IntelligenceSection/);
  assert.match(social, /<IntelligenceToolbar/);
  assert.doesNotMatch(social, /hover:-translate-y/);
});
```

- [ ] **Step 2: Run migration tests to verify RED**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/policy-preview-route.test.mjs tests/tech-frontier-feed.test.mjs`

Expected: FAIL on missing shared component usage.

- [ ] **Step 3: Migrate policy intelligence**

- Wrap `PolicyIntelPreview` in `IntelligencePageShell` and `IntelligenceWorkspace` while preserving `detailRef`, `lastSelectedButtonRef`, selection reset, loading guards, and mobile focus restoration.
- Replace the list heading/filter shell in `PolicyPreviewList` with `IntelligenceToolbar title="政策动态" total={total}` and keep the three sort buttons, search, category, source, date, and clear actions.
- Replace each policy button's surface classes with `IntelligenceListItem`; retain date-axis markup in the CSS Module.
- Render `PolicyPreviewDetail` through `IntelligenceDetailHeader` and `IntelligenceSection`, keeping every current section and the normalized original URL.
- Reduce `policy-intel-preview.module.css` to policy-specific timeline, grid, progress, and responsive rules. Remove duplicated page background, workbench surface, toolbar surface, detail typography, gradients, glass effects, and shadows now owned by shared components.

- [ ] **Step 4: Migrate social intelligence**

- Wrap the module with `IntelligencePageShell` and replace its filter container with `IntelligenceToolbar title="社媒情报" total={feedSummary.total}`.
- Use `IntelligenceWorkspace` for the existing detail flow and keep `listWidth` at the shared default.
- Change X, WeChat, and YouTube list surfaces to the shared selected/hover/focus rules without forcing their internal media layout to match.
- Keep date grouping, supported platform logos, content-type badges, engagement numbers, delayed detail fetching, source links, and estimated pagination unchanged.
- Remove the stale YouTube UI branch because the current `TechFrontierPlatformFilter` and post types support only `all | x | wechat_mp`; do not extend the data contract during a UI-unification task.
- Replace missing `/logos/x.svg` and `/logos/wechat.svg` references with assets that already exist in `public/` or with the existing text/icon fallback.
- Remove list-card upward translation and decorative gradients; retain media-image overlays required for video legibility.

- [ ] **Step 5: Run policy/social regression tests**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/policy-preview-route.test.mjs tests/tech-frontier-feed.test.mjs tests/tech-frontier-page-performance.test.mjs`

Expected: PASS.

Run: `npx tsc --noEmit --incremental false`

Expected: PASS with the stale YouTube type errors removed.

- [ ] **Step 6: Commit policy/social migration**

```bash
git add components/policy-intel-preview components/modules/tech-frontier tests
git commit -m "feat: unify policy and social intelligence pages"
```

---

### Task 3: Papers and Academic Achievements Migration

**Files:**
- Modify: `components/modules/papers/index.tsx`
- Modify: `components/modules/papers/paper-list.tsx`
- Modify: `components/modules/internal-shared/academic-achievements.tsx`
- Modify: `components/modules/internal-shared/academic-achievement-list.tsx`
- Modify: `tests/intelligence-pages.test.mjs`
- Modify: `tests/intelligence-ui-contract.test.mjs`

**Interfaces:**
- Consumes: shared primitives from Task 1.
- Preserves: paper and achievement search, category/source/date filters, author hover cards, scholar links, source labels, details, Skill links, and pagination.

- [ ] **Step 1: Add failing paper-page assertions**

```js
test("paper data pages use the unified shell and detail hierarchy", () => {
  for (const path of [
    "../components/modules/papers/paper-list.tsx",
    "../components/modules/internal-shared/academic-achievement-list.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /<IntelligenceToolbar/);
    assert.match(source, /<IntelligenceWorkspace/);
    assert.match(source, /<IntelligenceListItem/);
    assert.match(source, /<IntelligenceDetailHeader/);
    assert.match(source, /<IntelligenceSection/);
  }
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/paper-feed.test.mjs tests/achievement-feed.test.mjs`

Expected: FAIL on missing shared primitives.

- [ ] **Step 3: Migrate papers**

- Move the outer viewport/background from `components/modules/papers/index.tsx` into `IntelligencePageShell`.
- Replace `paper-list.tsx` filter card with `IntelligenceToolbar title="前沿论文"`, preserving all filters and the unframed Skill link.
- Replace `MasterDetailView`, list card, detail header, and local detail-section wrappers with the shared workspace/list/detail primitives.
- Keep author hover cards, Chinese “预印本” labels, source links, query behavior, and pagination intact.

- [ ] **Step 4: Migrate academic achievements**

- Apply the same shell and toolbar hierarchy in `academic-achievements.tsx` and `academic-achievement-list.tsx`.
- Preserve the dedicated warehouse hook, real author identity links, source labels, Skill link, detail order, and pagination.
- Do not merge paper and achievement data models or create a generic schema renderer.

- [ ] **Step 5: Run paper/achievement regression tests**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/paper-feed.test.mjs tests/achievement-feed.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit paper page migration**

```bash
git add components/modules/papers components/modules/internal-shared tests
git commit -m "feat: unify paper intelligence pages"
```

---

### Task 4: External Leaders and Internal Experts Migration

**Files:**
- Modify: `components/modules/talent-radar/index.tsx`
- Modify: `components/modules/internal-shared/internal-experts.tsx`
- Modify: `tests/intelligence-pages.test.mjs`
- Modify: `tests/intelligence-ui-contract.test.mjs`

**Interfaces:**
- Consumes: shared primitives from Task 1.
- Preserves: leader and expert search/filter/query behavior, avatar fallback, leader verification state, career timeline, source citations, expert research fields, external data links, Skill link, and pagination.

- [ ] **Step 1: Add failing people-page assertions**

```js
test("leader and expert pages use the unified people layout", () => {
  for (const path of [
    "../components/modules/talent-radar/index.tsx",
    "../components/modules/internal-shared/internal-experts.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /<IntelligencePageShell/);
    assert.match(source, /<IntelligenceToolbar/);
    assert.match(source, /<IntelligenceWorkspace/);
    assert.match(source, /<IntelligenceListItem/);
    assert.match(source, /<IntelligenceDetailHeader/);
    assert.match(source, /<IntelligenceSection/);
  }
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/leader-display.test.mjs tests/leader-query.test.mjs tests/internal-experts.test.mjs`

Expected: FAIL on missing shared shell usage.

- [ ] **Step 3: Migrate external leaders**

- Replace the outer page, filter card, workspace card, list item, and detail sections with shared primitives.
- Keep compact avatar/name/organization/role rows; retain line clamping and visible verification metadata.
- Preserve current biography, career timeline, personnel events, citations, detail source links, loading state, and pagination.

- [ ] **Step 4: Migrate internal experts**

- Replace the outer page, toolbar card, workspace card, list item, detail header, and detail sections with shared primitives.
- Preserve the approved public-field boundary, unframed “更多学者数据” and Skill links, research/discipline fields, loading state, and pagination.

- [ ] **Step 5: Run people-page regression tests**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/leader-display.test.mjs tests/leader-query.test.mjs tests/internal-experts.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit people page migration**

```bash
git add components/modules/talent-radar components/modules/internal-shared/internal-experts.tsx tests
git commit -m "feat: unify leader and expert pages"
```

---

### Task 5: University Ecosystem and Sentiment Migration

**Files:**
- Modify: `components/modules/university-eco/index.tsx`
- Modify: `components/modules/university-eco/peer-dynamics.tsx`
- Modify: `components/modules/university-eco/research-tracking.tsx`
- Modify: `components/modules/internal-mgmt/sentiment/index.tsx`
- Modify: `components/modules/internal-mgmt/sentiment/content-card.tsx`
- Modify: `components/modules/internal-mgmt/sentiment/detail-panel.tsx`
- Modify: `components/modules/internal-mgmt/sentiment/sentiment-report.tsx`
- Modify: `tests/intelligence-pages.test.mjs`
- Modify: `tests/intelligence-ui-contract.test.mjs`
- Modify: `tests/university-eco-performance.test.mjs`

**Interfaces:**
- Consumes: shared primitives from Task 1.
- Preserves: university tabs, university feed/research filters, source metadata, details and pagination; sentiment overview data, platform filter, keyword search, sorting, feed details, media, engagement metrics, AI report, popular-content data, and pagination.

- [ ] **Step 1: Add failing university/sentiment assertions**

```js
test("university and sentiment pages use the unified shell", () => {
  const university = read("../components/modules/university-eco/index.tsx");
  const peers = read("../components/modules/university-eco/peer-dynamics.tsx");
  const research = read("../components/modules/university-eco/research-tracking.tsx");
  const sentiment = read("../components/modules/internal-mgmt/sentiment/index.tsx");
  const sentimentDetail = read("../components/modules/internal-mgmt/sentiment/detail-panel.tsx");

  assert.match(university, /<IntelligencePageShell/);
  assert.match(university, /<Tabs/);
  for (const source of [peers, research, sentiment]) {
    assert.match(source, /<IntelligenceToolbar|toolbar=/);
    assert.match(source, /<IntelligenceWorkspace/);
  }
  assert.doesNotMatch(sentiment, /<Sheet|<DetailPanel/);
  assert.match(sentimentDetail, /IntelligenceDetailHeader/);
  assert.match(sentimentDetail, /IntelligenceSection/);
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/university-eco-performance.test.mjs`

Expected: FAIL because university tabs and sentiment still use independent card/sheet layouts.

- [ ] **Step 3: Migrate university ecosystem**

- Replace the `ModuleLayout` usage only in `components/modules/university-eco/index.tsx` with a local controlled `Tabs` layout inside `IntelligencePageShell`; do not change the shared `ModuleLayout`, because non-scope modules still consume it.
- Render the two existing university tabs inside the shared toolbar surface, not a separate animated card.
- Update peer dynamics and research tracking to consume `IntelligenceToolbar` filter slots when active and `IntelligenceWorkspace` for their lists/details.
- Preserve default tab, feed loading strategy, source data, cover behavior, filters, date grouping, detail fields, and pagination.
- Remove entrance animation wrappers and duplicate outer cards from these business pages.

- [ ] **Step 4: Convert sentiment from sheet to shared master-detail**

- Keep `useSentimentOverview`, `useSentimentFeed`, and `useSentimentDetail` unchanged.
- Render the four overview values as one compact supplemental metric row inside `IntelligenceToolbar`, using tabular numbers and muted semantic colors.
- Keep platform filters, keyword search, and sort controls in the toolbar.
- Place the feed in `IntelligenceWorkspace`; use the selected `content_id` to control `isOpen`.
- Refactor `detail-panel.tsx` to export detail content/header data for the workspace instead of rendering a `Sheet`. Preserve author, media, description, engagement values, and original link.
- Preserve `SentimentReport` as a compact factual summary band and render the existing popular-content data as a dense supplemental list without independent floating cards.
- Replace custom pagination with `FeedPagination`.

- [ ] **Step 5: Run university/sentiment regression tests**

Run: `node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/university-eco-performance.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit special-page migration**

```bash
git add components/modules/university-eco components/modules/internal-mgmt/sentiment tests
git commit -m "feat: unify university and sentiment pages"
```

---

### Task 6: Full Regression and Visual Acceptance

**Files:**
- Modify: `app/page.tsx`
- Modify only files already touched by Tasks 1-5 when verification reveals a scoped defect.
- Update: `tests/intelligence-ui-contract.test.mjs` only for missing approved-contract coverage.

**Interfaces:**
- Consumes: completed page migrations.
- Produces: verified desktop, tablet, and mobile behavior with no new dependencies.

- [ ] **Step 1: Run source and type checks**

First extend `tests/intelligence-ui-contract.test.mjs` to assert that the eight business page branches render outside `<MotionPage>` and that only the overview branch remains inside the entrance-animation wrapper. Update `app/page.tsx` accordingly without changing navigation IDs or dynamic imports.

Run:

```bash
git diff --check
npx tsc --noEmit --incremental false
node --test tests/*.test.mjs
```

Expected: all commands PASS; the baseline estimated-total failure is fixed.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: Next.js production build completes without TypeScript, import, or route errors.

- [ ] **Step 3: Start the local server**

Run: `npm run dev`

Expected: server starts on `http://localhost:8000`; if occupied, run `npx next dev --turbo --port 8001` and record the chosen URL.

- [ ] **Step 4: Verify all eight pages at three viewports**

Using the available global Playwright 1.60 Chromium runtime, inspect every navigation entry at `1440x900`, `1024x768`, and `390x844`:

- Policy intelligence
- Social intelligence
- Papers
- External leaders
- University ecosystem, both tabs
- Two-academy sentiment
- Academic achievements
- Internal experts

For each page verify: solid background, shared toolbar, 12px workspace surface, no overlapping text, no horizontal overflow, visible focus states, working filters, selectable list items, working detail close/back, working pagination, and preserved original/source links.

- [ ] **Step 5: Inspect screenshot pixels and visible copy**

Capture screenshots for all pages at desktop and mobile. Confirm that no business-page screenshot contains a gradient/glass page surface, English UI eyebrow, CTA, title over 28px, detail title over 24px, hidden entrance state, or incoherent overlap. Confirm the overview page was not changed by comparing its current layout before and after navigation.

- [ ] **Step 6: Fix only verification defects and rerun affected checks**

For each defect, add or tighten a focused assertion where practical, apply the smallest CSS/JSX change, rerun the affected Node test, then rerun TypeScript and the production build.

- [ ] **Step 7: Commit final verification fixes**

```bash
git add components tests
git commit -m "fix: complete intelligence page visual verification"
```

- [ ] **Step 8: Final status check**

Run:

```bash
git status --short
git log --oneline -7
```

Expected: clean worktree and a reviewable sequence of focused commits.
