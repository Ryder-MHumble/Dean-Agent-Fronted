# 情报引擎前端优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有前端改造成包含外部情报、前沿论文和内部共享数据的情报引擎 GUI，并完成领导头像补全与专家数据脱敏。

**Architecture:** 保留现有 Next.js 单页导航和真实后端 API。可实时访问的数据通过 `lib/api.ts` 获取；论文、领导和专家的纯转换逻辑放在可直接由 Node 测试导入的 TypeScript 文件中。钉钉专家数据和领导头像使用可刷新 JSON 快照，组件不直接接触钉钉认证或敏感字段。

**Tech Stack:** Next.js 16.1.6、React 19、TypeScript 5.7、Tailwind CSS 3.4、Node test runner、DWS CLI、Intelligence Engine API。

## Global Constraints

- 所有可见 UI 文本使用中文。
- 报告页背景保持白色或 `#f7f8fa`，无渐变、噪声、英雄区或营销文案。
- 不新增前端依赖。
- 专家快照不得包含邮箱、电话、学号或其他敏感字段。
- 现有未提交代码不得被回滚或格式化重写。
- 项目标识改为 `intelligence-fronted`，服务器目录暂不移动。
- 每个数据页只加载有限分页记录，不全量加载论文或学者数据。

---

### Task 1: 品牌、顶部入口和导航结构

**Files:**
- Modify: `components/layout/sidebar.tsx`
- Modify: `components/layout/top-bar.tsx`
- Modify: `app/page.tsx`
- Modify: `lib/mock-data/navigation.ts`
- Modify: `components/shared/mobile-bottom-nav.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/navigation-config.test.mjs`

**Interfaces:**
- Consumes: existing `NavGroup`, `PageMeta`, `activePage`, `onNavigate`.
- Produces: page IDs `papers`, `academic-achievements`, `internal-experts`; constant source-pool URL.

- [ ] **Step 1: Write the failing navigation test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { navGroups, pageMeta } from "../lib/mock-data/navigation.ts";

test("navigation exposes external and internal intelligence groups", () => {
  assert.deepEqual(navGroups.map((group) => group.label ?? ""), ["", "外部情报资讯", "内部共享资讯"]);
  assert.deepEqual(navGroups[1].items.map((item) => item.label), ["政策情报", "社媒情报", "前沿论文", "外部领导", "高校生态", "两院舆情"]);
  assert.deepEqual(navGroups[2].items.map((item) => item.label), ["两院学术成果", "两院专家库"]);
  assert.equal(pageMeta.papers.title, "前沿论文");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/navigation-config.test.mjs`

Expected: FAIL because the internal group and `papers` metadata do not exist.

- [ ] **Step 3: Implement navigation and brand changes**

Use these stable IDs:

```ts
{ id: "tech-frontier", label: "社媒情报", icon: RadioTower }
{ id: "papers", label: "前沿论文", icon: BookOpenText }
{ id: "talent-radar", label: "外部领导", icon: Landmark }
{ id: "academic-achievements", label: "两院学术成果", icon: ScrollText }
{ id: "internal-experts", label: "两院专家库", icon: UsersRound }
```

Change the sidebar brand to plain text `情报引擎` and `智能创新中心`. Replace `TopBar` search and access menu props with one anchor:

```tsx
<Button asChild variant="outline" size="sm">
  <a href={INTELLIGENCE_SOURCE_POOL_URL} target="_blank" rel="noreferrer">
    <Database className="h-4 w-4" />
    情报引擎信源池
  </a>
</Button>
```

Remove `CommandPalette`, `searchOpen`, `searchSlot`, and mobile search callbacks from `app/page.tsx`.

- [ ] **Step 4: Run the navigation test and TypeScript check**

Run: `node --test tests/navigation-config.test.mjs`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: exit 0.

---

### Task 2: 前沿论文与两院学术成果数据层

**Files:**
- Create: `lib/paper-feed.ts`
- Create: `lib/types/papers.ts`
- Modify: `lib/api.ts`
- Create: `hooks/use-paper-feed.ts`
- Test: `tests/paper-feed.test.mjs`

**Interfaces:**
- Produces: `PaperCategory`, `PaperRecord`, `PaperListResponse`, `PaperQuery`, `buildPaperQueryParams()`, `classifyPaper()`, `normalizePaper()`.
- Consumed by: Task 3 page components.

- [ ] **Step 1: Write failing paper classification tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { buildPaperQueryParams, classifyPaper, normalizePaper } from "../lib/paper-feed.ts";

test("classifyPaper separates conferences journals and arxiv", () => {
  assert.equal(classifyPaper({ source: { source_id: "icml" }, venue: "ICML" }), "top-conference");
  assert.equal(classifyPaper({ source: { source_id: "jmlr" }, venue: "JMLR" }), "top-journal");
  assert.equal(classifyPaper({ source: { source_id: "arxiv" }, venue: "CoRR" }), "arxiv");
});

test("academic achievement query stays paginated and scoped", () => {
  assert.equal(buildPaperQueryParams({ category: "achievements", page: 2, pageSize: 20 }).toString(), "source_type=academy_weekly_signature_achievements&page=2&page_size=20&sort_by=publication_date&order=desc");
});

test("normalizePaper provides display-safe fallback values", () => {
  const paper = normalizePaper({ paper_id: "p1", title: "A paper", authors: [], source: {} });
  assert.equal(paper.authorsText, "作者信息待补充");
  assert.equal(paper.venueText, "来源待补充");
});
```

- [ ] **Step 2: Run paper tests and verify RED**

Run: `node --test tests/paper-feed.test.mjs`

Expected: FAIL with module-not-found for `lib/paper-feed.ts`.

- [ ] **Step 3: Implement minimal paper helpers and API call**

`buildPaperQueryParams()` must clamp `pageSize` to 30 and map UI categories to API parameters. `fetchPapers()` calls `${API_BASE}/api/papers?${params}` with `cache: "no-store"` and a 12-second timeout.

- [ ] **Step 4: Run paper tests and verify GREEN**

Run: `node --test tests/paper-feed.test.mjs`

Expected: PASS.

---

### Task 3: 论文与内部共享页面

**Files:**
- Create: `components/modules/papers/index.tsx`
- Create: `components/modules/papers/paper-list.tsx`
- Create: `components/modules/internal-shared/academic-achievements.tsx`
- Create: `components/modules/internal-shared/internal-experts.tsx`
- Create: `components/shared/skill-access-note.tsx`
- Create: `lib/generated/two-academies-experts.json`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: Task 1 page IDs and Task 2 `usePaperFeed()`.
- Produces: three navigable data pages.

- [ ] **Step 1: Add dynamic modules to `app/page.tsx`**

Register `papers`, `academic-achievements`, and `internal-experts` in `visiblePages`, dynamic imports, and render branches.

- [ ] **Step 2: Implement the compact paper list**

The list row contains title, authors, venue/year, two-line abstract, source type and original link. Use category tabs `全部`, `顶刊`, `顶会`, `ArXiv`, each with a maximum page size of 20.

Add this factual note:

```tsx
<SkillAccessNote
  label="接入情报引擎 Skill"
  href="https://skills.zgci.org/space/global/intelligence-engine-api"
/>
```

- [ ] **Step 3: Implement the academic achievements timeline**

Use the same paper list with the fixed `achievements` query and chronological date grouping. Add the `zgca-paper-author-query` Skill link.

- [ ] **Step 4: Implement the experts table shell**

Create an empty `{ "syncedAt": "", "items": [] }` snapshot, then read it from `lib/generated/two-academies-experts.json`. Columns: 姓名、工作单位、二级单位、职称、职务或人才称号、地区、研究方向、更新时间. Add the scholars URL and expert recommender Skill link. Task 4 replaces the empty snapshot with sanitized live data.

- [ ] **Step 5: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: exit 0.

---

### Task 4: 专家脱敏快照

**Files:**
- Create: `lib/internal-experts.ts`
- Modify: `lib/generated/two-academies-experts.json`
- Create: `scripts/build-internal-experts-snapshot.mjs`
- Test: `tests/internal-experts.test.mjs`

**Interfaces:**
- Produces: `sanitizeExpertRecord(record)`, `sanitizeExpertRecords(records)`, `InternalExpert`.
- Consumed by: Task 3 expert page.

- [ ] **Step 1: Write the failing privacy test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeExpertRecord } from "../lib/internal-experts.ts";

test("sanitizeExpertRecord excludes private contact fields", () => {
  const expert = sanitizeExpertRecord({
    姓名: "示例学者",
    工作单位: "示例大学",
    电子邮箱: "private@example.com",
    电话: "13800000000",
    研究领域或研究方向: "人工智能",
  });
  assert.deepEqual(expert, { name: "示例学者", organization: "示例大学", department: "", title: "", role: "", region: "", researchAreas: "人工智能", discipline: "", updatedAt: "" });
  assert.doesNotMatch(JSON.stringify(expert), /private@example.com|13800000000/);
});
```

- [ ] **Step 2: Run privacy test and verify RED**

Run: `node --test tests/internal-experts.test.mjs`

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement strict allowlist sanitization**

Only read the nine approved field names. Never spread input records or preserve unknown fields.

- [ ] **Step 4: Generate the snapshot from DWS output**

Read all records from base `9E05BDRVQ2bROvmAtDvdlBj5J63zgkYA`, table `z3nEovG`, requesting only approved field IDs. Feed the JSON into `scripts/build-internal-experts-snapshot.mjs`; write only the sanitized array and `syncedAt` to `lib/generated/two-academies-experts.json`.

- [ ] **Step 5: Verify privacy mechanically**

Run: `node --test tests/internal-experts.test.mjs`

Expected: PASS.

Run: `rg -n "电子邮箱|手机号|电话|@" lib/generated/two-academies-experts.json`

Expected: no output.

---

### Task 5: 外部领导布局与头像补全

**Files:**
- Create: `lib/leader-display.ts`
- Create: `lib/generated/leader-avatars.json`
- Create: `scripts/enrich-leader-avatars.mjs`
- Modify: `lib/types/leaders.ts`
- Modify: `components/modules/talent-radar/index.tsx`
- Test: `tests/leader-display.test.mjs`

**Interfaces:**
- Produces: `getLeaderSummary()`, `resolveLeaderAvatar()`, `LeaderAvatarRecord`.
- Consumed by: existing `LeaderAvatar` and leader table.

- [ ] **Step 1: Write failing display tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getLeaderSummary, resolveLeaderAvatar } from "../lib/leader-display.ts";

test("getLeaderSummary prefers verified display text", () => {
  assert.equal(getLeaderSummary({ leader_details: { text: "完整简介", summary: "短简介" } }), "完整简介");
});

test("resolveLeaderAvatar prefers backend media then generated mapping", () => {
  assert.equal(resolveLeaderAvatar({ id: "a", leader_details: { media: { avatar_url: "https://official/a.jpg" } } }, { a: { avatarUrl: "https://fallback/a.jpg" } }), "https://official/a.jpg");
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/leader-display.test.mjs`

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement summary and avatar resolution**

Do not change API contracts. Add optional typed `media.avatar_url` and use imported generated mapping as fallback.

- [ ] **Step 4: Adjust leader page layout**

Remove any intro title and explanation. Put total, review count and freshness in the final desktop grid cell of the filter row. Keep the description cell `truncate` with the full value in `title`. Preserve the detail drawer.

- [ ] **Step 5: Run avatar enrichment for every current leader**

Fetch `/api/leaders` in pages of 200 until `has_more=false`. For each record, try: existing backend URL, exact name match against `/api/scholars?keyword=...`, then public search. Save only traceable HTTP(S) image URLs with source URLs and status; save `not_found` entries so every leader ID has an attempted result.

- [ ] **Step 6: Verify coverage**

Compare API total with snapshot record count. Expected: both counts equal. Report found, not-found, and rejected candidate counts.

---

### Task 6: Full verification and deployment

**Files:**
- Modify only files required to fix failures caused by Tasks 1-5.

**Interfaces:**
- Consumes all prior tasks.
- Produces deployed application at port 8080.

- [ ] **Step 1: Run all automated tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass.

- [ ] **Step 2: Run TypeScript and production build**

Run: `npx tsc --noEmit`

Expected: exit 0.

Run: `npm run build`

Expected: Next.js build completes successfully.

- [ ] **Step 3: Review requirement strings**

Run: `rg -n "智策云端|领导画像库|全局搜索|科技前沿" app components lib --glob '!lib/mock-data/home-briefing.ts'`

Expected: no obsolete visible brand or page labels remain; technical data labels may remain only where factually required.

- [ ] **Step 4: Deploy only port 8080**

Build in `/home/ubuntu/workspace/Dean-Agent-Fronted`, stop the process listening on 8080, and start `next start --port 8080 --hostname 0.0.0.0`. Do not stop the unrelated 8000 or 8003 processes.

- [ ] **Step 5: Runtime visual verification**

Capture desktop 1440x1000 and mobile 390x844 screenshots for: 外部领导、前沿论文、两院学术成果、两院专家库. Verify no overlap, clipped controls, blank content, English UI labels, gradients, hero sections or hidden entrance content.

- [ ] **Step 6: Final completion audit**

For every numbered user requirement, record the file evidence, API or snapshot evidence, and runtime screenshot evidence before marking the goal complete.
