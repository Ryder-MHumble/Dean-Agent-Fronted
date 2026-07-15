"use client";

import type { ComponentProps } from "react";
import MasterDetailView from "@/components/shared/master-detail-view";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof MasterDetailView>;

export default function IntelligenceWorkspace({
  className,
  listWidth,
  ...props
}: Props) {
  return (
    <section
      data-intelligence-workspace=""
      className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#e5e9f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
    >
      <MasterDetailView
        {...props}
        variant="intelligence"
        listWidth={listWidth ?? 44}
        className={cn("h-full", className)}
      />
    </section>
  );
}
