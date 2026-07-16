"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import {
  IntelligenceDetailHeader,
  IntelligenceSection,
} from "@/components/shared/intelligence-detail";
import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
import { useAutoSelectDetail } from "@/hooks/use-auto-select-detail";
import { useDetailView } from "@/hooks/use-detail-view";
import { useZgcaAchievements } from "@/hooks/use-zgca-achievements";
import {
  getAchievementMemberNames,
  getAchievementPrimaryDate,
  getAchievementSourceLabel,
  mergeAchievementAuthors,
  type ResolvedAchievementMember,
} from "@/lib/achievement-feed";
import { cn } from "@/lib/utils";
import type {
  AchievementClaimStatus,
  AchievementMember,
  AchievementRecord,
  AchievementType,
} from "@/lib/types/achievements";
import { ChevronRight, ExternalLink, FileText, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

function getAchievementKey(item: AchievementRecord) {
  return String(item.id);
}
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.1.132.21:8001"
).replace(/\/+$/, "");
const scholarIdentityCache = new Map<
  string,
  { name: string; nameEn: string }
>();

type TypeFilter = "all" | AchievementType;
type ClaimFilter = "all" | AchievementClaimStatus;

const typeFilters: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "全部成果" },
  { value: "paper", label: "论文" },
  { value: "open_source", label: "开源成果" },
  { value: "patent", label: "专利" },
  { value: "other", label: "其他" },
];

const typeLabels: Record<AchievementType, string> = {
  paper: "论文",
  open_source: "开源成果",
  patent: "专利",
  other: "其他",
};

const sourceLabels: Record<string, string> = {
  student_publications: "学生成果",
  dingtalk_confirmed: "钉钉确认",
  papers_affiliation: "论文成员匹配",
  scholar_patents: "学者专利",
};

function AchievementTypeBadge({ type }: { type: AchievementType }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-medium",
        type === "paper" && "border-blue-200 bg-blue-50 text-blue-700",
        type === "open_source" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        type === "patent" &&
          "border-amber-200 bg-amber-50 text-amber-700",
        type === "other" && "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      {typeLabels[type]}
    </Badge>
  );
}

function ClaimStatusBadge({ status }: { status: AchievementClaimStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px]",
        status === "confirmed"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {status === "confirmed" ? "已确认" : "自动匹配"}
    </Badge>
  );
}

function getAchievementDescription(item: AchievementRecord): string {
  return (
    item.abstract?.trim() ||
    item.notes?.trim() ||
    (item.project_name ? `所属项目：${item.project_name}` : "") ||
    "暂无补充说明"
  );
}

function getAchievementContext(item: AchievementRecord): string {
  return (
    item.venue?.trim() ||
    item.project_name?.trim() ||
    sourceLabels[item.source_system ?? ""] ||
    "来源待补充"
  );
}

function getFallbackMemberIdentity(
  member: AchievementMember,
): ResolvedAchievementMember {
  const name =
    member.scholar_name_cn?.trim() ||
    member.name?.trim() ||
    member.author_name?.trim() ||
    "";
  return {
    name,
    aliases: Array.from(
      new Set(
        [member.name, member.author_name, member.scholar_name_cn]
          .map((value) => value?.trim() || "")
          .filter(Boolean),
      ),
    ),
    role: member.role?.trim() || null,
  };
}

function AchievementAuthorList({ item }: { item: AchievementRecord }) {
  const fallbackMembers = useMemo(
    () => item.zgca_members.map(getFallbackMemberIdentity).filter((member) => member.name),
    [item.zgca_members],
  );
  const [members, setMembers] = useState(fallbackMembers);

  useEffect(() => {
    let active = true;
    setMembers(fallbackMembers);

    Promise.all(
      item.zgca_members.map(async (member) => {
        const fallback = getFallbackMemberIdentity(member);
        if (!member.scholar_id) {
          return fallback;
        }

        const cachedIdentity = scholarIdentityCache.get(member.scholar_id);
        if (cachedIdentity) {
          return {
            name: cachedIdentity.name || fallback.name,
            aliases: Array.from(
              new Set([
                ...fallback.aliases,
                cachedIdentity.name,
                cachedIdentity.nameEn,
              ].filter(Boolean)),
            ),
            role: fallback.role,
          };
        }

        try {
          const response = await fetch(
            `${API_BASE}/api/scholars/${encodeURIComponent(member.scholar_id)}`,
            { cache: "no-store" },
          );
          if (!response.ok) throw new Error("scholar lookup failed");
          const scholar = (await response.json()) as {
            name?: string;
            name_en?: string;
          };
          const identity = {
            name: scholar.name?.trim() || fallback.name,
            nameEn: scholar.name_en?.trim() || "",
          };
          scholarIdentityCache.set(member.scholar_id, identity);
          return {
            name: identity.name,
            aliases: Array.from(
              new Set(
                [...fallback.aliases, identity.name, identity.nameEn].filter(Boolean),
              ),
            ),
            role: fallback.role,
          };
        } catch {
          return fallback;
        }
      }),
    ).then((resolvedMembers) => {
      if (!active) return;
      const deduplicated = new Map<string, ResolvedAchievementMember>();
      for (const member of resolvedMembers) {
        if (member.name && !deduplicated.has(member.name)) {
          deduplicated.set(member.name, member);
        }
      }
      setMembers(Array.from(deduplicated.values()));
    });

    return () => {
      active = false;
    };
  }, [fallbackMembers, item.zgca_members]);

  const authors = mergeAchievementAuthors(item.authors, members);

  return (
    <div className="flex flex-wrap gap-2">
      {authors.length === 0 ? (
        <p className="text-sm text-muted-foreground">作者信息待补充</p>
      ) : (
        authors.map((author, index) => (
          <div
            key={`${author.name}-${author.originalName || index}`}
            className={cn(
              "inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg px-3 py-2 text-sm",
              author.isZgcaMember ? "bg-blue-50/70" : "bg-muted/30",
            )}
          >
            <span className="font-medium text-foreground">{author.name}</span>
            {author.originalName && (
              <span className="text-xs text-muted-foreground">
                {author.originalName}
              </span>
            )}
            {author.isZgcaMember && (
              <Badge
                variant="outline"
                className="border-blue-200 bg-white text-[10px] text-blue-700"
              >
                两院{author.role === "advisor" ? "导师" : author.role === "student" ? "学生" : "成员"}
              </Badge>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AchievementDetail({ item }: { item: AchievementRecord }) {
  const identifiers = [
    item.doi ? `DOI：${item.doi}` : "",
    item.arxiv_id ? `预印本编号：${item.arxiv_id}` : "",
    item.paper_id ? `论文编号：${item.paper_id}` : "",
    item.paper_status ? `论文状态：${item.paper_status}` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <IntelligenceSection title="作者">
        <AchievementAuthorList item={item} />
      </IntelligenceSection>

      <IntelligenceSection title="摘要">
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {item.abstract?.trim() || item.notes?.trim() || "暂无补充说明"}
        </p>
      </IntelligenceSection>

      {(item.project_name || item.project_leader || item.project_batch) && (
        <IntelligenceSection title="项目信息">
          <div className="space-y-1 text-sm text-muted-foreground">
            {item.project_name && <p>项目名称：{item.project_name}</p>}
            {item.project_leader && <p>项目负责人：{item.project_leader}</p>}
            {item.project_batch && <p>项目批次：{item.project_batch}</p>}
          </div>
        </IntelligenceSection>
      )}

      {item.sources.length > 0 && (
        <IntelligenceSection title="来源记录">
          <div className="space-y-2">
            {item.sources.map((source, index) => {
              const url = typeof source.url === "string" ? source.url : null;
              const system =
                typeof source.system === "string" ? source.system : "";
              const sourceName =
                typeof source.source_name === "string" ? source.source_name : "";
              const table =
                typeof source.source_table === "string" ? source.source_table : "";
              const label =
                sourceLabels[system] || sourceName || table || `来源 ${index + 1}`;
              return (
                <div key={`${label}-${index}`} className="flex items-start gap-2 text-xs">
                  <span className="min-w-0 flex-1 text-muted-foreground">
                    {label}
                    {table && table !== label ? ` · ${table}` : ""}
                  </span>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-blue-600 hover:underline"
                    >
                      查看来源
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </IntelligenceSection>
      )}

      {identifiers.length > 0 && (
        <IntelligenceSection title="标识信息">
          <div className="space-y-1 text-xs text-muted-foreground">
            {identifiers.map((identifier) => (
              <p key={identifier}>{identifier}</p>
            ))}
          </div>
        </IntelligenceSection>
      )}

      {item.pdf_url && (
        <a
          href={item.pdf_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          <FileText className="h-3.5 w-3.5" />
          查看成果全文
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function AchievementDetailHeader({ item }: { item: AchievementRecord }) {
  return (
    <IntelligenceDetailHeader
      badges={
        <>
          <AchievementTypeBadge type={item.achievement_type} />
          <Badge variant="outline" className="text-[10px] font-medium">
            {getAchievementSourceLabel(item)}
          </Badge>
        </>
      }
      title={item.title}
      meta={<span>{getAchievementPrimaryDate(item)}</span>}
    />
  );
}

export default function AcademicAchievementList({
  accessNote,
}: {
  accessNote?: ReactNode;
}) {
  const [type, setType] = useState<TypeFilter>("all");
  const [claimStatus, setClaimStatus] = useState<ClaimFilter>("all");
  const [year, setYear] = useState("all");
  const [sourceSystem, setSourceSystem] = useState("all");
  const [hasMembers, setHasMembers] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const { selectedItem, open, close, isOpen } = useDetailView<AchievementRecord>();
  const listRef = useRef<HTMLDivElement>(null);

  const feed = useZgcaAchievements({
    type: type === "all" ? undefined : type,
    claimStatus: claimStatus === "all" ? undefined : claimStatus,
    year: year === "all" ? undefined : Number(year),
    sourceSystem: sourceSystem === "all" ? undefined : sourceSystem,
    hasMembers: hasMembers ? true : undefined,
    keyword,
    page,
    pageSize: PAGE_SIZE,
  });

  useAutoSelectDetail({
    items: feed.items,
    selectedItem,
    select: open,
    close,
    getKey: getAchievementKey,
    isLoading: feed.isLoading,
  });

  const typeCounts = useMemo(
    () =>
      new Map(
        (feed.stats?.by_type ?? []).map((item) => [
          item.achievement_type,
          item.count,
        ]),
      ),
    [feed.stats],
  );

  const resetView = useCallback(() => {
    setPage(1);
    close();
  }, [close]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    close();
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <>
      <IntelligenceWorkspace
        listHeader={
          <IntelligenceToolbar
            variant="embedded"
            title="两院学术成果"
            total={feed.total}
            actions={accessNote}
            supplemental={
          <div className="flex flex-wrap items-center gap-2">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setType(filter.value);
                  resetView();
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  type === filter.value
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                {filter.label}
                {filter.value !== "all" && typeCounts.has(filter.value) &&
                  ` ${typeCounts.get(filter.value)}`}
              </button>
            ))}
            <div className="h-4 w-px bg-border" />
            {([
              ["all", "全部状态"],
              ["confirmed", "已确认"],
              ["auto_matched", "自动匹配"],
            ] as Array<[ClaimFilter, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setClaimStatus(value);
                  resetView();
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  claimStatus === value
                    ? "bg-slate-200 text-slate-800"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setHasMembers((value) => !value);
                resetView();
              }}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                hasMembers
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              仅看已关联成员
            </button>
          </div>
            }
          >
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onSearch={(value) => {
            setKeyword(value);
            resetView();
          }}
          placeholder="搜索成果名称..."
          className="min-w-[16rem] flex-1"
          inputClassName="h-9 rounded-lg border-border/50 bg-muted/30 text-sm transition-colors focus:bg-white"
          buttonClassName="h-9 rounded-lg"
        />
        <Select
          value={year}
          onValueChange={(value) => {
            setYear(value);
            resetView();
          }}
        >
          <SelectTrigger className="h-9 w-full rounded-lg text-xs sm:w-32">
            <SelectValue placeholder="成果年份" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部年份</SelectItem>
            {(feed.stats?.by_year ?? []).map((item) => (
              <SelectItem key={item.venue_year} value={String(item.venue_year)}>
                {item.venue_year} 年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sourceSystem}
          onValueChange={(value) => {
            setSourceSystem(value);
            resetView();
          }}
        >
          <SelectTrigger className="h-9 w-full rounded-lg text-xs sm:w-40">
            <SelectValue placeholder="数据来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            {(feed.stats?.by_source_system ?? []).map((item) => (
              <SelectItem key={item.source_system} value={item.source_system}>
                {sourceLabels[item.source_system] || item.source_system}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </IntelligenceToolbar>
        }
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedItem
            ? {
                title: <AchievementDetailHeader item={selectedItem} />,
                sourceUrl: selectedItem.detail_url ?? undefined,
              }
            : undefined
        }
        detailContent={
          selectedItem ? <AchievementDetail item={selectedItem} /> : null
        }
      >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
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
                  成果数据服务暂不可用
                </div>
              ) : feed.items.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  暂无符合条件的成果
                </div>
              ) : (
                feed.items.map((item) => {
                  const members = getAchievementMemberNames(item);
                  return (
                    <IntelligenceListItem
                      key={item.id}
                      selected={selectedItem?.id === item.id}
                      onClick={() => open(item)}
                      className="group p-3.5"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <AchievementTypeBadge type={item.achievement_type} />
                          <h3 className="line-clamp-1 min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-[#3156d8]">
                            {item.title}
                          </h3>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
                      </div>
                      <p className="mb-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {getAchievementDescription(item)}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                        <ClaimStatusBadge status={item.claim_status} />
                        <span className="max-w-[35%] truncate">
                          {members.length > 0
                            ? `两院成员：${members.join("、")}`
                            : item.authors.length > 0
                              ? `作者：${item.authors.slice(0, 3).join("、")}`
                              : item.project_leader
                                ? `项目负责人：${item.project_leader}`
                                : `来源：${sourceLabels[item.source_system ?? ""] || item.source_system || "待补充"}`}
                        </span>
                        <span className="max-w-[35%] truncate">
                          {getAchievementContext(item)}
                        </span>
                        <span className="ml-auto shrink-0">
                          {getAchievementPrimaryDate(item)}
                        </span>
                      </div>
                    </IntelligenceListItem>
                  );
                })
              )}
            </div>
            <FeedPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={feed.total}
              totalPages={feed.totalPages}
              isLoading={feed.isLoading}
              onPageChange={handlePageChange}
              className="w-full"
            />
          </div>
      </IntelligenceWorkspace>
    </>
  );
}
