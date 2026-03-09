"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsePageUnderDevelopmentOptions {
  pageName?: string;
}

/**
 * Hook to display a prominent "page under development" overlay
 * Shows a centered card with blurred background overlay
 * User can close it (session-based, won't reshow in current session)
 */
export function usePageUnderDevelopment({
  pageName = "当前页面",
}: UsePageUnderDevelopmentOptions = {}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed this page in current session
  useEffect(() => {
    const dismissed = sessionStorage.getItem(
      `page-dev-dismissed-${pageName}`
    );
    if (dismissed === "true") {
      setIsOpen(false);
      setIsDismissed(true);
    }
  }, [pageName]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`page-dev-dismissed-${pageName}`, "true");
  };

  const UnderDevelopmentOverlay = () => (
    <AnimatePresence>
      {isOpen && !isDismissed && (
        <>
          {/* Blurred background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Centered card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md mx-4">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Header with icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="p-2 bg-amber-50 rounded-lg"
                      >
                        <Zap className="h-5 w-5 text-amber-600" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          敬请期待
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          正在开发中...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <p className="text-sm text-foreground leading-relaxed">
                      <span className="font-semibold">{pageName}</span>
                      功能正在紧张开发中，我们的团队正在打造一个更棒的体验。感谢你的耐心等待！
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">开发进度</span>
                      <span className="font-semibold text-amber-600">
                        75%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                      />
                    </div>
                  </div>

                  {/* Features coming soon */}
                  <div className="mb-6 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      即将推出的功能
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "🎯 智能化分析",
                        "📊 数据可视化",
                        "🔔 实时通知",
                      ].map((feature) => (
                        <div
                          key={feature}
                          className="text-sm text-foreground flex items-center gap-2 py-1"
                        >
                          <span className="text-lg">{feature.split(" ")[0]}</span>
                          <span>{feature.split(" ").slice(1).join(" ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 rounded-lg transition-all"
                  >
                    知道了，我会继续等待
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return {
    isOpen: isOpen && !isDismissed,
    onClose: handleClose,
    UnderDevelopmentOverlay,
  };
}
