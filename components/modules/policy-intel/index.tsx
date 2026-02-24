"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";
import { MotionCard } from "@/components/motion";
import DataFreshness from "@/components/shared/data-freshness";
import { cn } from "@/lib/utils";
import PolicyFeed from "./policy-feed";
import { usePolicyFeed } from "@/hooks/use-policy-opportunities";
import { SkeletonSubPage } from "@/components/shared/skeleton-states";
import type { PolicyFeedCategory } from "@/lib/types/policy-intel";

const CATEGORIES: {
  label: string;
  value: PolicyFeedCategory | "全部";
}[] = [
  { label: "全部", value: "全部" },
  { label: "国家政策", value: "国家政策" },
  { label: "北京政策", value: "北京政策" },
  { label: "领导讲话", value: "领导讲话" },
  { label: "政策机会", value: "政策机会" },
];

export default function PolicyIntelModule() {
  const {
    items: feedItems,
    isLoading,
    isUsingMock,
    generatedAt,
  } = usePolicyFeed();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    PolicyFeedCategory | "全部"
  >("全部");
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const isSearching = searchQuery.trim().length > 0;

  // Extract unique source channels with counts (computed from category-filtered items)
  const sourcesWithCount = useMemo(() => {
    let base = feedItems;
    if (activeCategory !== "全部") {
      base = base.filter((n) => n.category === activeCategory);
    }
    const map = new Map<string, number>();
    for (const item of base) {
      map.set(item.source, (map.get(item.source) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [feedItems, activeCategory]);

  // Reset source selection when category changes and selected sources are no longer available
  const availableSourceNames = useMemo(
    () => new Set(sourcesWithCount.map((s) => s.name)),
    [sourcesWithCount],
  );

  const effectiveSources = useMemo(() => {
    const filtered = new Set<string>();
    for (const s of selectedSources) {
      if (availableSourceNames.has(s)) filtered.add(s);
    }
    return filtered;
  }, [selectedSources, availableSourceNames]);

  const isAllSourcesSelected = effectiveSources.size === 0;

  const toggleSource = (source: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  };

  const filteredFeed = useMemo(() => {
    let items = feedItems;
    if (activeCategory !== "全部") {
      items = items.filter((n) => n.category === activeCategory);
    }
    if (!isAllSourcesSelected) {
      items = items.filter((n) => effectiveSources.has(n.source));
    }
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          (n.leader && n.leader.toLowerCase().includes(q)),
      );
    }
    return items;
  }, [
    feedItems,
    activeCategory,
    effectiveSources,
    isAllSourcesSelected,
    searchQuery,
    isSearching,
  ]);

  const activeSourceCount = effectiveSources.size;

  if (isLoading) return <SkeletonSubPage />;

  return (
    <div className="p-5 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-hidden">
      <MotionCard delay={0} className="shrink-0">
        <Card className="shadow-card">
          <CardContent className="p-4 space-y-3">
            {/* Row 1: Search + Source filter trigger */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索政策、机构、关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 h-9 text-sm rounded-lg bg-muted/30 border-border/50 focus:bg-white transition-colors"
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Source filter dropdown (hover) */}
              {sourcesWithCount.length > 0 && (
                <div
                  className="relative shrink-0"
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium transition-colors",
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
                    <div className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-lg border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2.5 border-b">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            信源渠道
                          </span>
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
                      <div className="max-h-64 overflow-y-auto overscroll-contain p-1.5">
                        {sourcesWithCount.map(({ name, count }) => {
                          const checked = effectiveSources.has(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => toggleSource(name)}
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
                                {name}
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

            {/* Row 2: Category pills + active source tags + meta */}
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setActiveCategory((prev) =>
                      prev === cat.value && cat.value !== "全部"
                        ? "全部"
                        : cat.value,
                    );
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
                    activeCategory === cat.value
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cat.label}
                </button>
              ))}

              {/* Active source filter tags */}
              {activeSourceCount > 0 && activeSourceCount <= 3 && (
                <>
                  <div className="h-4 w-px bg-border mx-0.5" />
                  {Array.from(effectiveSources).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSource(s)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {s}
                      <X className="h-2.5 w-2.5" />
                    </button>
                  ))}
                </>
              )}
              {activeSourceCount > 3 && (
                <>
                  <div className="h-4 w-px bg-border mx-0.5" />
                  <span className="text-[10px] text-blue-600 font-medium">
                    已选 {activeSourceCount} 个信源
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSources(new Set())}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    清除
                  </button>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                {isUsingMock && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    未连接后端服务
                  </span>
                )}
                <DataFreshness
                  updatedAt={
                    generatedAt
                      ? new Date(generatedAt)
                      : new Date(Date.now() - 1800000)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard delay={0.1} className="flex-1 min-h-0 overflow-hidden">
        <PolicyFeed key={activeCategory + searchQuery} items={filteredFeed} />
      </MotionCard>
    </div>
  );
}
