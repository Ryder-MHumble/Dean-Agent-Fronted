import {
  LayoutDashboard,
  FileText,
  Cpu,
  Globe,
  GraduationCap,
  Building,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import type { NavGroup, PageMeta } from "@/lib/types/navigation";

export const navGroups: NavGroup[] = [
  {
    items: [{ id: "home", label: "院长早报", icon: LayoutDashboard }],
  },
  {
    label: "外部情报",
    items: [
      { id: "policy-intel", label: "政策情报", icon: FileText },
      { id: "tech-frontier", label: "科技前沿", icon: Cpu },
      { id: "talent-radar", label: "人事动态", icon: Globe },
      { id: "university-eco", label: "高校生态", icon: GraduationCap },
      { id: "sentiment", label: "两院舆情", icon: MessageSquare },
    ],
  },
  {
    label: "内部管理",
    items: [{ id: "internal-mgmt", label: "院内管理", icon: Building }],
  },
  {
    label: "行动与日程",
    items: [
      { id: "network", label: "人脉网络", icon: Users },
      { id: "smart-schedule", label: "智能日程", icon: Calendar },
    ],
  },
];

export const pageMeta: Record<string, PageMeta> = {
  home: { title: "院长早报", subtitle: "今日态势 · 全局掌控" },
  "policy-intel": {
    title: "政策情报",
    subtitle: "外部政策追踪与机会匹配",
  },
  "tech-frontier": {
    title: "科技前沿",
    subtitle: "技术趋势 · 行业动态 · 前沿追踪",
  },
  "talent-radar": {
    title: "人事动态",
    subtitle: "政府人事 · 高校人事 · 人才要闻",
  },
  "university-eco": {
    title: "高校生态",
    subtitle: "同行动态 · 科研成果 · 人事变动",
  },
  sentiment: {
    title: "两院舆情",
    subtitle: "社媒监测 · 舆情分析 · 热点追踪",
  },
  "internal-mgmt": {
    title: "院内管理",
    subtitle: "中心动态 · 项目督办 · 学生管理",
  },
  network: {
    title: "人脉网络",
    subtitle: "人事变动 · 关系维护 · 社交行动",
  },
  "smart-schedule": {
    title: "智能日程",
    subtitle: "日程ROI · 邀约评估 · 冲突化解",
  },
};
