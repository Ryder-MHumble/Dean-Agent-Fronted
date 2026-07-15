import test from "node:test";
import assert from "node:assert/strict";
import * as policyPreview from "../lib/policy-preview.ts";
import {
  formatPolicyPreviewTimestamp,
  getPolicyPreviewSelectedId,
  getPolicyPreviewScore,
  sortPolicyPreviewItems,
} from "../lib/policy-preview.ts";

const items = [
  { id: "old", date: "2026-07-01", importance: "一般", matchScore: 92 },
  { id: "new", date: "2026-07-15", importance: "重要", relevance: 88 },
  { id: "urgent", date: "2026-07-10", importance: "紧急", matchScore: 70 },
];

test("sortPolicyPreviewItems sorts copies without mutating API order", () => {
  assert.deepEqual(sortPolicyPreviewItems(items, "latest").map((item) => item.id), ["new", "urgent", "old"]);
  assert.deepEqual(sortPolicyPreviewItems(items, "relevance").map((item) => item.id), ["old", "new", "urgent"]);
  assert.deepEqual(sortPolicyPreviewItems(items, "impact").map((item) => item.id), ["urgent", "new", "old"]);
  assert.deepEqual(items.map((item) => item.id), ["old", "new", "urgent"]);
});

test("getPolicyPreviewScore falls back from match score to relevance", () => {
  assert.equal(getPolicyPreviewScore(items[0]), 92);
  assert.equal(getPolicyPreviewScore(items[1]), 88);
  assert.equal(getPolicyPreviewScore({ id: "none" }), 0);
});

test("getPolicyPreviewSelectedId resets only after a completed query or sort", () => {
  assert.equal(getPolicyPreviewSelectedId(items, "urgent", true), "old");
  assert.equal(getPolicyPreviewSelectedId(items, "urgent", false), "urgent");
  assert.equal(getPolicyPreviewSelectedId(items, "missing", false), "old");
  assert.equal(getPolicyPreviewSelectedId([], "urgent", true), null);
});

test("formatPolicyPreviewTimestamp returns Chinese display text or dash", () => {
  assert.match(formatPolicyPreviewTimestamp("2026-07-15T02:06:05.000Z"), /^2026-07-15 /);
  assert.equal(formatPolicyPreviewTimestamp(null), "--");
});

test("normalizeExternalPolicyUrl trims valid HTTP and HTTPS URLs", () => {
  assert.equal(
    policyPreview.normalizeExternalPolicyUrl?.("  https://example.com/policy?id=1  "),
    "https://example.com/policy?id=1",
  );
  assert.equal(
    policyPreview.normalizeExternalPolicyUrl?.("http://example.com/policy"),
    "http://example.com/policy",
  );
});

test("normalizeExternalPolicyUrl rejects unsafe or non-absolute URLs", () => {
  for (const value of [
    undefined,
    "",
    "   ",
    "/policy/1",
    "javascript:alert(1)",
    "mailto:policy@example.com",
  ]) {
    assert.equal(policyPreview.normalizeExternalPolicyUrl?.(value), null);
  }
});

test("getPolicyPreviewDetailSections trims fields without cross-section fallbacks", () => {
  assert.deepEqual(
    policyPreview.getPolicyPreviewDetailSections?.({
      aiInsight: "  AI 洞察  ",
      summary: "  后备摘要  ",
      detail: "  政策解读  ",
      content: "  政策原文  ",
    }),
    {
      aiSummary: "AI 洞察",
      interpretation: "政策解读",
      originalContent: "政策原文",
    },
  );

  assert.deepEqual(
    policyPreview.getPolicyPreviewDetailSections?.({
      aiInsight: "   ",
      summary: "  后备摘要  ",
      detail: "   ",
      content: "   ",
    }),
    {
      aiSummary: "后备摘要",
      interpretation: null,
      originalContent: null,
    },
  );
});
