export type { PolicyItem } from "./intelligence";

export interface SpeechItem {
  id: string;
  leader: string;
  title: string;
  occasion: string;
  date: string;
  keywords: string[];
  relevance: number;
  status: "high" | "medium" | "low";
  summary: string;
  signals: string[];
  aiAnalysis: string;
  sourceUrl?: string;
}

// --- Unified policy feed types ---

export type PolicyFeedCategory =
  | "国家政策"
  | "北京政策"
  | "领导讲话"
  | "政策机会";

export type PolicyFeedImportance = "紧急" | "重要" | "关注" | "一般";

export interface PolicyFeedItem {
  id: string;
  title: string;
  summary: string;
  category: PolicyFeedCategory;
  importance: PolicyFeedImportance;
  date: string;
  source: string;
  tags: string[];
  // Policy opportunity fields
  matchScore?: number;
  funding?: string;
  daysLeft?: number;
  // Speech fields
  leader?: string;
  relevance?: number;
  signals?: string[];
  // Shared
  sourceUrl?: string;
  aiInsight?: string;
  detail?: string;
}
