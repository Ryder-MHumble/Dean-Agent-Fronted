"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  PenTool,
  MessageSquareQuote,
  Newspaper,
  Hash,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import DataFreshness from "@/components/shared/data-freshness";
import TopicCard from "./topic-card";
import type { TechTopic } from "@/lib/types/tech-frontier";
import { mockTechTopics } from "@/lib/mock-data/tech-frontier";

type SortMode = "heat" | "gap" | "signals";

const heatOrder: Record<string, number> = {
  surging: 0,
  rising: 1,
  stable: 2,
  declining: 3,
};

const gapOrder: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/* ---------- Detail panel config (inlined from topic-detail-sheet) ---------- */

const heatConfig = {
  surging: { icon: TrendingUp, color: "text-red-500", bg: "bg-red-50", label: "飙升" },
  rising: { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", label: "上升" },
  stable: { icon: Activity, color: "text-blue-500", bg: "bg-blue-50", label: "稳定" },
  declining: { icon: TrendingDown, color: "text-gray-400", bg: "bg-gray-50", label: "下降" },
};

const platformColors: Record<string, string> = {
  X: "bg-black text-white",
  YouTube: "bg-red-600 text-white",
  ArXiv: "bg-red-100 text-red-700",
  GitHub: "bg-gray-800 text-white",
  微信公众号: "bg-green-600 text-white",
  知乎: "bg-blue-600 text-white",
};

const newsTypeColors: Record<string, { color: string; bg: string }> = {
  投融资: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  新产品: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
  政策: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  收购: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  合作: { color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
};

const impactColors: Record<string, { color: string; bg: string }> = {
  重大: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  较大: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  一般: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

const trendConfig: Record<string, { label: string; color: string }> = {
  surging: { label: "爆发", color: "bg-red-100 text-red-700 border-red-200" },
  rising: { label: "上升", color: "bg-amber-100 text-amber-700 border-amber-200" },
  stable: { label: "稳定", color: "bg-green-100 text-green-700 border-green-200" },
};

/* ---------- Component ---------- */

export default function TechPanorama() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { selectedItem: selectedTopic, open, close, isOpen } = useDetailView<TechTopic>();
  const [sortBy, setSortBy] = useState<SortMode>("heat");
  const [activeTab, setActiveTab] = useState("posts");

  const sortedTopics = useMemo(() => {
    const sorted = [...mockTechTopics];
    switch (sortBy) {
      case "heat":
        return sorted.sort(
          (a, b) => heatOrder[a.heatTrend] - heatOrder[b.heatTrend],
        );
      case "gap":
        return sorted.sort(
          (a, b) => gapOrder[a.gapLevel] - gapOrder[b.gapLevel],
        );
      case "signals":
        return sorted.sort((a, b) => b.totalSignals - a.totalSignals);
      default:
        return sorted;
    }
  }, [sortBy]);

  // Compute detail-panel derived values
  const heat = selectedTopic ? heatConfig[selectedTopic.heatTrend] : null;
  const HeatIcon = heat?.icon ?? null;
  const postCount = selectedTopic
    ? selectedTopic.trendingKeywords.reduce((sum, kw) => sum + kw.posts.length, 0)
    : 0;

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      listWidth={38}
      detailHeader={
        selectedTopic && heat && HeatIcon
          ? {
              title: (
                <h2 className="text-lg font-semibold flex items-center gap-2 flex-wrap">
                  {selectedTopic.topic}
                  <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium", heat.bg, heat.color)}>
                    <HeatIcon className="h-3 w-3" />
                    {heat.label} {selectedTopic.heatLabel}
                  </div>
                </h2>
              ),
              subtitle: (
                <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-green-200 bg-green-50 text-green-700": selectedTopic.ourStatus === "deployed",
                      "border-amber-200 bg-amber-50 text-amber-700": selectedTopic.ourStatus === "weak",
                      "border-red-200 bg-red-50 text-red-700": selectedTopic.ourStatus === "none",
                    })}
                  >
                    我院: {selectedTopic.ourStatusLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700": selectedTopic.gapLevel === "high",
                      "border-amber-200 bg-amber-50 text-amber-700": selectedTopic.gapLevel === "medium",
                      "border-green-200 bg-green-50 text-green-700": selectedTopic.gapLevel === "low",
                    })}
                  >
                    缺口: {selectedTopic.gapLevel === "high" ? "高" : selectedTopic.gapLevel === "medium" ? "中" : "低"}
                  </Badge>
                  <span className="text-[11px]">
                    {selectedTopic.totalSignals} 条信号 · 本周新增 {selectedTopic.signalsSinceLastWeek} 条
                  </span>
                </p>
              ),
            }
          : undefined
      }
      detailContent={
        selectedTopic ? (
          <div className="space-y-4">
            {/* AI Analysis Panel */}
            <div className="rounded-lg bg-purple-50 border border-purple-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold text-purple-700">AI 综合分析</span>
              </div>
              <p className="text-sm text-purple-700/80 leading-relaxed mb-3">{selectedTopic.aiSummary}</p>
              <div className="border-t border-purple-200 pt-2 mt-2">
                <span className="text-xs font-semibold text-purple-700">战略建议：</span>
                <p className="text-sm text-purple-700/80 leading-relaxed mt-1">{selectedTopic.aiInsight}</p>
              </div>
            </div>

            {/* Risk Assessment */}
            {selectedTopic.aiRiskAssessment && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-700">风险提示</span>
                </div>
                <p className="text-sm text-red-700/80 leading-relaxed">{selectedTopic.aiRiskAssessment}</p>
              </div>
            )}

            {/* Memo Suggestion */}
            {selectedTopic.memoSuggestion && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">内参建议</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-100"
                    onClick={() => toast.success("已转为内参选题")}
                  >
                    转为内参选题
                  </Button>
                </div>
                <p className="text-sm text-amber-700/80 leading-relaxed">{selectedTopic.memoSuggestion}</p>
              </div>
            )}

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="posts" className="text-xs gap-1.5 py-2">
                  <Hash className="h-3.5 w-3.5" />
                  动态与讨论 ({postCount})
                </TabsTrigger>
                <TabsTrigger value="news" className="text-xs gap-1.5 py-2">
                  <Newspaper className="h-3.5 w-3.5" />
                  行业新闻 ({selectedTopic.relatedNews.length})
                </TabsTrigger>
                <TabsTrigger value="kol" className="text-xs gap-1.5 py-2">
                  <MessageSquareQuote className="h-3.5 w-3.5" />
                  KOL 观点 ({selectedTopic.kolVoices.length})
                </TabsTrigger>
              </TabsList>

              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-3 space-y-4">
                {selectedTopic.trendingKeywords.map((kw) => {
                  const trend = trendConfig[kw.trend];
                  return (
                    <div key={kw.keyword} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{kw.keyword}</span>
                        <Badge variant="outline" className={cn("text-[10px]", trend?.color)}>
                          {trend?.label}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {kw.postCount} 条内容
                        </span>
                      </div>
                      <div className="space-y-1">
                        {kw.posts.map((post) => (
                          <a
                            key={post.id}
                            href={post.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors group"
                          >
                            <Badge className={cn("text-[9px] px-1.5 py-0.5 shrink-0 mt-0.5", platformColors[post.platform] || "bg-gray-100 text-gray-700")}>
                              {post.platform}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                                  {post.title}
                                </span>
                                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                                {post.summary}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                                <span>{post.author}</span>
                                <span>{post.date}</span>
                                {post.engagement && (
                                  <span className="font-medium text-foreground/70">{post.engagement}</span>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {selectedTopic.trendingKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">暂无相关动态</p>
                )}
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news" className="mt-3 space-y-2">
                {selectedTopic.relatedNews.map((news) => {
                  const tc = newsTypeColors[news.type] || { color: "text-gray-700", bg: "bg-gray-50" };
                  const ic = impactColors[news.impact] || { color: "text-gray-700", bg: "bg-gray-50" };
                  return (
                    <a
                      key={news.id}
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="outline" className={cn("text-[10px]", tc.bg, tc.color)}>
                          {news.type}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px]", ic.bg, ic.color)}>
                          影响: {news.impact}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground ml-auto">{news.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {news.summary}
                      </p>
                      <div className="rounded-md bg-muted/40 p-2 mt-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-medium">AI 分析</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {news.aiAnalysis}
                        </p>
                      </div>
                    </a>
                  );
                })}
                {selectedTopic.relatedNews.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">暂无相关新闻</p>
                )}
              </TabsContent>

              {/* KOL Tab */}
              <TabsContent value="kol" className="mt-3 space-y-2">
                {selectedTopic.kolVoices.map((kol) => (
                  <a
                    key={kol.id}
                    href={kol.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                        {kol.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", {
                          "border-red-200 bg-red-50 text-red-700": kol.influence === "极高",
                          "border-amber-200 bg-amber-50 text-amber-700": kol.influence === "高",
                          "border-gray-200 bg-gray-50 text-gray-700": kol.influence === "中",
                        })}
                      >
                        影响力{kol.influence}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {kol.date} · {kol.platform}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{kol.affiliation}</p>
                    <blockquote className="mt-2 border-l-2 border-blue-200 pl-3 py-1">
                      <p className="text-sm text-foreground/80 leading-relaxed italic">
                        &ldquo;{kol.statement}&rdquo;
                      </p>
                    </blockquote>
                  </a>
                ))}
                {selectedTopic.kolVoices.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">暂无KOL相关观点</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null
      }
      detailFooter={
        selectedTopic ? (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                toast.success("已安排技术委员会评估");
                close();
              }}
            >
              安排技术评估
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("详细技术报告已生成")}
            >
              生成报告
            </Button>
            {selectedTopic.memoSuggestion && (
              <Button
                variant="outline"
                onClick={() => toast.success("已转为内参选题")}
              >
                转为内参选题
              </Button>
            )}
          </div>
        ) : undefined
      }
    >
      {/* Topic List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">技术全景</CardTitle>
              <DataFreshness updatedAt={new Date(Date.now() - 7200000)} />
            </div>
            <div className="flex items-center gap-1">
              {[
                { key: "heat" as const, label: "按热度" },
                { key: "gap" as const, label: "按缺口" },
                { key: "signals" as const, label: "按信号量" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-medium transition-colors",
                    sortBy === key
                      ? "bg-foreground text-background"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_80px_90px_60px_100px_30px] gap-2 px-4 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
              <span>技术方向</span>
              <span>热度趋势</span>
              <span>我院状态</span>
              <span>缺口</span>
              <span>信号量</span>
              <span></span>
            </div>
            <StaggerContainer>
              {sortedTopics.map((topic) => (
                <StaggerItem key={topic.id}>
                  <TopicCard
                    topic={topic}
                    isExpanded={expandedId === topic.id}
                    isSelected={selectedTopic?.id === topic.id}
                    onToggleExpand={() =>
                      setExpandedId(expandedId === topic.id ? null : topic.id)
                    }
                    onViewAll={() => open(topic)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </CardContent>
      </Card>
    </MasterDetailView>
  );
}
