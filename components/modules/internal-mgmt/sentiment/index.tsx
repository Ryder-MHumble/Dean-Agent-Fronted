"use client";

import { useState, useMemo } from "react";
import {
  Globe,
  TrendingUp,
  Eye,
  MessageCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MotionCard,
  StaggerContainer,
  AnimatedNumber,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { getPlatformConfig } from "@/lib/config/platforms";
import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import { useSentimentOverview, useSentimentFeed } from "@/hooks/use-sentiment";
import { ContentCard } from "./content-card";
import { DetailPanel } from "./detail-panel";
import { FeedSkeleton } from "./sentiment-skeleton";
import { SentimentReport } from "./sentiment-report";

// ── Stat card ─────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay: number;
}) {
  return (
    <MotionCard delay={delay}>
      <Card className="shadow-card border-0">
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
              color,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight">
              <AnimatedNumber value={value} formatFn={formatNumber} />
            </p>
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  );
}

// ── Platform filter chips ─────────────────────────────────

function PlatformChips({
  platforms,
  selected,
  onSelect,
}: {
  platforms: {
    platform: string;
    platform_label: string;
    content_count: number;
  }[];
  selected: string;
  onSelect: (p: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect("")}
        className={cn(
          "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
          selected === ""
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
        )}
      >
        全部
      </button>
      {platforms.map((p) => {
        const cfg = getPlatformConfig(p.platform);
        return (
          <button
            key={p.platform}
            onClick={() => onSelect(p.platform)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selected === p.platform
                ? cn(cfg.bgColor, cfg.color)
                : "bg-background text-muted-foreground border-transparent hover:bg-muted/50",
            )}
          >
            {cfg.logoUrl ? (
              <img
                src={cfg.logoUrl}
                alt={cfg.label}
                className="inline-block h-3.5 w-3.5 rounded-sm object-contain"
              />
            ) : null}{" "}
            {p.platform_label}
            <span className="ml-1 opacity-60">{p.content_count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────

export default function SentimentMonitor() {
  const { UnderDevelopmentOverlay } = usePageUnderDevelopment({
    pageName: "舆情监测",
  });
  const { overview, isLoading: overviewLoading } = useSentimentOverview();
  const [platform, setPlatform] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("publish_time");
  const [page, setPage] = useState(1);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );

  const { feed, isLoading: feedLoading } = useSentimentFeed({
    platform: platform || undefined,
    keyword: keyword || undefined,
    sortBy,
    sortOrder: "desc",
    page,
    pageSize: 15,
  });

  const handlePlatformChange = (p: string) => {
    setPlatform(p);
    setPage(1);
  };
  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const sortOptions = useMemo(
    () => [
      { value: "publish_time", label: "最新" },
      { value: "liked_count", label: "最热" },
      { value: "comment_count", label: "最多评论" },
    ],
    [],
  );

  return (
    <>
      <UnderDevelopmentOverlay />
      <div className="space-y-4">
        {/* Stat cards */}
        {overviewLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card border-0">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-2.5 w-14" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : overview ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="监测内容"
              value={overview.total_contents}
              icon={Globe}
              color="bg-blue-50 text-blue-600"
              delay={0}
            />
            <StatCard
              label="总评论"
              value={overview.total_comments}
              icon={MessageCircle}
              color="bg-green-50 text-green-600"
              delay={0.05}
            />
            <StatCard
              label="总互动量"
              value={overview.total_engagement}
              icon={TrendingUp}
              color="bg-purple-50 text-purple-600"
              delay={0.1}
            />
            <StatCard
              label="覆盖平台"
              value={overview.platforms.length}
              icon={Eye}
              color="bg-amber-50 text-amber-600"
              delay={0.15}
            />
          </div>
        ) : null}

        {/* AI Sentiment Report */}
        {overview && (
          <MotionCard delay={0.05}>
            <SentimentReport overview={overview} />
          </MotionCard>
        )}

        {/* Feed card */}
        <MotionCard delay={0.1}>
          <Card className="shadow-card border-0">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex items-center justify-between mb-0">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base font-bold">
                    社媒舆情信息流
                  </CardTitle>
                  {feed && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      {feed.total}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setPage(1);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs transition-all",
                        sortBy === opt.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {overview && (
                <PlatformChips
                  platforms={overview.platforms}
                  selected={platform}
                  onSelect={handlePlatformChange}
                />
              )}

              <div className="flex gap-2 mt-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索标题、内容或作者..."
                    className="h-10 pl-10 text-sm"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all"
                >
                  搜索
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {feedLoading ? (
                <FeedSkeleton />
              ) : feed && feed.items.length > 0 ? (
                <>
                  <StaggerContainer>
                    {feed.items.map((item) => (
                      <ContentCard
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedContentId(item.content_id)}
                      />
                    ))}
                  </StaggerContainer>

                  {feed.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-6 pb-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-muted-foreground font-medium min-w-[60px] text-center">
                        {page} / {feed.total_pages}
                      </span>
                      <button
                        disabled={page >= feed.total_pages}
                        onClick={() =>
                          setPage((p) => Math.min(feed.total_pages, p + 1))
                        }
                        className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center">
                  <Globe className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {keyword
                      ? `未找到包含「${keyword}」的内容`
                      : "暂无社媒监测数据"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionCard>

        {/* Top content */}
        {overview && overview.top_content.length > 0 && (
          <MotionCard delay={0.15}>
            <Card className="shadow-card border-0">
              <CardHeader className="pb-4 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base font-bold">
                    热门内容 TOP5
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <StaggerContainer>
                  {overview.top_content.map((item, idx) => {
                    const cfg = getPlatformConfig(item.platform);
                    const totalEng =
                      item.liked_count +
                      item.comment_count +
                      item.share_count +
                      item.collected_count;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedContentId(item.content_id)}
                        className="flex items-center gap-3 py-2.5 px-3 border-b last:border-0 cursor-pointer rounded-sm hover:bg-muted/40 transition-all"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0",
                            idx < 3
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full shrink-0 border overflow-hidden bg-muted">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt={item.nickname || "用户"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground">
                              {(item.nickname || "匿名")[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.nickname} · 互动 {formatNumber(totalEng)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </StaggerContainer>
              </CardContent>
            </Card>
          </MotionCard>
        )}

        <DetailPanel
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
        />
      </div>
    </>
  );
}
