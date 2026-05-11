"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, { ItemChevron, accentConfig } from "@/components/shared/data-item-card";
import FeedPagination from "@/components/shared/feed-pagination";
import { useDetailView } from "@/hooks/use-detail-view";
import { getPolicySourceLabel } from "@/lib/policy-source-label";
import { cn } from "@/lib/utils";
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
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
  };
}

export default function PolicyFeed({ items, pagination }: PolicyFeedProps) {
  const { selectedItem, open, close, isOpen } = useDetailView<PolicyFeedItem>();

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
                  <span>{getPolicySourceLabel(selectedItem)}</span>
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
      <div className="flex flex-col gap-3 pb-2">
        <DateGroupedList
          items={items}
          className="max-h-[calc(100vh-280px)]"
          emptyMessage="暂无匹配的政策信息"
          renderItem={(item) => (
            <DataItemCard
              isSelected={selectedItem?.id === item.id}
              onClick={() => open(item)}
              accentColor="blue"
            >
              {/* Row 1: Title with optional importance dot + Chevron */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {(item.importance === "紧急" || item.importance === "重要") && (
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        importanceConfig[item.importance]?.dot,
                        item.importance === "紧急" && "animate-pulse-subtle",
                      )}
                    />
                  )}
                  <h4
                    className={cn(
                      "text-sm font-semibold leading-snug flex-1 transition-colors line-clamp-1",
                      accentConfig.blue.title,
                    )}
                  >
                    {item.title}
                  </h4>
                </div>
                <ItemChevron accentColor="blue" />
              </div>
              {/* Row 2: Summary */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
                {item.summary}
              </p>
              {/* Row 3: Footer - all metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-medium",
                      categoryConfig[item.category]?.bg,
                      categoryConfig[item.category]?.color,
                    )}
                  >
                    {item.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {getPolicySourceLabel(item)}
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
                      {item.daysLeft}天
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
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {item.date}
                </span>
              </div>
            </DataItemCard>
          )}
        />
        {pagination && (
          <FeedPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            isLoading={pagination.isLoading}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    </MasterDetailView>
  );
}
