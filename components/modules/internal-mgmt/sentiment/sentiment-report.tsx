"use client";

import { Badge } from "@/components/ui/badge";
import { getPlatformConfig } from "@/lib/config/platforms";
import type { SentimentOverview } from "@/lib/types/internal-mgmt";
import { cn, formatNumber } from "@/lib/utils";
import { Activity, Hash, Sparkles } from "lucide-react";
import { useMemo } from "react";

interface SentimentReportProps {
  overview: SentimentOverview;
}

function buildReportParagraphs(overview: SentimentOverview): string[] {
  const {
    total_contents,
    total_comments,
    total_engagement,
    platforms,
    top_content,
    keywords,
  } = overview;
  const topPlatforms = [...platforms].sort(
    (a, b) => b.content_count - a.content_count,
  );
  const dominant = topPlatforms[0];
  const dominantPct =
    dominant && total_contents > 0
      ? Math.round((dominant.content_count / total_contents) * 100)
      : 0;
  const topItem = top_content[0];
  const topEngagement = topItem
    ? topItem.liked_count +
      topItem.comment_count +
      topItem.share_count +
      topItem.collected_count
    : 0;

  const totals = `当前共收录 ${formatNumber(total_contents)} 条社媒内容，累计评论 ${formatNumber(total_comments)} 条，总互动量 ${formatNumber(total_engagement)}。`;
  const distribution = dominant
    ? `${dominant.platform_label}内容量最高，占全部内容的 ${dominantPct}%（${formatNumber(dominant.content_count)} 条）。`
    : "";
  const focus = topItem
    ? `当前互动量最高的内容为《${topItem.title}》，累计互动 ${formatNumber(topEngagement)} 次。`
    : "";
  const keywordSummary =
    keywords.length > 0
      ? `高频关键词：${keywords.slice(0, 6).join("、")}。`
      : "";

  return [totals + distribution, focus, keywordSummary].filter(Boolean);
}

export function SentimentReport({ overview }: SentimentReportProps) {
  const paragraphs = useMemo(() => buildReportParagraphs(overview), [overview]);
  const topPlatforms = useMemo(
    () =>
      [...overview.platforms]
        .sort((a, b) => b.content_count - a.content_count)
        .slice(0, 3),
    [overview.platforms],
  );
  const engagementPerContent =
    overview.total_contents > 0
      ? Math.round(overview.total_engagement / overview.total_contents)
      : 0;
  const activity =
    engagementPerContent > 5000
      ? { label: "互动强度高", color: "border-red-200 bg-red-50 text-red-700" }
      : engagementPerContent > 1000
        ? {
            label: "互动较活跃",
            color: "border-amber-200 bg-amber-50 text-amber-700",
          }
        : {
            label: "互动常态",
            color: "border-emerald-200 bg-emerald-50 text-emerald-700",
          };

  return (
    <section className="grid gap-3 rounded-lg border border-[#e5e9f0] bg-[#f8fafc] p-3 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#3156d8]" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-[#1a3a5c]">智能舆情简报</h2>
        </div>
        <div className="space-y-1 text-xs leading-5 text-[#667085]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="flex max-w-md flex-wrap content-start items-center gap-1.5 lg:justify-end">
        <Badge variant="outline" className={cn("gap-1 text-[10px]", activity.color)}>
          <Activity className="h-2.5 w-2.5" aria-hidden="true" />
          {activity.label}
        </Badge>
        {topPlatforms.map((platform) => {
          const cfg = getPlatformConfig(platform.platform);
          return (
            <Badge
              key={platform.platform}
              variant="outline"
              className={cn("gap-1 text-[10px]", cfg.bgColor, cfg.color)}
            >
              {cfg.logoUrl && (
                <img src={cfg.logoUrl} alt="" className="h-2.5 w-2.5 object-contain" />
              )}
              {platform.platform_label}
              <span className="font-tabular opacity-70">
                {formatNumber(platform.content_count)}
              </span>
            </Badge>
          );
        })}
        {overview.keywords.slice(0, 5).map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="gap-0.5 text-[10px] text-[#667085]"
          >
            <Hash className="h-2.5 w-2.5" aria-hidden="true" />
            {keyword}
          </Badge>
        ))}
      </div>
    </section>
  );
}
