// pages/builder.js
import React from "react";
import Head from "next/head";
import {
  STYLES,
  FINISHES,
  INFILL,
  HEIGHTS,
  SIZE_PRESETS,
} from "../data/catalog";
import { normalizeConfig } from "../lib/configRules";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer to avoid SSR issues with three.js
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

// ---------- Helpers: shareable URL ----------
function configToQuery(cfg) {
  const params = new URLSearchParams();
  params.set("style", cfg.style);
  params.set("span", String(cfg.span));
  params.set("depth", String(cfg.depth));
  params.set("height", String(cfg.height));
  params.set("infill", cfg.infill);
  params.set("finish", cfg.finish);
  params.set("anchor", cfg.anchor);
  params.set("bays", String(cfg.bays));
  return params.toString();
}

function configFromQuery(search) {
  const q = new URLSearchParams(search);
  const span = Number(q.get("span") || DEFAULT_CONFIG.span);
  const depth = Number(q.get("depth") || DEFAULT_CONFIG.depth);
  const height = Number(q.get("height") || DEFAULT_CONFIG.height);
  const bays = Number(q.get("bays") || DEFAULT_CONFIG.bays);
  const style = q.get("style") || DEFAULT_CONFIG.style;
  const infill = q.get("infill") || DEFAULT_CONFIG.infill;
  const finish = q.get("finish") || DEFAULT_CONFIG.finish;
  const anchor = q.get("anchor") || DEFAULT_CONFIG.anchor;

  return {
    style,
    span,
    depth,
    height,
    bays,
    infill,
    finish,
    anchor,
  };
}

// ---------- UI chip ----------
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
  // load initial from URL if present
  const initial = React.useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    const fromQ = configFromQuery(window.location.search);
    return normalizeConfig(fromQ).config;
  }, []);

  const [config, setConfig] = React.useState(initial);
  const [notes, setNotes] = React.useState([]);
  const [flags, setFlags] = React.useState({ engineerReview: false });
  const viewerRef = React.useRef(null);

  // Ensure normalization whenever config changes externally (URL paste etc.)
  React.useEffect(() => {
    const normalized = normalizeConfig(config);
    setConfig(normalized.config);
    setNotes(normalized.notes);
    setFlags(normalized.flags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Central updater: always normalize & store notes/flags
  function update(patch) {
    const out = normalizeConfig({ ...config, ...patch });
    setConfig(out.config);
    setNotes(out.notes);
    setFlags(out.flags);
    // keep the URL in sync (nice touch)
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
      .catch(() => alert("Copy failed — you can manually copy from the address bar."));
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

        {/* Toolbar row */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 md:p-4 mb-5">
          {/* Product */}
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

          {/* Finish */}
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

          {/* Infill */}
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

          {/* Actions */}
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
