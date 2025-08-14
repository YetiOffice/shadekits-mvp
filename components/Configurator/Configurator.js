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

  const price = useMemo(() => computePrice(cfg, zip), [cfg, zip]);
  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Configurator (Legacy)</h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Column 1 */}
        <div>
          <div className="font-medium mb-2">Product</div>
          {["Mono", "Gable", "AttachedMono"].map((s) => (
            <button
              key={s}
              className={pill(cfg.style === s)}
              onClick={() => set({ style: s })}
              type="button"
            >
              {s === "Mono" ? "Freestanding Mono" : s === "Gable" ? "Freestanding Gable" : "Attached Mono"}
            </button>
          ))}

          <div className="font-medium mt-4 mb-2">Infill</div>
          {["None", "Slats (Open)", "Slats (Medium)", "Slats (Tight)"].map((i) => (
            <button
              key={i}
              className={pill(cfg.infill === i)}
              onClick={() => set({ infill: i })}
              type="button"
            >
              {i}
            </button>
          ))}

          <div className="font-medium mt-4 mb-2">Finish</div>
          {["Black", "White", "Bronze", "HDG"].map((f) => (
            <button
              key={f}
              className={pill(cfg.finish === f)}
              onClick={() => set({ finish: f })}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Column 2 */}
        <div>
          <div className="font-medium mb-2">Size</div>
          {[10, 12, 20].map((s) => (
            <button
              key={s}
              className={pill(cfg.span === s && cfg.depth === s)}
              onClick={() => set({ span: s, depth: s })}
              type="button"
            >
              {s}×{s}
            </button>
          ))}
          <button
            className={pill(cfg.span === 12 && cfg.depth === 20)}
            onClick={() => set({ span: 12, depth: 20 })}
            type="button"
          >
            12×20
          </button>

          <div className="font-medium mt-4 mb-2">Height</div>
          {[8, 10, 12].map((h) => (
            <button
              key={h}
              className={pill(cfg.height === h)}
              onClick={() => set({ height: h })}
              type="button"
            >
              {h}′
            </button>
          ))}

          <div className="font-medium mt-4 mb-2">Anchoring</div>
          {["Slab", "Footings"].map((a) => (
            <button
              key={a}
              className={pill(cfg.anchor === a)}
              onClick={() => set({ anchor: a })}
              type="button"
            >
              {a}
            </button>
          ))}
        </div>

        {/* Column 3 */}
        <div>
          <div className="font-medium mb-2">ZIP (for freight estimate)</div>
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          />

          <div className="mt-6 p-4 border rounded-lg bg-neutral-50">
            <div className="text-sm text-neutral-600">Budget Range</div>
            <div className="text-xl font-semibold">
              {usd(price.budgetLow)} – {usd(price.budgetHigh)}
            </div>
          </div>

          <div className="mt-3 p-4 border rounded-lg bg-neutral-50">
            <div className="text-sm text-neutral-600">Freight Estimate</div>
            <div className="text-xl font-semibold">
              {zip.length >= 5 ? `${usd(price.freightLow)} – ${usd(price.freightHigh)}` : "Enter ZIP"}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-neutral-600">
        Posts modeled as 4×4 (4″ square). Lead time typically 3–5 weeks. Includes pre-cut steel,
        hardware and anchors as specified, finish schedule and install guide.
      </div>
    </div>
  );
}
