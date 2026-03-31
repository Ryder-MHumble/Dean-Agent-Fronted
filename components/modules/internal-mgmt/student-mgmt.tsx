"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataFreshness from "@/components/shared/data-freshness";
import {
  GraduationCap,
  Search,
  RefreshCcw,
  Plus,
  Pencil,
  ShieldCheck,
  Trash2,
  ArrowUp,
  ArrowDown,
  Minus,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type {
  StudentAlert,
  AcademicPaperRecord,
  AcademicStudentSummary,
  AcademicPaperUpsertPayload,
  AcademicPaperCompliancePayload,
} from "@/lib/types/internal-mgmt";
import {
  fetchAcademicStudents,
  fetchAcademicStudentPapers,
  createAcademicPaper,
  updateAcademicPaper,
  updateAcademicPaperCompliance,
  deleteAcademicPaper,
} from "@/lib/api";
import {
  mockEnrollment,
  mockStudentAlerts,
} from "@/lib/mock-data/internal-mgmt";

const statusClassName = (status: string | null) => {
  if (status === "compliant") return "border-green-200 bg-green-50 text-green-700";
  if (status === "non_compliant") return "border-red-200 bg-red-50 text-red-700";
  if (status === "review_needed") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
};

type PaperFormState = {
  title: string;
  doi: string;
  arxiv_id: string;
  abstract: string;
  publication_date: string;
  source: string;
  authors_csv: string;
  affiliations_csv: string;
  affiliation_status: string;
  compliance_reason: string;
  matched_tokens_csv: string;
};

const EMPTY_PAPER_FORM: PaperFormState = {
  title: "",
  doi: "",
  arxiv_id: "",
  abstract: "",
  publication_date: "",
  source: "manual",
  authors_csv: "",
  affiliations_csv: "",
  affiliation_status: "unknown",
  compliance_reason: "",
  matched_tokens_csv: "",
};

type ComplianceFormState = {
  affiliation_status: string;
  compliance_reason: string;
  matched_tokens_csv: string;
};

const EMPTY_COMPLIANCE_FORM: ComplianceFormState = {
  affiliation_status: "unknown",
  compliance_reason: "",
  matched_tokens_csv: "",
};

function csvToList(value: string): string[] {
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function datetimeToInputValue(value: string | null): string {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 16);
}

export default function StudentMgmt() {
  const router = useRouter();
  const { UnderDevelopmentOverlay } = usePageUnderDevelopment({
    pageName: "学生管理",
  });

  const [keyword, setKeyword] = useState("");
  const [students, setStudents] = useState<AcademicStudentSummary[]>([]);
  const [studentsTotal, setStudentsTotal] = useState(0);
  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize] = useState(20);
  const [studentTotalPages, setStudentTotalPages] = useState(0);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const {
    selectedItem: selectedStudent,
    open: openStudent,
    close: closeStudent,
    isOpen,
  } = useDetailView<AcademicStudentSummary>();

  const [papers, setPapers] = useState<AcademicPaperRecord[]>([]);
  const [papersLoading, setPapersLoading] = useState(false);

  const [paperDialogOpen, setPaperDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<AcademicPaperRecord | null>(null);
  const [paperForm, setPaperForm] = useState<PaperFormState>(EMPTY_PAPER_FORM);
  const [paperSaving, setPaperSaving] = useState(false);

  const [complianceDialogOpen, setComplianceDialogOpen] = useState(false);
  const [compliancePaper, setCompliancePaper] = useState<AcademicPaperRecord | null>(null);
  const [complianceForm, setComplianceForm] = useState<ComplianceFormState>(EMPTY_COMPLIANCE_FORM);
  const [complianceSaving, setComplianceSaving] = useState(false);

  const unprocessedAlerts = useMemo(
    () => mockStudentAlerts.filter((a: StudentAlert) => a.level !== "提醒"),
    [],
  );

  const loadStudents = async (q: string, page: number) => {
    setStudentsLoading(true);
    const data = await fetchAcademicStudents(q, page, studentPageSize);
    setStudentsLoading(false);
    if (!data) {
      toast.error("加载学生列表失败，请检查学术监控 API 服务");
      return;
    }
    setStudents(data.items);
    setStudentsTotal(data.total);
    setStudentTotalPages(data.total_pages);
    setStudentPage(data.page);
  };

  const loadPapers = async (targetKey: string) => {
    setPapersLoading(true);
    const data = await fetchAcademicStudentPapers(targetKey);
    setPapersLoading(false);
    if (!data) {
      toast.error("加载学生论文失败");
      return;
    }
    setPapers(data.items);
  };

  useEffect(() => {
    setStudentPage(1);
    const timer = setTimeout(() => {
      void loadStudents(keyword, 1);
    }, 250);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    void loadStudents(keyword, studentPage);
  }, [studentPage]);

  useEffect(() => {
    if (!selectedStudent) return;
    void loadPapers(selectedStudent.target_key);
  }, [selectedStudent]);

  const openCreatePaper = () => {
    setEditingPaper(null);
    setPaperForm(EMPTY_PAPER_FORM);
    setPaperDialogOpen(true);
  };

  const openEditPaper = (paper: AcademicPaperRecord) => {
    setEditingPaper(paper);
    setPaperForm({
      title: paper.title ?? "",
      doi: paper.doi ?? "",
      arxiv_id: paper.arxiv_id ?? "",
      abstract: paper.abstract ?? "",
      publication_date: datetimeToInputValue(paper.publication_date),
      source: paper.source ?? "manual",
      authors_csv: (paper.authors ?? []).join(", "),
      affiliations_csv: (paper.affiliations ?? []).join(", "),
      affiliation_status: paper.affiliation_status ?? "unknown",
      compliance_reason: paper.compliance_reason ?? "",
      matched_tokens_csv: (paper.matched_tokens ?? []).join(", "),
    });
    setPaperDialogOpen(true);
  };

  const openComplianceEditor = (paper: AcademicPaperRecord) => {
    setCompliancePaper(paper);
    setComplianceForm({
      affiliation_status: paper.affiliation_status ?? "unknown",
      compliance_reason: paper.compliance_reason ?? "",
      matched_tokens_csv: (paper.matched_tokens ?? []).join(", "),
    });
    setComplianceDialogOpen(true);
  };

  const handleSavePaper = async () => {
    if (!selectedStudent) return;
    if (!paperForm.title.trim()) {
      toast.error("论文标题不能为空");
      return;
    }
    const payload: AcademicPaperUpsertPayload = {
      title: paperForm.title.trim(),
      doi: paperForm.doi.trim() || null,
      arxiv_id: paperForm.arxiv_id.trim() || null,
      abstract: paperForm.abstract.trim() || null,
      publication_date: paperForm.publication_date
        ? new Date(paperForm.publication_date).toISOString()
        : null,
      source: paperForm.source.trim() || "manual",
      authors: csvToList(paperForm.authors_csv),
      affiliations: csvToList(paperForm.affiliations_csv),
      affiliation_status: paperForm.affiliation_status || null,
      compliance_reason: paperForm.compliance_reason.trim() || null,
      matched_tokens: csvToList(paperForm.matched_tokens_csv),
      assessed_at: new Date().toISOString(),
    };

    setPaperSaving(true);
    const result = editingPaper
      ? await updateAcademicPaper(
          selectedStudent.target_key,
          editingPaper.paper_uid,
          payload,
        )
      : await createAcademicPaper(selectedStudent.target_key, payload);
    setPaperSaving(false);

    if (!result) {
      toast.error(editingPaper ? "更新论文失败" : "新增论文失败");
      return;
    }

    toast.success(editingPaper ? "论文更新成功" : "论文新增成功");
    setPaperDialogOpen(false);
    await loadPapers(selectedStudent.target_key);
    await loadStudents(keyword, studentPage);
  };

  const handleSaveCompliance = async () => {
    if (!selectedStudent || !compliancePaper) return;
    const payload: AcademicPaperCompliancePayload = {
      affiliation_status: complianceForm.affiliation_status || null,
      compliance_reason: complianceForm.compliance_reason.trim() || null,
      matched_tokens: csvToList(complianceForm.matched_tokens_csv),
      assessed_at: new Date().toISOString(),
    };
    setComplianceSaving(true);
    const result = await updateAcademicPaperCompliance(
      selectedStudent.target_key,
      compliancePaper.paper_uid,
      payload,
    );
    setComplianceSaving(false);
    if (!result) {
      toast.error("更新合规结果失败");
      return;
    }
    toast.success("合规结果更新成功");
    setComplianceDialogOpen(false);
    await loadPapers(selectedStudent.target_key);
    await loadStudents(keyword, studentPage);
  };

  const handleDeletePaper = async (paper: AcademicPaperRecord) => {
    if (!selectedStudent) return;
    if (!confirm(`确认删除论文「${paper.title}」吗？`)) return;
    const ok = await deleteAcademicPaper(selectedStudent.target_key, paper.paper_uid);
    if (!ok) {
      toast.error("删除论文失败");
      return;
    }
    toast.success("论文已删除");
    await loadPapers(selectedStudent.target_key);
    await loadStudents(keyword, studentPage);
  };

  const openStudentDetailPage = (student: AcademicStudentSummary) => {
    const sp = new URLSearchParams();
    sp.set("name", student.name);
    sp.set("paper_count", String(student.paper_count));
    sp.set("compliant_count", String(student.compliant_count));
    sp.set("non_compliant_count", String(student.non_compliant_count));
    sp.set("unknown_count", String(student.unknown_count));
    router.push(`/students/${encodeURIComponent(student.target_key)}?${sp.toString()}`);
  };

  return (
    <>
      <UnderDevelopmentOverlay />
      <div className="space-y-4">
        <MasterDetailView
          isOpen={isOpen}
          onClose={closeStudent}
          detailHeader={
            selectedStudent
              ? {
                  title: (
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {selectedStudent.name}
                    </h2>
                  ),
                  subtitle: (
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>目标ID: {selectedStudent.target_key}</span>
                      <span>·</span>
                      <span>论文 {selectedStudent.paper_count} 篇</span>
                    </div>
                  ),
                }
              : undefined
          }
          detailContent={
            selectedStudent && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[11px]">
                      共 {papers.length} 篇
                    </Badge>
                    <Badge variant="outline" className="text-[11px] border-green-200 bg-green-50 text-green-700">
                      合规 {selectedStudent.compliant_count}
                    </Badge>
                    <Badge variant="outline" className="text-[11px] border-red-200 bg-red-50 text-red-700">
                      不合规 {selectedStudent.non_compliant_count}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void loadPapers(selectedStudent.target_key)}
                    >
                      <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                      刷新
                    </Button>
                    <Button size="sm" onClick={openCreatePaper}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      新增论文
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground border-b bg-muted/30">
                    <span>标题</span>
                    <span>来源</span>
                    <span>发表时间</span>
                    <span>合规</span>
                    <span>操作</span>
                  </div>
                  {papersLoading ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">
                      正在加载论文...
                    </div>
                  ) : papers.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">
                      暂无论文数据，可点击右上角新增。
                    </div>
                  ) : (
                    papers.map((paper) => (
                      <div
                        key={paper.paper_uid}
                        className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-2 px-3 py-3 border-b last:border-0 items-center"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{paper.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {paper.paper_uid}
                          </p>
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
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => openEditPaper(paper)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => openComplianceEditor(paper)}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-red-600 hover:text-red-700 border-red-200"
                            onClick={() => void handleDeletePaper(paper)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          }
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">学生管理（学术监控）</CardTitle>
                  <DataFreshness updatedAt={new Date()} />
                  <Badge variant="secondary" className="text-[10px]">
                    当前第 {studentPage} / {Math.max(1, studentTotalPages)} 页，共 {studentsTotal} 人
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void loadStudents(keyword, studentPage)}
                >
                  <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                  刷新
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                <Input
                  className="pl-9"
                  placeholder="按学生姓名搜索"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {studentsLoading ? (
                <div className="py-6 text-sm text-muted-foreground">正在加载学生列表...</div>
              ) : students.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">暂无可用学生数据</div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {students.map((student) => (
                      <div
                        key={student.target_key}
                        role="button"
                        tabIndex={0}
                        onClick={() => openStudentDetailPage(student)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openStudentDetailPage(student);
                          }
                        }}
                        className={cn(
                          "text-left rounded-lg border p-3 transition-colors hover:bg-muted/30 cursor-pointer",
                          selectedStudent?.target_key === student.target_key &&
                            "border-blue-500 bg-blue-50/50",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{student.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {student.target_key}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[11px]">
                            论文 {student.paper_count}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-green-200 bg-green-50 text-green-700"
                          >
                            合规 {student.compliant_count}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-red-200 bg-red-50 text-red-700"
                          >
                            不合规 {student.non_compliant_count}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-slate-200 bg-slate-50 text-slate-700"
                          >
                            未判定 {student.unknown_count}
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              openStudent(student);
                            }}
                          >
                            当前页管理论文
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentPage <= 1}
                      onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                      上一页
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                      第 {studentPage} / {Math.max(1, studentTotalPages)} 页
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentTotalPages === 0 || studentPage >= studentTotalPages}
                      onClick={() =>
                        setStudentPage((p) => Math.min(Math.max(1, studentTotalPages), p + 1))
                      }
                    >
                      下一页
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MasterDetailView>

        {/* Enrollment data */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                招生与在读数据
              </CardTitle>
              <DataFreshness updatedAt={new Date(Date.now() - 86400000)} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {mockEnrollment.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg border p-3 hover:bg-muted/20 transition-colors"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.category}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {item.count}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {item.changeType === "up" && (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    )}
                    {item.changeType === "down" && (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    {item.changeType === "flat" && (
                      <Minus className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={cn("text-[11px]", {
                        "text-green-600": item.changeType === "up",
                        "text-red-600": item.changeType === "down",
                        "text-muted-foreground": item.changeType === "flat",
                      })}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student alerts */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">学生预警（保留 mock）</CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {unprocessedAlerts.length} 条重点预警
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {mockStudentAlerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{alert.name}</span>
                  <span className="text-xs text-muted-foreground">{alert.grade}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {alert.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {alert.level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{alert.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={paperDialogOpen} onOpenChange={setPaperDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPaper ? "编辑论文" : "新增论文"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>标题</Label>
              <Input
                value={paperForm.title}
                onChange={(e) => setPaperForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="论文标题"
              />
            </div>
            <div>
              <Label>DOI</Label>
              <Input
                value={paperForm.doi}
                onChange={(e) => setPaperForm((s) => ({ ...s, doi: e.target.value }))}
                placeholder="https://doi.org/..."
              />
            </div>
            <div>
              <Label>arXiv ID</Label>
              <Input
                value={paperForm.arxiv_id}
                onChange={(e) => setPaperForm((s) => ({ ...s, arxiv_id: e.target.value }))}
                placeholder="2501.12345"
              />
            </div>
            <div>
              <Label>来源</Label>
              <Input
                value={paperForm.source}
                onChange={(e) => setPaperForm((s) => ({ ...s, source: e.target.value }))}
                placeholder="openalex/manual/arxiv"
              />
            </div>
            <div>
              <Label>发表时间</Label>
              <Input
                type="datetime-local"
                value={paperForm.publication_date}
                onChange={(e) => setPaperForm((s) => ({ ...s, publication_date: e.target.value }))}
              />
            </div>
            <div>
              <Label>作者（逗号分隔）</Label>
              <Input
                value={paperForm.authors_csv}
                onChange={(e) => setPaperForm((s) => ({ ...s, authors_csv: e.target.value }))}
                placeholder="张三, 李四"
              />
            </div>
            <div>
              <Label>机构（逗号分隔）</Label>
              <Input
                value={paperForm.affiliations_csv}
                onChange={(e) => setPaperForm((s) => ({ ...s, affiliations_csv: e.target.value }))}
                placeholder="机构A, 机构B"
              />
            </div>
            <div>
              <Label>合规状态</Label>
              <select
                className="w-full h-9 rounded-md border px-3 text-sm bg-background"
                value={paperForm.affiliation_status}
                onChange={(e) =>
                  setPaperForm((s) => ({ ...s, affiliation_status: e.target.value }))
                }
              >
                <option value="unknown">unknown</option>
                <option value="compliant">compliant</option>
                <option value="non_compliant">non_compliant</option>
                <option value="review_needed">review_needed</option>
              </select>
            </div>
            <div>
              <Label>匹配词（逗号分隔）</Label>
              <Input
                value={paperForm.matched_tokens_csv}
                onChange={(e) =>
                  setPaperForm((s) => ({ ...s, matched_tokens_csv: e.target.value }))
                }
                placeholder="中国科学院, 中央民族大学"
              />
            </div>
            <div className="md:col-span-2">
              <Label>摘要</Label>
              <Textarea
                value={paperForm.abstract}
                onChange={(e) => setPaperForm((s) => ({ ...s, abstract: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label>合规说明</Label>
              <Textarea
                value={paperForm.compliance_reason}
                onChange={(e) =>
                  setPaperForm((s) => ({ ...s, compliance_reason: e.target.value }))
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaperDialogOpen(false)}
              disabled={paperSaving}
            >
              取消
            </Button>
            <Button onClick={() => void handleSavePaper()} disabled={paperSaving}>
              {paperSaving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={complianceDialogOpen} onOpenChange={setComplianceDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑合规结果</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>合规状态</Label>
              <select
                className="w-full h-9 rounded-md border px-3 text-sm bg-background"
                value={complianceForm.affiliation_status}
                onChange={(e) =>
                  setComplianceForm((s) => ({ ...s, affiliation_status: e.target.value }))
                }
              >
                <option value="unknown">unknown</option>
                <option value="compliant">compliant</option>
                <option value="non_compliant">non_compliant</option>
                <option value="review_needed">review_needed</option>
              </select>
            </div>
            <div>
              <Label>匹配词（逗号分隔）</Label>
              <Input
                value={complianceForm.matched_tokens_csv}
                onChange={(e) =>
                  setComplianceForm((s) => ({ ...s, matched_tokens_csv: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>合规说明</Label>
              <Textarea
                rows={3}
                value={complianceForm.compliance_reason}
                onChange={(e) =>
                  setComplianceForm((s) => ({ ...s, compliance_reason: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setComplianceDialogOpen(false)}
              disabled={complianceSaving}
            >
              取消
            </Button>
            <Button onClick={() => void handleSaveCompliance()} disabled={complianceSaving}>
              {complianceSaving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
