import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTechFrontierPostParams,
  isTechFrontierFeedPost,
  mergeTechFrontierPostPages,
  normalizeTechFrontierPost,
  toDateTimeBoundary,
} from "../lib/tech-frontier-feed.ts";

test("normalizeTechFrontierPost maps X posts into card-ready items", () => {
  const item = normalizeTechFrontierPost({
    id: "social:x:1",
    platform: "x",
    external_post_id: "1",
    source_id: "twitter_ai_kol_international",
    source_category: null,
    title: null,
    author_username: "fchollet",
    author_display_name: "Francois Chollet",
    post_type: "post",
    content_text: "The Codex goal feature will take shortcuts.",
    post_url: "https://x.com/fchollet/status/1",
    published_at: "2026-05-20T05:28:29Z",
    crawled_at: "2026-05-20T08:02:35Z",
    like_count: 1200,
    reply_count: 34,
    repost_count: 56,
    quote_count: 7,
    view_count: 45000,
    bookmark_count: 99,
    read_count: 0,
    wow_count: 0,
    forward_count: 0,
    comment_count: 0,
    top_replies_count: 2,
  });

  assert.equal(item.platform, "x");
  assert.equal(item.platformLabel, "X");
  assert.equal(item.title, "The Codex goal feature will take shortcuts.");
  assert.equal(item.authorName, "Francois Chollet");
  assert.equal(item.date, "2026-05-20");
  assert.equal(item.engagementTotal, 1396);
});

test("normalizeTechFrontierPost preserves WeChat frontier cognition metadata", () => {
  const item = normalizeTechFrontierPost({
    id: "social:wechat_mp:abc",
    platform: "wechat_mp",
    external_post_id: "abc",
    source_id: "wechat_mp_1",
    source_category: "前沿认知",
    title: "ICML 2026 新范式",
    author_username: "机器之心",
    author_display_name: "机器之心",
    post_type: "post",
    content_text: "表格异常检测迈向 one-for-all。",
    post_url: "https://mp.weixin.qq.com/s/abc",
    published_at: "2026-05-20T05:58:32Z",
    crawled_at: "2026-05-20T06:21:18Z",
    like_count: 0,
    reply_count: 0,
    repost_count: 0,
    quote_count: 0,
    view_count: 0,
    bookmark_count: 0,
    read_count: 1280,
    wow_count: 8,
    forward_count: 12,
    comment_count: 5,
    top_replies_count: 0,
  });

  assert.equal(item.platform, "wechat_mp");
  assert.equal(item.platformLabel, "公众号");
  assert.equal(item.categoryLabel, "前沿认知");
  assert.equal(item.title, "ICML 2026 新范式");
  assert.equal(item.engagementTotal, 1305);
});

test("buildTechFrontierPostParams applies platform and date filters", () => {
  assert.equal(
    buildTechFrontierPostParams({
      platform: "x",
      keyword: "agent",
      dateFrom: "2026-05-01",
      dateTo: "2026-05-20",
      page: 2,
      pageSize: 20,
    }).toString(),
    "keyword=agent&date_from=2026-05-01T00%3A00%3A00Z&date_to=2026-05-20T23%3A59%3A59Z&sort_by=published_at&order=desc&page=2&page_size=20&platform=x",
  );

  assert.equal(
    buildTechFrontierPostParams({
      platform: "wechat_mp",
      page: 1,
      pageSize: 20,
    }).toString(),
    "sort_by=published_at&order=desc&page=1&page_size=20&platform=wechat_mp&source_category=%E5%89%8D%E6%B2%BF%E8%AE%A4%E7%9F%A5",
  );
});

test("isTechFrontierFeedPost keeps X and frontier cognition WeChat posts only", () => {
  assert.equal(
    isTechFrontierFeedPost({
      id: "social:x:1",
      platform: "x",
      external_post_id: "1",
      source_id: "twitter_ai_kol_international",
      author_username: "fchollet",
      post_type: "post",
    }),
    true,
  );
  assert.equal(
    isTechFrontierFeedPost({
      id: "social:wechat_mp:1",
      platform: "wechat_mp",
      external_post_id: "1",
      source_id: "wechat_mp_1",
      source_category: "前沿认知",
      author_username: "机器之心",
      post_type: "post",
    }),
    true,
  );
  assert.equal(
    isTechFrontierFeedPost({
      id: "social:wechat_mp:2",
      platform: "wechat_mp",
      external_post_id: "2",
      source_id: "wechat_mp_2",
      source_category: "高校资讯",
      author_username: "高校",
      post_type: "post",
    }),
    false,
  );
});

test("toDateTimeBoundary expands date-only values for backend filtering", () => {
  assert.equal(toDateTimeBoundary("2026-05-20", "start"), "2026-05-20T00:00:00Z");
  assert.equal(toDateTimeBoundary("2026-05-20", "end"), "2026-05-20T23:59:59Z");
  assert.equal(toDateTimeBoundary("", "start"), "");
});

test("mergeTechFrontierPostPages sorts mixed platform results and paginates", () => {
  const merged = mergeTechFrontierPostPages(
    [
      {
        id: "old-x",
        platform: "x",
        publishedAt: "2026-05-19T08:00:00Z",
      },
      {
        id: "new-x",
        platform: "x",
        publishedAt: "2026-05-20T08:00:00Z",
      },
    ],
    [
      {
        id: "mid-wechat",
        platform: "wechat_mp",
        publishedAt: "2026-05-20T06:00:00Z",
      },
    ],
    1,
    2,
  );

  assert.deepEqual(
    merged.items.map((item) => item.id),
    ["new-x", "mid-wechat"],
  );
  assert.equal(merged.total, 3);
  assert.equal(merged.totalPages, 2);
});
