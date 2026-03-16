"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const events = [
  {
    time: "09:00 - 11:00",
    status: "进行中",
    title: "执行委员会月度会议",
    priority: "高优先级",
    priorityColor: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
  },
  {
    time: "14:00 - 15:30",
    status: "",
    title: "毕业典礼致辞准备",
    priority: "初稿待审阅",
    priorityColor: "bg-yellow-100 text-yellow-700",
    dotColor: "bg-gray-300",
    hasProgress: true,
  },
  {
    time: "16:30 - 17:00",
    status: "",
    title: "运营周会",
    priority: "",
    dotColor: "bg-gray-300",
    conflict: "与部委电话会议冲突",
  },
];

export function ScheduleSidebar() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{"2月10日星期二"}</CardTitle>
          <div className="flex gap-1">
            <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted">{"<"}</button>
            <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted">{">"}</button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.title} className="relative flex gap-2 border-l-2 border-muted pl-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${event.dotColor === "bg-blue-500" ? "text-blue-600" : "text-muted-foreground"}`}>
                    {event.time}
                  </span>
                  {event.status && (
                    <span className="text-[10px] text-blue-600">{". "}{event.status}</span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{event.title}</p>
                {event.priority && (
                  <Badge variant="secondary" className={`mt-1.5 text-[10px] ${event.priorityColor}`}>
                    {event.priority}
                  </Badge>
                )}
                {event.hasProgress && (
                  <div className="mt-2">
                    <Progress value={35} className="h-1.5" />
                  </div>
                )}
                {event.conflict && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{event.conflict}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
