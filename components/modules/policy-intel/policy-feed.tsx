"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  Target,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PolicyFeedItem, PolicyFeedCategory } from "@/lib/types/policy-intel";

const categoryConfig: Record<string, { color: string; bg: string }> = {
  国家政策: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  北京政策: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  领导讲话: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  政策机会: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

const importanceConfig: Record<string, string> = {
  紧急: "bg-red-500",
  重要: "bg-amber-400",
  关注: "bg-yellow-300",
  一般: "bg-gray-300",
};

function MatchBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-500"
      : score >= 70
        ? "bg-blue-500"
        : "bg-amber-500";
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

function groupByDate(
  items: PolicyFeedItem[],
): { label: string; items: PolicyFeedItem[] }[] {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const groups = [
    { label: "今天", items: items.filter((i) => i.date === today) },
    {
      label: "本周",
      items: items.filter((i) => i.date < today && i.date >= weekStartStr),
    },
    { label: "更早", items: items.filter((i) => i.date < weekStartStr) },
  ];
  return groups.filter((g) => g.items.length > 0);
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
            }
          : undefined
      }
      detailContent={
        selectedItem && (
          <div className="space-y-4">
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
              {selectedItem.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedItem.detail || selectedItem.summary}
            </p>

            {selectedItem.sourceUrl && (
              <a
                href={selectedItem.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看原文
              </a>
            )}

            {selectedItem.signals && selectedItem.signals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">关键信号</h4>
                <div className="space-y-1.5">
                  {selectedItem.signals.map((signal, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedItem.daysLeft !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                距截止还有 {selectedItem.daysLeft} 天
              </div>
            )}

            {selectedItem.aiInsight && (
              <div className="rounded-lg bg-muted/50 border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-foreground">
                    AI 参考分析
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedItem.aiInsight}
                </p>
              </div>
            )}
          </div>
        )
      }
      detailFooter={
        selectedItem && (
          <div className="flex gap-2">
            {selectedItem.category === "政策机会" ? (
              <>
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
                  onClick={() =>
                    toast.success("申报材料模板已生成")
                  }
                >
                  生成申报材料
                </Button>
              </>
            ) : selectedItem.category === "领导讲话" ? (
              <>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已生成应对策略报告");
                    close();
                  }}
                >
                  生成应对策略
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("已加入院务会议议题")
                  }
                >
                  加入会议议题
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已标记为重点关注");
                    close();
                  }}
                >
                  标记关注
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("已生成影响分析报告")
                  }
                >
                  AI 影响分析
                </Button>
              </>
            )}
          </div>
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
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg transition-colors group cursor-pointer text-left",
                        selectedItem?.id === item.id
                          ? "bg-blue-50/80 border-l-2 border-blue-500"
                          : "hover:bg-muted/30",
                      )}
                      onClick={() => open(item)}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full shrink-0",
                          importanceConfig[item.importance],
                          item.importance === "紧急" &&
                            "animate-pulse-subtle",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] shrink-0",
                              categoryConfig[item.category]?.bg,
                              categoryConfig[item.category]?.color,
                            )}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">
                            {item.source}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.date}
                          </span>
                          {item.matchScore !== undefined && (
                            <MatchBar score={item.matchScore} />
                          )}
                          {item.daysLeft !== undefined && (
                            <span
                              className={cn(
                                "text-[10px] flex items-center gap-0.5",
                                item.daysLeft <= 7
                                  ? "text-red-600 font-semibold"
                                  : "text-muted-foreground",
                              )}
                            >
                              <Clock className="h-3 w-3" />
                              {item.daysLeft}天
                            </span>
                          )}
                          {item.leader && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {item.leader}
                            </Badge>
                          )}
                          {item.relevance !== undefined && (
                            <span className="text-[10px] text-muted-foreground">
                              相关度 {item.relevance}%
                            </span>
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
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                    </button>
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
