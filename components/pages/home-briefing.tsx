"use client";

import AIDailySummary from "@/components/home/ai-daily-summary";
import AggregatedMetricCards from "@/components/home/aggregated-metric-cards";
import TodayAgenda from "@/components/home/today-agenda";
import { MotionCard } from "@/components/motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mockAgendaItems } from "@/lib/mock-data/home-briefing";
import { useDailyBriefing } from "@/hooks/use-daily-briefing";
import { SkeletonHomeBriefing } from "@/components/shared/skeleton-states";

export default function HomeBriefingPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { dailySummary, metricCards, isLoading } = useDailyBriefing();

  if (isLoading) {
    return <SkeletonHomeBriefing />;
  }

  return (
    <div className="p-4 sm:p-5 space-y-3">
      {/* Header + AI Briefing merged for compactness */}
      <MotionCard delay={0}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">早安，院长</h2>
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
            className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
          >
            {mockAgendaItems.length} 项待处理
          </Badge>
        </div>
        <AIDailySummary data={dailySummary} onNavigate={onNavigate} />
      </MotionCard>

      {/* Today Agenda — merged schedule + pending actions */}
      <MotionCard delay={0.1}>
        <TodayAgenda
          items={mockAgendaItems}
          onNavigateToSchedule={() => onNavigate?.("smart-schedule")}
        />
      </MotionCard>

      {/* Module Overview Cards — clickable navigation */}
      <MotionCard delay={0.2}>
        <AggregatedMetricCards
          cards={metricCards}
          onCardClick={(cardId) => onNavigate?.(cardId)}
          columns={4}
        />
      </MotionCard>
    </div>
  );
}
