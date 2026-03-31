"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users } from "lucide-react";
import {
  fetchInstitutions,
  fetchInstitutionTaxonomy,
} from "@/lib/api";
import type {
  InstitutionListResponse,
  InstitutionListItem,
  InstitutionTaxonomyResponse,
  Region,
  OrgType,
  Classification,
} from "@/lib/types/institution";

export default function InstitutionsPage() {
  const [taxonomy, setTaxonomy] = useState<InstitutionTaxonomyResponse | null>(
    null,
  );
  const [institutions, setInstitutions] = useState<InstitutionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedOrgType, setSelectedOrgType] = useState<OrgType | null>(null);
  const [selectedClassification, setSelectedClassification] =
    useState<Classification | null>(null);

  const companyCount =
    taxonomy
      ? Object.values(taxonomy.regions).reduce(
          (sum, region) => sum + (region.org_types["企业"]?.count || 0),
          0,
        )
      : 0;

  const isCompanyPreset = selectedOrgType === "企业";

  const handleSelectAllPreset = () => {
    setSelectedRegion(null);
    setSelectedOrgType(null);
    setSelectedClassification(null);
  };

  const handleSelectCompanyPreset = () => {
    setSelectedRegion(null);
    setSelectedOrgType("企业");
    setSelectedClassification(null);
  };

  const getOrgTypeLabel = (
    orgType: string,
    node?: { display_name?: string | undefined },
  ) => {
    if (node?.display_name) return node.display_name;
    if (orgType === "企业") return "公司";
    return orgType;
  };

  // Load taxonomy on mount
  useEffect(() => {
    fetchInstitutionTaxonomy().then(setTaxonomy);
  }, []);

  // Load institutions when filters change
  useEffect(() => {
    setLoading(true);
    fetchInstitutions({
      view: "flat",
      entity_type: "organization", // Only show organizations on institution page
      region: selectedRegion || undefined,
      org_type: selectedOrgType || undefined,
      classification: selectedClassification || undefined,
      keyword: keyword || undefined,
      page_size: 100,
    }).then((data) => {
      if (data && "items" in data) {
        setInstitutions(data.items);
      }
      setLoading(false);
    });
  }, [selectedRegion, selectedOrgType, selectedClassification, keyword]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">机构知识库</h1>
        <p className="text-muted-foreground">
          浏览和搜索合作高校、企业、研究机构等组织信息
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

              {/* Preset Filter */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">机构分页</h3>
                <div className="space-y-1">
                  <button
                    onClick={handleSelectAllPreset}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      !isCompanyPreset
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    机构总览 ({taxonomy?.total || 0})
                  </button>
                  <button
                    onClick={handleSelectCompanyPreset}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      isCompanyPreset
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    公司 ({companyCount})
                  </button>
                </div>
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
                        {getOrgTypeLabel(orgType, data)} ({data.count})
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

        {/* Main Content - Institution Cards */}
        <div className="col-span-9">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((inst) => (
                <Card
                  key={inst.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/institutions/${inst.id}`)
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {inst.avatar ? (
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 truncate">
                          {inst.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {inst.priority && (
                            <Badge variant="secondary" className="text-xs">
                              {inst.priority}
                            </Badge>
                          )}
                          {inst.classification && (
                            <Badge variant="outline" className="text-xs">
                              {inst.classification}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{inst.scholar_count} 学者</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && institutions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">未找到匹配的机构</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
