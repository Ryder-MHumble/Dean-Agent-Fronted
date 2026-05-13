"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X, WifiOff } from "lucide-react";
import { MotionCard } from "@/components/motion";
import DataFreshness from "@/components/shared/data-freshness";
import { SkeletonTalentRadar } from "@/components/shared/skeleton-states";
import { cn } from "@/lib/utils";
import NewsFeed from "./news-feed";
import PersonCard from "./person-card";
import { usePersonnelNews } from "@/hooks/use-personnel-news";
import DateRangeFilter from "@/components/shared/date-range-filter";
import type { PersonnelNewsCategory } from "@/lib/types/talent-radar";

const CATEGORIES: { label: string; value: PersonnelNewsCategory | "全部" }[] = [
  { label: "全部", value: "全部" },
  { label: "政府人事", value: "政府人事" },
  { label: "高校人事", value: "高校人事" },
  { label: "人才要闻", value: "人才要闻" },
];

const PAGE_SIZE = 20;

export default function TalentRadarModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    PersonnelNewsCategory | "全部"
  >("全部");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    items: newsItems,
    profiles: allProfiles,
    isLoading,
    isUsingMock,
    generatedAt,
    total,
    totalPages,
  } = usePersonnelNews({
    category: activeCategory,
    keyword: searchQuery,
    page,
    pageSize: PAGE_SIZE,
    dateRange: { from: dateFrom, to: dateTo },
  });

  const isSearching = searchQuery.trim().length > 0;

  const matchedProfiles = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.trim().toLowerCase();
    return allProfiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        (p.field && p.field.toLowerCase().includes(q)),
    );
  }, [allProfiles, searchQuery, isSearching]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeCategory, dateFrom, dateTo]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const freshnessDate = generatedAt
    ? new Date(generatedAt)
    : new Date(Date.now() - 1800000);

  if (isLoading && newsItems.length === 0) {
    return <SkeletonTalentRadar />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-hidden px-5 pt-5 pb-20 md:pb-1">
      <MotionCard delay={0}>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索人物、机构... 例如「大学校长」「基金委」「发改委」"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-11 text-sm rounded-xl bg-muted/30 border-border/50 focus:bg-white transition-colors"
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setActiveCategory((prev) =>
                        prev === cat.value && cat.value !== "全部"
                          ? "全部"
                          : cat.value,
                      )
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      activeCategory === cat.value
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
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
              <div className="ml-auto flex items-center gap-2">
                {isUsingMock && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 gap-1 text-amber-600 border-amber-200"
                  >
                    <WifiOff className="h-3 w-3" />
                    静态数据
                  </Badge>
                )}
                <DataFreshness updatedAt={freshnessDate} />
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      {matchedProfiles.length > 0 && (
        <MotionCard delay={0.1}>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground px-1">
              找到 {matchedProfiles.length} 个相关人物
            </p>
            {matchedProfiles.map((profile) => (
              <PersonCard key={profile.name} profile={profile} />
            ))}
          </div>
        </MotionCard>
      )}

      <MotionCard
        delay={isSearching && matchedProfiles.length > 0 ? 0.2 : 0.1}
        className="flex-1 min-h-0 overflow-hidden"
      >
        <NewsFeed
          key={`${activeCategory}-${searchQuery}-${dateFrom}-${dateTo}`}
          items={newsItems}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total,
            totalPages,
            isLoading,
            onPageChange: setPage,
          }}
        />
      </MotionCard>
    </div>
  );
}
