export interface TrendingPost {
  id: string;
  title: string;
  platform: "X" | "YouTube" | "ArXiv" | "GitHub" | "微信公众号" | "知乎";
  author: string;
  date: string;
  sourceUrl: string;
  summary: string;
  engagement?: string;
}

export interface TopicNews {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  type: "投融资" | "新产品" | "政策" | "收购" | "合作";
  date: string;
  impact: "重大" | "较大" | "一般";
  summary: string;
  aiAnalysis: string;
  relevance: string;
}

export interface KOLVoice {
  id: string;
  name: string;
  affiliation: string;
  influence: "极高" | "高" | "中";
  statement: string;
  platform: "X" | "会议" | "论文" | "博客" | "播客";
  sourceUrl: string;
  date: string;
}

export interface TechTopic {
  id: string;
  topic: string;
  description: string;
  tags: string[];

  // Trend metrics
  heatTrend: "surging" | "rising" | "stable" | "declining";
  heatLabel: string;
  ourStatus: "deployed" | "weak" | "none";
  ourStatusLabel: string;
  gapLevel: "high" | "medium" | "low";

  // Aggregated signals
  trendingKeywords: {
    keyword: string;
    postCount: number;
    trend: "surging" | "rising" | "stable";
    posts: TrendingPost[];
  }[];
  relatedNews: TopicNews[];
  kolVoices: KOLVoice[];

  // AI synthesis
  aiSummary: string;
  aiInsight: string;
  aiRiskAssessment?: string;
  memoSuggestion?: string;

  // Stats
  totalSignals: number;
  signalsSinceLastWeek: number;
  lastUpdated: string;
}

export interface Opportunity {
  id: string;
  name: string;
  type: "合作" | "会议" | "内参";
  source: string;
  priority: "紧急" | "高" | "中" | "低";
  deadline: string;
  summary: string;
  aiAssessment: string;
  actionSuggestion: string;
}
