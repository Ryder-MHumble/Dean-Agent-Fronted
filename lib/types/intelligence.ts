export interface PolicyItem {
  id: string;
  name: string;
  agency: string;
  agencyType: "national" | "beijing" | "ministry";
  matchScore: number;
  funding: string;
  deadline: string;
  daysLeft: number;
  status: "urgent" | "active" | "tracking";
  aiInsight: string;
  detail: string;
  sourceUrl?: string;
}

export interface TechTrend {
  id: string;
  topic: string;
  heatTrend: "surging" | "rising" | "stable" | "declining";
  heatLabel: string;
  ourStatus: "deployed" | "weak" | "none";
  ourStatusLabel: string;
  gapLevel: "high" | "medium" | "low";
  keyMetric: string;
  aiInsight: string;
  detail: string;
}

export interface Competitor {
  id: string;
  name: string;
  activityLevel: number;
  latestAction: string;
  actionType: string;
  threatLevel: "critical" | "warning" | "normal";
  recentCount: number;
  aiInsight: string;
  detail: string;
}
