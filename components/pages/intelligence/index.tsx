"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Cpu, Eye, Sparkles } from "lucide-react";
import { MotionCard } from "@/components/motion";
import PolicyTab from "./policy-tab";
import TechTab from "./tech-tab";
import CompetitorTab from "./competitor-tab";

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<"policy" | "tech" | "competitor">(
    "policy",
  );

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* AI Summary Bar */}
      <MotionCard delay={0}>
        <Card className="shadow-card border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">情报摘要：</span>
                  本周新增3条匹配政策（最高匹配度98%），具身智能方向热度飙升但我院未布局（状态提示），清华AIR发布2项新成果需关注。
                </p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">
                    政策{" "}
                    <span className="font-semibold text-foreground">3</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">
                    缺口{" "}
                    <span className="font-semibold text-foreground">1</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    竞对{" "}
                    <span className="font-semibold text-foreground">5</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      {/* Tabs */}
      <MotionCard delay={0.1}>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "policy" | "tech" | "competitor")
          }
          className="space-y-4"
        >
          <div className="rounded-xl bg-muted/30 p-1">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto gap-1">
              <TabsTrigger
                value="policy"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">政策红利池</span>
                <span className="sm:hidden">政策</span>
              </TabsTrigger>
              <TabsTrigger
                value="tech"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Cpu className="h-4 w-4" />
                <span className="hidden sm:inline">技术风向标</span>
                <span className="sm:hidden">技术</span>
              </TabsTrigger>
              <TabsTrigger
                value="competitor"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">竞对监测</span>
                <span className="sm:hidden">竞对</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="policy" className="mt-4">
            <PolicyTab />
          </TabsContent>

          <TabsContent value="tech" className="mt-4">
            <TechTab />
          </TabsContent>

          <TabsContent value="competitor" className="mt-4">
            <CompetitorTab />
          </TabsContent>
        </Tabs>
      </MotionCard>
    </div>
  );
}
