"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Trophy, Loader2 } from "lucide-react";
import { SkeletonResearchTracking } from "@/components/shared/skeleton-states";
import { MotionNumber } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import DetailArticleBody from "@/components/shared/detail-article-body";
import DateGroupedList from "@/components/shared/date-grouped-list";
import DataItemCard, {
  ItemAvatar,
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ResearchOutput } from "@/lib/types/university-eco";
import { useUniversityResearch } from "@/hooks/use-university-research";
import { fetchUniversityArticle } from "@/lib/api";

function TypeBadge({ type }: { type: ResearchOutput["type"] }) {
  const config = {
    论文: { color: "bg-blue-100 text-blue-700 border-blue-200" },
    专利: { color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    获奖: { color: "bg-amber-100 text-amber-700 border-amber-200" },
  };
  const c = config[type];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {type}
    </Badge>
  );
}

function InfluenceBadge({ level }: { level: ResearchOutput["influence"] }) {
  const config = {
    高: { color: "bg-red-100 text-red-700 border-red-200", label: "高影响力" },
    中: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "中影响力",
    },
    低: {
      color: "bg-green-100 text-green-700 border-green-200",
      label: "低影响力",
    },
  };
  const c = config[level];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {c.label}
    </Badge>
  );
}

export default function ResearchTracking() {
  const {
    selectedItem: selectedOutput,
    open,
    close,
    isOpen,
  } = useDetailView<ResearchOutput>();

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { items, typeStats, isLoading, itemCount, totalPages } =
    useUniversityResearch({ page, pageSize });

  const [articleContent, setArticleContent] = useState<{
    content?: string | null;
    images?: { src: string; alt: string | null }[];
  }>({});
  const [contentLoading, setContentLoading] = useState(false);

  const handleOpen = useCallback(
    async (output: ResearchOutput) => {
      open(output);
      setArticleContent({});

      if (output.content) return;

      setContentLoading(true);
      try {
        const detail = await fetchUniversityArticle(output.id);
        if (detail) {
          setArticleContent({
            content: detail.content,
            images: detail.images,
          });
        }
      } catch {
        // Silently fail
      } finally {
        setContentLoading(false);
      }
    },
    [open],
  );

  // Derive metric values from processed research type stats
  const metrics = useMemo(() => {
    if (!typeStats) {
      return { papers: 32, patents: 8, awards: 3 };
    }
    return {
      papers: typeStats.论文,
      patents: typeStats.专利,
      awards: typeStats.获奖,
    };
  }, [typeStats]);

  const sortedOutputs = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [items],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (isLoading) {
    return <SkeletonResearchTracking />;
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
      <div className="grid grid-cols-3 gap-4 mb-4 shrink-0">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">同行论文</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.papers} suffix="篇" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">新专利</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.patents} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">重大获奖</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={metrics.awards} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0">
        <MasterDetailView
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedOutput
              ? {
                  title: (
                    <h2 className="text-lg font-semibold">
                      {selectedOutput.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-sm text-muted-foreground">
                      <TypeBadge type={selectedOutput.type} />
                      <span>{selectedOutput.institution}</span>
                      <span>&middot;</span>
                      <span>{selectedOutput.field}</span>
                      <span>&middot;</span>
                      <span>{selectedOutput.date}</span>
                    </div>
                  ),
                }
              : undefined
          }
          detailContent={
            selectedOutput && (
              <>
                {contentLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>加载原文内容...</span>
                  </div>
                )}
                <DetailArticleBody
                  aiAnalysis={{
                    title: "AI 竞争分析",
                    content: selectedOutput.aiAnalysis,
                    colorScheme: "purple",
                  }}
                  content={
                    selectedOutput.content ||
                    articleContent.content ||
                    undefined
                  }
                  summary={
                    !(selectedOutput.content || articleContent.content)
                      ? selectedOutput.detail
                      : undefined
                  }
                  images={
                    selectedOutput.images?.length
                      ? selectedOutput.images
                      : articleContent.images
                  }
                  extraMeta={
                    <div className="space-y-3">
                      <InfluenceBadge level={selectedOutput.influence} />
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          作者/团队
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedOutput.authors}
                        </p>
                      </div>
                    </div>
                  }
                />
              </>
            )
          }
          detailFooter={
            selectedOutput && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已加入重点跟踪列表");
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
          <div className="flex flex-col gap-3 pb-2">
            <DateGroupedList
              key={page}
              items={sortedOutputs}
              emptyMessage="暂无科研成果"
              renderItem={(output) => (
                <DataItemCard
                  isSelected={selectedOutput?.id === output.id}
                  onClick={() => handleOpen(output)}
                  accentColor="purple"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <ItemAvatar text={output.institution.charAt(0)} />
                      <div>
                        <h4
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            accentConfig.purple.title,
                          )}
                        >
                          {output.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <span>{output.institution}</span>
                          <span>&middot;</span>
                          <span>{output.field}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfluenceBadge level={output.influence} />
                      <ItemChevron accentColor="purple" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-[52px]">
                    <TypeBadge type={output.type} />
                    <span className="text-xs text-muted-foreground truncate max-w-[500px]">
                      {output.authors}
                    </span>
                  </div>
                </DataItemCard>
              )}
            />
            <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs text-muted-foreground">
              <span>
                第 {page}/{totalPages} 页，共 {itemCount} 条
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((prev) => Math.max(1, prev - 1));
                    close();
                    setArticleContent({});
                  }}
                  disabled={page <= 1}
                >
                  上一页
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((prev) => Math.min(totalPages, prev + 1));
                    close();
                    setArticleContent({});
                  }}
                  disabled={page >= totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        </MasterDetailView>
      </div>
    </div>
  );
}
