"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Trophy } from "lucide-react";
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
import { mockResearchOutputs } from "@/lib/mock-data/university-eco";

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

  const sortedOutputs = useMemo(
    () =>
      [...mockResearchOutputs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">同行论文</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={32} suffix="篇" />
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
                <MotionNumber value={8} suffix="项" />
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
                <MotionNumber value={3} suffix="项" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <DetailArticleBody
              aiAnalysis={{
                title: "AI 竞争分析",
                content: selectedOutput.aiAnalysis,
                colorScheme: "purple",
              }}
              summary={selectedOutput.detail}
              extraMeta={
                <div className="space-y-3">
                  <InfluenceBadge level={selectedOutput.influence} />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">作者/团队</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOutput.authors}
                    </p>
                  </div>
                </div>
              }
            />
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
        <DateGroupedList
          items={sortedOutputs}
          emptyMessage="暂无科研成果"
          renderItem={(output) => (
            <DataItemCard
              isSelected={selectedOutput?.id === output.id}
              onClick={() => open(output)}
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
      </MasterDetailView>
    </>
  );
}
