export type { TechTrend } from "./intelligence";

export interface IndustryNews {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  type: "投融资" | "新产品" | "政策" | "收购";
  date: string;
  impact: "重大" | "较大" | "一般";
  summary: string;
  aiAnalysis: string;
  relevance: string;
}

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

export interface TrendingKeyword {
  id: string;
  keyword: string;
  postCount: number;
  trend: "surging" | "rising" | "stable";
  tags: string[];
  posts: TrendingPost[];
}

export interface KOL {
  id: string;
  name: string;
  affiliation: string;
  hIndex: number;
  field: string;
  recentActivity: string;
  sourceUrl: string;
  influence: "极高" | "高" | "中";
  summary: string;
  aiAnalysis: string;
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
