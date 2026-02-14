"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Users,
  UserPlus,
  UserMinus,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
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
  const [selectedChange, setSelectedChange] = useState<PersonnelChange | null>(
    null,
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

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              同行机构人事变动追踪
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              按影响评估排序
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
            <StaggerContainer className="space-y-3">
              {mockPersonnelChanges.map((change) => (
                <StaggerItem key={change.id}>
                  <button
                    type="button"
                    className="w-full rounded-lg border p-4 hover:border-violet-200 hover:shadow-sm transition-all group cursor-pointer text-left"
                    onClick={() => setSelectedChange(change)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                          {change.person.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold group-hover:text-violet-600 transition-colors">
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
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-[52px]">
                      <TypeBadge type={change.type} />
                      <span className="text-[11px] text-muted-foreground">
                        {change.institution}
                      </span>
                      <span className="text-[11px] text-muted-foreground ml-auto">
                        {change.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate ml-[52px] mt-1">
                      {change.background}
                    </p>
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </CardContent>
      </Card>

      <Sheet
        open={!!selectedChange}
        onOpenChange={() => setSelectedChange(null)}
      >
        <SheetContent className="sm:max-w-lg">
          {selectedChange && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  {selectedChange.person}
                  <TypeBadge type={selectedChange.type} />
                </SheetTitle>
                <SheetDescription>
                  {selectedChange.institution} · {selectedChange.date}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ImpactBadge level={selectedChange.impact} />
                </div>
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
                <div>
                  <h4 className="text-sm font-semibold mb-2">详细信息</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChange.detail}
                  </p>
                </div>
                <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-semibold text-violet-700">
                      AI 影响分析
                    </span>
                  </div>
                  <p className="text-sm text-violet-700/80">
                    {selectedChange.aiAnalysis}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success("已加入重点关注人物");
                      setSelectedChange(null);
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
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
