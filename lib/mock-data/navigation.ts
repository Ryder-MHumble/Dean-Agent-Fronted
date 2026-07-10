import {
  LayoutDashboard,
  FileText,
  Cpu,
  Globe,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import type { NavGroup, PageMeta } from "@/lib/types/navigation";

export const navGroups: NavGroup[] = [
  {
    items: [{ id: "home", label: "情报总览", icon: LayoutDashboard }],
  },
  {
    label: "情报维度",
    items: [
      { id: "policy-intel", label: "政策情报", icon: FileText },
      { id: "tech-frontier", label: "科技前沿", icon: Cpu },
      { id: "talent-radar", label: "领导画像", icon: Globe },
      { id: "university-eco", label: "高校生态", icon: GraduationCap },
      { id: "sentiment", label: "两院舆情", icon: MessageSquare },
    ],
  },
];

export const pageMeta: Record<string, PageMeta> = {
  home: { title: "情报总览", subtitle: "每日更新 · 多维信息入口" },
  "policy-intel": {
    title: "政策情报",
    subtitle: "外部政策追踪与机会匹配",
  },
  "tech-frontier": {
    title: "科技前沿",
    subtitle: "技术趋势 · 行业动态 · 前沿追踪",
  },
  "talent-radar": {
    title: "领导画像",
    subtitle: "政府领导库 · 高校领导库 · 履历检索",
  },
  "university-eco": {
    title: "高校生态",
    subtitle: "同行动态 · 科研成果 · 信源追踪",
  },
  sentiment: {
    title: "两院舆情",
    subtitle: "社媒监测 · 舆情分析 · 热点追踪",
  },
};
