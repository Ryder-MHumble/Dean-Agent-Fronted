"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  FileText,
} from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface TimelineEvent {
  id: string
  time: string
  title: string
  type: "meeting" | "deadline" | "task"
  status: "upcoming" | "conflict" | "ready" | "incomplete"
  metadata?: string
  actionLabel?: string
  onAction?: () => void
}

export interface TimelineViewProps {
  todayEvents: TimelineEvent[]
  weekEvents: TimelineEvent[]
  longTermEvents: TimelineEvent[]
  onNavigateToSchedule?: () => void
}

const getStatusConfig = (status: TimelineEvent["status"]) => {
  switch (status) {
    case "ready":
      return {
        label: "已就绪",
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
        dot: "bg-green-500",
        icon: CheckCircle2,
      }
    case "conflict":
      return {
        label: "冲突",
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
        icon: AlertTriangle,
      }
    case "incomplete":
      return {
        label: "准备中",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
        icon: Clock,
      }
    case "upcoming":
    default:
      return {
        label: "待进行",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
        icon: Clock,
      }
  }
}

const getTypeIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "meeting":
      return Users
    case "deadline":
      return FileText
    case "task":
      return FileText
    default:
      return Calendar
  }
}

const ScheduleRow = ({ event }: { event: TimelineEvent }) => {
  const config = getStatusConfig(event.status)
  const TypeIcon = getTypeIcon(event.type)
  const StatusIcon = config.icon
  const needsAttention = event.status === "conflict" || event.status === "incomplete"

  return (
    <div
      className={cn(
        "flex items-stretch gap-0 rounded-lg border transition-all hover:shadow-sm group",
        needsAttention ? config.border : "border-border/60",
        needsAttention && config.bg
      )}
    >
      {/* Time column */}
      <div className="flex flex-col items-center justify-center w-20 shrink-0 py-3 border-r border-border/40">
        <span className="text-sm font-semibold font-tabular text-foreground">
          {event.time.split(" ")[0] || event.time}
        </span>
        {event.time.includes(" ") && (
          <span className="text-[10px] text-muted-foreground">
            {event.time.split(" ").slice(1).join(" ")}
          </span>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center px-2">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full shrink-0",
            config.dot,
            event.status === "conflict" && "animate-pulse-subtle"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 py-3 pr-3 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground truncate">
            {event.title}
          </h4>
          <Badge
            variant="secondary"
            className={cn("text-[10px] gap-1 px-1.5 py-0 shrink-0", config.bg, config.color)}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
        {event.metadata && (
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {event.metadata}
          </p>
        )}
      </div>

      {/* Action */}
      {event.actionLabel && (
        <div className="flex items-center pr-3 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 text-muted-foreground hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation()
              toast.success(`正在处理: ${event.title}`)
              event.onAction?.()
            }}
          >
            {event.actionLabel}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function TimelineView({
  todayEvents,
  weekEvents,
  longTermEvents,
  onNavigateToSchedule,
}: TimelineViewProps) {
  const conflictCount = todayEvents.filter((e) => e.status === "conflict").length
  const totalToday = todayEvents.length

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              今日日程
            </CardTitle>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground">
                {totalToday} 项安排
              </span>
              {conflictCount > 0 && (
                <Badge variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {conflictCount} 个冲突
                </Badge>
              )}
            </div>
          </div>
          {onNavigateToSchedule && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={onNavigateToSchedule}
            >
              查看完整日程
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Today's schedule */}
        <StaggerContainer className="space-y-2 mb-4">
          {todayEvents.map((event) => (
            <StaggerItem key={event.id}>
              <ScheduleRow event={event} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Upcoming section */}
        {(weekEvents.length > 0 || longTermEvents.length > 0) && (
          <div className="border-t pt-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              近期重要安排
            </h4>
            <div className="space-y-1.5">
              {[...weekEvents.slice(0, 2), ...longTermEvents.slice(0, 1)].map(
                (event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onNavigateToSchedule?.()}
                  >
                    <span className="text-[11px] text-muted-foreground w-20 shrink-0 font-tabular">
                      {event.time}
                    </span>
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        getStatusConfig(event.status).dot
                      )}
                    />
                    <span className="text-xs text-foreground truncate">
                      {event.title}
                    </span>
                    {event.status === "incomplete" && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-amber-200 text-amber-600 shrink-0 ml-auto"
                      >
                        准备中
                      </Badge>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
