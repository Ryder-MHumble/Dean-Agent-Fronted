/**
 * Groups items by date into 今天 (Today), 本周 (This Week), 更早 (Earlier).
 * Items must have a `date` field as an ISO date string (YYYY-MM-DD).
 * "本周" uses a rolling 7-day window (past 7 days excluding today).
 * Future dates are grouped separately as dates requiring review so malformed
 * crawler dates stay visible without being presented as real future news.
 * Missing dates are grouped into 未标注.
 */
export function groupByDate<T extends { date?: string | null }>(
  items: T[],
): { label: string; items: T[] }[] {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);
  const hasDate = (date?: string | null) => Boolean(date);

  return [
    {
      label: "日期待核验",
      items: items.filter((i) => hasDate(i.date) && i.date! > today),
    },
    { label: "今天", items: items.filter((i) => i.date === today) },
    {
      label: "本周",
      items: items.filter(
        (i) => hasDate(i.date) && i.date! < today && i.date! >= sevenDaysAgoStr,
      ),
    },
    {
      label: "更早",
      items: items.filter((i) => hasDate(i.date) && i.date! < sevenDaysAgoStr),
    },
    { label: "未标注", items: items.filter((i) => !hasDate(i.date)) },
  ].filter((g) => g.items.length > 0);
}

function normalizeCalendarDate(value?: string | null): string | null {
  const date = value?.slice(0, 10) ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function formatCalendarDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${Number(year)}年${Number(month)}月${Number(day)}日`;
}

export function groupByCalendarDate<
  T extends { date?: string | null },
>(items: T[]): { date: string | null; label: string; items: T[] }[] {
  const datedGroups = new Map<string, T[]>();
  const undatedItems: T[] = [];

  for (const item of items) {
    const date = normalizeCalendarDate(item.date);
    if (!date) {
      undatedItems.push(item);
      continue;
    }

    const group = datedGroups.get(date);
    if (group) group.push(item);
    else datedGroups.set(date, [item]);
  }

  const groups: { date: string | null; label: string; items: T[] }[] =
    Array.from(datedGroups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, groupItems]) => ({
      date,
      label: formatCalendarDate(date),
      items: groupItems,
    }));

  if (undatedItems.length > 0) {
    groups.push({
      date: null,
      label: "日期未标注",
      items: undatedItems,
    });
  }

  return groups;
}
