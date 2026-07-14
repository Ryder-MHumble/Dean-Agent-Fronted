"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  Filter,
  Loader2,
  Search,
  UserRound,
  Calendar,
  FileText,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FeedPagination from "@/components/shared/feed-pagination";
import DataFreshness from "@/components/shared/data-freshness";
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

type DomainFilter = "all" | LeaderDomain;

const domainLabels: Record<string, string> = {
  government: "政府",
  university: "高校",
  mixed: "混合",
};

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
      <div
        className="shrink-0 overflow-hidden rounded-full bg-muted"
        style={{ width: size, height: size }}
      >
        <img
          src={avatarUrl}
          alt={leader.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"
      style={{ width: size, height: size }}
    >
      <UserRound className="h-4 w-4" />
    </div>
  );
}

function LeaderMobileCard({
  leader,
  onClick,
}: {
  leader: LeaderProfile;
  onClick: () => void;
}) {
  const detailText = getLeaderSummary(leader);
  const latestSource = leader.latest_source_url;

  return (
    <Card
      className="shadow-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <LeaderAvatar leader={leader} size={40} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{leader.name}</span>
              <LeaderDomainBadge domain={leader.leader_domain} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {getDisplayPositions(leader)}
            </p>
          </div>
          {latestSource && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={latestSource} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {getDisplayOrgs(leader)}
            </span>
          </div>
          <div>最近更新：{normalizeDate(leader.latest_event_date)}</div>
        </div>
        {detailText && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {detailText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/** Detail sheet content: timeline, events, bio, sources */
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
    <div className="space-y-6 p-4">
      {/* 履历时间线 */}
      {experiences.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            履历时间线
          </h3>
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
        </section>
      )}

      {/* 任免事件 */}
      {events.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-muted-foreground" />
            任免事件
          </h3>
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
        </section>
      )}

      {/* 简介 */}
      {detailText && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">简介</h3>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {detailText}
          </p>
        </section>
      )}

      {/* 来源引用 */}
      {sourceRefs.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">来源引用</h3>
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
        </section>
      )}
    </div>
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
  const [selectedLeader, setSelectedLeader] = useState<LeaderProfile | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

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
    return dates[0] ?? new Date();
  }, [items]);

  const needsReviewCount = items.filter(getQualityNeedsReview).length;

  const applyFilters = () => {
    setKeyword(keywordInput.trim());
    setName(nameInput.trim());
    setOrganization(organizationInput.trim());
  };

  const clearFilters = () => {
    setKeywordInput("");
    setKeyword("");
    setNameInput("");
    setName("");
    setOrganizationInput("");
    setOrganization("");
    setDomain("government");
    setStatusFilter("current");
  };

  const openLeaderDetail = (leader: LeaderProfile) => {
    setSelectedLeader(leader);
    setSheetOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4 px-4 pb-20 pt-4 md:h-[calc(100vh-4rem)] md:overflow-hidden md:px-5 md:pb-2 md:pt-5">
      <div>
        <div className="grid gap-3 rounded-lg border border-border/70 bg-background p-4 shadow-sm">
          <div className="grid gap-2 lg:grid-cols-4 lg:items-end xl:grid-cols-[minmax(150px,1.1fr)_minmax(120px,0.8fr)_minmax(150px,1fr)_120px_110px_auto_auto_minmax(220px,auto)]">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                关键词
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") applyFilters();
                  }}
                  placeholder="职务、履历、来源"
                  className="pl-9"
                />
              </div>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                人名
              </span>
              <Input
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder="例如 张玉卓"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                所属机构
              </span>
              <Input
                value={organizationInput}
                onChange={(event) => setOrganizationInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder="例如 科学技术部"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                领域
              </span>
              <Select
                value={domain}
                onValueChange={(value) => setDomain(value as DomainFilter)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">政府领导</SelectItem>
                  <SelectItem value="university">高校领导</SelectItem>
                  <SelectItem value="mixed">混合画像</SelectItem>
                  <SelectItem value="all">全部</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                状态
              </span>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as LeaderStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">现任</SelectItem>
                  <SelectItem value="past">离任</SelectItem>
                  <SelectItem value="all">全部</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <Button type="button" onClick={applyFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              重置
            </Button>
            <div className="flex min-h-10 flex-wrap items-center gap-2 lg:justify-end">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Badge variant="secondary" className="text-xs">
                共 {total} 条
              </Badge>
              {needsReviewCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-xs text-amber-700"
                >
                  {needsReviewCount} 条待核验
                </Badge>
              )}
              <DataFreshness updatedAt={latestUpdatedAt} />
            </div>
          </div>
        </div>
      </div>

      <div className="md:min-h-0 md:flex-1 md:overflow-hidden">
        <div className="flex flex-col rounded-lg border border-border/70 bg-background shadow-sm md:h-full md:min-h-0 md:overflow-hidden">
          <div className="hidden min-h-0 flex-1 overflow-auto md:block">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow>
                  <TableHead className="w-[180px]">姓名</TableHead>
                  <TableHead>当前职务</TableHead>
                  <TableHead>所属机构</TableHead>
                  <TableHead className="max-w-[200px]">简介</TableHead>
                  <TableHead className="w-[120px]">领域</TableHead>
                  <TableHead className="w-[130px]">最近事件</TableHead>
                  <TableHead className="w-[90px] text-right">来源</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((leader) => {
                  return (
                    <TableRow
                      key={leader.id}
                      onClick={() => openLeaderDetail(leader)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LeaderAvatar leader={leader} />
                          <div className="min-w-0">
                            <div className="font-medium">{leader.name}</div>
                            {leader.gender && (
                              <div className="text-xs text-muted-foreground">
                                {leader.gender}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[260px]">
                        <div
                          className="truncate font-medium"
                          title={getDisplayPositions(leader)}
                        >
                          {getDisplayPositions(leader)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[280px]">
                        <div className="line-clamp-2">
                          {getDisplayOrgs(leader)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div
                          className="truncate text-sm text-muted-foreground"
                          title={getLeaderSummary(leader)}
                        >
                          {getLeaderSummary(leader) || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <LeaderDomainBadge domain={leader.leader_domain} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {normalizeDate(leader.latest_event_date)}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {leader.latest_source_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 px-2"
                          >
                            <a
                              href={leader.latest_source_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            无
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {!isLoading && items.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                暂无匹配的外部领导
              </div>
            )}
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {items.map((leader) => (
              <LeaderMobileCard
                key={leader.id}
                leader={leader}
                onClick={() => openLeaderDetail(leader)}
              />
            ))}
            {!isLoading && items.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                暂无匹配的外部领导
              </div>
            )}
          </div>

          <div className="border-t border-border/70 p-3">
            <FeedPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={setPage}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          {selectedLeader && (
            <>
              <SheetHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <LeaderAvatar leader={selectedLeader} size={48} />
                  <div className="min-w-0">
                    <SheetTitle className="text-lg">
                      {selectedLeader.name}
                    </SheetTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <LeaderDomainBadge
                        domain={selectedLeader.leader_domain}
                      />
                      <span className="text-sm text-muted-foreground">
                        {getDisplayPositions(selectedLeader)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {getDisplayOrgs(selectedLeader)}
                    </div>
                  </div>
                </div>
              </SheetHeader>
              <LeaderDetailContent leader={selectedLeader} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
