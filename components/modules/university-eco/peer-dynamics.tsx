"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  ExternalLink,
  Building2,
  FlaskConical,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
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
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium", c.color)}
    >
      {c.label}
    </Badge>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  return dateStr;
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
              }
            : undefined
        }
        detailContent={
          selectedNews && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">内容摘要</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedNews.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNews.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-700">
                    AI 摘要分析
                  </span>
                </div>
                <p className="text-sm text-indigo-700/80">
                  该动态来源于{selectedNews.sourceName}
                  ，与我院研究方向存在潜在关联。建议关注后续进展并评估合作可能性。
                </p>
              </div>
            </div>
          )
        }
        detailFooter={
          selectedNews && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.open(selectedNews.url, "_blank");
                }}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                查看原文
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("已加入重点跟踪");
                  close();
                }}
              >
                重点跟踪
              </Button>
            </div>
          )
        }
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                同行机构新闻动态
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                按更新时间排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <StaggerContainer className="space-y-2.5">
                {filteredNews.map((news) => (
                  <StaggerItem key={news.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-lg border p-4 transition-all group cursor-pointer text-left",
                        selectedNews?.id === news.id
                          ? "border-blue-300 bg-blue-50/50 shadow-sm"
                          : "hover:border-blue-200 hover:shadow-sm",
                      )}
                      onClick={() => open(news)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-semibold leading-snug group-hover:text-blue-600 transition-colors flex-1">
                          {news.title}
                        </h4>
                        <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
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
                          {formatDate(news.date)}
                        </span>
                      </div>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </CardContent>
        </Card>
      </MasterDetailView>
    </>
  );
}
