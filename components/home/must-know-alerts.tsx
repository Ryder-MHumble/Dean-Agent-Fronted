"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { ArrowRight, AlertTriangle, Clock, DollarSign, TrendingUp, FileText, User, CheckCircle2 } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import {
  type PriorityItemWithScore,
  getCategoryBadge,
  getActionInfo,
  getUrgencyStatus,
  getPriorityBadge,
} from "@/lib/priority-scoring"

interface MustKnowAlertsProps {
  alerts: PriorityItemWithScore[]
  onAlertClick?: (alertId: string) => void
  onActionClick?: (alertId: string, actionType: string) => void
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'risk':
      return AlertTriangle
    case 'deadline':
      return Clock
    case 'finance':
      return DollarSign
    case 'opportunity':
      return TrendingUp
    case 'supervision':
      return FileText
    default:
      return AlertTriangle
  }
}

const getCategoryBorderColor = (category: string) => {
  switch (category) {
    case 'risk':
      return 'border-l-red-500'
    case 'deadline':
      return 'border-l-amber-500'
    case 'finance':
      return 'border-l-orange-500'
    case 'opportunity':
      return 'border-l-green-500'
    case 'supervision':
      return 'border-l-blue-500'
    default:
      return 'border-l-gray-500'
  }
}

export default function MustKnowAlerts({
  alerts,
  onAlertClick,
  onActionClick,
}: MustKnowAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">必须关注</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {alerts.length} 项需要处理
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          高优先级事项，需要您的关注或决策
        </p>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
            <div className="text-sm font-medium text-foreground mb-1">
              暂无紧急事项
            </div>
            <div className="text-xs text-muted-foreground">
              一切运转正常，无需特别关注
            </div>
          </div>
        ) : (
          <StaggerContainer className="space-y-2">
            {alerts.map((alert) => {
              const categoryBadge = getCategoryBadge(alert.category)
              const actionInfo = getActionInfo(alert.actionType)
              const priorityBadge = getPriorityBadge(alert.priorityScore)
              const urgencyStatus = getUrgencyStatus(alert.deadline)
              const CategoryIcon = getCategoryIcon(alert.category)
              const borderColor = getCategoryBorderColor(alert.category)
              const isUrgent = alert.category === 'risk'

              return (
                <StaggerItem key={alert.id}>
                  <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all cursor-pointer",
                          "shadow-sm hover:shadow-md",
                          "border border-transparent hover:border-blue-200/50",
                          "bg-white hover:translate-x-0.5",
                          "border-l-[3px]",
                          borderColor,
                          isUrgent && "animate-pulse-subtle"
                        )}
                        onClick={() => onAlertClick?.(alert.id)}
                      >
                        {/* Left: Category Icon */}
                        <div className={cn(
                          "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md",
                          categoryBadge.bgColor
                        )}>
                          <CategoryIcon className={cn("h-4 w-4", categoryBadge.color)} />
                        </div>

                        {/* Center: Title + inline metadata */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate group-hover:text-blue-600 transition-colors">
                            {alert.title}
                          </span>
                          {alert.deadline && (
                            <span className={cn("text-xs whitespace-nowrap flex-shrink-0", urgencyStatus.color)}>
                              {urgencyStatus.icon} {urgencyStatus.text}
                            </span>
                          )}
                        </div>

                        {/* Right: Badges + Action Button */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Badge
                            className={cn("text-[10px] px-1.5 py-0", priorityBadge.bgColor, priorityBadge.color)}
                            variant="secondary"
                          >
                            {priorityBadge.text}
                          </Badge>
                          <Badge
                            className={cn("text-[10px] px-1.5 py-0", categoryBadge.bgColor, categoryBadge.color)}
                            variant="secondary"
                          >
                            {categoryBadge.text}
                          </Badge>
                          {alert.actionType !== 'fyi' ? (
                            <Button
                              size="sm"
                              className={cn(
                                "h-7 text-xs px-2.5 active:scale-95 transition-all duration-150",
                                actionInfo.bgColor,
                                actionInfo.color
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                onActionClick?.(alert.id, alert.actionType)
                              }}
                            >
                              {actionInfo.text}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs px-2.5 active:scale-95 transition-all duration-150"
                              onClick={(e) => {
                                e.stopPropagation()
                                onAlertClick?.(alert.id)
                              }}
                            >
                              查看
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </HoverCardTrigger>

                    {/* HoverCard popup: full details */}
                    <HoverCardContent
                      side="bottom"
                      align="start"
                      className="w-80 p-4"
                    >
                      <div className="space-y-3">
                        {/* Title row */}
                        <div className="flex items-start gap-2">
                          <CategoryIcon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", categoryBadge.color)} />
                          <h4 className="text-sm font-semibold text-foreground leading-tight">
                            {alert.title}
                          </h4>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>

                        {/* Metadata */}
                        {alert.metadata && (
                          <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2.5 py-1.5">
                            {alert.metadata}
                          </div>
                        )}

                        {/* Footer: responsible person + deadline */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          {alert.responsiblePerson ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{alert.responsiblePerson}</span>
                            </div>
                          ) : (
                            <div />
                          )}
                          {alert.deadline && (
                            <Badge
                              className={cn("text-[10px]", urgencyStatus.color)}
                              variant="secondary"
                            >
                              {urgencyStatus.icon} {urgencyStatus.text}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}
      </CardContent>
    </Card>
  )
}
