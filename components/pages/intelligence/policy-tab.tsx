"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  Zap,
  AlertTriangle,
  Sparkles,
  Clock,
  ChevronRight,
  FileText,
  WifiOff,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import { useDetailView } from "@/hooks/use-detail-view";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import { usePolicyFeed } from "@/hooks/use-policy-opportunities";
import { SkeletonSubPage } from "@/components/shared/skeleton-states";
import { MatchBar } from "./helpers";

const categoryStyle: Record<string, string> = {
  国家政策: "border-red-200 bg-red-50 text-red-700",
  北京政策: "border-blue-200 bg-blue-50 text-blue-700",
  领导讲话: "border-purple-200 bg-purple-50 text-purple-700",
  政策机会: "border-green-200 bg-green-50 text-green-700",
};

const importanceStyle: Record<string, string> = {
  紧急: "border-red-200 bg-red-50 text-red-700",
  重要: "border-amber-200 bg-amber-50 text-amber-700",
  关注: "border-blue-200 bg-blue-50 text-blue-700",
  一般: "border-gray-200 bg-gray-50 text-gray-500",
};

export default function PolicyTab() {
  const {
    selectedItem: selectedPolicy,
    open,
    close,
    isOpen,
  } = useDetailView<PolicyFeedItem>();
  const { items: policies, isLoading, isUsingMock } = usePolicyFeed();

  const importantCount = policies.filter(
    (p) => p.importance === "紧急" || p.importance === "重要",
  ).length;
  const avgMatch = Math.round(
    policies.length > 0
      ? policies.reduce((sum, p) => sum + (p.matchScore || 0), 0) /
          policies.length
      : 0,
  );

  if (isLoading) {
    return <SkeletonSubPage />;
  }

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedPolicy
          ? {
              title: (
                <h2 className="text-lg font-semibold leading-snug">
                  {selectedPolicy.title}
                </h2>
              ),
              subtitle: (
                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      categoryStyle[selectedPolicy.category],
                    )}
                  >
                    {selectedPolicy.category}
                  </Badge>
                  <span>{selectedPolicy.source}</span>
                  <span>&middot;</span>
                  <span>{selectedPolicy.date}</span>
                  <span>&middot;</span>
                  <span>匹配度 {selectedPolicy.matchScore}%</span>
                  {selectedPolicy.funding && (
                    <>
                      <span>&middot;</span>
                      <span>资金 {selectedPolicy.funding}</span>
                    </>
                  )}
                </div>
              ),
              sourceUrl: selectedPolicy.sourceUrl ?? undefined,
            }
          : undefined
      }
      detailContent={
        selectedPolicy ? (
          <DetailArticleBody
            aiAnalysis={
              selectedPolicy.aiInsight
                ? {
                    title: "AI 建议",
                    content: selectedPolicy.aiInsight,
                    detail: selectedPolicy.detail ?? undefined,
                    signals: selectedPolicy.signals ?? undefined,
                    colorScheme: "blue",
                  }
                : undefined
            }
            summary={selectedPolicy.summary}
            extraMeta={
              <div className="flex items-center gap-2 flex-wrap">
                {selectedPolicy.daysLeft != null &&
                  selectedPolicy.daysLeft > 0 && (
                    <span
                      className={cn(
                        "text-xs flex items-center gap-1",
                        selectedPolicy.daysLeft <= 7
                          ? "text-red-600 font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      距截止 {selectedPolicy.daysLeft} 天
                    </span>
                  )}
              </div>
            }
          />
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">政策总数</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={policies.length} />
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
              <p className="text-[11px] text-muted-foreground">重要/紧急</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={importantCount} suffix="条" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 8/4 grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Policy Table */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  政策情报列表
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isUsingMock && (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-amber-600 border-amber-200 bg-amber-50 gap-1"
                    >
                      <WifiOff className="h-3 w-3" />
                      演示数据
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px]">
                    按匹配度排序
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="w-full">
                <div className="min-w-[600px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_80px_90px_90px_60px_30px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                    <span>政策名称</span>
                    <span>类别</span>
                    <span>匹配度</span>
                    <span>重要性</span>
                    <span>日期</span>
                    <span></span>
                  </div>

                  {/* Table Body */}
                  <StaggerContainer>
                    {policies.map((policy) => (
                      <StaggerItem key={policy.id}>
                        <button
                          type="button"
                          className={cn(
                            "w-full grid grid-cols-[1fr_80px_90px_90px_60px_30px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer",
                            selectedPolicy?.id === policy.id && "bg-muted/40",
                          )}
                          onClick={() => open(policy)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {(policy.importance === "紧急" ||
                              policy.importance === "重要") && (
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full shrink-0",
                                  policy.importance === "紧急"
                                    ? "bg-red-500 animate-pulse-subtle"
                                    : "bg-amber-500",
                                )}
                              />
                            )}
                            <span className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                              {policy.title}
                            </span>
                          </div>

                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] w-fit",
                              categoryStyle[policy.category] ||
                                "border-gray-200 bg-gray-50 text-gray-700",
                            )}
                          >
                            {policy.category}
                          </Badge>

                          <MatchBar score={policy.matchScore || 0} />

                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] w-fit",
                              importanceStyle[policy.importance],
                            )}
                          >
                            {policy.importance}
                          </Badge>

                          <span className="text-[11px] text-muted-foreground font-tabular">
                            {policy.date.slice(5)}
                          </span>

                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Insight */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">AI 政策解读</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                共监测到 {policies.length} 条政策信息，其中{" "}
                {policies.filter((p) => p.importance === "重要").length}{" "}
                条标记为重要。平均匹配度 {avgMatch}%。
              </p>
              <div className="space-y-2 mb-4">
                {policies
                  .filter(
                    (p) => p.importance === "紧急" || p.importance === "重要",
                  )
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} className="flex items-start gap-2 text-xs">
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full mt-1.5 shrink-0",
                          p.importance === "紧急"
                            ? "bg-red-400"
                            : "bg-amber-400",
                        )}
                      />
                      <span className="text-slate-300 line-clamp-1">
                        {p.title}
                      </span>
                    </div>
                  ))}
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
