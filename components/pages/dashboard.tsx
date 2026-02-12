"use client"

import React from "react"

import {
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  BookmarkIcon,
  Share2,
  ExternalLink,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ==================
// KPI Cards
// ==================
function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  change,
  changeLabel,
  variant = "default",
  extra,
}: {
  label: string
  value: string
  unit?: string
  icon: React.ElementType
  change?: string
  changeLabel?: string
  variant?: "default" | "warning" | "danger"
  extra?: React.ReactNode
}) {
  const variantStyles = {
    default: "border-border",
    warning: "border-yellow-200 bg-yellow-50/40",
    danger: "border-red-200 bg-red-50/40",
  }

  return (
    <Card className={`${variantStyles[variant]} relative overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              variant === "danger"
                ? "bg-red-100 text-red-600"
                : variant === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-50 text-blue-500"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {extra && <div className="mt-3">{extra}</div>}
        {change && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-50"
            >
              {change}
            </Badge>
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ==================
// Alert Banner
// ==================
function AlertBanner() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-800">
              {"紧急警报：教育部政策变动"}
            </span>
            <Badge className="bg-red-500 text-[10px] text-white hover:bg-red-500">
              {"特急"}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-red-600">
            {'今早发布的《人工智能伦理合规新指引》要求立即审查。需在第四季度资金审批前，由伦理委员会完成合规评估。'}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
      >
        {"查看简报"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ==================
// Sentiment Gauge Badge (Compact)
// ==================
function SentimentGaugeBadge() {
  const score = 82
  const filledDots = Math.round((score / 100) * 4) // 4 dots max

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {"师生舆情指数"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-sm text-green-600 font-medium">{"积极向好"}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < filledDots ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {"基于月度满意度调查数据"}
        </p>
      </CardContent>
    </Card>
  )
}

// ==================
// News Feed
// ==================
function NewsFeed() {
  return (
    <Card className="col-span-full">
      <CardContent className="p-0">
        <Tabs defaultValue="tech" className="w-full">
          <div className="flex items-center justify-between border-b px-5 pt-4 pb-0">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger
                value="ops"
                className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
                {"内部运营监控"}
              </TabsTrigger>
              <TabsTrigger
                value="tech"
                className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
                {"全球科技情报"}
              </TabsTrigger>
            </TabsList>
            <button
              type="button"
              className="text-xs text-blue-500 hover:underline"
            >
              {"查看所有来源"}
            </button>
          </div>

          <TabsContent value="tech" className="mt-0 p-5">
            <div className="space-y-5">
              {/* Featured article */}
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
                <Badge className="bg-blue-500 text-[10px] text-white hover:bg-blue-500">
                  {"重大突破"}
                </Badge>
                <h3 className="mt-3 text-lg font-semibold leading-snug">
                  {"DeepMind 发布 AlphaFold 更新：蛋白质折叠预测准确率突破 98.5%"}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {"2 小时前"}
                  </span>
                  <span>{"自然 (Nature) 期刊"}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Social post */}
              <div className="flex gap-3 rounded-xl border border-border bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {"YL"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {"Yann LeCun (杨立昆)"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {"@ylecun"}
                    </span>
                    <div className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-foreground leading-relaxed">
                    {"大型语言模型(LLM)的未来不仅仅在于参数规模的扩大，更在于建立世界模型和推理能力。"}
                    <span className="text-blue-500">
                      {" #AI #机器学习"}
                    </span>
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{"1.2k"}</span>
                    <span>{"405 转发"}</span>
                  </div>
                </div>
              </div>

              {/* Market trend */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {"生物科技 IPO 趋势上扬"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {"1小时前"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {"市场分析 . 第三季度简报"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-[10px] text-green-700"
                    >
                      {"纳斯达克: GINK +4.2%"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-[10px] text-green-700"
                    >
                      {"纽交所: RXRX +2.1%"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ops" className="mt-0 p-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {"大模型基座项目采购审批延期15天"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {"卡点：采购审批停滞于李某某处，建议直接施压"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4">
                <Shield className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {"量子计算中心二期设备到货"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {"预计下周完成安装调试，项目进展正常"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ==================
// Schedule Sidebar
// ==================
function ScheduleSidebar() {
  const events = [
    {
      time: "09:00 - 11:00",
      status: "进行中",
      title: "执行委员会月度会议",
      priority: "高优先级",
      priorityColor: "bg-blue-100 text-blue-700",
      dotColor: "bg-blue-500",
    },
    {
      time: "14:00 - 15:30",
      status: "",
      title: "毕业典礼致辞准备",
      priority: "初稿待审阅",
      priorityColor: "bg-yellow-100 text-yellow-700",
      dotColor: "bg-gray-300",
      hasProgress: true,
    },
    {
      time: "16:30 - 17:00",
      status: "",
      title: "运营周会",
      priority: "",
      dotColor: "bg-gray-300",
      conflict: "与部委电话会议冲突",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {"2月10日星期二"}
          </CardTitle>
          <div className="flex gap-1">
            <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted">
              {"<"}
            </button>
            <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted">
              {">"}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.title} className="relative flex gap-2 border-l-2 border-muted pl-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${event.dotColor === "bg-blue-500" ? "text-blue-600" : "text-muted-foreground"}`}>
                    {event.time}
                  </span>
                  {event.status && (
                    <span className="text-[10px] text-blue-600">
                      {". "}
                      {event.status}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {event.title}
                </p>
                {event.priority && (
                  <Badge
                    variant="secondary"
                    className={`mt-1.5 text-[10px] ${event.priorityColor}`}
                  >
                    {event.priority}
                  </Badge>
                )}
                {event.hasProgress && (
                  <div className="mt-2">
                    <Progress value={35} className="h-1.5" />
                  </div>
                )}
                {event.conflict && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{event.conflict}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================
// Risk Monitor
// ==================
function RiskMonitor() {
  const risks = [
    {
      name: "泰坦计算集群项目",
      level: "high",
      tag: "预算偏差预警",
    },
    {
      name: "AI伦理审查流程",
      level: "medium",
      tag: "截止日期临近",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">
            {"重点项目风险"}
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            2
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {risks.map((risk) => (
            <div
              key={risk.name}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  risk.level === "high" ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {risk.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <AlertTriangle
                    className={`h-3 w-3 ${
                      risk.level === "high"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      risk.level === "high"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {risk.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================
// Dashboard Page
// ==================
export default function DashboardPage() {
  return (
    <div className="space-y-5 p-6 max-w-7xl mx-auto">
      {/* Alert Banner */}
      <AlertBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="科研经费到位率"
          value="¥9,840"
          unit="万"
          icon={DollarSign}
          extra={
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{"已完成年度目标"}</span>
                <span>{"78%"}</span>
              </div>
              <Progress value={78} className="mt-1 h-1.5" />
            </div>
          }
          change="+12%"
          changeLabel=""
        />
        <KpiCard
          label="预算执行情况"
          value="¥4,520"
          unit="万"
          icon={FileText}
          extra={
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{"已用 37%"}</span>
                <span>{"总计: ¥1.2亿"}</span>
              </div>
              <Progress value={37} className="mt-1 h-1.5" />
            </div>
          }
        />
        <KpiCard
          label="科研产出"
          value="85"
          unit="篇论文"
          icon={FileText}
          change="+8"
          changeLabel="较上月"
        />
        <KpiCard
          label="高风险事项"
          value="3"
          unit="项紧急"
          icon={AlertTriangle}
          variant="danger"
          change="+1"
          changeLabel="新增"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Sentiment + Risk */}
        <div className="col-span-4 space-y-4">
          <SentimentGaugeBadge />
          <RiskMonitor />
        </div>

        {/* Center: News Feed */}
        <div className="col-span-5">
          <NewsFeed />
        </div>

        {/* Right: Schedule */}
        <div className="col-span-3">
          <ScheduleSidebar />
        </div>
      </div>
    </div>
  )
}
