// pages/builder.js
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";

// ⬇️ Lazy-load the 3D viewer on client only
const Viewer3D = dynamic(() => import("../components/Builder/Viewer3D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 520,
        display: "grid",
        placeItems: "center",
        borderRadius: 12,
        background: "#f7f8fa",
      }}
    >
      Loading 3D preview…
    </div>
  ),
});

// Small error boundary so we never hit the Vercel “client-side exception” page
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Unknown error" };
  }
  componentDidCatch(err, info) {
    // Optional: send to your logging here
    // console.error("3D Error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: 520,
            borderRadius: 12,
            background: "#fff4f4",
            border: "1px solid #ffd6d6",
            padding: 16,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              3D preview failed to load
            </div>
            <div style={{ fontSize: 14, color: "#7a3b3b" }}>
              {this.state.message}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#7a3b3b" }}>
              Try reloading the page. If it persists, we’ll take a look.
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BuilderPage() {
  // --- Minimal working state (match what Viewer3D expects) ---
  const [span, setSpan] = useState(12);     // feet (X)
  const [depth, setDepth] = useState(12);   // feet (Z)
  const [height, setHeight] = useState(10); // feet (Y)
  const [style, setStyle] = useState("FreestandingMono"); // or "AttachedMono"
  const [infill, setInfill] = useState("none"); // "none" | "open" | "medium" | "tight"
  const [finish, setFinish] = useState("Black"); // "Black" | "White" | "Bronze" | "HDG"

  const config = useMemo(
    () => ({ span, depth, height, bays: 1, style, infill, finish }),
    [span, depth, height, style, infill, finish]
  );

  return (
    <div style={{ padding: "24px 16px", maxWidth: 1220, margin: "0 auto" }}>
      <header
        style={{
          background: "#0d0f13",
          color: "white",
          borderRadius: 14,
          padding: "18px 18px",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.3 }}>
          BUILDER
        </div>
        <div style={{ opacity: 0.8, marginTop: 6, fontSize: 14 }}>
          Design a commercial-grade steel pergola in minutes. Live 3D preview,
          instant budget, ships nationwide.
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 340px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* -------------------------- Controls (left) -------------------------- */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #eee",
          }}
        >
          <Section title="Product">
            <PillBar
              value={style}
              onChange={setStyle}
              options={[
                ["FreestandingMono", "Freestanding Mono"],
                ["AttachedMono", "Attached Mono"],
              ]}
            />
          </Section>

          <Section title="Infill">
            <PillBar
              value={infill}
              onChange={setInfill}
              options={[
                ["none", "None"],
                ["open", "Slats (Open)"],
                ["medium", "Slats (Medium)"],
                ["tight", "Slats (Tight)"],
              ]}
            />
          </Section>

          <Section title="Size">
            <SimpleGrid>
              {[
                [10, 10],
                [12, 12],
                [12, 20],
              ].map(([w, d]) => (
                <button
                  key={`${w}x${d}`}
                  onClick={() => {
                    setSpan(w);
                    setDepth(d);
                  }}
                  className={btnClass(span === w && depth === d)}
                >
                  {w}×{d}
                </button>
              ))}
              <button
                onClick={() => {
                  setSpan(20);
                  setDepth(20);
                }}
                className={btnClass(span === 20 && depth === 20)}
              >
                20×20
              </button>
            </SimpleGrid>
          </Section>

          <Section title="Height">
            <PillBar
              value={height}
              onChange={setHeight}
              options={[
                [8, "8′"],
                [10, "10′"],
                [12, "12′"],
              ]}
            />
          </Section>

          <Section title="Finish">
            <PillBar
              value={finish}
              onChange={setFinish}
              options={[
                ["HDG", "HDG"],
                ["Black", "Black"],
                ["White", "White"],
                ["Bronze", "Bronze"],
              ]}
            />
          </Section>
        </div>

        {/* ---------------------------- 3D viewer ---------------------------- */}
        <div>
          <ErrorBoundary>
            <Viewer3D config={config} />
          </ErrorBoundary>
          <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            MONO • {span}×{depth} ft • 1 bay • {height} ft
          </div>
        </div>

        {/* ---------------------- Estimate (right side) ---------------------- */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #eee",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Your Estimate</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <InfoCard title="Budget Range" value="$4,800–$5,900" />
            <InfoCard title="Freight Estimate" value="$700–$1100" />
          </div>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              padding: 10,
              borderRadius: 10,
              fontSize: 13,
              color: "#334155",
              marginBottom: 12,
            }}
          >
            Lead time: <b>3–5 weeks</b>. Includes pre-cut steel, hardware,
            anchors (as specified), finish schedule, and install guide.
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Request sent!");
            }}
            style={{ display: "grid", gap: 8 }}
          >
            <input className="sk-input" placeholder="Name *" required />
            <input className="sk-input" placeholder="Email *" type="email" required />
            <input className="sk-input" placeholder="Phone" />
            <input className="sk-input" placeholder="City, State" />
            <input className="sk-input" placeholder="ZIP (for freight estimate)" />
            <input
              className="sk-input"
              placeholder="Use Case (restaurant, park, pool, etc.)"
            />
            <button className="sk-cta" type="submit">
              Request Concept & Price
            </button>
          </form>
        </div>
      </div>

      {/* Tiny inline styles for inputs/buttons (to avoid CSS dependencies) */}
      <style jsx>{`
        .sk-input {
          font-size: 14px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
        }
        .sk-input:focus {
          border-color: #cbd5e1;
        }
        .sk-cta {
          margin-top: 6px;
          padding: 10px 12px;
          border: 0;
          border-radius: 10px;
          background: #e11d48;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
        .sk-cta:hover {
          background: #be123c;
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- tiny UI helpers ---------------------------- */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function SimpleGrid({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {children}
    </div>
  );
}

function btnClass(active) {
  return [
    "sk-btn",
    active ? "sk-btn--active" : "",
  ].join(" ");
}

function PillBar({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(([val, label]) => (
        <button
          key={String(val)}
          onClick={() => onChange(val)}
          className={btnClass(value === val)}
        >
          {label}
        </button>
      ))}
      <style jsx>{`
        .sk-btn {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 13px;
          cursor: pointer;
        }
        .sk-btn--active {
          background: #0f172a;
          border-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
        display: "grid",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b" }}>{title}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
