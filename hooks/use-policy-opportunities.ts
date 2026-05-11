"use client";

import { useState, useEffect, startTransition } from "react";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import { fetchPolicyFeed, fetchPolicySourceNameMap } from "@/lib/api";
import type { PolicyFeedQuery } from "@/lib/api";
import { getPolicySourceId, getPolicySourceLabel } from "@/lib/policy-source-label";
import {
  filterItemsByDateRange,
  hasActiveDateRange,
  paginateItems,
  type DateRangeValue,
} from "@/lib/feed-list-utils";

const MAX_BACKEND_PAGE_SIZE = 200;

let sourceNameMapPromise: Promise<Record<string, string>> | null = null;

function getPolicySourceNameMap() {
  if (!sourceNameMapPromise) {
    sourceNameMapPromise = fetchPolicySourceNameMap();
  }
  return sourceNameMapPromise;
}

function withSourceNames(
  items: PolicyFeedItem[],
  sourceNameMap: Record<string, string>,
): PolicyFeedItem[] {
  return items.map((item) => {
    const sourceId = getPolicySourceId(item);
    const backendSourceName = item.sourceName ?? item.source_name;
    const sourceName =
      backendSourceName && backendSourceName !== sourceId
        ? backendSourceName
        : sourceNameMap[sourceId] ?? getPolicySourceLabel(item);

    return {
      ...item,
      sourceId,
      sourceName,
    };
  });
}

function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}

async function fetchAllPolicyItems(
  query: Omit<PolicyFeedQuery, "limit" | "offset">,
) {
  let offset = 0;
  let total = 0;
  let generatedAt: string | null = null;
  const items: PolicyFeedItem[] = [];

  while (true) {
    const page = await fetchPolicyFeed({
      ...query,
      limit: MAX_BACKEND_PAGE_SIZE,
      offset,
    });
    if (!page) return null;

    if (generatedAt === null) generatedAt = page.generated_at;
    total = page.item_count;
    if (page.items.length === 0) break;

    items.push(...page.items);
    offset += page.items.length;
    if (offset >= total) break;
  }

  return {
    generatedAt,
    total,
    items,
  };
}

interface UsePolicyFeedResult {
  items: PolicyFeedItem[];
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePolicyFeedParams {
  category?: string;
  keyword?: string;
  sourceIds?: string[];
  page?: number;
  pageSize?: number;
  dateRange?: DateRangeValue;
}

export function usePolicyFeed(params?: UsePolicyFeedParams): UsePolicyFeedResult {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const [items, setItems] = useState<PolicyFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const sourceIdsKey = (params?.sourceIds ?? []).join(",");
  const dateFrom = params?.dateRange?.from ?? "";
  const dateTo = params?.dateRange?.to ?? "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const query = {
        category: params?.category,
        keyword: params?.keyword,
        sourceIds: params?.sourceIds,
      } satisfies Omit<PolicyFeedQuery, "limit" | "offset">;
      const shouldFilterByDate = hasActiveDateRange({
        from: dateFrom,
        to: dateTo,
      });

      const data = shouldFilterByDate
        ? await fetchAllPolicyItems(query)
        : await fetchPolicyFeed({
            ...query,
            limit: pageSize,
            offset: (page - 1) * pageSize,
          });
      const sourceNameMap = await getPolicySourceNameMap();
      if (cancelled) return;

      startTransition(() => {
        if (data) {
          const dataGeneratedAt =
            "generated_at" in data ? data.generated_at : data.generatedAt;
          const dataTotal = "item_count" in data ? data.item_count : data.total;
          const enrichedItems = withSourceNames(data.items, sourceNameMap);
          const paginated = shouldFilterByDate
            ? paginateItems(
                filterItemsByDateRange(enrichedItems, {
                  from: dateFrom,
                  to: dateTo,
                }),
                page,
                pageSize,
              )
            : {
                items: enrichedItems,
                page,
                pageSize,
                total: dataTotal,
                totalPages: getTotalPages(dataTotal, pageSize),
              };

          setItems(paginated.items);
          setGeneratedAt(dataGeneratedAt);
          setIsUsingMock(false);
          setTotal(paginated.total);
          setTotalPages(paginated.totalPages);
        } else {
          setItems([]);
          setGeneratedAt(null);
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
  }, [
    params?.category,
    params?.keyword,
    sourceIdsKey,
    page,
    pageSize,
    dateFrom,
    dateTo,
  ]);

  return {
    items,
    isLoading,
    isUsingMock,
    generatedAt,
    total,
    page,
    pageSize,
    totalPages,
  };
}
