import test from "node:test";
import assert from "node:assert/strict";
import {
  getLeaderSummary,
  resolveLeaderAvatar,
} from "../lib/leader-display.ts";

test("getLeaderSummary prefers verified display text", () => {
  assert.equal(
    getLeaderSummary({
      leader_details: { text: "完整简介", summary: "短简介" },
    }),
    "完整简介",
  );
});

test("getLeaderSummary falls back to the concise summary", () => {
  assert.equal(
    getLeaderSummary({ leader_details: { text: "  ", summary: "短简介" } }),
    "短简介",
  );
});

test("getLeaderSummary supports the nested LLM profile payload", () => {
  assert.equal(
    getLeaderSummary({
      leader_details: {
        raw: {
          llm_profile: {
            profile_text: "旧版完整简介",
            summary: "旧版短简介",
          },
        },
      },
    }),
    "旧版完整简介",
  );
});

test("resolveLeaderAvatar prefers backend media then generated mapping", () => {
  assert.equal(
    resolveLeaderAvatar(
      {
        id: "a",
        leader_details: {
          media: { avatar_url: "https://official/a.jpg" },
        },
      },
      { a: { avatarUrl: "https://fallback/a.jpg" } },
    ),
    "https://official/a.jpg",
  );
});

test("resolveLeaderAvatar uses the generated mapping when backend media is absent", () => {
  assert.equal(
    resolveLeaderAvatar(
      { id: "a" },
      { a: { avatarUrl: "https://fallback/a.jpg" } },
    ),
    "https://fallback/a.jpg",
  );
});
