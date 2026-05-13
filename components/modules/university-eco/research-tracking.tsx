"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Lightbulb,
  Trophy,
  Loader2,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";
import { SkeletonResearchTracking } from "@/components/shared/skeleton-states";
import { MotionNumber } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, {
  ItemAvatar,
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ResearchOutput } from "@/lib/types/university-eco";
import { useUniversityResearch } from "@/hooks/use-university-research";
import { fetchUniversityArticle, fetchUniversitySources } from "@/lib/api";
import DataFreshness from "@/components/shared/data-freshness";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { normalizeUniversityInstitutionName } from "@/lib/university-source";

function TypeBadge({ type }: { type: ResearchOutput["type"] }) {
  const config = {
    论文: { color: "bg-blue-100 text-blue-700 border-blue-200" },
    专利: { color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    获奖: { color: "bg-amber-100 text-amber-700 border-amber-200" },
  };
  const c = config[type];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {type}
    </Badge>
  );
}

function InfluenceBadge({ level }: { level: ResearchOutput["influence"] }) {
  const config = {
    高: { color: "bg-red-100 text-red-700 border-red-200", label: "高影响力" },
    中: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "中影响力",
    },
    低: {
      color: "bg-green-100 text-green-700 border-green-200",
      label: "低影响力",
    },
  };
  const c = config[level];
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
      <ItemAvatar
        text={fallbackText.slice(0, 1)}
        className="h-20 w-32 rounded-xl bg-purple-50 text-purple-700"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="成果封面"
      loading="lazy"
      onError={() => setImgFailed(true)}
      className="h-20 w-32 shrink-0 rounded-xl object-cover border border-border/50"
    />
  );
}

export default function ResearchTracking() {
  const {
    selectedItem: selectedOutput,
    open,
    close,
    isOpen,
  } = useDetailView<ResearchOutput>();

  const [page, setPage] = useState(1);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [allSources, setAllSources] = useState<
    { id: string; label: string; count: number }[]
  >([]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const pageSize = 20;
  const selectedSourceIds = useMemo(
    () => Array.from(selectedSources).sort(),
    [selectedSources],
  );
  const sourceIdsKey = selectedSourceIds.join(",");
  const { items, typeStats, isLoading, generatedAt, itemCount, totalPages } =
    useUniversityResearch({
      sourceIds: selectedSourceIds.length > 0 ? selectedSourceIds : undefined,
      dateRange: { from: dateFrom, to: dateTo },
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
    async (output: ResearchOutput) => {
      open(output);
      setArticleContent({});

      if (output.content) return;

      setContentLoading(true);
      try {
        const detail = await fetchUniversityArticle(output.id);
        if (detail) {
          setArticleContent({
            content: detail.content,
            images: detail.images,
          });
        }
      } catch {
        // Silently fail
      } finally {
        setContentLoading(false);
      }
    },
    [open],
  );

  const metrics = useMemo(() => {
    if (!typeStats) {
      return { papers: 0, patents: 0, awards: 0 };
    }
    return {
      papers: typeStats.论文,
      patents: typeStats.专利,
      awards: typeStats.获奖,
    };
  }, [typeStats]);

  const sortedOutputs = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [items]);

  useEffect(() => {
    let cancelled = false;

    async function loadSources() {
      const data = await fetchUniversitySources();
      if (cancelled) return;

      if (!data) {
        setAllSources([]);
        return;
      }

      setAllSources(
        data.items
          .filter((item) => item.is_enabled)
          .map((item) => ({
            id: item.source_id,
            label: normalizeUniversityInstitutionName(
              item.source_name,
              item.source_id,
            ),
            count: item.item_count ?? 0,
          }))
          .sort(
            (a, b) =>
              b.count - a.count || a.label.localeCompare(b.label, "zh-CN"),
          ),
      );
    }

    loadSources();
    return () => {
      cancelled = true;
    };
  }, []);

  const sourcesWithCount = useMemo(() => {
    if (allSources.length > 0) {
      return allSources;
    }

    const map = new Map<string, { label: string; count: number }>();
    for (const item of sortedOutputs) {
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
  }, [allSources, sortedOutputs]);

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

  const filteredOutputs = useMemo(() => {
    if (effectiveSources.size === 0) return sortedOutputs;
    return sortedOutputs.filter((item) => effectiveSources.has(item.sourceId));
  }, [sortedOutputs, effectiveSources]);

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
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
    close();
    setArticleContent({});
  }, [sourceIdsKey, dateFrom, dateTo, close]);

  if (isLoading && sortedOutputs.length === 0) {
    return <SkeletonResearchTracking />;
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
      <div className="flex flex-wrap items-center justify-end gap-2 mb-3 shrink-0">
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

      {activeSourceCount > 0 && (
        <div className="flex items-center gap-2 mb-3 shrink-0">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 shrink-0">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">同行论文</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.papers} suffix="篇" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">新专利</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.patents} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">重大获奖</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.awards} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0">
        <MasterDetailView
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedOutput
              ? {
                  title: (
                    <h2 className="text-lg font-semibold">
                      {selectedOutput.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-sm text-muted-foreground">
                      <TypeBadge type={selectedOutput.type} />
                      <span>{selectedOutput.institution}</span>
                      <span>&middot;</span>
                      <span>{selectedOutput.field}</span>
                      <span>&middot;</span>
                      <span className="font-medium">
                        来源：{selectedOutput.sourceName || "未知来源"}
                      </span>
                      <span>&middot;</span>
                      <span>{selectedOutput.date}</span>
                    </div>
                  ),
                  sourceUrl: selectedOutput.sourceUrl ?? undefined,
                }
              : undefined
          }
          detailContent={
            selectedOutput && (
              <>
                {contentLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>加载原文内容...</span>
                  </div>
                )}
                <DetailArticleBody
                  aiAnalysis={{
                    title: "AI 竞争分析",
                    content: selectedOutput.aiAnalysis,
                    colorScheme: "purple",
                  }}
                  content={
                    selectedOutput.content ||
                    articleContent.content ||
                    undefined
                  }
                  summary={
                    !(selectedOutput.content || articleContent.content)
                      ? selectedOutput.detail
                      : undefined
                  }
                  images={
                    selectedOutput.images?.length
                      ? selectedOutput.images
                      : articleContent.images
                  }
                  extraMeta={
                    <div className="space-y-3">
                      <InfluenceBadge level={selectedOutput.influence} />
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          作者/团队
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedOutput.authors}
                        </p>
                      </div>
                    </div>
                  }
                />
              </>
            )
          }
          detailFooter={
            selectedOutput && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已加入重点跟踪列表");
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
          <div className="flex h-full min-h-0 flex-col gap-3">
            <div
              ref={listRef}
              aria-busy={isLoading}
              className={cn(
                "min-h-0 flex-1 overflow-y-auto pr-1 transition-opacity",
                isLoading && "opacity-60",
              )}
            >
              <DateGroupedList
                items={filteredOutputs}
                emptyMessage="暂无科研成果"
                renderItem={(output) => (
                <DataItemCard
                  isSelected={selectedOutput?.id === output.id}
                  onClick={() => handleOpen(output)}
                  accentColor="purple"
                  className="p-0 overflow-hidden"
                >
                  <div className="px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-start gap-3">
                      <ArticleCover
                        imageUrl={output.images?.[0]?.src}
                        fallbackText={(output.institution || "机").trim()}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <h4
                              className={cn(
                                "text-[15px] font-semibold leading-snug transition-colors",
                                accentConfig.purple.title,
                              )}
                            >
                              {output.title}
                            </h4>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground/80">
                                {output.institution}
                              </span>
                              <span>&middot;</span>
                              <span>{output.field}</span>
                              <span>&middot;</span>
                              <span>{output.date}</span>
                            </div>
                          </div>
                          <InfluenceBadge level={output.influence} />
                          <ItemChevron accentColor="purple" />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <TypeBadge type={output.type} />
                          <span className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 max-w-full">
                            来源：{output.sourceName || "未知来源"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                          作者/团队：{output.authors}
                        </p>
                      </div>
                    </div>
                  </div>
                  </DataItemCard>
                )}
              />
            </div>

            <FeedPagination
              page={page}
              pageSize={pageSize}
              total={itemCount}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              className="shrink-0"
            />
          </div>
        </MasterDetailView>
      </div>
    </div>
  );
}
