"use client";

import { useMemo } from "react";
import { Sparkles, TrendingUp, AlertCircle, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { getPlatformConfig } from "@/lib/config/platforms";
import type { SentimentOverview } from "@/lib/types/internal-mgmt";

interface SentimentReportProps {
  overview: SentimentOverview;
}

function buildReportParagraphs(overview: SentimentOverview): string[] {
  const { total_contents, total_comments, total_engagement, platforms, top_content, keywords } =
    overview;

  // Sort platforms by content count
  const topPlatforms = [...platforms].sort((a, b) => b.content_count - a.content_count);
  const dominant = topPlatforms[0];
  const dominantPct = dominant
    ? Math.round((dominant.content_count / total_contents) * 100)
    : 0;

  // Top content by engagement
  const topItem = top_content[0];
  const topEngagement = topItem
    ? topItem.liked_count + topItem.comment_count + topItem.share_count + topItem.collected_count
    : 0;

  // Build paragraphs
  const p1 = `当前舆情监测共收录 ${formatNumber(total_contents)} 条社媒内容，累计评论 ${formatNumber(total_comments)} 条，总互动量达 ${formatNumber(total_engagement)}，覆盖 ${platforms.length} 个平台。` +
    (dominant ? `其中${dominant.platform_label}占比最高，贡献了 ${dominantPct}% 的内容来源（${dominant.content_count} 条）。` : "");

  const platformDetail = topPlatforms
    .slice(0, 3)
    .map((p) => `${p.platform_label} ${formatNumber(p.total_likes + p.total_comments)} 次互动`)
    .join("、");

  const p2 = platformDetail
    ? `各平台互动分布：${platformDetail}。整体来看，用户参与度较为活跃，评论与点赞比较均衡。`
    : "";

  const p3 = topItem
    ? `热度最高的内容来自「${topItem.nickname || "匿名用户"}」，标题为《${topItem.title.slice(0, 30)}${topItem.title.length > 30 ? "…" : ""}》，累计互动 ${formatNumber(topEngagement)} 次，是当前舆论场的核心焦点内容。`
    : "";

  const p4 = keywords && keywords.length > 0
    ? `高频关键词涵盖：${keywords.slice(0, 6).join("、")}等，反映了当前社媒讨论的主要议题方向。建议持续关注相关话题动态，及时研判舆情走向。`
    : "建议持续关注社媒平台动态，及时研判舆情走向，做好预警响应准备。";

  return [p1, p2, p3, p4].filter(Boolean);
}

export function SentimentReport({ overview }: SentimentReportProps) {
  const paragraphs = useMemo(() => buildReportParagraphs(overview), [overview]);

  const topPlatforms = useMemo(
    () => [...overview.platforms].sort((a, b) => b.content_count - a.content_count).slice(0, 3),
    [overview.platforms],
  );

  // Simple sentiment signal: high engagement relative to content = active discussion
  const engagementPerContent = overview.total_contents > 0
    ? Math.round(overview.total_engagement / overview.total_contents)
    : 0;
  const alertLevel: "normal" | "active" | "hot" =
    engagementPerContent > 5000 ? "hot" : engagementPerContent > 1000 ? "active" : "normal";

  const alertConfig = {
    normal: { label: "舆情平稳", color: "bg-green-50 text-green-700 border-green-200" },
    active: { label: "讨论活跃", color: "bg-amber-50 text-amber-700 border-amber-200" },
    hot: { label: "热度较高", color: "bg-red-50 text-red-700 border-red-200" },
  }[alertLevel];

  return (
    <Card className="bg-gradient-to-br from-purple-50/60 via-slate-50/40 to-blue-50/50 border-purple-100/80 shadow-card">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-xs font-semibold text-foreground">AI 舆情简报</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-medium border", alertConfig.color)}
            >
              {alertLevel === "hot" ? (
                <AlertCircle className="h-2.5 w-2.5 mr-1" />
              ) : (
                <TrendingUp className="h-2.5 w-2.5 mr-1" />
              )}
              {alertConfig.label}
            </Badge>
          </div>
        </div>

        {/* Paragraphs */}
        <div className="space-y-2 mb-3">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[13px] leading-relaxed text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Platform pills + keywords row */}
        <div className="flex items-center flex-wrap gap-1.5 pt-2.5 border-t border-purple-100/60">
          {topPlatforms.map((p) => {
            const cfg = getPlatformConfig(p.platform);
            return (
              <span
                key={p.platform}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                  cfg.bgColor,
                  cfg.color,
                )}
              >
                {cfg.logoUrl && (
                  <img src={cfg.logoUrl} alt="" className="h-2.5 w-2.5 object-contain" />
                )}
                {p.platform_label}
                <span className="opacity-60">{p.content_count}</span>
              </span>
            );
          })}
          {overview.keywords.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
            >
              <Hash className="h-2 w-2" />
              {kw}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
