"use client";

import { useState, useEffect, startTransition } from "react";
import type { DailySummaryData } from "@/components/home/ai-daily-summary";
import type { MetricCardData } from "@/components/home/aggregated-metric-cards";
import { fetchDailyBriefing } from "@/lib/api";

interface UseDailyBriefingResult {
  dailySummary: DailySummaryData;
  metricCards: MetricCardData[];
  isLoading: boolean;
}

const EMPTY_SUMMARY: DailySummaryData = {
  generatedAt: new Date(0),
  paragraphs: [["今日早报尚未生成，请在定时任务完成后稍后查看。"]],
};

export function useDailyBriefing(): UseDailyBriefingResult {
  const [dailySummary, setDailySummary] =
    useState<DailySummaryData>(EMPTY_SUMMARY);
  const [metricCards, setMetricCards] = useState<MetricCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchDailyBriefing();

      if (cancelled) return;

      startTransition(() => {
        if (data && data.paragraphs.length > 0) {
          setDailySummary({
            paragraphs: data.paragraphs,
            generatedAt: new Date(data.generated_at),
          });
          setMetricCards(data.metric_cards);
        } else {
          setDailySummary({
            ...EMPTY_SUMMARY,
            generatedAt: new Date(),
          });
          setMetricCards([]);
        }
        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { dailySummary, metricCards, isLoading };
}
