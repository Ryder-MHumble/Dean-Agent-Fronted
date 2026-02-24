"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Accent color configuration                                         */
/* ------------------------------------------------------------------ */

export const accentConfig = {
  violet: {
    selected: "border-violet-300 bg-violet-50/50 shadow-sm",
    hover: "hover:border-violet-200 hover:shadow-sm",
    title: "group-hover:text-violet-600",
    chevron: "group-hover:text-violet-500",
  },
  blue: {
    selected: "border-blue-300 bg-blue-50/50 shadow-sm",
    hover: "hover:border-blue-200 hover:shadow-sm",
    title: "group-hover:text-blue-600",
    chevron: "group-hover:text-blue-500",
  },
  indigo: {
    selected: "border-indigo-300 bg-indigo-50/50 shadow-sm",
    hover: "hover:border-indigo-200 hover:shadow-sm",
    title: "group-hover:text-indigo-600",
    chevron: "group-hover:text-indigo-500",
  },
  purple: {
    selected: "border-purple-300 bg-purple-50/50 shadow-sm",
    hover: "hover:border-purple-200 hover:shadow-sm",
    title: "group-hover:text-purple-600",
    chevron: "group-hover:text-purple-500",
  },
  green: {
    selected: "border-green-300 bg-green-50/50 shadow-sm",
    hover: "hover:border-green-200 hover:shadow-sm",
    title: "group-hover:text-green-600",
    chevron: "group-hover:text-green-500",
  },
} as const;

export type AccentColor = keyof typeof accentConfig;

/* ------------------------------------------------------------------ */
/*  DataItemCard                                                        */
/* ------------------------------------------------------------------ */

interface DataItemCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  accentColor?: AccentColor;
  children: ReactNode;
  className?: string;
}

export default function DataItemCard({
  isSelected = false,
  onClick,
  accentColor = "blue",
  children,
  className,
}: DataItemCardProps) {
  const accent = accentConfig[accentColor];

  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-lg border p-4 transition-all group cursor-pointer text-left",
        isSelected ? accent.selected : accent.hover,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Rounded avatar box with a single initial character */
export function ItemAvatar({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 shrink-0",
        className,
      )}
    >
      {text}
    </div>
  );
}

/** ChevronRight icon with hover animation */
export function ItemChevron({
  accentColor = "blue",
}: {
  accentColor?: AccentColor;
}) {
  const accent = accentConfig[accentColor];

  return (
    <ChevronRight
      className={cn(
        "h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5",
        accent.chevron,
      )}
    />
  );
}
