"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { fetchPapers } from "@/lib/api";
import { normalizePaper } from "@/lib/paper-feed";
import type {
  PaperCategory,
  PaperQuery,
  PaperRecord,
} from "@/lib/types/papers";

interface UsePaperFeedParams {
  category?: PaperCategory;
  sourceId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

interface UsePaperFeedResult {
  items: PaperRecord[];
  isLoading: boolean;
  isDisconnected: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function usePaperFeed(
  params: UsePaperFeedParams = {},
): UsePaperFeedResult {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(30, Math.max(1, params.pageSize ?? 20));
  const [items, setItems] = useState<PaperRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const query: PaperQuery = useMemo(
    () => ({
      category: params.category,
      sourceId: params.sourceId,
      keyword: params.keyword,
      page,
      pageSize,
    }),
    [
      params.category,
      params.sourceId,
      params.keyword,
      page,
      pageSize,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchPapers(query);
      if (cancelled) return;

      startTransition(() => {
        if (data) {
          setItems(data.items.map(normalizePaper));
          setTotal(data.total);
          setTotalPages(data.total_pages);
          setIsDisconnected(false);
        } else {
          setItems([]);
          setTotal(0);
          setTotalPages(1);
          setIsDisconnected(true);
        }
        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return {
    items,
    isLoading,
    isDisconnected,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, totalPages),
  };
}
