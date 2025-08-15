// hooks/useReveal.js
import { useEffect, useRef, useState } from "react";

/**
 * Simple IntersectionObserver hook that toggles `in` class once an element
 * is revealed. Respects prefers-reduced-motion.
 */
export default function useReveal({
  root = null,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.12,
  once = true,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(e.target);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, visible };
}
