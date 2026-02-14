import type { TechTrend } from "@/lib/types/intelligence";
import type {
  IndustryNews,
  TrendingKeyword,
  KOL,
  Opportunity,
} from "@/lib/types/tech-frontier";

export const mockModuleTechTrends: TechTrend[] = [
  {
    id: "t1",
    topic: "具身智能",
    heatTrend: "surging",
    heatLabel: "+180%",
    ourStatus: "none",
    ourStatusLabel: "未布局",
    gapLevel: "high",
    keyMetric: "清华AIR发布2篇顶会论文",
    aiInsight:
      "建议紧急组建3-5人先导小组，重点关注机器人操作与导航方向。可与清华AIR探讨合作可能性。",
    detail:
      "具身智能是将AI与物理世界交互的关键技术方向。清华AIR在该方向已发布2篇ICRA 2024论文，团队扩至15人。我院在该方向布局为空，存在技术路线踏空风险。",
  },
  {
    id: "t2",
    topic: "多模态大模型",
    heatTrend: "rising",
    heatLabel: "+45%",
    ourStatus: "deployed",
    ourStatusLabel: "已布局",
    gapLevel: "low",
    keyMetric: "GPT-4o引发新一轮研究热潮",
    aiInsight: "我院在该方向已有深厚积累，建议保持投入并加强与产业界合作。",
    detail:
      "多模态大模型整合视觉、语音、文本等多种模态，是大模型发展的重要方向。我院在文本-图像多模态方面有3个在研项目和5篇顶会论文积累。",
  },
  {
    id: "t3",
    topic: "AI Agent",
    heatTrend: "surging",
    heatLabel: "+210%",
    ourStatus: "weak",
    ourStatusLabel: "基础薄弱",
    gapLevel: "medium",
    keyMetric: "OpenAI发布Operator产品",
    aiInsight: "我院有理论基础但缺乏工程化能力，建议引进2名工程化人才。",
    detail:
      "AI Agent是自主完成复杂任务的智能代理系统。OpenAI、Anthropic等公司相继发布Agent产品。我院在强化学习方向有理论积累，但工程化落地能力不足。",
  },
  {
    id: "t4",
    topic: "AI for Science",
    heatTrend: "stable",
    heatLabel: "+12%",
    ourStatus: "deployed",
    ourStatusLabel: "已布局",
    gapLevel: "low",
    keyMetric: "Nature连发3篇AI+生物论文",
    aiInsight:
      "当前布局良好，建议加强跨学科合作，尤其是与生命科学学院的联合课题。",
    detail:
      "AI for Science利用AI加速科学发现的新范式。我院在药物发现、蛋白质结构预测方向有2个在研课题。",
  },
  {
    id: "t5",
    topic: "端侧AI推理",
    heatTrend: "rising",
    heatLabel: "+65%",
    ourStatus: "none",
    ourStatusLabel: "未布局",
    gapLevel: "high",
    keyMetric: "Apple发布端侧AI芯片",
    aiInsight: "存在技术路线空白，但该方向偏硬件，可暂时通过合作方式参与。",
    detail:
      "端侧AI将AI推理从云端迁移到边缘设备，涉及模型压缩、专用芯片等技术。Apple、Qualcomm等公司正大力投入。",
  },
];

export const mockIndustryNews: IndustryNews[] = [
  {
    id: "n1",
    title: "OpenAI完成新一轮融资，估值达3000亿美元",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com/technology/openai-funding-round-2025",
    type: "投融资",
    date: "2025-01-10",
    impact: "重大",
    summary:
      "OpenAI完成由软银领投的新一轮融资，估值达3000亿美元，创下AI领域融资纪录。资金将用于扩大算力基础设施和AGI研究。",
    aiAnalysis:
      "OpenAI估值飙升反映市场对AGI路线的高度认可。建议关注其技术路线变化，我院在大模型对齐和安全方向可寻求合作窗口。该融资可能引发新一轮人才争夺，需警惕核心研究人员被高薪挖角。",
    relevance: "与我院大模型研究方向高度相关，可探索学术合作机会",
  },
  {
    id: "n2",
    title: "Google正式发布Gemini 2.0，多模态能力大幅提升",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/2025/01/08/google-gemini-2-launch",
    type: "新产品",
    date: "2025-01-08",
    impact: "重大",
    summary:
      "Google发布新一代多模态模型Gemini 2.0，在视觉理解、代码生成和推理能力上均有显著突破，支持100万token上下文窗口。",
    aiAnalysis:
      "Gemini 2.0在多模态基准测试中部分超越GPT-4o。建议我院多模态团队密切跟踪其技术报告，评估我院现有模型的差距。长上下文窗口技术值得重点研究。",
    relevance: "与我院多模态大模型研究直接相关",
  },
  {
    id: "n3",
    title: "字节跳动收购AI芯片设计公司芯驰科技",
    source: "36氪",
    sourceUrl: "https://36kr.com/p/bytedance-acquires-xinchi-ai-chip",
    type: "收购",
    date: "2025-01-06",
    impact: "较大",
    summary:
      "字节跳动以约50亿元收购芯驰科技，加速布局AI推理芯片自研。此举标志着大型互联网公司加速向AI全栈自主化方向发展。",
    aiAnalysis:
      "字节收购芯片公司表明大厂正加速AI全栈化布局。端侧AI芯片领域我院尚未布局，建议通过产学研合作方式参与。可与字节跳动探讨联合实验室可能性。",
    relevance: "与我院AI芯片方向潜在研究契合",
  },
  {
    id: "n4",
    title: "百度发布文心大模型5.0，首次集成多Agent协作",
    source: "界面新闻",
    sourceUrl: "https://www.jiemian.com/article/baidu-ernie-5-multi-agent",
    type: "新产品",
    date: "2025-01-05",
    impact: "较大",
    summary:
      "百度发布文心大模型5.0版本，首次内置多Agent协作框架，支持自动化工作流编排，在企业应用场景中表现突出。",
    aiAnalysis:
      "多Agent协作是我院AI Agent方向的重要落地场景。建议与百度AI研究院对接，探讨在Agent协作框架上的学术合作。该方向可作为我院Agent研究工程化的突破口。",
    relevance: "与我院AI Agent研究方向紧密相关",
  },
  {
    id: "n5",
    title: "国务院发布《人工智能产业高质量发展指导意见》",
    source: "新华社",
    sourceUrl: "https://www.gov.cn/zhengce/202501/ai-industry-guidelines",
    type: "政策",
    date: "2025-01-03",
    impact: "重大",
    summary:
      "国务院正式发布AI产业发展指导意见，明确提出加大基础研究投入、培育AI人才梯队、推动产学研深度融合等重点任务，配套设立500亿元AI发展专项基金。",
    aiAnalysis:
      "国家级政策利好明显，500亿专项基金为高校AI研究提供重大机遇。建议立即组织政策解读会，梳理可申报方向。重点关注基础研究和人才培育两个板块的资金申请窗口。",
    relevance: "直接影响我院科研经费申请和学科建设",
  },
];

export const mockTrendingKeywords: TrendingKeyword[] = [
  {
    id: "tk1",
    keyword: "SeedDance2",
    postCount: 47,
    trend: "surging",
    tags: ["具身智能", "机器人", "字节跳动"],
    posts: [
      {
        id: "p1-1",
        title: "ByteDance releases SeedDance2: humanoid robots that can dance and do backflips",
        platform: "X",
        author: "@AK_ntn",
        date: "2025-01-12",
        sourceUrl: "https://x.com/ak_ntn/status/1878234567890",
        summary:
          "字节跳动发布SeedDance2全身运动控制模型，人形机器人可完成舞蹈、后空翻等复杂动作，展示具身智能重大突破。",
        engagement: "12.3k likes",
      },
      {
        id: "p1-2",
        title: "SeedDance2: Scalable Whole-Body Motion Synthesis for Humanoid Robots",
        platform: "ArXiv",
        author: "ByteDance Research",
        date: "2025-01-11",
        sourceUrl: "https://arxiv.org/abs/2501.06789",
        summary:
          "论文提出基于扩散模型的全身运动生成框架，在多个基准测试上超越现有方法。",
        engagement: "324 citations",
      },
      {
        id: "p1-3",
        title: "SeedDance2 Demo: 字节机器人跳街舞完整演示",
        platform: "YouTube",
        author: "Two Minute Papers",
        date: "2025-01-13",
        sourceUrl: "https://www.youtube.com/watch?v=SeedDance2Demo",
        summary: "Two Minute Papers对SeedDance2的技术解析和演示视频。",
        engagement: "890k views",
      },
    ],
  },
  {
    id: "tk2",
    keyword: "Scaling Law争议",
    postCount: 32,
    trend: "rising",
    tags: ["大模型", "理论", "研究范式"],
    posts: [
      {
        id: "p2-1",
        title: "Has Scaling Hit a Wall? New Evidence from Frontier Labs",
        platform: "ArXiv",
        author: "Kaplan et al.",
        date: "2025-01-09",
        sourceUrl: "https://arxiv.org/abs/2501.04321",
        summary:
          "多篇论文指出在特定任务上，模型规模增长的性能收益正在递减，引发对Scaling Law可持续性的重新审视。",
        engagement: "187 citations",
      },
      {
        id: "p2-2",
        title: "Ilya Sutskever在SSI发布会上暗示「规模不是一切」",
        platform: "X",
        author: "@tsaboris",
        date: "2025-01-10",
        sourceUrl: "https://x.com/tsaboris/status/1877654321098",
        summary:
          "Sutskever在SSI发布会上表示，未来AI突破不会仅靠规模扩展，需要新的架构创新。",
        engagement: "8.7k likes",
      },
      {
        id: "p2-3",
        title: "从Scaling Law到Smart Scaling：大模型研究范式转变",
        platform: "知乎",
        author: "量子位",
        date: "2025-01-11",
        sourceUrl: "https://zhuanlan.zhihu.com/p/scaling-law-debate-2025",
        summary:
          "深度分析Scaling Law争议对国内AI研究方向的影响，建议高校调整资源配置策略。",
        engagement: "2.1k 赞同",
      },
    ],
  },
  {
    id: "tk3",
    keyword: "Sora竞品大战",
    postCount: 28,
    trend: "rising",
    tags: ["视频生成", "多模态", "商业化"],
    posts: [
      {
        id: "p3-1",
        title: "Kling 2.0 vs Sora vs Runway Gen-4: 2025视频生成模型大横评",
        platform: "YouTube",
        author: "Matt Wolfe",
        date: "2025-01-08",
        sourceUrl: "https://www.youtube.com/watch?v=VideoGenComparison2025",
        summary:
          "对比测评三大视频生成模型，Kling 2.0在中文场景和物理一致性上表现突出。",
        engagement: "1.2M views",
      },
      {
        id: "p3-2",
        title: "快手Kling 2.0开放API，视频生成进入应用爆发期",
        platform: "微信公众号",
        author: "机器之心",
        date: "2025-01-07",
        sourceUrl: "https://mp.weixin.qq.com/s/kling-2-api-launch",
        summary:
          "快手正式开放Kling 2.0 API，支持4K分辨率60秒视频生成，定价仅为Sora的1/3。",
        engagement: "10万+阅读",
      },
    ],
  },
  {
    id: "tk4",
    keyword: "Claude Code & AI Coding",
    postCount: 56,
    trend: "surging",
    tags: ["AI编程", "开发工具", "Agent"],
    posts: [
      {
        id: "p4-1",
        title: "Claude Code is changing how I build software - a developer's honest review",
        platform: "X",
        author: "@swyx",
        date: "2025-01-14",
        sourceUrl: "https://x.com/swyx/status/1879012345678",
        summary:
          "知名开发者swyx分享Claude Code使用体验，认为AI辅助编程已经从玩具进入生产力工具阶段。",
        engagement: "15.6k likes",
      },
      {
        id: "p4-2",
        title: "anthropics/claude-code: Claude Code official repository",
        platform: "GitHub",
        author: "Anthropic",
        date: "2025-01-10",
        sourceUrl: "https://github.com/anthropics/claude-code",
        summary:
          "Anthropic开源Claude Code CLI工具，支持自主编程、代码审查和项目管理。",
        engagement: "32.1k stars",
      },
      {
        id: "p4-3",
        title: "AI编程工具2025年度盘点：从Copilot到Claude Code的进化",
        platform: "知乎",
        author: "阿里技术",
        date: "2025-01-12",
        sourceUrl: "https://zhuanlan.zhihu.com/p/ai-coding-tools-2025",
        summary:
          "全面梳理AI编程工具发展历程，分析Claude Code、Cursor、Copilot等工具的技术路线差异。",
        engagement: "3.4k 赞同",
      },
    ],
  },
  {
    id: "tk5",
    keyword: "DeepSeek-R1开源",
    postCount: 39,
    trend: "stable",
    tags: ["开源模型", "推理", "国产大模型"],
    posts: [
      {
        id: "p5-1",
        title: "DeepSeek-R1: 中国开源推理模型的新标杆",
        platform: "ArXiv",
        author: "DeepSeek AI",
        date: "2025-01-06",
        sourceUrl: "https://arxiv.org/abs/2501.03456",
        summary:
          "DeepSeek发布R1推理模型，在数学和代码推理任务上达到o1级别水平，完全开源。",
        engagement: "512 citations",
      },
      {
        id: "p5-2",
        title: "DeepSeek R1 is genuinely impressive - matches o1 on most reasoning benchmarks",
        platform: "X",
        author: "@karpathy",
        date: "2025-01-07",
        sourceUrl: "https://x.com/karpathy/status/1876543210987",
        summary:
          "Karpathy对DeepSeek-R1给出高度评价，认为开源推理模型首次达到闭源模型水平。",
        engagement: "21.4k likes",
      },
    ],
  },
];

export const mockKOLs: KOL[] = [
  {
    id: "k1",
    name: "Yann LeCun",
    affiliation: "Meta / NYU",
    hIndex: 168,
    field: "深度学习",
    recentActivity: "公开质疑LLM路线，力推World Model",
    sourceUrl: "https://scholar.google.com/citations?user=WLN3QrAAAAAJ",
    influence: "极高",
    summary:
      "图灵奖得主，Meta首席AI科学家。近期频繁发声反对纯LLM路线，主张结合世界模型和因果推理，对学术界研究方向有重要引导作用。",
    aiAnalysis:
      "LeCun的观点值得高度关注。他提出的JEPA架构可能成为下一代AI架构候选方案。建议安排研究团队深入研读其最新论文，评估JEPA方向的布局可能性。",
  },
  {
    id: "k2",
    name: "朱松纯",
    affiliation: "北京大学 / 北京通用人工智能研究院",
    hIndex: 112,
    field: "通用人工智能",
    recentActivity: "发布「通智2.0」通用智能体平台",
    sourceUrl: "https://www.bigai.ai/team/songchun-zhu",
    influence: "极高",
    summary:
      "北京大学讲席教授，通用人工智能研究院院长。其团队在具身智能和认知架构方向处于国内领先地位，「通智」平台已成为学术界标杆。",
    aiAnalysis:
      "朱松纯团队是具身智能领域国内最重要的合作伙伴候选。建议院长亲自对接，探讨联合培养博士生和共建实验室的可能性。",
  },
  {
    id: "k3",
    name: "唐杰",
    affiliation: "清华大学",
    hIndex: 98,
    field: "知识图谱与大模型",
    recentActivity: "ChatGLM系列模型持续更新，发布GLM-4-Plus",
    sourceUrl: "https://keg.cs.tsinghua.edu.cn/jietang/",
    influence: "高",
    summary:
      "清华大学计算机系教授，智谱AI联合创始人。在知识图谱和大模型领域有深厚积累，ChatGLM系列是国内最具影响力的开源大模型之一。",
    aiAnalysis:
      "唐杰教授团队在产学研结合方面是标杆。建议学习其智谱AI模式，评估我院是否可在特定垂直领域打造类似的产学研平台。",
  },
  {
    id: "k4",
    name: "Ilya Sutskever",
    affiliation: "Safe Superintelligence Inc.",
    hIndex: 132,
    field: "AI安全与超级对齐",
    recentActivity: "创办SSI公司，融资超10亿美元",
    sourceUrl: "https://ssi.inc/about",
    influence: "极高",
    summary:
      "前OpenAI首席科学家，AlexNet论文共同作者。离开OpenAI后创办专注超级AI安全的公司SSI，引发学术界对AI安全方向的新一轮关注。",
    aiAnalysis:
      "Sutskever的转向表明AI安全将成为顶级研究者的首选方向。建议我院在AI安全领域提前布局，可尝试联系SSI探讨学术合作。",
  },
  {
    id: "k5",
    name: "鄂维南",
    affiliation: "北京大学 / 普林斯顿大学",
    hIndex: 95,
    field: "AI for Science",
    recentActivity: "发表AI驱动分子动力学新方法，Nature正刊",
    sourceUrl: "https://scholar.google.com/citations?user=EXAMPLE_EWN",
    influence: "高",
    summary:
      "中科院院士，在AI与科学计算交叉领域有深远影响。其Deep Potential方法已成为AI for Science领域的标志性工作。",
    aiAnalysis:
      "鄂维南院士团队在AI for Science方向是国内翘楚。我院已有相关布局，建议加强与其团队在分子模拟和科学计算方向的合作深度。",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "o1",
    name: "ICML 2025 特邀报告邀请",
    type: "会议",
    source: "ICML组委会",
    priority: "紧急",
    deadline: "2025-01-20",
    summary:
      "ICML 2025组委会发来特邀报告邀请，主题为「大模型时代的AI安全与对齐」。这是顶级会议的高规格邀请，需尽快确认是否出席并提交摘要。会议定于7月在维也纳举办。",
    aiAssessment:
      "ICML特邀报告是提升我院国际影响力的重要机会，建议院长亲自出席或指定顶级教授代表。该报告主题与我院AI安全研究方向契合，可借此机会展示研究成果并拓展国际合作网络。",
    actionSuggestion: "建议3日内确认出席，安排教授准备报告大纲",
  },
  {
    id: "o2",
    name: "华为-高校AI联合实验室共建计划",
    type: "合作",
    source: "华为2012实验室",
    priority: "高",
    deadline: "2025-02-15",
    summary:
      "华为2012实验室拟与5所高校共建AI联合实验室，涉及大模型训练优化、端侧推理和AI编译器方向。每个联合实验室配套经费约2000万元/年，共建期3年。",
    aiAssessment:
      "华为联合实验室项目资金充裕且技术方向前沿。我院在大模型训练优化方向有积累，建议重点申报该方向。需注意知识产权条款的谈判，确保学术发表自由度。",
    actionSuggestion: "建议立即成立申报团队，2周内完成项目计划书",
  },
  {
    id: "o3",
    name: "MIT CSAIL学术访问交流项目",
    type: "合作",
    source: "MIT CSAIL",
    priority: "高",
    deadline: "2025-03-01",
    summary:
      "MIT计算机科学与人工智能实验室发来学术访问邀请，拟开展为期6个月的联合研究计划，方向为多模态学习与机器人控制。可派遣2-3名青年教师及博士生。",
    aiAssessment:
      "MIT CSAIL是全球顶级AI实验室，此次访问机会对我院青年教师成长和国际化布局具有战略意义。多模态+机器人方向也有助于弥补我院在具身智能方向的空白。",
    actionSuggestion: "建议遴选2名青年骨干教师和3名优秀博士生",
  },
  {
    id: "o4",
    name: "AI赋能教育改革内参选题",
    type: "内参",
    source: "教育部高教司",
    priority: "中",
    deadline: "2025-02-28",
    summary:
      "教育部高教司征集「AI赋能高等教育改革」内参稿件，拟选编10篇优秀内参报送国务院参考。这是展示我院AI教育实践成果的良好契机。",
    aiAssessment:
      "内参报送是提升我院在教育系统影响力的重要渠道。建议围绕「AI赋能计算机专业教学改革」主题撰写，结合我院LLM辅助教学试点项目的实际数据和成效。",
    actionSuggestion: "建议指派副院长牵头，1周内完成内参初稿",
  },
  {
    id: "o5",
    name: "国家自然科学基金AI重大专项预申报",
    type: "合作",
    source: "国家自然科学基金委",
    priority: "紧急",
    deadline: "2025-01-25",
    summary:
      "国家自然科学基金委发布2025年度AI重大研究专项预申报通知，涵盖基础理论、关键技术和应用示范三个板块，单项资助额度最高5000万元。",
    aiAssessment:
      "重大专项是获取大规模科研经费的核心渠道。建议组织3-5个方向的预申报团队，重点布局AI基础理论（大模型可解释性）和关键技术（高效推理）两个板块。需院长亲自协调跨课题组资源。",
    actionSuggestion: "建议立即召开教授会议讨论申报策略，5日内确定方向",
  },
];
