import React, { useMemo, useState } from "react";
import { computePrice, usd } from "../../lib/pricing";

const pill = (active) =>
  `px-3 py-1 rounded-full border text-sm mr-2 mb-2 ${
    active ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-neutral-300"
  }`;

export default function Configurator() {
  const [cfg, setCfg] = useState({
    style: "Mono",        // Mono | Gable | AttachedMono
    span: 12,
    depth: 12,
    height: 10,
    infill: "None",       // None | Slats (Open) | Slats (Medium) | Slats (Tight)
    finish: "Black",      // Black | White | Bronze | HDG
    anchor: "Slab",       // Slab | Footings
    bays: 1,
  });
  const [zip, setZip] = useState("");

  const p = useMemo(() => computePrice(cfg, zip), [cfg, zip]);
  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Configurator (Legacy)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left controls */}
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Product</div>
            {["Mono", "Gable", "AttachedMono"].map((s) => (
              <button key={s} type="button" className={pill(cfg.style === s)} onClick={() => set({ style: s })}>
                {s === "Mono" ? "Freestanding Mono" : s === "Gable" ? "Freestanding Gable" : "Attached Mono"}
              </button>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Size</div>
            {[[10, 10], [12, 12], [12, 20]].map(([w, d]) => (
              <button
                key={`${w}x${d}`}
                type="button"
                className={pill(cfg.span === w && cfg.depth === d)}
                onClick={() => set({ span: w, depth: d })}
              >
                {w}×{d}
              </button>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Finish</div>
            {["Black", "White", "Bronze", "HDG"].map((f) => (
              <button key={f} type="button" className={pill(cfg.finish === f)} onClick={() => set({ finish: f })}>
                {f}
              </button>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Infill</div>
            {["None", "Slats (Open)", "Slats (Medium)", "Slats (Tight)"].map((i) => (
              <button key={i} type="button" className={pill(cfg.infill === i)} onClick={() => set({ infill: i })}>
                {i}
              </button>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Anchoring</div>
            {["Slab", "Footings"].map((a) => (
              <button key={a} type="button" className={pill(cfg.anchor === a)} onClick={() => set({ anchor: a })}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Right summary */}
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">ZIP (for freight estimate)</div>
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

          <div className="p-4 border rounded-lg bg-neutral-50">
            <div className="text-sm text-neutral-600">Freight Estimate</div>
            <div className="text-xl font-semibold">
              {zip.length >= 5 ? `${usd(p.freightLow)} – ${usd(p.freightHigh)}` : "Enter ZIP"}
            </div>
          </div>

          <div className="text-sm text-neutral-600">
            Posts modeled as 4×4 (4″ square). Typical lead time 3–5 weeks. Includes pre-cut steel,
            hardware, anchors as specified, finish schedule, and install guide.
          </div>
        </div>
      </div>
    </div>
  );
}
