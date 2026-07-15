"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type ReactNode,
} from "react";
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
  ChevronRight,
} from "lucide-react";
import { SkeletonPeerDynamics } from "@/components/shared/skeleton-states";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { IntelligenceDetailHeader } from "@/components/shared/intelligence-detail";
import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
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

function getNewsDateTimestamp(value?: string) {
  const ts = Date.parse(value || "");
  return Number.isFinite(ts) ? ts : 0;
}

function sortNewsByDateDesc(a: PeerNewsItem, b: PeerNewsItem) {
  return getNewsDateTimestamp(b.date) - getNewsDateTimestamp(a.date);
}

export default function PeerDynamics({ tabs }: { tabs: ReactNode }) {
  const {
    selectedItem: selectedNews,
    open,
    close,
    isOpen,
  } = useDetailView<PeerNewsItem>();
  const [activeFilter, setActiveFilter] =
    useState<FilterTag>("university_news");
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
      dateFrom,
      dateTo,
      page,
      pageSize,
    });

  const [articleContent, setArticleContent] = useState<{
    content?: string | null;
    images?: { src: string; alt: string | null }[];
  }>({});
  const [contentLoading, setContentLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

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

  const sortedNews = useMemo(() => {
    return [...items].sort(sortNewsByDateDesc);
  }, [items]);

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

  const handleSourceBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setSourceDropdownOpen(false);
    }
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
    for (const item of sortedNews) {
      counts[item.group] = (counts[item.group] || 0) + 1;
    }
    return counts;
  }, [overview, total, sortedNews]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      close();
      setArticleContent({});
      setPage(nextPage);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    [close],
  );

  useEffect(() => {
    setPage(1);
    setSelectedSources(new Set());
    close();
    setArticleContent({});
  }, [activeFilter, close]);

  useEffect(() => {
    setPage(1);
    close();
    setArticleContent({});
  }, [sourceIdsKey, dateFrom, dateTo, close]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <IntelligenceToolbar
        title="高校生态"
        total={total}
        updatedAt={generatedAt ? new Date(generatedAt) : undefined}
      >
        <div className="w-full space-y-3">
          {tabs}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTER_TABS.map((tab) => {
                const count = groupCounts[tab.value] ?? 0;
                if (tab.value !== "all" && count === 0) return null;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    aria-pressed={activeFilter === tab.value}
                    onClick={() =>
                      setActiveFilter((prev) =>
                        prev === tab.value && tab.value !== "all"
                          ? "all"
                          : tab.value,
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8] focus-visible:ring-offset-2",
                      activeFilter === tab.value
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-[#e5e9f0] bg-white text-[#667085] hover:bg-[#f8fafc]",
                    )}
                  >
                    {tab.icon && <tab.icon className="h-3 w-3" aria-hidden="true" />}
                    {tab.label}
                    <span className="font-tabular text-[10px] opacity-70">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
            <DateRangeFilter
              from={dateFrom}
              to={dateTo}
              onFromChange={setDateFrom}
              onToChange={setDateTo}
              onClear={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="w-full min-w-0 md:w-auto md:shrink-0"
            />
            {sourcesWithCount.length > 0 && (
              <div
                className="relative shrink-0"
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleClose}
                onFocus={openDropdown}
                onBlur={handleSourceBlur}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSourceDropdownOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={openDropdown}
                  aria-haspopup="menu"
                  aria-expanded={sourceDropdownOpen}
                  aria-controls="peer-source-filter-menu"
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
                  <div
                    id="peer-source-filter-menu"
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-lg border bg-popover shadow-lg"
                  >
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
                            role="menuitemcheckbox"
                            aria-checked={checked}
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
            </div>
          </div>
          {activeSourceCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {Array.from(effectiveSources).map((sourceId) => {
                const source = sourcesWithCount.find((s) => s.id === sourceId);
                if (!source) return null;
                return (
                  <button
                    key={sourceId}
                    type="button"
                    onClick={() => toggleSource(sourceId)}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 hover:bg-blue-100"
                    aria-label={`移除信源筛选：${source.label}`}
                  >
                    {source.label}
                    <X className="h-2.5 w-2.5" aria-hidden="true" />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedSources(new Set())}
                className="text-[10px] text-[#667085] hover:text-[#1a3a5c]"
              >
                清除
              </button>
            </div>
          )}
        </div>
      </IntelligenceToolbar>

      <IntelligenceWorkspace
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedNews
            ? {
                title: (
                  <IntelligenceDetailHeader
                    badges={<GroupBadge group={selectedNews.group} />}
                    title={selectedNews.title}
                    meta={
                      <div className="flex flex-wrap items-center gap-2">
                        <span>来源：{selectedNews.sourceName || "未知来源"}</span>
                        <span>&middot;</span>
                        <span>
                          {selectedNews.displayDate ||
                            selectedNews.date ||
                            "未知日期"}
                        </span>
                      </div>
                    }
                  />
                ),
                sourceUrl: selectedNews.url,
              }
            : undefined
        }
        detailContent={
          selectedNews && (
            <>
              {contentLoading && (
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>加载原文内容...</span>
                </div>
              )}
              <DetailArticleBody
                aiAnalysis={
                  selectedNews.summary
                    ? {
                        title: "智能摘要分析",
                        content: selectedNews.summary,
                        colorScheme: "indigo",
                      }
                    : undefined
                }
                content={selectedNews.content || articleContent.content || undefined}
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
                className="flex-1 bg-[#3156d8] text-white hover:bg-[#2948bd]"
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
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
            <div
              ref={listRef}
              aria-busy={isLoading}
              className={cn(
                "min-h-0 overflow-y-auto overscroll-contain pr-1 transition-opacity",
                isLoading && "opacity-60",
              )}
            >
              {isLoading && sortedNews.length === 0 ? (
                <SkeletonPeerDynamics />
              ) : (
                <DateGroupedList
                  items={filteredBySourceNews}
                  emptyMessage="暂无同行动态"
                  animated={false}
                  renderItem={(news) => (
                    <IntelligenceListItem
                      selected={selectedNews?.id === news.id}
                      onClick={() => handleOpen(news)}
                      className="group overflow-hidden p-0"
                    >
                      <div className="px-4 py-3 sm:px-5 sm:py-4">
                        <div className="flex items-start gap-3">
                          <ArticleCover
                            imageUrl={news.thumbnail || news.images?.[0]?.src}
                            fallbackText={(news.sourceName || "源").trim()}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-[#3156d8]">
                                  {news.title}
                                </h4>
                                {news.summary && (
                                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                    {news.summary}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <GroupBadge group={news.group} />
                              <span className="inline-flex max-w-full items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                来源：{news.sourceName || "未知来源"}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {news.displayDate || news.date || "未知日期"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </IntelligenceListItem>
                  )}
                />
              )}
            </div>

            <FeedPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              className="shrink-0"
            />
        </div>
      </IntelligenceWorkspace>
    </div>
  );
}
