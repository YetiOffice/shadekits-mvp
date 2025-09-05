// /pages/shop.js
import Image from "next/image";
import Layout from "../components/Layout";
import Section from "../components/Section";
import { STANDARD_KITS } from "../data/standardKits";
import { BLUR_1x1 } from "../lib/blur";

const IMG = {
  patio: "/patio-pro-10x10.jpg",
  pool: "/poolside-pavilion-12x12.jpg",
  cafe: "/cafe-cover-20x20.jpg",
};

const TILE_IMAGE = {
  "patio-pro-10x10": IMG.patio,
  "poolside-pavilion-12x12": IMG.pool,
  "cafe-cover-20x20": IMG.cafe,
};

export default function Shop() {
  return (
    <Layout>
      <main className="container-7xl py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">All Shade Kits</h1>
        <p className="text-neutral-600 mt-2">Lead time 3–5 weeks • PE-stamped drawings • Nationwide freight</p>

        <Section className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {STANDARD_KITS.map((k) => (
              <a
                key={k.slug}
                href={`/builder?kit=${k.slug}`}
                className="card overflow-hidden group"
              >
                <div className="relative aspect-[16/9] bg-neutral-200">
                  <Image
                    src={TILE_IMAGE[k.slug] || IMG.patio}
                    alt={k.name}
                    fill
                    sizes="(max-width:1024px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_1x1}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div className="font-semibold flex items-center gap-2">
                    {k.name}
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">Buy-eligible</span>
                  </div>
                  <span className="mt-2 inline-block text-red-600 hover:underline">Build &amp; Price →</span>
                </div>
              </a>
            ))}
          </div>
        </Section>
      </main>
    </Layout>
  );
}
