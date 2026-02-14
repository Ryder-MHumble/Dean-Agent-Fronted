"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  TrendingUp,
  Newspaper,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Hash,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { IndustryNews, KOL } from "@/lib/types/tech-frontier";
import {
  mockIndustryNews,
  mockKOLs,
  mockTrendingKeywords,
} from "@/lib/mock-data/tech-frontier";

const platformColors: Record<string, string> = {
  X: "bg-black text-white",
  YouTube: "bg-red-600 text-white",
  ArXiv: "bg-red-100 text-red-700",
  GitHub: "bg-gray-800 text-white",
  微信公众号: "bg-green-600 text-white",
  知乎: "bg-blue-600 text-white",
};

const trendConfig: Record<string, { label: string; color: string }> = {
  surging: { label: "爆发", color: "bg-red-100 text-red-700 border-red-200" },
  rising: {
    label: "上升",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  stable: {
    label: "稳定",
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

const typeConfig: Record<IndustryNews["type"], { color: string; bg: string }> =
  {
    投融资: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    新产品: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
    政策: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
    收购: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  };

const impactConfig: Record<
  IndustryNews["impact"],
  { color: string; bg: string }
> = {
  重大: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  较大: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  一般: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

type DetailItem =
  | { kind: "news"; data: IndustryNews }
  | { kind: "kol"; data: KOL };

export default function DynamicsAndTrending() {
  const [expandedKeywords, setExpandedKeywords] = useState<Set<string>>(
    new Set([mockTrendingKeywords[0]?.id]),
  );
  const [selected, setSelected] = useState<DetailItem | null>(null);

  const toggleKeyword = (id: string) => {
    setExpandedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">热门关键词</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber
                  value={mockTrendingKeywords.length}
                  suffix="个"
                />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">行业动态</p>
              <p className="text-xl font-bold font-tabular text-cyan-600">
                <MotionNumber value={mockIndustryNews.length} suffix="条" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">活跃KOL</p>
              <p className="text-xl font-bold font-tabular text-blue-600">
                <MotionNumber value={mockKOLs.length} suffix="位" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)]">
        {/* Trending Keywords Section */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                热门关键词
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                按热度排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <StaggerContainer className="space-y-2">
              {mockTrendingKeywords.map((kw) => {
                const isExpanded = expandedKeywords.has(kw.id);
                const trend = trendConfig[kw.trend];
                return (
                  <StaggerItem key={kw.id}>
                    <div className="rounded-lg border">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => toggleKeyword(kw.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">
                            {kw.keyword}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", trend.color)}
                          >
                            {trend.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {kw.postCount} 条相关内容
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {kw.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="border-t px-3 pb-3 pt-2 space-y-2">
                          {kw.posts.map((post) => (
                            <a
                              key={post.id}
                              href={post.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/40 transition-colors group"
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
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {post.title}
                                  </span>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {post.summary}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
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
                          ))}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </CardContent>
        </Card>

        {/* Industry News Section */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-cyan-500" />
                行业动态
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                按影响等级排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[1fr_70px_70px_80px_70px_40px_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
              <span>标题</span>
              <span>来源</span>
              <span>类型</span>
              <span>日期</span>
              <span>影响</span>
              <span>原文</span>
              <span></span>
            </div>
            <StaggerContainer>
              {mockIndustryNews.map((news) => (
                <StaggerItem key={news.id}>
                  <button
                    type="button"
                    className="w-full grid grid-cols-[1fr_70px_70px_80px_70px_40px_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => setSelected({ kind: "news", data: news })}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        {news.impact === "重大" && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                        )}
                        <span className="text-sm font-medium group-hover:text-blue-600 transition-colors truncate">
                          {news.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {news.summary}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {news.source}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] w-fit",
                        typeConfig[news.type].bg,
                        typeConfig[news.type].color,
                      )}
                    >
                      {news.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {news.date}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] w-fit",
                        impactConfig[news.impact].bg,
                        impactConfig[news.impact].color,
                      )}
                    >
                      {news.impact}
                    </Badge>
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </CardContent>
        </Card>

        {/* KOL Section */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                学术KOL动态
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                按影响力排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[1fr_160px_70px_70px_1fr_40px_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
              <span>姓名</span>
              <span>机构</span>
              <span>h-index</span>
              <span>影响力</span>
              <span>近期动态</span>
              <span>主页</span>
              <span></span>
            </div>
            <StaggerContainer>
              {mockKOLs.map((kol) => (
                <StaggerItem key={kol.id}>
                  <button
                    type="button"
                    className="w-full grid grid-cols-[1fr_160px_70px_70px_1fr_40px_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => setSelected({ kind: "kol", data: kol })}
                  >
                    <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                      {kol.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {kol.affiliation}
                    </span>
                    <span className="text-xs font-mono font-medium">
                      {kol.hIndex}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] w-fit", {
                        "border-red-200 bg-red-50 text-red-700":
                          kol.influence === "极高",
                        "border-amber-200 bg-amber-50 text-amber-700":
                          kol.influence === "高",
                        "border-gray-200 bg-gray-50 text-gray-700":
                          kol.influence === "中",
                      })}
                    >
                      {kol.influence}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      {kol.recentActivity}
                    </span>
                    <a
                      href={kol.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg">
          {selected?.kind === "news" && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selected.data.title}
                </SheetTitle>
                <SheetDescription>
                  来源: {selected.data.source} · {selected.data.date} ·
                  影响评估: {selected.data.impact}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        typeConfig[selected.data.type].bg,
                        typeConfig[selected.data.type].color,
                      )}
                    >
                      {selected.data.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        impactConfig[selected.data.impact].bg,
                        impactConfig[selected.data.impact].color,
                      )}
                    >
                      影响: {selected.data.impact}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold mb-2">事件概要</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selected.data.summary}
                  </p>
                </div>
                <a
                  href={selected.data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  查看原始报道
                </a>
                <div>
                  <h4 className="text-sm font-semibold mb-2">与我院关联</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selected.data.relevance}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 border p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-foreground">
                      AI 参考分析
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selected.data.aiAnalysis}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success("已加入院长关注清单");
                      setSelected(null);
                    }}
                  >
                    加入关注清单
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("深度分析报告已生成")}
                  >
                    生成报告
                  </Button>
                </div>
              </div>
            </>
          )}
          {selected?.kind === "kol" && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selected.data.name}
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700":
                        selected.data.influence === "极高",
                      "border-amber-200 bg-amber-50 text-amber-700":
                        selected.data.influence === "高",
                      "border-gray-200 bg-gray-50 text-gray-700":
                        selected.data.influence === "中",
                    })}
                  >
                    影响力: {selected.data.influence}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selected.data.affiliation} · h-index:{" "}
                  {selected.data.hIndex} · 领域: {selected.data.field}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">近期动态</h4>
                  <p className="text-sm text-muted-foreground">
                    {selected.data.recentActivity}
                  </p>
                </div>
                <a
                  href={selected.data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  查看学术主页
                </a>
                <div>
                  <h4 className="text-sm font-semibold mb-2">人物简介</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selected.data.summary}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 border p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-foreground">
                      AI 合作建议
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selected.data.aiAnalysis}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success("已安排秘书准备对接材料");
                      setSelected(null);
                    }}
                  >
                    安排对接
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("KOL关系图谱已生成")}
                  >
                    查看关系图谱
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
