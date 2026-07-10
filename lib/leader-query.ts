export type LeaderDomain = "government" | "university" | "mixed";
export type LeaderStatus = "current" | "past" | "all";

export interface LeaderQuery {
  keyword?: string;
  name?: string;
  organization?: string;
  domain?: LeaderDomain;
  status?: LeaderStatus;
  limit?: number;
  offset?: number;
}

function setTrimmed(sp: URLSearchParams, key: string, value?: string) {
  const trimmed = value?.trim();
  if (trimmed) sp.set(key, trimmed);
}

export function buildLeaderQueryParams(query: LeaderQuery = {}) {
  const sp = new URLSearchParams();

  setTrimmed(sp, "keyword", query.keyword);
  setTrimmed(sp, "name", query.name);
  setTrimmed(sp, "organization", query.organization);
  if (query.domain) sp.set("domain", query.domain);
  if (query.status) sp.set("status", query.status);
  sp.set("limit", String(Math.min(200, Math.max(1, query.limit ?? 50))));
  sp.set("offset", String(Math.max(0, query.offset ?? 0)));

  return sp;
}
