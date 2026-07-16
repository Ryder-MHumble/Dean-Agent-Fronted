"use client";

import { useEffect, useRef } from "react";
import { getDefaultDetailSelection } from "@/lib/detail-selection";

interface AutoSelectDetailOptions<T> {
  items: readonly T[];
  selectedItem: T | null;
  select: (item: T) => void | Promise<void>;
  close: () => void;
  getKey: (item: T) => string;
  isLoading?: boolean;
  preserveSelectedOutsideItems?: boolean;
}

export function useAutoSelectDetail<T>({
  items,
  selectedItem,
  select,
  close,
  getKey,
  isLoading = false,
  preserveSelectedOutsideItems = false,
}: AutoSelectDetailOptions<T>) {
  const selectedItemRef = useRef<T | null>(selectedItem);
  selectedItemRef.current = selectedItem;
  const itemSignature = items.map(getKey).join("\u0000");

  useEffect(() => {
    if (isLoading) return;

    const autoOpen =
      typeof window !== "undefined" && window.innerWidth >= 768;
    const current = selectedItemRef.current;
    const next = getDefaultDetailSelection(
      items,
      current,
      getKey,
      autoOpen,
      preserveSelectedOutsideItems,
    );

    if (!next) {
      if (current) close();
      return;
    }

    if (!current || getKey(current) !== getKey(next)) {
      void select(next);
    }
  }, [
    close,
    getKey,
    isLoading,
    itemSignature,
    preserveSelectedOutsideItems,
    select,
  ]);
}
