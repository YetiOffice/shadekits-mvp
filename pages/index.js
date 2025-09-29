// pages/index.js
import Layout from "../components/Layout";

import Hero from "../components/home/Hero";
import ProductHighlights from "../components/home/ProductHighlights";
// import InnovationsCarousel from "../components/home/InnovationsCarousel"; // hidden
import Gallery from "../components/home/Gallery";
import VisualizerPromo from "../components/home/VisualizerPromo";
// import Testimonials from "../components/home/Testimonials"; // hidden
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";
import StickyCTA from "../components/StickyCTA";

export default function HomePage() {
  return (
    <Layout
      title="ShadeKits — Outdoor Comfort, Built for Real Life"
      description="Engineered steel pergola kits. Configure, price, and ship nationwide. PE-stamped drawings available."
    >
      <Hero />
      <ProductHighlights />
      {/* <InnovationsCarousel />  — hidden per request */}
      <Gallery />
      <VisualizerPromo />
      {/* <Testimonials /> — hidden per request */}
      <FAQ />
      <CTA />

      <StickyCTA />
    </Layout>
  );
}
