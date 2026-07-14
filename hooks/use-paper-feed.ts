"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { fetchPapers } from "@/lib/api";
import {
  getPaperCategorySourceQueries,
  getPaperTotalPages,
  mergePaperSampleResponses,
  normalizePaper,
} from "@/lib/paper-feed";
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
  isSampled: boolean;
}

const CATEGORY_SAMPLE_SIZE = 10;

async function fetchCategorySample(query: PaperQuery) {
  const sourceQueries = getPaperCategorySourceQueries(query.category ?? "all");
  if (sourceQueries.length === 0) return null;

  const responses = await Promise.all(
    sourceQueries.map((sourceQuery) =>
      fetchPapers({
        ...sourceQuery,
        keyword: query.keyword,
        page: 1,
        pageSize: CATEGORY_SAMPLE_SIZE,
      }),
    ),
  );
  const availableResponses = responses.filter(
    (response): response is NonNullable<typeof response> => response !== null,
  );
  if (availableResponses.length === 0) return null;

  const merged = mergePaperSampleResponses(availableResponses);
  const pageSize = query.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(merged.length / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  const offset = (page - 1) * pageSize;
  return {
    items: merged.slice(offset, offset + pageSize),
    total: merged.length,
    totalPages,
  };
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
      const usesCategorySample =
        !query.sourceId &&
        !query.sourceName &&
        getPaperCategorySourceQueries(query.category ?? "all").length > 0;
      const categorySample = usesCategorySample
        ? await fetchCategorySample(query)
        : null;
      const data = usesCategorySample ? null : await fetchPapers(query);
      if (cancelled) return;

      startTransition(() => {
        if (categorySample) {
          setItems(categorySample.items.map(normalizePaper));
          setTotal(categorySample.total);
          setTotalPages(categorySample.totalPages);
          setIsDisconnected(false);
        } else if (data) {
          setItems(data.items.map(normalizePaper));
          setTotal(data.total);
          setTotalPages(getPaperTotalPages(data));
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
    isSampled:
      !query.sourceId &&
      !query.sourceName &&
      getPaperCategorySourceQueries(query.category ?? "all").length > 0,
  };
}
