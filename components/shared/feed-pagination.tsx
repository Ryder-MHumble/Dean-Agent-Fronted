"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPaginationItems,
  sanitizePageInput,
} from "@/lib/feed-list-utils";
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
  const paginationItems = useMemo(
    () => getPaginationItems(safePage, safeTotalPages),
    [safePage, safeTotalPages],
  );
  const [pageInput, setPageInput] = useState(String(safePage));

  useEffect(() => {
    setPageInput(String(safePage));
  }, [safePage]);

  const requestPage = (targetPage: number) => {
    const nextPage = Math.min(Math.max(1, targetPage), safeTotalPages);
    if (nextPage === safePage || isLoading) return;
    onPageChange(nextPage);
  };

  const handleJump = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPage = sanitizePageInput(pageInput, safeTotalPages);
    if (nextPage == null) {
      setPageInput(String(safePage));
      return;
    }
    requestPage(nextPage);
  };

  return (
    <div
      data-feed-pagination=""
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border/80 bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        <span>
          共 <span className="font-semibold text-foreground">{total}</span> 条
          <span className="mx-1.5">·</span>
          每页 {pageSize} 条
          <span className="mx-1.5">·</span>
          第 {safePage}/{safeTotalPages} 页
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || safePage <= 1}
          onClick={() => requestPage(safePage - 1)}
          className="h-9 rounded-lg px-2.5"
          aria-label="上一页"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          上一页
        </Button>

        {paginationItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-8 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={safePage === item ? "default" : "ghost"}
              size="sm"
              disabled={isLoading}
              onClick={() => requestPage(item)}
              className={cn(
                "h-9 min-w-9 rounded-lg px-2 font-tabular",
                safePage === item &&
                  "bg-blue-600 text-white shadow-sm hover:bg-blue-600",
              )}
              aria-current={safePage === item ? "page" : undefined}
              aria-label={`第 ${item} 页`}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || safePage >= safeTotalPages}
          onClick={() => requestPage(safePage + 1)}
          className="h-9 rounded-lg px-2.5"
          aria-label="下一页"
        >
          下一页
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        <form
          onSubmit={handleJump}
          className="ml-1 hidden items-center gap-1.5 border-l border-border/70 pl-2 text-xs text-muted-foreground sm:flex"
        >
          <span>跳至</span>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label="跳转页码"
            value={pageInput}
            disabled={isLoading}
            onChange={(event) => setPageInput(event.target.value)}
            className="h-9 w-14 rounded-lg text-center text-xs font-tabular"
          />
          <span>页</span>
        </form>
      </div>
    </div>
  );
}
