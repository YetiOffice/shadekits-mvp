import Link from 'next/link';
import Layout from '../components/Layout';
import Section from '../components/Section';
import { CATALOG } from '../data/products';

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="container-7xl pt-10">
        <div className="relative card overflow-hidden">
          {/* Placeholder image area */}
          <div className="aspect-[21/9] bg-neutral-300" />
          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="badge">Ships in 3–4 weeks</span>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight">
              Commercial-Grade Shade Structures
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-700">
              Pre-engineered steel kits with DIY-friendly bolt-together assembly. Ships nationwide.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/shop" className="btn-primary">Shop Kits</Link>
              <Link href="/resources" className="btn-secondary">How It Works</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <Section title="Best Sellers" className="pb-6 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATALOG.slice(0,3).map(p => (
            <div key={p.id} className="card overflow-hidden group">
              <div className="aspect-[16/9] bg-neutral-200" />
              <div className="p-5">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-neutral-600 mt-1">Starting at ${p.basePrice.toLocaleString()}</div>
                <Link href={`/product/${p.id}`} className="mt-3 inline-block btn-secondary group-hover:border-neutral-400">
                  View Kit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* VALUE PROPS */}
      <Section title="Why Choose Us" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Commercial-grade steel","Engineered for weather loads"],
            ["Bolt-together design","DIY or contractor-friendly"],
            ["Ships nationwide","Freight-ready packaging"],
            ["Real support","Install guides & videos"],
          ].map((pair, i) => (
            <div key={i} className="card p-5">
              <div className="font-semibold">{pair[0]}</div>
              <div className="text-sm text-neutral-600">{pair[1]}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA BAR */}
      <Section className="py-10">
        <div className="card p-6 bg-neutral-50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold">Your shade solution is one click away.</div>
            <div className="text-neutral-700">Get a fast quote today — ships in 3–4 weeks.</div>
          </div>
          <Link href="/contact" className="btn-primary">Get a Free Quote</Link>
        </div>
      </Section>
    </Layout>
  );
}
