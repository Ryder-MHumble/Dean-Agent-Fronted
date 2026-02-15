"use client"

import ModuleLayout from "@/components/module-layout"
import type { SubPageConfig } from "@/components/module-layout"
import { Cpu, PenTool } from "lucide-react"
import TechPanorama from "./tech-panorama"
import MemoOpportunities from "./memo-opportunities"

const subPages: SubPageConfig[] = [
  { id: "panorama", label: "技术全景", icon: Cpu, component: TechPanorama },
  { id: "memo", label: "内参机会", icon: PenTool, component: MemoOpportunities },
]

export default function TechFrontierModule() {
  return <ModuleLayout subPages={subPages} />
}
