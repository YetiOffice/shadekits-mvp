// hooks/useScrollHeader.js
import { useEffect, useRef, useState } from "react";

/**
 * Smoothly toggles a boolean when window.scrollY passes a threshold.
 * - Throttled via requestAnimationFrame
 * - Only sets state when the value actually changes
 */
export default function useScrollHeader(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      last.current = window.scrollY || 0;
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const next = last.current > threshold;
          if (next !== scrolled) setScrolled(next);
          ticking.current = false;
        });
      }
    };

    // initialize once
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, scrolled]);

  return scrolled;
}
