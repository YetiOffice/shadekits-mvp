// /pages/index.js
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Layout from "../components/Layout";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import StickyCTA from "../components/StickyCTA";
import MiniHero from "../components/MiniHero";
import HeroMedia from "../components/HeroMedia";
import { BLUR_1x1 } from "../lib/blur";

const IMG = {
  hero: "/hero.jpg",
  flagship: "/patio-pro-10x10.jpg",
  product1: "/patio-pro-10x10.jpg",
  product2: "/poolside-pavilion-12x12.jpg",
  product3: "/cafe-cover-20x20.jpg",
};

export default function Home() {
  return (
    <Layout>
      <Head>
        <meta name="robots" content="index,follow" />
        {/* No custom <link rel="preload" ...> here to avoid React attribute warnings */}
        <title>ShadeKits — Commercial-Grade Shade Kits</title>
      </Head>

      <StickyCTA threshold={520} />

      {/* Optional small billboard intro */}
      <MiniHero
        title="Design your kit in minutes"
        subtitle="Instant budget + lead time. Ships nationwide."
        ctaHref="/builder?kit=patio-pro-10x10"
        ctaLabel="Build & Price"
        image={IMG.flagship}
      />

      {/* HERO (full-bleed) */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[90vh] min-h-[560px] overflow-hidden text-white">
        <HeroMedia imageSrc={IMG.hero} alt="" withOverlay />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="pointer-events-auto max-w-6xl mx-auto px-6 text-center">
            <Reveal variant="fade">
              <h1 className="text-balance font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                Commercial-Grade Shade Kits
              </h1>
            </Reveal>
            <Reveal variant="up" delay={120}>
              <p className="mt-4 text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto">
                Pre-engineered. Bolt-together. Built to last.
              </p>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/builder?kit=patio-pro-10x10"
                  className="btn-primary btn-lg"
                  aria-label="Build and Price Patio Pro 10×10"
                >
                  Build &amp; Price
                </Link>
                <Link
                  href="/shop"
                  className="btn-ghost btn-lg"
                  aria-label="See all kits"
                >
                  See Kits
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FLAGSHIP */}
      <Section kicker="Best seller" title="Patio Pro 10×10" lead="Engineered for strength, designed for beauty, ships in 3–4 weeks. Bolt-together steel with illustrated instructions.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal className="order-2 lg:order-1" variant="up">
            <div className="mt-2 flex gap-3">
              <Link
                href="/builder?kit=patio-pro-10x10"
                className="btn-primary"
                aria-label="Build and Price Patio Pro 10×10"
              >
                Build &amp; Price
              </Link>
              <Link href="/shop" className="btn-ghost" aria-label="See all kits">
                See Kits
              </Link>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" variant="scale" delay={80}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-card">
              <Image
                src={IMG.flagship}
                alt="Patio Pro 10×10 — flagship kit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_1x1}
                className="object-cover"
                priority={false}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* BEST SELLERS */}
      <Section title="Best Sellers">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Patio Pro 10×10", img: IMG.product1, href: "/builder?kit=patio-pro-10x10" },
            { name: "Poolside Pavilion 12×12", img: IMG.product2, href: "/builder?kit=poolside-pavilion-12x12" },
            { name: "Café Cover 20×20", img: IMG.product3, href: "/builder?kit=cafe-cover-20x20" },
          ].map((p) => (
            <li key={p.name}>
              <Link
                href={p.href}
                className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-card transition hover:-translate-y-0.5"
                aria-label={`Build and Price ${p.name}`}
              >
                <div className="relative aspect-[16/9] bg-neutral-200">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_1x1}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Instant budget → lead time. Ships nationwide.
                  </p>
                  <div className="mt-4">
                    <span className="btn-primary text-sm">Build &amp; Price</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </Layout>
  );
}
