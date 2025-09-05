import Link from 'next/link'
import Layout from '@/components/Layout'
import Section from '@/components/Section'
import { CATALOG } from '@/data/products'

export default function Home() {
  return (
    <Layout>
      <Section className="py-10">
        <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
          <div className="relative">
            <div className="w-full h-[45vh] bg-neutral-300 flex items-center justify-center">
              <div className="text-3xl md:text-5xl font-extrabold">Commercial-Grade Shade Structures</div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="mt-3 max-w-2xl">Pre‑engineered steel kits with DIY‑friendly bolt‑together assembly. Ships nationwide in 3–4 weeks.</p>
              <div className="mt-6 flex gap-3">
                <Link href="/shop" className="rounded-2xl px-4 py-2 bg-black text-white text-sm">Shop Kits</Link>
                <Link href="/resources" className="rounded-2xl px-4 py-2 border border-neutral-300 text-sm bg-white">How It Works</Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Best Sellers" className="pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATALOG.slice(0,3).map(p => (
            <div key={p.id} className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm">
              <div className="aspect-[16/9] bg-neutral-200 flex items-center justify-center text-sm">{p.name}</div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-neutral-600">Starting at ${p.basePrice.toLocaleString()}</div>
                <Link href={`/product/${p.id}`} className="mt-3 inline-block rounded-2xl px-3 py-2 border border-neutral-300 text-sm">View Kit</Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Choose Us" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            ["Commercial‑grade steel","Engineered for weather loads"],
            ["Bolt‑together design","DIY or contractor‑friendly"],
            ["Ships nationwide","Freight‑ready packaging"],
            ["Real support","Install guides & videos"],
          ].map((pair, i) => (
            <div key={i} className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <div className="font-semibold">{pair[0]}</div>
              <div className="text-sm text-neutral-600">{pair[1]}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold">Your shade solution is one click away.</div>
            <div className="text-neutral-700">Get a fast quote today — ships in 3–4 weeks.</div>
          </div>
          <Link href="/contact" className="rounded-2xl px-4 py-2 bg-black text-white text-sm">Get a Free Quote</Link>
        </div>
      </Section>
    </Layout>
  )
}
