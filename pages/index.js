// pages/index.js
import Link from 'next/link';
import Layout from '../components/Layout';
import Section from '../components/Section';

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Fallback background so it still looks good if the image path is wrong */}
        <div className="absolute inset-0 bg-neutral-900" />

        {/* Actual hero image (ensure /public/hero.jpg exists exactly with this name) */}
        <img
          src="/hero.jpg"
          alt="ShadeKits installation"
          className="absolute inset-0 w-full h-full object-cover"
          // If you uploaded a very large image, uncomment the next line to prevent layout shifts.
          // loading="eager"
        />

        {/* Soft gradient for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Bolt-Together Steel Shade Kits — Delivered to Your Door
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto">
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

        {/* Give the hero real height */}
        <div className="invisible select-none" aria-hidden="true" style={{ paddingTop: '28rem' }} />
      </section>

      {/* OTHER SECTIONS */}
      <Section title="Popular Kits" className="py-10">
        <div className="text-neutral-600">Add product cards here…</div>
      </Section>
    </Layout>
  );
}
