"use client";

import { useState, useEffect } from "react";
import AppShell, { TopBar } from "@/components/app-shell";
import FloatingAIAssistant from "@/components/floating-ai-assistant";
import HomeModule from "@/components/modules/home";
import PolicyIntelModule from "@/components/modules/policy-intel";
import TechFrontierModule from "@/components/modules/tech-frontier";
import TalentRadarModule from "@/components/modules/talent-radar";
import UniversityEcoModule from "@/components/modules/university-eco";
import InternalMgmtModule from "@/components/modules/internal-mgmt";
import NetworkModule from "@/components/modules/network";
import SmartScheduleModule from "@/components/modules/smart-schedule";
import CommandPalette from "@/components/shared/command-palette";
import { MotionPage } from "@/components/motion";
import { Toaster } from "sonner";
import { pageMeta } from "@/lib/mock-data/navigation";

export default function Page() {
  const [activePage, setActivePage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const meta = pageMeta[activePage] || pageMeta.home;

  // Auto-collapse sidebar on narrow screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setSidebarCollapsed(true);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AppShell
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main
        className="flex-1 transition-[margin-left] duration-200 ease-out"
        style={{ marginLeft: sidebarCollapsed ? 70 : 220 }}
      >
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onNavigate={setActivePage}
          searchSlot={<CommandPalette onNavigate={setActivePage} />}
        />
        <div className="min-h-[calc(100vh-64px)]">
          <MotionPage pageKey={activePage}>
            {activePage === "home" && <HomeModule onNavigate={setActivePage} />}
            {activePage === "policy-intel" && <PolicyIntelModule />}
            {activePage === "tech-frontier" && <TechFrontierModule />}
            {activePage === "talent-radar" && <TalentRadarModule />}
            {activePage === "university-eco" && <UniversityEcoModule />}
            {activePage === "internal-mgmt" && <InternalMgmtModule />}
            {activePage === "network" && <NetworkModule />}
            {activePage === "smart-schedule" && <SmartScheduleModule />}
          </MotionPage>
        </div>
      </main>
      <FloatingAIAssistant />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
