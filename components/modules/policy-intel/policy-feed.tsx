"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { groupByDate } from "@/lib/group-by-date";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";

const categoryConfig: Record<string, { color: string; bg: string }> = {
  国家政策: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  北京政策: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  领导讲话: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  政策机会: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

const importanceConfig: Record<
  string,
  { dot: string; border: string; bg: string }
> = {
  紧急: {
    dot: "bg-red-500",
    border: "border-l-red-500",
    bg: "bg-red-50/40",
  },
  重要: {
    dot: "bg-amber-400",
    border: "border-l-amber-400",
    bg: "bg-amber-50/30",
  },
  关注: { dot: "bg-yellow-300", border: "border-l-yellow-300", bg: "" },
  一般: { dot: "bg-gray-300", border: "border-l-gray-200", bg: "" },
};

function MatchBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-green-500" : score >= 70 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-semibold font-tabular",
          score >= 90
            ? "text-green-600"
            : score >= 70
              ? "text-blue-600"
              : "text-amber-600",
        )}
      >
        {score}%
      </span>
    </div>
  );
}

interface PolicyFeedProps {
  items: PolicyFeedItem[];
}

export default function PolicyFeed({ items }: PolicyFeedProps) {
  const { selectedItem, open, close, isOpen } = useDetailView<PolicyFeedItem>();
  const groups = groupByDate(items);

  if (items.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          暂无匹配的政策信息
        </CardContent>
      </Card>
    );
  }

  return (
    <MasterDetailView
      className="h-full"
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedItem
          ? {
              title: (
                <h2 className="text-lg font-semibold leading-snug">
                  {selectedItem.title}
                </h2>
              ),
              subtitle: (
                <div className="flex items-center gap-2 flex-wrap mt-1 text-sm text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      categoryConfig[selectedItem.category]?.bg,
                      categoryConfig[selectedItem.category]?.color,
                    )}
                  >
                    {selectedItem.category}
                  </Badge>
                  <span>{selectedItem.source}</span>
                  <span>&middot;</span>
                  <span>{selectedItem.date}</span>
                  {selectedItem.matchScore !== undefined && (
                    <>
                      <span>&middot;</span>
                      <span>匹配度 {selectedItem.matchScore}%</span>
                    </>
                  )}
                  {selectedItem.funding && (
                    <>
                      <span>&middot;</span>
                      <span>{selectedItem.funding}</span>
                    </>
                  )}
                </div>
              ),
              sourceUrl: selectedItem.sourceUrl,
            }
          : undefined
      }
      detailContent={
        selectedItem && (
          <DetailArticleBody
            aiAnalysis={
              selectedItem.aiInsight ||
              selectedItem.detail ||
              (selectedItem.signals && selectedItem.signals.length > 0)
                ? {
                    content: selectedItem.aiInsight ?? "",
                    detail: selectedItem.detail ?? undefined,
                    signals: selectedItem.signals ?? undefined,
                    colorScheme: "blue",
                  }
                : undefined
            }
            content={selectedItem.content ?? undefined}
            summary={selectedItem.summary}
            tags={selectedItem.tags}
            extraMeta={
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-xs", {
                    "bg-red-50 text-red-700 border-red-200":
                      selectedItem.importance === "紧急",
                    "bg-amber-50 text-amber-700 border-amber-200":
                      selectedItem.importance === "重要",
                    "bg-yellow-50 text-yellow-700 border-yellow-200":
                      selectedItem.importance === "关注",
                    "bg-gray-50 text-gray-700 border-gray-200":
                      selectedItem.importance === "一般",
                  })}
                >
                  {selectedItem.importance}
                </Badge>
                {selectedItem.daysLeft != null && selectedItem.daysLeft > 0 && (
                  <span
                    className={cn(
                      "text-xs flex items-center gap-1",
                      selectedItem.daysLeft <= 7
                        ? "text-red-600 font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    距截止 {selectedItem.daysLeft} 天
                  </span>
                )}
              </div>
            }
          />
        )
      }
    >
      {/* List content */}
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.label} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {group.label}
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {group.items.length}条
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <StaggerContainer>
                {group.items.map((item) => (
                  <StaggerItem key={item.id}>
                    <div
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg transition-all group text-left border-l-2",
                        selectedItem?.id === item.id
                          ? "bg-blue-50/80 border-l-blue-500 shadow-sm"
                          : cn(
                              importanceConfig[item.importance]?.border,
                              importanceConfig[item.importance]?.bg,
                              "hover:bg-muted/40 hover:shadow-sm",
                            ),
                      )}
                    >
                      <button
                        type="button"
                        className="flex-1 min-w-0 cursor-pointer text-left"
                        onClick={() => open(item)}
                      >
                        {/* Title row */}
                        <div className="flex items-center gap-2 mb-1">
                          {(item.importance === "紧急" ||
                            item.importance === "重要") && (
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                importanceConfig[item.importance]?.dot,
                                item.importance === "紧急" &&
                                  "animate-pulse-subtle",
                              )}
                            />
                          )}
                          <span className="text-[13px] font-semibold group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        {/* Summary */}
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed mb-1.5">
                          {item.summary}
                        </p>
                        {/* Meta row */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0 shrink-0",
                              categoryConfig[item.category]?.bg,
                              categoryConfig[item.category]?.color,
                            )}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {item.source}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.date}
                          </span>
                          {item.matchScore !== undefined && (
                            <MatchBar score={item.matchScore} />
                          )}
                          {item.daysLeft != null && item.daysLeft > 0 && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] px-1.5 py-0 gap-0.5",
                                item.daysLeft <= 7
                                  ? "border-red-200 bg-red-50 text-red-600 font-semibold"
                                  : item.daysLeft <= 30
                                    ? "border-amber-200 bg-amber-50 text-amber-600"
                                    : "text-muted-foreground",
                              )}
                            >
                              <Clock className="h-2.5 w-2.5" />
                              截止还剩{item.daysLeft}天
                            </Badge>
                          )}
                          {item.funding && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {item.funding}
                            </Badge>
                          )}
                        </div>
                      </button>
                      <div className="flex items-center shrink-0 mt-0.5">
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </MasterDetailView>
  );
}
