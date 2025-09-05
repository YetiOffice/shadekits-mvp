// /pages/index.js
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Layout from "../components/Layout";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import StickyCTA from "../components/StickyCTA";
import useParallax from "../hooks/useParallax";
import MiniHero from "../components/MiniHero";
import { BLUR_1x1 } from "../lib/blur";

const IMG = {
  hero: "/hero.jpg",
  flagship: "/patio-pro-10x10.jpg",
  lifestyle: "/poolside-pavilion-12x12.jpg",
  product1: "/patio-pro-10x10.jpg",
  product2: "/poolside-pavilion-12x12.jpg",
  product3: "/cafe-cover-20x20.jpg",
};

export default function Home() {
  const heroImg = useParallax(-0.12);
  const heroText = useParallax(-0.06);

  return (
    <Layout>
      <Head>
        <meta name="robots" content="index,follow" />
        <link rel="preload" as="image" href={IMG.hero} imagesrcset={`${IMG.hero} 2400w`} imagesizes="100vw" />
      </Head>

      <StickyCTA threshold={520} />

      <MiniHero
        title="Design your kit in minutes"
        subtitle="Instant budget + lead time. Ships nationwide."
        ctaHref="/builder?kit=patio-pro-10x10"
        ctaLabel="Build & Price"
        image={IMG.flagship}
      />

      {/* HERO */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[90vh] min-h-[560px] overflow-hidden bg-black text-white">
        <Image
          src={IMG.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_1x1}
          className="object-cover"
          style={heroImg.style}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center"
          style={heroText.style}
        >
          <Reveal variant="fade">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Commercial-Grade Shade Kits
            </h1>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <p className="mt-4 text-lg md:text-xl text-neutral-200 max-w-3xl">
              Pre-engineered. Bolt-together. Built to last.
            </p>
          </Reveal>
          <Reveal variant="up" delay={220}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/builder?kit=patio-pro-10x10" className="btn-primary px-6 py-3 text-base md:text-lg">
                Build &amp; Price
              </Link>
              <Link href="/shop" className="btn-secondary px-6 py-3 text-base md:text-lg">
                See Kits
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FLAGSHIP */}
      <Section className="py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal className="order-2 lg:order-1" variant="up">
            <span className="badge">Best Seller</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">Patio Pro 10×10</h2>
            <p className="mt-3 text-neutral-700">
              Engineered for strength, designed for beauty, ships in 3–4 weeks. Bolt-together steel with illustrated instructions.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/builder?kit=patio-pro-10x10" className="btn-primary">Build &amp; Price</Link>
              <Link href="/shop" className="btn-secondary">See Kits</Link>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" variant="scale" delay={80}>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100">
              <Image
                src={IMG.flagship}
                alt="Patio Pro 10×10 — flagship kit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_1x1}
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* LIFESTYLE + VALUE PROPS ... unchanged for brevity */}

      {/* PRODUCTS */}
      <Section title="Best Sellers" className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Patio Pro 10×10", img: IMG.product1, href: "/builder?kit=patio-pro-10x10" },
            { name: "Poolside Pavilion 12×12", img: IMG.product2, href: "/builder?kit=poolside-pavilion-12x12" },
            { name: "Café Cover 20×20", img: IMG.product3, href: "/builder?kit=cafe-cover-20x20" },
          ].map((p, i) => (
            <a key={p.name} href={p.href} className="card overflow-hidden group">
              <div className="relative aspect-[16/9] bg-neutral-200">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_1x1}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="font-semibold">{p.name}</div>
                <span className="mt-2 inline-block text-red-600 hover:underline">Build &amp; Price →</span>
              </div>
            </a>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
