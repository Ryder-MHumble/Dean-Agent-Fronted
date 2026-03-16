import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
  offset: number;
}

export function usePagination({
  initialPage = 1,
  pageSize = 20,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPageState] = useState(initialPage);

  const setPage = useCallback((p: number) => {
    setPageState(Math.max(1, p));
  }, []);

  const nextPage = useCallback(() => {
    setPageState((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPageState((p) => Math.max(1, p - 1));
  }, []);

  const reset = useCallback(() => {
    setPageState(initialPage);
  }, [initialPage]);

  return {
    page,
    pageSize,
    setPage,
    nextPage,
    prevPage,
    reset,
    offset: (page - 1) * pageSize,
  };
}
