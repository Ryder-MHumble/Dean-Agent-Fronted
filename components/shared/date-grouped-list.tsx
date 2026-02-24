"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { groupByDate } from "@/lib/group-by-date";
import { cn } from "@/lib/utils";

interface DateGroupedListProps<T extends { id: string; date: string }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  emptyMessage?: string;
}

export default function DateGroupedList<
  T extends { id: string; date: string },
>({
  items,
  renderItem,
  className,
  emptyMessage = "暂无数据",
}: DateGroupedListProps<T>) {
  const groups = groupByDate(items);

  if (groups.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground text-center py-8">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto",
        className,
      )}
    >
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
            <StaggerContainer className="space-y-3">
              {group.items.map((item) => (
                <StaggerItem key={item.id}>{renderItem(item)}</StaggerItem>
              ))}
            </StaggerContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
