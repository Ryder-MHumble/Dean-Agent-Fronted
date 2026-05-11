"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

function getVisiblePages(page: number, totalPages: number): number[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export default function FeedPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  className,
  isLoading = false,
}: FeedPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const visiblePages = getVisiblePages(safePage, safeTotalPages);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2",
        className,
      )}
    >
      <div className="text-xs text-muted-foreground">
        共 <span className="font-semibold text-foreground">{total}</span> 条
        <span className="mx-1.5">·</span>
        每页 {pageSize} 条
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="h-8 px-2"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          上一页
        </Button>

        {visiblePages.map((value, index) => {
          const previous = visiblePages[index - 1];
          const showGap = previous !== undefined && value - previous > 1;
          return (
            <div key={value} className="flex items-center gap-1">
              {showGap && (
                <span className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )}
              <Button
                type="button"
                variant={safePage === value ? "default" : "ghost"}
                size="sm"
                disabled={isLoading}
                onClick={() => onPageChange(value)}
                className="h-8 min-w-8 px-2"
              >
                {value}
              </Button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || safePage >= safeTotalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="h-8 px-2"
        >
          下一页
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
