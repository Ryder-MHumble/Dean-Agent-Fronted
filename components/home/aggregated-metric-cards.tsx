"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Radar, Building2, Users, Calendar } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"

export interface MetricCardData {
  id: string
  title: string
  icon: 'radar' | 'building' | 'users' | 'calendar'
  metrics: {
    label: string
    value: string | number
    variant?: 'default' | 'warning' | 'danger' | 'success'
  }[]
}

interface AggregatedMetricCardsProps {
  cards: MetricCardData[]
  onCardClick?: (cardId: string) => void
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'radar':
      return Radar
    case 'building':
      return Building2
    case 'users':
      return Users
    case 'calendar':
      return Calendar
    default:
      return Radar
  }
}

const getIconGradient = (icon: string) => {
  switch (icon) {
    case 'radar':
      return {
        gradient: 'from-blue-400 to-indigo-500',
        bg: 'bg-blue-50',
        hoverBg: 'bg-blue-100',
        text: 'text-blue-500',
      }
    case 'building':
      return {
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-amber-50',
        hoverBg: 'bg-amber-100',
        text: 'text-amber-600',
      }
    case 'users':
      return {
        gradient: 'from-green-400 to-emerald-500',
        bg: 'bg-green-50',
        hoverBg: 'bg-green-100',
        text: 'text-green-600',
      }
    case 'calendar':
      return {
        gradient: 'from-violet-400 to-purple-500',
        bg: 'bg-violet-50',
        hoverBg: 'bg-violet-100',
        text: 'text-violet-600',
      }
    default:
      return {
        gradient: 'from-blue-400 to-indigo-500',
        bg: 'bg-blue-50',
        hoverBg: 'bg-blue-100',
        text: 'text-blue-500',
      }
  }
}

const getVariantColor = (variant?: string) => {
  switch (variant) {
    case 'warning':
      return 'text-yellow-600'
    case 'danger':
      return 'text-red-600'
    case 'success':
      return 'text-green-600'
    default:
      return 'text-foreground'
  }
}

export default function AggregatedMetricCards({
  cards,
  onCardClick,
}: AggregatedMetricCardsProps) {
  return (
    <StaggerContainer className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = getIcon(card.icon)
        const iconStyle = getIconGradient(card.icon)

        return (
          <StaggerItem key={card.id}>
            <Card
              className="group hover:shadow-card-hover shadow-card transition-all cursor-pointer hover:border-blue-300 hover:-translate-y-1 overflow-hidden"
              onClick={() => onCardClick?.(card.id)}
            >
              {/* Top gradient accent line */}
              <div className={`h-0.5 rounded-t-lg bg-gradient-to-r ${iconStyle.gradient}`} />

              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle.bg} ${iconStyle.text} transition-colors`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="flex items-center gap-3">
                  {card.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-semibold font-tabular ${getVariantColor(metric.variant)}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
