"use client";

import ModuleLayout from "@/components/module-layout";
import type { SubPageConfig } from "@/components/module-layout";
import { Building2, ClipboardList, GraduationCap } from "lucide-react";
import CenterUpdates from "./center-updates";
import ProjectSupervision from "./project-supervision";
import StudentMgmt from "./student-mgmt";

const subPages: SubPageConfig[] = [
  {
    id: "center",
    label: "中心动态",
    icon: Building2,
    component: CenterUpdates,
  },
  {
    id: "project",
    label: "项目督办",
    icon: ClipboardList,
    component: ProjectSupervision,
  },
  {
    id: "student",
    label: "学生管理",
    icon: GraduationCap,
    component: StudentMgmt,
  },
];

export default function InternalMgmtModule() {
  return <ModuleLayout subPages={subPages} />;
}
