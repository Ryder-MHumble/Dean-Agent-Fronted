"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import {
  Compass,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  FileText,
  MapPin,
  CalendarDays,
  Target,
  BookOpen,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { RecommendedActivity } from "@/lib/types/smart-schedule";
import { mockActivities } from "@/lib/mock-data/smart-schedule";

function RelevanceBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-green-600 bg-green-50 border-green-200"
      : score >= 70
        ? "text-blue-600 bg-blue-50 border-blue-200"
        : "text-gray-600 bg-gray-50 border-gray-200";
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-tabular w-fit", color)}
    >
      {score}分
    </Badge>
  );
}

export default function ActivityRecommend() {
  const {
    selectedItem: selectedActivity,
    open,
    close,
    isOpen,
  } = useDetailView<RecommendedActivity>();
  const totalCount = mockActivities.length;
  const highMatchCount = mockActivities.filter(
    (a) => a.relevanceScore >= 85,
  ).length;
  const monthlyPicks = mockActivities.filter(
    (a) => a.date.includes("05-") || a.date.includes("06-"),
  ).length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">推荐活动</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={totalCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">高匹配</p>
              <p className="text-xl font-bold font-tabular text-orange-600">
                <MotionNumber value={highMatchCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">本月精选</p>
              <p className="text-xl font-bold font-tabular text-blue-600">
                <MotionNumber value={monthlyPicks} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedActivity
            ? {
                title: (
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {selectedActivity.name}
                    <RelevanceBadge score={selectedActivity.relevanceScore} />
                  </h2>
                ),
                subtitle: (
                  <p className="text-sm text-muted-foreground">
                    {selectedActivity.date} · {selectedActivity.location} ·{" "}
                    {selectedActivity.category}
                  </p>
                ),
              }
            : undefined
        }
        detailContent={
          selectedActivity ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">活动详情</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedActivity.detail}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">核心亮点</h4>
                <div className="space-y-1.5">
                  {selectedActivity.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-700">
                    AI 匹配分析
                  </span>
                </div>
                <p className="text-sm text-indigo-700/80">
                  {selectedActivity.aiExplanation}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold">参会准备建议</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedActivity.preparation}
                </p>
              </div>
            </div>
          ) : (
            <div />
          )
        }
        detailFooter={
          selectedActivity ? (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("已加入日程并通知秘书准备材料");
                  close();
                }}
              >
                确认参加
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("已标记为待定并设置提醒")}
              >
                标记待定
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-1 lg:col-span-8">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
              <StaggerContainer className="space-y-3">
                {mockActivities.map((activity) => (
                  <StaggerItem key={activity.id}>
                    <Card
                      className={cn(
                        "shadow-card transition-shadow cursor-pointer group",
                        selectedActivity?.id === activity.id
                          ? "bg-blue-50/80 border-l-2 border-blue-500"
                          : "hover:shadow-md",
                      )}
                      onClick={() => open(activity)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold group-hover:text-indigo-600 transition-colors truncate">
                                {activity.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="text-[10px] shrink-0"
                              >
                                {activity.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {activity.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {activity.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <RelevanceBadge score={activity.relevanceScore} />
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Target className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {activity.reason}
                          </p>
                        </div>
                        {activity.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {activity.highlights.map((h, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-600"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-semibold">AI 活动匹配引擎</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  基于学院战略方向、近期科研动态和院长社交网络分析，AI为您筛选出
                  {totalCount}个高匹配活动。其中{highMatchCount}
                  个匹配度超过85分，强烈建议参加。
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                    <span className="text-slate-300">
                      WAIC 2025匹配度最高（96分），建议重点参与
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                    <span className="text-slate-300">
                      教育部研讨会可获取学科目录调整一手信息
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span className="text-slate-300">
                      KDD 2025学院论文录用量创历史新高
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="text-slate-300">
                      人才峰会有8名高匹配候选人，与引才计划联动
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
                    onClick={() => toast.success("正在生成活动参加规划...")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    参会规划
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    onClick={() => toast.success("已同步到日程系统...")}
                  >
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                    同步日程
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MasterDetailView>
    </>
  );
}
