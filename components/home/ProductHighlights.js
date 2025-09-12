import Image from "next/image";
import Link from "next/link";
import Section from "../Section";

function Block({ eyebrow, title, copy, img, hrefPrimary, hrefSecondary, flip }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div>
        <span className="badge">{eyebrow}</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-3 text-neutral-700">{copy}</p>
        <div className="mt-6 flex gap-3">
          <Link href={hrefPrimary.href} className="btn-primary">{hrefPrimary.label}</Link>
          {hrefSecondary && <Link href={hrefSecondary.href} className="btn-secondary">{hrefSecondary.label}</Link>}
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100">
        <Image src={img.src} alt={img.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </div>
  );
}

export default function ProductHighlights() {
  return (
    <Section className="py-16" id="products">
      <Block
        eyebrow="Best Seller"
        title="Patio Pro 10×10"
        copy="Bolt-together steel, engineered for snow & wind. Ships in weeks with illustrated instructions."
        img={{ src: "/patio-pro-10x10.jpg", alt: "Patio Pro 10×10" }}
        hrefPrimary={{ href: "/builder?kit=patio-pro-10x10", label: "Build & Price" }}
        hrefSecondary={{ href: "/shop", label: "See Kits" }}
      />
      <div className="mt-16" />
      <Block
        flip
        eyebrow="Versatile"
        title="Poolside Pavilion 12×12"
        copy="Room-scale coverage with modern proportions—shade for lounging, dining, or outdoor kitchens."
        img={{ src: "/poolside-pavilion-12x12.jpg", alt: "Poolside Pavilion 12×12" }}
        hrefPrimary={{ href: "/builder?kit=poolside-pavilion-12x12", label: "Build & Price" }}
        hrefSecondary={{ href: "/shop", label: "See Kits" }}
      />
    </Section>
  );
}
