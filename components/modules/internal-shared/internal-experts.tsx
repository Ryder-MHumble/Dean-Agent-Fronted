"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import DataItemCard, {
  ItemAvatar,
  ItemChevron,
  accentConfig,
} from "@/components/shared/data-item-card";
import FeedPagination from "@/components/shared/feed-pagination";
import { SearchInput } from "@/components/shared/forms/SearchInput";
import MasterDetailView from "@/components/shared/master-detail-view";
import SkillAccessNote from "@/components/shared/skill-access-note";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDetailView } from "@/hooks/use-detail-view";
import expertSnapshot from "@/lib/generated/two-academies-experts.json";
import { cn } from "@/lib/utils";

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

function formatDate(value: string): string {
  if (!value) return "时间待补充";
  return value.slice(0, 10);
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 border-b border-border/60 pb-4 last:border-b-0">
      <h3 className="text-sm font-semibold text-[#1a3a5c]">{title}</h3>
      {children}
    </section>
  );
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
    <div className="space-y-4">
      <DetailSection title="专家信息">
        <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {basicFields.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 break-words text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="研究方向">
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {expert.researchAreas || "研究方向待补充"}
        </p>
      </DetailSection>

      {expert.discipline && (
        <DetailSection title="学科方向">
          <p className="text-sm leading-6 text-muted-foreground">
            {expert.discipline}
          </p>
        </DetailSection>
      )}

      <DetailSection title="数据更新">
        <p className="text-sm text-muted-foreground">
          更新时间：{formatDate(expert.updatedAt)}
        </p>
      </DetailSection>

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
          label="配置专家推荐 skill"
          href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
        />
      </div>
    </div>
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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    close();
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <div className="flex h-[var(--app-content-height,100dvh)] min-h-0 flex-col gap-4 overflow-hidden bg-[#f7f8fa] px-5 pb-1 pt-5">
      <Card className="relative z-10 shrink-0 rounded-xl shadow-sm">
        <CardContent className="space-y-3 p-4">
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
            <span>共 {filteredExperts.length} 人</span>
            <span>数据更新时间：{formatDate(snapshot.syncedAt)}</span>
            <a
              href="http://10.1.132.21:5174/?tab=scholars"
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
            >
              更多学者数据请访问 10.1.132.21:5174
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <SkillAccessNote
              label="配置专家推荐 skill"
              href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
            />
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
                      {selectedItem.name}
                    </h2>
                  ),
                  subtitle: (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {selectedItem.title && (
                        <Badge variant="outline" className="text-[10px]">
                          {selectedItem.title}
                        </Badge>
                      )}
                      <span>{selectedItem.organization || "单位待补充"}</span>
                      {selectedItem.region && <span>{selectedItem.region}</span>}
                    </div>
                  ),
                }
              : undefined
          }
          detailContent={
            selectedItem ? <ExpertDetail expert={selectedItem} /> : null
          }
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 p-3">
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
                  <DataItemCard
                    key={`${expert.name}-${expert.organization}`}
                    isSelected={
                      selectedItem?.name === expert.name &&
                      selectedItem?.organization === expert.organization
                    }
                    onClick={() => open(expert)}
                    accentColor="blue"
                    className="p-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <ItemAvatar text={expert.name.slice(0, 1) || "专"} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <h3
                            className={cn(
                              "line-clamp-1 min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground transition-colors",
                              accentConfig.blue.title,
                            )}
                          >
                            {expert.name}
                          </h3>
                          <ItemChevron accentColor="blue" />
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {[expert.organization, expert.department, expert.title]
                            .filter(Boolean)
                            .join(" · ") || "单位信息待补充"}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {expert.researchAreas || expert.discipline || "研究方向待补充"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          {expert.region && (
                            <Badge variant="outline" className="text-[10px]">
                              {expert.region}
                            </Badge>
                          )}
                          {expert.role && (
                            <span className="max-w-[55%] truncate">{expert.role}</span>
                          )}
                          <span className="ml-auto shrink-0">
                            {formatDate(expert.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DataItemCard>
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
        </MasterDetailView>
      </Card>
    </div>
  );
}
