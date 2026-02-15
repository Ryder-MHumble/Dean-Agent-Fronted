"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataFreshness from "@/components/shared/data-freshness";
import {
  GraduationCap,
  AlertTriangle,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Users,
  ExternalLink,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudentAlert } from "@/lib/types/internal-mgmt";
import {
  mockStudentPapers,
  mockEnrollment,
  mockStudentAlerts,
} from "@/lib/mock-data/internal-mgmt";

const uncreditedPapers = mockStudentPapers.filter((p) => !p.credited);

export default function StudentMgmt() {
  const { selectedItem: selectedAlert, open, close, isOpen } = useDetailView<StudentAlert>();

  return (
    <>
      <div className="space-y-4">
        {/* Paper achievements */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">
                  论文成果追踪
                </CardTitle>
                <DataFreshness updatedAt={new Date(Date.now() - 3600000)} />
              </div>
              <div className="flex items-center gap-2">
                {uncreditedPapers.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-red-200 bg-red-50 text-red-700"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {uncreditedPapers.length}篇未署名研究院
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px]">
                  共{mockStudentPapers.length}篇
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-auto">
              <div className="grid grid-cols-[1fr_80px_90px_80px_120px_80px_60px] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b">
                <span>论文标题</span>
                <span>学生</span>
                <span>年级</span>
                <span>导师</span>
                <span>发表/投稿</span>
                <span>来源</span>
                <span>署名</span>
              </div>
              <StaggerContainer>
                {mockStudentPapers.map((paper) => (
                  <StaggerItem key={paper.id}>
                    <div
                      className={cn(
                        "grid grid-cols-[1fr_80px_90px_80px_120px_80px_60px] gap-2 px-3 py-3 items-center border-b last:border-0 transition-colors",
                        !paper.credited
                          ? "bg-red-50/50 hover:bg-red-50"
                          : "hover:bg-muted/30",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {paper.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {paper.venue}
                        </p>
                      </div>
                      <span className="text-xs text-foreground font-medium">
                        {paper.student}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {paper.grade}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {paper.advisor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {paper.date}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {paper.source}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] w-fit",
                          paper.credited
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700",
                        )}
                      >
                        {paper.credited ? "已署名" : "未署名"}
                      </Badge>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment data */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                招生与在读数据
              </CardTitle>
              <DataFreshness updatedAt={new Date(Date.now() - 86400000)} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {mockEnrollment.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg border p-3 hover:bg-muted/20 transition-colors"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.category}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {item.count}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {item.changeType === "up" && (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    )}
                    {item.changeType === "down" && (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    {item.changeType === "flat" && (
                      <Minus className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={cn("text-[11px]", {
                        "text-green-600": item.changeType === "up",
                        "text-red-600": item.changeType === "down",
                        "text-muted-foreground": item.changeType === "flat",
                      })}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student alerts */}
        <MasterDetailView
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedAlert
              ? {
                  title: (
                    <h2 className="text-lg font-semibold">
                      {selectedAlert.name}
                    </h2>
                  ),
                  subtitle: (
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-sm text-muted-foreground">
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
                          "border-purple-200 bg-purple-50 text-purple-700":
                            selectedAlert.type === "经济困难",
                        })}
                      >
                        {selectedAlert.type}
                      </Badge>
                    </div>
                  ),
                }
              : undefined
          }
          detailContent={
            selectedAlert && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">预警详情</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedAlert.detail}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-700">
                      AI 建议
                    </span>
                  </div>
                  <p className="text-sm text-blue-700/80 leading-relaxed">
                    {selectedAlert.aiRecommendation}
                  </p>
                </div>
              </div>
            )
          }
          detailFooter={
            selectedAlert && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success("已分配辅导员跟进处理");
                    close();
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
            )
          }
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">
                    学生预警
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">
                    {mockStudentAlerts.length}条待处理
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <StaggerContainer>
                {mockStudentAlerts.map((alert) => (
                  <StaggerItem key={alert.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left flex items-start gap-3 px-3 py-3 border-b last:border-0 transition-colors group cursor-pointer",
                        selectedAlert?.id === alert.id
                          ? "bg-blue-50/80 border-l-2 border-blue-500"
                          : "hover:bg-muted/30",
                      )}
                      onClick={() => open(alert)}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-1.5 shrink-0",
                          alert.level === "紧急"
                            ? "bg-red-500 animate-pulse-subtle"
                            : alert.level === "关注"
                              ? "bg-amber-500"
                              : "bg-gray-400",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                            {alert.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {alert.grade}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", {
                              "border-red-200 bg-red-50 text-red-700":
                                alert.type === "心理预警",
                              "border-amber-200 bg-amber-50 text-amber-700":
                                alert.type === "学业预警",
                              "border-purple-200 bg-purple-50 text-purple-700":
                                alert.type === "经济困难",
                            })}
                          >
                            {alert.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", {
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
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alert.summary}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        </MasterDetailView>
      </div>
    </>
  );
}
