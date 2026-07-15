import type {
  PaperApiRecord,
  PaperCategory,
  PaperListResponse,
  PaperQuery,
  PaperRecord,
} from "./types/papers.ts";

const TOP_CONFERENCE_SOURCE_IDS = [
  "aaai",
  "acl_long",
  "acl_short",
  "acm_ec",
  "cvpr",
  "eccv",
  "emnlp_main",
  "iccv",
  "iclr",
  "icml",
  "ijcai",
  "kdd",
  "neurips",
  "pmlr",
  "rss",
] as const;

const TOP_JOURNAL_SOURCE_IDS = ["jair", "jmlr", "tmlr"] as const;

const CATEGORY_SOURCE_QUERIES: Partial<
  Record<PaperCategory, Array<Pick<PaperQuery, "sourceId" | "sourceName">>>
> = {
  "top-conference": TOP_CONFERENCE_SOURCE_IDS.map((sourceId) => ({ sourceId })),
  "top-journal": TOP_JOURNAL_SOURCE_IDS.map((sourceId) => ({ sourceId })),
  arxiv: [{ sourceName: "arxiv" }],
};

const TOP_CONFERENCES = new Set<string>(TOP_CONFERENCE_SOURCE_IDS);
const TOP_JOURNALS = new Set<string>(TOP_JOURNAL_SOURCE_IDS);

function normalizeLabel(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function getPaperTotalPages(
  response: Pick<PaperListResponse, "total" | "page_size">,
): number {
  return Math.max(
    1,
    Math.ceil(response.total / Math.max(1, response.page_size)),
  );
}

export function buildPaperQueryParams(
  query: PaperQuery = {},
): URLSearchParams {
  const params = new URLSearchParams();
  if (query.category === "achievements") {
    params.set("source_type", "academy_weekly_signature_achievements");
  } else {
    const sourceId = query.sourceId?.trim();
    if (sourceId) params.set("source_id", sourceId);
    const sourceName = query.sourceName?.trim();
    if (sourceName) params.set("source_name", sourceName);
  }

  const keyword = query.keyword?.trim();
  if (keyword) params.set("q", keyword);
  const dateFrom = query.dateFrom?.trim();
  if (dateFrom) params.set("date_from", dateFrom);
  const dateTo = query.dateTo?.trim();
  if (dateTo) params.set("date_to", dateTo);

  params.set("page", String(Math.max(1, query.page ?? 1)));
  params.set(
    "page_size",
    String(Math.min(30, Math.max(1, query.pageSize ?? 20))),
  );
  params.set("sort_by", "publication_date");
  params.set("order", "desc");
  return params;
}

export function getPaperCategorySourceQueries(
  category: PaperCategory,
): Array<Pick<PaperQuery, "sourceId" | "sourceName">> {
  return CATEGORY_SOURCE_QUERIES[category] ?? [];
}

function getPaperSortTime(paper: PaperApiRecord): number {
  const value =
    paper.publication_date || (paper.year ? `${paper.year}-01-01` : "");
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function mergePaperSampleResponses(
  responses: PaperListResponse[],
): PaperApiRecord[] {
  const byId = new Map<string, PaperApiRecord>();
  for (const response of responses) {
    for (const paper of response.items) {
      const key =
        paper.paper_id?.trim() ||
        paper.id?.trim() ||
        paper.doi?.trim() ||
        paper.title?.trim();
      if (key && !byId.has(key)) byId.set(key, paper);
    }
  }
  return [...byId.values()].sort(
    (left, right) => getPaperSortTime(right) - getPaperSortTime(left),
  );
}

export function classifyPaper(paper: PaperApiRecord): PaperCategory {
  const sourceId = normalizeLabel(paper.source?.source_id);
  const sourceType = normalizeLabel(
    paper.source?.type ?? paper.source?.source_type ?? paper.source_type,
  );
  const venue = normalizeLabel(paper.venue);

  if (sourceType === "academy_weekly_signature_achievements") {
    return "achievements";
  }
  if (sourceId === "arxiv" || venue === "corr" || Boolean(paper.arxiv_id)) {
    return "arxiv";
  }
  if (TOP_CONFERENCES.has(sourceId)) return "top-conference";
  if (TOP_JOURNALS.has(sourceId)) return "top-journal";
  return "all";
}

function formatAuthor(
  author: NonNullable<PaperApiRecord["authors"]>[number],
): string {
  if (typeof author === "string") return author.trim();
  return author.name?.trim() || author.author_name?.trim() || "";
}

export function normalizePaper(paper: PaperApiRecord): PaperRecord {
  const authors = paper.authors ?? [];
  const authorsText = authors.map(formatAuthor).filter(Boolean).join("、");
  const venueText =
    paper.venue?.trim() ||
    paper.source?.name?.trim() ||
    paper.source?.source_id?.trim() ||
    "来源待补充";

  return {
    ...paper,
    paper_id: paper.paper_id?.trim() || paper.id?.trim() || "",
    title: paper.title?.trim() || "未命名论文",
    authors,
    source: paper.source ?? {},
    year: paper.venue_year ?? paper.year,
    sourceUrl:
      paper.detail_url ??
      paper.source?.detail_url ??
      paper.source_url ??
      paper.url ??
      paper.source?.url ??
      null,
    pdfUrl: paper.pdf_url ?? paper.source?.pdf_url ?? null,
    category: classifyPaper(paper),
    authorsText: authorsText || "作者信息待补充",
    venueText,
  };
}
