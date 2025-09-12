// components/Section.js
/**
 * Flexible section wrapper with sensible defaults.
 * Props:
 * - id: string (optional) — anchor id
 * - title: string (optional) — section heading
 * - kicker: string (optional) — small eyebrow above title
 * - lead: string (optional) — short intro paragraph under title
 * - invert: boolean (optional) — white-on-black style
 * - bleed: boolean (optional) — removes vertical padding (for edge-to-edge sections)
 * - wide: boolean (optional) — wider than the default container
 * - className: string (optional) — extra classes on the <section>
 */
export default function Section({
  id,
  title,
  kicker,
  lead,
  invert = false,
  bleed = false,
  wide = false,
  className = "",
  children,
}) {
  const base = invert ? "text-white" : "text-neutral-900";
  const bg = invert ? "bg-black" : "bg-white";
  const wrap = wide
    ? "max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8"
    : "container-7xl px-4 md:px-6";
  const pad = bleed ? "py-0" : "py-16 md:py-24";

  return (
    <section id={id} className={`${bg} ${base} ${pad} ${className}`}>
      <div className={wrap}>
        {(kicker || title || lead) && (
          <header className="mb-8 md:mb-10">
            {kicker && <p className="eyebrow">{kicker}</p>}
            {title && (
              <h2 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                {title}
              </h2>
            )}
            {lead && (
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-neutral-600">
                {lead}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
