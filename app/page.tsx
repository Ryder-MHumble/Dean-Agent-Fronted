"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/app-shell";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import dynamic from "next/dynamic";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

const HomeModule = dynamic(() => import("@/components/modules/home"), {
  ssr: false,
  loading: () => <PageLoadingSkeleton />,
});
const PolicyIntelModule = dynamic(
  () => import("@/components/policy-intel-preview/policy-intel-preview"),
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
const SentimentModule = dynamic(
  () => import("@/components/modules/internal-mgmt/sentiment"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const PapersModule = dynamic(() => import("@/components/modules/papers"), {
  ssr: false,
  loading: () => <PageLoadingSkeleton />,
});
const AcademicAchievementsModule = dynamic(
  () =>
    import("@/components/modules/internal-shared/academic-achievements"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
const InternalExpertsModule = dynamic(
  () => import("@/components/modules/internal-shared/internal-experts"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
import { MotionPage, PageLoadingSkeleton } from "@/components/motion";
import { Toaster } from "sonner";

const visiblePages = new Set([
  "home",
  "policy-intel",
  "tech-frontier",
  "papers",
  "talent-radar",
  "university-eco",
  "sentiment",
  "academic-achievements",
  "internal-experts",
]);

export default function Page() {
  const [activePage, setActivePage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: string) => {
    if (!visiblePages.has(page)) return;
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
    <div className="flex min-h-[100dvh] bg-background">
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
          "min-w-0 flex-1 min-h-[100dvh] pb-20 transition-[margin-left] duration-200 ease-out md:pb-0",
          sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[220px]",
        )}
      >
        <div className="min-h-[calc(100dvh-5rem)] [--app-content-height:calc(100dvh-5rem)] md:min-h-[100dvh] md:[--app-content-height:100dvh]">
          {activePage === "papers" && <PapersModule />}
          {activePage === "academic-achievements" && (
            <AcademicAchievementsModule />
          )}
          {activePage === "internal-experts" && <InternalExpertsModule />}
          {![
            "papers",
            "academic-achievements",
            "internal-experts",
          ].includes(activePage) && (
            <MotionPage pageKey={activePage}>
              {activePage === "home" && (
                <HomeModule onNavigate={handleNavigate} />
              )}
              {activePage === "policy-intel" && <PolicyIntelModule />}
              {activePage === "tech-frontier" && <TechFrontierModule />}
              {activePage === "talent-radar" && <TalentRadarModule />}
              {activePage === "university-eco" && <UniversityEcoModule />}
              {activePage === "sentiment" && <SentimentModule />}
            </MotionPage>
          )}
        </div>
      </main>
      <MobileBottomNav activePage={activePage} onNavigate={handleNavigate} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
