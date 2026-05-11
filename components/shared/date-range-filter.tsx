"use client";

import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear: () => void;
  className?: string;
  disabled?: boolean;
}

export default function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
  className,
  disabled = false,
}: DateRangeFilterProps) {
  const isActive = Boolean(from || to);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-2",
        isActive && "border-blue-200 bg-blue-50/40",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        时间范围
      </div>
      <Input
        type="date"
        aria-label="开始日期"
        value={from}
        disabled={disabled}
        onChange={(event) => onFromChange(event.target.value)}
        className="h-8 w-[9.5rem] bg-white text-xs"
      />
      <span className="text-xs text-muted-foreground">至</span>
      <Input
        type="date"
        aria-label="结束日期"
        value={to}
        disabled={disabled}
        onChange={(event) => onToChange(event.target.value)}
        className="h-8 w-[9.5rem] bg-white text-xs"
      />
      {isActive && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onClear}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          清除
        </Button>
      )}
    </div>
  );
}
