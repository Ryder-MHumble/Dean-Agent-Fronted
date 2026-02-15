import type {
  PeerInstitution,
  PersonnelChange,
  ResearchOutput,
  PeerNewsItem,
} from "@/lib/types/university-eco";

export const mockPeers: PeerInstitution[] = [
  {
    id: "c1",
    name: "清华AIR",
    activityLevel: 92,
    latestAction: "发布具身智能实验室2篇ICRA论文",
    actionType: "科研成果",
    threatLevel: "critical",
    recentCount: 5,
    aiInsight:
      "清华AIR在具身智能方向形成明显领先，该团队已扩至15人。建议密切关注其研究路线，评估合作可能性。",
    detail:
      "清华AIR近期在具身智能、多模态大模型方向密集产出。已发表ICRA 2024论文2篇，获批国家级项目1项，团队规模扩至15人。",
  },
  {
    id: "c2",
    name: "智源研究院",
    activityLevel: 78,
    latestAction: "获批算力基础设施建设资金",
    actionType: "资金动态",
    threatLevel: "warning",
    recentCount: 3,
    aiInsight:
      "智源在算力方面获得大量资金支持。我院需关注其算力开放策略是否影响我院合作方获取资源。",
    detail:
      "智源研究院近期获批过亿资金用于算力基础设施建设，预计新增10000 GPU小时算力。",
  },
  {
    id: "c3",
    name: "北大AI Lab",
    activityLevel: 55,
    latestAction: "NLP团队发布ChatBench评测基准",
    actionType: "学术发布",
    threatLevel: "normal",
    recentCount: 2,
    aiInsight:
      "北大AI Lab在传统NLP领域保持稳定产出，整体威胁可控。其新发布的评测基准可作为我院论文引用参考。",
    detail:
      "北大AI Lab近期发布ChatBench大模型评测基准，在NLP领域保持稳定产出，团队规模基本不变。",
  },
];

export const mockPersonnelChanges: PersonnelChange[] = [
  {
    id: "p1",
    person: "张伟教授",
    fromPosition: "清华大学计算机系副主任",
    toPosition: "清华大学人工智能研究院院长",
    institution: "清华大学",
    type: "任命",
    impact: "重大",
    date: "2025-05-10",
    background: "ACM Fellow，长期从事计算机视觉和多模态学习研究，H-index 85",
    aiAnalysis:
      "张伟教授升任AI研究院院长，意味着清华将进一步加强人工智能方向的战略投入。该任命可能带来清华AI研究院在资源获取和人才招募方面的显著提升。建议密切关注其上任后的战略规划和人才招聘动向。",
    detail:
      "张伟教授于2025年5月正式就任清华大学人工智能研究院院长。此前他担任计算机系副主任长达6年，在计算机视觉领域具有深厚积累。此次任命被认为是清华大学加强AI布局的关键一步。",
  },
  {
    id: "p2",
    person: "李明远教授",
    fromPosition: "北京大学智能学院副院长",
    toPosition: "离职赴美（斯坦福大学访问教授）",
    institution: "北京大学",
    type: "离职",
    impact: "重大",
    date: "2025-05-06",
    background: "国家杰青，NLP方向领军人物，带走3名博士后",
    aiAnalysis:
      "李明远教授的离职对北大NLP方向将产生较大冲击，其团队核心成员可能面临流散。这对我院是一个引才窗口期。建议立即评估其团队中可争取的青年人才，特别是NLP方向的博士后研究员。",
    detail:
      "李明远教授因个人发展原因，将赴斯坦福大学担任访问教授（为期2年）。其在北大的NLP实验室目前有在读博士8人，博士后3人。据悉其中3名博士后将随其赴美，实验室日常管理将移交副教授刘芳。",
  },
  {
    id: "p3",
    person: "陈思远研究员",
    fromPosition: "中科院物理所研究员",
    toPosition: "中科院量子信息重点实验室主任",
    institution: "中科院",
    type: "任命",
    impact: "较大",
    date: "2025-04-28",
    background: "量子计算领域顶级专家，Nature/Science发文6篇",
    aiAnalysis:
      "陈思远研究员主导的量子纠错码研究近期取得重大突破。其担任实验室主任后，中科院在量子计算领域的投入预计将大幅增加。建议评估与该实验室建立合作关系的可行性。",
    detail:
      "陈思远研究员近期在量子纠错码领域取得Nature Physics发文突破后，被任命为中科院量子信息重点实验室主任。该实验室现有固定研究人员25人，年度经费约8000万元。",
  },
  {
    id: "p4",
    person: "赵俊峰教授",
    fromPosition: "浙江大学化工学院教授",
    toPosition: "浙江大学能源研究院常务副院长",
    institution: "浙江大学",
    type: "调动",
    impact: "较大",
    date: "2025-04-22",
    background: "新能源材料专家，与宁德时代等企业有深度合作",
    aiAnalysis:
      "赵俊峰教授调任能源研究院常务副院长，预示浙大将进一步整合能源方向的产学研资源。其与产业界的密切关系可能为浙大带来更多横向经费和成果转化机会。建议关注浙大能源研究院的发展动向。",
    detail:
      "赵俊峰教授从化工学院调任能源研究院，负责日常管理工作。此次调动被认为是浙大加强新能源方向布局的重要举措。其团队的锂硫电池专利已进入产业化中试阶段。",
  },
  {
    id: "p5",
    person: "王强教授",
    fromPosition: "上海交通大学电子信息学院副院长",
    toPosition: "离职创业（AI芯片公司）",
    institution: "上海交通大学",
    type: "离职",
    impact: "一般",
    date: "2025-04-15",
    background: "集成电路设计专家，拥有多项AI芯片专利",
    aiAnalysis:
      "王强教授离职创业对上交电子信息学院有一定影响，但其方向偏向产业化，对学术竞争格局影响有限。可关注其创业公司的技术路线，评估未来产学研合作的可能性。",
    detail:
      "王强教授辞去上海交通大学教职，创办AI芯片公司「智芯科技」，已获红杉中国A轮投资。其在上交的研究团队将由副教授周磊接管。该离职事件对上交集成电路方向的学科评估可能产生一定影响。",
  },
];

export const mockResearchOutputs: ResearchOutput[] = [
  {
    id: "r1",
    title: "基于多模态大模型的具身智能感知框架",
    institution: "清华大学",
    type: "论文",
    influence: "高",
    date: "2025-05-08",
    field: "具身智能",
    authors: "张明远、李华、王磊等",
    aiAnalysis:
      "该论文在多模态融合方面提出了新的架构方案，直接对标我院同类研究方向。清华在该领域已连续发表3篇顶会论文，形成系统性领先。建议加强我院在视觉-语言联合建模方面的投入。",
    detail:
      "清华大学人工智能研究院在ICRA 2025发表的该论文，提出了一种融合视觉、语言和触觉信号的具身智能感知框架。实验表明该方法在操作任务上提升23%成功率。论文已获领域内高度关注，两周内被引用12次。",
  },
  {
    id: "r2",
    title: "量子纠错码的拓扑优化方法",
    institution: "中科院",
    type: "论文",
    influence: "高",
    date: "2025-05-05",
    field: "量子计算",
    authors: "陈思远、刘伟航等",
    aiAnalysis:
      "中科院在量子纠错码方面取得突破性进展，该方向为量子计算核心瓶颈。建议关注该团队后续研究动态，评估与我院量子计算团队的合作空间。",
    detail:
      "中科院物理所在Nature Physics发表论文，提出了一种新型拓扑量子纠错方案，将逻辑错误率降低了2个数量级。这是国内团队首次在该方向上取得国际领先成果。",
  },
  {
    id: "r3",
    title: "新型锂硫电池正极材料制备工艺（发明专利）",
    institution: "浙江大学",
    type: "专利",
    influence: "中",
    date: "2025-04-28",
    field: "新能源材料",
    authors: "赵俊峰团队",
    aiAnalysis:
      "浙大在新能源材料领域持续布局，该专利具有较高的产业化价值。建议评估我院在类似方向的专利布局是否完整，避免技术路线被抢占。",
    detail:
      "浙江大学化学工程学院获批的该发明专利，公开了一种低成本、高循环稳定性的锂硫电池正极材料制备方法。已与宁德时代建立联合实验室进行中试。",
  },
  {
    id: "r4",
    title: "国家自然科学奖二等奖（脑机接口方向）",
    institution: "北京大学",
    type: "获奖",
    influence: "高",
    date: "2025-04-20",
    field: "脑科学",
    authors: "王建华教授团队",
    aiAnalysis:
      "北大脑机接口团队获得国家级奖项，标志其在该方向的长期积累获得认可。我院脑科学方向需加快高水平成果产出，争取在下一轮评奖中有所突破。",
    detail:
      "北京大学脑科学与类脑研究中心王建华教授团队，凭借「高通量无创脑机接口关键技术及应用」获得2024年度国家自然科学奖二等奖。该团队长期深耕脑机接口领域，已积累专利30余项。",
  },
  {
    id: "r5",
    title: "面向自动驾驶的端到端决策规划算法",
    institution: "上海交通大学",
    type: "论文",
    influence: "中",
    date: "2025-04-15",
    field: "自动驾驶",
    authors: "刘昊天、周明等",
    aiAnalysis:
      "上交在自动驾驶端到端方案上有持续产出，但整体影响力尚未达到头部水平。可持续关注但无需过度警惕。建议我院相关团队重点关注其开源代码的技术路线。",
    detail:
      "上海交通大学计算机科学学院在CVPR 2025发表论文，提出了一种将感知、预测和规划统一在单一Transformer架构中的端到端自动驾驶方案。在nuScenes基准上取得了新的SOTA结果。",
  },
];

export const mockPeerNews: PeerNewsItem[] = [
  // --- 高校新闻 ---
  {
    id: "pn1",
    title: "清华大学成立具身智能研究中心，首批引进12名海外青年学者",
    sourceId: "tsinghua_news",
    sourceName: "清华大学新闻网",
    group: "university_news",
    url: "https://www.tsinghua.edu.cn/news/zxdt/example1.htm",
    date: "2026-02-15",
    summary:
      "清华大学宣布正式成立具身智能研究中心，由交叉信息研究院牵头，联合自动化系、计算机系共同建设。首批引进12名海外青年学者，聚焦人形机器人控制、多模态感知融合和仿真训练平台三大方向。",
    tags: ["university", "tsinghua", "具身智能", "人才引进"],
  },
  {
    id: "pn2",
    title: "北京大学智能学院发布新一代多模态推理模型PKU-VL3",
    sourceId: "pku_news",
    sourceName: "北京大学新闻网",
    group: "university_news",
    url: "https://news.pku.edu.cn/xwzh/example2.htm",
    date: "2026-02-15",
    summary:
      "北京大学智能学院发布多模态推理模型PKU-VL3，在数学推理和图表理解任务上刷新多项基准，模型已开源并支持本地部署。",
    tags: ["university", "pku", "多模态", "大模型"],
  },
  {
    id: "pn3",
    title: "中国科大量子计算团队实现百比特纠错码验证",
    sourceId: "ustc_news",
    sourceName: "中国科大新闻网",
    group: "university_news",
    url: "https://news.ustc.edu.cn/xwbl/example3.htm",
    date: "2026-02-14",
    summary:
      "中国科学技术大学潘建伟团队在「祖冲之三号」量子计算平台上成功实现百比特量子纠错码验证，相关成果发表于Nature。",
    tags: ["university", "ustc", "量子计算"],
  },
  {
    id: "pn4",
    title: "上海交大与OpenAI签署学术合作备忘录",
    sourceId: "sjtu_news",
    sourceName: "上海交大新闻网",
    group: "university_news",
    url: "https://news.sjtu.edu.cn/example4.htm",
    date: "2026-02-14",
    summary:
      "上海交通大学与OpenAI签署为期三年的学术合作备忘录，双方将在AI安全与对齐、大模型评测方法论领域开展联合研究，首期合作经费约500万美元。",
    tags: ["university", "sjtu", "国际合作", "AI安全"],
  },
  {
    id: "pn5",
    title: "复旦大学获批建设国家级AI+生命科学交叉研究中心",
    sourceId: "fudan_news",
    sourceName: "复旦大学新闻网",
    group: "university_news",
    url: "https://news.fudan.edu.cn/example5.htm",
    date: "2026-02-13",
    summary:
      "教育部批复复旦大学建设「AI驱动生命科学交叉研究中心」，年度经费1.2亿元，将围绕蛋白质结构预测、药物分子设计和基因组学开展AI for Science研究。",
    tags: ["university", "fudan", "AI for Science", "交叉学科"],
  },
  {
    id: "pn6",
    title: "浙江大学发布智能体操作系统ZJU-AgentOS",
    sourceId: "zju_news",
    sourceName: "浙江大学新闻网",
    group: "university_news",
    url: "https://www.zju.edu.cn/example6.htm",
    date: "2026-02-13",
    summary:
      "浙江大学计算机学院团队发布面向多智能体协作的操作系统ZJU-AgentOS，支持百级Agent并发调度和工具动态编排，已在GitHub获得5000+ star。",
    tags: ["university", "zju", "AI Agent", "开源"],
  },
  {
    id: "pn7",
    title: "北京航空航天大学牵头承担国家大飞机AI辅助设计重大专项",
    sourceId: "buaa_news",
    sourceName: "北京航空航天大学新闻网",
    group: "university_news",
    url: "https://news.buaa.edu.cn/example7.htm",
    date: "2026-02-12",
    summary:
      "北航牵头承担科技部「大飞机AI辅助设计与仿真优化」重大专项，总经费3.8亿元，联合中国商飞、中航工业等单位共同攻关。",
    tags: ["university", "buaa", "AI for Science", "国家项目"],
  },
  {
    id: "pn8",
    title: "北京理工大学发布军民融合AI芯片BIT-NPU",
    sourceId: "bit_news",
    sourceName: "北京理工大学新闻网",
    group: "university_news",
    url: "https://www.bit.edu.cn/xww/zhxw/example8.htm",
    date: "2026-02-12",
    summary:
      "北京理工大学微电子学院团队发布自研AI推理芯片BIT-NPU，采用RISC-V架构，面向边缘端实时推理场景，能效比达到同类产品的2.3倍。",
    tags: ["university", "bit", "AI芯片", "端侧AI"],
  },
  {
    id: "pn9",
    title: "哈尔滨工业大学AI团队在机器人世界杯夺冠",
    sourceId: "hit_news",
    sourceName: "哈尔滨工业大学新闻网",
    group: "university_news",
    url: "https://news.hit.edu.cn/example9.htm",
    date: "2026-02-11",
    summary:
      "哈尔滨工业大学竞技机器人团队在2026年RoboCup世界杯标准平台组决赛中夺冠，这是中国高校首次在该项目获得冠军。",
    tags: ["university", "hit", "具身智能", "机器人"],
  },
  {
    id: "pn10",
    title: "武汉大学遥感AI模型WHU-RS4在国际竞赛中排名第一",
    sourceId: "whu_news",
    sourceName: "武汉大学新闻网",
    group: "university_news",
    url: "https://news.whu.edu.cn/example10.htm",
    date: "2026-02-11",
    summary:
      "武汉大学遥感信息工程学院发布的遥感基础模型WHU-RS4在多个国际遥感解译竞赛中取得第一，模型参数量仅为同类模型的1/5。",
    tags: ["university", "whu", "遥感AI", "大模型"],
  },
  {
    id: "pn11",
    title: "华中科技大学获批教育部AI+新工科教学改革试点",
    sourceId: "hust_news",
    sourceName: "华中科技大学新闻网",
    group: "university_news",
    url: "https://news.hust.edu.cn/example11.htm",
    date: "2026-02-10",
    summary:
      "华中科技大学入选教育部「AI+新工科」教学改革首批试点高校，将在机械、电气、材料等8个工科专业全面引入AI辅助教学和课程改革。",
    tags: ["university", "hust", "教育改革", "AI教育"],
  },
  {
    id: "pn12",
    title: "东南大学与华为联合发布6G通信AI算法白皮书",
    sourceId: "seu_news",
    sourceName: "东南大学新闻网",
    group: "university_news",
    url: "https://news.seu.edu.cn/example12.htm",
    date: "2026-02-10",
    summary:
      "东南大学移动通信国家重点实验室与华为联合发布《6G智能通信算法白皮书》，提出基于大模型的信道估计和资源调度新范式。",
    tags: ["university", "seu", "6G通信", "产学研"],
  },
  {
    id: "pn13",
    title: "西安交通大学人工智能学院招生规模翻倍",
    sourceId: "xjtu_news",
    sourceName: "西安交通大学新闻网",
    group: "university_news",
    url: "https://news.xjtu.edu.cn/example13.htm",
    date: "2026-02-09",
    summary:
      "西安交通大学人工智能学院2026年本科招生计划从120人扩大至240人，同时新增「AI+医学」「AI+能源」两个交叉学科方向。",
    tags: ["university", "xjtu", "招生", "交叉学科"],
  },
  {
    id: "pn14",
    title: "中南大学AI矿业团队获国际采矿自动化大赛特等奖",
    sourceId: "csu_news",
    sourceName: "中南大学新闻网",
    group: "university_news",
    url: "https://news.csu.edu.cn/example14.htm",
    date: "2026-02-09",
    summary:
      "中南大学资源与安全工程学院AI矿业团队凭借「智能矿山自主决策系统」在国际采矿自动化大赛中获特等奖，展示了AI在传统工业领域的深度应用。",
    tags: ["university", "csu", "智能矿山", "AI应用"],
  },
  {
    id: "pn15",
    title: "西安电子科技大学雷达信号AI处理算法入选国防重点项目",
    sourceId: "xidian_news",
    sourceName: "西安电子科技大学新闻网",
    group: "university_news",
    url: "https://news.xidian.edu.cn/example15.htm",
    date: "2026-02-08",
    summary:
      "西安电子科技大学雷达信号处理国家重点实验室的AI雷达目标识别算法入选新一期国防科技重点项目，经费超过8000万元。",
    tags: ["university", "xidian", "雷达AI", "国防项目"],
  },
  {
    id: "pn16",
    title: "电子科技大学发布国内首个卫星通信大模型UESTC-SatLM",
    sourceId: "uestc_news",
    sourceName: "电子科技大学新闻网",
    group: "university_news",
    url: "https://news.uestc.edu.cn/example16.htm",
    date: "2026-02-08",
    summary:
      "电子科技大学通信抗干扰国家重点实验室发布国内首个面向卫星通信的预训练大模型UESTC-SatLM，可实现卫星信号智能调度和干扰自适应消除。",
    tags: ["university", "uestc", "卫星通信", "大模型"],
  },
  {
    id: "pn17",
    title: "国防科技大学发布军用AI伦理准则征求意见稿",
    sourceId: "nudt_news",
    sourceName: "国防科技大学新闻网",
    group: "university_news",
    url: "https://www.nudt.edu.cn/xwgg/kdyw/example17.htm",
    date: "2026-02-07",
    summary:
      "国防科技大学发布《军事人工智能伦理准则（征求意见稿）》，涵盖自主武器系统决策边界、人机协同指挥链、AI辅助作战评估等核心议题。",
    tags: ["university", "nudt", "AI伦理", "军事AI"],
  },
  {
    id: "pn18",
    title: "同济大学智能建造团队完成全球首座AI自主设计桥梁",
    sourceId: "tongji_news",
    sourceName: "同济大学新闻网",
    group: "university_news",
    url: "https://news.tongji.edu.cn/example18.htm",
    date: "2026-02-07",
    summary:
      "同济大学土木工程学院智能建造团队完成全球首座由AI自主完成结构设计的人行桥梁，从概念设计到施工图仅用72小时。",
    tags: ["university", "tongji", "智能建造", "AI应用"],
  },
  {
    id: "pn19",
    title: "山东大学获批建设国家级AI+中医药联合实验室",
    sourceId: "sdu_news",
    sourceName: "山东大学新闻网",
    group: "university_news",
    url: "https://www.view.sdu.edu.cn/sdyw/example19.htm",
    date: "2026-02-06",
    summary:
      "山东大学联合中国中医科学院获批建设「AI驱动中医药现代化」国家联合实验室，将利用大模型技术对经典方剂进行智能解析。",
    tags: ["university", "sdu", "AI for Science", "中医药"],
  },
  {
    id: "pn20",
    title: "北京师范大学发布AI教育评估报告：AI辅助教学提升学生成绩15%",
    sourceId: "bnu_news",
    sourceName: "北京师范大学新闻网",
    group: "university_news",
    url: "https://news.bnu.edu.cn/example20.htm",
    date: "2026-02-06",
    summary:
      "北京师范大学教育学部发布为期两年的跟踪研究报告，数据显示AI辅助教学在中小学阶段平均提升学生成绩15%，但也指出存在过度依赖风险。",
    tags: ["university", "bnu", "AI教育", "教育评估"],
  },
  {
    id: "pn21",
    title: "吉林大学自动驾驶冬季路测突破极寒-40度挑战",
    sourceId: "jlu_news",
    sourceName: "吉林大学新闻网",
    group: "university_news",
    url: "https://news.jlu.edu.cn/jdxw/example21.htm",
    date: "2026-02-05",
    summary:
      "吉林大学汽车工程学院自动驾驶团队在长春完成极寒-40度条件下的自动驾驶路测，验证了其自研感知融合算法在极端天气下的鲁棒性。",
    tags: ["university", "jlu", "自动驾驶", "极端环境"],
  },
  {
    id: "pn22",
    title: "厦门大学海洋AI实验室发现3种新型深海微生物",
    sourceId: "xmu_news",
    sourceName: "厦门大学新闻网",
    group: "university_news",
    url: "https://news.xmu.edu.cn/example22.htm",
    date: "2026-02-05",
    summary:
      "厦门大学海洋AI实验室利用自研深海生物智能识别系统在南海海域发现3种全新深海微生物种属，相关成果发表于Nature Microbiology。",
    tags: ["university", "xmu", "海洋AI", "AI for Science"],
  },
  {
    id: "pn23",
    title: "南方科技大学获深圳市5亿元AI研究专项基金",
    sourceId: "sustech_news",
    sourceName: "南方科技大学新闻网",
    group: "university_news",
    url: "https://newshub.sustech.edu.cn/example23.htm",
    date: "2026-02-04",
    summary:
      "深圳市科技创新委员会宣布向南方科技大学拨付5亿元AI研究专项基金，重点支持具身智能、AI for Science和AI安全三个方向。",
    tags: ["university", "sustech", "科研经费", "政策支持"],
  },
  {
    id: "pn24",
    title: "天津大学化工AI团队Nature发文：AI驱动催化剂设计新范式",
    sourceId: "tju_news",
    sourceName: "天津大学新闻网",
    group: "university_news",
    url: "https://news.tju.edu.cn/example24.htm",
    date: "2026-02-04",
    summary:
      "天津大学化工学院团队在Nature正刊发表论文，提出利用大模型指导催化剂分子设计的新方法，将新催化剂的研发周期从2年缩短至3个月。",
    tags: ["university", "tju", "AI for Science", "催化剂设计"],
  },
  {
    id: "pn25",
    title: "中山大学医学AI团队发布全球最大中文医疗大模型SYSU-MedGPT",
    sourceId: "sysu_news",
    sourceName: "中山大学新闻网",
    group: "university_news",
    url: "https://news.sysu.edu.cn/example25.htm",
    date: "2026-02-03",
    summary:
      "中山大学医学院联合附属医院发布中文医疗大模型SYSU-MedGPT，基于百万级真实病例训练，在临床诊断辅助任务上通过国家执业医师考试。",
    tags: ["university", "sysu", "医疗AI", "大模型"],
  },
  {
    id: "pn26",
    title: "中国人民大学发布AI治理与伦理年度白皮书",
    sourceId: "ruc_news",
    sourceName: "中国人民大学新闻网",
    group: "university_news",
    url: "https://news.ruc.edu.cn/example26.htm",
    date: "2026-02-03",
    summary:
      "中国人民大学高瓴人工智能学院发布《2025-2026年度AI治理与伦理白皮书》，系统分析全球AI立法进展并提出中国AI治理路线建议。",
    tags: ["university", "ruc", "AI治理", "伦理"],
  },
  // --- AI研究机构 ---
  {
    id: "pn27",
    title: "智源研究院发布FlagEval 3.0：全球首个Agent能力标准化评测体系",
    sourceId: "baai_news",
    sourceName: "北京智源人工智能研究院(BAAI)",
    group: "ai_institutes",
    url: "https://hub.baai.ac.cn/view/example27",
    date: "2026-02-15",
    summary:
      "智源研究院发布FlagEval 3.0评测平台，首次提出Agent能力标准化评测方法论，覆盖工具调用、多步推理、环境交互等6大维度，已接入30+主流Agent框架。",
    tags: ["institute", "baai", "AI Agent", "评测基准"],
  },
  {
    id: "pn28",
    title: "清华AIR发布具身智能基础模型AIR-Embodied-2",
    sourceId: "tsinghua_air",
    sourceName: "清华大学智能产业研究院(AIR)",
    group: "ai_institutes",
    url: "https://air.tsinghua.edu.cn/example28.htm",
    date: "2026-02-14",
    summary:
      "清华AIR发布第二代具身智能基础模型AIR-Embodied-2，在操作泛化和场景迁移能力上实现重大突破，已在5款商用机器人平台完成部署验证。",
    tags: ["institute", "tsinghua", "具身智能", "基础模型"],
  },
  {
    id: "pn29",
    title: "上海AI实验室「书生」系列模型开源下载突破1亿次",
    sourceId: "shlab_news",
    sourceName: "上海人工智能实验室",
    group: "ai_institutes",
    url: "https://www.shlab.org.cn/news/example29",
    date: "2026-02-13",
    summary:
      "上海人工智能实验室宣布「书生（InternLM）」系列大模型在HuggingFace和ModelScope上累计下载突破1亿次，成为国内首个达到该里程碑的开源大模型。",
    tags: ["institute", "shlab", "大模型", "开源"],
  },
  {
    id: "pn30",
    title: "鹏城实验室算力平台完成2000P规模扩容",
    sourceId: "pcl_news",
    sourceName: "鹏城实验室",
    group: "ai_institutes",
    url: "https://www.pcl.ac.cn/example30.htm",
    date: "2026-02-12",
    summary:
      "鹏城实验室宣布完成鹏城云脑III算力平台扩容，总算力达到2000P FLOPS，成为亚洲最大的AI公共算力基础设施，面向高校和科研机构开放申请。",
    tags: ["institute", "pcl", "算力基础设施", "科研平台"],
  },
  {
    id: "pn31",
    title: "中科院自动化所发布新一代视觉基础模型CAS-ViT4",
    sourceId: "ia_cas_news",
    sourceName: "中科院自动化所",
    group: "ai_institutes",
    url: "http://www.ia.cas.cn/example31.htm",
    date: "2026-02-11",
    summary:
      "中科院自动化研究所发布视觉基础模型CAS-ViT4，在ImageNet、COCO等12个主流视觉基准上取得SOTA，模型参数量仅6B但性能超越同类22B模型。",
    tags: ["institute", "cas", "计算机视觉", "基础模型"],
  },
  {
    id: "pn32",
    title: "中科院计算所「龙芯+AI」加速卡流片成功",
    sourceId: "ict_cas_news",
    sourceName: "中科院计算所",
    group: "ai_institutes",
    url: "https://www.ict.ac.cn/example32.htm",
    date: "2026-02-10",
    summary:
      "中科院计算技术研究所宣布基于龙芯架构的AI推理加速卡成功流片，单卡INT8推理性能达到同代NVIDIA产品的70%，标志国产AI算力自主可控迈出关键一步。",
    tags: ["institute", "cas", "AI芯片", "自主可控"],
  },
  {
    id: "pn33",
    title: "上海创智学院首届硕士研究生正式入学",
    sourceId: "sii_news",
    sourceName: "上海创智学院",
    group: "ai_institutes",
    url: "https://www.sii.edu.cn/example33.htm",
    date: "2026-02-09",
    summary:
      "上海创智学院迎来首届108名硕士研究生正式入学，覆盖大模型、机器人智能和AI系统三个方向，导师团队包含15名来自产业界的兼职导师。",
    tags: ["institute", "sii", "brother", "招生"],
  },
  {
    id: "pn34",
    title: "深圳河套学院与香港科技大学签署AI联合培养协议",
    sourceId: "slai_news",
    sourceName: "深圳河套学院",
    group: "ai_institutes",
    url: "https://www.slai.edu.cn/example34",
    date: "2026-02-08",
    summary:
      "深圳河套学院与香港科技大学正式签署AI方向研究生联合培养协议，每年互派20名博士生进行跨境科研合作，聚焦金融AI和智慧城市领域。",
    tags: ["institute", "slai", "brother", "国际合作"],
  },
];
