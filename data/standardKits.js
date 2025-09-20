// /data/standardKits.js
// Whitelist of kits that can be purchased directly.

export const STANDARD_KITS = [
  {
    slug: "patio-pro-12x12",
    name: "Patio Pro 12×12",
    config: { span: 12, depth: 12, height: 10, colorId: "black", roofDesignId: "palmleaf" },
    leadWeeks: [3, 5],
  },
  {
    slug: "patio-pro-12x16",
    name: "Patio Pro 12×16",
    config: { span: 12, depth: 16, height: 10, colorId: "black", roofDesignId: "palmleaf" },
    leadWeeks: [3, 5],
  },
  {
    slug: "patio-pro-12x20",
    name: "Patio Pro 12×20",
    config: { span: 12, depth: 20, height: 10, colorId: "black", roofDesignId: "palmleaf" },
    leadWeeks: [3, 5],
  },
];

// Helpers used by lib/buy.js
export function getKitBySlug(slug) {
  return STANDARD_KITS.find((k) => k.slug === slug);
}

function isClose(a, b) {
  return Math.abs((a ?? 0) - (b ?? 0)) < 1e-3;
}

// Compare only the keys we set on kits
export function isConfigEqual(a, b) {
  if (!a || !b) return false;
  return (
    isClose(a.span, b.span) &&
    isClose(a.depth, b.depth) &&
    isClose(a.height, b.height) &&
    String(a.colorId || "") === String(b.colorId || "") &&
    String(a.roofDesignId || "") === String(b.roofDesignId || "")
  );
}
