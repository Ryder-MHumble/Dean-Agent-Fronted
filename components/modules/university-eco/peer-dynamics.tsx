"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FlaskConical,
  Landmark,
  Award,
  Newspaper,
  Loader2,
} from "lucide-react";
import { SkeletonPeerDynamics } from "@/components/shared/skeleton-states";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, {
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import DataFreshness from "@/components/shared/data-freshness";
import { useDetailView } from "@/hooks/use-detail-view";
import { useUniversityFeed } from "@/hooks/use-university-feed";
import { fetchUniversityArticle } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PeerNewsItem, PeerNewsGroup } from "@/lib/types/university-eco";

type FilterTag = "all" | PeerNewsGroup;

const GROUP_CONFIG: Record<PeerNewsGroup, { label: string; color: string }> = {
  university_news: {
    label: "高校",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ai_institutes: {
    label: "研究机构",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  provincial: {
    label: "教育厅",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  awards: {
    label: "科技荣誉",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  aggregators: {
    label: "教育聚合",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

const FILTER_TABS: {
  value: FilterTag;
  label: string;
  icon?: typeof Building2;
}[] = [
  { value: "all", label: "全部" },
  { value: "university_news", label: "高校动态", icon: Building2 },
  { value: "ai_institutes", label: "研究机构", icon: FlaskConical },
  { value: "provincial", label: "教育厅", icon: Landmark },
  { value: "awards", label: "科技荣誉", icon: Award },
  { value: "aggregators", label: "教育聚合", icon: Newspaper },
];

function GroupBadge({ group }: { group: PeerNewsGroup }) {
  const c = GROUP_CONFIG[group];
  if (!c) return null;
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {c.label}
    </Badge>
  );
}

export default function PeerDynamics() {
  const {
    selectedItem: selectedNews,
    open,
    close,
    isOpen,
  } = useDetailView<PeerNewsItem>();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const activeGroup = activeFilter === "all" ? undefined : activeFilter;

  const { items, overview, isLoading, generatedAt, total, totalPages } =
    useUniversityFeed({
      group: activeGroup,
      page,
      pageSize,
    });

  const [articleContent, setArticleContent] = useState<{
    content?: string | null;
    images?: { src: string; alt: string | null }[];
  }>({});
  const [contentLoading, setContentLoading] = useState(false);

  const handleOpen = useCallback(
    async (news: PeerNewsItem) => {
      open(news);
      setArticleContent({});

      // If content is already available from the feed, no need to fetch
      if (news.content) return;

      // Try to fetch full article content
      if (news.url) {
        setContentLoading(true);
        try {
          const detail = await fetchUniversityArticle(news.id);
          if (detail) {
            setArticleContent({
              content: detail.content,
              images: detail.images,
            });
          }
        } catch {
          // Silently fail - detail view will show fallback
        } finally {
          setContentLoading(false);
        }
      }
    },
    [open],
  );

  const filteredNews = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [items]);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (overview) {
      counts.all = overview.total_articles;
      for (const group of overview.groups) {
        counts[group.group] = group.total_articles;
      }
      return counts;
    }
    counts.all = total;
    for (const item of items) {
      counts[item.group] = (counts[item.group] || 0) + 1;
    }
    return counts;
  }, [overview, total, items]);

  useEffect(() => {
    setPage(1);
    close();
    setArticleContent({});
  }, [activeFilter, close]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (isLoading) {
    return <SkeletonPeerDynamics />;
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 10rem)" }}>
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 mb-1 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_TABS.map((tab) => {
              const count = groupCounts[tab.value] ?? 0;
              if (tab.value !== "all" && count === 0) return null;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter((prev) =>
                      prev === tab.value && tab.value !== "all"
                        ? "all"
                        : tab.value,
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    activeFilter === tab.value
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {tab.icon && <tab.icon className="h-3 w-3" />}
                  {tab.label}
                  <span className="ml-0.5 text-[10px] opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <DataFreshness
              updatedAt={generatedAt ? new Date(generatedAt) : new Date()}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MasterDetailView
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedNews
              ? {
                  title: (
                    <h2 className="text-lg font-semibold leading-snug">
                      {selectedNews.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="flex items-center gap-2 mt-1.5">
                      <GroupBadge group={selectedNews.group} />
                      <span className="text-sm text-muted-foreground">
                        {selectedNews.sourceName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedNews.date}
                      </span>
                    </div>
                  ),
                  sourceUrl: selectedNews.url,
                }
              : undefined
          }
          detailContent={
            selectedNews && (
              <>
                {contentLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>加载原文内容...</span>
                  </div>
                )}
                <DetailArticleBody
                  aiAnalysis={
                    selectedNews.summary
                      ? {
                          title: "AI 摘要分析",
                          content: selectedNews.summary,
                          colorScheme: "indigo",
                        }
                      : undefined
                  }
                  content={
                    selectedNews.content || articleContent.content || undefined
                  }
                  summary={
                    !(selectedNews.content || articleContent.content)
                      ? selectedNews.title
                      : undefined
                  }
                  images={
                    selectedNews.images?.length
                      ? selectedNews.images
                      : articleContent.images
                  }
                  tags={selectedNews.tags}
                />
              </>
            )
          }
          detailFooter={
            selectedNews && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已加入重点跟踪");
                    close();
                  }}
                >
                  重点跟踪
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success("详细分析报告已生成")}
                >
                  生成报告
                </Button>
              </div>
            )
          }
        >
          <div className="flex flex-col gap-3 pb-2">
            <DateGroupedList
              key={`${activeFilter}-${page}`}
              items={filteredNews}
              emptyMessage="暂无同行动态"
              renderItem={(news) => (
                <DataItemCard
                  isSelected={selectedNews?.id === news.id}
                  onClick={() => handleOpen(news)}
                  accentColor="blue"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4
                      className={cn(
                        "text-sm font-semibold leading-snug flex-1 transition-colors",
                        accentConfig.blue.title,
                      )}
                    >
                      {news.title}
                    </h4>
                    <ItemChevron accentColor="blue" />
                  </div>
                  {news.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
                      {news.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GroupBadge group={news.group} />
                      <span className="text-[11px] text-muted-foreground">
                        {news.sourceName}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {news.date}
                    </span>
                  </div>
                </DataItemCard>
              )}
            />
            <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs text-muted-foreground">
              <span>
                第 {page}/{totalPages} 页，共 {total} 条
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((prev) => Math.max(1, prev - 1));
                    close();
                    setArticleContent({});
                  }}
                  disabled={page <= 1}
                >
                  上一页
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((prev) => Math.min(totalPages, prev + 1));
                    close();
                    setArticleContent({});
                  }}
                  disabled={page >= totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        </MasterDetailView>
      </div>
    </div>
  );
}
