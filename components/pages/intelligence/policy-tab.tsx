"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Zap,
  AlertTriangle,
  Sparkles,
  Clock,
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
import { mockPolicies } from "@/lib/mock-data/intelligence";
import type { PolicyItem } from "@/lib/types/intelligence";
import { MatchBar } from "./helpers";

export default function PolicyTab() {
  const { selectedItem: selectedPolicy, open, close, isOpen } = useDetailView<PolicyItem>();

  const urgentCount = mockPolicies.filter((p) => p.status === "urgent").length;
  const avgMatch = Math.round(
    mockPolicies.reduce((sum, p) => sum + p.matchScore, 0) /
      mockPolicies.length,
  );

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedPolicy
          ? {
              title: (
                <h2 className="text-lg font-semibold">
                  {selectedPolicy.name}
                </h2>
              ),
              subtitle: (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700":
                        selectedPolicy.agencyType === "national",
                      "border-blue-200 bg-blue-50 text-blue-700":
                        selectedPolicy.agencyType === "beijing",
                    })}
                  >
                    {selectedPolicy.agency}
                  </Badge>
                  <span>匹配度 {selectedPolicy.matchScore}%</span>
                  <span>·</span>
                  <span>资金规模 {selectedPolicy.funding}</span>
                </p>
              ),
            }
          : undefined
      }
      detailContent={
        selectedPolicy ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">详细分析</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedPolicy.detail}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">
                  AI 建议
                </span>
              </div>
              <p className="text-sm text-blue-700/80">
                {selectedPolicy.aiInsight}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                距截止: {selectedPolicy.daysLeft}天 (
                {selectedPolicy.deadline})
              </div>
            </div>
          </div>
        ) : null
      }
      detailFooter={
        selectedPolicy ? (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                toast.success("已分配给李副主任跟进");
                close();
              }}
            >
              分配负责人
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("申报材料模板已生成")}
            >
              生成申报材料
            </Button>
          </div>
        ) : undefined
      }
    >
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">匹配政策</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={mockPolicies.length} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">平均匹配度</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={avgMatch} suffix="%" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">紧急待办</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={urgentCount} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 8/4 grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Policy Table */}
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  政策机会列表
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按匹配度排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                  <span>政策名称</span>
                  <span>发布机构</span>
                  <span>匹配度</span>
                  <span>资金规模</span>
                  <span>截止</span>
                  <span></span>
                </div>

                {/* Table Body */}
                <StaggerContainer>
                  {mockPolicies.map((policy) => (
                    <StaggerItem key={policy.id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer",
                          selectedPolicy?.id === policy.id && "bg-muted/40",
                        )}
                        onClick={() => open(policy)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {policy.status === "urgent" && (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                            {policy.name}
                          </span>
                        </div>

                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-red-200 bg-red-50 text-red-700":
                              policy.agencyType === "national",
                            "border-blue-200 bg-blue-50 text-blue-700":
                              policy.agencyType === "beijing",
                            "border-gray-200 bg-gray-50 text-gray-700":
                              policy.agencyType === "ministry",
                          })}
                        >
                          {policy.agency}
                        </Badge>

                        <MatchBar score={policy.matchScore} />

                        <span className="text-xs text-foreground font-medium">
                          {policy.funding}
                        </span>

                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "text-xs font-tabular",
                              policy.daysLeft <= 7
                                ? "text-red-600 font-semibold"
                                : "text-muted-foreground",
                            )}
                          >
                            {policy.daysLeft}天
                          </span>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Insight */}
        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">AI 政策解读</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                本周新增3条匹配政策，其中算力补贴政策（匹配度98%）与我院算力平台二期高度相关，建议优先关注。科技部AI专项申报材料准备进度仅30%，需加快推进。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    算力补贴政策截止5天，需立即行动
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    科技部专项需王教授确认技术路线
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    教育部基金可作为补充资金来源
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
                onClick={() => toast.success("正在生成申报策略报告...")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                生成申报策略
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MasterDetailView>
  );
}
