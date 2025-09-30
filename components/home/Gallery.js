import Image from "next/image";
import Link from "next/link";
import Section from "../Section";

const IMAGES = [
  { src: "/poolside-pavilion-12x12.jpg", alt: "Poolside Pavilion 12×12" },
  { src: "/patio-pro-10x10.jpg",         alt: "Patio Pro 10×10" },
  { src: "/market-pavilion-20x24.jpg",   alt: "Market Pavilion 20×24" },
  { src: "/hero.jpg",                    alt: "Backyard pergola project" },
  { src: "/grand-pavilion-24x30.jpg",    alt: "Grand Pavilion 24×30" },
  { src: "/cafe-cover-20x20.jpg",        alt: "Cafe Cover 20×20" },
];

export default function Gallery() {
  return (
    <Section className="py-16" id="gallery">
      <div className="text-center">
        <div className="label">/ Get Inspired</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Real Projects</h2>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {IMAGES.map((img) => (
          <div key={img.src} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
            <Image src={img.src} alt={img.alt} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/resources" className="btn-secondary">Visit the Gallery</Link>
      </div>
    </Section>
  );
}
