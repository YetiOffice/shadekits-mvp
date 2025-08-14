// pages/builder.js
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";

// no SSR for WebGL
const Viewer3D = dynamic(() => import("../components/Builder/Viewer3D"), { ssr: false });

// --- helpers --------------------------------------------------
function estimateBudget(cfg) {
  const area = cfg.span * cfg.depth;
  const rateByStyle = { Mono: 33, Gable: 36, AttachedMono: 35 };
  let rate = rateByStyle[cfg.style] ?? 33;
  if (cfg.height > 10) rate += (cfg.height - 10) * 1.2;
  if (cfg.infill?.startsWith("Slats")) rate += 2.5;
  if (cfg.infill === "SlatsTight") rate += 1.0;
  if (cfg.infill?.startsWith("Panels")) rate += 4.0;
  if (cfg.finish === "HDG") rate += 2.5;
  const total = area * rate;
  const low = Math.round(total * 0.92);
  const high = Math.round(total * 1.12);
  return [low, high];
}
function freightRange(zip) {
  const z = (zip || "").trim();
  const f = z[0];
  if (!f) return [700, 1100];
  if ("12".includes(f)) return [600, 900];
  if ("3456".includes(f)) return [700, 1100];
  return [800, 1200];
}
function autoBays(depth) {
  if (depth <= 14) return 1;
  if (depth <= 26) return 2;
  if (depth <= 34) return 3;
  return 4;
}
function chip(active) {
  return `px-4 py-2 rounded-xl border text-sm ${
    active ? "bg-neutral-900 text-white border-neutral-900" : "bg-white hover:bg-neutral-50 border-neutral-300"
  }`;
}
function readFromURL() {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const obj = {};
  for (const [k, v] of p.entries()) obj[k] = v;
  return obj;
}
function applyToURL(cfg) {
  const url = new URL(window.location.href);
  const p = url.searchParams;
  p.set("style", cfg.style);
  p.set("finish", cfg.finish);
  p.set("infill", cfg.infill);
  p.set("height", String(cfg.height));
  p.set("anchoring", cfg.anchoring);
  if (cfg.sizePreset && cfg.sizePreset !== "Custom") {
    p.set("size", cfg.sizePreset);
    p.delete("span");
    p.delete("depth");
  } else {
    p.set("size", "Custom");
    p.set("span", String(cfg.span));
    p.set("depth", String(cfg.depth));
  }
  url.search = p.toString();
  return url.toString();
}
// --------------------------------------------------------------

export default function Builder() {
  // minimal config state
  const [style, setStyle] = useState("Mono");
  const [sizePreset, setSizePreset] = useState("12x12");
  const [span, setSpan] = useState(12);
  const [depth, setDepth] = useState(12);
  const [height, setHeight] = useState(10);
  const [finish, setFinish] = useState("Black");
  const [infill, setInfill] = useState("None");
  const [anchoring, setAnchoring] = useState("Slab");

  // quote form
  const [zip, setZip] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cityState, setCityState] = useState("");
  const [usecase, setUsecase] = useState("");

  // viewer API exposed from the 3D component
  const [viewerAPI, setViewerAPI] = useState(null);

  // load from URL (once)
  useEffect(() => {
    const q = readFromURL();
    if (!q) return;

    if (q.style) setStyle(q.style);
    if (q.finish) setFinish(q.finish);
    if (q.infill) setInfill(q.infill);
    if (q.anchoring) setAnchoring(q.anchoring);
    if (q.size) {
      setSizePreset(q.size);
      if (q.size === "Custom") {
        if (q.span) setSpan(Number(q.span));
        if (q.depth) setDepth(Number(q.depth));
      }
    }
    if (q.height) setHeight(Number(q.height));
  }, []);

  // apply preset sizes
  useEffect(() => {
    const map = {
      "10x10": [10, 10],
      "12x12": [12, 12],
      "12x20": [12, 20],
      "20x20": [20, 20],
    };
    if (sizePreset !== "Custom") {
      const [s, d] = map[sizePreset] || [12, 12];
      setSpan(s);
      setDepth(d);
    }
  }, [sizePreset]);

  // guardrails
  const bays = useMemo(() => autoBays(depth), [depth]);
  useEffect(() => {
    const maxH = span >= 20 ? 11 : 12;
    if (height > maxH) setHeight(maxH);
  }, [span, height]);

  const config = { style, span, depth, height, bays, infill, finish, anchoring, sizePreset };
  const [budgetLow, budgetHigh] = estimateBudget(config);
  const [freightLow, freightHigh] = freightRange(zip);

  const formsEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ID
    ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
    : `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "office@yetiwelding.com"}`;

  // actions -----------------------------------------------------
  async function onShare() {
    try {
      const url = applyToURL(config);
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      alert("Could not copy link—your browser may block clipboard.");
    }
  }

  async function submit(e) {
    if (!formsEndpoint.startsWith("https://")) return; // mailto fallback
    e.preventDefault();
    let screenshot = "";
    try {
      screenshot = (await viewerAPI?.capture?.()) || "";
    } catch {}
    const payload = {
      name,
      email,
      phone,
      cityState,
      usecase,
      zip,
      config,
      price: { budgetLow, budgetHigh, freightLow, freightHigh },
      screenshot, // base64 JPEG data URL
    };
    fetch(formsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => alert("Thanks! We’ll reach out quickly."))
      .catch(() => alert("Sent. If you don't see a success email, feel free to call us as well."));
  }
  // -------------------------------------------------------------

  return (
    <Layout title="Builder – ShadeKits">
      <Head>
        <meta name="robots" content="index,follow" />
      </Head>

      {/* Hero header */}
      <div className="mt-6 rounded-2xl bg-neutral-900 text-white p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">BUILDER</h1>
        <p className="mt-2 text-sm opacity-90">
          Design a commercial-grade steel pergola in minutes. Live 3D preview, instant budget, ships nationwide.
        </p>
      </div>

      {/* Sticky option bar */}
      <div className="sticky top-14 z-30 mt-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Product */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Product</span>
            <button className={chip(style === "Mono")} onClick={() => setStyle("Mono")}>Freestanding Mono</button>
            <button className={chip(style === "Gable")} onClick={() => setStyle("Gable")}>Freestanding Gable</button>
            <button className={chip(style === "AttachedMono")} onClick={() => setStyle("AttachedMono")}>Attached Mono</button>
          </div>

          {/* Finish */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Finish</span>
            {["HDG", "Black", "White", "Bronze"].map((f) => (
              <button key={f} className={chip(finish === f)} onClick={() => setFinish(f)}>{f}</button>
            ))}
          </div>

          {/* Infill */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Infill</span>
            <button className={chip(infill === "None")} onClick={() => setInfill("None")}>None</button>
            <button className={chip(infill === "SlatsOpen")} onClick={() => setInfill("SlatsOpen")}>Slats (Open)</button>
            <button className={chip(infill === "SlatsMedium")} onClick={() => setInfill("SlatsMedium")}>Slats (Medium)</button>
            <button className={chip(infill === "SlatsTight")} onClick={() => setInfill("SlatsTight")}>Slats (Tight)</button>
          </div>

          {/* CTA + Share */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onShare}
              type="button"
              className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
              title="Copy a link to this exact build"
            >
              Share
            </button>
            <a href="#quote" className="rounded-xl bg-red-600 px-4 py-2 text-white text-sm font-semibold hover:bg-red-700">
              Request a Quote
            </a>
          </div>
        </div>
      </div>

      {/* Main three-column layout */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: quick size/height controls */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Size</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {["10x10", "12x12", "12x20", "20x20", "Custom"].map((p) => (
                <button key={p} className={chip(sizePreset === p)} onClick={() => setSizePreset(p)}>{p}</button>
              ))}
            </div>

            {sizePreset === "Custom" && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <label>Span (ft)</label>
                  <input type="number" className="w-24 rounded-md border px-2 py-1" min={10} max={20} value={span}
                    onChange={(e) => setSpan(Number(e.target.value))}/>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label>Depth (ft)</label>
                  <input type="number" className="w-24 rounded-md border px-2 py-1" min={10} max={40} value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}/>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold">Height</h3>
              <div className="mt-2 flex gap-2">
                {[8, 10, 12].map((h) => (
                  <button key={h} className={chip(height === h)} onClick={() => setHeight(h)}>{h}′</button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Anchoring</h3>
              <div className="mt-2 flex gap-2">
                {["Slab", "Footings"].map((a) => (
                  <button key={a} className={chip(anchoring === a)} onClick={() => setAnchoring(a)}>{a}</button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral-500">Posts modeled as 4×4 (4&quot; square). Rules auto-add bays based on depth.</p>
          </div>
        </div>

        {/* Center: 3D viewer + camera presets */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border bg-white p-3">
            <Viewer3D config={config} expose={setViewerAPI} />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                {style === "Mono" ? "MONO" : style === "Gable" ? "GABLE" : "ATTACHED MONO"} • {span}×{depth} ft • {bays} {bays === 1 ? "bay" : "bays"} • {height} ft
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" onClick={() => viewerAPI?.setView?.("front")}>Front</button>
                <button className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" onClick={() => viewerAPI?.setView?.("corner")}>Corner</button>
                <button className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" onClick={() => viewerAPI?.setView?.("top")}>Top</button>
                <button className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" onClick={() => viewerAPI?.setView?.("reset")}>Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: estimate + short form */}
        <div className="lg:col-span-3" id="quote">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Your Estimate</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-neutral-500">Budget Range</div>
                <div className="font-semibold">${budgetLow.toLocaleString()}–${budgetHigh.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-neutral-500">Freight Estimate</div>
                <div className="font-semibold">${freightLow}–${freightHigh}</div>
              </div>
            </div>
            <div className="mt-2 rounded-xl border p-3 text-xs text-neutral-600">
              Lead time: <strong>3–5 weeks</strong>. Includes pre-cut steel, hardware, anchors (as specified), finish schedule, and install guide.
            </div>

            <form className="mt-3 space-y-2" onSubmit={submit} action={formsEndpoint} method="POST">
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Name *" value={name} onChange={(e)=>setName(e.target.value)} required />
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email *" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="City, State" value={cityState} onChange={(e)=>setCityState(e.target.value)} />
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="ZIP (for freight estimate)" value={zip} onChange={(e)=>setZip(e.target.value.replace(/[^0-9]/g,''))} />
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Use Case (restaurant, park, pool, etc.)" value={usecase} onChange={(e)=>setUsecase(e.target.value)} />
              <button className="mt-1 w-full rounded-xl bg-red-600 px-4 py-2 text-white text-sm font-semibold hover:bg-red-700" type="submit">
                Request Concept & Price
              </button>
            </form>

            <a href="/custom" className="mt-2 inline-flex w-full items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">
              Prefer full custom?
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
