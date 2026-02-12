"use client"

import { useState } from "react"
import {
  Calendar as CalendarIcon,
  MapPin,
  FileText,
  Eye,
  AlertTriangle,
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Users,
  Star,
  Plus,
  Target,
  Timer,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  MotionCard,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
} from "@/components/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ==================
// Data
// ==================

interface ScheduleEvent {
  time: string
  title: string
  subtitle: string
  color: string
  badgeColor: string
  type: "strategic" | "routine" | "conflict" | "deadline"
  roi: number
  confirmed: boolean
  location: string
  description: string
  stakeholders: Array<{
    name: string
    initial: string
    role: string
    influence: "high" | "medium" | "low"
    bgColor: string
  }>
  talkingPoints: string[]
  history: Array<{
    date: string
    content: string
    positive: boolean
  }>
  files: Array<{
    name: string
    size: string
    added: string
    iconBg: string
    iconColor: string
    icon: "doc" | "ppt"
  }>
}

const EVENTS: ScheduleEvent[] = [
  {
    time: "09:00 - 10:30",
    title: "Q3 战略技术审查",
    subtitle: "与科技部联席会议",
    color: "bg-blue-500",
    badgeColor: "bg-blue-100 text-blue-700",
    type: "strategic",
    roi: 85,
    confirmed: true,
    location: "A号主会议厅",
    description:
      "资金续批潜力极高。基于历史数据，与该单位的会议在3个月内的政策批准相关性高达70%。",
    stakeholders: [
      {
        name: "张部长",
        initial: "张",
        role: "科技部",
        influence: "high",
        bgColor: "bg-blue-100 text-blue-700",
      },
      {
        name: "Dr. Emily Wu",
        initial: "吴",
        role: "AI 实验室主任",
        influence: "medium",
        bgColor: "bg-slate-100 text-slate-700",
      },
    ],
    talkingPoints: [
      "重点提及计算成本降低了15%。",
      "提议与政策部门建立联合AI工作组。",
      "主动回应关于道德AI的担忧。",
    ],
    history: [
      {
        date: "8月12日",
        content: "量子资金联合提案已获批准。",
        positive: true,
      },
      {
        date: "待处理",
        content: "上个月提交的伦理准则审查。",
        positive: false,
      },
    ],
    files: [
      {
        name: "Q3_技术报告_终稿.pdf",
        size: "2.4 MB",
        added: "昨天添加",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        icon: "doc",
      },
      {
        name: "战略_审查_演示文稿_v2.pptx",
        size: "5.1 MB",
        added: "2小时前添加",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: "ppt",
      },
    ],
  },
  {
    time: "11:00 - 12:00",
    title: "内部运营审计",
    subtitle: "财务部 302室",
    color: "bg-slate-400",
    badgeColor: "bg-slate-100 text-slate-600",
    type: "routine",
    roi: 42,
    confirmed: true,
    location: "财务部 302室",
    description:
      "常规性运营审计，重点审查上季度项目支出合规情况。建议委派运营总监全程参与。",
    stakeholders: [
      {
        name: "陈处长",
        initial: "陈",
        role: "财务处",
        influence: "medium",
        bgColor: "bg-slate-100 text-slate-700",
      },
      {
        name: "刘审计员",
        initial: "刘",
        role: "审计部",
        influence: "low",
        bgColor: "bg-slate-100 text-slate-700",
      },
    ],
    talkingPoints: [
      "确认Q2经费执行率达标情况。",
      "跟进大模型基座项目采购延期问题。",
      "核实量子计算中心设备到货清单。",
    ],
    history: [
      {
        date: "7月15日",
        content: "上季度审计未发现重大偏差。",
        positive: true,
      },
    ],
    files: [
      {
        name: "Q2_财务审计_报告.pdf",
        size: "1.8 MB",
        added: "3天前添加",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        icon: "doc",
      },
    ],
  },
  {
    time: "14:00 - 15:30",
    title: "人才引进委员会",
    subtitle: "人力资源会议室",
    color: "bg-red-500",
    badgeColor: "bg-red-100 text-red-700",
    type: "conflict",
    roi: 72,
    confirmed: false,
    location: "人力资源会议室",
    description:
      "讨论下半年高层次人才引进计划。与14:30的部委电话会议存在时间冲突，建议授权副手参加。",
    stakeholders: [
      {
        name: "赵院长",
        initial: "赵",
        role: "人力资源处",
        influence: "medium",
        bgColor: "bg-orange-100 text-orange-700",
      },
      {
        name: "Prof. Chen",
        initial: "陈",
        role: "学术委员会",
        influence: "high",
        bgColor: "bg-blue-100 text-blue-700",
      },
    ],
    talkingPoints: [
      "审议3名海外高层次候选人资质。",
      "讨论薪酬竞争力对标方案。",
      "确定下半年招聘时间表。",
    ],
    history: [
      {
        date: "9月3日",
        content: "成功引进两名国家级人才。",
        positive: true,
      },
    ],
    files: [
      {
        name: "候选人_履历_汇总.pdf",
        size: "3.2 MB",
        added: "今天上传",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        icon: "doc",
      },
    ],
  },
  {
    time: "16:00 - 17:00",
    title: "审查伦理委员会报告",
    subtitle: "线上会议",
    color: "bg-amber-500",
    badgeColor: "bg-amber-100 text-amber-700",
    type: "deadline",
    roi: 68,
    confirmed: true,
    location: "线上会议 (腾讯会议)",
    description:
      "AI伦理合规新指引审查截止日为今天。需确认伦理委员会对第四季度资金申请的合规意见。",
    stakeholders: [
      {
        name: "孙主任",
        initial: "孙",
        role: "伦理委员会",
        influence: "high",
        bgColor: "bg-amber-100 text-amber-700",
      },
    ],
    talkingPoints: [
      "确认AI伦理合规审查结论。",
      "讨论新指引对Q4资金申请的影响。",
      "制定后续合规整改时间表。",
    ],
    history: [
      {
        date: "10月20日",
        content: "教育部发布AI伦理合规新指引。",
        positive: false,
      },
    ],
    files: [
      {
        name: "AI伦理_审查报告_v3.pdf",
        size: "1.5 MB",
        added: "今天上传",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        icon: "doc",
      },
    ],
  },
]

// ==================
// Calendar helpers
// ==================

function getMonthData(year: number, month: number): number[][] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Adjust for Monday-first week (0 = Mon, 6 = Sun)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const weeks: number[][] = []
  let currentDay = 1
  let prevDay = daysInPrevMonth - startOffset + 1
  let nextDay = 1

  for (let week = 0; week < 6; week++) {
    const row: number[] = []
    for (let col = 0; col < 7; col++) {
      const cellIndex = week * 7 + col
      if (cellIndex < startOffset) {
        row.push(-prevDay)
        prevDay++
      } else if (currentDay > daysInMonth) {
        row.push(-nextDay)
        nextDay++
      } else {
        row.push(currentDay)
        currentDay++
      }
    }
    weeks.push(row)
    if (currentDay > daysInMonth) break
  }

  // Remove trailing empty weeks
  while (
    weeks.length > 4 &&
    weeks[weeks.length - 1].every((d) => d < 0)
  ) {
    weeks.pop()
  }

  return weeks
}

const WEEK_DAYS = ["一", "二", "三", "四", "五", "六", "日"]

const EVENT_DAYS = [7, 12, 15, 21, 25]

// Map event types to dot colors for the calendar
function getEventDotColor(type: ScheduleEvent["type"]): string {
  switch (type) {
    case "strategic":
      return "bg-blue-500"
    case "conflict":
      return "bg-red-500"
    case "deadline":
      return "bg-amber-500"
    case "routine":
      return "bg-slate-400"
  }
}

// ==================
// Contextual Advice Helper
// ==================

interface ContextualAdvice {
  title: string
  description: string
  icon: typeof Target
  color: "blue" | "red" | "amber"
  suggestions: string[]
}

function getContextualAdvice(event: ScheduleEvent): ContextualAdvice {
  switch (event.type) {
    case "strategic":
      return {
        title: "战略价值分析",
        description: `此会议ROI评分${event.roi}，属于高优先级战略事项。`,
        icon: Target,
        color: "blue",
        suggestions: [
          "建议重点准备量化成果数据",
          "预设2-3个可能的质疑点并准备回应",
        ],
      }
    case "conflict":
      return {
        title: "检测到日程冲突",
        description: `${event.title}与其他事项时间重叠。`,
        icon: AlertTriangle,
        color: "red",
        suggestions: [
          "建议授权副手处理低ROI事项",
          "重新安排至明日空闲时段",
        ],
      }
    case "routine":
      return {
        title: "效率建议",
        description: `此为常规运营事务（ROI: ${event.roi}），建议考虑委派处理。`,
        icon: Clock,
        color: "amber",
        suggestions: [
          "可授权运营总监全程参与",
          "仅在需要决策时介入",
        ],
      }
    case "deadline":
      return {
        title: "截止提醒",
        description: `此事项今日截止，需确保按时完成。`,
        icon: Timer,
        color: "amber",
        suggestions: [
          "确认所有材料已就绪",
          "提前30分钟准备审阅",
        ],
      }
  }
}

function getSpeechIntro(type: ScheduleEvent["type"]): string {
  switch (type) {
    case "strategic":
      return "基于参会者名单和您的Q3目标，我起草了强调\"跨部门效率\"的谈话要点。"
    case "conflict":
      return "鉴于此事项存在时间冲突，以下要点可帮助您高效推进或授权他人处理。"
    case "routine":
      return "此为常规事务，以下为关键议程要点摘要，可用于快速审阅或委派参考。"
    case "deadline":
      return "此事项今日截止，以下为审查要点清单，确保不遗漏关键项。"
  }
}

function getRecommendedActivity(event: ScheduleEvent): {
  title: string
  badge: string
  icon: string
  time: string
  description: string
} {
  switch (event.type) {
    case "strategic":
      return {
        title: "全球AI治理峰会",
        badge: "外部",
        icon: "AI",
        time: "线上 . 11月12日 . 20:00",
        description:
          "与您当前关注的AI伦理高度相关。Dr. Sutton 将发表主旨演讲。",
      }
    case "conflict":
      return {
        title: "高效会议管理工作坊",
        badge: "内部",
        icon: "效",
        time: "线下 . 下周三 . 14:00",
        description:
          "学习如何减少日程冲突，提升会议效率。近期冲突频率偏高。",
      }
    case "routine":
      return {
        title: "运营自动化研讨会",
        badge: "线上",
        icon: "自",
        time: "线上 . 本周五 . 15:00",
        description:
          "探索将常规审计流程自动化的方案，减少手动审查时间。",
      }
    case "deadline":
      return {
        title: "AI伦理合规论坛",
        badge: "外部",
        icon: "伦",
        time: "线上 . 11月18日 . 09:00",
        description:
          "深入探讨AI伦理新规对高校科研的影响，与监管层直接对话。",
      }
  }
}

// ==================
// Calendar Sidebar
// ==================

function CalendarSidebar({
  selectedDay,
  onSelectDay,
  selectedEvent,
  onSelectEvent,
}: {
  selectedDay: number
  onSelectDay: (day: number) => void
  selectedEvent: number
  onSelectEvent: (index: number) => void
}) {
  const [monthOffset, setMonthOffset] = useState(0)

  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()
  const calendarWeeks = getMonthData(viewYear, viewMonth)
  const isCurrentMonth = monthOffset === 0

  const monthLabel = `${viewYear}年 ${viewMonth + 1}月`

  return (
    <div className="space-y-4">
      {/* Mini Calendar */}
      <Card className="overflow-hidden shadow-sm border border-border">
        <div className="bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
            <div className="flex gap-0.5">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMonthOffset((prev) => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMonthOffset((prev) => prev + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="mt-3">
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] text-muted-foreground pb-1 font-medium"
                >
                  {d}
                </div>
              ))}
            </div>
            {calendarWeeks.map((week, wi) => (
              <div key={`week-${wi}`} className="grid grid-cols-7 gap-0.5">
                {week.map((date, di) => {
                  const isOutside = date < 0
                  const absDate = Math.abs(date)
                  const isSelected = !isOutside && isCurrentMonth && absDate === selectedDay
                  const isToday = !isOutside && isCurrentMonth && absDate === today.getDate()
                  const hasEvent = !isOutside && isCurrentMonth && EVENT_DAYS.includes(absDate)

                  // Determine event dot color: pick the first event type that matches the day
                  // For simplicity, cycle through types based on day index
                  const eventDotColor = hasEvent
                    ? (() => {
                        const dayIndex = EVENT_DAYS.indexOf(absDate)
                        const types: ScheduleEvent["type"][] = [
                          "strategic",
                          "conflict",
                          "deadline",
                          "routine",
                          "strategic",
                        ]
                        return getEventDotColor(types[dayIndex] || "strategic")
                      })()
                    : ""

                  return (
                    <button
                      key={`d-${wi}-${di}`}
                      type="button"
                      onClick={() => {
                        if (!isOutside && isCurrentMonth) {
                          onSelectDay(absDate)
                        }
                      }}
                      className={cn(
                        "relative flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all",
                        isOutside && "text-muted-foreground/50 cursor-default",
                        !isOutside && !isSelected && "text-foreground hover:bg-muted",
                        isSelected && "bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30",
                        isToday && !isSelected && "ring-1 ring-blue-400 text-blue-600 font-medium",
                      )}
                    >
                      {absDate}
                      {hasEvent && !isSelected && (
                        <span
                          className={cn(
                            "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                            eventDotColor,
                          )}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Category filters */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { label: "全部日程", dotColor: "" },
              { label: "战略", dotColor: "bg-blue-500" },
              { label: "冲突", dotColor: "bg-red-500" },
              { label: "截止", dotColor: "bg-amber-500" },
              { label: "运营", dotColor: "bg-slate-400" },
            ].map((cat, i) => (
              <Badge
                key={cat.label}
                variant="secondary"
                className={cn(
                  "text-[10px] cursor-pointer transition-colors gap-1",
                  i === 0
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {cat.dotColor && (
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      cat.dotColor,
                    )}
                  />
                )}
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Today's Events */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground px-1">
          {"今天, " + (today.getMonth() + 1) + "月" + selectedDay + "日"}
        </p>
        <ScrollArea className="h-[calc(100vh-520px)]">
          <StaggerContainer className="space-y-2.5 pr-2">
            {EVENTS.map((event, index) => (
              <StaggerItem key={event.title}>
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    event.type === "conflict" && "border-red-200 bg-red-50/30",
                    event.type === "deadline" && "border-amber-200 bg-amber-50/30",
                    selectedEvent === index
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "hover:shadow-md hover:-translate-y-0.5",
                  )}
                  onClick={() => onSelectEvent(index)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          event.color,
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px]",
                              event.badgeColor,
                            )}
                          >
                            {event.time}
                          </Badge>
                          {event.type === "conflict" && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                          {event.type === "deadline" && (
                            <Timer className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <p className="mt-1 text-sm font-medium text-foreground leading-snug">
                          {event.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {event.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollArea>
      </div>
    </div>
  )
}

// ==================
// ROI Ring
// ==================

function RoiRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`

  function getScoreColor(value: number): string {
    if (value >= 75) return "#3b82f6"
    if (value >= 50) return "#f59e0b"
    return "#94a3b8"
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="h-24 w-24">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          transform="rotate(-90 50 50)"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber
          value={score}
          className="text-xl font-bold text-foreground"
        />
        <span className="text-[10px] text-muted-foreground">
          {"ROI评分"}
        </span>
      </div>
    </div>
  )
}

// ==================
// Meeting Detail
// ==================

function MeetingDetail({ event }: { event: ScheduleEvent }) {
  function getTypeLabel(type: ScheduleEvent["type"]): string {
    switch (type) {
      case "strategic":
        return "战略优先级"
      case "routine":
        return "常规运营"
      case "conflict":
        return "存在冲突"
      case "deadline":
        return "今日截止"
    }
  }

  function getTypeBadgeStyle(type: ScheduleEvent["type"]): string {
    switch (type) {
      case "strategic":
        return "bg-blue-500 text-white hover:bg-blue-500"
      case "routine":
        return "bg-slate-500 text-white hover:bg-slate-500"
      case "conflict":
        return "bg-red-500 text-white hover:bg-red-500"
      case "deadline":
        return "bg-amber-500 text-white hover:bg-amber-500"
    }
  }

  function getRelevanceLabel(score: number): string {
    if (score >= 75) return "关键战略相关性"
    if (score >= 50) return "中等业务相关性"
    return "常规事务"
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-4 pr-2">
        {/* Header */}
        <MotionCard delay={0}>
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-2">
                <Badge className={cn("text-[10px]", getTypeBadgeStyle(event.type))}>
                  {getTypeLabel(event.type)}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px]",
                    event.confirmed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700",
                  )}
                >
                  {event.confirmed ? "已确认" : "待确认"}
                </Badge>
              </div>

              <h2 className="mt-3 text-xl font-bold text-foreground leading-snug text-balance">
                {event.title}
                {event.type === "strategic" && ": AI 与量子计算倡议"}
              </h2>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>

        {/* ROI Analysis */}
        <MotionCard delay={0.1}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-foreground">
                  {"事项价值分析"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <RoiRing score={event.roi} />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {getRelevanceLabel(event.roi)}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>

        {/* Key Stakeholders */}
        <MotionCard delay={0.2}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">
                {"关键利益相关者 & 影响力"}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {event.stakeholders.map((person) => (
                  <TooltipProvider key={person.name} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-default">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback
                              className={cn(
                                "text-xs font-bold",
                                person.bgColor,
                              )}
                            >
                              {person.initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {person.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {person.role}
                            </p>
                            <Badge
                              className={cn(
                                "mt-1 text-[9px]",
                                person.influence === "high"
                                  ? "bg-blue-500 text-white hover:bg-blue-500"
                                  : person.influence === "medium"
                                    ? "bg-slate-200 text-slate-700 hover:bg-slate-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-100",
                              )}
                            >
                              {person.influence === "high"
                                ? "高影响力"
                                : person.influence === "medium"
                                  ? "中影响力"
                                  : "一般"}
                            </Badge>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {person.name} - {person.role}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionCard>

        {/* Interaction History */}
        <MotionCard delay={0.3}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">
                {"互动历史记录"}
              </h3>
              <div className="mt-3 space-y-2">
                {event.history.map((item) => (
                  <div
                    key={item.date + item.content}
                    className="flex items-start gap-2 text-xs"
                  >
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full shrink-0",
                        item.positive ? "bg-green-500" : "bg-slate-300",
                      )}
                    />
                    <p
                      className={
                        item.positive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      <span className="font-medium">
                        {item.positive
                          ? `上次互动 (${item.date}):`
                          : `${item.date}:`}
                      </span>
                      {" " + item.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionCard>

        {/* Briefing Materials */}
        <MotionCard delay={0.4}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">
                {"简报材料"}
              </h3>
              <div className="mt-3 space-y-2">
                {event.files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          file.iconBg,
                        )}
                      >
                        {file.icon === "doc" ? (
                          <FileText
                            className={cn("h-4 w-4", file.iconColor)}
                          />
                        ) : (
                          <Play
                            className={cn("h-4 w-4", file.iconColor)}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {file.size + " . " + file.added}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => toast("正在打开文件...")}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionCard>
      </div>
    </ScrollArea>
  )
}

// ==================
// AI Advisor
// ==================

function AIAdvisor({ event }: { event: ScheduleEvent }) {
  const advice = getContextualAdvice(event)
  const speechIntro = getSpeechIntro(event.type)
  const recommended = getRecommendedActivity(event)

  const AdviceIcon = advice.icon

  const adviceColorMap = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50/30",
      iconBg: "bg-blue-500",
      textHighlight: "text-blue-600",
      buttonBg: "bg-slate-800 hover:bg-slate-700",
    },
    red: {
      border: "border-red-200",
      bg: "bg-red-50/30",
      iconBg: "bg-red-500",
      textHighlight: "text-red-600",
      buttonBg: "bg-slate-800 hover:bg-slate-700",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50/30",
      iconBg: "bg-amber-500",
      textHighlight: "text-amber-600",
      buttonBg: "bg-slate-800 hover:bg-slate-700",
    },
  }

  const colors = adviceColorMap[advice.color]

  return (
    <div className="space-y-4">
      {/* Advisor Header */}
      <MotionCard delay={0.05} direction="right">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {"智能顾问"}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {"实时情报 & 决策建议"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      {/* Speech Draft - reactive to event */}
      <MotionCard delay={0.15} direction="right">
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                <Sparkles className="h-3 w-3" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {"发言提纲已就绪"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {speechIntro}
            </p>
            <ul className="mt-3 space-y-1.5">
              {event.talkingPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2 text-center text-xs font-medium text-white shadow-sm hover:shadow-md transition-shadow"
                onClick={() => toast.success("发言提纲已打开")}
              >
                {"查看完整草稿"}
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                onClick={() => toast("正在导出文件...")}
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      {/* Contextual Advice Card - fully reactive to event type */}
      <MotionCard delay={0.25} direction="right">
        <Card className={cn(colors.border, colors.bg)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AdviceIcon className={cn("h-4 w-4", colors.textHighlight)} />
              <span className="text-sm font-semibold text-foreground">
                {advice.title}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {advice.description}
            </p>
            <ul className="mt-2 space-y-1.5">
              {advice.suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <div
                    className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                      advice.color === "blue"
                        ? "bg-blue-500"
                        : advice.color === "red"
                          ? "bg-red-500"
                          : "bg-amber-500",
                    )}
                  />
                  {suggestion}
                </li>
              ))}
            </ul>
            {event.type === "conflict" && (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-800 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
                onClick={() => toast.success("已授权李副主任代为出席")}
              >
                <Users className="h-3.5 w-3.5" />
                {"授权李副主任处理"}
              </button>
            )}
            {event.type === "routine" && (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-800 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
                onClick={() => toast.success("已委派运营总监全程参与")}
              >
                <Users className="h-3.5 w-3.5" />
                {"委派运营总监处理"}
              </button>
            )}
            {event.type === "deadline" && (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-medium text-white hover:bg-amber-600 transition-colors"
                onClick={() => toast.success("已设置截止提醒")}
              >
                <Timer className="h-3.5 w-3.5" />
                {"设置紧急提醒"}
              </button>
            )}
            {event.type === "strategic" && (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-500 py-2 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                onClick={() => toast.success("战略分析报告已生成")}
              >
                <Target className="h-3.5 w-3.5" />
                {"生成战略分析报告"}
              </button>
            )}
          </CardContent>
        </Card>
      </MotionCard>

      {/* Recommended Activity - reactive to event */}
      <MotionCard delay={0.35} direction="right">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold text-foreground">
                  {"推荐活动"}
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] bg-transparent"
              >
                {recommended.badge}
              </Badge>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                {recommended.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {recommended.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">
                    {recommended.time}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {recommended.description}
            </p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
              onClick={() => toast.success("已添加到日程")}
            >
              <Plus className="h-3.5 w-3.5" />
              {"添加到日程"}
            </button>
          </CardContent>
        </Card>
      </MotionCard>

      {/* Chat Input */}
      <MotionCard delay={0.45} direction="right">
        <div className="relative">
          <Input
            placeholder="要求顾问重新安排或准备数据..."
            className="h-10 pr-10 text-xs"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-shadow"
            onClick={() => toast("正在处理您的请求...")}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </MotionCard>
    </div>
  )
}

// ==================
// Schedule Page
// ==================

export default function SchedulePage() {
  const today = new Date()
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedEvent, setSelectedEvent] = useState(0)

  const currentEvent = EVENTS[selectedEvent]

  return (
    <div className="p-5">
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Calendar Sidebar */}
        <div className="col-span-3">
          <CalendarSidebar
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* Center: Meeting Detail */}
        <div className="col-span-5">
          <MeetingDetail event={currentEvent} />
        </div>

        {/* Right: AI Advisor */}
        <div className="col-span-4">
          <AIAdvisor event={currentEvent} />
        </div>
      </div>
    </div>
  )
}
