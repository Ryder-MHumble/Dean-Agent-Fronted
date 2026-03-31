"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAcademicStudentPapers } from "@/lib/api";
import type { AcademicPaperRecord } from "@/lib/types/internal-mgmt";
import { cn } from "@/lib/utils";

const statusClassName = (status: string | null) => {
  if (status === "compliant") return "border-green-200 bg-green-50 text-green-700";
  if (status === "non_compliant") return "border-red-200 bg-red-50 text-red-700";
  if (status === "review_needed") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
};

function toSafeInt(value: string | null, fallback = 0): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams<{ targetKey: string }>();
  const searchParams = useSearchParams();

  const targetKey = useMemo(
    () => decodeURIComponent(params?.targetKey ?? ""),
    [params?.targetKey],
  );
  const studentName = searchParams.get("name") || targetKey || "学生";
  const paperCount = toSafeInt(searchParams.get("paper_count"));
  const compliantCount = toSafeInt(searchParams.get("compliant_count"));
  const nonCompliantCount = toSafeInt(searchParams.get("non_compliant_count"));
  const unknownCount = toSafeInt(searchParams.get("unknown_count"));

  const [papers, setPapers] = useState<AcademicPaperRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadPapers = async () => {
    if (!targetKey) return;
    setLoading(true);
    setLoadFailed(false);
    const data = await fetchAcademicStudentPapers(targetKey);
    if (!data) {
      setLoadFailed(true);
      setLoading(false);
      return;
    }
    setPapers(data.items);
    setLoading(false);
  };

  useEffect(() => {
    void loadPapers();
  }, [targetKey]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            返回
          </Button>
          <Button type="button" variant="outline" onClick={() => void loadPapers()}>
            <RefreshCcw className="h-4 w-4 mr-1.5" />
            刷新论文
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {studentName}
            </CardTitle>
            <div className="text-xs text-muted-foreground">目标ID: {targetKey}</div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[11px]">
                论文 {paperCount}
              </Badge>
              <Badge variant="outline" className="text-[11px] border-green-200 bg-green-50 text-green-700">
                合规 {compliantCount}
              </Badge>
              <Badge variant="outline" className="text-[11px] border-red-200 bg-red-50 text-red-700">
                不合规 {nonCompliantCount}
              </Badge>
              <Badge variant="outline" className="text-[11px] border-slate-200 bg-slate-50 text-slate-700">
                未判定 {unknownCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">论文明细</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="py-6 text-sm text-muted-foreground">正在加载论文...</div>
            ) : loadFailed ? (
              <div className="py-6 text-sm text-red-600">加载失败，请检查学术监控 API 服务。</div>
            ) : papers.length === 0 ? (
              <div className="py-6 text-sm text-muted-foreground">暂无论文数据</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1.7fr_0.8fr_0.8fr_0.7fr] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b bg-muted/30">
                  <span>标题</span>
                  <span>来源</span>
                  <span>发表时间</span>
                  <span>合规</span>
                </div>
                {papers.map((paper) => (
                  <div
                    key={paper.paper_uid}
                    className="grid grid-cols-[1.7fr_0.8fr_0.8fr_0.7fr] gap-2 px-3 py-3 border-b last:border-0 items-center"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{paper.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{paper.paper_uid}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{paper.source || "-"}</span>
                    <span className="text-xs text-muted-foreground">
                      {paper.publication_date
                        ? new Date(paper.publication_date).toLocaleDateString()
                        : "-"}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] w-fit", statusClassName(paper.affiliation_status))}
                    >
                      {paper.affiliation_status || "unknown"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
