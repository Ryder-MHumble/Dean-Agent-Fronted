"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import { fetchPolicyFeed, fetchPolicySourceNameMap } from "@/lib/api";
import type { PolicyFeedResponse } from "@/lib/api";
import { getPolicySourceId, getPolicySourceLabel } from "@/lib/policy-source-label";

const CACHE_KEY = "policy_feed_cache_v2";
// Data is considered "fresh" for 10 minutes — skip the network call entirely
const CACHE_TTL_MS = 10 * 60 * 1000;
// Hard expiry: discard cache entirely after 24 hours
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const INITIAL_LIMIT = 500;
const FULL_LIMIT = 500;

interface CachedEntry {
  data: PolicyFeedResponse;
  cachedAt: number;
}

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

function readCache(): CachedEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    if (Date.now() - entry.cachedAt > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeCache(data: PolicyFeedResponse) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, cachedAt: Date.now() } satisfies CachedEntry),
    );
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

interface UsePolicyFeedResult {
  items: PolicyFeedItem[];
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
  /** true while a background refresh is running */
  isRefreshing: boolean;
  /** true when only the initial batch is loaded and more is available */
  hasMore: boolean;
  /** fetch the full dataset; resolves when done */
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
}

export function usePolicyFeed(): UsePolicyFeedResult {
  const [items, setItems] = useState<PolicyFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // ── Step 1: serve from cache if available ──────────────────────────
      const cached = readCache();
      const isFresh =
        cached !== null && Date.now() - cached.cachedAt < CACHE_TTL_MS;

      if (cached && cached.data.items.length > 0) {
        const sourceNameMap = await getPolicySourceNameMap();
        const enrichedCachedItems = withSourceNames(
          cached.data.items,
          sourceNameMap,
        );

        // Render cached data immediately — no skeleton shown
        startTransition(() => {
          setItems(enrichedCachedItems);
          setGeneratedAt(cached.data.generated_at);
          setIsUsingMock(false);
          setHasMore(enrichedCachedItems.length < cached.data.item_count);
          setIsLoading(false);
        });

        if (isFresh) return;

        // Stale: show cached but refresh in background
        setIsRefreshing(true);
      }

      // ── Step 2: fetch the full policy feed ────────────────────────────
      const data = await fetchPolicyFeed(INITIAL_LIMIT);
      const sourceNameMap = await getPolicySourceNameMap();
      if (cancelled) return;

      startTransition(() => {
        if (data && data.items.length > 0) {
          setItems(withSourceNames(data.items, sourceNameMap));
          setGeneratedAt(data.generated_at);
          setIsUsingMock(false);
          setHasMore(data.items.length < data.item_count);
          writeCache(data);
        } else if (!cached) {
          setItems([]);
          setGeneratedAt(null);
          setIsUsingMock(true);
          setHasMore(false);
        }
        setIsLoading(false);
        setIsRefreshing(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchPolicyFeed(FULL_LIMIT);
      const sourceNameMap = await getPolicySourceNameMap();
      if (data && data.items.length > 0) {
        startTransition(() => {
          setItems(withSourceNames(data.items, sourceNameMap));
          setGeneratedAt(data.generated_at);
          setHasMore(false);
          writeCache(data);
        });
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  return {
    items,
    isLoading,
    isUsingMock,
    generatedAt,
    isRefreshing,
    hasMore,
    loadMore,
    isLoadingMore,
  };
}
