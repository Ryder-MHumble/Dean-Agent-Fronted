import type { LeaderAvatarRecord, LeaderProfile } from "@/lib/types/leaders";

type LeaderDisplayInput = Pick<LeaderProfile, "id" | "leader_details">;
type AvatarMapping = Record<
  string,
  Pick<LeaderAvatarRecord, "avatarUrl"> | undefined
>;

function normalizedText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function getLeaderSummary(
  leader: Pick<LeaderProfile, "leader_details">,
): string {
  const raw = asRecord(leader.leader_details?.raw);
  const llmProfile = asRecord(raw?.llm_profile);
  return (
    normalizedText(leader.leader_details?.text) ||
    normalizedText(leader.leader_details?.summary) ||
    normalizedText(llmProfile?.profile_text) ||
    normalizedText(llmProfile?.summary)
  );
}

export function resolveLeaderAvatar(
  leader: LeaderDisplayInput,
  avatarMapping: AvatarMapping,
): string | null {
  return (
    normalizedText(leader.leader_details?.media?.avatar_url) ||
    normalizedText(avatarMapping[leader.id]?.avatarUrl) ||
    null
  );
}
