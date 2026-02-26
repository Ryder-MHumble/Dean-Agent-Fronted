"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Timer,
  ChevronDown,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EVENTS, UPCOMING_EVENTS } from "@/lib/mock-data/schedule";
import WeekStrip from "./week-strip";
import TimelineRow from "./timeline-row";
import DetailPanel from "./detail-panel";

export default function SchedulePage() {
  const breakpoint = useBreakpoint();
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(0);
  const [showUpcoming, setShowUpcoming] = useState(false);

  const currentEvent = selectedEvent !== null ? EVENTS[selectedEvent] : null;
  const isToday = selectedDayOffset === 0;

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Compact week strip */}
      <WeekStrip
        selectedDayOffset={selectedDayOffset}
        onSelectDay={setSelectedDayOffset}
      />

      {/* 2-column layout: Timeline + Detail */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Timeline */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="shadow-sm">
            <CardContent className="p-2">
              {/* Day heading */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {isToday ? "今日日程" : "当日日程"}
                  </h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {EVENTS.length} 项
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {EVENTS.some((e) => e.type === "conflict") && (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-3 w-3" />1 个冲突
                    </span>
                  )}
                  {EVENTS.some((e) => e.type === "deadline") && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Timer className="h-3 w-3" />1 个截止
                    </span>
                  )}
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-1 pb-2">
                {EVENTS.map((event, index) => (
                  <TimelineRow
                    key={event.title}
                    event={event}
                    isSelected={selectedEvent === index}
                    onClick={() => setSelectedEvent(index)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming this week */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowUpcoming(!showUpcoming)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showUpcoming && "rotate-180",
                )}
              />
              本周其他安排 ({UPCOMING_EVENTS.length})
            </button>
            {showUpcoming && (
              <Card className="mt-2 shadow-sm">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {UPCOMING_EVENTS.map((evt) => (
                      <div
                        key={evt.title}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-center w-12">
                          <p className="text-[10px] text-muted-foreground">
                            {evt.day}
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {evt.date}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {evt.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {evt.time}
                          </p>
                        </div>
                        {evt.type === "deadline" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-amber-100 text-amber-700"
                          >
                            截止
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right: Detail Panel (tablet/desktop only) */}
        {breakpoint !== "mobile" && currentEvent && (
          <div className="col-span-12 lg:col-span-4">
            <DetailPanel event={currentEvent} />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet for detail panel */}
      <AnimatePresence>
        {breakpoint === "mobile" && selectedEvent !== null && currentEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/30"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-[56px] z-40 max-h-[70vh] rounded-t-2xl bg-background border-t border-border shadow-2xl overflow-hidden"
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute right-4 top-3 rounded-lg p-1 text-muted-foreground hover:bg-muted/60"
              >
                <X className="h-4 w-4" />
              </button>
              <ScrollArea className="max-h-[calc(70vh-40px)]">
                <DetailPanel event={currentEvent} />
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
