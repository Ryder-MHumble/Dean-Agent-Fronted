export type IntelligenceAccessPage =
  | "home"
  | "policy-intel"
  | "tech-frontier"
  | "papers"
  | "talent-radar"
  | "university-eco"
  | "sentiment"
  | "academic-achievements"
  | "internal-experts";

export interface IntelligenceAccessConfig {
  title: string;
  endpoints: string[];
  extractionGoal: string;
}

export const DEFAULT_API_BASE_URL = "http://10.1.132.21:8001";

const accessConfigByPage: Record<IntelligenceAccessPage, IntelligenceAccessConfig> = {
  home: {
    title: "AI 日报",
    endpoints: ["/api/intel/daily-briefing/report"],
    extractionGoal:
      "基于当天的政策、人事、科技前沿和高校生态数据，生成可执行的情报日报。",
  },
  "policy-intel": {
    title: "政策情报",
    endpoints: ["/api/intel/policy/feed?limit=20&offset=0"],
    extractionGoal:
      "识别政策机会、适配场景、申报窗口、潜在影响和需要跟进的事项。",
  },
  "tech-frontier": {
    title: "社媒情报",
    endpoints: [
      "/api/social-posts?sort_by=published_at&order=desc&page=1&page_size=200&platform=x",
      "/api/social-posts?sort_by=published_at&order=desc&page=1&page_size=200&platform=wechat_mp&source_category=%E5%89%8D%E6%B2%BF%E8%AE%A4%E7%9F%A5",
    ],
    extractionGoal:
      "综合 X 平台和微信公众号的前沿认知内容，识别技术趋势、代表机构、关键人物和可转化为科研布局的线索。",
  },
  papers: {
    title: "前沿论文",
    endpoints: [
      "/api/papers?page=1&page_size=20&sort_by=publication_date&order=desc",
    ],
    extractionGoal:
      "提炼最新顶刊、顶会和预印本论文的研究问题、核心方法、关键结论和潜在科研价值。",
  },
  "talent-radar": {
    title: "外部领导",
    endpoints: ["/api/leaders?domain=government&status=current&limit=20&offset=0"],
    extractionGoal:
      "提炼重点领导的现任职务、机构关系、最近动态、可触达机会和背景风险。",
  },
  "university-eco": {
    title: "高校生态",
    endpoints: [
      "/api/intel/university/feed?page=1&page_size=20",
      "/api/intel/university/overview",
      "/api/intel/university/sources",
      "/api/intel/university/research?page=1&page_size=20",
    ],
    extractionGoal:
      "分析高校动态、科研成果、机构合作信号、同行布局和可参考的资源机会。",
  },
  sentiment: {
    title: "两院舆情",
    endpoints: [
      "/api/sentiment/overview",
      "/api/sentiment/feed?sort_by=publish_time&sort_order=desc&page=1&page_size=15",
    ],
    extractionGoal:
      "汇总舆情热点、情绪变化、传播路径、风险等级和建议回应策略。",
  },
  "academic-achievements": {
    title: "两院学术成果",
    endpoints: [
      "/api/zgca-achievements/?page=1&page_size=20&sort_by=venue_year&sort_order=desc",
    ],
    extractionGoal:
      "汇总两院学术成果、作者信息、发表动态和可用于成果跟踪或合作对接的线索。",
  },
  "internal-experts": {
    title: "两院专家库",
    endpoints: ["/api/scholars?limit=20&offset=0"],
    extractionGoal:
      "基于专家公开信息，梳理机构、职称、研究方向、学科分布和适合项目评审或合作对接的人选。",
  },
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function getPublicApiBaseUrl() {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
  );
}

export function getIntelligenceAccessConfig(
  page: string,
): IntelligenceAccessConfig {
  return (
    accessConfigByPage[page as IntelligenceAccessPage] ?? accessConfigByPage.home
  );
}

export function buildAccessUrl(
  endpoint: string,
  baseUrl = getPublicApiBaseUrl(),
) {
  return `${normalizeBaseUrl(baseUrl)}${endpoint}`;
}

export function buildAccessCurl(
  config: IntelligenceAccessConfig,
  baseUrl = getPublicApiBaseUrl(),
) {
  return config.endpoints
    .map(
      (endpoint) =>
        `curl -sS '${buildAccessUrl(endpoint, baseUrl)}' -H 'accept: application/json'`,
    )
    .join("\n");
}

export function buildAccessPrompt(
  config: IntelligenceAccessConfig,
  baseUrl = getPublicApiBaseUrl(),
) {
  const urls = config.endpoints.map((endpoint) => buildAccessUrl(endpoint, baseUrl));
  return [
    `请使用情报引擎 skill 对「${config.title}」执行专项提取。`,
    "数据接口：",
    ...urls.map((url) => `- ${url}`),
    `任务目标：${config.extractionGoal}`,
    "执行要求：先拉取并核验 JSON 字段与最新记录，再完成跨接口去重、关联和优先级判断。",
    "输出：给出关键发现、证据来源、风险或机会等级、建议动作；同时产出可复用的日报或专项报告模板。接口不可达时，说明失败原因和所需配置。",
  ].join("\n");
}
