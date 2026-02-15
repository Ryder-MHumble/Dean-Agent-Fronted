"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Lightbulb,
  Trophy,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
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
  const { selectedItem: selectedOutput, open, close, isOpen } = useDetailView<ResearchOutput>();

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
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOutput.institution} · {selectedOutput.field} ·{" "}
                    {selectedOutput.date}
                  </p>
                ),
              }
            : undefined
        }
        detailContent={
          selectedOutput && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TypeBadge type={selectedOutput.type} />
                <InfluenceBadge level={selectedOutput.influence} />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">作者/团队</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedOutput.authors}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">详细信息</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedOutput.detail}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 border border-purple-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">
                    AI 竞争分析
                  </span>
                </div>
                <p className="text-sm text-purple-700/80">
                  {selectedOutput.aiAnalysis}
                </p>
              </div>
            </div>
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
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                同行机构科研成果追踪
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                按影响力排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
              <StaggerContainer className="space-y-3">
                {mockResearchOutputs.map((output) => (
                  <StaggerItem key={output.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-lg border p-4 transition-all group cursor-pointer text-left",
                        selectedOutput?.id === output.id
                          ? "border-purple-300 bg-purple-50/50 shadow-sm"
                          : "hover:border-purple-200 hover:shadow-sm",
                      )}
                      onClick={() => open(output)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                            {output.institution.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold group-hover:text-purple-600 transition-colors">
                              {output.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-muted-foreground">
                                {output.institution}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                ·
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {output.field}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                ·
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {output.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <InfluenceBadge level={output.influence} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-[52px]">
                        <TypeBadge type={output.type} />
                        <span className="text-xs text-muted-foreground truncate max-w-[500px]">
                          {output.authors}
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
