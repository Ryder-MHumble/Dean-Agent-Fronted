"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  fetchZgcaAchievementStats,
  fetchZgcaAchievements,
} from "@/lib/api";
import type {
  AchievementQuery,
  AchievementRecord,
  AchievementStatsResponse,
} from "@/lib/types/achievements";

export function useZgcaAchievements(query: AchievementQuery) {
  const [items, setItems] = useState<AchievementRecord[]>([]);
  const [stats, setStats] = useState<AchievementStatsResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const stableQuery = useMemo(
    () => query,
    [
      query.type,
      query.claimStatus,
      query.year,
      query.sourceSystem,
      query.projectName,
      query.hasMembers,
      query.keyword,
      query.page,
      query.pageSize,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    fetchZgcaAchievementStats().then((data) => {
      if (!cancelled && data) setStats(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const data = await fetchZgcaAchievements(stableQuery);
      if (cancelled) return;
      startTransition(() => {
        if (data) {
          setItems(data.items);
          setTotal(data.total);
          setTotalPages(Math.max(1, data.total_pages));
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
  }, [stableQuery]);

  return { items, stats, total, totalPages, isLoading, isDisconnected };
}
