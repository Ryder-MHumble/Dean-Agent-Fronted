"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const risks = [
  { name: "泰坦计算集群项目", level: "high", tag: "预算偏差预警" },
  { name: "AI伦理审查流程", level: "medium", tag: "截止日期临近" },
];

export function RiskMonitor() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">{"重点项目风险"}</CardTitle>
          <Badge variant="secondary" className="text-[10px]">2</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {risks.map((risk) => (
            <div key={risk.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className={`h-2.5 w-2.5 rounded-full ${risk.level === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{risk.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <AlertTriangle className={`h-3 w-3 ${risk.level === "high" ? "text-red-500" : "text-yellow-500"}`} />
                  <span className={`text-[11px] font-medium ${risk.level === "high" ? "text-red-600" : "text-yellow-600"}`}>
                    {risk.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
