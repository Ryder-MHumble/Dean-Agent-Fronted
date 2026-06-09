"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { fetchSocialPostDetail, fetchSocialPosts } from "@/lib/api";
import {
  isTechFrontierFeedPost,
  normalizeTechFrontierPost,
  type SocialPostDetail,
  type TechFrontierPlatformFilter,
  type TechFrontierPostItem,
} from "@/lib/tech-frontier-feed";

const MIXED_FEED_PAGE_SIZE = 100;
const MIXED_FEED_BATCH_SIZE = 3;

interface UseTechFrontierFeedParams {
  platform: TechFrontierPlatformFilter;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

interface UseTechFrontierFeedResult {
  items: TechFrontierPostItem[];
  isLoading: boolean;
  isDisconnected: boolean;
  generatedAt: string | null;
  total: number;
  totalPages: number;
  platformTotals: Record<TechFrontierPlatformFilter, number>;
}

function getLatestTimestamp(items: TechFrontierPostItem[]): string | null {
  let latest = 0;
  for (const item of items) {
    const time = new Date(item.crawledAt || item.publishedAt || 0).getTime();
    if (Number.isFinite(time) && time > latest) latest = time;
  }
  return latest > 0 ? new Date(latest).toISOString() : null;
}

async function fetchPlatformWindow(
  platform: Exclude<TechFrontierPlatformFilter, "all">,
  params: UseTechFrontierFeedParams,
) {
  return fetchSocialPosts({
    platform,
    keyword: params.keyword,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    page: 1,
    pageSize: 1,
  });
}

async function fetchPlatformTotals(params: UseTechFrontierFeedParams) {
  const [xSummary, wechatSummary] = await Promise.all([
    fetchPlatformWindow("x", params),
    fetchPlatformWindow("wechat_mp", params),
  ]);

  if (!xSummary || !wechatSummary) return null;
  const combinedTotal = xSummary.total + wechatSummary.total;
  return {
    all: combinedTotal,
    x: xSummary.total,
    wechat_mp: wechatSummary.total,
  };
}

async function fetchMixedPlatformPage(params: UseTechFrontierFeedParams) {
  const safePageSize = Math.max(1, params.pageSize);
  const [platformTotals, firstPage] = await Promise.all([
    fetchPlatformTotals(params),
    fetchSocialPosts({
      platform: "all",
      keyword: params.keyword,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      page: 1,
      pageSize: MIXED_FEED_PAGE_SIZE,
    }),
  ]);

  if (!platformTotals || !firstPage) return null;

  const combinedTotal = platformTotals.all;
  const totalPages = Math.max(1, Math.ceil(combinedTotal / safePageSize));
  const effectivePage = Math.min(Math.max(1, params.page), totalPages);
  const desiredCount = effectivePage * safePageSize;
  const collected = firstPage.items.filter(isTechFrontierFeedPost);
  const backendTotalPages = Math.max(
    1,
    firstPage.total_pages ||
      Math.ceil((firstPage.total || 0) / MIXED_FEED_PAGE_SIZE),
  );
  let nextPage = 2;

  while (collected.length < desiredCount && nextPage <= backendTotalPages) {
    const batchSize = Math.min(
      MIXED_FEED_BATCH_SIZE,
      backendTotalPages - nextPage + 1,
    );
    const pages = Array.from(
      { length: batchSize },
      (_, index) => nextPage + index,
    );
    const responses = await Promise.all(
      pages.map((backendPage) =>
        fetchSocialPosts({
          platform: "all",
          keyword: params.keyword,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
          page: backendPage,
          pageSize: MIXED_FEED_PAGE_SIZE,
        }),
      ),
    );
    if (responses.some((response) => response === null)) return null;
    for (const response of responses) {
      collected.push(...(response?.items ?? []).filter(isTechFrontierFeedPost));
    }
    nextPage += batchSize;
  }

  const normalizedItems = collected.map(normalizeTechFrontierPost);
  const start = (effectivePage - 1) * safePageSize;
  return {
    items: normalizedItems.slice(start, start + safePageSize),
    total: combinedTotal,
    totalPages,
    platformTotals,
    generatedAt: getLatestTimestamp(normalizedItems),
  };
}

export function useTechFrontierFeed(
  params: UseTechFrontierFeedParams,
): UseTechFrontierFeedResult {
  const {
    platform,
    keyword = "",
    dateFrom = "",
    dateTo = "",
    page,
    pageSize,
  } = params;
  const [items, setItems] = useState<TechFrontierPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [platformTotals, setPlatformTotals] = useState<
    Record<TechFrontierPlatformFilter, number>
  >({ all: 0, x: 0, wechat_mp: 0 });

  const queryKey = useMemo(
    () => [platform, keyword, dateFrom, dateTo, page, pageSize].join("|"),
    [platform, keyword, dateFrom, dateTo, page, pageSize],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const safePageSize = Math.max(1, pageSize);

      if (platform === "all") {
        const currentParams = { platform, keyword, dateFrom, dateTo, page, pageSize };
        const mixedPage = await fetchMixedPlatformPage(currentParams);
        if (cancelled) return;

        startTransition(() => {
          if (!mixedPage) {
            setItems([]);
            setTotal(0);
            setTotalPages(1);
            setPlatformTotals({ all: 0, x: 0, wechat_mp: 0 });
            setGeneratedAt(null);
            setIsDisconnected(true);
          } else {
            setItems(mixedPage.items);
            setTotal(mixedPage.total);
            setTotalPages(mixedPage.totalPages);
            setPlatformTotals(mixedPage.platformTotals);
            setGeneratedAt(mixedPage.generatedAt);
            setIsDisconnected(false);
          }
          setIsLoading(false);
        });
        return;
      }

      const currentParams = { platform, keyword, dateFrom, dateTo, page, pageSize };
      const [data, nextPlatformTotals] = await Promise.all([
        fetchSocialPosts(currentParams),
        fetchPlatformTotals(currentParams),
      ]);
      if (cancelled) return;

      startTransition(() => {
        if (!data || !nextPlatformTotals) {
          setItems([]);
          setTotal(0);
          setTotalPages(1);
          setPlatformTotals({ all: 0, x: 0, wechat_mp: 0 });
          setGeneratedAt(null);
          setIsDisconnected(true);
        } else {
          const normalizedItems = data.items.map(normalizeTechFrontierPost);
          setItems(normalizedItems);
          setTotal(data.total);
          setTotalPages(Math.max(1, data.total_pages || 1));
          setPlatformTotals(nextPlatformTotals);
          setGeneratedAt(getLatestTimestamp(normalizedItems));
          setIsDisconnected(false);
        }
        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [queryKey, platform, keyword, dateFrom, dateTo, page, pageSize]);

  return {
    items,
    isLoading,
    isDisconnected,
    generatedAt,
    total,
    totalPages,
    platformTotals,
  };
}

export function useTechFrontierPostDetail(postId?: string | null) {
  const [detail, setDetail] = useState<SocialPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      setDetail(null);
      setIsLoading(false);
      return;
    }

    const currentPostId = postId;
    let cancelled = false;
    async function load() {
      setDetail(null);
      setIsLoading(true);
      const data = await fetchSocialPostDetail(currentPostId);
      if (cancelled) return;
      setDetail(data);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  return { detail, isLoading };
}
