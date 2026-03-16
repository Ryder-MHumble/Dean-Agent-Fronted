import { useState, useCallback } from "react";

interface UseFilterOptions<T extends string> {
  initialFilter?: T | "";
  initialSort?: string;
}

interface UseFilterReturn<T extends string> {
  filter: T | "";
  sort: string;
  setFilter: (f: T | "") => void;
  setSort: (s: string) => void;
  reset: () => void;
}

export function useFilter<T extends string>({
  initialFilter = "",
  initialSort = "",
}: UseFilterOptions<T> = {}): UseFilterReturn<T> {
  const [filter, setFilterState] = useState<T | "">(initialFilter);
  const [sort, setSortState] = useState(initialSort);

  const setFilter = useCallback((f: T | "") => {
    setFilterState(f);
  }, []);

  const setSort = useCallback((s: string) => {
    setSortState(s);
  }, []);

  const reset = useCallback(() => {
    setFilterState(initialFilter);
    setSortState(initialSort);
  }, [initialFilter, initialSort]);

  return { filter, sort, setFilter, setSort, reset };
}
