"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { groupByCalendarDate, groupByDate } from "@/lib/group-by-date";
import { cn } from "@/lib/utils";

interface DateGroupedListProps<T extends { id: string; date?: string | null }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  emptyMessage?: string;
  animated?: boolean;
  variant?: "cards" | "timeline";
}

export default function DateGroupedList<
  T extends { id: string; date?: string | null },
>({
  items,
  renderItem,
  className,
  emptyMessage = "暂无数据",
  animated = true,
  variant = "cards",
}: DateGroupedListProps<T>) {
  const groups =
    variant === "timeline" ? groupByCalendarDate(items) : groupByDate(items);

  if (groups.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground text-center py-8">
          {emptyMessage}
        </p>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div data-date-timeline="" className={cn("space-y-5", className)}>
        {groups.map((group, groupIndex) => (
          <section
            key={group.label}
            className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2.5"
          >
            <div className="relative flex justify-center">
              {groupIndex < groups.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-1.25rem] left-1/2 top-8 w-px -translate-x-1/2 bg-[#e5e9f0]"
                />
              )}
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300 bg-white text-cyan-600 shadow-sm">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>

            <div className="min-w-0 pb-1">
              <div className="mb-2.5 flex min-h-8 items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#1a3a5c]">
                  {group.label}
                </h3>
                <span className="rounded-md bg-[#f2f4f7] px-2 py-1 text-[11px] font-medium text-[#667085]">
                  {group.items.length} 条
                </span>
              </div>

              {animated ? (
                <StaggerContainer className="space-y-2.5">
                  {group.items.map((item) => (
                    <StaggerItem key={item.id}>{renderItem(item)}</StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <div key={item.id}>{renderItem(item)}</div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {groups.map((group) => (
        <Card key={group.label} className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {group.label}
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {group.items.length}条
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {animated ? (
              <StaggerContainer className="space-y-3">
                {group.items.map((item) => (
                  <StaggerItem key={item.id}>{renderItem(item)}</StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.id}>{renderItem(item)}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
