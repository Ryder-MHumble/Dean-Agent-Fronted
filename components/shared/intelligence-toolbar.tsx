"use client";

import type { ReactNode } from "react";
import DataFreshness from "@/components/shared/data-freshness";
import { cn } from "@/lib/utils";

interface IntelligenceToolbarProps {
  title: string;
  total?: number;
  updatedAt?: Date;
  actions?: ReactNode;
  children?: ReactNode;
  supplemental?: ReactNode;
  className?: string;
}

export default function IntelligenceToolbar({
  title,
  total,
  updatedAt,
  actions,
  children,
  supplemental,
  className,
}: IntelligenceToolbarProps) {
  return (
    <section
      data-intelligence-toolbar=""
      className={cn(
        "rounded-xl border border-[#e5e9f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[28px] font-semibold leading-9 text-[#1a3a5c]">
            {title}
          </h1>
          {total !== undefined && (
            <span className="text-sm text-[#667085]">
              共 {total.toLocaleString("zh-CN")} 条
            </span>
          )}
          {updatedAt && (
            <DataFreshness
              updatedAt={updatedAt}
              className="text-xs text-[#667085]"
            />
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {children && (
        <div className="mt-4 flex flex-wrap items-center gap-2">{children}</div>
      )}
      {supplemental && (
        <div className="mt-3 border-t border-[#e5e9f0] pt-3">
          {supplemental}
        </div>
      )}
    </section>
  );
}
