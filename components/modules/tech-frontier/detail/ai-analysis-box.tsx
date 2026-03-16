"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAnalysisBoxProps {
  title?: string;
  summary?: string;
  insight?: string;
  analysis?: string;
  variant?: "purple" | "teal" | "muted";
  className?: string;
}

const variantStyles = {
  purple: {
    wrapper: "bg-purple-50 border border-purple-100",
    icon: "text-purple-500",
    title: "text-purple-700",
    body: "text-purple-700/80",
    separator: "bg-purple-200",
  },
  teal: {
    wrapper: "bg-teal-50 border border-teal-100",
    icon: "text-teal-500",
    title: "text-teal-700",
    body: "text-teal-700/80",
    separator: "",
  },
  muted: {
    wrapper: "bg-muted/40",
    icon: "text-blue-500",
    title: "text-foreground",
    body: "text-muted-foreground",
    separator: "",
  },
};

export function AIAnalysisBox({
  title = "AI 综合分析",
  summary,
  insight,
  analysis,
  variant = "purple",
  className,
}: AIAnalysisBoxProps) {
  const s = variantStyles[variant];

  return (
    <div className={cn("rounded-lg p-4", s.wrapper, className)}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className={cn("h-4 w-4", s.icon)} />
        <span className={cn("text-sm font-semibold", s.title)}>{title}</span>
      </div>
      {(summary || analysis) && (
        <p className={cn("text-sm leading-relaxed", s.body)}>{summary ?? analysis}</p>
      )}
      {insight && (
        <>
          <div className={cn("my-2 h-px", s.separator || "bg-border")} />
          <div>
            <span className={cn("text-xs font-semibold", s.title)}>战略建议：</span>
            <p className={cn("text-sm leading-relaxed mt-1", s.body)}>{insight}</p>
          </div>
        </>
      )}
    </div>
  );
}
