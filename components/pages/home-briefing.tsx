"use client"

import SafetyIndexGauge, { type SafetyIndexData } from "@/components/home/safety-index-gauge"
import MustKnowAlerts from "@/components/home/must-know-alerts"
import AIDailySummary, { type DailySummaryData } from "@/components/home/ai-daily-summary"
import AggregatedMetricCards, { type MetricCardData } from "@/components/home/aggregated-metric-cards"
import TimelineView, { type TimelineEvent } from "@/components/home/timeline-view"
import { type PriorityItemWithScore, filterForHomePage } from "@/lib/priority-scoring"
import { MotionCard } from "@/components/motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingDown } from "lucide-react"
import { toast } from "sonner"

// Mock - Safety Index
const mockSafetyIndex: SafetyIndexData = {
  overallScore: 76,
  trend: 'down',
  lastUpdated: new Date(),
  deductions: [
    {
      category: '舆情负面',
      points: -5,
      description: '小红书出现1条负面评论，已联系公关处理',
      responsiblePerson: '张主任',
    },
    {
      category: '项目延期',
      points: -10,
      description: '大模型基座项目延期15天，卡在采购审批环节',
      responsiblePerson: '李某某',
    },
    {
      category: '预算超支',
      points: -8,
      description: 'Q1预算执行偏离计划，执行率仅12%（红线25%）',
      responsiblePerson: '财务处',
    },
    {
      category: '学生心理',
      points: -1,
      description: '2名学生出现心理预警信号，需要关注',
      responsiblePerson: '学工处',
    },
  ],
}

// Mock - Must-Know Alerts
const rawAlerts: PriorityItemWithScore[] = [
  {
    id: '1',
    title: '舆情激增：负面占比15% (↑5%)',
    description: '小红书和知乎上出现关于实验室管理的负面评论，需要及时处理以避免扩散',
    category: 'risk',
    riskLevel: 3,
    timeUrgency: 3,
    impact: 2,
    requiresDeanDecision: true,
    actionType: 'decide',
    responsiblePerson: '张主任（公关部）',
    metadata: '负面占比15% (↑5%)',
    priorityScore: 90,
  },
  {
    id: '2',
    title: '申报倒计时：距科技部AI专项截止仅剩3天',
    description: '科技部"新一代人工智能"重大专项申报截止时间临近，材料准备进度30%',
    category: 'deadline',
    riskLevel: 2,
    timeUrgency: 3,
    impact: 3,
    requiresDeanDecision: true,
    actionType: 'supervise',
    responsiblePerson: '王教授（科研处）',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    metadata: '准备进度：30% | 距截止：3天',
    priorityScore: 85,
  },
  {
    id: '3',
    title: '政策匹配度98%：北京算力补贴政策发布',
    description: '北京科委发布算力补贴政策，预估资金规模500-1000万，与我院算力平台二期高度匹配',
    category: 'opportunity',
    riskLevel: 1,
    timeUrgency: 2,
    impact: 3,
    requiresDeanDecision: true,
    actionType: 'review',
    responsiblePerson: '李副主任',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    metadata: '匹配度：98/100 | 资金规模：500-1000万 | 剩余5天',
    priorityScore: 80,
  },
  {
    id: '4',
    title: '预算执行滞后：Q1执行率仅12% (红线25%)',
    description: '一季度预算执行严重滞后，多个项目采购流程卡住，需要紧急协调',
    category: 'finance',
    riskLevel: 2,
    timeUrgency: 2,
    impact: 2,
    requiresDeanDecision: true,
    actionType: 'supervise',
    responsiblePerson: '财务处长',
    metadata: '执行率：12% | 目标：25% | 差距：-13%',
    priorityScore: 75,
  },
  {
    id: '5',
    title: '大模型基座项目延期15天',
    description: '重点项目"大模型基座"采购审批停滞于李某某处，已延期15天影响整体进度',
    category: 'supervision',
    riskLevel: 2,
    timeUrgency: 2,
    impact: 2,
    requiresDeanDecision: false,
    actionType: 'contact',
    responsiblePerson: '李某某（采购处）',
    metadata: '延期：15天 | 卡点：采购审批',
    priorityScore: 70,
  },
]

const mockAlerts = filterForHomePage(rawAlerts)

// Mock - AI Daily Summary
const mockDailySummary: DailySummaryData = {
  summary:
    '今日重点关注北京科委发布的算力补贴政策（关联度High，建议李副主任牵头申报）；内部需督办大模型基座项目的采购进度（延期15天，卡在李某某处）；清华AIR发布2项新成果（具身智能方向），建议关注竞争态势并评估我院布局。',
  fullReport: `## 详细分析

**政策机遇**
北京科委本周发布的"算力基础设施补贴政策"与我院算力平台二期建设高度匹配（匹配度98/100）。政策预算规模在500-1000万，申报截止时间为下周五。建议由李副主任牵头，科研处配合，紧急组织申报材料。

**内部管理**
大模型基座项目是院级重点项目，但目前采购审批环节已停滞15天。问题卡在采购处李某某处，建议院长直接施压或授权副手处理，否则将影响整个Q2的研发计划。

**外部竞争**
清华AIR本周发布两篇具身智能顶会论文，引发学术界关注。我院在该方向布局为空，存在技术路线踏空风险。建议召集技术委员会评估是否需要快速布局。

**舆情预警**
小红书和知乎上出现关于实验室管理的负面评论，虽然数量不多但需要及时处理，避免在招生季扩散影响。`,
  overdueItems: 3,
  riskLevel: 'high',
  generatedAt: new Date(),
}

// Mock - Metric Cards
const mockMetricCards: MetricCardData[] = [
  {
    id: 'radar',
    title: '战略雷达',
    icon: 'radar',
    metrics: [
      { label: '新政策', value: '3条', variant: 'success' },
      { label: '技术突破', value: '2项' },
      { label: '竞对动态', value: '5条' },
    ],
  },
  {
    id: 'internal',
    title: '院内事务',
    icon: 'building',
    metrics: [
      { label: '异常事项', value: '2项', variant: 'warning' },
      { label: '预算执行', value: '42%', variant: 'danger' },
      { label: '重点项目', value: '8个' },
    ],
  },
  {
    id: 'network',
    title: '政策与人脉',
    icon: 'users',
    metrics: [
      { label: '待恭喜', value: '5人', variant: 'warning' },
      { label: '高意向人才', value: '3人', variant: 'success' },
      { label: '半年未联系', value: '2人' },
    ],
  },
  {
    id: 'schedule',
    title: '日程价值',
    icon: 'calendar',
    metrics: [
      { label: '今日ROI', value: '85', variant: 'success' },
      { label: '日程冲突', value: '1个', variant: 'warning' },
      { label: '待准备', value: '2个' },
    ],
  },
]

// Mock - Timeline Events
const mockTodayEvents: TimelineEvent[] = [
  {
    id: '1',
    time: '09:00',
    title: 'Q3战略技术审查会',
    type: 'meeting',
    status: 'ready',
    metadata: 'ROI: 85 | 参会：市领导、技术委员会',
    actionLabel: '查看简报',
  },
  {
    id: '2',
    time: '14:00',
    title: '人才引进委员会',
    type: 'meeting',
    status: 'conflict',
    metadata: '与"部委电话会议"时间冲突',
    actionLabel: '处理冲突',
  },
  {
    id: '3',
    time: '18:00',
    title: '审查伦理委员会报告',
    type: 'task',
    status: 'upcoming',
    metadata: '截止今天18:00',
    actionLabel: '开始审阅',
  },
]

const mockWeekEvents: TimelineEvent[] = [
  {
    id: '4',
    time: '明天 10:00',
    title: '科技部AI专项申报截止',
    type: 'deadline',
    status: 'incomplete',
    metadata: '准备度: 30% | 负责人: 王教授',
    actionLabel: '督办进度',
  },
  {
    id: '5',
    time: '周三 09:00',
    title: '中关村管委会调研',
    type: 'meeting',
    status: 'upcoming',
    metadata: 'ROI: 92 | 重点汇报算力平台进展',
    actionLabel: '查看材料',
  },
  {
    id: '6',
    time: '周五 14:00',
    title: '学术委员会季度会议',
    type: 'meeting',
    status: 'upcoming',
    metadata: '审议3个重大项目立项',
  },
]

const mockLongTermEvents: TimelineEvent[] = [
  {
    id: '7',
    time: '3月25日',
    title: '北京市科技创新大会',
    type: 'meeting',
    status: 'upcoming',
    metadata: 'ROI: 95 | 同框：市长、科委主任',
    actionLabel: '确认出席',
  },
  {
    id: '8',
    time: '4月10日',
    title: 'Q2重点项目中期评审',
    type: 'task',
    status: 'upcoming',
    metadata: '涉及8个项目，需提前准备评审材料',
  },
]

export default function HomeBriefingPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const handleSafetyIndexClick = () => {
    toast("安全指数详情", { description: "当前评分76/100，较昨日下降3分" })
  }

  const handleAlertClick = (alertId: string) => {
    toast("查看详情", { description: "已打开提醒 #" + alertId })
  }

  const handleActionClick = (alertId: string, actionType: string) => {
    toast.success("操作已执行: " + actionType)
  }

  const handleMetricCardClick = (cardId: string) => {
    if (cardId === "radar") toast("正在跳转到战略雷达...")
    else if (cardId === "internal") toast("正在跳转到院内事务...")
    else if (cardId === "network") toast("正在跳转到政策与人脉...")
    else if (cardId === "schedule") toast("正在跳转到智能日程...")
    else toast("正在跳转到详情页...")
  }

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 70) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="p-5 space-y-4">
      {/* Compact Header Row */}
      <MotionCard delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">
              早安，院长
            </h2>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </span>
            <Separator orientation="vertical" className="h-5" />
            <Badge
              variant="outline"
              className={`px-2.5 py-0.5 gap-1.5 font-tabular ${getScoreBadgeStyle(mockSafetyIndex.overallScore)}`}
            >
              <span className="text-sm font-bold">{mockSafetyIndex.overallScore}</span>
              <span className="text-[10px]">/100</span>
              <TrendingDown className="h-3 w-3" />
            </Badge>
          </div>
        </div>
      </MotionCard>

      {/* Main 2-column layout: Alerts (8) + AI Summary & Safety (4) */}
      <div className="grid grid-cols-12 gap-4">
        <MotionCard delay={0.1} className="col-span-8">
          <MustKnowAlerts
            alerts={mockAlerts}
            onAlertClick={handleAlertClick}
            onActionClick={handleActionClick}
          />
        </MotionCard>

        <div className="col-span-4 space-y-4">
          <MotionCard delay={0.15}>
            <AIDailySummary data={mockDailySummary} />
          </MotionCard>

          <MotionCard delay={0.2}>
            <SafetyIndexGauge data={mockSafetyIndex} onViewDetails={handleSafetyIndexClick} />
          </MotionCard>
        </div>
      </div>

      {/* Timeline View */}
      <MotionCard delay={0.25}>
        <TimelineView
          todayEvents={mockTodayEvents}
          weekEvents={mockWeekEvents}
          longTermEvents={mockLongTermEvents}
          onNavigateToSchedule={() => onNavigate?.("schedule")}
        />
      </MotionCard>

      {/* Aggregated Metric Cards - Navigator */}
      <MotionCard delay={0.3}>
        <AggregatedMetricCards cards={mockMetricCards} onCardClick={handleMetricCardClick} />
      </MotionCard>
    </div>
  )
}
