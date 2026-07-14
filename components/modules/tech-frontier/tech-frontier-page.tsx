"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  Eye,
  Heart,
  Layers3,
  Loader2,
  MessageCircle,
  MessageSquare,
  Repeat2,
  Twitter,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/motion";
import DataFreshness from "@/components/shared/data-freshness";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DateRangeFilter from "@/components/shared/date-range-filter";
import DetailArticleBody from "@/components/shared/detail-article-body";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import MasterDetailView from "@/components/shared/master-detail-view";
import DataItemCard, {
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import { SkeletonPolicyIntel } from "@/components/shared/skeleton-states";
import { useDetailView } from "@/hooks/use-detail-view";
import {
  useTechFrontierAuthorAvatars,
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
  icon: typeof Layers3;
}[] = [
  { value: "all", label: "全部", icon: Layers3 },
  { value: "x", label: "X", icon: Twitter },
  { value: "wechat_mp", label: "公众号", icon: MessageCircle },
];

const platformBadgeClass: Record<TechFrontierPostItem["platform"], string> = {
  x: "border-slate-900 bg-slate-900 text-white",
  wechat_mp: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const postTypeClass: Record<string, string> = {
  post: "border-blue-200 bg-blue-50 text-blue-700",
  reply: "border-slate-200 bg-slate-50 text-slate-600",
  repost: "border-purple-200 bg-purple-50 text-purple-700",
  quote: "border-amber-200 bg-amber-50 text-amber-700",
  comment: "border-slate-200 bg-slate-50 text-slate-600",
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
      alt: item.display_url ?? null,
    }));
}

function MetricChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
}) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label} {formatNumber(value)}
    </span>
  );
}

function PlatformBadge({ item }: { item: TechFrontierPostItem }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-semibold",
        platformBadgeClass[item.platform],
      )}
    >
      {item.platformLabel}
    </Badge>
  );
}

function getAuthorInitial(item: TechFrontierPostItem) {
  const name = item.authorName || item.authorHandle || "X";
  return name.trim().slice(0, 1).toUpperCase();
}

function PostSourceMark({
  item,
  size = "sm",
}: {
  item: TechFrontierPostItem;
  size?: "sm" | "md";
}) {
  if (item.platform !== "x") return <PlatformBadge item={item} />;

  const sizeClass = size === "md" ? "h-8 w-8" : "h-7 w-7";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-slate-900 text-[11px] font-semibold text-white",
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
    </div>
  );
}

function TechFrontierPostDetail({ item }: { item: TechFrontierPostItem }) {
  const { detail, isLoading } = useTechFrontierPostDetail(item.id);
  const activeDetail = detail?.id === item.id ? detail : null;
  const detailItem = activeDetail
    ? normalizeTechFrontierPost(activeDetail)
    : item;
  const images = getDetailImages(activeDetail);
  const topReplies = activeDetail?.top_replies ?? [];

  return (
    <DetailArticleBody
      content={detailItem.content}
      summary={detailItem.summary}
      images={images}
      tags={[
        detailItem.platformLabel,
        detailItem.categoryLabel,
        detailItem.postTypeLabel,
      ]}
      extraMeta={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <PostSourceMark item={detailItem} size="md" />
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
            <span className="text-xs text-muted-foreground">
              @{detailItem.authorHandle}
            </span>
            {isLoading && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                加载详情
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <MetricChip
              icon={Eye}
              label="浏览"
              value={detailItem.metrics.views}
            />
            <MetricChip
              icon={Heart}
              label="喜欢"
              value={detailItem.metrics.likes}
            />
            <MetricChip
              icon={MessageSquare}
              label="回复"
              value={detailItem.metrics.replies || detailItem.metrics.comments}
            />
            <MetricChip
              icon={Repeat2}
              label="转发"
              value={detailItem.metrics.reposts || detailItem.metrics.forwards}
            />
            <MetricChip
              icon={Bookmark}
              label="收藏"
              value={detailItem.metrics.bookmarks || detailItem.metrics.wows}
            />
            <MetricChip
              icon={Eye}
              label="阅读"
              value={detailItem.metrics.reads}
            />
          </div>
        </div>
      }
    >
      {topReplies.length > 0 && (
        <div className="rounded-lg border bg-muted/20 p-3">
          <div className="mb-2 text-xs font-semibold text-foreground">
            热门回复
          </div>
          <div className="space-y-2">
            {topReplies.map((reply) => (
              <div key={reply.id} className="text-xs leading-relaxed">
                <span className="font-medium">
                  {reply.author_display_name || reply.author_username}
                </span>
                <span className="mx-1 text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {reply.content_text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DetailArticleBody>
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
  return (
    <DataItemCard
      isSelected={selected}
      onClick={onClick}
      accentColor="blue"
      className="p-3.5"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <PostSourceMark item={item} />
          <h4
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-semibold leading-snug transition-colors",
              accentConfig.blue.title,
            )}
          >
            {item.title}
          </h4>
        </div>
        <ItemChevron accentColor="blue" />
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {item.summary}
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
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
          <span className="truncate text-[11px] text-muted-foreground">
            {item.authorName}
          </span>
          {item.engagementTotal > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              热度 {formatNumber(item.engagementTotal)}
            </Badge>
          )}
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {item.date || "未知日期"}
        </span>
      </div>
    </DataItemCard>
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
  const authorAvatars = useTechFrontierAuthorAvatars(items);
  const visibleItems = useMemo(
    () =>
      items.map((item) => {
        const avatarUrl = authorAvatars[item.id];
        return avatarUrl ? { ...item, authorAvatarUrl: avatarUrl } : item;
      }),
    [items, authorAvatars],
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const resetPageAndClose = useCallback(() => {
    setPage(1);
    close();
  }, [close]);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      resetPageAndClose();
      setSearchQuery(value);
    },
    [resetPageAndClose],
  );

  const handlePlatformChange = useCallback(
    (nextPlatform: TechFrontierPlatformFilter) => {
      resetPageAndClose();
      setActivePlatform(nextPlatform);
    },
    [resetPageAndClose],
  );

  const handleDateFromChange = useCallback(
    (value: string) => {
      resetPageAndClose();
      setDateFrom(value);
    },
    [resetPageAndClose],
  );

  const handleDateToChange = useCallback(
    (value: string) => {
      resetPageAndClose();
      setDateTo(value);
    },
    [resetPageAndClose],
  );

  const handleDateClear = useCallback(() => {
    resetPageAndClose();
    setDateFrom("");
    setDateTo("");
  }, [resetPageAndClose]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      close();
      setPage(nextPage);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    [close],
  );

  if (isLoading && items.length === 0) return <SkeletonPolicyIntel />;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-hidden px-5 pb-20 pt-5 md:pb-1">
      <MotionCard delay={0} className="relative z-10 shrink-0">
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearchSubmit}
                placeholder="搜索 X 帖子、公众号前沿认知、作者..."
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
                {PLATFORM_FILTERS.map(({ value, label, icon: Icon }) => {
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
                      <Icon className="h-3.5 w-3.5" />
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
          className="h-full"
          listContentClassName="min-h-0 overflow-hidden"
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedItem
              ? {
                  title: (
                    <h2 className="text-lg font-semibold leading-snug">
                      {selectedItem.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <PostSourceMark item={selectedItem} />
                      <span>{selectedItem.authorName}</span>
                      <span>&middot;</span>
                      <span>{selectedItem.date || "未知日期"}</span>
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
            selectedItem ? <TechFrontierPostDetail item={selectedItem} /> : null
          }
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
            <div
              ref={listRef}
              aria-busy={isLoading}
              className={cn(
                "min-h-0 overflow-y-auto overscroll-contain pr-1 transition-opacity",
                isLoading && "opacity-60",
              )}
            >
              <DateGroupedList
                items={visibleItems}
                emptyMessage="暂无匹配的社媒情报"
                renderItem={(item) => (
                  <TechFrontierCard
                    item={item}
                    selected={selectedItem?.id === item.id}
                    onClick={() => open(item)}
                  />
                )}
              />
            </div>
            <div className="border-t border-border/60 bg-background pt-3">
              <FeedPagination
                page={page}
                pageSize={PAGE_SIZE}
                total={total}
                totalPages={totalPages}
                isLoading={isLoading}
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
