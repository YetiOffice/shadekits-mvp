import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import Section from "../components/Section";

/**
 * Using external Unsplash placeholders so you can ship immediately.
 * When you have real photos, just replace the URLs below (or swap back to /public/*.jpg).
 * next.config.js already sets images.unoptimized = true, so external URLs are fine.
 */

// Hero / lifestyle / product placeholders (curated)
const IMG = {
  hero:
    "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=2400&q=80",
  flagship:
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=2000&q=80",
  lifestyle:
    "https://images.unsplash.com/photo-1505692794403-34d4982a86e8?auto=format&fit=crop&w=2400&q=80",
  product1:
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
  product2:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  product3:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
};

export default function Home() {
  return (
    <Layout>
      {/* ====================== HERO (Apple-style, full-bleed) ====================== */}
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          h-[90vh] min-h-[560px] overflow-hidden bg-black text-white
        "
      >
        {/* Background image */}
        <Image
          src={IMG.hero}
          alt="ShadeKits — premium steel shade structures"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Darken for contrast */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Copy + CTAs */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Commercial-Grade Shade Kits
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-200 max-w-3xl">
            Pre-engineered. Bolt-together. Built to last.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/builder" className="btn-primary px-6 py-3 text-base md:text-lg">
              Design Yours
            </Link>
            <Link href="/shop" className="btn-secondary px-6 py-3 text-base md:text-lg">
              See Kits
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== FLAGSHIP (clean, focused) ====================== */}
      <Section className="py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <span className="badge">Best Seller</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              Patio Pro 10×10
            </h2>
            <p className="mt-3 text-neutral-700">
              Engineered for strength, designed for beauty, ships in 3–4 weeks. Bolt-together steel
              with illustrated instructions.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/product/patio-pro-10x10" className="btn-primary">
                Configure Now
              </Link>
              <Link href="/builder" className="btn-secondary">
                Design Yours
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100">
              <Image
                src={IMG.flagship}
                alt="Patio Pro 10×10 — flagship kit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ====================== LIFESTYLE (full-bleed moment) ====================== */}
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          h-[60vh] min-h-[420px] overflow-hidden my-6
        "
      >
        <Image
          src={IMG.lifestyle}
          alt="Built for life outdoors"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-center">
          <div className="text-white">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Built for Life Outdoors
            </h3>
            <p className="mt-2 max-w-xl text-neutral-200">
              Weather-tested, engineered steel — decades of shade with low maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* ====================== VALUE PROPS (simple, Apple-clean) ====================== */}
      <Section title="Why ShadeKits" className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Commercial-grade steel", "Engineered for wind, snow, and sun."],
            ["Bolt-together design", "DIY-friendly or contractor-ready."],
            ["Ships nationwide", "Freight-ready, packaged with care."],
            ["Real human support", "Guides, videos, and expert help."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="font-semibold">{t}</div>
              <div className="text-sm text-neutral-600">{d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ====================== PRODUCT GRID (top kits) ====================== */}
      <Section title="Best Sellers" className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Patio Pro 10×10", img: IMG.product1, href: "/product/patio-pro-10x10" },
            { name: "Poolside Pavilion 12×12", img: IMG.product2, href: "/product/poolside-pavilion-12x12" },
            { name: "Café Cover 20×20", img: IMG.product3, href: "/product/cafe-cover-20x20" },
          ].map((p) => (
            <div key={p.name} className="card overflow-hidden group">
              <div className="relative aspect-[16/9] bg-neutral-200">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="font-semibold">{p.name}</div>
                <Link href={p.href} className="mt-2 inline-block text-red-600 hover:underline">
                  View Kit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ====================== FINAL CTA (high-contrast) ====================== */}
      <Section className="py-12">
        <div className="card p-6 bg-neutral-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">Your shade solution starts today.</div>
            <div className="text-neutral-700">Get a fast concept & price — ships in 3–4 weeks.</div>
          </div>
          <div className="flex gap-3">
            <Link href="/builder" className="btn-primary">
              Start Building
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Sales
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
