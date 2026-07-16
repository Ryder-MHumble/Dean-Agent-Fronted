"use client";

import type { ReactNode } from "react";
import DataFreshness from "@/components/shared/data-freshness";
import { cn } from "@/lib/utils";

interface IntelligenceToolbarProps {
  title: string;
  total?: number;
  totalIsEstimate?: boolean;
  updatedAt?: Date;
  actions?: ReactNode;
  children?: ReactNode;
  supplemental?: ReactNode;
  className?: string;
  variant?: "standalone" | "embedded";
}

export default function IntelligenceToolbar({
  title,
  total,
  totalIsEstimate = false,
  updatedAt,
  actions,
  children,
  supplemental,
  className,
  variant = "standalone",
}: IntelligenceToolbarProps) {
  return (
    <section
      data-intelligence-toolbar=""
      className={cn(
        variant === "embedded"
          ? "border-b border-[#e5e9f0] bg-white p-4"
          : "rounded-xl border border-[#e5e9f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1
            className={cn(
              "font-semibold text-[#1a3a5c]",
              variant === "embedded"
                ? "text-[24px] leading-8"
                : "text-[28px] leading-9",
            )}
          >
            {title}
          </h1>
          {total !== undefined && (
            <span className="text-sm text-[#667085]">
              {totalIsEstimate
                ? `至少 ${total.toLocaleString("zh-CN")} 条`
                : `共 ${total.toLocaleString("zh-CN")} 条`}
            </span>
          )}
          {updatedAt && (
            <DataFreshness
              updatedAt={updatedAt}
              className="text-xs text-[#667085]"
            />
          )}
        </div>
        {actions && (
          <div
            className={cn(
              "flex items-center gap-2",
              variant === "embedded" && "max-w-full flex-wrap",
            )}
          >
            {actions}
          </div>
        )}
      </div>

      {children && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            variant === "embedded" ? "mt-3" : "mt-4",
          )}
        >
          {children}
        </div>
      )}
      {supplemental && (
        <div className="mt-3 border-t border-[#e5e9f0] pt-3">
          {supplemental}
        </div>
      )}
    </section>
  );
}
