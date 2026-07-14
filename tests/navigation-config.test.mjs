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
const topBarSource = readFileSync(
  new URL("../components/layout/top-bar.tsx", import.meta.url),
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

test("source-pool control remains accessible on narrow screens", () => {
  assert.match(topBarSource, /aria-label=["']情报引擎信源池["']/);
  assert.match(topBarSource, /className=["']hidden sm:inline["']/);
  assert.match(topBarSource, /className=["'][^"']*min-w-0[^"']*["']/);
});
