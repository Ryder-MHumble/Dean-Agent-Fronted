"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar, FileText, Search, Users, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { quickActions } from "@/lib/mock-data/ai-assistant";

const ICON_MAP: Record<string, React.ElementType> = {
  calendar: Calendar,
  fileText: FileText,
  search: Search,
  users: Users,
  barChart: BarChart3,
};

interface QuickActionBarProps {
  onAction: (label: string) => void;
}

export function QuickActionBar({ onAction }: QuickActionBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -140 : 140, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-1.5">
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll("left")}
            className="flex-shrink-0 h-7 w-7 rounded-full border border-border/60 bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scrollContainerRef}
        className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {quickActions.map((action) => {
          const Icon = ICON_MAP[action.icon];
          return (
            <button
              key={action.label}
              onClick={() => onAction(action.label)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 rounded-full transition-all duration-150 hover:shadow-sm active:scale-[0.97] select-none"
            >
              {Icon && <Icon className="h-3 w-3 opacity-70" />}
              {action.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll("right")}
            className="flex-shrink-0 h-7 w-7 rounded-full border border-border/60 bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
