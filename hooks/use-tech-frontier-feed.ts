"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { fetchSocialPostDetail, fetchSocialPosts } from "@/lib/api";
import {
  collectTechFrontierPostPages,
  normalizeTechFrontierPost,
  summarizeTechFrontierPlatformFeed,
  type SocialPostDetail,
  type TechFrontierPlatformFilter,
  type TechFrontierPostItem,
} from "@/lib/tech-frontier-feed";

const FULL_FEED_PAGE_SIZE = 200;
const MAX_FEED_OFFSET = 2000;

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

async function fetchAllPlatformPosts(
  platform: Exclude<TechFrontierPlatformFilter, "all">,
  params: UseTechFrontierFeedParams,
) {
  return collectTechFrontierPostPages(
    (page) =>
      fetchSocialPosts({
        platform,
        keyword: params.keyword,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        page,
        pageSize: FULL_FEED_PAGE_SIZE,
      }),
    FULL_FEED_PAGE_SIZE,
    MAX_FEED_OFFSET,
  );
}

async function fetchTechFrontierPage(params: UseTechFrontierFeedParams) {
  const [xItems, wechatItems] = await Promise.all([
    fetchAllPlatformPosts("x", params),
    fetchAllPlatformPosts("wechat_mp", params),
  ]);

  if (!xItems || !wechatItems) return null;

  const allSummary = summarizeTechFrontierPlatformFeed(
    xItems,
    wechatItems,
    params.page,
    params.pageSize,
  );

  if (params.platform === "all") {
    return {
      ...allSummary,
      generatedAt: getLatestTimestamp([...xItems, ...wechatItems]),
    };
  }

  const selectedItems = params.platform === "x" ? xItems : wechatItems;
  const selectedPage = summarizeTechFrontierPlatformFeed(
    params.platform === "x" ? xItems : [],
    params.platform === "wechat_mp" ? wechatItems : [],
    params.page,
    params.pageSize,
  );

  return {
    ...selectedPage,
    platformTotals: allSummary.platformTotals,
    generatedAt: getLatestTimestamp(selectedItems),
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
      const currentParams = {
        platform,
        keyword,
        dateFrom,
        dateTo,
        page,
        pageSize,
      };
      const data = await fetchTechFrontierPage(currentParams);
      if (cancelled) return;

      startTransition(() => {
        if (!data) {
          setItems([]);
          setTotal(0);
          setTotalPages(1);
          setPlatformTotals({ all: 0, x: 0, wechat_mp: 0 });
          setGeneratedAt(null);
          setIsDisconnected(true);
        } else {
          setItems(data.items);
          setTotal(data.total);
          setTotalPages(data.totalPages);
          setPlatformTotals(data.platformTotals);
          setGeneratedAt(data.generatedAt);
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

export function useTechFrontierAuthorAvatars(items: TechFrontierPostItem[]) {
  const [avatarByPostId, setAvatarByPostId] = useState<Record<string, string>>(
    {},
  );
  const itemKey = useMemo(
    () =>
      items
        .filter((item) => item.platform === "x")
        .map((item) => `${item.id}:${item.authorAvatarUrl ?? ""}`)
        .join("|"),
    [items],
  );

  useEffect(() => {
    const missingItems = items.filter(
      (item) =>
        item.platform === "x" &&
        !item.authorAvatarUrl &&
        !avatarByPostId[item.id],
    );

    if (missingItems.length === 0) return;

    let cancelled = false;

    async function loadAvatars() {
      const entries = await Promise.all(
        missingItems.map(async (item) => {
          const detail = await fetchSocialPostDetail(item.id);
          if (!detail) return null;
          const avatarUrl = normalizeTechFrontierPost(detail).authorAvatarUrl;
          return avatarUrl ? [item.id, avatarUrl] : null;
        }),
      );

      if (cancelled) return;

      const nextEntries = entries.filter(
        (entry): entry is [string, string] => entry !== null,
      );
      if (nextEntries.length === 0) return;

      setAvatarByPostId((current) => ({
        ...current,
        ...Object.fromEntries(nextEntries),
      }));
    }

    loadAvatars();

    return () => {
      cancelled = true;
    };
  }, [itemKey, items, avatarByPostId]);

  return avatarByPostId;
}
