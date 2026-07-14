"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import FeedPagination from "@/components/shared/feed-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaperFeed } from "@/hooks/use-paper-feed";
import type { PaperCategory, PaperRecord } from "@/lib/types/papers";

const PAGE_SIZE = 20;

const categoryTabs: Array<{ value: PaperCategory; label: string }> = [
  { value: "all", label: "全部" },
  { value: "top-journal", label: "顶刊" },
  { value: "top-conference", label: "顶会" },
  { value: "arxiv", label: "预印本" },
];

const categoryLabels: Record<PaperCategory, string> = {
  all: "其他来源",
  "top-journal": "顶刊",
  "top-conference": "顶会",
  arxiv: "预印本",
  achievements: "两院学术成果",
};

interface PaperListProps {
  category?: PaperCategory;
  groupByPublicationDate?: boolean;
}

function getPublicationLabel(paper: PaperRecord): string {
  return paper.publication_date?.slice(0, 10) ||
    (paper.year ? String(paper.year) : "") ||
    "日期待补充";
}

function getSourceLabel(paper: PaperRecord): string {
  if (paper.category !== "all") return categoryLabels[paper.category];
  return paper.source?.name?.trim() || paper.source?.type?.trim() || "其他来源";
}

function PaperRow({ paper }: { paper: PaperRecord }) {
  const venueAndYear = [paper.venueText, paper.year].filter(Boolean).join(" · ");

  return (
    <article className="grid gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px] md:gap-4">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-6 text-slate-900">
          {paper.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="min-w-0 truncate">{paper.authorsText}</span>
          <span aria-hidden="true">·</span>
          <span>{venueAndYear || "刊会信息待补充"}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-600">
          {paper.abstract?.trim() || "摘要待补充"}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-center">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {getSourceLabel(paper)}
        </span>
        {paper.sourceUrl ? (
          <a
            href={paper.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3a5c] hover:underline"
          >
            原始链接
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">原始链接待补充</span>
        )}
      </div>
    </article>
  );
}

export default function PaperList({
  category,
  groupByPublicationDate = false,
}: PaperListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<PaperCategory>(category ?? "all");
  const [page, setPage] = useState(1);
  const effectiveCategory = category ?? selectedCategory;
  const feed = usePaperFeed({
    category: effectiveCategory,
    page,
    pageSize: PAGE_SIZE,
  });

  const dateGroups = useMemo(() => {
    if (!groupByPublicationDate) return [];

    const groups = new Map<string, PaperRecord[]>();
    for (const paper of feed.items) {
      const label = getPublicationLabel(paper);
      const group = groups.get(label) ?? [];
      group.push(paper);
      groups.set(label, group);
    }
    return Array.from(groups.entries());
  }, [feed.items, groupByPublicationDate]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as PaperCategory);
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3a5c]">
            {groupByPublicationDate ? "成果时间线" : "论文列表"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">共 {feed.total} 条</p>
        </div>
        {!category && (
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
            <TabsList className="h-9 rounded-lg bg-slate-100 p-1">
              {categoryTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-7 rounded-md px-3 text-xs data-[state=active]:text-[#1a3a5c]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <div
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        aria-busy={feed.isLoading}
      >
        {feed.isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            数据加载中
          </div>
        ) : feed.isDisconnected ? (
          <div className="flex min-h-48 items-center justify-center px-4 text-sm text-slate-500">
            论文数据服务暂不可用
          </div>
        ) : feed.items.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center px-4 text-sm text-slate-500">
            {effectiveCategory === "arxiv"
              ? "当前论文数据表暂无预印本记录"
              : "暂无符合条件的论文"}
          </div>
        ) : groupByPublicationDate ? (
          <div>
            {dateGroups.map(([date, papers]) => (
              <section key={date} aria-label={date}>
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
                  <h3 className="text-sm font-semibold text-[#1a3a5c]">{date}</h3>
                  <span className="text-xs text-slate-500">
                    {papers.length} 条
                  </span>
                </div>
                {papers.map((paper) => (
                  <PaperRow key={paper.paper_id || paper.title} paper={paper} />
                ))}
              </section>
            ))}
          </div>
        ) : (
          feed.items.map((paper) => (
            <PaperRow key={paper.paper_id || paper.title} paper={paper} />
          ))
        )}
      </div>

      <FeedPagination
        page={feed.page}
        pageSize={feed.pageSize}
        total={feed.total}
        totalPages={feed.totalPages}
        isLoading={feed.isLoading}
        onPageChange={setPage}
        className="rounded-xl bg-white shadow-sm"
      />
    </div>
  );
}
