"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Building,
  Calendar,
  MoreHorizontal,
  Cpu,
  Globe,
  GraduationCap,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileBottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const primaryTabs = [
  { id: "home", label: "首页", icon: LayoutDashboard },
  { id: "policy-intel", label: "情报", icon: FileText },
  { id: "internal-mgmt", label: "管理", icon: Building },
  { id: "smart-schedule", label: "日程", icon: Calendar },
  { id: "_more", label: "更多", icon: MoreHorizontal },
];

const moreTabs = [
  { id: "tech-frontier", label: "科技前沿", icon: Cpu },
  { id: "talent-radar", label: "人事动态", icon: Globe },
  { id: "university-eco", label: "高校生态", icon: GraduationCap },
  { id: "network", label: "人脉网络", icon: Users },
];

// Pages that should highlight the "情报" tab
const intelPages = new Set(["policy-intel", "tech-frontier", "talent-radar", "university-eco"]);

export default function MobileBottomNav({ activePage, onNavigate }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  const getActiveTab = (tabId: string) => {
    if (tabId === "policy-intel") {
      return intelPages.has(activePage);
    }
    if (tabId === "_more") {
      return moreTabs.some((t) => t.id === activePage);
    }
    return activePage === tabId;
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "_more") {
      setMoreOpen((v) => !v);
    } else {
      setMoreOpen(false);
      onNavigate(tabId);
    }
  };

  const handleMoreNavigate = (pageId: string) => {
    setMoreOpen(false);
    onNavigate(pageId);
  };

  return (
    <>
      {/* More panel overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 md:hidden rounded-t-2xl bg-white/95 backdrop-blur-xl border-t border-border/40 shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-sm font-semibold text-foreground">更多模块</span>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 px-4 pb-[calc(76px+env(safe-area-inset-bottom))]">
                {moreTabs.map((tab) => {
                  const isActive = activePage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleMoreNavigate(tab.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-muted-foreground active:bg-muted/40",
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="text-[11px] font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-border/40 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div
          className="flex items-stretch"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {primaryTabs.map((tab) => {
            const isActive = getActiveTab(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors",
                  isActive ? "text-blue-600" : "text-muted-foreground active:text-foreground",
                )}
              >
                <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
