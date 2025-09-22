// components/StickyCTA.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // show/hide after scroll
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  // toggle for the bottom-right FAB
  const SHOW_FAB = true;

  return (
    <>
      {/* Centered sticky promo bar */}
      <div
        aria-hidden={!show}
        className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
          "transition-all duration-200",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur px-3 py-2 shadow-md">
          {/* Thumbnail (restored) */}
          <div className="hidden sm:block w-16 h-12 rounded-xl overflow-hidden relative">
            {/* Use any image that exists in /public (e.g. /flagship.jpg) */}
            <Image
              src="/patio-pro-10x10.jpg"
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>

          {/* Copy */}
          <div className="min-w-[210px]">
            <div className="text-sm font-semibold leading-tight">Design your kit in minutes</div>
            <div className="text-[11px] text-neutral-600 leading-tight">
              Instant budget + lead time. Ships nationwide.
            </div>
          </div>

          {/* CTA */}
          <Link href="/builder" className="btn-primary px-4 py-2">
            Start Building
          </Link>
        </div>
      </div>

      {/* Bottom-right FAB (kept as-is; hidden on Home) */}
      {SHOW_FAB && !isHome && (
        <Link
          href="/builder"
          aria-hidden={!show}
          className={[
            "fixed bottom-6 right-6 z-40 hidden md:inline-flex btn-primary px-5 py-3 transition-all",
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
          ].join(" ")}
        >
          Start Building
        </Link>
      )}
    </>
  );
}
