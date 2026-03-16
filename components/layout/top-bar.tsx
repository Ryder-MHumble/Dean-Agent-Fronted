"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, HelpCircle, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTitle } from "@/components/motion";
import { mockNotifications } from "@/lib/mock-data/app-shell";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onNavigate?: (page: string) => void;
  searchSlot?: React.ReactNode;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

export function TopBar({
  title,
  subtitle,
  onNavigate,
  searchSlot,
  onMenuClick,
  onSearchClick,
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-white/70 px-4 sm:px-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AnimatedTitle title={title} subtitle={subtitle} />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {searchSlot}

        <button
          type="button"
          onClick={onSearchClick}
          className="sm:hidden rounded-xl p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

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

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 z-50 w-[90vw] sm:w-80 max-w-md rounded-xl border border-border/60 bg-white shadow-elevated overflow-hidden"
                >
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
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
