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
  Repeat2,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
import { SkeletonPolicyIntel } from "@/components/shared/skeleton-states";
import { useDetailView } from "@/hooks/use-detail-view";
import {
  useTechFrontierFeed,
  useTechFrontierPostDetail,
} from "@/hooks/use-tech-frontier-feed";
import {
  normalizeTechFrontierDisplayText,
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
  icon?: typeof Layers3;
  mark?: string;
}[] = [
  { value: "all", label: "全部", icon: Layers3 },
  { value: "x", label: "X", mark: "X" },
  { value: "wechat_mp", label: "公众号", icon: MessageSquare },
];

const platformBadgeClass: Record<TechFrontierPostItem["platform"], string> = {
  x: "border-slate-900 bg-slate-900 text-white",
  wechat_mp: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-900",
        item.platform === "wechat_mp" && "text-emerald-700",
        className,
      )}
      aria-label={item.platformLabel}
    >
      {item.platform === "x" ? (
        <span aria-hidden="true">X</span>
      ) : (
        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
      )}
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
  const text = normalizeTechFrontierDisplayText(item.content || item.summary);
  const shouldShowExpand =
    text.length > 95 || text.split(/\r?\n/).filter(Boolean).length > 2;

  return (
    <IntelligenceListItem
      onClick={onClick}
      selected={selected}
      className="p-4"
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
    </IntelligenceListItem>
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
    <IntelligenceListItem
      onClick={onClick}
      selected={selected}
      className="p-4"
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
      <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
        {normalizeTechFrontierDisplayText(item.summary)}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{item.categoryLabel}</span>
        <span>热度 {formatNumber(item.engagementTotal)}</span>
      </div>
    </IntelligenceListItem>
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
  if (isLoading && groups.length === 0) {
    return <SkeletonPolicyIntel />;
  }

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

  return (
    <div className="space-y-4">
      <div>
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
          {normalizeTechFrontierDisplayText(
            detailItem.content || detailItem.summary,
          )}
        </p>

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
                <p className="mt-1 whitespace-pre-line leading-6 text-slate-600">
                  {normalizeTechFrontierDisplayText(reply.content_text)}
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

  return (
    <IntelligencePageShell className="h-[var(--app-content-height,100dvh)]">
      <IntelligenceToolbar
        title="社媒情报"
        total={total}
        updatedAt={generatedAt ? new Date(generatedAt) : undefined}
        actions={
          isDisconnected ? (
            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
              <WifiOff className="h-3.5 w-3.5" />
              后端未连接
            </span>
          ) : undefined
        }
      >
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearchSubmit}
          placeholder="搜索 X、公众号前沿认知或作者"
          className="min-w-[16rem] flex-1"
          inputClassName="h-9 rounded-lg border-[#e5e9f0] bg-white text-sm"
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

        <div className="flex items-center gap-1 rounded-lg bg-[#f2f4f7] p-1">
          {PLATFORM_FILTERS.map(({ value, label, icon: Icon, mark }) => {
            const active = activePlatform === value;
            const count = platformTotals[value];
            return (
              <button
                key={value}
                type="button"
                onClick={() => handlePlatformChange(value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8]",
                  active
                    ? "bg-[#1a3a5c] text-white"
                    : "text-[#667085] hover:bg-white hover:text-[#1a3a5c]",
                )}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {mark ? <span aria-hidden="true">{mark}</span> : null}
                {label}
                {count > 0 && (
                  <span className="font-tabular opacity-80">
                    {formatNumber(count)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </IntelligenceToolbar>

      <IntelligenceWorkspace
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedItem
            ? {
                title: (
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-[#1a3a5c]">
                    {selectedItem.title}
                  </h2>
                ),
                subtitle: (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
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
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
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
          <div className="border-t border-[#e5e9f0] pt-3">
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
      </IntelligenceWorkspace>
    </IntelligencePageShell>
  );
}
