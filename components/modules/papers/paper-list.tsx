"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataItemCard, {
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import DateRangeFilter from "@/components/shared/date-range-filter";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { usePaperFeed } from "@/hooks/use-paper-feed";
import { getPaperCategorySourceQueries } from "@/lib/paper-feed";
import { cn } from "@/lib/utils";
import type { PaperCategory, PaperRecord } from "@/lib/types/papers";
import { ExternalLink, FileText, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.1.132.21:8001"
).replace(/\/+$/, "");
const SCHOLAR_GRAPH_URL = "http://10.1.132.21:5174/?tab=scholars";

const categoryTabs: Array<{ value: PaperCategory; label: string }> = [
  { value: "all", label: "全部" },
  { value: "top-conference", label: "顶会" },
  { value: "top-journal", label: "顶刊" },
  { value: "arxiv", label: "预印本" },
];

const categoryLabels: Record<PaperCategory, string> = {
  all: "其他来源",
  "top-journal": "顶刊",
  "top-conference": "顶会",
  arxiv: "预印本",
  achievements: "两院学术成果",
};

const sourceLabels: Record<string, string> = {
  aaai: "AAAI",
  acl_long: "ACL 长文",
  acl_short: "ACL 短文",
  acm_ec: "ACM EC",
  cvpr: "CVPR",
  eccv: "ECCV",
  emnlp_main: "EMNLP",
  iccv: "ICCV",
  iclr: "ICLR",
  icml: "ICML",
  ijcai: "IJCAI",
  kdd: "KDD",
  neurips: "NeurIPS",
  pmlr: "PMLR",
  rss: "RSS",
  jair: "JAIR",
  jmlr: "JMLR",
  tmlr: "TMLR",
};

interface PaperListProps {
  category?: PaperCategory;
  groupByPublicationDate?: boolean;
  accessNote?: ReactNode;
}

function getPublicationLabel(paper: PaperRecord): string {
  return (
    paper.publication_date?.slice(0, 10) ||
    (paper.year ? String(paper.year) : "") ||
    "日期待补充"
  );
}

function getSourceLabel(paper: PaperRecord): string {
  const sourceId = paper.source?.source_id?.trim().toLowerCase();
  if (sourceId && sourceLabels[sourceId]) return sourceLabels[sourceId];
  if (paper.category !== "all") return categoryLabels[paper.category];
  return paper.source?.name?.trim() || paper.source?.type?.trim() || "其他来源";
}

function getAffiliations(paper: PaperRecord): string[] {
  return Array.from(
    new Set(
      (paper.affiliations ?? [])
        .map((item) => item.affiliation?.trim())
        .filter((item): item is string => Boolean(item)),
    ),
  );
}

function getAuthorNames(paper: PaperRecord): string[] {
  const names = (paper.authors ?? [])
    .map((author) =>
      typeof author === "string"
        ? author.trim()
        : author.name?.trim() || author.author_name?.trim() || "",
    )
    .filter(Boolean);
  if (names.length > 0) return Array.from(new Set(names));
  return paper.authorsText
    .split(/[,，;；]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

interface ScholarProfile {
  url_hash: string;
  name: string;
  name_en?: string;
  university?: string;
  department?: string;
  position?: string;
  research_areas?: string[];
}

const scholarCache = new Map<string, ScholarProfile | null>();

function PaperAuthorHoverCard({ author }: { author: string }) {
  const [scholar, setScholar] = useState<ScholarProfile | null | undefined>(
    scholarCache.get(author),
  );
  const [isLoading, setIsLoading] = useState(false);
  const graphUrl = `${SCHOLAR_GRAPH_URL}&keyword=${encodeURIComponent(author)}`;

  const loadScholar = async (open: boolean) => {
    if (!open || scholar !== undefined || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/scholars?keyword=${encodeURIComponent(author)}&page=1&page_size=5`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("scholar lookup failed");
      const data = (await response.json()) as { items?: ScholarProfile[] };
      const normalizedAuthor = author.trim().toLocaleLowerCase();
      const matched =
        data.items?.find(
          (item) =>
            item.name?.trim().toLocaleLowerCase() === normalizedAuthor ||
            item.name_en?.trim().toLocaleLowerCase() === normalizedAuthor,
        ) ?? null;
      scholarCache.set(author, matched);
      setScholar(matched);
    } catch {
      scholarCache.set(author, null);
      setScholar(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HoverCard onOpenChange={loadScholar} openDelay={180} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={graphUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#1a3a5c] underline-offset-4 hover:text-blue-600 hover:underline"
        >
          {author}
        </a>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72 space-y-3 rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在查询学者信息
          </div>
        ) : scholar ? (
          <>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {scholar.name || author}
              </p>
              {scholar.name_en && scholar.name_en !== scholar.name && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {scholar.name_en}
                </p>
              )}
            </div>
            <div className="space-y-1 text-xs leading-5 text-muted-foreground">
              <p>
                {[scholar.university, scholar.department]
                  .filter(Boolean)
                  .join(" · ") || "机构信息待补充"}
              </p>
              {scholar.position && <p>{scholar.position}</p>}
              {scholar.research_areas && scholar.research_areas.length > 0 && (
                <p className="line-clamp-2">
                  {scholar.research_areas.slice(0, 4).join("、")}
                </p>
              )}
            </div>
            <p className="text-[11px] font-medium text-blue-600">
              单击姓名进入学者知识图谱
            </p>
          </>
        ) : (
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>暂未匹配到该作者的学者档案</p>
            <p className="font-medium text-blue-600">单击姓名继续搜索知识图谱</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 border-b border-border/60 pb-4 last:border-b-0">
      <h3 className="text-sm font-semibold text-[#1a3a5c]">{title}</h3>
      {children}
    </section>
  );
}

function PaperDetail({ paper }: { paper: PaperRecord }) {
  const affiliations = getAffiliations(paper);
  const authors = getAuthorNames(paper);
  const identifiers = [
    paper.doi ? `DOI：${paper.doi}` : "",
    paper.arxiv_id ? `预印本编号：${paper.arxiv_id}` : "",
    paper.track ? `分会场：${paper.track}` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <DetailSection title="作者">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-6 text-muted-foreground">
          {authors.length > 0
            ? authors.map((author) => (
                <PaperAuthorHoverCard key={author} author={author} />
              ))
            : "作者信息待补充"}
        </div>
      </DetailSection>

      {affiliations.length > 0 && (
        <DetailSection title="机构">
          <div className="flex flex-wrap gap-1.5">
            {affiliations.map((affiliation) => (
              <Badge key={affiliation} variant="secondary" className="text-xs">
                {affiliation}
              </Badge>
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection title="摘要">
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {paper.abstract?.trim() || "摘要待补充"}
        </p>
      </DetailSection>

      {identifiers.length > 0 && (
        <DetailSection title="标识信息">
          <div className="space-y-1 text-xs text-muted-foreground">
            {identifiers.map((identifier) => (
              <p key={identifier}>{identifier}</p>
            ))}
          </div>
        </DetailSection>
      )}

      {paper.pdfUrl && (
        <a
          href={paper.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          <FileText className="h-3.5 w-3.5" />
          查看论文全文
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function PaperRow({
  paper,
  isSelected,
  onClick,
}: {
  paper: PaperRecord;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <DataItemCard
      isSelected={isSelected}
      onClick={onClick}
      accentColor="blue"
      className="p-3.5"
    >
      <div className="mb-1.5 flex items-start justify-between gap-3">
        <h3
          className={cn(
            "line-clamp-1 min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground transition-colors",
            accentConfig.blue.title,
          )}
        >
          {paper.title}
        </h3>
        <ItemChevron accentColor="blue" />
      </div>
      <p className="mb-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {paper.abstract?.trim() || "摘要待补充"}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
        <Badge variant="outline" className="text-[10px] font-medium">
          {getSourceLabel(paper)}
        </Badge>
        <span className="max-w-[45%] truncate">{paper.authorsText}</span>
        <span>{paper.venueText}</span>
        <span className="ml-auto shrink-0">{getPublicationLabel(paper)}</span>
      </div>
    </DataItemCard>
  );
}

export default function PaperList({
  category,
  groupByPublicationDate = false,
  accessNote,
}: PaperListProps) {
  const [selectedCategory, setSelectedCategory] = useState<PaperCategory>(
    category ?? "top-conference",
  );
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const effectiveCategory = category ?? selectedCategory;
  const { selectedItem, open, close, isOpen } = useDetailView<PaperRecord>();
  const listRef = useRef<HTMLDivElement>(null);

  const sourceOptions = useMemo(
    () =>
      getPaperCategorySourceQueries(effectiveCategory)
        .map((query) => query.sourceId)
        .filter((sourceId): sourceId is string => Boolean(sourceId))
        .map((sourceId) => ({
          value: sourceId,
          label: sourceLabels[sourceId] ?? sourceId,
        })),
    [effectiveCategory],
  );

  const feed = usePaperFeed({
    category: effectiveCategory,
    sourceId: selectedSourceId || undefined,
    keyword: searchQuery,
    dateFrom,
    dateTo,
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

  const resetPageAndDetail = useCallback(() => {
    setPage(1);
    close();
  }, [close]);

  const handleCategoryChange = (nextCategory: PaperCategory) => {
    setSelectedCategory(nextCategory);
    setSelectedSourceId("");
    resetPageAndDetail();
  };

  const handlePageChange = (nextPage: number) => {
    close();
    setPage(nextPage);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const renderRows = (papers: PaperRecord[]) =>
    papers.map((paper) => (
      <PaperRow
        key={paper.paper_id || paper.title}
        paper={paper}
        isSelected={selectedItem?.paper_id === paper.paper_id}
        onClick={() => open(paper)}
      />
    ));

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <Card className="relative z-10 shrink-0 rounded-xl shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(value) => {
                setSearchQuery(value);
                resetPageAndDetail();
              }}
              placeholder="搜索论文标题、摘要、作者..."
              className="min-w-[16rem] flex-1"
              inputClassName="h-9 rounded-lg border-border/50 bg-muted/30 text-sm transition-colors focus:bg-white"
              buttonClassName="h-9 rounded-lg"
            />
            <DateRangeFilter
              from={dateFrom}
              to={dateTo}
              onFromChange={(value) => {
                setDateFrom(value);
                resetPageAndDetail();
              }}
              onToChange={(value) => {
                setDateTo(value);
                resetPageAndDetail();
              }}
              onClear={() => {
                setDateFrom("");
                setDateTo("");
                resetPageAndDetail();
              }}
              className="w-full min-w-0 md:w-auto md:shrink-0"
            />
            {sourceOptions.length > 0 && (
              <Select
                value={selectedSourceId || "all"}
                onValueChange={(value) => {
                  setSelectedSourceId(value === "all" ? "" : value);
                  resetPageAndDetail();
                }}
              >
                <SelectTrigger className="h-9 w-full rounded-lg text-xs md:w-40">
                  <SelectValue placeholder="刊会筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部刊会</SelectItem>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!category &&
              categoryTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleCategoryChange(tab.value)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedCategory === tab.value
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            <span className="text-[11px] text-muted-foreground">
              {feed.isSampled ? "精选聚合" : "共"} {feed.total} 条
            </span>
            <div className="ml-auto">{accessNote}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-0 flex-1 overflow-hidden rounded-xl shadow-sm">
        <MasterDetailView
          className="h-full"
          listContentClassName="min-h-0 overflow-hidden"
          isOpen={isOpen}
          onClose={close}
          detailHeader={
            selectedItem
              ? {
                  title: (
                    <h2 className="text-lg font-semibold leading-snug">
                      {selectedItem.title}
                    </h2>
                  ),
                  subtitle: (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">
                        {getSourceLabel(selectedItem)}
                      </Badge>
                      <span>{selectedItem.venueText}</span>
                      <span>&middot;</span>
                      <span>{getPublicationLabel(selectedItem)}</span>
                    </div>
                  ),
                  sourceUrl: selectedItem.sourceUrl ?? undefined,
                }
              : undefined
          }
          detailContent={selectedItem ? <PaperDetail paper={selectedItem} /> : null}
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 p-3">
            <div
              ref={listRef}
              aria-busy={feed.isLoading}
              className={cn(
                "min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1 transition-opacity",
                feed.isLoading && feed.items.length > 0 && "opacity-60",
              )}
            >
              {feed.isLoading && feed.items.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  数据加载中
                </div>
              ) : feed.isDisconnected ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  论文数据服务暂不可用
                </div>
              ) : feed.items.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  {effectiveCategory === "arxiv"
                    ? "当前论文数据表暂无预印本记录"
                    : "暂无符合条件的论文"}
                </div>
              ) : groupByPublicationDate ? (
                dateGroups.map(([date, papers]) => (
                  <section key={date} className="space-y-2">
                    <div className="flex items-center justify-between px-1 pt-1">
                      <h3 className="text-xs font-semibold text-[#1a3a5c]">
                        {date}
                      </h3>
                      <span className="text-[11px] text-muted-foreground">
                        {papers.length} 条
                      </span>
                    </div>
                    {renderRows(papers)}
                  </section>
                ))
              ) : (
                renderRows(feed.items)
              )}
            </div>
            <FeedPagination
              page={feed.page}
              pageSize={feed.pageSize}
              total={feed.total}
              totalPages={feed.totalPages}
              totalIsEstimate={feed.isSampled}
              isLoading={feed.isLoading}
              onPageChange={handlePageChange}
              className="w-full"
            />
          </div>
        </MasterDetailView>
      </Card>
    </div>
  );
}
