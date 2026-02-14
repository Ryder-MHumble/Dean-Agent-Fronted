import type {
  PersonnelNewsItem,
  PersonProfile,
} from "@/lib/types/talent-radar";

/** 可搜索的人物 Profile 库 */
export const mockPersonProfiles: PersonProfile[] = [
  {
    name: "龚旗煌",
    title: "校长",
    organization: "北京大学",
    field: "非线性光学",
    background:
      "中国科学院院士，光学与光子学领域专家。2023年4月起任北京大学校长。",
  },
  {
    name: "李路明",
    title: "校长",
    organization: "清华大学",
    field: "神经工程",
    background:
      "中国科学院院士，脑机接口与神经调控领域专家。2024年9月起任清华大学校长。",
  },
  {
    name: "杜江峰",
    title: "校长",
    organization: "浙江大学",
    field: "量子物理",
    background:
      "中国科学院院士，量子计算与量子精密测量专家。2023年7月起任浙江大学校长。",
  },
  {
    name: "丁奎岭",
    title: "校长",
    organization: "上海交通大学",
    field: "有机化学",
    background:
      "中国科学院院士，手性催化与绿色合成领域专家。2022年11月起任上海交通大学校长。",
  },
  {
    name: "吴岩",
    title: "科技部党组成员、副部长",
    organization: "科技部",
    previousTitle: "副部长",
    previousOrganization: "教育部",
    field: "高等教育管理",
    background:
      "长期主管高等教育工作，推动新工科、新文科建设，主持高校学科评估改革。",
  },
  {
    name: "张兆田",
    title: "信息科学部主任",
    organization: "国家自然科学基金委",
    previousTitle: "副主任",
    previousOrganization: "国家自然科学基金委信息科学部",
    field: "信号处理与模式识别",
    background: "长期从事智能信息处理研究，主持多项国家级科研项目。",
  },
  {
    name: "张亚勤",
    title: "人工智能研究院院长",
    organization: "清华大学",
    previousTitle: "智能产业研究院院长",
    previousOrganization: "清华大学",
    field: "人工智能、多媒体计算",
    background:
      "澳大利亚国家工程院外籍院士，IEEE Fellow。曾任百度总裁、微软亚洲研究院院长。",
  },
  {
    name: "朱松纯",
    title: "人工智能研究院院长",
    organization: "北京大学",
    field: "认知AI、通用人工智能",
    background:
      "讲席教授，曾任UCLA统计系与计算机系教授20余年。Marr Prize获得者，ACM Fellow。",
  },
  {
    name: "田永鸿",
    title: "教授",
    organization: "北京大学",
    field: "视频编码与视觉智能",
    background:
      "2025年当选ACM Fellow，在视频编码和视觉智能方面有突出贡献。IEEE Fellow。",
  },
  {
    name: "许强",
    title: "主任",
    organization: "北京市发改委",
    previousTitle: "主任",
    previousOrganization: "北京市科委",
    field: "科技政策管理",
    background:
      "在科委期间推动多项AI和高新技术产业扶持政策，建立中关村AI产业集群。",
  },
];

/** 人事动态新闻 Feed */
export const mockPersonnelNews: PersonnelNewsItem[] = [
  // ===== 今天 =====
  {
    id: "pn1",
    title: "教育部副部长吴岩调任科技部党组成员",
    summary:
      "教育部副部长吴岩调任科技部党组成员、副部长。吴岩此前主管高等教育和学科建设工作，此次调动被视为科教融合的重要人事安排。",
    category: "政府人事",
    importance: "重要",
    date: "2026-02-14",
    source: "新华社",
    people: ["吴岩"],
    organizations: ["教育部", "科技部"],
    personProfile: {
      name: "吴岩",
      title: "科技部党组成员、副部长",
      organization: "科技部",
      previousTitle: "副部长",
      previousOrganization: "教育部",
      field: "高等教育管理",
      background:
        "长期主管高等教育工作，推动新工科、新文科建设，主持高校学科评估改革。",
    },
    relevanceNote:
      "吴岩此前负责高校学科评估和基金分配，其调任可能影响科技部对高校AI项目的资助方向。",
  },
  {
    id: "pn2",
    title: "清华大学人工智能研究院院长换帅：张亚勤接任",
    summary:
      "清华大学宣布张亚勤教授正式就任人工智能研究院院长，接替前任院长。张亚勤此前担任百度总裁，并在清华智能产业研究院担任院长。",
    category: "高校人事",
    importance: "重要",
    date: "2026-02-14",
    source: "清华新闻网",
    people: ["张亚勤"],
    organizations: ["清华大学", "清华大学人工智能研究院"],
    personProfile: {
      name: "张亚勤",
      title: "人工智能研究院院长",
      organization: "清华大学",
      previousTitle: "智能产业研究院院长",
      previousOrganization: "清华大学",
      field: "人工智能、多媒体计算",
      background:
        "澳大利亚国家工程院外籍院士，IEEE Fellow。曾任百度总裁、微软亚洲研究院院长。",
    },
    relevanceNote:
      "张亚勤工业界资源丰富，其就任可能改变清华AI研究院的产学研合作模式，需关注对人才竞争的影响。",
  },
  {
    id: "pn3",
    title: "MIT华人学者陈明宇获聘北京大学博雅讲席教授",
    summary:
      "MIT CSAIL资深研究员陈明宇正式接受北京大学聘书，将全职回国担任博雅讲席教授，研究方向为具身智能与机器人学习。",
    category: "人才要闻",
    importance: "重要",
    date: "2026-02-14",
    source: "北京大学新闻网",
    people: ["陈明宇"],
    organizations: ["MIT", "北京大学"],
    personProfile: {
      name: "陈明宇",
      title: "博雅讲席教授",
      organization: "北京大学",
      previousTitle: "资深研究员",
      previousOrganization: "MIT CSAIL",
      field: "具身智能、机器人学习",
      background:
        "ICRA/RSS顶会论文50余篇，Google Scholar引用量12000+。IEEE Fellow。",
    },
    relevanceNote:
      "具身智能方向与我院重点发展方向高度重合，需关注北大在此方向的人才布局。",
  },

  // ===== 本周 =====
  {
    id: "pn4",
    title: "北京市科委主任许强转任市发改委主任",
    summary:
      "北京市科学技术委员会主任许强调任北京市发展和改革委员会主任。许强在科委期间推动了多项AI和高新技术产业扶持政策。",
    category: "政府人事",
    importance: "关注",
    date: "2026-02-12",
    source: "北京日报",
    people: ["许强"],
    organizations: ["北京市科委", "北京市发改委"],
    personProfile: {
      name: "许强",
      title: "主任",
      organization: "北京市发改委",
      previousTitle: "主任",
      previousOrganization: "北京市科委",
      field: "科技政策管理",
    },
    relevanceNote:
      "许强在科委期间是我院多项市级项目的支持者，其调任后需关注新任科委主任的政策倾向。",
  },
  {
    id: "pn5",
    title: "ACM公布2025年度Fellow名单，3位华人学者入选",
    summary:
      "ACM公布2025年度Fellow名单，北京大学田永鸿、上海交通大学卢策吾、香港中文大学贾佳亚三位华人学者入选。田永鸿因在视频编码与视觉智能方面的贡献当选。",
    category: "人才要闻",
    importance: "关注",
    date: "2026-02-11",
    source: "ACM官网",
    people: ["田永鸿", "卢策吾", "贾佳亚"],
    organizations: ["北京大学", "上海交通大学", "香港中文大学", "ACM"],
    relevanceNote:
      "田永鸿教授与我院在视觉智能方向有合作基础，可借此契机深化合作。",
  },
  {
    id: "pn6",
    title: "浙江大学副校长吴朝晖调任中国科学院副院长",
    summary:
      "原浙江大学副校长、中国科学院院士吴朝晖调任中国科学院副院长，分管数理与信息科学领域。",
    category: "高校人事",
    importance: "关注",
    date: "2026-02-11",
    source: "中国科学院官网",
    people: ["吴朝晖"],
    organizations: ["浙江大学", "中国科学院"],
    personProfile: {
      name: "吴朝晖",
      title: "副院长",
      organization: "中国科学院",
      previousTitle: "副校长",
      previousOrganization: "浙江大学",
      field: "人工智能、脑机接口",
      background:
        "中国科学院院士，曾任浙大校长（2015-2021），在脑机智能和跨媒体计算领域有重要贡献。",
    },
    relevanceNote: "吴朝晖分管信息科学，可能影响中科院AI相关项目的资助布局。",
  },
  {
    id: "pn7",
    title: "上海交通大学人工智能学院成立，卢策吾任首任院长",
    summary:
      "上海交通大学正式成立人工智能学院，从电子信息与电气工程学院独立。计算机视觉与机器人学者卢策吾教授担任首任院长。",
    category: "高校人事",
    importance: "关注",
    date: "2026-02-10",
    source: "上海交通大学新闻网",
    people: ["卢策吾"],
    organizations: ["上海交通大学", "上海交通大学人工智能学院"],
    personProfile: {
      name: "卢策吾",
      title: "人工智能学院院长",
      organization: "上海交通大学",
      field: "计算机视觉、机器人",
      background:
        "上海交通大学教授，2025年ACM Fellow。在3D视觉和人体姿态估计方面有重要贡献。",
    },
  },
  {
    id: "pn8",
    title: "国家自然科学基金委信息科学部主任换任",
    summary:
      "国家自然科学基金委员会信息科学部主任郝占军到龄卸任，新任主任由原副主任张兆田接任。张兆田长期从事智能信息处理研究。",
    category: "政府人事",
    importance: "重要",
    date: "2026-02-10",
    source: "基金委官网",
    people: ["郝占军", "张兆田"],
    organizations: ["国家自然科学基金委"],
    personProfile: {
      name: "张兆田",
      title: "信息科学部主任",
      organization: "国家自然科学基金委",
      previousTitle: "副主任",
      previousOrganization: "国家自然科学基金委信息科学部",
      field: "信号处理与模式识别",
    },
    relevanceNote:
      "信息科学部主任直接影响AI相关基金项目的评审方向和资助重点，需持续关注新主任的学术倾向。",
  },

  // ===== 更早 =====
  {
    id: "pn9",
    title: "科技部副部长张广军兼任国家重点研发计划AI专项负责人",
    summary:
      "科技部副部长张广军被任命为国家重点研发计划「新一代人工智能」重大专项负责人，统筹协调国家AI研发战略布局。",
    category: "政府人事",
    importance: "重要",
    date: "2026-02-06",
    source: "科技部官网",
    people: ["张广军"],
    organizations: ["科技部"],
    relevanceNote:
      "张广军分管AI专项，我院在研的3个国家重点研发项目均在其统筹范围内。",
  },
  {
    id: "pn10",
    title: "DeepMind华人研究员王浩然宣布全职加入中科院自动化所",
    summary:
      "Google DeepMind高级研究科学家王浩然宣布辞职回国，将全职加入中国科学院自动化研究所，担任研究员。王浩然曾参与Gemini项目研发。",
    category: "人才要闻",
    importance: "关注",
    date: "2026-02-05",
    source: "中科院自动化所官网",
    people: ["王浩然"],
    organizations: ["Google DeepMind", "中科院自动化所"],
    personProfile: {
      name: "王浩然",
      title: "研究员",
      organization: "中科院自动化所",
      previousTitle: "高级研究科学家",
      previousOrganization: "Google DeepMind",
      field: "多模态大模型",
      background:
        "参与Gemini项目研发，Nature Machine Intelligence发表3篇论文。在多模态学习领域有重要贡献。",
    },
    relevanceNote:
      "多模态方向与我院研究布局相关，中科院在此方向增加了有力竞争者。",
  },
  {
    id: "pn11",
    title: "中国工程院增选院士名单公布，AI领域2人当选",
    summary:
      "中国工程院2025年院士增选结果揭晓，AI领域清华大学孙茂松教授和华为诺亚方舟实验室主任田奇当选。孙茂松在自然语言处理方面有突出贡献。",
    category: "人才要闻",
    importance: "重要",
    date: "2026-02-03",
    source: "中国工程院官网",
    people: ["孙茂松", "田奇"],
    organizations: ["中国工程院", "清华大学", "华为"],
    relevanceNote:
      "孙茂松教授与我院NLP团队有学术交流，其当选院士后学术影响力进一步提升。",
  },
  {
    id: "pn12",
    title: "北京大学副校长孙庆伟兼任人文学部主任",
    summary:
      "北京大学副校长孙庆伟被任命兼任人文学部主任，主管文科建设与人文社科领域学科发展。此前该职位由张平文院士兼任。",
    category: "高校人事",
    importance: "一般",
    date: "2026-02-01",
    source: "北京大学新闻网",
    people: ["孙庆伟", "张平文"],
    organizations: ["北京大学"],
  },
  {
    id: "pn13",
    title: "CSRankings 2025年度AI领域排名更新：清华北大位列前十",
    summary:
      "CSRankings发布2025年度AI领域全球高校排名，清华大学排名第3，北京大学排名第8，上海交通大学首次进入前15。排名基于顶会论文发表数据。",
    category: "人才要闻",
    importance: "关注",
    date: "2026-01-28",
    source: "CSRankings",
    people: [],
    organizations: ["清华大学", "北京大学", "上海交通大学"],
    relevanceNote:
      "我院排名较去年上升2位，但与清华差距仍大。需关注上海交大的快速上升势头。",
  },
  {
    id: "pn14",
    title: "发改委高技术产业司副司长任命公示",
    summary:
      "国家发改委公示高技术产业司副司长人选，原中关村管委会创新处处长孙立明拟任。孙立明此前负责AI产业园区规划和创新政策制定。",
    category: "政府人事",
    importance: "关注",
    date: "2026-01-25",
    source: "国家发改委官网",
    people: ["孙立明"],
    organizations: ["国家发改委", "中关村管委会"],
    relevanceNote:
      "高技术产业司管辖AI产业发展基金和产业园区政策，与我院产学研合作密切相关。",
  },
  {
    id: "pn15",
    title: "斯坦福HAI年度AI指数报告发布，中国AI人才回流加速",
    summary:
      "斯坦福HAI发布2025年度AI Index Report，报告指出中国AI领域高端人才回流比例较去年提升28%，其中具身智能和大模型方向回流最为明显。",
    category: "人才要闻",
    importance: "关注",
    date: "2026-01-20",
    source: "Stanford HAI",
    people: [],
    organizations: ["Stanford HAI"],
    relevanceNote:
      "人才回流加速对我院引才工作是利好信号，具身智能和大模型为我院重点方向。",
  },
];
