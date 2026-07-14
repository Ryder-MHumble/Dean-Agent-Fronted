import type { LeaderDomain } from "@/lib/leader-query";

export interface LeaderEvent {
  name?: string;
  action?: string;
  position?: string;
  organization?: string;
  event_date?: string;
  source_url?: string;
  source_title?: string;
  raw_sentence?: string;
}

export interface LeaderExperience {
  position?: string;
  organization?: string;
  bio?: string;
  start_date?: string | null;
  end_date?: string | null;
  source_url?: string;
  end_source_url?: string;
}

export interface LeaderSourceRef {
  event_date?: string;
  source_url?: string;
  profile_url?: string;
  end_source_url?: string;
  source_title?: string;
}

export interface LeaderDetails {
  text?: string;
  summary?: string;
  media?: {
    avatar_url?: string;
  };
  quality?: {
    needs_review?: boolean;
  };
  [key: string]: unknown;
}

export interface LeaderAvatarRecord {
  leaderId: string;
  name: string;
  avatarUrl: string | null;
  sourceUrl: string | null;
  status: "found" | "not_found" | "search_error";
  sourceType: "backend" | "scholar" | "wikimedia" | "official" | null;
  attemptedSourceUrls: string[];
  rejectedCandidates: number;
  error?: string;
}

export interface LeaderProfile {
  id: string;
  name: string;
  gender?: string | null;
  leader_domain: LeaderDomain | string;
  current_positions?: string;
  current_orgs?: string;
  appointment_events?: LeaderEvent[];
  experiences?: LeaderExperience[];
  source_refs?: LeaderSourceRef[];
  leader_details?: LeaderDetails;
  latest_event_date?: string | null;
  latest_source_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LeaderProfileListResponse {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  next_offset?: number | null;
  items: LeaderProfile[];
}
