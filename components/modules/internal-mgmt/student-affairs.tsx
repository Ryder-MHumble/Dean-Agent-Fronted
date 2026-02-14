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
  GraduationCap,
  Heart,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Users,
  TrendingUp,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  MotionNumber,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudentAlert } from "@/lib/types/internal-mgmt";
import {
  mockStudentAlerts,
  studentSummary,
} from "@/lib/mock-data/internal-mgmt";

export default function StudentAffairs() {
  const [selectedAlert, setSelectedAlert] = useState<StudentAlert | null>(null);

  const totalStudents = studentSummary.totalStudents;
  const mentalWarnings = mockStudentAlerts.filter(
    (a) => a.type === "心理预警",
  ).length;
  const pendingAlerts = mockStudentAlerts.length;
  const employmentRate = studentSummary.employmentRate;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">在读研究生</p>
              <p className="text-xl font-bold font-tabular">
                <MotionNumber value={totalStudents} suffix="人" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">心理预警</p>
              <p className="text-xl font-bold font-tabular text-red-600">
                <MotionNumber value={mentalWarnings} suffix="人" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">待处理预警</p>
              <p className="text-xl font-bold font-tabular text-amber-600">
                <MotionNumber value={pendingAlerts} suffix="条" />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">就业率</p>
              <p className="text-xl font-bold font-tabular text-green-600">
                <MotionNumber value={employmentRate} suffix="%" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  学生预警列表
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  按紧急程度排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-auto max-h-[calc(100vh-320px)]">
                <div className="grid grid-cols-[80px_90px_80px_60px_1fr_40px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
                  <span>学生</span>
                  <span>年级</span>
                  <span>类型</span>
                  <span>级别</span>
                  <span>摘要</span>
                  <span></span>
                </div>
                <StaggerContainer>
                  {mockStudentAlerts.map((alert) => (
                    <StaggerItem key={alert.id}>
                      <button
                        type="button"
                        className="w-full grid grid-cols-[80px_90px_80px_60px_1fr_40px] gap-2 px-3 py-3 items-center text-left border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {alert.level === "紧急" && (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                            {alert.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {alert.grade}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-red-200 bg-red-50 text-red-700":
                              alert.type === "心理预警",
                            "border-amber-200 bg-amber-50 text-amber-700":
                              alert.type === "学业预警",
                            "border-blue-200 bg-blue-50 text-blue-700":
                              alert.type === "考勤异常",
                            "border-purple-200 bg-purple-50 text-purple-700":
                              alert.type === "经济困难",
                          })}
                        >
                          {alert.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] w-fit", {
                            "border-red-200 bg-red-50 text-red-700":
                              alert.level === "紧急",
                            "border-amber-200 bg-amber-50 text-amber-700":
                              alert.level === "关注",
                            "border-gray-200 bg-gray-50 text-gray-600":
                              alert.level === "提醒",
                          })}
                        >
                          {alert.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">
                          {alert.summary}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold">学生关怀分析</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                当前共有{pendingAlerts}条学生预警待处理，其中{mentalWarnings}
                例心理预警需优先关注。张明远同学情况较为紧急，建议24小时内启动干预流程。整体学生心理健康状况稳定，但临近学期末压力期需加强巡查。
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    张明远心理预警为紧急级别，需立即干预
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    李思雨博士学业滞后，需协调导师关系
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    赵鹏飞家庭突变，建议加急困难补助
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">
                    整体就业率94%，高于院系平均水平
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs"
                  onClick={() => toast.success("正在生成学生关怀报告...")}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  关怀报告
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                  onClick={() => toast.success("正在生成预警处置方案...")}
                >
                  <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                  处置方案
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedAlert && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">
                  {selectedAlert.name}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 flex-wrap">
                  <span>{selectedAlert.grade}</span>
                  <span>·</span>
                  <span>{selectedAlert.major}</span>
                  <span>·</span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700":
                        selectedAlert.type === "心理预警",
                      "border-amber-200 bg-amber-50 text-amber-700":
                        selectedAlert.type === "学业预警",
                      "border-blue-200 bg-blue-50 text-blue-700":
                        selectedAlert.type === "考勤异常",
                      "border-purple-200 bg-purple-50 text-purple-700":
                        selectedAlert.type === "经济困难",
                    })}
                  >
                    {selectedAlert.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", {
                      "border-red-200 bg-red-50 text-red-700":
                        selectedAlert.level === "紧急",
                      "border-amber-200 bg-amber-50 text-amber-700":
                        selectedAlert.level === "关注",
                      "border-gray-200 bg-gray-50 text-gray-600":
                        selectedAlert.level === "提醒",
                    })}
                  >
                    {selectedAlert.level}
                  </Badge>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">预警详情</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedAlert.detail}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-700">
                      AI 建议
                    </span>
                  </div>
                  <p className="text-sm text-red-700/80 leading-relaxed">
                    {selectedAlert.aiRecommendation}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success("已分配辅导员跟进处理");
                      setSelectedAlert(null);
                    }}
                  >
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    分配辅导员
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("已生成干预方案")}
                  >
                    生成干预方案
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
