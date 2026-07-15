import type { PolicyFeedItem } from "@/lib/types/policy-intel";

export type PolicyPreviewSort = "latest" | "relevance" | "impact";

const IMPACT_WEIGHT: Record<string, number> = {
  紧急: 4,
  重要: 3,
  关注: 2,
  一般: 1,
};

export function getPolicyPreviewScore(item: Partial<PolicyFeedItem>): number {
  return item.matchScore ?? item.relevance ?? 0;
}

export function normalizeExternalPolicyUrl(value?: string): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return normalized;
  } catch {
    return null;
  }
}

export function getPolicyPreviewSelectedId(
  items: Array<Pick<PolicyFeedItem, "id">>,
  currentSelectedId: string | null,
  resetToFirst: boolean,
): string | null {
  if (resetToFirst) return items[0]?.id ?? null;
  if (currentSelectedId && items.some((item) => item.id === currentSelectedId)) {
    return currentSelectedId;
  }
  return items[0]?.id ?? null;
}

export function sortPolicyPreviewItems(
  items: PolicyFeedItem[],
  sort: PolicyPreviewSort,
): PolicyFeedItem[] {
  return [...items].sort((a, b) => {
    if (sort === "relevance") return getPolicyPreviewScore(b) - getPolicyPreviewScore(a);
    if (sort === "impact") return (IMPACT_WEIGHT[b.importance] ?? 0) - (IMPACT_WEIGHT[a.importance] ?? 0);
    return b.date.localeCompare(a.date);
  });
}

export function formatPolicyPreviewTimestamp(value: string | null): string {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replaceAll("/", "-");
}
