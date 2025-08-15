import Layout from "../components/Layout";
import HeroMedia from "../components/HeroMedia";

const BLUR_1x1 =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const IMG = {
  hero: "/hero.jpg",        // you already uploaded this
  product1: "/product1.jpg",
  product2: "/product2.jpg",
  product3: "/product3.jpg",
};

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="container-7xl pt-6">
        <div className="relative h-[70vh] md:h-[80vh] rounded-3xl overflow-hidden">
          {/* Media (image fallback forced) */}
          <HeroMedia
            imageSrc={IMG.hero}
            videoSrc={undefined} // ← image-only (keeps layout exactly as before)
            alt="ShadeKits — premium steel shade structures"
            priority
            blurDataURL={BLUR_1x1}
          />
          {/* Dark overlay (subtle so image is clear) */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Text content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Commercial-Grade Shade Kits
            </h1>
            <p className="mt-3 max-w-xl text-neutral-200">
              Pre-engineered. Bolt-together. Built to last.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/builder" className="btn-primary">Design Yours</a>
              <a href="/shop" className="btn-secondary">Shop Kits</a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular kits (placeholder content you can replace anytime) */}
      <section className="container-7xl py-12">
        <h2 className="section-title">Popular Kits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[IMG.product1, IMG.product2, IMG.product3].map((src, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[16/9] bg-neutral-200">
                <img
                  src={src}
                  alt={`Popular kit ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="font-semibold">Shade Kit {i + 1}</div>
                <div className="text-sm text-neutral-600">Starting at $X,XXX</div>
                <a href="/shop" className="mt-3 inline-block btn-secondary">View Kit</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
