"use client";

import { AlertBanner } from "./alert-banner";
import { KpiSection } from "./kpi-section";
import { SentimentGaugeBadge } from "./sentiment-gauge";
import { NewsFeed } from "./news-feed";
import { ScheduleSidebar } from "./schedule-sidebar";
import { RiskMonitor } from "./risk-monitor";

export default function DashboardPage() {
  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      <AlertBanner />
      <KpiSection />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <SentimentGaugeBadge />
          <RiskMonitor />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <NewsFeed />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ScheduleSidebar />
        </div>
      </div>
    </div>
  );
}
