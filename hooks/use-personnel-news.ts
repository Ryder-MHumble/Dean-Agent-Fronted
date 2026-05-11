"use client";

import { useState, useEffect, startTransition } from "react";
import type { PersonnelChangeItem } from "@/lib/types/personnel-intel";
import type {
  PersonnelNewsItem,
  PersonnelNewsCategory,
  ImportanceLevel,
  PersonProfile,
} from "@/lib/types/talent-radar";
import { fetchPersonnelEnrichedFeed } from "@/lib/api";
import type { PersonnelEnrichedFeedQuery } from "@/lib/api";
import {
  filterItemsByDateRange,
  hasActiveDateRange,
  paginateItems,
  type DateRangeValue,
} from "@/lib/feed-list-utils";

const MAX_BACKEND_PAGE_SIZE = 200;

// ── Category detection ────────────────────────────────────

const GOV_KEYWORDS = [
  "部",
  "委",
  "局",
  "厅",
  "办",
  "院",
  "发改",
  "科技",
  "教育",
  "基金",
  "国务院",
  "人社",
  "工信",
  "商务",
  "住建",
  "网信",
  "市监",
  "广播",
  "行政学院",
  "残联",
  "退役",
];

const UNI_KEYWORDS = ["大学", "学院", "研究院", "研究所", "学校"];

function detectCategory(item: PersonnelChangeItem): PersonnelNewsCategory {
  const text = `${item.department ?? ""} ${item.position} ${item.name} ${item.signals.join(" ")}`;
  if (UNI_KEYWORDS.some((kw) => text.includes(kw))) return "高校人事";
  if (GOV_KEYWORDS.some((kw) => text.includes(kw))) return "政府人事";
  return "人才要闻";
}

// ── Title generation ──────────────────────────────────────

function generateTitle(item: PersonnelChangeItem): string {
  if (item.action === "动态") {
    // Article-level item: note contains full title, name is truncated
    return item.note ?? item.name;
  }
  if (item.action === "任命") {
    return `${item.name}${item.action}${item.position}`;
  }
  // 免去
  return `${item.name}不再担任${item.position}`;
}

// ── Importance mapping ────────────────────────────────────

function mapImportance(imp: string): ImportanceLevel {
  if (imp === "紧急" || imp === "重要") return "重要";
  if (imp === "关注") return "关注";
  return "一般";
}

// ── Build PersonProfile ──────────────────────────────────

function buildProfile(item: PersonnelChangeItem): PersonProfile | undefined {
  if (!item.background && !item.department) return undefined;
  return {
    name: item.name,
    title: item.position,
    organization: item.department ?? "",
    background: item.background ?? undefined,
  };
}

// ── Transform ────────────────────────────────────────────

function transformToNewsItem(item: PersonnelChangeItem): PersonnelNewsItem {
  const isArticle = item.action === "动态";
  const summary = item.aiInsight ?? item.background ?? item.note ?? "";
  const relevanceNote = [item.note, item.actionSuggestion]
    .filter(Boolean)
    .join("。");

  return {
    id: item.id,
    title: generateTitle(item),
    summary,
    content: item.sourceContent ?? undefined,
    category: detectCategory(item),
    importance: mapImportance(item.importance),
    date: item.date,
    source: item.source_name ?? item.source,
    sourceUrl: item.sourceUrl ?? undefined,
    people: isArticle ? [] : [item.name],
    organizations: item.department ? [item.department] : [],
    personProfile: isArticle ? undefined : buildProfile(item),
    relevanceNote: relevanceNote || undefined,
  };
}

// ── Hook ──────────────────────────────────────────────────

interface UsePersonnelNewsResult {
  items: PersonnelNewsItem[];
  profiles: PersonProfile[];
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePersonnelNewsParams {
  category?: PersonnelNewsCategory | "全部";
  keyword?: string;
  page?: number;
  pageSize?: number;
  dateRange?: DateRangeValue;
}

function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}

async function fetchAllPersonnelItems(
  query: Omit<PersonnelEnrichedFeedQuery, "limit" | "offset">,
) {
  let offset = 0;
  let total = 0;
  let generatedAt: string | null = null;
  const items: PersonnelChangeItem[] = [];

  while (true) {
    const page = await fetchPersonnelEnrichedFeed({
      ...query,
      limit: MAX_BACKEND_PAGE_SIZE,
      offset,
    });
    if (!page) return null;

    if (generatedAt === null) generatedAt = page.generated_at;
    total = page.total_count;
    if (page.items.length === 0) break;

    items.push(...page.items);
    offset += page.items.length;
    if (offset >= total) break;
  }

  return { generatedAt, total, items };
}

export function usePersonnelNews(
  params?: UsePersonnelNewsParams,
): UsePersonnelNewsResult {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const [items, setItems] = useState<PersonnelNewsItem[]>([]);
  const [profiles, setProfiles] = useState<PersonProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const dateFrom = params?.dateRange?.from ?? "";
  const dateTo = params?.dateRange?.to ?? "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const query = {
        keyword: params?.keyword,
      } satisfies Omit<PersonnelEnrichedFeedQuery, "limit" | "offset">;
      const shouldFilterByDate = hasActiveDateRange({
        from: dateFrom,
        to: dateTo,
      });
      const shouldUseLocalMode =
        shouldFilterByDate ||
        (params?.category !== undefined && params.category !== "全部");
      const data = shouldUseLocalMode
        ? await fetchAllPersonnelItems(query)
        : await fetchPersonnelEnrichedFeed({
            ...query,
            limit: pageSize,
            offset: (page - 1) * pageSize,
          });

      if (cancelled) return;

      startTransition(() => {
        if (data) {
          let newsItems = data.items
            .map(transformToNewsItem)
            .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
          if (params?.category && params.category !== "全部") {
            newsItems = newsItems.filter(
              (item) => item.category === params.category,
            );
          }
          if (shouldFilterByDate) {
            newsItems = filterItemsByDateRange(newsItems, {
              from: dateFrom,
              to: dateTo,
            });
          }

          const paginated = shouldUseLocalMode
            ? paginateItems(newsItems, page, pageSize)
            : {
                items: newsItems,
                page,
                pageSize,
                total:
                  "total_count" in data ? data.total_count : data.total,
                totalPages: getTotalPages(
                  "total_count" in data ? data.total_count : data.total,
                  pageSize,
                ),
              };

          setItems(paginated.items);
          setGeneratedAt(
            "generated_at" in data ? data.generated_at : data.generatedAt,
          );
          setIsUsingMock(false);
          setTotal(paginated.total);
          setTotalPages(paginated.totalPages);

          // Extract unique profiles from all items
          const profileMap = new Map<string, PersonProfile>();
          for (const item of data.items) {
            const profile = buildProfile(item);
            if (profile && !profileMap.has(profile.name)) {
              profileMap.set(profile.name, profile);
            }
          }
          setProfiles(Array.from(profileMap.values()));
        } else {
          setItems([]);
          setProfiles([]);
          setIsUsingMock(true);
          setTotal(0);
          setTotalPages(1);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params?.keyword, params?.category, page, pageSize, dateFrom, dateTo]);

  return {
    items,
    profiles,
    isLoading,
    isUsingMock,
    generatedAt,
    total,
    page,
    pageSize,
    totalPages,
  };
}
