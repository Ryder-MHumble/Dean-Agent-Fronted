"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePolicyFeed } from "@/hooks/use-policy-opportunities";
import { fetchPolicySourceNameMap } from "@/lib/api";
import {
  getPolicyPreviewSelectedId,
  sortPolicyPreviewItems,
  type PolicyPreviewSort,
} from "@/lib/policy-preview";
import type {
  PolicyFeedCategory,
  PolicyFeedItem,
} from "@/lib/types/policy-intel";
import PolicyPreviewList from "./policy-preview-list";
import PolicyPreviewDetail from "./policy-preview-detail";
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
  const requestKey = [
    page,
    searchQuery,
    category,
    selectedSourceId,
    dateFrom,
    dateTo,
  ].join("\u0000");
  const loadingRequestKeyRef = useRef<string | null>(null);
  const lastSortRef = useRef(sort);

  const sortedItems = useMemo(
    () => sortPolicyPreviewItems(items, sort),
    [items, sort],
  );
  const selectedItem = useMemo(
    () => sortedItems.find((item) => item.id === selectedId) ?? null,
    [selectedId, sortedItems],
  );

  useEffect(() => {
    const sortChanged = lastSortRef.current !== sort;
    lastSortRef.current = sort;

    if (isLoading) {
      loadingRequestKeyRef.current = requestKey;
      return;
    }

    const requestCompleted = loadingRequestKeyRef.current === requestKey;
    if (requestCompleted) loadingRequestKeyRef.current = null;
    const resetToFirst = requestCompleted || sortChanged;

    setSelectedId((current) =>
      getPolicyPreviewSelectedId(sortedItems, current, resetToFirst),
    );
    if (resetToFirst) setMobileDetailOpen(false);
  }, [isLoading, requestKey, sort, sortedItems]);

  useEffect(() => {
    let cancelled = false;
    fetchPolicySourceNameMap().then((sourceMap) => {
      if (cancelled) return;
      const sourceEntries = Object.entries(sourceMap);
      setSourceOptions(
        sourceEntries
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
    setMobileDetailOpen(true);
    if (window.matchMedia("(max-width: 959px)").matches) {
      requestAnimationFrame(() => detailRef.current?.focus());
    }
  }

  function closeMobileDetail() {
    setMobileDetailOpen(false);
    requestAnimationFrame(() => lastSelectedButtonRef.current?.focus());
  }

  function changeSearchQuery(value: string) {
    setPage(1);
    setSearchQuery(value);
  }

  function changeCategory(value: PolicyFeedCategory | "全部") {
    setPage(1);
    setCategory(value);
  }

  function changeSource(value: string) {
    setPage(1);
    setSelectedSourceId(value);
  }

  function changeDateFrom(value: string) {
    setPage(1);
    setDateFrom(value);
  }

  function changeDateTo(value: string) {
    setPage(1);
    setDateTo(value);
  }

  function clearFilters() {
    setPage(1);
    setSearchQuery("");
    setCategory("全部");
    setSelectedSourceId("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.workbench} aria-label="政策情报工作台">
          <div
            className={`${styles.listPane} ${mobileDetailOpen ? styles.listPaneHidden : ""}`}
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
              onCategoryChange={changeCategory}
              onSourceChange={changeSource}
              onDateFromChange={changeDateFrom}
              onDateToChange={changeDateTo}
              onClearFilters={clearFilters}
              onPageChange={setPage}
              onSearch={changeSearchQuery}
            />
          </div>

          <article
            ref={detailRef}
            className={`${styles.detailPane} ${mobileDetailOpen ? "" : styles.detailPaneHidden}`}
            aria-label="政策详情"
            tabIndex={-1}
          >
            <PolicyPreviewDetail item={selectedItem} onBack={closeMobileDetail} />
          </article>
        </section>
      </div>
    </main>
  );
}
