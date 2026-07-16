"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ExternalLink,
  Loader2,
  UserRound,
  Calendar,
  ChevronRight,
  FileText,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import {
  IntelligenceDetailHeader,
  IntelligenceSection,
} from "@/components/shared/intelligence-detail";
import IntelligenceListItem from "@/components/shared/intelligence-list-item";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import IntelligenceToolbar from "@/components/shared/intelligence-toolbar";
import IntelligenceWorkspace from "@/components/shared/intelligence-workspace";
import { useAutoSelectDetail } from "@/hooks/use-auto-select-detail";
import { useDetailView } from "@/hooks/use-detail-view";
import { useLeaders } from "@/hooks/use-leaders";
import generatedAvatarMapping from "@/lib/generated/leader-avatars.json";
import {
  getLeaderSummary,
  resolveLeaderAvatar,
} from "@/lib/leader-display";
import type { LeaderDomain, LeaderStatus } from "@/lib/leader-query";
import type { LeaderAvatarRecord, LeaderProfile } from "@/lib/types/leaders";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function getLeaderKey(leader: LeaderProfile) {
  return leader.id;
}

type DomainFilter = "all" | LeaderDomain;

const domainLabels: Record<string, string> = {
  government: "政府",
  university: "高校",
  mixed: "混合",
};

const domainFilters: Array<{ value: DomainFilter; label: string }> = [
  { value: "government", label: "政府领导" },
  { value: "university", label: "高校领导" },
  { value: "mixed", label: "混合画像" },
  { value: "all", label: "全部领域" },
];

const statusFilters: Array<{ value: LeaderStatus; label: string }> = [
  { value: "current", label: "现任" },
  { value: "past", label: "离任" },
  { value: "all", label: "全部状态" },
];

const avatarMapping = generatedAvatarMapping as Record<
  string,
  LeaderAvatarRecord
>;

function getQualityNeedsReview(leader: LeaderProfile) {
  const details = leader.leader_details;
  if (!details || typeof details !== "object") return false;
  const quality = details.quality;
  if (!quality || typeof quality !== "object") return false;
  return (quality as { needs_review?: unknown }).needs_review === true;
}

/**
 * 从 experiences 数组计算真正现任的职位和机构。
 * 后端 current_positions/current_orgs 可能包含 end_date=null 但实际已离任的旧职位
 * （因为没有显式"免去"通知），所以前端自行从 experiences 筛选。
 *
 * 启发式规则：如果一个 experience 的 end_date 为 null，
 * 但它的 start_date 距今超过 3 年且存在比它更新的 experience（start_date 更晚），
 * 则认为该职位大概率已结束，不纳入"现任"展示。
 */
function computeCurrentFromExperiences(leader: LeaderProfile) {
  const exps = leader.experiences || [];
  const now = new Date();
  const threeYearsAgo = new Date(
    now.getFullYear() - 3,
    now.getMonth(),
    now.getDate(),
  );

  // 找到最新的 experience start_date
  const maxStart = exps
    .map((e) => e.start_date)
    .filter((v): v is string => !!v)
    .sort()
    .pop();

  const current = exps.filter((e) => {
    if (e.end_date) return false; // 有明确结束日期，不是现任
    if (!e.position && !e.organization) return false;

    // 启发式：如果 start_date 超过 3 年且存在更新的 experience，疑似已离任
    if (e.start_date && maxStart && e.start_date !== maxStart) {
      const startDate = new Date(e.start_date);
      if (startDate < threeYearsAgo) {
        return false; // 超过3年的旧职位且有更新任职，大概率已结束
      }
    }

    return true;
  });

  const positions = current
    .map((e) => e.position)
    .filter((v): v is string => !!v && v.trim().length > 0);
  const orgs = current
    .map((e) => e.organization)
    .filter((v): v is string => !!v && v.trim().length > 0);
  return {
    positions: positions.length > 0 ? positions.join("、") : "",
    orgs: orgs.length > 0 ? orgs.join("、") : "",
  };
}

function getDisplayPositions(leader: LeaderProfile): string {
  const computed = computeCurrentFromExperiences(leader);
  if (computed.positions) return computed.positions;
  return leader.current_positions || "未标注";
}

function getDisplayOrgs(leader: LeaderProfile): string {
  const computed = computeCurrentFromExperiences(leader);
  if (computed.orgs) return computed.orgs;
  return leader.current_orgs || "未标注";
}

function normalizeDate(value?: string | null) {
  return value?.slice(0, 10) || "未标注";
}

function LeaderDomainBadge({ domain }: { domain: string }) {
  const label = domainLabels[domain] ?? domain;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px]",
        domain === "government" && "border-blue-200 bg-blue-50 text-blue-700",
        domain === "university" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        domain === "mixed" && "border-violet-200 bg-violet-50 text-violet-700",
      )}
    >
      {label}
    </Badge>
  );
}

/** Avatar with img fallback to UserRound icon */
function LeaderAvatar({
  leader,
  size = 32,
}: {
  leader: LeaderProfile;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = resolveLeaderAvatar(leader, avatarMapping);

  if (avatarUrl && !imgError) {
    return (
      <span
        className="inline-block shrink-0 overflow-hidden rounded-full bg-muted"
        style={{ width: size, height: size }}
      >
        <img
          src={avatarUrl}
          alt={leader.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"
      style={{ width: size, height: size }}
    >
      <UserRound className="h-4 w-4" />
    </span>
  );
}

/** Leader detail content: timeline, events, bio, sources */
function LeaderDetailContent({ leader }: { leader: LeaderProfile }) {
  const detailText = getLeaderSummary(leader);
  const experiences = useMemo(
    () =>
      [...(leader.experiences || [])].sort((a, b) => {
        const aDate = (a.start_date || a.end_date || "").slice(0, 10);
        const bDate = (b.start_date || b.end_date || "").slice(0, 10);
        return bDate.localeCompare(aDate);
      }),
    [leader.experiences],
  );
  const events = useMemo(
    () =>
      [...(leader.appointment_events || [])].sort((a, b) => {
        const aDate = (a.event_date || "").slice(0, 10);
        const bDate = (b.event_date || "").slice(0, 10);
        return bDate.localeCompare(aDate);
      }),
    [leader.appointment_events],
  );
  const sourceRefs = leader.source_refs || [];

  return (
    <div className="space-y-6">
      {/* 履历时间线 */}
      {experiences.length > 0 && (
        <IntelligenceSection
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              履历时间线
            </span>
          }
        >
          <div className="relative space-y-3 border-l border-border/60 pl-4">
            {experiences.map((exp, i) => {
              const start = exp.start_date?.slice(0, 10) || "未知";
              const end = exp.end_date?.slice(0, 10);
              const isCurrent = !end;
              return (
                <div key={i} className="relative">
                  <div
                    className={cn(
                      "absolute -left-[1.30rem] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                      isCurrent ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {exp.position || "职务未标注"}
                    </span>
                    <span className="text-muted-foreground">
                      @ {exp.organization || "机构未标注"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {start}
                    {" → "}
                    {isCurrent ? (
                      <span className="font-medium text-emerald-600">至今</span>
                    ) : (
                      end
                    )}
                  </div>
                  {exp.bio && (
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {exp.bio}
                    </p>
                  )}
                  {exp.source_url && (
                    <a
                      href={exp.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                    >
                      <Link2 className="h-3 w-3" />
                      来源
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </IntelligenceSection>
      )}

      {/* 任免事件 */}
      {events.length > 0 && (
        <IntelligenceSection
          title={
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              任免事件
            </span>
          }
        >
          <div className="space-y-2">
            {events.map((event, i) => {
              const isAppoint = event.action !== "免去";
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-border/50 p-2.5"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[11px]",
                      isAppoint
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-red-200 bg-red-50 text-red-700",
                    )}
                  >
                    {event.action || "未知"}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="font-medium">
                        {event.position || "职务未标注"}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        @ {event.organization || "机构未标注"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {normalizeDate(event.event_date)}
                    </div>
                    {event.raw_sentence && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {event.raw_sentence}
                      </p>
                    )}
                  </div>
                  {event.source_url && (
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-blue-500"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </IntelligenceSection>
      )}

      {/* 简介 */}
      {detailText && (
        <IntelligenceSection title="简介">
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {detailText}
          </p>
        </IntelligenceSection>
      )}

      {/* 来源引用 */}
      {sourceRefs.length > 0 && (
        <IntelligenceSection title="来源引用">
          <div className="space-y-1.5">
            {sourceRefs.map((ref, i) => {
              const url =
                ref.source_url || ref.profile_url || ref.end_source_url;
              return (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Link2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline break-all"
                      >
                        {ref.source_title || url}
                      </a>
                    )}
                    {!url && ref.source_title && (
                      <span className="text-muted-foreground">
                        {ref.source_title}
                      </span>
                    )}
                    {ref.event_date && (
                      <span className="ml-1 text-muted-foreground">
                        ({normalizeDate(ref.event_date)})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </IntelligenceSection>
      )}
    </div>
  );
}

function LeaderDetailHeader({ leader }: { leader: LeaderProfile }) {
  return (
    <IntelligenceDetailHeader
      badges={<LeaderDomainBadge domain={leader.leader_domain} />}
      title={
        <span className="flex items-center gap-3">
          <LeaderAvatar leader={leader} size={44} />
          <span>{leader.name}</span>
        </span>
      }
      meta={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{getDisplayPositions(leader)}</span>
          <span>{getDisplayOrgs(leader)}</span>
        </span>
      }
    />
  );
}

export default function TalentRadarModule() {
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  const [organizationInput, setOrganizationInput] = useState("");
  const [organization, setOrganization] = useState("");
  const [domain, setDomain] = useState<DomainFilter>("government");
  const [statusFilter, setStatusFilter] = useState<LeaderStatus>("current");
  const [page, setPage] = useState(1);
  const { selectedItem, open, close, isOpen } = useDetailView<LeaderProfile>();
  const listRef = useRef<HTMLDivElement>(null);

  const activeDomain = domain === "all" ? undefined : domain;
  const { items, isLoading, total, totalPages, pageSize } = useLeaders({
    keyword,
    name,
    organization,
    domain: activeDomain,
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });

  useAutoSelectDetail({
    items,
    selectedItem,
    select: open,
    close,
    getKey: getLeaderKey,
    isLoading,
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, name, organization, domain, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const latestUpdatedAt = useMemo(() => {
    const dates = items
      .map((item) => item.updated_at || item.created_at)
      .filter(Boolean)
      .map((value) => new Date(value as string))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());
    return dates[0];
  }, [items]);

  const needsReviewCount = items.filter(getQualityNeedsReview).length;

  const applyFilters = useCallback((nextKeyword = keywordInput) => {
    setKeyword(nextKeyword.trim());
    setName(nameInput.trim());
    setOrganization(organizationInput.trim());
    setPage(1);
    close();
  }, [close, keywordInput, nameInput, organizationInput]);

  const clearFilters = () => {
    setKeywordInput("");
    setKeyword("");
    setNameInput("");
    setName("");
    setOrganizationInput("");
    setOrganization("");
    setDomain("government");
    setStatusFilter("current");
    setPage(1);
    close();
  };

  const handleDomainChange = (nextDomain: DomainFilter) => {
    setDomain(nextDomain);
    setPage(1);
    close();
  };

  const handleStatusChange = (nextStatus: LeaderStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
    close();
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    close();
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <IntelligencePageShell className="h-[var(--app-content-height,100dvh)] overflow-hidden">
      <IntelligenceWorkspace
        surface="integrated"
        listHeader={
          <IntelligenceToolbar
            variant="embedded"
            title="外部领导"
            total={total}
            updatedAt={latestUpdatedAt}
            supplemental={
          <div className="flex flex-wrap items-center gap-2">
            {domainFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleDomainChange(filter.value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  domain === filter.value
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                {filter.label}
              </button>
            ))}
            <div className="h-4 w-px bg-border" />
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleStatusChange(filter.value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  statusFilter === filter.value
                    ? "bg-slate-200 text-slate-800"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {filter.label}
              </button>
            ))}
            {needsReviewCount > 0 && (
              <span className="text-[11px] text-amber-700">
                当前页 {needsReviewCount} 条待核验
              </span>
            )}
            {(keyword || name || organization || domain !== "government" ||
              statusFilter !== "current") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] text-blue-600 hover:underline"
              >
                清除筛选
              </button>
            )}
            {isLoading && items.length > 0 && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
          </div>
            }
          >
        <SearchInput
          value={keywordInput}
          onChange={setKeywordInput}
          onSearch={applyFilters}
          placeholder="搜索职务、履历、来源..."
          className="min-w-[16rem] flex-1"
          inputClassName="h-9 rounded-lg border-border/50 bg-muted/30 text-sm transition-colors focus:bg-white"
          buttonClassName="h-9 rounded-lg"
        />
        <Input
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyFilters();
          }}
          placeholder="姓名"
          aria-label="姓名"
          className="h-9 w-full rounded-lg text-sm sm:w-36"
        />
        <Input
          value={organizationInput}
          onChange={(event) => setOrganizationInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyFilters();
          }}
          placeholder="所属机构"
          aria-label="所属机构"
          className="h-9 w-full rounded-lg text-sm sm:w-48"
        />
          </IntelligenceToolbar>
        }
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedItem
            ? {
                title: <LeaderDetailHeader leader={selectedItem} />,
                sourceUrl: selectedItem.latest_source_url ?? undefined,
              }
            : undefined
        }
        detailContent={
          selectedItem ? <LeaderDetailContent leader={selectedItem} /> : null
        }
      >
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
          <div
            ref={listRef}
            aria-busy={isLoading}
            className={cn(
              "min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1 transition-opacity",
              isLoading && items.length > 0 && "opacity-60",
            )}
          >
            {isLoading && items.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                数据加载中
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                暂无匹配的外部领导
              </div>
            ) : (
              items.map((leader) => {
                const summary = getLeaderSummary(leader);
                return (
                  <IntelligenceListItem
                    key={leader.id}
                    selected={selectedItem?.id === leader.id}
                    onClick={() => open(leader)}
                    className="group p-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <LeaderAvatar leader={leader} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-[#3156d8]">
                              {leader.name}
                            </h3>
                            <LeaderDomainBadge domain={leader.leader_domain} />
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
                        </div>
                        <p className="mb-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {summary || "简介待补充"}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="max-w-[35%] truncate font-medium text-foreground/80">
                            {getDisplayPositions(leader)}
                          </span>
                          <span className="max-w-[40%] truncate">
                            {getDisplayOrgs(leader)}
                          </span>
                          <span className="ml-auto shrink-0">
                            {normalizeDate(leader.latest_event_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </IntelligenceListItem>
                );
              })
            )}
          </div>
          <FeedPagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            className="w-full"
          />
        </div>
      </IntelligenceWorkspace>
    </IntelligencePageShell>
  );
}
