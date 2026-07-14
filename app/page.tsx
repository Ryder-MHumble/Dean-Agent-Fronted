"use client";

import { useState, useEffect } from "react";
import AppShell, { TopBar } from "@/components/app-shell";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import PlaceholderPage from "@/components/shared/placeholder-page";
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
const SentimentModule = dynamic(
  () => import("@/components/modules/internal-mgmt/sentiment"),
  { ssr: false, loading: () => <PageLoadingSkeleton /> },
);
import { MotionPage, PageLoadingSkeleton } from "@/components/motion";
import { Toaster } from "sonner";
import { pageMeta } from "@/lib/mock-data/navigation";

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
  const meta = pageMeta[activePage] || pageMeta.home;

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
          onMenuClick={() => setMobileOpen(true)}
        />
        <div className="min-h-[calc(100vh-64px)]">
          <MotionPage pageKey={activePage}>
            {activePage === "home" && (
              <HomeModule onNavigate={handleNavigate} />
            )}
            {activePage === "policy-intel" && <PolicyIntelModule />}
            {activePage === "tech-frontier" && <TechFrontierModule />}
            {activePage === "papers" && (
              <PlaceholderPage
                moduleName="外部情报资讯"
                pageName="前沿论文"
                description="顶刊、顶会与预印本数据接入中"
              />
            )}
            {activePage === "talent-radar" && <TalentRadarModule />}
            {activePage === "university-eco" && <UniversityEcoModule />}
            {activePage === "sentiment" && <SentimentModule />}
            {activePage === "academic-achievements" && (
              <PlaceholderPage
                moduleName="内部共享资讯"
                pageName="两院学术成果"
                description="两院论文成果数据接入中"
              />
            )}
            {activePage === "internal-experts" && (
              <PlaceholderPage
                moduleName="内部共享资讯"
                pageName="两院专家库"
                description="专家脱敏数据接入中"
              />
            )}
          </MotionPage>
        </div>
      </main>
      <MobileBottomNav activePage={activePage} onNavigate={handleNavigate} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
