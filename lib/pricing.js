// lib/pricing.js

// ---- Tunables (safe defaults) ----------------------------------------------
const BASE_FRAME_RATE_PER_LF = 85;       // $/linear-ft of perimeter beams (powder-coated black)
const BAYS_COMPLEXITY_PER_EXTRA = 0.06;  // +6% per extra bay for joints, hardware, labor
const HEIGHT_UPLIFT_PER_FT_OVER_10 = 0.06; // +6% per foot over 10'
const FINISH_MULT = { Black: 1.0, White: 1.08, Bronze: 1.08, HDG: 1.25 };

const INFILL_RATE_PER_SQFT = {
  None: 0,
  SlatsOpen: 6,
  SlatsMedium: 10,
  SlatsTight: 14,
};

// style complexity (beams, cuts, bracing)
const STYLE_MULT = {
  Mono: 1.0,
  Gable: 1.12,
  AttachedMono: 0.92,
};

// anchoring hardware allowance per post (very rough)
const ANCHOR_PER_POST = {
  Slab: 150,
  Footings: 400,
};

// Guard for odd id spellings; accepts label too
function normalizeInfillId(infill) {
  const s = String(infill).toLowerCase();
  if (s.includes("open")) return "SlatsOpen";
  if (s.includes("medium")) return "SlatsMedium";
  if (s.includes("tight")) return "SlatsTight";
  if (s === "none") return "None";
  return infill;
}

function postsForConfig(cfg) {
  // freestanding mono/gable: 4 + 2 per extra bay
  if (cfg.style === "Mono" || cfg.style === "Gable") {
    return 4 + Math.max(0, (cfg.bays || 1) - 1) * 2;
  }
  // attached mono: 2 + 1 per extra bay
  if (cfg.style === "AttachedMono") {
    return 2 + Math.max(0, (cfg.bays || 1) - 1) * 1;
  }
  return 4;
}

// Simple perimeter of the plan (used to estimate main beam steel/fab)
function perimeterLF(cfg) {
  return 2 * (cfg.span + cfg.depth);
}

function planAreaSqft(cfg) {
  return cfg.span * cfg.depth;
}

// ----- Public: computeBudgetRange(cfg) ---------------------------------------
export function computeBudgetRange(cfg) {
  const span = Number(cfg.span || 12);
  const depth = Number(cfg.depth || 12);
  const bays = Math.max(1, Number(cfg.bays || 1));
  const height = Number(cfg.height || 10);
  const style = cfg.style || "Mono";
  const finish = cfg.finish || "Black";
  const anchor = cfg.anchor || "Slab";
  const infillId = normalizeInfillId(cfg.infill || "None");

  // frame perimeter cost (powder black baseline)
  const perLF = BASE_FRAME_RATE_PER_LF;
  let frame = perimeterLF({ span, depth }) * perLF;

  // style complexity
  frame *= STYLE_MULT[style] ?? 1.0;

  // height uplift
  if (height > 10) frame *= 1 + (height - 10) * HEIGHT_UPLIFT_PER_FT_OVER_10;

  // bays complexity
  if (bays > 1) frame *= 1 + (bays - 1) * BAYS_COMPLEXITY_PER_EXTRA;

  // finish multiplier
  frame *= FINISH_MULT[finish] ?? 1.0;

  // infill (priced per sq-ft of plan)
  const infillRate = INFILL_RATE_PER_SQFT[infillId] ?? 0;
  const infillCost = planAreaSqft({ span, depth }) * infillRate;

  // anchoring allowance
  const posts = postsForConfig({ style, bays });
  const anchorCost = posts * (ANCHOR_PER_POST[anchor] ?? 0);

  // subtotal and range (±8% spread)
  const estimate = frame + infillCost + anchorCost;
  const low = Math.round(estimate * 0.92);
  const high = Math.round(estimate * 1.12);

  return {
    low,
    high,
    breakdown: {
      frame: Math.round(frame),
      infill: Math.round(infillCost),
      anchoring: Math.round(anchorCost),
      posts,
    },
  };
}

// Simple helper if you need USD strings elsewhere
export function usd(n) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
