"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import {
  Filter,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ---------------------
// Mock Data
// ---------------------

interface PolicyInsight {
  label: string
  color: string
  text: string
}

interface PolicyItem {
  id: string
  level: "national" | "beijing"
  agency: string
  agencyColor: string
  date: string
  title: string
  description?: string
  impact?: string
  impactColor?: string
  actionLabel?: string
  insights?: PolicyInsight[]
  tags?: string[]
}

const policyData: PolicyItem[] = [
  {
    id: "1",
    level: "national",
    agency: "科技部",
    agencyColor: "bg-blue-100 text-blue-700",
    date: "2023-11-14",
    title: "关于印发《科技伦理治理指南(2023年修订)》的通知",
    description:
      "科技部发布了关于生成式AI伦理、数据隐私标准和跨境数据传输协议的更新指南。",
    impact: "高影响",
    impactColor: "bg-red-100 text-red-700",
    actionLabel: "AI 影响分析",
    insights: [
      {
        label: "直接行动",
        color: "text-green-600",
        text: "需要立即审查我院\"Lab B\"数据协议。Q4项目资金可能取决于合规性。",
      },
      {
        label: "风险",
        color: "text-yellow-600",
        text: "第4.2条暗示更严格的国际合作限制，未经事先批准不得进行。",
      },
    ],
    tags: ["#AI伦理", "#合规"],
  },
  {
    id: "2",
    level: "beijing",
    agency: "发改委",
    agencyColor: "bg-green-100 text-green-700",
    date: "2023-11-13",
    title: "北京市高级别自动驾驶试点区发展规划",
    insights: [
      {
        label: "机遇",
        color: "text-blue-600",
        text: "为交通系统部门开辟了新的市政拨款窗口。与当前\"智慧城市\"计划一致。",
      },
    ],
  },
  {
    id: "3",
    level: "national",
    agency: "教育部",
    agencyColor: "bg-purple-100 text-purple-700",
    date: "2023-11-12",
    title: "关于加强高校基础研究人才培养的通知",
    description: "关于博士项目资助分配的一般性政策更新。",
  },
  {
    id: "4",
    level: "beijing",
    agency: "北京科委",
    agencyColor: "bg-amber-100 text-amber-700",
    date: "2023-11-11",
    title: "北京算力基础设施补贴政策发布",
    description:
      "面向高校和科研院所的算力基础设施建设补贴，与我院算力平台二期高度匹配。",
    impact: "高影响",
    impactColor: "bg-red-100 text-red-700",
    actionLabel: "组织申报",
    insights: [
      {
        label: "机遇",
        color: "text-green-600",
        text: "匹配度98%，预估资金规模500-1000万，建议紧急组织申报。",
      },
    ],
    tags: ["#算力", "#补贴"],
  },
]

const policyMatchData = [
  {
    id: "m1",
    title: "算力基础设施补贴",
    matchScore: 98,
    funding: "500-1000万",
    daysRemaining: 12,
  },
  {
    id: "m2",
    title: "AI伦理合规专项",
    matchScore: 85,
    funding: "200-500万",
    daysRemaining: 25,
  },
  {
    id: "m3",
    title: "基础研究人才计划",
    matchScore: 72,
    funding: "100-300万",
    daysRemaining: 40,
  },
]

// ---------------------
// Helper: border color by urgency / agency
// ---------------------
function getBorderColor(item: PolicyItem): string {
  if (item.impact) return "border-l-red-500"
  if (item.agency === "科技部") return "border-l-blue-500"
  if (item.agency === "发改委") return "border-l-green-500"
  if (item.agency === "教育部") return "border-l-purple-500"
  if (item.agency === "北京科委") return "border-l-amber-500"
  return "border-l-slate-300"
}

// ---------------------
// Helper: insight icon
// ---------------------
function InsightIcon({ label }: { label: string }) {
  if (label === "直接行动")
    return <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
  if (label === "风险")
    return <AlertTriangle className="h-3 w-3 text-yellow-600 shrink-0" />
  if (label === "机遇")
    return <Zap className="h-3 w-3 text-blue-600 shrink-0" />
  return <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
}

// ---------------------
// Component
// ---------------------
export default function PolicyTrackingView() {
  const [levelFilter, setLevelFilter] = useState<
    "all" | "national" | "beijing"
  >("all")

  const filteredPolicies = policyData.filter((p) => {
    if (levelFilter === "all") return true
    return p.level === levelFilter
  })

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ===== Left Column: Policy Timeline Feed (8 cols) ===== */}
      <div className="col-span-8 space-y-3">
        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <Tabs
            value={levelFilter}
            onValueChange={(v) =>
              setLevelFilter(v as "all" | "national" | "beijing")
            }
          >
            <TabsList className="h-8 bg-muted/50">
              <TabsTrigger value="all" className="text-xs px-3 py-1">
                全部
              </TabsTrigger>
              <TabsTrigger value="national" className="text-xs px-3 py-1">
                国家级
              </TabsTrigger>
              <TabsTrigger value="beijing" className="text-xs px-3 py-1">
                北京市
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
            onClick={() => toast("来源筛选", { description: "正在打开来源筛选面板..." })}
          >
            <Filter className="h-3.5 w-3.5" />
            来源筛选
          </button>
        </div>

        {/* Scrollable Policy Cards */}
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <StaggerContainer className="space-y-3 pr-2">
            {filteredPolicies.map((policy) => (
              <StaggerItem key={policy.id}>
                <HoverCard openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Card
                      className={cn(
                        "shadow-card hover:shadow-card-hover transition-all rounded-xl border-0 border-l-4 cursor-pointer",
                        getBorderColor(policy)
                      )}
                    >
                      <CardContent className="p-4">
                        {/* Top Row: Agency + Impact + Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                "text-[10px] font-medium border-0 hover:opacity-90",
                                policy.agencyColor
                              )}
                            >
                              {policy.agency}
                            </Badge>
                            {policy.impact && policy.impactColor && (
                              <Badge
                                className={cn(
                                  "text-[10px] font-medium border-0",
                                  policy.impactColor
                                )}
                              >
                                {policy.impact}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {policy.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-2 text-sm font-semibold text-foreground leading-snug">
                          {policy.title}
                        </h3>

                        {/* Description (truncated 2 lines) */}
                        {policy.description && (
                          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {policy.description}
                          </p>
                        )}

                        {/* AI Insights */}
                        {policy.insights && policy.insights.length > 0 && (
                          <div className="mt-3 rounded-lg bg-blue-50 p-3 border border-blue-100/50">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-xs font-medium text-blue-700">
                                AI 洞察
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {policy.insights.slice(0, 1).map((insight, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-1.5"
                                >
                                  <InsightIcon label={insight.label} />
                                  <p className="text-xs text-blue-600 leading-relaxed">
                                    <span
                                      className={cn(
                                        "font-medium",
                                        insight.color
                                      )}
                                    >
                                      {insight.label}:
                                    </span>{" "}
                                    {insight.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {policy.tags && policy.tags.length > 0 && (
                          <div className="mt-2.5 flex items-center gap-1.5">
                            {policy.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] font-normal px-1.5 py-0 h-5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                            onClick={(e) => { e.stopPropagation(); toast("政策详情", { description: `正在加载「${policy.title}」的详细信息...` }) }}
                          >
                            查看详情
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          {policy.actionLabel && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 transition-colors"
                              onClick={(e) => { e.stopPropagation(); toast.success(`已启动: ${policy.actionLabel}`, { description: `针对「${policy.title}」的操作已开始执行` }) }}
                            >
                              {policy.actionLabel}
                              <Zap className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>

                  {/* Hover Card: Full description + all insights */}
                  <HoverCardContent
                    side="right"
                    align="start"
                    className="w-80 p-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-[10px] font-medium border-0",
                            policy.agencyColor
                          )}
                        >
                          {policy.agency}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {policy.date}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold leading-snug">
                        {policy.title}
                      </h4>

                      {policy.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {policy.description}
                        </p>
                      )}

                      {policy.insights && policy.insights.length > 0 && (
                        <div className="space-y-2 pt-1 border-t">
                          <p className="text-xs font-medium text-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-blue-500" />
                            全部 AI 洞察
                          </p>
                          {policy.insights.map((insight, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <InsightIcon label={insight.label} />
                              <p className="text-xs leading-relaxed">
                                <span
                                  className={cn("font-medium", insight.color)}
                                >
                                  {insight.label}:
                                </span>{" "}
                                {insight.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollArea>
      </div>

      {/* ===== Right Column (4 cols) ===== */}
      <div className="col-span-4 space-y-4">
        {/* 1. AI Policy Analysis Summary */}
        <Card className="rounded-xl border-0 bg-slate-800 text-white shadow-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              AI 政策分析
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              本周政策环境活跃度显著上升。科技部伦理指南修订将直接影响跨境合作项目，
              北京市算力补贴窗口期仅剩12天，建议优先组织申报。整体政策风向利好基础研究投入。
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500 transition-colors"
                onClick={() => toast("AI 政策分析", { description: "正在打开完整分析报告..." })}
              >
                阅读分析
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md bg-slate-700 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-600 transition-colors"
                onClick={() => toast.success("起草备忘录", { description: "AI 正在生成政策备忘录草稿..." })}
              >
                起草备忘录
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Key Signals */}
        <Card className="rounded-xl border-0 shadow-card hover:shadow-card-hover transition-all">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-foreground leading-relaxed italic">
                  &ldquo;要把基础研究摆在更加突出的位置，加大长期稳定支持力度，
                  鼓励自由探索和交叉融合。&rdquo;
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  -- 国务院常务会议纪要 &middot; 2023.11.10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Policy Match Opportunities */}
        <Card className="rounded-xl border-0 shadow-card hover:shadow-card-hover transition-all">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              政策匹配机会
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2.5">
              {policyMatchData.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 hover:bg-muted/60 transition-colors cursor-pointer"
                  onClick={() => toast("政策匹配", { description: `「${match.title}」匹配度${match.matchScore}%，剩余${match.daysRemaining}天` })}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {match.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      资金规模: {match.funding}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-green-600">
                        {match.matchScore}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">匹配</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 shrink-0"
                    >
                      {match.daysRemaining}天
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
