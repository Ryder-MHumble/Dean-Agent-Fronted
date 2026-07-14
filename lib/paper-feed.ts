import type {
  PaperAuthor,
  PaperCategory,
  PaperQuery,
  PaperRecord,
  PaperSource,
} from "./types/papers.ts";

interface PaperInput {
  paper_id?: string | null;
  id?: string | null;
  title?: string | null;
  abstract?: string | null;
  authors?: Array<string | PaperAuthor> | null;
  venue?: string | null;
  publication_date?: string | null;
  year?: number | string | null;
  url?: string | null;
  source_url?: string | null;
  doi?: string | null;
  arxiv_id?: string | null;
  source?: PaperSource | null;
  source_type?: string | null;
}

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
  if (keyword) params.set("keyword", keyword);

  params.set("page", String(Math.max(1, query.page ?? 1)));
  params.set(
    "page_size",
    String(Math.min(30, Math.max(1, query.pageSize ?? 20))),
  );
  params.set("sort_by", "publication_date");
  params.set("order", "desc");
  return params;
}

export function classifyPaper(paper: PaperInput): PaperCategory {
  const sourceId = normalizeLabel(paper.source?.source_id);
  const sourceType = normalizeLabel(
    paper.source?.source_type ?? paper.source_type,
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

function formatAuthor(author: string | PaperAuthor): string {
  if (typeof author === "string") return author.trim();
  return author.name?.trim() || author.author_name?.trim() || "";
}

export function normalizePaper(paper: PaperInput): PaperRecord {
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
    category: classifyPaper(paper),
    authorsText: authorsText || "作者信息待补充",
    venueText,
  };
}
