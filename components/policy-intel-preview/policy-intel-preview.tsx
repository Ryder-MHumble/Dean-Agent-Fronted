"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { usePolicyFeed } from "@/hooks/use-policy-opportunities";
import { fetchPolicySourceNameMap } from "@/lib/api";
import {
  sortPolicyPreviewItems,
  type PolicyPreviewSort,
} from "@/lib/policy-preview";
import type {
  PolicyFeedCategory,
  PolicyFeedItem,
} from "@/lib/types/policy-intel";
import PolicyPreviewHero from "./policy-preview-hero";
import PolicyPreviewList from "./policy-preview-list";
import styles from "./policy-intel-preview.module.css";

export default function PolicyIntelPreview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<PolicyFeedCategory | "全部">("全部");
  const [sort, setSort] = useState<PolicyPreviewSort>("latest");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sourceOptions, setSourceOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const detailRef = useRef<HTMLElement>(null);
  const lastSelectedButtonRef = useRef<HTMLButtonElement | null>(null);

  const { items, isLoading, total, totalPages } = usePolicyFeed({
    keyword: searchQuery || undefined,
    category: category === "全部" ? undefined : category,
    sourceIds: selectedSourceId ? [selectedSourceId] : undefined,
    dateRange: { from: dateFrom, to: dateTo },
    page,
    pageSize: 20,
  });
  const { total: policyTotal, generatedAt: policyGeneratedAt } = usePolicyFeed({
    page: 1,
    pageSize: 1,
  });
  const { total: opportunityTotal } = usePolicyFeed({
    category: "政策机会",
    page: 1,
    pageSize: 1,
  });

  const sortedItems = useMemo(
    () => sortPolicyPreviewItems(items, sort),
    [items, sort],
  );
  const selectedItem = useMemo(
    () => sortedItems.find((item) => item.id === selectedId) ?? null,
    [selectedId, sortedItems],
  );

  useEffect(() => {
    if (isLoading) return;
    setSelectedId((current) => {
      if (current && sortedItems.some((item) => item.id === current)) {
        return current;
      }
      return sortedItems[0]?.id ?? null;
    });
    setMobileDetailOpen(false);
  }, [isLoading, sortedItems]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, selectedSourceId, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;
    fetchPolicySourceNameMap().then((sourceMap) => {
      if (cancelled) return;
      setSourceOptions(
        Object.entries(sourceMap)
          .map(([id, label]) => ({ id, label }))
          .sort((a, b) => a.label.localeCompare(b.label, "zh-CN")),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function selectItem(item: PolicyFeedItem, trigger: HTMLButtonElement) {
    lastSelectedButtonRef.current = trigger;
    setSelectedId(item.id);
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileDetailOpen(true);
      requestAnimationFrame(() => detailRef.current?.focus());
    }
  }

  function closeMobileDetail() {
    setMobileDetailOpen(false);
    requestAnimationFrame(() => lastSelectedButtonRef.current?.focus());
  }

  function clearFilters() {
    setSearchQuery("");
    setCategory("全部");
    setSelectedSourceId("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <PolicyPreviewHero
          total={policyTotal}
          opportunityCount={opportunityTotal}
          sourceCount={sourceOptions.length}
          generatedAt={policyGeneratedAt}
        />

        <section
          className={`${styles.workbench} ${mobileDetailOpen ? styles.mobileDetailOpen : ""}`}
          aria-label="政策情报工作台"
        >
          <PolicyPreviewList
            items={sortedItems}
            selectedId={selectedId}
            sort={sort}
            category={category}
            sources={sourceOptions}
            selectedSourceId={selectedSourceId}
            dateFrom={dateFrom}
            dateTo={dateTo}
            page={page}
            total={total}
            totalPages={totalPages}
            isLoading={isLoading}
            onSelect={selectItem}
            onSortChange={setSort}
            onCategoryChange={setCategory}
            onSourceChange={setSelectedSourceId}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClearFilters={clearFilters}
            onPageChange={setPage}
            onSearch={setSearchQuery}
          />

          <article
            ref={detailRef}
            className={styles.detailPanel}
            aria-label="政策详情"
            tabIndex={-1}
          >
            <button
              type="button"
              className={styles.mobileBack}
              onClick={closeMobileDetail}
            >
              <ChevronLeft aria-hidden="true" />
              返回政策列表
            </button>
            <p className={styles.detailLabel}>政策详情</p>
            {selectedItem ? (
              <>
                <h2>{selectedItem.title}</h2>
                <p className={styles.detailSummary}>{selectedItem.summary}</p>
              </>
            ) : (
              <p className={styles.emptyDetail}>请选择一条政策查看详情</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
