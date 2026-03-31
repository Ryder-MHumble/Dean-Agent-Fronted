/**
 * Institution (机构) related types for ScholarDB System
 */

// ── Institution Classification ────────────────────────────────

export type EntityType = "organization" | "department";
export type Region = "国内" | "国际";
export type OrgType = "高校" | "企业" | "研究机构" | "行业学会" | "其他";
export type Classification = "共建高校" | "兄弟院校" | "海外高校" | "其他高校";
export type Priority = "P0" | "P1" | "P2" | "P3";

// ── Institution List Item ────────────────────────────────────

export interface InstitutionListItem {
  id: string;
  name: string;
  // New classification fields
  entity_type: EntityType | null;
  region: Region | null;
  org_type: OrgType | null;
  classification: Classification | null;
  sub_classification: string | null;
  // Old fields (backward compatibility)
  type: string | null;
  group: string | null;
  category: string | null;
  // Common fields
  priority: Priority | null;
  parent_id: string | null;
  scholar_count: number;
  student_count_total: number | null;
  mentor_count: number | null;
  avatar: string | null;
}

// ── Flat View Response ────────────────────────────────────────

export interface InstitutionListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: InstitutionListItem[];
}

// ── Hierarchy View Response ────────────────────────────────────

export interface DepartmentSummary {
  id: string;
  name: string;
  scholar_count: number;
}

export interface OrganizationWithDepartments extends InstitutionListItem {
  departments: DepartmentSummary[];
}

export interface InstitutionHierarchyResponse {
  organizations: OrganizationWithDepartments[];
}

// ── Taxonomy Response ────────────────────────────────────────

export interface SubClassificationCounts {
  [subClassification: string]: number;
}

export interface ClassificationNode {
  count: number;
  sub_classifications?: SubClassificationCounts;
}

export interface OrgTypeNode {
  count: number;
  display_name?: string;
  classifications: {
    [classification: string]: ClassificationNode;
  };
}

export interface RegionNode {
  count: number;
  org_types: {
    [orgType: string]: OrgTypeNode;
  };
}

export interface InstitutionTaxonomyResponse {
  total: number;
  org_type_aliases?: Record<string, string>;
  regions: {
    [region: string]: RegionNode;
  };
}

// ── Institution Detail ────────────────────────────────────────

export interface InstitutionDetail extends InstitutionListItem {
  // People
  resident_leaders: string[] | null;
  degree_committee: string[] | null;
  teaching_committee: string[] | null;
  university_leaders: string[] | null;
  notable_scholars: string[] | null;
  // Cooperation
  key_departments: string[] | null;
  joint_labs: string[] | null;
  training_cooperation: string[] | null;
  academic_cooperation: string[] | null;
  talent_dual_appointment: string[] | null;
  recruitment_events: string[] | null;
  visit_exchanges: string[] | null;
  cooperation_focus: string[] | null;
  // Departments (for organizations)
  departments: InstitutionListItem[] | null;
}

// ── API Query Parameters ────────────────────────────────────────

export interface InstitutionQueryParams {
  view?: "flat" | "hierarchy";
  entity_type?: EntityType;
  region?: Region;
  org_type?: OrgType;
  classification?: Classification;
  sub_classification?: string;
  keyword?: string;
  page?: number;
  page_size?: number;
}
