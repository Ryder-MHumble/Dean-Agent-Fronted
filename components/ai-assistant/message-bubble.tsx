"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/types/ai-assistant";

export function MessageBubble({ message }: { message: ChatMessage }) {
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
        <div className="text-[10px] text-muted-foreground/50 mt-1.5">{timeStr}</div>
      </div>
    </motion.div>
  );
}
