"use client";

import { motion } from "framer-motion";
import {
  FileText,
  UserPlus,
  Banknote,
  Handshake,
  Trophy,
  ChevronRight,
  Building2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

type ActionType = "publication" | "talent_hire" | "funding" | "collaboration" | "award";
type ActionSeverity = "critical" | "important" | "normal";

interface CompetitorAction {
  type: ActionType;
  severity: ActionSeverity;
  title: string;
  date: string;
  aiImplication: string;
}

interface Competitor {
  id: string;
  name: string;
  activityCount: number;
  recentActions: CompetitorAction[];
}

const mockCompetitors: Competitor[] = [
  {
    id: "1",
    name: "清华AIR",
    activityCount: 4,
    recentActions: [
      {
        type: "publication",
        severity: "important",
        title: "具身智能顶会论文2篇",
        date: "2天前",
        aiImplication: "在我院空白方向加速布局，需密切关注",
      },
      {
        type: "talent_hire",
        severity: "critical",
        title: "从谷歌挖角2名高级研究员",
        date: "1周前",
        aiImplication: "人才争夺加剧，需评估我院薪酬竞争力",
      },
    ],
  },
  {
    id: "2",
    name: "智源研究院",
    activityCount: 2,
    recentActions: [
      {
        type: "funding",
        severity: "important",
        title: "获北京市2亿专项资金",
        date: "3天前",
        aiImplication: "资金优势拉大，需加速我院融资进度",
      },
      {
        type: "collaboration",
        severity: "normal",
        title: "与百度签署战略合作",
        date: "5天前",
        aiImplication: "产学研合作模式值得借鉴",
      },
    ],
  },
  {
    id: "3",
    name: "北大AI Lab",
    activityCount: 3,
    recentActions: [
      {
        type: "publication",
        severity: "normal",
        title: "NLP方向Nature子刊发表",
        date: "1天前",
        aiImplication: "NLP方向持续深耕，与我院不直接竞争",
      },
      {
        type: "award",
        severity: "important",
        title: "获国家科技进步二等奖",
        date: "1周前",
        aiImplication: "学术声望提升，招生竞争加剧",
      },
      {
        type: "talent_hire",
        severity: "normal",
        title: "引进Stanford博后1名",
        date: "2周前",
        aiImplication: "常规引才动作",
      },
    ],
  },
];

const actionTypeConfig: Record<
  ActionType,
  { icon: typeof FileText; label: string; color: string }
> = {
  publication: {
    icon: FileText,
    label: "学术发表",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  talent_hire: {
    icon: UserPlus,
    label: "人才引进",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  funding: {
    icon: Banknote,
    label: "资金获取",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  collaboration: {
    icon: Handshake,
    label: "战略合作",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  award: {
    icon: Trophy,
    label: "奖项荣誉",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
};

const severityConfig = {
  critical: {
    color: "bg-red-500",
    label: "严重",
  },
  important: {
    color: "bg-amber-500",
    label: "重要",
  },
  normal: {
    color: "bg-gray-400",
    label: "一般",
  },
};

function ActionItem({ action }: { action: CompetitorAction }) {
  const typeData = actionTypeConfig[action.type];
  const severityData = severityConfig[action.severity];
  const ActionIcon = typeData.icon;

  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200 last:hidden" />

      {/* Severity dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "absolute left-1.5 top-2 h-3 w-3 rounded-full ring-4 ring-white",
          severityData.color
        )}
      />

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <ActionIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Badge variant="secondary" className={cn("border text-xs", typeData.color)}>
              {typeData.label}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {action.date}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">{action.title}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-2.5">
            <p className="text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold text-blue-700">AI洞察：</span>
              {action.aiImplication}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  const criticalCount = competitor.recentActions.filter(
    (a) => a.severity === "critical"
  ).length;
  const importantCount = competitor.recentActions.filter(
    (a) => a.severity === "important"
  ).length;

  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-xl">{competitor.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {competitor.activityCount} 条动态
              </Badge>
            </div>

            {(criticalCount > 0 || importantCount > 0) && (
              <div className="flex items-center gap-2 mt-2">
                {criticalCount > 0 && (
                  <Badge variant="danger" className="gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {criticalCount} 严重
                  </Badge>
                )}
                {importantCount > 0 && (
                  <Badge variant="warning" className="gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {importantCount} 重要
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Actions timeline */}
        <div className="border-t pt-4">
          {competitor.recentActions.map((action, index) => (
            <ActionItem key={index} action={action} />
          ))}
        </div>

        {/* Footer action */}
        <div className="border-t pt-4">
          <Button variant="outline" size="sm" className="w-full justify-between group">
            <span>详细分析</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompetitorMonitoring() {
  const totalActions = mockCompetitors.reduce(
    (sum, c) => sum + c.activityCount,
    0
  );
  const criticalActions = mockCompetitors.reduce(
    (sum, c) => sum + c.recentActions.filter((a) => a.severity === "critical").length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">竞对监测</h2>
          <p className="text-sm text-muted-foreground mt-1">
            追踪竞争机构的关键动态与战略布局
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalActions > 0 && (
            <Badge variant="danger" className="text-base px-3 py-1 gap-1.5">
              <AlertCircle className="h-4 w-4" />
              {criticalActions} 条严重
            </Badge>
          )}
          <Badge variant="info" className="text-base px-3 py-1">
            共 {totalActions} 条动态
          </Badge>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-6">
        {mockCompetitors.map((competitor) => (
          <StaggerItem key={competitor.id}>
            <CompetitorCard competitor={competitor} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Summary insights */}
      <Card className="shadow-card border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">AI综合分析</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                本周竞对活跃度明显提升。
                <strong className="text-blue-700">清华AIR在具身智能方向加速发力</strong>，与我院形成正面竞争；
                <strong className="text-green-700">智源研究院获得2亿资金支持</strong>，资金优势持续扩大；
                北大AI Lab在传统NLP领域保持优势。建议重点关注具身智能方向的人才储备和资金争取。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
