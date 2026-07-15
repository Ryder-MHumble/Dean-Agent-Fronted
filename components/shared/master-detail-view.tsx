"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface MasterDetailViewProps {
  /** Whether detail panel is open (truthy selectedItem) */
  isOpen: boolean;
  /** Close the detail panel */
  onClose: () => void;
  /** List content (always rendered, width adapts) */
  children: ReactNode;
  /** Detail panel content */
  detailContent: ReactNode;
  /** Detail panel header */
  detailHeader?: {
    title: ReactNode;
    subtitle?: ReactNode;
    /** URL to original article — renders a "跳转原文" button in header */
    sourceUrl?: string;
  };
  /** Detail panel footer (action buttons) */
  detailFooter?: ReactNode;
  /** Split ratio percentage for list pane (default 40) */
  listWidth?: number;
  /** Container className */
  className?: string;
  /** Class for the desktop list content wrapper */
  listContentClassName?: string;
  /** Opt-in styling for intelligence report pages */
  variant?: "default" | "intelligence";
}

export default function MasterDetailView({
  isOpen,
  onClose,
  children,
  detailContent,
  detailHeader,
  detailFooter,
  listWidth = 50,
  className,
  listContentClassName,
  variant = "default",
}: MasterDetailViewProps) {
  const breakpoint = useBreakpoint();
  const isIntelligence = variant === "intelligence";
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const mobileBackButtonRef = useRef<HTMLButtonElement | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  const cancelScheduledFocus = () => {
    if (focusFrameRef.current === null) return;
    cancelAnimationFrame(focusFrameRef.current);
    focusFrameRef.current = null;
  };

  const scheduleFocus = (focus: () => void) => {
    cancelScheduledFocus();
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      focus();
    });
  };

  const closeDetail = () => {
    shouldRestoreFocusRef.current = true;
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const selectedItem = document.querySelector<HTMLElement>(
        '[data-intelligence-item][aria-current="true"]',
      );

      if (selectedItem) {
        restoreFocusRef.current = selectedItem;
      } else if (!wasOpenRef.current) {
        restoreFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      }

      if (!wasOpenRef.current) {
        shouldRestoreFocusRef.current = false;
        if (breakpoint === "mobile") {
          scheduleFocus(() => mobileBackButtonRef.current?.focus());
        } else {
          cancelScheduledFocus();
        }
      }
    }

    if (!isOpen && wasOpenRef.current) {
      if (shouldRestoreFocusRef.current) {
        const target = restoreFocusRef.current;
        scheduleFocus(() => {
          if (target?.isConnected) target.focus();
          restoreFocusRef.current = null;
          shouldRestoreFocusRef.current = false;
        });
      } else {
        cancelScheduledFocus();
        restoreFocusRef.current = null;
        shouldRestoreFocusRef.current = false;
      }
    }

    wasOpenRef.current = isOpen;
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        shouldRestoreFocusRef.current = true;
      }
    };

    document.addEventListener("keydown", handleEscape, true);
    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [isOpen]);

  useEffect(
    () => () => {
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }
    },
    [],
  );

  // Mobile: full-screen detail overlay
  if (breakpoint === "mobile") {
    return (
      <div className={cn("relative", isIntelligence && "bg-white", className)}>
        {children}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "fixed inset-0 z-50 flex flex-col bg-background",
                isIntelligence && "bg-white",
              )}
            >
              {/* Mobile header */}
              <div
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-3",
                  isIntelligence && "border-[#e5e9f0] bg-white",
                )}
              >
                <button
                  ref={mobileBackButtonRef}
                  onClick={closeDetail}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
                  aria-label="返回列表"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  {detailHeader?.title}
                  {detailHeader?.subtitle}
                </div>
                {detailHeader?.sourceUrl && (
                  <a
                    href={detailHeader.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 items-center gap-1.5 shrink-0 rounded-lg border px-3 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    原文
                  </a>
                )}
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">{detailContent}</div>
              </ScrollArea>
              {detailFooter && (
                <div
                  className={cn(
                    "border-t bg-background px-4 py-3",
                    isIntelligence && "border-[#e5e9f0] bg-white",
                  )}
                >
                  {detailFooter}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Tablet: overlay panel without dark backdrop
  if (breakpoint === "tablet") {
    return (
      <div className={cn("relative", isIntelligence && "bg-white", className)}>
        {children}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "absolute right-0 top-0 z-30 flex h-full w-[70%] flex-col border-l bg-background shadow-2xl",
                isIntelligence && "border-[#e5e9f0] bg-white",
              )}
            >
              <DetailPanelInner
                detailHeader={detailHeader}
                detailContent={detailContent}
                detailFooter={detailFooter}
                onClose={closeDetail}
                variant={variant}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop: side-by-side split
  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden",
        isIntelligence && "bg-white",
        className,
      )}
    >
      {/* List pane */}
      <motion.div
        animate={{ width: isOpen ? `${listWidth}%` : "100%" }}
        transition={{ duration: 0.28, ease: EASE }}
        className="min-h-0 shrink-0 flex flex-col overflow-hidden overscroll-y-contain"
      >
        <div className={cn("min-h-0 flex-1 overflow-y-auto", listContentClassName)}>
          {children}
        </div>
      </motion.div>

      {/* Detail pane */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.28, ease: EASE }}
            className={cn(
              "flex flex-1 min-h-0 flex-col overflow-hidden border-l border-border/60 bg-background shadow-lg",
              isIntelligence && "border-[#e5e9f0] bg-white",
            )}
          >
            <DetailPanelInner
              detailHeader={detailHeader}
              detailContent={detailContent}
              detailFooter={detailFooter}
              onClose={closeDetail}
              variant={variant}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Shared inner layout for detail panel (header + content + footer) */
function DetailPanelInner({
  detailHeader,
  detailContent,
  detailFooter,
  onClose,
  variant,
}: {
  detailHeader?: MasterDetailViewProps["detailHeader"];
  detailContent: ReactNode;
  detailFooter?: ReactNode;
  onClose: () => void;
  variant: NonNullable<MasterDetailViewProps["variant"]>;
}) {
  return (
    <>
      {/* Sticky header */}
      <div
        className={cn(
          "flex items-start justify-between gap-3 border-b px-6 py-4",
          variant === "intelligence"
            ? "border-[#e5e9f0] bg-white"
            : "bg-background/95 backdrop-blur-sm",
        )}
      >
        <div className="flex-1 min-w-0">
          {detailHeader?.title}
          {detailHeader?.subtitle}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {detailHeader?.sourceUrl && (
            <a
              href={detailHeader.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-medium text-blue-600 hover:bg-blue-100 transition-colors",
                variant === "intelligence" && "border-[#e5e9f0]",
              )}
            >
              <ExternalLink className="h-3 w-3" />
              跳转原文
            </a>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
            aria-label="关闭详情"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0 [&_[data-radix-scroll-area-viewport]]:overscroll-contain">
        <div className="p-6">{detailContent}</div>
      </ScrollArea>

      {/* Fixed footer */}
      {detailFooter && (
        <div
          className={cn(
            "border-t bg-background px-6 py-4",
            variant === "intelligence" && "border-[#e5e9f0] bg-white",
          )}
        >
          {detailFooter}
        </div>
      )}
    </>
  );
}
