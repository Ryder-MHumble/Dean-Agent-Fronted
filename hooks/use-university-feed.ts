"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  PeerNewsGroup,
  PeerNewsItem,
  UniversityFeedItem,
  UniversityOverviewResponse,
} from "@/lib/types/university-eco";
import { fetchUniversityOverview, fetchUniversityFeed } from "@/lib/api";

// ── Transform API items to PeerNewsItem ──────────────────

function transformFeedItems(items: UniversityFeedItem[]): PeerNewsItem[] {
  return items.map((item) => {
    // Generate summary from content: take first 120 chars of plain text
    const summary = item.content
      ? item.content.replace(/\s+/g, " ").trim().slice(0, 120)
      : "";

    return {
      id: item.id,
      title: item.title,
      sourceId: item.source_id,
      sourceName: item.source_name,
      group: (item.group ?? "university_news") as PeerNewsItem["group"],
      url: item.url,
      date: item.published_at
        ? item.published_at.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      summary,
      tags: item.tags,
      thumbnail: item.thumbnail,
      isNew: item.is_new,
      content: item.content,
      images: item.images,
    };
  });
}

// ── Hook ─────────────────────────────────────────────────

interface UseUniversityFeedResult {
  items: PeerNewsItem[];
  overview: UniversityOverviewResponse | null;
  isLoading: boolean;
  generatedAt: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseUniversityFeedParams {
  group?: PeerNewsGroup;
  page?: number;
  pageSize?: number;
}

export function useUniversityFeed(
  params?: UseUniversityFeedParams,
): UseUniversityFeedResult {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const [items, setItems] = useState<PeerNewsItem[]>([]);
  const [overview, setOverview] = useState<UniversityOverviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const [feedData, overviewData] = await Promise.all([
        fetchUniversityFeed({
          group: params?.group,
          page,
          pageSize,
        }),
        fetchUniversityOverview(),
      ]);

      if (cancelled) return;

      startTransition(() => {
        if (feedData) {
          const newsItems = transformFeedItems(feedData.items);
          setItems(newsItems);
          setGeneratedAt(feedData.generated_at);
          setTotal(feedData.total);
          setTotalPages(feedData.total_pages);
        } else {
          setItems([]);
          setGeneratedAt(null);
          setTotal(0);
          setTotalPages(1);
        }

        if (overviewData) {
          setOverview(overviewData);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params?.group, page, pageSize]);

  return { items, overview, isLoading, generatedAt, total, page, pageSize, totalPages };
}
