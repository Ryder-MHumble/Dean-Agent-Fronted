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
