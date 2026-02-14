export type PersonnelNewsCategory = "政府人事" | "高校人事" | "人才要闻";
export type ImportanceLevel = "重要" | "关注" | "一般";

/** 统一的人事动态新闻条目 */
export interface PersonnelNewsItem {
  id: string;
  title: string;
  summary: string;
  category: PersonnelNewsCategory;
  importance: ImportanceLevel;
  date: string;
  source: string;
  sourceUrl?: string;
  people: string[];
  organizations: string[];
  personProfile?: PersonProfile;
  relevanceNote?: string;
}

/** 人物信息卡片 */
export interface PersonProfile {
  name: string;
  title: string;
  organization: string;
  previousTitle?: string;
  previousOrganization?: string;
  field?: string;
  background?: string;
}
