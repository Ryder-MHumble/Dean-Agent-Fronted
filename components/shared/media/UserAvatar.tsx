"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function UserAvatar({
  src,
  alt = "用户",
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = alt.charAt(0);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeMap[size],
          className,
        )}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground shrink-0",
        sizeMap[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
