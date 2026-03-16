"use client";

import { Heart, MessageCircle, Share2, Bookmark, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface EngagementMetricsProps {
  likes?: number;
  comments?: number;
  shares?: number;
  collects?: number;
  views?: number;
  className?: string;
  size?: "sm" | "md";
}

export function EngagementMetrics({
  likes,
  comments,
  shares,
  collects,
  views,
  className,
  size = "sm",
}: EngagementMetricsProps) {
  const iconClass = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  const items = [
    { icon: Heart, value: likes, color: "text-rose-400" },
    { icon: MessageCircle, value: comments, color: "text-blue-400" },
    { icon: Share2, value: shares, color: "text-green-400" },
    { icon: Bookmark, value: collects, color: "text-amber-400" },
    { icon: Eye, value: views, color: "text-purple-400" },
  ].filter((item) => item.value !== undefined);

  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {items.map(({ icon: Icon, value, color }, i) => (
        <span
          key={i}
          className={cn("flex items-center gap-1 text-muted-foreground", textClass)}
        >
          <Icon className={cn(iconClass, color)} />
          {formatNumber(value!)}
        </span>
      ))}
    </div>
  );
}
