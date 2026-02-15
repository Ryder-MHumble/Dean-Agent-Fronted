"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataFreshness from "@/components/shared/data-freshness";
import { Sparkles, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ProjectBrief } from "@/lib/types/internal-mgmt";
import {
  timelineProjects,
  mockProjects,
  mockMilestones,
} from "@/lib/mock-data/internal-mgmt";

const months = ["1月", "2月", "3月", "4月", "5月", "6月"];

const statusConfig: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  risk: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500 animate-pulse-subtle",
  },
  "in-progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
};

export default function ProjectSupervision() {
  const { selectedItem: selectedProject, open, close, isOpen } = useDetailView<ProjectBrief>();

  const sortedProjects = [...mockProjects].sort((a, b) => {
    const order = { risk: 0, "in-progress": 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="space-y-4">
      {/* Gantt Timeline */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                关键项目时间线
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                监控活跃的战略项目
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[11px] text-muted-foreground">
                  正常
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-[11px] text-muted-foreground">
                  预警
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[11px] text-muted-foreground">
                  严重
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TooltipProvider delayDuration={200}>
            <div className="flex">
              <div className="w-40 shrink-0 border-b pb-2 text-[11px] font-medium text-muted-foreground">
                项目名称
              </div>
              <div className="grid flex-1 grid-cols-6 border-b">
                {months.map((m, i) => (
                  <div
                    key={m}
                    className={`pb-2 text-center text-[11px] font-medium text-muted-foreground ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none"
                style={{ left: `calc(${(1.3 / 6) * 100}% + 160px)` }}
              >
                <div className="flex flex-col items-center h-full">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 text-[9px] font-medium text-white shadow-glow-blue">
                    今日
                  </div>
                  <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-500 to-blue-200 animate-glow-pulse" />
                </div>
              </div>

              <StaggerContainer>
                {timelineProjects.map((project) => (
                  <StaggerItem key={project.name}>
                    <div className="group flex items-center border-b py-4 hover:bg-muted/20 transition-colors rounded-sm">
                      <div className="w-40 shrink-0 pl-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${project.dotColor} ${project.status === "supply" ? "animate-pulse-subtle" : ""}`}
                          />
                          <span
                            className={`text-[10px] ${project.statusColor}`}
                          >
                            {project.statusLabel}
                          </span>
                        </div>
                      </div>
                      <div className="relative grid flex-1 grid-cols-6">
                        {months.map((_, i) => (
                          <div
                            key={i}
                            className={`absolute top-0 bottom-0 ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                            style={{
                              left: `${(i / 6) * 100}%`,
                              width: `${(1 / 6) * 100}%`,
                            }}
                          />
                        ))}
                        {project.bars.map((bar) => (
                          <Tooltip key={bar.label}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{
                                  duration: 0.5,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                  delay: 0.3,
                                }}
                                style={{
                                  gridColumnStart: bar.start,
                                  gridColumnEnd: bar.start + bar.width,
                                  transformOrigin: "left",
                                }}
                                className={`relative z-[1] flex h-8 items-center justify-center rounded-md border text-[10px] font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${bar.gradient} ${bar.borderColor} ${bar.textColor} ${bar.hoverShadow}`}
                              >
                                {bar.label}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[200px]"
                            >
                              <div className="space-y-1">
                                <p className="font-semibold text-sm">
                                  {project.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>阶段: {project.phase}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>负责人: {project.owner}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <span
                                    className={`${project.dotColor} h-1.5 w-1.5 rounded-full`}
                                  />
                                  <span className={project.statusColor}>
                                    {project.statusLabel}
                                  </span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Project list with MasterDetailView */}
      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedProject
            ? {
                title: (
                  <h2 className="text-lg font-semibold">
                    {selectedProject.name}
                  </h2>
                ),
                subtitle: (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>
                      {selectedProject.owner} / {selectedProject.department}
                    </span>
                    <span>·</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        statusConfig[selectedProject.status].bg,
                        statusConfig[selectedProject.status].text,
                        statusConfig[selectedProject.status].border,
                      )}
                    >
                      {selectedProject.statusLabel}
                    </Badge>
                  </div>
                ),
              }
            : undefined
        }
        detailContent={
          selectedProject && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">当前状态</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProject.currentStatus}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">最新进展</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProject.latestUpdate}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">详情</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProject.detail}
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
                  {selectedProject.aiInsight}
                </p>
              </div>
            </div>
          )
        }
        detailFooter={
          selectedProject && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("已发送督办通知");
                  close();
                }}
              >
                督办跟进
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("项目报告已导出")}
              >
                导出报告
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
                  项目进展
                </CardTitle>
                <DataFreshness updatedAt={new Date(Date.now() - 7200000)} />
              </div>
              <Badge variant="secondary" className="text-[10px]">
                按关注度排序
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <StaggerContainer>
              {sortedProjects.map((project) => {
                const config = statusConfig[project.status];
                return (
                  <StaggerItem key={project.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-4 border-b last:border-0 transition-colors group cursor-pointer",
                        selectedProject?.id === project.id
                          ? "bg-blue-50/80 border-l-2 border-blue-500"
                          : "hover:bg-muted/30",
                      )}
                      onClick={() => open(project)}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              config.dot,
                            )}
                          />
                          <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              config.bg,
                              config.text,
                              config.border,
                            )}
                          >
                            {project.statusLabel}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                      </div>
                      <div className="pl-4 mb-1.5">
                        <span className="text-xs text-muted-foreground">
                          {project.owner} / {project.department}
                        </span>
                      </div>
                      <div className="pl-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {project.currentStatus}
                        </p>
                      </div>
                    </button>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </CardContent>
        </Card>
      </MasterDetailView>

      {/* Milestones */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">
              近期里程碑
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-0">
            {mockMilestones.map((milestone, index) => (
              <div
                key={milestone.description}
                className="flex items-start gap-3 py-2.5 border-b last:border-0"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                  {index < mockMilestones.length - 1 && (
                    <div className="w-px h-full bg-border flex-1 min-h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      {milestone.date}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {milestone.projectName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
