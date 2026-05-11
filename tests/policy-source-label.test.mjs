import test from "node:test";
import assert from "node:assert/strict";

import {
  getPolicySourceId,
  getPolicySourceLabel,
} from "../lib/policy-source-label.ts";

test("policy source label prefers the real source name over the source id", () => {
  assert.equal(
    getPolicySourceLabel({
      source: "beijing_ywdt",
      sourceName: "首都之窗-要闻",
    }),
    "首都之窗-要闻",
  );
});

test("policy source id stays stable when a separate display name is present", () => {
  assert.equal(
    getPolicySourceId({
      source: "beijing_ywdt",
      sourceName: "首都之窗-要闻",
    }),
    "beijing_ywdt",
  );
});
