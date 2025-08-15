// hooks/useParallax.js
import { useEffect, useState } from "react";

/**
 * Returns a translateY style that moves slower than the scroll.
 * speed: negative values move "up" slower (e.g., -0.15)
 */
export default function useParallax(speed = -0.15) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const onScroll = () => setY(window.scrollY * speed);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return { style: { transform: `translate3d(0, ${y}px, 0)` } };
}
