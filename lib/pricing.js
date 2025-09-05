// lib/pricing.js
/**
 * Lightweight pricing engine used by both the Builder (via usePricing)
 * and the older /configurator component (which imports computePrice directly).
 *
 * This is intentionally simple and deterministic. Tweak the rate constants
 * to tune the range you want to display.
 */

export function usd(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
}

function toKey(str = "") {
  return String(str).toLowerCase().replace(/[^a-z]/g, "");
}

function getInfillRates(infill) {
  const k = toKey(infill);
  if (k.includes("tight")) return [12, 16];   // $/sqft (low/high)
  if (k.includes("medium")) return [9, 12];
  if (k.includes("open")) return [6, 8];
  return [0, 0]; // none
}

function styleMultiplier(style) {
  const k = toKey(style);
  if (k.includes("gable")) return 1.10;       // gable ~ +10%
  if (k.includes("attached")) return 0.97;    // attached mono ~ -3%
  return 1.0;                                 // mono default
}

function finishMultiplier(finish) {
  const k = toKey(finish);
  if (k === "hdg") return 1.22;               // hot-dip galvanized ~ +22%
  if (k.includes("bronze")) return 1.04;      // powder bronze ~ +4%
  // black / white ~ baseline
  return 1.0;
}

function anchoringAdder(anchor) {
  const k = toKey(anchor);
  if (k.includes("foot")) return 800;         // allow for footing cages & extras
  return 0;                                   // slab included
}

function estimateFreight(area /* sqft */) {
  // Simple palletized LTL estimate based on area footprint
  const pallets = Math.max(1, Math.ceil(area / 120)); // ~120 sqft per pallet
  const low = 650 + pallets * 75;
  const high = 950 + pallets * 110;
  return { low, high, zone: "LTL", pallets, area };
}

function estimatePosts(span, depth) {
  // Basic rule-of-thumb for additional posts on larger spans/depths
  let posts = 4; // corners
  if (span > 18) posts += 2; // center line
  if (depth > 18) posts += 2;
  return posts;
}

/**
 * Core pricing function.
 * Returns numeric low/high budget and freight + a simple breakdown.
 */
export function computePrice(config = {}, zip = "") {
  const {
    style = "Mono",
    span = 12,
    depth = 12,
    height = 10,     // currently unused but reserved
    infill = "None",
    finish = "Black",
    anchor = "Slab",
    bays = 1,
  } = config;

  const area = Math.max(1, Number(span) * Number(depth));
  const posts = estimatePosts(span, depth);

  // Base frame rates ($/sqft). Tune to hit your target presented range.
  const frameRateLow = 22;
  const frameRateHigh = 28;

  // Infill rates ($/sqft)
  const [infillLowRate, infillHighRate] = getInfillRates(infill);

  // Multipliers
  const mStyle = styleMultiplier(style);
  const mFinish = finishMultiplier(finish);

  // Frame portion
  let frameLow = area * frameRateLow * mStyle * mFinish;
  let frameHigh = area * frameRateHigh * mStyle * mFinish;

  // Infill portion
  let infillLow = area * infillLowRate;
  let infillHigh = area * infillHighRate;

  // Anchoring
  const anch = anchoringAdder(anchor);

  const budgetLow = Math.round(frameLow + infillLow + anch);
  const budgetHigh = Math.round(frameHigh + infillHigh + anch);

  // Freight estimate (independent)
  const f = estimateFreight(area);
  const freightLow = Math.round(f.low);
  const freightHigh = Math.round(f.high);

  return {
    // headline
    budgetLow,
    budgetHigh,
    // freight
    freightLow,
    freightHigh,
    freightMeta: { zone: f.zone, pallets: f.pallets, area },
    // optional breakdown (rough split)
    breakdown: {
      frame: Math.round((frameLow + frameHigh) / 2),
      infill: Math.round((infillLow + infillHigh) / 2),
      anchoring: anch,
      posts,
    },
  };
}
