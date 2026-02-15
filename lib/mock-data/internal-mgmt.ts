import type {
  CenterEvent,
  CenterBrief,
  ProjectBrief,
  TimelineProject,
  Milestone,
  StudentPaper,
  EnrollmentData,
  StudentAlert,
  SocialMediaItem,
} from "@/lib/types/internal-mgmt";

// ── 中心动态：事件 Feed ──

export const mockCenterEvents: CenterEvent[] = [
  {
    id: "e1",
    type: "risk",
    typeLabel: "风险预警",
    title: "量子计算中心预算紧张",
    summary: "低温设备维修追加150万，年度预算消耗加速，正与校财务处协商紧急拨款",
    center: "量子计算中心",
    time: "今天",
    source: "财务系统",
  },
  {
    id: "e2",
    type: "achievement",
    typeLabel: "重大成果",
    title: "Nature Materials 论文投稿",
    summary: "先进材料研究院1篇论文已提交Nature Materials同行评审，研究方向为新型二维材料",
    center: "先进材料研究院",
    time: "昨天",
    source: "学院官网",
  },
  {
    id: "e3",
    type: "personnel",
    typeLabel: "人事变动",
    title: "新引进海外人才到岗",
    summary: "张博士（MIT，计算机视觉方向）正式入职AI & 机器人实验室，签约奖金50万已支出",
    center: "AI & 机器人实验室",
    time: "本周",
    source: "人事系统",
  },
  {
    id: "e4",
    type: "key-number",
    typeLabel: "关键数字",
    title: "国家级项目配套资金到账",
    summary: "新增2个国家级项目配套资金共350万已到账，相关课题组正准备启动",
    center: "科研项目管理办公室",
    time: "本周",
    source: "财务系统",
  },
  {
    id: "e5",
    type: "risk",
    typeLabel: "风险预警",
    title: "3个大额采购审批停滞",
    summary: "先进材料研究院精密仪器、高纯试剂、测试设备采购（合计450万）在采购处停滞超1个月",
    center: "先进材料研究院",
    time: "持续中",
    source: "OA系统",
  },
  {
    id: "e6",
    type: "milestone",
    typeLabel: "里程碑",
    title: "院级种子基金评审完成",
    summary: "第二批种子基金评审完成，拟资助6个青年教师项目（总额180万），待院长终审",
    center: "科研项目管理办公室",
    time: "本周",
    source: "钉钉",
  },
];

// ── 中心动态：中心概览 ──

export const mockCenters: CenterBrief[] = [
  {
    id: "c1",
    name: "AI & 机器人实验室",
    leader: "张教授",
    statusTag: "运营正常",
    statusType: "normal",
    keyUpdates: [
      "实验室改造工程预计下月竣工",
      "Q2 GPU集群采购需提前走校级审批",
      "新引进海外人才已到岗",
    ],
    detail: "AI & 机器人实验室当前运营平稳。实验室改造工程进展顺利。Q2计划的A100 GPU集群采购预算约800万，需要走校级审批流程。近期引进1名海外人才（计算机视觉方向）。",
  },
  {
    id: "c2",
    name: "量子计算中心",
    leader: "王教授",
    statusTag: "预算紧张",
    statusType: "risk",
    keyUpdates: [
      "低温设备频繁故障，维修费用追加150万",
      "正与校财务处协商紧急拨款",
      "量子芯片Alpha项目因供应链问题延期",
    ],
    detail: "量子计算中心运营压力较大。低温设备（稀释制冷机）频繁故障，已追加维修费用150万。目前正与校财务处协商紧急拨款。量子芯片Alpha项目因供应链中断延期。",
  },
  {
    id: "c3",
    name: "先进材料研究院",
    leader: "赵教授",
    statusTag: "采购受阻",
    statusType: "warning",
    keyUpdates: [
      "3个大额采购审批停滞超1个月",
      "新实验平台方案已通过学术委员会评审",
      "Nature Materials论文已投稿",
    ],
    detail: "先进材料研究院主要瓶颈在采购审批——3个大额项目（合计450万）在采购处停滞。新实验平台方案已通过学术委员会评审。科研产出方面，1篇Nature Materials论文已进入同行评审。",
  },
  {
    id: "c4",
    name: "科研项目管理办公室",
    leader: "李主任",
    statusTag: "运营良好",
    statusType: "normal",
    keyUpdates: [
      "国家级项目配套资金350万已到账",
      "种子基金第二批评审完成，待院长终审",
      "本季度3个结题项目均已通过验收",
    ],
    detail: "科研项目管理办公室运转顺畅。2个国家级项目配套资金350万已到账。院级种子基金第二批评审完成，拟资助6个青年教师项目（总额180万），待院长终审。",
  },
  {
    id: "c5",
    name: "行政与人事",
    leader: "陈主任",
    statusTag: "正常",
    statusType: "normal",
    keyUpdates: [
      "本月引进1名海外人才，签约奖金已支出",
      "下半年人才引进资金压力需提前规划",
      "行政人员年度考核已完成",
    ],
    detail: "行政与人事运行平稳。本月引进1名海外人才（张博士，MIT），签约奖金50万已支付。下半年还有3-4个引才目标，预计签约成本200-300万，需关注资金安排。",
  },
];

// ── 项目督办：甘特图 ──

export const timelineProjects: TimelineProject[] = [
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
];

// ── 项目督办：项目列表 ──

export const mockProjects: ProjectBrief[] = [
  {
    id: "p1",
    name: "量子计算中心二期",
    owner: "王教授",
    department: "量子研究所",
    currentStatus: "供应链中断导致关键设备延迟到货，预算消耗已超预期",
    latestUpdate: "正与供应商协商替代方案，预计延期2-3个月",
    status: "risk",
    statusLabel: "风险",
    detail: "量子计算中心二期项目因核心设备供应商产能问题，关键低温设备交付延迟。同时现有设备维修费用大幅超出预算。项目团队正在评估替代供应商方案。",
    aiInsight: "建议双管齐下：推动校级紧急资金支持，同时授权项目团队启动备用供应商评估。",
  },
  {
    id: "p2",
    name: "AI & 机器人实验室扩建",
    owner: "李主任",
    department: "科研中心",
    currentStatus: "实验室改造工程顺利推进，Q2设备采购需提前安排审批",
    latestUpdate: "改造工程预计下月竣工，GPU采购申请已提交",
    status: "in-progress",
    statusLabel: "进行中",
    detail: "AI & 机器人实验室扩建项目整体进展顺利。Q2的核心任务是A100 GPU集群采购（预算约800万），采购申请已提交，需要走校级审批流程。",
    aiInsight: "GPU采购的校级审批通常需要4-6周，建议院长关注审批进度，必要时直接协调。",
  },
  {
    id: "p3",
    name: "生物医学工程平台",
    owner: "赵博士",
    department: "生物医学中心",
    currentStatus: "已完成验收，平台已投入运营",
    latestUpdate: "验收报告已提交，平台已开放预约使用",
    status: "completed",
    statusLabel: "已完成",
    detail: "生物医学工程平台项目已顺利完成全部建设任务并通过验收。平台已正式投入运营，目前已有3个课题组开始使用。",
    aiInsight: "项目圆满完成，可作为院内项目管理的优秀案例。",
  },
];

export const mockMilestones: Milestone[] = [
  { date: "3月15日", description: "量子芯片替代供应商评估截止", projectName: "量子计算中心二期" },
  { date: "3月底", description: "实验室改造工程竣工验收", projectName: "AI & 机器人实验室扩建" },
  { date: "4月1日", description: "GPU集群采购校级审批节点", projectName: "AI & 机器人实验室扩建" },
  { date: "5月中旬", description: "院级种子基金项目启动", projectName: "科研项目管理" },
];

// ── 学生管理：论文成果 ──

export const mockStudentPapers: StudentPaper[] = [
  {
    id: "sp1",
    title: "Efficient Multi-Modal Learning via Adaptive Token Routing",
    student: "刘明哲",
    grade: "2022级博士",
    advisor: "张教授",
    venue: "NeurIPS 2025",
    date: "2025-01-15",
    credited: true,
    source: "arxiv",
  },
  {
    id: "sp2",
    title: "Quantum Error Correction with Topological Codes",
    student: "陈宇航",
    grade: "2023级博士",
    advisor: "王教授",
    venue: "Physical Review Letters",
    date: "2025-01-10",
    credited: true,
    source: "arxiv",
  },
  {
    id: "sp3",
    title: "LLM-based Autonomous Agent for Scientific Discovery",
    student: "周小凡",
    grade: "2023级硕士",
    advisor: "李教授",
    venue: "ICML 2025",
    date: "2025-01-08",
    credited: false,
    source: "arxiv",
  },
  {
    id: "sp4",
    title: "Graph Neural Networks for Molecular Property Prediction",
    student: "吴思远",
    grade: "2022级博士",
    advisor: "赵教授",
    venue: "Nature Machine Intelligence",
    date: "2024-12-20",
    credited: false,
    source: "学院官网",
  },
  {
    id: "sp5",
    title: "Robust Visual SLAM in Dynamic Environments",
    student: "杨若彤",
    grade: "2024级硕士",
    advisor: "张教授",
    venue: "CVPR 2025",
    date: "2024-12-15",
    credited: true,
    source: "arxiv",
  },
];

// ── 学生管理：招生数据 ──

export const mockEnrollment: EnrollmentData[] = [
  { category: "博士在读", count: 62, change: "+5 vs 去年", changeType: "up" },
  { category: "硕士在读", count: 124, change: "+12 vs 去年", changeType: "up" },
  { category: "今年推免录取", count: 38, change: "+3 vs 去年", changeType: "up" },
  { category: "今年统考录取", count: 26, change: "-2 vs 去年", changeType: "down" },
];

// ── 学生管理：预警 ──

export const mockStudentAlerts: StudentAlert[] = [
  {
    id: "s1",
    name: "张明远",
    grade: "2023级硕士",
    major: "计算机科学与技术",
    type: "心理预警",
    level: "紧急",
    summary: "连续两周未参加组会，导师反馈情绪异常低落",
    detail: "该生近期表现明显异常：连续两周未参加课题组组会，导师李教授反馈其近一个月情绪持续低落，与同学交流减少。",
    aiRecommendation: "建议立即启动心理危机干预流程：辅导员24小时内面谈，协调心理咨询中心评估，通知导师减轻科研压力。",
  },
  {
    id: "s2",
    name: "李思雨",
    grade: "2022级博士",
    major: "人工智能",
    type: "学业预警",
    level: "关注",
    summary: "博士中期考核未通过，论文进展严重滞后",
    detail: "该生博士中期考核未通过，论文实验数据不足，研究方向与导师存在分歧。已延期1学期。",
    aiRecommendation: "建议协调研究生院延长补考时间，安排副导师辅导，组织导师与学生深度沟通。",
  },
  {
    id: "s3",
    name: "赵鹏飞",
    grade: "2022级硕士",
    major: "智能制造",
    type: "经济困难",
    level: "提醒",
    summary: "家庭突发变故，申请困难补助",
    detail: "该生家庭遭遇自然灾害，父亲因伤住院，经济状况恶化。已提交困难补助申请。成绩优秀（GPA 3.7）。",
    aiRecommendation: "建议加急审批困难补助，协调勤工助学岗位，推荐校友基金会专项救助。",
  },
];

// ── 社媒动态 ──

export const mockSocialMedia: SocialMediaItem[] = [
  {
    id: "sm1",
    platform: "微博",
    platformIcon: "微",
    iconColor: "bg-red-100",
    time: "2小时前",
    content: "学生们正在讨论新宿舍的WiFi限制问题，该话题在本地圈子中有一定热度。",
    risk: false,
  },
  {
    id: "sm2",
    platform: "知乎",
    platformIcon: "知",
    iconColor: "bg-green-100",
    time: "5小时前",
    content: "我院AI实验室论文被Nature子刊收录，知乎学术圈正面评价居多，有助于提升学院知名度。",
    risk: false,
  },
  {
    id: "sm3",
    platform: "小红书",
    platformIcon: "小",
    iconColor: "bg-red-200",
    time: "昨天",
    content: "有学生在小红书吐槽食堂涨价问题，帖子获得120+点赞，评论区有其他高校学生参与讨论，建议关注舆论走向。",
    risk: true,
  },
];
