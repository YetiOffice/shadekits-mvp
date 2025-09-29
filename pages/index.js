// /pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import StickyCTA from "../components/StickyCTA";

// Home sections
import Hero from "../components/home/Hero";
import ProductHighlights from "../components/home/ProductHighlights";
import InnovationsCarousel from "../components/home/InnovationsCarousel";
import Gallery from "../components/home/Gallery";
import VisualizerPromo from "../components/home/VisualizerPromo";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";

// ---- Feature flags (toggle to true to re-enable) ----
const SHOW_PRODUCT_HIGHLIGHTS = false; // "New Options Available"
const SHOW_TESTIMONIALS = false;       // "Loved by Homeowners & Pros"

export default function Home() {
  return (
    <Layout
      title="ShadeKits — Outdoor Comfort, Built for Real Life"
      description="Commercial-grade steel pergola kits. Configure in minutes, instant budget & lead time, ships nationwide."
    >
      <Head>
        <meta name="robots" content="index,follow" />
      </Head>

      {/* Floating CTA that appears after scrolling a bit */}
      <StickyCTA threshold={520} />

      {/* Sections (top-to-bottom) */}
      <Hero />

      {SHOW_PRODUCT_HIGHLIGHTS && <ProductHighlights />}     {/* Hidden for now */}
      <InnovationsCarousel />
      <Gallery />
      <VisualizerPromo />
      {SHOW_TESTIMONIALS && <Testimonials />}               {/* Hidden for now */}
      <FAQ />
      <CTA />
    </Layout>
  );
}
