"use client"

import {
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { toast } from "sonner"

// ==================
// KPI Summary
// ==================
function KpiSummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{"在校学生总数"}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {"1,240"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-[10px]"
            >
              {"~12%"}
            </Badge>
            <span className="text-muted-foreground">{"对比上一学年"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{"预算执行情况"}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {"¥4,520万"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{"已用 37%"}</span>
            <span>{"总计: ¥1.2亿"}</span>
          </div>
          <Progress value={37} className="mt-1 h-1.5" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{"科研产出"}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {"85 篇论文"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-700 text-[10px]"
            >
              {"12 待审"}
            </Badge>
            <span className="text-muted-foreground">{"需要评审"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">
                {"高风险事项"}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {"3 项紧急"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 text-[10px]"
            >
              {"+1 新增"}
            </Badge>
            <span className="text-muted-foreground">{"自昨日起"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================
// Sentiment Center
// ==================
function SentimentCenter() {
  const score = 78
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {"舆情监测中心"}
          </CardTitle>
          <button
            type="button"
            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
            onClick={() => toast("舆情监测中心", { description: "正在加载舆情详细分析报告..." })}
          >
            {"查看详情"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Gauge */}
        <div className="flex flex-col items-center py-6">
          <div className="relative h-36 w-52">
            <svg viewBox="0 0 200 120" className="h-full w-full">
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#sentimentGauge)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 251} 251`}
              />
              <defs>
                <linearGradient
                  id="sentimentGauge"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-4xl font-bold text-foreground">
                {score}
              </span>
              <span className="text-sm text-muted-foreground">{"/100"}</span>
              <span className="mt-1 text-sm font-medium text-orange-500">
                {"情绪积极"}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-[11px] text-blue-600">{"正面"}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{"65%"}</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-[11px] text-muted-foreground">{"中立"}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{"20%"}</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-[11px] text-red-500">{"负面"}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{"15%"}</p>
          </div>
        </div>

        {/* Recent social */}
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[10px]">
              {"微"}
            </div>
            <span className="text-xs font-medium text-foreground">
              {"微博"}
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {"2小时前"}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {"\"学生们正在抱怨新宿舍的WiFi限制。该话题正在本地圈子热议中。\""}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================
// Project Timeline
// ==================
function ProjectTimeline() {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月"]
  const projects = [
    {
      name: "量子芯片 Alpha",
      status: "supply",
      statusLabel: "供应链问题",
      statusColor: "text-red-500",
      dotColor: "bg-red-500",
      owner: "张教授",
      phase: "第二阶段",
      bars: [
        {
          start: 2,
          width: 3,
          label: "第二阶段(延期)",
          gradient: "bg-gradient-to-r from-red-200 to-red-300",
          borderColor: "border-red-300",
          textColor: "text-red-700",
          hoverShadow: "hover:shadow-md hover:shadow-red-100",
        },
      ],
    },
    {
      name: "生物合成实验室",
      status: "budget",
      statusLabel: "预算审查",
      statusColor: "text-yellow-600",
      dotColor: "bg-yellow-500",
      owner: "李主任",
      phase: "采购阶段",
      bars: [
        {
          start: 1,
          width: 2,
          label: "采购阶段",
          gradient: "bg-gradient-to-r from-yellow-200 to-amber-200",
          borderColor: "border-yellow-300",
          textColor: "text-yellow-700",
          hoverShadow: "hover:shadow-md hover:shadow-yellow-100",
        },
      ],
    },
    {
      name: "神经网络训练",
      status: "normal",
      statusLabel: "运行稳定",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      owner: "王博士",
      phase: "数据处理",
      bars: [
        {
          start: 3,
          width: 2,
          label: "数据处理",
          gradient: "bg-gradient-to-r from-blue-200 to-indigo-200",
          borderColor: "border-blue-300",
          textColor: "text-blue-700",
          hoverShadow: "hover:shadow-md hover:shadow-blue-100",
        },
      ],
    },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              {"关键项目时间线"}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {"监控 12 个活跃的战略项目"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[11px] text-muted-foreground">正常</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-[11px] text-muted-foreground">预警</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[11px] text-muted-foreground">严重</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <TooltipProvider delayDuration={200}>
          {/* Timeline header */}
          <div className="flex">
            <div className="w-40 shrink-0 border-b pb-2 text-[11px] font-medium text-muted-foreground">
              项目名称
            </div>
            <div className="grid flex-1 grid-cols-6 border-b">
              {months.map((m, i) => (
                <div
                  key={m}
                  className={`pb-2 text-center text-[11px] font-medium text-muted-foreground ${
                    i % 2 === 1 ? "bg-muted/20" : ""
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Today marker */}
          <div className="relative">
            <div
              className="absolute top-0 bottom-0 z-10 pointer-events-none"
              style={{ left: `calc(${(1.3 / 6) * 100}% + 160px)` }}
            >
              <div className="flex flex-col items-center h-full">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 text-[9px] font-medium text-white shadow-glow-blue">
                  今日
                </div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-500 to-blue-200 animate-glow-pulse" />
              </div>
            </div>

            {/* Project rows */}
            <StaggerContainer>
              {projects.map((project) => (
                <StaggerItem key={project.name}>
                  <div className="group flex items-center border-b py-4 hover:bg-muted/20 transition-colors rounded-sm">
                    <div className="w-40 shrink-0 pl-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${project.dotColor} ${
                            project.status === "supply" ? "animate-pulse-subtle" : ""
                          }`}
                        />
                        <span className={`text-[10px] ${project.statusColor}`}>
                          {project.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="relative grid flex-1 grid-cols-6">
                      {/* Alternating column backgrounds */}
                      {months.map((_, i) => (
                        <div
                          key={i}
                          className={`absolute top-0 bottom-0 ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                          style={{
                            left: `${(i / 6) * 100}%`,
                            width: `${(1 / 6) * 100}%`,
                          }}
                        />
                      ))}
                      {project.bars.map((bar) => (
                        <Tooltip key={bar.label}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              transition={{
                                duration: 0.5,
                                ease: [0.25, 0.46, 0.45, 0.94],
                                delay: 0.3,
                              }}
                              style={{
                                gridColumnStart: bar.start,
                                gridColumnEnd: bar.start + bar.width,
                                transformOrigin: "left",
                              }}
                              className={`relative z-[1] flex h-8 items-center justify-center rounded-md border text-[10px] font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${bar.gradient} ${bar.borderColor} ${bar.textColor} ${bar.hoverShadow}`}
                            >
                              {bar.label}
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{project.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>阶段: {project.phase}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>负责人: {project.owner}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className={`${project.dotColor} h-1.5 w-1.5 rounded-full`} />
                                <span className={project.statusColor}>{project.statusLabel}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

// ==================
// Center Performance
// ==================
function CenterPerformance() {
  const centers = [
    {
      name: "AI & 机器人实验室",
      budget: 80,
      budgetColor: "bg-green-500",
      score: 92,
      status: "优",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      name: "量子计算中心",
      budget: 95,
      budgetColor: "bg-red-500",
      score: 88,
      status: "超支",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      name: "先进材料研究院",
      budget: 60,
      budgetColor: "bg-yellow-500",
      score: 74,
      status: "需关注",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {"各中心绩效概览"}
          </CardTitle>
          <button type="button" className="text-muted-foreground" onClick={() => toast("各中心绩效概览", { description: "正在加载更多绩效数据..." })}>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <table className="w-full">
          <thead>
            <tr className="border-b text-[11px] text-muted-foreground">
              <th className="pb-2 text-left font-medium">{"中心名称"}</th>
              <th className="pb-2 text-left font-medium">{"预算健康度"}</th>
              <th className="pb-2 text-left font-medium">{"产出得分"}</th>
              <th className="pb-2 text-left font-medium">{"状态"}</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((c) => (
              <tr key={c.name} className="border-b last:border-0">
                <td className="py-3 text-sm font-medium text-foreground">
                  {c.name}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${c.budgetColor}`}
                        style={{ width: `${c.budget}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {c.budget}%
                    </span>
                  </div>
                </td>
                <td className="py-3 text-sm text-foreground">
                  {c.score}
                  <span className="text-xs text-muted-foreground">/100</span>
                </td>
                <td className="py-3">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${c.statusColor}`}
                  >
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

// ==================
// Approval Tasks
// ==================
function ApprovalTasks() {
  const tasks = [
    {
      title: "签署秋季学期预算案",
      dept: "财务部",
      deadline: "明天",
      status: "urgent",
      statusLabel: "追期",
      done: false,
    },
    {
      title: "审查伦理委员会报告",
      dept: "合规部",
      deadline: "今天",
      status: "pending",
      statusLabel: "待处理",
      done: false,
    },
    {
      title: "批准新教职王采用",
      dept: "人力资源部",
      deadline: "2小时前",
      status: "done",
      statusLabel: "已完成",
      done: true,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {"待办审批与督导"}
          </CardTitle>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
            onClick={() => toast("新建任务", { description: "正在打开任务创建表单..." })}
          >
            <Plus className="h-3.5 w-3.5" />
            {"新建任务"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.title}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                task.done ? "border-green-200 bg-green-50/30 opacity-60" : "border-border"
              }`}
            >
              <div className="pt-0.5">
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Checkbox className="h-5 w-5" onCheckedChange={() => toast.success("任务状态已更新")} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    task.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{task.dept}</span>
                  <span>{"."}</span>
                  <span>
                    {task.done ? `完成于 ${task.deadline}` : `截止: ${task.deadline}`}
                  </span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-[10px] shrink-0 ${
                  task.status === "urgent"
                    ? "bg-red-100 text-red-700"
                    : task.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {task.statusLabel}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================
// Operations Page
// ==================
// ==================
// Project Information Table
// ==================
function ProjectInfoTable() {
  const projects = [
    {
      id: "1",
      name: "AI & 机器人实验室扩建",
      status: "进行中",
      statusColor: "bg-blue-100 text-blue-700",
      owner: "李主任",
      department: "科研中心",
      progress: 65,
      deadline: "2024-06-30",
      budget: "¥500万",
      spent: "¥325万"
    },
    {
      id: "2",
      name: "量子计算中心二期",
      status: "风险",
      statusColor: "bg-red-100 text-red-700",
      owner: "王教授",
      department: "量子研究所",
      progress: 42,
      deadline: "2024-05-15",
      budget: "¥800万",
      spent: "¥680万"
    },
    {
      id: "3",
      name: "生物医学工程平台",
      status: "已完成",
      statusColor: "bg-green-100 text-green-700",
      owner: "赵博士",
      department: "生物医学中心",
      progress: 100,
      deadline: "2024-02-28",
      budget: "¥350万",
      spent: "¥340万"
    }
  ]

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">重点项目进度</CardTitle>
          <button type="button" className="text-muted-foreground" onClick={() => toast("重点项目进度", { description: "正在加载完整项目列表..." })}>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <table className="w-full">
          <thead>
            <tr className="border-b text-[11px] text-muted-foreground">
              <th className="pb-2 text-left font-medium">项目名称</th>
              <th className="pb-2 text-left font-medium">状态</th>
              <th className="pb-2 text-left font-medium">负责人</th>
              <th className="pb-2 text-left font-medium">进度</th>
              <th className="pb-2 text-left font-medium">截止日期</th>
              <th className="pb-2 text-left font-medium">预算</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b last:border-0">
                <td className="py-3 text-sm font-medium text-foreground">
                  {project.name}
                </td>
                <td className="py-3">
                  <Badge variant="secondary" className={`text-[10px] ${project.statusColor}`}>
                    {project.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <div>
                    <div className="text-sm text-foreground">{project.owner}</div>
                    <div className="text-xs text-muted-foreground">{project.department}</div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{project.deadline}</td>
                <td className="py-3">
                  <div>
                    <div className="text-sm text-foreground">{project.spent}</div>
                    <div className="text-xs text-muted-foreground">/ {project.budget}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default function OperationsPage() {
  return (
    <div className="space-y-5 p-6">
      <KpiSummaryCards />

      <div className="grid grid-cols-3 gap-5">
        {/* Left: Sentiment */}
        <SentimentCenter />

        {/* Center/Right: Project Timeline */}
        <ProjectTimeline />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <CenterPerformance />
        <ApprovalTasks />
      </div>

      <ProjectInfoTable />
    </div>
  )
}
