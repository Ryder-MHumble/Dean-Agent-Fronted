"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { mockTechTrends } from "@/lib/mock-data/intelligence";
import type { TechTrend } from "@/lib/types/intelligence";
import { HeatIndicator } from "./helpers";

export default function TechTab() {
  const { selectedItem: selectedTech, open, close, isOpen } = useDetailView<TechTrend>();

  const highRiskCount = mockTechTrends.filter(
    (t) => t.gapLevel === "high",
  ).length;
  const surgingCount = mockTechTrends.filter(
    (t) => t.heatTrend === "surging",
  ).length;

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedTech
          ? {
              title: (
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {selectedTech.topic}
                  <HeatIndicator trend={selectedTech.heatTrend} />
                </h2>
              ),
              subtitle: (
                <p className="text-sm text-muted-foreground">
                  热度变化: {selectedTech.heatLabel} · 覆盖程度:{" "}
                  {selectedTech.gapLevel === "high"
                    ? "高"
                    : selectedTech.gapLevel === "medium"
                      ? "中"
                      : "低"}
                </p>
              ),
            }
          : undefined
      }
      detailContent={
        selectedTech ? (
          <div className="space-y-4">
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
          </div>
        ) : null
      }
      detailFooter={
        selectedTech ? (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                toast.success("已安排技术委员会评估");
                close();
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
        ) : undefined
      }
    >
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">追踪技术</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockTechTrends.length} />
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
                <MotionNumber value={highRiskCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 8/4 grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  技术趋势追踪
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按覆盖缺口排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                  <span>技术方向</span>
                  <span>热度趋势</span>
                  <span>我院状态</span>
                  <span>缺口</span>
                  <span>关键信号</span>
                  <span></span>
                </div>

                <StaggerContainer>
                  {mockTechTrends.map((tech) => (
                    <StaggerItem key={tech.id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full grid grid-cols-[1fr_80px_90px_80px_1fr_50px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer",
                          selectedTech?.id === tech.id && "bg-muted/40",
                        )}
                        onClick={() => open(tech)}
                      >
                        <div className="flex items-center gap-2">
                          {tech.gapLevel === "high" && (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          )}
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                            {tech.topic}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <HeatIndicator trend={tech.heatTrend} />
                        </div>

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
        </div>

        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold">AI 技术简报</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                本周重点关注具身智能方向——清华AIR已发布2篇相关顶会论文，而我院在该方向布局为空。AI
                Agent方向热度飙升（+210%），我院有理论基础但缺乏工程化能力。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    具身智能方向尚未布局，存在覆盖缺口
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    AI Agent需引进工程化人才
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    多模态与AI4Science方向布局良好
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
                onClick={() => toast.success("正在生成本周技术简报...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                生成技术简报
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MasterDetailView>
  );
}
