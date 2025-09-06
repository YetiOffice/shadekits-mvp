// lib/buy.js
import {
  STANDARD_KITS,
  getKitBySlug,
  isConfigEqual,
} from "../data/standardKits";

/**
 * Determine if a given configuration is eligible for direct purchase.
 * Match only on span, depth, and height; ignore color and roof design.
 */
export function buyEligibleForConfig(cfg) {
  const match = STANDARD_KITS.find(
    (k) =>
      Number(k.config.span) === Number(cfg.span) &&
      Number(k.config.depth) === Number(cfg.depth) &&
      Number(k.config.height) === Number(cfg.height)
  );
  return match ? { eligible: true, kit: match } : { eligible: false, kit: null };
}

export function configFromSlug(slug) {
  const k = getKitBySlug(slug);
  return k ? k.config : null;
}

export function leadWeeksForSlug(slug) {
  const k = getKitBySlug(slug);
  return k?.leadWeeks || [3, 5];
}

export function kitName(slug) {
  const k = getKitBySlug(slug);
  return k?.name || "Shade Kit";
}

// re-export isConfigEqual if you still need it elsewhere
export { isConfigEqual };
