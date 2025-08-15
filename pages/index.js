// pages/index.js
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import Section from '../components/Section';

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[480px] w-full overflow-hidden rounded-none">
        {/* Fallback color (shows if image fails) */}
        <div className="absolute inset-0 bg-neutral-900" />

        {/* Use an image we KNOW exists in /public */}
        {/* Swap to '/hero.jpg' later if you prefer */}
        <Image
          src="/patio-pro-10x10.jpg"
          alt="ShadeKits installation"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
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

      {/* OTHER SECTIONS */}
      <Section title="Popular Kits" className="py-10">
        <div className="text-neutral-600">Add product cards here…</div>
      </Section>
    </Layout>
  );
}
