"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { MotionCard } from "@/components/motion";
import DataFreshness from "@/components/shared/data-freshness";
import { cn } from "@/lib/utils";
import PolicyFeed from "./policy-feed";
import { mockPolicyFeed } from "@/lib/mock-data/policy-intel";
import type { PolicyFeedCategory } from "@/lib/types/policy-intel";

const CATEGORIES: {
  label: string;
  value: PolicyFeedCategory | "全部";
}[] = [
  { label: "全部", value: "全部" },
  { label: "国家政策", value: "国家政策" },
  { label: "北京政策", value: "北京政策" },
  { label: "领导讲话", value: "领导讲话" },
  { label: "政策机会", value: "政策机会" },
];

export default function PolicyIntelModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    PolicyFeedCategory | "全部"
  >("全部");

  const isSearching = searchQuery.trim().length > 0;

  const filteredFeed = useMemo(() => {
    let items = mockPolicyFeed;
    if (activeCategory !== "全部") {
      items = items.filter((n) => n.category === activeCategory);
    }
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          (n.leader && n.leader.toLowerCase().includes(q)),
      );
    }
    return items;
  }, [activeCategory, searchQuery, isSearching]);

  return (
    <div className="p-5 space-y-4">
      <MotionCard delay={0}>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索政策、机构、关键词... 例如「算力补贴」「科技部」「大模型」"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-11 text-sm rounded-xl bg-muted/30 border-border/50 focus:bg-white transition-colors"
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setActiveCategory((prev) =>
                      prev === cat.value && cat.value !== "全部"
                        ? "全部"
                        : cat.value,
                    )
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeCategory === cat.value
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cat.label}
                </button>
              ))}
              <div className="ml-auto">
                <DataFreshness updatedAt={new Date(Date.now() - 1800000)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard delay={0.1}>
        <PolicyFeed key={activeCategory + searchQuery} items={filteredFeed} />
      </MotionCard>
    </div>
  );
}
