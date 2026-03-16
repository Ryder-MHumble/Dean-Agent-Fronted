"use client";

import { cn } from "@/lib/utils";
import { getPlatformConfig } from "@/lib/config/platforms";

interface PlatformBadgeProps {
  platform: string;
  showCount?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PlatformBadge({
  platform,
  showCount,
  selected,
  onClick,
  className,
}: PlatformBadgeProps) {
  const cfg = getPlatformConfig(platform);

  const content = (
    <>
      {cfg.logoUrl ? (
        <img
          src={cfg.logoUrl}
          alt={cfg.label}
          className="inline-block h-3.5 w-3.5 rounded-sm object-contain"
        />
      ) : null}
      <span>{cfg.label}</span>
      {showCount !== undefined && (
        <span className="opacity-60">({showCount})</span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all border",
          selected
            ? cn(cfg.bgColor, cfg.color)
            : "bg-background text-muted-foreground border-transparent hover:bg-muted/50",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        cfg.bgColor,
        cfg.color,
        className,
      )}
    >
      {content}
    </span>
  );
}
