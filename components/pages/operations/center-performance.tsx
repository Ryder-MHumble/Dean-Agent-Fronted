"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { centerPerformanceData } from "@/lib/mock-data/operations";

export default function CenterPerformance() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            各中心绩效概览
          </CardTitle>
          <button
            type="button"
            className="text-muted-foreground"
            onClick={() =>
              toast("各中心绩效概览", {
                description: "正在加载更多绩效数据...",
              })
            }
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px]">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 text-left font-medium">中心名称</th>
                <th className="pb-2 text-left font-medium">预算健康度</th>
                <th className="pb-2 text-left font-medium">产出得分</th>
                <th className="pb-2 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {centerPerformanceData.map((c) => (
                <tr key={c.name} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium text-foreground">
                    {c.name}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${c.budgetColor}`}
                          style={{ width: `${c.budget}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {c.budget}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-foreground">
                    {c.score}
                    <span className="text-xs text-muted-foreground">/100</span>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${c.statusColor}`}
                    >
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
