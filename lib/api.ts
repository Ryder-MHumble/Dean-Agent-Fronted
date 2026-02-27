import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import type {
  PersonnelEnrichedFeedResponse,
  PersonnelEnrichedStatsResponse,
} from "@/lib/types/personnel-intel";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ── Policy ────────────────────────────────────────────────

/** Response shape from GET /api/v1/intel/policy/feed */
export interface PolicyFeedResponse {
  generated_at: string | null;
  item_count: number;
  items: PolicyFeedItem[];
}

/**
 * Fetch the full policy intelligence feed from the backend API.
 * Returns null if the request fails (caller handles fallback).
 */
export async function fetchPolicyFeed(): Promise<PolicyFeedResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/intel/policy/feed?limit=200`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PolicyFeedResponse;
  } catch {
    return null;
  }
}

// ── Personnel ─────────────────────────────────────────────

export async function fetchPersonnelEnrichedFeed(): Promise<PersonnelEnrichedFeedResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/intel/personnel/enriched-feed?limit=200`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as PersonnelEnrichedFeedResponse;
  } catch {
    return null;
  }
}

// ── Daily Briefing ────────────────────────────────────────

import type { BriefingSegment } from "@/components/home/ai-daily-summary";
import type { MetricCardData } from "@/components/home/aggregated-metric-cards";

/** Response shape from GET /api/v1/intel/daily-briefing/report */
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
    const res = await fetch(`${API_BASE}/api/v1/intel/daily-briefing/report`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as DailyBriefingResponse;
  } catch {
    return null;
  }
}

// ── Personnel (cont.) ────────────────────────────────────

export async function fetchPersonnelEnrichedStats(): Promise<PersonnelEnrichedStatsResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/intel/personnel/enriched-stats`,
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
  ResearchOutputsResponse,
} from "@/lib/types/university-eco";

export async function fetchUniversityOverview(): Promise<UniversityOverviewResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/intel/university/overview`, {
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
  page?: number;
  pageSize?: number;
}): Promise<UniversityFeedResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.group) sp.set("group", params.group);
    if (params?.keyword) sp.set("keyword", params.keyword);
    sp.set("page", String(params?.page ?? 1));
    sp.set("page_size", String(params?.pageSize ?? 200));
    const res = await fetch(`${API_BASE}/api/v1/intel/university/feed?${sp}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as UniversityFeedResponse;
  } catch {
    return null;
  }
}

export async function fetchUniversityArticle(
  urlHash: string,
): Promise<UniversityArticleDetailResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/intel/university/article/${urlHash}`,
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
    sp.set("page_size", String(params?.pageSize ?? 200));
    const res = await fetch(
      `${API_BASE}/api/v1/intel/university/research?${sp}`,
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
} from "@/lib/types/internal-mgmt";

export async function fetchSentimentOverview(): Promise<SentimentOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/sentiment/overview`, {
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
    const res = await fetch(`${API_BASE}/api/v1/sentiment/feed?${sp}`, {
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
      `${API_BASE}/api/v1/sentiment/content/${contentId}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as SentimentContentDetail;
  } catch {
    return null;
  }
}
