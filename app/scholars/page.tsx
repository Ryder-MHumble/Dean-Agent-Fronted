"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users, ChevronRight, ChevronDown } from "lucide-react";
import {
  fetchInstitutions,
  fetchInstitutionTaxonomy,
} from "@/lib/api";
import type {
  InstitutionHierarchyResponse,
  InstitutionTaxonomyResponse,
  Region,
  OrgType,
  Classification,
  OrganizationWithDepartments,
} from "@/lib/types/institution";

export default function ScholarsPage() {
  const [taxonomy, setTaxonomy] = useState<InstitutionTaxonomyResponse | null>(
    null,
  );
  const [organizations, setOrganizations] = useState<OrganizationWithDepartments[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedOrgType, setSelectedOrgType] = useState<OrgType | null>(null);
  const [selectedClassification, setSelectedClassification] =
    useState<Classification | null>(null);

  // Load taxonomy on mount
  useEffect(() => {
    fetchInstitutionTaxonomy().then(setTaxonomy);
  }, []);

  // Load institutions when filters change
  useEffect(() => {
    setLoading(true);
    fetchInstitutions({
      view: "hierarchy",
      region: selectedRegion || undefined,
      org_type: selectedOrgType || undefined,
      classification: selectedClassification || undefined,
      keyword: keyword || undefined,
    }).then((data) => {
      if (data && "organizations" in data) {
        setOrganizations(data.organizations);
      }
      setLoading(false);
    });
  }, [selectedRegion, selectedOrgType, selectedClassification, keyword]);

  const toggleOrg = (orgId: string) => {
    setExpandedOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(orgId)) {
        next.delete(orgId);
      } else {
        next.add(orgId);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">学者知识库</h1>
        <p className="text-muted-foreground">
          按机构浏览学者信息，支持高校-院系两级展开
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Taxonomy Navigation */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">分类筛选</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索机构..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Region Filter */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">地域</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      !selectedRegion
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    全部 ({taxonomy?.total || 0})
                  </button>
                  {taxonomy &&
                    Object.entries(taxonomy.regions).map(([region, data]) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region as Region)}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          selectedRegion === region
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        {region} ({data.count})
                      </button>
                    ))}
                </div>
              </div>

              {/* Org Type Filter */}
              {selectedRegion && taxonomy?.regions[selectedRegion] && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">机构类型</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedOrgType(null)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        !selectedOrgType
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      全部 ({taxonomy.regions[selectedRegion].count})
                    </button>
                    {Object.entries(
                      taxonomy.regions[selectedRegion].org_types,
                    ).map(([orgType, data]) => (
                      <button
                        key={orgType}
                        onClick={() => setSelectedOrgType(orgType as OrgType)}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          selectedOrgType === orgType
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        {orgType} ({data.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Classification Filter */}
              {selectedRegion &&
                selectedOrgType &&
                taxonomy?.regions[selectedRegion]?.org_types[selectedOrgType] && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">分类</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedClassification(null)}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          !selectedClassification
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        全部 (
                        {
                          taxonomy.regions[selectedRegion].org_types[
                            selectedOrgType
                          ].count
                        }
                        )
                      </button>
                      {Object.entries(
                        taxonomy.regions[selectedRegion].org_types[
                          selectedOrgType
                        ].classifications,
                      ).map(([classification, data]) => (
                        <button
                          key={classification}
                          onClick={() =>
                            setSelectedClassification(
                              classification as Classification,
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            selectedClassification === classification
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          {classification} ({data.count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Hierarchical Organization List */}
        <div className="col-span-9">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {organizations.map((org) => (
                <Card key={org.id}>
                  <CardContent className="p-0">
                    {/* Organization Header */}
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => toggleOrg(org.id)}
                    >
                      <div className="flex-shrink-0">
                        {expandedOrgs.has(org.id) ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {org.avatar ? (
                        <img
                          src={org.avatar}
                          alt={org.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {org.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {org.priority && (
                            <Badge variant="secondary" className="text-xs">
                              {org.priority}
                            </Badge>
                          )}
                          {org.classification && (
                            <Badge variant="outline" className="text-xs">
                              {org.classification}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{org.scholar_count} 学者</span>
                        </div>
                        {org.departments && org.departments.length > 0 && (
                          <div className="text-xs">
                            {org.departments.length} 个院系
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Departments List (Expanded) */}
                    {expandedOrgs.has(org.id) && org.departments && org.departments.length > 0 && (
                      <div className="border-t bg-muted/30">
                        <div className="p-4 space-y-2">
                          {org.departments.map((dept) => (
                            <div
                              key={dept.id}
                              className="flex items-center gap-3 p-3 bg-background rounded hover:bg-accent/50 transition-colors cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/institutions/${dept.id}`)
                              }
                            >
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{dept.name}</p>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{dept.scholar_count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && organizations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">未找到匹配的机构</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
