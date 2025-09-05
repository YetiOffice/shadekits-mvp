// pages/builder.js
import Head from "next/head";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Use dynamic so the 3D viewer inside the Configurator only runs client-side
const Configurator = dynamic(
  () => import("../components/Configurator/Configurator"),
  { ssr: false }
);

// tiny helper that calls your /api/checkout and redirects to Stripe
async function buyNow(slug, cfg) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, cfg }),
  });
  const data = await res.json();
  if (data.url) {
    window.location = data.url;           // redirect to Stripe Checkout
  } else {
    alert(data.error || "Checkout error");
    console.error("checkout response:", data);
  }
}

export default function BuilderPage() {
  // expose a global so your existing “Buy Now” button (or the console) can call it
  useEffect(() => {
    const w = window;
    w.shadekits = w.shadekits || {};
    w.shadekits.startCheckout = async (slug, cfg) => {
      // default slug from the URL (?kit=...)
      if (!slug) {
        const qs = new URLSearchParams(location.search);
        slug = qs.get("kit") || "patio-pro-10x10";
      }
      // try to read the live configurator state if it exposes one
      cfg = cfg || w.__BUILDER_STATE?.cfg || null;

      // last-resort default that matches /data/standardKits.js
      if (!cfg) {
        cfg = { span: 10, depth: 10, height: 10, colorId: "black", roofDesignId: "palmleaf" };
      }
      return buyNow(slug, cfg);
    };
    console.log("[builder] window.shadekits.startCheckout attached");

    // (Optional, no UI change) wire up the visible “Buy Now” button by its label
    const attach = () => {
      const btn = Array.from(document.querySelectorAll("button"))
        .find(b => b.textContent?.trim().toLowerCase() === "buy now");
      if (btn && !btn.__skWired) {
        btn.__skWired = true;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          w.shadekits.startCheckout();
        });
        console.log("[builder] Buy Now button wired");
      }
    };
    attach();
    const id = setInterval(attach, 1000); // re-attach if the configurator re-renders
    return () => clearInterval(id);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Builder • ShadeKits</title>
        <meta
          name="description"
          content="Design your pergola in minutes — choose size, color, and roof design. Live 3D preview and instant budget."
        />
      </Head>

      <div className="py-6 md:py-10">
        <Configurator />
      </div>
    </Layout>
  );
}
