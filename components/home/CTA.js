// components/home/CTA.js
import Link from "next/link";
import Image from "next/image";

export default function CTA({
  bg = "/lifestyle.jpg",
  heading = "Transform your outdoor living space.",
  sub = "Contact your local team today",
  href = "/contact",
  label = "Contact Us",
  objectPosition = "center", // tweak if you want to bias the crop
}) {
  return (
    <section className="relative my-16 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="relative h-[360px] md:h-[420px]">
        <Image
          src={bg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 h-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{heading}</h2>
          <p className="mt-2 uppercase tracking-wide text-sm md:text-base text-neutral-200">{sub}</p>
          <Link href={href} className="btn-primary mt-6 px-6 py-3">{label}</Link>
        </div>
      </div>
    </section>
  );
}
