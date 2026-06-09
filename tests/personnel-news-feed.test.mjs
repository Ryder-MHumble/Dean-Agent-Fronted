import test from "node:test";
import assert from "node:assert/strict";

import {
  OFFICIAL_PERSONNEL_NEWS_SOURCE_IDS,
  buildPersonnelNewsFeedQuery,
} from "../lib/personnel-news-feed.ts";

test("personnel news feed does not restrict sources by default", () => {
  const query = buildPersonnelNewsFeedQuery({
    keyword: " 国务院 ",
    limit: 300,
    offset: -10,
  });

  assert.equal(query.sourceIds, undefined);
  assert.equal(query.keyword, "国务院");
  assert.equal(query.limit, 200);
  assert.equal(query.offset, 0);
});

test("personnel news feed preserves explicit source filters", () => {
  const query = buildPersonnelNewsFeedQuery({
    sourceIds: OFFICIAL_PERSONNEL_NEWS_SOURCE_IDS,
  });

  assert.deepEqual(query.sourceIds, OFFICIAL_PERSONNEL_NEWS_SOURCE_IDS);
});
