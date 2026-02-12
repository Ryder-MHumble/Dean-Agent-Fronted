"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Twitter,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StaggerContainer,
  StaggerItem,
  ExpandableSection,
} from "@/components/motion";
import { cn } from "@/lib/utils";

interface TechnologyTrend {
  id: string;
  topic: string;
  heatSlope: number;
  trendDirection: "surging" | "rising" | "stable" | "declining";
  ourPosition: "strong" | "moderate" | "weak" | "none";
  gapRisk: "high" | "medium" | "low" | "none";
  arxivCount: number;
  twitterMentions: number;
  aiInsight: string;
}

const mockTrends: TechnologyTrend[] = [
  {
    id: "1",
    topic: "DeepSeek-V3",
    heatSlope: 300,
    trendDirection: "surging",
    ourPosition: "moderate",
    gapRisk: "medium",
    arxivCount: 42,
    twitterMentions: 1200,
    aiInsight: "开源大模型新标杆，我院需评估是否调整基座模型策略",
  },
  {
    id: "2",
    topic: "具身智能 (Embodied AI)",
    heatSlope: 180,
    trendDirection: "surging",
    ourPosition: "none",
    gapRisk: "high",
    arxivCount: 28,
    twitterMentions: 860,
    aiInsight: "清华AIR已发2篇顶会，我院布局为空，存在战略风险",
  },
  {
    id: "3",
    topic: "小模型效率革命",
    heatSlope: 120,
    trendDirection: "rising",
    ourPosition: "strong",
    gapRisk: "none",
    arxivCount: 35,
    twitterMentions: 640,
    aiInsight: "我院边缘AI团队处于领先位置，可作为Q3基金会演示亮点",
  },
  {
    id: "4",
    topic: "AI Agent框架",
    heatSlope: 90,
    trendDirection: "rising",
    ourPosition: "weak",
    gapRisk: "medium",
    arxivCount: 18,
    twitterMentions: 520,
    aiInsight: "产业应用加速，建议加强工程化团队建设",
  },
  {
    id: "5",
    topic: "量子-经典混合计算",
    heatSlope: 30,
    trendDirection: "stable",
    ourPosition: "none",
    gapRisk: "low",
    arxivCount: 12,
    twitterMentions: 180,
    aiInsight: "尚处早期阶段，可持续关注暂不投入",
  },
];

const trendConfig = {
  surging: {
    icon: TrendingUp,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "激增",
  },
  rising: {
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "上升",
  },
  stable: {
    icon: Minus,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "平稳",
  },
  declining: {
    icon: TrendingDown,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "下降",
  },
};

const positionConfig = {
  strong: {
    label: "领先",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  moderate: {
    label: "跟进中",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  weak: {
    label: "薄弱",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  none: {
    label: "空白",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

const gapRiskConfig = {
  high: {
    variant: "danger" as const,
    label: "高风险",
  },
  medium: {
    variant: "warning" as const,
    label: "中风险",
  },
  low: {
    variant: "info" as const,
    label: "低风险",
  },
  none: {
    variant: "default" as const,
    label: "",
  },
};

function TrendCard({ trend }: { trend: TechnologyTrend }) {
  const trendData = trendConfig[trend.trendDirection];
  const positionData = positionConfig[trend.ourPosition];
  const gapRiskData = gapRiskConfig[trend.gapRisk];
  const TrendIcon = trendData.icon;

  const hasHighRisk = trend.gapRisk === "high";

  return (
    <Card
      className={cn(
        "shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer",
        hasHighRisk && "border-l-4 border-l-red-500 bg-red-50/30"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg leading-tight flex-1">{trend.topic}</CardTitle>
          {hasHighRisk && (
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
              trendData.bgColor
            )}
          >
            <TrendIcon className={cn("h-4 w-4", trendData.color)} />
            <span className={cn("text-sm font-semibold", trendData.color)}>
              {trend.heatSlope > 0 ? "+" : ""}
              {trend.heatSlope}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">我院布局</span>
          <span
            className={cn(
              "text-sm font-semibold px-2 py-0.5 rounded",
              positionData.bgColor,
              positionData.color
            )}
          >
            {positionData.label}
          </span>
        </div>

        {trend.gapRisk !== "none" && (
          <div>
            <Badge variant={gapRiskData.variant} className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {gapRiskData.label}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{trend.arxivCount} 篇论文</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Twitter className="h-4 w-4" />
            <span>{trend.twitterMentions.toLocaleString()} 讨论</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
          <p className="text-xs text-blue-900 leading-relaxed">
            {trend.aiInsight}
          </p>
        </div>

        <Button variant="ghost" size="sm" className="w-full justify-between group">
          <span>查看详细分析</span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function TechnologyTrends() {
  const criticalTrends = mockTrends.filter((t) => t.gapRisk === "high");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">技术风向标</h2>
          <p className="text-sm text-muted-foreground mt-1">
            实时技术热点监测与我院布局差距分析
          </p>
        </div>
        {criticalTrends.length > 0 && (
          <Badge variant="danger" className="text-base px-3 py-1 gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            {criticalTrends.length} 个高风险空白
          </Badge>
        )}
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTrends.map((trend) => (
          <StaggerItem key={trend.id}>
            <TrendCard trend={trend} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <TechBriefSection />
    </div>
  );
}

function TechBriefSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-2"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        AI技术简报
        <span className="text-xs text-muted-foreground font-normal">本周技术动态综合分析</span>
      </button>
      <ExpandableSection isOpen={expanded}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-blue-900">本周技术热点：</strong>
            DeepSeek-V3引爆开源社区讨论（+300%），具身智能方向清北高校集中发力。
            我院在边缘AI方向保持领先，但具身智能方向存在战略空白，建议尽快组织技术委员会评估。
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-red-600 mb-1">2</div>
              <div className="text-sm text-muted-foreground">激增趋势</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">1</div>
              <div className="text-sm text-muted-foreground">领先布局</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-amber-600 mb-1">3</div>
              <div className="text-sm text-muted-foreground">需关注风险</div>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
}
