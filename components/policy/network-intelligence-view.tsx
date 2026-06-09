"use client";

import {
  Users,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Globe,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePersonnelFeed } from "@/hooks/use-personnel-feed";
import { SkeletonPersonnelIntel } from "@/components/shared/skeleton-states";
import type { PersonnelChangeItem } from "@/lib/types/personnel-intel";

// ── Right-column mock data (no backend source yet) ──────

interface TalentReturnEntry {
  name: string;
  field: string;
  intent: "高" | "中" | "低";
  hIndex: number;
}

interface NoContactEntry {
  initials: string;
  avatarColor: string;
  name: string;
  lastContact: string;
}

const talentReturnData: TalentReturnEntry[] = [
  { name: "张明远", field: "计算机视觉", intent: "高", hIndex: 42 },
  { name: "刘思琪", field: "自然语言处理", intent: "中", hIndex: 35 },
  { name: "陈伟杰", field: "机器人学", intent: "低", hIndex: 28 },
];

const noContactData: NoContactEntry[] = [
  {
    initials: "HQ",
    avatarColor: "bg-teal-500",
    name: "黄 强",
    lastContact: "2025-07-12",
  },
  {
    initials: "FY",
    avatarColor: "bg-orange-500",
    name: "冯 毅",
    lastContact: "2025-06-28",
  },
  {
    initials: "XM",
    avatarColor: "bg-cyan-500",
    name: "谢 敏",
    lastContact: "2025-08-03",
  },
];

// ── Helpers ─────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-amber-600",
];

function getInitials(name: string): string {
  // Chinese name — take last 1-2 chars as initials display
  return name.length >= 2 ? name.slice(0, 2) : name;
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Map relevance 0-100 → 1-4 strength bars */
function relevanceToStrength(relevance: number): number {
  if (relevance >= 75) return 4;
  if (relevance >= 50) return 3;
  if (relevance >= 25) return 2;
  return 1;
}

function relevanceToLabel(relevance: number): string {
  if (relevance >= 75) return "高相关";
  if (relevance >= 50) return "较相关";
  if (relevance >= 25) return "一般";
  return "弱相关";
}

const strengthColorMap: Record<number, string> = {
  4: "bg-emerald-500",
  3: "bg-amber-500",
  2: "bg-gray-400",
  1: "bg-gray-300",
};

const importanceBadgeStyle: Record<string, string> = {
  紧急: "border-red-200 bg-red-50 text-red-700",
  重要: "border-amber-200 bg-amber-50 text-amber-700",
  关注: "border-blue-200 bg-blue-50 text-blue-700",
  一般: "border-gray-200 bg-gray-50 text-gray-500",
};

const intentDotColor: Record<string, string> = {
  高: "bg-emerald-500",
  中: "bg-amber-500",
  低: "bg-gray-400",
};

// ── Sub-components ──────────────────────────────────────

function RelevanceBar({ strength }: { strength: number }) {
  const color = strengthColorMap[strength] || "bg-gray-300";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-1.5 rounded-sm transition-colors",
            i < strength ? color : "bg-gray-200",
          )}
        />
      ))}
    </div>
  );
}

function PersonCard({ person }: { person: PersonnelChangeItem }) {
  const strength = relevanceToStrength(person.relevance);
  const initials = getInitials(person.name);
  const avatarColor = getAvatarColor(person.name);
  const changeText = `${person.action}${person.position}`;

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback
          className={cn(avatarColor, "text-white text-xs font-medium")}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Name + importance + change */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {person.name}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0",
              importanceBadgeStyle[person.importance],
            )}
          >
            {person.importance}
          </Badge>
          <span className="text-xs text-muted-foreground">{changeText}</span>
        </div>

        {/* Department + date */}
        {(person.department || person.date) && (
          <p className="text-[11px] text-muted-foreground">
            {person.department && <span>{person.department}</span>}
            {person.department && person.date && (
              <span className="mx-1">·</span>
            )}
            {person.date && <span>{person.date}</span>}
          </p>
        )}

        {/* Relevance bar + label + score */}
        <div className="flex items-center gap-2">
          <RelevanceBar strength={strength} />
          <span className="text-[10px] text-muted-foreground">
            {relevanceToLabel(person.relevance)}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {person.relevance}
          </span>
        </div>

        {/* Note */}
        {person.note && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {person.note}
          </p>
        )}

        {/* AI Insight */}
        {person.aiInsight && (
          <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1 leading-relaxed">
            {person.aiInsight}
          </p>
        )}

        {/* Action suggestion */}
        {person.actionSuggestion && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 leading-relaxed">
            💡 {person.actionSuggestion}
          </p>
        )}

        {/* Signals */}
        {person.signals.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {person.signals.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {s}
              </Badge>
            ))}
          </div>
        )}

        {/* Inline action buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() => toast.success(`正在向${person.name}发送消息...`)}
          >
            <MessageSquare className="h-3 w-3" />
            发消息
          </Button>
          {person.sourceUrl ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              asChild
            >
              <a
                href={person.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
                查看原文
              </a>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() =>
                toast(`${person.name}的详细资料`, { description: changeText })
              }
            >
              <ExternalLink className="h-3 w-3" />
              查看详情
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonnelGroup({
  title,
  variant,
  items,
}: {
  title: string;
  variant: "action" | "watch";
  items: PersonnelChangeItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg p-4",
        variant === "action" ? "bg-amber-50/60" : "bg-background",
      )}
    >
      {/* Group header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="flex-1 h-px bg-border" />
        <Badge
          variant={variant === "action" ? "warning" : "secondary"}
          className="text-[10px] px-1.5 py-0"
        >
          {items.length}
        </Badge>
      </div>

      {/* Person cards */}
      <div className="divide-y divide-border/60">
        {items.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}

// ── Right Column Cards ──────────────────────────────────

function PersonnelOverview({
  actionCount,
  watchCount,
  highRelevance,
}: {
  actionCount: number;
  watchCount: number;
  highRelevance: number;
}) {
  const total = actionCount + watchCount;
  const maxCount = Math.max(actionCount, watchCount, highRelevance, 1);

  const metrics = [
    { label: "需要行动", count: actionCount, color: "bg-amber-500" },
    { label: "持续关注", count: watchCount, color: "bg-blue-400" },
    { label: "高相关度", count: highRelevance, color: "bg-emerald-500" },
  ];

  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          人事动态概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <span className="text-xs font-medium">{m.count}条</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className={cn("h-full rounded-full transition-all", m.color)}
                style={{ width: `${(m.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-1 text-[10px] text-muted-foreground text-right">
          共 {total} 条变动
        </div>
      </CardContent>
    </Card>
  );
}

function TalentReturnMonitor() {
  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          人才回流监控
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {talentReturnData.map((scholar) => (
          <div
            key={scholar.name}
            className="flex items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{scholar.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {scholar.field}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    intentDotColor[scholar.intent],
                  )}
                />
                <span className="text-[10px] text-muted-foreground">
                  {scholar.intent}
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-mono"
              >
                H-{scholar.hIndex}
              </Badge>
            </div>
          </div>
        ))}
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs mt-1"
          onClick={() =>
            toast("人才回流监控", { description: "正在加载完整人才列表..." })
          }
        >
          查看完整列表
        </Button>
      </CardContent>
    </Card>
  );
}

function NoContactWarning() {
  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          半年未联系
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {noContactData.map((person) => (
          <div key={person.name} className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback
                className={cn(
                  person.avatarColor,
                  "text-white text-[10px] font-medium",
                )}
              >
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{person.name}</p>
              <p className="text-[10px] text-muted-foreground">
                上次联系: {person.lastContact}
              </p>
            </div>
            <Badge
              variant="warning"
              className="text-[10px] px-1.5 py-0 flex-shrink-0"
            >
              需维护
            </Badge>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() =>
            toast.success("批量发送问候", {
              description: `已向${noContactData.length}位联系人发送问候消息`,
            })
          }
        >
          <MessageSquare className="h-3 w-3" />
          批量发送问候
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Main Component ──────────────────────────────────────

export default function NetworkIntelligenceView() {
  const { items, isLoading, isUsingMock, actionCount, watchCount } =
    usePersonnelFeed();

  if (isLoading) {
    return <SkeletonPersonnelIntel />;
  }

  const actionGroup = items.filter((p) => p.group === "action");
  const watchGroup = items.filter((p) => p.group === "watch");
  const highRelevance = items.filter((p) => p.relevance >= 60).length;

  return (
    <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column - Personnel Changes Tracking */}
      <StaggerItem className="col-span-1 lg:col-span-7">
        <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                人事变动追踪
              </CardTitle>
              <div className="flex items-center gap-2">
                {isUsingMock && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 gap-1 text-amber-600 border-amber-200"
                  >
                    <WifiOff className="h-3 w-3" />
                    离线数据
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {items.length} 条变动
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <PersonnelGroup
              title="需要行动"
              variant="action"
              items={actionGroup}
            />
            <PersonnelGroup
              title="关注动态"
              variant="watch"
              items={watchGroup}
            />
            {items.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                暂无人事变动数据
              </div>
            )}
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Right column - Overview + Talent + No-Contact */}
      <StaggerItem className="col-span-1 lg:col-span-5 space-y-6">
        <PersonnelOverview
          actionCount={actionCount}
          watchCount={watchCount}
          highRelevance={highRelevance}
        />
        <TalentReturnMonitor />
        <NoContactWarning />
      </StaggerItem>
    </StaggerContainer>
  );
}
