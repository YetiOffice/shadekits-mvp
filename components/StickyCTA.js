// components/StickyCTA.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Behavior:
 * - Center promo bar: appears only after scrolling past `threshold`
 * - Bottom-right floating button (FAB): hidden on Home ("/"),
 *   shown on all other pages AFTER threshold as well.
 * - Pass `threshold` to adjust when they appear (default 500px)
 * - To disable the FAB everywhere, set SHOW_FAB to false.
 */
export default function StickyCTA({ threshold = 500 }) {
  const { pathname } = useRouter();
  const isHome = pathname === "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // guard for SSR
      const y = typeof window !== "undefined" ? window.scrollY : 0;
      setShow(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  // Toggle this if you ever want to remove the FAB everywhere
  const SHOW_FAB = true;

  return (
    <>
      {/* Center promo bar — gated by scroll */}
      <div
        aria-hidden={!show}
        className={[
          "fixed inset-x-0 bottom-4 z-40 flex justify-center pointer-events-none transition-all",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        ].join(" ")}
      >
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white shadow-subtle px-3 py-2">
          {/* Optional thumbnail (remove if you don't want it) */}
          <div className="hidden sm:block w-16 h-12 rounded-xl bg-neutral-100 overflow-hidden" />
          <div className="pr-1">
            <div className="text-sm font-semibold leading-tight">Design your kit in minutes</div>
            <div className="text-xs text-neutral-600 leading-tight">
              Instant budget + lead time. Ships nationwide.
            </div>
          </div>
          <Link href="/builder" className="btn-primary">
            Start Building
          </Link>
        </div>
      </div>

      {/* Bottom-right FAB — hidden on Home, gated by the same scroll */}
      {SHOW_FAB && !isHome && (
        <Link
          href="/builder"
          aria-hidden={!show}
          className={[
            "fixed bottom-6 right-6 z-40 hidden md:inline-flex btn-primary px-5 py-3 transition-all",
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          ].join(" ")}
        >
          Start Building
        </Link>
      )}
    </>
  );
}
