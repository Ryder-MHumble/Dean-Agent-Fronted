export type AchievementType = "paper" | "patent" | "open_source" | "other";
export type AchievementClaimStatus = "confirmed" | "auto_matched";

export interface AchievementMember {
  name?: string | null;
  scholar_name_cn?: string | null;
  author_name?: string | null;
  role?: string | null;
  scholar_id?: string | null;
}

export interface AchievementSource {
  system?: string | null;
  url?: string | null;
  source_name?: string | null;
  source_table?: string | null;
  source_type?: string | null;
  project_name?: string | null;
  project_leader?: string | null;
  student_authors?: string | null;
  patent_no?: string | null;
  patent_type?: string | null;
  [key: string]: unknown;
}

export interface AchievementRecord {
  id: number;
  dedup_key: string;
  achievement_type: AchievementType;
  title: string;
  normalized_title?: string | null;
  authors: string[];
  zgca_members: AchievementMember[];
  venue?: string | null;
  venue_year?: number | null;
  publication_date?: string | null;
  doi?: string | null;
  arxiv_id?: string | null;
  paper_id?: string | null;
  detail_url?: string | null;
  pdf_url?: string | null;
  sources: AchievementSource[];
  claim_status: AchievementClaimStatus;
  project_batch?: string | null;
  project_name?: string | null;
  project_leader?: string | null;
  paper_status?: string | null;
  notes?: string | null;
  abstract?: string | null;
  source_system?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AchievementListResponse {
  items: AchievementRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AchievementStatsResponse {
  total: number;
  by_type: Array<{ achievement_type: AchievementType; count: number }>;
  by_claim_status: Array<{
    claim_status: AchievementClaimStatus;
    count: number;
  }>;
  by_year: Array<{ venue_year: number; count: number }>;
  by_source_system: Array<{ source_system: string; count: number }>;
  multi_source_distribution: Array<{ source_count: number; count: number }>;
}

export interface AchievementQuery {
  type?: AchievementType;
  claimStatus?: AchievementClaimStatus;
  year?: number;
  sourceSystem?: string;
  projectName?: string;
  hasMembers?: boolean;
  keyword?: string;
  page?: number;
  pageSize?: number;
}
