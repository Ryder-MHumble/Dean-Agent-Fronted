import type {
  PaperApiRecord,
  PaperCategory,
  PaperListResponse,
  PaperQuery,
  PaperRecord,
} from "./types/papers.ts";

const CATEGORY_SOURCE_IDS: Partial<Record<PaperCategory, string>> = {
  "top-conference": "icml",
  "top-journal": "jmlr",
  arxiv: "arxiv",
};

const TOP_CONFERENCES = new Set([
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
]);

const TOP_JOURNALS = new Set(["jair", "jmlr", "tmlr"]);

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
    const sourceId =
      query.sourceId?.trim() || CATEGORY_SOURCE_IDS[query.category ?? "all"];
    if (sourceId) params.set("source_id", sourceId);
  }

  const keyword = query.keyword?.trim();
  if (keyword) params.set("q", keyword);

  params.set("page", String(Math.max(1, query.page ?? 1)));
  params.set(
    "page_size",
    String(Math.min(30, Math.max(1, query.pageSize ?? 20))),
  );
  params.set("sort_by", "publication_date");
  params.set("order", "desc");
  return params;
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
