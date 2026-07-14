import test from "node:test";
import assert from "node:assert/strict";
import {
  extractExaCandidateUrls,
  isGenericImageUrl,
  readConcurrency,
  shouldEnrichAvatarRecord,
  summarizeAvatarRecords,
  withRetries,
} from "../scripts/enrich-leader-avatars.mjs";

test("extractExaCandidateUrls reads and deduplicates Exa text URLs", () => {
  const result = {
    content: [
      {
        type: "text",
        text: [
          "Title: 示例人物",
          "URL: https://zh.wikipedia.org/wiki/%E7%A4%BA%E4%BE%8B",
          "URL: https://example.gov.cn/profile?id=1",
          "URL: https://example.gov.cn/profile?id=1",
          "URL: javascript:alert(1)",
        ].join("\n"),
      },
    ],
  };

  assert.deepEqual(extractExaCandidateUrls(result), [
    "https://zh.wikipedia.org/wiki/%E7%A4%BA%E4%BE%8B",
    "https://example.gov.cn/profile?id=1",
  ]);
});

test("summarizeAvatarRecords proves coverage and status counts", () => {
  const summary = summarizeAvatarRecords(
    [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ],
    {
      a: { status: "found", rejectedCandidates: 1 },
      b: { status: "not_found", rejectedCandidates: 2 },
      c: { status: "search_error", rejectedCandidates: 0 },
    },
  );

  assert.deepEqual(summary, {
    apiTotal: 3,
    snapshotCount: 3,
    found: 1,
    notFound: 1,
    searchError: 1,
    rejected: 3,
    missingIds: [],
    extraIds: [],
    coverageComplete: true,
  });
});

test("readConcurrency lets the CLI override the environment", () => {
  assert.equal(
    readConcurrency(["--concurrency", "12"], { AVATAR_CONCURRENCY: "6" }),
    12,
  );
  assert.equal(readConcurrency([], { AVATAR_CONCURRENCY: "6" }), 6);
  assert.equal(readConcurrency([], {}), 8);
});

test("withRetries recovers from a bounded transient failure", async () => {
  let attempts = 0;
  const result = await withRetries(
    async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary");
      return "ok";
    },
    { attempts: 2, delayMs: 0 },
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 2);
});

test("generic site artwork is rejected as a leader avatar", () => {
  assert.equal(isGenericImageUrl("https://www.gov.cn/images/150.jpg"), true);
  assert.equal(isGenericImageUrl("https://example.gov.cn/assets/site-logo.png"), true);
  assert.equal(isGenericImageUrl("https://www.csu.edu.cn/images/i-down1.png"), true);
  assert.equal(
    isGenericImageUrl("https://www.hnu.edu.cn/images/zhuangshi/zs_zh.jpg"),
    true,
  );
  assert.equal(
    isGenericImageUrl("https://example.gov.cn/people/zhang-san.jpg"),
    false,
  );
});

test("official records can be selectively retried without repeating all leaders", () => {
  assert.equal(
    shouldEnrichAvatarRecord(
      { status: "found", sourceType: "official" },
      { retryOfficial: true },
    ),
    true,
  );
  assert.equal(
    shouldEnrichAvatarRecord(
      { status: "found", sourceType: "scholar" },
      { retryOfficial: true },
    ),
    false,
  );
  assert.equal(
    shouldEnrichAvatarRecord({
      status: "found",
      sourceType: "backend",
      avatarUrl: "https://www.csu.edu.cn/images/i-down1.png",
    }),
    true,
  );
  assert.equal(
    shouldEnrichAvatarRecord({ status: "not_found", avatarUrl: null }),
    false,
  );
});
