"use client";

import { useState, useCallback, useEffect } from "react";

export function useDetailView<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const open = useCallback((item: T) => setSelectedItem(item), []);
  const close = useCallback(() => setSelectedItem(null), []);
  const isOpen = selectedItem !== null;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  return { selectedItem, open, close, isOpen };
}
