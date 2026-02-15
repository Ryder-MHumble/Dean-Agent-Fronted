"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bell,
  HelpCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { navGroups } from "@/lib/mock-data/navigation";
import { mockNotifications } from "@/lib/mock-data/app-shell";

export default function AppShell({
  activePage,
  onNavigate,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const newValue = !collapsed;
    if (onCollapsedChange) {
      onCollapsedChange(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 70 : 220 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-white/80 backdrop-blur-xl border-r border-border/40 overflow-x-hidden"
      >
        {/* Logo + Toggle */}
        <div
          className={cn(
            "flex min-h-[68px]",
            collapsed
              ? "flex-col items-center gap-1.5 px-2 py-4"
              : "flex-row items-center gap-2.5 px-5 py-5",
          )}
        >
          <Image
            src="/Logo.png"
            alt="智策云端"
            width={48}
            height={48}
            className="flex-shrink-0 rounded-xl"
            priority
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex-1 min-w-0 overflow-hidden"
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleToggle}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-[18px] w-[18px]" />
                ) : (
                  <PanelLeftClose className="h-[18px] w-[18px]" />
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={10}>
                <p>展开侧栏</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-2 overflow-y-auto">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {groupIdx > 0 && (
                <div className="my-2 mx-0 border-t border-border/30" />
              )}
              {group.label && !collapsed && (
                <AnimatePresence>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60"
                  >
                    {group.label}
                  </motion.p>
                </AnimatePresence>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => onNavigate(item.id)}
                          className={cn(
                            "relative flex w-full items-center gap-3 rounded-xl py-2 text-sm font-medium transition-colors duration-200",
                            collapsed ? "justify-center px-0" : "px-3",
                            isActive
                              ? "bg-blue-50/80 text-blue-600 shadow-sm"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-colors",
                              isActive && "text-blue-600",
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
                                      : "bg-muted text-muted-foreground",
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
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border/30 px-3 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground",
                  collapsed ? "justify-center px-0" : "px-3",
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
  );
}

export function TopBar({
  title,
  subtitle,
  onNavigate,
  searchSlot,
}: {
  title: string;
  subtitle?: string;
  onNavigate?: (page: string) => void;
  searchSlot?: React.ReactNode;
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-white/70 px-6 backdrop-blur-md shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {searchSlot}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping opacity-75" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-border/60 bg-white shadow-elevated overflow-hidden">
                <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">通知中心</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                      5 条未读
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0"
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate?.(notif.module);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                            notif.type === "urgent" && "bg-red-500",
                            notif.type === "deadline" && "bg-amber-500",
                            notif.type === "warning" && "bg-orange-500",
                            notif.type === "info" && "bg-blue-500",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20">
                  <button
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    查看全部通知
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="ml-1 h-6 w-px bg-border/40" />
        <Image
          src="/Logo.png"
          alt="智策云端"
          width={42}
          height={42}
          className="rounded-lg"
        />
      </div>
    </header>
  );
}
