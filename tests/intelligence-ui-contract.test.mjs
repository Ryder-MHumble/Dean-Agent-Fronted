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

test("mobile detail stays above the persistent bottom navigation", () => {
  const masterDetail = read("../components/shared/master-detail-view.tsx");
  const mobileNav = read("../components/shared/mobile-bottom-nav.tsx");

  assert.match(masterDetail, /fixed inset-0 z-50 flex flex-col bg-background/);
  assert.match(
    mobileNav,
    /<nav className="fixed bottom-0 left-0 right-0 z-40\b/,
  );
  assert.match(mobileNav, /fixed inset-x-0 bottom-0 z-50 md:hidden/);
});

test("shared detail restores focus to the selected intelligence item", () => {
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(
    masterDetail,
    /data-intelligence-item.*aria-current=.*true/,
  );
  assert.match(
    masterDetail,
    /requestAnimationFrame\([\s\S]*?isConnected[\s\S]*?\.focus\(\)/,
  );
});

test("shared toolbar supports estimated totals and social intelligence opts in", () => {
  const toolbar = read("../components/shared/intelligence-toolbar.tsx");
  const social = read(
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
  );

  assert.match(toolbar, /totalIsEstimate\?: boolean/);
  assert.match(toolbar, /totalIsEstimate = false/);
  assert.match(
    toolbar,
    /totalIsEstimate\s*\?\s*`至少 \$\{total\.toLocaleString\("zh-CN"\)\} 条`\s*:\s*`共/,
  );
  assert.match(social, /<IntelligenceToolbar[\s\S]*?totalIsEstimate/);
  assert.match(
    social,
    /count > 0[\s\S]*?至少 \{formatNumber\(count\)\}/,
  );
  assert.doesNotMatch(social, /\bmark\b/);
});

test("social intelligence only auto-opens results outside mobile", () => {
  const social = read(
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
  );

  assert.match(social, /const breakpoint = useBreakpoint\(\)/);
  assert.match(
    social,
    /breakpoint !== "mobile"[\s\S]{0,160}open\(visibleItems\[0\]\)/,
  );
});

test("intelligence workspace opts into report styling without changing defaults", () => {
  const workspace = read("../components/shared/intelligence-workspace.tsx");
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(workspace, /variant="intelligence"/);
  assert.match(masterDetail, /variant\?: "default" \| "intelligence"/);
  assert.match(masterDetail, /variant = "default"/);
  assert.match(masterDetail, /variant === "intelligence"/);
  assert.match(
    masterDetail,
    /variant === "intelligence"\s*\?\s*"border-\[#e5e9f0\] bg-white"\s*:\s*"bg-background\/95 backdrop-blur-sm"/,
  );
});

test("shared intelligence primitives expose stable QA selectors", () => {
  const selectors = [
    ["../components/shared/intelligence-page-shell.tsx", "data-intelligence-page"],
    ["../components/shared/intelligence-toolbar.tsx", "data-intelligence-toolbar"],
    ["../components/shared/intelligence-workspace.tsx", "data-intelligence-workspace"],
    ["../components/shared/intelligence-list-item.tsx", "data-intelligence-item"],
    ["../components/shared/intelligence-detail.tsx", "data-intelligence-detail"],
  ];

  for (const [path, selector] of selectors) {
    assert.match(read(path), new RegExp(selector));
  }
});

test("only the overview page uses the entrance animation wrapper", () => {
  const page = read("../app/page.tsx");
  const motionPages = page.match(/<MotionPage\b[^>]*>[\s\S]*?<\/MotionPage>/g);

  assert.equal(motionPages?.length, 1);
  const wrappedSource = motionPages[0];
  const unwrappedSource = page.replace(wrappedSource, "");
  const branchPattern = (pageId, componentName) =>
    new RegExp(
      `\\{activePage === "${pageId}"\\s*&&\\s*(?:\\(\\s*)?<${componentName}\\b`,
    );

  assert.match(wrappedSource, /<HomeModule\b/);
  assert.match(
    page,
    /\{activePage === "home"\s*&&\s*\(\s*<MotionPage\b[^>]*>[\s\S]*?<HomeModule\b[\s\S]*?<\/MotionPage>\s*\)\}/,
  );
  assert.doesNotMatch(unwrappedSource, /<HomeModule\b/);

  for (const [pageId, componentName] of [
    ["policy-intel", "PolicyIntelModule"],
    ["tech-frontier", "TechFrontierModule"],
    ["papers", "PapersModule"],
    ["talent-radar", "TalentRadarModule"],
    ["university-eco", "UniversityEcoModule"],
    ["sentiment", "SentimentModule"],
    ["academic-achievements", "AcademicAchievementsModule"],
    ["internal-experts", "InternalExpertsModule"],
  ]) {
    const pattern = branchPattern(pageId, componentName);
    assert.doesNotMatch(wrappedSource, pattern, `${pageId} must not be animated`);
    assert.match(unwrappedSource, pattern, `${pageId} must render outside MotionPage`);
  }
});

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
  assert.match(social, /<IntelligenceListItem/);
  assert.doesNotMatch(social, /hover:-translate-y/);
  assert.doesNotMatch(social, /YouTube|youtube/);
  assert.doesNotMatch(social, /\/logos\/(?:x|wechat)\.svg/);
});

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

test("university and sentiment pages use the unified shell", () => {
  const university = read("../components/modules/university-eco/index.tsx");
  const peers = read("../components/modules/university-eco/peer-dynamics.tsx");
  const research = read(
    "../components/modules/university-eco/research-tracking.tsx",
  );
  const sentiment = read(
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  );
  const sentimentDetail = read(
    "../components/modules/internal-mgmt/sentiment/detail-panel.tsx",
  );

  assert.match(university, /<IntelligencePageShell/);
  assert.match(university, /<Tabs/);
  assert.doesNotMatch(university, /ModuleLayout/);
  for (const source of [peers, research, sentiment]) {
    assert.match(source, /<IntelligenceToolbar|toolbar=/);
    assert.match(source, /<IntelligenceWorkspace/);
  }
  assert.doesNotMatch(sentiment, /<Sheet|<DetailPanel/);
  assert.match(sentiment, /<IntelligenceListItem|<ContentCard/);
  assert.match(sentiment, /<FeedPagination/);
  assert.match(sentimentDetail, /IntelligenceDetailHeader/);
  assert.match(sentimentDetail, /IntelligenceSection/);
  assert.doesNotMatch(sentimentDetail, /<Sheet|SheetContent|SheetHeader/);
});

test("sentiment supplemental content fits the narrow master pane", () => {
  const sentiment = read(
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  );
  const report = read(
    "../components/modules/internal-mgmt/sentiment/sentiment-report.tsx",
  );

  assert.doesNotMatch(sentiment, /xl:grid-cols-5/);
  assert.match(sentiment, /sm:grid-cols-2/);
  assert.doesNotMatch(report, /lg:grid-cols-\[minmax\(0,1fr\)_auto\]/);
});

test("university detail actions use the shared emphasis color", () => {
  for (const path of [
    "../components/modules/university-eco/peer-dynamics.tsx",
    "../components/modules/university-eco/research-tracking.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /bg-\[#3156d8\]/);
  }
});

test("sentiment list items and summary use compact report primitives", () => {
  const contentCard = read(
    "../components/modules/internal-mgmt/sentiment/content-card.tsx",
  );
  const report = read(
    "../components/modules/internal-mgmt/sentiment/sentiment-report.tsx",
  );

  assert.match(contentCard, /<IntelligenceListItem/);
  assert.doesNotMatch(contentCard, /<StaggerItem/);
  assert.doesNotMatch(report, /<Card|<CardContent|bg-gradient/);
});

test("sentiment insights scroll inside the workspace instead of expanding the toolbar", () => {
  const sentiment = read(
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  );
  const toolbarStart = sentiment.indexOf("<IntelligenceToolbar");
  const workspaceStart = sentiment.indexOf("<IntelligenceWorkspace");
  const reportStart = sentiment.indexOf("<SentimentReport");
  const popularStart = sentiment.indexOf("<PopularContentList");

  assert.ok(toolbarStart >= 0 && workspaceStart > toolbarStart);
  assert.doesNotMatch(
    sentiment.slice(toolbarStart, workspaceStart),
    /<SentimentReport|<PopularContentList/,
  );
  assert.ok(reportStart > workspaceStart);
  assert.ok(popularStart > reportStart);
  assert.ok(sentiment.indexOf("<FeedPagination") > popularStart);
});
