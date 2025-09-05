// lib/freight.js

// Zone bands (low/high) before size/finish factors
const ZONE_BASE = {
  A: [650, 1000],  // East (0–2)
  B: [700, 1100],  // Southeast (3–4)
  C: [800, 1200],  // Midwest (5)
  D: [900, 1400],  // Mountain (6–7)
  E: [950, 1500],  // Interior West (8)
  F: [800, 1200],  // West Coast (9)
};

function zoneFromZip(zip) {
  if (!zip || String(zip).length < 1) return "B";
  const first = String(zip).trim()[0];
  if ("012".includes(first)) return "A";
  if ("34".includes(first)) return "B";
  if (first === "5") return "C";
  if ("67".includes(first)) return "D";
  if (first === "8") return "E";
  return "F";
}

function sizeFactor(areaSqft) {
  if (areaSqft < 150) return 0.9;
  if (areaSqft < 250) return 1.0;
  if (areaSqft < 400) return 1.1;
  return 1.25;
}

export function computeFreightRange(cfg, zip) {
  if (!zip || String(zip).length < 5) return null;

  const area = (Number(cfg.span || 12) * Number(cfg.depth || 12)) || 144;
  const zone = zoneFromZip(zip);
  const [baseLo, baseHi] = ZONE_BASE[zone] ?? [700, 1100];
  let lo = baseLo;
  let hi = baseHi;

  // size scaling
  const s = sizeFactor(area);
  lo *= s;
  hi *= s;

  // HDG is heavier / bulkier
  if (String(cfg.finish) === "HDG") {
    lo *= 1.1;
    hi *= 1.1;
  }

  lo = Math.round(lo);
  hi = Math.round(hi);
  return { low: lo, high: hi, zone, area };
}
