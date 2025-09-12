// /pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import StickyCTA from "../components/StickyCTA";

// New home sections
import Hero from "../components/home/Hero";
import ProductHighlights from "../components/home/ProductHighlights";
import InnovationsCarousel from "../components/home/InnovationsCarousel";
import Gallery from "../components/home/Gallery";
import VisualizerPromo from "../components/home/VisualizerPromo";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <Layout
      title="ShadeKits — Commercial-grade Pergola Kits"
      description="Engineered steel shade kits with instant pricing. Build, price, and ship nationwide."
    >
      <Head>
        <meta name="robots" content="index,follow" />
        <title>ShadeKits — Commercial-grade Pergola Kits</title>
        {/* If you later want to preload the hero image, use React's camelCase:
           <link rel="preload" as="image" href="/hero.jpg" imageSrcSet="/hero.jpg 2400w" imageSizes="100vw" />
        */}
      </Head>

      {/* sticky bottom CTA that appears after scrolling */}
      <StickyCTA threshold={520} />

      {/* sections (top-to-bottom) */}
      <Hero />
      <ProductHighlights />
      <InnovationsCarousel />
      <Gallery />
      <VisualizerPromo />
      <Testimonials />
      <FAQ />
      <CTA />
    </Layout>
  );
}
