// components/MiniHero.js
import Link from "next/link";
import Image from "next/image";
import useMiniHero from "../hooks/useMiniHero";

/**
 * A compact sticky "mini-hero" bar that appears after scrolling past the main hero.
 * Keeps the primary CTA always in view.
 */
export default function MiniHero({
  title = "Commercial-Grade Shade Kits",
  subtitle = "Design in minutes. Ships in weeks.",
  ctaHref = "/builder",
  ctaLabel = "Start Building",
  image = "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=1200&q=70"
}) {
  const show = useMiniHero(560); // show after hero height

  return (
    <div
      aria-hidden={!show}
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-4 z-40",
        "w-[min(100vw-1rem, 1100px)]"
      ].join(" ")}
    >
      <div
        className={[
          "transition-all duration-200",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        ].join(" ")}
      >
        <div className="rounded-3xl border border-neutral-200 bg-white/85 backdrop-blur shadow-md overflow-hidden">
          <div className="grid grid-cols-[72px_1fr_auto] gap-3 items-center">
            {/* Thumbnail */}
            <div className="relative w-[72px] h-[72px]">
              <Image
                src={image}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
              />
            </div>

            {/* Copy */}
            <div className="py-3 pr-2">
              <div className="text-sm font-semibold leading-tight">{title}</div>
              <div className="text-xs text-neutral-600 leading-tight">{subtitle}</div>
            </div>

            {/* CTA */}
            <div className="px-3">
              <Link href={ctaHref} className="btn-primary px-4 py-2">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
