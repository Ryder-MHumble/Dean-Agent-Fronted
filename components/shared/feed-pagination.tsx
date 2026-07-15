"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  totalIsEstimate?: boolean;
}

export default function FeedPagination({
  page,
  totalPages,
  onPageChange,
  className,
  isLoading = false,
}: FeedPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);

  const requestPage = (targetPage: number) => {
    const nextPage = Math.min(Math.max(1, targetPage), safeTotalPages);
    if (nextPage === safePage || isLoading) return;
    onPageChange(nextPage);
  };

  return (
    <nav
      data-feed-pagination=""
      aria-label="列表分页"
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border-t border-border/60 bg-background/80 px-2 py-1.5",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isLoading || safePage <= 1}
        onClick={() => requestPage(safePage - 1)}
        className="h-8 w-8 rounded-lg border-border/70 bg-background text-muted-foreground"
        aria-label="上一页"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </Button>

      <span className="min-w-[6.25rem] text-center text-xs font-medium text-muted-foreground">
        第{" "}
        <strong className="font-tabular text-sm font-semibold text-foreground">
          {safePage}
        </strong>{" "}
        / {safeTotalPages} 页
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isLoading || safePage >= safeTotalPages}
        onClick={() => requestPage(safePage + 1)}
        className="h-8 w-8 rounded-lg border-border/70 bg-background text-muted-foreground"
        aria-label="下一页"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </nav>
  );
}
