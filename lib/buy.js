import { STANDARD_KITS } from "../data/standardKits";

/**
 * Determine if a given configuration is eligible for direct purchase.
 * We match only on span, depth, and height; color and roof design
 * are ignored for eligibility.
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

// The rest of the exports remain unchanged
export function configFromSlug(slug) { … }
export function leadWeeksForSlug(slug) { … }
export function kitName(slug) { … }
