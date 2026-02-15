// ── 中心动态：事件 Feed ──
export interface CenterEvent {
  id: string;
  type: "achievement" | "risk" | "personnel" | "key-number" | "milestone";
  typeLabel: string;
  title: string;
  summary: string;
  center: string;
  time: string;
  source: string;
}

// ── 中心动态：中心概览 ──
export interface CenterBrief {
  id: string;
  name: string;
  leader: string;
  statusTag: string;
  statusType: "normal" | "warning" | "risk";
  keyUpdates: string[];
  detail: string;
}

// ── 项目督办 ──
export interface ProjectBrief {
  id: string;
  name: string;
  owner: string;
  department: string;
  currentStatus: string;
  latestUpdate: string;
  status: "risk" | "in-progress" | "completed";
  statusLabel: string;
  detail: string;
  aiInsight: string;
}

export interface TimelineProject {
  name: string;
  status: string;
  statusLabel: string;
  statusColor: string;
  dotColor: string;
  owner: string;
  phase: string;
  bars: {
    start: number;
    width: number;
    label: string;
    gradient: string;
    borderColor: string;
    textColor: string;
    hoverShadow: string;
  }[];
}

export interface Milestone {
  date: string;
  description: string;
  projectName: string;
}

// ── 学生管理 ──
export interface StudentPaper {
  id: string;
  title: string;
  student: string;
  grade: string;
  advisor: string;
  venue: string;
  date: string;
  credited: boolean; // 是否署名研究院
  source: string;
}

export interface EnrollmentData {
  category: string;
  count: number;
  change: string;
  changeType: "up" | "down" | "flat";
}

export interface StudentAlert {
  id: string;
  name: string;
  grade: string;
  major: string;
  type: "心理预警" | "学业预警" | "考勤异常" | "经济困难";
  level: "紧急" | "关注" | "提醒";
  summary: string;
  detail: string;
  aiRecommendation: string;
}

// ── 社媒动态 ──
export interface SocialMediaItem {
  id: string;
  platform: string;
  platformIcon: string;
  iconColor: string;
  time: string;
  content: string;
  risk: boolean;
}
