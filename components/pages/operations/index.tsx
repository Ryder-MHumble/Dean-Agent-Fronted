"use client";

import KpiSummaryCards from "./kpi-summary-cards";
import SentimentCenter from "./sentiment-center";
import ProjectTimeline from "./project-timeline";
import CenterPerformance from "./center-performance";
import ApprovalTasks from "./approval-tasks";
import ProjectInfoTable from "./project-info-table";

export default function OperationsPage() {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <KpiSummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SentimentCenter />
        <ProjectTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CenterPerformance />
        <ApprovalTasks />
      </div>

      <ProjectInfoTable />
    </div>
  );
}
