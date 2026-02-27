"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  SentimentOverview,
  SentimentFeedResponse,
  SentimentContentDetail,
} from "@/lib/types/internal-mgmt";
import {
  fetchSentimentOverview,
  fetchSentimentFeed,
  fetchSentimentContentDetail,
} from "@/lib/api";

// ── Overview hook ─────────────────────────────────────────

interface UseSentimentOverviewResult {
  overview: SentimentOverview | null;
  isLoading: boolean;
}

export function useSentimentOverview(): UseSentimentOverviewResult {
  const [overview, setOverview] = useState<SentimentOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchSentimentOverview();
      if (!cancelled) {
        setOverview(data);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { overview, isLoading };
}

// ── Feed hook with filters ────────────────────────────────

interface UseSentimentFeedParams {
  platform?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

interface UseSentimentFeedResult {
  feed: SentimentFeedResponse | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useSentimentFeed(
  params: UseSentimentFeedParams = {},
): UseSentimentFeedResult {
  const [feed, setFeed] = useState<SentimentFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const { platform, keyword, sortBy, sortOrder, page, pageSize } = params;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchSentimentFeed({
        platform,
        keyword,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });
      if (!cancelled) {
        setFeed(data);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [platform, keyword, sortBy, sortOrder, page, pageSize, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { feed, isLoading, refetch };
}

// ── Content detail hook ───────────────────────────────────

interface UseSentimentDetailResult {
  detail: SentimentContentDetail | null;
  isLoading: boolean;
}

export function useSentimentDetail(
  contentId: string | null,
): UseSentimentDetailResult {
  const [detail, setDetail] = useState<SentimentContentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!contentId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function load() {
      const data = await fetchSentimentContentDetail(contentId!);
      if (!cancelled) {
        setDetail(data);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  return { detail, isLoading };
}