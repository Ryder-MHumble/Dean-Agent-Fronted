"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  FileCheck,
  MessageSquare,
  ClipboardCheck,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AgendaItem {
  id: string;
  time?: string; // e.g. "09:00" — undefined means unscheduled pending task
  title: string;
  source?: string;
  type: "meeting" | "task" | "deadline" | "approve" | "reply" | "review";
  status?: "ready" | "conflict" | "incomplete" | "upcoming" | "urgent";
  actionLabel?: string;
  metadata?: string;
}

interface TodayAgendaProps {
  items: AgendaItem[];
  onNavigateToSchedule?: () => void;
}

const typeIcons: Record<string, typeof Clock> = {
  meeting: CalendarDays,
  task: ClipboardCheck,
  deadline: AlertTriangle,
  approve: FileCheck,
  reply: MessageSquare,
  review: ClipboardCheck,
};

const statusConfig: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  ready: {
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    label: "已就绪",
  },
  conflict: {
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    label: "冲突",
  },
  incomplete: {
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    label: "准备中",
  },
  upcoming: {
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    label: "待进行",
  },
  urgent: {
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    label: "紧急",
  },
};

export default function TodayAgenda({
  items,
  onNavigateToSchedule,
}: TodayAgendaProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleComplete = (id: string, title: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
    toast.success(`已处理：${title}`);
  };

  // Split: scheduled items first (sorted by time), then unscheduled
  const scheduled = items
    .filter((i) => !!i.time)
    .sort((a, b) => (a.time! > b.time! ? 1 : -1));
  const unscheduled = items.filter((i) => !i.time);
  const sortedItems = [...scheduled, ...unscheduled];

  const pendingCount = items.filter((i) => !completedIds.has(i.id)).length;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            今日待办
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {pendingCount} 项待处理
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <StaggerContainer className="space-y-1">
          {sortedItems.map((item) => {
            const Icon = typeIcons[item.type] || Clock;
            const isDone = completedIds.has(item.id);
            const status = item.status
              ? statusConfig[item.status]
              : undefined;

            return (
              <StaggerItem key={item.id}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                    isDone
                      ? "bg-green-50/30 opacity-50"
                      : item.status === "conflict"
                        ? "bg-red-50/30"
                        : "hover:bg-muted/30",
                  )}
                >
                  {/* Time column */}
                  <div className="w-12 shrink-0 text-right">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    ) : item.time ? (
                      <span className="text-xs font-medium font-tabular text-foreground">
                        {item.time}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        待办
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md shrink-0",
                      item.status === "conflict"
                        ? "bg-red-50 text-red-500"
                        : item.status === "urgent"
                          ? "bg-red-50 text-red-500"
                          : "bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isDone && "line-through text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.source && (
                        <span className="text-[10px] text-muted-foreground">
                          {item.source}
                        </span>
                      )}
                      {item.metadata && (
                        <span className="text-[10px] text-muted-foreground">
                          {item.metadata}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    {status && !isDone && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          status.bg,
                          status.color,
                        )}
                      >
                        {status.label}
                      </Badge>
                    )}
                    {!isDone && item.actionLabel && (
                      <Button
                        size="sm"
                        variant={
                          item.status === "conflict" ? "destructive" : "ghost"
                        }
                        className="h-7 text-xs px-2"
                        onClick={() =>
                          handleComplete(item.id, item.title)
                        }
                      >
                        {item.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {onNavigateToSchedule && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={onNavigateToSchedule}
            >
              查看完整日程
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
