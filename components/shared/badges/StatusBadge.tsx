"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  color?: string;
  bg?: string;
  className?: string;
}

export function StatusBadge({ label, color, bg, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium",
        bg ?? "bg-gray-50 border-gray-200",
        color ?? "text-gray-700",
        className,
      )}
    >
      {label}
    </span>
  );
}
