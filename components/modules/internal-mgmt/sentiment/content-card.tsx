"use client";

import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import { Badge } from "@/components/ui/badge";
import { getPlatformConfig } from "@/lib/config/platforms";
import type { SentimentContentItem } from "@/lib/types/internal-mgmt";
import { cn, formatNumber, formatPublishTime } from "@/lib/utils";
import {
  Bookmark,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";

interface ContentCardProps {
  item: SentimentContentItem;
  selected?: boolean;
  onClick: () => void;
}

function safeImageUrl(url: string | null | undefined) {
  return url ? url.replace(/^http:\/\//i, "https://") : "";
}

export function ContentCard({
  item,
  selected = false,
  onClick,
}: ContentCardProps) {
  const cfg = getPlatformConfig(item.platform);
  const images = item.platform_data?.image_list
    ? String(item.platform_data.image_list).split(",").filter(Boolean)
    : [];
  const hasVideo = Boolean(item.platform_data?.video_url);
  const shouldShowCover =
    (item.platform === "dy" || item.platform === "bili") && item.cover_url;
  const shouldShowImages = !shouldShowCover && images.length > 0;

  return (
    <IntelligenceListItem
      selected={selected}
      onClick={onClick}
      aria-label={`查看${item.nickname || "匿名用户"}发布的${item.title}`}
      className="group p-3.5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
          {item.avatar ? (
            <img
              src={safeImageUrl(item.avatar)}
              alt={item.nickname || "用户"}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              {(item.nickname || "匿名")[0]}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex min-w-0 items-center gap-2">
            <span className="min-w-0 truncate text-sm font-semibold text-foreground">
              {item.nickname || "匿名用户"}
            </span>
            <Badge
              variant="outline"
              className="inline-flex shrink-0 items-center gap-1 text-[10px]"
            >
              {cfg.logoUrl && (
                <img
                  src={cfg.logoUrl}
                  alt=""
                  className="h-3 w-3 rounded-sm object-contain"
                />
              )}
              {cfg.label}
            </Badge>
            {hasVideo && (
              <Badge
                variant="outline"
                className="shrink-0 border-purple-200 bg-purple-50 text-[10px] text-purple-700"
              >
                视频
              </Badge>
            )}
            <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
              {formatPublishTime(item.publish_time)}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-[#3156d8]">
              {item.title}
            </h3>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
          </div>

          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {item.description}
            </p>
          )}

          {shouldShowCover && (
            <div
              className={cn(
                "relative mt-2 overflow-hidden rounded-lg bg-muted",
                item.platform === "dy" ? "h-24 w-16" : "aspect-video w-32",
              )}
            >
              <img
                src={safeImageUrl(item.cover_url)}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              {hasVideo && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-3.5 w-3.5 fill-current text-[#1a3a5c]" />
                  </span>
                </span>
              )}
            </div>
          )}

          {shouldShowImages && (
            <div className="mt-2 flex gap-1.5">
              {images.slice(0, 3).map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted"
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
              {images.length > 3 && (
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                  +{images.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {formatNumber(item.liked_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {formatNumber(item.comment_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Share2 className="h-3.5 w-3.5" />
              {formatNumber(item.share_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              {formatNumber(item.collected_count)}
            </span>
            {item.ip_location && (
              <span className="ml-auto inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {item.ip_location}
              </span>
            )}
          </div>
        </div>
      </div>
    </IntelligenceListItem>
  );
}
