"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { ExpandableSection } from "@/components/motion";
import { cn } from "@/lib/utils";
import type {
  TechTopic,
  TrendingPost,
  TopicNews,
  KOLVoice,
} from "@/lib/types/tech-frontier";

const heatConfig = {
  surging: {
    icon: TrendingUp,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "飙升",
  },
  rising: {
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-50",
    label: "上升",
  },
  stable: {
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "稳定",
  },
  declining: {
    icon: TrendingDown,
    color: "text-gray-400",
    bg: "bg-gray-50",
    label: "下降",
  },
};

const platformColors: Record<string, string> = {
  X: "bg-black text-white",
  YouTube: "bg-red-600 text-white",
  ArXiv: "bg-red-100 text-red-700",
  GitHub: "bg-gray-800 text-white",
  微信公众号: "bg-green-600 text-white",
  知乎: "bg-blue-600 text-white",
};

const kolPlatformColors: Record<string, string> = {
  X: "bg-black text-white",
  会议: "bg-indigo-100 text-indigo-700",
  论文: "bg-red-100 text-red-700",
  博客: "bg-emerald-100 text-emerald-700",
  播客: "bg-purple-100 text-purple-700",
};

const newsTypeColors: Record<string, { color: string; bg: string }> = {
  投融资: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  新产品: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
  政策: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  收购: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  合作: { color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
};

type SignalFilter = "all" | "posts" | "news" | "kol";

type SignalItem =
  | { kind: "post"; data: TrendingPost; keyword: string }
  | { kind: "news"; data: TopicNews }
  | { kind: "kol"; data: KOLVoice };

interface TopicCardProps {
  topic: TechTopic;
  isExpanded: boolean;
  isSelected?: boolean;
  onToggleExpand: () => void;
  onViewAll: () => void;
}

export default function TopicCard({
  topic,
  isExpanded,
  isSelected,
  onToggleExpand,
  onViewAll,
}: TopicCardProps) {
  const [filter, setFilter] = useState<SignalFilter>("all");

  const heat = heatConfig[topic.heatTrend];
  const HeatIcon = heat.icon;

  const postCount = topic.trendingKeywords.reduce(
    (sum, kw) => sum + kw.posts.length,
    0,
  );
  const newsCount = topic.relatedNews.length;
  const kolCount = topic.kolVoices.length;

  const allSignals: SignalItem[] = useMemo(() => {
    const items: SignalItem[] = [];
    for (const kw of topic.trendingKeywords) {
      for (const post of kw.posts) {
        items.push({ kind: "post", data: post, keyword: kw.keyword });
      }
    }
    for (const news of topic.relatedNews) {
      items.push({ kind: "news", data: news });
    }
    for (const kol of topic.kolVoices) {
      items.push({ kind: "kol", data: kol });
    }
    items.sort((a, b) => {
      const dateA = "date" in a.data ? a.data.date : "";
      const dateB = "date" in b.data ? b.data.date : "";
      return dateB.localeCompare(dateA);
    });
    return items;
  }, [topic]);

  const filteredSignals = useMemo(() => {
    if (filter === "all") return allSignals;
    if (filter === "posts") return allSignals.filter((s) => s.kind === "post");
    if (filter === "news") return allSignals.filter((s) => s.kind === "news");
    return allSignals.filter((s) => s.kind === "kol");
  }, [allSignals, filter]);

  const previewSignals = filteredSignals.slice(0, 4);

  return (
    <div className={cn("border-b last:border-0", isSelected && "bg-muted/40")}>
      {/* Collapsed Header */}
      <button
        type="button"
        className="w-full grid grid-cols-[1fr_80px_90px_60px_100px_30px] gap-2 px-4 py-3.5 items-center text-left hover:bg-muted/30 transition-colors group cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          {topic.gapLevel === "high" && (
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
          )}
          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            {topic.topic}
          </span>
          <div className="flex items-center gap-1 ml-1">
            {topic.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[9px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
            heat.bg,
            heat.color,
          )}
        >
          <HeatIcon className="h-3 w-3" />
          {heat.label}
        </div>

        <Badge
          variant="outline"
          className={cn("text-[10px] w-fit", {
            "border-green-200 bg-green-50 text-green-700":
              topic.ourStatus === "deployed",
            "border-amber-200 bg-amber-50 text-amber-700":
              topic.ourStatus === "weak",
            "border-red-200 bg-red-50 text-red-700": topic.ourStatus === "none",
          })}
        >
          {topic.ourStatusLabel}
        </Badge>

        <Badge
          variant="outline"
          className={cn("text-[10px] w-fit", {
            "border-red-200 bg-red-50 text-red-700": topic.gapLevel === "high",
            "border-amber-200 bg-amber-50 text-amber-700":
              topic.gapLevel === "medium",
            "border-green-200 bg-green-50 text-green-700":
              topic.gapLevel === "low",
          })}
        >
          {topic.gapLevel === "high"
            ? "高"
            : topic.gapLevel === "medium"
              ? "中"
              : "低"}
        </Badge>

        <span className="text-xs text-muted-foreground">
          {topic.totalSignals} 条信号
        </span>

        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Section */}
      <ExpandableSection isOpen={isExpanded}>
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          {/* AI Summary */}
          <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-700">
                AI 摘要
              </span>
            </div>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              {topic.aiSummary}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {[
              { key: "all" as const, label: `全部(${allSignals.length})` },
              { key: "posts" as const, label: `动态(${postCount})` },
              { key: "news" as const, label: `新闻(${newsCount})` },
              { key: "kol" as const, label: `KOL(${kolCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                  filter === key
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setFilter(key);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Signal Preview List */}
          <div className="space-y-1.5">
            {previewSignals.map((signal) => {
              if (signal.kind === "post") {
                const post = signal.data;
                return (
                  <a
                    key={post.id}
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors group/item"
                  >
                    <Badge
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 shrink-0 mt-0.5",
                        platformColors[post.platform] ||
                          "bg-gray-100 text-gray-700",
                      )}
                    >
                      {post.platform}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium group-hover/item:text-blue-600 transition-colors line-clamp-1">
                          {post.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                        {post.engagement && (
                          <span className="font-medium text-foreground/70">
                            {post.engagement}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              }

              if (signal.kind === "news") {
                const news = signal.data;
                const tc = newsTypeColors[news.type] || {
                  color: "text-gray-700",
                  bg: "bg-gray-50",
                };
                return (
                  <a
                    key={news.id}
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors group/item"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 shrink-0 mt-0.5",
                        tc.bg,
                        tc.color,
                      )}
                    >
                      {news.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium group-hover/item:text-blue-600 transition-colors line-clamp-1">
                          {news.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.date}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] px-1 py-0",
                            news.impact === "重大"
                              ? "border-red-200 text-red-600"
                              : news.impact === "较大"
                                ? "border-amber-200 text-amber-600"
                                : "border-gray-200 text-gray-500",
                          )}
                        >
                          {news.impact}
                        </Badge>
                      </div>
                    </div>
                  </a>
                );
              }

              // KOL Voice
              const kol = signal.data;
              return (
                <a
                  key={kol.id}
                  href={kol.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors group/item"
                >
                  <Badge
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 shrink-0 mt-0.5",
                      kolPlatformColors[kol.platform] ||
                        "bg-gray-100 text-gray-700",
                    )}
                  >
                    {kol.name}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium group-hover/item:text-blue-600 transition-colors line-clamp-1">
                        &ldquo;{kol.statement}&rdquo;
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                      <span>{kol.affiliation}</span>
                      <span>{kol.date}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-[8px] px-1 py-0", {
                          "border-red-200 text-red-600":
                            kol.influence === "极高",
                          "border-amber-200 text-amber-600":
                            kol.influence === "高",
                          "border-gray-200 text-gray-500":
                            kol.influence === "中",
                        })}
                      >
                        影响力{kol.influence}
                      </Badge>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700 gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewAll();
              }}
            >
              查看全部 {allSignals.length} 条信号
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
}
