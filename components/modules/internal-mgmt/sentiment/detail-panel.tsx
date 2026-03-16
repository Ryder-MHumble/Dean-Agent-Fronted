"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatPublishTime, formatNumber } from "@/lib/utils";
import { getPlatformConfig } from "@/lib/config/platforms";
import { useSentimentDetail } from "@/hooks/use-sentiment";

interface DetailPanelProps {
  contentId: string | null;
  onClose: () => void;
}

export function DetailPanel({ contentId, onClose }: DetailPanelProps) {
  const { detail, isLoading } = useSentimentDetail(contentId);

  if (!contentId) return null;

  const cfg = detail ? getPlatformConfig(detail.platform) : null;
  const images = detail?.platform_data?.image_list
    ? String(detail.platform_data.image_list).split(",").filter(Boolean)
    : [];
  const hasVideo = !!detail?.platform_data?.video_url;

  // 抖音/B站优先显示 cover_url，小红书显示 image_list
  const shouldShowCover =
    detail &&
    (detail.platform === "dy" || detail.platform === "bili") &&
    detail.cover_url;
  const shouldShowImages = !shouldShowCover && images.length > 0;

  // 根据平台确定封面比例：抖音竖屏 9:16，B站横屏 16:9
  const coverAspectClass =
    detail?.platform === "dy" ? "aspect-[9/16]" : "aspect-video";

  // 将 http:// 转为 https:// 避免 Mixed Content 问题
  const safeImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    return url.replace(/^http:\/\//i, "https://");
  };

  return (
    <Sheet open={!!contentId} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="px-4 pt-4 pb-4 space-y-4 border-b">
          <SheetTitle className="text-sm flex items-center gap-2">
            {cfg && (
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full border overflow-hidden",
                  cfg.bgColor,
                )}
              >
                {cfg.logoUrl ? (
                  <img
                    src={cfg.logoUrl}
                    alt={cfg.label}
                    className="h-4 w-4 object-contain"
                  />
                ) : (
                  <span className={cn("text-[10px] font-bold", cfg.color)}>
                    {cfg.label[0]}
                  </span>
                )}
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
                    src={safeImageUrl(detail.avatar)}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      console.warn(`Failed to load avatar:`, detail.avatar);
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

              <h3 className="text-base font-semibold leading-snug">
                {detail.title}
              </h3>

              {detail.description && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {detail.description}
                </p>
              )}

              {/* Cover image for video platforms */}
              {shouldShowCover && (
                <div
                  className={cn(
                    "w-full rounded-lg bg-muted overflow-hidden relative",
                    coverAspectClass,
                  )}
                >
                  <img
                    src={safeImageUrl(detail.cover_url)}
                    alt={detail.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      console.warn(`Failed to load cover:`, detail.cover_url);
                    }}
                  />
                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[16px] border-l-black border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Images */}
              {shouldShowImages && (
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

              {/* Comments */}
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
                          <span className="text-sm text-muted-foreground font-medium ml-auto">
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
