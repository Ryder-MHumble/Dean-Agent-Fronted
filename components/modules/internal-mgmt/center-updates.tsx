"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataFreshness from "@/components/shared/data-freshness";
import { ChevronRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CenterBrief } from "@/lib/types/internal-mgmt";
import { mockCenterEvents, mockCenters } from "@/lib/mock-data/internal-mgmt";

const eventTypeConfig: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  achievement: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  risk: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  personnel: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  "key-number": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  milestone: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

const statusTypeConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  normal: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  risk: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function CenterUpdates() {
  const { selectedItem: selectedCenter, open, close, isOpen } = useDetailView<CenterBrief>();

  return (
    <div className="space-y-4">
      {/* Event Feed */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                关键事件
              </CardTitle>
              <DataFreshness
                updatedAt={new Date(Date.now() - 1800000)}
              />
            </div>
            <Badge variant="secondary" className="text-[10px]">
              按时间倒序
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StaggerContainer>
            {mockCenterEvents.map((event) => {
              const config = eventTypeConfig[event.type] || eventTypeConfig.milestone;
              return (
                <StaggerItem key={event.id}>
                  <div className="flex items-start gap-3 py-3 border-b last:border-0">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mt-1.5 shrink-0",
                        config.dot,
                        event.type === "risk" && "animate-pulse-subtle",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            config.bg,
                            config.text,
                            config.border,
                          )}
                        >
                          {event.typeLabel}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {event.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                        {event.summary}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{event.center}</span>
                        <span>·</span>
                        <span>{event.time}</span>
                        <span>·</span>
                        <span>来源: {event.source}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </CardContent>
      </Card>

      {/* Center Cards with MasterDetailView */}
      <MasterDetailView
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedCenter
            ? {
                title: (
                  <h2 className="text-lg font-semibold">
                    {selectedCenter.name}
                  </h2>
                ),
                subtitle: (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>负责人：{selectedCenter.leader}</span>
                    <span>·</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        statusTypeConfig[selectedCenter.statusType].bg,
                        statusTypeConfig[selectedCenter.statusType].text,
                        statusTypeConfig[selectedCenter.statusType].border,
                      )}
                    >
                      {selectedCenter.statusTag}
                    </Badge>
                  </div>
                ),
              }
            : undefined
        }
        detailContent={
          selectedCenter && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">近期动态</h4>
                <div className="space-y-2">
                  {selectedCenter.keyUpdates.map((u) => (
                    <div
                      key={u}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                      <span className="leading-relaxed">{u}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">详细情况</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedCenter.detail}
                </p>
              </div>
            </div>
          )
        }
        detailFooter={
          selectedCenter && (
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
                onClick={() => toast.success("运营简报已导出")}
              >
                导出简报
              </Button>
            </div>
          )
        }
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              各中心概览
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {mockCenters.map((center) => {
                const sConfig = statusTypeConfig[center.statusType];
                return (
                  <button
                    key={center.id}
                    type="button"
                    className={cn(
                      "text-left rounded-lg border p-3 transition-all group cursor-pointer",
                      selectedCenter?.id === center.id
                        ? "border-blue-300 bg-blue-50/50 shadow-sm"
                        : "hover:bg-muted/30 hover:border-blue-200",
                    )}
                    onClick={() => open(center)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                        {center.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        {center.leader}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          sConfig.bg,
                          sConfig.text,
                          sConfig.border,
                        )}
                      >
                        {center.statusTag}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {center.keyUpdates.slice(0, 2).map((u) => (
                        <div
                          key={u}
                          className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
                        >
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                          <span className="line-clamp-1">{u}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </MasterDetailView>
    </div>
  );
}
