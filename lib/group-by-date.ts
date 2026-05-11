/**
 * Groups items by date into 今天 (Today), 本周 (This Week), 更早 (Earlier).
 * Items must have a `date` field as an ISO date string (YYYY-MM-DD).
 * "本周" uses a rolling 7-day window (past 7 days excluding today).
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
