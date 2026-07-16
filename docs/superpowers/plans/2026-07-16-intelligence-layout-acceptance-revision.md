# Intelligence Layout Acceptance Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every business-page query header into the left master pane, give the detail pane the full workspace height, auto-open the first non-mobile result, add exact-date university timelines, and compact social/university typography.

**Architecture:** Extend `IntelligenceWorkspace` with a fixed `listHeader` slot and keep `MasterDetailView` unchanged. Add an embedded toolbar surface, a tested default-selection resolver plus Hook, and an opt-in exact-date timeline mode on `DateGroupedList`; migrate each existing page without changing its data flow.

**Tech Stack:** Next.js 16.1.6, React 19.2.3, TypeScript 5.7.3, Tailwind CSS 3.4.17, Node test runner, production Next.js build, Playwright-compatible browser verification.

## Global Constraints

- Do not modify the intelligence overview page.
- Do not change backend APIs, data models, pagination protocols, filters, navigation IDs, or business operations.
- All business-page titles, counts, search, filters, tabs, and factual supplemental metrics belong in the left master pane.
- Desktop uses an approximately 40% master pane and 60% full-height detail pane.
- Tablet auto-opens the first detail in the existing 70% overlay; mobile remains list-first.
- Use a solid `#f7f8fa` background and white surfaces; no gradients, glass effects, hero patterns, explanatory copy, or entrance animations.
- All visible UI text is Chinese except source-data proper names.
- Shared embedded toolbar titles use 24px; detail titles remain at or below 24px.
- Keep `MasterDetailView` focus, Escape, overlay, and non-intelligence behavior unchanged.
- Keep changes surgical and preserve page-specific list/detail rendering.

## File Structure

- Modify `components/shared/intelligence-toolbar.tsx`: add `variant="standalone" | "embedded"`.
- Modify `components/shared/intelligence-workspace.tsx`: add `listHeader`, compose the left column, and default to `listWidth=40`.
- Create `lib/detail-selection.ts`: pure default-selection resolver.
- Create `hooks/use-auto-select-detail.ts`: breakpoint-aware selection synchronization.
- Modify `lib/group-by-date.ts`: add exact calendar-date grouping without changing `groupByDate`.
- Modify `components/shared/date-grouped-list.tsx`: add an opt-in timeline variant.
- Modify the policy preview list and seven remaining business module implementations to embed their existing toolbar.
- Modify the policy preview and all business modules to default the first detail outside mobile.
- Modify social and university list/detail typography only at the identified call sites.
- Extend `tests/intelligence-ui-contract.test.mjs`, `tests/group-by-date.test.mjs`, and add `tests/detail-selection.test.mjs`.

---

### Task 1: Lock the revised shared contracts with failing tests

**Files:**
- Modify: `tests/intelligence-ui-contract.test.mjs`
- Modify: `tests/group-by-date.test.mjs`
- Create: `tests/detail-selection.test.mjs`

**Interfaces:**
- Expects: `IntelligenceWorkspace({ listHeader, listWidth })` with a default width of `40`.
- Expects: `IntelligenceToolbar({ variant })` with an embedded branch.
- Expects: `groupByCalendarDate(items)` returning exact-date groups in descending order.
- Expects: `getDefaultDetailSelection(items, selectedItem, getKey, autoOpen)`.

- [ ] **Step 1: Add the failing shared-layout assertions**

Add assertions equivalent to:

```js
assert.match(workspace, /listHeader\?: ReactNode/);
assert.match(workspace, /listWidth \?\? 40/);
assert.match(workspace, /\{listHeader &&/);
assert.match(toolbar, /variant\?: "standalone" \| "embedded"/);
assert.match(toolbar, /variant === "embedded"/);
```

For each active module, assert that `IntelligenceToolbar` occurs inside the `listHeader` expression or, for policy preview, already lives inside the workspace list component with `variant="embedded"`.

- [ ] **Step 2: Add the failing timeline assertions**

Extend `tests/group-by-date.test.mjs` with real dates and assert:

```js
assert.deepEqual(
  groupByCalendarDate(items).map((group) => group.date),
  ["2026-07-16", "2026-07-15", null],
);
```

Extend the UI contract to require both university pages to pass `variant="timeline"` and `animated={false}`.

- [ ] **Step 3: Add the failing selection resolver tests**

Create `tests/detail-selection.test.mjs` covering:

```js
assert.equal(getDefaultDetailSelection(items, null, getKey, true), items[0]);
assert.equal(getDefaultDetailSelection(items, null, getKey, false), null);
assert.equal(getDefaultDetailSelection(items, items[1], getKey, true), items[1]);
assert.equal(getDefaultDetailSelection(items, staleItem, getKey, true), items[0]);
assert.equal(getDefaultDetailSelection([], items[0], getKey, true), null);
```

- [ ] **Step 4: Verify RED**

Run:

```bash
node --test tests/intelligence-ui-contract.test.mjs tests/group-by-date.test.mjs tests/detail-selection.test.mjs
```

Expected: FAIL because the new props, functions, timeline mode, and page integrations do not exist.

---

### Task 2: Implement the shared master-pane layout

**Files:**
- Modify: `components/shared/intelligence-toolbar.tsx`
- Modify: `components/shared/intelligence-workspace.tsx`

**Interfaces:**
- Produces: `IntelligenceToolbar` with default `variant="standalone"` and opt-in `embedded` styling.
- Produces: `IntelligenceWorkspace` with `listHeader?: ReactNode`; all existing `MasterDetailView` props remain accepted except callers cannot override `variant`.

- [ ] **Step 1: Add the embedded toolbar branch**

Use the existing toolbar markup and switch only container/layout classes:

```tsx
variant === "embedded"
  ? "rounded-none border-x-0 border-t-0 bg-white p-4 shadow-none"
  : "rounded-xl border border-[#e5e9f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
```

Use a 24px title in embedded mode and allow the actions row to wrap within the narrow master pane.

- [ ] **Step 2: Compose the fixed left header**

Wrap the `MasterDetailView` children as:

```tsx
<div className="flex h-full min-h-0 flex-col">
  {listHeader && <div className="shrink-0">{listHeader}</div>}
  <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
</div>
```

Pass `listWidth={listWidth ?? 40}` and keep `variant="intelligence"`.

- [ ] **Step 3: Verify GREEN for the shared contract**

Run:

```bash
node --test tests/intelligence-ui-contract.test.mjs
npx tsc --noEmit --incremental false
```

Expected: shared layout assertions PASS; page-integration assertions may remain RED until Task 4.

---

### Task 3: Implement tested selection and calendar-date primitives

**Files:**
- Create: `lib/detail-selection.ts`
- Create: `hooks/use-auto-select-detail.ts`
- Modify: `lib/group-by-date.ts`
- Modify: `components/shared/date-grouped-list.tsx`

**Interfaces:**
- Produces: `getDefaultDetailSelection<T>(items, selectedItem, getKey, autoOpen): T | null`.
- Produces: `useAutoSelectDetail<T>({ items, selectedItem, select, close, getKey, isLoading })`.
- Produces: `groupByCalendarDate<T>(items): { date: string | null; label: string; items: T[] }[]`.
- Extends: `DateGroupedList` with `variant?: "cards" | "timeline"`, defaulting to `cards`.

- [ ] **Step 1: Implement the pure selection resolver**

Return the current item when its key remains visible; otherwise return the first item only when `autoOpen` is true, and return `null` for empty/mobile-list-first states.

- [ ] **Step 2: Implement the synchronization Hook**

Read `window.innerWidth` inside the client effect so the initial desktop fallback cannot open a mobile detail. Keep the current selection in a ref and drive the synchronization effect from the item-key signature and `isLoading`, not from `selectedItem` or breakpoint changes; this lets an explicit user close remain closed until the result set changes. Call `select(next)` or `close()` only when a transition is required.

- [ ] **Step 3: Implement exact date grouping**

Keep `groupByDate` unchanged. `groupByCalendarDate` groups identical `YYYY-MM-DD` values, sorts dated groups descending, formats Chinese labels, and appends a `date: null` group labeled “日期未标注”.

- [ ] **Step 4: Implement the opt-in timeline**

In `DateGroupedList`, retain the current card branch as the default. The timeline branch renders a 32px calendar node, 1px connector, exact date label, group count, `space-y-2.5` items, and no entrance animation when callers pass `animated={false}`.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
node --test tests/group-by-date.test.mjs tests/detail-selection.test.mjs
npx tsc --noEmit --incremental false
```

Expected: all primitive tests PASS.

---

### Task 4: Migrate all business pages to the left header and default detail

**Files:**
- Modify: `components/policy-intel-preview/policy-intel-preview.tsx`
- Modify: `components/policy-intel-preview/policy-preview-list.tsx`
- Modify: `components/modules/tech-frontier/tech-frontier-page.tsx`
- Modify: `components/modules/papers/paper-list.tsx`
- Modify: `components/modules/internal-shared/academic-achievement-list.tsx`
- Modify: `components/modules/talent-radar/index.tsx`
- Modify: `components/modules/internal-shared/internal-experts.tsx`
- Modify: `components/modules/university-eco/peer-dynamics.tsx`
- Modify: `components/modules/university-eco/research-tracking.tsx`
- Modify: `components/modules/internal-mgmt/sentiment/index.tsx`

**Interfaces:**
- Consumes: `IntelligenceWorkspace.listHeader`, `IntelligenceToolbar.variant`, and `useAutoSelectDetail`.
- Preserves: existing filter handlers, pagination callbacks, list refs, data hooks, detail content, footer actions, and mobile close behavior.

- [ ] **Step 1: Move existing toolbar JSX without rewriting its controls**

For each page currently rendering sibling toolbar/workspace nodes, pass the unchanged toolbar as:

```tsx
<IntelligenceWorkspace
  listHeader={
    <IntelligenceToolbar variant="embedded" ...>
      ...existing controls...
    </IntelligenceToolbar>
  }
  ...existing detail props
>
```

Policy preview keeps the toolbar inside `PolicyPreviewList` and only adds `variant="embedded"`.

- [ ] **Step 2: Add non-mobile default selection**

Use one stable module-level key getter per record type and call `useAutoSelectDetail` with the currently visible page items. Pass each feed's loading state where available. University pages pass `handleOpen` as `select` so automatic selection still loads article detail. Policy preview changes its compact/mobile predicate so tablet uses the selected first record while mobile remains unselected and closed until a click.

- [ ] **Step 3: Preserve reset and focus behavior**

Keep current `close()` or `setSelectedContent(null)` calls in filter/page handlers. Keep all list items mounted, selected, and carrying `data-intelligence-item` through `IntelligenceListItem`.

- [ ] **Step 4: Verify page contracts**

Run:

```bash
node --test tests/intelligence-ui-contract.test.mjs tests/policy-preview.test.mjs tests/university-eco-performance.test.mjs
npx tsc --noEmit --incremental false
```

Expected: all layout/default-selection assertions PASS.

---

### Task 5: Add university timelines and compact typography

**Files:**
- Modify: `components/modules/tech-frontier/tech-frontier-page.tsx`
- Modify: `components/modules/university-eco/peer-dynamics.tsx`
- Modify: `components/modules/university-eco/research-tracking.tsx`
- Modify: `tests/intelligence-ui-contract.test.mjs`
- Modify: `tests/university-eco-performance.test.mjs`

**Interfaces:**
- Consumes: `DateGroupedList variant="timeline"`.
- Preserves: social platform differences, university covers, source filters, detail loading, and footer actions.

- [ ] **Step 1: Enable the timeline on both university tabs**

Pass both `variant="timeline"` and `animated={false}`. Keep the existing list item render functions and selected states.

- [ ] **Step 2: Compact social typography**

Apply the approved scale: 14px/12px author metadata, 13px list body with about 22px line height, 16px detail header, 12px detail metadata, and 14px detail body with 24-26px line height.

- [ ] **Step 3: Compact university typography and media**

Use 14px list titles, 11-12px summaries/metadata, 14px research metric values, and a stable 96x64 cover frame suitable for the 40% master pane.

- [ ] **Step 4: Verify focused contracts**

Run:

```bash
node --test tests/intelligence-ui-contract.test.mjs tests/university-eco-performance.test.mjs
```

Expected: both university pages expose the exact-date timeline and compact classes; social no longer contains the rejected large body/detail classes.

---

### Task 6: Full regression and visual acceptance

**Files:**
- Modify only files required by defects found during verification.

- [ ] **Step 1: Run clean code checks**

```bash
git diff --check
node --test tests/*.test.mjs
npx tsc --noEmit --incremental false
npm run build
```

Expected: zero test failures, zero TypeScript errors, and a successful production build.

- [ ] **Step 2: Start the production server**

Run `npm run start -- --port 8123`, or use the next free port if 8123 is occupied. Record the final URL.

- [ ] **Step 3: Verify three viewports**

At `1440x900`, `1024x768`, and `390x844`, inspect policy, social, papers, external leaders, both university tabs, sentiment, academic achievements, and internal experts.

Verify left-header placement, 40/60 desktop split, full-height detail, first-item default, mobile list-first behavior, timeline nodes/connectors/counts, scrolling, pagination, text wrapping, and no horizontal overflow.

- [ ] **Step 4: Verify runtime focus and close behavior**

Check Escape close, close-button focus restoration, mobile back-button focus, list selection after page/filter changes, and original/source links.

- [ ] **Step 5: Review and commit**

Run a focused diff review, fix Critical/Important findings, rerun affected checks, then commit only the requested implementation and its tests/docs.
