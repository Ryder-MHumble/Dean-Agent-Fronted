"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ChevronDown,
} from "lucide-react"
import { AnimatedNumber, motion, StaggerContainer, StaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"

export interface SafetyDeduction {
  category: string
  points: number
  description: string
  responsiblePerson?: string
}

export interface SafetyIndexData {
  overallScore: number // 0-100
  deductions: SafetyDeduction[]
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
}

export interface SafetyIndexGaugeProps {
  data: SafetyIndexData
  onViewDetails?: () => void
}

export default function SafetyIndexGauge({
  data,
  onViewDetails,
}: SafetyIndexGaugeProps) {
  const { overallScore, deductions, trend } = data
  const [isOpen, setIsOpen] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#22c55e', label: '优秀', bgGradient: 'bg-gradient-to-br from-green-50/80 to-emerald-50/40' }
    if (score >= 70) return { color: '#f59e0b', label: '关注', bgGradient: 'bg-gradient-to-br from-amber-50/80 to-yellow-50/40' }
    return { color: '#ef4444', label: '警戒', bgGradient: 'bg-gradient-to-br from-red-50/80 to-orange-50/40' }
  }

  const scoreInfo = getScoreColor(overallScore)

  // Ring gauge parameters (60x60 SVG)
  const size = 60
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = overallScore / 100

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <Card className={cn("shadow-card", scoreInfo.bgGradient)}>
      <CardContent className="p-3">
        {/* Top row: ring gauge + score info */}
        <div className="flex items-center gap-3">
          {/* Small ring gauge */}
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={scoreInfo.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={scoreInfo.color} />
                </linearGradient>
              </defs>
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              {/* Animated progress ring */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - progress) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            {/* Center score inside ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: scoreInfo.color }}>
                <AnimatedNumber value={overallScore} duration={1.2} />
              </span>
            </div>
          </div>

          {/* Score text info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-medium text-muted-foreground">今日安全指数</span>
              {getTrendIcon()}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold leading-none" style={{ color: scoreInfo.color }}>
                <AnimatedNumber value={overallScore} duration={1.2} />
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
              <Badge
                className="ml-1 text-[10px] px-1.5 py-0"
                style={{ backgroundColor: scoreInfo.color, color: 'white' }}
              >
                {scoreInfo.label}
              </Badge>
            </div>
            {deductions.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {deductions.length} 项扣分，共 -{deductions.reduce((s, d) => s + d.points, 0)} 分
              </span>
            )}
          </div>
        </div>

        {/* Collapsible deductions list */}
        {deductions.length === 0 ? (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span>暂无扣分项</span>
          </div>
        ) : (
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-[11px] h-6 px-1.5 text-muted-foreground hover:text-foreground"
              >
                <span>扣分明细</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <StaggerContainer className="space-y-1 pt-1">
                {deductions.map((deduction, index) => (
                  <StaggerItem key={index}>
                    <div
                      className="flex items-center gap-1.5 rounded-md glass-card px-2 py-1 text-[11px] hover:bg-white/80 transition-colors cursor-pointer"
                      onClick={onViewDetails}
                    >
                      <AlertTriangle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                      <span className="font-medium flex-shrink-0">{deduction.category}</span>
                      <span className="font-bold text-red-600 flex-shrink-0">-{deduction.points}</span>
                      <span className="text-muted-foreground truncate">{deduction.description}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
