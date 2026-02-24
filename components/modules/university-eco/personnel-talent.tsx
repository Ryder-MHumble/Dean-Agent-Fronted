"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserMinus } from "lucide-react";
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
import type { PersonnelChange } from "@/lib/types/university-eco";
import { mockPersonnelChanges } from "@/lib/mock-data/university-eco";

function TypeBadge({ type }: { type: PersonnelChange["type"] }) {
  const config = {
    任命: { color: "bg-blue-100 text-blue-700 border-blue-200" },
    离职: { color: "bg-red-100 text-red-700 border-red-200" },
    调动: { color: "bg-amber-100 text-amber-700 border-amber-200" },
  };
  const c = config[type];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {type}
    </Badge>
  );
}

function ImpactBadge({ level }: { level: PersonnelChange["impact"] }) {
  const config = {
    重大: { color: "bg-red-100 text-red-700 border-red-200" },
    较大: { color: "bg-amber-100 text-amber-700 border-amber-200" },
    一般: { color: "bg-green-100 text-green-700 border-green-200" },
  };
  const c = config[level];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", c.color)}>
      {level}影响
    </Badge>
  );
}

export default function PersonnelTalent() {
  const {
    selectedItem: selectedChange,
    open,
    close,
    isOpen,
  } = useDetailView<PersonnelChange>();

  const sortedChanges = useMemo(
    () =>
      [...mockPersonnelChanges].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">人事变动</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={15} suffix="条" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">新任命</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={6} suffix="人" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <UserMinus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">关键离职</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={3} suffix="人" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedChange
            ? {
                title: (
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {selectedChange.person}
                    <TypeBadge type={selectedChange.type} />
                  </h2>
                ),
                subtitle: (
                  <div className="flex items-center gap-2 flex-wrap mt-1 text-sm text-muted-foreground">
                    <span>{selectedChange.institution}</span>
                    <span>&middot;</span>
                    <span>{selectedChange.date}</span>
                  </div>
                ),
              }
            : undefined
        }
        detailContent={
          selectedChange && (
            <DetailArticleBody
              aiAnalysis={{
                title: "AI 影响分析",
                content: selectedChange.aiAnalysis,
                colorScheme: "violet",
              }}
              summary={selectedChange.detail}
              extraMeta={
                <div className="space-y-3">
                  <ImpactBadge level={selectedChange.impact} />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">职位变动</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedChange.fromPosition}</span>
                      <span className="text-violet-500 font-medium">→</span>
                      <span>{selectedChange.toPosition}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">人物背景</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedChange.background}
                    </p>
                  </div>
                </div>
              }
            />
          )
        }
        detailFooter={
          selectedChange && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("已加入重点关注人物");
                  close();
                }}
              >
                重点关注
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("人事分析报告已生成")}
              >
                生成报告
              </Button>
            </div>
          )
        }
      >
        <DateGroupedList
          items={sortedChanges}
          emptyMessage="暂无人事动态"
          renderItem={(change) => (
            <DataItemCard
              isSelected={selectedChange?.id === change.id}
              onClick={() => open(change)}
              accentColor="violet"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <ItemAvatar text={change.person.charAt(0)} />
                  <div>
                    <h4
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        accentConfig.violet.title,
                      )}
                    >
                      {change.person}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">
                        {change.fromPosition}
                      </span>
                      <span className="text-[11px] text-violet-500 font-medium mx-1">
                        →
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {change.toPosition}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ImpactBadge level={change.impact} />
                  <ItemChevron accentColor="violet" />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-[52px]">
                <TypeBadge type={change.type} />
                <span className="text-[11px] text-muted-foreground">
                  {change.institution}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate ml-[52px] mt-1">
                {change.background}
              </p>
            </DataItemCard>
          )}
        />
      </MasterDetailView>
    </>
  );
}
