"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  PeerNewsItem,
  UniversityFeedItem,
  UniversityOverviewResponse,
} from "@/lib/types/university-eco";
import { fetchUniversityOverview, fetchUniversityFeed } from "@/lib/api";
import { mockPeerNews } from "@/lib/mock-data/university-eco";

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
  isUsingMock: boolean;
  generatedAt: string | null;
}

export function useUniversityFeed(): UseUniversityFeedResult {
  const [items, setItems] = useState<PeerNewsItem[]>([]);
  const [overview, setOverview] = useState<UniversityOverviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const [feedData, overviewData] = await Promise.all([
        fetchUniversityFeed({ pageSize: 200 }),
        fetchUniversityOverview(),
      ]);

      if (cancelled) return;

      startTransition(() => {
        if (feedData && feedData.items.length > 0) {
          const newsItems = transformFeedItems(feedData.items);
          setItems(newsItems);
          setGeneratedAt(feedData.generated_at);
          setIsUsingMock(false);
        } else {
          setItems(mockPeerNews);
          setIsUsingMock(true);
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
  }, []);

  return { items, overview, isLoading, isUsingMock, generatedAt };
}
