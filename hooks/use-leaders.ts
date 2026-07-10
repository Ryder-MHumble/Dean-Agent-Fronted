"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import { fetchLeaderProfiles } from "@/lib/api";
import type { LeaderQuery, LeaderDomain, LeaderStatus } from "@/lib/leader-query";
import type { LeaderProfile } from "@/lib/types/leaders";

interface UseLeadersParams {
  keyword?: string;
  name?: string;
  organization?: string;
  domain?: LeaderDomain;
  status?: LeaderStatus;
  page?: number;
  pageSize?: number;
}

interface UseLeadersResult {
  items: LeaderProfile[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export function useLeaders(params: UseLeadersParams = {}): UseLeadersResult {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;
  const [items, setItems] = useState<LeaderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const query: LeaderQuery = useMemo(
    () => ({
      keyword: params.keyword,
      name: params.name,
      organization: params.organization,
      domain: params.domain,
      status: params.status ?? "all",
      limit: pageSize,
      offset,
    }),
    [
      params.keyword,
      params.name,
      params.organization,
      params.domain,
      params.status,
      pageSize,
      offset,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchLeaderProfiles(query);
      if (cancelled) return;

      startTransition(() => {
        if (data) {
          setItems(data.items);
          setTotal(data.total);
          setHasMore(data.has_more);
        } else {
          setItems([]);
          setTotal(0);
          setHasMore(false);
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
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / Math.max(1, pageSize))),
    hasMore,
  };
}
