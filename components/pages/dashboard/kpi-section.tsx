"use client";

import React from "react";
import { AlertTriangle, DollarSign, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ElementType;
  change?: string;
  changeLabel?: string;
  variant?: "default" | "warning" | "danger";
  extra?: React.ReactNode;
}

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  change,
  changeLabel,
  variant = "default",
  extra,
}: KpiCardProps) {
  const variantStyles = {
    default: "border-border",
    warning: "border-yellow-200 bg-yellow-50/40",
    danger: "border-red-200 bg-red-50/40",
  };

  return (
    <Card className={`${variantStyles[variant]} relative overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              variant === "danger"
                ? "bg-red-100 text-red-600"
                : variant === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-50 text-blue-500"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {extra && <div className="mt-3">{extra}</div>}
        {change && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
              {change}
            </Badge>
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KpiSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="科研经费到位率"
        value="¥9,840"
        unit="万"
        icon={DollarSign}
        extra={
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{"已完成年度目标"}</span>
              <span>{"78%"}</span>
            </div>
            <Progress value={78} className="mt-1 h-1.5" />
          </div>
        }
        change="+12%"
      />
      <KpiCard
        label="预算执行情况"
        value="¥4,520"
        unit="万"
        icon={FileText}
        extra={
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{"已用 37%"}</span>
              <span>{"总计: ¥1.2亿"}</span>
            </div>
            <Progress value={37} className="mt-1 h-1.5" />
          </div>
        }
      />
      <KpiCard
        label="科研产出"
        value="85"
        unit="篇论文"
        icon={FileText}
        change="+8"
        changeLabel="较上月"
      />
      <KpiCard
        label="高风险事项"
        value="3"
        unit="项紧急"
        icon={AlertTriangle}
        variant="danger"
        change="+1"
        changeLabel="新增"
      />
    </div>
  );
}
