import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  collectTechFrontierPostWindow,
  collectTechFrontierPostPages,
  buildTechFrontierPostParams,
  isTechFrontierFeedPost,
  mergeTechFrontierPostPages,
  normalizeTechFrontierDisplayText,
  normalizeTechFrontierPost,
  summarizeTechFrontierPlatformFeed,
  toDateTimeBoundary,
} from "../lib/tech-frontier-feed.ts";

test("social display text converts escaped whitespace", () => {
  assert.equal(
    normalizeTechFrontierDisplayText("第一段\\r\\n第二段\\n\\t第三段"),
    "第一段\n第二段\n\t第三段",
  );
  assert.equal(normalizeTechFrontierDisplayText(null), "");
});

test("collectTechFrontierPostPages keeps loaded rows when the backend rejects the terminal page", async () => {
  const pages = [
    {
      items: [
        {
          id: "x-1",
          platform: "x",
          post_type: "tweet",
          source_id: "x",
          author_username: "author",
          content_text: "first",
        },
        {
          id: "x-2",
          platform: "x",
          post_type: "tweet",
          source_id: "x",
          author_username: "author",
          content_text: "second",
        },
      ],
    },
    null,
  ];

  const result = await collectTechFrontierPostPages(
    async (page) => pages[page - 1] ?? null,
    2,
  );

  assert.deepEqual(
    result?.map((item) => item.id),
    ["x-1", "x-2"],
  );
});

test("collectTechFrontierPostPages reports an unavailable first page", async () => {
  const result = await collectTechFrontierPostPages(async () => null, 200);

  assert.equal(result, null);
});

test("collectTechFrontierPostPages stops before the backend maximum offset", async () => {
  const requestedPages = [];
  const result = await collectTechFrontierPostPages(
    async (page) => {
      requestedPages.push(page);
      if (page > 2) return null;
      return {
        items: [
          {
            id: `x-${page}-1`,
            platform: "x",
            post_type: "tweet",
            source_id: "x",
            author_username: "author",
            content_text: "first",
          },
          {
            id: `x-${page}-2`,
            platform: "x",
            post_type: "tweet",
            source_id: "x",
            author_username: "author",
            content_text: "second",
          },
        ],
      };
    },
    2,
    2,
  );

  assert.deepEqual(requestedPages, [1, 2]);
  assert.equal(result?.length, 4);
});

test("collectTechFrontierPostPages stops after page one has enough filtered rows", async () => {
  const requestedPages = [];
  const result = await collectTechFrontierPostPages(
    async (page) => {
      requestedPages.push(page);
      return {
        items: Array.from({ length: 20 }, (_, index) => ({
          id: `x-${page}-${index}`,
          platform: "x",
          post_type: "tweet",
          source_id: "x",
          author_username: "author",
          content_text: `post ${index}`,
        })),
      };
    },
    20,
    2000,
    20,
  );

  assert.deepEqual(requestedPages, [1]);
  assert.equal(result?.length, 20);
});

test("collectTechFrontierPostWindow preserves the backend next-page signal", async () => {
  const requestedPages = [];
  const result = await collectTechFrontierPostWindow(
    async (page) => {
      requestedPages.push(page);
      return {
        total: 21,
        total_pages: 2,
        items: Array.from({ length: 20 }, (_, index) => ({
          id: `x-${index}`,
          platform: "x",
          post_type: "tweet",
          source_id: "x",
          author_username: "author",
          content_text: `post ${index}`,
        })),
      };
    },
    20,
    2000,
    20,
  );

  assert.deepEqual(requestedPages, [1]);
  assert.equal(result?.items.length, 20);
  assert.equal(result?.reportedTotal, 21);
  assert.equal(result?.hasMore, true);
});

test("collectTechFrontierPostWindow does not expose pages beyond the loaded window", async () => {
  const result = await collectTechFrontierPostWindow(
    async () => ({
      total: 5000,
      total_pages: 250,
      items: Array.from({ length: 20 }, (_, index) => ({
        id: `x-${index}`,
        platform: "x",
        post_type: "tweet",
        source_id: "x",
        author_username: "author",
        content_text: `post ${index}`,
      })),
    }),
    20,
    2000,
    20,
  );

  assert.equal(result?.reportedTotal, 21);
  assert.equal(result?.hasMore, true);
});

test("collectTechFrontierPostWindow closes pagination at the maximum offset", async () => {
  const requestedPages = [];
  const result = await collectTechFrontierPostWindow(
    async (page) => {
      requestedPages.push(page);
      return {
        total: 5000,
        total_pages: 250,
        items: Array.from({ length: 20 }, (_, index) => ({
          id: `x-${page}-${index}`,
          platform: "x",
          post_type: "tweet",
          source_id: "x",
          author_username: "author",
          content_text: `post ${index}`,
        })),
      };
    },
    20,
    40,
  );

  assert.deepEqual(requestedPages, [1, 2, 3]);
  assert.equal(result?.items.length, 60);
  assert.equal(result?.reportedTotal, 60);
  assert.equal(result?.hasMore, false);
});

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
    raw_payload: {
      author: {
        profilePicture:
          "https://pbs.twimg.com/profile_images/1816185267037859840/Fd18CH0v_normal.jpg",
      },
    },
  });

  assert.equal(item.platform, "x");
  assert.equal(item.platformLabel, "X");
  assert.equal(item.title, "The Codex goal feature will take shortcuts.");
  assert.equal(item.authorName, "Francois Chollet");
  assert.equal(
    item.authorAvatarUrl,
    "https://pbs.twimg.com/profile_images/1816185267037859840/Fd18CH0v_normal.jpg",
  );
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
  assert.equal(
    toDateTimeBoundary("2026-05-20", "start"),
    "2026-05-20T00:00:00Z",
  );
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

test("summarizeTechFrontierPlatformFeed counts loaded platform rows instead of backend estimates", () => {
  const xItems = Array.from({ length: 21 }, (_, index) => ({
    id: `x-${index}`,
    platform: "x",
    publishedAt: `2026-05-${String(20 - Math.floor(index / 2)).padStart(2, "0")}T08:00:00Z`,
  }));
  const wechatItems = Array.from({ length: 23 }, (_, index) => ({
    id: `wechat-${index}`,
    platform: "wechat_mp",
    publishedAt: `2026-05-${String(20 - Math.floor(index / 2)).padStart(2, "0")}T06:00:00Z`,
  }));

  const summary = summarizeTechFrontierPlatformFeed(xItems, wechatItems, 2, 20);

  assert.deepEqual(summary.platformTotals, {
    all: 44,
    x: 21,
    wechat_mp: 23,
  });
  assert.equal(summary.total, 44);
  assert.equal(summary.totalPages, 3);
  assert.equal(summary.items.length, 20);
});

test("summarizeTechFrontierPlatformFeed keeps progressive totals navigable", () => {
  const xItems = Array.from({ length: 20 }, (_, index) => ({
    id: `x-${index}`,
    platform: "x",
    publishedAt: `2026-05-20T${String(20 - index).padStart(2, "0")}:00:00Z`,
  }));
  const wechatItems = Array.from({ length: 20 }, (_, index) => ({
    id: `wechat-${index}`,
    platform: "wechat_mp",
    publishedAt: `2026-05-19T${String(20 - index).padStart(2, "0")}:00:00Z`,
  }));

  const xOnly = summarizeTechFrontierPlatformFeed(xItems, [], 1, 20, {
    x: 21,
    wechat_mp: 0,
  });
  const combined = summarizeTechFrontierPlatformFeed(
    xItems,
    wechatItems,
    1,
    20,
    { x: 21, wechat_mp: 21 },
  );

  assert.equal(xOnly.total, 21);
  assert.equal(xOnly.totalPages, 2);
  assert.deepEqual(combined.platformTotals, {
    all: 42,
    x: 21,
    wechat_mp: 21,
  });
  assert.equal(combined.total, 42);
  assert.equal(combined.totalPages, 3);
});

test("tech frontier pagination labels progressive totals as estimates", () => {
  const paginationSource = readFileSync(
    new URL("../components/shared/feed-pagination.tsx", import.meta.url),
    "utf8",
  );
  const pageSource = readFileSync(
    new URL(
      "../components/modules/tech-frontier/tech-frontier-page.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(paginationSource, /totalIsEstimate/);
  assert.match(paginationSource, /至少/);
  assert.match(pageSource, /<FeedPagination[\s\S]*totalIsEstimate/);
});
