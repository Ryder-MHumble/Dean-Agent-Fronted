"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemData {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavItemProps {
  item: NavItemData;
  isActive: boolean;
  showExpanded: boolean;
  onClick: () => void;
}

export function NavItem({ item, isActive, showExpanded, onClick }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-xl py-2 text-sm font-medium transition-colors duration-200",
            !showExpanded ? "justify-center px-0" : "px-3",
            isActive
              ? "text-violet-600"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl sidebar-active-bg shadow-sm"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <item.icon
            className={cn(
              "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors",
              isActive && "text-violet-600",
            )}
          />
          <AnimatePresence>
            {showExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative z-10 whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showExpanded && item.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 ml-auto"
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[10px]",
                    isActive
                      ? "bg-violet-100 text-violet-600"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.badge}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          {!showExpanded && item.badge && (
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-violet-500 animate-pulse-soft" />
          )}
        </button>
      </TooltipTrigger>
      {!showExpanded && (
        <TooltipContent side="right" sideOffset={10}>
          <p>{item.label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
