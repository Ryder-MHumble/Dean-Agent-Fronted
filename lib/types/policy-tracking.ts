export interface PolicyTrackingInsight {
  label: string;
  color: string;
  text: string;
}

export interface PolicyTrackingItem {
  id: string;
  level: "national" | "beijing";
  agency: string;
  agencyColor: string;
  date: string;
  title: string;
  description?: string;
  impact?: string;
  impactColor?: string;
  actionLabel?: string;
  insights?: PolicyTrackingInsight[];
  tags?: string[];
  sourceUrl?: string;
}

export interface PolicyMatchItem {
  id: string;
  title: string;
  matchScore: number;
  funding: string;
  daysRemaining: number;
}
