"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AlertBanner() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 sm:px-5 py-3.5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-red-800">{"紧急警报：教育部政策变动"}</span>
            <Badge className="bg-red-500 text-[10px] text-white hover:bg-red-500">{"特急"}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-red-600">
            {"今早发布的《人工智能伦理合规新指引》要求立即审查。需在第四季度资金审批前，由伦理委员会完成合规评估。"}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 shrink-0 w-full sm:w-auto justify-center"
      >
        {"查看简报"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
