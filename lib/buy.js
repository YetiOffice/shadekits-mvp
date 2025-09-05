// /lib/buy.js
import { findMatchingKit, getKitBySlug, isConfigEqual } from "../data/standardKits";

export function buyEligibleForConfig(cfg) {
  const match = findMatchingKit(cfg);
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

export { isConfigEqual }; // re-export if you need it elsewhere
