"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A segment is either plain text (string) or an interactive link.
 * Interactive links render as highlighted clickable phrases in the narrative.
 */
export type BriefingSegment =
  | string
  | {
      text: string;
      moduleId: string;
      action?: string;
      url?: string;
      contentSnippet?: string;
      sourceName?: string;
    };

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

function SegmentLink({
  seg,
  onNavigate,
}: {
  seg: Exclude<BriefingSegment, string>;
  onNavigate?: (moduleId: string) => void;
}) {
  const hasUrl = !!seg.url;
  const isClickable = hasUrl || (!!seg.moduleId && !!onNavigate);

  const handleClick = () => {
    if (hasUrl) {
      window.open(seg.url, "_blank", "noopener,noreferrer");
    } else if (onNavigate) {
      onNavigate(seg.moduleId);
    }
  };

  const linkButton = (
    <button
      type="button"
      disabled={!isClickable}
      className={cn(
        "inline font-medium transition-colors",
        hasUrl
          ? "text-blue-600 underline decoration-blue-300 decoration-1 underline-offset-2 hover:decoration-blue-500 hover:text-blue-700 cursor-pointer"
          : isClickable
            ? "text-foreground underline decoration-blue-200 decoration-1 underline-offset-2 hover:decoration-blue-400 hover:text-blue-600 cursor-pointer"
            : "text-foreground",
      )}
      onClick={handleClick}
    >
      {seg.text}
      {hasUrl && (
        <ExternalLink className="inline-block h-3 w-3 ml-0.5 -mt-0.5 opacity-50" />
      )}
    </button>
  );

  // Wrap in HoverCard if we have content to show
  if (seg.contentSnippet || seg.sourceName) {
    return (
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger asChild>{linkButton}</HoverCardTrigger>
        <HoverCardContent className="w-80 p-3" side="top">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {seg.text}
            </p>
            {seg.sourceName && (
              <p className="text-[11px] text-muted-foreground">
                来源: {seg.sourceName}
              </p>
            )}
            {seg.contentSnippet && (
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-5">
                {seg.contentSnippet}
              </p>
            )}
            {seg.url && (
              <p className="flex items-center gap-1 text-[10px] text-blue-500 pt-0.5">
                <ExternalLink className="h-2.5 w-2.5" />
                点击查看原文
              </p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return linkButton;
}

export default function AIDailySummary({
  data,
  onNavigate,
}: AIDailySummaryProps) {
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    setTimeStr(
      data.generatedAt.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [data.generatedAt]);

  return (
    <Card className="bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-slate-50/80 border-border/60 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-foreground">
            AI 情报摘要
          </span>
          {timeStr && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              {timeStr} 生成
            </span>
          )}
        </div>
        <div className="space-y-2">
          {data.paragraphs.map((segments, pIdx) => (
            <div
              key={pIdx}
              className="text-[13px] leading-relaxed text-muted-foreground"
            >
              {segments.map((seg, sIdx) => {
                if (typeof seg === "string") {
                  return <span key={sIdx}>{seg}</span>;
                }
                return (
                  <SegmentLink key={sIdx} seg={seg} onNavigate={onNavigate} />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
