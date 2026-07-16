"use client";

import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { useSentimentFeed, useSentimentOverview } from "@/hooks/use-sentiment";
import { getPlatformConfig } from "@/lib/config/platforms";
import type {
  PlatformStats,
  SentimentContentItem,
  SentimentOverview,
} from "@/lib/types/internal-mgmt";
import { cn, formatNumber } from "@/lib/utils";
import {
  Eye,
  Globe,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ContentCard } from "./content-card";
import { SentimentReport } from "./sentiment-report";
import { FeedSkeleton } from "./sentiment-skeleton";

const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  { value: "publish_time", label: "最新" },
  { value: "liked_count", label: "最热" },
  { value: "comment_count", label: "评论最多" },
];

function PlatformChips({
  platforms,
  selected,
  onSelect,
}: {
  platforms: PlatformStats[];
  selected: string;
  onSelect: (platform: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="平台筛选">
      <button
        type="button"
        aria-pressed={selected === ""}
        onClick={() => onSelect("")}
        className={cn(
          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8] focus-visible:ring-offset-2",
          selected === ""
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-[#e5e9f0] bg-white text-[#667085] hover:bg-[#f8fafc]",
        )}
      >
        全部
      </button>
      {platforms.map((platform) => {
        const cfg = getPlatformConfig(platform.platform);
        const isSelected = selected === platform.platform;
        return (
          <button
            key={platform.platform}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(platform.platform)}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8] focus-visible:ring-offset-2",
              isSelected
                ? cn(cfg.bgColor, cfg.color)
                : "border-[#e5e9f0] bg-white text-[#667085] hover:bg-[#f8fafc]",
            )}
          >
            {cfg.logoUrl && (
              <img src={cfg.logoUrl} alt="" className="h-3.5 w-3.5 object-contain" />
            )}
            {platform.platform_label}
            <span className="font-tabular opacity-70">
              {formatNumber(platform.content_count)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OverviewMetrics({ overview }: { overview: SentimentOverview }) {
  const metrics = [
    {
      label: "监测内容",
      value: overview.total_contents,
      icon: Globe,
      color: "text-blue-600",
    },
    {
      label: "总评论",
      value: overview.total_comments,
      icon: MessageCircle,
      color: "text-emerald-600",
    },
    {
      label: "总互动量",
      value: overview.total_engagement,
      icon: TrendingUp,
      color: "text-violet-600",
    },
    {
      label: "覆盖平台",
      value: overview.platforms.length,
      icon: Eye,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-[#e5e9f0] sm:grid-cols-4 sm:divide-y-0">
      {metrics.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="flex items-center gap-2 px-3 py-2 first:pl-0">
          <Icon className={cn("h-4 w-4", color)} aria-hidden="true" />
          <div>
            <p className="text-[11px] text-[#667085]">{label}</p>
            <p className="font-tabular text-base font-semibold text-[#1a3a5c]">
              {formatNumber(value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 py-2">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PopularContentList({
  items,
  onOpen,
}: {
  items: SentimentContentItem[];
  onOpen: (item: SentimentContentItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-[#e5e9f0] pt-2.5">
      <h2 className="mb-2 text-xs font-semibold text-[#1a3a5c]">
        热门内容前 5 条
      </h2>
      <div className="grid gap-1 sm:grid-cols-2">
        {items.map((item, index) => {
          const totalEngagement =
            item.liked_count +
            item.comment_count +
            item.share_count +
            item.collected_count;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item)}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8]",
                "hover:bg-[#f8fafc]",
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef2f6] font-tabular text-[10px] font-semibold text-[#1a3a5c]">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-medium text-[#344054]">
                  {item.title}
                </span>
                <span className="block truncate text-[10px] text-[#667085]">
                  {item.nickname || "匿名用户"} · 互动 {formatNumber(totalEngagement)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function SentimentMonitor() {
  const { overview, isLoading: overviewLoading } = useSentimentOverview();
  const [platform, setPlatform] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("publish_time");
  const [page, setPage] = useState(1);

  const { feed, isLoading: feedLoading } = useSentimentFeed({
    platform: platform || undefined,
    keyword: keyword || undefined,
    sortBy,
    sortOrder: "desc",
    page,
    pageSize: PAGE_SIZE,
  });

  const handlePlatformChange = (nextPlatform: string) => {
    setPlatform(nextPlatform);
    setPage(1);
  };

  const handleSearch = (nextKeyword: string) => {
    setKeyword(nextKeyword.trim());
    setPage(1);
  };

  const handleSortChange = (nextSort: string) => {
    setSortBy(nextSort);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const openOriginalPost = (item: SentimentContentItem) => {
    if (!item.content_url) return;
    window.open(item.content_url, "_blank", "noopener,noreferrer");
  };

  return (
    <IntelligencePageShell>
      <IntelligenceWorkspace
        surface="integrated"
        listHeader={
          <IntelligenceToolbar
            variant="embedded"
            title="两院舆情监测"
            total={feed?.total ?? overview?.total_contents}
            supplemental={
              overviewLoading ? (
                <OverviewSkeleton />
              ) : overview ? (
                <OverviewMetrics overview={overview} />
              ) : null
            }
          >
            <div className="w-full space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {overview && (
                  <PlatformChips
                    platforms={overview.platforms}
                    selected={platform}
                    onSelect={handlePlatformChange}
                  />
                )}
                <div className="flex items-center gap-1" aria-label="排序方式">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={sortBy === option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8]",
                        sortBy === option.value
                          ? "bg-[#1a3a5c] text-white"
                          : "text-[#667085] hover:bg-[#f1f4f8]",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearch}
                placeholder="搜索标题、内容或作者"
                className="w-full"
                inputClassName="h-9 rounded-lg border-[#e5e9f0] bg-[#f8fafc] text-sm focus:bg-white"
                buttonClassName="h-9 rounded-lg"
              />
            </div>
          </IntelligenceToolbar>
        }
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={false}
        onClose={() => {}}
        detailContent={null}
      >
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
          <div
            aria-busy={feedLoading}
            className="min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1"
          >
            {overview && (
              <div className="mb-3 space-y-3">
                <SentimentReport overview={overview} />
                <PopularContentList
                  items={overview.top_content}
                  onOpen={openOriginalPost}
                />
              </div>
            )}
            {feedLoading ? (
              <FeedSkeleton />
            ) : feed && feed.items.length > 0 ? (
              feed.items.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onClick={() => openOriginalPost(item)}
                />
              ))
            ) : (
              <div className="flex min-h-48 items-center justify-center text-sm text-[#667085]">
                {keyword ? `未找到包含「${keyword}」的内容` : "暂无社媒监测数据"}
              </div>
            )}
          </div>

          <FeedPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={feed?.total ?? 0}
            totalPages={feed?.total_pages ?? 1}
            isLoading={feedLoading}
            onPageChange={handlePageChange}
            className="shrink-0"
          />
        </div>
      </IntelligenceWorkspace>
    </IntelligencePageShell>
  );
}
