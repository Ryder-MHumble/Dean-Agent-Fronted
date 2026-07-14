export type PaperCategory =
  | "all"
  | "top-journal"
  | "top-conference"
  | "arxiv"
  | "achievements";

export interface PaperSource {
  source_id?: string | null;
  type?: string | null;
  source_type?: string | null;
  name?: string | null;
  detail_url?: string | null;
  pdf_url?: string | null;
  url?: string | null;
}

export interface PaperAuthor {
  name?: string | null;
  author_name?: string | null;
}

export interface PaperApiRecord {
  paper_id?: string | null;
  id?: string | null;
  title?: string | null;
  abstract?: string | null;
  authors?: Array<string | PaperAuthor> | null;
  venue?: string | null;
  venue_year?: number | string | null;
  publication_date?: string | null;
  year?: number | string | null;
  detail_url?: string | null;
  pdf_url?: string | null;
  url?: string | null;
  source_url?: string | null;
  doi?: string | null;
  arxiv_id?: string | null;
  source?: PaperSource | null;
  source_type?: string | null;
}

export interface PaperRecord extends PaperApiRecord {
  paper_id: string;
  title: string;
  year?: number | string | null;
  sourceUrl?: string | null;
  pdfUrl?: string | null;
  category: PaperCategory;
  authorsText: string;
  venueText: string;
}

export interface PaperListResponse {
  items: PaperApiRecord[];
  total: number;
  page: number;
  page_size: number;
}

export interface PaperQuery {
  category?: PaperCategory;
  sourceId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}
