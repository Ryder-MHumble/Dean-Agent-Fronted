export type { Competitor as PeerInstitution } from "./intelligence";

export type PeerNewsGroup = "university_news" | "ai_institutes";

export interface PeerNewsItem {
  id: string;
  title: string;
  sourceId: string;
  sourceName: string;
  group: PeerNewsGroup;
  url: string;
  date: string;
  summary: string;
  tags: string[];
}

export interface PersonnelChange {
  id: string;
  person: string;
  fromPosition: string;
  toPosition: string;
  institution: string;
  type: "任命" | "离职" | "调动";
  impact: "重大" | "较大" | "一般";
  date: string;
  background: string;
  aiAnalysis: string;
  detail: string;
}

export interface ResearchOutput {
  id: string;
  title: string;
  institution: string;
  type: "论文" | "专利" | "获奖";
  influence: "高" | "中" | "低";
  date: string;
  field: string;
  authors: string;
  aiAnalysis: string;
  detail: string;
}
