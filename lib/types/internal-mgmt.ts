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

// ── 社媒动态 (mock legacy) ──
export interface SocialMediaItem {
  id: string;
  platform: string;
  platformIcon: string;
  iconColor: string;
  time: string;
  content: string;
  risk: boolean;
}

// ── 舆情监测 (Supabase real data) ──

export interface SentimentContentItem {
  id: number;
  platform: string;
  content_id: string;
  content_type: string;
  title: string;
  description: string;
  content_url: string;
  cover_url: string;
  nickname: string;
  avatar: string;
  ip_location: string;
  liked_count: number;
  comment_count: number;
  share_count: number;
  collected_count: number;
  source_keyword: string | null;
  publish_time: number | null;
  created_at: string | null;
  platform_data: {
    tag_list?: string;
    video_url?: string;
    image_list?: string;
    [key: string]: unknown;
  } | null;
}

export interface SentimentComment {
  id: number;
  platform: string;
  comment_id: string;
  content_id: string;
  parent_comment_id: string;
  content: string;
  nickname: string;
  avatar: string;
  ip_location: string;
  like_count: number;
  sub_comment_count: number;
  publish_time: number | null;
  created_at: string | null;
}

export interface SentimentContentDetail extends SentimentContentItem {
  comments: SentimentComment[];
}

export interface PlatformStats {
  platform: string;
  platform_label: string;
  content_count: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_collected: number;
}

export interface SentimentOverview {
  total_contents: number;
  total_comments: number;
  total_engagement: number;
  platforms: PlatformStats[];
  top_content: SentimentContentItem[];
  keywords: string[];
}

export interface SentimentFeedResponse {
  items: SentimentContentItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
