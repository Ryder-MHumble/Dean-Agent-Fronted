import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import type {
  PersonnelEnrichedFeedResponse,
  PersonnelEnrichedStatsResponse,
} from "@/lib/types/personnel-intel";
import { fetchWithTimeout } from "@/lib/fetch-timeout";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.1.132.21:8001"
).replace(/\/+$/, "");

function resolveAcademicApiBase(rawBase: string): string {
  const normalized = rawBase.replace(/\/+$/, "");
  if (normalized.endsWith("/academic-monitor")) return normalized;
  if (normalized.endsWith("/academic-monitor/api")) {
    return normalized.slice(0, -"/api".length);
  }
  if (normalized.endsWith("/api")) {
    return `${normalized.slice(0, -"/api".length)}/academic-monitor`;
  }
  return `${normalized}/academic-monitor`;
}

const ACADEMIC_API_BASE = resolveAcademicApiBase(API_BASE);

// ── Policy ────────────────────────────────────────────────

/** Response shape from GET /api/intel/policy/feed */
export interface PolicyFeedResponse {
  generated_at: string | null;
  item_count: number;
  items: PolicyFeedItem[];
}

export interface PolicyFeedQuery {
  category?: string;
  importance?: string;
  minMatchScore?: number;
  keyword?: string;
  sourceIds?: string[];
  limit?: number;
  offset?: number;
}

interface SourceBrief {
  id: string;
  name: string;
}

/**
 * Fetch a policy intelligence feed page from the backend API.
 * Returns null if the request fails (caller handles fallback).
 */
export async function fetchPolicyFeed(
  params: PolicyFeedQuery | number = {},
): Promise<PolicyFeedResponse | null> {
  try {
    const query = typeof params === "number" ? { limit: params } : params;
    const sp = new URLSearchParams();
    if (query.category && query.category !== "全部")
      sp.set("category", query.category);
    if (query.importance) sp.set("importance", query.importance);
    if (query.minMatchScore != null)
      sp.set("min_match_score", String(query.minMatchScore));
    if (query.keyword?.trim()) sp.set("keyword", query.keyword.trim());
    if (query.sourceIds?.length) sp.set("source_ids", query.sourceIds.join(","));
    sp.set("limit", String(Math.min(200, Math.max(1, query.limit ?? 50))));
    sp.set("offset", String(Math.max(0, query.offset ?? 0)));

    const res = await fetchWithTimeout(`${API_BASE}/api/intel/policy/feed?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PolicyFeedResponse;
  } catch {
    return null;
  }
}

export async function fetchPolicySourceNameMap(): Promise<Record<string, string>> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/sources?dimensions=beijing_policy,national_policy`,
      { cache: "no-store" },
    );
    if (!res.ok) return {};

    const items = (await res.json()) as SourceBrief[];
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item?.id && item?.name) {
        map[item.id] = item.name;
      }
    }
    return map;
  } catch {
    return {};
  }
}

// ── Personnel ─────────────────────────────────────────────

export interface PersonnelEnrichedFeedQuery {
  group?: string;
  importance?: string;
  minRelevance?: number;
  keyword?: string;
  sourceIds?: string[];
  limit?: number;
  offset?: number;
}

export async function fetchPersonnelEnrichedFeed(
  params: PersonnelEnrichedFeedQuery = {},
): Promise<PersonnelEnrichedFeedResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params.group) sp.set("group", params.group);
    if (params.importance) sp.set("importance", params.importance);
    if (params.minRelevance != null)
      sp.set("min_relevance", String(params.minRelevance));
    if (params.keyword?.trim()) sp.set("keyword", params.keyword.trim());
    if (params.sourceIds?.length) {
      sp.set("source_ids", params.sourceIds.join(","));
    }
    sp.set("limit", String(Math.min(200, Math.max(1, params.limit ?? 50))));
    sp.set("offset", String(Math.max(0, params.offset ?? 0)));
    const res = await fetchWithTimeout(`${API_BASE}/api/intel/personnel/enriched-feed?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PersonnelEnrichedFeedResponse;
  } catch {
    return null;
  }
}

// ── Daily Briefing ────────────────────────────────────────

import type { BriefingSegment } from "@/components/home/ai-daily-summary";
import type { MetricCardData } from "@/components/home/aggregated-metric-cards";

/** Response shape from GET /api/intel/daily-briefing/report */
export interface DailyBriefingResponse {
  generated_at: string;
  date: string;
  paragraphs: BriefingSegment[][];
  metric_cards: MetricCardData[];
  summary: string | null;
  article_count: number;
  dimension_counts: Record<string, number>;
}

export async function fetchDailyBriefing(): Promise<DailyBriefingResponse | null> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/intel/daily-briefing/report`,
      {
        cache: "no-store",
        timeoutMs: 8000,
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as DailyBriefingResponse;
  } catch {
    return null;
  }
}

// ── Personnel (cont.) ────────────────────────────────────

export async function fetchPersonnelEnrichedStats(): Promise<PersonnelEnrichedStatsResponse | null> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/intel/personnel/enriched-stats`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as PersonnelEnrichedStatsResponse;
  } catch {
    return null;
  }
}

// ── University Ecosystem ─────────────────────────────────

import type {
  UniversityOverviewResponse,
  UniversityFeedResponse,
  UniversityArticleDetailResponse,
  UniversitySourcesResponse,
  ResearchOutputsResponse,
} from "@/lib/types/university-eco";

export async function fetchUniversityOverview(): Promise<UniversityOverviewResponse | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/intel/university/overview`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as UniversityOverviewResponse;
  } catch {
    return null;
  }
}

export async function fetchUniversityFeed(params?: {
  group?: string;
  keyword?: string;
  sourceIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<UniversityFeedResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.group) sp.set("group", params.group);
    if (params?.keyword) sp.set("keyword", params.keyword);
    if (params?.sourceIds?.length) {
      sp.set("source_ids", params.sourceIds.join(","));
    }
    if (params?.dateFrom) sp.set("date_from", params.dateFrom);
    if (params?.dateTo) sp.set("date_to", params.dateTo);
    sp.set("page", String(params?.page ?? 1));
    sp.set("page_size", String(params?.pageSize ?? 20));
    const res = await fetchWithTimeout(`${API_BASE}/api/intel/university/feed?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as UniversityFeedResponse;
  } catch {
    return null;
  }
}

export async function fetchUniversitySources(params?: {
  group?: string;
}): Promise<UniversitySourcesResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.group) sp.set("group", params.group);
    const suffix = sp.toString();
    const res = await fetchWithTimeout(
      `${API_BASE}/api/intel/university/sources${suffix ? `?${suffix}` : ""}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as UniversitySourcesResponse;
  } catch {
    return null;
  }
}

export async function fetchUniversityArticle(
  urlHash: string,
): Promise<UniversityArticleDetailResponse | null> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/intel/university/article/${urlHash}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as UniversityArticleDetailResponse;
  } catch {
    return null;
  }
}

export async function fetchUniversityResearch(params?: {
  type?: string;
  influence?: string;
  page?: number;
  pageSize?: number;
}): Promise<ResearchOutputsResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.type) sp.set("type", params.type);
    if (params?.influence) sp.set("influence", params.influence);
    sp.set("page", String(params?.page ?? 1));
    sp.set("page_size", String(params?.pageSize ?? 20));
    const res = await fetchWithTimeout(
      `${API_BASE}/api/intel/university/research?${sp}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as ResearchOutputsResponse;
  } catch {
    return null;
  }
}

// ── Sentiment Monitoring ─────────────────────────────────

import type {
  SentimentOverview,
  SentimentFeedResponse,
  SentimentContentDetail,
  AcademicStudentSummary,
  AcademicStudentsResponse,
  AcademicStudentPapersResponse,
  AcademicPaperUpsertPayload,
  AcademicPaperCompliancePayload,
} from "@/lib/types/internal-mgmt";

export async function fetchSentimentOverview(): Promise<SentimentOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sentiment/overview`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as SentimentOverview;
  } catch {
    return null;
  }
}

export async function fetchSentimentFeed(params?: {
  platform?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}): Promise<SentimentFeedResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.platform) sp.set("platform", params.platform);
    if (params?.keyword) sp.set("keyword", params.keyword);
    if (params?.sortBy) sp.set("sort_by", params.sortBy);
    if (params?.sortOrder) sp.set("sort_order", params.sortOrder);
    sp.set("page", String(params?.page ?? 1));
    sp.set("page_size", String(params?.pageSize ?? 20));
    const res = await fetch(`${API_BASE}/api/sentiment/feed?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as SentimentFeedResponse;
  } catch {
    return null;
  }
}

export async function fetchSentimentContentDetail(
  contentId: string,
): Promise<SentimentContentDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/sentiment/content/${contentId}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as SentimentContentDetail;
  } catch {
    return null;
  }
}

// ── Academic Monitor (Student Management) ─────────────────

export async function fetchAcademicStudents(
  keyword?: string,
  page = 1,
  pageSize = 20,
): Promise<AcademicStudentsResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (keyword?.trim()) sp.set("keyword", keyword.trim());
    sp.set("page", String(page));
    sp.set("page_size", String(pageSize));
    const suffix = sp.toString();
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students${suffix ? `?${suffix}` : ""}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as AcademicStudentsResponse;
  } catch {
    return null;
  }
}

export async function fetchAcademicStudentPapers(
  targetKey: string,
): Promise<AcademicStudentPapersResponse | null> {
  try {
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students/${encodeURIComponent(targetKey)}/papers`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as AcademicStudentPapersResponse;
  } catch {
    return null;
  }
}

export async function createAcademicPaper(
  targetKey: string,
  payload: AcademicPaperUpsertPayload,
): Promise<{ status: string; paper_uid: string } | null> {
  try {
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students/${encodeURIComponent(targetKey)}/papers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as { status: string; paper_uid: string };
  } catch {
    return null;
  }
}

export async function updateAcademicPaper(
  targetKey: string,
  paperUid: string,
  payload: AcademicPaperUpsertPayload,
): Promise<{ status: string; paper_uid: string } | null> {
  try {
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students/${encodeURIComponent(targetKey)}/papers/${encodeURIComponent(paperUid)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as { status: string; paper_uid: string };
  } catch {
    return null;
  }
}

export async function updateAcademicPaperCompliance(
  targetKey: string,
  paperUid: string,
  payload: AcademicPaperCompliancePayload,
): Promise<{ status: string; paper_uid: string } | null> {
  try {
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students/${encodeURIComponent(targetKey)}/papers/${encodeURIComponent(paperUid)}/compliance`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as { status: string; paper_uid: string };
  } catch {
    return null;
  }
}

export async function deleteAcademicPaper(
  targetKey: string,
  paperUid: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${ACADEMIC_API_BASE}/api/students/${encodeURIComponent(targetKey)}/papers/${encodeURIComponent(paperUid)}`,
      { method: "DELETE" },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// ── Institutions ─────────────────────────────────────────────

import type {
  InstitutionListResponse,
  InstitutionHierarchyResponse,
  InstitutionTaxonomyResponse,
  InstitutionDetail,
  InstitutionQueryParams,
} from "@/lib/types/institution";

/**
 * Fetch institutions with unified interface
 * @param params Query parameters
 * @returns Flat list or hierarchy structure based on view parameter
 */
export async function fetchInstitutions(
  params?: InstitutionQueryParams,
): Promise<InstitutionListResponse | InstitutionHierarchyResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.view) sp.set("view", params.view);
    if (params?.entity_type) sp.set("entity_type", params.entity_type);
    if (params?.region) sp.set("region", params.region);
    if (params?.org_type) sp.set("org_type", params.org_type);
    if (params?.classification) sp.set("classification", params.classification);
    if (params?.sub_classification)
      sp.set("sub_classification", params.sub_classification);
    if (params?.keyword) sp.set("keyword", params.keyword);
    sp.set("page", String(params?.page ?? 1));
    sp.set("page_size", String(params?.page_size ?? 20));

    const res = await fetch(`${API_BASE}/api/institutions?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as
      | InstitutionListResponse
      | InstitutionHierarchyResponse;
  } catch {
    return null;
  }
}

/**
 * Fetch institution taxonomy (classification hierarchy with counts)
 */
export async function fetchInstitutionTaxonomy(): Promise<InstitutionTaxonomyResponse | null> {
  try {
    const candidates = [
      `${API_BASE}/api/institutions/taxonomy`,
      `${API_BASE}/api/institutions/taxonomy/v2`,
    ];
    for (const url of candidates) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      return (await res.json()) as InstitutionTaxonomyResponse;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch single institution detail
 */
export async function fetchInstitutionDetail(
  institutionId: string,
): Promise<InstitutionDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/institutions/${institutionId}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as InstitutionDetail;
  } catch {
    return null;
  }
}
