"use client";

import {
  IntelligenceDetailHeader,
  IntelligenceSection,
} from "@/components/shared/intelligence-detail";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSentimentDetail } from "@/hooks/use-sentiment";
import { getPlatformConfig } from "@/lib/config/platforms";
import type { SentimentContentItem } from "@/lib/types/internal-mgmt";
import { cn, formatNumber, formatPublishTime } from "@/lib/utils";
import {
  Bookmark,
  ExternalLink,
  Heart,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";

function safeImageUrl(url: string | null | undefined) {
  return url ? url.replace(/^http:\/\//i, "https://") : "";
}

function PlatformBadge({ platform }: { platform: string }) {
  const cfg = getPlatformConfig(platform);

  return (
    <Badge variant="outline" className="inline-flex items-center gap-1 text-[10px]">
      {cfg.logoUrl && (
        <img src={cfg.logoUrl} alt="" className="h-3 w-3 object-contain" />
      )}
      {cfg.label}
    </Badge>
  );
}

export function SentimentDetailHeader({ item }: { item: SentimentContentItem }) {
  return (
    <IntelligenceDetailHeader
      badges={<PlatformBadge platform={item.platform} />}
      title={item.title}
      meta={
        <div className="flex flex-wrap items-center gap-2">
          <span>{item.nickname || "匿名用户"}</span>
          <span>&middot;</span>
          <span>{formatPublishTime(item.publish_time)}</span>
          {item.ip_location && (
            <>
              <span>&middot;</span>
              <span>{item.ip_location}</span>
            </>
          )}
        </div>
      }
    />
  );
}

export function getSentimentDetailHeader(item: SentimentContentItem) {
  return {
    title: <SentimentDetailHeader item={item} />,
    sourceUrl: item.content_url || undefined,
  };
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-label="正在加载内容详情">
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  );
}

export function SentimentDetailContent({
  contentId,
}: {
  contentId: string | null;
}) {
  const { detail, isLoading } = useSentimentDetail(contentId);

  if (!contentId) return null;
  if (isLoading) return <DetailSkeleton />;
  if (!detail) {
    return <p className="text-sm text-muted-foreground">未找到内容</p>;
  }

  const cfg = getPlatformConfig(detail.platform);
  const images = detail.platform_data?.image_list
    ? String(detail.platform_data.image_list).split(",").filter(Boolean)
    : [];
  const hasVideo = Boolean(detail.platform_data?.video_url);
  const shouldShowCover =
    (detail.platform === "dy" || detail.platform === "bili") &&
    detail.cover_url;
  const shouldShowImages = !shouldShowCover && images.length > 0;
  const tags = detail.platform_data?.tag_list
    ? String(detail.platform_data.tag_list)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-5">
      <IntelligenceSection title="发布者">
        <div className="flex items-center gap-3">
          {detail.avatar ? (
            <img
              src={safeImageUrl(detail.avatar)}
              alt={detail.nickname || "用户"}
              className="h-10 w-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs">
              {detail.nickname?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {detail.nickname || "匿名用户"}
            </p>
            <p className="text-xs text-muted-foreground">
              {cfg.label} · {formatPublishTime(detail.publish_time)}
              {detail.ip_location && ` · ${detail.ip_location}`}
            </p>
          </div>
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="内容">
        {detail.description && (
          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {detail.description}
          </p>
        )}

        {shouldShowCover && (
          <div
            className={cn(
              "relative max-w-md overflow-hidden rounded-lg bg-muted",
              detail.platform === "dy" ? "aspect-[9/16]" : "aspect-video",
            )}
          >
            <img
              src={safeImageUrl(detail.cover_url)}
              alt={detail.title}
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            {hasVideo && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                  <Play className="h-5 w-5 fill-current text-[#1a3a5c]" />
                </span>
              </span>
            )}
          </div>
        )}

        {shouldShowImages && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={safeImageUrl(src)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {detail.content_url && (
          <a
            href={detail.content_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            查看原文
          </a>
        )}
      </IntelligenceSection>

      <IntelligenceSection title="互动数据">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              className="rounded-lg border border-[#e5e9f0] bg-[#f8fafc] p-3 text-center"
            >
              <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-[#667085]" />
              <p className="font-tabular text-base font-semibold text-[#1a3a5c]">
                {formatNumber(value)}
              </p>
              <p className="text-[10px] text-[#667085]">{label}</p>
            </div>
          ))}
        </div>
      </IntelligenceSection>

      {detail.comments.length > 0 && (
        <IntelligenceSection title={`评论（${detail.comments.length}）`}>
          <div className="space-y-3">
            {detail.comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  "rounded-lg border border-[#e5e9f0] bg-[#f8fafc] p-3",
                  comment.parent_comment_id !== "0" && "ml-4",
                )}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  {comment.avatar ? (
                    <img
                      src={safeImageUrl(comment.avatar)}
                      alt=""
                      className="h-5 w-5 rounded-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px]">
                      {comment.nickname?.[0] || "?"}
                    </span>
                  )}
                  <span className="text-xs font-medium text-foreground">
                    {comment.nickname || "匿名用户"}
                  </span>
                  {comment.ip_location && (
                    <span className="text-[10px] text-muted-foreground">
                      {comment.ip_location}
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {formatPublishTime(comment.publish_time)}
                  </span>
                </div>
                <p className="text-xs leading-5 text-[#344054]">
                  {comment.content}
                </p>
                {comment.like_count > 0 && (
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Heart className="h-2.5 w-2.5" />
                    {formatNumber(comment.like_count)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}
    </div>
  );
}
