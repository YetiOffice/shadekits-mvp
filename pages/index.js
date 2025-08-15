// pages/index.js
import Layout from '../components/Layout';
import Section from '../components/Section';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/hero.jpg')`, // replace with real installed ShadeKit photo
            filter: 'brightness(0.6)',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bolt-Together Steel Shade Kits — Delivered to Your Door
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto mb-8">
            Design online. See it in 3D. Get instant pricing. Ship nationwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/builder"
              className="btn-primary text-lg px-8 py-3"
            >
              Start Building
            </Link>
            <Link
              href="/shop"
              className="btn-secondary text-lg px-8 py-3"
            >
              Browse Kits
            </Link>
          </div>
        </div>
      </section>

      {/* Other sections below */}
      <Section title="Popular Kits" className="py-10">
        {/* placeholder content */}
        <div className="text-neutral-600">Add product cards here…</div>
      </Section>
    </Layout>
  );
}
