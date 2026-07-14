export type TechFrontierPostPlatform = "x" | "wechat_mp";
export type TechFrontierPlatformFilter = "all" | TechFrontierPostPlatform;

export interface PaginatedTechFrontierPosts {
  items: TechFrontierPostItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SocialPostBrief {
  id: string;
  platform: string;
  external_post_id: string;
  source_id: string;
  source_category?: string | null;
  title?: string | null;
  author_username: string;
  author_display_name?: string | null;
  post_type: string;
  content_text?: string | null;
  post_url?: string | null;
  published_at?: string | null;
  crawled_at?: string | null;
  like_count?: number;
  reply_count?: number;
  repost_count?: number;
  quote_count?: number;
  view_count?: number;
  bookmark_count?: number;
  read_count?: number;
  wow_count?: number;
  forward_count?: number;
  comment_count?: number;
  top_replies_count?: number;
  raw_payload?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

export interface SocialPostDetail extends SocialPostBrief {
  content_html?: string | null;
  comments?: unknown[];
  top_replies?: SocialPostBrief[];
  raw_payload?: Record<string, unknown>;
}

export interface TechFrontierPostItem {
  id: string;
  platform: TechFrontierPostPlatform;
  platformLabel: string;
  title: string;
  summary: string;
  content: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string | null;
  postType: string;
  postTypeLabel: string;
  sourceId: string;
  sourceCategory?: string | null;
  categoryLabel: string;
  sourceUrl?: string | null;
  date: string;
  publishedAt?: string | null;
  crawledAt?: string | null;
  engagementTotal: number;
  metrics: {
    views: number;
    likes: number;
    replies: number;
    reposts: number;
    quotes: number;
    bookmarks: number;
    reads: number;
    wows: number;
    forwards: number;
    comments: number;
  };
}

export interface TechFrontierPostQuery {
  platform?: TechFrontierPlatformFilter;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

const PLATFORM_LABELS: Record<TechFrontierPostPlatform, string> = {
  x: "X",
  wechat_mp: "公众号",
};

const POST_TYPE_LABELS: Record<string, string> = {
  post: "原帖",
  reply: "回复",
  repost: "转发",
  quote: "引用",
  comment: "评论",
};

function asPlatform(value: string): TechFrontierPostPlatform {
  return value === "wechat_mp" ? "wechat_mp" : "x";
}

function toNumber(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function compactText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function getPostTitle(post: SocialPostBrief): string {
  const explicitTitle = post.title?.trim();
  if (explicitTitle) return explicitTitle;

  const content = post.content_text?.trim();
  if (content) return compactText(content, 96);

  return "未命名动态";
}

function getPostDate(post: SocialPostBrief): string {
  return (post.published_at || post.crawled_at || "").slice(0, 10);
}

function getNestedString(value: unknown, path: string[]): string | null {
  let current = value;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" && current.trim() ? current.trim() : null;
}

function getAuthorAvatarUrl(post: SocialPostBrief): string | null {
  const candidates = [
    getNestedString(post.raw_payload, ["author", "profilePicture"]),
    getNestedString(post.raw_payload, ["author", "profile_image_url_https"]),
    getNestedString(post.raw_payload, ["author", "profile_image_url"]),
    getNestedString(post.raw_payload, ["user", "profilePicture"]),
    getNestedString(post.raw_payload, [
      "core",
      "user_results",
      "result",
      "legacy",
      "profile_image_url_https",
    ]),
    getNestedString(post.extra, ["author", "profilePicture"]),
    getNestedString(post.extra, ["profilePicture"]),
  ];

  return candidates.find((candidate) => candidate !== null) ?? null;
}

export function toDateTimeBoundary(
  value: string,
  boundary: "start" | "end",
): string {
  const date = value.trim();
  if (!date) return "";
  if (date.includes("T")) return date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return boundary === "start" ? `${date}T00:00:00Z` : `${date}T23:59:59Z`;
}

export function buildTechFrontierPostParams(
  query: TechFrontierPostQuery = {},
): URLSearchParams {
  const params = new URLSearchParams();
  const keyword = query.keyword?.trim();
  if (keyword) params.set("keyword", keyword);

  const dateFrom = toDateTimeBoundary(query.dateFrom ?? "", "start");
  const dateTo = toDateTimeBoundary(query.dateTo ?? "", "end");
  if (dateFrom) params.set("date_from", dateFrom);
  if (dateTo) params.set("date_to", dateTo);

  params.set("sort_by", "published_at");
  params.set("order", "desc");
  params.set("page", String(Math.max(1, query.page ?? 1)));
  params.set(
    "page_size",
    String(Math.min(200, Math.max(1, query.pageSize ?? 20))),
  );

  if (query.platform === "x") {
    params.set("platform", "x");
  }

  if (query.platform === "wechat_mp") {
    params.set("platform", "wechat_mp");
    params.set("source_category", "前沿认知");
  }

  return params;
}

export function isTechFrontierFeedPost(post: SocialPostBrief): boolean {
  return (
    post.platform === "x" ||
    (post.platform === "wechat_mp" &&
      post.source_category?.trim() === "前沿认知")
  );
}

export function normalizeTechFrontierPost(
  post: SocialPostBrief,
): TechFrontierPostItem {
  const platform = asPlatform(post.platform);
  const content = post.content_text?.trim() || post.title?.trim() || "";
  const likes = toNumber(post.like_count);
  const replies = toNumber(post.reply_count);
  const reposts = toNumber(post.repost_count);
  const quotes = toNumber(post.quote_count);
  const bookmarks = toNumber(post.bookmark_count);
  const reads = toNumber(post.read_count);
  const wows = toNumber(post.wow_count);
  const forwards = toNumber(post.forward_count);
  const comments = toNumber(post.comment_count);

  const engagementTotal =
    platform === "wechat_mp"
      ? reads + likes + wows + forwards + comments
      : likes + replies + reposts + quotes + bookmarks;

  return {
    id: post.id,
    platform,
    platformLabel: PLATFORM_LABELS[platform],
    title: getPostTitle(post),
    summary: compactText(content || getPostTitle(post), 220),
    content: content || getPostTitle(post),
    authorName: post.author_display_name?.trim() || post.author_username,
    authorHandle: post.author_username,
    authorAvatarUrl: getAuthorAvatarUrl(post),
    postType: post.post_type,
    postTypeLabel: POST_TYPE_LABELS[post.post_type] ?? post.post_type,
    sourceId: post.source_id,
    sourceCategory: post.source_category,
    categoryLabel:
      platform === "wechat_mp"
        ? post.source_category || "前沿认知"
        : post.source_category || "社媒情报",
    sourceUrl: post.post_url,
    date: getPostDate(post),
    publishedAt: post.published_at,
    crawledAt: post.crawled_at,
    engagementTotal,
    metrics: {
      views: toNumber(post.view_count),
      likes,
      replies,
      reposts,
      quotes,
      bookmarks,
      reads,
      wows,
      forwards,
      comments,
    },
  };
}

export async function collectTechFrontierPostPages(
  fetchPage: (page: number) => Promise<{ items: SocialPostBrief[] } | null>,
  pageSize: number,
  maxOffset = Number.POSITIVE_INFINITY,
): Promise<TechFrontierPostItem[] | null> {
  const collected: TechFrontierPostItem[] = [];
  const seenIds = new Set<string>();
  const seenPages = new Set<string>();
  let page = 1;

  while (true) {
    const data = await fetchPage(page);
    if (!data) return page === 1 ? null : collected;
    if (data.items.length === 0) break;

    const pageIdentity = `${data.items[0]?.id ?? ""}|${data.items.at(-1)?.id ?? ""}`;
    if (seenPages.has(pageIdentity)) break;
    seenPages.add(pageIdentity);

    for (const post of data.items) {
      if (!isTechFrontierFeedPost(post) || seenIds.has(post.id)) continue;
      seenIds.add(post.id);
      collected.push(normalizeTechFrontierPost(post));
    }

    if (data.items.length < pageSize) break;
    if (page * pageSize > maxOffset) break;
    page += 1;
  }

  return collected;
}

function getSortTime(
  item: Pick<TechFrontierPostItem, "publishedAt" | "crawledAt">,
) {
  return new Date(item.publishedAt || item.crawledAt || 0).getTime();
}

export function mergeTechFrontierPostPages(
  xItems: TechFrontierPostItem[],
  wechatItems: TechFrontierPostItem[],
  page: number,
  pageSize: number,
): PaginatedTechFrontierPosts {
  const merged = [...xItems, ...wechatItems].sort(
    (a, b) => getSortTime(b) - getSortTime(a),
  );
  const safePageSize = Math.max(1, pageSize);
  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: merged.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

export function summarizeTechFrontierPlatformFeed(
  xItems: TechFrontierPostItem[],
  wechatItems: TechFrontierPostItem[],
  page: number,
  pageSize: number,
) {
  const pageData = mergeTechFrontierPostPages(
    xItems,
    wechatItems,
    page,
    pageSize,
  );

  return {
    ...pageData,
    platformTotals: {
      all: xItems.length + wechatItems.length,
      x: xItems.length,
      wechat_mp: wechatItems.length,
    } satisfies Record<TechFrontierPlatformFilter, number>,
  };
}
