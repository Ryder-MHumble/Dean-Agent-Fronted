"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  ResearchOutput,
  ResearchOutputApiItem,
} from "@/lib/types/university-eco";
import { fetchUniversityResearch } from "@/lib/api";
import { normalizeUniversityInstitutionName } from "@/lib/university-source";

// ── Transform API items to frontend ResearchOutput ───────

function transformItem(item: ResearchOutputApiItem): ResearchOutput {
  return {
    id: item.id,
    title: item.title,
    institution: item.institution,
    sourceId: item.source_id,
    sourceName:
      normalizeUniversityInstitutionName(item.source_name, item.source_id) ||
      item.institution,
    sourceUrl: item.url,
    type: item.type,
    influence: item.influence,
    date: item.date,
    field: item.field,
    authors: item.authors,
    aiAnalysis: item.aiAnalysis,
    detail: item.detail,
    content: item.content,
    images: item.images,
  };
}

// ── Hook ─────────────────────────────────────────────────

interface UseUniversityResearchResult {
  items: ResearchOutput[];
  typeStats: { 论文: number; 专利: number; 获奖: number } | null;
  isLoading: boolean;
  generatedAt: string | null;
  itemCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseUniversityResearchParams {
  type?: string;
  influence?: string;
  page?: number;
  pageSize?: number;
}

export function useUniversityResearch(
  params?: UseUniversityResearchParams,
): UseUniversityResearchResult {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const [items, setItems] = useState<ResearchOutput[]>([]);
  const [typeStats, setTypeStats] = useState<{
    论文: number;
    专利: number;
    获奖: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const data = await fetchUniversityResearch({
        type: params?.type,
        influence: params?.influence,
        page,
        pageSize,
      });

      if (cancelled) return;

      startTransition(() => {
        if (data) {
          setItems(data.items.map(transformItem));
          setTypeStats(data.type_stats);
          setGeneratedAt(data.generated_at);
          setItemCount(data.item_count);
          setTotalPages(data.total_pages);
        } else {
          setItems([]);
          setTypeStats(null);
          setGeneratedAt(null);
          setItemCount(0);
          setTotalPages(1);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params?.type, params?.influence, page, pageSize]);

  return {
    items,
    typeStats,
    isLoading,
    generatedAt,
    itemCount,
    page,
    pageSize,
    totalPages,
  };
}
