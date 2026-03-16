"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function TypingIndicator() {
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
