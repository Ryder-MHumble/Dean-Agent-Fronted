"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import FeedPagination from "@/components/shared/feed-pagination";
import SkillAccessNote from "@/components/shared/skill-access-note";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
const PAGE_SIZE = 50;

const columns = [
  "姓名",
  "工作单位",
  "二级单位",
  "职称",
  "职务或人才称号",
  "地区",
  "研究方向",
  "更新时间",
];

export default function InternalExpertsModule() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
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

  return (
    <div className="min-h-[calc(100vh-64px)] min-w-0 max-w-full bg-[#f7f8fa] p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3a5c]">专家信息表</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            共 {snapshot.items.length} 人 · 数据更新时间：
            {snapshot.syncedAt || "尚未同步"}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="relative min-w-56 flex-1 sm:flex-none">
            <span className="sr-only">搜索专家公开信息</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="搜索姓名、单位、研究方向"
              className="h-9 bg-white pl-9 sm:w-72"
            />
          </label>
          <a
            href="http://10.1.132.21:5174/?tab=scholars"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
          >
            更多学者数据请访问
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <SkillAccessNote
            label="配置专家推荐 skill"
            href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-slate-50">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className="h-10 whitespace-nowrap px-3 text-xs font-semibold text-[#1a3a5c]"
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleExperts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center text-sm text-slate-500"
                  >
                    {snapshot.items.length === 0
                      ? "专家脱敏数据将在同步后显示"
                      : "暂无匹配的专家公开信息"}
                  </TableCell>
                </TableRow>
              ) : (
                visibleExperts.map((expert) => (
                  <TableRow key={`${expert.name}-${expert.organization}`}>
                    <TableCell className="whitespace-nowrap px-3 font-medium">
                      {expert.name}
                    </TableCell>
                    <TableCell className="px-3">{expert.organization}</TableCell>
                    <TableCell className="px-3">{expert.department}</TableCell>
                    <TableCell className="whitespace-nowrap px-3">
                      {expert.title}
                    </TableCell>
                    <TableCell className="px-3">{expert.role}</TableCell>
                    <TableCell className="whitespace-nowrap px-3">
                      {expert.region}
                    </TableCell>
                    <TableCell className="min-w-48 px-3">
                      {[expert.researchAreas, expert.discipline]
                        .filter(Boolean)
                        .join("；")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 text-slate-500">
                      {expert.updatedAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <FeedPagination
          page={effectivePage}
          pageSize={PAGE_SIZE}
          total={filteredExperts.length}
          totalPages={totalPages}
          isLoading={false}
          onPageChange={setPage}
          className="border-t border-slate-200"
        />
      </div>
    </div>
  );
}
