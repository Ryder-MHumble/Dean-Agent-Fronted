import type { TechTopic, Opportunity } from "@/lib/types/tech-frontier";

export const mockTechTopics: TechTopic[] = [
  {
    id: "tp1",
    topic: "具身智能",
    description:
      "将AI与物理世界交互的关键技术方向，涵盖机器人控制、运动规划、导航等",
    tags: ["机器人", "运动控制", "仿真", "感知"],
    heatTrend: "surging",
    heatLabel: "+180%",
    ourStatus: "none",
    ourStatusLabel: "未布局",
    gapLevel: "high",
    trendingKeywords: [
      {
        keyword: "SeedDance2",
        postCount: 47,
        trend: "surging",
        posts: [
          {
            id: "p1-1",
            title:
              "ByteDance releases SeedDance2: humanoid robots that can dance and do backflips",
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
            title:
              "SeedDance2: Scalable Whole-Body Motion Synthesis for Humanoid Robots",
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
    ],
    relatedNews: [
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
    ],
    kolVoices: [
      {
        id: "kv1",
        name: "朱松纯",
        affiliation: "北京大学 / 北京通用人工智能研究院",
        influence: "极高",
        statement:
          "发布「通智2.0」通用智能体平台，具身智能需要认知架构的突破而非单纯模仿学习",
        platform: "会议",
        sourceUrl: "https://www.bigai.ai/team/songchun-zhu",
        date: "2025-01-10",
      },
      {
        id: "kv2",
        name: "Yann LeCun",
        affiliation: "Meta / NYU",
        influence: "极高",
        statement:
          "World Model是通往AGI的必经之路，具身智能需要超越当前大模型范式",
        platform: "X",
        sourceUrl: "https://x.com/ylecun/status/example",
        date: "2025-01-08",
      },
    ],
    aiSummary:
      "具身智能本周热度飙升180%，主要由字节跳动SeedDance2的发布驱动。学术界和工业界同步发力，清华AIR、北大通智平台均有新进展。我院在该方向布局为空白。",
    aiInsight:
      "建议紧急组建3-5人先导小组，重点关注机器人操作与导航方向。可与北大朱松纯团队和清华AIR探讨合作可能性。字节跳动的芯片收购也为产学研合作提供了新窗口。",
    aiRiskAssessment:
      "技术路线踏空风险：该方向国内外竞争激烈，我院若持续空白将在2-3年内失去学科竞争力。",
    memoSuggestion:
      "建议撰写「具身智能技术发展与高校布局建议」内参，结合SeedDance2发布和字节跳动芯片收购，分析高校具身智能研究方向建议。",
    totalSignals: 52,
    signalsSinceLastWeek: 18,
    lastUpdated: "2025-01-14",
  },
  {
    id: "tp2",
    topic: "多模态大模型",
    description:
      "整合视觉、语音、文本等多种模态的大模型技术，是大模型发展的重要方向",
    tags: ["大模型", "视觉", "视频生成", "长上下文"],
    heatTrend: "rising",
    heatLabel: "+45%",
    ourStatus: "deployed",
    ourStatusLabel: "已布局",
    gapLevel: "low",
    trendingKeywords: [
      {
        keyword: "Sora竞品大战",
        postCount: 28,
        trend: "rising",
        posts: [
          {
            id: "p3-1",
            title:
              "Kling 2.0 vs Sora vs Runway Gen-4: 2025视频生成模型大横评",
            platform: "YouTube",
            author: "Matt Wolfe",
            date: "2025-01-08",
            sourceUrl:
              "https://www.youtube.com/watch?v=VideoGenComparison2025",
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
        keyword: "Scaling Law争议",
        postCount: 32,
        trend: "rising",
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
            sourceUrl:
              "https://zhuanlan.zhihu.com/p/scaling-law-debate-2025",
            summary:
              "深度分析Scaling Law争议对国内AI研究方向的影响，建议高校调整资源配置策略。",
            engagement: "2.1k 赞同",
          },
        ],
      },
    ],
    relatedNews: [
      {
        id: "n2",
        title: "Google正式发布Gemini 2.0，多模态能力大幅提升",
        source: "TechCrunch",
        sourceUrl:
          "https://techcrunch.com/2025/01/08/google-gemini-2-launch",
        type: "新产品",
        date: "2025-01-08",
        impact: "重大",
        summary:
          "Google发布新一代多模态模型Gemini 2.0，在视觉理解、代码生成和推理能力上均有显著突破，支持100万token上下文窗口。",
        aiAnalysis:
          "Gemini 2.0在多模态基准测试中部分超越GPT-4o。建议我院多模态团队密切跟踪其技术报告，评估我院现有模型的差距。长上下文窗口技术值得重点研究。",
        relevance: "与我院多模态大模型研究直接相关",
      },
    ],
    kolVoices: [
      {
        id: "kv3",
        name: "唐杰",
        affiliation: "清华大学",
        influence: "高",
        statement:
          "ChatGLM系列模型持续更新至GLM-4-Plus，多模态能力和长上下文处理是下一步重点",
        platform: "会议",
        sourceUrl: "https://keg.cs.tsinghua.edu.cn/jietang/",
        date: "2025-01-09",
      },
    ],
    aiSummary:
      "多模态大模型持续升温，Gemini 2.0发布和Sora竞品大战是本周焦点。Scaling Law是否触顶引发广泛争议，研究范式可能面临转折。我院在该方向已有布局。",
    aiInsight:
      "我院在文本-图像多模态方面有积累，建议保持投入并加强与产业界合作。重点关注长上下文窗口和视频生成两个细分方向。Scaling Law争议值得组织研讨会深入讨论。",
    totalSignals: 65,
    signalsSinceLastWeek: 22,
    lastUpdated: "2025-01-13",
  },
  {
    id: "tp3",
    topic: "AI Agent",
    description:
      "自主完成复杂任务的智能代理系统，涵盖工具调用、多Agent协作、自主编程等",
    tags: ["AI编程", "Agent框架", "工具调用", "自主任务"],
    heatTrend: "surging",
    heatLabel: "+210%",
    ourStatus: "weak",
    ourStatusLabel: "基础薄弱",
    gapLevel: "medium",
    trendingKeywords: [
      {
        keyword: "Claude Code & AI Coding",
        postCount: 56,
        trend: "surging",
        posts: [
          {
            id: "p4-1",
            title:
              "Claude Code is changing how I build software - a developer's honest review",
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
            sourceUrl:
              "https://zhuanlan.zhihu.com/p/ai-coding-tools-2025",
            summary:
              "全面梳理AI编程工具发展历程，分析Claude Code、Cursor、Copilot等工具的技术路线差异。",
            engagement: "3.4k 赞同",
          },
        ],
      },
    ],
    relatedNews: [
      {
        id: "n4",
        title: "百度发布文心大模型5.0，首次集成多Agent协作",
        source: "界面新闻",
        sourceUrl:
          "https://www.jiemian.com/article/baidu-ernie-5-multi-agent",
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
        id: "n1",
        title: "OpenAI完成新一轮融资，估值达3000亿美元",
        source: "Reuters",
        sourceUrl:
          "https://www.reuters.com/technology/openai-funding-round-2025",
        type: "投融资",
        date: "2025-01-10",
        impact: "重大",
        summary:
          "OpenAI完成由软银领投的新一轮融资，估值达3000亿美元，创下AI领域融资纪录。资金将用于扩大算力基础设施和AGI研究。",
        aiAnalysis:
          "OpenAI估值飙升反映市场对AGI路线的高度认可。建议关注其技术路线变化，我院在大模型对齐和安全方向可寻求合作窗口。该融资可能引发新一轮人才争夺，需警惕核心研究人员被高薪挖角。",
        relevance: "与我院大模型研究方向高度相关，可探索学术合作机会",
      },
    ],
    kolVoices: [
      {
        id: "kv4",
        name: "Ilya Sutskever",
        affiliation: "Safe Superintelligence Inc.",
        influence: "极高",
        statement:
          "创办SSI后表示Agent系统的安全性是最大挑战，自主AI需要超级对齐来确保可控",
        platform: "会议",
        sourceUrl: "https://ssi.inc/about",
        date: "2025-01-11",
      },
    ],
    aiSummary:
      "AI Agent方向热度飙升210%，Claude Code引爆AI编程讨论，百度发布多Agent协作框架。OpenAI巨额融资也表明Agent方向的巨大商业潜力。我院有理论基础但工程化能力不足。",
    aiInsight:
      "我院在强化学习方向有理论积累，建议引进2名工程化人才加速Agent落地。可与百度AI研究院对接多Agent协作学术合作。同时关注AI安全与对齐方向的预防性布局。",
    memoSuggestion:
      "建议撰写「AI Agent技术发展与安全治理」内参，结合OpenAI融资和Sutskever创办SSI的动态，分析Agent安全治理的政策建议。",
    totalSignals: 61,
    signalsSinceLastWeek: 25,
    lastUpdated: "2025-01-14",
  },
  {
    id: "tp4",
    topic: "AI for Science",
    description:
      "利用AI加速科学发现的新范式，涵盖药物发现、蛋白质结构预测、分子模拟等",
    tags: ["科学计算", "药物发现", "蛋白质", "开源模型"],
    heatTrend: "stable",
    heatLabel: "+12%",
    ourStatus: "deployed",
    ourStatusLabel: "已布局",
    gapLevel: "low",
    trendingKeywords: [
      {
        keyword: "DeepSeek-R1开源",
        postCount: 39,
        trend: "stable",
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
            title:
              "DeepSeek R1 is genuinely impressive - matches o1 on most reasoning benchmarks",
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
    ],
    relatedNews: [
      {
        id: "n5",
        title: "国务院发布《人工智能产业高质量发展指导意见》",
        source: "新华社",
        sourceUrl:
          "https://www.gov.cn/zhengce/202501/ai-industry-guidelines",
        type: "政策",
        date: "2025-01-03",
        impact: "重大",
        summary:
          "国务院正式发布AI产业发展指导意见，明确提出加大基础研究投入、培育AI人才梯队、推动产学研深度融合等重点任务，配套设立500亿元AI发展专项基金。",
        aiAnalysis:
          "国家级政策利好明显，500亿专项基金为高校AI研究提供重大机遇。建议立即组织政策解读会，梳理可申报方向。重点关注基础研究和人才培育两个板块的资金申请窗口。",
        relevance: "直接影响我院科研经费申请和学科建设",
      },
    ],
    kolVoices: [
      {
        id: "kv5",
        name: "鄂维南",
        affiliation: "北京大学 / 普林斯顿大学",
        influence: "高",
        statement:
          "发表AI驱动分子动力学新方法（Nature正刊），Deep Potential方法可大幅加速分子模拟",
        platform: "论文",
        sourceUrl:
          "https://scholar.google.com/citations?user=EXAMPLE_EWN",
        date: "2025-01-05",
      },
    ],
    aiSummary:
      "AI for Science方向热度平稳，DeepSeek-R1的开源为科学计算推理提供了新工具。国务院AI政策为基础研究方向带来重大资金机遇。鄂维南院士Nature正刊论文展示AI分子模拟新突破。",
    aiInsight:
      "当前布局良好，建议加强跨学科合作，尤其是与生命科学学院的联合课题。DeepSeek-R1的开源推理能力可应用于我院现有科学计算课题。500亿专项基金是重要申报窗口。",
    totalSignals: 44,
    signalsSinceLastWeek: 8,
    lastUpdated: "2025-01-07",
  },
  {
    id: "tp5",
    topic: "端侧AI推理",
    description:
      "将AI推理从云端迁移到边缘设备，涉及模型压缩、专用芯片、高效推理等技术",
    tags: ["边缘计算", "模型压缩", "AI芯片", "推理优化"],
    heatTrend: "rising",
    heatLabel: "+65%",
    ourStatus: "none",
    ourStatusLabel: "未布局",
    gapLevel: "high",
    trendingKeywords: [
      {
        keyword: "端侧AI推理芯片",
        postCount: 23,
        trend: "rising",
        posts: [
          {
            id: "p6-1",
            title:
              "Apple releases next-gen on-device AI chip with 3x inference speedup",
            platform: "X",
            author: "@markgurman",
            date: "2025-01-09",
            sourceUrl: "https://x.com/markgurman/status/1877890123456",
            summary:
              "Apple发布新一代端侧AI芯片，推理速度提升3倍，支持本地运行70B参数模型。",
            engagement: "9.2k likes",
          },
          {
            id: "p6-2",
            title: "端侧大模型推理优化：量化、剪枝与知识蒸馏综述",
            platform: "ArXiv",
            author: "Zhu et al.",
            date: "2025-01-07",
            sourceUrl: "https://arxiv.org/abs/2501.05678",
            summary:
              "综述端侧AI推理的三大优化技术路线，分析各方案在精度-速度-功耗的权衡。",
            engagement: "89 citations",
          },
          {
            id: "p6-3",
            title: "高通发布骁龙8 Elite：端侧AI性能全面超越A18 Pro",
            platform: "微信公众号",
            author: "芯智讯",
            date: "2025-01-08",
            sourceUrl:
              "https://mp.weixin.qq.com/s/qualcomm-8-elite-ai",
            summary:
              "高通最新旗舰芯片在端侧AI推理性能上实现重大突破，引发行业对端侧AI能力边界的重新评估。",
            engagement: "8万+阅读",
          },
        ],
      },
    ],
    relatedNews: [
      {
        id: "n3b",
        title: "字节跳动收购AI芯片设计公司芯驰科技",
        source: "36氪",
        sourceUrl: "https://36kr.com/p/bytedance-acquires-xinchi-ai-chip",
        type: "收购",
        date: "2025-01-06",
        impact: "较大",
        summary:
          "字节跳动以约50亿元收购芯驰科技，加速布局AI推理芯片自研。此举标志着大型互联网公司加速向AI全栈自主化方向发展。",
        aiAnalysis:
          "互联网大厂进军端侧芯片表明该领域商业价值正在被验证。我院缺乏硬件研究基础，但可通过模型压缩和高效推理算法方向参与。",
        relevance: "与端侧推理优化方向潜在相关",
      },
    ],
    kolVoices: [],
    aiSummary:
      "端侧AI推理热度持续上升，Apple和高通相继发布新一代AI芯片，字节跳动收购芯片公司加速布局。学术界对模型压缩和高效推理的研究活跃。我院在该方向布局为空白。",
    aiInsight:
      "该方向偏硬件，我院可暂时通过合作方式参与。建议重点关注模型压缩和高效推理算法方向，这是我院在该领域最可行的切入点。可与字节跳动或高通探讨联合研究。",
    aiRiskAssessment:
      "技术路线空白：端侧AI是未来AI应用的重要方向，长期空白可能影响我院在AI全栈能力上的竞争力。",
    totalSignals: 28,
    signalsSinceLastWeek: 10,
    lastUpdated: "2025-01-09",
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
