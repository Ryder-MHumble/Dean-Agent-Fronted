export interface PolicySourceLike {
  source?: string | null;
  sourceId?: string | null;
  source_id?: string | null;
  sourceName?: string | null;
  source_name?: string | null;
}

function clean(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function getPolicySourceId(item: PolicySourceLike): string {
  return clean(item.sourceId) || clean(item.source_id) || clean(item.source);
}

export function getPolicySourceLabel(item: PolicySourceLike): string {
  return (
    clean(item.sourceName) ||
    clean(item.source_name) ||
    clean(item.source) ||
    "未知来源"
  );
}
