"use client";

import { useState, useEffect } from "react";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import { fetchPolicyFeed } from "@/lib/api";

interface UsePolicyFeedResult {
  items: PolicyFeedItem[];
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
}

export function usePolicyFeed(): UsePolicyFeedResult {
  const [items, setItems] = useState<PolicyFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchPolicyFeed();

      if (cancelled) return;

      if (data && data.items.length > 0) {
        setItems(data.items);
        setGeneratedAt(data.generated_at);
        setIsUsingMock(false);
      } else {
        setItems([]);
        setGeneratedAt(null);
        setIsUsingMock(true);
      }
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, isLoading, isUsingMock, generatedAt };
}
