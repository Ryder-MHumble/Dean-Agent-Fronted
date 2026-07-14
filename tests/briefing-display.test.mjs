import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeBriefingParagraphs,
  normalizeMetricCards,
} from "../lib/briefing-display.ts";

test("normalizeBriefingParagraphs removes old dean-oriented wording", () => {
  const paragraphs = normalizeBriefingParagraphs([
    [
      "院长，状态提示需要院领导介入，研究院与我院均需关注。",
      { text: "人事动态", moduleId: "talent-radar" },
    ],
  ]);

  assert.deepEqual(paragraphs, [
    [
      "状态信息需要负责人介入，本机构与本机构均需关注。",
      { text: "外部领导", moduleId: "talent-radar" },
    ],
  ]);
});

test("normalizeMetricCards renames personnel cards for the leader profile UI", () => {
  const cards = normalizeMetricCards([
    {
      id: "talent-radar",
      title: "人事动态",
      icon: "talent",
      metrics: [{ label: "人事变动", value: "12条" }],
    },
  ]);

  assert.equal(cards[0].title, "外部领导");
  assert.equal(cards[0].metrics[0].label, "领导记录");
});
