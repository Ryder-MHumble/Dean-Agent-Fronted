"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DataFreshness from "@/components/shared/data-freshness";
import { cn } from "@/lib/utils";
import type { TechBriefing } from "@/lib/types/tech-frontier";

interface AIBriefingBarProps {
  briefing: TechBriefing;
  className?: string;
}

export default function AIBriefingBar({
  briefing,
  className,
}: AIBriefingBarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card className={cn("shadow-card", className)}>
      <CardContent className="p-4">
        {/* Header - always visible */}
        <button
          type="button"
          className="w-full flex items-center justify-between cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold">AI 社媒情报周报</span>
            <DataFreshness updatedAt={briefing.generatedAt} />
          </div>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Narrative - collapsible */}
        {!collapsed && (
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-3">
            {briefing.narrative}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
