"use client";

import type { ComponentProps, ReactNode } from "react";
import MasterDetailView from "@/components/shared/master-detail-view";
import { cn } from "@/lib/utils";

type Props = Omit<
  ComponentProps<typeof MasterDetailView>,
  "children" | "surface" | "variant"
> & {
  children: ReactNode;
  listHeader?: ReactNode;
  surface?: "framed" | "integrated";
};

export default function IntelligenceWorkspace({
  className,
  listWidth,
  listHeader,
  children,
  surface = "framed",
  ...props
}: Props) {
  const isIntegrated = surface === "integrated";

  return (
    <section
      data-intelligence-workspace=""
      className={cn(
        "min-h-0 flex-1 overflow-hidden",
        isIntegrated
          ? "bg-[#f7f8fa] [&_[data-intelligence-toolbar]]:bg-[#f7f8fa]"
          : "rounded-xl border border-[#e5e9f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
      )}
    >
      <MasterDetailView
        {...props}
        variant="intelligence"
        surface={surface}
        listWidth={listWidth ?? 40}
        className={cn("h-full", className)}
      >
        {listHeader ? (
          <div className="flex h-full min-h-0 flex-col">
            {listHeader && (
              <div
                className={cn(
                  "relative z-10 shrink-0",
                  isIntegrated ? "bg-[#f7f8fa]" : "bg-white",
                )}
              >
                {listHeader}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </div>
        ) : (
          children
        )}
      </MasterDetailView>
    </section>
  );
}
