// lib/configRules.js
import { LIMITS, HEIGHTS, AVAILABILITY } from "../data/catalog";

/**
 * Decide # of bays from depth.
 *  - <=12' => 1 bay
 *  - <=20' => 2 bays
 *  - >20'  => 3 bays
 */
export function baysFromDepth(depthFt) {
  if (depthFt <= 12) return 1;
  if (depthFt <= 20) return 2;
  return 3;
}

/**
 * Normalize a builder config: apply guardrails, autocalc bays,
 * and return user-readable notes + flags.
 *
 * @param {object} cfg
 *   {
 *     style: "Mono" | "Gable" | "AttachedMono",
 *     span: number, depth: number, height: number, bays: number,
 *     infill: "None" | "SlatsOpen" | "SlatsMedium" | "SlatsTight",
 *     finish: "HDG" | "Black" | "White" | "Bronze",
 *     anchor: "Slab" | "Footings"
 *   }
 */
export function normalizeConfig(cfg) {
  const notes = [];
  const flags = { engineerReview: false };

  let {
    style = "Mono",
    span = 12,
    depth = 12,
    height = 10,
    bays = 1,
    infill = "None",
    finish = "Black",
    anchor = "Slab",
  } = cfg;

  // 1) Clamp span/depth to supported bounds (ft)
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const newSpan  = clamp(Number(span),  LIMITS.minSpan,  LIMITS.maxSpan);
  const newDepth = clamp(Number(depth), LIMITS.minDepth, LIMITS.maxDepth);
  if (newSpan !== span)  notes.push(`Span adjusted to ${newSpan} ft.`);
  if (newDepth !== depth) notes.push(`Depth adjusted to ${newDepth} ft.`);
  span = newSpan; depth = newDepth;

  // 2) Enforce supported heights
  if (!HEIGHTS.includes(height)) {
    height = 10;
    notes.push("Height normalized to 10 ft.");
  }

  // 3) Auto-bays from depth
  const autoBays = baysFromDepth(depth);
  if (autoBays !== bays) {
    notes.push(`Bays set to ${autoBays} based on ${depth} ft depth.`);
    bays = autoBays;
  }

  // 4) Availability: ensure finish/infill are allowed for the selected style
  const avail = AVAILABILITY[style] || { finishes: [], infill: [] };
  if (!avail.finishes.includes(finish)) {
    finish = avail.finishes[0];
    notes.push(`Finish adjusted to ${finish} for this product.`);
  }
  if (!avail.infill.includes(infill)) {
    infill = avail.infill[0];
    notes.push(`Infill adjusted to ${infill} for this product.`);
  }

  // 5) Basic engineer review flag (tune as needed)
  if (span > 18 || depth > 20 || height > 12) {
    flags.engineerReview = true;
  }

  const normalized = {
    ...cfg,
    style, span, depth, height, bays, infill, finish, anchor,
  };

  const changed = JSON.stringify(normalized) !== JSON.stringify(cfg);

  return { config: normalized, notes, flags, changed };
}
