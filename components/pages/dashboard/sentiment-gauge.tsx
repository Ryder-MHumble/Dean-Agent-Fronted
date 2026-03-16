"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentGaugeBadge() {
  const score = 82;
  const filledDots = Math.round((score / 100) * 4);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{"师生舆情指数"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-sm text-green-600 font-medium">{"积极向好"}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i < filledDots ? "bg-green-500" : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">{"基于月度满意度调查数据"}</p>
      </CardContent>
    </Card>
  );
}
