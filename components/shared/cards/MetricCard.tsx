"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MotionCard, AnimatedNumber } from "@/components/motion";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  delay?: number;
  formatFn?: (n: number) => string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  colorClass,
  delay = 0,
  formatFn = formatNumber,
}: MetricCardProps) {
  return (
    <MotionCard delay={delay}>
      <Card className="shadow-card border-0">
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
              colorClass,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight">
              <AnimatedNumber value={value} formatFn={formatFn} />
            </p>
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  );
}
