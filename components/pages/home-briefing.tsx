"use client";

import AIDailySummary from "@/components/home/ai-daily-summary";
import AggregatedMetricCards from "@/components/home/aggregated-metric-cards";
import { MotionCard } from "@/components/motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDailyBriefing } from "@/hooks/use-daily-briefing";
import { SkeletonHomeBriefing } from "@/components/shared/skeleton-states";

const visibleDashboardCards = new Set([
  "policy-intel",
  "tech-frontier",
  "talent-radar",
  "university-eco",
  "sentiment",
]);

export default function HomeBriefingPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { dailySummary, metricCards, isLoading } = useDailyBriefing();
  const visibleMetricCards = metricCards.filter((card) =>
    visibleDashboardCards.has(card.id),
  );

  if (isLoading) {
    return <SkeletonHomeBriefing />;
  }

  return (
    <div className="min-h-[var(--app-content-height,100dvh)] space-y-3 p-4 sm:p-5">
      <MotionCard delay={0}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">情报引擎总览</h2>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("zh-CN", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
          >
            每日情报面板
          </Badge>
        </div>
        <AIDailySummary data={dailySummary} onNavigate={onNavigate} />
      </MotionCard>

      {visibleMetricCards.length > 0 && (
        <MotionCard delay={0.1}>
          <AggregatedMetricCards
            cards={visibleMetricCards}
            onCardClick={(cardId) => onNavigate?.(cardId)}
            columns={4}
          />
        </MotionCard>
      )}
    </div>
  );
}
