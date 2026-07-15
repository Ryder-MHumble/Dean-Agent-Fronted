import type {
  AchievementQuery,
  AchievementRecord,
  AchievementSource,
} from "./types/achievements.ts";

const achievementSourceLabels: Record<string, string> = {
  student_publications: "学生成果",
  dingtalk_confirmed: "钉钉确认",
  papers_affiliation: "论文成员匹配",
  scholar_patents: "学者专利",
};

export function buildAchievementQueryParams(
  query: AchievementQuery = {},
): URLSearchParams {
  const params = new URLSearchParams();
  if (query.type) params.set("achievement_type", query.type);
  if (query.claimStatus) params.set("claim_status", query.claimStatus);
  if (query.year) params.set("venue_year", String(query.year));
  if (query.sourceSystem?.trim()) {
    params.set("source_system", query.sourceSystem.trim());
  }
  if (query.projectName?.trim()) {
    params.set("project_name", query.projectName.trim());
  }
  if (query.hasMembers !== undefined) {
    params.set("has_members", String(query.hasMembers));
  }
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  params.set("page", String(Math.max(1, query.page ?? 1)));
  params.set(
    "page_size",
    String(Math.min(100, Math.max(1, query.pageSize ?? 20))),
  );
  params.set("sort_by", "venue_year");
  params.set("sort_order", "desc");
  return params;
}

export function getAchievementMemberNames(
  achievement: Pick<AchievementRecord, "zgca_members">,
): string[] {
  return getAchievementMemberProfiles(achievement).map((member) => member.name);
}

export function getAchievementMemberProfiles(
  achievement: Pick<AchievementRecord, "zgca_members">,
): Array<{ name: string; role: string | null }> {
  const members = new Map<string, { name: string; role: string | null }>();
  for (const member of achievement.zgca_members) {
    const name =
      member.scholar_name_cn?.trim() ||
      member.name?.trim() ||
      member.author_name?.trim() ||
      "";
    if (!name || members.has(name)) continue;
    members.set(name, { name, role: member.role?.trim() || null });
  }
  return Array.from(members.values());
}

export function getAchievementSourceLabel(
  achievement: Pick<AchievementRecord, "venue" | "sources" | "source_system">,
): string {
  const source = achievement.sources.find(
    (item: AchievementSource) => item.source_name?.trim() || item.system?.trim(),
  );
  return (
    achievement.venue?.trim() ||
    source?.source_name?.trim() ||
    achievementSourceLabels[source?.system?.trim() || ""] ||
    achievementSourceLabels[achievement.source_system?.trim() || ""] ||
    achievement.source_system?.trim() ||
    "来源待补充"
  );
}

export interface ResolvedAchievementMember {
  name: string;
  aliases: string[];
  role: string | null;
}

export interface AchievementAuthorDisplay {
  name: string;
  originalName: string | null;
  role: string | null;
  isZgcaMember: boolean;
}

function normalizePersonName(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function mergeAchievementAuthors(
  authors: string[],
  members: ResolvedAchievementMember[],
): AchievementAuthorDisplay[] {
  const memberByAlias = new Map<string, ResolvedAchievementMember>();
  for (const member of members) {
    for (const alias of [member.name, ...member.aliases]) {
      const normalized = normalizePersonName(alias);
      if (normalized && !memberByAlias.has(normalized)) {
        memberByAlias.set(normalized, member);
      }
    }
  }

  const matchedMembers = new Set<ResolvedAchievementMember>();
  const displays = authors
    .map((author) => author.trim())
    .filter(Boolean)
    .map((author) => {
      const member = memberByAlias.get(normalizePersonName(author));
      if (!member) {
        return {
          name: author,
          originalName: null,
          role: null,
          isZgcaMember: false,
        };
      }
      matchedMembers.add(member);
      return {
        name: member.name,
        originalName:
          normalizePersonName(member.name) === normalizePersonName(author)
            ? null
            : author,
        role: member.role,
        isZgcaMember: true,
      };
    });

  for (const member of members) {
    if (matchedMembers.has(member)) continue;
    displays.push({
      name: member.name,
      originalName: null,
      role: member.role,
      isZgcaMember: true,
    });
  }

  return displays;
}

export function getAchievementPrimaryDate(
  achievement: Pick<AchievementRecord, "publication_date" | "venue_year">,
): string {
  return (
    achievement.publication_date?.slice(0, 10) ||
    (achievement.venue_year ? String(achievement.venue_year) : "时间待补充")
  );
}
