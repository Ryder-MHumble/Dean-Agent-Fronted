"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Activity,
} from "lucide-react";

import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DataFreshness from "@/components/shared/data-freshness";
import type { TechTrend } from "@/lib/types/tech-frontier";
import { mockModuleTechTrends } from "@/lib/mock-data/tech-frontier";

function HeatIndicator({ trend }: { trend: TechTrend["heatTrend"] }) {
  const config = {
    surging: {
      icon: TrendingUp,
      color: "text-red-500",
      bg: "bg-red-50",
      label: "飙升",
    },
    rising: {
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-50",
      label: "上升",
    },
    stable: {
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-50",
      label: "稳定",
    },
    declining: {
      icon: TrendingDown,
      color: "text-gray-400",
      bg: "bg-gray-50",
      label: "下降",
    },
  };
  const c = config[trend];
  const Icon = c.icon;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
        c.bg,
        c.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </div>
  );
}

export default function TechTrends() {
  const [selectedTech, setSelectedTech] = useState<TechTrend | null>(null);
  const highGapCount = mockModuleTechTrends.filter(
    (t) => t.gapLevel === "high",
  ).length;
  const surgingCount = mockModuleTechTrends.filter(
    (t) => t.heatTrend === "surging",
  ).length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">追踪技术</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockModuleTechTrends.length} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">热度飙升</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={surgingCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">覆盖缺口</p>
              <p className="text-xl font-bold font-tabular text-amber-600">
                <MotionNumber value={highGapCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                技术趋势追踪
              </CardTitle>
              <DataFreshness updatedAt={new Date(Date.now() - 7200000)} />
            </div>
            <Badge variant="secondary" className="text-[10px]">
              按覆盖缺口排序
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto max-h-[calc(100vh-320px)]">
            <div className="grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
              <span>技术方向</span>
              <span>热度趋势</span>
              <span>我院状态</span>
              <span>缺口</span>
              <span>关键信号</span>
              <span></span>
            </div>
            <StaggerContainer>
              {mockModuleTechTrends.map((tech) => (
                <StaggerItem key={tech.id}>
                  <button
                    type="button"
                    className="w-full grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedTech(tech)}
                  >
                    <div className="flex items-center gap-2">
                      {tech.gapLevel === "high" && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                      )}
                      <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                        {tech.topic}
                      </span>
                    </div>
                    <HeatIndicator trend={tech.heatTrend} />
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] w-fit", {
                        "border-green-200 bg-green-50 text-green-700":
                          tech.ourStatus === "deployed",
                        "border-amber-200 bg-amber-50 text-amber-700":
                          tech.ourStatus === "weak",
                        "border-red-200 bg-red-50 text-red-700":
                          tech.ourStatus === "none",
                      })}
                    >
                      {tech.ourStatusLabel}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] w-fit", {
                        "border-red-200 bg-red-50 text-red-700":
                          tech.gapLevel === "high",
                        "border-amber-200 bg-amber-50 text-amber-700":
                          tech.gapLevel === "medium",
                        "border-green-200 bg-green-50 text-green-700":
                          tech.gapLevel === "low",
                      })}
                    >
                      {tech.gapLevel === "high"
                        ? "高"
                        : tech.gapLevel === "medium"
                          ? "中"
                          : "低"}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      {tech.keyMetric}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedTech && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selectedTech.topic}
                  <HeatIndicator trend={selectedTech.heatTrend} />
                </SheetTitle>
                <SheetDescription>
                  热度变化: {selectedTech.heatLabel} · 覆盖程度:{" "}
                  {selectedTech.gapLevel === "high"
                    ? "高"
                    : selectedTech.gapLevel === "medium"
                      ? "中"
                      : "低"}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">详细分析</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTech.detail}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">
                      AI 建议
                    </span>
                  </div>
                  <p className="text-sm text-purple-700/80">
                    {selectedTech.aiInsight}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success("已安排技术委员会评估");
                      setSelectedTech(null);
                    }}
                  >
                    安排技术评估
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("详细技术报告已生成")}
                  >
                    生成报告
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
