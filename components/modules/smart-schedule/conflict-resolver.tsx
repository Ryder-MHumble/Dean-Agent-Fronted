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
  AlertOctagon,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Zap,
  Plane,
  Brain,
  ArrowRightLeft,
} from "lucide-react";
import AIInsightPanel from "@/components/shared/ai-insight-panel";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ScheduleConflict } from "@/lib/types/smart-schedule";
import { mockScheduleConflicts } from "@/lib/mock-data/smart-schedule";

function ConflictTypeTag({
  type,
  iconType,
}: {
  type: string;
  iconType: string;
}) {
  const Icon =
    iconType === "clock" ? Clock : iconType === "brain" ? Brain : Plane;
  const colorMap: Record<string, string> = {
    时间重叠: "bg-red-50 text-red-600",
    精力冲突: "bg-amber-50 text-amber-600",
    出行冲突: "bg-blue-50 text-blue-600",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
        colorMap[type],
      )}
    >
      <Icon className="h-3 w-3" />
      {type}
    </div>
  );
}

export default function ConflictResolver() {
  const [selectedConflict, setSelectedConflict] =
    useState<ScheduleConflict | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const unresolvedConflicts = mockScheduleConflicts.filter(
    (c) => !resolvedIds.has(c.id),
  );
  const activeCount = unresolvedConflicts.length;
  const resolvedCount = 12 + resolvedIds.size;
  const pendingCount = unresolvedConflicts.filter(
    (c) => c.severity === "high",
  ).length;

  const handleResolve = (conflictId: string, solutionLabel: string) => {
    setResolvedIds((prev) => new Set(prev).add(conflictId));
    setSelectedConflict(null);
    toast.success(`已采纳方案：${solutionLabel}`, {
      description: "日程已自动更新，相关人员已通知",
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">当前冲突</p>
              <p className="text-xl font-bold font-tabular text-rose-600">
                <MotionNumber value={activeCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">已解决</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={resolvedCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">待确认方案</p>
              <p className="text-xl font-bold font-tabular text-amber-600">
                <MotionNumber value={pendingCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  日程冲突列表
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按严重程度排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-auto max-h-[calc(100vh-320px)]">
                <div className="grid grid-cols-[1fr_100px_90px_1fr_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
                  <span>冲突事项</span>
                  <span>时间</span>
                  <span>冲突类型</span>
                  <span>AI建议方案</span>
                  <span></span>
                </div>
                <StaggerContainer>
                  {mockScheduleConflicts.map((conflict) => {
                    const isResolved = resolvedIds.has(conflict.id);
                    return (
                      <StaggerItem key={conflict.id}>
                        <button
                          type="button"
                          className={cn(
                            "w-full grid grid-cols-[1fr_100px_90px_1fr_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 transition-colors group cursor-pointer",
                            isResolved
                              ? "bg-green-50/50 opacity-60"
                              : "hover:bg-muted/30",
                          )}
                          onClick={() =>
                            !isResolved && setSelectedConflict(conflict)
                          }
                          disabled={isResolved}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isResolved ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : conflict.severity === "high" ? (
                              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                            ) : null}
                            <div className="min-w-0">
                              <span
                                className={cn(
                                  "text-sm font-medium transition-colors flex items-center gap-1",
                                  isResolved
                                    ? "line-through text-muted-foreground"
                                    : "group-hover:text-rose-600",
                                )}
                              >
                                <span className="truncate">
                                  {conflict.eventA}
                                </span>
                                <ArrowRightLeft className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="truncate">
                                  {conflict.eventB}
                                </span>
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-foreground font-tabular">
                            {conflict.time.length > 12
                              ? conflict.time.slice(5)
                              : conflict.time.slice(5)}
                          </span>
                          {isResolved ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-green-200 bg-green-50 text-green-700 w-fit"
                            >
                              已化解
                            </Badge>
                          ) : (
                            <ConflictTypeTag
                              type={conflict.conflictType}
                              iconType={conflict.conflictTypeIcon}
                            />
                          )}
                          <span className="text-xs text-muted-foreground truncate">
                            {isResolved
                              ? "已按AI推荐方案处理"
                              : conflict.aiSuggestion}
                          </span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-all",
                              !isResolved &&
                                "group-hover:text-rose-500 group-hover:translate-x-0.5",
                            )}
                          />
                        </button>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <AIInsightPanel
            title="AI 冲突化解策略"
            accentColor="rose"
            description={`检测到${activeCount}个日程冲突，其中${pendingCount}个为高优先级需立即处理。AI已为每个冲突生成多套化解方案，综合考虑了活动价值、时间可调性和出行可行性。`}
            insights={[
              {
                text: "教育部大会与IEEE会议冲突，建议优先教育部",
                color: "red",
              },
              { text: "答辩与接待精力冲突，已协调缓冲时间", color: "amber" },
              { text: "WAIC与深圳座谈可通过早班航班衔接", color: "blue" },
              { text: "教职工大会可调至上午，冲突最易化解", color: "green" },
            ]}
            actions={[
              {
                label: "化解报告",
                icon: FileText,
                onClick: () => toast.success("正在生成冲突化解方案报告..."),
              },
              {
                label: "一键化解",
                icon: Zap,
                variant: "outline",
                onClick: () => toast.success("已应用AI推荐方案并更新日程..."),
              },
            ]}
          />
        </div>
      </div>

      <Sheet
        open={!!selectedConflict}
        onOpenChange={() => setSelectedConflict(null)}
      >
        <SheetContent className="sm:max-w-lg">
          {selectedConflict && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  冲突详情
                  <ConflictTypeTag
                    type={selectedConflict.conflictType}
                    iconType={selectedConflict.conflictTypeIcon}
                  />
                </SheetTitle>
                <SheetDescription>
                  {selectedConflict.eventA} vs {selectedConflict.eventB} ·{" "}
                  {selectedConflict.time}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">冲突分析</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedConflict.detail}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">化解方案</h4>
                  <div className="space-y-3">
                    {selectedConflict.resolutionOptions.map((option, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-lg border p-3 transition-colors",
                          option.recommended
                            ? "border-rose-200 bg-rose-50"
                            : "border-border hover:bg-muted/30",
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              option.recommended
                                ? "text-rose-700"
                                : "text-foreground",
                            )}
                          >
                            {option.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {option.recommended && (
                              <Badge className="bg-rose-500 text-white text-[10px]">
                                AI推荐
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] font-tabular", {
                                "border-green-200 bg-green-50 text-green-700":
                                  option.confidence >= 80,
                                "border-amber-200 bg-amber-50 text-amber-700":
                                  option.confidence >= 50 &&
                                  option.confidence < 80,
                                "border-gray-200 bg-gray-50 text-gray-600":
                                  option.confidence < 50,
                              })}
                            >
                              可行度 {option.confidence}%
                            </Badge>
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-xs leading-relaxed",
                            option.recommended
                              ? "text-rose-700/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const recommended =
                        selectedConflict.resolutionOptions.find(
                          (o) => o.recommended,
                        );
                      handleResolve(
                        selectedConflict.id,
                        recommended?.label || "AI推荐方案",
                      );
                    }}
                  >
                    采纳AI推荐
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("已标记为手动处理，稍后提醒")}
                  >
                    手动处理
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
