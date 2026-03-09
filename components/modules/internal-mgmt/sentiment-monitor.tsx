"use client";

import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Globe,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  ExternalLink,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  MotionCard,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import {
  useSentimentOverview,
  useSentimentFeed,
  useSentimentDetail,
} from "@/hooks/use-sentiment";
import type { SentimentContentItem } from "@/lib/types/internal-mgmt";

// ── Platform config ───────────────────────────────────────

const PLATFORM_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  xhs: {
    label: "小红书",
    icon: "小",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
  dy: {
    label: "抖音",
    icon: "抖",
    color: "text-gray-800",
    bgColor: "bg-gray-100 border-gray-300",
  },
  bili: {
    label: "哔哩哔哩",
    icon: "B",
    color: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-200",
  },
  weibo: {
    label: "微博",
    icon: "微",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
};

function getPlatform(code: string) {
  return (
    PLATFORM_CONFIG[code] ?? {
      label: code,
      icon: code[0],
      color: "text-gray-600",
      bgColor: "bg-gray-50 border-gray-200",
    }
  );
}

// ── Helpers ───────────────────────────────────────────────

function formatPublishTime(ts: number | null): string {
  if (!ts) return "";
  // xhs uses milliseconds (13 digits), dy uses seconds (10 digits)
  const ms = ts > 1e12 ? ts : ts * 1000;
  const date = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHr < 24) return `${diffHr}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}周前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

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
        const cfg = getPlatform(p.platform);
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
            {cfg.icon} {p.platform_label}
            <span className="ml-1 opacity-60">{p.content_count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Content card in feed ──────────────────────────────────

function ContentCard({
  item,
  onClick,
}: {
  item: SentimentContentItem;
  onClick: () => void;
}) {
  const cfg = getPlatform(item.platform);
  const images = item.platform_data?.image_list
    ? String(item.platform_data.image_list).split(",").filter(Boolean)
    : [];
  const hasVideo = !!item.platform_data?.video_url;

  return (
    <StaggerItem>
      <div
        onClick={onClick}
        className="flex gap-4 p-4 border-b last:border-0 cursor-pointer
                   rounded-sm transition-all hover:bg-muted/40 group"
      >
        {/* Platform icon */}
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shrink-0 border-2",
            cfg.bgColor,
            cfg.color,
          )}
        >
          {cfg.icon}
        </div>

        {/* Content body */}
        <div className="flex-1 min-w-0 flex-1">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-foreground truncate max-w-[180px]">
              {item.nickname || "匿名用户"}
            </span>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {cfg.label}
            </Badge>
            {hasVideo && (
              <Badge
                variant="outline"
                className="text-[10px] border-purple-200 bg-purple-50 text-purple-700 shrink-0"
              >
                视频
              </Badge>
            )}
            <span className="text-sm text-muted-foreground font-medium min-w-[60px] text-center ml-auto shrink-0">
              {formatPublishTime(item.publish_time)}
            </span>
          </div>

          {/* Title */}
          <p className="text-base font-bold text-foreground leading-snug mb-1 line-clamp-2">
            {item.title}
          </p>

          {/* Description preview */}
          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-0 line-clamp-2">
              {item.description.slice(0, 120)}
            </p>
          )}

          {/* Image thumbnails */}
          {images.length > 0 && (
            <div className="flex gap-2 mb-0">
              {images.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ))}
              {images.length > 3 && (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium min-w-[60px] text-center">
                  +{images.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Engagement metrics */}
          <div className="flex items-center gap-5 text-sm text-muted-foreground font-medium min-w-[60px] text-center">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              {formatNumber(item.liked_count)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              {formatNumber(item.comment_count)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              {formatNumber(item.share_count)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              {formatNumber(item.collected_count)}
            </span>
            {item.ip_location && (
              <span className="inline-flex items-center gap-1.5 ml-auto">
                <MapPin className="h-3.5 w-3.5" />
                {item.ip_location}
              </span>
            )}
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

// ── Detail panel ──────────────────────────────────────────

function DetailPanel({
  contentId,
  onClose,
}: {
  contentId: string | null;
  onClose: () => void;
}) {
  const { detail, isLoading } = useSentimentDetail(contentId);

  if (!contentId) return null;

  const cfg = detail ? getPlatform(detail.platform) : null;
  const images = detail?.platform_data?.image_list
    ? String(detail.platform_data.image_list).split(",").filter(Boolean)
    : [];

  return (
    <Sheet open={!!contentId} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="px-4 pt-4 pb-4 space-y-4 border-b">
          <SheetTitle className="text-sm flex items-center gap-2">
            {cfg && (
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border",
                  cfg.bgColor,
                  cfg.color,
                )}
              >
                {cfg.icon}
              </span>
            )}
            内容详情
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-64px)]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ) : detail ? (
            <div className="p-4 space-y-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                {detail.avatar ? (
                  <img
                    src={detail.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                    {detail.nickname?.[0] || "?"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{detail.nickname}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {cfg?.label} · {formatPublishTime(detail.publish_time)}
                    {detail.ip_location && ` · ${detail.ip_location}`}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold leading-snug">
                {detail.title}
              </h3>

              {/* Description */}
              {detail.description && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {detail.description}
                </p>
              )}

              {/* Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-muted overflow-hidden aspect-square"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Engagement stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Heart, label: "点赞", value: detail.liked_count },
                  {
                    icon: MessageCircle,
                    label: "评论",
                    value: detail.comment_count,
                  },
                  { icon: Share2, label: "转发", value: detail.share_count },
                  {
                    icon: Bookmark,
                    label: "收藏",
                    value: detail.collected_count,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="text-center p-2 rounded-lg bg-muted/50"
                  >
                    <Icon className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-base font-bold">{formatNumber(value)}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Link to original */}
              <a
                href={detail.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看原文
              </a>

              {/* Tags */}
              {detail.platform_data?.tag_list &&
                String(detail.platform_data.tag_list).trim() && (
                  <div className="flex flex-wrap gap-1.5">
                    {String(detail.platform_data.tag_list)
                      .split(",")
                      .filter(Boolean)
                      .map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          #{tag.trim()}
                        </Badge>
                      ))}
                  </div>
                )}

              {/* Comments section */}
              {detail.comments.length > 0 && (
                <div>
                  <h4 className="text-base font-bold mb-0 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    评论 ({detail.comments.length})
                  </h4>
                  <div className="space-y-3">
                    {detail.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={cn(
                          "p-3 rounded-lg",
                          comment.parent_comment_id === "0"
                            ? "bg-muted/40"
                            : "bg-muted/20 ml-4 border-l-2 border-muted",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {comment.avatar ? (
                            <img
                              src={comment.avatar}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">
                              {comment.nickname?.[0] || "?"}
                            </div>
                          )}
                          <span className="text-xs font-medium">
                            {comment.nickname}
                          </span>
                          {comment.ip_location && (
                            <span className="text-[10px] text-muted-foreground">
                              {comment.ip_location}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground font-medium min-w-[60px] text-center ml-auto">
                            {formatPublishTime(comment.publish_time)}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          {comment.content}
                        </p>
                        {comment.like_count > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground">
                            <Heart className="h-2.5 w-2.5" />
                            {comment.like_count}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">未找到内容</div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ── Loading skeleton ──────────────────────────────────────

function FeedSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      ))}
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
        {/* ── Stat cards ── */}
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

        {/* ── Feed card ── */}
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

                {/* Sort options */}
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

              {/* Platform chips */}
              {overview && (
                <PlatformChips
                  platforms={overview.platforms}
                  selected={platform}
                  onSelect={handlePlatformChange}
                />
              )}

              {/* Search */}
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
                  className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium
                           hover:bg-primary/90 transition-all"
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

                  {/* Pagination */}
                  {feed.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-6 pb-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="h-9 w-9 rounded-lg border flex items-center justify-center
                                 text-muted-foreground hover:bg-muted disabled:opacity-30
                                 disabled:cursor-not-allowed transition-all"
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
                        className="h-9 w-9 rounded-lg border flex items-center justify-center
                                 text-muted-foreground hover:bg-muted disabled:opacity-30
                                 disabled:cursor-not-allowed transition-all"
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

        {/* ── Top content (from overview) ── */}
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
                    const cfg = getPlatform(item.platform);
                    const totalEng =
                      item.liked_count +
                      item.comment_count +
                      item.share_count +
                      item.collected_count;
                    return (
                      <StaggerItem key={item.id}>
                        <div
                          onClick={() => setSelectedContentId(item.content_id)}
                          className="flex items-center gap-3 py-2.5 px-3 border-b last:border-0
                                   cursor-pointer rounded-sm hover:bg-muted/40 transition-all"
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
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0 border",
                              cfg.bgColor,
                              cfg.color,
                            )}
                          >
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.nickname} · 互动 {formatNumber(totalEng)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                            <span className="inline-flex items-center gap-0.5">
                              <Heart className="h-2.5 w-2.5" />
                              {formatNumber(item.liked_count)}
                            </span>
                            <span className="inline-flex items-center gap-0.5">
                              <MessageCircle className="h-2.5 w-2.5" />
                              {formatNumber(item.comment_count)}
                            </span>
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </CardContent>
            </Card>
          </MotionCard>
        )}

        {/* ── Detail sheet ── */}
        <DetailPanel
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
        />
      </div>
    </>
  );
}
