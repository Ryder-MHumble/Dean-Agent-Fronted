"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTitle } from "@/components/motion";
import { navGroups } from "@/lib/mock-data/navigation";
import { NavItem } from "./nav-item";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  mobileOpen: controlledMobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const collapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const mobileOpen =
    controlledMobileOpen !== undefined
      ? controlledMobileOpen
      : internalMobileOpen;

  const handleToggle = () => {
    const newValue = !collapsed;
    if (onCollapsedChange) {
      onCollapsedChange(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
  };

  const closeMobileSidebar = () => {
    if (onMobileOpenChange) {
      onMobileOpenChange(false);
    } else {
      setInternalMobileOpen(false);
    }
  };

  const showExpanded = !collapsed || (isMobile && mobileOpen);

  return (
    <TooltipProvider delayDuration={0}>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <motion.aside
        animate={{
          width: isMobile ? 220 : collapsed ? 70 : 220,
          x: isMobile && !mobileOpen ? "-100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-white/80 backdrop-blur-xl border-r border-border/40 overflow-x-hidden"
      >
        {/* Logo + Toggle */}
        <div
          className={cn(
            "flex min-h-[68px]",
            !showExpanded
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
            {showExpanded && (
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">
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

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleToggle}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
              >
                {!showExpanded ? (
                  <PanelLeftOpen className="h-[18px] w-[18px]" />
                ) : (
                  <PanelLeftClose className="h-[18px] w-[18px]" />
                )}
              </button>
            </TooltipTrigger>
            {!showExpanded && (
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
              {group.label && showExpanded && (
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
                {group.items.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activePage === item.id}
                    showExpanded={showExpanded}
                    onClick={() => {
                      onNavigate(item.id);
                      closeMobileSidebar();
                    }}
                  />
                ))}
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
                  !showExpanded ? "justify-center px-0" : "px-3",
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {showExpanded && (
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
            {!showExpanded && (
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
