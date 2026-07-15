import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRef } from "react";
import {
  getPolicyPreviewScore,
  type PolicyPreviewSort,
} from "@/lib/policy-preview";
import type {
  PolicyFeedCategory,
  PolicyFeedItem,
} from "@/lib/types/policy-intel";
import styles from "./policy-intel-preview.module.css";

interface PolicyPreviewListProps {
  items: PolicyFeedItem[];
  selectedId: string | null;
  sort: PolicyPreviewSort;
  category: PolicyFeedCategory | "全部";
  sources: { id: string; label: string }[];
  selectedSourceId: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  onSelect: (item: PolicyFeedItem, trigger: HTMLButtonElement) => void;
  onSortChange: (sort: PolicyPreviewSort) => void;
  onCategoryChange: (category: PolicyFeedCategory | "全部") => void;
  onSourceChange: (sourceId: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onSearch: (value: string) => void;
}

const SORTS: { label: string; value: PolicyPreviewSort }[] = [
  { label: "最新发布", value: "latest" },
  { label: "相关度", value: "relevance" },
  { label: "影响程度", value: "impact" },
];

const CATEGORIES: (PolicyFeedCategory | "全部")[] = [
  "全部",
  "国家政策",
  "北京政策",
  "领导讲话",
  "政策机会",
];

export default function PolicyPreviewList({
  items,
  selectedId,
  sort,
  category,
  sources,
  selectedSourceId,
  dateFrom,
  dateTo,
  page,
  total,
  totalPages,
  isLoading,
  onSelect,
  onSortChange,
  onCategoryChange,
  onSourceChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  onPageChange,
  onSearch,
}: PolicyPreviewListProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  function submitSearch() {
    onSearch(searchRef.current?.value.trim() ?? "");
  }

  function clearFilters() {
    if (searchRef.current) searchRef.current.value = "";
    onClearFilters();
  }

  return (
    <aside className={styles.listPanel} aria-label="政策列表">
      <div className={styles.listHeader}>
        <div className={styles.listHeading}>
          <h2>政策动态</h2>
          <span>共 {total.toLocaleString("zh-CN")} 条</span>
        </div>
        <div className={styles.sortTabs} aria-label="政策排序">
          {SORTS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={sort === option.value ? styles.activeSort : undefined}
              aria-pressed={sort === option.value}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" />
            <span className={styles.srOnly}>搜索政策</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="搜索标题或关键词"
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
            />
          </label>
          <select
            value={category}
            aria-label="政策分类"
            onChange={(event) =>
              onCategoryChange(event.target.value as PolicyFeedCategory | "全部")
            }
          >
            {CATEGORIES.map((option) => (
              <option value={option} key={option}>
                {option === "全部" ? "全部分类" : option}
              </option>
            ))}
          </select>
          <select
            value={selectedSourceId}
            aria-label="政策信源"
            onChange={(event) => onSourceChange(event.target.value)}
          >
            <option value="">全部信源</option>
            {sources.map((source) => (
              <option value={source.id} key={source.id}>
                {source.label}
              </option>
            ))}
          </select>
          <button type="button" className={styles.searchButton} onClick={submitSearch}>
            搜索
          </button>
        </div>
        <div className={styles.dateFilterRow}>
          <label>
            <span>起始日期</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(event) => onDateFromChange(event.target.value)}
            />
          </label>
          <label>
            <span>结束日期</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => onDateToChange(event.target.value)}
            />
          </label>
          <button type="button" className={styles.clearButton} onClick={clearFilters}>
            清除筛选
          </button>
        </div>
      </div>

      <div className={styles.itemScroller} aria-busy={isLoading}>
        {isLoading && items.length === 0 ? (
          <p className={styles.listStatus}>正在加载政策数据</p>
        ) : items.length === 0 ? (
          <p className={styles.listStatus}>暂无符合条件的政策</p>
        ) : (
          <ul className={styles.policyList}>
            {items.map((item, index) => {
              const score = getPolicyPreviewScore(item);
              const hasScore = item.matchScore != null || item.relevance != null;
              const source = item.sourceName ?? item.source_name ?? item.source;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.policyItem} ${selectedId === item.id ? styles.selectedItem : ""}`}
                    aria-current={selectedId === item.id ? "true" : undefined}
                    disabled={isLoading}
                    onClick={(event) => onSelect(item, event.currentTarget)}
                  >
                    <span className={styles.itemIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemMeta}>
                        <span>{source}</span>
                        <time dateTime={item.date}>{item.date}</time>
                      </span>
                      <strong>{item.title}</strong>
                      <span className={styles.itemFooter}>
                        <span className={styles.category}>{item.category}</span>
                        <span className={styles.importance}>{item.importance}</span>
                        {hasScore ? (
                          <span className={styles.relevance}>
                            <span
                              className={styles.relevanceTrack}
                              role="progressbar"
                              aria-label="政策相关度"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={score}
                            >
                              <i style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
                            </span>
                            <span className={styles.score}>{score}</span>
                          </span>
                        ) : (
                          <span className={styles.score}>--</span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <nav className={styles.pagination} aria-label="政策列表分页">
        <button
          type="button"
          aria-label="上一页"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <span>
          第 <strong>{page}</strong> / {totalPages} 页
        </span>
        <button
          type="button"
          aria-label="下一页"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </aside>
  );
}
