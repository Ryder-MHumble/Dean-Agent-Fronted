"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Atomic skeleton building blocks                                     */
/* ------------------------------------------------------------------ */

export function SkeletonStatCards({ count = 3 }: { count?: number }) {
  return (
    <div className={cn("grid gap-4 mb-4", `grid-cols-${count}`)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SkeletonTableRows({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4 px-3 py-2 border-b">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 items-center px-3 py-3 border-b last:border-0"
          >
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className={cn(
                  "h-4",
                  j === 0 ? "w-32" : j === cols - 1 ? "w-4" : "w-16",
                )}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SkeletonAIPanel() {
  return (
    <Card className="shadow-card bg-gradient-to-br from-slate-800 to-slate-900 border-0">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4 rounded bg-slate-700" />
          <Skeleton className="h-4 w-24 bg-slate-700" />
        </div>
        <div className="space-y-1.5 mb-4">
          <Skeleton className="h-3 w-full bg-slate-700" />
          <Skeleton className="h-3 w-4/5 bg-slate-700" />
          <Skeleton className="h-3 w-3/5 bg-slate-700" />
        </div>
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <Skeleton className="h-1.5 w-1.5 rounded-full mt-1.5 bg-slate-700 shrink-0" />
              <Skeleton className="h-3 w-full bg-slate-700" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md bg-slate-700" />
          <Skeleton className="h-8 flex-1 rounded-md bg-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Legacy composite skeleton — kept for backward compatibility */
export function SkeletonSubPage() {
  return (
    <div className="space-y-4">
      <SkeletonStatCards />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-8">
          <SkeletonTableRows />
        </div>
        <div className="col-span-1 lg:col-span-4">
          <SkeletonAIPanel />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton: Filter bar (search + pills)                              */
/* ------------------------------------------------------------------ */

export function SkeletonFilterBar({ pillCount = 5 }: { pillCount?: number }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4 space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        {/* Pills row */}
        <div className="flex items-center gap-2">
          {Array.from({ length: pillCount }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-7 rounded-full", i === 0 ? "w-12" : "w-16")}
            />
          ))}
          <div className="ml-auto">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton: Card list (matches DataItemCard layout)                   */
/* ------------------------------------------------------------------ */

function SkeletonCardItem() {
  return (
    <div className="rounded-lg border p-4 space-y-2.5">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 flex-1 max-w-[70%]" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      {/* Summary */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      {/* Footer badges */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
        <div className="ml-auto">
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardList({
  groups = 2,
  itemsPerGroup = 3,
}: {
  groups?: number;
  itemsPerGroup?: number;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: groups }).map((_, gi) => (
        <Card key={gi} className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {Array.from({ length: itemsPerGroup }).map((_, ii) => (
              <SkeletonCardItem key={ii} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton: Filter tabs (horizontal pill row)                         */
/* ------------------------------------------------------------------ */

export function SkeletonFilterTabs({ count = 6 }: { count?: number }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-1">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-7 rounded-full", i === 0 ? "w-12" : "w-20")}
          />
        ))}
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page-level composite skeletons                                      */
/* ------------------------------------------------------------------ */

/** Policy intel module: filter bar + card list */
export function SkeletonPolicyIntel() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <SkeletonFilterBar />
      <SkeletonCardList groups={2} itemsPerGroup={3} />
    </div>
  );
}

/** University peer dynamics: filter tabs + card list */
export function SkeletonPeerDynamics() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 10rem)" }}>
      <SkeletonFilterTabs count={6} />
      <SkeletonCardList groups={2} itemsPerGroup={3} />
    </div>
  );
}

/** University research tracking: stat row + card list */
export function SkeletonResearchTracking() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
      <SkeletonStatCards count={3} />
      <SkeletonCardList groups={2} itemsPerGroup={2} />
    </div>
  );
}

/** Personnel intel: 7/5 grid with card list + sidebar cards */
export function SkeletonPersonnelIntel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="col-span-1 lg:col-span-7 space-y-4">
        {/* Header */}
        <Card className="shadow-card rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 lg:col-span-5 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-card rounded-xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** Home briefing: summary block + agenda + metric cards */
export function SkeletonHomeBriefing() {
  return (
    <div className="p-5 space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-px" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* AI Summary skeleton */}
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[90%]" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Today Agenda skeleton */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="h-3 w-12 shrink-0" />
              <Skeleton className="h-7 w-7 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-card overflow-hidden">
            <div className="h-0.5 rounded-t-lg bg-muted" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton: Talent Radar (search bar + pills + news feed)            */
/* ------------------------------------------------------------------ */

function SkeletonNewsItem() {
  return (
    <div className="rounded-lg border p-4 space-y-2.5">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-2 w-2 rounded-full shrink-0" />
          <Skeleton className="h-4 flex-1 max-w-[75%]" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      {/* Summary */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      {/* Footer badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-4 w-10 rounded-sm" />
          <Skeleton className="h-4 w-10 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonTalentRadar() {
  return (
    <div className="p-5 space-y-4">
      {/* Search bar + category pills */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="flex items-center gap-2 mt-3">
            {["全部", "政府人事", "高校人事", "人才要闻"].map((_, i) => (
              <Skeleton
                key={i}
                className={cn("h-7 rounded-full", i === 0 ? "w-12" : "w-16")}
              />
            ))}
            <div className="ml-auto">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date group header */}
      <div className="flex items-center gap-2 px-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-px flex-1" />
      </div>

      {/* News cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonNewsItem key={i} />
        ))}
      </div>
    </div>
  );
}
