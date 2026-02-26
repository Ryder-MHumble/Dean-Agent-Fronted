"use client";

import { Users, DollarSign, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { kpiData } from "@/lib/mock-data/operations";

export default function KpiSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">在校学生总数</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {kpiData.students.value}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-[10px]"
            >
              {kpiData.students.change}
            </Badge>
            <span className="text-muted-foreground">
              {kpiData.students.description}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">预算执行情况</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {kpiData.budget.value}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>已用 {kpiData.budget.usedPercent}%</span>
            <span>总计: {kpiData.budget.total}</span>
          </div>
          <Progress value={kpiData.budget.usedPercent} className="mt-1 h-1.5" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">科研产出</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {kpiData.research.value}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-700 text-[10px]"
            >
              {kpiData.research.pending} 待审
            </Badge>
            <span className="text-muted-foreground">需要评审</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">高风险事项</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {kpiData.risk.value}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 text-[10px]"
            >
              +{kpiData.risk.newCount} 新增
            </Badge>
            <span className="text-muted-foreground">{kpiData.risk.since}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
