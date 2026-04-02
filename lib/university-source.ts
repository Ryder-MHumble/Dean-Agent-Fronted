export function normalizeUniversityInstitutionName(
  sourceName: string | null | undefined,
  fallbackId?: string | null,
): string {
  const fallback = (fallbackId ?? "").trim();
  let text = (sourceName ?? "").trim();

  if (!text) return fallback;

  // Common crawler suffixes: "-新闻动态(自动)" / "-新闻动态（自动）" / "-新闻动态"
  text = text.replace(
    /\s*[-－—]\s*新闻动态\s*[（(]\s*自动\s*[)）]\s*$/u,
    "",
  );
  text = text.replace(/\s*[-－—]\s*新闻动态\s*$/u, "");
  text = text.replace(/\s*新闻动态\s*[（(]\s*自动\s*[)）]\s*$/u, "");
  text = text.replace(/\s*新闻动态\s*$/u, "");

  const normalized = text.trim();
  return normalized || fallback;
}

