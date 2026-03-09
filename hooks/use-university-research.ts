"use client";

import { useState, useEffect, startTransition } from "react";
import type {
  ResearchOutput,
  ResearchOutputsResponse,
  ResearchOutputApiItem,
} from "@/lib/types/university-eco";
import { fetchUniversityResearch } from "@/lib/api";
import { mockResearchOutputs } from "@/lib/mock-data/university-eco";

// ── Transform API items to frontend ResearchOutput ───────

function transformItem(item: ResearchOutputApiItem): ResearchOutput {
  return {
    id: item.id,
    title: item.title,
    institution: item.institution,
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
  isUsingMock: boolean;
  generatedAt: string | null;
}

export function useUniversityResearch(): UseUniversityResearchResult {
  const [items, setItems] = useState<ResearchOutput[]>([]);
  const [typeStats, setTypeStats] = useState<{
    论文: number;
    专利: number;
    获奖: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const data = await fetchUniversityResearch({ pageSize: 200 });

      if (cancelled) return;

      startTransition(() => {
        if (data && data.items.length > 0) {
          setItems(data.items.map(transformItem));
          setTypeStats(data.type_stats);
          setGeneratedAt(data.generated_at);
          setIsUsingMock(false);
        } else {
          setItems(mockResearchOutputs);
          setTypeStats(null);
          setIsUsingMock(true);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, typeStats, isLoading, isUsingMock, generatedAt };
}
