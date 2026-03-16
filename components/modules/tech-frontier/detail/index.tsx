"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, PenTool, ExternalLink, Star, Clock, Hash, Newspaper, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { DetailTarget, TechTopic, TopicNews, KOLVoice, Opportunity } from "@/lib/types/tech-frontier";
import { heatConfig, platformColors, newsTypeColors, impactColors, trendConfig, opportunityTypeConfig, opportunityPriorityConfig } from "@/lib/config/colors";
import { AIAnalysisBox } from "./ai-analysis-box";

// ── Topic Detail ───────────────────────────────────────────

function TopicDetailContent({ topic }: { topic: TechTopic }) {
  const postCount = topic.trendingKeywords.reduce((sum, kw) => sum + kw.posts.length, 0);

  return (
    <div className="space-y-4">
      <AIAnalysisBox summary={topic.aiSummary} insight={topic.aiInsight} variant="purple" />

      {topic.memoSuggestion && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">内参建议</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-100"
              onClick={() => toast.success("已转为内参选题")}>
              转为内参选题
            </Button>
          </div>
          <p className="text-sm text-amber-700/80 leading-relaxed">{topic.memoSuggestion}</p>
        </div>
      )}

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="posts" className="text-xs gap-1.5 py-2">
            <Hash className="h-3.5 w-3.5" />动态与讨论 ({postCount})
          </TabsTrigger>
          <TabsTrigger value="news" className="text-xs gap-1.5 py-2">
            <Newspaper className="h-3.5 w-3.5" />行业新闻 ({topic.relatedNews.length})
          </TabsTrigger>
          <TabsTrigger value="kol" className="text-xs gap-1.5 py-2">
            <MessageSquareQuote className="h-3.5 w-3.5" />KOL 观点 ({topic.kolVoices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-3 space-y-4">
          {topic.trendingKeywords.map((kw) => {
            const trend = trendConfig[kw.trend];
            return (
              <div key={kw.keyword} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{kw.keyword}</span>
                  <Badge variant="outline" className={cn("text-[10px]", trend?.color)}>{trend?.label}</Badge>
                  <span className="text-[11px] text-muted-foreground">{kw.postCount} 条内容</span>
                </div>
                <div className="space-y-1">
                  {kw.posts.map((post) => (
                    <a key={post.id} href={post.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors group">
                      <Badge className={cn("text-[9px] px-1.5 py-0.5 shrink-0 mt-0.5", platformColors[post.platform] || "bg-gray-100 text-gray-700")}>
                        {post.platform}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{post.summary}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span>{post.author}</span>
                          <span>{post.date}</span>
                          {post.engagement && <span className="font-medium text-foreground/70">{post.engagement}</span>}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
          {topic.trendingKeywords.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">暂无相关动态</p>
          )}
        </TabsContent>

        <TabsContent value="news" className="mt-3 space-y-2">
          {topic.relatedNews.map((news) => {
            const tc = newsTypeColors[news.type] || { color: "text-gray-700", bg: "bg-gray-50" };
            const ic = impactColors[news.impact] || { color: "text-gray-700", bg: "bg-gray-50" };
            return (
              <a key={news.id} href={news.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="block p-3 rounded-lg border hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className={cn("text-[10px]", tc.bg, tc.color)}>{news.type}</Badge>
                  <Badge variant="outline" className={cn("text-[10px]", ic.bg, ic.color)}>影响: {news.impact}</Badge>
                  <span className="text-[10px] text-muted-foreground ml-auto">{news.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">{news.title}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{news.summary}</p>
                <div className="rounded-md bg-muted/40 p-2 mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-medium">AI 分析</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{news.aiAnalysis}</p>
                </div>
              </a>
            );
          })}
          {topic.relatedNews.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">暂无相关新闻</p>}
        </TabsContent>

        <TabsContent value="kol" className="mt-3 space-y-2">
          {topic.kolVoices.map((kol) => (
            <a key={kol.id} href={kol.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="block p-3 rounded-lg border hover:bg-muted/30 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">{kol.name}</span>
                <Badge variant="outline" className={cn("text-[10px]", {
                  "border-red-200 bg-red-50 text-red-700": kol.influence === "极高",
                  "border-amber-200 bg-amber-50 text-amber-700": kol.influence === "高",
                  "border-gray-200 bg-gray-50 text-gray-700": kol.influence === "中",
                })}>
                  影响力{kol.influence}
                </Badge>
                <span className="text-[10px] text-muted-foreground ml-auto">{kol.date} · {kol.platform}</span>
              </div>
              <p className="text-xs text-muted-foreground">{kol.affiliation}</p>
              <blockquote className="mt-2 border-l-2 border-blue-200 pl-3 py-1">
                <p className="text-sm text-foreground/80 leading-relaxed italic">&ldquo;{kol.statement}&rdquo;</p>
              </blockquote>
            </a>
          ))}
          {topic.kolVoices.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">暂无KOL相关观点</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── News Detail ────────────────────────────────────────────

function NewsDetailContent({ news, parentTopic }: { news: TopicNews; parentTopic?: TechTopic }) {
  const tc = newsTypeColors[news.type] || { color: "text-gray-700", bg: "bg-gray-50" };
  const ic = impactColors[news.impact] || { color: "text-gray-700", bg: "bg-gray-50" };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", tc.bg, tc.color)}>{news.type}</Badge>
        <Badge variant="outline" className={cn("text-xs", ic.bg, ic.color)}>影响: {news.impact}</Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{news.summary}</p>
      <AIAnalysisBox analysis={news.aiAnalysis} variant="muted" title="AI 分析" />
      <p className="text-xs text-muted-foreground leading-relaxed">{news.relevance}</p>
      {parentTopic && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">相关方向:</span>
          <Badge variant="secondary" className="text-xs">{parentTopic.topic}</Badge>
        </div>
      )}
    </div>
  );
}

// ── KOL Detail ─────────────────────────────────────────────

function KOLDetailContent({ kol, parentTopic }: { kol: KOLVoice; parentTopic?: TechTopic }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold">{kol.name}</span>
        <Badge variant="outline" className={cn("text-[10px]", {
          "border-red-200 bg-red-50 text-red-700": kol.influence === "极高",
          "border-amber-200 bg-amber-50 text-amber-700": kol.influence === "高",
          "border-gray-200 bg-gray-50 text-gray-700": kol.influence === "中",
        })}>
          影响力{kol.influence}
        </Badge>
        <span className="text-xs text-muted-foreground">{kol.affiliation}</span>
        <span className="text-xs text-muted-foreground">{kol.platform} · {kol.date}</span>
      </div>
      <blockquote className="border-l-2 border-blue-200 pl-3 py-1">
        <p className="text-sm text-foreground/80 leading-relaxed italic">&ldquo;{kol.statement}&rdquo;</p>
      </blockquote>
      {parentTopic && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">相关方向:</span>
          <Badge variant="secondary" className="text-xs">{parentTopic.topic}</Badge>
        </div>
      )}
    </div>
  );
}

// ── Opportunity Detail ─────────────────────────────────────

function OpportunityDetailContent({ opp }: { opp: Opportunity }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", opportunityTypeConfig[opp.type].bg, opportunityTypeConfig[opp.type].color)}>
          {opp.type}
        </Badge>
        <Badge variant="outline" className={cn("text-xs", opportunityPriorityConfig[opp.priority].bg, opportunityPriorityConfig[opp.priority].color)}>
          优先级: {opp.priority}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
          <Clock className="h-3.5 w-3.5" />
          <span>截止: {opp.deadline}</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">机会详情</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{opp.summary}</p>
      </div>
      <AIAnalysisBox title="AI 优先级评估" analysis={opp.aiAssessment} variant="teal" />
      <div className="rounded-lg bg-slate-50 border p-3">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold">建议行动</span>
        </div>
        <p className="text-sm text-muted-foreground">{opp.actionSuggestion}</p>
      </div>
    </div>
  );
}

// ── Main exported dispatcher ───────────────────────────────

interface DetailContentProps {
  target: DetailTarget;
}

export function DetailContent({ target }: DetailContentProps) {
  switch (target.kind) {
    case "topic": return <TopicDetailContent topic={target.data} />;
    case "news": return <NewsDetailContent news={target.data} parentTopic={target.parentTopic} />;
    case "kol": return <KOLDetailContent kol={target.data} parentTopic={target.parentTopic} />;
    case "opportunity": return <OpportunityDetailContent opp={target.data} />;
    default: return null;
  }
}

// ── Header helper ──────────────────────────────────────────

export function getDetailHeader(
  target: DetailTarget,
): { title: ReactNode; subtitle?: ReactNode } | undefined {
  switch (target.kind) {
    case "topic": {
      const topic = target.data;
      return {
        title: <h2 className="text-lg font-semibold">{topic.topic}</h2>,
        subtitle: <p className="text-sm text-muted-foreground">{topic.description}</p>,
      };
    }
    case "news": {
      const news = target.data;
      return {
        title: <h2 className="text-lg font-semibold">{news.title}</h2>,
        subtitle: <p className="text-sm text-muted-foreground">来源: {news.source} · {news.date}</p>,
      };
    }
    case "kol": {
      const kol = target.data;
      return {
        title: <h2 className="text-lg font-semibold">{kol.name}</h2>,
        subtitle: <p className="text-sm text-muted-foreground">{kol.affiliation} · {kol.platform}</p>,
      };
    }
    case "opportunity": {
      const opp = target.data;
      return {
        title: <h2 className="text-lg font-semibold">{opp.name}</h2>,
        subtitle: <p className="text-sm text-muted-foreground">来源: {opp.source} · 截止日期: {opp.deadline}</p>,
      };
    }
    default: return undefined;
  }
}

// ── Footer helper ──────────────────────────────────────────

export function getDetailFooter(
  target: DetailTarget,
  onClose: () => void,
): ReactNode | undefined {
  switch (target.kind) {
    case "topic": {
      const topic = target.data;
      return (
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => { toast.success("已安排技术委员会评估"); onClose(); }}>安排技术评估</Button>
          <Button variant="outline" onClick={() => toast.success("详细技术报告已生成")}>生成报告</Button>
          {topic.memoSuggestion && (
            <Button variant="outline" onClick={() => toast.success("已转为内参选题")}>转为内参选题</Button>
          )}
        </div>
      );
    }
    case "news": return undefined;
    case "kol": return undefined;
    case "opportunity": {
      return (
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => { toast.success("已列入院长待办事项"); onClose(); }}>立即跟进</Button>
          <Button variant="outline" onClick={() => toast.success("机会分析报告已生成")}>生成分析报告</Button>
        </div>
      );
    }
    default: return undefined;
  }
}
