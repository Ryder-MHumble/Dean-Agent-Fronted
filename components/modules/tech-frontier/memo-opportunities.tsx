"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  CalendarCheck,
  FileStack,
  Sparkles,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import type { Opportunity } from "@/lib/types/tech-frontier";
import { mockOpportunities } from "@/lib/mock-data/tech-frontier";

const typeConfig: Record<Opportunity["type"], { color: string; bg: string }> = {
  合作: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  会议: { color: "text-green-700", bg: "bg-green-50 border-green-200" },
  内参: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

const priorityConfig: Record<
  Opportunity["priority"],
  { color: string; bg: string }
> = {
  紧急: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  高: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  中: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  低: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

export default function MemoOpportunities() {
  const { selectedItem: selectedOpp, open, close, isOpen } = useDetailView<Opportunity>();

  const cooperationCount = mockOpportunities.filter(
    (o) => o.type === "合作",
  ).length;
  const conferenceCount = mockOpportunities.filter(
    (o) => o.type === "会议",
  ).length;

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedOpp
          ? {
              title: (
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {selectedOpp.name}
                </h2>
              ),
              subtitle: (
                <p className="text-sm text-muted-foreground">
                  来源: {selectedOpp.source} · 截止日期: {selectedOpp.deadline}
                </p>
              ),
            }
          : undefined
      }
      detailContent={
        selectedOpp ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  typeConfig[selectedOpp.type].bg,
                  typeConfig[selectedOpp.type].color,
                )}
              >
                {selectedOpp.type}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  priorityConfig[selectedOpp.priority].bg,
                  priorityConfig[selectedOpp.priority].color,
                )}
              >
                优先级: {selectedOpp.priority}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock className="h-3.5 w-3.5" />
                <span>截止: {selectedOpp.deadline}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">机会详情</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedOpp.summary}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 border border-teal-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-semibold text-teal-700">
                  AI 优先级评估
                </span>
              </div>
              <p className="text-sm text-teal-700/80">
                {selectedOpp.aiAssessment}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">建议行动</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedOpp.actionSuggestion}
              </p>
            </div>
          </div>
        ) : null
      }
      detailFooter={
        selectedOpp ? (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                toast.success("已列入院长待办事项");
                close();
              }}
            >
              立即跟进
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("机会分析报告已生成")}
            >
              生成分析报告
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-500">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">合作机会</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={6} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">会议邀请</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={4} suffix="个" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <FileStack className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">内参推送</p>
              <p className="text-xl font-bold font-tabular text-purple-600">
                <MotionNumber value={9} suffix="篇" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              机会追踪清单
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              按优先级排序
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto max-h-[calc(100vh-320px)]">
            <div className="grid grid-cols-[1fr_60px_90px_60px_85px_1fr_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
              <span>机会名称</span>
              <span>类型</span>
              <span>来源</span>
              <span>优先级</span>
              <span>截止日期</span>
              <span>概要</span>
              <span></span>
            </div>
            <StaggerContainer>
              {mockOpportunities.map((opp) => (
                <StaggerItem key={opp.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full grid grid-cols-[1fr_60px_90px_60px_85px_1fr_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer",
                      selectedOpp?.id === opp.id && "bg-muted/40",
                    )}
                    onClick={() => open(opp)}
                  >
                    <div className="flex items-center gap-2">
                      {opp.priority === "紧急" && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                      )}
                      <span className="text-sm font-medium group-hover:text-blue-600 transition-colors truncate">
                        {opp.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] w-fit",
                        typeConfig[opp.type].bg,
                        typeConfig[opp.type].color,
                      )}
                    >
                      {opp.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      {opp.source}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] w-fit",
                        priorityConfig[opp.priority].bg,
                        priorityConfig[opp.priority].color,
                      )}
                    >
                      {opp.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{opp.deadline}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {opp.summary}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </CardContent>
      </Card>
    </MasterDetailView>
  );
}
