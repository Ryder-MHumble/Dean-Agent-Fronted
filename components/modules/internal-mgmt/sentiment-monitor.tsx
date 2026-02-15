"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataFreshness from "@/components/shared/data-freshness";
import { Globe } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { mockSocialMedia } from "@/lib/mock-data/internal-mgmt";

const riskCount = mockSocialMedia.filter((i) => i.risk).length;

export default function SentimentMonitor() {
  return (
    <div className="space-y-4">
      {/* Social media feed */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                社媒舆情监测
              </CardTitle>
              <DataFreshness updatedAt={new Date(Date.now() - 7200000)} />
            </div>
            <div className="flex items-center gap-2">
              {riskCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-red-200 bg-red-50 text-red-700"
                >
                  {riskCount}条风险
                </Badge>
              )}
              <Badge variant="secondary" className="text-[10px]">
                共{mockSocialMedia.length}条
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StaggerContainer>
            {mockSocialMedia.map((item) => (
              <StaggerItem key={item.id}>
                <div
                  className={cn(
                    "flex items-start gap-3 py-3 px-3 border-b last:border-0 rounded-sm transition-colors",
                    item.risk
                      ? "bg-red-50/50 hover:bg-red-50"
                      : "hover:bg-muted/20",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shrink-0",
                      item.iconColor,
                    )}
                  >
                    {item.platformIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {item.platform}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.time}
                      </span>
                      {item.risk && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-red-200 bg-red-50 text-red-700"
                        >
                          需关注
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </CardContent>
      </Card>
    </div>
  );
}
