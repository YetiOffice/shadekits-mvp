import Link from 'next/link';
import Layout from '../components/Layout';
import Section from '../components/Section';
import { CATALOG } from '../data/products';

export default function Shop() {
  return (
    <Layout>
      <Section title="All Shade Kits" className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATALOG.map(p => (
            <div key={p.id} className="card overflow-hidden">
              <div className="aspect-[16/9] bg-neutral-200 flex items-center justify-center text-sm">{p.name}</div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-neutral-600">Footprint: {p.footprint}</div>
                <div className="text-sm text-neutral-600">Starting at ${p.basePrice.toLocaleString()}</div>
                <Link href={`/product/${p.id}`} className="mt-3 inline-block btn-secondary">Configure</Link>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
