// pages/index.js
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import Section from "../components/Section";
import { CATALOG } from "../data/products";

export default function Home() {
  return (
    <Layout>
      {/* =============== HERO =============== */}
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          h-[65vh] min-h-[520px] overflow-hidden
        "
      >
        <div className="absolute inset-0 bg-neutral-900" />
        <Image
          src="/hero.jpg"               // make sure /public/hero.jpg exists
          alt="ShadeKits installation"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
          <span className="badge">Ships in 3–4 weeks</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold leading-tight">
            Bolt-Together Steel Shade Kits — Delivered to Your Door
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-neutral-200 max-w-3xl">
            Design online. See it in 3D. Get instant pricing. Ship nationwide.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/builder" className="btn-primary text-lg px-8 py-3">
              Start Building
            </Link>
            <Link href="/shop" className="btn-secondary text-lg px-8 py-3">
              Browse Kits
            </Link>
          </div>
        </div>
      </section>

      {/* =============== TRUST STRIP =============== */}
      <Section className="py-6">
        <div className="rounded-3xl border border-neutral-200 bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-neutral-500 text-center">
            Trusted by restaurants, parks, schools, and property owners
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm text-neutral-700">
            {["City Parks Dept.", "Riverside Grill", "Sunset HOA", "Vista Pool"].map((n) => (
              <div key={n} className="rounded-xl border border-neutral-200 bg-neutral-50 py-2">
                {n}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* =============== BEST SELLERS =============== */}
      <Section title="Best Sellers" className="pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATALOG.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* =============== USE-CASE PRESETS =============== */}
      <Section title="Start with a Scenario" className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Restaurant Patio", href: "/builder#restaurant" },
            { label: "Community Park", href: "/builder#park" },
            { label: "Luxury Backyard", href: "/builder#backyard" },
          ].map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-neutral-200" />
              <div className="p-4 flex items-center justify-between">
                <div className="font-medium">{p.label}</div>
                <span className="text-sm text-neutral-600 group-hover:text-neutral-800">
                  Configure →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-3 text-sm text-neutral-600">
          These presets will open the Builder with suggested sizes and options. You can tweak everything.
        </div>
      </Section>

      {/* =============== VALUE PROPS =============== */}
      <Section title="Why Choose Us" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Commercial-grade steel", "Engineered for weather loads"],
            ["Bolt-together design", "DIY or contractor-friendly"],
            ["Ships nationwide", "Freight-ready packaging"],
            ["Real support", "Install guides & videos"],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="font-semibold">{t}</div>
              <div className="text-sm text-neutral-600">{d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* =============== CTA BAND =============== */}
      <Section className="py-10">
        <div className="card p-6 bg-neutral-50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold">Your shade solution is one click away.</div>
            <div className="text-neutral-700">Get a fast concept & price today — ships in 3–4 weeks.</div>
          </div>
          <Link href="/builder" className="btn-primary">
            Get My Estimate
          </Link>
        </div>
      </Section>
    </Layout>
  );
}

/* ---------- Local helper: product card ---------- */
function ProductCard({ product }) {
  // Fall back to hero if image path isn't a real image
  const imgSrc =
    (product.image && product.image.endsWith(".jpg") && product.image) ||
    "/hero.jpg";

  return (
    <div className="card overflow-hidden group">
      <div className="relative aspect-[16/9] bg-neutral-200">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="font-semibold">{product.name}</div>
        <div className="text-sm text-neutral-600 mt-1">
          Starting at ${product.basePrice.toLocaleString()}
        </div>
        <Link
          href={`/product/${product.id}`}
          className="mt-3 inline-block btn-secondary group-hover:border-neutral-400"
        >
          View Kit
        </Link>
      </div>
    </div>
  );
}
