import type {
  ScheduleConflict,
  Invitation,
  RecommendedActivity,
} from "@/lib/types/smart-schedule";

export const mockScheduleConflicts: ScheduleConflict[] = [
  {
    id: "c1",
    eventA: "教育部AI教育大会",
    eventB: "IEEE智能系统研讨会",
    time: "2025-05-20 ~ 05-21",
    conflictType: "时间重叠",
    conflictTypeIcon: "clock",
    severity: "high",
    aiSuggestion: "参加教育部大会（ROI 92），委派副院长参加IEEE会议",
    detail:
      "两场会议时间完全重叠。教育部AI教育大会为部级主办（ROI 92分），IEEE智能系统研讨会为国际顶级学术会议（ROI 85分）。两场活动均为高价值活动，但无法同时出席。",
    resolutionOptions: [
      {
        label: "方案A：院长参加教育部大会",
        description:
          "院长亲自参加教育部AI教育大会，委派张副院长和2名青年教师参加IEEE研讨会。教育部大会涉及政策资源分配，院长亲自出席更为关键。",
        confidence: 92,
        recommended: true,
      },
      {
        label: "方案B：院长参加IEEE研讨会",
        description:
          "院长参加IEEE国际研讨会以拓展学术影响力，委派李副院长参加教育部大会。适合学院当前更需要国际学术突破的情况。",
        confidence: 68,
        recommended: false,
      },
      {
        label: "方案C：协调教育部大会日程",
        description:
          "联系教育部大会组委会，申请将院长发言安排在第一天上午，下午乘高铁转场IEEE研讨会。风险：行程紧凑，可能影响深度交流。",
        confidence: 45,
        recommended: false,
      },
    ],
  },
  {
    id: "c2",
    eventA: "上午：博士答辩（3场）",
    eventB: "下午：省厅来访接待",
    time: "2025-04-22",
    conflictType: "精力冲突",
    conflictTypeIcon: "brain",
    severity: "medium",
    aiSuggestion: "博士答辩后安排30分钟休息缓冲，调整省厅接待至15:00",
    detail:
      "上午连续3场博士答辩（8:30-12:00），下午13:30省科技厅领导来访接待。3场答辩消耗精力较大，直接衔接重要接待可能影响状态和决策质量。",
    resolutionOptions: [
      {
        label: "方案A：调整省厅接待时间",
        description:
          "与省科技厅沟通，将接待时间推迟至15:00。中午安排简短午休和准备时间。已确认省厅方面可接受15:00-17:00时段。",
        confidence: 88,
        recommended: true,
      },
      {
        label: "方案B：压缩答辩时间",
        description:
          "将3场答辩压缩为每场40分钟（原60分钟），11:00前结束所有答辩，留出2.5小时缓冲。但可能影响答辩质量。",
        confidence: 55,
        recommended: false,
      },
      {
        label: "方案C：分派答辩主席",
        description:
          "院长仅主持第1场答辩，第2、3场委托学科带头人主持。院长腾出时间为省厅接待做充分准备。",
        confidence: 72,
        recommended: false,
      },
    ],
  },
  {
    id: "c3",
    eventA: "WAIC 2025（上海）",
    eventB: "深圳市政府座谈会",
    time: "2025-07-04 ~ 07-05",
    conflictType: "出行冲突",
    conflictTypeIcon: "plane",
    severity: "high",
    aiSuggestion: "WAIC第一天参加主论坛，第二天早班飞深圳参加座谈会",
    detail:
      "WAIC 2025在上海举办（7月3-5日），深圳市政府座谈会安排在7月5日上午。两地之间需要飞行2小时。WAIC的核心议程集中在前两天，第三天为闭幕和Workshop。",
    resolutionOptions: [
      {
        label: "方案A：WAIC前两天+第三天飞深圳",
        description:
          "院长参加WAIC 7月3日-4日核心议程（主论坛+专题论坛），7月5日早班飞机赴深圳参加下午的座谈会。已查询：7月5日07:20上海-深圳航班，09:40到达。",
        confidence: 90,
        recommended: true,
      },
      {
        label: "方案B：协调深圳座谈改期",
        description:
          "联系深圳市政府办公室，申请将座谈会推迟至7月7日。需确认深圳方面的日程灵活度。",
        confidence: 65,
        recommended: false,
      },
      {
        label: "方案C：委派出席深圳座谈",
        description:
          "委派分管产学研的副院长代为参加深圳座谈会。但深圳市政府明确邀请院长本人，委派出席可能影响合作诚意。",
        confidence: 40,
        recommended: false,
      },
    ],
  },
  {
    id: "c4",
    eventA: "学院教职工大会",
    eventB: "校长办公会汇报",
    time: "2025-04-28 14:00-16:00",
    conflictType: "时间重叠",
    conflictTypeIcon: "clock",
    severity: "medium",
    aiSuggestion: "教职工大会改至上午，校长办公会汇报按原计划进行",
    detail:
      "学院教职工大会原定14:00-16:00，与校长办公会院长汇报环节（14:30-15:00）时间重叠。校长办公会为校级会议，时间不可调整。教职工大会为院级会议，时间相对灵活。",
    resolutionOptions: [
      {
        label: "方案A：教职工大会改至上午",
        description:
          "将教职工大会调整至当天上午9:00-11:00。已确认大会议室上午时段可用，通知全院教职工变更时间。校长办公会按原计划参加。",
        confidence: 95,
        recommended: true,
      },
      {
        label: "方案B：教职工大会延期",
        description:
          "教职工大会推迟一周（5月6日14:00）。但可能影响学期工作部署节奏。",
        confidence: 60,
        recommended: false,
      },
    ],
  },
];

export const mockInvitations: Invitation[] = [
  {
    id: "inv1",
    eventName: "全国人工智能教育大会",
    host: "教育部高教司",
    date: "2025-04-18",
    location: "北京·国家会议中心",
    roiScore: 92,
    aiSuggestion: "参加",
    guestHighlights: "教育部副部长、清华/北大/浙大AI学院院长",
    hostAnalysis:
      "教育部高教司为主管单位，规格极高。历年参会院长平均获得1.5个合作机会。去年参会院校中85%在后续获得政策资源倾斜。",
    aiRecommendation:
      "强烈建议参加。该会议为部级主办，参会嘉宾级别高，可与教育部领导当面汇报学院AI+教育成果，争取试点资格。建议提前准备5分钟主题汇报材料。",
    detail:
      "全国人工智能教育大会是教育部年度重要会议，聚焦AI赋能教育改革。今年主题为「大模型时代的高等教育变革」，预计200+高校领导参会。",
  },
  {
    id: "inv2",
    eventName: "北京市产学研协同创新论坛",
    host: "北京市科委",
    date: "2025-04-25",
    location: "北京·中关村论坛永久会址",
    roiScore: 78,
    aiSuggestion: "参加",
    guestHighlights: "北京市副市长、中关村科技企业负责人",
    hostAnalysis:
      "北京市科委为地方科技主管部门，与学院多个横向课题相关。北京市近期拟出台AI专项扶持政策，参会有利于提前获取政策信息。",
    aiRecommendation:
      "建议参加。北京市AI专项扶持政策即将出台，此次论坛是获取一手政策信息的重要窗口。可与市科委领导沟通学院在京科研布局。",
    detail:
      "北京市产学研协同创新论坛是中关村论坛的分论坛之一，聚焦产学研深度融合。今年重点讨论AI产业化路径。",
  },
  {
    id: "inv3",
    eventName: "某地产集团教育品牌发布会",
    host: "恒达地产集团",
    date: "2025-05-10",
    location: "上海·外滩某酒店",
    roiScore: 25,
    aiSuggestion: "拒绝",
    guestHighlights: "地产公司高管、教培机构负责人",
    hostAnalysis:
      "恒达地产近期面临财务困境，此次活动本质是借高校背书进行品牌营销。",
    aiRecommendation:
      "建议拒绝。该企业近期负面舆情较多，参与发布会可能被解读为学院为其背书。已检索到该企业3个月内有2次负面报道。",
    detail:
      "恒达地产拟推出「教育地产」品牌，邀请多所高校领导站台。该企业近期债务问题频出，媒体报道负面。",
  },
  {
    id: "inv4",
    eventName: "IEEE 智能系统国际研讨会",
    host: "IEEE 计算机学会",
    date: "2025-05-20",
    location: "深圳·南山科技园",
    roiScore: 85,
    aiSuggestion: "参加",
    guestHighlights: "IEEE Fellow 15人、国际AI领域知名学者",
    hostAnalysis:
      "IEEE计算机学会为国际顶级学术组织，本次研讨会聚焦智能系统前沿。参会有助于扩大学院国际学术影响力和人才招募。",
    aiRecommendation:
      "建议参加。该研讨会有15名IEEE Fellow参与，是拓展国际学术网络的重要机会。建议安排学院2-3名青年教师随行，进行学术交流和人才对接。",
    detail:
      "IEEE智能系统国际研讨会汇聚全球智能系统领域顶尖学者，每年一届。今年主题为「通用人工智能的系统挑战」。",
  },
  {
    id: "inv5",
    eventName: "某互联网公司年度合作伙伴晚宴",
    host: "星云科技",
    date: "2025-05-08",
    location: "杭州·某五星酒店",
    roiScore: 45,
    aiSuggestion: "考虑",
    guestHighlights: "星云科技CTO、多家高校计算机学院院长",
    hostAnalysis:
      "星云科技为国内二线AI企业，与学院有1个在研横向课题。此次晚宴社交性质偏强，直接学术收益有限。",
    aiRecommendation:
      "可考虑派副院长参加。与星云科技存在合作关系，完全不参与可能影响合作推进。但院长亲自出席的必要性不高，建议委派副院长或合作项目负责人代为参加。",
    detail:
      "星云科技年度合作伙伴晚宴，以维护企业合作关系为目的。与会者多为合作高校和企业伙伴代表。",
  },
];

export const mockActivities: RecommendedActivity[] = [
  {
    id: "act1",
    name: "世界人工智能大会 (WAIC 2025)",
    date: "2025-07-03 ~ 07-05",
    location: "上海·世博中心",
    category: "国际会议",
    relevanceScore: 96,
    reason: "AI领域最高规格国际会议，与学院核心方向高度匹配",
    detail:
      "世界人工智能大会是国内AI领域最高规格的年度盛会，由上海市政府主办。今年主题为「智能涌现·共创未来」，预计全球500+企业、300+学术机构参展。主论坛聚焦通用人工智能、具身智能、AI治理等前沿话题。",
    preparation:
      "建议准备：1) 学院AI成果展板（3块）；2) 5分钟院长主旨发言PPT；3) 安排3-5名教师参与分论坛；4) 预约5家目标企业的合作洽谈时间。",
    aiExplanation:
      "该会议与学院在多模态大模型、AI Agent等方向的研究布局高度匹配。去年参会后促成了与华为、阿里的2个横向合作项目，ROI极高。今年新增具身智能分论坛，与学院正在筹建的方向完美契合。",
    highlights: [
      "李飞飞教授做主旨演讲",
      "具身智能专题论坛首次设立",
      "企业合作对接专区",
    ],
  },
  {
    id: "act2",
    name: "教育部新工科建设研讨会",
    date: "2025-05-15 ~ 05-16",
    location: "武汉·华中科技大学",
    category: "教育政策",
    relevanceScore: 88,
    reason: "教育部主导，AI+新工科政策方向直接影响学院发展",
    detail:
      "教育部高等教育司主办的新工科建设研讨会，聚焦AI时代工科教育改革。会议将讨论新一轮学科目录调整方案、AI课程体系建设标准、产教融合新模式等核心议题。",
    preparation:
      "建议准备：1) 学院AI课程改革经验报告；2) 与教育部高教司相关负责人预约会面；3) 收集学院近3年教学改革数据。",
    aiExplanation:
      "该研讨会将直接影响下一轮学科评估标准和专业设置方向。学院在AI课程改革方面的经验可作为典型案例分享，有利于提升学院在教育部的影响力。参会可获取学科目录调整的一手信息。",
    highlights: [
      "学科目录调整内部讨论",
      "新工科认证标准更新",
      "AI课程体系建设白皮书发布",
    ],
  },
  {
    id: "act3",
    name: "ACM SIGKDD 2025",
    date: "2025-08-03 ~ 08-07",
    location: "多伦多·Metro Convention Centre",
    category: "学术顶会",
    relevanceScore: 85,
    reason: "数据挖掘顶级学术会议，学院有3篇论文录用",
    detail:
      "ACM SIGKDD是数据挖掘与知识发现领域的顶级国际学术会议。今年大会主题为「AI for Social Good」。学院有3篇论文被录用（1篇Oral、2篇Poster）。",
    preparation:
      "建议准备：1) 安排论文作者参会并做报告；2) 组织学院研讨团参加Workshop；3) 利用会议机会与国际学者洽谈合作；4) 考虑在Industry Track展示学院产学研成果。",
    aiExplanation:
      "学院今年在KDD的论文录用量创历史新高，是提升学院国际学术声誉的重要机会。建议院长参加并主持一场Panel Discussion，可同时推进2-3个国际合作意向。",
    highlights: [
      "学院3篇论文录用（历史最佳）",
      "可主持Panel Discussion",
      "MIT/Stanford学者与会",
    ],
  },
  {
    id: "act4",
    name: "长三角高校科技成果转化大会",
    date: "2025-06-20",
    location: "南京·紫金山实验室",
    category: "成果转化",
    relevanceScore: 72,
    reason: "科技成果转化专场，可推动学院专利技术落地",
    detail:
      "长三角三省一市科技厅联合主办的成果转化大会，设有AI、新材料、生物医药三个专场对接会。参会企业500+，包括多家上市公司的技术需求发布。",
    preparation:
      "建议准备：1) 筛选学院可转化的3-5项专利技术；2) 制作技术成果宣传册；3) 指派技术转移中心负责人随行。",
    aiExplanation:
      "学院目前有8项AI相关专利尚未转化，其中3项与参会企业需求匹配度较高。参会可直接对接产业需求，加速成果转化。去年类似会议平均促成2-3个技术转让协议。",
    highlights: ["500+企业参会", "AI专场对接", "紫金山实验室参观"],
  },
  {
    id: "act5",
    name: "全球AI人才峰会",
    date: "2025-09-12 ~ 09-13",
    location: "深圳·前海国际会议中心",
    category: "人才引进",
    relevanceScore: 80,
    reason: "海外AI人才集聚，直接服务学院人才引进战略",
    detail:
      "由深圳市人才局主办的全球AI人才峰会，邀请200+海外AI领域华人学者回国交流。设有学术报告、人才对接、政策宣讲等环节。深圳市提供最高500万人才引进资金。",
    preparation:
      "建议准备：1) 学院人才引进政策手册（中英文）；2) 拟引进岗位的JD（3-5个）；3) 已联系的目标候选人名单；4) 学院宣传视频。",
    aiExplanation:
      "学院在具身智能、AI Agent两个方向亟需高端人才。根据AI分析，本次峰会参会学者中有8人与学院需求高度匹配，其中3人已在学院人事动态系统中被标记为重点关注对象。",
    highlights: [
      "200+海外华人AI学者",
      "深圳500万引才资金",
      "8名高匹配候选人参会",
    ],
  },
];
