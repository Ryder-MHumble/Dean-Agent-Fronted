"use client";

import { Heart, MessageCircle, Share2, Bookmark, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { formatPublishTime, formatNumber } from "@/lib/utils";
import { getPlatformConfig } from "@/lib/config/platforms";
import type { SentimentContentItem } from "@/lib/types/internal-mgmt";

interface ContentCardProps {
  item: SentimentContentItem;
  onClick: () => void;
}

export function ContentCard({ item, onClick }: ContentCardProps) {
  const cfg = getPlatformConfig(item.platform);
  const images = item.platform_data?.image_list
    ? String(item.platform_data.image_list).split(",").filter(Boolean)
    : [];
  const hasVideo = !!item.platform_data?.video_url;

  // 抖音/B站优先显示 cover_url，小红书显示 image_list
  const shouldShowCover =
    (item.platform === "dy" || item.platform === "bili") && item.cover_url;
  const shouldShowImages = !shouldShowCover && images.length > 0;

  // 根据平台确定封面比例：抖音竖屏 9:16，B站横屏 16:9
  const coverAspectClass =
    item.platform === "dy" ? "aspect-[9/16]" : "aspect-video";

  // 将 http:// 转为 https:// 避免 Mixed Content 问题
  const safeImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    const safeUrl = url.replace(/^http:\/\//i, "https://");
    // 调试：打印转换结果
    if (url !== safeUrl) {
      console.log(`[Image URL] Converted: ${url} -> ${safeUrl}`);
    }
    return safeUrl;
  };

  // 调试：打印当前 item 的关键信息
  if (item.platform === "bili") {
    console.log(`[Bilibili] ${item.title}`, {
      platform: item.platform,
      avatar: item.avatar,
      cover_url: item.cover_url,
      shouldShowCover,
    });
  }

  return (
    <StaggerItem>
      <div
        onClick={onClick}
        className="flex gap-4 p-4 border-b last:border-0 cursor-pointer rounded-sm transition-all hover:bg-muted/40 group"
      >
        {/* Creator avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0 overflow-hidden bg-muted border-2 border-border">
          {item.avatar ? (
            <img
              src={safeImageUrl(item.avatar)}
              alt={item.nickname || "用户"}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                console.warn(
                  `Failed to load avatar for ${item.nickname}:`,
                  item.avatar,
                );
              }}
            />
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              {(item.nickname || "匿名")[0]}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-foreground truncate max-w-[180px]">
              {item.nickname || "匿名用户"}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] shrink-0 inline-flex items-center gap-1"
            >
              {cfg.logoUrl && (
                <img
                  src={cfg.logoUrl}
                  alt=""
                  className="h-3 w-3 object-cover rounded-sm"
                />
              )}
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
            <span className="text-sm text-muted-foreground font-medium ml-auto shrink-0">
              {formatPublishTime(item.publish_time)}
            </span>
          </div>

          <p className="text-base font-bold text-foreground leading-snug mb-1 line-clamp-2">
            {item.title}
          </p>

          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-0 line-clamp-2">
              {item.description.slice(0, 120)}
            </p>
          )}

          {shouldShowCover && (
            <div
              className={cn(
                "w-full rounded-lg bg-muted overflow-hidden mb-2 relative",
                coverAspectClass,
              )}
            >
              <img
                src={safeImageUrl(item.cover_url)}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  console.warn(
                    `Failed to load cover for ${item.title}:`,
                    item.cover_url,
                  );
                }}
              />
              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              )}
            </div>
          )}

          {shouldShowImages && (
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
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium">
                  +{images.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-5 text-sm text-muted-foreground font-medium">
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
