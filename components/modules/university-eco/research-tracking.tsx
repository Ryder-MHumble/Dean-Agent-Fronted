"use client";

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type ReactNode,
} from "react";
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
  ChevronRight,
} from "lucide-react";
import { SkeletonResearchTracking } from "@/components/shared/skeleton-states";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import { ItemAvatar } from "@/components/shared/data-item-card";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ResearchOutput } from "@/lib/types/university-eco";
import { useUniversityResearch } from "@/hooks/use-university-research";
import { fetchUniversityArticle, fetchUniversitySources } from "@/lib/api";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { IntelligenceDetailHeader } from "@/components/shared/intelligence-detail";
import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
import { useAutoSelectDetail } from "@/hooks/use-auto-select-detail";
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
        className="h-16 w-24 rounded-lg bg-purple-50 text-purple-700"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="成果封面"
      loading="lazy"
      onError={() => setImgFailed(true)}
      className="h-16 w-24 shrink-0 rounded-lg object-cover border border-border/50"
    />
  );
}

function getResearchOutputKey(item: ResearchOutput) {
  return item.id;
}

export default function ResearchTracking({ tabs }: { tabs: ReactNode }) {
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
  const detailRequestIdRef = useRef(0);

  const handleOpen = useCallback(
    async (output: ResearchOutput) => {
      const requestId = ++detailRequestIdRef.current;
      open(output);
      setArticleContent({});
      setContentLoading(false);

      if (output.content) return;

      setContentLoading(true);
      try {
        const detail = await fetchUniversityArticle(output.id);
        if (detail && detailRequestIdRef.current === requestId) {
          setArticleContent({
            content: detail.content,
            images: detail.images,
          });
        }
      } catch {
        // Silently fail
      } finally {
        if (detailRequestIdRef.current === requestId) {
          setContentLoading(false);
        }
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

  useAutoSelectDetail({
    items: filteredOutputs,
    selectedItem: selectedOutput,
    select: handleOpen,
    close,
    getKey: getResearchOutputKey,
    isLoading,
  });

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

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <IntelligenceWorkspace
        surface="integrated"
        listHeader={
          <IntelligenceToolbar
            variant="embedded"
            title="高校生态"
            total={itemCount}
            updatedAt={generatedAt ? new Date(generatedAt) : undefined}
            supplemental={
          <div className="grid grid-cols-3 divide-x divide-[#e5e9f0]">
            <div className="flex items-center gap-2 px-3 first:pl-0">
              <BookOpen className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <div>
                <p className="text-[11px] text-[#667085]">同行论文</p>
                <p className="font-tabular text-sm font-semibold text-[#1a3a5c]">
                  {metrics.papers.toLocaleString("zh-CN")} 篇
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Lightbulb
                className="h-4 w-4 text-emerald-500"
                aria-hidden="true"
              />
              <div>
                <p className="text-[11px] text-[#667085]">新专利</p>
                <p className="font-tabular text-sm font-semibold text-[#1a3a5c]">
                  {metrics.patents.toLocaleString("zh-CN")} 项
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <div>
                <p className="text-[11px] text-[#667085]">重大获奖</p>
                <p className="font-tabular text-sm font-semibold text-[#1a3a5c]">
                  {metrics.awards.toLocaleString("zh-CN")} 项
                </p>
              </div>
            </div>
          </div>
            }
          >
        <div className="w-full space-y-3">
          {tabs}
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
              className="w-full min-w-0"
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
                  aria-controls="research-source-filter-menu"
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
                    activeSourceCount > 0
                      ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  信源筛选
                  {activeSourceCount > 0 && (
                    <Badge className="h-4 min-w-4 bg-blue-600 px-1 text-[10px] hover:bg-blue-600">
                      {activeSourceCount}
                    </Badge>
                  )}
                </button>

                {sourceDropdownOpen && (
                  <div
                    id="research-source-filter-menu"
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-lg border bg-popover shadow-lg"
                  >
                    <div className="border-b px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">信源渠道</span>
                        {activeSourceCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSources(new Set())}
                            className="text-[11px] text-blue-600 hover:text-blue-800"
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
                              "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
                              checked ? "bg-blue-50" : "hover:bg-muted/60",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border",
                                checked
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-muted-foreground/30",
                              )}
                            >
                              {checked && (
                                <Check className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                            <span className="flex-1 truncate text-[12px]">
                              {label}
                            </span>
                            <span className="font-tabular text-[10px] text-muted-foreground">
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
        }
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedOutput
            ? {
                title: (
                  <IntelligenceDetailHeader
                    badges={
                      <div className="flex flex-wrap items-center gap-2">
                        <TypeBadge type={selectedOutput.type} />
                        <InfluenceBadge level={selectedOutput.influence} />
                      </div>
                    }
                    title={selectedOutput.title}
                    meta={
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{selectedOutput.institution}</span>
                        <span>&middot;</span>
                        <span>{selectedOutput.field}</span>
                        <span>&middot;</span>
                        <span>来源：{selectedOutput.sourceName || "未知来源"}</span>
                        <span>&middot;</span>
                        <span>{selectedOutput.date}</span>
                      </div>
                    }
                  />
                ),
                sourceUrl: selectedOutput.sourceUrl ?? undefined,
              }
            : undefined
        }
        detailContent={
          selectedOutput && (
            <>
              {contentLoading && (
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>加载原文内容...</span>
                </div>
              )}
              <DetailArticleBody
                aiAnalysis={{
                  title: "智能竞争分析",
                  content: selectedOutput.aiAnalysis,
                  colorScheme: "purple",
                }}
                content={
                  selectedOutput.content || articleContent.content || undefined
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
                  <div>
                    <h4 className="mb-1 text-sm font-semibold">作者/团队</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOutput.authors}
                    </p>
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
                className="flex-1 bg-[#3156d8] text-white hover:bg-[#2948bd]"
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
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
          <div
            ref={listRef}
            aria-busy={isLoading}
            className={cn(
              "min-h-0 overflow-y-auto overscroll-contain pr-1 transition-opacity",
              isLoading && "opacity-60",
            )}
          >
            {isLoading && sortedOutputs.length === 0 ? (
              <SkeletonResearchTracking />
            ) : (
              <DateGroupedList
                items={filteredOutputs}
                emptyMessage="暂无科研成果"
                variant="timeline"
                animated={false}
                renderItem={(output) => (
                  <IntelligenceListItem
                    selected={selectedOutput?.id === output.id}
                    onClick={() => handleOpen(output)}
                    className="group overflow-hidden p-0"
                  >
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-start gap-3">
                        <ArticleCover
                          imageUrl={output.images?.[0]?.src}
                          fallbackText={(output.institution || "机").trim()}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-[#3156d8]">
                                {output.title}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-muted-foreground">
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
                            <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <TypeBadge type={output.type} />
                            <span className="inline-flex max-w-full items-center rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                              来源：{output.sourceName || "未知来源"}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-muted-foreground">
                            作者/团队：{output.authors}
                          </p>
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
            total={itemCount}
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
