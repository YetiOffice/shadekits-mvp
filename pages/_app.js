import "../styles/globals.css";
import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// Basic site constants (adjust when you have your final domain/image)
const SITE_NAME = "ShadeKits";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shadekits-mvp.vercel.app";
const SITE_DESC =
  "Commercial-grade, bolt-together steel shade structures. Design in 3D, get instant pricing, ships nationwide.";
const OG_IMAGE =
  "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=2000&q=80";

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.variable}>
      <Head>
        {/* Primary */}
        <title>ShadeKits — Bolt-Together Steel Shade Structures</title>
        <meta name="description" content={SITE_DESC} />
        <meta name="theme-color" content="#DC2626" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Preconnects (cheap wins) */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content="ShadeKits — Bolt-Together Steel Shade Structures" />
        <meta property="og:description" content={SITE_DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShadeKits — Bolt-Together Steel Shade Structures" />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
