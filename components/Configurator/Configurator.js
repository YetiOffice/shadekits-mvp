// components/Configurator/Configurator.js
import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { computePrice, usd } from "../../lib/pricing";
import { COLORS } from "../../lib/colors";
import { ROOF_DESIGNS } from "../../lib/panels";
import {
  buyEligibleForConfig,
  configFromSlug,
  kitName,
  leadWeeksForSlug,
} from "../../lib/buy";

// Preset sizes (locked to three)
const PRESET_SIZES = [
  { label: "12×12", span: 12, depth: 12 },
  { label: "12×16", span: 12, depth: 16 },
  { label: "12×20", span: 12, depth: 20 },
];

// Client-only viewer
const Viewer3D = dynamic(() => import("../Builder/Viewer3D"), { ssr: false });

// Map color id → legacy pricing finish
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

  // Default config; size overridden by kit slug if present
  const [cfg, setCfg] = useState({
    span: 12,
    depth: 12,
    height: 10,
    colorId: "black",
    roofDesignId: ROOF_DESIGNS[0]?.id || "palmleaf",
  });
  const [zip, setZip] = useState("");

  // Load config from product slug (deep links)
  useEffect(() => {
    if (!kitSlug) return;
    const preset = configFromSlug(kitSlug);
    if (preset) {
      setCfg((v) => ({
        ...v,
        span: preset.span,
        depth: preset.depth,
        height: preset.height || v.height,
      }));
    }
  }, [kitSlug]);

  // Pricing input (legacy util expects this shape)
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

  // Buy routing
  const buyInfo = buyEligibleForConfig(cfg); // returns {eligible, kit}
  const isBuyable = buyInfo.eligible;
  const matchedKit = buyInfo.kit; // { slug, name, leadWeeks, config }
  const lead = matchedKit ? leadWeeksForSlug(matchedKit.slug) : [3, 5];

  // UI helpers
  const colorName = COLORS.find((c) => c.id === cfg.colorId)?.name || "Color";
  const pill = (active) =>
    `px-3 py-2 rounded-md border text-sm ${
      active
        ? "bg-red-600 text-white border-red-600"
        : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
    }`;

  // ✅ Buy handler: POST to /api/checkout, then redirect to Stripe
  async function handleBuyNow() {
    try {
      const slug = matchedKit?.slug;
      if (!isBuyable || !slug) return;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // You can include cfg if you want it logged server-side:
        body: JSON.stringify({ slug /*, cfg*/ }),
      });

      if (!res.ok) {
        throw new Error(`Checkout failed (${res.status})`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("No checkout URL returned");

      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Sorry—checkout is unavailable right now.");
    }
  }

  return (
    <div className="container-7xl mb-24">
      <h1 className="mb-6">Design Your Pergola</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        {/* Left controls */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
          {/* Size */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Size
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESET_SIZES.map((s) => {
                const selected = cfg.span === s.span && cfg.depth === s.depth;
                return (
                  <button
                    key={`${s.span}x${s.depth}`}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setCfg((v) => ({ ...v, span: s.span, depth: s.depth }))
                    }
                    className={pill(selected)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Height */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Height
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[8, 10, 12].map((h) => (
                <button
                  key={h}
                  type="button"
                  className={pill(cfg.height === h)}
                  onClick={() => setCfg((v) => ({ ...v, height: h }))}
                  aria-pressed={cfg.height === h}
                >
                  {h} ft
                </button>
              ))}
            </div>
          </section>

          {/* Color */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Color
            </div>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  className={`h-8 w-8 rounded-md border-2 ${
                    cfg.colorId === c.id ? "border-red-600" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setCfg((v) => ({ ...v, colorId: c.id }))}
                >
                  <span className="sr-only">{c.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Roof design */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Roof Design
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ROOF_DESIGNS.map((rd) => (
                <button
                  key={rd.id}
                  type="button"
                  className={pill(cfg.roofDesignId === rd.id)}
                  onClick={() => setCfg((v) => ({ ...v, roofDesignId: rd.id }))}
                  aria-pressed={cfg.roofDesignId === rd.id}
                >
                  {rd.name}
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Right column */}
        <div className="space-y-4">
          {/* Spec strip (NO buy-eligible chip) */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-md bg-neutral-100">Color: {colorName}</span>
            <span className="px-2 py-1 rounded-md bg-neutral-100">
              Roof: {ROOF_DESIGNS.find((r) => r.id === cfg.roofDesignId)?.name}
            </span>
            <span className="px-2 py-1 rounded-md bg-neutral-100">
              Size: {cfg.span}×{cfg.depth}×{cfg.height} ft
            </span>
          </div>

          {/* Viewer */}
          <div className="p-4 border rounded-lg bg-neutral-50">
            <Viewer3D config={cfg} />
          </div>

          {/* ZIP + Budget */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">
                ZIP (for freight estimate)
              </label>
              <input
                className="w-full rounded-md border border-neutral-300 px-2 py-2"
                placeholder="ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
            <div>
              <div className="text-xs text-neutral-600 mb-1">Budget Range</div>
              <div className="font-semibold">
                {usd(p.budgetLow)} – {usd(p.budgetHigh)}
              </div>
            </div>
          </div>

          {/* BUY BOX (single primary CTA) */}
          {isBuyable && matchedKit && (
            <div className="border rounded-lg p-4 flex flex-col gap-2 md:max-w-md">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <div className="text-xs text-neutral-600 text-center">
                Secure checkout • Ships in {lead[0]}–{lead[1]} weeks
              </div>
            </div>
          )}

          {/* Description / notes */}
          <div className="text-sm text-neutral-600">
            Posts modeled as 4×4 (“I” square). Typical lead time {lead[0]}–{lead[1]} weeks.
            Includes pre-cut steel, hardware, anchors as specified, finish schedule, and install guide.
          </div>
        </div>
      </div>
    </div>
  );
}
