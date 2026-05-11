export interface DateRangeValue {
  from?: string;
  to?: string;
}

export interface PaginatedItems<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function normalizeDate(value?: string | null): string | null {
  const date = value?.trim().slice(0, 10);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return date;
}

export function hasActiveDateRange(range: DateRangeValue): boolean {
  return Boolean(normalizeDate(range.from) || normalizeDate(range.to));
}

export function filterItemsByDateRange<T extends { date?: string | null }>(
  items: T[],
  range: DateRangeValue,
): T[] {
  const from = normalizeDate(range.from);
  const to = normalizeDate(range.to);
  if (!from && !to) return items;

  return items.filter((item) => {
    const date = normalizeDate(item.date);
    if (!date) return false;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedItems<T> {
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}
