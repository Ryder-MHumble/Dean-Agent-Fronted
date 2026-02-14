"use client"

import ModuleLayout from "@/components/module-layout"
import type { SubPageConfig } from "@/components/module-layout"
import { Cpu, TrendingUp, PenTool } from "lucide-react"
import TechTrends from "./tech-trends"
import DynamicsAndTrending from "./hot-topics-kol"
import MemoOpportunities from "./memo-opportunities"

const subPages: SubPageConfig[] = [
  { id: "trends", label: "技术趋势", icon: Cpu, component: TechTrends },
  { id: "dynamics", label: "动态与热点", icon: TrendingUp, component: DynamicsAndTrending },
  { id: "memo", label: "内参机会", icon: PenTool, component: MemoOpportunities },
]

export default function TechFrontierModule() {
  return <ModuleLayout subPages={subPages} />
}
