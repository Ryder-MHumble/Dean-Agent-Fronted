/**
 * 全局颜色映射配置
 * 提取自 components/modules/tech-frontier/detail-panels.tsx
 */

import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { TechTopic, Opportunity } from "@/lib/types/tech-frontier";

export const heatConfig: Record<
  TechTopic["heatTrend"],
  { icon: typeof TrendingUp; color: string; bg: string; label: string }
> = {
  surging: {
    icon: TrendingUp,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "飙升",
  },
  rising: {
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-50",
    label: "上升",
  },
  stable: {
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "稳定",
  },
  declining: {
    icon: TrendingDown,
    color: "text-gray-400",
    bg: "bg-gray-50",
    label: "下降",
  },
};

export const platformColors: Record<string, string> = {
  X: "bg-black text-white",
  YouTube: "bg-red-600 text-white",
  ArXiv: "bg-red-100 text-red-700",
  GitHub: "bg-gray-800 text-white",
  微信公众号: "bg-green-600 text-white",
  知乎: "bg-blue-600 text-white",
};

export const newsTypeColors: Record<string, { color: string; bg: string }> = {
  投融资: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  新产品: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
  政策: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  收购: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  合作: { color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
};

export const impactColors: Record<string, { color: string; bg: string }> = {
  重大: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  较大: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  一般: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

export const trendConfig: Record<string, { label: string; color: string }> = {
  surging: { label: "爆发", color: "bg-red-100 text-red-700 border-red-200" },
  rising: {
    label: "上升",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  stable: {
    label: "稳定",
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

export const opportunityTypeConfig: Record<
  Opportunity["type"],
  { color: string; bg: string }
> = {
  合作: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  会议: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
  内参: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

export const opportunityPriorityConfig: Record<
  Opportunity["priority"],
  { color: string; bg: string }
> = {
  紧急: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  高: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  中: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  低: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};
