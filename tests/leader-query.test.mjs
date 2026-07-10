import test from "node:test";
import assert from "node:assert/strict";

import { buildLeaderQueryParams } from "../lib/leader-query.ts";

test("buildLeaderQueryParams trims filters and clamps pagination", () => {
  const params = buildLeaderQueryParams({
    keyword: "  张三  ",
    organization: " 科学技术部 ",
    domain: "government",
    status: "current",
    limit: 500,
    offset: -3,
  });

  assert.equal(params.toString(), "keyword=%E5%BC%A0%E4%B8%89&organization=%E7%A7%91%E5%AD%A6%E6%8A%80%E6%9C%AF%E9%83%A8&domain=government&status=current&limit=200&offset=0");
});
