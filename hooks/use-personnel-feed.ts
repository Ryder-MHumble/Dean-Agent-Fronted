"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  PersonnelChangeItem,
  PersonnelEnrichedStatsResponse,
} from "@/lib/types/personnel-intel";
import {
  fetchPersonnelEnrichedFeed,
  fetchPersonnelEnrichedStats,
} from "@/lib/api";

interface UsePersonnelFeedResult {
  items: PersonnelChangeItem[];
  stats: PersonnelEnrichedStatsResponse | null;
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
  actionCount: number;
  watchCount: number;
}

export function usePersonnelFeed(): UsePersonnelFeedResult {
  const [items, setItems] = useState<PersonnelChangeItem[]>([]);
  const [stats, setStats] = useState<PersonnelEnrichedStatsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [actionCount, setActionCount] = useState(0);
  const [watchCount, setWatchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const [feedData, statsData] = await Promise.all([
        fetchPersonnelEnrichedFeed(),
        fetchPersonnelEnrichedStats(),
      ]);

      if (cancelled) return;

      startTransition(() => {
        if (feedData && feedData.items.length > 0) {
          setItems(feedData.items);
          setGeneratedAt(feedData.generated_at);
          setActionCount(feedData.action_count);
          setWatchCount(feedData.watch_count);
          setIsUsingMock(false);
        } else {
          setItems([]);
          setIsUsingMock(true);
        }

        if (statsData) {
          setStats(statsData);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    items,
    stats,
    isLoading,
    isUsingMock,
    generatedAt,
    actionCount,
    watchCount,
  };
}
