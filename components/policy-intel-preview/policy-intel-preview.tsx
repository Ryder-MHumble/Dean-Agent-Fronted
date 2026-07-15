"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { usePolicyFeed } from "@/hooks/use-policy-opportunities";
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

  const { items, isLoading, generatedAt, total, totalPages } = usePolicyFeed({
    keyword: searchQuery || undefined,
    category: category === "全部" ? undefined : category,
    page,
    pageSize: 20,
  });

  const sortedItems = useMemo(
    () => sortPolicyPreviewItems(items, sort),
    [items, sort],
  );
  const selectedItem = useMemo(
    () => sortedItems.find((item) => item.id === selectedId) ?? null,
    [selectedId, sortedItems],
  );
  const opportunityCount = items.filter(
    (item) => item.category === "政策机会",
  ).length;
  const sourceCount = new Set(
    items.map((item) => item.sourceName ?? item.source_name ?? item.source),
  ).size;

  useEffect(() => {
    setSelectedId(sortedItems[0]?.id ?? null);
    setMobileDetailOpen(false);
  }, [page, searchQuery, category, sort, sortedItems[0]?.id]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  function selectItem(item: PolicyFeedItem) {
    setSelectedId(item.id);
    setMobileDetailOpen(true);
  }

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <PolicyPreviewHero
          total={total}
          opportunityCount={opportunityCount}
          sourceCount={sourceCount}
          generatedAt={generatedAt}
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
            page={page}
            total={total}
            totalPages={totalPages}
            isLoading={isLoading}
            onSelect={selectItem}
            onSortChange={setSort}
            onCategoryChange={setCategory}
            onPageChange={setPage}
            onSearch={setSearchQuery}
          />

          <article className={styles.detailPanel} aria-label="政策详情">
            <button
              type="button"
              className={styles.mobileBack}
              onClick={() => setMobileDetailOpen(false)}
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
