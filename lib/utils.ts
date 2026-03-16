import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 验证URL是否有效
 * @param url - 待验证的URL字符串
 * @returns 如果URL格式有效返回true，否则返回false
 */
export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查数据项是否包含有效的sourceUrl
 * @param item - 包含sourceUrl字段的对象
 * @returns 如果sourceUrl有效返回true，否则返回false
 */
export function hasValidSourceUrl(item: { sourceUrl?: string }): boolean {
  return isValidUrl(item.sourceUrl);
}

/**
 * 格式化发布时间戳为相对时间字符串
 * 支持毫秒（13位）和秒（10位）时间戳
 */
export function formatPublishTime(ts: number | null): string {
  if (!ts) return "";
  const ms = ts > 1e12 ? ts : ts * 1000;
  const date = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHr < 24) return `${diffHr}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}周前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

/**
 * 格式化数字为易读的短格式（万/k）
 */
export function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
