import type { PolicyItem } from "@/lib/types/intelligence";
import type { SpeechItem, PolicyFeedItem } from "@/lib/types/policy-intel";

// Keep legacy exports for any remaining references
export const mockPolicyMatches: PolicyItem[] = [
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
    aiInsight:
      "与我院算力平台二期建设高度匹配，建议李副主任牵头、科研处配合紧急组织申报。",
    detail:
      "北京科委发布的「算力基础设施补贴政策」旨在支持高校和研究机构建设算力平台。我院算力平台二期建设规划与该政策高度匹配，预估可申请500-1000万资金支持。",
    sourceUrl: "https://kw.beijing.gov.cn/art/2025/02/01/art_example.html",
  },
  {
    id: "p2",
    name: "新一代人工智能重大专项",
    agency: "科技部",
    agencyType: "national",
    matchScore: 85,
    funding: "1000-3000万",
    deadline: "3月15日",
    daysLeft: 31,
    status: "active",
    aiInsight: "需王教授确认技术路线图，重点包装多模态大模型方向的成果。",
    detail:
      "科技部「新一代人工智能重大专项」重点支持大模型、具身智能、AI4Science三大方向。我院在多模态大模型方向有显著优势，建议以此为主攻方向申报。",
    sourceUrl:
      "https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/202501/t20250115_example.htm",
  },
  {
    id: "p3",
    name: "教育部高校AI实验室建设基金",
    agency: "教育部",
    agencyType: "ministry",
    matchScore: 72,
    funding: "200-500万",
    deadline: "4月30日",
    daysLeft: 77,
    status: "tracking",
    aiInsight: "可作为补充资金来源，建议关注但无需紧急行动。",
    detail:
      "教育部面向双一流高校的AI实验室建设专项基金，重点支持教学型AI实验室的建设和升级。",
    sourceUrl:
      "https://www.moe.gov.cn/srcsite/A16/s3852/202501/t20250110_example.htm",
  },
  {
    id: "p4",
    name: "北京市海淀区AI产业扶持计划",
    agency: "海淀区政府",
    agencyType: "beijing",
    matchScore: 65,
    funding: "100-300万",
    deadline: "5月15日",
    daysLeft: 92,
    status: "tracking",
    aiInsight: "区级政策，资金量较小但申报难度低，可安排科研处日常跟进。",
    detail:
      "海淀区政府针对区内AI相关机构的产业扶持计划，重点支持产学研合作项目。",
    sourceUrl:
      "https://www.bjhd.gov.cn/zfxxgk/auto14584_51/202501/t20250108_example.html",
  },
];

export const mockSpeeches: SpeechItem[] = [
  {
    id: "sp1",
    leader: "科技部部长",
    title: "加快建设科技强国，构建新型举国体制",
    occasion: "全国科技工作会议",
    date: "2025-01-18",
    keywords: ["举国体制", "基础研究", "人才引育"],
    relevance: 96,
    status: "high",
    summary:
      "部长在全国科技工作会议上强调，要加快构建新型举国体制，强化国家战略科技力量布局。重点提及加大基础研究投入、推动高校成为基础研究主力军、实施「人才强基计划」。",
    signals: [
      "基础研究经费将大幅增长，高校是重点投入方向",
      "「人才强基计划」将启动新一轮海外人才引进",
      "新型举国体制下高校需承担更多国家任务",
    ],
    aiAnalysis:
      "该讲话释放三个关键信号与我院高度相关。建议院长在下周院务会议上专题讨论应对策略。",
    sourceUrl: "https://www.most.gov.cn/kjbgz/202501/t20250118_example.htm",
  },
  {
    id: "sp2",
    leader: "教育部副部长",
    title: "深化研究生教育改革，提升拔尖创新人才培养质量",
    occasion: "研究生教育工作座谈会",
    date: "2025-01-15",
    keywords: ["研究生改革", "交叉学科", "产教融合"],
    relevance: 89,
    status: "high",
    summary:
      "副部长指出要深化研究生教育改革，重点推进交叉学科培养模式创新、产教融合机制建设、博士生分流退出机制完善。",
    signals: [
      "交叉学科将获得更多研究生招生名额",
      "产教融合将成为研究生培养评估重要指标",
      "博士生淘汰机制将趋严",
    ],
    aiAnalysis:
      "对我院研究生培养有直接影响。建议加快申报交叉学科学位点，当前有3名博士进展严重滞后需制定分流方案。",
    sourceUrl:
      "https://www.moe.gov.cn/jyb_xwfb/xw_zt/202501/t20250115_example.htm",
  },
  {
    id: "sp3",
    leader: "北京市市长",
    title: "打造全球数字经济标杆城市",
    occasion: "北京市数字经济大会",
    date: "2025-01-12",
    keywords: ["数字经济", "算力中心", "AI产业"],
    relevance: 82,
    status: "high",
    summary:
      "将建设三个千卡级智算中心、设立100亿数字经济产业基金、打造中关村AI创新走廊。",
    signals: [
      "北京市将大规模投资算力基础设施",
      "100亿产业基金将惠及高校科研项目",
      "中关村AI创新走廊与我院地理位置高度契合",
    ],
    aiAnalysis:
      "北京市数字经济布局与我院发展战略高度契合。建议积极对接市科委。",
    sourceUrl:
      "https://www.beijing.gov.cn/zhengce/zhengcefagui/202501/t20250112_example.html",
  },
  {
    id: "sp4",
    leader: "中国科学院院长",
    title: "强化原始创新，抢占科技制高点",
    occasion: "中科院年度工作会议",
    date: "2025-01-08",
    keywords: ["原始创新", "0到1突破", "院校合作"],
    relevance: 68,
    status: "medium",
    summary:
      "将遴选20个院校联合创新中心，重点支持量子信息、人工智能、生命科学三大领域。",
    signals: [
      "中科院将新建20个院校联合创新中心",
      "量子信息和AI是重点支持方向",
      "院校合作将有专项经费支持",
    ],
    aiAnalysis:
      "我院已与中科院计算所有合作基础，可作为申报优势。申报窗口期预计在3月。",
    sourceUrl: "https://www.cas.cn/yw/202501/t20250108_example.shtml",
  },
  {
    id: "sp5",
    leader: "国家发改委副主任",
    title: "加快新型基础设施建设，培育新质生产力",
    occasion: "新型基础设施建设推进会",
    date: "2025-01-05",
    keywords: ["新基建", "新质生产力", "数据要素"],
    relevance: 55,
    status: "low",
    summary:
      "2025年新基建投资将增长25%，重点方向包括5G-A、算力网络和工业互联网。",
    signals: [
      "新基建投资增长25%，算力网络是重点方向",
      "数据要素市场化将催生新研究课题",
      "新质生产力方向可能影响学科评估指标",
    ],
    aiAnalysis:
      "关联度一般。算力网络投资增长可能为我院算力平台建设带来间接利好。",
    sourceUrl:
      "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202501/t20250105_example.html",
  },
];

// --- Unified policy feed data ---

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
  .toISOString()
  .slice(0, 10);

export const mockPolicyFeed: PolicyFeedItem[] = [
  {
    id: "pf1",
    title: "算力基础设施补贴政策 — 匹配度98%",
    summary:
      "北京科委发布算力基础设施补贴，与我院算力平台二期高度匹配。预估资金500-1000万，建议紧急组织申报。",
    category: "政策机会",
    importance: "紧急",
    date: today,
    source: "北京科委",
    tags: ["#算力", "#补贴", "#申报"],
    matchScore: 98,
    funding: "500-1000万",
    daysLeft: 5,
    sourceUrl: "https://kw.beijing.gov.cn/art/2025/02/01/art_example.html",
    aiInsight:
      "与我院算力平台二期建设高度匹配，建议李副主任牵头、科研处配合紧急组织申报。",
    detail:
      "北京科委发布的「算力基础设施补贴政策」旨在支持高校和研究机构建设算力平台。我院算力平台二期建设规划与该政策高度匹配。",
  },
  {
    id: "pf2",
    title: "科技部发布《AI伦理治理指南》修订版",
    summary:
      "涉及生成式AI伦理、数据隐私标准和跨境数据传输协议更新。需立即审查我院数据协议合规性。",
    category: "国家政策",
    importance: "重要",
    date: today,
    source: "科技部",
    tags: ["#AI伦理", "#合规", "#数据隐私"],
    sourceUrl:
      "https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/example.htm",
    aiInsight:
      "第4.2条暗示更严格的国际合作限制，未经事先批准不得进行。建议审查Lab B数据协议。",
    detail:
      "科技部发布了关于生成式AI伦理、数据隐私标准和跨境数据传输协议的更新指南。",
  },
  {
    id: "pf3",
    title: "科技部部长：加快建设科技强国，构建新型举国体制",
    summary:
      "全国科技工作会议上强调加大基础研究投入（经费占比提升至8.5%）、推动高校成为基础研究主力军、实施「人才强基计划」。",
    category: "领导讲话",
    importance: "重要",
    date: today,
    source: "全国科技工作会议",
    tags: ["#举国体制", "#基础研究", "#人才引育"],
    leader: "科技部部长",
    relevance: 96,
    signals: [
      "基础研究经费将大幅增长，高校是重点投入方向",
      "「人才强基计划」将启动新一轮海外人才引进",
      "新型举国体制下高校需承担更多国家任务",
    ],
    sourceUrl: "https://www.most.gov.cn/kjbgz/202501/t20250118_example.htm",
    aiInsight:
      "基础研究经费增长意味着国自然项目资金将增加。海外人才引进新政策即将出台，我院「人才强院」计划应提前布局。",
    detail:
      "部长在全国科技工作会议上强调构建新型举国体制，强化国家战略科技力量布局。建议院长在下周院务会议上专题讨论应对策略。",
  },
  {
    id: "pf4",
    title: "新一代人工智能重大专项 — 匹配度85%",
    summary:
      "科技部专项重点支持大模型、具身智能、AI4Science三大方向。我院在多模态大模型方向有显著优势。",
    category: "政策机会",
    importance: "重要",
    date: yesterday,
    source: "科技部",
    tags: ["#大模型", "#具身智能", "#专项申报"],
    matchScore: 85,
    funding: "1000-3000万",
    daysLeft: 31,
    sourceUrl:
      "https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/202501/t20250115_example.htm",
    aiInsight:
      "需王教授确认技术路线图，重点包装多模态大模型方向的成果。该专项要求有明确的产业化合作伙伴。",
    detail:
      "科技部「新一代人工智能重大专项」重点支持大模型、具身智能、AI4Science三大方向。",
  },
  {
    id: "pf5",
    title: "教育部副部长：深化研究生教育改革",
    summary:
      "交叉学科招生名额扩大、产教融合成评估重要指标、博士生淘汰机制将趋严。对我院研究生培养有直接影响。",
    category: "领导讲话",
    importance: "重要",
    date: yesterday,
    source: "研究生教育工作座谈会",
    tags: ["#研究生改革", "#交叉学科", "#产教融合"],
    leader: "教育部副部长",
    relevance: 89,
    signals: [
      "交叉学科将获得更多研究生招生名额",
      "产教融合将成为研究生培养评估重要指标",
      "博士生淘汰机制将趋严",
    ],
    sourceUrl:
      "https://www.moe.gov.cn/jyb_xwfb/xw_zt/202501/t20250115_example.htm",
    aiInsight:
      "交叉学科招生名额扩大利好「AI+X」方向。当前我院有3名博士进展严重滞后，需制定分流方案。",
    detail:
      "该讲话对我院研究生培养有直接影响。建议加快申报交叉学科学位点，加强企业联合培养基地建设。",
  },
  {
    id: "pf6",
    title: "北京市高级别自动驾驶试点区发展规划",
    summary:
      "为交通系统部门开辟了新的市政拨款窗口，与当前「智慧城市」计划一致。",
    category: "北京政策",
    importance: "关注",
    date: twoDaysAgo,
    source: "北京发改委",
    tags: ["#自动驾驶", "#智慧城市"],
    sourceUrl:
      "https://fgw.beijing.gov.cn/fgwzc/zcjd/202311/t20231113_example.htm",
    aiInsight: "为交通系统部门开辟新的市政拨款窗口，可关注配套研究课题。",
    detail: "北京市发改委发布高级别自动驾驶试点区发展规划。",
  },
  {
    id: "pf7",
    title: "北京市市长：打造全球数字经济标杆城市",
    summary:
      "将建设三个千卡级智算中心、设立100亿数字经济产业基金、打造中关村AI创新走廊。",
    category: "领导讲话",
    importance: "关注",
    date: "2025-01-12",
    source: "北京市数字经济大会",
    tags: ["#数字经济", "#算力中心", "#AI产业"],
    leader: "北京市市长",
    relevance: 82,
    signals: [
      "北京市将大规模投资算力基础设施",
      "100亿产业基金将惠及高校科研项目",
      "中关村AI创新走廊与我院地理位置高度契合",
    ],
    sourceUrl:
      "https://www.beijing.gov.cn/zhengce/zhengcefagui/202501/t20250112_example.html",
    aiInsight:
      "智算中心建设可争取算力资源共享合作。100亿产业基金将设立高校专项。",
    detail:
      "北京市数字经济布局与我院发展战略高度契合。中关村AI创新走廊覆盖我院所在园区。",
  },
  {
    id: "pf8",
    title: "教育部高校AI实验室建设基金 — 匹配度72%",
    summary: "面向双一流高校的AI实验室建设专项基金，可作为补充资金来源。",
    category: "政策机会",
    importance: "关注",
    date: "2025-01-10",
    source: "教育部",
    tags: ["#实验室建设", "#双一流"],
    matchScore: 72,
    funding: "200-500万",
    daysLeft: 77,
    sourceUrl:
      "https://www.moe.gov.cn/srcsite/A16/s3852/202501/t20250110_example.htm",
    aiInsight: "可作为补充资金来源，建议关注但无需紧急行动。",
    detail: "教育部面向双一流高校的AI实验室建设专项基金。",
  },
  {
    id: "pf9",
    title: "中科院院长：强化原始创新，抢占科技制高点",
    summary:
      "将遴选20个院校联合创新中心，重点支持量子信息、人工智能、生命科学三大领域。",
    category: "领导讲话",
    importance: "关注",
    date: "2025-01-08",
    source: "中科院年度工作会议",
    tags: ["#原始创新", "#院校合作"],
    leader: "中国科学院院长",
    relevance: 68,
    signals: ["中科院将新建20个院校联合创新中心", "量子信息和AI是重点支持方向"],
    sourceUrl: "https://www.cas.cn/yw/202501/t20250108_example.shtml",
    aiInsight:
      "我院与中科院计算所有合作基础，可作为申报优势。申报窗口期预计在3月。",
    detail: "中科院院校联合创新中心是我院重要机会。建议以大模型安全方向申报。",
  },
  {
    id: "pf10",
    title: "关于加强高校基础研究人才培养的通知",
    summary: "关于博士项目资助分配的一般性政策更新。",
    category: "国家政策",
    importance: "一般",
    date: "2025-01-07",
    source: "教育部",
    tags: ["#基础研究", "#人才培养"],
    sourceUrl:
      "https://www.moe.gov.cn/srcsite/A22/s7065/202311/t20231112_example.htm",
    aiInsight: "一般性政策更新，无需特别关注。",
    detail: "教育部关于博士项目资助分配的一般性政策更新。",
  },
  {
    id: "pf11",
    title: "海淀区AI产业扶持计划 — 匹配度65%",
    summary: "区级产业扶持计划，资金量较小（100-300万）但申报难度低。",
    category: "政策机会",
    importance: "一般",
    date: "2025-01-05",
    source: "海淀区政府",
    tags: ["#产学研", "#区级政策"],
    matchScore: 65,
    funding: "100-300万",
    daysLeft: 92,
    sourceUrl:
      "https://www.bjhd.gov.cn/zfxxgk/auto14584_51/202501/t20250108_example.html",
    aiInsight: "资金量较小但申报难度低，可安排科研处日常跟进。",
    detail: "海淀区政府针对区内AI相关机构的产业扶持计划。",
  },
  {
    id: "pf12",
    title: "发改委副主任：加快新基建，培育新质生产力",
    summary:
      "2025年新基建投资将增长25%，重点方向包括5G-A、算力网络和工业互联网。",
    category: "领导讲话",
    importance: "一般",
    date: "2025-01-05",
    source: "新型基础设施建设推进会",
    tags: ["#新基建", "#新质生产力", "#数据要素"],
    leader: "国家发改委副主任",
    relevance: 55,
    signals: [
      "新基建投资增长25%，算力网络是重点方向",
      "数据要素市场化将催生新研究课题",
    ],
    sourceUrl:
      "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202501/t20250105_example.html",
    aiInsight:
      "关联度一般。算力网络投资增长可能为我院算力平台建设带来间接利好。「新质生产力」建议在项目申报中适当引用。",
    detail:
      "该讲话与我院关联度一般，但算力网络投资增长和「新质生产力」概念值得关注。",
  },
];
