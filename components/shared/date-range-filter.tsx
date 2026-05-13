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

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRangePresets() {
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 6);
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 29);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return [
    { label: "近7天", from: formatDate(last7Days), to: formatDate(today) },
    { label: "近30天", from: formatDate(last30Days), to: formatDate(today) },
    { label: "本月", from: formatDate(monthStart), to: formatDate(today) },
  ];
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
  const presets = getDateRangePresets();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-2.5 py-2",
        isActive && "border-blue-200 bg-blue-50/50",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        日期
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-background/80 p-0.5">
        {presets.map((preset) => {
          const checked = from === preset.from && to === preset.to;
          return (
            <button
              key={preset.label}
              type="button"
              disabled={disabled}
              onClick={() => {
                onFromChange(preset.from);
                onToChange(preset.to);
              }}
              className={cn(
                "h-7 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
                checked && "bg-blue-600 text-white shadow-sm hover:bg-blue-600 hover:text-white",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
        <Input
          type="date"
          aria-label="开始日期"
          value={from}
          disabled={disabled}
          onChange={(event) => onFromChange(event.target.value)}
          className="h-8 w-[7.5rem] bg-white text-xs sm:w-[8.75rem]"
        />
        <span className="text-xs text-muted-foreground">至</span>
        <Input
          type="date"
          aria-label="结束日期"
          value={to}
          disabled={disabled}
          onChange={(event) => onToChange(event.target.value)}
          className="h-8 w-[7.5rem] bg-white text-xs sm:w-[8.75rem]"
        />
      </div>
      {isActive && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onClear}
          className="h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          清除
        </Button>
      )}
    </div>
  );
}
