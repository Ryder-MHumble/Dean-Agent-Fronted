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
  assert.match(toolbar, /variant\?: "standalone" \| "embedded"/);
  assert.match(toolbar, /variant === "embedded"/);
  assert.match(toolbar, /text-\[24px\]|text-2xl/);
  assert.match(toolbar, /共.*条/);
  assert.match(workspace, /listHeader\?: ReactNode/);
  assert.match(workspace, /\{listHeader &&/);
  assert.match(workspace, /listWidth=\{40\}|listWidth \?\? 40/);
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

test("shared detail continuously tracks the selected intelligence item", () => {
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(
    masterDetail,
    /if \(isOpen\) \{[\s\S]{0,500}document\.querySelector<HTMLElement>\(\s*'\[data-intelligence-item\]\[aria-current="true"\]'/,
  );
  assert.doesNotMatch(masterDetail, /if \(isOpen && !wasOpenRef\.current\)/);
  assert.match(
    masterDetail,
    /if \(selectedItem\) \{[\s\S]{0,160}restoreFocusRef\.current = selectedItem;[\s\S]{0,160}else if \(!wasOpenRef\.current\)/,
  );
});

test("shared detail restores focus only for user-initiated closes", () => {
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(masterDetail, /const shouldRestoreFocusRef = useRef\(false\)/);
  assert.match(
    masterDetail,
    /const closeDetail = \(\) => \{[\s\S]{0,160}shouldRestoreFocusRef\.current = true;[\s\S]{0,160}onClose\(\);/,
  );
  assert.match(masterDetail, /onClick=\{closeDetail\}/);
  assert.equal(masterDetail.match(/onClose=\{closeDetail\}/g)?.length, 2);
  assert.match(
    masterDetail,
    /if \(shouldRestoreFocusRef\.current\) \{[\s\S]{0,500}target\?\.isConnected[\s\S]{0,80}target\.focus\(\)[\s\S]{0,240}shouldRestoreFocusRef\.current = false;/,
  );
  assert.match(
    masterDetail,
    /const handleEscape = \(event: KeyboardEvent\) => \{[\s\S]{0,120}if \(event\.key === "Escape"\) \{\s*event\.preventDefault\(\);\s*event\.stopImmediatePropagation\(\);\s*closeDetail\(\);/,
  );
  assert.match(
    masterDetail,
    /document\.addEventListener\("keydown", handleEscape, true\)/,
  );
  assert.match(
    masterDetail,
    /document\.removeEventListener\("keydown", handleEscape, true\)/,
  );
});

test("mobile detail moves focus inside and cleans scheduled focus frames", () => {
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(
    masterDetail,
    /const mobileBackButtonRef = useRef<HTMLButtonElement \| null>\(null\)/,
  );
  assert.match(masterDetail, /ref=\{mobileBackButtonRef\}/);
  assert.match(masterDetail, /mobileBackButtonRef\.current\?\.focus\(\)/);
  assert.match(
    masterDetail,
    /const focusFrameRef = useRef<number \| null>\(null\)/,
  );
  assert.match(
    masterDetail,
    /cancelAnimationFrame\(focusFrameRef\.current\)/,
  );
  assert.match(
    masterDetail,
    /focusFrameRef\.current = requestAnimationFrame\([\s\S]{0,160}focusFrameRef\.current = null;/,
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

test("social intelligence uses result-driven default selection without forcing reopen after close", () => {
  const social = read(
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
  );
  const autoSelect = read("../hooks/use-auto-select-detail.ts");

  assert.match(social, /useAutoSelectDetail/);
  assert.match(social, /items:\s*visibleItems/);
  assert.doesNotMatch(social, /open\(visibleItems\[0\]\)/);
  assert.match(autoSelect, /window\.innerWidth/);
  assert.match(autoSelect, /const selectedItemRef = useRef/);
  assert.doesNotMatch(autoSelect, /useBreakpoint/);
  assert.doesNotMatch(
    autoSelect,
    /\[[^\]]*selectedItem[^\]]*\]/,
    "user close must not retrigger auto selection for the same items",
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
  assert.match(policyList, /<IntelligenceToolbar[\s\S]{0,120}variant="embedded"/);
  assert.match(policyList, /<IntelligenceListItem/);
  assert.match(policyDetail, /<IntelligenceDetailHeader/);
  assert.match(policyDetail, /<IntelligenceSection/);
  assert.match(
    social,
    /<IntelligenceWorkspace[\s\S]{0,300}listHeader=\{\s*<IntelligenceToolbar\s+variant="embedded"/,
  );
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
    assert.match(
      source,
      /<IntelligenceWorkspace[\s\S]{0,300}listHeader=\{\s*<IntelligenceToolbar\s+variant="embedded"/,
    );
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
    assert.match(
      source,
      /<IntelligenceWorkspace[\s\S]{0,300}listHeader=\{\s*<IntelligenceToolbar\s+variant="embedded"/,
    );
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
    assert.match(
      source,
      /<IntelligenceWorkspace[\s\S]{0,300}listHeader=\{\s*<IntelligenceToolbar\s+variant="embedded"/,
    );
  }
  assert.doesNotMatch(sentiment, /<Sheet|<DetailPanel/);
  assert.match(sentiment, /preserveSelectedOutsideItems/);
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

  assert.ok(workspaceStart >= 0 && toolbarStart > workspaceStart);
  assert.match(
    sentiment.slice(workspaceStart, toolbarStart + 200),
    /listHeader=\{/,
  );
  assert.ok(reportStart > workspaceStart);
  assert.ok(popularStart > reportStart);
  assert.ok(sentiment.indexOf("<FeedPagination") > popularStart);
});

test("all non-policy business pages synchronize the first non-mobile detail", () => {
  for (const path of [
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
    "../components/modules/papers/paper-list.tsx",
    "../components/modules/internal-shared/academic-achievement-list.tsx",
    "../components/modules/talent-radar/index.tsx",
    "../components/modules/internal-shared/internal-experts.tsx",
    "../components/modules/university-eco/peer-dynamics.tsx",
    "../components/modules/university-eco/research-tracking.tsx",
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  ]) {
    assert.match(read(path), /useAutoSelectDetail/);
  }

  const policy = read("../components/policy-intel-preview/policy-intel-preview.tsx");
  assert.match(policy, /const isMobileViewport = breakpoint === "mobile"/);
  assert.match(policy, /window\.innerWidth < 768/);
});

test("social and university list typography stays compact in the narrow master pane", () => {
  const social = read(
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
  );
  const peers = read("../components/modules/university-eco/peer-dynamics.tsx");
  const research = read(
    "../components/modules/university-eco/research-tracking.tsx",
  );

  assert.match(social, /whitespace-pre-line text-\[13px\] leading-\[22px\]/);
  assert.match(social, /whitespace-pre-line text-sm leading-6 text-slate-700/);
  assert.doesNotMatch(social, /whitespace-pre-line text-base leading-8/);
  for (const source of [peers, research]) {
    assert.match(source, /h-16 w-24/);
    assert.match(source, /<h4 className="text-sm font-semibold/);
  }
});
