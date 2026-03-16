"use client";

import { useRef, useEffect, useCallback } from "react";
import { Minus, X, Sparkles, ChevronDown, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/types/ai-assistant";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { QuickActionBar } from "./quick-action-bar";

interface ChatPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickAction: (label: string) => void;
  onToggleMinimize: () => void;
  onClose: () => void;
}

export function ChatPanel({
  messages,
  isTyping,
  isMinimized,
  isMobile,
  chatInput,
  onChatInputChange,
  onSendMessage,
  onQuickAction,
  onToggleMinimize,
  onClose,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const showScrollBtnRef = useRef(false);

  const getViewport = useCallback(
    () =>
      scrollRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLElement | null,
    [],
  );

  const scrollToBottom = useCallback(() => {
    const viewport = getViewport();
    if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [getViewport]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (!isMinimized) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isMinimized]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
    }
  }, [chatInput]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 24 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      style={{ transformOrigin: "bottom right" }}
      className={cn(
        "fixed z-50 overflow-hidden flex flex-col border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10",
        isMobile ? "inset-0 rounded-none" : "bottom-6 right-6 rounded-2xl",
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
            <h3 className="font-semibold text-sm tracking-tight">AI 智能秘书</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              <p className="text-[11px] text-white/70">在线 · 随时为您服务</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5 relative z-10">
          <button
            onClick={onToggleMinimize}
            className="p-2 hover:bg-white/15 rounded-lg transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
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
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(isMobile && "flex-1 flex flex-col")}
          >
            <div
              className={cn("flex flex-col", isMobile && "flex-1")}
              style={isMobile ? undefined : { width: 420, height: 560 }}
            >
              {/* Messages */}
              <div className="relative flex-1 min-h-0">
                <ScrollArea ref={scrollRef} className="h-full">
                  <div className="px-5 pt-5 pb-2">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </div>
                </ScrollArea>

                <AnimatePresence>
                  {showScrollBtnRef.current && (
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

              {/* Quick actions */}
              <div className="px-3 py-2.5 border-t border-border/40">
                <QuickActionBar onAction={onQuickAction} />
              </div>

              {/* Input */}
              <div className="border-t border-border/40 px-3 py-3 bg-muted/20">
                <div className="flex items-end gap-2 bg-background rounded-xl border border-border/60 px-3 py-2 focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200">
                  <textarea
                    ref={inputRef}
                    placeholder="输入您的问题或指令..."
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                      }
                    }}
                    disabled={isTyping}
                    rows={1}
                    className="flex-1 text-[13px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed min-h-[24px] max-h-[100px] py-0.5 disabled:opacity-50"
                  />
                  <button
                    onClick={onSendMessage}
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
  );
}
