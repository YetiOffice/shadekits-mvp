// pages/builder.js
import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  STYLES,
  FINISHES,
  INFILL,
  HEIGHTS,
  SIZE_PRESETS,
} from "../data/catalog";
import { normalizeConfig } from "../lib/configRules";
import usePricing from "../hooks/usePricing";
import { buildSpec } from "../lib/spec";

// viewer (no SSR)
const Viewer3D = dynamic(() => import("../components/Builder/Viewer3D"), {
  ssr: false,
});

const DEFAULT_CONFIG = {
  style: "Mono",
  span: 12,
  depth: 12,
  height: 10,
  bays: 1,
  infill: "None",
  finish: "Black",
  anchor: "Slab",
};

// ---------- helpers ----------
function configToQuery(cfg) {
  const p = new URLSearchParams();
  p.set("style", cfg.style);
  p.set("span", String(cfg.span));
  p.set("depth", String(cfg.depth));
  p.set("height", String(cfg.height));
  p.set("infill", cfg.infill);
  p.set("finish", cfg.finish);
  p.set("anchor", cfg.anchor);
  p.set("bays", String(cfg.bays));
  return p.toString();
}
function configFromQuery(search) {
  const q = new URLSearchParams(search);
  return {
    style: q.get("style") || DEFAULT_CONFIG.style,
    span: Number(q.get("span") || DEFAULT_CONFIG.span),
    depth: Number(q.get("depth") || DEFAULT_CONFIG.depth),
    height: Number(q.get("height") || DEFAULT_CONFIG.height),
    infill: q.get("infill") || DEFAULT_CONFIG.infill,
    finish: q.get("finish") || DEFAULT_CONFIG.finish,
    anchor: q.get("anchor") || DEFAULT_CONFIG.anchor,
    bays: Number(q.get("bays") || DEFAULT_CONFIG.bays),
  };
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full border",
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function BuilderPage() {
  // init from URL
  const initial = React.useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    const fromQ = configFromQuery(window.location.search);
    return normalizeConfig(fromQ).config;
  }, []);
  const [config, setConfig] = React.useState(initial);
  const [notes, setNotes] = React.useState([]);
  const [flags, setFlags] = React.useState({ engineerReview: false });
  const viewerRef = React.useRef(null);

  // form state (for email)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    zip: "",
    useCase: "",
  });

  const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/yourid";
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  // normalize once on mount
  React.useEffect(() => {
    const n = normalizeConfig(config);
    setConfig(n.config);
    setNotes(n.notes);
    setFlags(n.flags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pricing hook (live)
  const pricing = usePricing(config, form.zip);

  const permalink =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?${configToQuery(config)}`
      : "";

  const specText = React.useMemo(
    () => buildSpec({ form, config, pricing, notes, flags, permalink }),
    [form, config, pricing, notes, flags, permalink]
  );

  function update(patch) {
    const out = normalizeConfig({ ...config, ...patch });
    setConfig(out.config);
    setNotes(out.notes);
    setFlags(out.flags);

    if (typeof window !== "undefined") {
      const qs = configToQuery(out.config);
      const url = `${window.location.pathname}?${qs}`;
      window.history.replaceState({}, "", url);
    }
  }

  function handleShare() {
    if (typeof window === "undefined") return;
    const qs = configToQuery(config);
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard"))
      .catch(() => alert("Copy failed — you can copy from the address bar."));
  }

  return (
    <>
      <Head>
        <title>Builder | ShadeKits</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-neutral-900 text-white rounded-2xl p-5 md:p-6 mb-6">
          <div className="text-2xl font-semibold">BUILDER</div>
          <div className="text-sm md:text-[15px] mt-1 opacity-90">
            Design a commercial-grade steel pergola in minutes. Live 3D preview, instant
            budget, ships nationwide.
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 md:p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
            <span className="text-sm font-medium text-neutral-600 mr-2">Product</span>
            {STYLES.map((s) => (
              <Chip
                key={s.id}
                active={config.style === s.id}
                onClick={() => update({ style: s.id })}
              >
                {s.label}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
            <span className="text-sm font-medium text-neutral-600 mr-2">Finish</span>
            {FINISHES.map((f) => (
              <Chip
                key={f.id}
                active={config.finish === f.id}
                onClick={() => update({ finish: f.id })}
              >
                {f.label}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="text-sm font-medium text-neutral-600 mr-2">Infill</span>
            {INFILL.map((i) => (
              <Chip
                key={i.id}
                active={config.infill === i.id}
                onClick={() => update({ infill: i.id })}
              >
                {i.label}
              </Chip>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-md text-sm border border-neutral-300 hover:bg-neutral-50"
              type="button"
            >
              Share
            </button>
            <a
              href="#quote"
              className="px-4 py-1.5 rounded-md text-sm bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Request a Quote
            </a>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Options */}
          <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4">
            {/* Size */}
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">Size</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {SIZE_PRESETS.map(({ span, depth }) => {
                  const active = config.span === span && config.depth === depth;
                  return (
                    <Chip
                      key={`${span}x${depth}`}
                      active={active}
                      onClick={() => update({ span, depth })}
                    >
                      {span}x{depth}
                    </Chip>
                  );
                })}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min={8}
                    max={30}
                    value={config.span}
                    onChange={(e) => update({ span: Number(e.target.value) })}
                    className="w-20 px-2 py-1 rounded-md border border-neutral-300 text-sm"
                  />
                  <span className="text-neutral-500 text-sm">×</span>
                  <input
                    type="number"
                    min={8}
                    max={30}
                    value={config.depth}
                    onChange={(e) => update({ depth: Number(e.target.value) })}
                    className="w-20 px-2 py-1 rounded-md border border-neutral-300 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Height */}
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">Height</div>
              <div className="flex flex-wrap gap-2">
                {HEIGHTS.map((h) => (
                  <Chip key={h} active={config.height === h} onClick={() => update({ height: h })}>
                    {h}’
                  </Chip>
                ))}
              </div>
            </div>

            {/* Anchoring */}
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">Anchoring</div>
              <div className="flex flex-wrap gap-2">
                <Chip active={config.anchor === "Slab"} onClick={() => update({ anchor: "Slab" })}>
                  Slab
                </Chip>
                <Chip
                  active={config.anchor === "Footings"}
                  onClick={() => update({ anchor: "Footings" })}
                >
                  Footings
                </Chip>
              </div>
              <div className="mt-2 text-[12px] text-neutral-500">
                Posts modeled as 4×4 (4&quot; square). Rules auto-add bays based on depth.
              </div>
            </div>
          </div>

          {/* Viewer */}
          <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-2xl p-2 md:p-3">
            <div className="aspect-[16/11] w-full rounded-xl overflow-hidden bg-neutral-50">
              <Viewer3D ref={viewerRef} config={config} />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => viewerRef.current?.setView?.("front")}
                className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 hover:bg-neutral-50"
              >
                Front
              </button>
              <button
                onClick={() => viewerRef.current?.setView?.("corner")}
                className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 hover:bg-neutral-50"
              >
                Corner
              </button>
              <button
                onClick={() => viewerRef.current?.setView?.("top")}
                className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 hover:bg-neutral-50"
              >
                Top
              </button>
              <button
                onClick={() => viewerRef.current?.setView?.("reset")}
                className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 hover:bg-neutral-50"
              >
                Reset
              </button>
            </div>

            <div className="mt-3 text-sm text-neutral-600">
              <strong className="font-medium">
                {config.style === "Mono" ? "MONO" : config.style.toUpperCase()}
              </strong>{" "}
              • {config.span}×{config.depth} ft • {config.bays}{" "}
              {config.bays === 1 ? "bay" : "bays"} • {config.height} ft
            </div>

            {notes.length > 0 && (
              <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-2">
                {notes.map((n, i) => (
                  <div key={i}>• {n}</div>
                ))}
              </div>
            )}
            {flags.engineerReview && (
              <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                This configuration may require engineering review.
              </div>
            )}
          </div>

          {/* Pricing + Quote */}
          <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4" id="quote">
            <div className="text-base font-semibold mb-2">Your Estimate</div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="border border-neutral-200 rounded-lg p-2">
                <div className="text-[12px] text-neutral-500">Budget Range</div>
                <div className="text-sm font-semibold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(pricing.budgetLow)}{" "}
                  –{" "}
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(pricing.budgetHigh)}
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-2">
                <div className="text-[12px] text-neutral-500">Freight Estimate</div>
                <div className="text-sm font-semibold">
                  {form.zip?.length >= 5 ? pricing.freightUsd : "Enter ZIP"}
                </div>
              </div>
            </div>

            <div className="text-[12px] text-neutral-600 border border-neutral-200 rounded-lg p-2 mb-3">
              Lead time: <strong>3–5 weeks</strong>. Includes pre-cut steel, hardware,
              anchors (as specified), finish schedule, and install guide.
            </div>

            {/* === Formspree Form === */}
            <form
              action={FORMSPREE}
              method="POST"
              className="flex flex-col gap-2"
            >
              {/* Standard fields */}
              <input
                name="name"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                name="email"
                type="email"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="Email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                name="phone"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                name="city"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="City, State"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                name="zip"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="ZIP (for freight estimate)"
                value={form.zip}
                onChange={(e) =>
                  setForm({ ...form, zip: e.target.value.replace(/[^\d]/g, "").slice(0, 5) })
                }
              />
              <input
                name="useCase"
                className="px-3 py-2 text-sm rounded-md border border-neutral-300"
                placeholder="Use case (restaurant, park, pool, etc.)"
                value={form.useCase}
                onChange={(e) => setForm({ ...form, useCase: e.target.value })}
              />

              {/* Hidden data for Formspree email */}
              <textarea name="spec" className="hidden" readOnly value={specText} />
              <input type="hidden" name="permalink" value={permalink} />
              <input type="hidden" name="_replyto" value={form.email || ""} />
              <input type="hidden" name="_subject" value="ShadeKits — Builder Concept Request" />
              <input type="hidden" name="_redirect" value={`${SITE_URL}/thank-you`} />

              <button className="mt-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm py-2" type="submit">
                Request Concept &amp; Price
              </button>
              <a
                className="text-center rounded-md border border-neutral-300 hover:bg-neutral-50 text-sm py-2"
                href="/contact"
              >
                Prefer full custom?
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
