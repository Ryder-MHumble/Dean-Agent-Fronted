"use client";

import { useState } from "react";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Building2 } from "lucide-react";
import PeerDynamics from "./peer-dynamics";
import ResearchTracking from "./research-tracking";

function UniversityTabs() {
  return (
    <TabsList
      aria-label="高校生态页面"
      className="grid h-auto w-full grid-cols-2 gap-1 bg-[#f1f4f8] p-1"
    >
      <TabsTrigger
        value="peers"
        className="gap-2 rounded-lg py-2 text-sm text-[#667085] data-[state=active]:bg-white data-[state=active]:text-[#1a3a5c] data-[state=active]:shadow-sm"
      >
        <Building2 className="h-4 w-4" aria-hidden="true" />
        同行动态
      </TabsTrigger>
      <TabsTrigger
        value="research"
        className="gap-2 rounded-lg py-2 text-sm text-[#667085] data-[state=active]:bg-white data-[state=active]:text-[#1a3a5c] data-[state=active]:shadow-sm"
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        科研成果追踪
      </TabsTrigger>
    </TabsList>
  );
}

export default function UniversityEcoModule() {
  const [activeTab, setActiveTab] = useState("peers");

  return (
    <IntelligencePageShell>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsContent value="peers" className="mt-0 min-h-0 flex-1">
          <PeerDynamics tabs={<UniversityTabs />} />
        </TabsContent>
        <TabsContent value="research" className="mt-0 min-h-0 flex-1">
          <ResearchTracking tabs={<UniversityTabs />} />
        </TabsContent>
      </Tabs>
    </IntelligencePageShell>
  );
}
