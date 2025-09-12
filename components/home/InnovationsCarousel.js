import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "../Section";

const ITEMS = [
  {
    title: "Span MAX",
    tagline: "Longer clear spans for wide patios.",
    img: "/flagship.jpg",
    href: "/resources",
  },
  {
    title: "Coastal Spec",
    tagline: "Hardware & finish package for harsh climates.",
    img: "/grand-pavilion-24x30.jpg",
    href: "/resources",
  },
  {
    title: "Lighting Kit",
    tagline: "Dimmable perimeter & task lighting options.",
    img: "/lifestyle.jpg",
    href: "/resources",
  },
  {
    title: "Accessory Rail",
    tagline: "Clean mounting channel for fans & heaters.",
    img: "/market-pavilion-20x24.jpg",
    href: "/resources",
  },
];

export default function InnovationsCarousel() {
  const scroller = useRef(null);
  const [index, setIndex] = useState(0);

  // update index on scroll (snap)
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <Section className="py-16" id="innovations">
      <div className="text-center">
        <div className="label">/ Always Innovating</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">New Options Available</h2>
      </div>

      <div className="relative mt-8">
        <div
          ref={scroller}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollSnapStop: "always" }}
        >
          {/* hide scrollbar (Firefox/WebKit) */}
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {ITEMS.map((it, i) => (
            <article
              key={it.title}
              className="snap-start shrink-0 w-full md:w-[calc(100%)] px-0"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${ITEMS.length}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100">
                  <Image src={it.img} alt={it.title} fill sizes="100vw" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{it.title}</h3>
                  <p className="mt-2 text-neutral-700">{it.tagline}</p>
                  <Link href={it.href} className="mt-6 inline-flex items-center gap-2 text-brand font-semibold">
                    Learn More <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* arrows */}
        <div className="hidden md:flex absolute inset-y-0 w-full pointer-events-none">
          <button
            onClick={() => scrollTo(Math.max(0, index - 1))}
            className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-white/90 px-3 py-2 shadow-subtle"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={() => scrollTo(Math.min(ITEMS.length - 1, index + 1))}
            className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-white/90 px-3 py-2 shadow-subtle"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        {/* dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-neutral-900" : "bg-neutral-300"}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
