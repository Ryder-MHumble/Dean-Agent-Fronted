"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FlaskConical } from "lucide-react";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, {
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import DataFreshness from "@/components/shared/data-freshness";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PeerNewsItem, PeerNewsGroup } from "@/lib/types/university-eco";
import { mockPeerNews } from "@/lib/mock-data/university-eco";

type FilterTag = "all" | PeerNewsGroup;

const GROUP_CONFIG: Record<PeerNewsGroup, { label: string; color: string }> = {
  university_news: {
    label: "高校",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ai_institutes: {
    label: "研究机构",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
};

const FILTER_TABS: {
  value: FilterTag;
  label: string;
  icon?: typeof Building2;
}[] = [
  { value: "all", label: "全部" },
  { value: "university_news", label: "高校动态", icon: Building2 },
  { value: "ai_institutes", label: "研究机构", icon: FlaskConical },
];

function GroupBadge({ group }: { group: PeerNewsGroup }) {
  const c = GROUP_CONFIG[group];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {c.label}
    </Badge>
  );
}

export default function PeerDynamics() {
  const {
    selectedItem: selectedNews,
    open,
    close,
    isOpen,
  } = useDetailView<PeerNewsItem>();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");

  const filteredNews = useMemo(() => {
    const sorted = [...mockPeerNews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (activeFilter === "all") return sorted;
    return sorted.filter((n) => n.group === activeFilter);
  }, [activeFilter]);

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  activeFilter === tab.value
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted",
                )}
              >
                {tab.icon && <tab.icon className="h-3 w-3" />}
                {tab.label}
                <span className="ml-0.5 text-[10px] opacity-70">
                  {tab.value === "all"
                    ? mockPeerNews.length
                    : mockPeerNews.filter((n) => n.group === tab.value).length}
                </span>
              </button>
            ))}
          </div>
          <DataFreshness updatedAt={new Date()} />
        </div>
      </div>

      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedNews
            ? {
                title: (
                  <h2 className="text-lg font-semibold leading-snug">
                    {selectedNews.title}
                  </h2>
                ),
                subtitle: (
                  <div className="flex items-center gap-2 mt-1.5">
                    <GroupBadge group={selectedNews.group} />
                    <span className="text-sm text-muted-foreground">
                      {selectedNews.sourceName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedNews.date}
                    </span>
                  </div>
                ),
                sourceUrl: selectedNews.url,
              }
            : undefined
        }
        detailContent={
          selectedNews && (
            <DetailArticleBody
              aiAnalysis={{
                title: "AI 摘要分析",
                content: `该动态来源于${selectedNews.sourceName}，与我院研究方向存在潜在关联。建议关注后续进展并评估合作可能性。`,
                colorScheme: "indigo",
              }}
              summary={selectedNews.summary}
              tags={selectedNews.tags}
            />
          )
        }
        detailFooter={
          selectedNews && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("已加入重点跟踪");
                  close();
                }}
              >
                重点跟踪
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("详细分析报告已生成")}
              >
                生成报告
              </Button>
            </div>
          )
        }
      >
        <DateGroupedList
          items={filteredNews}
          className="max-h-[calc(100vh-280px)]"
          emptyMessage="暂无同行动态"
          renderItem={(news) => (
            <DataItemCard
              isSelected={selectedNews?.id === news.id}
              onClick={() => open(news)}
              accentColor="blue"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4
                  className={cn(
                    "text-sm font-semibold leading-snug flex-1 transition-colors",
                    accentConfig.blue.title,
                  )}
                >
                  {news.title}
                </h4>
                <ItemChevron accentColor="blue" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
                {news.summary}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GroupBadge group={news.group} />
                  <span className="text-[11px] text-muted-foreground">
                    {news.sourceName}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {news.date}
                </span>
              </div>
            </DataItemCard>
          )}
        />
      </MasterDetailView>
    </>
  );
}
