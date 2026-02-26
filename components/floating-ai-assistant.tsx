"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  X,
  Minus,
  Sparkles,
  Calendar,
  FileText,
  Search,
  Users,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { motion, AnimatePresence } from "framer-motion";

import type { ChatMessage } from "@/lib/types/ai-assistant";
import {
  quickActions,
  initialMessage,
  getAIResponse,
} from "@/lib/mock-data/ai-assistant";

const ICON_MAP: Record<string, React.ElementType> = {
  calendar: Calendar,
  fileText: FileText,
  search: Search,
  users: Users,
  barChart: BarChart3,
};

// ==================
// Typing Indicator — Gemini-style
// ==================
function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="pt-1.5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 bg-blue-400 rounded-full"
              animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================
// Message Bubble — Gemini-style
// ==================
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const timeStr = message.timestamp.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex justify-end mb-5"
      >
        <div className="max-w-[82%]">
          <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-[13px] leading-relaxed whitespace-pre-line">
            {message.content}
          </div>
          <div className="text-[10px] text-muted-foreground/50 mt-1 text-right pr-1">
            {timeStr}
          </div>
        </div>
      </motion.div>
    );
  }

  // AI message: avatar top-left, content flows beside it
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-3 mb-5"
    >
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] leading-relaxed text-foreground whitespace-pre-line">
          {message.content}
        </div>
        <div className="text-[10px] text-muted-foreground/50 mt-1.5">
          {timeStr}
        </div>
      </div>
    </motion.div>
  );
}

// ==================
// Quick Actions with Arrow Navigation
// ==================
function QuickActionBar({ onAction }: { onAction: (label: string) => void }) {
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
    el.scrollBy({
      left: direction === "left" ? -140 : 140,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Left arrow */}
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

      {/* Scrollable chips (hidden scrollbar) */}
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

      {/* Right arrow */}
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

// ==================
// Main Component
// ==================
let messageIdCounter = 1;
function generateId(): string {
  return `msg-${Date.now()}-${messageIdCounter++}`;
}

export default function FloatingAIAssistant() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getViewport = useCallback(() => {
    return scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;
  }, []);

  const scrollToBottom = useCallback(() => {
    const viewport = getViewport();
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }
  }, [getViewport]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const handleScroll = () => {
      const gap =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      setShowScrollBtn(gap > 80);
    };
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [isOpen, isMinimized, getViewport]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
    }
  }, [chatInput]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
    }, delay);
  };

  const handleSendMessage = () => sendMessage(chatInput);
  const handleQuickAction = (action: string) => sendMessage(action);

  return (
    <>
      {/* ===== Floating trigger button ===== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => {
              setIsOpen(true);
              setNotifications(0);
            }}
            className={cn(
              "fixed z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow duration-300 flex items-center justify-center group",
              isMobile ? "bottom-[76px] right-4" : "bottom-6 right-6",
            )}
          >
            <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
            <span className="absolute inset-[-3px] rounded-full border-2 border-blue-400/30 animate-pulse-subtle pointer-events-none" />
            <Sparkles className="h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background"
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== Chat panel ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className={cn(
              "fixed z-50 overflow-hidden flex flex-col border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10",
              isMobile
                ? "inset-0 rounded-none"
                : "bottom-6 right-6 rounded-2xl",
            )}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white overflow-hidden">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/10">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-tight">
                    AI 智能秘书
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                    <p className="text-[11px] text-white/70">
                      在线 · 随时为您服务
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5 relative z-10">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={cn(isMobile && "flex-1 flex flex-col")}
                >
                  <div
                    className={cn("flex flex-col", isMobile && "flex-1")}
                    style={isMobile ? undefined : { width: 420, height: 560 }}
                  >
                    {/* Chat messages area */}
                    <div className="relative flex-1 min-h-0">
                      <ScrollArea ref={scrollRef} className="h-full">
                        <div className="px-5 pt-5 pb-2">
                          {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                          ))}
                          {isTyping && <TypingIndicator />}
                        </div>
                      </ScrollArea>

                      {/* Scroll to bottom button */}
                      <AnimatePresence>
                        {showScrollBtn && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={scrollToBottom}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quick action chips with arrow navigation */}
                    <div className="px-3 py-2.5 border-t border-border/40">
                      <QuickActionBar onAction={handleQuickAction} />
                    </div>

                    {/* Input area */}
                    <div className="border-t border-border/40 px-3 py-3 bg-muted/20">
                      <div className="flex items-end gap-2 bg-background rounded-xl border border-border/60 px-3 py-2 focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200">
                        <textarea
                          ref={inputRef}
                          placeholder="输入您的问题或指令..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={isTyping}
                          rows={1}
                          className="flex-1 text-[13px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed min-h-[24px] max-h-[100px] py-0.5 disabled:opacity-50"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || isTyping}
                          className={cn(
                            "flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200",
                            chatInput.trim() && !isTyping
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-95"
                              : "bg-muted text-muted-foreground/40",
                          )}
                        >
                          <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
