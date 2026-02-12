"use client";

import { DollarSign, AlertCircle, ExternalLink, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "@/components/motion";
import { cn } from "@/lib/utils";

interface PolicyOpportunity {
  id: string;
  title: string;
  source: string;
  matchScore: number;
  fundingScale: string;
  daysRemaining: number;
  urgency: "critical" | "medium" | "low";
  relevantTeam: string;
  aiAnalysis: string;
  tags: string[];
}

const mockPolicies: PolicyOpportunity[] = [
  {
    id: "1",
    title: "北京算力基础设施补贴政策",
    source: "北京科委",
    matchScore: 98,
    fundingScale: "500-1000万",
    daysRemaining: 5,
    urgency: "critical",
    relevantTeam: "李副主任（算力平台组）",
    aiAnalysis: "与我院算力平台二期高度匹配，建议紧急组织申报",
    tags: ["算力", "补贴", "基建"],
  },
  {
    id: "2",
    title: "科技部新一代AI重大专项",
    source: "科技部",
    matchScore: 85,
    fundingScale: "1000-3000万",
    daysRemaining: 3,
    urgency: "critical",
    relevantTeam: "王教授（科研处）",
    aiAnalysis: "覆盖我院3个核心研究方向，优先级最高",
    tags: ["AI", "专项", "科技部"],
  },
  {
    id: "3",
    title: "教育部产学研协同创新",
    source: "教育部",
    matchScore: 72,
    fundingScale: "200-500万",
    daysRemaining: 15,
    urgency: "medium",
    relevantTeam: "科研处",
    aiAnalysis: "可与清华联合申报，增加获批概率",
    tags: ["产学研", "协同"],
  },
  {
    id: "4",
    title: "发改委数字经济专项",
    source: "发改委",
    matchScore: 60,
    fundingScale: "500-800万",
    daysRemaining: 30,
    urgency: "low",
    relevantTeam: "待评估",
    aiAnalysis: "匹配度中等，建议先评估可行性",
    tags: ["数字经济"],
  },
];

const sourceColors: Record<string, string> = {
  科技部: "bg-red-100 text-red-700 border-red-200",
  北京科委: "bg-blue-100 text-blue-700 border-blue-200",
  教育部: "bg-purple-100 text-purple-700 border-purple-200",
  发改委: "bg-amber-100 text-amber-700 border-amber-200",
};

const urgencyConfig = {
  critical: {
    variant: "danger" as const,
    color: "border-red-500",
  },
  medium: {
    variant: "warning" as const,
    color: "border-amber-500",
  },
  low: {
    variant: "info" as const,
    color: "border-blue-500",
  },
};

function CircularProgress({ value, size = 80 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-1000 ease-out",
            value >= 90 ? "text-green-500" : value >= 70 ? "text-blue-500" : "text-amber-500"
          )}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber
          value={value}
          className="text-2xl font-bold"
        />
        <span className="text-xs text-muted-foreground">匹配度</span>
      </div>
    </div>
  );
}

function PolicyCard({ policy }: { policy: PolicyOpportunity }) {
  const urgencyData = urgencyConfig[policy.urgency];

  return (
    <Card
      className={cn(
        "shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300 hover:-translate-y-1",
        "border-l-4",
        urgencyData.color
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge
            variant="secondary"
            className={cn("border", sourceColors[policy.source] || "bg-gray-100")}
          >
            {policy.source}
          </Badge>
          <Badge variant={urgencyData.variant} className="gap-1">
            <AlertCircle className="h-3 w-3" />
            剩余 {policy.daysRemaining} 天
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{policy.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <CircularProgress value={policy.matchScore} />
          <div className="flex-1 pl-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold">{policy.fundingScale}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{policy.relevantTeam}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold text-blue-700">AI分析：</span>
            {policy.aiAnalysis}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {policy.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            查看详情
          </Button>
          <Button size="sm" className="flex-1">
            安排申报
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PolicyOpportunityPool() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">政策红利池</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI智能匹配的政策机会，按匹配度和紧急度排序
          </p>
        </div>
        <Badge variant="info" className="text-base px-3 py-1">
          {mockPolicies.length} 个机会
        </Badge>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPolicies.map((policy) => (
          <StaggerItem key={policy.id}>
            <PolicyCard policy={policy} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
