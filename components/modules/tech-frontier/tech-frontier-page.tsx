"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  Eye,
  Heart,
  Languages,
  Layers3,
  Loader2,
  MessageCircle,
  MessageSquare,
  Play,
  Repeat2,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/motion";
import DataFreshness from "@/components/shared/data-freshness";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import MasterDetailView from "@/components/shared/master-detail-view";
import { SkeletonPolicyIntel } from "@/components/shared/skeleton-states";
import { useDetailView } from "@/hooks/use-detail-view";
import {
  useTechFrontierFeed,
  useTechFrontierPostDetail,
} from "@/hooks/use-tech-frontier-feed";
import {
  normalizeTechFrontierPost,
  type SocialPostDetail,
  type TechFrontierPlatformFilter,
  type TechFrontierPostItem,
} from "@/lib/tech-frontier-feed";
import { cn, formatNumber } from "@/lib/utils";

const PAGE_SIZE = 20;

const PLATFORM_FILTERS: {
  value: TechFrontierPlatformFilter;
  label: string;
  iconSrc?: string;
  icon?: typeof Layers3;
}[] = [
  { value: "all", label: "全部", icon: Layers3 },
  { value: "x", label: "X", iconSrc: "/logos/x.svg" },
  { value: "wechat_mp", label: "公众号", iconSrc: "/logos/wechat.svg" },
  { value: "youtube", label: "YouTube", iconSrc: "/logos/youtube.svg" },
];

const platformBadgeClass: Record<TechFrontierPostItem["platform"], string> = {
  x: "border-slate-900 bg-slate-900 text-white",
  wechat_mp: "border-emerald-200 bg-emerald-50 text-emerald-700",
  youtube: "border-red-200 bg-red-50 text-red-700",
};

const postTypeClass: Record<string, string> = {
  post: "border-blue-200 bg-blue-50 text-blue-700",
  tweet: "border-blue-200 bg-blue-50 text-blue-700",
  reply: "border-slate-200 bg-slate-50 text-slate-600",
  repost: "border-purple-200 bg-purple-50 text-purple-700",
  quote: "border-amber-200 bg-amber-50 text-amber-700",
  comment: "border-slate-200 bg-slate-50 text-slate-600",
  video: "border-red-200 bg-red-50 text-red-700",
};

function getDetailImages(detail: SocialPostDetail | null) {
  const payload = detail?.raw_payload as
    | {
        extendedEntities?: {
          media?: { media_url_https?: string; display_url?: string }[];
        };
        retweeted_tweet?: {
          extendedEntities?: {
            media?: { media_url_https?: string; display_url?: string }[];
          };
        };
      }
    | undefined;
  const media =
    payload?.extendedEntities?.media ??
    payload?.retweeted_tweet?.extendedEntities?.media ??
    [];

  return media
    .filter((item) => item.media_url_https)
    .map((item) => ({
      src: item.media_url_https as string,
      alt: item.display_url ?? "社媒配图",
    }));
}

function formatTimelineDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function formatRelativeTime(item: TechFrontierPostItem) {
  const raw = item.publishedAt || item.crawledAt || item.date;
  const time = new Date(raw).getTime();
  if (!Number.isFinite(time)) return item.date || "";

  const diffMinutes = Math.max(1, Math.floor((Date.now() - time) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}天前`;
  return item.date;
}

function groupByRealDate(items: TechFrontierPostItem[]) {
  const groups = new Map<string, TechFrontierPostItem[]>();
  for (const item of items) {
    if (!item.date) continue;
    const group = groups.get(item.date);
    if (group) group.push(item);
    else groups.set(item.date, [item]);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, groupItems]) => ({
      date,
      items: groupItems.sort(
        (a, b) =>
          new Date(b.publishedAt || b.crawledAt || b.date).getTime() -
          new Date(a.publishedAt || a.crawledAt || a.date).getTime(),
      ),
    }));
}

function getYoutubeVideoId(item: TechFrontierPostItem) {
  if (item.platform !== "youtube") return null;
  const fromId = item.id.split(":").at(-1);
  if (fromId && /^[\w-]{8,}$/.test(fromId)) return fromId;

  if (!item.sourceUrl) return null;
  try {
    const url = new URL(item.sourceUrl);
    const videoId = url.searchParams.get("v");
    if (videoId) return videoId;
    const lastPath = url.pathname.split("/").filter(Boolean).at(-1);
    return lastPath || null;
  } catch {
    return null;
  }
}

function getYoutubeThumbnailUrl(item: TechFrontierPostItem) {
  const videoId = getYoutubeVideoId(item);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

function getAuthorInitial(item: TechFrontierPostItem) {
  const name = item.authorName || item.authorHandle || item.platformLabel;
  return name.trim().slice(0, 1).toUpperCase();
}

function PlatformLogo({
  item,
  className,
}: {
  item: Pick<TechFrontierPostItem, "platform" | "platformLabel">;
  className?: string;
}) {
  const src =
    item.platform === "x"
      ? "/logos/x.svg"
      : item.platform === "wechat_mp"
        ? "/logos/wechat.svg"
        : "/logos/youtube.svg";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white",
        className,
      )}
    >
      <img src={src} alt={item.platformLabel} className="h-4 w-4" />
    </span>
  );
}

function AuthorAvatar({
  item,
  size = "md",
}: {
  item: TechFrontierPostItem;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-sm font-semibold text-white",
        sizeClass,
      )}
      title={item.authorName}
    >
      {item.authorAvatarUrl ? (
        <img
          src={item.authorAvatarUrl}
          alt={`${item.authorName} 头像`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        getAuthorInitial(item)
      )}
    </span>
  );
}

function MetricChip({
  icon: Icon,
  value,
}: {
  icon: typeof Heart;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <Icon className="h-4 w-4" />
      {value > 0 ? formatNumber(value) : 0}
    </span>
  );
}

function PlatformBadge({ item }: { item: TechFrontierPostItem }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-[11px] font-semibold",
        platformBadgeClass[item.platform],
      )}
    >
      <PlatformLogo item={item} className="h-4 w-4" />
      {item.platformLabel}
    </Badge>
  );
}

function XPostCard({
  item,
  selected,
  onClick,
}: {
  item: TechFrontierPostItem;
  selected: boolean;
  onClick: () => void;
}) {
  const text = item.content || item.summary;
  const shouldShowExpand =
    text.length > 95 || text.split(/\r?\n/).filter(Boolean).length > 2;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition",
        selected
          ? "border-sky-300 ring-2 ring-sky-100"
          : "border-slate-200 hover:border-sky-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AuthorAvatar item={item} size="md" />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <strong className="truncate text-base font-semibold leading-none text-slate-950">
                {item.authorName}
              </strong>
              <span className="text-sky-500">✓</span>
              <span className="truncate text-sm text-slate-400">
                @{item.authorHandle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
          <span>{formatRelativeTime(item)}</span>
          <Languages className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-4 line-clamp-2 whitespace-pre-line text-[15px] leading-7 text-slate-600">
        {text}
      </p>

      {shouldShowExpand && (
        <span className="mt-1 inline-flex text-sm font-semibold text-sky-600">
          展开全文
        </span>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-5">
        <MetricChip icon={MessageCircle} value={item.metrics.replies} />
        <MetricChip icon={Repeat2} value={item.metrics.reposts} />
        <MetricChip icon={Heart} value={item.metrics.likes} />
        <MetricChip icon={Eye} value={item.metrics.views} />
      </div>
    </button>
  );
}

function YoutubePostCard({
  item,
  selected,
  onClick,
}: {
  item: TechFrontierPostItem;
  selected: boolean;
  onClick: () => void;
}) {
  const thumbnailUrl = getYoutubeThumbnailUrl(item);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "grid w-full grid-cols-[132px_minmax(0,1fr)] overflow-hidden rounded-2xl border bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition",
        selected
          ? "border-sky-300 ring-2 ring-sky-100"
          : "border-slate-200 hover:border-sky-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="relative min-h-[118px] bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${item.title} 视频封面`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <PlatformLogo item={item} className="h-10 w-10" />
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
      </div>

      <div className="flex min-w-0 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="line-clamp-2 text-base font-semibold leading-snug text-slate-950">
              {item.title}
            </h4>
            <p className="mt-1 truncate text-sm text-slate-400">
              {item.authorName}
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-600"
          >
            原帖
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {item.content || item.summary || item.title}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3 text-xs text-slate-400">
          <span className="truncate">{item.categoryLabel}</span>
          <span className="shrink-0">
            热度 {formatNumber(item.engagementTotal)}
          </span>
        </div>
      </div>
    </button>
  );
}

function GenericPostCard({
  item,
  selected,
  onClick,
}: {
  item: TechFrontierPostItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left transition",
        selected
          ? "border-sky-300 ring-2 ring-sky-100"
          : "border-slate-200 hover:border-sky-200 hover:shadow-sm",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <PlatformLogo
            item={item}
            className="h-8 w-8 border border-slate-100"
          />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-950">
              {item.title}
            </h4>
            <p className="truncate text-xs text-slate-400">{item.authorName}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px]",
            postTypeClass[item.postType] ??
              "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {item.postTypeLabel}
        </Badge>
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
        {item.summary}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{item.categoryLabel}</span>
        <span>热度 {formatNumber(item.engagementTotal)}</span>
      </div>
    </button>
  );
}

function TechFrontierCard({
  item,
  selected,
  onClick,
}: {
  item: TechFrontierPostItem;
  selected: boolean;
  onClick: () => void;
}) {
  if (item.platform === "x") {
    return <XPostCard item={item} selected={selected} onClick={onClick} />;
  }

  if (item.platform === "youtube") {
    return (
      <YoutubePostCard item={item} selected={selected} onClick={onClick} />
    );
  }

  return <GenericPostCard item={item} selected={selected} onClick={onClick} />;
}

function TimelineList({
  groups,
  selectedId,
  isLoading,
  onSelect,
}: {
  groups: { date: string; items: TechFrontierPostItem[] }[];
  selectedId?: string;
  isLoading: boolean;
  onSelect: (item: TechFrontierPostItem) => void;
}) {
  if (groups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
        暂无匹配的社媒情报
      </p>
    );
  }

  return (
    <ul className={cn("space-y-7 pr-2", isLoading && "opacity-60")}>
      {groups.map((group, groupIndex) => (
        <li key={group.date} className="relative pl-12">
          <span
            className={cn(
              "absolute left-[15px] top-8 w-px bg-slate-200",
              groupIndex === groups.length - 1 ? "h-8" : "-bottom-7",
            )}
            aria-hidden="true"
          />
          <div className="mb-3 flex min-h-8 items-center justify-between">
            <span
              className={cn(
                "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm",
                groupIndex === 0
                  ? "border-cyan-300 text-cyan-600"
                  : "border-slate-200 text-slate-400",
              )}
              aria-hidden="true"
            >
              <CalendarDays className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-slate-600">
              {formatTimelineDate(group.date)}
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
              {group.items.length}条
            </span>
          </div>

          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.id}>
                <TechFrontierCard
                  item={item}
                  selected={selectedId === item.id}
                  onClick={() => onSelect(item)}
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function OriginalPostDetail({ item }: { item: TechFrontierPostItem }) {
  const { detail, isLoading } = useTechFrontierPostDetail(item.id);
  const activeDetail = detail?.id === item.id ? detail : null;
  const detailItem = activeDetail
    ? normalizeTechFrontierPost(activeDetail)
    : item;
  const images = getDetailImages(activeDetail);
  const topReplies = activeDetail?.top_replies ?? [];
  const youtubeThumbnailUrl = getYoutubeThumbnailUrl(detailItem);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {detailItem.platform === "x" ? (
              <AuthorAvatar item={detailItem} size="lg" />
            ) : (
              <PlatformLogo
                item={detailItem}
                className="h-10 w-10 border border-slate-100"
              />
            )}
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <strong className="truncate text-base font-semibold text-slate-950">
                  {detailItem.authorName}
                </strong>
                {detailItem.platform === "x" && (
                  <span className="text-sky-500">✓</span>
                )}
              </div>
              <p className="truncate text-sm text-slate-400">
                @{detailItem.authorHandle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{formatRelativeTime(detailItem)}</span>
            {detailItem.platform === "x" && <Languages className="h-4 w-4" />}
          </div>
        </div>

        <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
          {detailItem.content || detailItem.summary}
        </p>

        {detailItem.platform === "youtube" && youtubeThumbnailUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
            <div className="relative aspect-video">
              <img
                src={youtubeThumbnailUrl}
                alt={`${detailItem.title} 视频封面`}
                loading="lazy"
                className="h-full w-full object-cover opacity-95"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-xl">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
              <span className="absolute bottom-3 left-3 rounded-md bg-black/65 px-2 py-1 text-xs font-medium text-white">
                YouTube 原帖预览
              </span>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-4 grid gap-2">
            {images.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className="max-h-[360px] rounded-xl border border-slate-100 object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4">
          <MetricChip
            icon={MessageCircle}
            value={detailItem.metrics.replies || detailItem.metrics.comments}
          />
          <MetricChip
            icon={Repeat2}
            value={detailItem.metrics.reposts || detailItem.metrics.forwards}
          />
          <MetricChip icon={Heart} value={detailItem.metrics.likes} />
          <MetricChip
            icon={Eye}
            value={detailItem.metrics.views || detailItem.metrics.reads}
          />
          <MetricChip
            icon={Bookmark}
            value={detailItem.metrics.bookmarks || detailItem.metrics.wows}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PlatformBadge item={detailItem} />
        <Badge
          variant="outline"
          className={cn(
            "text-[11px]",
            postTypeClass[detailItem.postType] ??
              "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {detailItem.postTypeLabel}
        </Badge>
        <Badge variant="secondary" className="text-[11px]">
          {detailItem.categoryLabel}
        </Badge>
      </div>

      {topReplies.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-3 text-sm font-semibold text-slate-900">
            热门回复
          </div>
          <div className="space-y-3">
            {topReplies.map((reply) => (
              <div key={reply.id} className="rounded-lg bg-white p-3 text-sm">
                <span className="font-medium text-slate-900">
                  {reply.author_display_name || reply.author_username}
                </span>
                <p className="mt-1 leading-6 text-slate-600">
                  {reply.content_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TechFrontierPage() {
  const { selectedItem, open, close, isOpen } =
    useDetailView<TechFrontierPostItem>();
  const listRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] =
    useState<TechFrontierPlatformFilter>("all");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    items,
    isLoading,
    isDisconnected,
    generatedAt,
    total,
    totalPages,
    platformTotals,
  } = useTechFrontierFeed({
    platform: activePlatform,
    keyword: searchQuery,
    dateFrom,
    dateTo,
    page,
    pageSize: PAGE_SIZE,
  });

  const dateGroups = useMemo(() => groupByRealDate(items), [items]);
  const visibleItems = useMemo(
    () => dateGroups.flatMap((group) => group.items),
    [dateGroups],
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (visibleItems.length === 0) {
      close();
      return;
    }

    if (
      !selectedItem ||
      !visibleItems.some((item) => item.id === selectedItem.id)
    ) {
      open(visibleItems[0]);
    }
  }, [close, open, selectedItem, visibleItems]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      resetPage();
      setSearchQuery(value);
    },
    [resetPage],
  );

  const handlePlatformChange = useCallback(
    (nextPlatform: TechFrontierPlatformFilter) => {
      resetPage();
      setActivePlatform(nextPlatform);
    },
    [resetPage],
  );

  const handleDateFromChange = useCallback(
    (value: string) => {
      resetPage();
      setDateFrom(value);
    },
    [resetPage],
  );

  const handleDateToChange = useCallback(
    (value: string) => {
      resetPage();
      setDateTo(value);
    },
    [resetPage],
  );

  const handleDateClear = useCallback(() => {
    resetPage();
    setDateFrom("");
    setDateTo("");
  }, [resetPage]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  if (isLoading && items.length === 0) return <SkeletonPolicyIntel />;

  return (
    <div className="flex h-[var(--app-content-height,100dvh)] flex-col gap-4 overflow-hidden px-5 pb-1 pt-5">
      <MotionCard delay={0} className="relative z-10 shrink-0">
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearchSubmit}
                placeholder="搜索 X、YouTube、公众号前沿认知、作者..."
                className="min-w-[16rem] flex-1"
                inputClassName="h-9 rounded-lg border-border/50 bg-muted/30 text-sm transition-colors focus:bg-white"
                buttonClassName="h-9 rounded-lg"
              />

              <DateRangeFilter
                from={dateFrom}
                to={dateTo}
                onFromChange={handleDateFromChange}
                onToChange={handleDateToChange}
                onClear={handleDateClear}
                className="w-full min-w-0 md:w-auto md:shrink-0"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1">
                {PLATFORM_FILTERS.map(
                  ({ value, label, icon: Icon, iconSrc }) => {
                    const active = activePlatform === value;
                    const count = platformTotals[value];
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handlePlatformChange(value)}
                        className={cn(
                          "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium transition-colors",
                          active
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:bg-background hover:text-foreground",
                        )}
                      >
                        {iconSrc ? (
                          <img
                            src={iconSrc}
                            alt={label}
                            className={cn(
                              "h-3.5 w-3.5",
                              active && value === "x" && "invert",
                            )}
                          />
                        ) : Icon ? (
                          <Icon className="h-3.5 w-3.5" />
                        ) : null}
                        {label}
                        {count > 0 && (
                          <span className="font-tabular opacity-80">
                            {formatNumber(count)}
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {isDisconnected && (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                    <WifiOff className="h-3 w-3" />
                    后端未连接
                  </span>
                )}
                {generatedAt && (
                  <DataFreshness updatedAt={new Date(generatedAt)} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard delay={0.1} className="min-h-0 flex-1 overflow-hidden">
        <MasterDetailView
          className="h-full rounded-2xl border border-slate-200 bg-white/60"
          listContentClassName="min-h-0 overflow-hidden"
          listWidth={55}
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedItem
              ? {
                  title: (
                    <h2 className="line-clamp-2 text-lg font-semibold leading-snug">
                      {selectedItem.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <PlatformBadge item={selectedItem} />
                      <span>{selectedItem.authorName}</span>
                      <span>&middot;</span>
                      <span>{selectedItem.date}</span>
                      {selectedItem.engagementTotal > 0 && (
                        <>
                          <span>&middot;</span>
                          <span>
                            热度 {formatNumber(selectedItem.engagementTotal)}
                          </span>
                        </>
                      )}
                    </div>
                  ),
                  sourceUrl: selectedItem.sourceUrl ?? undefined,
                }
              : undefined
          }
          detailContent={
            selectedItem ? <OriginalPostDetail item={selectedItem} /> : null
          }
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-slate-50/60 p-4">
            <div
              ref={listRef}
              aria-busy={isLoading}
              className="min-h-0 overflow-y-auto overscroll-contain"
            >
              <TimelineList
                groups={dateGroups}
                selectedId={selectedItem?.id}
                isLoading={isLoading}
                onSelect={open}
              />
            </div>
            <div className="border-t border-border/60 bg-transparent pt-3">
              <FeedPagination
                page={page}
                pageSize={PAGE_SIZE}
                total={total}
                totalPages={totalPages}
                isLoading={isLoading}
                totalIsEstimate
                onPageChange={handlePageChange}
                className="w-full"
              />
            </div>
          </div>
        </MasterDetailView>
      </MotionCard>
    </div>
  );
}
