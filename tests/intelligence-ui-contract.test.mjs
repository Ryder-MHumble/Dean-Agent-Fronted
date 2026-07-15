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

test("intelligence workspace opts into report styling without changing defaults", () => {
  const workspace = read("../components/shared/intelligence-workspace.tsx");
  const masterDetail = read("../components/shared/master-detail-view.tsx");

  assert.match(workspace, /variant="intelligence"/);
  assert.match(masterDetail, /variant\?: "default" \| "intelligence"/);
  assert.match(masterDetail, /variant = "default"/);
  assert.match(masterDetail, /variant === "intelligence"/);
  assert.match(masterDetail, /bg-background\/95 backdrop-blur-sm/);
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
