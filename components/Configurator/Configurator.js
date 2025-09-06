// components/Configurator/Configurator.js
import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { computePrice, usd } from "../../lib/pricing";
import { COLORS } from "../../lib/colors";
import { ROOF_DESIGNS } from "../../lib/panels";
import { buyEligibleForConfig, configFromSlug, kitName, leadWeeksForSlug } from "../../lib/buy";

// Load the R3F viewer on the client only
const Viewer3D = dynamic(() => import("../Builder/Viewer3D"), { ssr: false });

const pill = (active) =>
  `px-3 py-2 rounded-md border text-sm ${
    active ? "ring-2 ring-red-600 border-neutral-900" : "border-neutral-300"
  }`;

function finishFromColor(colorId) {
  switch (colorId) {
    case "black":
    case "charcoal":
      return "Black";
    case "white":
      return "White";
    case "bronze":
    case "sand":
      return "Bronze";
    case "hdg":
      return "HDG";
    default:
      return "Black";
  }
}

export default function Configurator() {
  const router = useRouter();
  const { kit: kitSlug } = router.query || {};

  // default config (will be overridden if kit param present)
  const [cfg, setCfg] = useState({
    span: 10,
    depth: 10,
    height: 10,
    colorId: "black",
    roofDesignId: ROOF_DESIGNS[0]?.id || "palmleaf",
  });

  const [zip, setZip] = useState("");
  // NEW: track quote submission state and message
  const [quoteSending, setQuoteSending] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");

  // When deep-linked with ?kit=slug, prefill with that kit config.
  useEffect(() => {
    if (!kitSlug) return;
    const kitCfg = configFromSlug(String(kitSlug));
    if (kitCfg) setCfg(kitCfg);
  }, [kitSlug]);

  // Pricing (legacy-compatible)
  const legacyPricingCfg = useMemo(
    () => ({
      style: "Mono",
      span: cfg.span,
      depth: cfg.depth,
      height: cfg.height,
      infill: "None",
      finish: finishFromColor(cfg.colorId),
      anchor: "Slab",
      bays: 1,
    }),
    [cfg]
  );
  const p = useMemo(() => computePrice(legacyPricingCfg, zip), [legacyPricingCfg, zip]);

  // Buy eligibility
  const buyInfo = buyEligibleForConfig(cfg);
  const isBuyable = buyInfo.eligible;
  const matchedKit = buyInfo.kit; // contains slug, name, leadWeeks, config
  const lead = matchedKit ? leadWeeksForSlug(matchedKit.slug) : [3, 5];

  // UI helpers
  const colorName = COLORS.find((c) => c.id === cfg.colorId)?.name || "Color";
  const roofName = ROOF_DESIGNS.find((d) => d.id === cfg.roofDesignId)?.name || "Roof";

  // Actions
  async function handleBuyNow() {
    if (!isBuyable || !matchedKit) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: matchedKit.slug, cfg }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert(data?.error || "Checkout error");
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    }
  }

  function resetToKit() {
    if (matchedKit) setCfg(matchedKit.config);
    else if (kitSlug) {
      const c = configFromSlug(String(kitSlug));
      if (c) setCfg(c);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Design Your Pergola</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
      {/* … left controls and viewer omitted for brevity … */}

      {/* Sticky bars */}
      {isBuyable ? (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[min(96vw,920px)]">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-neutral-600">
                {matchedKit?.name} • Ships in {lead[0]}–{lead[1]} weeks
              </div>
              <div className="text-xl font-bold">
                {usd(p.budgetHigh)}{" "}
                <span className="text-sm font-normal text-neutral-500">est.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {kitSlug && (
                <button
                  className="text-sm underline text-neutral-600 hover:text-neutral-900"
                  onClick={resetToKit}
                >
                  Reset to Standard Kit
                </button>
              )}
              <button onClick={handleBuyNow} className="btn-primary px-5 py-2">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[min(96vw,920px)]">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm text-neutral-600">Custom build</div>
              <div className="text-lg font-semibold">
                Budget {usd(p.budgetLow)} – {usd(p.budgetHigh)}
                <span className="text-sm font-normal text-neutral-500">
                  {" "}
                  (freight & engineering confirmed after site review)
                </span>
              </div>
            </div>

            {/* updated mini form -> posts to /api/quote */}
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setQuoteSending(true);
                setQuoteMessage("");
                const form = e.currentTarget;
                const payload = {
                  name: form.name.value.trim(),
                  email: form.email.value.trim(),
                  phone: form.phone.value.trim(),
                  zip: form.zip.value.trim(),
                  slug: kitSlug || matchedKit?.slug || "",
                  cfg,
                };
                try {
                  const res = await fetch("/api/quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const result = await res.json();
                  if (result.ok) {
                    setQuoteMessage(
                      "Thanks! Your request has been sent. We’ll be in touch within 24–48 hours."
                    );
                    form.reset();
                  } else {
                    setQuoteMessage(
                      result.error || "Failed to send quote. Please try again."
                    );
                  }
                } catch (err) {
                  setQuoteMessage("Network error. Please try again.");
                } finally {
                  setQuoteSending(false);
                }
              }}
            >
              <input
                name="name"
                required
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Name"
              />
              <input
                name="email"
                type="email"
                required
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Email"
              />
              <input
                name="phone"
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Phone"
              />
              <input
                name="zip"
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="ZIP"
              />
              <button
                type="submit"
                className="btn-secondary px-4 py-2"
                disabled={quoteSending}
              >
                {quoteSending ? "Sending…" : "Request Quote"}
              </button>
            </form>
            {quoteMessage && (
              <div className="mt-2 text-sm text-neutral-600">{quoteMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
