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
  `px-3 py-2 rounded-md border text-sm ${active ? "ring-2 ring-red-600 border-neutral-900" : "border-neutral-300"}`;

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
        {/* Left controls */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
          {/* Size */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Size</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Width (ft)</label>
                <input
                  type="number"
                  min={6}
                  step={1}
                  className="w-full rounded-md border border-neutral-300 px-2 py-2"
                  value={cfg.span}
                  onChange={(e) => setCfg((v) => ({ ...v, span: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Depth (ft)</label>
                <input
                  type="number"
                  min={6}
                  step={1}
                  className="w-full rounded-md border border-neutral-300 px-2 py-2"
                  value={cfg.depth}
                  onChange={(e) => setCfg((v) => ({ ...v, depth: Number(e.target.value) }))}
                />
              </div>
            </div>
          </section>

          {/* Height */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Height</div>
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
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Color</div>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCfg((v) => ({ ...v, colorId: c.id }))}
                  className={`h-10 rounded-md border ${
                    cfg.colorId === c.id ? "ring-2 ring-red-600 border-neutral-900" : "border-neutral-300"
                  }`}
                  title={c.name}
                  aria-pressed={cfg.colorId === c.id}
                >
                  <span className="sr-only">{c.name}</span>
                  <div className="w-full h-full rounded" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </section>

          {/* Roof Design */}
          <section>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Roof Design</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ROOF_DESIGNS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setCfg((v) => ({ ...v, roofDesignId: d.id }))}
                  className={`rounded-md border p-1 text-left ${
                    cfg.roofDesignId === d.id ? "ring-2 ring-red-600 border-neutral-900" : "border-neutral-300"
                  }`}
                  aria-pressed={cfg.roofDesignId === d.id}
                >
                  <img
                    src={`/swatches/roof/${d.id}_swatch.webp`}
                    alt={d.name}
                    className="h-20 w-full object-cover rounded"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.opacity = 0.15;
                      e.currentTarget.alt = "Pattern";
                    }}
                  />
                  <div className="mt-1 text-xs font-medium">{d.name}</div>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Right: Viewer + summary + pricing */}
        <div className="space-y-4">
          {/* Summary chips */}
          <div className="p-3 flex flex-wrap gap-2 border border-neutral-200 rounded-lg bg-white">
            <span className="px-2 py-1 rounded-md bg-neutral-100">
              Color: <b>{colorName}</b>
            </span>
            <span className="px-2 py-1 rounded-md bg-neutral-100">
              Roof: <b>{roofName}</b>
            </span>
            <span className="px-2 py-1 rounded-md bg-neutral-100">
              Size: <b>{cfg.span}×{cfg.depth}×{cfg.height} ft</b>
            </span>
            {isBuyable && matchedKit && (
              <span className="px-2 py-1 rounded-md bg-green-100 text-green-800">
                Buy-eligible • {kitName(matchedKit.slug)}
              </span>
            )}
          </div>

          {/* 3D Viewer */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <Viewer3D config={cfg} />
          </div>

          {/* ZIP & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-neutral-50">
              <div className="text-sm text-neutral-600 mb-1">ZIP (for freight estimate)</div>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              />
            </div>

            <div className="p-4 border rounded-lg bg-neutral-50">
              <div className="text-sm text-neutral-600">Budget Range</div>
              <div className="text-xl font-semibold">
                {usd(p.budgetLow)} – {usd(p.budgetHigh)}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-neutral-50 md:col-span-2">
              <div className="text-sm text-neutral-600">Freight Estimate</div>
              <div className="text-xl font-semibold">
                {zip.length >= 5 ? `${usd(p.freightLow)} – ${usd(p.freightHigh)}` : "Enter ZIP"}
              </div>
            </div>

            <div className="md:col-span-2 text-sm text-neutral-600">
              Posts modeled as 4×4 (4″ square). Typical lead time {lead[0]}–{lead[1]} weeks.
              Includes pre-cut steel, hardware, anchors as specified, finish schedule, and install guide.
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bars */}
      {isBuyable ? (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[min(96vw,920px)]">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-neutral-600">
                {matchedKit?.name} • Ships in {lead[0]}–{lead[1]} weeks
              </div>
              <div className="text-xl font-bold">
                {usd(p.budgetHigh)} <span className="text-sm font-normal text-neutral-500">est.</span>
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
                <span className="text-sm font-normal text-neutral-500"> (freight & engineering confirmed after site review)</span>
              </div>
            </div>

            {/* simple mini form -> mailto */}
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                const zipVal = form.zip.value.trim();
                const subject = encodeURIComponent("[Quote Request] Custom Pergola");
                const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
ZIP: ${zipVal}

Config:
  Size: ${cfg.span}×${cfg.depth}×${cfg.height} ft
  Color: ${cfg.colorId}
  Roof: ${cfg.roofDesignId}

Budget: ${usd(p.budgetLow)} – ${usd(p.budgetHigh)}
Freight (est): ${zip.length >= 5 ? `${usd(p.freightLow)} – ${usd(p.freightHigh)}` : "(enter ZIP in builder)"}

Notes:
`
                );
                window.location.href = `mailto:office@yetiwelding.com?subject=${subject}&body=${body}`;
              }}
            >
              <input name="name" required className="border rounded-md px-3 py-2 text-sm" placeholder="Name" />
              <input name="email" type="email" required className="border rounded-md px-3 py-2 text-sm" placeholder="Email" />
              <input name="phone" className="border rounded-md px-3 py-2 text-sm" placeholder="Phone" />
              <input name="zip" className="border rounded-md px-3 py-2 text-sm" placeholder="ZIP" />
              <button type="submit" className="btn-secondary px-4 py-2">Request Quote</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
