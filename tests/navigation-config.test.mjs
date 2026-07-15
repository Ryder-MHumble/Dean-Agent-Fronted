import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { navGroups, pageMeta } from "../lib/mock-data/navigation.ts";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const packageLock = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
);
const pageSource = readFileSync(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
const sidebarSource = readFileSync(
  new URL("../components/layout/sidebar.tsx", import.meta.url),
  "utf8",
);

test("navigation exposes external and internal intelligence groups", () => {
  assert.deepEqual(navGroups.map((group) => group.label ?? ""), ["", "外部情报资讯", "内部共享资讯"]);
  assert.deepEqual(navGroups[1].items.map((item) => item.label), ["政策情报", "社媒情报", "前沿论文", "外部领导", "高校生态", "两院舆情"]);
  assert.deepEqual(navGroups[2].items.map((item) => item.label), ["两院学术成果", "两院专家库"]);
  assert.equal(pageMeta.papers.title, "前沿论文");
});

test("package metadata uses the intelligence-fronted identifier", () => {
  assert.equal(packageJson.name, "intelligence-fronted");
  assert.equal(packageLock.name, "intelligence-fronted");
  assert.equal(packageLock.packages[""].name, "intelligence-fronted");
});

test("paper metadata uses Chinese preprint copy", () => {
  assert.match(pageMeta.papers.subtitle, /预印本/);
  assert.doesNotMatch(pageMeta.papers.subtitle, /ArXiv/i);
});

test("intelligence data pages no longer render placeholder branches", () => {
  assert.doesNotMatch(pageSource, /<PlaceholderPage/);
});

test("quick access lives in the sidebar instead of a global top bar", () => {
  assert.doesNotMatch(pageSource, /<TopBar/);
  assert.doesNotMatch(pageSource, /components\/layout\/top-bar/);
  assert.doesNotMatch(sidebarSource, /情报引擎信源池/);
  assert.doesNotMatch(sidebarSource, /INTELLIGENCE_SOURCE_POOL_URL/);
  assert.doesNotMatch(sidebarSource, /\bDatabase\b/);
  assert.match(sidebarSource, /aria-label=["']快速接入能力["']/);
  assert.match(sidebarSource, /快速接入能力/);
});

test("sidebar exposes current-page curl and prompt copy actions", () => {
  assert.match(sidebarSource, /activePage: string/);
  assert.match(sidebarSource, /复制 curl 命令/);
  assert.match(sidebarSource, /复制智能体提示词/);
  assert.match(sidebarSource, /buildAccessCurl/);
  assert.match(sidebarSource, /buildAccessPrompt/);
  assert.match(sidebarSource, /copyTextToClipboard/);
});

test("sidebar restores the original logo and gradient brand treatment", () => {
  assert.match(sidebarSource, /import Image from ["']next\/image["']/);
  assert.match(sidebarSource, /src=["']\/Logo\.png["']/);
  assert.match(sidebarSource, /alt=["']情报引擎["']/);
  assert.match(sidebarSource, /情报\s*<span/);
  assert.match(sidebarSource, /bg-gradient-to-r from-violet-500 to-cyan-500/);
  assert.match(sidebarSource, />\s*引擎\s*<\/span>/);
  assert.match(sidebarSource, />\s*智能创新中心\s*</);
  assert.match(sidebarSource, /bg-white\/80 backdrop-blur-xl/);
  assert.doesNotMatch(sidebarSource, />\s*智策云端\s*</);
});
