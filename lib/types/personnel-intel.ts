/** Personnel intelligence types — maps to backend enriched-feed API */

export type PersonnelImportance = "紧急" | "重要" | "关注" | "一般";
export type PersonnelGroup = "action" | "watch";
export type PersonnelAction = "任命" | "免去" | "动态";

export interface PersonnelChangeItem {
  id: string;
  name: string;
  action: PersonnelAction;
  position: string;
  department: string | null;
  date: string;
  source: string;
  source_name?: string | null;
  sourceUrl: string | null;
  sourceTitle?: string | null;
  sourceContent?: string | null;
  relevance: number;
  importance: PersonnelImportance;
  group: PersonnelGroup;
  note: string | null;
  actionSuggestion: string | null;
  background: string | null;
  signals: string[];
  aiInsight: string | null;
}

export interface PersonnelEnrichedFeedResponse {
  generated_at: string | null;
  total_count: number;
  action_count: number;
  watch_count: number;
  items: PersonnelChangeItem[];
}

export interface PersonnelEnrichedStatsResponse {
  total_changes: number;
  action_count: number;
  watch_count: number;
  by_department: Record<string, number>;
  by_action: Record<string, number>;
  high_relevance_count: number;
  generated_at: string | null;
}
