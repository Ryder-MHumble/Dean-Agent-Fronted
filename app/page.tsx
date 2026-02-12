"use client"

import { useState } from "react"
import AppShell, { TopBar } from "@/components/app-shell"
import FloatingAIAssistant from "@/components/floating-ai-assistant"
import HomeBriefingPage from "@/components/pages/home-briefing"
import IntelligencePage from "@/components/pages/intelligence"
import OperationsPage from "@/components/pages/operations"
import PolicyPage from "@/components/pages/policy"
import SchedulePage from "@/components/pages/schedule"
import { MotionPage } from "@/components/motion"
import { Toaster } from "sonner"

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  home: { title: "院长早报", subtitle: "今日态势 · 全局掌控" },
  radar: {
    title: "战略雷达",
    subtitle: "外部情报 · 政策技术竞对",
  },
  internal: {
    title: "院内事务",
    subtitle: "异常管理 · 风险预警",
  },
  network: {
    title: "政策与人脉",
    subtitle: "人才追踪 · 关系维护",
  },
  schedule: {
    title: "智能日程",
    subtitle: "日程ROI · 冲突管理 · 会谈助手",
  },
}

export default function Page() {
  const [activePage, setActivePage] = useState("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const meta = pageMeta[activePage] || pageMeta.home

  return (
    <div className="flex min-h-screen bg-background">
      <AppShell
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main
        className="flex-1 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarCollapsed ? 70 : 220 }}
      >
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <div className="min-h-[calc(100vh-64px)]">
          <MotionPage pageKey={activePage}>
            {activePage === "home" && <HomeBriefingPage onNavigate={setActivePage} />}
            {activePage === "radar" && <IntelligencePage />}
            {activePage === "internal" && <OperationsPage />}
            {activePage === "network" && <PolicyPage />}
            {activePage === "schedule" && <SchedulePage />}
          </MotionPage>
        </div>
      </main>
      <FloatingAIAssistant />
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
