"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Radar,
  Building2,
  Users,
  Calendar,
  Search,
  Bell,
  HelpCircle,
  Settings,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { id: "home", label: "院长早报", icon: LayoutDashboard },
  { id: "radar", label: "战略雷达", icon: Radar, badge: 5 },
  { id: "internal", label: "院内事务", icon: Building2 },
  { id: "network", label: "政策与人脉", icon: Users },
  { id: "schedule", label: "智能日程", icon: Calendar },
]

export default function AppShell({
  activePage,
  onNavigate,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: {
  activePage: string
  onNavigate: (page: string) => void
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  const handleToggle = () => {
    const newValue = !collapsed
    if (onCollapsedChange) {
      onCollapsedChange(newValue)
    } else {
      setInternalCollapsed(newValue)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 70 : 220 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-white/80 backdrop-blur-xl border-r border-border/40 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 relative min-h-[68px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white flex-shrink-0 shadow-glow-blue">
            {"智"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex-1 overflow-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-foreground whitespace-nowrap">
                    {"智策"}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                      {"云端"}
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {"院长决策系统"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle */}
          <button
            onClick={handleToggle}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border/60 bg-white shadow-card hover:shadow-card-hover hover:bg-blue-50 transition-all duration-200 flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
                        collapsed ? "justify-center px-0" : "px-3",
                        isActive
                          ? "bg-blue-50/80 text-blue-600 shadow-sm"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive && "text-blue-600"
                        )}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {!collapsed && item.badge && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="ml-auto"
                          >
                            <Badge
                              variant="secondary"
                              className={cn(
                                "h-5 min-w-5 px-1.5 text-[10px]",
                                isActive
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {collapsed && item.badge && (
                        <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse-soft" />
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" sideOffset={10}>
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border/30 px-3 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground",
                  collapsed ? "justify-center px-0" : "px-3"
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {"系统设置"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={10}>
                <p>系统设置</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}

export function TopBar({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-white/70 px-6 backdrop-blur-md shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-72 items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-white hover:shadow-sm hover:border-blue-200"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">
            全局搜索：政策、报告、联系人...
          </span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button
          type="button"
          className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping opacity-75" />
        </button>

        <button
          type="button"
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
