"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/types/ai-assistant";
import { initialMessage, getAIResponse } from "@/lib/mock-data/ai-assistant";
import { ChatPanel } from "./chat-panel";

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

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => { setIsOpen(true); setNotifications(0); }}
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

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            isMinimized={isMinimized}
            isMobile={isMobile}
            chatInput={chatInput}
            onChatInputChange={setChatInput}
            onSendMessage={() => sendMessage(chatInput)}
            onQuickAction={sendMessage}
            onToggleMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => { setIsOpen(false); setIsMinimized(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
