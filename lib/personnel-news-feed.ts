export interface PersonnelNewsFeedQuery {
  group?: string;
  importance?: string;
  minRelevance?: number;
  keyword?: string;
  sourceIds?: string[];
  limit?: number;
  offset?: number;
}

export const OFFICIAL_PERSONNEL_NEWS_SOURCE_IDS = [
  "mohrss_rsrm",
  "cas_renshi",
  "moe_renshi",
  "moe_renshi_si",
];

export function buildPersonnelNewsFeedQuery(
  query: PersonnelNewsFeedQuery = {},
): PersonnelNewsFeedQuery {
  const keyword = query.keyword?.trim();

  return {
    ...query,
    keyword: keyword || undefined,
    sourceIds: query.sourceIds?.length ? query.sourceIds : undefined,
    limit:
      query.limit == null
        ? undefined
        : Math.min(200, Math.max(1, query.limit)),
    offset:
      query.offset == null
        ? undefined
        : Math.max(0, query.offset),
  };
}
