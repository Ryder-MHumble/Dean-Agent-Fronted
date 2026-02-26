"use client";

import { useState, useEffect } from "react";
import AppShell, { TopBar } from "@/components/app-shell";
import FloatingAIAssistant from "@/components/floating-ai-assistant";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import dynamic from "next/dynamic";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

const HomeModule = dynamic(() => import("@/components/modules/home"), {
  ssr: false,
  loading: () => <PageLoadingSkeleton />,
});
const PolicyIntelModule = dynamic(
  () => import("@/components/modules/policy-intel"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const TechFrontierModule = dynamic(
  () => import("@/components/modules/tech-frontier"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const TalentRadarModule = dynamic(
  () => import("@/components/modules/talent-radar"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const UniversityEcoModule = dynamic(
  () => import("@/components/modules/university-eco"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const InternalMgmtModule = dynamic(
  () => import("@/components/modules/internal-mgmt"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const NetworkModule = dynamic(() => import("@/components/modules/network"), {
  ssr: false,
  loading: () => <PageLoadingSkeleton />,
});
const SmartScheduleModule = dynamic(
  () => import("@/components/modules/smart-schedule"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
import CommandPalette from "@/components/shared/command-palette";
import { MotionPage, PageLoadingSkeleton } from "@/components/motion";
import { Toaster } from "sonner";
import { pageMeta } from "@/lib/mock-data/navigation";

export default function Page() {
  const [activePage, setActivePage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const meta = pageMeta[activePage] || pageMeta.home;

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setMobileOpen(false);
  };
  const breakpoint = useBreakpoint();

  // Auto-collapse sidebar on tablet/mobile
  useEffect(() => {
    if (breakpoint === "mobile" || breakpoint === "tablet") {
      setSidebarCollapsed(true);
    }
  }, [breakpoint]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppShell
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <main
        className={cn(
          "flex-1 transition-[margin-left] duration-200 ease-out pb-20 md:pb-0",
          sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[220px]",
        )}
      >
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onNavigate={handleNavigate}
          searchSlot={
            <CommandPalette
              onNavigate={handleNavigate}
              open={searchOpen}
              onOpenChange={setSearchOpen}
            />
          }
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <div className="min-h-[calc(100vh-64px)]">
          <MotionPage pageKey={activePage}>
            {activePage === "home" && (
              <HomeModule onNavigate={handleNavigate} />
            )}
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
      <MobileBottomNav activePage={activePage} onNavigate={handleNavigate} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
