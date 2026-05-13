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

export type PaginationItem = number | "ellipsis";

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

export function getPaginationItems(
  page: number,
  totalPages: number,
): PaginationItem[] {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const pages = new Set([1, safeTotalPages, safePage - 1, safePage, safePage + 1]);
  const sortedPages = Array.from(pages)
    .filter((value) => value >= 1 && value <= safeTotalPages)
    .sort((a, b) => a - b);

  return sortedPages.flatMap((value, index) => {
    const previous = sortedPages[index - 1];
    if (previous !== undefined && value - previous > 1) {
      return ["ellipsis" as const, value];
    }
    return [value];
  });
}

export function sanitizePageInput(
  value: string,
  totalPages: number,
): number | null {
  const page = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(page)) return null;

  const safeTotalPages = Math.max(1, totalPages);
  return Math.min(Math.max(1, page), safeTotalPages);
}
