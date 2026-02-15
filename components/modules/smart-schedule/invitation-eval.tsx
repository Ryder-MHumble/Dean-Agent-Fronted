"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import {
  Mail,
  Star,
  ThumbsDown,
  Sparkles,
  ChevronRight,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Invitation } from "@/lib/types/smart-schedule";
import { mockInvitations } from "@/lib/mock-data/smart-schedule";

function RoiScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-600 bg-green-50 border-green-200"
      : score >= 50
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-tabular w-fit", color)}
    >
      ROI {score}
    </Badge>
  );
}

function SuggestionBadge({
  suggestion,
}: {
  suggestion: Invitation["aiSuggestion"];
}) {
  const config = {
    参加: "border-green-200 bg-green-50 text-green-700",
    考虑: "border-amber-200 bg-amber-50 text-amber-700",
    拒绝: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] w-fit", config[suggestion])}
    >
      {suggestion}
    </Badge>
  );
}

export default function InvitationEval() {
  const { selectedItem, open, close, isOpen } = useDetailView<Invitation>();
  const [processedItems, setProcessedItems] = useState<
    Map<string, "accepted" | "declined" | "forwarded">
  >(new Map());

  const unprocessedInvitations = mockInvitations.filter(
    (i) => !processedItems.has(i.id),
  );
  const pendingCount = unprocessedInvitations.length;
  const highValueCount = unprocessedInvitations.filter(
    (i) => i.roiScore >= 75,
  ).length;
  const rejectCount = unprocessedInvitations.filter(
    (i) => i.aiSuggestion === "拒绝",
  ).length;
  const processedCount = processedItems.size;

  const handleProcess = (
    id: string,
    action: "accepted" | "declined" | "forwarded",
  ) => {
    setProcessedItems((prev) => new Map(prev).set(id, action));
    close();
    const messages = {
      accepted: "已确认参加并加入日程，秘书处已收到通知",
      declined: "已发送婉拒回复，已附上礼貌致意函",
      forwarded: "已转发给秘书处理",
    };
    toast.success(messages[action]);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">待评估邀约</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={pendingCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">高价值</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={highValueCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <ThumbsDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">建议拒绝</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={rejectCount} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedItem
            ? {
                title: (
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {selectedItem.eventName}
                    <SuggestionBadge suggestion={selectedItem.aiSuggestion} />
                  </h2>
                ),
                subtitle: (
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.host} · {selectedItem.date} ·{" "}
                    {selectedItem.location}
                  </p>
                ),
              }
            : undefined
        }
        detailContent={
          selectedItem ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">活动详情</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedItem.detail}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold">主办方分析</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.hostAnalysis}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-semibold mb-1">重要嘉宾</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.guestHighlights}
                </p>
              </div>
              <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span className="text-sm font-semibold text-violet-700">
                    AI 参会建议
                  </span>
                </div>
                <p className="text-sm text-violet-700/80">
                  {selectedItem.aiRecommendation}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm font-medium">ROI 综合评分</span>
                <span
                  className={cn(
                    "text-2xl font-bold font-tabular",
                    selectedItem.roiScore >= 80
                      ? "text-green-600"
                      : selectedItem.roiScore >= 50
                        ? "text-amber-600"
                        : "text-red-600",
                  )}
                >
                  {selectedItem.roiScore}
                </span>
              </div>
            </div>
          ) : (
            <div />
          )
        }
        detailFooter={
          selectedItem ? (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  handleProcess(
                    selectedItem.id,
                    selectedItem.aiSuggestion === "拒绝"
                      ? "declined"
                      : "accepted",
                  )
                }
              >
                {selectedItem.aiSuggestion === "拒绝" ? "确认婉拒" : "确认参加"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProcess(selectedItem.id, "forwarded")}
              >
                转发秘书
              </Button>
            </div>
          ) : undefined
        }
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                邀约评估列表
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  已处理 {processedCount}/{mockInvitations.length}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  按ROI评分排序
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-auto max-h-[calc(100vh-320px)]">
              <div className="grid grid-cols-[1fr_100px_120px_90px_80px_80px_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
                <span>活动名称</span>
                <span>主办方</span>
                <span>地点</span>
                <span>日期</span>
                <span>ROI评分</span>
                <span>AI建议</span>
                <span></span>
              </div>
              <StaggerContainer>
                {mockInvitations.map((item) => {
                  const status = processedItems.get(item.id);
                  return (
                    <StaggerItem key={item.id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full grid grid-cols-[1fr_100px_120px_90px_80px_80px_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 transition-colors group cursor-pointer",
                          status
                            ? "bg-muted/20 opacity-60"
                            : selectedItem?.id === item.id
                              ? "bg-blue-50/80 border-l-2 border-blue-500"
                              : "hover:bg-muted/30",
                        )}
                        onClick={() => !status && open(item)}
                        disabled={!!status}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {status === "accepted" ? (
                            <CalendarCheck className="h-4 w-4 text-green-500 shrink-0" />
                          ) : status === "declined" ? (
                            <ThumbsDown className="h-4 w-4 text-red-400 shrink-0" />
                          ) : item.aiSuggestion === "拒绝" ? (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          ) : null}
                          <span
                            className={cn(
                              "text-sm font-medium truncate transition-colors",
                              status
                                ? "text-muted-foreground"
                                : "group-hover:text-violet-600",
                            )}
                          >
                            {item.eventName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {item.host}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {item.location}
                        </span>
                        <span className="text-xs text-foreground font-tabular">
                          {item.date}
                        </span>
                        <RoiScoreBadge score={item.roiScore} />
                        {status ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] w-fit",
                              status === "accepted"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : status === "declined"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700",
                            )}
                          >
                            {status === "accepted"
                              ? "已确认"
                              : status === "declined"
                                ? "已婉拒"
                                : "已转发"}
                          </Badge>
                        ) : (
                          <SuggestionBadge suggestion={item.aiSuggestion} />
                        )}
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-all",
                            !status &&
                              "group-hover:text-violet-500 group-hover:translate-x-0.5",
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
      </MasterDetailView>
    </>
  );
}
