"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WEEK_EVENT_DAYS } from "@/lib/mock-data/schedule";

export default function WeekStrip({
  selectedDayOffset,
  onSelectDay,
}: {
  selectedDayOffset: number;
  onSelectDay: (offset: number) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek + weekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const dayLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const weekLabel = (() => {
    const start = days[0];
    const end = days[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getFullYear()}年${start.getMonth() + 1}月`;
    }
    return `${start.getMonth() + 1}月 - ${end.getMonth() + 1}月`;
  })();

  return (
    <Card className="shadow-sm">
      <CardContent className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">{weekLabel}</h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setWeekOffset((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-700 px-2"
                onClick={() => setWeekOffset(0)}
              >
                本周
              </button>
            )}
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setWeekOffset((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-7">
          {days.map((d, i) => {
            const isToday =
              d.toDateString() === today.toDateString() && weekOffset === 0;
            const dayOffsetFromToday = Math.round(
              (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );
            const isSelected = dayOffsetFromToday === selectedDayOffset;
            const hasEvents = weekOffset === 0 && WEEK_EVENT_DAYS.includes(i);

            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => onSelectDay(dayOffsetFromToday)}
                className={cn(
                  "flex-none w-[calc((100vw-80px)/5.5)] sm:w-auto flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all",
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : isToday
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-muted text-foreground",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isSelected ? "text-blue-100" : "text-muted-foreground",
                  )}
                >
                  {dayLabels[i]}
                </span>
                <span className="text-lg font-bold">{d.getDate()}</span>
                {hasEvents && !isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
                {hasEvents && isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
                {!hasEvents && <span className="h-1.5" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
