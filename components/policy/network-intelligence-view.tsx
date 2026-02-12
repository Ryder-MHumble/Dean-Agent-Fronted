"use client"

import { Users, MessageSquare, ExternalLink, AlertCircle, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────

interface PersonnelEntry {
  id: string
  group: "action" | "watch"
  initials: string
  avatarColor: string
  name: string
  change: string
  relation: "Strong" | "Moderate" | "Weak"
  relationStrength: number
  note?: string
  actionSuggestion?: string
}

interface TalentReturnEntry {
  name: string
  field: string
  intent: "高" | "中" | "低"
  hIndex: number
}

interface NoContactEntry {
  initials: string
  avatarColor: string
  name: string
  lastContact: string
}

// ── Mock Data ──────────────────────────────────────────

const personnelData: PersonnelEntry[] = [
  {
    id: "1",
    group: "action",
    initials: "LZ",
    avatarColor: "bg-blue-500",
    name: "李 张",
    change: "任清华大学AI副院长",
    relation: "Strong",
    relationStrength: 4,
    note: "863计划前合作者。良好的合作渠道。",
    actionSuggestion: "建议发送祝贺信并安排会面",
  },
  {
    id: "2",
    group: "action",
    initials: "JC",
    avatarColor: "bg-green-500",
    name: "陈 静",
    change: "晋升，中科院院士",
    relation: "Moderate",
    relationStrength: 3,
    actionSuggestion: "建议发送祝贺函",
  },
  {
    id: "3",
    group: "watch",
    initials: "WW",
    avatarColor: "bg-red-500",
    name: "王 伟",
    change: "调至MIT，系主任",
    relation: "Weak",
    relationStrength: 2,
  },
  {
    id: "4",
    group: "watch",
    initials: "ZL",
    avatarColor: "bg-purple-500",
    name: "赵 磊",
    change: "任国家自然科学基金委处长",
    relation: "Moderate",
    relationStrength: 3,
    note: "与我院王教授同窗，可通过其建立联系",
  },
]

const talentReturnData: TalentReturnEntry[] = [
  { name: "张明远", field: "计算机视觉", intent: "高", hIndex: 42 },
  { name: "刘思琪", field: "自然语言处理", intent: "中", hIndex: 35 },
  { name: "陈伟杰", field: "机器人学", intent: "低", hIndex: 28 },
]

const noContactData: NoContactEntry[] = [
  { initials: "HQ", avatarColor: "bg-teal-500", name: "黄 强", lastContact: "2025-07-12" },
  { initials: "FY", avatarColor: "bg-orange-500", name: "冯 毅", lastContact: "2025-06-28" },
  { initials: "XM", avatarColor: "bg-cyan-500", name: "谢 敏", lastContact: "2025-08-03" },
]

// ── Helpers ─────────────────────────────────────────────

const relationColorMap: Record<string, string> = {
  Strong: "bg-emerald-500",
  Moderate: "bg-amber-500",
  Weak: "bg-gray-400",
}

const relationLabelMap: Record<string, string> = {
  Strong: "强关系",
  Moderate: "中等关系",
  Weak: "弱关系",
}

const intentDotColor: Record<string, string> = {
  高: "bg-emerald-500",
  中: "bg-amber-500",
  低: "bg-gray-400",
}

// ── Sub-components ──────────────────────────────────────

function RelationBar({ strength }: { strength: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-1.5 rounded-sm transition-colors",
            i < strength ? relationColorMap[strength >= 4 ? "Strong" : strength >= 3 ? "Moderate" : "Weak"] : "bg-gray-200"
          )}
        />
      ))}
    </div>
  )
}

function PersonCard({ person }: { person: PersonnelEntry }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback className={cn(person.avatarColor, "text-white text-xs font-medium")}>
          {person.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Name + change */}
        <div>
          <span className="text-sm font-medium text-foreground">{person.name}</span>
          <span className="text-xs text-muted-foreground ml-1.5">{person.change}</span>
        </div>

        {/* Relation bar + label */}
        <div className="flex items-center gap-2">
          <RelationBar strength={person.relationStrength} />
          <span className="text-[10px] text-muted-foreground">{relationLabelMap[person.relation]}</span>
        </div>

        {/* Note */}
        {person.note && (
          <p className="text-xs text-muted-foreground leading-relaxed">{person.note}</p>
        )}

        {/* Action suggestion */}
        {person.actionSuggestion && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 leading-relaxed">
            {person.actionSuggestion}
          </p>
        )}

        {/* Inline action buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => toast.success(`正在向${person.name}发送消息...`)}>
            <MessageSquare className="h-3 w-3" />
            发消息
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => toast(`查看${person.name}的详细资料`, { description: person.change })}>
            <ExternalLink className="h-3 w-3" />
            查看详情
          </Button>
        </div>
      </div>
    </div>
  )
}

function PersonnelGroup({
  title,
  variant,
  items,
}: {
  title: string
  variant: "action" | "watch"
  items: PersonnelEntry[]
}) {
  return (
    <div className={cn("rounded-lg p-4", variant === "action" ? "bg-amber-50/60" : "bg-background")}>
      {/* Group header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="flex-1 h-px bg-border" />
        <Badge variant={variant === "action" ? "warning" : "secondary"} className="text-[10px] px-1.5 py-0">
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
  )
}

// ── Right Column Cards ──────────────────────────────────

function RelationshipHeatmap() {
  const metrics = [
    { label: "强关系", count: 12, color: "bg-emerald-500", barWidth: "w-3/12" },
    { label: "中关系", count: 28, color: "bg-amber-500", barWidth: "w-7/12" },
    { label: "弱关系", count: 45, color: "bg-gray-400", barWidth: "w-full" },
  ]

  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          关系网络概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <span className="text-xs font-medium">{m.count}人</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className={cn("h-full rounded-full transition-all", m.color, m.barWidth)} />
            </div>
          </div>
        ))}
        <div className="pt-1 text-[10px] text-muted-foreground text-right">
          共 {metrics.reduce((sum, m) => sum + m.count, 0)} 人
        </div>
      </CardContent>
    </Card>
  )
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
          <div key={scholar.name} className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{scholar.name}</p>
              <p className="text-[10px] text-muted-foreground">{scholar.field}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className={cn("h-2 w-2 rounded-full", intentDotColor[scholar.intent])} />
                <span className="text-[10px] text-muted-foreground">{scholar.intent}</span>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                H-{scholar.hIndex}
              </Badge>
            </div>
          </div>
        ))}
        <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1" onClick={() => toast("人才回流监控", { description: "正在加载完整人才列表..." })}>
          查看完整列表
        </Button>
      </CardContent>
    </Card>
  )
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
              <AvatarFallback className={cn(person.avatarColor, "text-white text-[10px] font-medium")}>
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{person.name}</p>
              <p className="text-[10px] text-muted-foreground">上次联系: {person.lastContact}</p>
            </div>
            <Badge variant="warning" className="text-[10px] px-1.5 py-0 flex-shrink-0">
              需维护
            </Badge>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => toast.success("批量发送问候", { description: `已向${noContactData.length}位联系人发送问候消息` })}>
          <MessageSquare className="h-3 w-3" />
          批量发送问候
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Main Component ──────────────────────────────────────

export default function NetworkIntelligenceView() {
  const actionGroup = personnelData.filter((p) => p.group === "action")
  const watchGroup = personnelData.filter((p) => p.group === "watch")

  return (
    <StaggerContainer className="grid grid-cols-12 gap-6">
      {/* Left column - Personnel Changes Tracking */}
      <StaggerItem className="col-span-7">
        <Card className="shadow-card hover:shadow-card-hover rounded-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              人事变动追踪
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PersonnelGroup title="需要行动" variant="action" items={actionGroup} />
            <PersonnelGroup title="关注动态" variant="watch" items={watchGroup} />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Right column - Heatmap + Talent + No-Contact */}
      <StaggerItem className="col-span-5 space-y-6">
        <RelationshipHeatmap />
        <TalentReturnMonitor />
        <NoContactWarning />
      </StaggerItem>
    </StaggerContainer>
  )
}
