export type { Competitor as PeerInstitution } from "./intelligence";

export type PeerNewsGroup =
  | "university_news"
  | "ai_institutes"
  | "provincial"
  | "awards"
  | "aggregators";

export interface PeerNewsItem {
  id: string;
  title: string;
  sourceId: string;
  sourceName: string;
  group: PeerNewsGroup;
  url: string;
  date: string;
  displayDate?: string;
  summary: string;
  tags: string[];
  thumbnail?: string | null;
  isNew?: boolean;
  content?: string | null;
  images?: { src: string; alt: string | null }[];
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
  sourceId: string;
  sourceName: string;
  sourceUrl?: string | null;
  type: "论文" | "专利" | "获奖";
  influence: "高" | "中" | "低";
  date: string;
  field: string;
  authors: string;
  aiAnalysis: string;
  detail: string;
  content?: string | null;
  images?: { src: string; alt: string | null }[];
}

// ── API response types ────────────────────────────────────

export interface GroupStats {
  group: string;
  group_name: string;
  total_articles: number;
  new_today: number;
  source_count: number;
}

export interface UniversityOverviewResponse {
  generated_at: string;
  total_articles: number;
  new_today: number;
  active_source_count: number;
  total_source_count: number;
  groups: GroupStats[];
  latest_crawl_at: string | null;
}

export interface UniversityFeedItem {
  id: string;
  title: string;
  url: string;
  published_at: string | null;
  source_id: string;
  source_name: string;
  group: string | null;
  tags: string[];
  has_content: boolean;
  thumbnail: string | null;
  is_new: boolean;
  content: string | null;
  images: { src: string; alt: string | null }[];
}

export interface UniversityFeedResponse {
  generated_at: string;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: UniversityFeedItem[];
}

export interface UniversityArticleDetailResponse {
  id: string;
  title: string;
  url: string;
  published_at: string | null;
  source_id: string;
  source_name: string;
  group: string | null;
  tags: string[];
  content: string | null;
  images: { src: string; alt: string | null }[];
  is_new: boolean;
}

export interface UniversitySourceItem {
  source_id: string;
  source_name: string;
  group: string;
  url: string;
  item_count: number;
  new_item_count: number;
  last_crawled_at: string | null;
  is_enabled: boolean;
}

export interface UniversitySourcesResponse {
  generated_at: string;
  total_sources: number;
  enabled_sources: number;
  items: UniversitySourceItem[];
}

// ── Research outputs (from processed data) ───────────────

export interface ResearchOutputApiItem {
  id: string;
  title: string;
  url: string;
  date: string;
  source_id: string;
  source_name: string;
  group: string | null;
  institution: string;
  type: "论文" | "专利" | "获奖";
  influence: "高" | "中" | "低";
  field: string;
  authors: string;
  aiAnalysis: string;
  detail: string;
  matchScore: number;
  content: string | null;
  images: { src: string; alt: string | null }[];
}

export interface ResearchOutputsResponse {
  generated_at: string;
  item_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  type_stats: { 论文: number; 专利: number; 获奖: number };
  items: ResearchOutputApiItem[];
}
