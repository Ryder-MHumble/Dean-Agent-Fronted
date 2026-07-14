import {
  BookOpenText,
  Landmark,
  LayoutDashboard,
  FileText,
  GraduationCap,
  MessageSquare,
  RadioTower,
  ScrollText,
  UsersRound,
} from "lucide-react";
import type { NavGroup, PageMeta } from "@/lib/types/navigation";

export const navGroups: NavGroup[] = [
  {
    items: [{ id: "home", label: "情报总览", icon: LayoutDashboard }],
  },
  {
    label: "外部情报资讯",
    items: [
      { id: "policy-intel", label: "政策情报", icon: FileText },
      { id: "tech-frontier", label: "社媒情报", icon: RadioTower },
      { id: "papers", label: "前沿论文", icon: BookOpenText },
      { id: "talent-radar", label: "外部领导", icon: Landmark },
      { id: "university-eco", label: "高校生态", icon: GraduationCap },
      { id: "sentiment", label: "两院舆情", icon: MessageSquare },
    ],
  },
  {
    label: "内部共享资讯",
    items: [
      {
        id: "academic-achievements",
        label: "两院学术成果",
        icon: ScrollText,
      },
      { id: "internal-experts", label: "两院专家库", icon: UsersRound },
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
    title: "社媒情报",
    subtitle: "社媒动态 · 前沿认知 · 热点追踪",
  },
  papers: {
    title: "前沿论文",
    subtitle: "顶刊顶会 · ArXiv · 前沿研究",
  },
  "talent-radar": {
    title: "外部领导",
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
  "academic-achievements": {
    title: "两院学术成果",
    subtitle: "论文成果 · 作者信息 · 发表动态",
  },
  "internal-experts": {
    title: "两院专家库",
    subtitle: "专家信息 · 研究领域 · 学科方向",
  },
};
