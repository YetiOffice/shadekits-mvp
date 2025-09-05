// hooks/useMiniHero.js
import { useEffect, useState } from "react";

/**
 * Shows a Mini-Hero after the user scrolls past a threshold.
 * Uses rAF throttling and only updates state when the boolean actually changes.
 */
export default function useMiniHero(threshold = 560) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY || 0;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const next = lastY > threshold;
          setShow((prev) => (prev !== next ? next : prev));
          ticking = false;
        });
      }
    };

    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return show;
}
