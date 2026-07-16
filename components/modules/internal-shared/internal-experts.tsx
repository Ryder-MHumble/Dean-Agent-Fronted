"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { ItemAvatar } from "@/components/shared/data-item-card";
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
import SkillAccessNote from "@/components/shared/skill-access-note";
import { Badge } from "@/components/ui/badge";
import { useAutoSelectDetail } from "@/hooks/use-auto-select-detail";
import { useDetailView } from "@/hooks/use-detail-view";
import expertSnapshot from "@/lib/generated/two-academies-experts.json";

interface ExpertRecord {
  name: string;
  organization: string;
  department: string;
  title: string;
  role: string;
  region: string;
  researchAreas: string;
  discipline?: string;
  updatedAt: string;
}

interface ExpertSnapshot {
  syncedAt: string;
  items: ExpertRecord[];
}

const snapshot = expertSnapshot as ExpertSnapshot;
const PAGE_SIZE = 20;
const parsedSnapshotUpdatedAt = new Date(snapshot.syncedAt);
const snapshotUpdatedAt = Number.isNaN(parsedSnapshotUpdatedAt.getTime())
  ? undefined
  : parsedSnapshotUpdatedAt;

function formatDate(value: string): string {
  if (!value) return "时间待补充";
  return value.slice(0, 10);
}

function getExpertKey(expert: ExpertRecord) {
  return [
    expert.name,
    expert.organization,
    expert.department,
    expert.title,
    expert.role,
  ].join("\u0000");
}

function ExpertDetail({ expert }: { expert: ExpertRecord }) {
  const basicFields = [
    ["工作单位", expert.organization],
    ["二级单位", expert.department],
    ["职称", expert.title],
    ["职务或人才称号", expert.role],
    ["地区", expert.region],
  ].filter((field) => field[1]);

  return (
    <div className="space-y-5">
      <IntelligenceSection title="专家信息">
        <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {basicFields.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 break-words text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="研究方向">
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {expert.researchAreas || "研究方向待补充"}
        </p>
      </IntelligenceSection>

      {expert.discipline && (
        <IntelligenceSection title="学科方向">
          <p className="text-sm leading-6 text-muted-foreground">
            {expert.discipline}
          </p>
        </IntelligenceSection>
      )}

      {expert.updatedAt && (
        <IntelligenceSection title="数据更新">
          <p className="text-sm text-muted-foreground">
            更新时间：{formatDate(expert.updatedAt)}
          </p>
        </IntelligenceSection>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <a
          href="http://10.1.132.21:5174/?tab=scholars"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
        >
          更多学者数据
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <SkillAccessNote
          label="配置专家推荐技能"
          href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
        />
      </div>
    </div>
  );
}

function ExpertDetailHeader({ expert }: { expert: ExpertRecord }) {
  return (
    <IntelligenceDetailHeader
      badges={
        expert.title ? (
          <Badge variant="outline" className="text-[10px]">
            {expert.title}
          </Badge>
        ) : undefined
      }
      title={expert.name}
      meta={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{expert.organization || "单位待补充"}</span>
          {expert.region && <span>{expert.region}</span>}
        </span>
      }
    />
  );
}

export default function InternalExpertsModule() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { selectedItem, open, close, isOpen } = useDetailView<ExpertRecord>();
  const listRef = useRef<HTMLDivElement>(null);

  const filteredExperts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    if (!keyword) return snapshot.items;
    return snapshot.items.filter((expert) =>
      [
        expert.name,
        expert.organization,
        expert.department,
        expert.title,
        expert.role,
        expert.region,
        expert.researchAreas,
        expert.discipline,
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("zh-CN").includes(keyword)),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredExperts.length / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);
  const visibleExperts = filteredExperts.slice(
    (effectivePage - 1) * PAGE_SIZE,
    effectivePage * PAGE_SIZE,
  );

  useAutoSelectDetail({
    items: visibleExperts,
    selectedItem,
    select: open,
    close,
    getKey: getExpertKey,
  });

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
            title="两院专家库"
            total={filteredExperts.length}
            updatedAt={snapshotUpdatedAt}
            actions={
              <>
                <a
                  href="http://10.1.132.21:5174/?tab=scholars"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
                >
                  更多学者数据请访问 10.1.132.21:5174
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <SkillAccessNote
                  label="配置专家推荐技能"
                  href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
                />
              </>
            }
          >
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(value) => {
                setQuery(value);
                setPage(1);
                close();
              }}
              placeholder="搜索姓名、单位、研究方向"
              className="w-full"
              inputClassName="h-9 rounded-lg border-border/50 bg-muted/30 text-sm transition-colors focus:bg-white"
              buttonClassName="h-9 rounded-lg"
            />
          </IntelligenceToolbar>
        }
        listContentClassName="min-h-0 overflow-hidden"
        isOpen={isOpen}
        onClose={close}
        detailHeader={
          selectedItem
            ? {
                title: <ExpertDetailHeader expert={selectedItem} />,
              }
            : undefined
        }
        detailContent={
          selectedItem ? <ExpertDetail expert={selectedItem} /> : null
        }
      >
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 bg-[#f7f8fa] p-4">
          <div
            ref={listRef}
            className="min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1"
          >
            {visibleExperts.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                {snapshot.items.length === 0
                  ? "专家脱敏数据将在同步后显示"
                  : "暂无匹配的专家公开信息"}
              </div>
            ) : (
              visibleExperts.map((expert) => (
                <IntelligenceListItem
                  key={getExpertKey(expert)}
                  selected={
                    selectedItem !== null &&
                    getExpertKey(selectedItem) === getExpertKey(expert)
                  }
                  onClick={() => open(expert)}
                  className="group p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <ItemAvatar text={expert.name.slice(0, 1) || "专"} />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-[#3156d8]">
                          {expert.name}
                        </h3>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition-colors group-hover:text-[#3156d8]" />
                      </div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {[expert.organization, expert.department, expert.title]
                          .filter(Boolean)
                          .join(" · ") || "单位信息待补充"}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {expert.researchAreas ||
                          expert.discipline ||
                          "研究方向待补充"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                        {expert.region && (
                          <Badge variant="outline" className="text-[10px]">
                            {expert.region}
                          </Badge>
                        )}
                        {expert.role && (
                          <span className="max-w-[55%] truncate">
                            {expert.role}
                          </span>
                        )}
                        {expert.updatedAt && (
                          <span className="ml-auto shrink-0">
                            {formatDate(expert.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </IntelligenceListItem>
              ))
            )}
          </div>
          <FeedPagination
            page={effectivePage}
            pageSize={PAGE_SIZE}
            total={filteredExperts.length}
            totalPages={totalPages}
            isLoading={false}
            onPageChange={handlePageChange}
            className="w-full"
          />
        </div>
      </IntelligenceWorkspace>
    </IntelligencePageShell>
  );
}
