"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  ResearchOutput,
  ResearchOutputApiItem,
} from "@/lib/types/university-eco";
import { fetchUniversityResearch } from "@/lib/api";
import { normalizeUniversityInstitutionName } from "@/lib/university-source";
import {
  filterItemsByDateRange,
  hasActiveDateRange,
  paginateItems,
  type DateRangeValue,
} from "@/lib/feed-list-utils";

const MAX_BACKEND_PAGE_SIZE = 200;

// ── Transform API items to frontend ResearchOutput ───────

function transformItem(item: ResearchOutputApiItem): ResearchOutput {
  return {
    id: item.id,
    title: item.title,
    institution: item.institution,
    sourceId: item.source_id,
    sourceName:
      normalizeUniversityInstitutionName(item.source_name, item.source_id) ||
      item.institution,
    sourceUrl: item.url,
    type: item.type,
    influence: item.influence,
    date: item.date,
    field: item.field,
    authors: item.authors,
    aiAnalysis: item.aiAnalysis,
    detail: item.detail,
    content: item.content,
    images: item.images,
  };
}

// ── Hook ─────────────────────────────────────────────────

interface UseUniversityResearchResult {
  items: ResearchOutput[];
  typeStats: { 论文: number; 专利: number; 获奖: number } | null;
  isLoading: boolean;
  generatedAt: string | null;
  itemCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseUniversityResearchParams {
  type?: string;
  influence?: string;
  sourceIds?: string[];
  dateRange?: DateRangeValue;
  page?: number;
  pageSize?: number;
}

function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}

function getTypeStats(items: ResearchOutput[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.type] += 1;
      return acc;
    },
    { 论文: 0, 专利: 0, 获奖: 0 } as { 论文: number; 专利: number; 获奖: number },
  );
}

async function fetchAllResearchItems(params?: {
  type?: string;
  influence?: string;
}) {
  let currentPage = 1;
  let totalPages = 1;
  let itemCount = 0;
  let generatedAt: string | null = null;
  const items: ResearchOutputApiItem[] = [];

  do {
    const data = await fetchUniversityResearch({
      type: params?.type,
      influence: params?.influence,
      page: currentPage,
      pageSize: MAX_BACKEND_PAGE_SIZE,
    });
    if (!data) return null;

    if (generatedAt === null) generatedAt = data.generated_at;
    itemCount = data.item_count;
    totalPages = data.total_pages;
    items.push(...data.items);
    currentPage += 1;
  } while (currentPage <= totalPages);

  return { generatedAt, itemCount, items };
}

export function useUniversityResearch(
  params?: UseUniversityResearchParams,
): UseUniversityResearchResult {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const [items, setItems] = useState<ResearchOutput[]>([]);
  const [typeStats, setTypeStats] = useState<{
    论文: number;
    专利: number;
    获奖: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const sourceIdsKey = (params?.sourceIds ?? []).join(",");
  const dateFrom = params?.dateRange?.from ?? "";
  const dateTo = params?.dateRange?.to ?? "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const shouldFilterByDate = hasActiveDateRange({
        from: dateFrom,
        to: dateTo,
      });
      const shouldUseLocalMode =
        shouldFilterByDate || (params?.sourceIds?.length ?? 0) > 0;

      const data = shouldUseLocalMode
        ? await fetchAllResearchItems({
            type: params?.type,
            influence: params?.influence,
          })
        : await fetchUniversityResearch({
            type: params?.type,
            influence: params?.influence,
            page,
            pageSize,
          });

      if (cancelled) return;

      startTransition(() => {
        if (data) {
          let transformedItems = data.items.map(transformItem);
          if (params?.sourceIds?.length) {
            const selectedSources = new Set(params.sourceIds);
            transformedItems = transformedItems.filter((item) =>
              selectedSources.has(item.sourceId),
            );
          }
          if (shouldFilterByDate) {
            transformedItems = filterItemsByDateRange(transformedItems, {
              from: dateFrom,
              to: dateTo,
            });
          }

          const paginated = shouldUseLocalMode
            ? paginateItems(transformedItems, page, pageSize)
            : {
                items: transformedItems,
                page,
                pageSize,
                total:
                  "item_count" in data ? data.item_count : data.itemCount,
                totalPages:
                  "total_pages" in data
                    ? data.total_pages
                    : getTotalPages(data.itemCount, pageSize),
              };

          setItems(paginated.items);
          setTypeStats(
            shouldUseLocalMode
              ? getTypeStats(transformedItems)
              : "type_stats" in data
                ? data.type_stats
                : getTypeStats(transformedItems),
          );
          setGeneratedAt(
            "generated_at" in data ? data.generated_at : data.generatedAt,
          );
          setItemCount(paginated.total);
          setTotalPages(paginated.totalPages);
        } else {
          setItems([]);
          setTypeStats(null);
          setGeneratedAt(null);
          setItemCount(0);
          setTotalPages(1);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [
    params?.type,
    params?.influence,
    sourceIdsKey,
    page,
    pageSize,
    dateFrom,
    dateTo,
  ]);

  return {
    items,
    typeStats,
    isLoading,
    generatedAt,
    itemCount,
    page,
    pageSize,
    totalPages,
  };
}
