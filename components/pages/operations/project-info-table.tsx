"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { projectInfoData } from "@/lib/mock-data/operations";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export default function ProjectInfoTable() {
  const breakpoint = useBreakpoint();

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            重点项目进度
          </CardTitle>
          <button
            type="button"
            className="text-muted-foreground"
            onClick={() =>
              toast("重点项目进度", {
                description: "正在加载完整项目列表...",
              })
            }
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {breakpoint === "mobile" ? (
          <div className="space-y-3">
            {projectInfoData.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-border/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {project.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${project.statusColor}`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.owner}</span>
                  <span>{project.deadline}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 text-left font-medium">项目名称</th>
                    <th className="pb-2 text-left font-medium">状态</th>
                    <th className="pb-2 text-left font-medium">负责人</th>
                    <th className="pb-2 text-left font-medium">进度</th>
                    <th className="pb-2 text-left font-medium">截止日期</th>
                    <th className="pb-2 text-left font-medium">预算</th>
                  </tr>
                </thead>
                <tbody>
                  {projectInfoData.map((project) => (
                    <tr key={project.id} className="border-b last:border-0">
                      <td className="py-3 text-sm font-medium text-foreground">
                        {project.name}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${project.statusColor}`}
                        >
                          {project.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="text-sm text-foreground">
                            {project.owner}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {project.department}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {project.deadline}
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="text-sm text-foreground">
                            {project.spent}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            / {project.budget}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
