import test from "node:test";
import assert from "node:assert/strict";
import { navGroups, pageMeta } from "../lib/mock-data/navigation.ts";

test("navigation exposes external and internal intelligence groups", () => {
  assert.deepEqual(navGroups.map((group) => group.label ?? ""), ["", "外部情报资讯", "内部共享资讯"]);
  assert.deepEqual(navGroups[1].items.map((item) => item.label), ["政策情报", "社媒情报", "前沿论文", "外部领导", "高校生态", "两院舆情"]);
  assert.deepEqual(navGroups[2].items.map((item) => item.label), ["两院学术成果", "两院专家库"]);
  assert.equal(pageMeta.papers.title, "前沿论文");
});
