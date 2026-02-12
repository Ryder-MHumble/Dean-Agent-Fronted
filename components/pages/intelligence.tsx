"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Shield,
  Cpu,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Sparkles,
  Building2,
  Zap,
  Target,
  ChevronRight,
  FileText,
  Activity,
} from "lucide-react"
import { MotionCard, MotionNumber, StaggerContainer, StaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ==================
// Types
// ==================

interface PolicyItem {
  id: string
  name: string
  agency: string
  agencyType: "national" | "beijing" | "ministry"
  matchScore: number
  funding: string
  deadline: string
  daysLeft: number
  status: "urgent" | "active" | "tracking"
  aiInsight: string
  detail: string
}

interface TechTrend {
  id: string
  topic: string
  heatTrend: "surging" | "rising" | "stable" | "declining"
  heatLabel: string
  ourStatus: "deployed" | "weak" | "none"
  ourStatusLabel: string
  riskLevel: "high" | "medium" | "low"
  keyMetric: string
  aiInsight: string
  detail: string
}

interface Competitor {
  id: string
  name: string
  activityLevel: number
  latestAction: string
  actionType: string
  threatLevel: "critical" | "warning" | "normal"
  recentCount: number
  aiInsight: string
  detail: string
}

// ==================
// Mock Data
// ==================

const mockPolicies: PolicyItem[] = [
  {
    id: "p1",
    name: "算力基础设施补贴政策",
    agency: "北京科委",
    agencyType: "beijing",
    matchScore: 98,
    funding: "500-1000万",
    deadline: "2月17日",
    daysLeft: 5,
    status: "urgent",
    aiInsight: "与我院算力平台二期建设高度匹配，建议李副主任牵头、科研处配合紧急组织申报。",
    detail: "北京科委发布的「算力基础设施补贴政策」旨在支持高校和研究机构建设算力平台。我院算力平台二期建设规划与该政策高度匹配，预估可申请500-1000万资金支持。申报截止时间为下周五，需紧急组织申报材料。建议重点突出我院在大模型训练方面的算力需求和已有基础。",
  },
  {
    id: "p2",
    name: "新一代人工智能重大专项",
    agency: "科技部",
    agencyType: "national",
    matchScore: 85,
    funding: "1000-2000万",
    deadline: "2月27日",
    daysLeft: 15,
    status: "active",
    aiInsight: "我院具身智能方向可参与申报，需与王教授团队确认技术路线。",
    detail: "科技部「新一代人工智能」重大专项申报，聚焦大模型、具身智能、AI for Science三大方向。我院在大模型方向有基础，具身智能方向需加强。建议联合王教授团队以「大模型+具身智能」交叉方向申报，突出差异化优势。材料准备进度30%，需加快推进。",
  },
  {
    id: "p3",
    name: "高校AI人才培养专项基金",
    agency: "教育部",
    agencyType: "national",
    matchScore: 72,
    funding: "200-500万",
    deadline: "3月15日",
    daysLeft: 31,
    status: "tracking",
    aiInsight: "匹配度中等，可关注但无需紧急行动，适合作为人才培养方向的补充资金来源。",
    detail: "教育部面向高校AI人才培养的专项基金，支持课程建设、实验室升级和师资培训。我院在AI人才培养方面有一定基础，但该基金竞争激烈且资金规模相对较小，建议作为补充性申报项目。",
  },
  {
    id: "p4",
    name: "中关村人工智能产业扶持计划",
    agency: "海淀区政府",
    agencyType: "beijing",
    matchScore: 65,
    funding: "100-300万",
    deadline: "3月30日",
    daysLeft: 46,
    status: "tracking",
    aiInsight: "区级政策，资金规模有限但审批流程快，可与算力平台项目打包申报。",
    detail: "海淀区政府针对中关村AI企业和机构的产业扶持计划，支持算力基础设施、模型开发和应用落地。资金规模较小但审批效率高，可考虑与算力平台二期项目联合申报。",
  },
]

const mockTechTrends: TechTrend[] = [
  {
    id: "t1",
    topic: "具身智能",
    heatTrend: "surging",
    heatLabel: "+300%",
    ourStatus: "none",
    ourStatusLabel: "未布局",
    riskLevel: "high",
    keyMetric: "清华AIR发布2篇顶会论文",
    aiInsight: "该方向热度飙升且我院布局为空，存在技术路线踏空风险。建议召集技术委员会评估是否需要快速布局。",
    detail: "具身智能（Embodied AI）近期在学术界和产业界热度急剧上升，DeepSeek-V3的发布进一步推动了该领域的关注度。清华AIR已发布2篇具身智能方向的顶会论文，而我院在该方向完全没有布局，存在明显的技术空白风险。",
  },
  {
    id: "t2",
    topic: "多模态大模型",
    heatTrend: "rising",
    heatLabel: "+85%",
    ourStatus: "deployed",
    ourStatusLabel: "已布局",
    riskLevel: "low",
    keyMetric: "我院已有2个团队在研",
    aiInsight: "方向正确，需关注GPT-5等新模型发布对我院技术路线的影响。",
    detail: "多模态大模型持续升温，GPT-4o和Gemini Pro等模型推动了视觉-语言融合的发展。我院已有2个团队在多模态方向有布局，整体技术路线与行业趋势匹配。",
  },
  {
    id: "t3",
    topic: "AI Agent",
    heatTrend: "surging",
    heatLabel: "+210%",
    ourStatus: "weak",
    ourStatusLabel: "布局薄弱",
    riskLevel: "medium",
    keyMetric: "行业融资事件增加120%",
    aiInsight: "AI Agent是产业化重要方向，我院有理论基础但缺乏工程团队，建议引进相关人才。",
    detail: "AI Agent在产业界受到极大关注，相关创业公司融资事件大幅增加。我院在强化学习和决策智能方面有理论积累，但缺乏工程化能力，限制了在Agent方向的竞争力。",
  },
  {
    id: "t4",
    topic: "AI for Science",
    heatTrend: "stable",
    heatLabel: "+25%",
    ourStatus: "deployed",
    ourStatusLabel: "重点布局",
    riskLevel: "low",
    keyMetric: "Nature发表AI蛋白质预测突破",
    aiInsight: "持续稳定发展方向，我院在生物计算方向有优势，可继续深耕。",
    detail: "AI for Science作为长期战略方向持续发展，AI在蛋白质结构预测、药物发现和材料科学等领域不断取得突破。我院在生物计算和药物设计方向有较好基础，建议持续投入。",
  },
  {
    id: "t5",
    topic: "端侧AI推理",
    heatTrend: "rising",
    heatLabel: "+60%",
    ourStatus: "weak",
    ourStatusLabel: "布局薄弱",
    riskLevel: "medium",
    keyMetric: "苹果/高通发布新AI芯片",
    aiInsight: "手机端AI推理需求增长，但需要芯片合作伙伴，建议与华为昇腾团队对接。",
    detail: "端侧AI推理随着智能手机和IoT设备的AI能力提升而快速发展。苹果和高通相继发布新一代AI加速芯片，推动端侧大模型部署成为可能。我院在模型压缩方向有一定积累。",
  },
]

const mockCompetitors: Competitor[] = [
  {
    id: "c1",
    name: "清华AIR",
    activityLevel: 92,
    latestAction: "发布具身智能新成果，2篇论文入选顶会",
    actionType: "成果发布",
    threatLevel: "critical",
    recentCount: 5,
    aiInsight: "清华AIR在具身智能领域快速布局，已形成领先优势。我院需评估跟进策略。",
    detail: "清华AIR近期在具身智能方向密集发布成果，2篇论文入选ICRA 2025，同时获批国家自然科学基金重点项目。团队从5人扩展到15人，招聘力度大。需要特别关注其在机器人操作和导航方向的突破。",
  },
  {
    id: "c2",
    name: "智源研究院",
    activityLevel: 78,
    latestAction: "获批国家重大AI专项，资金过亿",
    actionType: "资金获取",
    threatLevel: "warning",
    recentCount: 3,
    aiInsight: "智源在大模型训练基础设施方面投入巨大，形成算力优势。",
    detail: "智源研究院近期获批国家级重大AI专项，资金规模超过1亿元，主要用于大模型训练基础设施建设。同时在开源大模型社区保持活跃，Aquila模型系列持续迭代。",
  },
  {
    id: "c3",
    name: "北大AI Lab",
    activityLevel: 65,
    latestAction: "NLP方向新突破，中文评测榜排名提升",
    actionType: "成果发布",
    threatLevel: "normal",
    recentCount: 2,
    aiInsight: "北大在传统NLP领域保持优势，但在新兴方向布局较少。",
    detail: "北大AI Lab继续在NLP领域深耕，近期在中文语言理解评测榜上排名提升。但在具身智能、多模态等新兴方向的布局相对保守。整体威胁程度可控。",
  },
]

// ==================
// Helper Components
// ==================

function MatchBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-500"
      : score >= 70
        ? "bg-blue-500"
        : score >= 50
          ? "bg-amber-500"
          : "bg-gray-300"
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold font-tabular", score >= 90 ? "text-green-600" : score >= 70 ? "text-blue-600" : "text-muted-foreground")}>
        {score}%
      </span>
    </div>
  )
}

function HeatIndicator({ trend }: { trend: TechTrend["heatTrend"] }) {
  const config = {
    surging: { icon: TrendingUp, color: "text-red-500", bg: "bg-red-50", label: "飙升" },
    rising: { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", label: "上升" },
    stable: { icon: Activity, color: "text-blue-500", bg: "bg-blue-50", label: "稳定" },
    declining: { icon: TrendingDown, color: "text-gray-400", bg: "bg-gray-50", label: "下降" },
  }
  const c = config[trend]
  const Icon = c.icon
  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium", c.bg, c.color)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </div>
  )
}

function ThreatBadge({ level }: { level: Competitor["threatLevel"] }) {
  const config = {
    critical: { color: "bg-red-100 text-red-700 border-red-200", label: "高威胁" },
    warning: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "需关注" },
    normal: { color: "bg-green-100 text-green-700 border-green-200", label: "可控" },
  }
  const c = config[level]
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {c.label}
    </Badge>
  )
}

function ActivityBar({ level }: { level: number }) {
  const segments = 5
  const filled = Math.round((level / 100) * segments)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-1.5 rounded-sm transition-colors",
            i < filled ? (level >= 80 ? "bg-red-400" : level >= 60 ? "bg-amber-400" : "bg-green-400") : "bg-muted"
          )}
        />
      ))}
    </div>
  )
}

// ==================
// Tab Content Components
// ==================

function PolicyTab() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null)

  const urgentCount = mockPolicies.filter((p) => p.status === "urgent").length
  const avgMatch = Math.round(mockPolicies.reduce((sum, p) => sum + p.matchScore, 0) / mockPolicies.length)

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">匹配政策</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockPolicies.length} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">平均匹配度</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={avgMatch} suffix="%" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">紧急待办</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={urgentCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 8/4 grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Policy Table */}
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">政策机会列表</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按匹配度排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                  <span>政策名称</span>
                  <span>发布机构</span>
                  <span>匹配度</span>
                  <span>资金规模</span>
                  <span>截止</span>
                  <span></span>
                </div>

                {/* Table Body */}
                <StaggerContainer>
                  {mockPolicies.map((policy) => (
                    <StaggerItem key={policy.id}>
                      <button
                        type="button"
                        className="w-full grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        {/* Name + status */}
                        <div className="flex items-center gap-2 min-w-0">
                          {policy.status === "urgent" && (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                            {policy.name}
                          </span>
                        </div>

                        {/* Agency */}
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-red-200 bg-red-50 text-red-700": policy.agencyType === "national",
                            "border-blue-200 bg-blue-50 text-blue-700": policy.agencyType === "beijing",
                            "border-gray-200 bg-gray-50 text-gray-700": policy.agencyType === "ministry",
                          })}
                        >
                          {policy.agency}
                        </Badge>

                        {/* Match Score */}
                        <MatchBar score={policy.matchScore} />

                        {/* Funding */}
                        <span className="text-xs text-foreground font-medium">{policy.funding}</span>

                        {/* Deadline */}
                        <div className="flex items-center gap-1">
                          <span className={cn("text-xs font-tabular", policy.daysLeft <= 7 ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                            {policy.daysLeft}天
                          </span>
                        </div>

                        {/* Action */}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Insight */}
        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">AI 政策解读</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                本周新增3条匹配政策，其中算力补贴政策（匹配度98%）与我院算力平台二期高度相关，建议优先关注。科技部AI专项申报材料准备进度仅30%，需加快推进。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">算力补贴政策截止5天，需立即行动</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">科技部专项需王教授确认技术路线</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">教育部基金可作为补充资金来源</span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
                onClick={() => toast.success("正在生成申报策略报告...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                生成申报策略
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Policy Detail Sheet */}
      <Sheet open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedPolicy && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selectedPolicy.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700": selectedPolicy.agencyType === "national",
                      "border-blue-200 bg-blue-50 text-blue-700": selectedPolicy.agencyType === "beijing",
                    })}
                  >
                    {selectedPolicy.agency}
                  </Badge>
                  <span>匹配度 {selectedPolicy.matchScore}%</span>
                  <span>·</span>
                  <span>资金规模 {selectedPolicy.funding}</span>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">详细分析</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPolicy.detail}</p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-700">AI 建议</span>
                  </div>
                  <p className="text-sm text-blue-700/80">{selectedPolicy.aiInsight}</p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    距截止: {selectedPolicy.daysLeft}天 ({selectedPolicy.deadline})
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => { toast.success("已分配给李副主任跟进"); setSelectedPolicy(null) }}>
                    分配负责人
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("申报材料模板已生成")}>
                    生成申报材料
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function TechTab() {
  const [selectedTech, setSelectedTech] = useState<TechTrend | null>(null)

  const highRiskCount = mockTechTrends.filter((t) => t.riskLevel === "high").length
  const surgingCount = mockTechTrends.filter((t) => t.heatTrend === "surging").length

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">追踪技术</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockTechTrends.length} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">热度飙升</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={surgingCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">风险空白</p>
              <p className="text-xl font-bold font-tabular text-amber-600">
                <MotionNumber value={highRiskCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 8/4 grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">技术趋势追踪</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按风险等级排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                  <span>技术方向</span>
                  <span>热度趋势</span>
                  <span>我院状态</span>
                  <span>风险</span>
                  <span>关键信号</span>
                  <span></span>
                </div>

                <StaggerContainer>
                  {mockTechTrends.map((tech) => (
                    <StaggerItem key={tech.id}>
                      <button
                        type="button"
                        className="w-full grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedTech(tech)}
                      >
                        <div className="flex items-center gap-2">
                          {tech.riskLevel === "high" && (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          )}
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                            {tech.topic}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <HeatIndicator trend={tech.heatTrend} />
                        </div>

                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-green-200 bg-green-50 text-green-700": tech.ourStatus === "deployed",
                            "border-amber-200 bg-amber-50 text-amber-700": tech.ourStatus === "weak",
                            "border-red-200 bg-red-50 text-red-700": tech.ourStatus === "none",
                          })}
                        >
                          {tech.ourStatusLabel}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-red-200 bg-red-50 text-red-700": tech.riskLevel === "high",
                            "border-amber-200 bg-amber-50 text-amber-700": tech.riskLevel === "medium",
                            "border-green-200 bg-green-50 text-green-700": tech.riskLevel === "low",
                          })}
                        >
                          {tech.riskLevel === "high" ? "高" : tech.riskLevel === "medium" ? "中" : "低"}
                        </Badge>

                        <span className="text-xs text-muted-foreground truncate">{tech.keyMetric}</span>

                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold">AI 技术简报</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                本周重点关注具身智能方向——清华AIR已发布2篇相关顶会论文，而我院在该方向布局为空。AI Agent方向热度飙升（+210%），我院有理论基础但缺乏工程化能力。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">具身智能方向存在技术路线踏空风险</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">AI Agent需引进工程化人才</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">多模态与AI4Science方向布局良好</span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
                onClick={() => toast.success("正在生成本周技术简报...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                生成技术简报
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Detail Sheet */}
      <Sheet open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedTech && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selectedTech.topic}
                  <HeatIndicator trend={selectedTech.heatTrend} />
                </SheetTitle>
                <SheetDescription>
                  热度变化: {selectedTech.heatLabel} · 风险等级: {selectedTech.riskLevel === "high" ? "高" : selectedTech.riskLevel === "medium" ? "中" : "低"}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">详细分析</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedTech.detail}</p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">AI 建议</span>
                  </div>
                  <p className="text-sm text-purple-700/80">{selectedTech.aiInsight}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => { toast.success("已安排技术委员会评估"); setSelectedTech(null) }}>
                    安排技术评估
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("详细技术报告已生成")}>
                    生成报告
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function CompetitorTab() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)

  const criticalCount = mockCompetitors.filter((c) => c.threatLevel === "critical").length
  const totalActions = mockCompetitors.reduce((sum, c) => sum + c.recentCount, 0)

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">追踪机构</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockCompetitors.length} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">近期动态</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={totalActions} suffix="条" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">高威胁</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={criticalCount} suffix="家" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">竞对态势总览</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按威胁等级排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <StaggerContainer className="space-y-3">
                {mockCompetitors.map((competitor) => (
                  <StaggerItem key={competitor.id}>
                    <button
                      type="button"
                      className="w-full rounded-lg border p-4 hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer text-left"
                      onClick={() => setSelectedCompetitor(competitor)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                            {competitor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                              {competitor.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <ActivityBar level={competitor.activityLevel} />
                              <span className="text-[11px] text-muted-foreground">
                                活跃度 {competitor.activityLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThreatBadge level={competitor.threatLevel} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-[52px]">
                        <Badge variant="outline" className="text-[10px]">{competitor.actionType}</Badge>
                        <span className="text-xs text-muted-foreground">{competitor.latestAction}</span>
                        <Badge variant="secondary" className="text-[10px] ml-auto">{competitor.recentCount}条动态</Badge>
                      </div>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold">AI 竞争态势分析</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                清华AIR在具身智能方向形成领先优势，需重点关注。智源在算力基础设施方面投入巨大。北大AI Lab在传统NLP领域保持稳定。建议重点关注具身智能方向的人才储备和资金争取。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">清华AIR具身智能团队扩至15人</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">智源获批资金过亿</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">北大AI Lab整体威胁可控</span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
                onClick={() => toast.success("正在生成竞争态势报告...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                生成竞争报告
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitor Detail Sheet */}
      <Sheet open={!!selectedCompetitor} onOpenChange={() => setSelectedCompetitor(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedCompetitor && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selectedCompetitor.name}
                  <ThreatBadge level={selectedCompetitor.threatLevel} />
                </SheetTitle>
                <SheetDescription>
                  活跃度: {selectedCompetitor.activityLevel}/100 · 近期动态: {selectedCompetitor.recentCount}条
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">详细分析</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedCompetitor.detail}</p>
                </div>
                <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-indigo-700">AI 建议</span>
                  </div>
                  <p className="text-sm text-indigo-700/80">{selectedCompetitor.aiInsight}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => { toast.success("已设置持续监控"); setSelectedCompetitor(null) }}>
                    设置监控
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("竞争分析报告已生成")}>
                    生成报告
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

// ==================
// Main Page
// ==================

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<"policy" | "tech" | "competitor">("policy")

  return (
    <div className="p-5 space-y-4">
      {/* AI Summary Bar */}
      <MotionCard delay={0}>
        <Card className="shadow-card border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">情报摘要：</span>
                  本周新增3条匹配政策（最高匹配度98%），具身智能方向热度飙升但我院未布局（风险预警），清华AIR发布2项新成果需关注。
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">政策 <span className="font-semibold text-foreground">3</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">风险 <span className="font-semibold text-foreground">1</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">竞对 <span className="font-semibold text-foreground">5</span></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      {/* Tabs */}
      <MotionCard delay={0.1}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "policy" | "tech" | "competitor")}
          className="space-y-4"
        >
          <div className="rounded-xl bg-muted/30 p-1">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto gap-1">
              <TabsTrigger
                value="policy"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Shield className="h-4 w-4" />
                政策红利池
              </TabsTrigger>
              <TabsTrigger
                value="tech"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Cpu className="h-4 w-4" />
                技术风向标
              </TabsTrigger>
              <TabsTrigger
                value="competitor"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Eye className="h-4 w-4" />
                竞对监测
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="policy" className="mt-4">
            <PolicyTab />
          </TabsContent>

          <TabsContent value="tech" className="mt-4">
            <TechTab />
          </TabsContent>

          <TabsContent value="competitor" className="mt-4">
            <CompetitorTab />
          </TabsContent>
        </Tabs>
      </MotionCard>
    </div>
  )
}
