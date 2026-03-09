"use client";

import { useState, useEffect, startTransition } from "react";
import type { PersonnelChangeItem } from "@/lib/types/personnel-intel";
import type {
  PersonnelNewsItem,
  PersonnelNewsCategory,
  ImportanceLevel,
  PersonProfile,
} from "@/lib/types/talent-radar";
import { fetchPersonnelEnrichedFeed } from "@/lib/api";

// ── Category detection ────────────────────────────────────

const GOV_KEYWORDS = [
  "部",
  "委",
  "局",
  "厅",
  "办",
  "院",
  "发改",
  "科技",
  "教育",
  "基金",
  "国务院",
  "人社",
  "工信",
  "商务",
  "住建",
  "网信",
  "市监",
  "广播",
  "行政学院",
  "残联",
  "退役",
];

const UNI_KEYWORDS = ["大学", "学院", "研究院", "研究所", "学校"];

function detectCategory(item: PersonnelChangeItem): PersonnelNewsCategory {
  const text = `${item.department ?? ""} ${item.position} ${item.name} ${item.signals.join(" ")}`;
  if (UNI_KEYWORDS.some((kw) => text.includes(kw))) return "高校人事";
  if (GOV_KEYWORDS.some((kw) => text.includes(kw))) return "政府人事";
  return "人才要闻";
}

// ── Title generation ──────────────────────────────────────

function generateTitle(item: PersonnelChangeItem): string {
  if (item.action === "动态") {
    // Article-level item: note contains full title, name is truncated
    return item.note ?? item.name;
  }
  if (item.action === "任命") {
    return `${item.name}${item.action}${item.position}`;
  }
  // 免去
  return `${item.name}不再担任${item.position}`;
}

// ── Importance mapping ────────────────────────────────────

function mapImportance(imp: string): ImportanceLevel {
  if (imp === "紧急" || imp === "重要") return "重要";
  if (imp === "关注") return "关注";
  return "一般";
}

// ── Build PersonProfile ──────────────────────────────────

function buildProfile(item: PersonnelChangeItem): PersonProfile | undefined {
  if (!item.background && !item.department) return undefined;
  return {
    name: item.name,
    title: item.position,
    organization: item.department ?? "",
    background: item.background ?? undefined,
  };
}

// ── Transform ────────────────────────────────────────────

function transformToNewsItem(item: PersonnelChangeItem): PersonnelNewsItem {
  const isArticle = item.action === "动态";
  const summary = item.aiInsight ?? item.background ?? item.note ?? "";
  const relevanceNote = [item.note, item.actionSuggestion]
    .filter(Boolean)
    .join("。");

  return {
    id: item.id,
    title: generateTitle(item),
    summary,
    category: detectCategory(item),
    importance: mapImportance(item.importance),
    date: item.date,
    source: item.source,
    sourceUrl: item.sourceUrl ?? undefined,
    people: isArticle ? [] : [item.name],
    organizations: item.department ? [item.department] : [],
    personProfile: isArticle ? undefined : buildProfile(item),
    relevanceNote: relevanceNote || undefined,
  };
}

// ── Hook ──────────────────────────────────────────────────

interface UsePersonnelNewsResult {
  items: PersonnelNewsItem[];
  profiles: PersonProfile[];
  isLoading: boolean;
  isUsingMock: boolean;
  generatedAt: string | null;
}

export function usePersonnelNews(): UsePersonnelNewsResult {
  const [items, setItems] = useState<PersonnelNewsItem[]>([]);
  const [profiles, setProfiles] = useState<PersonProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await fetchPersonnelEnrichedFeed();

      if (cancelled) return;

      startTransition(() => {
        if (data && data.items.length > 0) {
          const newsItems = data.items
            .map(transformToNewsItem)
            .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
          setItems(newsItems);
          setGeneratedAt(data.generated_at);
          setIsUsingMock(false);

          // Extract unique profiles from all items
          const profileMap = new Map<string, PersonProfile>();
          for (const item of data.items) {
            const profile = buildProfile(item);
            if (profile && !profileMap.has(profile.name)) {
              profileMap.set(profile.name, profile);
            }
          }
          setProfiles(Array.from(profileMap.values()));
        } else {
          setItems([]);
          setProfiles([]);
          setIsUsingMock(true);
        }

        setIsLoading(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, profiles, isLoading, isUsingMock, generatedAt };
}
