import type { PriorityItemWithScore } from "@/lib/priority-scoring";
import type { DailySummaryData } from "@/components/home/ai-daily-summary";
import type { MetricCardData } from "@/components/home/aggregated-metric-cards";
import type { AgendaItem } from "@/components/home/today-agenda";

export const rawAlerts: PriorityItemWithScore[] = [
  {
    id: "1",
    title: "舆情激增：负面占比15% (↑5%)",
    description:
      "小红书和知乎上出现关于实验室管理的负面评论，需要及时处理以避免扩散",
    category: "risk",
    riskLevel: 3,
    timeUrgency: 3,
    impact: 2,
    requiresDeanDecision: true,
    actionType: "decide",
    responsiblePerson: "张主任（公关部）",
    metadata: "负面占比15% (↑5%)",
    priorityScore: 90,
  },
  {
    id: "2",
    title: "申报倒计时：距科技部AI专项截止仅剩3天",
    description:
      '科技部"新一代人工智能"重大专项申报截止时间临近，材料准备进度30%',
    category: "deadline",
    riskLevel: 2,
    timeUrgency: 3,
    impact: 3,
    requiresDeanDecision: true,
    actionType: "supervise",
    responsiblePerson: "王教授（科研处）",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    metadata: "准备进度：30% | 距截止：3天",
    priorityScore: 85,
  },
  {
    id: "3",
    title: "政策匹配度98%：北京算力补贴政策发布",
    description:
      "北京科委发布算力补贴政策，预估资金规模500-1000万，与我院算力平台二期高度匹配",
    category: "opportunity",
    riskLevel: 1,
    timeUrgency: 2,
    impact: 3,
    requiresDeanDecision: true,
    actionType: "review",
    responsiblePerson: "李副主任",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    metadata: "匹配度：98/100 | 资金规模：500-1000万 | 剩余5天",
    priorityScore: 80,
  },
  {
    id: "4",
    title: "预算执行滞后：Q1执行率仅12% (红线25%)",
    description: "一季度预算执行严重滞后，多个项目采购流程卡住，需要紧急协调",
    category: "finance",
    riskLevel: 2,
    timeUrgency: 2,
    impact: 2,
    requiresDeanDecision: true,
    actionType: "supervise",
    responsiblePerson: "财务处长",
    metadata: "执行率：12% | 目标：25% | 差距：-13%",
    priorityScore: 75,
  },
  {
    id: "5",
    title: "大模型基座项目延期15天",
    description:
      '重点项目"大模型基座"采购审批停滞于李某某处，已延期15天影响整体进度',
    category: "supervision",
    riskLevel: 2,
    timeUrgency: 2,
    impact: 2,
    requiresDeanDecision: false,
    actionType: "contact",
    responsiblePerson: "李某某（采购处）",
    metadata: "延期：15天 | 卡点：采购审批",
    priorityScore: 70,
  },
];

export const mockDailySummary: DailySummaryData = {
  generatedAt: new Date(),
  paragraphs: [
    [
      "院长，今日有3件事项需要您优先关注。",
      {
        text: "北京科委发布算力补贴政策",
        moduleId: "policy-intel",
        action: "查看政策",
      },
      "（匹配度98%，资金规模500-1000万），与我院算力平台二期高度匹配，建议李副主任牵头紧急组织申报。同时，",
      {
        text: "科技部AI专项申报截止仅剩3天",
        moduleId: "policy-intel",
        action: "督办进度",
      },
      "，材料准备进度仅30%，需督促王教授加快进度。",
    ],
    [
      "内部管理方面，",
      {
        text: "大模型基座项目采购审批延期15天",
        moduleId: "internal-mgmt",
        action: "查看详情",
      },
      "，卡在李某某（采购处）处，建议直接联系推动。另外Q1预算执行率仅12%（红线25%），多个项目采购流程受阻。",
    ],
    [
      "外部动态方面，",
      {
        text: "清华AIR发布2项具身智能新成果",
        moduleId: "university-eco",
        action: "查看前沿",
      },
      "，建议关注竞争态势并评估我院在该方向的布局。此外，",
      {
        text: "教育部副部长近日发表研究生教育改革讲话",
        moduleId: "talent-radar",
      },
      "，交叉学科招生名额将扩大、博士生淘汰机制趋严，对我院研究生培养有直接影响。",
    ],
  ],
};

export const mockMetricCards: MetricCardData[] = [
  {
    id: "policy-intel",
    title: "政策情报",
    icon: "policy",
    metrics: [
      { label: "新政策", value: "3条", variant: "success" },
      { label: "高匹配", value: "2条", variant: "warning" },
      { label: "待申报", value: "1项" },
    ],
  },
  {
    id: "tech-frontier",
    title: "科技前沿",
    icon: "tech",
    metrics: [
      { label: "技术突破", value: "2项", variant: "success" },
      { label: "行业动态", value: "5条" },
      { label: "热点KOL", value: "3位" },
    ],
  },
  {
    id: "talent-radar",
    title: "人事动态",
    icon: "talent",
    metrics: [
      { label: "今日要闻", value: "3条", variant: "success" },
      { label: "本周更新", value: "8条" },
      { label: "重要事项", value: "2条" },
    ],
  },
  {
    id: "university-eco",
    title: "高校生态",
    icon: "university",
    metrics: [
      { label: "同行动态", value: "5条" },
      { label: "新成果", value: "3项", variant: "success" },
      { label: "人事变动", value: "2条", variant: "warning" },
    ],
  },
  {
    id: "internal-mgmt",
    title: "院内管理",
    icon: "building",
    metrics: [
      { label: "异常事项", value: "2项", variant: "warning" },
      { label: "预算执行", value: "42%", variant: "danger" },
      { label: "重点项目", value: "8个" },
    ],
  },
  {
    id: "network",
    title: "人脉网络",
    icon: "users",
    metrics: [
      { label: "待恭喜", value: "5人", variant: "warning" },
      { label: "新变动", value: "3条" },
      { label: "半年未联系", value: "2人" },
    ],
  },
  {
    id: "smart-schedule",
    title: "智能日程",
    icon: "calendar",
    metrics: [
      { label: "今日ROI", value: "85", variant: "success" },
      { label: "日程冲突", value: "1个", variant: "warning" },
      { label: "待准备", value: "2个" },
    ],
  },
];

export const mockAgendaItems: AgendaItem[] = [
  // Scheduled events (sorted by time)
  {
    id: "evt-1",
    time: "09:00",
    title: "Q3战略技术审查会",
    type: "meeting",
    status: "ready",
    metadata: "ROI: 85 | 参会：市领导、技术委员会",
    actionLabel: "查看简报",
  },
  {
    id: "evt-2",
    time: "14:00",
    title: "人才引进委员会",
    type: "meeting",
    status: "conflict",
    metadata: "与「部委电话会议」时间冲突",
    actionLabel: "处理冲突",
  },
  {
    id: "evt-3",
    time: "18:00",
    title: "审查伦理委员会报告",
    type: "deadline",
    status: "upcoming",
    metadata: "截止今天18:00",
    actionLabel: "开始审阅",
  },
  // Unscheduled pending tasks (no time)
  {
    id: "qa-1",
    title: "审批：量子计算中心设备采购",
    type: "approve",
    status: "urgent",
    source: "财务处",
    actionLabel: "去审批",
  },
  {
    id: "qa-2",
    title: "回复：教育部座谈会邀请函",
    type: "reply",
    status: "urgent",
    source: "办公室",
    actionLabel: "去回复",
  },
  {
    id: "qa-3",
    title: "审阅：Q1预算执行情况报告",
    type: "review",
    source: "财务处",
    actionLabel: "去审阅",
  },
  {
    id: "qa-4",
    title: "确认：张明远博士面谈时间",
    type: "reply",
    source: "人事处",
    actionLabel: "去确认",
  },
];
