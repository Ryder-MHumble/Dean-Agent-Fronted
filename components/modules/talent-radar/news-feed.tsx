"use client";

import { useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, {
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import FeedPagination from "@/components/shared/feed-pagination";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import PersonCard from "./person-card";
import type { PersonnelNewsItem } from "@/lib/types/talent-radar";

const categoryConfig: Record<string, { color: string; bg: string }> = {
  政府人事: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  高校人事: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  人才要闻: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

const importanceConfig: Record<string, string> = {
  重要: "bg-red-500",
  关注: "bg-amber-400",
  一般: "bg-gray-300",
};

interface NewsFeedProps {
  items: PersonnelNewsItem[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
  };
}

export default function NewsFeed({ items, pagination }: NewsFeedProps) {
  const { selectedItem, open, close, isOpen } =
    useDetailView<PersonnelNewsItem>();
  const listRef = useRef<HTMLDivElement>(null);
  const onPaginationPageChange = pagination?.onPageChange;
  const handlePageChange = useCallback(
    (nextPage: number) => {
      close();
      onPaginationPageChange?.(nextPage);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    [close, onPaginationPageChange],
  );

  return (
    <MasterDetailView
      className="h-full"
      listContentClassName="min-h-0 overflow-hidden"
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
              selectedItem.relevanceNote
                ? {
                    title: "AI 关联分析",
                    content: selectedItem.relevanceNote,
                    colorScheme: "indigo",
                  }
                : undefined
            }
            content={selectedItem.content}
            summary={selectedItem.summary}
            extraMeta={
              <Badge
                variant="outline"
                className={cn("text-xs", {
                  "bg-red-50 text-red-700 border-red-200":
                    selectedItem.importance === "重要",
                  "bg-amber-50 text-amber-700 border-amber-200":
                    selectedItem.importance === "关注",
                  "bg-gray-50 text-gray-700 border-gray-200":
                    selectedItem.importance === "一般",
                })}
              >
                {selectedItem.importance}
              </Badge>
            }
          >
            {selectedItem.personProfile && (
              <PersonCard profile={selectedItem.personProfile} compact />
            )}
          </DetailArticleBody>
        )
      }
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
        <div
          ref={listRef}
          aria-busy={pagination?.isLoading}
          className={cn(
            "min-h-0 overflow-y-auto overscroll-contain pr-1 transition-opacity",
            pagination?.isLoading && "opacity-60",
          )}
        >
          <DateGroupedList
            items={items}
            emptyMessage="暂无匹配的人事动态"
            renderItem={(item) => (
              <DataItemCard
                isSelected={selectedItem?.id === item.id}
                onClick={() => open(item)}
                accentColor="indigo"
              >
                {/* Row 1: Title with importance dot + Chevron */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.importance === "重要" && (
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          importanceConfig[item.importance],
                        )}
                      />
                    )}
                    <h4
                      className={cn(
                        "text-sm font-semibold leading-snug flex-1 transition-colors line-clamp-1",
                        accentConfig.indigo.title,
                      )}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <ItemChevron accentColor="indigo" />
                </div>
                {/* Row 2: Summary */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
                  {item.summary}
                </p>
                {/* Row 3: Footer - category, source, people badges, date */}
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
                      {item.source}
                    </span>
                    {item.people.slice(0, 3).map((p) => (
                      <Badge
                        key={p}
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0"
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {item.date}
                  </span>
                </div>
              </DataItemCard>
            )}
          />
        </div>
        {pagination && (
          <div className="border-t border-border/60 bg-background pt-3">
            <FeedPagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              isLoading={pagination.isLoading}
              onPageChange={handlePageChange}
              className="w-full"
            />
          </div>
        )}
      </div>
    </MasterDetailView>
  );
}
