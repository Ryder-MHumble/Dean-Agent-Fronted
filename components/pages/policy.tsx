"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionCard } from "@/components/motion"
import { FileText, Users, Heart } from "lucide-react"
import PolicyTrackingView from "@/components/policy/policy-tracking-view"
import NetworkIntelligenceView from "@/components/policy/network-intelligence-view"
import SocialActionsView from "@/components/policy/social-actions-view"

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<"policy" | "network" | "social">("policy")

  return (
    <div className="p-5 space-y-4">
      <MotionCard delay={0}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "policy" | "network" | "social")}
          className="space-y-4"
        >
          <div className="rounded-xl bg-muted/30 p-1">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto gap-1">
              <TabsTrigger
                value="policy"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <FileText className="h-4 w-4" />
                政策追踪
              </TabsTrigger>
              <TabsTrigger
                value="network"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Users className="h-4 w-4" />
                人脉情报
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                <Heart className="h-4 w-4" />
                社交行动
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="policy" className="mt-4">
            <PolicyTrackingView />
          </TabsContent>

          <TabsContent value="network" className="mt-4">
            <NetworkIntelligenceView />
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <SocialActionsView />
          </TabsContent>
        </Tabs>
      </MotionCard>
    </div>
  )
}
