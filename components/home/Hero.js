import Image from "next/image";
import Link from "next/link";

export default function Hero({
  bg = "/hero.jpg",
  heading = "Outdoor Comfort, Built for Real Life.",
  subheading = "Engineered steel pergola kits. Configure, price, and ship nationwide.",
  primary = { href: "/builder?kit=patio-pro-10x10", label: "Build & Price" },
  secondary = { href: "/shop", label: "See Kits" },
}) {
  return (
    <section className="relative h-[92vh] min-h-[560px] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <Image
        src={bg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          {heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-200 max-w-3xl">
          {subheading}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href={primary.href} className="btn-primary px-6 py-3 text-base md:text-lg">
            {primary.label}
          </Link>
          <Link href={secondary.href} className="btn-secondary px-6 py-3 text-base md:text-lg">
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
