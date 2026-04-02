"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FlaskConical,
  Landmark,
  Award,
  Newspaper,
  Loader2,
  SlidersHorizontal,
  Check,
  X,
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

function ArticleCover({
  imageUrl,
  fallbackText,
}: {
  imageUrl?: string | null;
  fallbackText: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imageUrl || imgFailed) {
    return (
      <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-700">
        {fallbackText.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="文章封面"
      loading="lazy"
      onError={() => setImgFailed(true)}
      className="h-20 w-32 shrink-0 rounded-xl object-cover border border-border/50"
    />
  );
}

function mergeNewsById(
  previous: PeerNewsItem[],
  incoming: PeerNewsItem[],
): PeerNewsItem[] {
  const map = new Map<string, PeerNewsItem>();
  for (const item of previous) {
    map.set(item.id, item);
  }
  for (const item of incoming) {
    map.set(item.id, item);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [loadedNews, setLoadedNews] = useState<PeerNewsItem[]>([]);
  const [requestingNextPage, setRequestingNextPage] = useState(false);
  const pageSize = 20;
  const activeGroup = activeFilter === "all" ? undefined : activeFilter;
  const selectedSourceIds = useMemo(
    () => Array.from(selectedSources).sort(),
    [selectedSources],
  );
  const sourceIdsKey = selectedSourceIds.join(",");

  const { items, overview, sources, isLoading, generatedAt, total, totalPages } =
    useUniversityFeed({
      group: activeGroup,
      sourceIds: selectedSourceIds.length > 0 ? selectedSourceIds : undefined,
      page,
      pageSize,
    });

  const [articleContent, setArticleContent] = useState<{
    content?: string | null;
    images?: { src: string; alt: string | null }[];
  }>({});
  const [contentLoading, setContentLoading] = useState(false);
  const [coverImageMap, setCoverImageMap] = useState<Record<string, string>>({});
  const coverLoadingIdsRef = useRef<Set<string>>(new Set());

  const handleOpen = useCallback(
    async (news: PeerNewsItem) => {
      open(news);
      setArticleContent({});

      if (news.content) return;

      if (news.url) {
        setContentLoading(true);
        try {
          const detail = await fetchUniversityArticle(news.id);
          if (detail) {
            setArticleContent({
              content: detail.content,
              images: detail.images,
            });
            const coverSrc = detail.images?.[0]?.src;
            if (coverSrc) {
              setCoverImageMap((prev) => {
                if (prev[news.id] === coverSrc) return prev;
                return { ...prev, [news.id]: coverSrc };
              });
            }
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

  useEffect(() => {
    const sortedPageItems = [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setLoadedNews((prev) =>
      page === 1 ? sortedPageItems : mergeNewsById(prev, sortedPageItems),
    );
  }, [items, page]);

  const sortedNews = useMemo(() => {
    return [...loadedNews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [loadedNews]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateCardCovers() {
      const pending = sortedNews
        .filter(
          (item) =>
            !(
              item.thumbnail ||
              item.images?.[0]?.src ||
              coverImageMap[item.id] ||
              coverLoadingIdsRef.current.has(item.id)
            ),
        )
        .slice(0, 6);

      if (pending.length === 0) return;

      for (const item of pending) {
        coverLoadingIdsRef.current.add(item.id);
      }

      const results = await Promise.all(
        pending.map(async (item) => {
          try {
            const detail = await fetchUniversityArticle(item.id);
            return {
              id: item.id,
              src: detail?.images?.[0]?.src ?? "",
            };
          } catch {
            return { id: item.id, src: "" };
          } finally {
            coverLoadingIdsRef.current.delete(item.id);
          }
        }),
      );

      if (cancelled) return;

      setCoverImageMap((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const result of results) {
          if (result.src && next[result.id] !== result.src) {
            next[result.id] = result.src;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }

    hydrateCardCovers();
    return () => {
      cancelled = true;
    };
  }, [sortedNews, coverImageMap]);

  const sourcesWithCount = useMemo(() => {
    if (sources.length > 0) {
      return sources
        .map((item) => ({
          id: item.source_id,
          label: item.source_name?.trim() || item.source_id,
          count: item.item_count ?? 0,
        }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-CN"));
    }

    const map = new Map<string, { label: string; count: number }>();
    for (const item of sortedNews) {
      const sourceLabel = item.sourceName?.trim() || "未知来源";
      const existing = map.get(item.sourceId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(item.sourceId, { label: sourceLabel, count: 1 });
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([id, value]) => ({ id, label: value.label, count: value.count }));
  }, [sources, sortedNews]);

  const availableSourceIds = useMemo(
    () => new Set(sourcesWithCount.map((s) => s.id)),
    [sourcesWithCount],
  );

  const effectiveSources = useMemo(() => {
    const filtered = new Set<string>();
    for (const source of selectedSources) {
      if (availableSourceIds.has(source)) {
        filtered.add(source);
      }
    }
    return filtered;
  }, [selectedSources, availableSourceIds]);

  const filteredBySourceNews = useMemo(() => {
    if (effectiveSources.size === 0) return sortedNews;
    return sortedNews.filter((item) => effectiveSources.has(item.sourceId));
  }, [sortedNews, effectiveSources]);

  const activeSourceCount = effectiveSources.size;

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSourceDropdownOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setSourceDropdownOpen(false);
    }, 150);
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(sourceId)) {
        next.delete(sourceId);
      } else {
        next.add(sourceId);
      }
      return next;
    });
  }, []);

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
    for (const item of loadedNews) {
      counts[item.group] = (counts[item.group] || 0) + 1;
    }
    return counts;
  }, [overview, total, loadedNews]);

  useEffect(() => {
    setPage(1);
    setLoadedNews([]);
    setSelectedSources(new Set());
    setRequestingNextPage(false);
    setCoverImageMap({});
    coverLoadingIdsRef.current.clear();
    close();
    setArticleContent({});
  }, [activeFilter, close]);

  useEffect(() => {
    setPage(1);
    setLoadedNews([]);
    setRequestingNextPage(false);
    setCoverImageMap({});
    coverLoadingIdsRef.current.clear();
    close();
    setArticleContent({});
  }, [sourceIdsKey, close]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!isLoading) {
      setRequestingNextPage(false);
    }
  }, [isLoading]);

  const canLoadMore = page < totalPages;
  const isLoadingNextPage = isLoading && page > 1;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !canLoadMore || isLoading || requestingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setRequestingNextPage(true);
        setPage((prev) => (prev < totalPages ? prev + 1 : prev));
      },
      {
        root: null,
        rootMargin: "0px 0px 260px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canLoadMore, isLoading, requestingNextPage, totalPages]);

  if (isLoading && loadedNews.length === 0) {
    return <SkeletonPeerDynamics />;
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 10rem)" }}>
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
            {sourcesWithCount.length > 0 && (
              <div
                className="relative shrink-0"
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-colors",
                    activeSourceCount > 0
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-background text-muted-foreground border-border hover:bg-muted",
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  信源筛选
                  {activeSourceCount > 0 && (
                    <Badge className="h-4 min-w-4 px-1 text-[10px] bg-blue-600 hover:bg-blue-600">
                      {activeSourceCount}
                    </Badge>
                  )}
                </button>

                {sourceDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-lg border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">信源渠道</span>
                        {activeSourceCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSources(new Set())}
                            className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            清除筛选
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto overscroll-contain p-1.5">
                      {sourcesWithCount.map(({ id, label, count }) => {
                        const checked = effectiveSources.has(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleSource(id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors",
                              checked ? "bg-blue-50" : "hover:bg-muted/60",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors",
                                checked
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-muted-foreground/30",
                              )}
                            >
                              {checked && (
                                <Check className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                            <span className="text-[12px] flex-1 truncate">
                              {label}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-tabular">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DataFreshness
              updatedAt={generatedAt ? new Date(generatedAt) : new Date()}
            />
          </div>
        </div>
        {activeSourceCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {Array.from(effectiveSources).map((sourceId) => {
              const source = sourcesWithCount.find((s) => s.id === sourceId);
              if (!source) return null;
              return (
                <button
                  key={sourceId}
                  type="button"
                  onClick={() => toggleSource(sourceId)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {source.label}
                  <X className="h-2.5 w-2.5" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedSources(new Set())}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              清除
            </button>
          </div>
        )}
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
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <GroupBadge group={selectedNews.group} />
                      <span className="text-sm text-muted-foreground font-medium">
                        来源：{selectedNews.sourceName || "未知来源"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        &middot;
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
              items={filteredBySourceNews}
              emptyMessage="暂无同行动态"
              renderItem={(news) => (
                <DataItemCard
                  isSelected={selectedNews?.id === news.id}
                  onClick={() => handleOpen(news)}
                  accentColor="blue"
                  className="p-0 overflow-hidden"
                >
                  <div className="px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-start gap-3">
                      <ArticleCover
                        imageUrl={
                          news.thumbnail ||
                          news.images?.[0]?.src ||
                          coverImageMap[news.id]
                        }
                        fallbackText={(news.sourceName || "源").trim()}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h4
                              className={cn(
                                "text-[15px] font-semibold leading-snug transition-colors",
                                accentConfig.blue.title,
                              )}
                            >
                              {news.title}
                            </h4>
                            {news.summary && (
                              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {news.summary}
                              </p>
                            )}
                          </div>
                          <ItemChevron accentColor="blue" />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <GroupBadge group={news.group} />
                          <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 max-w-full">
                            来源：{news.sourceName || "未知来源"}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {news.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DataItemCard>
              )}
            />

            <div ref={loadMoreRef} className="h-4" />
            {(isLoadingNextPage || canLoadMore) && (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
                {isLoadingNextPage ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    正在加载更多动态...
                  </>
                ) : (
                  "下拉到底自动加载更多"
                )}
              </div>
            )}
            {!canLoadMore && filteredBySourceNews.length > 0 && (
              <div className="text-center text-[11px] text-muted-foreground py-1">
                已加载全部 {loadedNews.length} 条
              </div>
            )}
          </div>
        </MasterDetailView>
      </div>
    </div>
  );
}
