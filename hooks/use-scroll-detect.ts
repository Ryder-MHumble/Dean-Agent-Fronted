import { useState, useCallback, useRef, type RefObject } from "react";

interface UseScrollDetectReturn {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  ref: RefObject<HTMLElement | null>;
  checkScroll: () => void;
  scrollBy: (delta: number) => void;
}

export function useScrollDetect(scrollAmount = 200): UseScrollDetectReturn {
  const ref = useRef<HTMLElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollBy = useCallback(
    (delta: number) => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({ left: delta, behavior: "smooth" });
      setTimeout(checkScroll, 150);
    },
    [checkScroll],
  );

  return { canScrollLeft, canScrollRight, ref, checkScroll, scrollBy };
}
