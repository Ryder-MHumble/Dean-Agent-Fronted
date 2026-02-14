"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A segment is either plain text (string) or an interactive link.
 * Interactive links render as highlighted clickable phrases in the narrative.
 */
export type BriefingSegment =
  | string
  | { text: string; moduleId: string; action?: string };

export interface DailySummaryData {
  /** Array of paragraphs; each paragraph is an array of segments */
  paragraphs: BriefingSegment[][];
  generatedAt: Date;
  /** Legacy field kept for backward compat — ignored if paragraphs exist */
  summary?: string;
  sections?: unknown[];
}

interface AIDailySummaryProps {
  data: DailySummaryData;
  onNavigate?: (moduleId: string) => void;
}

export default function AIDailySummary({
  data,
  onNavigate,
}: AIDailySummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-slate-50/80 border-border/60 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-foreground">
            AI 早报
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {data.generatedAt.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            生成
          </span>
        </div>
        <div className="space-y-2">
          {data.paragraphs.map((segments, pIdx) => (
            <p
              key={pIdx}
              className="text-[13px] leading-relaxed text-muted-foreground"
            >
              {segments.map((seg, sIdx) => {
                if (typeof seg === "string") {
                  return <span key={sIdx}>{seg}</span>;
                }
                const isClickable = !!seg.moduleId && !!onNavigate;
                return (
                  <span key={sIdx} className="inline">
                    <button
                      type="button"
                      disabled={!isClickable}
                      className={cn(
                        "inline text-foreground font-medium",
                        isClickable &&
                          "underline decoration-blue-300 decoration-1 underline-offset-2 hover:decoration-blue-500 hover:text-blue-700 transition-colors cursor-pointer",
                      )}
                      onClick={() =>
                        isClickable && onNavigate!(seg.moduleId)
                      }
                    >
                      {seg.text}
                    </button>
                    {seg.action && isClickable && (
                      <button
                        type="button"
                        className="inline-flex items-center ml-1 px-1.5 py-0 rounded text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-colors cursor-pointer align-baseline"
                        onClick={() => onNavigate!(seg.moduleId)}
                      >
                        {seg.action}
                      </button>
                    )}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
