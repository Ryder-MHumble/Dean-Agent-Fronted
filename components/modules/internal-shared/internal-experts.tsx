"use client";

import { ExternalLink } from "lucide-react";
import SkillAccessNote from "@/components/shared/skill-access-note";
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
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f8fa] p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3a5c]">专家信息表</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            共 {snapshot.items.length} 人 · 数据更新时间：
            {snapshot.syncedAt || "尚未同步"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="http://10.1.132.21:5174/?tab=scholars"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
          >
            更多学者数据
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <SkillAccessNote
            label="专家推荐 Skill"
            href="https://skills.zgci.org/space/global/liangyuan-expert-recommender"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
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
            {snapshot.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-sm text-slate-500"
                >
                  专家脱敏数据将在同步后显示
                </TableCell>
              </TableRow>
            ) : (
              snapshot.items.map((expert) => (
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
    </div>
  );
}
