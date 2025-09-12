import Link from "next/link";
import Image from "next/image";
import Section from "../Section";

export default function VisualizerPromo() {
  return (
    <Section className="py-16" id="visualizer">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="label">Pergola Visualizer</h3>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Visualize Your New Outdoor Escape</h2>
          <p className="mt-3 text-neutral-700">
            Explore sizes, roof patterns, and colors. Save a configuration and get an instant budget.
          </p>
          <Link href="/builder?kit=patio-pro-10x10" className="btn-primary mt-6">Visualize Now</Link>
        </div>
        <div className="relative aspect-[10/16] max-w-sm mx-auto rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
          {/* Use any tall screenshot/phone mock you have; placeholder below */}
          <Image src="/patio-pro-10x10.jpg" alt="Visualizer preview" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
        </div>
      </div>
    </Section>
  );
}
