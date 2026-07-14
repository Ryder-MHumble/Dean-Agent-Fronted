export type PaperCategory =
  | "all"
  | "top-journal"
  | "top-conference"
  | "arxiv"
  | "achievements";

export interface PaperSource {
  source_id?: string | null;
  source_type?: string | null;
  name?: string | null;
  url?: string | null;
}

export interface PaperAuthor {
  name?: string | null;
  author_name?: string | null;
}

export interface PaperRecord {
  paper_id: string;
  title: string;
  abstract?: string | null;
  authors?: Array<string | PaperAuthor> | null;
  venue?: string | null;
  publication_date?: string | null;
  year?: number | string | null;
  url?: string | null;
  source_url?: string | null;
  doi?: string | null;
  arxiv_id?: string | null;
  source?: PaperSource | null;
  category: PaperCategory;
  authorsText: string;
  venueText: string;
}

export interface PaperListResponse {
  items: PaperRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaperQuery {
  category?: PaperCategory;
  sourceId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}
